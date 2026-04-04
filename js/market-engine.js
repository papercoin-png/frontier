// js/market-engine.js - Core Trading Engine for Element Marketplace
// Handles order matching, price discovery, and market operations
// FIXED: Market orders now execute against actual order book, not theoretical prices
// FIXED: Unlimited selling exploit closed
// FIXED: Proper partial fills and liquidity checks
// FIXED: Return totalCost consistently for both buy and sell orders
// UPDATED: Removed arbitrary player order limits
// UPDATED: Added market maker liquidity on startup
// UPDATED: Added emergency liquidity fallback when orders are missing
// UPDATED: Throttled error logging to reduce console spam
// UPDATED: Added order pruning for non-competitive orders
// UPDATED: Now uses elements-data.js as the single source of truth for element data
// APPROVED CHANGE: Added excess fill logic for market orders - fills remaining quantity at 50% of lowest bid (sell) or 150% of highest ask (buy)

import { ELEMENTS, getElementByName, getElementValue, getElementIcon, getElementRarity } from './elements-data.js';

// Import market-dynamics
import marketDynamics from './market-dynamics.js';
const { 
    getCurrentPrices, 
    getBidPrice, 
    getAskPrice, 
    recordTrade,
    updatePrices,
    getVolumeLast24h
} = marketDynamics;

import { 
    getNPCOrdersForElement, 
    getNPCOrders,
    cancelTraderOrder,
    updateNPCTraderAfterTrade 
} from './npc-traders.js';

// Import IndexedDB functions
import { 
    dbLoadMarketOrders, 
    dbSaveMarketOrders,
    dbAddTrade,
    dbGetRecentTrades,
    dbAddOrderHistory,
    dbGetUserOrderHistory,
    dbLoadMarketPrices,
    dbSaveMarketPrices
} from './db.js';

// ===== MARKET ENGINE CONFIGURATION =====

const ENGINE_CONFIG = {
    // Player orders: NO LIMIT - players can place unlimited orders
    MAX_ORDERS_PER_USER: Infinity,
    MAX_ORDERS_PER_NPC: 10,
    ORDER_EXPIRY_HOURS: 72,
    MIN_ORDER_QUANTITY: 1,
    MAX_ORDER_QUANTITY: 10000,
    FEE_PERCENT: 0.01,
    MATCHING_INTERVAL: 5000,
    PRICE_IMPACT_FACTOR: 0.1,
    ORDER_BOOK_DEPTH: 50,  // Increased from 20 to show more orders
    MAX_SPREAD_MULTIPLIER: 5,
    INCLUDE_NPC_ORDERS: true,
    SHOW_NPC_NAMES: true,
    NPC_ORDER_PREFIX: 'npc_',
    MAX_MATCHED_TRADES: 200,
    MAX_ORDER_HISTORY: 500,
    MAX_ORDERS_PER_ELEMENT: Infinity,  // No per-element limit for players
    CLEANUP_ON_LOAD: true,
    
    // Market maker configuration
    MARKET_MAKER_SPREAD: 0.20,  // 20% spread for liquidity
    MARKET_MAKER_QUANTITY: 1000,  // Default quantity per order
    EMERGENCY_QUANTITY: 500,  // Emergency liquidity quantity
    PRUNE_NON_COMPETITIVE: true,  // Remove orders that won't execute
    PRUNE_AGE_HOURS: 24,  // Remove stale orders after 24 hours
    
    // APPROVED: Excess fill penalty (50% penalty for sells, 50% premium for buys)
    EXCESS_FILL_PENALTY: 0.5  // 50% of lowest bid for sells, 150% of highest ask for buys
};

// Throttling for error logging
let lastErrorLog = {};
const ERROR_LOG_INTERVAL = 60000; // 1 minute

// ===== ORDER TYPES =====

export const ORDER_TYPES = {
    MARKET: 'market',
    LIMIT: 'limit',
    STOP: 'stop',
    STOP_LIMIT: 'stop_limit'
};

// ===== ORDER SIDES =====

export const ORDER_SIDES = {
    BUY: 'buy',
    SELL: 'sell'
};

// ===== ORDER STATUS =====

export const ORDER_STATUS = {
    ACTIVE: 'active',
    PARTIAL: 'partial',
    FILLED: 'filled',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
    REJECTED: 'rejected'
};

// ===== IN-MEMORY CACHE =====

let buyOrdersCache = {};
let sellOrdersCache = {};
let userOrdersCache = {};
let marketStatsCache = {};

// ===== HELPER FUNCTIONS =====

async function reloadOrderCache() {
    try {
        const buyOrders = await dbLoadMarketOrders('buy_orders');
        const sellOrders = await dbLoadMarketOrders('sell_orders');
        
        if (buyOrders && typeof buyOrders === 'object') {
            buyOrdersCache = buyOrders;
        } else {
            buyOrdersCache = {};
        }
        
        if (sellOrders && typeof sellOrders === 'object') {
            sellOrdersCache = sellOrders;
        } else {
            sellOrdersCache = {};
        }
        
        console.log('🔄 Order cache reloaded');
    } catch (error) {
        console.error('Error reloading cache:', error);
    }
}

// ===== EMERGENCY LIQUIDITY FALLBACK =====

/**
 * Add emergency liquidity for a specific element when no orders exist
 * @param {string} element - Element name
 * @param {string} side - 'buy' or 'sell' (what the trader is trying to do)
 * @returns {Promise<boolean>} True if liquidity was added
 */
async function ensureElementLiquidity(element, side) {
    const currentBuys = buyOrdersCache[element] || [];
    const currentSells = sellOrdersCache[element] || [];
    
    // Check if we actually need liquidity
    const needsLiquidity = (side === ORDER_SIDES.BUY && currentSells.length === 0) ||
                           (side === ORDER_SIDES.SELL && currentBuys.length === 0);
    
    if (!needsLiquidity) {
        return false;
    }
    
    // Throttle emergency liquidity logs to avoid spam
    const logKey = `emergency_${element}_${side}`;
    const now = Date.now();
    if (!lastErrorLog[logKey] || (now - lastErrorLog[logKey]) > ERROR_LOG_INTERVAL) {
        console.log(`🔧 Adding emergency liquidity for ${element} (${side})`);
        lastErrorLog[logKey] = now;
    }
    
    const elementData = getElementByName(element);
    if (!elementData) return false;
    
    const basePrice = elementData.value || 100;
    let ordersAdded = false;
    
    // If trying to SELL, need BUY orders (bids) in the market
    if (side === ORDER_SIDES.SELL && currentBuys.length === 0) {
        const buyPrice = Math.floor(basePrice * (1 - ENGINE_CONFIG.MARKET_MAKER_SPREAD));
        const buyOrder = {
            id: `emergency_buy_${element}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            userId: 'market_maker',
            playerName: 'Market Maker',
            element: element,
            side: ORDER_SIDES.BUY,
            type: ORDER_TYPES.LIMIT,
            price: Math.max(1, buyPrice),
            originalQuantity: ENGINE_CONFIG.EMERGENCY_QUANTITY,
            remainingQuantity: ENGINE_CONFIG.EMERGENCY_QUANTITY,
            filledQuantity: 0,
            status: ORDER_STATUS.ACTIVE,
            createdAt: Date.now(),
            expiresAt: Date.now() + (12 * 60 * 60 * 1000), // 12 hours for emergency orders
            trades: [],
            isNPC: true,
            traderName: 'Market Maker'
        };
        
        if (!buyOrdersCache[element]) buyOrdersCache[element] = [];
        buyOrdersCache[element].push(buyOrder);
        buyOrdersCache[element].sort((a, b) => b.price - a.price);
        ordersAdded = true;
    }
    
    // If trying to BUY, need SELL orders (asks) in the market
    if (side === ORDER_SIDES.BUY && currentSells.length === 0) {
        const sellPrice = Math.ceil(basePrice * (1 + ENGINE_CONFIG.MARKET_MAKER_SPREAD));
        const sellOrder = {
            id: `emergency_sell_${element}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            userId: 'market_maker',
            playerName: 'Market Maker',
            element: element,
            side: ORDER_SIDES.SELL,
            type: ORDER_TYPES.LIMIT,
            price: sellPrice,
            originalQuantity: ENGINE_CONFIG.EMERGENCY_QUANTITY,
            remainingQuantity: ENGINE_CONFIG.EMERGENCY_QUANTITY,
            filledQuantity: 0,
            status: ORDER_STATUS.ACTIVE,
            createdAt: Date.now(),
            expiresAt: Date.now() + (12 * 60 * 60 * 1000), // 12 hours for emergency orders
            trades: [],
            isNPC: true,
            traderName: 'Market Maker'
        };
        
        if (!sellOrdersCache[element]) sellOrdersCache[element] = [];
        sellOrdersCache[element].push(sellOrder);
        sellOrdersCache[element].sort((a, b) => a.price - b.price);
        ordersAdded = true;
    }
    
    if (ordersAdded) {
        // Save the emergency orders
        await dbSaveMarketOrders(buyOrdersCache, 'buy_orders');
        await dbSaveMarketOrders(sellOrdersCache, 'sell_orders');
        
        console.log(`✅ Added emergency liquidity for ${element} (${side})`);
    }
    
    return ordersAdded;
}

// ===== MARKET MAKER LIQUIDITY =====

/**
 * Ensure market has liquidity by creating market maker orders if none exist
 */
async function ensureMarketLiquidity() {
    console.log('🔧 Checking market liquidity...');
    
    // Check if market already has orders
    let hasOrders = false;
    for (const element of ELEMENTS) {
        const sells = sellOrdersCache[element.name] || [];
        const buys = buyOrdersCache[element.name] || [];
        if (sells.length > 0 || buys.length > 0) {
            hasOrders = true;
            break;
        }
    }
    
    if (hasOrders) {
        console.log('✅ Market already has liquidity');
        return;
    }
    
    console.log('🔄 Adding market maker orders for liquidity...');
    
    let ordersAdded = 0;
    
    for (const element of ELEMENTS) {
        const elementName = element.name;
        const basePrice = element.value || 100;
        
        // Add buy orders (bids) at 20% below market
        const buyPrice = Math.floor(basePrice * (1 - ENGINE_CONFIG.MARKET_MAKER_SPREAD / 2));
        const buyOrder = {
            id: `mm_buy_${elementName}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            userId: 'market_maker',
            playerName: 'Market Maker',
            element: elementName,
            side: ORDER_SIDES.BUY,
            type: ORDER_TYPES.LIMIT,
            price: Math.max(1, buyPrice),
            originalQuantity: ENGINE_CONFIG.MARKET_MAKER_QUANTITY,
            remainingQuantity: ENGINE_CONFIG.MARKET_MAKER_QUANTITY,
            filledQuantity: 0,
            status: ORDER_STATUS.ACTIVE,
            createdAt: Date.now(),
            expiresAt: Date.now() + (ENGINE_CONFIG.ORDER_EXPIRY_HOURS * 60 * 60 * 1000),
            trades: [],
            isNPC: true,
            traderName: 'Market Maker'
        };
        
        // Add sell orders (asks) at 20% above market
        const sellPrice = Math.ceil(basePrice * (1 + ENGINE_CONFIG.MARKET_MAKER_SPREAD / 2));
        const sellOrder = {
            id: `mm_sell_${elementName}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            userId: 'market_maker',
            playerName: 'Market Maker',
            element: elementName,
            side: ORDER_SIDES.SELL,
            type: ORDER_TYPES.LIMIT,
            price: sellPrice,
            originalQuantity: ENGINE_CONFIG.MARKET_MAKER_QUANTITY,
            remainingQuantity: ENGINE_CONFIG.MARKET_MAKER_QUANTITY,
            filledQuantity: 0,
            status: ORDER_STATUS.ACTIVE,
            createdAt: Date.now(),
            expiresAt: Date.now() + (ENGINE_CONFIG.ORDER_EXPIRY_HOURS * 60 * 60 * 1000),
            trades: [],
            isNPC: true,
            traderName: 'Market Maker'
        };
        
        // Initialize arrays if needed
        if (!buyOrdersCache[elementName]) buyOrdersCache[elementName] = [];
        if (!sellOrdersCache[elementName]) sellOrdersCache[elementName] = [];
        
        buyOrdersCache[elementName].push(buyOrder);
        sellOrdersCache[elementName].push(sellOrder);
        
        // Sort orders
        buyOrdersCache[elementName].sort((a, b) => b.price - a.price);
        sellOrdersCache[elementName].sort((a, b) => a.price - b.price);
        
        ordersAdded += 2;
    }
    
    // Save market maker orders
    await dbSaveMarketOrders(buyOrdersCache, 'buy_orders');
    await dbSaveMarketOrders(sellOrdersCache, 'sell_orders');
    
    console.log(`✅ Added ${ordersAdded} market maker orders (2 per element)`);
}

/**
 * Prune non-competitive orders that will never execute
 */
async function pruneNonCompetitiveOrders() {
    if (!ENGINE_CONFIG.PRUNE_NON_COMPETITIVE) return;
    
    let prunedCount = 0;
    const cutoffTime = Date.now() - (ENGINE_CONFIG.PRUNE_AGE_HOURS * 60 * 60 * 1000);
    
    for (const element of Object.keys(buyOrdersCache)) {
        const sells = sellOrdersCache[element] || [];
        const bestAsk = sells.length > 0 ? Math.min(...sells.map(s => s.price)) : Infinity;
        
        // Remove buy orders that are below best ask by a significant margin
        const originalLength = buyOrdersCache[element].length;
        buyOrdersCache[element] = buyOrdersCache[element].filter(order => {
            // Keep market maker orders
            if (order.userId === 'market_maker') return true;
            // Keep recent orders
            if (order.createdAt > cutoffTime) return true;
            // Keep orders that could potentially execute
            if (bestAsk !== Infinity && order.price >= bestAsk * 0.95) return true;
            // Remove stale orders
            return false;
        });
        prunedCount += originalLength - buyOrdersCache[element].length;
    }
    
    for (const element of Object.keys(sellOrdersCache)) {
        const buys = buyOrdersCache[element] || [];
        const bestBid = buys.length > 0 ? Math.max(...buys.map(b => b.price)) : 0;
        
        // Remove sell orders that are above best bid by a significant margin
        const originalLength = sellOrdersCache[element].length;
        sellOrdersCache[element] = sellOrdersCache[element].filter(order => {
            // Keep market maker orders
            if (order.userId === 'market_maker') return true;
            // Keep recent orders
            if (order.createdAt > cutoffTime) return true;
            // Keep orders that could potentially execute
            if (bestBid > 0 && order.price <= bestBid * 1.05) return true;
            // Remove stale orders
            return false;
        });
        prunedCount += originalLength - sellOrdersCache[element].length;
    }
    
    if (prunedCount > 0) {
        console.log(`🧹 Pruned ${prunedCount} non-competitive orders`);
        await dbSaveMarketOrders(buyOrdersCache, 'buy_orders');
        await dbSaveMarketOrders(sellOrdersCache, 'sell_orders');
    }
}

// ===== INITIALIZATION =====

export async function initializeMarketEngine() {
    console.log('🔄 Initializing market engine with IndexedDB...');
    
    try {
        const buyOrders = await dbLoadMarketOrders('buy_orders');
        if (buyOrders && Object.keys(buyOrders).length > 0) {
            buyOrdersCache = buyOrders;
        } else {
            buyOrdersCache = {};
            await dbSaveMarketOrders({}, 'buy_orders');
        }
        
        const sellOrders = await dbLoadMarketOrders('sell_orders');
        if (sellOrders && Object.keys(sellOrders).length > 0) {
            sellOrdersCache = sellOrders;
        } else {
            sellOrdersCache = {};
            await dbSaveMarketOrders({}, 'sell_orders');
        }
        
        const userOrders = await dbLoadMarketOrders('user_orders');
        if (userOrders && Object.keys(userOrders).length > 0) {
            userOrdersCache = userOrders;
        } else {
            userOrdersCache = {};
            await dbSaveMarketOrders({}, 'user_orders');
        }
        
        const stats = await dbLoadMarketOrders('market_stats');
        if (stats) {
            marketStatsCache = stats;
        } else {
            marketStatsCache = { totalVolume: 0, totalTrades: 0, lastUpdate: Date.now() };
            await dbSaveMarketOrders(marketStatsCache, 'market_stats');
        }
        
        // Ensure market has liquidity
        await ensureMarketLiquidity();
        
        // Prune non-competitive orders
        await pruneNonCompetitiveOrders();
        
        console.log('✅ Market engine initialized with IndexedDB');
        startMatchingEngine();
        
    } catch (error) {
        console.error('Error initializing market engine:', error);
    }
}

// ===== ORDER MANAGEMENT =====

export async function createOrder(orderData) {
    try {
        if (!orderData.userId) throw new Error('User ID required');
        if (!orderData.element) throw new Error('Element required');
        if (!orderData.side) throw new Error('Order side required');
        if (!orderData.type) throw new Error('Order type required');
        
        const quantity = Number(orderData.quantity);
        if (isNaN(quantity) || quantity <= 0) throw new Error('Valid quantity required');
        
        const element = getElementByName(orderData.element);
        if (!element) throw new Error('Element not found');
        
        const isNPC = orderData.userId.startsWith('npc_') || orderData.isNPC === true;
        
        // NO PLAYER ORDER LIMIT - removed the check for players
        // Only enforce limits for NPCs
        if (isNPC) {
            const npcOrders = await getNPCOrders();
            const npcOrderCount = npcOrders.filter(o => o.traderId === orderData.userId).length;
            if (npcOrderCount >= ENGINE_CONFIG.MAX_ORDERS_PER_NPC) {
                throw new Error(`Maximum NPC orders (${ENGINE_CONFIG.MAX_ORDERS_PER_NPC}) reached`);
            }
        }
        
        if (quantity < ENGINE_CONFIG.MIN_ORDER_QUANTITY) {
            throw new Error(`Minimum order quantity is ${ENGINE_CONFIG.MIN_ORDER_QUANTITY}`);
        }
        if (quantity > ENGINE_CONFIG.MAX_ORDER_QUANTITY) {
            throw new Error(`Maximum order quantity is ${ENGINE_CONFIG.MAX_ORDER_QUANTITY}`);
        }
        
        if (orderData.type === ORDER_TYPES.LIMIT && (!orderData.price || orderData.price <= 0)) {
            throw new Error('Valid price required for limit orders');
        }
        
        const order = {
            id: generateOrderId(),
            userId: orderData.userId,
            playerName: orderData.playerName || (isNPC ? orderData.traderName : 'Voidfarer'),
            element: orderData.element,
            side: orderData.side,
            type: orderData.type,
            price: orderData.price || null,
            stopPrice: orderData.stopPrice || null,
            originalQuantity: quantity,
            remainingQuantity: quantity,
            filledQuantity: 0,
            status: ORDER_STATUS.ACTIVE,
            createdAt: Date.now(),
            expiresAt: Date.now() + (ENGINE_CONFIG.ORDER_EXPIRY_HOURS * 60 * 60 * 1000),
            trades: [],
            isNPC: isNPC,
            traderName: orderData.traderName || (isNPC ? 'NPC Trader' : null)
        };
        
        if (order.type === ORDER_TYPES.MARKET) {
            return await executeMarketOrder(order);
        }
        
        if (order.type === ORDER_TYPES.LIMIT) {
            await addToOrderBook(order);
        }
        
        if (order.type === ORDER_TYPES.STOP || order.type === ORDER_TYPES.STOP_LIMIT) {
            await addStopOrder(order);
        }
        
        if (!isNPC) {
            await saveUserOrder(order);
        }
        
        await recordOrderHistory(order, 'created');
        
        return { success: true, order };
        
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Execute a market order against actual order book
 * APPROVED CHANGE: Added excess fill logic - fills remaining quantity at penalty price
 */
async function executeMarketOrder(order) {
    try {
        let quantity = order.originalQuantity || order.remainingQuantity || order.quantity;
        quantity = Number(quantity);
        
        if (isNaN(quantity) || quantity <= 0) {
            throw new Error('Invalid quantity');
        }
        
        // ===== BUY MARKET ORDER =====
        // Finds the best ASK orders (sell orders) and fills against them
        if (order.side === ORDER_SIDES.BUY) {
            let sellOrders = sellOrdersCache[order.element] || [];
            let activeSells = sellOrders.filter(o => 
                o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL
            ).sort((a, b) => a.price - b.price); // Sort by price ascending (cheapest first)
            
            // If no sell orders, try to add emergency liquidity
            if (activeSells.length === 0) {
                const added = await ensureElementLiquidity(order.element, ORDER_SIDES.BUY);
                if (added) {
                    await reloadOrderCache();
                    sellOrders = sellOrdersCache[order.element] || [];
                    activeSells = sellOrders.filter(o => 
                        o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL
                    ).sort((a, b) => a.price - b.price);
                }
            }
            
            let remainingToBuy = quantity;
            let totalCost = 0;
            let filledQuantity = 0;
            let lastExecutionPrice = activeSells.length > 0 ? activeSells[0].price : 0;
            const matchedOrders = [];
            
            // Fill against available sell orders
            for (let i = 0; i < activeSells.length && remainingToBuy > 0; i++) {
                const sell = activeSells[i];
                const matchQuantity = Math.min(remainingToBuy, sell.remainingQuantity);
                const matchPrice = sell.price;
                const matchTotal = matchQuantity * matchPrice;
                
                totalCost += matchTotal;
                remainingToBuy -= matchQuantity;
                filledQuantity += matchQuantity;
                lastExecutionPrice = matchPrice;
                
                // Update the sell order
                sell.filledQuantity += matchQuantity;
                sell.remainingQuantity -= matchQuantity;
                
                if (sell.remainingQuantity === 0) {
                    sell.status = ORDER_STATUS.FILLED;
                } else {
                    sell.status = ORDER_STATUS.PARTIAL;
                }
                
                matchedOrders.push({
                    orderId: sell.id,
                    userId: sell.userId,
                    price: matchPrice,
                    quantity: matchQuantity,
                    total: matchTotal,
                    isNPC: sell.isNPC
                });
                
                // Save updated sell order
                if (!sell.isNPC) {
                    await saveUserOrder(sell);
                }
            }
            
            // APPROVED CHANGE: Handle excess quantity that couldn't be filled by market orders
            if (remainingToBuy > 0) {
                // Get the highest ask price from available orders, or use base price
                let highestAsk = 0;
                if (activeSells.length > 0) {
                    highestAsk = Math.max(...activeSells.map(s => s.price));
                } else {
                    const elementData = getElementByName(order.element);
                    highestAsk = elementData ? elementData.value || 100 : 100;
                }
                
                // Calculate penalty price: 150% of highest ask (50% premium)
                const penaltyPrice = Math.ceil(highestAsk * (1 + ENGINE_CONFIG.EXCESS_FILL_PENALTY));
                const excessTotal = remainingToBuy * penaltyPrice;
                
                totalCost += excessTotal;
                filledQuantity += remainingToBuy;
                lastExecutionPrice = penaltyPrice;
                
                matchedOrders.push({
                    orderId: 'excess_fill',
                    userId: 'market_maker',
                    price: penaltyPrice,
                    quantity: remainingToBuy,
                    total: excessTotal,
                    isNPC: true,
                    isExcessFill: true,
                    penaltyApplied: true
                });
                
                console.log(`⚠️ Excess buy fill: ${remainingToBuy} ${order.element} at ${penaltyPrice}⭐ (150% of ${highestAsk}⭐)`);
                remainingToBuy = 0;
            }
            
            if (filledQuantity === 0) {
                throw new Error('No sellers available');
            }
            
            const fee = totalCost * ENGINE_CONFIG.FEE_PERCENT;
            const orderStatus = ORDER_STATUS.FILLED; // Always fully filled now
            
            // Update order
            order.status = orderStatus;
            order.filledQuantity = filledQuantity;
            order.remainingQuantity = 0;
            order.executionPrice = lastExecutionPrice;
            order.fee = fee;
            order.executedAt = Date.now();
            order.matchedOrders = matchedOrders;
            order.hasExcessFill = matchedOrders.some(m => m.isExcessFill);
            
            // Create trade record
            const trade = {
                id: generateTradeId(),
                orderId: order.id,
                userId: order.userId,
                playerName: order.playerName,
                element: order.element,
                side: order.side,
                quantity: filledQuantity,
                price: totalCost / filledQuantity, // Average price
                total: totalCost,
                fee: fee,
                timestamp: Date.now(),
                isNPC: order.isNPC,
                matchedOrders: matchedOrders,
                hasExcessFill: order.hasExcessFill
            };
            
            recordTrade(order.element, filledQuantity, order.side);
            await addToMatchedTrades(trade);
            await recordOrderHistory(order, 'filled');
            
            if (!order.isNPC) {
                await saveUserOrder(order);
            }
            
            await updateMarketStats(filledQuantity, totalCost);
            
            // Save updated order books
            await dbSaveMarketOrders(buyOrdersCache, 'buy_orders');
            await dbSaveMarketOrders(sellOrdersCache, 'sell_orders');
            await reloadOrderCache();
            
            return { 
                success: true, 
                order,
                trade,
                executionPrice: lastExecutionPrice,
                averagePrice: totalCost / filledQuantity,
                totalCost,
                fee,
                filledQuantity,
                remainingQuantity: 0,
                partiallyFilled: false,
                hasExcessFill: order.hasExcessFill,
                excessFillQuantity: order.hasExcessFill ? (matchedOrders.find(m => m.isExcessFill)?.quantity || 0) : 0
            };
            
        // ===== SELL MARKET ORDER =====
        // Finds the best BID orders (buy orders) and fills against them
        } else {
            let buyOrders = buyOrdersCache[order.element] || [];
            let activeBuys = buyOrders.filter(o => 
                o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL
            ).sort((a, b) => b.price - a.price); // Sort by price descending (highest bid first)
            
            // If no buy orders, try to add emergency liquidity
            if (activeBuys.length === 0) {
                const added = await ensureElementLiquidity(order.element, ORDER_SIDES.SELL);
                if (added) {
                    await reloadOrderCache();
                    buyOrders = buyOrdersCache[order.element] || [];
                    activeBuys = buyOrders.filter(o => 
                        o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL
                    ).sort((a, b) => b.price - a.price);
                }
            }
            
            let remainingToSell = quantity;
            let totalReceived = 0;
            let filledQuantity = 0;
            let lastExecutionPrice = activeBuys.length > 0 ? activeBuys[0].price : 0;
            const matchedOrders = [];
            
            // Fill against available buy orders
            for (let i = 0; i < activeBuys.length && remainingToSell > 0; i++) {
                const buy = activeBuys[i];
                const matchQuantity = Math.min(remainingToSell, buy.remainingQuantity);
                const matchPrice = buy.price;
                const matchTotal = matchQuantity * matchPrice;
                
                totalReceived += matchTotal;
                remainingToSell -= matchQuantity;
                filledQuantity += matchQuantity;
                lastExecutionPrice = matchPrice;
                
                // Update the buy order
                buy.filledQuantity += matchQuantity;
                buy.remainingQuantity -= matchQuantity;
                
                if (buy.remainingQuantity === 0) {
                    buy.status = ORDER_STATUS.FILLED;
                } else {
                    buy.status = ORDER_STATUS.PARTIAL;
                }
                
                matchedOrders.push({
                    orderId: buy.id,
                    userId: buy.userId,
                    price: matchPrice,
                    quantity: matchQuantity,
                    total: matchTotal,
                    isNPC: buy.isNPC
                });
                
                // Save updated buy order
                if (!buy.isNPC) {
                    await saveUserOrder(buy);
                }
            }
            
            // APPROVED CHANGE: Handle excess quantity that couldn't be filled by market orders
            if (remainingToSell > 0) {
                // Get the lowest bid price from available orders, or use base price
                let lowestBid = 0;
                if (activeBuys.length > 0) {
                    lowestBid = Math.min(...activeBuys.map(b => b.price));
                } else {
                    const elementData = getElementByName(order.element);
                    lowestBid = elementData ? elementData.value || 100 : 100;
                }
                
                // Calculate penalty price: 50% of lowest bid
                const penaltyPrice = Math.floor(lowestBid * ENGINE_CONFIG.EXCESS_FILL_PENALTY);
                const excessTotal = remainingToSell * penaltyPrice;
                
                totalReceived += excessTotal;
                filledQuantity += remainingToSell;
                lastExecutionPrice = penaltyPrice;
                
                matchedOrders.push({
                    orderId: 'excess_fill',
                    userId: 'market_maker',
                    price: penaltyPrice,
                    quantity: remainingToSell,
                    total: excessTotal,
                    isNPC: true,
                    isExcessFill: true,
                    penaltyApplied: true
                });
                
                console.log(`⚠️ Excess sell fill: ${remainingToSell} ${order.element} at ${penaltyPrice}⭐ (50% of ${lowestBid}⭐)`);
                remainingToSell = 0;
            }
            
            if (filledQuantity === 0) {
                throw new Error('No buyers available');
            }
            
            const fee = totalReceived * ENGINE_CONFIG.FEE_PERCENT;
            const netReceived = totalReceived - fee;
            const orderStatus = ORDER_STATUS.FILLED; // Always fully filled now
            
            // Update order
            order.status = orderStatus;
            order.filledQuantity = filledQuantity;
            order.remainingQuantity = 0;
            order.executionPrice = lastExecutionPrice;
            order.fee = fee;
            order.netReceived = netReceived;
            order.executedAt = Date.now();
            order.matchedOrders = matchedOrders;
            order.hasExcessFill = matchedOrders.some(m => m.isExcessFill);
            
            // Create trade record
            const trade = {
                id: generateTradeId(),
                orderId: order.id,
                userId: order.userId,
                playerName: order.playerName,
                element: order.element,
                side: order.side,
                quantity: filledQuantity,
                price: totalReceived / filledQuantity, // Average price
                total: totalReceived,
                fee: fee,
                netReceived: netReceived,
                timestamp: Date.now(),
                isNPC: order.isNPC,
                matchedOrders: matchedOrders,
                hasExcessFill: order.hasExcessFill
            };
            
            recordTrade(order.element, filledQuantity, order.side);
            await addToMatchedTrades(trade);
            await recordOrderHistory(order, 'filled');
            
            if (!order.isNPC) {
                await saveUserOrder(order);
            }
            
            await updateMarketStats(filledQuantity, totalReceived);
            
            // Save updated order books
            await dbSaveMarketOrders(buyOrdersCache, 'buy_orders');
            await dbSaveMarketOrders(sellOrdersCache, 'sell_orders');
            await reloadOrderCache();
            
            return { 
                success: true, 
                order,
                trade,
                executionPrice: lastExecutionPrice,
                averagePrice: totalReceived / filledQuantity,
                totalCost: totalReceived,
                fee,
                netReceived,
                filledQuantity,
                remainingQuantity: 0,
                partiallyFilled: false,
                hasExcessFill: order.hasExcessFill,
                excessFillQuantity: order.hasExcessFill ? (matchedOrders.find(m => m.isExcessFill)?.quantity || 0) : 0
            };
        }
        
    } catch (error) {
        // Throttled error logging - only log once per minute per element/side
        const errorKey = `${order.element}_${order.side}`;
        const now = Date.now();
        
        if (!lastErrorLog[errorKey] || (now - lastErrorLog[errorKey]) > ERROR_LOG_INTERVAL) {
            console.error('Error executing market order:', error);
            lastErrorLog[errorKey] = now;
        }
        
        return { success: false, error: error.message };
    }
}

async function addToOrderBook(order) {
    if (!buyOrdersCache[order.element]) buyOrdersCache[order.element] = [];
    if (!sellOrdersCache[order.element]) sellOrdersCache[order.element] = [];
    
    if (order.side === ORDER_SIDES.BUY) {
        buyOrdersCache[order.element].push(order);
        buyOrdersCache[order.element].sort((a, b) => b.price - a.price);
        
        // No per-element limit for players - removed the slice
        // Only enforce limit for NPCs
        if (order.isNPC && buyOrdersCache[order.element].length > 100) {
            buyOrdersCache[order.element] = buyOrdersCache[order.element].slice(0, 100);
        }
    } else {
        sellOrdersCache[order.element].push(order);
        sellOrdersCache[order.element].sort((a, b) => a.price - b.price);
        
        // No per-element limit for players - removed the slice
        if (order.isNPC && sellOrdersCache[order.element].length > 100) {
            sellOrdersCache[order.element] = sellOrdersCache[order.element].slice(0, 100);
        }
    }
    
    await dbSaveMarketOrders(buyOrdersCache, 'buy_orders');
    await dbSaveMarketOrders(sellOrdersCache, 'sell_orders');
    await reloadOrderCache();
    await matchOrders(order.element);
}

async function addStopOrder(order) {
    let stopOrders = await dbLoadMarketOrders('stop_orders');
    if (!stopOrders) stopOrders = {};
    
    if (!stopOrders[order.element]) {
        stopOrders[order.element] = [];
    }
    
    stopOrders[order.element].push(order);
    await dbSaveMarketOrders(stopOrders, 'stop_orders');
}

// ===== ORDER MATCHING =====

async function matchOrders(element) {
    const buys = buyOrdersCache[element] || [];
    const sells = sellOrdersCache[element] || [];
    
    if (buys.length === 0 || sells.length === 0) return;
    
    let matched = false;
    let i = 0, j = 0;
    
    while (i < buys.length && j < sells.length) {
        const buy = buys[i];
        const sell = sells[j];
        
        if (buy.price >= sell.price) {
            const matchPrice = sell.price;
            const matchQuantity = Math.min(buy.remainingQuantity, sell.remainingQuantity);
            
            const trade = {
                id: generateTradeId(),
                buyOrderId: buy.id,
                sellOrderId: sell.id,
                element: element,
                quantity: matchQuantity,
                price: matchPrice,
                total: matchQuantity * matchPrice,
                timestamp: Date.now(),
                buyIsNPC: buy.isNPC || false,
                sellIsNPC: sell.isNPC || false,
                buyerName: buy.playerName || (buy.isNPC ? buy.traderName : 'Player'),
                sellerName: sell.playerName || (sell.isNPC ? sell.traderName : 'Player')
            };
            
            buy.filledQuantity += matchQuantity;
            buy.remainingQuantity -= matchQuantity;
            sell.filledQuantity += matchQuantity;
            sell.remainingQuantity -= matchQuantity;
            
            if (buy.remainingQuantity === 0) {
                buy.status = ORDER_STATUS.FILLED;
                i++;
            } else {
                buy.status = ORDER_STATUS.PARTIAL;
            }
            
            if (sell.remainingQuantity === 0) {
                sell.status = ORDER_STATUS.FILLED;
                j++;
            } else {
                sell.status = ORDER_STATUS.PARTIAL;
            }
            
            buy.trades = buy.trades || [];
            sell.trades = sell.trades || [];
            buy.trades.push(trade);
            sell.trades.push(trade);
            
            await addToMatchedTrades(trade);
            recordTrade(element, matchQuantity, 'match');
            await recordOrderHistory(buy, 'matched');
            await recordOrderHistory(sell, 'matched');
            
            if (!buy.isNPC) await saveUserOrder(buy);
            if (!sell.isNPC) await saveUserOrder(sell);
            
            if (buy.isNPC) {
                updateNPCTraderAfterTrade(buy.userId, {
                    element,
                    quantity: matchQuantity,
                    price: matchPrice,
                    side: ORDER_SIDES.BUY,
                    orderId: buy.id
                }).catch(err => console.error('Error updating NPC buyer:', err));
            }
            
            if (sell.isNPC) {
                updateNPCTraderAfterTrade(sell.userId, {
                    element,
                    quantity: matchQuantity,
                    price: matchPrice,
                    side: ORDER_SIDES.SELL,
                    orderId: sell.id
                }).catch(err => console.error('Error updating NPC seller:', err));
            }
            
            await updateMarketStats(matchQuantity, trade.total);
            matched = true;
        } else {
            break;
        }
    }
    
    if (matched) {
        buyOrdersCache[element] = buys.filter(o => o.status !== ORDER_STATUS.FILLED);
        sellOrdersCache[element] = sells.filter(o => o.status !== ORDER_STATUS.FILLED);
        
        await dbSaveMarketOrders(buyOrdersCache, 'buy_orders');
        await dbSaveMarketOrders(sellOrdersCache, 'sell_orders');
        await reloadOrderCache();
    }
}

async function checkStopOrders(element, currentPrice) {
    const stopOrders = await dbLoadMarketOrders('stop_orders');
    const elementStops = stopOrders?.[element] || [];
    
    const triggered = [];
    const remaining = [];
    
    for (const order of elementStops) {
        let trigger = false;
        
        if (order.side === ORDER_SIDES.BUY) {
            trigger = currentPrice >= order.stopPrice;
        } else {
            trigger = currentPrice <= order.stopPrice;
        }
        
        if (trigger) {
            if (order.type === ORDER_TYPES.STOP) {
                const marketOrder = {
                    ...order,
                    type: ORDER_TYPES.MARKET,
                    price: null,
                    triggeredAt: Date.now()
                };
                await executeMarketOrder(marketOrder);
            } else if (order.type === ORDER_TYPES.STOP_LIMIT) {
                const limitOrder = {
                    ...order,
                    type: ORDER_TYPES.LIMIT,
                    triggeredAt: Date.now()
                };
                await addToOrderBook(limitOrder);
            }
            triggered.push(order);
        } else {
            remaining.push(order);
        }
    }
    
    if (stopOrders) {
        stopOrders[element] = remaining;
        await dbSaveMarketOrders(stopOrders, 'stop_orders');
    }
    
    return triggered;
}

// ===== ORDER BOOK QUERIES =====

export async function getCombinedOrderBook(element, depth = ENGINE_CONFIG.ORDER_BOOK_DEPTH) {
    const playerBuys = (buyOrdersCache[element] || [])
        .filter(o => o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL);
    
    const playerSells = (sellOrdersCache[element] || [])
        .filter(o => o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL);
    
    let npcBuys = [];
    let npcSells = [];
    
    if (ENGINE_CONFIG.INCLUDE_NPC_ORDERS) {
        try {
            const npcOrders = await getNPCOrdersForElement(element);
            npcBuys = npcOrders.bids || [];
            npcSells = npcOrders.asks || [];
        } catch (error) {
            console.error('Error fetching NPC orders:', error);
        }
    }
    
    const allBuys = [...playerBuys, ...npcBuys].sort((a, b) => b.price - a.price);
    const allSells = [...playerSells, ...npcSells].sort((a, b) => a.price - b.price);
    
    const bids = allBuys.slice(0, depth).map(o => ({
        price: o.price,
        quantity: o.remainingQuantity,
        total: o.price * o.remainingQuantity,
        orderId: o.id,
        isNPC: o.isNPC || false,
        traderName: o.isNPC ? (o.traderName || 'NPC Trader') : null,
        userId: o.userId
    }));
    
    const asks = allSells.slice(0, depth).map(o => ({
        price: o.price,
        quantity: o.remainingQuantity,
        total: o.price * o.remainingQuantity,
        orderId: o.id,
        isNPC: o.isNPC || false,
        traderName: o.isNPC ? (o.traderName || 'NPC Trader') : null,
        userId: o.userId
    }));
    
    const bestBid = bids.length > 0 ? bids[0].price : null;
    const bestAsk = asks.length > 0 ? asks[0].price : null;
    const spread = bestBid && bestAsk ? bestAsk - bestBid : null;
    const spreadPercent = spread && bestBid ? (spread / bestBid) * 100 : null;
    
    // Calculate total liquidity
    const totalBuyLiquidity = allBuys.reduce((sum, o) => sum + o.remainingQuantity, 0);
    const totalSellLiquidity = allSells.reduce((sum, o) => sum + o.remainingQuantity, 0);
    
    return {
        element,
        bids,
        asks,
        bestBid,
        bestAsk,
        spread,
        spreadPercent,
        playerCount: playerBuys.length + playerSells.length,
        npcCount: npcBuys.length + npcSells.length,
        totalBuyLiquidity,
        totalSellLiquidity,
        timestamp: Date.now()
    };
}

export function getOrderBook(element, depth = ENGINE_CONFIG.ORDER_BOOK_DEPTH) {
    const buys = (buyOrdersCache[element] || [])
        .filter(o => o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL)
        .slice(0, depth)
        .map(o => ({
            price: o.price,
            quantity: o.remainingQuantity,
            total: o.price * o.remainingQuantity,
            orderId: o.id,
            isNPC: o.isNPC || false,
            traderName: o.traderName
        }));
    
    const sells = (sellOrdersCache[element] || [])
        .filter(o => o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL)
        .slice(0, depth)
        .map(o => ({
            price: o.price,
            quantity: o.remainingQuantity,
            total: o.price * o.remainingQuantity,
            orderId: o.id,
            isNPC: o.isNPC || false,
            traderName: o.traderName
        }));
    
    const bestBid = buys.length > 0 ? buys[0].price : null;
    const bestAsk = sells.length > 0 ? sells[0].price : null;
    const spread = bestBid && bestAsk ? bestAsk - bestBid : null;
    const spreadPercent = spread && bestBid ? (spread / bestBid) * 100 : null;
    
    return {
        element,
        bids: buys,
        asks: sells,
        bestBid,
        bestAsk,
        spread,
        spreadPercent,
        timestamp: Date.now()
    };
}

export async function getMarketDepth(element) {
    const orderBook = await getCombinedOrderBook(element, 100);
    
    const bidLevels = {};
    const askLevels = {};
    
    orderBook.bids.forEach(bid => {
        if (!bidLevels[bid.price]) bidLevels[bid.price] = 0;
        bidLevels[bid.price] += bid.quantity;
    });
    
    orderBook.asks.forEach(ask => {
        if (!askLevels[ask.price]) askLevels[ask.price] = 0;
        askLevels[ask.price] += ask.quantity;
    });
    
    return {
        element,
        bids: Object.entries(bidLevels)
            .map(([price, quantity]) => ({ price: parseFloat(price), quantity }))
            .sort((a, b) => b.price - a.price),
        asks: Object.entries(askLevels)
            .map(([price, quantity]) => ({ price: parseFloat(price), quantity }))
            .sort((a, b) => a.price - b.price),
        playerCount: orderBook.playerCount,
        npcCount: orderBook.npcCount,
        timestamp: Date.now()
    };
}

// ===== USER ORDER MANAGEMENT =====

export async function getUserOrders(userId, filters = {}) {
    let orders = userOrdersCache[userId] || [];
    orders = orders.filter(o => !o.isNPC);
    
    if (filters.element) orders = orders.filter(o => o.element === filters.element);
    if (filters.side) orders = orders.filter(o => o.side === filters.side);
    if (filters.status) orders = orders.filter(o => o.status === filters.status);
    if (filters.type) orders = orders.filter(o => o.type === filters.type);
    
    orders.sort((a, b) => b.createdAt - a.createdAt);
    return orders;
}

async function saveUserOrder(order) {
    if (order.isNPC) return;
    
    if (!userOrdersCache[order.userId]) {
        userOrdersCache[order.userId] = [];
    }
    
    const index = userOrdersCache[order.userId].findIndex(o => o.id === order.id);
    if (index >= 0) {
        userOrdersCache[order.userId][index] = order;
    } else {
        userOrdersCache[order.userId].push(order);
    }
    
    await dbSaveMarketOrders(userOrdersCache, 'user_orders');
}

export async function cancelOrder(userId, orderId) {
    try {
        if (orderId.startsWith('npc_')) {
            const result = await cancelTraderOrder(orderId, { id: userId });
            return result;
        }
        
        let cancelled = false;
        let order = null;
        
        for (const element of Object.keys(buyOrdersCache)) {
            const index = buyOrdersCache[element].findIndex(o => o.id === orderId && o.userId === userId);
            if (index >= 0) {
                order = buyOrdersCache[element][index];
                order.status = ORDER_STATUS.CANCELLED;
                buyOrdersCache[element].splice(index, 1);
                await dbSaveMarketOrders(buyOrdersCache, 'buy_orders');
                cancelled = true;
                break;
            }
        }
        
        if (!cancelled) {
            for (const element of Object.keys(sellOrdersCache)) {
                const index = sellOrdersCache[element].findIndex(o => o.id === orderId && o.userId === userId);
                if (index >= 0) {
                    order = sellOrdersCache[element][index];
                    order.status = ORDER_STATUS.CANCELLED;
                    sellOrdersCache[element].splice(index, 1);
                    await dbSaveMarketOrders(sellOrdersCache, 'sell_orders');
                    cancelled = true;
                    break;
                }
            }
        }
        
        if (!cancelled) {
            const stopOrders = await dbLoadMarketOrders('stop_orders');
            if (stopOrders) {
                for (const element of Object.keys(stopOrders)) {
                    const index = stopOrders[element].findIndex(o => o.id === orderId && o.userId === userId);
                    if (index >= 0) {
                        order = stopOrders[element][index];
                        order.status = ORDER_STATUS.CANCELLED;
                        stopOrders[element].splice(index, 1);
                        await dbSaveMarketOrders(stopOrders, 'stop_orders');
                        cancelled = true;
                        break;
                    }
                }
            }
        }
        
        if (cancelled && order) {
            await saveUserOrder(order);
            await recordOrderHistory(order, 'cancelled');
            await reloadOrderCache();
            return { success: true, order };
        } else {
            return { success: false, error: 'Order not found' };
        }
        
    } catch (error) {
        console.error('Error cancelling order:', error);
        return { success: false, error: error.message };
    }
}

// ===== ORDER HISTORY =====

async function recordOrderHistory(order, action) {
    const entry = {
        orderId: order.id,
        userId: order.userId,
        playerName: order.playerName,
        element: order.element,
        side: order.side,
        type: order.type,
        quantity: order.originalQuantity,
        price: order.price,
        action: action,
        timestamp: Date.now(),
        isNPC: order.isNPC || false
    };
    
    await dbAddOrderHistory(entry);
}

export async function getUserOrderHistory(userId, limit = 50) {
    return await dbGetUserOrderHistory(userId, limit);
}

// ===== MATCHED TRADES =====

async function addToMatchedTrades(trade) {
    await dbAddTrade(trade);
}

export async function getRecentTrades(element, limit = 20) {
    const trades = await dbGetRecentTrades(500);
    return trades.filter(t => t.element === element).slice(-limit).reverse();
}

export async function getUserTrades(userId, limit = 50) {
    const trades = await dbGetRecentTrades(500);
    return trades.filter(t => t.buyOrderId?.includes(userId) || t.sellOrderId?.includes(userId)).slice(-limit).reverse();
}

export async function getAllRecentTrades(limit = 50) {
    const trades = await dbGetRecentTrades(500);
    return trades.slice(-limit).reverse();
}

// ===== MARKET STATISTICS =====

async function updateMarketStats(volume, value) {
    marketStatsCache.totalVolume = (marketStatsCache.totalVolume || 0) + volume;
    marketStatsCache.totalValue = (marketStatsCache.totalValue || 0) + value;
    marketStatsCache.totalTrades = (marketStatsCache.totalTrades || 0) + 1;
    marketStatsCache.lastUpdate = Date.now();
    await dbSaveMarketOrders(marketStatsCache, 'market_stats');
}

export async function getMarketStats() {
    return marketStatsCache;
}

export async function get24HourSummary() {
    const trades = await dbGetRecentTrades(500);
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentTrades = trades.filter(t => t.timestamp >= oneDayAgo);
    
    const volume = recentTrades.reduce((sum, t) => sum + t.quantity, 0);
    const value = recentTrades.reduce((sum, t) => sum + t.total, 0);
    const high = recentTrades.length > 0 ? Math.max(...recentTrades.map(t => t.price)) : 0;
    const low = recentTrades.length > 0 ? Math.min(...recentTrades.map(t => t.price)) : 0;
    const first = recentTrades.length > 0 ? recentTrades[0].price : 0;
    const last = recentTrades.length > 0 ? recentTrades[recentTrades.length - 1].price : 0;
    const change = last - first;
    const changePercent = first > 0 ? (change / first) * 100 : 0;
    const npcTrades = recentTrades.filter(t => t.buyIsNPC || t.sellIsNPC).length;
    const playerTrades = recentTrades.length - npcTrades;
    
    return { volume, value, trades: recentTrades.length, npcTrades, playerTrades, high, low, open: first, close: last, change, changePercent };
}

// ===== PRICE IMPACT =====

async function applyPriceImpact(element, quantity, side) {
    const prices = getCurrentPrices();
    const elementPrice = prices[element];
    if (!elementPrice) return;
    
    const volume24h = getVolumeLast24h(element);
    const impact = (quantity / Math.max(volume24h, 1)) * ENGINE_CONFIG.PRICE_IMPACT_FACTOR;
    
    if (side === ORDER_SIDES.BUY) {
        elementPrice.current *= (1 + impact);
        elementPrice.ask *= (1 + impact);
        elementPrice.bid *= (1 + impact);
    } else {
        elementPrice.current *= (1 - impact);
        elementPrice.ask *= (1 - impact);
        elementPrice.bid *= (1 - impact);
    }
    
    await dbSaveMarketPrices(prices);
}

// ===== UTILITY FUNCTIONS =====

function generateOrderId() {
    return 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateTradeId() {
    return 'trade_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function cleanExpiredOrders() {
    const now = Date.now();
    let expired = 0;
    
    for (const element of Object.keys(buyOrdersCache)) {
        const before = buyOrdersCache[element].length;
        buyOrdersCache[element] = buyOrdersCache[element].filter(o => o.expiresAt > now);
        expired += before - buyOrdersCache[element].length;
    }
    
    for (const element of Object.keys(sellOrdersCache)) {
        const before = sellOrdersCache[element].length;
        sellOrdersCache[element] = sellOrdersCache[element].filter(o => o.expiresAt > now);
        expired += before - sellOrdersCache[element].length;
    }
    
    const stopOrders = await dbLoadMarketOrders('stop_orders');
    if (stopOrders) {
        for (const element of Object.keys(stopOrders)) {
            const before = stopOrders[element].length;
            stopOrders[element] = stopOrders[element].filter(o => o.expiresAt > now);
            expired += before - stopOrders[element].length;
        }
        await dbSaveMarketOrders(stopOrders, 'stop_orders');
    }
    
    await dbSaveMarketOrders(buyOrdersCache, 'buy_orders');
    await dbSaveMarketOrders(sellOrdersCache, 'sell_orders');
    
    if (expired > 0) console.log(`Cleaned ${expired} expired orders`);
}

// ===== MATCHING ENGINE =====

let matchingInterval = null;

export function startMatchingEngine() {
    if (matchingInterval) return;
    
    matchingInterval = setInterval(async () => {
        try {
            const elements = new Set([...Object.keys(buyOrdersCache), ...Object.keys(sellOrdersCache)]);
            
            for (const element of elements) {
                await matchOrders(element);
                const prices = getCurrentPrices();
                if (prices[element]) {
                    await checkStopOrders(element, prices[element].current);
                }
            }
            
            await cleanExpiredOrders();
            await pruneNonCompetitiveOrders();
            
        } catch (error) {
            console.error('Matching engine error:', error);
        }
    }, ENGINE_CONFIG.MATCHING_INTERVAL);
}

export function stopMatchingEngine() {
    if (matchingInterval) {
        clearInterval(matchingInterval);
        matchingInterval = null;
    }
}

// ===== NPC INTEGRATION HELPERS =====

export async function getOrderBookWithNPC(element, depth = ENGINE_CONFIG.ORDER_BOOK_DEPTH) {
    return await getCombinedOrderBook(element, depth);
}

export function isNPCOrder(order) {
    return order.isNPC === true || order.userId?.startsWith('npc_') || order.id?.startsWith('npc_');
}

export function getTraderDisplayName(order) {
    if (order.isNPC) return order.traderName || 'NPC Trader';
    return order.playerName || 'Player';
}

// ===== EXPORT =====

export default {
    ORDER_TYPES,
    ORDER_SIDES,
    ORDER_STATUS,
    ENGINE_CONFIG,
    initializeMarketEngine,
    createOrder,
    cancelOrder,
    getOrderBook,
    getCombinedOrderBook,
    getOrderBookWithNPC,
    getMarketDepth,
    getUserOrders,
    getUserOrderHistory,
    getRecentTrades,
    getUserTrades,
    getAllRecentTrades,
    getMarketStats,
    get24HourSummary,
    isNPCOrder,
    getTraderDisplayName,
    startMatchingEngine,
    stopMatchingEngine
};

initializeMarketEngine();

window.ORDER_TYPES = ORDER_TYPES;
window.ORDER_SIDES = ORDER_SIDES;
window.ORDER_STATUS = ORDER_STATUS;
window.ENGINE_CONFIG = ENGINE_CONFIG;
window.initializeMarketEngine = initializeMarketEngine;
window.createOrder = createOrder;
window.cancelOrder = cancelOrder;
window.getOrderBook = getOrderBook;
window.getCombinedOrderBook = getCombinedOrderBook;
window.getOrderBookWithNPC = getOrderBookWithNPC;
window.getMarketDepth = getMarketDepth;
window.getUserOrders = getUserOrders;
window.getUserOrderHistory = getUserOrderHistory;
window.getRecentTrades = getRecentTrades;
window.getUserTrades = getUserTrades;
window.getAllRecentTrades = getAllRecentTrades;
window.getMarketStats = getMarketStats;
window.get24HourSummary = get24HourSummary;
window.isNPCOrder = isNPCOrder;
window.getTraderDisplayName = getTraderDisplayName;

console.log('✅ market-engine.js loaded - IndexedDB version ready with market order fix, unlimited player orders, market maker liquidity, emergency fallback, and EXCESS FILL LOGIC (50% penalty for sells, 150% premium for buys)');

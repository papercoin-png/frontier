// js/market-engine.js - Core Trading Engine for Element Marketplace
// Handles order matching, price discovery, and market operations
// UPDATED: Added NPC trader integration for 1000 simulated traders

import { ELEMENT_DATABASE, getElementByName } from './element-prices.js';
import { 
    getCurrentPrices, 
    getBidPrice, 
    getAskPrice, 
    recordTrade,
    updatePrices,
    getSupplyIndex,
    getDemandIndex,
    getVolumeLast24h
} from './market-dynamics.js';
import { 
    getNPCOrdersForElement, 
    getNPCOrders,
    cancelTraderOrder,
    updateNPCTraderAfterTrade 
} from './npc-traders.js';
import { updateNPCTraderAfterTrade as storageUpdateNPCTrader } from './storage.js';

// ===== MARKET ENGINE CONFIGURATION =====

const ENGINE_CONFIG = {
    MAX_ORDERS_PER_USER: 50,
    MAX_ORDERS_PER_NPC: 10,           // NPCs have lower limit
    ORDER_EXPIRY_HOURS: 72,
    MIN_ORDER_QUANTITY: 1,
    MAX_ORDER_QUANTITY: 10000,
    FEE_PERCENT: 0.01, // 1% trading fee
    MATCHING_INTERVAL: 5000, // 5 seconds
    PRICE_IMPACT_FACTOR: 0.1, // How much large orders impact price
    ORDER_BOOK_DEPTH: 20, // Number of orders to show on each side
    MAX_SPREAD_MULTIPLIER: 5, // Maximum spread relative to market price
    INCLUDE_NPC_ORDERS: true,         // Whether to include NPC orders
    SHOW_NPC_NAMES: true,              // Show NPC names in order book
    NPC_ORDER_PREFIX: 'npc_'           // Prefix for NPC order IDs
};

// ===== STORAGE KEYS =====

const STORAGE_KEYS = {
    BUY_ORDERS: 'voidfarer_market_buy_orders',
    SELL_ORDERS: 'voidfarer_market_sell_orders',
    ORDER_HISTORY: 'voidfarer_order_history',
    USER_ORDERS: 'voidfarer_user_orders',
    MATCHED_TRADES: 'voidfarer_matched_trades',
    MARKET_STATS: 'voidfarer_market_stats'
};

// ===== ORDER TYPES =====

export const ORDER_TYPES = {
    MARKET: 'market',      // Execute immediately at best price
    LIMIT: 'limit',        // Execute at specified price or better
    STOP: 'stop',          // Trigger when price reaches stop price
    STOP_LIMIT: 'stop_limit' // Combine stop and limit
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

// ===== INITIALIZATION =====

/**
 * Initialize market engine
 */
export function initializeMarketEngine() {
    if (!localStorage.getItem(STORAGE_KEYS.BUY_ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.BUY_ORDERS, JSON.stringify({}));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SELL_ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.SELL_ORDERS, JSON.stringify({}));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY)) {
        localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER_ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.USER_ORDERS, JSON.stringify({}));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MATCHED_TRADES)) {
        localStorage.setItem(STORAGE_KEYS.MATCHED_TRADES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MARKET_STATS)) {
        localStorage.setItem(STORAGE_KEYS.MARKET_STATS, JSON.stringify({
            totalVolume: 0,
            totalTrades: 0,
            lastUpdate: Date.now()
        }));
    }
    
    console.log('Market engine initialized with NPC support');
    
    // Start matching engine
    startMatchingEngine();
}

// ===== ORDER MANAGEMENT =====

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @returns {Object} Created order
 */
export function createOrder(orderData) {
    try {
        // Validate required fields
        if (!orderData.userId) throw new Error('User ID required');
        if (!orderData.element) throw new Error('Element required');
        if (!orderData.side) throw new Error('Order side required');
        if (!orderData.type) throw new Error('Order type required');
        if (!orderData.quantity || orderData.quantity <= 0) throw new Error('Valid quantity required');
        
        // Validate element exists
        const element = getElementByName(orderData.element);
        if (!element) throw new Error('Element not found');
        
        // Check if this is an NPC order
        const isNPC = orderData.userId.startsWith('npc_') || orderData.isNPC === true;
        
        // Check order limits based on user type
        if (isNPC) {
            // NPCs have their own limit (but we don't strictly enforce here - NPC manager handles it)
            console.log(`Processing NPC order from ${orderData.userId}`);
        } else {
            // Check player order limit
            const userOrders = getUserOrders(orderData.userId);
            if (userOrders.length >= ENGINE_CONFIG.MAX_ORDERS_PER_USER) {
                throw new Error(`Maximum orders (${ENGINE_CONFIG.MAX_ORDERS_PER_USER}) reached`);
            }
        }
        
        // Validate quantity
        if (orderData.quantity < ENGINE_CONFIG.MIN_ORDER_QUANTITY) {
            throw new Error(`Minimum order quantity is ${ENGINE_CONFIG.MIN_ORDER_QUANTITY}`);
        }
        if (orderData.quantity > ENGINE_CONFIG.MAX_ORDER_QUANTITY) {
            throw new Error(`Maximum order quantity is ${ENGINE_CONFIG.MAX_ORDER_QUANTITY}`);
        }
        
        // Validate price for limit orders
        if (orderData.type === ORDER_TYPES.LIMIT && (!orderData.price || orderData.price <= 0)) {
            throw new Error('Valid price required for limit orders');
        }
        
        // For stop orders, validate stop price
        if (orderData.type === ORDER_TYPES.STOP && (!orderData.stopPrice || orderData.stopPrice <= 0)) {
            throw new Error('Valid stop price required for stop orders');
        }
        
        // For stop-limit orders, validate both
        if (orderData.type === ORDER_TYPES.STOP_LIMIT) {
            if (!orderData.stopPrice || orderData.stopPrice <= 0) {
                throw new Error('Valid stop price required for stop-limit orders');
            }
            if (!orderData.price || orderData.price <= 0) {
                throw new Error('Valid limit price required for stop-limit orders');
            }
        }
        
        // Create order object
        const order = {
            id: generateOrderId(),
            userId: orderData.userId,
            playerName: orderData.playerName || (isNPC ? orderData.traderName : 'Voidfarer'),
            element: orderData.element,
            side: orderData.side,
            type: orderData.type,
            price: orderData.price || null,
            stopPrice: orderData.stopPrice || null,
            originalQuantity: orderData.quantity,
            remainingQuantity: orderData.quantity,
            filledQuantity: 0,
            status: ORDER_STATUS.ACTIVE,
            createdAt: Date.now(),
            expiresAt: Date.now() + (ENGINE_CONFIG.ORDER_EXPIRY_HOURS * 60 * 60 * 1000),
            trades: [],
            isNPC: isNPC,
            traderName: orderData.traderName || (isNPC ? 'NPC Trader' : null)
        };
        
        // For market orders, attempt immediate execution
        if (order.type === ORDER_TYPES.MARKET) {
            return executeMarketOrder(order);
        }
        
        // For limit orders, add to order book
        if (order.type === ORDER_TYPES.LIMIT) {
            addToOrderBook(order);
        }
        
        // For stop orders, add to stop order list
        if (order.type === ORDER_TYPES.STOP || order.type === ORDER_TYPES.STOP_LIMIT) {
            addStopOrder(order);
        }
        
        // Save order to user's list (only for players, NPCs are managed separately)
        if (!isNPC) {
            saveUserOrder(order);
        }
        
        // Record order creation
        recordOrderHistory(order, 'created');
        
        return { success: true, order };
        
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Execute a market order immediately
 * @param {Object} order - Market order
 * @returns {Object} Execution result
 */
function executeMarketOrder(order) {
    try {
        const prices = getCurrentPrices();
        const elementPrice = prices[order.element];
        
        if (!elementPrice) {
            throw new Error('Price data not available');
        }
        
        // Determine execution price based on side
        let executionPrice;
        let totalCost;
        let fee;
        
        if (order.side === ORDER_SIDES.BUY) {
            executionPrice = elementPrice.ask || elementPrice.current * 1.01;
            totalCost = order.quantity * executionPrice;
            fee = totalCost * ENGINE_CONFIG.FEE_PERCENT;
        } else {
            executionPrice = elementPrice.bid || elementPrice.current * 0.99;
            totalCost = order.quantity * executionPrice;
            fee = totalCost * ENGINE_CONFIG.FEE_PERCENT;
        }
        
        // Update order status
        order.status = ORDER_STATUS.FILLED;
        order.filledQuantity = order.quantity;
        order.remainingQuantity = 0;
        order.executionPrice = executionPrice;
        order.fee = fee;
        order.executedAt = Date.now();
        
        // Record trade
        const trade = {
            id: generateTradeId(),
            orderId: order.id,
            userId: order.userId,
            playerName: order.playerName,
            element: order.element,
            side: order.side,
            quantity: order.quantity,
            price: executionPrice,
            total: totalCost,
            fee: fee,
            timestamp: Date.now(),
            isNPC: order.isNPC
        };
        
        recordTrade(order.element, order.quantity, order.side);
        addToMatchedTrades(trade);
        recordOrderHistory(order, 'filled');
        
        // Save user order if player
        if (!order.isNPC) {
            saveUserOrder(order);
        }
        
        // Update market stats
        updateMarketStats(order.quantity, totalCost);
        
        // Calculate price impact for large orders
        const volume24h = getVolumeLast24h(order.element);
        if (order.quantity > volume24h * 0.01) { // >1% of daily volume
            applyPriceImpact(order.element, order.quantity, order.side);
        }
        
        return { 
            success: true, 
            order,
            trade,
            executionPrice,
            totalCost,
            fee
        };
        
    } catch (error) {
        console.error('Error executing market order:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Add limit order to order book
 * @param {Object} order - Limit order
 */
function addToOrderBook(order) {
    const buyOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUY_ORDERS) || '{}');
    const sellOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELL_ORDERS) || '{}');
    
    // Group orders by element
    if (!buyOrders[order.element]) buyOrders[order.element] = [];
    if (!sellOrders[order.element]) sellOrders[order.element] = [];
    
    if (order.side === ORDER_SIDES.BUY) {
        buyOrders[order.element].push(order);
        // Sort buy orders: highest price first
        buyOrders[order.element].sort((a, b) => b.price - a.price);
    } else {
        sellOrders[order.element].push(order);
        // Sort sell orders: lowest price first
        sellOrders[order.element].sort((a, b) => a.price - b.price);
    }
    
    localStorage.setItem(STORAGE_KEYS.BUY_ORDERS, JSON.stringify(buyOrders));
    localStorage.setItem(STORAGE_KEYS.SELL_ORDERS, JSON.stringify(sellOrders));
    
    // Attempt to match orders
    matchOrders(order.element);
}

/**
 * Add stop order to watch list
 * @param {Object} order - Stop order
 */
function addStopOrder(order) {
    const stopOrders = JSON.parse(localStorage.getItem('voidfarer_stop_orders') || '{}');
    
    if (!stopOrders[order.element]) {
        stopOrders[order.element] = [];
    }
    
    stopOrders[order.element].push(order);
    
    localStorage.setItem('voidfarer_stop_orders', JSON.stringify(stopOrders));
}

// ===== ORDER MATCHING =====

/**
 * Match buy and sell orders for an element
 * @param {string} element - Element name
 */
function matchOrders(element) {
    const buyOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUY_ORDERS) || '{}');
    const sellOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELL_ORDERS) || '{}');
    
    const buys = buyOrders[element] || [];
    const sells = sellOrders[element] || [];
    
    if (buys.length === 0 || sells.length === 0) return;
    
    let matched = false;
    let i = 0, j = 0;
    
    while (i < buys.length && j < sells.length) {
        const buy = buys[i];
        const sell = sells[j];
        
        // Check if prices cross (buy price >= sell price)
        if (buy.price >= sell.price) {
            // Determine match price (usually use sell price for buys, buy price for sells)
            const matchPrice = sell.price; // Conservative: use sell price
            const matchQuantity = Math.min(buy.remainingQuantity, sell.remainingQuantity);
            
            // Create matched trade
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
            
            // Update orders
            buy.filledQuantity += matchQuantity;
            buy.remainingQuantity -= matchQuantity;
            sell.filledQuantity += matchQuantity;
            sell.remainingQuantity -= matchQuantity;
            
            // Update statuses
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
            
            // Record trade
            buy.trades = buy.trades || [];
            sell.trades = sell.trades || [];
            buy.trades.push(trade);
            sell.trades.push(trade);
            
            addToMatchedTrades(trade);
            recordTrade(element, matchQuantity, 'match');
            recordOrderHistory(buy, 'matched');
            recordOrderHistory(sell, 'matched');
            
            // Update user orders (players only)
            if (!buy.isNPC) saveUserOrder(buy);
            if (!sell.isNPC) saveUserOrder(sell);
            
            // Update NPC traders if involved
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
            
            // Update market stats
            updateMarketStats(matchQuantity, trade.total);
            
            matched = true;
        } else {
            // Prices don't cross, stop matching
            break;
        }
    }
    
    // Remove filled orders and update order books
    if (matched) {
        buyOrders[element] = buys.filter(o => o.status !== ORDER_STATUS.FILLED);
        sellOrders[element] = sells.filter(o => o.status !== ORDER_STATUS.FILLED);
        
        localStorage.setItem(STORAGE_KEYS.BUY_ORDERS, JSON.stringify(buyOrders));
        localStorage.setItem(STORAGE_KEYS.SELL_ORDERS, JSON.stringify(sellOrders));
    }
}

/**
 * Check and trigger stop orders
 * @param {string} element - Element name
 * @param {number} currentPrice - Current market price
 */
function checkStopOrders(element, currentPrice) {
    const stopOrders = JSON.parse(localStorage.getItem('voidfarer_stop_orders') || '{}');
    const elementStops = stopOrders[element] || [];
    
    const triggered = [];
    const remaining = [];
    
    for (const order of elementStops) {
        let trigger = false;
        
        if (order.side === ORDER_SIDES.BUY) {
            // Buy stop triggers when price rises above stop price
            trigger = currentPrice >= order.stopPrice;
        } else {
            // Sell stop triggers when price falls below stop price
            trigger = currentPrice <= order.stopPrice;
        }
        
        if (trigger) {
            // Convert to market or limit order
            if (order.type === ORDER_TYPES.STOP) {
                // Convert to market order
                const marketOrder = {
                    ...order,
                    type: ORDER_TYPES.MARKET,
                    price: null,
                    triggeredAt: Date.now()
                };
                executeMarketOrder(marketOrder);
            } else if (order.type === ORDER_TYPES.STOP_LIMIT) {
                // Convert to limit order
                const limitOrder = {
                    ...order,
                    type: ORDER_TYPES.LIMIT,
                    triggeredAt: Date.now()
                };
                addToOrderBook(limitOrder);
            }
            triggered.push(order);
        } else {
            remaining.push(order);
        }
    }
    
    // Update stop orders
    stopOrders[element] = remaining;
    localStorage.setItem('voidfarer_stop_orders', JSON.stringify(stopOrders));
    
    return triggered;
}

// ===== ORDER BOOK QUERIES =====

/**
 * Get combined order book with both player and NPC orders
 * @param {string} element - Element name
 * @param {number} depth - Number of orders to return
 * @returns {Object} Order book with bids and asks
 */
export async function getCombinedOrderBook(element, depth = ENGINE_CONFIG.ORDER_BOOK_DEPTH) {
    // Get player orders
    const buyOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUY_ORDERS) || '{}');
    const sellOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELL_ORDERS) || '{}');
    
    const playerBuys = (buyOrders[element] || [])
        .filter(o => o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL);
    
    const playerSells = (sellOrders[element] || [])
        .filter(o => o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL);
    
    // Get NPC orders
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
    
    // Combine and sort
    const allBuys = [...playerBuys, ...npcBuys].sort((a, b) => b.price - a.price);
    const allSells = [...playerSells, ...npcSells].sort((a, b) => a.price - b.price);
    
    // Format for display
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
    
    // Calculate spread
    const bestBid = bids.length > 0 ? bids[0].price : null;
    const bestAsk = asks.length > 0 ? asks[0].price : null;
    const spread = bestBid && bestAsk ? bestAsk - bestBid : null;
    const spreadPercent = spread && bestBid ? (spread / bestBid) * 100 : null;
    
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
        timestamp: Date.now()
    };
}

/**
 * Get order book for an element (legacy - returns only player orders)
 * @param {string} element - Element name
 * @param {number} depth - Number of orders to return
 * @returns {Object} Order book with bids and asks
 */
export function getOrderBook(element, depth = ENGINE_CONFIG.ORDER_BOOK_DEPTH) {
    const buyOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUY_ORDERS) || '{}');
    const sellOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELL_ORDERS) || '{}');
    
    const buys = (buyOrders[element] || [])
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
    
    const sells = (sellOrders[element] || [])
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
    
    // Calculate spread
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

/**
 * Get market depth (cumulative quantities at each price level)
 * @param {string} element - Element name
 * @returns {Object} Market depth
 */
export async function getMarketDepth(element) {
    const orderBook = await getCombinedOrderBook(element, 100);
    
    // Group by price levels
    const bidLevels = {};
    const askLevels = {};
    
    orderBook.bids.forEach(bid => {
        if (!bidLevels[bid.price]) {
            bidLevels[bid.price] = 0;
        }
        bidLevels[bid.price] += bid.quantity;
    });
    
    orderBook.asks.forEach(ask => {
        if (!askLevels[ask.price]) {
            askLevels[ask.price] = 0;
        }
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

/**
 * Get orders for a user
 * @param {string} userId - User ID
 * @param {Object} filters - Optional filters
 * @returns {Array} User orders (players only, NPCs filtered out)
 */
export function getUserOrders(userId, filters = {}) {
    const userOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_ORDERS) || '{}');
    let orders = userOrders[userId] || [];
    
    // Filter out any NPC orders that might have snuck in (shouldn't happen, but safety)
    orders = orders.filter(o => !o.isNPC);
    
    // Apply filters
    if (filters.element) {
        orders = orders.filter(o => o.element === filters.element);
    }
    if (filters.side) {
        orders = orders.filter(o => o.side === filters.side);
    }
    if (filters.status) {
        orders = orders.filter(o => o.status === filters.status);
    }
    if (filters.type) {
        orders = orders.filter(o => o.type === filters.type);
    }
    
    // Sort by date (newest first)
    orders.sort((a, b) => b.createdAt - a.createdAt);
    
    return orders;
}

/**
 * Save user order
 * @param {Object} order - Order object
 */
function saveUserOrder(order) {
    // Don't save NPC orders to user storage
    if (order.isNPC) return;
    
    const userOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_ORDERS) || '{}');
    
    if (!userOrders[order.userId]) {
        userOrders[order.userId] = [];
    }
    
    const index = userOrders[order.userId].findIndex(o => o.id === order.id);
    if (index >= 0) {
        userOrders[order.userId][index] = order;
    } else {
        userOrders[order.userId].push(order);
    }
    
    localStorage.setItem(STORAGE_KEYS.USER_ORDERS, JSON.stringify(userOrders));
}

/**
 * Cancel an order
 * @param {string} userId - User ID
 * @param {string} orderId - Order ID
 * @returns {Object} Result
 */
export async function cancelOrder(userId, orderId) {
    try {
        // Check if this is an NPC order
        if (orderId.startsWith('npc_')) {
            // Handle NPC order cancellation
            const traderId = userId; // For NPCs, userId is the trader ID
            const result = await cancelTraderOrder(orderId, { id: traderId });
            return result;
        }
        
        // Handle player order cancellation
        // Check in buy orders
        const buyOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUY_ORDERS) || '{}');
        // Check in sell orders
        const sellOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELL_ORDERS) || '{}');
        // Check in stop orders
        const stopOrders = JSON.parse(localStorage.getItem('voidfarer_stop_orders') || '{}');
        
        let cancelled = false;
        let order = null;
        
        // Search in buy orders
        for (const element of Object.keys(buyOrders)) {
            const index = buyOrders[element].findIndex(o => o.id === orderId && o.userId === userId);
            if (index >= 0) {
                order = buyOrders[element][index];
                order.status = ORDER_STATUS.CANCELLED;
                buyOrders[element].splice(index, 1);
                localStorage.setItem(STORAGE_KEYS.BUY_ORDERS, JSON.stringify(buyOrders));
                cancelled = true;
                break;
            }
        }
        
        // Search in sell orders if not found
        if (!cancelled) {
            for (const element of Object.keys(sellOrders)) {
                const index = sellOrders[element].findIndex(o => o.id === orderId && o.userId === userId);
                if (index >= 0) {
                    order = sellOrders[element][index];
                    order.status = ORDER_STATUS.CANCELLED;
                    sellOrders[element].splice(index, 1);
                    localStorage.setItem(STORAGE_KEYS.SELL_ORDERS, JSON.stringify(sellOrders));
                    cancelled = true;
                    break;
                }
            }
        }
        
        // Search in stop orders if not found
        if (!cancelled) {
            for (const element of Object.keys(stopOrders)) {
                const index = stopOrders[element].findIndex(o => o.id === orderId && o.userId === userId);
                if (index >= 0) {
                    order = stopOrders[element][index];
                    order.status = ORDER_STATUS.CANCELLED;
                    stopOrders[element].splice(index, 1);
                    localStorage.setItem('voidfarer_stop_orders', JSON.stringify(stopOrders));
                    cancelled = true;
                    break;
                }
            }
        }
        
        if (cancelled && order) {
            // Update user orders
            saveUserOrder(order);
            recordOrderHistory(order, 'cancelled');
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

/**
 * Record order history
 * @param {Object} order - Order object
 * @param {string} action - Action performed
 */
function recordOrderHistory(order, action) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY) || '[]');
    
    history.push({
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
    });
    
    // Keep last 10000 records
    if (history.length > 10000) {
        history.shift();
    }
    
    localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(history));
}

/**
 * Get order history for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of records
 * @returns {Array} Order history
 */
export function getUserOrderHistory(userId, limit = 50) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY) || '[]');
    
    return history
        .filter(h => h.userId === userId)
        .slice(-limit)
        .reverse();
}

// ===== MATCHED TRADES =====

/**
 * Add trade to matched trades list
 * @param {Object} trade - Trade object
 */
function addToMatchedTrades(trade) {
    const trades = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHED_TRADES) || '[]');
    
    trades.push(trade);
    
    // Keep last 10000 trades
    if (trades.length > 10000) {
        trades.shift();
    }
    
    localStorage.setItem(STORAGE_KEYS.MATCHED_TRADES, JSON.stringify(trades));
}

/**
 * Get recent trades for an element
 * @param {string} element - Element name
 * @param {number} limit - Number of trades
 * @returns {Array} Recent trades
 */
export function getRecentTrades(element, limit = 20) {
    const trades = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHED_TRADES) || '[]');
    
    return trades
        .filter(t => t.element === element)
        .slice(-limit)
        .reverse();
}

/**
 * Get trade history for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of trades
 * @returns {Array} User trades
 */
export function getUserTrades(userId, limit = 50) {
    const trades = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHED_TRADES) || '[]');
    
    return trades
        .filter(t => t.buyOrderId?.includes(userId) || t.sellOrderId?.includes(userId))
        .slice(-limit)
        .reverse();
}

/**
 * Get all recent trades (including NPC trades)
 * @param {number} limit - Number of trades
 * @returns {Array} Recent trades
 */
export function getAllRecentTrades(limit = 50) {
    const trades = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHED_TRADES) || '[]');
    
    return trades
        .slice(-limit)
        .reverse();
}

// ===== MARKET STATISTICS =====

/**
 * Update market statistics
 * @param {number} volume - Trade volume
 * @param {number} value - Trade value
 */
function updateMarketStats(volume, value) {
    const stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.MARKET_STATS) || '{}');
    
    stats.totalVolume = (stats.totalVolume || 0) + volume;
    stats.totalValue = (stats.totalValue || 0) + value;
    stats.totalTrades = (stats.totalTrades || 0) + 1;
    stats.lastUpdate = Date.now();
    
    localStorage.setItem(STORAGE_KEYS.MARKET_STATS, JSON.stringify(stats));
}

/**
 * Get market statistics
 * @returns {Object} Market statistics
 */
export function getMarketStats() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MARKET_STATS) || '{}');
}

/**
 * Get 24-hour market summary
 * @returns {Object} 24-hour summary
 */
export function get24HourSummary() {
    const trades = JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHED_TRADES) || '[]');
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
    
    // Count NPC vs Player trades
    const npcTrades = recentTrades.filter(t => t.buyIsNPC || t.sellIsNPC).length;
    const playerTrades = recentTrades.length - npcTrades;
    
    return {
        volume,
        value,
        trades: recentTrades.length,
        npcTrades,
        playerTrades,
        high,
        low,
        open: first,
        close: last,
        change,
        changePercent
    };
}

// ===== PRICE IMPACT =====

/**
 * Apply price impact from large trades
 * @param {string} element - Element name
 * @param {number} quantity - Trade quantity
 * @param {string} side - Trade side
 */
function applyPriceImpact(element, quantity, side) {
    const prices = JSON.parse(localStorage.getItem('voidfarer_current_prices') || '{}');
    const elementPrice = prices[element];
    
    if (!elementPrice) return;
    
    const volume24h = getVolumeLast24h(element);
    const impact = (quantity / volume24h) * ENGINE_CONFIG.PRICE_IMPACT_FACTOR;
    
    if (side === ORDER_SIDES.BUY) {
        // Buying increases price
        elementPrice.current *= (1 + impact);
        elementPrice.ask *= (1 + impact);
        elementPrice.bid *= (1 + impact);
    } else {
        // Selling decreases price
        elementPrice.current *= (1 - impact);
        elementPrice.ask *= (1 - impact);
        elementPrice.bid *= (1 - impact);
    }
    
    localStorage.setItem('voidfarer_current_prices', JSON.stringify(prices));
}

// ===== UTILITY FUNCTIONS =====

/**
 * Generate unique order ID
 * @returns {string} Order ID
 */
function generateOrderId() {
    return 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Generate unique trade ID
 * @returns {string} Trade ID
 */
function generateTradeId() {
    return 'trade_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Clean expired orders
 */
function cleanExpiredOrders() {
    const now = Date.now();
    const buyOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUY_ORDERS) || '{}');
    const sellOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELL_ORDERS) || '{}');
    const stopOrders = JSON.parse(localStorage.getItem('voidfarer_stop_orders') || '{}');
    
    let expired = 0;
    
    // Clean buy orders
    for (const element of Object.keys(buyOrders)) {
        const before = buyOrders[element].length;
        buyOrders[element] = buyOrders[element].filter(o => o.expiresAt > now);
        expired += before - buyOrders[element].length;
    }
    
    // Clean sell orders
    for (const element of Object.keys(sellOrders)) {
        const before = sellOrders[element].length;
        sellOrders[element] = sellOrders[element].filter(o => o.expiresAt > now);
        expired += before - sellOrders[element].length;
    }
    
    // Clean stop orders
    for (const element of Object.keys(stopOrders)) {
        const before = stopOrders[element].length;
        stopOrders[element] = stopOrders[element].filter(o => o.expiresAt > now);
        expired += before - stopOrders[element].length;
    }
    
    localStorage.setItem(STORAGE_KEYS.BUY_ORDERS, JSON.stringify(buyOrders));
    localStorage.setItem(STORAGE_KEYS.SELL_ORDERS, JSON.stringify(sellOrders));
    localStorage.setItem('voidfarer_stop_orders', JSON.stringify(stopOrders));
    
    if (expired > 0) {
        console.log(`Cleaned ${expired} expired orders`);
    }
}

// ===== MATCHING ENGINE =====

let matchingInterval = null;

/**
 * Start the matching engine
 */
export function startMatchingEngine() {
    if (matchingInterval) return;
    
    matchingInterval = setInterval(() => {
        try {
            // Get all elements with orders
            const buyOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUY_ORDERS) || '{}');
            const elements = new Set([
                ...Object.keys(buyOrders),
                ...Object.keys(JSON.parse(localStorage.getItem(STORAGE_KEYS.SELL_ORDERS) || '{}'))
            ]);
            
            // Match orders for each element
            elements.forEach(element => {
                matchOrders(element);
                
                // Check stop orders
                const prices = getCurrentPrices();
                if (prices[element]) {
                    checkStopOrders(element, prices[element].current);
                }
            });
            
            // Clean expired orders
            cleanExpiredOrders();
            
        } catch (error) {
            console.error('Matching engine error:', error);
        }
    }, ENGINE_CONFIG.MATCHING_INTERVAL);
}

/**
 * Stop the matching engine
 */
export function stopMatchingEngine() {
    if (matchingInterval) {
        clearInterval(matchingInterval);
        matchingInterval = null;
    }
}

// ===== NPC INTEGRATION HELPERS =====

/**
 * Get order book with NPC orders (async version for UI)
 * @param {string} element - Element name
 * @param {number} depth - Order depth
 * @returns {Promise<Object>} Combined order book
 */
export async function getOrderBookWithNPC(element, depth = ENGINE_CONFIG.ORDER_BOOK_DEPTH) {
    return await getCombinedOrderBook(element, depth);
}

/**
 * Check if an order is from an NPC
 * @param {Object} order - Order object
 * @returns {boolean} True if NPC order
 */
export function isNPCOrder(order) {
    return order.isNPC === true || order.userId?.startsWith('npc_') || order.id?.startsWith('npc_');
}

/**
 * Get trader name for display
 * @param {Object} order - Order object
 * @returns {string} Display name
 */
export function getTraderDisplayName(order) {
    if (order.isNPC) {
        return order.traderName || 'NPC Trader';
    }
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

// Initialize on load
initializeMarketEngine();

// Attach to window for global access
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

console.log('✅ market-engine.js loaded - NPC-integrated trading engine ready');

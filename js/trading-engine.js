// js/trading-engine.js - Core Trading Engine
// Processes trades, validates orders, and manages trading logic

import { ELEMENTS, getElementByName, getElementRarity } from './elements-data.js';
import { marketData } from './market-data.js';
import { orderBook, OrderSide, OrderType, OrderStatus } from './order-book.js';
import { portfolio } from './portfolio.js';
import { getCredits, addCredits, spendCredits, getCollection, addElementToCollection, removeElementFromCollection } from './storage.js';

// ===== TRADING ENGINE CONFIGURATION =====
const TRADING_CONFIG = {
    // Minimum trade size
    minTradeSize: 1,
    
    // Maximum trade size
    maxTradeSize: 9999,
    
    // Trading fees (percentage)
    tradingFee: 0.001, // 0.1% fee
    
    // Fee discount for holding certain elements
    feeDiscounts: {
        'Platinum': 0.0002, // 0.02% discount if you hold Platinum
        'Gold': 0.0001,      // 0.01% discount if you hold Gold
        'Promethium': 0.0005 // 0.05% discount if you hold Promethium
    },
    
    // Minimum credits required for trading
    minCreditsRequired: 100,
    
    // Maximum open orders per player
    maxOpenOrders: 50,
    
    // Trading hours (always open in space!)
    tradingHours: {
        open: 0,
        close: 24
    }
};

// ===== TRADE RESULT CLASS =====
export class TradeResult {
    constructor(success, message, data = {}) {
        this.success = success;
        this.message = message;
        this.timestamp = Date.now();
        this.data = data;
    }
}

// ===== TRADING ENGINE CLASS =====
export class TradingEngine {
    constructor() {
        this.activeTrades = new Map();
        this.pendingSettlements = [];
        this.dailyVolume = 0;
        this.dailyTrades = 0;
        this.lastReset = Date.now();
        
        // Start trading engine
        this.startEngine();
    }
    
    // ===== ORDER VALIDATION =====
    
    /**
     * Validate a trade order before execution
     */
    async validateOrder(playerId, side, elementName, quantity, price, orderType) {
        // Check if market is open
        if (!this.isMarketOpen()) {
            return new TradeResult(false, 'Market is currently closed');
        }
        
        // Validate element
        const element = getElementByName(elementName);
        if (!element) {
            return new TradeResult(false, 'Invalid element');
        }
        
        // Validate quantity
        if (quantity < TRADING_CONFIG.minTradeSize || quantity > TRADING_CONFIG.maxTradeSize) {
            return new TradeResult(false, `Quantity must be between ${TRADING_CONFIG.minTradeSize} and ${TRADING_CONFIG.maxTradeSize}`);
        }
        
        // Validate price for limit orders
        if (orderType === OrderType.LIMIT && price <= 0) {
            return new TradeResult(false, 'Invalid price');
        }
        
        // Check if player has enough open order slots
        const openOrders = orderBook.getUserOrders(playerId);
        if (openOrders.length >= TRADING_CONFIG.maxOpenOrders) {
            return new TradeResult(false, `Maximum ${TRADING_CONFIG.maxOpenOrders} open orders allowed`);
        }
        
        // For sell orders, check if player has enough elements
        if (side === OrderSide.SELL) {
            const collection = await getCollection(playerId);
            const owned = collection[elementName]?.count || 0;
            
            if (owned < quantity) {
                return new TradeResult(false, `Insufficient ${elementName} balance. You have ${owned}, trying to sell ${quantity}`);
            }
        }
        
        // For buy orders, check if player has enough credits
        if (side === OrderSide.BUY) {
            const credits = await getCredits(playerId);
            const totalCost = quantity * price;
            
            if (credits < totalCost) {
                return new TradeResult(false, `Insufficient credits. Need ${totalCost}⭐, you have ${credits}⭐`);
            }
            
            if (credits < TRADING_CONFIG.minCreditsRequired) {
                return new TradeResult(false, `Minimum ${TRADING_CONFIG.minCreditsRequired}⭐ required for trading`);
            }
        }
        
        return new TradeResult(true, 'Order validated');
    }
    
    // ===== ORDER EXECUTION =====
    
    /**
     * Execute a trade order
     */
    async executeOrder(playerId, side, elementName, quantity, price, orderType = OrderType.LIMIT, stopPrice = null) {
        try {
            // Validate order
            const validation = await this.validateOrder(playerId, side, elementName, quantity, price, orderType);
            if (!validation.success) {
                return validation;
            }
            
            // Calculate fees
            const fee = await this.calculateFee(playerId, quantity, price);
            
            // For market orders, execute immediately
            if (orderType === OrderType.MARKET) {
                return await this.executeMarketOrder(playerId, side, elementName, quantity, fee);
            }
            
            // For limit orders, place in order book
            const order = orderBook.placeOrder(side, elementName, quantity, price, orderType, stopPrice);
            
            // If order was a buy, reserve the credits
            if (side === OrderSide.BUY) {
                await this.reserveCredits(playerId, quantity * price);
            }
            
            // If order was a sell, reserve the elements
            if (side === OrderSide.SELL) {
                await this.reserveElements(playerId, elementName, quantity);
            }
            
            // Update daily stats
            this.updateDailyStats(quantity * price);
            
            return new TradeResult(true, 'Order placed successfully', { order });
            
        } catch (error) {
            console.error('Error executing order:', error);
            return new TradeResult(false, 'Trade execution failed: ' + error.message);
        }
    }
    
    /**
     * Execute a market order (immediate execution)
     */
    async executeMarketOrder(playerId, side, elementName, quantity, fee) {
        try {
            const element = getElementByName(elementName);
            const currentPrice = marketData.getCurrentPrice(elementName);
            const totalCost = quantity * currentPrice;
            const fee_amount = Math.floor(totalCost * fee);
            const netTotal = totalCost - fee_amount;
            
            if (side === OrderSide.BUY) {
                // Check credits
                const credits = await getCredits(playerId);
                if (credits < totalCost) {
                    return new TradeResult(false, 'Insufficient credits');
                }
                
                // Spend credits (including fee)
                await spendCredits(totalCost, playerId);
                
                // Add elements to collection
                await addElementToCollection(elementName, quantity, {
                    source: 'market',
                    price: currentPrice,
                    fee: fee_amount
                });
                
                // Record in portfolio
                portfolio.recordBuy(elementName, quantity, currentPrice);
                
                // Update market volume
                if (marketData.volume24h) {
                    marketData.volume24h[elementName] = (marketData.volume24h[elementName] || 0) + quantity;
                }
                
                return new TradeResult(true, `Bought ${quantity}x ${elementName} for ${totalCost}⭐`, {
                    element: elementName,
                    quantity,
                    price: currentPrice,
                    total: totalCost,
                    fee: fee_amount
                });
                
            } else { // SELL
                // Check balance
                const collection = await getCollection(playerId);
                const owned = collection[elementName]?.count || 0;
                
                if (owned < quantity) {
                    return new TradeResult(false, `Insufficient ${elementName}`);
                }
                
                // Remove elements
                await removeElementFromCollection(elementName, quantity);
                
                // Add credits (minus fee)
                await addCredits(netTotal, playerId);
                
                // Record in portfolio
                portfolio.recordSell(elementName, quantity, currentPrice);
                
                // Update market volume
                if (marketData.volume24h) {
                    marketData.volume24h[elementName] = (marketData.volume24h[elementName] || 0) + quantity;
                }
                
                return new TradeResult(true, `Sold ${quantity}x ${elementName} for ${netTotal}⭐`, {
                    element: elementName,
                    quantity,
                    price: currentPrice,
                    total: totalCost,
                    fee: fee_amount,
                    netTotal
                });
            }
            
        } catch (error) {
            console.error('Error executing market order:', error);
            return new TradeResult(false, 'Market order failed: ' + error.message);
        }
    }
    
    /**
     * Cancel an open order
     */
    async cancelOrder(orderId) {
        try {
            const order = orderBook.allOrders.get(orderId);
            
            if (!order) {
                return new TradeResult(false, 'Order not found');
            }
            
            // Release reserved funds/elements
            if (order.side === OrderSide.BUY) {
                await this.releaseReservedCredits(order.playerId, order.remainingQuantity * order.price);
            } else {
                await this.releaseReservedElements(order.playerId, order.elementName, order.remainingQuantity);
            }
            
            // Cancel the order
            orderBook.cancelOrder(orderId);
            
            return new TradeResult(true, 'Order cancelled successfully', { orderId });
            
        } catch (error) {
            console.error('Error cancelling order:', error);
            return new TradeResult(false, 'Cancel failed: ' + error.message);
        }
    }
    
    // ===== FEE CALCULATION =====
    
    /**
     * Calculate trading fee with potential discounts
     */
    async calculateFee(playerId, quantity, price) {
        let fee = TRADING_CONFIG.tradingFee;
        const total = quantity * price;
        
        try {
            const collection = await getCollection(playerId);
            
            // Check for fee discounts based on holdings
            for (let [element, discount] of Object.entries(TRADING_CONFIG.feeDiscounts)) {
                if (collection[element]?.count > 0) {
                    fee = Math.max(0, fee - discount);
                }
            }
            
            // Volume discount (reduces fee for large trades)
            if (total > 10000) {
                fee = fee * 0.9; // 10% discount for large trades
            } else if (total > 5000) {
                fee = fee * 0.95; // 5% discount for medium trades
            }
            
        } catch (error) {
            console.error('Error calculating fee:', error);
        }
        
        return fee;
    }
    
    // ===== RESERVATION SYSTEM =====
    
    /**
     * Reserve credits for a pending buy order
     */
    async reserveCredits(playerId, amount) {
        // In a real implementation, this would deduct from available balance
        // and add to reserved balance
        const key = `voidfarer_reserved_credits_${playerId}`;
        const currentReserved = parseInt(localStorage.getItem(key)) || 0;
        localStorage.setItem(key, (currentReserved + amount).toString());
        
        return true;
    }
    
    /**
     * Release reserved credits
     */
    async releaseReservedCredits(playerId, amount) {
        const key = `voidfarer_reserved_credits_${playerId}`;
        const currentReserved = parseInt(localStorage.getItem(key)) || 0;
        localStorage.setItem(key, Math.max(0, currentReserved - amount).toString());
        
        return true;
    }
    
    /**
     * Reserve elements for a pending sell order
     */
    async reserveElements(playerId, elementName, quantity) {
        const key = `voidfarer_reserved_${elementName}_${playerId}`;
        const currentReserved = parseInt(localStorage.getItem(key)) || 0;
        localStorage.setItem(key, (currentReserved + quantity).toString());
        
        return true;
    }
    
    /**
     * Release reserved elements
     */
    async releaseReservedElements(playerId, elementName, quantity) {
        const key = `voidfarer_reserved_${elementName}_${playerId}`;
        const currentReserved = parseInt(localStorage.getItem(key)) || 0;
        localStorage.setItem(key, Math.max(0, currentReserved - quantity).toString());
        
        return true;
    }
    
    // ===== MARKET CONDITIONS =====
    
    /**
     * Check if market is open
     */
    isMarketOpen() {
        const hour = new Date().getHours();
        return hour >= TRADING_CONFIG.tradingHours.open && hour < TRADING_CONFIG.tradingHours.close;
    }
    
    /**
     * Get market status
     */
    getMarketStatus() {
        return {
            isOpen: this.isMarketOpen(),
            openHour: TRADING_CONFIG.tradingHours.open,
            closeHour: TRADING_CONFIG.tradingHours.close,
            dailyVolume: this.dailyVolume,
            dailyTrades: this.dailyTrades
        };
    }
    
    // ===== STATISTICS TRACKING =====
    
    /**
     * Update daily trading statistics
     */
    updateDailyStats(volume) {
        // Reset daily stats if new day
        const today = new Date().setHours(0, 0, 0, 0);
        if (this.lastReset < today) {
            this.dailyVolume = 0;
            this.dailyTrades = 0;
            this.lastReset = Date.now();
        }
        
        this.dailyVolume += volume;
        this.dailyTrades++;
    }
    
    /**
     * Get trading statistics
     */
    getTradingStats() {
        return {
            dailyVolume: this.dailyVolume,
            dailyTrades: this.dailyTrades,
            averageTradeSize: this.dailyTrades > 0 ? this.dailyVolume / this.dailyTrades : 0,
            activeOrders: orderBook.allOrders ? orderBook.allOrders.size : 0,
            marketStatus: this.getMarketStatus()
        };
    }
    
    // ===== BOT TRADING =====
    
    /**
     * Generate bot trading activity to simulate real players
     */
    generateBotActivity() {
        // Only generate bots if market is open
        if (!this.isMarketOpen()) return;
        
        // Random chance to generate bot trades (10% chance per minute)
        if (Math.random() > 0.1) return;
        
        const botCount = Math.floor(Math.random() * 5) + 1; // 1-5 bots
        
        for (let i = 0; i < botCount; i++) {
            this.executeBotTrade();
        }
    }
    
    /**
     * Execute a single bot trade
     */
    async executeBotTrade() {
        try {
            // Random element
            const element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
            const elementName = element.name;
            
            // Random side (slightly weighted toward buys for natural upward drift)
            const side = Math.random() < 0.55 ? OrderSide.BUY : OrderSide.SELL;
            
            // Random quantity (smaller for rare elements)
            const rarity = element.rarity;
            const maxQty = rarity === 'common' ? 100 :
                          rarity === 'uncommon' ? 50 :
                          rarity === 'rare' ? 20 :
                          rarity === 'very-rare' ? 10 : 5;
            
            const quantity = Math.floor(Math.random() * maxQty) + 1;
            
            // Get current price
            const currentPrice = marketData.getCurrentPrice(elementName);
            
            // Random price variation (-2% to +2%)
            const priceVariation = 0.98 + (Math.random() * 0.04);
            const orderPrice = Math.round(currentPrice * priceVariation);
            
            // Bot player ID
            const botId = 'bot_' + Math.random().toString(36).substr(2, 9);
            
            // Place order (don't await to avoid blocking)
            if (side === OrderSide.BUY) {
                orderBook.placeOrder(OrderSide.BUY, elementName, quantity, orderPrice);
            } else {
                orderBook.placeOrder(OrderSide.SELL, elementName, quantity, orderPrice);
            }
            
        } catch (error) {
            // Silently fail for bots
        }
    }
    
    // ===== TRADE SETTLEMENT =====
    
    /**
     * Settle a completed trade
     */
    async settleTrade(trade) {
        try {
            // Validate trade object
            if (!trade) {
                console.error('Invalid trade: trade is null or undefined');
                return new TradeResult(false, 'Invalid trade');
            }
            
            // Extract order details with null checks
            const buyOrder = trade.buyOrderId ? { playerId: trade.buyerId } : null;
            const sellOrder = trade.sellOrderId ? { playerId: trade.sellerId } : null;
            
            // Skip if no valid orders
            if (!buyOrder && !sellOrder) {
                console.error('Invalid trade: no valid orders');
                return new TradeResult(false, 'Invalid trade orders');
            }
            
            const quantity = trade.quantity || 0;
            const price = trade.price || 0;
            const elementName = trade.elementName || 'unknown';
            
            if (quantity <= 0 || price <= 0) {
                console.error('Invalid trade: quantity or price is zero');
                return new TradeResult(false, 'Invalid trade quantity or price');
            }
            
            // Calculate fees for both parties
            let buyerFee = 0;
            let sellerFee = 0;
            
            if (buyOrder) {
                buyerFee = await this.calculateFee(trade.buyerId, quantity, price);
            }
            
            if (sellOrder) {
                sellerFee = await this.calculateFee(trade.sellerId, quantity, price);
            }
            
            const buyerFeeAmount = Math.floor(quantity * price * buyerFee);
            const sellerFeeAmount = Math.floor(quantity * price * sellerFee);
            
            // Release reserved credits from buyer if exists
            if (buyOrder) {
                await this.releaseReservedCredits(trade.buyerId, quantity * price);
            }
            
            // Release reserved elements from seller if exists
            if (sellOrder) {
                await this.releaseReservedElements(trade.sellerId, elementName, quantity);
            }
            
            // Record in portfolio for both parties
            if (buyOrder && trade.buyerId?.startsWith('player')) {
                try {
                    portfolio.recordBuy(elementName, quantity, price);
                } catch (e) {
                    console.error('Error recording buy in portfolio:', e);
                }
            }
            
            if (sellOrder && trade.sellerId?.startsWith('player')) {
                try {
                    portfolio.recordSell(elementName, quantity, price);
                } catch (e) {
                    console.error('Error recording sell in portfolio:', e);
                }
            }
            
            // Update market data
            if (marketData.volume24h) {
                marketData.volume24h[elementName] = (marketData.volume24h[elementName] || 0) + quantity;
            }
            
            console.log(`✅ Trade settled: ${quantity}x ${elementName} at ${price}⭐`);
            
            return new TradeResult(true, 'Trade settled successfully', { trade });
            
        } catch (error) {
            console.error('Error settling trade:', error);
            return new TradeResult(false, 'Trade settlement failed: ' + error.message);
        }
    }
    
    // ===== ENGINE STARTUP =====
    
    /**
     * Start the trading engine
     */
    startEngine() {
        console.log('⚙️ Trading engine started');
        
        // Process settlements every second
        setInterval(() => {
            this.processSettlements();
        }, 1000);
        
        // Generate bot activity every minute
        setInterval(() => {
            this.generateBotActivity();
        }, 60 * 1000);
        
        // Reset daily stats at midnight
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                this.dailyVolume = 0;
                this.dailyTrades = 0;
            }
        }, 60 * 1000);
        
        // Listen for trade events from order book
        if (typeof window !== 'undefined') {
            window.addEventListener('trade-executed', (e) => {
                if (e.detail && e.detail.trade) {
                    this.settleTrade(e.detail.trade);
                }
            });
        }
    }
    
    /**
     * Process pending settlements
     */
    processSettlements() {
        // Ensure pendingSettlements exists
        if (!this.pendingSettlements) {
            this.pendingSettlements = [];
            return;
        }
        
        // This would handle any pending settlements
        if (this.pendingSettlements.length > 0) {
            console.log(`Processing ${this.pendingSettlements.length} settlements...`);
            this.pendingSettlements = [];
        }
    }
}

// ===== TRADING UI HELPER FUNCTIONS =====

/**
 * Format trade result for display
 */
export function formatTradeResult(result) {
    if (!result.success) {
        return {
            type: 'error',
            message: result.message,
            icon: '❌'
        };
    }
    
    if (result.data.order) {
        return {
            type: 'success',
            message: result.message,
            icon: '📝',
            orderId: result.data.order.id
        };
    }
    
    if (result.data.element) {
        return {
            type: 'success',
            message: result.message,
            icon: '💰',
            details: `${result.data.quantity}x ${result.data.element} @ ${result.data.price}⭐`
        };
    }
    
    return {
        type: 'success',
        message: result.message,
        icon: '✅'
    };
}

/**
 * Calculate max affordable quantity
 */
export function calculateMaxBuy(credits, price) {
    return Math.floor(credits / price);
}

/**
 * Calculate max sellable quantity
 */
export function calculateMaxSell(collection, elementName) {
    return collection[elementName]?.count || 0;
}

/**
 * Get price impact for large orders
 */
export function getPriceImpact(quantity, elementName) {
    const element = getElementByName(elementName);
    if (!element) return 0;
    
    const avgVolume = marketData.getVolume24h(elementName) || 1000;
    const impact = (quantity / avgVolume) * 100;
    
    return Math.min(impact, 10); // Max 10% impact
}

/**
 * Get estimated execution price including slippage
 */
export function getEstimatedPrice(elementName, quantity, side) {
    const currentPrice = marketData.getCurrentPrice(elementName);
    const impact = getPriceImpact(quantity, elementName) / 100;
    
    if (side === OrderSide.BUY) {
        return Math.round(currentPrice * (1 + impact * 0.5));
    } else {
        return Math.round(currentPrice * (1 - impact * 0.5));
    }
}

// ===== EXPORT SINGLETON INSTANCE =====
export const tradingEngine = new TradingEngine();

// ===== DEFAULT EXPORT =====
export default tradingEngine;

// js/order-book.js - Professional Order Book System
// Manages buy/sell orders, market depth, and trade execution

import { getElementByName, getElementRarity } from './elements-data.js';
import { marketData } from './market-data.js';
import { getCollection, addElementToCollection, removeElementFromCollection } from './storage.js';

// ===== ORDER BOOK CONFIGURATION =====
const ORDER_BOOK_CONFIG = {
    // Maximum number of orders per price level
    maxOrdersPerLevel: 50,
    
    // Order expiry time (milliseconds)
    orderExpiry: 24 * 60 * 60 * 1000, // 24 hours
    
    // Minimum order size
    minOrderSize: 1,
    
    // Maximum order size
    maxOrderSize: 9999,
    
    // Price levels to display
    displayLevels: 10,
    
    // Spread multiplier by rarity
    spreadMultiplier: {
        'common': 0.005,      // 0.5% spread
        'uncommon': 0.01,     // 1% spread
        'rare': 0.02,         // 2% spread
        'very-rare': 0.03,    // 3% spread
        'legendary': 0.05     // 5% spread
    }
};

// ===== ORDER TYPES =====
export const OrderType = {
    LIMIT: 'limit',
    MARKET: 'market',
    STOP: 'stop',
    STOP_LIMIT: 'stop-limit'
};

// ===== ORDER SIDE =====
export const OrderSide = {
    BUY: 'buy',
    SELL: 'sell'
};

// ===== ORDER STATUS =====
export const OrderStatus = {
    PENDING: 'pending',
    PARTIAL: 'partial',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired'
};

// ===== ORDER CLASS =====
export class Order {
    constructor(side, elementName, quantity, price, orderType = OrderType.LIMIT, stopPrice = null) {
        this.id = 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.side = side;
        this.elementName = elementName;
        this.quantity = quantity;
        this.remainingQuantity = quantity;
        this.price = price;
        this.orderType = orderType;
        this.stopPrice = stopPrice;
        this.status = OrderStatus.PENDING;
        this.createdAt = Date.now();
        this.expiresAt = Date.now() + ORDER_BOOK_CONFIG.orderExpiry;
        this.filledQuantity = 0;
        this.averageFillPrice = 0;
        this.trades = [];
        this.playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
    }
    
    // Check if order is expired
    isExpired() {
        return Date.now() > this.expiresAt;
    }
    
    // Check if order is fully filled
    isFilled() {
        return this.remainingQuantity <= 0;
    }
    
    // Get fill percentage
    getFillPercentage() {
        return (this.filledQuantity / this.quantity) * 100;
    }
}

// ===== TRADE CLASS =====
export class Trade {
    constructor(buyOrder, sellOrder, quantity, price) {
        this.id = 'trade_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.buyOrderId = buyOrder?.id || 'unknown';
        this.sellOrderId = sellOrder?.id || 'unknown';
        this.elementName = buyOrder?.elementName || sellOrder?.elementName || 'unknown';
        this.quantity = quantity;
        this.price = price;
        this.total = quantity * price;
        this.timestamp = Date.now();
        this.buyerId = buyOrder?.playerId || 'system';
        this.sellerId = sellOrder?.playerId || 'system';
    }
}

// ===== ORDER BOOK CLASS =====
export class OrderBook {
    constructor() {
        this.bids = new Map();      // Buy orders grouped by price
        this.asks = new Map();      // Sell orders grouped by price
        this.allOrders = new Map(); // All orders by ID
        this.tradeHistory = [];      // Recent trades
        this.maxTradeHistory = 100;   // Keep last 100 trades
        
        // Load saved orders from storage
        this.loadOrders();
        
        // Start order processing
        this.startOrderProcessing();
    }
    
    // ===== ORDER MANAGEMENT =====
    
    /**
     * Place a new order
     */
    placeOrder(side, elementName, quantity, price, orderType = OrderType.LIMIT, stopPrice = null) {
        // Validate element
        const element = getElementByName(elementName);
        if (!element) {
            throw new Error('Invalid element');
        }
        
        // Validate quantity
        if (quantity < ORDER_BOOK_CONFIG.minOrderSize || quantity > ORDER_BOOK_CONFIG.maxOrderSize) {
            throw new Error(`Quantity must be between ${ORDER_BOOK_CONFIG.minOrderSize} and ${ORDER_BOOK_CONFIG.maxOrderSize}`);
        }
        
        // Validate price for limit orders
        if (orderType === OrderType.LIMIT && price <= 0) {
            throw new Error('Invalid price');
        }
        
        // Create order
        const order = new Order(side, elementName, quantity, price, orderType, stopPrice);
        
        // Check if order can be executed immediately
        if (orderType === OrderType.MARKET) {
            return this.executeMarketOrder(order);
        }
        
        // For limit orders, add to order book
        this.addToOrderBook(order);
        
        // Try to match immediately
        this.matchOrders(elementName);
        
        // Save orders
        this.saveOrders();
        
        return order;
    }
    
    /**
     * Add order to the book
     */
    addToOrderBook(order) {
        const orderMap = order.side === OrderSide.BUY ? this.bids : this.asks;
        const priceLevel = order.price;
        
        if (!orderMap.has(priceLevel)) {
            orderMap.set(priceLevel, []);
        }
        
        const ordersAtPrice = orderMap.get(priceLevel);
        ordersAtPrice.push(order);
        
        // Limit number of orders per price level
        if (ordersAtPrice.length > ORDER_BOOK_CONFIG.maxOrdersPerLevel) {
            // Remove oldest order
            const removedOrder = ordersAtPrice.shift();
            removedOrder.status = OrderStatus.CANCELLED;
        }
        
        this.allOrders.set(order.id, order);
    }
    
    /**
     * Execute a market order
     */
    executeMarketOrder(order) {
        const oppositeMap = order.side === OrderSide.BUY ? this.asks : this.bids;
        const element = order.elementName;
        
        // Get all opposite orders sorted by price
        const oppositeOrders = [];
        for (let [price, orders] of oppositeMap.entries()) {
            orders.forEach(o => {
                if (o.elementName === element && o.status === OrderStatus.PENDING) {
                    oppositeOrders.push({ order: o, price });
                }
            });
        }
        
        // Sort orders by price (best price first)
        if (order.side === OrderSide.BUY) {
            oppositeOrders.sort((a, b) => a.price - b.price); // Lowest ask first
        } else {
            oppositeOrders.sort((a, b) => b.price - a.price); // Highest bid first
        }
        
        let remainingQuantity = order.quantity;
        let totalCost = 0;
        let filledQuantity = 0;
        
        // Execute against best prices until filled
        for (let { order: oppositeOrder, price } of oppositeOrders) {
            if (remainingQuantity <= 0) break;
            
            const matchQuantity = Math.min(remainingQuantity, oppositeOrder.remainingQuantity);
            
            // Execute trade
            const trade = this.executeTrade(order, oppositeOrder, matchQuantity, price);
            
            remainingQuantity -= matchQuantity;
            totalCost += matchQuantity * price;
            filledQuantity += matchQuantity;
            
            // Update order status
            if (oppositeOrder.isFilled()) {
                oppositeOrder.status = OrderStatus.COMPLETED;
                this.removeFromOrderBook(oppositeOrder);
            }
        }
        
        // Update market order
        order.filledQuantity = filledQuantity;
        order.remainingQuantity = order.quantity - filledQuantity;
        order.averageFillPrice = filledQuantity > 0 ? totalCost / filledQuantity : 0;
        
        if (order.isFilled()) {
            order.status = OrderStatus.COMPLETED;
        } else if (filledQuantity > 0) {
            order.status = OrderStatus.PARTIAL;
        } else {
            order.status = OrderStatus.CANCELLED;
            throw new Error('No matching orders found');
        }
        
        // Save trades
        this.saveOrders();
        
        return order;
    }
    
    /**
     * Execute a trade between two orders
     */
    executeTrade(buyOrder, sellOrder, quantity, price) {
        // Validate both orders are for same element
        if (buyOrder.elementName !== sellOrder.elementName) {
            throw new Error('Element mismatch');
        }
        
        // Create trade record
        const trade = new Trade(buyOrder, sellOrder, quantity, price);
        
        // Update orders
        buyOrder.remainingQuantity -= quantity;
        buyOrder.filledQuantity += quantity;
        buyOrder.trades.push(trade);
        
        sellOrder.remainingQuantity -= quantity;
        sellOrder.filledQuantity += quantity;
        sellOrder.trades.push(trade);
        
        // Add to trade history
        this.tradeHistory.unshift(trade);
        if (this.tradeHistory.length > this.maxTradeHistory) {
            this.tradeHistory.pop();
        }
        
        // Dispatch trade event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('trade-executed', {
                detail: { trade: trade }
            }));
        }
        
        console.log(`💰 Trade executed: ${quantity}x ${buyOrder.elementName} at ${price}⭐ (Total: ${quantity * price}⭐)`);
        
        return trade;
    }
    
    /**
     * Match orders for an element
     */
    matchOrders(elementName) {
        const elementBids = [];
        const elementAsks = [];
        
        // Collect all bids and asks for this element
        for (let [price, orders] of this.bids.entries()) {
            orders.forEach(order => {
                if (order.elementName === elementName && order.status === OrderStatus.PENDING) {
                    elementBids.push({ order, price });
                }
            });
        }
        
        for (let [price, orders] of this.asks.entries()) {
            orders.forEach(order => {
                if (order.elementName === elementName && order.status === OrderStatus.PENDING) {
                    elementAsks.push({ order, price });
                }
            });
        }
        
        // Sort bids (highest first) and asks (lowest first)
        elementBids.sort((a, b) => b.price - a.price);
        elementAsks.sort((a, b) => a.price - b.price);
        
        // Match orders
        let bidIndex = 0;
        let askIndex = 0;
        
        while (bidIndex < elementBids.length && askIndex < elementAsks.length) {
            const bid = elementBids[bidIndex];
            const ask = elementAsks[askIndex];
            
            // Check if prices cross (bid >= ask)
            if (bid.price >= ask.price) {
                // Execute trade at ask price (aggressive order gets worse price)
                const matchPrice = ask.price;
                const matchQuantity = Math.min(
                    bid.order.remainingQuantity,
                    ask.order.remainingQuantity
                );
                
                // Execute trade
                this.executeTrade(bid.order, ask.order, matchQuantity, matchPrice);
                
                // Check if orders are filled
                if (bid.order.isFilled()) {
                    bid.order.status = OrderStatus.COMPLETED;
                    this.removeFromOrderBook(bid.order);
                    bidIndex++;
                }
                
                if (ask.order.isFilled()) {
                    ask.order.status = OrderStatus.COMPLETED;
                    this.removeFromOrderBook(ask.order);
                    askIndex++;
                }
            } else {
                // No more matches possible
                break;
            }
        }
    }
    
    /**
     * Remove order from book
     */
    removeFromOrderBook(order) {
        const orderMap = order.side === OrderSide.BUY ? this.bids : this.asks;
        const priceLevel = order.price;
        
        if (orderMap.has(priceLevel)) {
            const orders = orderMap.get(priceLevel);
            const index = orders.findIndex(o => o.id === order.id);
            
            if (index !== -1) {
                orders.splice(index, 1);
            }
            
            // Remove price level if empty
            if (orders.length === 0) {
                orderMap.delete(priceLevel);
            }
        }
    }
    
    /**
     * Cancel an order
     */
    cancelOrder(orderId) {
        const order = this.allOrders.get(orderId);
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PARTIAL) {
            throw new Error('Order cannot be cancelled');
        }
        
        order.status = OrderStatus.CANCELLED;
        this.removeFromOrderBook(order);
        this.saveOrders();
        
        return order;
    }
    
    /**
     * Get order book snapshot for an element
     */
    getOrderBook(elementName, levels = ORDER_BOOK_CONFIG.displayLevels) {
        const bids = [];
        const asks = [];
        
        // Get bids (buy orders)
        const bidPrices = Array.from(this.bids.keys()).sort((a, b) => b - a);
        for (let price of bidPrices.slice(0, levels)) {
            const orders = this.bids.get(price).filter(o => 
                o.elementName === elementName && o.status === OrderStatus.PENDING
            );
            
            if (orders.length > 0) {
                const totalQuantity = orders.reduce((sum, o) => sum + o.remainingQuantity, 0);
                bids.push({
                    price,
                    quantity: totalQuantity,
                    orderCount: orders.length
                });
            }
        }
        
        // Get asks (sell orders)
        const askPrices = Array.from(this.asks.keys()).sort((a, b) => a - b);
        for (let price of askPrices.slice(0, levels)) {
            const orders = this.asks.get(price).filter(o => 
                o.elementName === elementName && o.status === OrderStatus.PENDING
            );
            
            if (orders.length > 0) {
                const totalQuantity = orders.reduce((sum, o) => sum + o.remainingQuantity, 0);
                asks.push({
                    price,
                    quantity: totalQuantity,
                    orderCount: orders.length
                });
            }
        }
        
        // Calculate spread
        let spread = 0;
        let spreadPercentage = 0;
        
        if (bids.length > 0 && asks.length > 0) {
            const bestBid = bids[0].price;
            const bestAsk = asks[0].price;
            spread = bestAsk - bestBid;
            spreadPercentage = (spread / bestBid) * 100;
        }
        
        return {
            element: elementName,
            bids,
            asks,
            spread,
            spreadPercentage,
            timestamp: Date.now()
        };
    }
    
    /**
     * Get market depth for visualization
     */
    getMarketDepth(elementName) {
        const snapshot = this.getOrderBook(elementName, 20);
        
        // Calculate cumulative depth
        let bidCumulative = 0;
        let askCumulative = 0;
        
        const bidDepth = snapshot.bids.map(level => {
            bidCumulative += level.quantity;
            return {
                price: level.price,
                quantity: level.quantity,
                cumulative: bidCumulative
            };
        });
        
        const askDepth = snapshot.asks.map(level => {
            askCumulative += level.quantity;
            return {
                price: level.price,
                quantity: level.quantity,
                cumulative: askCumulative
            };
        });
        
        return {
            bids: bidDepth,
            asks: askDepth,
            maxCumulative: Math.max(bidCumulative, askCumulative)
        };
    }
    
    /**
     * Get recent trades for an element
     */
    getTradeHistory(elementName, limit = 20) {
        return this.tradeHistory
            .filter(t => t.elementName === elementName)
            .slice(0, limit);
    }
    
    /**
     * Get user's open orders
     */
    getUserOrders(playerId = null) {
        const userId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const orders = [];
        
        for (let order of this.allOrders.values()) {
            if (order.playerId === userId && 
                order.status !== OrderStatus.COMPLETED && 
                order.status !== OrderStatus.CANCELLED) {
                orders.push(order);
            }
        }
        
        // Sort by creation date (newest first)
        orders.sort((a, b) => b.createdAt - a.createdAt);
        
        return orders;
    }
    
    /**
     * Get user's order history
     */
    getUserOrderHistory(playerId = null, limit = 50) {
        const userId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const orders = [];
        
        for (let order of this.allOrders.values()) {
            if (order.playerId === userId) {
                orders.push(order);
            }
        }
        
        // Sort by creation date (newest first)
        orders.sort((a, b) => b.createdAt - a.createdAt);
        
        return orders.slice(0, limit);
    }
    
    /**
     * Clean up expired orders
     */
    cleanupExpiredOrders() {
        const now = Date.now();
        
        for (let order of this.allOrders.values()) {
            // Check if order has isExpired method (for loaded orders)
            if (typeof order.isExpired === 'function') {
                if (order.status === OrderStatus.PENDING && order.isExpired()) {
                    order.status = OrderStatus.EXPIRED;
                    this.removeFromOrderBook(order);
                }
            } else {
                // Fallback for older orders without the method
                if (order.status === OrderStatus.PENDING && now > order.expiresAt) {
                    order.status = OrderStatus.EXPIRED;
                    this.removeFromOrderBook(order);
                }
            }
        }
        
        this.saveOrders();
    }
    
    /**
     * Start order processing interval
     */
    startOrderProcessing() {
        // Match orders every 2 seconds
        setInterval(() => {
            // Get all unique elements with orders
            const elements = new Set();
            
            for (let [price, orders] of this.bids.entries()) {
                orders.forEach(o => elements.add(o.elementName));
            }
            
            for (let [price, orders] of this.asks.entries()) {
                orders.forEach(o => elements.add(o.elementName));
            }
            
            // Match orders for each element
            elements.forEach(elementName => {
                this.matchOrders(elementName);
            });
            
            // Clean up expired orders every minute
            this.cleanupExpiredOrders();
            
            // Save orders periodically
            this.saveOrders();
            
        }, 2000);
    }
    
    // ===== PERSISTENCE =====
    
    /**
     * Save orders to localStorage
     */
    saveOrders() {
        try {
            const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
            const key = `voidfarer_orders_${playerId}`;
            
            const data = {
                bids: Array.from(this.bids.entries()),
                asks: Array.from(this.asks.entries()),
                orders: Array.from(this.allOrders.entries()),
                tradeHistory: this.tradeHistory,
                timestamp: Date.now()
            };
            
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving orders:', error);
        }
    }
    
    /**
     * Load orders from localStorage
     */
    loadOrders() {
        try {
            const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
            const key = `voidfarer_orders_${playerId}`;
            const saved = localStorage.getItem(key);
            
            if (saved) {
                const data = JSON.parse(saved);
                
                // Restore maps
                this.bids = new Map(data.bids);
                this.asks = new Map(data.asks);
                
                // Restore orders and ensure they have all methods
                const ordersArray = data.orders || [];
                this.allOrders = new Map();
                
                ordersArray.forEach(([id, orderData]) => {
                    // Recreate Order instance to ensure methods exist
                    const order = new Order(
                        orderData.side,
                        orderData.elementName,
                        orderData.quantity,
                        orderData.price,
                        orderData.orderType,
                        orderData.stopPrice
                    );
                    
                    // Copy over properties
                    order.id = orderData.id;
                    order.remainingQuantity = orderData.remainingQuantity;
                    order.status = orderData.status;
                    order.createdAt = orderData.createdAt;
                    order.expiresAt = orderData.expiresAt;
                    order.filledQuantity = orderData.filledQuantity;
                    order.averageFillPrice = orderData.averageFillPrice;
                    order.trades = orderData.trades || [];
                    order.playerId = orderData.playerId;
                    
                    this.allOrders.set(id, order);
                });
                
                this.tradeHistory = data.tradeHistory || [];
                
                console.log('📚 Orders loaded:', this.allOrders.size, 'active orders');
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }
}

// ===== ORDER BOOK UI HELPER FUNCTIONS =====

/**
 * Format order book for display
 */
export function formatOrderBookForDisplay(orderBook) {
    const bids = orderBook.bids.map(level => ({
        price: level.price.toLocaleString() + ' ⭐',
        quantity: level.quantity.toLocaleString(),
        total: (level.price * level.quantity).toLocaleString() + ' ⭐'
    }));
    
    const asks = orderBook.asks.map(level => ({
        price: level.price.toLocaleString() + ' ⭐',
        quantity: level.quantity.toLocaleString(),
        total: (level.price * level.quantity).toLocaleString() + ' ⭐'
    }));
    
    return {
        bids,
        asks,
        spread: orderBook.spread.toLocaleString() + ' ⭐',
        spreadPercentage: orderBook.spreadPercentage.toFixed(2) + '%'
    };
}

/**
 * Generate depth chart data
 */
export function generateDepthChartData(depth) {
    const bidPoints = depth.bids.map(level => ({
        x: level.price,
        y: level.cumulative
    }));
    
    const askPoints = depth.asks.map(level => ({
        x: level.price,
        y: level.cumulative
    }));
    
    return {
        bidSeries: bidPoints,
        askSeries: askPoints,
        maxX: Math.max(...depth.asks.map(a => a.price), ...depth.bids.map(b => b.price)),
        maxY: depth.maxCumulative
    };
}

// ===== EXPORT SINGLETON INSTANCE =====
export const orderBook = new OrderBook();

// ===== DEFAULT EXPORT =====
export default orderBook;

// js/market-dynamics.js - Dynamic market pricing and product listings for Voidfarer
// Handles price fluctuations, supply/demand, and product availability

import { PRODUCT_CATALOG, getProductById, getProductsByCategory } from './product-catalog.js';

// ===== MARKET CONFIGURATION =====

const MARKET_CONFIG = {
    BASE_VOLATILITY: 0.05, // 5% base price volatility
    EVENT_VOLATILITY: 0.15, // 15% additional volatility during events
    TREND_STRENGTH: 0.7, // How strongly trends persist
    UPDATE_INTERVAL: 3600000, // 1 hour in milliseconds
    MAX_PRICE_HISTORY: 30, // Keep 30 days of history
    MIN_PRICE_MULTIPLIER: 0.3, // Minimum price (30% of base)
    MAX_PRICE_MULTIPLIER: 3.0, // Maximum price (300% of base)
    DEFAULT_TRANSACTION_FEE: 0.02, // 2% transaction fee
    MARKET_HOURS: 24, // Market open 24/7
};

// ===== STORAGE KEYS =====

const STORAGE_KEYS = {
    PRICE_HISTORY: 'voidfarer_price_history',
    CURRENT_PRICES: 'voidfarer_current_prices',
    MARKET_TRENDS: 'voidfarer_market_trends',
    LAST_UPDATE: 'voidfarer_market_last_update',
    PLAYER_PRODUCTS: 'voidfarer_player_products',
    MARKET_LISTINGS: 'voidfarer_market_listings',
    TRANSACTION_HISTORY: 'voidfarer_transaction_history'
};

// ===== PRICE MANAGEMENT =====

/**
 * Initialize market data
 */
export function initializeMarket() {
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_PRICES)) {
        const initialPrices = {};
        
        // Initialize prices for all products
        for (const product of Object.values(PRODUCT_CATALOG)) {
            initialPrices[product.id] = {
                current: product.basePrice,
                base: product.basePrice,
                trend: 0,
                volatility: MARKET_CONFIG.BASE_VOLATILITY,
                lastUpdated: Date.now()
            };
        }
        
        localStorage.setItem(STORAGE_KEYS.CURRENT_PRICES, JSON.stringify(initialPrices));
        localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify({}));
        localStorage.setItem(STORAGE_KEYS.MARKET_TRENDS, JSON.stringify({}));
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.PLAYER_PRODUCTS)) {
        localStorage.setItem(STORAGE_KEYS.PLAYER_PRODUCTS, JSON.stringify({}));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTION_HISTORY)) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTION_HISTORY, JSON.stringify([]));
    }
    
    console.log('Market system initialized');
}

/**
 * Update prices based on market dynamics
 * @param {Array} activeEvents - Active economic events
 * @returns {Object} Updated prices
 */
export function updatePrices(activeEvents = []) {
    const prices = getCurrentPrices();
    const trends = getMarketTrends();
    const now = Date.now();
    const lastUpdate = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_UPDATE)) || now;
    const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate < 1) return prices; // Update at most once per hour
    
    // Calculate event effects
    const eventEffects = calculateEventEffects(activeEvents);
    
    // Update each product's price
    for (const [productId, priceData] of Object.entries(prices)) {
        const product = getProductById(productId);
        if (!product) continue;
        
        // Get current trend
        let trend = trends[productId] || 0;
        
        // Apply random walk
        const randomFactor = (Math.random() - 0.5) * 2 * priceData.volatility;
        
        // Apply event effects
        const eventMultiplier = eventEffects[product.category] || 1.0;
        
        // Calculate new price
        let newPrice = priceData.current * (1 + trend * MARKET_CONFIG.TREND_STRENGTH + randomFactor) * eventMultiplier;
        
        // Ensure price stays within bounds
        newPrice = Math.max(
            priceData.base * MARKET_CONFIG.MIN_PRICE_MULTIPLIER,
            Math.min(priceData.base * MARKET_CONFIG.MAX_PRICE_MULTIPLIER, newPrice)
        );
        
        // Update trend (mean reversion)
        trend = trend * 0.9 + (newPrice - priceData.base) / priceData.base * 0.1;
        
        // Store updated data
        priceData.current = newPrice;
        priceData.trend = trend;
        priceData.lastUpdated = now;
        trends[productId] = trend;
        
        // Add to price history
        addToPriceHistory(productId, newPrice, now);
    }
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_PRICES, JSON.stringify(prices));
    localStorage.setItem(STORAGE_KEYS.MARKET_TRENDS, JSON.stringify(trends));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, now.toString());
    
    return prices;
}

/**
 * Calculate event effects on prices
 * @param {Array} events - Active economic events
 * @returns {Object} Category multipliers
 */
function calculateEventEffects(events) {
    const effects = {};
    
    for (const event of events) {
        if (event.priceMultiplier) {
            if (event.affectedCategory) {
                effects[event.affectedCategory] = (effects[event.affectedCategory] || 1.0) * event.priceMultiplier;
            } else {
                // Apply to all categories
                for (const category of ['Ships', 'Equipment', 'Infrastructure', 'Ship Upgrades']) {
                    effects[category] = (effects[category] || 1.0) * event.priceMultiplier;
                }
            }
        }
    }
    
    return effects;
}

/**
 * Get current market prices
 * @returns {Object} Current prices
 */
export function getCurrentPrices() {
    const prices = localStorage.getItem(STORAGE_KEYS.CURRENT_PRICES);
    return prices ? JSON.parse(prices) : {};
}

/**
 * Get price for a specific product
 * @param {string} productId - Product ID
 * @returns {number} Current price
 */
export function getProductPrice(productId) {
    const prices = getCurrentPrices();
    return prices[productId]?.current || PRODUCT_CATALOG[productId]?.basePrice || 0;
}

/**
 * Get price multiplier for a product (current/base)
 * @param {string} productId - Product ID
 * @returns {number} Price multiplier
 */
export function getPriceMultiplier(productId) {
    const prices = getCurrentPrices();
    const priceData = prices[productId];
    if (!priceData) return 1.0;
    return priceData.current / priceData.base;
}

/**
 * Add price to history
 * @param {string} productId - Product ID
 * @param {number} price - Price
 * @param {number} timestamp - Timestamp
 */
function addToPriceHistory(productId, price, timestamp) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY) || '{}');
    
    if (!history[productId]) {
        history[productId] = [];
    }
    
    history[productId].push({
        price: Math.round(price),
        timestamp: timestamp,
        date: new Date(timestamp).toISOString()
    });
    
    // Keep only last MAX_PRICE_HISTORY entries
    if (history[productId].length > MARKET_CONFIG.MAX_PRICE_HISTORY) {
        history[productId].shift();
    }
    
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(history));
}

/**
 * Get price history for a product
 * @param {string} productId - Product ID
 * @param {number} days - Number of days of history
 * @returns {Array} Price history
 */
export function getPriceHistory(productId, days = 7) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY) || '{}');
    const productHistory = history[productId] || [];
    
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return productHistory.filter(h => h.timestamp >= cutoff);
}

/**
 * Get market trends
 * @returns {Object} Market trends
 */
export function getMarketTrends() {
    const trends = localStorage.getItem(STORAGE_KEYS.MARKET_TRENDS);
    return trends ? JSON.parse(trends) : {};
}

// ===== PRODUCT LISTINGS =====

/**
 * Get available products for sale
 * @param {string} category - Optional category filter
 * @returns {Array} Available products with current prices
 */
export function getAvailableProducts(category = null) {
    const products = [];
    const prices = getCurrentPrices();
    
    for (const [id, product] of Object.entries(PRODUCT_CATALOG)) {
        if (category && product.category !== category) continue;
        
        const priceData = prices[id] || {
            current: product.basePrice,
            base: product.basePrice
        };
        
        products.push({
            ...product,
            currentPrice: Math.round(priceData.current),
            priceMultiplier: priceData.current / product.basePrice,
            inStock: true // All products are always available (could add scarcity later)
        });
    }
    
    return products;
}

/**
 * Get products by category with current prices
 * @param {string} category - Product category
 * @returns {Array} Products in category
 */
export function getProductsByCategoryWithPrices(category) {
    const products = getProductsByCategory(category);
    const prices = getCurrentPrices();
    
    return products.map(product => {
        const priceData = prices[product.id] || {
            current: product.basePrice,
            base: product.basePrice
        };
        
        return {
            ...product,
            currentPrice: Math.round(priceData.current),
            priceMultiplier: priceData.current / product.basePrice
        };
    });
}

/**
 * Check if player can afford a product
 * @param {string} productId - Product ID
 * @param {number} playerCredits - Player's credits
 * @returns {boolean} True if affordable
 */
export function canAffordProduct(productId, playerCredits) {
    const price = getProductPrice(productId);
    return playerCredits >= price;
}

/**
 * Check if player meets skill requirements for a product
 * @param {string} productId - Product ID
 * @param {Object} playerSkills - Player's skill progress
 * @returns {Object} Qualification result
 */
export function checkSkillRequirements(productId, playerSkills) {
    const product = getProductById(productId);
    if (!product || !product.skillRequirements) {
        return { qualified: true, percent: 100 };
    }
    
    let totalQualification = 0;
    let maxPossible = 0;
    const requirements = [];
    
    for (const [skill, required] of Object.entries(product.skillRequirements)) {
        const progress = playerSkills[skill] || 0;
        const level = getLevelFromProgress(progress);
        
        // Qualification based on progress relative to requirement
        const qualification = Math.min(1.0, progress / (required * 10));
        const weightedQual = qualification * (required / 100);
        
        totalQualification += weightedQual;
        maxPossible += required / 100;
        
        requirements.push({
            skill: skill,
            required: required,
            current: progress,
            level: level.name,
            qualification: qualification
        });
    }
    
    const qualificationPercent = maxPossible > 0 ? (totalQualification / maxPossible) * 100 : 100;
    
    return {
        qualified: qualificationPercent >= 50, // 50% qualifies
        percent: Math.min(100, Math.round(qualificationPercent)),
        requirements: requirements
    };
}

// ===== PURCHASE HANDLING =====

/**
 * Process a product purchase
 * @param {string} productId - Product ID
 * @param {string} playerId - Player ID
 * @param {number} playerCredits - Player's current credits
 * @returns {Object} Purchase result
 */
export async function purchaseProduct(productId, playerId, playerCredits) {
    const product = getProductById(productId);
    if (!product) {
        return { success: false, reason: 'Product not found' };
    }
    
    const price = getProductPrice(productId);
    
    if (playerCredits < price) {
        return { success: false, reason: 'Insufficient credits' };
    }
    
    // Add to player's products
    const playerProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYER_PRODUCTS) || '{}');
    
    if (!playerProducts[playerId]) {
        playerProducts[playerId] = [];
    }
    
    const purchaseRecord = {
        productId: productId,
        productName: product.name,
        purchasePrice: price,
        purchaseDate: Date.now(),
        purchaseDateStr: new Date().toISOString(),
        id: 'pur_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
    };
    
    playerProducts[playerId].push(purchaseRecord);
    localStorage.setItem(STORAGE_KEYS.PLAYER_PRODUCTS, JSON.stringify(playerProducts));
    
    // Add to transaction history
    addToTransactionHistory(playerId, productId, price);
    
    // Add to labor pool (50% of purchase price goes to labor pool)
    if (typeof window.addToLaborPool === 'function') {
        const laborContribution = Math.floor(price * 0.5);
        window.addToLaborPool(laborContribution, `Product purchase: ${product.name}`);
    }
    
    return {
        success: true,
        product: product,
        price: price,
        purchaseRecord: purchaseRecord,
        laborContribution: Math.floor(price * 0.5)
    };
}

/**
 * Add transaction to history
 * @param {string} playerId - Player ID
 * @param {string} productId - Product ID
 * @param {number} price - Purchase price
 */
function addToTransactionHistory(playerId, productId, price) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTION_HISTORY) || '[]');
    
    history.push({
        playerId: playerId,
        productId: productId,
        price: price,
        timestamp: Date.now(),
        date: new Date().toISOString()
    });
    
    // Keep last 1000 transactions
    if (history.length > 1000) {
        history.shift();
    }
    
    localStorage.setItem(STORAGE_KEYS.TRANSACTION_HISTORY, JSON.stringify(history));
}

/**
 * Get player's purchased products
 * @param {string} playerId - Player ID
 * @returns {Array} Player's products
 */
export function getPlayerProducts(playerId) {
    const playerProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYER_PRODUCTS) || '{}');
    return playerProducts[playerId] || [];
}

/**
 * Get transaction history
 * @param {string} playerId - Optional player ID filter
 * @param {number} limit - Max number of entries
 * @returns {Array} Transaction history
 */
export function getTransactionHistory(playerId = null, limit = 50) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTION_HISTORY) || '[]');
    
    let filtered = history;
    if (playerId) {
        filtered = history.filter(h => h.playerId === playerId);
    }
    
    return filtered.slice(-limit).reverse();
}

// ===== MARKET STATISTICS =====

/**
 * Get market summary statistics
 * @returns {Object} Market statistics
 */
export function getMarketSummary() {
    const prices = getCurrentPrices();
    const trends = getMarketTrends();
    
    let totalVolume = 0;
    let averageVolatility = 0;
    let productCount = 0;
    
    for (const [id, priceData] of Object.entries(prices)) {
        totalVolume += priceData.current;
        averageVolatility += priceData.volatility;
        productCount++;
    }
    
    averageVolatility = productCount > 0 ? averageVolatility / productCount : 0;
    
    // Get trending products
    const trending = Object.entries(trends)
        .map(([id, trend]) => ({
            productId: id,
            productName: PRODUCT_CATALOG[id]?.name || id,
            trend: trend
        }))
        .sort((a, b) => b.trend - a.trend)
        .slice(0, 5);
    
    return {
        totalMarketCap: totalVolume,
        averageVolatility: averageVolatility,
        productCount: productCount,
        lastUpdate: parseInt(localStorage.getItem(STORAGE_KEYS.LAST_UPDATE)) || Date.now(),
        trending: trending,
        transactionCount: JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTION_HISTORY) || '[]').length
    };
}

/**
 * Get market volatility for a category
 * @param {string} category - Product category
 * @returns {number} Average volatility
 */
export function getCategoryVolatility(category) {
    const products = getProductsByCategory(category);
    const prices = getCurrentPrices();
    
    let totalVol = 0;
    let count = 0;
    
    for (const product of products) {
        const priceData = prices[product.id];
        if (priceData) {
            totalVol += priceData.volatility;
            count++;
        }
    }
    
    return count > 0 ? totalVol / count : MARKET_CONFIG.BASE_VOLATILITY;
}

/**
 * Get best time to buy based on price history
 * @param {string} productId - Product ID
 * @returns {Object} Buy recommendation
 */
export function getBuyRecommendation(productId) {
    const history = getPriceHistory(productId, 30);
    if (history.length < 5) {
        return { recommendation: 'neutral', reason: 'Insufficient data' };
    }
    
    const prices = history.map(h => h.price);
    const currentPrice = prices[prices.length - 1];
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const pricePosition = (currentPrice - minPrice) / (maxPrice - minPrice);
    
    if (pricePosition < 0.2) {
        return {
            recommendation: 'buy',
            reason: 'Price near 30-day low',
            confidence: Math.round((1 - pricePosition) * 100)
        };
    } else if (pricePosition > 0.8) {
        return {
            recommendation: 'wait',
            reason: 'Price near 30-day high',
            confidence: Math.round(pricePosition * 100)
        };
    } else {
        return {
            recommendation: 'neutral',
            reason: 'Price in normal range',
            confidence: 50
        };
    }
}

// ===== DAILY MAINTENANCE =====

/**
 * Run daily market maintenance
 * @param {Array} activeEvents - Active economic events
 */
export function runDailyMarketMaintenance(activeEvents = []) {
    console.log('Running daily market maintenance...');
    
    // Update prices
    const newPrices = updatePrices(activeEvents);
    
    // Clean up old transaction history
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTION_HISTORY) || '[]');
    const cutoff = Date.now() - (90 * 24 * 60 * 60 * 1000); // Keep 90 days
    
    const filtered = history.filter(h => h.timestamp >= cutoff);
    localStorage.setItem(STORAGE_KEYS.TRANSACTION_HISTORY, JSON.stringify(filtered));
    
    console.log('Market maintenance complete');
    
    return {
        pricesUpdated: true,
        transactionCount: filtered.length,
        newPrices: newPrices
    };
}

// ===== EXPORT =====

export default {
    MARKET_CONFIG,
    initializeMarket,
    updatePrices,
    getCurrentPrices,
    getProductPrice,
    getPriceMultiplier,
    getPriceHistory,
    getMarketTrends,
    getAvailableProducts,
    getProductsByCategoryWithPrices,
    canAffordProduct,
    checkSkillRequirements,
    purchaseProduct,
    getPlayerProducts,
    getTransactionHistory,
    getMarketSummary,
    getCategoryVolatility,
    getBuyRecommendation,
    runDailyMarketMaintenance
};

// Initialize on load
initializeMarket();

// Attach to window for global access
window.MARKET_CONFIG = MARKET_CONFIG;
window.initializeMarket = initializeMarket;
window.updatePrices = updatePrices;
window.getCurrentPrices = getCurrentPrices;
window.getProductPrice = getProductPrice;
window.getPriceMultiplier = getPriceMultiplier;
window.getPriceHistory = getPriceHistory;
window.getMarketTrends = getMarketTrends;
window.getAvailableProducts = getAvailableProducts;
window.getProductsByCategoryWithPrices = getProductsByCategoryWithPrices;
window.canAffordProduct = canAffordProduct;
window.checkSkillRequirements = checkSkillRequirements;
window.purchaseProduct = purchaseProduct;
window.getPlayerProducts = getPlayerProducts;
window.getTransactionHistory = getTransactionHistory;
window.getMarketSummary = getMarketSummary;
window.getCategoryVolatility = getCategoryVolatility;
window.getBuyRecommendation = getBuyRecommendation;
window.runDailyMarketMaintenance = runDailyMarketMaintenance;

console.log('✅ market-dynamics.js loaded - Market system ready');

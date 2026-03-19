// js/market-dynamics.js - Dynamic market pricing and element trading for Voidfarer
// Handles price fluctuations, supply/demand, and market history for all 118 elements
// UPDATED: Removed self-import that was causing errors
// UPDATED: Added filtering to only include chemical elements (no ship parts)
// UPDATED: Filtered getCurrentPrices to exclude ship parts at the source

import { ELEMENT_DATABASE, getElementByName, getElementsByRarity } from './element-prices.js';

// ===== MARKET CONFIGURATION =====

const MARKET_CONFIG = {
    BASE_VOLATILITY: 0.05, // 5% base price volatility
    EVENT_VOLATILITY: 0.15, // 15% additional volatility during events
    TREND_STRENGTH: 0.7, // How strongly trends persist
    UPDATE_INTERVAL: 3600000, // 1 hour in milliseconds
    MAX_PRICE_HISTORY: 90, // Keep 90 days of history
    MIN_PRICE_MULTIPLIER: 0.3, // Minimum price (30% of base)
    MAX_PRICE_MULTIPLIER: 3.0, // Maximum price (300% of base)
    DEFAULT_TRANSACTION_FEE: 0.02, // 2% transaction fee
    MARKET_HOURS: 24, // Market open 24/7
    SUPPLY_DEMAND_FACTOR: 0.1, // How much supply/demand affects price
    VOLUME_DECAY: 0.95, // Daily volume decay factor
    SPREAD_PERCENT: 0.02 // 2% bid-ask spread
};

// ===== STORAGE KEYS =====

const STORAGE_KEYS = {
    PRICE_HISTORY: 'voidfarer_price_history',
    CURRENT_PRICES: 'voidfarer_current_prices',
    MARKET_TRENDS: 'voidfarer_market_trends',
    LAST_UPDATE: 'voidfarer_market_last_update',
    MARKET_VOLUME: 'voidfarer_market_volume',
    SUPPLY_INDEX: 'voidfarer_supply_index',
    DEMAND_INDEX: 'voidfarer_demand_index',
    PRICE_ALERTS: 'voidfarer_price_alerts'
};

// ===== INITIALIZATION =====

/**
 * Initialize market data for all elements
 */
export function initializeMarket() {
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_PRICES)) {
        const initialPrices = {};
        const initialTrends = {};
        
        // Initialize prices for all 118 elements
        for (const [elementName, element] of Object.entries(ELEMENT_DATABASE)) {
            const basePrice = element.basePrice || element.value || 100;
            
            initialPrices[elementName] = {
                current: basePrice,
                base: basePrice,
                bid: Math.floor(basePrice * (1 - MARKET_CONFIG.SPREAD_PERCENT / 2)),
                ask: Math.ceil(basePrice * (1 + MARKET_CONFIG.SPREAD_PERCENT / 2)),
                trend: 0,
                volatility: element.volatility || MARKET_CONFIG.BASE_VOLATILITY,
                lastUpdated: Date.now(),
                volume24h: 0,
                priceChange24h: 0,
                priceChangePercent: 0
            };
            
            initialTrends[elementName] = {
                shortTerm: 0,
                mediumTerm: 0,
                longTerm: 0,
                strength: 0
            };
        }
        
        localStorage.setItem(STORAGE_KEYS.CURRENT_PRICES, JSON.stringify(initialPrices));
        localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify({}));
        localStorage.setItem(STORAGE_KEYS.MARKET_TRENDS, JSON.stringify(initialTrends));
        localStorage.setItem(STORAGE_KEYS.MARKET_VOLUME, JSON.stringify({}));
        localStorage.setItem(STORAGE_KEYS.SUPPLY_INDEX, JSON.stringify({}));
        localStorage.setItem(STORAGE_KEYS.DEMAND_INDEX, JSON.stringify({}));
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
    }
    
    console.log('Market system initialized with 118 elements');
}

/**
 * Update prices based on market dynamics and events
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
    
    // Update each element's price
    for (const [elementName, priceData] of Object.entries(prices)) {
        const element = ELEMENT_DATABASE[elementName];
        if (!element) continue;
        
        // Get current trend
        let trend = trends[elementName] || { shortTerm: 0, mediumTerm: 0, longTerm: 0, strength: 0 };
        
        // Calculate supply/demand effect
        const supplyIndex = getSupplyIndex(elementName);
        const demandIndex = getDemandIndex(elementName);
        const supplyDemandFactor = (demandIndex - supplyIndex) * MARKET_CONFIG.SUPPLY_DEMAND_FACTOR;
        
        // Apply random walk
        const randomFactor = (Math.random() - 0.5) * 2 * priceData.volatility;
        
        // Apply volume trend
        const volume24h = getVolumeLast24h(elementName);
        const volumeTrend = volume24h > 0 ? Math.log10(volume24h) * 0.01 : 0;
        
        // Apply event effects
        const eventMultiplier = eventEffects[element.rarity] || 1.0;
        
        // Calculate new price
        let newPrice = priceData.current * (
            1 + trend.shortTerm * MARKET_CONFIG.TREND_STRENGTH + 
            randomFactor + 
            supplyDemandFactor + 
            volumeTrend
        ) * eventMultiplier;
        
        // Ensure price stays within bounds
        newPrice = Math.max(
            priceData.base * MARKET_CONFIG.MIN_PRICE_MULTIPLIER,
            Math.min(priceData.base * MARKET_CONFIG.MAX_PRICE_MULTIPLIER, newPrice)
        );
        
        // Calculate price change
        const priceChange = newPrice - priceData.current;
        const priceChangePercent = (priceChange / priceData.current) * 100;
        
        // Update bid/ask spread
        const bid = Math.floor(newPrice * (1 - MARKET_CONFIG.SPREAD_PERCENT / 2));
        const ask = Math.ceil(newPrice * (1 + MARKET_CONFIG.SPREAD_PERCENT / 2));
        
        // Update trends
        trend.shortTerm = trend.shortTerm * 0.7 + priceChangePercent * 0.3;
        trend.mediumTerm = trend.mediumTerm * 0.9 + priceChangePercent * 0.1;
        trend.longTerm = trend.longTerm * 0.95 + priceChangePercent * 0.05;
        trend.strength = Math.abs(trend.shortTerm) / 10;
        
        // Store updated data
        priceData.current = newPrice;
        priceData.bid = bid;
        priceData.ask = ask;
        priceData.trend = trend.shortTerm;
        priceData.lastUpdated = now;
        priceData.priceChange24h = priceChange;
        priceData.priceChangePercent = priceChangePercent;
        priceData.volume24h = volume24h;
        
        trends[elementName] = trend;
        
        // Add to price history
        addToPriceHistory(elementName, newPrice, volume24h, now);
    }
    
    // Decay old volume data
    decayVolumeData();
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_PRICES, JSON.stringify(prices));
    localStorage.setItem(STORAGE_KEYS.MARKET_TRENDS, JSON.stringify(trends));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, now.toString());
    
    return prices;
}

/**
 * Calculate event effects on prices
 * @param {Array} events - Active economic events
 * @returns {Object} Rarity multipliers
 */
function calculateEventEffects(events) {
    const effects = {};
    
    for (const event of events) {
        if (event.priceMultiplier) {
            if (event.affectedRarity) {
                effects[event.affectedRarity] = (effects[event.affectedRarity] || 1.0) * event.priceMultiplier;
            } else {
                // Apply to all rarities
                for (const rarity of ['common', 'uncommon', 'rare', 'very-rare', 'legendary']) {
                    effects[rarity] = (effects[rarity] || 1.0) * event.priceMultiplier;
                }
            }
        }
    }
    
    return effects;
}

// ===== PRICE MANAGEMENT =====

/**
 * Get current market prices - FILTERED to only include chemical elements
 * @returns {Object} Current prices (only chemical elements)
 */
export function getCurrentPrices() {
    const prices = localStorage.getItem(STORAGE_KEYS.CURRENT_PRICES);
    const allPrices = prices ? JSON.parse(prices) : {};
    
    // Filter out ship parts and non-element items
    const filteredPrices = {};
    
    for (const [name, priceData] of Object.entries(allPrices)) {
        // Skip ship parts and other non-element items
        if (name.includes('ship_') || 
            name.includes('cargo_') ||
            name.includes('engine_') ||
            name.includes('weapon_') ||
            name.includes('module_') ||
            name.includes('reactor_') ||
            name.includes('shield_') ||
            name.includes('thruster_') ||
            name.includes('drive_') ||
            name.includes('scanner_') ||
            name.includes('mining_') ||
            name.includes('crystal_') ||
            name.includes('component_') ||
            name.includes('system_')) {
            continue;
        }
        
        filteredPrices[name] = priceData;
    }
    
    return filteredPrices;
}

/**
 * Get price for a specific element
 * @param {string} elementName - Element name
 * @returns {Object} Price data { current, bid, ask, base }
 */
export function getElementPrice(elementName) {
    const prices = getCurrentPrices();
    return prices[elementName] || {
        current: 100,
        bid: 99,
        ask: 101,
        base: 100,
        trend: 0
    };
}

/**
 * Get bid price (price you can sell at)
 * @param {string} elementName - Element name
 * @returns {number} Bid price
 */
export function getBidPrice(elementName) {
    const price = getElementPrice(elementName);
    return price.bid || Math.floor(price.current * 0.99);
}

/**
 * Get ask price (price you can buy at)
 * @param {string} elementName - Element name
 * @returns {number} Ask price
 */
export function getAskPrice(elementName) {
    const price = getElementPrice(elementName);
    return price.ask || Math.ceil(price.current * 1.01);
}

/**
 * Get price multiplier (current/base)
 * @param {string} elementName - Element name
 * @returns {number} Price multiplier
 */
export function getPriceMultiplier(elementName) {
    const price = getElementPrice(elementName);
    return price.current / price.base;
}

/**
 * Add price to history
 * @param {string} elementName - Element name
 * @param {number} price - Price
 * @param {number} volume - Trading volume
 * @param {number} timestamp - Timestamp
 */
function addToPriceHistory(elementName, price, volume, timestamp) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY) || '{}');
    
    if (!history[elementName]) {
        history[elementName] = [];
    }
    
    history[elementName].push({
        price: Math.round(price),
        bid: Math.floor(price * 0.99),
        ask: Math.ceil(price * 1.01),
        volume: volume,
        timestamp: timestamp,
        date: new Date(timestamp).toISOString()
    });
    
    // Keep only last MAX_PRICE_HISTORY entries
    if (history[elementName].length > MARKET_CONFIG.MAX_PRICE_HISTORY) {
        history[elementName].shift();
    }
    
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(history));
}

/**
 * Get price history for an element
 * @param {string} elementName - Element name
 * @param {number} days - Number of days of history
 * @returns {Array} Price history
 */
export function getPriceHistory(elementName, days = 30) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY) || '{}');
    const elementHistory = history[elementName] || [];
    
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return elementHistory.filter(h => h.timestamp >= cutoff);
}

/**
 * Get market trends
 * @returns {Object} Market trends
 */
export function getMarketTrends() {
    const trends = localStorage.getItem(STORAGE_KEYS.MARKET_TRENDS);
    return trends ? JSON.parse(trends) : {};
}

// ===== VOLUME TRACKING =====

/**
 * Get market volume data
 * @returns {Object} Volume data
 */
export function getMarketVolume() {
    const volume = localStorage.getItem(STORAGE_KEYS.MARKET_VOLUME);
    return volume ? JSON.parse(volume) : {};
}

/**
 * Record a trade
 * @param {string} elementName - Element name
 * @param {number} quantity - Quantity traded
 * @param {string} type - 'buy' or 'sell'
 */
export function recordTrade(elementName, quantity, type) {
    const volume = getMarketVolume();
    const today = new Date().toISOString().split('T')[0];
    
    if (!volume[elementName]) {
        volume[elementName] = {};
    }
    
    if (!volume[elementName][today]) {
        volume[elementName][today] = { buy: 0, sell: 0, total: 0 };
    }
    
    volume[elementName][today][type] += quantity;
    volume[elementName][today].total += quantity;
    
    localStorage.setItem(STORAGE_KEYS.MARKET_VOLUME, JSON.stringify(volume));
    
    // Update supply/demand indices
    updateSupplyDemand(elementName, quantity, type);
}

/**
 * Get volume for last 24 hours
 * @param {string} elementName - Element name
 * @returns {number} Total volume
 */
export function getVolumeLast24h(elementName) {
    const volume = getMarketVolume();
    if (!volume[elementName]) return 0;
    
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    let total = 0;
    
    for (const [date, data] of Object.entries(volume[elementName])) {
        const dateTime = new Date(date).getTime();
        if (dateTime >= oneDayAgo) {
            total += data.total || 0;
        }
    }
    
    return total;
}

/**
 * Decay old volume data
 */
function decayVolumeData() {
    const volume = getMarketVolume();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    for (const elementName of Object.keys(volume)) {
        for (const date of Object.keys(volume[elementName])) {
            const dateTime = new Date(date).getTime();
            if (dateTime < thirtyDaysAgo) {
                delete volume[elementName][date];
            }
        }
        
        if (Object.keys(volume[elementName]).length === 0) {
            delete volume[elementName];
        }
    }
    
    localStorage.setItem(STORAGE_KEYS.MARKET_VOLUME, JSON.stringify(volume));
}

// ===== SUPPLY/DEMAND INDICES =====

/**
 * Update supply/demand indices
 * @param {string} elementName - Element name
 * @param {number} quantity - Quantity traded
 * @param {string} type - 'buy' or 'sell'
 */
function updateSupplyDemand(elementName, quantity, type) {
    const supply = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLY_INDEX) || '{}');
    const demand = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEMAND_INDEX) || '{}');
    
    if (type === 'buy') {
        // Buying increases demand
        demand[elementName] = (demand[elementName] || 0) + quantity;
    } else {
        // Selling increases supply
        supply[elementName] = (supply[elementName] || 0) + quantity;
    }
    
    // Decay old values
    for (const el of Object.keys(supply)) {
        supply[el] = supply[el] * MARKET_CONFIG.VOLUME_DECAY;
        if (supply[el] < 1) delete supply[el];
    }
    
    for (const el of Object.keys(demand)) {
        demand[el] = demand[el] * MARKET_CONFIG.VOLUME_DECAY;
        if (demand[el] < 1) delete demand[el];
    }
    
    localStorage.setItem(STORAGE_KEYS.SUPPLY_INDEX, JSON.stringify(supply));
    localStorage.setItem(STORAGE_KEYS.DEMAND_INDEX, JSON.stringify(demand));
}

/**
 * Get supply index for an element
 * @param {string} elementName - Element name
 * @returns {number} Supply index
 */
export function getSupplyIndex(elementName) {
    const supply = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLY_INDEX) || '{}');
    return supply[elementName] || 0;
}

/**
 * Get demand index for an element
 * @param {string} elementName - Element name
 * @returns {number} Demand index
 */
export function getDemandIndex(elementName) {
    const demand = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEMAND_INDEX) || '{}');
    return demand[elementName] || 0;
}

/**
 * Get supply/demand ratio
 * @param {string} elementName - Element name
 * @returns {number} Ratio ( >1 means oversupply, <1 means undersupply)
 */
export function getSupplyDemandRatio(elementName) {
    const supply = getSupplyIndex(elementName);
    const demand = getDemandIndex(elementName);
    
    if (demand === 0) return 1;
    return supply / demand;
}

// ===== MARKET LISTINGS =====

/**
 * Get all elements available for trading
 * @param {string} rarity - Optional rarity filter
 * @returns {Array} Available elements with current prices
 */
export function getAvailableElements(rarity = null) {
    const elements = [];
    const prices = getCurrentPrices(); // This now returns filtered prices
    
    for (const [name, element] of Object.entries(ELEMENT_DATABASE)) {
        // ===== FILTER OUT SHIP PARTS AND NON-ELEMENT ITEMS =====
        // Only include actual chemical elements
        if (name.includes('ship_') || 
            name.includes('cargo_') ||
            name.includes('engine_') ||
            name.includes('weapon_') ||
            name.includes('module_') ||
            name.includes('reactor_') ||
            name.includes('shield_') ||
            name.includes('thruster_') ||
            name.includes('drive_') ||
            name.includes('scanner_') ||
            name.includes('mining_') ||
            name.includes('crystal_') ||
            name.includes('component_') ||
            name.includes('system_')) {
            continue;
        }
        
        if (rarity && element.rarity !== rarity) continue;
        
        const priceData = prices[name] || {
            current: element.basePrice || element.value || 100,
            base: element.basePrice || element.value || 100,
            bid: Math.floor((element.basePrice || 100) * 0.99),
            ask: Math.ceil((element.basePrice || 100) * 1.01)
        };
        
        elements.push({
            name: name,
            symbol: element.symbol,
            icon: element.icon,
            rarity: element.rarity,
            basePrice: element.basePrice || element.value || 100,
            currentPrice: Math.round(priceData.current),
            bidPrice: priceData.bid,
            askPrice: priceData.ask,
            priceMultiplier: priceData.current / (element.basePrice || element.value || 100),
            volume24h: priceData.volume24h || 0,
            priceChange24h: priceData.priceChange24h || 0,
            priceChangePercent: priceData.priceChangePercent || 0,
            mass: element.mass || 100,
            inStock: true
        });
    }
    
    console.log(`📊 getAvailableElements returning ${elements.length} chemical elements`);
    return elements;
}

/**
 * Get elements by rarity with current prices
 * @param {string} rarity - Rarity filter
 * @returns {Array} Elements in rarity
 */
export function getElementsByRarityWithPrices(rarity) {
    const elements = getElementsByRarity(rarity);
    const prices = getCurrentPrices();
    
    return elements.map(element => {
        const priceData = prices[element.name] || {
            current: element.basePrice || element.value || 100,
            base: element.basePrice || element.value || 100
        };
        
        return {
            ...element,
            currentPrice: Math.round(priceData.current),
            bidPrice: Math.floor(priceData.current * 0.99),
            askPrice: Math.ceil(priceData.current * 1.01),
            priceMultiplier: priceData.current / (element.basePrice || element.value || 100)
        };
    });
}

/**
 * Check if player can afford to buy
 * @param {string} elementName - Element name
 * @param {number} quantity - Quantity to buy
 * @param {number} playerCredits - Player's credits
 * @returns {boolean} True if affordable
 */
export function canAffordBuy(elementName, quantity, playerCredits) {
    const askPrice = getAskPrice(elementName);
    return playerCredits >= (askPrice * quantity);
}

/**
 * Check if player has enough to sell
 * @param {string} elementName - Element name
 * @param {number} quantity - Quantity to sell
 * @param {number} playerAmount - Player's amount
 * @returns {boolean} True if has enough
 */
export function hasEnoughToSell(elementName, quantity, playerAmount) {
    return playerAmount >= quantity;
}

// ===== PRICE ALERTS =====

/**
 * Set a price alert
 * @param {string} playerId - Player ID
 * @param {string} elementName - Element name
 * @param {string} type - 'above' or 'below'
 * @param {number} targetPrice - Target price
 * @returns {boolean} Success
 */
export function setPriceAlert(playerId, elementName, type, targetPrice) {
    try {
        const alerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_ALERTS) || '{}');
        
        if (!alerts[playerId]) {
            alerts[playerId] = [];
        }
        
        alerts[playerId].push({
            id: 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            elementName: elementName,
            type: type,
            targetPrice: targetPrice,
            createdAt: Date.now(),
            triggered: false
        });
        
        localStorage.setItem(STORAGE_KEYS.PRICE_ALERTS, JSON.stringify(alerts));
        return true;
        
    } catch (error) {
        console.error('Error setting price alert:', error);
        return false;
    }
}

/**
 * Check price alerts for a player
 * @param {string} playerId - Player ID
 * @returns {Array} Triggered alerts
 */
export function checkPriceAlerts(playerId) {
    try {
        const alerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_ALERTS) || '{}');
        const playerAlerts = alerts[playerId] || [];
        const prices = getCurrentPrices();
        const triggered = [];
        
        for (const alert of playerAlerts) {
            if (alert.triggered) continue;
            
            const price = prices[alert.elementName]?.current;
            if (!price) continue;
            
            if (alert.type === 'above' && price >= alert.targetPrice) {
                alert.triggered = true;
                triggered.push(alert);
            } else if (alert.type === 'below' && price <= alert.targetPrice) {
                alert.triggered = true;
                triggered.push(alert);
            }
        }
        
        localStorage.setItem(STORAGE_KEYS.PRICE_ALERTS, JSON.stringify(alerts));
        return triggered;
        
    } catch (error) {
        console.error('Error checking price alerts:', error);
        return [];
    }
}

// ===== MARKET STATISTICS =====

/**
 * Get market summary statistics
 * @returns {Object} Market statistics
 */
export function getMarketSummary() {
    const prices = getCurrentPrices();
    const elements = getAvailableElements();
    
    let totalVolume = 0;
    let averageVolatility = 0;
    let totalMarketCap = 0;
    let elementCount = 0;
    
    const gainers = [];
    const losers = [];
    
    for (const [name, priceData] of Object.entries(prices)) {
        totalVolume += priceData.volume24h || 0;
        averageVolatility += priceData.volatility || 0;
        totalMarketCap += priceData.current * 1000000; // Simulated supply
        elementCount++;
        
        if (priceData.priceChangePercent > 5) {
            gainers.push({
                name: name,
                change: priceData.priceChangePercent,
                price: priceData.current
            });
        } else if (priceData.priceChangePercent < -5) {
            losers.push({
                name: name,
                change: priceData.priceChangePercent,
                price: priceData.current
            });
        }
    }
    
    averageVolatility = elementCount > 0 ? averageVolatility / elementCount : 0;
    
    // Sort gainers and losers
    gainers.sort((a, b) => b.change - a.change);
    losers.sort((a, b) => a.change - b.change);
    
    return {
        totalMarketCap: totalMarketCap,
        totalVolume24h: totalVolume,
        averageVolatility: averageVolatility,
        elementCount: elementCount,
        lastUpdate: parseInt(localStorage.getItem(STORAGE_KEYS.LAST_UPDATE)) || Date.now(),
        topGainers: gainers.slice(0, 5),
        topLosers: losers.slice(0, 5),
        mostActive: getMostActiveElements(5)
    };
}

/**
 * Get most active elements by volume
 * @param {number} limit - Number to return
 * @returns {Array} Most active elements
 */
export function getMostActiveElements(limit = 5) {
    const elements = getAvailableElements();
    
    return elements
        .filter(e => e.volume24h > 0)
        .sort((a, b) => b.volume24h - a.volume24h)
        .slice(0, limit)
        .map(e => ({
            name: e.name,
            volume: e.volume24h,
            price: e.currentPrice,
            change: e.priceChangePercent
        }));
}

/**
 * Get market volatility for a rarity
 * @param {string} rarity - Element rarity
 * @returns {number} Average volatility
 */
export function getRarityVolatility(rarity) {
    const elements = getElementsByRarity(rarity);
    const prices = getCurrentPrices();
    
    let totalVol = 0;
    let count = 0;
    
    for (const element of elements) {
        const priceData = prices[element.name];
        if (priceData) {
            totalVol += priceData.volatility || 0;
            count++;
        }
    }
    
    return count > 0 ? totalVol / count : MARKET_CONFIG.BASE_VOLATILITY;
}

/**
 * Get best time to buy based on price history
 * @param {string} elementName - Element name
 * @returns {Object} Buy recommendation
 */
export function getBuyRecommendation(elementName) {
    const history = getPriceHistory(elementName, 30);
    if (history.length < 5) {
        return { recommendation: 'neutral', reason: 'Insufficient data', confidence: 0 };
    }
    
    const prices = history.map(h => h.price);
    const currentPrice = prices[prices.length - 1];
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const pricePosition = (currentPrice - minPrice) / (maxPrice - minPrice);
    const trend = prices[prices.length - 1] - prices[0];
    
    let recommendation = 'neutral';
    let confidence = 50;
    let reason = 'Price in normal range';
    
    if (pricePosition < 0.2) {
        recommendation = 'buy';
        confidence = Math.round((1 - pricePosition) * 100);
        reason = 'Price near 30-day low';
    } else if (pricePosition > 0.8) {
        recommendation = 'wait';
        confidence = Math.round(pricePosition * 100);
        reason = 'Price near 30-day high';
    }
    
    if (trend > 0 && recommendation === 'buy') {
        confidence *= 0.8; // Uptrend makes buy less attractive
        reason += ' (uptrend)';
    } else if (trend < 0 && recommendation === 'wait') {
        confidence *= 0.8; // Downtrend makes wait less certain
        reason += ' (downtrend)';
    }
    
    return {
        recommendation,
        reason,
        confidence: Math.min(100, confidence),
        currentPrice,
        averagePrice,
        minPrice,
        maxPrice,
        trend: trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'
    };
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
    
    // Clean up old data
    decayVolumeData();
    
    // Archive old price history
    archiveOldHistory();
    
    console.log('Market maintenance complete');
    
    return {
        pricesUpdated: true,
        elementCount: Object.keys(newPrices).length,
        newPrices: newPrices
    };
}

/**
 * Archive old price history
 */
function archiveOldHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY) || '{}');
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    
    for (const elementName of Object.keys(history)) {
        history[elementName] = history[elementName].filter(h => h.timestamp >= ninetyDaysAgo);
    }
    
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(history));
}

// ===== EXPORT =====

export default {
    MARKET_CONFIG,
    initializeMarket,
    updatePrices,
    getCurrentPrices,
    getElementPrice,
    getBidPrice,
    getAskPrice,
    getPriceMultiplier,
    getPriceHistory,
    getMarketTrends,
    getMarketVolume,
    recordTrade,
    getVolumeLast24h,
    getSupplyIndex,
    getDemandIndex,
    getSupplyDemandRatio,
    getAvailableElements,
    getElementsByRarityWithPrices,
    canAffordBuy,
    hasEnoughToSell,
    setPriceAlert,
    checkPriceAlerts,
    getMarketSummary,
    getRarityVolatility,
    getBuyRecommendation,
    getMostActiveElements,
    runDailyMarketMaintenance
};

// Initialize on load
initializeMarket();

// Attach to window for global access
window.MARKET_CONFIG = MARKET_CONFIG;
window.initializeMarket = initializeMarket;
window.updatePrices = updatePrices;
window.getCurrentPrices = getCurrentPrices;
window.getElementPrice = getElementPrice;
window.getBidPrice = getBidPrice;
window.getAskPrice = getAskPrice;
window.getPriceMultiplier = getPriceMultiplier;
window.getPriceHistory = getPriceHistory;
window.getMarketTrends = getMarketTrends;
window.getMarketVolume = getMarketVolume;
window.recordTrade = recordTrade;
window.getVolumeLast24h = getVolumeLast24h;
window.getSupplyIndex = getSupplyIndex;
window.getDemandIndex = getDemandIndex;
window.getSupplyDemandRatio = getSupplyDemandRatio;
window.getAvailableElements = getAvailableElements;
window.getElementsByRarityWithPrices = getElementsByRarityWithPrices;
window.canAffordBuy = canAffordBuy;
window.hasEnoughToSell = hasEnoughToSell;
window.setPriceAlert = setPriceAlert;
window.checkPriceAlerts = checkPriceAlerts;
window.getMarketSummary = getMarketSummary;
window.getRarityVolatility = getRarityVolatility;
window.getBuyRecommendation = getBuyRecommendation;
window.getMostActiveElements = getMostActiveElements;
window.runDailyMarketMaintenance = runDailyMarketMaintenance;

console.log('✅ market-dynamics.js loaded - Market system ready with 118 elements');

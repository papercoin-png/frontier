// js/market-dynamics.js - Dynamic market pricing and element trading for Voidfarer
// Handles price fluctuations, supply/demand, and market history for all 118 elements
// OPTIMIZED: Cleaned up code, removed redundancies, improved performance

import { ELEMENT_DATABASE, getElementByName, getElementsByRarity } from './element-prices.js';

// ===== MARKET CONFIGURATION =====

const MARKET_CONFIG = {
    BASE_VOLATILITY: 0.05,
    EVENT_VOLATILITY: 0.15,
    TREND_STRENGTH: 0.7,
    UPDATE_INTERVAL: 3600000, // 1 hour
    MAX_PRICE_HISTORY: 90,
    MIN_PRICE_MULTIPLIER: 0.3,
    MAX_PRICE_MULTIPLIER: 3.0,
    DEFAULT_TRANSACTION_FEE: 0.02,
    SUPPLY_DEMAND_FACTOR: 0.1,
    VOLUME_DECAY: 0.95,
    SPREAD_PERCENT: 0.02 // 2% bid-ask spread
};

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

// Ship part patterns for filtering
const SHIP_PART_PATTERNS = [
    'ship_', 'cargo_', 'engine_', 'weapon_', 'module_', 'reactor_',
    'shield_', 'thruster_', 'drive_', 'scanner_', 'mining_', 'crystal_',
    'component_', 'system_', 'cannon_', 'laser_', 'missile_', 'plasma_', 'railgun'
];

// ===== INITIALIZATION =====

/**
 * Initialize market data for all elements
 */
export function initializeMarket() {
    // Check if we need to clear old data
    const oldPrices = localStorage.getItem(STORAGE_KEYS.CURRENT_PRICES);
    if (oldPrices) {
        const prices = JSON.parse(oldPrices);
        const hasNonElements = Object.keys(prices).some(key => 
            SHIP_PART_PATTERNS.some(pattern => key.includes(pattern))
        );
        
        if (hasNonElements) {
            console.log('🚮 Clearing old ship part data from localStorage...');
            SHIP_PART_PATTERNS.forEach(pattern => {
                Object.keys(prices).forEach(key => {
                    if (key.includes(pattern)) delete prices[key];
                });
            });
            localStorage.setItem(STORAGE_KEYS.CURRENT_PRICES, JSON.stringify(prices));
        }
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_PRICES)) {
        const initialPrices = {};
        const initialTrends = {};
        
        Object.entries(ELEMENT_DATABASE).forEach(([elementName, element]) => {
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
        });
        
        localStorage.setItem(STORAGE_KEYS.CURRENT_PRICES, JSON.stringify(initialPrices));
        localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify({}));
        localStorage.setItem(STORAGE_KEYS.MARKET_TRENDS, JSON.stringify(initialTrends));
        localStorage.setItem(STORAGE_KEYS.MARKET_VOLUME, JSON.stringify({}));
        localStorage.setItem(STORAGE_KEYS.SUPPLY_INDEX, JSON.stringify({}));
        localStorage.setItem(STORAGE_KEYS.DEMAND_INDEX, JSON.stringify({}));
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
        
        console.log('✅ Market initialized with chemical elements only');
    }
}

// ===== PRICE MANAGEMENT =====

/**
 * Check if an element is a valid chemical (not a ship part)
 */
function isValidChemical(elementName) {
    return !SHIP_PART_PATTERNS.some(pattern => elementName.includes(pattern));
}

/**
 * Get current market prices - filtered to only include chemical elements
 */
export function getCurrentPrices() {
    const prices = localStorage.getItem(STORAGE_KEYS.CURRENT_PRICES);
    if (!prices) return {};
    
    const allPrices = JSON.parse(prices);
    const filteredPrices = {};
    
    Object.entries(allPrices).forEach(([name, priceData]) => {
        if (isValidChemical(name)) {
            filteredPrices[name] = priceData;
        }
    });
    
    return filteredPrices;
}

/**
 * Get price for a specific element
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
 */
export function getBidPrice(elementName) {
    const price = getElementPrice(elementName);
    return price.bid || Math.floor(price.current * 0.99);
}

/**
 * Get ask price (price you can buy at)
 */
export function getAskPrice(elementName) {
    const price = getElementPrice(elementName);
    return price.ask || Math.ceil(price.current * 1.01);
}

/**
 * Update prices based on market dynamics
 */
export function updatePrices(activeEvents = []) {
    const prices = getCurrentPrices();
    const trends = JSON.parse(localStorage.getItem(STORAGE_KEYS.MARKET_TRENDS) || '{}');
    const now = Date.now();
    const lastUpdate = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_UPDATE)) || now;
    
    // Update at most once per hour
    if ((now - lastUpdate) < MARKET_CONFIG.UPDATE_INTERVAL) return prices;
    
    const eventEffects = calculateEventEffects(activeEvents);
    
    Object.entries(prices).forEach(([elementName, priceData]) => {
        const element = ELEMENT_DATABASE[elementName];
        if (!element) return;
        
        const trend = trends[elementName] || { shortTerm: 0, mediumTerm: 0, longTerm: 0, strength: 0 };
        const supplyIndex = getSupplyIndex(elementName);
        const demandIndex = getDemandIndex(elementName);
        
        // Calculate price factors
        const supplyDemandFactor = (demandIndex - supplyIndex) * MARKET_CONFIG.SUPPLY_DEMAND_FACTOR;
        const randomFactor = (Math.random() - 0.5) * 2 * priceData.volatility;
        const volumeTrend = Math.log10(getVolumeLast24h(elementName) + 1) * 0.01;
        const eventMultiplier = eventEffects[element.rarity] || 1.0;
        
        // Calculate new price
        let newPrice = priceData.current * (
            1 + trend.shortTerm * MARKET_CONFIG.TREND_STRENGTH + 
            randomFactor + supplyDemandFactor + volumeTrend
        ) * eventMultiplier;
        
        // Clamp price within bounds
        newPrice = Math.max(
            priceData.base * MARKET_CONFIG.MIN_PRICE_MULTIPLIER,
            Math.min(priceData.base * MARKET_CONFIG.MAX_PRICE_MULTIPLIER, newPrice)
        );
        
        const priceChange = newPrice - priceData.current;
        const priceChangePercent = (priceChange / priceData.current) * 100;
        
        // Update data
        priceData.current = newPrice;
        priceData.bid = Math.floor(newPrice * (1 - MARKET_CONFIG.SPREAD_PERCENT / 2));
        priceData.ask = Math.ceil(newPrice * (1 + MARKET_CONFIG.SPREAD_PERCENT / 2));
        priceData.lastUpdated = now;
        priceData.priceChange24h = priceChange;
        priceData.priceChangePercent = priceChangePercent;
        priceData.volume24h = getVolumeLast24h(elementName);
        
        // Update trends
        trends[elementName] = {
            shortTerm: trend.shortTerm * 0.7 + priceChangePercent * 0.3,
            mediumTerm: trend.mediumTerm * 0.9 + priceChangePercent * 0.1,
            longTerm: trend.longTerm * 0.95 + priceChangePercent * 0.05,
            strength: Math.abs(trend.shortTerm) / 10
        };
        
        addToPriceHistory(elementName, newPrice, priceData.volume24h, now);
    });
    
    decayVolumeData();
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_PRICES, JSON.stringify(prices));
    localStorage.setItem(STORAGE_KEYS.MARKET_TRENDS, JSON.stringify(trends));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, now.toString());
    
    return prices;
}

/**
 * Calculate event effects on prices
 */
function calculateEventEffects(events) {
    const effects = {};
    events.forEach(event => {
        if (event.priceMultiplier) {
            const rarities = event.affectedRarity ? [event.affectedRarity] : 
                ['common', 'uncommon', 'rare', 'very-rare', 'legendary'];
            
            rarities.forEach(rarity => {
                effects[rarity] = (effects[rarity] || 1.0) * event.priceMultiplier;
            });
        }
    });
    return effects;
}

/**
 * Add price to history
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
        volume,
        timestamp,
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
 */
export function getPriceHistory(elementName, days = 30) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY) || '{}');
    const elementHistory = history[elementName] || [];
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    return elementHistory.filter(h => h.timestamp >= cutoff);
}

// ===== VOLUME TRACKING =====

/**
 * Get market volume data
 */
export function getMarketVolume() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MARKET_VOLUME) || '{}');
}

/**
 * Record a trade
 */
export function recordTrade(elementName, quantity, type) {
    const volume = getMarketVolume();
    const today = new Date().toISOString().split('T')[0];
    
    if (!volume[elementName]) volume[elementName] = {};
    if (!volume[elementName][today]) {
        volume[elementName][today] = { buy: 0, sell: 0, total: 0 };
    }
    
    volume[elementName][today][type] += quantity;
    volume[elementName][today].total += quantity;
    
    localStorage.setItem(STORAGE_KEYS.MARKET_VOLUME, JSON.stringify(volume));
    updateSupplyDemand(elementName, quantity, type);
}

/**
 * Get volume for last 24 hours
 */
export function getVolumeLast24h(elementName) {
    const volume = getMarketVolume();
    if (!volume[elementName]) return 0;
    
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    let total = 0;
    
    Object.entries(volume[elementName]).forEach(([date, data]) => {
        if (new Date(date).getTime() >= oneDayAgo) {
            total += data.total || 0;
        }
    });
    
    return total;
}

/**
 * Decay old volume data
 */
function decayVolumeData() {
    const volume = getMarketVolume();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    Object.keys(volume).forEach(elementName => {
        Object.keys(volume[elementName]).forEach(date => {
            if (new Date(date).getTime() < thirtyDaysAgo) {
                delete volume[elementName][date];
            }
        });
        
        if (Object.keys(volume[elementName]).length === 0) {
            delete volume[elementName];
        }
    });
    
    localStorage.setItem(STORAGE_KEYS.MARKET_VOLUME, JSON.stringify(volume));
}

// ===== SUPPLY/DEMAND INDICES =====

/**
 * Update supply/demand indices
 */
function updateSupplyDemand(elementName, quantity, type) {
    const supply = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLY_INDEX) || '{}');
    const demand = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEMAND_INDEX) || '{}');
    
    if (type === 'buy') {
        demand[elementName] = (demand[elementName] || 0) + quantity;
    } else {
        supply[elementName] = (supply[elementName] || 0) + quantity;
    }
    
    // Decay old values
    [supply, demand].forEach(index => {
        Object.keys(index).forEach(key => {
            index[key] *= MARKET_CONFIG.VOLUME_DECAY;
            if (index[key] < 1) delete index[key];
        });
    });
    
    localStorage.setItem(STORAGE_KEYS.SUPPLY_INDEX, JSON.stringify(supply));
    localStorage.setItem(STORAGE_KEYS.DEMAND_INDEX, JSON.stringify(demand));
}

/**
 * Get supply index for an element
 */
export function getSupplyIndex(elementName) {
    const supply = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLY_INDEX) || '{}');
    return supply[elementName] || 0;
}

/**
 * Get demand index for an element
 */
export function getDemandIndex(elementName) {
    const demand = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEMAND_INDEX) || '{}');
    return demand[elementName] || 0;
}

// ===== MARKET LISTINGS =====

/**
 * Get all elements available for trading
 */
export function getAvailableElements(rarity = null) {
    const elements = [];
    const prices = getCurrentPrices();
    
    Object.entries(ELEMENT_DATABASE).forEach(([name, element]) => {
        if (!isValidChemical(name)) return;
        if (rarity && element.rarity !== rarity) return;
        
        const priceData = prices[name] || {
            current: element.basePrice || element.value || 100,
            base: element.basePrice || element.value || 100,
            bid: Math.floor((element.basePrice || 100) * 0.99),
            ask: Math.ceil((element.basePrice || 100) * 1.01)
        };
        
        elements.push({
            name,
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
            mass: element.mass || 100
        });
    });
    
    return elements;
}

/**
 * Get market summary statistics
 */
export function getMarketSummary() {
    const prices = getCurrentPrices();
    const elements = getAvailableElements();
    
    let totalVolume = 0, avgVolatility = 0, marketCap = 0;
    const gainers = [], losers = [];
    
    Object.entries(prices).forEach(([name, data]) => {
        totalVolume += data.volume24h || 0;
        avgVolatility += data.volatility || 0;
        marketCap += data.current * 1000000;
        
        if (data.priceChangePercent > 5) {
            gainers.push({ name, change: data.priceChangePercent, price: data.current });
        } else if (data.priceChangePercent < -5) {
            losers.push({ name, change: data.priceChangePercent, price: data.current });
        }
    });
    
    const elementCount = Object.keys(prices).length;
    
    return {
        totalMarketCap: marketCap,
        totalVolume24h: totalVolume,
        averageVolatility: elementCount ? avgVolatility / elementCount : 0,
        elementCount,
        lastUpdate: parseInt(localStorage.getItem(STORAGE_KEYS.LAST_UPDATE)) || Date.now(),
        topGainers: gainers.sort((a, b) => b.change - a.change).slice(0, 5),
        topLosers: losers.sort((a, b) => a.change - b.change).slice(0, 5),
        mostActive: getMostActiveElements(5)
    };
}

/**
 * Get most active elements by volume
 */
export function getMostActiveElements(limit = 5) {
    return getAvailableElements()
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
 * Get buy recommendation based on price history
 */
export function getBuyRecommendation(elementName) {
    const history = getPriceHistory(elementName, 30);
    if (history.length < 5) {
        return { recommendation: 'neutral', reason: 'Insufficient data', confidence: 0 };
    }
    
    const prices = history.map(h => h.price);
    const current = prices[prices.length - 1];
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    const position = (current - min) / (max - min);
    const trend = prices[prices.length - 1] - prices[0];
    
    let recommendation = 'neutral', confidence = 50, reason = 'Price in normal range';
    
    if (position < 0.2) {
        recommendation = 'buy';
        confidence = Math.round((1 - position) * 100);
        reason = 'Price near 30-day low';
    } else if (position > 0.8) {
        recommendation = 'wait';
        confidence = Math.round(position * 100);
        reason = 'Price near 30-day high';
    }
    
    if (trend > 0 && recommendation === 'buy') {
        confidence *= 0.8;
        reason += ' (uptrend)';
    } else if (trend < 0 && recommendation === 'wait') {
        confidence *= 0.8;
        reason += ' (downtrend)';
    }
    
    return {
        recommendation,
        reason,
        confidence: Math.min(100, confidence),
        currentPrice: current,
        averagePrice: avg,
        minPrice: min,
        maxPrice: max,
        trend: trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'
    };
}

// ===== EXPORTS =====

export default {
    MARKET_CONFIG,
    initializeMarket,
    updatePrices,
    getCurrentPrices,
    getElementPrice,
    getBidPrice,
    getAskPrice,
    getPriceHistory,
    getMarketVolume,
    recordTrade,
    getVolumeLast24h,
    getSupplyIndex,
    getDemandIndex,
    getAvailableElements,
    getElementsByRarityWithPrices: getElementsByRarity,
    canAffordBuy: (elementName, quantity, credits) => credits >= (getAskPrice(elementName) * quantity),
    hasEnoughToSell: (elementName, quantity, amount) => amount >= quantity,
    setPriceAlert,
    checkPriceAlerts,
    getMarketSummary,
    getMostActiveElements,
    getBuyRecommendation
};

// ===== PRICE ALERTS (moved to end for clarity) =====

export function setPriceAlert(playerId, elementName, type, targetPrice) {
    try {
        const alerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_ALERTS) || '{}');
        if (!alerts[playerId]) alerts[playerId] = [];
        
        alerts[playerId].push({
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            elementName,
            type,
            targetPrice,
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

export function checkPriceAlerts(playerId) {
    try {
        const alerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_ALERTS) || '{}');
        const playerAlerts = alerts[playerId] || [];
        const prices = getCurrentPrices();
        const triggered = [];
        
        playerAlerts.forEach(alert => {
            if (alert.triggered) return;
            
            const price = prices[alert.elementName]?.current;
            if (!price) return;
            
            if ((alert.type === 'above' && price >= alert.targetPrice) ||
                (alert.type === 'below' && price <= alert.targetPrice)) {
                alert.triggered = true;
                triggered.push(alert);
            }
        });
        
        localStorage.setItem(STORAGE_KEYS.PRICE_ALERTS, JSON.stringify(alerts));
        return triggered;
    } catch (error) {
        console.error('Error checking price alerts:', error);
        return [];
    }
}

// Initialize on load
initializeMarket();

// Attach to window for global access
window.MARKET_CONFIG = MARKET_CONFIG;
window.getCurrentPrices = getCurrentPrices;
window.getBidPrice = getBidPrice;
window.getAskPrice = getAskPrice;
window.getAvailableElements = getAvailableElements;

console.log('✅ market-dynamics.js loaded - Optimized market system ready');

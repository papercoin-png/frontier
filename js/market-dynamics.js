// js/market-dynamics.js - Dynamic pricing engine for Voidfarer
// Now using IndexedDB via storage.js for unlimited storage
// Handles supply/demand calculations, price history, and market trends

import {
    getItem,
    setItem,
    getAll,
    getAllFromIndex,
    addElementToCollection,
    removeElementFromCollection,
    getCollection,
    getCredits,
    addCredits,
    spendCredits
} from './storage.js';

// ===== BASE PRICES =====
export const BASE_PRICES = {
    // Common
    'Carbon': 100,
    'Silicon': 100,
    'Hydrogen': 100,
    'Helium': 100,
    'Sodium': 100,
    'Lithium': 100,
    'Magnesium': 100,
    'Aluminum': 100,
    'Potassium': 100,
    'Calcium': 100,
    
    // Uncommon
    'Iron': 250,
    'Oxygen': 250,
    'Nickel': 250,
    'Sulfur': 250,
    'Phosphorus': 250,
    'Chlorine': 250,
    'Argon': 250,
    'Lead': 250,
    
    // Rare
    'Gold': 1000,
    'Silver': 1000,
    'Platinum': 1000,
    'Copper': 1000,
    'Titanium': 1000,
    'Zinc': 1000,
    'Tin': 1000,
    'Cobalt': 1000,
    'Chromium': 1000,
    
    // Very Rare
    'Uranium': 5000,
    'Thorium': 5000,
    'Plutonium': 5000,
    'Radium': 5000,
    'Polonium': 5000,
    
    // Legendary
    'Promethium': 25000,
    'Technetium': 25000,
    'Astatine': 25000,
    'Francium': 25000
};

// ===== RARITY MAPPING =====
export const ELEMENT_RARITY = {
    // Common
    'Carbon': 'common', 'Silicon': 'common', 'Hydrogen': 'common', 'Helium': 'common',
    'Sodium': 'common', 'Lithium': 'common', 'Magnesium': 'common', 'Aluminum': 'common',
    'Potassium': 'common', 'Calcium': 'common',
    
    // Uncommon
    'Iron': 'uncommon', 'Oxygen': 'uncommon', 'Nickel': 'uncommon', 'Sulfur': 'uncommon',
    'Phosphorus': 'uncommon', 'Chlorine': 'uncommon', 'Argon': 'uncommon', 'Lead': 'uncommon',
    
    // Rare
    'Gold': 'rare', 'Silver': 'rare', 'Platinum': 'rare', 'Copper': 'rare',
    'Titanium': 'rare', 'Zinc': 'rare', 'Tin': 'rare', 'Cobalt': 'rare', 'Chromium': 'rare',
    
    // Very Rare
    'Uranium': 'very-rare', 'Thorium': 'very-rare', 'Plutonium': 'very-rare',
    'Radium': 'very-rare', 'Polonium': 'very-rare',
    
    // Legendary
    'Promethium': 'legendary', 'Technetium': 'legendary', 'Astatine': 'legendary', 'Francium': 'legendary'
};

// ===== VOLATILITY BY RARITY =====
export const VOLATILITY = {
    'common': 0.08,      // 8% daily fluctuation
    'uncommon': 0.12,    // 12%
    'rare': 0.18,        // 18%
    'very-rare': 0.25,   // 25%
    'legendary': 0.35    // 35%
};

// ===== MARKET TRENDS =====
export const TREND_TYPES = {
    BULL: 'bull',        // Price increasing
    BEAR: 'bear',        // Price decreasing
    STABLE: 'stable',    // Little movement
    VOLATILE: 'volatile' // High fluctuation
};

// ===== STORAGE KEYS (for localStorage fallback) =====
const MARKET_STORAGE_KEYS = {
    PRICE_HISTORY_PREFIX: 'market_price_',
    TRADE_HISTORY_PREFIX: 'market_trades_',
    LAST_UPDATE: 'market_last_update',
    GLOBAL_SUPPLY: 'market_global_supply',
    GLOBAL_DEMAND: 'market_global_demand'
};

// ===== HELPER FUNCTIONS =====
export function getElementRarity(elementName) {
    return ELEMENT_RARITY[elementName] || 'common';
}

export function getBasePrice(elementName) {
    return BASE_PRICES[elementName] || 100;
}

// ===== PRICE HISTORY MANAGEMENT (IndexedDB) =====
export async function getPriceHistory(elementName) {
    const allHistory = await getAll('priceHistory');
    return allHistory.filter(h => h.elementName === elementName)
                    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function recordPrice(elementName, price) {
    const history = await getPriceHistory(elementName);
    
    const today = new Date().toISOString().split('T')[0];
    // Check if we already have an entry for today
    const existingEntry = history.find(h => h.date === today);
    
    if (existingEntry) {
        // Update existing entry
        existingEntry.price = Math.round(price);
        await setItem('priceHistory', existingEntry);
    } else {
        // Create new entry
        const newEntry = {
            id: `price_${elementName}_${today}`,
            elementName: elementName,
            date: today,
            price: Math.round(price),
            timestamp: Date.now()
        };
        await setItem('priceHistory', newEntry);
    }
    
    // Clean up old entries (keep last 90 days)
    const allEntries = await getAll('priceHistory');
    const elementEntries = allEntries.filter(h => h.elementName === elementName)
                                    .sort((a, b) => b.date.localeCompare(a.date));
    
    if (elementEntries.length > 90) {
        const toDelete = elementEntries.slice(90);
        for (const entry of toDelete) {
            await deleteItem('priceHistory', entry.id);
        }
    }
    
    return await getPriceHistory(elementName);
}

export async function getPriceForDate(elementName, date) {
    const history = await getPriceHistory(elementName);
    const entry = history.find(h => h.date === date);
    return entry ? entry.price : null;
}

export async function getLatestPrice(elementName) {
    const history = await getPriceHistory(elementName);
    if (history.length > 0) {
        return history[history.length - 1].price;
    }
    return getBasePrice(elementName);
}

// ===== TRADE HISTORY MANAGEMENT (IndexedDB) =====
export async function getTradeHistory(elementName) {
    const allTrades = await getAll('tradeHistory');
    return allTrades.filter(t => t.elementName === elementName)
                   .sort((a, b) => b.timestamp - a.timestamp);
}

export async function recordTrade(elementName, quantity, price) {
    const trade = {
        id: 'trade_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        elementName: elementName,
        quantity: quantity,
        price: price,
        totalValue: quantity * price,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0]
    };
    
    await setItem('tradeHistory', trade);
    
    // Clean up old trades (keep last 1000)
    const allTrades = await getAll('tradeHistory');
    if (allTrades.length > 1000) {
        const sorted = allTrades.sort((a, b) => a.timestamp - b.timestamp);
        const toDelete = sorted.slice(0, allTrades.length - 1000);
        for (const trade of toDelete) {
            await deleteItem('tradeHistory', trade.id);
        }
    }
    
    return trade;
}

export async function getRecentTrades(elementName, days = 7) {
    const trades = await getTradeHistory(elementName);
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return trades.filter(t => t.timestamp > cutoff);
}

// ===== SUPPLY CALCULATION =====
export async function calculateGlobalSupply(elementName) {
    const collection = await getCollection();
    return collection[elementName]?.count || 0;
}

export async function calculateSupplyFactor(elementName) {
    const supply = await calculateGlobalSupply(elementName);
    // More supply = lower price factor (0.5 to 1.5 range)
    return Math.max(0.5, Math.min(1.5, 20 / (supply + 5)));
}

// ===== DEMAND CALCULATION =====
export async function calculateDemandFactor(elementName) {
    const recentTrades = await getRecentTrades(elementName, 3);
    const tradeCount = recentTrades.length;
    
    // More trades = higher demand factor (0.8 to 1.8 range)
    return Math.max(0.8, Math.min(1.8, 0.8 + (tradeCount * 0.1)));
}

// ===== TREND DETECTION =====
export async function detectTrend(elementName) {
    const history = await getPriceHistory(elementName);
    if (history.length < 5) return TREND_TYPES.STABLE;
    
    // Get last 5 prices
    const recent = history.slice(-5).map(h => h.price);
    
    // Calculate average change
    let changes = 0;
    for (let i = 1; i < recent.length; i++) {
        changes += (recent[i] - recent[i-1]) / recent[i-1];
    }
    const avgChange = changes / (recent.length - 1);
    
    // Calculate volatility
    const prices = history.slice(-10).map(h => h.price);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance) / mean;
    
    if (volatility > 0.15) return TREND_TYPES.VOLATILE;
    if (avgChange > 0.02) return TREND_TYPES.BULL;
    if (avgChange < -0.02) return TREND_TYPES.BEAR;
    return TREND_TYPES.STABLE;
}

// ===== PRICE CHANGE CALCULATION =====
export async function calculatePriceChange(elementName, days = 7) {
    const history = await getPriceHistory(elementName);
    if (history.length < 2) return 0;
    
    const current = history[history.length - 1].price;
    const pastIndex = Math.max(0, history.length - days - 1);
    const past = history[pastIndex]?.price || current;
    
    return ((current - past) / past * 100).toFixed(1);
}

// ===== MARKET PRICE CALCULATION =====
export async function calculateMarketPrice(elementName) {
    const basePrice = getBasePrice(elementName);
    const rarity = getElementRarity(elementName);
    
    // Get current market factors
    const supplyFactor = await calculateSupplyFactor(elementName);
    const demandFactor = await calculateDemandFactor(elementName);
    
    // Random volatility
    const volatility = VOLATILITY[rarity];
    const randomWalk = 1 + (Math.random() * volatility * 2 - volatility);
    
    // Trend influence
    const trend = await detectTrend(elementName);
    let trendFactor = 1.0;
    if (trend === TREND_TYPES.BULL) trendFactor = 1.05;
    if (trend === TREND_TYPES.BEAR) trendFactor = 0.95;
    
    // Calculate final price
    const marketPrice = basePrice * supplyFactor * demandFactor * randomWalk * trendFactor;
    
    return Math.round(marketPrice);
}

// ===== UPDATE ALL PRICES =====
export async function updateDailyPrices() {
    const lastUpdate = localStorage.getItem(MARKET_STORAGE_KEYS.LAST_UPDATE);
    const today = new Date().toISOString().split('T')[0];
    
    // Only update once per day
    if (lastUpdate === today) {
        console.log('Prices already updated today');
        return false;
    }
    
    console.log('Updating daily market prices...');
    
    // Update price for each element
    for (const elementName of Object.keys(BASE_PRICES)) {
        const newPrice = await calculateMarketPrice(elementName);
        await recordPrice(elementName, newPrice);
    }
    
    localStorage.setItem(MARKET_STORAGE_KEYS.LAST_UPDATE, today);
    return true;
}

// ===== GET MARKET SUMMARY =====
export async function getMarketSummary() {
    const summary = {};
    
    for (const elementName of Object.keys(BASE_PRICES)) {
        const currentPrice = await getLatestPrice(elementName);
        const change7d = await calculatePriceChange(elementName, 7);
        const change30d = await calculatePriceChange(elementName, 30);
        const trend = await detectTrend(elementName);
        const rarity = getElementRarity(elementName);
        
        summary[elementName] = {
            currentPrice: currentPrice,
            change7d: change7d,
            change30d: change30d,
            trend: trend,
            rarity: rarity,
            basePrice: BASE_PRICES[elementName]
        };
    }
    
    return summary;
}

// ===== GET TOP MOVERS =====
export async function getTopMovers(limit = 5) {
    const summary = await getMarketSummary();
    const movers = Object.keys(summary).map(elementName => ({
        name: elementName,
        change: parseFloat(summary[elementName].change7d),
        price: summary[elementName].currentPrice,
        trend: summary[elementName].trend
    }));
    
    // Sort by absolute change
    movers.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    
    return {
        gainers: movers.filter(m => m.change > 0).slice(0, limit),
        losers: movers.filter(m => m.change < 0).slice(0, limit)
    };
}

// ===== BUY/SELL FUNCTIONS =====
export async function buyElement(elementName, quantity, pricePerUnit) {
    const totalCost = quantity * pricePerUnit;
    const credits = await getCredits();
    
    if (credits < totalCost) {
        return { success: false, reason: 'insufficient_credits', required: totalCost };
    }
    
    // Spend credits
    const spent = await spendCredits(totalCost);
    if (!spent) {
        return { success: false, reason: 'transaction_failed' };
    }
    
    // Add to collection
    await addElementToCollection(elementName, quantity);
    
    // Record trade
    await recordTrade(elementName, quantity, pricePerUnit);
    
    return {
        success: true,
        quantity,
        totalCost,
        newCredits: credits - totalCost
    };
}

export async function sellElement(elementName, quantity, pricePerUnit) {
    const collection = await getCollection();
    
    if (!collection[elementName] || collection[elementName].count < quantity) {
        return { 
            success: false, 
            reason: 'insufficient_elements', 
            available: collection[elementName]?.count || 0 
        };
    }
    
    const totalEarnings = quantity * pricePerUnit;
    
    // Remove from collection
    await removeElementFromCollection(elementName, quantity);
    
    // Add credits
    await addCredits(totalEarnings);
    
    // Record trade
    await recordTrade(elementName, -quantity, pricePerUnit); // Negative quantity for sell
    
    return {
        success: true,
        quantity,
        totalEarnings,
        newCredits: (await getCredits())
    };
}

// ===== PRICE ALERTS (keep in localStorage) =====
const PRICE_ALERTS = {};

export function setPriceAlert(elementName, targetPrice, type = 'above') {
    if (!PRICE_ALERTS[elementName]) {
        PRICE_ALERTS[elementName] = [];
    }
    
    PRICE_ALERTS[elementName].push({
        targetPrice: targetPrice,
        type: type,
        triggered: false
    });
    
    // Store in localStorage for persistence
    const alerts = JSON.parse(localStorage.getItem('voidfarer_price_alerts') || '{}');
    if (!alerts[elementName]) alerts[elementName] = [];
    alerts[elementName].push({
        targetPrice,
        type,
        created: Date.now()
    });
    localStorage.setItem('voidfarer_price_alerts', JSON.stringify(alerts));
}

export async function checkPriceAlerts() {
    const alerts = JSON.parse(localStorage.getItem('voidfarer_price_alerts') || '{}');
    
    for (const [elementName, elementAlerts] of Object.entries(alerts)) {
        const currentPrice = await getLatestPrice(elementName);
        
        for (const alert of elementAlerts) {
            if (alert.triggered) continue;
            
            if (alert.type === 'above' && currentPrice >= alert.targetPrice) {
                alert.triggered = true;
                showPriceAlert(elementName, currentPrice, 'above');
            } else if (alert.type === 'below' && currentPrice <= alert.targetPrice) {
                alert.triggered = true;
                showPriceAlert(elementName, currentPrice, 'below');
            }
        }
    }
    
    localStorage.setItem('voidfarer_price_alerts', JSON.stringify(alerts));
}

function showPriceAlert(elementName, price, type) {
    const message = type === 'above' 
        ? `${elementName} has risen above ${price}⭐!`
        : `${elementName} has fallen below ${price}⭐!`;
    
    // Use Telegram notification if available
    if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
            title: 'Price Alert',
            message: message,
            buttons: [{ type: 'ok' }]
        });
    } else {
        alert(message);
    }
}

// ===== MARKET STATISTICS =====
export async function getMarketStats() {
    const allTrades = await getAll('tradeHistory');
    const allPrices = await getAll('priceHistory');
    
    // Group by element
    const stats = {};
    
    for (const elementName of Object.keys(BASE_PRICES)) {
        const elementTrades = allTrades.filter(t => t.elementName === elementName);
        const elementPrices = allPrices.filter(p => p.elementName === elementName)
                                       .sort((a, b) => a.date.localeCompare(b.date));
        
        const currentPrice = elementPrices.length > 0 ? 
            elementPrices[elementPrices.length - 1].price : 
            BASE_PRICES[elementName];
        
        const prices = elementPrices.map(p => p.price);
        const avgPrice = prices.length > 0 ? 
            prices.reduce((a, b) => a + b, 0) / prices.length : 
            BASE_PRICES[elementName];
        
        const volume = elementTrades.reduce((sum, t) => sum + Math.abs(t.quantity), 0);
        const tradeCount = elementTrades.length;
        
        stats[elementName] = {
            currentPrice,
            averagePrice: Math.round(avgPrice),
            volume,
            tradeCount,
            volatility: VOLATILITY[getElementRarity(elementName)],
            basePrice: BASE_PRICES[elementName]
        };
    }
    
    return stats;
}

// ===== EXPORT =====
export default {
    BASE_PRICES,
    ELEMENT_RARITY,
    VOLATILITY,
    TREND_TYPES,
    getElementRarity,
    getBasePrice,
    getPriceHistory,
    recordPrice,
    getLatestPrice,
    recordTrade,
    getRecentTrades,
    calculateSupplyFactor,
    calculateDemandFactor,
    detectTrend,
    calculatePriceChange,
    calculateMarketPrice,
    updateDailyPrices,
    getMarketSummary,
    getTopMovers,
    buyElement,
    sellElement,
    setPriceAlert,
    checkPriceAlerts,
    getMarketStats
};

// Need to import deleteItem for cleanup
import { deleteItem } from './storage.js';

// market-dynamics.js - Dynamic pricing engine for Voidfarer
// Handles supply/demand calculations, price history, and market trends

// ===== BASE PRICES =====
const BASE_PRICES = {
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
const ELEMENT_RARITY = {
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
const VOLATILITY = {
    'common': 0.08,      // 8% daily fluctuation
    'uncommon': 0.12,    // 12%
    'rare': 0.18,        // 18%
    'very-rare': 0.25,   // 25%
    'legendary': 0.35    // 35%
};

// ===== MARKET TRENDS =====
const TREND_TYPES = {
    BULL: 'bull',        // Price increasing
    BEAR: 'bear',        // Price decreasing
    STABLE: 'stable',    // Little movement
    VOLATILE: 'volatile' // High fluctuation
};

// ===== STORAGE KEYS =====
const MARKET_STORAGE_KEYS = {
    PRICE_HISTORY_PREFIX: 'market_price_',
    TRADE_HISTORY_PREFIX: 'market_trades_',
    LAST_UPDATE: 'market_last_update',
    GLOBAL_SUPPLY: 'market_global_supply',
    GLOBAL_DEMAND: 'market_global_demand'
};

// ===== HELPER FUNCTIONS =====
function getElementRarity(elementName) {
    return ELEMENT_RARITY[elementName] || 'common';
}

function getBasePrice(elementName) {
    return BASE_PRICES[elementName] || 100;
}

// ===== PRICE HISTORY MANAGEMENT =====
function getPriceHistory(elementName) {
    const key = MARKET_STORAGE_KEYS.PRICE_HISTORY_PREFIX + elementName;
    const history = localStorage.getItem(key);
    return history ? JSON.parse(history) : [];
}

function recordPrice(elementName, price) {
    const key = MARKET_STORAGE_KEYS.PRICE_HISTORY_PREFIX + elementName;
    let history = getPriceHistory(elementName);
    
    // Add new price with date
    history.push({
        date: new Date().toISOString().split('T')[0],
        price: Math.round(price)
    });
    
    // Keep only last 90 days
    if (history.length > 90) {
        history = history.slice(-90);
    }
    
    localStorage.setItem(key, JSON.stringify(history));
    return history;
}

function getPriceForDate(elementName, date) {
    const history = getPriceHistory(elementName);
    const entry = history.find(h => h.date === date);
    return entry ? entry.price : null;
}

function getLatestPrice(elementName) {
    const history = getPriceHistory(elementName);
    return history.length > 0 ? history[history.length - 1].price : getBasePrice(elementName);
}

// ===== TRADE HISTORY MANAGEMENT =====
function getTradeHistory(elementName) {
    const key = MARKET_STORAGE_KEYS.TRADE_HISTORY_PREFIX + elementName;
    const trades = localStorage.getItem(key);
    return trades ? JSON.parse(trades) : [];
}

function recordTrade(elementName, quantity, price) {
    const key = MARKET_STORAGE_KEYS.TRADE_HISTORY_PREFIX + elementName;
    let trades = getTradeHistory(elementName);
    
    trades.push({
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
        quantity: quantity,
        price: price
    });
    
    // Keep only last 100 trades
    if (trades.length > 100) {
        trades = trades.slice(-100);
    }
    
    localStorage.setItem(key, JSON.stringify(trades));
    return trades;
}

function getRecentTrades(elementName, days = 7) {
    const trades = getTradeHistory(elementName);
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return trades.filter(t => t.timestamp > cutoff);
}

// ===== SUPPLY CALCULATION =====
function calculateGlobalSupply(elementName) {
    // This would ideally track all players, but for single player we use local collection
    const collection = JSON.parse(localStorage.getItem('voidfarer_collection')) || {};
    return collection[elementName]?.count || 0;
}

function calculateSupplyFactor(elementName) {
    const supply = calculateGlobalSupply(elementName);
    // More supply = lower price factor (0.5 to 1.5 range)
    return Math.max(0.5, Math.min(1.5, 20 / (supply + 5)));
}

// ===== DEMAND CALCULATION =====
function calculateDemandFactor(elementName) {
    const recentTrades = getRecentTrades(elementName, 3);
    const tradeCount = recentTrades.length;
    
    // More trades = higher demand factor (0.8 to 1.8 range)
    return Math.max(0.8, Math.min(1.8, 0.8 + (tradeCount * 0.1)));
}

// ===== TREND DETECTION =====
function detectTrend(elementName) {
    const history = getPriceHistory(elementName);
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
function calculatePriceChange(elementName, days = 7) {
    const history = getPriceHistory(elementName);
    if (history.length < 2) return 0;
    
    const current = history[history.length - 1].price;
    const pastIndex = Math.max(0, history.length - days - 1);
    const past = history[pastIndex]?.price || current;
    
    return ((current - past) / past * 100).toFixed(1);
}

// ===== MARKET PRICE CALCULATION =====
function calculateMarketPrice(elementName) {
    const basePrice = getBasePrice(elementName);
    const rarity = getElementRarity(elementName);
    
    // Get current market factors
    const supplyFactor = calculateSupplyFactor(elementName);
    const demandFactor = calculateDemandFactor(elementName);
    
    // Random volatility
    const volatility = VOLATILITY[rarity];
    const randomWalk = 1 + (Math.random() * volatility * 2 - volatility);
    
    // Trend influence
    const trend = detectTrend(elementName);
    let trendFactor = 1.0;
    if (trend === TREND_TYPES.BULL) trendFactor = 1.05;
    if (trend === TREND_TYPES.BEAR) trendFactor = 0.95;
    
    // Calculate final price
    const marketPrice = basePrice * supplyFactor * demandFactor * randomWalk * trendFactor;
    
    return Math.round(marketPrice);
}

// ===== UPDATE ALL PRICES =====
function updateDailyPrices() {
    const lastUpdate = localStorage.getItem(MARKET_STORAGE_KEYS.LAST_UPDATE);
    const today = new Date().toISOString().split('T')[0];
    
    // Only update once per day
    if (lastUpdate === today) {
        console.log('Prices already updated today');
        return false;
    }
    
    console.log('Updating daily market prices...');
    
    // Update price for each element
    Object.keys(BASE_PRICES).forEach(elementName => {
        const newPrice = calculateMarketPrice(elementName);
        recordPrice(elementName, newPrice);
    });
    
    localStorage.setItem(MARKET_STORAGE_KEYS.LAST_UPDATE, today);
    return true;
}

// ===== GET MARKET SUMMARY =====
function getMarketSummary() {
    const summary = {};
    
    Object.keys(BASE_PRICES).forEach(elementName => {
        const currentPrice = getLatestPrice(elementName);
        const change7d = calculatePriceChange(elementName, 7);
        const change30d = calculatePriceChange(elementName, 30);
        const trend = detectTrend(elementName);
        const rarity = getElementRarity(elementName);
        
        summary[elementName] = {
            currentPrice: currentPrice,
            change7d: change7d,
            change30d: change30d,
            trend: trend,
            rarity: rarity,
            basePrice: BASE_PRICES[elementName]
        };
    });
    
    return summary;
}

// ===== GET TOP MOVERS =====
function getTopMovers(limit = 5) {
    const summary = getMarketSummary();
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

// ===== PRICE ALERTS =====
const PRICE_ALERTS = {};

function setPriceAlert(elementName, targetPrice, type = 'above') {
    if (!PRICE_ALERTS[elementName]) {
        PRICE_ALERTS[elementName] = [];
    }
    
    PRICE_ALERTS[elementName].push({
        targetPrice: targetPrice,
        type: type,
        triggered: false
    });
}

function checkPriceAlerts() {
    Object.keys(PRICE_ALERTS).forEach(elementName => {
        const currentPrice = getLatestPrice(elementName);
        
        PRICE_ALERTS[elementName].forEach(alert => {
            if (alert.triggered) return;
            
            if (alert.type === 'above' && currentPrice >= alert.targetPrice) {
                alert.triggered = true;
                showPriceAlert(elementName, currentPrice, 'above');
            } else if (alert.type === 'below' && currentPrice <= alert.targetPrice) {
                alert.triggered = true;
                showPriceAlert(elementName, currentPrice, 'below');
            }
        });
    });
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

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
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
        setPriceAlert,
        checkPriceAlerts
    };
}

// js/market-dynamics.js - Dynamic market pricing and element trading for Voidfarer
// Handles price fluctuations, supply/demand, and market history for all 118 elements
// OPTIMIZED: Cleaned up code, removed redundancies, improved performance
// FIXED: Added storage limits and error handling for supply/demand indices AND price history
// FIXED: Exposed recordTrade and supply/demand functions to window for shipyard integration
// FIXED: UPDATE_INTERVAL changed to 1 minute for more dynamic market reactions
// UPDATED: Now uses elements-data.js as the single source of truth for element data

import { ELEMENTS, getElementByName, getElementsByRarity, getElementVolatility, getElementBaseVolume } from './elements-data.js';

// ===== MARKET CONFIGURATION =====

const MARKET_CONFIG = {
    BASE_VOLATILITY: 0.05,
    EVENT_VOLATILITY: 0.15,
    TREND_STRENGTH: 0.7,
    UPDATE_INTERVAL: 60000, // 1 minute (60,000 ms) - changed from 1 hour for more dynamic market
    MIN_PRICE_MULTIPLIER: 0.3,
    MAX_PRICE_MULTIPLIER: 3.0,
    DEFAULT_TRANSACTION_FEE: 0.02,
    SUPPLY_DEMAND_FACTOR: 0.1,
    VOLUME_DECAY: 0.95,
    SPREAD_PERCENT: 0.02, // 2% bid-ask spread
    
    // ===== STORAGE OPTIMIZATION SETTINGS - AGGRESSIVELY REDUCED =====
    // Price history - reduced to prevent quota issues
    MAX_PRICE_HISTORY_PER_ELEMENT: 15, // Reduced from 30 to 15
    MAX_HISTORY_AGE_DAYS: 3, // Reduced from 7 to 3 days
    
    // Supply/demand - aggressive limits
    MAX_SUPPLY_DEMAND_VALUE: 5000, // Reduced from 10000 to 5000
    MAX_SUPPLY_DEMAND_ENTRIES: 50, // Reduced from 200 to 50
    
    // Volume history
    MAX_VOLUME_HISTORY_DAYS: 7, // Keep 7 days of volume data
    
    // Cleanup settings
    ENABLE_AUTO_CLEANUP: true,
    CLEANUP_ON_STARTUP: true
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

// Ship part patterns for filtering (no longer used for element filtering, kept for backward compatibility)
const SHIP_PART_PATTERNS = [
    'ship_', 'cargo_', 'engine_', 'weapon_', 'module_', 'reactor_',
    'shield_', 'thruster_', 'drive_', 'scanner_', 'mining_', 'crystal_',
    'component_', 'system_', 'cannon_', 'laser_', 'missile_', 'plasma_', 'railgun'
];

// Helper function to get element base price from elements-data.js
function getElementBasePrice(elementName) {
    const element = getElementByName(elementName);
    return element ? element.value : 100;
}

// Helper function to get element volatility from elements-data.js
function getElementVolatilityValue(elementName) {
    return getElementVolatility(elementName);
}

// Helper function to get element base volume from elements-data.js
function getElementBaseVolumeValue(elementName) {
    return getElementBaseVolume(elementName);
}

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
        
        // Use ELEMENTS array from elements-data.js
        ELEMENTS.forEach(element => {
            const elementName = element.name;
            const basePrice = element.value || 100;
            const volatility = getElementVolatilityValue(elementName);
            
            initialPrices[elementName] = {
                current: basePrice,
                base: basePrice,
                bid: Math.floor(basePrice * (1 - MARKET_CONFIG.SPREAD_PERCENT / 2)),
                ask: Math.ceil(basePrice * (1 + MARKET_CONFIG.SPREAD_PERCENT / 2)),
                trend: 0,
                volatility: volatility,
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
        
        console.log('✅ Market initialized with chemical elements from elements-data.js');
    } else {
        // Run cleanup on existing data to prevent future issues
        if (MARKET_CONFIG.CLEANUP_ON_STARTUP) {
            cleanupOldMarketData();
        }
    }
}

// ===== PRICE MANAGEMENT =====

/**
 * Check if an element is a valid chemical (not a ship part)
 */
function isValidChemical(elementName) {
    // First check if it exists in elements-data.js
    const element = getElementByName(elementName);
    if (!element) return false;
    
    // Also ensure it's not a ship part pattern
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
        trend: 0,
        volatility: 0.05
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
    
    // Update at most once per minute (now that UPDATE_INTERVAL is 60000)
    if ((now - lastUpdate) < MARKET_CONFIG.UPDATE_INTERVAL) return prices;
    
    const eventEffects = calculateEventEffects(activeEvents);
    
    Object.entries(prices).forEach(([elementName, priceData]) => {
        const element = getElementByName(elementName);
        if (!element) return;
        
        const trend = trends[elementName] || { shortTerm: 0, mediumTerm: 0, longTerm: 0, strength: 0 };
        const supplyIndex = getSupplyIndex(elementName);
        const demandIndex = getDemandIndex(elementName);
        const volatility = getElementVolatilityValue(elementName);
        
        // Calculate price factors
        const supplyDemandFactor = (demandIndex - supplyIndex) * MARKET_CONFIG.SUPPLY_DEMAND_FACTOR;
        const randomFactor = (Math.random() - 0.5) * 2 * volatility;
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
        
        // Add to price history with error handling
        try {
            addToPriceHistory(elementName, newPrice, priceData.volume24h, now);
        } catch (e) {
            console.warn(`Failed to add price history for ${elementName}, skipping...`);
        }
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

// ===== PRICE HISTORY - OPTIMIZED WITH STORAGE LIMITS =====

/**
 * Add price to history with storage limits and error handling
 */
function addToPriceHistory(elementName, price, volume, timestamp) {
    try {
        // Load history with error handling
        let history = {};
        try {
            const historyStr = localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY);
            if (historyStr) {
                history = JSON.parse(historyStr);
                if (typeof history !== 'object' || history === null) {
                    history = {};
                }
            }
        } catch (e) {
            console.warn('Corrupted price history, resetting...');
            history = {};
        }
        
        // Initialize array for this element if needed
        if (!history[elementName]) {
            history[elementName] = [];
        }
        
        // Add new entry
        history[elementName].push({
            price: Math.round(price),
            bid: Math.floor(price * 0.99),
            ask: Math.ceil(price * 1.01),
            volume,
            timestamp,
            date: new Date(timestamp).toISOString()
        });
        
        // Apply age-based filtering (keep only last X days)
        const cutoffTime = Date.now() - (MARKET_CONFIG.MAX_HISTORY_AGE_DAYS * 24 * 60 * 60 * 1000);
        history[elementName] = history[elementName].filter(h => h.timestamp >= cutoffTime);
        
        // Then apply count limit (keep only last N entries)
        if (history[elementName].length > MARKET_CONFIG.MAX_PRICE_HISTORY_PER_ELEMENT) {
            history[elementName] = history[elementName].slice(-MARKET_CONFIG.MAX_PRICE_HISTORY_PER_ELEMENT);
        }
        
        // Save with error handling
        try {
            localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(history));
        } catch (e) {
            console.warn('Storage quota exceeded for price history, performing emergency cleanup...');
            
            // More aggressive: keep only last 5 entries per element
            Object.keys(history).forEach(key => {
                if (Array.isArray(history[key])) {
                    history[key] = history[key].slice(-5);
                }
            });
            
            try {
                localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(history));
            } catch (e2) {
                console.warn('Emergency: Clearing price history entirely');
                localStorage.removeItem(STORAGE_KEYS.PRICE_HISTORY);
            }
        }
        
    } catch (error) {
        console.error('Error in addToPriceHistory:', error);
    }
}

/**
 * Get price history for an element
 */
export function getPriceHistory(elementName, days = 3) {
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY) || '{}');
        const elementHistory = history[elementName] || [];
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        
        return elementHistory.filter(h => h.timestamp >= cutoff);
    } catch (error) {
        console.error('Error getting price history:', error);
        return [];
    }
}

// ===== VOLUME TRACKING - OPTIMIZED =====

/**
 * Get market volume data
 */
export function getMarketVolume() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.MARKET_VOLUME) || '{}');
    } catch (e) {
        return {};
    }
}

/**
 * Record a trade
 */
export function recordTrade(elementName, quantity, type) {
    try {
        const volume = getMarketVolume();
        const today = new Date().toISOString().split('T')[0];
        
        if (!volume[elementName]) volume[elementName] = {};
        if (!volume[elementName][today]) {
            volume[elementName][today] = { buy: 0, sell: 0, total: 0 };
        }
        
        volume[elementName][today][type] += quantity;
        volume[elementName][today].total += quantity;
        
        localStorage.setItem(STORAGE_KEYS.MARKET_VOLUME, JSON.stringify(volume));
        
        // Update supply/demand
        try {
            updateSupplyDemand(elementName, quantity, type);
        } catch (e) {
            console.warn('Failed to update supply/demand:', e);
        }
        
    } catch (error) {
        console.error('Error recording trade:', error);
    }
}

/**
 * Get volume for last 24 hours
 */
export function getVolumeLast24h(elementName) {
    try {
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
    } catch (e) {
        return 0;
    }
}

/**
 * Decay old volume data - keep only recent data
 */
function decayVolumeData() {
    try {
        const volume = getMarketVolume();
        const cutoffDate = Date.now() - (MARKET_CONFIG.MAX_VOLUME_HISTORY_DAYS * 24 * 60 * 60 * 1000);
        let changed = false;
        
        Object.keys(volume).forEach(elementName => {
            if (volume[elementName] && typeof volume[elementName] === 'object') {
                Object.keys(volume[elementName]).forEach(date => {
                    if (new Date(date).getTime() < cutoffDate) {
                        delete volume[elementName][date];
                        changed = true;
                    }
                });
                
                if (Object.keys(volume[elementName]).length === 0) {
                    delete volume[elementName];
                    changed = true;
                }
            }
        });
        
        if (changed) {
            localStorage.setItem(STORAGE_KEYS.MARKET_VOLUME, JSON.stringify(volume));
        }
    } catch (error) {
        console.error('Error decaying volume data:', error);
    }
}

// ===== SUPPLY/DEMAND INDICES - OPTIMIZED WITH STORAGE LIMITS =====

/**
 * Update supply/demand indices with storage limits and error handling
 */
function updateSupplyDemand(elementName, quantity, type) {
    try {
        let supply = {};
        let demand = {};
        
        // Try to load existing data with error handling
        try {
            const supplyStr = localStorage.getItem(STORAGE_KEYS.SUPPLY_INDEX);
            const demandStr = localStorage.getItem(STORAGE_KEYS.DEMAND_INDEX);
            
            if (supplyStr) {
                try {
                    supply = JSON.parse(supplyStr);
                    if (typeof supply !== 'object' || supply === null) supply = {};
                } catch (e) {
                    console.warn('Corrupted supply data, resetting...');
                    supply = {};
                }
            }
            
            if (demandStr) {
                try {
                    demand = JSON.parse(demandStr);
                    if (typeof demand !== 'object' || demand === null) demand = {};
                } catch (e) {
                    console.warn('Corrupted demand data, resetting...');
                    demand = {};
                }
            }
        } catch (e) {
            console.warn('Error loading supply/demand data, resetting...');
            supply = {};
            demand = {};
        }
        
        // Update the specific element
        if (type === 'buy') {
            demand[elementName] = (demand[elementName] || 0) + quantity;
        } else {
            supply[elementName] = (supply[elementName] || 0) + quantity;
        }
        
        // Apply decay and clean up in one pass
        [supply, demand].forEach(index => {
            Object.keys(index).forEach(key => {
                // Apply decay
                index[key] = Math.floor(index[key] * MARKET_CONFIG.VOLUME_DECAY);
                
                // Remove tiny values
                if (index[key] < 1) {
                    delete index[key];
                    return;
                }
                
                // Cap maximum value to prevent overflow
                if (index[key] > MARKET_CONFIG.MAX_SUPPLY_DEMAND_VALUE) {
                    index[key] = MARKET_CONFIG.MAX_SUPPLY_DEMAND_VALUE;
                }
            });
        });
        
        // Limit total number of entries (keep only most active elements)
        [supply, demand].forEach(index => {
            const entries = Object.entries(index);
            if (entries.length > MARKET_CONFIG.MAX_SUPPLY_DEMAND_ENTRIES) {
                const sorted = entries.sort((a, b) => b[1] - a[1]);
                const limited = Object.fromEntries(sorted.slice(0, MARKET_CONFIG.MAX_SUPPLY_DEMAND_ENTRIES));
                Object.keys(index).forEach(key => delete index[key]);
                Object.assign(index, limited);
            }
        });
        
        // Store with error handling and fallback
        try {
            localStorage.setItem(STORAGE_KEYS.SUPPLY_INDEX, JSON.stringify(supply));
            localStorage.setItem(STORAGE_KEYS.DEMAND_INDEX, JSON.stringify(demand));
        } catch (e) {
            console.warn('Storage quota exceeded for supply/demand, storing minimal version...');
            
            // Keep only top 25 entries for each
            const minimalSupply = Object.fromEntries(
                Object.entries(supply)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 25)
            );
            
            const minimalDemand = Object.fromEntries(
                Object.entries(demand)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 25)
            );
            
            try {
                localStorage.setItem(STORAGE_KEYS.SUPPLY_INDEX, JSON.stringify(minimalSupply));
                localStorage.setItem(STORAGE_KEYS.DEMAND_INDEX, JSON.stringify(minimalDemand));
            } catch (e2) {
                console.warn('Storage still full, clearing old supply/demand data...');
                localStorage.removeItem(STORAGE_KEYS.SUPPLY_INDEX);
                localStorage.removeItem(STORAGE_KEYS.DEMAND_INDEX);
            }
        }
        
    } catch (error) {
        console.error('Error in updateSupplyDemand:', error);
    }
}

/**
 * Get supply index for an element
 */
export function getSupplyIndex(elementName) {
    try {
        const supply = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLY_INDEX) || '{}');
        return supply[elementName] || 0;
    } catch (e) {
        return 0;
    }
}

/**
 * Get demand index for an element
 */
export function getDemandIndex(elementName) {
    try {
        const demand = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEMAND_INDEX) || '{}');
        return demand[elementName] || 0;
    } catch (e) {
        return 0;
    }
}

// ===== COMPREHENSIVE MARKET DATA CLEANUP =====

/**
 * Clean up all old market data to prevent storage issues
 */
export function cleanupOldMarketData() {
    console.log('🧹 Running market data cleanup...');
    let cleanupCount = 0;
    
    try {
        // 1. Clean PRICE HISTORY
        try {
            const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY) || '{}');
            if (typeof history === 'object' && history !== null) {
                const cutoffTime = Date.now() - (MARKET_CONFIG.MAX_HISTORY_AGE_DAYS * 24 * 60 * 60 * 1000);
                let changed = false;
                
                Object.keys(history).forEach(element => {
                    if (Array.isArray(history[element])) {
                        const originalLength = history[element].length;
                        
                        history[element] = history[element].filter(h => h.timestamp >= cutoffTime);
                        
                        if (history[element].length > MARKET_CONFIG.MAX_PRICE_HISTORY_PER_ELEMENT) {
                            history[element] = history[element].slice(-MARKET_CONFIG.MAX_PRICE_HISTORY_PER_ELEMENT);
                        }
                        
                        if (history[element].length !== originalLength) {
                            changed = true;
                            cleanupCount += (originalLength - history[element].length);
                        }
                        
                        if (history[element].length === 0) {
                            delete history[element];
                            changed = true;
                        }
                    }
                });
                
                if (changed) {
                    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(history));
                    console.log(`🧹 Price history: ${cleanupCount} old records removed`);
                }
            }
        } catch (e) {
            console.warn('Corrupted price history, removing...');
            localStorage.removeItem(STORAGE_KEYS.PRICE_HISTORY);
        }
        
        // 2. Clean SUPPLY/DEMAND indices
        [STORAGE_KEYS.SUPPLY_INDEX, STORAGE_KEYS.DEMAND_INDEX].forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                if (typeof data === 'object' && data !== null) {
                    let changed = false;
                    
                    Object.keys(data).forEach(element => {
                        data[element] = Math.floor(data[element] * 0.5); // 50% decay
                        if (data[element] < 1) {
                            delete data[element];
                            changed = true;
                        }
                    });
                    
                    const entries = Object.entries(data);
                    if (entries.length > MARKET_CONFIG.MAX_SUPPLY_DEMAND_ENTRIES) {
                        const sorted = entries.sort((a, b) => b[1] - a[1]);
                        const limited = Object.fromEntries(sorted.slice(0, MARKET_CONFIG.MAX_SUPPLY_DEMAND_ENTRIES));
                        localStorage.setItem(key, JSON.stringify(limited));
                        changed = true;
                    } else if (changed) {
                        localStorage.setItem(key, JSON.stringify(data));
                    }
                }
            } catch (e) {
                localStorage.removeItem(key);
            }
        });
        
        // 3. Clean VOLUME data
        try {
            const volume = JSON.parse(localStorage.getItem(STORAGE_KEYS.MARKET_VOLUME) || '{}');
            const cutoffDate = Date.now() - (MARKET_CONFIG.MAX_VOLUME_HISTORY_DAYS * 24 * 60 * 60 * 1000);
            let changed = false;
            
            Object.keys(volume).forEach(element => {
                if (volume[element] && typeof volume[element] === 'object') {
                    Object.keys(volume[element]).forEach(date => {
                        if (new Date(date).getTime() < cutoffDate) {
                            delete volume[element][date];
                            changed = true;
                        }
                    });
                    
                    if (Object.keys(volume[element]).length === 0) {
                        delete volume[element];
                        changed = true;
                    }
                }
            });
            
            if (changed) {
                localStorage.setItem(STORAGE_KEYS.MARKET_VOLUME, JSON.stringify(volume));
            }
        } catch (e) {
            localStorage.removeItem(STORAGE_KEYS.MARKET_VOLUME);
        }
        
        console.log('✅ Market data cleanup complete');
        
    } catch (error) {
        console.error('Error during market data cleanup:', error);
    }
}

// ===== MARKET LISTINGS =====

/**
 * Get all elements available for trading
 */
export function getAvailableElements(rarity = null) {
    const elements = [];
    const prices = getCurrentPrices();
    
    // Use ELEMENTS array from elements-data.js
    ELEMENTS.forEach(element => {
        const name = element.name;
        const priceData = prices[name] || {
            current: element.value || 100,
            base: element.value || 100,
            bid: Math.floor((element.value || 100) * 0.99),
            ask: Math.ceil((element.value || 100) * 1.01)
        };
        
        // Filter by rarity if specified
        if (rarity && element.rarity !== rarity) return;
        
        elements.push({
            name: name,
            symbol: element.symbol,
            icon: element.icon || getElementIcon(name),
            rarity: element.rarity,
            basePrice: element.value || 100,
            currentPrice: Math.round(priceData.current),
            bidPrice: priceData.bid,
            askPrice: priceData.ask,
            priceMultiplier: priceData.current / (element.value || 100),
            volume24h: priceData.volume24h || 0,
            priceChange24h: priceData.priceChange24h || 0,
            priceChangePercent: priceData.priceChangePercent || 0,
            mass: element.mass || 100
        });
    });
    
    return elements;
}

/**
 * Get element icon (fallback)
 */
function getElementIcon(elementName) {
    const icons = {
        'Gold': '🟡',
        'Silver': '⚪',
        'Platinum': '⬜',
        'Uranium': '🟣',
        'Promethium': '✨',
        'Carbon': '⚫',
        'Iron': '⚙️',
        'Titanium': '🔷',
        'Hydrogen': '💧',
        'Helium': '🎈',
        'Oxygen': '💨',
        'Silicon': '💎',
        'Copper': '🔴',
        'Lead': '🔘',
        'Mercury': '💧',
        'Neptunium': '☢️',
        'Plutonium': '☢️'
    };
    return icons[elementName] || '🔹';
}

/**
 * Get elements by rarity with prices
 */
export function getElementsByRarity(rarity) {
    return getAvailableElements(rarity);
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
    const history = getPriceHistory(elementName, 3);
    if (history.length < 3) {
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
        reason = 'Price near 3-day low';
    } else if (position > 0.8) {
        recommendation = 'wait';
        confidence = Math.round(position * 100);
        reason = 'Price near 3-day high';
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

// ===== PRICE ALERTS =====

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

// ===== HELPER FUNCTIONS =====

export function canAffordBuy(elementName, quantity, credits) {
    return credits >= (getAskPrice(elementName) * quantity);
}

export function hasEnoughToSell(elementName, quantity, amount) {
    return amount >= quantity;
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
    getElementsByRarity,
    canAffordBuy,
    hasEnoughToSell,
    setPriceAlert,
    checkPriceAlerts,
    getMarketSummary,
    getMostActiveElements,
    getBuyRecommendation,
    cleanupOldMarketData
};

// Initialize on load
initializeMarket();

// Attach to window for global access
window.MARKET_CONFIG = MARKET_CONFIG;
window.getCurrentPrices = getCurrentPrices;
window.getBidPrice = getBidPrice;
window.getAskPrice = getAskPrice;
window.getAvailableElements = getAvailableElements;
window.cleanupOldMarketData = cleanupOldMarketData;
window.recordTrade = recordTrade;
window.getSupplyIndex = getSupplyIndex;
window.getDemandIndex = getDemandIndex;

console.log('✅ market-dynamics.js loaded - Optimized market system ready with elements-data.js (UPDATES EVERY MINUTE)');

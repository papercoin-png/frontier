// js/economic-metrics.js - Core economic tracking for Voidfarer
// Now using IndexedDB via db.js for unlimited storage
// Tracks money supply, inflation, wealth distribution, and economic health
// UPDATED: Now aggregates real data from player collections and transactions instead of using simulations

import { 
    getItem as storageGetItem,
    setItem as storageSetItem,
    getAll as storageGetAll,
    getPlayer,
    getCollection
} from './storage.js';

import { 
    getDb,
    getAll as dbGetAll,
    setItem as dbSetItem,
    getItem as dbGetItem
} from './db.js';

import { getElementValue } from './elements-data.js';

// ===== STORAGE KEYS =====
const METRICS_KEYS = {
    TOTAL_MONEY_SUPPLY: 'voidfarer_total_money_supply',
    DAILY_METRICS: 'voidfarer_daily_metrics',
    HOURLY_SNAPSHOTS: 'voidfarer_hourly_snapshots',
    WEALTH_SNAPSHOT: 'voidfarer_wealth_snapshot',
    PLAYER_COUNT: 'voidfarer_player_count',
    LAST_METRIC_UPDATE: 'voidfarer_last_metric_update'
};

// ===== TARGET RANGES =====
export const TARGET_RANGES = {
    INFLATION: { min: 0.02, max: 0.05, ideal: 0.035 }, // 2-5%, ideal 3.5%
    GINI: { min: 0.3, max: 0.4, ideal: 0.35 }, // Gini coefficient
    POOL_EFFICIENCY: { min: 0.8, max: 1.2, ideal: 1.0 }, // 80-120%
    NEW_PLAYER_GROWTH: { min: 0.05, max: 0.15, ideal: 0.10 }, // 5-15% monthly
    MONEY_VELOCITY: { min: 0.5, max: 2.0, ideal: 1.0 }, // How fast money moves
    WEALTH_CONCENTRATION: { min: 0.3, max: 0.5, ideal: 0.4 } // Top 10% share
};

// ===== CACHE for performance =====
let cachedMoneySupply = null;
let cachedPlayerCount = null;
let cachedWealthDistribution = null;
let lastWealthCalculation = 0;
const WEALTH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ===== INITIALIZE METRICS =====
export async function initializeMetrics() {
    // Calculate initial money supply from real data
    const realMoneySupply = await calculateRealMoneySupply();
    localStorage.setItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY, realMoneySupply.toString());
    
    // Initialize daily metrics in IndexedDB
    const metrics = await getDailyMetrics();
    if (metrics.length === 0) {
        // Create initial metrics entry
        await recordDailyMetrics();
    }
    
    // Initialize hourly snapshots in IndexedDB
    const snapshots = await getHourlySnapshots();
    if (snapshots.length === 0) {
        await recordHourlySnapshot();
    }
    
    // Set initial player count
    await updatePlayerCount();
    
    console.log('Economic metrics initialized with real data aggregation');
}

// ===== REAL MONEY SUPPLY CALCULATION =====
/**
 * Calculate total money supply by aggregating:
 * - All player credits
 * - All player element collections (valued at market prices)
 * - Community fund balance
 */
async function calculateRealMoneySupply() {
    let totalMoney = 0;
    
    try {
        // Get all players from IndexedDB
        const db = await getDb();
        if (db && db.objectStoreNames.contains('player')) {
            const players = await dbGetAll('player');
            
            for (const player of players) {
                // Add player credits
                totalMoney += player.credits || 0;
                
                // Add value of player's element collection
                const collection = await getCollection(player.id);
                if (collection && typeof collection === 'object') {
                    for (const [elementName, data] of Object.entries(collection)) {
                        const count = typeof data === 'object' ? (data.count || 1) : data;
                        const elementValue = getElementValue(elementName);
                        totalMoney += count * elementValue;
                    }
                }
            }
        }
        
        // Add community fund balance
        const fund = await storageGetItem('communityFund', 'main');
        if (fund && fund.balance) {
            totalMoney += fund.balance;
        }
        
    } catch (error) {
        console.error('Error calculating real money supply:', error);
        // Fallback to stored value
        return parseInt(localStorage.getItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY)) || 5000000;
    }
    
    return Math.max(1000, totalMoney); // Minimum 1000
}

// ===== MONEY SUPPLY TRACKING =====
export function getTotalMoneySupply() {
    // Return cached value if recent
    if (cachedMoneySupply !== null) {
        return cachedMoneySupply;
    }
    return parseInt(localStorage.getItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY)) || 5000000;
}

export async function refreshMoneySupply() {
    const realSupply = await calculateRealMoneySupply();
    localStorage.setItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY, realSupply.toString());
    cachedMoneySupply = realSupply;
    return realSupply;
}

export async function addMoneyToSupply(amount) {
    const current = await refreshMoneySupply();
    const newTotal = current + amount;
    localStorage.setItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY, newTotal.toString());
    cachedMoneySupply = newTotal;
    return newTotal;
}

export async function removeMoneyFromSupply(amount) {
    const current = await refreshMoneySupply();
    const newTotal = Math.max(0, current - amount);
    localStorage.setItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY, newTotal.toString());
    cachedMoneySupply = newTotal;
    return newTotal;
}

// ===== REAL PLAYER COUNT =====
export async function updatePlayerCount() {
    try {
        const db = await getDb();
        let count = 0;
        
        if (db && db.objectStoreNames.contains('player')) {
            const players = await dbGetAll('player');
            count = players.length;
        } else {
            // Fallback: check if current player exists
            const player = await getPlayer();
            count = player ? 1 : 0;
        }
        
        localStorage.setItem(METRICS_KEYS.PLAYER_COUNT, count.toString());
        cachedPlayerCount = count;
        return count;
    } catch (error) {
        console.error('Error updating player count:', error);
        return 1;
    }
}

export function getPlayerCount() {
    if (cachedPlayerCount !== null) {
        return cachedPlayerCount;
    }
    return parseInt(localStorage.getItem(METRICS_KEYS.PLAYER_COUNT)) || 1;
}

// ===== REAL WEALTH DISTRIBUTION =====
/**
 * Get all players with their total wealth
 */
async function getAllPlayerWealth() {
    const wealthList = [];
    
    try {
        const db = await getDb();
        if (!db || !db.objectStoreNames.contains('player')) {
            // Fallback to current player only
            const player = await getPlayer();
            if (player) {
                let playerWealth = player.credits || 0;
                const collection = await getCollection(player.id);
                if (collection) {
                    for (const [name, data] of Object.entries(collection)) {
                        const count = typeof data === 'object' ? (data.count || 1) : data;
                        playerWealth += count * getElementValue(name);
                    }
                }
                wealthList.push({ id: player.id, name: player.name, wealth: playerWealth });
            }
            return wealthList;
        }
        
        const players = await dbGetAll('player');
        
        for (const player of players) {
            let playerWealth = player.credits || 0;
            
            // Add collection value
            const collection = await getCollection(player.id);
            if (collection && typeof collection === 'object') {
                for (const [elementName, data] of Object.entries(collection)) {
                    const count = typeof data === 'object' ? (data.count || 1) : data;
                    const elementValue = getElementValue(elementName);
                    playerWealth += count * elementValue;
                }
            }
            
            wealthList.push({
                id: player.id,
                name: player.name || 'Unknown',
                wealth: playerWealth
            });
        }
        
        // Sort by wealth descending
        wealthList.sort((a, b) => b.wealth - a.wealth);
        
    } catch (error) {
        console.error('Error calculating player wealth:', error);
    }
    
    return wealthList;
}

export async function calculateWealthDistribution() {
    // Check cache
    const now = Date.now();
    if (cachedWealthDistribution && (now - lastWealthCalculation) < WEALTH_CACHE_DURATION) {
        return cachedWealthDistribution;
    }
    
    const wealthData = await getAllPlayerWealth();
    const totalWealth = wealthData.reduce((sum, p) => sum + p.wealth, 0);
    
    cachedWealthDistribution = wealthData.map(p => p.wealth);
    lastWealthCalculation = now;
    
    return cachedWealthDistribution;
}

export async function calculateGiniCoefficient() {
    const wealthData = await calculateWealthDistribution();
    const n = wealthData.length;
    
    if (n === 0) return 0.35; // Default if no data
    
    // Sort wealth in ascending order
    const sorted = [...wealthData].sort((a, b) => a - b);
    
    // Calculate Gini using formula: (2 * sum(i * wealth_i)) / (n * sum(wealth)) - (n+1)/n
    let sumWealth = 0;
    let weightedSum = 0;
    
    for (let i = 0; i < n; i++) {
        sumWealth += sorted[i];
        weightedSum += (i + 1) * sorted[i];
    }
    
    if (sumWealth === 0) return 0;
    
    const gini = (2 * weightedSum) / (n * sumWealth) - (n + 1) / n;
    return Math.min(1, Math.max(0, gini));
}

export async function getWealthPercentiles() {
    const wealthData = await calculateWealthDistribution();
    const totalWealth = wealthData.reduce((a, b) => a + b, 0);
    const n = wealthData.length;
    
    if (n === 0 || totalWealth === 0) {
        return {
            top1Percent: 0,
            top10Percent: 0,
            bottom50Percent: 0,
            totalWealth: 0,
            playerCount: 0
        };
    }
    
    // Sort descending
    const sortedDesc = [...wealthData].sort((a, b) => b - a);
    
    const top1Count = Math.max(1, Math.floor(n * 0.01));
    const top10Count = Math.max(1, Math.floor(n * 0.1));
    const bottom50Count = Math.max(1, Math.floor(n * 0.5));
    
    const top1Wealth = sortedDesc.slice(0, top1Count).reduce((a, b) => a + b, 0);
    const top10Wealth = sortedDesc.slice(0, top10Count).reduce((a, b) => a + b, 0);
    const bottom50Wealth = sortedDesc.slice(-bottom50Count).reduce((a, b) => a + b, 0);
    
    return {
        top1Percent: (top1Wealth / totalWealth) * 100,
        top10Percent: (top10Wealth / totalWealth) * 100,
        bottom50Percent: (bottom50Wealth / totalWealth) * 100,
        totalWealth: totalWealth,
        playerCount: n
    };
}

// ===== REAL TRANSACTION VOLUME =====
async function getRealTransactionVolume(days = 30) {
    try {
        const db = await getDb();
        if (!db || !db.objectStoreNames.contains('tradeHistory')) {
            return 50000; // Default
        }
        
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        const trades = await dbGetAll('tradeHistory');
        
        const recentTrades = trades.filter(t => t.timestamp > cutoff);
        const totalVolume = recentTrades.reduce((sum, t) => sum + (t.quantity * t.price), 0);
        
        return totalVolume / days; // Average daily volume
    } catch (error) {
        console.error('Error getting transaction volume:', error);
        return 50000;
    }
}

// ===== INFLATION CALCULATION =====
export async function calculateInflationRate() {
    const metrics = await getDailyMetrics();
    
    if (metrics.length < 2) return 0.03; // Default 3%
    
    // Compare money supply from 30 days ago to now
    const now = metrics[metrics.length - 1];
    const thirtyDaysAgo = metrics[Math.max(0, metrics.length - 30)];
    
    if (!thirtyDaysAgo) return 0.03;
    
    const moneySupplyNow = now.moneySupply;
    const moneySupplyThen = thirtyDaysAgo.moneySupply;
    
    if (moneySupplyThen === 0) return 0.03;
    
    const annualizedRate = Math.pow(moneySupplyNow / moneySupplyThen, 365 / 30) - 1;
    return Math.max(0, Math.min(annualizedRate, 0.2)); // Cap at 20%
}

// ===== MONEY VELOCITY =====
export async function calculateMoneyVelocity() {
    // Money velocity = Transaction Volume / Money Supply
    const transactionVolume = await getRealTransactionVolume(7);
    const moneySupply = getTotalMoneySupply();
    
    if (moneySupply === 0) return 0.5;
    
    return Math.min(3.0, transactionVolume / moneySupply);
}

// ===== DAILY METRICS (IndexedDB using db.js) =====
export async function getDailyMetrics() {
    try {
        const metrics = await dbGetAll('dailyMetrics');
        // Sort by date ascending
        return (metrics || []).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    } catch (error) {
        console.error('Error getting daily metrics:', error);
        return [];
    }
}

export async function saveDailyMetrics(metrics) {
    try {
        for (const metric of metrics) {
            await dbSetItem('dailyMetrics', metric);
        }
        return true;
    } catch (error) {
        console.error('Error saving daily metrics:', error);
        return false;
    }
}

export async function recordDailyMetrics() {
    const metrics = await getDailyMetrics();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already recorded today
    if (metrics.length > 0 && metrics[metrics.length - 1].date === today) {
        return metrics[metrics.length - 1];
    }
    
    // Refresh money supply to get current value
    const moneySupply = await refreshMoneySupply();
    const playerCount = await updatePlayerCount();
    const wealthPercentiles = await getWealthPercentiles();
    const gini = await calculateGiniCoefficient();
    const transactionVolume = await getRealTransactionVolume(1);
    
    const dailyMetric = {
        date: today,
        moneySupply: moneySupply,
        playerCount: playerCount,
        inflation: await calculateInflationRate(),
        gini: gini,
        wealthTop1: wealthPercentiles.top1Percent,
        wealthTop10: wealthPercentiles.top10Percent,
        wealthBottom50: wealthPercentiles.bottom50Percent,
        moneyVelocity: await calculateMoneyVelocity(),
        transactionVolume: transactionVolume,
        timestamp: Date.now()
    };
    
    metrics.push(dailyMetric);
    
    // Keep only last 365 days
    while (metrics.length > 365) {
        metrics.shift();
    }
    
    await saveDailyMetrics(metrics);
    localStorage.setItem(METRICS_KEYS.LAST_METRIC_UPDATE, Date.now().toString());
    
    return dailyMetric;
}

// ===== HOURLY SNAPSHOTS (IndexedDB using db.js) =====
export async function getHourlySnapshots() {
    try {
        const snapshots = await dbGetAll('hourlySnapshots');
        return (snapshots || []).sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
        console.error('Error getting hourly snapshots:', error);
        return [];
    }
}

export async function saveHourlySnapshots(snapshots) {
    try {
        for (const snapshot of snapshots) {
            await dbSetItem('hourlySnapshots', snapshot);
        }
        return true;
    } catch (error) {
        console.error('Error saving hourly snapshots:', error);
        return false;
    }
}

export async function recordHourlySnapshot() {
    const snapshots = await getHourlySnapshots();
    const now = Date.now();
    const hour = new Date().toISOString().split('T')[1].split(':')[0];
    const hourString = `${new Date().toISOString().split('T')[0]}-${hour}`;
    
    // Check if we already recorded this hour
    if (snapshots.length > 0 && snapshots[snapshots.length - 1].hour === hourString) {
        return snapshots[snapshots.length - 1];
    }
    
    const transactionVolume = await getRealTransactionVolume(1);
    
    const snapshot = {
        timestamp: now,
        hour: hourString,
        moneySupply: getTotalMoneySupply(),
        playerCount: getPlayerCount(),
        recentTransactions: transactionVolume / 24 // Average per hour
    };
    
    snapshots.push(snapshot);
    
    // Keep only last 24 hours
    while (snapshots.length > 24) {
        snapshots.shift();
    }
    
    await saveHourlySnapshots(snapshots);
    return snapshot;
}

// ===== ECONOMIC HEALTH ASSESSMENT =====
export async function assessEconomicHealth() {
    const inflation = await calculateInflationRate();
    const gini = await calculateGiniCoefficient();
    const velocity = await calculateMoneyVelocity();
    const wealth = await getWealthPercentiles();
    
    const health = {
        inflation: {
            value: inflation,
            status: getStatus(inflation, TARGET_RANGES.INFLATION),
            message: getInflationMessage(inflation)
        },
        inequality: {
            value: gini,
            status: getStatus(gini, TARGET_RANGES.GINI),
            message: getInequalityMessage(gini)
        },
        wealthConcentration: {
            value: wealth.top10Percent / 100,
            status: getStatus(wealth.top10Percent / 100, TARGET_RANGES.WEALTH_CONCENTRATION),
            message: getConcentrationMessage(wealth.top10Percent)
        },
        velocity: {
            value: velocity,
            status: getStatus(velocity, TARGET_RANGES.MONEY_VELOCITY),
            message: getVelocityMessage(velocity)
        },
        overall: 'STABLE'
    };
    
    // Determine overall health
    const statuses = [health.inflation.status, health.inequality.status, health.velocity.status];
    if (statuses.includes('HIGH') || statuses.includes('CRITICAL')) {
        health.overall = 'CRITICAL';
    } else if (statuses.includes('WARNING_HIGH') || statuses.includes('WARNING_LOW')) {
        health.overall = 'WARNING';
    } else {
        health.overall = 'HEALTHY';
    }
    
    return health;
}

function getStatus(value, range) {
    if (value < range.min * 0.5) return 'CRITICAL';
    if (value < range.min) return 'WARNING_LOW';
    if (value > range.max * 1.5) return 'CRITICAL';
    if (value > range.max) return 'WARNING_HIGH';
    if (value >= range.min && value <= range.max) return 'OPTIMAL';
    return 'NORMAL';
}

function getInflationMessage(inflation) {
    if (inflation < 0.01) return 'Economy cooling - possible deflation risk';
    if (inflation < 0.02) return 'Low inflation - stable but could use stimulation';
    if (inflation <= 0.05) return 'Healthy inflation - economy growing steadily';
    if (inflation <= 0.08) return 'Elevated inflation - watch for overheating';
    if (inflation <= 0.12) return 'High inflation - corrective measures recommended';
    return 'Hyperinflation - economic emergency!';
}

function getInequalityMessage(gini) {
    if (gini < 0.25) return 'Very equal distribution - socialist paradise';
    if (gini < 0.3) return 'Healthy equality - wealth well distributed';
    if (gini <= 0.4) return 'Normal inequality - typical market economy';
    if (gini <= 0.5) return 'High inequality - wealth concentrated';
    if (gini <= 0.6) return 'Severe inequality - oligarchy forming';
    return 'Extreme inequality - feudalism emerging';
}

function getConcentrationMessage(percent) {
    if (percent < 30) return 'Wealth spread widely';
    if (percent < 40) return 'Healthy concentration';
    if (percent < 50) return 'Noticeable concentration';
    if (percent < 60) return 'High concentration';
    if (percent < 70) return 'Severe concentration';
    return 'Extreme concentration';
}

function getVelocityMessage(velocity) {
    if (velocity < 0.3) return 'Stagnant economy - money not moving';
    if (velocity < 0.6) return 'Slow economy - people saving';
    if (velocity <= 1.5) return 'Healthy velocity - money circulating';
    if (velocity <= 2.0) return 'Active economy - rapid trading';
    if (velocity <= 2.5) return 'Overheated - speculation risk';
    return 'Hyperactive - bubble forming';
}

// ===== HISTORICAL TRENDS =====
export async function getHistoricalTrend(days = 30) {
    const metrics = await getDailyMetrics();
    const recent = metrics.slice(-days);
    
    if (recent.length < 2) return null;
    
    const start = recent[0];
    const end = recent[recent.length - 1];
    
    return {
        moneySupplyChange: start.moneySupply ? ((end.moneySupply - start.moneySupply) / start.moneySupply) * 100 : 0,
        playerCountChange: start.playerCount ? ((end.playerCount - start.playerCount) / start.playerCount) * 100 : 0,
        inflationTrend: recent.map(m => m.inflation || 0),
        giniTrend: recent.map(m => m.gini || 0.35),
        averageInflation: recent.reduce((sum, m) => sum + (m.inflation || 0), 0) / recent.length,
        averageGini: recent.reduce((sum, m) => sum + (m.gini || 0.35), 0) / recent.length
    };
}

// ===== FORMATTING HELPERS =====
export function formatMoney(amount) {
    if (amount >= 1e9) return (amount / 1e9).toFixed(2) + 'B⭐';
    if (amount >= 1e6) return (amount / 1e6).toFixed(2) + 'M⭐';
    if (amount >= 1e3) return (amount / 1e3).toFixed(2) + 'K⭐';
    return Math.floor(amount) + '⭐';
}

export function formatPercent(value) {
    return (value * 100).toFixed(1) + '%';
}

// ===== EXPORT =====
export default {
    METRICS_KEYS,
    TARGET_RANGES,
    initializeMetrics,
    getTotalMoneySupply,
    refreshMoneySupply,
    addMoneyToSupply,
    removeMoneyFromSupply,
    getPlayerCount,
    updatePlayerCount,
    calculateGiniCoefficient,
    getWealthPercentiles,
    calculateInflationRate,
    calculateMoneyVelocity,
    getDailyMetrics,
    recordDailyMetrics,
    getHourlySnapshots,
    recordHourlySnapshot,
    assessEconomicHealth,
    getHistoricalTrend,
    formatMoney,
    formatPercent
};

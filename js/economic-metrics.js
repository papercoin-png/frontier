// js/economic-metrics.js - Core economic tracking for Voidfarer
// Now using IndexedDB via storage.js for unlimited storage
// Tracks money supply, inflation, wealth distribution, and economic health

import { 
    getItem,
    setItem,
    getAll,
    getAllFromIndex,
    getPlayer,
    getCollection
} from './storage.js';

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

// ===== INITIALIZE METRICS =====
export async function initializeMetrics() {
    // Set initial money supply if not exists (keep in localStorage for quick access)
    if (!localStorage.getItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY)) {
        localStorage.setItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY, '5000000'); // 5M starting credits
    }
    
    // Initialize daily metrics in IndexedDB
    const metrics = await getAll('dailyMetrics');
    if (metrics.length === 0) {
        // No metrics yet, that's fine
    }
    
    // Initialize hourly snapshots in IndexedDB
    const snapshots = await getAll('hourlySnapshots');
    if (snapshots.length === 0) {
        // No snapshots yet, that's fine
    }
    
    // Set initial player count
    await updatePlayerCount();
    
    console.log('Economic metrics initialized');
}

// ===== MONEY SUPPLY TRACKING (keep in localStorage for speed) =====
export function getTotalMoneySupply() {
    return parseInt(localStorage.getItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY)) || 5000000;
}

export function addMoneyToSupply(amount) {
    const current = getTotalMoneySupply();
    const newTotal = current + amount;
    localStorage.setItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY, newTotal.toString());
    return newTotal;
}

export function removeMoneyFromSupply(amount) {
    const current = getTotalMoneySupply();
    const newTotal = Math.max(0, current - amount);
    localStorage.setItem(METRICS_KEYS.TOTAL_MONEY_SUPPLY, newTotal.toString());
    return newTotal;
}

// ===== PLAYER COUNT TRACKING =====
export async function updatePlayerCount() {
    // In a real implementation, this would count all players
    // For now, estimate based on player data
    const player = await getPlayer();
    const count = player ? 1 : 0;
    localStorage.setItem(METRICS_KEYS.PLAYER_COUNT, count.toString());
    return count;
}

export function getPlayerCount() {
    return parseInt(localStorage.getItem(METRICS_KEYS.PLAYER_COUNT)) || 1;
}

// ===== WEALTH DISTRIBUTION =====
export async function calculateWealthDistribution() {
    // This would gather all player wealth in real implementation
    // For now, return sample data based on current player
    const totalWealth = getTotalMoneySupply();
    const playerCount = getPlayerCount();
    
    // Get player's collection value
    const collection = await getCollection();
    let playerWealth = 0;
    for (const [name, data] of Object.entries(collection)) {
        const value = getElementValue(name);
        playerWealth += (data.count || 1) * value;
    }
    
    const player = await getPlayer();
    if (player && player.credits) {
        playerWealth += player.credits;
    }
    
    // Simulate realistic distribution (Pareto principle)
    const wealthData = [];
    let remainingWealth = totalWealth;
    
    for (let i = 0; i < playerCount; i++) {
        // Top 20% own 80% of wealth
        if (i < playerCount * 0.2) {
            const wealth = remainingWealth * 0.8 / (playerCount * 0.2);
            wealthData.push(wealth);
        } else {
            const wealth = remainingWealth * 0.2 / (playerCount * 0.8);
            wealthData.push(wealth);
        }
    }
    
    // Insert player at appropriate position (simplified)
    if (playerCount === 1) {
        return [playerWealth];
    }
    
    return wealthData.sort((a, b) => b - a);
}

export async function calculateGiniCoefficient() {
    const wealthData = await calculateWealthDistribution();
    const n = wealthData.length;
    
    if (n === 0) return 0;
    
    // Sort wealth in ascending order
    const sorted = [...wealthData].sort((a, b) => a - b);
    
    // Calculate Gini using formula: (2 * sum(i * wealth_i)) / (n * sum(wealth)) - (n+1)/n
    let sumWealth = 0;
    let weightedSum = 0;
    
    for (let i = 0; i < n; i++) {
        sumWealth += sorted[i];
        weightedSum += (i + 1) * sorted[i];
    }
    
    const gini = (2 * weightedSum) / (n * sumWealth) - (n + 1) / n;
    return Math.min(1, Math.max(0, gini));
}

export async function getWealthPercentiles() {
    const wealthData = await calculateWealthDistribution();
    const totalWealth = wealthData.reduce((a, b) => a + b, 0);
    const n = wealthData.length;
    
    const top1Count = Math.max(1, Math.floor(n * 0.01));
    const top10Count = Math.max(1, Math.floor(n * 0.1));
    const bottom50Count = Math.max(1, Math.floor(n * 0.5));
    
    const top1Wealth = wealthData.slice(0, top1Count).reduce((a, b) => a + b, 0);
    const top10Wealth = wealthData.slice(0, top10Count).reduce((a, b) => a + b, 0);
    const bottom50Wealth = wealthData.slice(-bottom50Count).reduce((a, b) => a + b, 0);
    
    return {
        top1Percent: (top1Wealth / totalWealth) * 100,
        top10Percent: (top10Wealth / totalWealth) * 100,
        bottom50Percent: (bottom50Wealth / totalWealth) * 100,
        totalWealth: totalWealth,
        playerCount: n
    };
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
    
    const annualizedRate = Math.pow(moneySupplyNow / moneySupplyThen, 365 / 30) - 1;
    return Math.max(0, Math.min(annualizedRate, 0.2)); // Cap at 20%
}

// ===== MONEY VELOCITY =====
export async function calculateMoneyVelocity() {
    // Money velocity = GDP / Money Supply
    // GDP approximated by total transactions
    const metrics = await getDailyMetrics();
    if (metrics.length < 7) return 1.0;
    
    const recentMetrics = metrics.slice(-7);
    const avgDailyTransactions = recentMetrics.reduce((sum, m) => sum + (m.transactionVolume || 0), 0) / 7;
    const moneySupply = getTotalMoneySupply();
    
    return moneySupply > 0 ? avgDailyTransactions / moneySupply : 0.5;
}

// ===== DAILY METRICS (IndexedDB) =====
export async function getDailyMetrics() {
    return await getAll('dailyMetrics');
}

export async function saveDailyMetrics(metrics) {
    // Clear and rebuild (simpler than diffing)
    const db = await getDb();
    const tx = db.transaction('dailyMetrics', 'readwrite');
    await tx.objectStore('dailyMetrics').clear();
    
    for (const metric of metrics) {
        await tx.objectStore('dailyMetrics').put(metric);
    }
    await tx.done;
}

export async function recordDailyMetrics() {
    const metrics = await getDailyMetrics();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already recorded today
    if (metrics.length > 0 && metrics[metrics.length - 1].date === today) {
        return metrics[metrics.length - 1];
    }
    
    const wealthPercentiles = await getWealthPercentiles();
    const gini = await calculateGiniCoefficient();
    
    const dailyMetric = {
        date: today,
        moneySupply: getTotalMoneySupply(),
        playerCount: getPlayerCount(),
        inflation: await calculateInflationRate(),
        gini: gini,
        wealthTop1: wealthPercentiles.top1Percent,
        wealthTop10: wealthPercentiles.top10Percent,
        wealthBottom50: wealthPercentiles.bottom50Percent,
        moneyVelocity: await calculateMoneyVelocity(),
        transactionVolume: estimateTransactionVolume(),
        timestamp: Date.now()
    };
    
    metrics.push(dailyMetric);
    
    // Keep only last 365 days
    if (metrics.length > 365) {
        metrics.shift();
    }
    
    await saveDailyMetrics(metrics);
    localStorage.setItem(METRICS_KEYS.LAST_METRIC_UPDATE, Date.now().toString());
    
    return dailyMetric;
}

// ===== HOURLY SNAPSHOTS (IndexedDB) =====
export async function getHourlySnapshots() {
    return await getAll('hourlySnapshots');
}

export async function saveHourlySnapshots(snapshots) {
    const db = await getDb();
    const tx = db.transaction('hourlySnapshots', 'readwrite');
    await tx.objectStore('hourlySnapshots').clear();
    
    for (const snapshot of snapshots) {
        await tx.objectStore('hourlySnapshots').put(snapshot);
    }
    await tx.done;
}

export async function recordHourlySnapshot() {
    const snapshots = await getHourlySnapshots();
    const now = Date.now();
    const hour = new Date().toISOString().split('T')[1].split(':')[0];
    
    const snapshot = {
        timestamp: now,
        hour: hour,
        moneySupply: getTotalMoneySupply(),
        playerCount: getPlayerCount(),
        recentTransactions: estimateRecentTransactions()
    };
    
    snapshots.push(snapshot);
    
    // Keep only last 24 hours
    if (snapshots.length > 24) {
        snapshots.shift();
    }
    
    await saveHourlySnapshots(snapshots);
}

// ===== ESTIMATION HELPERS (would be replaced with real data) =====
export function estimateTransactionVolume() {
    // Placeholder - would track actual transactions in real implementation
    return Math.floor(Math.random() * 100000) + 50000;
}

export function estimateRecentTransactions() {
    // Placeholder - would track actual transactions
    return Math.floor(Math.random() * 5000) + 1000;
}

// ===== ELEMENT VALUE HELPER =====
function getElementValue(elementName) {
    const elements = {
        // Common - 100
        'Hydrogen': 100, 'Helium': 100, 'Lithium': 100, 'Beryllium': 100,
        'Boron': 100, 'Sodium': 100, 'Magnesium': 100, 'Aluminum': 100,
        'Silicon': 100, 'Potassium': 100, 'Calcium': 100,
        
        // Uncommon - 250
        'Carbon': 250, 'Oxygen': 250, 'Nitrogen': 250, 'Iron': 250,
        'Nickel': 250, 'Sulfur': 250, 'Phosphorus': 250, 'Chlorine': 250,
        'Argon': 250, 'Lead': 250,
        
        // Rare - 1000
        'Gold': 1000, 'Silver': 1000, 'Platinum': 1000, 'Copper': 1000,
        'Titanium': 1000, 'Zinc': 1000, 'Tin': 1000, 'Mercury': 1000,
        'Cobalt': 1000, 'Chromium': 1000,
        
        // Very Rare - 5000
        'Uranium': 5000, 'Thorium': 5000, 'Plutonium': 5000,
        'Radium': 5000, 'Polonium': 5000,
        
        // Legendary - 25000
        'Promethium': 25000, 'Technetium': 25000, 'Astatine': 25000, 'Francium': 25000
    };
    
    return elements[elementName] || 100;
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
    if (statuses.includes('CRITICAL')) {
        health.overall = 'CRITICAL';
    } else if (statuses.includes('WARNING')) {
        health.overall = 'WARNING';
    } else {
        health.overall = 'HEALTHY';
    }
    
    return health;
}

function getStatus(value, range) {
    if (value < range.min * 0.8) return 'LOW';
    if (value < range.min) return 'WARNING_LOW';
    if (value > range.max * 1.2) return 'HIGH';
    if (value > range.max) return 'WARNING_HIGH';
    if (value >= range.min && value <= range.max) return 'OPTIMAL';
    return 'UNKNOWN';
}

function getInflationMessage(inflation) {
    if (inflation < 0.01) return 'Economy cooling - possible deflation risk';
    if (inflation < 0.02) return 'Low inflation - stable but could use stimulation';
    if (inflation <= 0.05) return 'Healthy inflation - economy growing steadily';
    if (inflation <= 0.08) return 'Elevated inflation - watch for overheating';
    return 'High inflation - corrective measures recommended';
}

function getInequalityMessage(gini) {
    if (gini < 0.25) return 'Very equal distribution - socialist paradise';
    if (gini < 0.3) return 'Healthy equality - wealth well distributed';
    if (gini <= 0.4) return 'Normal inequality - typical market economy';
    if (gini <= 0.5) return 'High inequality - wealth concentrated';
    return 'Extreme inequality - oligarchy forming';
}

function getConcentrationMessage(percent) {
    if (percent < 30) return 'Wealth spread widely';
    if (percent < 40) return 'Healthy concentration';
    if (percent < 50) return 'Noticeable concentration';
    if (percent < 60) return 'High concentration';
    return 'Extreme concentration';
}

function getVelocityMessage(velocity) {
    if (velocity < 0.3) return 'Stagnant economy - money not moving';
    if (velocity < 0.6) return 'Slow economy - people saving';
    if (velocity <= 1.5) return 'Healthy velocity - money circulating';
    if (velocity <= 2.0) return 'Active economy - rapid trading';
    return 'Hyperactive - possible speculation';
}

// ===== HISTORICAL TRENDS =====
export async function getHistoricalTrend(days = 30) {
    const metrics = await getDailyMetrics();
    const recent = metrics.slice(-days);
    
    if (recent.length < 2) return null;
    
    const start = recent[0];
    const end = recent[recent.length - 1];
    
    return {
        moneySupplyChange: ((end.moneySupply - start.moneySupply) / start.moneySupply) * 100,
        playerCountChange: ((end.playerCount - start.playerCount) / start.playerCount) * 100,
        inflationTrend: recent.map(m => m.inflation),
        giniTrend: recent.map(m => m.gini),
        averageInflation: recent.reduce((sum, m) => sum + m.inflation, 0) / recent.length,
        averageGini: recent.reduce((sum, m) => sum + m.gini, 0) / recent.length
    };
}

// ===== FORMATTING HELPERS =====
export function formatMoney(amount) {
    if (amount >= 1e9) return (amount / 1e9).toFixed(2) + 'B⭐';
    if (amount >= 1e6) return (amount / 1e6).toFixed(2) + 'M⭐';
    if (amount >= 1e3) return (amount / 1e3).toFixed(2) + 'K⭐';
    return amount + '⭐';
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

// Need to import getDb for some functions
import { getDb } from './db.js';

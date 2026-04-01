// js/labor-pool.js
// Labor Pool system for Voidfarer University
// Manages daily distribution of FUEL based on certificate shares
// Players earn a share of the fixed daily pool based on their certificate levels
// Total daily pool is fixed to ensure the 250,000 FUEL lasts 10 years

import { getItem, setItem, getAll, addTransaction } from './storage.js';
import { getCertificates, getTotalLaborShare, formatShare } from './certificates.js';

// ===== CONSTANTS =====
const STORAGE_KEYS = {
    LABOR_POOL: 'voidfarer_labor_pool',
    LABOR_EARNINGS: 'voidfarer_labor_earnings',
    DISTRIBUTION_HISTORY: 'voidfarer_distribution_history',
    LAST_DISTRIBUTION: 'voidfarer_last_distribution',
    POOL_CONTRIBUTIONS: 'voidfarer_pool_contributions'
};

// Distribution schedule (daily at 00:00 UTC)
const DISTRIBUTION_HOUR = 0;
const DISTRIBUTION_MINUTE = 0;

// FIXED DAILY POOL - Ensures 250,000 FUEL lasts exactly 10 years
// 250,000 FUEL ÷ (10 years × 365 days) = 68.49 FUEL/day
const FIXED_DAILY_POOL = 68.49;  // 68.49 FUEL distributed daily total
const MAX_DAILY_PER_PLAYER = 70;  // Hard cap per player (ensures no one exceeds)

// ===== INITIALIZATION =====
/**
 * Initialize labor pool system
 * @returns {Promise<boolean>} Success status
 */
export async function initializeLaborPool() {
    try {
        // Check if labor pool exists
        let pool = await getItem('laborPool', 'main');
        if (!pool) {
            pool = {
                id: 'main',
                balance: FIXED_DAILY_POOL,  // Start with daily pool amount
                totalDistributed: 0,
                totalContributions: 0,
                lastDistribution: null,
                activeWorkers: 0,
                distributionCount: 0,
                created: Date.now()
            };
            await setItem('laborPool', pool);
        }
        
        // Initialize earnings storage
        let earnings = await getItem('laborEarnings', 'main');
        if (!earnings) {
            earnings = {
                id: 'main',
                earnings: {}, // playerId -> amount
                totalClaimed: 0,
                lastUpdated: Date.now()
            };
            await setItem('laborEarnings', earnings);
        }
        
        // Initialize distribution history
        let history = await getItem('distributionHistory', 'main');
        if (!history) {
            history = {
                id: 'main',
                distributions: [],
                lastUpdated: Date.now()
            };
            await setItem('distributionHistory', history);
        }
        
        // Initialize contributions
        let contributions = await getItem('poolContributions', 'main');
        if (!contributions) {
            contributions = {
                id: 'main',
                contributions: [],
                total: 0,
                lastUpdated: Date.now()
            };
            await setItem('poolContributions', contributions);
        }
        
        console.log('Labor pool initialized with fixed daily pool:', FIXED_DAILY_POOL, 'FUEL');
        return true;
        
    } catch (error) {
        console.error('Error initializing labor pool:', error);
        return false;
    }
}

// ===== POOL ACCESSORS =====
/**
 * Get current labor pool
 * @returns {Promise<Object>} Labor pool object
 */
export async function getLaborPool() {
    try {
        const pool = await getItem('laborPool', 'main');
        if (!pool) {
            await initializeLaborPool();
            return await getItem('laborPool', 'main');
        }
        return pool;
    } catch (error) {
        console.error('Error getting labor pool:', error);
        return null;
    }
}

/**
 * Save labor pool
 * @param {Object} pool - Labor pool object
 * @returns {Promise<boolean>} Success status
 */
async function saveLaborPool(pool) {
    try {
        await setItem('laborPool', pool);
        return true;
    } catch (error) {
        console.error('Error saving labor pool:', error);
        return false;
    }
}

// ===== ADD TO LABOR POOL =====
/**
 * Add funds to the labor pool (for future distributions)
 * @param {number} amount - Amount to add
 * @param {string} source - Source of funds (e.g., 'ship_purchase', 'fuel', 'repairs')
 * @param {string} description - Optional description
 * @returns {Promise<Object>} Result object
 */
export async function addToLaborPool(amount, source, description = '') {
    if (amount <= 0) {
        return { success: false, reason: 'Amount must be positive' };
    }
    
    try {
        const pool = await getLaborPool();
        if (!pool) return { success: false, reason: 'Pool not initialized' };
        
        // Update pool balance (adds to future daily distributions)
        pool.balance += amount;
        pool.totalContributions += amount;
        
        await saveLaborPool(pool);
        
        // Record contribution
        const contribution = {
            id: 'contrib_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            amount,
            source,
            description,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            newBalance: pool.balance
        };
        
        const contributions = await getItem('poolContributions', 'main');
        if (contributions) {
            contributions.contributions.unshift(contribution);
            contributions.total += amount;
            contributions.lastUpdated = Date.now();
            
            // Keep only last 1000 contributions
            if (contributions.contributions.length > 1000) {
                contributions.contributions = contributions.contributions.slice(0, 1000);
            }
            
            await setItem('poolContributions', contributions);
        }
        
        return {
            success: true,
            contribution,
            newBalance: pool.balance
        };
        
    } catch (error) {
        console.error('Error adding to labor pool:', error);
        return { success: false, error: error.message };
    }
}

// ===== GET TOTAL LABOR SHARE FOR ALL PLAYERS =====
/**
 * Get total labor share across all players
 * @returns {Promise<number>} Total shares
 */
export async function getTotalPlayerShares() {
    try {
        const lastDistribution = await getLastDistribution();
        return lastDistribution?.totalShares || 0;
    } catch (error) {
        console.error('Error getting total player shares:', error);
        return 0;
    }
}

// ===== DISTRIBUTION =====
/**
 * Calculate each player's share of the fixed daily pool
 * @param {Map} playerShares - Map of playerId -> total shares
 * @returns {Map} Map of playerId -> earnings
 */
function calculateDistribution(playerShares) {
    const earnings = new Map();
    const totalShares = Array.from(playerShares.values()).reduce((sum, s) => sum + s, 0);
    
    if (totalShares === 0) return earnings;
    
    for (const [playerId, shares] of playerShares) {
        // Calculate player's share of the FIXED daily pool
        let playerDailyEarnings = FIXED_DAILY_POOL * (shares / totalShares);
        
        // Apply hard cap per player (ensures no one exceeds 70 FUEL/day)
        if (playerDailyEarnings > MAX_DAILY_PER_PLAYER) {
            playerDailyEarnings = MAX_DAILY_PER_PLAYER;
        }
        
        // Ensure at least a tiny amount for active players (0.001 FUEL minimum)
        if (playerDailyEarnings < 0.001 && shares > 0) {
            playerDailyEarnings = 0.001;
        }
        
        earnings.set(playerId, playerDailyEarnings);
    }
    
    return earnings;
}

/**
 * Get all players with certificate progress
 * @returns {Promise<Map>} Map of playerId -> total shares
 */
async function getAllActivePlayerShares() {
    const playerShares = new Map();
    
    try {
        // Get all players from certificates storage by checking all possible player IDs
        // We need to scan localStorage for player IDs
        const playerIds = new Set();
        
        // Check localStorage for player IDs
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('voidfarer_player_')) {
                const playerId = key.replace('voidfarer_player_', '');
                if (playerId && playerId !== 'undefined') {
                    playerIds.add(playerId);
                }
            }
        }
        
        // Also check certificates store in IndexedDB
        if (window.idb) {
            try {
                const db = await window.idb.openDB('VoidfarerDB');
                if (db && db.objectStoreNames.contains('certificates')) {
                    const allCertificates = await db.getAll('certificates');
                    for (const cert of allCertificates) {
                        if (cert.id && cert.id !== 'undefined') {
                            playerIds.add(cert.id);
                        }
                    }
                }
            } catch (e) {
                console.error('Error reading certificates from IndexedDB:', e);
            }
        }
        
        // Load certificates for each player
        for (const playerId of playerIds) {
            try {
                const certificates = await getCertificates(playerId);
                const shares = getTotalLaborShare(certificates);
                if (shares > 0) {
                    playerShares.set(playerId, shares);
                }
            } catch (e) {
                console.error(`Error loading certificates for ${playerId}:`, e);
            }
        }
        
    } catch (error) {
        console.error('Error getting active players:', error);
    }
    
    return playerShares;
}

/**
 * Perform daily distribution using FIXED daily pool
 * @returns {Promise<Object>} Distribution result
 */
export async function distributeLaborPool() {
    try {
        const pool = await getLaborPool();
        if (!pool) return { success: false, reason: 'Pool not initialized' };
        
        // Check if already distributed today
        const lastDist = await getLastDistribution();
        const today = new Date().toDateString();
        if (lastDist && new Date(lastDist.timestamp).toDateString() === today) {
            return { success: false, reason: 'Already distributed today' };
        }
        
        // Get all active players and their certificate shares
        const playerShares = await getAllActivePlayerShares();
        
        if (playerShares.size === 0) {
            return { success: false, reason: 'No active players with certificates' };
        }
        
        // Calculate distribution using FIXED daily pool
        const totalShares = Array.from(playerShares.values()).reduce((sum, s) => sum + s, 0);
        const distribution = calculateDistribution(playerShares);
        
        if (distribution.size === 0) {
            return { success: false, reason: 'No players eligible for distribution' };
        }
        
        // Calculate total distributed (should equal FIXED_DAILY_POOL)
        let distributedTotal = 0;
        for (const amount of distribution.values()) {
            distributedTotal += amount;
        }
        
        // Update earnings storage
        const earnings = await getItem('laborEarnings', 'main');
        if (!earnings) return { success: false, reason: 'Earnings storage missing' };
        
        for (const [playerId, amount] of distribution) {
            earnings.earnings[playerId] = (earnings.earnings[playerId] || 0) + amount;
        }
        
        earnings.lastUpdated = Date.now();
        await setItem('laborEarnings', earnings);
        
        // Update pool stats (no balance change since we use fixed pool)
        pool.totalDistributed += distributedTotal;
        pool.lastDistribution = Date.now();
        pool.distributionCount++;
        pool.activeWorkers = distribution.size;
        
        await saveLaborPool(pool);
        
        // Record distribution
        const distributionRecord = {
            id: 'dist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            timestamp: Date.now(),
            date: new Date().toISOString(),
            totalDistributed: distributedTotal,
            fixedDailyPool: FIXED_DAILY_POOL,
            totalShares,
            playerCount: distribution.size,
            recipients: Array.from(distribution.entries()).map(([id, amount]) => ({
                playerId: id,
                amount
            }))
        };
        
        const history = await getItem('distributionHistory', 'main');
        if (history) {
            history.distributions.unshift(distributionRecord);
            history.lastUpdated = Date.now();
            
            // Keep last 100 distributions
            if (history.distributions.length > 100) {
                history.distributions = history.distributions.slice(0, 100);
            }
            
            await setItem('distributionHistory', history);
        }
        
        console.log(`✅ Daily distribution complete: ${distributedTotal.toFixed(4)} FUEL distributed to ${distribution.size} players`);
        
        return {
            success: true,
            distribution: distributionRecord,
            recipients: distribution.size,
            totalDistributed: distributedTotal,
            fixedPool: FIXED_DAILY_POOL
        };
        
    } catch (error) {
        console.error('Error distributing labor pool:', error);
        return { success: false, error: error.message };
    }
}

// ===== PLAYER EARNINGS =====
/**
 * Get player's unclaimed labor earnings (in FUEL)
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Unclaimed earnings
 */
export async function getPlayerEarnings(playerId) {
    try {
        const earnings = await getItem('laborEarnings', 'main');
        if (!earnings) return 0;
        return earnings.earnings[playerId] || 0;
    } catch (error) {
        console.error('Error getting player earnings:', error);
        return 0;
    }
}

/**
 * Claim player's labor earnings (converted to credits)
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Result with claimed amount
 */
export async function claimLaborEarnings(playerId) {
    try {
        const earnings = await getItem('laborEarnings', 'main');
        if (!earnings) return { success: false, amount: 0, reason: 'No earnings found' };
        
        const amount = earnings.earnings[playerId] || 0;
        if (amount <= 0) {
            return { success: false, amount: 0, reason: 'No earnings to claim' };
        }
        
        // Convert FUEL to credits (1 FUEL = 100 credits)
        const creditsAmount = Math.floor(amount * 100);
        
        // Add to player credits
        if (typeof window.addCredits === 'function') {
            await window.addCredits(creditsAmount, playerId);
        } else {
            // Fallback to localStorage
            const currentCredits = parseInt(localStorage.getItem('voidfarer_credits') || '5000');
            localStorage.setItem('voidfarer_credits', (currentCredits + creditsAmount).toString());
        }
        
        // Clear earnings
        delete earnings.earnings[playerId];
        earnings.totalClaimed = (earnings.totalClaimed || 0) + amount;
        earnings.lastUpdated = Date.now();
        
        await setItem('laborEarnings', earnings);
        
        return {
            success: true,
            amount: amount,
            creditsAmount: creditsAmount,
            message: `Claimed ${amount.toFixed(4)} FUEL (${creditsAmount.toLocaleString()}⭐) from labor pool!`
        };
        
    } catch (error) {
        console.error('Error claiming labor earnings:', error);
        return { success: false, amount: 0, error: error.message };
    }
}

// ===== DISTRIBUTION HISTORY =====
/**
 * Get distribution history
 * @param {number} limit - Maximum number of records
 * @returns {Promise<Array>} Distribution history
 */
export async function getDistributionHistory(limit = 20) {
    try {
        const history = await getItem('distributionHistory', 'main');
        if (!history) return [];
        return history.distributions.slice(0, limit);
    } catch (error) {
        console.error('Error getting distribution history:', error);
        return [];
    }
}

/**
 * Get last distribution record
 * @returns {Promise<Object|null>} Last distribution or null
 */
export async function getLastDistribution() {
    try {
        const history = await getItem('distributionHistory', 'main');
        if (!history || history.distributions.length === 0) return null;
        return history.distributions[0];
    } catch (error) {
        console.error('Error getting last distribution:', error);
        return null;
    }
}

// ===== POOL CONTRIBUTIONS =====
/**
 * Get contribution history
 * @param {number} limit - Maximum number of records
 * @returns {Promise<Array>} Contribution history
 */
export async function getContributionHistory(limit = 50) {
    try {
        const contributions = await getItem('poolContributions', 'main');
        if (!contributions) return [];
        return contributions.contributions.slice(0, limit);
    } catch (error) {
        console.error('Error getting contribution history:', error);
        return [];
    }
}

/**
 * Get total contributions
 * @returns {Promise<number>} Total contributions
 */
export async function getTotalContributions() {
    try {
        const contributions = await getItem('poolContributions', 'main');
        if (!contributions) return 0;
        return contributions.total;
    } catch (error) {
        console.error('Error getting total contributions:', error);
        return 0;
    }
}

// ===== POOL STATISTICS =====
/**
 * Get labor pool statistics
 * @returns {Promise<Object>} Statistics object
 */
export async function getLaborPoolStats() {
    try {
        const pool = await getLaborPool();
        const earnings = await getItem('laborEarnings', 'main');
        const history = await getItem('distributionHistory', 'main');
        
        if (!pool) return null;
        
        // Calculate average distribution
        let avgDistribution = 0;
        if (history && history.distributions.length > 0) {
            const sum = history.distributions.reduce((s, d) => s + d.totalDistributed, 0);
            avgDistribution = sum / history.distributions.length;
        }
        
        // Count active players (those with unclaimed earnings)
        const activePlayers = earnings ? Object.keys(earnings.earnings || {}).length : 0;
        
        return {
            fixedDailyPool: FIXED_DAILY_POOL,
            maxPerPlayer: MAX_DAILY_PER_PLAYER,
            balance: pool.balance,
            totalDistributed: pool.totalDistributed,
            totalContributions: pool.totalContributions,
            distributionCount: pool.distributionCount,
            lastDistribution: pool.lastDistribution,
            activeWorkers: pool.activeWorkers || 0,
            activePlayersWithEarnings: activePlayers,
            averageDistribution: avgDistribution,
            lastUpdated: pool.lastUpdated
        };
        
    } catch (error) {
        console.error('Error getting labor pool stats:', error);
        return null;
    }
}

// ===== UTILITY FUNCTIONS =====
/**
 * Check if distribution is due
 * @returns {Promise<boolean>} True if distribution should run
 */
export async function isDistributionDue() {
    const lastDist = await getLastDistribution();
    if (!lastDist) return true;
    
    const lastDate = new Date(lastDist.timestamp);
    const now = new Date();
    
    // Check if it's a new day
    return lastDate.toDateString() !== now.toDateString();
}

/**
 * Format earnings for display
 * @param {number} amount - Earnings amount (in FUEL)
 * @returns {string} Formatted string
 */
export function formatEarnings(amount) {
    if (amount >= 1000) return (amount / 1000).toFixed(2) + 'K FUEL';
    return amount.toFixed(4) + ' FUEL';
}

// ===== EXPORT =====
export default {
    FIXED_DAILY_POOL,
    MAX_DAILY_PER_PLAYER,
    initializeLaborPool,
    getLaborPool,
    addToLaborPool,
    getPlayerEarnings,
    claimLaborEarnings,
    distributeLaborPool,
    getDistributionHistory,
    getLastDistribution,
    getContributionHistory,
    getTotalContributions,
    getLaborPoolStats,
    isDistributionDue,
    formatEarnings
};

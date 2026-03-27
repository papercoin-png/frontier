// js/labor-pool.js
// Labor Pool system for Voidfarer University
// Manages daily distribution of labor earnings based on certificate shares
// Players earn a share of the pool based on their certificate levels

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
                balance: 0,
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
        
        console.log('Labor pool initialized');
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
 * Add funds to the labor pool
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
        
        // Update pool
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
        // Get all players from certificates storage
        // Since we don't have a players list, we need to calculate from earnings
        const earnings = await getItem('laborEarnings', 'main');
        if (!earnings) return 0;
        
        // This would ideally query all players' certificates
        // For now, we'll track total shares in distribution
        const lastDistribution = await getLastDistribution();
        return lastDistribution?.totalShares || 0;
        
    } catch (error) {
        console.error('Error getting total player shares:', error);
        return 0;
    }
}

// ===== DISTRIBUTION =====
/**
 * Calculate each player's share of the labor pool
 * @param {Object} pool - Labor pool object
 * @param {Map} playerShares - Map of playerId -> total shares
 * @returns {Map} Map of playerId -> earnings
 */
function calculateDistribution(pool, playerShares) {
    const earnings = new Map();
    const totalShares = Array.from(playerShares.values()).reduce((sum, s) => sum + s, 0);
    
    if (totalShares === 0 || pool.balance === 0) return earnings;
    
    for (const [playerId, shares] of playerShares) {
        const playerEarnings = Math.floor(pool.balance * (shares / totalShares));
        if (playerEarnings > 0) {
            earnings.set(playerId, playerEarnings);
        }
    }
    
    return earnings;
}

/**
 * Get all players with certificate progress
 * @returns {Promise<Map>} Map of playerId -> total shares
 */
async function getAllPlayerShares() {
    // This is a challenge without a central player registry
    // For now, we'll track shares during distribution
    // In production, you'd want a players collection in IndexedDB
    
    const playerShares = new Map();
    
    // Get all players from certificates storage keys
    // Since we can't query all keys easily, we'll rely on the distribution history
    // to know which players have been active
    
    const earnings = await getItem('laborEarnings', 'main');
    if (earnings && earnings.earnings) {
        // We have previous earners, we need to recalculate their current shares
        // This requires loading each player's certificates
        // For performance, we might want to store shares with earnings
    }
    
    return playerShares;
}

/**
 * Perform daily distribution
 * @returns {Promise<Object>} Distribution result
 */
export async function distributeLaborPool() {
    try {
        const pool = await getLaborPool();
        if (!pool) return { success: false, reason: 'Pool not initialized' };
        
        if (pool.balance <= 0) {
            return { success: false, reason: 'No funds to distribute' };
        }
        
        // Check if already distributed today
        const lastDist = await getLastDistribution();
        const today = new Date().toDateString();
        if (lastDist && new Date(lastDist.timestamp).toDateString() === today) {
            return { success: false, reason: 'Already distributed today' };
        }
        
        // Get all players and their shares
        // This requires iterating through all players' certificates
        // For now, we'll use the players who have earnings records
        
        const playerShares = new Map();
        
        // Get players from earnings storage
        const earningsStore = await getItem('laborEarnings', 'main');
        if (earningsStore && earningsStore.earnings) {
            // For each player with earnings, we need to load their certificates
            // This is inefficient but works for now
            for (const playerId of Object.keys(earningsStore.earnings)) {
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
        }
        
        if (playerShares.size === 0) {
            return { success: false, reason: 'No active players with certificates' };
        }
        
        // Calculate distribution
        const totalShares = Array.from(playerShares.values()).reduce((sum, s) => sum + s, 0);
        const distribution = calculateDistribution(pool, playerShares);
        
        if (distribution.size === 0) {
            return { success: false, reason: 'No players eligible for distribution' };
        }
        
        // Update earnings
        const earnings = await getItem('laborEarnings', 'main');
        if (!earnings) return { success: false, reason: 'Earnings storage missing' };
        
        let distributedTotal = 0;
        for (const [playerId, amount] of distribution) {
            earnings.earnings[playerId] = (earnings.earnings[playerId] || 0) + amount;
            distributedTotal += amount;
        }
        
        earnings.lastUpdated = Date.now();
        await setItem('laborEarnings', earnings);
        
        // Update pool
        const distributedAmount = pool.balance;
        pool.balance = 0;
        pool.totalDistributed += distributedAmount;
        pool.lastDistribution = Date.now();
        pool.distributionCount++;
        pool.activeWorkers = distribution.size;
        
        await saveLaborPool(pool);
        
        // Record distribution
        const distributionRecord = {
            id: 'dist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            timestamp: Date.now(),
            date: new Date().toISOString(),
            totalDistributed: distributedAmount,
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
        
        return {
            success: true,
            distribution: distributionRecord,
            recipients: distribution.size,
            totalDistributed: distributedAmount
        };
        
    } catch (error) {
        console.error('Error distributing labor pool:', error);
        return { success: false, error: error.message };
    }
}

// ===== PLAYER EARNINGS =====
/**
 * Get player's unclaimed labor earnings
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
 * Claim player's labor earnings
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
        
        // Add to player credits
        if (typeof window.addCredits === 'function') {
            await window.addCredits(amount, playerId);
        } else {
            // Fallback to localStorage
            const currentCredits = parseInt(localStorage.getItem('voidfarer_credits') || '5000');
            localStorage.setItem('voidfarer_credits', (currentCredits + amount).toString());
        }
        
        // Clear earnings
        delete earnings.earnings[playerId];
        earnings.totalClaimed = (earnings.totalClaimed || 0) + amount;
        earnings.lastUpdated = Date.now();
        
        await setItem('laborEarnings', earnings);
        
        return {
            success: true,
            amount,
            message: `Claimed ${amount.toLocaleString()}⭐ from labor pool!`
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
 * @param {number} amount - Earnings amount
 * @returns {string} Formatted string
 */
export function formatEarnings(amount) {
    if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M⭐';
    if (amount >= 1000) return (amount / 1000).toFixed(1) + 'K⭐';
    return amount.toLocaleString() + '⭐';
}

// ===== EXPORT =====
export default {
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

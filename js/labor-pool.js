// js/labor-pool.js - Simplified Labor Pool Distribution System
// Distributes labor credits to certificate holders based on mastery levels
// No dependencies on alchemy.js - uses certificate-based system only

// ===== CONFIGURATION =====
const LABOR_POOL_CONFIG = {
    DISTRIBUTION_INTERVAL: 3600000, // 1 hour in milliseconds
    MINIMUM_DISTRIBUTION: 100,       // Minimum credits to trigger distribution
    MAX_HISTORY_ENTRIES: 100,        // Keep last 100 history entries
    LABOR_SHARE_MULTIPLIER: 1.0      // Base multiplier for labor shares
};

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    LABOR_POOL_TOTAL: 'voidfarer_labor_pool_total',
    LABOR_POOL_DISTRIBUTED: 'voidfarer_labor_pool_distributed',
    LABOR_POOL_HISTORY: 'voidfarer_labor_pool_history',
    PLAYER_LABOR_EARNINGS: 'voidfarer_player_labor_earnings',
    CERTIFICATE_HOLDERS: 'voidfarer_certificate_holders',
    LAST_DISTRIBUTION: 'voidfarer_last_distribution',
    PENDING_DISTRIBUTIONS: 'voidfarer_pending_distributions'
};

// ===== CERTIFICATE REQUIREMENTS MAPPING =====
// Maps item IDs to the certificate required to earn labor from them
const CERTIFICATE_REQUIREMENTS = {
    // Ships
    'prospector': 'excavator',
    'courier': 'trader',
    'surveyor': 'analyst',
    'tug': 'engineer',
    'pathfinder': 'pioneer',
    
    // Equipment (for future use)
    'mining_laser_basic': 'prospector',
    'mining_laser_mk2': 'geologist',
    'ore_scanner': 'geologist',
    'cargo_hold_1': 'merchant',
    'cargo_hold_2': 'trader',
    'trade_license_basic': 'merchant',
    'trade_license_advanced': 'broker'
};

// ===== INITIALIZATION =====
function initializeStorage() {
    const keys = [
        STORAGE_KEYS.LABOR_POOL_TOTAL,
        STORAGE_KEYS.LABOR_POOL_DISTRIBUTED,
        STORAGE_KEYS.LABOR_POOL_HISTORY,
        STORAGE_KEYS.PLAYER_LABOR_EARNINGS,
        STORAGE_KEYS.CERTIFICATE_HOLDERS,
        STORAGE_KEYS.LAST_DISTRIBUTION,
        STORAGE_KEYS.PENDING_DISTRIBUTIONS
    ];
    
    keys.forEach(key => {
        if (!localStorage.getItem(key)) {
            if (key === STORAGE_KEYS.LABOR_POOL_HISTORY || 
                key === STORAGE_KEYS.PLAYER_LABOR_EARNINGS ||
                key === STORAGE_KEYS.CERTIFICATE_HOLDERS ||
                key === STORAGE_KEYS.PENDING_DISTRIBUTIONS) {
                localStorage.setItem(key, '{}');
            } else {
                localStorage.setItem(key, '0');
            }
        }
    });
}

// Call initialization immediately
initializeStorage();

// ===== CORE FUNCTIONS =====

/**
 * Add labor credits to the pool from a ship build
 * @param {string} itemId - ID of the item built (e.g., 'prospector')
 * @param {number} laborCost - Labor cost paid by builder
 * @returns {Object} Result of adding to pool
 */
window.addLaborFromBuild = function(itemId, laborCost) {
    try {
        // Get required certificate for this item
        const requiredCert = CERTIFICATE_REQUIREMENTS[itemId];
        
        if (!requiredCert) {
            console.warn(`No certificate requirement defined for item: ${itemId}`);
            // Still add to general pool? For now, we'll add but mark as uncategorized
        }
        
        // Get current pool total
        const currentTotal = parseInt(localStorage.getItem(STORAGE_KEYS.LABOR_POOL_TOTAL) || '0');
        const newTotal = currentTotal + laborCost;
        localStorage.setItem(STORAGE_KEYS.LABOR_POOL_TOTAL, newTotal.toString());
        
        // Record pending distribution for this certificate
        if (requiredCert) {
            recordPendingDistribution(laborCost, requiredCert);
        } else {
            // Add to general pool (distributed to all certificate holders proportionally)
            recordPendingDistribution(laborCost, 'general');
        }
        
        // Add to history
        addToHistory({
            type: 'addition',
            itemId: itemId,
            requiredCert: requiredCert || 'general',
            amount: laborCost,
            newTotal: newTotal,
            timestamp: Date.now(),
            date: new Date().toISOString()
        });
        
        // Check if we should auto-distribute
        checkAndDistribute();
        
        console.log(`✅ Added ${laborCost}⭐ to labor pool from ${itemId} build. New total: ${newTotal}⭐`);
        
        return {
            success: true,
            newTotal: newTotal,
            laborCost: laborCost
        };
        
    } catch (error) {
        console.error('Error adding labor from build:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Record a pending distribution for a specific certificate
 * @param {number} amount - Amount to distribute
 * @param {string} certificateId - Certificate ID
 */
function recordPendingDistribution(amount, certificateId) {
    try {
        const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_DISTRIBUTIONS) || '{}');
        
        if (!pending[certificateId]) {
            pending[certificateId] = 0;
        }
        
        pending[certificateId] += amount;
        localStorage.setItem(STORAGE_KEYS.PENDING_DISTRIBUTIONS, JSON.stringify(pending));
        
    } catch (error) {
        console.error('Error recording pending distribution:', error);
    }
}

/**
 * Get all certificate holders and their mastery levels
 * @param {string} certificateId - Optional specific certificate to filter
 * @returns {Array} Array of certificate holders
 */
window.getCertificateHolders = function(certificateId = null) {
    try {
        const holders = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTIFICATE_HOLDERS) || '{}');
        
        if (certificateId) {
            return holders[certificateId] || [];
        }
        
        // Return all holders grouped by certificate
        return holders;
        
    } catch (error) {
        console.error('Error getting certificate holders:', error);
        return certificateId ? [] : {};
    }
};

/**
 * Register or update a certificate holder's mastery
 * @param {string} playerId - Player ID
 * @param {string} playerName - Player name
 * @param {string} certificateId - Certificate ID
 * @param {number} masteryLevel - Mastery level (1-10)
 */
window.updateCertificateHolder = function(playerId, playerName, certificateId, masteryLevel) {
    try {
        const holders = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTIFICATE_HOLDERS) || '{}');
        
        if (!holders[certificateId]) {
            holders[certificateId] = [];
        }
        
        // Find existing entry for this player
        const existingIndex = holders[certificateId].findIndex(h => h.playerId === playerId);
        
        const holderData = {
            playerId: playerId,
            playerName: playerName,
            masteryLevel: masteryLevel,
            lastUpdated: Date.now()
        };
        
        if (existingIndex >= 0) {
            // Update existing
            holders[certificateId][existingIndex] = holderData;
        } else {
            // Add new
            holders[certificateId].push(holderData);
        }
        
        localStorage.setItem(STORAGE_KEYS.CERTIFICATE_HOLDERS, JSON.stringify(holders));
        
        return true;
        
    } catch (error) {
        console.error('Error updating certificate holder:', error);
        return false;
    }
};

/**
 * Calculate player's share of labor pool based on mastery
 * @param {Array} holders - Array of certificate holders
 * @param {number} totalPool - Total pool amount to distribute
 * @returns {Object} Distribution object
 */
function calculateDistribution(holders, totalPool) {
    if (!holders || holders.length === 0) {
        return {
            distribution: {},
            totalMastery: 0
        };
    }
    
    // Calculate total mastery sum
    const totalMastery = holders.reduce((sum, h) => sum + h.masteryLevel, 0);
    
    if (totalMastery === 0) {
        return {
            distribution: {},
            totalMastery: 0
        };
    }
    
    // Calculate shares
    const distribution = {};
    let distributed = 0;
    
    holders.forEach(holder => {
        const share = holder.masteryLevel / totalMastery;
        // Use floor to avoid rounding issues, remainder handled separately
        let amount = Math.floor(totalPool * share);
        
        // Ensure minimum 1 credit if they have any mastery
        if (amount === 0 && holder.masteryLevel > 0) {
            amount = 1;
        }
        
        distribution[holder.playerId] = {
            playerId: holder.playerId,
            playerName: holder.playerName,
            masteryLevel: holder.masteryLevel,
            share: share,
            amount: amount
        };
        
        distributed += amount;
    });
    
    // Handle remainder (due to flooring)
    const remainder = totalPool - distributed;
    if (remainder > 0 && holders.length > 0) {
        // Give remainder to highest mastery holder
        const highestMastery = holders.reduce((prev, current) => 
            (prev.masteryLevel > current.masteryLevel) ? prev : current
        );
        
        if (distribution[highestMastery.playerId]) {
            distribution[highestMastery.playerId].amount += remainder;
        }
    }
    
    return {
        distribution: distribution,
        totalMastery: totalMastery
    };
}

/**
 * Distribute labor pool for a specific certificate
 * @param {string} certificateId - Certificate ID to distribute for
 * @returns {Object} Distribution results
 */
window.distributeForCertificate = function(certificateId) {
    try {
        // Get pending amount for this certificate
        const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_DISTRIBUTIONS) || '{}');
        const amount = pending[certificateId] || 0;
        
        if (amount <= 0) {
            return {
                success: true,
                certificateId: certificateId,
                distributed: 0,
                message: 'No pending distribution'
            };
        }
        
        // Get holders for this certificate
        const holders = window.getCertificateHolders(certificateId);
        
        if (!holders || holders.length === 0) {
            // No holders - move to general pool or hold until someone earns it
            // For now, we'll keep it pending
            return {
                success: true,
                certificateId: certificateId,
                distributed: 0,
                message: 'No certificate holders',
                pending: amount
            };
        }
        
        // Calculate distribution
        const { distribution, totalMastery } = calculateDistribution(holders, amount);
        
        // Add earnings to players
        const earnings = {};
        let totalDistributed = 0;
        
        for (const [playerId, data] of Object.entries(distribution)) {
            if (data.amount > 0) {
                earnings[playerId] = data.amount;
                totalDistributed += data.amount;
            }
        }
        
        // Save earnings
        window.addPlayerEarnings(earnings);
        
        // Remove from pending
        delete pending[certificateId];
        localStorage.setItem(STORAGE_KEYS.PENDING_DISTRIBUTIONS, JSON.stringify(pending));
        
        // Update total distributed
        const totalDistributedAll = parseInt(localStorage.getItem(STORAGE_KEYS.LABOR_POOL_DISTRIBUTED) || '0');
        localStorage.setItem(STORAGE_KEYS.LABOR_POOL_DISTRIBUTED, (totalDistributedAll + totalDistributed).toString());
        
        // Add to history
        addToHistory({
            type: 'distribution',
            certificateId: certificateId,
            amount: totalDistributed,
            holders: holders.length,
            totalMastery: totalMastery,
            timestamp: Date.now(),
            date: new Date().toISOString()
        });
        
        return {
            success: true,
            certificateId: certificateId,
            distributed: totalDistributed,
            holders: holders.length,
            distribution: distribution
        };
        
    } catch (error) {
        console.error(`Error distributing for certificate ${certificateId}:`, error);
        return {
            success: false,
            certificateId: certificateId,
            error: error.message
        };
    }
};

/**
 * Distribute all pending labor pool amounts
 * @returns {Object} Results of distribution
 */
window.distributeAllLabor = function() {
    try {
        const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_DISTRIBUTIONS) || '{}');
        const certificates = Object.keys(pending);
        
        if (certificates.length === 0) {
            return {
                success: true,
                distributed: 0,
                message: 'No pending distributions'
            };
        }
        
        const results = {};
        let totalDistributed = 0;
        
        certificates.forEach(certId => {
            const result = window.distributeForCertificate(certId);
            results[certId] = result;
            if (result.success && result.distributed) {
                totalDistributed += result.distributed;
            }
        });
        
        // Update last distribution time
        localStorage.setItem(STORAGE_KEYS.LAST_DISTRIBUTION, Date.now().toString());
        
        return {
            success: true,
            totalDistributed: totalDistributed,
            certificates: certificates.length,
            results: results
        };
        
    } catch (error) {
        console.error('Error distributing all labor:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Check if distribution is needed and perform it
 */
function checkAndDistribute() {
    const lastDist = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_DISTRIBUTION) || '0');
    const now = Date.now();
    const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_DISTRIBUTIONS) || '{}');
    
    // Check if any pending amount exceeds minimum
    const hasEnoughPending = Object.values(pending).some(amount => amount >= LABOR_POOL_CONFIG.MINIMUM_DISTRIBUTION);
    
    // Distribute if:
    // 1. It's been more than the interval since last distribution, OR
    // 2. There's a pending amount that exceeds minimum
    if ((lastDist === 0 || (now - lastDist) >= LABOR_POOL_CONFIG.DISTRIBUTION_INTERVAL) && hasEnoughPending) {
        window.distributeAllLabor();
    }
}

/**
 * Add earnings to players
 * @param {Object} earnings - Object with player IDs as keys and amounts as values
 */
window.addPlayerEarnings = function(earnings) {
    try {
        const currentEarnings = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS) || '{}');
        
        for (const [playerId, amount] of Object.entries(earnings)) {
            if (!currentEarnings[playerId]) {
                currentEarnings[playerId] = 0;
            }
            currentEarnings[playerId] += amount;
        }
        
        localStorage.setItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS, JSON.stringify(currentEarnings));
        
        return true;
        
    } catch (error) {
        console.error('Error adding player earnings:', error);
        return false;
    }
};

/**
 * Get player's unclaimed earnings
 * @param {string} playerId - Player ID
 * @returns {number} Unclaimed earnings
 */
window.getPlayerEarnings = function(playerId) {
    try {
        const earnings = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS) || '{}');
        return earnings[playerId] || 0;
        
    } catch (error) {
        console.error('Error getting player earnings:', error);
        return 0;
    }
};

/**
 * Claim player's earnings
 * @param {string} playerId - Player ID
 * @returns {Object} Result with claimed amount
 */
window.claimEarnings = function(playerId) {
    try {
        const earnings = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS) || '{}');
        const amount = earnings[playerId] || 0;
        
        if (amount <= 0) {
            return {
                success: true,
                claimed: 0,
                message: 'No earnings to claim'
            };
        }
        
        // Remove from earnings
        delete earnings[playerId];
        localStorage.setItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS, JSON.stringify(earnings));
        
        // Add to player credits
        const currentCredits = parseInt(localStorage.getItem('voidfarer_credits') || '5000');
        localStorage.setItem('voidfarer_credits', (currentCredits + amount).toString());
        
        // Add to history
        addToHistory({
            type: 'claim',
            playerId: playerId,
            amount: amount,
            timestamp: Date.now(),
            date: new Date().toISOString()
        });
        
        return {
            success: true,
            claimed: amount
        };
        
    } catch (error) {
        console.error('Error claiming earnings:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Add entry to labor pool history
 * @param {Object} entry - History entry
 */
function addToHistory(entry) {
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.LABOR_POOL_HISTORY) || '[]');
        
        history.unshift({
            id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            ...entry
        });
        
        // Keep only last MAX_HISTORY_ENTRIES
        while (history.length > LABOR_POOL_CONFIG.MAX_HISTORY_ENTRIES) {
            history.pop();
        }
        
        localStorage.setItem(STORAGE_KEYS.LABOR_POOL_HISTORY, JSON.stringify(history));
        
    } catch (error) {
        console.error('Error adding to history:', error);
    }
}

/**
 * Get labor pool history
 * @param {number} limit - Max entries to return
 * @returns {Array} History entries
 */
window.getLaborHistory = function(limit = 20) {
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.LABOR_POOL_HISTORY) || '[]');
        return history.slice(0, limit);
        
    } catch (error) {
        console.error('Error getting labor history:', error);
        return [];
    }
};

/**
 * Get labor pool statistics
 * @returns {Object} Statistics
 */
window.getLaborStats = function() {
    try {
        const total = parseInt(localStorage.getItem(STORAGE_KEYS.LABOR_POOL_TOTAL) || '0');
        const distributed = parseInt(localStorage.getItem(STORAGE_KEYS.LABOR_POOL_DISTRIBUTED) || '0');
        const lastDist = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_DISTRIBUTION) || '0');
        const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_DISTRIBUTIONS) || '{}');
        
        // Calculate total pending
        const totalPending = Object.values(pending).reduce((sum, val) => sum + val, 0);
        
        // Get history for averages
        const history = window.getLaborHistory(100);
        const distributions = history.filter(h => h.type === 'distribution');
        
        const avgDistribution = distributions.length > 0
            ? distributions.reduce((sum, d) => sum + d.amount, 0) / distributions.length
            : 0;
        
        return {
            currentPool: total,
            totalDistributed: distributed,
            totalPending: totalPending,
            pendingByCertificate: pending,
            lastDistribution: lastDist || null,
            distributionCount: distributions.length,
            averageDistribution: Math.floor(avgDistribution),
            nextDistribution: lastDist ? lastDist + LABOR_POOL_CONFIG.DISTRIBUTION_INTERVAL : Date.now()
        };
        
    } catch (error) {
        console.error('Error getting labor stats:', error);
        return {
            currentPool: 0,
            totalDistributed: 0,
            totalPending: 0,
            pendingByCertificate: {},
            lastDistribution: null,
            distributionCount: 0,
            averageDistribution: 0,
            nextDistribution: Date.now()
        };
    }
};

/**
 * Get certificate requirements mapping
 * @returns {Object} Certificate requirements
 */
window.getCertificateRequirements = function() {
    return { ...CERTIFICATE_REQUIREMENTS };
};

// ===== EXPORT TO WINDOW (additional explicit exports) =====
window.LABOR_POOL_CONFIG = LABOR_POOL_CONFIG;
window.STORAGE_KEYS = STORAGE_KEYS;
window.CERTIFICATE_REQUIREMENTS = CERTIFICATE_REQUIREMENTS;

console.log('✅ labor-pool.js loaded - Certificate-based labor distribution ready');

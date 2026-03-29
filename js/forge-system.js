// js/forge-system.js
// Forge token system - Real-time accrual based on certificate level
// Players earn Forge passively while playing (and offline)
// Daily cap of 70 Forge, resets at midnight UTC
// Unclaimed Forge burns if not claimed within 24 hours

import { getItem, setItem } from './storage.js';
import { getCertificates, getTotalLaborShare } from './certificates.js';

// ===== CONSTANTS =====
const FORGE_CONFIG = {
    DAILY_CAP: 70,                    // Maximum Forge per day
    ACCRUAL_BASE_RATE: 0.0007,        // Base Forge per 10 seconds for share 100
    ACCRUAL_INTERVAL_MS: 10000,       // 10 seconds
    RESET_HOUR: 0,                    // Midnight UTC
    RESET_MINUTE: 0,
    CLAIM_EXPIRY_HOURS: 24            // Forge must be claimed within 24 hours
};

// Storage keys (using IndexedDB via storage.js)
const STORAGE_KEYS = {
    FORGE_DATA: 'forgeData',           // Main forge data store
    FORGE_BALANCE: 'forgeBalance'      // Player's Forge balance (spendable)
};

// ===== INITIALIZATION =====
/**
 * Initialize forge system for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Forge data object
 */
export async function initializeForge(playerId) {
    try {
        let forgeData = await getItem('forgeData', playerId);
        
        if (!forgeData) {
            forgeData = {
                playerId: playerId,
                currentForge: 0,           // Forge accrued today (resets daily)
                lastAccrualTimestamp: Date.now(),
                lastResetDate: null,
                pendingClaim: 0,            // Forge available to claim (from previous day)
                pendingClaimExpires: null,  // Timestamp when pending claim expires
                lastClaimDate: null,        // Date when last claimed
                totalForgeClaimed: 0,       // Lifetime Forge claimed
                totalForgeBurned: 0         // Lifetime Forge burned
            };
            await setItem('forgeData', forgeData, playerId);
        }
        
        // Check and perform daily reset
        await checkAndResetDaily(playerId);
        
        // Check for expired pending claims
        await checkAndBurnExpiredClaim(playerId);
        
        // Update accrual based on time passed
        await updateAccrual(playerId);
        
        return forgeData;
    } catch (error) {
        console.error('Error initializing forge:', error);
        return null;
    }
}

// ===== DAILY RESET =====
/**
 * Check if daily reset is needed and perform it
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} True if reset occurred
 */
export async function checkAndResetDaily(playerId) {
    try {
        const forgeData = await getItem('forgeData', playerId);
        if (!forgeData) return false;
        
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        // Check if we need to reset
        if (forgeData.lastResetDate !== today) {
            // Move current Forge to pending claim (if any)
            if (forgeData.currentForge > 0) {
                forgeData.pendingClaim = forgeData.currentForge;
                forgeData.pendingClaimExpires = Date.now() + (FORGE_CONFIG.CLAIM_EXPIRY_HOURS * 60 * 60 * 1000);
            }
            
            // Reset current Forge
            forgeData.currentForge = 0;
            forgeData.lastResetDate = today;
            forgeData.lastAccrualTimestamp = Date.now();
            
            await setItem('forgeData', forgeData, playerId);
            console.log(`🔄 Forge daily reset for ${playerId}: ${forgeData.pendingClaim} Forge moved to pending`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error checking daily reset:', error);
        return false;
    }
}

/**
 * Check and burn expired pending claim
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Amount burned (0 if none)
 */
export async function checkAndBurnExpiredClaim(playerId) {
    try {
        const forgeData = await getItem('forgeData', playerId);
        if (!forgeData) return 0;
        
        if (forgeData.pendingClaim > 0 && forgeData.pendingClaimExpires) {
            if (Date.now() > forgeData.pendingClaimExpires) {
                const burnedAmount = forgeData.pendingClaim;
                forgeData.totalForgeBurned += burnedAmount;
                forgeData.pendingClaim = 0;
                forgeData.pendingClaimExpires = null;
                
                await setItem('forgeData', forgeData, playerId);
                console.log(`🔥 ${burnedAmount} Forge burned for ${playerId} (expired)`);
                
                // Dispatch event for UI updates
                window.dispatchEvent(new CustomEvent('forge-burned', { 
                    detail: { playerId, amount: burnedAmount } 
                }));
                
                return burnedAmount;
            }
        }
        
        return 0;
    } catch (error) {
        console.error('Error checking expired claim:', error);
        return 0;
    }
}

// ===== ACCRUAL CALCULATION =====
/**
 * Calculate accrual rate based on certificate share
 * Rate = (Share / 100) × 0.0007 Forge per 10 seconds
 * @param {number} share - Total certificate share
 * @returns {number} Forge per 10 seconds
 */
export function calculateAccrualRate(share) {
    if (share <= 0) return 0;
    // Base rate 0.0007 per 10 seconds for share 100
    // Share 500 = 0.0035, Share 1000 = 0.007, Share 2000 = 0.014
    return (share / 100) * FORGE_CONFIG.ACCRUAL_BASE_RATE;
}

/**
 * Calculate Forge gained over a time period
 * @param {number} share - Certificate share
 * @param {number} milliseconds - Time elapsed in milliseconds
 * @returns {number} Forge gained
 */
export function calculateForgeGained(share, milliseconds) {
    const ratePerMs = calculateAccrualRate(share) / FORGE_CONFIG.ACCRUAL_INTERVAL_MS;
    let gained = ratePerMs * milliseconds;
    // Cap at reasonable precision (3 decimal places)
    return Math.floor(gained * 1000) / 1000;
}

/**
 * Update Forge accrual based on time passed since last update
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} New current Forge amount
 */
export async function updateAccrual(playerId) {
    try {
        const forgeData = await getItem('forgeData', playerId);
        if (!forgeData) return 0;
        
        const now = Date.now();
        const timeElapsed = now - (forgeData.lastAccrualTimestamp || now);
        
        if (timeElapsed <= 0) return forgeData.currentForge;
        
        // Get player's certificate share
        const certificates = await getCertificates(playerId);
        const share = getTotalLaborShare(certificates);
        
        // Calculate Forge gained
        let gained = calculateForgeGained(share, timeElapsed);
        
        if (gained > 0) {
            let newForge = forgeData.currentForge + gained;
            
            // Cap at daily maximum
            if (newForge > FORGE_CONFIG.DAILY_CAP) {
                newForge = FORGE_CONFIG.DAILY_CAP;
            }
            
            forgeData.currentForge = newForge;
        }
        
        forgeData.lastAccrualTimestamp = now;
        await setItem('forgeData', forgeData, playerId);
        
        return forgeData.currentForge;
    } catch (error) {
        console.error('Error updating accrual:', error);
        return 0;
    }
}

// ===== GETTERS =====
/**
 * Get current Forge data for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Forge data object
 */
export async function getForgeData(playerId) {
    try {
        let forgeData = await getItem('forgeData', playerId);
        if (!forgeData) {
            forgeData = await initializeForge(playerId);
        } else {
            // Check for reset and update accrual
            await checkAndResetDaily(playerId);
            await updateAccrual(playerId);
            forgeData = await getItem('forgeData', playerId);
        }
        return forgeData;
    } catch (error) {
        console.error('Error getting forge data:', error);
        return null;
    }
}

/**
 * Get current Forge amount (accrued today)
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Current Forge amount
 */
export async function getCurrentForge(playerId) {
    const forgeData = await getForgeData(playerId);
    return forgeData ? forgeData.currentForge : 0;
}

/**
 * Get pending Forge claim (from previous day)
 * @param {string} playerId - Player ID
 * @returns {Promise<{amount: number, expiresAt: number|null}>} Pending claim info
 */
export async function getPendingForgeClaim(playerId) {
    const forgeData = await getForgeData(playerId);
    if (!forgeData) return { amount: 0, expiresAt: null };
    
    // Check if expired
    if (forgeData.pendingClaim > 0 && forgeData.pendingClaimExpires) {
        if (Date.now() > forgeData.pendingClaimExpires) {
            await checkAndBurnExpiredClaim(playerId);
            return { amount: 0, expiresAt: null };
        }
        return { 
            amount: forgeData.pendingClaim, 
            expiresAt: forgeData.pendingClaimExpires 
        };
    }
    
    return { amount: 0, expiresAt: null };
}

/**
 * Get total Forge balance (spendable - claimed Forge)
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Forge balance
 */
export async function getForgeBalance(playerId) {
    try {
        const balance = await getItem('forgeBalance', playerId);
        return balance ? balance.amount : 0;
    } catch (error) {
        console.error('Error getting forge balance:', error);
        return 0;
    }
}

// ===== CLAIM AND BALANCE MANAGEMENT =====
/**
 * Claim pending Forge (add to spendable balance)
 * @param {string} playerId - Player ID
 * @returns {Promise<{success: boolean, amount: number, message: string}>} Result
 */
export async function claimForge(playerId) {
    try {
        const forgeData = await getForgeData(playerId);
        if (!forgeData) {
            return { success: false, amount: 0, message: 'Forge system not initialized' };
        }
        
        // Check for expired claim first
        await checkAndBurnExpiredClaim(playerId);
        
        // Refresh data after potential burn
        const refreshedData = await getItem('forgeData', playerId);
        if (!refreshedData || refreshedData.pendingClaim <= 0) {
            return { success: false, amount: 0, message: 'No Forge available to claim' };
        }
        
        const claimAmount = refreshedData.pendingClaim;
        
        // Get or create balance
        let balance = await getItem('forgeBalance', playerId);
        if (!balance) {
            balance = { playerId: playerId, amount: 0, totalClaimed: 0, lastClaimDate: null };
        }
        
        // Add to balance
        balance.amount += claimAmount;
        balance.totalClaimed = (balance.totalClaimed || 0) + claimAmount;
        balance.lastClaimDate = Date.now();
        
        // Clear pending claim
        refreshedData.pendingClaim = 0;
        refreshedData.pendingClaimExpires = null;
        refreshedData.lastClaimDate = Date.now();
        refreshedData.totalForgeClaimed = (refreshedData.totalForgeClaimed || 0) + claimAmount;
        
        await setItem('forgeBalance', balance, playerId);
        await setItem('forgeData', refreshedData, playerId);
        
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('forge-claimed', { 
            detail: { playerId, amount: claimAmount } 
        }));
        
        return { 
            success: true, 
            amount: claimAmount, 
            message: `Claimed ${claimAmount.toFixed(3)} Forge!` 
        };
        
    } catch (error) {
        console.error('Error claiming forge:', error);
        return { success: false, amount: 0, message: 'Failed to claim Forge' };
    }
}

/**
 * Add Forge tokens to player's spendable balance (for rewards/purchases)
 * @param {string} playerId - Player ID
 * @param {number} amount - Amount to add
 * @returns {Promise<boolean>} Success status
 */
export async function addForgeToBalance(playerId, amount) {
    try {
        if (amount <= 0) return false;
        
        let balance = await getItem('forgeBalance', playerId);
        if (!balance) {
            balance = { playerId: playerId, amount: 0, totalClaimed: 0, lastClaimDate: null };
        }
        
        balance.amount += amount;
        await setItem('forgeBalance', balance, playerId);
        
        window.dispatchEvent(new CustomEvent('forge-balance-updated', { 
            detail: { playerId, amount, newBalance: balance.amount } 
        }));
        
        return true;
    } catch (error) {
        console.error('Error adding forge to balance:', error);
        return false;
    }
}

/**
 * Spend Forge tokens
 * @param {string} playerId - Player ID
 * @param {number} amount - Amount to spend
 * @returns {Promise<boolean>} Success status
 */
export async function spendForge(playerId, amount) {
    try {
        if (amount <= 0) return false;
        
        const balance = await getItem('forgeBalance', playerId);
        if (!balance || balance.amount < amount) return false;
        
        balance.amount -= amount;
        await setItem('forgeBalance', balance, playerId);
        
        window.dispatchEvent(new CustomEvent('forge-spent', { 
            detail: { playerId, amount, newBalance: balance.amount } 
        }));
        
        return true;
    } catch (error) {
        console.error('Error spending forge:', error);
        return false;
    }
}

// ===== UI HELPER FUNCTIONS =====
/**
 * Get formatted time until next accrual increment
 * @returns {number} Seconds until next increment (0-10)
 */
export function getSecondsUntilNextIncrement() {
    const now = Date.now();
    const intervalMs = FORGE_CONFIG.ACCRUAL_INTERVAL_MS;
    const elapsed = now % intervalMs;
    const remaining = intervalMs - elapsed;
    return Math.ceil(remaining / 1000);
}

/**
 * Get time until daily reset
 * @returns {Object} Hours, minutes, seconds until reset
 */
export function getTimeUntilReset() {
    const now = new Date();
    const reset = new Date(now);
    reset.setUTCHours(FORGE_CONFIG.RESET_HOUR, FORGE_CONFIG.RESET_MINUTE, 0, 0);
    
    if (now >= reset) {
        reset.setUTCDate(reset.getUTCDate() + 1);
    }
    
    const diffMs = reset - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds, totalMs: diffMs };
}

/**
 * Get formatted time until pending claim expires
 * @param {number} expiresAt - Expiration timestamp
 * @returns {string} Formatted time string
 */
export function getTimeUntilExpiry(expiresAt) {
    if (!expiresAt) return 'Expired';
    
    const diffMs = expiresAt - Date.now();
    if (diffMs <= 0) return 'Expired';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

/**
 * Get accrual rate display string
 * @param {number} share - Certificate share
 * @returns {string} Formatted rate string
 */
export function getAccrualRateDisplay(share) {
    const rate = calculateAccrualRate(share);
    return `+${rate.toFixed(4)}/${FORGE_CONFIG.ACCRUAL_INTERVAL_MS / 1000}s`;
}

// ===== PERIODIC UPDATE FOR REAL-TIME DISPLAY =====
let globalUpdateInterval = null;
let globalUpdateCallbacks = [];

/**
 * Start global Forge update timer for real-time UI updates
 * @param {Function} callback - Function to call on each update
 */
export function startForgeUpdates(callback) {
    if (typeof callback === 'function') {
        globalUpdateCallbacks.push(callback);
    }
    
    if (!globalUpdateInterval) {
        globalUpdateInterval = setInterval(async () => {
            for (const cb of globalUpdateCallbacks) {
                try {
                    await cb();
                } catch (e) {
                    console.error('Forge update callback error:', e);
                }
            }
        }, FORGE_CONFIG.ACCRUAL_INTERVAL_MS);
    }
}

/**
 * Stop global Forge updates
 */
export function stopForgeUpdates() {
    if (globalUpdateInterval) {
        clearInterval(globalUpdateInterval);
        globalUpdateInterval = null;
    }
    globalUpdateCallbacks = [];
}

/**
 * Remove a specific callback
 * @param {Function} callback - Callback to remove
 */
export function removeForgeUpdateCallback(callback) {
    const index = globalUpdateCallbacks.indexOf(callback);
    if (index > -1) {
        globalUpdateCallbacks.splice(index, 1);
    }
}

// ===== EXPORT =====
export default {
    FORGE_CONFIG,
    initializeForge,
    checkAndResetDaily,
    checkAndBurnExpiredClaim,
    calculateAccrualRate,
    calculateForgeGained,
    updateAccrual,
    getForgeData,
    getCurrentForge,
    getPendingForgeClaim,
    getForgeBalance,
    claimForge,
    addForgeToBalance,
    spendForge,
    getSecondsUntilNextIncrement,
    getTimeUntilReset,
    getTimeUntilExpiry,
    getAccrualRateDisplay,
    startForgeUpdates,
    stopForgeUpdates,
    removeForgeUpdateCallback
};

// js/fuel-system.js
// FUEL token system - Real-time accrual based on certificate level
// Players earn FUEL passively while playing (and offline)
// Daily cap of 70 FUEL, resets at midnight UTC
// Unclaimed FUEL burns if not claimed within 24 hours

import { getItem, setItem } from './storage.js';
import { getCertificates, getTotalLaborShare } from './certificates.js';

// ===== CONSTANTS =====
const FUEL_CONFIG = {
    DAILY_CAP: 70,                    // Maximum FUEL per day
    ACCRUAL_BASE_RATE: 0.0007,        // Base FUEL per 10 seconds for share 100
    ACCRUAL_INTERVAL_MS: 10000,       // 10 seconds (used for rate calculation)
    RESET_HOUR: 0,                    // Midnight UTC
    RESET_MINUTE: 0,
    CLAIM_EXPIRY_HOURS: 24            // FUEL must be claimed within 24 hours
};

// Storage keys (using IndexedDB via storage.js)
const STORAGE_KEYS = {
    FUEL_DATA: 'fuelData',           // Main fuel data store
    FUEL_BALANCE: 'fuelBalance'      // Player's FUEL balance (spendable)
};

// ===== INITIALIZATION =====
/**
 * Initialize fuel system for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Fuel data object
 */
export async function initializeFuel(playerId) {
    try {
        let fuelData = await getItem('fuelData', playerId);
        
        if (!fuelData) {
            fuelData = {
                playerId: playerId,
                currentFuel: 0,           // FUEL accrued today (resets daily)
                lastAccrualTimestamp: Date.now(),
                lastResetDate: null,
                pendingClaim: 0,            // FUEL available to claim (from previous day)
                pendingClaimExpires: null,  // Timestamp when pending claim expires
                lastClaimDate: null,        // Date when last claimed
                totalFuelClaimed: 0,       // Lifetime FUEL claimed
                totalFuelBurned: 0         // Lifetime FUEL burned
            };
            await setItem('fuelData', fuelData, playerId);
        }
        
        // Check and perform daily reset
        await checkAndResetDaily(playerId);
        
        // Check for expired pending claims
        await checkAndBurnExpiredClaim(playerId);
        
        // Update accrual based on time passed
        await updateAccrual(playerId);
        
        return fuelData;
    } catch (error) {
        console.error('Error initializing fuel:', error);
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
        const fuelData = await getItem('fuelData', playerId);
        if (!fuelData) return false;
        
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        // Check if we need to reset
        if (fuelData.lastResetDate !== today) {
            // Move current FUEL to pending claim (if any)
            if (fuelData.currentFuel > 0) {
                fuelData.pendingClaim = fuelData.currentFuel;
                fuelData.pendingClaimExpires = Date.now() + (FUEL_CONFIG.CLAIM_EXPIRY_HOURS * 60 * 60 * 1000);
            }
            
            // Reset current FUEL
            fuelData.currentFuel = 0;
            fuelData.lastResetDate = today;
            fuelData.lastAccrualTimestamp = Date.now();
            
            await setItem('fuelData', fuelData, playerId);
            console.log(`🔄 FUEL daily reset for ${playerId}: ${fuelData.pendingClaim} FUEL moved to pending`);
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
        const fuelData = await getItem('fuelData', playerId);
        if (!fuelData) return 0;
        
        if (fuelData.pendingClaim > 0 && fuelData.pendingClaimExpires) {
            if (Date.now() > fuelData.pendingClaimExpires) {
                const burnedAmount = fuelData.pendingClaim;
                fuelData.totalFuelBurned += burnedAmount;
                fuelData.pendingClaim = 0;
                fuelData.pendingClaimExpires = null;
                
                await setItem('fuelData', fuelData, playerId);
                console.log(`🔥 ${burnedAmount} FUEL burned for ${playerId} (expired)`);
                
                // Dispatch event for UI updates
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('fuel-burned', { 
                        detail: { playerId, amount: burnedAmount } 
                    }));
                }
                
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
 * Rate = (Share / 100) × 0.0007 FUEL per 10 seconds
 * @param {number} share - Total certificate share
 * @returns {number} FUEL per 10 seconds
 */
export function calculateAccrualRate(share) {
    if (share <= 0) return 0;
    // Base rate 0.0007 per 10 seconds for share 100
    // Share 500 = 0.0035, Share 1000 = 0.007, Share 2000 = 0.014
    return (share / 100) * FUEL_CONFIG.ACCRUAL_BASE_RATE;
}

/**
 * Calculate FUEL gained over a time period - CONTINUOUS (no chunking)
 * @param {number} share - Certificate share
 * @param {number} milliseconds - Time elapsed in milliseconds
 * @returns {number} FUEL gained
 */
export function calculateFuelGained(share, milliseconds) {
    if (share <= 0 || milliseconds <= 0) return 0;
    
    // Rate per millisecond = (rate per 10 seconds) / 10000
    const ratePer10s = calculateAccrualRate(share);
    const ratePerMs = ratePer10s / FUEL_CONFIG.ACCRUAL_INTERVAL_MS;
    
    // DIRECT CONTINUOUS CALCULATION - NO CHUNKING, NO FLOORING
    // Any amount of time yields proportional FUEL
    return ratePerMs * milliseconds;
}

/**
 * Update FUEL accrual based on time passed since last update
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} New current FUEL amount
 */
export async function updateAccrual(playerId) {
    try {
        const fuelData = await getItem('fuelData', playerId);
        if (!fuelData) return 0;
        
        const now = Date.now();
        const timeElapsed = now - (fuelData.lastAccrualTimestamp || now);
        
        if (timeElapsed <= 0) return fuelData.currentFuel;
        
        // Get player's certificate share
        const certificates = await getCertificates(playerId);
        const share = getTotalLaborShare(certificates);
        
        // Calculate FUEL gained using continuous calculation
        let gained = calculateFuelGained(share, timeElapsed);
        
        if (gained > 0) {
            let newFuel = fuelData.currentFuel + gained;
            
            // Cap at daily maximum
            if (newFuel > FUEL_CONFIG.DAILY_CAP) {
                newFuel = FUEL_CONFIG.DAILY_CAP;
            }
            
            fuelData.currentFuel = newFuel;
        }
        
        fuelData.lastAccrualTimestamp = now;
        await setItem('fuelData', fuelData, playerId);
        
        return fuelData.currentFuel;
    } catch (error) {
        console.error('Error updating accrual:', error);
        return 0;
    }
}

// ===== GETTERS =====
/**
 * Get current FUEL data for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Fuel data object
 */
export async function getFuelData(playerId) {
    try {
        let fuelData = await getItem('fuelData', playerId);
        if (!fuelData) {
            fuelData = await initializeFuel(playerId);
        } else {
            // Check for reset and update accrual
            await checkAndResetDaily(playerId);
            await updateAccrual(playerId);
            fuelData = await getItem('fuelData', playerId);
        }
        return fuelData;
    } catch (error) {
        console.error('Error getting fuel data:', error);
        return null;
    }
}

/**
 * Get current FUEL amount (accrued today)
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Current FUEL amount
 */
export async function getCurrentFuel(playerId) {
    const fuelData = await getFuelData(playerId);
    return fuelData ? fuelData.currentFuel : 0;
}

/**
 * Get pending FUEL claim (from previous day)
 * @param {string} playerId - Player ID
 * @returns {Promise<{amount: number, expiresAt: number|null}>} Pending claim info
 */
export async function getPendingFuelClaim(playerId) {
    const fuelData = await getFuelData(playerId);
    if (!fuelData) return { amount: 0, expiresAt: null };
    
    // Check if expired
    if (fuelData.pendingClaim > 0 && fuelData.pendingClaimExpires) {
        if (Date.now() > fuelData.pendingClaimExpires) {
            await checkAndBurnExpiredClaim(playerId);
            return { amount: 0, expiresAt: null };
        }
        return { 
            amount: fuelData.pendingClaim, 
            expiresAt: fuelData.pendingClaimExpires 
        };
    }
    
    return { amount: 0, expiresAt: null };
}

/**
 * Get total FUEL balance (spendable - claimed FUEL)
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} FUEL balance
 */
export async function getFuelBalance(playerId) {
    try {
        const balance = await getItem('fuelBalance', playerId);
        return balance ? balance.amount : 0;
    } catch (error) {
        console.error('Error getting fuel balance:', error);
        return 0;
    }
}

// ===== CLAIM AND BALANCE MANAGEMENT =====
/**
 * Claim pending FUEL (add to spendable balance)
 * @param {string} playerId - Player ID
 * @returns {Promise<{success: boolean, amount: number, message: string}>} Result
 */
export async function claimFuel(playerId) {
    try {
        const fuelData = await getFuelData(playerId);
        if (!fuelData) {
            return { success: false, amount: 0, message: 'FUEL system not initialized' };
        }
        
        // Check for expired claim first
        await checkAndBurnExpiredClaim(playerId);
        
        // Refresh data after potential burn
        const refreshedData = await getItem('fuelData', playerId);
        if (!refreshedData || refreshedData.pendingClaim <= 0) {
            return { success: false, amount: 0, message: 'No FUEL available to claim' };
        }
        
        const claimAmount = refreshedData.pendingClaim;
        
        // Get or create balance
        let balance = await getItem('fuelBalance', playerId);
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
        refreshedData.totalFuelClaimed = (refreshedData.totalFuelClaimed || 0) + claimAmount;
        
        await setItem('fuelBalance', balance, playerId);
        await setItem('fuelData', refreshedData, playerId);
        
        // Dispatch event for UI updates
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('fuel-claimed', { 
                detail: { playerId, amount: claimAmount } 
            }));
        }
        
        return { 
            success: true, 
            amount: claimAmount, 
            message: `Claimed ${claimAmount.toFixed(3)} FUEL!` 
        };
        
    } catch (error) {
        console.error('Error claiming fuel:', error);
        return { success: false, amount: 0, message: 'Failed to claim FUEL' };
    }
}

/**
 * Add FUEL tokens to player's spendable balance (for rewards/purchases)
 * @param {string} playerId - Player ID
 * @param {number} amount - Amount to add
 * @returns {Promise<boolean>} Success status
 */
export async function addFuelToBalance(playerId, amount) {
    try {
        if (amount <= 0) return false;
        
        let balance = await getItem('fuelBalance', playerId);
        if (!balance) {
            balance = { playerId: playerId, amount: 0, totalClaimed: 0, lastClaimDate: null };
        }
        
        balance.amount += amount;
        await setItem('fuelBalance', balance, playerId);
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('fuel-balance-updated', { 
                detail: { playerId, amount, newBalance: balance.amount } 
            }));
        }
        
        return true;
    } catch (error) {
        console.error('Error adding fuel to balance:', error);
        return false;
    }
}

/**
 * Spend FUEL tokens
 * @param {string} playerId - Player ID
 * @param {number} amount - Amount to spend
 * @returns {Promise<boolean>} Success status
 */
export async function spendFuel(playerId, amount) {
    try {
        if (amount <= 0) return false;
        
        const balance = await getItem('fuelBalance', playerId);
        if (!balance || balance.amount < amount) return false;
        
        balance.amount -= amount;
        await setItem('fuelBalance', balance, playerId);
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('fuel-spent', { 
                detail: { playerId, amount, newBalance: balance.amount } 
            }));
        }
        
        return true;
    } catch (error) {
        console.error('Error spending fuel:', error);
        return false;
    }
}

// ===== UI HELPER FUNCTIONS =====
/**
 * Get formatted time until next accrual increment (for display)
 * @returns {number} Seconds until next increment (0-10)
 */
export function getSecondsUntilNextIncrement() {
    const now = Date.now();
    const intervalMs = FUEL_CONFIG.ACCRUAL_INTERVAL_MS;
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
    reset.setUTCHours(FUEL_CONFIG.RESET_HOUR, FUEL_CONFIG.RESET_MINUTE, 0, 0);
    
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
    return `+${rate.toFixed(4)}/${FUEL_CONFIG.ACCRUAL_INTERVAL_MS / 1000}s`;
}

/**
 * Get projected FUEL for the rest of the day
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Projected FUEL by end of day
 */
export async function getProjectedFuel(playerId) {
    try {
        const fuelData = await getFuelData(playerId);
        if (!fuelData) return 0;
        
        const certificates = await getCertificates(playerId);
        const share = getTotalLaborShare(certificates);
        
        const timeUntilReset = getTimeUntilReset();
        const hoursRemaining = timeUntilReset.hours + (timeUntilReset.minutes / 60);
        
        // Rate per hour = (rate per 10 seconds) × 360
        const ratePerHour = calculateAccrualRate(share) * 360;
        const projectedGain = ratePerHour * hoursRemaining;
        
        let projected = fuelData.currentFuel + projectedGain;
        if (projected > FUEL_CONFIG.DAILY_CAP) {
            projected = FUEL_CONFIG.DAILY_CAP;
        }
        
        return projected;
    } catch (error) {
        console.error('Error getting projected fuel:', error);
        return 0;
    }
}

// ===== PERIODIC UPDATE FOR REAL-TIME DISPLAY =====
let globalUpdateInterval = null;
let globalUpdateCallbacks = [];

/**
 * Start global FUEL update timer for real-time UI updates
 * @param {Function} callback - Function to call on each update
 */
export function startFuelUpdates(callback) {
    if (typeof callback === 'function') {
        globalUpdateCallbacks.push(callback);
    }
    
    if (!globalUpdateInterval) {
        globalUpdateInterval = setInterval(async () => {
            for (const cb of globalUpdateCallbacks) {
                try {
                    await cb();
                } catch (e) {
                    console.error('FUEL update callback error:', e);
                }
            }
        }, 1000); // Update every second for smooth display
    }
}

/**
 * Stop global FUEL updates
 */
export function stopFuelUpdates() {
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
export function removeFuelUpdateCallback(callback) {
    const index = globalUpdateCallbacks.indexOf(callback);
    if (index > -1) {
        globalUpdateCallbacks.splice(index, 1);
    }
}

// ===== EXPORT =====
export default {
    FUEL_CONFIG,
    initializeFuel,
    checkAndResetDaily,
    checkAndBurnExpiredClaim,
    calculateAccrualRate,
    calculateFuelGained,
    updateAccrual,
    getFuelData,
    getCurrentFuel,
    getPendingFuelClaim,
    getFuelBalance,
    claimFuel,
    addFuelToBalance,
    spendFuel,
    getSecondsUntilNextIncrement,
    getTimeUntilReset,
    getTimeUntilExpiry,
    getAccrualRateDisplay,
    getProjectedFuel,
    startFuelUpdates,
    stopFuelUpdates,
    removeFuelUpdateCallback
};

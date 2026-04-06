// js/warp-calculator.js - Warp travel calculations for Voidfarer
// Handles distance calculations, warp time estimation, and boost multipliers
// APPROVED CHANGE: Added boost multiplier support for accelerated and instant warp

/**
 * Calculate warp time based on distance, ship speed, and optional boost multiplier
 * @param {number} distance - Distance in light years
 * @param {number} shipSpeed - Ship's base warp speed (LY per minute)
 * @param {number} boostMultiplier - Optional speed multiplier (1 = standard, 2 = 2x speed, Infinity = instant)
 * @returns {number} Warp time in minutes (rounded up, minimum 1)
 */
export function calculateWarpTime(distance, shipSpeed, boostMultiplier = 1) {
    if (!distance || distance <= 0) return 0;
    if (!shipSpeed || shipSpeed <= 0) return 1;
    
    // Handle instant warp
    if (boostMultiplier === Infinity || boostMultiplier === 0) {
        return 0;
    }
    
    const effectiveSpeed = shipSpeed * boostMultiplier;
    const rawTime = distance / effectiveSpeed;
    
    // Minimum 1 minute for non-instant warps
    return Math.max(1, Math.ceil(rawTime));
}

/**
 * Calculate warp cycles based on warp time
 * Each cycle represents ~1 minute of travel time
 * @param {number} warpTimeMinutes - Warp time in minutes
 * @returns {number} Number of warp cycles (minimum 1)
 */
export function calculateWarpCycles(warpTimeMinutes) {
    if (warpTimeMinutes === 0) return 0;
    return Math.max(1, Math.ceil(warpTimeMinutes));
}

/**
 * Calculate total journey distance including all legs
 * @param {Object} legs - Object containing distances for each leg
 * @returns {number} Total distance in light years
 */
export function calculateTotalDistance(legs) {
    let total = 0;
    if (legs.sectorDistance) total += legs.sectorDistance;
    if (legs.starSectorDistance) total += legs.starSectorDistance;
    if (legs.starDistance) total += legs.starDistance;
    if (legs.planetDescent) total += legs.planetDescent;
    return total;
}

/**
 * Get the effective speed multiplier based on boost type
 * @param {string} boostType - 'standard', 'accelerated', or 'instant'
 * @returns {Object} { multiplier: number, cost: number, name: string }
 */
export function getBoostMultiplier(boostType) {
    switch(boostType) {
        case 'accelerated':
            return { multiplier: 2, cost: 10, name: 'ACCELERATED' };
        case 'instant':
            return { multiplier: Infinity, cost: 50, name: 'INSTANT' };
        default:
            return { multiplier: 1, cost: 0, name: 'STANDARD' };
    }
}

/**
 * Calculate all warp metrics including time, cycles, and boost options
 * @param {number} distance - Distance in light years
 * @param {number} shipSpeed - Ship's base warp speed (LY per minute)
 * @param {string} boostType - 'standard', 'accelerated', or 'instant'
 * @returns {Object} Complete warp metrics
 */
export function calculateWarpMetrics(distance, shipSpeed, boostType = 'standard') {
    const boost = getBoostMultiplier(boostType);
    const warpTime = calculateWarpTime(distance, shipSpeed, boost.multiplier);
    const warpCycles = calculateWarpCycles(warpTime);
    
    return {
        distance: distance,
        shipSpeed: shipSpeed,
        boostType: boostType,
        boostMultiplier: boost.multiplier,
        boostCost: boost.cost,
        boostName: boost.name,
        warpTimeMinutes: warpTime,
        warpCycles: warpCycles,
        effectiveSpeed: shipSpeed * (boost.multiplier === Infinity ? 0 : boost.multiplier),
        isInstant: boost.multiplier === Infinity
    };
}

/**
 * Format warp time for display
 * @param {number} minutes - Warp time in minutes
 * @returns {string} Formatted time string (e.g., "5 min" or "INSTANT")
 */
export function formatWarpTime(minutes) {
    if (minutes === 0) return 'INSTANT';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
}

/**
 * Format distance for display
 * @param {number} distance - Distance in light years
 * @returns {string} Formatted distance string
 */
export function formatDistance(distance) {
    if (distance >= 1000) {
        return (distance / 1000).toFixed(1) + 'k LY';
    }
    return distance.toFixed(1) + ' LY';
}

/**
 * Validate if a warp is possible given ship tier and distance
 * @param {number} shipTier - Player's ship tier
 * @param {number} requiredTier - Required tier for the sector
 * @param {number} shipRange - Ship's maximum range in LY
 * @param {number} distance - Distance to destination in LY
 * @returns {Object} { possible: boolean, reason: string }
 */
export function validateWarp(shipTier, requiredTier, shipRange, distance) {
    if (shipTier < requiredTier) {
        return { possible: false, reason: `Requires Tier ${requiredTier} ship` };
    }
    if (distance > shipRange) {
        return { possible: false, reason: `Beyond ship range (${distance} > ${shipRange} LY)` };
    }
    return { possible: true, reason: null };
}

// ===== EXPORT =====
export default {
    calculateWarpTime,
    calculateWarpCycles,
    calculateTotalDistance,
    getBoostMultiplier,
    calculateWarpMetrics,
    formatWarpTime,
    formatDistance,
    validateWarp
};

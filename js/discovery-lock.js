// js/discovery-lock.js
// Discovery Lock System for Voidfarer
// Manages planet discovery history, 30-day rights expiration, and rediscovery mechanics
// UPDATED: Implements 30-day decay cycle, hidden planets, and scan-based rediscovery

import { 
    getPlanetClaim, 
    isPlanetClaimed, 
    updatePlanetClaim,
    getPlanetStatus
} from './planet-status.js';

import {
    getDiscoveryHistory,
    saveDiscoveryHistory,
    addToDiscoveryHistory,
    getHiddenPlanets,
    hidePlanet,
    revealPlanet,
    getScannedSectors,
    markSectorScanned,
    getScannedStarSectors,
    markStarSectorScanned,
    getScannedStars,
    markStarScanned,
    isPlanetVisibleToPlayer
} from './storage.js';

// ===== CONSTANTS =====
export const RIGHTS_DURATION_DAYS = 30;
export const EXPIRATION_WARNING_DAYS = 3; // Show warning 3 days before expiration
export const RENEWAL_COST_MULTIPLIER = 0.5; // 50% of original claim cost to renew

// ===== RIGHTS STATUS =====
export const RIGHTS_STATUS = {
    ACTIVE: 'active',
    EXPIRING_SOON: 'expiring_soon', // Within 3 days
    EXPIRED: 'expired',
    AVAILABLE: 'available'
};

// ===== TIER ACCESS RULES =====
// Tiers 1-4: Always visible, no rights needed
// Tiers 5-10: Rights required, expire after 30 days
export const TIER_RIGHTS_REQUIRED = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true
};

// ===== HELPER FUNCTIONS =====

/**
 * Check if a planet requires mining rights
 * @param {number} planetTier - Planet tier (1-10)
 * @returns {boolean} True if rights are required
 */
export function requiresMiningRights(planetTier) {
    return TIER_RIGHTS_REQUIRED[planetTier] === true;
}

/**
 * Get rights status for a planet
 * @param {string} planetName - Name of the planet
 * @returns {Promise<Object>} Rights status object
 */
export async function getPlanetRightsStatus(planetName) {
    try {
        const claim = await getPlanetClaim(planetName);
        
        if (!claim) {
            return {
                status: RIGHTS_STATUS.AVAILABLE,
                owner: null,
                expiresAt: null,
                daysRemaining: 0,
                canRenew: false
            };
        }
        
        const claimedAt = claim.claimedAt;
        const expiresAt = claimedAt + (RIGHTS_DURATION_DAYS * 24 * 60 * 60 * 1000);
        const now = Date.now();
        const daysRemaining = Math.max(0, Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000)));
        
        let status = RIGHTS_STATUS.ACTIVE;
        if (daysRemaining <= 0) {
            status = RIGHTS_STATUS.EXPIRED;
        } else if (daysRemaining <= EXPIRATION_WARNING_DAYS) {
            status = RIGHTS_STATUS.EXPIRING_SOON;
        }
        
        return {
            status: status,
            owner: claim.ownerName,
            ownerId: claim.ownerId,
            expiresAt: expiresAt,
            daysRemaining: daysRemaining,
            canRenew: status !== RIGHTS_STATUS.EXPIRED && status !== RIGHTS_STATUS.AVAILABLE,
            renewalCost: claim.baseFee * RENEWAL_COST_MULTIPLIER,
            highestRarity: claim.highestRarity
        };
        
    } catch (error) {
        console.error('Error getting planet rights status:', error);
        return {
            status: RIGHTS_STATUS.AVAILABLE,
            owner: null,
            expiresAt: null,
            daysRemaining: 0,
            canRenew: false
        };
    }
}

/**
 * Renew mining rights for a planet
 * @param {string} planetName - Name of the planet
 * @param {string} playerId - Player ID renewing
 * @param {number} creditsPaid - Credits paid for renewal
 * @returns {Promise<boolean>} Success status
 */
export async function renewMiningRights(planetName, playerId, creditsPaid) {
    try {
        const status = await getPlanetRightsStatus(planetName);
        
        // Can only renew active or expiring soon rights
        if (status.status === RIGHTS_STATUS.EXPIRED || status.status === RIGHTS_STATUS.AVAILABLE) {
            console.warn('Cannot renew expired or unavailable rights');
            return false;
        }
        
        // Verify player is the owner
        if (status.ownerId !== playerId) {
            console.warn('Only the rights owner can renew');
            return false;
        }
        
        // Verify payment amount
        if (creditsPaid < status.renewalCost) {
            console.warn('Insufficient payment for renewal');
            return false;
        }
        
        // Extend the rights
        const currentClaim = await getPlanetClaim(planetName);
        if (currentClaim) {
            const newExpiration = Date.now() + (RIGHTS_DURATION_DAYS * 24 * 60 * 60 * 1000);
            await updatePlanetClaim(planetName, {
                claimedAt: newExpiration - (RIGHTS_DURATION_DAYS * 24 * 60 * 60 * 1000), // Reset to now minus duration for proper calculation
                lastRenewed: Date.now(),
                totalRenewals: (currentClaim.totalRenewals || 0) + 1
            });
            
            console.log(`✅ Mining rights renewed for ${planetName} by ${status.owner}`);
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('Error renewing mining rights:', error);
        return false;
    }
}

/**
 * Check and process expired rights
 * Called on game load and periodically
 * @returns {Promise<Array>} List of planets that expired
 */
export async function processExpiredRights() {
    try {
        const planetClaims = JSON.parse(localStorage.getItem('voidfarer_planet_claims') || '{}');
        const expiredPlanets = [];
        const now = Date.now();
        
        for (const [planetName, claim] of Object.entries(planetClaims)) {
            const expiresAt = claim.claimedAt + (RIGHTS_DURATION_DAYS * 24 * 60 * 60 * 1000);
            
            if (expiresAt <= now) {
                // Rights have expired
                expiredPlanets.push(planetName);
                
                // Hide the planet from the map
                await hidePlanet(planetName);
                
                // Optionally mark claim as expired in the record
                await updatePlanetClaim(planetName, {
                    expiredAt: now,
                    isExpired: true
                });
                
                console.log(`🔒 Mining rights expired for ${planetName}. Planet is now hidden.`);
            }
        }
        
        return expiredPlanets;
        
    } catch (error) {
        console.error('Error processing expired rights:', error);
        return [];
    }
}

/**
 * Get planets that are expiring soon (within warning period)
 * @returns {Promise<Array>} List of planets with expiring rights
 */
export async function getExpiringPlanets() {
    try {
        const planetClaims = JSON.parse(localStorage.getItem('voidfarer_planet_claims') || '{}');
        const expiringPlanets = [];
        const now = Date.now();
        const warningThreshold = EXPIRATION_WARNING_DAYS * 24 * 60 * 60 * 1000;
        
        for (const [planetName, claim] of Object.entries(planetClaims)) {
            const expiresAt = claim.claimedAt + (RIGHTS_DURATION_DAYS * 24 * 60 * 60 * 1000);
            const timeUntilExpiry = expiresAt - now;
            
            if (timeUntilExpiry > 0 && timeUntilExpiry <= warningThreshold) {
                expiringPlanets.push({
                    planetName: planetName,
                    ownerName: claim.ownerName,
                    expiresAt: expiresAt,
                    daysRemaining: Math.ceil(timeUntilExpiry / (24 * 60 * 60 * 1000)),
                    renewalCost: claim.baseFee * RENEWAL_COST_MULTIPLIER
                });
            }
        }
        
        return expiringPlanets;
        
    } catch (error) {
        console.error('Error getting expiring planets:', error);
        return [];
    }
}

/**
 * Record a planet discovery (first discovery or rediscovery)
 * @param {string} planetName - Name of the planet
 * @param {string} playerId - Player ID who discovered/rediscovered
 * @param {string} playerName - Player name
 * @param {number} planetTier - Planet tier
 * @returns {Promise<Object>} Result with discovery type
 */
export async function recordPlanetDiscovery(planetName, playerId, playerName, planetTier) {
    try {
        const history = await getDiscoveryHistory(planetName);
        const isFirstDiscovery = history.length === 0;
        
        await addToDiscoveryHistory(planetName, playerId, playerName, planetTier);
        
        // If the planet was hidden, reveal it
        const hidden = await getHiddenPlanets();
        if (hidden.includes(planetName)) {
            await revealPlanet(planetName);
            console.log(`🔓 Planet ${planetName} has been rediscovered by ${playerName}!`);
            return {
                success: true,
                discoveryType: 'rediscovery',
                isFirstDiscovery: false,
                message: `${planetName} has been rediscovered!`
            };
        }
        
        if (isFirstDiscovery) {
            console.log(`✨ Planet ${planetName} discovered for the first time by ${playerName}!`);
            return {
                success: true,
                discoveryType: 'first',
                isFirstDiscovery: true,
                message: `You discovered ${planetName}!`
            };
        }
        
        return {
            success: true,
            discoveryType: 'already_discovered',
            isFirstDiscovery: false,
            message: `${planetName} was previously discovered`
        };
        
    } catch (error) {
        console.error('Error recording planet discovery:', error);
        return {
            success: false,
            discoveryType: 'error',
            isFirstDiscovery: false,
            message: 'Failed to record discovery'
        };
    }
}

/**
 * Check if a planet should be visible on the galaxy map
 * @param {string} planetName - Name of the planet
 * @param {string} playerId - Current player ID
 * @param {number} planetTier - Planet tier
 * @returns {Promise<boolean>} True if visible
 */
export async function isPlanetVisible(planetName, playerId, planetTier) {
    // Tiers 1-4 are always visible
    if (planetTier <= 4) {
        return true;
    }
    
    // Check if planet is hidden
    const hidden = await getHiddenPlanets();
    if (hidden.includes(planetName)) {
        return false;
    }
    
    return true;
}

/**
 * Scan a galactic sector to reveal hidden planets
 * @param {string} sectorId - Sector ID (e.g., 'B2')
 * @param {string} playerId - Player ID scanning
 * @returns {Promise<Array>} List of planets revealed
 */
export async function scanGalacticSector(sectorId, playerId) {
    try {
        // Mark sector as scanned
        await markSectorScanned(sectorId, playerId);
        
        // Find all planets in this sector that are hidden
        // This requires cross-referencing with planet data
        // For now, return empty array - will be implemented when planet data is linked to sectors
        
        console.log(`🔭 Galactic sector ${sectorId} scanned by player ${playerId}`);
        
        return [];
        
    } catch (error) {
        console.error('Error scanning galactic sector:', error);
        return [];
    }
}

/**
 * Scan a star sector to reveal hidden planets
 * @param {string} starSectorName - Name of the star sector
 * @param {string} playerId - Player ID scanning
 * @returns {Promise<Array>} List of planets revealed
 */
export async function scanStarSector(starSectorName, playerId) {
    try {
        // Mark star sector as scanned
        await markStarSectorScanned(starSectorName, playerId);
        
        console.log(`🔭 Star sector ${starSectorName} scanned by player ${playerId}`);
        
        return [];
        
    } catch (error) {
        console.error('Error scanning star sector:', error);
        return [];
    }
}

/**
 * Scan a star system to reveal hidden planets
 * @param {string} starName - Name of the star
 * @param {string} playerId - Player ID scanning
 * @returns {Promise<Array>} List of planets revealed
 */
export async function scanStarSystem(starName, playerId) {
    try {
        // Mark star as scanned
        await markStarScanned(starName, playerId);
        
        console.log(`🔭 Star system ${starName} scanned by player ${playerId}`);
        
        return [];
        
    } catch (error) {
        console.error('Error scanning star system:', error);
        return [];
    }
}

/**
 * Get the full discovery history for a planet with formatted output
 * @param {string} planetName - Name of the planet
 * @returns {Promise<Array>} Formatted discovery history
 */
export async function getFormattedDiscoveryHistory(planetName) {
    try {
        const history = await getDiscoveryHistory(planetName);
        
        return history.map(record => ({
            playerName: record.playerName,
            date: record.date,
            timestamp: record.timestamp,
            planetTier: record.planetTier,
            isFirstDiscovery: record.isFirstDiscovery,
            formattedDate: new Date(record.timestamp).toLocaleDateString(),
            formattedTime: new Date(record.timestamp).toLocaleTimeString()
        }));
        
    } catch (error) {
        console.error('Error getting formatted discovery history:', error);
        return [];
    }
}

/**
 * Get the first discoverer of a planet
 * @param {string} planetName - Name of the planet
 * @returns {Promise<Object|null>} First discoverer or null
 */
export async function getFirstDiscoverer(planetName) {
    try {
        const history = await getDiscoveryHistory(planetName);
        
        if (history.length === 0) {
            return null;
        }
        
        const first = history[0];
        return {
            playerName: first.playerName,
            date: first.date,
            timestamp: first.timestamp
        };
        
    } catch (error) {
        console.error('Error getting first discoverer:', error);
        return null;
    }
}

// ===== EXPORT ALL =====
export default {
    RIGHTS_DURATION_DAYS,
    EXPIRATION_WARNING_DAYS,
    RENEWAL_COST_MULTIPLIER,
    RIGHTS_STATUS,
    TIER_RIGHTS_REQUIRED,
    requiresMiningRights,
    getPlanetRightsStatus,
    renewMiningRights,
    processExpiredRights,
    getExpiringPlanets,
    recordPlanetDiscovery,
    isPlanetVisible,
    scanGalacticSector,
    scanStarSector,
    scanStarSystem,
    getFormattedDiscoveryHistory,
    getFirstDiscoverer
};

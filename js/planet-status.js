// js/planet-status.js
// Planet exploration status tracking for Voidfarer
// Handles determining planet colors based on highest rarity found
// Tracks completion status for the calm, minimalist exploration system
// Now includes claim status integration
// UPDATED: Added discovery history and rights status functions

// ===== RARITY LEVELS (ordered from lowest to highest) =====
export const RARITY_LEVELS = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    VERY_RARE: 'very-rare',
    LEGENDARY: 'legendary'
};

// ===== RARITY ORDER for comparison =====
const RARITY_ORDER = [
    RARITY_LEVELS.COMMON,
    RARITY_LEVELS.UNCOMMON,
    RARITY_LEVELS.RARE,
    RARITY_LEVELS.VERY_RARE,
    RARITY_LEVELS.LEGENDARY
];

// ===== RARITY COLORS for planet tint =====
export const RARITY_COLORS = {
    [RARITY_LEVELS.COMMON]: '#ffffff',      // White
    [RARITY_LEVELS.UNCOMMON]: '#b0ffb0',    // Green
    [RARITY_LEVELS.RARE]: '#b0b0ff',        // Blue
    [RARITY_LEVELS.VERY_RARE]: '#e0b0ff',   // Purple
    [RARITY_LEVELS.LEGENDARY]: '#ffd700'     // Gold
};

// ===== RARITY CSS CLASSES =====
export const RARITY_CLASSES = {
    [RARITY_LEVELS.COMMON]: 'explored-common',
    [RARITY_LEVELS.UNCOMMON]: 'explored-uncommon',
    [RARITY_LEVELS.RARE]: 'explored-rare',
    [RARITY_LEVELS.VERY_RARE]: 'explored-very-rare',
    [RARITY_LEVELS.LEGENDARY]: 'explored-legendary'
};

// ===== PLANET STATUS STORAGE KEYS =====
const STORAGE_KEYS = {
    PLANET_STATUS: 'voidfarer_planet_status',
    CLAIMED_PLANETS: 'voidfarer_claimed_planets',
    PLANET_CLAIMS: 'voidfarer_planet_claims',      // Added for detailed claim data
    PLAYER_CLAIMS: 'voidfarer_player_claims'       // Added for player claim index
};

// ===== FEE CONFIGURATION =====
export const FEE_CONFIG = {
    [RARITY_LEVELS.VERY_RARE]: 8,   // 8% fee for Very Rare discoveries
    [RARITY_LEVELS.LEGENDARY]: 10   // 10% fee for Legendary discoveries
};

// ===== COMPARE RARITIES =====
// Returns true if rarity1 is higher than rarity2
export function isRarityHigher(rarity1, rarity2) {
    const index1 = RARITY_ORDER.indexOf(rarity1);
    const index2 = RARITY_ORDER.indexOf(rarity2);
    
    if (index1 === -1) return false;
    if (index2 === -1) return true;
    
    return index1 > index2;
}

// ===== GET HIGHEST RARITY FROM LIST =====
export function getHighestRarity(rarities) {
    if (!rarities || rarities.length === 0) return null;
    
    let highestIndex = -1;
    let highestRarity = null;
    
    rarities.forEach(rarity => {
        const index = RARITY_ORDER.indexOf(rarity);
        if (index > highestIndex) {
            highestIndex = index;
            highestRarity = rarity;
        }
    });
    
    return highestRarity;
}

// ===== GET PLANET STATUS FROM JOURNAL LOCATIONS =====
export async function getPlanetStatus(planetName, locations = null) {
    try {
        // If locations not provided, try to get from window
        if (!locations && typeof window.getPlayerLocations === 'function') {
            locations = await window.getPlayerLocations();
        }
        
        // Check if claimed and get claim data FIRST - this ensures we always know claim status
        const claimed = await isPlanetClaimed(planetName);
        const claimData = claimed ? await getPlanetClaim(planetName) : null;
        
        if (!locations || locations.length === 0) {
            return {
                explored: false,
                highestRarity: claimData?.highestRarity || null,
                resourcesFound: [],
                resourceCount: 0,
                fullyExplored: false,
                claimed: claimed,
                claimData: claimData,
                color: claimData?.highestRarity ? RARITY_COLORS[claimData.highestRarity] : null,
                cssClass: claimed ? 'claimed' : 'unexplored'
            };
        }
        
        // Filter locations for this planet
        const planetLocations = locations.filter(loc => loc.planet === planetName);
        
        if (planetLocations.length === 0) {
            return {
                explored: false,
                highestRarity: claimData?.highestRarity || null,
                resourcesFound: [],
                resourceCount: 0,
                fullyExplored: false,
                claimed: claimed,
                claimData: claimData,
                color: claimData?.highestRarity ? RARITY_COLORS[claimData.highestRarity] : null,
                cssClass: claimed ? 'claimed' : 'unexplored'
            };
        }
        
        // Get unique resources found on this planet
        const resourcesFound = [];
        const raritiesFound = [];
        
        planetLocations.forEach(loc => {
            const resourceName = loc.elementName;
            const rarity = loc.elementRarity || getRarityFromElementName(resourceName);
            
            if (!resourcesFound.includes(resourceName)) {
                resourcesFound.push(resourceName);
            }
            
            if (!raritiesFound.includes(rarity)) {
                raritiesFound.push(rarity);
            }
        });
        
        // Get highest rarity - prefer stored claim data if available, otherwise calculate
        let highestRarity = getHighestRarity(raritiesFound);
        
        // If claimed and we have claim data with highestRarity, use that instead
        if (claimed && claimData && claimData.highestRarity) {
            highestRarity = claimData.highestRarity;
        }
        
        // Check if fully explored (all 4 resources found)
        const totalResources = 4; // Default max
        const fullyExplored = resourcesFound.length >= totalResources;
        
        return {
            explored: true,
            highestRarity: highestRarity,
            resourcesFound: resourcesFound,
            resourceCount: resourcesFound.length,
            totalResources: totalResources,
            fullyExplored: fullyExplored,
            claimed: claimed,
            claimData: claimData,
            color: RARITY_COLORS[highestRarity] || null,
            cssClass: fullyExplored ? 'complete' : (RARITY_CLASSES[highestRarity] || 'explored')
        };
        
    } catch (error) {
        console.error(`Error getting planet status for ${planetName}:`, error);
        return {
            explored: false,
            highestRarity: null,
            resourcesFound: [],
            resourceCount: 0,
            fullyExplored: false,
            claimed: false,
            claimData: null,
            color: null,
            cssClass: 'unexplored'
        };
    }
}

// ===== GET RARITY FROM ELEMENT NAME (fallback) =====
function getRarityFromElementName(elementName) {
    const rareElements = [
        'Gold', 'Silver', 'Platinum', 'Titanium', 'Copper', 'Zinc', 'Tin', 'Cobalt',
        'Chromium', 'Nickel', 'Lead', 'Mercury', 'Uranium', 'Thorium', 'Plutonium',
        'Radium', 'Polonium', 'Promethium', 'Technetium', 'Astatine', 'Francium'
    ];
    
    if (rareElements.includes(elementName)) {
        if (['Promethium', 'Technetium', 'Astatine', 'Francium'].includes(elementName)) {
            return RARITY_LEVELS.LEGENDARY;
        }
        if (['Uranium', 'Thorium', 'Plutonium', 'Radium', 'Polonium'].includes(elementName)) {
            return RARITY_LEVELS.VERY_RARE;
        }
        return RARITY_LEVELS.RARE;
    }
    
    const uncommonElements = ['Carbon', 'Oxygen', 'Nitrogen', 'Iron', 'Aluminum', 'Silicon'];
    if (uncommonElements.includes(elementName)) {
        return RARITY_LEVELS.UNCOMMON;
    }
    
    return RARITY_LEVELS.COMMON;
}

// ===== GET STATUS FOR MULTIPLE PLANETS =====
export async function getPlanetsStatus(planetNames, locations = null) {
    const statuses = {};
    
    for (const planetName of planetNames) {
        statuses[planetName] = await getPlanetStatus(planetName, locations);
    }
    
    return statuses;
}

// ===== UPDATE PLANET STATUS AFTER NEW DISCOVERY =====
export async function updatePlanetStatusAfterDiscovery(planetName, elementName, rarity) {
    // This function doesn't need to do much since status is calculated from locations
    // But we could trigger a cache update or event
    console.log(`Planet ${planetName} updated with new discovery: ${elementName} (${rarity})`);
    
    // Check if all elements are now discovered
    const status = await getPlanetStatus(planetName);
    
    // You could dispatch a custom event for UI to update
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('planet-status-updated', {
            detail: { planetName, elementName, rarity, fullyExplored: status.fullyExplored }
        });
        window.dispatchEvent(event);
    }
    
    return status;
}

// ===== CLAIM PLANET =====
export async function claimPlanet(planetName, playerId, playerName, discoveryElement, discoveryRarity) {
    try {
        console.log(`Attempting to claim planet ${planetName} for player ${playerName}`);
        
        // Check if already claimed
        const alreadyClaimed = await isPlanetClaimed(planetName);
        if (alreadyClaimed) {
            console.log(`Planet ${planetName} is already claimed`);
            return false;
        }
        
        // Get the highest rarity from the planet's resources before claiming
        const planetStatus = await getPlanetStatus(planetName);
        const highestRarity = planetStatus.highestRarity || discoveryRarity;
        
        console.log(`Planet ${planetName} highest rarity: ${highestRarity}`);
        
        // Get existing claims
        let planetClaims = {};
        const saved = localStorage.getItem(STORAGE_KEYS.PLANET_CLAIMS);
        if (saved) {
            try {
                planetClaims = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse planet claims:', e);
            }
        }
        
        // Get player claims index
        let playerClaims = {};
        const playerSaved = localStorage.getItem(STORAGE_KEYS.PLAYER_CLAIMS);
        if (playerSaved) {
            try {
                playerClaims = JSON.parse(playerSaved);
            } catch (e) {
                console.error('Failed to parse player claims:', e);
            }
        }
        
        // Get current sector coordinates
        const sectorX = parseInt(localStorage.getItem('voidfarer_current_sector_x')) || 30;
        const sectorY = parseInt(localStorage.getItem('voidfarer_current_sector_y')) || 40;
        
        // Determine base fee from discovery rarity
        const baseFee = FEE_CONFIG[discoveryRarity] || 10;
        
        // Create claim record with highestRarity preserved
        const claimRecord = {
            planetName: planetName,
            planetType: localStorage.getItem('voidfarer_current_planet_type') || 'unknown',
            ownerId: playerId,
            ownerName: playerName,
            discoveredElement: discoveryElement,
            rarity: discoveryRarity,
            highestRarity: highestRarity, // Store the actual highest rarity
            baseFee: baseFee,
            currentFee: baseFee,
            claimedAt: Date.now(),
            claimedDate: new Date().toISOString(),
            lastFeeUpdate: Date.now(),
            totalEarned: 0,
            totalMiners: 0,
            sectorX: sectorX,
            sectorY: sectorY,
            totalRenewals: 0,
            lastRenewed: null,
            expiredAt: null,
            isExpired: false
        };
        
        // Save to planet claims
        planetClaims[planetName] = claimRecord;
        localStorage.setItem(STORAGE_KEYS.PLANET_CLAIMS, JSON.stringify(planetClaims));
        
        // Update player claims index
        if (!playerClaims[playerId]) {
            playerClaims[playerId] = [];
        }
        if (!playerClaims[playerId].includes(planetName)) {
            playerClaims[playerId].push(planetName);
        }
        localStorage.setItem(STORAGE_KEYS.PLAYER_CLAIMS, JSON.stringify(playerClaims));
        
        // Update legacy claimed planets list for backward compatibility
        let claimedPlanets = [];
        const legacySaved = localStorage.getItem(STORAGE_KEYS.CLAIMED_PLANETS);
        if (legacySaved) {
            try {
                claimedPlanets = JSON.parse(legacySaved);
            } catch (e) {}
        }
        if (!claimedPlanets.includes(planetName)) {
            claimedPlanets.push(planetName);
            localStorage.setItem(STORAGE_KEYS.CLAIMED_PLANETS, JSON.stringify(claimedPlanets));
        }
        
        // Update player stats
        try {
            const player = await window.getPlayer();
            if (player) {
                player.planetsOwned = (player.planetsOwned || 0) + 1;
                await window.savePlayer(player);
            }
        } catch (e) {
            console.error('Error updating player stats:', e);
        }
        
        console.log(`Planet ${planetName} successfully claimed by ${playerName}!`);
        
        // Dispatch event for UI update
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('planet-claimed', {
                detail: { planetName, ownerName: playerName, discoveryElement, discoveryRarity, highestRarity }
            });
            window.dispatchEvent(event);
        }
        
        return true;
        
    } catch (error) {
        console.error(`Error claiming planet ${planetName}:`, error);
        return false;
    }
}

// ===== GET PLANET CLAIM DATA =====
export async function getPlanetClaim(planetName) {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.PLANET_CLAIMS);
        if (!saved) return null;
        
        const planetClaims = JSON.parse(saved);
        return planetClaims[planetName] || null;
        
    } catch (error) {
        console.error(`Error getting claim for planet ${planetName}:`, error);
        return null;
    }
}

// ===== UPDATE PLANET CLAIM DATA =====
export async function updatePlanetClaim(planetName, updates) {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.PLANET_CLAIMS);
        if (!saved) return false;
        
        const planetClaims = JSON.parse(saved);
        if (!planetClaims[planetName]) return false;
        
        // Apply updates
        planetClaims[planetName] = {
            ...planetClaims[planetName],
            ...updates,
            lastFeeUpdate: Date.now()
        };
        
        localStorage.setItem(STORAGE_KEYS.PLANET_CLAIMS, JSON.stringify(planetClaims));
        return true;
        
    } catch (error) {
        console.error(`Error updating claim for planet ${planetName}:`, error);
        return false;
    }
}

// ===== ADD MINING EARNINGS TO CLAIM =====
export async function addMiningEarnings(planetName, amount, minerId) {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.PLANET_CLAIMS);
        if (!saved) return false;
        
        const planetClaims = JSON.parse(saved);
        if (!planetClaims[planetName]) return false;
        
        // Update earnings and miner count
        planetClaims[planetName].totalEarned = (planetClaims[planetName].totalEarned || 0) + amount;
        planetClaims[planetName].totalMiners = (planetClaims[planetName].totalMiners || 0) + 1;
        
        localStorage.setItem(STORAGE_KEYS.PLANET_CLAIMS, JSON.stringify(planetClaims));
        
        // Update player stats for owner
        try {
            const ownerId = planetClaims[planetName].ownerId;
            const currentPlayerId = localStorage.getItem('voidfarer_player_id');
            
            if (ownerId === currentPlayerId) {
                const player = await window.getPlayer();
                if (player) {
                    player.totalMiningEarnings = (player.totalMiningEarnings || 0) + amount;
                    await window.savePlayer(player);
                }
            }
        } catch (e) {
            console.error('Error updating player mining earnings:', e);
        }
        
        return true;
        
    } catch (error) {
        console.error(`Error adding mining earnings for planet ${planetName}:`, error);
        return false;
    }
}

// ===== CHECK IF PLANET IS CLAIMED =====
export async function isPlanetClaimed(planetName) {
    try {
        // First check detailed claims
        const saved = localStorage.getItem(STORAGE_KEYS.PLANET_CLAIMS);
        if (saved) {
            const planetClaims = JSON.parse(saved);
            if (planetClaims[planetName]) {
                // Check if expired
                const claim = planetClaims[planetName];
                const expiresAt = claim.claimedAt + (30 * 24 * 60 * 60 * 1000);
                if (Date.now() < expiresAt) {
                    return true;
                }
            }
        }
        
        // Fallback to legacy claimed planets list
        const legacySaved = localStorage.getItem(STORAGE_KEYS.CLAIMED_PLANETS);
        if (!legacySaved) return false;
        
        const claimed = JSON.parse(legacySaved);
        return claimed.includes(planetName);
        
    } catch (error) {
        console.error(`Error checking if planet ${planetName} is claimed:`, error);
        return false;
    }
}

// ===== GET ALL CLAIMED PLANETS (with full data) =====
export function getClaimedPlanets() {
    try {
        // Get detailed claims
        const saved = localStorage.getItem(STORAGE_KEYS.PLANET_CLAIMS);
        if (saved) {
            const planetClaims = JSON.parse(saved);
            return Object.values(planetClaims);
        }
        
        // Fallback to legacy list
        const legacySaved = localStorage.getItem(STORAGE_KEYS.CLAIMED_PLANETS);
        if (!legacySaved) return [];
        
        const claimedNames = JSON.parse(legacySaved);
        return claimedNames.map(name => ({ planetName: name }));
        
    } catch (error) {
        console.error('Error getting claimed planets:', error);
        return [];
    }
}

// ===== GET CLAIMS FOR A SPECIFIC PLAYER =====
export function getPlayerClaims(playerId) {
    try {
        // Get player claims index
        const playerSaved = localStorage.getItem(STORAGE_KEYS.PLAYER_CLAIMS);
        if (!playerSaved) return [];
        
        const playerClaims = JSON.parse(playerSaved);
        const planetNames = playerClaims[playerId] || [];
        
        // Get full claim data for each planet
        const planetSaved = localStorage.getItem(STORAGE_KEYS.PLANET_CLAIMS);
        if (!planetSaved) return planetNames.map(name => ({ planetName: name }));
        
        const planetClaims = JSON.parse(planetSaved);
        return planetNames
            .map(name => planetClaims[name])
            .filter(claim => claim !== undefined);
        
    } catch (error) {
        console.error(`Error getting claims for player ${playerId}:`, error);
        return [];
    }
}

// ===== GET CLAIMS SORTED BY DISTANCE FROM PLAYER =====
export function getClaimsSortedByDistance(playerSectorX, playerSectorY) {
    try {
        const claims = getClaimedPlanets();
        
        // Calculate distance for each claim
        const claimsWithDistance = claims.map(claim => {
            const dx = Math.abs(playerSectorX - (claim.sectorX || 30));
            const dy = Math.abs(playerSectorY - (claim.sectorY || 40));
            const sectorDistance = Math.sqrt(dx * dx + dy * dy);
            const distance = sectorDistance * 2.3; // 2.3 light years per sector unit
            
            return {
                ...claim,
                distance: parseFloat(distance.toFixed(1))
            };
        });
        
        // Sort by distance (closest first)
        return claimsWithDistance.sort((a, b) => a.distance - b.distance);
        
    } catch (error) {
        console.error('Error sorting claims by distance:', error);
        return [];
    }
}

// ===== GET CSS CLASS FOR PLANET =====
export function getPlanetCssClass(status) {
    if (!status.explored) {
        return 'planet-unexplored';
    }
    
    if (status.fullyExplored) {
        return 'planet-complete';
    }
    
    if (status.claimed) {
        return 'planet-claimed';
    }
    
    switch(status.highestRarity) {
        case RARITY_LEVELS.COMMON:
            return 'planet-common';
        case RARITY_LEVELS.UNCOMMON:
            return 'planet-uncommon';
        case RARITY_LEVELS.RARE:
            return 'planet-rare';
        case RARITY_LEVELS.VERY_RARE:
            return 'planet-very-rare';
        case RARITY_LEVELS.LEGENDARY:
            return 'planet-legendary';
        default:
            return 'planet-explored';
    }
}

// ===== GET LABEL FOR PLANET (including ??? for unexplored) =====
export function getPlanetLabel(planetName, status) {
    if (!status.explored) {
        return `${planetName} ???`;
    }
    
    if (status.claimed) {
        return `${planetName} 👑`;
    }
    
    return planetName;
}

// ===== CHECK IF PLANET IS READY TO CLAIM =====
// UPDATED: Only Very Rare or Legendary planets can be claimed
export function isPlanetReadyToClaim(status) {
    // Must be fully explored
    if (!status.fullyExplored) return false;
    
    // Must not already be claimed
    if (status.claimed) return false;
    
    // Only Very Rare or Legendary planets can be claimed
    const claimableRarities = ['very-rare', 'legendary'];
    return claimableRarities.includes(status.highestRarity);
}

// ===== CALCULATE MINING FEE =====
export function calculateMiningFee(extractedQuantity, feePercent) {
    // Fee calculation: floor(extracted quantity × fee% / 100)
    // Round up to ensure at least 1 unit fee if any is due
    const rawFee = (extractedQuantity * feePercent) / 100;
    const feePaid = Math.ceil(rawFee);
    const playerGets = Math.max(0, extractedQuantity - feePaid);
    
    return {
        feePaid,
        playerGets,
        rawFee
    };
}

// ===== RECORD MINING ACTIVITY =====
export async function recordMiningActivity(transactionData) {
    try {
        // Get existing history
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIM_HISTORY) || '[]');
        
        // Add timestamp if not present
        if (!transactionData.timestamp) {
            transactionData.timestamp = Date.now();
            transactionData.date = new Date().toISOString();
        }
        
        // Add to history
        history.push({
            type: 'mining_fee',
            ...transactionData
        });
        
        // Keep only last 1000 transactions
        if (history.length > 1000) {
            history.shift();
        }
        
        localStorage.setItem(STORAGE_KEYS.CLAIM_HISTORY, JSON.stringify(history));
        
        // Update planet earnings
        await addMiningEarnings(
            transactionData.planetName,
            transactionData.feeValue,
            transactionData.minerId
        );
        
        return true;
        
    } catch (error) {
        console.error('Error recording mining activity:', error);
        return false;
    }
}

// ===== GET MINING HISTORY FOR A PLANET =====
export function getPlanetMiningHistory(planetName, limit = 50) {
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIM_HISTORY) || '[]');
        
        return history
            .filter(h => h.planetName === planetName)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
        
    } catch (error) {
        console.error(`Error getting mining history for planet ${planetName}:`, error);
        return [];
    }
}

// ===== GET MINING HISTORY FOR A PLAYER (as miner) =====
export function getPlayerMiningHistory(playerId, limit = 50) {
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIM_HISTORY) || '[]');
        
        return history
            .filter(h => h.minerId === playerId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
        
    } catch (error) {
        console.error(`Error getting mining history for player ${playerId}:`, error);
        return [];
    }
}

// ===== GET EARNINGS HISTORY FOR A PLAYER (as owner) =====
export function getOwnerEarningsHistory(playerId, limit = 50) {
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIM_HISTORY) || '[]');
        
        return history
            .filter(h => h.ownerId === playerId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
        
    } catch (error) {
        console.error(`Error getting earnings history for owner ${playerId}:`, error);
        return [];
    }
}

// ===== UPDATE FEE PERCENTAGE FOR A CLAIMED PLANET =====
export async function updatePlanetFee(planetName, newFeePercent) {
    try {
        // Validate fee range (1-20%)
        if (newFeePercent < 1 || newFeePercent > 20) {
            console.error('Fee must be between 1% and 20%');
            return false;
        }
        
        return await updatePlanetClaim(planetName, { currentFee: newFeePercent });
        
    } catch (error) {
        console.error(`Error updating fee for planet ${planetName}:`, error);
        return false;
    }
}

// ===== GET PLAYER STATISTICS =====
export async function getPlayerClaimStats(playerId) {
    try {
        const claims = getPlayerClaims(playerId);
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIM_HISTORY) || '[]');
        const earnings = history.filter(h => h.ownerId === playerId);
        
        // Calculate statistics
        const totalEarned = earnings.reduce((sum, h) => sum + (h.feeValue || 0), 0);
        const totalMiners = new Set(earnings.map(h => h.minerId)).size;
        const totalTransactions = earnings.length;
        
        // Find most profitable planet
        const planetEarnings = {};
        earnings.forEach(h => {
            planetEarnings[h.planetName] = (planetEarnings[h.planetName] || 0) + (h.feeValue || 0);
        });
        
        let mostProfitablePlanet = null;
        let mostProfitableAmount = 0;
        
        for (const [planet, amount] of Object.entries(planetEarnings)) {
            if (amount > mostProfitableAmount) {
                mostProfitableAmount = amount;
                mostProfitablePlanet = planet;
            }
        }
        
        return {
            planetsOwned: claims.length,
            totalEarned,
            totalMiners,
            totalTransactions,
            mostProfitablePlanet,
            mostProfitableAmount,
            averagePerPlanet: claims.length > 0 ? totalEarned / claims.length : 0,
            lastActivity: earnings.length > 0 ? earnings[0].timestamp : null
        };
        
    } catch (error) {
        console.error(`Error getting claim stats for player ${playerId}:`, error);
        return {
            planetsOwned: 0,
            totalEarned: 0,
            totalMiners: 0,
            totalTransactions: 0,
            mostProfitablePlanet: null,
            mostProfitableAmount: 0,
            averagePerPlanet: 0,
            lastActivity: null
        };
    }
}

// ===== RESET PLANET STATUS (for debugging) =====
export function resetPlanetStatus(planetName) {
    try {
        // Remove from detailed claims
        const planetSaved = localStorage.getItem(STORAGE_KEYS.PLANET_CLAIMS);
        if (planetSaved) {
            const planetClaims = JSON.parse(planetSaved);
            delete planetClaims[planetName];
            localStorage.setItem(STORAGE_KEYS.PLANET_CLAIMS, JSON.stringify(planetClaims));
        }
        
        // Remove from player claims index
        const playerSaved = localStorage.getItem(STORAGE_KEYS.PLAYER_CLAIMS);
        if (playerSaved) {
            const playerClaims = JSON.parse(playerSaved);
            for (const playerId in playerClaims) {
                const index = playerClaims[playerId].indexOf(planetName);
                if (index !== -1) {
                    playerClaims[playerId].splice(index, 1);
                }
            }
            localStorage.setItem(STORAGE_KEYS.PLAYER_CLAIMS, JSON.stringify(playerClaims));
        }
        
        // Remove from legacy claimed planets
        const legacySaved = localStorage.getItem(STORAGE_KEYS.CLAIMED_PLANETS);
        if (legacySaved) {
            const claimed = JSON.parse(legacySaved);
            const index = claimed.indexOf(planetName);
            if (index !== -1) {
                claimed.splice(index, 1);
                localStorage.setItem(STORAGE_KEYS.CLAIMED_PLANETS, JSON.stringify(claimed));
            }
        }
        
        return true;
        
    } catch (error) {
        console.error(`Error resetting planet ${planetName}:`, error);
        return false;
    }
}

// ===== DISCOVERY HISTORY FUNCTIONS (NEW) =====

/**
 * Get planet discovery history from storage
 * @param {string} planetName - Name of the planet
 * @returns {Promise<Array>} Array of discovery records
 */
export async function getPlanetDiscoveryHistory(planetName) {
    try {
        if (typeof window.getDiscoveryHistory === 'function') {
            return await window.getDiscoveryHistory(planetName);
        }
        return [];
    } catch (error) {
        console.error('Error getting planet discovery history:', error);
        return [];
    }
}

/**
 * Get formatted planet discovery history for display
 * @param {string} planetName - Name of the planet
 * @returns {Promise<Array>} Formatted discovery records
 */
export async function getFormattedPlanetDiscoveryHistory(planetName) {
    try {
        const history = await getPlanetDiscoveryHistory(planetName);
        
        return history.map(record => ({
            playerName: record.playerName,
            date: record.date,
            timestamp: record.timestamp,
            isFirstDiscovery: record.isFirstDiscovery,
            planetTier: record.planetTier,
            formattedDate: new Date(record.timestamp).toLocaleDateString()
        }));
        
    } catch (error) {
        console.error('Error getting formatted planet discovery history:', error);
        return [];
    }
}

/**
 * Get first discoverer of a planet
 * @param {string} planetName - Name of the planet
 * @returns {Promise<Object|null>} First discoverer info
 */
export async function getFirstDiscoverer(planetName) {
    try {
        const history = await getPlanetDiscoveryHistory(planetName);
        if (history.length === 0) return null;
        
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

/**
 * Add a discovery record for a planet
 * @param {string} planetName - Name of the planet
 * @param {string} playerId - Player ID
 * @param {string} playerName - Player name
 * @param {number} planetTier - Planet tier
 * @returns {Promise<boolean>} Success status
 */
export async function addPlanetDiscoveryRecord(planetName, playerId, playerName, planetTier) {
    try {
        if (typeof window.addToDiscoveryHistory === 'function') {
            return await window.addToDiscoveryHistory(planetName, playerId, playerName, planetTier);
        }
        return false;
    } catch (error) {
        console.error('Error adding planet discovery record:', error);
        return false;
    }
}

// ===== RIGHTS STATUS FUNCTIONS (NEW) =====

/**
 * Get rights status for a planet (active, expiring, expired, available)
 * @param {string} planetName - Name of the planet
 * @returns {Promise<Object>} Rights status object
 */
export async function getPlanetRightsStatus(planetName) {
    try {
        const claim = await getPlanetClaim(planetName);
        
        if (!claim) {
            return {
                status: 'available',
                owner: null,
                ownerId: null,
                expiresAt: null,
                daysRemaining: 0,
                canRenew: false,
                renewalCost: 0
            };
        }
        
        const expiresAt = claim.claimedAt + (30 * 24 * 60 * 60 * 1000);
        const now = Date.now();
        const daysRemaining = Math.max(0, Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000)));
        
        let status = 'active';
        if (daysRemaining <= 0) {
            status = 'expired';
        } else if (daysRemaining <= 3) {
            status = 'expiring_soon';
        }
        
        return {
            status: status,
            owner: claim.ownerName,
            ownerId: claim.ownerId,
            expiresAt: expiresAt,
            daysRemaining: daysRemaining,
            canRenew: status === 'active' || status === 'expiring_soon',
            renewalCost: claim.baseFee * 0.5
        };
        
    } catch (error) {
        console.error('Error getting planet rights status:', error);
        return {
            status: 'available',
            owner: null,
            ownerId: null,
            expiresAt: null,
            daysRemaining: 0,
            canRenew: false,
            renewalCost: 0
        };
    }
}

// ===== EXPORT ALL =====
export default {
    RARITY_LEVELS,
    RARITY_COLORS,
    RARITY_CLASSES,
    FEE_CONFIG,
    isRarityHigher,
    getHighestRarity,
    getPlanetStatus,
    getPlanetsStatus,
    updatePlanetStatusAfterDiscovery,
    claimPlanet,
    getPlanetClaim,
    updatePlanetClaim,
    addMiningEarnings,
    isPlanetClaimed,
    getClaimedPlanets,
    getPlayerClaims,
    getClaimsSortedByDistance,
    getPlanetCssClass,
    getPlanetLabel,
    isPlanetReadyToClaim,
    calculateMiningFee,
    recordMiningActivity,
    getPlanetMiningHistory,
    getPlayerMiningHistory,
    getOwnerEarningsHistory,
    updatePlanetFee,
    getPlayerClaimStats,
    resetPlanetStatus,
    // New Discovery History Functions
    getPlanetDiscoveryHistory,
    getFormattedPlanetDiscoveryHistory,
    getFirstDiscoverer,
    addPlanetDiscoveryRecord,
    // New Rights Status Functions
    getPlanetRightsStatus
};

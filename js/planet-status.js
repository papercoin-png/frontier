// js/planet-status.js
// Planet exploration status tracking for Voidfarer
// Handles determining planet colors based on highest rarity found
// Tracks completion status for the calm, minimalist exploration system

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
    CLAIMED_PLANETS: 'voidfarer_claimed_planets'
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
        
        if (!locations || locations.length === 0) {
            return {
                explored: false,
                highestRarity: null,
                resourcesFound: [],
                resourceCount: 0,
                fullyExplored: false,
                claimed: false,
                color: null,
                cssClass: 'unexplored'
            };
        }
        
        // Filter locations for this planet
        const planetLocations = locations.filter(loc => loc.planet === planetName);
        
        if (planetLocations.length === 0) {
            return {
                explored: false,
                highestRarity: null,
                resourcesFound: [],
                resourceCount: 0,
                fullyExplored: false,
                claimed: false,
                color: null,
                cssClass: 'unexplored'
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
        
        // Get highest rarity
        const highestRarity = getHighestRarity(raritiesFound);
        
        // Check if fully explored (all 4 resources found)
        // Note: This assumes planets have 4 resources max
        // In a real implementation, you might want to get the planet's total resources
        const totalResources = 4; // Default max
        const fullyExplored = resourcesFound.length >= totalResources;
        
        // Check if claimed
        const claimed = await isPlanetClaimed(planetName);
        
        return {
            explored: true,
            highestRarity: highestRarity,
            resourcesFound: resourcesFound,
            resourceCount: resourcesFound.length,
            totalResources: totalResources,
            fullyExplored: fullyExplored,
            claimed: claimed,
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
    
    // You could dispatch a custom event for UI to update
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('planet-status-updated', {
            detail: { planetName, elementName, rarity }
        });
        window.dispatchEvent(event);
    }
    
    return true;
}

// ===== CLAIM PLANET =====
export async function claimPlanet(planetName) {
    try {
        // Get existing claimed planets
        let claimed = [];
        const saved = localStorage.getItem(STORAGE_KEYS.CLAIMED_PLANETS);
        
        if (saved) {
            try {
                claimed = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse claimed planets:', e);
            }
        }
        
        // Add if not already claimed
        if (!claimed.includes(planetName)) {
            claimed.push(planetName);
            localStorage.setItem(STORAGE_KEYS.CLAIMED_PLANETS, JSON.stringify(claimed));
        }
        
        console.log(`Planet ${planetName} claimed!`);
        
        // Dispatch event for UI update
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('planet-claimed', {
                detail: { planetName }
            });
            window.dispatchEvent(event);
        }
        
        return true;
        
    } catch (error) {
        console.error(`Error claiming planet ${planetName}:`, error);
        return false;
    }
}

// ===== CHECK IF PLANET IS CLAIMED =====
export async function isPlanetClaimed(planetName) {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.CLAIMED_PLANETS);
        
        if (!saved) return false;
        
        const claimed = JSON.parse(saved);
        return claimed.includes(planetName);
        
    } catch (error) {
        console.error(`Error checking if planet ${planetName} is claimed:`, error);
        return false;
    }
}

// ===== GET ALL CLAIMED PLANETS =====
export function getClaimedPlanets() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.CLAIMED_PLANETS);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error getting claimed planets:', error);
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
    return planetName;
}

// ===== CHECK IF PLANET IS READY TO CLAIM =====
export function isPlanetReadyToClaim(status) {
    return status.explored && status.fullyExplored && !status.claimed;
}

// ===== RESET PLANET STATUS (for debugging) =====
export function resetPlanetStatus(planetName) {
    // This doesn't delete from journal, just removes claim status
    try {
        const claimed = getClaimedPlanets();
        const index = claimed.indexOf(planetName);
        
        if (index !== -1) {
            claimed.splice(index, 1);
            localStorage.setItem(STORAGE_KEYS.CLAIMED_PLANETS, JSON.stringify(claimed));
        }
        
        return true;
        
    } catch (error) {
        console.error(`Error resetting planet ${planetName}:`, error);
        return false;
    }
}

// ===== EXPORT ALL =====
export default {
    RARITY_LEVELS,
    RARITY_COLORS,
    RARITY_CLASSES,
    isRarityHigher,
    getHighestRarity,
    getPlanetStatus,
    getPlanetsStatus,
    updatePlanetStatusAfterDiscovery,
    claimPlanet,
    isPlanetClaimed,
    getClaimedPlanets,
    getPlanetCssClass,
    getPlanetLabel,
    isPlanetReadyToClaim,
    resetPlanetStatus
};

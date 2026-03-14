// js/location-utils.js
// Shared location utilities for all screens
// SIMPLIFIED: Only tracks the current planet name for journal entries

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    CURRENT_PLANET: 'voidfarer_current_planet',
    CURRENT_PLANET_TYPE: 'voidfarer_current_planet_type',
    CURRENT_PLANET_RESOURCES: 'voidfarer_current_planet_resources',
    CURRENT_STAR: 'voidfarer_current_star',
    CURRENT_STAR_SECTOR: 'voidfarer_current_starSector',
    CURRENT_SECTOR: 'voidfarer_current_sector',
    CURRENT_REGION: 'voidfarer_current_region'
};

/**
 * Get the current planet name where the player is located
 * This is the only location data needed for journal entries
 * @returns {string} Current planet name or 'Unknown' if not set
 */
export function getCurrentPlanetName() {
    try {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Unknown';
    } catch (error) {
        console.error('Error getting current planet name:', error);
        return 'Unknown';
    }
}

/**
 * Get the current planet type
 * @returns {string} Current planet type or 'unknown' if not set
 */
export function getCurrentPlanetType() {
    try {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_TYPE) || 'unknown';
    } catch (error) {
        console.error('Error getting current planet type:', error);
        return 'unknown';
    }
}

/**
 * Get the current planet resources
 * @returns {Array} Array of resource names or empty array if not set
 */
export function getCurrentPlanetResources() {
    try {
        const resources = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES);
        return resources ? JSON.parse(resources) : [];
    } catch (error) {
        console.error('Error getting current planet resources:', error);
        return [];
    }
}

/**
 * Get the current star name
 * @returns {string} Current star name or 'Unknown' if not set
 */
export function getCurrentStarName() {
    try {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR) || 'Unknown';
    } catch (error) {
        console.error('Error getting current star name:', error);
        return 'Unknown';
    }
}

/**
 * Get the current star sector (nebula) name
 * @returns {string} Current star sector name or 'Unknown' if not set
 */
export function getCurrentStarSector() {
    try {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_SECTOR) || 'Unknown';
    } catch (error) {
        console.error('Error getting current star sector:', error);
        return 'Unknown';
    }
}

/**
 * Get the current sector ID
 * @returns {string} Current sector ID or 'B2' if not set
 */
export function getCurrentSector() {
    try {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR) || 'B2';
    } catch (error) {
        console.error('Error getting current sector:', error);
        return 'B2';
    }
}

/**
 * Get the current region name
 * @returns {string} Current region name or 'Orion Arm' if not set
 */
export function getCurrentRegion() {
    try {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_REGION) || 'Orion Arm';
    } catch (error) {
        console.error('Error getting current region:', error);
        return 'Orion Arm';
    }
}

/**
 * Set the current planet (called when landing on a new planet)
 * @param {string} planetName - Name of the planet
 * @param {string} planetType - Type of planet (lush, barren, etc.)
 * @param {Array} resources - Array of resource names available on the planet
 */
export function setCurrentPlanet(planetName, planetType, resources = []) {
    try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, planetName);
        localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_TYPE, planetType);
        localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES, JSON.stringify(resources));
        
        console.log(`📍 Location updated: Now on planet ${planetName} (${planetType})`);
    } catch (error) {
        console.error('Error setting current planet:', error);
    }
}

/**
 * Set the current star (called when entering a new star system)
 * @param {string} starName - Name of the star
 * @param {string} starType - Type of star
 */
export function setCurrentStar(starName, starType) {
    try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_STAR, starName);
        console.log(`📍 Location updated: Now in ${starName} system`);
    } catch (error) {
        console.error('Error setting current star:', error);
    }
}

/**
 * Set the current star sector (called when entering a new nebula/star sector)
 * @param {string} starSectorName - Name of the star sector
 * @param {string} starSectorType - Type of star sector
 */
export function setCurrentStarSector(starSectorName, starSectorType) {
    try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_SECTOR, starSectorName);
        console.log(`📍 Location updated: Now in ${starSectorName} star sector`);
    } catch (error) {
        console.error('Error setting current star sector:', error);
    }
}

/**
 * Set the current galactic sector
 * @param {string} sectorId - Sector ID (e.g., 'B2')
 * @param {string} regionName - Region name (e.g., 'Orion Arm')
 */
export function setCurrentGalacticSector(sectorId, regionName) {
    try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR, sectorId);
        localStorage.setItem(STORAGE_KEYS.CURRENT_REGION, regionName);
        console.log(`📍 Location updated: Now in sector ${sectorId} (${regionName})`);
    } catch (error) {
        console.error('Error setting current galactic sector:', error);
    }
}

/**
 * Update location after warp completion
 * @param {Object} warpData - Warp data object containing destination information
 */
export function updateLocationFromWarp(warpData) {
    try {
        if (!warpData) return;
        
        // Update galactic sector
        if (warpData.destSector) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR, warpData.destSector);
        }
        if (warpData.destRegion) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_REGION, warpData.destRegion);
        }
        
        // Update star sector
        if (warpData.destStarSector) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_SECTOR, warpData.destStarSector);
        }
        
        // Update star
        if (warpData.destStar) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_STAR, warpData.destStar);
        }
        
        // Update planet (this is the most important for journal entries)
        if (warpData.destPlanet) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, warpData.destPlanet);
            
            if (warpData.destPlanetType) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_TYPE, warpData.destPlanetType);
            }
            
            if (warpData.destPlanetResources) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES, 
                    JSON.stringify(warpData.destPlanetResources));
            }
            
            console.log(`📍 Warp complete: Arrived at planet ${warpData.destPlanet}`);
        }
    } catch (error) {
        console.error('Error updating location from warp:', error);
    }
}

/**
 * Get simple location object containing just the planet name
 * This is the only data needed for journal entries
 * @returns {Object} Simple location object with planet name
 */
export function getSimpleLocation() {
    return {
        planet: getCurrentPlanetName()
    };
}

/**
 * Get complete location object (for navigation and display)
 * @returns {Object} Complete location object with all hierarchy levels
 */
export function getCompleteLocation() {
    return {
        planet: getCurrentPlanetName(),
        planetType: getCurrentPlanetType(),
        planetResources: getCurrentPlanetResources(),
        star: getCurrentStarName(),
        starSector: getCurrentStarSector(),
        sector: getCurrentSector(),
        region: getCurrentRegion(),
        
        // Helper method to get full path for display
        getFullPath() {
            return `${this.region} › ${this.starSector} › ${this.star} › ${this.planet}`;
        }
    };
}

/**
 * Clear all location data (used when resetting game)
 */
export function clearAllLocationData() {
    try {
        const keys = [
            STORAGE_KEYS.CURRENT_PLANET,
            STORAGE_KEYS.CURRENT_PLANET_TYPE,
            STORAGE_KEYS.CURRENT_PLANET_RESOURCES,
            STORAGE_KEYS.CURRENT_STAR,
            STORAGE_KEYS.CURRENT_STAR_SECTOR,
            STORAGE_KEYS.CURRENT_SECTOR,
            STORAGE_KEYS.CURRENT_REGION
        ];
        
        keys.forEach(key => localStorage.removeItem(key));
        console.log('📍 All location data cleared');
    } catch (error) {
        console.error('Error clearing location data:', error);
    }
}

// ===== EXPORT ALL FUNCTIONS =====
export default {
    getCurrentPlanetName,
    getCurrentPlanetType,
    getCurrentPlanetResources,
    getCurrentStarName,
    getCurrentStarSector,
    getCurrentSector,
    getCurrentRegion,
    setCurrentPlanet,
    setCurrentStar,
    setCurrentStarSector,
    setCurrentGalacticSector,
    updateLocationFromWarp,
    getSimpleLocation,
    getCompleteLocation,
    clearAllLocationData
};

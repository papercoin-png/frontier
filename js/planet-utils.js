// js/planet-utils.js
// Shared planet generation utilities for Voidfarer
// Handles planet types, resource generation, and planet properties
// UPDATED: Tier-based resource generation using corrected element classification from galaxy-data.js
// UPDATED: Exactly 4 elements per planet, filtered by galaxy tier
// UPDATED: Gradual element progression - Legendaries only appear at Tier 8+

import { 
    TIER_1_ELEMENTS, TIER_2_ELEMENTS, TIER_3_ELEMENTS, TIER_4_ELEMENTS, TIER_5_ELEMENTS,
    getElementsForTier, getTierByDistance, TIERS 
} from './galaxy-data.js';

// ===== PLANET TYPE DEFINITIONS =====
export const PLANET_TYPES = {
    SCORCHED: 'scorched',
    BARREN: 'barren',
    LUSH: 'lush',
    FROZEN: 'frozen',
    GAS: 'gas',
    OCEANIC: 'oceanic',
    TOXIC: 'toxic',
    ASTEROID: 'asteroid'
};

// ===== PLANET TYPE DATA =====
export const PLANET_TYPE_DATA = {
    [PLANET_TYPES.SCORCHED]: { 
        name: 'Scorched', 
        icon: '🔥', 
        prob: 0.12, 
        temp: '450°C', 
        atmos: 'Toxic', 
        gravity: '1.2g', 
        landable: true,
        color: '#ff6b6b',
        description: 'A blistering world with volcanic activity and molten rivers.'
    },
    [PLANET_TYPES.BARREN]: { 
        name: 'Barren', 
        icon: '🪨', 
        prob: 0.15, 
        temp: '-50°C', 
        atmos: 'Thin', 
        gravity: '0.8g', 
        landable: true,
        color: '#8b7355',
        description: 'A rocky world with little atmosphere or water.'
    },
    [PLANET_TYPES.LUSH]: { 
        name: 'Lush', 
        icon: '🌱', 
        prob: 0.10, 
        temp: '22°C', 
        atmos: 'Breathable', 
        gravity: '0.9g', 
        landable: true,
        color: '#4affaa',
        description: 'Earth-like world with abundant plant life and water.'
    },
    [PLANET_TYPES.FROZEN]: { 
        name: 'Frozen', 
        icon: '❄️', 
        prob: 0.12, 
        temp: '-80°C', 
        atmos: 'Thin', 
        gravity: '0.7g', 
        landable: true,
        color: '#b0e0ff',
        description: 'An ice world with frozen oceans and extreme cold.'
    },
    [PLANET_TYPES.GAS]: { 
        name: 'Gas Giant', 
        icon: '🌪️', 
        prob: 0.15, 
        temp: '-120°C', 
        atmos: 'Dense', 
        gravity: '2.1g', 
        landable: false,
        color: '#e0b0ff',
        description: 'A massive planet with thick atmosphere and no solid surface.'
    },
    [PLANET_TYPES.OCEANIC]: { 
        name: 'Oceanic', 
        icon: '💧', 
        prob: 0.10, 
        temp: '15°C', 
        atmos: 'Breathable', 
        gravity: '1.0g', 
        landable: true,
        color: '#4aa0ff',
        description: 'A water world with global oceans and rare island chains.'
    },
    [PLANET_TYPES.TOXIC]: { 
        name: 'Toxic', 
        icon: '☣️', 
        prob: 0.08, 
        temp: '120°C', 
        atmos: 'Corrosive', 
        gravity: '1.1g', 
        landable: true,
        color: '#b0ff4a',
        description: 'A hostile world with acidic atmosphere and poisonous environment.'
    },
    [PLANET_TYPES.ASTEROID]: { 
        name: 'Asteroid Field', 
        icon: '🪐', 
        prob: 0.08, 
        temp: '-100°C', 
        atmos: 'None', 
        gravity: '0.1g', 
        landable: true,
        color: '#c0c0c0',
        description: 'A dense cluster of rocky bodies and rare mineral deposits.'
    }
};

// ===== RESOURCE POOLS BY PLANET TYPE =====
// Base pools - will be filtered by galaxy tier during generation
export const RESOURCE_POOLS = {
    [PLANET_TYPES.SCORCHED]: [
        'Iron', 'Sulfur', 'Copper', 'Gold', 'Uranium', 'Platinum', 'Lead', 'Mercury',
        'Nickel', 'Cobalt', 'Chromium', 'Manganese', 'Molybdenum', 'Tungsten', 'Rhenium'
    ],
    [PLANET_TYPES.BARREN]: [
        'Iron', 'Silicon', 'Aluminum', 'Titanium', 'Nickel', 'Magnesium', 'Calcium', 'Lead',
        'Sodium', 'Potassium', 'Beryllium', 'Boron', 'Lithium', 'Scandium', 'Vanadium'
    ],
    [PLANET_TYPES.LUSH]: [
        'Carbon', 'Oxygen', 'Hydrogen', 'Nitrogen', 'Calcium', 'Potassium', 'Phosphorus', 'Sulfur',
        'Iron', 'Magnesium', 'Zinc', 'Copper', 'Manganese', 'Boron', 'Molybdenum'
    ],
    [PLANET_TYPES.FROZEN]: [
        'Hydrogen', 'Helium', 'Oxygen', 'Carbon', 'Nitrogen', 'Argon', 'Neon', 'Krypton',
        'Xenon', 'Methane', 'Ammonia', 'Water', 'Deuterium', 'Tritium', 'Helium-3'
    ],
    [PLANET_TYPES.GAS]: [
        'Hydrogen', 'Helium', 'Methane', 'Ammonia', 'Neon', 'Argon', 'Krypton', 'Xenon',
        'Deuterium', 'Tritium', 'Helium-3', 'Radon', 'Sulfur', 'Phosphorus'
    ],
    [PLANET_TYPES.OCEANIC]: [
        'Hydrogen', 'Oxygen', 'Sodium', 'Chlorine', 'Magnesium', 'Calcium', 'Potassium', 'Bromine',
        'Carbon', 'Nitrogen', 'Sulfur', 'Gold', 'Platinum', 'Lithium', 'Strontium'
    ],
    [PLANET_TYPES.TOXIC]: [
        'Sulfur', 'Chlorine', 'Fluorine', 'Mercury', 'Arsenic', 'Lead', 'Cadmium', 'Uranium',
        'Selenium', 'Bromine', 'Iodine', 'Phosphorus', 'Antimony', 'Bismuth', 'Thallium'
    ],
    [PLANET_TYPES.ASTEROID]: [
        'Iron', 'Nickel', 'Cobalt', 'Platinum', 'Palladium', 'Rhodium', 'Iridium', 'Ruthenium',
        'Gold', 'Silver', 'Osmium', 'Tungsten', 'Rhenium', 'Uranium', 'Thorium'
    ]
};

// ===== UTILITY FUNCTIONS =====
export function seededRandom(seed, index = 0) {
    const x = Math.sin(seed * (index + 1)) * 10000;
    return x - Math.floor(x);
}

export function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export function seededRandomRange(seed, index, min, max) {
    return Math.floor(seededRandom(seed, index) * (max - min + 1)) + min;
}

// ===== PLANET TYPE SELECTION =====
export function getRandomPlanetType(seed, index = 0) {
    const rand = seededRandom(seed, index);
    let cumulative = 0;
    const types = Object.values(PLANET_TYPES);
    
    for (const type of types) {
        cumulative += PLANET_TYPE_DATA[type].prob;
        if (rand < cumulative) {
            return type;
        }
    }
    return PLANET_TYPES.BARREN;
}

// ===== TIER-BASED RESOURCE GENERATION =====
/**
 * Get allowed elements for a given tier
 * Gradual progression: Legendaries only appear at Tier 8+
 * @param {number} galaxyTier - Galaxy tier (1-10)
 * @returns {Array} Array of allowed element names
 */
function getAllowedElementsForTier(galaxyTier) {
    const tier = Math.min(Math.max(galaxyTier, 1), 10);
    
    // Tier 1: Only Common
    if (tier === 1) {
        return [...TIER_1_ELEMENTS];
    }
    
    // Tier 2: Common + Uncommon
    if (tier === 2) {
        return [...TIER_1_ELEMENTS, ...TIER_2_ELEMENTS];
    }
    
    // Tier 3: Common + Uncommon + Rare
    if (tier === 3) {
        return [...TIER_1_ELEMENTS, ...TIER_2_ELEMENTS, ...TIER_3_ELEMENTS];
    }
    
    // Tier 4: Common + Uncommon + Rare + Very Rare
    if (tier === 4) {
        return [...TIER_1_ELEMENTS, ...TIER_2_ELEMENTS, ...TIER_3_ELEMENTS, ...TIER_4_ELEMENTS];
    }
    
    // Tier 5: Common + Uncommon + Rare + Very Rare (NO Legendary)
    if (tier === 5) {
        return [...TIER_1_ELEMENTS, ...TIER_2_ELEMENTS, ...TIER_3_ELEMENTS, ...TIER_4_ELEMENTS];
    }
    
    // Tier 6: Uncommon + Rare + Very Rare (Common removed)
    if (tier === 6) {
        return [...TIER_2_ELEMENTS, ...TIER_3_ELEMENTS, ...TIER_4_ELEMENTS];
    }
    
    // Tier 7: Rare + Very Rare (Uncommon removed)
    if (tier === 7) {
        return [...TIER_3_ELEMENTS, ...TIER_4_ELEMENTS];
    }
    
    // Tier 8: Very Rare + Legendary (Rare removed, Legendary appears)
    if (tier === 8) {
        return [...TIER_4_ELEMENTS, ...TIER_5_ELEMENTS];
    }
    
    // Tier 9: Very Rare + Legendary (same as Tier 8)
    if (tier === 9) {
        return [...TIER_4_ELEMENTS, ...TIER_5_ELEMENTS];
    }
    
    // Tier 10: Legendary only
    if (tier === 10) {
        return [...TIER_5_ELEMENTS];
    }
    
    return [...TIER_1_ELEMENTS];
}

/**
 * Generate exactly 4 resources for a planet based on galaxy tier
 * @param {number} seed - Generation seed
 * @param {string} planetType - Planet type
 * @param {number} galaxyTier - Galaxy tier (1-10)
 * @returns {Array} Array of exactly 4 element names
 */
export function generatePlanetResources(seed, planetType, galaxyTier = 1) {
    const pool = RESOURCE_POOLS[planetType] || RESOURCE_POOLS[PLANET_TYPES.BARREN];
    const tierNum = Math.min(Math.max(galaxyTier, 1), 10);
    
    // Get allowed elements for this tier
    const allowedElements = getAllowedElementsForTier(tierNum);
    
    // Filter pool to only allowed elements
    let availablePool = pool.filter(element => allowedElements.includes(element));
    
    // For Tier 1, double-check no Tier 2+ elements slip through
    if (tierNum === 1) {
        availablePool = availablePool.filter(element => TIER_1_ELEMENTS.includes(element));
    }
    
    // If still empty, use hardcoded fallback
    if (availablePool.length === 0) {
        if (tierNum === 1) {
            availablePool = ['Hydrogen', 'Helium', 'Carbon', 'Oxygen', 'Nitrogen', 'Neon', 'Sodium', 'Aluminum', 'Silicon', 'Sulfur', 'Chlorine', 'Argon'];
        } else if (tierNum === 10) {
            availablePool = [...TIER_5_ELEMENTS];
        } else {
            availablePool = [...TIER_1_ELEMENTS];
            if (tierNum >= 2) availablePool.push(...TIER_2_ELEMENTS.slice(0, 10));
            if (tierNum >= 3) availablePool.push(...TIER_3_ELEMENTS.slice(0, 5));
            if (tierNum >= 4) availablePool.push(...TIER_4_ELEMENTS.slice(0, 3));
        }
    }
    
    // Remove duplicates
    availablePool = [...new Set(availablePool)];
    
    // Shuffle the pool using seeded random
    for (let i = availablePool.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed, i + 100) * (i + 1));
        [availablePool[i], availablePool[j]] = [availablePool[j], availablePool[i]];
    }
    
    const resources = [];
    const targetCount = 4;
    
    // Take first targetCount elements
    for (let i = 0; i < Math.min(targetCount, availablePool.length); i++) {
        resources.push(availablePool[i]);
    }
    
    // Ensure we have exactly 4 resources (no duplicates)
    if (resources.length < targetCount) {
        let fallbackPool;
        if (tierNum === 10) {
            fallbackPool = TIER_5_ELEMENTS;
        } else if (tierNum === 9 || tierNum === 8) {
            fallbackPool = [...TIER_4_ELEMENTS, ...TIER_5_ELEMENTS];
        } else if (tierNum === 7) {
            fallbackPool = [...TIER_3_ELEMENTS, ...TIER_4_ELEMENTS];
        } else if (tierNum === 6) {
            fallbackPool = [...TIER_2_ELEMENTS, ...TIER_3_ELEMENTS, ...TIER_4_ELEMENTS];
        } else if (tierNum === 5 || tierNum === 4) {
            fallbackPool = [...TIER_1_ELEMENTS, ...TIER_2_ELEMENTS, ...TIER_3_ELEMENTS, ...TIER_4_ELEMENTS];
        } else {
            fallbackPool = allowedElements;
        }
        
        for (const elem of fallbackPool) {
            if (!resources.includes(elem) && resources.length < targetCount) {
                resources.push(elem);
            }
        }
    }
    
    // Final verification for Tier 1: ensure no non-common elements
    if (tierNum === 1) {
        const verifiedResources = resources.filter(r => TIER_1_ELEMENTS.includes(r));
        if (verifiedResources.length === targetCount) {
            return verifiedResources;
        } else {
            // Add missing common elements
            const result = [...verifiedResources];
            for (const elem of TIER_1_ELEMENTS) {
                if (!result.includes(elem) && result.length < targetCount) {
                    result.push(elem);
                }
            }
            return result.slice(0, targetCount);
        }
    }
    
    // Ensure no duplicates in final result
    return [...new Set(resources)].slice(0, targetCount);
}

// ===== PLANET GENERATION =====
export function generatePlanet(seed, index, starType, sectorId, galaxyTier = 1) {
    const planetSeed = seed + index * 1000;
    const planetType = getRandomPlanetType(planetSeed, 0);
    const planetData = PLANET_TYPE_DATA[planetType];
    const resources = generatePlanetResources(planetSeed, planetType, galaxyTier);
    const orbitRadius = 70 + index * 40;
    const orbitSpeed = 0.002 - (index * 0.0002);
    
    return {
        index: index,
        name: '',
        type: planetType,
        typeName: planetData.name,
        icon: planetData.icon,
        temp: planetData.temp,
        atmos: planetData.atmos,
        gravity: planetData.gravity,
        landable: planetData.landable,
        color: planetData.color,
        description: planetData.description,
        resources: resources,
        seed: planetSeed,
        orbitRadius: orbitRadius,
        orbitSpeed: orbitSpeed,
        angle: seededRandom(planetSeed, 100) * Math.PI * 2,
        distanceFromStar: 0.5 + (index * 0.8),
        galaxyTier: galaxyTier
    };
}

// ===== STAR GENERATION =====
export function generateStar(seed, index, clusterName, galaxyTier = 1) {
    const starSeed = seed + index * 1000;
    
    const starTypes = [
        { type: 'main', name: 'Main Sequence', prob: 0.60, color: '#ffd700', minPlanets: 3, maxPlanets: 8, icon: '🟡' },
        { type: 'red', name: 'Red Dwarf', prob: 0.25, color: '#ff6b6b', minPlanets: 2, maxPlanets: 5, icon: '🔴' },
        { type: 'blue', name: 'Blue Giant', prob: 0.10, color: '#6ba5ff', minPlanets: 5, maxPlanets: 12, icon: '🔵' },
        { type: 'neutron', name: 'Neutron Star', prob: 0.03, color: '#ffffff', minPlanets: 0, maxPlanets: 0, icon: '💫' },
        { type: 'blackhole', name: 'Black Hole', prob: 0.02, color: '#000000', minPlanets: 0, maxPlanets: 0, icon: '⚫' }
    ];
    
    const rand = seededRandom(starSeed, 0);
    let cumulative = 0;
    let starType = starTypes[0];
    
    for (const type of starTypes) {
        cumulative += type.prob;
        if (rand < cumulative) {
            starType = type;
            break;
        }
    }
    
    let planetCount = 0;
    if (starType.maxPlanets > 0) {
        planetCount = Math.floor(seededRandom(starSeed, 1) * (starType.maxPlanets - starType.minPlanets + 1)) + starType.minPlanets;
    }
    
    const planets = [];
    for (let i = 0; i < planetCount; i++) {
        planets.push(generatePlanet(starSeed, i, starType.type, clusterName, galaxyTier));
    }
    
    return {
        index: index,
        name: '',
        type: starType.type,
        typeName: starType.name,
        color: starType.color,
        icon: starType.icon,
        planetCount: planetCount,
        planets: planets,
        seed: starSeed,
        galaxyTier: galaxyTier,
        position: {
            x: seededRandom(starSeed, 2) * 90 + 5,
            y: seededRandom(starSeed, 3) * 90 + 5
        }
    };
}

// ===== SYSTEM DATA MANAGEMENT =====
export function saveSystemData(star, planets, clusterName) {
    const systemData = {
        star: {
            name: star.name,
            type: star.type,
            typeName: star.typeName,
            color: star.color,
            icon: star.icon,
            index: star.index,
            seed: star.seed,
            galaxyTier: star.galaxyTier
        },
        planets: planets.map(p => ({ ...p, resources: p.resources || [] })),
        clusterName: clusterName,
        timestamp: Date.now()
    };
    localStorage.setItem('voidfarer_system_data', JSON.stringify(systemData));
    return systemData;
}

export function loadSystemData() {
    const saved = localStorage.getItem('voidfarer_system_data');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse system data:', e);
        }
    }
    return null;
}

export function clearSystemData() {
    localStorage.removeItem('voidfarer_system_data');
}

export function savePlanetResources(planetName, resources, galaxyTier = null) {
    const data = {
        resources: resources,
        galaxyTier: galaxyTier,
        timestamp: Date.now()
    };
    localStorage.setItem(`voidfarer_planet_resources_${planetName}`, JSON.stringify(data));
}

export function loadPlanetResources(planetName) {
    const saved = localStorage.getItem(`voidfarer_planet_resources_${planetName}`);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error(`Failed to parse resources for ${planetName}:`, e);
        }
    }
    return null;
}

export function validatePlanetResources(resources) {
    if (!Array.isArray(resources)) return false;
    if (resources.length !== 4) return false;
    const unique = new Set(resources);
    if (unique.size !== resources.length) return false;
    return true;
}

// ===== PLANET IMAGE SYSTEM =====
export const MAX_IMAGES_PER_BIOME = 50;
export const EXTERNAL_FALLBACK_URL = 'https://i.postimg.cc/kGb4GdB4/Ungb-A0PI.jpg';

export function getBiomeFolder(planetType) {
    const type = planetType?.toLowerCase() || '';
    
    if (type.includes('scorched') || type.includes('volcanic')) return 'scorched';
    if (type.includes('barren')) return 'barren';
    if (type.includes('lush')) return 'lush';
    if (type.includes('frozen') || type.includes('ice')) return 'frozen';
    if (type.includes('oceanic')) return 'oceanic';
    if (type.includes('toxic')) return 'toxic';
    if (type.includes('asteroid')) return 'asteroid';
    if (type.includes('gas')) return 'gasgiant';
    
    return 'fallback';
}

export function getImageIndexForPlanet(planetName, maxImages = MAX_IMAGES_PER_BIOME) {
    if (!planetName || planetName === '') return 1;
    
    let hash = 0;
    for (let i = 0; i < planetName.length; i++) {
        hash = ((hash << 5) - hash) + planetName.charCodeAt(i);
        hash |= 0;
    }
    return ((Math.abs(hash) % maxImages) + 1);
}

export function getPlanetImagePath(planetName, planetType) {
    const folder = getBiomeFolder(planetType);
    const isGasGiant = folder === 'gasgiant';
    const index = getImageIndexForPlanet(planetName, MAX_IMAGES_PER_BIOME);
    const imageNumber = String(index).padStart(2, '0');
    
    if (isGasGiant) {
        return {
            src: `assets/images/gasgiant/gasgiant_${imageNumber}.jpg`,
            isGasGiant: true,
            fallback: EXTERNAL_FALLBACK_URL,
            orientation: 'landscape',
            index: index
        };
    }
    
    return {
        src: `assets/images/${folder}/${folder}_surface_${imageNumber}.jpg`,
        isGasGiant: false,
        fallback: EXTERNAL_FALLBACK_URL,
        orientation: 'portrait',
        index: index
    };
}

export function loadPlanetImage(imagePath, fallbackPath, externalFallback = EXTERNAL_FALLBACK_URL) {
    return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
            resolve(img.src);
        };
        
        img.onerror = () => {
            if (fallbackPath) {
                const fallbackImg = new Image();
                fallbackImg.onload = () => resolve(fallbackImg.src);
                fallbackImg.onerror = () => resolve(externalFallback);
                fallbackImg.src = fallbackPath;
            } else {
                resolve(externalFallback);
            }
        };
        
        img.src = imagePath;
    });
}

export async function getAndLoadPlanetImage(planetName, planetType) {
    const pathInfo = getPlanetImagePath(planetName, planetType);
    
    try {
        const loadedUrl = await loadPlanetImage(pathInfo.src, pathInfo.fallback);
        return {
            success: true,
            url: loadedUrl,
            pathInfo: pathInfo
        };
    } catch (error) {
        return {
            success: false,
            url: EXTERNAL_FALLBACK_URL,
            pathInfo: pathInfo,
            error: error
        };
    }
}

// ===== EXPORT ALL =====
export default {
    PLANET_TYPES,
    PLANET_TYPE_DATA,
    RESOURCE_POOLS,
    MAX_IMAGES_PER_BIOME,
    EXTERNAL_FALLBACK_URL,
    seededRandom,
    seededRandomRange,
    hashString,
    getRandomPlanetType,
    getAllowedElementsForTier,
    generatePlanetResources,
    generatePlanet,
    generateStar,
    saveSystemData,
    loadSystemData,
    clearSystemData,
    savePlanetResources,
    loadPlanetResources,
    validatePlanetResources,
    getBiomeFolder,
    getImageIndexForPlanet,
    getPlanetImagePath,
    loadPlanetImage,
    getAndLoadPlanetImage
};

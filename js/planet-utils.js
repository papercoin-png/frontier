// js/planet-utils.js
// Shared planet generation utilities for Voidfarer
// Handles planet types, resource generation, and planet properties

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
// Each planet type has a pool of possible resources
// Maximum 4 resources per planet, selected from these pools
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

// ===== RARITY WEIGHTS (for resource selection) =====
export const RARITY_WEIGHTS = {
    // Common elements (found in many pools)
    'Hydrogen': 100, 'Helium': 90, 'Oxygen': 100, 'Carbon': 100, 'Nitrogen': 80,
    'Iron': 100, 'Silicon': 100, 'Aluminum': 90, 'Magnesium': 85, 'Calcium': 80,
    'Sodium': 75, 'Potassium': 75, 'Sulfur': 70, 'Phosphorus': 65, 'Chlorine': 60,
    
    // Uncommon elements
    'Titanium': 50, 'Nickel': 55, 'Copper': 50, 'Zinc': 45, 'Manganese': 40,
    'Chromium': 40, 'Vanadium': 35, 'Cobalt': 35, 'Lead': 40, 'Tin': 35,
    'Argon': 40, 'Neon': 35, 'Krypton': 30, 'Xenon': 25, 'Radon': 10,
    
    // Rare elements
    'Gold': 20, 'Silver': 25, 'Platinum': 15, 'Palladium': 12, 'Rhodium': 10,
    'Iridium': 8, 'Ruthenium': 8, 'Osmium': 7, 'Rhenium': 6, 'Tungsten': 15,
    'Uranium': 12, 'Thorium': 10, 'Gallium': 15, 'Germanium': 12, 'Arsenic': 10,
    'Selenium': 12, 'Bromine': 15, 'Rubidium': 10, 'Strontium': 12, 'Yttrium': 8,
    'Zirconium': 10, 'Niobium': 8, 'Molybdenum': 15, 'Technetium': 1, 'Ruthenium': 5,
    'Cadmium': 10, 'Indium': 8, 'Antimony': 8, 'Tellurium': 7, 'Iodine': 10,
    'Cesium': 6, 'Barium': 8, 'Lanthanum': 5, 'Cerium': 5, 'Praseodymium': 4,
    'Neodymium': 5, 'Promethium': 1, 'Samarium': 4, 'Europium': 3, 'Gadolinium': 4,
    'Terbium': 3, 'Dysprosium': 4, 'Holmium': 3, 'Erbium': 4, 'Thulium': 3,
    'Ytterbium': 4, 'Lutetium': 3, 'Hafnium': 4, 'Tantalum': 4, 'Bismuth': 6,
    
    // Legendary elements
    'Polonium': 2, 'Astatine': 1, 'Francium': 1, 'Radium': 2, 'Actinium': 2,
    'Protactinium': 2, 'Neptunium': 1, 'Plutonium': 1, 'Americium': 1, 'Curium': 1,
    'Berkelium': 1, 'Californium': 1, 'Einsteinium': 1, 'Fermium': 1, 'Mendelevium': 1,
    'Nobelium': 1, 'Lawrencium': 1, 'Rutherfordium': 1, 'Dubnium': 1, 'Seaborgium': 1,
    'Bohrium': 1, 'Hassium': 1, 'Meitnerium': 1, 'Darmstadtium': 1, 'Roentgenium': 1,
    'Copernicium': 1, 'Nihonium': 1, 'Flerovium': 1, 'Moscovium': 1, 'Livermorium': 1,
    'Tennessine': 1, 'Oganesson': 1
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

// ===== PLANET TYPE SELECTION =====
export function getRandomPlanetType(seed, index = 0) {
    const rand = seededRandom(seed, index);
    let cumulative = 0;
    
    // Get all active planet types (all are active now)
    const types = Object.values(PLANET_TYPES);
    
    for (const type of types) {
        cumulative += PLANET_TYPE_DATA[type].prob;
        if (rand < cumulative) {
            return type;
        }
    }
    
    return PLANET_TYPES.BARREN; // Default fallback
}

// ===== RESOURCE GENERATION (4 MAXIMUM) =====
export function generatePlanetResources(seed, planetType, maxResources = 4) {
    const pool = RESOURCE_POOLS[planetType] || RESOURCE_POOLS[PLANET_TYPES.BARREN];
    const resources = [];
    
    // Create a copy of the pool with weights
    const weightedPool = pool.map(resource => ({
        name: resource,
        weight: RARITY_WEIGHTS[resource] || 10
    }));
    
    // Select up to maxResources unique resources
    while (resources.length < maxResources && weightedPool.length > 0) {
        // Calculate total weight
        const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);
        
        // Weighted random selection
        let rand = seededRandom(seed, resources.length + 100) * totalWeight;
        let selectedIndex = 0;
        let cumulative = 0;
        
        for (let i = 0; i < weightedPool.length; i++) {
            cumulative += weightedPool[i].weight;
            if (rand < cumulative) {
                selectedIndex = i;
                break;
            }
        }
        
        // Add selected resource
        const selected = weightedPool[selectedIndex];
        resources.push(selected.name);
        
        // Remove selected resource from pool (no duplicates)
        weightedPool.splice(selectedIndex, 1);
    }
    
    return resources;
}

// ===== PLANET GENERATION =====
export function generatePlanet(seed, index, starType, sectorId) {
    const planetSeed = seed + index * 1000;
    const planetType = getRandomPlanetType(planetSeed, 0);
    const planetData = PLANET_TYPE_DATA[planetType];
    
    // Generate resources (max 4)
    const resources = generatePlanetResources(planetSeed, planetType);
    
    // Calculate orbit parameters
    const orbitRadius = 70 + index * 40;
    const orbitSpeed = 0.002 - (index * 0.0002);
    
    return {
        index: index,
        name: '', // Will be filled by planet-names.js
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
        angle: seededRandom(planetSeed, 100) * Math.PI * 2, // Random starting angle
        distanceFromStar: 0.5 + (index * 0.8) // Approximate distance in LY
    };
}

// ===== STAR GENERATION =====
export function generateStar(seed, index, clusterName) {
    const starSeed = seed + index * 1000;
    
    // Star types with probabilities
    const starTypes = [
        { type: 'main', name: 'Main Sequence', prob: 0.60, color: '#ffd700', minPlanets: 3, maxPlanets: 8, icon: '🟡' },
        { type: 'red', name: 'Red Dwarf', prob: 0.25, color: '#ff6b6b', minPlanets: 2, maxPlanets: 5, icon: '🔴' },
        { type: 'blue', name: 'Blue Giant', prob: 0.10, color: '#6ba5ff', minPlanets: 5, maxPlanets: 12, icon: '🔵' },
        { type: 'neutron', name: 'Neutron Star', prob: 0.03, color: '#ffffff', minPlanets: 0, maxPlanets: 0, icon: '💫' },
        { type: 'blackhole', name: 'Black Hole', prob: 0.02, color: '#000000', minPlanets: 0, maxPlanets: 0, icon: '⚫' }
    ];
    
    // Select star type
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
    
    // Determine planet count
    let planetCount = 0;
    if (starType.maxPlanets > 0) {
        planetCount = Math.floor(seededRandom(starSeed, 1) * (starType.maxPlanets - starType.minPlanets + 1)) + starType.minPlanets;
    }
    
    // Generate planets
    const planets = [];
    for (let i = 0; i < planetCount; i++) {
        planets.push(generatePlanet(starSeed, i, starType.type, clusterName));
    }
    
    return {
        index: index,
        name: '', // Will be filled by planet-names.js
        type: starType.type,
        typeName: starType.name,
        color: starType.color,
        icon: starType.icon,
        planetCount: planetCount,
        planets: planets,
        seed: starSeed,
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
            seed: star.seed
        },
        planets: planets.map(p => ({
            ...p,
            // Ensure resources are included
            resources: p.resources || []
        })),
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

// ===== PLANET RESOURCE MANAGEMENT =====
export function savePlanetResources(planetName, resources) {
    const key = `voidfarer_planet_resources_${planetName}`;
    localStorage.setItem(key, JSON.stringify(resources));
}

export function loadPlanetResources(planetName) {
    const key = `voidfarer_planet_resources_${planetName}`;
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error(`Failed to parse resources for ${planetName}:`, e);
        }
    }
    return null;
}

// ===== VALIDATION =====
export function validatePlanetResources(resources) {
    if (!Array.isArray(resources)) return false;
    if (resources.length > 4) return false; // Max 4 resources
    if (resources.length === 0) return false; // At least 1 resource
    
    // Check for duplicates
    const unique = new Set(resources);
    if (unique.size !== resources.length) return false;
    
    return true;
}

// ===== EXPORT ALL =====
export default {
    PLANET_TYPES,
    PLANET_TYPE_DATA,
    RESOURCE_POOLS,
    RARITY_WEIGHTS,
    seededRandom,
    hashString,
    getRandomPlanetType,
    generatePlanetResources,
    generatePlanet,
    generateStar,
    saveSystemData,
    loadSystemData,
    clearSystemData,
    savePlanetResources,
    loadPlanetResources,
    validatePlanetResources
};

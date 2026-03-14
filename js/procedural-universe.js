// js/procedural-universe.js
// Core generation engine for Voidfarer's shared procedural universe
// All players share the same seed = same universe for everyone
// This is a pure calculation module - no storage dependencies

import { 
    PLANET_TYPES, 
    PLANET_TYPE_DATA, 
    RESOURCE_POOLS,
    seededRandom as utilsSeededRandom,
    hashString as utilsHashString,
    getRandomPlanetType,
    generatePlanetResources,
    generatePlanet,
    generateStar
} from './planet-utils.js';

import {
    generatePlanetName,
    generateStarName,
    seededRandom as namesSeededRandom
} from './planet-names.js';

// ===== CONSTANTS =====
export const UNIVERSE_SEED = 42793; // Fixed seed - every player sees the same universe

// Galaxy structure (Starfield scale)
export const GALAXY_CONFIG = {
    name: "Milky Way",
    sectors: 12, // 3x4 grid (A1-C4)
    nebulaePerSector: 6, // 6 nebulae per sector × 12 sectors = 72 nebulae
    starsPerNebula: 50, // 50 stars per nebula × 72 = 3,600 stars
    planetsPerStar: { min: 2, max: 8 }, // Average ~4 planets = 14,400 planets (with 4 max per planet)
    anomaliesPerSector: 5 // Special points of interest
};

// ===== SEEDED RANDOM NUMBER GENERATOR =====
// Re-export for backward compatibility
export const seededRandom = utilsSeededRandom;
export const hashString = utilsHashString;

// ===== LOCATION SEED GENERATION =====
// Every location in the universe gets a unique seed
// Format: base seed + sector hash + nebula index + star index + planet index

export function getSectorSeed(sectorId) {
    // sectorId format: "A1", "B2", "C4", etc.
    const row = sectorId.charCodeAt(0) - 65; // A=0, B=1, C=2
    const col = parseInt(sectorId[1]) - 1;
    return UNIVERSE_SEED + (row * 10000) + (col * 1000);
}

export function getNebulaSeed(sectorSeed, nebulaIndex) {
    return sectorSeed + (nebulaIndex * 100000);
}

export function getStarSeed(nebulaSeed, starIndex) {
    return nebulaSeed + (starIndex * 1000);
}

export function getPlanetSeed(starSeed, planetIndex) {
    return starSeed + (planetIndex * 10);
}

export function getAnomalySeed(sectorSeed, anomalyIndex) {
    return sectorSeed + 500000 + (anomalyIndex * 1000);
}

// ===== PLANET TYPE GENERATION (re-export from planet-utils) =====
export const planetTypes = Object.values(PLANET_TYPES).map(type => ({
    type: type,
    name: PLANET_TYPE_DATA[type].name,
    prob: PLANET_TYPE_DATA[type].prob,
    temp: PLANET_TYPE_DATA[type].temp,
    atmos: PLANET_TYPE_DATA[type].atmos,
    gravity: PLANET_TYPE_DATA[type].gravity,
    landable: PLANET_TYPE_DATA[type].landable,
    icon: PLANET_TYPE_DATA[type].icon
}));

export function getPlanetType(seed, index) {
    const type = getRandomPlanetType(seed, index);
    return PLANET_TYPE_DATA[type];
}

// ===== STAR TYPE GENERATION =====
export const starTypes = [
    { type: 'main', name: 'Main Sequence', prob: 0.60, color: '#ffd700', minPlanets: 3, maxPlanets: 8, icon: '🟡' },
    { type: 'red', name: 'Red Dwarf', prob: 0.25, color: '#ff6b6b', minPlanets: 2, maxPlanets: 5, icon: '🔴' },
    { type: 'blue', name: 'Blue Giant', prob: 0.10, color: '#6ba5ff', minPlanets: 5, maxPlanets: 12, icon: '🔵' },
    { type: 'neutron', name: 'Neutron Star', prob: 0.03, color: '#ffffff', minPlanets: 0, maxPlanets: 0, icon: '💫' },
    { type: 'blackhole', name: 'Black Hole', prob: 0.02, color: '#000000', minPlanets: 0, maxPlanets: 0, icon: '⚫' }
];

export function getStarType(seed, index) {
    const rand = seededRandom(seed, index);
    let cumulative = 0;
    
    for (const type of starTypes) {
        cumulative += type.prob;
        if (rand < cumulative) {
            return { ...type }; // Return copy
        }
    }
    
    return { ...starTypes[0] }; // Default to main sequence
}

// ===== RESOURCE GENERATION (re-export from planet-utils) =====
export function generateResources(seed, index, planetType, count = 4) {
    return generatePlanetResources(seed, planetType, count);
}

// ===== STAR GENERATION (enhanced) =====
export function generateStar(nebulaSeed, starIndex, sectorId = null) {
    const seed = getStarSeed(nebulaSeed, starIndex);
    const starType = getStarType(seed, 0);
    
    // Generate star name using planet-names
    const starName = generateStarName(seed, 2);
    
    // Calculate planet count based on star type
    let planetCount = 0;
    if (starType.maxPlanets > 0) {
        planetCount = seededRandomRange(seed, 1, starType.minPlanets, starType.maxPlanets);
    }
    
    // Generate planets
    const planets = [];
    for (let i = 0; i < planetCount; i++) {
        const planetSeed = getPlanetSeed(seed, i);
        const planetType = getRandomPlanetType(planetSeed, i);
        const planetData = PLANET_TYPE_DATA[planetType];
        
        // Generate planet name
        const planetName = generatePlanetName(planetSeed, i, sectorId, planetType);
        
        // Generate resources (max 4)
        const resources = generatePlanetResources(planetSeed, planetType);
        
        planets.push({
            index: i,
            name: planetName,
            type: planetType,
            typeName: planetData.name,
            icon: planetData.icon,
            color: planetData.color,
            temp: planetData.temp,
            atmos: planetData.atmos,
            gravity: planetData.gravity,
            landable: planetData.landable,
            description: planetData.description,
            resources: resources,
            seed: planetSeed,
            distanceFromStar: 0.5 + (i * 0.8), // Approximate distance in LY
            orbitRadius: 70 + i * 40,
            orbitSpeed: 0.002 - (i * 0.0002),
            angle: seededRandom(planetSeed, 100) * Math.PI * 2
        });
    }
    
    return {
        index: starIndex,
        name: starName,
        type: starType.type,
        typeName: starType.name,
        color: starType.color,
        icon: starType.icon,
        planetCount: planetCount,
        planets: planets,
        seed: seed,
        position: {
            x: seededRandom(seed, 3) * 90 + 5, // 5-95% range
            y: seededRandom(seed, 4) * 90 + 5
        }
    };
}

// ===== PLANET GENERATION (re-export with name) =====
export function generatePlanet(starSeed, planetIndex, starType, sectorId = null) {
    const seed = getPlanetSeed(starSeed, planetIndex);
    const planetType = getRandomPlanetType(seed, 0);
    const planetData = PLANET_TYPE_DATA[planetType];
    
    // Generate planet name
    const planetName = generatePlanetName(seed, planetIndex, sectorId, planetType);
    
    // Generate resources (max 4)
    const resources = generatePlanetResources(seed, planetType);
    
    // Adjust temperature based on star type and position
    let tempOffset = 0;
    if (starType === 'blue') tempOffset = -50; // Blue giants are hotter
    else if (starType === 'red') tempOffset = 50; // Red dwarfs are cooler
    
    // Parse temperature string and adjust
    let baseTemp = parseInt(planetData.temp);
    let newTemp = baseTemp + tempOffset;
    let tempString = newTemp + '°C';
    
    return {
        index: planetIndex,
        name: planetName,
        type: planetType,
        typeName: planetData.name,
        icon: planetData.icon,
        color: planetData.color,
        temp: tempString,
        atmos: planetData.atmos,
        gravity: planetData.gravity,
        landable: planetData.landable,
        description: planetData.description,
        resources: resources,
        seed: seed,
        orbitRadius: 50 + planetIndex * 15, // Distance from star
        orbitSpeed: 0.001 - (planetIndex * 0.0001), // Slower for outer planets
        angle: seededRandom(seed, 100) * Math.PI * 2,
        hasMoons: planetType === 'gas' ? true : seededRandom(seed, 3) < 0.3,
        moonCount: planetType === 'gas' ? 
            seededRandomRange(seed, 4, 3, 10) : 
            (seededRandom(seed, 5) < 0.3 ? seededRandomRange(seed, 6, 1, 2) : 0)
    };
}

// ===== NEBULA GENERATION =====
export function generateNebula(sectorSeed, nebulaIndex, sectorId = null) {
    const seed = getNebulaSeed(sectorSeed, nebulaIndex);
    
    const nebulaNames = [
        'Orion', 'Cygnus', 'Sagittarius', 'Perseus', 'Carina', 'Eagle',
        'Omega', 'Trifid', 'Lagoon', 'Veil', 'Crab', 'Helix',
        'Rosette', 'Tarantula', 'Pelican', 'North America', 'Elephant Trunk', 'Bubble'
    ];
    
    const nebulaTypes = ['Emission', 'Supernova', 'Dark', 'Reflection', 'Planetary', 'Star-forming'];
    const colors = ['#8a6aff', '#ff6a9a', '#ffaa4a', '#4affaa', '#c06aff', '#6a8aff'];
    
    const nameIndex = seededRandomRange(seed, 0, 0, nebulaNames.length - 1);
    const typeIndex = seededRandomRange(seed, 1, 0, nebulaTypes.length - 1);
    const colorIndex = seededRandomRange(seed, 2, 0, colors.length - 1);
    
    // Generate stars in this nebula
    const stars = [];
    for (let i = 0; i < GALAXY_CONFIG.starsPerNebula; i++) {
        stars.push(generateStar(seed, i, sectorId));
    }
    
    return {
        index: nebulaIndex,
        name: nebulaNames[nameIndex] + ' Nebula',
        type: nebulaTypes[typeIndex],
        color: colors[colorIndex],
        systems: GALAXY_CONFIG.starsPerNebula,
        stars: stars,
        seed: seed,
        position: {
            x: 20 + (nebulaIndex * 12) % 80,
            y: 30 + (nebulaIndex % 2 === 0 ? 0 : 20)
        }
    };
}

// ===== ANOMALY GENERATION =====
export const anomalyTypes = [
    { type: 'blackhole', name: 'Black Hole', prob: 0.3, icon: '⚫', danger: 5, interest: 5 },
    { type: 'nebula', name: 'Proto-Nebula', prob: 0.2, icon: '🌌', danger: 2, interest: 4 },
    { type: 'pulsar', name: 'Pulsar', prob: 0.2, icon: '⚡', danger: 4, interest: 4 },
    { type: 'wormhole', name: 'Wormhole', prob: 0.15, icon: '🌀', danger: 3, interest: 5 },
    { type: 'asteroid', name: 'Asteroid Field', prob: 0.15, icon: '🪨', danger: 3, interest: 3 }
];

export function generateAnomaly(sectorSeed, anomalyIndex) {
    const seed = getAnomalySeed(sectorSeed, anomalyIndex);
    
    const rand = seededRandom(seed, 0);
    let cumulative = 0;
    let anomalyType = anomalyTypes[0];
    
    for (const type of anomalyTypes) {
        cumulative += type.prob;
        if (rand < cumulative) {
            anomalyType = type;
            break;
        }
    }
    
    // Generate anomaly name
    const anomalyName = generateAnomalyName(seed, 1);
    
    return {
        index: anomalyIndex,
        name: anomalyName,
        type: anomalyType.type,
        typeName: anomalyType.name,
        icon: anomalyType.icon,
        danger: anomalyType.danger,
        interest: anomalyType.interest,
        seed: seed,
        position: {
            x: seededRandom(seed, 2) * 90 + 5,
            y: seededRandom(seed, 3) * 90 + 5
        },
        resources: generateResources(seed, 4, 'anomaly', seededRandomRange(seed, 5, 1, 3))
    };
}

// ===== ANOMALY NAME GENERATION =====
export function generateAnomalyName(seed, index) {
    const prefixes = [
        'Dark', 'Veil', 'Crimson', 'Void', 'Mystic', 'Ancient', 'Forgotten', 'Eternal',
        'Silent', 'Whispering', 'Screaming', 'Dying', 'Living', 'Cursed', 'Blessed',
        'Infernal', 'Celestial', 'Abyssal', 'Chaotic', 'Ordered', 'Quantum', 'Singular',
        'Gravitational', 'Magnetic', 'Electric', 'Plasma', 'Radiant', 'Nuclear'
    ];
    
    const suffixes = [
        'Reach', 'Expanse', 'Void', 'Abyss', 'Maw', 'Heart', 'Eye', 'Core', 'Rift', 'Hollow',
        'Gate', 'Portal', 'Nexus', 'Conduit', 'Stream', 'Field', 'Zone', 'Sector', 'Domain',
        'Anomaly', 'Phenomenon', 'Occurrence', 'Event', 'Incident', 'Outbreak'
    ];
    
    const prefix = prefixes[Math.floor(seededRandom(seed, index * 2) * prefixes.length)];
    const suffix = suffixes[Math.floor(seededRandom(seed, index * 2 + 1) * suffixes.length)];
    
    return prefix + ' ' + suffix;
}

// ===== SECTOR GENERATION =====
export function generateSector(sectorId) {
    const sectorSeed = getSectorSeed(sectorId);
    
    const sectorNames = {
        'A1': 'Cygnus Arm', 'B1': 'Perseus Arm', 'C1': 'Galactic Core',
        'A2': 'Outer Arm', 'B2': 'Orion Arm', 'C2': 'Sagittarius Arm',
        'A3': 'Carina Arm', 'B3': 'Norma Arm', 'C3': 'Scutum Arm',
        'A4': 'Far Arm', 'B4': 'Outer Reach', 'C4': 'The Fringe'
    };
    
    // Generate nebulae for this sector
    const nebulae = [];
    for (let i = 0; i < GALAXY_CONFIG.nebulaePerSector; i++) {
        nebulae.push(generateNebula(sectorSeed, i, sectorId));
    }
    
    // Generate anomalies for this sector
    const anomalies = [];
    for (let i = 0; i < GALAXY_CONFIG.anomaliesPerSector; i++) {
        anomalies.push(generateAnomaly(sectorSeed, i));
    }
    
    return {
        id: sectorId,
        name: sectorNames[sectorId] || 'Unknown Sector',
        seed: sectorSeed,
        nebulae: nebulae,
        anomalies: anomalies,
        totalStars: GALAXY_CONFIG.nebulaePerSector * GALAXY_CONFIG.starsPerNebula
    };
}

// ===== STAR SYSTEM GENERATION =====
export function generateStarSystem(nebulaSeed, starIndex, sectorId = null) {
    const star = generateStar(nebulaSeed, starIndex, sectorId);
    
    // Planets are already generated inside generateStar
    return {
        star: star,
        planets: star.planets
    };
}

// ===== UTILITY FUNCTIONS =====
export function seededRandomRange(seed, index, min, max) {
    return Math.floor(seededRandom(seed, index) * (max - min + 1)) + min;
}

export function seededRandomChoice(seed, index, array) {
    if (!array || array.length === 0) return null;
    const choice = Math.floor(seededRandom(seed, index) * array.length);
    return array[choice];
}

export function getSectorFromLocation(location) {
    // Extract sector from location string or object
    if (typeof location === 'string') {
        return location;
    }
    return location?.sector || 'B2';
}

export function getNebulaFromLocation(location) {
    if (typeof location === 'string') {
        return location;
    }
    return location?.nebula || 'Orion Nebula';
}

export function getStarFromLocation(location) {
    if (typeof location === 'string') {
        return location;
    }
    return location?.star || 'Sol';
}

export function getPlanetFromLocation(location) {
    if (typeof location === 'string') {
        return location;
    }
    return location?.planet || 'Earth';
}

// ===== BATCH GENERATION FUNCTIONS =====
export function generateAllSectors() {
    const sectors = {};
    const sectorIds = ['A1', 'B1', 'C1', 'A2', 'B2', 'C2', 'A3', 'B3', 'C3', 'A4', 'B4', 'C4'];
    
    for (const id of sectorIds) {
        sectors[id] = generateSector(id);
    }
    
    return sectors;
}

export function generateAllStarsInNebula(sectorId, nebulaIndex) {
    const sectorSeed = getSectorSeed(sectorId);
    const nebulaSeed = getNebulaSeed(sectorSeed, nebulaIndex);
    const stars = [];
    
    for (let i = 0; i < GALAXY_CONFIG.starsPerNebula; i++) {
        stars.push(generateStar(nebulaSeed, i, sectorId));
    }
    
    return stars;
}

// ===== PLANET COUNT STATISTICS =====
export function getGalaxyStatistics() {
    const totalSectors = GALAXY_CONFIG.sectors;
    const totalNebulae = totalSectors * GALAXY_CONFIG.nebulaePerSector;
    const totalStars = totalNebulae * GALAXY_CONFIG.starsPerNebula;
    
    // Average planets per star (based on star type distribution)
    let totalPlanets = 0;
    for (const starType of starTypes) {
        const avgPlanets = (starType.minPlanets + starType.maxPlanets) / 2;
        totalPlanets += totalStars * starType.prob * avgPlanets;
    }
    
    return {
        totalSectors,
        totalNebulae,
        totalStars,
        totalPlanets: Math.round(totalPlanets),
        planetTypes: Object.keys(PLANET_TYPES).length
    };
}

// ===== EXPORT =====
export default {
    UNIVERSE_SEED,
    GALAXY_CONFIG,
    seededRandom,
    seededRandomRange,
    seededRandomChoice,
    hashString,
    getSectorSeed,
    getNebulaSeed,
    getStarSeed,
    getPlanetSeed,
    getStarType,
    getPlanetType,
    generateResources,
    generateStar,
    generatePlanet,
    generateNebula,
    generateAnomaly,
    generateSector,
    generateStarSystem,
    generateAllSectors,
    generateAllStarsInNebula,
    generateAnomalyName,
    getSectorFromLocation,
    getNebulaFromLocation,
    getStarFromLocation,
    getPlanetFromLocation,
    getGalaxyStatistics,
    starTypes,
    planetTypes,
    anomalyTypes,
    resourcePools: RESOURCE_POOLS
};

// procedural-universe.js
// Core generation engine for Voidfarer's shared procedural universe
// All players share the same seed = same universe for everyone

// ===== CONSTANTS =====
const UNIVERSE_SEED = 42793; // Fixed seed - every player sees the same universe

// Galaxy structure (Starfield scale)
const GALAXY_CONFIG = {
    name: "Milky Way",
    sectors: 12, // 3x4 grid (A1-C4)
    nebulaePerSector: 6, // 6 nebulae per sector × 12 sectors = 72 nebulae
    starsPerNebula: 50, // 50 stars per nebula × 72 = 3,600 stars
    planetsPerStar: { min: 2, max: 12 }, // Average ~5 planets = 18,000 planets
    anomaliesPerSector: 5 // Special points of interest
};

// ===== SEEDED RANDOM NUMBER GENERATOR =====
// All random numbers are deterministic based on seeds
// Same inputs always produce same outputs

function seededRandom(seed, index = 0) {
    // Using sin for pseudo-random but deterministic results
    const x = Math.sin(seed * (index + 1)) * 10000;
    return x - Math.floor(x);
}

function seededRandomRange(seed, index, min, max) {
    return Math.floor(seededRandom(seed, index) * (max - min + 1)) + min;
}

function seededRandomChoice(seed, index, array) {
    const choice = Math.floor(seededRandom(seed, index) * array.length);
    return array[choice];
}

// ===== HASH FUNCTION FOR STRINGS =====
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// ===== LOCATION SEED GENERATION =====
// Every location in the universe gets a unique seed
// Format: base seed + sector hash + nebula index + star index + planet index

function getSectorSeed(sectorId) {
    // sectorId format: "A1", "B2", "C4", etc.
    const row = sectorId.charCodeAt(0) - 65; // A=0, B=1, C=2
    const col = parseInt(sectorId[1]) - 1;
    return UNIVERSE_SEED + (row * 10000) + (col * 1000);
}

function getNebulaSeed(sectorSeed, nebulaIndex) {
    return sectorSeed + (nebulaIndex * 100000);
}

function getStarSeed(nebulaSeed, starIndex) {
    return nebulaSeed + (starIndex * 1000);
}

function getPlanetSeed(starSeed, planetIndex) {
    return starSeed + (planetIndex * 10);
}

function getAnomalySeed(sectorSeed, anomalyIndex) {
    return sectorSeed + 500000 + (anomalyIndex * 1000);
}

// ===== NAME GENERATION =====
const namePrefixes = [
    'Al', 'Bet', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
    'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
    'Phi', 'Chi', 'Psi', 'Omega', 'Alpha', 'Beta', 'Prox', 'Sol', 'Terra', 'Luna'
];

const nameSuffixes = [
    'Majoris', 'Minoris', 'Prime', 'Secundus', 'Tertius', 'A', 'B', 'C', 'D', 'E',
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'I', 'II', 'III', 'IV', 'V',
    'Centauri', 'Orionis', 'Cygnii', 'Andromedae', 'Cassiopeiae'
];

const planetPrefixes = [
    'Verdant', 'Pyros', 'Glacier', 'Aether', 'Ignis', 'Terra', 'Aqua', 'Ventus',
    'Saxum', 'Silva', 'Desertum', 'Lux', 'Umbra', 'Crystal', 'Feral', 'Eden',
    'Nova', 'Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus'
];

const anomalyPrefixes = [
    'Dark', 'Veil', 'Crimson', 'Void', 'Mystic', 'Ancient', 'Forgotten', 'Eternal',
    'Silent', 'Whispering', 'Screaming', 'Dying', 'Living', 'Cursed', 'Blessed',
    'Infernal', 'Celestial', 'Abyssal', 'Chaotic', 'Ordered'
];

const anomalySuffixes = [
    'Reach', 'Expanse', 'Void', 'Abyss', 'Maw', 'Heart', 'Eye', 'Core', 'Rift', 'Hollow',
    'Gate', 'Portal', 'Nexus', 'Conduit', 'Stream', 'Field', 'Zone', 'Sector', 'Domain'
];

function generateStarName(seed, index) {
    const prefix = seededRandomChoice(seed, index * 3, namePrefixes);
    const suffix = seededRandomChoice(seed, index * 3 + 1, nameSuffixes);
    return prefix + ' ' + suffix;
}

function generatePlanetName(seed, index) {
    const prefix = seededRandomChoice(seed, index * 5, planetPrefixes);
    const number = seededRandomRange(seed, index * 5 + 1, 1, 12);
    return prefix + '-' + number;
}

function generateAnomalyName(seed, index) {
    const prefix = seededRandomChoice(seed, index * 7, anomalyPrefixes);
    const suffix = seededRandomChoice(seed, index * 7 + 1, anomalySuffixes);
    return prefix + ' ' + suffix;
}

// ===== STAR TYPE GENERATION =====
const starTypes = [
    { type: 'main', name: 'Main Sequence', prob: 0.60, color: '#ffd700', minPlanets: 3, maxPlanets: 8 },
    { type: 'red', name: 'Red Dwarf', prob: 0.25, color: '#ff6b6b', minPlanets: 2, maxPlanets: 5 },
    { type: 'blue', name: 'Blue Giant', prob: 0.10, color: '#6ba5ff', minPlanets: 5, maxPlanets: 12 },
    { type: 'neutron', name: 'Neutron Star', prob: 0.03, color: '#ffffff', minPlanets: 0, maxPlanets: 0 },
    { type: 'blackhole', name: 'Black Hole', prob: 0.02, color: '#000000', minPlanets: 0, maxPlanets: 0 }
];

function getStarType(seed, index) {
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

// ===== PLANET TYPE GENERATION =====
const planetTypes = [
    { type: 'scorched', name: 'Scorched', prob: 0.15, temp: '450°C', atmos: 'Toxic', gravity: '1.2g', landable: true, icon: '🔥' },
    { type: 'barren', name: 'Barren', prob: 0.25, temp: '-50°C', atmos: 'Thin', gravity: '0.8g', landable: true, icon: '🪨' },
    { type: 'lush', name: 'Lush', prob: 0.15, temp: '22°C', atmos: 'Breathable', gravity: '0.9g', landable: true, icon: '🌱' },
    { type: 'frozen', name: 'Frozen', prob: 0.20, temp: '-80°C', atmos: 'Thin', gravity: '0.7g', landable: true, icon: '❄️' },
    { type: 'gas', name: 'Gas Giant', prob: 0.25, temp: '-120°C', atmos: 'Dense', gravity: '2.1g', landable: false, icon: '🌪️' }
];

function getPlanetType(seed, index) {
    const rand = seededRandom(seed, index);
    let cumulative = 0;
    
    for (const type of planetTypes) {
        cumulative += type.prob;
        if (rand < cumulative) {
            return { ...type }; // Return copy
        }
    }
    
    return { ...planetTypes[1] }; // Default to barren
}

// ===== RESOURCE GENERATION =====
const resourcePools = {
    common: ['Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Sodium', 'Magnesium', 'Aluminum', 'Silicon', 'Potassium', 'Calcium'],
    uncommon: ['Carbon', 'Oxygen', 'Nitrogen', 'Iron', 'Nickel', 'Sulfur', 'Phosphorus', 'Chlorine', 'Argon', 'Lead'],
    rare: ['Gold', 'Silver', 'Platinum', 'Copper', 'Titanium', 'Zinc', 'Tin', 'Mercury', 'Cobalt', 'Chromium'],
    veryRare: ['Uranium', 'Thorium', 'Plutonium', 'Radium', 'Polonium'],
    legendary: ['Promethium', 'Technetium', 'Astatine', 'Francium']
};

function generateResources(seed, index, planetType, count = null) {
    // Determine resource count based on planet type
    if (count === null) {
        if (planetType === 'gas') count = seededRandomRange(seed, index, 2, 4);
        else if (planetType === 'barren') count = seededRandomRange(seed, index, 1, 3);
        else if (planetType === 'scorched') count = seededRandomRange(seed, index, 2, 4);
        else if (planetType === 'frozen') count = seededRandomRange(seed, index, 2, 4);
        else if (planetType === 'lush') count = seededRandomRange(seed, index, 3, 5);
        else count = 2;
    }
    
    const resources = [];
    const availablePools = [];
    
    // Add probability for each rarity tier
    if (seededRandom(seed, index + 10) < 0.8) availablePools.push(...resourcePools.common);
    if (seededRandom(seed, index + 11) < 0.5) availablePools.push(...resourcePools.uncommon);
    if (seededRandom(seed, index + 12) < 0.2) availablePools.push(...resourcePools.rare);
    if (seededRandom(seed, index + 13) < 0.05) availablePools.push(...resourcePools.veryRare);
    if (seededRandom(seed, index + 14) < 0.01) availablePools.push(...resourcePools.legendary);
    
    // Ensure at least common resources
    if (availablePools.length === 0) {
        availablePools.push(...resourcePools.common);
    }
    
    // Select unique resources
    while (resources.length < count && availablePools.length > 0) {
        const resourceIndex = Math.floor(seededRandom(seed, index + resources.length * 100) * availablePools.length);
        const resource = availablePools[resourceIndex];
        
        if (!resources.includes(resource)) {
            resources.push(resource);
        }
    }
    
    return resources;
}

// ===== STAR GENERATION =====
function generateStar(nebulaSeed, starIndex) {
    const seed = getStarSeed(nebulaSeed, starIndex);
    const starType = getStarType(seed, 0);
    
    // Calculate planet count based on star type
    let planetCount = 0;
    if (starType.maxPlanets > 0) {
        planetCount = seededRandomRange(seed, 1, starType.minPlanets, starType.maxPlanets);
    }
    
    return {
        index: starIndex,
        name: generateStarName(seed, 2),
        type: starType.type,
        typeName: starType.name,
        color: starType.color,
        planetCount: planetCount,
        seed: seed,
        position: {
            x: seededRandom(seed, 3) * 90 + 5, // 5-95% range
            y: seededRandom(seed, 4) * 90 + 5
        }
    };
}

// ===== PLANET GENERATION =====
function generatePlanet(starSeed, planetIndex, starType) {
    const seed = getPlanetSeed(starSeed, planetIndex);
    const planetType = getPlanetType(seed, 0);
    
    // Adjust temperature based on star type and position
    let tempOffset = 0;
    if (starType === 'blue') tempOffset = -50; // Blue giants are hotter
    else if (starType === 'red') tempOffset = 50; // Red dwarfs are cooler
    
    // Parse temperature string and adjust
    let baseTemp = parseInt(planetType.temp);
    let newTemp = baseTemp + tempOffset;
    let tempString = newTemp + '°C';
    
    return {
        index: planetIndex,
        name: generatePlanetName(seed, 1),
        type: planetType.type,
        typeName: planetType.name,
        icon: planetType.icon,
        temp: tempString,
        atmos: planetType.atmos,
        gravity: planetType.gravity,
        landable: planetType.landable,
        resources: generateResources(seed, 2, planetType.type),
        seed: seed,
        orbitRadius: 50 + planetIndex * 15, // Distance from star
        orbitSpeed: 0.001 - (planetIndex * 0.0001), // Slower for outer planets
        hasMoons: planetType.type === 'gas' ? true : seededRandom(seed, 3) < 0.3,
        moonCount: planetType.type === 'gas' ? 
            seededRandomRange(seed, 4, 3, 10) : 
            (seededRandom(seed, 5) < 0.3 ? seededRandomRange(seed, 6, 1, 2) : 0)
    };
}

// ===== NEBULA GENERATION =====
function generateNebula(sectorSeed, nebulaIndex) {
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
    
    return {
        index: nebulaIndex,
        name: nebulaNames[nameIndex] + ' Nebula',
        type: nebulaTypes[typeIndex],
        color: colors[colorIndex],
        systems: GALAXY_CONFIG.starsPerNebula,
        seed: seed,
        position: {
            x: 20 + (nebulaIndex * 12) % 80,
            y: 30 + (nebulaIndex % 2 === 0 ? 0 : 20)
        }
    };
}

// ===== ANOMALY GENERATION =====
const anomalyTypes = [
    { type: 'blackhole', name: 'Black Hole', prob: 0.3, icon: '⚫', danger: 5, interest: 5 },
    { type: 'nebula', name: 'Proto-Nebula', prob: 0.2, icon: '🌌', danger: 2, interest: 4 },
    { type: 'pulsar', name: 'Pulsar', prob: 0.2, icon: '⚡', danger: 4, interest: 4 },
    { type: 'wormhole', name: 'Wormhole', prob: 0.15, icon: '🌀', danger: 3, interest: 5 },
    { type: 'asteroid', name: 'Asteroid Field', prob: 0.15, icon: '🪨', danger: 3, interest: 3 }
];

function generateAnomaly(sectorSeed, anomalyIndex) {
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
    
    return {
        index: anomalyIndex,
        name: generateAnomalyName(seed, 1),
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

// ===== SECTOR GENERATION =====
function generateSector(sectorId) {
    const sectorSeed = getSectorSeed(sectorId);
    
    const sectorNames = {
        'A1': 'Cygnus Arm', 'B1': 'Perseus Arm', 'C1': 'Outer Arm',
        'A2': 'Sagittarius', 'B2': 'Orion Arm', 'C2': 'Carina Arm',
        'A3': 'Norma Arm', 'B3': 'Scutum Arm', 'C3': 'Centaurus',
        'A4': 'Far Arm', 'B4': 'Outer Reach', 'C4': 'Fringe'
    };
    
    // Generate nebulae for this sector
    const nebulae = [];
    for (let i = 0; i < GALAXY_CONFIG.nebulaePerSector; i++) {
        nebulae.push(generateNebula(sectorSeed, i));
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
function generateStarSystem(nebulaSeed, starIndex) {
    const star = generateStar(nebulaSeed, starIndex);
    
    // Generate planets for this star
    const planets = [];
    for (let i = 0; i < star.planetCount; i++) {
        planets.push(generatePlanet(star.seed, i, star.type));
    }
    
    return {
        star: star,
        planets: planets
    };
}

// ===== UTILITY FUNCTIONS =====
function getSectorFromLocation(location) {
    // Extract sector from location string or object
    if (typeof location === 'string') {
        return location;
    }
    return location?.sector || 'B2';
}

function getNebulaFromLocation(location) {
    if (typeof location === 'string') {
        return location;
    }
    return location?.nebula || 'Orion Nebula';
}

function getStarFromLocation(location) {
    if (typeof location === 'string') {
        return location;
    }
    return location?.star || 'Sol';
}

function getPlanetFromLocation(location) {
    if (typeof location === 'string') {
        return location;
    }
    return location?.planet || 'Earth';
}

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
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
        generateStarName,
        generatePlanetName,
        generateAnomalyName,
        getStarType,
        getPlanetType,
        generateResources,
        generateStar,
        generatePlanet,
        generateNebula,
        generateAnomaly,
        generateSector,
        generateStarSystem,
        getSectorFromLocation,
        getNebulaFromLocation,
        getStarFromLocation,
        getPlanetFromLocation,
        starTypes,
        planetTypes,
        anomalyTypes,
        resourcePools
    };
}

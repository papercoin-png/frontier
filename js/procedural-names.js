// js/procedural-names.js
// Procedural name generation for Voidfarer's shared universe
// All names are deterministic based on seeds
// Pure calculation module - no storage dependencies

// ===== STAR NAME COMPONENTS =====
// Inspired by real stellar nomenclature (Bayer designations, proper names)

export const starPrefixes = [
    // Greek letters (Bayer designations)
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 
    'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 
    'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega',
    
    // Common star prefixes
    'Al', 'Bet', 'Gam', 'Del', 'Eps', 'Ze', 'Eta', 'The', 'Io', 'Kap',
    'Lam', 'Mu', 'Nu', 'Xi', 'Omi', 'Pi', 'Ro', 'Sig', 'Tau', 'Ups',
    'Phi', 'Chi', 'Psi', 'Ome', 'Prox', 'Sol', 'Sir', 'Can', 'Rig', 'Veg'
];

export const starSuffixes = [
    // Constellations (Latin genitive forms)
    'Andromedae', 'Antliae', 'Apodis', 'Aquarii', 'Aquilae', 'Arae', 'Arietis',
    'Aurigae', 'Bootis', 'Caeli', 'Camelopardalis', 'Cancri', 'Canum Venaticorum',
    'Canis Majoris', 'Canis Minoris', 'Capricorni', 'Carinae', 'Cassiopeiae',
    'Centauri', 'Cephei', 'Ceti', 'Chamaeleontis', 'Circini', 'Columbae',
    'Comae Berenices', 'Coronae Australis', 'Coronae Borealis', 'Corvi', 'Crateris',
    'Crucis', 'Cygni', 'Delphini', 'Doradus', 'Draconis', 'Equulei', 'Eridani',
    'Fornacis', 'Geminorum', 'Gruis', 'Herculis', 'Horologii', 'Hydrae',
    'Hydri', 'Indi', 'Lacertae', 'Leonis', 'Leonis Minoris', 'Leporis', 'Librae',
    'Lupi', 'Lyncis', 'Lyrae', 'Mensae', 'Microscopii', 'Monocerotis', 'Muscae',
    'Normae', 'Octantis', 'Ophiuchi', 'Orionis', 'Pavonis', 'Pegasi', 'Persei',
    'Phoenicis', 'Pictoris', 'Piscium', 'Piscis Austrini', 'Puppis', 'Pyxidis',
    'Reticuli', 'Sagittae', 'Sagittarii', 'Scorpii', 'Sculptoris', 'Scuti',
    'Serpentis', 'Sextantis', 'Tauri', 'Telescopii', 'Trianguli', 'Trianguli Australis',
    'Tucanae', 'Ursae Majoris', 'Ursae Minoris', 'Velorum', 'Virginis', 'Volantis',
    'Vulpeculae',
    
    // Numeric/letter suffixes
    'Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Sextus', 'Septimus',
    'Octavus', 'Nonus', 'Decimus', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'Majoris', 'Minoris', 'Australis', 'Borealis'
];

// ===== PLANET NAME COMPONENTS =====
export const planetPrefixes = [
    // Earth-like
    'Verdant', 'Terra', 'Tellus', 'Gaia', 'Earth', 'Terre', 'Erde',
    
    // Hot/Volcanic
    'Pyros', 'Ignis', 'Vulcan', 'Magma', 'Lava', 'Cinder', 'Ember', 'Blaze',
    'Inferno', 'Scorch', 'Sulfur', 'Ash', 'Forge', 'Anvil', 'Smith',
    
    // Cold/Icy
    'Glacier', 'Frost', 'Cryo', 'Ice', 'Snow', 'Winter', 'Frigid', 'Chill',
    'Permafrost', 'Tundra', 'Glaciem', 'Hiemal', 'Brumal', 'Gelid',
    
    // Barren/Rocky
    'Saxum', 'Rock', 'Stone', 'Crag', 'Cliff', 'Mesa', 'Butte', 'Canyon',
    'Desert', 'Dune', 'Sand', 'Gravel', 'Pebble', 'Boulder', 'Bedrock',
    
    // Gas Giants
    'Aether', 'Ventus', 'Wind', 'Storm', 'Tempest', 'Cyclone', 'Hurricane',
    'Typhoon', 'Zephyr', 'Breeze', 'Gale', 'Mistral', 'Sirocco', 'Tradewind',
    
    // Ocean worlds
    'Aqua', 'Ocean', 'Sea', 'Marine', 'Tidal', 'Wave', 'Current', 'Deep',
    'Abyss', 'Trench', 'Reef', 'Lagoon', 'Strait', 'Sound', 'Bay',
    
    // Forest/Jungle
    'Silva', 'Forest', 'Jungle', 'Wood', 'Grove', 'Verdure', 'Flora', 'Moss',
    'Fern', 'Thicket', 'Wildwood', 'Greenwood', 'Rainforest',
    
    // Mystical
    'Lux', 'Lumen', 'Umbra', 'Nocturne', 'Shadow', 'Eclipse', 'Solstice',
    'Equinox', 'Nova', 'Stella', 'Astra', 'Celeste', 'Cosmos', 'Nebula',
    
    // Numerical
    'Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Sextus', 'Septimus',
    'Octavus', 'Nonus', 'Decimus', 'Primus', 'Altera', 'Secunda'
];

export const planetSuffixes = [
    'Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Sextus', 'Septimus',
    'Octavus', 'Nonus', 'Decimus', 'Major', 'Minor', 'Alpha', 'Beta', 'Gamma',
    'Delta', 'Epsilon', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII',
    'IX', 'X', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Core', 'Outpost'
];

// ===== ANOMALY NAME COMPONENTS =====
export const anomalyPrefixes = [
    // Dark/Mysterious
    'Dark', 'Shadow', 'Umbral', 'Nocturnal', 'Eclipse', 'Void', 'Abyssal',
    'Depthless', 'Bottomless', 'Infinite', 'Eternal', 'Ancient', 'Primordial',
    
    // Color based
    'Crimson', 'Violet', 'Azure', 'Emerald', 'Golden', 'Silver', 'Copper',
    'Obsidian', 'Crystal', 'Ruby', 'Sapphire', 'Jade', 'Amber', 'Opal',
    
    // Atmospheric
    'Silent', 'Whispering', 'Murmuring', 'Screaming', 'Roaring', 'Quiet',
    'Calm', 'Stormy', 'Tempestuous', 'Tranquil', 'Peaceful', 'Turbulent',
    
    // Temporal
    'Ancient', 'Elder', 'Old', 'Aged', 'Timeless', 'Eternal', 'Immortal',
    'Forgotten', 'Lost', 'Vanished', 'Ruined', 'Abandoned',
    
    // Mystical
    'Mystic', 'Arcane', 'Magical', 'Enchanted', 'Charmed', 'Sorcerous',
    'Wizard', 'Witch', 'Druidic', 'Shamanic', 'Runic', 'Glyphic',
    
    // Scientific
    'Quantum', 'Singular', 'Gravitational', 'Magnetic', 'Electric', 'Plasma',
    'Radiant', 'Nuclear', 'Atomic', 'Molecular', 'Cosmic', 'Stellar',
    
    // Emotional
    'Hope', 'Despair', 'Joy', 'Sorrow', 'Fear', 'Courage', 'Dream', 'Nightmare',
    'Memory', 'Destiny', 'Fate', 'Fortune', 'Doom', 'Salvation'
];

export const anomalySuffixes = [
    // Locations
    'Reach', 'Expanse', 'Void', 'Abyss', 'Maw', 'Heart', 'Eye', 'Core',
    'Rift', 'Hollow', 'Gate', 'Portal', 'Nexus', 'Conduit', 'Stream',
    'Field', 'Zone', 'Sector', 'Domain', 'Realm', 'Dimension', 'Plane',
    
    // Phenomena
    'Anomaly', 'Phenomenon', 'Occurrence', 'Event', 'Incident', 'Outbreak',
    'Eruption', 'Explosion', 'Implosion', 'Collapse', 'Formation',
    
    // Structures
    'Station', 'Outpost', 'Base', 'Fortress', 'Citadel', 'Sanctuary',
    'Haven', 'Refuge', 'Shelter', 'Harbor', 'Dock', 'Port',
    
    // Natural formations
    'Cloud', 'Nebula', 'Cluster', 'Swarm', 'Flock', 'Herd', 'Crowd',
    'Field', 'Forest', 'Grove', 'Thicket', 'Cavern', 'Cave', 'Tunnel',
    
    // Abstract
    'Point', 'Place', 'Spot', 'Location', 'Area', 'Region', 'Territory',
    'Province', 'Country', 'Land', 'Continent', 'World', 'Realm'
];

// ===== STATION NAME COMPONENTS =====
export const stationPrefixes = [
    'Port', 'Station', 'Outpost', 'Base', 'Hold', 'Haven', 'Refuge',
    'Sanctuary', 'Citadel', 'Fortress', 'Colony', 'Settlement', 'Habitat',
    'Platform', 'Spire', 'Tower', 'Ring', 'Wheel', 'Dome', 'City',
    'Nexus', 'Hub', 'Center', 'Core', 'Heart', 'Capital', 'Metropolis'
];

export const stationSuffixes = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
    'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho',
    'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega',
    'Prime', 'Secundus', 'Tertius', 'Major', 'Minor', 'Central',
    'Nova', 'Vega', 'Orion', 'Cygnus', 'Lyra', 'Aurora', 'Eclipse'
];

// ===== SEEDED RANDOM FUNCTIONS =====
// These match the ones in procedural-universe.js for consistency

export function seededRandom(seed, index = 0) {
    const x = Math.sin(seed * (index + 1)) * 10000;
    return x - Math.floor(x);
}

export function seededRandomChoice(seed, index, array) {
    if (!array || array.length === 0) return 'Unknown';
    const choice = Math.floor(seededRandom(seed, index) * array.length);
    return array[choice];
}

export function seededRandomRange(seed, index, min, max) {
    return Math.floor(seededRandom(seed, index) * (max - min + 1)) + min;
}

// ===== STAR NAME GENERATION =====
// Generates names like: "Alpha Centauri", "Betelgeuse", "Sirius A"

export function generateStarName(seed, index = 0) {
    const style = seededRandomRange(seed, index, 1, 4);
    
    switch(style) {
        case 1: // Bayer designation: Alpha Centauri
            return seededRandomChoice(seed, index * 2, starPrefixes) + ' ' + 
                   seededRandomChoice(seed, index * 2 + 1, starSuffixes);
        
        case 2: // Proper name + letter: Sirius A
            const properNames = ['Sirius', 'Canopus', 'Rigel', 'Vega', 'Altair', 'Deneb', 'Betelgeuse', 'Antares'];
            return seededRandomChoice(seed, index * 3, properNames) + ' ' + 
                   seededRandomChoice(seed, index * 3 + 1, ['A', 'B', 'C', 'D']);
        
        case 3: // Catalog style: HD 40307
            const catalogs = ['HD', 'HIP', 'HR', 'GJ', 'LHS', 'BD', 'CD', 'CPD'];
            return seededRandomChoice(seed, index * 4, catalogs) + ' ' + 
                   seededRandomRange(seed, index * 4 + 1, 1000, 99999);
        
        case 4: // Simple: Algol Prime
            const simplePrefixes = ['Algol', 'Mira', 'Caph', 'Aludra', 'Bellatrix', 'Mintaka', 'Alnilam'];
            return seededRandomChoice(seed, index * 5, simplePrefixes) + ' ' + 
                   seededRandomChoice(seed, index * 5 + 1, ['Prime', 'Major', 'Minor', 'A', 'B']);
        
        default:
            return seededRandomChoice(seed, index, starPrefixes) + ' ' + 
                   seededRandomChoice(seed, index + 1, starSuffixes);
    }
}

// ===== PLANET NAME GENERATION =====
// Generates names like: "Verdant-3", "Pyros Prime", "Terra Nova"

export function generatePlanetName(seed, index = 0) {
    const style = seededRandomRange(seed, index, 1, 4);
    
    switch(style) {
        case 1: // Prefix + number: Verdant-3
            return seededRandomChoice(seed, index * 2, planetPrefixes) + '-' + 
                   seededRandomRange(seed, index * 2 + 1, 1, 12);
        
        case 2: // Prefix + suffix: Pyros Prime
            return seededRandomChoice(seed, index * 3, planetPrefixes) + ' ' + 
                   seededRandomChoice(seed, index * 3 + 1, planetSuffixes);
        
        case 3: // Roman numeral: Terra IV
            const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
            return seededRandomChoice(seed, index * 4, planetPrefixes) + ' ' + 
                   seededRandomChoice(seed, index * 4 + 1, roman);
        
        case 4: // Scientific: Gliese 581 c
            const scientific = ['Gliese', 'GJ', 'Luyten', 'Wolf', 'Ross', 'Lalande'];
            return seededRandomChoice(seed, index * 5, scientific) + ' ' + 
                   seededRandomRange(seed, index * 5 + 1, 100, 999) + ' ' +
                   seededRandomChoice(seed, index * 5 + 2, ['b', 'c', 'd', 'e', 'f', 'g']);
        
        default:
            return seededRandomChoice(seed, index, planetPrefixes) + '-' + 
                   seededRandomRange(seed, index + 1, 1, 8);
    }
}

// ===== ANOMALY NAME GENERATION =====
// Generates names like: "Dark Reach", "Crimson Void", "Whispering Rift"

export function generateAnomalyName(seed, index = 0) {
    const style = seededRandomRange(seed, index, 1, 3);
    
    switch(style) {
        case 1: // Prefix + suffix: Dark Reach
            return seededRandomChoice(seed, index * 2, anomalyPrefixes) + ' ' + 
                   seededRandomChoice(seed, index * 2 + 1, anomalySuffixes);
        
        case 2: // Color + Phenomenon: Crimson Rift
            const colors = ['Crimson', 'Azure', 'Emerald', 'Golden', 'Silver', 'Obsidian', 'Ruby', 'Jade'];
            return seededRandomChoice(seed, index * 3, colors) + ' ' + 
                   seededRandomChoice(seed, index * 3 + 1, ['Rift', 'Void', 'Abyss', 'Maw', 'Heart', 'Eye']);
        
        case 3: // Adjective + Location: Ancient Ruins
            const adjectives = ['Ancient', 'Forgotten', 'Lost', 'Eternal', 'Silent', 'Whispering', 'Screaming'];
            const locations = ['Ruins', 'Temple', 'Monolith', 'Pyramid', 'Structure', 'Formation', 'Remains'];
            return seededRandomChoice(seed, index * 4, adjectives) + ' ' + 
                   seededRandomChoice(seed, index * 4 + 1, locations);
        
        default:
            return seededRandomChoice(seed, index, anomalyPrefixes) + ' ' + 
                   seededRandomChoice(seed, index + 1, anomalySuffixes);
    }
}

// ===== STATION NAME GENERATION =====
// Generates names like: "Port Alpha", "Station Beta", "Outpost Prime"

export function generateStationName(seed, index = 0) {
    const style = seededRandomRange(seed, index, 1, 3);
    
    switch(style) {
        case 1: // Prefix + suffix: Port Alpha
            return seededRandomChoice(seed, index * 2, stationPrefixes) + ' ' + 
                   seededRandomChoice(seed, index * 2 + 1, stationSuffixes);
        
        case 2: // Named station: Armstrong Station
            const names = ['Armstrong', 'Aldrin', 'Gagarin', 'Tereshkova', 'Leonov', 'Ride', 'Jemison'];
            return seededRandomChoice(seed, index * 3, names) + ' ' + 
                   seededRandomChoice(seed, index * 3 + 1, ['Station', 'Base', 'Port']);
        
        case 3: // Location-based: Cygnus Prime Station
            return seededRandomChoice(seed, index * 4, starSuffixes) + ' ' + 
                   seededRandomChoice(seed, index * 4 + 1, ['Prime', 'Major']) + ' ' +
                   seededRandomChoice(seed, index * 4 + 2, ['Station', 'Base']);
        
        default:
            return seededRandomChoice(seed, index, stationPrefixes) + ' ' + 
                   seededRandomChoice(seed, index + 1, stationSuffixes);
    }
}

// ===== SYSTEM NAME GENERATION =====
// Generates a name for an entire star system

export function generateSystemName(seed, index = 0) {
    const style = seededRandomRange(seed, index, 1, 3);
    
    switch(style) {
        case 1: // Use star name as system name
            return generateStarName(seed, index);
        
        case 2: // Constellation-based
            return seededRandomChoice(seed, index, starSuffixes) + ' System';
        
        case 3: // Named system
            const names = ['Helios', 'Nova', 'Eclipse', 'Solstice', 'Equinox', 'Aurora', 'Zenith', 'Nadir'];
            return seededRandomChoice(seed, index, names) + ' System';
        
        default:
            return generateStarName(seed, index) + ' System';
    }
}

// ===== NEBULA NAME GENERATION =====
// Generates names for nebulae

export function generateNebulaName(seed, index = 0) {
    const nebulaNames = [
        'Orion', 'Cygnus', 'Sagittarius', 'Perseus', 'Carina', 'Eagle',
        'Omega', 'Trifid', 'Lagoon', 'Veil', 'Crab', 'Helix',
        'Rosette', 'Tarantula', 'Pelican', 'North America', 'Elephant Trunk', 'Bubble',
        'Horsehead', 'Flame', 'Witch Head', 'Monkey Head', 'Cone', 'Finger of God'
    ];
    
    const index2 = seededRandomRange(seed, index, 0, nebulaNames.length - 1);
    return nebulaNames[index2] + ' Nebula';
}

// ===== REGION NAME GENERATION =====
// Generates names for galactic regions

export function generateRegionName(seed, index = 0) {
    const regions = [
        'Orion Arm', 'Cygnus Arm', 'Perseus Arm', 'Sagittarius Arm', 'Carina Arm',
        'Norma Arm', 'Scutum Arm', 'Centaurus Arm', 'Outer Arm', 'Far Arm',
        'Galactic Core', 'Galactic Halo', 'Magellanic Stream', 'Orion Spur'
    ];
    
    const index2 = seededRandomRange(seed, index, 0, regions.length - 1);
    return regions[index2];
}

// ===== CONVENIENCE FUNCTIONS =====
// Generate multiple names at once

export function generateMultipleStarNames(seed, count) {
    const names = [];
    for (let i = 0; i < count; i++) {
        names.push(generateStarName(seed, i));
    }
    return names;
}

export function generateMultiplePlanetNames(seed, count) {
    const names = [];
    for (let i = 0; i < count; i++) {
        names.push(generatePlanetName(seed, i));
    }
    return names;
}

// ===== EXPORT =====
export default {
    // Components (for custom generation)
    starPrefixes,
    starSuffixes,
    planetPrefixes,
    planetSuffixes,
    anomalyPrefixes,
    anomalySuffixes,
    stationPrefixes,
    stationSuffixes,
    
    // Core generation functions
    generateStarName,
    generatePlanetName,
    generateAnomalyName,
    generateStationName,
    generateSystemName,
    generateNebulaName,
    generateRegionName,
    
    // Batch generation
    generateMultipleStarNames,
    generateMultiplePlanetNames,
    
    // Random utilities
    seededRandom,
    seededRandomChoice,
    seededRandomRange
};

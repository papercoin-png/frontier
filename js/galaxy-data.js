// js/galaxy-data.js
// Galaxy structure and sector data for Voidfarer's shared procedural universe
// Defines the 12 sectors of the Milky Way and their properties
// Static data with minimal dependencies

import { getCollection } from './storage.js';

// ===== CONSTANTS =====
export const GALAXY_SEED = 42793; // Must match procedural-universe.js

// ===== SECTOR DEFINITIONS =====
// 12 sectors in a 3x4 grid (A1 through C4)
// Each sector contains 6 nebulae

export const SECTORS = [
    // Row 1 (top)
    {
        id: 'A1',
        name: 'Cygnus Arm',
        description: 'Rich in young, hot stars and stellar nurseries. Home to the Cygnus Rift.',
        row: 0,
        col: 0,
        color: '#ff6a9a',
        nebulae: 6,
        stars: 300,
        explored: 23, // percentage
        distanceFromEarth: '3.2k ly',
        primaryNebula: 'Cygnus Nebula',
        coordinates: { x: 20, y: 15 }
    },
    {
        id: 'B1',
        name: 'Perseus Arm',
        description: 'One of the major spiral arms. Contains massive star-forming regions.',
        row: 0,
        col: 1,
        color: '#4affaa',
        nebulae: 6,
        stars: 300,
        explored: 15,
        distanceFromEarth: '4.1k ly',
        primaryNebula: 'Perseus Nebula',
        coordinates: { x: 50, y: 15 }
    },
    {
        id: 'C1',
        name: 'Outer Arm',
        description: 'The outermost spiral arm. Sparse but contains ancient stars.',
        row: 0,
        col: 2,
        color: '#8a8aaa',
        nebulae: 6,
        stars: 300,
        explored: 8,
        distanceFromEarth: '5.8k ly',
        primaryNebula: 'Outer Nebula',
        coordinates: { x: 80, y: 15 }
    },
    
    // Row 2
    {
        id: 'A2',
        name: 'Sagittarius Arm',
        description: 'Closer to the galactic core. Rich in heavy elements and ancient stars.',
        row: 1,
        col: 0,
        color: '#ffaa4a',
        nebulae: 6,
        stars: 300,
        explored: 31,
        distanceFromEarth: '1.8k ly',
        primaryNebula: 'Sagittarius Nebula',
        coordinates: { x: 20, y: 35 }
    },
    {
        id: 'B2',
        name: 'Orion Arm',
        description: 'Our home spiral arm. Contains the Solar System and many well-known nebulae.',
        row: 1,
        col: 1,
        color: '#8a6aff',
        nebulae: 6,
        stars: 300,
        explored: 42,
        distanceFromEarth: '0k ly',
        primaryNebula: 'Orion Nebula',
        coordinates: { x: 50, y: 35 },
        isHome: true
    },
    {
        id: 'C2',
        name: 'Carina Arm',
        description: 'Contains some of the most massive and luminous stars in the galaxy.',
        row: 1,
        col: 2,
        color: '#c06aff',
        nebulae: 6,
        stars: 300,
        explored: 12,
        distanceFromEarth: '2.7k ly',
        primaryNebula: 'Carina Nebula',
        coordinates: { x: 80, y: 35 }
    },
    
    // Row 3
    {
        id: 'A3',
        name: 'Norma Arm',
        description: 'A minor spiral arm near the galactic bar. Dense star clusters.',
        row: 2,
        col: 0,
        color: '#6a8aff',
        nebulae: 6,
        stars: 300,
        explored: 5,
        distanceFromEarth: '3.9k ly',
        primaryNebula: 'Norma Nebula',
        coordinates: { x: 20, y: 55 }
    },
    {
        id: 'B3',
        name: 'Scutum Arm',
        description: 'Rich in red giants and variable stars. Ancient stellar populations.',
        row: 2,
        col: 1,
        color: '#ff8a6a',
        nebulae: 6,
        stars: 300,
        explored: 9,
        distanceFromEarth: '2.4k ly',
        primaryNebula: 'Scutum Nebula',
        coordinates: { x: 50, y: 55 }
    },
    {
        id: 'C3',
        name: 'Centaurus Arm',
        description: 'Extends toward the galactic center. Contains many globular clusters.',
        row: 2,
        col: 2,
        color: '#6aff8a',
        nebulae: 6,
        stars: 300,
        explored: 17,
        distanceFromEarth: '3.1k ly',
        primaryNebula: 'Centaurus Nebula',
        coordinates: { x: 80, y: 55 }
    },
    
    // Row 4 (bottom)
    {
        id: 'A4',
        name: 'Far Arm',
        description: 'Distant spiral arm on the far side of the galaxy. Largely unexplored.',
        row: 3,
        col: 0,
        color: '#ff6aff',
        nebulae: 6,
        stars: 300,
        explored: 2,
        distanceFromEarth: '6.2k ly',
        primaryNebula: 'Far Nebula',
        coordinates: { x: 20, y: 75 }
    },
    {
        id: 'B4',
        name: 'Outer Reach',
        description: 'The boundary between the galactic disk and halo. Sparse stellar density.',
        row: 3,
        col: 1,
        color: '#8aff6a',
        nebulae: 6,
        stars: 300,
        explored: 1,
        distanceFromEarth: '7.5k ly',
        primaryNebula: 'Reach Nebula',
        coordinates: { x: 50, y: 75 }
    },
    {
        id: 'C4',
        name: 'Fringe',
        description: 'The edge of known space. Few have ventured this far from Earth.',
        row: 3,
        col: 2,
        color: '#ff8a8a',
        nebulae: 6,
        stars: 300,
        explored: 0,
        distanceFromEarth: '8.9k ly',
        primaryNebula: 'Fringe Nebula',
        coordinates: { x: 80, y: 75 }
    }
];

// ===== NEBULA NAMES BY SECTOR =====
// Each sector has 6 nebulae (procedurally generated, but names are fixed for reference)

export const SECTOR_NEBULAE = {
    'A1': ['Cygnus Nebula', 'Veil Nebula', 'Crescent Nebula', 'Butterfly Nebula', 'Blinking Nebula', 'Propeller Nebula'],
    'B1': ['Perseus Nebula', 'California Nebula', 'Heart Nebula', 'Soul Nebula', 'Little Dumbbell', 'Medusa Nebula'],
    'C1': ['Outer Nebula', 'Bubble Nebula', 'Crab Nebula', 'Jellyfish Nebula', 'Pelican Nebula', 'Flaming Star'],
    'A2': ['Sagittarius Nebula', 'Lagoon Nebula', 'Trifid Nebula', 'Omega Nebula', 'Eagle Nebula', 'Horseshoe Nebula'],
    'B2': ['Orion Nebula', 'Horsehead Nebula', 'Flame Nebula', 'M42', 'Barnard\'s Loop', 'Running Man Nebula'],
    'C2': ['Carina Nebula', 'Eta Carinae', 'Homunculus Nebula', 'Keyhole Nebula', 'Southern Pleiades', 'Wishing Well'],
    'A3': ['Norma Nebula', 'Dragonfish Nebula', 'Lobster Nebula', 'Cat\'s Paw Nebula', 'War and Peace', 'NGC 6188'],
    'B3': ['Scutum Nebula', 'Eagle Nebula', 'Omega Nebula', 'Swan Nebula', 'Lobster Claw', 'Star Queen'],
    'C3': ['Centaurus Nebula', 'Southern Cross', 'Jewel Box', 'Coalsack Nebula', 'Running Chicken', 'Lambda Centauri'],
    'A4': ['Far Nebula', 'Andromeda Nebula', 'Triangulum Nebula', 'Sculptor Nebula', 'Fornax Nebula', 'Eridanus Loop'],
    'B4': ['Reach Nebula', 'Ghost Nebula', 'Witch Head Nebula', 'Monkey Head', 'Cone Nebula', 'Christmas Tree'],
    'C4': ['Fringe Nebula', 'Spider Nebula', 'Tarantula Nebula', 'Tadpole Nebula', 'Elephant Trunk', 'Iris Nebula']
};

// ===== SECTOR NEIGHBORS =====
// Which sectors are adjacent (for navigation/warp calculations)

export const SECTOR_CONNECTIONS = {
    'A1': ['B1', 'A2'],
    'B1': ['A1', 'C1', 'B2'],
    'C1': ['B1', 'C2'],
    'A2': ['A1', 'B2', 'A3'],
    'B2': ['B1', 'A2', 'C2', 'B3'],
    'C2': ['C1', 'B2', 'C3'],
    'A3': ['A2', 'B3', 'A4'],
    'B3': ['B2', 'A3', 'C3', 'B4'],
    'C3': ['C2', 'B3', 'C4'],
    'A4': ['A3', 'B4'],
    'B4': ['B3', 'A4', 'C4'],
    'C4': ['C3', 'B4']
};

// ===== GALAXY STATISTICS =====
export const GALAXY_STATS = {
    totalSectors: SECTORS.length,
    totalNebulae: SECTORS.length * 6, // 12 sectors × 6 nebulae = 72
    totalStars: SECTORS.length * 6 * 50, // 72 nebulae × 50 stars = 3,600
    totalPlanets: 3600 * 5, // Average 5 planets per star = 18,000
    exploredPercentage: 14, // Overall galaxy exploration percentage
    galacticCore: {
        name: 'Sagittarius A*',
        type: 'Supermassive Black Hole',
        distanceFromEarth: '26k ly',
        mass: '4.3 million solar masses'
    }
};

// ===== NOTABLE LOCATIONS =====
// Hand-crafted special locations for players to discover

export const NOTABLE_LOCATIONS = [
    {
        name: 'Earth',
        sector: 'B2',
        nebula: 'Orion Nebula',
        star: 'Sol',
        planet: 'Earth',
        type: 'home',
        description: 'Humanity\'s home world. The starting point of all journeys.'
    },
    {
        name: 'Pioneer Station',
        sector: 'B2',
        nebula: 'Orion Nebula',
        star: 'Sol',
        planet: 'Luna',
        type: 'station',
        description: 'Earth\'s primary orbital station. Trade and refueling hub.'
    },
    {
        name: 'Great Rift',
        sector: 'A1',
        nebula: 'Cygnus Nebula',
        type: 'anomaly',
        description: 'A massive dark nebula blocking view of the galactic center.'
    },
    {
        name: 'Eta Carinae',
        sector: 'C2',
        nebula: 'Carina Nebula',
        type: 'star',
        description: 'One of the most massive and luminous stars known. Unstable.'
    },
    {
        name: 'Galactic Core',
        sector: 'A3',
        type: 'anomaly',
        description: 'The center of the Milky Way, home to a supermassive black hole.'
    }
];

// ===== HELPER FUNCTIONS =====

// Get sector by ID
export function getSector(sectorId) {
    return SECTORS.find(s => s.id === sectorId) || SECTORS[4]; // Default to B2 (Orion Arm)
}

// Get sector by name
export function getSectorByName(name) {
    return SECTORS.find(s => s.name === name) || SECTORS[4];
}

// Get current sector (from localStorage or default to B2)
export function getCurrentSector() {
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('voidfarer_current_galaxy_sector');
        if (saved) return getSector(saved);
    }
    return getSector('B2'); // Default to Orion Arm
}

// Get nebulae for a sector
export function getNebulaeForSector(sectorId) {
    return SECTOR_NEBULAE[sectorId] || SECTOR_NEBULAE['B2'];
}

// Check if sector is explored (based on player collection) - NOW ASYNC
export async function isSectorExplored(sectorId, collection = null) {
    // If collection not provided, try to get it
    if (!collection) {
        try {
            collection = await getCollection();
        } catch (e) {
            console.warn('Could not load collection for exploration check', e);
            return false;
        }
    }
    
    if (!collection || typeof collection !== 'object') return false;
    
    // Check if any element was found in this sector
    // Note: This assumes elements have location data with sector info
    // You may need to adjust this based on your actual data structure
    for (const elementName of Object.keys(collection)) {
        const elementData = collection[elementName];
        if (elementData?.location?.sector === sectorId) {
            return true;
        }
    }
    
    return false;
}

// Get exploration percentage for a sector - NOW ASYNC
export async function getSectorExplorationPercentage(sectorId, collection = null) {
    // If collection not provided, try to get it
    if (!collection) {
        try {
            collection = await getCollection();
        } catch (e) {
            console.warn('Could not load collection for exploration percentage', e);
            return 0;
        }
    }
    
    const sector = getSector(sectorId);
    if (!sector) return 0;
    
    // Base exploration from sector definition
    let percentage = sector.explored;
    
    // Boost based on player discoveries
    let discoveries = 0;
    for (const elementName of Object.keys(collection)) {
        const elementData = collection[elementName];
        if (elementData?.location?.sector === sectorId) {
            discoveries++;
        }
    }
    
    // Each discovery adds a small percentage (max +20%)
    const discoveryBonus = Math.min(discoveries * 0.5, 20);
    
    return Math.min(percentage + discoveryBonus, 100);
}

// Calculate warp distance between sectors
export function getWarpDistance(fromSector, toSector) {
    const from = getSector(fromSector);
    const to = getSector(toSector);
    
    if (!from || !to) return 10; // Default distance
    
    // Manhattan distance on the grid
    const rowDist = Math.abs(from.row - to.row);
    const colDist = Math.abs(from.col - to.col);
    
    // Base distance + extra for unexplored regions
    const baseDistance = (rowDist + colDist) * 1.5;
    
    // Add extra distance for far sectors
    const farBonus = to.row > 2 ? 2 : 0;
    
    return baseDistance + farBonus;
}

// Get warp fuel cost between sectors
export function getWarpFuelCost(fromSector, toSector) {
    const distance = getWarpDistance(fromSector, toSector);
    return Math.ceil(distance * 10);
}

// Get all visited sectors from collection - NOW ASYNC
export async function getVisitedSectors(collection = null) {
    // If collection not provided, try to get it
    if (!collection) {
        try {
            collection = await getCollection();
        } catch (e) {
            console.warn('Could not load collection for visited sectors', e);
            return [];
        }
    }
    
    const visited = new Set();
    
    for (const elementName of Object.keys(collection)) {
        const elementData = collection[elementName];
        if (elementData?.location?.sector) {
            visited.add(elementData.location.sector);
        }
    }
    
    return Array.from(visited).sort();
}

// Get unexplored sectors - NOW ASYNC
export async function getUnexploredSectors(collection = null) {
    const visited = await getVisitedSectors(collection);
    return SECTORS.filter(s => !visited.includes(s.id)).map(s => s.id);
}

// Get sector color
export function getSectorColor(sectorId) {
    const sector = getSector(sectorId);
    return sector?.color || '#8a6aff';
}

// Check if two sectors are adjacent
export function areSectorsAdjacent(sector1, sector2) {
    const connections = SECTOR_CONNECTIONS[sector1];
    return connections?.includes(sector2) || false;
}

// Get neighboring sectors
export function getNeighboringSectors(sectorId) {
    return SECTOR_CONNECTIONS[sectorId] || [];
}

// Get sector description
export function getSectorDescription(sectorId) {
    const sector = getSector(sectorId);
    return sector?.description || 'Unknown region of space.';
}

// Get sector distance from Earth
export function getSectorDistance(sectorId) {
    const sector = getSector(sectorId);
    return sector?.distanceFromEarth || 'Unknown';
}

// Format sector coordinates for display
export function formatSectorCoordinates(sectorId) {
    const sector = getSector(sectorId);
    if (!sector) return 'Unknown';
    
    return `${sector.name} (Sector ${sectorId})`;
}

// Get random unexplored sector (for mission generation) - NOW ASYNC
export async function getRandomUnexploredSector(collection = null) {
    const unexplored = await getUnexploredSectors(collection);
    
    if (unexplored.length === 0) {
        // All sectors explored, return random sector
        const randomIndex = Math.floor(Math.random() * SECTORS.length);
        return SECTORS[randomIndex].id;
    }
    
    const randomIndex = Math.floor(Math.random() * unexplored.length);
    return unexplored[randomIndex];
}

// Get sector statistics summary - NOW ASYNC
export async function getSectorSummary(sectorId, collection = null) {
    const sector = getSector(sectorId);
    if (!sector) return null;
    
    const visited = await isSectorExplored(sectorId, collection);
    const percentage = await getSectorExplorationPercentage(sectorId, collection);
    const neighbors = getNeighboringSectors(sectorId);
    const nebulae = getNebulaeForSector(sectorId);
    
    return {
        id: sector.id,
        name: sector.name,
        description: sector.description,
        visited: visited,
        explorationPercentage: percentage,
        neighbors: neighbors,
        nebulaeCount: nebulae.length,
        nebulae: nebulae,
        distanceFromEarth: sector.distanceFromEarth,
        color: sector.color,
        isHome: sector.isHome || false
    };
}

// Get galaxy overview statistics - NOW ASYNC
export async function getGalaxyOverview(collection = null) {
    const visited = await getVisitedSectors(collection);
    
    return {
        totalSectors: GALAXY_STATS.totalSectors,
        visitedSectors: visited.length,
        unexploredSectors: GALAXY_STATS.totalSectors - visited.length,
        totalNebulae: GALAXY_STATS.totalNebulae,
        totalStars: GALAXY_STATS.totalStars,
        totalPlanets: GALAXY_STATS.totalPlanets,
        explorationPercentage: Math.round((visited.length / GALAXY_STATS.totalSectors) * 100),
        galacticCore: GALAXY_STATS.galacticCore
    };
}

// ===== EXPORT =====
export default {
    SECTORS,
    SECTOR_NEBULAE,
    SECTOR_CONNECTIONS,
    GALAXY_STATS,
    NOTABLE_LOCATIONS,
    getSector,
    getSectorByName,
    getCurrentSector,
    getNebulaeForSector,
    isSectorExplored,
    getSectorExplorationPercentage,
    getWarpDistance,
    getWarpFuelCost,
    getVisitedSectors,
    getUnexploredSectors,
    getSectorColor,
    areSectorsAdjacent,
    getNeighboringSectors,
    getSectorDescription,
    getSectorDistance,
    formatSectorCoordinates,
    getRandomUnexploredSector,
    getSectorSummary,
    getGalaxyOverview
};

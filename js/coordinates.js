// coordinates.js - Universal coordinate and distance system for Voidfarer
// All distances are abstract "light years" (LY) for gameplay feel, not realistic

// ===== CONSTANTS =====
const UNIVERSE_SEED = 42793;
const WARP_CYCLE_DURATION = 2000; // 2 seconds per cycle
const FUEL_PER_LY = 4; // Base fuel cost per light year
const BASE_FUEL_COST = 5; // Minimum fuel cost for any jump

// ===== SECTOR COORDINATES (Galaxy Map Level) =====
// 3x4 grid of sectors (A1 through C4)
const SECTOR_COORDS = {
    // Row 1 (top)
    'A1': { x: 0, y: 0, name: 'Cygnus Arm' },
    'B1': { x: 1, y: 0, name: 'Perseus Arm' },
    'C1': { x: 2, y: 0, name: 'Core' },
    
    // Row 2
    'A2': { x: 0, y: 1, name: 'Outer Arm' },
    'B2': { x: 1, y: 1, name: 'Orion Arm' },
    'C2': { x: 2, y: 1, name: 'Sagittarius Arm' },
    
    // Row 3
    'A3': { x: 0, y: 2, name: 'Carina Arm' },
    'B3': { x: 1, y: 2, name: 'Norma Arm' },
    'C3': { x: 2, y: 2, name: 'Scutum Arm' },
    
    // Row 4 (bottom)
    'A4': { x: 0, y: 3, name: 'Far Arm' },
    'B4': { x: 1, y: 3, name: 'Outer Reach' },
    'C4': { x: 2, y: 3, name: 'Fringe' }
};

// ===== GALAXY-LEVEL DISTANCE CALCULATION =====
// Calculate distance between two sectors
function getSectorDistance(sector1, sector2) {
    const s1 = SECTOR_COORDS[sector1] || SECTOR_COORDS['B2'];
    const s2 = SECTOR_COORDS[sector2] || SECTOR_COORDS['B2'];
    
    // Manhattan distance (grid-based)
    const dx = Math.abs(s1.x - s2.x);
    const dy = Math.abs(s1.y - s2.y);
    const gridDistance = dx + dy;
    
    // Convert to "light years" (abstract)
    // Same sector = 0 LY, adjacent = 2.3 LY, across galaxy = up to 11.5 LY
    return gridDistance * 2.3;
}

// ===== NEBULA/SECTOR LEVEL DISTANCE CALCULATION =====
// Calculate distance between two nebulae/star sectors (using percentage positions)
function getNebulaDistance(x1, y1, x2, y2) {
    // Convert percentage positions (0-100) to relative coordinates
    const dx = (x1 - x2) / 10; // Scale down to 0-10 range
    const dy = (y1 - y2) / 10;
    
    // Euclidean distance
    const distance = Math.sqrt(dx*dx + dy*dy) * 2.5;
    
    return Math.max(0.5, Math.min(distance, 8.0)); // Cap between 0.5 and 8 LY
}

// ===== STAR CLUSTER LEVEL DISTANCE CALCULATION =====
// Calculate distance between two stars (using percentage positions within cluster)
function getStarDistance(x1, y1, x2, y2) {
    // Stars are much closer together
    const dx = (x1 - x2) / 50; // Scale down more
    const dy = (y1 - y2) / 50;
    
    const distance = Math.sqrt(dx*dx + dy*dy) * 1.5;
    
    return Math.max(0.1, Math.min(distance, 3.0)); // Between 0.1 and 3 LY
}

// ===== WARP CYCLE CALCULATION =====
// Convert distance to warp cycles (1 cycle = 2 seconds)
function getWarpCycles(distance) {
    if (distance <= 1.0) return 1;      // Very close
    if (distance <= 2.5) return 2;      // Close
    if (distance <= 4.5) return 3;      // Medium
    if (distance <= 7.0) return 4;      // Far
    return 5;                            // Maximum distance
}

// ===== FUEL COST CALCULATION =====
// Calculate fuel cost based on distance
function getFuelCost(distance) {
    return Math.floor(distance * FUEL_PER_LY) + BASE_FUEL_COST;
}

// ===== TRAVEL TIME CALCULATION =====
// Get total travel time in seconds
function getTravelTime(cycles) {
    return cycles * (WARP_CYCLE_DURATION / 1000);
}

// ===== FORMATTING HELPERS =====
// Format distance for display
function formatDistance(distance) {
    return distance.toFixed(1) + ' LY';
}

// Format cycles for display
function formatCycles(cycles) {
    return cycles + ' cycle' + (cycles > 1 ? 's' : '');
}

// Format fuel for display
function formatFuel(fuel) {
    return fuel + ' ⭐';
}

// Format time for display
function formatTime(seconds) {
    return seconds + ' sec';
}

// ===== COMPLETE TRIP CALCULATION =====
// Get all trip data at once
function calculateTrip(distance) {
    const cycles = getWarpCycles(distance);
    const fuel = getFuelCost(distance);
    const time = getTravelTime(cycles);
    
    return {
        distance: distance,
        distanceFormatted: formatDistance(distance),
        cycles: cycles,
        cyclesFormatted: formatCycles(cycles),
        fuel: fuel,
        fuelFormatted: formatFuel(fuel),
        time: time,
        timeFormatted: formatTime(time),
        durationMs: cycles * WARP_CYCLE_DURATION
    };
}

// ===== SECTOR TRIP =====
// Calculate trip between two sectors
function calculateSectorTrip(sector1, sector2) {
    const distance = getSectorDistance(sector1, sector2);
    return calculateTrip(distance);
}

// ===== NEBULA TRIP =====
// Calculate trip between two nebulae
function calculateNebulaTrip(x1, y1, x2, y2) {
    const distance = getNebulaDistance(x1, y1, x2, y2);
    return calculateTrip(distance);
}

// ===== STAR TRIP =====
// Calculate trip between two stars
function calculateStarTrip(x1, y1, x2, y2) {
    const distance = getStarDistance(x1, y1, x2, y2);
    return calculateTrip(distance);
}

// ===== CURRENT LOCATION HELPERS =====
// Get current sector from localStorage
function getCurrentSector() {
    return localStorage.getItem('voidfarer_current_sector') || 'B2';
}

// Get current nebula coordinates from localStorage
function getCurrentNebulaCoords() {
    const x = parseFloat(localStorage.getItem('voidfarer_current_sector_x')) || 30;
    const y = parseFloat(localStorage.getItem('voidfarer_current_sector_y')) || 40;
    return { x, y };
}

// Get current star coordinates from localStorage
function getCurrentStarCoords() {
    const x = parseFloat(localStorage.getItem('voidfarer_current_star_x')) || 50;
    const y = parseFloat(localStorage.getItem('voidfarer_current_star_y')) || 50;
    return { x, y };
}

// ===== SAVE TRIP FOR WARP =====
// Save trip data to localStorage for warp.html
function saveWarpData(destination, returnPage, tripData) {
    localStorage.setItem('voidfarer_warp_destination', destination);
    localStorage.setItem('voidfarer_warp_return', returnPage);
    localStorage.setItem('voidfarer_warp_cycles', tripData.cycles);
    localStorage.setItem('voidfarer_warp_distance', tripData.distance);
    localStorage.setItem('voidfarer_warp_fuel', tripData.fuel);
}

// ===== EXPORT =====
// Make all functions available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UNIVERSE_SEED,
        WARP_CYCLE_DURATION,
        SECTOR_COORDS,
        getSectorDistance,
        getNebulaDistance,
        getStarDistance,
        getWarpCycles,
        getFuelCost,
        getTravelTime,
        formatDistance,
        formatCycles,
        formatFuel,
        formatTime,
        calculateTrip,
        calculateSectorTrip,
        calculateNebulaTrip,
        calculateStarTrip,
        getCurrentSector,
        getCurrentNebulaCoords,
        getCurrentStarCoords,
        saveWarpData
    };
}

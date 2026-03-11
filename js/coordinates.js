// js/coordinates.js - Universal coordinate and distance system for Voidfarer
// All distances are abstract "light years" (LY) for gameplay feel, not realistic
// Pure calculation module - no storage dependencies

// ===== CONSTANTS =====
export const UNIVERSE_SEED = 42793;
export const WARP_CYCLE_DURATION = 2000; // 2 seconds per cycle
export const FUEL_PER_LY = 4; // Base fuel cost per light year
export const BASE_FUEL_COST = 5; // Minimum fuel cost for any jump

// ===== SECTOR COORDINATES (Galaxy Map Level) =====
// 3x4 grid of sectors (A1 through C4)
export const SECTOR_COORDS = {
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
export function getSectorDistance(sector1, sector2) {
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
export function getNebulaDistance(x1, y1, x2, y2) {
    // Convert percentage positions (0-100) to relative coordinates
    const dx = (x1 - x2) / 10; // Scale down to 0-10 range
    const dy = (y1 - y2) / 10;
    
    // Euclidean distance
    const distance = Math.sqrt(dx*dx + dy*dy) * 2.5;
    
    return Math.max(0.5, Math.min(distance, 8.0)); // Cap between 0.5 and 8 LY
}

// ===== STAR CLUSTER LEVEL DISTANCE CALCULATION =====
// Calculate distance between two stars (using percentage positions within cluster)
export function getStarDistance(x1, y1, x2, y2) {
    // Stars are much closer together
    const dx = (x1 - x2) / 50; // Scale down more
    const dy = (y1 - y2) / 50;
    
    const distance = Math.sqrt(dx*dx + dy*dy) * 1.5;
    
    return Math.max(0.1, Math.min(distance, 3.0)); // Between 0.1 and 3 LY
}

// ===== WARP CYCLE CALCULATION =====
// Convert distance to warp cycles (1 cycle = 2 seconds)
export function getWarpCycles(distance) {
    if (distance <= 1.0) return 1;      // Very close
    if (distance <= 2.5) return 2;      // Close
    if (distance <= 4.5) return 3;      // Medium
    if (distance <= 7.0) return 4;      // Far
    return 5;                            // Maximum distance
}

// ===== FUEL COST CALCULATION =====
// Calculate fuel cost based on distance
export function getFuelCost(distance) {
    return Math.floor(distance * FUEL_PER_LY) + BASE_FUEL_COST;
}

// ===== TRAVEL TIME CALCULATION =====
// Get total travel time in seconds
export function getTravelTime(cycles) {
    return cycles * (WARP_CYCLE_DURATION / 1000);
}

// ===== FORMATTING HELPERS =====
// Format distance for display
export function formatDistance(distance) {
    return distance.toFixed(1) + ' LY';
}

// Format cycles for display
export function formatCycles(cycles) {
    return cycles + ' cycle' + (cycles > 1 ? 's' : '');
}

// Format fuel for display
export function formatFuel(fuel) {
    return fuel + ' ⭐';
}

// Format time for display
export function formatTime(seconds) {
    return seconds + ' sec';
}

// ===== COMPLETE TRIP CALCULATION =====
// Get all trip data at once
export function calculateTrip(distance) {
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
export function calculateSectorTrip(sector1, sector2) {
    const distance = getSectorDistance(sector1, sector2);
    return calculateTrip(distance);
}

// ===== NEBULA TRIP =====
// Calculate trip between two nebulae
export function calculateNebulaTrip(x1, y1, x2, y2) {
    const distance = getNebulaDistance(x1, y1, x2, y2);
    return calculateTrip(distance);
}

// ===== STAR TRIP =====
// Calculate trip between two stars
export function calculateStarTrip(x1, y1, x2, y2) {
    const distance = getStarDistance(x1, y1, x2, y2);
    return calculateTrip(distance);
}

// ===== CURRENT LOCATION HELPERS (uses localStorage) =====
// These are the only functions that interact with storage
// They remain synchronous as they use localStorage directly

export function getCurrentSector() {
    return localStorage.getItem('voidfarer_current_sector') || 'B2';
}

export function getCurrentNebulaCoords() {
    const x = parseFloat(localStorage.getItem('voidfarer_current_sector_x')) || 30;
    const y = parseFloat(localStorage.getItem('voidfarer_current_sector_y')) || 40;
    return { x, y };
}

export function getCurrentStarCoords() {
    const x = parseFloat(localStorage.getItem('voidfarer_current_star_x')) || 50;
    const y = parseFloat(localStorage.getItem('voidfarer_current_star_y')) || 50;
    return { x, y };
}

// ===== SAVE TRIP FOR WARP =====
// Save trip data to localStorage for warp.html
export function saveWarpData(destination, returnPage, tripData) {
    localStorage.setItem('voidfarer_warp_destination', destination);
    localStorage.setItem('voidfarer_warp_return', returnPage);
    localStorage.setItem('voidfarer_warp_cycles', tripData.cycles);
    localStorage.setItem('voidfarer_warp_distance', tripData.distance);
    localStorage.setItem('voidfarer_warp_fuel', tripData.fuel);
}

// ===== UTILITY FUNCTIONS =====
// Get distance between two points in 2D space
export function getEuclideanDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx*dx + dy*dy);
}

// Get Manhattan distance between two points
export function getManhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Convert light years to a readable string with appropriate units
export function lightYearsToString(ly) {
    if (ly < 0.1) return (ly * 1000).toFixed(0) + ' mLY';
    if (ly < 1) return (ly * 100).toFixed(0) + ' cLY';
    return ly.toFixed(1) + ' LY';
}

// Parse a light years string back to number
export function stringToLightYears(str) {
    if (str.includes('mLY')) return parseFloat(str) / 1000;
    if (str.includes('cLY')) return parseFloat(str) / 100;
    return parseFloat(str);
}

// ===== EXPORT =====
export default {
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
    saveWarpData,
    getEuclideanDistance,
    getManhattanDistance,
    lightYearsToString,
    stringToLightYears
};

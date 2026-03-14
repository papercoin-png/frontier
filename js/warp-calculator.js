// js/warp-calculator.js - Distance and warp calculation utilities for Voidfarer
// Handles all warp-related math including fuel costs, travel time, and cycle calculations

// ===== WARP CONFIG is now imported from navigation.js via window object =====
// We'll use window.WARP_CONFIG if available, otherwise fallback to local values

// ===== DISTANCE TO CYCLES MAPPING =====
function getWarpCyclesFromDistance(distance) {
    if (distance <= 1.0) return 1; // Very close (0-1 LY)
    if (distance <= 2.5) return 2; // Close (1-2.5 LY)
    if (distance <= 4.5) return 3; // Medium (2.5-4.5 LY)
    if (distance <= 7.0) return 4; // Far (4.5-7 LY)
    return 5; // Maximum distance (7+ LY)
}

// ===== FUEL COST CALCULATION =====
function getFuelCostFromDistance(distance) {
    const fuelPerLy = window.WARP_CONFIG?.FUEL_PER_LY || 4;
    const baseFuel = window.WARP_CONFIG?.BASE_FUEL_COST || 5;
    return Math.floor(distance * fuelPerLy) + baseFuel;
}

// ===== TRAVEL TIME CALCULATION =====
function getTravelTimeFromCycles(cycles) {
    const cycleDuration = window.WARP_CONFIG?.CYCLE_DURATION || 2000;
    return cycles * (cycleDuration / 1000); // Returns seconds
}

function getTravelTimeMsFromCycles(cycles) {
    const cycleDuration = window.WARP_CONFIG?.CYCLE_DURATION || 2000;
    return cycles * cycleDuration; // Returns milliseconds
}

// ===== DISTANCE TO LIGHT YEARS =====
// Convert raw distance units to display light years
function formatLightYears(distance) {
    return distance.toFixed(1) + ' LY';
}

// ===== CYCLE FORMATTING =====
function formatCycles(cycles) {
    return cycles + ' cycle' + (cycles > 1 ? 's' : '');
}

// ===== FUEL FORMATTING =====
function formatFuel(fuel) {
    return fuel + ' ⭐';
}

// ===== TIME FORMATTING =====
function formatTime(seconds) {
    if (seconds < 60) {
        return seconds + ' sec';
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return minutes + ' min ' + remainingSeconds + ' sec';
    }
}

// ===== COMPLETE TRIP CALCULATION =====
function calculateTrip(distance) {
    const cycles = getWarpCyclesFromDistance(distance);
    const fuel = getFuelCostFromDistance(distance);
    const timeSec = getTravelTimeFromCycles(cycles);
    const timeMs = getTravelTimeMsFromCycles(cycles);
    
    return {
        // Raw values
        distance: distance,
        cycles: cycles,
        fuel: fuel,
        timeSec: timeSec,
        timeMs: timeMs,
        
        // Formatted values
        distanceFormatted: formatLightYears(distance),
        cyclesFormatted: formatCycles(cycles),
        fuelFormatted: formatFuel(fuel),
        timeFormatted: formatTime(timeSec),
        
        // Metadata
        isValid: distance > 0,
        isLongJump: cycles >= 4,
        isEpicJump: cycles >= 5
    };
}

// ===== SECTOR-LEVEL TRIP =====
// Calculate trip between two galaxy sectors
function calculateSectorTrip(sector1, sector2, sectorCoords) {
    const s1 = sectorCoords[sector1] || { x: 1, y: 1 };
    const s2 = sectorCoords[sector2] || { x: 1, y: 1 };
    
    // Manhattan distance for grid
    const dx = Math.abs(s1.x - s2.x);
    const dy = Math.abs(s1.y - s2.y);
    const gridDistance = dx + dy;
    
    // Convert to light years (same sector = 0, adjacent = 2.3, max = 11.5)
    const distance = gridDistance * 2.3;
    
    return calculateTrip(distance);
}

// ===== NEBULA/SECTOR-LEVEL TRIP =====
// Calculate trip between two nebulae/star sectors (using percentage positions)
function calculateNebulaTrip(x1, y1, x2, y2) {
    // Convert percentage positions (0-100) to relative coordinates
    const dx = (x1 - x2) / 10; // Scale down to 0-10 range
    const dy = (y1 - y2) / 10;
    
    // Euclidean distance
    const distance = Math.sqrt(dx*dx + dy*dy) * 2.5;
    
    // Clamp to reasonable range (0.5 to 8 LY)
    const clampedDistance = Math.max(0.5, Math.min(distance, 8.0));
    
    return calculateTrip(clampedDistance);
}

// ===== STAR-LEVEL TRIP =====
// Calculate trip between two stars within a cluster
function calculateStarTrip(x1, y1, x2, y2) {
    // Stars are much closer together
    const dx = (x1 - x2) / 50; // Scale down more
    const dy = (y1 - y2) / 50;
    
    const distance = Math.sqrt(dx*dx + dy*dy) * 1.5;
    
    // Clamp to reasonable range (0.1 to 3 LY)
    const clampedDistance = Math.max(0.1, Math.min(distance, 3.0));
    
    return calculateTrip(clampedDistance);
}

// ===== FUEL CHECK =====
// Check if player has enough fuel for a trip
function hasEnoughFuel(currentFuel, tripData) {
    return currentFuel >= tripData.fuel;
}

// ===== FUEL USAGE =====
// Use fuel for a trip (returns true if successful)
function useFuelForTrip(currentFuel, tripData, fuelUpdateCallback) {
    if (!hasEnoughFuel(currentFuel, tripData)) {
        return false;
    }
    
    const newFuel = currentFuel - tripData.fuel;
    
    if (fuelUpdateCallback) {
        fuelUpdateCallback(newFuel);
    }
    
    return true;
}

// ===== WARP DATA PREPARATION =====
// Prepare warp data for warp.html
function prepareWarpData(destination, returnPage, tripData) {
    return {
        destination: destination,
        returnPage: returnPage,
        cycles: tripData.cycles,
        distance: tripData.distance,
        fuel: tripData.fuel,
        timeMs: tripData.timeMs,
        
        // For localStorage
        storageData: {
            'voidfarer_warp_destination': destination,
            'voidfarer_warp_return': returnPage,
            'voidfarer_warp_cycles': tripData.cycles.toString(),
            'voidfarer_warp_distance': tripData.distance.toString(),
            'voidfarer_warp_fuel': tripData.fuel.toString()
        }
    };
}

// ===== SAVE WARP DATA TO LOCALSTORAGE =====
function saveWarpData(destination, returnPage, tripData) {
    localStorage.setItem('voidfarer_warp_destination', destination);
    localStorage.setItem('voidfarer_warp_return', returnPage);
    localStorage.setItem('voidfarer_warp_cycles', tripData.cycles.toString());
    localStorage.setItem('voidfarer_warp_distance', tripData.distance.toString());
    localStorage.setItem('voidfarer_warp_fuel', tripData.fuel.toString());
}

// ===== GET WARP DATA FROM LOCALSTORAGE =====
function getWarpData() {
    return {
        destination: localStorage.getItem('voidfarer_warp_destination') || 'Unknown',
        returnPage: localStorage.getItem('voidfarer_warp_return') || 'galaxy-map.html',
        cycles: parseInt(localStorage.getItem('voidfarer_warp_cycles')) || 1,
        distance: parseFloat(localStorage.getItem('voidfarer_warp_distance')) || 0,
        fuel: parseInt(localStorage.getItem('voidfarer_warp_fuel')) || 0
    };
}

// ===== CLEAR WARP DATA =====
function clearWarpData() {
    localStorage.removeItem('voidfarer_warp_destination');
    localStorage.removeItem('voidfarer_warp_return');
    localStorage.removeItem('voidfarer_warp_cycles');
    localStorage.removeItem('voidfarer_warp_distance');
    localStorage.removeItem('voidfarer_warp_fuel');
}

// ===== WARP CYCLE PROGRESS =====
// Calculate progress within a warp cycle (0 to 1)
function getCycleProgress(cycleStartTime, currentTime) {
    const cycleDuration = window.WARP_CONFIG?.CYCLE_DURATION || 2000;
    const elapsed = currentTime - cycleStartTime;
    return Math.min(elapsed / cycleDuration, 1.0);
}

// ===== WARP SPEED FACTOR =====
// Get speed factor based on cycle progress (accelerate then decelerate)
function getWarpSpeedFactor(cycleProgress) {
    if (cycleProgress < 0.3) {
        // Accelerating phase
        return 0.3 + (cycleProgress / 0.3) * 0.7;
    } else if (cycleProgress > 0.7) {
        // Decelerating phase
        return 1.0 - ((cycleProgress - 0.7) / 0.3) * 0.7;
    } else {
        // Cruise phase
        return 1.0;
    }
}

// ===== TOTAL WARP PROGRESS =====
// Calculate overall warp progress (0 to 1)
function getTotalWarpProgress(startTime, currentTime, totalCycles) {
    const cycleDuration = window.WARP_CONFIG?.CYCLE_DURATION || 2000;
    const totalDuration = totalCycles * cycleDuration;
    const elapsed = currentTime - startTime;
    return Math.min(elapsed / totalDuration, 1.0);
}

// ===== CURRENT CYCLE NUMBER =====
// Get current cycle number based on elapsed time
function getCurrentCycle(startTime, currentTime) {
    const cycleDuration = window.WARP_CONFIG?.CYCLE_DURATION || 2000;
    const elapsed = currentTime - startTime;
    return Math.floor(elapsed / cycleDuration) + 1;
}

// ===== IS WARP COMPLETE =====
function isWarpComplete(startTime, currentTime, totalCycles) {
    const cycleDuration = window.WARP_CONFIG?.CYCLE_DURATION || 2000;
    const elapsed = currentTime - startTime;
    const totalDuration = totalCycles * cycleDuration;
    return elapsed >= totalDuration;
}

// ===== WARP STATUS MESSAGES =====
function getWarpStatusMessage(cycle, totalCycles) {
    if (cycle === 1) return 'INITIATING WARP';
    if (cycle === totalCycles) return 'FINAL CYCLE';
    if (cycle > totalCycles) return 'ARRIVED';
    return `WARP CYCLE ${cycle}`;
}

// ===== UTILITY FUNCTIONS =====
// Calculate the visual "streak" length for warp effect
function getStreakLength(speedFactor, distance) {
    return Math.min(50, 10 + speedFactor * 20 + (distance / 10));
}

// Calculate star brightness during warp
function getStarBrightness(z, speedFactor) {
    const baseBrightness = Math.min(1, 0.3 + (2000 - z) / 2000);
    return baseBrightness * (0.5 + speedFactor * 0.5);
}

// Calculate star size during warp
function getStarSize(z, speedFactor, baseSize = 1) {
    return baseSize + (2000 - z) / 200 * speedFactor;
}

// ===== EXPOSE TO WINDOW =====
// Note: WARP_CONFIG is already exposed by navigation.js
window.getWarpCyclesFromDistance = getWarpCyclesFromDistance;
window.getFuelCostFromDistance = getFuelCostFromDistance;
window.getTravelTimeFromCycles = getTravelTimeFromCycles;
window.getTravelTimeMsFromCycles = getTravelTimeMsFromCycles;
window.formatLightYears = formatLightYears;
window.formatCycles = formatCycles;
window.formatFuel = formatFuel;
window.formatTime = formatTime;
window.calculateTrip = calculateTrip;
window.calculateSectorTrip = calculateSectorTrip;
window.calculateNebulaTrip = calculateNebulaTrip;
window.calculateStarTrip = calculateStarTrip;
window.hasEnoughFuel = hasEnoughFuel;
window.useFuelForTrip = useFuelForTrip;
window.prepareWarpData = prepareWarpData;
window.saveWarpData = saveWarpData;
window.getWarpData = getWarpData;
window.clearWarpData = clearWarpData;
window.getCycleProgress = getCycleProgress;
window.getWarpSpeedFactor = getWarpSpeedFactor;
window.getTotalWarpProgress = getTotalWarpProgress;
window.getCurrentCycle = getCurrentCycle;
window.isWarpComplete = isWarpComplete;
window.getWarpStatusMessage = getWarpStatusMessage;
window.getStreakLength = getStreakLength;
window.getStarBrightness = getStarBrightness;
window.getStarSize = getStarSize;

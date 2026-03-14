// js/navigation.js - Complete journey calculation and navigation system for Voidfarer
// Centralizes all distance, warp, and fuel calculations for consistent multi-leg journeys

// ===== SECTOR COORDINATES =====
// 3x4 grid of sectors (A1 through C4)
const SECTOR_COORDS = {
    'A1': { x: 0, y: 0, name: 'Cygnus', displayName: 'Cygnus Arm' },
    'B1': { x: 1, y: 0, name: 'Perseus', displayName: 'Perseus Arm' },
    'C1': { x: 2, y: 0, name: 'Core', displayName: 'Galactic Core' },
    'A2': { x: 0, y: 1, name: 'Outer', displayName: 'Outer Arm' },
    'B2': { x: 1, y: 1, name: 'Orion', displayName: 'Orion Arm' },
    'C2': { x: 2, y: 1, name: 'Sagittarius', displayName: 'Sagittarius Arm' },
    'A3': { x: 0, y: 2, name: 'Carina', displayName: 'Carina Arm' },
    'B3': { x: 1, y: 2, name: 'Norma', displayName: 'Norma Arm' },
    'C3': { x: 2, y: 2, name: 'Scutum', displayName: 'Scutum Arm' },
    'A4': { x: 0, y: 3, name: 'Far', displayName: 'Far Arm' },
    'B4': { x: 1, y: 3, name: 'Reach', displayName: 'Outer Reach' },
    'C4': { x: 2, y: 3, name: 'Fringe', displayName: 'The Fringe' }
};

// ===== WARP CONSTANTS =====
const WARP_CONFIG = {
    CYCLE_DURATION: 2000,        // 2 seconds per cycle
    BASE_FUEL_COST: 5,           // Minimum fuel for any jump
    FUEL_PER_LY: 4,              // Fuel cost per light year
    ORBITAL_DESCENT: 0.5,        // Fixed descent distance to planet surface
    MAX_CYCLES: 5,               // Maximum warp cycles
    LY_PER_CYCLE: 2.3,           // Average light years per cycle
    SPEED_FACTOR: 1.0            // Base speed multiplier
};

// ===== SECTOR DISTANCE CALCULATION =====
// Calculate distance between two sectors using Manhattan distance
function getSectorDistance(sector1, sector2) {
    const s1 = SECTOR_COORDS[sector1] || SECTOR_COORDS['B2'];
    const s2 = SECTOR_COORDS[sector2] || SECTOR_COORDS['B2'];
    
    // Manhattan distance on grid
    const dx = Math.abs(s1.x - s2.x);
    const dy = Math.abs(s1.y - s2.y);
    const gridDistance = dx + dy;
    
    // Convert to light years (same sector = 0, adjacent = 2.3, max = 11.5)
    return gridDistance * 2.3;
}

// ===== WARP CYCLE CALCULATION =====
// Convert distance to warp cycles (1 cycle = 2 seconds)
function getWarpCyclesFromDistance(distance) {
    if (distance <= 1.0) return 1;      // Very close (0-1 LY)
    if (distance <= 2.5) return 2;      // Close (1-2.5 LY)
    if (distance <= 4.5) return 3;      // Medium (2.5-4.5 LY)
    if (distance <= 7.0) return 4;      // Far (4.5-7 LY)
    return 5;                           // Maximum distance (7+ LY)
}

// ===== FUEL COST CALCULATION =====
// Calculate fuel cost based on distance
function getFuelCostFromDistance(distance) {
    return Math.floor(distance * WARP_CONFIG.FUEL_PER_LY) + WARP_CONFIG.BASE_FUEL_COST;
}

// ===== TRAVEL TIME CALCULATION =====
// Get travel time in seconds and milliseconds
function getTravelTimeFromCycles(cycles) {
    return cycles * (WARP_CONFIG.CYCLE_DURATION / 1000); // Returns seconds
}

function getTravelTimeMsFromCycles(cycles) {
    return cycles * WARP_CONFIG.CYCLE_DURATION; // Returns milliseconds
}

// ===== COMPLETE JOURNEY CALCULATION =====
// Calculate total journey distance across all legs
function calculateCompleteJourney(legs) {
    const {
        sectorDistance = 0,
        starSectorDistance = 0,
        starDistance = 0,
        planetDescent = WARP_CONFIG.ORBITAL_DESCENT
    } = legs;
    
    const totalDistance = sectorDistance + starSectorDistance + starDistance + planetDescent;
    const totalCycles = getWarpCyclesFromDistance(totalDistance);
    const totalFuel = getFuelCostFromDistance(totalDistance);
    
    return {
        // Individual legs
        sectorDistance,
        starSectorDistance,
        starDistance,
        planetDescent,
        
        // Totals
        totalDistance,
        totalCycles,
        totalFuel,
        
        // Formatted for display
        sectorDistanceFormatted: formatDistance(sectorDistance),
        starSectorDistanceFormatted: formatDistance(starSectorDistance),
        starDistanceFormatted: formatDistance(starDistance),
        planetDescentFormatted: formatDistance(planetDescent),
        totalDistanceFormatted: formatDistance(totalDistance),
        totalCyclesFormatted: formatCycles(totalCycles),
        totalFuelFormatted: formatFuel(totalFuel),
        
        // Metadata
        isValid: totalDistance > 0,
        isLongJourney: totalCycles >= 4,
        isEpicJourney: totalCycles >= 5
    };
}

// ===== FORMATTING FUNCTIONS =====
function formatDistance(distance) {
    return distance.toFixed(1) + ' LY';
}

function formatCycles(cycles) {
    return cycles + ' cycle' + (cycles > 1 ? 's' : '');
}

function formatFuel(fuel) {
    return fuel + ' ⭐';
}

function formatTime(seconds) {
    if (seconds < 60) {
        return seconds + ' sec';
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return minutes + ' min ' + remainingSeconds + ' sec';
    }
}

// ===== JOURNEY DATA MANAGEMENT =====
// Save journey data to localStorage for warp.html
function saveJourneyData(journeyData) {
    const data = {
        destination: journeyData.destination,
        destinationType: journeyData.destinationType,
        startLocation: journeyData.startLocation,
        startLocationType: journeyData.startLocationType,
        totalDistance: journeyData.totalDistance,
        warpCycles: journeyData.warpCycles,
        fuelCost: journeyData.fuelCost,
        returnPage: journeyData.returnPage || 'surface.html',
        
        // Store all destination info for complete journey
        destSector: journeyData.destSector,
        destRegion: journeyData.destRegion,
        destStarSector: journeyData.destStarSector,
        destStar: journeyData.destStar,
        destPlanet: journeyData.destPlanet,
        destPlanetType: journeyData.destPlanetType,
        destPlanetResources: journeyData.destPlanetResources,
        
        // Store leg distances for display
        sectorDistance: journeyData.sectorDistance || 0,
        starSectorDistance: journeyData.starSectorDistance || 0,
        starDistance: journeyData.starDistance || 0,
        planetDescent: journeyData.planetDescent || WARP_CONFIG.ORBITAL_DESCENT
    };
    
    localStorage.setItem('voidfarer_warp_data', JSON.stringify(data));
    return data;
}

// Load journey data from localStorage
function loadJourneyData() {
    const saved = localStorage.getItem('voidfarer_warp_data');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

// Clear journey data
function clearJourneyData() {
    localStorage.removeItem('voidfarer_warp_data');
}

// ===== PLOT MODE DATA MANAGEMENT =====
// Save plot mode data when starting a journey
function savePlotData(plotData) {
    const {
        fromSector, fromRegion, fromStarSector, fromStar, fromPlanet,
        destSector, destRegion,
        sectorDistance
    } = plotData;
    
    if (fromSector) localStorage.setItem('voidfarer_plot_from_sector', fromSector);
    if (fromRegion) localStorage.setItem('voidfarer_plot_from_region', fromRegion);
    if (fromStarSector) localStorage.setItem('voidfarer_plot_from_starSector', fromStarSector);
    if (fromStar) localStorage.setItem('voidfarer_plot_from_star', fromStar);
    if (fromPlanet) localStorage.setItem('voidfarer_plot_from_planet', fromPlanet);
    
    if (destSector) localStorage.setItem('voidfarer_plot_sector', destSector);
    if (destRegion) localStorage.setItem('voidfarer_plot_region', destRegion);
    
    if (sectorDistance) {
        localStorage.setItem('voidfarer_plot_sector_distance', sectorDistance.toString());
        // Initialize cumulative distance with sector distance
        localStorage.setItem('voidfarer_plot_cumulative_distance', sectorDistance.toString());
    }
}

// Save star sector selection during plot mode
function savePlotStarSector(starSector) {
    localStorage.setItem('voidfarer_plot_starSector', starSector.name);
    localStorage.setItem('voidfarer_plot_starSector_type', starSector.type);
    localStorage.setItem('voidfarer_plot_starSector_distance', starSector.distance.toString());
    localStorage.setItem('voidfarer_plot_starSector_stars', starSector.stars.toString());
    if (starSector.x) localStorage.setItem('voidfarer_plot_starSector_x', starSector.x.toString());
    if (starSector.y) localStorage.setItem('voidfarer_plot_starSector_y', starSector.y.toString());
    
    // Calculate cumulative distance
    const sectorDist = parseFloat(localStorage.getItem('voidfarer_plot_sector_distance') || '0');
    const cumulative = sectorDist + starSector.distance;
    localStorage.setItem('voidfarer_plot_cumulative_distance', cumulative.toString());
    
    return cumulative;
}

// Save star selection during plot mode
function savePlotStar(starName, starDistance) {
    localStorage.setItem('voidfarer_plot_star', starName);
    localStorage.setItem('voidfarer_plot_star_distance', starDistance.toString());
    
    // Calculate cumulative distance
    const cumulative = parseFloat(localStorage.getItem('voidfarer_plot_cumulative_distance') || '0');
    const newCumulative = cumulative + starDistance;
    localStorage.setItem('voidfarer_plot_cumulative_distance', newCumulative.toString());
    
    return newCumulative;
}

// Load all plot data
function loadPlotData() {
    return {
        fromSector: localStorage.getItem('voidfarer_plot_from_sector'),
        fromRegion: localStorage.getItem('voidfarer_plot_from_region'),
        fromStarSector: localStorage.getItem('voidfarer_plot_from_starSector'),
        fromStar: localStorage.getItem('voidfarer_plot_from_star'),
        fromPlanet: localStorage.getItem('voidfarer_plot_from_planet'),
        
        destSector: localStorage.getItem('voidfarer_plot_sector'),
        destRegion: localStorage.getItem('voidfarer_plot_region'),
        destStarSector: localStorage.getItem('voidfarer_plot_starSector'),
        destStar: localStorage.getItem('voidfarer_plot_star'),
        
        sectorDistance: parseFloat(localStorage.getItem('voidfarer_plot_sector_distance') || '0'),
        starSectorDistance: parseFloat(localStorage.getItem('voidfarer_plot_starSector_distance') || '0'),
        starDistance: parseFloat(localStorage.getItem('voidfarer_plot_star_distance') || '0'),
        
        cumulativeDistance: parseFloat(localStorage.getItem('voidfarer_plot_cumulative_distance') || '0')
    };
}

// Clear all plot data
function clearPlotData() {
    const keys = [
        'voidfarer_plot_from_sector',
        'voidfarer_plot_from_region',
        'voidfarer_plot_from_starSector',
        'voidfarer_plot_from_star',
        'voidfarer_plot_from_planet',
        'voidfarer_plot_sector',
        'voidfarer_plot_region',
        'voidfarer_plot_starSector',
        'voidfarer_plot_starSector_type',
        'voidfarer_plot_starSector_distance',
        'voidfarer_plot_starSector_stars',
        'voidfarer_plot_starSector_x',
        'voidfarer_plot_starSector_y',
        'voidfarer_plot_star',
        'voidfarer_plot_star_distance',
        'voidfarer_plot_sector_distance',
        'voidfarer_plot_cumulative_distance'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
}

// ===== LOCATION MANAGEMENT =====
// Save current location (all levels)
function saveCurrentLocation(location) {
    const {
        sector, sectorId,
        region,
        starSector, starSectorType, starSectorStars,
        star, starType,
        planet, planetType, planetResources
    } = location;
    
    if (sector || sectorId) {
        localStorage.setItem('voidfarer_current_sector', sector || sectorId);
    }
    if (region) {
        localStorage.setItem('voidfarer_current_region', region);
    }
    if (starSector) {
        localStorage.setItem('voidfarer_current_starSector', starSector);
        localStorage.setItem('voidfarer_current_sector_name', starSector);
    }
    if (starSectorType) {
        localStorage.setItem('voidfarer_current_sector_type', starSectorType);
    }
    if (starSectorStars) {
        localStorage.setItem('voidfarer_current_sector_stars', starSectorStars.toString());
    }
    if (star) {
        localStorage.setItem('voidfarer_current_star', star);
    }
    if (starType) {
        localStorage.setItem('voidfarer_current_star_type', starType);
    }
    if (planet) {
        localStorage.setItem('voidfarer_current_planet', planet);
        localStorage.setItem('voidfarer_current_planet_name', planet);
    }
    if (planetType) {
        localStorage.setItem('voidfarer_current_planet_type', planetType);
    }
    if (planetResources) {
        localStorage.setItem('voidfarer_current_planet_resources', JSON.stringify(planetResources));
    }
}

// Load current location (all levels)
function loadCurrentLocation() {
    return {
        sector: localStorage.getItem('voidfarer_current_sector') || 'B2',
        region: localStorage.getItem('voidfarer_current_region') || 'Orion Arm',
        starSector: localStorage.getItem('voidfarer_current_starSector') || 'Orion Molecular Cloud',
        starSectorType: localStorage.getItem('voidfarer_current_sector_type') || 'Star-forming',
        starSectorStars: parseInt(localStorage.getItem('voidfarer_current_sector_stars') || '85'),
        star: localStorage.getItem('voidfarer_current_star') || 'Sol',
        starType: localStorage.getItem('voidfarer_current_star_type') || 'Main Sequence',
        planet: localStorage.getItem('voidfarer_current_planet') || 'Earth',
        planetType: localStorage.getItem('voidfarer_current_planet_type') || 'lush',
        planetResources: JSON.parse(localStorage.getItem('voidfarer_current_planet_resources') || '["Oxygen", "Silicon"]')
    };
}

// ===== JOURNEY DISTANCE TRACKING =====
// Update journey distance (accumulated across screens)
function updateJourneyDistance(additionalDistance) {
    const current = parseFloat(localStorage.getItem('voidfarer_journey_distance') || '0');
    const newTotal = current + additionalDistance;
    localStorage.setItem('voidfarer_journey_distance', newTotal.toString());
    return newTotal;
}

function getJourneyDistance() {
    return parseFloat(localStorage.getItem('voidfarer_journey_distance') || '0');
}

function resetJourneyDistance() {
    localStorage.setItem('voidfarer_journey_distance', '0');
}

// ===== UTILITY FUNCTIONS =====
// Get display name for a sector ID
function getSectorDisplayName(sectorId) {
    return SECTOR_COORDS[sectorId]?.displayName || 'Unknown Sector';
}

// Get sector ID from display name (approximate)
function getSectorIdFromDisplayName(displayName) {
    for (const [id, data] of Object.entries(SECTOR_COORDS)) {
        if (data.displayName === displayName) {
            return id;
        }
    }
    return 'B2'; // Default to Orion
}

// Calculate distance between two points (Euclidean)
function getEuclideanDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx*dx + dy*dy);
}

// Calculate distance between two points (Manhattan)
function getManhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// ===== WARP VISUALIZATION HELPERS =====
// Calculate progress within a warp cycle (0 to 1)
function getCycleProgress(cycleStartTime, currentTime) {
    const elapsed = currentTime - cycleStartTime;
    return Math.min(elapsed / WARP_CONFIG.CYCLE_DURATION, 1.0);
}

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

// Get current cycle number based on elapsed time
function getCurrentCycle(startTime, currentTime) {
    const elapsed = currentTime - startTime;
    return Math.floor(elapsed / WARP_CONFIG.CYCLE_DURATION) + 1;
}

// Check if warp is complete
function isWarpComplete(startTime, currentTime, totalCycles) {
    const elapsed = currentTime - startTime;
    const totalDuration = totalCycles * WARP_CONFIG.CYCLE_DURATION;
    return elapsed >= totalDuration;
}

// Get warp status message based on progress
function getWarpStatusMessage(cycle, totalCycles, progress) {
    if (cycle === 1) return 'INITIATING WARP';
    if (progress < 0.2) return 'ACCELERATING';
    if (progress < 0.3) return 'LEAVING SYSTEM';
    if (progress < 0.4) return 'INTERSTELLAR VOID';
    if (progress < 0.5) return 'CROSSING NEBULA';
    if (progress < 0.6) return 'MAXIMUM WARP';
    if (progress < 0.7) return 'PASSING PULSAR';
    if (progress < 0.8) return 'APPROACHING';
    if (progress < 0.9) return 'DECELERATING';
    if (progress < 1) return 'FINAL APPROACH';
    if (cycle === totalCycles) return 'FINAL CYCLE';
    if (cycle > totalCycles) return 'ARRIVED';
    return `WARP CYCLE ${cycle}`;
}

// ===== EXPOSE TO WINDOW =====
window.SECTOR_COORDS = SECTOR_COORDS;
window.WARP_CONFIG = WARP_CONFIG;
window.getSectorDistance = getSectorDistance;
window.getWarpCyclesFromDistance = getWarpCyclesFromDistance;
window.getFuelCostFromDistance = getFuelCostFromDistance;
window.getTravelTimeFromCycles = getTravelTimeFromCycles;
window.getTravelTimeMsFromCycles = getTravelTimeMsFromCycles;
window.calculateCompleteJourney = calculateCompleteJourney;
window.formatDistance = formatDistance;
window.formatCycles = formatCycles;
window.formatFuel = formatFuel;
window.formatTime = formatTime;
window.saveJourneyData = saveJourneyData;
window.loadJourneyData = loadJourneyData;
window.clearJourneyData = clearJourneyData;
window.savePlotData = savePlotData;
window.savePlotStarSector = savePlotStarSector;
window.savePlotStar = savePlotStar;
window.loadPlotData = loadPlotData;
window.clearPlotData = clearPlotData;
window.saveCurrentLocation = saveCurrentLocation;
window.loadCurrentLocation = loadCurrentLocation;
window.updateJourneyDistance = updateJourneyDistance;
window.getJourneyDistance = getJourneyDistance;
window.resetJourneyDistance = resetJourneyDistance;
window.getSectorDisplayName = getSectorDisplayName;
window.getSectorIdFromDisplayName = getSectorIdFromDisplayName;
window.getEuclideanDistance = getEuclideanDistance;
window.getManhattanDistance = getManhattanDistance;
window.getCycleProgress = getCycleProgress;
window.getWarpSpeedFactor = getWarpSpeedFactor;
window.getCurrentCycle = getCurrentCycle;
window.isWarpComplete = isWarpComplete;
window.getWarpStatusMessage = getWarpStatusMessage;

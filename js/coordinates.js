// coordinates.js
// Coordinate system for Voidfarer's shared procedural universe
// Enables shareable locations and navigation between all levels

// ===== CONSTANTS =====
const COORDINATE_VERSION = '1.0';
const GALAXY_GRID_SIZE = 12; // A1-C4 (3x4)
const NEBULAE_PER_SECTOR = 6;
const STARS_PER_NEBULA = 50;
const MAX_PLANETS_PER_STAR = 12;

// ===== COORDINATE STRUCTURE =====
// Full coordinate format: GALAXY:SECTOR:NEBULA:STAR:PLANET
// Example: "MW:B2:3:7:2" = Milky Way, Sector B2, Nebula index 3, Star index 7, Planet index 2
// Human readable: "Orion Nebula, Sector B2, Star Algol Prime, Planet Verdant-3"

// ===== SEEDED RANDOM FOR CONSISTENCY =====
function seededRandom(seed, index = 0) {
    const x = Math.sin(seed * (index + 1)) * 10000;
    return x - Math.floor(x);
}

// ===== COORDINATE PARSING =====

// Parse a full coordinate string into its components
function parseCoordinates(coordString) {
    if (!coordString || typeof coordString !== 'string') {
        return null;
    }
    
    const parts = coordString.split(':');
    
    if (parts.length < 4) {
        return null;
    }
    
    return {
        galaxy: parts[0] || 'MW',
        sector: parts[1] || 'B2',
        nebulaIndex: parseInt(parts[2]) || 0,
        starIndex: parseInt(parts[3]) || 0,
        planetIndex: parts[4] ? parseInt(parts[4]) : null
    };
}

// Format coordinates into a string
function formatCoordinates(sector, nebulaIndex, starIndex, planetIndex = null) {
    let coord = `MW:${sector}:${nebulaIndex}:${starIndex}`;
    if (planetIndex !== null) {
        coord += `:${planetIndex}`;
    }
    return coord;
}

// ===== LOCATION OBJECT =====

// Create a location object from components
function createLocation(sector, nebula, star, planet = null) {
    return {
        sector: sector,
        nebula: nebula,
        nebulaIndex: nebula.index || 0,
        star: star,
        starIndex: star.index || 0,
        planet: planet,
        planetIndex: planet?.index || null,
        timestamp: Date.now()
    };
}

// Create a location object from a coordinate string
function locationFromCoordinates(coordString) {
    const parsed = parseCoordinates(coordString);
    if (!parsed) return null;
    
    return {
        sector: parsed.sector,
        nebulaIndex: parsed.nebulaIndex,
        starIndex: parsed.starIndex,
        planetIndex: parsed.planetIndex,
        galaxy: parsed.galaxy,
        coordString: coordString
    };
}

// ===== COORDINATE VALIDATION =====

// Check if a sector ID is valid
function isValidSector(sectorId) {
    if (!sectorId || typeof sectorId !== 'string') return false;
    if (sectorId.length < 2) return false;
    
    const row = sectorId[0];
    const col = sectorId[1];
    
    const validRows = ['A', 'B', 'C'];
    const validCols = ['1', '2', '3', '4'];
    
    return validRows.includes(row) && validCols.includes(col);
}

// Check if a nebula index is valid
function isValidNebulaIndex(index) {
    return index >= 0 && index < NEBULAE_PER_SECTOR;
}

// Check if a star index is valid
function isValidStarIndex(index) {
    return index >= 0 && index < STARS_PER_NEBULA;
}

// Check if a planet index is valid
function isValidPlanetIndex(index) {
    return index >= 0 && index < MAX_PLANETS_PER_STAR;
}

// Validate a full coordinate
function isValidCoordinate(coord) {
    if (!coord) return false;
    
    const parsed = parseCoordinates(coord);
    if (!parsed) return false;
    
    return isValidSector(parsed.sector) &&
           isValidNebulaIndex(parsed.nebulaIndex) &&
           isValidStarIndex(parsed.starIndex) &&
           (parsed.planetIndex === null || isValidPlanetIndex(parsed.planetIndex));
}

// ===== LOCATION STORAGE =====

// Save current location to localStorage
function saveCurrentLocation(location) {
    if (typeof localStorage === 'undefined') return;
    
    localStorage.setItem('voidfarer_current_coordinates', JSON.stringify(location));
    
    // Also save individual components for backward compatibility
    if (location.sector) {
        localStorage.setItem('voidfarer_current_galaxy_sector', location.sector);
    }
    if (location.nebula?.name) {
        localStorage.setItem('voidfarer_current_nebula', location.nebula.name);
    }
    if (location.star?.name) {
        localStorage.setItem('voidfarer_current_star', location.star.name);
    }
    if (location.starIndex !== undefined) {
        localStorage.setItem('voidfarer_current_star_index', location.starIndex);
    }
    if (location.planet?.name) {
        localStorage.setItem('voidfarer_current_planet', location.planet.name);
    }
}

// Load current location from localStorage
function loadCurrentLocation() {
    if (typeof localStorage === 'undefined') return null;
    
    const saved = localStorage.getItem('voidfarer_current_coordinates');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }
    
    // Fallback to individual components
    return {
        sector: localStorage.getItem('voidfarer_current_galaxy_sector') || 'B2',
        nebula: {
            name: localStorage.getItem('voidfarer_current_nebula') || 'Orion Nebula',
            index: 0
        },
        star: {
            name: localStorage.getItem('voidfarer_current_star') || 'Sol',
            index: parseInt(localStorage.getItem('voidfarer_current_star_index')) || 0
        },
        planet: {
            name: localStorage.getItem('voidfarer_current_planet') || 'Earth',
            index: 0
        }
    };
}

// ===== COORDINATE CONVERSION =====

// Convert human-readable location to coordinates
function locationToCoordinates(location) {
    if (!location) return null;
    
    return formatCoordinates(
        location.sector || 'B2',
        location.nebulaIndex || 0,
        location.starIndex || 0,
        location.planetIndex || null
    );
}

// Convert coordinates to human-readable string
function coordinatesToHumanReadable(coordString, nebulae, stars, planets) {
    const parsed = parseCoordinates(coordString);
    if (!parsed) return 'Unknown Location';
    
    const parts = [];
    
    // Add nebula name if available
    if (nebulae && nebulae[parsed.nebulaIndex]) {
        parts.push(nebulae[parsed.nebulaIndex].name);
    } else {
        parts.push(`Nebula ${parsed.nebulaIndex + 1}`);
    }
    
    // Add sector
    parts.push(`Sector ${parsed.sector}`);
    
    // Add star name if available
    if (stars && stars[parsed.starIndex]) {
        parts.push(stars[parsed.starIndex].name);
    } else {
        parts.push(`Star ${parsed.starIndex + 1}`);
    }
    
    // Add planet name if available
    if (parsed.planetIndex !== null) {
        if (planets && planets[parsed.planetIndex]) {
            parts.push(planets[parsed.planetIndex].name);
        } else {
            parts.push(`Planet ${parsed.planetIndex + 1}`);
        }
    }
    
    return parts.join(' • ');
}

// ===== DISTANCE CALCULATION =====

// Calculate distance between two coordinates (in sectors)
function calculateDistance(coord1, coord2) {
    const parsed1 = parseCoordinates(coord1);
    const parsed2 = parseCoordinates(coord2);
    
    if (!parsed1 || !parsed2) return Infinity;
    
    // Parse sector into row and column
    const row1 = parsed1.sector.charCodeAt(0) - 65; // A=0, B=1, C=2
    const col1 = parseInt(parsed1.sector[1]) - 1;
    
    const row2 = parsed2.sector.charCodeAt(0) - 65;
    const col2 = parseInt(parsed2.sector[1]) - 1;
    
    // Calculate sector distance (Manhattan)
    const sectorDist = Math.abs(row1 - row2) + Math.abs(col1 - col2);
    
    // Calculate nebula distance within sector
    const nebulaDist = Math.abs(parsed1.nebulaIndex - parsed2.nebulaIndex) / 10;
    
    // Calculate star distance within nebula
    const starDist = Math.abs(parsed1.starIndex - parsed2.starIndex) / 100;
    
    // Calculate planet distance within system
    const planetDist = (parsed1.planetIndex && parsed2.planetIndex) ? 
        Math.abs(parsed1.planetIndex - parsed2.planetIndex) / 1000 : 0;
    
    return sectorDist + nebulaDist + starDist + planetDist;
}

// Get warp fuel cost between coordinates
function getWarpFuelCost(coord1, coord2) {
    const distance = calculateDistance(coord1, coord2);
    return Math.ceil(distance * 10);
}

// ===== COORDINATE GENERATION =====

// Generate random coordinates (for missions, anomalies, etc.)
function generateRandomCoordinates(sector = null, seed = 42793) {
    const targetSector = sector || getRandomSector();
    const nebulaIndex = Math.floor(seededRandom(seed, 1) * NEBULAE_PER_SECTOR);
    const starIndex = Math.floor(seededRandom(seed, 2) * STARS_PER_NEBULA);
    const planetIndex = Math.floor(seededRandom(seed, 3) * 8); // 0-7 for planet
    
    return formatCoordinates(targetSector, nebulaIndex, starIndex, planetIndex);
}

// Get random sector
function getRandomSector() {
    const rows = ['A', 'B', 'C'];
    const cols = ['1', '2', '3', '4'];
    
    const row = rows[Math.floor(Math.random() * rows.length)];
    const col = cols[Math.floor(Math.random() * cols.length)];
    
    return row + col;
}

// ===== COORDINATE BOOKMARKS =====

// Save a location to bookmarks
function saveBookmark(name, coordString, description = '') {
    if (typeof localStorage === 'undefined') return false;
    
    const bookmarks = loadBookmarks();
    
    const bookmark = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: name,
        coordinates: coordString,
        description: description,
        timestamp: Date.now()
    };
    
    bookmarks.push(bookmark);
    localStorage.setItem('voidfarer_bookmarks', JSON.stringify(bookmarks));
    
    return bookmark.id;
}

// Load all bookmarks
function loadBookmarks() {
    if (typeof localStorage === 'undefined') return [];
    
    const saved = localStorage.getItem('voidfarer_bookmarks');
    if (!saved) return [];
    
    try {
        return JSON.parse(saved);
    } catch (e) {
        return [];
    }
}

// Remove a bookmark
function removeBookmark(bookmarkId) {
    if (typeof localStorage === 'undefined') return false;
    
    const bookmarks = loadBookmarks();
    const filtered = bookmarks.filter(b => b.id !== bookmarkId);
    
    localStorage.setItem('voidfarer_bookmarks', JSON.stringify(filtered));
    return true;
}

// ===== RECENT LOCATIONS =====

// Save a location to recent history
function addToRecent(coordString, name = 'Unknown Location') {
    if (typeof localStorage === 'undefined') return;
    
    const recent = loadRecent();
    
    // Don't duplicate the most recent
    if (recent.length > 0 && recent[0].coordinates === coordString) {
        return;
    }
    
    const entry = {
        coordinates: coordString,
        name: name,
        timestamp: Date.now()
    };
    
    recent.unshift(entry);
    
    // Keep only last 10
    while (recent.length > 10) {
        recent.pop();
    }
    
    localStorage.setItem('voidfarer_recent_locations', JSON.stringify(recent));
}

// Load recent locations
function loadRecent() {
    if (typeof localStorage === 'undefined') return [];
    
    const saved = localStorage.getItem('voidfarer_recent_locations');
    if (!saved) return [];
    
    try {
        return JSON.parse(saved);
    } catch (e) {
        return [];
    }
}

// Clear recent locations
function clearRecent() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem('voidfarer_recent_locations');
}

// ===== SHAREABLE LINKS =====

// Generate a shareable link for a location
function generateShareLink(coordString, name = '') {
    const baseUrl = window.location.origin;
    const encoded = encodeURIComponent(coordString);
    const nameParam = name ? `&name=${encodeURIComponent(name)}` : '';
    
    return `${baseUrl}/?location=${encoded}${nameParam}`;
}

// Parse a shareable link
function parseShareLink(url) {
    try {
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        
        const coordString = params.get('location');
        const name = params.get('name');
        
        if (!coordString) return null;
        
        return {
            coordinates: coordString,
            name: name || 'Shared Location',
            isValid: isValidCoordinate(coordString)
        };
    } catch (e) {
        return null;
    }
}

// ===== FORMATTING HELPERS =====

// Format coordinates for display
function formatCoordinateDisplay(coordString, short = false) {
    const parsed = parseCoordinates(coordString);
    if (!parsed) return '???';
    
    if (short) {
        if (parsed.planetIndex !== null) {
            return `${parsed.sector}:${parsed.nebulaIndex}:${parsed.starIndex}:${parsed.planetIndex}`;
        }
        return `${parsed.sector}:${parsed.nebulaIndex}:${parsed.starIndex}`;
    }
    
    if (parsed.planetIndex !== null) {
        return `Sector ${parsed.sector} • Nebula ${parsed.nebulaIndex + 1} • Star ${parsed.starIndex + 1} • Planet ${parsed.planetIndex + 1}`;
    }
    
    return `Sector ${parsed.sector} • Nebula ${parsed.nebulaIndex + 1} • Star ${parsed.starIndex + 1}`;
}

// Get a short coordinate code (for sharing)
function getShortCode(coordString) {
    const parsed = parseCoordinates(coordString);
    if (!parsed) return '';
    
    // Convert to a compact code: e.g., "B2-3-7-2"
    let code = `${parsed.sector}-${parsed.nebulaIndex + 1}-${parsed.starIndex + 1}`;
    if (parsed.planetIndex !== null) {
        code += `-${parsed.planetIndex + 1}`;
    }
    
    return code;
}

// Parse a short code back to coordinates
function parseShortCode(code) {
    if (!code || typeof code !== 'string') return null;
    
    const parts = code.split('-');
    if (parts.length < 3) return null;
    
    const sector = parts[0];
    if (!isValidSector(sector)) return null;
    
    const nebulaIndex = parseInt(parts[1]) - 1;
    const starIndex = parseInt(parts[2]) - 1;
    
    if (!isValidNebulaIndex(nebulaIndex) || !isValidStarIndex(starIndex)) {
        return null;
    }
    
    let planetIndex = null;
    if (parts.length >= 4) {
        planetIndex = parseInt(parts[3]) - 1;
        if (!isValidPlanetIndex(planetIndex)) {
            planetIndex = null;
        }
    }
    
    return formatCoordinates(sector, nebulaIndex, starIndex, planetIndex);
}

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COORDINATE_VERSION,
        parseCoordinates,
        formatCoordinates,
        createLocation,
        locationFromCoordinates,
        isValidSector,
        isValidNebulaIndex,
        isValidStarIndex,
        isValidPlanetIndex,
        isValidCoordinate,
        saveCurrentLocation,
        loadCurrentLocation,
        locationToCoordinates,
        coordinatesToHumanReadable,
        calculateDistance,
        getWarpFuelCost,
        generateRandomCoordinates,
        getRandomSector,
        saveBookmark,
        loadBookmarks,
        removeBookmark,
        addToRecent,
        loadRecent,
        clearRecent,
        generateShareLink,
        parseShareLink,
        formatCoordinateDisplay,
        getShortCode,
        parseShortCode
    };
}

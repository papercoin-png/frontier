// storage.js - Save/load player progress for Voidfarer
// Handles all persistent data for the shared procedural universe

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    // Player data
    PLAYER: 'voidfarer_player',
    COLLECTION: 'voidfarer_collection',
    MISSIONS: 'voidfarer_missions',
    COMPLETED_MISSIONS: 'voidfarer_completed_missions',
    CREDITS: 'voidfarer_credits',
    
    // Universe data
    UNIVERSE_SEED: 'voidfarer_universe_seed',
    
    // Location data - Galaxy level
    CURRENT_SECTOR: 'voidfarer_current_sector',
    CURRENT_REGION: 'voidfarer_current_region',
    
    // Location data - Nebula/Sector level
    CURRENT_NEBULA: 'voidfarer_current_nebula',
    CURRENT_SECTOR_NAME: 'voidfarer_current_sector_name',
    CURRENT_SECTOR_TYPE: 'voidfarer_current_sector_type',
    CURRENT_SECTOR_STARS: 'voidfarer_current_sector_stars',
    CURRENT_SECTOR_X: 'voidfarer_current_sector_x',
    CURRENT_SECTOR_Y: 'voidfarer_current_sector_y',
    
    // Location data - Star level
    CURRENT_STAR: 'voidfarer_current_star',
    CURRENT_STAR_TYPE: 'voidfarer_current_star_type',
    CURRENT_STAR_INDEX: 'voidfarer_current_star_index',
    CURRENT_STAR_X: 'voidfarer_current_star_x',
    CURRENT_STAR_Y: 'voidfarer_current_star_y',
    CURRENT_STAR_PLANETS: 'voidfarer_current_star_planets',
    
    // Location data - Planet level
    CURRENT_PLANET: 'voidfarer_current_planet',
    CURRENT_PLANET_TYPE: 'voidfarer_current_planet_type',
    CURRENT_PLANET_RESOURCES: 'voidfarer_current_planet_resources',
    
    // Warp data
    WARP_DESTINATION: 'voidfarer_warp_destination',
    WARP_RETURN: 'voidfarer_warp_return',
    WARP_CYCLES: 'voidfarer_warp_cycles',
    WARP_DISTANCE: 'voidfarer_warp_distance',
    WARP_FUEL: 'voidfarer_warp_fuel',
    
    // Colonies
    COLONIES: 'voidfarer_colonies',
    
    // Discoveries
    DISCOVERED_LOCATIONS: 'voidfarer_discovered_locations',
    BOOKMARKS: 'voidfarer_bookmarks',
    RECENT_LOCATIONS: 'voidfarer_recent_locations',
    SCAN_HISTORY: 'voidfarer_scan_history',
    
    // Ship data
    SHIP_POWER: 'voidfarer_ship_power',
    SHIP_UPGRADES: 'voidfarer_ship_upgrades',
    SHIP_FUEL: 'voidfarer_ship_fuel',
    
    // Settings
    SETTINGS_HAPTICS: 'voidfarer_haptics',
    SETTINGS_AUTO_GATHER: 'voidfarer_auto_gather',
    SETTINGS_ORBIT_SPEED: 'voidfarer_orbit_speed',
    SETTINGS_MUSIC: 'voidfarer_music',
    SETTINGS_AMBIENT: 'voidfarer_ambient',
    
    // Stats
    PLAYER_STATS: 'voidfarer_player_stats',
    ACHIEVEMENTS: 'voidfarer_achievements',
    LAST_SAVE: 'voidfarer_last_save'
};

// ===== UNIVERSE CONSTANTS =====
const UNIVERSE_SEED = 42793;

// ===== INITIALIZATION =====
// Initialize storage with defaults if needed
function initializeStorage() {
    // Set universe seed
    if (!localStorage.getItem(STORAGE_KEYS.UNIVERSE_SEED)) {
        localStorage.setItem(STORAGE_KEYS.UNIVERSE_SEED, UNIVERSE_SEED.toString());
    }
    
    // Create default player if none exists
    if (!getPlayer()) {
        createDefaultPlayer();
    }
    
    // Initialize empty collection if none exists
    if (!localStorage.getItem(STORAGE_KEYS.COLLECTION)) {
        saveCollection({});
    }
    
    // Initialize credits if none exist
    if (!localStorage.getItem(STORAGE_KEYS.CREDITS)) {
        saveCredits(5000);
    }
    
    // Initialize ship fuel if none exists
    if (!localStorage.getItem(STORAGE_KEYS.SHIP_FUEL)) {
        localStorage.setItem(STORAGE_KEYS.SHIP_FUEL, '100');
    }
    
    // Initialize ship power if none exists
    if (!localStorage.getItem(STORAGE_KEYS.SHIP_POWER)) {
        localStorage.setItem(STORAGE_KEYS.SHIP_POWER, '100');
    }
    
    // Initialize empty scan history if none exists
    if (!localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY)) {
        localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify([]));
    }
    
    // Initialize default location if none exists
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR)) {
        setCurrentLocation('Orion', 'B2', 'Orion Molecular Cloud');
    }
}

// ===== PLAYER DATA =====
function getPlayer() {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER);
    return data ? JSON.parse(data) : null;
}

function savePlayer(playerData) {
    localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(playerData));
    saveTimestamp();
}

function createDefaultPlayer(name = 'Voidfarer') {
    const player = {
        name: name,
        ship: 'Prospector',
        shipLevel: 1,
        created: new Date().toISOString(),
        lastPlayed: new Date().toISOString(),
        playTime: 0,
        totalElementsCollected: 0,
        totalCreditsEarned: 5000,
        totalDistanceTraveled: 0,
        totalWarps: 0
    };
    savePlayer(player);
    return player;
}

// ===== COLLECTION DATA =====
function getCollection() {
    const data = localStorage.getItem(STORAGE_KEYS.COLLECTION);
    return data ? JSON.parse(data) : {};
}

function saveCollection(collection) {
    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
    saveTimestamp();
}

function addElementToCollection(elementName, count = 1) {
    const collection = getCollection();
    
    if (!collection[elementName]) {
        collection[elementName] = {
            count: count,
            firstFound: new Date().toISOString()
        };
    } else {
        collection[elementName].count += count;
    }
    
    saveCollection(collection);
    
    // Update player stats
    const player = getPlayer();
    if (player) {
        player.totalElementsCollected = (player.totalElementsCollected || 0) + count;
        savePlayer(player);
    }
    
    return Object.keys(collection).length;
}

function removeElementFromCollection(elementName, count = 1) {
    const collection = getCollection();
    
    if (!collection[elementName]) {
        return false;
    }
    
    if (collection[elementName].count < count) {
        return false;
    }
    
    collection[elementName].count -= count;
    
    if (collection[elementName].count <= 0) {
        delete collection[elementName];
    }
    
    saveCollection(collection);
    return true;
}

function getElementCount(elementName) {
    const collection = getCollection();
    return collection[elementName]?.count || 0;
}

function getUniqueElementsCount() {
    const collection = getCollection();
    return Object.keys(collection).length;
}

function getTotalElementCount() {
    const collection = getCollection();
    let total = 0;
    Object.values(collection).forEach(item => {
        total += item.count || 1;
    });
    return total;
}

// ===== CREDITS =====
function getCredits() {
    const credits = localStorage.getItem(STORAGE_KEYS.CREDITS);
    return credits ? parseInt(credits) : 5000;
}

function saveCredits(credits) {
    localStorage.setItem(STORAGE_KEYS.CREDITS, credits.toString());
    saveTimestamp();
}

function addCredits(amount) {
    const current = getCredits();
    const newTotal = current + amount;
    saveCredits(newTotal);
    
    // Update player stats
    const player = getPlayer();
    if (player) {
        player.totalCreditsEarned = (player.totalCreditsEarned || 5000) + amount;
        savePlayer(player);
    }
    
    return newTotal;
}

function spendCredits(amount) {
    const current = getCredits();
    if (current >= amount) {
        saveCredits(current - amount);
        return true;
    }
    return false;
}

// ===== SHIP FUEL =====
function getShipFuel() {
    const fuel = localStorage.getItem(STORAGE_KEYS.SHIP_FUEL);
    return fuel ? parseInt(fuel) : 100;
}

function saveShipFuel(fuel) {
    localStorage.setItem(STORAGE_KEYS.SHIP_FUEL, fuel.toString());
}

function useFuel(amount) {
    const current = getShipFuel();
    if (current >= amount) {
        saveShipFuel(current - amount);
        return true;
    }
    return false;
}

function refuelShip(amount) {
    const current = getShipFuel();
    saveShipFuel(current + amount);
}

// ===== SHIP POWER =====
function getShipPower() {
    const power = localStorage.getItem(STORAGE_KEYS.SHIP_POWER);
    return power ? parseInt(power) : 100;
}

function setShipPower(power) {
    localStorage.setItem(STORAGE_KEYS.SHIP_POWER, power.toString());
}

function usePower(amount) {
    const current = getShipPower();
    if (current >= amount) {
        setShipPower(current - amount);
        return true;
    }
    return false;
}

function repairShip(amount) {
    const current = getShipPower();
    setShipPower(Math.min(100, current + amount));
}

// ===== LOCATION DATA - GALAXY LEVEL =====
function getCurrentSector() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR) || 'B2';
}

function getCurrentRegion() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_REGION) || 'Orion';
}

function setCurrentSector(sector, region) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR, sector);
    localStorage.setItem(STORAGE_KEYS.CURRENT_REGION, region);
}

// ===== LOCATION DATA - NEBULA/SECTOR LEVEL =====
function getCurrentNebula() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_NEBULA) || 'Orion Molecular Cloud';
}

function getCurrentSectorName() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR_NAME) || 'Orion Molecular Cloud';
}

function getCurrentSectorType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR_TYPE) || 'Star-forming';
}

function getCurrentSectorStars() {
    const stars = localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR_STARS);
    return stars ? parseInt(stars) : 85;
}

function getCurrentSectorCoords() {
    const x = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR_X)) || 30;
    const y = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR_Y)) || 40;
    return { x, y };
}

function setCurrentNebula(name, type, stars, x, y) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_NEBULA, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_NAME, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_TYPE, type);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_STARS, stars.toString());
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_X, x.toString());
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_Y, y.toString());
}

// ===== LOCATION DATA - STAR LEVEL =====
function getCurrentStar() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR) || '';
}

function getCurrentStarType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_TYPE) || '';
}

function getCurrentStarIndex() {
    const index = localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_INDEX);
    return index ? parseInt(index) : -1;
}

function getCurrentStarCoords() {
    const x = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_X)) || 50;
    const y = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_Y)) || 50;
    return { x, y };
}

function getCurrentStarPlanets() {
    const planets = localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_PLANETS);
    return planets || '3-7';
}

function setCurrentStar(name, type, index, planets, x, y) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STAR, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_TYPE, type);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_INDEX, index.toString());
    localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_PLANETS, planets);
    if (x) localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_X, x.toString());
    if (y) localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_Y, y.toString());
}

// ===== LOCATION DATA - PLANET LEVEL =====
function getCurrentPlanet() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || '';
}

function getCurrentPlanetType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_TYPE) || '';
}

function getCurrentPlanetResources() {
    const resources = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES);
    return resources ? JSON.parse(resources) : [];
}

function setCurrentPlanet(name, type, resources) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_TYPE, type);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES, JSON.stringify(resources));
}

// ===== SET CURRENT LOCATION (ALL LEVELS) =====
function setCurrentLocation(region, sector, nebula, nebulaType, nebulaStars, nebulaX, nebulaY) {
    // Galaxy level
    setCurrentSector(sector, region);
    
    // Nebula level
    if (nebula) {
        setCurrentNebula(nebula, nebulaType || 'Unknown', nebulaStars || 50, nebulaX || 30, nebulaY || 40);
    }
}

// ===== WARP DATA =====
function setWarpData(destination, returnPage, cycles, distance, fuel) {
    localStorage.setItem(STORAGE_KEYS.WARP_DESTINATION, destination);
    localStorage.setItem(STORAGE_KEYS.WARP_RETURN, returnPage);
    localStorage.setItem(STORAGE_KEYS.WARP_CYCLES, cycles.toString());
    if (distance) localStorage.setItem(STORAGE_KEYS.WARP_DISTANCE, distance.toString());
    if (fuel) localStorage.setItem(STORAGE_KEYS.WARP_FUEL, fuel.toString());
}

function getWarpData() {
    return {
        destination: localStorage.getItem(STORAGE_KEYS.WARP_DESTINATION) || 'Unknown',
        returnPage: localStorage.getItem(STORAGE_KEYS.WARP_RETURN) || 'galaxy-map.html',
        cycles: parseInt(localStorage.getItem(STORAGE_KEYS.WARP_CYCLES)) || 1,
        distance: parseFloat(localStorage.getItem(STORAGE_KEYS.WARP_DISTANCE)) || 0,
        fuel: parseInt(localStorage.getItem(STORAGE_KEYS.WARP_FUEL)) || 0
    };
}

function clearWarpData() {
    localStorage.removeItem(STORAGE_KEYS.WARP_DESTINATION);
    localStorage.removeItem(STORAGE_KEYS.WARP_RETURN);
    localStorage.removeItem(STORAGE_KEYS.WARP_CYCLES);
    localStorage.removeItem(STORAGE_KEYS.WARP_DISTANCE);
    localStorage.removeItem(STORAGE_KEYS.WARP_FUEL);
}

// ===== COLONIES =====
function getColonies() {
    const data = localStorage.getItem(STORAGE_KEYS.COLONIES);
    return data ? JSON.parse(data) : [];
}

function saveColonies(colonies) {
    localStorage.setItem(STORAGE_KEYS.COLONIES, JSON.stringify(colonies));
}

function addColony(name, planet, star, nebula, sector) {
    const colonies = getColonies();
    colonies.push({
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: name,
        planet: planet,
        star: star,
        nebula: nebula,
        sector: sector,
        established: new Date().toISOString()
    });
    saveColonies(colonies);
    return colonies;
}

function removeColony(colonyId) {
    const colonies = getColonies();
    const filtered = colonies.filter(c => c.id !== colonyId);
    saveColonies(filtered);
    return filtered;
}

// ===== MISSIONS =====
function getMissions() {
    const data = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    return data ? JSON.parse(data) : [];
}

function saveMissions(missions) {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
}

function getCompletedMissions() {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_MISSIONS);
    return data ? JSON.parse(data) : [];
}

function saveCompletedMissions(missions) {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_MISSIONS, JSON.stringify(missions));
}

function updateMissionProgress(elementName, count = 1) {
    const missions = getMissions();
    let updated = false;
    
    missions.forEach(mission => {
        if (mission.element === elementName && mission.current < mission.target) {
            mission.current = Math.min(mission.current + count, mission.target);
            updated = true;
        }
    });
    
    if (updated) {
        saveMissions(missions);
    }
    
    return updated;
}

// ===== SCAN HISTORY =====
function getScanHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    return data ? JSON.parse(data) : [];
}

function addScan(scanData) {
    const history = getScanHistory();
    history.unshift({
        ...scanData,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 scans
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(history));
    return history;
}

function clearScanHistory() {
    localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify([]));
}

// ===== SETTINGS =====
function getHapticsEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_HAPTICS) !== 'false';
}

function setHapticsEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_HAPTICS, enabled.toString());
}

function getAutoGatherEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER) !== 'false';
}

function setAutoGatherEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER, enabled.toString());
}

function getOrbitSpeed() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED) || 'gentle';
}

function setOrbitSpeed(speed) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED, speed);
}

function getMusicVolume() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.SETTINGS_MUSIC)) || 50;
}

function setMusicVolume(volume) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_MUSIC, volume.toString());
}

function getAmbientVolume() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.SETTINGS_AMBIENT)) || 50;
}

function setAmbientVolume(volume) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_AMBIENT, volume.toString());
}

// ===== SHIP UPGRADES =====
function getShipUpgrades() {
    const data = localStorage.getItem(STORAGE_KEYS.SHIP_UPGRADES);
    return data ? JSON.parse(data) : {
        engine: 1,
        shields: 1,
        miningLaser: 1,
        cargoHold: 1,
        warpDrive: 1,
        scanner: 1
    };
}

function saveShipUpgrades(upgrades) {
    localStorage.setItem(STORAGE_KEYS.SHIP_UPGRADES, JSON.stringify(upgrades));
}

function upgradeShip(component) {
    const upgrades = getShipUpgrades();
    if (upgrades[component] < 5) {
        upgrades[component]++;
        saveShipUpgrades(upgrades);
        return true;
    }
    return false;
}

// ===== SAVE TIMESTAMP =====
function saveTimestamp() {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
}

function getLastSaveTime() {
    return localStorage.getItem(STORAGE_KEYS.LAST_SAVE);
}

// ===== RESET GAME =====
function resetGame() {
    // Clear all game data but keep settings
    const settings = {
        haptics: getHapticsEnabled(),
        autoGather: getAutoGatherEnabled(),
        orbitSpeed: getOrbitSpeed(),
        music: getMusicVolume(),
        ambient: getAmbientVolume()
    };
    
    // Remove all game keys
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Restore settings
    setHapticsEnabled(settings.haptics);
    setAutoGatherEnabled(settings.autoGather);
    setOrbitSpeed(settings.orbitSpeed);
    setMusicVolume(settings.music);
    setAmbientVolume(settings.ambient);
    
    // Re-initialize
    initializeStorage();
}

// ===== EXPORT / UTILITY =====
function exportGameData() {
    const gameData = {};
    Object.values(STORAGE_KEYS).forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            gameData[key] = value;
        }
    });
    return JSON.stringify(gameData);
}

function importGameData(jsonString) {
    try {
        const gameData = JSON.parse(jsonString);
        Object.keys(gameData).forEach(key => {
            localStorage.setItem(key, gameData[key]);
        });
        return true;
    } catch (e) {
        return false;
    }
}

// ===== INITIALIZE ON LOAD =====
initializeStorage();

// ===== EXPORT FOR MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STORAGE_KEYS,
        UNIVERSE_SEED,
        getPlayer,
        savePlayer,
        createDefaultPlayer,
        getCollection,
        saveCollection,
        addElementToCollection,
        removeElementFromCollection,
        getElementCount,
        getUniqueElementsCount,
        getTotalElementCount,
        getCredits,
        saveCredits,
        addCredits,
        spendCredits,
        getShipFuel,
        saveShipFuel,
        useFuel,
        refuelShip,
        getShipPower,
        setShipPower,
        usePower,
        repairShip,
        getCurrentSector,
        getCurrentRegion,
        setCurrentSector,
        getCurrentNebula,
        getCurrentSectorName,
        getCurrentSectorType,
        getCurrentSectorStars,
        getCurrentSectorCoords,
        setCurrentNebula,
        getCurrentStar,
        getCurrentStarType,
        getCurrentStarIndex,
        getCurrentStarCoords,
        getCurrentStarPlanets,
        setCurrentStar,
        getCurrentPlanet,
        getCurrentPlanetType,
        getCurrentPlanetResources,
        setCurrentPlanet,
        setCurrentLocation,
        setWarpData,
        getWarpData,
        clearWarpData,
        getColonies,
        saveColonies,
        addColony,
        removeColony,
        getMissions,
        saveMissions,
        getCompletedMissions,
        saveCompletedMissions,
        updateMissionProgress,
        getScanHistory,
        addScan,
        clearScanHistory,
        getHapticsEnabled,
        setHapticsEnabled,
        getAutoGatherEnabled,
        setAutoGatherEnabled,
        getOrbitSpeed,
        setOrbitSpeed,
        getMusicVolume,
        setMusicVolume,
        getAmbientVolume,
        setAmbientVolume,
        getShipUpgrades,
        saveShipUpgrades,
        upgradeShip,
        getLastSaveTime,
        resetGame,
        exportGameData,
        importGameData
    };
}

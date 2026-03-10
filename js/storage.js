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
    CURRENT_COORDINATES: 'voidfarer_current_coordinates',
    CURRENT_SECTOR: 'voidfarer_current_galaxy_sector',
    CURRENT_NEBULA: 'voidfarer_current_nebula',
    CURRENT_STAR: 'voidfarer_current_star',
    CURRENT_STAR_INDEX: 'voidfarer_current_star_index',
    CURRENT_PLANET: 'voidfarer_current_planet',
    CURRENT_PLANET_TYPE: 'voidfarer_current_planet_type',
    CURRENT_PLANET_RESOURCES: 'voidfarer_current_planet_resources',
    
    // Colonies
    COLONIES: 'voidfarer_colonies',
    
    // Discoveries
    DISCOVERED_LOCATIONS: 'voidfarer_discovered_locations',
    BOOKMARKS: 'voidfarer_bookmarks',
    RECENT_LOCATIONS: 'voidfarer_recent_locations',
    
    // Ship data
    SHIP_POWER: 'voidfarer_ship_power',
    SHIP_UPGRADES: 'voidfarer_ship_upgrades',
    
    // Settings
    SETTINGS_HAPTICS: 'voidfarer_haptics',
    SETTINGS_AUTO_GATHER: 'voidfarer_auto_gather',
    SETTINGS_ORBIT_SPEED: 'voidfarer_orbit_speed',
    SETTINGS_MUSIC: 'voidfarer_music',
    SETTINGS_AMBIENT: 'voidfarer_ambient',
    
    // Warp data
    WARP_DESTINATION: 'voidfarer_warp_destination',
    WARP_REDIRECT: 'voidfarer_warp_redirect',
    
    // Stats
    PLAYER_STATS: 'voidfarer_player_stats',
    ACHIEVEMENTS: 'voidfarer_achievements',
    LAST_SAVE: 'voidfarer_last_save',
    
    // Settings initialized flag
    SETTINGS_INITIALIZED: 'voidfarer_settings_initialized'
};

// ===== UNIVERSE CONSTANTS =====
const UNIVERSE_SEED = 42793; // Fixed seed - all players share the same universe

// ===== PLAYER DATA =====

// Get player data
function getPlayer() {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER);
    return data ? JSON.parse(data) : null;
}

// Save player data
function savePlayer(playerData) {
    localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(playerData));
    saveTimestamp();
}

// Create new player
function createNewPlayer(name = 'Voidfarer') {
    const player = {
        name: name,
        ship: 'Prospector',
        shipLevel: 1,
        created: new Date().toISOString(),
        lastPlayed: new Date().toISOString(),
        playTime: 0,
        totalElementsCollected: 0,
        totalCreditsEarned: 12450
    };
    
    savePlayer(player);
    return player;
}

// ===== COLLECTION DATA =====

// Get element collection
function getCollection() {
    const data = localStorage.getItem(STORAGE_KEYS.COLLECTION);
    return data ? JSON.parse(data) : {};
}

// Save element collection
function saveCollection(collection) {
    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
    saveTimestamp();
}

// Add element to collection with location tracking
function addElementToCollection(elementName, count = 1, location = null) {
    const collection = getCollection();
    
    if (!collection[elementName]) {
        collection[elementName] = {
            count: count,
            firstFound: new Date().toISOString(),
            location: location // Store where it was first found
        };
    } else {
        collection[elementName].count = (collection[elementName].count || 1) + count;
    }
    
    saveCollection(collection);
    
    // Update player stats
    const player = getPlayer();
    if (player) {
        player.totalElementsCollected = (player.totalElementsCollected || 0) + count;
        savePlayer(player);
    }
    
    // Add to discovered locations if location provided
    if (location) {
        addDiscoveredLocation(location);
    }
    
    return Object.keys(collection).length;
}

// Get element count
function getElementCount(elementName) {
    const collection = getCollection();
    return collection[elementName]?.count || 0;
}

// Get total elements collected (including duplicates)
function getTotalElementsCollected() {
    const collection = getCollection();
    let total = 0;
    Object.values(collection).forEach(item => {
        total += item.count || 1;
    });
    return total;
}

// Get unique elements count
function getUniqueElementsCount() {
    const collection = getCollection();
    return Object.keys(collection).length;
}

// Check if element has been discovered
function isElementDiscovered(elementName) {
    const collection = getCollection();
    return !!collection[elementName];
}

// ===== CREDITS =====

// Get credits
function getCredits() {
    const credits = localStorage.getItem(STORAGE_KEYS.CREDITS);
    return credits ? parseInt(credits) : 12450;
}

// Save credits
function saveCredits(credits) {
    localStorage.setItem(STORAGE_KEYS.CREDITS, credits.toString());
    saveTimestamp();
}

// Add credits
function addCredits(amount) {
    const current = getCredits();
    const newTotal = current + amount;
    saveCredits(newTotal);
    
    // Update player stats
    const player = getPlayer();
    if (player) {
        player.totalCreditsEarned = (player.totalCreditsEarned || 12450) + amount;
        savePlayer(player);
    }
    
    return newTotal;
}

// Spend credits (returns true if successful)
function spendCredits(amount) {
    const current = getCredits();
    if (current >= amount) {
        saveCredits(current - amount);
        return true;
    }
    return false;
}

// ===== MISSIONS =====

// Get active missions
function getMissions() {
    const data = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    return data ? JSON.parse(data) : [];
}

// Save missions
function saveMissions(missions) {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
    saveTimestamp();
}

// Get completed missions
function getCompletedMissions() {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_MISSIONS);
    return data ? JSON.parse(data) : [];
}

// Save completed missions
function saveCompletedMissions(missions) {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_MISSIONS, JSON.stringify(missions));
    saveTimestamp();
}

// Update mission progress when collecting elements
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

// ===== LOCATION DATA =====

// Get current coordinates (full location object)
function getCurrentCoordinates() {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_COORDINATES);
    return data ? JSON.parse(data) : null;
}

// Save current coordinates
function saveCurrentCoordinates(coords) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_COORDINATES, JSON.stringify(coords));
    
    // Also save individual components for backward compatibility
    if (coords.sector) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR, coords.sector);
    }
    if (coords.nebula?.name) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_NEBULA, coords.nebula.name);
    }
    if (coords.star?.name) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_STAR, coords.star.name);
    }
    if (coords.starIndex !== undefined) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_INDEX, coords.starIndex.toString());
    }
    if (coords.planet?.name) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, coords.planet.name);
    }
    
    saveTimestamp();
}

// Get current sector
function getCurrentSector() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR) || 'B2';
}

// Get current nebula
function getCurrentNebula() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_NEBULA) || 'Orion Nebula';
}

// Get current star
function getCurrentStar() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR) || 'Sol';
}

// Get current star index
function getCurrentStarIndex() {
    const index = localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_INDEX);
    return index ? parseInt(index) : 0;
}

// Get current planet
function getCurrentPlanet() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Earth';
}

// Get current planet type
function getCurrentPlanetType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_TYPE) || 'lush';
}

// Get current planet resources
function getCurrentPlanetResources() {
    const resources = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES);
    return resources ? JSON.parse(resources) : ['Carbon', 'Iron', 'Silicon'];
}

// Set current planet
function setCurrentPlanet(planetName, planetType = 'lush', resources = []) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, planetName);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_TYPE, planetType);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES, JSON.stringify(resources));
}

// ===== DISCOVERED LOCATIONS =====

// Get discovered locations
function getDiscoveredLocations() {
    const data = localStorage.getItem(STORAGE_KEYS.DISCOVERED_LOCATIONS);
    return data ? JSON.parse(data) : [];
}

// Save discovered locations
function saveDiscoveredLocations(locations) {
    localStorage.setItem(STORAGE_KEYS.DISCOVERED_LOCATIONS, JSON.stringify(locations));
}

// Add a discovered location
function addDiscoveredLocation(location) {
    const locations = getDiscoveredLocations();
    
    // Check if already discovered
    const exists = locations.some(l => 
        l.sector === location.sector && 
        l.nebula === location.nebula && 
        l.star === location.star &&
        l.planet === location.planet
    );
    
    if (!exists) {
        locations.push({
            ...location,
            discoveredAt: new Date().toISOString()
        });
        saveDiscoveredLocations(locations);
        return true;
    }
    
    return false;
}

// ===== COLONIES =====

// Get colonies
function getColonies() {
    const data = localStorage.getItem(STORAGE_KEYS.COLONIES);
    return data ? JSON.parse(data) : [];
}

// Save colonies
function saveColonies(colonies) {
    localStorage.setItem(STORAGE_KEYS.COLONIES, JSON.stringify(colonies));
}

// Add a colony
function addColony(colonyData) {
    const colonies = getColonies();
    
    colonies.push({
        ...colonyData,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        established: new Date().toISOString()
    });
    
    saveColonies(colonies);
    return colonies;
}

// Remove a colony
function removeColony(colonyId) {
    const colonies = getColonies();
    const filtered = colonies.filter(c => c.id !== colonyId);
    saveColonies(filtered);
    return filtered;
}

// Get colonies in current sector
function getColoniesInSector(sectorId) {
    const colonies = getColonies();
    return colonies.filter(c => c.sector === sectorId);
}

// ===== BOOKMARKS =====

// Get bookmarks
function getBookmarks() {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
}

// Save bookmark
function saveBookmark(name, coordinates, description = '') {
    const bookmarks = getBookmarks();
    
    const bookmark = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: name,
        coordinates: coordinates,
        description: description,
        createdAt: new Date().toISOString()
    };
    
    bookmarks.push(bookmark);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    
    return bookmark.id;
}

// Remove bookmark
function removeBookmark(bookmarkId) {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== bookmarkId);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
}

// ===== RECENT LOCATIONS =====

// Get recent locations
function getRecentLocations() {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_LOCATIONS);
    return data ? JSON.parse(data) : [];
}

// Add to recent locations
function addToRecent(location, name = 'Unknown Location') {
    const recent = getRecentLocations();
    
    // Remove if already exists
    const filtered = recent.filter(l => 
        l.sector !== location.sector || 
        l.nebula !== location.nebula ||
        l.star !== location.star
    );
    
    // Add to front
    filtered.unshift({
        ...location,
        name: name,
        visitedAt: new Date().toISOString()
    });
    
    // Keep only last 10
    while (filtered.length > 10) {
        filtered.pop();
    }
    
    localStorage.setItem(STORAGE_KEYS.RECENT_LOCATIONS, JSON.stringify(filtered));
}

// ===== SHIP DATA =====

// Get ship power
function getShipPower() {
    const power = localStorage.getItem(STORAGE_KEYS.SHIP_POWER);
    return power ? parseInt(power) : 87;
}

// Set ship power
function setShipPower(power) {
    localStorage.setItem(STORAGE_KEYS.SHIP_POWER, power.toString());
}

// Get ship upgrades
function getShipUpgrades() {
    const data = localStorage.getItem(STORAGE_KEYS.SHIP_UPGRADES);
    return data ? JSON.parse(data) : {
        miningLaser: 1,
        cargoHold: 1,
        warpDrive: 1,
        shields: 1,
        engine: 1
    };
}

// Save ship upgrades
function saveShipUpgrades(upgrades) {
    localStorage.setItem(STORAGE_KEYS.SHIP_UPGRADES, JSON.stringify(upgrades));
}

// ===== SETTINGS =====

// Get haptics setting
function getHapticsEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_HAPTICS) !== 'false';
}

// Set haptics setting
function setHapticsEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_HAPTICS, enabled.toString());
}

// Get auto gather setting
function getAutoGatherEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER) !== 'false';
}

// Set auto gather setting
function setAutoGatherEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER, enabled.toString());
}

// Get orbit speed
function getOrbitSpeed() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED) || 'gentle';
}

// Set orbit speed
function setOrbitSpeed(speed) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED, speed);
}

// Get music volume
function getMusicVolume() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.SETTINGS_MUSIC)) || 50;
}

// Set music volume
function setMusicVolume(volume) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_MUSIC, volume.toString());
}

// Get ambient volume
function getAmbientVolume() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.SETTINGS_AMBIENT)) || 50;
}

// Set ambient volume
function setAmbientVolume(volume) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_AMBIENT, volume.toString());
}

// ===== WARP DATA =====

// Set warp destination
function setWarpDestination(destination, redirect) {
    localStorage.setItem(STORAGE_KEYS.WARP_DESTINATION, destination);
    localStorage.setItem(STORAGE_KEYS.WARP_REDIRECT, redirect);
}

// Get warp destination
function getWarpDestination() {
    return localStorage.getItem(STORAGE_KEYS.WARP_DESTINATION);
}

// Get warp redirect
function getWarpRedirect() {
    return localStorage.getItem(STORAGE_KEYS.WARP_REDIRECT);
}

// Clear warp data
function clearWarpData() {
    localStorage.removeItem(STORAGE_KEYS.WARP_DESTINATION);
    localStorage.removeItem(STORAGE_KEYS.WARP_REDIRECT);
}

// ===== ACHIEVEMENTS =====

// Get achievements
function getAchievements() {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
}

// Save achievements
function saveAchievements(achievements) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

// Unlock achievement
function unlockAchievement(achievementId) {
    const achievements = getAchievements();
    if (!achievements.includes(achievementId)) {
        achievements.push(achievementId);
        saveAchievements(achievements);
        return true;
    }
    return false;
}

// ===== PLAYER STATS =====

// Get player stats
function getPlayerStats() {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
    return data ? JSON.parse(data) : {
        sectorsVisited: 1,
        nebulaeVisited: 1,
        starsVisited: 1,
        planetsVisited: 1,
        elementsDiscovered: 0,
        missionsCompleted: 0,
        coloniesBuilt: 0,
        creditsSpent: 0,
        distanceTraveled: 0,
        shipsLost: 0
    };
}

// Save player stats
function savePlayerStats(stats) {
    localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(stats));
}

// Update player stats
function updatePlayerStats(updates) {
    const stats = getPlayerStats();
    Object.assign(stats, updates);
    savePlayerStats(stats);
}

// ===== SAVE TIMESTAMP =====

// Save last save timestamp
function saveTimestamp() {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
}

// Get last save timestamp
function getLastSaveTime() {
    return localStorage.getItem(STORAGE_KEYS.LAST_SAVE);
}

// ===== UNIVERSE SEED =====

// Get universe seed (fixed for all players)
function getUniverseSeed() {
    return UNIVERSE_SEED;
}

// Initialize universe seed (called on new game)
function initializeUniverseSeed() {
    localStorage.setItem(STORAGE_KEYS.UNIVERSE_SEED, UNIVERSE_SEED.toString());
}

// ===== SAVE GAME =====

// Save complete game state
function saveGame() {
    saveTimestamp();
}

// Load complete game state (just a check)
function loadGame() {
    return {
        player: getPlayer(),
        collection: getCollection(),
        credits: getCredits(),
        missions: getMissions(),
        colonies: getColonies(),
        currentSector: getCurrentSector(),
        shipPower: getShipPower(),
        lastSave: getLastSaveTime()
    };
}

// ===== RESET GAME =====

// Reset all game data (new game)
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
    
    // Create new player
    createNewPlayer();
    
    // Initialize universe seed
    initializeUniverseSeed();
    
    // Initialize empty collection
    saveCollection({});
    
    // Set default credits
    saveCredits(12450);
    
    // Set default location
    saveCurrentCoordinates({
        sector: 'B2',
        nebula: { name: 'Orion Nebula', index: 0 },
        star: { name: 'Sol', index: 0 },
        planet: { name: 'Earth', index: 0 }
    });
    
    // Set default ship power
    setShipPower(87);
    
    saveTimestamp();
}

// ===== EXPORT DATA =====

// Export all game data as JSON string
function exportGameData() {
    const gameData = {
        version: '1.0',
        universeSeed: UNIVERSE_SEED,
        player: getPlayer(),
        collection: getCollection(),
        credits: getCredits(),
        missions: getMissions(),
        completedMissions: getCompletedMissions(),
        colonies: getColonies(),
        discoveredLocations: getDiscoveredLocations(),
        bookmarks: getBookmarks(),
        shipPower: getShipPower(),
        shipUpgrades: getShipUpgrades(),
        playerStats: getPlayerStats(),
        achievements: getAchievements(),
        exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(gameData, null, 2);
}

// Import game data from JSON string
function importGameData(jsonString) {
    try {
        const gameData = JSON.parse(jsonString);
        
        // Check universe seed compatibility
        if (gameData.universeSeed !== UNIVERSE_SEED) {
            console.warn('Importing save from different universe seed');
        }
        
        if (gameData.player) savePlayer(gameData.player);
        if (gameData.collection) saveCollection(gameData.collection);
        if (gameData.credits) saveCredits(gameData.credits);
        if (gameData.missions) saveMissions(gameData.missions);
        if (gameData.completedMissions) saveCompletedMissions(gameData.completedMissions);
        if (gameData.colonies) saveColonies(gameData.colonies);
        if (gameData.discoveredLocations) saveDiscoveredLocations(gameData.discoveredLocations);
        if (gameData.bookmarks) localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(gameData.bookmarks));
        if (gameData.shipPower) setShipPower(gameData.shipPower);
        if (gameData.shipUpgrades) saveShipUpgrades(gameData.shipUpgrades);
        if (gameData.playerStats) savePlayerStats(gameData.playerStats);
        if (gameData.achievements) saveAchievements(gameData.achievements);
        
        saveTimestamp();
        return true;
    } catch (e) {
        console.error('Failed to import game data:', e);
        return false;
    }
}

// ===== INITIALIZE =====

// Initialize storage with defaults if needed
function initializeStorage() {
    // Check if player exists, if not create one
    if (!getPlayer()) {
        createNewPlayer();
    }
    
    // Initialize universe seed if not set
    if (!localStorage.getItem(STORAGE_KEYS.UNIVERSE_SEED)) {
        initializeUniverseSeed();
    }
    
    // Check if collection exists
    if (!localStorage.getItem(STORAGE_KEYS.COLLECTION)) {
        saveCollection({});
    }
    
    // Check if credits exist
    if (!localStorage.getItem(STORAGE_KEYS.CREDITS)) {
        saveCredits(12450);
    }
    
    // Check if current location exists
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_COORDINATES)) {
        saveCurrentCoordinates({
            sector: 'B2',
            nebula: { name: 'Orion Nebula', index: 0 },
            star: { name: 'Sol', index: 0 },
            planet: { name: 'Earth', index: 0 }
        });
    }
    
    // Check if ship power exists
    if (!localStorage.getItem(STORAGE_KEYS.SHIP_POWER)) {
        setShipPower(87);
    }
    
    // Initialize settings if needed
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_HAPTICS)) {
        setHapticsEnabled(true);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER)) {
        setAutoGatherEnabled(true);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED)) {
        setOrbitSpeed('gentle');
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_MUSIC)) {
        setMusicVolume(50);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_AMBIENT)) {
        setAmbientVolume(50);
    }
    
    saveTimestamp();
}

// Auto-initialize
initializeStorage();

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STORAGE_KEYS,
        UNIVERSE_SEED,
        getPlayer,
        savePlayer,
        createNewPlayer,
        getCollection,
        saveCollection,
        addElementToCollection,
        getElementCount,
        getTotalElementsCollected,
        getUniqueElementsCount,
        isElementDiscovered,
        getCredits,
        saveCredits,
        addCredits,
        spendCredits,
        getMissions,
        saveMissions,
        getCompletedMissions,
        saveCompletedMissions,
        updateMissionProgress,
        getCurrentCoordinates,
        saveCurrentCoordinates,
        getCurrentSector,
        getCurrentNebula,
        getCurrentStar,
        getCurrentStarIndex,
        getCurrentPlanet,
        getCurrentPlanetType,
        getCurrentPlanetResources,
        setCurrentPlanet,
        getDiscoveredLocations,
        saveDiscoveredLocations,
        addDiscoveredLocation,
        getColonies,
        saveColonies,
        addColony,
        removeColony,
        getColoniesInSector,
        getBookmarks,
        saveBookmark,
        removeBookmark,
        getRecentLocations,
        addToRecent,
        getShipPower,
        setShipPower,
        getShipUpgrades,
        saveShipUpgrades,
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
        setWarpDestination,
        getWarpDestination,
        getWarpRedirect,
        clearWarpData,
        getAchievements,
        saveAchievements,
        unlockAchievement,
        getPlayerStats,
        savePlayerStats,
        updatePlayerStats,
        getLastSaveTime,
        getUniverseSeed,
        initializeUniverseSeed,
        saveGame,
        loadGame,
        resetGame,
        exportGameData,
        importGameData,
        initializeStorage
    };
}

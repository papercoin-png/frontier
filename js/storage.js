// storage.js - Save/load player progress for Voidfarer

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    PLAYER: 'voidfarer_player',
    COLLECTION: 'voidfarer_collection',
    MISSIONS: 'voidfarer_missions',
    COMPLETED_MISSIONS: 'voidfarer_completed_missions',
    CREDITS: 'voidfarer_credits',
    CURRENT_PLANET: 'voidfarer_current_planet',
    SHIP_POWER: 'voidfarer_ship_power',
    SHIP_UPGRADES: 'voidfarer_ship_upgrades',
    SETTINGS_HAPTICS: 'voidfarer_haptics',
    SETTINGS_AUTO_GATHER: 'voidfarer_auto_gather',
    SETTINGS_ORBIT_SPEED: 'voidfarer_orbit_speed',
    SETTINGS_MUSIC: 'voidfarer_music',
    SETTINGS_AMBIENT: 'voidfarer_ambient',
    WARP_DESTINATION: 'voidfarer_warp_destination',
    WARP_REDIRECT: 'voidfarer_warp_redirect',
    CURRENT_PLANET_ELEMENTS: 'voidfarer_current_planet_elements',
    PLAYER_STATS: 'voidfarer_player_stats',
    ACHIEVEMENTS: 'voidfarer_achievements',
    VISITED_PLANETS: 'voidfarer_visited_planets',
    LAST_SAVE: 'voidfarer_last_save'
};

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

// Add element to collection
function addElementToCollection(elementName, count = 1) {
    const collection = getCollection();
    
    if (!collection[elementName]) {
        collection[elementName] = {
            count: count,
            firstFound: new Date().toISOString()
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
    
    return Object.keys(collection).length;
}

// Get element count
function getElementCount(elementName) {
    const collection = getCollection();
    return collection[elementName]?.count || 0;
}

// Get total elements collected
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

// ===== PLANET DATA =====

// Get current planet
function getCurrentPlanet() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Verdant Prime';
}

// Set current planet
function setCurrentPlanet(planet) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, planet);
    
    // Add to visited planets
    const visited = getVisitedPlanets();
    if (!visited.includes(planet)) {
        visited.push(planet);
        saveVisitedPlanets(visited);
    }
}

// Get current planet elements
function getCurrentPlanetElements() {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_ELEMENTS);
    return data ? JSON.parse(data) : [];
}

// Set current planet elements
function setCurrentPlanetElements(elements) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_ELEMENTS, JSON.stringify(elements));
}

// Get visited planets
function getVisitedPlanets() {
    const data = localStorage.getItem(STORAGE_KEYS.VISITED_PLANETS);
    return data ? JSON.parse(data) : ['Verdant Prime'];
}

// Save visited planets
function saveVisitedPlanets(planets) {
    localStorage.setItem(STORAGE_KEYS.VISITED_PLANETS, JSON.stringify(planets));
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
        planetsVisited: 1,
        elementsDiscovered: 0,
        missionsCompleted: 0,
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

// ===== SAVE GAME =====

// Save complete game state
function saveGame() {
    // Timestamp is saved by individual functions
    saveTimestamp();
}

// Load complete game state (just a check)
function loadGame() {
    return {
        player: getPlayer(),
        collection: getCollection(),
        credits: getCredits(),
        missions: getMissions(),
        currentPlanet: getCurrentPlanet(),
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
    
    // Initialize empty collection
    saveCollection({});
    
    // Set default credits
    saveCredits(12450);
    
    // Set default planet
    setCurrentPlanet('Verdant Prime');
    
    // Set default ship power
    setShipPower(87);
    
    saveTimestamp();
}

// ===== EXPORT DATA =====

// Export all game data as JSON string
function exportGameData() {
    const gameData = {
        player: getPlayer(),
        collection: getCollection(),
        credits: getCredits(),
        missions: getMissions(),
        completedMissions: getCompletedMissions(),
        currentPlanet: getCurrentPlanet(),
        shipPower: getShipPower(),
        shipUpgrades: getShipUpgrades(),
        visitedPlanets: getVisitedPlanets(),
        achievements: getAchievements(),
        stats: getPlayerStats(),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    return JSON.stringify(gameData, null, 2);
}

// Import game data from JSON string
function importGameData(jsonString) {
    try {
        const gameData = JSON.parse(jsonString);
        
        if (gameData.player) savePlayer(gameData.player);
        if (gameData.collection) saveCollection(gameData.collection);
        if (gameData.credits) saveCredits(gameData.credits);
        if (gameData.missions) saveMissions(gameData.missions);
        if (gameData.completedMissions) saveCompletedMissions(gameData.completedMissions);
        if (gameData.currentPlanet) setCurrentPlanet(gameData.currentPlanet);
        if (gameData.shipPower) setShipPower(gameData.shipPower);
        if (gameData.shipUpgrades) saveShipUpgrades(gameData.shipUpgrades);
        if (gameData.visitedPlanets) saveVisitedPlanets(gameData.visitedPlanets);
        if (gameData.achievements) saveAchievements(gameData.achievements);
        if (gameData.stats) savePlayerStats(gameData.stats);
        
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
    
    // Check if collection exists
    if (!localStorage.getItem(STORAGE_KEYS.COLLECTION)) {
        saveCollection({});
    }
    
    // Check if credits exist
    if (!localStorage.getItem(STORAGE_KEYS.CREDITS)) {
        saveCredits(12450);
    }
    
    // Check if current planet exists
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET)) {
        setCurrentPlanet('Verdant Prime');
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

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STORAGE_KEYS,
        getPlayer,
        savePlayer,
        createNewPlayer,
        getCollection,
        saveCollection,
        addElementToCollection,
        getElementCount,
        getTotalElementsCollected,
        getUniqueElementsCount,
        getCredits,
        saveCredits,
        addCredits,
        spendCredits,
        getMissions,
        saveMissions,
        getCompletedMissions,
        saveCompletedMissions,
        getCurrentPlanet,
        setCurrentPlanet,
        getCurrentPlanetElements,
        setCurrentPlanetElements,
        getVisitedPlanets,
        saveVisitedPlanets,
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
        saveGame,
        loadGame,
        resetGame,
        exportGameData,
        importGameData,
        initializeStorage
    };
}

// js/storage/storage.js - DEBUG VERSION
// Simplified to isolate duplicate export issue

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    LAST_SAVE: 'voidfarer_last_save',
    PLAYER: 'voidfarer_player',
    PLAYER_ID: 'voidfarer_player_id',
    CREDITS: 'voidfarer_credits',
    SHIP_FUEL: 'voidfarer_ship_fuel',
    SHIP_POWER: 'voidfarer_ship_power',
    CURRENT_PLANET: 'voidfarer_current_planet',
    CURRENT_PLANET_TYPE: 'voidfarer_current_planet_type',
    CURRENT_SECTOR: 'voidfarer_current_sector',
    CURRENT_REGION: 'voidfarer_current_region',
    SETTINGS_HAPTICS: 'voidfarer_haptics',
    SETTINGS_AUTO_GATHER: 'voidfarer_auto_gather'
};

// ===== ELEMENT MASS (simplified) =====
const ELEMENT_MASS = {
    'Hydrogen': 1.008,
    'Helium': 4.003,
    'Carbon': 12.011,
    'Oxygen': 16.00,
    'Iron': 55.85,
    'Gold': 197.0,
    'Uranium': 238.0
};

const DEFAULT_MASS = 100.0;

// ===== HELPER FUNCTIONS =====

/**
 * Get element mass
 * @param {string} elementName - Name of element
 * @returns {number} Mass value
 */
export function getElementMass(elementName) {
    return ELEMENT_MASS[elementName] || DEFAULT_MASS;
}

/**
 * Get cargo mass limit from window or use fallback
 * @returns {number} Mass limit
 */
export function getCargoMassLimit() {
    return typeof window.CARGO_MASS_LIMIT !== 'undefined' ? window.CARGO_MASS_LIMIT : 5000;
}

// ===== PLAYER DATA =====

/**
 * Get player data
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Player object
 */
export async function getPlayer(playerId = 'main') {
    try {
        const key = `${STORAGE_KEYS.PLAYER}_${playerId}`;
        const saved = localStorage.getItem(key);
        console.log('getPlayer:', playerId, saved ? 'found' : 'not found');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error getting player:', error);
        return null;
    }
}

/**
 * Save player data
 * @param {Object} playerData - Player data
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success status
 */
export async function savePlayer(playerData, playerId = 'main') {
    try {
        const key = `${STORAGE_KEYS.PLAYER}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(playerData));
        saveTimestamp();
        console.log('savePlayer: success');
        return true;
    } catch (error) {
        console.error('Error saving player:', error);
        return false;
    }
}

/**
 * Create default player
 * @param {string} name - Player name
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Created player
 */
export async function createDefaultPlayer(name = 'Voidfarer', playerId = 'main') {
    try {
        const player = {
            id: playerId,
            name: name,
            ship: 'Prospector',
            shipLevel: 1,
            created: new Date().toISOString(),
            lastPlayed: new Date().toISOString(),
            credits: 5000,
            cargoMassLimit: getCargoMassLimit()
        };
        
        await savePlayer(player, playerId);
        console.log('Created default player:', playerId);
        return player;
    } catch (error) {
        console.error('Error creating default player:', error);
        return null;
    }
}

/**
 * Get or create player ID
 * @returns {string} Player ID
 */
export function getPlayerId() {
    let playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) {
        playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(STORAGE_KEYS.PLAYER_ID, playerId);
        console.log('Created new player ID:', playerId);
    }
    return playerId;
}

// ===== CREDITS =====

/**
 * Get player credits
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Credits
 */
export async function getCredits(playerId = 'main') {
    try {
        const player = await getPlayer(playerId);
        return player?.credits || 5000;
    } catch (error) {
        console.error('Error getting credits:', error);
        return 5000;
    }
}

/**
 * Save credits
 * @param {number} credits - Credits amount
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success status
 */
export async function saveCredits(credits, playerId = 'main') {
    try {
        const player = await getPlayer(playerId);
        if (player) {
            player.credits = credits;
            await savePlayer(player, playerId);
        }
        return true;
    } catch (error) {
        console.error('Error saving credits:', error);
        return false;
    }
}

/**
 * Add credits
 * @param {number} amount - Amount to add
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} New total
 */
export async function addCredits(amount, playerId = 'main') {
    try {
        const current = await getCredits(playerId);
        const newTotal = current + amount;
        await saveCredits(newTotal, playerId);
        return newTotal;
    } catch (error) {
        console.error('Error adding credits:', error);
        return 5000;
    }
}

/**
 * Spend credits
 * @param {number} amount - Amount to spend
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success if had enough
 */
export async function spendCredits(amount, playerId = 'main') {
    try {
        const current = await getCredits(playerId);
        if (current >= amount) {
            await saveCredits(current - amount, playerId);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error spending credits:', error);
        return false;
    }
}

// ===== LOCATION HELPERS =====

/**
 * Check if player is at Earth
 * @returns {boolean} True if at Earth
 */
export function isAtEarth() {
    const currentPlanet = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Earth';
    return currentPlanet === 'Earth';
}

/**
 * Get current planet name
 * @returns {string} Planet name
 */
export function getCurrentPlanetName() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Unknown';
}

/**
 * Get current planet type
 * @returns {string} Planet type
 */
export function getCurrentPlanetType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_TYPE) || 'unknown';
}

/**
 * Get current sector
 * @returns {string} Sector ID
 */
export function getCurrentSector() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR) || 'B2';
}

/**
 * Get current region
 * @returns {string} Region name
 */
export function getCurrentRegion() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_REGION) || 'Orion Arm';
}

/**
 * Set current location
 * @param {string} region - Region name
 * @param {string} sector - Sector ID
 */
export function setCurrentLocation(region, sector) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_REGION, region);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR, sector);
    console.log('Location set:', region, sector);
}

/**
 * Set current planet
 * @param {string} name - Planet name
 * @param {string} type - Planet type
 */
export function setCurrentPlanet(name, type) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_TYPE, type);
    console.log('Planet set:', name, type);
}

// ===== SHIP DATA =====

/**
 * Get ship fuel
 * @returns {number} Fuel percentage
 */
export function getShipFuel() {
    try {
        return parseInt(localStorage.getItem(STORAGE_KEYS.SHIP_FUEL)) || 100;
    } catch (error) {
        console.error('Error getting ship fuel:', error);
        return 100;
    }
}

/**
 * Save ship fuel
 * @param {number} fuel - Fuel percentage
 */
export function saveShipFuel(fuel) {
    try {
        localStorage.setItem(STORAGE_KEYS.SHIP_FUEL, fuel.toString());
    } catch (error) {
        console.error('Error saving ship fuel:', error);
    }
}

/**
 * Get ship power
 * @returns {number} Power percentage
 */
export function getShipPower() {
    try {
        return parseInt(localStorage.getItem(STORAGE_KEYS.SHIP_POWER)) || 100;
    } catch (error) {
        console.error('Error getting ship power:', error);
        return 100;
    }
}

/**
 * Save ship power
 * @param {number} power - Power percentage
 */
export function saveShipPower(power) {
    try {
        localStorage.setItem(STORAGE_KEYS.SHIP_POWER, power.toString());
    } catch (error) {
        console.error('Error saving ship power:', error);
    }
}

// ===== SETTINGS =====

/**
 * Get haptics enabled
 * @returns {boolean} True if enabled
 */
export function getHapticsEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_HAPTICS) !== 'false';
}

/**
 * Set haptics enabled
 * @param {boolean} enabled - Enabled state
 */
export function setHapticsEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_HAPTICS, enabled.toString());
}

/**
 * Get auto gather enabled
 * @returns {boolean} True if enabled
 */
export function getAutoGatherEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER) !== 'false';
}

/**
 * Set auto gather enabled
 * @param {boolean} enabled - Enabled state
 */
export function setAutoGatherEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER, enabled.toString());
}

// ===== SAVE TIMESTAMP =====

/**
 * Save timestamp of last save
 */
export function saveTimestamp() {
    const timestamp = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, timestamp);
    console.log('saveTimestamp:', timestamp);
}

// ===== INITIALIZATION =====

/**
 * Initialize storage
 * @param {string} playerId - Player ID
 */
export async function initializeStorage(playerId = 'main') {
    console.log('Initializing storage for player:', playerId);
    
    // Create default player if doesn't exist
    const player = await getPlayer(playerId);
    if (!player) {
        await createDefaultPlayer('Voidfarer', playerId);
    }
    
    // Initialize settings if not present
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_HAPTICS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS_HAPTICS, 'true');
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER, 'true');
    }
    
    // Initialize location if not set
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR)) {
        setCurrentLocation('Orion Arm', 'B2');
    }
    
    // Set initial planet if not set
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET)) {
        setCurrentPlanet('Earth', 'lush');
    }
    
    console.log('Storage initialized for player:', playerId);
    return true;
}

// ===== RESET =====

/**
 * Reset all game data for a player
 * @param {string} playerId - Player ID
 */
export async function resetGame(playerId = 'main') {
    console.log('Resetting game for player:', playerId);
    
    // Save settings to restore after reset
    const settings = {
        haptics: getHapticsEnabled(),
        autoGather: getAutoGatherEnabled()
    };
    
    // Clear all player-specific data
    const keysToRemove = [
        `${STORAGE_KEYS.PLAYER}_${playerId}`,
        STORAGE_KEYS.PLAYER_ID,
        STORAGE_KEYS.CREDITS,
        STORAGE_KEYS.SHIP_FUEL,
        STORAGE_KEYS.SHIP_POWER,
        STORAGE_KEYS.CURRENT_SECTOR,
        STORAGE_KEYS.CURRENT_REGION,
        STORAGE_KEYS.CURRENT_PLANET,
        STORAGE_KEYS.CURRENT_PLANET_TYPE,
        STORAGE_KEYS.LAST_SAVE
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Restore settings
    setHapticsEnabled(settings.haptics);
    setAutoGatherEnabled(settings.autoGather);
    
    // Re-initialize
    await initializeStorage(playerId);
    console.log('Game reset complete');
}

// ===== TEST FUNCTION =====

/**
 * Test function to verify module loads correctly
 * @returns {boolean} Always true
 */
export function test() {
    console.log('✅ storage.js debug version loaded successfully');
    console.log('Available functions:', Object.keys({
        getElementMass,
        getCargoMassLimit,
        getPlayer,
        savePlayer,
        createDefaultPlayer,
        getPlayerId,
        getCredits,
        saveCredits,
        addCredits,
        spendCredits,
        isAtEarth,
        getCurrentPlanetName,
        getCurrentPlanetType,
        getCurrentSector,
        getCurrentRegion,
        setCurrentLocation,
        setCurrentPlanet,
        getShipFuel,
        saveShipFuel,
        getShipPower,
        saveShipPower,
        getHapticsEnabled,
        setHapticsEnabled,
        getAutoGatherEnabled,
        setAutoGatherEnabled,
        saveTimestamp,
        initializeStorage,
        resetGame,
        test
    }).join(', '));
    return true;
}

// ============================================================================
// EXPORTS - SINGLE EXPORT SECTION
// ============================================================================

// Named exports
export {
    STORAGE_KEYS,
    ELEMENT_MASS,
    getElementMass,
    getCargoMassLimit,
    getPlayer,
    savePlayer,
    createDefaultPlayer,
    getPlayerId,
    getCredits,
    saveCredits,
    addCredits,
    spendCredits,
    isAtEarth,
    getCurrentPlanetName,
    getCurrentPlanetType,
    getCurrentSector,
    getCurrentRegion,
    setCurrentLocation,
    setCurrentPlanet,
    getShipFuel,
    saveShipFuel,
    getShipPower,
    saveShipPower,
    getHapticsEnabled,
    setHapticsEnabled,
    getAutoGatherEnabled,
    setAutoGatherEnabled,
    saveTimestamp,
    initializeStorage,
    resetGame,
    test
};

// Default export
export default {
    STORAGE_KEYS,
    ELEMENT_MASS,
    getElementMass,
    getCargoMassLimit,
    getPlayer,
    savePlayer,
    createDefaultPlayer,
    getPlayerId,
    getCredits,
    saveCredits,
    addCredits,
    spendCredits,
    isAtEarth,
    getCurrentPlanetName,
    getCurrentPlanetType,
    getCurrentSector,
    getCurrentRegion,
    setCurrentLocation,
    setCurrentPlanet,
    getShipFuel,
    saveShipFuel,
    getShipPower,
    saveShipPower,
    getHapticsEnabled,
    setHapticsEnabled,
    getAutoGatherEnabled,
    setAutoGatherEnabled,
    saveTimestamp,
    initializeStorage,
    resetGame,
    test
};

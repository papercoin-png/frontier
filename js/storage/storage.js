// js/storage/storage.js - Complete version with all needed functions
// NO DUPLICATE EXPORTS - Fixed

// Storage keys
const STORAGE_KEYS = {
    PLAYER: 'voidfarer_player',
    PLAYER_ID: 'voidfarer_player_id',
    COLLECTION: 'voidfarer_collection',
    CREDITS: 'voidfarer_credits',
    LAST_SAVE: 'voidfarer_last_save'
};

// ===== PLAYER FUNCTIONS =====
export async function getPlayer(playerId = 'main') {
    try {
        const key = `${STORAGE_KEYS.PLAYER}_${playerId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            return JSON.parse(saved);
        }
        // Return default player
        return { 
            name: 'Voidfarer', 
            credits: 5000,
            id: playerId
        };
    } catch (error) {
        console.error('Error getting player:', error);
        return { name: 'Voidfarer', credits: 5000, id: playerId };
    }
}

export async function savePlayer(playerData, playerId = 'main') {
    try {
        const key = `${STORAGE_KEYS.PLAYER}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(playerData));
        saveTimestamp();
        return true;
    } catch (error) {
        console.error('Error saving player:', error);
        return false;
    }
}

// ===== COLLECTION FUNCTIONS =====
export async function getCollection(playerId = 'main') {
    try {
        const key = `${STORAGE_KEYS.COLLECTION}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting collection:', error);
        return {};
    }
}

export async function addElementToCollection(elementName, quantity = 1, locationData = {}, playerId = 'main') {
    try {
        const collection = await getCollection(playerId);
        
        if (!collection[elementName]) {
            collection[elementName] = { 
                count: 0, 
                firstFound: Date.now(),
                locations: []
            };
        }
        
        collection[elementName].count += quantity;
        collection[elementName].lastFound = Date.now();
        
        if (locationData.planet) {
            if (!collection[elementName].locations) {
                collection[elementName].locations = [];
            }
            collection[elementName].locations.push({
                planet: locationData.planet,
                planetType: locationData.planetType,
                quantity: quantity,
                timestamp: locationData.timestamp || Date.now()
            });
        }
        
        const key = `${STORAGE_KEYS.COLLECTION}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(collection));
        saveTimestamp();
        
        return { success: true, collection };
    } catch (error) {
        console.error('Error adding element to collection:', error);
        return { success: false };
    }
}

// ===== CREDITS FUNCTIONS =====
export async function getCredits(playerId = 'main') {
    try {
        const player = await getPlayer(playerId);
        return player?.credits || 5000;
    } catch (error) {
        console.error('Error getting credits:', error);
        return 5000;
    }
}

export async function saveCredits(credits, playerId = 'main') {
    try {
        const player = await getPlayer(playerId);
        if (player) {
            player.credits = credits;
            await savePlayer(player, playerId);
        }
        saveTimestamp();
        return true;
    } catch (error) {
        console.error('Error saving credits:', error);
        return false;
    }
}

export async function addCreditsToOwner(ownerId, amount) {
    try {
        const owner = await getPlayer(ownerId);
        if (owner) {
            owner.credits = (owner.credits || 5000) + amount;
            await savePlayer(owner, ownerId);
        }
        return true;
    } catch (error) {
        console.error('Error adding credits to owner:', error);
        return false;
    }
}

// ===== TIMESTAMP =====
export function saveTimestamp() {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
}

// ===== PLAYER ID =====
export function getPlayerId() {
    let playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) {
        playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(STORAGE_KEYS.PLAYER_ID, playerId);
    }
    return playerId;
}

// ============================================================================
// SINGLE EXPORT SECTION - NO DUPLICATES
// ============================================================================

// Named exports - each function appears exactly ONCE
export {
    STORAGE_KEYS,
    getPlayer,
    savePlayer,
    getCollection,
    addElementToCollection,
    getCredits,
    saveCredits,
    addCreditsToOwner,
    getPlayerId,
    saveTimestamp
};

// Default export - separate from named exports, this is allowed
export default {
    STORAGE_KEYS,
    getPlayer,
    savePlayer,
    getCollection,
    addElementToCollection,
    getCredits,
    saveCredits,
    addCreditsToOwner,
    getPlayerId,
    saveTimestamp
};

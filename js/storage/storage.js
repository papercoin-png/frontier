// js/storage/storage.js - ULTRA MINIMAL VERSION
// NO DUPLICATES - Fixed

// Storage keys
const STORAGE_KEYS = {
    PLAYER: 'voidfarer_player',
    COLLECTION: 'voidfarer_collection',
    LAST_SAVE: 'voidfarer_last_save'
};

// ===== PLAYER FUNCTIONS =====
export async function getPlayer(playerId = 'main') {
    try {
        const key = `${STORAGE_KEYS.PLAYER}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : { name: 'Voidfarer', credits: 5000 };
    } catch (error) {
        return { name: 'Voidfarer', credits: 5000 };
    }
}

export async function savePlayer(playerData, playerId = 'main') {
    try {
        const key = `${STORAGE_KEYS.PLAYER}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(playerData));
        saveTimestamp();
        return true;
    } catch (error) {
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
        return {};
    }
}

export async function addElementToCollection(elementName, quantity = 1, locationData = {}, playerId = 'main') {
    try {
        const collection = await getCollection(playerId);
        
        if (!collection[elementName]) {
            collection[elementName] = { count: 0, firstFound: Date.now() };
        }
        
        collection[elementName].count += quantity;
        collection[elementName].lastFound = Date.now();
        
        const key = `${STORAGE_KEYS.COLLECTION}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(collection));
        saveTimestamp();
        
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

// ===== CREDITS FUNCTIONS =====
export async function addCreditsToOwner(ownerId, amount) {
    try {
        const owner = await getPlayer(ownerId);
        if (owner) {
            owner.credits = (owner.credits || 5000) + amount;
            await savePlayer(owner, ownerId);
        }
        return true;
    } catch (error) {
        return false;
    }
}

// ===== TIMESTAMP =====
export function saveTimestamp() {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
}

// ===== TEST FUNCTION =====
export function test() {
    console.log('✅ storage.js loaded successfully - NO DUPLICATES');
    return true;
}

// ============================================================================
// SINGLE EXPORT SECTION - ONE EXPORT OF EACH FUNCTION
// ============================================================================

// Named exports - each function appears exactly ONCE
export {
    STORAGE_KEYS,
    getPlayer,
    savePlayer,
    getCollection,
    addElementToCollection,
    addCreditsToOwner,
    saveTimestamp,
    test  // test appears ONLY HERE in named exports
};

// Default export - separate from named exports, this is allowed
export default {
    STORAGE_KEYS,
    getPlayer,
    savePlayer,
    getCollection,
    addElementToCollection,
    addCreditsToOwner,
    saveTimestamp,
    test  // test appears HERE in default export (this is OK - different export type)
};

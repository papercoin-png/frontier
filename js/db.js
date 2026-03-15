// js/db.js - IndexedDB wrapper for Voidfarer
// Provides persistent storage with async/await interface

const DB_NAME = 'voidfarer_db';
const DB_VERSION = 3; // Increment for schema changes

// Store names
const STORES = {
    PLAYER: 'player',
    COLLECTION: 'collection',
    MISSIONS: 'missions',
    COMPLETED_MISSIONS: 'completedMissions',
    SCAN_HISTORY: 'scanHistory',
    COLONIES: 'colonies',
    DISCOVERED_LOCATIONS: 'discoveredLocations',
    BOOKMARKS: 'bookmarks',
    RECENT_LOCATIONS: 'recentLocations',
    SHIP_UPGRADES: 'shipUpgrades',
    PLAYER_STATS: 'playerStats',
    ACHIEVEMENTS: 'achievements',
    TAX_TRANSACTIONS: 'taxTransactions',
    ACTIVE_EVENTS: 'activeEvents',
    EVENT_HISTORY: 'eventHistory',
    REAL_ESTATE: 'realEstate',
    CLAIMED_PLANETS: 'claimedPlanets',
    // Alchemy stores
    ALCHEMY_PROGRESS: 'alchemyProgress',
    ALCHEMY_RECIPES_UNLOCKED: 'alchemyRecipesUnlocked',
    ALCHEMY_CATEGORY_PROGRESS: 'alchemyCategoryProgress',
    ALCHEMY_MASTERY: 'alchemyMastery',
    // Element locations store
    ELEMENT_LOCATIONS: 'elementLocations',
    // Labor pool stores
    LABOR_POOL: 'laborPool',
    LABOR_EARNINGS: 'laborEarnings',
    LABOR_HISTORY: 'laborHistory'
};

// Database connection
let db = null;

// ===== INITIALIZATION =====

/**
 * Initialize the database
 * @returns {Promise<IDBDatabase>} Database instance
 */
async function initDB() {
    if (db) return db;
    
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('Database error:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            console.log('Database opened successfully');
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const oldVersion = event.oldVersion;
            console.log(`Upgrading database from version ${oldVersion} to ${DB_VERSION}`);
            
            // Create stores if they don't exist
            if (!db.objectStoreNames.contains(STORES.PLAYER)) {
                const playerStore = db.createObjectStore(STORES.PLAYER, { keyPath: 'id' });
                playerStore.createIndex('name', 'name', { unique: false });
                console.log('Created player store');
            }
            
            if (!db.objectStoreNames.contains(STORES.COLLECTION)) {
                const collectionStore = db.createObjectStore(STORES.COLLECTION, { keyPath: 'elementName' });
                collectionStore.createIndex('rarity', 'rarity', { unique: false });
                collectionStore.createIndex('firstFound', 'firstFound', { unique: false });
                console.log('Created collection store');
            }
            
            if (!db.objectStoreNames.contains(STORES.MISSIONS)) {
                const missionsStore = db.createObjectStore(STORES.MISSIONS, { keyPath: 'id', autoIncrement: true });
                missionsStore.createIndex('status', 'status', { unique: false });
                missionsStore.createIndex('deadline', 'deadline', { unique: false });
                console.log('Created missions store');
            }
            
            if (!db.objectStoreNames.contains(STORES.COMPLETED_MISSIONS)) {
                db.createObjectStore(STORES.COMPLETED_MISSIONS, { keyPath: 'id', autoIncrement: true });
                console.log('Created completed missions store');
            }
            
            if (!db.objectStoreNames.contains(STORES.SCAN_HISTORY)) {
                const scanStore = db.createObjectStore(STORES.SCAN_HISTORY, { keyPath: 'id', autoIncrement: true });
                scanStore.createIndex('timestamp', 'timestamp', { unique: false });
                scanStore.createIndex('planet', 'planet', { unique: false });
                console.log('Created scan history store');
            }
            
            if (!db.objectStoreNames.contains(STORES.COLONIES)) {
                const coloniesStore = db.createObjectStore(STORES.COLONIES, { keyPath: 'planetName' });
                coloniesStore.createIndex('founded', 'founded', { unique: false });
                coloniesStore.createIndex('population', 'population', { unique: false });
                console.log('Created colonies store');
            }
            
            if (!db.objectStoreNames.contains(STORES.DISCOVERED_LOCATIONS)) {
                const locationsStore = db.createObjectStore(STORES.DISCOVERED_LOCATIONS, { keyPath: 'id', autoIncrement: true });
                locationsStore.createIndex('planet', 'planet', { unique: false });
                locationsStore.createIndex('elementName', 'elementName', { unique: false });
                locationsStore.createIndex('discoveredAt', 'discoveredAt', { unique: false });
                console.log('Created discovered locations store');
            }
            
            if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
                const bookmarksStore = db.createObjectStore(STORES.BOOKMARKS, { keyPath: 'id', autoIncrement: true });
                bookmarksStore.createIndex('planet', 'planet', { unique: false });
                bookmarksStore.createIndex('star', 'star', { unique: false });
                console.log('Created bookmarks store');
            }
            
            if (!db.objectStoreNames.contains(STORES.RECENT_LOCATIONS)) {
                const recentStore = db.createObjectStore(STORES.RECENT_LOCATIONS, { keyPath: 'id', autoIncrement: true });
                recentStore.createIndex('timestamp', 'timestamp', { unique: false });
                console.log('Created recent locations store');
            }
            
            if (!db.objectStoreNames.contains(STORES.SHIP_UPGRADES)) {
                db.createObjectStore(STORES.SHIP_UPGRADES, { keyPath: 'id' });
                console.log('Created ship upgrades store');
            }
            
            if (!db.objectStoreNames.contains(STORES.PLAYER_STATS)) {
                db.createObjectStore(STORES.PLAYER_STATS, { keyPath: 'id' });
                console.log('Created player stats store');
            }
            
            if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
                const achievementsStore = db.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: 'id' });
                achievementsStore.createIndex('unlocked', 'unlocked', { unique: false });
                console.log('Created achievements store');
            }
            
            if (!db.objectStoreNames.contains(STORES.TAX_TRANSACTIONS)) {
                const taxStore = db.createObjectStore(STORES.TAX_TRANSACTIONS, { keyPath: 'id', autoIncrement: true });
                taxStore.createIndex('timestamp', 'timestamp', { unique: false });
                taxStore.createIndex('playerId', 'playerId', { unique: false });
                console.log('Created tax transactions store');
            }
            
            if (!db.objectStoreNames.contains(STORES.ACTIVE_EVENTS)) {
                const eventsStore = db.createObjectStore(STORES.ACTIVE_EVENTS, { keyPath: 'id' });
                eventsStore.createIndex('expiresAt', 'expiresAt', { unique: false });
                eventsStore.createIndex('severity', 'severity', { unique: false });
                console.log('Created active events store');
            }
            
            if (!db.objectStoreNames.contains(STORES.EVENT_HISTORY)) {
                const historyStore = db.createObjectStore(STORES.EVENT_HISTORY, { keyPath: 'id', autoIncrement: true });
                historyStore.createIndex('timestamp', 'timestamp', { unique: false });
                console.log('Created event history store');
            }
            
            if (!db.objectStoreNames.contains(STORES.REAL_ESTATE)) {
                const realEstateStore = db.createObjectStore(STORES.REAL_ESTATE, { keyPath: 'id', autoIncrement: true });
                realEstateStore.createIndex('type', 'type', { unique: false });
                realEstateStore.createIndex('purchaseDate', 'purchaseDate', { unique: false });
                realEstateStore.createIndex('location', 'location', { unique: false });
                console.log('Created real estate store');
            }
            
            if (!db.objectStoreNames.contains(STORES.CLAIMED_PLANETS)) {
                const claimedStore = db.createObjectStore(STORES.CLAIMED_PLANETS, { keyPath: 'planetName' });
                claimedStore.createIndex('claimedAt', 'claimedAt', { unique: false });
                claimedStore.createIndex('value', 'value', { unique: false });
                console.log('Created claimed planets store');
            }
            
            if (!db.objectStoreNames.contains(STORES.ALCHEMY_PROGRESS)) {
                const alchemyStore = db.createObjectStore(STORES.ALCHEMY_PROGRESS, { keyPath: 'recipeId' });
                alchemyStore.createIndex('progress', 'progress', { unique: false });
                alchemyStore.createIndex('lastCrafted', 'lastCrafted', { unique: false });
                console.log('Created alchemy progress store');
            }
            
            if (!db.objectStoreNames.contains(STORES.ALCHEMY_RECIPES_UNLOCKED)) {
                db.createObjectStore(STORES.ALCHEMY_RECIPES_UNLOCKED, { keyPath: 'recipeId' });
                console.log('Created alchemy recipes unlocked store');
            }
            
            if (!db.objectStoreNames.contains(STORES.ALCHEMY_CATEGORY_PROGRESS)) {
                db.createObjectStore(STORES.ALCHEMY_CATEGORY_PROGRESS, { keyPath: 'category' });
                console.log('Created alchemy category progress store');
            }
            
            if (!db.objectStoreNames.contains(STORES.ALCHEMY_MASTERY)) {
                db.createObjectStore(STORES.ALCHEMY_MASTERY, { keyPath: 'id' });
                console.log('Created alchemy mastery store');
            }
            
            if (!db.objectStoreNames.contains(STORES.ELEMENT_LOCATIONS)) {
                const elementLocationsStore = db.createObjectStore(STORES.ELEMENT_LOCATIONS, { keyPath: 'id', autoIncrement: true });
                elementLocationsStore.createIndex('elementName', 'elementName', { unique: false });
                elementLocationsStore.createIndex('planet', 'planet', { unique: false });
                elementLocationsStore.createIndex('discoveredAt', 'discoveredAt', { unique: false });
                elementLocationsStore.createIndex('playerId', 'playerId', { unique: false });
                console.log('Created element locations store');
            }
            
            if (!db.objectStoreNames.contains(STORES.LABOR_POOL)) {
                db.createObjectStore(STORES.LABOR_POOL, { keyPath: 'id' });
                console.log('Created labor pool store');
            }
            
            if (!db.objectStoreNames.contains(STORES.LABOR_EARNINGS)) {
                const earningsStore = db.createObjectStore(STORES.LABOR_EARNINGS, { keyPath: 'playerId' });
                earningsStore.createIndex('earnings', 'earnings', { unique: false });
                console.log('Created labor earnings store');
            }
            
            if (!db.objectStoreNames.contains(STORES.LABOR_HISTORY)) {
                const laborHistoryStore = db.createObjectStore(STORES.LABOR_HISTORY, { keyPath: 'id', autoIncrement: true });
                laborHistoryStore.createIndex('timestamp', 'timestamp', { unique: false });
                laborHistoryStore.createIndex('type', 'type', { unique: false });
                console.log('Created labor history store');
            }
        };
    });
}

// ===== GENERIC CRUD OPERATIONS =====

/**
 * Get an item from a store
 * @param {string} storeName - Name of the store
 * @param {string} key - Key of the item
 * @returns {Promise<any>} The item
 */
async function getItem(storeName, key) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Set an item in a store
 * @param {string} storeName - Name of the store
 * @param {any} item - Item to store (must have an id property or keyPath)
 * @returns {Promise<string>} Key of the stored item
 */
async function setItem(storeName, item) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Delete an item from a store
 * @param {string} storeName - Name of the store
 * @param {string} key - Key of the item to delete
 * @returns {Promise<void>}
 */
async function deleteItem(storeName, key) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get all items from a store
 * @param {string} storeName - Name of the store
 * @returns {Promise<Array>} Array of items
 */
async function getAll(storeName) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Clear all items from a store
 * @param {string} storeName - Name of the store
 * @returns {Promise<void>}
 */
async function clearStore(storeName) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// ===== COLLECTION-SPECIFIC FUNCTIONS =====

/**
 * Get collection as object (for compatibility with localStorage format)
 * @returns {Promise<Object>} Collection object with element names as keys
 */
async function getCollectionAsObject() {
    try {
        const items = await getAll(STORES.COLLECTION);
        const collection = {};
        items.forEach(item => {
            collection[item.elementName] = {
                count: item.count,
                firstFound: item.firstFound,
                lastFound: item.lastFound,
                rarity: item.rarity
            };
        });
        return collection;
    } catch (error) {
        console.error('Error getting collection as object:', error);
        return {};
    }
}

/**
 * Add element to collection
 * @param {string} elementName - Name of the element
 * @param {number} count - Number to add
 * @param {Object} locationData - Location data where found
 * @returns {Promise<Object>} Result with success and new count
 */
async function dbAddElementToCollection(elementName, count = 1, locationData = null) {
    try {
        const db = await initDB();
        const transaction = db.transaction([STORES.COLLECTION, STORES.ELEMENT_LOCATIONS], 'readwrite');
        const collectionStore = transaction.objectStore(STORES.COLLECTION);
        const locationsStore = transaction.objectStore(STORES.ELEMENT_LOCATIONS);
        
        return new Promise((resolve, reject) => {
            // Get existing entry
            const getRequest = collectionStore.get(elementName);
            
            getRequest.onsuccess = () => {
                const existing = getRequest.result;
                const now = Date.now();
                const playerId = localStorage.getItem('voidfarer_player_id') || 'unknown';
                
                if (existing) {
                    // Update existing
                    existing.count = (existing.count || 1) + count;
                    existing.lastFound = now;
                    
                    const updateRequest = collectionStore.put(existing);
                    
                    updateRequest.onsuccess = () => {
                        // Save location if provided
                        if (locationData) {
                            const locationEntry = {
                                elementName: elementName,
                                planet: locationData.planet || 'Unknown',
                                planetType: locationData.planetType || 'unknown',
                                quantity: count,
                                discoveredAt: now,
                                discoveredDate: new Date().toISOString(),
                                playerId: playerId,
                                location: locationData
                            };
                            
                            locationsStore.add(locationEntry);
                        }
                        
                        resolve({ 
                            success: true, 
                            count: existing.count,
                            newCount: existing.count
                        });
                    };
                    
                    updateRequest.onerror = () => reject(updateRequest.error);
                    
                } else {
                    // Create new
                    const newEntry = {
                        elementName: elementName,
                        count: count,
                        firstFound: now,
                        lastFound: now,
                        rarity: locationData?.rarity || 'common',
                        discovered: [{
                            planet: locationData?.planet || 'Unknown',
                            date: now,
                            quantity: count
                        }]
                    };
                    
                    const addRequest = collectionStore.add(newEntry);
                    
                    addRequest.onsuccess = () => {
                        // Save location if provided
                        if (locationData) {
                            const locationEntry = {
                                elementName: elementName,
                                planet: locationData.planet || 'Unknown',
                                planetType: locationData.planetType || 'unknown',
                                quantity: count,
                                discoveredAt: now,
                                discoveredDate: new Date().toISOString(),
                                playerId: playerId,
                                location: locationData
                            };
                            
                            locationsStore.add(locationEntry);
                        }
                        
                        resolve({ 
                            success: true, 
                            count: newEntry.count,
                            newCount: newEntry.count
                        });
                    };
                    
                    addRequest.onerror = () => reject(addRequest.error);
                }
            };
            
            getRequest.onerror = () => reject(getRequest.error);
        });
        
    } catch (error) {
        console.error('Error in dbAddElementToCollection:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Remove element from collection
 * @param {string} elementName - Name of the element
 * @param {number} count - Number to remove
 * @returns {Promise<Object>} Result with success
 */
async function dbRemoveElementFromCollection(elementName, count = 1) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.COLLECTION, 'readwrite');
        const store = transaction.objectStore(STORES.COLLECTION);
        
        return new Promise((resolve, reject) => {
            const getRequest = store.get(elementName);
            
            getRequest.onsuccess = () => {
                const existing = getRequest.result;
                
                if (!existing) {
                    resolve({ success: false, reason: 'not_found' });
                    return;
                }
                
                const currentCount = existing.count || 1;
                
                if (currentCount < count) {
                    resolve({ success: false, reason: 'insufficient', available: currentCount });
                    return;
                }
                
                const newCount = currentCount - count;
                
                if (newCount <= 0) {
                    // Delete the entry
                    const deleteRequest = store.delete(elementName);
                    
                    deleteRequest.onsuccess = () => {
                        resolve({ success: true, count: 0, removed: true });
                    };
                    
                    deleteRequest.onerror = () => reject(deleteRequest.error);
                    
                } else {
                    // Update the count
                    existing.count = newCount;
                    existing.lastRemoved = Date.now();
                    
                    const updateRequest = store.put(existing);
                    
                    updateRequest.onsuccess = () => {
                        resolve({ success: true, count: newCount, removed: false });
                    };
                    
                    updateRequest.onerror = () => reject(updateRequest.error);
                }
            };
            
            getRequest.onerror = () => reject(getRequest.error);
        });
        
    } catch (error) {
        console.error('Error in dbRemoveElementFromCollection:', error);
        return { success: false, error: error.message };
    }
}

// ===== ELEMENT LOCATIONS FUNCTIONS =====

/**
 * Save element location
 * @param {string} elementName - Element name
 * @param {string} planet - Planet name
 * @param {Object} locationData - Location metadata
 * @returns {Promise<Object>} Result
 */
async function dbSaveElementLocation(elementName, planet, locationData) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.ELEMENT_LOCATIONS, 'readwrite');
        const store = transaction.objectStore(STORES.ELEMENT_LOCATIONS);
        
        return new Promise((resolve, reject) => {
            const playerId = localStorage.getItem('voidfarer_player_id') || 'unknown';
            
            const entry = {
                elementName: elementName,
                planet: planet,
                planetType: locationData.planetType || 'unknown',
                quantity: locationData.quantity || 1,
                discoveredAt: locationData.timestamp || Date.now(),
                discoveredDate: locationData.discoveredDate || new Date().toISOString(),
                rarity: locationData.rarity || 'common',
                value: locationData.value || 100,
                playerId: playerId,
                location: locationData
            };
            
            const addRequest = store.add(entry);
            
            addRequest.onsuccess = () => {
                resolve({ success: true, id: addRequest.result });
            };
            
            addRequest.onerror = () => reject(addRequest.error);
        });
        
    } catch (error) {
        console.error('Error in dbSaveElementLocation:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all locations for an element
 * @param {string} elementName - Element name
 * @returns {Promise<Array>} Locations
 */
async function dbGetElementLocations(elementName) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.ELEMENT_LOCATIONS, 'readonly');
        const store = transaction.objectStore(STORES.ELEMENT_LOCATIONS);
        const index = store.index('elementName');
        
        return new Promise((resolve, reject) => {
            const request = index.getAll(elementName);
            
            request.onsuccess = () => {
                resolve(request.result || []);
            };
            
            request.onerror = () => reject(request.error);
        });
        
    } catch (error) {
        console.error('Error in dbGetElementLocations:', error);
        return [];
    }
}

// ===== ALCHEMY FUNCTIONS =====

/**
 * Save alchemy progress for a recipe
 * @param {string} recipeId - Recipe ID
 * @param {number} progress - Progress amount
 * @returns {Promise<Object>} Result
 */
async function dbSaveAlchemyProgress(recipeId, progress) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.ALCHEMY_PROGRESS, 'readwrite');
        const store = transaction.objectStore(STORES.ALCHEMY_PROGRESS);
        
        return new Promise((resolve, reject) => {
            const entry = {
                recipeId: recipeId,
                progress: progress,
                lastCrafted: Date.now()
            };
            
            const request = store.put(entry);
            
            request.onsuccess = () => resolve({ success: true });
            request.onerror = () => reject(request.error);
        });
        
    } catch (error) {
        console.error('Error in dbSaveAlchemyProgress:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get alchemy progress for a recipe
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<number>} Progress
 */
async function dbGetAlchemyProgress(recipeId) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.ALCHEMY_PROGRESS, 'readonly');
        const store = transaction.objectStore(STORES.ALCHEMY_PROGRESS);
        
        return new Promise((resolve, reject) => {
            const request = store.get(recipeId);
            
            request.onsuccess = () => {
                resolve(request.result?.progress || 0);
            };
            
            request.onerror = () => reject(request.error);
        });
        
    } catch (error) {
        console.error('Error in dbGetAlchemyProgress:', error);
        return 0;
    }
}

/**
 * Get all alchemy progress
 * @returns {Promise<Array>} All progress entries
 */
async function dbGetAllAlchemyProgress() {
    try {
        return await getAll(STORES.ALCHEMY_PROGRESS);
    } catch (error) {
        console.error('Error in dbGetAllAlchemyProgress:', error);
        return [];
    }
}

/**
 * Unlock a recipe
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<Object>} Result
 */
async function dbUnlockRecipe(recipeId) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.ALCHEMY_RECIPES_UNLOCKED, 'readwrite');
        const store = transaction.objectStore(STORES.ALCHEMY_RECIPES_UNLOCKED);
        
        return new Promise((resolve, reject) => {
            const entry = {
                recipeId: recipeId,
                unlockedAt: Date.now()
            };
            
            const request = store.put(entry);
            
            request.onsuccess = () => resolve({ success: true });
            request.onerror = () => reject(request.error);
        });
        
    } catch (error) {
        console.error('Error in dbUnlockRecipe:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Check if recipe is unlocked
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<boolean>} True if unlocked
 */
async function dbIsRecipeUnlocked(recipeId) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.ALCHEMY_RECIPES_UNLOCKED, 'readonly');
        const store = transaction.objectStore(STORES.ALCHEMY_RECIPES_UNLOCKED);
        
        return new Promise((resolve, reject) => {
            const request = store.get(recipeId);
            
            request.onsuccess = () => {
                resolve(!!request.result);
            };
            
            request.onerror = () => reject(request.error);
        });
        
    } catch (error) {
        console.error('Error in dbIsRecipeUnlocked:', error);
        return false;
    }
}

// ===== REAL ESTATE FUNCTIONS =====

/**
 * Get all properties
 * @returns {Promise<Array>} Properties
 */
async function getAllProperties() {
    try {
        return await getAll(STORES.REAL_ESTATE);
    } catch (error) {
        console.error('Error in getAllProperties:', error);
        return [];
    }
}

/**
 * Add a property
 * @param {Object} property - Property data
 * @returns {Promise<Object>} Result
 */
async function addProperty(property) {
    try {
        const id = await setItem(STORES.REAL_ESTATE, property);
        return { success: true, id };
    } catch (error) {
        console.error('Error in addProperty:', error);
        return { success: false, error: error.message };
    }
}

// ===== LABOR POOL FUNCTIONS =====

/**
 * Add to labor pool
 * @param {number} amount - Amount to add
 * @returns {Promise<Object>} Result
 */
async function dbAddToLaborPool(amount) {
    try {
        const db = await initDB();
        const transaction = db.transaction([STORES.LABOR_POOL, STORES.LABOR_HISTORY], 'readwrite');
        const poolStore = transaction.objectStore(STORES.LABOR_POOL);
        const historyStore = transaction.objectStore(STORES.LABOR_HISTORY);
        
        return new Promise((resolve, reject) => {
            const getRequest = poolStore.get('current');
            
            getRequest.onsuccess = () => {
                const existing = getRequest.result;
                const newTotal = (existing?.total || 0) + amount;
                
                const poolEntry = {
                    id: 'current',
                    total: newTotal,
                    lastUpdated: Date.now()
                };
                
                const putRequest = poolStore.put(poolEntry);
                
                putRequest.onsuccess = () => {
                    // Add to history
                    const historyEntry = {
                        type: 'addition',
                        amount: amount,
                        timestamp: Date.now(),
                        date: new Date().toISOString()
                    };
                    
                    historyStore.add(historyEntry);
                    
                    resolve({ success: true, newTotal });
                };
                
                putRequest.onerror = () => reject(putRequest.error);
            };
            
            getRequest.onerror = () => reject(getRequest.error);
        });
        
    } catch (error) {
        console.error('Error in dbAddToLaborPool:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get labor pool total
 * @returns {Promise<number>} Labor pool total
 */
async function dbGetLaborPoolTotal() {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.LABOR_POOL, 'readonly');
        const store = transaction.objectStore(STORES.LABOR_POOL);
        
        return new Promise((resolve, reject) => {
            const request = store.get('current');
            
            request.onsuccess = () => {
                resolve(request.result?.total || 0);
            };
            
            request.onerror = () => reject(request.error);
        });
        
    } catch (error) {
        console.error('Error in dbGetLaborPoolTotal:', error);
        return 0;
    }
}

/**
 * Add labor earnings for a player
 * @param {string} playerId - Player ID
 * @param {number} amount - Amount earned
 * @returns {Promise<Object>} Result
 */
async function dbAddLaborEarnings(playerId, amount) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.LABOR_EARNINGS, 'readwrite');
        const store = transaction.objectStore(STORES.LABOR_EARNINGS);
        
        return new Promise((resolve, reject) => {
            const getRequest = store.get(playerId);
            
            getRequest.onsuccess = () => {
                const existing = getRequest.result;
                const newTotal = (existing?.earnings || 0) + amount;
                
                const earningsEntry = {
                    playerId: playerId,
                    earnings: newTotal,
                    lastUpdated: Date.now()
                };
                
                const putRequest = store.put(earningsEntry);
                
                putRequest.onsuccess = () => {
                    resolve({ success: true, newTotal });
                };
                
                putRequest.onerror = () => reject(putRequest.error);
            };
            
            getRequest.onerror = () => reject(getRequest.error);
        });
        
    } catch (error) {
        console.error('Error in dbAddLaborEarnings:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get labor earnings for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Earnings
 */
async function dbGetLaborEarnings(playerId) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.LABOR_EARNINGS, 'readonly');
        const store = transaction.objectStore(STORES.LABOR_EARNINGS);
        
        return new Promise((resolve, reject) => {
            const request = store.get(playerId);
            
            request.onsuccess = () => {
                resolve(request.result?.earnings || 0);
            };
            
            request.onerror = () => reject(request.error);
        });
        
    } catch (error) {
        console.error('Error in dbGetLaborEarnings:', error);
        return 0;
    }
}

// ===== RESET FUNCTIONS =====

/**
 * Reset all data (clear all stores)
 * @returns {Promise<Object>} Result
 */
async function resetAllData() {
    try {
        const db = await initDB();
        const storeNames = Object.values(STORES);
        
        for (const storeName of storeNames) {
            await clearStore(storeName);
        }
        
        console.log('All data reset successfully');
        return { success: true };
        
    } catch (error) {
        console.error('Error resetting all data:', error);
        return { success: false, error: error.message };
    }
}

// ===== EXPORT FUNCTIONS =====

// Core functions
window.initDB = initDB;
window.getItem = getItem;
window.setItem = setItem;
window.deleteItem = deleteItem;
window.getAll = getAll;
window.clearStore = clearStore;
window.resetAllData = resetAllData;

// Collection functions
window.getCollectionAsObject = getCollectionAsObject;
window.dbAddElementToCollection = dbAddElementToCollection;
window.dbRemoveElementFromCollection = dbRemoveElementFromCollection;

// Location functions
window.dbSaveElementLocation = dbSaveElementLocation;
window.dbGetElementLocations = dbGetElementLocations;

// Alchemy functions
window.dbSaveAlchemyProgress = dbSaveAlchemyProgress;
window.dbGetAlchemyProgress = dbGetAlchemyProgress;
window.dbGetAllAlchemyProgress = dbGetAllAlchemyProgress;
window.dbUnlockRecipe = dbUnlockRecipe;
window.dbIsRecipeUnlocked = dbIsRecipeUnlocked;

// Real estate functions
window.getAllProperties = getAllProperties;
window.addProperty = addProperty;

// Labor pool functions
window.dbAddToLaborPool = dbAddToLaborPool;
window.dbGetLaborPoolTotal = dbGetLaborPoolTotal;
window.dbAddLaborEarnings = dbAddLaborEarnings;
window.dbGetLaborEarnings = dbGetLaborEarnings;

// Export STORES for use in other modules
window.DB_STORES = STORES;

console.log('✅ db.js initialized - IndexedDB ready');

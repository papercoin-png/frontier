// js/db.js - IndexedDB wrapper for Voidfarer
// Provides persistent storage with async/await interface
// UPDATED: Version 5 - Added NPC trader stores for marketplace NPCs

const DB_NAME = 'voidfarer_db';
const DB_VERSION = 5; // Increment for schema changes (added NPC trader stores)

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
    LABOR_HISTORY: 'laborHistory',
    // Certificate holders store
    CERTIFICATE_HOLDERS: 'certificateHolders',
    // ===== NPC TRADER STORES (NEW) =====
    NPC_TRADERS: 'npcTraders',
    NPC_TRADER_ORDERS: 'npcTraderOrders',
    NPC_TRADER_HISTORY: 'npcTraderHistory'
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
            console.log('Database opened successfully, version:', DB_VERSION);
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
            
            // Certificate holders store
            if (!db.objectStoreNames.contains(STORES.CERTIFICATE_HOLDERS)) {
                const certHoldersStore = db.createObjectStore(STORES.CERTIFICATE_HOLDERS, { keyPath: 'id', autoIncrement: true });
                certHoldersStore.createIndex('certificateId', 'certificateId', { unique: false });
                certHoldersStore.createIndex('playerId', 'playerId', { unique: false });
                certHoldersStore.createIndex('masteryLevel', 'masteryLevel', { unique: false });
                certHoldersStore.createIndex('playerName', 'playerName', { unique: false });
                console.log('Created certificate holders store');
            }
            
            // ===== NPC TRADER STORES (NEW) =====
            
            // NPC Traders master list
            if (!db.objectStoreNames.contains(STORES.NPC_TRADERS)) {
                const npcTradersStore = db.createObjectStore(STORES.NPC_TRADERS, { keyPath: 'id' });
                npcTradersStore.createIndex('type', 'type', { unique: false });
                npcTradersStore.createIndex('personality', 'personality', { unique: false });
                npcTradersStore.createIndex('creditRange', 'creditRange', { unique: false });
                npcTradersStore.createIndex('lastActivity', 'lastActivity', { unique: false });
                npcTradersStore.createIndex('isActive', 'isActive', { unique: false });
                console.log('Created NPC traders store');
            }
            
            // NPC Trader Orders
            if (!db.objectStoreNames.contains(STORES.NPC_TRADER_ORDERS)) {
                const npcOrdersStore = db.createObjectStore(STORES.NPC_TRADER_ORDERS, { keyPath: 'id', autoIncrement: true });
                npcOrdersStore.createIndex('traderId', 'traderId', { unique: false });
                npcOrdersStore.createIndex('element', 'element', { unique: false });
                npcOrdersStore.createIndex('side', 'side', { unique: false });
                npcOrdersStore.createIndex('status', 'status', { unique: false });
                npcOrdersStore.createIndex('price', 'price', { unique: false });
                npcOrdersStore.createIndex('createdAt', 'createdAt', { unique: false });
                npcOrdersStore.createIndex('expiresAt', 'expiresAt', { unique: false });
                console.log('Created NPC trader orders store');
            }
            
            // NPC Trader History
            if (!db.objectStoreNames.contains(STORES.NPC_TRADER_HISTORY)) {
                const npcHistoryStore = db.createObjectStore(STORES.NPC_TRADER_HISTORY, { keyPath: 'id', autoIncrement: true });
                npcHistoryStore.createIndex('traderId', 'traderId', { unique: false });
                npcHistoryStore.createIndex('element', 'element', { unique: false });
                npcHistoryStore.createIndex('side', 'side', { unique: false });
                npcHistoryStore.createIndex('timestamp', 'timestamp', { unique: false });
                npcHistoryStore.createIndex('price', 'price', { unique: false });
                npcHistoryStore.createIndex('quantity', 'quantity', { unique: false });
                console.log('Created NPC trader history store');
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
 * Get items by index from a store
 * @param {string} storeName - Name of the store
 * @param {string} indexName - Name of the index
 * @param {any} value - Value to match
 * @returns {Promise<Array>} Array of items
 */
async function getByIndex(storeName, indexName, value) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get a range of items by index
 * @param {string} storeName - Name of the store
 * @param {string} indexName - Name of the index
 * @param {IDBKeyRange} range - Key range
 * @returns {Promise<Array>} Array of items
 */
async function getByIndexRange(storeName, indexName, range) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(range);
        
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

// ===== CERTIFICATE HOLDER FUNCTIONS =====

/**
 * Update certificate holder mastery
 * @param {string} certificateId - Certificate ID
 * @param {string} playerId - Player ID
 * @param {string} playerName - Player name
 * @param {number} masteryLevel - Mastery level (1-10)
 * @returns {Promise<Object>} Result
 */
async function dbUpdateCertificateHolder(certificateId, playerId, playerName, masteryLevel) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.CERTIFICATE_HOLDERS, 'readwrite');
        const store = transaction.objectStore(STORES.CERTIFICATE_HOLDERS);
        
        return new Promise((resolve, reject) => {
            // First, try to find existing entry for this player and certificate
            const index = store.index('playerId');
            const getRequest = index.getAll(playerId);
            
            getRequest.onsuccess = () => {
                const existingEntries = getRequest.result || [];
                const existingEntry = existingEntries.find(e => e.certificateId === certificateId);
                
                const now = Date.now();
                const entry = {
                    certificateId: certificateId,
                    playerId: playerId,
                    playerName: playerName,
                    masteryLevel: masteryLevel,
                    lastUpdated: now
                };
                
                // If entry exists, preserve its ID
                if (existingEntry && existingEntry.id) {
                    entry.id = existingEntry.id;
                }
                
                const putRequest = store.put(entry);
                
                putRequest.onsuccess = () => {
                    resolve({ 
                        success: true, 
                        id: putRequest.result 
                    });
                };
                
                putRequest.onerror = () => reject(putRequest.error);
            };
            
            getRequest.onerror = () => reject(getRequest.error);
        });
        
    } catch (error) {
        console.error('Error in dbUpdateCertificateHolder:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all certificate holders for a specific certificate
 * @param {string} certificateId - Certificate ID
 * @returns {Promise<Array>} Array of certificate holders
 */
async function dbGetCertificateHolders(certificateId) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.CERTIFICATE_HOLDERS, 'readonly');
        const store = transaction.objectStore(STORES.CERTIFICATE_HOLDERS);
        const index = store.index('certificateId');
        
        return new Promise((resolve, reject) => {
            const request = index.getAll(certificateId);
            
            request.onsuccess = () => {
                resolve(request.result || []);
            };
            
            request.onerror = () => reject(request.error);
        });
        
    } catch (error) {
        console.error('Error in dbGetCertificateHolders:', error);
        return [];
    }
}

/**
 * Get all certificates held by a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Array>} Array of certificates
 */
async function dbGetPlayerCertificates(playerId) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORES.CERTIFICATE_HOLDERS, 'readonly');
        const store = transaction.objectStore(STORES.CERTIFICATE_HOLDERS);
        const index = store.index('playerId');
        
        return new Promise((resolve, reject) => {
            const request = index.getAll(playerId);
            
            request.onsuccess = () => {
                resolve(request.result || []);
            };
            
            request.onerror = () => reject(request.error);
        });
        
    } catch (error) {
        console.error('Error in dbGetPlayerCertificates:', error);
        return [];
    }
}

/**
 * Get a specific certificate holder entry
 * @param {string} certificateId - Certificate ID
 * @param {string} playerId - Player ID
 * @returns {Promise<Object|null>} Certificate holder entry or null
 */
async function dbGetCertificateHolder(certificateId, playerId) {
    try {
        const holders = await dbGetCertificateHolders(certificateId);
        return holders.find(h => h.playerId === playerId) || null;
    } catch (error) {
        console.error('Error in dbGetCertificateHolder:', error);
        return null;
    }
}

// ===== NPC TRADER FUNCTIONS =====

/**
 * Save an NPC trader
 * @param {Object} trader - NPC trader object (must have id)
 * @returns {Promise<Object>} Result
 */
async function dbSaveNPCTrader(trader) {
    try {
        const id = await setItem(STORES.NPC_TRADERS, trader);
        return { success: true, id };
    } catch (error) {
        console.error('Error in dbSaveNPCTrader:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get an NPC trader by ID
 * @param {string} traderId - Trader ID
 * @returns {Promise<Object|null>} Trader object or null
 */
async function dbGetNPCTrader(traderId) {
    try {
        return await getItem(STORES.NPC_TRADERS, traderId);
    } catch (error) {
        console.error('Error in dbGetNPCTrader:', error);
        return null;
    }
}

/**
 * Get all NPC traders
 * @returns {Promise<Array>} Array of traders
 */
async function dbGetAllNPCTraders() {
    try {
        return await getAll(STORES.NPC_TRADERS);
    } catch (error) {
        console.error('Error in dbGetAllNPCTraders:', error);
        return [];
    }
}

/**
 * Get NPC traders by type
 * @param {string} type - Trader type (small, medium, large, whale, marketMaker)
 * @returns {Promise<Array>} Array of traders
 */
async function dbGetNPCTradersByType(type) {
    try {
        return await getByIndex(STORES.NPC_TRADERS, 'type', type);
    } catch (error) {
        console.error('Error in dbGetNPCTradersByType:', error);
        return [];
    }
}

/**
 * Get NPC traders by personality
 * @param {string} personality - Personality type
 * @returns {Promise<Array>} Array of traders
 */
async function dbGetNPCTradersByPersonality(personality) {
    try {
        return await getByIndex(STORES.NPC_TRADERS, 'personality', personality);
    } catch (error) {
        console.error('Error in dbGetNPCTradersByPersonality:', error);
        return [];
    }
}

/**
 * Get active NPC traders
 * @param {boolean} isActive - Active status
 * @returns {Promise<Array>} Array of traders
 */
async function dbGetActiveNPCTraders(isActive = true) {
    try {
        // Get all traders and filter in JavaScript to avoid index key type issues
        const allTraders = await getAll(STORES.NPC_TRADERS);
        return allTraders.filter(trader => trader.isActive === isActive);
    } catch (error) {
        console.error('Error in dbGetActiveNPCTraders:', error);
        return [];
    }
}

/**
 * Get NPC traders by last activity range
 * @param {number} since - Timestamp to filter from
 * @returns {Promise<Array>} Array of traders active since timestamp
 */
async function dbGetNPCTradersByLastActivity(since) {
    try {
        const range = IDBKeyRange.lowerBound(since);
        return await getByIndexRange(STORES.NPC_TRADERS, 'lastActivity', range);
    } catch (error) {
        console.error('Error in dbGetNPCTradersByLastActivity:', error);
        return [];
    }
}

/**
 * Delete an NPC trader
 * @param {string} traderId - Trader ID
 * @returns {Promise<Object>} Result
 */
async function dbDeleteNPCTrader(traderId) {
    try {
        await deleteItem(STORES.NPC_TRADERS, traderId);
        return { success: true };
    } catch (error) {
        console.error('Error in dbDeleteNPCTrader:', error);
        return { success: false, error: error.message };
    }
}

// ===== NPC TRADER ORDER FUNCTIONS =====

/**
 * Save an NPC trader order
 * @param {Object} order - Order object
 * @returns {Promise<Object>} Result with order ID
 */
async function dbSaveNPCOrder(order) {
    try {
        const id = await setItem(STORES.NPC_TRADER_ORDERS, order);
        return { success: true, id };
    } catch (error) {
        console.error('Error in dbSaveNPCOrder:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get an NPC order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object|null>} Order object or null
 */
async function dbGetNPCOrder(orderId) {
    try {
        return await getItem(STORES.NPC_TRADER_ORDERS, orderId);
    } catch (error) {
        console.error('Error in dbGetNPCOrder:', error);
        return null;
    }
}

/**
 * Get all NPC orders
 * @returns {Promise<Array>} Array of orders
 */
async function dbGetAllNPCOrders() {
    try {
        return await getAll(STORES.NPC_TRADER_ORDERS);
    } catch (error) {
        console.error('Error in dbGetAllNPCOrders:', error);
        return [];
    }
}

/**
 * Get NPC orders by trader ID
 * @param {string} traderId - Trader ID
 * @returns {Promise<Array>} Array of orders
 */
async function dbGetNPCOrdersByTrader(traderId) {
    try {
        return await getByIndex(STORES.NPC_TRADER_ORDERS, 'traderId', traderId);
    } catch (error) {
        console.error('Error in dbGetNPCOrdersByTrader:', error);
        return [];
    }
}

/**
 * Get NPC orders by element
 * @param {string} element - Element name
 * @returns {Promise<Array>} Array of orders
 */
async function dbGetNPCOrdersByElement(element) {
    try {
        return await getByIndex(STORES.NPC_TRADER_ORDERS, 'element', element);
    } catch (error) {
        console.error('Error in dbGetNPCOrdersByElement:', error);
        return [];
    }
}

/**
 * Get NPC orders by side
 * @param {string} side - 'buy' or 'sell'
 * @returns {Promise<Array>} Array of orders
 */
async function dbGetNPCOrdersBySide(side) {
    try {
        return await getByIndex(STORES.NPC_TRADER_ORDERS, 'side', side);
    } catch (error) {
        console.error('Error in dbGetNPCOrdersBySide:', error);
        return [];
    }
}

/**
 * Get NPC orders by status
 * @param {string} status - Order status
 * @returns {Promise<Array>} Array of orders
 */
async function dbGetNPCOrdersByStatus(status) {
    try {
        return await getByIndex(STORES.NPC_TRADER_ORDERS, 'status', status);
    } catch (error) {
        console.error('Error in dbGetNPCOrdersByStatus:', error);
        return [];
    }
}

/**
 * Get active NPC orders (status 'active' or 'partial')
 * @returns {Promise<Array>} Array of active orders
 */
async function dbGetActiveNPCOrders() {
    try {
        const allOrders = await dbGetAllNPCOrders();
        return allOrders.filter(o => o.status === 'active' || o.status === 'partial');
    } catch (error) {
        console.error('Error in dbGetActiveNPCOrders:', error);
        return [];
    }
}

/**
 * Get NPC orders by price range
 * @param {string} element - Element name
 * @param {string} side - 'buy' or 'sell'
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Promise<Array>} Array of orders
 */
async function dbGetNPCOrdersByPriceRange(element, side, minPrice, maxPrice) {
    try {
        const orders = await dbGetNPCOrdersByElement(element);
        const sideOrders = orders.filter(o => o.side === side);
        return sideOrders.filter(o => o.price >= minPrice && o.price <= maxPrice);
    } catch (error) {
        console.error('Error in dbGetNPCOrdersByPriceRange:', error);
        return [];
    }
}

/**
 * Delete an NPC order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Result
 */
async function dbDeleteNPCOrder(orderId) {
    try {
        await deleteItem(STORES.NPC_TRADER_ORDERS, orderId);
        return { success: true };
    } catch (error) {
        console.error('Error in dbDeleteNPCOrder:', error);
        return { success: false, error: error.message };
    }
}

// ===== NPC TRADER HISTORY FUNCTIONS =====

/**
 * Record an NPC trade in history
 * @param {Object} trade - Trade object
 * @returns {Promise<Object>} Result with trade ID
 */
async function dbRecordNPCTrade(trade) {
    try {
        const id = await setItem(STORES.NPC_TRADER_HISTORY, trade);
        return { success: true, id };
    } catch (error) {
        console.error('Error in dbRecordNPCTrade:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get trade history for an NPC trader
 * @param {string} traderId - Trader ID
 * @param {number} limit - Max number of records
 * @returns {Promise<Array>} Array of trades
 */
async function dbGetNPCTraderHistory(traderId, limit = 50) {
    try {
        const trades = await getByIndex(STORES.NPC_TRADER_HISTORY, 'traderId', traderId);
        // Sort by timestamp descending (newest first)
        trades.sort((a, b) => b.timestamp - a.timestamp);
        return trades.slice(0, limit);
    } catch (error) {
        console.error('Error in dbGetNPCTraderHistory:', error);
        return [];
    }
}

/**
 * Get trade history for an element
 * @param {string} element - Element name
 * @param {number} limit - Max number of records
 * @returns {Promise<Array>} Array of trades
 */
async function dbGetNPCElementHistory(element, limit = 50) {
    try {
        const trades = await getByIndex(STORES.NPC_TRADER_HISTORY, 'element', element);
        // Sort by timestamp descending (newest first)
        trades.sort((a, b) => b.timestamp - a.timestamp);
        return trades.slice(0, limit);
    } catch (error) {
        console.error('Error in dbGetNPCElementHistory:', error);
        return [];
    }
}

/**
 * Get NPC trades within a time range
 * @param {number} startTime - Start timestamp
 * @param {number} endTime - End timestamp
 * @returns {Promise<Array>} Array of trades
 */
async function dbGetNPCTradesByTimeRange(startTime, endTime) {
    try {
        const allTrades = await getAll(STORES.NPC_TRADER_HISTORY);
        return allTrades.filter(t => t.timestamp >= startTime && t.timestamp <= endTime);
    } catch (error) {
        console.error('Error in dbGetNPCTradesByTimeRange:', error);
        return [];
    }
}

/**
 * Get NPC trading volume for an element in a time range
 * @param {string} element - Element name
 * @param {number} startTime - Start timestamp
 * @param {number} endTime - End timestamp
 * @returns {Promise<Object>} Volume stats
 */
async function dbGetNPCElementVolume(element, startTime, endTime) {
    try {
        const trades = await dbGetNPCElementHistory(element);
        const timeRangeTrades = trades.filter(t => t.timestamp >= startTime && t.timestamp <= endTime);
        
        let buyVolume = 0;
        let sellVolume = 0;
        let totalValue = 0;
        
        timeRangeTrades.forEach(t => {
            const value = t.price * t.quantity;
            totalValue += value;
            
            if (t.side === 'buy') {
                buyVolume += t.quantity;
            } else {
                sellVolume += t.quantity;
            }
        });
        
        return {
            element,
            buyVolume,
            sellVolume,
            totalVolume: buyVolume + sellVolume,
            totalValue,
            tradeCount: timeRangeTrades.length,
            startTime,
            endTime
        };
    } catch (error) {
        console.error('Error in dbGetNPCElementVolume:', error);
        return {
            element,
            buyVolume: 0,
            sellVolume: 0,
            totalVolume: 0,
            totalValue: 0,
            tradeCount: 0,
            startTime,
            endTime
        };
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

/**
 * Reset only NPC trader data
 * @returns {Promise<Object>} Result
 */
async function resetNPCData() {
    try {
        await clearStore(STORES.NPC_TRADERS);
        await clearStore(STORES.NPC_TRADER_ORDERS);
        await clearStore(STORES.NPC_TRADER_HISTORY);
        
        console.log('NPC trader data reset successfully');
        return { success: true };
        
    } catch (error) {
        console.error('Error resetting NPC data:', error);
        return { success: false, error: error.message };
    }
}

// ===== ES6 EXPORTS (for module imports) =====
export {
    initDB,
    getItem, setItem, deleteItem, getAll, getByIndex, getByIndexRange, clearStore,
    getCollectionAsObject, dbAddElementToCollection, dbRemoveElementFromCollection,
    dbSaveElementLocation, dbGetElementLocations,
    dbSaveAlchemyProgress, dbGetAlchemyProgress, dbGetAllAlchemyProgress,
    dbUnlockRecipe, dbIsRecipeUnlocked,
    getAllProperties, addProperty,
    dbAddToLaborPool, dbGetLaborPoolTotal, dbAddLaborEarnings, dbGetLaborEarnings,
    dbUpdateCertificateHolder, dbGetCertificateHolders, dbGetPlayerCertificates, dbGetCertificateHolder,
    // NPC Trader Functions
    dbSaveNPCTrader, dbGetNPCTrader, dbGetAllNPCTraders,
    dbGetNPCTradersByType, dbGetNPCTradersByPersonality,
    dbGetActiveNPCTraders, dbGetNPCTradersByLastActivity, dbDeleteNPCTrader,
    // NPC Order Functions
    dbSaveNPCOrder, dbGetNPCOrder, dbGetAllNPCOrders,
    dbGetNPCOrdersByTrader, dbGetNPCOrdersByElement, dbGetNPCOrdersBySide,
    dbGetNPCOrdersByStatus, dbGetActiveNPCOrders, dbGetNPCOrdersByPriceRange,
    dbDeleteNPCOrder,
    // NPC History Functions
    dbRecordNPCTrade, dbGetNPCTraderHistory, dbGetNPCElementHistory,
    dbGetNPCTradesByTimeRange, dbGetNPCElementVolume,
    resetNPCData
};

// ===== WINDOW EXPORTS (for global access) =====

// Core functions
window.initDB = initDB;
window.getItem = getItem;
window.setItem = setItem;
window.deleteItem = deleteItem;
window.getAll = getAll;
window.getByIndex = getByIndex;
window.getByIndexRange = getByIndexRange;
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

// Certificate holder functions
window.dbUpdateCertificateHolder = dbUpdateCertificateHolder;
window.dbGetCertificateHolders = dbGetCertificateHolders;
window.dbGetPlayerCertificates = dbGetPlayerCertificates;
window.dbGetCertificateHolder = dbGetCertificateHolder;

// ===== NPC TRADER FUNCTIONS (NEW) =====
window.dbSaveNPCTrader = dbSaveNPCTrader;
window.dbGetNPCTrader = dbGetNPCTrader;
window.dbGetAllNPCTraders = dbGetAllNPCTraders;
window.dbGetNPCTradersByType = dbGetNPCTradersByType;
window.dbGetNPCTradersByPersonality = dbGetNPCTradersByPersonality;
window.dbGetActiveNPCTraders = dbGetActiveNPCTraders;
window.dbGetNPCTradersByLastActivity = dbGetNPCTradersByLastActivity;
window.dbDeleteNPCTrader = dbDeleteNPCTrader;

// NPC Order functions
window.dbSaveNPCOrder = dbSaveNPCOrder;
window.dbGetNPCOrder = dbGetNPCOrder;
window.dbGetAllNPCOrders = dbGetAllNPCOrders;
window.dbGetNPCOrdersByTrader = dbGetNPCOrdersByTrader;
window.dbGetNPCOrdersByElement = dbGetNPCOrdersByElement;
window.dbGetNPCOrdersBySide = dbGetNPCOrdersBySide;
window.dbGetNPCOrdersByStatus = dbGetNPCOrdersByStatus;
window.dbGetActiveNPCOrders = dbGetActiveNPCOrders;
window.dbGetNPCOrdersByPriceRange = dbGetNPCOrdersByPriceRange;
window.dbDeleteNPCOrder = dbDeleteNPCOrder;

// NPC History functions
window.dbRecordNPCTrade = dbRecordNPCTrade;
window.dbGetNPCTraderHistory = dbGetNPCTraderHistory;
window.dbGetNPCElementHistory = dbGetNPCElementHistory;
window.dbGetNPCTradesByTimeRange = dbGetNPCTradesByTimeRange;
window.dbGetNPCElementVolume = dbGetNPCElementVolume;
window.resetNPCData = resetNPCData;

// Export STORES for use in other modules
window.DB_STORES = STORES;

console.log('✅ db.js initialized - Version 5 with NPC trader stores');

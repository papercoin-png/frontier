// js/db.js - IndexedDB service for Voidfarer (Non-module version)
// Using idb library for simpler Promise-based API with proper error handling

const DB_NAME = 'VoidfarerDB';
const DB_VERSION = 3; // Increment version to add planet status store

let dbPromise = null;

// Initialize the database connection
function getDb() {
  if (!dbPromise) {
    dbPromise = idb.openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        console.log(`Upgrading database from v${oldVersion} to v${newVersion}`);
        
        // ===== PLAYER STORES =====
        if (!db.objectStoreNames.contains('player')) {
          const store = db.createObjectStore('player', { keyPath: 'id' });
          store.createIndex('by-name', 'name');
        }
        
        // ===== COLLECTION STORES =====
        if (!db.objectStoreNames.contains('collection')) {
          const store = db.createObjectStore('collection', { keyPath: 'name' });
          store.createIndex('by-rarity', 'rarity');
          store.createIndex('by-count', 'count');
          store.createIndex('by-firstFound', 'firstFound');
        }
        
        // ===== MISSION STORES =====
        if (!db.objectStoreNames.contains('missions')) {
          const store = db.createObjectStore('missions', { keyPath: 'id' });
          store.createIndex('by-element', 'element');
          store.createIndex('by-planet', 'planet');
          store.createIndex('by-completed', 'completed');
          store.createIndex('by-dateAssigned', 'dateAssigned');
        }
        
        if (!db.objectStoreNames.contains('completedMissions')) {
          const store = db.createObjectStore('completedMissions', { keyPath: 'id' });
          store.createIndex('by-element', 'element');
          store.createIndex('by-planet', 'planet');
          store.createIndex('by-dateCompleted', 'dateCompleted');
        }
        
        // ===== REAL ESTATE STORES =====
        if (!db.objectStoreNames.contains('properties')) {
          const store = db.createObjectStore('properties', { keyPath: 'id' });
          store.createIndex('by-type', 'type');
          store.createIndex('by-purchaseDate', 'purchaseDate');
          store.createIndex('by-name', 'name');
        }
        
        if (!db.objectStoreNames.contains('propertyItems')) {
          const store = db.createObjectStore('propertyItems', { keyPath: 'id' });
          store.createIndex('by-propertyId', 'propertyId');
          store.createIndex('by-elementName', 'elementName');
        }
        
        // ===== ECONOMIC STORES =====
        if (!db.objectStoreNames.contains('taxTransactions')) {
          const store = db.createObjectStore('taxTransactions', { keyPath: 'id' });
          store.createIndex('by-playerId', 'playerId');
          store.createIndex('by-taxType', 'taxType');
          store.createIndex('by-timestamp', 'timestamp');
          store.createIndex('by-date', 'date');
          store.createIndex('by-year', 'year');
          store.createIndex('by-month', 'month');
        }
        
        if (!db.objectStoreNames.contains('dailyMetrics')) {
          const store = db.createObjectStore('dailyMetrics', { keyPath: 'date' });
          store.createIndex('by-timestamp', 'timestamp');
        }
        
        if (!db.objectStoreNames.contains('hourlySnapshots')) {
          const store = db.createObjectStore('hourlySnapshots', { keyPath: 'timestamp' });
          store.createIndex('by-hour', 'hour');
        }
        
        if (!db.objectStoreNames.contains('taxRates')) {
          db.createObjectStore('taxRates', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('communityFund')) {
          db.createObjectStore('communityFund', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('activeEvents')) {
          const store = db.createObjectStore('activeEvents', { keyPath: 'id' });
          store.createIndex('by-type', 'type');
          store.createIndex('by-severity', 'severity');
          store.createIndex('by-endTime', 'endTime');
        }
        
        if (!db.objectStoreNames.contains('eventHistory')) {
          const store = db.createObjectStore('eventHistory', { keyPath: 'historyId' });
          store.createIndex('by-type', 'type');
          store.createIndex('by-recordedAt', 'recordedAt');
        }
        
        // ===== COLONY STORES =====
        if (!db.objectStoreNames.contains('colonies')) {
          const store = db.createObjectStore('colonies', { keyPath: 'id' });
          store.createIndex('by-planet', 'planet');
          store.createIndex('by-star', 'star');
          store.createIndex('by-sector', 'sector');
          store.createIndex('by-established', 'established');
        }
        
        // ===== DISCOVERY STORES =====
        if (!db.objectStoreNames.contains('discoveredLocations')) {
          const store = db.createObjectStore('discoveredLocations', { keyPath: 'id' });
          store.createIndex('by-sector', 'sector');
          store.createIndex('by-starSector', 'starSector');
          store.createIndex('by-star', 'star');
          store.createIndex('by-planet', 'planet');
        }
        
        if (!db.objectStoreNames.contains('scanHistory')) {
          const store = db.createObjectStore('scanHistory', { keyPath: 'timestamp' });
          store.createIndex('by-location', 'location');
        }
        
        if (!db.objectStoreNames.contains('bookmarks')) {
          const store = db.createObjectStore('bookmarks', { keyPath: 'id' });
          store.createIndex('by-type', 'type');
        }
        
        // ===== SHIP STORES =====
        if (!db.objectStoreNames.contains('shipUpgrades')) {
          db.createObjectStore('shipUpgrades', { keyPath: 'id' });
        }
        
        // ===== SETTINGS STORES =====
        if (!db.objectStoreNames.contains('settings')) {
          const store = db.createObjectStore('settings', { keyPath: 'key' });
        }
        
        // ===== PRICE HISTORY STORE (for market dynamics) =====
        if (!db.objectStoreNames.contains('priceHistory')) {
          const store = db.createObjectStore('priceHistory', { keyPath: 'id' });
          store.createIndex('by-element', 'elementName');
          store.createIndex('by-date', 'date');
          store.createIndex('by-timestamp', 'timestamp');
        }
        
        // ===== TRADE HISTORY STORE =====
        if (!db.objectStoreNames.contains('tradeHistory')) {
          const store = db.createObjectStore('tradeHistory', { keyPath: 'id' });
          store.createIndex('by-element', 'elementName');
          store.createIndex('by-date', 'date');
          store.createIndex('by-timestamp', 'timestamp');
        }
        
        // ===== ELEMENT LOCATIONS STORE (for journal) =====
        // Enhanced: stores planet name, rarity, quantity, and timestamp
        if (!db.objectStoreNames.contains('elementLocations')) {
          const store = db.createObjectStore('elementLocations', { keyPath: 'id' });
          store.createIndex('by-element', 'elementName');
          store.createIndex('by-planet', 'planet');
          store.createIndex('by-player', 'playerId');
          store.createIndex('by-date', 'discoveredAt');
          store.createIndex('by-rarity', 'elementRarity');
          console.log('✅ Created elementLocations store with enhanced indices');
        }
        
        // ===== PLANET STATUS STORE (for exploration tracking) =====
        // NEW: Tracks planet exploration status, highest rarity found, and claim status
        if (!db.objectStoreNames.contains('planetStatus')) {
          const store = db.createObjectStore('planetStatus', { keyPath: 'planetName' });
          store.createIndex('by-explored', 'explored');
          store.createIndex('by-highestRarity', 'highestRarity');
          store.createIndex('by-fullyExplored', 'fullyExplored');
          store.createIndex('by-claimed', 'claimed');
          store.createIndex('by-sector', 'sector');
          store.createIndex('by-star', 'star');
          console.log('✅ Created planetStatus store for exploration tracking');
        }
        
        // ===== MIGRATION FLAG =====
        if (!db.objectStoreNames.contains('migration')) {
          db.createObjectStore('migration', { keyPath: 'id' });
        }
        
        console.log('Database schema created/upgraded successfully');
      },
    });
  }
  return dbPromise;
}

// ===== GENERIC CRUD HELPERS =====

// Get a single item by key
async function getItem(storeName, key) {
  try {
    const db = await getDb();
    return await db.get(storeName, key);
  } catch (error) {
    console.error(`Error getting item from ${storeName}:`, error);
    return null;
  }
}

// Get all items from a store
async function getAll(storeName) {
  try {
    const db = await getDb();
    return await db.getAll(storeName);
  } catch (error) {
    console.error(`Error getting all from ${storeName}:`, error);
    return [];
  }
}

// Get all items with an index (for filtered queries)
async function getAllFromIndex(storeName, indexName, key) {
  try {
    const db = await getDb();
    return await db.getAllFromIndex(storeName, indexName, key);
  } catch (error) {
    console.error(`Error getting from index ${indexName}:`, error);
    return [];
  }
}

// Get a single item with an index
async function getFromIndex(storeName, indexName, key) {
  try {
    const db = await getDb();
    return await db.getFromIndex(storeName, indexName, key);
  } catch (error) {
    console.error(`Error getting from index ${indexName}:`, error);
    return null;
  }
}

// Put an item (insert or update)
async function setItem(storeName, value) {
  try {
    const db = await getDb();
    return await db.put(storeName, value);
  } catch (error) {
    console.error(`Error setting item in ${storeName}:`, error);
    throw error;
  }
}

// Put multiple items in a transaction
async function setItems(storeName, values) {
  try {
    const db = await getDb();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    for (const value of values) {
      await store.put(value);
    }
    
    await tx.done;
    return true;
  } catch (error) {
    console.error(`Error setting multiple items in ${storeName}:`, error);
    return false;
  }
}

// Delete an item by key
async function deleteItem(storeName, key) {
  try {
    const db = await getDb();
    return await db.delete(storeName, key);
  } catch (error) {
    console.error(`Error deleting item from ${storeName}:`, error);
    return false;
  }
}

// Clear an entire store
async function clearStore(storeName) {
  try {
    const db = await getDb();
    return await db.clear(storeName);
  } catch (error) {
    console.error(`Error clearing store ${storeName}:`, error);
    return false;
  }
}

// Count items in a store
async function countItems(storeName) {
  try {
    const db = await getDb();
    return await db.count(storeName);
  } catch (error) {
    console.error(`Error counting items in ${storeName}:`, error);
    return 0;
  }
}

// ===== SPECIALIZED COLLECTION HELPERS =====

// Get collection as object (matches your existing format)
async function getCollectionAsObject() {
  try {
    const elements = await getAll('collection');
    const collection = {};
    
    elements.forEach(element => {
      collection[element.name] = {
        count: element.count || 1,
        firstFound: element.firstFound || new Date().toISOString()
      };
    });
    
    return collection;
    
  } catch (error) {
    console.error('Error in getCollectionAsObject:', error);
    return {};
  }
}

// Add element to collection - RETURNS ACTUAL NEW COUNT
async function addElementToCollection(elementName, count = 1, elementData = {}) {
  let tx;
  try {
    const db = await getDb();
    tx = db.transaction('collection', 'readwrite');
    const store = tx.objectStore('collection');
    
    let element = await store.get(elementName);
    
    if (!element) {
      element = {
        name: elementName,
        count: count,
        firstFound: new Date().toISOString(),
        rarity: elementData.rarity || 'common',
        value: elementData.value || 100
      };
    } else {
      element.count = (element.count || 1) + count;
    }
    
    await store.put(element);
    await tx.done;
    
    // Return the actual new count
    return { success: true, count: element.count };
    
  } catch (error) {
    console.error('Error in addElementToCollection:', error);
    if (tx) await tx.abort();
    return { success: false, error: error.message };
  }
}

// Remove element from collection
async function removeElementFromCollection(elementName, count = 1) {
  let tx;
  try {
    const db = await getDb();
    tx = db.transaction('collection', 'readwrite');
    const store = tx.objectStore('collection');
    
    const element = await store.get(elementName);
    if (!element) {
      await tx.done;
      return { success: false, reason: 'not_found' };
    }
    
    if (element.count < count) {
      await tx.done;
      return { success: false, reason: 'insufficient', available: element.count };
    }
    
    element.count -= count;
    
    if (element.count <= 0) {
      await store.delete(elementName);
      await tx.done;
      return { success: true, newCount: 0 };
    } else {
      await store.put(element);
      await tx.done;
      return { success: true, newCount: element.count };
    }
    
  } catch (error) {
    console.error('Error in removeElementFromCollection:', error);
    if (tx) await tx.abort();
    return { success: false, error: error.message };
  }
}

// ===== TAX TRANSACTION HELPERS =====

// Add a tax transaction
async function addTaxTransaction(transaction) {
  try {
    const db = await getDb();
    
    const newTx = {
      id: transaction.id || 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      playerId: transaction.playerId,
      playerName: transaction.playerName,
      taxType: transaction.taxType,
      amount: transaction.amount,
      baseAmount: transaction.baseAmount,
      rate: transaction.rate,
      description: transaction.description,
      status: transaction.status || 'completed',
      reference: transaction.reference || null,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      quarter: Math.floor(new Date().getMonth() / 3) + 1
    };
    
    await setItem('taxTransactions', newTx);
    return newTx;
    
  } catch (error) {
    console.error('Error in addTaxTransaction:', error);
    return null;
  }
}

// Get transactions for a player
async function getPlayerTransactions(playerId, limit = 100) {
  try {
    const transactions = await getAllFromIndex('taxTransactions', 'by-playerId', playerId);
    return transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  } catch (error) {
    console.error('Error in getPlayerTransactions:', error);
    return [];
  }
}

// ===== PROPERTY HELPERS =====

// Get all properties
async function getAllProperties() {
  return await getAll('properties');
}

// Get property by ID
async function getProperty(propertyId) {
  return await getItem('properties', propertyId);
}

// Add a property
async function addProperty(propertyData) {
  try {
    const newProperty = {
      id: 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: propertyData.name,
      type: propertyData.type,
      capacity: propertyData.capacity,
      used: 0,
      purchaseDate: new Date().toISOString(),
      cost: propertyData.cost
    };
    
    await setItem('properties', newProperty);
    return newProperty;
    
  } catch (error) {
    console.error('Error in addProperty:', error);
    return null;
  }
}

// Update property
async function updateProperty(propertyId, updates) {
  try {
    const property = await getProperty(propertyId);
    if (!property) return null;
    
    const updatedProperty = { ...property, ...updates };
    await setItem('properties', updatedProperty);
    return updatedProperty;
    
  } catch (error) {
    console.error('Error in updateProperty:', error);
    return null;
  }
}

// Get items for a property
async function getPropertyItems(propertyId) {
  return await getAllFromIndex('propertyItems', 'by-propertyId', propertyId);
}

// Add item to property
async function addItemToProperty(propertyId, elementName, quantity) {
  let tx;
  try {
    const db = await getDb();
    tx = db.transaction(['properties', 'propertyItems'], 'readwrite');
    
    const propertyStore = tx.objectStore('properties');
    const itemsStore = tx.objectStore('propertyItems');
    
    const property = await propertyStore.get(propertyId);
    if (!property) {
      await tx.done;
      return { success: false, reason: 'property_not_found' };
    }
    
    const currentItems = await itemsStore.index('by-propertyId').getAll(propertyId);
    const currentUsed = currentItems.reduce((sum, item) => sum + (item.count || 0), 0);
    
    if (currentUsed + quantity > property.capacity) {
      await tx.done;
      return { success: false, reason: 'insufficient_space' };
    }
    
    const existingItems = currentItems.filter(item => item.elementName === elementName);
    
    if (existingItems.length > 0) {
      const item = existingItems[0];
      item.count += quantity;
      await itemsStore.put(item);
    } else {
      const newItem = {
        id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        propertyId: propertyId,
        elementName: elementName,
        count: quantity
      };
      await itemsStore.put(newItem);
    }
    
    property.used = currentUsed + quantity;
    await propertyStore.put(property);
    
    await tx.done;
    return { success: true };
    
  } catch (error) {
    console.error('Error in addItemToProperty:', error);
    if (tx) await tx.abort();
    return { success: false, error: error.message };
  }
}

// Remove item from property
async function removeItemFromProperty(propertyId, elementName, quantity) {
  let tx;
  try {
    const db = await getDb();
    tx = db.transaction(['properties', 'propertyItems'], 'readwrite');
    
    const propertyStore = tx.objectStore('properties');
    const itemsStore = tx.objectStore('propertyItems');
    
    const property = await propertyStore.get(propertyId);
    if (!property) {
      await tx.done;
      return { success: false, reason: 'property_not_found' };
    }
    
    const items = await itemsStore.index('by-propertyId').getAll(propertyId);
    const item = items.find(i => i.elementName === elementName);
    
    if (!item) {
      await tx.done;
      return { success: false, reason: 'item_not_found' };
    }
    
    if (item.count < quantity) {
      await tx.done;
      return { success: false, reason: 'insufficient', available: item.count };
    }
    
    item.count -= quantity;
    if (item.count <= 0) {
      await itemsStore.delete(item.id);
    } else {
      await itemsStore.put(item);
    }
    
    const remainingItems = await itemsStore.index('by-propertyId').getAll(propertyId);
    property.used = remainingItems.reduce((sum, i) => sum + (i.count || 0), 0);
    await propertyStore.put(property);
    
    await tx.done;
    return { success: true, newCount: item.count || 0 };
    
  } catch (error) {
    console.error('Error in removeItemFromProperty:', error);
    if (tx) await tx.abort();
    return { success: false, error: error.message };
  }
}

// ===== PRICE HISTORY HELPERS =====
async function addPriceHistory(elementName, price, date) {
  try {
    const entry = {
      id: `price_${elementName}_${date}`,
      elementName: elementName,
      date: date,
      price: price,
      timestamp: Date.now()
    };
    
    await setItem('priceHistory', entry);
    return entry;
  } catch (error) {
    console.error('Error adding price history:', error);
    return null;
  }
}

async function getPriceHistoryForElement(elementName) {
  try {
    const db = await getDb();
    const entries = await db.getAllFromIndex('priceHistory', 'by-element', elementName);
    return entries.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error getting price history:', error);
    return [];
  }
}

// ===== TRADE HISTORY HELPERS =====
async function addTradeHistory(trade) {
  try {
    await setItem('tradeHistory', trade);
    return trade;
  } catch (error) {
    console.error('Error adding trade history:', error);
    return null;
  }
}

async function getTradeHistoryForElement(elementName) {
  try {
    const db = await getDb();
    const entries = await db.getAllFromIndex('tradeHistory', 'by-element', elementName);
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error getting trade history:', error);
    return [];
  }
}

// ===== MIGRATION HELPERS =====

// Check if migration has been performed
async function isMigrationComplete() {
  try {
    const flag = await getItem('migration', 'localStorage');
    return flag ? flag.complete : false;
  } catch (error) {
    console.error('Error in isMigrationComplete:', error);
    return false;
  }
}

// Mark migration as complete
async function setMigrationComplete() {
  try {
    await setItem('migration', {
      id: 'localStorage',
      complete: true,
      timestamp: Date.now(),
      date: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error in setMigrationComplete:', error);
    return false;
  }
}

// ===== UTILITY FUNCTIONS =====

// Clear all game data (for reset)
async function resetAllData() {
  try {
    const stores = [
      'player', 'collection', 'missions', 'completedMissions',
      'properties', 'propertyItems', 'taxTransactions', 'dailyMetrics',
      'hourlySnapshots', 'taxRates', 'communityFund', 'activeEvents',
      'eventHistory', 'colonies', 'discoveredLocations', 'scanHistory',
      'bookmarks', 'shipUpgrades', 'settings', 'priceHistory', 'tradeHistory',
      'elementLocations', 'planetStatus'
    ];
    
    const db = await getDb();
    const tx = db.transaction(stores, 'readwrite');
    
    for (const store of stores) {
      if (db.objectStoreNames.contains(store)) {
        await tx.objectStore(store).clear();
      }
    }
    
    await tx.done;
    
    await deleteItem('migration', 'localStorage');
    
    return true;
  } catch (error) {
    console.error('Error in resetAllData:', error);
    return false;
  }
}

// Get database stats (for debugging)
async function getDatabaseStats() {
  try {
    const stores = [
      'player', 'collection', 'missions', 'completedMissions',
      'properties', 'propertyItems', 'taxTransactions', 'dailyMetrics',
      'activeEvents', 'colonies', 'priceHistory', 'tradeHistory',
      'elementLocations', 'planetStatus'
    ];
    
    const stats = {};
    const db = await getDb();
    
    for (const store of stores) {
      if (db.objectStoreNames.contains(store)) {
        const count = await db.count(store);
        stats[store] = count;
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Error in getDatabaseStats:', error);
    return {};
  }
}

// ===== INITIALIZATION =====
async function initializeDatabase() {
  try {
    await getDb();
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}

// Helper function to get element rarity (simplified version)
function getElementRarity(elementName) {
  const rareElements = [
    'Gold', 'Silver', 'Platinum', 'Titanium', 'Copper', 'Zinc', 'Tin', 'Cobalt',
    'Chromium', 'Nickel', 'Lead', 'Mercury', 'Uranium', 'Thorium', 'Plutonium',
    'Radium', 'Polonium', 'Promethium', 'Technetium', 'Astatine', 'Francium'
  ];
  
  if (rareElements.includes(elementName)) {
    if (['Promethium', 'Technetium', 'Astatine', 'Francium'].includes(elementName)) {
      return 'legendary';
    }
    if (['Uranium', 'Thorium', 'Plutonium', 'Radium', 'Polonium'].includes(elementName)) {
      return 'very-rare';
    }
    return 'rare';
  }
  
  const uncommonElements = ['Carbon', 'Oxygen', 'Nitrogen', 'Iron', 'Aluminum', 'Silicon'];
  if (uncommonElements.includes(elementName)) {
    return 'uncommon';
  }
  
  return 'common';
}

// Helper function to get element value
function getElementValue(elementName) {
  const values = {
    'Gold': 1000, 'Silver': 1000, 'Platinum': 1000, 'Uranium': 5000,
    'Promethium': 25000, 'Carbon': 250, 'Iron': 250, 'Oxygen': 250
  };
  return values[elementName] || 100;
}

// ===== ELEMENT LOCATIONS HELPERS (ENHANCED) =====
// Save where an element was found - stores planet name, rarity, quantity, and timestamp
async function saveElementLocation(elementName, planetName, locationData = {}) {
  try {
    const db = await getDb();
    
    // Get player ID from localStorage
    let playerId = localStorage.getItem('voidfarer_player_id');
    if (!playerId) {
      playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      localStorage.setItem('voidfarer_player_id', playerId);
    }
    
    // Get element rarity and value
    const rarity = locationData.rarity || getElementRarity(elementName);
    const value = locationData.value || getElementValue(elementName);
    
    // Use provided planet name or try to get from locationData, with fallback
    const finalPlanet = planetName || locationData.planet || 'Unknown';
    const quantity = locationData.quantity || 1;
    const planetType = locationData.planetType || 'unknown';
    
    const locationId = `loc_${elementName}_${finalPlanet}_${Date.now()}`;
    
    const locationRecord = {
      id: locationId,
      elementName: elementName,
      elementRarity: rarity,
      elementValue: value,
      planet: finalPlanet,
      planetType: planetType,
      playerId: playerId,
      quantity: quantity,
      discoveredAt: Date.now(),
      discoveredDate: new Date().toISOString()
    };
    
    await setItem('elementLocations', locationRecord);
    console.log(`📍 Saved location: ${elementName} (${rarity}) on ${finalPlanet} (x${quantity})`);
    
    // After saving location, update planet status
    await updatePlanetStatusFromLocations(finalPlanet);
    
    return true;
  } catch (error) {
    console.error('Error saving element location:', error);
    return false;
  }
}

// Get all locations for a specific element
async function getElementLocations(elementName) {
  try {
    const allLocations = await getAll('elementLocations') || [];
    return allLocations
      .filter(loc => loc.elementName === elementName)
      .sort((a, b) => b.discoveredAt - a.discoveredAt);
  } catch (error) {
    console.error('Error getting element locations:', error);
    return [];
  }
}

// Get all locations a player has discovered
async function getPlayerLocations() {
  try {
    const playerId = localStorage.getItem('voidfarer_player_id');
    if (!playerId) return [];
    
    const allLocations = await getAll('elementLocations') || [];
    return allLocations
      .filter(loc => loc.playerId === playerId)
      .sort((a, b) => b.discoveredAt - a.discoveredAt);
  } catch (error) {
    console.error('Error getting player locations:', error);
    return [];
  }
}

// Get unique planets where an element was found
async function getUniquePlanetsForElement(elementName) {
  try {
    const locations = await getElementLocations(elementName);
    const uniquePlanets = [...new Set(locations.map(loc => loc.planet))];
    return uniquePlanets;
  } catch (error) {
    console.error('Error getting unique planets:', error);
    return [];
  }
}

// Get location statistics for an element
async function getElementLocationStats(elementName) {
  try {
    const locations = await getElementLocations(elementName);
    const stats = {
      totalFinds: locations.length,
      totalQuantity: locations.reduce((sum, loc) => sum + (loc.quantity || 1), 0),
      firstDiscovery: locations.length > 0 ? locations[locations.length - 1].discoveredDate : null,
      lastDiscovery: locations.length > 0 ? locations[0].discoveredDate : null,
      planets: {}
    };
    
    locations.forEach(loc => {
      if (!stats.planets[loc.planet]) {
        stats.planets[loc.planet] = {
          count: 0,
          quantity: 0,
          lastFound: loc.discoveredDate
        };
      }
      stats.planets[loc.planet].count++;
      stats.planets[loc.planet].quantity += loc.quantity || 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting element location stats:', error);
    return null;
  }
}

// ===== PLANET STATUS HELPERS (NEW) =====
// Save planet status
async function savePlanetStatus(planetName, statusData) {
  try {
    const statusRecord = {
      planetName: planetName,
      explored: statusData.explored || false,
      highestRarity: statusData.highestRarity || null,
      resourcesFound: statusData.resourcesFound || [],
      resourceCount: statusData.resourceCount || 0,
      fullyExplored: statusData.fullyExplored || false,
      claimed: statusData.claimed || false,
      sector: statusData.sector || null,
      star: statusData.star || null,
      lastUpdated: Date.now(),
      lastUpdatedDate: new Date().toISOString()
    };
    
    await setItem('planetStatus', statusRecord);
    console.log(`🪐 Saved planet status: ${planetName} - ${statusData.highestRarity || 'unexplored'}`);
    return true;
  } catch (error) {
    console.error('Error saving planet status:', error);
    return false;
  }
}

// Get planet status
async function getPlanetStatus(planetName) {
  try {
    const status = await getItem('planetStatus', planetName);
    return status || null;
  } catch (error) {
    console.error('Error getting planet status:', error);
    return null;
  }
}

// Update planet status based on location data
async function updatePlanetStatusFromLocations(planetName) {
  try {
    // Get all locations for this planet
    const allLocations = await getAll('elementLocations') || [];
    const playerId = localStorage.getItem('voidfarer_player_id');
    
    const planetLocations = allLocations.filter(loc => 
      loc.planet === planetName && loc.playerId === playerId
    );
    
    if (planetLocations.length === 0) {
      // No locations found, planet is unexplored
      await savePlanetStatus(planetName, {
        explored: false,
        highestRarity: null,
        resourcesFound: [],
        resourceCount: 0,
        fullyExplored: false,
        claimed: false
      });
      return;
    }
    
    // Get unique resources and rarities
    const resourcesFound = [];
    const raritiesFound = [];
    
    planetLocations.forEach(loc => {
      if (!resourcesFound.includes(loc.elementName)) {
        resourcesFound.push(loc.elementName);
      }
      if (!raritiesFound.includes(loc.elementRarity)) {
        raritiesFound.push(loc.elementRarity);
      }
    });
    
    // Determine highest rarity
    const rarityOrder = ['common', 'uncommon', 'rare', 'very-rare', 'legendary'];
    let highestRarity = 'common';
    let highestIndex = 0;
    
    raritiesFound.forEach(rarity => {
      const index = rarityOrder.indexOf(rarity);
      if (index > highestIndex) {
        highestIndex = index;
        highestRarity = rarity;
      }
    });
    
    // Check if fully explored (has 4 unique resources)
    const fullyExplored = resourcesFound.length >= 4;
    
    // Get claim status
    const currentStatus = await getPlanetStatus(planetName);
    const claimed = currentStatus ? currentStatus.claimed : false;
    
    // Save updated status
    await savePlanetStatus(planetName, {
      explored: true,
      highestRarity: highestRarity,
      resourcesFound: resourcesFound,
      resourceCount: resourcesFound.length,
      fullyExplored: fullyExplored,
      claimed: claimed
    });
    
    return {
      explored: true,
      highestRarity,
      resourcesFound,
      resourceCount: resourcesFound.length,
      fullyExplored,
      claimed
    };
    
  } catch (error) {
    console.error(`Error updating planet status for ${planetName}:`, error);
    return null;
  }
}

// Claim a planet
async function claimPlanet(planetName) {
  try {
    const status = await getPlanetStatus(planetName);
    
    if (!status) {
      console.error(`Cannot claim planet ${planetName}: not found`);
      return false;
    }
    
    if (!status.fullyExplored) {
      console.error(`Cannot claim planet ${planetName}: not fully explored`);
      return false;
    }
    
    status.claimed = true;
    status.lastUpdated = Date.now();
    status.lastUpdatedDate = new Date().toISOString();
    
    await setItem('planetStatus', status);
    console.log(`🏆 Planet ${planetName} claimed!`);
    
    return true;
    
  } catch (error) {
    console.error(`Error claiming planet ${planetName}:`, error);
    return false;
  }
}

// Get all claimed planets
async function getClaimedPlanets() {
  try {
    const allStatuses = await getAll('planetStatus') || [];
    return allStatuses.filter(status => status.claimed === true);
  } catch (error) {
    console.error('Error getting claimed planets:', error);
    return [];
  }
}

// Get planets by exploration status
async function getPlanetsByExploration(explored = true) {
  try {
    const allStatuses = await getAll('planetStatus') || [];
    return allStatuses.filter(status => status.explored === explored);
  } catch (error) {
    console.error('Error getting planets by exploration:', error);
    return [];
  }
}

// Get planets by rarity
async function getPlanetsByRarity(rarity) {
  try {
    const allStatuses = await getAll('planetStatus') || [];
    return allStatuses.filter(status => status.highestRarity === rarity);
  } catch (error) {
    console.error('Error getting planets by rarity:', error);
    return [];
  }
}

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE FOR HTML =====
window.idb = idb;
window.getDb = getDb;
window.getItem = getItem;
window.getAll = getAll;
window.getAllFromIndex = getAllFromIndex;
window.getFromIndex = getFromIndex;
window.setItem = setItem;
window.setItems = setItems;
window.deleteItem = deleteItem;
window.clearStore = clearStore;
window.countItems = countItems;
window.getCollectionAsObject = getCollectionAsObject;
window.addElementToCollection = addElementToCollection;
window.removeElementFromCollection = removeElementFromCollection;
window.addTaxTransaction = addTaxTransaction;
window.getPlayerTransactions = getPlayerTransactions;
window.getAllProperties = getAllProperties;
window.getProperty = getProperty;
window.addProperty = addProperty;
window.updateProperty = updateProperty;
window.getPropertyItems = getPropertyItems;
window.addItemToProperty = addItemToProperty;
window.removeItemFromProperty = removeItemFromProperty;
window.addPriceHistory = addPriceHistory;
window.getPriceHistoryForElement = getPriceHistoryForElement;
window.addTradeHistory = addTradeHistory;
window.getTradeHistoryForElement = getTradeHistoryForElement;
window.isMigrationComplete = isMigrationComplete;
window.setMigrationComplete = setMigrationComplete;
window.resetAllData = resetAllData;
window.getDatabaseStats = getDatabaseStats;
window.initializeDatabase = initializeDatabase;

// Enhanced location helpers
window.saveElementLocation = saveElementLocation;
window.getElementLocations = getElementLocations;
window.getPlayerLocations = getPlayerLocations;
window.getUniquePlanetsForElement = getUniquePlanetsForElement;
window.getElementLocationStats = getElementLocationStats;

// NEW: Planet status helpers
window.savePlanetStatus = savePlanetStatus;
window.getPlanetStatus = getPlanetStatus;
window.updatePlanetStatusFromLocations = updatePlanetStatusFromLocations;
window.claimPlanet = claimPlanet;
window.getClaimedPlanets = getClaimedPlanets;
window.getPlanetsByExploration = getPlanetsByExploration;
window.getPlanetsByRarity = getPlanetsByRarity;

// ===== PREFIXED EXPORTS TO AVOID RECURSION =====
// These are for storage.js to call directly without going through window
window.dbGetCollectionAsObject = getCollectionAsObject;
window.dbAddElementToCollection = addElementToCollection;
window.dbRemoveElementFromCollection = removeElementFromCollection;
window.dbGetElementLocations = getElementLocations;
window.dbSaveElementLocation = saveElementLocation;
window.dbGetAll = getAll;
window.dbSetItem = setItem;

// js/storage.js - Save/load player progress for Voidfarer
// Using IndexedDB via db.js for unlimited storage with mass-based cargo
// UPDATED: Added market data persistence for trading system
// UPDATED: Added certificate holder tracking for labor pool distribution
// UPDATED: Added NPC trader persistence for marketplace NPCs
// UPDATED: Added market data cleanup functions to prevent localStorage quota issues
// UPDATED: Added location saving to IndexedDB when collecting elements
// FIXED: Added recordTrade call to update market dynamics when elements are added
// FIXED: Added dbSaveElementLocation function for journal tracking
// UPDATED: Added Discovery Lock storage keys and functions for 30-day rights expiration
// UPDATED: Added IndexedDB helper functions for certificate and labor pool systems
// FIXED: Database version updated to 4 with all required stores created in upgrade
// CLEANED: Removed old crafting system references (alchemy, metallurgy, etc.)
// ADDED: getElementRarity function for University cargo system
// FIXED: Added getPlayerLocations function for planet-status.js integration
// FIXED: IndexedDB store creation with proper keyPaths to prevent "out-of-line keys" error

// ===== CONSTANTS =====
// CARGO_MASS_LIMIT is now defined in the HTML files to avoid duplicate declaration

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    // Player data
    PLAYER: 'voidfarer_player',
    PLAYER_ID: 'voidfarer_player_id',
    PLAYER_STATS: 'voidfarer_player_stats',
    
    // Collections
    COLLECTION: 'voidfarer_collection',
    
    // Credits
    CREDITS: 'voidfarer_credits',
    
    // Universe data
    UNIVERSE_SEED: 'voidfarer_universe_seed',
    
    // Location data
    CURRENT_SECTOR: 'voidfarer_current_sector',
    CURRENT_REGION: 'voidfarer_current_region',
    CURRENT_STAR_SECTOR: 'voidfarer_current_starSector',
    CURRENT_SECTOR_NAME: 'voidfarer_current_sector_name',
    CURRENT_SECTOR_TYPE: 'voidfarer_current_sector_type',
    CURRENT_SECTOR_STARS: 'voidfarer_current_sector_stars',
    CURRENT_SECTOR_X: 'voidfarer_current_sector_x',
    CURRENT_SECTOR_Y: 'voidfarer_current_sector_y',
    CURRENT_STAR: 'voidfarer_current_star',
    CURRENT_STAR_TYPE: 'voidfarer_current_star_type',
    CURRENT_STAR_INDEX: 'voidfarer_current_star_index',
    CURRENT_STAR_X: 'voidfarer_current_star_x',
    CURRENT_STAR_Y: 'voidfarer_current_star_y',
    CURRENT_STAR_PLANETS: 'voidfarer_current_star_planets',
    CURRENT_PLANET: 'voidfarer_current_planet',
    CURRENT_PLANET_TYPE: 'voidfarer_current_planet_type',
    CURRENT_PLANET_RESOURCES: 'voidfarer_current_planet_resources',
    CURRENT_PLANET_IMAGE: 'voidfarer_current_planet_image',
    CURRENT_PLANET_TIER: 'voidfarer_current_planet_tier',
    
    // Warp data
    WARP_DESTINATION: 'voidfarer_warp_destination',
    WARP_RETURN: 'voidfarer_warp_return',
    WARP_CYCLES: 'voidfarer_warp_cycles',
    WARP_DISTANCE: 'voidfarer_warp_distance',
    WARP_FUEL: 'voidfarer_warp_fuel',
    WARP_DESTINATION_PLANET: 'voidfarer_warp_destination_planet',
    WARP_DESTINATION_PLANET_TYPE: 'voidfarer_warp_destination_planet_type',
    WARP_ORIGIN_PLANET: 'voidfarer_warp_origin_planet',
    WARP_ORIGIN_STAR: 'voidfarer_warp_origin_star',
    WARP_ORIGIN_STAR_SECTOR: 'voidfarer_warp_origin_starSector',
    WARP_ORIGIN_REGION: 'voidfarer_warp_origin_region',
    WARP_ORIGIN_SECTOR: 'voidfarer_warp_origin_sector',
    
    // Colonies
    COLONIES: 'voidfarer_colonies',
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
    
    // Achievements
    ACHIEVEMENTS: 'voidfarer_achievements',
    LAST_SAVE: 'voidfarer_last_save',
    
    // Real estate
    REAL_ESTATE: 'voidfarer_real_estate',
    HUB_STORAGE_MAX: 'voidfarer_hub_storage_max',
    HUB_STORAGE_USED: 'voidfarer_hub_storage_used',
    HUB_INVENTORY: 'voidfarer_hub_inventory',
    
    // Economy
    TOTAL_MONEY_SUPPLY: 'voidfarer_total_money_supply',
    DAILY_METRICS: 'voidfarer_daily_metrics',
    HOURLY_SNAPSHOTS: 'voidfarer_hourly_snapshots',
    TAX_RATES: 'voidfarer_tax_rates',
    TAX_HISTORY: 'voidfarer_tax_history',
    COMMUNITY_FUND: 'voidfarer_community_fund',
    ACTIVE_EVENTS: 'voidfarer_active_events',
    EVENT_HISTORY: 'voidfarer_event_history',
    
    // Labor pool
    LABOR_POOL_TOTAL: 'voidfarer_labor_pool_total',
    LABOR_POOL_DISTRIBUTED: 'voidfarer_labor_pool_distributed',
    LABOR_POOL_HISTORY: 'voidfarer_labor_pool_history',
    PLAYER_LABOR_EARNINGS: 'voidfarer_player_labor_earnings',
    
    // Certificate tracking
    CERTIFICATE_HOLDERS: 'voidfarer_certificate_holders',
    
    // Products & marketplace
    PLAYER_PRODUCTS: 'voidfarer_player_products',
    PRODUCT_TRANSACTIONS: 'voidfarer_product_transactions',
    ACTIVE_PRODUCTS: 'voidfarer_active_products',
    MARKET_PRICES: 'voidfarer_market_prices',
    MARKET_HISTORY: 'voidfarer_market_history',
    MARKET_VOLUME: 'voidfarer_market_volume',
    MARKET_ORDERS: 'voidfarer_market_orders',
    
    // Planet claims
    PLANET_CLAIMS: 'voidfarer_planet_claims',
    PLAYER_CLAIMS: 'voidfarer_player_claims',
    CLAIM_HISTORY: 'voidfarer_claim_history',
    CLAIM_NOTIFICATIONS: 'voidfarer_claim_notifications',
    
    // ===== NPC TRADER KEYS =====
    NPC_TRADERS: 'voidfarer_npc_traders',
    NPC_TRADER_ORDERS: 'voidfarer_npc_trader_orders',
    NPC_TRADER_STATS: 'voidfarer_npc_trader_stats',
    LAST_NPC_UPDATE: 'voidfarer_last_npc_update',
    
    // ===== MARKET DATA CLEANUP KEYS =====
    LAST_CLEANUP: 'voidfarer_last_cleanup',
    CLEANUP_INTERVAL_DAYS: 7,
    
    // ===== DISCOVERY LOCK KEYS =====
    DISCOVERY_HISTORY: 'voidfarer_discovery_history',
    HIDDEN_PLANETS: 'voidfarer_hidden_planets',
    SCANNED_SECTORS: 'voidfarer_scanned_sectors',
    SCANNED_STAR_SECTORS: 'voidfarer_scanned_star_sectors',
    SCANNED_STARS: 'voidfarer_scanned_stars'
};

// ===== COMPLETE ELEMENT MASS DATABASE =====
const ELEMENT_MASS = {
    'Hydrogen': 1.008, 'Helium': 4.003, 'Lithium': 6.94, 'Beryllium': 9.012,
    'Boron': 10.81, 'Carbon': 12.011, 'Nitrogen': 14.007, 'Oxygen': 16.00,
    'Fluorine': 19.00, 'Neon': 20.18, 'Sodium': 22.99, 'Magnesium': 24.31,
    'Aluminum': 26.98, 'Silicon': 28.09, 'Phosphorus': 30.97, 'Sulfur': 32.06,
    'Chlorine': 35.45, 'Argon': 39.95, 'Potassium': 39.10, 'Calcium': 40.08,
    'Scandium': 44.96, 'Titanium': 47.87, 'Vanadium': 50.94, 'Chromium': 52.00,
    'Manganese': 54.94, 'Iron': 55.85, 'Cobalt': 58.93, 'Nickel': 58.69,
    'Copper': 63.55, 'Zinc': 65.38, 'Gallium': 69.72, 'Germanium': 72.63,
    'Arsenic': 74.92, 'Selenium': 78.97, 'Bromine': 79.90, 'Krypton': 83.80,
    'Rubidium': 85.47, 'Strontium': 87.62, 'Yttrium': 88.91, 'Zirconium': 91.22,
    'Niobium': 92.91, 'Molybdenum': 95.95, 'Technetium': 98.0, 'Ruthenium': 101.1,
    'Rhodium': 102.9, 'Palladium': 106.4, 'Silver': 107.9, 'Cadmium': 112.4,
    'Indium': 114.8, 'Tin': 118.7, 'Antimony': 121.8, 'Tellurium': 127.6,
    'Iodine': 126.9, 'Xenon': 131.3, 'Cesium': 132.9, 'Barium': 137.3,
    'Lanthanum': 138.9, 'Cerium': 140.1, 'Praseodymium': 140.9, 'Neodymium': 144.2,
    'Promethium': 145.0, 'Samarium': 150.4, 'Europium': 152.0, 'Gadolinium': 157.3,
    'Terbium': 158.9, 'Dysprosium': 162.5, 'Holmium': 164.9, 'Erbium': 167.3,
    'Thulium': 168.9, 'Ytterbium': 173.0, 'Lutetium': 175.0, 'Hafnium': 178.5,
    'Tantalum': 180.9, 'Tungsten': 183.8, 'Rhenium': 186.2, 'Osmium': 190.2,
    'Iridium': 192.2, 'Platinum': 195.1, 'Gold': 197.0, 'Mercury': 200.6,
    'Thallium': 204.4, 'Lead': 207.2, 'Bismuth': 209.0, 'Polonium': 209.0,
    'Astatine': 210.0, 'Radon': 222.0, 'Francium': 223.0, 'Radium': 226.0,
    'Actinium': 227.0, 'Thorium': 232.0, 'Protactinium': 231.0, 'Uranium': 238.0,
    'Neptunium': 237.0, 'Plutonium': 244.0, 'Americium': 243.0, 'Curium': 247.0,
    'Berkelium': 247.0, 'Californium': 251.0, 'Einsteinium': 252.0, 'Fermium': 257.0,
    'Mendelevium': 258.0, 'Nobelium': 259.0, 'Lawrencium': 262.0, 'Rutherfordium': 267.0,
    'Dubnium': 268.0, 'Seaborgium': 269.0, 'Bohrium': 270.0, 'Hassium': 277.0,
    'Meitnerium': 278.0, 'Darmstadtium': 281.0, 'Roentgenium': 282.0, 'Copernicium': 285.0,
    'Nihonium': 286.0, 'Flerovium': 289.0, 'Moscovium': 290.0, 'Livermorium': 293.0,
    'Tennessine': 294.0, 'Oganesson': 294.0
};

const DEFAULT_MASS = 100.0;

export function getElementMass(elementName) {
    return ELEMENT_MASS[elementName] || DEFAULT_MASS;
}

function getCargoMassLimit() {
    return typeof window.CARGO_MASS_LIMIT !== 'undefined' ? window.CARGO_MASS_LIMIT : 5000;
}

// ===== ELEMENT RARITY CLASSIFICATION (for University cargo system) =====
export function getElementRarity(elementName) {
    const commonElements = [
        'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen',
        'Fluorine', 'Neon', 'Sodium', 'Aluminum', 'Silicon', 'Phosphorus', 'Sulfur', 'Chlorine',
        'Argon', 'Potassium', 'Calcium'
    ];
    
    const uncommonElements = [
        'Magnesium', 'Iron', 'Nickel', 'Copper', 'Zinc', 'Gallium', 'Germanium', 'Arsenic',
        'Selenium', 'Bromine', 'Krypton', 'Rubidium', 'Strontium', 'Yttrium', 'Zirconium',
        'Niobium', 'Molybdenum', 'Technetium', 'Ruthenium', 'Rhodium', 'Palladium', 'Silver',
        'Cadmium', 'Indium', 'Tin', 'Antimony', 'Tellurium', 'Iodine', 'Xenon', 'Cesium',
        'Barium', 'Lanthanum', 'Cerium', 'Praseodymium', 'Neodymium', 'Samarium', 'Europium',
        'Gadolinium', 'Terbium', 'Dysprosium', 'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium'
    ];
    
    const rareElements = [
        'Titanium', 'Chromium', 'Manganese', 'Cobalt', 'Vanadium',
        'Gold', 'Platinum', 'Iridium', 'Osmium', 'Rhenium'
    ];
    
    const veryRareElements = [
        'Uranium', 'Thorium', 'Plutonium', 'Neptunium', 'Americium', 'Curium'
    ];
    
    const legendaryElements = [
        'Berkelium', 'Californium', 'Einsteinium', 'Fermium', 'Mendelevium',
        'Nobelium', 'Lawrencium', 'Rutherfordium', 'Dubnium', 'Seaborgium',
        'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium', 'Roentgenium',
        'Copernicium', 'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium',
        'Tennessine', 'Oganesson'
    ];
    
    if (commonElements.includes(elementName)) return 'common';
    if (uncommonElements.includes(elementName)) return 'uncommon';
    if (rareElements.includes(elementName)) return 'rare';
    if (veryRareElements.includes(elementName)) return 'very-rare';
    if (legendaryElements.includes(elementName)) return 'legendary';
    
    return 'common';
}

// ============================================================================
// INDEXEDDB HELPER FUNCTIONS (Version 4 with all stores created)
// ============================================================================

// List of all stores used by the game with proper keyPath configurations
const STORE_CONFIGS = {
    certificates: { keyPath: 'id', autoIncrement: true },
    laborPool: { keyPath: 'id' },
    laborEarnings: { keyPath: 'playerId' },
    distributionHistory: { keyPath: 'id', autoIncrement: true },
    poolContributions: { keyPath: 'id', autoIncrement: true },
    journal: { keyPath: 'id' },
    element_locations: { keyPath: 'id' },
    communityFund: { keyPath: 'id' },
    communityProjects: { keyPath: 'id', autoIncrement: true },
    communityGrants: { keyPath: 'id', autoIncrement: true },
    fundHistory: { keyPath: 'id', autoIncrement: true }
};

const ALL_STORES = Object.keys(STORE_CONFIGS);

/**
 * Ensure IndexedDB stores exist with correct configuration
 */
async function ensureDBStores() {
    if (!window.idb) return null;
    
    try {
        const db = await window.idb.openDB('VoidfarerDB', 4, {
            upgrade(db, oldVersion, newVersion, transaction) {
                console.log(`Upgrading IndexedDB from version ${oldVersion} to ${newVersion}`);
                
                // Create all stores with proper keyPaths
                for (const [storeName, config] of Object.entries(STORE_CONFIGS)) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, config);
                        
                        // Create indexes for element_locations for efficient queries
                        if (storeName === 'element_locations') {
                            store.createIndex('by_element', 'elementName');
                            store.createIndex('by_planet', 'planet');
                            store.createIndex('by_timestamp', 'timestamp');
                        }
                        
                        // Create index for journal by timestamp
                        if (storeName === 'journal') {
                            store.createIndex('by_timestamp', 'timestamp');
                        }
                        
                        console.log(`Created store: ${storeName}`);
                    }
                }
            }
        });
        
        return db;
    } catch (error) {
        console.error('Error ensuring IndexedDB stores:', error);
        return null;
    }
}

/**
 * Get a single item from IndexedDB
 */
export async function getItem(storeName, id = 'main') {
    try {
        if (!window.idb) {
            const key = `voidfarer_${storeName}_${id}`;
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        }
        
        const db = await ensureDBStores();
        if (!db) throw new Error('Failed to open IndexedDB');
        
        return await db.get(storeName, id);
    } catch (error) {
        console.error(`Error getting item from ${storeName}:`, error);
        return null;
    }
}

/**
 * Set an item in IndexedDB
 */
export async function setItem(storeName, value, id = 'main') {
    try {
        if (!window.idb) {
            const key = `voidfarer_${storeName}_${id}`;
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        }
        
        const db = await ensureDBStores();
        if (!db) throw new Error('Failed to open IndexedDB');
        
        // If the store uses autoIncrement and no id provided, let it generate
        const config = STORE_CONFIGS[storeName];
        if (config && config.autoIncrement && !value.id) {
            // Don't specify key, let it auto-generate
            await db.add(storeName, value);
        } else {
            // Use put with the id from value or provided id
            const key = value.id || id;
            await db.put(storeName, value, key);
        }
        return true;
    } catch (error) {
        console.error(`Error setting item in ${storeName}:`, error);
        return false;
    }
}

/**
 * Get all items from a store
 */
export async function getAll(storeName) {
    try {
        if (!window.idb) {
            const items = [];
            const prefix = `voidfarer_${storeName}_`;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    try {
                        items.push(JSON.parse(localStorage.getItem(key)));
                    } catch (e) {}
                }
            }
            return items;
        }
        
        const db = await ensureDBStores();
        if (!db) throw new Error('Failed to open IndexedDB');
        
        return await db.getAll(storeName);
    } catch (error) {
        console.error(`Error getting all items from ${storeName}:`, error);
        return [];
    }
}

/**
 * Get items by index
 */
export async function getByIndex(storeName, indexName, value) {
    try {
        const db = await ensureDBStores();
        if (!db) return [];
        
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const index = store.index(indexName);
        return await index.getAll(value);
    } catch (error) {
        console.error(`Error getting by index from ${storeName}:`, error);
        return [];
    }
}

/**
 * Delete an item from IndexedDB
 */
export async function deleteItem(storeName, id) {
    try {
        if (!window.idb) {
            localStorage.removeItem(`voidfarer_${storeName}_${id}`);
            return true;
        }
        
        const db = await ensureDBStores();
        if (!db) throw new Error('Failed to open IndexedDB');
        
        await db.delete(storeName, id);
        return true;
    } catch (error) {
        console.error(`Error deleting item from ${storeName}:`, error);
        return false;
    }
}

/**
 * Clear all items from a store
 */
export async function clearStore(storeName) {
    try {
        if (!window.idb) {
            const prefix = `voidfarer_${storeName}_`;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    localStorage.removeItem(key);
                }
            }
            return true;
        }
        
        const db = await ensureDBStores();
        if (!db) throw new Error('Failed to open IndexedDB');
        
        await db.clear(storeName);
        return true;
    } catch (error) {
        console.error(`Error clearing store ${storeName}:`, error);
        return false;
    }
}

/**
 * Add a transaction to a store (for logging)
 */
export async function addTransaction(storeName, data) {
    try {
        const id = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const item = {
            id,
            ...data,
            timestamp: data.timestamp || Date.now(),
            date: data.date || new Date().toISOString()
        };
        return await setItem(storeName, item, id);
    } catch (error) {
        console.error(`Error adding transaction to ${storeName}:`, error);
        return false;
    }
}

// ============================================================================
// PLAYER DATA
// ============================================================================

export async function getPlayer(playerId = 'main') {
    try {
        const key = `${STORAGE_KEYS.PLAYER}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error getting player:', error);
        return null;
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

export async function createDefaultPlayer(name = 'Voidfarer', playerId = 'main') {
    try {
        const player = {
            id: playerId,
            name: name,
            ship: 'Prospector',
            shipLevel: 1,
            created: new Date().toISOString(),
            lastPlayed: new Date().toISOString(),
            playTime: 0,
            totalElementsCollected: 0,
            totalCreditsEarned: 5000,
            credits: 5000,
            cargoMassLimit: getCargoMassLimit(),
            planetsOwned: 0
        };
        await savePlayer(player, playerId);
        console.log('Created default player:', playerId);
        return player;
    } catch (error) {
        console.error('Error creating default player:', error);
        return null;
    }
}

// ============================================================================
// CREDITS
// ============================================================================

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

export async function addCredits(amount, playerId = 'main') {
    try {
        const current = await getCredits(playerId);
        const newTotal = current + amount;
        await saveCredits(newTotal, playerId);
        const player = await getPlayer(playerId);
        if (player) {
            player.totalCreditsEarned = (player.totalCreditsEarned || 5000) + amount;
            await savePlayer(player, playerId);
        }
        return newTotal;
    } catch (error) {
        console.error('Error adding credits:', error);
        return 5000;
    }
}

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

// ============================================================================
// COLLECTION FUNCTIONS (Ship Cargo)
// ============================================================================

export async function getCollection(playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `${STORAGE_KEYS.COLLECTION}_${actualPlayerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting collection:', error);
        return {};
    }
}

// ===== ENHANCED: Save location to both journal and element_locations =====
async function dbSaveElementLocation(elementName, planetName, locationData = {}) {
    try {
        const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
        const entryId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // 1. Save to localStorage journal
        const journalKey = `voidfarer_journal_${playerId}`;
        let journal = await getJournal();
        if (!journal) {
            journal = { playerId: playerId, entries: [], lastUpdated: new Date().toISOString() };
        }
        
        const entry = {
            id: entryId,
            type: 'extraction',
            element: elementName,
            quantity: locationData.quantity || 1,
            location: {
                planet: planetName,
                planetType: locationData.planetType || 'unknown',
                galaxyTier: locationData.galaxyTier || 1,
                sector: getCurrentSector(),
                region: getCurrentRegion()
            },
            rarity: locationData.rarity || 'common',
            timestamp: locationData.timestamp || Date.now(),
            date: new Date().toISOString(),
            value: locationData.value || 100
        };
        
        journal.entries.unshift(entry);
        if (journal.entries.length > 200) journal.entries = journal.entries.slice(0, 200);
        journal.lastUpdated = new Date().toISOString();
        localStorage.setItem(journalKey, JSON.stringify(journal));
        
        // 2. Save to IndexedDB stores
        if (window.idb) {
            try {
                const db = await ensureDBStores();
                if (!db) throw new Error('Failed to open IndexedDB');
                
                // Save to journal store
                if (db.objectStoreNames.contains('journal')) {
                    await db.put('journal', entry);
                }
                
                // Save to element_locations store with the same ID as keyPath
                const locationEntry = {
                    id: entryId,
                    elementName: elementName,
                    planet: planetName,
                    planetType: locationData.planetType || 'unknown',
                    quantity: locationData.quantity || 1,
                    timestamp: locationData.timestamp || Date.now(),
                    date: entry.date,
                    rarity: locationData.rarity || 'common',
                    playerId: playerId,
                    galaxyTier: locationData.galaxyTier || 1
                };
                
                if (db.objectStoreNames.contains('element_locations')) {
                    await db.put('element_locations', locationEntry);
                }
                
                console.log(`✅ Saved location for ${elementName} on ${planetName}`);
            } catch (idbError) {
                console.error('Failed to save to IndexedDB:', idbError);
            }
        }
        
        window.dispatchEvent(new CustomEvent('journal-updated', { detail: { entry: entry } }));
        return true;
    } catch (error) {
        console.error('Failed to save journal entry:', error);
        return false;
    }
}

export async function addElementToCollection(elementName, quantity = 1, metadata = {}) {
    try {
        const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `${STORAGE_KEYS.COLLECTION}_${playerId}`;
        
        let collection = await getCollection(playerId);
        
        if (!collection[elementName]) {
            collection[elementName] = { count: 0 };
        }
        
        if (typeof collection[elementName] === 'object') {
            collection[elementName].count = (collection[elementName].count || 0) + quantity;
        } else {
            collection[elementName] = { count: (collection[elementName] || 0) + quantity };
        }
        
        localStorage.setItem(key, JSON.stringify(collection));
        
        // Save location data if provided
        if (metadata && metadata.planet) {
            await dbSaveElementLocation(elementName, metadata.planet, {
                planetType: metadata.planetType || 'unknown',
                galaxyTier: metadata.galaxyTier || 1,
                quantity: quantity,
                timestamp: metadata.timestamp || Date.now(),
                rarity: metadata.rarity || getElementRarity(elementName),
                value: metadata.value || 100
            });
        }
        
        return {
            success: true,
            element: elementName,
            newCount: collection[elementName].count,
            added: quantity
        };
    } catch (error) {
        console.error('Error adding element to collection:', error);
        return { success: false, error: error.message };
    }
}

export async function removeElementFromCollection(elementName, quantity = 1) {
    try {
        const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `${STORAGE_KEYS.COLLECTION}_${playerId}`;
        const collection = await getCollection(playerId);
        
        if (!collection[elementName]) {
            return { success: false, error: 'Element not found' };
        }
        
        let currentCount = typeof collection[elementName] === 'object' ? collection[elementName].count || 0 : collection[elementName];
        
        if (currentCount < quantity) {
            return { success: false, error: 'Insufficient quantity' };
        }
        
        if (typeof collection[elementName] === 'object') {
            collection[elementName].count = currentCount - quantity;
            if (collection[elementName].count <= 0) {
                delete collection[elementName];
            }
        } else {
            const newCount = currentCount - quantity;
            if (newCount <= 0) {
                delete collection[elementName];
            } else {
                collection[elementName] = newCount;
            }
        }
        
        localStorage.setItem(key, JSON.stringify(collection));
        
        return { success: true, element: elementName, removed: quantity };
    } catch (error) {
        console.error('Error removing element from collection:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// JOURNAL / LOCATION TRACKING FUNCTIONS
// ============================================================================

export async function getJournal() {
    try {
        const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
        const journalKey = `voidfarer_journal_${playerId}`;
        const saved = localStorage.getItem(journalKey);
        if (saved) return JSON.parse(saved);
        
        if (window.idb) {
            try {
                const db = await ensureDBStores();
                if (db && db.objectStoreNames.contains('journal')) {
                    const entries = await db.getAll('journal');
                    if (entries && entries.length > 0) {
                        return {
                            playerId: playerId,
                            entries: entries.sort((a, b) => b.timestamp - a.timestamp),
                            lastUpdated: new Date().toISOString()
                        };
                    }
                }
            } catch (idbError) {}
        }
        return null;
    } catch (error) {
        console.error('Error getting journal:', error);
        return null;
    }
}

// ===== getPlayerLocations for planet-status.js integration =====
/**
 * Get all player locations for planet-status.js
 * Returns array of location objects with planet, elementName, timestamp, etc.
 */
export async function getPlayerLocations() {
    try {
        // First try to get from IndexedDB element_locations store
        if (window.idb) {
            try {
                const db = await ensureDBStores();
                if (db && db.objectStoreNames.contains('element_locations')) {
                    const locations = await db.getAll('element_locations');
                    if (locations && locations.length > 0) {
                        return locations;
                    }
                }
            } catch (idbError) {
                console.error('Error reading from element_locations:', idbError);
            }
        }
        
        // Fallback to journal entries
        const journal = await getJournal();
        if (journal && journal.entries) {
            return journal.entries.map(entry => ({
                id: entry.id,
                elementName: entry.element,
                planet: entry.location?.planet || 'Unknown',
                planetType: entry.location?.planetType || 'unknown',
                quantity: entry.quantity || 1,
                timestamp: entry.timestamp || Date.now(),
                date: entry.date,
                rarity: entry.rarity || 'common',
                playerId: journal.playerId,
                galaxyTier: entry.location?.galaxyTier || 1
            }));
        }
        
        return [];
    } catch (error) {
        console.error('Error getting player locations:', error);
        return [];
    }
}

export async function getElementLocations(elementName) {
    try {
        // Try IndexedDB first
        if (window.idb) {
            try {
                const locations = await getByIndex('element_locations', 'by_element', elementName);
                if (locations && locations.length > 0) {
                    return locations;
                }
            } catch (idbError) {}
        }
        
        // Fallback to journal
        const journal = await getJournal();
        if (journal && journal.entries) {
            return journal.entries
                .filter(entry => entry.element === elementName)
                .map(entry => ({
                    id: entry.id,
                    elementName: entry.element,
                    planet: entry.location?.planet,
                    planetType: entry.location?.planetType,
                    quantity: entry.quantity,
                    timestamp: entry.timestamp,
                    date: entry.date,
                    rarity: entry.rarity
                }));
        }
        return [];
    } catch (error) {
        console.error('Error getting element locations:', error);
        return [];
    }
}

export async function getRecentJournalEntries(limit = 20) {
    try {
        const journal = await getJournal();
        if (journal && journal.entries) return journal.entries.slice(0, limit);
        return [];
    } catch (error) {
        console.error('Error getting recent journal entries:', error);
        return [];
    }
}

export async function clearJournal() {
    try {
        const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
        localStorage.removeItem(`voidfarer_journal_${playerId}`);
        if (window.idb) {
            try {
                const db = await ensureDBStores();
                if (db) {
                    if (db.objectStoreNames.contains('journal')) await db.clear('journal');
                    if (db.objectStoreNames.contains('element_locations')) await db.clear('element_locations');
                }
            } catch (idbError) {}
        }
        console.log('📝 Journal cleared');
        return true;
    } catch (error) {
        console.error('Error clearing journal:', error);
        return false;
    }
}

// ============================================================================
// HUB INVENTORY FUNCTIONS
// ============================================================================

export async function getHubInventory() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.HUB_INVENTORY);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting hub inventory:', error);
        return {};
    }
}

export async function addElementToHub(elementName, quantity = 1) {
    try {
        const hubInventory = await getHubInventory();
        if (!hubInventory[elementName]) {
            hubInventory[elementName] = { count: 0, firstFound: Date.now() };
        }
        hubInventory[elementName].count = (hubInventory[elementName].count || 0) + quantity;
        localStorage.setItem(STORAGE_KEYS.HUB_INVENTORY, JSON.stringify(hubInventory));
        const used = await getCurrentHubUsed();
        localStorage.setItem(STORAGE_KEYS.HUB_STORAGE_USED, used.toString());
        return { success: true };
    } catch (error) {
        console.error('Error adding element to hub:', error);
        return { success: false, error: error.message };
    }
}

export async function removeElementFromHub(elementName, quantity = 1) {
    try {
        const hubInventory = await getHubInventory();
        if (!hubInventory[elementName]) {
            return { success: false, error: 'Element not found' };
        }
        const currentCount = hubInventory[elementName].count || 0;
        if (currentCount < quantity) {
            return { success: false, error: 'Insufficient quantity' };
        }
        hubInventory[elementName].count = currentCount - quantity;
        if (hubInventory[elementName].count <= 0) {
            delete hubInventory[elementName];
        }
        localStorage.setItem(STORAGE_KEYS.HUB_INVENTORY, JSON.stringify(hubInventory));
        const used = await getCurrentHubUsed();
        localStorage.setItem(STORAGE_KEYS.HUB_STORAGE_USED, used.toString());
        return { success: true };
    } catch (error) {
        console.error('Error removing element from hub:', error);
        return { success: false, error: error.message };
    }
}

async function getCurrentHubUsed() {
    try {
        const hubInventory = await getHubInventory();
        let used = 0;
        for (const [name, data] of Object.entries(hubInventory)) {
            used += (data.count || 1) * getElementMass(name);
        }
        return used;
    } catch (error) {
        return 0;
    }
}

export async function getRemainingHubStorage() {
    try {
        const max = parseInt(localStorage.getItem(STORAGE_KEYS.HUB_STORAGE_MAX)) || 0;
        const used = await getCurrentHubUsed();
        return Math.max(0, max - used);
    } catch (error) {
        return 0;
    }
}

export async function getRemainingShipStorage() {
    try {
        const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
        const collection = await getCollection(playerId);
        const max = getCargoMassLimit();
        let used = 0;
        for (const [name, data] of Object.entries(collection)) {
            used += (data.count || 1) * getElementMass(name);
        }
        return Math.max(0, max - used);
    } catch (error) {
        return 0;
    }
}

// ============================================================================
// LOCATION HELPERS
// ============================================================================

export function isAtEarth() {
    const currentPlanet = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Earth';
    return currentPlanet === 'Earth';
}

export function getCurrentPlanetName() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Unknown';
}

export function getCurrentPlanetType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_TYPE) || 'unknown';
}

export function getCurrentPlanetResources() {
    const resources = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES);
    return resources ? JSON.parse(resources) : [];
}

export function getCurrentPlanetTier() {
    const tier = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_TIER);
    return tier ? parseInt(tier) : 1;
}

export function getCurrentSector() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR) || 'B2';
}

export function getCurrentRegion() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_REGION) || 'Orion Arm';
}

export function setCurrentLocation(region, sector, starSector, starSectorType, starSectorStars, starSectorX, starSectorY) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_REGION, region);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR, sector);
    if (starSector) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_SECTOR, starSector);
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_NAME, starSector);
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_TYPE, starSectorType || 'Unknown');
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_STARS, (starSectorStars || 50).toString());
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_X, (starSectorX || 30).toString());
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_Y, (starSectorY || 40).toString());
    }
}

export function setCurrentPlanet(name, type, resources, tier = 1) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_TYPE, type);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES, JSON.stringify(resources));
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_TIER, tier.toString());
    
    let image = 'earth-view.jpg';
    if (type.includes('scorched') || type.includes('volcanic')) image = 'pyros-surface.jpg';
    else if (type.includes('frozen') || type.includes('ice')) image = 'glacier-surface.jpg';
    else if (type.includes('lush')) image = 'verdant-surface.jpg';
    else if (type.includes('barren')) image = 'barren-surface.jpg';
    else if (type.includes('gas')) image = 'gas-surface.jpg';
    else if (type.includes('oceanic')) image = 'oceanic-surface.jpg';
    else if (type.includes('toxic')) image = 'toxic-surface.jpg';
    else if (type.includes('asteroid')) image = 'asteroid-field.jpg';
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_IMAGE, image);
}

// ============================================================================
// SHIP DATA
// ============================================================================

export function getShipFuel() {
    try {
        return parseInt(localStorage.getItem(STORAGE_KEYS.SHIP_FUEL)) || 100;
    } catch (error) {
        return 100;
    }
}

export function saveShipFuel(fuel) {
    try {
        localStorage.setItem(STORAGE_KEYS.SHIP_FUEL, fuel.toString());
    } catch (error) {
        console.error('Error saving ship fuel:', error);
    }
}

export function getShipPower() {
    try {
        return parseInt(localStorage.getItem(STORAGE_KEYS.SHIP_POWER)) || 100;
    } catch (error) {
        return 100;
    }
}

export function saveShipPower(power) {
    try {
        localStorage.setItem(STORAGE_KEYS.SHIP_POWER, power.toString());
    } catch (error) {
        console.error('Error saving ship power:', error);
    }
}

// ============================================================================
// WARP DATA
// ============================================================================

export function setWarpData(destination, returnPage, cycles, distance, fuel) {
    localStorage.setItem(STORAGE_KEYS.WARP_DESTINATION, destination);
    localStorage.setItem(STORAGE_KEYS.WARP_RETURN, returnPage);
    localStorage.setItem(STORAGE_KEYS.WARP_CYCLES, cycles.toString());
    if (distance) localStorage.setItem(STORAGE_KEYS.WARP_DISTANCE, distance.toString());
    if (fuel) localStorage.setItem(STORAGE_KEYS.WARP_FUEL, fuel.toString());
}

export function getWarpData() {
    return {
        destination: localStorage.getItem(STORAGE_KEYS.WARP_DESTINATION) || 'Unknown',
        returnPage: localStorage.getItem(STORAGE_KEYS.WARP_RETURN) || 'galaxy-map.html',
        cycles: parseInt(localStorage.getItem(STORAGE_KEYS.WARP_CYCLES)) || 1,
        distance: parseFloat(localStorage.getItem(STORAGE_KEYS.WARP_DISTANCE)) || 0,
        fuel: parseInt(localStorage.getItem(STORAGE_KEYS.WARP_FUEL)) || 0
    };
}

export function clearWarpData() {
    const keys = [
        STORAGE_KEYS.WARP_DESTINATION,
        STORAGE_KEYS.WARP_RETURN,
        STORAGE_KEYS.WARP_CYCLES,
        STORAGE_KEYS.WARP_DISTANCE,
        STORAGE_KEYS.WARP_FUEL,
        STORAGE_KEYS.WARP_DESTINATION_PLANET,
        STORAGE_KEYS.WARP_DESTINATION_PLANET_TYPE,
        STORAGE_KEYS.WARP_ORIGIN_PLANET,
        STORAGE_KEYS.WARP_ORIGIN_STAR,
        STORAGE_KEYS.WARP_ORIGIN_STAR_SECTOR,
        STORAGE_KEYS.WARP_ORIGIN_REGION,
        STORAGE_KEYS.WARP_ORIGIN_SECTOR
    ];
    keys.forEach(key => localStorage.removeItem(key));
}

// ============================================================================
// PLAYER ID
// ============================================================================

export function getPlayerId() {
    let playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!playerId) {
        playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(STORAGE_KEYS.PLAYER_ID, playerId);
    }
    return playerId;
}

// ============================================================================
// SAVE TIMESTAMP
// ============================================================================

export function saveTimestamp() {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
}

// ============================================================================
// SETTINGS
// ============================================================================

export function getHapticsEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_HAPTICS) !== 'false';
}

export function setHapticsEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_HAPTICS, enabled.toString());
}

export function getAutoGatherEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER) !== 'false';
}

export function setAutoGatherEnabled(enabled) {
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

// ============================================================================
// MARKET DATA PERSISTENCE
// ============================================================================

export async function saveMarketData(marketData) {
    try {
        localStorage.setItem(STORAGE_KEYS.MARKET_PRICES, JSON.stringify(marketData));
        return true;
    } catch (error) {
        console.error('Error saving market data:', error);
        return false;
    }
}

export async function loadMarketData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.MARKET_PRICES);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error loading market data:', error);
        return null;
    }
}

export async function saveOrderBook(orderBookData, playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        localStorage.setItem(`${STORAGE_KEYS.MARKET_ORDERS}_${actualPlayerId}`, JSON.stringify(orderBookData));
        return true;
    } catch (error) {
        console.error('Error saving order book:', error);
        return false;
    }
}

export async function loadOrderBook(playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const saved = localStorage.getItem(`${STORAGE_KEYS.MARKET_ORDERS}_${actualPlayerId}`);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error loading order book:', error);
        return null;
    }
}

export async function savePortfolio(portfolioData, playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        localStorage.setItem(`voidfarer_portfolio_${actualPlayerId}`, JSON.stringify(portfolioData));
        return true;
    } catch (error) {
        console.error('Error saving portfolio:', error);
        return false;
    }
}

export async function loadPortfolio(playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const saved = localStorage.getItem(`voidfarer_portfolio_${actualPlayerId}`);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error loading portfolio:', error);
        return null;
    }
}

export async function saveTradeHistory(trades, playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        localStorage.setItem(`voidfarer_trades_${actualPlayerId}`, JSON.stringify(trades));
        return true;
    } catch (error) {
        console.error('Error saving trade history:', error);
        return false;
    }
}

export async function loadTradeHistory(playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const saved = localStorage.getItem(`voidfarer_trades_${actualPlayerId}`);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error loading trade history:', error);
        return [];
    }
}

// ============================================================================
// NPC TRADER FUNCTIONS
// ============================================================================

export async function saveNPCTraders(traders) {
    try {
        localStorage.setItem(STORAGE_KEYS.NPC_TRADERS, JSON.stringify(traders));
        const stats = await loadNPCStats();
        stats.totalTraders = Object.keys(traders).length;
        stats.lastUpdated = Date.now();
        await saveNPCStats(stats);
        return true;
    } catch (error) {
        console.error('Error saving NPC traders:', error);
        return false;
    }
}

export async function loadNPCTraders() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.NPC_TRADERS);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error loading NPC traders:', error);
        return {};
    }
}

export async function saveNPCTrader(traderId, traderData) {
    try {
        const traders = await loadNPCTraders();
        traders[traderId] = traderData;
        return await saveNPCTraders(traders);
    } catch (error) {
        console.error('Error saving NPC trader:', error);
        return false;
    }
}

export async function loadNPCTrader(traderId) {
    try {
        const traders = await loadNPCTraders();
        return traders[traderId] || null;
    } catch (error) {
        console.error('Error loading NPC trader:', error);
        return null;
    }
}

export async function saveNPCOrders(orders) {
    try {
        localStorage.setItem(STORAGE_KEYS.NPC_TRADER_ORDERS, JSON.stringify(orders));
        const stats = await loadNPCStats();
        let totalOrders = 0;
        if (typeof orders === 'object') {
            if (Array.isArray(orders)) totalOrders = orders.length;
            else for (const element in orders) if (Array.isArray(orders[element])) totalOrders += orders[element].length;
        }
        stats.totalOrders = totalOrders;
        stats.lastUpdated = Date.now();
        await saveNPCStats(stats);
        return true;
    } catch (error) {
        console.error('Error saving NPC orders:', error);
        return false;
    }
}

export async function loadNPCOrders() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.NPC_TRADER_ORDERS);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error loading NPC orders:', error);
        return {};
    }
}

export async function saveNPCStats(stats) {
    try {
        localStorage.setItem(STORAGE_KEYS.NPC_TRADER_STATS, JSON.stringify(stats));
        return true;
    } catch (error) {
        console.error('Error saving NPC stats:', error);
        return false;
    }
}

export async function loadNPCStats() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.NPC_TRADER_STATS);
        return saved ? JSON.parse(saved) : { totalTraders: 0, activeTraders: 0, totalOrders: 0, totalVolume: 0, lastUpdated: Date.now() };
    } catch (error) {
        console.error('Error loading NPC stats:', error);
        return { totalTraders: 0, activeTraders: 0, totalOrders: 0, totalVolume: 0, lastUpdated: Date.now() };
    }
}

export async function getLastNPCUpdate() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.LAST_NPC_UPDATE);
        return saved ? parseInt(saved) : 0;
    } catch (error) {
        console.error('Error getting last NPC update:', error);
        return 0;
    }
}

export async function setLastNPCUpdate(timestamp = Date.now()) {
    try {
        localStorage.setItem(STORAGE_KEYS.LAST_NPC_UPDATE, timestamp.toString());
        return true;
    } catch (error) {
        console.error('Error setting last NPC update:', error);
        return false;
    }
}

export async function updateNPCTraderAfterTrade(traderId, tradeData) {
    try {
        const trader = await loadNPCTrader(traderId);
        if (!trader) return false;
        const total = tradeData.quantity * tradeData.price;
        if (tradeData.side === 'sell') {
            trader.credits += total;
            if (trader.inventory[tradeData.element]) {
                trader.inventory[tradeData.element] -= tradeData.quantity;
                if (trader.inventory[tradeData.element] <= 0) delete trader.inventory[tradeData.element];
            }
        } else {
            trader.credits -= total;
            if (!trader.inventory[tradeData.element]) trader.inventory[tradeData.element] = 0;
            trader.inventory[tradeData.element] += tradeData.quantity;
        }
        trader.lastActivity = Date.now();
        trader.totalTrades = (trader.totalTrades || 0) + 1;
        trader.totalVolume = (trader.totalVolume || 0) + total;
        await saveNPCTrader(traderId, trader);
        const stats = await loadNPCStats();
        stats.totalVolume = (stats.totalVolume || 0) + total;
        stats.lastUpdated = Date.now();
        await saveNPCStats(stats);
        return true;
    } catch (error) {
        console.error('Error updating NPC trader after trade:', error);
        return false;
    }
}

// ============================================================================
// CERTIFICATE HOLDER FUNCTIONS (FOR LABOR POOL)
// ============================================================================

export async function getCertificateHolders(certificateId = null) {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATE_HOLDERS);
        const holders = saved ? JSON.parse(saved) : {};
        if (certificateId) return holders[certificateId] || [];
        return holders;
    } catch (error) {
        console.error('Error getting certificate holders:', error);
        return certificateId ? [] : {};
    }
}

export async function updateCertificateHolder(playerId, playerName, certificateId, masteryLevel) {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATE_HOLDERS);
        const holders = saved ? JSON.parse(saved) : {};
        if (!holders[certificateId]) holders[certificateId] = [];
        const existingIndex = holders[certificateId].findIndex(h => h.playerId === playerId);
        const holderData = { playerId, playerName, masteryLevel, lastUpdated: Date.now() };
        if (existingIndex >= 0) holders[certificateId][existingIndex] = holderData;
        else holders[certificateId].push(holderData);
        localStorage.setItem(STORAGE_KEYS.CERTIFICATE_HOLDERS, JSON.stringify(holders));
        return true;
    } catch (error) {
        console.error('Error updating certificate holder:', error);
        return false;
    }
}

export async function addPlayerLaborEarnings(playerId, amount) {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS);
        const earnings = saved ? JSON.parse(saved) : {};
        if (!earnings[playerId]) earnings[playerId] = 0;
        earnings[playerId] += amount;
        localStorage.setItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS, JSON.stringify(earnings));
        return true;
    } catch (error) {
        console.error('Error adding player labor earnings:', error);
        return false;
    }
}

export async function getPlayerLaborEarnings(playerId) {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS);
        const earnings = saved ? JSON.parse(saved) : {};
        return earnings[playerId] || 0;
    } catch (error) {
        console.error('Error getting player labor earnings:', error);
        return 0;
    }
}

export async function claimPlayerLaborEarnings(playerId) {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS);
        const earnings = saved ? JSON.parse(saved) : {};
        const amount = earnings[playerId] || 0;
        if (amount > 0) {
            delete earnings[playerId];
            localStorage.setItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS, JSON.stringify(earnings));
            await addCredits(amount, playerId);
        }
        return amount;
    } catch (error) {
        console.error('Error claiming player labor earnings:', error);
        return 0;
    }
}

// ============================================================================
// DISCOVERY LOCK FUNCTIONS
// ============================================================================

export async function getDiscoveryHistory(planetName) {
    try {
        const saved = localStorage.getItem(`${STORAGE_KEYS.DISCOVERY_HISTORY}_${planetName}`);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error getting discovery history:', error);
        return [];
    }
}

export async function addToDiscoveryHistory(planetName, playerId, playerName, planetTier) {
    try {
        const history = await getDiscoveryHistory(planetName);
        history.push({ playerId, playerName, planetTier, timestamp: Date.now(), date: new Date().toISOString(), isFirstDiscovery: history.length === 0 });
        localStorage.setItem(`${STORAGE_KEYS.DISCOVERY_HISTORY}_${planetName}`, JSON.stringify(history));
        return true;
    } catch (error) {
        console.error('Error adding to discovery history:', error);
        return false;
    }
}

export async function getHiddenPlanets() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.HIDDEN_PLANETS);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}

export async function hidePlanet(planetName) {
    try {
        const hidden = await getHiddenPlanets();
        if (!hidden.includes(planetName)) {
            hidden.push(planetName);
            localStorage.setItem(STORAGE_KEYS.HIDDEN_PLANETS, JSON.stringify(hidden));
        }
        return true;
    } catch (error) {
        return false;
    }
}

export async function revealPlanet(planetName) {
    try {
        let hidden = await getHiddenPlanets();
        hidden = hidden.filter(name => name !== planetName);
        localStorage.setItem(STORAGE_KEYS.HIDDEN_PLANETS, JSON.stringify(hidden));
        return true;
    } catch (error) {
        return false;
    }
}

export async function getScannedSectors(playerId) {
    try {
        const saved = localStorage.getItem(`${STORAGE_KEYS.SCANNED_SECTORS}_${playerId}`);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}

export async function getScannedStarSectors(playerId) {
    try {
        const saved = localStorage.getItem(`${STORAGE_KEYS.SCANNED_STAR_SECTORS}_${playerId}`);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}

export async function getScannedStars(playerId) {
    try {
        const saved = localStorage.getItem(`${STORAGE_KEYS.SCANNED_STARS}_${playerId}`);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export async function initializeStorage(playerId = 'main') {
    console.log('Initializing storage for player:', playerId);
    
    // Ensure IndexedDB stores exist with proper configuration
    await ensureDBStores();
    
    const player = await getPlayer(playerId);
    if (!player) await createDefaultPlayer('Voidfarer', playerId);
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_HAPTICS)) localStorage.setItem(STORAGE_KEYS.SETTINGS_HAPTICS, 'true');
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER)) localStorage.setItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER, 'true');
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED)) localStorage.setItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED, 'gentle');
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_MUSIC)) localStorage.setItem(STORAGE_KEYS.SETTINGS_MUSIC, '50');
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_AMBIENT)) localStorage.setItem(STORAGE_KEYS.SETTINGS_AMBIENT, '50');
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR)) setCurrentLocation('Orion Arm', 'B2', 'Orion Molecular Cloud', 'Star-forming', 85, 30, 40);
    console.log('Storage initialized for player:', playerId);
}

// ============================================================================
// RESET
// ============================================================================

export async function resetGame(playerId = 'main') {
    const settings = {
        haptics: getHapticsEnabled(),
        autoGather: getAutoGatherEnabled(),
        orbitSpeed: getOrbitSpeed(),
        music: getMusicVolume(),
        ambient: getAmbientVolume()
    };
    const keysToRemove = [
        `${STORAGE_KEYS.PLAYER}_${playerId}`,
        `${STORAGE_KEYS.COLLECTION}_${playerId}`,
        STORAGE_KEYS.CREDITS,
        STORAGE_KEYS.SHIP_FUEL,
        STORAGE_KEYS.SHIP_POWER,
        STORAGE_KEYS.CURRENT_SECTOR,
        STORAGE_KEYS.CURRENT_REGION,
        STORAGE_KEYS.CURRENT_STAR_SECTOR,
        STORAGE_KEYS.CURRENT_SECTOR_NAME,
        STORAGE_KEYS.CURRENT_SECTOR_TYPE,
        STORAGE_KEYS.CURRENT_SECTOR_STARS,
        STORAGE_KEYS.CURRENT_SECTOR_X,
        STORAGE_KEYS.CURRENT_SECTOR_Y,
        STORAGE_KEYS.CURRENT_STAR,
        STORAGE_KEYS.CURRENT_STAR_TYPE,
        STORAGE_KEYS.CURRENT_STAR_INDEX,
        STORAGE_KEYS.CURRENT_STAR_X,
        STORAGE_KEYS.CURRENT_STAR_Y,
        STORAGE_KEYS.CURRENT_STAR_PLANETS,
        STORAGE_KEYS.CURRENT_PLANET,
        STORAGE_KEYS.CURRENT_PLANET_TYPE,
        STORAGE_KEYS.CURRENT_PLANET_RESOURCES,
        STORAGE_KEYS.CURRENT_PLANET_IMAGE,
        STORAGE_KEYS.CURRENT_PLANET_TIER,
        STORAGE_KEYS.COLONIES,
        STORAGE_KEYS.DISCOVERED_LOCATIONS,
        STORAGE_KEYS.SCAN_HISTORY,
        STORAGE_KEYS.HUB_INVENTORY,
        STORAGE_KEYS.PLANET_CLAIMS,
        STORAGE_KEYS.PLAYER_CLAIMS,
        STORAGE_KEYS.CLAIM_HISTORY,
        STORAGE_KEYS.CERTIFICATE_HOLDERS,
        `voidfarer_journal_${playerId}`
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    if (window.idb) {
        try {
            const db = await ensureDBStores();
            if (db) {
                if (db.objectStoreNames.contains('journal')) await db.clear('journal');
                if (db.objectStoreNames.contains('element_locations')) await db.clear('element_locations');
            }
        } catch (idbError) {}
    }
    setHapticsEnabled(settings.haptics);
    setAutoGatherEnabled(settings.autoGather);
    setOrbitSpeed(settings.orbitSpeed);
    setMusicVolume(settings.music);
    setAmbientVolume(settings.ambient);
    await initializeStorage(playerId);
}

// ============================================================================
// EXPOSE FUNCTIONS TO WINDOW
// ============================================================================

window.getPlayer = getPlayer;
window.savePlayer = savePlayer;
window.getCollection = getCollection;
window.addElementToCollection = addElementToCollection;
window.removeElementFromCollection = removeElementFromCollection;
window.getHubInventory = getHubInventory;
window.addElementToHub = addElementToHub;
window.removeElementFromHub = removeElementFromHub;
window.getRemainingHubStorage = getRemainingHubStorage;
window.getRemainingShipStorage = getRemainingShipStorage;
window.isAtEarth = isAtEarth;
window.getElementMass = getElementMass;
window.getElementRarity = getElementRarity;
window.getCredits = getCredits;
window.saveCredits = saveCredits;
window.addCredits = addCredits;
window.spendCredits = spendCredits;
window.getShipFuel = getShipFuel;
window.saveShipFuel = saveShipFuel;
window.getShipPower = getShipPower;
window.saveShipPower = saveShipPower;
window.getCurrentPlanetName = getCurrentPlanetName;
window.getCurrentPlanetType = getCurrentPlanetType;
window.getCurrentPlanetResources = getCurrentPlanetResources;
window.getCurrentPlanetTier = getCurrentPlanetTier;
window.getCurrentSector = getCurrentSector;
window.getCurrentRegion = getCurrentRegion;
window.setCurrentLocation = setCurrentLocation;
window.setCurrentPlanet = setCurrentPlanet;
window.getCertificateHolders = getCertificateHolders;
window.updateCertificateHolder = updateCertificateHolder;
window.addPlayerLaborEarnings = addPlayerLaborEarnings;
window.getPlayerLaborEarnings = getPlayerLaborEarnings;
window.claimPlayerLaborEarnings = claimPlayerLaborEarnings;
window.saveNPCTraders = saveNPCTraders;
window.loadNPCTraders = loadNPCTraders;
window.saveNPCTrader = saveNPCTrader;
window.loadNPCTrader = loadNPCTrader;
window.saveNPCOrders = saveNPCOrders;
window.loadNPCOrders = loadNPCOrders;
window.saveNPCStats = saveNPCStats;
window.loadNPCStats = loadNPCStats;
window.getLastNPCUpdate = getLastNPCUpdate;
window.setLastNPCUpdate = setLastNPCUpdate;
window.updateNPCTraderAfterTrade = updateNPCTraderAfterTrade;
window.getJournal = getJournal;
window.getElementLocations = getElementLocations;
window.getRecentJournalEntries = getRecentJournalEntries;
window.clearJournal = clearJournal;
window.getPlayerLocations = getPlayerLocations;
window.getDiscoveryHistory = getDiscoveryHistory;
window.addToDiscoveryHistory = addToDiscoveryHistory;
window.getHiddenPlanets = getHiddenPlanets;
window.hidePlanet = hidePlanet;
window.revealPlanet = revealPlanet;
window.getScannedSectors = getScannedSectors;
window.getScannedStarSectors = getScannedStarSectors;
window.getScannedStars = getScannedStars;
window.saveMarketData = saveMarketData;
window.loadMarketData = loadMarketData;
window.saveOrderBook = saveOrderBook;
window.loadOrderBook = loadOrderBook;
window.savePortfolio = savePortfolio;
window.loadPortfolio = loadPortfolio;
window.saveTradeHistory = saveTradeHistory;
window.loadTradeHistory = loadTradeHistory;
window.getItem = getItem;
window.setItem = setItem;
window.getAll = getAll;
window.getByIndex = getByIndex;
window.addTransaction = addTransaction;

console.log('✅ storage.js loaded with proper IndexedDB key handling and getPlayerLocations integration');

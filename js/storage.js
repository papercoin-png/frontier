// js/storage.js - Save/load player progress for Voidfarer
// Using IndexedDB via db.js for unlimited storage with mass-based cargo
// UPDATED: Added material inventory, recipe unlocks, skill progression across all fields
// UPDATED: Added market data persistence for trading system
// UPDATED: Added certificate holder tracking for labor pool distribution
// UPDATED: Added NPC trader persistence for marketplace NPCs
// UPDATED: Added market data cleanup functions to prevent localStorage quota issues
// UPDATED: Added location saving to IndexedDB when collecting elements
// FIXED: Added recordTrade call to update market dynamics when elements are added

// ===== CONSTANTS =====
// CARGO_MASS_LIMIT is now defined in the HTML files to avoid duplicate declaration
// We'll use the value from window or fallback to 5000

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    // Player data
    PLAYER: 'voidfarer_player',
    PLAYER_ID: 'voidfarer_player_id',
    PLAYER_STATS: 'voidfarer_player_stats',
    
    // Collections
    COLLECTION: 'voidfarer_collection',           // Raw elements (legacy)
    ELEMENT_INVENTORY: 'voidfarer_element_inventory', // Raw elements (new)
    MATERIAL_INVENTORY: 'voidfarer_material_inventory', // Crafted materials
    MATERIAL_QUALITY: 'voidfarer_material_quality', // Quality tracking
    
    // Crafting progression
    ALCHEMY_PROGRESS: 'voidfarer_alchemy_progress',
    METALLURGY_PROGRESS: 'voidfarer_metallurgy_progress',
    MATERIALS_SCIENCE_PROGRESS: 'voidfarer_materials_science_progress',
    PHARMACEUTICALS_PROGRESS: 'voidfarer_pharmaceuticals_progress',
    TEXTILES_PROGRESS: 'voidfarer_textiles_progress',
    CONSTRUCTION_PROGRESS: 'voidfarer_construction_progress',
    AEROSPACE_PROGRESS: 'voidfarer_aerospace_progress',
    NUCLEAR_PROGRESS: 'voidfarer_nuclear_progress',
    OPTICAL_PROGRESS: 'voidfarer_optical_progress',
    MAGNETIC_PROGRESS: 'voidfarer_magnetic_progress',
    CRYOGENIC_PROGRESS: 'voidfarer_cryogenic_progress',
    POLYMERS_PROGRESS: 'voidfarer_polymers_progress',
    
    // Recipe unlocks
    RECIPES_UNLOCKED: 'voidfarer_recipes_unlocked',
    
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
    SHIP_STORAGE_MAX: 'voidfarer_ship_storage_max',
    SHIP_STORAGE_USED: 'voidfarer_ship_storage_used',
    
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
    
    // Crafting recipes unlocked
    RECIPE_UNLOCKS: 'voidfarer_recipe_unlocks',
    
    // Field mastery levels
    FIELD_MASTERY: 'voidfarer_field_mastery',
    
    // ===== NPC TRADER KEYS =====
    NPC_TRADERS: 'voidfarer_npc_traders',
    NPC_TRADER_ORDERS: 'voidfarer_npc_trader_orders',
    NPC_TRADER_STATS: 'voidfarer_npc_trader_stats',
    LAST_NPC_UPDATE: 'voidfarer_last_npc_update',
    
    // ===== MARKET DATA CLEANUP KEYS (NEW) =====
    LAST_CLEANUP: 'voidfarer_last_cleanup',
    CLEANUP_INTERVAL_DAYS: 7 // Run cleanup weekly
};

// ===== COMPLETE ELEMENT MASS DATABASE =====
const ELEMENT_MASS = {
    // Period 1
    'Hydrogen': 1.008, 'Helium': 4.003,
    // Period 2
    'Lithium': 6.94, 'Beryllium': 9.012, 'Boron': 10.81, 'Carbon': 12.011, 
    'Nitrogen': 14.007, 'Oxygen': 16.00, 'Fluorine': 19.00, 'Neon': 20.18,
    // Period 3
    'Sodium': 22.99, 'Magnesium': 24.31, 'Aluminum': 26.98, 'Silicon': 28.09,
    'Phosphorus': 30.97, 'Sulfur': 32.06, 'Chlorine': 35.45, 'Argon': 39.95,
    // Period 4
    'Potassium': 39.10, 'Calcium': 40.08, 'Scandium': 44.96, 'Titanium': 47.87,
    'Vanadium': 50.94, 'Chromium': 52.00, 'Manganese': 54.94, 'Iron': 55.85,
    'Cobalt': 58.93, 'Nickel': 58.69, 'Copper': 63.55, 'Zinc': 65.38,
    'Gallium': 69.72, 'Germanium': 72.63, 'Arsenic': 74.92, 'Selenium': 78.97,
    'Bromine': 79.90, 'Krypton': 83.80,
    // Period 5
    'Rubidium': 85.47, 'Strontium': 87.62, 'Yttrium': 88.91, 'Zirconium': 91.22,
    'Niobium': 92.91, 'Molybdenum': 95.95, 'Technetium': 98.0, 'Ruthenium': 101.1,
    'Rhodium': 102.9, 'Palladium': 106.4, 'Silver': 107.9, 'Cadmium': 112.4,
    'Indium': 114.8, 'Tin': 118.7, 'Antimony': 121.8, 'Tellurium': 127.6,
    'Iodine': 126.9, 'Xenon': 131.3,
    // Period 6
    'Cesium': 132.9, 'Barium': 137.3,
    'Lanthanum': 138.9, 'Cerium': 140.1, 'Praseodymium': 140.9, 'Neodymium': 144.2,
    'Promethium': 145.0, 'Samarium': 150.4, 'Europium': 152.0, 'Gadolinium': 157.3,
    'Terbium': 158.9, 'Dysprosium': 162.5, 'Holmium': 164.9, 'Erbium': 167.3,
    'Thulium': 168.9, 'Ytterbium': 173.0, 'Lutetium': 175.0,
    'Hafnium': 178.5, 'Tantalum': 180.9, 'Tungsten': 183.8, 'Rhenium': 186.2,
    'Osmium': 190.2, 'Iridium': 192.2, 'Platinum': 195.1, 'Gold': 197.0,
    'Mercury': 200.6, 'Thallium': 204.4, 'Lead': 207.2, 'Bismuth': 209.0,
    // Period 7
    'Polonium': 209.0, 'Astatine': 210.0, 'Radon': 222.0, 'Francium': 223.0,
    'Radium': 226.0, 'Actinium': 227.0, 'Thorium': 232.0, 'Protactinium': 231.0,
    'Uranium': 238.0,
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

// Helper to get cargo mass limit from window (defined in HTML) or use fallback
function getCargoMassLimit() {
    return typeof window.CARGO_MASS_LIMIT !== 'undefined' ? window.CARGO_MASS_LIMIT : 5000;
}

// ============================================================================
// PLAYER DATA
// ============================================================================

/**
 * Get player data
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Player object
 */
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
            playTime: 0,
            totalElementsCollected: 0,
            totalMaterialsCrafted: 0,
            totalCreditsEarned: 5000,
            totalDistanceTraveled: 0,
            totalWarps: 0,
            credits: 5000,
            cargoMassLimit: getCargoMassLimit(),
            
            // Crafting stats by field
            craftingStats: {
                alchemy: { totalCrafts: 0, level: 'Untrained' },
                metallurgy: { totalCrafts: 0, level: 'Untrained' },
                materialsScience: { totalCrafts: 0, level: 'Untrained' },
                pharmaceuticals: { totalCrafts: 0, level: 'Untrained' },
                textiles: { totalCrafts: 0, level: 'Untrained' },
                construction: { totalCrafts: 0, level: 'Untrained' },
                aerospace: { totalCrafts: 0, level: 'Untrained' },
                nuclear: { totalCrafts: 0, level: 'Untrained' },
                optical: { totalCrafts: 0, level: 'Untrained' },
                magnetic: { totalCrafts: 0, level: 'Untrained' },
                cryogenic: { totalCrafts: 0, level: 'Untrained' },
                polymers: { totalCrafts: 0, level: 'Untrained' }
            },
            
            // Owned products
            ownedProducts: [],
            
            // Planet ownership
            planetsOwned: 0,
            totalMiningEarnings: 0
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
// FIELD PROGRESSION
// ============================================================================

/**
 * Get progress for a specific field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @returns {Promise<Object>} Progress object
 */
export async function getFieldProgress(playerId, field) {
    try {
        const key = `${getFieldKey(field)}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error(`Error getting ${field} progress:`, error);
        return {};
    }
}

/**
 * Save progress for a specific field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {Object} progress - Progress object
 * @returns {Promise<boolean>} Success status
 */
export async function saveFieldProgress(playerId, field, progress) {
    try {
        const key = `${getFieldKey(field)}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(progress));
        return true;
    } catch (error) {
        console.error(`Error saving ${field} progress:`, error);
        return false;
    }
}

/**
 * Update progress for a specific recipe in a field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {string} recipeId - Recipe ID
 * @param {number} newProgress - New progress value
 * @returns {Promise<boolean>} Success status
 */
export async function updateFieldProgress(playerId, field, recipeId, newProgress) {
    try {
        const progress = await getFieldProgress(playerId, field);
        progress[recipeId] = newProgress;
        return await saveFieldProgress(playerId, field, progress);
    } catch (error) {
        console.error(`Error updating ${field} progress:`, error);
        return false;
    }
}

/**
 * Get field storage key
 * @param {string} field - Field name
 * @returns {string} Storage key
 */
function getFieldKey(field) {
    const fieldMap = {
        'alchemy': STORAGE_KEYS.ALCHEMY_PROGRESS,
        'metallurgy': STORAGE_KEYS.METALLURGY_PROGRESS,
        'materials-science': STORAGE_KEYS.MATERIALS_SCIENCE_PROGRESS,
        'materialsScience': STORAGE_KEYS.MATERIALS_SCIENCE_PROGRESS,
        'pharmaceuticals': STORAGE_KEYS.PHARMACEUTICALS_PROGRESS,
        'textiles': STORAGE_KEYS.TEXTILES_PROGRESS,
        'construction': STORAGE_KEYS.CONSTRUCTION_PROGRESS,
        'aerospace': STORAGE_KEYS.AEROSPACE_PROGRESS,
        'nuclear': STORAGE_KEYS.NUCLEAR_PROGRESS,
        'optical': STORAGE_KEYS.OPTICAL_PROGRESS,
        'magnetic': STORAGE_KEYS.MAGNETIC_PROGRESS,
        'cryogenic': STORAGE_KEYS.CRYOGENIC_PROGRESS,
        'polymers': STORAGE_KEYS.POLYMERS_PROGRESS
    };
    return fieldMap[field] || STORAGE_KEYS.ALCHEMY_PROGRESS;
}

// ============================================================================
// RECIPE UNLOCKS
// ============================================================================

/**
 * Get unlocked recipes for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Unlocked recipes by field
 */
export async function getUnlockedRecipes(playerId) {
    try {
        const key = `${STORAGE_KEYS.RECIPE_UNLOCKS}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting unlocked recipes:', error);
        return {};
    }
}

/**
 * Save unlocked recipes
 * @param {string} playerId - Player ID
 * @param {Object} unlocks - Unlocked recipes object
 * @returns {Promise<boolean>} Success status
 */
export async function saveUnlockedRecipes(playerId, unlocks) {
    try {
        const key = `${STORAGE_KEYS.RECIPE_UNLOCKS}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(unlocks));
        return true;
    } catch (error) {
        console.error('Error saving unlocked recipes:', error);
        return false;
    }
}

/**
 * Unlock a recipe for a player
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<boolean>} Success status
 */
export async function unlockRecipe(playerId, field, recipeId) {
    try {
        const unlocks = await getUnlockedRecipes(playerId);
        
        if (!unlocks[field]) {
            unlocks[field] = [];
        }
        
        if (!unlocks[field].includes(recipeId)) {
            unlocks[field].push(recipeId);
        }
        
        return await saveUnlockedRecipes(playerId, unlocks);
    } catch (error) {
        console.error('Error unlocking recipe:', error);
        return false;
    }
}

/**
 * Check if recipe is unlocked
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<boolean>} True if unlocked
 */
export async function isRecipeUnlocked(playerId, field, recipeId) {
    try {
        const unlocks = await getUnlockedRecipes(playerId);
        return unlocks[field]?.includes(recipeId) || false;
    } catch (error) {
        console.error('Error checking recipe unlock:', error);
        return false;
    }
}

// ============================================================================
// FIELD MASTERY
// ============================================================================

/**
 * Get field mastery levels
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Mastery levels by field
 */
export async function getFieldMastery(playerId) {
    try {
        const key = `${STORAGE_KEYS.FIELD_MASTERY}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting field mastery:', error);
        return {};
    }
}

/**
 * Save field mastery
 * @param {string} playerId - Player ID
 * @param {Object} mastery - Mastery object
 * @returns {Promise<boolean>} Success status
 */
export async function saveFieldMastery(playerId, mastery) {
    try {
        const key = `${STORAGE_KEYS.FIELD_MASTERY}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(mastery));
        return true;
    } catch (error) {
        console.error('Error saving field mastery:', error);
        return false;
    }
}

/**
 * Update mastery for a field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {Object} levelData - Level data (name, multiplier, progress)
 * @returns {Promise<boolean>} Success status
 */
export async function updateFieldMastery(playerId, field, levelData) {
    try {
        const mastery = await getFieldMastery(playerId);
        mastery[field] = {
            ...mastery[field],
            ...levelData,
            lastUpdated: Date.now()
        };
        return await saveFieldMastery(playerId, mastery);
    } catch (error) {
        console.error('Error updating field mastery:', error);
        return false;
    }
}

// ============================================================================
// CREDITS
// ============================================================================

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
        saveTimestamp();
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

// ============================================================================
// COLLECTION FUNCTIONS (Ship Cargo) - FIXED WITH LOCATION SAVING AND MARKET RECORD
// ============================================================================

/**
 * Get the player's collection (ship cargo)
 * @param {string} playerId - Player ID (optional, will use localStorage if not provided)
 * @returns {Promise<Object>} Collection object
 */
export async function getCollection(playerId = null) {
    try {
        // Get the actual player ID from localStorage if not provided
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        // Use EXACT same key format as addElementToCollection
        const key = `${STORAGE_KEYS.COLLECTION}_${actualPlayerId}`;
        console.log('🔍 Reading collection from key:', key);
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting collection:', error);
        return {};
    }
}

/**
 * Add elements to the player's collection (ship cargo)
 * @param {string} elementName - Name of element to add
 * @param {number} quantity - Quantity to add
 * @param {Object} metadata - Additional data (location, etc.)
 * @returns {Promise<Object>} Result object
 */
export async function addElementToCollection(elementName, quantity = 1, metadata = {}) {
    try {
        const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `${STORAGE_KEYS.COLLECTION}_${playerId}`;
        
        console.log('💾 Saving to key:', key);
        
        // Get current collection
        let collection = await getCollection(playerId);
        console.log('📦 Current collection before add:', collection);
        
        // Initialize if empty
        if (!collection[elementName]) {
            collection[elementName] = { count: 0 };
        }
        
        // Add quantity
        if (typeof collection[elementName] === 'object') {
            collection[elementName].count = (collection[elementName].count || 0) + quantity;
        } else {
            // Handle legacy format
            collection[elementName] = {
                count: (collection[elementName] || 0) + quantity
            };
        }
        
        // Save to localStorage
        localStorage.setItem(key, JSON.stringify(collection));
        
        // Verify it saved
        const saved = localStorage.getItem(key);
        console.log('✅ Verified saved data:', saved ? JSON.parse(saved) : 'null');
        
        console.log(`✅ Added ${quantity}x ${elementName} to cargo. New count: ${collection[elementName].count}`);
        
        // ===== FIX: Save location to IndexedDB if metadata contains planet info =====
        if (metadata && metadata.planet) {
            try {
                // Check if dbSaveElementLocation is available
                if (typeof window.dbSaveElementLocation === 'function') {
                    const locationData = {
                        planet: metadata.planet,
                        planetType: metadata.planetType || 'unknown',
                        quantity: quantity,
                        timestamp: metadata.timestamp || Date.now(),
                        discoveredDate: metadata.discoveredDate || new Date().toISOString(),
                        rarity: metadata.rarity || 'common',
                        value: metadata.value || 100
                    };
                    
                    await window.dbSaveElementLocation(elementName, metadata.planet, locationData);
                    console.log(`📍 Saved location for ${elementName} on ${metadata.planet}`);
                } else {
                    console.warn('dbSaveElementLocation not available, location not saved');
                }
            } catch (error) {
                console.error('❌ Error saving element location to IndexedDB:', error);
                // Don't fail the main operation if location saving fails
            }
        } else {
            console.log(`⚠️ No location data provided for ${elementName}, location not saved`);
        }
        
        // ===== RECORD TRADE FOR MARKET DYNAMICS =====
        // This updates supply/demand indices and affects real market prices
        if (window.recordTrade) {
            window.recordTrade(elementName, quantity, 'buy');
            console.log(`📈 Recorded trade: bought ${quantity}x ${elementName} for market dynamics`);
        } else {
            console.warn('⚠️ window.recordTrade not available - market dynamics not updated');
        }
        
        return {
            success: true,
            element: elementName,
            newCount: collection[elementName].count,
            added: quantity
        };
    } catch (error) {
        console.error('🔴 Error adding element to collection:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Remove elements from the player's collection (ship cargo)
 * @param {string} elementName - Name of element to remove
 * @param {number} quantity - Quantity to remove
 * @returns {Promise<Object>} Result object
 */
export async function removeElementFromCollection(elementName, quantity = 1) {
    try {
        const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `${STORAGE_KEYS.COLLECTION}_${playerId}`;
        
        const collection = await getCollection(playerId);
        
        if (!collection[elementName]) {
            return { success: false, error: 'Element not found' };
        }
        
        let currentCount;
        if (typeof collection[elementName] === 'object') {
            currentCount = collection[elementName].count || 0;
        } else {
            currentCount = collection[elementName];
        }
        
        if (currentCount < quantity) {
            return { 
                success: false, 
                error: 'Insufficient quantity',
                available: currentCount,
                required: quantity
            };
        }
        
        // Update count
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
        
        // ===== RECORD SELL TRADE FOR MARKET DYNAMICS =====
        if (window.recordTrade) {
            window.recordTrade(elementName, quantity, 'sell');
            console.log(`📈 Recorded trade: sold ${quantity}x ${elementName} for market dynamics`);
        }
        
        return {
            success: true,
            element: elementName,
            removed: quantity,
            remaining: currentCount - quantity
        };
    } catch (error) {
        console.error('Error removing element from collection:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// HUB INVENTORY FUNCTIONS
// ============================================================================

/**
 * Get hub inventory
 * @returns {Promise<Object>} Hub inventory object
 */
export async function getHubInventory() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.HUB_INVENTORY);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting hub inventory:', error);
        return {};
    }
}

/**
 * Add element to hub storage
 * @param {string} elementName - Element name
 * @param {number} quantity - Quantity to add
 * @returns {Promise<Object>} Result object
 */
export async function addElementToHub(elementName, quantity = 1) {
    try {
        const hubInventory = await getHubInventory();
        
        if (!hubInventory[elementName]) {
            hubInventory[elementName] = { count: 0, firstFound: Date.now() };
        }
        
        hubInventory[elementName].count = (hubInventory[elementName].count || 0) + quantity;
        
        localStorage.setItem(STORAGE_KEYS.HUB_INVENTORY, JSON.stringify(hubInventory));
        
        // Update used storage
        const used = await getCurrentHubUsed();
        localStorage.setItem(STORAGE_KEYS.HUB_STORAGE_USED, used.toString());
        
        return { success: true };
    } catch (error) {
        console.error('Error adding element to hub:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Remove element from hub storage
 * @param {string} elementName - Element name
 * @param {number} quantity - Quantity to remove
 * @returns {Promise<Object>} Result object
 */
export async function removeElementFromHub(elementName, quantity = 1) {
    try {
        const hubInventory = await getHubInventory();
        
        if (!hubInventory[elementName]) {
            return { success: false, error: 'Element not found' };
        }
        
        const currentCount = hubInventory[elementName].count || 0;
        
        if (currentCount < quantity) {
            return { 
                success: false, 
                error: 'Insufficient quantity',
                available: currentCount,
                required: quantity
            };
        }
        
        hubInventory[elementName].count = currentCount - quantity;
        
        if (hubInventory[elementName].count <= 0) {
            delete hubInventory[elementName];
        }
        
        localStorage.setItem(STORAGE_KEYS.HUB_INVENTORY, JSON.stringify(hubInventory));
        
        // Update used storage
        const used = await getCurrentHubUsed();
        localStorage.setItem(STORAGE_KEYS.HUB_STORAGE_USED, used.toString());
        
        return { success: true };
    } catch (error) {
        console.error('Error removing element from hub:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get current hub used storage
 * @returns {Promise<number>} Used storage in AMU
 */
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

/**
 * Get remaining hub storage
 * @returns {Promise<number>} Available storage in AMU
 */
export async function getRemainingHubStorage() {
    try {
        const max = parseInt(localStorage.getItem(STORAGE_KEYS.HUB_STORAGE_MAX)) || 0;
        const used = await getCurrentHubUsed();
        return Math.max(0, max - used);
    } catch (error) {
        return 0;
    }
}

/**
 * Get remaining ship storage
 * @returns {Promise<number>} Available ship cargo space in AMU
 */
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
 * Get current planet resources
 * @returns {Array} Planet resources
 */
export function getCurrentPlanetResources() {
    const resources = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES);
    return resources ? JSON.parse(resources) : [];
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
 * @param {string} starSector - Star sector name
 * @param {string} starSectorType - Star sector type
 * @param {number} starSectorStars - Number of stars
 * @param {number} starSectorX - X coordinate
 * @param {number} starSectorY - Y coordinate
 */
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

/**
 * Set current planet
 * @param {string} name - Planet name
 * @param {string} type - Planet type
 * @param {Array} resources - Planet resources
 */
export function setCurrentPlanet(name, type, resources) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_TYPE, type);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES, JSON.stringify(resources));
    
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

// ============================================================================
// WARP DATA
// ============================================================================

/**
 * Set warp data
 * @param {string} destination - Destination name
 * @param {string} returnPage - Return page URL
 * @param {number} cycles - Warp cycles
 * @param {number} distance - Distance in LY
 * @param {number} fuel - Fuel cost
 */
export function setWarpData(destination, returnPage, cycles, distance, fuel) {
    localStorage.setItem(STORAGE_KEYS.WARP_DESTINATION, destination);
    localStorage.setItem(STORAGE_KEYS.WARP_RETURN, returnPage);
    localStorage.setItem(STORAGE_KEYS.WARP_CYCLES, cycles.toString());
    if (distance) localStorage.setItem(STORAGE_KEYS.WARP_DISTANCE, distance.toString());
    if (fuel) localStorage.setItem(STORAGE_KEYS.WARP_FUEL, fuel.toString());
}

/**
 * Get warp data
 * @returns {Object} Warp data
 */
export function getWarpData() {
    return {
        destination: localStorage.getItem(STORAGE_KEYS.WARP_DESTINATION) || 'Unknown',
        returnPage: localStorage.getItem(STORAGE_KEYS.WARP_RETURN) || 'galaxy-map.html',
        cycles: parseInt(localStorage.getItem(STORAGE_KEYS.WARP_CYCLES)) || 1,
        distance: parseFloat(localStorage.getItem(STORAGE_KEYS.WARP_DISTANCE)) || 0,
        fuel: parseInt(localStorage.getItem(STORAGE_KEYS.WARP_FUEL)) || 0
    };
}

/**
 * Clear warp data
 */
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

/**
 * Get or create player ID
 * @returns {string} Player ID
 */
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

/**
 * Save timestamp of last save
 */
export function saveTimestamp() {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
}

// ============================================================================
// SETTINGS
// ============================================================================

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

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize storage
 * @param {string} playerId - Player ID
 */
export async function initializeStorage(playerId = 'main') {
    console.log('Initializing storage for player:', playerId);
    
    // Use the UNIVERSE_SEED from the HTML file
    if (!localStorage.getItem(STORAGE_KEYS.UNIVERSE_SEED) && typeof window.UNIVERSE_SEED !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.UNIVERSE_SEED, window.UNIVERSE_SEED.toString());
    }
    
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
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED, 'gentle');
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_MUSIC)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS_MUSIC, '50');
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS_AMBIENT)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS_AMBIENT, '50');
    }
    
    // Initialize crafting progression storage if not present
    const fieldKeys = [
        STORAGE_KEYS.ALCHEMY_PROGRESS,
        STORAGE_KEYS.METALLURGY_PROGRESS,
        STORAGE_KEYS.MATERIALS_SCIENCE_PROGRESS,
        STORAGE_KEYS.PHARMACEUTICALS_PROGRESS,
        STORAGE_KEYS.TEXTILES_PROGRESS,
        STORAGE_KEYS.CONSTRUCTION_PROGRESS,
        STORAGE_KEYS.AEROSPACE_PROGRESS,
        STORAGE_KEYS.NUCLEAR_PROGRESS,
        STORAGE_KEYS.OPTICAL_PROGRESS,
        STORAGE_KEYS.MAGNETIC_PROGRESS,
        STORAGE_KEYS.CRYOGENIC_PROGRESS,
        STORAGE_KEYS.POLYMERS_PROGRESS
    ];
    
    fieldKeys.forEach(key => {
        const playerKey = `${key}_${playerId}`;
        if (!localStorage.getItem(playerKey)) {
            localStorage.setItem(playerKey, '{}');
        }
    });
    
    // Initialize recipe unlocks
    const recipeKey = `${STORAGE_KEYS.RECIPE_UNLOCKS}_${playerId}`;
    if (!localStorage.getItem(recipeKey)) {
        localStorage.setItem(recipeKey, '{}');
    }
    
    // Initialize field mastery
    const masteryKey = `${STORAGE_KEYS.FIELD_MASTERY}_${playerId}`;
    if (!localStorage.getItem(masteryKey)) {
        localStorage.setItem(masteryKey, '{}');
    }
    
    // Initialize certificate holders storage
    const certKey = STORAGE_KEYS.CERTIFICATE_HOLDERS;
    if (!localStorage.getItem(certKey)) {
        localStorage.setItem(certKey, '{}');
    }
    
    // Initialize NPC trader storage
    const npcTradersKey = STORAGE_KEYS.NPC_TRADERS;
    if (!localStorage.getItem(npcTradersKey)) {
        localStorage.setItem(npcTradersKey, '{}');
    }
    
    const npcOrdersKey = STORAGE_KEYS.NPC_TRADER_ORDERS;
    if (!localStorage.getItem(npcOrdersKey)) {
        localStorage.setItem(npcOrdersKey, '{}');
    }
    
    const npcStatsKey = STORAGE_KEYS.NPC_TRADER_STATS;
    if (!localStorage.getItem(npcStatsKey)) {
        localStorage.setItem(npcStatsKey, JSON.stringify({
            totalTraders: 0,
            activeTraders: 0,
            totalOrders: 0,
            totalVolume: 0,
            lastUpdated: Date.now()
        }));
    }
    
    const lastUpdateKey = STORAGE_KEYS.LAST_NPC_UPDATE;
    if (!localStorage.getItem(lastUpdateKey)) {
        localStorage.setItem(lastUpdateKey, Date.now().toString());
    }
    
    // Initialize last cleanup timestamp
    const lastCleanupKey = STORAGE_KEYS.LAST_CLEANUP;
    if (!localStorage.getItem(lastCleanupKey)) {
        localStorage.setItem(lastCleanupKey, Date.now().toString());
    }
    
    // Initialize location if not set
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR)) {
        setCurrentLocation('Orion Arm', 'B2', 'Orion Molecular Cloud', 'Star-forming', 85, 30, 40);
    }
    
    console.log('Storage initialized for player:', playerId);
    
    // Check if cleanup is needed
    await checkAndRunCleanup();
}

// ============================================================================
// STORAGE CLEANUP FUNCTIONS (NEW)
// ============================================================================

/**
 * Check if cleanup is needed based on last cleanup timestamp
 * @returns {Promise<boolean>} True if cleanup was performed
 */
export async function checkAndRunCleanup() {
    try {
        const lastCleanup = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_CLEANUP)) || 0;
        const now = Date.now();
        const daysSinceCleanup = (now - lastCleanup) / (24 * 60 * 60 * 1000);
        
        if (daysSinceCleanup >= STORAGE_KEYS.CLEANUP_INTERVAL_DAYS) {
            console.log(`🧹 ${daysSinceCleanup.toFixed(1)} days since last cleanup, running storage cleanup...`);
            await runFullStorageCleanup();
            localStorage.setItem(STORAGE_KEYS.LAST_CLEANUP, now.toString());
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error checking cleanup:', error);
        return false;
    }
}

/**
 * Run full storage cleanup to prevent quota issues
 * @returns {Promise<Object>} Cleanup results
 */
export async function runFullStorageCleanup() {
    console.log('🧹 Running full storage cleanup...');
    
    const results = {
        marketData: 0,
        npcData: 0,
        historyData: 0,
        totalFreed: 0
    };
    
    try {
        // 1. Clean market data (prices, volume, history)
        const marketCleanup = await cleanupMarketData();
        results.marketData = marketCleanup.itemsRemoved;
        results.totalFreed += marketCleanup.bytesFreed;
        
        // 2. Clean NPC trader data (old orders, inactive traders)
        const npcCleanup = await cleanupNPCData();
        results.npcData = npcCleanup.itemsRemoved;
        results.totalFreed += npcCleanup.bytesFreed;
        
        // 3. Clean old history data (scan history, recent locations)
        const historyCleanup = await cleanupHistoryData();
        results.historyData = historyCleanup.itemsRemoved;
        results.totalFreed += historyCleanup.bytesFreed;
        
        // 4. Remove any orphaned keys
        const orphanedCleanup = await cleanupOrphanedKeys();
        results.orphanedRemoved = orphanedCleanup;
        
        console.log('✅ Storage cleanup complete:', results);
        
        return results;
        
    } catch (error) {
        console.error('Error during storage cleanup:', error);
        return results;
    }
}

/**
 * Clean up market data (prices, volume, orders)
 * @returns {Promise<Object>} Cleanup results
 */
export async function cleanupMarketData() {
    const itemsRemoved = 0;
    const bytesFreed = 0;
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    try {
        // Clean MARKET_HISTORY
        const history = localStorage.getItem(STORAGE_KEYS.MARKET_HISTORY);
        if (history) {
            try {
                const historyData = JSON.parse(history);
                if (Array.isArray(historyData)) {
                    const originalSize = history.length;
                    const filtered = historyData.filter(item => 
                        item.timestamp >= thirtyDaysAgo
                    );
                    if (filtered.length < historyData.length) {
                        localStorage.setItem(STORAGE_KEYS.MARKET_HISTORY, JSON.stringify(filtered));
                        console.log(`🧹 Market history: ${historyData.length - filtered.length} old records removed`);
                    }
                }
            } catch (e) {
                // If corrupted, remove it
                localStorage.removeItem(STORAGE_KEYS.MARKET_HISTORY);
                console.log('🧹 Removed corrupted market history');
            }
        }
        
        // Clean MARKET_VOLUME
        const volume = localStorage.getItem(STORAGE_KEYS.MARKET_VOLUME);
        if (volume) {
            try {
                const volumeData = JSON.parse(volume);
                let changed = false;
                
                Object.keys(volumeData).forEach(element => {
                    if (volumeData[element] && typeof volumeData[element] === 'object') {
                        Object.keys(volumeData[element]).forEach(date => {
                            if (new Date(date).getTime() < thirtyDaysAgo) {
                                delete volumeData[element][date];
                                changed = true;
                            }
                        });
                        
                        if (Object.keys(volumeData[element]).length === 0) {
                            delete volumeData[element];
                            changed = true;
                        }
                    }
                });
                
                if (changed) {
                    localStorage.setItem(STORAGE_KEYS.MARKET_VOLUME, JSON.stringify(volumeData));
                }
            } catch (e) {
                // If corrupted, remove it
                localStorage.removeItem(STORAGE_KEYS.MARKET_VOLUME);
            }
        }
        
        // Clean MARKET_ORDERS (keep only active orders)
        const orders = localStorage.getItem(STORAGE_KEYS.MARKET_ORDERS);
        if (orders) {
            try {
                const ordersData = JSON.parse(orders);
                if (typeof ordersData === 'object') {
                    let changed = false;
                    
                    Object.keys(ordersData).forEach(element => {
                        if (Array.isArray(ordersData[element])) {
                            const activeOrders = ordersData[element].filter(o => 
                                o.status === 'active' || o.status === 'partial'
                            );
                            if (activeOrders.length < ordersData[element].length) {
                                ordersData[element] = activeOrders;
                                changed = true;
                            }
                        }
                    });
                    
                    if (changed) {
                        localStorage.setItem(STORAGE_KEYS.MARKET_ORDERS, JSON.stringify(ordersData));
                    }
                }
            } catch (e) {
                // If corrupted, remove it
                localStorage.removeItem(STORAGE_KEYS.MARKET_ORDERS);
            }
        }
        
    } catch (error) {
        console.error('Error cleaning market data:', error);
    }
    
    return { itemsRemoved, bytesFreed };
}

/**
 * Clean up NPC trader data
 * @returns {Promise<Object>} Cleanup results
 */
export async function cleanupNPCData() {
    const itemsRemoved = 0;
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    try {
        // Clean NPC_TRADER_ORDERS - remove filled/cancelled orders older than 7 days
        const orders = localStorage.getItem(STORAGE_KEYS.NPC_TRADER_ORDERS);
        if (orders) {
            try {
                const ordersData = JSON.parse(orders);
                let changed = false;
                
                if (typeof ordersData === 'object') {
                    Object.keys(ordersData).forEach(element => {
                        if (Array.isArray(ordersData[element])) {
                            const recentOrders = ordersData[element].filter(o => 
                                o.status === 'active' || 
                                o.status === 'partial' ||
                                (o.status !== 'active' && o.status !== 'partial' && o.createdAt >= sevenDaysAgo)
                            );
                            if (recentOrders.length < ordersData[element].length) {
                                ordersData[element] = recentOrders;
                                changed = true;
                            }
                        }
                    });
                    
                    if (changed) {
                        localStorage.setItem(STORAGE_KEYS.NPC_TRADER_ORDERS, JSON.stringify(ordersData));
                    }
                }
            } catch (e) {
                // If corrupted, remove it
                localStorage.removeItem(STORAGE_KEYS.NPC_TRADER_ORDERS);
            }
        }
        
        // Clean NPC_TRADER_STATS - just keep latest
        // No cleanup needed, it's a single object
        
    } catch (error) {
        console.error('Error cleaning NPC data:', error);
    }
    
    return { itemsRemoved, bytesFreed: 0 };
}

/**
 * Clean up history data (scan history, recent locations)
 * @returns {Promise<Object>} Cleanup results
 */
export async function cleanupHistoryData() {
    const itemsRemoved = 0;
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    try {
        // Clean SCAN_HISTORY
        const scanHistory = localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
        if (scanHistory) {
            try {
                const scans = JSON.parse(scanHistory);
                if (Array.isArray(scans)) {
                    const recentScans = scans.filter(scan => 
                        scan.timestamp >= thirtyDaysAgo
                    );
                    if (recentScans.length < scans.length) {
                        localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(recentScans));
                        console.log(`🧹 Scan history: ${scans.length - recentScans.length} old records removed`);
                    }
                }
            } catch (e) {
                // If corrupted, remove it
                localStorage.removeItem(STORAGE_KEYS.SCAN_HISTORY);
            }
        }
        
        // Clean RECENT_LOCATIONS
        const recentLocs = localStorage.getItem(STORAGE_KEYS.RECENT_LOCATIONS);
        if (recentLocs) {
            try {
                const locations = JSON.parse(recentLocs);
                if (Array.isArray(locations)) {
                    const recent = locations.filter(loc => 
                        loc.timestamp >= thirtyDaysAgo
                    );
                    if (recent.length < locations.length) {
                        localStorage.setItem(STORAGE_KEYS.RECENT_LOCATIONS, JSON.stringify(recent));
                    }
                }
            } catch (e) {
                localStorage.removeItem(STORAGE_KEYS.RECENT_LOCATIONS);
            }
        }
        
    } catch (error) {
        console.error('Error cleaning history data:', error);
    }
    
    return { itemsRemoved, bytesFreed: 0 };
}

/**
 * Clean up orphaned keys (player-specific keys without player data)
 * @returns {Promise<number>} Number of orphaned keys removed
 */
export async function cleanupOrphanedKeys() {
    let removed = 0;
    const playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID) || 'player_default';
    
    try {
        const allKeys = Object.keys(localStorage);
        const playerKeys = allKeys.filter(key => 
            key.includes(playerId) && 
            !key.includes(STORAGE_KEYS.PLAYER) // Don't remove player data itself
        );
        
        // Check if player exists
        const playerKey = `${STORAGE_KEYS.PLAYER}_${playerId}`;
        const playerExists = localStorage.getItem(playerKey);
        
        if (!playerExists) {
            // No player data, remove all player-specific keys
            playerKeys.forEach(key => {
                localStorage.removeItem(key);
                removed++;
            });
            console.log(`🧹 Removed ${removed} orphaned keys (no player data)`);
        }
        
    } catch (error) {
        console.error('Error cleaning orphaned keys:', error);
    }
    
    return removed;
}

/**
 * Manual cleanup trigger for external use
 * @returns {Promise<Object>} Cleanup results
 */
export async function triggerManualCleanup() {
    console.log('🧹 Manual storage cleanup triggered');
    const results = await runFullStorageCleanup();
    localStorage.setItem(STORAGE_KEYS.LAST_CLEANUP, Date.now().toString());
    return results;
}

// ============================================================================
// RESET
// ============================================================================

/**
 * Reset all game data for a player
 * @param {string} playerId - Player ID
 */
export async function resetGame(playerId = 'main') {
    // Save settings to restore after reset
    const settings = {
        haptics: getHapticsEnabled(),
        autoGather: getAutoGatherEnabled(),
        orbitSpeed: getOrbitSpeed(),
        music: getMusicVolume(),
        ambient: getAmbientVolume()
    };
    
    // Clear all player-specific data
    const keysToRemove = [
        `${STORAGE_KEYS.PLAYER}_${playerId}`,
        `${STORAGE_KEYS.COLLECTION}_${playerId}`,
        `${STORAGE_KEYS.ELEMENT_INVENTORY}_${playerId}`,
        `${STORAGE_KEYS.MATERIAL_INVENTORY}_${playerId}`,
        `${STORAGE_KEYS.MATERIAL_QUALITY}_${playerId}`,
        `${STORAGE_KEYS.ALCHEMY_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.METALLURGY_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.MATERIALS_SCIENCE_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.PHARMACEUTICALS_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.TEXTILES_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.CONSTRUCTION_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.AEROSPACE_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.NUCLEAR_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.OPTICAL_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.MAGNETIC_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.CRYOGENIC_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.POLYMERS_PROGRESS}_${playerId}`,
        `${STORAGE_KEYS.RECIPE_UNLOCKS}_${playerId}`,
        `${STORAGE_KEYS.FIELD_MASTERY}_${playerId}`,
        `${STORAGE_KEYS.PLAYER_PRODUCTS}_${playerId}`,
        `${STORAGE_KEYS.PLAYER_LABOR_EARNINGS}_${playerId}`,
        STORAGE_KEYS.CREDITS,
        STORAGE_KEYS.SHIP_FUEL,
        STORAGE_KEYS.SHIP_POWER,
        STORAGE_KEYS.SHIP_UPGRADES,
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
        STORAGE_KEYS.COLONIES,
        STORAGE_KEYS.DISCOVERED_LOCATIONS,
        STORAGE_KEYS.SCAN_HISTORY,
        STORAGE_KEYS.HUB_INVENTORY,
        STORAGE_KEYS.PLANET_CLAIMS,
        STORAGE_KEYS.PLAYER_CLAIMS,
        STORAGE_KEYS.CLAIM_HISTORY,
        STORAGE_KEYS.CLAIM_NOTIFICATIONS,
        STORAGE_KEYS.CERTIFICATE_HOLDERS
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Restore settings
    setHapticsEnabled(settings.haptics);
    setAutoGatherEnabled(settings.autoGather);
    setOrbitSpeed(settings.orbitSpeed);
    setMusicVolume(settings.music);
    setAmbientVolume(settings.ambient);
    
    // Re-initialize
    await initializeStorage(playerId);
}

// ============================================================================
// SETTINGS (additional)
// ============================================================================

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

/**
 * Save market data (prices, history, etc.)
 * @param {Object} marketData - Market data to save
 * @returns {Promise<boolean>} Success status
 */
export async function saveMarketData(marketData) {
    try {
        const key = STORAGE_KEYS.MARKET_PRICES;
        localStorage.setItem(key, JSON.stringify(marketData));
        return true;
    } catch (error) {
        console.error('Error saving market data:', error);
        return false;
    }
}

/**
 * Load market data
 * @returns {Promise<Object>} Market data
 */
export async function loadMarketData() {
    try {
        const key = STORAGE_KEYS.MARKET_PRICES;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error loading market data:', error);
        return null;
    }
}

// ============================================================================
// ORDER BOOK PERSISTENCE
// ============================================================================

/**
 * Save order book data
 * @param {Object} orderBookData - Order book to save
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success status
 */
export async function saveOrderBook(orderBookData, playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `${STORAGE_KEYS.MARKET_ORDERS}_${actualPlayerId}`;
        localStorage.setItem(key, JSON.stringify(orderBookData));
        return true;
    } catch (error) {
        console.error('Error saving order book:', error);
        return false;
    }
}

/**
 * Load order book data
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Order book data
 */
export async function loadOrderBook(playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `${STORAGE_KEYS.MARKET_ORDERS}_${actualPlayerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error loading order book:', error);
        return null;
    }
}

// ============================================================================
// PORTFOLIO PERSISTENCE
// ============================================================================

/**
 * Save portfolio data
 * @param {Object} portfolioData - Portfolio to save
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success status
 */
export async function savePortfolio(portfolioData, playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `voidfarer_portfolio_${actualPlayerId}`;
        localStorage.setItem(key, JSON.stringify(portfolioData));
        return true;
    } catch (error) {
        console.error('Error saving portfolio:', error);
        return false;
    }
}

/**
 * Load portfolio data
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Portfolio data
 */
export async function loadPortfolio(playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `voidfarer_portfolio_${actualPlayerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error loading portfolio:', error);
        return null;
    }
}

// ============================================================================
// TRADE HISTORY PERSISTENCE
// ============================================================================

/**
 * Save trade history
 * @param {Array} trades - Trade history array
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success status
 */
export async function saveTradeHistory(trades, playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `voidfarer_trades_${actualPlayerId}`;
        localStorage.setItem(key, JSON.stringify(trades));
        return true;
    } catch (error) {
        console.error('Error saving trade history:', error);
        return false;
    }
}

/**
 * Load trade history
 * @param {string} playerId - Player ID
 * @returns {Promise<Array>} Trade history array
 */
export async function loadTradeHistory(playerId = null) {
    try {
        const actualPlayerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        const key = `voidfarer_trades_${actualPlayerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error loading trade history:', error);
        return [];
    }
}

// ============================================================================
// NPC TRADER FUNCTIONS
// ============================================================================

/**
 * Save all NPC traders
 * @param {Object} traders - NPC traders object keyed by ID
 * @returns {Promise<boolean>} Success status
 */
export async function saveNPCTraders(traders) {
    try {
        const key = STORAGE_KEYS.NPC_TRADERS;
        localStorage.setItem(key, JSON.stringify(traders));
        
        // Update stats
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

/**
 * Load all NPC traders
 * @returns {Promise<Object>} NPC traders object
 */
export async function loadNPCTraders() {
    try {
        const key = STORAGE_KEYS.NPC_TRADERS;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error loading NPC traders:', error);
        return {};
    }
}

/**
 * Save a single NPC trader
 * @param {string} traderId - NPC trader ID
 * @param {Object} traderData - Trader data
 * @returns {Promise<boolean>} Success status
 */
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

/**
 * Load a single NPC trader
 * @param {string} traderId - NPC trader ID
 * @returns {Promise<Object|null>} Trader data or null
 */
export async function loadNPCTrader(traderId) {
    try {
        const traders = await loadNPCTraders();
        return traders[traderId] || null;
    } catch (error) {
        console.error('Error loading NPC trader:', error);
        return null;
    }
}

/**
 * Save all NPC trader orders
 * @param {Object} orders - NPC orders object (could be keyed by element or order ID)
 * @returns {Promise<boolean>} Success status
 */
export async function saveNPCOrders(orders) {
    try {
        const key = STORAGE_KEYS.NPC_TRADER_ORDERS;
        localStorage.setItem(key, JSON.stringify(orders));
        
        // Update stats
        const stats = await loadNPCStats();
        
        // Count total orders (flatten if needed)
        let totalOrders = 0;
        if (typeof orders === 'object') {
            if (Array.isArray(orders)) {
                totalOrders = orders.length;
            } else {
                // Could be nested by element
                for (const element in orders) {
                    if (Array.isArray(orders[element])) {
                        totalOrders += orders[element].length;
                    }
                }
            }
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

/**
 * Load all NPC trader orders
 * @returns {Promise<Object>} NPC orders object
 */
export async function loadNPCOrders() {
    try {
        const key = STORAGE_KEYS.NPC_TRADER_ORDERS;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error loading NPC orders:', error);
        return {};
    }
}

/**
 * Save NPC trader stats
 * @param {Object} stats - NPC stats object
 * @returns {Promise<boolean>} Success status
 */
export async function saveNPCStats(stats) {
    try {
        const key = STORAGE_KEYS.NPC_TRADER_STATS;
        localStorage.setItem(key, JSON.stringify(stats));
        return true;
    } catch (error) {
        console.error('Error saving NPC stats:', error);
        return false;
    }
}

/**
 * Load NPC trader stats
 * @returns {Promise<Object>} NPC stats object
 */
export async function loadNPCStats() {
    try {
        const key = STORAGE_KEYS.NPC_TRADER_STATS;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {
            totalTraders: 0,
            activeTraders: 0,
            totalOrders: 0,
            totalVolume: 0,
            lastUpdated: Date.now()
        };
    } catch (error) {
        console.error('Error loading NPC stats:', error);
        return {
            totalTraders: 0,
            activeTraders: 0,
            totalOrders: 0,
            totalVolume: 0,
            lastUpdated: Date.now()
        };
    }
}

/**
 * Get last NPC update timestamp
 * @returns {Promise<number>} Timestamp
 */
export async function getLastNPCUpdate() {
    try {
        const key = STORAGE_KEYS.LAST_NPC_UPDATE;
        const saved = localStorage.getItem(key);
        return saved ? parseInt(saved) : 0;
    } catch (error) {
        console.error('Error getting last NPC update:', error);
        return 0;
    }
}

/**
 * Set last NPC update timestamp
 * @param {number} timestamp - Update timestamp
 * @returns {Promise<boolean>} Success status
 */
export async function setLastNPCUpdate(timestamp = Date.now()) {
    try {
        const key = STORAGE_KEYS.LAST_NPC_UPDATE;
        localStorage.setItem(key, timestamp.toString());
        return true;
    } catch (error) {
        console.error('Error setting last NPC update:', error);
        return false;
    }
}

/**
 * Update NPC trader after trade
 * @param {string} traderId - NPC trader ID
 * @param {Object} tradeData - Trade data (element, quantity, price, side)
 * @returns {Promise<boolean>} Success status
 */
export async function updateNPCTraderAfterTrade(traderId, tradeData) {
    try {
        const trader = await loadNPCTrader(traderId);
        if (!trader) return false;
        
        // Update credits
        const total = tradeData.quantity * tradeData.price;
        if (tradeData.side === 'sell') {
            // Sold elements, gain credits
            trader.credits += total;
            
            // Remove from inventory
            if (trader.inventory[tradeData.element]) {
                trader.inventory[tradeData.element] -= tradeData.quantity;
                if (trader.inventory[tradeData.element] <= 0) {
                    delete trader.inventory[tradeData.element];
                }
            }
        } else {
            // Bought elements, spend credits
            trader.credits -= total;
            
            // Add to inventory
            if (!trader.inventory[tradeData.element]) {
                trader.inventory[tradeData.element] = 0;
            }
            trader.inventory[tradeData.element] += tradeData.quantity;
        }
        
        // Update last activity
        trader.lastActivity = Date.now();
        
        // Update stats
        trader.totalTrades = (trader.totalTrades || 0) + 1;
        trader.totalVolume = (trader.totalVolume || 0) + total;
        
        // Save trader
        await saveNPCTrader(traderId, trader);
        
        // Update global stats
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

/**
 * Get all certificate holders
 * @param {string} certificateId - Optional specific certificate
 * @returns {Object|Array} Certificate holders data
 */
export async function getCertificateHolders(certificateId = null) {
    try {
        const key = STORAGE_KEYS.CERTIFICATE_HOLDERS;
        const saved = localStorage.getItem(key);
        const holders = saved ? JSON.parse(saved) : {};
        
        if (certificateId) {
            return holders[certificateId] || [];
        }
        return holders;
    } catch (error) {
        console.error('Error getting certificate holders:', error);
        return certificateId ? [] : {};
    }
}

/**
 * Update certificate holder mastery
 * @param {string} playerId - Player ID
 * @param {string} playerName - Player name
 * @param {string} certificateId - Certificate ID
 * @param {number} masteryLevel - Mastery level (1-10)
 * @returns {Promise<boolean>} Success status
 */
export async function updateCertificateHolder(playerId, playerName, certificateId, masteryLevel) {
    try {
        const key = STORAGE_KEYS.CERTIFICATE_HOLDERS;
        const saved = localStorage.getItem(key);
        const holders = saved ? JSON.parse(saved) : {};
        
        if (!holders[certificateId]) {
            holders[certificateId] = [];
        }
        
        // Find existing entry
        const existingIndex = holders[certificateId].findIndex(h => h.playerId === playerId);
        const holderData = {
            playerId,
            playerName,
            masteryLevel,
            lastUpdated: Date.now()
        };
        
        if (existingIndex >= 0) {
            holders[certificateId][existingIndex] = holderData;
        } else {
            holders[certificateId].push(holderData);
        }
        
        localStorage.setItem(key, JSON.stringify(holders));
        return true;
    } catch (error) {
        console.error('Error updating certificate holder:', error);
        return false;
    }
}

/**
 * Add labor earnings to a player's unclaimed balance
 * @param {string} playerId - Player ID
 * @param {number} amount - Amount to add
 * @returns {Promise<boolean>} Success status
 */
export async function addPlayerLaborEarnings(playerId, amount) {
    try {
        const key = STORAGE_KEYS.PLAYER_LABOR_EARNINGS;
        const saved = localStorage.getItem(key);
        const earnings = saved ? JSON.parse(saved) : {};
        
        if (!earnings[playerId]) {
            earnings[playerId] = 0;
        }
        
        earnings[playerId] += amount;
        localStorage.setItem(key, JSON.stringify(earnings));
        return true;
    } catch (error) {
        console.error('Error adding player labor earnings:', error);
        return false;
    }
}

/**
 * Get player's unclaimed labor earnings
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Unclaimed earnings
 */
export async function getPlayerLaborEarnings(playerId) {
    try {
        const key = STORAGE_KEYS.PLAYER_LABOR_EARNINGS;
        const saved = localStorage.getItem(key);
        const earnings = saved ? JSON.parse(saved) : {};
        return earnings[playerId] || 0;
    } catch (error) {
        console.error('Error getting player labor earnings:', error);
        return 0;
    }
}

/**
 * Claim player's labor earnings
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Amount claimed
 */
export async function claimPlayerLaborEarnings(playerId) {
    try {
        const key = STORAGE_KEYS.PLAYER_LABOR_EARNINGS;
        const saved = localStorage.getItem(key);
        const earnings = saved ? JSON.parse(saved) : {};
        
        const amount = earnings[playerId] || 0;
        if (amount > 0) {
            delete earnings[playerId];
            localStorage.setItem(key, JSON.stringify(earnings));
            
            // Add to player credits
            await addCredits(amount, playerId);
        }
        
        return amount;
    } catch (error) {
        console.error('Error claiming player labor earnings:', error);
        return 0;
    }
}

// ============================================================================
// ELEMENT LOCATIONS FUNCTIONS (ADDED FOR JOURNAL)
// ============================================================================

/**
 * Get all locations where a specific element was found
 * @param {string} elementName - Name of the element
 * @returns {Promise<Array>} Array of location objects
 */
export async function getElementLocations(elementName) {
    try {
        // Try to use IndexedDB first if available
        if (typeof window.dbGetElementLocations === 'function') {
            return await window.dbGetElementLocations(elementName);
        }
        
        // Fallback: Check localStorage for scan history
        const scanHistory = localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
        if (scanHistory) {
            const scans = JSON.parse(scanHistory);
            return scans.filter(scan => scan.element === elementName).map(scan => ({
                planet: scan.planet,
                planetType: scan.planetType || 'unknown',
                discoveredAt: scan.timestamp || Date.now(),
                discoveredDate: scan.date || new Date().toISOString(),
                quantity: scan.quantity || 1
            }));
        }
        
        return [];
    } catch (error) {
        console.error('Error getting element locations:', error);
        return [];
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Named exports - each function is already exported with 'export' keyword
// So we don't need a separate named exports block

// Default export for backward compatibility
export default {
    // Constants
    STORAGE_KEYS,
    ELEMENT_MASS,
    
    // Player
    getPlayer,
    savePlayer,
    createDefaultPlayer,
    getPlayerId,
    
    // Field progression
    getFieldProgress,
    saveFieldProgress,
    updateFieldProgress,
    
    // Recipe unlocks
    getUnlockedRecipes,
    saveUnlockedRecipes,
    unlockRecipe,
    isRecipeUnlocked,
    
    // Field mastery
    getFieldMastery,
    saveFieldMastery,
    updateFieldMastery,
    
    // Cargo
    getElementMass,
    
    // Collection (Ship Cargo)
    getCollection,
    addElementToCollection,
    removeElementFromCollection,
    
    // Hub Storage
    getHubInventory,
    addElementToHub,
    removeElementFromHub,
    getRemainingHubStorage,
    getRemainingShipStorage,
    
    // Credits
    getCredits,
    saveCredits,
    addCredits,
    spendCredits,
    
    // Certificate holders
    getCertificateHolders,
    updateCertificateHolder,
    addPlayerLaborEarnings,
    getPlayerLaborEarnings,
    claimPlayerLaborEarnings,
    
    // NPC Trader Functions
    saveNPCTraders,
    loadNPCTraders,
    saveNPCTrader,
    loadNPCTrader,
    saveNPCOrders,
    loadNPCOrders,
    saveNPCStats,
    loadNPCStats,
    getLastNPCUpdate,
    setLastNPCUpdate,
    updateNPCTraderAfterTrade,
    
    // Location
    isAtEarth,
    getCurrentPlanetName,
    getCurrentPlanetType,
    getCurrentPlanetResources,
    getCurrentSector,
    getCurrentRegion,
    setCurrentLocation,
    setCurrentPlanet,
    
    // Ship
    getShipFuel,
    saveShipFuel,
    getShipPower,
    saveShipPower,
    
    // Warp
    setWarpData,
    getWarpData,
    clearWarpData,
    
    // Settings
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
    
    // Market Data
    saveMarketData,
    loadMarketData,
    saveOrderBook,
    loadOrderBook,
    savePortfolio,
    loadPortfolio,
    saveTradeHistory,
    loadTradeHistory,
    
    // Element Locations
    getElementLocations,
    
    // System
    initializeStorage,
    resetGame,
    saveTimestamp,
    
    // NEW: Cleanup functions
    checkAndRunCleanup,
    runFullStorageCleanup,
    triggerManualCleanup,
    cleanupMarketData,
    cleanupNPCData,
    cleanupHistoryData
};

// ============================================================================
// EXPOSE FUNCTIONS TO WINDOW
// ============================================================================
// Make all commonly used functions available globally for non-module scripts

// Player functions
window.getPlayer = getPlayer;
window.savePlayer = savePlayer;

// Collection functions
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

// Credit functions
window.getCredits = getCredits;
window.saveCredits = saveCredits;
window.addCredits = addCredits;
window.spendCredits = spendCredits;

// Ship functions
window.getShipFuel = getShipFuel;
window.saveShipFuel = saveShipFuel;
window.getShipPower = getShipPower;
window.saveShipPower = saveShipPower;

// Location functions
window.getCurrentPlanetName = getCurrentPlanetName;
window.getCurrentPlanetType = getCurrentPlanetType;
window.getCurrentPlanetResources = getCurrentPlanetResources;
window.getCurrentSector = getCurrentSector;
window.getCurrentRegion = getCurrentRegion;
window.setCurrentLocation = setCurrentLocation;
window.setCurrentPlanet = setCurrentPlanet;

// Certificate holder functions
window.getCertificateHolders = getCertificateHolders;
window.updateCertificateHolder = updateCertificateHolder;
window.addPlayerLaborEarnings = addPlayerLaborEarnings;
window.getPlayerLaborEarnings = getPlayerLaborEarnings;
window.claimPlayerLaborEarnings = claimPlayerLaborEarnings;

// NPC Trader Functions
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

// Market data functions
window.saveMarketData = saveMarketData;
window.loadMarketData = loadMarketData;
window.saveOrderBook = saveOrderBook;
window.loadOrderBook = loadOrderBook;
window.savePortfolio = savePortfolio;
window.loadPortfolio = loadPortfolio;
window.saveTradeHistory = saveTradeHistory;
window.loadTradeHistory = loadTradeHistory;

// Element locations function
window.getElementLocations = getElementLocations;

// NEW: Cleanup functions
window.triggerManualCleanup = triggerManualCleanup;
window.runFullStorageCleanup = runFullStorageCleanup;

console.log('✅ storage.js fully loaded with NPC trader support and storage cleanup functions');

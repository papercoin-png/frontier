// js/storage/storage.js - Save/load player progress for Voidfarer
// Using IndexedDB via db.js for unlimited storage with mass-based cargo
// UPDATED: Added material inventory, recipe unlocks, skill progression across all fields

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
    
    // Crafting recipes unlocked (new)
    RECIPE_UNLOCKS: 'voidfarer_recipe_unlocks',
    
    // Field mastery levels (new)
    FIELD_MASTERY: 'voidfarer_field_mastery'
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

function getElementMass(elementName) {
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
// FIELD PROGRESSION (NEW)
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
// RECIPE UNLOCKS (NEW)
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
// FIELD MASTERY (NEW)
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
// CARGO MASS UTILITIES
// ============================================================================

/**
 * Get total cargo mass
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Total mass
 */
export async function getTotalCargoMass(playerId = 'main') {
    try {
        // Import dynamically to avoid circular dependency
        const { getElementInventory, getMaterialInventory } = await import('./inventory.js');
        
        const elements = await getElementInventory(playerId);
        const materials = await getMaterialInventory(playerId);
        
        let totalMass = 0;
        
        // Calculate element mass
        for (const [name, data] of Object.entries(elements)) {
            const count = typeof data === 'object' ? data.count : data;
            totalMass += count * getElementMass(name);
        }
        
        // Calculate material mass (materials have their own mass)
        for (const [materialId, data] of Object.entries(materials)) {
            // Default material mass - could be customized per material
            totalMass += data.count * 10; // Placeholder: 10 AMU per material unit
        }
        
        return totalMass;
    } catch (error) {
        console.error('Error calculating total cargo mass:', error);
        return 0;
    }
}

/**
 * Get remaining cargo mass
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Remaining mass
 */
export async function getRemainingCargoMass(playerId = 'main') {
    try {
        const totalMass = await getTotalCargoMass(playerId);
        const player = await getPlayer(playerId);
        const massLimit = player?.cargoMassLimit || getCargoMassLimit();
        return Math.max(0, massLimit - totalMass);
    } catch (error) {
        console.error('Error calculating remaining cargo mass:', error);
        return getCargoMassLimit();
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
    
    // Initialize location if not set
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR)) {
        setCurrentLocation('Orion Arm', 'B2', 'Orion Molecular Cloud', 'Star-forming', 85, 30, 40);
    }
    
    console.log('Storage initialized for player:', playerId);
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
        STORAGE_KEYS.CLAIM_NOTIFICATIONS
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
// EXPORTS
// ============================================================================

// Named exports - ADDED getElementMass here!
export {
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
    getTotalCargoMass,
    getRemainingCargoMass,
    getElementMass,  // <-- THIS WAS MISSING! Now added.
    
    // Credits
    getCredits,
    saveCredits,
    addCredits,
    spendCredits,
    
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
    
    // System
    initializeStorage,
    resetGame,
    saveTimestamp
};

// Also keep the default export for backward compatibility
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
    getTotalCargoMass,
    getRemainingCargoMass,
    getElementMass,
    
    // Credits
    getCredits,
    saveCredits,
    addCredits,
    spendCredits,
    
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
    
    // System
    initializeStorage,
    resetGame,
    saveTimestamp
};

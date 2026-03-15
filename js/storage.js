// js/storage.js - Save/load player progress for Voidfarer
// Using IndexedDB via db.js for unlimited storage with mass-based cargo

// ===== CONSTANTS =====
// CARGO_MASS_LIMIT is now defined in the HTML files to avoid duplicate declaration
// We'll use the value from window or fallback to 5000

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    PLAYER: 'voidfarer_player',
    COLLECTION: 'voidfarer_collection',
    MISSIONS: 'voidfarer_missions',
    COMPLETED_MISSIONS: 'voidfarer_completed_missions',
    CREDITS: 'voidfarer_credits',
    UNIVERSE_SEED: 'voidfarer_universe_seed',
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
    WARP_DESTINATION: 'voidfarer_warp_destination',
    WARP_RETURN: 'voidfarer_warp_return',
    WARP_CYCLES: 'voidfarer_warp_cycles',
    WARP_DISTANCE: 'voidfarer_warp_distance',
    WARP_FUEL: 'voidfarer_warp_fuel',
    COLONIES: 'voidfarer_colonies',
    DISCOVERED_LOCATIONS: 'voidfarer_discovered_locations',
    BOOKMARKS: 'voidfarer_bookmarks',
    RECENT_LOCATIONS: 'voidfarer_recent_locations',
    SCAN_HISTORY: 'voidfarer_scan_history',
    SHIP_POWER: 'voidfarer_ship_power',
    SHIP_UPGRADES: 'voidfarer_ship_upgrades',
    SHIP_FUEL: 'voidfarer_ship_fuel',
    SETTINGS_HAPTICS: 'voidfarer_haptics',
    SETTINGS_AUTO_GATHER: 'voidfarer_auto_gather',
    SETTINGS_ORBIT_SPEED: 'voidfarer_orbit_speed',
    SETTINGS_MUSIC: 'voidfarer_music',
    SETTINGS_AMBIENT: 'voidfarer_ambient',
    PLAYER_STATS: 'voidfarer_player_stats',
    ACHIEVEMENTS: 'voidfarer_achievements',
    LAST_SAVE: 'voidfarer_last_save',
    REAL_ESTATE: 'voidfarer_real_estate',
    TOTAL_MONEY_SUPPLY: 'voidfarer_total_money_supply',
    DAILY_METRICS: 'voidfarer_daily_metrics',
    HOURLY_SNAPSHOTS: 'voidfarer_hourly_snapshots',
    TAX_RATES: 'voidfarer_tax_rates',
    TAX_HISTORY: 'voidfarer_tax_history',
    COMMUNITY_FUND: 'voidfarer_community_fund',
    ACTIVE_EVENTS: 'voidfarer_active_events',
    EVENT_HISTORY: 'voidfarer_event_history',
    CLAIMED_PLANETS: 'voidfarer_claimed_planets',
    // ALCHEMY KEYS
    ALCHEMY_PROGRESS: 'voidfarer_alchemy_progress',
    ALCHEMY_RECIPES_UNLOCKED: 'voidfarer_alchemy_recipes_unlocked',
    ALCHEMY_TOTAL_CRAFTS: 'voidfarer_alchemy_total_crafts',
    // WARP DESTINATION KEYS
    WARP_DESTINATION_PLANET: 'voidfarer_warp_destination_planet',
    WARP_DESTINATION_PLANET_TYPE: 'voidfarer_warp_destination_planet_type',
    WARP_ORIGIN_PLANET: 'voidfarer_warp_origin_planet',
    WARP_ORIGIN_STAR: 'voidfarer_warp_origin_star',
    WARP_ORIGIN_STAR_SECTOR: 'voidfarer_warp_origin_starSector',
    WARP_ORIGIN_REGION: 'voidfarer_warp_origin_region',
    WARP_ORIGIN_SECTOR: 'voidfarer_warp_origin_sector'
};

// ===== COMPLETE ELEMENT MASS DATABASE (ALL 118 ELEMENTS) =====
const ELEMENT_MASS = {
    // Period 1 (Common)
    'Hydrogen': 1.008, 'Helium': 4.003,
    
    // Period 2 (Common)
    'Lithium': 6.94, 'Beryllium': 9.012, 'Boron': 10.81, 'Carbon': 12.011, 
    'Nitrogen': 14.007, 'Oxygen': 16.00, 'Fluorine': 19.00, 'Neon': 20.18,
    
    // Period 3 (Common)
    'Sodium': 22.99, 'Magnesium': 24.31, 'Aluminum': 26.98, 'Silicon': 28.09,
    'Phosphorus': 30.97, 'Sulfur': 32.06, 'Chlorine': 35.45, 'Argon': 39.95,
    
    // Period 4 (Common - Transition Metals)
    'Potassium': 39.10, 'Calcium': 40.08, 'Scandium': 44.96, 'Titanium': 47.87,
    'Vanadium': 50.94, 'Chromium': 52.00, 'Manganese': 54.94, 'Iron': 55.85,
    'Cobalt': 58.93, 'Nickel': 58.69, 'Copper': 63.55, 'Zinc': 65.38,
    'Gallium': 69.72, 'Germanium': 72.63, 'Arsenic': 74.92, 'Selenium': 78.97,
    'Bromine': 79.90, 'Krypton': 83.80,
    
    // Period 5 (Common - Transition Metals)
    'Rubidium': 85.47, 'Strontium': 87.62, 'Yttrium': 88.91, 'Zirconium': 91.22,
    'Niobium': 92.91, 'Molybdenum': 95.95, 'Technetium': 98.0, 'Ruthenium': 101.1,
    'Rhodium': 102.9, 'Palladium': 106.4, 'Silver': 107.9, 'Cadmium': 112.4,
    'Indium': 114.8, 'Tin': 118.7, 'Antimony': 121.8, 'Tellurium': 127.6,
    'Iodine': 126.9, 'Xenon': 131.3,
    
    // Period 6 (Common - includes Lanthanides)
    'Cesium': 132.9, 'Barium': 137.3,
    // Lanthanides (Rare Earths)
    'Lanthanum': 138.9, 'Cerium': 140.1, 'Praseodymium': 140.9, 'Neodymium': 144.2,
    'Promethium': 145.0, 'Samarium': 150.4, 'Europium': 152.0, 'Gadolinium': 157.3,
    'Terbium': 158.9, 'Dysprosium': 162.5, 'Holmium': 164.9, 'Erbium': 167.3,
    'Thulium': 168.9, 'Ytterbium': 173.0, 'Lutetium': 175.0,
    // Transition Metals
    'Hafnium': 178.5, 'Tantalum': 180.9, 'Tungsten': 183.8, 'Rhenium': 186.2,
    'Osmium': 190.2, 'Iridium': 192.2, 'Platinum': 195.1, 'Gold': 197.0,
    'Mercury': 200.6, 'Thallium': 204.4, 'Lead': 207.2, 'Bismuth': 209.0,
    
    // Period 7 (Very Rare to Legendary)
    // Very Rare
    'Polonium': 209.0, 'Astatine': 210.0, 'Radon': 222.0, 'Francium': 223.0,
    'Radium': 226.0, 'Actinium': 227.0, 'Thorium': 232.0, 'Protactinium': 231.0,
    'Uranium': 238.0,
    // Legendary (Transuranic)
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

// ===== CARGO MASS UTILITIES =====
async function getTotalCargoMass() {
    try {
        const collection = await getCollection();
        let totalMass = 0;
        for (const [name, data] of Object.entries(collection)) {
            const count = data.count || 1;
            totalMass += count * getElementMass(name);
        }
        return totalMass;
    } catch (error) {
        console.error('Error calculating total cargo mass:', error);
        return 0;
    }
}

async function getRemainingCargoMass() {
    try {
        const totalMass = await getTotalCargoMass();
        const player = await getPlayer();
        const massLimit = player?.cargoMassLimit || getCargoMassLimit();
        return Math.max(0, massLimit - totalMass);
    } catch (error) {
        console.error('Error calculating remaining cargo mass:', error);
        return getCargoMassLimit();
    }
}

// ===== CURRENT PLANET HELPERS =====
function getCurrentPlanetName() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Unknown';
}

function getCurrentPlanetType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_TYPE) || 'unknown';
}

function getCurrentPlanetResources() {
    const resources = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES);
    return resources ? JSON.parse(resources) : [];
}

// ===== ALCHEMY PROGRESS FUNCTIONS =====
function getAlchemyProgress() {
    try {
        const progress = localStorage.getItem(STORAGE_KEYS.ALCHEMY_PROGRESS);
        return progress ? JSON.parse(progress) : {};
    } catch (error) {
        console.error('Error getting alchemy progress:', error);
        return {};
    }
}

function saveAlchemyProgress(progress) {
    try {
        localStorage.setItem(STORAGE_KEYS.ALCHEMY_PROGRESS, JSON.stringify(progress));
        
        // Update total crafts count
        const totalCrafts = Object.values(progress).reduce((sum, count) => sum + count, 0);
        localStorage.setItem(STORAGE_KEYS.ALCHEMY_TOTAL_CRAFTS, totalCrafts.toString());
        
        return true;
    } catch (error) {
        console.error('Error saving alchemy progress:', error);
        return false;
    }
}

function addAlchemyProgress(recipeId, count = 1) {
    try {
        const progress = getAlchemyProgress();
        progress[recipeId] = (progress[recipeId] || 0) + count;
        return saveAlchemyProgress(progress);
    } catch (error) {
        console.error('Error adding alchemy progress:', error);
        return false;
    }
}

function getAlchemyTotalCrafts() {
    try {
        return parseInt(localStorage.getItem(STORAGE_KEYS.ALCHEMY_TOTAL_CRAFTS)) || 0;
    } catch (error) {
        console.error('Error getting alchemy total crafts:', error);
        return 0;
    }
}

function getRecipeProgress(recipeId) {
    try {
        const progress = getAlchemyProgress();
        return progress[recipeId] || 0;
    } catch (error) {
        console.error('Error getting recipe progress:', error);
        return 0;
    }
}

// ===== RECIPE UNLOCK FUNCTIONS =====
function getUnlockedRecipes() {
    try {
        const unlocked = localStorage.getItem(STORAGE_KEYS.ALCHEMY_RECIPES_UNLOCKED);
        return unlocked ? JSON.parse(unlocked) : [];
    } catch (error) {
        console.error('Error getting unlocked recipes:', error);
        return [];
    }
}

function unlockRecipe(recipeId) {
    try {
        const unlocked = getUnlockedRecipes();
        if (!unlocked.includes(recipeId)) {
            unlocked.push(recipeId);
            localStorage.setItem(STORAGE_KEYS.ALCHEMY_RECIPES_UNLOCKED, JSON.stringify(unlocked));
        }
        return true;
    } catch (error) {
        console.error('Error unlocking recipe:', error);
        return false;
    }
}

function isRecipeUnlocked(recipeId) {
    const unlocked = getUnlockedRecipes();
    return unlocked.includes(recipeId);
}

// ===== INITIALIZATION =====
async function initializeStorage() {
    console.log('Initializing storage...');
    
    // Use the UNIVERSE_SEED from the HTML file (already declared globally)
    // This value is accessible via window.UNIVERSE_SEED
    if (!localStorage.getItem(STORAGE_KEYS.UNIVERSE_SEED) && typeof window.UNIVERSE_SEED !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.UNIVERSE_SEED, window.UNIVERSE_SEED.toString());
    }
    
    const player = await getPlayer();
    if (!player) {
        await createDefaultPlayer();
    }
    
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
    
    // Initialize alchemy storage if not present
    if (!localStorage.getItem(STORAGE_KEYS.ALCHEMY_PROGRESS)) {
        localStorage.setItem(STORAGE_KEYS.ALCHEMY_PROGRESS, '{}');
    }
    if (!localStorage.getItem(STORAGE_KEYS.ALCHEMY_RECIPES_UNLOCKED)) {
        // Unlock basic recipes by default
        const defaultUnlocked = ['water', 'methane', 'ammonia', 'hydrogen_peroxide'];
        localStorage.setItem(STORAGE_KEYS.ALCHEMY_RECIPES_UNLOCKED, JSON.stringify(defaultUnlocked));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ALCHEMY_TOTAL_CRAFTS)) {
        localStorage.setItem(STORAGE_KEYS.ALCHEMY_TOTAL_CRAFTS, '0');
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR)) {
        setCurrentLocation('Orion Arm', 'B2', 'Orion Molecular Cloud', 'Star-forming', 85, 30, 40);
    }
    
    console.log('Storage initialized');
}

// ===== PLAYER DATA =====
async function getPlayer() {
    try {
        return await window.getItem('player', 'main');
    } catch (error) {
        console.error('Error getting player:', error);
        return null;
    }
}

async function savePlayer(playerData) {
    try {
        await window.setItem('player', { id: 'main', ...playerData });
        saveTimestamp();
        return true;
    } catch (error) {
        console.error('Error saving player:', error);
        return false;
    }
}

async function createDefaultPlayer(name = 'Voidfarer') {
    try {
        const player = {
            id: 'main',
            name: name,
            ship: 'Prospector',
            shipLevel: 1,
            created: new Date().toISOString(),
            lastPlayed: new Date().toISOString(),
            playTime: 0,
            totalElementsCollected: 0,
            totalCreditsEarned: 5000,
            totalDistanceTraveled: 0,
            totalWarps: 0,
            credits: 5000,
            cargoMassLimit: getCargoMassLimit(),
            // Add alchemy stats to player
            alchemyTotalCrafts: 0,
            alchemyMasteredRecipes: 0
        };
        await savePlayer(player);
        console.log('Created default player');
        return player;
    } catch (error) {
        console.error('Error creating default player:', error);
        return null;
    }
}

// ===== COLLECTION DATA =====
async function getCollection() {
    try {
        return await window.getCollectionAsObject();
    } catch (error) {
        console.error('Error getting collection:', error);
        return {};
    }
}

// ===== DIRECT DB ACCESS FUNCTIONS (NO RECURSION) =====
// These call the db.js prefixed functions directly without going through window

async function dbAddElementToCollection(elementName, count = 1) {
    try {
        // Call the db.js prefixed function directly
        if (typeof window.dbAddElementToCollection === 'function') {
            return await window.dbAddElementToCollection(elementName, count, {});
        }
        return { success: false, error: 'db.js function not available' };
    } catch (error) {
        console.error('Error in dbAddElementToCollection:', error);
        return { success: false, error: error.message };
    }
}

async function dbRemoveElementFromCollection(elementName, count = 1) {
    try {
        // Call the db.js prefixed function directly
        if (typeof window.dbRemoveElementFromCollection === 'function') {
            return await window.dbRemoveElementFromCollection(elementName, count);
        }
        return { success: false, error: 'db.js function not available' };
    } catch (error) {
        console.error('Error in dbRemoveElementFromCollection:', error);
        return { success: false, error: error.message };
    }
}

// ===== PUBLIC WRAPPER FUNCTIONS =====
// These add additional functionality (stats, location tracking) and then call db.js

// Public wrapper function - adds element to collection and saves location with full metadata
async function addElementToCollection(elementName, count = 1, locationData = null) {
    try {
        console.log(`Adding ${count}x ${elementName} to collection...`, locationData ? 'with location data' : 'no location data');
        
        // First add to collection using db.js function DIRECTLY (not through window)
        const result = await dbAddElementToCollection(elementName, count);
        
        if (result && result.success) {
            // Update player stats
            const player = await getPlayer();
            if (player) {
                player.totalElementsCollected = (player.totalElementsCollected || 0) + count;
                await savePlayer(player);
            }
            
            // CRITICAL: ALWAYS save location data if provided (for planetary discoveries)
            // This ensures journal entries are created for every discovery
            if (locationData && locationData.fromPlanet === true) {
                // Get planet name and type - with proper fallbacks
                const planetName = locationData.planet || getCurrentPlanetName();
                const planetType = locationData.planetType || getCurrentPlanetType();
                const rarity = locationData.rarity || getElementRarity(elementName);
                
                console.log(`📍 Saving location for ${elementName}:`, { planetName, planetType, rarity });
                
                // Create enhanced location data with all metadata
                const enhancedLocationData = {
                    planet: planetName,
                    planetType: planetType,
                    quantity: count,
                    rarity: rarity,
                    value: getElementValue(elementName),
                    timestamp: Date.now(),
                    discoveredDate: new Date().toISOString()
                };
                
                try {
                    // Call the db.js function with full metadata
                    if (typeof window.dbSaveElementLocation === 'function') {
                        await window.dbSaveElementLocation(elementName, planetName, enhancedLocationData);
                        console.log(`✅ Journal entry saved: ${count}x ${elementName} (${rarity}) found on ${planetName}`);
                        
                        // Also update planet status
                        if (typeof window.updatePlanetStatusFromLocations === 'function') {
                            await window.updatePlanetStatusFromLocations(planetName);
                        }
                    } else if (typeof window.saveElementLocation === 'function') {
                        // Fallback to regular function
                        await window.saveElementLocation(elementName, planetName, enhancedLocationData);
                        console.log(`✅ Journal entry saved (fallback): ${count}x ${elementName} (${rarity}) found on ${planetName}`);
                        
                        if (typeof window.updatePlanetStatusFromLocations === 'function') {
                            await window.updatePlanetStatusFromLocations(planetName);
                        }
                    } else {
                        console.warn('saveElementLocation function not available');
                    }
                } catch (locError) {
                    console.error('Failed to save location:', locError);
                }
            } else {
                console.log(`No planetary location data for ${elementName} - this is normal for alchemy crafts or market purchases`);
            }
            
            return { success: true, newCount: result.count };
        }
        return { success: false, reason: 'database_error', error: result?.error };
    } catch (error) {
        console.error('Error in addElementToCollection:', error);
        return { success: false, reason: 'error', error: error.message };
    }
}

// Remove element from collection (public wrapper)
async function removeElementFromCollection(elementName, count = 1) {
    console.log(`Removing ${count}x ${elementName} from collection...`);
    return await dbRemoveElementFromCollection(elementName, count);
}

// Helper to get element rarity
function getElementRarity(elementName) {
    // All elements are common by default
    let rarity = 'common';
    
    // Very Rare elements (mostly synthetic, radioactive)
    const veryRareElements = [
        'Polonium', 'Astatine', 'Radon', 'Francium', 'Radium', 'Actinium',
        'Thorium', 'Protactinium', 'Uranium'
    ];
    
    // Legendary elements (transuranic, super-heavy)
    const legendaryElements = [
        'Neptunium', 'Plutonium', 'Americium', 'Curium', 'Berkelium', 'Californium',
        'Einsteinium', 'Fermium', 'Mendelevium', 'Nobelium', 'Lawrencium',
        'Rutherfordium', 'Dubnium', 'Seaborgium', 'Bohrium', 'Hassium',
        'Meitnerium', 'Darmstadtium', 'Roentgenium', 'Copernicium',
        'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium', 'Tennessine', 'Oganesson'
    ];
    
    // Rare elements (precious metals, rare earths)
    const rareElements = [
        'Scandium', 'Titanium', 'Vanadium', 'Chromium', 'Manganese', 'Cobalt', 'Nickel',
        'Copper', 'Zinc', 'Gallium', 'Germanium', 'Arsenic', 'Selenium', 'Bromine',
        'Krypton', 'Rubidium', 'Strontium', 'Yttrium', 'Zirconium', 'Niobium',
        'Molybdenum', 'Technetium', 'Ruthenium', 'Rhodium', 'Palladium', 'Silver',
        'Cadmium', 'Indium', 'Tin', 'Antimony', 'Tellurium', 'Iodine', 'Xenon',
        'Cesium', 'Barium', 'Lanthanum', 'Cerium', 'Praseodymium', 'Neodymium',
        'Promethium', 'Samarium', 'Europium', 'Gadolinium', 'Terbium', 'Dysprosium',
        'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium', 'Hafnium',
        'Tantalum', 'Tungsten', 'Rhenium', 'Osmium', 'Iridium', 'Platinum',
        'Gold', 'Mercury', 'Thallium', 'Lead', 'Bismuth'
    ];
    
    if (legendaryElements.includes(elementName)) {
        rarity = 'legendary';
    } else if (veryRareElements.includes(elementName)) {
        rarity = 'very-rare';
    } else if (rareElements.includes(elementName)) {
        rarity = 'rare';
    }
    
    return rarity;
}

// Helper to get element value
function getElementValue(elementName) {
    const values = {
        // Common - 100 (basic elements)
        'Hydrogen': 100, 'Helium': 100, 'Lithium': 100, 'Beryllium': 100,
        'Boron': 100, 'Carbon': 100, 'Nitrogen': 100, 'Oxygen': 100,
        'Fluorine': 100, 'Neon': 100, 'Sodium': 100, 'Magnesium': 100,
        'Aluminum': 100, 'Silicon': 100, 'Phosphorus': 100, 'Sulfur': 100,
        'Chlorine': 100, 'Argon': 100, 'Potassium': 100, 'Calcium': 100,
        
        // Rare - 1000 (transition metals, valuable)
        'Scandium': 1000, 'Titanium': 1000, 'Vanadium': 1000, 'Chromium': 1000,
        'Manganese': 1000, 'Iron': 1000, 'Cobalt': 1000, 'Nickel': 1000,
        'Copper': 1000, 'Zinc': 1000, 'Gallium': 1000, 'Germanium': 1000,
        'Arsenic': 1000, 'Selenium': 1000, 'Bromine': 1000, 'Krypton': 1000,
        'Rubidium': 1000, 'Strontium': 1000, 'Yttrium': 1000, 'Zirconium': 1000,
        'Niobium': 1000, 'Molybdenum': 1000, 'Technetium': 1000, 'Ruthenium': 1000,
        'Rhodium': 1000, 'Palladium': 1000, 'Silver': 1000, 'Cadmium': 1000,
        'Indium': 1000, 'Tin': 1000, 'Antimony': 1000, 'Tellurium': 1000,
        'Iodine': 1000, 'Xenon': 1000, 'Cesium': 1000, 'Barium': 1000,
        'Lanthanum': 1000, 'Cerium': 1000, 'Praseodymium': 1000, 'Neodymium': 1000,
        'Promethium': 1000, 'Samarium': 1000, 'Europium': 1000, 'Gadolinium': 1000,
        'Terbium': 1000, 'Dysprosium': 1000, 'Holmium': 1000, 'Erbium': 1000,
        'Thulium': 1000, 'Ytterbium': 1000, 'Lutetium': 1000, 'Hafnium': 1000,
        'Tantalum': 1000, 'Tungsten': 1000, 'Rhenium': 1000, 'Osmium': 1000,
        'Iridium': 1000, 'Platinum': 1000, 'Gold': 1000, 'Mercury': 1000,
        'Thallium': 1000, 'Lead': 1000, 'Bismuth': 1000,
        
        // Very Rare - 5000 (radioactive, difficult to obtain)
        'Polonium': 5000, 'Astatine': 5000, 'Radon': 5000, 'Francium': 5000,
        'Radium': 5000, 'Actinium': 5000, 'Thorium': 5000, 'Protactinium': 5000,
        'Uranium': 5000,
        
        // Legendary - 25000 (super-heavy, synthetic, extremely rare)
        'Neptunium': 25000, 'Plutonium': 25000, 'Americium': 25000, 'Curium': 25000,
        'Berkelium': 25000, 'Californium': 25000, 'Einsteinium': 25000, 'Fermium': 25000,
        'Mendelevium': 25000, 'Nobelium': 25000, 'Lawrencium': 25000, 'Rutherfordium': 25000,
        'Dubnium': 25000, 'Seaborgium': 25000, 'Bohrium': 25000, 'Hassium': 25000,
        'Meitnerium': 25000, 'Darmstadtium': 25000, 'Roentgenium': 25000, 'Copernicium': 25000,
        'Nihonium': 25000, 'Flerovium': 25000, 'Moscovium': 25000, 'Livermorium': 25000,
        'Tennessine': 25000, 'Oganesson': 25000
    };
    
    return values[elementName] || 100;
}

// ===== SAFE SELL ELEMENT =====
async function safeSellElement(elementName, quantity, pricePerUnit) {
    try {
        console.log('safeSellElement called:', elementName, quantity, pricePerUnit);
        const collection = await getCollection();
        const credits = await getCredits();
        
        if (!collection[elementName]) {
            return { success: false, reason: 'not_found' };
        }
        
        const elementData = collection[elementName];
        const availableCount = elementData.count || 1;
        
        if (availableCount < quantity) {
            return { success: false, reason: 'insufficient', available: availableCount };
        }
        
        // Remove from collection using db.js function directly
        const removeResult = await dbRemoveElementFromCollection(elementName, quantity);
        
        if (!removeResult.success) {
            return removeResult;
        }
        
        // Add credits
        const earnings = quantity * pricePerUnit;
        const newCredits = credits + earnings;
        await saveCredits(newCredits);
        
        return { 
            success: true, 
            earnings: earnings,
            newCredits: newCredits
        };
        
    } catch (error) {
        console.error('Error in safeSellElement:', error);
        return { success: false, reason: 'error', error: error.message };
    }
}

// ===== LOCATION RETRIEVAL FUNCTIONS =====
// Get all locations for a specific element
async function getElementLocations(elementName) {
    try {
        // Use dbGetAll directly from db.js
        if (typeof window.dbGetAll === 'function') {
            const allLocations = await window.dbGetAll('elementLocations') || [];
            return allLocations
                .filter(loc => loc.elementName === elementName)
                .sort((a, b) => b.discoveredAt - a.discoveredAt);
        } else if (typeof window.getAll === 'function') {
            // Fallback to regular getAll
            const allLocations = await window.getAll('elementLocations') || [];
            return allLocations
                .filter(loc => loc.elementName === elementName)
                .sort((a, b) => b.discoveredAt - a.discoveredAt);
        }
        
        // Fallback to localStorage if db.js not available
        const locationsKey = `voidfarer_locations_${elementName}`;
        const locations = localStorage.getItem(locationsKey);
        return locations ? JSON.parse(locations) : [];
        
    } catch (error) {
        console.error(`Error getting locations for ${elementName}:`, error);
        return [];
    }
}

// Get all player locations (for stats)
async function getAllPlayerLocations() {
    try {
        // Use dbGetAll directly from db.js
        if (typeof window.dbGetAll === 'function') {
            const allLocations = await window.dbGetAll('elementLocations') || [];
            const playerId = localStorage.getItem('voidfarer_player_id');
            if (!playerId) return [];
            
            return allLocations
                .filter(loc => loc.playerId === playerId)
                .sort((a, b) => b.discoveredAt - a.discoveredAt);
        } else if (typeof window.getAll === 'function') {
            const allLocations = await window.getAll('elementLocations') || [];
            const playerId = localStorage.getItem('voidfarer_player_id');
            if (!playerId) return [];
            
            return allLocations
                .filter(loc => loc.playerId === playerId)
                .sort((a, b) => b.discoveredAt - a.discoveredAt);
        }
        
        // Fallback: Scan localStorage for all location keys
        const allLocations = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('voidfarer_locations_')) {
                const elementName = key.replace('voidfarer_locations_', '');
                const locations = JSON.parse(localStorage.getItem(key) || '[]');
                locations.forEach(loc => {
                    allLocations.push({
                        element: elementName,
                        ...loc
                    });
                });
            }
        }
        return allLocations;
        
    } catch (error) {
        console.error('Error getting all player locations:', error);
        return [];
    }
}

// ===== CREDITS =====
async function getCredits() {
    try {
        const player = await getPlayer();
        return player?.credits || 5000;
    } catch (error) {
        console.error('Error getting credits:', error);
        return 5000;
    }
}

async function saveCredits(credits) {
    try {
        const player = await getPlayer();
        if (player) {
            player.credits = credits;
            await savePlayer(player);
        }
        saveTimestamp();
        return true;
    } catch (error) {
        console.error('Error saving credits:', error);
        return false;
    }
}

async function addCredits(amount) {
    try {
        const current = await getCredits();
        const newTotal = current + amount;
        await saveCredits(newTotal);
        
        const player = await getPlayer();
        if (player) {
            player.totalCreditsEarned = (player.totalCreditsEarned || 5000) + amount;
            await savePlayer(player);
        }
        return newTotal;
    } catch (error) {
        console.error('Error adding credits:', error);
        return 5000;
    }
}

async function spendCredits(amount) {
    try {
        const current = await getCredits();
        if (current >= amount) {
            await saveCredits(current - amount);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error spending credits:', error);
        return false;
    }
}

// ===== SHIP FUEL =====
function getShipFuel() {
    try {
        return parseInt(localStorage.getItem(STORAGE_KEYS.SHIP_FUEL)) || 100;
    } catch (error) {
        console.error('Error getting ship fuel:', error);
        return 100;
    }
}

function saveShipFuel(fuel) {
    try {
        localStorage.setItem(STORAGE_KEYS.SHIP_FUEL, fuel.toString());
    } catch (error) {
        console.error('Error saving ship fuel:', error);
    }
}

function refuelShip(amount) {
    try {
        const current = getShipFuel();
        saveShipFuel(Math.min(100, current + amount));
    } catch (error) {
        console.error('Error refueling ship:', error);
    }
}

// ===== SHIP POWER =====
function getShipPower() {
    try {
        return parseInt(localStorage.getItem(STORAGE_KEYS.SHIP_POWER)) || 100;
    } catch (error) {
        console.error('Error getting ship power:', error);
        return 100;
    }
}

function setShipPower(power) {
    try {
        localStorage.setItem(STORAGE_KEYS.SHIP_POWER, power.toString());
    } catch (error) {
        console.error('Error setting ship power:', error);
    }
}

function repairShip(amount) {
    try {
        const current = getShipPower();
        setShipPower(Math.min(100, current + amount));
    } catch (error) {
        console.error('Error repairing ship:', error);
    }
}

// ===== LOCATION DATA =====
function getCurrentSector() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR) || 'B2';
}

function getCurrentRegion() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_REGION) || 'Orion Arm';
}

function setCurrentSector(sector, region) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR, sector);
    localStorage.setItem(STORAGE_KEYS.CURRENT_REGION, region);
}

function getCurrentStarSector() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_SECTOR) || 'Orion Molecular Cloud';
}

function getCurrentStar() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR) || 'Sol';
}

function getCurrentPlanet() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Earth';
}

function getCurrentPlanetImage() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_IMAGE) || 'earth-view.jpg';
}

function setCurrentPlanet(name, type, resources) {
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

function setCurrentLocation(region, sector, starSector, starSectorType, starSectorStars, starSectorX, starSectorY) {
    setCurrentSector(sector, region);
    if (starSector) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_SECTOR, starSector);
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_NAME, starSector);
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_TYPE, starSectorType || 'Unknown');
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_STARS, (starSectorStars || 50).toString());
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_X, (starSectorX || 30).toString());
        localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_Y, (starSectorY || 40).toString());
    }
}

// ===== WARP DATA =====
function setWarpData(destination, returnPage, cycles, distance, fuel) {
    localStorage.setItem(STORAGE_KEYS.WARP_DESTINATION, destination);
    localStorage.setItem(STORAGE_KEYS.WARP_RETURN, returnPage);
    localStorage.setItem(STORAGE_KEYS.WARP_CYCLES, cycles.toString());
    if (distance) localStorage.setItem(STORAGE_KEYS.WARP_DISTANCE, distance.toString());
    if (fuel) localStorage.setItem(STORAGE_KEYS.WARP_FUEL, fuel.toString());
}

function getWarpData() {
    return {
        destination: localStorage.getItem(STORAGE_KEYS.WARP_DESTINATION) || 'Unknown',
        returnPage: localStorage.getItem(STORAGE_KEYS.WARP_RETURN) || 'galaxy-map.html',
        cycles: parseInt(localStorage.getItem(STORAGE_KEYS.WARP_CYCLES)) || 1,
        distance: parseFloat(localStorage.getItem(STORAGE_KEYS.WARP_DISTANCE)) || 0,
        fuel: parseInt(localStorage.getItem(STORAGE_KEYS.WARP_FUEL)) || 0
    };
}

function clearWarpData() {
    const keys = [
        STORAGE_KEYS.WARP_DESTINATION,
        STORAGE_KEYS.WARP_RETURN,
        STORAGE_KEYS.WARP_CYCLES,
        STORAGE_KEYS.WARP_DISTANCE,
        STORAGE_KEYS.WARP_FUEL
    ];
    keys.forEach(key => localStorage.removeItem(key));
}

// ===== SYSTEM DATA MANAGEMENT =====
function saveSystemData(systemData) {
    localStorage.setItem('voidfarer_system_data', JSON.stringify(systemData));
}

function loadSystemData() {
    const data = localStorage.getItem('voidfarer_system_data');
    return data ? JSON.parse(data) : null;
}

function clearSystemData() {
    localStorage.removeItem('voidfarer_system_data');
}

// ===== COLONIES =====
async function getColonies() {
    return await window.getAll('colonies');
}

// ===== MISSIONS =====
async function getMissions() {
    return await window.getAll('missions');
}

async function getCompletedMissions() {
    return await window.getAll('completedMissions');
}

// ===== SCAN HISTORY =====
async function getScanHistory() {
    const scans = await window.getAll('scanHistory');
    return scans.sort((a, b) => b.timestamp - a.timestamp);
}

async function addScan(scanData) {
    const scan = {
        timestamp: Date.now(),
        ...scanData,
        date: new Date().toISOString()
    };
    await window.setItem('scanHistory', scan);
    return await getScanHistory();
}

// ===== REAL ESTATE =====
async function getRealEstate() {
    const properties = await window.getAllProperties();
    return { properties: properties };
}

// ===== TAX TRANSACTIONS =====
async function getTaxHistory(playerId, limit = 100) {
    if (playerId) {
        return await window.getPlayerTransactions(playerId, limit);
    }
    const all = await window.getAll('taxTransactions');
    return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
}

// ===== SETTINGS =====
function getHapticsEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_HAPTICS) !== 'false';
}

function setHapticsEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_HAPTICS, enabled.toString());
}

function getAutoGatherEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_AUTO_GATHER) !== 'false';
}

function setAutoGatherEnabled(enabled) {
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

// ===== SHIP UPGRADES =====
async function getShipUpgrades() {
    const upgrades = await window.getItem('shipUpgrades', 'current');
    return upgrades || { engine: 1, shields: 1, miningLaser: 1, cargoHold: 1, warpDrive: 1, scanner: 1 };
}

async function saveShipUpgrades(upgrades) {
    await window.setItem('shipUpgrades', { id: 'current', ...upgrades });
}

// ===== SAVE TIMESTAMP =====
function saveTimestamp() {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
}

// ===== RESET GAME =====
async function resetGame() {
    const settings = {
        haptics: getHapticsEnabled(),
        autoGather: getAutoGatherEnabled(),
        orbitSpeed: getOrbitSpeed(),
        music: getMusicVolume(),
        ambient: getAmbientVolume()
    };
    
    await window.resetAllData();
    
    const locationKeys = [
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
        STORAGE_KEYS.CURRENT_PLANET_IMAGE
    ];
    locationKeys.forEach(key => localStorage.removeItem(key));
    
    // Clear alchemy data
    localStorage.removeItem(STORAGE_KEYS.ALCHEMY_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.ALCHEMY_RECIPES_UNLOCKED);
    localStorage.removeItem(STORAGE_KEYS.ALCHEMY_TOTAL_CRAFTS);
    
    setHapticsEnabled(settings.haptics);
    setAutoGatherEnabled(settings.autoGather);
    setOrbitSpeed(settings.orbitSpeed);
    setMusicVolume(settings.music);
    setAmbientVolume(settings.ambient);
    
    await initializeStorage();
}

// ===== PLAYER ID =====
function getPlayerId() {
    let playerId = localStorage.getItem('voidfarer_player_id');
    if (!playerId) {
        playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        localStorage.setItem('voidfarer_player_id', playerId);
    }
    return playerId;
}

// ===== EXPOSE TO WINDOW =====
window.CARGO_MASS_LIMIT = typeof window.CARGO_MASS_LIMIT !== 'undefined' ? window.CARGO_MASS_LIMIT : 5000;
window.STORAGE_KEYS = STORAGE_KEYS;
window.UNIVERSE_SEED = typeof window.UNIVERSE_SEED !== 'undefined' ? window.UNIVERSE_SEED : 42793;
window.ELEMENT_MASS = ELEMENT_MASS;
window.getElementMass = getElementMass;
window.getTotalCargoMass = getTotalCargoMass;
window.getRemainingCargoMass = getRemainingCargoMass;
window.getCurrentPlanetName = getCurrentPlanetName;
window.getCurrentPlanetType = getCurrentPlanetType;
window.getCurrentPlanetResources = getCurrentPlanetResources;
window.initializeStorage = initializeStorage;
window.getPlayer = getPlayer;
window.savePlayer = savePlayer;
window.createDefaultPlayer = createDefaultPlayer;
window.getCollection = getCollection;
window.addElementToCollection = addElementToCollection;
window.removeElementFromCollection = removeElementFromCollection;
window.getElementLocations = getElementLocations;
window.getAllPlayerLocations = getAllPlayerLocations;
window.getCredits = getCredits;
window.saveCredits = saveCredits;
window.addCredits = addCredits;
window.spendCredits = spendCredits;
window.safeSellElement = safeSellElement;
window.getShipFuel = getShipFuel;
window.saveShipFuel = saveShipFuel;
window.refuelShip = refuelShip;
window.getShipPower = getShipPower;
window.setShipPower = setShipPower;
window.repairShip = repairShip;
window.getCurrentSector = getCurrentSector;
window.getCurrentRegion = getCurrentRegion;
window.setCurrentSector = setCurrentSector;
window.getCurrentStarSector = getCurrentStarSector;
window.getCurrentStar = getCurrentStar;
window.getCurrentPlanet = getCurrentPlanet;
window.getCurrentPlanetType = getCurrentPlanetType;
window.getCurrentPlanetResources = getCurrentPlanetResources;
window.getCurrentPlanetImage = getCurrentPlanetImage;
window.setCurrentPlanet = setCurrentPlanet;
window.setCurrentLocation = setCurrentLocation;
window.setWarpData = setWarpData;
window.getWarpData = getWarpData;
window.clearWarpData = clearWarpData;
window.saveSystemData = saveSystemData;
window.loadSystemData = loadSystemData;
window.clearSystemData = clearSystemData;
window.getColonies = getColonies;
window.getMissions = getMissions;
window.getCompletedMissions = getCompletedMissions;
window.getScanHistory = getScanHistory;
window.addScan = addScan;
window.getRealEstate = getRealEstate;
window.getTaxHistory = getTaxHistory;
window.getHapticsEnabled = getHapticsEnabled;
window.setHapticsEnabled = setHapticsEnabled;
window.getAutoGatherEnabled = getAutoGatherEnabled;
window.setAutoGatherEnabled = setAutoGatherEnabled;
window.getOrbitSpeed = getOrbitSpeed;
window.setOrbitSpeed = setOrbitSpeed;
window.getMusicVolume = getMusicVolume;
window.setMusicVolume = setMusicVolume;
window.getAmbientVolume = getAmbientVolume;
window.setAmbientVolume = setAmbientVolume;
window.getShipUpgrades = getShipUpgrades;
window.saveShipUpgrades = saveShipUpgrades;
window.saveTimestamp = saveTimestamp;
window.resetGame = resetGame;
window.getPlayerId = getPlayerId;

// ===== ALCHEMY FUNCTIONS =====
window.getAlchemyProgress = getAlchemyProgress;
window.saveAlchemyProgress = saveAlchemyProgress;
window.addAlchemyProgress = addAlchemyProgress;
window.getAlchemyTotalCrafts = getAlchemyTotalCrafts;
window.getRecipeProgress = getRecipeProgress;
window.getUnlockedRecipes = getUnlockedRecipes;
window.unlockRecipe = unlockRecipe;
window.isRecipeUnlocked = isRecipeUnlocked;

// NOTE: Planet status functions are already exposed by db.js
// We do NOT redefine them here to avoid recursion
// The following functions are available directly from db.js:
// - getPlanetStatus
// - updatePlanetStatusFromLocations
// - claimPlanet
// - getClaimedPlanets
// - getPlanetsByExploration
// - getPlanetsByRarity

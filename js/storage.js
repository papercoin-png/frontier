// js/storage.js - Save/load player progress for Voidfarer
// Using IndexedDB via db.js for unlimited storage with mass-based cargo

import db from './db.js';

// ===== CONSTANTS =====
export const CARGO_MASS_LIMIT = 5000; // Maximum atomic mass units the ship can carry

// ===== STORAGE KEYS (kept for reference, but not used for storage) =====
export const STORAGE_KEYS = {
    // Player data
    PLAYER: 'voidfarer_player',
    COLLECTION: 'voidfarer_collection',
    MISSIONS: 'voidfarer_missions',
    COMPLETED_MISSIONS: 'voidfarer_completed_missions',
    CREDITS: 'voidfarer_credits',
    
    // Universe data
    UNIVERSE_SEED: 'voidfarer_universe_seed',
    
    // Location data - Galaxy level
    CURRENT_SECTOR: 'voidfarer_current_sector',
    CURRENT_REGION: 'voidfarer_current_region',
    
    // Location data - Star Sector level
    CURRENT_STAR_SECTOR: 'voidfarer_current_starSector',
    CURRENT_SECTOR_NAME: 'voidfarer_current_sector_name',
    CURRENT_SECTOR_TYPE: 'voidfarer_current_sector_type',
    CURRENT_SECTOR_STARS: 'voidfarer_current_sector_stars',
    CURRENT_SECTOR_X: 'voidfarer_current_sector_x',
    CURRENT_SECTOR_Y: 'voidfarer_current_sector_y',
    
    // Location data - Star level
    CURRENT_STAR: 'voidfarer_current_star',
    CURRENT_STAR_TYPE: 'voidfarer_current_star_type',
    CURRENT_STAR_INDEX: 'voidfarer_current_star_index',
    CURRENT_STAR_X: 'voidfarer_current_star_x',
    CURRENT_STAR_Y: 'voidfarer_current_star_y',
    CURRENT_STAR_PLANETS: 'voidfarer_current_star_planets',
    
    // Location data - Planet level
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
    
    // Colonies
    COLONIES: 'voidfarer_colonies',
    
    // Discoveries
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
    
    // Stats
    PLAYER_STATS: 'voidfarer_player_stats',
    ACHIEVEMENTS: 'voidfarer_achievements',
    LAST_SAVE: 'voidfarer_last_save',
    
    // Real Estate
    REAL_ESTATE: 'voidfarer_real_estate',
    
    // Economic Data
    TOTAL_MONEY_SUPPLY: 'voidfarer_total_money_supply',
    DAILY_METRICS: 'voidfarer_daily_metrics',
    HOURLY_SNAPSHOTS: 'voidfarer_hourly_snapshots',
    TAX_RATES: 'voidfarer_tax_rates',
    TAX_HISTORY: 'voidfarer_tax_history',
    COMMUNITY_FUND: 'voidfarer_community_fund',
    ACTIVE_EVENTS: 'voidfarer_active_events',
    EVENT_HISTORY: 'voidfarer_event_history'
};

// ===== UNIVERSE CONSTANTS =====
export const UNIVERSE_SEED = 42793;

// ===== ELEMENT MASS DATABASE - SINGLE SOURCE OF TRUTH =====
export const ELEMENT_MASS = {
    // Common
    'Hydrogen': 1.008,
    'Helium': 4.003,
    'Lithium': 6.94,
    'Beryllium': 9.012,
    'Boron': 10.81,
    'Sodium': 22.99,
    'Magnesium': 24.31,
    'Aluminum': 26.98,
    'Silicon': 28.09,
    'Potassium': 39.10,
    'Calcium': 40.08,
    
    // Uncommon
    'Carbon': 12.01,
    'Nitrogen': 14.01,
    'Oxygen': 16.00,
    'Fluorine': 19.00,
    'Neon': 20.18,
    'Phosphorus': 30.97,
    'Sulfur': 32.06,
    'Chlorine': 35.45,
    'Argon': 39.95,
    'Iron': 55.85,
    'Nickel': 58.69,
    'Lead': 207.2,
    
    // Rare
    'Scandium': 44.96,
    'Titanium': 47.87,
    'Vanadium': 50.94,
    'Chromium': 52.00,
    'Manganese': 54.94,
    'Cobalt': 58.93,
    'Copper': 63.55,
    'Zinc': 65.38,
    'Gallium': 69.72,
    'Germanium': 72.63,
    'Arsenic': 74.92,
    'Selenium': 78.97,
    'Bromine': 79.90,
    'Krypton': 83.80,
    'Rubidium': 85.47,
    'Strontium': 87.62,
    'Yttrium': 88.91,
    'Zirconium': 91.22,
    'Niobium': 92.91,
    'Molybdenum': 95.95,
    'Ruthenium': 101.1,
    'Rhodium': 102.9,
    'Palladium': 106.4,
    'Silver': 107.9,
    'Cadmium': 112.4,
    'Indium': 114.8,
    'Tin': 118.7,
    'Antimony': 121.8,
    'Tellurium': 127.6,
    'Iodine': 126.9,
    'Xenon': 131.3,
    'Cesium': 132.9,
    'Barium': 137.3,
    'Lanthanum': 138.9,
    'Cerium': 140.1,
    'Praseodymium': 140.9,
    'Neodymium': 144.2,
    'Samarium': 150.4,
    'Europium': 152.0,
    'Gadolinium': 157.3,
    'Terbium': 158.9,
    'Dysprosium': 162.5,
    'Holmium': 164.9,
    'Erbium': 167.3,
    'Thulium': 168.9,
    'Ytterbium': 173.0,
    'Lutetium': 175.0,
    'Hafnium': 178.5,
    'Tantalum': 180.9,
    'Tungsten': 183.8,
    'Rhenium': 186.2,
    'Osmium': 190.2,
    'Iridium': 192.2,
    'Platinum': 195.1,
    'Gold': 197.0,
    'Mercury': 200.6,
    'Thallium': 204.4,
    'Bismuth': 209.0,
    
    // Very Rare
    'Polonium': 209.0,
    'Radon': 222.0,
    'Radium': 226.0,
    'Actinium': 227.0,
    'Thorium': 232.0,
    'Protactinium': 231.0,
    'Uranium': 238.0,
    
    // Legendary
    'Technetium': 98.0,
    'Promethium': 145.0,
    'Astatine': 210.0,
    'Francium': 223.0,
    'Neptunium': 237.0,
    'Plutonium': 244.0,
    'Americium': 243.0,
    'Curium': 247.0,
    'Berkelium': 247.0,
    'Californium': 251.0,
    'Einsteinium': 252.0,
    'Fermium': 257.0,
    'Mendelevium': 258.0,
    'Nobelium': 259.0,
    'Lawrencium': 262.0,
    'Rutherfordium': 267.0,
    'Dubnium': 268.0,
    'Seaborgium': 269.0,
    'Bohrium': 270.0,
    'Hassium': 277.0,
    'Meitnerium': 278.0,
    'Darmstadtium': 281.0,
    'Roentgenium': 282.0,
    'Copernicium': 285.0,
    'Nihonium': 286.0,
    'Flerovium': 289.0,
    'Moscovium': 290.0,
    'Livermorium': 293.0,
    'Tennessine': 294.0,
    'Oganesson': 294.0
};

// Default mass for unknown elements
const DEFAULT_MASS = 100.0;

// ===== ELEMENT MASS ACCESSOR - SINGLE FUNCTION =====
export function getElementMass(elementName) {
    return ELEMENT_MASS[elementName] || DEFAULT_MASS;
}

// ===== CARGO MASS UTILITIES =====
export async function getTotalCargoMass() {
    try {
        const collection = await getCollection();
        let totalMass = 0;
        
        for (const [name, data] of Object.entries(collection)) {
            const count = data.count || 1;
            const mass = getElementMass(name);
            totalMass += count * mass;
        }
        
        return totalMass;
    } catch (error) {
        console.error('Error calculating total cargo mass:', error);
        return 0;
    }
}

export async function getRemainingCargoMass() {
    try {
        const totalMass = await getTotalCargoMass();
        const player = await getPlayer();
        const massLimit = player?.cargoMassLimit || CARGO_MASS_LIMIT;
        
        return Math.max(0, massLimit - totalMass);
    } catch (error) {
        console.error('Error calculating remaining cargo mass:', error);
        return CARGO_MASS_LIMIT;
    }
}

export async function canAddToCargo(elementName, quantity = 1) {
    try {
        const remainingMass = await getRemainingCargoMass();
        const elementMass = getElementMass(elementName);
        const requiredMass = elementMass * quantity;
        
        return remainingMass >= requiredMass;
    } catch (error) {
        console.error('Error checking cargo space:', error);
        return false;
    }
}

// ===== HELPER: Settings storage (keep in localStorage for simplicity) =====
function getSetting(key, defaultValue) {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
}

function setSetting(key, value) {
    localStorage.setItem(key, value.toString());
}

// ===== INITIALIZATION =====
export async function initializeStorage() {
    console.log('Initializing storage...');
    
    // Set universe seed (keep in localStorage - it's tiny)
    if (!localStorage.getItem(STORAGE_KEYS.UNIVERSE_SEED)) {
        localStorage.setItem(STORAGE_KEYS.UNIVERSE_SEED, UNIVERSE_SEED.toString());
    }
    
    // Create default player if none exists in IndexedDB
    const player = await getPlayer();
    if (!player) {
        await createDefaultPlayer();
    }
    
    // Initialize default settings in localStorage if needed
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
    
    // Initialize default location if none exists
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR)) {
        setCurrentLocation('Orion Arm', 'B2', 'Orion Molecular Cloud', 'Star-forming', 85, 30, 40);
    }
    
    console.log('Storage initialized');
}

// ===== PLAYER DATA =====
export async function getPlayer() {
    try {
        return await db.getItem('player', 'main');
    } catch (error) {
        console.error('Error getting player:', error);
        return null;
    }
}

export async function savePlayer(playerData) {
    try {
        await db.setItem('player', { id: 'main', ...playerData });
        saveTimestamp();
        return true;
    } catch (error) {
        console.error('Error saving player:', error);
        return false;
    }
}

export async function createDefaultPlayer(name = 'Voidfarer') {
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
            cargoMassLimit: CARGO_MASS_LIMIT
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
export async function getCollection() {
    try {
        const collection = await db.getCollectionAsObject();
        return collection;
    } catch (error) {
        console.error('Error getting collection:', error);
        return {};
    }
}

export async function saveCollection(collection) {
    try {
        // This is a bulk operation - convert object back to individual records
        const elements = [];
        for (const [name, data] of Object.entries(collection)) {
            elements.push({
                name: name,
                count: data.count || 1,
                firstFound: data.firstFound || new Date().toISOString(),
                rarity: data.rarity || 'common',
                value: data.value || 100,
                mass: getElementMass(name)
            });
        }
        
        // Clear and rebuild (simpler than diffing)
        const dbConn = await db.getDb();
        const tx = dbConn.transaction('collection', 'readwrite');
        await tx.objectStore('collection').clear();
        
        for (const element of elements) {
            await tx.objectStore('collection').put(element);
        }
        await tx.done;
        
        saveTimestamp();
        return true;
    } catch (error) {
        console.error('Error saving collection:', error);
        return false;
    }
}

export async function addElementToCollection(elementName, count = 1) {
    try {
        const result = await db.addElementToCollection(elementName, count);
        
        if (result && result.success) {
            // Update player stats
            const player = await getPlayer();
            if (player) {
                player.totalElementsCollected = (player.totalElementsCollected || 0) + count;
                await savePlayer(player);
            }
            
            // Return the actual new count from the database
            return { success: true, newCount: result.count };
        } else {
            return { success: false, reason: 'database_error', error: result?.error };
        }
        
    } catch (error) {
        console.error('Error adding element to collection:', error);
        return { success: false, reason: 'error', error: error.message };
    }
}

export async function removeElementFromCollection(elementName, count = 1) {
    try {
        const result = await db.removeElementFromCollection(elementName, count);
        return result;
    } catch (error) {
        console.error('Error removing element from collection:', error);
        return { success: false, reason: 'error', error: error.message };
    }
}

export async function safeSellElement(elementName, quantity, pricePerUnit) {
    try {
        const collection = await getCollection();
        const credits = await getCredits();
        
        if (!collection[elementName]) {
            return { success: false, reason: 'not_found' };
        }
        
        if (collection[elementName].count < quantity) {
            return { success: false, reason: 'insufficient', available: collection[elementName].count };
        }
        
        // Remove from collection
        const removeResult = await db.removeElementFromCollection(elementName, quantity);
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
        console.error('Error selling element:', error);
        return { success: false, reason: 'error', error: error.message };
    }
}

export async function getElementCount(elementName) {
    try {
        const element = await db.getItem('collection', elementName);
        return element?.count || 0;
    } catch (error) {
        console.error('Error getting element count:', error);
        return 0;
    }
}

export async function getUniqueElementsCount() {
    try {
        const elements = await db.getAll('collection');
        return elements.length;
    } catch (error) {
        console.error('Error getting unique elements count:', error);
        return 0;
    }
}

export async function getTotalElementCount() {
    try {
        const elements = await db.getAll('collection');
        let total = 0;
        elements.forEach(element => {
            total += element.count || 1;
        });
        return total;
    } catch (error) {
        console.error('Error getting total element count:', error);
        return 0;
    }
}

// ===== CREDITS =====
export async function getCredits() {
    try {
        const player = await getPlayer();
        return player?.credits || 5000;
    } catch (error) {
        console.error('Error getting credits:', error);
        return 5000;
    }
}

export async function saveCredits(credits) {
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

export async function addCredits(amount) {
    try {
        const current = await getCredits();
        const newTotal = current + amount;
        await saveCredits(newTotal);
        
        // Update player stats
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

export async function spendCredits(amount) {
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

// ===== SHIP FUEL (keep in localStorage for quick access) =====
export function getShipFuel() {
    try {
        const fuel = localStorage.getItem(STORAGE_KEYS.SHIP_FUEL);
        return fuel ? parseInt(fuel) : 100;
    } catch (error) {
        console.error('Error getting ship fuel:', error);
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

export function useFuel(amount) {
    try {
        const current = getShipFuel();
        if (current >= amount) {
            saveShipFuel(current - amount);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error using fuel:', error);
        return false;
    }
}

export function refuelShip(amount) {
    try {
        const current = getShipFuel();
        saveShipFuel(Math.min(100, current + amount));
    } catch (error) {
        console.error('Error refueling ship:', error);
    }
}

// ===== SHIP POWER (keep in localStorage for quick access) =====
export function getShipPower() {
    try {
        const power = localStorage.getItem(STORAGE_KEYS.SHIP_POWER);
        return power ? parseInt(power) : 100;
    } catch (error) {
        console.error('Error getting ship power:', error);
        return 100;
    }
}

export function setShipPower(power) {
    try {
        localStorage.setItem(STORAGE_KEYS.SHIP_POWER, power.toString());
    } catch (error) {
        console.error('Error setting ship power:', error);
    }
}

export function usePower(amount) {
    try {
        const current = getShipPower();
        if (current >= amount) {
            setShipPower(current - amount);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error using power:', error);
        return false;
    }
}

export function repairShip(amount) {
    try {
        const current = getShipPower();
        setShipPower(Math.min(100, current + amount));
    } catch (error) {
        console.error('Error repairing ship:', error);
    }
}

// ===== LOCATION DATA - GALAXY LEVEL (keep in localStorage) =====
export function getCurrentSector() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR) || 'B2';
}

export function getCurrentRegion() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_REGION) || 'Orion Arm';
}

export function setCurrentSector(sector, region) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR, sector);
    localStorage.setItem(STORAGE_KEYS.CURRENT_REGION, region);
}

// ===== LOCATION DATA - STAR SECTOR LEVEL (keep in localStorage) =====
export function getCurrentStarSector() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_SECTOR) || 'Orion Molecular Cloud';
}

export function getCurrentSectorName() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR_NAME) || 'Orion Molecular Cloud';
}

export function getCurrentSectorType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR_TYPE) || 'Star-forming';
}

export function getCurrentSectorStars() {
    const stars = localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR_STARS);
    return stars ? parseInt(stars) : 85;
}

export function getCurrentSectorCoords() {
    const x = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR_X)) || 30;
    const y = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR_Y)) || 40;
    return { x, y };
}

export function setCurrentStarSector(name, type, stars, x, y) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_SECTOR, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_NAME, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_TYPE, type);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_STARS, stars.toString());
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_X, x.toString());
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_Y, y.toString());
}

// ===== LOCATION DATA - STAR LEVEL (keep in localStorage) =====
export function getCurrentStar() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR) || 'Sol';
}

export function getCurrentStarType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_TYPE) || 'Main Sequence';
}

export function getCurrentStarIndex() {
    const index = localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_INDEX);
    return index ? parseInt(index) : 0;
}

export function getCurrentStarCoords() {
    const x = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_X)) || 50;
    const y = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_Y)) || 50;
    return { x, y };
}

export function getCurrentStarPlanets() {
    const planets = localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_PLANETS);
    return planets || '5 planets';
}

export function setCurrentStar(name, type, index, planets, x, y) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STAR, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_TYPE, type);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_INDEX, index.toString());
    localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_PLANETS, planets);
    if (x) localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_X, x.toString());
    if (y) localStorage.setItem(STORAGE_KEYS.CURRENT_STAR_Y, y.toString());
}

// ===== LOCATION DATA - PLANET LEVEL (keep in localStorage) =====
export function getCurrentPlanet() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Earth';
}

export function getCurrentPlanetType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_TYPE) || 'lush';
}

export function getCurrentPlanetResources() {
    const resources = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES);
    return resources ? JSON.parse(resources) : ['Iron', 'Carbon', 'Silicon'];
}

export function getCurrentPlanetImage() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_IMAGE) || 'earth-view.jpg';
}

export function setCurrentPlanet(name, type, resources) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_TYPE, type);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES, JSON.stringify(resources));
    
    // Set appropriate image based on planet type
    let image = 'earth-view.jpg';
    if (type.includes('scorched') || type.includes('volcanic')) image = 'pyros-surface.jpg';
    else if (type.includes('frozen') || type.includes('ice')) image = 'glacier-surface.jpg';
    else if (type.includes('lush')) image = 'verdant-surface.jpg';
    else if (type.includes('barren')) image = 'barren-surface.jpg';
    else if (type.includes('gas')) image = 'gas-surface.jpg';
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_IMAGE, image);
}

// ===== SET CURRENT LOCATION (ALL LEVELS) =====
export function setCurrentLocation(region, sector, starSector, starSectorType, starSectorStars, starSectorX, starSectorY) {
    // Galaxy level
    setCurrentSector(sector, region);
    
    // Star sector level
    if (starSector) {
        setCurrentStarSector(starSector, starSectorType || 'Unknown', starSectorStars || 50, starSectorX || 30, starSectorY || 40);
    }
}

// ===== WARP DATA (keep in localStorage) =====
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
    localStorage.removeItem(STORAGE_KEYS.WARP_DESTINATION);
    localStorage.removeItem(STORAGE_KEYS.WARP_RETURN);
    localStorage.removeItem(STORAGE_KEYS.WARP_CYCLES);
    localStorage.removeItem(STORAGE_KEYS.WARP_DISTANCE);
    localStorage.removeItem(STORAGE_KEYS.WARP_FUEL);
}

// ===== COLONIES =====
export async function getColonies() {
    return await db.getAll('colonies');
}

export async function saveColonies(colonies) {
    const dbConn = await db.getDb();
    const tx = dbConn.transaction('colonies', 'readwrite');
    await tx.objectStore('colonies').clear();
    
    for (const colony of colonies) {
        await tx.objectStore('colonies').put(colony);
    }
    await tx.done;
}

export async function addColony(name, planet, star, starSector, sector) {
    const colony = {
        id: 'colony_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: name,
        planet: planet,
        star: star,
        starSector: starSector,
        sector: sector,
        established: new Date().toISOString()
    };
    
    await db.setItem('colonies', colony);
    
    // Also update the full colonies list for backward compatibility
    const colonies = await getColonies();
    return colonies;
}

export async function removeColony(colonyId) {
    await db.deleteItem('colonies', colonyId);
    return await getColonies();
}

// ===== MISSIONS =====
export async function getMissions() {
    return await db.getAll('missions');
}

export async function saveMissions(missions) {
    const dbConn = await db.getDb();
    const tx = dbConn.transaction('missions', 'readwrite');
    await tx.objectStore('missions').clear();
    
    for (const mission of missions) {
        await tx.objectStore('missions').put(mission);
    }
    await tx.done;
}

export async function getCompletedMissions() {
    return await db.getAll('completedMissions');
}

export async function saveCompletedMissions(missions) {
    const dbConn = await db.getDb();
    const tx = dbConn.transaction('completedMissions', 'readwrite');
    await tx.objectStore('completedMissions').clear();
    
    for (const mission of missions) {
        await tx.objectStore('completedMissions').put(mission);
    }
    await tx.done;
}

export async function updateMissionProgress(elementName, count = 1) {
    const missions = await getMissions();
    let updated = false;
    
    for (const mission of missions) {
        if (mission.element === elementName && mission.current < mission.target) {
            mission.current = Math.min(mission.current + count, mission.target);
            updated = true;
        }
    }
    
    if (updated) {
        await saveMissions(missions);
    }
    
    return updated;
}

// ===== SCAN HISTORY =====
export async function getScanHistory() {
    const scans = await db.getAll('scanHistory');
    return scans.sort((a, b) => b.timestamp - a.timestamp);
}

export async function addScan(scanData) {
    const scan = {
        timestamp: Date.now(),
        ...scanData,
        date: new Date().toISOString()
    };
    
    await db.setItem('scanHistory', scan);
    
    // Keep only last 10 scans by cleaning up older ones
    const allScans = await getScanHistory();
    if (allScans.length > 10) {
        const toDelete = allScans.slice(10);
        for (const scan of toDelete) {
            await db.deleteItem('scanHistory', scan.timestamp);
        }
    }
    
    return await getScanHistory();
}

export async function clearScanHistory() {
    const dbConn = await db.getDb();
    await dbConn.clear('scanHistory');
}

// ===== REAL ESTATE =====
export async function getRealEstate() {
    const properties = await db.getAllProperties();
    return { properties: properties };
}

export async function saveRealEstate(realEstateData) {
    // This is a bulk operation
    const dbConn = await db.getDb();
    const tx = dbConn.transaction(['properties', 'propertyItems'], 'readwrite');
    
    // Clear existing properties
    await tx.objectStore('properties').clear();
    await tx.objectStore('propertyItems').clear();
    
    // Save all properties
    for (const property of realEstateData.properties || []) {
        await tx.objectStore('properties').put(property);
        
        // Save property items
        if (property.items) {
            for (const [elementName, itemData] of Object.entries(property.items)) {
                await tx.objectStore('propertyItems').put({
                    id: `item_${property.id}_${elementName}`,
                    propertyId: property.id,
                    elementName: elementName,
                    count: itemData.count || 1,
                    mass: getElementMass(elementName)
                });
            }
        }
    }
    
    await tx.done;
    saveTimestamp();
}

export async function addProperty(propertyData) {
    return await db.addProperty(propertyData);
}

export async function getProperty(propertyId) {
    return await db.getProperty(propertyId);
}

export async function updateProperty(propertyId, updates) {
    return await db.updateProperty(propertyId, updates);
}

export async function deleteProperty(propertyId) {
    const dbConn = await db.getDb();
    const tx = dbConn.transaction(['properties', 'propertyItems'], 'readwrite');
    
    await tx.objectStore('properties').delete(propertyId);
    
    // Delete all items for this property
    const items = await tx.objectStore('propertyItems').index('by-propertyId').getAll(propertyId);
    for (const item of items) {
        await tx.objectStore('propertyItems').delete(item.id);
    }
    
    await tx.done;
    return true;
}

export async function transferToProperty(propertyId, elementName, quantity) {
    // Check if we have enough of the element in ship cargo
    const collection = await getCollection();
    if (!collection[elementName] || collection[elementName].count < quantity) {
        return { success: false, reason: 'insufficient_elements', available: collection[elementName]?.count || 0 };
    }
    
    return await db.addItemToProperty(propertyId, elementName, quantity);
}

export async function transferFromProperty(propertyId, elementName, quantity) {
    const dbConn = await db.getDb();
    const tx = dbConn.transaction(['properties', 'propertyItems', 'collection'], 'readwrite');
    
    const propertyStore = tx.objectStore('properties');
    const itemsStore = tx.objectStore('propertyItems');
    const collectionStore = tx.objectStore('collection');
    
    // Get property
    const property = await propertyStore.get(propertyId);
    if (!property) {
        await tx.done;
        return { success: false, reason: 'property_not_found' };
    }
    
    // Find the item
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
    
    // Check if there's enough cargo space on ship
    const elementMass = getElementMass(elementName);
    const currentShipMass = await getTotalCargoMass();
    const player = await getPlayer();
    const shipMassLimit = player?.cargoMassLimit || CARGO_MASS_LIMIT;
    
    if (currentShipMass + (elementMass * quantity) > shipMassLimit) {
        await tx.done;
        return { 
            success: false, 
            reason: 'insufficient_cargo_space',
            remainingMass: shipMassLimit - currentShipMass,
            elementMass: elementMass
        };
    }
    
    // Update or delete the property item
    item.count -= quantity;
    if (item.count <= 0) {
        await itemsStore.delete(item.id);
    } else {
        await itemsStore.put(item);
    }
    
    // Add to ship collection
    let collectionItem = await collectionStore.get(elementName);
    if (!collectionItem) {
        collectionItem = {
            name: elementName,
            count: quantity,
            firstFound: new Date().toISOString(),
            mass: elementMass
        };
    } else {
        collectionItem.count += quantity;
    }
    await collectionStore.put(collectionItem);
    
    // Update property used space
    const remainingItems = await itemsStore.index('by-propertyId').getAll(propertyId);
    property.used = remainingItems.reduce((sum, i) => sum + (i.count * (i.mass || getElementMass(i.elementName))), 0);
    await propertyStore.put(property);
    
    await tx.done;
    return { success: true };
}

export async function getTotalPropertyCapacity() {
    const properties = await db.getAllProperties();
    let totalCapacity = 0;
    let totalUsed = 0;
    
    properties.forEach(prop => {
        totalCapacity += prop.capacity || 0;
        totalUsed += prop.used || 0;
    });
    
    return { totalCapacity, totalUsed };
}

// ===== TAX TRANSACTIONS =====
export async function addTaxRecord(record) {
    return await db.addTaxTransaction(record);
}

export async function getTaxHistory(playerId, limit = 100) {
    if (playerId) {
        return await db.getPlayerTransactions(playerId, limit);
    }
    const all = await db.getAll('taxTransactions');
    return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
}

// ===== SETTINGS (keep in localStorage) =====
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

export function getOrbitSpeed() {
    return localStorage.getItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED) || 'gentle';
}

export function setOrbitSpeed(speed) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_ORBIT_SPEED, speed);
}

export function getMusicVolume() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.SETTINGS_MUSIC)) || 50;
}

export function setMusicVolume(volume) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_MUSIC, volume.toString());
}

export function getAmbientVolume() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.SETTINGS_AMBIENT)) || 50;
}

export function setAmbientVolume(volume) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_AMBIENT, volume.toString());
}

// ===== SHIP UPGRADES =====
export async function getShipUpgrades() {
    const upgrades = await db.getItem('shipUpgrades', 'current');
    return upgrades || {
        engine: 1,
        shields: 1,
        miningLaser: 1,
        cargoHold: 1,
        warpDrive: 1,
        scanner: 1
    };
}

export async function saveShipUpgrades(upgrades) {
    await db.setItem('shipUpgrades', { id: 'current', ...upgrades });
}

export async function upgradeShip(component) {
    const upgrades = await getShipUpgrades();
    if (upgrades[component] < 5) {
        upgrades[component]++;
        await saveShipUpgrades(upgrades);
        
        // If upgrading cargo hold, increase mass limit
        if (component === 'cargoHold') {
            await upgradeCargoHold(upgrades[component]);
        }
        
        return true;
    }
    return false;
}

// Special function for cargo hold upgrades to increase mass limit
async function upgradeCargoHold(newLevel) {
    const player = await getPlayer();
    if (player) {
        // Base limit 5000, increase by 1000 per level
        player.cargoMassLimit = CARGO_MASS_LIMIT + (newLevel - 1) * 1000;
        await savePlayer(player);
    }
}

// ===== SAVE TIMESTAMP =====
export function saveTimestamp() {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
}

export function getLastSaveTime() {
    return localStorage.getItem(STORAGE_KEYS.LAST_SAVE);
}

// ===== RESET GAME =====
export async function resetGame() {
    // Keep settings
    const settings = {
        haptics: getHapticsEnabled(),
        autoGather: getAutoGatherEnabled(),
        orbitSpeed: getOrbitSpeed(),
        music: getMusicVolume(),
        ambient: getAmbientVolume()
    };
    
    // Clear all IndexedDB data
    await db.resetAllData();
    
    // Clear location data from localStorage
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
    
    // Restore settings
    setHapticsEnabled(settings.haptics);
    setAutoGatherEnabled(settings.autoGather);
    setOrbitSpeed(settings.orbitSpeed);
    setMusicVolume(settings.music);
    setAmbientVolume(settings.ambient);
    
    // Re-initialize
    await initializeStorage();
}

// ===== EXPORT / UTILITY =====
export async function exportGameData() {
    const gameData = {
        version: '2.0',
        exportDate: new Date().toISOString(),
        universeSeed: UNIVERSE_SEED,
        player: await getPlayer(),
        collection: await getCollection(),
        missions: await getMissions(),
        completedMissions: await getCompletedMissions(),
        colonies: await getColonies(),
        realEstate: await getRealEstate(),
        taxTransactions: await db.getAll('taxTransactions'),
        dailyMetrics: await db.getAll('dailyMetrics'),
        activeEvents: await db.getAll('activeEvents'),
        shipUpgrades: await getShipUpgrades(),
        cargoMassLimit: CARGO_MASS_LIMIT,
        
        // Include localStorage settings
        settings: {
            haptics: getHapticsEnabled(),
            autoGather: getAutoGatherEnabled(),
            orbitSpeed: getOrbitSpeed(),
            music: getMusicVolume(),
            ambient: getAmbientVolume()
        },
        
        // Include current location
        location: {
            sector: getCurrentSector(),
            region: getCurrentRegion(),
            starSector: getCurrentStarSector(),
            star: getCurrentStar(),
            planet: getCurrentPlanet(),
            planetImage: getCurrentPlanetImage()
        }
    };
    
    return JSON.stringify(gameData, null, 2);
}

export async function importGameData(jsonString) {
    try {
        const gameData = JSON.parse(jsonString);
        
        // Restore data to IndexedDB
        if (gameData.player) await db.setItem('player', { id: 'main', ...gameData.player });
        
        if (gameData.collection) {
            const collection = gameData.collection;
            for (const [name, data] of Object.entries(collection)) {
                await db.setItem('collection', {
                    name: name,
                    count: data.count || 1,
                    firstFound: data.firstFound || new Date().toISOString(),
                    mass: getElementMass(name)
                });
            }
        }
        
        if (gameData.missions) {
            for (const mission of gameData.missions) {
                await db.setItem('missions', mission);
            }
        }
        
        if (gameData.completedMissions) {
            for (const mission of gameData.completedMissions) {
                await db.setItem('completedMissions', mission);
            }
        }
        
        if (gameData.realEstate) {
            await saveRealEstate(gameData.realEstate);
        }
        
        if (gameData.taxTransactions) {
            for (const tx of gameData.taxTransactions) {
                await db.setItem('taxTransactions', tx);
            }
        }
        
        // Restore settings
        if (gameData.settings) {
            setHapticsEnabled(gameData.settings.haptics);
            setAutoGatherEnabled(gameData.settings.autoGather);
            setOrbitSpeed(gameData.settings.orbitSpeed);
            setMusicVolume(gameData.settings.music);
            setAmbientVolume(gameData.settings.ambient);
        }
        
        // Restore location
        if (gameData.location) {
            setCurrentSector(gameData.location.sector, gameData.location.region);
            setCurrentStarSector(gameData.location.starSector, 'Unknown', 50, 30, 40);
            setCurrentStar(gameData.location.star, 'Unknown', 0, '5 planets');
            setCurrentPlanet(gameData.location.planet, 'lush', ['Iron', 'Carbon', 'Silicon']);
        }
        
        return true;
    } catch (e) {
        console.error('Import failed:', e);
        return false;
    }
}

// ===== PLAYER ID MANAGEMENT =====
export function getPlayerId() {
    let playerId = localStorage.getItem('voidfarer_player_id');
    if (!playerId) {
        playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        localStorage.setItem('voidfarer_player_id', playerId);
    }
    return playerId;
}

export async function getPlayerName() {
    const player = await getPlayer();
    return player?.name || 'Voidfarer';
}

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE FOR HTML =====
window.getCredits = getCredits;
window.getCollection = getCollection;
window.addElementToCollection = addElementToCollection;
window.removeElementFromCollection = removeElementFromCollection;
window.getElementMass = getElementMass;
window.getPlayer = getPlayer;
window.savePlayer = savePlayer;
window.addCredits = addCredits;
window.spendCredits = spendCredits;
window.safeSellElement = safeSellElement;
window.getShipFuel = getShipFuel;
window.getShipPower = getShipPower;
window.getCurrentSector = getCurrentSector;
window.getCurrentRegion = getCurrentRegion;
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
window.getTotalCargoMass = getTotalCargoMass;
window.getRemainingCargoMass = getRemainingCargoMass;
window.refuelShip = refuelShip;
window.repairShip = repairShip;

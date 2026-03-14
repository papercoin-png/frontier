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
    EVENT_HISTORY: 'voidfarer_event_history'
};

// ===== ELEMENT MASS DATABASE =====
const ELEMENT_MASS = {
    'Hydrogen': 1.008, 'Helium': 4.003, 'Lithium': 6.94, 'Beryllium': 9.012,
    'Boron': 10.81, 'Sodium': 22.99, 'Magnesium': 24.31, 'Aluminum': 26.98,
    'Silicon': 28.09, 'Potassium': 39.10, 'Calcium': 40.08,
    'Carbon': 12.01, 'Nitrogen': 14.01, 'Oxygen': 16.00, 'Fluorine': 19.00,
    'Neon': 20.18, 'Phosphorus': 30.97, 'Sulfur': 32.06, 'Chlorine': 35.45,
    'Argon': 39.95, 'Iron': 55.85, 'Nickel': 58.69, 'Lead': 207.2,
    'Scandium': 44.96, 'Titanium': 47.87, 'Vanadium': 50.94, 'Chromium': 52.00,
    'Manganese': 54.94, 'Cobalt': 58.93, 'Copper': 63.55, 'Zinc': 65.38,
    'Gallium': 69.72, 'Germanium': 72.63, 'Arsenic': 74.92, 'Selenium': 78.97,
    'Bromine': 79.90, 'Krypton': 83.80, 'Rubidium': 85.47, 'Strontium': 87.62,
    'Yttrium': 88.91, 'Zirconium': 91.22, 'Niobium': 92.91, 'Molybdenum': 95.95,
    'Ruthenium': 101.1, 'Rhodium': 102.9, 'Palladium': 106.4, 'Silver': 107.9,
    'Cadmium': 112.4, 'Indium': 114.8, 'Tin': 118.7, 'Antimony': 121.8,
    'Tellurium': 127.6, 'Iodine': 126.9, 'Xenon': 131.3, 'Cesium': 132.9,
    'Barium': 137.3, 'Lanthanum': 138.9, 'Cerium': 140.1, 'Praseodymium': 140.9,
    'Neodymium': 144.2, 'Samarium': 150.4, 'Europium': 152.0, 'Gadolinium': 157.3,
    'Terbium': 158.9, 'Dysprosium': 162.5, 'Holmium': 164.9, 'Erbium': 167.3,
    'Thulium': 168.9, 'Ytterbium': 173.0, 'Lutetium': 175.0, 'Hafnium': 178.5,
    'Tantalum': 180.9, 'Tungsten': 183.8, 'Rhenium': 186.2, 'Osmium': 190.2,
    'Iridium': 192.2, 'Platinum': 195.1, 'Gold': 197.0, 'Mercury': 200.6,
    'Thallium': 204.4, 'Bismuth': 209.0,
    'Polonium': 209.0, 'Radon': 222.0, 'Radium': 226.0, 'Actinium': 227.0,
    'Thorium': 232.0, 'Protactinium': 231.0, 'Uranium': 238.0,
    'Technetium': 98.0, 'Promethium': 145.0, 'Astatine': 210.0, 'Francium': 223.0,
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
            totalMass += (data.count || 1) * getElementMass(name);
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

// ===== CURRENT PLANET HELPER (SIMPLIFIED) =====
function getCurrentPlanetName() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Unknown';
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
            cargoMassLimit: getCargoMassLimit()
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

// FIXED: Renamed internal function to avoid recursion
async function _addElementToCollection(elementName, count = 1) {
    try {
        const db = window.getDb ? await window.getDb() : await idb.openDB('VoidfarerDB', 1);
        const tx = db.transaction('collection', 'readwrite');
        const store = tx.objectStore('collection');
        
        let element = await store.get(elementName);
        
        if (!element) {
            element = {
                name: elementName,
                count: count,
                firstFound: new Date().toISOString(),
                rarity: 'common',
                value: 100
            };
        } else {
            element.count = (element.count || 1) + count;
        }
        
        await store.put(element);
        await tx.done;
        
        return { success: true, count: element.count };
        
    } catch (error) {
        console.error('Error in _addElementToCollection:', error);
        return { success: false, error: error.message };
    }
}

// FIXED: Renamed internal function to avoid recursion
async function _removeElementFromCollection(elementName, count = 1) {
    try {
        const db = window.getDb ? await window.getDb() : await idb.openDB('VoidfarerDB', 1);
        const tx = db.transaction('collection', 'readwrite');
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
        console.error('Error in _removeElementFromCollection:', error);
        return { success: false, error: error.message };
    }
}

// Public wrapper functions - SIMPLIFIED: only mines on planetary surfaces need location
async function addElementToCollection(elementName, count = 1, locationData = null) {
    try {
        const result = await _addElementToCollection(elementName, count);
        
        if (result && result.success) {
            // Update player stats
            const player = await getPlayer();
            if (player) {
                player.totalElementsCollected = (player.totalElementsCollected || 0) + count;
                await savePlayer(player);
            }
            
            // Save location data ONLY if it's from planetary mining
            // This preserves the journal for elements found on surfaces
            if (locationData && typeof window.saveElementLocation === 'function') {
                // Extract just the planet name (simplified)
                const planetName = locationData.planet || getCurrentPlanetName();
                
                try {
                    await window.saveElementLocation(elementName, planetName, { planet: planetName });
                    console.log(`📍 Journal entry: ${elementName} found on ${planetName}`);
                } catch (locError) {
                    console.error('Failed to save location:', locError);
                }
            }
            
            return { success: true, newCount: result.count };
        }
        return { success: false, reason: 'database_error', error: result?.error };
    } catch (error) {
        console.error('Error in addElementToCollection:', error);
        return { success: false, reason: 'error', error: error.message };
    }
}

async function removeElementFromCollection(elementName, count = 1) {
    return await _removeElementFromCollection(elementName, count);
}

// ===== SAFE SELL ELEMENT =====
async function safeSellElement(elementName, quantity, pricePerUnit) {
    try {
        console.log('safeSellElement called:', elementName, quantity, pricePerUnit);
        const collection = await getCollection();
        const credits = await getCredits();
        
        console.log('Current collection:', collection);
        console.log('Current credits:', credits);
        
        if (!collection[elementName]) {
            return { success: false, reason: 'not_found' };
        }
        
        const availableCount = collection[elementName].count || 1;
        if (availableCount < quantity) {
            return { success: false, reason: 'insufficient', available: availableCount };
        }
        
        // Remove from collection using internal function
        const removeResult = await _removeElementFromCollection(elementName, quantity);
        console.log('Remove result:', removeResult);
        
        if (!removeResult.success) {
            return removeResult;
        }
        
        // Add credits
        const earnings = quantity * pricePerUnit;
        const newCredits = credits + earnings;
        await saveCredits(newCredits);
        
        console.log('New credits:', newCredits);
        
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

function getCurrentPlanetType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_TYPE) || 'lush';
}

function getCurrentPlanetResources() {
    const resources = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES);
    return resources ? JSON.parse(resources) : ['Iron', 'Carbon', 'Silicon'];
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

// ===== ELEMENT LOCATIONS HELPERS (SIMPLIFIED WRAPPERS) =====
async function saveElementLocation(elementName, planetName, locationData = {}) {
    try {
        // This function now lives in db.js, we provide a wrapper here
        if (typeof window.saveElementLocation === 'function') {
            // Pass only the essential data - planet name
            const planet = planetName || locationData.planet || getCurrentPlanetName();
            return await window.saveElementLocation(elementName, planet, { planet: planet });
        }
        return false;
    } catch (error) {
        console.error('Error in saveElementLocation wrapper:', error);
        return false;
    }
}

async function getElementLocations(elementName) {
    try {
        if (typeof window.getElementLocations === 'function') {
            return await window.getElementLocations(elementName);
        }
        return [];
    } catch (error) {
        console.error('Error in getElementLocations wrapper:', error);
        return [];
    }
}

async function getPlayerLocations() {
    try {
        if (typeof window.getPlayerLocations === 'function') {
            return await window.getPlayerLocations();
        }
        return [];
    } catch (error) {
        console.error('Error in getPlayerLocations wrapper:', error);
        return [];
    }
}

async function getUniquePlanetsForElement(elementName) {
    try {
        if (typeof window.getUniquePlanetsForElement === 'function') {
            return await window.getUniquePlanetsForElement(elementName);
        }
        return [];
    } catch (error) {
        console.error('Error in getUniquePlanetsForElement wrapper:', error);
        return [];
    }
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
window.initializeStorage = initializeStorage;
window.getPlayer = getPlayer;
window.savePlayer = savePlayer;
window.createDefaultPlayer = createDefaultPlayer;
window.getCollection = getCollection;
window.addElementToCollection = addElementToCollection;
window.removeElementFromCollection = removeElementFromCollection;
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

// Location helpers (simplified)
window.saveElementLocation = saveElementLocation;
window.getElementLocations = getElementLocations;
window.getPlayerLocations = getPlayerLocations;
window.getUniquePlanetsForElement = getUniquePlanetsForElement;

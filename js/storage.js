// js/storage.js - Save/load player progress for Voidfarer
// Now using IndexedDB via db.js for unlimited storage

import { 
  getItem,
  getAll,
  setItem,
  deleteItem,
  getCollectionAsObject,
  addElementToCollection as dbAddElement,
  removeElementFromCollection as dbRemoveElement,
  getAllProperties,
  getProperty,
  addProperty as dbAddProperty,
  updateProperty as dbUpdateProperty,
  getPropertyItems,
  addItemToProperty as dbAddItemToProperty,
  addTaxTransaction as dbAddTaxTransaction,
  getPlayerTransactions,
  isMigrationComplete,
  resetAllData as dbResetAll
} from './db.js';

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
    
    // Location data - Nebula/Sector level
    CURRENT_NEBULA: 'voidfarer_current_nebula',
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
        setCurrentLocation('Orion', 'B2', 'Orion Molecular Cloud');
    }
}

// ===== PLAYER DATA =====
export async function getPlayer() {
    return await getItem('player', 'main');
}

export async function savePlayer(playerData) {
    await setItem('player', { id: 'main', ...playerData });
    saveTimestamp();
}

export async function createDefaultPlayer(name = 'Voidfarer') {
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
        credits: 5000
    };
    await savePlayer(player);
    return player;
}

// ===== COLLECTION DATA =====
export async function getCollection() {
    return await getCollectionAsObject();
}

export async function saveCollection(collection) {
    // This is a bulk operation - convert object back to individual records
    const elements = [];
    for (const [name, data] of Object.entries(collection)) {
        elements.push({
            name: name,
            count: data.count || 1,
            firstFound: data.firstFound || new Date().toISOString(),
            rarity: data.rarity || 'common',
            value: data.value || 100
        });
    }
    
    // Clear and rebuild (simpler than diffing)
    const db = await getDb();
    const tx = db.transaction('collection', 'readwrite');
    await tx.objectStore('collection').clear();
    
    for (const element of elements) {
        await tx.objectStore('collection').put(element);
    }
    await tx.done;
    
    saveTimestamp();
}

export async function addElementToCollection(elementName, count = 1) {
    const result = await dbAddElement(elementName, count);
    
    // Update player stats
    const player = await getPlayer();
    if (player) {
        player.totalElementsCollected = (player.totalElementsCollected || 0) + count;
        await savePlayer(player);
    }
    
    return { success: true, newCount: result.count };
}

export async function removeElementFromCollection(elementName, count = 1) {
    return await dbRemoveElement(elementName, count);
}

export async function safeSellElement(elementName, quantity, pricePerUnit) {
    const collection = await getCollection();
    const credits = await getCredits();
    
    if (!collection[elementName]) {
        return { success: false, reason: 'not_found' };
    }
    
    if (collection[elementName].count < quantity) {
        return { success: false, reason: 'insufficient', available: collection[elementName].count };
    }
    
    // Remove from collection
    const removeResult = await dbRemoveElement(elementName, quantity);
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
}

export async function getElementCount(elementName) {
    const element = await getItem('collection', elementName);
    return element?.count || 0;
}

export async function getUniqueElementsCount() {
    const elements = await getAll('collection');
    return elements.length;
}

export async function getTotalElementCount() {
    const elements = await getAll('collection');
    let total = 0;
    elements.forEach(element => {
        total += element.count || 1;
    });
    return total;
}

// ===== CREDITS =====
export async function getCredits() {
    const player = await getPlayer();
    return player?.credits || 5000;
}

export async function saveCredits(credits) {
    const player = await getPlayer();
    if (player) {
        player.credits = credits;
        await savePlayer(player);
    }
    saveTimestamp();
}

export async function addCredits(amount) {
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
}

export async function spendCredits(amount) {
    const current = await getCredits();
    if (current >= amount) {
        await saveCredits(current - amount);
        return true;
    }
    return false;
}

// ===== SHIP FUEL (keep in localStorage for quick access) =====
export function getShipFuel() {
    const fuel = localStorage.getItem(STORAGE_KEYS.SHIP_FUEL);
    return fuel ? parseInt(fuel) : 100;
}

export function saveShipFuel(fuel) {
    localStorage.setItem(STORAGE_KEYS.SHIP_FUEL, fuel.toString());
}

export function useFuel(amount) {
    const current = getShipFuel();
    if (current >= amount) {
        saveShipFuel(current - amount);
        return true;
    }
    return false;
}

export function refuelShip(amount) {
    const current = getShipFuel();
    saveShipFuel(Math.min(100, current + amount));
}

// ===== SHIP POWER (keep in localStorage for quick access) =====
export function getShipPower() {
    const power = localStorage.getItem(STORAGE_KEYS.SHIP_POWER);
    return power ? parseInt(power) : 100;
}

export function setShipPower(power) {
    localStorage.setItem(STORAGE_KEYS.SHIP_POWER, power.toString());
}

export function usePower(amount) {
    const current = getShipPower();
    if (current >= amount) {
        setShipPower(current - amount);
        return true;
    }
    return false;
}

export function repairShip(amount) {
    const current = getShipPower();
    setShipPower(Math.min(100, current + amount));
}

// ===== LOCATION DATA - GALAXY LEVEL (keep in localStorage) =====
export function getCurrentSector() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SECTOR) || 'B2';
}

export function getCurrentRegion() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_REGION) || 'Orion';
}

export function setCurrentSector(sector, region) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR, sector);
    localStorage.setItem(STORAGE_KEYS.CURRENT_REGION, region);
}

// ===== LOCATION DATA - NEBULA/SECTOR LEVEL (keep in localStorage) =====
export function getCurrentNebula() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_NEBULA) || 'Orion Molecular Cloud';
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

export function setCurrentNebula(name, type, stars, x, y) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_NEBULA, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_NAME, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_TYPE, type);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_STARS, stars.toString());
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_X, x.toString());
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTOR_Y, y.toString());
}

// ===== LOCATION DATA - STAR LEVEL (keep in localStorage) =====
export function getCurrentStar() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR) || '';
}

export function getCurrentStarType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_TYPE) || '';
}

export function getCurrentStarIndex() {
    const index = localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_INDEX);
    return index ? parseInt(index) : -1;
}

export function getCurrentStarCoords() {
    const x = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_X)) || 50;
    const y = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_Y)) || 50;
    return { x, y };
}

export function getCurrentStarPlanets() {
    const planets = localStorage.getItem(STORAGE_KEYS.CURRENT_STAR_PLANETS);
    return planets || '3-7';
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
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET) || 'Verdant Prime';
}

export function getCurrentPlanetType() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_TYPE) || 'lush';
}

export function getCurrentPlanetResources() {
    const resources = localStorage.getItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES);
    return resources ? JSON.parse(resources) : ['Carbon', 'Iron', 'Silicon'];
}

export function setCurrentPlanet(name, type, resources) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET, name);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_TYPE, type);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLANET_RESOURCES, JSON.stringify(resources));
}

// ===== SET CURRENT LOCATION (ALL LEVELS) =====
export function setCurrentLocation(region, sector, nebula, nebulaType, nebulaStars, nebulaX, nebulaY) {
    // Galaxy level
    setCurrentSector(sector, region);
    
    // Nebula level
    if (nebula) {
        setCurrentNebula(nebula, nebulaType || 'Unknown', nebulaStars || 50, nebulaX || 30, nebulaY || 40);
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
    return await getAll('colonies');
}

export async function saveColonies(colonies) {
    const db = await getDb();
    const tx = db.transaction('colonies', 'readwrite');
    await tx.objectStore('colonies').clear();
    
    for (const colony of colonies) {
        await tx.objectStore('colonies').put(colony);
    }
    await tx.done;
}

export async function addColony(name, planet, star, nebula, sector) {
    const colony = {
        id: 'colony_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: name,
        planet: planet,
        star: star,
        nebula: nebula,
        sector: sector,
        established: new Date().toISOString()
    };
    
    await setItem('colonies', colony);
    
    // Also update the full colonies list for backward compatibility
    const colonies = await getColonies();
    return colonies;
}

export async function removeColony(colonyId) {
    await deleteItem('colonies', colonyId);
    return await getColonies();
}

// ===== MISSIONS =====
export async function getMissions() {
    return await getAll('missions');
}

export async function saveMissions(missions) {
    const db = await getDb();
    const tx = db.transaction('missions', 'readwrite');
    await tx.objectStore('missions').clear();
    
    for (const mission of missions) {
        await tx.objectStore('missions').put(mission);
    }
    await tx.done;
}

export async function getCompletedMissions() {
    return await getAll('completedMissions');
}

export async function saveCompletedMissions(missions) {
    const db = await getDb();
    const tx = db.transaction('completedMissions', 'readwrite');
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
    const scans = await getAll('scanHistory');
    return scans.sort((a, b) => b.timestamp - a.timestamp);
}

export async function addScan(scanData) {
    const scan = {
        timestamp: Date.now(),
        ...scanData,
        date: new Date().toISOString()
    };
    
    await setItem('scanHistory', scan);
    
    // Keep only last 10 scans by cleaning up older ones
    const allScans = await getScanHistory();
    if (allScans.length > 10) {
        const toDelete = allScans.slice(10);
        for (const scan of toDelete) {
            await deleteItem('scanHistory', scan.timestamp);
        }
    }
    
    return await getScanHistory();
}

export async function clearScanHistory() {
    const db = await getDb();
    await db.clear('scanHistory');
}

// ===== REAL ESTATE =====
export async function getRealEstate() {
    const properties = await getAllProperties();
    return { properties: properties };
}

export async function saveRealEstate(realEstateData) {
    // This is a bulk operation
    const db = await getDb();
    const tx = db.transaction(['properties', 'propertyItems'], 'readwrite');
    
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
                    count: itemData.count || 1
                });
            }
        }
    }
    
    await tx.done;
    saveTimestamp();
}

export async function addProperty(propertyData) {
    return await dbAddProperty(propertyData);
}

export async function getProperty(propertyId) {
    return await getProperty(propertyId);
}

export async function updateProperty(propertyId, updates) {
    return await dbUpdateProperty(propertyId, updates);
}

export async function deleteProperty(propertyId) {
    const db = await getDb();
    const tx = db.transaction(['properties', 'propertyItems'], 'readwrite');
    
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
    return await dbAddItemToProperty(propertyId, elementName, quantity);
}

export async function transferFromProperty(propertyId, elementName, quantity) {
    const db = await getDb();
    const tx = db.transaction(['properties', 'propertyItems', 'collection'], 'readwrite');
    
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
            firstFound: new Date().toISOString()
        };
    } else {
        collectionItem.count += quantity;
    }
    await collectionStore.put(collectionItem);
    
    // Update property used space
    const remainingItems = await itemsStore.index('by-propertyId').getAll(propertyId);
    property.used = remainingItems.reduce((sum, i) => sum + i.count, 0);
    await propertyStore.put(property);
    
    await tx.done;
    return { success: true };
}

export async function getTotalPropertyCapacity() {
    const properties = await getAllProperties();
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
    return await dbAddTaxTransaction(record);
}

export async function getTaxHistory(playerId, limit = 100) {
    if (playerId) {
        return await getPlayerTransactions(playerId, limit);
    }
    const all = await getAll('taxTransactions');
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
    const upgrades = await getItem('shipUpgrades', 'current');
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
    await setItem('shipUpgrades', { id: 'current', ...upgrades });
}

export async function upgradeShip(component) {
    const upgrades = await getShipUpgrades();
    if (upgrades[component] < 5) {
        upgrades[component]++;
        await saveShipUpgrades(upgrades);
        return true;
    }
    return false;
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
    await dbResetAll();
    
    // Clear location data from localStorage
    const locationKeys = [
        STORAGE_KEYS.CURRENT_SECTOR,
        STORAGE_KEYS.CURRENT_REGION,
        STORAGE_KEYS.CURRENT_NEBULA,
        STORAGE_KEYS.CURRENT_SECTOR_NAME,
        STORAGE_KEYS.CURRENT_SECTOR_TYPE,
        STORAGE_KEYS.CURRENT_SECTOR_STARS,
        STORAGE_KEYS.CURRENT_SECTOR_X,
        STORAGE_KEYS.CURRENT_SECTOR_Y,
        STORAGE_KEYS.CURRENT_STAR,
        STORAGE_KEYS.CURRENT_STAR_TYPE,
        STORAGE_KEYS.CURRENT_STAR_INDEX,
        STORAGE_KEYS.CURRENT_PLANET,
        STORAGE_KEYS.CURRENT_PLANET_TYPE,
        STORAGE_KEYS.CURRENT_PLANET_RESOURCES
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
        version: '1.0',
        exportDate: new Date().toISOString(),
        universeSeed: UNIVERSE_SEED,
        player: await getPlayer(),
        collection: await getCollection(),
        missions: await getMissions(),
        completedMissions: await getCompletedMissions(),
        colonies: await getColonies(),
        realEstate: await getRealEstate(),
        taxTransactions: await getAll('taxTransactions'),
        dailyMetrics: await getAll('dailyMetrics'),
        activeEvents: await getAll('activeEvents'),
        shipUpgrades: await getShipUpgrades(),
        
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
            nebula: getCurrentNebula(),
            star: getCurrentStar(),
            planet: getCurrentPlanet()
        }
    };
    
    return JSON.stringify(gameData, null, 2);
}

export async function importGameData(jsonString) {
    try {
        const gameData = JSON.parse(jsonString);
        
        // Validate version/universe seed?
        
        // Restore data to IndexedDB
        if (gameData.player) await setItem('player', { id: 'main', ...gameData.player });
        
        if (gameData.collection) {
            const collection = gameData.collection;
            for (const [name, data] of Object.entries(collection)) {
                await setItem('collection', {
                    name: name,
                    count: data.count || 1,
                    firstFound: data.firstFound || new Date().toISOString()
                });
            }
        }
        
        if (gameData.missions) {
            for (const mission of gameData.missions) {
                await setItem('missions', mission);
            }
        }
        
        if (gameData.completedMissions) {
            for (const mission of gameData.completedMissions) {
                await setItem('completedMissions', mission);
            }
        }
        
        if (gameData.realEstate) {
            await saveRealEstate(gameData.realEstate);
        }
        
        if (gameData.taxTransactions) {
            for (const tx of gameData.taxTransactions) {
                await setItem('taxTransactions', tx);
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
            setCurrentNebula(gameData.location.nebula, 'Unknown', 50, 30, 40);
            setCurrentStar(gameData.location.star, 'Unknown', 0, '3-7');
            setCurrentPlanet(gameData.location.planet, 'lush', []);
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

// ===== INITIALIZE ON LOAD (but don't await - let app handle it) =====
// We'll export the initialization function and let the app call it

// Need to import getDb for some functions
import { getDb } from './db.js';

// js/migration.js - One-time migration from localStorage to IndexedDB

// ===== MIGRATION STATUS =====
let migrationInProgress = false;
let migrationLog = [];

// ===== LOGGING =====
function logMigration(message, type = 'info') {
  const entry = {
    timestamp: new Date().toISOString(),
    message: message,
    type: type
  };
  migrationLog.push(entry);
  console.log(`[Migration ${type}]: ${message}`);
}

// ===== HELPER: SAFE JSON PARSE =====
function safeJSONParse(data, defaultValue = null) {
  if (!data) return defaultValue;
  try {
    return JSON.parse(data);
  } catch (e) {
    logMigration(`Failed to parse JSON: ${e.message}`, 'error');
    return defaultValue;
  }
}

// ===== MIGRATE PLAYER DATA =====
async function migratePlayer() {
  logMigration('Migrating player data...');
  
  const playerData = localStorage.getItem('voidfarer_player');
  if (playerData) {
    const player = safeJSONParse(playerData);
    if (player) {
      await window.setItem('player', { 
        id: 'main', 
        ...player,
        migratedAt: new Date().toISOString()
      });
      logMigration(`Player "${player.name || 'Voidfarer'}" migrated`);
      return true;
    }
  } else {
    await window.setItem('player', {
      id: 'main',
      name: 'Voidfarer',
      ship: 'Prospector',
      shipLevel: 1,
      created: new Date().toISOString(),
      lastPlayed: new Date().toISOString(),
      playTime: 0,
      totalElementsCollected: 0,
      totalCreditsEarned: 5000,
      totalDistanceTraveled: 0,
      totalWarps: 0,
      migratedAt: new Date().toISOString()
    });
    logMigration('Created default player', 'warning');
  }
  return false;
}

// ===== MIGRATE COLLECTION DATA =====
async function migrateCollection() {
  logMigration('Migrating element collection...');
  
  const collectionData = localStorage.getItem('voidfarer_collection');
  if (collectionData) {
    const collection = safeJSONParse(collectionData, {});
    let count = 0;
    
    for (const [elementName, elementInfo] of Object.entries(collection)) {
      let count_value = 1;
      let firstFound = null;
      
      if (typeof elementInfo === 'object' && elementInfo !== null) {
        count_value = elementInfo.count || 1;
        firstFound = elementInfo.firstFound;
      } else if (typeof elementInfo === 'number') {
        count_value = elementInfo;
      }
      
      await window.addElementToCollection(elementName, count_value, {
        firstFound: firstFound || new Date().toISOString()
      });
      count++;
    }
    
    logMigration(`Migrated ${count} unique elements`);
    return count;
  }
  return 0;
}

// ===== MIGRATE MISSIONS DATA =====
async function migrateMissions() {
  logMigration('Migrating missions...');
  
  const missionsData = localStorage.getItem('voidfarer_missions');
  if (missionsData) {
    const missions = safeJSONParse(missionsData, []);
    
    for (const mission of missions) {
      if (!mission.id) {
        mission.id = 'mission_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      }
      await window.setItem('missions', mission);
    }
    
    logMigration(`Migrated ${missions.length} active missions`);
    return missions.length;
  }
  return 0;
}

// ===== MIGRATE COMPLETED MISSIONS =====
async function migrateCompletedMissions() {
  logMigration('Migrating completed missions...');
  
  const completedData = localStorage.getItem('voidfarer_completed_missions');
  if (completedData) {
    const missions = safeJSONParse(completedData, []);
    
    for (const mission of missions) {
      if (!mission.id) {
        mission.id = 'mission_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      }
      await window.setItem('completedMissions', mission);
    }
    
    logMigration(`Migrated ${missions.length} completed missions`);
    return missions.length;
  }
  return 0;
}

// ===== MIGRATE REAL ESTATE DATA =====
async function migrateRealEstate() {
  logMigration('Migrating real estate...');
  
  const realEstateData = localStorage.getItem('voidfarer_real_estate');
  if (realEstateData) {
    const realEstate = safeJSONParse(realEstateData, { properties: [] });
    
    for (const property of realEstate.properties || []) {
      await window.setItem('properties', property);
      
      if (property.items) {
        for (const [elementName, itemData] of Object.entries(property.items)) {
          await window.setItem('propertyItems', {
            id: `item_${property.id}_${elementName}`,
            propertyId: property.id,
            elementName: elementName,
            count: itemData.count || 1
          });
        }
      }
    }
    
    logMigration(`Migrated ${realEstate.properties?.length || 0} properties`);
    return realEstate.properties?.length || 0;
  }
  return 0;
}

// ===== MIGRATE TAX TRANSACTIONS =====
async function migrateTaxTransactions() {
  logMigration('Migrating tax transactions...');
  
  const taxData = localStorage.getItem('voidfarer_tax_transactions') || 
                  localStorage.getItem('voidfarer_tax_history');
  
  if (taxData) {
    const transactions = safeJSONParse(taxData, []);
    let count = 0;
    
    for (const tx of transactions) {
      await window.addTaxTransaction(tx);
      count++;
    }
    
    logMigration(`Migrated ${count} tax transactions`);
    return count;
  }
  return 0;
}

// ===== MIGRATE DAILY METRICS =====
async function migrateDailyMetrics() {
  logMigration('Migrating daily metrics...');
  
  const metricsData = localStorage.getItem('voidfarer_daily_metrics');
  if (metricsData) {
    const metrics = safeJSONParse(metricsData, []);
    
    for (const metric of metrics) {
      await window.setItem('dailyMetrics', metric);
    }
    
    logMigration(`Migrated ${metrics.length} daily metrics`);
    return metrics.length;
  }
  return 0;
}

// ===== MIGRATE HOURLY SNAPSHOTS =====
async function migrateHourlySnapshots() {
  logMigration('Migrating hourly snapshots...');
  
  const snapshotsData = localStorage.getItem('voidfarer_hourly_snapshots');
  if (snapshotsData) {
    const snapshots = safeJSONParse(snapshotsData, []);
    
    for (const snapshot of snapshots) {
      await window.setItem('hourlySnapshots', snapshot);
    }
    
    logMigration(`Migrated ${snapshots.length} hourly snapshots`);
    return snapshots.length;
  }
  return 0;
}

// ===== MIGRATE TAX RATES =====
async function migrateTaxRates() {
  logMigration('Migrating tax rates...');
  
  const ratesData = localStorage.getItem('voidfarer_tax_rates');
  if (ratesData) {
    const rates = safeJSONParse(ratesData);
    if (rates) {
      await window.setItem('taxRates', { id: 'current', ...rates });
      logMigration('Tax rates migrated');
      return true;
    }
  }
  return false;
}

// ===== MIGRATE COMMUNITY FUND =====
async function migrateCommunityFund() {
  logMigration('Migrating community fund...');
  
  const fundData = localStorage.getItem('voidfarer_community_fund');
  if (fundData) {
    const fund = safeJSONParse(fundData);
    if (fund) {
      await window.setItem('communityFund', { id: 'main', ...fund });
      logMigration('Community fund migrated');
      return true;
    }
  }
  return false;
}

// ===== MIGRATE ACTIVE EVENTS =====
async function migrateActiveEvents() {
  logMigration('Migrating active events...');
  
  const eventsData = localStorage.getItem('voidfarer_active_events');
  if (eventsData) {
    const events = safeJSONParse(eventsData, []);
    
    for (const event of events) {
      await window.setItem('activeEvents', event);
    }
    
    logMigration(`Migrated ${events.length} active events`);
    return events.length;
  }
  return 0;
}

// ===== MIGRATE EVENT HISTORY =====
async function migrateEventHistory() {
  logMigration('Migrating event history...');
  
  const historyData = localStorage.getItem('voidfarer_event_history');
  if (historyData) {
    const history = safeJSONParse(historyData, []);
    
    for (const entry of history) {
      await window.setItem('eventHistory', entry);
    }
    
    logMigration(`Migrated ${history.length} event history entries`);
    return history.length;
  }
  return 0;
}

// ===== MIGRATE COLONIES =====
async function migrateColonies() {
  logMigration('Migrating colonies...');
  
  const coloniesData = localStorage.getItem('voidfarer_colonies');
  if (coloniesData) {
    const colonies = safeJSONParse(coloniesData, []);
    
    for (const colony of colonies) {
      if (!colony.id) {
        colony.id = 'colony_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      }
      await window.setItem('colonies', colony);
    }
    
    logMigration(`Migrated ${colonies.length} colonies`);
    return colonies.length;
  }
  return 0;
}

// ===== MIGRATE DISCOVERED LOCATIONS =====
async function migrateDiscoveredLocations() {
  logMigration('Migrating discovered locations...');
  
  const locationsData = localStorage.getItem('voidfarer_discovered_locations');
  if (locationsData) {
    const locations = safeJSONParse(locationsData, []);
    
    for (const location of locations) {
      if (!location.id) {
        location.id = 'loc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      }
      await window.setItem('discoveredLocations', location);
    }
    
    logMigration(`Migrated ${locations.length} discovered locations`);
    return locations.length;
  }
  return 0;
}

// ===== MIGRATE SCAN HISTORY =====
async function migrateScanHistory() {
  logMigration('Migrating scan history...');
  
  const scansData = localStorage.getItem('voidfarer_scan_history');
  if (scansData) {
    const scans = safeJSONParse(scansData, []);
    
    for (const scan of scans) {
      const key = scan.timestamp || Date.now();
      await window.setItem('scanHistory', { timestamp: key, ...scan });
    }
    
    logMigration(`Migrated ${scans.length} scan history entries`);
    return scans.length;
  }
  return 0;
}

// ===== MIGRATE BOOKMARKS =====
async function migrateBookmarks() {
  logMigration('Migrating bookmarks...');
  
  const bookmarksData = localStorage.getItem('voidfarer_bookmarks');
  if (bookmarksData) {
    const bookmarks = safeJSONParse(bookmarksData, []);
    
    for (const bookmark of bookmarks) {
      if (!bookmark.id) {
        bookmark.id = 'bookmark_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      }
      await window.setItem('bookmarks', bookmark);
    }
    
    logMigration(`Migrated ${bookmarks.length} bookmarks`);
    return bookmarks.length;
  }
  return 0;
}

// ===== MIGRATE SHIP UPGRADES =====
async function migrateShipUpgrades() {
  logMigration('Migrating ship upgrades...');
  
  const upgradesData = localStorage.getItem('voidfarer_ship_upgrades');
  if (upgradesData) {
    const upgrades = safeJSONParse(upgradesData);
    if (upgrades) {
      await window.setItem('shipUpgrades', { id: 'current', ...upgrades });
      logMigration('Ship upgrades migrated');
      return true;
    }
  } else {
    await window.setItem('shipUpgrades', {
      id: 'current',
      engine: 1,
      shields: 1,
      miningLaser: 1,
      cargoHold: 1,
      warpDrive: 1,
      scanner: 1
    });
    logMigration('Created default ship upgrades', 'warning');
  }
  return false;
}

// ===== MIGRATE SETTINGS =====
async function migrateSettings() {
  logMigration('Migrating settings...');
  
  const settingsKeys = [
    'voidfarer_haptics',
    'voidfarer_auto_gather',
    'voidfarer_orbit_speed',
    'voidfarer_music',
    'voidfarer_ambient'
  ];
  
  let migratedCount = 0;
  
  for (const key of settingsKeys) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      await window.setItem('settings', { key: key, value: value });
      migratedCount++;
    }
  }
  
  logMigration(`Migrated ${migratedCount} settings`);
  return migratedCount;
}

// ===== MIGRATE CREDITS =====
async function migrateCredits() {
  logMigration('Migrating credits...');
  
  const credits = localStorage.getItem('voidfarer_credits');
  if (credits) {
    const player = await window.getItem('player', 'main');
    if (player) {
      player.credits = parseInt(credits) || 5000;
      await window.setItem('player', player);
    }
    
    await window.setItem('settings', { key: 'credits', value: credits });
    logMigration(`Credits: ${credits}⭐`);
    return true;
  }
  return false;
}

// ===== MIGRATE SHIP FUEL =====
async function migrateShipFuel() {
  logMigration('Migrating ship fuel...');
  
  const fuel = localStorage.getItem('voidfarer_ship_fuel');
  if (fuel) {
    await window.setItem('settings', { key: 'ship_fuel', value: fuel });
    logMigration(`Ship fuel: ${fuel}%`);
    return true;
  }
  return false;
}

// ===== MIGRATE SHIP POWER =====
async function migrateShipPower() {
  logMigration('Migrating ship power...');
  
  const power = localStorage.getItem('voidfarer_ship_power');
  if (power) {
    await window.setItem('settings', { key: 'ship_power', value: power });
    logMigration(`Ship power: ${power}%`);
    return true;
  }
  return false;
}

// ===== MIGRATE CURRENT LOCATION =====
async function migrateCurrentLocation() {
  logMigration('Migrating current location...');
  
  const locationKeys = {
    current_sector: 'voidfarer_current_sector',
    current_region: 'voidfarer_current_region',
    current_nebula: 'voidfarer_current_nebula',
    current_sector_name: 'voidfarer_current_sector_name',
    current_sector_type: 'voidfarer_current_sector_type',
    current_sector_stars: 'voidfarer_current_sector_stars',
    current_sector_x: 'voidfarer_current_sector_x',
    current_sector_y: 'voidfarer_current_sector_y',
    current_star: 'voidfarer_current_star',
    current_star_type: 'voidfarer_current_star_type',
    current_star_index: 'voidfarer_current_star_index',
    current_planet: 'voidfarer_current_planet',
    current_planet_type: 'voidfarer_current_planet_type'
  };
  
  const locationData = {};
  
  for (const [key, storageKey] of Object.entries(locationKeys)) {
    const value = localStorage.getItem(storageKey);
    if (value !== null) {
      locationData[key] = value;
    }
  }
  
  if (Object.keys(locationData).length > 0) {
    await window.setItem('settings', { key: 'current_location', value: JSON.stringify(locationData) });
    logMigration('Current location migrated');
    return true;
  }
  return false;
}

// ===== CHECK MIGRATION COMPLETE =====
async function isMigrationComplete() {
  try {
    const flag = await window.getItem('migration', 'localStorage');
    return flag ? flag.complete : false;
  } catch (error) {
    console.error('Error in isMigrationComplete:', error);
    return false;
  }
}

// ===== SET MIGRATION COMPLETE =====
async function setMigrationComplete() {
  try {
    await window.setItem('migration', {
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

// ===== MAIN MIGRATION FUNCTION =====
async function migrateFromLocalStorage(showProgress = true) {
  if (migrationInProgress) {
    logMigration('Migration already in progress', 'warning');
    return { success: false, reason: 'ALREADY_RUNNING' };
  }
  
  const completed = await isMigrationComplete();
  if (completed) {
    logMigration('Migration already completed previously', 'info');
    return { success: true, reason: 'ALREADY_COMPLETED' };
  }
  
  migrationInProgress = true;
  migrationLog = [];
  
  logMigration('🚀 Starting localStorage migration...');
  
  const results = {
    player: false,
    collection: 0,
    missions: 0,
    completedMissions: 0,
    realEstate: 0,
    taxTransactions: 0,
    dailyMetrics: 0,
    hourlySnapshots: 0,
    taxRates: false,
    communityFund: false,
    activeEvents: 0,
    eventHistory: 0,
    colonies: 0,
    discoveredLocations: 0,
    scanHistory: 0,
    bookmarks: 0,
    shipUpgrades: false,
    settings: 0,
    credits: false,
    shipFuel: false,
    shipPower: false,
    location: false
  };
  
  try {
    results.player = await migratePlayer();
    results.credits = await migrateCredits();
    results.shipFuel = await migrateShipFuel();
    results.shipPower = await migrateShipPower();
    results.collection = await migrateCollection();
    results.missions = await migrateMissions();
    results.completedMissions = await migrateCompletedMissions();
    results.realEstate = await migrateRealEstate();
    results.taxTransactions = await migrateTaxTransactions();
    results.dailyMetrics = await migrateDailyMetrics();
    results.hourlySnapshots = await migrateHourlySnapshots();
    results.taxRates = await migrateTaxRates();
    results.communityFund = await migrateCommunityFund();
    results.activeEvents = await migrateActiveEvents();
    results.eventHistory = await migrateEventHistory();
    results.colonies = await migrateColonies();
    results.discoveredLocations = await migrateDiscoveredLocations();
    results.scanHistory = await migrateScanHistory();
    results.bookmarks = await migrateBookmarks();
    results.shipUpgrades = await migrateShipUpgrades();
    results.settings = await migrateSettings();
    results.location = await migrateCurrentLocation();
    
    await setMigrationComplete();
    
    logMigration('✅ Migration completed successfully!');
    logMigration(`📊 Summary: ${results.collection} elements, ${results.missions} missions, ${results.realEstate} properties, ${results.taxTransactions} tax records`);
    
    migrationInProgress = false;
    return { success: true, results, log: migrationLog };
    
  } catch (error) {
    logMigration(`❌ Migration failed: ${error.message}`, 'error');
    console.error('Migration error details:', error);
    migrationInProgress = false;
    return { success: false, error: error.message, log: migrationLog };
  }
}

// ===== PROGRESS TRACKING =====
function getMigrationProgress() {
  return {
    inProgress: migrationInProgress,
    log: migrationLog
  };
}

// ===== DRY RUN =====
async function simulateMigration() {
  logMigration('🔍 Simulating migration (dry run)...');
  
  const keys = Object.keys(localStorage);
  const gameKeys = keys.filter(k => k.startsWith('voidfarer_'));
  
  logMigration(`Found ${gameKeys.length} Voidfarer localStorage keys:`);
  gameKeys.forEach(key => {
    const value = localStorage.getItem(key);
    const size = new Blob([value]).size;
    logMigration(`  • ${key}: ${(size / 1024).toFixed(2)} KB`);
  });
  
  return {
    keyCount: gameKeys.length,
    keys: gameKeys
  };
}

// ===== ROLLBACK =====
async function rollbackMigration() {
  logMigration('⚠️ Rolling back migration...', 'warning');
  
  try {
    const stores = [
      'player', 'collection', 'missions', 'completedMissions',
      'properties', 'propertyItems', 'taxTransactions', 'dailyMetrics',
      'hourlySnapshots', 'taxRates', 'communityFund', 'activeEvents',
      'eventHistory', 'colonies', 'discoveredLocations', 'scanHistory',
      'bookmarks', 'shipUpgrades', 'settings', 'migration'
    ];
    
    for (const store of stores) {
      await window.clearStore(store);
    }
    
    logMigration('✅ Rollback complete. localStorage data remains intact.');
    return true;
  } catch (error) {
    logMigration(`❌ Rollback failed: ${error.message}`, 'error');
    return false;
  }
}

// ===== EXPOSE TO WINDOW =====
window.migrationInProgress = migrationInProgress;
window.migrationLog = migrationLog;
window.logMigration = logMigration;
window.migrateFromLocalStorage = migrateFromLocalStorage;
window.simulateMigration = simulateMigration;
window.rollbackMigration = rollbackMigration;
window.getMigrationProgress = getMigrationProgress;
window.isMigrationComplete = isMigrationComplete;
window.setMigrationComplete = setMigrationComplete;

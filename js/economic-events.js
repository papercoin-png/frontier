// economic-events.js - Dynamic economic events system for Voidfarer
// Generates random events that affect the economy, creates opportunities, and adds flavor

// ===== DEPENDENCIES =====
// Requires economic-metrics.js and tax-system.js to be loaded first

// ===== EVENT TYPES =====
const EVENT_TYPES = {
    BOOM: 'boom',               // Economic boom - prices rise, demand high
    BUST: 'bust',                // Economic bust - prices fall, demand low
    SHORTAGE: 'shortage',        // Resource shortage - specific item prices spike
    SURPLUS: 'surplus',          // Resource surplus - specific item prices drop
    DISCOVERY: 'discovery',       // New resource found - temporary price changes
    DISASTER: 'disaster',         // Natural disaster - affects local economy
    FESTIVAL: 'festival',         // Community celebration - spending increases
    MIGRATION: 'migration',       // Population movement - affects labor pools
    TECHNOLOGY: 'technology',     // New tech discovered - affects production
    SPECULATION: 'speculation',   // Market speculation - volatile prices
    POLICY: 'policy',             // Tax policy change - rate adjustments
    HOLIDAY: 'holiday'            // Galactic holiday - reduced activity
};

// ===== EVENT SEVERITY =====
const EVENT_SEVERITY = {
    MINOR: 'minor',               // Small effect, short duration
    MODERATE: 'moderate',         // Noticeable effect, medium duration
    MAJOR: 'major',               // Significant effect, long duration
    EPIC: 'epic'                  // Game-changing effect, very long duration
};

// ===== EVENT DURATIONS (in days) =====
const EVENT_DURATIONS = {
    [EVENT_SEVERITY.MINOR]: { min: 1, max: 3 },
    [EVENT_SEVERITY.MODERATE]: { min: 3, max: 7 },
    [EVENT_SEVERITY.MAJOR]: { min: 7, max: 14 },
    [EVENT_SEVERITY.EPIC]: { min: 14, max: 30 }
};

// ===== EVENT PRICE EFFECTS =====
const PRICE_EFFECTS = {
    [EVENT_SEVERITY.MINOR]: { min: -0.15, max: 0.15 },      // ±15%
    [EVENT_SEVERITY.MODERATE]: { min: -0.3, max: 0.3 },     // ±30%
    [EVENT_SEVERITY.MAJOR]: { min: -0.5, max: 0.5 },        // ±50%
    [EVENT_SEVERITY.EPIC]: { min: -0.8, max: 0.8 }          // ±80%
};

// ===== STORAGE KEYS =====
const EVENT_STORAGE_KEYS = {
    ACTIVE_EVENTS: 'voidfarer_active_events',
    EVENT_HISTORY: 'voidfarer_event_history',
    EVENT_NOTIFICATIONS: 'voidfarer_event_notifications',
    EVENT_SETTINGS: 'voidfarer_event_settings',
    LAST_EVENT_CHECK: 'voidfarer_last_event_check'
};

// ===== RESOURCE POOLS =====
const COMMON_RESOURCES = [
    'Iron', 'Copper', 'Carbon', 'Silicon', 'Hydrogen', 'Oxygen',
    'Titanium', 'Nickel', 'Aluminum', 'Magnesium', 'Sodium', 'Potassium'
];

const RARE_RESOURCES = [
    'Gold', 'Silver', 'Platinum', 'Uranium', 'Thorium', 'Cobalt',
    'Chromium', 'Tungsten', 'Mercury', 'Bismuth', 'Antimony'
];

const LEGENDARY_RESOURCES = [
    'Promethium', 'Technetium', 'Astatine', 'Francium', 'Californium',
    'Einsteinium', 'Fermium', 'Mendelevium', 'Nobelium', 'Lawrencium'
];

const ALL_RESOURCES = [...COMMON_RESOURCES, ...RARE_RESOURCES, ...LEGENDARY_RESOURCES];

// ===== LOCATION POOLS =====
const SECTORS = [
    'Orion', 'Cygnus', 'Sagittarius', 'Perseus', 'Carina', 'Outer',
    'Core', 'Andromeda', 'Triangulum', 'Centaurus', 'Scutum', 'Norma'
];

const COLONY_NAMES = [
    'New Hope', 'Prospect', 'Frontier', 'Eden', 'Aurora', 'Haven',
    'Sanctuary', 'Oasis', 'Nexus', 'Prime', 'Alpha', 'Omega'
];

// ===== INITIALIZE EVENT SYSTEM =====
function initializeEventSystem() {
    // Initialize active events
    if (!localStorage.getItem(EVENT_STORAGE_KEYS.ACTIVE_EVENTS)) {
        localStorage.setItem(EVENT_STORAGE_KEYS.ACTIVE_EVENTS, JSON.stringify([]));
    }
    
    // Initialize event history
    if (!localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_HISTORY)) {
        localStorage.setItem(EVENT_STORAGE_KEYS.EVENT_HISTORY, JSON.stringify([]));
    }
    
    // Initialize event notifications
    if (!localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_NOTIFICATIONS)) {
        localStorage.setItem(EVENT_STORAGE_KEYS.EVENT_NOTIFICATIONS, JSON.stringify([]));
    }
    
    // Initialize event settings
    if (!localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_SETTINGS)) {
        const settings = {
            enabled: true,
            frequency: 0.3,           // 30% chance per day
            maxActiveEvents: 5,
            notifyPlayers: true,
            severityWeights: {
                [EVENT_SEVERITY.MINOR]: 0.5,
                [EVENT_SEVERITY.MODERATE]: 0.3,
                [EVENT_SEVERITY.MAJOR]: 0.15,
                [EVENT_SEVERITY.EPIC]: 0.05
            },
            typeWeights: {
                [EVENT_TYPES.BOOM]: 0.1,
                [EVENT_TYPES.BUST]: 0.1,
                [EVENT_TYPES.SHORTAGE]: 0.15,
                [EVENT_TYPES.SURPLUS]: 0.15,
                [EVENT_TYPES.DISCOVERY]: 0.1,
                [EVENT_TYPES.DISASTER]: 0.05,
                [EVENT_TYPES.FESTIVAL]: 0.1,
                [EVENT_TYPES.MIGRATION]: 0.05,
                [EVENT_TYPES.TECHNOLOGY]: 0.05,
                [EVENT_TYPES.SPECULATION]: 0.1,
                [EVENT_TYPES.POLICY]: 0.03,
                [EVENT_TYPES.HOLIDAY]: 0.02
            }
        };
        localStorage.setItem(EVENT_STORAGE_KEYS.EVENT_SETTINGS, JSON.stringify(settings));
    }
    
    // Set last event check
    if (!localStorage.getItem(EVENT_STORAGE_KEYS.LAST_EVENT_CHECK)) {
        localStorage.setItem(EVENT_STORAGE_KEYS.LAST_EVENT_CHECK, Date.now().toString());
    }
}

// ===== EVENT MANAGEMENT =====
function getActiveEvents() {
    const events = localStorage.getItem(EVENT_STORAGE_KEYS.ACTIVE_EVENTS);
    return events ? JSON.parse(events) : [];
}

function saveActiveEvents(events) {
    localStorage.setItem(EVENT_STORAGE_KEYS.ACTIVE_EVENTS, JSON.stringify(events));
}

function addEvent(event) {
    const events = getActiveEvents();
    
    // Ensure event has all required fields
    const newEvent = {
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: event.type,
        severity: event.severity,
        name: event.name,
        description: event.description,
        startTime: Date.now(),
        startDate: new Date().toISOString(),
        endTime: Date.now() + (event.duration * 24 * 60 * 60 * 1000),
        duration: event.duration,
        location: event.location || 'galaxy',
        affectedSector: event.affectedSector || null,
        affectedResource: event.affectedResource || null,
        priceMultiplier: event.priceMultiplier || 1.0,
        demandMultiplier: event.demandMultiplier || 1.0,
        supplyMultiplier: event.supplyMultiplier || 1.0,
        taxMultiplier: event.taxMultiplier || 1.0,
        notificationsSent: false
    };
    
    events.push(newEvent);
    saveActiveEvents(events);
    
    // Add to history
    addToEventHistory({
        ...newEvent,
        ended: false,
        addedAt: Date.now()
    });
    
    return newEvent;
}

function removeEvent(eventId) {
    const events = getActiveEvents();
    const event = events.find(e => e.id === eventId);
    
    if (event) {
        // Add to history as ended
        addToEventHistory({
            ...event,
            ended: true,
            endedAt: Date.now(),
            endedDate: new Date().toISOString()
        });
    }
    
    const filtered = events.filter(e => e.id !== eventId);
    saveActiveEvents(filtered);
    return filtered;
}

function updateEvent(eventId, updates) {
    const events = getActiveEvents();
    const index = events.findIndex(e => e.id === eventId);
    
    if (index !== -1) {
        events[index] = { ...events[index], ...updates };
        saveActiveEvents(events);
        return events[index];
    }
    return null;
}

// ===== EVENT HISTORY =====
function getEventHistory(limit = 100) {
    const history = localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_HISTORY);
    const allHistory = history ? JSON.parse(history) : [];
    return allHistory.slice(-limit);
}

function addToEventHistory(entry) {
    const history = localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_HISTORY);
    const allHistory = history ? JSON.parse(history) : [];
    
    allHistory.push({
        ...entry,
        historyId: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        recordedAt: Date.now()
    });
    
    // Keep only last 1000 events
    if (allHistory.length > 1000) {
        allHistory.shift();
    }
    
    localStorage.setItem(EVENT_STORAGE_KEYS.EVENT_HISTORY, JSON.stringify(allHistory));
}

// ===== EVENT NOTIFICATIONS =====
function getEventNotifications(playerId, unreadOnly = false) {
    const notifications = localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_NOTIFICATIONS);
    const allNotes = notifications ? JSON.parse(notifications) : [];
    
    let playerNotes = allNotes.filter(n => n.playerId === playerId);
    
    if (unreadOnly) {
        playerNotes = playerNotes.filter(n => !n.read);
    }
    
    return playerNotes.sort((a, b) => b.timestamp - a.timestamp);
}

function addEventNotification(playerId, event, message) {
    const notifications = localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_NOTIFICATIONS);
    const allNotes = notifications ? JSON.parse(notifications) : [];
    
    allNotes.push({
        id: 'notify_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        playerId,
        eventId: event.id,
        eventName: event.name,
        eventType: event.type,
        severity: event.severity,
        message,
        read: false,
        timestamp: Date.now(),
        date: new Date().toISOString()
    });
    
    // Keep only last 100 per player (will filter later)
    localStorage.setItem(EVENT_STORAGE_KEYS.EVENT_NOTIFICATIONS, JSON.stringify(allNotes));
}

function markEventNotificationRead(notificationId) {
    const notifications = localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_NOTIFICATIONS);
    const allNotes = notifications ? JSON.parse(notifications) : [];
    
    const updated = allNotes.map(n => {
        if (n.id === notificationId) {
            n.read = true;
        }
        return n;
    });
    
    localStorage.setItem(EVENT_STORAGE_KEYS.EVENT_NOTIFICATIONS, JSON.stringify(updated));
}

// ===== EVENT GENERATION =====
function generateRandomEvent() {
    const settings = getEventSettings();
    if (!settings.enabled) return null;
    
    // Check if we should generate an event
    if (Math.random() > settings.frequency) return null;
    
    // Check max active events
    const activeEvents = getActiveEvents();
    if (activeEvents.length >= settings.maxActiveEvents) return null;
    
    // Select severity based on weights
    const severity = selectWeightedItem(settings.severityWeights);
    
    // Select type based on weights
    const type = selectWeightedItem(settings.typeWeights);
    
    // Generate event based on type
    let event = null;
    
    switch(type) {
        case EVENT_TYPES.BOOM:
            event = generateBoomEvent(severity);
            break;
        case EVENT_TYPES.BUST:
            event = generateBustEvent(severity);
            break;
        case EVENT_TYPES.SHORTAGE:
            event = generateShortageEvent(severity);
            break;
        case EVENT_TYPES.SURPLUS:
            event = generateSurplusEvent(severity);
            break;
        case EVENT_TYPES.DISCOVERY:
            event = generateDiscoveryEvent(severity);
            break;
        case EVENT_TYPES.DISASTER:
            event = generateDisasterEvent(severity);
            break;
        case EVENT_TYPES.FESTIVAL:
            event = generateFestivalEvent(severity);
            break;
        case EVENT_TYPES.MIGRATION:
            event = generateMigrationEvent(severity);
            break;
        case EVENT_TYPES.TECHNOLOGY:
            event = generateTechnologyEvent(severity);
            break;
        case EVENT_TYPES.SPECULATION:
            event = generateSpeculationEvent(severity);
            break;
        case EVENT_TYPES.POLICY:
            event = generatePolicyEvent(severity);
            break;
        case EVENT_TYPES.HOLIDAY:
            event = generateHolidayEvent(severity);
            break;
    }
    
    if (event) {
        const newEvent = addEvent(event);
        
        // Send notifications to players if enabled
        if (settings.notifyPlayers) {
            broadcastEventNotification(newEvent);
        }
        
        return newEvent;
    }
    
    return null;
}

function selectWeightedItem(weights) {
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    let rand = Math.random() * total;
    
    for (const [key, weight] of Object.entries(weights)) {
        if (rand < weight) return key;
        rand -= weight;
    }
    
    return Object.keys(weights)[0];
}

function getRandomResource(rarity = 'any') {
    if (rarity === 'common') return COMMON_RESOURCES[Math.floor(Math.random() * COMMON_RESOURCES.length)];
    if (rarity === 'rare') return RARE_RESOURCES[Math.floor(Math.random() * RARE_RESOURCES.length)];
    if (rarity === 'legendary') return LEGENDARY_RESOURCES[Math.floor(Math.random() * LEGENDARY_RESOURCES.length)];
    return ALL_RESOURCES[Math.floor(Math.random() * ALL_RESOURCES.length)];
}

function getRandomSector() {
    return SECTORS[Math.floor(Math.random() * SECTORS.length)];
}

function getRandomColonyName() {
    return COLONY_NAMES[Math.floor(Math.random() * COLONY_NAMES.length)];
}

// ===== SPECIFIC EVENT GENERATORS =====
function generateBoomEvent(severity) {
    const duration = getRandomDuration(severity);
    const priceEffect = getRandomPriceEffect(severity);
    const sector = getRandomSector();
    
    const names = {
        [EVENT_SEVERITY.MINOR]: 'Local Economic Boom',
        [EVENT_SEVERITY.MODERATE]: 'Regional Prosperity',
        [EVENT_SEVERITY.MAJOR]: 'Galactic Economic Boom',
        [EVENT_SEVERITY.EPIC]: 'Golden Age'
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `The ${sector} sector is experiencing increased economic activity. Prices are up ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.MODERATE]: `A wave of prosperity sweeps through the ${sector} sector. All prices increased by ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.MAJOR]: `Major economic boom across the ${sector} sector! Prices are up ${Math.round(priceEffect * 100)}% across all resources.`,
        [EVENT_SEVERITY.EPIC]: `A GOLDEN AGE has dawned in the ${sector} sector! Unprecedented prosperity with prices increased by ${Math.round(priceEffect * 100)}%!`
    };
    
    return {
        type: EVENT_TYPES.BOOM,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'sector',
        affectedSector: sector,
        priceMultiplier: 1 + priceEffect,
        demandMultiplier: 1.2,
        supplyMultiplier: 0.9
    };
}

function generateBustEvent(severity) {
    const duration = getRandomDuration(severity);
    const priceEffect = getRandomPriceEffect(severity);
    const sector = getRandomSector();
    
    const names = {
        [EVENT_SEVERITY.MINOR]: 'Local Economic Downturn',
        [EVENT_SEVERITY.MODERATE]: 'Regional Recession',
        [EVENT_SEVERITY.MAJOR]: 'Galactic Depression',
        [EVENT_SEVERITY.EPIC]: 'Economic Collapse'
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `The ${sector} sector is experiencing a mild downturn. Prices are down ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.MODERATE]: `A recession hits the ${sector} sector. Prices dropped ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.MAJOR]: `Economic depression in the ${sector} sector! Prices crashed ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.EPIC]: `The ${sector} sector faces economic collapse! Prices plummeted ${Math.round(priceEffect * 100)}%!`
    };
    
    return {
        type: EVENT_TYPES.BUST,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'sector',
        affectedSector: sector,
        priceMultiplier: 1 - priceEffect,
        demandMultiplier: 0.8,
        supplyMultiplier: 1.2
    };
}

function generateShortageEvent(severity) {
    const duration = getRandomDuration(severity);
    const priceEffect = getRandomPriceEffect(severity);
    const resource = getRandomResource();
    const sector = getRandomSector();
    
    const names = {
        [EVENT_SEVERITY.MINOR]: `${resource} Shortage`,
        [EVENT_SEVERITY.MODERATE]: `Severe ${resource} Shortage`,
        [EVENT_SEVERITY.MAJOR]: `Critical ${resource} Crisis`,
        [EVENT_SEVERITY.EPIC]: `${resource} Famine`
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `${resource} is in short supply in the ${sector} sector. Prices increased ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.MODERATE]: `Severe shortage of ${resource} in ${sector}! Prices up ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.MAJOR]: `Critical ${resource} crisis in ${sector}! Prices skyrocketed ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.EPIC]: `${resource} famine in ${sector}! Prices increased ${Math.round(priceEffect * 100)}% - extreme scarcity!`
    };
    
    return {
        type: EVENT_TYPES.SHORTAGE,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'sector',
        affectedSector: sector,
        affectedResource: resource,
        priceMultiplier: 1 + priceEffect,
        demandMultiplier: 1.3,
        supplyMultiplier: 0.5
    };
}

function generateSurplusEvent(severity) {
    const duration = getRandomDuration(severity);
    const priceEffect = getRandomPriceEffect(severity);
    const resource = getRandomResource();
    const sector = getRandomSector();
    
    const names = {
        [EVENT_SEVERITY.MINOR]: `${resource} Surplus`,
        [EVENT_SEVERITY.MODERATE]: `Major ${resource} Discovery`,
        [EVENT_SEVERITY.MAJOR]: `${resource} Glut`,
        [EVENT_SEVERITY.EPIC]: `${resource} Abundance`
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `New ${resource} deposits found in ${sector}. Prices dropped ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.MODERATE]: `Major ${resource} veins discovered in ${sector}! Prices down ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.MAJOR]: `Massive ${resource} glut in ${sector}! Prices crashed ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.EPIC]: `${resource} abundance in ${sector}! Prices plummeted ${Math.round(priceEffect * 100)}% - everyone has it!`
    };
    
    return {
        type: EVENT_TYPES.SURPLUS,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'sector',
        affectedSector: sector,
        affectedResource: resource,
        priceMultiplier: 1 - priceEffect,
        demandMultiplier: 0.7,
        supplyMultiplier: 1.5
    };
}

function generateDiscoveryEvent(severity) {
    const duration = getRandomDuration(severity);
    const priceEffect = getRandomPriceEffect(severity) / 2;
    const resource = getRandomResource('legendary');
    const sector = getRandomSector();
    
    const names = {
        [EVENT_SEVERITY.MINOR]: `Minor ${resource} Discovery`,
        [EVENT_SEVERITY.MODERATE]: `${resource} Vein Found`,
        [EVENT_SEVERITY.MAJOR]: `Major ${resource} Deposit`,
        [EVENT_SEVERITY.EPIC]: `Legendary ${resource} Discovery!`
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `Small deposits of ${resource} found in ${sector}. Prices decreased slightly.`,
        [EVENT_SEVERITY.MODERATE]: `New ${resource} vein discovered in ${sector}! Prices down ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.MAJOR]: `Massive ${resource} deposit found in ${sector}! Prices dropped significantly.`,
        [EVENT_SEVERITY.EPIC]: `LEGENDARY ${resource} discovery in ${sector}! The largest deposit ever found!`
    };
    
    return {
        type: EVENT_TYPES.DISCOVERY,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'sector',
        affectedSector: sector,
        affectedResource: resource,
        priceMultiplier: 1 - priceEffect,
        demandMultiplier: 1.1,
        supplyMultiplier: 1.3
    };
}

function generateDisasterEvent(severity) {
    const duration = getRandomDuration(severity);
    const priceEffect = getRandomPriceEffect(severity);
    const sector = getRandomSector();
    const colony = getRandomColonyName();
    
    const names = {
        [EVENT_SEVERITY.MINOR]: `Minor Disaster in ${colony}`,
        [EVENT_SEVERITY.MODERATE]: `Disaster Strikes ${colony}`,
        [EVENT_SEVERITY.MAJOR]: `Major Catastrophe in ${colony}`,
        [EVENT_SEVERITY.EPIC]: `${colony} Destroyed!`
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `A minor disaster affects ${colony} in ${sector}. Reconstruction costs increased.`,
        [EVENT_SEVERITY.MODERATE]: `A disaster hits ${colony}! Building costs up ${Math.round(priceEffect * 100)}%.`,
        [EVENT_SEVERITY.MAJOR]: `Major catastrophe in ${colony}! Reconstruction costs skyrocketed.`,
        [EVENT_SEVERITY.EPIC]: `${colony} has been DESTROYED! Complete rebuilding required!`
    };
    
    return {
        type: EVENT_TYPES.DISASTER,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'colony',
        affectedSector: sector,
        affectedColony: colony,
        priceMultiplier: 1 + priceEffect,
        demandMultiplier: 1.5,
        supplyMultiplier: 0.3
    };
}

function generateFestivalEvent(severity) {
    const duration = getRandomDuration(severity);
    const sector = getRandomSector();
    
    const names = {
        [EVENT_SEVERITY.MINOR]: `Local Festival in ${sector}`,
        [EVENT_SEVERITY.MODERATE]: `${sector} Sector Fair`,
        [EVENT_SEVERITY.MAJOR]: `Galactic Festival`,
        [EVENT_SEVERITY.EPIC}: `The Great Galactic Celebration`
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `A small festival in ${sector} increases consumer spending.`,
        [EVENT_SEVERITY.MODERATE]: `The ${sector} Sector Fair brings increased economic activity.`,
        [EVENT_SEVERITY.MAJOR]: `A galactic festival! Spending increased across all sectors.`,
        [EVENT_SEVERITY.EPIC]: `The Great Galactic Celebration! Unprecedented spending and joy!`
    };
    
    return {
        type: EVENT_TYPES.FESTIVAL,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'sector',
        affectedSector: severity === EVENT_SEVERITY.MAJOR || severity === EVENT_SEVERITY.EPIC ? null : sector,
        priceMultiplier: 1.1,
        demandMultiplier: 1.3,
        supplyMultiplier: 1.0,
        taxMultiplier: 0.9 // Festival tax break
    };
}

function generateMigrationEvent(severity) {
    const duration = getRandomDuration(severity);
    const fromSector = getRandomSector();
    let toSector;
    do {
        toSector = getRandomSector();
    } while (toSector === fromSector);
    
    const names = {
        [EVENT_SEVERITY.MINOR]: `Minor Migration`,
        [EVENT_SEVERITY.MODERATE]: `Population Movement`,
        [EVENT_SEVERITY.MAJOR]: `Great Migration`,
        [EVENT_SEVERITY.EPIC]: `Exodus`
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `People moving from ${fromSector} to ${toSector}. Labor pool shifts.`,
        [EVENT_SEVERITY.MODERATE]: `Significant population movement from ${fromSector} to ${toSector}.`,
        [EVENT_SEVERITY.MAJOR]: `Great Migration from ${fromSector} to ${toSector}! Major labor shifts.`,
        [EVENT_SEVERITY.EPIC]: `EXODUS from ${fromSector} to ${toSector}! Extreme population shift!`
    };
    
    return {
        type: EVENT_TYPES.MIGRATION,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'interstellar',
        fromSector,
        toSector,
        // No direct price effects, but affects professional pools
        laborShift: severity === EVENT_SEVERITY.MINOR ? 0.1 :
                    severity === EVENT_SEVERITY.MODERATE ? 0.2 :
                    severity === EVENT_SEVERITY.MAJOR ? 0.3 : 0.5
    };
}

function generateTechnologyEvent(severity) {
    const duration = getRandomDuration(severity);
    const sector = getRandomSector();
    
    const names = {
        [EVENT_SEVERITY.MINOR]: `Minor Tech Breakthrough`,
        [EVENT_SEVERITY.MODERATE]: `Significant Discovery`,
        [EVENT_SEVERITY.MAJOR]: `Revolutionary Technology`,
        [EVENT_SEVERITY.EPIC]: `Quantum Leap Forward`
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `A minor technological breakthrough in ${sector} improves efficiency.`,
        [EVENT_SEVERITY.MODERATE]: `Significant discovery in ${sector}! Production costs reduced.`,
        [EVENT_SEVERITY.MAJOR]: `Revolutionary technology emerges in ${sector}! Major efficiency gains!`,
        [EVENT_SEVERITY.EPIC]: `QUANTUM LEAP in technology! Production efficiency doubled!`
    };
    
    return {
        type: EVENT_TYPES.TECHNOLOGY,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'sector',
        affectedSector: sector,
        priceMultiplier: 0.9,
        demandMultiplier: 1.1,
        supplyMultiplier: 1.2
    };
}

function generateSpeculationEvent(severity) {
    const duration = getRandomDuration(severity);
    const priceEffect = getRandomPriceEffect(severity);
    const resource = getRandomResource();
    
    const names = {
        [EVENT_SEVERITY.MINOR]: `${resource} Speculation`,
        [EVENT_SEVERITY.MODERATE]: `${resource} Market Frenzy`,
        [EVENT_SEVERITY.MAJOR]: `${resource} Bubble`,
        [EVENT_SEVERITY.EPIC]: `${resource} Mania`
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `Traders are speculating on ${resource}. Prices volatile.`,
        [EVENT_SEVERITY.MODERATE]: `Market frenzy around ${resource}! Prices fluctuating wildly.`,
        [EVENT_SEVERITY.MAJOR]: `${resource} bubble forming! Extreme price swings expected.`,
        [EVENT_SEVERITY.EPIC]: `${resource} MANIA! Prices going insane!`
    };
    
    return {
        type: EVENT_TYPES.SPECULATION,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'galaxy',
        affectedResource: resource,
        priceMultiplier: 1 + (priceEffect * (Math.random() > 0.5 ? 1 : -1)),
        volatility: priceEffect * 2
    };
}

function generatePolicyEvent(severity) {
    const duration = getRandomDuration(severity);
    const taxEffect = severity === EVENT_SEVERITY.MINOR ? 0.05 :
                      severity === EVENT_SEVERITY.MODERATE ? 0.1 :
                      severity === EVENT_SEVERITY.MAJOR ? 0.2 : 0.3;
    
    const increase = Math.random() > 0.5;
    
    const names = {
        [EVENT_SEVERITY.MINOR]: `Minor Tax ${increase ? 'Increase' : 'Cut'}`,
        [EVENT_SEVERITY.MODERATE]: `Tax ${increase ? 'Hike' : 'Reduction'}`,
        [EVENT_SEVERITY.MAJOR]: `Major Tax ${increase ? 'Increases' : 'Cuts'}`,
        [EVENT_SEVERITY.EPIC]: `Economic ${increase ? 'Reform' : 'Stimulus'}`
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `Local government ${increase ? 'increases' : 'cuts'} taxes by ${Math.round(taxEffect * 100)}%.`,
        [EVENT_SEVERITY.MODERATE]: `Regional tax ${increase ? 'hike' : 'reduction'} of ${Math.round(taxEffect * 100)}% implemented.`,
        [EVENT_SEVERITY.MAJOR]: `Major tax ${increase ? 'increases' : 'cuts'} of ${Math.round(taxEffect * 100)}% across the galaxy!`,
        [EVENT_SEVERITY.EPIC]: `Historic economic ${increase ? 'reform' : 'stimulus'}! Taxes ${increase ? 'raised' : 'lowered'} by ${Math.round(taxEffect * 100)}%!`
    };
    
    return {
        type: EVENT_TYPES.POLICY,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: 'galaxy',
        taxMultiplier: increase ? 1 + taxEffect : 1 - taxEffect
    };
}

function generateHolidayEvent(severity) {
    const duration = getRandomDuration(severity);
    
    const holidays = [
        'Founders Day', 'Unity Day', 'Harvest Festival', 'Starfall Celebration',
        'New Year', 'Equinox', 'Solstice', 'Remembrance Day'
    ];
    const holiday = holidays[Math.floor(Math.random() * holidays.length)];
    
    const names = {
        [EVENT_SEVERITY.MINOR]: `${holiday} (Local)`,
        [EVENT_SEVERITY.MODERATE]: `${holiday} (Regional)`,
        [EVENT_SEVERITY.MAJOR]: `${holiday} (Galactic)`,
        [EVENT_SEVERITY.EPIC]: `The Great ${holiday}`
    };
    
    const descriptions = {
        [EVENT_SEVERITY.MINOR]: `A local holiday. Reduced economic activity.`,
        [EVENT_SEVERITY.MODERATE]: `Regional holiday celebration. Markets slow.`,
        [EVENT_SEVERITY.MAJOR]: `Galactic holiday! Most business suspended.`,
        [EVENT_SEVERITY.EPIC]: `The greatest celebration in galactic history! Everything stops!`
    };
    
    return {
        type: EVENT_TYPES.HOLIDAY,
        severity,
        name: names[severity],
        description: descriptions[severity],
        duration,
        location: severity === EVENT_SEVERITY.MINOR ? 'sector' : 
                 severity === EVENT_SEVERITY.MODERATE ? 'region' : 'galaxy',
        priceMultiplier: 0.95,
        demandMultiplier: 0.7,
        supplyMultiplier: 0.8,
        activityMultiplier: 0.5
    };
}

// ===== HELPER FUNCTIONS =====
function getRandomDuration(severity) {
    const range = EVENT_DURATIONS[severity];
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function getRandomPriceEffect(severity) {
    const range = PRICE_EFFECTS[severity];
    return (Math.random() * (range.max - range.min) + range.min);
}

function getEventSettings() {
    const settings = localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_SETTINGS);
    return settings ? JSON.parse(settings) : null;
}

function saveEventSettings(settings) {
    localStorage.setItem(EVENT_STORAGE_KEYS.EVENT_SETTINGS, JSON.stringify(settings));
}

// ===== EVENT PROCESSING =====
function checkAndExpireEvents() {
    const events = getActiveEvents();
    const now = Date.now();
    let expired = false;
    
    events.forEach(event => {
        if (event.endTime <= now) {
            removeEvent(event.id);
            expired = true;
        }
    });
    
    return expired;
}

function checkAndGenerateEvents() {
    const settings = getEventSettings();
    if (!settings.enabled) return [];
    
    const lastCheck = parseInt(localStorage.getItem(EVENT_STORAGE_KEYS.LAST_EVENT_CHECK)) || 0;
    const now = Date.now();
    const hoursSinceLastCheck = (now - lastCheck) / (1000 * 60 * 60);
    
    // Generate events based on time passed
    const eventsGenerated = [];
    
    if (hoursSinceLastCheck >= 24) {
        // Check for each day passed
        const daysPassed = Math.floor(hoursSinceLastCheck / 24);
        
        for (let i = 0; i < daysPassed; i++) {
            const event = generateRandomEvent();
            if (event) eventsGenerated.push(event);
        }
        
        localStorage.setItem(EVENT_STORAGE_KEYS.LAST_EVENT_CHECK, now.toString());
    }
    
    return eventsGenerated;
}

function broadcastEventNotification(event) {
    // In a real implementation, this would send to all active players
    // For now, we'll just log it
    console.log(`EVENT: ${event.name} - ${event.description}`);
    
    // Add to a global event log
    addToEventHistory({
        ...event,
        broadcasted: true,
        broadcastedAt: Date.now()
    });
}

function getEventPriceMultiplier(resource, sector) {
    const events = getActiveEvents();
    let multiplier = 1.0;
    
    events.forEach(event => {
        if (event.priceMultiplier) {
            // Galaxy-wide event
            if (!event.affectedSector) {
                multiplier *= event.priceMultiplier;
            }
            // Sector-specific event
            else if (event.affectedSector === sector) {
                multiplier *= event.priceMultiplier;
            }
            // Resource-specific event
            else if (event.affectedResource === resource) {
                multiplier *= event.priceMultiplier;
            }
        }
    });
    
    return multiplier;
}

function getEventDemandMultiplier(resource, sector) {
    const events = getActiveEvents();
    let multiplier = 1.0;
    
    events.forEach(event => {
        if (event.demandMultiplier) {
            if (!event.affectedSector || event.affectedSector === sector) {
                multiplier *= event.demandMultiplier;
            }
            if (event.affectedResource === resource) {
                multiplier *= event.demandMultiplier;
            }
        }
    });
    
    return multiplier;
}

function getEventSupplyMultiplier(resource, sector) {
    const events = getActiveEvents();
    let multiplier = 1.0;
    
    events.forEach(event => {
        if (event.supplyMultiplier) {
            if (!event.affectedSector || event.affectedSector === sector) {
                multiplier *= event.supplyMultiplier;
            }
            if (event.affectedResource === resource) {
                multiplier *= event.supplyMultiplier;
            }
        }
    });
    
    return multiplier;
}

function getEventTaxMultiplier() {
    const events = getActiveEvents();
    let multiplier = 1.0;
    
    events.forEach(event => {
        if (event.taxMultiplier) {
            multiplier *= event.taxMultiplier;
        }
    });
    
    return multiplier;
}

// ===== EVENT SUMMARIES =====
function getActiveEventsSummary() {
    const events = getActiveEvents();
    
    return {
        count: events.length,
        byType: events.reduce((acc, e) => {
            acc[e.type] = (acc[e.type] || 0) + 1;
            return acc;
        }, {}),
        bySeverity: events.reduce((acc, e) => {
            acc[e.severity] = (acc[e.severity] || 0) + 1;
            return acc;
        }, {}),
        events: events.map(e => ({
            id: e.id,
            name: e.name,
            type: e.type,
            severity: e.severity,
            daysRemaining: Math.ceil((e.endTime - Date.now()) / (24 * 60 * 60 * 1000))
        }))
    };
}

function getEventStats() {
    const history = getEventHistory(1000);
    
    return {
        totalEvents: history.length,
        byType: history.reduce((acc, e) => {
            acc[e.type] = (acc[e.type] || 0) + 1;
            return acc;
        }, {}),
        bySeverity: history.reduce((acc, e) => {
            acc[e.severity] = (acc[e.severity] || 0) + 1;
            return acc;
        }, {}),
        averageDuration: history.reduce((sum, e) => sum + (e.duration || 0), 0) / history.length
    };
}

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EVENT_TYPES,
        EVENT_SEVERITY,
        initializeEventSystem,
        getActiveEvents,
        addEvent,
        removeEvent,
        getEventHistory,
        getEventNotifications,
        generateRandomEvent,
        checkAndExpireEvents,
        checkAndGenerateEvents,
        getEventPriceMultiplier,
        getEventDemandMultiplier,
        getEventSupplyMultiplier,
        getEventTaxMultiplier,
        getActiveEventsSummary,
        getEventStats,
        getEventSettings,
        saveEventSettings
    };
}

// Initialize on load
initializeEventSystem();

// js/economic-events.js - Dynamic economic events system for Voidfarer
// Includes labor pool distribution events

(function() {
    // ===== EVENT TYPES =====
    const EVENT_TYPES = {
        BOOM: 'boom',
        BUST: 'bust',
        SHORTAGE: 'shortage',
        SURPLUS: 'surplus',
        DISCOVERY: 'discovery',
        DISASTER: 'disaster',
        FESTIVAL: 'festival',
        MIGRATION: 'migration',
        TECHNOLOGY: 'technology',
        SPECULATION: 'speculation',
        POLICY: 'policy',
        HOLIDAY: 'holiday',
        // Labor Pool Events
        LABOR_SHORTAGE: 'labor_shortage',
        LABOR_SURPLUS: 'labor_surplus',
        SKILL_BOOM: 'skill_boom',
        BRAIN_DRAIN: 'brain_drain',
        GUILD_FORMATION: 'guild_formation',
        LABOR_STRIKE: 'labor_strike',
        MASTER_APPRENTICE: 'master_apprentice',
        KNOWLEDGE_SHARING: 'knowledge_sharing'
    };

    // ===== EVENT SEVERITY =====
    const EVENT_SEVERITY = {
        MINOR: 'minor',
        MODERATE: 'moderate',
        MAJOR: 'major',
        EPIC: 'epic'
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
        [EVENT_SEVERITY.MINOR]: { min: -0.15, max: 0.15 },
        [EVENT_SEVERITY.MODERATE]: { min: -0.3, max: 0.3 },
        [EVENT_SEVERITY.MAJOR]: { min: -0.5, max: 0.5 },
        [EVENT_SEVERITY.EPIC]: { min: -0.8, max: 0.8 }
    };

    // ===== LABOR POOL EFFECTS =====
    const LABOR_EFFECTS = {
        [EVENT_SEVERITY.MINOR]: { min: 0.05, max: 0.15 },
        [EVENT_SEVERITY.MODERATE]: { min: 0.15, max: 0.3 },
        [EVENT_SEVERITY.MAJOR]: { min: 0.3, max: 0.5 },
        [EVENT_SEVERITY.EPIC]: { min: 0.5, max: 0.8 }
    };

    // ===== STORAGE KEYS (for localStorage settings) =====
    const EVENT_STORAGE_KEYS = {
        EVENT_NOTIFICATIONS: 'voidfarer_event_notifications',
        EVENT_SETTINGS: 'voidfarer_event_settings',
        LAST_EVENT_CHECK: 'voidfarer_last_event_check',
        LABOR_POOL_HISTORY: 'voidfarer_labor_pool_history',
        LABOR_DISTRIBUTIONS: 'voidfarer_labor_distributions'
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

    // ===== SKILL CATEGORIES (for labor events) =====
    const SKILL_CATEGORIES = [
        'Basic Compounds',
        'Acids & Bases',
        'Salts & Minerals',
        'Hydrocarbons',
        'Alcohols',
        'Organic Acids',
        'Esters',
        'Ethers',
        'Amines',
        'Monomers',
        'Polymers',
        'Engineering Plastics',
        'Basic Alloys',
        'Stainless Steels',
        'Tool Steels',
        'Aluminum Alloys',
        'Titanium Alloys',
        'Superalloys',
        'Refractory Alloys',
        'Fibers',
        'Matrix Materials',
        'Composites',
        'Advanced Composites',
        'Silicon Processing',
        'Doping',
        'Dielectrics',
        'Devices',
        'Integrated Circuits',
        'Energy Storage',
        'Energy Generation',
        'Nanomaterials',
        'Smart Materials',
        'Antimatter',
        'Superheavy Elements',
        'Exotic Materials'
    ];

    // ===== LOCATION POOLS =====
    const SECTORS = [
        'Orion', 'Cygnus', 'Sagittarius', 'Perseus', 'Carina', 'Outer',
        'Core', 'Andromeda', 'Triangulum', 'Centaurus', 'Scutum', 'Norma'
    ];

    const COLONY_NAMES = [
        'New Hope', 'Prospect', 'Frontier', 'Eden', 'Aurora', 'Haven',
        'Sanctuary', 'Oasis', 'Nexus', 'Prime', 'Alpha', 'Omega'
    ];

    // Helper to get database instance
    async function getDb() {
        return window.getDb ? await window.getDb() : await idb.openDB('VoidfarerDB', 1);
    }

    // ===== INITIALIZE EVENT SYSTEM =====
    async function initializeEventSystem() {
        // Initialize event notifications in localStorage
        if (!localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_NOTIFICATIONS)) {
            localStorage.setItem(EVENT_STORAGE_KEYS.EVENT_NOTIFICATIONS, JSON.stringify([]));
        }
        
        // Initialize event settings in localStorage
        if (!localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_SETTINGS)) {
            const settings = {
                enabled: true,
                frequency: 0.3,
                maxActiveEvents: 5,
                notifyPlayers: true,
                severityWeights: {
                    [EVENT_SEVERITY.MINOR]: 0.5,
                    [EVENT_SEVERITY.MODERATE]: 0.3,
                    [EVENT_SEVERITY.MAJOR]: 0.15,
                    [EVENT_SEVERITY.EPIC]: 0.05
                },
                typeWeights: {
                    [EVENT_TYPES.BOOM]: 0.08,
                    [EVENT_TYPES.BUST]: 0.08,
                    [EVENT_TYPES.SHORTAGE]: 0.1,
                    [EVENT_TYPES.SURPLUS]: 0.1,
                    [EVENT_TYPES.DISCOVERY]: 0.08,
                    [EVENT_TYPES.DISASTER]: 0.04,
                    [EVENT_TYPES.FESTIVAL]: 0.06,
                    [EVENT_TYPES.MIGRATION]: 0.04,
                    [EVENT_TYPES.TECHNOLOGY]: 0.05,
                    [EVENT_TYPES.SPECULATION]: 0.06,
                    [EVENT_TYPES.POLICY]: 0.03,
                    [EVENT_TYPES.HOLIDAY]: 0.02,
                    // Labor pool events
                    [EVENT_TYPES.LABOR_SHORTAGE]: 0.06,
                    [EVENT_TYPES.LABOR_SURPLUS]: 0.06,
                    [EVENT_TYPES.SKILL_BOOM]: 0.04,
                    [EVENT_TYPES.BRAIN_DRAIN]: 0.03,
                    [EVENT_TYPES.GUILD_FORMATION]: 0.03,
                    [EVENT_TYPES.LABOR_STRIKE]: 0.02,
                    [EVENT_TYPES.MASTER_APPRENTICE]: 0.04,
                    [EVENT_TYPES.KNOWLEDGE_SHARING]: 0.04
                }
            };
            localStorage.setItem(EVENT_STORAGE_KEYS.EVENT_SETTINGS, JSON.stringify(settings));
        }
        
        // Initialize labor pool history
        if (!localStorage.getItem(EVENT_STORAGE_KEYS.LABOR_POOL_HISTORY)) {
            localStorage.setItem(EVENT_STORAGE_KEYS.LABOR_POOL_HISTORY, JSON.stringify([]));
        }
        
        // Initialize labor distributions
        if (!localStorage.getItem(EVENT_STORAGE_KEYS.LABOR_DISTRIBUTIONS)) {
            localStorage.setItem(EVENT_STORAGE_KEYS.LABOR_DISTRIBUTIONS, JSON.stringify([]));
        }
        
        // Set last event check
        if (!localStorage.getItem(EVENT_STORAGE_KEYS.LAST_EVENT_CHECK)) {
            localStorage.setItem(EVENT_STORAGE_KEYS.LAST_EVENT_CHECK, Date.now().toString());
        }
        
        console.log('Economic event system initialized with labor pool events');
    }

    // ===== EVENT MANAGEMENT (IndexedDB) =====
    async function getActiveEvents() {
        return await window.getAll('activeEvents') || [];
    }

    async function addEvent(event) {
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
            affectedSkill: event.affectedSkill || null,
            priceMultiplier: event.priceMultiplier || 1.0,
            demandMultiplier: event.demandMultiplier || 1.0,
            supplyMultiplier: event.supplyMultiplier || 1.0,
            taxMultiplier: event.taxMultiplier || 1.0,
            laborMultiplier: event.laborMultiplier || 1.0,
            skillMultiplier: event.skillMultiplier || 1.0,
            notificationsSent: false
        };
        
        await window.setItem('activeEvents', newEvent);
        await addToEventHistory({ ...newEvent, ended: false, addedAt: Date.now() });
        
        return newEvent;
    }

    async function removeEvent(eventId) {
        const event = await window.getItem('activeEvents', eventId);
        
        if (event) {
            await addToEventHistory({
                ...event,
                ended: true,
                endedAt: Date.now(),
                endedDate: new Date().toISOString()
            });
        }
        
        await window.deleteItem('activeEvents', eventId);
        return await getActiveEvents();
    }

    // ===== EVENT HISTORY (IndexedDB) =====
    async function getEventHistory(limit = 100) {
        const allHistory = await window.getAll('eventHistory') || [];
        return allHistory.slice(-limit);
    }

    async function addToEventHistory(entry) {
        const newEntry = {
            ...entry,
            historyId: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            recordedAt: Date.now()
        };
        
        await window.setItem('eventHistory', newEntry);
        
        const allHistory = await window.getAll('eventHistory') || [];
        if (allHistory.length > 1000) {
            const toDelete = allHistory.slice(0, allHistory.length - 1000);
            for (const entry of toDelete) {
                await window.deleteItem('eventHistory', entry.historyId);
            }
        }
        
        return newEntry;
    }

    // ===== EVENT NOTIFICATIONS (localStorage) =====
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
        
        localStorage.setItem(EVENT_STORAGE_KEYS.EVENT_NOTIFICATIONS, JSON.stringify(allNotes));
    }

    // ===== LABOR POOL HISTORY =====
    function addLaborPoolEvent(event) {
        const history = localStorage.getItem(EVENT_STORAGE_KEYS.LABOR_POOL_HISTORY);
        const allEvents = history ? JSON.parse(history) : [];
        
        allEvents.push({
            ...event,
            timestamp: Date.now(),
            date: new Date().toISOString()
        });
        
        if (allEvents.length > 100) {
            allEvents.shift();
        }
        
        localStorage.setItem(EVENT_STORAGE_KEYS.LABOR_POOL_HISTORY, JSON.stringify(allEvents));
    }

    function getLaborPoolHistory(limit = 20) {
        const history = localStorage.getItem(EVENT_STORAGE_KEYS.LABOR_POOL_HISTORY);
        const allEvents = history ? JSON.parse(history) : [];
        return allEvents.slice(-limit).reverse();
    }

    // ===== EVENT GENERATION =====
    function getEventSettings() {
        const settings = localStorage.getItem(EVENT_STORAGE_KEYS.EVENT_SETTINGS);
        return settings ? JSON.parse(settings) : {
            enabled: true,
            frequency: 0.3,
            maxActiveEvents: 5,
            notifyPlayers: true,
            severityWeights: {
                [EVENT_SEVERITY.MINOR]: 0.5,
                [EVENT_SEVERITY.MODERATE]: 0.3,
                [EVENT_SEVERITY.MAJOR]: 0.15,
                [EVENT_SEVERITY.EPIC]: 0.05
            },
            typeWeights: {
                [EVENT_TYPES.BOOM]: 0.08,
                [EVENT_TYPES.BUST]: 0.08,
                [EVENT_TYPES.SHORTAGE]: 0.1,
                [EVENT_TYPES.SURPLUS]: 0.1,
                [EVENT_TYPES.DISCOVERY]: 0.08,
                [EVENT_TYPES.DISASTER]: 0.04,
                [EVENT_TYPES.FESTIVAL]: 0.06,
                [EVENT_TYPES.MIGRATION]: 0.04,
                [EVENT_TYPES.TECHNOLOGY]: 0.05,
                [EVENT_TYPES.SPECULATION]: 0.06,
                [EVENT_TYPES.POLICY]: 0.03,
                [EVENT_TYPES.HOLIDAY]: 0.02,
                [EVENT_TYPES.LABOR_SHORTAGE]: 0.06,
                [EVENT_TYPES.LABOR_SURPLUS]: 0.06,
                [EVENT_TYPES.SKILL_BOOM]: 0.04,
                [EVENT_TYPES.BRAIN_DRAIN]: 0.03,
                [EVENT_TYPES.GUILD_FORMATION]: 0.03,
                [EVENT_TYPES.LABOR_STRIKE]: 0.02,
                [EVENT_TYPES.MASTER_APPRENTICE]: 0.04,
                [EVENT_TYPES.KNOWLEDGE_SHARING]: 0.04
            }
        };
    }

    async function generateRandomEvent() {
        const settings = getEventSettings();
        if (!settings.enabled) return null;
        
        if (Math.random() > settings.frequency) return null;
        
        const activeEvents = await getActiveEvents();
        if (activeEvents.length >= settings.maxActiveEvents) return null;
        
        const severity = selectWeightedItem(settings.severityWeights);
        const type = selectWeightedItem(settings.typeWeights);
        
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
            case EVENT_TYPES.LABOR_SHORTAGE:
                event = generateLaborShortageEvent(severity);
                break;
            case EVENT_TYPES.LABOR_SURPLUS:
                event = generateLaborSurplusEvent(severity);
                break;
            case EVENT_TYPES.SKILL_BOOM:
                event = generateSkillBoomEvent(severity);
                break;
            case EVENT_TYPES.BRAIN_DRAIN:
                event = generateBrainDrainEvent(severity);
                break;
            case EVENT_TYPES.GUILD_FORMATION:
                event = generateGuildFormationEvent(severity);
                break;
            case EVENT_TYPES.LABOR_STRIKE:
                event = generateLaborStrikeEvent(severity);
                break;
            case EVENT_TYPES.MASTER_APPRENTICE:
                event = generateMasterApprenticeEvent(severity);
                break;
            case EVENT_TYPES.KNOWLEDGE_SHARING:
                event = generateKnowledgeSharingEvent(severity);
                break;
        }
        
        if (event) {
            const newEvent = await addEvent(event);
            
            if (settings.notifyPlayers) {
                broadcastEventNotification(newEvent);
            }
            
            addToAdjustmentLog({
                type: 'EVENT_GENERATED',
                eventId: newEvent.id,
                eventName: newEvent.name,
                severity: newEvent.severity,
                timestamp: Date.now()
            });
            
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

    function getRandomSkill() {
        return SKILL_CATEGORIES[Math.floor(Math.random() * SKILL_CATEGORIES.length)];
    }

    function getRandomSector() {
        return SECTORS[Math.floor(Math.random() * SECTORS.length)];
    }

    function getRandomColonyName() {
        return COLONY_NAMES[Math.floor(Math.random() * COLONY_NAMES.length)];
    }

    // ===== LABOR POOL EVENT GENERATORS =====

    function generateLaborShortageEvent(severity) {
        const duration = getRandomDuration(severity);
        const laborEffect = getRandomLaborEffect(severity);
        const skill = getRandomSkill();
        const sector = getRandomSector();
        
        const names = {
            [EVENT_SEVERITY.MINOR]: `Minor ${skill} Labor Shortage`,
            [EVENT_SEVERITY.MODERATE]: `${skill} Worker Shortage`,
            [EVENT_SEVERITY.MAJOR]: `Critical ${skill} Labor Crisis`,
            [EVENT_SEVERITY.EPIC]: `Complete ${skill} Labor Collapse`
        };
        
        const descriptions = {
            [EVENT_SEVERITY.MINOR]: `A shortage of ${skill} workers in ${sector} has increased labor costs by ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.MODERATE]: `${skill} workers are scarce in ${sector}! Labor costs up ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.MAJOR]: `Critical shortage of ${skill} labor in ${sector}! Costs increased ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.EPIC]: `Complete collapse of ${skill} labor pool in ${sector}! Costs skyrocketed ${Math.round(laborEffect * 100)}%!`
        };
        
        return {
            type: EVENT_TYPES.LABOR_SHORTAGE,
            severity,
            name: names[severity],
            description: descriptions[severity],
            duration,
            location: 'sector',
            affectedSector: sector,
            affectedSkill: skill,
            laborMultiplier: 1 + laborEffect,
            skillMultiplier: 1.0
        };
    }

    function generateLaborSurplusEvent(severity) {
        const duration = getRandomDuration(severity);
        const laborEffect = getRandomLaborEffect(severity);
        const skill = getRandomSkill();
        const sector = getRandomSector();
        
        const names = {
            [EVENT_SEVERITY.MINOR]: `${skill} Labor Surplus`,
            [EVENT_SEVERITY.MODERATE]: `Abundant ${skill} Workers`,
            [EVENT_SEVERITY.MAJOR]: `${skill} Labor Glut`,
            [EVENT_SEVERITY.EPIC]: `Flood of ${skill} Workers`
        };
        
        const descriptions = {
            [EVENT_SEVERITY.MINOR]: `An surplus of ${skill} workers in ${sector} has reduced labor costs by ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.MODERATE]: `${skill} workers are abundant in ${sector}! Costs down ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.MAJOR]: `Massive surplus of ${skill} labor in ${sector}! Costs decreased ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.EPIC]: `Flood of ${skill} workers into ${sector}! Costs plummeted ${Math.round(laborEffect * 100)}%!`
        };
        
        return {
            type: EVENT_TYPES.LABOR_SURPLUS,
            severity,
            name: names[severity],
            description: descriptions[severity],
            duration,
            location: 'sector',
            affectedSector: sector,
            affectedSkill: skill,
            laborMultiplier: 1 - laborEffect,
            skillMultiplier: 1.0
        };
    }

    function generateSkillBoomEvent(severity) {
        const duration = getRandomDuration(severity);
        const laborEffect = getRandomLaborEffect(severity) / 2;
        const skill = getRandomSkill();
        const sector = getRandomSector();
        
        const names = {
            [EVENT_SEVERITY.MINOR]: `${skill} Renaissance`,
            [EVENT_SEVERITY.MODERATE]: `${skill} Golden Age`,
            [EVENT_SEVERITY.MAJOR]: `${skill} Revolution`,
            [EVENT_SEVERITY.EPIC]: `${skill} Enlightenment`
        };
        
        const descriptions = {
            [EVENT_SEVERITY.MINOR]: `A renaissance in ${skill} has increased mastery gains by ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.MODERATE]: `Golden age of ${skill}! Mastery gains increased ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.MAJOR]: `Revolution in ${skill} techniques! Mastery gains up ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.EPIC]: `The ${skill} Enlightenment! Mastery gains increased ${Math.round(laborEffect * 100)}%!`
        };
        
        return {
            type: EVENT_TYPES.SKILL_BOOM,
            severity,
            name: names[severity],
            description: descriptions[severity],
            duration,
            location: 'sector',
            affectedSector: sector,
            affectedSkill: skill,
            laborMultiplier: 1.0,
            skillMultiplier: 1 + laborEffect
        };
    }

    function generateBrainDrainEvent(severity) {
        const duration = getRandomDuration(severity);
        const laborEffect = getRandomLaborEffect(severity);
        const fromSector = getRandomSector();
        let toSector;
        do {
            toSector = getRandomSector();
        } while (toSector === fromSector);
        const skill = getRandomSkill();
        
        const names = {
            [EVENT_SEVERITY.MINOR]: `Minor ${skill} Brain Drain`,
            [EVENT_SEVERITY.MODERATE]: `${skill} Talent Exodus`,
            [EVENT_SEVERITY.MAJOR]: `Major ${skill} Brain Drain`,
            [EVENT_SEVERITY.EPIC]: `${skill} Brain Drain Catastrophe`
        };
        
        const descriptions = {
            [EVENT_SEVERITY.MINOR]: `${skill} workers are leaving ${fromSector} for ${toSector}. Labor costs shifting.`,
            [EVENT_SEVERITY.MODERATE]: `${skill} talent exodus from ${fromSector} to ${toSector}! Major labor shifts.`,
            [EVENT_SEVERITY.MAJOR]: `Major brain drain of ${skill} workers from ${fromSector} to ${toSector}!`,
            [EVENT_SEVERITY.EPIC]: `Catastrophic brain drain! ${skill} workers fleeing ${fromSector} to ${toSector}!`
        };
        
        return {
            type: EVENT_TYPES.BRAIN_DRAIN,
            severity,
            name: names[severity],
            description: descriptions[severity],
            duration,
            location: 'interstellar',
            fromSector,
            toSector,
            affectedSkill: skill,
            laborShift: laborEffect
        };
    }

    function generateGuildFormationEvent(severity) {
        const duration = getRandomDuration(severity);
        const laborEffect = getRandomLaborEffect(severity) / 2;
        const skill = getRandomSkill();
        const sector = getRandomSector();
        const guildName = `${skill} ${['Guild', 'Society', 'Order', 'Council', 'Alliance'][Math.floor(Math.random() * 5)]}`;
        
        const names = {
            [EVENT_SEVERITY.MINOR]: `${guildName} Formed`,
            [EVENT_SEVERITY.MODERATE]: `${guildName} Established`,
            [EVENT_SEVERITY.MAJOR]: `${guildName} Dominance`,
            [EVENT_SEVERITY.EPIC]: `${guildName} Ascendancy`
        };
        
        const descriptions = {
            [EVENT_SEVERITY.MINOR]: `A new ${guildName} has formed in ${sector}. ${skill} workers gain +${Math.round(laborEffect * 100)}% labor share.`,
            [EVENT_SEVERITY.MODERATE]: `The ${guildName} has been established! ${skill} workers gain +${Math.round(laborEffect * 100)}% labor share.`,
            [EVENT_SEVERITY.MAJOR]: `The ${guildName} now dominates ${skill} in ${sector}! Labor share increased ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.EPIC]: `The ${guildName} has achieved ascendancy! ${skill} workers gain +${Math.round(laborEffect * 100)}% labor share!`
        };
        
        return {
            type: EVENT_TYPES.GUILD_FORMATION,
            severity,
            name: names[severity],
            description: descriptions[severity],
            duration,
            location: 'sector',
            affectedSector: sector,
            affectedSkill: skill,
            laborMultiplier: 1 + laborEffect,
            guildName
        };
    }

    function generateLaborStrikeEvent(severity) {
        const duration = getRandomDuration(severity);
        const laborEffect = getRandomLaborEffect(severity);
        const skill = getRandomSkill();
        const sector = getRandomSector();
        
        const names = {
            [EVENT_SEVERITY.MINOR]: `${skill} Work Stoppage`,
            [EVENT_SEVERITY.MODERATE]: `${skill} Strike`,
            [EVENT_SEVERITY.MAJOR]: `General ${skill} Strike`,
            [EVENT_SEVERITY.EPIC]: `${skill} Labor Uprising`
        };
        
        const descriptions = {
            [EVENT_SEVERITY.MINOR]: `${skill} workers in ${sector} have stopped work. Production halted.`,
            [EVENT_SEVERITY.MODERATE]: `${skill} strike in ${sector}! No production until resolved.`,
            [EVENT_SEVERITY.MAJOR]: `General strike of all ${skill} workers in ${sector}! Complete production halt.`,
            [EVENT_SEVERITY.EPIC]: `${skill} labor uprising in ${sector}! Revolution in the workplace!`
        };
        
        return {
            type: EVENT_TYPES.LABOR_STRIKE,
            severity,
            name: names[severity],
            description: descriptions[severity],
            duration,
            location: 'sector',
            affectedSector: sector,
            affectedSkill: skill,
            laborMultiplier: 0,
            supplyMultiplier: 0.1
        };
    }

    function generateMasterApprenticeEvent(severity) {
        const duration = getRandomDuration(severity);
        const laborEffect = getRandomLaborEffect(severity) / 2;
        const skill = getRandomSkill();
        const sector = getRandomSector();
        
        const names = {
            [EVENT_SEVERITY.MINOR]: `${skill} Mentorship Program`,
            [EVENT_SEVERITY.MODERATE]: `${skill} Master-Apprentice Tradition`,
            [EVENT_SEVERITY.MAJOR]: `Great ${skill} Teaching`,
            [EVENT_SEVERITY.EPIC]: `${skill} Wisdom Transmission`
        };
        
        const descriptions = {
            [EVENT_SEVERITY.MINOR]: `Masters are taking on apprentices in ${skill}. Skill gain increased ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.MODERATE]: `The master-apprentice tradition flourishes! ${skill} gain increased ${Math.round(laborEffect * 100)}%.`,
            [EVENT_SEVERITY.MAJOR]: `Great teaching in ${skill}! All crafts grant +${Math.round(laborEffect * 100)}% skill.`,
            [EVENT_SEVERITY.EPIC]: `Ancient wisdom of ${skill} is being passed down! Skill gain doubled!`
        };
        
        return {
            type: EVENT_TYPES.MASTER_APPRENTICE,
            severity,
            name: names[severity],
            description: descriptions[severity],
            duration,
            location: 'sector',
            affectedSector: sector,
            affectedSkill: skill,
            skillMultiplier: 1 + laborEffect * 2
        };
    }

    function generateKnowledgeSharingEvent(severity) {
        const duration = getRandomDuration(severity);
        const laborEffect = getRandomLaborEffect(severity);
        const sector = getRandomSector();
        
        const names = {
            [EVENT_SEVERITY.MINOR]: `Knowledge Exchange`,
            [EVENT_SEVERITY.MODERATE]: `Interdisciplinary Conference`,
            [EVENT_SEVERITY.MAJOR]: `Great Knowledge Sharing`,
            [EVENT_SEVERITY.EPIC]: `Universal Knowledge Access`
        };
        
        const descriptions = {
            [EVENT_SEVERITY.MINOR]: `Scientists are sharing knowledge in ${sector}. All skill gains increased.`,
            [EVENT_SEVERITY.MODERATE]: `Interdisciplinary conference in ${sector}! Cross-pollination of ideas.`,
            [EVENT_SEVERITY.MAJOR]: `Great knowledge sharing event! All skills gain bonus progress.`,
            [EVENT_SEVERITY.EPIC]: `Universal knowledge access achieved! All crafts grant double skill!`
        };
        
        return {
            type: EVENT_TYPES.KNOWLEDGE_SHARING,
            severity,
            name: names[severity],
            description: descriptions[severity],
            duration,
            location: 'sector',
            affectedSector: sector,
            skillMultiplier: 1 + laborEffect
        };
    }

    // ===== ORIGINAL EVENT GENERATORS =====
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
            [EVENT_SEVERITY.EPIC]: `The Great Galactic Celebration`
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
            taxMultiplier: 0.9
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

    function getRandomLaborEffect(severity) {
        const range = LABOR_EFFECTS[severity];
        return (Math.random() * (range.max - range.min) + range.min);
    }

    // ===== EVENT PROCESSING =====
    async function checkAndExpireEvents() {
        const events = await getActiveEvents();
        const now = Date.now();
        let expired = false;
        
        for (const event of events) {
            if (event.endTime <= now) {
                await removeEvent(event.id);
                expired = true;
                
                addToAdjustmentLog({
                    type: 'EVENT_EXPIRED',
                    eventId: event.id,
                    eventName: event.name,
                    timestamp: Date.now()
                });
            }
        }
        
        return expired;
    }

    async function checkAndGenerateEvents() {
        const settings = getEventSettings();
        if (!settings.enabled) return [];
        
        const lastCheck = parseInt(localStorage.getItem(EVENT_STORAGE_KEYS.LAST_EVENT_CHECK)) || 0;
        const now = Date.now();
        const hoursSinceLastCheck = (now - lastCheck) / (1000 * 60 * 60);
        
        const eventsGenerated = [];
        
        if (hoursSinceLastCheck >= 24) {
            const daysPassed = Math.floor(hoursSinceLastCheck / 24);
            
            for (let i = 0; i < daysPassed; i++) {
                const event = await generateRandomEvent();
                if (event) eventsGenerated.push(event);
            }
            
            localStorage.setItem(EVENT_STORAGE_KEYS.LAST_EVENT_CHECK, now.toString());
        }
        
        return eventsGenerated;
    }

    function broadcastEventNotification(event) {
        console.log(`EVENT: ${event.name} - ${event.description}`);
        addToEventHistory({ ...event, broadcasted: true, broadcastedAt: Date.now() });
    }

    async function getEventPriceMultiplier(resource, sector) {
        const events = await getActiveEvents();
        let multiplier = 1.0;
        
        events.forEach(event => {
            if (event.priceMultiplier) {
                if (!event.affectedSector) {
                    multiplier *= event.priceMultiplier;
                } else if (event.affectedSector === sector) {
                    multiplier *= event.priceMultiplier;
                } else if (event.affectedResource === resource) {
                    multiplier *= event.priceMultiplier;
                }
            }
        });
        
        return multiplier;
    }

    async function getEventDemandMultiplier(resource, sector) {
        const events = await getActiveEvents();
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

    async function getEventSupplyMultiplier(resource, sector) {
        const events = await getActiveEvents();
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

    async function getEventTaxMultiplier() {
        const events = await getActiveEvents();
        let multiplier = 1.0;
        
        events.forEach(event => {
            if (event.taxMultiplier) {
                multiplier *= event.taxMultiplier;
            }
        });
        
        return multiplier;
    }

    async function getEventLaborMultiplier(skill, sector) {
        const events = await getActiveEvents();
        let multiplier = 1.0;
        
        events.forEach(event => {
            if (event.laborMultiplier) {
                if (!event.affectedSector || event.affectedSector === sector) {
                    multiplier *= event.laborMultiplier;
                }
                if (event.affectedSkill === skill) {
                    multiplier *= event.laborMultiplier;
                }
            }
        });
        
        return multiplier;
    }

    async function getEventSkillMultiplier(skill, sector) {
        const events = await getActiveEvents();
        let multiplier = 1.0;
        
        events.forEach(event => {
            if (event.skillMultiplier) {
                if (!event.affectedSector || event.affectedSector === sector) {
                    multiplier *= event.skillMultiplier;
                }
                if (event.affectedSkill === skill) {
                    multiplier *= event.skillMultiplier;
                }
            }
        });
        
        return multiplier;
    }

    // ===== EVENT SUMMARIES =====
    async function getActiveEventsSummary() {
        const events = await getActiveEvents();
        
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

    async function getEventStats() {
        const history = await getEventHistory(1000);
        
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

    // ===== LABOR POOL EVENT APPLICATION =====
    async function applyLaborPoolEvents() {
        const events = await getActiveEvents();
        let totalLaborMultiplier = 1.0;
        let totalSkillMultiplier = 1.0;
        
        events.forEach(event => {
            if (event.laborMultiplier) {
                totalLaborMultiplier *= event.laborMultiplier;
            }
            if (event.skillMultiplier) {
                totalSkillMultiplier *= event.skillMultiplier;
            }
        });
        
        return {
            laborMultiplier: totalLaborMultiplier,
            skillMultiplier: totalSkillMultiplier,
            events: events.filter(e => e.laborMultiplier || e.skillMultiplier)
        };
    }

    // ===== DAILY EVENT MAINTENANCE =====
    async function runDailyEventMaintenance() {
        console.log('Running daily event maintenance...');
        
        const expired = await checkAndExpireEvents();
        const newEvents = await checkAndGenerateEvents();
        
        addToAdjustmentLog({
            type: 'EVENT_MAINTENANCE',
            expiredCount: expired ? 1 : 0,
            newEventsCount: newEvents.length,
            timestamp: Date.now()
        });
        
        return { expired, newEvents };
    }

    // Helper function to add to adjustment log
    function addToAdjustmentLog(entry) {
        try {
            const log = localStorage.getItem('voidfarer_adjustment_log');
            const allLogs = log ? JSON.parse(log) : [];
            
            allLogs.push({
                ...entry,
                timestamp: entry.timestamp || Date.now(),
                date: new Date().toISOString()
            });
            
            if (allLogs.length > 1000) {
                allLogs.shift();
            }
            
            localStorage.setItem('voidfarer_adjustment_log', JSON.stringify(allLogs));
        } catch (error) {
            console.error('Error adding to adjustment log:', error);
        }
    }

    // ===== EXPORT TO WINDOW =====
    window.EVENT_TYPES = EVENT_TYPES;
    window.EVENT_SEVERITY = EVENT_SEVERITY;
    window.initializeEventSystem = initializeEventSystem;
    window.getActiveEvents = getActiveEvents;
    window.addEvent = addEvent;
    window.removeEvent = removeEvent;
    window.getEventHistory = getEventHistory;
    window.addToEventHistory = addToEventHistory;
    window.getEventNotifications = getEventNotifications;
    window.addEventNotification = addEventNotification;
    window.getEventSettings = getEventSettings;
    window.generateRandomEvent = generateRandomEvent;
    window.checkAndExpireEvents = checkAndExpireEvents;
    window.checkAndGenerateEvents = checkAndGenerateEvents;
    window.broadcastEventNotification = broadcastEventNotification;
    window.getEventPriceMultiplier = getEventPriceMultiplier;
    window.getEventDemandMultiplier = getEventDemandMultiplier;
    window.getEventSupplyMultiplier = getEventSupplyMultiplier;
    window.getEventTaxMultiplier = getEventTaxMultiplier;
    window.getEventLaborMultiplier = getEventLaborMultiplier;
    window.getEventSkillMultiplier = getEventSkillMultiplier;
    window.getActiveEventsSummary = getActiveEventsSummary;
    window.getEventStats = getEventStats;
    window.applyLaborPoolEvents = applyLaborPoolEvents;
    window.getLaborPoolHistory = getLaborPoolHistory;
    window.addLaborPoolEvent = addLaborPoolEvent;
    window.runDailyEventMaintenance = runDailyEventMaintenance;
})();

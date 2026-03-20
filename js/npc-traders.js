// js/npc-traders.js - NPC Trader System for Voidfarer Marketplace
// Creates and manages 1000 simulated traders with personalities
// UPDATED: Added market orders and liquidity taking for real trading behavior
// UPDATED: Fixed price validation to prevent "Price data not available" errors
// UPDATED: Fixed element filtering to use current price instead of bid/ask
// UPDATED: Added updatePrices() call to ensure fresh price data each cycle
// UPDATED: Added enhanced debug logging to diagnose zero actions issue
// UPDATED: Fixed to only trade chemical elements on VoidEx (no ship parts)
// UPDATED: Added inventory pruning to prevent excessive storage growth
// UPDATED: FIXED - Now writes orders to IndexedDB instead of localStorage

import { 
    saveNPCTraders, loadNPCTraders,
    saveNPCOrders, loadNPCOrders,
    saveNPCStats, loadNPCStats,
    getLastNPCUpdate, setLastNPCUpdate,
    updateNPCTraderAfterTrade as storageUpdateNPCTraderAfterTrade
} from './storage.js';

import {
    dbSaveNPCTrader, dbGetAllNPCTraders,
    dbSaveNPCOrder, dbGetAllNPCOrders, dbDeleteNPCOrder,
    dbRecordNPCTrade, dbGetActiveNPCOrders,
    dbGetNPCOrdersByElement, dbGetNPCOrdersBySide,
    dbGetNPCTradersByType, dbGetActiveNPCTraders,
    dbGetNPCTradersByLastActivity, dbGetNPCOrder,
    dbSaveMarketOrders, dbLoadMarketOrders
} from './db.js';

import marketDynamics from './market-dynamics.js';
const { getCurrentPrices, getBidPrice, getAskPrice, updatePrices } = marketDynamics;

import { ORDER_TYPES, ORDER_SIDES, ORDER_STATUS, createOrder } from './market-engine.js';

// ===== TRADER TYPE DEFINITIONS =====

export const TRADER_TYPES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    WHALE: 'whale',
    MARKET_MAKER: 'marketMaker'
};

export const TRADER_PERSONALITIES = {
    SCALPER: 'scalper',
    TREND_FOLLOWER: 'trendFollower',
    VALUE_TRADER: 'valueTrader',
    RANDOM: 'random',
    INACTIVE: 'inactive',
    MARKET_MAKER: 'marketMaker'
};

// Type configuration - NPC count remains 1000 total
const TRADER_TYPE_CONFIG = {
    [TRADER_TYPES.SMALL]: {
        count: 500,
        creditMin: 5000,
        creditMax: 20000,
        orderSizeMin: 1,
        orderSizeMax: 10,
        description: 'Small Retail'
    },
    [TRADER_TYPES.MEDIUM]: {
        count: 300,
        creditMin: 20000,
        creditMax: 100000,
        orderSizeMin: 10,
        orderSizeMax: 50,
        description: 'Medium Traders'
    },
    [TRADER_TYPES.LARGE]: {
        count: 120,
        creditMin: 100000,
        creditMax: 500000,
        orderSizeMin: 50,
        orderSizeMax: 200,
        description: 'Large Traders'
    },
    [TRADER_TYPES.WHALE]: {
        count: 50,
        creditMin: 500000,
        creditMax: 2000000,
        orderSizeMin: 200,
        orderSizeMax: 1000,
        description: 'Whales'
    },
    [TRADER_TYPES.MARKET_MAKER]: {
        count: 30,
        creditMin: 200000,
        creditMax: 1000000,
        orderSizeMin: 50,
        orderSizeMax: 500,
        description: 'Market Makers'
    }
};

// Personality distribution (percentages)
const PERSONALITY_DISTRIBUTION = {
    [TRADER_PERSONALITIES.SCALPER]: 28,        // 28%
    [TRADER_PERSONALITIES.TREND_FOLLOWER]: 23, // 23%
    [TRADER_PERSONALITIES.VALUE_TRADER]: 18,   // 18%
    [TRADER_PERSONALITIES.RANDOM]: 15,         // 15%
    [TRADER_PERSONALITIES.MARKET_MAKER]: 8,    // 8%
    [TRADER_PERSONALITIES.INACTIVE]: 8         // 8%
};

// ===== TRADER NAMES =====

export const NPC_TRADER_NAMES = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
    'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
    'Phi', 'Chi', 'Psi', 'Omega', 'Astra', 'Nova', 'Vega', 'Sirius', 'Orion', 'Andromeda',
    'Cassiopeia', 'Draco', 'Phoenix', 'Aurora', 'Eclipse', 'Comet', 'Meteor', 'Galaxy',
    'Nebula', 'Quasar', 'Pulsar', 'Sol', 'Luna', 'Titan', 'Europa', 'Ganymede', 'Callisto',
    'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
    'Ceres', 'Vesta', 'Pallas', 'Hygeia', 'Interstellar', 'Cosmos', 'Stellar', 'Astral',
    'Nova', 'Supernova', 'Hyperion', 'Iapetus', 'Rhea', 'Dione', 'Tethys', 'Enceladus',
    'Mimas', 'Phoebe', 'Janus', 'Epimetheus', 'Helene', 'Telesto', 'Calypso', 'Atlas',
    'Prometheus', 'Pandora', 'Pan', 'Daphnis', 'Anthe', 'Methone', 'Pallene', 'Polydeuces',
    'Vanguard', 'Pioneer', 'Explorer', 'Voyager', 'Odyssey', 'Endeavour', 'Discovery',
    'Atlantis', 'Challenger', 'Enterprise', 'Intrepid', 'Reliant', 'Defiant', 'Sovereign',
    'Aegis', 'Aether', 'Aion', 'Ananke', 'Anansi', 'Anzu', 'Apate', 'Aporia', 'Arae',
    'Ate', 'Bia', 'Caerus', 'Circe', 'Cratos', 'Deimos', 'Dike', 'Dolos', 'Dysnomia',
    'Eirene', 'Ekecheiria', 'Eleos', 'Elpis', 'Epione', 'Eris', 'Eros', 'Eupraxia',
    'Geras', 'Harmonia', 'Hebe', 'Hedone', 'Hemera', 'Hesperus', 'Horkos', 'Hybris',
    'Hypnos', 'Iris', 'Keres', 'Koalemos', 'Kratos', 'Limos', 'Lyssa', 'Mania', 'Methe',
    'Momus', 'Moros', 'Nemesis', 'Nike', 'Nomos', 'Oizys', 'Palioxis', 'Peitho',
    'Penia', 'Penthus', 'Pheme', 'Philotes', 'Phobos', 'Phthonus', 'Pistis', 'Poine',
    'Ponos', 'Pothos', 'Proioxis', 'Ptocheia', 'Soter', 'Sophrosyne', 'Techne', 'Thanatos',
    'Thrasos', 'Tyche', 'Zelus', 'Adephagia', 'Adikia', 'Aergia', 'Agon', 'Aidos',
    'Aisa', 'Alala', 'Alastor', 'Alecto', 'Aletheia', 'Algea', 'Alke', 'Amphilogiai',
    'Anaideia', 'Androktasia', 'Angelos', 'Apate', 'Apheleia', 'Aporia', 'Arete',
    'Arke', 'Aspalis', 'Asteria', 'Astraeus', 'Ate', 'Atropos', 'Aura', 'Bia',
    'Boreas', 'Brizo', 'Cacodaemon', 'Caelus', 'Caeneus', 'Calypso', 'Cerus',
    'Chaos', 'Chronos', 'Circe', 'Clotho', 'Coeus', 'Crius', 'Cronus', 'Cybele',
    'Demeter', 'Dione', 'Dionysus', 'Doris', 'Echo', 'Electra', 'Eos', 'Epimetheus',
    'Erebus', 'Erinyes', 'Eris', 'Eros', 'Ether', 'Eunomia', 'Euphrosyne', 'Europa',
    'Eurus', 'Eurybia', 'Euryphaessa', 'Eurytus', 'Gaia', 'Galene', 'Geras',
    'Gigantes', 'Glaucus', 'Gorgons', 'Graeae', 'Hades', 'Harmonia', 'Harpies',
    'Hecate', 'Helios', 'Hemera', 'Hephaestus', 'Hera', 'Heracles', 'Hermaphroditus',
    'Hermes', 'Hesperides', 'Hesperus', 'Hestia', 'Himeros', 'Hippocampus', 'Horae',
    'Hyades', 'Hydra', 'Hygieia', 'Hymen', 'Hyperion', 'Hypnos', 'Iacchus', 'Iapetus',
    'Iaso', 'Iris', 'Keres', 'Lachesis', 'Lampades', 'Leto', 'Maia', 'Mania',
    'Megaera', 'Melinoe', 'Melpomene', 'Menoeceus', 'Menoetius', 'Mentor', 'Merope',
    'Metis', 'Minos', 'Mnemosyne', 'Moirai', 'Momus', 'Morpheus', 'Musaeus', 'Muses',
    'Naiads', 'Nephele', 'Nereids', 'Nereus', 'Nesoi', 'Nike', 'Nyx', 'Oceanids',
    'Oceanus', 'Oizys', 'Oneiroi', 'Ophion', 'Oreads', 'Ourea', 'Paean', 'Palaemon',
    'Pallas', 'Pan', 'Pandora', 'Pasithea', 'Pegasus', 'Peitho', 'Peleus', 'Pelias',
    'Penia', 'Perseis', 'Perseus', 'Perses', 'Persephone', 'Phaethon', 'Pheme',
    'Philyra', 'Phorcys', 'Phosphorus', 'Phthonus', 'Pistis', 'Plutus', 'Podarge',
    'Poena', 'Polemos', 'Polyhymnia', 'Polymnia', 'Ponos', 'Pontus', 'Porus',
    'Poseidon', 'Potamoi', 'Priapus', 'Proioxis', 'Prometheus', 'Proteus', 'Psyche',
    'Ptocheia', 'Pyrrha', 'Rhadamanthus', 'Rhea', 'Rhoeo', 'Sarpedon', 'Selene',
    'Semele', 'Silenus', 'Sirens', 'Sisyphus', 'Soter', 'Soteria', 'Sterope',
    'Styx', 'Symplegades', 'Synallaxis', 'Tantalus', 'Tartarus', 'Taygete', 'Telchines',
    'Telephus', 'Telesphorus', 'Telete', 'Terpsichore', 'Thalassa', 'Thalia',
    'Thanatos', 'Thaumas', 'Thea', 'Themis', 'Thetis', 'Thrasos', 'Tisiphone',
    'Titans', 'Tithonus', 'Triton', 'Tyche', 'Typhon', 'Urania', 'Uranus', 'Zelus',
    'Zephyrus', 'Zeus'
];

// Generate 500+ unique trader names by combining
export function generateTraderNames(count = 500) {
    const prefixes = ['Captain', 'Commander', 'Admiral', 'Pilot', 'Navigator', 'Engineer', 'Scientist', 'Doctor', 'Professor', 'Chief', 'Major', 'Sergeant', 'Corporal', 'Private', 'Agent', 'Officer', 'Marshal', 'Sheriff', 'Ranger', 'Scout', 'Hunter', 'Trader', 'Merchant', 'Broker', 'Dealer', 'Magnate', 'Baron', 'Duke', 'Count', 'Lord', 'Lady', 'Sir', 'Dame'];
    const suffixes = ['Industries', 'Trading', 'Mining', 'Shipping', 'Transport', 'Logistics', 'Exports', 'Imports', 'Goods', 'Commodities', 'Holdings', 'Ventures', 'Enterprises', 'Corporation', 'Limited', 'Inc', 'Co', 'Group', 'Syndicate', 'Cartel', 'Guild', 'Union', 'Alliance', 'Federation', 'Confederacy', 'Collective', 'Conglomerate'];
    
    const names = [];
    
    for (let i = 0; i < count; i++) {
        const name = NPC_TRADER_NAMES[i % NPC_TRADER_NAMES.length];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        const rand = Math.random();
        let fullName = name;
        
        if (rand < 0.5) {
            fullName = `${prefix} ${name}`;
        } else if (rand < 0.8) {
            fullName = `${name} ${suffix}`;
        }
        
        if (Math.random() > 0.7) {
            fullName += ` ${Math.floor(Math.random() * 100)}`;
        }
        
        names.push(fullName);
    }
    
    return [...new Set(names)];
}

export let TRADER_NAMES = [];

// ===== TRADER DATA STRUCTURE =====

export function createNPCTrader(id, type, personality, name, credits) {
    const config = TRADER_TYPE_CONFIG[type];
    
    return {
        id,
        type,
        personality,
        name,
        credits,
        initialCredits: credits,
        inventory: {},
        activeOrders: [],
        orderHistory: [],
        totalTrades: 0,
        totalVolume: 0,
        profitLoss: 0,
        winRate: 0,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        isActive: personality !== TRADER_PERSONALITIES.INACTIVE,
        orderSizeMin: config.orderSizeMin,
        orderSizeMax: config.orderSizeMax,
        strategyParams: generateStrategyParams(personality),
        priceMemory: {},
        favoriteElements: []
    };
}

export function generateRandomInventory(trader, elements) {
    const inventory = {};
    const numElements = Math.floor(Math.random() * 5) + 1;
    
    const tradableElements = elements.filter(el => el.currentPrice && el.currentPrice > 0);
    
    if (tradableElements.length === 0) return inventory;
    
    for (let i = 0; i < numElements; i++) {
        const element = tradableElements[Math.floor(Math.random() * tradableElements.length)];
        const quantity = Math.floor(Math.random() * 50) + 1;
        const totalValue = quantity * (element.currentPrice || 100);
        if (totalValue < trader.credits * 0.5) {
            inventory[element.name] = quantity;
        }
    }
    
    return inventory;
}

function generateStrategyParams(personality) {
    switch (personality) {
        case TRADER_PERSONALITIES.SCALPER:
            return {
                profitTarget: 0.005 + Math.random() * 0.01,
                stopLoss: 0.003 + Math.random() * 0.007,
                orderFrequency: 0.8 + Math.random() * 0.2,
                marketOrderChance: 0.4,
                maxHoldTime: 2 * 60 * 1000,
                useMarketOrders: Math.random() > 0.3
            };
            
        case TRADER_PERSONALITIES.TREND_FOLLOWER:
            return {
                lookbackPeriods: [5, 10, 20],
                trendThreshold: 0.01 + Math.random() * 0.02,
                momentumMultiplier: 0.5 + Math.random() * 1.0,
                marketOrderChance: 0.25,
                useStopLoss: Math.random() > 0.3,
                stopLossPercent: 0.03 + Math.random() * 0.05
            };
            
        case TRADER_PERSONALITIES.VALUE_TRADER:
            return {
                historicalPeriod: 7 * 24 * 60 * 60 * 1000,
                undervaluedThreshold: 0.05 + Math.random() * 0.1,
                overvaluedThreshold: 0.1 + Math.random() * 0.15,
                holdTime: 3 * 24 * 60 * 60 * 1000,
                marketOrderChance: 0.15,
                rebalanceFrequency: 24 * 60 * 60 * 1000
            };
            
        case TRADER_PERSONALITIES.RANDOM:
            return {
                randomness: 0.9 + Math.random() * 0.1,
                crazyFactor: Math.random(),
                ignoreSpread: Math.random() > 0.5,
                marketOrderChance: 0.5,
                placeAnyPrice: Math.random() > 0.5
            };
            
        case TRADER_PERSONALITIES.MARKET_MAKER:
            return {
                spreadTarget: 0.002 + Math.random() * 0.003,
                inventoryTarget: 0.3 + Math.random() * 0.2,
                replenishThreshold: 0.1,
                marketOrderChance: 0.2,
                rebalanceFrequency: 5 * 60 * 1000
            };
            
        case TRADER_PERSONALITIES.INACTIVE:
        default:
            return {
                inactivityPeriod: 12 * 60 * 60 * 1000,
                wakeupChance: 0.15,
                holdingPattern: true
            };
    }
}

// ===== INVENTORY PRUNING =====

/**
 * Prune trader inventory to keep only top N elements by value
 * @param {Object} trader - Trader object
 * @param {Object} marketData - Current market data
 * @param {number} maxItems - Maximum inventory items to keep (default 10)
 */
function pruneInventory(trader, marketData, maxItems = 10) {
    if (!trader.inventory || Object.keys(trader.inventory).length <= maxItems) {
        return;
    }
    
    // Calculate value of each inventory item
    const items = Object.entries(trader.inventory).map(([element, quantity]) => {
        const price = marketData.prices[element]?.current || 100;
        return {
            element,
            quantity,
            value: quantity * price
        };
    });
    
    // Sort by value (highest first)
    items.sort((a, b) => b.value - a.value);
    
    // Keep only top N items
    const keptItems = items.slice(0, maxItems);
    
    // Rebuild inventory
    const newInventory = {};
    keptItems.forEach(item => {
        newInventory[item.element] = item.quantity;
    });
    
    const removed = Object.keys(trader.inventory).length - keptItems.length;
    if (removed > 0) {
        console.log(`✂️ Pruned ${removed} low-value items from ${trader.name}'s inventory`);
    }
    
    trader.inventory = newInventory;
}

// ===== INITIALIZATION =====

/**
 * Initialize all NPC traders - ONLY with chemical elements for VoidEx
 * @param {Array} availableElements - List of available elements from market
 * @returns {Promise<Object>} Result with counts
 */
export async function initializeNPCTraders(availableElements = []) {
    console.log('Initializing 1000 NPC traders for VoidEx...');
    
    if (TRADER_NAMES.length === 0) {
        TRADER_NAMES = generateTraderNames(500);
    }
    
    const traders = {};
    const counts = {};
    let nameIndex = 0;
    
    // ===== FIX: Only use chemical elements (no ship parts) =====
    let chemicalElements = availableElements.filter(el => {
        const isChemical = el.symbol && 
                          el.symbol.length <= 3 && 
                          el.symbol.match(/^[A-Z][a-z]?$|^[A-Z][a-z]?[a-z]?$/) &&
                          !el.name.includes('ship_') &&
                          !el.name.includes('cargo_') &&
                          !el.name.includes('engine_') &&
                          !el.name.includes('weapon_') &&
                          !el.name.includes('module_') &&
                          !el.name.includes('reactor_') &&
                          !el.name.includes('shield_') &&
                          !el.name.includes('thruster_');
        
        return isChemical && el.currentPrice && el.currentPrice > 0;
    });
    
    if (chemicalElements.length === 0) {
        console.warn('No chemical elements in availableElements, using built-in element list');
        
        const commonElements = [
            'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 
            'Nitrogen', 'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium',
            'Aluminum', 'Silicon', 'Phosphorus', 'Sulfur', 'Chlorine', 'Argon',
            'Potassium', 'Calcium', 'Scandium', 'Titanium', 'Vanadium', 'Chromium',
            'Manganese', 'Iron', 'Cobalt', 'Nickel', 'Copper', 'Zinc',
            'Gallium', 'Germanium', 'Arsenic', 'Selenium', 'Bromine', 'Krypton',
            'Rubidium', 'Strontium', 'Yttrium', 'Zirconium', 'Niobium', 'Molybdenum',
            'Silver', 'Tin', 'Iodine', 'Gold', 'Platinum', 'Uranium'
        ];
        
        chemicalElements = commonElements.map(name => ({
            name,
            symbol: name.substring(0, 2),
            currentPrice: 50 + Math.random() * 200,
            rarity: 'common'
        }));
        
        console.log(`Using ${chemicalElements.length} fallback chemical elements`);
    }
    
    console.log(`Found ${chemicalElements.length} chemical elements for VoidEx trading`);
    
    const tradableElements = chemicalElements;
    
    for (const [type, config] of Object.entries(TRADER_TYPE_CONFIG)) {
        counts[type] = config.count;
        
        for (let i = 0; i < config.count; i++) {
            const id = `npc_${type}_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
            const personality = assignPersonality();
            const credits = Math.floor(
                config.creditMin + Math.random() * (config.creditMax - config.creditMin)
            );
            const name = TRADER_NAMES[nameIndex % TRADER_NAMES.length];
            nameIndex++;
            
            const trader = createNPCTrader(id, type, personality, name, credits);
            
            // Add random inventory if they're not inactive
            if (personality !== TRADER_PERSONALITIES.INACTIVE && tradableElements.length > 0) {
                trader.inventory = generateRandomInventory(trader, tradableElements);
            }
            
            // Select favorite elements (3-5 random chemical elements)
            if (tradableElements.length > 0) {
                const numFavorites = Math.floor(Math.random() * 3) + 3;
                for (let f = 0; f < numFavorites; f++) {
                    const element = tradableElements[Math.floor(Math.random() * tradableElements.length)];
                    trader.favoriteElements.push(element.name);
                }
                trader.favoriteElements = [...new Set(trader.favoriteElements)];
            }
            
            traders[id] = trader;
        }
    }
    
    await saveNPCTraders(traders);
    
    const stats = {
        totalTraders: Object.keys(traders).length,
        activeTraders: Object.values(traders).filter(t => t.isActive).length,
        totalOrders: 0,
        totalVolume: 0,
        byType: counts,
        byPersonality: countByPersonality(traders),
        lastUpdated: Date.now()
    };
    
    await saveNPCStats(stats);
    await setLastNPCUpdate();
    
    console.log(`✅ Created ${Object.keys(traders).length} NPC traders for VoidEx`);
    console.log(`📊 Trading ${tradableElements.length} chemical elements`);
    
    return {
        success: true,
        total: Object.keys(traders).length,
        traders: traders
    };
}

function assignPersonality() {
    const rand = Math.random() * 100;
    let cumulative = 0;
    
    for (const [personality, percentage] of Object.entries(PERSONALITY_DISTRIBUTION)) {
        cumulative += percentage;
        if (rand < cumulative) {
            return personality;
        }
    }
    
    return TRADER_PERSONALITIES.RANDOM;
}

function countByPersonality(traders) {
    const counts = {};
    
    for (const trader of Object.values(traders)) {
        const personality = trader.personality;
        counts[personality] = (counts[personality] || 0) + 1;
    }
    
    return counts;
}

// ===== ORDER MANAGEMENT =====

export async function placeTraderOrder(trader, element, side, price, quantity) {
    if (side === ORDER_SIDES.BUY) {
        const totalCost = price * quantity;
        if (trader.credits < totalCost) {
            return { success: false, reason: 'insufficient_credits' };
        }
    }
    
    if (side === ORDER_SIDES.SELL) {
        const owned = trader.inventory[element] || 0;
        if (owned < quantity) {
            return { success: false, reason: 'insufficient_inventory' };
        }
    }
    
    const order = {
        id: generateOrderId(),
        traderId: trader.id,
        traderName: trader.name,
        element,
        side,
        type: ORDER_TYPES.LIMIT,
        price,
        quantity,
        originalQuantity: quantity,
        remainingQuantity: quantity,
        filledQuantity: 0,
        status: ORDER_STATUS.ACTIVE,
        createdAt: Date.now(),
        expiresAt: Date.now() + (72 * 60 * 60 * 1000),
        isNPC: true,
        trades: []
    };
    
    if (side === ORDER_SIDES.BUY) {
        trader.credits -= price * quantity;
    }
    
    trader.activeOrders.push(order.id);
    trader.lastActivity = Date.now();
    
    await dbSaveNPCOrder(order);
    await saveNPCTrader(trader.id, trader);
    await addOrderToMarketBook(order);
    
    return {
        success: true,
        order
    };
}

/**
 * ===== FIXED: Add order to market book using IndexedDB instead of localStorage =====
 */
async function addOrderToMarketBook(order) {
    try {
        // Load existing orders from IndexedDB
        let buyOrders = await dbLoadMarketOrders('buy_orders');
        let sellOrders = await dbLoadMarketOrders('sell_orders');
        
        if (!buyOrders) buyOrders = {};
        if (!sellOrders) sellOrders = {};
        
        // Initialize element arrays if needed
        if (!buyOrders[order.element]) buyOrders[order.element] = [];
        if (!sellOrders[order.element]) sellOrders[order.element] = [];
        
        // Add order to appropriate book
        if (order.side === ORDER_SIDES.BUY) {
            buyOrders[order.element].push(order);
            // Sort buy orders: highest price first
            buyOrders[order.element].sort((a, b) => b.price - a.price);
        } else {
            sellOrders[order.element].push(order);
            // Sort sell orders: lowest price first
            sellOrders[order.element].sort((a, b) => a.price - b.price);
        }
        
        // Limit orders per element to prevent excessive growth
        const MAX_ORDERS_PER_ELEMENT = 100;
        if (buyOrders[order.element].length > MAX_ORDERS_PER_ELEMENT) {
            buyOrders[order.element] = buyOrders[order.element].slice(0, MAX_ORDERS_PER_ELEMENT);
        }
        if (sellOrders[order.element].length > MAX_ORDERS_PER_ELEMENT) {
            sellOrders[order.element] = sellOrders[order.element].slice(0, MAX_ORDERS_PER_ELEMENT);
        }
        
        // Save back to IndexedDB
        await dbSaveMarketOrders(buyOrders, 'buy_orders');
        await dbSaveMarketOrders(sellOrders, 'sell_orders');
        
        // Also store NPC order separately
        await dbSaveNPCOrder(order);
        
    } catch (error) {
        console.error('Error adding NPC order to market book:', error);
    }
}

async function executeImmediateTrade(trader, element, side, quantity) {
    try {
        let bid = getBidPrice(element);
        let ask = getAskPrice(element);
        
        if ((!bid || bid <= 0) || (!ask || ask <= 0)) {
            const prices = getCurrentPrices();
            const currentPrice = prices[element]?.current || 100;
            bid = Math.floor(currentPrice * 0.98);
            ask = Math.ceil(currentPrice * 1.02);
        }
        
        if (side === ORDER_SIDES.BUY && (!ask || ask <= 0)) {
            return { success: false, reason: 'no_ask_price' };
        }
        
        if (side === ORDER_SIDES.SELL && (!bid || bid <= 0)) {
            return { success: false, reason: 'no_bid_price' };
        }
        
        if (side === ORDER_SIDES.BUY && ask && ask > 0) {
            const total = ask * quantity;
            if (trader.credits >= total) {
                const orderData = {
                    userId: trader.id,
                    playerName: trader.name,
                    traderName: trader.name,
                    element,
                    side: ORDER_SIDES.BUY,
                    type: ORDER_TYPES.MARKET,
                    quantity,
                    isNPC: true
                };
                
                const result = await createOrder(orderData);
                if (result && result.success) {
                    return result;
                }
            }
        } else if (side === ORDER_SIDES.SELL && bid && bid > 0) {
            const owned = trader.inventory[element] || 0;
            if (owned >= quantity) {
                const orderData = {
                    userId: trader.id,
                    playerName: trader.name,
                    traderName: trader.name,
                    element,
                    side: ORDER_SIDES.SELL,
                    type: ORDER_TYPES.MARKET,
                    quantity,
                    isNPC: true
                };
                
                const result = await createOrder(orderData);
                if (result && result.success) {
                    return result;
                }
            }
        }
    } catch (error) {
        // Silent fail
    }
    
    return { success: false };
}

export async function cancelTraderOrder(orderId, trader) {
    try {
        // Load orders from IndexedDB
        let buyOrders = await dbLoadMarketOrders('buy_orders');
        let sellOrders = await dbLoadMarketOrders('sell_orders');
        
        if (!buyOrders) buyOrders = {};
        if (!sellOrders) sellOrders = {};
        
        let found = false;
        let order = null;
        let element = null;
        let side = null;
        
        // Search in buy orders
        for (const elem in buyOrders) {
            const index = buyOrders[elem]?.findIndex(o => o.id === orderId);
            if (index !== undefined && index >= 0) {
                order = buyOrders[elem][index];
                element = elem;
                side = ORDER_SIDES.BUY;
                buyOrders[elem].splice(index, 1);
                found = true;
                break;
            }
        }
        
        // Search in sell orders if not found
        if (!found) {
            for (const elem in sellOrders) {
                const index = sellOrders[elem]?.findIndex(o => o.id === orderId);
                if (index !== undefined && index >= 0) {
                    order = sellOrders[elem][index];
                    element = elem;
                    side = ORDER_SIDES.SELL;
                    sellOrders[elem].splice(index, 1);
                    found = true;
                    break;
                }
            }
        }
        
        if (!found || !order) {
            return { success: false, reason: 'order_not_found' };
        }
        
        order.status = ORDER_STATUS.CANCELLED;
        
        // Refund credits for cancelled buy order
        if (side === ORDER_SIDES.BUY && trader) {
            const total = order.price * order.remainingQuantity;
            trader.credits += total;
        }
        
        // Remove from trader's active orders
        if (trader) {
            const index = trader.activeOrders.indexOf(orderId);
            if (index >= 0) {
                trader.activeOrders.splice(index, 1);
            }
            await saveNPCTrader(trader.id, trader);
        }
        
        // Save updated order books
        await dbSaveMarketOrders(buyOrders, 'buy_orders');
        await dbSaveMarketOrders(sellOrders, 'sell_orders');
        
        // Delete from NPC orders
        await dbDeleteNPCOrder(orderId);
        
        return { success: true, order };
        
    } catch (error) {
        console.error('Error cancelling NPC order:', error);
        return { success: false, error: error.message };
    }
}

export async function getNPCOrders() {
    try {
        return await dbGetActiveNPCOrders();
    } catch (error) {
        console.error('Error getting NPC orders:', error);
        return [];
    }
}

export async function getNPCOrdersForElement(element) {
    try {
        const orders = await dbGetNPCOrdersByElement(element);
        
        const bids = orders
            .filter(o => o.side === ORDER_SIDES.BUY && (o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL))
            .sort((a, b) => b.price - a.price);
            
        const asks = orders
            .filter(o => o.side === ORDER_SIDES.SELL && (o.status === ORDER_STATUS.ACTIVE || o.status === ORDER_STATUS.PARTIAL))
            .sort((a, b) => a.price - b.price);
        
        return { bids, asks };
    } catch (error) {
        console.error('Error getting NPC orders for element:', error);
        return { bids: [], asks: [] };
    }
}

// ===== TRADER BEHAVIOR =====

/**
 * Update a single trader (make decisions)
 * @param {Object} trader - Trader object
 * @param {Object} marketData - Current market data
 * @returns {Promise<Object>} Actions taken
 */
export async function updateTrader(trader, marketData) {
    if (!trader.isActive) {
        if (Math.random() < 0.15) {
            trader.isActive = true;
            trader.personality = TRADER_PERSONALITIES.RANDOM;
            console.log(`💤 ${trader.name} woke up and is now active!`);
        } else {
            return { traderId: trader.id, actions: [] };
        }
    }
    
    // Prune inventory before trading (keep only top 10 items)
    pruneInventory(trader, marketData, 10);
    
    const actions = [];
    const prices = marketData.prices || {};
    
    // ===== ENHANCED DEBUG LOGGING =====
    console.log(`\n🔍 TRADER: ${trader.name} (${trader.personality})`);
    console.log(`   Credits: ${trader.credits}`);
    console.log(`   Inventory size: ${Object.keys(trader.inventory).length} items`);
    console.log(`   Favorite elements:`, trader.favoriteElements);
    
    const priceKeys = Object.keys(prices);
    console.log(`   Total price keys: ${priceKeys.length}`);
    
    if (priceKeys.length > 0) {
        console.log(`   Sample price data for ${priceKeys[0]}:`, prices[priceKeys[0]]);
    } else {
        console.log(`   ⚠️ NO PRICE DATA FOUND!`);
    }
    
    const allTradableElements = Object.keys(prices).filter(el => 
        prices[el] && prices[el].current > 0
    );
    
    console.log(`   Tradable elements found: ${allTradableElements.length}`);
    
    let elements = [];
    if (trader.favoriteElements && trader.favoriteElements.length > 0) {
        elements = trader.favoriteElements.filter(el => 
            prices[el] && prices[el].current > 0
        );
        console.log(`   Favorite elements tradable: ${elements.length} of ${trader.favoriteElements.length}`);
    } else {
        console.log(`   No favorite elements defined`);
    }
    
    if (elements.length === 0) {
        elements = allTradableElements.slice(0, 5);
        console.log(`   Using fallback elements: ${elements.length}`);
    }
    
    if (elements.length === 0) {
        console.log(`   ❌ No tradable elements for ${trader.name}`);
        return { traderId: trader.id, actions: [] };
    }
    
    console.log(`   ⚡ Updating with elements:`, elements);
    
    switch (trader.personality) {
        case TRADER_PERSONALITIES.SCALPER:
            await updateScalper(trader, marketData, elements, actions);
            break;
        case TRADER_PERSONALITIES.TREND_FOLLOWER:
            await updateTrendFollower(trader, marketData, elements, actions);
            break;
        case TRADER_PERSONALITIES.VALUE_TRADER:
            await updateValueTrader(trader, marketData, elements, actions);
            break;
        case TRADER_PERSONALITIES.RANDOM:
            await updateRandomTrader(trader, marketData, elements, actions);
            break;
        case TRADER_PERSONALITIES.MARKET_MAKER:
            await updateMarketMaker(trader, marketData, elements, actions);
            break;
        default:
            console.log(`   ❓ Unknown personality: ${trader.personality}`);
            break;
    }
    
    console.log(`   📝 Took ${actions.length} actions`);
    if (actions.length > 0) {
        console.log(`   Actions:`, actions);
    }
    
    await cleanupExpiredOrders(trader);
    
    trader.lastActivity = Date.now();
    await saveNPCTrader(trader.id, trader);
    
    return {
        traderId: trader.id,
        actions
    };
}

async function updateScalper(trader, marketData, elements, actions) {
    const params = trader.strategyParams;
    const prices = marketData.prices;
    
    if (Math.random() > params.orderFrequency) return;
    
    for (const element of elements) {
        if (!prices[element]) continue;
        
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        
        if (!bid || !ask || bid <= 0 || ask <= 0) continue;
        
        if (Math.random() < 0.3) {
            const side = Math.random() > 0.5 ? ORDER_SIDES.BUY : ORDER_SIDES.SELL;
            const quantity = Math.floor(Math.random() * 3) + 1;
            
            if (side === ORDER_SIDES.BUY && trader.credits > ask * quantity) {
                const result = await executeImmediateTrade(trader, element, side, quantity);
                if (result.success) {
                    actions.push({ type: 'market_buy', element, price: ask, quantity });
                    continue;
                }
            } else if (side === ORDER_SIDES.SELL && (trader.inventory[element] || 0) >= quantity) {
                const result = await executeImmediateTrade(trader, element, side, quantity);
                if (result.success) {
                    actions.push({ type: 'market_sell', element, price: bid, quantity });
                    continue;
                }
            }
        }
        
        if (trader.credits > 1000 && Math.random() > 0.4) {
            const buyPrice = Math.floor(bid * 0.998);
            const quantity = Math.floor(Math.random() * 3) + 1;
            
            const result = await placeTraderOrder(
                trader, element, ORDER_SIDES.BUY, buyPrice, quantity
            );
            
            if (result.success) {
                actions.push({ type: 'limit_buy', element, price: buyPrice, quantity });
            }
        }
        
        if (trader.inventory[element] > 0 && Math.random() > 0.4) {
            const sellPrice = Math.floor(ask * 1.002);
            const quantity = Math.min(
                Math.floor(Math.random() * 3) + 1,
                trader.inventory[element]
            );
            
            const result = await placeTraderOrder(
                trader, element, ORDER_SIDES.SELL, sellPrice, quantity
            );
            
            if (result.success) {
                actions.push({ type: 'limit_sell', element, price: sellPrice, quantity });
            }
        }
    }
}

async function updateTrendFollower(trader, marketData, elements, actions) {
    const params = trader.strategyParams;
    
    for (const element of elements) {
        const currentPrice = marketData.prices[element]?.current || 100;
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        
        if (!bid || !ask || bid <= 0 || ask <= 0) continue;
        
        const lastPrice = trader.priceMemory[element] || currentPrice;
        const change = (currentPrice - lastPrice) / lastPrice;
        
        trader.priceMemory[element] = currentPrice;
        
        if (Math.abs(change) > params.trendThreshold) {
            if (change > 0) {
                if (trader.credits > 5000) {
                    if (Math.random() < 0.25) {
                        const quantity = Math.floor(Math.random() * 5) + 1;
                        const result = await executeImmediateTrade(trader, element, ORDER_SIDES.BUY, quantity);
                        if (result.success) {
                            actions.push({ type: 'trend_market_buy', element, price: ask, quantity });
                            continue;
                        }
                    }
                    
                    const quantity = Math.floor(Math.random() * 5) + 1;
                    const buyPrice = Math.floor(bid * 0.999);
                    
                    const result = await placeTraderOrder(
                        trader, element, ORDER_SIDES.BUY, buyPrice, quantity
                    );
                    
                    if (result.success) {
                        actions.push({ type: 'trend_limit_buy', element, price: buyPrice, quantity });
                    }
                }
            } else {
                if (trader.inventory[element] > 0) {
                    if (Math.random() < 0.25) {
                        const quantity = Math.min(
                            Math.floor(Math.random() * 5) + 1,
                            trader.inventory[element]
                        );
                        const result = await executeImmediateTrade(trader, element, ORDER_SIDES.SELL, quantity);
                        if (result.success) {
                            actions.push({ type: 'trend_market_sell', element, price: bid, quantity });
                            return;
                        }
                    }
                    
                    const quantity = Math.min(
                        Math.floor(Math.random() * 5) + 1,
                        trader.inventory[element]
                    );
                    const sellPrice = Math.floor(ask * 1.001);
                    
                    const result = await placeTraderOrder(
                        trader, element, ORDER_SIDES.SELL, sellPrice, quantity
                    );
                    
                    if (result.success) {
                        actions.push({ type: 'trend_limit_sell', element, price: sellPrice, quantity });
                    }
                }
            }
        }
    }
}

async function updateValueTrader(trader, marketData, elements, actions) {
    const params = trader.strategyParams;
    
    for (const element of elements) {
        const currentPrice = marketData.prices[element]?.current || 100;
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        
        if (!bid || !ask || bid <= 0 || ask <= 0) continue;
        
        const historicalAvg = currentPrice * (0.85 + Math.random() * 0.3);
        
        if (currentPrice < historicalAvg * (1 - params.undervaluedThreshold)) {
            if (trader.credits > 5000) {
                if (Math.random() < 0.15) {
                    const quantity = Math.floor(Math.random() * 10) + 1;
                    const result = await executeImmediateTrade(trader, element, ORDER_SIDES.BUY, quantity);
                    if (result.success) {
                        actions.push({ type: 'value_market_buy', element, price: ask, quantity });
                        continue;
                    }
                }
                
                const quantity = Math.floor(Math.random() * 10) + 1;
                const buyPrice = Math.floor(currentPrice * 0.995);
                
                const result = await placeTraderOrder(
                    trader, element, ORDER_SIDES.BUY, buyPrice, quantity
                );
                
                if (result.success) {
                    actions.push({ type: 'value_limit_buy', element, price: buyPrice, quantity });
                }
            }
        } else if (currentPrice > historicalAvg * (1 + params.overvaluedThreshold)) {
            if (trader.inventory[element] > 0) {
                if (Math.random() < 0.15) {
                    const quantity = Math.min(
                        Math.floor(Math.random() * 10) + 1,
                        trader.inventory[element]
                    );
                    const result = await executeImmediateTrade(trader, element, ORDER_SIDES.SELL, quantity);
                    if (result.success) {
                        actions.push({ type: 'value_market_sell', element, price: bid, quantity });
                        return;
                    }
                }
                
                const quantity = Math.min(
                    Math.floor(Math.random() * 10) + 1,
                    trader.inventory[element]
                );
                const sellPrice = Math.floor(currentPrice * 1.005);
                
                const result = await placeTraderOrder(
                    trader, element, ORDER_SIDES.SELL, sellPrice, quantity
                );
                
                if (result.success) {
                    actions.push({ type: 'value_limit_sell', element, price: sellPrice, quantity });
                }
            }
        }
    }
}

async function updateRandomTrader(trader, marketData, elements, actions) {
    const params = trader.strategyParams;
    
    if (Math.random() > params.randomness) return;
    
    for (const element of elements) {
        if (Math.random() > 0.4) continue;
        
        const currentPrice = marketData.prices[element]?.current || 100;
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        
        if ((!bid || bid <= 0) && (!ask || ask <= 0)) continue;
        
        const side = Math.random() > 0.5 ? ORDER_SIDES.BUY : ORDER_SIDES.SELL;
        const useMarket = Math.random() < 0.5;
        
        if (useMarket) {
            if (side === ORDER_SIDES.BUY && (!ask || ask <= 0)) continue;
            if (side === ORDER_SIDES.SELL && (!bid || bid <= 0)) continue;
            
            const quantity = Math.floor(Math.random() * 10) + 1;
            
            if (side === ORDER_SIDES.BUY && trader.credits > ask * quantity) {
                const result = await executeImmediateTrade(trader, element, side, quantity);
                if (result.success) {
                    actions.push({ 
                        type: 'random_market', 
                        element, 
                        price: side === ORDER_SIDES.BUY ? ask : bid, 
                        quantity,
                        crazy: params.crazyFactor > 0.7 
                    });
                }
            } else if (side === ORDER_SIDES.SELL && (trader.inventory[element] || 0) >= quantity) {
                const result = await executeImmediateTrade(trader, element, side, quantity);
                if (result.success) {
                    actions.push({ 
                        type: 'random_market', 
                        element, 
                        price: bid, 
                        quantity,
                        crazy: params.crazyFactor > 0.7 
                    });
                }
            }
        } else {
            let price = currentPrice;
            if (params.placeAnyPrice && Math.random() > 0.5) {
                price = Math.floor(currentPrice * (0.8 + Math.random() * 0.6));
            } else {
                price = Math.floor(currentPrice * (0.98 + Math.random() * 0.04));
            }
            
            const quantity = Math.floor(Math.random() * 15) + 1;
            
            if (side === ORDER_SIDES.BUY && trader.credits < price * quantity) continue;
            if (side === ORDER_SIDES.SELL && (trader.inventory[element] || 0) < quantity) continue;
            
            const result = await placeTraderOrder(trader, element, side, price, quantity);
            
            if (result.success) {
                actions.push({ 
                    type: `random_limit_${side}`, 
                    element, 
                    price, 
                    quantity,
                    crazy: params.crazyFactor > 0.7 
                });
            }
        }
    }
}

async function updateMarketMaker(trader, marketData, elements, actions) {
    const params = trader.strategyParams;
    
    for (const element of elements) {
        const currentPrice = marketData.prices[element]?.current || 100;
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        
        if (!bid || !ask || bid <= 0 || ask <= 0) continue;
        
        const spread = ask - bid;
        const targetSpread = currentPrice * params.spreadTarget;
        
        if (spread > targetSpread || Math.random() < 0.3) {
            if (trader.credits > 10000) {
                const buyPrice = Math.floor(currentPrice * (1 - params.spreadTarget / 2));
                const buyQuantity = Math.floor(Math.random() * 20) + 10;
                
                const buyResult = await placeTraderOrder(
                    trader, element, ORDER_SIDES.BUY, buyPrice, buyQuantity
                );
                
                if (buyResult.success) {
                    actions.push({ type: 'mm_buy', element, price: buyPrice, quantity: buyQuantity });
                }
            }
            
            if (trader.inventory[element] > 0 || Math.random() < 0.5) {
                const sellPrice = Math.floor(currentPrice * (1 + params.spreadTarget / 2));
                const sellQuantity = Math.floor(Math.random() * 20) + 10;
                const finalQuantity = Math.min(sellQuantity, trader.inventory[element] || 999999);
                
                const sellResult = await placeTraderOrder(
                    trader, element, ORDER_SIDES.SELL, sellPrice, finalQuantity
                );
                
                if (sellResult.success) {
                    actions.push({ type: 'mm_sell', element, price: sellPrice, quantity: finalQuantity });
                }
            }
        }
        
        if (Math.random() < 0.2) {
            const side = Math.random() > 0.5 ? ORDER_SIDES.BUY : ORDER_SIDES.SELL;
            const quantity = Math.floor(Math.random() * 10) + 1;
            
            if (side === ORDER_SIDES.BUY && trader.credits > ask * quantity) {
                const result = await executeImmediateTrade(trader, element, side, quantity);
                if (result.success) {
                    actions.push({ type: 'mm_take_buy', element, price: ask, quantity });
                }
            } else if (side === ORDER_SIDES.SELL && (trader.inventory[element] || 0) >= quantity) {
                const result = await executeImmediateTrade(trader, element, side, quantity);
                if (result.success) {
                    actions.push({ type: 'mm_take_sell', element, price: bid, quantity });
                }
            }
        }
        
        const totalValue = Object.entries(trader.inventory).reduce((sum, [elem, qty]) => {
            return sum + (qty * (marketData.prices[elem]?.current || 100));
        }, 0);
        
        const targetInventory = trader.credits * params.inventoryTarget;
        
        if (totalValue > targetInventory * 1.2) {
            if (trader.inventory[element] > 0 && Math.random() < 0.3) {
                const sellQuantity = Math.floor(trader.inventory[element] * 0.1) + 1;
                await executeImmediateTrade(trader, element, ORDER_SIDES.SELL, sellQuantity);
            }
        } else if (totalValue < targetInventory * 0.8 && trader.credits > 10000) {
            if (Math.random() < 0.3) {
                const buyQuantity = Math.floor(Math.random() * 10) + 5;
                await executeImmediateTrade(trader, element, ORDER_SIDES.BUY, buyQuantity);
            }
        }
    }
}

async function cleanupExpiredOrders(trader) {
    const now = Date.now();
    const ordersToRemove = [];
    
    for (const orderId of trader.activeOrders) {
        const order = await dbGetNPCOrder(orderId);
        if (order && order.expiresAt < now) {
            await cancelTraderOrder(orderId, trader);
            ordersToRemove.push(orderId);
        }
    }
    
    if (ordersToRemove.length > 0) {
        console.log(`Cleaned up ${ordersToRemove.length} expired orders for ${trader.name}`);
    }
}

// ===== UPDATE CYCLE =====

let updateInterval = null;
let isUpdating = false;

export function startNPCTraderUpdates(tradersPerBatch = 100, intervalMs = 60000) {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    console.log(`Starting NPC trader updates: ${tradersPerBatch} traders every ${intervalMs/1000}s`);
    
    updateInterval = setInterval(async () => {
        if (isUpdating) return;
        isUpdating = true;
        
        try {
            await processNPCTradingCycle(tradersPerBatch);
        } catch (error) {
            console.error('Error in NPC trading cycle:', error);
        } finally {
            isUpdating = false;
        }
    }, intervalMs);
    
    setLastNPCUpdate();
}

export function stopNPCTraderUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
        console.log('Stopped NPC trader updates');
    }
}

export async function processNPCTradingCycle(batchSize = 100) {
    console.log(`\n🔄 Processing NPC trading cycle (${batchSize} traders)...`);
    
    // Ensure prices are updated before trading
    const updatedPrices = updatePrices();
    
    const traders = await loadNPCTraders();
    const traderList = Object.values(traders);
    
    const marketData = {
        prices: getCurrentPrices(),
        timestamp: Date.now()
    };
    
    const shuffled = traderList.sort(() => 0.5 - Math.random());
    const batch = shuffled.slice(0, Math.min(batchSize, traderList.length));
    
    let actions = [];
    let updatedCount = 0;
    let marketOrders = 0;
    let limitOrders = 0;
    
    for (const trader of batch) {
        try {
            const result = await updateTrader(trader, marketData);
            actions = actions.concat(result.actions);
            updatedCount++;
            
            result.actions.forEach(a => {
                if (a.type.includes('market')) marketOrders++;
                else limitOrders++;
            });
            
        } catch (error) {
            console.error(`Error updating trader ${trader.id}:`, error);
        }
    }
    
    const stats = await loadNPCStats();
    stats.activeTraders = (await dbGetActiveNPCTraders(true)).length;
    stats.lastUpdated = Date.now();
    await saveNPCStats(stats);
    
    await setLastNPCUpdate();
    
    console.log(`✅ Updated ${updatedCount} NPC traders, ${actions.length} actions (${marketOrders} market, ${limitOrders} limit)`);
    
    return {
        updated: updatedCount,
        actions: actions.length,
        marketOrders,
        limitOrders,
        timestamp: Date.now()
    };
}

export async function forceTraderUpdate(traderId) {
    const trader = await loadNPCTrader(traderId);
    if (!trader) return { success: false, reason: 'not_found' };
    
    const marketData = {
        prices: getCurrentPrices(),
        timestamp: Date.now()
    };
    
    return await updateTrader(trader, marketData);
}

// ===== UTILITY FUNCTIONS =====

function generateOrderId() {
    return 'npc_ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export async function getNPCTraderStats() {
    const stats = await loadNPCStats();
    const activeOrders = await dbGetActiveNPCOrders();
    
    const buyOrders = activeOrders.filter(o => o.side === ORDER_SIDES.BUY).length;
    const sellOrders = activeOrders.filter(o => o.side === ORDER_SIDES.SELL).length;
    
    return {
        ...stats,
        activeOrders: activeOrders.length,
        buyOrders,
        sellOrders,
        timestamp: Date.now()
    };
}

export async function resetNPCTraders() {
    stopNPCTraderUpdates();
    
    await saveNPCTraders({});
    await saveNPCOrders({});
    await saveNPCStats({
        totalTraders: 0,
        activeTraders: 0,
        totalOrders: 0,
        totalVolume: 0,
        lastUpdated: Date.now()
    });
    
    console.log('NPC trader data reset');
}

export async function updateNPCTraderAfterTrade(traderId, tradeData) {
    try {
        const result = await storageUpdateNPCTraderAfterTrade(traderId, tradeData);
        return result;
    } catch (error) {
        console.error('Error in updateNPCTraderAfterTrade:', error);
        return { success: false, error: error.message };
    }
}

// ===== EXPORTS =====

export default {
    TRADER_TYPES,
    TRADER_PERSONALITIES,
    TRADER_TYPE_CONFIG,
    PERSONALITY_DISTRIBUTION,
    NPC_TRADER_NAMES,
    generateTraderNames,
    createNPCTrader,
    initializeNPCTraders,
    placeTraderOrder,
    cancelTraderOrder,
    getNPCOrders,
    getNPCOrdersForElement,
    updateTrader,
    updateNPCTraderAfterTrade,
    startNPCTraderUpdates,
    stopNPCTraderUpdates,
    processNPCTradingCycle,
    forceTraderUpdate,
    getNPCTraderStats,
    resetNPCTraders
};

window.NPC_TRADER_TYPES = TRADER_TYPES;
window.NPC_TRADER_PERSONALITIES = TRADER_PERSONALITIES;
window.initializeNPCTraders = initializeNPCTraders;
window.startNPCTraderUpdates = startNPCTraderUpdates;
window.stopNPCTraderUpdates = stopNPCTraderUpdates;
window.getNPCTraderStats = getNPCTraderStats;
window.getNPCOrders = getNPCOrders;
window.resetNPCTraders = resetNPCTraders;
window.updateNPCTraderAfterTrade = updateNPCTraderAfterTrade;

console.log('✅ npc-traders.js loaded - NPC trader system ready with market orders and inventory pruning');

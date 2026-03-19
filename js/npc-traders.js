// js/npc-traders.js - NPC Trader System for Voidfarer Marketplace
// Creates and manages 1000 simulated traders with personalities
// UPDATED: Added market orders and liquidity taking for real trading behavior

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
    dbGetNPCTradersByLastActivity, dbGetNPCOrder
} from './db.js';

import { getCurrentPrices, getBidPrice, getAskPrice } from './market-dynamics.js';
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
    MARKET_MAKER: 'marketMaker' // Added market maker personality
};

// Type configuration
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
    [TRADER_PERSONALITIES.MARKET_MAKER]: 8,    // 8% (new)
    [TRADER_PERSONALITIES.INACTIVE]: 8         // 8%
};

// ===== TRADER NAMES =====

export const NPC_TRADER_NAMES = [
    // First names
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
    
    // Use the base names and combine them
    for (let i = 0; i < count; i++) {
        const name = NPC_TRADER_NAMES[i % NPC_TRADER_NAMES.length];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        // 50% chance to use prefix, 30% chance to use suffix, 20% chance plain
        const rand = Math.random();
        let fullName = name;
        
        if (rand < 0.5) {
            fullName = `${prefix} ${name}`;
        } else if (rand < 0.8) {
            fullName = `${name} ${suffix}`;
        }
        
        // Add a number suffix for variation
        if (Math.random() > 0.7) {
            fullName += ` ${Math.floor(Math.random() * 100)}`;
        }
        
        names.push(fullName);
    }
    
    // Remove duplicates (just in case)
    return [...new Set(names)];
}

// Pre-generated names list (will be filled on init)
export let TRADER_NAMES = [];

// ===== TRADER DATA STRUCTURE =====

/**
 * Create a new NPC trader
 * @param {string} id - Trader ID
 * @param {string} type - Trader type from TRADER_TYPES
 * @param {string} personality - Personality from TRADER_PERSONALITIES
 * @param {string} name - Trader name
 * @param {number} credits - Starting credits
 * @returns {Object} Trader object
 */
export function createNPCTrader(id, type, personality, name, credits) {
    const config = TRADER_TYPE_CONFIG[type];
    
    return {
        id,
        type,
        personality,
        name,
        credits,
        initialCredits: credits,
        inventory: {}, // Elements owned: { elementName: quantity }
        activeOrders: [], // Order IDs
        orderHistory: [], // Past order IDs
        totalTrades: 0,
        totalVolume: 0,
        profitLoss: 0,
        winRate: 0,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        isActive: personality !== TRADER_PERSONALITIES.INACTIVE,
        
        // Trader-specific settings
        orderSizeMin: config.orderSizeMin,
        orderSizeMax: config.orderSizeMax,
        
        // Strategy parameters (will vary by personality)
        strategyParams: generateStrategyParams(personality),
        
        // Market memory for trend followers
        priceMemory: {},
        
        // Favorite elements (random selection)
        favoriteElements: []
    };
}

/**
 * Generate random inventory for a new trader
 * @param {Object} trader - Trader object
 * @param {Array} elements - Available elements
 */
export function generateRandomInventory(trader, elements) {
    const inventory = {};
    const numElements = Math.floor(Math.random() * 5) + 1; // 1-5 elements
    
    for (let i = 0; i < numElements; i++) {
        const element = elements[Math.floor(Math.random() * elements.length)];
        const quantity = Math.floor(Math.random() * 50) + 1;
        
        // Calculate total value to ensure they don't exceed credits too much
        const totalValue = quantity * (element.basePrice || 100);
        if (totalValue < trader.credits * 0.5) { // Don't exceed 50% of credits in inventory
            inventory[element.name] = quantity;
        }
    }
    
    return inventory;
}

/**
 * Generate strategy parameters based on personality
 * @param {string} personality - Trader personality
 * @returns {Object} Strategy parameters
 */
function generateStrategyParams(personality) {
    switch (personality) {
        case TRADER_PERSONALITIES.SCALPER:
            return {
                profitTarget: 0.005 + Math.random() * 0.01, // 0.5-1.5% profit target
                stopLoss: 0.003 + Math.random() * 0.007,    // 0.3-1% stop loss
                orderFrequency: 0.8 + Math.random() * 0.2, // 80-100% (active)
                marketOrderChance: 0.4, // 40% chance to take liquidity
                maxHoldTime: 2 * 60 * 1000, // 2 minutes
                useMarketOrders: Math.random() > 0.3
            };
            
        case TRADER_PERSONALITIES.TREND_FOLLOWER:
            return {
                lookbackPeriods: [5, 10, 20], // SMA periods
                trendThreshold: 0.01 + Math.random() * 0.02, // 1-3% trend signal
                momentumMultiplier: 0.5 + Math.random() * 1.0, // 0.5-1.5x
                marketOrderChance: 0.25, // 25% chance to take liquidity
                useStopLoss: Math.random() > 0.3,
                stopLossPercent: 0.03 + Math.random() * 0.05 // 3-8%
            };
            
        case TRADER_PERSONALITIES.VALUE_TRADER:
            return {
                historicalPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
                undervaluedThreshold: 0.05 + Math.random() * 0.1, // 5-15% below avg
                overvaluedThreshold: 0.1 + Math.random() * 0.15, // 10-25% above avg
                holdTime: 3 * 24 * 60 * 60 * 1000, // 3 days average
                marketOrderChance: 0.15, // 15% chance to take liquidity
                rebalanceFrequency: 24 * 60 * 60 * 1000 // Daily rebalance
            };
            
        case TRADER_PERSONALITIES.RANDOM:
            return {
                randomness: 0.9 + Math.random() * 0.1, // 90-100% random
                crazyFactor: Math.random(), // 0-1 how wild
                ignoreSpread: Math.random() > 0.5,
                marketOrderChance: 0.5, // 50% chance to take liquidity
                placeAnyPrice: Math.random() > 0.5
            };
            
        case TRADER_PERSONALITIES.MARKET_MAKER:
            return {
                spreadTarget: 0.002 + Math.random() * 0.003, // 0.2-0.5% spread
                inventoryTarget: 0.3 + Math.random() * 0.2, // 30-50% of credits in inventory
                replenishThreshold: 0.1, // 10% of max
                marketOrderChance: 0.2, // 20% chance to take liquidity
                rebalanceFrequency: 5 * 60 * 1000 // 5 minutes
            };
            
        case TRADER_PERSONALITIES.INACTIVE:
        default:
            return {
                inactivityPeriod: 12 * 60 * 60 * 1000, // 12 hours
                wakeupChance: 0.15, // 15% chance to wake up each cycle
                holdingPattern: true
            };
    }
}

// ===== INITIALIZATION =====

/**
 * Initialize all NPC traders
 * @param {Array} availableElements - List of available elements from market
 * @returns {Promise<Object>} Result with counts
 */
export async function initializeNPCTraders(availableElements = []) {
    console.log('Initializing 1000 NPC traders...');
    
    // Generate names if needed
    if (TRADER_NAMES.length === 0) {
        TRADER_NAMES = generateTraderNames(500);
    }
    
    const traders = {};
    const counts = {};
    let nameIndex = 0;
    
    // Create traders by type
    for (const [type, config] of Object.entries(TRADER_TYPE_CONFIG)) {
        counts[type] = config.count;
        
        for (let i = 0; i < config.count; i++) {
            const id = `npc_${type}_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
            
            // Assign personality based on distribution
            const personality = assignPersonality();
            
            // Generate credits within range
            const credits = Math.floor(
                config.creditMin + Math.random() * (config.creditMax - config.creditMin)
            );
            
            // Get name (cycle through list)
            const name = TRADER_NAMES[nameIndex % TRADER_NAMES.length];
            nameIndex++;
            
            // Create trader
            const trader = createNPCTrader(id, type, personality, name, credits);
            
            // Add random inventory if they're not inactive
            if (personality !== TRADER_PERSONALITIES.INACTIVE && availableElements.length > 0) {
                trader.inventory = generateRandomInventory(trader, availableElements);
            }
            
            // Select favorite elements (3-5 random)
            if (availableElements.length > 0) {
                const numFavorites = Math.floor(Math.random() * 3) + 3;
                for (let f = 0; f < numFavorites; f++) {
                    const element = availableElements[Math.floor(Math.random() * availableElements.length)];
                    trader.favoriteElements.push(element.name);
                }
                // Remove duplicates
                trader.favoriteElements = [...new Set(trader.favoriteElements)];
            }
            
            traders[id] = trader;
        }
    }
    
    // Save to storage
    await saveNPCTraders(traders);
    
    // Initialize stats
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
    
    console.log(`✅ Created ${Object.keys(traders).length} NPC traders`);
    
    return {
        success: true,
        total: Object.keys(traders).length,
        traders: traders
    };
}

/**
 * Assign personality based on distribution
 * @returns {string} Personality type
 */
function assignPersonality() {
    const rand = Math.random() * 100;
    let cumulative = 0;
    
    for (const [personality, percentage] of Object.entries(PERSONALITY_DISTRIBUTION)) {
        cumulative += percentage;
        if (rand < cumulative) {
            return personality;
        }
    }
    
    return TRADER_PERSONALITIES.RANDOM; // Fallback
}

/**
 * Count traders by personality
 * @param {Object} traders - Traders object
 * @returns {Object} Counts by personality
 */
function countByPersonality(traders) {
    const counts = {};
    
    for (const trader of Object.values(traders)) {
        const personality = trader.personality;
        counts[personality] = (counts[personality] || 0) + 1;
    }
    
    return counts;
}

// ===== ORDER MANAGEMENT =====

/**
 * Place an order for an NPC trader
 * @param {Object} trader - Trader object
 * @param {string} element - Element name
 * @param {string} side - 'buy' or 'sell'
 * @param {number} price - Price per unit
 * @param {number} quantity - Quantity
 * @returns {Promise<Object>} Order result
 */
export async function placeTraderOrder(trader, element, side, price, quantity) {
    // Validate credits for buy orders
    if (side === ORDER_SIDES.BUY) {
        const totalCost = price * quantity;
        if (trader.credits < totalCost) {
            return { success: false, reason: 'insufficient_credits' };
        }
    }
    
    // Validate inventory for sell orders
    if (side === ORDER_SIDES.SELL) {
        const owned = trader.inventory[element] || 0;
        if (owned < quantity) {
            return { success: false, reason: 'insufficient_inventory' };
        }
    }
    
    // Create order object
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
        expiresAt: Date.now() + (72 * 60 * 60 * 1000), // 72 hours
        isNPC: true,
        trades: []
    };
    
    // Reserve credits for buy orders
    if (side === ORDER_SIDES.BUY) {
        trader.credits -= price * quantity;
    }
    
    // Add to trader's active orders
    trader.activeOrders.push(order.id);
    trader.lastActivity = Date.now();
    
    // Save to storage
    await dbSaveNPCOrder(order);
    await saveNPCTrader(trader.id, trader);
    
    // Update orders in localStorage for market-engine compatibility
    await addOrderToLocalStorage(order);
    
    return {
        success: true,
        order
    };
}

/**
 * Execute an immediate market trade (TAKE LIQUIDITY)
 * @param {Object} trader - Trader object
 * @param {string} element - Element name
 * @param {string} side - 'buy' or 'sell'
 * @param {number} quantity - Quantity
 * @returns {Promise<Object>} Trade result
 */
async function executeImmediateTrade(trader, element, side, quantity) {
    try {
        // Get current best price
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        
        if (side === ORDER_SIDES.BUY && ask) {
            // Buy at ask price
            const total = ask * quantity;
            if (trader.credits >= total) {
                // Create and execute market order
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
                
                // This will execute immediately via market-engine
                const result = await createOrder(orderData);
                if (result && result.success) {
                    console.log(`🟢 ${trader.name} bought ${quantity} ${element} at market ${ask}⭐`);
                    
                    // Update trader inventory (will be done by updateNPCTraderAfterTrade callback)
                    return result;
                }
            }
        } else if (side === ORDER_SIDES.SELL && bid) {
            // Sell at bid price
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
                    console.log(`🔴 ${trader.name} sold ${quantity} ${element} at market ${bid}⭐`);
                    return result;
                }
            }
        }
    } catch (error) {
        console.error(`Error in executeImmediateTrade for ${trader.name}:`, error);
    }
    
    return { success: false };
}

/**
 * Add NPC order to localStorage for market-engine to see
 * @param {Object} order - NPC order
 */
async function addOrderToLocalStorage(order) {
    try {
        // Get existing orders
        const buyOrders = JSON.parse(localStorage.getItem('voidfarer_market_buy_orders') || '{}');
        const sellOrders = JSON.parse(localStorage.getItem('voidfarer_market_sell_orders') || '{}');
        
        // Initialize element arrays if needed
        if (!buyOrders[order.element]) buyOrders[order.element] = [];
        if (!sellOrders[order.element]) sellOrders[order.element] = [];
        
        // Add to appropriate side
        if (order.side === ORDER_SIDES.BUY) {
            buyOrders[order.element].push(order);
            // Sort by highest price first
            buyOrders[order.element].sort((a, b) => b.price - a.price);
        } else {
            sellOrders[order.element].push(order);
            // Sort by lowest price first
            sellOrders[order.element].sort((a, b) => a.price - b.price);
        }
        
        // Save back
        localStorage.setItem('voidfarer_market_buy_orders', JSON.stringify(buyOrders));
        localStorage.setItem('voidfarer_market_sell_orders', JSON.stringify(sellOrders));
        
        // Also save to NPC order storage
        const npcOrders = await loadNPCOrders() || {};
        if (!npcOrders[order.element]) npcOrders[order.element] = [];
        npcOrders[order.element].push(order);
        await saveNPCOrders(npcOrders);
        
    } catch (error) {
        console.error('Error adding NPC order to localStorage:', error);
    }
}

/**
 * Cancel an NPC order
 * @param {string} orderId - Order ID
 * @param {Object} trader - Trader object
 * @returns {Promise<Object>} Result
 */
export async function cancelTraderOrder(orderId, trader) {
    try {
        // Remove from localStorage
        const buyOrders = JSON.parse(localStorage.getItem('voidfarer_market_buy_orders') || '{}');
        const sellOrders = JSON.parse(localStorage.getItem('voidfarer_market_sell_orders') || '{}');
        
        let found = false;
        let order = null;
        let element = null;
        let side = null;
        
        // Search in buy orders
        for (const elem in buyOrders) {
            const index = buyOrders[elem].findIndex(o => o.id === orderId);
            if (index >= 0) {
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
                const index = sellOrders[elem].findIndex(o => o.id === orderId);
                if (index >= 0) {
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
        
        // Update status
        order.status = ORDER_STATUS.CANCELLED;
        
        // Return reserved credits/inventory
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
        
        // Save back to localStorage
        localStorage.setItem('voidfarer_market_buy_orders', JSON.stringify(buyOrders));
        localStorage.setItem('voidfarer_market_sell_orders', JSON.stringify(sellOrders));
        
        // Remove from NPC order storage
        const npcOrders = await loadNPCOrders() || {};
        if (npcOrders[element]) {
            const index = npcOrders[element].findIndex(o => o.id === orderId);
            if (index >= 0) {
                npcOrders[element].splice(index, 1);
                await saveNPCOrders(npcOrders);
            }
        }
        
        // Delete from IndexedDB
        await dbDeleteNPCOrder(orderId);
        
        return { success: true, order };
        
    } catch (error) {
        console.error('Error cancelling NPC order:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all active NPC orders
 * @returns {Promise<Array>} Array of orders
 */
export async function getNPCOrders() {
    try {
        return await dbGetActiveNPCOrders();
    } catch (error) {
        console.error('Error getting NPC orders:', error);
        return [];
    }
}

/**
 * Get NPC orders for a specific element
 * @param {string} element - Element name
 * @returns {Promise<Object>} Object with bids and asks
 */
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
        // Check if inactive traders should wake up
        if (Math.random() < 0.15) { // 15% chance
            trader.isActive = true;
            trader.personality = TRADER_PERSONALITIES.RANDOM; // Become random when waking
            console.log(`💤 ${trader.name} woke up and is now trading!`);
        } else {
            return { traderId: trader.id, actions: [] };
        }
    }
    
    const actions = [];
    const prices = marketData.prices || {};
    const elements = trader.favoriteElements.length > 0 ? 
        trader.favoriteElements : Object.keys(prices).slice(0, 5);
    
    // Decide based on personality
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
            // Do nothing
            break;
    }
    
    // Clean up expired orders
    await cleanupExpiredOrders(trader);
    
    // Update last activity
    trader.lastActivity = Date.now();
    await saveNPCTrader(trader.id, trader);
    
    return {
        traderId: trader.id,
        actions
    };
}

/**
 * Update scalper trader
 */
async function updateScalper(trader, marketData, elements, actions) {
    const params = trader.strategyParams;
    const prices = marketData.prices;
    
    // Scalpers trade frequently
    if (Math.random() > params.orderFrequency) return;
    
    for (const element of elements) {
        if (!prices[element]) continue;
        
        const price = prices[element];
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        
        // First: Take liquidity with market orders (30% chance)
        if (Math.random() < 0.3) {
            const side = Math.random() > 0.5 ? ORDER_SIDES.BUY : ORDER_SIDES.SELL;
            const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 units
            
            // Check if they can actually do this
            if (side === ORDER_SIDES.BUY && trader.credits > ask * quantity) {
                const result = await executeImmediateTrade(trader, element, side, quantity);
                if (result.success) {
                    actions.push({ type: 'market_buy', element, price: ask, quantity });
                    continue; // Skip limit order this cycle
                }
            } else if (side === ORDER_SIDES.SELL && (trader.inventory[element] || 0) >= quantity) {
                const result = await executeImmediateTrade(trader, element, side, quantity);
                if (result.success) {
                    actions.push({ type: 'market_sell', element, price: bid, quantity });
                    continue; // Skip limit order this cycle
                }
            }
        }
        
        // Second: Provide liquidity with tight limit orders
        // Look for small profit opportunities
        if (trader.credits > 1000 && Math.random() > 0.4) {
            // Place a buy order very close to market
            const buyPrice = Math.floor(bid * 0.998); // 0.2% below bid
            const quantity = Math.floor(Math.random() * 3) + 1;
            
            const result = await placeTraderOrder(
                trader, element, ORDER_SIDES.BUY, buyPrice, quantity
            );
            
            if (result.success) {
                actions.push({ type: 'limit_buy', element, price: buyPrice, quantity });
            }
        }
        
        // Check for sells if they have inventory
        if (trader.inventory[element] > 0 && Math.random() > 0.4) {
            const sellPrice = Math.floor(ask * 1.002); // 0.2% above ask
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

/**
 * Update trend follower trader
 */
async function updateTrendFollower(trader, marketData, elements, actions) {
    const params = trader.strategyParams;
    
    for (const element of elements) {
        // Get price history (simplified - would need actual history)
        const currentPrice = marketData.prices[element]?.current || 100;
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        
        // Simple trend detection (compare with stored price)
        const lastPrice = trader.priceMemory[element] || currentPrice;
        const change = (currentPrice - lastPrice) / lastPrice;
        
        // Store current price
        trader.priceMemory[element] = currentPrice;
        
        // Detect trend
        if (Math.abs(change) > params.trendThreshold) {
            if (change > 0) {
                // Uptrend - buy aggressively
                if (trader.credits > 5000) {
                    // 25% chance to take market
                    if (Math.random() < 0.25) {
                        const quantity = Math.floor(Math.random() * 5) + 1;
                        const result = await executeImmediateTrade(trader, element, ORDER_SIDES.BUY, quantity);
                        if (result.success) {
                            actions.push({ type: 'trend_market_buy', element, price: ask, quantity });
                            continue;
                        }
                    }
                    
                    // Otherwise place limit order
                    const quantity = Math.floor(Math.random() * 5) + 1;
                    const buyPrice = Math.floor(bid * 0.999); // Very tight
                    
                    const result = await placeTraderOrder(
                        trader, element, ORDER_SIDES.BUY, buyPrice, quantity
                    );
                    
                    if (result.success) {
                        actions.push({ type: 'trend_limit_buy', element, price: buyPrice, quantity });
                    }
                }
            } else {
                // Downtrend - sell aggressively if have inventory
                if (trader.inventory[element] > 0) {
                    // 25% chance to take market
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
                    
                    // Otherwise place limit order
                    const quantity = Math.min(
                        Math.floor(Math.random() * 5) + 1,
                        trader.inventory[element]
                    );
                    const sellPrice = Math.floor(ask * 1.001); // Very tight
                    
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

/**
 * Update value trader
 */
async function updateValueTrader(trader, marketData, elements, actions) {
    const params = trader.strategyParams;
    
    for (const element of elements) {
        const currentPrice = marketData.prices[element]?.current || 100;
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        
        // Simple value detection (would use historical average in real implementation)
        const historicalAvg = currentPrice * (0.85 + Math.random() * 0.3); // Fake historical
        
        if (currentPrice < historicalAvg * (1 - params.undervaluedThreshold)) {
            // Undervalued - buy
            if (trader.credits > 5000) {
                // 15% chance to take market
                if (Math.random() < 0.15) {
                    const quantity = Math.floor(Math.random() * 10) + 1;
                    const result = await executeImmediateTrade(trader, element, ORDER_SIDES.BUY, quantity);
                    if (result.success) {
                        actions.push({ type: 'value_market_buy', element, price: ask, quantity });
                        continue;
                    }
                }
                
                // Otherwise place limit order slightly below market
                const quantity = Math.floor(Math.random() * 10) + 1;
                const buyPrice = Math.floor(currentPrice * 0.995); // 0.5% below
                
                const result = await placeTraderOrder(
                    trader, element, ORDER_SIDES.BUY, buyPrice, quantity
                );
                
                if (result.success) {
                    actions.push({ type: 'value_limit_buy', element, price: buyPrice, quantity });
                }
            }
        } else if (currentPrice > historicalAvg * (1 + params.overvaluedThreshold)) {
            // Overvalued - sell
            if (trader.inventory[element] > 0) {
                // 15% chance to take market
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
                
                // Otherwise place limit order slightly above market
                const quantity = Math.min(
                    Math.floor(Math.random() * 10) + 1,
                    trader.inventory[element]
                );
                const sellPrice = Math.floor(currentPrice * 1.005); // 0.5% above
                
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

/**
 * Update random trader
 */
async function updateRandomTrader(trader, marketData, elements, actions) {
    const params = trader.strategyParams;
    
    // Random traders are unpredictable
    if (Math.random() > params.randomness) return;
    
    for (const element of elements) {
        if (Math.random() > 0.4) continue; // Act on 60% of elements
        
        const currentPrice = marketData.prices[element]?.current || 100;
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        const side = Math.random() > 0.5 ? ORDER_SIDES.BUY : ORDER_SIDES.SELL;
        
        // Decide: market or limit?
        const useMarket = Math.random() < 0.5; // 50% market, 50% limit
        
        if (useMarket) {
            // Market order
            const quantity = Math.floor(Math.random() * 10) + 1;
            
            // Check if they can actually do this
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
            // Limit order with random price
            let price = currentPrice;
            if (params.placeAnyPrice && Math.random() > 0.5) {
                price = Math.floor(currentPrice * (0.8 + Math.random() * 0.6)); // 80-140% of market
            } else {
                // Within 2% of market
                price = Math.floor(currentPrice * (0.98 + Math.random() * 0.04));
            }
            
            const quantity = Math.floor(Math.random() * 15) + 1;
            
            // Check if they can actually do this
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

/**
 * Update market maker trader
 * These provide liquidity by keeping tight spreads and taking the other side
 */
async function updateMarketMaker(trader, marketData, elements, actions) {
    const params = trader.strategyParams;
    
    for (const element of elements) {
        const currentPrice = marketData.prices[element]?.current || 100;
        const bid = getBidPrice(element);
        const ask = getAskPrice(element);
        
        // Market makers maintain both sides
        const spread = ask - bid;
        const targetSpread = currentPrice * params.spreadTarget;
        
        // If spread is too wide, tighten it
        if (spread > targetSpread || Math.random() < 0.3) {
            // Place both a buy and sell order very close to market
            
            // Buy order slightly below market
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
            
            // Sell order slightly above market
            if (trader.inventory[element] > 0 || Math.random() < 0.5) {
                const sellPrice = Math.floor(currentPrice * (1 + params.spreadTarget / 2));
                const sellQuantity = Math.floor(Math.random() * 20) + 10;
                
                // Only sell what they have
                const finalQuantity = Math.min(sellQuantity, trader.inventory[element] || 999999);
                
                const sellResult = await placeTraderOrder(
                    trader, element, ORDER_SIDES.SELL, sellPrice, finalQuantity
                );
                
                if (sellResult.success) {
                    actions.push({ type: 'mm_sell', element, price: sellPrice, quantity: finalQuantity });
                }
            }
        }
        
        // Also take the other side occasionally to create volume (20% chance)
        if (Math.random() < 0.2) {
            const side = Math.random() > 0.5 ? ORDER_SIDES.BUY : ORDER_SIDES.SELL;
            const quantity = Math.floor(Math.random() * 10) + 1;
            
            // Check if they can do this
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
        
        // Rebalance inventory if needed
        const totalValue = Object.entries(trader.inventory).reduce((sum, [elem, qty]) => {
            return sum + (qty * (marketData.prices[elem]?.current || 100));
        }, 0);
        
        const targetInventory = trader.credits * params.inventoryTarget;
        
        if (totalValue > targetInventory * 1.2) {
            // Too much inventory - sell some
            if (trader.inventory[element] > 0 && Math.random() < 0.3) {
                const sellQuantity = Math.floor(trader.inventory[element] * 0.1) + 1;
                await executeImmediateTrade(trader, element, ORDER_SIDES.SELL, sellQuantity);
            }
        } else if (totalValue < targetInventory * 0.8 && trader.credits > 10000) {
            // Too little inventory - buy some
            if (Math.random() < 0.3) {
                const buyQuantity = Math.floor(Math.random() * 10) + 5;
                await executeImmediateTrade(trader, element, ORDER_SIDES.BUY, buyQuantity);
            }
        }
    }
}

/**
 * Clean up expired orders for a trader
 * @param {Object} trader - Trader object
 */
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

/**
 * Start the NPC trader update cycle (staggered)
 * @param {number} tradersPerBatch - Number to update per cycle
 * @param {number} intervalMs - Milliseconds between batches
 */
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
    
    // Also set last update time
    setLastNPCUpdate();
}

/**
 * Stop the NPC trader update cycle
 */
export function stopNPCTraderUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
        console.log('Stopped NPC trader updates');
    }
}

/**
 * Process one trading cycle (update a batch of traders)
 * @param {number} batchSize - Number of traders to update
 */
export async function processNPCTradingCycle(batchSize = 100) {
    console.log(`Processing NPC trading cycle (${batchSize} traders)...`);
    
    // Get all traders
    const traders = await loadNPCTraders();
    const traderList = Object.values(traders);
    
    // Get current market data
    const marketData = {
        prices: getCurrentPrices(),
        timestamp: Date.now()
    };
    
    // Select random batch
    const shuffled = traderList.sort(() => 0.5 - Math.random());
    const batch = shuffled.slice(0, Math.min(batchSize, traderList.length));
    
    let actions = [];
    let updatedCount = 0;
    let marketOrders = 0;
    let limitOrders = 0;
    
    // Update each trader
    for (const trader of batch) {
        try {
            const result = await updateTrader(trader, marketData);
            actions = actions.concat(result.actions);
            updatedCount++;
            
            // Count order types
            result.actions.forEach(a => {
                if (a.type.includes('market')) marketOrders++;
                else limitOrders++;
            });
            
        } catch (error) {
            console.error(`Error updating trader ${trader.id}:`, error);
        }
    }
    
    // Update stats
    const stats = await loadNPCStats();
    stats.activeTraders = (await dbGetActiveNPCTraders(true)).length;
    stats.lastUpdated = Date.now();
    await saveNPCStats(stats);
    
    // Update timestamp
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

/**
 * Force update a specific trader
 * @param {string} traderId - Trader ID
 */
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

/**
 * Generate unique order ID
 * @returns {string} Order ID
 */
function generateOrderId() {
    return 'npc_ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get NPC trader statistics
 * @returns {Promise<Object>} Statistics
 */
export async function getNPCTraderStats() {
    const stats = await loadNPCStats();
    const activeOrders = await dbGetActiveNPCOrders();
    
    // Count orders by side
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

/**
 * Reset all NPC trader data (for testing)
 */
export async function resetNPCTraders() {
    stopNPCTraderUpdates();
    
    // Clear storage
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

// ===== NPC TRADER AFTER TRADE UPDATE =====

/**
 * Update NPC trader after a trade is executed
 * @param {string} traderId - NPC trader ID
 * @param {Object} tradeData - Trade data (element, quantity, price, side, orderId)
 * @returns {Promise<Object>} Result
 */
export async function updateNPCTraderAfterTrade(traderId, tradeData) {
    try {
        // Call the storage function
        const result = await storageUpdateNPCTraderAfterTrade(traderId, tradeData);
        
        if (result.success) {
            console.log(`NPC trader ${traderId} updated after trade: ${tradeData.quantity}x ${tradeData.element} @ ${tradeData.price}⭐`);
        }
        
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

// Attach to window for global access
window.NPC_TRADER_TYPES = TRADER_TYPES;
window.NPC_TRADER_PERSONALITIES = TRADER_PERSONALITIES;
window.initializeNPCTraders = initializeNPCTraders;
window.startNPCTraderUpdates = startNPCTraderUpdates;
window.stopNPCTraderUpdates = stopNPCTraderUpdates;
window.getNPCTraderStats = getNPCTraderStats;
window.getNPCOrders = getNPCOrders;
window.resetNPCTraders = resetNPCTraders;
window.updateNPCTraderAfterTrade = updateNPCTraderAfterTrade;

console.log('✅ npc-traders.js loaded - NPC trader system ready with market orders');

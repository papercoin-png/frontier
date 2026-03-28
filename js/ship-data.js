// js/ship-data.js
// Centralized ship data for Voidfarer
// All ship stats and variant bonuses are defined here
// Single source of truth for all ship-related features

// ===== BASE SHIP STATS =====
// Each ship has base stats before variants
export const SHIP_STATS = {
    'Prospector': { 
        tier: 1, 
        class: 'Frigate', 
        miningBonus: 0, 
        cargo: 3700, 
        hull: 100, 
        speed: 25, 
        fuelMult: 1.0, 
        icon: '🛸', 
        color: '#4affaa', 
        price: 0,
        starter: true,
        fuelCostPer100LY: 10
    },
    'Deep Miner': { 
        tier: 2, 
        class: 'Frigate', 
        miningBonus: 20, 
        cargo: 4200, 
        hull: 110, 
        speed: 25, 
        fuelMult: 0.97, 
        icon: '⛏️', 
        color: '#88ff88', 
        price: 5000,
        starter: false,
        fuelCostPer100LY: 9.7
    },
    'Excavator': { 
        tier: 3, 
        class: 'Destroyer', 
        miningBonus: 40, 
        cargo: 4800, 
        hull: 120, 
        speed: 25, 
        fuelMult: 0.94, 
        icon: '⚙️', 
        color: '#ccff88', 
        price: 15000,
        starter: false,
        fuelCostPer100LY: 9.4
    },
    'Borealis': { 
        tier: 4, 
        class: 'Destroyer', 
        miningBonus: 60, 
        cargo: 5500, 
        hull: 130, 
        speed: 25, 
        fuelMult: 0.91, 
        icon: '🔷', 
        color: '#ffcc66', 
        price: 35000,
        starter: false,
        fuelCostPer100LY: 9.1
    },
    'Core Digger': { 
        tier: 5, 
        class: 'Cruiser', 
        miningBonus: 80, 
        cargo: 6300, 
        hull: 140, 
        speed: 25, 
        fuelMult: 0.88, 
        icon: '💎', 
        color: '#ffaa44', 
        price: 75000,
        starter: false,
        hasVariants: true,
        fuelCostPer100LY: 8.8
    },
    'Abyss Miner': { 
        tier: 6, 
        class: 'Cruiser', 
        miningBonus: 100, 
        cargo: 7200, 
        hull: 150, 
        speed: 25, 
        fuelMult: 0.85, 
        icon: '🌑', 
        color: '#ff8844', 
        price: 125000,
        starter: false,
        hasVariants: true,
        fuelCostPer100LY: 8.5
    },
    'Void Excavator': { 
        tier: 7, 
        class: 'Cruiser', 
        miningBonus: 120, 
        cargo: 8200, 
        hull: 160, 
        speed: 25, 
        fuelMult: 0.82, 
        icon: '🌀', 
        color: '#ff6644', 
        price: 200000,
        starter: false,
        hasVariants: true,
        fuelCostPer100LY: 8.2
    },
    'Singularity Miner': { 
        tier: 8, 
        class: 'Capital', 
        miningBonus: 140, 
        cargo: 9300, 
        hull: 170, 
        speed: 25, 
        fuelMult: 0.79, 
        icon: '⚫', 
        color: '#ff4444', 
        price: 350000,
        starter: false,
        hasVariants: true,
        fuelCostPer100LY: 7.9
    },
    'Quasar Drill': { 
        tier: 9, 
        class: 'Capital', 
        miningBonus: 160, 
        cargo: 10500, 
        hull: 180, 
        speed: 25, 
        fuelMult: 0.76, 
        icon: '💫', 
        color: '#ff2222', 
        price: 550000,
        starter: false,
        hasVariants: true,
        fuelCostPer100LY: 7.6
    },
    'Event Horizon': { 
        tier: 10, 
        class: 'Capital', 
        miningBonus: 180, 
        cargo: 11800, 
        hull: 200, 
        speed: 25, 
        fuelMult: 0.73, 
        icon: '🌌', 
        color: '#ff0000', 
        price: 850000,
        starter: false,
        hasVariants: true,
        fuelCostPer100LY: 7.3
    }
};

// ===== VARIANT STATS =====
// Variants modify base stats with different specializations
export const VARIANT_STATS = {
    // Tier 5 variants
    'pulse_drill': { 
        name: 'Pulse Drill', 
        miningBonus: 80, 
        cargo: 6300, 
        hull: 140, 
        fuelMult: 0.88, 
        description: '+80% mining speed • Standard cargo',
        specialization: 'balanced'
    },
    'ore_hauler': { 
        name: 'Ore Hauler', 
        miningBonus: 40, 
        cargo: 12600, 
        hull: 140, 
        fuelMult: 1.05, 
        description: '+40% mining speed • 2x cargo',
        specialization: 'cargo'
    },
    'deep_core': { 
        name: 'Deep Core', 
        miningBonus: 80, 
        cargo: 6300, 
        hull: 196, 
        fuelMult: 0.82, 
        description: '+80% mining speed • +40% hull',
        specialization: 'armor'
    },
    
    // Tier 6 variants
    'razor_drill': { 
        name: 'Razor Drill', 
        miningBonus: 100, 
        cargo: 7200, 
        hull: 150, 
        fuelMult: 0.85, 
        description: '+100% mining speed • Standard cargo',
        specialization: 'balanced'
    },
    'void_hauler': { 
        name: 'Void Hauler', 
        miningBonus: 50, 
        cargo: 14400, 
        hull: 150, 
        fuelMult: 1.02, 
        description: '+50% mining speed • 2x cargo',
        specialization: 'cargo'
    },
    'abyss_walker': { 
        name: 'Abyss Walker', 
        miningBonus: 100, 
        cargo: 7200, 
        hull: 240, 
        fuelMult: 0.79, 
        description: '+100% mining speed • +60% hull',
        specialization: 'armor'
    },
    
    // Tier 7 variants
    'quantum_drill': { 
        name: 'Quantum Drill', 
        miningBonus: 120, 
        cargo: 8200, 
        hull: 160, 
        fuelMult: 0.82, 
        description: '+120% mining speed • Standard cargo',
        specialization: 'balanced'
    },
    'void_carrier': { 
        name: 'Void Carrier', 
        miningBonus: 60, 
        cargo: 16400, 
        hull: 160, 
        fuelMult: 0.99, 
        description: '+60% mining speed • 2x cargo',
        specialization: 'cargo'
    },
    'umbral_core': { 
        name: 'Umbral Core', 
        miningBonus: 120, 
        cargo: 8200, 
        hull: 288, 
        fuelMult: 0.76, 
        description: '+120% mining speed • +80% hull',
        specialization: 'armor'
    },
    
    // Tier 8 variants
    'singularity_drill': { 
        name: 'Singularity Drill', 
        miningBonus: 140, 
        cargo: 9300, 
        hull: 170, 
        fuelMult: 0.79, 
        description: '+140% mining speed • Standard cargo',
        specialization: 'balanced'
    },
    'mass_hauler': { 
        name: 'Mass Hauler', 
        miningBonus: 70, 
        cargo: 18600, 
        hull: 170, 
        fuelMult: 0.96, 
        description: '+70% mining speed • 2x cargo',
        specialization: 'cargo'
    },
    'event_shield': { 
        name: 'Event Shield', 
        miningBonus: 140, 
        cargo: 9300, 
        hull: 340, 
        fuelMult: 0.73, 
        description: '+140% mining speed • +100% hull',
        specialization: 'armor'
    },
    
    // Tier 9 variants
    'quasar_beam': { 
        name: 'Quasar Beam', 
        miningBonus: 160, 
        cargo: 10500, 
        hull: 180, 
        fuelMult: 0.76, 
        description: '+160% mining speed • Standard cargo',
        specialization: 'balanced'
    },
    'void_freighter': { 
        name: 'Void Freighter', 
        miningBonus: 80, 
        cargo: 21000, 
        hull: 180, 
        fuelMult: 0.93, 
        description: '+80% mining speed • 2x cargo',
        specialization: 'cargo'
    },
    'quasar_armor': { 
        name: 'Quasar Armor', 
        miningBonus: 160, 
        cargo: 10500, 
        hull: 396, 
        fuelMult: 0.70, 
        description: '+160% mining speed • +120% hull',
        specialization: 'armor'
    },
    
    // Tier 10 variants
    'horizon_drill': { 
        name: 'Horizon Drill', 
        miningBonus: 180, 
        cargo: 11800, 
        hull: 200, 
        fuelMult: 0.73, 
        description: '+180% mining speed • Standard cargo',
        specialization: 'balanced'
    },
    'singularity_barge': { 
        name: 'Singularity Barge', 
        miningBonus: 90, 
        cargo: 23600, 
        hull: 200, 
        fuelMult: 0.90, 
        description: '+90% mining speed • 2x cargo',
        specialization: 'cargo'
    },
    'absolute_core': { 
        name: 'Absolute Core', 
        miningBonus: 180, 
        cargo: 11800, 
        hull: 500, 
        fuelMult: 0.67, 
        description: '+180% mining speed • +150% hull',
        specialization: 'armor'
    }
};

// ===== SHIP CLASSES =====
export const SHIP_CLASSES = {
    'Frigate': { icon: '🚀', color: '#4affaa', description: 'Light vessels, ideal for beginning miners' },
    'Destroyer': { icon: '⚔️', color: '#88ff88', description: 'Balanced ships with solid cargo capacity' },
    'Cruiser': { icon: '🛸', color: '#ffcc66', description: 'Heavy vessels with advanced mining capabilities' },
    'Capital': { icon: '🏛️', color: '#ffaa44', description: 'Mighty ships capable of deep space operations' }
};

// ===== HELPER FUNCTIONS =====

/**
 * Get ship stats by name
 * @param {string} shipName - Base ship name
 * @returns {Object} Ship stats or null if not found
 */
export function getShipStats(shipName) {
    return SHIP_STATS[shipName] || null;
}

/**
 * Get variant stats by ID
 * @param {string} variantId - Variant ID
 * @returns {Object} Variant stats or null if not found
 */
export function getVariantStats(variantId) {
    return VARIANT_STATS[variantId] || null;
}

/**
 * Get full ship stats including variant bonuses
 * @param {string} shipName - Base ship name
 * @param {string|null} variantId - Variant ID (optional)
 * @returns {Object} Combined ship stats
 */
export function getFullShipStats(shipName, variantId = null) {
    const baseStats = SHIP_STATS[shipName];
    if (!baseStats) return null;
    
    if (!variantId || !baseStats.hasVariants) {
        return { ...baseStats, variant: null };
    }
    
    const variantStats = VARIANT_STATS[variantId];
    if (!variantStats) return { ...baseStats, variant: null };
    
    return {
        ...baseStats,
        miningBonus: variantStats.miningBonus,
        cargo: variantStats.cargo,
        hull: variantStats.hull,
        fuelMult: variantStats.fuelMult,
        variant: variantStats,
        variantId: variantId
    };
}

/**
 * Get all available ships (for shipyard listing)
 * @returns {Array} Array of ship objects
 */
export function getAllShips() {
    return Object.entries(SHIP_STATS).map(([name, stats]) => ({
        name,
        ...stats
    })).sort((a, b) => a.tier - b.tier);
}

/**
 * Get ships by class
 * @param {string} shipClass - Class name (Frigate, Destroyer, Cruiser, Capital)
 * @returns {Array} Array of ships in that class
 */
export function getShipsByClass(shipClass) {
    return getAllShips().filter(ship => ship.class === shipClass);
}

/**
 * Get variants for a ship tier
 * @param {number} tier - Ship tier
 * @returns {Array} Array of variant objects for that tier
 */
export function getVariantsForTier(tier) {
    const tierVariants = {
        5: ['pulse_drill', 'ore_hauler', 'deep_core'],
        6: ['razor_drill', 'void_hauler', 'abyss_walker'],
        7: ['quantum_drill', 'void_carrier', 'umbral_core'],
        8: ['singularity_drill', 'mass_hauler', 'event_shield'],
        9: ['quasar_beam', 'void_freighter', 'quasar_armor'],
        10: ['horizon_drill', 'singularity_barge', 'absolute_core']
    };
    
    const variantIds = tierVariants[tier] || [];
    return variantIds.map(id => ({
        id,
        ...VARIANT_STATS[id]
    })).filter(v => v);
}

/**
 * Get warp speed in LY/min
 * @param {number} baseSpeed - Base warp speed (default 25)
 * @param {number} fuelMult - Fuel multiplier
 * @returns {number} Warp speed in LY/min
 */
export function getWarpSpeed(baseSpeed = 25, fuelMult = 1.0) {
    return Math.round(baseSpeed / fuelMult);
}

/**
 * Calculate fuel cost per 100 LY
 * @param {number} fuelMult - Fuel multiplier
 * @returns {number} Fuel cost per 100 LY
 */
export function getFuelCostPer100LY(fuelMult = 1.0) {
    return Math.round(10 * fuelMult);
}

/**
 * Parse ship name from storage format
 * Storage format: "Prospector (pulse_drill)" or just "Prospector"
 * @param {string} shipString - Ship string from storage
 * @returns {Object} { name, variantId }
 */
export function parseShipString(shipString) {
    if (!shipString) return { name: null, variantId: null };
    
    if (shipString.includes(' (')) {
        const parts = shipString.split(' (');
        return {
            name: parts[0],
            variantId: parts[1].replace(')', '')
        };
    }
    
    return {
        name: shipString,
        variantId: null
    };
}

/**
 * Format ship name for storage
 * @param {string} shipName - Base ship name
 * @param {string|null} variantId - Variant ID
 * @returns {string} Formatted ship string
 */
export function formatShipString(shipName, variantId = null) {
    if (variantId) {
        return `${shipName} (${variantId})`;
    }
    return shipName;
}

/**
 * Check if player can afford a ship
 * @param {Object} ship - Ship object
 * @param {number} playerCredits - Player's current credits
 * @returns {boolean} Whether player can afford
 */
export function canAffordShip(ship, playerCredits) {
    return playerCredits >= ship.price;
}

/**
 * Get ship class icon
 * @param {string} shipClass - Ship class
 * @returns {string} Icon for the class
 */
export function getShipClassIcon(shipClass) {
    return SHIP_CLASSES[shipClass]?.icon || '🚀';
}

/**
 * Get ship class color
 * @param {string} shipClass - Ship class
 * @returns {string} Color for the class
 */
export function getShipClassColor(shipClass) {
    return SHIP_CLASSES[shipClass]?.color || '#a0c0ff';
}

// ===== EXPORT ALL =====
export default {
    SHIP_STATS,
    VARIANT_STATS,
    SHIP_CLASSES,
    getShipStats,
    getVariantStats,
    getFullShipStats,
    getAllShips,
    getShipsByClass,
    getVariantsForTier,
    getWarpSpeed,
    getFuelCostPer100LY,
    parseShipString,
    formatShipString,
    canAffordShip,
    getShipClassIcon,
    getShipClassColor
};

console.log('✅ ship-data.js loaded with centralized ship data');

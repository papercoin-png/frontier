// js/galaxy-data.js
// Galaxy structure and sector data for Voidfarer's shared procedural universe
// UPDATED: 10 tiers matching the new galaxy map with Earth at center
// UPDATED: Added element pools by tier for planet resource generation
// FIXED: Correct element classification - Magnesium moved to Uncommon (Tier 2)

// ===== CONSTANTS =====
export const GALAXY_SEED = 42793;

// ===== TIER DEFINITIONS =====
// Each tier corresponds to a ring in the galaxy map
export const TIERS = [
    { tier: 1, name: 'Inner Ring', minDistance: 0, maxDistance: 100, color: '#4affaa', rarity: 'common', basePrice: 100 },
    { tier: 2, name: 'Ring 2', minDistance: 100, maxDistance: 250, color: '#88ff88', rarity: 'uncommon', basePrice: 250 },
    { tier: 3, name: 'Ring 3', minDistance: 250, maxDistance: 500, color: '#ccff88', rarity: 'rare', basePrice: 1000 },
    { tier: 4, name: 'Ring 4', minDistance: 500, maxDistance: 1000, color: '#ffcc66', rarity: 'very-rare', basePrice: 5000 },
    { tier: 5, name: 'Ring 5', minDistance: 1000, maxDistance: 2000, color: '#ffaa44', rarity: 'legendary', basePrice: 25000 },
    { tier: 6, name: 'Ring 6', minDistance: 2000, maxDistance: 4000, color: '#ff8844', rarity: 'legendary', basePrice: 25000 },
    { tier: 7, name: 'Ring 7', minDistance: 4000, maxDistance: 8000, color: '#ff6644', rarity: 'legendary', basePrice: 25000 },
    { tier: 8, name: 'Ring 8', minDistance: 8000, maxDistance: 15000, color: '#ff4444', rarity: 'legendary', basePrice: 25000 },
    { tier: 9, name: 'Ring 9', minDistance: 15000, maxDistance: 25000, color: '#ff2222', rarity: 'legendary', basePrice: 25000 },
    { tier: 10, name: 'Outer Rim', minDistance: 25000, maxDistance: 50000, color: '#ff0000', rarity: 'legendary', basePrice: 25000 }
];

// ===== ELEMENT POOLS BY TIER =====
// CORRECTED: Proper element classification by rarity/tier

// Tier 1: Common Elements (0-100 LY)
export const TIER_1_ELEMENTS = [
    'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron',
    'Carbon', 'Nitrogen', 'Oxygen', 'Fluorine', 'Neon',
    'Sodium', 'Aluminum', 'Silicon', 'Phosphorus',
    'Sulfur', 'Chlorine', 'Argon', 'Potassium', 'Calcium'
];

// Tier 2: Uncommon Elements (100-250 LY)
export const TIER_2_ELEMENTS = [
    'Magnesium', 'Iron', 'Nickel', 'Copper', 'Zinc',
    'Gallium', 'Germanium', 'Arsenic', 'Selenium', 'Bromine', 'Krypton',
    'Rubidium', 'Strontium', 'Yttrium', 'Zirconium', 'Niobium', 'Molybdenum',
    'Technetium', 'Ruthenium', 'Rhodium', 'Palladium', 'Silver',
    'Cadmium', 'Indium', 'Tin', 'Antimony', 'Tellurium', 'Iodine', 'Xenon',
    'Cesium', 'Barium', 'Lanthanum', 'Cerium', 'Praseodymium', 'Neodymium',
    'Samarium', 'Europium', 'Gadolinium', 'Terbium', 'Dysprosium', 'Holmium',
    'Erbium', 'Thulium', 'Ytterbium', 'Lutetium'
];

// Tier 3: Rare Elements (250-500 LY)
export const TIER_3_ELEMENTS = [
    'Titanium', 'Chromium', 'Manganese', 'Cobalt', 'Vanadium',
    'Gold', 'Platinum', 'Iridium', 'Osmium', 'Rhenium'
];

// Tier 4: Very Rare Elements (500-1000 LY)
export const TIER_4_ELEMENTS = [
    'Uranium', 'Thorium', 'Plutonium', 'Neptunium', 'Americium', 'Curium'
];

// Tier 5: Legendary Elements (1000+ LY)
export const TIER_5_ELEMENTS = [
    'Berkelium', 'Californium', 'Einsteinium', 'Fermium', 'Mendelevium',
    'Nobelium', 'Lawrencium', 'Rutherfordium', 'Dubnium', 'Seaborgium',
    'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium', 'Roentgenium',
    'Copernicium', 'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium',
    'Tennessine', 'Oganesson'
];

// Combined element pools by tier (for easy access)
export const ELEMENTS_BY_TIER = {
    1: TIER_1_ELEMENTS,
    2: TIER_2_ELEMENTS,
    3: TIER_3_ELEMENTS,
    4: TIER_4_ELEMENTS,
    5: TIER_5_ELEMENTS
};

// ===== HELPER FUNCTIONS =====

/**
 * Get available elements for a given galaxy tier
 * Includes elements from current tier and all lower tiers
 * @param {number} tier - Galaxy tier (1-10)
 * @returns {Array} Array of element names available at this tier
 */
export function getElementsForTier(tier) {
    const elements = [];
    const maxTier = Math.min(tier, 5);
    
    for (let t = 1; t <= maxTier; t++) {
        if (ELEMENTS_BY_TIER[t]) {
            elements.push(...ELEMENTS_BY_TIER[t]);
        }
    }
    return elements;
}

/**
 * Get the rarity name for a given tier
 * @param {number} tier - Galaxy tier (1-10)
 * @returns {string} Rarity name
 */
export function getRarityByTier(tier) {
    if (tier === 1) return 'common';
    if (tier === 2) return 'uncommon';
    if (tier === 3) return 'rare';
    if (tier === 4) return 'very-rare';
    return 'legendary';
}

/**
 * Get base price for a given tier
 * @param {number} tier - Galaxy tier (1-10)
 * @returns {number} Base price in credits
 */
export function getBasePriceByTier(tier) {
    if (tier === 1) return 100;
    if (tier === 2) return 250;
    if (tier === 3) return 1000;
    if (tier === 4) return 5000;
    return 25000;
}

/**
 * Get tier by distance from Earth
 * @param {number} distance - Distance in light years
 * @returns {Object} Tier object
 */
export function getTierByDistance(distance) {
    for (const tier of TIERS) {
        if (distance >= tier.minDistance && distance < tier.maxDistance) {
            return tier;
        }
    }
    return TIERS[0];
}

// ===== SECTOR DEFINITIONS =====
// 8 sectors per tier, evenly distributed around each ring
export const SECTORS = [
    // Earth
    { id: 'EARTH', name: 'Sol System', tier: 0, distance: 0, color: '#ffffff', coordinates: { x: 2500, y: 2500 }, description: 'Humanity\'s home system.', isHome: true },
    
    // Tier 1 (8 sectors)
    { id: 'T1_N', name: 'North Reach', tier: 1, distance: 45, angle: 0, color: '#4affaa', coordinates: { x: 2500, y: 2455 } },
    { id: 'T1_NE', name: 'Northeast Expanse', tier: 1, distance: 55, angle: 45, color: '#4affaa', coordinates: { x: 2535, y: 2465 } },
    { id: 'T1_E', name: 'East Reach', tier: 1, distance: 65, angle: 90, color: '#4affaa', coordinates: { x: 2565, y: 2500 } },
    { id: 'T1_SE', name: 'Southeast Expanse', tier: 1, distance: 55, angle: 135, color: '#4affaa', coordinates: { x: 2535, y: 2535 } },
    { id: 'T1_S', name: 'South Reach', tier: 1, distance: 45, angle: 180, color: '#4affaa', coordinates: { x: 2500, y: 2545 } },
    { id: 'T1_SW', name: 'Southwest Expanse', tier: 1, distance: 55, angle: 225, color: '#4affaa', coordinates: { x: 2465, y: 2535 } },
    { id: 'T1_W', name: 'West Reach', tier: 1, distance: 65, angle: 270, color: '#4affaa', coordinates: { x: 2435, y: 2500 } },
    { id: 'T1_NW', name: 'Northwest Expanse', tier: 1, distance: 55, angle: 315, color: '#4affaa', coordinates: { x: 2465, y: 2465 } },
    
    // Tier 2 (8 sectors)
    { id: 'T2_N', name: 'North Frontier', tier: 2, distance: 175, angle: 0, color: '#88ff88', coordinates: { x: 2500, y: 2325 } },
    { id: 'T2_NE', name: 'Northeast Frontier', tier: 2, distance: 185, angle: 45, color: '#88ff88', coordinates: { x: 2635, y: 2365 } },
    { id: 'T2_E', name: 'East Frontier', tier: 2, distance: 195, angle: 90, color: '#88ff88', coordinates: { x: 2695, y: 2500 } },
    { id: 'T2_SE', name: 'Southeast Frontier', tier: 2, distance: 185, angle: 135, color: '#88ff88', coordinates: { x: 2635, y: 2635 } },
    { id: 'T2_S', name: 'South Frontier', tier: 2, distance: 175, angle: 180, color: '#88ff88', coordinates: { x: 2500, y: 2675 } },
    { id: 'T2_SW', name: 'Southwest Frontier', tier: 2, distance: 185, angle: 225, color: '#88ff88', coordinates: { x: 2365, y: 2635 } },
    { id: 'T2_W', name: 'West Frontier', tier: 2, distance: 195, angle: 270, color: '#88ff88', coordinates: { x: 2305, y: 2500 } },
    { id: 'T2_NW', name: 'Northwest Frontier', tier: 2, distance: 185, angle: 315, color: '#88ff88', coordinates: { x: 2365, y: 2365 } },
    
    // Tier 3 (8 sectors)
    { id: 'T3_N', name: 'North Rim', tier: 3, distance: 375, angle: 0, color: '#ccff88', coordinates: { x: 2500, y: 2125 } },
    { id: 'T3_NE', name: 'Northeast Rim', tier: 3, distance: 385, angle: 45, color: '#ccff88', coordinates: { x: 2775, y: 2235 } },
    { id: 'T3_E', name: 'East Rim', tier: 3, distance: 395, angle: 90, color: '#ccff88', coordinates: { x: 2895, y: 2500 } },
    { id: 'T3_SE', name: 'Southeast Rim', tier: 3, distance: 385, angle: 135, color: '#ccff88', coordinates: { x: 2775, y: 2765 } },
    { id: 'T3_S', name: 'South Rim', tier: 3, distance: 375, angle: 180, color: '#ccff88', coordinates: { x: 2500, y: 2875 } },
    { id: 'T3_SW', name: 'Southwest Rim', tier: 3, distance: 385, angle: 225, color: '#ccff88', coordinates: { x: 2225, y: 2765 } },
    { id: 'T3_W', name: 'West Rim', tier: 3, distance: 395, angle: 270, color: '#ccff88', coordinates: { x: 2105, y: 2500 } },
    { id: 'T3_NW', name: 'Northwest Rim', tier: 3, distance: 385, angle: 315, color: '#ccff88', coordinates: { x: 2225, y: 2235 } },
    
    // Tier 4 (8 sectors)
    { id: 'T4_N', name: 'North Expanse', tier: 4, distance: 750, angle: 0, color: '#ffcc66', coordinates: { x: 2500, y: 1750 } },
    { id: 'T4_NE', name: 'Northeast Expanse', tier: 4, distance: 760, angle: 45, color: '#ffcc66', coordinates: { x: 3035, y: 1940 } },
    { id: 'T4_E', name: 'East Expanse', tier: 4, distance: 770, angle: 90, color: '#ffcc66', coordinates: { x: 3270, y: 2500 } },
    { id: 'T4_SE', name: 'Southeast Expanse', tier: 4, distance: 760, angle: 135, color: '#ffcc66', coordinates: { x: 3035, y: 3060 } },
    { id: 'T4_S', name: 'South Expanse', tier: 4, distance: 750, angle: 180, color: '#ffcc66', coordinates: { x: 2500, y: 3250 } },
    { id: 'T4_SW', name: 'Southwest Expanse', tier: 4, distance: 760, angle: 225, color: '#ffcc66', coordinates: { x: 1965, y: 3060 } },
    { id: 'T4_W', name: 'West Expanse', tier: 4, distance: 770, angle: 270, color: '#ffcc66', coordinates: { x: 1730, y: 2500 } },
    { id: 'T4_NW', name: 'Northwest Expanse', tier: 4, distance: 760, angle: 315, color: '#ffcc66', coordinates: { x: 1965, y: 1940 } },
    
    // Tier 5-10 (legendary) - 8 sectors per tier
    { id: 'T5_N', name: 'North Legend', tier: 5, distance: 1500, angle: 0, color: '#ffaa44', coordinates: { x: 2500, y: 1000 } },
    { id: 'T5_NE', name: 'Northeast Legend', tier: 5, distance: 1510, angle: 45, color: '#ffaa44', coordinates: { x: 3570, y: 1440 } },
    { id: 'T5_E', name: 'East Legend', tier: 5, distance: 1520, angle: 90, color: '#ffaa44', coordinates: { x: 4020, y: 2500 } },
    { id: 'T5_SE', name: 'Southeast Legend', tier: 5, distance: 1510, angle: 135, color: '#ffaa44', coordinates: { x: 3570, y: 3560 } },
    { id: 'T5_S', name: 'South Legend', tier: 5, distance: 1500, angle: 180, color: '#ffaa44', coordinates: { x: 2500, y: 4000 } },
    { id: 'T5_SW', name: 'Southwest Legend', tier: 5, distance: 1510, angle: 225, color: '#ffaa44', coordinates: { x: 1430, y: 3560 } },
    { id: 'T5_W', name: 'West Legend', tier: 5, distance: 1520, angle: 270, color: '#ffaa44', coordinates: { x: 980, y: 2500 } },
    { id: 'T5_NW', name: 'Northwest Legend', tier: 5, distance: 1510, angle: 315, color: '#ffaa44', coordinates: { x: 1430, y: 1440 } },
    
    { id: 'T6_N', name: 'North Exotic', tier: 6, distance: 3000, angle: 0, color: '#ff8844', coordinates: { x: 2500, y: -500 } },
    { id: 'T6_NE', name: 'Northeast Exotic', tier: 6, distance: 3010, angle: 45, color: '#ff8844', coordinates: { x: 4630, y: 360 } },
    { id: 'T6_E', name: 'East Exotic', tier: 6, distance: 3020, angle: 90, color: '#ff8844', coordinates: { x: 5520, y: 2500 } },
    { id: 'T6_SE', name: 'Southeast Exotic', tier: 6, distance: 3010, angle: 135, color: '#ff8844', coordinates: { x: 4630, y: 4640 } },
    { id: 'T6_S', name: 'South Exotic', tier: 6, distance: 3000, angle: 180, color: '#ff8844', coordinates: { x: 2500, y: 5500 } },
    { id: 'T6_SW', name: 'Southwest Exotic', tier: 6, distance: 3010, angle: 225, color: '#ff8844', coordinates: { x: 370, y: 4640 } },
    { id: 'T6_W', name: 'West Exotic', tier: 6, distance: 3020, angle: 270, color: '#ff8844', coordinates: { x: -520, y: 2500 } },
    { id: 'T6_NW', name: 'Northwest Exotic', tier: 6, distance: 3010, angle: 315, color: '#ff8844', coordinates: { x: 370, y: 360 } },
    
    { id: 'T7_N', name: 'North Mythic', tier: 7, distance: 6000, angle: 0, color: '#ff6644', coordinates: { x: 2500, y: -3500 } },
    { id: 'T7_NE', name: 'Northeast Mythic', tier: 7, distance: 6010, angle: 45, color: '#ff6644', coordinates: { x: 6750, y: -1740 } },
    { id: 'T7_E', name: 'East Mythic', tier: 7, distance: 6020, angle: 90, color: '#ff6644', coordinates: { x: 8520, y: 2500 } },
    { id: 'T7_SE', name: 'Southeast Mythic', tier: 7, distance: 6010, angle: 135, color: '#ff6644', coordinates: { x: 6750, y: 6740 } },
    { id: 'T7_S', name: 'South Mythic', tier: 7, distance: 6000, angle: 180, color: '#ff6644', coordinates: { x: 2500, y: 8500 } },
    { id: 'T7_SW', name: 'Southwest Mythic', tier: 7, distance: 6010, angle: 225, color: '#ff6644', coordinates: { x: -1750, y: 6740 } },
    { id: 'T7_W', name: 'West Mythic', tier: 7, distance: 6020, angle: 270, color: '#ff6644', coordinates: { x: -3520, y: 2500 } },
    { id: 'T7_NW', name: 'Northwest Mythic', tier: 7, distance: 6010, angle: 315, color: '#ff6644', coordinates: { x: -1750, y: -1740 } },
    
    { id: 'T8_N', name: 'North Cosmic', tier: 8, distance: 11500, angle: 0, color: '#ff4444', coordinates: { x: 2500, y: -9000 } },
    { id: 'T8_NE', name: 'Northeast Cosmic', tier: 8, distance: 11510, angle: 45, color: '#ff4444', coordinates: { x: 10640, y: -5630 } },
    { id: 'T8_E', name: 'East Cosmic', tier: 8, distance: 11520, angle: 90, color: '#ff4444', coordinates: { x: 14020, y: 2500 } },
    { id: 'T8_SE', name: 'Southeast Cosmic', tier: 8, distance: 11510, angle: 135, color: '#ff4444', coordinates: { x: 10640, y: 10630 } },
    { id: 'T8_S', name: 'South Cosmic', tier: 8, distance: 11500, angle: 180, color: '#ff4444', coordinates: { x: 2500, y: 14000 } },
    { id: 'T8_SW', name: 'Southwest Cosmic', tier: 8, distance: 11510, angle: 225, color: '#ff4444', coordinates: { x: -5640, y: 10630 } },
    { id: 'T8_W', name: 'West Cosmic', tier: 8, distance: 11520, angle: 270, color: '#ff4444', coordinates: { x: -9020, y: 2500 } },
    { id: 'T8_NW', name: 'Northwest Cosmic', tier: 8, distance: 11510, angle: 315, color: '#ff4444', coordinates: { x: -5640, y: -5630 } },
    
    { id: 'T9_N', name: 'North Void', tier: 9, distance: 20000, angle: 0, color: '#ff2222', coordinates: { x: 2500, y: -17500 } },
    { id: 'T9_NE', name: 'Northeast Void', tier: 9, distance: 20010, angle: 45, color: '#ff2222', coordinates: { x: 16640, y: -11640 } },
    { id: 'T9_E', name: 'East Void', tier: 9, distance: 20020, angle: 90, color: '#ff2222', coordinates: { x: 22520, y: 2500 } },
    { id: 'T9_SE', name: 'Southeast Void', tier: 9, distance: 20010, angle: 135, color: '#ff2222', coordinates: { x: 16640, y: 16640 } },
    { id: 'T9_S', name: 'South Void', tier: 9, distance: 20000, angle: 180, color: '#ff2222', coordinates: { x: 2500, y: 22500 } },
    { id: 'T9_SW', name: 'Southwest Void', tier: 9, distance: 20010, angle: 225, color: '#ff2222', coordinates: { x: -11640, y: 16640 } },
    { id: 'T9_W', name: 'West Void', tier: 9, distance: 20020, angle: 270, color: '#ff2222', coordinates: { x: -17520, y: 2500 } },
    { id: 'T9_NW', name: 'Northwest Void', tier: 9, distance: 20010, angle: 315, color: '#ff2222', coordinates: { x: -11640, y: -11640 } },
    
    { id: 'T10_N', name: 'Outer Rim North', tier: 10, distance: 37500, angle: 0, color: '#ff0000', coordinates: { x: 2500, y: -35000 } },
    { id: 'T10_NE', name: 'Outer Rim Northeast', tier: 10, distance: 37510, angle: 45, color: '#ff0000', coordinates: { x: 29000, y: -24000 } },
    { id: 'T10_E', name: 'Outer Rim East', tier: 10, distance: 37520, angle: 90, color: '#ff0000', coordinates: { x: 40020, y: 2500 } },
    { id: 'T10_SE', name: 'Outer Rim Southeast', tier: 10, distance: 37510, angle: 135, color: '#ff0000', coordinates: { x: 29000, y: 29000 } },
    { id: 'T10_S', name: 'Outer Rim South', tier: 10, distance: 37500, angle: 180, color: '#ff0000', coordinates: { x: 2500, y: 40000 } },
    { id: 'T10_SW', name: 'Outer Rim Southwest', tier: 10, distance: 37510, angle: 225, color: '#ff0000', coordinates: { x: -24000, y: 29000 } },
    { id: 'T10_W', name: 'Outer Rim West', tier: 10, distance: 37520, angle: 270, color: '#ff0000', coordinates: { x: -35020, y: 2500 } },
    { id: 'T10_NW', name: 'Outer Rim Northwest', tier: 10, distance: 37510, angle: 315, color: '#ff0000', coordinates: { x: -24000, y: -24000 } }
];

// ===== HELPER FUNCTIONS =====

/**
 * Get sector by ID
 * @param {string} sectorId - Sector ID
 * @returns {Object} Sector object
 */
export function getSector(sectorId) {
    return SECTORS.find(s => s.id === sectorId) || SECTORS[0];
}

/**
 * Get sectors by tier
 * @param {number} tier - Tier number (1-10)
 * @returns {Array} Sectors in that tier
 */
export function getSectorsByTier(tier) {
    return SECTORS.filter(s => s.tier === tier);
}

/**
 * Get current sector (from localStorage or default to Earth)
 * @returns {Object} Sector object
 */
export function getCurrentSector() {
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('voidfarer_current_galaxy_sector');
        if (saved) return getSector(saved);
    }
    return getSector('EARTH');
}

/**
 * Get current tier from current sector
 * @returns {Object} Tier object
 */
export function getCurrentTier() {
    const sector = getCurrentSector();
    return getTierByDistance(sector.distance);
}

/**
 * Get all sectors
 * @returns {Array} All sectors
 */
export function getAllSectors() {
    return SECTORS;
}

/**
 * Get galaxy overview statistics
 * @returns {Object} Galaxy statistics
 */
export function getGalaxyOverview() {
    const totalSectors = SECTORS.length;
    const sectorsByTier = {};
    
    for (let i = 1; i <= 10; i++) {
        sectorsByTier[i] = SECTORS.filter(s => s.tier === i).length;
    }
    
    return {
        totalSectors,
        sectorsByTier,
        tiers: TIERS,
        earthSector: getSector('EARTH')
    };
}

// ===== EXPORT =====
export default {
    GALAXY_SEED,
    TIERS,
    SECTORS,
    TIER_1_ELEMENTS,
    TIER_2_ELEMENTS,
    TIER_3_ELEMENTS,
    TIER_4_ELEMENTS,
    TIER_5_ELEMENTS,
    ELEMENTS_BY_TIER,
    getElementsForTier,
    getRarityByTier,
    getBasePriceByTier,
    getTierByDistance,
    getSector,
    getSectorsByTier,
    getCurrentSector,
    getCurrentTier,
    getAllSectors,
    getGalaxyOverview
};

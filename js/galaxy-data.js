// js/galaxy-data.js
// Galaxy structure and sector data for Voidfarer's shared procedural universe
// UPDATED: 10 tiers matching the new galaxy map with Earth at center
// Each tier corresponds to a ring in the galaxy map

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
    { tier: 6, name: 'Ring 6', minDistance: 2000, maxDistance: 4000, color: '#ff8844', rarity: 'exotic', basePrice: 100000 },
    { tier: 7, name: 'Ring 7', minDistance: 4000, maxDistance: 8000, color: '#ff6644', rarity: 'mythic', basePrice: 250000 },
    { tier: 8, name: 'Ring 8', minDistance: 8000, maxDistance: 15000, color: '#ff4444', rarity: 'cosmic', basePrice: 500000 },
    { tier: 9, name: 'Ring 9', minDistance: 15000, maxDistance: 25000, color: '#ff2222', rarity: 'void', basePrice: 1000000 },
    { tier: 10, name: 'Outer Rim', minDistance: 25000, maxDistance: 50000, color: '#ff0000', rarity: 'transcendent', basePrice: 2500000 }
];

// ===== SECTOR DEFINITIONS =====
// Each sector belongs to a tier based on its distance from Earth
// 8 sectors per tier (evenly distributed around the ring)
// Total: 80 sectors (8 per tier × 10 tiers) + Earth = 81 sectors

export const SECTORS = [
    // ===== EARTH (Center) =====
    {
        id: 'EARTH',
        name: 'Sol System',
        tier: 0,
        distance: 0,
        color: '#ffffff',
        coordinates: { x: 2500, y: 2500 },
        description: 'Humanity\'s home system. The starting point of all journeys.',
        isHome: true,
        rarity: 'common',
        basePrice: 100
    },
    
    // ===== TIER 1 (0-100 LY) - 8 sectors =====
    { id: 'T1_N', name: 'North Reach', tier: 1, distance: 45, angle: 0, color: '#4affaa', coordinates: { x: 2500, y: 2455 }, description: 'The northern expanse of the inner ring.', rarity: 'common', basePrice: 100 },
    { id: 'T1_NE', name: 'Northeast Expanse', tier: 1, distance: 55, angle: 45, color: '#4affaa', coordinates: { x: 2535, y: 2465 }, description: 'Rich in common minerals.', rarity: 'common', basePrice: 100 },
    { id: 'T1_E', name: 'East Reach', tier: 1, distance: 65, angle: 90, color: '#4affaa', coordinates: { x: 2565, y: 2500 }, description: 'The eastern edge of the inner ring.', rarity: 'common', basePrice: 100 },
    { id: 'T1_SE', name: 'Southeast Expanse', tier: 1, distance: 55, angle: 135, color: '#4affaa', coordinates: { x: 2535, y: 2535 }, description: 'Dense asteroid fields.', rarity: 'common', basePrice: 100 },
    { id: 'T1_S', name: 'South Reach', tier: 1, distance: 45, angle: 180, color: '#4affaa', coordinates: { x: 2500, y: 2545 }, description: 'The southern expanse.', rarity: 'common', basePrice: 100 },
    { id: 'T1_SW', name: 'Southwest Expanse', tier: 1, distance: 55, angle: 225, color: '#4affaa', coordinates: { x: 2465, y: 2535 }, description: 'Calm stellar nursery.', rarity: 'common', basePrice: 100 },
    { id: 'T1_W', name: 'West Reach', tier: 1, distance: 65, angle: 270, color: '#4affaa', coordinates: { x: 2435, y: 2500 }, description: 'The western edge.', rarity: 'common', basePrice: 100 },
    { id: 'T1_NW', name: 'Northwest Expanse', tier: 1, distance: 55, angle: 315, color: '#4affaa', coordinates: { x: 2465, y: 2465 }, description: 'Gateway to deeper space.', rarity: 'common', basePrice: 100 },
    
    // ===== TIER 2 (100-250 LY) - 8 sectors =====
    { id: 'T2_N', name: 'Northern Frontier', tier: 2, distance: 175, angle: 0, color: '#88ff88', coordinates: { x: 2500, y: 2325 }, description: 'First step into deeper space.', rarity: 'uncommon', basePrice: 250 },
    { id: 'T2_NE', name: 'Northeast Frontier', tier: 2, distance: 185, angle: 45, color: '#88ff88', coordinates: { x: 2635, y: 2365 }, description: 'Rich in silicon and metals.', rarity: 'uncommon', basePrice: 250 },
    { id: 'T2_E', name: 'Eastern Frontier', tier: 2, distance: 195, angle: 90, color: '#88ff88', coordinates: { x: 2695, y: 2500 }, description: 'Expanding horizons.', rarity: 'uncommon', basePrice: 250 },
    { id: 'T2_SE', name: 'Southeast Frontier', tier: 2, distance: 185, angle: 135, color: '#88ff88', coordinates: { x: 2635, y: 2635 }, description: 'Ancient star clusters.', rarity: 'uncommon', basePrice: 250 },
    { id: 'T2_S', name: 'Southern Frontier', tier: 2, distance: 175, angle: 180, color: '#88ff88', coordinates: { x: 2500, y: 2675 }, description: 'The southern expanse.', rarity: 'uncommon', basePrice: 250 },
    { id: 'T2_SW', name: 'Southwest Frontier', tier: 2, distance: 185, angle: 225, color: '#88ff88', coordinates: { x: 2365, y: 2635 }, description: 'Unexplored territory.', rarity: 'uncommon', basePrice: 250 },
    { id: 'T2_W', name: 'Western Frontier', tier: 2, distance: 195, angle: 270, color: '#88ff88', coordinates: { x: 2305, y: 2500 }, description: 'The western frontier.', rarity: 'uncommon', basePrice: 250 },
    { id: 'T2_NW', name: 'Northwest Frontier', tier: 2, distance: 185, angle: 315, color: '#88ff88', coordinates: { x: 2365, y: 2365 }, description: 'Rare elements beginning to appear.', rarity: 'uncommon', basePrice: 250 },
    
    // ===== TIER 3 (250-500 LY) - 8 sectors =====
    { id: 'T3_N', name: 'North Rim', tier: 3, distance: 375, angle: 0, color: '#ccff88', coordinates: { x: 2500, y: 2125 }, description: 'The edge of the inner region.', rarity: 'rare', basePrice: 1000 },
    { id: 'T3_NE', name: 'Northeast Rim', tier: 3, distance: 385, angle: 45, color: '#ccff88', coordinates: { x: 2775, y: 2235 }, description: 'Rich in heavy elements.', rarity: 'rare', basePrice: 1000 },
    { id: 'T3_E', name: 'East Rim', tier: 3, distance: 395, angle: 90, color: '#ccff88', coordinates: { x: 2895, y: 2500 }, description: 'The eastern frontier.', rarity: 'rare', basePrice: 1000 },
    { id: 'T3_SE', name: 'Southeast Rim', tier: 3, distance: 385, angle: 135, color: '#ccff88', coordinates: { x: 2775, y: 2765 }, description: 'Dense star formation.', rarity: 'rare', basePrice: 1000 },
    { id: 'T3_S', name: 'South Rim', tier: 3, distance: 375, angle: 180, color: '#ccff88', coordinates: { x: 2500, y: 2875 }, description: 'The southern edge.', rarity: 'rare', basePrice: 1000 },
    { id: 'T3_SW', name: 'Southwest Rim', tier: 3, distance: 385, angle: 225, color: '#ccff88', coordinates: { x: 2225, y: 2765 }, description: 'Mysterious nebulae.', rarity: 'rare', basePrice: 1000 },
    { id: 'T3_W', name: 'West Rim', tier: 3, distance: 395, angle: 270, color: '#ccff88', coordinates: { x: 2105, y: 2500 }, description: 'The western rim.', rarity: 'rare', basePrice: 1000 },
    { id: 'T3_NW', name: 'Northwest Rim', tier: 3, distance: 385, angle: 315, color: '#ccff88', coordinates: { x: 2225, y: 2235 }, description: 'Gateway to the outer arms.', rarity: 'rare', basePrice: 1000 },
    
    // ===== TIER 4 (500-1000 LY) - 8 sectors =====
    { id: 'T4_N', name: 'North Expanse', tier: 4, distance: 750, angle: 0, color: '#ffcc66', coordinates: { x: 2500, y: 1750 }, description: 'The great northern expanse.', rarity: 'very-rare', basePrice: 5000 },
    { id: 'T4_NE', name: 'Northeast Expanse', tier: 4, distance: 760, angle: 45, color: '#ffcc66', coordinates: { x: 3035, y: 1940 }, description: 'Rich mineral deposits.', rarity: 'very-rare', basePrice: 5000 },
    { id: 'T4_E', name: 'East Expanse', tier: 4, distance: 770, angle: 90, color: '#ffcc66', coordinates: { x: 3270, y: 2500 }, description: 'The eastern frontier.', rarity: 'very-rare', basePrice: 5000 },
    { id: 'T4_SE', name: 'Southeast Expanse', tier: 4, distance: 760, angle: 135, color: '#ffcc66', coordinates: { x: 3035, y: 3060 }, description: 'Dense star fields.', rarity: 'very-rare', basePrice: 5000 },
    { id: 'T4_S', name: 'South Expanse', tier: 4, distance: 750, angle: 180, color: '#ffcc66', coordinates: { x: 2500, y: 3250 }, description: 'The southern expanse.', rarity: 'very-rare', basePrice: 5000 },
    { id: 'T4_SW', name: 'Southwest Expanse', tier: 4, distance: 760, angle: 225, color: '#ffcc66', coordinates: { x: 1965, y: 3060 }, description: 'Ancient nebulae.', rarity: 'very-rare', basePrice: 5000 },
    { id: 'T4_W', name: 'West Expanse', tier: 4, distance: 770, angle: 270, color: '#ffcc66', coordinates: { x: 1730, y: 2500 }, description: 'The western frontier.', rarity: 'very-rare', basePrice: 5000 },
    { id: 'T4_NW', name: 'Northwest Expanse', tier: 4, distance: 760, angle: 315, color: '#ffcc66', coordinates: { x: 1965, y: 1940 }, description: 'Rare elements abundant.', rarity: 'very-rare', basePrice: 5000 },
    
    // ===== TIER 5 (1000-2000 LY) - 8 sectors =====
    { id: 'T5_N', name: 'North Reach', tier: 5, distance: 1500, angle: 0, color: '#ffaa44', coordinates: { x: 2500, y: 1000 }, description: 'The far north.', rarity: 'legendary', basePrice: 25000 },
    { id: 'T5_NE', name: 'Northeast Reach', tier: 5, distance: 1510, angle: 45, color: '#ffaa44', coordinates: { x: 3570, y: 1440 }, description: 'Rare element deposits.', rarity: 'legendary', basePrice: 25000 },
    { id: 'T5_E', name: 'East Reach', tier: 5, distance: 1520, angle: 90, color: '#ffaa44', coordinates: { x: 4020, y: 2500 }, description: 'The eastern reach.', rarity: 'legendary', basePrice: 25000 },
    { id: 'T5_SE', name: 'Southeast Reach', tier: 5, distance: 1510, angle: 135, color: '#ffaa44', coordinates: { x: 3570, y: 3560 }, description: 'Dangerous territories.', rarity: 'legendary', basePrice: 25000 },
    { id: 'T5_S', name: 'South Reach', tier: 5, distance: 1500, angle: 180, color: '#ffaa44', coordinates: { x: 2500, y: 4000 }, description: 'The southern reach.', rarity: 'legendary', basePrice: 25000 },
    { id: 'T5_SW', name: 'Southwest Reach', tier: 5, distance: 1510, angle: 225, color: '#ffaa44', coordinates: { x: 1430, y: 3560 }, description: 'Unexplored space.', rarity: 'legendary', basePrice: 25000 },
    { id: 'T5_W', name: 'West Reach', tier: 5, distance: 1520, angle: 270, color: '#ffaa44', coordinates: { x: 980, y: 2500 }, description: 'The western reach.', rarity: 'legendary', basePrice: 25000 },
    { id: 'T5_NW', name: 'Northwest Reach', tier: 5, distance: 1510, angle: 315, color: '#ffaa44', coordinates: { x: 1430, y: 1440 }, description: 'Mythical nebulae.', rarity: 'legendary', basePrice: 25000 },
    
    // ===== TIER 6 (2000-4000 LY) - 8 sectors =====
    { id: 'T6_N', name: 'North Frontier', tier: 6, distance: 3000, angle: 0, color: '#ff8844', coordinates: { x: 2500, y: -500 }, description: 'The edge of known space.', rarity: 'exotic', basePrice: 100000 },
    { id: 'T6_NE', name: 'Northeast Frontier', tier: 6, distance: 3010, angle: 45, color: '#ff8844', coordinates: { x: 4630, y: 360 }, description: 'Exotic matter found here.', rarity: 'exotic', basePrice: 100000 },
    { id: 'T6_E', name: 'East Frontier', tier: 6, distance: 3020, angle: 90, color: '#ff8844', coordinates: { x: 5520, y: 2500 }, description: 'The eastern frontier.', rarity: 'exotic', basePrice: 100000 },
    { id: 'T6_SE', name: 'Southeast Frontier', tier: 6, distance: 3010, angle: 135, color: '#ff8844', coordinates: { x: 4630, y: 4640 }, description: 'Unstable regions.', rarity: 'exotic', basePrice: 100000 },
    { id: 'T6_S', name: 'South Frontier', tier: 6, distance: 3000, angle: 180, color: '#ff8844', coordinates: { x: 2500, y: 5500 }, description: 'The southern frontier.', rarity: 'exotic', basePrice: 100000 },
    { id: 'T6_SW', name: 'Southwest Frontier', tier: 6, distance: 3010, angle: 225, color: '#ff8844', coordinates: { x: 370, y: 4640 }, description: 'Dangerous anomalies.', rarity: 'exotic', basePrice: 100000 },
    { id: 'T6_W', name: 'West Frontier', tier: 6, distance: 3020, angle: 270, color: '#ff8844', coordinates: { x: -520, y: 2500 }, description: 'The western frontier.', rarity: 'exotic', basePrice: 100000 },
    { id: 'T6_NW', name: 'Northwest Frontier', tier: 6, distance: 3010, angle: 315, color: '#ff8844', coordinates: { x: 370, y: 360 }, description: 'Mysterious phenomena.', rarity: 'exotic', basePrice: 100000 },
    
    // ===== TIER 7 (4000-8000 LY) - 8 sectors =====
    { id: 'T7_N', name: 'North Expanse', tier: 7, distance: 6000, angle: 0, color: '#ff6644', coordinates: { x: 2500, y: -3500 }, description: 'The great northern expanse.', rarity: 'mythic', basePrice: 250000 },
    { id: 'T7_NE', name: 'Northeast Expanse', tier: 7, distance: 6010, angle: 45, color: '#ff6644', coordinates: { x: 6750, y: -1740 }, description: 'Mythic elements appear.', rarity: 'mythic', basePrice: 250000 },
    { id: 'T7_E', name: 'East Expanse', tier: 7, distance: 6020, angle: 90, color: '#ff6644', coordinates: { x: 8520, y: 2500 }, description: 'The eastern expanse.', rarity: 'mythic', basePrice: 250000 },
    { id: 'T7_SE', name: 'Southeast Expanse', tier: 7, distance: 6010, angle: 135, color: '#ff6644', coordinates: { x: 6750, y: 6740 }, description: 'Cosmic wonders.', rarity: 'mythic', basePrice: 250000 },
    { id: 'T7_S', name: 'South Expanse', tier: 7, distance: 6000, angle: 180, color: '#ff6644', coordinates: { x: 2500, y: 8500 }, description: 'The southern expanse.', rarity: 'mythic', basePrice: 250000 },
    { id: 'T7_SW', name: 'Southwest Expanse', tier: 7, distance: 6010, angle: 225, color: '#ff6644', coordinates: { x: -1750, y: 6740 }, description: 'Ancient ruins.', rarity: 'mythic', basePrice: 250000 },
    { id: 'T7_W', name: 'West Expanse', tier: 7, distance: 6020, angle: 270, color: '#ff6644', coordinates: { x: -3520, y: 2500 }, description: 'The western expanse.', rarity: 'mythic', basePrice: 250000 },
    { id: 'T7_NW', name: 'Northwest Expanse', tier: 7, distance: 6010, angle: 315, color: '#ff6644', coordinates: { x: -1750, y: -1740 }, description: 'Legendary star clusters.', rarity: 'mythic', basePrice: 250000 },
    
    // ===== TIER 8 (8000-15000 LY) - 8 sectors =====
    { id: 'T8_N', name: 'North Rim', tier: 8, distance: 11500, angle: 0, color: '#ff4444', coordinates: { x: 2500, y: -9000 }, description: 'The edge of the galaxy.', rarity: 'cosmic', basePrice: 500000 },
    { id: 'T8_NE', name: 'Northeast Rim', tier: 8, distance: 11510, angle: 45, color: '#ff4444', coordinates: { x: 10640, y: -5630 }, description: 'Cosmic energy fields.', rarity: 'cosmic', basePrice: 500000 },
    { id: 'T8_E', name: 'East Rim', tier: 8, distance: 11520, angle: 90, color: '#ff4444', coordinates: { x: 14020, y: 2500 }, description: 'The eastern rim.', rarity: 'cosmic', basePrice: 500000 },
    { id: 'T8_SE', name: 'Southeast Rim', tier: 8, distance: 11510, angle: 135, color: '#ff4444', coordinates: { x: 10640, y: 10630 }, description: 'Dangerous anomalies.', rarity: 'cosmic', basePrice: 500000 },
    { id: 'T8_S', name: 'South Rim', tier: 8, distance: 11500, angle: 180, color: '#ff4444', coordinates: { x: 2500, y: 14000 }, description: 'The southern rim.', rarity: 'cosmic', basePrice: 500000 },
    { id: 'T8_SW', name: 'Southwest Rim', tier: 8, distance: 11510, angle: 225, color: '#ff4444', coordinates: { x: -5640, y: 10630 }, description: 'Unexplored space.', rarity: 'cosmic', basePrice: 500000 },
    { id: 'T8_W', name: 'West Rim', tier: 8, distance: 11520, angle: 270, color: '#ff4444', coordinates: { x: -9020, y: 2500 }, description: 'The western rim.', rarity: 'cosmic', basePrice: 500000 },
    { id: 'T8_NW', name: 'Northwest Rim', tier: 8, distance: 11510, angle: 315, color: '#ff4444', coordinates: { x: -5640, y: -5630 }, description: 'Ancient cosmic structures.', rarity: 'cosmic', basePrice: 500000 },
    
    // ===== TIER 9 (15000-25000 LY) - 8 sectors =====
    { id: 'T9_N', name: 'North Void', tier: 9, distance: 20000, angle: 0, color: '#ff2222', coordinates: { x: 2500, y: -17500 }, description: 'The void between arms.', rarity: 'void', basePrice: 1000000 },
    { id: 'T9_NE', name: 'Northeast Void', tier: 9, distance: 20010, angle: 45, color: '#ff2222', coordinates: { x: 16640, y: -11640 }, description: 'Void elements discovered.', rarity: 'void', basePrice: 1000000 },
    { id: 'T9_E', name: 'East Void', tier: 9, distance: 20020, angle: 90, color: '#ff2222', coordinates: { x: 22520, y: 2500 }, description: 'The eastern void.', rarity: 'void', basePrice: 1000000 },
    { id: 'T9_SE', name: 'Southeast Void', tier: 9, distance: 20010, angle: 135, color: '#ff2222', coordinates: { x: 16640, y: 16640 }, description: 'Dangerous void regions.', rarity: 'void', basePrice: 1000000 },
    { id: 'T9_S', name: 'South Void', tier: 9, distance: 20000, angle: 180, color: '#ff2222', coordinates: { x: 2500, y: 22500 }, description: 'The southern void.', rarity: 'void', basePrice: 1000000 },
    { id: 'T9_SW', name: 'Southwest Void', tier: 9, distance: 20010, angle: 225, color: '#ff2222', coordinates: { x: -11640, y: 16640 }, description: 'Cosmic mysteries.', rarity: 'void', basePrice: 1000000 },
    { id: 'T9_W', name: 'West Void', tier: 9, distance: 20020, angle: 270, color: '#ff2222', coordinates: { x: -17520, y: 2500 }, description: 'The western void.', rarity: 'void', basePrice: 1000000 },
    { id: 'T9_NW', name: 'Northwest Void', tier: 9, distance: 20010, angle: 315, color: '#ff2222', coordinates: { x: -11640, y: -11640 }, description: 'Ancient void structures.', rarity: 'void', basePrice: 1000000 },
    
    // ===== TIER 10 (25000-50000 LY) - 8 sectors =====
    { id: 'T10_N', name: 'Outer Rim North', tier: 10, distance: 37500, angle: 0, color: '#ff0000', coordinates: { x: 2500, y: -35000 }, description: 'The edge of the galaxy.', rarity: 'transcendent', basePrice: 2500000 },
    { id: 'T10_NE', name: 'Outer Rim Northeast', tier: 10, distance: 37510, angle: 45, color: '#ff0000', coordinates: { x: 29000, y: -24000 }, description: 'Transcendent elements.', rarity: 'transcendent', basePrice: 2500000 },
    { id: 'T10_E', name: 'Outer Rim East', tier: 10, distance: 37520, angle: 90, color: '#ff0000', coordinates: { x: 40020, y: 2500 }, description: 'The eastern edge.', rarity: 'transcendent', basePrice: 2500000 },
    { id: 'T10_SE', name: 'Outer Rim Southeast', tier: 10, distance: 37510, angle: 135, color: '#ff0000', coordinates: { x: 29000, y: 29000 }, description: 'Beyond known space.', rarity: 'transcendent', basePrice: 2500000 },
    { id: 'T10_S', name: 'Outer Rim South', tier: 10, distance: 37500, angle: 180, color: '#ff0000', coordinates: { x: 2500, y: 40000 }, description: 'The southern edge.', rarity: 'transcendent', basePrice: 2500000 },
    { id: 'T10_SW', name: 'Outer Rim Southwest', tier: 10, distance: 37510, angle: 225, color: '#ff0000', coordinates: { x: -24000, y: 29000 }, description: 'Final frontier.', rarity: 'transcendent', basePrice: 2500000 },
    { id: 'T10_W', name: 'Outer Rim West', tier: 10, distance: 37520, angle: 270, color: '#ff0000', coordinates: { x: -35020, y: 2500 }, description: 'The western edge.', rarity: 'transcendent', basePrice: 2500000 },
    { id: 'T10_NW', name: 'Outer Rim Northwest', tier: 10, distance: 37510, angle: 315, color: '#ff0000', coordinates: { x: -24000, y: -24000 }, description: 'The edge of everything.', rarity: 'transcendent', basePrice: 2500000 }
];

// ===== HELPER FUNCTIONS =====

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
    return TIERS[0]; // Default to Tier 1
}

/**
 * Get sector by ID
 * @param {string} sectorId - Sector ID (e.g., 'T1_N')
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
 * Get rarity for a given tier
 * @param {number} tier - Tier number (1-10)
 * @returns {string} Rarity name
 */
export function getRarityByTier(tier) {
    const tierData = TIERS.find(t => t.tier === tier);
    return tierData ? tierData.rarity : 'common';
}

/**
 * Get base price for a given tier
 * @param {number} tier - Tier number (1-10)
 * @returns {number} Base price in credits
 */
export function getBasePriceByTier(tier) {
    const tierData = TIERS.find(t => t.tier === tier);
    return tierData ? tierData.basePrice : 100;
}

/**
 * Get sector color by tier
 * @param {number} tier - Tier number (1-10)
 * @returns {string} Color hex
 */
export function getTierColor(tier) {
    const tierData = TIERS.find(t => t.tier === tier);
    return tierData ? tierData.color : '#ffffff';
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
    getTierByDistance,
    getSector,
    getSectorsByTier,
    getCurrentSector,
    getCurrentTier,
    getRarityByTier,
    getBasePriceByTier,
    getTierColor,
    getAllSectors,
    getGalaxyOverview
};

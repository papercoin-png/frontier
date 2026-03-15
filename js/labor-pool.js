// js/labor-pool.js - Labor Pool Distribution Algorithms
// Handles the distribution of labor pool credits to skilled players

import { getLevelFromProgress, getTotalCrafts } from './alchemy.js';
import { SKILL_TREE, calculateContribution, getCategoryMastery } from './skill-tree.js';
import { SKILL_MULTIPLIERS, getCategoryMultiplier, calculatePlayerSkillWeight } from './skill-multipliers.js';

// ===== LABOR POOL CONFIGURATION =====

const LABOR_POOL_CONFIG = {
    MATERIALS_SHARE: 0.5, // 50% of product cost goes to materials (NPCs)
    LABOR_SHARE: 0.5,      // 50% goes to labor pool
    DISTRIBUTION_INTERVAL: 3600000, // 1 hour in milliseconds
    MINIMUM_DISTRIBUTION: 100, // Minimum credits to trigger distribution
    MAX_HISTORY_ENTRIES: 100,
    MIN_PLAYERS_FOR_DISTRIBUTION: 1, // At least 1 player to distribute
    LABOR_POOL_KEY: 'voidfarer_labor_pool',
    LABOR_EARNINGS_KEY: 'voidfarer_labor_earnings',
    LABOR_HISTORY_KEY: 'voidfarer_labor_history',
    LAST_DISTRIBUTION_KEY: 'voidfarer_last_distribution'
};

// Product categories and their skill weights
export const PRODUCT_CATEGORIES = {
    'ship_frigate': {
        id: 'ship_frigate',
        name: 'Frigate',
        basePrice: 2000000,
        category: 'Ships',
        skillWeights: {
            'Shipbuilding': 0.20,
            'Metallurgy': 0.15,
            'Propulsion': 0.15,
            'Electronics': 0.10,
            'Composites': 0.10,
            'Life Support': 0.10,
            'Chemistry': 0.05,
            'Polymers': 0.05,
            'Basic Alloys': 0.05,
            'Stainless Steels': 0.05
        },
        laborPoolContribution: 1000000 // 50% of 2M
    },
    'ship_destroyer': {
        id: 'ship_destroyer',
        name: 'Destroyer',
        basePrice: 10000000,
        category: 'Ships',
        skillWeights: {
            'Shipbuilding': 0.18,
            'Metallurgy': 0.12,
            'Propulsion': 0.12,
            'Electronics': 0.12,
            'Composites': 0.12,
            'Life Support': 0.08,
            'Weapons': 0.10,
            'Shields': 0.08,
            'Advanced Composites': 0.08
        },
        laborPoolContribution: 5000000 // 50% of 10M
    },
    'ship_cruiser': {
        id: 'ship_cruiser',
        name: 'Cruiser',
        basePrice: 50000000,
        category: 'Ships',
        skillWeights: {
            'Shipbuilding': 0.15,
            'Metallurgy': 0.10,
            'Propulsion': 0.10,
            'Electronics': 0.15,
            'Composites': 0.10,
            'Life Support': 0.05,
            'Weapons': 0.10,
            'Shields': 0.10,
            'Warp Drive': 0.15
        },
        laborPoolContribution: 25000000 // 50% of 50M
    },
    'mining_laser': {
        id: 'mining_laser',
        name: 'Mining Laser',
        basePrice: 50000,
        category: 'Equipment',
        skillWeights: {
            'Optics': 0.30,
            'Electronics': 0.25,
            'Metallurgy': 0.20,
            'Thermodynamics': 0.15,
            'Power Systems': 0.10
        },
        laborPoolContribution: 25000 // 50% of 50k
    },
    'cargo_expander': {
        id: 'cargo_expander',
        name: 'Cargo Hold Expander',
        basePrice: 100000,
        category: 'Ship Upgrades',
        skillWeights: {
            'Metallurgy': 0.30,
            'Composites': 0.30,
            'Materials Science': 0.20,
            'Engineering': 0.20
        },
        laborPoolContribution: 50000 // 50% of 100k
    },
    'warp_drive_mk2': {
        id: 'warp_drive_mk2',
        name: 'Warp Drive MK II',
        basePrice: 500000,
        category: 'Ship Upgrades',
        skillWeights: {
            'Propulsion': 0.25,
            'Electronics': 0.20,
            'Exotic Matter': 0.20,
            'Quantum Physics': 0.20,
            'Superalloys': 0.15
        },
        laborPoolContribution: 250000 // 50% of 500k
    },
    'space_station': {
        id: 'space_station',
        name: 'Orbital Station',
        basePrice: 10000000,
        category: 'Infrastructure',
        skillWeights: {
            'Construction': 0.20,
            'Metallurgy': 0.15,
            'Composites': 0.15,
            'Life Support': 0.10,
            'Power Systems': 0.10,
            'Electronics': 0.10,
            'Robotics': 0.10,
            'Nanomaterials': 0.10
        },
        laborPoolContribution: 5000000 // 50% of 10M
    }
};

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    LABOR_POOL_TOTAL: 'voidfarer_labor_pool_total',
    LABOR_POOL_DISTRIBUTED: 'voidfarer_labor_pool_distributed',
    LABOR_POOL_HISTORY: 'voidfarer_labor_pool_history',
    PLAYER_LABOR_EARNINGS: 'voidfarer_player_labor_earnings',
    LAST_DISTRIBUTION: 'voidfarer_last_distribution',
    LABOR_EVENTS: 'voidfarer_labor_events'
};

// ===== LABOR POOL CLASS =====

export class LaborPool {
    constructor() {
        this.initializeStorage();
    }

    /**
     * Initialize labor pool storage
     */
    initializeStorage() {
        if (!localStorage.getItem(STORAGE_KEYS.LABOR_POOL_TOTAL)) {
            localStorage.setItem(STORAGE_KEYS.LABOR_POOL_TOTAL, '0');
        }
        if (!localStorage.getItem(STORAGE_KEYS.LABOR_POOL_DISTRIBUTED)) {
            localStorage.setItem(STORAGE_KEYS.LABOR_POOL_DISTRIBUTED, '0');
        }
        if (!localStorage.getItem(STORAGE_KEYS.LABOR_POOL_HISTORY)) {
            localStorage.setItem(STORAGE_KEYS.LABOR_POOL_HISTORY, '[]');
        }
        if (!localStorage.getItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS)) {
            localStorage.setItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS, '{}');
        }
        if (!localStorage.getItem(STORAGE_KEYS.LABOR_EVENTS)) {
            localStorage.setItem(STORAGE_KEYS.LABOR_EVENTS, '[]');
        }
    }

    /**
     * Add credits to labor pool from a product purchase
     * @param {string} productId - Product ID
     * @returns {number} New labor pool total
     */
    addFromProductPurchase(productId) {
        const product = PRODUCT_CATEGORIES[productId];
        if (!product) return this.getTotal();
        
        const contribution = product.laborPoolContribution;
        return this.addToPool(contribution, `Product: ${product.name}`);
    }

    /**
     * Add credits to labor pool
     * @param {number} amount - Amount to add
     * @param {string} reason - Reason for addition
     * @returns {number} New total
     */
    addToPool(amount, reason = 'Manual addition') {
        const current = this.getTotal();
        const newTotal = current + amount;
        
        localStorage.setItem(STORAGE_KEYS.LABOR_POOL_TOTAL, newTotal.toString());
        
        this.addToHistory({
            type: 'addition',
            amount: amount,
            reason: reason,
            timestamp: Date.now(),
            newTotal: newTotal
        });
        
        // Check if we should auto-distribute
        if (newTotal >= LABOR_POOL_CONFIG.MINIMUM_DISTRIBUTION) {
            const lastDist = this.getLastDistributionTime();
            const now = Date.now();
            
            if (!lastDist || (now - lastDist) >= LABOR_POOL_CONFIG.DISTRIBUTION_INTERVAL) {
                this.distributePool();
            }
        }
        
        return newTotal;
    }

    /**
     * Get current labor pool total
     * @returns {number} Labor pool total
     */
    getTotal() {
        return parseInt(localStorage.getItem(STORAGE_KEYS.LABOR_POOL_TOTAL)) || 0;
    }

    /**
     * Get total distributed all time
     * @returns {number} Total distributed
     */
    getTotalDistributed() {
        return parseInt(localStorage.getItem(STORAGE_KEYS.LABOR_POOL_DISTRIBUTED)) || 0;
    }

    /**
     * Get last distribution timestamp
     * @returns {number|null} Last distribution timestamp
     */
    getLastDistributionTime() {
        const last = localStorage.getItem(STORAGE_KEYS.LAST_DISTRIBUTION);
        return last ? parseInt(last) : null;
    }

    /**
     * Get all active players with skills
     * @returns {Array} Array of player objects with skill data
     */
    async getActivePlayers() {
        // This would normally query a database of active players
        // For now, we'll return the current player plus some simulated players
        
        const players = [];
        const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
        
        // Add current player
        const playerSkills = await this.getPlayerSkills(playerId);
        players.push({
            id: playerId,
            name: localStorage.getItem('voidfarer_player_name') || 'You',
            skills: playerSkills,
            totalCrafts: getTotalCrafts(playerSkills)
        });
        
        // Simulate some other players (in production, this would be real players)
        const simulatedPlayers = this.getSimulatedPlayers();
        players.push(...simulatedPlayers);
        
        return players;
    }

    /**
     * Get simulated players for testing
     * @returns {Array} Array of simulated players
     */
    getSimulatedPlayers() {
        const players = [];
        const names = ['Alex', 'Jamie', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jordan', 'Quinn'];
        const numPlayers = Math.floor(Math.random() * 5) + 3; // 3-8 players
        
        for (let i = 0; i < numPlayers; i++) {
            const name = names[Math.floor(Math.random() * names.length)] + (i + 1);
            const skills = this.generateRandomSkills();
            
            players.push({
                id: `sim_${Date.now()}_${i}`,
                name: name,
                skills: skills,
                totalCrafts: getTotalCrafts(skills),
                simulated: true
            });
        }
        
        return players;
    }

    /**
     * Generate random skills for simulated players
     * @returns {Object} Random skill progress
     */
    generateRandomSkills() {
        const skills = {};
        const categories = [
            'Basic Compounds', 'Acids & Bases', 'Salts & Minerals', 'Hydrocarbons',
            'Alcohols', 'Polymers', 'Basic Alloys', 'Composites', 'Semiconductors'
        ];
        
        categories.forEach(cat => {
            // Random progress between 0 and 5000
            skills[cat] = Math.floor(Math.random() * 5000);
        });
        
        return skills;
    }

    /**
     * Get player's skill progress
     * @param {string} playerId - Player ID
     * @returns {Object} Skill progress
     */
    async getPlayerSkills(playerId) {
        // Try to get from storage
        if (playerId === localStorage.getItem('voidfarer_player_id')) {
            const progress = localStorage.getItem('voidfarer_alchemy_progress');
            return progress ? JSON.parse(progress) : {};
        }
        
        // For other players, return empty (would query server in production)
        return {};
    }

    /**
     * Calculate skill weight for a player
     * @param {Object} playerSkills - Player's skill progress
     * @param {Object} productWeights - Product's skill weights
     * @returns {number} Total weight
     */
    calculatePlayerWeight(playerSkills, productWeights) {
        let totalWeight = 0;
        
        for (const [skill, weight] of Object.entries(productWeights)) {
            const progress = playerSkills[skill] || 0;
            const level = getLevelFromProgress(progress);
            const categoryMultiplier = getCategoryMultiplier(skill, progress);
            
            // Weight = product importance * player mastery multiplier * category multiplier
            totalWeight += weight * level.multiplier * categoryMultiplier;
        }
        
        return totalWeight;
    }

    /**
     * Distribute labor pool to skilled players
     * @param {string} productId - Optional specific product that triggered distribution
     * @returns {Object} Distribution results
     */
    async distributePool(productId = null) {
        const totalPool = this.getTotal();
        
        if (totalPool <= 0) {
            return { success: false, reason: 'Pool is empty' };
        }
        
        // Get active players
        const players = await this.getActivePlayers();
        
        if (players.length < LABOR_POOL_CONFIG.MIN_PLAYERS_FOR_DISTRIBUTION) {
            return { success: false, reason: 'Not enough players' };
        }
        
        // Determine which product weights to use
        let productWeights = null;
        if (productId && PRODUCT_CATEGORIES[productId]) {
            productWeights = PRODUCT_CATEGORIES[productId].skillWeights;
        }
        
        // Calculate weights for each player
        const playerWeights = [];
        let totalWeight = 0;
        
        for (const player of players) {
            let weight = 1.0; // Base weight
            
            if (productWeights) {
                // Use product-specific weights
                weight = this.calculatePlayerWeight(player.skills, productWeights);
            } else {
                // Use overall skill multiplier
                const totalCrafts = getTotalCrafts(player.skills);
                const level = getLevelFromProgress(totalCrafts);
                weight = level.multiplier;
            }
            
            if (weight > 0) {
                playerWeights.push({
                    playerId: player.id,
                    playerName: player.name,
                    weight: weight,
                    simulated: player.simulated || false
                });
                totalWeight += weight;
            }
        }
        
        if (totalWeight === 0) {
            return { success: false, reason: 'No players with skill weight' };
        }
        
        // Distribute pool
        const distribution = {};
        let distributed = 0;
        const earnings = {};
        
        for (const pw of playerWeights) {
            const share = Math.floor((pw.weight / totalWeight) * totalPool);
            distribution[pw.playerId] = {
                amount: share,
                weight: pw.weight,
                name: pw.playerName,
                simulated: pw.simulated
            };
            distributed += share;
            
            // Add to player's earnings
            if (!pw.simulated) {
                // Only add earnings for real players
                earnings[pw.playerId] = share;
            }
        }
        
        // Handle rounding errors
        const remainder = totalPool - distributed;
        if (remainder > 0 && playerWeights.length > 0) {
            // Add remainder to first player
            const firstPlayer = playerWeights[0];
            distribution[firstPlayer.playerId].amount += remainder;
            
            if (!firstPlayer.simulated) {
                earnings[firstPlayer.playerId] = (earnings[firstPlayer.playerId] || 0) + remainder;
            }
        }
        
        // Save earnings
        await this.addEarnings(earnings);
        
        // Update totals
        const totalDistributed = this.getTotalDistributed() + totalPool;
        localStorage.setItem(STORAGE_KEYS.LABOR_POOL_DISTRIBUTED, totalDistributed.toString());
        localStorage.setItem(STORAGE_KEYS.LABOR_POOL_TOTAL, '0');
        localStorage.setItem(STORAGE_KEYS.LAST_DISTRIBUTION, Date.now().toString());
        
        // Add to history
        this.addToHistory({
            type: 'distribution',
            amount: totalPool,
            players: playerWeights.length,
            distribution: distribution,
            timestamp: Date.now(),
            productId: productId
        });
        
        // Trigger labor pool event
        this.triggerLaborEvent('distribution', {
            amount: totalPool,
            players: playerWeights.length
        });
        
        return {
            success: true,
            totalDistributed: totalPool,
            distribution: distribution,
            playerCount: playerWeights.length,
            productId: productId
        };
    }

    /**
     * Add earnings to players
     * @param {Object} earnings - Object with player IDs as keys and amounts as values
     */
    async addEarnings(earnings) {
        const currentEarnings = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS) || '{}');
        
        for (const [playerId, amount] of Object.entries(earnings)) {
            currentEarnings[playerId] = (currentEarnings[playerId] || 0) + amount;
        }
        
        localStorage.setItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS, JSON.stringify(currentEarnings));
    }

    /**
     * Get player's unclaimed earnings
     * @param {string} playerId - Player ID
     * @returns {number} Unclaimed earnings
     */
    getPlayerEarnings(playerId) {
        const earnings = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS) || '{}');
        return earnings[playerId] || 0;
    }

    /**
     * Claim player's earnings
     * @param {string} playerId - Player ID
     * @returns {number} Amount claimed
     */
    async claimEarnings(playerId) {
        const earnings = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS) || '{}');
        const amount = earnings[playerId] || 0;
        
        if (amount > 0) {
            delete earnings[playerId];
            localStorage.setItem(STORAGE_KEYS.PLAYER_LABOR_EARNINGS, JSON.stringify(earnings));
            
            this.addToHistory({
                type: 'claim',
                playerId: playerId,
                amount: amount,
                timestamp: Date.now()
            });
        }
        
        return amount;
    }

    /**
     * Add entry to labor pool history
     * @param {Object} entry - History entry
     */
    addToHistory(entry) {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.LABOR_POOL_HISTORY) || '[]');
        
        history.push({
            ...entry,
            id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
        });
        
        // Keep only last MAX_HISTORY_ENTRIES
        if (history.length > LABOR_POOL_CONFIG.MAX_HISTORY_ENTRIES) {
            history.shift();
        }
        
        localStorage.setItem(STORAGE_KEYS.LABOR_POOL_HISTORY, JSON.stringify(history));
    }

    /**
     * Get labor pool history
     * @param {number} limit - Max number of entries
     * @returns {Array} History entries
     */
    getHistory(limit = 20) {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.LABOR_POOL_HISTORY) || '[]');
        return history.slice(-limit).reverse();
    }

    /**
     * Trigger a labor pool event
     * @param {string} type - Event type
     * @param {Object} data - Event data
     */
    triggerLaborEvent(type, data) {
        const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.LABOR_EVENTS) || '[]');
        
        events.push({
            type: type,
            data: data,
            timestamp: Date.now()
        });
        
        if (events.length > 100) {
            events.shift();
        }
        
        localStorage.setItem(STORAGE_KEYS.LABOR_EVENTS, JSON.stringify(events));
        
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('labor-pool-updated', {
            detail: { type, data, timestamp: Date.now() }
        }));
    }

    /**
     * Get labor pool statistics
     * @returns {Object} Statistics
     */
    getStats() {
        const total = this.getTotal();
        const distributed = this.getTotalDistributed();
        const lastDist = this.getLastDistributionTime();
        const history = this.getHistory(100);
        
        // Calculate average distribution
        const distributions = history.filter(h => h.type === 'distribution');
        const avgDistribution = distributions.length > 0
            ? distributions.reduce((sum, d) => sum + d.amount, 0) / distributions.length
            : 0;
        
        return {
            currentPool: total,
            totalDistributed: distributed,
            lastDistribution: lastDist,
            distributionCount: distributions.length,
            averageDistribution: Math.floor(avgDistribution),
            nextDistribution: lastDist ? lastDist + LABOR_POOL_CONFIG.DISTRIBUTION_INTERVAL : Date.now()
        };
    }

    /**
     * Check if distribution is due
     * @returns {boolean} True if distribution is due
     */
    isDistributionDue() {
        const lastDist = this.getLastDistributionTime();
        if (!lastDist) return true;
        
        return (Date.now() - lastDist) >= LABOR_POOL_CONFIG.DISTRIBUTION_INTERVAL;
    }

    /**
     * Auto-distribute if conditions are met
     * @returns {Object|null} Distribution result or null
     */
    async autoDistribute() {
        if (!this.isDistributionDue()) return null;
        
        const total = this.getTotal();
        if (total < LABOR_POOL_CONFIG.MINIMUM_DISTRIBUTION) return null;
        
        return await this.distributePool();
    }
}

// ===== HELPER FUNCTIONS =====

/**
 * Get player skill weights for labor calculation
 * @param {string} playerId - Player ID
 * @returns {Object} Skill weights
 */
export async function getPlayerSkillWeights(playerId) {
    try {
        // Get player's alchemy progress
        let progress = {};
        if (playerId === localStorage.getItem('voidfarer_player_id')) {
            const stored = localStorage.getItem('voidfarer_alchemy_progress');
            progress = stored ? JSON.parse(stored) : {};
        }
        
        const weights = {};
        const totalCrafts = getTotalCrafts(progress);
        const level = getLevelFromProgress(totalCrafts);
        
        // Calculate weight for each category
        for (const category of Object.keys(PRODUCT_CATEGORIES)) {
            const categoryProgress = progress[category] || 0;
            const categoryMultiplier = getCategoryMultiplier(category, categoryProgress);
            weights[category] = level.multiplier * categoryMultiplier;
        }
        
        return weights;
    } catch (error) {
        console.error('Error getting player skill weights:', error);
        return {};
    }
}

/**
 * Add credits to labor pool (global function)
 * @param {number} amount - Amount to add
 * @param {string} reason - Reason for addition
 * @returns {number} New total
 */
export function addToLaborPool(amount, reason = 'Manual addition') {
    const pool = new LaborPool();
    return pool.addToPool(amount, reason);
}

/**
 * Get labor pool total (global function)
 * @returns {number} Labor pool total
 */
export function getLaborPoolTotal() {
    const pool = new LaborPool();
    return pool.getTotal();
}

/**
 * Distribute labor pool (global function)
 * @param {string} productId - Optional product ID
 * @returns {Promise<Object>} Distribution results
 */
export async function distributeLaborPool(productId = null) {
    const pool = new LaborPool();
    return await pool.distributePool(productId);
}

/**
 * Get player's labor earnings (global function)
 * @param {string} playerId - Player ID
 * @returns {number} Unclaimed earnings
 */
export function getPlayerLaborEarnings(playerId) {
    const pool = new LaborPool();
    return pool.getPlayerEarnings(playerId);
}

/**
 * Claim player's labor earnings (global function)
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Amount claimed
 */
export async function claimLaborEarnings(playerId) {
    const pool = new LaborPool();
    return await pool.claimEarnings(playerId);
}

/**
 * Get labor pool history (global function)
 * @param {number} limit - Max entries
 * @returns {Array} History entries
 */
export function getLaborPoolHistory(limit = 20) {
    const pool = new LaborPool();
    return pool.getHistory(limit);
}

/**
 * Auto-distribute labor pool (global function)
 * @returns {Promise<Object|null>} Distribution result
 */
export async function autoDistributeLaborPool() {
    const pool = new LaborPool();
    return await pool.autoDistribute();
}

/**
 * Get labor pool stats (global function)
 * @returns {Object} Statistics
 */
export function getLaborPoolStats() {
    const pool = new LaborPool();
    return pool.getStats();
}

// ===== EXPORT CLASS AND FUNCTIONS =====
export default LaborPool;

// Attach to window for global access
window.LaborPool = LaborPool;
window.addToLaborPool = addToLaborPool;
window.getLaborPoolTotal = getLaborPoolTotal;
window.distributeLaborPool = distributeLaborPool;
window.getPlayerLaborEarnings = getPlayerLaborEarnings;
window.claimLaborEarnings = claimLaborEarnings;
window.getLaborPoolHistory = getLaborPoolHistory;
window.autoDistributeLaborPool = autoDistributeLaborPool;
window.getLaborPoolStats = getLaborPoolStats;
window.PRODUCT_CATEGORIES = PRODUCT_CATEGORIES;

console.log('✅ labor-pool.js loaded - Labor pool distribution system ready');

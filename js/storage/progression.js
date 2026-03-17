// js/storage/progression.js
// Skill progression and mastery tracking for all crafting fields
// Tracks player progress across alchemy, metallurgy, materials science, etc.

import { getPlayer, savePlayer } from '../storage.js';  // FIXED: removed extra /storage/

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    // Field progression
    ALCHEMY_PROGRESS: 'voidfarer_alchemy_progress',
    METALLURGY_PROGRESS: 'voidfarer_metallurgy_progress',
    MATERIALS_SCIENCE_PROGRESS: 'voidfarer_materials_science_progress',
    PHARMACEUTICALS_PROGRESS: 'voidfarer_pharmaceuticals_progress',
    TEXTILES_PROGRESS: 'voidfarer_textiles_progress',
    CONSTRUCTION_PROGRESS: 'voidfarer_construction_progress',
    AEROSPACE_PROGRESS: 'voidfarer_aerospace_progress',
    NUCLEAR_PROGRESS: 'voidfarer_nuclear_progress',
    OPTICAL_PROGRESS: 'voidfarer_optical_progress',
    MAGNETIC_PROGRESS: 'voidfarer_magnetic_progress',
    CRYOGENIC_PROGRESS: 'voidfarer_cryogenic_progress',
    POLYMERS_PROGRESS: 'voidfarer_polymers_progress',
    
    // Recipe unlocks
    RECIPE_UNLOCKS: 'voidfarer_recipe_unlocks',
    
    // Field mastery levels
    FIELD_MASTERY: 'voidfarer_field_mastery',
    
    // Global stats
    TOTAL_CRAFTS: 'voidfarer_total_crafts',
    FIELD_STATS: 'voidfarer_field_stats'
};

// ===== MASTERY LEVELS (Shared across all fields) =====
export const MASTERY_LEVELS = [
    { name: 'Untrained', threshold: 0, multiplier: 1.0, color: '#ffffff' },
    { name: 'Novice', threshold: 100, multiplier: 1.2, color: '#b0ffb0' },
    { name: 'Apprentice', threshold: 1000, multiplier: 1.5, color: '#b0b0ff' },
    { name: 'Journeyman', threshold: 5000, multiplier: 2.0, color: '#e0b0ff' },
    { name: 'Expert', threshold: 10000, multiplier: 3.0, color: '#ffd700' },
    { name: 'Master', threshold: 25000, multiplier: 5.0, color: '#ffaa4a' },
    { name: 'Grand Master', threshold: 50000, multiplier: 8.0, color: '#ff6b6b' },
    { name: 'Sage', threshold: 100000, multiplier: 12.0, color: '#4affaa' },
    { name: 'Legendary', threshold: 250000, multiplier: 20.0, color: '#c0a0ff' },
    { name: 'Mythic', threshold: 500000, multiplier: 35.0, color: '#ff69b4' },
    { name: 'Transcendent', threshold: 1000000, multiplier: 50.0, color: '#ffd700' }
];

// ===== FIELD CONFIGURATION =====
export const FIELDS = {
    alchemy: {
        name: 'Alchemy',
        key: STORAGE_KEYS.ALCHEMY_PROGRESS,
        icon: '⚗️',
        color: '#4affaa',
        description: 'Create compounds, acids, bases, and organic materials'
    },
    metallurgy: {
        name: 'Metallurgy',
        key: STORAGE_KEYS.METALLURGY_PROGRESS,
        icon: '🔨',
        color: '#ffaa4a',
        description: 'Smelt ores, create alloys, and heat treat metals'
    },
    'materials-science': {
        name: 'Materials Science',
        key: STORAGE_KEYS.MATERIALS_SCIENCE_PROGRESS,
        icon: '🧪',
        color: '#e0b0ff',
        description: 'Create ceramics, glasses, composites, and smart materials'
    },
    pharmaceuticals: {
        name: 'Pharmaceuticals',
        key: STORAGE_KEYS.PHARMACEUTICALS_PROGRESS,
        icon: '💊',
        color: '#ff6b6b',
        description: 'Create medicines, vaccines, and biomaterials'
    },
    textiles: {
        name: 'Textiles',
        key: STORAGE_KEYS.TEXTILES_PROGRESS,
        icon: '🧵',
        color: '#ff69b4',
        description: 'Create fibers, yarns, fabrics, and smart textiles'
    },
    construction: {
        name: 'Construction',
        key: STORAGE_KEYS.CONSTRUCTION_PROGRESS,
        icon: '🏗️',
        color: '#8a6aff',
        description: 'Create building materials and structures'
    },
    aerospace: {
        name: 'Aerospace',
        key: STORAGE_KEYS.AEROSPACE_PROGRESS,
        icon: '🚀',
        color: '#4a8ac0',
        description: 'Create advanced materials for space and flight'
    },
    nuclear: {
        name: 'Nuclear',
        key: STORAGE_KEYS.NUCLEAR_PROGRESS,
        icon: '☢️',
        color: '#ffd966',
        description: 'Create radiation shielding and nuclear materials'
    },
    optical: {
        name: 'Optical',
        key: STORAGE_KEYS.OPTICAL_PROGRESS,
        icon: '🔍',
        color: '#b0b0ff',
        description: 'Create lenses, fiber optics, and photonic materials'
    },
    magnetic: {
        name: 'Magnetic',
        key: STORAGE_KEYS.MAGNETIC_PROGRESS,
        icon: '🧲',
        color: '#c0a0ff',
        description: 'Create permanent magnets and magnetic materials'
    },
    cryogenic: {
        name: 'Cryogenic',
        key: STORAGE_KEYS.CRYOGENIC_PROGRESS,
        icon: '❄️',
        color: '#b0ffb0',
        description: 'Create superconductors and low-temperature materials'
    },
    polymers: {
        name: 'Polymers',
        key: STORAGE_KEYS.POLYMERS_PROGRESS,
        icon: '🧴',
        color: '#ffd700',
        description: 'Create plastics, elastomers, and polymer composites'
    }
};

// ============================================================================
// FIELD PROGRESSION FUNCTIONS
// ============================================================================

/**
 * Get progress for a specific field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @returns {Promise<Object>} Progress object { recipeId: progress }
 */
export async function getFieldProgress(playerId, field) {
    try {
        const fieldConfig = FIELDS[field];
        if (!fieldConfig) {
            console.error(`Unknown field: ${field}`);
            return {};
        }
        
        const key = `${fieldConfig.key}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error(`Error getting ${field} progress:`, error);
        return {};
    }
}

/**
 * Save progress for a specific field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {Object} progress - Progress object
 * @returns {Promise<boolean>} Success status
 */
export async function saveFieldProgress(playerId, field, progress) {
    try {
        const fieldConfig = FIELDS[field];
        if (!fieldConfig) {
            console.error(`Unknown field: ${field}`);
            return false;
        }
        
        const key = `${fieldConfig.key}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(progress));
        return true;
    } catch (error) {
        console.error(`Error saving ${field} progress:`, error);
        return false;
    }
}

/**
 * Update progress for a specific recipe in a field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {string} recipeId - Recipe ID
 * @param {number} newProgress - New progress value
 * @returns {Promise<boolean>} Success status
 */
export async function updateFieldProgress(playerId, field, recipeId, newProgress) {
    try {
        const progress = await getFieldProgress(playerId, field);
        progress[recipeId] = newProgress;
        
        // Update total crafts for this field
        const totalCrafts = Object.values(progress).reduce((a, b) => a + b, 0);
        await updateFieldStats(playerId, field, 'totalCrafts', totalCrafts);
        
        return await saveFieldProgress(playerId, field, progress);
    } catch (error) {
        console.error(`Error updating ${field} progress:`, error);
        return false;
    }
}

/**
 * Get total progress (sum of all crafts) for a field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @returns {Promise<number>} Total progress
 */
export async function getTotalFieldProgress(playerId, field) {
    try {
        const progress = await getFieldProgress(playerId, field);
        return Object.values(progress).reduce((a, b) => a + b, 0);
    } catch (error) {
        console.error(`Error getting total ${field} progress:`, error);
        return 0;
    }
}

/**
 * Get progress for a specific recipe
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<number>} Recipe progress
 */
export async function getRecipeProgress(playerId, field, recipeId) {
    try {
        const progress = await getFieldProgress(playerId, field);
        return progress[recipeId] || 0;
    } catch (error) {
        console.error(`Error getting recipe progress:`, error);
        return 0;
    }
}

// ============================================================================
// FIELD MASTERY FUNCTIONS
// ============================================================================

/**
 * Get mastery level for a field based on total progress
 * @param {number} totalProgress - Total progress in field
 * @returns {Object} Mastery level object
 */
export function getMasteryLevel(totalProgress) {
    for (let i = MASTERY_LEVELS.length - 1; i >= 0; i--) {
        if (totalProgress >= MASTERY_LEVELS[i].threshold) {
            return MASTERY_LEVELS[i];
        }
    }
    return MASTERY_LEVELS[0];
}

/**
 * Get all mastery levels for all fields
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Mastery levels by field
 */
export async function getAllFieldMastery(playerId) {
    const mastery = {};
    
    for (const [field, config] of Object.entries(FIELDS)) {
        const totalProgress = await getTotalFieldProgress(playerId, field);
        mastery[field] = {
            ...getMasteryLevel(totalProgress),
            progress: totalProgress,
            field: field,
            fieldName: config.name,
            icon: config.icon,
            color: config.color
        };
    }
    
    return mastery;
}

/**
 * Get progress to next mastery level for a field
 * @param {number} totalProgress - Total progress in field
 * @returns {Object} Progress information
 */
export function getProgressToNextLevel(totalProgress) {
    for (let i = 0; i < MASTERY_LEVELS.length - 1; i++) {
        const current = MASTERY_LEVELS[i];
        const next = MASTERY_LEVELS[i + 1];
        
        if (totalProgress >= current.threshold && totalProgress < next.threshold) {
            const totalNeeded = next.threshold - current.threshold;
            const currentProgress = totalProgress - current.threshold;
            
            return {
                currentLevel: current.name,
                nextLevel: next.name,
                progress: currentProgress,
                totalNeeded: totalNeeded,
                percentage: (currentProgress / totalNeeded) * 100,
                currentMultiplier: current.multiplier,
                nextMultiplier: next.multiplier
            };
        }
    }
    
    // At max level
    const maxLevel = MASTERY_LEVELS[MASTERY_LEVELS.length - 1];
    return {
        currentLevel: maxLevel.name,
        nextLevel: null,
        progress: 0,
        totalNeeded: 0,
        percentage: 100,
        currentMultiplier: maxLevel.multiplier,
        nextMultiplier: maxLevel.multiplier
    };
}

// ============================================================================
// RECIPE UNLOCK FUNCTIONS
// ============================================================================

/**
 * Get unlocked recipes for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Unlocked recipes by field
 */
export async function getUnlockedRecipes(playerId) {
    try {
        const key = `${STORAGE_KEYS.RECIPE_UNLOCKS}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting unlocked recipes:', error);
        return {};
    }
}

/**
 * Save unlocked recipes
 * @param {string} playerId - Player ID
 * @param {Object} unlocks - Unlocked recipes object
 * @returns {Promise<boolean>} Success status
 */
export async function saveUnlockedRecipes(playerId, unlocks) {
    try {
        const key = `${STORAGE_KEYS.RECIPE_UNLOCKS}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(unlocks));
        return true;
    } catch (error) {
        console.error('Error saving unlocked recipes:', error);
        return false;
    }
}

/**
 * Unlock a recipe for a player
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<boolean>} Success status
 */
export async function unlockRecipe(playerId, field, recipeId) {
    try {
        const unlocks = await getUnlockedRecipes(playerId);
        
        if (!unlocks[field]) {
            unlocks[field] = [];
        }
        
        if (!unlocks[field].includes(recipeId)) {
            unlocks[field].push(recipeId);
        }
        
        return await saveUnlockedRecipes(playerId, unlocks);
    } catch (error) {
        console.error('Error unlocking recipe:', error);
        return false;
    }
}

/**
 * Check if recipe is unlocked
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<boolean>} True if unlocked
 */
export async function isRecipeUnlocked(playerId, field, recipeId) {
    try {
        const unlocks = await getUnlockedRecipes(playerId);
        return unlocks[field]?.includes(recipeId) || false;
    } catch (error) {
        console.error('Error checking recipe unlock:', error);
        return false;
    }
}

/**
 * Get recipes that should be unlocked based on progress
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {Array} recipes - Array of recipe objects
 * @returns {Promise<Array>} Recipes that should be unlocked
 */
export async function getPendingUnlocks(playerId, field, recipes) {
    const totalProgress = await getTotalFieldProgress(playerId, field);
    const unlocked = await getUnlockedRecipes(playerId);
    const unlockedInField = unlocked[field] || [];
    
    return recipes.filter(recipe => 
        totalProgress >= recipe.unlocksAt && 
        !unlockedInField.includes(recipe.id)
    );
}

// ============================================================================
// FIELD STATISTICS
// ============================================================================

/**
 * Get field statistics
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Field statistics
 */
export async function getFieldStats(playerId) {
    try {
        const key = `${STORAGE_KEYS.FIELD_STATS}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {
            totalCrafts: 0,
            mostCraftedField: null,
            mostCraftedRecipe: null,
            fields: {}
        };
    } catch (error) {
        console.error('Error getting field stats:', error);
        return {
            totalCrafts: 0,
            mostCraftedField: null,
            mostCraftedRecipe: null,
            fields: {}
        };
    }
}

/**
 * Save field statistics
 * @param {string} playerId - Player ID
 * @param {Object} stats - Field statistics
 * @returns {Promise<boolean>} Success status
 */
export async function saveFieldStats(playerId, stats) {
    try {
        const key = `${STORAGE_KEYS.FIELD_STATS}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(stats));
        return true;
    } catch (error) {
        console.error('Error saving field stats:', error);
        return false;
    }
}

/**
 * Update field statistics
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @param {string} stat - Stat name
 * @param {any} value - Stat value
 * @returns {Promise<boolean>} Success status
 */
export async function updateFieldStats(playerId, field, stat, value) {
    try {
        const stats = await getFieldStats(playerId);
        
        if (!stats.fields[field]) {
            stats.fields[field] = {
                totalCrafts: 0,
                mostCraftedRecipe: null,
                recipes: {}
            };
        }
        
        if (stat === 'totalCrafts') {
            stats.fields[field].totalCrafts = value;
            
            // Update global total
            let globalTotal = 0;
            for (const f in stats.fields) {
                globalTotal += stats.fields[f].totalCrafts;
            }
            stats.totalCrafts = globalTotal;
        }
        
        return await saveFieldStats(playerId, stats);
    } catch (error) {
        console.error('Error updating field stats:', error);
        return false;
    }
}

/**
 * Get most active field
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Most active field data
 */
export async function getMostActiveField(playerId) {
    try {
        const stats = await getFieldStats(playerId);
        let maxCrafts = 0;
        let mostActive = null;
        
        for (const [field, data] of Object.entries(stats.fields)) {
            if (data.totalCrafts > maxCrafts) {
                maxCrafts = data.totalCrafts;
                mostActive = {
                    field,
                    ...FIELDS[field],
                    totalCrafts: data.totalCrafts
                };
            }
        }
        
        return mostActive;
    } catch (error) {
        console.error('Error getting most active field:', error);
        return null;
    }
}

// ============================================================================
// GLOBAL PROGRESSION FUNCTIONS
// ============================================================================

/**
 * Get total crafts across all fields
 * @param {string} playerId - Player ID
 * @returns {Promise<number>} Total crafts
 */
export async function getTotalCrafts(playerId) {
    try {
        let total = 0;
        
        for (const field of Object.keys(FIELDS)) {
            total += await getTotalFieldProgress(playerId, field);
        }
        
        return total;
    } catch (error) {
        console.error('Error getting total crafts:', error);
        return 0;
    }
}

/**
 * Get player's overall mastery level (based on total crafts)
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Overall mastery level
 */
export async function getOverallMastery(playerId) {
    const totalCrafts = await getTotalCrafts(playerId);
    return getMasteryLevel(totalCrafts);
}

/**
 * Get detailed progression report for all fields
 * @param {string} playerId - Player ID
 * @returns {Promise<Array>} Progression report
 */
export async function getProgressionReport(playerId) {
    const report = [];
    
    for (const [field, config] of Object.entries(FIELDS)) {
        const totalProgress = await getTotalFieldProgress(playerId, field);
        const mastery = getMasteryLevel(totalProgress);
        const nextLevel = getProgressToNextLevel(totalProgress);
        
        report.push({
            field,
            name: config.name,
            icon: config.icon,
            color: config.color,
            totalProgress,
            mastery: mastery.name,
            multiplier: mastery.multiplier,
            nextLevel: nextLevel.nextLevel,
            progressToNext: nextLevel.percentage,
            progressCurrent: nextLevel.progress,
            progressTotal: nextLevel.totalNeeded
        });
    }
    
    return report.sort((a, b) => b.totalProgress - a.totalProgress);
}

/**
 * Get milestone achievements
 * @param {string} playerId - Player ID
 * @returns {Promise<Array>} Milestone achievements
 */
export async function getMilestones(playerId) {
    const totalCrafts = await getTotalCrafts(playerId);
    const milestones = [];
    
    // Define milestone thresholds
    const milestoneThresholds = [100, 1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
    
    for (const threshold of milestoneThresholds) {
        if (totalCrafts >= threshold) {
            milestones.push({
                threshold,
                name: getMilestoneName(threshold),
                achieved: true,
                icon: getMilestoneIcon(threshold)
            });
        } else {
            milestones.push({
                threshold,
                name: getMilestoneName(threshold),
                achieved: false,
                progress: Math.min(100, (totalCrafts / threshold) * 100),
                icon: getMilestoneIcon(threshold)
            });
        }
    }
    
    return milestones;
}

/**
 * Get milestone name
 * @param {number} threshold - Milestone threshold
 * @returns {string} Milestone name
 */
function getMilestoneName(threshold) {
    const names = {
        100: 'Novice Crafter',
        1000: 'Apprentice Artisan',
        5000: 'Journeyman',
        10000: 'Expert',
        25000: 'Master',
        50000: 'Grand Master',
        100000: 'Sage',
        250000: 'Legendary',
        500000: 'Mythic',
        1000000: 'Transcendent'
    };
    return names[threshold] || `Milestone ${threshold}`;
}

/**
 * Get milestone icon
 * @param {number} threshold - Milestone threshold
 * @returns {string} Milestone icon
 */
function getMilestoneIcon(threshold) {
    if (threshold >= 1000000) return '✨';
    if (threshold >= 500000) return '⭐';
    if (threshold >= 250000) return '🌟';
    if (threshold >= 100000) return '💫';
    if (threshold >= 50000) return '⚡';
    if (threshold >= 25000) return '💎';
    if (threshold >= 10000) return '🏆';
    if (threshold >= 5000) return '🎖️';
    if (threshold >= 1000) return '📜';
    return '🔰';
}

// ============================================================================
// RESET FUNCTIONS
// ============================================================================

/**
 * Reset progression for a specific field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @returns {Promise<boolean>} Success status
 */
export async function resetFieldProgress(playerId, field) {
    try {
        const fieldConfig = FIELDS[field];
        if (!fieldConfig) return false;
        
        const key = `${fieldConfig.key}_${playerId}`;
        localStorage.removeItem(key);
        
        // Update stats
        await updateFieldStats(playerId, field, 'totalCrafts', 0);
        
        return true;
    } catch (error) {
        console.error(`Error resetting ${field} progress:`, error);
        return false;
    }
}

/**
 * Reset all progression for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success status
 */
export async function resetAllProgression(playerId) {
    try {
        for (const field of Object.keys(FIELDS)) {
            await resetFieldProgress(playerId, field);
        }
        
        // Clear unlocks
        const unlockKey = `${STORAGE_KEYS.RECIPE_UNLOCKS}_${playerId}`;
        localStorage.removeItem(unlockKey);
        
        // Clear stats
        const statsKey = `${STORAGE_KEYS.FIELD_STATS}_${playerId}`;
        localStorage.removeItem(statsKey);
        
        return true;
    } catch (error) {
        console.error('Error resetting all progression:', error);
        return false;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize progression for a new player
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success status
 */
export async function initializeProgression(playerId) {
    try {
        // Check if already initialized
        const stats = await getFieldStats(playerId);
        if (stats && Object.keys(stats.fields).length > 0) {
            return true; // Already initialized
        }
        
        // Create empty progress for each field
        for (const field of Object.keys(FIELDS)) {
            const key = `${FIELDS[field].key}_${playerId}`;
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, '{}');
            }
        }
        
        // Initialize unlocks
        const unlockKey = `${STORAGE_KEYS.RECIPE_UNLOCKS}_${playerId}`;
        if (!localStorage.getItem(unlockKey)) {
            localStorage.setItem(unlockKey, '{}');
        }
        
        // Initialize stats
        const statsKey = `${STORAGE_KEYS.FIELD_STATS}_${playerId}`;
        if (!localStorage.getItem(statsKey)) {
            const initialStats = {
                totalCrafts: 0,
                mostCraftedField: null,
                mostCraftedRecipe: null,
                fields: {}
            };
            localStorage.setItem(statsKey, JSON.stringify(initialStats));
        }
        
        return true;
    } catch (error) {
        console.error('Error initializing progression:', error);
        return false;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    // Constants
    MASTERY_LEVELS,
    FIELDS,
    
    // Field progression
    getFieldProgress,
    saveFieldProgress,
    updateFieldProgress,
    getTotalFieldProgress,
    getRecipeProgress,
    
    // Mastery
    getMasteryLevel,
    getAllFieldMastery,
    getProgressToNextLevel,
    
    // Recipe unlocks
    getUnlockedRecipes,
    saveUnlockedRecipes,
    unlockRecipe,
    isRecipeUnlocked,
    getPendingUnlocks,
    
    // Statistics
    getFieldStats,
    saveFieldStats,
    updateFieldStats,
    getMostActiveField,
    
    // Global progression
    getTotalCrafts,
    getOverallMastery,
    getProgressionReport,
    getMilestones,
    
    // Reset
    resetFieldProgress,
    resetAllProgression,
    
    // Initialization
    initializeProgression
};

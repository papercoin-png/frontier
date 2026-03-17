// js/crafting/crafting-core.js
// Universal Crafting Engine for Voidfarer
// Handles crafting for ALL fields (alchemy, metallurgy, materials science, etc.)

import { 
    RECIPE_DATABASE, 
    getRecipeById,
    calculateMaterialCost,
    getBaseElements
} from './recipe-index.js';

import { 
    getInventory, 
    removeElementFromInventory,
    removeMaterialFromInventory,
    addElementToInventory,
    addMaterialToInventory,
    hasEnoughIngredients
} from '../storage/inventory.js';

import {
    getFieldProgress,
    updateFieldProgress,
    getFieldLevel,      // Imported from progression.js
    getFieldMultiplier
} from '../storage/progression.js';

// ===== MASTERY LEVELS (Shared across all fields) =====
export const MASTERY_LEVELS = [
    { name: 'Untrained', threshold: 0, multiplier: 1.0 },
    { name: 'Novice', threshold: 100, multiplier: 1.2 },
    { name: 'Apprentice', threshold: 1000, multiplier: 1.5 },
    { name: 'Journeyman', threshold: 5000, multiplier: 2.0 },
    { name: 'Expert', threshold: 10000, multiplier: 3.0 },
    { name: 'Master', threshold: 25000, multiplier: 5.0 },
    { name: 'Grand Master', threshold: 50000, multiplier: 8.0 },
    { name: 'Sage', threshold: 100000, multiplier: 12.0 },
    { name: 'Legendary', threshold: 250000, multiplier: 20.0 },
    { name: 'Mythic', threshold: 500000, multiplier: 35.0 },
    { name: 'Transcendent', threshold: 1000000, multiplier: 50.0 }
];

// ===== QUALITY TIERS =====
export const QUALITY_TIERS = [
    { name: 'Poor', multiplier: 0.5, icon: '⬛', color: '#808080' },
    { name: 'Standard', multiplier: 1.0, icon: '⬜', color: '#ffffff' },
    { name: 'High', multiplier: 1.5, icon: '🟦', color: '#4a8ac0' },
    { name: 'Perfect', multiplier: 2.0, icon: '🟪', color: '#e0b0ff' },
    { name: 'Legendary', multiplier: 3.0, icon: '✨', color: '#ffd700' }
];

// ============================================================================
// CORE CRAFTING FUNCTIONS
// ============================================================================

/**
 * Craft an item (universal - works for any field)
 * @param {string} recipeId - ID of the recipe to craft
 * @param {number} count - Number of times to craft
 * @param {Object} options - Crafting options (quality focus, etc.)
 * @returns {Promise<Object>} Result of crafting operation
 */
export async function craftItem(recipeId, count = 1, options = {}) {
    try {
        console.log(`🔨 Crafting ${count}x ${recipeId}...`);
        
        // Get recipe
        const recipe = getRecipeById(recipeId);
        if (!recipe) {
            return { success: false, error: 'Recipe not found' };
        }
        
        // Validate count
        if (count < 1) {
            return { success: false, error: 'Count must be at least 1' };
        }
        
        // Get player ID
        const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
        
        // Get field for this recipe
        const field = recipe.field || 'alchemy';
        
        // Get current progress for this field
        const fieldProgress = await getFieldProgress(playerId, field);
        const currentProgress = fieldProgress[recipeId] || 0;
        
        // Calculate total ingredients needed
        const totalIngredients = calculateMaterialCost(recipeId, count);
        
        // Get current inventory
        const inventory = await getInventory(playerId);
        
        // Check if player has enough ingredients
        const hasIngredients = await hasEnoughIngredients(playerId, totalIngredients);
        if (!hasIngredients) {
            return { 
                success: false, 
                error: 'Insufficient ingredients',
                required: totalIngredients
            };
        }
        
        // Determine quality based on skill and options
        const quality = await determineQuality(recipe, fieldProgress, options);
        
        // Consume ingredients
        for (const [ingredient, amount] of Object.entries(totalIngredients)) {
            // Try to remove as material first, fall back to element
            const removed = await removeMaterialFromInventory(playerId, ingredient, amount);
            if (!removed.success) {
                await removeElementFromInventory(playerId, ingredient, amount);
            }
        }
        
        // Calculate skill gain (base * quality multiplier)
        const skillGain = Math.round(recipe.skillGain * count * quality.multiplier);
        
        // Update progress
        const newProgress = currentProgress + skillGain;
        await updateFieldProgress(playerId, field, recipeId, newProgress);
        
        // Add crafted item to inventory
        const itemId = `${recipeId}_${quality.name.toLowerCase()}`;
        await addMaterialToInventory(playerId, itemId, count, {
            recipeId: recipeId,
            name: recipe.name,
            quality: quality.name,
            qualityMultiplier: quality.multiplier,
            value: recipe.value * quality.multiplier,
            icon: recipe.icon,
            field: field,
            craftedAt: Date.now()
        });
        
        // Calculate new level
        const totalFieldProgress = await getTotalFieldProgress(playerId, field);
        const oldLevel = getFieldLevel(currentProgress);
        const newLevel = getFieldLevel(newProgress);
        
        // Return success with details
        return {
            success: true,
            count: count,
            recipe: recipe.name,
            field: field,
            skillGain: skillGain,
            quality: quality.name,
            qualityMultiplier: quality.multiplier,
            newProgress: newProgress,
            leveledUp: oldLevel.name !== newLevel.name,
            newLevel: newLevel.name,
            multiplier: newLevel.multiplier,
            itemId: itemId
        };
        
    } catch (error) {
        console.error('Error in craftItem:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Determine quality of crafted item
 * @param {Object} recipe - Recipe being crafted
 * @param {Object} fieldProgress - Player's progress in this field
 * @param {Object} options - Crafting options
 * @returns {Promise<Object>} Quality tier
 */
async function determineQuality(recipe, fieldProgress, options = {}) {
    // Base quality chance influenced by skill level
    const totalProgress = Object.values(fieldProgress).reduce((a, b) => a + b, 0);
    const level = getFieldLevel(totalProgress);
    
    // Quality roll (0-100)
    const roll = Math.random() * 100;
    
    // Adjust roll based on skill multiplier
    const adjustedRoll = roll * level.multiplier;
    
    // Determine quality
    if (adjustedRoll > 95 || options.forceLegendary) {
        return QUALITY_TIERS[4]; // Legendary
    } else if (adjustedRoll > 80) {
        return QUALITY_TIERS[3]; // Perfect
    } else if (adjustedRoll > 60) {
        return QUALITY_TIERS[2]; // High
    } else if (adjustedRoll > 30) {
        return QUALITY_TIERS[1]; // Standard
    } else {
        return QUALITY_TIERS[0]; // Poor
    }
}

/**
 * Batch craft multiple items
 * @param {string} recipeId - ID of the recipe to craft
 * @param {number} totalCount - Total number to craft
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Batch results
 */
export async function batchCraft(recipeId, totalCount, onProgress = null) {
    const results = {
        success: 0,
        failed: 0,
        total: totalCount,
        leveledUp: false,
        newLevel: null,
        items: [],
        quality: {
            Poor: 0,
            Standard: 0,
            High: 0,
            Perfect: 0,
            Legendary: 0
        }
    };
    
    // Check if we can craft the entire batch at once
    const recipe = getRecipeById(recipeId);
    if (!recipe) {
        return { success: false, error: 'Recipe not found' };
    }
    
    const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
    const totalIngredients = calculateMaterialCost(recipeId, totalCount);
    const hasIngredients = await hasEnoughIngredients(playerId, totalIngredients);
    
    if (!hasIngredients) {
        // Fall back to individual crafting
        for (let i = 0; i < totalCount; i++) {
            const result = await craftItem(recipeId, 1);
            
            if (result.success) {
                results.success++;
                results.quality[result.quality]++;
                results.items.push(result);
                
                if (result.leveledUp) {
                    results.leveledUp = true;
                    results.newLevel = result.newLevel;
                }
            } else {
                results.failed++;
            }
            
            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: totalCount,
                    success: result.success
                });
            }
        }
    } else {
        // Craft entire batch at once
        const result = await craftItem(recipeId, totalCount);
        
        if (result.success) {
            results.success = totalCount;
            results.quality[result.quality] = totalCount;
            results.items.push(result);
            results.leveledUp = result.leveledUp;
            results.newLevel = result.newLevel;
        } else {
            results.failed = totalCount;
        }
        
        if (onProgress) {
            onProgress({
                current: totalCount,
                total: totalCount,
                success: result.success
            });
        }
    }
    
    return results;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Check if player can craft a recipe
 * @param {string} recipeId - Recipe ID
 * @param {number} count - Number to craft
 * @returns {Promise<Object>} Validation result
 */
export async function canCraft(recipeId, count = 1) {
    const playerId = localStorage.getItem('voidfarer_player_id') || 'player_default';
    const recipe = getRecipeById(recipeId);
    
    if (!recipe) {
        return { can: false, error: 'Recipe not found' };
    }
    
    // Check if recipe is unlocked
    const fieldProgress = await getFieldProgress(playerId, recipe.field);
    const totalProgress = Object.values(fieldProgress).reduce((a, b) => a + b, 0);
    
    if (totalProgress < recipe.unlocksAt) {
        return { 
            can: false, 
            error: `Recipe unlocks at ${recipe.unlocksAt} total crafts in ${recipe.field}` 
        };
    }
    
    // Check ingredients
    const totalIngredients = calculateMaterialCost(recipeId, count);
    const hasIngredients = await hasEnoughIngredients(playerId, totalIngredients);
    
    if (!hasIngredients) {
        return { 
            can: false, 
            error: 'Insufficient ingredients',
            required: totalIngredients
        };
    }
    
    return { can: true };
}

// ============================================================================
// PROGRESS & MASTERY FUNCTIONS
// ============================================================================

/**
 * Get total progress for a field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @returns {Promise<number>} Total progress
 */
export async function getTotalFieldProgress(playerId, field) {
    const progress = await getFieldProgress(playerId, field);
    return Object.values(progress).reduce((a, b) => a + b, 0);
}

/**
 * Get mastery level for a field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @returns {Promise<Object>} Mastery level
 */
export async function getFieldMastery(playerId, field) {
    const totalProgress = await getTotalFieldProgress(playerId, field);
    return getFieldLevel(totalProgress);
}

/**
 * Get progress to next level for a field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @returns {Promise<Object>} Progress info
 */
export async function getProgressToNextLevel(playerId, field) {
    const totalProgress = await getTotalFieldProgress(playerId, field);
    
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
 * Get unlocked recipes for a field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @returns {Promise<Array>} Unlocked recipes
 */
export async function getUnlockedRecipes(playerId, field) {
    const totalProgress = await getTotalFieldProgress(playerId, field);
    const fieldRecipes = RECIPE_DATABASE[field] || {};
    const unlocked = [];
    
    for (const category in fieldRecipes) {
        for (const recipe of fieldRecipes[category]) {
            if (totalProgress >= recipe.unlocksAt) {
                unlocked.push({
                    ...recipe,
                    category: category,
                    field: field
                });
            }
        }
    }
    
    return unlocked;
}

/**
 * Get all recipes with progress for a field
 * @param {string} playerId - Player ID
 * @param {string} field - Field name
 * @returns {Promise<Array>} Recipes with progress
 */
export async function getRecipesWithProgress(playerId, field) {
    const fieldProgress = await getFieldProgress(playerId, field);
    const totalProgress = await getTotalFieldProgress(playerId, field);
    const fieldRecipes = RECIPE_DATABASE[field] || {};
    const recipesWithProgress = [];
    
    for (const category in fieldRecipes) {
        for (const recipe of fieldRecipes[category]) {
            const progress = fieldProgress[recipe.id] || 0;
            const level = getFieldLevel(progress);
            const unlocked = totalProgress >= recipe.unlocksAt;
            
            recipesWithProgress.push({
                ...recipe,
                category: category,
                progress: progress,
                level: progress === 0 ? 'Untrained' : level.name,
                multiplier: level.multiplier,
                unlocked: unlocked,
                percentComplete: Math.min(100, Math.round((progress / recipe.target) * 100))
            });
        }
    }
    
    return recipesWithProgress;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate total value of crafted items
 * @param {Array} items - Array of crafted items
 * @returns {number} Total value
 */
export function calculateTotalValue(items) {
    return items.reduce((sum, item) => {
        return sum + (item.value * item.count * (item.qualityMultiplier || 1));
    }, 0);
}

/**
 * Format quality for display
 * @param {string} quality - Quality name
 * @returns {string} Formatted quality with icon
 */
export function formatQuality(quality) {
    const tier = QUALITY_TIERS.find(t => t.name === quality);
    return tier ? `${tier.icon} ${quality}` : quality;
}

/**
 * Get quality color
 * @param {string} quality - Quality name
 * @returns {string} Hex color code
 */
export function getQualityColor(quality) {
    const tier = QUALITY_TIERS.find(t => t.name === quality);
    return tier ? tier.color : '#ffffff';
}

// ===== EXPORT ALL =====
export default {
    // Core crafting
    craftItem,
    batchCraft,
    canCraft,
    
    // Mastery
    MASTERY_LEVELS,
    QUALITY_TIERS,
    getFieldLevel,      // Now using the imported version
    getFieldMastery,
    getProgressToNextLevel,
    getTotalFieldProgress,
    
    // Recipe unlocks
    getUnlockedRecipes,
    getRecipesWithProgress,
    
    // Utilities
    calculateTotalValue,
    formatQuality,
    getQualityColor,
    
    // Quality
    determineQuality
};

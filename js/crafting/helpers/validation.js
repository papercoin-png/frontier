// js/crafting/helpers/validation.js
// Validation functions for crafting system
// Handles ingredient checking, recipe validation, and craft eligibility

import { getRecipeById } from '../recipe-index.js';
import { 
    getElementInventory, 
    getMaterialInventory, 
    getItemCount,
    hasEnoughIngredients as checkInventory
} from '../../storage/inventory.js';

import { 
    getFieldProgress,
    isRecipeUnlocked as checkUnlock
} from '../../storage/storage.js';

// ============================================================================
// RECIPE VALIDATION
// ============================================================================

/**
 * Validate a recipe object
 * @param {Object} recipe - Recipe object to validate
 * @returns {Object} Validation result with errors if any
 */
export function validateRecipe(recipe) {
    const errors = [];
    const warnings = [];

    // Required fields
    const requiredFields = ['id', 'name', 'formula', 'ingredients', 'tier', 'skillGain', 'target', 'icon', 'field', 'category'];
    for (const field of requiredFields) {
        if (!recipe[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    // Validate ID format (no spaces, lowercase with underscores)
    if (recipe.id && !/^[a-z0-9_]+$/.test(recipe.id)) {
        errors.push('ID must contain only lowercase letters, numbers, and underscores');
    }

    // Validate ingredients object
    if (recipe.ingredients) {
        if (typeof recipe.ingredients !== 'object') {
            errors.push('Ingredients must be an object');
        } else if (Object.keys(recipe.ingredients).length === 0) {
            errors.push('Recipe must have at least one ingredient');
        } else {
            for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
                if (typeof amount !== 'number' || amount <= 0) {
                    errors.push(`Ingredient ${ingredient} must have positive number amount`);
                }
                if (amount > 1000) {
                    warnings.push(`Ingredient ${ingredient} amount is very high (${amount})`);
                }
            }
        }
    }

    // Validate tier
    if (recipe.tier !== undefined) {
        if (recipe.tier < 1 || recipe.tier > 10) {
            errors.push('Tier must be between 1 and 10');
        }
    }

    // Validate skillGain
    if (recipe.skillGain !== undefined) {
        if (recipe.skillGain < 1) {
            errors.push('Skill gain must be at least 1');
        }
        if (recipe.skillGain > 100) {
            warnings.push(`Skill gain is very high (${recipe.skillGain})`);
        }
    }

    // Validate target (crafts to master)
    if (recipe.target !== undefined) {
        if (recipe.target < 10) {
            warnings.push(`Target mastery is very low (${recipe.target})`);
        }
        if (recipe.target > 10000) {
            warnings.push(`Target mastery is very high (${recipe.target})`);
        }
    }

    // Validate unlocksAt
    if (recipe.unlocksAt !== undefined) {
        if (recipe.unlocksAt < 0) {
            errors.push('Unlocks at cannot be negative');
        }
    }

    // Validate value
    if (recipe.value !== undefined) {
        if (recipe.value < 0) {
            errors.push('Value cannot be negative');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validate multiple recipes
 * @param {Object} recipesByCategory - Recipes grouped by category
 * @returns {Object} Validation results for all recipes
 */
export function validateAllRecipes(recipesByCategory) {
    const results = {
        total: 0,
        valid: 0,
        invalid: 0,
        errors: {},
        warnings: {},
        byField: {}
    };

    for (const [category, recipes] of Object.entries(recipesByCategory)) {
        results.byField[category] = {
            total: recipes.length,
            valid: 0,
            invalid: 0
        };

        for (const recipe of recipes) {
            results.total++;
            const validation = validateRecipe(recipe);
            
            if (validation.valid) {
                results.valid++;
                results.byField[category].valid++;
            } else {
                results.invalid++;
                results.byField[category].invalid++;
                results.errors[recipe.id] = validation.errors;
            }

            if (validation.warnings.length > 0) {
                results.warnings[recipe.id] = validation.warnings;
            }
        }
    }

    return results;
}

// ============================================================================
// CRAFTING ELIGIBILITY
// ============================================================================

/**
 * Check if player can craft a recipe
 * @param {string} playerId - Player ID
 * @param {string} recipeId - Recipe ID
 * @param {number} count - Number to craft
 * @returns {Promise<Object>} Eligibility result
 */
export async function canCraft(playerId, recipeId, count = 1) {
    const result = {
        can: false,
        reasons: [],
        details: {}
    };

    // Get recipe
    const recipe = getRecipeById(recipeId);
    if (!recipe) {
        result.reasons.push('Recipe not found');
        return result;
    }

    result.details.recipe = {
        id: recipe.id,
        name: recipe.name,
        field: recipe.field,
        tier: recipe.tier
    };

    // Check if recipe is unlocked
    const isUnlocked = await checkUnlock(playerId, recipe.field, recipeId);
    if (!isUnlocked) {
        // Fallback: check by total crafts
        const fieldProgress = await getFieldProgress(playerId, recipe.field);
        const totalCrafts = Object.values(fieldProgress).reduce((a, b) => a + b, 0);
        
        if (totalCrafts < recipe.unlocksAt) {
            result.reasons.push(`Recipe unlocks at ${recipe.unlocksAt} total crafts in ${recipe.field}`);
            result.details.requiredCrafts = recipe.unlocksAt;
            result.details.currentCrafts = totalCrafts;
        } else {
            // Unlocked but not in unlock list (will be added later)
            result.details.needsUnlockRecord = true;
        }
    }

    // Check ingredients
    const ingredientCheck = await checkIngredients(playerId, recipe, count);
    if (!ingredientCheck.hasIngredients) {
        result.reasons.push('Insufficient ingredients');
        result.details.missingIngredients = ingredientCheck.missing;
    }
    result.details.ingredients = ingredientCheck;

    // Check storage space (if applicable)
    const spaceCheck = await checkStorageSpace(playerId, recipe, count);
    if (!spaceCheck.hasSpace) {
        result.reasons.push('Insufficient cargo space');
        result.details.spaceRequired = spaceCheck.spaceRequired;
        result.details.spaceAvailable = spaceCheck.spaceAvailable;
    }

    // Final determination
    result.can = result.reasons.length === 0;
    return result;
}

/**
 * Check if player has enough ingredients
 * @param {string} playerId - Player ID
 * @param {Object} recipe - Recipe object
 * @param {number} count - Number to craft
 * @returns {Promise<Object>} Ingredient check result
 */
export async function checkIngredients(playerId, recipe, count = 1) {
    const result = {
        hasIngredients: true,
        required: {},
        available: {},
        missing: {}
    };

    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        const required = amount * count;
        result.required[ingredient] = required;
        
        const available = await getItemCount(playerId, ingredient);
        result.available[ingredient] = available;

        if (available < required) {
            result.hasIngredients = false;
            result.missing[ingredient] = {
                required,
                available,
                short: required - available
            };
        }
    }

    return result;
}

/**
 * Check if player has enough storage space
 * @param {string} playerId - Player ID
 * @param {Object} recipe - Recipe object
 * @param {number} count - Number to craft
 * @returns {Promise<Object>} Space check result
 */
export async function checkStorageSpace(playerId, recipe, count = 1) {
    // This is a placeholder - implement based on your cargo system
    return {
        hasSpace: true,
        spaceRequired: 0,
        spaceAvailable: Infinity
    };
}

/**
 * Check if player meets tier requirements
 * @param {Object} recipe - Recipe object
 * @param {number} playerTier - Player's highest unlocked tier
 * @returns {boolean} True if player meets tier requirement
 */
export function meetsTierRequirement(recipe, playerTier) {
    return playerTier >= recipe.tier;
}

/**
 * Check if player meets skill requirements (for ships/equipment)
 * @param {Object} requirements - Skill requirements object
 * @param {Object} playerSkills - Player's skill levels
 * @returns {Object} Skill check result
 */
export function checkSkillRequirements(requirements, playerSkills) {
    const result = {
        met: true,
        requirements: {},
        current: {},
        missing: {}
    };

    for (const [skill, required] of Object.entries(requirements)) {
        const current = playerSkills[skill] || 0;
        result.requirements[skill] = required;
        result.current[skill] = current;

        if (current < required) {
            result.met = false;
            result.missing[skill] = {
                required,
                current,
                short: required - current
            };
        }
    }

    return result;
}

// ============================================================================
// INGREDIENT UTILITIES
// ============================================================================

/**
 * Calculate total ingredients needed for multiple crafts
 * @param {Object} recipe - Recipe object
 * @param {number} count - Number to craft
 * @returns {Object} Total ingredients needed
 */
export function calculateTotalIngredients(recipe, count = 1) {
    const total = {};
    
    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        total[ingredient] = amount * count;
    }
    
    return total;
}

/**
 * Check if an item is a base element (not crafted)
 * @param {string} itemId - Item ID
 * @returns {Promise<boolean>} True if base element
 */
export async function isBaseElement(itemId) {
    // Check if it's a recipe (crafted)
    const recipe = getRecipeById(itemId);
    if (recipe) return false;
    
    // Check if it's in element database (implement based on your element list)
    const baseElements = [
        'Hydrogen', 'Helium', 'Carbon', 'Nitrogen', 'Oxygen', 'Sodium',
        'Magnesium', 'Aluminum', 'Silicon', 'Iron', 'Copper', 'Tin',
        'Zinc', 'Lead', 'Nickel', 'Titanium', 'Chromium', 'Manganese',
        'Cobalt', 'Tungsten', 'Vanadium', 'Molybdenum', 'Gold', 'Silver',
        'Platinum', 'Uranium', 'Thorium'
    ];
    
    return baseElements.includes(itemId);
}

/**
 * Get all base elements needed for a recipe (recursive)
 * @param {string} recipeId - Recipe ID
 * @param {number} count - Number to craft
 * @param {Object} cache - Cache for visited recipes
 * @returns {Promise<Object>} Base elements required
 */
export async function getBaseElementRequirements(recipeId, count = 1, cache = {}) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return {};

    const baseElements = {};

    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        const isBase = await isBaseElement(ingredient);
        
        if (isBase) {
            baseElements[ingredient] = (baseElements[ingredient] || 0) + (amount * count);
        } else if (!cache[ingredient]) {
            cache[ingredient] = true;
            const subRequirements = await getBaseElementRequirements(ingredient, amount * count, cache);
            for (const [subIngredient, subAmount] of Object.entries(subRequirements)) {
                baseElements[subIngredient] = (baseElements[subIngredient] || 0) + subAmount;
            }
            delete cache[ingredient];
        }
    }

    return baseElements;
}

// ============================================================================
// QUANTITY VALIDATION
// ============================================================================

/**
 * Calculate maximum craftable quantity based on ingredients
 * @param {string} playerId - Player ID
 * @param {Object} recipe - Recipe object
 * @returns {Promise<number>} Max craftable quantity
 */
export async function getMaxCraftable(playerId, recipe) {
    let maxCraft = Infinity;

    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        const available = await getItemCount(playerId, ingredient);
        const possible = Math.floor(available / amount);
        maxCraft = Math.min(maxCraft, possible);
    }

    return maxCraft;
}

/**
 * Validate craft quantity
 * @param {number} quantity - Desired quantity
 * @param {number} maxCraft - Maximum craftable
 * @returns {Object} Validation result
 */
export function validateQuantity(quantity, maxCraft) {
    if (quantity < 1) {
        return {
            valid: false,
            reason: 'Quantity must be at least 1'
        };
    }

    if (quantity > maxCraft) {
        return {
            valid: false,
            reason: `Only ${maxCraft} can be crafted with current ingredients`,
            maxCraft
        };
    }

    if (quantity > 99) {
        return {
            valid: false,
            reason: 'Maximum batch size is 99'
        };
    }

    return {
        valid: true,
        quantity
    };
}

// ============================================================================
// RECIPE PROGRESSION VALIDATION
// ============================================================================

/**
 * Check if recipe should be unlocked
 * @param {Object} recipe - Recipe object
 * @param {number} totalCrafts - Total crafts in field
 * @returns {boolean} True if should be unlocked
 */
export function shouldBeUnlocked(recipe, totalCrafts) {
    return totalCrafts >= recipe.unlocksAt;
}

/**
 * Get recipes that should be unlocked but aren't
 * @param {Array} recipes - Array of recipe objects
 * @param {number} totalCrafts - Total crafts in field
 * @param {Array} unlockedIds - Array of unlocked recipe IDs
 * @returns {Array} Recipes that should be unlocked
 */
export function getMissingUnlocks(recipes, totalCrafts, unlockedIds) {
    return recipes.filter(recipe => 
        shouldBeUnlocked(recipe, totalCrafts) && 
        !unlockedIds.includes(recipe.id)
    );
}

/**
 * Validate recipe tree for circular dependencies
 * @param {string} recipeId - Recipe ID to check
 * @param {Object} visited - Set of visited recipes
 * @param {Array} path - Current dependency path
 * @returns {Object} Validation result
 */
export function validateCircularDependency(recipeId, visited = {}, path = []) {
    if (visited[recipeId]) {
        return {
            hasCycle: true,
            cycle: [...path, recipeId]
        };
    }

    const recipe = getRecipeById(recipeId);
    if (!recipe) {
        return {
            hasCycle: false,
            missing: recipeId
        };
    }

    visited[recipeId] = true;
    path.push(recipeId);

    for (const ingredient of Object.keys(recipe.ingredients)) {
        const ingredientRecipe = getRecipeById(ingredient.toLowerCase().replace(/ /g, '_'));
        if (ingredientRecipe) {
            const result = validateCircularDependency(ingredientRecipe.id, visited, path);
            if (result.hasCycle) {
                return result;
            }
        }
    }

    path.pop();
    return { hasCycle: false };
}

// ============================================================================
// FORMATTING & DISPLAY
// ============================================================================

/**
 * Format ingredient list for display
 * @param {Object} ingredients - Ingredients object
 * @param {Object} available - Available amounts (optional)
 * @returns {string} Formatted ingredient string
 */
export function formatIngredientList(ingredients, available = null) {
    return Object.entries(ingredients)
        .map(([name, amount]) => {
            if (available && available[name] !== undefined) {
                const has = available[name] >= amount;
                return `${has ? '✅' : '❌'} ${name}: ${amount}`;
            }
            return `${name}: ${amount}`;
        })
        .join(', ');
}

/**
 * Get color class based on ingredient availability
 * @param {number} available - Available amount
 * @param {number} required - Required amount
 * @returns {string} CSS class name
 */
export function getIngredientColorClass(available, required) {
    if (available >= required) return 'text-success';
    if (available === 0) return 'text-danger';
    if (available < required) return 'text-warning';
    return '';
}

/**
 * Format missing ingredients message
 * @param {Object} missing - Missing ingredients object
 * @returns {string} Formatted message
 */
export function formatMissingIngredients(missing) {
    const items = Object.entries(missing)
        .map(([name, data]) => `${name} (need ${data.required}, have ${data.available})`)
        .join(', ');
    
    return `Missing: ${items}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    // Recipe validation
    validateRecipe,
    validateAllRecipes,
    
    // Crafting eligibility
    canCraft,
    checkIngredients,
    checkStorageSpace,
    meetsTierRequirement,
    checkSkillRequirements,
    
    // Ingredient utilities
    calculateTotalIngredients,
    isBaseElement,
    getBaseElementRequirements,
    
    // Quantity validation
    getMaxCraftable,
    validateQuantity,
    
    // Recipe progression
    shouldBeUnlocked,
    getMissingUnlocks,
    validateCircularDependency,
    
    // Formatting
    formatIngredientList,
    getIngredientColorClass,
    formatMissingIngredients
};

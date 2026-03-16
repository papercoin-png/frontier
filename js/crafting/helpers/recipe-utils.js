// js/crafting/helpers/recipe-utils.js
// Shared utility functions for recipe handling across all fields

import { RECIPE_DATABASE, getRecipeById as getRecipeFromIndex } from '../recipe-index.js';

// ============================================================================
// RECIPE LOOKUP & FILTERING
// ============================================================================

/**
 * Get recipe by ID (wrapper with error handling)
 * @param {string} recipeId - Recipe ID
 * @returns {Object|null} Recipe object or null
 */
export function getRecipeById(recipeId) {
    try {
        return getRecipeFromIndex(recipeId);
    } catch (error) {
        console.error(`Error getting recipe by ID ${recipeId}:`, error);
        return null;
    }
}

/**
 * Get all recipes for a specific field
 * @param {string} field - Field name
 * @returns {Object} Recipes by category
 */
export function getRecipesByField(field) {
    try {
        return RECIPE_DATABASE[field] || {};
    } catch (error) {
        console.error(`Error getting recipes for field ${field}:`, error);
        return {};
    }
}

/**
 * Get all recipes of a specific tier
 * @param {number} tier - Tier number (1-10)
 * @returns {Array} Array of recipes
 */
export function getRecipesByTier(tier) {
    const results = [];
    
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            const filtered = RECIPE_DATABASE[field][category].filter(r => r.tier === tier);
            results.push(...filtered.map(r => ({
                ...r,
                field,
                category
            })));
        }
    }
    
    return results;
}

/**
 * Get recipes by category across all fields
 * @param {string} category - Category name
 * @returns {Array} Array of recipes
 */
export function getRecipesByCategory(category) {
    const results = [];
    
    for (const field in RECIPE_DATABASE) {
        if (RECIPE_DATABASE[field][category]) {
            results.push(...RECIPE_DATABASE[field][category].map(r => ({
                ...r,
                field,
                category
            })));
        }
    }
    
    return results;
}

/**
 * Search recipes by name, formula, or ID
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Array} Matching recipes
 */
export function searchRecipes(query, options = {}) {
    const {
        field = null,
        tier = null,
        category = null,
        exact = false,
        caseSensitive = false
    } = options;
    
    const lowerQuery = caseSensitive ? query : query.toLowerCase();
    const results = [];
    
    for (const f in RECIPE_DATABASE) {
        // Filter by field
        if (field && f !== field) continue;
        
        for (const cat in RECIPE_DATABASE[f]) {
            // Filter by category
            if (category && cat !== category) continue;
            
            for (const recipe of RECIPE_DATABASE[f][cat]) {
                // Filter by tier
                if (tier && recipe.tier !== tier) continue;
                
                const name = caseSensitive ? recipe.name : recipe.name.toLowerCase();
                const formula = caseSensitive ? recipe.formula : recipe.formula.toLowerCase();
                const id = caseSensitive ? recipe.id : recipe.id.toLowerCase();
                
                let match = false;
                
                if (exact) {
                    match = name === lowerQuery || 
                            formula === lowerQuery || 
                            id === lowerQuery;
                } else {
                    match = name.includes(lowerQuery) || 
                            formula.includes(lowerQuery) || 
                            id.includes(lowerQuery);
                }
                
                if (match) {
                    results.push({
                        ...recipe,
                        field: f,
                        category: cat
                    });
                }
            }
        }
    }
    
    return results;
}

/**
 * Get recipes that use a specific ingredient
 * @param {string} ingredient - Ingredient name
 * @returns {Array} Recipes using the ingredient
 */
export function getRecipesUsingIngredient(ingredient) {
    const results = [];
    
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            for (const recipe of RECIPE_DATABASE[field][category]) {
                if (recipe.ingredients[ingredient]) {
                    results.push({
                        ...recipe,
                        field,
                        category,
                        amount: recipe.ingredients[ingredient]
                    });
                }
            }
        }
    }
    
    return results;
}

/**
 * Get recipes that produce a specific item
 * @param {string} itemId - Item ID (usually recipe ID)
 * @returns {Object|null} Recipe that produces this item
 */
export function getRecipeThatProduces(itemId) {
    // Remove quality suffix if present (e.g., "steel_high" -> "steel")
    const baseId = itemId.split('_')[0];
    return getRecipeById(baseId);
}

// ============================================================================
// RECIPE VALIDATION
// ============================================================================

/**
 * Validate recipe structure
 * @param {Object} recipe - Recipe object
 * @returns {Object} Validation result
 */
export function validateRecipe(recipe) {
    const required = ['id', 'name', 'formula', 'ingredients', 'tier', 'skillGain', 'target', 'icon'];
    const missing = [];
    
    for (const field of required) {
        if (!recipe[field]) {
            missing.push(field);
        }
    }
    
    if (missing.length > 0) {
        return {
            valid: false,
            errors: [`Missing required fields: ${missing.join(', ')}`]
        };
    }
    
    // Validate ingredients
    if (typeof recipe.ingredients !== 'object' || Object.keys(recipe.ingredients).length === 0) {
        return {
            valid: false,
            errors: ['Recipe must have at least one ingredient']
        };
    }
    
    // Validate ingredient amounts are positive
    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        if (amount <= 0) {
            return {
                valid: false,
                errors: [`Ingredient ${ingredient} must have positive amount`]
            };
        }
    }
    
    // Validate tier
    if (recipe.tier < 1 || recipe.tier > 10) {
        return {
            valid: false,
            errors: ['Tier must be between 1 and 10']
        };
    }
    
    return { valid: true };
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
 * Check if recipe is unlocked based on total crafts
 * @param {Object} recipe - Recipe object
 * @param {number} totalCrafts - Total crafts in this field
 * @returns {boolean} True if unlocked
 */
export function isRecipeUnlocked(recipe, totalCrafts) {
    return totalCrafts >= recipe.unlocksAt;
}

// ============================================================================
// MATERIAL CALCULATIONS
// ============================================================================

/**
 * Calculate total materials needed for multiple crafts
 * @param {Object} recipe - Recipe object
 * @param {number} count - Number of crafts
 * @returns {Object} Material requirements
 */
export function calculateMaterialRequirements(recipe, count = 1) {
    const requirements = {};
    
    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        requirements[ingredient] = amount * count;
    }
    
    return requirements;
}

/**
 * Calculate total base elements needed (recursive)
 * @param {Object} recipe - Recipe object
 * @param {number} count - Number of crafts
 * @param {Object} recipeCache - Cache for recursive lookups
 * @returns {Object} Base element requirements
 */
export function calculateBaseElementRequirements(recipe, count = 1, recipeCache = {}) {
    const baseElements = {};
    
    function addRequirements(recipe, multiplier = 1) {
        for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
            const subRecipe = getRecipeById(ingredient.toLowerCase().replace(/ /g, '_'));
            
            if (subRecipe && !recipeCache[ingredient]) {
                // Avoid infinite recursion
                recipeCache[ingredient] = true;
                addRequirements(subRecipe, multiplier * amount);
                delete recipeCache[ingredient];
            } else {
                // Base element
                baseElements[ingredient] = (baseElements[ingredient] || 0) + (amount * multiplier);
            }
        }
    }
    
    addRequirements(recipe, count);
    return baseElements;
}

/**
 * Calculate total value of crafted items
 * @param {Object} recipe - Recipe object
 * @param {number} count - Number of crafts
 * @param {number} qualityMultiplier - Quality multiplier (1.0 = standard)
 * @returns {number} Total value
 */
export function calculateCraftValue(recipe, count = 1, qualityMultiplier = 1.0) {
    return (recipe.value || 0) * count * qualityMultiplier;
}

/**
 * Calculate skill gain with multipliers
 * @param {Object} recipe - Recipe object
 * @param {number} count - Number of crafts
 * @param {number} masteryMultiplier - Mastery multiplier
 * @param {number} qualityMultiplier - Quality multiplier
 * @returns {number} Total skill gain
 */
export function calculateSkillGain(recipe, count = 1, masteryMultiplier = 1.0, qualityMultiplier = 1.0) {
    return Math.round(recipe.skillGain * count * masteryMultiplier * qualityMultiplier);
}

// ============================================================================
// RECIPE SORTING & GROUPING
// ============================================================================

/**
 * Sort recipes by various criteria
 * @param {Array} recipes - Array of recipes
 * @param {string} sortBy - Sort criteria (tier, name, value, skillGain)
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted recipes
 */
export function sortRecipes(recipes, sortBy = 'tier', order = 'asc') {
    const sorted = [...recipes];
    
    sorted.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
    
    return sorted;
}

/**
 * Group recipes by field
 * @param {Array} recipes - Array of recipes with field property
 * @returns {Object} Recipes grouped by field
 */
export function groupRecipesByField(recipes) {
    const grouped = {};
    
    for (const recipe of recipes) {
        const field = recipe.field || 'unknown';
        if (!grouped[field]) {
            grouped[field] = [];
        }
        grouped[field].push(recipe);
    }
    
    return grouped;
}

/**
 * Group recipes by category
 * @param {Array} recipes - Array of recipes
 * @returns {Object} Recipes grouped by category
 */
export function groupRecipesByCategory(recipes) {
    const grouped = {};
    
    for (const recipe of recipes) {
        const category = recipe.category || 'Uncategorized';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(recipe);
    }
    
    return grouped;
}

/**
 * Group recipes by tier
 * @param {Array} recipes - Array of recipes
 * @returns {Object} Recipes grouped by tier
 */
export function groupRecipesByTier(recipes) {
    const grouped = {};
    
    for (let i = 1; i <= 10; i++) {
        grouped[i] = [];
    }
    
    for (const recipe of recipes) {
        const tier = recipe.tier || 1;
        if (grouped[tier]) {
            grouped[tier].push(recipe);
        }
    }
    
    return grouped;
}

// ============================================================================
// RECIPE STATISTICS
// ============================================================================

/**
 * Get recipe statistics
 * @returns {Object} Recipe statistics
 */
export function getRecipeStatistics() {
    const stats = {
        total: 0,
        byField: {},
        byTier: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
        byCategory: {},
        highestValue: null,
        lowestValue: null,
        avgSkillGain: 0
    };
    
    let totalSkillGain = 0;
    let highestValue = { value: 0, recipe: null };
    let lowestValue = { value: Infinity, recipe: null };
    
    for (const field in RECIPE_DATABASE) {
        stats.byField[field] = 0;
        
        for (const category in RECIPE_DATABASE[field]) {
            const recipes = RECIPE_DATABASE[field][category];
            const count = recipes.length;
            
            stats.total += count;
            stats.byField[field] += count;
            
            if (!stats.byCategory[category]) {
                stats.byCategory[category] = 0;
            }
            stats.byCategory[category] += count;
            
            for (const recipe of recipes) {
                // Count by tier
                stats.byTier[recipe.tier] = (stats.byTier[recipe.tier] || 0) + 1;
                
                // Sum skill gain for average
                totalSkillGain += recipe.skillGain;
                
                // Track highest/lowest value
                const value = recipe.value || 0;
                if (value > highestValue.value) {
                    highestValue = { value, recipe: recipe.name };
                }
                if (value < lowestValue.value && value > 0) {
                    lowestValue = { value, recipe: recipe.name };
                }
            }
        }
    }
    
    stats.avgSkillGain = stats.total > 0 ? Math.round(totalSkillGain / stats.total) : 0;
    stats.highestValue = highestValue.recipe ? highestValue : null;
    stats.lowestValue = lowestValue.recipe ? lowestValue : null;
    
    return stats;
}

/**
 * Get recipe tree for visualization
 * @param {string} rootRecipeId - Optional root recipe ID
 * @param {number} depth - Current depth (for recursion)
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Object} Recipe tree
 */
export function getRecipeTree(rootRecipeId = null, depth = 0, maxDepth = 5) {
    if (depth > maxDepth) return null;
    
    if (rootRecipeId) {
        // Build tree from specific root
        const recipe = getRecipeById(rootRecipeId);
        if (!recipe) return null;
        
        const tree = {
            id: recipe.id,
            name: recipe.name,
            field: findFieldForRecipe(recipe.id),
            category: findCategoryForRecipe(recipe.id),
            tier: recipe.tier,
            icon: recipe.icon,
            children: []
        };
        
        for (const ingredient of Object.keys(recipe.ingredients)) {
            const childRecipe = getRecipeById(ingredient.toLowerCase().replace(/ /g, '_'));
            if (childRecipe) {
                const childTree = getRecipeTree(childRecipe.id, depth + 1, maxDepth);
                if (childTree) {
                    tree.children.push(childTree);
                }
            }
        }
        
        return tree;
    } else {
        // Build full tree by field
        const tree = {};
        
        for (const field in RECIPE_DATABASE) {
            tree[field] = {};
            for (const category in RECIPE_DATABASE[field]) {
                tree[field][category] = RECIPE_DATABASE[field][category].map(recipe => ({
                    id: recipe.id,
                    name: recipe.name,
                    tier: recipe.tier,
                    icon: recipe.icon,
                    dependencies: Object.keys(recipe.ingredients)
                }));
            }
        }
        
        return tree;
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Find field for a recipe
 * @param {string} recipeId - Recipe ID
 * @returns {string|null} Field name
 */
function findFieldForRecipe(recipeId) {
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            const found = RECIPE_DATABASE[field][category].find(r => r.id === recipeId);
            if (found) return field;
        }
    }
    return null;
}

/**
 * Find category for a recipe
 * @param {string} recipeId - Recipe ID
 * @returns {string|null} Category name
 */
function findCategoryForRecipe(recipeId) {
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            const found = RECIPE_DATABASE[field][category].find(r => r.id === recipeId);
            if (found) return category;
        }
    }
    return null;
}

/**
 * Format ingredient list for display
 * @param {Object} ingredients - Ingredients object
 * @returns {string} Formatted ingredient string
 */
export function formatIngredients(ingredients) {
    return Object.entries(ingredients)
        .map(([name, amount]) => `${amount}x ${name}`)
        .join(', ');
}

/**
 * Get ingredient emoji for display
 * @param {string} ingredient - Ingredient name
 * @returns {string} Emoji
 */
export function getIngredientEmoji(ingredient) {
    const emojiMap = {
        // Elements
        'Hydrogen': '💧',
        'Helium': '🎈',
        'Carbon': '⚫',
        'Nitrogen': '🌬️',
        'Oxygen': '💨',
        'Sodium': '🧂',
        'Magnesium': '✨',
        'Aluminum': '🥫',
        'Silicon': '💻',
        'Iron': '⚙️',
        'Copper': '🔴',
        'Silver': '⚪',
        'Gold': '🟡',
        'Titanium': '🔷',
        'Uranium': '☢️',
        
        // Materials
        'Steel': '⚙️',
        'Bronze': '🏺',
        'Brass': '🔔',
        'Glass': '🥃',
        'Concrete': '🏗️',
        'Plastic': '🧴',
        'Carbon Fiber': '⚫',
        'Kevlar': '🛡️'
    };
    
    return emojiMap[ingredient] || '🔹';
}

/**
 * Get recipe difficulty color
 * @param {number} tier - Recipe tier
 * @returns {string} Color hex code
 */
export function getTierColor(tier) {
    const colors = {
        1: '#ffffff',      // White
        2: '#b0ffb0',      // Light Green
        3: '#b0b0ff',      // Light Blue
        4: '#e0b0ff',      // Purple
        5: '#ffd700',       // Gold
        6: '#ffaa4a',       // Orange
        7: '#ff6b6b',       // Red
        8: '#4affaa',       // Green
        9: '#c0a0ff',       // Lavender
        10: '#ff69b4'       // Pink
    };
    return colors[tier] || '#ffffff';
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    // Lookup
    getRecipeById,
    getRecipesByField,
    getRecipesByTier,
    getRecipesByCategory,
    searchRecipes,
    getRecipesUsingIngredient,
    getRecipeThatProduces,
    
    // Validation
    validateRecipe,
    meetsTierRequirement,
    isRecipeUnlocked,
    
    // Calculations
    calculateMaterialRequirements,
    calculateBaseElementRequirements,
    calculateCraftValue,
    calculateSkillGain,
    
    // Sorting & Grouping
    sortRecipes,
    groupRecipesByField,
    groupRecipesByCategory,
    groupRecipesByTier,
    
    // Statistics
    getRecipeStatistics,
    getRecipeTree,
    
    // Helpers
    formatIngredients,
    getIngredientEmoji,
    getTierColor
};

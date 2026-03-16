// js/crafting/recipe-index.js
// Master index that combines all field recipe files
// This file imports and exports ALL recipes from every field

// ===== IMPORT ALL FIELD RECIPES =====
import { ALCHEMY_RECIPES } from './fields/alchemy.js';
import { METALLURGY_RECIPES } from './fields/metallurgy.js';
import { MATERIALS_SCIENCE_RECIPES } from './fields/materials-science.js';
import { PHARMACEUTICALS_RECIPES } from './fields/pharmaceuticals.js';
import { TEXTILES_RECIPES } from './fields/textiles.js';
import { CONSTRUCTION_RECIPES } from './fields/construction.js';
import { AEROSPACE_RECIPES } from './fields/aerospace.js';
import { NUCLEAR_RECIPES } from './fields/nuclear.js';
import { OPTICAL_RECIPES } from './fields/optical.js';
import { MAGNETIC_RECIPES } from './fields/magnetic.js';
import { CRYOGENIC_RECIPES } from './fields/cryogenic.js';
import { POLYMERS_RECIPES } from './fields/polymers.js';

// ===== COMBINE ALL RECIPES INTO ONE MASTER DATABASE =====
export const RECIPE_DATABASE = {
    // Alchemy (existing)
    ...ALCHEMY_RECIPES,
    
    // Metallurgy (150+ recipes)
    ...METALLURGY_RECIPES,
    
    // Materials Science (100+ recipes)
    ...MATERIALS_SCIENCE_RECIPES,
    
    // Pharmaceuticals (80+ recipes)
    ...PHARMACEUTICALS_RECIPES,
    
    // Textiles (60+ recipes)
    ...TEXTILES_RECIPES,
    
    // Construction (70+ recipes)
    ...CONSTRUCTION_RECIPES,
    
    // Aerospace (50+ recipes)
    ...AEROSPACE_RECIPES,
    
    // Nuclear (40+ recipes)
    ...NUCLEAR_RECIPES,
    
    // Optical (50+ recipes)
    ...OPTICAL_RECIPES,
    
    // Magnetic (40+ recipes)
    ...MAGNETIC_RECIPES,
    
    // Cryogenic (30+ recipes)
    ...CRYOGENIC_RECIPES,
    
    // Polymers (60+ recipes)
    ...POLYMERS_RECIPES
};

// ===== HELPER: GET ALL RECIPE CATEGORIES =====
export function getAllCategories() {
    const categories = [];
    for (const field in RECIPE_DATABASE) {
        categories.push(...Object.keys(RECIPE_DATABASE[field]));
    }
    return [...new Set(categories)]; // Remove duplicates
}

// ===== HELPER: GET ALL FIELDS =====
export function getAllFields() {
    return Object.keys(RECIPE_DATABASE);
}

// ===== HELPER: GET RECIPES BY FIELD =====
export function getRecipesByField(field) {
    return RECIPE_DATABASE[field] || {};
}

// ===== HELPER: GET RECIPES BY CATEGORY =====
export function getRecipesByCategory(category) {
    const results = [];
    
    for (const field in RECIPE_DATABASE) {
        if (RECIPE_DATABASE[field][category]) {
            results.push(...RECIPE_DATABASE[field][category]);
        }
    }
    
    return results;
}

// ===== HELPER: GET RECIPES BY TIER =====
export function getRecipesByTier(tier) {
    const results = [];
    
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            const filtered = RECIPE_DATABASE[field][category].filter(r => r.tier === tier);
            results.push(...filtered);
        }
    }
    
    return results;
}

// ===== HELPER: GET RECIPE BY ID (SEARCHES ALL FIELDS) =====
export function getRecipeById(recipeId) {
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            const found = RECIPE_DATABASE[field][category].find(r => r.id === recipeId);
            if (found) return found;
        }
    }
    return null;
}

// ===== HELPER: SEARCH RECIPES BY NAME OR FORMULA =====
export function searchRecipes(query) {
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            for (const recipe of RECIPE_DATABASE[field][category]) {
                if (recipe.name.toLowerCase().includes(lowerQuery) ||
                    recipe.formula.toLowerCase().includes(lowerQuery) ||
                    recipe.id.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        ...recipe,
                        field: field,
                        category: category
                    });
                }
            }
        }
    }
    
    return results;
}

// ===== HELPER: GET RECIPES THAT USE A SPECIFIC INGREDIENT =====
export function getRecipesUsingIngredient(ingredient) {
    const results = [];
    
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            for (const recipe of RECIPE_DATABASE[field][category]) {
                if (recipe.ingredients[ingredient]) {
                    results.push({
                        ...recipe,
                        field: field,
                        category: category
                    });
                }
            }
        }
    }
    
    return results;
}

// ===== HELPER: GET RECIPES THAT UNLOCK AT A SPECIFIC MILESTONE =====
export function getRecipesUnlockedAt(crafts) {
    const results = [];
    
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            for (const recipe of RECIPE_DATABASE[field][category]) {
                if (recipe.unlocksAt === crafts) {
                    results.push({
                        ...recipe,
                        field: field,
                        category: category
                    });
                }
            }
        }
    }
    
    return results;
}

// ===== HELPER: GET TOTAL RECIPE COUNT =====
export function getTotalRecipeCount() {
    let count = 0;
    
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            count += RECIPE_DATABASE[field][category].length;
        }
    }
    
    return count;
}

// ===== HELPER: GET RECIPE COUNT BY FIELD =====
export function getRecipeCountByField() {
    const counts = {};
    
    for (const field in RECIPE_DATABASE) {
        counts[field] = 0;
        for (const category in RECIPE_DATABASE[field]) {
            counts[field] += RECIPE_DATABASE[field][category].length;
        }
    }
    
    return counts;
}

// ===== HELPER: GET RECIPE TREE FOR VISUALIZATION =====
export function getRecipeTree() {
    const tree = {};
    
    for (const field in RECIPE_DATABASE) {
        tree[field] = {};
        for (const category in RECIPE_DATABASE[field]) {
            tree[field][category] = RECIPE_DATABASE[field][category].map(recipe => ({
                id: recipe.id,
                name: recipe.name,
                tier: recipe.tier,
                field: field,
                category: category,
                dependencies: recipe.ingredients ? Object.keys(recipe.ingredients) : [],
                unlocksAt: recipe.unlocksAt,
                value: recipe.value,
                icon: recipe.icon
            }));
        }
    }
    
    return tree;
}

// ===== HELPER: GET CRAFTING CHAIN FOR A RECIPE =====
export function getCraftingChain(recipeId, depth = 0, maxDepth = 5) {
    if (depth > maxDepth) return null;
    
    const recipe = getRecipeById(recipeId);
    if (!recipe) return null;
    
    const chain = {
        id: recipe.id,
        name: recipe.name,
        field: findFieldForRecipe(recipeId),
        category: findCategoryForRecipe(recipeId),
        tier: recipe.tier,
        ingredients: {}
    };
    
    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        // Check if ingredient is itself a crafted material
        const ingredientRecipe = getRecipeById(ingredient.toLowerCase().replace(' ', '_'));
        
        if (ingredientRecipe && depth < maxDepth) {
            chain.ingredients[ingredient] = {
                amount: amount,
                recipe: getCraftingChain(ingredientRecipe.id, depth + 1, maxDepth)
            };
        } else {
            chain.ingredients[ingredient] = {
                amount: amount,
                isBase: true
            };
        }
    }
    
    return chain;
}

// ===== HELPER: FIND FIELD FOR A RECIPE =====
function findFieldForRecipe(recipeId) {
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            const found = RECIPE_DATABASE[field][category].find(r => r.id === recipeId);
            if (found) return field;
        }
    }
    return null;
}

// ===== HELPER: FIND CATEGORY FOR A RECIPE =====
function findCategoryForRecipe(recipeId) {
    for (const field in RECIPE_DATABASE) {
        for (const category in RECIPE_DATABASE[field]) {
            const found = RECIPE_DATABASE[field][category].find(r => r.id === recipeId);
            if (found) return category;
        }
    }
    return null;
}

// ===== HELPER: CALCULATE TOTAL MATERIAL COST FOR A RECIPE =====
export function calculateMaterialCost(recipeId, count = 1) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return null;
    
    const materials = {};
    
    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
        materials[ingredient] = amount * count;
    }
    
    return materials;
}

// ===== HELPER: GET ALL BASE ELEMENTS NEEDED FOR A RECIPE =====
export function getBaseElements(recipeId, count = 1) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return null;
    
    const baseElements = {};
    
    function addIngredients(ingredients, multiplier = 1) {
        for (const [ingredient, amount] of Object.entries(ingredients)) {
            const subRecipe = getRecipeById(ingredient.toLowerCase().replace(' ', '_'));
            
            if (subRecipe) {
                // Ingredient is itself a crafted material - recurse
                addIngredients(subRecipe.ingredients, multiplier * amount);
            } else {
                // Ingredient is a base element
                baseElements[ingredient] = (baseElements[ingredient] || 0) + (amount * multiplier);
            }
        }
    }
    
    addIngredients(recipe.ingredients, count);
    return baseElements;
}

// ===== EXPORT ALL =====
export default {
    RECIPE_DATABASE,
    getAllCategories,
    getAllFields,
    getRecipesByField,
    getRecipesByCategory,
    getRecipesByTier,
    getRecipeById,
    searchRecipes,
    getRecipesUsingIngredient,
    getRecipesUnlockedAt,
    getTotalRecipeCount,
    getRecipeCountByField,
    getRecipeTree,
    getCraftingChain,
    calculateMaterialCost,
    getBaseElements
};

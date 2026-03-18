// js/recipe-index.js - Central index of all crafting recipes across all fields
// Provides unified access to recipes for UI rendering, crafting, and progression

import { ALCHEMY_RECIPES, LEVEL_THRESHOLDS as ALCHEMY_THRESHOLDS } from './alchemy.js';

// ===== FIELD DEFINITIONS =====
export const FIELDS = {
    ALCHEMY: 'alchemy',
    METALLURGY: 'metallurgy',
    MATERIALS_SCIENCE: 'materials-science',
    PHARMACEUTICALS: 'pharmaceuticals',
    TEXTILES: 'textiles',
    CONSTRUCTION: 'construction',
    AEROSPACE: 'aerospace',
    NUCLEAR: 'nuclear',
    OPTICAL: 'optical',
    MAGNETIC: 'magnetic',
    CRYOGENIC: 'cryogenic',
    POLYMERS: 'polymers'
};

// ===== FIELD DISPLAY NAMES =====
export const FIELD_NAMES = {
    [FIELDS.ALCHEMY]: 'Alchemy',
    [FIELDS.METALLURGY]: 'Metallurgy',
    [FIELDS.MATERIALS_SCIENCE]: 'Materials Science',
    [FIELDS.PHARMACEUTICALS]: 'Pharmaceuticals',
    [FIELDS.TEXTILES]: 'Textiles',
    [FIELDS.CONSTRUCTION]: 'Construction',
    [FIELDS.AEROSPACE]: 'Aerospace Engineering',
    [FIELDS.NUCLEAR]: 'Nuclear Physics',
    [FIELDS.OPTICAL]: 'Optical Engineering',
    [FIELDS.MAGNETIC]: 'Magnetic Systems',
    [FIELDS.CRYOGENIC]: 'Cryogenics',
    [FIELDS.POLYMERS]: 'Polymer Chemistry'
};

// ===== FIELD ICONS =====
export const FIELD_ICONS = {
    [FIELDS.ALCHEMY]: '⚗️',
    [FIELDS.METALLURGY]: '🔨',
    [FIELDS.MATERIALS_SCIENCE]: '🔬',
    [FIELDS.PHARMACEUTICALS]: '💊',
    [FIELDS.TEXTILES]: '🧵',
    [FIELDS.CONSTRUCTION]: '🏗️',
    [FIELDS.AEROSPACE]: '🚀',
    [FIELDS.NUCLEAR]: '☢️',
    [FIELDS.OPTICAL]: '🔍',
    [FIELDS.MAGNETIC]: '🧲',
    [FIELDS.CRYOGENIC]: '❄️',
    [FIELDS.POLYMERS]: '🧪'
};

// ===== FIELD COLORS =====
export const FIELD_COLORS = {
    [FIELDS.ALCHEMY]: '#4affaa',
    [FIELDS.METALLURGY]: '#ffaa4a',
    [FIELDS.MATERIALS_SCIENCE]: '#4a8ac0',
    [FIELDS.PHARMACEUTICALS]: '#ff6b6b',
    [FIELDS.TEXTILES]: '#c0a0ff',
    [FIELDS.CONSTRUCTION]: '#8b8b8b',
    [FIELDS.AEROSPACE]: '#4ac0ff',
    [FIELDS.NUCLEAR]: '#4aff4a',
    [FIELDS.OPTICAL]: '#ff4aff',
    [FIELDS.MAGNETIC]: '#ffaa4a',
    [FIELDS.CRYOGENIC]: '#a0c0ff',
    [FIELDS.POLYMERS]: '#ffd966'
};

// ===== MASTERY THRESHOLDS (shared across fields) =====
// Using Alchemy thresholds as the standard
export const MASTERY_THRESHOLDS = ALCHEMY_THRESHOLDS;

// ===== COMBINED RECIPE INDEX =====
// This will be populated as we import more field recipe files
export const RECIPE_INDEX = {
    [FIELDS.ALCHEMY]: ALCHEMY_RECIPES,
    [FIELDS.METALLURGY]: {},
    [FIELDS.MATERIALS_SCIENCE]: {},
    [FIELDS.PHARMACEUTICALS]: {},
    [FIELDS.TEXTILES]: {},
    [FIELDS.CONSTRUCTION]: {},
    [FIELDS.AEROSPACE]: {},
    [FIELDS.NUCLEAR]: {},
    [FIELDS.OPTICAL]: {},
    [FIELDS.MAGNETIC]: {},
    [FIELDS.CRYOGENIC]: {},
    [FIELDS.POLYMERS]: {}
};

// ===== GET ALL RECIPES FLAT =====
export function getAllRecipes() {
    const allRecipes = [];
    
    for (const [field, categories] of Object.entries(RECIPE_INDEX)) {
        for (const [category, recipes] of Object.entries(categories)) {
            recipes.forEach(recipe => {
                allRecipes.push({
                    ...recipe,
                    field,
                    category
                });
            });
        }
    }
    
    return allRecipes;
}

// ===== GET RECIPES BY FIELD =====
export function getRecipesByField(field) {
    return RECIPE_INDEX[field] || {};
}

// ===== GET RECIPE BY ID =====
export function getRecipeById(recipeId) {
    // Search through all fields
    for (const [field, categories] of Object.entries(RECIPE_INDEX)) {
        for (const [category, recipes] of Object.entries(categories)) {
            const found = recipes.find(r => r.id === recipeId);
            if (found) {
                return {
                    ...found,
                    field,
                    category
                };
            }
        }
    }
    return null;
}

// ===== GET RECIPES BY TIER =====
export function getRecipesByTier(tier) {
    const recipes = [];
    
    for (const [field, categories] of Object.entries(RECIPE_INDEX)) {
        for (const [category, categoryRecipes] of Object.entries(categories)) {
            categoryRecipes.forEach(recipe => {
                if (recipe.tier === tier) {
                    recipes.push({
                        ...recipe,
                        field,
                        category
                    });
                }
            });
        }
    }
    
    return recipes;
}

// ===== GET RECIPES BY CATEGORY =====
export function getRecipesByCategory(field, category) {
    return RECIPE_INDEX[field]?.[category] || [];
}

// ===== GET ALL CATEGORIES =====
export function getAllCategories() {
    const categories = [];
    
    for (const [field, fieldCategories] of Object.entries(RECIPE_INDEX)) {
        for (const category of Object.keys(fieldCategories)) {
            categories.push({
                field,
                category,
                displayName: category,
                icon: FIELD_ICONS[field],
                color: FIELD_COLORS[field]
            });
        }
    }
    
    return categories;
}

// ===== GET CATEGORIES BY FIELD =====
export function getCategoriesByField(field) {
    return Object.keys(RECIPE_INDEX[field] || {});
}

// ===== SEARCH RECIPES =====
export function searchRecipes(query) {
    if (!query) return getAllRecipes();
    
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    for (const [field, categories] of Object.entries(RECIPE_INDEX)) {
        for (const [category, recipes] of Object.entries(categories)) {
            recipes.forEach(recipe => {
                if (recipe.name.toLowerCase().includes(lowerQuery) ||
                    recipe.description?.toLowerCase().includes(lowerQuery) ||
                    recipe.formula?.toLowerCase().includes(lowerQuery) ||
                    category.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        ...recipe,
                        field,
                        category
                    });
                }
            });
        }
    }
    
    return results;
}

// ===== GET UNLOCKABLE RECIPES =====
export function getUnlockableRecipes(totalCrafts) {
    const recipes = [];
    
    for (const [field, categories] of Object.entries(RECIPE_INDEX)) {
        for (const [category, categoryRecipes] of Object.entries(categories)) {
            categoryRecipes.forEach(recipe => {
                if (recipe.unlocksAt > totalCrafts) {
                    recipes.push({
                        ...recipe,
                        field,
                        category,
                        craftsNeeded: recipe.unlocksAt - totalCrafts
                    });
                }
            });
        }
    }
    
    return recipes.sort((a, b) => a.craftsNeeded - b.craftsNeeded);
}

// ===== GET LOCKED RECIPES =====
export function getLockedRecipes(totalCrafts) {
    const recipes = [];
    
    for (const [field, categories] of Object.entries(RECIPE_INDEX)) {
        for (const [category, categoryRecipes] of Object.entries(categories)) {
            categoryRecipes.forEach(recipe => {
                if (recipe.unlocksAt > totalCrafts) {
                    recipes.push({
                        ...recipe,
                        field,
                        category,
                        craftsNeeded: recipe.unlocksAt - totalCrafts
                    });
                }
            });
        }
    }
    
    return recipes;
}

// ===== GET UNLOCKED RECIPES =====
export function getUnlockedRecipes(totalCrafts) {
    const recipes = [];
    
    for (const [field, categories] of Object.entries(RECIPE_INDEX)) {
        for (const [category, categoryRecipes] of Object.entries(categories)) {
            categoryRecipes.forEach(recipe => {
                if (recipe.unlocksAt <= totalCrafts || recipe.unlocksAt <= 100) {
                    recipes.push({
                        ...recipe,
                        field,
                        category
                    });
                }
            });
        }
    }
    
    return recipes;
}

// ===== GET RECIPE COUNTS =====
export function getRecipeCounts() {
    const counts = {
        total: 0,
        byField: {},
        byTier: {}
    };
    
    for (const [field, categories] of Object.entries(RECIPE_INDEX)) {
        let fieldCount = 0;
        
        for (const [category, recipes] of Object.entries(categories)) {
            fieldCount += recipes.length;
            counts.total += recipes.length;
            
            recipes.forEach(recipe => {
                const tier = recipe.tier || 1;
                counts.byTier[tier] = (counts.byTier[tier] || 0) + 1;
            });
        }
        
        counts.byField[field] = fieldCount;
    }
    
    return counts;
}

// ===== GET HIGHEST TIER AVAILABLE =====
export function getHighestTier(totalCrafts) {
    let highestTier = 1;
    
    for (const [field, categories] of Object.entries(RECIPE_INDEX)) {
        for (const [category, recipes] of Object.entries(categories)) {
            recipes.forEach(recipe => {
                if (recipe.unlocksAt <= totalCrafts && recipe.tier > highestTier) {
                    highestTier = recipe.tier;
                }
            });
        }
    }
    
    return highestTier;
}

// ===== GET NEXT TIER UNLOCK =====
export function getNextTierUnlock(totalCrafts) {
    let nextTier = null;
    let minCraftsNeeded = Infinity;
    
    for (const [field, categories] of Object.entries(RECIPE_INDEX)) {
        for (const [category, recipes] of Object.entries(categories)) {
            recipes.forEach(recipe => {
                if (recipe.unlocksAt > totalCrafts && recipe.unlocksAt < minCraftsNeeded) {
                    minCraftsNeeded = recipe.unlocksAt;
                    nextTier = recipe.tier;
                }
            });
        }
    }
    
    if (nextTier) {
        return {
            tier: nextTier,
            craftsNeeded: minCraftsNeeded - totalCrafts
        };
    }
    
    return null;
}

// ===== GET PROGRESS TO NEXT TIER =====
export function getProgressToNextTier(totalCrafts) {
    const nextTier = getNextTierUnlock(totalCrafts);
    
    if (!nextTier) {
        return {
            hasNext: false,
            progress: 100,
            craftsNeeded: 0,
            nextTier: null
        };
    }
    
    // Find the threshold for this tier
    let currentThreshold = 0;
    let nextThreshold = nextTier.craftsNeeded + totalCrafts;
    
    // Find the current tier threshold
    for (let i = MASTERY_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalCrafts >= MASTERY_THRESHOLDS[i].threshold) {
            currentThreshold = MASTERY_THRESHOLDS[i].threshold;
            break;
        }
    }
    
    const progress = ((totalCrafts - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    
    return {
        hasNext: true,
        progress: Math.min(100, Math.max(0, progress)),
        craftsNeeded: nextTier.craftsNeeded,
        nextTier: nextTier.tier
    };
}

// ===== GET MASTERY LEVEL FROM PROGRESS =====
export function getMasteryLevelFromProgress(progress) {
    for (let i = MASTERY_THRESHOLDS.length - 1; i >= 0; i--) {
        if (progress >= MASTERY_THRESHOLDS[i].threshold) {
            return MASTERY_THRESHOLDS[i];
        }
    }
    return MASTERY_THRESHOLDS[0];
}

// ===== GET MASTERY PROGRESS =====
export function getMasteryProgress(progress) {
    for (let i = 0; i < MASTERY_THRESHOLDS.length - 1; i++) {
        const current = MASTERY_THRESHOLDS[i];
        const next = MASTERY_THRESHOLDS[i + 1];
        
        if (progress >= current.threshold && progress < next.threshold) {
            const totalNeeded = next.threshold - current.threshold;
            const currentProgress = progress - current.threshold;
            return {
                currentLevel: current.name,
                nextLevel: next.name,
                progress: currentProgress,
                totalNeeded: totalNeeded,
                percentage: (currentProgress / totalNeeded) * 100,
                multiplier: current.multiplier
            };
        }
    }
    
    // At max level
    const maxLevel = MASTERY_THRESHOLDS[MASTERY_THRESHOLDS.length - 1];
    return {
        currentLevel: maxLevel.name,
        nextLevel: null,
        progress: 0,
        totalNeeded: 0,
        percentage: 100,
        multiplier: maxLevel.multiplier
    };
}

// ===== EXPORT ALL =====
export default {
    FIELDS,
    FIELD_NAMES,
    FIELD_ICONS,
    FIELD_COLORS,
    MASTERY_THRESHOLDS,
    RECIPE_INDEX,
    getAllRecipes,
    getRecipesByField,
    getRecipeById,
    getRecipesByTier,
    getRecipesByCategory,
    getAllCategories,
    getCategoriesByField,
    searchRecipes,
    getUnlockableRecipes,
    getLockedRecipes,
    getUnlockedRecipes,
    getRecipeCounts,
    getHighestTier,
    getNextTierUnlock,
    getProgressToNextTier,
    getMasteryLevelFromProgress,
    getMasteryProgress
};

// ===== GLOBAL EXPOSURE =====
window.FIELDS = FIELDS;
window.FIELD_NAMES = FIELD_NAMES;
window.FIELD_ICONS = FIELD_ICONS;
window.FIELD_COLORS = FIELD_COLORS;
window.MASTERY_THRESHOLDS = MASTERY_THRESHOLDS;
window.RECIPE_INDEX = RECIPE_INDEX;
window.getAllRecipes = getAllRecipes;
window.getRecipesByField = getRecipesByField;
window.getRecipeById = getRecipeById;
window.getRecipesByTier = getRecipesByTier;
window.getRecipesByCategory = getRecipesByCategory;
window.getAllCategories = getAllCategories;
window.searchRecipes = searchRecipes;
window.getUnlockableRecipes = getUnlockableRecipes;
window.getLockedRecipes = getLockedRecipes;
window.getUnlockedRecipes = getUnlockedRecipes;
window.getRecipeCounts = getRecipeCounts;
window.getHighestTier = getHighestTier;
window.getNextTierUnlock = getNextTierUnlock;
window.getProgressToNextTier = getProgressToNextTier;
window.getMasteryLevelFromProgress = getMasteryLevelFromProgress;
window.getMasteryProgress = getMasteryProgress;

console.log('✅ recipe-index.js loaded with alchemy recipes');

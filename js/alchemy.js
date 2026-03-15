// js/alchemy.js
// Alchemy recipes database and crafting functions

export const ALCHEMY_RECIPES = {
    'Basic Compounds': [
        { 
            id: 'water',
            name: 'Water', 
            formula: '2H + 1O → H₂O', 
            ingredients: { Hydrogen: 2, Oxygen: 1 },
            progress: 0, 
            target: 100, 
            level: 'Untrained', 
            icon: '💧',
            unlocksAt: 0
        },
        { 
            id: 'methane',
            name: 'Methane', 
            formula: '1C + 4H → CH₄', 
            ingredients: { Carbon: 1, Hydrogen: 4 },
            progress: 0, 
            target: 100, 
            level: 'Untrained', 
            icon: '🔥',
            unlocksAt: 0
        },
        { 
            id: 'ammonia',
            name: 'Ammonia', 
            formula: '1N + 3H → NH₃', 
            ingredients: { Nitrogen: 1, Hydrogen: 3 },
            progress: 0, 
            target: 100, 
            level: 'Untrained', 
            icon: '⚗️',
            unlocksAt: 0
        },
        { 
            id: 'hydrogen_peroxide',
            name: 'Hydrogen Peroxide', 
            formula: '2H + 2O → H₂O₂', 
            ingredients: { Hydrogen: 2, Oxygen: 2 },
            progress: 0, 
            target: 100, 
            level: 'Untrained', 
            icon: '💧',
            unlocksAt: 0
        }
    ],
    'Acids & Bases': [
        { 
            id: 'sulfuric_acid',
            name: 'Sulfuric Acid', 
            formula: '2H + 1S + 4O → H₂SO₄', 
            ingredients: { Hydrogen: 2, Sulfur: 1, Oxygen: 4 },
            progress: 0, 
            target: 100, 
            level: 'Untrained', 
            icon: '🧪',
            unlocksAt: 100 // Unlocks after 100 Basic crafts
        },
        { 
            id: 'nitric_acid',
            name: 'Nitric Acid', 
            formula: '1H + 1N + 3O → HNO₃', 
            ingredients: { Hydrogen: 1, Nitrogen: 1, Oxygen: 3 },
            progress: 0, 
            target: 100, 
            level: 'Untrained', 
            icon: '🧪',
            unlocksAt: 100
        },
        { 
            id: 'hydrochloric_acid',
            name: 'Hydrochloric Acid', 
            formula: '1H + 1Cl → HCl', 
            ingredients: { Hydrogen: 1, Chlorine: 1 },
            progress: 0, 
            target: 100, 
            level: 'Untrained', 
            icon: '🧪',
            unlocksAt: 100
        }
    ],
    'Salts & Minerals': [
        { 
            id: 'sodium_chloride',
            name: 'Sodium Chloride', 
            formula: '1Na + 1Cl → NaCl', 
            ingredients: { Sodium: 1, Chlorine: 1 },
            progress: 0, 
            target: 100, 
            level: 'Untrained', 
            icon: '🧂',
            unlocksAt: 200
        },
        { 
            id: 'calcium_carbonate',
            name: 'Calcium Carbonate', 
            formula: '1Ca + 1C + 3O → CaCO₃', 
            ingredients: { Calcium: 1, Carbon: 1, Oxygen: 3 },
            progress: 0, 
            target: 100, 
            level: 'Untrained', 
            icon: '🪨',
            unlocksAt: 200
        }
    ],
    'Advanced Compounds': [
        { 
            id: 'methanol',
            name: 'Methanol', 
            formula: '1C + 4H + 1O → CH₃OH', 
            ingredients: { Carbon: 1, Hydrogen: 4, Oxygen: 1 },
            progress: 0, 
            target: 1000, 
            level: 'Untrained', 
            icon: '🧪',
            unlocksAt: 500
        },
        { 
            id: 'ethanol',
            name: 'Ethanol', 
            formula: '2C + 6H + 1O → C₂H₅OH', 
            ingredients: { Carbon: 2, Hydrogen: 6, Oxygen: 1 },
            progress: 0, 
            target: 1000, 
            level: 'Untrained', 
            icon: '🧪',
            unlocksAt: 500
        }
    ],
    'Polymers': [
        { 
            id: 'polyethylene',
            name: 'Polyethylene', 
            formula: 'n(C₂H₄) → (C₂H₄)n', 
            ingredients: { Ethylene: 10 },
            progress: 0, 
            target: 10000, 
            level: 'Untrained', 
            icon: '🧴',
            unlocksAt: 1000
        }
    ]
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
    { name: 'Untrained', threshold: 0, multiplier: 1.0 },
    { name: 'Novice', threshold: 100, multiplier: 1.2 },
    { name: 'Apprentice', threshold: 1000, multiplier: 1.5 },
    { name: 'Journeyman', threshold: 10000, multiplier: 2.0 },
    { name: 'Expert', threshold: 100000, multiplier: 3.0 },
    { name: 'Master', threshold: 500000, multiplier: 5.0 },
    { name: 'Grand Master', threshold: 1000000, multiplier: 10.0 }
];

// Get level from progress
export function getLevelFromProgress(progress) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (progress >= LEVEL_THRESHOLDS[i].threshold) {
            return LEVEL_THRESHOLDS[i];
        }
    }
    return LEVEL_THRESHOLDS[0];
}

// Check if player has ingredients - uses proper inventory format
export function hasIngredients(inventory, ingredients) {
    for (const [element, amount] of Object.entries(ingredients)) {
        // Handle different inventory formats
        let available = 0;
        
        if (inventory[element]) {
            // Handle both { count: x } format and direct number format
            available = typeof inventory[element] === 'object' 
                ? (inventory[element].count || 0) 
                : inventory[element];
        }
        
        if (available < amount) {
            console.log(`Missing ${element}: need ${amount}, have ${available}`);
            return false;
        }
    }
    return true;
}

// Get current inventory from storage
async function getCurrentInventory() {
    try {
        // Try to use the global getCollection function
        if (typeof window.getCollection === 'function') {
            const collection = await window.getCollection();
            return collection;
        }
        
        // Fallback to localStorage
        const saved = localStorage.getItem('voidfarer_collection');
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting inventory:', error);
        return {};
    }
}

// Craft an item
export async function craftItem(recipeId, count = 1) {
    try {
        console.log(`Crafting ${count}x ${recipeId}...`);
        
        // Find recipe
        let recipe = null;
        for (const category of Object.values(ALCHEMY_RECIPES)) {
            const found = category.find(r => r.id === recipeId);
            if (found) {
                recipe = found;
                break;
            }
        }
        
        if (!recipe) return { success: false, error: 'Recipe not found' };
        
        // Get current progress from localStorage
        const alchemyProgress = JSON.parse(localStorage.getItem('voidfarer_alchemy_progress') || '{}');
        const currentProgress = alchemyProgress[recipeId] || 0;
        
        // Get current inventory using the helper function
        const inventory = await getCurrentInventory();
        
        // Calculate total ingredients needed for the batch
        const totalIngredients = {};
        for (const [element, amount] of Object.entries(recipe.ingredients)) {
            totalIngredients[element] = amount * count;
        }
        
        // Verify all ingredients available
        for (const [element, amount] of Object.entries(totalIngredients)) {
            let available = 0;
            
            if (inventory[element]) {
                available = typeof inventory[element] === 'object' 
                    ? (inventory[element].count || 0) 
                    : inventory[element];
            }
            
            if (available < amount) {
                return { 
                    success: false, 
                    error: `Not enough ${element}. Need ${amount}, have ${available}`
                };
            }
        }
        
        // Consume ingredients using removeElementFromCollection
        for (const [element, amount] of Object.entries(totalIngredients)) {
            if (typeof window.removeElementFromCollection === 'function') {
                const removeResult = await window.removeElementFromCollection(element, amount);
                if (!removeResult || !removeResult.success) {
                    console.error(`Failed to remove ${element}:`, removeResult);
                    return { success: false, error: `Failed to remove ${element} from inventory` };
                }
            } else {
                // Fallback to localStorage
                const collection = JSON.parse(localStorage.getItem('voidfarer_collection') || '{}');
                if (collection[element]) {
                    const currentCount = typeof collection[element] === 'object' 
                        ? collection[element].count 
                        : collection[element];
                    
                    const newCount = currentCount - amount;
                    
                    if (newCount <= 0) {
                        delete collection[element];
                    } else {
                        if (typeof collection[element] === 'object') {
                            collection[element].count = newCount;
                        } else {
                            collection[element] = newCount;
                        }
                    }
                    
                    localStorage.setItem('voidfarer_collection', JSON.stringify(collection));
                }
            }
        }
        
        // Update progress
        const newProgress = currentProgress + count;
        alchemyProgress[recipeId] = newProgress;
        localStorage.setItem('voidfarer_alchemy_progress', JSON.stringify(alchemyProgress));
        
        // Update total crafts count
        const totalCrafts = Object.values(alchemyProgress).reduce((sum, val) => sum + val, 0);
        localStorage.setItem('voidfarer_alchemy_total_crafts', totalCrafts.toString());
        
        // Calculate new level
        const oldLevel = getLevelFromProgress(currentProgress);
        const newLevel = getLevelFromProgress(newProgress);
        
        return {
            success: true,
            count: count,
            newProgress: newProgress,
            leveledUp: oldLevel.name !== newLevel.name,
            newLevel: newLevel.name,
            multiplier: newLevel.multiplier
        };
        
    } catch (error) {
        console.error('Error in craftItem:', error);
        return { success: false, error: error.message };
    }
}

// Load alchemy progress from storage
export function loadAlchemyProgress() {
    try {
        const saved = localStorage.getItem('voidfarer_alchemy_progress');
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error loading alchemy progress:', error);
        return {};
    }
}

// Get all recipes with progress
export function getRecipesWithProgress() {
    const progress = loadAlchemyProgress();
    const recipesWithProgress = {};
    
    for (const [category, recipes] of Object.entries(ALCHEMY_RECIPES)) {
        recipesWithProgress[category] = recipes.map(recipe => {
            const prog = progress[recipe.id] || 0;
            const level = getLevelFromProgress(prog);
            // Simple unlock logic - unlocked if progress > 0 OR it's a basic recipe (unlocksAt === 0)
            const unlocked = prog > 0 || recipe.unlocksAt === 0;
            
            return {
                ...recipe,
                progress: prog,
                level: prog === 0 ? 'Untrained' : level.name,
                multiplier: level.multiplier,
                unlocked: unlocked,
                percentComplete: Math.min(100, Math.round((prog / recipe.target) * 100))
            };
        });
    }
    
    return recipesWithProgress;
}

// Check if a recipe is unlocked
export function isRecipeUnlocked(recipeId) {
    const progress = loadAlchemyProgress();
    const prog = progress[recipeId] || 0;
    
    // Find the recipe
    for (const category of Object.values(ALCHEMY_RECIPES)) {
        const recipe = category.find(r => r.id === recipeId);
        if (recipe) {
            return prog > 0 || recipe.unlocksAt === 0;
        }
    }
    return false;
}

// Get total crafts across all recipes
export function getTotalCrafts() {
    const progress = loadAlchemyProgress();
    return Object.values(progress).reduce((sum, val) => sum + val, 0);
}

// Get recipe by ID
export function getRecipeById(recipeId) {
    for (const category of Object.values(ALCHEMY_RECIPES)) {
        const found = category.find(r => r.id === recipeId);
        if (found) return found;
    }
    return null;
}

// Calculate required materials for a given count
export function calculateRequiredMaterials(recipeId, count = 1) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return null;
    
    const materials = {};
    for (const [element, amount] of Object.entries(recipe.ingredients)) {
        materials[element] = amount * count;
    }
    return materials;
}

// Check if player can craft a specific recipe multiple times
export async function canCraftBatch(recipeId, count = 1) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return { success: false, error: 'Recipe not found' };
    
    const inventory = await getCurrentInventory();
    const required = calculateRequiredMaterials(recipeId, count);
    
    for (const [element, amount] of Object.entries(required)) {
        let available = 0;
        if (inventory[element]) {
            available = typeof inventory[element] === 'object' 
                ? (inventory[element].count || 0) 
                : inventory[element];
        }
        
        if (available < amount) {
            return { 
                success: false, 
                error: `Not enough ${element}. Need ${amount}, have ${available}`,
                missing: element,
                required: amount,
                available: available
            };
        }
    }
    
    return { success: true };
}

// Batch craft multiple items with progress tracking
export async function batchCraft(recipeId, totalCount, onProgress = null) {
    const results = {
        success: 0,
        failed: 0,
        total: totalCount,
        leveledUp: false,
        newLevel: null
    };
    
    // Check if we can craft the entire batch at once
    const canCraft = await canCraftBatch(recipeId, totalCount);
    if (!canCraft.success) {
        return { success: false, error: canCraft.error };
    }
    
    // Craft the entire batch
    const result = await craftItem(recipeId, totalCount);
    
    if (result.success) {
        results.success = totalCount;
        results.leveledUp = result.leveledUp;
        results.newLevel = result.newLevel;
    } else {
        results.failed = totalCount;
    }
    
    return results;
}

// Get mastery level name for display
export function getMasteryLevelName(progress) {
    const level = getLevelFromProgress(progress);
    return level.name;
}

// Get mastery multiplier
export function getMasteryMultiplier(progress) {
    const level = getLevelFromProgress(progress);
    return level.multiplier;
}

// Calculate progress to next level
export function getProgressToNextLevel(progress) {
    for (let i = 0; i < LEVEL_THRESHOLDS.length - 1; i++) {
        const current = LEVEL_THRESHOLDS[i];
        const next = LEVEL_THRESHOLDS[i + 1];
        
        if (progress >= current.threshold && progress < next.threshold) {
            const totalNeeded = next.threshold - current.threshold;
            const currentProgress = progress - current.threshold;
            return {
                currentLevel: current.name,
                nextLevel: next.name,
                progress: currentProgress,
                totalNeeded: totalNeeded,
                percentage: (currentProgress / totalNeeded) * 100
            };
        }
    }
    
    // At max level
    const maxLevel = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    return {
        currentLevel: maxLevel.name,
        nextLevel: null,
        progress: 0,
        totalNeeded: 0,
        percentage: 100
    };
}

// ===== EXPORT ALL FUNCTIONS =====
export default {
    ALCHEMY_RECIPES,
    LEVEL_THRESHOLDS,
    getLevelFromProgress,
    hasIngredients,
    getCurrentInventory,
    craftItem,
    loadAlchemyProgress,
    getRecipesWithProgress,
    isRecipeUnlocked,
    getTotalCrafts,
    getRecipeById,
    calculateRequiredMaterials,
    canCraftBatch,
    batchCraft,
    getMasteryLevelName,
    getMasteryMultiplier,
    getProgressToNextLevel
};

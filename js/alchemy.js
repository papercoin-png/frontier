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

// Check if player has ingredients
export function hasIngredients(inventory, ingredients) {
    for (const [element, amount] of Object.entries(ingredients)) {
        if (!inventory[element] || inventory[element] < amount) {
            return false;
        }
    }
    return true;
}

// Craft an item
export function craftItem(recipeId, count = 1) {
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
    
    // Check if player has ingredients
    const inventory = JSON.parse(localStorage.getItem('voidfarer_collection') || '{}');
    const totalIngredients = {};
    
    // Calculate total ingredients needed
    for (const [element, amount] of Object.entries(recipe.ingredients)) {
        totalIngredients[element] = (totalIngredients[element] || 0) + (amount * count);
    }
    
    // Verify all ingredients available
    for (const [element, amount] of Object.entries(totalIngredients)) {
        if (!inventory[element] || inventory[element] < amount) {
            return { 
                success: false, 
                error: `Not enough ${element}. Need ${amount}, have ${inventory[element] || 0}`
            };
        }
    }
    
    // Consume ingredients
    for (const [element, amount] of Object.entries(totalIngredients)) {
        inventory[element] -= amount;
        if (inventory[element] === 0) {
            delete inventory[element];
        }
    }
    
    // Update progress
    const newProgress = currentProgress + count;
    alchemyProgress[recipeId] = newProgress;
    
    // Save to localStorage
    localStorage.setItem('voidfarer_collection', JSON.stringify(inventory));
    localStorage.setItem('voidfarer_alchemy_progress', JSON.stringify(alchemyProgress));
    
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
}

// Load alchemy progress from storage
export function loadAlchemyProgress() {
    const saved = localStorage.getItem('voidfarer_alchemy_progress');
    return saved ? JSON.parse(saved) : {};
}

// Get all recipes with progress
export function getRecipesWithProgress() {
    const progress = loadAlchemyProgress();
    const recipesWithProgress = {};
    
    for (const [category, recipes] of Object.entries(ALCHEMY_RECIPES)) {
        recipesWithProgress[category] = recipes.map(recipe => {
            const prog = progress[recipe.id] || 0;
            const level = getLevelFromProgress(prog);
            const unlocked = prog > 0 || recipe.unlocksAt === 0; // Simple unlock logic
            
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

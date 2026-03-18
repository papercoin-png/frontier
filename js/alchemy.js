// js/alchemy.js - Complete Alchemy Recipe Tree and Crafting Functions
// Tier 1-10: From Water to Transcendence

// ===== LEVEL THRESHOLDS =====
export const LEVEL_THRESHOLDS = [
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

// ===== TIER 1: BASIC COMPOUNDS =====
const TIER_1_BASIC_COMPOUNDS = [
    { 
        id: 'water',
        name: 'Water', 
        formula: '2H + 1O → H₂O', 
        ingredients: { Hydrogen: 2, Oxygen: 1 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 1,
        target: 100,
        icon: '💧',
        unlocksAt: 0,
        description: 'The foundation of life and chemistry. Every journey begins with a single molecule.'
    },
    { 
        id: 'methane',
        name: 'Methane', 
        formula: '1C + 4H → CH₄', 
        ingredients: { Carbon: 1, Hydrogen: 4 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 1,
        target: 100,
        icon: '🔥',
        unlocksAt: 0,
        description: 'The simplest hydrocarbon. Fuel for stars and factories alike.'
    },
    { 
        id: 'ammonia',
        name: 'Ammonia', 
        formula: '1N + 3H → NH₃', 
        ingredients: { Nitrogen: 1, Hydrogen: 3 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 1,
        target: 100,
        icon: '⚗️',
        unlocksAt: 0,
        description: 'Essential for fertilizers and industrial chemistry.'
    },
    { 
        id: 'hydrogen_peroxide',
        name: 'Hydrogen Peroxide', 
        formula: '2H + 2O → H₂O₂', 
        ingredients: { Hydrogen: 2, Oxygen: 2 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 2,
        target: 100,
        icon: '💧',
        unlocksAt: 0,
        description: 'A powerful oxidizer and disinfectant.'
    },
    { 
        id: 'carbon_dioxide',
        name: 'Carbon Dioxide', 
        formula: '1C + 2O → CO₂', 
        ingredients: { Carbon: 1, Oxygen: 2 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 1,
        target: 100,
        icon: '💨',
        unlocksAt: 0,
        description: 'The breath of industry. Essential for life support and carbon chemistry.'
    },
    { 
        id: 'carbon_monoxide',
        name: 'Carbon Monoxide', 
        formula: '1C + 1O → CO', 
        ingredients: { Carbon: 1, Oxygen: 1 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 1,
        target: 100,
        icon: '💨',
        unlocksAt: 0,
        description: 'A toxic but useful reducing agent in metallurgy.'
    },
    { 
        id: 'sulfur_dioxide',
        name: 'Sulfur Dioxide', 
        formula: '1S + 2O → SO₂', 
        ingredients: { Sulfur: 1, Oxygen: 2 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 2,
        target: 100,
        icon: '🌋',
        unlocksAt: 0,
        description: 'Volcanic gas essential for sulfuric acid production.'
    },
    { 
        id: 'hydrogen_sulfide',
        name: 'Hydrogen Sulfide', 
        formula: '2H + 1S → H₂S', 
        ingredients: { Hydrogen: 2, Sulfur: 1 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 2,
        target: 100,
        icon: '🥚',
        unlocksAt: 0,
        description: 'Rotten egg gas. A source of sulfur for industrial processes.'
    },
    { 
        id: 'hydrogen_chloride',
        name: 'Hydrogen Chloride', 
        formula: '1H + 1Cl → HCl', 
        ingredients: { Hydrogen: 1, Chlorine: 1 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 2,
        target: 100,
        icon: '🧪',
        unlocksAt: 0,
        description: 'Forms hydrochloric acid when dissolved in water.'
    },
    { 
        id: 'sodium_oxide',
        name: 'Sodium Oxide', 
        formula: '2Na + 1O → Na₂O', 
        ingredients: { Sodium: 2, Oxygen: 1 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 2,
        target: 100,
        icon: '🧂',
        unlocksAt: 0,
        description: 'A basic oxide used in glass manufacturing.'
    },
    { 
        id: 'magnesium_oxide',
        name: 'Magnesium Oxide', 
        formula: '1Mg + 1O → MgO', 
        ingredients: { Magnesium: 1, Oxygen: 1 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 2,
        target: 100,
        icon: '⚪',
        unlocksAt: 0,
        description: 'Refractory material for high-temperature applications.'
    },
    { 
        id: 'aluminum_oxide',
        name: 'Aluminum Oxide', 
        formula: '2Al + 3O → Al₂O₃', 
        ingredients: { Aluminum: 2, Oxygen: 3 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 3,
        target: 100,
        icon: '💎',
        unlocksAt: 0,
        description: 'Corundum. One of the hardest materials. Precursor to aluminum.'
    },
    { 
        id: 'silicon_dioxide',
        name: 'Silicon Dioxide', 
        formula: '1Si + 2O → SiO₂', 
        ingredients: { Silicon: 1, Oxygen: 2 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 3,
        target: 100,
        icon: '🪨',
        unlocksAt: 0,
        description: 'Quartz. The foundation of glass and semiconductors.'
    },
    { 
        id: 'iron_oxide',
        name: 'Iron Oxide', 
        formula: '2Fe + 3O → Fe₂O₃', 
        ingredients: { Iron: 2, Oxygen: 3 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 3,
        target: 100,
        icon: '🟤',
        unlocksAt: 0,
        description: 'Rust. The first step in iron production.'
    },
    { 
        id: 'calcium_oxide',
        name: 'Calcium Oxide', 
        formula: '1Ca + 1O → CaO', 
        ingredients: { Calcium: 1, Oxygen: 1 },
        tier: 1,
        category: 'Basic Compounds',
        skillGain: 2,
        target: 100,
        icon: '⚪',
        unlocksAt: 0,
        description: 'Quicklime. Essential for cement and steel production.'
    }
];

// ===== TIER 2: ACIDS & BASES =====
const TIER_2_ACIDS_BASES = [
    { 
        id: 'sulfuric_acid',
        name: 'Sulfuric Acid', 
        formula: '2H + 1S + 4O → H₂SO₄', 
        ingredients: { Hydrogen: 2, Sulfur: 1, Oxygen: 4 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 5,
        target: 200,
        icon: '🧪',
        unlocksAt: 100,
        description: 'The king of chemicals. Used in nearly every industrial process.'
    },
    { 
        id: 'nitric_acid',
        name: 'Nitric Acid', 
        formula: '1H + 1N + 3O → HNO₃', 
        ingredients: { Hydrogen: 1, Nitrogen: 1, Oxygen: 3 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 5,
        target: 200,
        icon: '🧪',
        unlocksAt: 100,
        description: 'Essential for fertilizers, explosives, and etching.'
    },
    { 
        id: 'hydrochloric_acid',
        name: 'Hydrochloric Acid', 
        formula: '1H + 1Cl → HCl', 
        ingredients: { Hydrogen: 1, Chlorine: 1 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 3,
        target: 200,
        icon: '🧪',
        unlocksAt: 100,
        description: 'A strong acid used for cleaning and ore processing.'
    },
    { 
        id: 'phosphoric_acid',
        name: 'Phosphoric Acid', 
        formula: '3H + 1P + 4O → H₃PO₄', 
        ingredients: { Hydrogen: 3, Phosphorus: 1, Oxygen: 4 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 8,
        target: 200,
        icon: '🧪',
        unlocksAt: 150,
        description: 'Used in fertilizers, food additives, and rust removal.'
    },
    { 
        id: 'carbonic_acid',
        name: 'Carbonic Acid', 
        formula: '2H + 1C + 3O → H₂CO₃', 
        ingredients: { Hydrogen: 2, Carbon: 1, Oxygen: 3 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 4,
        target: 200,
        icon: '💧',
        unlocksAt: 100,
        description: 'Weak acid formed from CO₂ and water. Important in carbonation.'
    },
    { 
        id: 'acetic_acid',
        name: 'Acetic Acid', 
        formula: '2C + 4H + 2O → CH₃COOH', 
        ingredients: { Carbon: 2, Hydrogen: 4, Oxygen: 2 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 10,
        target: 200,
        icon: '🍶',
        unlocksAt: 200,
        description: 'Vinegar. Essential for organic synthesis and esters.'
    },
    { 
        id: 'hydrofluoric_acid',
        name: 'Hydrofluoric Acid', 
        formula: '1H + 1F → HF', 
        ingredients: { Hydrogen: 1, Fluorine: 1 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 8,
        target: 200,
        icon: '⚠️',
        unlocksAt: 180,
        description: 'Etches glass. Extremely dangerous but essential for semiconductor processing.'
    },
    { 
        id: 'sodium_hydroxide',
        name: 'Sodium Hydroxide', 
        formula: '1Na + 1O + 1H → NaOH', 
        ingredients: { Sodium: 1, Oxygen: 1, Hydrogen: 1 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 5,
        target: 200,
        icon: '🧪',
        unlocksAt: 100,
        description: 'Lye. A strong base used in soap making and chemical processing.'
    },
    { 
        id: 'potassium_hydroxide',
        name: 'Potassium Hydroxide', 
        formula: '1K + 1O + 1H → KOH', 
        ingredients: { Potassium: 1, Oxygen: 1, Hydrogen: 1 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 5,
        target: 200,
        icon: '🧪',
        unlocksAt: 120,
        description: 'Caustic potash. Used in fertilizers and batteries.'
    },
    { 
        id: 'calcium_hydroxide',
        name: 'Calcium Hydroxide', 
        formula: '1Ca + 2O + 2H → Ca(OH)₂', 
        ingredients: { Calcium: 1, Oxygen: 2, Hydrogen: 2 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 6,
        target: 200,
        icon: '⚪',
        unlocksAt: 140,
        description: 'Slaked lime. Used in water treatment and construction.'
    },
    { 
        id: 'ammonium_hydroxide',
        name: 'Ammonium Hydroxide', 
        formula: '1N + 5H + 1O → NH₄OH', 
        ingredients: { Nitrogen: 1, Hydrogen: 5, Oxygen: 1 },
        tier: 2,
        category: 'Acids & Bases',
        skillGain: 8,
        target: 200,
        icon: '🧪',
        unlocksAt: 160,
        description: 'Household ammonia. Used in cleaning and as a precursor to amines.'
    }
];

// ===== TIER 3: SALTS & MINERALS =====
const TIER_3_SALTS_MINERALS = [
    { 
        id: 'sodium_chloride',
        name: 'Sodium Chloride', 
        formula: '1Na + 1Cl → NaCl', 
        ingredients: { Sodium: 1, Chlorine: 1 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 5,
        target: 300,
        icon: '🧂',
        unlocksAt: 500,
        description: 'Table salt. Essential for life and countless industrial processes.'
    },
    { 
        id: 'potassium_chloride',
        name: 'Potassium Chloride', 
        formula: '1K + 1Cl → KCl', 
        ingredients: { Potassium: 1, Chlorine: 1 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 5,
        target: 300,
        icon: '🧂',
        unlocksAt: 550,
        description: 'A potassium source for fertilizers.'
    },
    { 
        id: 'calcium_carbonate',
        name: 'Calcium Carbonate', 
        formula: '1Ca + 1C + 3O → CaCO₃', 
        ingredients: { Calcium: 1, Carbon: 1, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 8,
        target: 300,
        icon: '🪨',
        unlocksAt: 600,
        description: 'Limestone. Used in cement, construction, and as a flux.'
    },
    { 
        id: 'sodium_carbonate',
        name: 'Sodium Carbonate', 
        formula: '2Na + 1C + 3O → Na₂CO₃', 
        ingredients: { Sodium: 2, Carbon: 1, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 10,
        target: 300,
        icon: '🧼',
        unlocksAt: 650,
        description: 'Soda ash. Used in glass making and water softening.'
    },
    { 
        id: 'calcium_sulfate',
        name: 'Calcium Sulfate', 
        formula: '1Ca + 1S + 4O → CaSO₄', 
        ingredients: { Calcium: 1, Sulfur: 1, Oxygen: 4 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 12,
        target: 300,
        icon: '⚪',
        unlocksAt: 700,
        description: 'Gypsum. Used in drywall and cement.'
    },
    { 
        id: 'sodium_nitrate',
        name: 'Sodium Nitrate', 
        formula: '1Na + 1N + 3O → NaNO₃', 
        ingredients: { Sodium: 1, Nitrogen: 1, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 10,
        target: 300,
        icon: '🧪',
        unlocksAt: 750,
        description: 'Chile saltpeter. Used in fertilizers and explosives.'
    },
    { 
        id: 'potassium_nitrate',
        name: 'Potassium Nitrate', 
        formula: '1K + 1N + 3O → KNO₃', 
        ingredients: { Potassium: 1, Nitrogen: 1, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 10,
        target: 300,
        icon: '🧪',
        unlocksAt: 800,
        description: 'Saltpeter. Essential for gunpowder and fireworks.'
    },
    { 
        id: 'ammonium_nitrate',
        name: 'Ammonium Nitrate', 
        formula: '2N + 4H + 3O → NH₄NO₃', 
        ingredients: { Nitrogen: 2, Hydrogen: 4, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 15,
        target: 300,
        icon: '💥',
        unlocksAt: 850,
        description: 'A powerful fertilizer and explosive component.'
    },
    { 
        id: 'copper_sulfate',
        name: 'Copper Sulfate', 
        formula: '1Cu + 1S + 4O → CuSO₄', 
        ingredients: { Copper: 1, Sulfur: 1, Oxygen: 4 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 12,
        target: 300,
        icon: '🔵',
        unlocksAt: 900,
        description: 'Blue vitriol. Used in electroplating and agriculture.'
    },
    { 
        id: 'iron_sulfate',
        name: 'Iron Sulfate', 
        formula: '1Fe + 1S + 4O → FeSO₄', 
        ingredients: { Iron: 1, Sulfur: 1, Oxygen: 4 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 12,
        target: 300,
        icon: '🟢',
        unlocksAt: 950,
        description: 'Used in water treatment and as a dietary supplement.'
    },
    { 
        id: 'quartz',
        name: 'Quartz', 
        formula: '1Si + 2O → SiO₂', 
        ingredients: { Silicon: 1, Oxygen: 2 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 5,
        target: 300,
        icon: '💎',
        unlocksAt: 1000,
        description: 'Pure crystalline silica. Used in electronics and timekeeping.'
    },
    { 
        id: 'corundum',
        name: 'Corundum', 
        formula: '2Al + 3O → Al₂O₃', 
        ingredients: { Aluminum: 2, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 8,
        target: 300,
        icon: '🔴',
        unlocksAt: 1100,
        description: 'Sapphire and ruby. An extremely hard mineral for abrasives and lasers.'
    },
    { 
        id: 'hematite',
        name: 'Hematite', 
        formula: '2Fe + 3O → Fe₂O₃', 
        ingredients: { Iron: 2, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 8,
        target: 300,
        icon: '⚫',
        unlocksAt: 1200,
        description: 'Iron ore. The primary source of iron.'
    },
    { 
        id: 'magnetite',
        name: 'Magnetite', 
        formula: '3Fe + 4O → Fe₃O₄', 
        ingredients: { Iron: 3, Oxygen: 4 },
        tier: 3,
        category: 'Salts & Minerals',
        skillGain: 10,
        target: 300,
        icon: '🧲',
        unlocksAt: 1300,
        description: 'Magnetic iron ore. Used in data storage and as a catalyst.'
    }
];

// ===== TIER 4: ORGANIC CHEMISTRY =====
const TIER_4_ORGANIC = [
    // Hydrocarbons
    { 
        id: 'ethylene',
        name: 'Ethylene', 
        formula: '2C + 4H → C₂H₄', 
        ingredients: { Carbon: 2, Hydrogen: 4 },
        tier: 4,
        category: 'Hydrocarbons',
        skillGain: 10,
        target: 500,
        icon: '🧪',
        unlocksAt: 2000,
        description: 'The most produced organic compound. Used to make polyethylene.'
    },
    { 
        id: 'acetylene',
        name: 'Acetylene', 
        formula: '2C + 2H → C₂H₂', 
        ingredients: { Carbon: 2, Hydrogen: 2 },
        tier: 4,
        category: 'Hydrocarbons',
        skillGain: 12,
        target: 500,
        icon: '🔥',
        unlocksAt: 2200,
        description: 'Used in welding torches and as a chemical building block.'
    },
    { 
        id: 'propylene',
        name: 'Propylene', 
        formula: '3C + 6H → C₃H₆', 
        ingredients: { Carbon: 3, Hydrogen: 6 },
        tier: 4,
        category: 'Hydrocarbons',
        skillGain: 15,
        target: 500,
        icon: '🧪',
        unlocksAt: 2500,
        description: 'Used to make polypropylene and other plastics.'
    },
    { 
        id: 'butadiene',
        name: 'Butadiene', 
        formula: '4C + 6H → C₄H₆', 
        ingredients: { Carbon: 4, Hydrogen: 6 },
        tier: 4,
        category: 'Hydrocarbons',
        skillGain: 18,
        target: 500,
        icon: '🧪',
        unlocksAt: 2800,
        description: 'Used in synthetic rubber production.'
    },
    { 
        id: 'benzene',
        name: 'Benzene', 
        formula: '6C + 6H → C₆H₆', 
        ingredients: { Carbon: 6, Hydrogen: 6 },
        tier: 4,
        category: 'Hydrocarbons',
        skillGain: 25,
        target: 500,
        icon: '⚫',
        unlocksAt: 3000,
        description: 'The fundamental aromatic compound. Precursor to countless chemicals.'
    },
    { 
        id: 'toluene',
        name: 'Toluene', 
        formula: '7C + 8H → C₇H₈', 
        ingredients: { Carbon: 7, Hydrogen: 8 },
        tier: 4,
        category: 'Hydrocarbons',
        skillGain: 30,
        target: 500,
        icon: '🧪',
        unlocksAt: 3500,
        description: 'Solvent and precursor to TNT and other compounds.'
    },
    
    // Alcohols
    { 
        id: 'methanol',
        name: 'Methanol', 
        formula: '1C + 4H + 1O → CH₃OH', 
        ingredients: { Carbon: 1, Hydrogen: 4, Oxygen: 1 },
        tier: 4,
        category: 'Alcohols',
        skillGain: 15,
        target: 500,
        icon: '🧪',
        unlocksAt: 4000,
        description: 'Wood alcohol. Used as fuel and solvent.'
    },
    { 
        id: 'ethanol',
        name: 'Ethanol', 
        formula: '2C + 6H + 1O → C₂H₅OH', 
        ingredients: { Carbon: 2, Hydrogen: 6, Oxygen: 1 },
        tier: 4,
        category: 'Alcohols',
        skillGain: 20,
        target: 500,
        icon: '🍶',
        unlocksAt: 4500,
        description: 'Grain alcohol. Fuel, solvent, and beverage.'
    },
    { 
        id: 'isopropanol',
        name: 'Isopropanol', 
        formula: '3C + 8H + 1O → C₃H₇OH', 
        ingredients: { Carbon: 3, Hydrogen: 8, Oxygen: 1 },
        tier: 4,
        category: 'Alcohols',
        skillGain: 25,
        target: 500,
        icon: '🧴',
        unlocksAt: 5000,
        description: 'Rubbing alcohol. Disinfectant and solvent.'
    },
    { 
        id: 'ethylene_glycol',
        name: 'Ethylene Glycol', 
        formula: '2C + 6H + 2O → C₂H₄(OH)₂', 
        ingredients: { Carbon: 2, Hydrogen: 6, Oxygen: 2 },
        tier: 4,
        category: 'Alcohols',
        skillGain: 35,
        target: 500,
        icon: '❄️',
        unlocksAt: 5500,
        description: 'Antifreeze. Essential for coolant systems.'
    },
    { 
        id: 'glycerol',
        name: 'Glycerol', 
        formula: '3C + 8H + 3O → C₃H₅(OH)₃', 
        ingredients: { Carbon: 3, Hydrogen: 8, Oxygen: 3 },
        tier: 4,
        category: 'Alcohols',
        skillGain: 40,
        target: 500,
        icon: '🧴',
        unlocksAt: 6000,
        description: 'Used in pharmaceuticals, cosmetics, and to make nitroglycerin.'
    },
    
    // Organic Acids
    { 
        id: 'formic_acid',
        name: 'Formic Acid', 
        formula: '1C + 2H + 2O → HCOOH', 
        ingredients: { Carbon: 1, Hydrogen: 2, Oxygen: 2 },
        tier: 4,
        category: 'Organic Acids',
        skillGain: 15,
        target: 500,
        icon: '🐜',
        unlocksAt: 6500,
        description: 'Found in ant venom. Used in leather processing and as a preservative.'
    },
    { 
        id: 'acetic_acid_organic',
        name: 'Acetic Acid', 
        formula: '2C + 4H + 2O → CH₃COOH', 
        ingredients: { Carbon: 2, Hydrogen: 4, Oxygen: 2 },
        tier: 4,
        category: 'Organic Acids',
        skillGain: 20,
        target: 500,
        icon: '🍶',
        unlocksAt: 7000,
        description: 'Vinegar. Essential for ester production.'
    },
    { 
        id: 'propionic_acid',
        name: 'Propionic Acid', 
        formula: '3C + 6H + 2O → C₂H₅COOH', 
        ingredients: { Carbon: 3, Hydrogen: 6, Oxygen: 2 },
        tier: 4,
        category: 'Organic Acids',
        skillGain: 25,
        target: 500,
        icon: '🧪',
        unlocksAt: 7500,
        description: 'Food preservative and intermediate in chemical synthesis.'
    },
    { 
        id: 'butyric_acid',
        name: 'Butyric Acid', 
        formula: '4C + 8H + 2O → C₃H₇COOH', 
        ingredients: { Carbon: 4, Hydrogen: 8, Oxygen: 2 },
        tier: 4,
        category: 'Organic Acids',
        skillGain: 30,
        target: 500,
        icon: '🧀',
        unlocksAt: 8000,
        description: 'Found in rancid butter. Used in perfume and flavor manufacturing.'
    },
    { 
        id: 'benzoic_acid',
        name: 'Benzoic Acid', 
        formula: '7C + 6H + 2O → C₆H₅COOH', 
        ingredients: { Carbon: 7, Hydrogen: 6, Oxygen: 2 },
        tier: 4,
        category: 'Organic Acids',
        skillGain: 40,
        target: 500,
        icon: '⚪',
        unlocksAt: 9000,
        description: 'Food preservative and precursor to many organic compounds.'
    },
    
    // Esters
    { 
        id: 'ethyl_acetate',
        name: 'Ethyl Acetate', 
        formula: '4C + 8H + 2O → CH₃COOC₂H₅', 
        ingredients: { Carbon: 4, Hydrogen: 8, Oxygen: 2 },
        tier: 4,
        category: 'Esters',
        skillGain: 25,
        target: 500,
        icon: '🍏',
        unlocksAt: 10000,
        description: 'Fruity solvent used in nail polish removers and glues.'
    },
    { 
        id: 'methyl_acetate',
        name: 'Methyl Acetate', 
        formula: '3C + 6H + 2O → CH₃COOCH₃', 
        ingredients: { Carbon: 3, Hydrogen: 6, Oxygen: 2 },
        tier: 4,
        category: 'Esters',
        skillGain: 20,
        target: 500,
        icon: '🍌',
        unlocksAt: 10500,
        description: 'Solvent with a pleasant smell.'
    },
    
    // Ethers
    { 
        id: 'diethyl_ether',
        name: 'Diethyl Ether', 
        formula: '4C + 10H + 1O → (C₂H₅)₂O', 
        ingredients: { Carbon: 4, Hydrogen: 10, Oxygen: 1 },
        tier: 4,
        category: 'Ethers',
        skillGain: 30,
        target: 500,
        icon: '😷',
        unlocksAt: 11000,
        description: 'Historically used as an anesthetic. Excellent solvent.'
    },
    
    // Amines
    { 
        id: 'methylamine',
        name: 'Methylamine', 
        formula: '1C + 5H + 1N → CH₃NH₂', 
        ingredients: { Carbon: 1, Hydrogen: 5, Nitrogen: 1 },
        tier: 4,
        category: 'Amines',
        skillGain: 20,
        target: 500,
        icon: '🐟',
        unlocksAt: 12000,
        description: 'Used in pharmaceuticals and pesticides.'
    },
    { 
        id: 'aniline',
        name: 'Aniline', 
        formula: '6C + 7H + 1N → C₆H₅NH₂', 
        ingredients: { Carbon: 6, Hydrogen: 7, Nitrogen: 1 },
        tier: 4,
        category: 'Amines',
        skillGain: 35,
        target: 500,
        icon: '🧪',
        unlocksAt: 13000,
        description: 'Essential for dye manufacturing and polyurethane production.'
    }
];

// ===== TIER 5: POLYMERS & PLASTICS =====
const TIER_5_POLYMERS = [
    // Monomers
    { 
        id: 'styrene',
        name: 'Styrene', 
        formula: '8C + 8H → C₈H₈', 
        ingredients: { Carbon: 8, Hydrogen: 8 },
        tier: 5,
        category: 'Monomers',
        skillGain: 40,
        target: 1000,
        icon: '🧪',
        unlocksAt: 15000,
        description: 'Monomer for polystyrene and many copolymers.'
    },
    { 
        id: 'vinyl_chloride',
        name: 'Vinyl Chloride', 
        formula: '2C + 3H + 1Cl → C₂H₃Cl', 
        ingredients: { Carbon: 2, Hydrogen: 3, Chlorine: 1 },
        tier: 5,
        category: 'Monomers',
        skillGain: 35,
        target: 1000,
        icon: '🧪',
        unlocksAt: 16000,
        description: 'Monomer for PVC. Toxic but essential.'
    },
    { 
        id: 'acrylonitrile',
        name: 'Acrylonitrile', 
        formula: '3C + 3H + 1N → C₃H₃N', 
        ingredients: { Carbon: 3, Hydrogen: 3, Nitrogen: 1 },
        tier: 5,
        category: 'Monomers',
        skillGain: 40,
        target: 1000,
        icon: '🧪',
        unlocksAt: 17000,
        description: 'Used in acrylic fibers and ABS plastic.'
    },
    { 
        id: 'methyl_methacrylate',
        name: 'Methyl Methacrylate', 
        formula: '5C + 8H + 2O → C₅H₈O₂', 
        ingredients: { Carbon: 5, Hydrogen: 8, Oxygen: 2 },
        tier: 5,
        category: 'Monomers',
        skillGain: 55,
        target: 1000,
        icon: '🔍',
        unlocksAt: 18000,
        description: 'Monomer for Plexiglas (PMMA).'
    },
    { 
        id: 'caprolactam',
        name: 'Caprolactam', 
        formula: '6C + 11H + 1N + 1O → C₆H₁₁NO', 
        ingredients: { Carbon: 6, Hydrogen: 11, Nitrogen: 1, Oxygen: 1 },
        tier: 5,
        category: 'Monomers',
        skillGain: 60,
        target: 1000,
        icon: '🧵',
        unlocksAt: 19000,
        description: 'Monomer for Nylon 6.'
    },
    
    // Basic Polymers
    { 
        id: 'polyethylene',
        name: 'Polyethylene', 
        formula: 'n(C₂H₄) → (C₂H₄)n', 
        ingredients: { Ethylene: 10 },
        tier: 5,
        category: 'Polymers',
        skillGain: 50,
        target: 1000,
        icon: '🧴',
        unlocksAt: 20000,
        description: 'The most common plastic. Used for bags, bottles, and containers.'
    },
    { 
        id: 'polypropylene',
        name: 'Polypropylene', 
        formula: 'n(C₃H₆) → (C₃H₆)n', 
        ingredients: { Propylene: 10 },
        tier: 5,
        category: 'Polymers',
        skillGain: 60,
        target: 1000,
        icon: '🧴',
        unlocksAt: 21000,
        description: 'Durable plastic used in packaging, textiles, and automotive parts.'
    },
    { 
        id: 'polystyrene',
        name: 'Polystyrene', 
        formula: 'n(C₈H₈) → (C₈H₈)n', 
        ingredients: { Styrene: 10 },
        tier: 5,
        category: 'Polymers',
        skillGain: 80,
        target: 1000,
        icon: '📦',
        unlocksAt: 22000,
        description: 'Used for foam packaging, cups, and insulation.'
    },
    { 
        id: 'pvc',
        name: 'Polyvinyl Chloride', 
        formula: 'n(C₂H₃Cl) → (C₂H₃Cl)n', 
        ingredients: { VinylChloride: 10 },
        tier: 5,
        category: 'Polymers',
        skillGain: 70,
        target: 1000,
        icon: '🔧',
        unlocksAt: 23000,
        description: 'Durable plastic for pipes, fittings, and insulation.'
    },
    { 
        id: 'pet',
        name: 'Polyethylene Terephthalate', 
        formula: 'Complex polymerization', 
        ingredients: { EthyleneGlycol: 5, TerephthalicAcid: 5 },
        tier: 5,
        category: 'Polymers',
        skillGain: 90,
        target: 1000,
        icon: '🥤',
        unlocksAt: 24000,
        description: 'Used for beverage bottles and polyester fibers.'
    },
    { 
        id: 'abs',
        name: 'Acrylonitrile Butadiene Styrene', 
        formula: 'Copolymerization', 
        ingredients: { Acrylonitrile: 3, Butadiene: 3, Styrene: 4 },
        tier: 5,
        category: 'Polymers',
        skillGain: 80,
        target: 1000,
        icon: '🔧',
        unlocksAt: 25000,
        description: 'Strong, impact-resistant plastic for LEGO bricks and electronics.'
    },
    { 
        id: 'nylon_6_6',
        name: 'Nylon 6,6', 
        formula: 'Polycondensation', 
        ingredients: { AdipicAcid: 5, Hexamethylenediamine: 5 },
        tier: 5,
        category: 'Engineering Plastics',
        skillGain: 100,
        target: 1000,
        icon: '🧵',
        unlocksAt: 26000,
        description: 'Strong, durable fiber for textiles and engineering components.'
    },
    { 
        id: 'polycarbonate',
        name: 'Polycarbonate', 
        formula: 'Polymerization', 
        ingredients: { BisphenolA: 5, Phosgene: 5 },
        tier: 5,
        category: 'Engineering Plastics',
        skillGain: 120,
        target: 1000,
        icon: '🛡️',
        unlocksAt: 28000,
        description: 'Impact-resistant transparent plastic for bulletproof glass and CDs.'
    },
    { 
        id: 'pmma',
        name: 'Polymethyl Methacrylate', 
        formula: 'Polymerization', 
        ingredients: { MethylMethacrylate: 10 },
        tier: 5,
        category: 'Engineering Plastics',
        skillGain: 90,
        target: 1000,
        icon: '🔍',
        unlocksAt: 30000,
        description: 'Plexiglas. A transparent alternative to glass.'
    },
    { 
        id: 'ptfe',
        name: 'Polytetrafluoroethylene', 
        formula: 'Polymerization', 
        ingredients: { Tetrafluoroethylene: 10 },
        tier: 5,
        category: 'Engineering Plastics',
        skillGain: 100,
        target: 1000,
        icon: '🍳',
        unlocksAt: 32000,
        description: 'Teflon. Non-stick, heat-resistant, and chemically inert.'
    }
];

// ===== TIER 6: METALLURGY =====
const TIER_6_METALLURGY = [
    // Basic Alloys
    { 
        id: 'bronze',
        name: 'Bronze', 
        formula: 'Cu + Sn → Alloy', 
        ingredients: { Copper: 7, Tin: 3 },
        tier: 6,
        category: 'Basic Alloys',
        skillGain: 30,
        target: 2000,
        icon: '🏺',
        unlocksAt: 35000,
        description: 'The first alloy. Used for tools, weapons, and art.'
    },
    { 
        id: 'brass',
        name: 'Brass', 
        formula: 'Cu + Zn → Alloy', 
        ingredients: { Copper: 7, Zinc: 3 },
        tier: 6,
        category: 'Basic Alloys',
        skillGain: 30,
        target: 2000,
        icon: '🔔',
        unlocksAt: 36000,
        description: 'Used for musical instruments, fittings, and decorations.'
    },
    { 
        id: 'steel',
        name: 'Steel', 
        formula: 'Fe + C → Alloy', 
        ingredients: { Iron: 9, Carbon: 1 },
        tier: 6,
        category: 'Basic Alloys',
        skillGain: 40,
        target: 2000,
        icon: '⚙️',
        unlocksAt: 37000,
        description: 'The backbone of civilization. Used everywhere.'
    },
    { 
        id: 'stainless_steel_304',
        name: 'Stainless Steel 304', 
        formula: 'Fe + Cr + Ni → Alloy', 
        ingredients: { Iron: 7, Chromium: 2, Nickel: 1 },
        tier: 6,
        category: 'Stainless Steels',
        skillGain: 60,
        target: 2000,
        icon: '🥄',
        unlocksAt: 38000,
        description: 'Corrosion-resistant steel for kitchenware and architecture.'
    },
    { 
        id: 'stainless_steel_316',
        name: 'Stainless Steel 316', 
        formula: 'Fe + Cr + Ni + Mo → Alloy', 
        ingredients: { Iron: 6, Chromium: 2, Nickel: 1, Molybdenum: 1 },
        tier: 6,
        category: 'Stainless Steels',
        skillGain: 80,
        target: 2000,
        icon: '⚓',
        unlocksAt: 40000,
        description: 'Marine-grade stainless steel for harsh environments.'
    },
    { 
        id: 'tool_steel_d2',
        name: 'Tool Steel D2', 
        formula: 'Fe + C + Cr + Mo + V → Alloy', 
        ingredients: { Iron: 8, Carbon: 1, Chromium: 1, Molybdenum: 0.5, Vanadium: 0.5 },
        tier: 6,
        category: 'Tool Steels',
        skillGain: 90,
        target: 2000,
        icon: '🔪',
        unlocksAt: 42000,
        description: 'High-wear resistance steel for cutting tools.'
    },
    { 
        id: 'duralumin',
        name: 'Duralumin', 
        formula: 'Al + Cu + Mg → Alloy', 
        ingredients: { Aluminum: 9, Copper: 1, Magnesium: 0.5 },
        tier: 6,
        category: 'Aluminum Alloys',
        skillGain: 50,
        target: 2000,
        icon: '✈️',
        unlocksAt: 44000,
        description: 'High-strength aluminum alloy for aircraft.'
    },
    { 
        id: 'titanium_alloy_ti64',
        name: 'Ti-6Al-4V', 
        formula: 'Ti + Al + V → Alloy', 
        ingredients: { Titanium: 8, Aluminum: 1, Vanadium: 1 },
        tier: 6,
        category: 'Titanium Alloys',
        skillGain: 80,
        target: 2000,
        icon: '🚀',
        unlocksAt: 46000,
        description: 'The workhorse titanium alloy for aerospace and medical implants.'
    },
    { 
        id: 'inconel_718',
        name: 'Inconel 718', 
        formula: 'Ni + Cr + Fe + Nb + Mo → Superalloy', 
        ingredients: { Nickel: 5, Chromium: 2, Iron: 2, Niobium: 0.5, Molybdenum: 0.5 },
        tier: 6,
        category: 'Superalloys',
        skillGain: 100,
        target: 2000,
        icon: '🔥',
        unlocksAt: 48000,
        description: 'High-temperature superalloy for jet engines.'
    },
    { 
        id: 'tungsten_carbide',
        name: 'Tungsten Carbide', 
        formula: 'W + C → WC', 
        ingredients: { Tungsten: 9, Carbon: 1 },
        tier: 6,
        category: 'Refractory Alloys',
        skillGain: 90,
        target: 2000,
        icon: '⛏️',
        unlocksAt: 50000,
        description: 'Extremely hard material for cutting tools and mining equipment.'
    }
];

// ===== TIER 7: COMPOSITE MATERIALS =====
const TIER_7_COMPOSITES = [
    // Fibers
    { 
        id: 'carbon_fiber',
        name: 'Carbon Fiber', 
        formula: 'PAN → Heat → C Fiber', 
        ingredients: { Polyacrylonitrile: 5 },
        tier: 7,
        category: 'Fibers',
        skillGain: 80,
        target: 5000,
        icon: '⚫',
        unlocksAt: 55000,
        description: 'High-strength, lightweight fibers for advanced composites.'
    },
    { 
        id: 'glass_fiber',
        name: 'Glass Fiber', 
        formula: 'SiO₂ + Heat → Fiber', 
        ingredients: { SiliconDioxide: 10 },
        tier: 7,
        category: 'Fibers',
        skillGain: 50,
        target: 5000,
        icon: '⚪',
        unlocksAt: 52000,
        description: 'Reinforcement fibers for fiberglass.'
    },
    { 
        id: 'kevlar',
        name: 'Aramid Fiber (Kevlar)', 
        formula: 'Polymerization → Spinning', 
        ingredients: { PPD: 3, TPC: 3 },
        tier: 7,
        category: 'Fibers',
        skillGain: 120,
        target: 5000,
        icon: '🛡️',
        unlocksAt: 60000,
        description: 'Bulletproof fibers for body armor and high-strength applications.'
    },
    
    // Matrix Materials
    { 
        id: 'epoxy_resin',
        name: 'Epoxy Resin', 
        formula: 'BisphenolA + Epichlorohydrin → Polymer', 
        ingredients: { BisphenolA: 3, Epichlorohydrin: 2 },
        tier: 7,
        category: 'Matrix Materials',
        skillGain: 60,
        target: 5000,
        icon: '🧴',
        unlocksAt: 58000,
        description: 'High-performance adhesive and matrix for composites.'
    },
    { 
        id: 'polyester_resin',
        name: 'Polyester Resin', 
        formula: 'Unsaturated Polyester + Styrene', 
        ingredients: { MaleicAnhydride: 2, EthyleneGlycol: 2, Styrene: 1 },
        tier: 7,
        category: 'Matrix Materials',
        skillGain: 50,
        target: 5000,
        icon: '🧪',
        unlocksAt: 56000,
        description: 'Common matrix for fiberglass.'
    },
    
    // Composites
    { 
        id: 'fiberglass',
        name: 'Fiberglass', 
        formula: 'Glass Fibers + Polyester Resin', 
        ingredients: { GlassFiber: 5, PolyesterResin: 5 },
        tier: 7,
        category: 'Composites',
        skillGain: 100,
        target: 5000,
        icon: '🛶',
        unlocksAt: 62000,
        description: 'Lightweight, strong material for boats, car bodies, and insulation.'
    },
    { 
        id: 'carbon_fiber_composite',
        name: 'Carbon Fiber Composite', 
        formula: 'Carbon Fibers + Epoxy Resin', 
        ingredients: { CarbonFiber: 5, EpoxyResin: 5 },
        tier: 7,
        category: 'Advanced Composites',
        skillGain: 150,
        target: 5000,
        icon: '🚗',
        unlocksAt: 65000,
        description: 'Ultra-light, ultra-strong material for aerospace and high-performance vehicles.'
    },
    { 
        id: 'carbon_carbon_composite',
        name: 'Carbon-Carbon Composite', 
        formula: 'Carbon Fibers + Carbon Matrix', 
        ingredients: { CarbonFiber: 5, CarbonMatrix: 5 },
        tier: 7,
        category: 'Advanced Composites',
        skillGain: 200,
        target: 5000,
        icon: '🚀',
        unlocksAt: 70000,
        description: 'Withstands extreme temperatures. Used for rocket nozzles and heat shields.'
    }
];

// ===== TIER 8: SEMICONDUCTORS =====
const TIER_8_SEMICONDUCTORS = [
    // Silicon Processing
    { 
        id: 'polysilicon',
        name: 'Polysilicon', 
        formula: 'Si (metallurgical) → Purification → Poly Si', 
        ingredients: { Silicon: 10 },
        tier: 8,
        category: 'Silicon Processing',
        skillGain: 40,
        target: 10000,
        icon: '💎',
        unlocksAt: 80000,
        description: 'Purified silicon for semiconductor manufacturing.'
    },
    { 
        id: 'monocrystalline_silicon',
        name: 'Monocrystalline Silicon', 
        formula: 'Polysilicon → Czochralski Process → Single Crystal', 
        ingredients: { Polysilicon: 3 },
        tier: 8,
        category: 'Silicon Processing',
        skillGain: 60,
        target: 10000,
        icon: '🔮',
        unlocksAt: 85000,
        description: 'Single-crystal silicon wafers for chip manufacturing.'
    },
    { 
        id: 'silicon_wafer',
        name: 'Silicon Wafer', 
        formula: 'Monocrystalline Silicon → Slicing → Polishing', 
        ingredients: { MonocrystallineSilicon: 1 },
        tier: 8,
        category: 'Silicon Processing',
        skillGain: 30,
        target: 10000,
        icon: '💿',
        unlocksAt: 90000,
        description: 'Polished silicon wafers ready for device fabrication.'
    },
    
    // Doping
    { 
        id: 'p_type_silicon',
        name: 'P-Type Silicon', 
        formula: 'Si + B → Doped Si', 
        ingredients: { SiliconWafer: 1, Boron: 0.1 },
        tier: 8,
        category: 'Doping',
        skillGain: 50,
        target: 10000,
        icon: '🔵',
        unlocksAt: 95000,
        description: 'Boron-doped silicon with positive charge carriers.'
    },
    { 
        id: 'n_type_silicon',
        name: 'N-Type Silicon', 
        formula: 'Si + P → Doped Si', 
        ingredients: { SiliconWafer: 1, Phosphorus: 0.1 },
        tier: 8,
        category: 'Doping',
        skillGain: 50,
        target: 10000,
        icon: '🔴',
        unlocksAt: 100000,
        description: 'Phosphorus-doped silicon with negative charge carriers.'
    },
    
    // Dielectrics
    { 
        id: 'silicon_dioxide_thin_film',
        name: 'Silicon Dioxide Thin Film', 
        formula: 'Si + O₂ → SiO₂ (thin film)', 
        ingredients: { Silicon: 1, Oxygen: 2 },
        tier: 8,
        category: 'Dielectrics',
        skillGain: 30,
        target: 10000,
        icon: '🔲',
        unlocksAt: 105000,
        description: 'Insulating layer for semiconductor devices.'
    },
    { 
        id: 'silicon_nitride',
        name: 'Silicon Nitride', 
        formula: '3Si + 4N → Si₃N₄', 
        ingredients: { Silicon: 3, Nitrogen: 4 },
        tier: 8,
        category: 'Dielectrics',
        skillGain: 50,
        target: 10000,
        icon: '🔳',
        unlocksAt: 110000,
        description: 'Hard, insulating material for chip passivation.'
    },
    
    // Devices
    { 
        id: 'diode',
        name: 'P-N Junction Diode', 
        formula: 'P-Type + N-Type → Diode', 
        ingredients: { PTypeSilicon: 1, NTypeSilicon: 1 },
        tier: 8,
        category: 'Devices',
        skillGain: 80,
        target: 10000,
        icon: '➡️',
        unlocksAt: 120000,
        description: 'Allows current to flow in one direction.'
    },
    { 
        id: 'transistor',
        name: 'Bipolar Junction Transistor', 
        formula: 'NPN or PNP structure', 
        ingredients: { PTypeSilicon: 2, NTypeSilicon: 1 },
        tier: 8,
        category: 'Devices',
        skillGain: 120,
        target: 10000,
        icon: '🔌',
        unlocksAt: 130000,
        description: 'Amplifies or switches electronic signals.'
    },
    { 
        id: 'mosfet',
        name: 'MOSFET', 
        formula: 'Metal-Oxide-Semiconductor structure', 
        ingredients: { PTypeSilicon: 1, SiliconDioxide: 1, Aluminum: 1 },
        tier: 8,
        category: 'Devices',
        skillGain: 150,
        target: 10000,
        icon: '💻',
        unlocksAt: 140000,
        description: 'The fundamental building block of modern electronics.'
    },
    { 
        id: 'cmos',
        name: 'CMOS Circuit', 
        formula: 'Complementary MOSFETs', 
        ingredients: { MOSFET: 2 },
        tier: 8,
        category: 'Integrated Circuits',
        skillGain: 200,
        target: 10000,
        icon: '🧠',
        unlocksAt: 150000,
        description: 'Low-power logic circuits for microprocessors.'
    },
    { 
        id: 'microprocessor',
        name: 'Microprocessor', 
        formula: 'Millions of transistors integrated', 
        ingredients: { CMOS: 1000000 },
        tier: 8,
        category: 'Integrated Circuits',
        skillGain: 1000,
        target: 10000,
        icon: '⚙️',
        unlocksAt: 200000,
        description: 'The brain of computers. Contains millions of transistors.'
    }
];

// ===== TIER 9: ENERGY & ADVANCED MATERIALS =====
const TIER_9_ENERGY_ADVANCED = [
    // Batteries
    { 
        id: 'lead_acid_battery',
        name: 'Lead-Acid Battery', 
        formula: 'Pb + PbO₂ + H₂SO₄ → Battery', 
        ingredients: { Lead: 5, LeadOxide: 5, SulfuricAcid: 3 },
        tier: 9,
        category: 'Energy Storage',
        skillGain: 100,
        target: 20000,
        icon: '🔋',
        unlocksAt: 250000,
        description: 'Reliable, rechargeable battery for vehicles and backup power.'
    },
    { 
        id: 'lithium_ion_battery',
        name: 'Lithium-Ion Cell', 
        formula: 'LiCoO₂ + Graphite + Electrolyte → Cell', 
        ingredients: { Lithium: 1, Cobalt: 1, Graphite: 2, Electrolyte: 1 },
        tier: 9,
        category: 'Energy Storage',
        skillGain: 200,
        target: 20000,
        icon: '🔋',
        unlocksAt: 300000,
        description: 'High-energy-density rechargeable battery for portable electronics.'
    },
    { 
        id: 'fuel_cell',
        name: 'PEM Fuel Cell', 
        formula: 'Membrane + Catalyst + Plates → Cell', 
        ingredients: { Platinum: 1, Membrane: 1, Graphite: 2 },
        tier: 9,
        category: 'Energy Generation',
        skillGain: 250,
        target: 20000,
        icon: '⚡',
        unlocksAt: 350000,
        description: 'Converts hydrogen and oxygen into electricity.'
    },
    
    // Solar
    { 
        id: 'solar_cell',
        name: 'Silicon Solar Cell', 
        formula: 'P-N Junction → Photovoltaic Cell', 
        ingredients: { PTypeSilicon: 1, NTypeSilicon: 1, Silver: 0.1 },
        tier: 9,
        category: 'Energy Generation',
        skillGain: 150,
        target: 20000,
        icon: '☀️',
        unlocksAt: 400000,
        description: 'Converts sunlight directly into electricity.'
    },
    
    // Nanomaterials
    { 
        id: 'graphene',
        name: 'Graphene', 
        formula: 'C → 2D layer', 
        ingredients: { Carbon: 20 },
        tier: 9,
        category: 'Nanomaterials',
        skillGain: 250,
        target: 20000,
        icon: '⬛',
        unlocksAt: 450000,
        description: 'One-atom-thick layer of carbon. Stronger than steel, conductive, and flexible.'
    },
    { 
        id: 'carbon_nanotube',
        name: 'Carbon Nanotube', 
        formula: 'C → Cylindrical nanostructure', 
        ingredients: { Carbon: 50 },
        tier: 9,
        category: 'Nanomaterials',
        skillGain: 300,
        target: 20000,
        icon: '🧬',
        unlocksAt: 500000,
        description: 'Cylindrical carbon molecules with extraordinary strength and conductivity.'
    },
    { 
        id: 'quantum_dot',
        name: 'Quantum Dots', 
        formula: 'CdSe → Nanoparticles', 
        ingredients: { Cadmium: 5, Selenium: 5 },
        tier: 9,
        category: 'Nanomaterials',
        skillGain: 280,
        target: 20000,
        icon: '🔴',
        unlocksAt: 550000,
        description: 'Nanoscale semiconductor particles with size-tunable optical properties.'
    },
    
    // Smart Materials
    { 
        id: 'nitinol',
        name: 'Nitinol (Shape Memory Alloy)', 
        formula: 'Ni + Ti → Alloy with training', 
        ingredients: { Nickel: 5, Titanium: 5 },
        tier: 9,
        category: 'Smart Materials',
        skillGain: 150,
        target: 20000,
        icon: '🔄',
        unlocksAt: 600000,
        description: 'Remembers its shape. Returns to pre-formed shape when heated.'
    },
    { 
        id: 'piezoelectric_ceramic',
        name: 'PZT (Lead Zirconate Titanate)', 
        formula: 'Pb + Zr + Ti + O → Ceramic', 
        ingredients: { Lead: 1, Zirconium: 1, Titanium: 1, Oxygen: 3 },
        tier: 9,
        category: 'Smart Materials',
        skillGain: 120,
        target: 20000,
        icon: '⚡',
        unlocksAt: 650000,
        description: 'Generates electricity when compressed. Used in sensors and actuators.'
    }
];

// ===== TIER 10: EXOTIC MATTER =====
const TIER_10_EXOTIC = [
    // Antimatter
    { 
        id: 'positrons',
        name: 'Positrons', 
        formula: 'High energy → e⁺', 
        ingredients: { Energy: 1000000 },
        tier: 10,
        category: 'Antimatter',
        skillGain: 500,
        target: 50000,
        icon: '✨',
        unlocksAt: 800000,
        description: 'Antielectrons. Used in PET scans and for annihilation reactions.'
    },
    { 
        id: 'antihydrogen',
        name: 'Antihydrogen', 
        formula: 'p⁻ + e⁺ → H̅', 
        ingredients: { Antiprotons: 1, Positrons: 1 },
        tier: 10,
        category: 'Antimatter',
        skillGain: 2000,
        target: 50000,
        icon: '⚡',
        unlocksAt: 900000,
        description: 'The simplest antimatter atom. Studied for fundamental physics.'
    },
    
    // Superheavy Elements
    { 
        id: 'californium',
        name: 'Californium', 
        formula: 'Nuclear synthesis', 
        ingredients: { Curium: 1, Neutrons: 10 },
        tier: 10,
        category: 'Superheavy Elements',
        skillGain: 400,
        target: 50000,
        icon: '☢️',
        unlocksAt: 950000,
        description: 'Intense neutron source. Used in nuclear reactors and cancer treatment.'
    },
    { 
        id: 'oganesson',
        name: 'Oganesson', 
        formula: 'Nuclear fusion', 
        ingredients: { Californium: 1, Calcium: 1 },
        tier: 10,
        category: 'Superheavy Elements',
        skillGain: 1350,
        target: 50000,
        icon: '💫',
        unlocksAt: 1000000,
        description: 'The heaviest element. A noble gas with relativistic effects.'
    },
    
    // Room Temperature Superconductor (The Holy Grail)
    { 
        id: 'room_temp_superconductor',
        name: 'Room Temperature Superconductor', 
        formula: '???', 
        ingredients: { Hydrogen: 1000000, Carbon: 500000, ExoticConditions: 1 },
        tier: 10,
        category: 'Exotic Materials',
        skillGain: 10000,
        target: 100000,
        icon: '🏆',
        unlocksAt: 2000000,
        description: 'THE HOLY GRAIL. Conducts electricity with zero resistance at room temperature. Transforms civilization.'
    }
];

// ===== COMBINE ALL RECIPES =====
export const ALCHEMY_RECIPES = {
    'Basic Compounds': TIER_1_BASIC_COMPOUNDS,
    'Acids & Bases': TIER_2_ACIDS_BASES,
    'Salts & Minerals': TIER_3_SALTS_MINERALS,
    'Hydrocarbons': TIER_4_ORGANIC.filter(r => r.category === 'Hydrocarbons'),
    'Alcohols': TIER_4_ORGANIC.filter(r => r.category === 'Alcohols'),
    'Organic Acids': TIER_4_ORGANIC.filter(r => r.category === 'Organic Acids'),
    'Esters': TIER_4_ORGANIC.filter(r => r.category === 'Esters'),
    'Ethers': TIER_4_ORGANIC.filter(r => r.category === 'Ethers'),
    'Amines': TIER_4_ORGANIC.filter(r => r.category === 'Amines'),
    'Monomers': TIER_5_POLYMERS.filter(r => r.category === 'Monomers'),
    'Polymers': TIER_5_POLYMERS.filter(r => r.category === 'Polymers'),
    'Engineering Plastics': TIER_5_POLYMERS.filter(r => r.category === 'Engineering Plastics'),
    'Basic Alloys': TIER_6_METALLURGY.filter(r => r.category === 'Basic Alloys'),
    'Stainless Steels': TIER_6_METALLURGY.filter(r => r.category === 'Stainless Steels'),
    'Tool Steels': TIER_6_METALLURGY.filter(r => r.category === 'Tool Steels'),
    'Aluminum Alloys': TIER_6_METALLURGY.filter(r => r.category === 'Aluminum Alloys'),
    'Titanium Alloys': TIER_6_METALLURGY.filter(r => r.category === 'Titanium Alloys'),
    'Superalloys': TIER_6_METALLURGY.filter(r => r.category === 'Superalloys'),
    'Refractory Alloys': TIER_6_METALLURGY.filter(r => r.category === 'Refractory Alloys'),
    'Fibers': TIER_7_COMPOSITES.filter(r => r.category === 'Fibers'),
    'Matrix Materials': TIER_7_COMPOSITES.filter(r => r.category === 'Matrix Materials'),
    'Composites': TIER_7_COMPOSITES.filter(r => r.category === 'Composites'),
    'Advanced Composites': TIER_7_COMPOSITES.filter(r => r.category === 'Advanced Composites'),
    'Silicon Processing': TIER_8_SEMICONDUCTORS.filter(r => r.category === 'Silicon Processing'),
    'Doping': TIER_8_SEMICONDUCTORS.filter(r => r.category === 'Doping'),
    'Dielectrics': TIER_8_SEMICONDUCTORS.filter(r => r.category === 'Dielectrics'),
    'Devices': TIER_8_SEMICONDUCTORS.filter(r => r.category === 'Devices'),
    'Integrated Circuits': TIER_8_SEMICONDUCTORS.filter(r => r.category === 'Integrated Circuits'),
    'Energy Storage': TIER_9_ENERGY_ADVANCED.filter(r => r.category === 'Energy Storage'),
    'Energy Generation': TIER_9_ENERGY_ADVANCED.filter(r => r.category === 'Energy Generation'),
    'Nanomaterials': TIER_9_ENERGY_ADVANCED.filter(r => r.category === 'Nanomaterials'),
    'Smart Materials': TIER_9_ENERGY_ADVANCED.filter(r => r.category === 'Smart Materials'),
    'Antimatter': TIER_10_EXOTIC.filter(r => r.category === 'Antimatter'),
    'Superheavy Elements': TIER_10_EXOTIC.filter(r => r.category === 'Superheavy Elements'),
    'Exotic Materials': TIER_10_EXOTIC.filter(r => r.category === 'Exotic Materials')
};

// ===== HELPER FUNCTIONS =====

// Get level from progress
export function getLevelFromProgress(progress) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (progress >= LEVEL_THRESHOLDS[i].threshold) {
            return LEVEL_THRESHOLDS[i];
        }
    }
    return LEVEL_THRESHOLDS[0];
}

// Get total crafts from progress object
export function getTotalCrafts(progress) {
    return Object.values(progress).reduce((sum, val) => sum + val, 0);
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
export async function getCurrentInventory() {
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
        const newProgress = currentProgress + (count * recipe.skillGain);
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
            multiplier: newLevel.multiplier,
            skillGain: recipe.skillGain
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
    const totalCrafts = getTotalCrafts(progress);
    const recipesWithProgress = {};
    
    for (const [category, recipes] of Object.entries(ALCHEMY_RECIPES)) {
        recipesWithProgress[category] = recipes.map(recipe => {
            const prog = progress[recipe.id] || 0;
            const level = getLevelFromProgress(prog);
            // Unlocked if total crafts >= unlocksAt OR it's a basic recipe (unlocksAt <= 100)
            const unlocked = totalCrafts >= recipe.unlocksAt || recipe.unlocksAt <= 100;
            
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

// Check if a specific recipe is unlocked
export function isRecipeUnlocked(recipeId) {
    const progress = loadAlchemyProgress();
    const totalCrafts = getTotalCrafts(progress);
    
    // Find the recipe
    for (const category of Object.values(ALCHEMY_RECIPES)) {
        const recipe = category.find(r => r.id === recipeId);
        if (recipe) {
            return totalCrafts >= recipe.unlocksAt || recipe.unlocksAt <= 100;
        }
    }
    return false;
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

// ===== EXPORT ALL =====
export default {
    ALCHEMY_RECIPES,
    LEVEL_THRESHOLDS,
    getLevelFromProgress,
    getTotalCrafts,
    hasIngredients,
    getCurrentInventory,
    craftItem,
    loadAlchemyProgress,
    getRecipesWithProgress,
    isRecipeUnlocked,
    getRecipeById,
    calculateRequiredMaterials,
    canCraftBatch,
    batchCraft,
    getMasteryLevelName,
    getMasteryMultiplier,
    getProgressToNextLevel
};

// ===== GLOBAL EXPOSURE FOR HTML ACCESS =====
// Make functions available globally for HTML onclick handlers
window.getCurrentInventory = getCurrentInventory;
window.craftItem = craftItem;
window.getLevelFromProgress = getLevelFromProgress;
window.getRecipesWithProgress = getRecipesWithProgress;
window.ALCHEMY_RECIPES = ALCHEMY_RECIPES;
window.LEVEL_THRESHOLDS = LEVEL_THRESHOLDS;
window.hasIngredients = hasIngredients;
window.getTotalCrafts = getTotalCrafts;
window.getMasteryLevelName = getMasteryLevelName;
window.getMasteryMultiplier = getMasteryMultiplier;
window.getProgressToNextLevel = getProgressToNextLevel;

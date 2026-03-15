// js/recipe-database.js - Complete Alchemy Recipe Database
// Contains all recipes from Tier 1 to Tier 10 with full metadata

// ===== TIER 1: BASIC COMPOUNDS =====
export const TIER_1_BASIC_COMPOUNDS = [
    { 
        id: 'water',
        name: 'Water', 
        formula: '2H + 1O → H₂O', 
        ingredients: { Hydrogen: 2, Oxygen: 1 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Oxides',
        skillGain: 1,
        target: 100,
        icon: '💧',
        unlocksAt: 0,
        value: 10,
        description: 'The foundation of life and chemistry. Every journey begins with a single molecule.',
        laborMultiplier: 1.0,
        usedIn: ['coolant', 'electrolysis', 'hydration']
    },
    { 
        id: 'methane',
        name: 'Methane', 
        formula: '1C + 4H → CH₄', 
        ingredients: { Carbon: 1, Hydrogen: 4 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Hydrocarbons',
        skillGain: 1,
        target: 100,
        icon: '🔥',
        unlocksAt: 0,
        value: 15,
        description: 'The simplest hydrocarbon. Fuel for stars and factories alike.',
        laborMultiplier: 1.0,
        usedIn: ['fuel', 'methanol', 'hydrogen']
    },
    { 
        id: 'ammonia',
        name: 'Ammonia', 
        formula: '1N + 3H → NH₃', 
        ingredients: { Nitrogen: 1, Hydrogen: 3 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Nitrogen Compounds',
        skillGain: 1,
        target: 100,
        icon: '⚗️',
        unlocksAt: 0,
        value: 12,
        description: 'Essential for fertilizers and industrial chemistry.',
        laborMultiplier: 1.0,
        usedIn: ['fertilizer', 'nitric_acid', 'amines']
    },
    { 
        id: 'hydrogen_peroxide',
        name: 'Hydrogen Peroxide', 
        formula: '2H + 2O → H₂O₂', 
        ingredients: { Hydrogen: 2, Oxygen: 2 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Peroxides',
        skillGain: 2,
        target: 100,
        icon: '💧',
        unlocksAt: 0,
        value: 20,
        description: 'A powerful oxidizer and disinfectant.',
        laborMultiplier: 1.1,
        usedIn: ['bleach', 'rocket_fuel', 'disinfectant']
    },
    { 
        id: 'carbon_dioxide',
        name: 'Carbon Dioxide', 
        formula: '1C + 2O → CO₂', 
        ingredients: { Carbon: 1, Oxygen: 2 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Oxides',
        skillGain: 1,
        target: 100,
        icon: '💨',
        unlocksAt: 0,
        value: 8,
        description: 'The breath of industry. Essential for life support and carbon chemistry.',
        laborMultiplier: 1.0,
        usedIn: ['carbonation', 'fire_suppression', 'dry_ice']
    },
    { 
        id: 'carbon_monoxide',
        name: 'Carbon Monoxide', 
        formula: '1C + 1O → CO', 
        ingredients: { Carbon: 1, Oxygen: 1 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Oxides',
        skillGain: 1,
        target: 100,
        icon: '💨',
        unlocksAt: 0,
        value: 10,
        description: 'A toxic but useful reducing agent in metallurgy.',
        laborMultiplier: 1.0,
        usedIn: ['methanol', 'metal_refining', 'syn_gas']
    },
    { 
        id: 'sulfur_dioxide',
        name: 'Sulfur Dioxide', 
        formula: '1S + 2O → SO₂', 
        ingredients: { Sulfur: 1, Oxygen: 2 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Oxides',
        skillGain: 2,
        target: 100,
        icon: '🌋',
        unlocksAt: 0,
        value: 15,
        description: 'Volcanic gas essential for sulfuric acid production.',
        laborMultiplier: 1.1,
        usedIn: ['sulfuric_acid', 'preservative', 'bleaching']
    },
    { 
        id: 'hydrogen_sulfide',
        name: 'Hydrogen Sulfide', 
        formula: '2H + 1S → H₂S', 
        ingredients: { Hydrogen: 2, Sulfur: 1 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Sulfur Compounds',
        skillGain: 2,
        target: 100,
        icon: '🥚',
        unlocksAt: 0,
        value: 12,
        description: 'Rotten egg gas. A source of sulfur for industrial processes.',
        laborMultiplier: 1.1,
        usedIn: ['sulfur', 'metallurgy', 'chemical_synthesis']
    },
    { 
        id: 'hydrogen_chloride',
        name: 'Hydrogen Chloride', 
        formula: '1H + 1Cl → HCl', 
        ingredients: { Hydrogen: 1, Chlorine: 1 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Acid Anhydrides',
        skillGain: 2,
        target: 100,
        icon: '🧪',
        unlocksAt: 0,
        value: 15,
        description: 'Forms hydrochloric acid when dissolved in water.',
        laborMultiplier: 1.1,
        usedIn: ['hydrochloric_acid', 'pvc', 'chlorides']
    },
    { 
        id: 'sodium_oxide',
        name: 'Sodium Oxide', 
        formula: '2Na + 1O → Na₂O', 
        ingredients: { Sodium: 2, Oxygen: 1 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Metal Oxides',
        skillGain: 2,
        target: 100,
        icon: '🧂',
        unlocksAt: 0,
        value: 15,
        description: 'A basic oxide used in glass manufacturing.',
        laborMultiplier: 1.1,
        usedIn: ['glass', 'ceramics', 'sodium_hydroxide']
    },
    { 
        id: 'magnesium_oxide',
        name: 'Magnesium Oxide', 
        formula: '1Mg + 1O → MgO', 
        ingredients: { Magnesium: 1, Oxygen: 1 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Metal Oxides',
        skillGain: 2,
        target: 100,
        icon: '⚪',
        unlocksAt: 0,
        value: 15,
        description: 'Refractory material for high-temperature applications.',
        laborMultiplier: 1.1,
        usedIn: ['refractories', 'cement', 'medicine']
    },
    { 
        id: 'aluminum_oxide',
        name: 'Aluminum Oxide', 
        formula: '2Al + 3O → Al₂O₃', 
        ingredients: { Aluminum: 2, Oxygen: 3 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Metal Oxides',
        skillGain: 3,
        target: 100,
        icon: '💎',
        unlocksAt: 0,
        value: 20,
        description: 'Corundum. One of the hardest materials. Precursor to aluminum.',
        laborMultiplier: 1.2,
        usedIn: ['aluminum', 'abrasives', 'ceramics']
    },
    { 
        id: 'silicon_dioxide',
        name: 'Silicon Dioxide', 
        formula: '1Si + 2O → SiO₂', 
        ingredients: { Silicon: 1, Oxygen: 2 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Metal Oxides',
        skillGain: 3,
        target: 100,
        icon: '🪨',
        unlocksAt: 0,
        value: 18,
        description: 'Quartz. The foundation of glass and semiconductors.',
        laborMultiplier: 1.2,
        usedIn: ['glass', 'semiconductors', 'ceramics']
    },
    { 
        id: 'iron_oxide',
        name: 'Iron Oxide', 
        formula: '2Fe + 3O → Fe₂O₃', 
        ingredients: { Iron: 2, Oxygen: 3 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Metal Oxides',
        skillGain: 3,
        target: 100,
        icon: '🟤',
        unlocksAt: 0,
        value: 15,
        description: 'Rust. The first step in iron production.',
        laborMultiplier: 1.2,
        usedIn: ['iron', 'steel', 'pigments']
    },
    { 
        id: 'calcium_oxide',
        name: 'Calcium Oxide', 
        formula: '1Ca + 1O → CaO', 
        ingredients: { Calcium: 1, Oxygen: 1 },
        tier: 1,
        category: 'Basic Compounds',
        subcategory: 'Metal Oxides',
        skillGain: 2,
        target: 100,
        icon: '⚪',
        unlocksAt: 0,
        value: 12,
        description: 'Quicklime. Essential for cement and steel production.',
        laborMultiplier: 1.1,
        usedIn: ['cement', 'steel', 'water_treatment']
    }
];

// ===== TIER 2: ACIDS & BASES =====
export const TIER_2_ACIDS_BASES = [
    { 
        id: 'sulfuric_acid',
        name: 'Sulfuric Acid', 
        formula: '2H + 1S + 4O → H₂SO₄', 
        ingredients: { Hydrogen: 2, Sulfur: 1, Oxygen: 4 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Mineral Acids',
        skillGain: 5,
        target: 200,
        icon: '🧪',
        unlocksAt: 100,
        value: 50,
        description: 'The king of chemicals. Used in nearly every industrial process.',
        laborMultiplier: 1.3,
        usedIn: ['fertilizer', 'chemical_processing', 'batteries']
    },
    { 
        id: 'nitric_acid',
        name: 'Nitric Acid', 
        formula: '1H + 1N + 3O → HNO₃', 
        ingredients: { Hydrogen: 1, Nitrogen: 1, Oxygen: 3 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Mineral Acids',
        skillGain: 5,
        target: 200,
        icon: '🧪',
        unlocksAt: 100,
        value: 55,
        description: 'Essential for fertilizers, explosives, and etching.',
        laborMultiplier: 1.3,
        usedIn: ['fertilizer', 'explosives', 'etching']
    },
    { 
        id: 'hydrochloric_acid',
        name: 'Hydrochloric Acid', 
        formula: '1H + 1Cl → HCl', 
        ingredients: { Hydrogen: 1, Chlorine: 1 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Mineral Acids',
        skillGain: 3,
        target: 200,
        icon: '🧪',
        unlocksAt: 100,
        value: 40,
        description: 'A strong acid used for cleaning and ore processing.',
        laborMultiplier: 1.2,
        usedIn: ['cleaning', 'ore_processing', 'chemical_synthesis']
    },
    { 
        id: 'phosphoric_acid',
        name: 'Phosphoric Acid', 
        formula: '3H + 1P + 4O → H₃PO₄', 
        ingredients: { Hydrogen: 3, Phosphorus: 1, Oxygen: 4 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Mineral Acids',
        skillGain: 8,
        target: 200,
        icon: '🧪',
        unlocksAt: 150,
        value: 70,
        description: 'Used in fertilizers, food additives, and rust removal.',
        laborMultiplier: 1.4,
        usedIn: ['fertilizer', 'food', 'rust_removal']
    },
    { 
        id: 'carbonic_acid',
        name: 'Carbonic Acid', 
        formula: '2H + 1C + 3O → H₂CO₃', 
        ingredients: { Hydrogen: 2, Carbon: 1, Oxygen: 3 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Weak Acids',
        skillGain: 4,
        target: 200,
        icon: '💧',
        unlocksAt: 100,
        value: 30,
        description: 'Weak acid formed from CO₂ and water. Important in carbonation.',
        laborMultiplier: 1.2,
        usedIn: ['carbonation', 'buffer', 'geology']
    },
    { 
        id: 'acetic_acid',
        name: 'Acetic Acid', 
        formula: '2C + 4H + 2O → CH₃COOH', 
        ingredients: { Carbon: 2, Hydrogen: 4, Oxygen: 2 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Organic Acids',
        skillGain: 10,
        target: 200,
        icon: '🍶',
        unlocksAt: 200,
        value: 60,
        description: 'Vinegar. Essential for organic synthesis and esters.',
        laborMultiplier: 1.5,
        usedIn: ['vinegar', 'esters', 'solvents']
    },
    { 
        id: 'hydrofluoric_acid',
        name: 'Hydrofluoric Acid', 
        formula: '1H + 1F → HF', 
        ingredients: { Hydrogen: 1, Fluorine: 1 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Specialty Acids',
        skillGain: 8,
        target: 200,
        icon: '⚠️',
        unlocksAt: 180,
        value: 100,
        description: 'Etches glass. Extremely dangerous but essential for semiconductor processing.',
        laborMultiplier: 1.5,
        usedIn: ['glass_etching', 'semiconductors', 'refining']
    },
    { 
        id: 'sodium_hydroxide',
        name: 'Sodium Hydroxide', 
        formula: '1Na + 1O + 1H → NaOH', 
        ingredients: { Sodium: 1, Oxygen: 1, Hydrogen: 1 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Bases',
        skillGain: 5,
        target: 200,
        icon: '🧪',
        unlocksAt: 100,
        value: 45,
        description: 'Lye. A strong base used in soap making and chemical processing.',
        laborMultiplier: 1.3,
        usedIn: ['soap', 'paper', 'chemical_processing']
    },
    { 
        id: 'potassium_hydroxide',
        name: 'Potassium Hydroxide', 
        formula: '1K + 1O + 1H → KOH', 
        ingredients: { Potassium: 1, Oxygen: 1, Hydrogen: 1 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Bases',
        skillGain: 5,
        target: 200,
        icon: '🧪',
        unlocksAt: 120,
        value: 50,
        description: 'Caustic potash. Used in fertilizers and batteries.',
        laborMultiplier: 1.3,
        usedIn: ['fertilizer', 'batteries', 'soap']
    },
    { 
        id: 'calcium_hydroxide',
        name: 'Calcium Hydroxide', 
        formula: '1Ca + 2O + 2H → Ca(OH)₂', 
        ingredients: { Calcium: 1, Oxygen: 2, Hydrogen: 2 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Bases',
        skillGain: 6,
        target: 200,
        icon: '⚪',
        unlocksAt: 140,
        value: 40,
        description: 'Slaked lime. Used in water treatment and construction.',
        laborMultiplier: 1.4,
        usedIn: ['water_treatment', 'mortar', 'whitewash']
    },
    { 
        id: 'ammonium_hydroxide',
        name: 'Ammonium Hydroxide', 
        formula: '1N + 5H + 1O → NH₄OH', 
        ingredients: { Nitrogen: 1, Hydrogen: 5, Oxygen: 1 },
        tier: 2,
        category: 'Acids & Bases',
        subcategory: 'Bases',
        skillGain: 8,
        target: 200,
        icon: '🧪',
        unlocksAt: 160,
        value: 35,
        description: 'Household ammonia. Used in cleaning and as a precursor to amines.',
        laborMultiplier: 1.4,
        usedIn: ['cleaning', 'amines', 'fertilizer']
    }
];

// ===== TIER 3: SALTS & MINERALS =====
export const TIER_3_SALTS_MINERALS = [
    { 
        id: 'sodium_chloride',
        name: 'Sodium Chloride', 
        formula: '1Na + 1Cl → NaCl', 
        ingredients: { Sodium: 1, Chlorine: 1 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Halides',
        skillGain: 5,
        target: 300,
        icon: '🧂',
        unlocksAt: 500,
        value: 25,
        description: 'Table salt. Essential for life and countless industrial processes.',
        laborMultiplier: 1.3,
        usedIn: ['food', 'chlorine', 'sodium']
    },
    { 
        id: 'potassium_chloride',
        name: 'Potassium Chloride', 
        formula: '1K + 1Cl → KCl', 
        ingredients: { Potassium: 1, Chlorine: 1 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Halides',
        skillGain: 5,
        target: 300,
        icon: '🧂',
        unlocksAt: 550,
        value: 30,
        description: 'A potassium source for fertilizers.',
        laborMultiplier: 1.3,
        usedIn: ['fertilizer', 'medicine', 'food']
    },
    { 
        id: 'calcium_carbonate',
        name: 'Calcium Carbonate', 
        formula: '1Ca + 1C + 3O → CaCO₃', 
        ingredients: { Calcium: 1, Carbon: 1, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Carbonates',
        skillGain: 8,
        target: 300,
        icon: '🪨',
        unlocksAt: 600,
        value: 35,
        description: 'Limestone. Used in cement, construction, and as a flux.',
        laborMultiplier: 1.4,
        usedIn: ['cement', 'construction', 'flux']
    },
    { 
        id: 'sodium_carbonate',
        name: 'Sodium Carbonate', 
        formula: '2Na + 1C + 3O → Na₂CO₃', 
        ingredients: { Sodium: 2, Carbon: 1, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Carbonates',
        skillGain: 10,
        target: 300,
        icon: '🧼',
        unlocksAt: 650,
        value: 40,
        description: 'Soda ash. Used in glass making and water softening.',
        laborMultiplier: 1.5,
        usedIn: ['glass', 'soap', 'water_treatment']
    },
    { 
        id: 'calcium_sulfate',
        name: 'Calcium Sulfate', 
        formula: '1Ca + 1S + 4O → CaSO₄', 
        ingredients: { Calcium: 1, Sulfur: 1, Oxygen: 4 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Sulfates',
        skillGain: 12,
        target: 300,
        icon: '⚪',
        unlocksAt: 700,
        value: 30,
        description: 'Gypsum. Used in drywall and cement.',
        laborMultiplier: 1.5,
        usedIn: ['drywall', 'cement', 'plaster']
    },
    { 
        id: 'sodium_nitrate',
        name: 'Sodium Nitrate', 
        formula: '1Na + 1N + 3O → NaNO₃', 
        ingredients: { Sodium: 1, Nitrogen: 1, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Nitrates',
        skillGain: 10,
        target: 300,
        icon: '🧪',
        unlocksAt: 750,
        value: 45,
        description: 'Chile saltpeter. Used in fertilizers and explosives.',
        laborMultiplier: 1.5,
        usedIn: ['fertilizer', 'explosives', 'preservative']
    },
    { 
        id: 'potassium_nitrate',
        name: 'Potassium Nitrate', 
        formula: '1K + 1N + 3O → KNO₃', 
        ingredients: { Potassium: 1, Nitrogen: 1, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Nitrates',
        skillGain: 10,
        target: 300,
        icon: '🧪',
        unlocksAt: 800,
        value: 50,
        description: 'Saltpeter. Essential for gunpowder and fireworks.',
        laborMultiplier: 1.5,
        usedIn: ['gunpowder', 'fireworks', 'fertilizer']
    },
    { 
        id: 'ammonium_nitrate',
        name: 'Ammonium Nitrate', 
        formula: '2N + 4H + 3O → NH₄NO₃', 
        ingredients: { Nitrogen: 2, Hydrogen: 4, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Nitrates',
        skillGain: 15,
        target: 300,
        icon: '💥',
        unlocksAt: 850,
        value: 60,
        description: 'A powerful fertilizer and explosive component.',
        laborMultiplier: 1.6,
        usedIn: ['fertilizer', 'explosives', 'cold_packs']
    },
    { 
        id: 'copper_sulfate',
        name: 'Copper Sulfate', 
        formula: '1Cu + 1S + 4O → CuSO₄', 
        ingredients: { Copper: 1, Sulfur: 1, Oxygen: 4 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Sulfates',
        skillGain: 12,
        target: 300,
        icon: '🔵',
        unlocksAt: 900,
        value: 55,
        description: 'Blue vitriol. Used in electroplating and agriculture.',
        laborMultiplier: 1.5,
        usedIn: ['electroplating', 'fungicide', 'algicide']
    },
    { 
        id: 'iron_sulfate',
        name: 'Iron Sulfate', 
        formula: '1Fe + 1S + 4O → FeSO₄', 
        ingredients: { Iron: 1, Sulfur: 1, Oxygen: 4 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Sulfates',
        skillGain: 12,
        target: 300,
        icon: '🟢',
        unlocksAt: 950,
        value: 40,
        description: 'Used in water treatment and as a dietary supplement.',
        laborMultiplier: 1.5,
        usedIn: ['water_treatment', 'supplement', 'pigment']
    },
    { 
        id: 'quartz',
        name: 'Quartz', 
        formula: '1Si + 2O → SiO₂', 
        ingredients: { Silicon: 1, Oxygen: 2 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Silicates',
        skillGain: 5,
        target: 300,
        icon: '💎',
        unlocksAt: 1000,
        value: 80,
        description: 'Pure crystalline silica. Used in electronics and timekeeping.',
        laborMultiplier: 1.4,
        usedIn: ['oscillators', 'glass', 'electronics']
    },
    { 
        id: 'corundum',
        name: 'Corundum', 
        formula: '2Al + 3O → Al₂O₃', 
        ingredients: { Aluminum: 2, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Oxides',
        skillGain: 8,
        target: 300,
        icon: '🔴',
        unlocksAt: 1100,
        value: 150,
        description: 'Sapphire and ruby. An extremely hard mineral for abrasives and lasers.',
        laborMultiplier: 1.5,
        usedIn: ['abrasives', 'lasers', 'jewelry']
    },
    { 
        id: 'hematite',
        name: 'Hematite', 
        formula: '2Fe + 3O → Fe₂O₃', 
        ingredients: { Iron: 2, Oxygen: 3 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Oxides',
        skillGain: 8,
        target: 300,
        icon: '⚫',
        unlocksAt: 1200,
        value: 60,
        description: 'Iron ore. The primary source of iron.',
        laborMultiplier: 1.4,
        usedIn: ['iron', 'steel', 'pigment']
    },
    { 
        id: 'magnetite',
        name: 'Magnetite', 
        formula: '3Fe + 4O → Fe₃O₄', 
        ingredients: { Iron: 3, Oxygen: 4 },
        tier: 3,
        category: 'Salts & Minerals',
        subcategory: 'Oxides',
        skillGain: 10,
        target: 300,
        icon: '🧲',
        unlocksAt: 1300,
        value: 80,
        description: 'Magnetic iron ore. Used in data storage and as a catalyst.',
        laborMultiplier: 1.5,
        usedIn: ['data_storage', 'catalyst', 'magnetic_materials']
    }
];

// ===== TIER 4: ORGANIC CHEMISTRY =====
export const TIER_4_ORGANIC = [
    // Hydrocarbons
    { 
        id: 'ethylene',
        name: 'Ethylene', 
        formula: '2C + 4H → C₂H₄', 
        ingredients: { Carbon: 2, Hydrogen: 4 },
        tier: 4,
        category: 'Hydrocarbons',
        subcategory: 'Alkenes',
        skillGain: 10,
        target: 500,
        icon: '🧪',
        unlocksAt: 2000,
        value: 100,
        description: 'The most produced organic compound. Used to make polyethylene.',
        laborMultiplier: 1.6,
        usedIn: ['polyethylene', 'ethylene_glycol', 'styrene']
    },
    { 
        id: 'acetylene',
        name: 'Acetylene', 
        formula: '2C + 2H → C₂H₂', 
        ingredients: { Carbon: 2, Hydrogen: 2 },
        tier: 4,
        category: 'Hydrocarbons',
        subcategory: 'Alkynes',
        skillGain: 12,
        target: 500,
        icon: '🔥',
        unlocksAt: 2200,
        value: 120,
        description: 'Used in welding torches and as a chemical building block.',
        laborMultiplier: 1.7,
        usedIn: ['welding', 'chemical_synthesis', 'plastics']
    },
    { 
        id: 'propylene',
        name: 'Propylene', 
        formula: '3C + 6H → C₃H₆', 
        ingredients: { Carbon: 3, Hydrogen: 6 },
        tier: 4,
        category: 'Hydrocarbons',
        subcategory: 'Alkenes',
        skillGain: 15,
        target: 500,
        icon: '🧪',
        unlocksAt: 2500,
        value: 130,
        description: 'Used to make polypropylene and other plastics.',
        laborMultiplier: 1.8,
        usedIn: ['polypropylene', 'acrylonitrile', 'propylene_oxide']
    },
    { 
        id: 'butadiene',
        name: 'Butadiene', 
        formula: '4C + 6H → C₄H₆', 
        ingredients: { Carbon: 4, Hydrogen: 6 },
        tier: 4,
        category: 'Hydrocarbons',
        subcategory: 'Dienes',
        skillGain: 18,
        target: 500,
        icon: '🧪',
        unlocksAt: 2800,
        value: 150,
        description: 'Used in synthetic rubber production.',
        laborMultiplier: 1.8,
        usedIn: ['rubber', 'plastics', 'chemicals']
    },
    { 
        id: 'benzene',
        name: 'Benzene', 
        formula: '6C + 6H → C₆H₆', 
        ingredients: { Carbon: 6, Hydrogen: 6 },
        tier: 4,
        category: 'Hydrocarbons',
        subcategory: 'Aromatics',
        skillGain: 25,
        target: 500,
        icon: '⚫',
        unlocksAt: 3000,
        value: 200,
        description: 'The fundamental aromatic compound. Precursor to countless chemicals.',
        laborMultiplier: 2.0,
        usedIn: ['styrene', 'phenol', 'nylon']
    },
    { 
        id: 'toluene',
        name: 'Toluene', 
        formula: '7C + 8H → C₇H₈', 
        ingredients: { Carbon: 7, Hydrogen: 8 },
        tier: 4,
        category: 'Hydrocarbons',
        subcategory: 'Aromatics',
        skillGain: 30,
        target: 500,
        icon: '🧪',
        unlocksAt: 3500,
        value: 180,
        description: 'Solvent and precursor to TNT and other compounds.',
        laborMultiplier: 2.1,
        usedIn: ['tnt', 'solvent', 'chemicals']
    },
    
    // Alcohols
    { 
        id: 'methanol',
        name: 'Methanol', 
        formula: '1C + 4H + 1O → CH₃OH', 
        ingredients: { Carbon: 1, Hydrogen: 4, Oxygen: 1 },
        tier: 4,
        category: 'Alcohols',
        subcategory: 'Primary Alcohols',
        skillGain: 15,
        target: 500,
        icon: '🧪',
        unlocksAt: 4000,
        value: 90,
        description: 'Wood alcohol. Used as fuel and solvent.',
        laborMultiplier: 1.7,
        usedIn: ['fuel', 'solvent', 'formaldehyde']
    },
    { 
        id: 'ethanol',
        name: 'Ethanol', 
        formula: '2C + 6H + 1O → C₂H₅OH', 
        ingredients: { Carbon: 2, Hydrogen: 6, Oxygen: 1 },
        tier: 4,
        category: 'Alcohols',
        subcategory: 'Primary Alcohols',
        skillGain: 20,
        target: 500,
        icon: '🍶',
        unlocksAt: 4500,
        value: 85,
        description: 'Grain alcohol. Fuel, solvent, and beverage.',
        laborMultiplier: 1.8,
        usedIn: ['fuel', 'beverage', 'solvent']
    },
    { 
        id: 'isopropanol',
        name: 'Isopropanol', 
        formula: '3C + 8H + 1O → C₃H₇OH', 
        ingredients: { Carbon: 3, Hydrogen: 8, Oxygen: 1 },
        tier: 4,
        category: 'Alcohols',
        subcategory: 'Secondary Alcohols',
        skillGain: 25,
        target: 500,
        icon: '🧴',
        unlocksAt: 5000,
        value: 95,
        description: 'Rubbing alcohol. Disinfectant and solvent.',
        laborMultiplier: 1.9,
        usedIn: ['disinfectant', 'solvent', 'cleaner']
    },
    { 
        id: 'ethylene_glycol',
        name: 'Ethylene Glycol', 
        formula: '2C + 6H + 2O → C₂H₄(OH)₂', 
        ingredients: { Carbon: 2, Hydrogen: 6, Oxygen: 2 },
        tier: 4,
        category: 'Alcohols',
        subcategory: 'Diols',
        skillGain: 35,
        target: 500,
        icon: '❄️',
        unlocksAt: 5500,
        value: 120,
        description: 'Antifreeze. Essential for coolant systems.',
        laborMultiplier: 2.0,
        usedIn: ['antifreeze', 'coolant', 'polyester']
    },
    { 
        id: 'glycerol',
        name: 'Glycerol', 
        formula: '3C + 8H + 3O → C₃H₅(OH)₃', 
        ingredients: { Carbon: 3, Hydrogen: 8, Oxygen: 3 },
        tier: 4,
        category: 'Alcohols',
        subcategory: 'Triols',
        skillGain: 40,
        target: 500,
        icon: '🧴',
        unlocksAt: 6000,
        value: 140,
        description: 'Used in pharmaceuticals, cosmetics, and to make nitroglycerin.',
        laborMultiplier: 2.1,
        usedIn: ['cosmetics', 'explosives', 'food']
    },
    
    // Organic Acids
    { 
        id: 'formic_acid',
        name: 'Formic Acid', 
        formula: '1C + 2H + 2O → HCOOH', 
        ingredients: { Carbon: 1, Hydrogen: 2, Oxygen: 2 },
        tier: 4,
        category: 'Organic Acids',
        subcategory: 'Carboxylic Acids',
        skillGain: 15,
        target: 500,
        icon: '🐜',
        unlocksAt: 6500,
        value: 110,
        description: 'Found in ant venom. Used in leather processing and as a preservative.',
        laborMultiplier: 1.7,
        usedIn: ['leather', 'preservative', 'chemicals']
    },
    { 
        id: 'acetic_acid_organic',
        name: 'Acetic Acid', 
        formula: '2C + 4H + 2O → CH₃COOH', 
        ingredients: { Carbon: 2, Hydrogen: 4, Oxygen: 2 },
        tier: 4,
        category: 'Organic Acids',
        subcategory: 'Carboxylic Acids',
        skillGain: 20,
        target: 500,
        icon: '🍶',
        unlocksAt: 7000,
        value: 100,
        description: 'Vinegar. Essential for ester production.',
        laborMultiplier: 1.8,
        usedIn: ['vinegar', 'esters', 'solvents']
    },
    { 
        id: 'propionic_acid',
        name: 'Propionic Acid', 
        formula: '3C + 6H + 2O → C₂H₅COOH', 
        ingredients: { Carbon: 3, Hydrogen: 6, Oxygen: 2 },
        tier: 4,
        category: 'Organic Acids',
        subcategory: 'Carboxylic Acids',
        skillGain: 25,
        target: 500,
        icon: '🧪',
        unlocksAt: 7500,
        value: 130,
        description: 'Food preservative and intermediate in chemical synthesis.',
        laborMultiplier: 1.9,
        usedIn: ['preservative', 'chemicals', 'plastics']
    },
    { 
        id: 'butyric_acid',
        name: 'Butyric Acid', 
        formula: '4C + 8H + 2O → C₃H₇COOH', 
        ingredients: { Carbon: 4, Hydrogen: 8, Oxygen: 2 },
        tier: 4,
        category: 'Organic Acids',
        subcategory: 'Carboxylic Acids',
        skillGain: 30,
        target: 500,
        icon: '🧀',
        unlocksAt: 8000,
        value: 150,
        description: 'Found in rancid butter. Used in perfume and flavor manufacturing.',
        laborMultiplier: 2.0,
        usedIn: ['flavors', 'perfume', 'chemicals']
    },
    { 
        id: 'benzoic_acid',
        name: 'Benzoic Acid', 
        formula: '7C + 6H + 2O → C₆H₅COOH', 
        ingredients: { Carbon: 7, Hydrogen: 6, Oxygen: 2 },
        tier: 4,
        category: 'Organic Acids',
        subcategory: 'Aromatic Acids',
        skillGain: 40,
        target: 500,
        icon: '⚪',
        unlocksAt: 9000,
        value: 200,
        description: 'Food preservative and precursor to many organic compounds.',
        laborMultiplier: 2.2,
        usedIn: ['preservative', 'dyes', 'pharmaceuticals']
    },
    
    // Esters
    { 
        id: 'ethyl_acetate',
        name: 'Ethyl Acetate', 
        formula: '4C + 8H + 2O → CH₃COOC₂H₅', 
        ingredients: { Carbon: 4, Hydrogen: 8, Oxygen: 2 },
        tier: 4,
        category: 'Esters',
        subcategory: 'Acetates',
        skillGain: 25,
        target: 500,
        icon: '🍏',
        unlocksAt: 10000,
        value: 120,
        description: 'Fruity solvent used in nail polish removers and glues.',
        laborMultiplier: 1.9,
        usedIn: ['solvent', 'nail_polish', 'adhesives']
    },
    { 
        id: 'methyl_acetate',
        name: 'Methyl Acetate', 
        formula: '3C + 6H + 2O → CH₃COOCH₃', 
        ingredients: { Carbon: 3, Hydrogen: 6, Oxygen: 2 },
        tier: 4,
        category: 'Esters',
        subcategory: 'Acetates',
        skillGain: 20,
        target: 500,
        icon: '🍌',
        unlocksAt: 10500,
        value: 110,
        description: 'Solvent with a pleasant smell.',
        laborMultiplier: 1.8,
        usedIn: ['solvent', 'coatings', 'adhesives']
    },
    
    // Ethers
    { 
        id: 'diethyl_ether',
        name: 'Diethyl Ether', 
        formula: '4C + 10H + 1O → (C₂H₅)₂O', 
        ingredients: { Carbon: 4, Hydrogen: 10, Oxygen: 1 },
        tier: 4,
        category: 'Ethers',
        subcategory: 'Simple Ethers',
        skillGain: 30,
        target: 500,
        icon: '😷',
        unlocksAt: 11000,
        value: 150,
        description: 'Historically used as an anesthetic. Excellent solvent.',
        laborMultiplier: 2.0,
        usedIn: ['solvent', 'anesthetic', 'chemicals']
    },
    
    // Amines
    { 
        id: 'methylamine',
        name: 'Methylamine', 
        formula: '1C + 5H + 1N → CH₃NH₂', 
        ingredients: { Carbon: 1, Hydrogen: 5, Nitrogen: 1 },
        tier: 4,
        category: 'Amines',
        subcategory: 'Primary Amines',
        skillGain: 20,
        target: 500,
        icon: '🐟',
        unlocksAt: 12000,
        value: 140,
        description: 'Used in pharmaceuticals and pesticides.',
        laborMultiplier: 1.8,
        usedIn: ['pharmaceuticals', 'pesticides', 'chemicals']
    },
    { 
        id: 'aniline',
        name: 'Aniline', 
        formula: '6C + 7H + 1N → C₆H₅NH₂', 
        ingredients: { Carbon: 6, Hydrogen: 7, Nitrogen: 1 },
        tier: 4,
        category: 'Amines',
        subcategory: 'Aromatic Amines',
        skillGain: 35,
        target: 500,
        icon: '🧪',
        unlocksAt: 13000,
        value: 250,
        description: 'Essential for dye manufacturing and polyurethane production.',
        laborMultiplier: 2.2,
        usedIn: ['dyes', 'polyurethane', 'pharmaceuticals']
    }
];

// ===== TIER 5: POLYMERS & PLASTICS =====
export const TIER_5_POLYMERS = [
    // Monomers
    { 
        id: 'styrene',
        name: 'Styrene', 
        formula: '8C + 8H → C₈H₈', 
        ingredients: { Carbon: 8, Hydrogen: 8 },
        tier: 5,
        category: 'Monomers',
        subcategory: 'Vinyl Monomers',
        skillGain: 40,
        target: 1000,
        icon: '🧪',
        unlocksAt: 15000,
        value: 300,
        description: 'Monomer for polystyrene and many copolymers.',
        laborMultiplier: 2.5,
        usedIn: ['polystyrene', 'abs', 'rubber']
    },
    { 
        id: 'vinyl_chloride',
        name: 'Vinyl Chloride', 
        formula: '2C + 3H + 1Cl → C₂H₃Cl', 
        ingredients: { Carbon: 2, Hydrogen: 3, Chlorine: 1 },
        tier: 5,
        category: 'Monomers',
        subcategory: 'Vinyl Monomers',
        skillGain: 35,
        target: 1000,
        icon: '🧪',
        unlocksAt: 16000,
        value: 280,
        description: 'Monomer for PVC. Toxic but essential.',
        laborMultiplier: 2.4,
        usedIn: ['pvc', 'plastics', 'pipes']
    },
    { 
        id: 'acrylonitrile',
        name: 'Acrylonitrile', 
        formula: '3C + 3H + 1N → C₃H₃N', 
        ingredients: { Carbon: 3, Hydrogen: 3, Nitrogen: 1 },
        tier: 5,
        category: 'Monomers',
        subcategory: 'Vinyl Monomers',
        skillGain: 40,
        target: 1000,
        icon: '🧪',
        unlocksAt: 17000,
        value: 350,
        description: 'Used in acrylic fibers and ABS plastic.',
        laborMultiplier: 2.5,
        usedIn: ['acrylic', 'abs', 'fibers']
    },
    { 
        id: 'methyl_methacrylate',
        name: 'Methyl Methacrylate', 
        formula: '5C + 8H + 2O → C₅H₈O₂', 
        ingredients: { Carbon: 5, Hydrogen: 8, Oxygen: 2 },
        tier: 5,
        category: 'Monomers',
        subcategory: 'Acrylic Monomers',
        skillGain: 55,
        target: 1000,
        icon: '🔍',
        unlocksAt: 18000,
        value: 400,
        description: 'Monomer for Plexiglas (PMMA).',
        laborMultiplier: 2.8,
        usedIn: ['plexiglas', 'acrylic', 'optical']
    },
    { 
        id: 'caprolactam',
        name: 'Caprolactam', 
        formula: '6C + 11H + 1N + 1O → C₆H₁₁NO', 
        ingredients: { Carbon: 6, Hydrogen: 11, Nitrogen: 1, Oxygen: 1 },
        tier: 5,
        category: 'Monomers',
        subcategory: 'Lactams',
        skillGain: 60,
        target: 1000,
        icon: '🧵',
        unlocksAt: 19000,
        value: 450,
        description: 'Monomer for Nylon 6.',
        laborMultiplier: 3.0,
        usedIn: ['nylon', 'fibers', 'plastics']
    },
    
    // Basic Polymers
    { 
        id: 'polyethylene',
        name: 'Polyethylene', 
        formula: 'n(C₂H₄) → (C₂H₄)n', 
        ingredients: { Ethylene: 10 },
        tier: 5,
        category: 'Polymers',
        subcategory: 'Polyolefins',
        skillGain: 50,
        target: 1000,
        icon: '🧴',
        unlocksAt: 20000,
        value: 500,
        description: 'The most common plastic. Used for bags, bottles, and containers.',
        laborMultiplier: 2.8,
        usedIn: ['packaging', 'containers', 'films']
    },
    { 
        id: 'polypropylene',
        name: 'Polypropylene', 
        formula: 'n(C₃H₆) → (C₃H₆)n', 
        ingredients: { Propylene: 10 },
        tier: 5,
        category: 'Polymers',
        subcategory: 'Polyolefins',
        skillGain: 60,
        target: 1000,
        icon: '🧴',
        unlocksAt: 21000,
        value: 550,
        description: 'Durable plastic used in packaging, textiles, and automotive parts.',
        laborMultiplier: 3.0,
        usedIn: ['packaging', 'textiles', 'automotive']
    },
    { 
        id: 'polystyrene',
        name: 'Polystyrene', 
        formula: 'n(C₈H₈) → (C₈H₈)n', 
        ingredients: { Styrene: 10 },
        tier: 5,
        category: 'Polymers',
        subcategory: 'Styrenics',
        skillGain: 80,
        target: 1000,
        icon: '📦',
        unlocksAt: 22000,
        value: 600,
        description: 'Used for foam packaging, cups, and insulation.',
        laborMultiplier: 3.2,
        usedIn: ['packaging', 'insulation', 'disposables']
    },
    { 
        id: 'pvc',
        name: 'Polyvinyl Chloride', 
        formula: 'n(C₂H₃Cl) → (C₂H₃Cl)n', 
        ingredients: { VinylChloride: 10 },
        tier: 5,
        category: 'Polymers',
        subcategory: 'Vinyl Polymers',
        skillGain: 70,
        target: 1000,
        icon: '🔧',
        unlocksAt: 23000,
        value: 580,
        description: 'Durable plastic for pipes, fittings, and insulation.',
        laborMultiplier: 3.1,
        usedIn: ['pipes', 'fittings', 'insulation']
    },
    { 
        id: 'pet',
        name: 'Polyethylene Terephthalate', 
        formula: 'Complex polymerization', 
        ingredients: { EthyleneGlycol: 5, TerephthalicAcid: 5 },
        tier: 5,
        category: 'Polymers',
        subcategory: 'Polyesters',
        skillGain: 90,
        target: 1000,
        icon: '🥤',
        unlocksAt: 24000,
        value: 650,
        description: 'Used for beverage bottles and polyester fibers.',
        laborMultiplier: 3.5,
        usedIn: ['bottles', 'fibers', 'packaging']
    },
    { 
        id: 'abs',
        name: 'Acrylonitrile Butadiene Styrene', 
        formula: 'Copolymerization', 
        ingredients: { Acrylonitrile: 3, Butadiene: 3, Styrene: 4 },
        tier: 5,
        category: 'Polymers',
        subcategory: 'Styrenics',
        skillGain: 80,
        target: 1000,
        icon: '🔧',
        unlocksAt: 25000,
        value: 700,
        description: 'Strong, impact-resistant plastic for LEGO bricks and electronics.',
        laborMultiplier: 3.3,
        usedIn: ['electronics', 'toys', 'automotive']
    },
    { 
        id: 'nylon_6_6',
        name: 'Nylon 6,6', 
        formula: 'Polycondensation', 
        ingredients: { AdipicAcid: 5, Hexamethylenediamine: 5 },
        tier: 5,
        category: 'Polymers',
        subcategory: 'Polyamides',
        skillGain: 100,
        target: 1000,
        icon: '🧵',
        unlocksAt: 26000,
        value: 800,
        description: 'Strong, durable fiber for textiles and engineering components.',
        laborMultiplier: 3.8,
        usedIn: ['textiles', 'engineering', 'carpet']
    },
    { 
        id: 'polycarbonate',
        name: 'Polycarbonate', 
        formula: 'Polymerization', 
        ingredients: { BisphenolA: 5, Phosgene: 5 },
        tier: 5,
        category: 'Polymers',
        subcategory: 'Engineering Plastics',
        skillGain: 120,
        target: 1000,
        icon: '🛡️',
        unlocksAt: 28000,
        value: 900,
        description: 'Impact-resistant transparent plastic for bulletproof glass and CDs.',
        laborMultiplier: 4.0,
        usedIn: ['bulletproof', 'optical', 'electronics']
    },
    { 
        id: 'pmma',
        name: 'Polymethyl Methacrylate', 
        formula: 'Polymerization', 
        ingredients: { MethylMethacrylate: 10 },
        tier: 5,
        category: 'Polymers',
        subcategory: 'Acrylics',
        skillGain: 90,
        target: 1000,
        icon: '🔍',
        unlocksAt: 30000,
        value: 850,
        description: 'Plexiglas. A transparent alternative to glass.',
        laborMultiplier: 3.6,
        usedIn: ['windows', 'signs', 'optical']
    },
    { 
        id: 'ptfe',
        name: 'Polytetrafluoroethylene', 
        formula: 'Polymerization', 
        ingredients: { Tetrafluoroethylene: 10 },
        tier: 5,
        category: 'Polymers',
        subcategory: 'Fluoropolymers',
        skillGain: 100,
        target: 1000,
        icon: '🍳',
        unlocksAt: 32000,
        value: 1200,
        description: 'Teflon. Non-stick, heat-resistant, and chemically inert.',
        laborMultiplier: 4.2,
        usedIn: ['nonstick', 'seals', 'electrical']
    }
];

// ===== TIER 6: METALLURGY =====
export const TIER_6_METALLURGY = [
    // Basic Alloys
    { 
        id: 'bronze',
        name: 'Bronze', 
        formula: 'Cu + Sn → Alloy', 
        ingredients: { Copper: 7, Tin: 3 },
        tier: 6,
        category: 'Basic Alloys',
        subcategory: 'Copper Alloys',
        skillGain: 30,
        target: 2000,
        icon: '🏺',
        unlocksAt: 35000,
        value: 800,
        description: 'The first alloy. Used for tools, weapons, and art.',
        laborMultiplier: 3.0,
        usedIn: ['tools', 'weapons', 'art']
    },
    { 
        id: 'brass',
        name: 'Brass', 
        formula: 'Cu + Zn → Alloy', 
        ingredients: { Copper: 7, Zinc: 3 },
        tier: 6,
        category: 'Basic Alloys',
        subcategory: 'Copper Alloys',
        skillGain: 30,
        target: 2000,
        icon: '🔔',
        unlocksAt: 36000,
        value: 750,
        description: 'Used for musical instruments, fittings, and decorations.',
        laborMultiplier: 3.0,
        usedIn: ['instruments', 'fittings', 'decor']
    },
    { 
        id: 'steel',
        name: 'Steel', 
        formula: 'Fe + C → Alloy', 
        ingredients: { Iron: 9, Carbon: 1 },
        tier: 6,
        category: 'Basic Alloys',
        subcategory: 'Steels',
        skillGain: 40,
        target: 2000,
        icon: '⚙️',
        unlocksAt: 37000,
        value: 600,
        description: 'The backbone of civilization. Used everywhere.',
        laborMultiplier: 3.2,
        usedIn: ['construction', 'tools', 'vehicles']
    },
    { 
        id: 'stainless_steel_304',
        name: 'Stainless Steel 304', 
        formula: 'Fe + Cr + Ni → Alloy', 
        ingredients: { Iron: 7, Chromium: 2, Nickel: 1 },
        tier: 6,
        category: 'Stainless Steels',
        subcategory: 'Austenitic',
        skillGain: 60,
        target: 2000,
        icon: '🥄',
        unlocksAt: 38000,
        value: 1000,
        description: 'Corrosion-resistant steel for kitchenware and architecture.',
        laborMultiplier: 3.8,
        usedIn: ['kitchenware', 'architecture', 'medical']
    },
    { 
        id: 'stainless_steel_316',
        name: 'Stainless Steel 316', 
        formula: 'Fe + Cr + Ni + Mo → Alloy', 
        ingredients: { Iron: 6, Chromium: 2, Nickel: 1, Molybdenum: 1 },
        tier: 6,
        category: 'Stainless Steels',
        subcategory: 'Austenitic',
        skillGain: 80,
        target: 2000,
        icon: '⚓',
        unlocksAt: 40000,
        value: 1200,
        description: 'Marine-grade stainless steel for harsh environments.',
        laborMultiplier: 4.2,
        usedIn: ['marine', 'chemical', 'medical']
    },
    { 
        id: 'tool_steel_d2',
        name: 'Tool Steel D2', 
        formula: 'Fe + C + Cr + Mo + V → Alloy', 
        ingredients: { Iron: 8, Carbon: 1, Chromium: 1, Molybdenum: 0.5, Vanadium: 0.5 },
        tier: 6,
        category: 'Tool Steels',
        subcategory: 'Cold Work',
        skillGain: 90,
        target: 2000,
        icon: '🔪',
        unlocksAt: 42000,
        value: 1500,
        description: 'High-wear resistance steel for cutting tools.',
        laborMultiplier: 4.5,
        usedIn: ['cutting', 'dies', 'molds']
    },
    { 
        id: 'duralumin',
        name: 'Duralumin', 
        formula: 'Al + Cu + Mg → Alloy', 
        ingredients: { Aluminum: 9, Copper: 1, Magnesium: 0.5 },
        tier: 6,
        category: 'Aluminum Alloys',
        subcategory: 'Wrought Alloys',
        skillGain: 50,
        target: 2000,
        icon: '✈️',
        unlocksAt: 44000,
        value: 1100,
        description: 'High-strength aluminum alloy for aircraft.',
        laborMultiplier: 3.5,
        usedIn: ['aircraft', 'automotive', 'structures']
    },
    { 
        id: 'titanium_alloy_ti64',
        name: 'Ti-6Al-4V', 
        formula: 'Ti + Al + V → Alloy', 
        ingredients: { Titanium: 8, Aluminum: 1, Vanadium: 1 },
        tier: 6,
        category: 'Titanium Alloys',
        subcategory: 'Alpha-Beta',
        skillGain: 80,
        target: 2000,
        icon: '🚀',
        unlocksAt: 46000,
        value: 3000,
        description: 'The workhorse titanium alloy for aerospace and medical implants.',
        laborMultiplier: 5.0,
        usedIn: ['aerospace', 'medical', 'high_performance']
    },
    { 
        id: 'inconel_718',
        name: 'Inconel 718', 
        formula: 'Ni + Cr + Fe + Nb + Mo → Superalloy', 
        ingredients: { Nickel: 5, Chromium: 2, Iron: 2, Niobium: 0.5, Molybdenum: 0.5 },
        tier: 6,
        category: 'Superalloys',
        subcategory: 'Nickel-based',
        skillGain: 100,
        target: 2000,
        icon: '🔥',
        unlocksAt: 48000,
        value: 5000,
        description: 'High-temperature superalloy for jet engines.',
        laborMultiplier: 6.0,
        usedIn: ['jet_engines', 'turbines', 'nuclear']
    },
    { 
        id: 'tungsten_carbide',
        name: 'Tungsten Carbide', 
        formula: 'W + C → WC', 
        ingredients: { Tungsten: 9, Carbon: 1 },
        tier: 6,
        category: 'Refractory Alloys',
        subcategory: 'Cemented Carbides',
        skillGain: 90,
        target: 2000,
        icon: '⛏️',
        unlocksAt: 50000,
        value: 6000,
        description: 'Extremely hard material for cutting tools and mining equipment.',
        laborMultiplier: 5.5,
        usedIn: ['cutting_tools', 'mining', 'wear_parts']
    }
];

// ===== TIER 7: COMPOSITE MATERIALS =====
export const TIER_7_COMPOSITES = [
    // Fibers
    { 
        id: 'carbon_fiber',
        name: 'Carbon Fiber', 
        formula: 'PAN → Heat → C Fiber', 
        ingredients: { Polyacrylonitrile: 5 },
        tier: 7,
        category: 'Fibers',
        subcategory: 'Carbon Fibers',
        skillGain: 80,
        target: 5000,
        icon: '⚫',
        unlocksAt: 55000,
        value: 8000,
        description: 'High-strength, lightweight fibers for advanced composites.',
        laborMultiplier: 6.0,
        usedIn: ['aerospace', 'sports', 'automotive']
    },
    { 
        id: 'glass_fiber',
        name: 'Glass Fiber', 
        formula: 'SiO₂ + Heat → Fiber', 
        ingredients: { SiliconDioxide: 10 },
        tier: 7,
        category: 'Fibers',
        subcategory: 'Glass Fibers',
        skillGain: 50,
        target: 5000,
        icon: '⚪',
        unlocksAt: 52000,
        value: 2000,
        description: 'Reinforcement fibers for fiberglass.',
        laborMultiplier: 4.0,
        usedIn: ['fiberglass', 'insulation', 'composites']
    },
    { 
        id: 'kevlar',
        name: 'Aramid Fiber (Kevlar)', 
        formula: 'Polymerization → Spinning', 
        ingredients: { PPD: 3, TPC: 3 },
        tier: 7,
        category: 'Fibers',
        subcategory: 'Aramid Fibers',
        skillGain: 120,
        target: 5000,
        icon: '🛡️',
        unlocksAt: 60000,
        value: 10000,
        description: 'Bulletproof fibers for body armor and high-strength applications.',
        laborMultiplier: 7.0,
        usedIn: ['armor', 'tires', 'cables']
    },
    
    // Matrix Materials
    { 
        id: 'epoxy_resin',
        name: 'Epoxy Resin', 
        formula: 'BisphenolA + Epichlorohydrin → Polymer', 
        ingredients: { BisphenolA: 3, Epichlorohydrin: 2 },
        tier: 7,
        category: 'Matrix Materials',
        subcategory: 'Thermosets',
        skillGain: 60,
        target: 5000,
        icon: '🧴',
        unlocksAt: 58000,
        value: 3000,
        description: 'High-performance adhesive and matrix for composites.',
        laborMultiplier: 4.5,
        usedIn: ['adhesives', 'composites', 'coatings']
    },
    { 
        id: 'polyester_resin',
        name: 'Polyester Resin', 
        formula: 'Unsaturated Polyester + Styrene', 
        ingredients: { MaleicAnhydride: 2, EthyleneGlycol: 2, Styrene: 1 },
        tier: 7,
        category: 'Matrix Materials',
        subcategory: 'Thermosets',
        skillGain: 50,
        target: 5000,
        icon: '🧪',
        unlocksAt: 56000,
        value: 2500,
        description: 'Common matrix for fiberglass.',
        laborMultiplier: 4.0,
        usedIn: ['fiberglass', 'boats', 'auto_parts']
    },
    
    // Composites
    { 
        id: 'fiberglass',
        name: 'Fiberglass', 
        formula: 'Glass Fibers + Polyester Resin', 
        ingredients: { GlassFiber: 5, PolyesterResin: 5 },
        tier: 7,
        category: 'Composites',
        subcategory: 'Glass Composites',
        skillGain: 100,
        target: 5000,
        icon: '🛶',
        unlocksAt: 62000,
        value: 4000,
        description: 'Lightweight, strong material for boats, car bodies, and insulation.',
        laborMultiplier: 5.0,
        usedIn: ['boats', 'auto', 'construction']
    },
    { 
        id: 'carbon_fiber_composite',
        name: 'Carbon Fiber Composite', 
        formula: 'Carbon Fibers + Epoxy Resin', 
        ingredients: { CarbonFiber: 5, EpoxyResin: 5 },
        tier: 7,
        category: 'Advanced Composites',
        subcategory: 'Carbon Composites',
        skillGain: 150,
        target: 5000,
        icon: '🚗',
        unlocksAt: 65000,
        value: 15000,
        description: 'Ultra-light, ultra-strong material for aerospace and high-performance vehicles.',
        laborMultiplier: 8.0,
        usedIn: ['aerospace', 'automotive', 'sports']
    },
    { 
        id: 'carbon_carbon_composite',
        name: 'Carbon-Carbon Composite', 
        formula: 'Carbon Fibers + Carbon Matrix', 
        ingredients: { CarbonFiber: 5, CarbonMatrix: 5 },
        tier: 7,
        category: 'Advanced Composites',
        subcategory: 'Carbon-Carbon',
        skillGain: 200,
        target: 5000,
        icon: '🚀',
        unlocksAt: 70000,
        value: 25000,
        description: 'Withstands extreme temperatures. Used for rocket nozzles and heat shields.',
        laborMultiplier: 10.0,
        usedIn: ['rocket_nozzles', 'heat_shields', 'brakes']
    }
];

// ===== TIER 8: SEMICONDUCTORS =====
export const TIER_8_SEMICONDUCTORS = [
    // Silicon Processing
    { 
        id: 'polysilicon',
        name: 'Polysilicon', 
        formula: 'Si (metallurgical) → Purification → Poly Si', 
        ingredients: { Silicon: 10 },
        tier: 8,
        category: 'Silicon Processing',
        subcategory: 'Purification',
        skillGain: 40,
        target: 10000,
        icon: '💎',
        unlocksAt: 80000,
        value: 5000,
        description: 'Purified silicon for semiconductor manufacturing.',
        laborMultiplier: 5.0,
        usedIn: ['wafers', 'solar_cells', 'electronics']
    },
    { 
        id: 'monocrystalline_silicon',
        name: 'Monocrystalline Silicon', 
        formula: 'Polysilicon → Czochralski Process → Single Crystal', 
        ingredients: { Polysilicon: 3 },
        tier: 8,
        category: 'Silicon Processing',
        subcategory: 'Crystal Growth',
        skillGain: 60,
        target: 10000,
        icon: '🔮',
        unlocksAt: 85000,
        value: 10000,
        description: 'Single-crystal silicon wafers for chip manufacturing.',
        laborMultiplier: 6.0,
        usedIn: ['wafers', 'chips', 'solar']
    },
    { 
        id: 'silicon_wafer',
        name: 'Silicon Wafer', 
        formula: 'Monocrystalline Silicon → Slicing → Polishing', 
        ingredients: { MonocrystallineSilicon: 1 },
        tier: 8,
        category: 'Silicon Processing',
        subcategory: 'Wafer Fabrication',
        skillGain: 30,
        target: 10000,
        icon: '💿',
        unlocksAt: 90000,
        value: 8000,
        description: 'Polished silicon wafers ready for device fabrication.',
        laborMultiplier: 5.5,
        usedIn: ['chips', 'electronics', 'sensors']
    },
    
    // Doping
    { 
        id: 'p_type_silicon',
        name: 'P-Type Silicon', 
        formula: 'Si + B → Doped Si', 
        ingredients: { SiliconWafer: 1, Boron: 0.1 },
        tier: 8,
        category: 'Doping',
        subcategory: 'Diffusion',
        skillGain: 50,
        target: 10000,
        icon: '🔵',
        unlocksAt: 95000,
        value: 15000,
        description: 'Boron-doped silicon with positive charge carriers.',
        laborMultiplier: 7.0,
        usedIn: ['transistors', 'diodes', 'ics']
    },
    { 
        id: 'n_type_silicon',
        name: 'N-Type Silicon', 
        formula: 'Si + P → Doped Si', 
        ingredients: { SiliconWafer: 1, Phosphorus: 0.1 },
        tier: 8,
        category: 'Doping',
        subcategory: 'Diffusion',
        skillGain: 50,
        target: 10000,
        icon: '🔴',
        unlocksAt: 100000,
        value: 15000,
        description: 'Phosphorus-doped silicon with negative charge carriers.',
        laborMultiplier: 7.0,
        usedIn: ['transistors', 'diodes', 'ics']
    },
    
    // Dielectrics
    { 
        id: 'silicon_dioxide_thin_film',
        name: 'Silicon Dioxide Thin Film', 
        formula: 'Si + O₂ → SiO₂ (thin film)', 
        ingredients: { Silicon: 1, Oxygen: 2 },
        tier: 8,
        category: 'Dielectrics',
        subcategory: 'Oxides',
        skillGain: 30,
        target: 10000,
        icon: '🔲',
        unlocksAt: 105000,
        value: 5000,
        description: 'Insulating layer for semiconductor devices.',
        laborMultiplier: 4.0,
        usedIn: ['gate_oxide', 'insulation', 'passivation']
    },
    { 
        id: 'silicon_nitride',
        name: 'Silicon Nitride', 
        formula: '3Si + 4N → Si₃N₄', 
        ingredients: { Silicon: 3, Nitrogen: 4 },
        tier: 8,
        category: 'Dielectrics',
        subcategory: 'Nitrides',
        skillGain: 50,
        target: 10000,
        icon: '🔳',
        unlocksAt: 110000,
        value: 8000,
        description: 'Hard, insulating material for chip passivation.',
        laborMultiplier: 5.0,
        usedIn: ['passivation', 'hard_mask', 'insulation']
    },
    
    // Devices
    { 
        id: 'diode',
        name: 'P-N Junction Diode', 
        formula: 'P-Type + N-Type → Diode', 
        ingredients: { PTypeSilicon: 1, NTypeSilicon: 1 },
        tier: 8,
        category: 'Devices',
        subcategory: 'Discrete',
        skillGain: 80,
        target: 10000,
        icon: '➡️',
        unlocksAt: 120000,
        value: 20000,
        description: 'Allows current to flow in one direction.',
        laborMultiplier: 8.0,
        usedIn: ['rectifiers', 'switches', 'protection']
    },
    { 
        id: 'transistor',
        name: 'Bipolar Junction Transistor', 
        formula: 'NPN or PNP structure', 
        ingredients: { PTypeSilicon: 2, NTypeSilicon: 1 },
        tier: 8,
        category: 'Devices',
        subcategory: 'Discrete',
        skillGain: 120,
        target: 10000,
        icon: '🔌',
        unlocksAt: 130000,
        value: 30000,
        description: 'Amplifies or switches electronic signals.',
        laborMultiplier: 10.0,
        usedIn: ['amplifiers', 'switches', 'oscillators']
    },
    { 
        id: 'mosfet',
        name: 'MOSFET', 
        formula: 'Metal-Oxide-Semiconductor structure', 
        ingredients: { PTypeSilicon: 1, SiliconDioxide: 1, Aluminum: 1 },
        tier: 8,
        category: 'Devices',
        subcategory: 'MOS',
        skillGain: 150,
        target: 10000,
        icon: '💻',
        unlocksAt: 140000,
        value: 50000,
        description: 'The fundamental building block of modern electronics.',
        laborMultiplier: 12.0,
        usedIn: ['digital_logic', 'power', 'analog']
    },
    { 
        id: 'cmos',
        name: 'CMOS Circuit', 
        formula: 'Complementary MOSFETs', 
        ingredients: { MOSFET: 2 },
        tier: 8,
        category: 'Integrated Circuits',
        subcategory: 'Logic',
        skillGain: 200,
        target: 10000,
        icon: '🧠',
        unlocksAt: 150000,
        value: 100000,
        description: 'Low-power logic circuits for microprocessors.',
        laborMultiplier: 15.0,
        usedIn: ['processors', 'memory', 'logic']
    },
    { 
        id: 'microprocessor',
        name: 'Microprocessor', 
        formula: 'Millions of transistors integrated', 
        ingredients: { CMOS: 1000000 },
        tier: 8,
        category: 'Integrated Circuits',
        subcategory: 'Complex ICs',
        skillGain: 1000,
        target: 10000,
        icon: '⚙️',
        unlocksAt: 200000,
        value: 500000,
        description: 'The brain of computers. Contains millions of transistors.',
        laborMultiplier: 30.0,
        usedIn: ['computers', 'smart_devices', 'embedded']
    }
];

// ===== TIER 9: ENERGY & NANOMATERIALS =====
export const TIER_9_ENERGY_NANO = [
    // Batteries
    { 
        id: 'lead_acid_battery',
        name: 'Lead-Acid Battery', 
        formula: 'Pb + PbO₂ + H₂SO₄ → Battery', 
        ingredients: { Lead: 5, LeadOxide: 5, SulfuricAcid: 3 },
        tier: 9,
        category: 'Energy Storage',
        subcategory: 'Batteries',
        skillGain: 100,
        target: 20000,
        icon: '🔋',
        unlocksAt: 250000,
        value: 20000,
        description: 'Reliable, rechargeable battery for vehicles and backup power.',
        laborMultiplier: 8.0,
        usedIn: ['vehicles', 'backup', 'storage']
    },
    { 
        id: 'lithium_ion_battery',
        name: 'Lithium-Ion Cell', 
        formula: 'LiCoO₂ + Graphite + Electrolyte → Cell', 
        ingredients: { Lithium: 1, Cobalt: 1, Graphite: 2, Electrolyte: 1 },
        tier: 9,
        category: 'Energy Storage',
        subcategory: 'Batteries',
        skillGain: 200,
        target: 20000,
        icon: '🔋',
        unlocksAt: 300000,
        value: 50000,
        description: 'High-energy-density rechargeable battery for portable electronics.',
        laborMultiplier: 12.0,
        usedIn: ['electronics', 'evs', 'storage']
    },
    { 
        id: 'fuel_cell',
        name: 'PEM Fuel Cell', 
        formula: 'Membrane + Catalyst + Plates → Cell', 
        ingredients: { Platinum: 1, Membrane: 1, Graphite: 2 },
        tier: 9,
        category: 'Energy Generation',
        subcategory: 'Fuel Cells',
        skillGain: 250,
        target: 20000,
        icon: '⚡',
        unlocksAt: 350000,
        value: 100000,
        description: 'Converts hydrogen and oxygen into electricity.',
        laborMultiplier: 15.0,
        usedIn: ['clean_power', 'transportation', 'backup']
    },
    
    // Solar
    { 
        id: 'solar_cell',
        name: 'Silicon Solar Cell', 
        formula: 'P-N Junction → Photovoltaic Cell', 
        ingredients: { PTypeSilicon: 1, NTypeSilicon: 1, Silver: 0.1 },
        tier: 9,
        category: 'Energy Generation',
        subcategory: 'Photovoltaics',
        skillGain: 150,
        target: 20000,
        icon: '☀️',
        unlocksAt: 400000,
        value: 80000,
        description: 'Converts sunlight directly into electricity.',
        laborMultiplier: 10.0,
        usedIn: ['solar_panels', 'space', 'renewable']
    },
    
    // Nanomaterials
    { 
        id: 'graphene',
        name: 'Graphene', 
        formula: 'C → 2D layer', 
        ingredients: { Carbon: 20 },
        tier: 9,
        category: 'Nanomaterials',
        subcategory: '2D Materials',
        skillGain: 250,
        target: 20000,
        icon: '⬛',
        unlocksAt: 450000,
        value: 200000,
        description: 'One-atom-thick layer of carbon. Stronger than steel, conductive, and flexible.',
        laborMultiplier: 20.0,
        usedIn: ['electronics', 'composites', 'sensors']
    },
    { 
        id: 'carbon_nanotube',
        name: 'Carbon Nanotube', 
        formula: 'C → Cylindrical nanostructure', 
        ingredients: { Carbon: 50 },
        tier: 9,
        category: 'Nanomaterials',
        subcategory: 'Carbon Nanotubes',
        skillGain: 300,
        target: 20000,
        icon: '🧬',
        unlocksAt: 500000,
        value: 300000,
        description: 'Cylindrical carbon molecules with extraordinary strength and conductivity.',
        laborMultiplier: 25.0,
        usedIn: ['composites', 'electronics', 'medicine']
    },
    { 
        id: 'quantum_dot',
        name: 'Quantum Dots', 
        formula: 'CdSe → Nanoparticles', 
        ingredients: { Cadmium: 5, Selenium: 5 },
        tier: 9,
        category: 'Nanomaterials',
        subcategory: 'Quantum Dots',
        skillGain: 280,
        target: 20000,
        icon: '🔴',
        unlocksAt: 550000,
        value: 250000,
        description: 'Nanoscale semiconductor particles with size-tunable optical properties.',
        laborMultiplier: 22.0,
        usedIn: ['displays', 'imaging', 'sensors']
    },
    
    // Smart Materials
    { 
        id: 'nitinol',
        name: 'Nitinol (Shape Memory Alloy)', 
        formula: 'Ni + Ti → Alloy with training', 
        ingredients: { Nickel: 5, Titanium: 5 },
        tier: 9,
        category: 'Smart Materials',
        subcategory: 'Shape Memory',
        skillGain: 150,
        target: 20000,
        icon: '🔄',
        unlocksAt: 600000,
        value: 150000,
        description: 'Remembers its shape. Returns to pre-formed shape when heated.',
        laborMultiplier: 12.0,
        usedIn: ['actuators', 'medical', 'robotics']
    },
    { 
        id: 'piezoelectric_ceramic',
        name: 'PZT (Lead Zirconate Titanate)', 
        formula: 'Pb + Zr + Ti + O → Ceramic', 
        ingredients: { Lead: 1, Zirconium: 1, Titanium: 1, Oxygen: 3 },
        tier: 9,
        category: 'Smart Materials',
        subcategory: 'Piezoelectrics',
        skillGain: 120,
        target: 20000,
        icon: '⚡',
        unlocksAt: 650000,
        value: 120000,
        description: 'Generates electricity when compressed. Used in sensors and actuators.',
        laborMultiplier: 10.0,
        usedIn: ['sensors', 'actuators', 'transducers']
    }
];

// ===== TIER 10: EXOTIC MATTER =====
export const TIER_10_EXOTIC = [
    // Antimatter
    { 
        id: 'positrons',
        name: 'Positrons', 
        formula: 'High energy → e⁺', 
        ingredients: { Energy: 1000000 },
        tier: 10,
        category: 'Antimatter',
        subcategory: 'Leptons',
        skillGain: 500,
        target: 50000,
        icon: '✨',
        unlocksAt: 800000,
        value: 1000000,
        description: 'Antielectrons. Used in PET scans and for annihilation reactions.',
        laborMultiplier: 30.0,
        usedIn: ['medical', 'physics', 'propulsion']
    },
    { 
        id: 'antihydrogen',
        name: 'Antihydrogen', 
        formula: 'p⁻ + e⁺ → H̅', 
        ingredients: { Antiprotons: 1, Positrons: 1 },
        tier: 10,
        category: 'Antimatter',
        subcategory: 'Atoms',
        skillGain: 2000,
        target: 50000,
        icon: '⚡',
        unlocksAt: 900000,
        value: 10000000,
        description: 'The simplest antimatter atom. Studied for fundamental physics.',
        laborMultiplier: 50.0,
        usedIn: ['physics', 'propulsion', 'energy']
    },
    
    // Superheavy Elements
    { 
        id: 'californium',
        name: 'Californium', 
        formula: 'Nuclear synthesis', 
        ingredients: { Curium: 1, Neutrons: 10 },
        tier: 10,
        category: 'Superheavy Elements',
        subcategory: 'Actinides',
        skillGain: 400,
        target: 50000,
        icon: '☢️',
        unlocksAt: 950000,
        value: 5000000,
        description: 'Intense neutron source. Used in nuclear reactors and cancer treatment.',
        laborMultiplier: 40.0,
        usedIn: ['reactors', 'medicine', 'research']
    },
    { 
        id: 'oganesson',
        name: 'Oganesson', 
        formula: 'Nuclear fusion', 
        ingredients: { Californium: 1, Calcium: 1 },
        tier: 10,
        category: 'Superheavy Elements',
        subcategory: 'Noble Gases',
        skillGain: 1350,
        target: 50000,
        icon: '💫',
        unlocksAt: 1000000,
        value: 20000000,
        description: 'The heaviest element. A noble gas with relativistic effects.',
        laborMultiplier: 60.0,
        usedIn: ['physics', 'research', 'elite_crafts']
    },
    
    // Room Temperature Superconductor (The Holy Grail)
    { 
        id: 'room_temp_superconductor',
        name: 'Room Temperature Superconductor', 
        formula: '???', 
        ingredients: { Hydrogen: 1000000, Carbon: 500000, ExoticConditions: 1 },
        tier: 10,
        category: 'Exotic Materials',
        subcategory: 'Superconductors',
        skillGain: 10000,
        target: 100000,
        icon: '🏆',
        unlocksAt: 2000000,
        value: 100000000,
        description: 'THE HOLY GRAIL. Conducts electricity with zero resistance at room temperature. Transforms civilization.',
        laborMultiplier: 100.0,
        usedIn: ['everything', 'revolutionary', 'transformative']
    }
];

// ===== COMBINE ALL RECIPES =====
export const RECIPE_DATABASE = {
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
    'Energy Storage': TIER_9_ENERGY_NANO.filter(r => r.category === 'Energy Storage'),
    'Energy Generation': TIER_9_ENERGY_NANO.filter(r => r.category === 'Energy Generation'),
    'Nanomaterials': TIER_9_ENERGY_NANO.filter(r => r.category === 'Nanomaterials'),
    'Smart Materials': TIER_9_ENERGY_NANO.filter(r => r.category === 'Smart Materials'),
    'Antimatter': TIER_10_EXOTIC.filter(r => r.category === 'Antimatter'),
    'Superheavy Elements': TIER_10_EXOTIC.filter(r => r.category === 'Superheavy Elements'),
    'Exotic Materials': TIER_10_EXOTIC.filter(r => r.category === 'Exotic Materials')
};

// ===== HELPER FUNCTIONS =====

/**
 * Get recipe by ID
 * @param {string} recipeId - Recipe ID
 * @returns {Object|null} Recipe object or null
 */
export function getRecipeById(recipeId) {
    for (const category of Object.values(RECIPE_DATABASE)) {
        const found = category.find(r => r.id === recipeId);
        if (found) return found;
    }
    return null;
}

/**
 * Get recipes by category
 * @param {string} category - Category name
 * @returns {Array} Recipes in category
 */
export function getRecipesByCategory(category) {
    return RECIPE_DATABASE[category] || [];
}

/**
 * Get recipes by tier
 * @param {number} tier - Tier number (1-10)
 * @returns {Array} Recipes in tier
 */
export function getRecipesByTier(tier) {
    const recipes = [];
    for (const category of Object.values(RECIPE_DATABASE)) {
        recipes.push(...category.filter(r => r.tier === tier));
    }
    return recipes;
}

/**
 * Get all recipe categories
 * @returns {Array} Category names
 */
export function getAllCategories() {
    return Object.keys(RECIPE_DATABASE);
}

/**
 * Get total recipes count
 * @returns {number} Total recipes
 */
export function getTotalRecipeCount() {
    return Object.values(RECIPE_DATABASE).reduce((sum, cat) => sum + cat.length, 0);
}

/**
 * Search recipes by name or formula
 * @param {string} query - Search query
 * @returns {Array} Matching recipes
 */
export function searchRecipes(query) {
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    for (const category of Object.values(RECIPE_DATABASE)) {
        for (const recipe of category) {
            if (recipe.name.toLowerCase().includes(lowerQuery) ||
                recipe.formula.toLowerCase().includes(lowerQuery) ||
                recipe.id.toLowerCase().includes(lowerQuery)) {
                results.push(recipe);
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
    
    for (const category of Object.values(RECIPE_DATABASE)) {
        for (const recipe of category) {
            if (recipe.ingredients[ingredient]) {
                results.push(recipe);
            }
        }
    }
    
    return results;
}

/**
 * Get recipes that unlock at a specific milestone
 * @param {number} crafts - Total crafts
 * @returns {Array} Recipes that unlock at this milestone
 */
export function getRecipesUnlockedAt(crafts) {
    const results = [];
    
    for (const category of Object.values(RECIPE_DATABASE)) {
        for (const recipe of category) {
            if (recipe.unlocksAt === crafts) {
                results.push(recipe);
            }
        }
    }
    
    return results;
}

/**
 * Calculate total value of a recipe batch
 * @param {string} recipeId - Recipe ID
 * @param {number} count - Number of crafts
 * @returns {number} Total value
 */
export function calculateBatchValue(recipeId, count = 1) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return 0;
    return recipe.value * count;
}

/**
 * Get recipe tree for visualization
 * @returns {Object} Recipe tree with dependencies
 */
export function getRecipeTree() {
    const tree = {};
    
    for (const [category, recipes] of Object.entries(RECIPE_DATABASE)) {
        tree[category] = recipes.map(recipe => ({
            id: recipe.id,
            name: recipe.name,
            tier: recipe.tier,
            dependencies: recipe.ingredients ? Object.keys(recipe.ingredients) : [],
            unlocksAt: recipe.unlocksAt,
            value: recipe.value
        }));
    }
    
    return tree;
}

// ===== EXPORT ALL =====
export default {
    RECIPE_DATABASE,
    TIER_1_BASIC_COMPOUNDS,
    TIER_2_ACIDS_BASES,
    TIER_3_SALTS_MINERALS,
    TIER_4_ORGANIC,
    TIER_5_POLYMERS,
    TIER_6_METALLURGY,
    TIER_7_COMPOSITES,
    TIER_8_SEMICONDUCTORS,
    TIER_9_ENERGY_NANO,
    TIER_10_EXOTIC,
    getRecipeById,
    getRecipesByCategory,
    getRecipesByTier,
    getAllCategories,
    getTotalRecipeCount,
    searchRecipes,
    getRecipesUsingIngredient,
    getRecipesUnlockedAt,
    calculateBatchValue,
    getRecipeTree
};

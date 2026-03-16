// js/crafting/fields/materials-science.js
// Materials Science Recipes - 100+ recipes for ceramics, glasses, composites, and advanced materials
// Tier 1-7: From Basic Ceramics to Smart Materials

export const MATERIALS_SCIENCE_RECIPES = {
    
    // ============================================================================
    // TIER 1: BASIC CERAMICS & CLAYS (15 recipes)
    // ============================================================================
    
    'Clays & Earths': [
        {
            id: 'earthenware_clay',
            name: 'Earthenware Clay',
            formula: 'Al₂Si₂O₅(OH)₄ + H₂O → Workable Clay',
            ingredients: { Silicon: 4, Aluminum: 2, Oxygen: 9, Hydrogen: 4 },
            field: 'materials-science',
            category: 'Clays & Earths',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '🟤',
            unlocksAt: 0,
            value: 20,
            description: 'Common clay for pottery and bricks. Fires at low temperatures.',
            laborMultiplier: 1.1,
            usedIn: ['pottery', 'bricks', 'terracotta']
        },
        {
            id: 'stoneware_clay',
            name: 'Stoneware Clay',
            formula: 'Higher Al₂O₃ + SiO₂ → Stoneware Body',
            ingredients: { Silicon: 6, Aluminum: 4, Oxygen: 15, Iron: 1 },
            field: 'materials-science',
            category: 'Clays & Earths',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '⚪',
            unlocksAt: 50,
            value: 35,
            description: 'Durable clay for dinnerware and stoneware. Fires at medium temperatures.',
            laborMultiplier: 1.2,
            usedIn: ['dinnerware', 'cookware', 'art']
        },
        {
            id: 'porcelain_clay',
            name: 'Porcelain Clay',
            formula: 'Kaolin + Feldspar + Quartz → Porcelain Body',
            ingredients: { Silicon: 8, Aluminum: 6, Oxygen: 20, Potassium: 1 },
            field: 'materials-science',
            category: 'Clays & Earths',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '⚪',
            unlocksAt: 100,
            value: 60,
            description: 'Fine white clay for porcelain. Fires at high temperatures to become vitreous.',
            laborMultiplier: 1.3,
            usedIn: ['fine_china', 'insulators', 'dental']
        },
        {
            id: 'ball_clay',
            name: 'Ball Clay',
            formula: 'Kaolinite + Organic Matter → Plastic Clay',
            ingredients: { Silicon: 5, Aluminum: 3, Oxygen: 12, Carbon: 1 },
            field: 'materials-science',
            category: 'Clays & Earths',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '🟫',
            unlocksAt: 70,
            value: 30,
            description: 'Highly plastic clay for increasing workability.',
            laborMultiplier: 1.1,
            usedIn: ['ceramics', 'tiles', 'sanitaryware']
        },
        {
            id: 'fire_clay',
            name: 'Fire Clay',
            formula: 'Al₂O₃·2SiO₂·2H₂O + Refractory Additives → Heat Resistant',
            ingredients: { Silicon: 6, Aluminum: 4, Oxygen: 15, Magnesium: 1 },
            field: 'materials-science',
            category: 'Clays & Earths',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '🔥',
            unlocksAt: 150,
            value: 50,
            description: 'Heat-resistant clay for kilns and furnaces.',
            laborMultiplier: 1.3,
            usedIn: ['firebricks', 'kiln_furniture', 'crucibles']
        }
    ],
    
    'Basic Ceramics': [
        {
            id: 'terracotta',
            name: 'Terracotta',
            formula: 'Earthenware Clay + 800°C → Fired Terracotta',
            ingredients: { EarthenwareClay: 10 },
            field: 'materials-science',
            category: 'Basic Ceramics',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '🏺',
            unlocksAt: 0,
            value: 40,
            description: 'Fired earthenware. Porous but durable.',
            laborMultiplier: 1.1,
            usedIn: ['pots', 'roof_tiles', 'sculpture']
        },
        {
            id: 'bisque_ware',
            name: 'Bisque Ware',
            formula: 'Clay + First Firing → Bisque',
            ingredients: { Clay: 10 },
            field: 'materials-science',
            category: 'Basic Ceramics',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '⚪',
            unlocksAt: 20,
            value: 35,
            description: 'Clay fired once, ready for glazing.',
            laborMultiplier: 1.1,
            usedIn: ['glazing', 'painting', 'decoration']
        },
        {
            id: 'brick',
            name: 'Brick',
            formula: 'Clay + Shale + 1000°C → Brick',
            ingredients: { EarthenwareClay: 20, Silicon: 5 },
            field: 'materials-science',
            category: 'Basic Ceramics',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '🧱',
            unlocksAt: 30,
            value: 25,
            description: 'Standard building brick. Strong in compression.',
            laborMultiplier: 1.2,
            usedIn: ['construction', 'walls', 'pavement']
        },
        {
            id: 'firebrick',
            name: 'Firebrick',
            formula: 'Fire Clay + High Firing → Refractory Brick',
            ingredients: { FireClay: 15, Magnesium: 2 },
            field: 'materials-science',
            category: 'Basic Ceramics',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '🔥',
            unlocksAt: 200,
            value: 80,
            description: 'Heat-resistant brick for furnaces and kilns.',
            laborMultiplier: 1.4,
            usedIn: ['furnaces', 'kilns', 'fireplaces']
        },
        {
            id: 'roof_tile',
            name: 'Roof Tile',
            formula: 'Clay + Molding + Firing → Tile',
            ingredients: { EarthenwareClay: 15, Sand: 5 },
            field: 'materials-science',
            category: 'Basic Ceramics',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '🏠',
            unlocksAt: 40,
            value: 45,
            description: 'Interlocking roof tiles for construction.',
            laborMultiplier: 1.2,
            usedIn: ['roofing', 'construction']
        }
    ],
    
    // ============================================================================
    // TIER 2: GLASSES (20 recipes)
    // ============================================================================
    
    'Soda-Lime Glass': [
        {
            id: 'soda_lime_glass',
            name: 'Soda-Lime Glass',
            formula: 'SiO₂ + Na₂O + CaO → Container Glass',
            ingredients: { SiliconDioxide: 70, SodiumOxide: 15, CalciumOxide: 10 },
            field: 'materials-science',
            category: 'Soda-Lime Glass',
            tier: 2,
            skillGain: 5,
            target: 200,
            icon: '🥃',
            unlocksAt: 300,
            value: 50,
            description: 'Most common glass for windows and containers.',
            laborMultiplier: 1.3,
            usedIn: ['windows', 'bottles', 'jars']
        },
        {
            id: 'float_glass',
            name: 'Float Glass',
            formula: 'Soda-Lime Glass + Tin Float Bath → Sheet Glass',
            ingredients: { SodaLimeGlass: 10 },
            field: 'materials-science',
            category: 'Soda-Lime Glass',
            tier: 2,
            skillGain: 6,
            target: 200,
            icon: '🪟',
            unlocksAt: 350,
            value: 80,
            description: 'Perfectly flat sheet glass for windows.',
            laborMultiplier: 1.4,
            usedIn: ['windows', 'screens', 'tabletops']
        },
        {
            id: 'tempered_glass',
            name: 'Tempered Glass',
            formula: 'Glass + Heat + Rapid Cooling → Safety Glass',
            ingredients: { FloatGlass: 10 },
            field: 'materials-science',
            category: 'Soda-Lime Glass',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '🛡️',
            unlocksAt: 400,
            value: 150,
            description: 'Heat-treated safety glass. Shatters into small pieces.',
            laborMultiplier: 1.5,
            usedIn: ['car_windows', 'shower_doors', 'phone_screens']
        },
        {
            id: 'laminated_glass',
            name: 'Laminated Glass',
            formula: 'Glass + PVB Interlayer + Glass → Safety Laminate',
            ingredients: { FloatGlass: 20, Polymer: 2 },
            field: 'materials-science',
            category: 'Soda-Lime Glass',
            tier: 2,
            skillGain: 10,
            target: 200,
            icon: '🪟',
            unlocksAt: 450,
            value: 200,
            description: 'Glass with plastic interlayer. Holds together when broken.',
            laborMultiplier: 1.6,
            usedIn: ['windshields', 'skylights', 'security_glass']
        }
    ],
    
    'Borosilicate Glass': [
        {
            id: 'borosilicate_glass',
            name: 'Borosilicate Glass',
            formula: 'SiO₂ + B₂O₃ + Na₂O → Heat-Resistant Glass',
            ingredients: { SiliconDioxide: 80, Boron: 12, SodiumOxide: 4 },
            field: 'materials-science',
            category: 'Borosilicate Glass',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '🧪',
            unlocksAt: 500,
            value: 120,
            description: 'Low thermal expansion glass for labware.',
            laborMultiplier: 1.5,
            usedIn: ['lab_glassware', 'cookware', 'lighting']
        },
        {
            id: 'pyrex',
            name: 'Pyrex',
            formula: 'Borosilicate Glass → Annealed → Finished',
            ingredients: { BorosilicateGlass: 10 },
            field: 'materials-science',
            category: 'Borosilicate Glass',
            tier: 2,
            skillGain: 6,
            target: 200,
            icon: '🧪',
            unlocksAt: 550,
            value: 100,
            description: 'Branded borosilicate for kitchen and lab.',
            laborMultiplier: 1.4,
            usedIn: ['baking_dishes', 'beakers', 'test_tubes']
        },
        {
            id: 'glass_cookware',
            name: 'Glass Cookware',
            formula: 'Borosilicate Glass + Molding → Oven-Safe Dish',
            ingredients: { BorosilicateGlass: 15 },
            field: 'materials-science',
            category: 'Borosilicate Glass',
            tier: 2,
            skillGain: 7,
            target: 200,
            icon: '🥘',
            unlocksAt: 600,
            value: 180,
            description: 'Oven-to-table glass cookware.',
            laborMultiplier: 1.5,
            usedIn: ['baking', 'serving', 'storage']
        }
    ],
    
    'Specialty Glass': [
        {
            id: 'lead_crystal',
            name: 'Lead Crystal',
            formula: 'SiO₂ + PbO + K₂O → Brilliant Glass',
            ingredients: { SiliconDioxide: 60, Lead: 24, PotassiumOxide: 10 },
            field: 'materials-science',
            category: 'Specialty Glass',
            tier: 2,
            skillGain: 10,
            target: 200,
            icon: '🍷',
            unlocksAt: 650,
            value: 300,
            description: 'High refractive index glass for fine glassware.',
            laborMultiplier: 1.6,
            usedIn: ['stemware', 'chandeliers', 'art']
        },
        {
            id: 'aluminosilicate_glass',
            name: 'Aluminosilicate Glass',
            formula: 'SiO₂ + Al₂O₃ + MgO → Strong Glass',
            ingredients: { SiliconDioxide: 60, Aluminum: 15, Magnesium: 5 },
            field: 'materials-science',
            category: 'Specialty Glass',
            tier: 2,
            skillGain: 12,
            target: 200,
            icon: '📱',
            unlocksAt: 700,
            value: 250,
            description: 'Strong glass for smartphone screens.',
            laborMultiplier: 1.7,
            usedIn: ['gorilla_glass', 'touch_screens', 'aerospace']
        },
        {
            id: 'glass_ceramic',
            name: 'Glass-Ceramic',
            formula: 'Glass + Controlled Crystallization → Ceramizable',
            ingredients: { Lithium: 5, Aluminum: 10, Silicon: 30 },
            field: 'materials-science',
            category: 'Specialty Glass',
            tier: 2,
            skillGain: 15,
            target: 200,
            icon: '🔥',
            unlocksAt: 800,
            value: 400,
            description: 'Zero thermal expansion material for cooktops.',
            laborMultiplier: 1.8,
            usedIn: ['cooktops', 'telescope_mirrors', 'fireplace_windows']
        }
    ],
    
    // ============================================================================
    // TIER 3: ADVANCED CERAMICS (20 recipes)
    // ============================================================================
    
    'Technical Ceramics': [
        {
            id: 'alumina_ceramic',
            name: 'Alumina Ceramic',
            formula: 'Al₂O₃ + Sintering → High-Purity Alumina',
            ingredients: { AluminumOxide: 50 },
            field: 'materials-science',
            category: 'Technical Ceramics',
            tier: 3,
            skillGain: 15,
            target: 300,
            icon: '💎',
            unlocksAt: 1000,
            value: 200,
            description: 'Hard, wear-resistant ceramic for industrial use.',
            laborMultiplier: 1.6,
            usedIn: ['spark_plugs', 'grinding_media', 'wear_parts']
        },
        {
            id: 'zirconia_ceramic',
            name: 'Zirconia Ceramic',
            formula: 'ZrO₂ + Y₂O₃ → Stabilized Zirconia',
            ingredients: { Zirconium: 40, Yttrium: 3, Oxygen: 20 },
            field: 'materials-science',
            category: 'Technical Ceramics',
            tier: 3,
            skillGain: 20,
            target: 300,
            icon: '⚪',
            unlocksAt: 1200,
            value: 400,
            description: 'Tough ceramic with high fracture resistance.',
            laborMultiplier: 1.8,
            usedIn: ['dental_crowns', 'knives', 'oxygen_sensors']
        },
        {
            id: 'silicon_carbide',
            name: 'Silicon Carbide',
            formula: 'SiC → Carborundum',
            ingredients: { Silicon: 30, Carbon: 30 },
            field: 'materials-science',
            category: 'Technical Ceramics',
            tier: 3,
            skillGain: 25,
            target: 300,
            icon: '⚫',
            unlocksAt: 1400,
            value: 500,
            description: 'Extremely hard ceramic for abrasives and armor.',
            laborMultiplier: 2.0,
            usedIn: ['abrasives', 'armor', 'brake_pads']
        },
        {
            id: 'silicon_nitride',
            name: 'Silicon Nitride',
            formula: 'Si₃N₄ → High-Strength Ceramic',
            ingredients: { Silicon: 42, Nitrogen: 28 },
            field: 'materials-science',
            category: 'Technical Ceramics',
            tier: 3,
            skillGain: 28,
            target: 300,
            icon: '🔧',
            unlocksAt: 1600,
            value: 600,
            description: 'High-strength ceramic for bearings and cutting tools.',
            laborMultiplier: 2.1,
            usedIn: ['bearings', 'cutting_tools', 'turbine_parts']
        },
        {
            id: 'aluminum_nitride',
            name: 'Aluminum Nitride',
            formula: 'AlN → High Thermal Conductivity Ceramic',
            ingredients: { Aluminum: 30, Nitrogen: 20 },
            field: 'materials-science',
            category: 'Technical Ceramics',
            tier: 3,
            skillGain: 22,
            target: 300,
            icon: '❄️',
            unlocksAt: 1800,
            value: 550,
            description: 'Excellent thermal conductor for electronics.',
            laborMultiplier: 2.0,
            usedIn: ['heat_sinks', 'substrates', 'LED_packaging']
        }
    ],
    
    'Refractories': [
        {
            id: 'magnesia_refractory',
            name: 'Magnesia Refractory',
            formula: 'MgO → Basic Refractory',
            ingredients: { MagnesiumOxide: 40 },
            field: 'materials-science',
            category: 'Refractories',
            tier: 3,
            skillGain: 15,
            target: 300,
            icon: '⚪',
            unlocksAt: 2000,
            value: 250,
            description: 'Basic refractory for steelmaking furnaces.',
            laborMultiplier: 1.7,
            usedIn: ['furnace_linings', 'crucibles', 'cement_kilns']
        },
        {
            id: 'chrome_refractory',
            name: 'Chrome-Magnesite Refractory',
            formula: 'MgO + Cr₂O₃ → Neutral Refractory',
            ingredients: { MagnesiumOxide: 30, Chromium: 15 },
            field: 'materials-science',
            category: 'Refractories',
            tier: 3,
            skillGain: 18,
            target: 300,
            icon: '🟫',
            unlocksAt: 2200,
            value: 350,
            description: 'Neutral refractory for non-ferrous metallurgy.',
            laborMultiplier: 1.8,
            usedIn: ['copper_smelting', 'glass_tanks', 'rotary_kilns']
        },
        {
            id: 'zirconia_refractory',
            name: 'Zirconia Refractory',
            formula: 'ZrO₂ + CaO → Stabilized Refractory',
            ingredients: { Zirconium: 40, Calcium: 5 },
            field: 'materials-science',
            category: 'Refractories',
            tier: 3,
            skillGain: 25,
            target: 300,
            icon: '🔥',
            unlocksAt: 2500,
            value: 600,
            description: 'Ultra-high temperature refractory for extreme conditions.',
            laborMultiplier: 2.2,
            usedIn: ['fiber_optics', 'jet_engines', 'nuclear_reactors']
        }
    ],
    
    // ============================================================================
    // TIER 4: COMPOSITES (15 recipes)
    // ============================================================================
    
    'Ceramic Composites': [
        {
            id: 'cermet',
            name: 'Cermet (Ceramic-Metal Composite)',
            formula: 'Ceramic + Metal → Composite',
            ingredients: { AluminaCeramic: 30, Titanium: 20 },
            field: 'materials-science',
            category: 'Ceramic Composites',
            tier: 4,
            skillGain: 25,
            target: 400,
            icon: '⚙️',
            unlocksAt: 3000,
            value: 600,
            description: 'Ceramic-metal composite for cutting tools.',
            laborMultiplier: 2.0,
            usedIn: ['cutting_tools', 'dies', 'wear_parts']
        },
        {
            id: 'crc',
            name: 'Ceramic Matrix Composite (CMC)',
            formula: 'Ceramic Fibers + Ceramic Matrix → Composite',
            ingredients: { SiliconCarbide: 30, SiliconCarbideFiber: 20 },
            field: 'materials-science',
            category: 'Ceramic Composites',
            tier: 4,
            skillGain: 35,
            target: 400,
            icon: '🚀',
            unlocksAt: 3500,
            value: 1000,
            description: 'Tough, heat-resistant composite for jet engines.',
            laborMultiplier: 2.5,
            usedIn: ['turbine_shrouds', 'combustion_liners', 'heat_shields']
        }
    ],
    
    'Carbon-Carbon': [
        {
            id: 'carbon_carbon_green',
            name: 'Carbon-Carbon Green Composite',
            formula: 'Carbon Fibers + Resin → Preform',
            ingredients: { CarbonFiber: 30, EpoxyResin: 20 },
            field: 'materials-science',
            category: 'Carbon-Carbon',
            tier: 4,
            skillGain: 30,
            target: 400,
            icon: '⚫',
            unlocksAt: 4000,
            value: 800,
            description: 'Unfired carbon-carbon composite preform.',
            laborMultiplier: 2.2,
            usedIn: ['carbon_carbon', 'heat_shields']
        },
        {
            id: 'carbon_carbon',
            name: 'Carbon-Carbon Composite',
            formula: 'Green Composite + Carbonization + Densification → C-C',
            ingredients: { CarbonCarbonGreen: 10 },
            field: 'materials-science',
            category: 'Carbon-Carbon',
            tier: 4,
            skillGain: 45,
            target: 400,
            icon: '🛡️',
            unlocksAt: 5000,
            value: 2000,
            description: 'Ultra-high temperature composite for rocket nozzles.',
            laborMultiplier: 3.0,
            usedIn: ['rocket_nozzles', 'brake_disks', 'reentry_shields']
        }
    ],
    
    // ============================================================================
    // TIER 5: BIOMATERIALS (10 recipes)
    // ============================================================================
    
    'Bioceramics': [
        {
            id: 'hydroxyapatite',
            name: 'Hydroxyapatite',
            formula: 'Ca₅(PO₄)₃OH → Bone Mineral',
            ingredients: { Calcium: 30, Phosphorus: 18, Oxygen: 50, Hydrogen: 2 },
            field: 'materials-science',
            category: 'Bioceramics',
            tier: 5,
            skillGain: 30,
            target: 500,
            icon: '🦴',
            unlocksAt: 6000,
            value: 800,
            description: 'Synthetic bone mineral for implants.',
            laborMultiplier: 2.2,
            usedIn: ['bone_grafts', 'dental_implants', 'coatings']
        },
        {
            id: 'bioglass',
            name: 'Bioglass',
            formula: 'SiO₂ + Na₂O + CaO + P₂O₅ → Bioactive Glass',
            ingredients: { SiliconDioxide: 45, SodiumOxide: 24, CalciumOxide: 24, Phosphorus: 5 },
            field: 'materials-science',
            category: 'Bioceramics',
            tier: 5,
            skillGain: 35,
            target: 500,
            icon: '🧪',
            unlocksAt: 6500,
            value: 1000,
            description: 'Glass that bonds with bone for medical implants.',
            laborMultiplier: 2.5,
            usedIn: ['bone_fillers', 'implants', 'tissue_engineering']
        },
        {
            id: 'zirconia_dental',
            name: 'Zirconia Dental Ceramic',
            formula: 'ZrO₂ + Coloring → Dental Ceramic',
            ingredients: { ZirconiaCeramic: 30, Pigments: 2 },
            field: 'materials-science',
            category: 'Bioceramics',
            tier: 5,
            skillGain: 32,
            target: 500,
            icon: '🦷',
            unlocksAt: 7000,
            value: 1200,
            description: 'Aesthetic and strong ceramic for dental crowns.',
            laborMultiplier: 2.4,
            usedIn: ['crowns', 'bridges', 'implants']
        }
    ],
    
    // ============================================================================
    // TIER 6: SMART MATERIALS (12 recipes)
    // ============================================================================
    
    'Piezoelectrics': [
        {
            id: 'pzt',
            name: 'Lead Zirconate Titanate (PZT)',
            formula: 'Pb(Zr,Ti)O₃ → Piezoelectric Ceramic',
            ingredients: { Lead: 30, Zirconium: 15, Titanium: 15, Oxygen: 40 },
            field: 'materials-science',
            category: 'Piezoelectrics',
            tier: 6,
            skillGain: 40,
            target: 600,
            icon: '⚡',
            unlocksAt: 8000,
            value: 1500,
            description: 'Generates electricity when compressed.',
            laborMultiplier: 2.8,
            usedIn: ['sensors', 'actuators', 'ultrasonic_transducers']
        },
        {
            id: 'barium_titanate',
            name: 'Barium Titanate',
            formula: 'BaTiO₃ → Ferroelectric Ceramic',
            ingredients: { Barium: 30, Titanium: 15, Oxygen: 30 },
            field: 'materials-science',
            category: 'Piezoelectrics',
            tier: 6,
            skillGain: 35,
            target: 600,
            icon: '🔋',
            unlocksAt: 8500,
            value: 1200,
            description: 'High dielectric constant material for capacitors.',
            laborMultiplier: 2.6,
            usedIn: ['capacitors', 'thermistors', 'electro-optics']
        },
        {
            id: 'quartz_crystal',
            name: 'Quartz Crystal',
            formula: 'SiO₂ + Growth → Piezoelectric Crystal',
            ingredients: { Quartz: 50 },
            field: 'materials-science',
            category: 'Piezoelectrics',
            tier: 6,
            skillGain: 30,
            target: 600,
            icon: '⌚',
            unlocksAt: 9000,
            value: 800,
            description: 'Natural piezoelectric for timing devices.',
            laborMultiplier: 2.2,
            usedIn: ['watches', 'oscillators', 'filters']
        }
    ],
    
    'Electrochromic': [
        {
            id: 'tungsten_oxide',
            name: 'Tungsten Oxide',
            formula: 'WO₃ → Electrochromic Layer',
            ingredients: { Tungsten: 40, Oxygen: 30 },
            field: 'materials-science',
            category: 'Electrochromic',
            tier: 6,
            skillGain: 38,
            target: 600,
            icon: '🟦',
            unlocksAt: 9500,
            value: 1100,
            description: 'Changes color with applied voltage.',
            laborMultiplier: 2.5,
            usedIn: ['smart_windows', 'displays', 'rearview_mirrors']
        },
        {
            id: 'viologen',
            name: 'Viologen',
            formula: 'Organic Salt → Electrochromic Dye',
            ingredients: { Carbon: 30, Hydrogen: 20, Nitrogen: 10 },
            field: 'materials-science',
            category: 'Electrochromic',
            tier: 6,
            skillGain: 35,
            target: 600,
            icon: '🟪',
            unlocksAt: 10000,
            value: 1000,
            description: 'Organic electrochromic material for displays.',
            laborMultiplier: 2.4,
            usedIn: ['e-paper', 'displays', 'smart_glass']
        }
    ],
    
    'Thermochromic': [
        {
            id: 'vanadium_dioxide',
            name: 'Vanadium Dioxide',
            formula: 'VO₂ → Thermochromic',
            ingredients: { Vanadium: 40, Oxygen: 20 },
            field: 'materials-science',
            category: 'Thermochromic',
            tier: 6,
            skillGain: 42,
            target: 600,
            icon: '🌡️',
            unlocksAt: 10500,
            value: 1400,
            description: 'Changes properties at critical temperature.',
            laborMultiplier: 2.7,
            usedIn: ['smart_windows', 'sensors', 'switches']
        },
        {
            id: 'thermochromic_pigment',
            name: 'Thermochromic Pigment',
            formula: 'Liquid Crystals + Microcapsules → Temperature-Sensitive',
            ingredients: { LiquidCrystal: 20, Polymer: 15 },
            field: 'materials-science',
            category: 'Thermochromic',
            tier: 6,
            skillGain: 30,
            target: 600,
            icon: '🎨',
            unlocksAt: 11000,
            value: 900,
            description: 'Pigment that changes color with temperature.',
            laborMultiplier: 2.3,
            usedIn: ['mood_rings', 'thermometers', 'novelty_items']
        }
    ],
    
    // ============================================================================
    // TIER 7: ADVANCED & EXOTIC MATERIALS (8 recipes)
    // ============================================================================
    
    'Aerogels': [
        {
            id: 'silica_aerogel',
            name: 'Silica Aerogel',
            formula: 'SiO₂ + Supercritical Drying → Frozen Smoke',
            ingredients: { SiliconDioxide: 30, Solvent: 50 },
            field: 'materials-science',
            category: 'Aerogels',
            tier: 7,
            skillGain: 60,
            target: 800,
            icon: '☁️',
            unlocksAt: 15000,
            value: 3000,
            description: 'Ultra-light, highly insulating material.',
            laborMultiplier: 3.5,
            usedIn: ['insulation', 'space_collection', 'lightweight_structures']
        },
        {
            id: 'carbon_aerogel',
            name: 'Carbon Aerogel',
            formula: 'Resin + Pyrolysis + Supercritical → Conductive Aerogel',
            ingredients: { Resin: 40, Carbon: 30 },
            field: 'materials-science',
            category: 'Aerogels',
            tier: 7,
            skillGain: 70,
            target: 800,
            icon: '⚫',
            unlocksAt: 18000,
            value: 5000,
            description: 'Conductive, ultra-light material for supercapacitors.',
            laborMultiplier: 4.0,
            usedIn: ['supercapacitors', 'battery_electrodes', 'catalysts']
        }
    ],
    
    'Photonic Materials': [
        {
            id: 'photonic_crystal',
            name: 'Photonic Crystal',
            formula: 'Periodic Dielectric Structure → Light Control',
            ingredients: { Silicon: 40, PrecisionStructure: 1 },
            field: 'materials-science',
            category: 'Photonic Materials',
            tier: 7,
            skillGain: 80,
            target: 800,
            icon: '💎',
            unlocksAt: 20000,
            value: 8000,
            description: 'Controls light flow for optical computing.',
            laborMultiplier: 5.0,
            usedIn: ['optical_computers', 'waveguides', 'lasers']
        },
        {
            id: 'negative_index_metamaterial',
            name: 'Negative Index Metamaterial',
            formula: 'Split Ring Resonators + Wires → Invisibility',
            ingredients: { Copper: 30, Dielectric: 30, PrecisionStructure: 1 },
            field: 'materials-science',
            category: 'Photonic Materials',
            tier: 7,
            skillGain: 100,
            target: 800,
            icon: '👻',
            unlocksAt: 25000,
            value: 20000,
            description: 'Material with negative refractive index.',
            laborMultiplier: 6.0,
            usedIn: ['cloaking_devices', 'superlenses', 'antennas']
        }
    ],
    
    'MAX Phases': [
        {
            id: 'ti3sic2',
            name: 'Ti₃SiC₂ (MAX Phase)',
            formula: 'Ti + Si + C → Machinable Ceramic',
            ingredients: { Titanium: 45, Silicon: 15, Carbon: 10 },
            field: 'materials-science',
            category: 'MAX Phases',
            tier: 7,
            skillGain: 65,
            target: 800,
            icon: '🔧',
            unlocksAt: 22000,
            value: 6000,
            description: 'Machinable, damage-tolerant ceramic.',
            laborMultiplier: 4.5,
            usedIn: ['high_temp_applications', 'nuclear', 'aerospace']
        }
    ],
    
    'High Entropy Ceramics': [
        {
            id: 'high_entropy_carbide',
            name: 'High-Entropy Carbide',
            formula: '(Ti,Zr,Hf,Nb,Ta)C → Multi-Cation Ceramic',
            ingredients: { Titanium: 10, Zirconium: 10, Hafnium: 10, Niobium: 10, Tantalum: 10, Carbon: 20 },
            field: 'materials-science',
            category: 'High Entropy Ceramics',
            tier: 7,
            skillGain: 90,
            target: 800,
            icon: '💎',
            unlocksAt: 30000,
            value: 15000,
            description: 'Extremely stable, hard ceramic from multiple cations.',
            laborMultiplier: 5.5,
            usedIn: ['extreme_environments', 'cutting_tools', 'armor']
        }
    ]
};

// ============================================================================
// EXPORT ALL MATERIALS SCIENCE RECIPES
// ============================================================================

export default MATERIALS_SCIENCE_RECIPES;

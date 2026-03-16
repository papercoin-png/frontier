// js/crafting/fields/magnetic.js
// Magnetic Materials Recipes - 40+ recipes for permanent magnets, soft magnets, and magnetic materials
// Tier 1-7: From Basic Magnets to Advanced Spintronics

export const MAGNETIC_RECIPES = {
    
    // ============================================================================
    // TIER 1: BASIC MAGNETIC MATERIALS (8 recipes)
    // ============================================================================
    
    'Natural Magnets': [
        {
            id: 'lodestone',
            name: 'Lodestone (Magnetite)',
            formula: 'Fe₃O₄ → Natural Permanent Magnet',
            ingredients: { Iron: 60, Oxygen: 40 },
            field: 'magnetic',
            category: 'Natural Magnets',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '🧲',
            unlocksAt: 0,
            value: 50,
            description: 'Naturally occurring magnetic mineral.',
            laborMultiplier: 1.2,
            usedIn: ['compasses', 'historical', 'education']
        },
        {
            id: 'magnetite_powder',
            name: 'Magnetite Powder',
            formula: 'Fe₃O₄ + Grinding → Magnetic Powder',
            ingredients: { Magnetite: 30, BallMilling: 2 },
            field: 'magnetic',
            category: 'Natural Magnets',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '⚫',
            unlocksAt: 50,
            value: 30,
            description: 'Fine magnetite powder for magnetic fluids and coatings.',
            laborMultiplier: 1.1,
            usedIn: ['ferrofluids', 'magnetic_inks', 'coatings']
        }
    ],
    
    'Iron-Based Magnets': [
        {
            id: 'pure_iron',
            name: 'Pure Iron',
            formula: 'Fe → Soft Magnetic Material',
            ingredients: { Iron: 50 },
            field: 'magnetic',
            category: 'Iron-Based Magnets',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '⚙️',
            unlocksAt: 0,
            value: 40,
            description: 'High-purity iron for soft magnetic applications.',
            laborMultiplier: 1.1,
            usedIn: ['electromagnets', 'cores', 'transformers']
        },
        {
            id: 'electrical_steel',
            name: 'Electrical Steel',
            formula: 'Fe + Si → Lamination Steel',
            ingredients: { Iron: 90, Silicon: 5 },
            field: 'magnetic',
            category: 'Iron-Based Magnets',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '📊',
            unlocksAt: 100,
            value: 60,
            description: 'Silicon steel for transformer cores and motors.',
            laborMultiplier: 1.3,
            usedIn: ['transformers', 'motors', 'generators']
        },
        {
            id: 'iron_cobalt',
            name: 'Iron-Cobalt Alloy',
            formula: 'Fe + Co → High Saturation',
            ingredients: { Iron: 60, Cobalt: 30 },
            field: 'magnetic',
            category: 'Iron-Based Magnets',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '⚡',
            unlocksAt: 150,
            value: 100,
            description: 'Highest saturation magnetization alloy.',
            laborMultiplier: 1.4,
            usedIn: ['pole_tips', 'high_field_magnets', 'aerospace']
        }
    ],
    
    'Magnetic Testing': [
        {
            id: 'gaussmeter',
            name: 'Gaussmeter',
            formula: 'Hall Sensor + Electronics + Display → Field Meter',
            ingredients: { HallSensor: 2, CircuitBoard: 2, Display: 1, Battery: 1 },
            field: 'magnetic',
            category: 'Magnetic Testing',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '📏',
            unlocksAt: 200,
            value: 200,
            description: 'Instrument for measuring magnetic field strength.',
            laborMultiplier: 1.4,
            usedIn: ['testing', 'quality_control', 'research']
        },
        {
            id: 'magnetic_compass',
            name: 'Magnetic Compass',
            formula: 'Magnetized Needle + Housing → Direction Finder',
            ingredients: { Steel: 5, MagnetizedNeedle: 1, Housing: 1, Liquid: 2 },
            field: 'magnetic',
            category: 'Magnetic Testing',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '🧭',
            unlocksAt: 50,
            value: 30,
            description: 'Simple magnetic compass for navigation.',
            laborMultiplier: 1.2,
            usedIn: ['navigation', 'surveying', 'education']
        }
    ],
    
    // ============================================================================
    // TIER 2: SOFT MAGNETIC MATERIALS (8 recipes)
    // ============================================================================
    
    'Ferrites': [
        {
            id: 'manganese_zinc_ferrite',
            name: 'Manganese-Zinc Ferrite',
            formula: 'MnZnFe₂O₄ → High Permeability',
            ingredients: { Manganese: 15, Zinc: 10, Iron: 40, Oxygen: 25 },
            field: 'magnetic',
            category: 'Ferrites',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '🟫',
            unlocksAt: 400,
            value: 80,
            description: 'Soft ferrite with high permeability for power applications.',
            laborMultiplier: 1.5,
            usedIn: ['transformers', 'inductors', 'emi_filters']
        },
        {
            id: 'nickel_zinc_ferrite',
            name: 'Nickel-Zinc Ferrite',
            formula: 'NiZnFe₂O₄ → High Frequency',
            ingredients: { Nickel: 20, Zinc: 10, Iron: 35, Oxygen: 25 },
            field: 'magnetic',
            category: 'Ferrites',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '🟪',
            unlocksAt: 450,
            value: 90,
            description: 'Soft ferrite for high-frequency applications.',
            laborMultiplier: 1.5,
            usedIn: ['rf_transformers', 'antenna_rods', 'high_frequency']
        },
        {
            id: 'ferrite_core',
            name: 'Ferrite Core',
            formula: 'Ferrite Powder + Pressing + Sintering → Toroid',
            ingredients: { FerritePowder: 30, Pressing: 1, Sintering: 1 },
            field: 'magnetic',
            category: 'Ferrites',
            tier: 2,
            skillGain: 10,
            target: 200,
            icon: '⭕',
            unlocksAt: 500,
            value: 50,
            description: 'Toroidal ferrite core for inductors and transformers.',
            laborMultiplier: 1.6,
            usedIn: ['power_supplies', 'inductors', 'transformers']
        }
    ],
    
    'Permalloys': [
        {
            id: 'permalloy_80',
            name: 'Permalloy 80',
            formula: 'Ni₈₀Fe₂₀ → High Permeability',
            ingredients: { Nickel: 70, Iron: 20 },
            field: 'magnetic',
            category: 'Permalloys',
            tier: 2,
            skillGain: 10,
            target: 200,
            icon: '✨',
            unlocksAt: 600,
            value: 150,
            description: 'Nickel-iron alloy with very high permeability.',
            laborMultiplier: 1.7,
            usedIn: ['magnetic_shielding', 'sensors', 'recording_heads']
        },
        {
            id: 'mu_metal',
            name: 'Mu-Metal',
            formula: 'Ni₇₇Fe₁₄Cu₅Mo₄ → Magnetic Shielding',
            ingredients: { Nickel: 70, Iron: 15, Copper: 5, Molybdenum: 4 },
            field: 'magnetic',
            category: 'Permalloys',
            tier: 2,
            skillGain: 12,
            target: 200,
            icon: '🛡️',
            unlocksAt: 700,
            value: 200,
            description: 'High-permeability alloy for magnetic shielding.',
            laborMultiplier: 1.8,
            usedIn: ['crt_shielding', 'sensitive_electronics', 'scientific']
        },
        {
            id: 'supermalloy',
            name: 'Supermalloy',
            formula: 'Ni₇₉Fe₁₆Mo₅ → Ultra-High Permeability',
            ingredients: { Nickel: 75, Iron: 15, Molybdenum: 5 },
            field: 'magnetic',
            category: 'Permalloys',
            tier: 2,
            skillGain: 15,
            target: 200,
            icon: '💫',
            unlocksAt: 800,
            value: 300,
            description: 'Ultra-high permeability alloy for critical applications.',
            laborMultiplier: 2.0,
            usedIn: ['quantum_sensors', 'medical_imaging', 'scientific']
        }
    ],
    
    // ============================================================================
    // TIER 3: HARD MAGNETIC MATERIALS (8 recipes)
    // ============================================================================
    
    'Alnico Magnets': [
        {
            id: 'alnico_5',
            name: 'Alnico 5',
            formula: 'AlNiCoFe → Classic Permanent Magnet',
            ingredients: { Aluminum: 10, Nickel: 15, Cobalt: 25, Iron: 50 },
            field: 'magnetic',
            category: 'Alnico Magnets',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '🧲',
            unlocksAt: 1000,
            value: 200,
            description: 'Aluminum-nickel-cobalt permanent magnet.',
            laborMultiplier: 1.8,
            usedIn: ['sensors', 'motors', 'loudspeakers']
        },
        {
            id: 'alnico_8',
            name: 'Alnico 8',
            formula: 'AlNiCoFeTi → High Coercivity',
            ingredients: { Aluminum: 8, Nickel: 15, Cobalt: 35, Iron: 40, Titanium: 2 },
            field: 'magnetic',
            category: 'Alnico Magnets',
            tier: 3,
            skillGain: 15,
            target: 300,
            icon: '⚡',
            unlocksAt: 1200,
            value: 300,
            description: 'High-coercivity alnico for demanding applications.',
            laborMultiplier: 2.0,
            usedIn: ['instruments', 'traveling_wave_tubes', 'sensors']
        }
    ],
    
    'Ferrite Magnets': [
        {
            id: 'barium_ferrite',
            name: 'Barium Ferrite',
            formula: 'BaFe₁₂O₁₉ → Ceramic Magnet',
            ingredients: { Barium: 15, Iron: 60, Oxygen: 25 },
            field: 'magnetic',
            category: 'Ferrite Magnets',
            tier: 3,
            skillGain: 10,
            target: 300,
            icon: '🟤',
            unlocksAt: 900,
            value: 60,
            description: 'Low-cost ceramic permanent magnet.',
            laborMultiplier: 1.6,
            usedIn: ['refrigerator_magnets', 'speakers', 'toys']
        },
        {
            id: 'strontium_ferrite',
            name: 'Strontium Ferrite',
            formula: 'SrFe₁₂O₁₉ → High Performance Ferrite',
            ingredients: { Strontium: 15, Iron: 60, Oxygen: 25 },
            field: 'magnetic',
            category: 'Ferrite Magnets',
            tier: 3,
            skillGain: 11,
            target: 300,
            icon: '🔴',
            unlocksAt: 950,
            value: 80,
            description: 'Higher-performance ferrite permanent magnet.',
            laborMultiplier: 1.7,
            usedIn: ['motors', 'separators', 'magnetic_holders']
        },
        {
            id: 'ferrite_magnet',
            name: 'Ferrite Magnet',
            formula: 'Ferrite Powder + Pressing + Sintering + Magnetization → Block',
            ingredients: { BariumFerrite: 30, Pressing: 1, Sintering: 1, Magnetization: 1 },
            field: 'magnetic',
            category: 'Ferrite Magnets',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '🧱',
            unlocksAt: 1000,
            value: 50,
            description: 'Finished ferrite magnet block or ring.',
            laborMultiplier: 1.7,
            usedIn: ['general_purpose', 'crafts', 'industry']
        }
    ],
    
    'Magnet Processing': [
        {
            id: 'magnetizer',
            name: 'Magnetizer',
            formula: 'Capacitors + Coil + Trigger → High Field Pulse',
            ingredients: { Capacitors: 10, CopperCoil: 5, Thyristor: 2, Housing: 2 },
            field: 'magnetic',
            category: 'Magnet Processing',
            tier: 3,
            skillGain: 15,
            target: 300,
            icon: '⚡',
            unlocksAt: 1500,
            value: 500,
            description: 'Device for magnetizing permanent magnets.',
            laborMultiplier: 2.0,
            usedIn: ['manufacturing', 'assembly', 'repair']
        },
        {
            id: 'demagnetizer',
            name: 'Demagnetizer',
            formula: 'AC Coil + Controller → Degaussing',
            ingredients: { CopperCoil: 8, ACController: 2, Housing: 1 },
            field: 'magnetic',
            category: 'Magnet Processing',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '🔄',
            unlocksAt: 1300,
            value: 150,
            description: 'Device for demagnetizing tools and components.',
            laborMultiplier: 1.8,
            usedIn: ['tool_maintenance', 'watchmaking', 'manufacturing']
        }
    ],
    
    // ============================================================================
    // TIER 4: RARE EARTH MAGNETS (8 recipes)
    // ============================================================================
    
    'Neodymium Magnets': [
        {
            id: 'ndfeb_alloy',
            name: 'NdFeB Alloy',
            formula: 'Nd₂Fe₁₄B → Sintered Magnet Precursor',
            ingredients: { Neodymium: 25, Iron: 65, Boron: 5 },
            field: 'magnetic',
            category: 'Neodymium Magnets',
            tier: 4,
            skillGain: 20,
            target: 400,
            icon: '✨',
            unlocksAt: 2000,
            value: 500,
            description: 'Neodymium-iron-boron alloy for strongest permanent magnets.',
            laborMultiplier: 2.5,
            usedIn: ['hard_drives', 'motors', 'headphones']
        },
        {
            id: 'sintered_ndfeb',
            name: 'Sintered NdFeB Magnet',
            formula: 'NdFeB Alloy + Pressing + Sintering → High Energy',
            ingredients: { NdFeBAlloy: 30, Pressing: 2, Sintering: 2, Magnetization: 1 },
            field: 'magnetic',
            category: 'Neodymium Magnets',
            tier: 4,
            skillGain: 30,
            target: 400,
            icon: '💎',
            unlocksAt: 2500,
            value: 800,
            description: 'Highest strength permanent magnet.',
            laborMultiplier: 3.0,
            usedIn: ['ev_motors', 'wind_turbines', 'mri_machines']
        },
        {
            id: 'bonded_ndfeb',
            name: 'Bonded NdFeB Magnet',
            formula: 'NdFeB Powder + Polymer + Molding → Complex Shapes',
            ingredients: { NdFeBAlloy: 25, Polymer: 5, InjectionMolding: 1 },
            field: 'magnetic',
            category: 'Neodymium Magnets',
            tier: 4,
            skillGain: 25,
            target: 400,
            icon: '🔩',
            unlocksAt: 2200,
            value: 400,
            description: 'Neodymium magnet in complex shapes via bonding.',
            laborMultiplier: 2.5,
            usedIn: ['sensors', 'small_motors', 'electronics']
        }
    ],
    
    'Samarium-Cobalt': [
        {
            id: 'smco5',
            name: 'SmCo₅ (1:5 Type)',
            formula: 'SmCo₅ → High Temperature Magnet',
            ingredients: { Samarium: 30, Cobalt: 60 },
            field: 'magnetic',
            category: 'Samarium-Cobalt',
            tier: 4,
            skillGain: 22,
            target: 400,
            icon: '🔥',
            unlocksAt: 3000,
            value: 1000,
            description: 'Samarium-cobalt magnet for high-temperature use.',
            laborMultiplier: 2.8,
            usedIn: ['aerospace', 'high_temp_sensors', 'traveling_wave_tubes']
        },
        {
            id: 'sm2co17',
            name: 'Sm₂Co₁₇ (2:17 Type)',
            formula: 'Sm₂Co₁₇ → Higher Energy',
            ingredients: { Samarium: 20, Cobalt: 70, Iron: 5, Copper: 3 },
            field: 'magnetic',
            category: 'Samarium-Cobalt',
            tier: 4,
            skillGain: 28,
            target: 400,
            icon: '⚡',
            unlocksAt: 3500,
            value: 1500,
            description: 'Higher energy product samarium-cobalt magnet.',
            laborMultiplier: 3.0,
            usedIn: ['defense', 'aerospace', 'high_performance']
        }
    ],
    
    'Coatings': [
        {
            id: 'nickel_coating',
            name: 'Nickel Coating for Magnets',
            formula: 'Electroless Nickel → Corrosion Protection',
            ingredients: { Nickel: 10, Hypophosphite: 2, Plating: 1 },
            field: 'magnetic',
            category: 'Coatings',
            tier: 4,
            skillGain: 15,
            target: 400,
            icon: '🔧',
            unlocksAt: 2800,
            value: 50,
            description: 'Corrosion-resistant coating for neodymium magnets.',
            laborMultiplier: 1.8,
            usedIn: ['ndfeb_protection', 'automotive', 'outdoor']
        },
        {
            id: 'epoxy_coating',
            name: 'Epoxy Coating',
            formula: 'Epoxy Resin + Hardener → Protective Layer',
            ingredients: { EpoxyResin: 8, Hardener: 2 },
            field: 'magnetic',
            category: 'Coatings',
            tier: 4,
            skillGain: 12,
            target: 400,
            icon: '🧴',
            unlocksAt: 2600,
            value: 30,
            description: 'Epoxy protection for magnets in harsh environments.',
            laborMultiplier: 1.6,
            usedIn: ['marine', 'chemical', 'food_processing']
        }
    ],
    
    // ============================================================================
    // TIER 5: MAGNETIC MATERIALS FOR ELECTRONICS (6 recipes)
    // ============================================================================
    
    'Magnetic Recording': [
        {
            id: 'magnetic_tape',
            name: 'Magnetic Tape',
            formula: 'PET Film + Magnetic Particles + Binder → Recording Media',
            ingredients: { PETFilm: 20, FerricOxide: 15, Binder: 3 },
            field: 'magnetic',
            category: 'Magnetic Recording',
            tier: 5,
            skillGain: 18,
            target: 500,
            icon: '📼',
            unlocksAt: 5000,
            value: 100,
            description: 'Magnetic tape for data and audio recording.',
            laborMultiplier: 2.0,
            usedIn: ['cassettes', 'vhs', 'data_backup']
        },
        {
            id: 'hard_disk_platter',
            name: 'Hard Disk Platter',
            formula: 'Aluminum Substrate + Magnetic Coating + Carbon → HDD',
            ingredients: { AluminumSubstrate: 10, MagneticCoating: 5, CarbonOvercoat: 2 },
            field: 'magnetic',
            category: 'Magnetic Recording',
            tier: 5,
            skillGain: 35,
            target: 500,
            icon: '💿',
            unlocksAt: 6000,
            value: 500,
            description: 'Magnetic platter for hard disk drives.',
            laborMultiplier: 3.0,
            usedIn: ['hard_drives', 'data_storage', 'servers']
        },
        {
            id: 'mr_head',
            name: 'Magnetoresistive Head',
            formula: 'Thin Films + Lithography → Read Head',
            ingredients: { MagneticFilms: 8, GMRMultilayer: 3, Lithography: 2 },
            field: 'magnetic',
            category: 'Magnetic Recording',
            tier: 5,
            skillGain: 40,
            target: 500,
            icon: '🔍',
            unlocksAt: 6500,
            value: 800,
            description: 'Magnetoresistive read head for hard drives.',
            laborMultiplier: 3.5,
            usedIn: ['hard_drives', 'tape_drives', 'data_recovery']
        }
    ],
    
    'Magnetic Sensors': [
        {
            id: 'hall_sensor',
            name: 'Hall Effect Sensor',
            formula: 'Semiconductor + Electronics → Magnetic Field Sensor',
            ingredients: { Silicon: 10, Doping: 1, Amplifier: 2, Package: 1 },
            field: 'magnetic',
            category: 'Magnetic Sensors',
            tier: 5,
            skillGain: 25,
            target: 500,
            icon: '📊',
            unlocksAt: 4500,
            value: 50,
            description: 'Semiconductor sensor for magnetic field measurement.',
            laborMultiplier: 2.2,
            usedIn: ['position_sensors', 'current_sensors', 'automotive']
        },
        {
            id: 'gmr_sensor',
            name: 'GMR Sensor',
            formula: 'Magnetic Multilayers + Lithography → Giant Magnetoresistance',
            ingredients: { MagneticFilms: 10, MultilayerDeposition: 2, Lithography: 2 },
            field: 'magnetic',
            category: 'Magnetic Sensors',
            tier: 5,
            skillGain: 38,
            target: 500,
            icon: '📈',
            unlocksAt: 7000,
            value: 300,
            description: 'Giant magnetoresistance sensor for high sensitivity.',
            laborMultiplier: 3.2,
            usedIn: ['hard_drives', 'biosensors', 'automotive']
        },
        {
            id: 'fluxgate_magnetometer',
            name: 'Fluxgate Magnetometer',
            formula: 'Permalloy Core + Coils + Electronics → Vector Magnetometer',
            ingredients: { Permalloy80: 10, CopperCoil: 8, Electronics: 5, Housing: 2 },
            field: 'magnetic',
            category: 'Magnetic Sensors',
            tier: 5,
            skillGain: 32,
            target: 500,
            icon: '🧭',
            unlocksAt: 5500,
            value: 1000,
            description: 'High-precision magnetic field sensor.',
            laborMultiplier: 2.8,
            usedIn: ['geophysics', 'space', 'navigation']
        }
    ],
    
    // ============================================================================
    // TIER 6: ADVANCED MAGNETIC MATERIALS (6 recipes)
    // ============================================================================
    
    'Nanocrystalline Materials': [
        {
            id: 'finemet',
            name: 'Finemet (Nanocrystalline)',
            formula: 'FeSiNbBCu → Nanocrystalline Soft Magnet',
            ingredients: { Iron: 70, Silicon: 10, Niobium: 5, Boron: 5, Copper: 2 },
            field: 'magnetic',
            category: 'Nanocrystalline Materials',
            tier: 6,
            skillGain: 40,
            target: 600,
            icon: '🔬',
            unlocksAt: 10000,
            value: 500,
            description: 'Nanocrystalline soft magnetic material with excellent properties.',
            laborMultiplier: 3.5,
            usedIn: ['common_mode_chokes', 'high_freq_transformers', 'emi_filters']
        },
        {
            id: 'nanoperm',
            name: 'Nanoperm',
            formula: 'FeZrB → High Flux',
            ingredients: { Iron: 80, Zirconium: 8, Boron: 7 },
            field: 'magnetic',
            category: 'Nanocrystalline Materials',
            tier: 6,
            skillGain: 38,
            target: 600,
            icon: '⚡',
            unlocksAt: 9500,
            value: 450,
            description: 'Nanocrystalline alloy with high saturation flux density.',
            laborMultiplier: 3.3,
            usedIn: ['transformers', 'inductors', 'power_electronics']
        },
        {
            id: 'amorphous_metal',
            name: 'Amorphous Metal Ribbon',
            formula: 'FeSiB + Melt Spinning → Glassy Metal',
            ingredients: { Iron: 75, Silicon: 10, Boron: 10, MeltSpinning: 2 },
            field: 'magnetic',
            category: 'Nanocrystalline Materials',
            tier: 6,
            skillGain: 35,
            target: 600,
            icon: '📼',
            unlocksAt: 9000,
            value: 300,
            description: 'Amorphous metal with excellent soft magnetic properties.',
            laborMultiplier: 3.0,
            usedIn: ['distribution_transformers', 'sensors', 'magnetic_shielding']
        }
    ],
    
    'Magnetostrictive Materials': [
        {
            id: 'terfenol_d',
            name: 'Terfenol-D',
            formula: 'TbₓDy₁₋ₓFe₂ → Giant Magnetostriction',
            ingredients: { Terbium: 20, Dysprosium: 20, Iron: 50 },
            field: 'magnetic',
            category: 'Magnetostrictive Materials',
            tier: 6,
            skillGain: 45,
            target: 600,
            icon: '🔊',
            unlocksAt: 12000,
            value: 2000,
            description: 'Material with giant magnetostriction for actuators and sensors.',
            laborMultiplier: 4.0,
            usedIn: ['sonar', 'actuators', 'vibration_dampers']
        },
        {
            id: 'galfenol',
            name: 'Galfenol',
            formula: 'FeGa → Ductile Magnetostrictive',
            ingredients: { Iron: 80, Gallium: 15 },
            field: 'magnetic',
            category: 'Magnetostrictive Materials',
            tier: 6,
            skillGain: 35,
            target: 600,
            icon: '🔄',
            unlocksAt: 11000,
            value: 1000,
            description: 'Ductile magnetostrictive alloy for sensors and energy harvesting.',
            laborMultiplier: 3.2,
            usedIn: ['energy_harvesting', 'sensors', 'actuators']
        }
    ],
    
    // ============================================================================
    // TIER 7: SPINTRONICS & QUANTUM MATERIALS (6 recipes)
    // ============================================================================
    
    'Spintronic Materials': [
        {
            id: 'magnetic_tunnel_junction',
            name: 'Magnetic Tunnel Junction',
            formula: 'FM + Barrier + FM → MTJ',
            ingredients: { CoFeB: 10, MgO: 2, ThinFilmDeposition: 3, Lithography: 2 },
            field: 'magnetic',
            category: 'Spintronic Materials',
            tier: 7,
            skillGain: 60,
            target: 800,
            icon: '🔄',
            unlocksAt: 20000,
            value: 3000,
            description: 'Magnetic tunnel junction for MRAM and sensors.',
            laborMultiplier: 5.0,
            usedIn: ['mram', 'magnetic_sensors', 'spin_valves']
        },
        {
            id: 'spin_valve',
            name: 'Spin Valve',
            formula: 'FM1/Cu/FM2 + AFM → GMR Structure',
            ingredients: { Cobalt: 10, Copper: 5, Permalloy: 8, IrMn: 3 },
            field: 'magnetic',
            category: 'Spintronic Materials',
            tier: 7,
            skillGain: 55,
            target: 800,
            icon: '🧲',
            unlocksAt: 18000,
            value: 2000,
            description: 'Giant magnetoresistance spin valve structure.',
            laborMultiplier: 4.5,
            usedIn: ['hard_drive_heads', 'magnetic_sensors', 'biosensors']
        },
        {
            id: 'half_metal',
            name: 'Half-Metallic Ferromagnet',
            formula: 'CrO₂ → 100% Spin Polarized',
            ingredients: { Chromium: 30, Oxygen: 20, HighPressure: 2 },
            field: 'magnetic',
            category: 'Spintronic Materials',
            tier: 7,
            skillGain: 65,
            target: 800,
            icon: '💎',
            unlocksAt: 25000,
            value: 5000,
            description: 'Material with complete spin polarization for spintronics.',
            laborMultiplier: 5.5,
            usedIn: ['spintronics', 'quantum_computing', 'research']
        }
    ],
    
    'Topological Materials': [
        {
            id: 'topological_insulator',
            name: 'Topological Insulator',
            formula: 'Bi₂Se₃ → Surface Conductor',
            ingredients: { Bismuth: 40, Selenium: 30, CrystalGrowth: 3 },
            field: 'magnetic',
            category: 'Topological Materials',
            tier: 7,
            skillGain: 75,
            target: 800,
            icon: '🔮',
            unlocksAt: 30000,
            value: 10000,
            description: 'Material that conducts on surface, insulates in bulk.',
            laborMultiplier: 6.0,
            usedIn: ['quantum_computing', 'spintronics', 'research']
        },
        {
            id: 'magnetic_topological_insulator',
            name: 'Magnetic Topological Insulator',
            formula: 'Bi₂Se₃ + Mn → Quantum Anomalous Hall',
            ingredients: { Bismuth: 38, Selenium: 30, Manganese: 2, CrystalGrowth: 4 },
            field: 'magnetic',
            category: 'Topological Materials',
            tier: 7,
            skillGain: 90,
            target: 800,
            icon: '⚡',
            unlocksAt: 35000,
            value: 20000,
            description: 'Topological insulator with magnetic doping for quantum effects.',
            laborMultiplier: 7.0,
            usedIn: ['quantum_computing', 'dissipationless_transport', 'research']
        }
    ],
    
    'Skyrmion Materials': [
        {
            id: 'skyrmion_host',
            name: 'Skyrmion Host Material',
            formula: 'MnSi → Magnetic Skyrmion Lattice',
            ingredients: { Manganese: 40, Silicon: 20, CrystalGrowth: 3 },
            field: 'magnetic',
            category: 'Skyrmion Materials',
            tier: 7,
            skillGain: 85,
            target: 800,
            icon: '🌀',
            unlocksAt: 40000,
            value: 15000,
            description: 'Material that hosts magnetic skyrmions for data storage.',
            laborMultiplier: 6.5,
            usedIn: ['racetrack_memory', 'spintronics', 'future_storage']
        }
    ],
    
    // ============================================================================
    // ADDITIONAL: MAGNETIC APPLICATIONS (Helper recipes)
    // ============================================================================
    
    'Magnetic Assemblies': [
        {
            id: 'magnetic_coupling',
            name: 'Magnetic Coupling',
            formula: 'Magnets + Housing + Shafts → Contactless Drive',
            ingredients: { NdFeBMagnet: 4, StainlessSteel: 10, Bearings: 2 },
            field: 'magnetic',
            category: 'Magnetic Assemblies',
            tier: 4,
            skillGain: 20,
            target: 400,
            icon: '🔄',
            unlocksAt: 4000,
            value: 300,
            description: 'Contactless magnetic coupling for sealed systems.',
            laborMultiplier: 2.2,
            usedIn: ['pumps', 'mixers', 'vacuum_chambers']
        },
        {
            id: 'magnetic_separator',
            name: 'Magnetic Separator',
            formula: 'Magnets + Frame + Conveyor → Separation System',
            ingredients: { FerriteMagnets: 20, SteelFrame: 30, ConveyorBelt: 10 },
            field: 'magnetic',
            category: 'Magnetic Assemblies',
            tier: 3,
            skillGain: 18,
            target: 300,
            icon: '⚙️',
            unlocksAt: 2000,
            value: 500,
            description: 'Magnetic separator for industrial processing.',
            laborMultiplier: 2.0,
            usedIn: ['mining', 'recycling', 'food_processing']
        },
        {
            id: 'magnetic_levitator',
            name: 'Magnetic Levitator',
            formula: 'Electromagnets + Controller + Sensors → Maglev',
            ingredients: { Electromagnets: 8, Controller: 3, HallSensors: 2 },
            field: 'magnetic',
            category: 'Magnetic Assemblies',
            tier: 5,
            skillGain: 35,
            target: 500,
            icon: '🚀',
            unlocksAt: 8000,
            value: 2000,
            description: 'Magnetic levitation demonstration or component.',
            laborMultiplier: 3.0,
            usedIn: ['demonstrations', 'transportation', 'bearings']
        }
    ]
};

// ============================================================================
// EXPORT ALL MAGNETIC RECIPES
// ============================================================================

export default MAGNETIC_RECIPES;

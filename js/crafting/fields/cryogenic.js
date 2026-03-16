// js/crafting/fields/cryogenic.js
// Cryogenic Materials Recipes - 30+ recipes for superconductors, cryogenic insulation, and low-temperature materials
// Tier 1-7: From Basic Insulation to Room-Temperature Superconductors

export const CRYOGENIC_RECIPES = {
    
    // ============================================================================
    // TIER 1: CRYOGENIC INSULATION (6 recipes)
    // ============================================================================
    
    'Thermal Insulation': [
        {
            id: 'multilayer_insulation',
            name: 'Multilayer Insulation (MLI)',
            formula: 'Aluminized Mylar + Spacer Layers → Superinsulation',
            ingredients: { Mylar: 20, Aluminum: 5, PolyesterMesh: 10 },
            field: 'cryogenic',
            category: 'Thermal Insulation',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '✨',
            unlocksAt: 0,
            value: 80,
            description: 'Reflective layered insulation for cryogenic vessels.',
            laborMultiplier: 1.3,
            usedIn: ['cryogenic_tanks', 'spacecraft', 'dewars']
        },
        {
            id: 'aerogel_blanket',
            name: 'Aerogel Insulation Blanket',
            formula: 'Silica Aerogel + Fiber Reinforcement → Flexible Insulation',
            ingredients: { SilicaAerogel: 15, GlassFiber: 10, Binder: 2 },
            field: 'cryogenic',
            category: 'Thermal Insulation',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '🪹',
            unlocksAt: 100,
            value: 150,
            description: 'Flexible aerogel blanket for cryogenic pipe insulation.',
            laborMultiplier: 1.4,
            usedIn: ['pipelines', 'tanks', 'cold_boxes']
        },
        {
            id: 'perlite_powder',
            name: 'Expanded Perlite',
            formula: 'Volcanic Glass + Heating → Expanded Insulation',
            ingredients: { PerliteOre: 30, Heat: 5 },
            field: 'cryogenic',
            category: 'Thermal Insulation',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '⚪',
            unlocksAt: 50,
            value: 30,
            description: 'Expanded perlite powder for cryogenic tank insulation.',
            laborMultiplier: 1.2,
            usedIn: ['lng_tanks', 'cold_boxes', 'loose_fill']
        }
    ],
    
    'Vacuum Components': [
        {
            id: 'vacuum_jacket',
            name: 'Vacuum Jacket',
            formula: 'Stainless Steel + Welding → Double-Walled Vessel',
            ingredients: { StainlessSteel: 50, Welding: 5, VacuumPort: 2 },
            field: 'cryogenic',
            category: 'Vacuum Components',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '🥫',
            unlocksAt: 150,
            value: 200,
            description: 'Double-walled vacuum jacket for cryogenic containers.',
            laborMultiplier: 1.5,
            usedIn: ['dewars', 'cryostats', 'transfer_lines']
        },
        {
            id: 'cryogenic_valve',
            name: 'Cryogenic Valve',
            formula: 'Stainless Steel + Extended Stem + PTFE Seals → Cold Valve',
            ingredients: { StainlessSteel: 20, PTFE: 5, Bellows: 2, Actuator: 3 },
            field: 'cryogenic',
            category: 'Vacuum Components',
            tier: 1,
            skillGain: 6,
            target: 100,
            icon: '🔧',
            unlocksAt: 200,
            value: 300,
            description: 'Specialized valve for cryogenic fluid handling.',
            laborMultiplier: 1.6,
            usedIn: ['lng_systems', 'helium_plants', 'research']
        },
        {
            id: 'cryogenic_ferrule',
            name: 'Cryogenic Ferrule',
            formula: 'Stainless Steel + Precision Machining → Tube Fitting',
            ingredients: { StainlessSteel: 10, PrecisionMachining: 2 },
            field: 'cryogenic',
            category: 'Vacuum Components',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '🔩',
            unlocksAt: 120,
            value: 50,
            description: 'Precision ferrule for cryogenic tube fittings.',
            laborMultiplier: 1.3,
            usedIn: ['instrumentation', 'transfer_lines', 'connections']
        }
    ],
    
    // ============================================================================
    // TIER 2: CRYOGENIC FLUIDS & HANDLING (6 recipes)
    // ============================================================================
    
    'Cryogenic Liquids': [
        {
            id: 'liquid_nitrogen',
            name: 'Liquid Nitrogen',
            formula: 'N₂ + Compression + Cooling → LN₂',
            ingredients: { Nitrogen: 100, Compression: 5, Cryocooling: 5 },
            field: 'cryogenic',
            category: 'Cryogenic Liquids',
            tier: 2,
            skillGain: 5,
            target: 200,
            icon: '❄️',
            unlocksAt: 300,
            value: 20,
            description: 'Liquid nitrogen at 77K for cooling and preservation.',
            laborMultiplier: 1.4,
            usedIn: ['cooling', 'cryopreservation', 'food_freezing']
        },
        {
            id: 'liquid_helium',
            name: 'Liquid Helium',
            formula: 'He + Liquefaction → LHe',
            ingredients: { Helium: 100, Liquefaction: 10 },
            field: 'cryogenic',
            category: 'Cryogenic Liquids',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '💨',
            unlocksAt: 500,
            value: 200,
            description: 'Liquid helium at 4.2K for superconductors and research.',
            laborMultiplier: 1.8,
            usedIn: ['mri_magnets', 'superconductors', 'physics_research']
        },
        {
            id: 'liquid_hydrogen',
            name: 'Liquid Hydrogen',
            formula: 'H₂ + Ortho-Para Conversion + Liquefaction → LH₂',
            ingredients: { Hydrogen: 100, OrthoParaConversion: 5, Liquefaction: 8 },
            field: 'cryogenic',
            category: 'Cryogenic Liquids',
            tier: 2,
            skillGain: 7,
            target: 200,
            icon: '💧',
            unlocksAt: 400,
            value: 150,
            description: 'Liquid hydrogen at 20K for rocket fuel and energy storage.',
            laborMultiplier: 1.6,
            usedIn: ['rocket_fuel', 'energy_storage', 'neutron_scattering']
        }
    ],
    
    'Transfer Systems': [
        {
            id: 'cryogenic_transfer_line',
            name: 'Cryogenic Transfer Line',
            formula: 'Stainless Steel + MLI + Vacuum Jacket → Flexible Transfer',
            ingredients: { StainlessSteel: 30, MLI: 10, VacuumJacket: 5, Bellows: 3 },
            field: 'cryogenic',
            category: 'Transfer Systems',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '📏',
            unlocksAt: 600,
            value: 500,
            description: 'Vacuum-insulated transfer line for cryogenic fluids.',
            laborMultiplier: 1.8,
            usedIn: ['helium_transfer', 'lng_transfer', 'research']
        },
        {
            id: 'bayonet_connection',
            name: 'Bayonet Connection',
            formula: 'Stainless Steel + PTFE Seals → Quick Disconnect',
            ingredients: { StainlessSteel: 15, PTFE: 3, PrecisionMachining: 2 },
            field: 'cryogenic',
            category: 'Transfer Systems',
            tier: 2,
            skillGain: 6,
            target: 200,
            icon: '🔌',
            unlocksAt: 550,
            value: 150,
            description: 'Quick-disconnect bayonet fitting for cryogenic lines.',
            laborMultiplier: 1.6,
            usedIn: ['cryostats', 'transfer_lines', 'dewars']
        },
        {
            id: 'cryogenic_pump',
            name: 'Cryogenic Pump',
            formula: 'Stainless Steel + Motor + Bearings → Cold Pump',
            ingredients: { StainlessSteel: 40, Motor: 8, CryogenicBearings: 5, Seals: 3 },
            field: 'cryogenic',
            category: 'Transfer Systems',
            tier: 2,
            skillGain: 10,
            target: 200,
            icon: '💧',
            unlocksAt: 700,
            value: 1000,
            description: 'Pump for moving cryogenic liquids.',
            laborMultiplier: 2.0,
            usedIn: ['lng_plants', 'helium_recovery', 'fuel_systems']
        }
    ],
    
    // ============================================================================
    // TIER 3: LOW-TEMPERATURE MATERIALS (6 recipes)
    // ============================================================================
    
    'Cryogenic Alloys': [
        {
            id: 'cryogenic_steel',
            name: 'Cryogenic Steel (9% Ni)',
            formula: 'Fe + 9% Ni → LNG Grade Steel',
            ingredients: { Iron: 90, Nickel: 9 },
            field: 'cryogenic',
            category: 'Cryogenic Alloys',
            tier: 3,
            skillGain: 8,
            target: 300,
            icon: '⚙️',
            unlocksAt: 1000,
            value: 200,
            description: 'Nickel steel for LNG storage tanks.',
            laborMultiplier: 1.8,
            usedIn: ['lng_tanks', 'cryogenic_vessels', 'storage']
        },
        {
            id: 'invar_cryogenic',
            name: 'Invar (Fe-36Ni)',
            formula: 'Fe + 36% Ni → Low Expansion',
            ingredients: { Iron: 60, Nickel: 35 },
            field: 'cryogenic',
            category: 'Cryogenic Alloys',
            tier: 3,
            skillGain: 10,
            target: 300,
            icon: '📏',
            unlocksAt: 1200,
            value: 300,
            description: 'Low thermal expansion alloy for cryogenic standards.',
            laborMultiplier: 2.0,
            usedIn: ['lng_piping', 'standards', 'cryogenic_structures']
        },
        {
            id: 'aluminum_5083',
            name: 'Aluminum 5083',
            formula: 'Al + Mg + Mn → Cryogenic Aluminum',
            ingredients: { Aluminum: 90, Magnesium: 5, Manganese: 1 },
            field: 'cryogenic',
            category: 'Cryogenic Alloys',
            tier: 3,
            skillGain: 7,
            target: 300,
            icon: '🥫',
            unlocksAt: 900,
            value: 150,
            description: 'Aluminum alloy for cryogenic tanks and piping.',
            laborMultiplier: 1.6,
            usedIn: ['lng_tanks', 'cryogenic_components', 'marine']
        }
    ],
    
    'Seals & Gaskets': [
        {
            id: 'indium_vacuum_seal',
            name: 'Indium Vacuum Seal',
            formula: 'In + Compression → Ultra-High Vacuum Seal',
            ingredients: { Indium: 20, CopperGasket: 5 },
            field: 'cryogenic',
            category: 'Seals & Gaskets',
            tier: 3,
            skillGain: 9,
            target: 300,
            icon: '🔘',
            unlocksAt: 1500,
            value: 400,
            description: 'Indium wire seal for cryogenic vacuum applications.',
            laborMultiplier: 1.9,
            usedIn: ['cryostats', 'vacuum_chambers', 'superconductor_labs']
        },
        {
            id: 'ptfe_cryogenic_seal',
            name: 'PTFE Cryogenic Seal',
            formula: 'PTFE + Spring Energizer → Low-Temp Seal',
            ingredients: { PTFE: 15, StainlessSteelSpring: 2 },
            field: 'cryogenic',
            category: 'Seals & Gaskets',
            tier: 3,
            skillGain: 6,
            target: 300,
            icon: '⭕',
            unlocksAt: 1100,
            value: 100,
            description: 'PTFE seal with spring for cryogenic valves.',
            laborMultiplier: 1.5,
            usedIn: ['valves', 'fittings', 'pumps']
        },
        {
            id: 'helical_washer',
            name: 'Helical Spring Washer',
            formula: 'Stainless Steel + Coiling → Cryogenic Spring',
            ingredients: { StainlessSteel: 10, Coiling: 1, HeatTreatment: 1 },
            field: 'cryogenic',
            category: 'Seals & Gaskets',
            tier: 3,
            skillGain: 5,
            target: 300,
            icon: '🔄',
            unlocksAt: 800,
            value: 30,
            description: 'Spring washer for maintaining bolt tension at cryogenic temps.',
            laborMultiplier: 1.4,
            usedIn: ['flanges', 'bolted_joints', 'cryogenic_assemblies']
        }
    ],
    
    // ============================================================================
    // TIER 4: CONVENTIONAL SUPERCONDUCTORS (6 recipes)
    // ============================================================================
    
    'Low-Temperature Superconductors': [
        {
            id: 'nb_ti_wire',
            name: 'Nb-Ti Superconducting Wire',
            formula: 'NbTi + Copper Matrix + Drawing → Superconductor',
            ingredients: { Niobium: 30, Titanium: 15, Copper: 40, Drawing: 5 },
            field: 'cryogenic',
            category: 'Low-Temperature Superconductors',
            tier: 4,
            skillGain: 20,
            target: 400,
            icon: '📏',
            unlocksAt: 2000,
            value: 500,
            description: 'Niobium-titanium superconducting wire for MRI magnets.',
            laborMultiplier: 2.5,
            usedIn: ['mri_magnets', 'accelerator_magnets', 'research']
        },
        {
            id: 'nb_sn_wire',
            name: 'Nb₃Sn Superconducting Wire',
            formula: 'Nb + Sn + Bronze Route → A15 Superconductor',
            ingredients: { Niobium: 40, Tin: 15, Bronze: 30, HeatTreatment: 5 },
            field: 'cryogenic',
            category: 'Low-Temperature Superconductors',
            tier: 4,
            skillGain: 25,
            target: 400,
            icon: '⚡',
            unlocksAt: 2500,
            value: 1000,
            description: 'Higher-field superconductor for fusion and NMR.',
            laborMultiplier: 3.0,
            usedIn: ['fusion_magnets', 'nmr', 'high_field_magnets']
        },
        {
            id: 'nb_magnet',
            name: 'Superconducting Magnet (Nb-Ti)',
            formula: 'Nb-Ti Wire + Winding + Cryostat → Magnet',
            ingredients: { NbTiWire: 100, Epoxy: 10, Cryostat: 20, CurrentLeads: 5 },
            field: 'cryogenic',
            category: 'Low-Temperature Superconductors',
            tier: 4,
            skillGain: 30,
            target: 400,
            icon: '🧲',
            unlocksAt: 3000,
            value: 5000,
            description: 'Complete superconducting magnet system.',
            laborMultiplier: 3.5,
            usedIn: ['mri', 'research', 'magnet_labs']
        }
    ],
    
    'Superconductor Components': [
        {
            id: 'persistent_switch',
            name: 'Persistent Current Switch',
            formula: 'Nb-Ti Wire + Heater → Superconducting Switch',
            ingredients: { NbTiWire: 20, HeaterElement: 2, Insulation: 3 },
            field: 'cryogenic',
            category: 'Superconductor Components',
            tier: 4,
            skillGain: 22,
            target: 400,
            icon: '🔄',
            unlocksAt: 2800,
            value: 800,
            description: 'Switch for persistent mode operation of magnets.',
            laborMultiplier: 2.8,
            usedIn: ['mri_magnets', 'nmr', 'persistent_mode']
        },
        {
            id: 'superconductor_joint',
            name: 'Superconducting Joint',
            formula: 'Nb-Ti + Soldering + Superconducting Solder → Zero Resistance',
            ingredients: { NbTiWire: 10, SuperconductingSolder: 5, HeatTreatment: 2 },
            field: 'cryogenic',
            category: 'Superconductor Components',
            tier: 4,
            skillGain: 28,
            target: 400,
            icon: '🔗',
            unlocksAt: 3200,
            value: 1000,
            description: 'Zero-resistance joint between superconductors.',
            laborMultiplier: 3.2,
            usedIn: ['magnet_manufacturing', 'repair', 'persistent_circuits']
        },
        {
            id: 'quench_protection',
            name: 'Quench Protection System',
            formula: 'Sensors + Heaters + Electronics → Protection',
            ingredients: { VoltageSensors: 5, QuenchHeaters: 3, Controller: 2 },
            field: 'cryogenic',
            category: 'Superconductor Components',
            tier: 4,
            skillGain: 24,
            target: 400,
            icon: '🛡️',
            unlocksAt: 3500,
            value: 2000,
            description: 'System to protect superconducting magnets during quench.',
            laborMultiplier: 3.0,
            usedIn: ['mri', 'accelerators', 'fusion']
        }
    ],
    
    // ============================================================================
    // TIER 5: HIGH-TEMPERATURE SUPERCONDUCTORS (6 recipes)
    // ============================================================================
    
    'Cuprate Superconductors': [
        {
            id: 'ybco_powder',
            name: 'YBCO Precursor Powder',
            formula: 'Y₂O₃ + BaCO₃ + CuO → YBa₂Cu₃O₇ Precursor',
            ingredients: { Yttrium: 15, Barium: 30, Copper: 25, Oxygen: 20 },
            field: 'cryogenic',
            category: 'Cuprate Superconductors',
            tier: 5,
            skillGain: 30,
            target: 500,
            icon: '⚫',
            unlocksAt: 5000,
            value: 500,
            description: 'Precursor powder for YBCO high-temperature superconductor.',
            laborMultiplier: 2.8,
            usedIn: ['ybco', 'htsc', 'research']
        },
        {
            id: 'ybco_bulk',
            name: 'YBCO Bulk Superconductor',
            formula: 'YBCO Powder + Sintering + Oxygenation → Bulk',
            ingredients: { YBCOPowder: 50, Sintering: 5, OxygenAnnealing: 3 },
            field: 'cryogenic',
            category: 'Cuprate Superconductors',
            tier: 5,
            skillGain: 40,
            target: 500,
            icon: '⬛',
            unlocksAt: 6000,
            value: 2000,
            description: 'Bulk YBCO superconductor for levitation and trapped flux.',
            laborMultiplier: 3.5,
            usedIn: ['magnetic_levitation', 'trapped_flux_magnets', 'research']
        },
        {
            id: 'ybco_coated_conductor',
            name: 'YBCO Coated Conductor',
            formula: 'Metal Tape + Buffer Layers + YBCO + Silver → 2G Wire',
            ingredients: { HastelloyTape: 20, BufferLayers: 5, YBCO: 10, Silver: 3 },
            field: 'cryogenic',
            category: 'Cuprate Superconductors',
            tier: 5,
            skillGain: 50,
            target: 500,
            icon: '📼',
            unlocksAt: 8000,
            value: 5000,
            description: 'Second-generation high-temperature superconducting wire.',
            laborMultiplier: 4.0,
            usedIn: ['fault_current_limiters', 'cables', 'motors']
        }
    ],
    
    'BSCCO Superconductors': [
        {
            id: 'bscco_2212',
            name: 'Bi-2212 Superconductor',
            formula: 'Bi₂Sr₂CaCu₂O₈ → Powder-in-Tube',
            ingredients: { Bismuth: 30, Strontium: 20, Calcium: 10, Copper: 20, Oxygen: 15 },
            field: 'cryogenic',
            category: 'BSCCO Superconductors',
            tier: 5,
            skillGain: 35,
            target: 500,
            icon: '🔮',
            unlocksAt: 7000,
            value: 1500,
            description: 'BSCCO 2212 superconductor for wire applications.',
            laborMultiplier: 3.2,
            usedIn: ['current_leads', 'magnets', 'cables']
        },
        {
            id: 'bscco_2223',
            name: 'Bi-2223 Superconductor',
            formula: 'Bi₂Sr₂Ca₂Cu₃O₁₀ → High-Tc Wire',
            ingredients: { Bismuth: 25, Strontium: 15, Calcium: 15, Copper: 25, Oxygen: 15 },
            field: 'cryogenic',
            category: 'BSCCO Superconductors',
            tier: 5,
            skillGain: 45,
            target: 500,
            icon: '🧵',
            unlocksAt: 7500,
            value: 3000,
            description: 'First-generation high-temperature superconducting wire.',
            laborMultiplier: 3.8,
            usedIn: ['power_cables', 'transformers', 'magnets']
        }
    ],
    
    // ============================================================================
    // TIER 6: CRYOGENIC SYSTEMS (4 recipes)
    // ============================================================================
    
    'Cryocoolers': [
        {
            id: 'gm_cryocooler',
            name: 'Gifford-McMahon Cryocooler',
            formula: 'Compressor + Regenerator + Cold Head → 4K Cooler',
            ingredients: { Compressor: 20, Regenerator: 15, ColdHead: 10, Motor: 8 },
            field: 'cryogenic',
            category: 'Cryocoolers',
            tier: 6,
            skillGain: 45,
            target: 600,
            icon: '❄️',
            unlocksAt: 10000,
            value: 20000,
            description: 'Cryocooler reaching 4K for superconducting devices.',
            laborMultiplier: 4.0,
            usedIn: ['mri', 'semiconductor_fab', 'research']
        },
        {
            id: 'pulse_tube',
            name: 'Pulse Tube Cryocooler',
            formula: 'Compressor + Pulse Tube + Regenerator → Vibration-Free',
            ingredients: { Compressor: 25, PulseTube: 15, Regenerator: 15, HeatExchangers: 10 },
            field: 'cryogenic',
            category: 'Cryocoolers',
            tier: 6,
            skillGain: 55,
            target: 600,
            icon: '📡',
            unlocksAt: 12000,
            value: 30000,
            description: 'Vibration-free cryocooler for sensitive instruments.',
            laborMultiplier: 4.5,
            usedIn: ['space', 'quantum_computing', 'infrared_detectors']
        }
    ],
    
    'Cryostats': [
        {
            id: 'optical_cryostat',
            name: 'Optical Cryostat',
            formula: 'Vacuum Vessel + Windows + Sample Holder → Low-Temp Chamber',
            ingredients: { StainlessSteel: 40, QuartzWindows: 10, MLI: 15, TemperatureSensors: 5 },
            field: 'cryogenic',
            category: 'Cryostats',
            tier: 6,
            skillGain: 40,
            target: 600,
            icon: '🔬',
            unlocksAt: 9000,
            value: 15000,
            description: 'Cryostat with optical access for spectroscopy.',
            laborMultiplier: 3.8,
            usedIn: ['spectroscopy', 'photoluminescence', 'materials_research']
        },
        {
            id: 'dilution_refrigerator',
            name: 'Dilution Refrigerator',
            formula: 'He-3 + He-4 + Heat Exchangers + Pumps → mK Temperatures',
            ingredients: { Helium3: 50, Helium4: 50, HeatExchangers: 30, VacuumSystem: 20, Magnets: 10 },
            field: 'cryogenic',
            category: 'Cryostats',
            tier: 6,
            skillGain: 70,
            target: 600,
            icon: '🧊',
            unlocksAt: 15000,
            value: 100000,
            description: 'Refrigerator reaching millikelvin temperatures for quantum computing.',
            laborMultiplier: 6.0,
            usedIn: ['quantum_computing', 'condensed_matter', 'astrophysics']
        }
    ],
    
    // ============================================================================
    // TIER 7: ADVANCED & FUTURISTIC MATERIALS (4 recipes)
    // ============================================================================
    
    'Iron-Based Superconductors': [
        {
            id: 'fese_superconductor',
            name: 'FeSe Superconductor',
            formula: 'Fe + Se → Simple Iron-Based SC',
            ingredients: { Iron: 40, Selenium: 30, HeatTreatment: 5 },
            field: 'cryogenic',
            category: 'Iron-Based Superconductors',
            tier: 7,
            skillGain: 50,
            target: 800,
            icon: '⚙️',
            unlocksAt: 20000,
            value: 5000,
            description: 'Simple iron-based superconductor for research.',
            laborMultiplier: 4.5,
            usedIn: ['research', 'thin_films', 'pressure_studies']
        },
        {
            id: 'smfeaso',
            name: 'SmFeAsO (Iron Pnictide)',
            formula: 'Sm + Fe + As + O → High-Tc Pnictide',
            ingredients: { Samarium: 20, Iron: 25, Arsenic: 20, Oxygen: 10 },
            field: 'cryogenic',
            category: 'Iron-Based Superconductors',
            tier: 7,
            skillGain: 65,
            target: 800,
            icon: '🔮',
            unlocksAt: 25000,
            value: 10000,
            description: 'Iron pnictide superconductor with high critical field.',
            laborMultiplier: 5.5,
            usedIn: ['high_field_research', 'superconductivity', 'materials_science']
        }
    ],
    
    'Hydride Superconductors': [
        {
            id: 'h3s_superconductor',
            name: 'H₃S (Hydrogen Sulfide)',
            formula: 'H₂S + High Pressure → High-Tc SC',
            ingredients: { Hydrogen: 70, Sulfur: 20, DiamondAnvilCell: 1 },
            field: 'cryogenic',
            category: 'Hydride Superconductors',
            tier: 7,
            skillGain: 80,
            target: 800,
            icon: '💎',
            unlocksAt: 30000,
            value: 20000,
            description: 'Hydrogen sulfide superconductor under high pressure.',
            laborMultiplier: 6.0,
            usedIn: ['high_pressure_physics', 'superconductivity_research']
        },
        {
            id: 'lah10_superconductor',
            name: 'LaH₁₀ (Lanthanum Hydride)',
            formula: 'La + H + Megabar Pressure → Near-Room-Temp SC',
            ingredients: { Lanthanum: 30, Hydrogen: 60, MegabarPressure: 1, LaserHeating: 1 },
            field: 'cryogenic',
            category: 'Hydride Superconductors',
            tier: 7,
            skillGain: 100,
            target: 800,
            icon: '🏆',
            unlocksAt: 50000,
            value: 50000,
            description: 'Lanthanum hydride superconductor near room temperature.',
            laborMultiplier: 8.0,
            usedIn: ['frontier_research', 'record_tc', 'nobel_prize_material']
        }
    ],
    
    // ============================================================================
    // ADDITIONAL: CRYOGENIC INSTRUMENTS (Helper recipes)
    // ============================================================================
    
    'Cryogenic Sensors': [
        {
            id: 'cernox_sensor',
            name: 'Cernox Temperature Sensor',
            formula: 'ZrN + Thin Film + Packaging → Cryogenic Thermometer',
            ingredients: { ZirconiumNitride: 10, Sapphire: 3, GoldLeads: 2 },
            field: 'cryogenic',
            category: 'Cryogenic Sensors',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '🌡️',
            unlocksAt: 1700,
            value: 400,
            description: 'Zirconium oxynitride sensor for cryogenic temperatures.',
            laborMultiplier: 2.0,
            usedIn: ['temperature_measurement', 'cryostat_control', 'research']
        },
        {
            id: 'ruthenium_oxide_sensor',
            name: 'Ruthenium Oxide Sensor',
            formula: 'RuO₂ + Thick Film → Low-Temp Thermometer',
            ingredients: { Ruthenium: 15, Oxygen: 5, Substrate: 2 },
            field: 'cryogenic',
            category: 'Cryogenic Sensors',
            tier: 3,
            skillGain: 10,
            target: 300,
            icon: '📊',
            unlocksAt: 1400,
            value: 200,
            description: 'Ruthenium oxide resistance thermometer.',
            laborMultiplier: 1.8,
            usedIn: ['dilution_fridges', 'helium_temps', 'research']
        },
        {
            id: 'superconducting_thermometer',
            name: 'Superconducting Transition-Edge Sensor',
            formula: 'Ti + Au + Lithography → Ultra-Sensitive Thermometer',
            ingredients: { Titanium: 10, Gold: 5, Lithography: 3, SuspendedMembrane: 2 },
            field: 'cryogenic',
            category: 'Cryogenic Sensors',
            tier: 5,
            skillGain: 45,
            target: 500,
            icon: '🔍',
            unlocksAt: 8500,
            value: 5000,
            description: 'Transition-edge sensor for ultra-sensitive temperature measurement.',
            laborMultiplier: 4.0,
            usedIn: ['astrophysics', 'quantum_sensing', 'xray_detection']
        }
    ],
    
    'Level Sensors': [
        {
            id: 'helium_level_meter',
            name: 'Helium Level Meter',
            formula: 'Nb-Ti Wire + Superconducting Sensing → Liquid Level',
            ingredients: { NbTiWire: 15, CurrentSource: 2, Meter: 1 },
            field: 'cryogenic',
            category: 'Level Sensors',
            tier: 4,
            skillGain: 18,
            target: 400,
            icon: '📏',
            unlocksAt: 4000,
            value: 600,
            description: 'Superconducting level meter for liquid helium.',
            laborMultiplier: 2.5,
            usedIn: ['helium_dewars', 'cryostats', 'lng_tanks']
        },
        {
            id: 'capacitive_level_sensor',
            name: 'Capacitive Level Sensor',
            formula: 'Stainless Steel + PTFE + Coaxial → Cryogenic Level',
            ingredients: { StainlessSteel: 20, PTFE: 5, CoaxialCable: 2 },
            field: 'cryogenic',
            category: 'Level Sensors',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '📊',
            unlocksAt: 2000,
            value: 300,
            description: 'Capacitive sensor for cryogenic liquid level.',
            laborMultiplier: 2.0,
            usedIn: ['nitrogen_tanks', 'lng', 'research']
        }
    ]
};

// ============================================================================
// EXPORT ALL CRYOGENIC RECIPES
// ============================================================================

export default CRYOGENIC_RECIPES;

// js/crafting/fields/aerospace.js
// Aerospace Materials Recipes - 50+ recipes for spacecraft, aircraft, and high-performance materials
// Tier 1-7: From Lightweight Alloys to Thermal Protection Systems

export const AEROSPACE_RECIPES = {
    
    // ============================================================================
    // TIER 1: LIGHTWEIGHT ALLOYS (8 recipes)
    // ============================================================================
    
    'Aluminum Alloys': [
        {
            id: 'aluminum_2024',
            name: 'Aluminum 2024',
            formula: 'Al + Cu + Mg → High-Strength Alloy',
            ingredients: { Aluminum: 90, Copper: 4, Magnesium: 1, Manganese: 1 },
            field: 'aerospace',
            category: 'Aluminum Alloys',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '✈️',
            unlocksAt: 0,
            value: 150,
            description: 'High-strength aluminum alloy for aircraft structures.',
            laborMultiplier: 1.3,
            usedIn: ['aircraft_fuselage', 'wings', 'structural_parts']
        },
        {
            id: 'aluminum_6061',
            name: 'Aluminum 6061',
            formula: 'Al + Mg + Si → General Purpose Alloy',
            ingredients: { Aluminum: 95, Magnesium: 1, Silicon: 1, Copper: 0.5 },
            field: 'aerospace',
            category: 'Aluminum Alloys',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '🔧',
            unlocksAt: 50,
            value: 120,
            description: 'Versatile aluminum alloy for general aerospace use.',
            laborMultiplier: 1.2,
            usedIn: ['fittings', 'landing_gear_components', 'structural']
        },
        {
            id: 'aluminum_7075',
            name: 'Aluminum 7075',
            formula: 'Al + Zn + Mg + Cu → Ultra-High Strength',
            ingredients: { Aluminum: 85, Zinc: 6, Magnesium: 2, Copper: 2 },
            field: 'aerospace',
            category: 'Aluminum Alloys',
            tier: 1,
            skillGain: 7,
            target: 100,
            icon: '⚡',
            unlocksAt: 100,
            value: 200,
            description: 'Highest strength aluminum alloy for critical components.',
            laborMultiplier: 1.4,
            usedIn: ['wing_spars', 'bulkheads', 'high_stress_parts']
        }
    ],
    
    'Magnesium Alloys': [
        {
            id: 'magnesium_az31',
            name: 'Magnesium AZ31',
            formula: 'Mg + Al + Zn → Lightweight Alloy',
            ingredients: { Magnesium: 94, Aluminum: 3, Zinc: 1 },
            field: 'aerospace',
            category: 'Magnesium Alloys',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '✨',
            unlocksAt: 150,
            value: 180,
            description: 'Lightest structural alloy for weight-critical applications.',
            laborMultiplier: 1.3,
            usedIn: ['gearbox_housings', 'electronic_enclosures', 'interior']
        },
        {
            id: 'magnesium_zk60',
            name: 'Magnesium ZK60',
            formula: 'Mg + Zn + Zr → High-Strength Mg',
            ingredients: { Magnesium: 92, Zinc: 6, Zirconium: 1 },
            field: 'aerospace',
            category: 'Magnesium Alloys',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '⚡',
            unlocksAt: 200,
            value: 220,
            description: 'High-strength magnesium alloy for aerospace components.',
            laborMultiplier: 1.4,
            usedIn: ['helicopter_parts', 'missile_components', 'spacecraft']
        }
    ],
    
    'Beryllium Alloys': [
        {
            id: 'beryllium_aluminum',
            name: 'Beryllium-Aluminum Alloy',
            formula: 'Be + Al → Ultra-Stiff Light Alloy',
            ingredients: { Beryllium: 60, Aluminum: 40 },
            field: 'aerospace',
            category: 'Beryllium Alloys',
            tier: 1,
            skillGain: 8,
            target: 100,
            icon: '💎',
            unlocksAt: 300,
            value: 500,
            description: 'Extremely stiff and lightweight for precision structures.',
            laborMultiplier: 1.6,
            usedIn: ['satellite_structures', 'optical_benches', 'guidance_systems']
        }
    ],
    
    // ============================================================================
    // TIER 2: HIGH-TEMPERATURE ALLOYS (10 recipes)
    // ============================================================================
    
    'Titanium Alloys': [
        {
            id: 'ti64_aerospace',
            name: 'Ti-6Al-4V (Aerospace Grade)',
            formula: 'Ti + Al + V → Workhorse Titanium',
            ingredients: { Titanium: 85, Aluminum: 6, Vanadium: 4 },
            field: 'aerospace',
            category: 'Titanium Alloys',
            tier: 2,
            skillGain: 10,
            target: 200,
            icon: '🚀',
            unlocksAt: 500,
            value: 400,
            description: 'Most common titanium alloy for aerospace structures.',
            laborMultiplier: 1.8,
            usedIn: ['airframe', 'engine_parts', 'landing_gear']
        },
        {
            id: 'ti6242',
            name: 'Ti-6Al-2Sn-4Zr-2Mo',
            formula: 'Ti + Al + Sn + Zr + Mo → High-Temp Titanium',
            ingredients: { Titanium: 80, Aluminum: 6, Tin: 2, Zirconium: 4, Molybdenum: 2 },
            field: 'aerospace',
            category: 'Titanium Alloys',
            tier: 2,
            skillGain: 14,
            target: 200,
            icon: '🔥',
            unlocksAt: 700,
            value: 600,
            description: 'High-temperature titanium for jet engine components.',
            laborMultiplier: 2.0,
            usedIn: ['compressor_disks', 'blades', 'engine_casings']
        },
        {
            id: 'ti5553',
            name: 'Ti-5Al-5Mo-5V-3Cr',
            formula: 'Ti + Al + Mo + V + Cr → High-Strength',
            ingredients: { Titanium: 75, Aluminum: 5, Molybdenum: 5, Vanadium: 5, Chromium: 3 },
            field: 'aerospace',
            category: 'Titanium Alloys',
            tier: 2,
            skillGain: 16,
            target: 200,
            icon: '⚙️',
            unlocksAt: 800,
            value: 700,
            description: 'Ultra-high strength titanium for landing gear.',
            laborMultiplier: 2.2,
            usedIn: ['landing_gear', 'structural', 'high_stress']
        }
    ],
    
    'Nickel-Based': [
        {
            id: 'inconel_718_aero',
            name: 'Inconel 718',
            formula: 'Ni + Cr + Fe + Nb + Mo → Superalloy',
            ingredients: { Nickel: 50, Chromium: 20, Iron: 18, Niobium: 5, Molybdenum: 3 },
            field: 'aerospace',
            category: 'Nickel-Based',
            tier: 2,
            skillGain: 18,
            target: 200,
            icon: '🔥',
            unlocksAt: 1000,
            value: 800,
            description: 'High-strength superalloy for jet engines and rockets.',
            laborMultiplier: 2.5,
            usedIn: ['turbine_disks', 'rocket_engines', 'high_temp_fasteners']
        },
        {
            id: 'waspaloy_aero',
            name: 'Waspaloy',
            formula: 'Ni + Cr + Co + Mo + Ti + Al → Turbine Alloy',
            ingredients: { Nickel: 55, Chromium: 20, Cobalt: 15, Molybdenum: 4, Titanium: 3, Aluminum: 1 },
            field: 'aerospace',
            category: 'Nickel-Based',
            tier: 2,
            skillGain: 20,
            target: 200,
            icon: '⚡',
            unlocksAt: 1200,
            value: 1000,
            description: 'Nickel-based superalloy for turbine blades.',
            laborMultiplier: 2.8,
            usedIn: ['turbine_blades', 'engine_rings', 'casings']
        },
        {
            id: 'hastelloy_x',
            name: 'Hastelloy X',
            formula: 'Ni + Cr + Fe + Mo → Oxidation-Resistant',
            ingredients: { Nickel: 45, Chromium: 22, Iron: 18, Molybdenum: 9, Cobalt: 1 },
            field: 'aerospace',
            category: 'Nickel-Based',
            tier: 2,
            skillGain: 22,
            target: 200,
            icon: '🔥',
            unlocksAt: 1400,
            value: 900,
            description: 'Oxidation-resistant superalloy for combustion chambers.',
            laborMultiplier: 2.6,
            usedIn: ['combustion_liners', 'afterburners', 'ducts']
        }
    ],
    
    // ============================================================================
    // TIER 3: COMPOSITE MATERIALS (8 recipes)
    // ============================================================================
    
    'Carbon Fiber Composites': [
        {
            id: 'carbon_fiber_prepreg',
            name: 'Carbon Fiber Prepreg',
            formula: 'Carbon Fiber + Epoxy Resin → Pre-impregnated',
            ingredients: { CarbonFiber: 30, EpoxyResin: 15, Hardener: 2 },
            field: 'aerospace',
            category: 'Carbon Fiber Composites',
            tier: 3,
            skillGain: 20,
            target: 300,
            icon: '⚫',
            unlocksAt: 2000,
            value: 600,
            description: 'Pre-impregnated carbon fiber for composite layup.',
            laborMultiplier: 2.2,
            usedIn: ['autoclave_curing', 'structural_parts', 'skins']
        },
        {
            id: 'carbon_fiber_panel',
            name: 'Carbon Fiber Panel',
            formula: 'Prepreg + Autoclave → Cured Panel',
            ingredients: { CarbonFiberPrepreg: 20, Autoclave: 1 },
            field: 'aerospace',
            category: 'Carbon Fiber Composites',
            tier: 3,
            skillGain: 25,
            target: 300,
            icon: '⬛',
            unlocksAt: 2200,
            value: 1000,
            description: 'High-strength carbon fiber structural panel.',
            laborMultiplier: 2.5,
            usedIn: ['fuselage_panels', 'wing_skins', 'control_surfaces']
        },
        {
            id: 'carbon_fiber_honeycomb',
            name: 'Carbon Fiber Honeycomb',
            formula: 'Carbon Fiber + Hexagonal Core → Sandwich Structure',
            ingredients: { CarbonFiber: 25, HoneycombCore: 10, Adhesive: 3 },
            field: 'aerospace',
            category: 'Carbon Fiber Composites',
            tier: 3,
            skillGain: 28,
            target: 300,
            icon: '🐝',
            unlocksAt: 2500,
            value: 1500,
            description: 'Ultra-light, stiff sandwich panel for aerospace.',
            laborMultiplier: 2.8,
            usedIn: ['flooring', 'bulkheads', 'radomes']
        }
    ],
    
    'Glass Fiber Composites': [
        {
            id: 'fiberglass_prepreg',
            name: 'Fiberglass Prepreg',
            formula: 'Glass Fiber + Epoxy → Pre-impregnated',
            ingredients: { GlassFiber: 30, EpoxyResin: 12, Hardener: 2 },
            field: 'aerospace',
            category: 'Glass Fiber Composites',
            tier: 3,
            skillGain: 15,
            target: 300,
            icon: '⚪',
            unlocksAt: 1800,
            value: 300,
            description: 'Glass fiber prepreg for secondary structures.',
            laborMultiplier: 1.8,
            usedIn: ['radomes', 'fairings', 'interior_panels']
        },
        {
            id: 'fiberglass_honeycomb',
            name: 'Fiberglass Honeycomb',
            formula: 'Fiberglass + Honeycomb → Lightweight Panel',
            ingredients: { Fiberglass: 20, HoneycombCore: 15, Adhesive: 3 },
            field: 'aerospace',
            category: 'Glass Fiber Composites',
            tier: 3,
            skillGain: 18,
            target: 300,
            icon: '🏗️',
            unlocksAt: 2000,
            value: 400,
            description: 'Lightweight sandwich panel for interior applications.',
            laborMultiplier: 2.0,
            usedIn: ['overhead_bins', 'galleys', 'partitions']
        }
    ],
    
    // ============================================================================
    // TIER 4: CERAMIC COMPOSITES (8 recipes)
    // ============================================================================
    
    'Ceramic Matrix Composites': [
        {
            id: 'cmc_sic_sic',
            name: 'SiC/SiC Ceramic Composite',
            formula: 'Silicon Carbide Fibers + SiC Matrix → CMC',
            ingredients: { SiCFiber: 25, SiCPowder: 20, SinteringAdditives: 3 },
            field: 'aerospace',
            category: 'Ceramic Matrix Composites',
            tier: 4,
            skillGain: 35,
            target: 400,
            icon: '🔥',
            unlocksAt: 4000,
            value: 3000,
            description: 'Ceramic matrix composite for extreme temperatures.',
            laborMultiplier: 3.5,
            usedIn: ['turbine_shrouds', 'combustion_liners', 'exhaust_nozzles']
        },
        {
            id: 'c_c_composite',
            name: 'Carbon-Carbon Composite',
            formula: 'Carbon Fiber + Carbon Matrix → Re-entry Material',
            ingredients: { CarbonFiber: 30, CarbonMatrix: 25, Densification: 5 },
            field: 'aerospace',
            category: 'Ceramic Matrix Composites',
            tier: 4,
            skillGain: 40,
            target: 400,
            icon: '🛡️',
            unlocksAt: 5000,
            value: 5000,
            description: 'Carbon-carbon composite for thermal protection.',
            laborMultiplier: 4.0,
            usedIn: ['nose_cones', 'leading_edges', 'rocket_nozzles']
        },
        {
            id: 'oxide_cmc',
            name: 'Oxide-Oxide CMC',
            formula: 'Alumina Fibers + Alumina Matrix → Oxidation Resistant',
            ingredients: { AluminaFiber: 25, AluminaPowder: 20, SinteringAids: 3 },
            field: 'aerospace',
            category: 'Ceramic Matrix Composites',
            tier: 4,
            skillGain: 32,
            target: 400,
            icon: '⚪',
            unlocksAt: 4500,
            value: 2500,
            description: 'Oxidation-resistant ceramic composite for long-term use.',
            laborMultiplier: 3.2,
            usedIn: ['exhaust_components', 'heat_shields', 'engine_parts']
        }
    ],
    
    'Thermal Barrier Coatings': [
        {
            id: 'ysz_coating',
            name: 'YSZ Thermal Barrier Coating',
            formula: 'Yttria-Stabilized Zirconia + Bond Coat → TBC',
            ingredients: { YSZ: 20, MCrAlY: 10, PlasmaSpray: 1 },
            field: 'aerospace',
            category: 'Thermal Barrier Coatings',
            tier: 4,
            skillGain: 28,
            target: 400,
            icon: '🔥',
            unlocksAt: 4800,
            value: 2000,
            description: 'Ceramic coating for turbine blade thermal protection.',
            laborMultiplier: 3.0,
            usedIn: ['turbine_blades', 'combustion_chambers', 'afterburners']
        },
        {
            id: 'eb_pvd_tbc',
            name: 'EB-PVD Thermal Barrier Coating',
            formula: 'Electron Beam Physical Vapor Deposition → Columnar TBC',
            ingredients: { YSZ: 25, EBPVDProcess: 1, Substrate: 10 },
            field: 'aerospace',
            category: 'Thermal Barrier Coatings',
            tier: 4,
            skillGain: 38,
            target: 400,
            icon: '⚡',
            unlocksAt: 5500,
            value: 4000,
            description: 'Advanced columnar thermal barrier coating for turbines.',
            laborMultiplier: 3.8,
            usedIn: ['high_pressure_turbine', 'blades', 'vanes']
        }
    ],
    
    // ============================================================================
    // TIER 5: THERMAL PROTECTION SYSTEMS (8 recipes)
    // ============================================================================
    
    'Ablative Materials': [
        {
            id: 'avcoat',
            name: 'Avcoat Ablative Material',
            formula: 'Epoxy-Novolac + Silica Fibers + Hollow Spheres → Ablator',
            ingredients: { EpoxyResin: 20, SilicaFiber: 15, HollowGlassSpheres: 10, PhenolicResin: 10 },
            field: 'aerospace',
            category: 'Ablative Materials',
            tier: 5,
            skillGain: 45,
            target: 500,
            icon: '☄️',
            unlocksAt: 8000,
            value: 4000,
            description: 'Ablative heat shield material for re-entry vehicles.',
            laborMultiplier: 4.0,
            usedIn: ['heat_shields', 'reentry_capsules', 'rocket_nozzles']
        },
        {
            id: 'pica',
            name: 'PICA (Phenolic Impregnated Carbon Ablator)',
            formula: 'Carbon Fiber + Phenolic Resin → Lightweight Ablator',
            ingredients: { CarbonFelt: 20, PhenolicResin: 25, Pyrolysis: 2 },
            field: 'aerospace',
            category: 'Ablative Materials',
            tier: 5,
            skillGain: 50,
            target: 500,
            icon: '🛸',
            unlocksAt: 9000,
            value: 6000,
            description: 'Lightweight ablative material for Mars entry vehicles.',
            laborMultiplier: 4.5,
            usedIn: ['mars_landers', 'sample_return', 'high_heat_flux']
        },
        {
            id: 'carbon_phenolic',
            name: 'Carbon-Phenolic Ablator',
            formula: 'Carbon Cloth + Phenolic Resin → High-Density Ablator',
            ingredients: { CarbonCloth: 25, PhenolicResin: 30, CompressionMolding: 2 },
            field: 'aerospace',
            category: 'Ablative Materials',
            tier: 5,
            skillGain: 48,
            target: 500,
            icon: '🔥',
            unlocksAt: 8500,
            value: 5000,
            description: 'High-density ablative for rocket nozzles and re-entry.',
            laborMultiplier: 4.3,
            usedIn: ['rocket_nozzles', 'reentry', 'ballistic_missiles']
        }
    ],
    
    'Insulation Tiles': [
        {
            id: 'li_900',
            name: 'LI-900 Silica Tile',
            formula: 'Silica Fibers + Sintering → Reusable Surface Insulation',
            ingredients: { SilicaFiber: 30, HighPuritySilica: 20, Sintering: 2 },
            field: 'aerospace',
            category: 'Insulation Tiles',
            tier: 5,
            skillGain: 42,
            target: 500,
            icon: '⬜',
            unlocksAt: 10000,
            value: 3000,
            description: 'Space Shuttle-type reusable silica insulation tile.',
            laborMultiplier: 3.8,
            usedIn: ['orbiter_thermal_protection', 'reusable_vehicles']
        },
        {
            id: 'frci',
            name: 'FRCI (Fibrous Refractory Composite Insulation)',
            formula: 'Silica + Alumina Fibers → Improved Tile',
            ingredients: { SilicaFiber: 20, AluminaFiber: 10, Borosilicate: 5 },
            field: 'aerospace',
            category: 'Insulation Tiles',
            tier: 5,
            skillGain: 45,
            target: 500,
            icon: '⚪',
            unlocksAt: 11000,
            value: 4000,
            description: 'Advanced fibrous insulation with higher strength.',
            laborMultiplier: 4.0,
            usedIn: ['high_temperature_areas', 'nose_cap', 'wing_leading_edges']
        },
        {
            id: 'tufroc',
            name: 'TUFROC (Toughened Uni-piece Fibrous Reinforced Oxidation-resistant Composite)',
            formula: 'Carbon Core + Ceramic Coating → Ultra-High Temp',
            ingredients: { CarbonFoam: 20, CeramicCoating: 15, OxidationInhibitor: 3 },
            field: 'aerospace',
            category: 'Insulation Tiles',
            tier: 5,
            skillGain: 55,
            target: 500,
            icon: '🛡️',
            unlocksAt: 13000,
            value: 8000,
            description: 'Advanced thermal protection for hypersonic vehicles.',
            laborMultiplier: 5.0,
            usedIn: ['hypersonic_vehicles', 'x37b', 'experimental']
        }
    ],
    
    // ============================================================================
    // TIER 6: AEROSPACE STRUCTURES (8 recipes)
    // ============================================================================
    
    'Structural Components': [
        {
            id: 'wing_spar',
            name: 'Wing Spar',
            formula: 'Carbon Fiber + Titanium Fittings → Main Spar',
            ingredients: { CarbonFiberPanel: 30, TitaniumFittings: 10, AerospaceAdhesive: 3 },
            field: 'aerospace',
            category: 'Structural Components',
            tier: 6,
            skillGain: 50,
            target: 600,
            icon: '🪽',
            unlocksAt: 15000,
            value: 10000,
            description: 'Primary wing structural member.',
            laborMultiplier: 4.5,
            usedIn: ['aircraft_wings', 'control_surfaces', 'load_bearing']
        },
        {
            id: 'fuselage_frame',
            name: 'Fuselage Frame',
            formula: 'Aluminum-Lithium + Machining → Circular Frame',
            ingredients: { AluminumLithium: 40, Machining: 2, Fasteners: 5 },
            field: 'aerospace',
            category: 'Structural Components',
            tier: 6,
            skillGain: 45,
            target: 600,
            icon: '🔄',
            unlocksAt: 14000,
            value: 8000,
            description: 'Circular frame for aircraft fuselage.',
            laborMultiplier: 4.2,
            usedIn: ['fuselage', 'pressure_bulkheads', 'structural_rings']
        },
        {
            id: 'landing_gear_strut',
            name: 'Landing Gear Strut',
            formula: 'Titanium Alloy + Heat Treatment → High-Strength',
            ingredients: { Ti64: 50, HeatTreatment: 2, PrecisionMachining: 3 },
            field: 'aerospace',
            category: 'Structural Components',
            tier: 6,
            skillGain: 52,
            target: 600,
            icon: '⚙️',
            unlocksAt: 16000,
            value: 12000,
            description: 'High-strength landing gear component.',
            laborMultiplier: 4.8,
            usedIn: ['landing_gear', 'high_load', 'impact_absorption']
        }
    ],
    
    'Control Surfaces': [
        {
            id: 'aileron',
            name: 'Aileron',
            formula: 'Honeycomb + Carbon Skin → Control Surface',
            ingredients: { CarbonFiberPanel: 25, Honeycomb: 15, Hinges: 3 },
            field: 'aerospace',
            category: 'Control Surfaces',
            tier: 6,
            skillGain: 48,
            target: 600,
            icon: '⬆️',
            unlocksAt: 17000,
            value: 9000,
            description: 'Roll control surface for aircraft.',
            laborMultiplier: 4.3,
            usedIn: ['wing_controls', 'roll_control', 'aerodynamics']
        },
        {
            id: 'elevator',
            name: 'Elevator',
            formula: 'Composite + Actuator Mounts → Pitch Control',
            ingredients: { CarbonFiberPanel: 25, Honeycomb: 15, ActuatorMounts: 3 },
            field: 'aerospace',
            category: 'Control Surfaces',
            tier: 6,
            skillGain: 48,
            target: 600,
            icon: '⬇️',
            unlocksAt: 17500,
            value: 9000,
            description: 'Pitch control surface for aircraft.',
            laborMultiplier: 4.3,
            usedIn: ['tail_controls', 'pitch_control', 'stability']
        },
        {
            id: 'rudder',
            name: 'Rudder',
            formula: 'Composite + Hinges → Yaw Control',
            ingredients: { CarbonFiberPanel: 25, Honeycomb: 15, Hinges: 3 },
            field: 'aerospace',
            category: 'Control Surfaces',
            tier: 6,
            skillGain: 48,
            target: 600,
            icon: '↔️',
            unlocksAt: 18000,
            value: 9000,
            description: 'Yaw control surface for aircraft.',
            laborMultiplier: 4.3,
            usedIn: ['vertical_stabilizer', 'yaw_control', 'directional']
        }
    ],
    
    // ============================================================================
    // TIER 7: SPACECRAFT SYSTEMS (8 recipes)
    // ============================================================================
    
    'Propulsion Components': [
        {
            id: 'rocket_nozzle',
            name: 'Rocket Nozzle',
            formula: 'C-C Composite + Coating → Expansion Nozzle',
            ingredients: { CarbonCarbonComposite: 30, AblativeCoating: 5, PrecisionMachining: 3 },
            field: 'aerospace',
            category: 'Propulsion Components',
            tier: 7,
            skillGain: 70,
            target: 800,
            icon: '🚀',
            unlocksAt: 25000,
            value: 50000,
            description: 'High-temperature rocket nozzle for space propulsion.',
            laborMultiplier: 6.0,
            usedIn: ['rocket_engines', 'thrust_chambers', 'expansion_nozzles']
        },
        {
            id: 'combustion_chamber',
            name: 'Combustion Chamber',
            formula: 'Inconel + TBC + Cooling Channels → Thrust Chamber',
            ingredients: { Inconel718: 40, YSZCoating: 5, CoolingChannelMachining: 3 },
            field: 'aerospace',
            category: 'Propulsion Components',
            tier: 7,
            skillGain: 75,
            target: 800,
            icon: '🔥',
            unlocksAt: 28000,
            value: 60000,
            description: 'Rocket combustion chamber with regenerative cooling.',
            laborMultiplier: 6.5,
            usedIn: ['liquid_rocket_engines', 'thrust_chambers']
        },
        {
            id: 'turbine_blade',
            name: 'Turbine Blade',
            formula: 'Single Crystal Superalloy + TBC → Jet Engine Blade',
            ingredients: { SingleCrystalSuperalloy: 30, YSZCoating: 3, CoolingHoles: 2 },
            field: 'aerospace',
            category: 'Propulsion Components',
            tier: 7,
            skillGain: 80,
            target: 800,
            icon: '🌀',
            unlocksAt: 30000,
            value: 40000,
            description: 'Single crystal turbine blade for jet engines.',
            laborMultiplier: 7.0,
            usedIn: ['jet_engines', 'turbines', 'high_temp']
        }
    ],
    
    'Spacecraft Structures': [
        {
            id: 'satellite_bus',
            name: 'Satellite Bus',
            formula: 'Aluminum Honeycomb + MLI + Inserts → Satellite Structure',
            ingredients: { AluminumHoneycomb: 30, MLI: 10, TitaniumInserts: 5, SolarPanels: 4 },
            field: 'aerospace',
            category: 'Spacecraft Structures',
            tier: 7,
            skillGain: 65,
            target: 800,
            icon: '🛰️',
            unlocksAt: 32000,
            value: 80000,
            description: 'Primary structure for satellites.',
            laborMultiplier: 5.5,
            usedIn: ['satellites', 'spacecraft', 'orbital_platforms']
        },
        {
            id: 'fuel_tank',
            name: 'Cryogenic Fuel Tank',
            formula: 'Al-Li Alloy + Insulation + MLI → Cryo Tank',
            ingredients: { AluminumLithium: 50, CryogenicInsulation: 20, MLI: 10, Bulkheads: 5 },
            field: 'aerospace',
            category: 'Spacecraft Structures',
            tier: 7,
            skillGain: 68,
            target: 800,
            icon: '⛽',
            unlocksAt: 34000,
            value: 70000,
            description: 'Cryogenic fuel tank for rockets.',
            laborMultiplier: 6.0,
            usedIn: ['rocket_stages', 'fuel_storage', 'cryogenic']
        }
    ],
    
    'Re-entry Systems': [
        {
            id: 'heat_shield',
            name: 'Re-entry Heat Shield',
            formula: 'PICA + Carrier Structure + Backshell → Thermal Protection',
            ingredients: { PICA: 40, CarbonFiberStructure: 20, Adhesive: 5, TPS: 3 },
            field: 'aerospace',
            category: 'Re-entry Systems',
            tier: 7,
            skillGain: 85,
            target: 800,
            icon: '☄️',
            unlocksAt: 40000,
            value: 100000,
            description: 'Complete heat shield for atmospheric re-entry.',
            laborMultiplier: 8.0,
            usedIn: ['spacecraft', 'reentry_capsules', 'mars_landers']
        },
        {
            id: 'nose_cone',
            name: 'Hypersonic Nose Cone',
            formula: 'C-C Composite + TUFROC Coating → Leading Edge',
            ingredients: { CarbonCarbonComposite: 35, TUFROC: 15, OxidationProtection: 3 },
            field: 'aerospace',
            category: 'Re-entry Systems',
            tier: 7,
            skillGain: 82,
            target: 800,
            icon: '🔺',
            unlocksAt: 38000,
            value: 90000,
            description: 'Hypersonic vehicle nose cone for extreme temperatures.',
            laborMultiplier: 7.5,
            usedIn: ['hypersonic', 'reentry', 'missiles']
        }
    ],
    
    // ============================================================================
    // ADDITIONAL: AEROSPACE COMPONENTS (Helper recipes)
    // ============================================================================
    
    'Fasteners & Hardware': [
        {
            id: 'hi_loc_pin',
            name: 'Hi-Loc Pin',
            formula: 'Titanium + Threading → Aerospace Fastener',
            ingredients: { Titanium: 5, PrecisionMachining: 1 },
            field: 'aerospace',
            category: 'Fasteners & Hardware',
            tier: 2,
            skillGain: 5,
            target: 200,
            icon: '📌',
            unlocksAt: 600,
            value: 50,
            description: 'High-strength aerospace fastener.',
            laborMultiplier: 1.5,
            usedIn: ['structural_assembly', 'aircraft', 'spacecraft']
        },
        {
            id: 'cherry_lockbolt',
            name: 'Cherry Lockbolt',
            formula: 'Steel + Swage Collar → Permanent Fastener',
            ingredients: { Steel: 5, SwageCollar: 1 },
            field: 'aerospace',
            category: 'Fasteners & Hardware',
            tier: 2,
            skillGain: 5,
            target: 200,
            icon: '🔩',
            unlocksAt: 650,
            value: 40,
            description: 'Permanent aerospace lockbolt.',
            laborMultiplier: 1.5,
            usedIn: ['aircraft_assembly', 'permanent_joints']
        }
    ],
    
    'Avionics Enclosures': [
        {
            id: 'avionics_box',
            name: 'Avionics Enclosure',
            formula: 'Aluminum + EMI Shielding + Connectors → Electronics Housing',
            ingredients: { Aluminum: 20, CopperMesh: 3, Connectors: 5, HeatSink: 2 },
            field: 'aerospace',
            category: 'Avionics Enclosures',
            tier: 3,
            skillGain: 20,
            target: 300,
            icon: '💻',
            unlocksAt: 3000,
            value: 1500,
            description: 'EMI-shielded enclosure for avionics.',
            laborMultiplier: 2.0,
            usedIn: ['flight_computers', 'navigation_systems', 'communication']
        },
        {
            id: 'black_box',
            name: 'Flight Data Recorder (Black Box)',
            formula: 'Stainless Steel + Insulation + Memory → Crash-Survivable',
            ingredients: { StainlessSteel: 30, CeramicInsulation: 15, MemoryChip: 5, Titanium: 10 },
            field: 'aerospace',
            category: 'Avionics Enclosures',
            tier: 4,
            skillGain: 35,
            target: 400,
            icon: '⬛',
            unlocksAt: 6000,
            value: 20000,
            description: 'Crash-survivable flight data recorder.',
            laborMultiplier: 3.5,
            usedIn: ['aviation_safety', 'investigation', 'data_storage']
        }
    ]
};

// ============================================================================
// EXPORT ALL AEROSPACE RECIPES
// ============================================================================

export default AEROSPACE_RECIPES;

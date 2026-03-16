// js/crafting/fields/nuclear.js
// Nuclear Materials Recipes - 40+ recipes for radiation shielding, fuel, and containment
// Tier 1-7: From Basic Shielding to Advanced Nuclear Fuel

export const NUCLEAR_RECIPES = {
    
    // ============================================================================
    // TIER 1: BASIC SHIELDING MATERIALS (8 recipes)
    // ============================================================================
    
    'Radiation Shielding': [
        {
            id: 'lead_shielding',
            name: 'Lead Shielding',
            formula: 'Pb → Cast Lead Blocks',
            ingredients: { Lead: 50 },
            field: 'nuclear',
            category: 'Radiation Shielding',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '🛡️',
            unlocksAt: 0,
            value: 100,
            description: 'Basic lead shielding for gamma radiation protection.',
            laborMultiplier: 1.2,
            usedIn: ['storage_casks', 'hot_cells', 'medical_shielding']
        },
        {
            id: 'lead_glass',
            name: 'Lead Glass',
            formula: 'SiO₂ + PbO → Transparent Shielding',
            ingredients: { SiliconDioxide: 30, Lead: 25, Oxygen: 10 },
            field: 'nuclear',
            category: 'Radiation Shielding',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '🪟',
            unlocksAt: 100,
            value: 200,
            description: 'Transparent shielding for viewing windows in hot cells.',
            laborMultiplier: 1.4,
            usedIn: ['hot_cell_windows', 'gloveboxes', 'viewing_ports']
        },
        {
            id: 'concrete_shielding',
            name: 'Barytes Concrete',
            formula: 'Concrete + Barium Sulfate → Heavy Concrete',
            ingredients: { ConcreteMix: 40, Barium: 15, Sulfur: 5 },
            field: 'nuclear',
            category: 'Radiation Shielding',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '🏗️',
            unlocksAt: 150,
            value: 80,
            description: 'Heavy concrete for reactor biological shielding.',
            laborMultiplier: 1.3,
            usedIn: ['reactor_shielding', 'walls', 'containment']
        },
        {
            id: 'polyethylene_shielding',
            name: 'Polyethylene Shielding',
            formula: '(C₂H₄)n → Neutron Moderation',
            ingredients: { Polyethylene: 40 },
            field: 'nuclear',
            category: 'Radiation Shielding',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '🧪',
            unlocksAt: 80,
            value: 60,
            description: 'Hydrogen-rich material for neutron shielding.',
            laborMultiplier: 1.2,
            usedIn: ['neutron_shielding', 'transport_casks', 'medical_facilities']
        }
    ],
    
    'Borate Materials': [
        {
            id: 'boron_carbide',
            name: 'Boron Carbide',
            formula: 'B₄C → Neutron Absorber',
            ingredients: { Boron: 40, Carbon: 10 },
            field: 'nuclear',
            category: 'Borate Materials',
            tier: 1,
            skillGain: 6,
            target: 100,
            icon: '⚫',
            unlocksAt: 200,
            value: 300,
            description: 'Excellent neutron absorber for control rods.',
            laborMultiplier: 1.5,
            usedIn: ['control_rods', 'shielding', 'neutron_absorption']
        },
        {
            id: 'borated_polyethylene',
            name: 'Borated Polyethylene',
            formula: 'Polyethylene + Boron → Combined Shielding',
            ingredients: { Polyethylene: 35, Boron: 15 },
            field: 'nuclear',
            category: 'Borate Materials',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '🛡️',
            unlocksAt: 180,
            value: 150,
            description: 'Neutron shielding with built-in absorber.',
            laborMultiplier: 1.4,
            usedIn: ['transport_casks', 'storage_racks', 'shielding']
        },
        {
            id: 'borosilicate_glass',
            name: 'Borosilicate Glass',
            formula: 'SiO₂ + B₂O₃ + Na₂O → Neutron-Absorbing Glass',
            ingredients: { SiliconDioxide: 30, Boron: 15, SodiumOxide: 5 },
            field: 'nuclear',
            category: 'Borate Materials',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '🧪',
            unlocksAt: 220,
            value: 180,
            description: 'Transparent neutron-absorbing glass.',
            laborMultiplier: 1.4,
            usedIn: ['viewing_windows', 'gloveboxes', 'laboratory']
        }
    ],
    
    // ============================================================================
    // TIER 2: CONTAINMENT MATERIALS (8 recipes)
    // ============================================================================
    
    'Containment Vessels': [
        {
            id: 'steel_cask',
            name: 'Steel Transport Cask',
            formula: 'Steel + Lead Lining → Shipping Container',
            ingredients: { Steel: 60, LeadShielding: 20, PolyethyleneShielding: 10 },
            field: 'nuclear',
            category: 'Containment Vessels',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '📦',
            unlocksAt: 400,
            value: 500,
            description: 'Type B transport cask for radioactive materials.',
            laborMultiplier: 1.6,
            usedIn: ['transport', 'storage', 'shipping']
        },
        {
            id: 'hot_cell',
            name: 'Hot Cell',
            formula: 'Steel + Lead + Lead Glass → Remote Handling Cell',
            ingredients: { Steel: 100, LeadShielding: 50, LeadGlass: 20, Manipulators: 10 },
            field: 'nuclear',
            category: 'Containment Vessels',
            tier: 2,
            skillGain: 15,
            target: 200,
            icon: '🔬',
            unlocksAt: 600,
            value: 2000,
            description: 'Shielded cell for remote handling of radioactive materials.',
            laborMultiplier: 2.0,
            usedIn: ['fuel_handling', 'waste_processing', 'research']
        },
        {
            id: 'glovebox',
            name: 'Glovebox',
            formula: 'Stainless Steel + Lead Glass + Gloves → Containment',
            ingredients: { StainlessSteel: 40, LeadGlass: 10, NeopreneGloves: 4, HEPAFilter: 2 },
            field: 'nuclear',
            category: 'Containment Vessels',
            tier: 2,
            skillGain: 10,
            target: 200,
            icon: '🧤',
            unlocksAt: 500,
            value: 800,
            description: 'Sealed container with gloves for material handling.',
            laborMultiplier: 1.8,
            usedIn: ['fuel_processing', 'sample_handling', 'research']
        }
    ],
    
    'Seals & Gaskets': [
        {
            id: 'viton_seal',
            name: 'Viton Seal',
            formula: 'Fluoroelastomer + Molding → Radiation-Resistant Seal',
            ingredients: { Fluoroelastomer: 20, CarbonBlack: 2, VulcanizingAgent: 1 },
            field: 'nuclear',
            category: 'Seals & Gaskets',
            tier: 2,
            skillGain: 6,
            target: 200,
            icon: '🔘',
            unlocksAt: 450,
            value: 50,
            description: 'Radiation-resistant O-rings and seals.',
            laborMultiplier: 1.5,
            usedIn: ['containment_vessels', 'gloveboxes', 'valves']
        },
        {
            id: 'hepa_filter',
            name: 'HEPA Filter',
            formula: 'Fiberglass + Aluminum Frame + Sealant → High-Efficiency Filter',
            ingredients: { Fiberglass: 20, Aluminum: 10, Sealant: 2, PleatedPaper: 5 },
            field: 'nuclear',
            category: 'Seals & Gaskets',
            tier: 2,
            skillGain: 7,
            target: 200,
            icon: '💨',
            unlocksAt: 550,
            value: 150,
            description: 'High-efficiency particulate air filter for containment.',
            laborMultiplier: 1.6,
            usedIn: ['ventilation', 'containment', 'cleanrooms']
        }
    ],
    
    // ============================================================================
    // TIER 3: FUEL MATERIALS (8 recipes)
    // ============================================================================
    
    'Uranium Processing': [
        {
            id: 'yellowcake',
            name: 'Yellowcake (U₃O₈)',
            formula: 'Uranium Ore + Milling + Precipitation → U₃O₈',
            ingredients: { UraniumOre: 100, SulfuricAcid: 20, Ammonia: 10 },
            field: 'nuclear',
            category: 'Uranium Processing',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '🟨',
            unlocksAt: 1000,
            value: 500,
            description: 'Concentrated uranium oxide from ore processing.',
            laborMultiplier: 1.8,
            usedIn: ['uranium_hexafluoride', 'fuel_fabrication']
        },
        {
            id: 'uranium_hexafluoride',
            name: 'Uranium Hexafluoride (UF₆)',
            formula: 'U₃O₈ + HF + F₂ → UF₆',
            ingredients: { Yellowcake: 30, HydrofluoricAcid: 20, Fluorine: 15 },
            field: 'nuclear',
            category: 'Uranium Processing',
            tier: 3,
            skillGain: 15,
            target: 300,
            icon: '🧪',
            unlocksAt: 1200,
            value: 800,
            description: 'Gas for uranium enrichment process.',
            laborMultiplier: 2.0,
            usedIn: ['enrichment', 'centrifuges']
        },
        {
            id: 'enriched_uranium',
            name: 'Enriched Uranium',
            formula: 'UF₆ + Centrifuges → 3-5% U-235',
            ingredients: { UraniumHexafluoride: 50, CentrifugeTime: 10 },
            field: 'nuclear',
            category: 'Uranium Processing',
            tier: 3,
            skillGain: 20,
            target: 300,
            icon: '⚡',
            unlocksAt: 1500,
            value: 2000,
            description: 'Uranium enriched to reactor-grade levels.',
            laborMultiplier: 2.5,
            usedIn: ['fuel_pellets', 'reactor_fuel']
        }
    ],
    
    'Fuel Fabrication': [
        {
            id: 'uo2_powder',
            name: 'UO₂ Powder',
            formula: 'UF₆ + Steam + Hydrogen → UO₂',
            ingredients: { EnrichedUranium: 30, Steam: 10, Hydrogen: 5 },
            field: 'nuclear',
            category: 'Fuel Fabrication',
            tier: 3,
            skillGain: 18,
            target: 300,
            icon: '⚫',
            unlocksAt: 1800,
            value: 1500,
            description: 'Uranium dioxide powder for fuel pellets.',
            laborMultiplier: 2.2,
            usedIn: ['fuel_pellets', 'ceramic_fuel']
        },
        {
            id: 'fuel_pellet',
            name: 'UO₂ Fuel Pellet',
            formula: 'UO₂ Powder + Pressing + Sintering → Ceramic Pellet',
            ingredients: { UO2Powder: 20, Pressing: 1, Sintering: 1 },
            field: 'nuclear',
            category: 'Fuel Fabrication',
            tier: 3,
            skillGain: 22,
            target: 300,
            icon: '⚪',
            unlocksAt: 2000,
            value: 500,
            description: 'Sintered uranium dioxide fuel pellet.',
            laborMultiplier: 2.4,
            usedIn: ['fuel_rods', 'reactor_core']
        },
        {
            id: 'fuel_rod',
            name: 'Fuel Rod',
            formula: 'Zircaloy Tube + UO₂ Pellets + Helium → Fuel Rod',
            ingredients: { Zircaloy: 15, FuelPellet: 50, Helium: 2, EndCaps: 2 },
            field: 'nuclear',
            category: 'Fuel Fabrication',
            tier: 3,
            skillGain: 25,
            target: 300,
            icon: '📏',
            unlocksAt: 2200,
            value: 2000,
            description: 'Complete fuel rod for reactor assembly.',
            laborMultiplier: 2.8,
            usedIn: ['fuel_assemblies', 'reactor_core']
        }
    ],
    
    // ============================================================================
    // TIER 4: CONTROL MATERIALS (8 recipes)
    // ============================================================================
    
    'Control Rods': [
        {
            id: 'boron_carbide_rod',
            name: 'Boron Carbide Control Rod',
            formula: 'B₄C + Stainless Steel Cladding → Absorber Rod',
            ingredients: { BoronCarbide: 25, StainlessSteel: 20, EndFittings: 3 },
            field: 'nuclear',
            category: 'Control Rods',
            tier: 4,
            skillGain: 25,
            target: 400,
            icon: '⚙️',
            unlocksAt: 3000,
            value: 3000,
            description: 'Neutron-absorbing control rod for reactors.',
            laborMultiplier: 2.5,
            usedIn: ['reactor_control', 'shutdown_systems']
        },
        {
            id: 'silver_indium_cadmium',
            name: 'Ag-In-Cd Control Rod',
            formula: 'Ag + In + Cd → Alloy Absorber',
            ingredients: { Silver: 60, Indium: 15, Cadmium: 5 },
            field: 'nuclear',
            category: 'Control Rods',
            tier: 4,
            skillGain: 28,
            target: 400,
            icon: '🥈',
            unlocksAt: 3200,
            value: 4000,
            description: 'Silver-indium-cadmium alloy for PWR control rods.',
            laborMultiplier: 2.8,
            usedIn: ['pwr_control_rods', 'fine_control']
        },
        {
            id: 'hafnium_rod',
            name: 'Hafnium Control Rod',
            formula: 'Hf → Naval Reactor Control',
            ingredients: { Hafnium: 40 },
            field: 'nuclear',
            category: 'Control Rods',
            tier: 4,
            skillGain: 30,
            target: 400,
            icon: '⚓',
            unlocksAt: 3500,
            value: 5000,
            description: 'Hafnium control rod for naval reactors.',
            laborMultiplier: 3.0,
            usedIn: ['naval_reactors', 'submarines', 'aircraft_carriers']
        }
    ],
    
    'Burnable Poisons': [
        {
            id: 'gadolinia_rod',
            name: 'Gadolinia Burnable Poison',
            formula: 'Gd₂O₃ + UO₂ → Integral Fuel Burnable Absorber',
            ingredients: { UO2Powder: 40, Gadolinium: 10, Oxygen: 5 },
            field: 'nuclear',
            category: 'Burnable Poisons',
            tier: 4,
            skillGain: 24,
            target: 400,
            icon: '🧪',
            unlocksAt: 3800,
            value: 2500,
            description: 'Gadolinium oxide mixed with fuel for reactivity control.',
            laborMultiplier: 2.4,
            usedIn: ['fuel_assemblies', 'reactivity_control']
        },
        {
            id: 'erbia_rod',
            name: 'Erbia Burnable Poison',
            formula: 'Er₂O₃ + UO₂ → IFBA Alternative',
            ingredients: { UO2Powder: 40, Erbium: 8, Oxygen: 4 },
            field: 'nuclear',
            category: 'Burnable Poisons',
            tier: 4,
            skillGain: 22,
            target: 400,
            icon: '🔮',
            unlocksAt: 3600,
            value: 2200,
            description: 'Erbium oxide burnable poison for reactivity control.',
            laborMultiplier: 2.3,
            usedIn: ['fuel_assemblies', 'bwr_fuel']
        }
    ],
    
    // ============================================================================
    // TIER 5: REACTOR COMPONENTS (8 recipes)
    // ============================================================================
    
    'Core Components': [
        {
            id: 'fuel_assembly',
            name: 'Fuel Assembly',
            formula: 'Fuel Rods + Spacers + Nozzles → Assembly',
            ingredients: { FuelRod: 100, SpacerGrids: 10, Nozzles: 4, GuideTubes: 8 },
            field: 'nuclear',
            category: 'Core Components',
            tier: 5,
            skillGain: 40,
            target: 500,
            icon: '🎯',
            unlocksAt: 5000,
            value: 50000,
            description: 'Complete fuel assembly for reactor core.',
            laborMultiplier: 4.0,
            usedIn: ['reactor_core', 'power_generation']
        },
        {
            id: 'control_rod_drive',
            name: 'Control Rod Drive Mechanism',
            formula: 'Electric Motor + Gearbox + Position Sensors → CRDM',
            ingredients: { ElectricMotor: 5, Gearbox: 3, PositionSensors: 2, StainlessSteel: 20 },
            field: 'nuclear',
            category: 'Core Components',
            tier: 5,
            skillGain: 35,
            target: 500,
            icon: '⚙️',
            unlocksAt: 5500,
            value: 20000,
            description: 'Mechanism for inserting and withdrawing control rods.',
            laborMultiplier: 3.5,
            usedIn: ['reactor_control', 'safety_systems']
        },
        {
            id: 'reactor_pressure_vessel',
            name: 'Reactor Pressure Vessel',
            formula: 'Forged Steel + Cladding + Nozzles → RPV',
            ingredients: { ForgedSteel: 500, StainlessSteelCladding: 50, Nozzles: 20, Flange: 10 },
            field: 'nuclear',
            category: 'Core Components',
            tier: 5,
            skillGain: 60,
            target: 500,
            icon: '🏭',
            unlocksAt: 8000,
            value: 500000,
            description: 'Massive pressure vessel containing reactor core.',
            laborMultiplier: 6.0,
            usedIn: ['reactor', 'containment', 'pressure_boundary']
        }
    ],
    
    'Coolant Systems': [
        {
            id: 'primary_coolant_pump',
            name: 'Primary Coolant Pump',
            formula: 'Stainless Steel + Impeller + Motor → Circulation',
            ingredients: { StainlessSteel: 100, Impeller: 10, ElectricMotor: 20, Seals: 5 },
            field: 'nuclear',
            category: 'Coolant Systems',
            tier: 5,
            skillGain: 38,
            target: 500,
            icon: '💧',
            unlocksAt: 6000,
            value: 80000,
            description: 'Main coolant pump for reactor primary loop.',
            laborMultiplier: 4.2,
            usedIn: ['pwr', 'circulation', 'heat_transfer']
        },
        {
            id: 'steam_generator',
            name: 'Steam Generator',
            formula: 'Inconel Tubes + Shell + Feedwater Nozzles → Steam',
            ingredients: { Inconel: 200, Steel: 300, FeedwaterNozzles: 10, SteamNozzles: 10 },
            field: 'nuclear',
            category: 'Coolant Systems',
            tier: 5,
            skillGain: 50,
            target: 500,
            icon: '💨',
            unlocksAt: 7000,
            value: 200000,
            description: 'Heat exchanger producing steam from reactor heat.',
            laborMultiplier: 5.0,
            usedIn: ['pwr', 'turbine_drive', 'power_conversion']
        }
    ],
    
    // ============================================================================
    // TIER 6: WASTE MANAGEMENT (6 recipes)
    // ============================================================================
    
    'Waste Forms': [
        {
            id: 'vitrified_waste',
            name: 'Vitrified High-Level Waste',
            formula: 'Waste + Borosilicate Glass → Immobilized Waste',
            ingredients: { HighLevelWaste: 30, BorosilicateGlass: 50, Melting: 2 },
            field: 'nuclear',
            category: 'Waste Forms',
            tier: 6,
            skillGain: 35,
            target: 600,
            icon: '🧪',
            unlocksAt: 10000,
            value: 1000,
            description: 'Radioactive waste immobilized in glass.',
            laborMultiplier: 3.5,
            usedIn: ['waste_disposal', 'permanent_storage']
        },
        {
            id: 'synroc',
            name: 'Synroc (Synthetic Rock)',
            formula: 'Titanates + Zirconolites + Perovskites → Ceramic Waste Form',
            ingredients: { Titanium: 20, Zirconium: 15, Barium: 5, Aluminum: 5 },
            field: 'nuclear',
            category: 'Waste Forms',
            tier: 6,
            skillGain: 40,
            target: 600,
            icon: '🪨',
            unlocksAt: 11000,
            value: 2000,
            description: 'Titanate ceramic for actinide immobilization.',
            laborMultiplier: 4.0,
            usedIn: ['plutonium_disposal', 'waste_immobilization']
        },
        {
            id: 'waste_cask',
            name: 'Dry Storage Cask',
            formula: 'Concrete + Steel + Basket → Storage',
            ingredients: { ConcreteShielding: 200, SteelCask: 100, FuelBasket: 20 },
            field: 'nuclear',
            category: 'Waste Forms',
            tier: 6,
            skillGain: 38,
            target: 600,
            icon: '🗄️',
            unlocksAt: 12000,
            value: 50000,
            description: 'Dry storage cask for spent nuclear fuel.',
            laborMultiplier: 4.2,
            usedIn: ['spent_fuel_storage', 'interim_storage']
        }
    ],
    
    'Decommissioning': [
        {
            id: 'decontamination_foam',
            name: 'Decontamination Foam',
            formula: 'Surfactants + Chelating Agents + Foaming Agents → Strippable Foam',
            ingredients: { Surfactants: 10, EDTA: 5, FoamingAgent: 3, Water: 20 },
            field: 'nuclear',
            category: 'Decommissioning',
            tier: 6,
            skillGain: 25,
            target: 600,
            icon: '🧼',
            unlocksAt: 9000,
            value: 200,
            description: 'Strippable foam for surface decontamination.',
            laborMultiplier: 2.5,
            usedIn: ['cleanup', 'decommissioning', 'decontamination']
        },
        {
            id: 'remote_manipulator',
            name: 'Remote Manipulator',
            formula: 'Servo Motors + Master-Slave Arms → Teleoperation',
            ingredients: { ServoMotors: 10, StainlessSteel: 30, ControlSystem: 5, Cables: 5 },
            field: 'nuclear',
            category: 'Decommissioning',
            tier: 6,
            skillGain: 42,
            target: 600,
            icon: '🦾',
            unlocksAt: 13000,
            value: 50000,
            description: 'Remote manipulator for hot cell operations.',
            laborMultiplier: 4.5,
            usedIn: ['hot_cells', 'decommissioning', 'waste_handling']
        }
    ],
    
    // ============================================================================
    // TIER 7: ADVANCED NUCLEAR SYSTEMS (6 recipes)
    // ============================================================================
    
    'Advanced Reactors': [
        {
            id: 'triso_fuel',
            name: 'TRISO Fuel Particle',
            formula: 'UO₂ Kernel + PyC + SiC + PyC → Coated Particle',
            ingredients: { UO2Kernel: 10, PyrolyticCarbon: 5, SiliconCarbide: 3 },
            field: 'nuclear',
            category: 'Advanced Reactors',
            tier: 7,
            skillGain: 60,
            target: 800,
            icon: '⚪',
            unlocksAt: 20000,
            value: 5000,
            description: 'TRISO-coated fuel particle for high-temperature reactors.',
            laborMultiplier: 5.0,
            usedIn: ['htgr', 'pebble_bed', 'advanced_reactors']
        },
        {
            id: 'pebble_fuel',
            name: 'Pebble Fuel',
            formula: 'TRISO Particles + Graphite Matrix → Fuel Pebble',
            ingredients: { TRISOFuel: 100, Graphite: 50, Pressing: 2 },
            field: 'nuclear',
            category: 'Advanced Reactors',
            tier: 7,
            skillGain: 70,
            target: 800,
            icon: '⚽',
            unlocksAt: 22000,
            value: 20000,
            description: 'Pebble bed reactor fuel element.',
            laborMultiplier: 6.0,
            usedIn: ['pebble_bed_reactors', 'htgr']
        },
        {
            id: 'molten_salt',
            name: 'Molten Salt Fuel',
            formula: 'LiF + BeF₂ + UF₄ → Fuel Salt',
            ingredients: { Lithium: 20, Beryllium: 10, Uranium: 15, Fluorine: 30 },
            field: 'nuclear',
            category: 'Advanced Reactors',
            tier: 7,
            skillGain: 65,
            target: 800,
            icon: '🧂',
            unlocksAt: 25000,
            value: 15000,
            description: 'Molten salt reactor fuel.',
            laborMultiplier: 5.5,
            usedIn: ['msr', 'advanced_reactors']
        }
    ],
    
    'Fusion Materials': [
        {
            id: 'tritium_breeding_blanket',
            name: 'Tritium Breeding Blanket',
            formula: 'Lithium Ceramic + Beryllium Multiplier → Breeding',
            ingredients: { Lithium: 40, Beryllium: 30, CeramicMatrix: 20, Coolant: 10 },
            field: 'nuclear',
            category: 'Fusion Materials',
            tier: 7,
            skillGain: 80,
            target: 800,
            icon: '🔄',
            unlocksAt: 30000,
            value: 100000,
            description: 'Blanket for breeding tritium in fusion reactors.',
            laborMultiplier: 7.0,
            usedIn: ['fusion_reactors', 'tritium_breeding']
        },
        {
            id: 'first_wall',
            name: 'First Wall',
            formula: 'Beryllium + Tungsten + Heat Sink → Plasma-Facing',
            ingredients: { Beryllium: 30, Tungsten: 20, CopperHeatSink: 25, CoolingChannels: 5 },
            field: 'nuclear',
            category: 'Fusion Materials',
            tier: 7,
            skillGain: 85,
            target: 800,
            icon: '🧱',
            unlocksAt: 32000,
            value: 150000,
            description: 'Plasma-facing component for fusion reactors.',
            laborMultiplier: 7.5,
            usedIn: ['tokamak', 'stellarator', 'fusion']
        },
        {
            id: 'divertor',
            name: 'Divertor',
            formula: 'Tungsten + Carbon Composite + Cooling → Heat Exhaust',
            ingredients: { Tungsten: 40, CarbonComposite: 30, CoolingSystem: 20, Armor: 10 },
            field: 'nuclear',
            category: 'Fusion Materials',
            tier: 7,
            skillGain: 90,
            target: 800,
            icon: '🔥',
            unlocksAt: 35000,
            value: 200000,
            description: 'Divertor for exhaust of fusion power.',
            laborMultiplier: 8.0,
            usedIn: ['fusion_reactors', 'heat_exhaust']
        }
    ],
    
    // ============================================================================
    // ADDITIONAL: NUCLEAR INSTRUMENTS (Helper recipes)
    // ============================================================================
    
    'Instruments': [
        {
            id: 'geiger_counter',
            name: 'Geiger-Müller Counter',
            formula: 'GM Tube + Electronics + Display → Radiation Detector',
            ingredients: { GMTube: 3, CircuitBoard: 2, Display: 1, Battery: 1 },
            field: 'nuclear',
            category: 'Instruments',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '📊',
            unlocksAt: 800,
            value: 300,
            description: 'Portable radiation detection instrument.',
            laborMultiplier: 1.6,
            usedIn: ['survey', 'safety', 'monitoring']
        },
        {
            id: 'neutron_detector',
            name: 'Neutron Detector',
            formula: 'He-3 Tube + Moderator + Electronics → Neutron Counter',
            ingredients: { He3Tube: 3, Polyethylene: 5, Electronics: 2 },
            field: 'nuclear',
            category: 'Instruments',
            tier: 3,
            skillGain: 15,
            target: 300,
            icon: '📡',
            unlocksAt: 2800,
            value: 2000,
            description: 'Detector for neutron radiation.',
            laborMultiplier: 2.2,
            usedIn: ['reactor_monitoring', 'nuclear_safeguards']
        },
        {
            id: 'dosimeter',
            name: 'Personal Dosimeter',
            formula: 'OSLD + Holder + Reader → Radiation Badge',
            ingredients: { OSLD: 2, PlasticCase: 1, Filter: 1 },
            field: 'nuclear',
            category: 'Instruments',
            tier: 2,
            skillGain: 6,
            target: 200,
            icon: '🏷️',
            unlocksAt: 700,
            value: 50,
            description: 'Personal radiation monitoring badge.',
            laborMultiplier: 1.5,
            usedIn: ['personnel_monitoring', 'safety']
        }
    ]
};

// ============================================================================
// EXPORT ALL NUCLEAR RECIPES
// ============================================================================

export default NUCLEAR_RECIPES;

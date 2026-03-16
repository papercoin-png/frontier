// js/manufacturing/ship-requirements.js
// Ship material requirements calculator
// Defines what materials are needed to build different ship classes

// ===== SHIP CLASSES =====
export const SHIP_CLASSES = {
    FRIGATE: 'Frigate',
    DESTROYER: 'Destroyer',
    CRUISER: 'Cruiser',
    BATTLESHIP: 'Battleship',
    DREADNOUGHT: 'Dreadnought',
    CARRIER: 'Carrier',
    EXPLORER: 'Explorer',
    FREIGHTER: 'Freighter'
};

// ===== SHIP TIERS =====
export const SHIP_TIERS = {
    [SHIP_CLASSES.FRIGATE]: 1,
    [SHIP_CLASSES.DESTROYER]: 2,
    [SHIP_CLASSES.CRUISER]: 3,
    [SHIP_CLASSES.BATTLESHIP]: 4,
    [SHIP_CLASSES.DREADNOUGHT]: 5,
    [SHIP_CLASSES.CARRIER]: 5,
    [SHIP_CLASSES.EXPLORER]: 3,
    [SHIP_CLASSES.FREIGHTER]: 2
};

// ============================================================================
// SHIP COMPONENT DEFINITIONS
// ============================================================================

// Hull components
export const HULL_COMPONENTS = {
    // Small ship hulls
    'frigate_hull': {
        id: 'frigate_hull',
        name: 'Frigate Hull',
        tier: 1,
        mass: 500,
        materials: {
            // Structural materials
            Steel: 200,
            AluminumAlloy: 100,
            Titanium: 50,
            // Internal structure
            StructuralComposite: 80,
            // Fasteners
            TitaniumFasteners: 30
        },
        skills: {
            metallurgy: 100,
            construction: 50
        },
        laborHours: 200,
        value: 50000
    },
    
    'destroyer_hull': {
        id: 'destroyer_hull',
        name: 'Destroyer Hull',
        tier: 2,
        mass: 1200,
        materials: {
            Steel: 500,
            TitaniumAlloy: 200,
            AluminumAlloy: 150,
            StructuralComposite: 120,
            CarbonFiberComposite: 80,
            TitaniumFasteners: 50
        },
        skills: {
            metallurgy: 500,
            construction: 200,
            aerospace: 100
        },
        laborHours: 500,
        value: 150000
    },
    
    'cruiser_hull': {
        id: 'cruiser_hull',
        name: 'Cruiser Hull',
        tier: 3,
        mass: 3000,
        materials: {
            TitaniumAlloy: 800,
            Steel: 600,
            CarbonFiberComposite: 400,
            StructuralComposite: 300,
            CeramicArmor: 200,
            TitaniumFasteners: 100
        },
        skills: {
            metallurgy: 1500,
            construction: 500,
            aerospace: 300,
            materials: 200
        },
        laborHours: 1200,
        value: 500000
    },
    
    'battleship_hull': {
        id: 'battleship_hull',
        name: 'Battleship Hull',
        tier: 4,
        mass: 10000,
        materials: {
            TitaniumAlloy: 2000,
            ArmorSteel: 3000,
            CarbonFiberComposite: 800,
            CeramicArmor: 1000,
            StructuralComposite: 600,
            TitaniumFasteners: 200,
            ReinforcedConcrete: 1000
        },
        skills: {
            metallurgy: 5000,
            construction: 2000,
            aerospace: 1000,
            materials: 500,
            nuclear: 200
        },
        laborHours: 5000,
        value: 2000000
    },
    
    'dreadnought_hull': {
        id: 'dreadnought_hull',
        name: 'Dreadnought Hull',
        tier: 5,
        mass: 50000,
        materials: {
            TitaniumAlloy: 10000,
            ArmorSteel: 15000,
            CarbonFiberComposite: 4000,
            CeramicArmor: 5000,
            StructuralComposite: 3000,
            TitaniumFasteners: 1000,
            ReinforcedConcrete: 5000,
            NanocompositeArmor: 1000
        },
        skills: {
            metallurgy: 20000,
            construction: 5000,
            aerospace: 3000,
            materials: 2000,
            nuclear: 1000
        },
        laborHours: 20000,
        value: 10000000
    },
    
    'carrier_hull': {
        id: 'carrier_hull',
        name: 'Carrier Hull',
        tier: 5,
        mass: 80000,
        materials: {
            TitaniumAlloy: 15000,
            ArmorSteel: 20000,
            CarbonFiberComposite: 8000,
            CeramicArmor: 6000,
            StructuralComposite: 5000,
            TitaniumFasteners: 2000,
            ReinforcedConcrete: 10000,
            NanocompositeArmor: 2000
        },
        skills: {
            metallurgy: 25000,
            construction: 8000,
            aerospace: 5000,
            materials: 3000,
            nuclear: 1500
        },
        laborHours: 30000,
        value: 15000000
    },
    
    'explorer_hull': {
        id: 'explorer_hull',
        name: 'Explorer Hull',
        tier: 3,
        mass: 2000,
        materials: {
            TitaniumAlloy: 600,
            CarbonFiberComposite: 500,
            AluminumAlloy: 300,
            StructuralComposite: 200,
            TitaniumFasteners: 50
        },
        skills: {
            metallurgy: 1000,
            construction: 300,
            aerospace: 500,
            materials: 300
        },
        laborHours: 800,
        value: 300000
    },
    
    'freighter_hull': {
        id: 'freighter_hull',
        name: 'Freighter Hull',
        tier: 2,
        mass: 4000,
        materials: {
            Steel: 2000,
            AluminumAlloy: 800,
            StructuralComposite: 300,
            TitaniumFasteners: 100
        },
        skills: {
            metallurgy: 800,
            construction: 400
        },
        laborHours: 600,
        value: 200000
    }
};

// Propulsion components
export const PROPULSION_COMPONENTS = {
    // Engines
    'frigate_engine': {
        id: 'frigate_engine',
        name: 'Frigate Ion Drive',
        tier: 1,
        mass: 100,
        materials: {
            TitaniumAlloy: 50,
            Copper: 30,
            RareEarthMagnets: 20,
            Superconductor: 10,
            CeramicInsulator: 15
        },
        skills: {
            metallurgy: 100,
            aerospace: 200,
            magnetic: 100
        },
        thrust: 50,
        power: 100,
        efficiency: 1.2,
        laborHours: 150,
        value: 30000
    },
    
    'destroyer_engine': {
        id: 'destroyer_engine',
        name: 'Destroyer Fusion Drive',
        tier: 2,
        mass: 300,
        materials: {
            TitaniumAlloy: 150,
            Inconel: 80,
            Copper: 50,
            RareEarthMagnets: 40,
            Superconductor: 30,
            CeramicInsulator: 25
        },
        skills: {
            metallurgy: 300,
            aerospace: 500,
            magnetic: 200,
            nuclear: 100
        },
        thrust: 200,
        power: 300,
        efficiency: 1.5,
        laborHours: 400,
        value: 100000
    },
    
    'cruiser_engine': {
        id: 'cruiser_engine',
        name: 'Cruiser Antimatter Drive',
        tier: 3,
        mass: 800,
        materials: {
            TitaniumAlloy: 400,
            Inconel: 200,
            Tungsten: 100,
            RareEarthMagnets: 80,
            Superconductor: 60,
            CeramicInsulator: 50,
            AntimatterCatalyst: 10
        },
        skills: {
            metallurgy: 800,
            aerospace: 1200,
            magnetic: 400,
            nuclear: 300,
            cryogenic: 200
        },
        thrust: 800,
        power: 1000,
        efficiency: 2.0,
        laborHours: 1000,
        value: 400000
    },
    
    'battleship_engine': {
        id: 'battleship_engine',
        name: 'Battleship Plasma Drive',
        tier: 4,
        mass: 3000,
        materials: {
            TitaniumAlloy: 1500,
            Inconel: 800,
            Tungsten: 400,
            RareEarthMagnets: 200,
            Superconductor: 150,
            CeramicInsulator: 100,
            AntimatterCatalyst: 30,
            Nanocomposite: 50
        },
        skills: {
            metallurgy: 2500,
            aerospace: 3000,
            magnetic: 1000,
            nuclear: 800,
            cryogenic: 500,
            optical: 200
        },
        thrust: 3000,
        power: 4000,
        efficiency: 2.5,
        laborHours: 4000,
        value: 1500000
    },
    
    'dreadnought_engine': {
        id: 'dreadnought_engine',
        name: 'Dreadnought Singularity Drive',
        tier: 5,
        mass: 10000,
        materials: {
            TitaniumAlloy: 5000,
            Inconel: 2500,
            Tungsten: 1500,
            RareEarthMagnets: 600,
            Superconductor: 500,
            CeramicInsulator: 300,
            AntimatterCatalyst: 100,
            Nanocomposite: 200,
            ExoticMatter: 50
        },
        skills: {
            metallurgy: 8000,
            aerospace: 10000,
            magnetic: 3000,
            nuclear: 2500,
            cryogenic: 1500,
            optical: 500,
            quantum: 100
        },
        thrust: 15000,
        power: 20000,
        efficiency: 3.0,
        laborHours: 15000,
        value: 8000000
    }
};

// Power plant components
export const POWER_COMPONENTS = {
    'frigate_reactor': {
        id: 'frigate_reactor',
        name: 'Frigate Fusion Reactor',
        tier: 1,
        mass: 150,
        materials: {
            TitaniumAlloy: 60,
            Steel: 80,
            Copper: 40,
            Superconductor: 20,
            LeadShielding: 30,
            BoronCarbide: 10
        },
        skills: {
            metallurgy: 100,
            nuclear: 200,
            cryogenic: 100
        },
        powerOutput: 200,
        fuelEfficiency: 1.0,
        laborHours: 200,
        value: 40000
    },
    
    'destroyer_reactor': {
        id: 'destroyer_reactor',
        name: 'Destroyer Tokamak Reactor',
        tier: 2,
        mass: 500,
        materials: {
            TitaniumAlloy: 200,
            Steel: 250,
            Copper: 80,
            Superconductor: 50,
            LeadShielding: 60,
            BoronCarbide: 20,
            Tritium: 10
        },
        skills: {
            metallurgy: 300,
            nuclear: 500,
            cryogenic: 200,
            magnetic: 200
        },
        powerOutput: 800,
        fuelEfficiency: 1.5,
        laborHours: 600,
        value: 150000
    },
    
    'cruiser_reactor': {
        id: 'cruiser_reactor',
        name: 'Cruiser Spheromak Reactor',
        tier: 3,
        mass: 1500,
        materials: {
            TitaniumAlloy: 600,
            Steel: 600,
            Copper: 200,
            Superconductor: 150,
            LeadShielding: 150,
            BoronCarbide: 50,
            Tritium: 30,
            Helium3: 20
        },
        skills: {
            metallurgy: 800,
            nuclear: 1500,
            cryogenic: 500,
            magnetic: 500,
            materials: 200
        },
        powerOutput: 3000,
        fuelEfficiency: 2.0,
        laborHours: 1500,
        value: 600000
    },
    
    'battleship_reactor': {
        id: 'battleship_reactor',
        name: 'Battleship D-T Fusion Reactor',
        tier: 4,
        mass: 6000,
        materials: {
            TitaniumAlloy: 2500,
            Steel: 2000,
            Copper: 600,
            Superconductor: 500,
            LeadShielding: 400,
            BoronCarbide: 150,
            Tritium: 100,
            Helium3: 50,
            Tungsten: 200
        },
        skills: {
            metallurgy: 2500,
            nuclear: 4000,
            cryogenic: 1500,
            magnetic: 1500,
            materials: 500,
            aerospace: 200
        },
        powerOutput: 12000,
        fuelEfficiency: 2.5,
        laborHours: 5000,
        value: 2500000
    },
    
    'dreadnought_reactor': {
        id: 'dreadnought_reactor',
        name: 'Dreadnought Antimatter Reactor',
        tier: 5,
        mass: 20000,
        materials: {
            TitaniumAlloy: 8000,
            Steel: 6000,
            Copper: 2000,
            Superconductor: 1500,
            LeadShielding: 1200,
            BoronCarbide: 400,
            Tritium: 300,
            Helium3: 150,
            Tungsten: 600,
            Antimatter: 100,
            ExoticMatter: 50
        },
        skills: {
            metallurgy: 8000,
            nuclear: 15000,
            cryogenic: 5000,
            magnetic: 4000,
            materials: 2000,
            aerospace: 1000,
            quantum: 200
        },
        powerOutput: 50000,
        fuelEfficiency: 4.0,
        laborHours: 20000,
        value: 12000000
    }
};

// Shield components
export const SHIELD_COMPONENTS = {
    'frigate_shield': {
        id: 'frigate_shield',
        name: 'Frigate Deflector Shield',
        tier: 1,
        mass: 50,
        materials: {
            Copper: 30,
            Superconductor: 20,
            RareEarthMagnets: 15,
            SiliconCarbide: 10,
            PolymerComposite: 15
        },
        skills: {
            magnetic: 150,
            optical: 100,
            materials: 100
        },
        shieldStrength: 100,
        rechargeRate: 10,
        powerDraw: 50,
        laborHours: 100,
        value: 20000
    },
    
    'destroyer_shield': {
        id: 'destroyer_shield',
        name: 'Destroyer Energy Shield',
        tier: 2,
        mass: 150,
        materials: {
            Copper: 80,
            Superconductor: 50,
            RareEarthMagnets: 40,
            SiliconCarbide: 30,
            PolymerComposite: 40,
            CeramicPlate: 20
        },
        skills: {
            magnetic: 400,
            optical: 250,
            materials: 250,
            aerospace: 100
        },
        shieldStrength: 300,
        rechargeRate: 25,
        powerDraw: 150,
        laborHours: 300,
        value: 60000
    },
    
    'cruiser_shield': {
        id: 'cruiser_shield',
        name: 'Cruiser Graviton Shield',
        tier: 3,
        mass: 400,
        materials: {
            Copper: 200,
            Superconductor: 150,
            RareEarthMagnets: 100,
            SiliconCarbide: 80,
            PolymerComposite: 100,
            CeramicPlate: 60,
            GravitonGenerator: 10
        },
        skills: {
            magnetic: 1000,
            optical: 600,
            materials: 600,
            aerospace: 300,
            nuclear: 200
        },
        shieldStrength: 1000,
        rechargeRate: 60,
        powerDraw: 400,
        laborHours: 800,
        value: 200000
    },
    
    'battleship_shield': {
        id: 'battleship_shield',
        name: 'Battleship Quantum Shield',
        tier: 4,
        mass: 1500,
        materials: {
            Copper: 600,
            Superconductor: 500,
            RareEarthMagnets: 300,
            SiliconCarbide: 250,
            PolymerComposite: 300,
            CeramicPlate: 200,
            GravitonGenerator: 30,
            Nanocomposite: 50
        },
        skills: {
            magnetic: 3000,
            optical: 1500,
            materials: 1500,
            aerospace: 800,
            nuclear: 500,
            quantum: 100
        },
        shieldStrength: 4000,
        rechargeRate: 150,
        powerDraw: 1500,
        laborHours: 2500,
        value: 800000
    },
    
    'dreadnought_shield': {
        id: 'dreadnought_shield',
        name: 'Dreadnought Singularity Shield',
        tier: 5,
        mass: 5000,
        materials: {
            Copper: 2000,
            Superconductor: 1500,
            RareEarthMagnets: 1000,
            SiliconCarbide: 800,
            PolymerComposite: 1000,
            CeramicPlate: 600,
            GravitonGenerator: 100,
            Nanocomposite: 200,
            ExoticMatter: 50
        },
        skills: {
            magnetic: 10000,
            optical: 5000,
            materials: 4000,
            aerospace: 2000,
            nuclear: 1500,
            quantum: 500
        },
        shieldStrength: 15000,
        rechargeRate: 400,
        powerDraw: 5000,
        laborHours: 10000,
        value: 4000000
    }
};

// Weapon components
export const WEAPON_COMPONENTS = {
    'laser_cannon': {
        id: 'laser_cannon',
        name: 'Laser Cannon',
        tier: 1,
        mass: 40,
        materials: {
            Aluminum: 20,
            OpticalLenses: 10,
            LaserCrystals: 5,
            Copper: 10,
            Electronics: 5
        },
        skills: {
            optical: 150,
            aerospace: 50
        },
        damage: 50,
        range: 100,
        powerDraw: 30,
        laborHours: 80,
        value: 15000
    },
    
    'railgun': {
        id: 'railgun',
        name: 'Railgun',
        tier: 2,
        mass: 200,
        materials: {
            Steel: 100,
            Copper: 50,
            Superconductor: 30,
            RareEarthMagnets: 40,
            TungstenProjectiles: 20
        },
        skills: {
            magnetic: 300,
            metallurgy: 200
        },
        damage: 200,
        range: 200,
        powerDraw: 100,
        laborHours: 200,
        value: 50000
    },
    
    'missile_launcher': {
        id: 'missile_launcher',
        name: 'Missile Launcher',
        tier: 2,
        mass: 150,
        materials: {
            Steel: 80,
            Aluminum: 40,
            Electronics: 20,
            Propellant: 30,
            WarheadComponents: 15
        },
        skills: {
            aerospace: 250,
            metallurgy: 100
        },
        damage: 300,
        range: 300,
        ammoType: 'missiles',
        laborHours: 150,
        value: 40000
    },
    
    'plasma_cannon': {
        id: 'plasma_cannon',
        name: 'Plasma Cannon',
        tier: 3,
        mass: 300,
        materials: {
            TitaniumAlloy: 100,
            CeramicInsulator: 50,
            Superconductor: 40,
            RareEarthMagnets: 60,
            Tungsten: 30
        },
        skills: {
            aerospace: 500,
            magnetic: 300,
            materials: 200,
            nuclear: 100
        },
        damage: 400,
        range: 150,
        powerDraw: 200,
        laborHours: 300,
        value: 120000
    },
    
    'particle_beam': {
        id: 'particle_beam',
        name: 'Particle Beam Cannon',
        tier: 4,
        mass: 600,
        materials: {
            TitaniumAlloy: 200,
            Superconductor: 100,
            RareEarthMagnets: 150,
            Tungsten: 80,
            CeramicInsulator: 100,
            AcceleratorComponents: 50
        },
        skills: {
            aerospace: 1000,
            magnetic: 600,
            nuclear: 400,
            optical: 300,
            materials: 200
        },
        damage: 800,
        range: 250,
        powerDraw: 500,
        laborHours: 600,
        value: 300000
    },
    
    'antimatter_cannon': {
        id: 'antimatter_cannon',
        name: 'Antimatter Cannon',
        tier: 5,
        mass: 1500,
        materials: {
            TitaniumAlloy: 500,
            Superconductor: 300,
            RareEarthMagnets: 400,
            Tungsten: 200,
            CeramicInsulator: 300,
            AcceleratorComponents: 150,
            Antimatter: 50,
            ExoticMatter: 20
        },
        skills: {
            aerospace: 3000,
            magnetic: 2000,
            nuclear: 1500,
            optical: 1000,
            materials: 800,
            quantum: 300
        },
        damage: 3000,
        range: 400,
        powerDraw: 2000,
        laborHours: 2000,
        value: 1500000
    }
};

// Life support components
export const LIFE_SUPPORT_COMPONENTS = {
    'oxygen_generator': {
        id: 'oxygen_generator',
        name: 'Oxygen Generator',
        tier: 1,
        mass: 30,
        materials: {
            Steel: 15,
            Aluminum: 10,
            Electrolyzer: 5,
            Filters: 3
        },
        skills: {
            construction: 50,
            pharmaceuticals: 30
        },
        output: 'oxygen',
        capacity: 10,
        powerDraw: 5,
        laborHours: 40,
        value: 8000
    },
    
    'water_recycler': {
        id: 'water_recycler',
        name: 'Water Recycler',
        tier: 1,
        mass: 40,
        materials: {
            StainlessSteel: 20,
            Polymer: 10,
            Filters: 5,
            Pumps: 3
        },
        skills: {
            construction: 60,
            pharmaceuticals: 20
        },
        output: 'water',
        capacity: 15,
        powerDraw: 3,
        laborHours: 50,
        value: 10000
    },
    
    'food_synthesizer': {
        id: 'food_synthesizer',
        name: 'Food Synthesizer',
        tier: 2,
        mass: 60,
        materials: {
            StainlessSteel: 25,
            Polymer: 15,
            Electronics: 8,
            Nutrients: 10
        },
        skills: {
            construction: 100,
            pharmaceuticals: 80,
            textiles: 20
        },
        output: 'food',
        capacity: 20,
        powerDraw: 8,
        laborHours: 80,
        value: 20000
    },
    
    'medical_bay': {
        id: 'medical_bay',
        name: 'Medical Bay',
        tier: 2,
        mass: 200,
        materials: {
            StainlessSteel: 80,
            Polymer: 40,
            Electronics: 30,
            Pharmaceuticals: 50,
            MedicalEquipment: 20
        },
        skills: {
            construction: 150,
            pharmaceuticals: 300,
            textiles: 50
        },
        output: 'medical',
        capacity: 5,
        powerDraw: 20,
        laborHours: 200,
        value: 60000
    },
    
    'hydroponics_bay': {
        id: 'hydroponics_bay',
        name: 'Hydroponics Bay',
        tier: 3,
        mass: 400,
        materials: {
            Aluminum: 150,
            Polymer: 100,
            Glass: 80,
            Nutrients: 100,
            Lighting: 30
        },
        skills: {
            construction: 300,
            pharmaceuticals: 200,
            textiles: 50
        },
        output: 'food',
        capacity: 50,
        powerDraw: 30,
        laborHours: 300,
        value: 120000
    }
};

// ============================================================================
// COMPLETE SHIP REQUIREMENTS
// ============================================================================

export const SHIP_REQUIREMENTS = {
    [SHIP_CLASSES.FRIGATE]: {
        name: 'Frigate',
        tier: 1,
        description: 'Small, fast escort ship for patrol and light combat.',
        hull: HULL_COMPONENTS.frigate_hull,
        propulsion: PROPULSION_COMPONENTS.frigate_engine,
        power: POWER_COMPONENTS.frigate_reactor,
        shields: SHIELD_COMPONENTS.frigate_shield,
        weapons: [WEAPON_COMPONENTS.laser_cannon],
        lifeSupport: [LIFE_SUPPORT_COMPONENTS.oxygen_generator, LIFE_SUPPORT_COMPONENTS.water_recycler],
        crew: 10,
        cargo: 100,
        range: 100,
        speed: 200,
        value: 150000
    },
    
    [SHIP_CLASSES.DESTROYER]: {
        name: 'Destroyer',
        tier: 2,
        description: 'Medium warship for fleet defense and patrol.',
        hull: HULL_COMPONENTS.destroyer_hull,
        propulsion: PROPULSION_COMPONENTS.destroyer_engine,
        power: POWER_COMPONENTS.destroyer_reactor,
        shields: SHIELD_COMPONENTS.destroyer_shield,
        weapons: [WEAPON_COMPONENTS.railgun, WEAPON_COMPONENTS.missile_launcher],
        lifeSupport: [LIFE_SUPPORT_COMPONENTS.oxygen_generator, LIFE_SUPPORT_COMPONENTS.water_recycler, LIFE_SUPPORT_COMPONENTS.food_synthesizer],
        crew: 50,
        cargo: 500,
        range: 200,
        speed: 150,
        value: 500000
    },
    
    [SHIP_CLASSES.CRUISER]: {
        name: 'Cruiser',
        tier: 3,
        description: 'Heavy warship for independent operations and fleet support.',
        hull: HULL_COMPONENTS.cruiser_hull,
        propulsion: PROPULSION_COMPONENTS.cruiser_engine,
        power: POWER_COMPONENTS.cruiser_reactor,
        shields: SHIELD_COMPONENTS.cruiser_shield,
        weapons: [WEAPON_COMPONENTS.plasma_cannon, WEAPON_COMPONENTS.railgun, WEAPON_COMPONENTS.missile_launcher],
        lifeSupport: [LIFE_SUPPORT_COMPONENTS.oxygen_generator, LIFE_SUPPORT_COMPONENTS.water_recycler, 
                      LIFE_SUPPORT_COMPONENTS.food_synthesizer, LIFE_SUPPORT_COMPONENTS.medical_bay],
        crew: 200,
        cargo: 2000,
        range: 500,
        speed: 120,
        value: 2000000
    },
    
    [SHIP_CLASSES.BATTLESHIP]: {
        name: 'Battleship',
        tier: 4,
        description: 'Capital ship with heavy armor and devastating firepower.',
        hull: HULL_COMPONENTS.battleship_hull,
        propulsion: PROPULSION_COMPONENTS.battleship_engine,
        power: POWER_COMPONENTS.battleship_reactor,
        shields: SHIELD_COMPONENTS.battleship_shield,
        weapons: [WEAPON_COMPONENTS.particle_beam, WEAPON_COMPONENTS.plasma_cannon, WEAPON_COMPONENTS.railgun],
        lifeSupport: [LIFE_SUPPORT_COMPONENTS.oxygen_generator, LIFE_SUPPORT_COMPONENTS.water_recycler, 
                      LIFE_SUPPORT_COMPONENTS.food_synthesizer, LIFE_SUPPORT_COMPONENTS.medical_bay,
                      LIFE_SUPPORT_COMPONENTS.hydroponics_bay],
        crew: 1000,
        cargo: 10000,
        range: 1000,
        speed: 80,
        value: 10000000
    },
    
    [SHIP_CLASSES.DREADNOUGHT]: {
        name: 'Dreadnought',
        tier: 5,
        description: 'Ultimate warship, capable of destroying entire fleets.',
        hull: HULL_COMPONENTS.dreadnought_hull,
        propulsion: PROPULSION_COMPONENTS.dreadnought_engine,
        power: POWER_COMPONENTS.dreadnought_reactor,
        shields: SHIELD_COMPONENTS.dreadnought_shield,
        weapons: [WEAPON_COMPONENTS.antimatter_cannon, WEAPON_COMPONENTS.particle_beam, WEAPON_COMPONENTS.plasma_cannon],
        lifeSupport: [LIFE_SUPPORT_COMPONENTS.oxygen_generator, LIFE_SUPPORT_COMPONENTS.water_recycler, 
                      LIFE_SUPPORT_COMPONENTS.food_synthesizer, LIFE_SUPPORT_COMPONENTS.medical_bay,
                      LIFE_SUPPORT_COMPONENTS.hydroponics_bay],
        crew: 5000,
        cargo: 50000,
        range: 2000,
        speed: 60,
        value: 50000000
    },
    
    [SHIP_CLASSES.CARRIER]: {
        name: 'Carrier',
        tier: 5,
        description: 'Mobile base for fighter squadrons and fleet operations.',
        hull: HULL_COMPONENTS.carrier_hull,
        propulsion: PROPULSION_COMPONENTS.dreadnought_engine,
        power: POWER_COMPONENTS.dreadnought_reactor,
        shields: SHIELD_COMPONENTS.battleship_shield,
        weapons: [WEAPON_COMPONENTS.particle_beam, WEAPON_COMPONENTS.missile_launcher],
        lifeSupport: [LIFE_SUPPORT_COMPONENTS.oxygen_generator, LIFE_SUPPORT_COMPONENTS.water_recycler, 
                      LIFE_SUPPORT_COMPONENTS.food_synthesizer, LIFE_SUPPORT_COMPONENTS.medical_bay,
                      LIFE_SUPPORT_COMPONENTS.hydroponics_bay],
        crew: 10000,
        cargo: 100000,
        range: 1500,
        speed: 50,
        value: 80000000
    },
    
    [SHIP_CLASSES.EXPLORER]: {
        name: 'Explorer',
        tier: 3,
        description: 'Long-range science vessel for exploration and research.',
        hull: HULL_COMPONENTS.explorer_hull,
        propulsion: PROPULSION_COMPONENTS.cruiser_engine,
        power: POWER_COMPONENTS.cruiser_reactor,
        shields: SHIELD_COMPONENTS.cruiser_shield,
        weapons: [],
        lifeSupport: [LIFE_SUPPORT_COMPONENTS.oxygen_generator, LIFE_SUPPORT_COMPONENTS.water_recycler, 
                      LIFE_SUPPORT_COMPONENTS.food_synthesizer, LIFE_SUPPORT_COMPONENTS.medical_bay,
                      LIFE_SUPPORT_COMPONENTS.hydroponics_bay],
        crew: 100,
        cargo: 5000,
        range: 5000,
        speed: 150,
        value: 3000000
    },
    
    [SHIP_CLASSES.FREIGHTER]: {
        name: 'Freighter',
        tier: 2,
        description: 'Cargo ship for transporting goods and materials.',
        hull: HULL_COMPONENTS.freighter_hull,
        propulsion: PROPULSION_COMPONENTS.destroyer_engine,
        power: POWER_COMPONENTS.destroyer_reactor,
        shields: SHIELD_COMPONENTS.destroyer_shield,
        weapons: [],
        lifeSupport: [LIFE_SUPPORT_COMPONENTS.oxygen_generator, LIFE_SUPPORT_COMPONENTS.water_recycler, 
                      LIFE_SUPPORT_COMPONENTS.food_synthesizer],
        crew: 20,
        cargo: 50000,
        range: 1000,
        speed: 80,
        value: 1000000
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate total materials needed for a ship
 * @param {string} shipClass - Ship class
 * @returns {Object} Aggregated material requirements
 */
export function calculateShipMaterials(shipClass) {
    const ship = SHIP_REQUIREMENTS[shipClass];
    if (!ship) return null;
    
    const materials = {};
    
    // Add hull materials
    for (const [material, amount] of Object.entries(ship.hull.materials)) {
        materials[material] = (materials[material] || 0) + amount;
    }
    
    // Add propulsion materials
    for (const [material, amount] of Object.entries(ship.propulsion.materials)) {
        materials[material] = (materials[material] || 0) + amount;
    }
    
    // Add power materials
    for (const [material, amount] of Object.entries(ship.power.materials)) {
        materials[material] = (materials[material] || 0) + amount;
    }
    
    // Add shield materials
    for (const [material, amount] of Object.entries(ship.shields.materials)) {
        materials[material] = (materials[material] || 0) + amount;
    }
    
    // Add weapon materials
    for (const weapon of ship.weapons) {
        for (const [material, amount] of Object.entries(weapon.materials)) {
            materials[material] = (materials[material] || 0) + amount;
        }
    }
    
    // Add life support materials
    for (const ls of ship.lifeSupport) {
        for (const [material, amount] of Object.entries(ls.materials)) {
            materials[material] = (materials[material] || 0) + amount;
        }
    }
    
    return materials;
}

/**
 * Calculate total skill requirements for a ship
 * @param {string} shipClass - Ship class
 * @returns {Object} Aggregated skill requirements
 */
export function calculateShipSkills(shipClass) {
    const ship = SHIP_REQUIREMENTS[shipClass];
    if (!ship) return null;
    
    const skills = {};
    
    // Add hull skills
    for (const [skill, level] of Object.entries(ship.hull.skills)) {
        skills[skill] = Math.max(skills[skill] || 0, level);
    }
    
    // Add propulsion skills
    for (const [skill, level] of Object.entries(ship.propulsion.skills)) {
        skills[skill] = Math.max(skills[skill] || 0, level);
    }
    
    // Add power skills
    for (const [skill, level] of Object.entries(ship.power.skills)) {
        skills[skill] = Math.max(skills[skill] || 0, level);
    }
    
    // Add shield skills
    for (const [skill, level] of Object.entries(ship.shields.skills)) {
        skills[skill] = Math.max(skills[skill] || 0, level);
    }
    
    // Add weapon skills
    for (const weapon of ship.weapons) {
        for (const [skill, level] of Object.entries(weapon.skills)) {
            skills[skill] = Math.max(skills[skill] || 0, level);
        }
    }
    
    // Add life support skills
    for (const ls of ship.lifeSupport) {
        for (const [skill, level] of Object.entries(ls.skills)) {
            skills[skill] = Math.max(skills[skill] || 0, level);
        }
    }
    
    return skills;
}

/**
 * Calculate total labor hours for a ship
 * @param {string} shipClass - Ship class
 * @returns {number} Total labor hours
 */
export function calculateShipLabor(shipClass) {
    const ship = SHIP_REQUIREMENTS[shipClass];
    if (!ship) return 0;
    
    let total = ship.hull.laborHours;
    total += ship.propulsion.laborHours;
    total += ship.power.laborHours;
    total += ship.shields.laborHours;
    
    for (const weapon of ship.weapons) {
        total += weapon.laborHours;
    }
    
    for (const ls of ship.lifeSupport) {
        total += ls.laborHours;
    }
    
    return total;
}

/**
 * Calculate total value of a ship
 * @param {string} shipClass - Ship class
 * @returns {number} Total value
 */
export function calculateShipValue(shipClass) {
    const ship = SHIP_REQUIREMENTS[shipClass];
    if (!ship) return 0;
    
    let total = ship.hull.value;
    total += ship.propulsion.value;
    total += ship.power.value;
    total += ship.shields.value;
    
    for (const weapon of ship.weapons) {
        total += weapon.value;
    }
    
    for (const ls of ship.lifeSupport) {
        total += ls.value;
    }
    
    return total;
}

/**
 * Check if player meets skill requirements for a ship
 * @param {string} shipClass - Ship class
 * @param {Object} playerSkills - Player's skill levels
 * @returns {Object} Skill check result
 */
export function checkShipSkills(shipClass, playerSkills) {
    const required = calculateShipSkills(shipClass);
    const result = {
        qualified: true,
        missing: {},
        requirements: required
    };
    
    for (const [skill, requiredLevel] of Object.entries(required)) {
        const playerLevel = playerSkills[skill] || 0;
        if (playerLevel < requiredLevel) {
            result.qualified = false;
            result.missing[skill] = {
                required: requiredLevel,
                current: playerLevel
            };
        }
    }
    
    return result;
}

/**
 * Format ship requirements for display
 * @param {string} shipClass - Ship class
 * @returns {Object} Formatted requirements
 */
export function formatShipRequirements(shipClass) {
    const ship = SHIP_REQUIREMENTS[shipClass];
    if (!ship) return null;
    
    return {
        name: ship.name,
        tier: ship.tier,
        description: ship.description,
        crew: ship.crew,
        cargo: ship.cargo,
        range: ship.range,
        speed: ship.speed,
        value: ship.value,
        materials: calculateShipMaterials(shipClass),
        skills: calculateShipSkills(shipClass),
        labor: calculateShipLabor(shipClass),
        components: {
            hull: ship.hull.name,
            propulsion: ship.propulsion.name,
            power: ship.power.name,
            shields: ship.shields.name,
            weapons: ship.weapons.map(w => w.name),
            lifeSupport: ship.lifeSupport.map(ls => ls.name)
        }
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    SHIP_CLASSES,
    SHIP_TIERS,
    HULL_COMPONENTS,
    PROPULSION_COMPONENTS,
    POWER_COMPONENTS,
    SHIELD_COMPONENTS,
    WEAPON_COMPONENTS,
    LIFE_SUPPORT_COMPONENTS,
    SHIP_REQUIREMENTS,
    calculateShipMaterials,
    calculateShipSkills,
    calculateShipLabor,
    calculateShipValue,
    checkShipSkills,
    formatShipRequirements
};

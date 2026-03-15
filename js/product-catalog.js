// js/product-catalog.js - Complete Product Database
// Contains all purchasable items: ships, equipment, infrastructure, and upgrades

// ===== PRODUCT CATALOG =====

export const PRODUCT_CATALOG = {
    // ===== SHIPS =====
    // Frigate Class
    'ship_frigate_basic': {
        id: 'ship_frigate_basic',
        name: 'Starlight Frigate',
        class: 'Frigate',
        category: 'Ships',
        basePrice: 2000000,
        mass: 2000,
        crew: 10,
        description: 'A reliable entry-level frigate for the aspiring captain. Perfect for cargo runs and light exploration.',
        icon: '🚀',
        tier: 1,
        specs: {
            cargoCapacity: 2000,
            maxSpeed: '0.5c',
            weaponSlots: 2,
            shieldStrength: 500,
            hullIntegrity: 1000,
            warpCapable: true,
            warpRange: '5 LY'
        },
        skillRequirements: {
            'Shipbuilding': 100,
            'Basic Alloys': 50
        },
        laborPoolContribution: 1000000,
        inStock: true
    },
    
    'ship_frigate_combat': {
        id: 'ship_frigate_combat',
        name: 'Vanguard Frigate',
        class: 'Frigate',
        category: 'Ships',
        basePrice: 2500000,
        mass: 2200,
        crew: 15,
        description: 'A combat-oriented frigate with enhanced weapons and shields. Ready for action.',
        icon: '⚔️',
        tier: 1,
        specs: {
            cargoCapacity: 1500,
            maxSpeed: '0.55c',
            weaponSlots: 4,
            shieldStrength: 800,
            hullIntegrity: 1200,
            warpCapable: true,
            warpRange: '4 LY'
        },
        skillRequirements: {
            'Shipbuilding': 150,
            'Basic Alloys': 75,
            'Weapons': 50
        },
        laborPoolContribution: 1250000,
        inStock: true
    },
    
    'ship_frigate_science': {
        id: 'ship_frigate_science',
        name: 'Pathfinder Frigate',
        class: 'Frigate',
        category: 'Ships',
        basePrice: 2200000,
        mass: 1900,
        crew: 12,
        description: 'A science vessel equipped with advanced sensors and research facilities.',
        icon: '🔬',
        tier: 1,
        specs: {
            cargoCapacity: 1800,
            maxSpeed: '0.52c',
            weaponSlots: 1,
            shieldStrength: 600,
            hullIntegrity: 1100,
            warpCapable: true,
            warpRange: '6 LY',
            sensorStrength: 'Advanced'
        },
        skillRequirements: {
            'Shipbuilding': 120,
            'Electronics': 80,
            'Sensors': 60
        },
        laborPoolContribution: 1100000,
        inStock: true
    },
    
    // Destroyer Class
    'ship_destroyer_basic': {
        id: 'ship_destroyer_basic',
        name: 'Thunderbolt Destroyer',
        class: 'Destroyer',
        category: 'Ships',
        basePrice: 10000000,
        mass: 10000,
        crew: 50,
        description: 'A powerful destroyer capable of extended operations and serious firepower.',
        icon: '⚡',
        tier: 2,
        specs: {
            cargoCapacity: 5000,
            maxSpeed: '0.6c',
            weaponSlots: 6,
            shieldStrength: 2000,
            hullIntegrity: 5000,
            warpCapable: true,
            warpRange: '10 LY'
        },
        skillRequirements: {
            'Shipbuilding': 300,
            'Metallurgy': 200,
            'Propulsion': 150,
            'Weapons': 150
        },
        laborPoolContribution: 5000000,
        inStock: true
    },
    
    'ship_destroyer_assault': {
        id: 'ship_destroyer_assault',
        name: 'Hammerhead Destroyer',
        class: 'Destroyer',
        category: 'Ships',
        basePrice: 12000000,
        mass: 11000,
        crew: 60,
        description: 'Heavily armed assault destroyer with reinforced armor and advanced targeting.',
        icon: '🔨',
        tier: 2,
        specs: {
            cargoCapacity: 4000,
            maxSpeed: '0.58c',
            weaponSlots: 8,
            shieldStrength: 2500,
            hullIntegrity: 6000,
            warpCapable: true,
            warpRange: '8 LY'
        },
        skillRequirements: {
            'Shipbuilding': 350,
            'Metallurgy': 250,
            'Weapons': 200,
            'Shields': 150
        },
        laborPoolContribution: 6000000,
        inStock: true
    },
    
    // Cruiser Class
    'ship_cruiser_basic': {
        id: 'ship_cruiser_basic',
        name: 'Star Cruiser',
        class: 'Cruiser',
        category: 'Ships',
        basePrice: 50000000,
        mass: 50000,
        crew: 200,
        description: 'A massive cruiser capable of fleet command and extended campaigns.',
        icon: '🛡️',
        tier: 3,
        specs: {
            cargoCapacity: 20000,
            maxSpeed: '0.65c',
            weaponSlots: 12,
            shieldStrength: 8000,
            hullIntegrity: 20000,
            warpCapable: true,
            warpRange: '20 LY'
        },
        skillRequirements: {
            'Shipbuilding': 600,
            'Metallurgy': 400,
            'Propulsion': 300,
            'Weapons': 250,
            'Shields': 250,
            'Electronics': 200
        },
        laborPoolContribution: 25000000,
        inStock: true
    },
    
    'ship_cruiser_carrier': {
        id: 'ship_cruiser_carrier',
        name: 'Constellation Carrier',
        class: 'Cruiser',
        category: 'Ships',
        basePrice: 60000000,
        mass: 60000,
        crew: 300,
        description: 'A carrier variant with fighter bays and extensive support facilities.',
        icon: '✈️',
        tier: 3,
        specs: {
            cargoCapacity: 30000,
            maxSpeed: '0.6c',
            weaponSlots: 8,
            fighterCapacity: 24,
            shieldStrength: 7000,
            hullIntegrity: 25000,
            warpCapable: true,
            warpRange: '18 LY'
        },
        skillRequirements: {
            'Shipbuilding': 700,
            'Metallurgy': 400,
            'Composites': 300,
            'Robotics': 250,
            'Electronics': 250
        },
        laborPoolContribution: 30000000,
        inStock: true
    },
    
    // Dreadnought Class
    'ship_dreadnought_basic': {
        id: 'ship_dreadnought_basic',
        name: 'Titan Dreadnought',
        class: 'Dreadnought',
        category: 'Ships',
        basePrice: 250000000,
        mass: 250000,
        crew: 1000,
        description: 'The ultimate expression of naval power. A dreadnought that can single-handedly turn the tide of battle.',
        icon: '⚔️',
        tier: 4,
        specs: {
            cargoCapacity: 100000,
            maxSpeed: '0.7c',
            weaponSlots: 24,
            shieldStrength: 50000,
            hullIntegrity: 100000,
            warpCapable: true,
            warpRange: '50 LY'
        },
        skillRequirements: {
            'Shipbuilding': 1000,
            'Metallurgy': 800,
            'Propulsion': 600,
            'Weapons': 500,
            'Shields': 500,
            'Advanced Composites': 400,
            'Nanomaterials': 300
        },
        laborPoolContribution: 125000000,
        inStock: true
    },
    
    // ===== EQUIPMENT =====
    // Mining Equipment
    'mining_laser_basic': {
        id: 'mining_laser_basic',
        name: 'Basic Mining Laser',
        category: 'Equipment',
        equipmentType: 'Mining',
        basePrice: 50000,
        description: 'A standard mining laser for asteroid extraction. Gets the job done.',
        icon: '⛏️',
        tier: 1,
        specs: {
            miningSpeed: '1.0x',
            range: '500m',
            powerDraw: '50 MW',
            efficiency: '75%'
        },
        skillRequirements: {
            'Optics': 30,
            'Basic Alloys': 20
        },
        laborPoolContribution: 25000,
        inStock: true
    },
    
    'mining_laser_advanced': {
        id: 'mining_laser_advanced',
        name: 'Advanced Mining Laser',
        category: 'Equipment',
        equipmentType: 'Mining',
        basePrice: 150000,
        description: 'High-powered mining laser with improved efficiency and range.',
        icon: '⚡',
        tier: 2,
        specs: {
            miningSpeed: '2.0x',
            range: '1000m',
            powerDraw: '100 MW',
            efficiency: '90%'
        },
        skillRequirements: {
            'Optics': 100,
            'Advanced Composites': 50,
            'Thermodynamics': 50
        },
        laborPoolContribution: 75000,
        inStock: true
    },
    
    'mining_drone_system': {
        id: 'mining_drone_system',
        name: 'Automated Mining Drones',
        category: 'Equipment',
        equipmentType: 'Mining',
        basePrice: 300000,
        description: 'A swarm of autonomous mining drones for maximum resource extraction.',
        icon: '🤖',
        tier: 3,
        specs: {
            miningSpeed: '3.0x',
            droneCount: 5,
            automation: 'Full',
            efficiency: '95%'
        },
        skillRequirements: {
            'Robotics': 150,
            'AI': 100,
            'Nanomaterials': 80
        },
        laborPoolContribution: 150000,
        inStock: true
    },
    
    // Propulsion Upgrades
    'warp_drive_mk1': {
        id: 'warp_drive_mk1',
        name: 'Warp Drive MK I',
        category: 'Ship Upgrades',
        equipmentType: 'Propulsion',
        basePrice: 100000,
        description: 'Basic warp drive enabling faster-than-light travel.',
        icon: '🚀',
        tier: 1,
        specs: {
            warpSpeed: '1.0x',
            range: '10 LY',
            cooldown: '10 min',
            powerDraw: '200 MW'
        },
        skillRequirements: {
            'Propulsion': 50,
            'Physics': 30
        },
        laborPoolContribution: 50000,
        inStock: true
    },
    
    'warp_drive_mk2': {
        id: 'warp_drive_mk2',
        name: 'Warp Drive MK II',
        category: 'Ship Upgrades',
        equipmentType: 'Propulsion',
        basePrice: 500000,
        description: 'Advanced warp drive with extended range and reduced cooldown.',
        icon: '✨',
        tier: 2,
        specs: {
            warpSpeed: '2.0x',
            range: '50 LY',
            cooldown: '5 min',
            powerDraw: '350 MW'
        },
        skillRequirements: {
            'Propulsion': 150,
            'Quantum Physics': 80,
            'Superalloys': 50
        },
        laborPoolContribution: 250000,
        inStock: true
    },
    
    'warp_drive_mk3': {
        id: 'warp_drive_mk3',
        name: 'Warp Drive MK III',
        category: 'Ship Upgrades',
        equipmentType: 'Propulsion',
        basePrice: 2000000,
        description: 'Quantum warp drive pushing the boundaries of physics.',
        icon: '🌌',
        tier: 3,
        specs: {
            warpSpeed: '5.0x',
            range: '200 LY',
            cooldown: '1 min',
            powerDraw: '500 MW'
        },
        skillRequirements: {
            'Propulsion': 300,
            'Exotic Matter': 150,
            'Quantum Physics': 120
        },
        laborPoolContribution: 1000000,
        inStock: true
    },
    
    'ion_thrusters': {
        id: 'ion_thrusters',
        name: 'Ion Thrusters',
        category: 'Ship Upgrades',
        equipmentType: 'Propulsion',
        basePrice: 75000,
        description: 'High-efficiency ion thrusters for improved sublight speed.',
        icon: '⚡',
        tier: 1,
        specs: {
            sublightSpeed: '1.5x',
            efficiency: '90%',
            powerDraw: '100 MW'
        },
        skillRequirements: {
            'Propulsion': 40,
            'Electronics': 30
        },
        laborPoolContribution: 37500,
        inStock: true
    },
    
    // Shield Systems
    'shield_generator_mk1': {
        id: 'shield_generator_mk1',
        name: 'Shield Generator MK I',
        category: 'Ship Upgrades',
        equipmentType: 'Shields',
        basePrice: 80000,
        description: 'Standard deflector shield system for basic protection.',
        icon: '🛡️',
        tier: 1,
        specs: {
            shieldStrength: '+500',
            rechargeRate: '50/s',
            powerDraw: '150 MW'
        },
        skillRequirements: {
            'Shields': 40,
            'Physics': 30
        },
        laborPoolContribution: 40000,
        inStock: true
    },
    
    'shield_generator_mk2': {
        id: 'shield_generator_mk2',
        name: 'Shield Generator MK II',
        category: 'Ship Upgrades',
        equipmentType: 'Shields',
        basePrice: 400000,
        description: 'Enhanced shield system with higher capacity and faster recharge.',
        icon: '✨',
        tier: 2,
        specs: {
            shieldStrength: '+2000',
            rechargeRate: '150/s',
            powerDraw: '300 MW'
        },
        skillRequirements: {
            'Shields': 120,
            'Advanced Composites': 60,
            'Power Systems': 50
        },
        laborPoolContribution: 200000,
        inStock: true
    },
    
    'shield_generator_mk3': {
        id: 'shield_generator_mk3',
        name: 'Quantum Shield Generator',
        category: 'Ship Upgrades',
        equipmentType: 'Shields',
        basePrice: 1500000,
        description: 'State-of-the-art quantum shielding technology.',
        icon: '🔮',
        tier: 3,
        specs: {
            shieldStrength: '+10000',
            rechargeRate: '500/s',
            powerDraw: '600 MW',
            quantumEncryption: true
        },
        skillRequirements: {
            'Shields': 250,
            'Quantum Physics': 150,
            'Nanomaterials': 100
        },
        laborPoolContribution: 750000,
        inStock: true
    },
    
    // Weapon Systems
    'laser_cannon_basic': {
        id: 'laser_cannon_basic',
        name: 'Laser Cannon',
        category: 'Ship Upgrades',
        equipmentType: 'Weapons',
        basePrice: 60000,
        description: 'Standard laser weapon system for defensive purposes.',
        icon: '🔫',
        tier: 1,
        specs: {
            damage: 100,
            range: '2km',
            fireRate: '2/s',
            powerDraw: '80 MW'
        },
        skillRequirements: {
            'Weapons': 30,
            'Optics': 20
        },
        laborPoolContribution: 30000,
        inStock: true
    },
    
    'plasma_cannon': {
        id: 'plasma_cannon',
        name: 'Plasma Cannon',
        category: 'Ship Upgrades',
        equipmentType: 'Weapons',
        basePrice: 300000,
        description: 'High-energy plasma weapon for devastating firepower.',
        icon: '🔥',
        tier: 2,
        specs: {
            damage: 500,
            range: '3km',
            fireRate: '0.5/s',
            powerDraw: '300 MW'
        },
        skillRequirements: {
            'Weapons': 100,
            'Thermodynamics': 60,
            'Superalloys': 40
        },
        laborPoolContribution: 150000,
        inStock: true
    },
    
    'railgun': {
        id: 'railgun',
        name: 'Railgun',
        category: 'Ship Upgrades',
        equipmentType: 'Weapons',
        basePrice: 600000,
        description: 'Kinetic weapon firing projectiles at relativistic speeds.',
        icon: '⚡',
        tier: 3,
        specs: {
            damage: 1000,
            range: '5km',
            fireRate: '0.2/s',
            powerDraw: '500 MW'
        },
        skillRequirements: {
            'Weapons': 150,
            'Metallurgy': 100,
            'Electromagnetics': 80
        },
        laborPoolContribution: 300000,
        inStock: true
    },
    
    'missile_launcher': {
        id: 'missile_launcher',
        name: 'Missile Launcher System',
        category: 'Ship Upgrades',
        equipmentType: 'Weapons',
        basePrice: 400000,
        description: 'Guided missile system for precision strikes.',
        icon: '🎯',
        tier: 2,
        specs: {
            damage: 800,
            range: '10km',
            guidance: 'Advanced',
            ammo: 'Missiles'
        },
        skillRequirements: {
            'Weapons': 80,
            'Electronics': 60,
            'Propulsion': 40
        },
        laborPoolContribution: 200000,
        inStock: true
    },
    
    // Cargo Upgrades
    'cargo_expander_basic': {
        id: 'cargo_expander_basic',
        name: 'Cargo Hold Expander',
        category: 'Ship Upgrades',
        equipmentType: 'Cargo',
        basePrice: 100000,
        description: 'Increases cargo capacity by 50%.',
        icon: '📦',
        tier: 1,
        specs: {
            capacityIncrease: '+50%',
            massPenalty: '+10%'
        },
        skillRequirements: {
            'Metallurgy': 40,
            'Materials Science': 30
        },
        laborPoolContribution: 50000,
        inStock: true
    },
    
    'cargo_expander_advanced': {
        id: 'cargo_expander_advanced',
        name: 'Advanced Cargo System',
        category: 'Ship Upgrades',
        equipmentType: 'Cargo',
        basePrice: 400000,
        description: 'Advanced cargo management system with 100% capacity increase.',
        icon: '📦',
        tier: 2,
        specs: {
            capacityIncrease: '+100%',
            massPenalty: '+5%',
            automation: 'Automated sorting'
        },
        skillRequirements: {
            'Metallurgy': 80,
            'Composites': 60,
            'Robotics': 40
        },
        laborPoolContribution: 200000,
        inStock: true
    },
    
    // Life Support
    'life_support_basic': {
        id: 'life_support_basic',
        name: 'Life Support System',
        category: 'Ship Upgrades',
        equipmentType: 'Life Support',
        basePrice: 75000,
        description: 'Essential life support for extended missions.',
        icon: '💨',
        tier: 1,
        specs: {
            duration: '30 days',
            crew: '10',
            recycling: 'Basic'
        },
        skillRequirements: {
            'Chemistry': 30,
            'Engineering': 20
        },
        laborPoolContribution: 37500,
        inStock: true
    },
    
    'life_support_advanced': {
        id: 'life_support_advanced',
        name: 'Advanced Life Support',
        category: 'Ship Upgrades',
        equipmentType: 'Life Support',
        basePrice: 300000,
        description: 'Advanced closed-loop life support with 90% recycling.',
        icon: '🌱',
        tier: 2,
        specs: {
            duration: 'Indefinite',
            crew: '50',
            recycling: '90%',
            hydroponics: true
        },
        skillRequirements: {
            'Chemistry': 80,
            'Biology': 50,
            'Engineering': 40
        },
        laborPoolContribution: 150000,
        inStock: true
    },
    
    // ===== INFRASTRUCTURE =====
    // Space Stations
    'space_station_basic': {
        id: 'space_station_basic',
        name: 'Orbital Platform',
        category: 'Infrastructure',
        infrastructureType: 'Space Stations',
        basePrice: 10000000,
        description: 'A basic orbital platform for trade and refueling.',
        icon: '🛸',
        tier: 1,
        specs: {
            capacity: '5000 tons',
            dockingPorts: 4,
            fuelStorage: '10000 units',
            habitation: '50 crew'
        },
        skillRequirements: {
            'Construction': 200,
            'Metallurgy': 150,
            'Life Support': 100
        },
        laborPoolContribution: 5000000,
        inStock: true
    },
    
    'space_station_commercial': {
        id: 'space_station_commercial',
        name: 'Commercial Station',
        category: 'Infrastructure',
        infrastructureType: 'Space Stations',
        basePrice: 50000000,
        description: 'A full-service commercial station with markets and facilities.',
        icon: '🏪',
        tier: 2,
        specs: {
            capacity: '50000 tons',
            dockingPorts: 20,
            fuelStorage: '50000 units',
            habitation: '500 crew',
            marketSlots: 10,
            manufacturing: 'Light'
        },
        skillRequirements: {
            'Construction': 400,
            'Metallurgy': 300,
            'Composites': 200,
            'Power Systems': 150
        },
        laborPoolContribution: 25000000,
        inStock: true
    },
    
    // Shipyards
    'shipyard_small': {
        id: 'shipyard_small',
        name: 'Small Shipyard',
        category: 'Infrastructure',
        infrastructureType: 'Shipyards',
        basePrice: 20000000,
        description: 'A small shipyard capable of building frigates and destroyers.',
        icon: '🚢',
        tier: 1,
        specs: {
            maxShipClass: 'Destroyer',
            buildSpeed: '1.0x',
            dryDocks: 2,
            materialStorage: '100000 tons'
        },
        skillRequirements: {
            'Shipbuilding': 300,
            'Construction': 200,
            'Metallurgy': 200
        },
        laborPoolContribution: 10000000,
        inStock: true
    },
    
    'shipyard_large': {
        id: 'shipyard_large',
        name: 'Imperial Shipyard',
        category: 'Infrastructure',
        infrastructureType: 'Shipyards',
        basePrice: 100000000,
        description: 'A massive shipyard capable of constructing capital ships.',
        icon: '🏭',
        tier: 2,
        specs: {
            maxShipClass: 'Dreadnought',
            buildSpeed: '2.0x',
            dryDocks: 8,
            materialStorage: '1000000 tons',
            researchFacilities: true
        },
        skillRequirements: {
            'Shipbuilding': 600,
            'Construction': 500,
            'Metallurgy': 400,
            'Robotics': 300
        },
        laborPoolContribution: 50000000,
        inStock: true
    },
    
    // Factories
    'factory_processing': {
        id: 'factory_processing',
        name: 'Material Processing Plant',
        category: 'Infrastructure',
        infrastructureType: 'Factories',
        basePrice: 15000000,
        description: 'Processes raw materials into refined components.',
        icon: '🏭',
        tier: 1,
        specs: {
            processingSpeed: '1.0x',
            efficiency: '80%',
            materialTypes: 'Basic'
        },
        skillRequirements: {
            'Metallurgy': 200,
            'Chemistry': 150,
            'Engineering': 100
        },
        laborPoolContribution: 7500000,
        inStock: true
    },
    
    'factory_advanced': {
        id: 'factory_advanced',
        name: 'Advanced Manufacturing Complex',
        category: 'Infrastructure',
        infrastructureType: 'Factories',
        basePrice: 60000000,
        description: 'High-tech manufacturing for advanced components.',
        icon: '⚙️',
        tier: 2,
        specs: {
            processingSpeed: '3.0x',
            efficiency: '95%',
            materialTypes: 'All',
            nanofabrication: true
        },
        skillRequirements: {
            'Metallurgy': 400,
            'Chemistry': 300,
            'Nanomaterials': 200,
            'Robotics': 150
        },
        laborPoolContribution: 30000000,
        inStock: true
    },
    
    // Research Facilities
    'research_lab_basic': {
        id: 'research_lab_basic',
        name: 'Research Laboratory',
        category: 'Infrastructure',
        infrastructureType: 'Research',
        basePrice: 20000000,
        description: 'A basic research lab for scientific discovery.',
        icon: '🔬',
        tier: 1,
        specs: {
            researchSpeed: '1.0x',
            disciplines: 'Basic',
            scientistCapacity: 20
        },
        skillRequirements: {
            'Electronics': 200,
            'Physics': 150,
            'Chemistry': 150
        },
        laborPoolContribution: 10000000,
        inStock: true
    },
    
    'research_lab_quantum': {
        id: 'research_lab_quantum',
        name: 'Quantum Research Institute',
        category: 'Infrastructure',
        infrastructureType: 'Research',
        basePrice: 100000000,
        description: 'Cutting-edge research facility for quantum physics and exotic matter.',
        icon: '⚛️',
        tier: 2,
        specs: {
            researchSpeed: '5.0x',
            disciplines: 'All',
            scientistCapacity: 100,
            quantumComputer: true
        },
        skillRequirements: {
            'Quantum Physics': 500,
            'Exotic Matter': 300,
            'Nanomaterials': 300,
            'AI': 200
        },
        laborPoolContribution: 50000000,
        inStock: true
    },
    
    // Mining Infrastructure
    'mining_base': {
        id: 'mining_base',
        name: 'Asteroid Mining Base',
        category: 'Infrastructure',
        infrastructureType: 'Mining',
        basePrice: 25000000,
        description: 'A self-sufficient mining base for asteroid extraction.',
        icon: '⛏️',
        tier: 1,
        specs: {
            miningRate: '1000 tons/day',
            storage: '50000 tons',
            drones: 10,
            refinery: 'Basic'
        },
        skillRequirements: {
            'Mining': 200,
            'Metallurgy': 150,
            'Robotics': 100
        },
        laborPoolContribution: 12500000,
        inStock: true
    },
    
    'mining_colony': {
        id: 'mining_colony',
        name: 'Deep Space Mining Colony',
        category: 'Infrastructure',
        infrastructureType: 'Mining',
        basePrice: 100000000,
        description: 'A full-scale mining colony with advanced extraction and processing.',
        icon: '🏘️',
        tier: 2,
        specs: {
            miningRate: '10000 tons/day',
            storage: '500000 tons',
            drones: 50,
            refinery: 'Advanced',
            population: 1000
        },
        skillRequirements: {
            'Mining': 400,
            'Metallurgy': 300,
            'Robotics': 250,
            'Life Support': 200
        },
        laborPoolContribution: 50000000,
        inStock: true
    }
};

// ===== HELPER FUNCTIONS =====

/**
 * Get product by ID
 * @param {string} productId - Product ID
 * @returns {Object|null} Product object or null
 */
export function getProductById(productId) {
    return PRODUCT_CATALOG[productId] || null;
}

/**
 * Get products by category
 * @param {string} category - Category name ('Ships', 'Equipment', 'Ship Upgrades', 'Infrastructure')
 * @returns {Array} Products in category
 */
export function getProductsByCategory(category) {
    return Object.values(PRODUCT_CATALOG).filter(p => p.category === category);
}

/**
 * Get products by class (for ships)
 * @param {string} shipClass - Ship class ('Frigate', 'Destroyer', 'Cruiser', 'Dreadnought')
 * @returns {Array} Ships in class
 */
export function getShipsByClass(shipClass) {
    return Object.values(PRODUCT_CATALOG).filter(p => p.category === 'Ships' && p.class === shipClass);
}

/**
 * Get products by equipment type
 * @param {string} equipmentType - Equipment type
 * @returns {Array} Equipment of that type
 */
export function getEquipmentByType(equipmentType) {
    return Object.values(PRODUCT_CATALOG).filter(p => 
        (p.category === 'Equipment' || p.category === 'Ship Upgrades') && 
        p.equipmentType === equipmentType
    );
}

/**
 * Get products by infrastructure type
 * @param {string} infraType - Infrastructure type
 * @returns {Array} Infrastructure of that type
 */
export function getInfrastructureByType(infraType) {
    return Object.values(PRODUCT_CATALOG).filter(p => 
        p.category === 'Infrastructure' && p.infrastructureType === infraType
    );
}

/**
 * Get products by tier
 * @param {number} tier - Tier (1-4)
 * @returns {Array} Products of that tier
 */
export function getProductsByTier(tier) {
    return Object.values(PRODUCT_CATALOG).filter(p => p.tier === tier);
}

/**
 * Get products within price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Array} Products within price range
 */
export function getProductsByPriceRange(minPrice, maxPrice) {
    return Object.values(PRODUCT_CATALOG).filter(p => 
        p.basePrice >= minPrice && p.basePrice <= maxPrice
    );
}

/**
 * Search products by name or description
 * @param {string} query - Search query
 * @returns {Array} Matching products
 */
export function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return Object.values(PRODUCT_CATALOG).filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Get all product categories
 * @returns {Object} Categories with counts
 */
export function getProductCategories() {
    const categories = {
        Ships: 0,
        Equipment: 0,
        'Ship Upgrades': 0,
        Infrastructure: 0
    };
    
    Object.values(PRODUCT_CATALOG).forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1;
    });
    
    return categories;
}

/**
 * Get product stats
 * @returns {Object} Product statistics
 */
export function getProductStats() {
    const ships = Object.values(PRODUCT_CATALOG).filter(p => p.category === 'Ships');
    const equipment = Object.values(PRODUCT_CATALOG).filter(p => p.category === 'Equipment' || p.category === 'Ship Upgrades');
    const infrastructure = Object.values(PRODUCT_CATALOG).filter(p => p.category === 'Infrastructure');
    
    const totalValue = Object.values(PRODUCT_CATALOG).reduce((sum, p) => sum + p.basePrice, 0);
    
    return {
        totalProducts: Object.keys(PRODUCT_CATALOG).length,
        shipCount: ships.length,
        equipmentCount: equipment.length,
        infrastructureCount: infrastructure.length,
        totalValue: totalValue,
        averageShipPrice: ships.length > 0 ? ships.reduce((sum, s) => sum + s.basePrice, 0) / ships.length : 0,
        highestPrice: Math.max(...Object.values(PRODUCT_CATALOG).map(p => p.basePrice))
    };
}

/**
 * Get products requiring specific skill
 * @param {string} skillName - Skill name
 * @returns {Array} Products requiring that skill
 */
export function getProductsRequiringSkill(skillName) {
    return Object.values(PRODUCT_CATALOG).filter(p => 
        p.skillRequirements && p.skillRequirements[skillName]
    );
}

/**
 * Calculate total labor pool contribution of all products
 * @returns {number} Total labor pool contribution
 */
export function getTotalLaborPoolContribution() {
    return Object.values(PRODUCT_CATALOG).reduce((sum, p) => sum + (p.laborPoolContribution || 0), 0);
}

/**
 * Get products that contribute most to labor pool
 * @param {number} limit - Number of products to return
 * @returns {Array} Top contributing products
 */
export function getTopLaborContributors(limit = 10) {
    return Object.values(PRODUCT_CATALOG)
        .sort((a, b) => (b.laborPoolContribution || 0) - (a.laborPoolContribution || 0))
        .slice(0, limit);
}

// ===== EXPORT ALL =====
export default {
    PRODUCT_CATALOG,
    getProductById,
    getProductsByCategory,
    getShipsByClass,
    getEquipmentByType,
    getInfrastructureByType,
    getProductsByTier,
    getProductsByPriceRange,
    searchProducts,
    getProductCategories,
    getProductStats,
    getProductsRequiringSkill,
    getTotalLaborPoolContribution,
    getTopLaborContributors
};

// Attach to window for global access
window.PRODUCT_CATALOG = PRODUCT_CATALOG;
window.getProductById = getProductById;
window.getProductsByCategory = getProductsByCategory;
window.getShipsByClass = getShipsByClass;
window.getEquipmentByType = getEquipmentByType;
window.getInfrastructureByType = getInfrastructureByType;
window.getProductsByTier = getProductsByTier;
window.getProductsByPriceRange = getProductsByPriceRange;
window.searchProducts = searchProducts;
window.getProductCategories = getProductCategories;
window.getProductStats = getProductStats;
window.getProductsRequiringSkill = getProductsRequiringSkill;
window.getTotalLaborPoolContribution = getTotalLaborPoolContribution;
window.getTopLaborContributors = getTopLaborContributors;

console.log('✅ product-catalog.js loaded - Product database ready');

// js/crafting/fields/optical.js
// Optical Materials Recipes - 50+ recipes for lenses, fiber optics, lasers, and photonic materials
// Tier 1-7: From Basic Glass to Advanced Photonic Crystals

export const OPTICAL_RECIPES = {
    
    // ============================================================================
    // TIER 1: BASIC OPTICAL MATERIALS (8 recipes)
    // ============================================================================
    
    'Optical Glass': [
        {
            id: 'crown_glass',
            name: 'Crown Glass',
            formula: 'SiO₂ + Na₂O + CaO → Low Dispersion Glass',
            ingredients: { SiliconDioxide: 70, SodiumOxide: 15, CalciumOxide: 10 },
            field: 'optical',
            category: 'Optical Glass',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '🥃',
            unlocksAt: 0,
            value: 50,
            description: 'Low-dispersion glass for lenses and windows.',
            laborMultiplier: 1.3,
            usedIn: ['lenses', 'prisms', 'windows']
        },
        {
            id: 'flint_glass',
            name: 'Flint Glass',
            formula: 'SiO₂ + PbO + K₂O → High Dispersion Glass',
            ingredients: { SiliconDioxide: 50, Lead: 30, PotassiumOxide: 10 },
            field: 'optical',
            category: 'Optical Glass',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '💎',
            unlocksAt: 100,
            value: 80,
            description: 'High-dispersion glass for correcting chromatic aberration.',
            laborMultiplier: 1.4,
            usedIn: ['achromatic_lenses', 'prisms', 'optical_instruments']
        },
        {
            id: 'borosilicate_optical',
            name: 'Borosilicate Optical Glass',
            formula: 'SiO₂ + B₂O₃ + Na₂O → Low Expansion',
            ingredients: { SiliconDioxide: 60, Boron: 20, SodiumOxide: 10 },
            field: 'optical',
            category: 'Optical Glass',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '🔬',
            unlocksAt: 150,
            value: 70,
            description: 'Low thermal expansion glass for precision optics.',
            laborMultiplier: 1.4,
            usedIn: ['telescope_mirrors', 'lab_glassware', 'precision_optics']
        }
    ],
    
    'Polishing Materials': [
        {
            id: 'cerium_oxide',
            name: 'Cerium Oxide Polish',
            formula: 'CeO₂ + Binders → Optical Polish',
            ingredients: { Cerium: 20, Oxygen: 10, Binder: 2 },
            field: 'optical',
            category: 'Polishing Materials',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '✨',
            unlocksAt: 50,
            value: 40,
            description: 'Premium polishing compound for optical surfaces.',
            laborMultiplier: 1.2,
            usedIn: ['lens_polishing', 'mirror_finishing', 'precision_optics']
        },
        {
            id: 'alumina_polish',
            name: 'Alumina Polish',
            formula: 'Al₂O₃ + Water → Fine Abrasive',
            ingredients: { AluminumOxide: 25, Water: 10 },
            field: 'optical',
            category: 'Polishing Materials',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '⚪',
            unlocksAt: 25,
            value: 20,
            description: 'Fine aluminum oxide abrasive for optical polishing.',
            laborMultiplier: 1.1,
            usedIn: ['pre-polishing', 'lapping', 'finishing']
        },
        {
            id: 'pitch',
            name: 'Optical Pitch',
            formula: 'Natural Pitch + Rosin → Polishing Lap Material',
            ingredients: { PineTar: 20, Rosin: 10, Beeswax: 2 },
            field: 'optical',
            category: 'Polishing Materials',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '🕳️',
            unlocksAt: 75,
            value: 30,
            description: 'Traditional material for polishing laps.',
            laborMultiplier: 1.2,
            usedIn: ['lens_making', 'mirror_figuring', 'precision_optics']
        }
    ],
    
    // ============================================================================
    // TIER 2: LENSES & PRISMS (8 recipes)
    // ============================================================================
    
    'Simple Lenses': [
        {
            id: 'spherical_lens',
            name: 'Spherical Lens',
            formula: 'Glass + Grinding + Polishing → Lens',
            ingredients: { CrownGlass: 10, Grinding: 1, Polishing: 1 },
            field: 'optical',
            category: 'Simple Lenses',
            tier: 2,
            skillGain: 6,
            target: 200,
            icon: '🔍',
            unlocksAt: 300,
            value: 100,
            description: 'Basic spherical lens for focusing light.',
            laborMultiplier: 1.5,
            usedIn: ['magnifying_glasses', 'cameras', 'instruments']
        },
        {
            id: 'cylindrical_lens',
            name: 'Cylindrical Lens',
            formula: 'Glass + Cylindrical Grinding → Astigmatic Correction',
            ingredients: { FlintGlass: 12, PrecisionGrinding: 2 },
            field: 'optical',
            category: 'Simple Lenses',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '📏',
            unlocksAt: 400,
            value: 150,
            description: 'Cylindrical lens for astigmatism correction and beam shaping.',
            laborMultiplier: 1.6,
            usedIn: ['eyeglasses', 'laser_optics', 'beam_shaping']
        },
        {
            id: 'achromatic_doublet',
            name: 'Achromatic Doublet',
            formula: 'Crown Glass + Flint Glass → Color-Corrected',
            ingredients: { CrownGlass: 8, FlintGlass: 8, Cementing: 1 },
            field: 'optical',
            category: 'Simple Lenses',
            tier: 2,
            skillGain: 12,
            target: 200,
            icon: '🔬',
            unlocksAt: 500,
            value: 300,
            description: 'Two-element lens that corrects chromatic aberration.',
            laborMultiplier: 1.8,
            usedIn: ['telescopes', 'microscopes', 'cameras']
        }
    ],
    
    'Prisms': [
        {
            id: 'right_angle_prism',
            name: 'Right-Angle Prism',
            formula: 'Glass + Precision Cutting → 90° Prism',
            ingredients: { OpticalGlass: 15, Cutting: 2, Polishing: 2 },
            field: 'optical',
            category: 'Prisms',
            tier: 2,
            skillGain: 7,
            target: 200,
            icon: '📐',
            unlocksAt: 450,
            value: 120,
            description: 'Right-angle prism for reflecting and deviating light.',
            laborMultiplier: 1.6,
            usedIn: ['binoculars', 'periscopes', 'optical_instruments']
        },
        {
            id: 'porro_prism',
            name: 'Porro Prism',
            formula: 'Glass + Assembly → Image Erecting',
            ingredients: { OpticalGlass: 20, PrecisionCoating: 2, Assembly: 1 },
            field: 'optical',
            category: 'Prisms',
            tier: 2,
            skillGain: 10,
            target: 200,
            icon: '🔄',
            unlocksAt: 600,
            value: 200,
            description: 'Prism system for image erection in binoculars.',
            laborMultiplier: 1.7,
            usedIn: ['binoculars', 'riflescopes', 'instruments']
        },
        {
            id: 'roof_prism',
            name: 'Roof Prism',
            formula: 'Glass + Complex Surfaces → Compact Image Erection',
            ingredients: { OpticalGlass: 18, PrecisionGrinding: 3, Coating: 2 },
            field: 'optical',
            category: 'Prisms',
            tier: 2,
            skillGain: 12,
            target: 200,
            icon: '🏛️',
            unlocksAt: 700,
            value: 250,
            description: 'Compact prism design for lightweight binoculars.',
            laborMultiplier: 1.8,
            usedIn: ['compact_binoculars', 'rangefinders', 'sports_optics']
        }
    ],
    
    // ============================================================================
    // TIER 3: OPTICAL COATINGS (8 recipes)
    // ============================================================================
    
    'Anti-Reflective Coatings': [
        {
            id: 'mgf2_coating',
            name: 'MgF₂ Anti-Reflective Coating',
            formula: 'MgF₂ + Vacuum Deposition → Single Layer AR',
            ingredients: { Magnesium: 10, Fluorine: 10, VacuumDeposition: 1 },
            field: 'optical',
            category: 'Anti-Reflective Coatings',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '✨',
            unlocksAt: 1000,
            value: 80,
            description: 'Single-layer anti-reflective coating for lenses.',
            laborMultiplier: 1.7,
            usedIn: ['eyeglasses', 'camera_lenses', 'instruments']
        },
        {
            id: 'broadband_ar',
            name: 'Broadband Anti-Reflective Coating',
            formula: 'Multiple Layers + Dielectrics → Multi-layer AR',
            ingredients: { TiO2: 5, SiO2: 5, MgF2: 5, VacuumDeposition: 2 },
            field: 'optical',
            category: 'Anti-Reflective Coatings',
            tier: 3,
            skillGain: 18,
            target: 300,
            icon: '🌈',
            unlocksAt: 1200,
            value: 200,
            description: 'Multi-layer coating for minimal reflection across visible spectrum.',
            laborMultiplier: 2.0,
            usedIn: ['high_end_lenses', 'scientific_instruments', 'cameras']
        },
        {
            id: 'v_coating',
            name: 'V-Coating',
            formula: 'Dielectric Stack → Narrowband AR',
            ingredients: { SiO2: 8, Ta2O5: 8, VacuumDeposition: 2 },
            field: 'optical',
            category: 'Anti-Reflective Coatings',
            tier: 3,
            skillGain: 16,
            target: 300,
            icon: '📉',
            unlocksAt: 1100,
            value: 150,
            description: 'Narrowband coating for laser applications.',
            laborMultiplier: 1.9,
            usedIn: ['laser_optics', 'interferometry', 'telecom']
        }
    ],
    
    'Mirror Coatings': [
        {
            id: 'aluminum_mirror',
            name: 'Aluminum Mirror Coating',
            formula: 'Al + SiO₂ Overcoat → Protected Mirror',
            ingredients: { Aluminum: 15, SiliconDioxide: 5, VacuumDeposition: 1 },
            field: 'optical',
            category: 'Mirror Coatings',
            tier: 3,
            skillGain: 10,
            target: 300,
            icon: '🪞',
            unlocksAt: 800,
            value: 100,
            description: 'Protected aluminum coating for mirrors.',
            laborMultiplier: 1.6,
            usedIn: ['telescope_mirrors', 'laser_mirrors', 'optical_tables']
        },
        {
            id: 'silver_mirror',
            name: 'Silver Mirror Coating',
            formula: 'Ag + Cu + Paint → High Reflectivity',
            ingredients: { Silver: 20, Copper: 2, ProtectivePaint: 2 },
            field: 'optical',
            category: 'Mirror Coatings',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '🥈',
            unlocksAt: 900,
            value: 150,
            description: 'Highest reflectivity coating for visible light.',
            laborMultiplier: 1.7,
            usedIn: ['astronomical_mirrors', 'scientific_instruments']
        },
        {
            id: 'dielectric_mirror',
            name: 'Dielectric Mirror',
            formula: 'TiO₂ + SiO₂ Multilayers → >99.9% Reflectivity',
            ingredients: { TiO2: 15, SiO2: 15, VacuumDeposition: 3 },
            field: 'optical',
            category: 'Mirror Coatings',
            tier: 3,
            skillGain: 20,
            target: 300,
            icon: '💎',
            unlocksAt: 1500,
            value: 400,
            description: 'Dielectric stack mirror with ultra-high reflectivity.',
            laborMultiplier: 2.2,
            usedIn: ['laser_cavities', 'interferometers', 'quantum_optics']
        }
    ],
    
    // ============================================================================
    // TIER 4: FIBER OPTICS (8 recipes)
    // ============================================================================
    
    'Optical Fiber': [
        {
            id: 'silica_fiber_preform',
            name: 'Silica Fiber Preform',
            formula: 'SiCl₄ + GeCl₄ + O₂ → Doped Silica Rod',
            ingredients: { Silicon: 30, Germanium: 5, Oxygen: 40, Chlorine: 10 },
            field: 'optical',
            category: 'Optical Fiber',
            tier: 4,
            skillGain: 25,
            target: 400,
            icon: '🥫',
            unlocksAt: 2000,
            value: 300,
            description: 'Glass preform for drawing optical fiber.',
            laborMultiplier: 2.2,
            usedIn: ['fiber_drawing', 'telecom_fiber']
        },
        {
            id: 'single_mode_fiber',
            name: 'Single-Mode Fiber',
            formula: 'Preform + Drawing → 9µm Core Fiber',
            ingredients: { SilicaFiberPreform: 10, FiberDrawing: 1, Coating: 2 },
            field: 'optical',
            category: 'Optical Fiber',
            tier: 4,
            skillGain: 30,
            target: 400,
            icon: '📡',
            unlocksAt: 2200,
            value: 200,
            description: 'Single-mode optical fiber for long-distance telecom.',
            laborMultiplier: 2.5,
            usedIn: ['telecommunications', 'cable_tv', 'internet']
        },
        {
            id: 'multimode_fiber',
            name: 'Multi-Mode Fiber',
            formula: 'Preform + Large Core → 50µm Fiber',
            ingredients: { SilicaFiberPreform: 8, FiberDrawing: 1, Coating: 2 },
            field: 'optical',
            category: 'Optical Fiber',
            tier: 4,
            skillGain: 25,
            target: 400,
            icon: '📶',
            unlocksAt: 2100,
            value: 100,
            description: 'Multi-mode fiber for short-distance communication.',
            laborMultiplier: 2.2,
            usedIn: ['datacenters', 'lan', 'medical_imaging']
        }
    ],
    
    'Fiber Components': [
        {
            id: 'fiber_coupler',
            name: 'Fiber Coupler',
            formula: 'Fiber + Fused Taper → Splitter',
            ingredients: { SingleModeFiber: 10, Fusing: 2, Housing: 1 },
            field: 'optical',
            category: 'Fiber Components',
            tier: 4,
            skillGain: 28,
            target: 400,
            icon: '🔀',
            unlocksAt: 2500,
            value: 300,
            description: 'Fused fiber coupler for splitting light.',
            laborMultiplier: 2.4,
            usedIn: ['fiber_splitters', 'wdm', 'networks']
        },
        {
            id: 'fiber_bragg_grating',
            name: 'Fiber Bragg Grating',
            formula: 'Fiber + UV Exposure + Phase Mask → Wavelength Filter',
            ingredients: { SingleModeFiber: 5, UVLaser: 1, PhaseMask: 1 },
            field: 'optical',
            category: 'Fiber Components',
            tier: 4,
            skillGain: 35,
            target: 400,
            icon: '📊',
            unlocksAt: 3000,
            value: 500,
            description: 'In-fiber grating for wavelength filtering.',
            laborMultiplier: 2.8,
            usedIn: ['fiber_sensors', 'telecom_filters', 'lasers']
        },
        {
            id: 'fiber_optic_cable',
            name: 'Fiber Optic Cable',
            formula: 'Fibers + Strength Members + Jacket → Cable',
            ingredients: { SingleModeFiber: 24, Kevlar: 5, PVCJacket: 10 },
            field: 'optical',
            category: 'Fiber Components',
            tier: 4,
            skillGain: 22,
            target: 400,
            icon: '🔌',
            unlocksAt: 2300,
            value: 100,
            description: 'Complete fiber optic cable for installation.',
            laborMultiplier: 2.0,
            usedIn: ['undersea_cables', 'backbone_networks', 'ftth']
        }
    ],
    
    // ============================================================================
    // TIER 5: LASER MATERIALS (8 recipes)
    // ============================================================================
    
    'Laser Crystals': [
        {
            id: 'nd_yag_crystal',
            name: 'Nd:YAG Crystal',
            formula: 'Y₃Al₅O₁₂ + Nd₂O₃ → Laser Rod',
            ingredients: { Yttrium: 30, Aluminum: 25, Oxygen: 40, Neodymium: 3 },
            field: 'optical',
            category: 'Laser Crystals',
            tier: 5,
            skillGain: 40,
            target: 500,
            icon: '💎',
            unlocksAt: 4000,
            value: 1000,
            description: 'Neodymium-doped YAG crystal for solid-state lasers.',
            laborMultiplier: 3.0,
            usedIn: ['industrial_lasers', 'military_lasers', 'medical_lasers']
        },
        {
            id: 'ti_sapphire_crystal',
            name: 'Ti:Sapphire Crystal',
            formula: 'Al₂O₃ + Ti₂O₃ → Tunable Laser',
            ingredients: { Aluminum: 40, Oxygen: 50, Titanium: 5 },
            field: 'optical',
            category: 'Laser Crystals',
            tier: 5,
            skillGain: 45,
            target: 500,
            icon: '💜',
            unlocksAt: 5000,
            value: 2000,
            description: 'Titanium-doped sapphire for tunable ultrafast lasers.',
            laborMultiplier: 3.5,
            usedIn: ['femtosecond_lasers', 'scientific_lasers', 'amplifiers']
        },
        {
            id: 'ruby_laser_rod',
            name: 'Ruby Laser Rod',
            formula: 'Al₂O₃ + Cr₂O₃ → First Laser',
            ingredients: { Aluminum: 40, Oxygen: 50, Chromium: 3 },
            field: 'optical',
            category: 'Laser Crystals',
            tier: 5,
            skillGain: 35,
            target: 500,
            icon: '🔴',
            unlocksAt: 4500,
            value: 800,
            description: 'Chromium-doped ruby for pulsed lasers.',
            laborMultiplier: 2.8,
            usedIn: ['holography', 'tattoo_removal', 'historical']
        }
    ],
    
    'Laser Diodes': [
        {
            id: 'gaas_wafer',
            name: 'GaAs Wafer',
            formula: 'Gallium + Arsenic → Semiconductor',
            ingredients: { Gallium: 30, Arsenic: 25 },
            field: 'optical',
            category: 'Laser Diodes',
            tier: 5,
            skillGain: 30,
            target: 500,
            icon: '💿',
            unlocksAt: 6000,
            value: 500,
            description: 'Gallium arsenide wafer for laser diodes.',
            laborMultiplier: 2.5,
            usedIn: ['laser_diodes', 'leds', 'high_speed_electronics']
        },
        {
            id: 'laser_diode_chip',
            name: 'Laser Diode Chip',
            formula: 'GaAs + Quantum Wells + Metallization → Emitter',
            ingredients: { GaAsWafer: 5, Epitaxy: 1, Metallization: 1 },
            field: 'optical',
            category: 'Laser Diodes',
            tier: 5,
            skillGain: 42,
            target: 500,
            icon: '💡',
            unlocksAt: 7000,
            value: 300,
            description: 'Semiconductor laser diode chip.',
            laborMultiplier: 3.2,
            usedIn: ['barcode_scanners', 'laser_pointers', 'fiber_communication']
        },
        {
            id: 'vcsel',
            name: 'VCSEL (Vertical-Cavity Surface-Emitting Laser)',
            formula: 'GaAs + DBR Mirrors + Oxide Aperture → Surface Emitter',
            ingredients: { GaAsWafer: 5, DBRMirrors: 2, Oxidation: 1 },
            field: 'optical',
            category: 'Laser Diodes',
            tier: 5,
            skillGain: 48,
            target: 500,
            icon: '⬆️',
            unlocksAt: 8000,
            value: 500,
            description: 'Surface-emitting laser for datacoms and sensors.',
            laborMultiplier: 3.5,
            usedIn: ['datacom', 'optical_mice', '3d_sensing']
        }
    ],
    
    // ============================================================================
    // TIER 6: NONLINEAR OPTICS (6 recipes)
    // ============================================================================
    
    'Nonlinear Crystals': [
        {
            id: 'bbo_crystal',
            name: 'BBO (Beta-Barium Borate)',
            formula: 'BaB₂O₄ → Nonlinear Crystal',
            ingredients: { Barium: 20, Boron: 25, Oxygen: 30 },
            field: 'optical',
            category: 'Nonlinear Crystals',
            tier: 6,
            skillGain: 50,
            target: 600,
            icon: '💎',
            unlocksAt: 10000,
            value: 2000,
            description: 'Nonlinear crystal for frequency doubling and parametric oscillation.',
            laborMultiplier: 3.8,
            usedIn: ['frequency_doubling', 'opos', 'quantum_optics']
        },
        {
            id: 'ln_crystal',
            name: 'Lithium Niobate (LiNbO₃)',
            formula: 'Li₂O + Nb₂O₅ → Electro-Optic Crystal',
            ingredients: { Lithium: 15, Niobium: 30, Oxygen: 35 },
            field: 'optical',
            category: 'Nonlinear Crystals',
            tier: 6,
            skillGain: 45,
            target: 600,
            icon: '🔮',
            unlocksAt: 9000,
            value: 1500,
            description: 'Electro-optic crystal for modulators and waveguides.',
            laborMultiplier: 3.5,
            usedIn: ['electro-optic_modulators', 'waveguides', 'q_switches']
        },
        {
            id: 'ktp_crystal',
            name: 'KTP (Potassium Titanyl Phosphate)',
            formula: 'KTiOPO₄ → SHG Crystal',
            ingredients: { Potassium: 15, Titanium: 20, Phosphorus: 15, Oxygen: 35 },
            field: 'optical',
            category: 'Nonlinear Crystals',
            tier: 6,
            skillGain: 48,
            target: 600,
            icon: '🟢',
            unlocksAt: 9500,
            value: 1800,
            description: 'Nonlinear crystal for second harmonic generation.',
            laborMultiplier: 3.6,
            usedIn: ['green_lasers', 'frequency_doubling', 'opos']
        }
    ],
    
    'Q-Switches': [
        {
            id: 'acousto_optic_qswitch',
            name: 'Acousto-Optic Q-Switch',
            formula: 'TeO₂ + Transducer → AO Modulator',
            ingredients: { Tellurium: 20, Oxygen: 15, PiezoTransducer: 2 },
            field: 'optical',
            category: 'Q-Switches',
            tier: 6,
            skillGain: 42,
            target: 600,
            icon: '🔊',
            unlocksAt: 11000,
            value: 1200,
            description: 'Acousto-optic modulator for Q-switching lasers.',
            laborMultiplier: 3.4,
            usedIn: ['pulsed_lasers', 'industrial', 'medical']
        },
        {
            id: 'electro_optic_qswitch',
            name: 'Electro-Optic Q-Switch',
            formula: 'KD*P + Electrodes + Housing → Pockels Cell',
            ingredients: { KDP: 20, Electrodes: 2, Housing: 1 },
            field: 'optical',
            category: 'Q-Switches',
            tier: 6,
            skillGain: 46,
            target: 600,
            icon: '⚡',
            unlocksAt: 12000,
            value: 1500,
            description: 'Pockels cell for electro-optic Q-switching.',
            laborMultiplier: 3.6,
            usedIn: ['high_energy_lasers', 'scientific', 'military']
        }
    ],
    
    // ============================================================================
    // TIER 7: ADVANCED PHOTONICS (6 recipes)
    // ============================================================================
    
    'Photonic Crystals': [
        {
            id: 'photonic_crystal_fiber',
            name: 'Photonic Crystal Fiber',
            formula: 'Silica + Air Holes + Stack & Draw → Microstructured Fiber',
            ingredients: { Silica: 40, PrecisionStack: 2, FiberDrawing: 2 },
            field: 'optical',
            category: 'Photonic Crystals',
            tier: 7,
            skillGain: 60,
            target: 800,
            icon: '🌀',
            unlocksAt: 15000,
            value: 3000,
            description: 'Fiber with periodic air holes for novel optical properties.',
            laborMultiplier: 4.5,
            usedIn: ['supercontinuum', 'sensors', 'nonlinear_optics']
        },
        {
            id: 'photonic_crystal_slab',
            name: 'Photonic Crystal Slab',
            formula: 'SOI + Lithography + Etching → 2D Photonic Crystal',
            ingredients: { SiliconOnInsulator: 10, EBLLithography: 1, Etching: 1 },
            field: 'optical',
            category: 'Photonic Crystals',
            tier: 7,
            skillGain: 70,
            target: 800,
            icon: '💿',
            unlocksAt: 18000,
            value: 5000,
            description: '2D photonic crystal for integrated photonics.',
            laborMultiplier: 5.0,
            usedIn: ['integrated_photonics', 'quantum_computing', 'sensors']
        },
        {
            id: 'negative_index_metamaterial',
            name: 'Negative Index Metamaterial',
            formula: 'Split Ring Resonators + Wires → Left-Handed Material',
            ingredients: { Copper: 20, Dielectric: 15, NanoFabrication: 3 },
            field: 'optical',
            category: 'Photonic Crystals',
            tier: 7,
            skillGain: 90,
            target: 800,
            icon: '👻',
            unlocksAt: 25000,
            value: 20000,
            description: 'Metamaterial with negative refractive index.',
            laborMultiplier: 7.0,
            usedIn: ['superlenses', 'cloaking', 'perfect_absorbers']
        }
    ],
    
    'Quantum Optics': [
        {
            id: 'single_photon_source',
            name: 'Single Photon Source',
            formula: 'Quantum Dot + Cavity → Deterministic Source',
            ingredients: { QuantumDot: 3, Microcavity: 2, Cryostat: 1 },
            field: 'optical',
            category: 'Quantum Optics',
            tier: 7,
            skillGain: 85,
            target: 800,
            icon: '✨',
            unlocksAt: 30000,
            value: 10000,
            description: 'Source of individual photons for quantum optics.',
            laborMultiplier: 6.5,
            usedIn: ['quantum_computing', 'quantum_cryptography', 'foundational']
        },
        {
            id: 'entangled_photon_source',
            name: 'Entangled Photon Source',
            formula: 'Nonlinear Crystal + Pump → Entangled Pairs',
            ingredients: { BBO: 10, PumpLaser: 2, CoincidenceDetection: 2 },
            field: 'optical',
            category: 'Quantum Optics',
            tier: 7,
            skillGain: 95,
            target: 800,
            icon: '🔗',
            unlocksAt: 35000,
            value: 15000,
            description: 'Source of entangled photon pairs for quantum information.',
            laborMultiplier: 7.5,
            usedIn: ['quantum_communication', 'bell_tests', 'qkd']
        }
    ],
    
    // ============================================================================
    // ADDITIONAL: OPTICAL INSTRUMENTS (Helper recipes)
    // ============================================================================
    
    'Optical Instruments': [
        {
            id: 'microscope_objective',
            name: 'Microscope Objective',
            formula: 'Multiple Lenses + Housing → High-NA Objective',
            ingredients: { AchromaticDoublet: 5, FlintGlass: 3, Housing: 1 },
            field: 'optical',
            category: 'Optical Instruments',
            tier: 4,
            skillGain: 30,
            target: 400,
            icon: '🔬',
            unlocksAt: 3500,
            value: 800,
            description: 'High-quality microscope objective lens.',
            laborMultiplier: 2.5,
            usedIn: ['microscopy', 'imaging', 'scientific']
        },
        {
            id: 'telescope_eyepiece',
            name: 'Telescope Eyepiece',
            formula: 'Lens Group + Barrel → Eyepiece',
            ingredients: { CrownGlass: 8, FlintGlass: 5, Barrel: 1 },
            field: 'optical',
            category: 'Optical Instruments',
            tier: 3,
            skillGain: 20,
            target: 300,
            icon: '🔭',
            unlocksAt: 2000,
            value: 300,
            description: 'Eyepiece for astronomical telescopes.',
            laborMultiplier: 2.0,
            usedIn: ['astronomy', 'observation', 'spotting_scopes']
        },
        {
            id: 'interferometer',
            name: 'Michelson Interferometer',
            formula: 'Beamsplitter + Mirrors + Detector → Interferometer',
            ingredients: { Beamsplitter: 2, DielectricMirror: 2, Detector: 1, Baseplate: 1 },
            field: 'optical',
            category: 'Optical Instruments',
            tier: 5,
            skillGain: 45,
            target: 500,
            icon: '🔀',
            unlocksAt: 5500,
            value: 2000,
            description: 'Optical interferometer for precision measurement.',
            laborMultiplier: 3.2,
            usedIn: ['metrology', 'gravitational_waves', 'testing']
        }
    ]
};

// ============================================================================
// EXPORT ALL OPTICAL RECIPES
// ============================================================================

export default OPTICAL_RECIPES;

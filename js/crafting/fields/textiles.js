// js/crafting/fields/textiles.js
// Textiles & Fabrics Recipes - 60+ recipes for fibers, yarns, and fabrics
// Tier 1-7: From Natural Fibers to Smart Textiles

export const TEXTILES_RECIPES = {
    
    // ============================================================================
    // TIER 1: NATURAL FIBERS (10 recipes)
    // ============================================================================
    
    'Plant Fibers': [
        {
            id: 'cotton_fiber',
            name: 'Cotton Fiber',
            formula: 'Cotton Plant → Ginning → Fiber',
            ingredients: { CottonBolls: 10, Water: 5 },
            field: 'textiles',
            category: 'Plant Fibers',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '🌿',
            unlocksAt: 0,
            value: 15,
            description: 'Soft, breathable natural fiber for clothing.',
            laborMultiplier: 1.1,
            usedIn: ['cotton_yarn', 'fabric', 'clothing']
        },
        {
            id: 'flax_fiber',
            name: 'Flax Fiber (Linen)',
            formula: 'Flax Plant → Retting → Scutching → Fiber',
            ingredients: { FlaxStalks: 15, Water: 10 },
            field: 'textiles',
            category: 'Plant Fibers',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '🌾',
            unlocksAt: 50,
            value: 25,
            description: 'Strong, durable fiber for linen fabric.',
            laborMultiplier: 1.2,
            usedIn: ['linen', 'canvas', 'apparel']
        },
        {
            id: 'hemp_fiber',
            name: 'Hemp Fiber',
            formula: 'Hemp Stalks → Retting → Decortication → Fiber',
            ingredients: { HempStalks: 12, Water: 8 },
            field: 'textiles',
            category: 'Plant Fibers',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '🌱',
            unlocksAt: 100,
            value: 30,
            description: 'Eco-friendly, durable fiber for rope and textiles.',
            laborMultiplier: 1.3,
            usedIn: ['rope', 'canvas', 'clothing']
        },
        {
            id: 'jute_fiber',
            name: 'Jute Fiber',
            formula: 'Jute Stalks → Retting → Stripping → Fiber',
            ingredients: { JuteStalks: 15, Water: 10 },
            field: 'textiles',
            category: 'Plant Fibers',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '🟤',
            unlocksAt: 75,
            value: 20,
            description: 'Golden fiber for burlap and sacks.',
            laborMultiplier: 1.2,
            usedIn: ['burlap', 'sacks', 'carpet_backing']
        },
        {
            id: 'ramie_fiber',
            name: 'Ramie Fiber',
            formula: 'Ramie Stalks → Decortication → Degumming → Fiber',
            ingredients: { RamieStalks: 12, Water: 8, Chemicals: 2 },
            field: 'textiles',
            category: 'Plant Fibers',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '⚪',
            unlocksAt: 150,
            value: 40,
            description: 'Strong, lustrous fiber for high-quality textiles.',
            laborMultiplier: 1.4,
            usedIn: ['apparel', 'home_textiles', 'industrial']
        }
    ],
    
    'Animal Fibers': [
        {
            id: 'wool_fiber',
            name: 'Wool Fiber',
            formula: 'Sheep → Shearing → Scouring → Fiber',
            ingredients: { RawWool: 12, Water: 10, Soap: 2 },
            field: 'textiles',
            category: 'Animal Fibers',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '🐑',
            unlocksAt: 25,
            value: 25,
            description: 'Warm, resilient natural fiber from sheep.',
            laborMultiplier: 1.2,
            usedIn: ['yarn', 'fabric', 'blankets']
        },
        {
            id: 'silk_fiber',
            name: 'Silk Fiber',
            formula: 'Silkworm Cocoons → Reeling → Raw Silk',
            ingredients: { SilkwormCocoons: 20, Water: 5 },
            field: 'textiles',
            category: 'Animal Fibers',
            tier: 1,
            skillGain: 6,
            target: 100,
            icon: '🐛',
            unlocksAt: 200,
            value: 80,
            description: 'Luxurious, strong natural protein fiber.',
            laborMultiplier: 1.5,
            usedIn: ['luxury_fabrics', 'apparel', 'accessories']
        },
        {
            id: 'cashmere_fiber',
            name: 'Cashmere Fiber',
            formula: 'Cashmere Goat → Combing → Dehairing → Fiber',
            ingredients: { RawCashmere: 15, Water: 5 },
            field: 'textiles',
            category: 'Animal Fibers',
            tier: 1,
            skillGain: 8,
            target: 100,
            icon: '🐐',
            unlocksAt: 300,
            value: 150,
            description: 'Ultra-soft, warm luxury fiber.',
            laborMultiplier: 1.7,
            usedIn: ['luxury_sweaters', 'scarves', 'shawls']
        },
        {
            id: 'mohair_fiber',
            name: 'Mohair Fiber',
            formula: 'Angora Goat → Shearing → Scouring → Fiber',
            ingredients: { RawMohair: 12, Water: 8, Soap: 2 },
            field: 'textiles',
            category: 'Animal Fibers',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '🐐',
            unlocksAt: 250,
            value: 70,
            description: 'Lustrous, durable fiber with unique sheen.',
            laborMultiplier: 1.4,
            usedIn: ['suits', 'dresses', 'upholstery']
        },
        {
            id: 'alpaca_fiber',
            name: 'Alpaca Fiber',
            formula: 'Alpaca → Shearing → Sorting → Fiber',
            ingredients: { RawAlpaca: 12, Water: 5 },
            field: 'textiles',
            category: 'Animal Fibers',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '🦙',
            unlocksAt: 220,
            value: 60,
            description: 'Soft, warm, hypoallergenic luxury fiber.',
            laborMultiplier: 1.4,
            usedIn: ['sweaters', 'blankets', 'accessories']
        }
    ],
    
    // ============================================================================
    // TIER 2: YARN & THREAD FORMATION (12 recipes)
    // ============================================================================
    
    'Spinning': [
        {
            id: 'cotton_yarn',
            name: 'Cotton Yarn',
            formula: 'Cotton Fiber → Carding → Spinning → Yarn',
            ingredients: { CottonFiber: 15 },
            field: 'textiles',
            category: 'Spinning',
            tier: 2,
            skillGain: 3,
            target: 200,
            icon: '🧵',
            unlocksAt: 400,
            value: 30,
            description: 'Spun cotton yarn for knitting and weaving.',
            laborMultiplier: 1.2,
            usedIn: ['fabric', 'knitting', 'sewing']
        },
        {
            id: 'wool_yarn',
            name: 'Wool Yarn',
            formula: 'Wool Fiber → Carding → Spinning → Yarn',
            ingredients: { WoolFiber: 15 },
            field: 'textiles',
            category: 'Spinning',
            tier: 2,
            skillGain: 4,
            target: 200,
            icon: '🧶',
            unlocksAt: 450,
            value: 35,
            description: 'Warm, elastic wool yarn for knitting.',
            laborMultiplier: 1.3,
            usedIn: ['sweaters', 'scarves', 'blankets']
        },
        {
            id: 'linen_yarn',
            name: 'Linen Yarn',
            formula: 'Flax Fiber → Hackling → Wet Spinning → Yarn',
            ingredients: { FlaxFiber: 15, Water: 5 },
            field: 'textiles',
            category: 'Spinning',
            tier: 2,
            skillGain: 5,
            target: 200,
            icon: '🧵',
            unlocksAt: 500,
            value: 45,
            description: 'Strong, crisp linen yarn for weaving.',
            laborMultiplier: 1.4,
            usedIn: ['linen_fabric', 'lace', 'embroidery']
        },
        {
            id: 'silk_thread',
            name: 'Silk Thread',
            formula: 'Silk Fiber → Throwing → Twisting → Thread',
            ingredients: { SilkFiber: 12 },
            field: 'textiles',
            category: 'Spinning',
            tier: 2,
            skillGain: 7,
            target: 200,
            icon: '🪡',
            unlocksAt: 600,
            value: 80,
            description: 'Strong, lustrous silk thread for sewing and embroidery.',
            laborMultiplier: 1.5,
            usedIn: ['sewing', 'embroidery', 'couture']
        }
    ],
    
    'Blended Yarns': [
        {
            id: 'polyester_cotton_blend',
            name: 'Polyester-Cotton Blend Yarn',
            formula: 'Cotton + Polyester → Blended Yarn',
            ingredients: { CottonFiber: 8, PolyesterFiber: 7 },
            field: 'textiles',
            category: 'Blended Yarns',
            tier: 2,
            skillGain: 6,
            target: 200,
            icon: '🔄',
            unlocksAt: 650,
            value: 40,
            description: 'Durable, wrinkle-resistant blend for everyday wear.',
            laborMultiplier: 1.4,
            usedIn: ['shirts', 'uniforms', 'bedding']
        },
        {
            id: 'wool_acrylic_blend',
            name: 'Wool-Acrylic Blend Yarn',
            formula: 'Wool + Acrylic → Blended Yarn',
            ingredients: { WoolFiber: 8, AcrylicFiber: 7 },
            field: 'textiles',
            category: 'Blended Yarns',
            tier: 2,
            skillGain: 6,
            target: 200,
            icon: '🧶',
            unlocksAt: 700,
            value: 45,
            description: 'Affordable, durable blend for knitwear.',
            laborMultiplier: 1.4,
            usedIn: ['sweaters', 'hats', 'scarves']
        },
        {
            id: 'silk_cotton_blend',
            name: 'Silk-Cotton Blend Yarn',
            formula: 'Silk + Cotton → Luxury Blend',
            ingredients: { SilkFiber: 5, CottonFiber: 10 },
            field: 'textiles',
            category: 'Blended Yarns',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '✨',
            unlocksAt: 800,
            value: 90,
            description: 'Luxurious blend with silk sheen and cotton comfort.',
            laborMultiplier: 1.6,
            usedIn: ['luxury_apparel', 'lingerie', 'accessories']
        }
    ],
    
    'Specialty Threads': [
        {
            id: 'embroidery_thread',
            name: 'Embroidery Thread',
            formula: 'Rayon or Polyester → Twisting → Mercerizing → Thread',
            ingredients: { RayonFiber: 10, Finish: 1 },
            field: 'textiles',
            category: 'Specialty Threads',
            tier: 2,
            skillGain: 6,
            target: 200,
            icon: '🎨',
            unlocksAt: 750,
            value: 50,
            description: 'High-sheen thread for decorative stitching.',
            laborMultiplier: 1.4,
            usedIn: ['embroidery', 'decoration', 'couture']
        },
        {
            id: 'quilting_thread',
            name: 'Quilting Thread',
            formula: 'Cotton + Coating → Strong Thread',
            ingredients: { CottonYarn: 12, Wax: 1 },
            field: 'textiles',
            category: 'Specialty Threads',
            tier: 2,
            skillGain: 5,
            target: 200,
            icon: '🪡',
            unlocksAt: 680,
            value: 35,
            description: 'Strong, smooth thread for quilting.',
            laborMultiplier: 1.3,
            usedIn: ['quilts', 'patchwork', 'crafts']
        },
        {
            id: 'industrial_thread',
            name: 'Industrial Thread',
            formula: 'Polyester + High-Twist → Industrial Strength',
            ingredients: { PolyesterFiber: 15, Lubricant: 1 },
            field: 'textiles',
            category: 'Specialty Threads',
            tier: 2,
            skillGain: 7,
            target: 200,
            icon: '⚙️',
            unlocksAt: 900,
            value: 30,
            description: 'Heavy-duty thread for industrial applications.',
            laborMultiplier: 1.5,
            usedIn: ['upholstery', 'automotive', 'footwear']
        }
    ],
    
    // ============================================================================
    // TIER 3: WOVEN FABRICS (12 recipes)
    // ============================================================================
    
    'Plain Weaves': [
        {
            id: 'cotton_fabric',
            name: 'Cotton Fabric',
            formula: 'Cotton Yarn → Weaving → Fabric',
            ingredients: { CottonYarn: 20 },
            field: 'textiles',
            category: 'Plain Weaves',
            tier: 3,
            skillGain: 6,
            target: 300,
            icon: '👕',
            unlocksAt: 1000,
            value: 50,
            description: 'Basic cotton fabric for apparel and home goods.',
            laborMultiplier: 1.4,
            usedIn: ['shirts', 'dresses', 'bedding']
        },
        {
            id: 'linen_fabric',
            name: 'Linen Fabric',
            formula: 'Linen Yarn → Weaving → Linen Cloth',
            ingredients: { LinenYarn: 20 },
            field: 'textiles',
            category: 'Plain Weaves',
            tier: 3,
            skillGain: 8,
            target: 300,
            icon: '👔',
            unlocksAt: 1100,
            value: 80,
            description: 'Crisp, breathable linen for summer wear.',
            laborMultiplier: 1.5,
            usedIn: ['suits', 'shirts', 'home_textiles']
        },
        {
            id: 'wool_fabric',
            name: 'Wool Fabric',
            formula: 'Wool Yarn → Weaving → Fulling → Fabric',
            ingredients: { WoolYarn: 20, Water: 5 },
            field: 'textiles',
            category: 'Plain Weaves',
            tier: 3,
            skillGain: 8,
            target: 300,
            icon: '🧥',
            unlocksAt: 1200,
            value: 90,
            description: 'Warm wool fabric for suits and coats.',
            laborMultiplier: 1.5,
            usedIn: ['suits', 'coats', 'blankets']
        }
    ],
    
    'Twill Weaves': [
        {
            id: 'denim',
            name: 'Denim',
            formula: 'Cotton Yarn → Twill Weave → Indigo Dye → Denim',
            ingredients: { CottonYarn: 25, IndigoDye: 2 },
            field: 'textiles',
            category: 'Twill Weaves',
            tier: 3,
            skillGain: 10,
            target: 300,
            icon: '👖',
            unlocksAt: 1300,
            value: 100,
            description: 'Durable twill fabric for jeans.',
            laborMultiplier: 1.6,
            usedIn: ['jeans', 'jackets', 'workwear']
        },
        {
            id: 'chino',
            name: 'Chino',
            formula: 'Cotton Yarn → Twill Weave → Garment Dye → Chino',
            ingredients: { CottonYarn: 22, Dye: 1 },
            field: 'textiles',
            category: 'Twill Weaves',
            tier: 3,
            skillGain: 8,
            target: 300,
            icon: '👖',
            unlocksAt: 1250,
            value: 70,
            description: 'Smooth twill for casual pants.',
            laborMultiplier: 1.5,
            usedIn: ['pants', 'shorts', 'uniforms']
        },
        {
            id: 'gabardine',
            name: 'Gabardine',
            formula: 'Worsted Wool → Steep Twill → Gabardine',
            ingredients: { WorstedYarn: 20 },
            field: 'textiles',
            category: 'Twill Weaves',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '👔',
            unlocksAt: 1400,
            value: 120,
            description: 'Water-resistant twill for trench coats.',
            laborMultiplier: 1.7,
            usedIn: ['coats', 'suits', 'outerwear']
        }
    ],
    
    'Satin Weaves': [
        {
            id: 'satin_fabric',
            name: 'Satin Fabric',
            formula: 'Silk or Rayon → Satin Weave → Satin',
            ingredients: { SilkYarn: 15, RayonYarn: 5 },
            field: 'textiles',
            category: 'Satin Weaves',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '✨',
            unlocksAt: 1500,
            value: 150,
            description: 'Lustrous, smooth fabric for evening wear.',
            laborMultiplier: 1.7,
            usedIn: ['evening_gowns', 'lingerie', 'blouses']
        },
        {
            id: 'sateen',
            name: 'Sateen',
            formula: 'Cotton → Satin Weave → Sateen Finish',
            ingredients: { CottonYarn: 20 },
            field: 'textiles',
            category: 'Satin Weaves',
            tier: 3,
            skillGain: 9,
            target: 300,
            icon: '🛏️',
            unlocksAt: 1450,
            value: 80,
            description: 'Cotton fabric with satin-like sheen.',
            laborMultiplier: 1.5,
            usedIn: ['sheets', 'pajamas', 'shirts']
        }
    ],
    
    // ============================================================================
    // TIER 4: KNITTED FABRICS (8 recipes)
    // ============================================================================
    
    'Jersey Knits': [
        {
            id: 'jersey_knit',
            name: 'Jersey Knit',
            formula: 'Cotton Yarn → Circular Knitting → Jersey',
            ingredients: { CottonYarn: 18 },
            field: 'textiles',
            category: 'Jersey Knits',
            tier: 4,
            skillGain: 8,
            target: 400,
            icon: '👕',
            unlocksAt: 2000,
            value: 60,
            description: 'Soft, stretchy knit for t-shirts.',
            laborMultiplier: 1.5,
            usedIn: ['t_shirts', 'dresses', 'loungewear']
        },
        {
            id: 'rib_knit',
            name: 'Rib Knit',
            formula: 'Yarn → Rib Stitch → Rib Fabric',
            ingredients: { CottonYarn: 20, ElasticYarn: 2 },
            field: 'textiles',
            category: 'Jersey Knits',
            tier: 4,
            skillGain: 10,
            target: 400,
            icon: '🧦',
            unlocksAt: 2100,
            value: 70,
            description: 'Stretchy knit for cuffs and collars.',
            laborMultiplier: 1.6,
            usedIn: ['cuffs', 'collars', 'sweater_bands']
        },
        {
            id: 'interlock_knit',
            name: 'Interlock Knit',
            formula: 'Yarn → Double Knit → Interlock',
            ingredients: { CottonYarn: 25 },
            field: 'textiles',
            category: 'Jersey Knits',
            tier: 4,
            skillGain: 12,
            target: 400,
            icon: '👚',
            unlocksAt: 2200,
            value: 90,
            description: 'Stable, reversible knit for babywear.',
            laborMultiplier: 1.6,
            usedIn: ['baby_clothes', 'polos', 'dresses']
        }
    ],
    
    'Pile Knits': [
        {
            id: 'fleece',
            name: 'Fleece',
            formula: 'Polyester Knit → Napping → Fleece',
            ingredients: { PolyesterYarn: 25 },
            field: 'textiles',
            category: 'Pile Knits',
            tier: 4,
            skillGain: 12,
            target: 400,
            icon: '🧥',
            unlocksAt: 2500,
            value: 80,
            description: 'Warm, soft knit for jackets and blankets.',
            laborMultiplier: 1.6,
            usedIn: ['jackets', 'blankets', 'activewear']
        },
        {
            id: 'velour',
            name: 'Velour',
            formula: 'Cotton or Polyester → Pile Weave → Velour',
            ingredients: { CottonYarn: 20, PileCutting: 1 },
            field: 'textiles',
            category: 'Pile Knits',
            tier: 4,
            skillGain: 14,
            target: 400,
            icon: '👑',
            unlocksAt: 2700,
            value: 120,
            description: 'Plush, velvet-like knit for loungewear.',
            laborMultiplier: 1.8,
            usedIn: ['robes', 'tracksuits', 'upholstery']
        },
        {
            id: 'terry_cloth',
            name: 'Terry Cloth',
            formula: 'Cotton Yarn → Loop Pile → Terry',
            ingredients: { CottonYarn: 30 },
            field: 'textiles',
            category: 'Pile Knits',
            tier: 4,
            skillGain: 10,
            target: 400,
            icon: '🛁',
            unlocksAt: 2400,
            value: 70,
            description: 'Absorbent fabric for towels.',
            laborMultiplier: 1.5,
            usedIn: ['towels', 'robes', 'washcloths']
        }
    ],
    
    // ============================================================================
    // TIER 5: TECHNICAL TEXTILES (8 recipes)
    // ============================================================================
    
    'Performance Fabrics': [
        {
            id: 'moisture_wicking',
            name: 'Moisture-Wicking Fabric',
            formula: 'Polyester + Hydrophilic Finish → Performance',
            ingredients: { PolyesterFabric: 20, HydrophilicTreatment: 2 },
            field: 'textiles',
            category: 'Performance Fabrics',
            tier: 5,
            skillGain: 15,
            target: 500,
            icon: '🏃',
            unlocksAt: 3500,
            value: 120,
            description: 'Fabric that moves sweat away from skin.',
            laborMultiplier: 1.8,
            usedIn: ['activewear', 'sportswear', 'base_layers']
        },
        {
            id: 'windproof_fabric',
            name: 'Windproof Fabric',
            formula: 'Fabric + Membrane → Windproof Laminate',
            ingredients: { PolyesterFabric: 15, PTFEMembrane: 5 },
            field: 'textiles',
            category: 'Performance Fabrics',
            tier: 5,
            skillGain: 18,
            target: 500,
            icon: '🌬️',
            unlocksAt: 3800,
            value: 180,
            description: 'Fabric that blocks wind while breathing.',
            laborMultiplier: 2.0,
            usedIn: ['jackets', 'outerwear', 'shells']
        },
        {
            id: 'waterproof_breathable',
            name: 'Waterproof Breathable Fabric',
            formula: 'Fabric + Lamination → Waterproof Laminate',
            ingredients: { NylonFabric: 15, ePTFEMembrane: 5 },
            field: 'textiles',
            category: 'Performance Fabrics',
            tier: 5,
            skillGain: 22,
            target: 500,
            icon: '☔',
            unlocksAt: 4000,
            value: 250,
            description: 'Waterproof fabric that lets vapor escape.',
            laborMultiplier: 2.3,
            usedIn: ['rainwear', 'outdoor_gear', 'footwear']
        }
    ],
    
    'Protective Fabrics': [
        {
            id: 'fr_fabric',
            name: 'Flame-Resistant Fabric',
            formula: 'Aramid + FR Treatment → Fire Protection',
            ingredients: { AramidFiber: 20, FRFinish: 2 },
            field: 'textiles',
            category: 'Protective Fabrics',
            tier: 5,
            skillGain: 20,
            target: 500,
            icon: '🔥',
            unlocksAt: 4200,
            value: 200,
            description: 'Self-extinguishing fabric for protective wear.',
            laborMultiplier: 2.1,
            usedIn: ['firefighter_gear', 'welding', 'military']
        },
        {
            id: 'antistatic_fabric',
            name: 'Antistatic Fabric',
            formula: 'Fabric + Conductive Fibers → Static Dissipation',
            ingredients: { PolyesterFabric: 18, CarbonFiber: 2 },
            field: 'textiles',
            category: 'Protective Fabrics',
            tier: 5,
            skillGain: 16,
            target: 500,
            icon: '⚡',
            unlocksAt: 4100,
            value: 140,
            description: 'Fabric that dissipates static electricity.',
            laborMultiplier: 1.9,
            usedIn: ['cleanroom', 'electronics', 'fuel_handling']
        },
        {
            id: 'cut_resistant_fabric',
            name: 'Cut-Resistant Fabric',
            formula: 'UHMWPE + Fiberglass → Cut Protection',
            ingredients: { UHMWPEFiber: 15, FiberglassYarn: 5 },
            field: 'textiles',
            category: 'Protective Fabrics',
            tier: 5,
            skillGain: 22,
            target: 500,
            icon: '🔪',
            unlocksAt: 4500,
            value: 280,
            description: 'Fabric that resists cutting and slashing.',
            laborMultiplier: 2.3,
            usedIn: ['gloves', 'aprons', 'safety_gear']
        }
    ],
    
    // ============================================================================
    // TIER 6: SMART TEXTILES (8 recipes)
    // ============================================================================
    
    'Conductive Textiles': [
        {
            id: 'conductive_fabric',
            name: 'Conductive Fabric',
            formula: 'Fabric + Silver Coating → Conductive',
            ingredients: { NylonFabric: 15, Silver: 5 },
            field: 'textiles',
            category: 'Conductive Textiles',
            tier: 6,
            skillGain: 25,
            target: 600,
            icon: '⚡',
            unlocksAt: 6000,
            value: 350,
            description: 'Fabric that conducts electricity for smart garments.',
            laborMultiplier: 2.5,
            usedIn: ['smart_clothing', 'wearable_tech', 'sensors']
        },
        {
            id: 'conductive_thread',
            name: 'Conductive Thread',
            formula: 'Polyester + Silver Plating → Conductive Yarn',
            ingredients: { PolyesterYarn: 15, Silver: 3 },
            field: 'textiles',
            category: 'Conductive Textiles',
            tier: 6,
            skillGain: 22,
            target: 600,
            icon: '🪡',
            unlocksAt: 6200,
            value: 300,
            description: 'Thread that conducts electricity for e-textiles.',
            laborMultiplier: 2.4,
            usedIn: ['wearable_circuits', 'embroidery', 'connections']
        },
        {
            id: 'flexible_circuit',
            name: 'Flexible Circuit Board',
            formula: 'Conductive Fabric + Components → Flexible Circuit',
            ingredients: { ConductiveFabric: 10, ElectronicComponents: 5 },
            field: 'textiles',
            category: 'Conductive Textiles',
            tier: 6,
            skillGain: 35,
            target: 600,
            icon: '🖥️',
            unlocksAt: 7000,
            value: 800,
            description: 'Bendable circuit board integrated into fabric.',
            laborMultiplier: 3.0,
            usedIn: ['wearable_tech', 'smart_fabrics', 'medical_monitors']
        }
    ],
    
    'Phase Change Materials': [
        {
            id: 'pcm_fabric',
            name: 'PCM-Infused Fabric',
            formula: 'Fabric + Microencapsulated PCM → Temperature-Regulating',
            ingredients: { PolyesterFabric: 15, PCMicrocapsules: 5 },
            field: 'textiles',
            category: 'Phase Change Materials',
            tier: 6,
            skillGain: 28,
            target: 600,
            icon: '🌡️',
            unlocksAt: 6500,
            value: 400,
            description: 'Fabric that absorbs and releases heat for comfort.',
            laborMultiplier: 2.6,
            usedIn: ['activewear', 'bedding', 'outdoor_gear']
        }
    ],
    
    'Chromogenic Textiles': [
        {
            id: 'thermochromic_fabric',
            name: 'Thermochromic Fabric',
            formula: 'Fabric + Thermochromic Dye → Color-Changing',
            ingredients: { NylonFabric: 15, ThermochromicDye: 3 },
            field: 'textiles',
            category: 'Chromogenic Textiles',
            tier: 6,
            skillGain: 24,
            target: 600,
            icon: '🌈',
            unlocksAt: 6800,
            value: 280,
            description: 'Fabric that changes color with temperature.',
            laborMultiplier: 2.4,
            usedIn: ['novelty_apparel', 'mood_fabrics', 'sensors']
        },
        {
            id: 'photochromic_fabric',
            name: 'Photochromic Fabric',
            formula: 'Fabric + Photochromic Dye → UV-Responsive',
            ingredients: { CottonFabric: 15, PhotochromicDye: 3 },
            field: 'textiles',
            category: 'Chromogenic Textiles',
            tier: 6,
            skillGain: 24,
            target: 600,
            icon: '☀️',
            unlocksAt: 6900,
            value: 280,
            description: 'Fabric that changes color in sunlight.',
            laborMultiplier: 2.4,
            usedIn: ['outdoor_apparel', 'novelty', 'protective']
        }
    ],
    
    // ============================================================================
    // TIER 7: ADVANCED & SPECIALTY TEXTILES (7 recipes)
    // ============================================================================
    
    'Ballistic Fabrics': [
        {
            id: 'kevlar_fabric',
            name: 'Kevlar Fabric',
            formula: 'Aramid Fibers → Weaving → Ballistic Cloth',
            ingredients: { KevlarFiber: 25 },
            field: 'textiles',
            category: 'Ballistic Fabrics',
            tier: 7,
            skillGain: 40,
            target: 800,
            icon: '🛡️',
            unlocksAt: 10000,
            value: 1000,
            description: 'Bullet-resistant fabric for body armor.',
            laborMultiplier: 3.5,
            usedIn: ['body_armor', 'helmets', 'ballistic_panels']
        },
        {
            id: 'dyneema_fabric',
            name: 'Dyneema Fabric',
            formula: 'UHMWPE Fibers → Weaving → Ultra-Strong',
            ingredients: { UHMWPEFiber: 25 },
            field: 'textiles',
            category: 'Ballistic Fabrics',
            tier: 7,
            skillGain: 45,
            target: 800,
            icon: '⚪',
            unlocksAt: 11000,
            value: 1500,
            description: 'Ultra-high molecular weight polyethylene fabric.',
            laborMultiplier: 4.0,
            usedIn: ['ballistic_protection', 'cut_resistant', 'ropes']
        }
    ],
    
    'Aerospace Textiles': [
        {
            id: 'carbon_fiber_fabric',
            name: 'Carbon Fiber Fabric',
            formula: 'Carbon Fibers → Weaving → Carbon Cloth',
            ingredients: { CarbonFiber: 25 },
            field: 'textiles',
            category: 'Aerospace Textiles',
            tier: 7,
            skillGain: 38,
            target: 800,
            icon: '⚫',
            unlocksAt: 10500,
            value: 1200,
            description: 'High-strength carbon fabric for composites.',
            laborMultiplier: 3.3,
            usedIn: ['aerospace', 'automotive', 'sports']
        },
        {
            id: 'ceramic_fabric',
            name: 'Ceramic Fabric',
            formula: 'Ceramic Fibers → Weaving → High-Temp Cloth',
            ingredients: { CeramicFiber: 25 },
            field: 'textiles',
            category: 'Aerospace Textiles',
            tier: 7,
            skillGain: 48,
            target: 800,
            icon: '🔥',
            unlocksAt: 12000,
            value: 2000,
            description: 'Heat-resistant fabric for thermal protection.',
            laborMultiplier: 4.2,
            usedIn: ['heat_shields', 'furnace_curtains', 'spacecraft']
        }
    ],
    
    'Medical Textiles': [
        {
            id: 'antimicrobial_fabric',
            name: 'Antimicrobial Fabric',
            formula: 'Fabric + Silver or Copper → Antimicrobial',
            ingredients: { CottonFabric: 20, Silver: 2 },
            field: 'textiles',
            category: 'Medical Textiles',
            tier: 7,
            skillGain: 30,
            target: 800,
            icon: '🦠',
            unlocksAt: 9500,
            value: 350,
            description: 'Fabric that inhibits bacterial growth.',
            laborMultiplier: 2.8,
            usedIn: ['medical_gowns', 'bandages', 'linens']
        },
        {
            id: 'wound_dressing',
            name: 'Advanced Wound Dressing',
            formula: 'Antimicrobial Fabric + Hydrocolloid → Dressing',
            ingredients: { AntimicrobialFabric: 10, Hydrocolloid: 5 },
            field: 'textiles',
            category: 'Medical Textiles',
            tier: 7,
            skillGain: 35,
            target: 800,
            icon: '🩹',
            unlocksAt: 9800,
            value: 500,
            description: 'Medical textile for advanced wound care.',
            laborMultiplier: 3.0,
            usedIn: ['wound_care', 'bandages', 'medical']
        }
    ],
    
    // ============================================================================
    // ADDITIONAL: TEXTILE FINISHING (Helper recipes)
    // ============================================================================
    
    'Finishing Treatments': [
        {
            id: 'mercerized_cotton',
            name: 'Mercerized Cotton',
            formula: 'Cotton Yarn → NaOH Treatment → Mercerized',
            ingredients: { CottonYarn: 15, SodiumHydroxide: 2 },
            field: 'textiles',
            category: 'Finishing Treatments',
            tier: 3,
            skillGain: 6,
            target: 300,
            icon: '✨',
            unlocksAt: 1600,
            value: 60,
            description: 'Cotton with enhanced luster and strength.',
            laborMultiplier: 1.4,
            usedIn: ['sewing_thread', 'high_quality_fabrics']
        },
        {
            id: 'water_repellent_finish',
            name: 'Water Repellent Finish',
            formula: 'Fabric + Fluorocarbon → Durable Water Repellent',
            ingredients: { Fabric: 20, Fluorocarbon: 3 },
            field: 'textiles',
            category: 'Finishing Treatments',
            tier: 4,
            skillGain: 12,
            target: 400,
            icon: '💧',
            unlocksAt: 3000,
            value: 80,
            description: 'Finish that makes fabric water-repellent.',
            laborMultiplier: 1.6,
            usedIn: ['outerwear', 'outdoor_gear', 'upholstery']
        },
        {
            id: 'enzyme_wash',
            name: 'Enzyme Wash',
            formula: 'Denim + Cellulase → Softened Finish',
            ingredients: { Denim: 15, Cellulase: 1 },
            field: 'textiles',
            category: 'Finishing Treatments',
            tier: 3,
            skillGain: 8,
            target: 300,
            icon: '🧼',
            unlocksAt: 1400,
            value: 50,
            description: 'Softens fabric and creates vintage look.',
            laborMultiplier: 1.4,
            usedIn: ['jeans', 'garment_washing', 'softening']
        },
        {
            id: 'uv_protective_finish',
            name: 'UV Protective Finish',
            formula: 'Fabric + UV Absorber → Sun Protection',
            ingredients: { Fabric: 20, UVAbsorber: 2 },
            field: 'textiles',
            category: 'Finishing Treatments',
            tier: 5,
            skillGain: 16,
            target: 500,
            icon: '☀️',
            unlocksAt: 4300,
            value: 120,
            description: 'Finish that blocks harmful UV radiation.',
            laborMultiplier: 1.8,
            usedIn: ['sun_protection', 'outdoor', 'childrenswear']
        },
        {
            id: 'natural_dye',
            name: 'Natural Dye',
            formula: 'Plant Material + Mordant → Dye',
            ingredients: { Indigo: 5, Alum: 2 },
            field: 'textiles',
            category: 'Finishing Treatments',
            tier: 2,
            skillGain: 4,
            target: 200,
            icon: '🎨',
            unlocksAt: 800,
            value: 30,
            description: 'Eco-friendly dye from natural sources.',
            laborMultiplier: 1.3,
            usedIn: ['natural_fabrics', 'eco_textiles', 'crafts']
        },
        {
            id: 'synthetic_dye',
            name: 'Synthetic Dye',
            formula: 'Petrochemicals + Fixatives → Dye',
            ingredients: { Aniline: 5, SodiumChloride: 2 },
            field: 'textiles',
            category: 'Finishing Treatments',
            tier: 3,
            skillGain: 5,
            target: 300,
            icon: '🧪',
            unlocksAt: 1700,
            value: 25,
            description: 'Bright, colorfast synthetic dye.',
            laborMultiplier: 1.3,
            usedIn: ['all_fabrics', 'industrial_dyeing']
        }
    ]
};

// ============================================================================
// EXPORT ALL TEXTILES RECIPES
// ============================================================================

export default TEXTILES_RECIPES;

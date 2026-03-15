// js/skill-tree.js - Alchemy Skill Tree and Progression System
// Handles mastery levels, unlocks, and labor pool calculations

import { LEVEL_THRESHOLDS, getLevelFromProgress, getMasteryMultiplier } from './alchemy.js';

// ===== SKILL TREE CONFIGURATION =====

// Tier definitions with colors and descriptions
export const TIERS = [
    { 
        level: 1, 
        name: 'Basic', 
        color: '#ffffff', 
        description: 'Foundation of all chemistry',
        threshold: 0
    },
    { 
        level: 2, 
        name: 'Intermediate', 
        color: '#b0ffb0', 
        description: 'Acids, bases, and salts',
        threshold: 1000
    },
    { 
        level: 3, 
        name: 'Advanced', 
        color: '#b0b0ff', 
        description: 'Organic compounds',
        threshold: 5000
    },
    { 
        level: 4, 
        name: 'Expert', 
        color: '#e0b0ff', 
        description: 'Polymers and plastics',
        threshold: 10000
    },
    { 
        level: 5, 
        name: 'Master', 
        color: '#ffd700', 
        description: 'Metallurgy and alloys',
        threshold: 25000
    },
    { 
        level: 6, 
        name: 'Grand Master', 
        color: '#ffaa4a', 
        description: 'Composites and advanced materials',
        threshold: 50000
    },
    { 
        level: 7, 
        name: 'Sage', 
        color: '#ff6b6b', 
        description: 'Semiconductors and electronics',
        threshold: 100000
    },
    { 
        level: 8, 
        name: 'Legendary', 
        color: '#4affaa', 
        description: 'Energy systems and nanomaterials',
        threshold: 250000
    },
    { 
        level: 9, 
        name: 'Mythic', 
        color: '#c0a0ff', 
        description: 'Quantum materials',
        threshold: 500000
    },
    { 
        level: 10, 
        name: 'Transcendent', 
        color: '#ff69b4', 
        description: 'Exotic matter and beyond',
        threshold: 1000000
    }
];

// ===== CATEGORY SKILL REQUIREMENTS =====

export const CATEGORY_REQUIREMENTS = {
    'Basic Compounds': { tier: 1, requiredCrafts: 0 },
    'Acids & Bases': { tier: 2, requiredCrafts: 100 },
    'Salts & Minerals': { tier: 2, requiredCrafts: 200 },
    'Hydrocarbons': { tier: 3, requiredCrafts: 500 },
    'Alcohols': { tier: 3, requiredCrafts: 600 },
    'Organic Acids': { tier: 3, requiredCrafts: 700 },
    'Esters': { tier: 3, requiredCrafts: 800 },
    'Ethers': { tier: 3, requiredCrafts: 900 },
    'Amines': { tier: 3, requiredCrafts: 1000 },
    'Monomers': { tier: 4, requiredCrafts: 2000 },
    'Polymers': { tier: 4, requiredCrafts: 3000 },
    'Engineering Plastics': { tier: 4, requiredCrafts: 4000 },
    'Basic Alloys': { tier: 5, requiredCrafts: 5000 },
    'Stainless Steels': { tier: 5, requiredCrafts: 6000 },
    'Tool Steels': { tier: 5, requiredCrafts: 7000 },
    'Aluminum Alloys': { tier: 5, requiredCrafts: 8000 },
    'Titanium Alloys': { tier: 5, requiredCrafts: 9000 },
    'Superalloys': { tier: 5, requiredCrafts: 10000 },
    'Refractory Alloys': { tier: 5, requiredCrafts: 11000 },
    'Fibers': { tier: 6, requiredCrafts: 15000 },
    'Matrix Materials': { tier: 6, requiredCrafts: 16000 },
    'Composites': { tier: 6, requiredCrafts: 17000 },
    'Advanced Composites': { tier: 6, requiredCrafts: 18000 },
    'Silicon Processing': { tier: 7, requiredCrafts: 25000 },
    'Doping': { tier: 7, requiredCrafts: 30000 },
    'Dielectrics': { tier: 7, requiredCrafts: 35000 },
    'Devices': { tier: 7, requiredCrafts: 40000 },
    'Integrated Circuits': { tier: 7, requiredCrafts: 45000 },
    'Energy Storage': { tier: 8, requiredCrafts: 60000 },
    'Energy Generation': { tier: 8, requiredCrafts: 70000 },
    'Nanomaterials': { tier: 8, requiredCrafts: 80000 },
    'Smart Materials': { tier: 8, requiredCrafts: 90000 },
    'Antimatter': { tier: 9, requiredCrafts: 200000 },
    'Superheavy Elements': { tier: 9, requiredCrafts: 300000 },
    'Exotic Materials': { tier: 9, requiredCrafts: 400000 }
};

// ===== SKILL TREE NODES =====

export const SKILL_TREE = {
    // Tier 1: Basic Chemistry
    'water': {
        id: 'water',
        name: 'Water Synthesis',
        category: 'Basic Compounds',
        tier: 1,
        dependencies: [],
        unlocks: ['sulfuric_acid', 'nitric_acid', 'electrolysis'],
        description: 'Master the creation of water from hydrogen and oxygen.',
        skillGain: 1,
        laborMultiplier: 1.0
    },
    'methane': {
        id: 'methane',
        name: 'Methane Synthesis',
        category: 'Basic Compounds',
        tier: 1,
        dependencies: [],
        unlocks: ['methanol', 'ethylene', 'chlorination'],
        description: 'Combine carbon and hydrogen to form the simplest hydrocarbon.',
        skillGain: 1,
        laborMultiplier: 1.0
    },
    'ammonia': {
        id: 'ammonia',
        name: 'Ammonia Synthesis',
        category: 'Basic Compounds',
        tier: 1,
        dependencies: [],
        unlocks: ['nitric_acid', 'ammonium_nitrate', 'amines'],
        description: 'Fix nitrogen from the atmosphere into usable ammonia.',
        skillGain: 1,
        laborMultiplier: 1.0
    },
    
    // Tier 2: Acids & Bases
    'sulfuric_acid': {
        id: 'sulfuric_acid',
        name: 'Sulfuric Acid Production',
        category: 'Acids & Bases',
        tier: 2,
        dependencies: ['water', 'sulfur'],
        unlocks: ['fertilizers', 'battery_acid', 'chemical_processing'],
        description: 'The king of chemicals - essential for countless processes.',
        skillGain: 5,
        laborMultiplier: 1.2
    },
    'nitric_acid': {
        id: 'nitric_acid',
        name: 'Nitric Acid Production',
        category: 'Acids & Bases',
        tier: 2,
        dependencies: ['ammonia', 'oxygen'],
        unlocks: ['explosives', 'fertilizers', 'etching'],
        description: 'Powerful acid used in fertilizers and explosives.',
        skillGain: 5,
        laborMultiplier: 1.2
    },
    'hydrochloric_acid': {
        id: 'hydrochloric_acid',
        name: 'Hydrochloric Acid Production',
        category: 'Acids & Bases',
        tier: 2,
        dependencies: ['hydrogen', 'chlorine'],
        unlocks: ['pickling', 'ore_processing', 'chlorides'],
        description: 'Strong acid for cleaning and ore processing.',
        skillGain: 3,
        laborMultiplier: 1.1
    },
    
    // Tier 3: Salts & Minerals
    'sodium_chloride': {
        id: 'sodium_chloride',
        name: 'Salt Crystallization',
        category: 'Salts & Minerals',
        tier: 3,
        dependencies: ['sodium', 'chlorine'],
        unlocks: ['electrolysis', 'chloralkali'],
        description: 'Essential for life and countless industrial processes.',
        skillGain: 5,
        laborMultiplier: 1.3
    },
    'calcium_carbonate': {
        id: 'calcium_carbonate',
        name: 'Limestone Processing',
        category: 'Salts & Minerals',
        tier: 3,
        dependencies: ['calcium', 'carbon_dioxide'],
        unlocks: ['cement', 'lime', 'construction'],
        description: 'Foundation of construction and cement production.',
        skillGain: 8,
        laborMultiplier: 1.4
    },
    'potassium_nitrate': {
        id: 'potassium_nitrate',
        name: 'Saltpeter Production',
        category: 'Salts & Minerals',
        tier: 3,
        dependencies: ['potassium', 'nitric_acid'],
        unlocks: ['gunpowder', 'fireworks', 'preservatives'],
        description: 'Essential for gunpowder and fireworks.',
        skillGain: 10,
        laborMultiplier: 1.5
    },
    
    // Tier 4: Organic Chemistry
    'ethylene': {
        id: 'ethylene',
        name: 'Ethylene Cracking',
        category: 'Hydrocarbons',
        tier: 4,
        dependencies: ['methane'],
        unlocks: ['polyethylene', 'ethylene_glycol', 'styrene'],
        description: 'The most produced organic compound.',
        skillGain: 10,
        laborMultiplier: 1.6
    },
    'methanol': {
        id: 'methanol',
        name: 'Methanol Synthesis',
        category: 'Alcohols',
        tier: 4,
        dependencies: ['methane', 'oxygen'],
        unlocks: ['formaldehyde', 'acetic_acid', 'fuel_cells'],
        description: 'Wood alcohol - fuel and chemical feedstock.',
        skillGain: 15,
        laborMultiplier: 1.7
    },
    'ethanol': {
        id: 'ethanol',
        name: 'Ethanol Fermentation',
        category: 'Alcohols',
        tier: 4,
        dependencies: ['ethylene', 'water'],
        unlocks: ['beverages', 'fuel', 'solvents'],
        description: 'Grain alcohol - fuel, solvent, and more.',
        skillGain: 20,
        laborMultiplier: 1.8
    },
    'acetic_acid': {
        id: 'acetic_acid',
        name: 'Acetic Acid Synthesis',
        category: 'Organic Acids',
        tier: 4,
        dependencies: ['methanol', 'carbon_monoxide'],
        unlocks: ['vinegar', 'esters', 'solvents'],
        description: 'Vinegar - essential for ester production.',
        skillGain: 20,
        laborMultiplier: 1.8
    },
    
    // Tier 5: Polymers
    'polyethylene': {
        id: 'polyethylene',
        name: 'Polymerization',
        category: 'Polymers',
        tier: 5,
        dependencies: ['ethylene'],
        unlocks: ['plastics', 'packaging', 'insulation'],
        description: 'The most common plastic in the world.',
        skillGain: 50,
        laborMultiplier: 2.0
    },
    'styrene': {
        id: 'styrene',
        name: 'Styrene Monomer',
        category: 'Monomers',
        tier: 5,
        dependencies: ['ethylene', 'benzene'],
        unlocks: ['polystyrene', 'abs', 'rubber'],
        description: 'Essential for polystyrene and copolymers.',
        skillGain: 40,
        laborMultiplier: 1.9
    },
    'nylon': {
        id: 'nylon',
        name: 'Nylon Polymerization',
        category: 'Engineering Plastics',
        tier: 5,
        dependencies: ['adipic_acid', 'hexamethylenediamine'],
        unlocks: ['textiles', 'engineering_plastics', 'fibers'],
        description: 'Strong, durable synthetic fiber.',
        skillGain: 100,
        laborMultiplier: 2.5
    },
    
    // Tier 6: Metallurgy
    'steel': {
        id: 'steel',
        name: 'Steel Production',
        category: 'Basic Alloys',
        tier: 6,
        dependencies: ['iron', 'carbon'],
        unlocks: ['stainless_steel', 'tool_steel', 'construction'],
        description: 'The backbone of modern civilization.',
        skillGain: 40,
        laborMultiplier: 2.2
    },
    'stainless_steel': {
        id: 'stainless_steel',
        name: 'Stainless Steel Alloying',
        category: 'Stainless Steels',
        tier: 6,
        dependencies: ['steel', 'chromium', 'nickel'],
        unlocks: ['corrosion_resistant', 'medical_implants', 'architecture'],
        description: 'Corrosion-resistant steel for demanding applications.',
        skillGain: 60,
        laborMultiplier: 2.5
    },
    'titanium_alloy': {
        id: 'titanium_alloy',
        name: 'Titanium Alloying',
        category: 'Titanium Alloys',
        tier: 6,
        dependencies: ['titanium', 'aluminum', 'vanadium'],
        unlocks: ['aerospace', 'medical_implants', 'high_performance'],
        description: 'Lightweight, strong alloys for aerospace.',
        skillGain: 80,
        laborMultiplier: 3.0
    },
    'inconel': {
        id: 'inconel',
        name: 'Superalloy Production',
        category: 'Superalloys',
        tier: 6,
        dependencies: ['nickel', 'chromium', 'iron'],
        unlocks: ['jet_engines', 'high_temp', 'nuclear'],
        description: 'High-temperature superalloys for extreme environments.',
        skillGain: 100,
        laborMultiplier: 3.5
    },
    
    // Tier 7: Composites
    'carbon_fiber': {
        id: 'carbon_fiber',
        name: 'Carbon Fiber Production',
        category: 'Fibers',
        tier: 7,
        dependencies: ['polyacrylonitrile'],
        unlocks: ['aerospace_composites', 'sports_equipment', 'lightweight'],
        description: 'Ultra-strong, lightweight fibers.',
        skillGain: 80,
        laborMultiplier: 3.0
    },
    'epoxy_resin': {
        id: 'epoxy_resin',
        name: 'Epoxy Synthesis',
        category: 'Matrix Materials',
        tier: 7,
        dependencies: ['bisphenol_a', 'epichlorohydrin'],
        unlocks: ['adhesives', 'composites', 'coatings'],
        description: 'High-performance adhesive and matrix material.',
        skillGain: 60,
        laborMultiplier: 2.8
    },
    'carbon_composite': {
        id: 'carbon_composite',
        name: 'Carbon Fiber Composite',
        category: 'Advanced Composites',
        tier: 7,
        dependencies: ['carbon_fiber', 'epoxy_resin'],
        unlocks: ['aerospace', 'automotive', 'high_performance'],
        description: 'The ultimate lightweight structural material.',
        skillGain: 150,
        laborMultiplier: 4.0
    },
    
    // Tier 8: Semiconductors
    'silicon_wafer': {
        id: 'silicon_wafer',
        name: 'Silicon Wafer Fabrication',
        category: 'Silicon Processing',
        tier: 8,
        dependencies: ['silicon'],
        unlocks: ['doping', 'photolithography', 'chip_fabrication'],
        description: 'The foundation of all modern electronics.',
        skillGain: 60,
        laborMultiplier: 3.5
    },
    'doping': {
        id: 'doping',
        name: 'Semiconductor Doping',
        category: 'Doping',
        tier: 8,
        dependencies: ['silicon_wafer', 'boron', 'phosphorus'],
        unlocks: ['diodes', 'transistors', 'integrated_circuits'],
        description: 'Controlled introduction of impurities to create electronic properties.',
        skillGain: 80,
        laborMultiplier: 4.0
    },
    'microprocessor': {
        id: 'microprocessor',
        name: 'Microprocessor Design',
        category: 'Integrated Circuits',
        tier: 8,
        dependencies: ['doping', 'photolithography'],
        unlocks: ['computers', 'ai', 'robotics'],
        description: 'The brain of modern technology.',
        skillGain: 1000,
        laborMultiplier: 10.0
    },
    
    // Tier 9: Energy & Nanotech
    'lithium_ion': {
        id: 'lithium_ion',
        name: 'Lithium-Ion Battery',
        category: 'Energy Storage',
        tier: 9,
        dependencies: ['lithium', 'cobalt', 'graphite'],
        unlocks: ['portable_electronics', 'evs', 'grid_storage'],
        description: 'High-energy-density rechargeable batteries.',
        skillGain: 200,
        laborMultiplier: 5.0
    },
    'solar_cell': {
        id: 'solar_cell',
        name: 'Photovoltaic Cell',
        category: 'Energy Generation',
        tier: 9,
        dependencies: ['silicon_wafer', 'doping'],
        unlocks: ['solar_panels', 'renewable_energy', 'space_power'],
        description: 'Direct conversion of sunlight to electricity.',
        skillGain: 150,
        laborMultiplier: 4.5
    },
    'graphene': {
        id: 'graphene',
        name: 'Graphene Synthesis',
        category: 'Nanomaterials',
        tier: 9,
        dependencies: ['carbon'],
        unlocks: ['super_materials', 'quantum_computing', 'flexible_electronics'],
        description: 'One-atom-thick layer of carbon with extraordinary properties.',
        skillGain: 250,
        laborMultiplier: 6.0
    },
    
    // Tier 10: Exotic
    'antihydrogen': {
        id: 'antihydrogen',
        name: 'Antimatter Synthesis',
        category: 'Antimatter',
        tier: 10,
        dependencies: ['antiprotons', 'positrons'],
        unlocks: ['antimatter_power', 'propulsion', 'medical'],
        description: 'The ultimate energy source - matter-antimatter annihilation.',
        skillGain: 2000,
        laborMultiplier: 20.0
    },
    'superconductor': {
        id: 'superconductor',
        name: 'Room Temperature Superconductor',
        category: 'Exotic Materials',
        tier: 10,
        dependencies: ['complex'],
        unlocks: ['zero_resistance', 'quantum_levitation', 'transformation'],
        description: 'THE HOLY GRAIL - zero resistance at room temperature.',
        skillGain: 10000,
        laborMultiplier: 50.0
    }
};

// ===== SKILL TREE UTILITIES =====

/**
 * Get all unlocked nodes based on progress
 * @param {Object} progress - Progress object with recipe IDs as keys
 * @returns {Array} List of unlocked node IDs
 */
export function getUnlockedNodes(progress) {
    const unlocked = [];
    const totalCrafts = Object.values(progress).reduce((sum, val) => sum + val, 0);
    
    for (const [nodeId, node] of Object.entries(SKILL_TREE)) {
        // Check if all dependencies are met
        const dependenciesMet = node.dependencies.every(dep => {
            return progress[dep] > 0 || SKILL_TREE[dep]?.tier === 1;
        });
        
        // Check if category requirement is met
        const categoryReq = CATEGORY_REQUIREMENTS[node.category];
        const categoryMet = !categoryReq || totalCrafts >= categoryReq.requiredCrafts;
        
        if (dependenciesMet && categoryMet) {
            unlocked.push(nodeId);
        }
    }
    
    return unlocked;
}

/**
 * Get skill tree for display
 * @param {Object} progress - Progress object
 * @returns {Object} Skill tree with unlocked status
 */
export function getSkillTreeWithStatus(progress) {
    const unlockedNodes = getUnlockedNodes(progress);
    const tree = {};
    
    for (const [nodeId, node] of Object.entries(SKILL_TREE)) {
        tree[nodeId] = {
            ...node,
            unlocked: unlockedNodes.includes(nodeId),
            progress: progress[nodeId] || 0
        };
    }
    
    return tree;
}

/**
 * Calculate total labor multiplier from all unlocked skills
 * @param {Object} progress - Progress object
 * @returns {number} Total labor multiplier
 */
export function calculateLaborMultiplier(progress) {
    let multiplier = 1.0;
    
    for (const [nodeId, node] of Object.entries(SKILL_TREE)) {
        if (progress[nodeId] > 0) {
            multiplier += (node.laborMultiplier - 1.0) * (progress[nodeId] / 1000);
        }
    }
    
    return Math.min(50.0, multiplier);
}

/**
 * Get category progress
 * @param {string} category - Category name
 * @param {Object} progress - Progress object
 * @returns {Object} Category progress info
 */
export function getCategoryProgress(category, progress) {
    const nodes = Object.values(SKILL_TREE).filter(node => node.category === category);
    const total = nodes.length;
    const unlocked = nodes.filter(node => progress[node.id] > 0).length;
    const totalCrafts = nodes.reduce((sum, node) => sum + (progress[node.id] || 0), 0);
    
    return {
        total,
        unlocked,
        percentage: total > 0 ? (unlocked / total) * 100 : 0,
        totalCrafts,
        averageProgress: total > 0 ? totalCrafts / total : 0
    };
}

/**
 * Get next unlockable nodes
 * @param {Object} progress - Progress object
 * @returns {Array} List of nodes that can be unlocked next
 */
export function getNextUnlockable(progress) {
    const unlocked = getUnlockedNodes(progress);
    const nextUnlockable = [];
    
    for (const [nodeId, node] of Object.entries(SKILL_TREE)) {
        if (unlocked.includes(nodeId)) continue;
        
        // Check if all dependencies are met
        const dependenciesMet = node.dependencies.every(dep => {
            return unlocked.includes(dep);
        });
        
        if (dependenciesMet) {
            nextUnlockable.push(node);
        }
    }
    
    return nextUnlockable;
}

/**
 * Get skill tree path to a specific node
 * @param {string} targetNodeId - Target node ID
 * @param {Object} progress - Progress object
 * @returns {Array} Path of node IDs
 */
export function getSkillPath(targetNodeId, progress) {
    const path = [];
    const target = SKILL_TREE[targetNodeId];
    
    if (!target) return path;
    
    function traverse(nodeId) {
        const node = SKILL_TREE[nodeId];
        if (!node) return;
        
        path.push(nodeId);
        
        // Follow dependencies recursively
        for (const dep of node.dependencies) {
            if (!path.includes(dep)) {
                traverse(dep);
            }
        }
    }
    
    traverse(targetNodeId);
    return path.reverse();
}

/**
 * Get mastery level for a specific category
 * @param {string} category - Category name
 * @param {Object} progress - Progress object
 * @returns {Object} Mastery level info
 */
export function getCategoryMastery(category, progress) {
    const nodes = Object.values(SKILL_TREE).filter(node => node.category === category);
    const totalCrafts = nodes.reduce((sum, node) => sum + (progress[node.id] || 0), 0);
    
    return getLevelFromProgress(totalCrafts);
}

/**
 * Calculate labor pool contribution based on skills
 * @param {Object} progress - Progress object
 * @param {string} productCategory - Product category being purchased
 * @returns {number} Contribution multiplier
 */
export function calculateContribution(progress, productCategory) {
    let contribution = 0;
    
    for (const [nodeId, node] of Object.entries(SKILL_TREE)) {
        if (progress[nodeId] > 0 && node.category === productCategory) {
            contribution += node.laborMultiplier * (progress[nodeId] / 1000);
        }
    }
    
    return Math.max(0, contribution);
}

/**
 * Get skill tree visualization data
 * @param {Object} progress - Progress object
 * @returns {Object} Visualization data
 */
export function getVisualizationData(progress) {
    const nodes = [];
    const edges = [];
    
    for (const [nodeId, node] of Object.entries(SKILL_TREE)) {
        nodes.push({
            id: nodeId,
            label: node.name,
            category: node.category,
            tier: node.tier,
            unlocked: progress[nodeId] > 0,
            progress: progress[nodeId] || 0
        });
        
        for (const dep of node.dependencies) {
            edges.push({
                from: dep,
                to: nodeId
            });
        }
    }
    
    return { nodes, edges };
}

// ===== EXPORT ALL =====
export default {
    TIERS,
    SKILL_TREE,
    CATEGORY_REQUIREMENTS,
    getUnlockedNodes,
    getSkillTreeWithStatus,
    calculateLaborMultiplier,
    getCategoryProgress,
    getNextUnlockable,
    getSkillPath,
    getCategoryMastery,
    calculateContribution,
    getVisualizationData
};

// js/skill-multipliers.js - Skill Weighting Calculations for Labor Pool
// Handles category-specific multipliers and skill weight calculations

import { getLevelFromProgress } from './alchemy.js';

// ===== CATEGORY MULTIPLIERS =====
// Each skill category has a base multiplier and scaling factor

export const CATEGORY_MULTIPLIERS = {
    // Tier 1: Basic
    'Basic Compounds': {
        baseMultiplier: 1.0,
        scalingFactor: 0.001,
        laborWeight: 0.5,
        description: 'Foundation of all chemistry',
        icon: '💧',
        rarity: 'common'
    },
    
    // Tier 2: Acids & Bases
    'Acids & Bases': {
        baseMultiplier: 1.2,
        scalingFactor: 0.002,
        laborWeight: 1.0,
        description: 'Chemical processing and synthesis',
        icon: '🧪',
        rarity: 'uncommon'
    },
    'Salts & Minerals': {
        baseMultiplier: 1.3,
        scalingFactor: 0.002,
        laborWeight: 1.0,
        description: 'Material extraction and refinement',
        icon: '🧂',
        rarity: 'uncommon'
    },
    
    // Tier 3: Organic
    'Hydrocarbons': {
        baseMultiplier: 1.4,
        scalingFactor: 0.003,
        laborWeight: 1.5,
        description: 'Fuel and petrochemical production',
        icon: '🔥',
        rarity: 'uncommon'
    },
    'Alcohols': {
        baseMultiplier: 1.5,
        scalingFactor: 0.003,
        laborWeight: 1.5,
        description: 'Solvents and fuel additives',
        icon: '🍶',
        rarity: 'uncommon'
    },
    'Organic Acids': {
        baseMultiplier: 1.5,
        scalingFactor: 0.003,
        laborWeight: 1.5,
        description: 'Food preservation and synthesis',
        icon: '🍋',
        rarity: 'uncommon'
    },
    'Esters': {
        baseMultiplier: 1.6,
        scalingFactor: 0.003,
        laborWeight: 1.5,
        description: 'Flavors, fragrances, and solvents',
        icon: '🍏',
        rarity: 'uncommon'
    },
    'Ethers': {
        baseMultiplier: 1.6,
        scalingFactor: 0.003,
        laborWeight: 1.5,
        description: 'Anesthetics and industrial solvents',
        icon: '😷',
        rarity: 'uncommon'
    },
    'Amines': {
        baseMultiplier: 1.7,
        scalingFactor: 0.003,
        laborWeight: 1.5,
        description: 'Pharmaceuticals and dyes',
        icon: '🐟',
        rarity: 'uncommon'
    },
    
    // Tier 4: Polymers
    'Monomers': {
        baseMultiplier: 1.8,
        scalingFactor: 0.004,
        laborWeight: 2.0,
        description: 'Building blocks of plastics',
        icon: '🔗',
        rarity: 'rare'
    },
    'Polymers': {
        baseMultiplier: 2.0,
        scalingFactor: 0.004,
        laborWeight: 2.5,
        description: 'Plastic production and processing',
        icon: '🧴',
        rarity: 'rare'
    },
    'Engineering Plastics': {
        baseMultiplier: 2.2,
        scalingFactor: 0.005,
        laborWeight: 3.0,
        description: 'High-performance polymers',
        icon: '🔧',
        rarity: 'rare'
    },
    
    // Tier 5: Metallurgy
    'Basic Alloys': {
        baseMultiplier: 2.0,
        scalingFactor: 0.004,
        laborWeight: 2.5,
        description: 'Steel and common alloys',
        icon: '⚙️',
        rarity: 'rare'
    },
    'Stainless Steels': {
        baseMultiplier: 2.5,
        scalingFactor: 0.005,
        laborWeight: 3.0,
        description: 'Corrosion-resistant alloys',
        icon: '🥄',
        rarity: 'rare'
    },
    'Tool Steels': {
        baseMultiplier: 2.8,
        scalingFactor: 0.005,
        laborWeight: 3.5,
        description: 'High-hardness cutting materials',
        icon: '🔪',
        rarity: 'rare'
    },
    'Aluminum Alloys': {
        baseMultiplier: 2.3,
        scalingFactor: 0.004,
        laborWeight: 2.5,
        description: 'Lightweight structural materials',
        icon: '✈️',
        rarity: 'rare'
    },
    'Titanium Alloys': {
        baseMultiplier: 3.0,
        scalingFactor: 0.006,
        laborWeight: 4.0,
        description: 'Aerospace-grade materials',
        icon: '🚀',
        rarity: 'very-rare'
    },
    'Superalloys': {
        baseMultiplier: 3.5,
        scalingFactor: 0.007,
        laborWeight: 5.0,
        description: 'High-temperature performance',
        icon: '🔥',
        rarity: 'very-rare'
    },
    'Refractory Alloys': {
        baseMultiplier: 3.2,
        scalingFactor: 0.006,
        laborWeight: 4.5,
        description: 'Extreme temperature resistance',
        icon: '⛏️',
        rarity: 'very-rare'
    },
    
    // Tier 6: Composites
    'Fibers': {
        baseMultiplier: 2.5,
        scalingFactor: 0.005,
        laborWeight: 3.0,
        description: 'Reinforcement materials',
        icon: '🧵',
        rarity: 'rare'
    },
    'Matrix Materials': {
        baseMultiplier: 2.5,
        scalingFactor: 0.005,
        laborWeight: 3.0,
        description: 'Binding and matrix systems',
        icon: '🧴',
        rarity: 'rare'
    },
    'Composites': {
        baseMultiplier: 3.0,
        scalingFactor: 0.006,
        laborWeight: 4.0,
        description: 'Combined material systems',
        icon: '🛡️',
        rarity: 'very-rare'
    },
    'Advanced Composites': {
        baseMultiplier: 4.0,
        scalingFactor: 0.008,
        laborWeight: 6.0,
        description: 'High-performance composites',
        icon: '🚗',
        rarity: 'very-rare'
    },
    
    // Tier 7: Semiconductors
    'Silicon Processing': {
        baseMultiplier: 3.0,
        scalingFactor: 0.006,
        laborWeight: 4.0,
        description: 'Wafer fabrication',
        icon: '💎',
        rarity: 'very-rare'
    },
    'Doping': {
        baseMultiplier: 3.5,
        scalingFactor: 0.007,
        laborWeight: 5.0,
        description: 'Semiconductor doping',
        icon: '🔵',
        rarity: 'very-rare'
    },
    'Dielectrics': {
        baseMultiplier: 3.2,
        scalingFactor: 0.006,
        laborWeight: 4.5,
        description: 'Insulating layers',
        icon: '🔲',
        rarity: 'very-rare'
    },
    'Devices': {
        baseMultiplier: 4.0,
        scalingFactor: 0.008,
        laborWeight: 6.0,
        description: 'Discrete semiconductor devices',
        icon: '💻',
        rarity: 'legendary'
    },
    'Integrated Circuits': {
        baseMultiplier: 5.0,
        scalingFactor: 0.010,
        laborWeight: 8.0,
        description: 'Complex chip design',
        icon: '🧠',
        rarity: 'legendary'
    },
    
    // Tier 8: Energy & Nanotech
    'Energy Storage': {
        baseMultiplier: 4.0,
        scalingFactor: 0.008,
        laborWeight: 6.0,
        description: 'Batteries and storage systems',
        icon: '🔋',
        rarity: 'legendary'
    },
    'Energy Generation': {
        baseMultiplier: 4.5,
        scalingFactor: 0.009,
        laborWeight: 7.0,
        description: 'Power generation technologies',
        icon: '☀️',
        rarity: 'legendary'
    },
    'Nanomaterials': {
        baseMultiplier: 5.0,
        scalingFactor: 0.010,
        laborWeight: 8.0,
        description: 'Atomic-scale engineering',
        icon: '⬛',
        rarity: 'legendary'
    },
    'Smart Materials': {
        baseMultiplier: 4.5,
        scalingFactor: 0.009,
        laborWeight: 7.0,
        description: 'Responsive material systems',
        icon: '🔄',
        rarity: 'legendary'
    },
    
    // Tier 9: Exotic
    'Antimatter': {
        baseMultiplier: 8.0,
        scalingFactor: 0.020,
        laborWeight: 15.0,
        description: 'Matter-antimatter reactions',
        icon: '✨',
        rarity: 'legendary'
    },
    'Superheavy Elements': {
        baseMultiplier: 7.0,
        scalingFactor: 0.015,
        laborWeight: 12.0,
        description: 'Transuranic synthesis',
        icon: '☢️',
        rarity: 'legendary'
    },
    'Exotic Materials': {
        baseMultiplier: 10.0,
        scalingFactor: 0.025,
        laborWeight: 20.0,
        description: 'Beyond conventional matter',
        icon: '🏆',
        rarity: 'legendary'
    }
};

// ===== PRODUCT-SPECIFIC WEIGHTS =====

export const PRODUCT_SKILL_WEIGHTS = {
    // Ships
    'Frigate': {
        'Shipbuilding': 0.20,
        'Metallurgy': 0.15,
        'Propulsion': 0.15,
        'Electronics': 0.10,
        'Composites': 0.10,
        'Life Support': 0.10,
        'Chemistry': 0.05,
        'Polymers': 0.05,
        'Basic Alloys': 0.05,
        'Stainless Steels': 0.05
    },
    'Destroyer': {
        'Shipbuilding': 0.18,
        'Metallurgy': 0.12,
        'Propulsion': 0.12,
        'Electronics': 0.12,
        'Composites': 0.12,
        'Life Support': 0.08,
        'Weapons': 0.10,
        'Shields': 0.08,
        'Advanced Composites': 0.08
    },
    'Cruiser': {
        'Shipbuilding': 0.15,
        'Metallurgy': 0.10,
        'Propulsion': 0.10,
        'Electronics': 0.15,
        'Composites': 0.10,
        'Life Support': 0.05,
        'Weapons': 0.10,
        'Shields': 0.10,
        'Warp Drive': 0.15
    },
    'Dreadnought': {
        'Shipbuilding': 0.12,
        'Metallurgy': 0.08,
        'Propulsion': 0.08,
        'Electronics': 0.12,
        'Composites': 0.10,
        'Weapons': 0.15,
        'Shields': 0.15,
        'Warp Drive': 0.10,
        'Exotic Materials': 0.10
    },
    
    // Equipment
    'Mining Laser': {
        'Optics': 0.30,
        'Electronics': 0.25,
        'Metallurgy': 0.20,
        'Thermodynamics': 0.15,
        'Power Systems': 0.10
    },
    'Cargo Expander': {
        'Metallurgy': 0.30,
        'Composites': 0.30,
        'Materials Science': 0.20,
        'Engineering': 0.20
    },
    'Warp Drive MKII': {
        'Propulsion': 0.25,
        'Electronics': 0.20,
        'Exotic Matter': 0.20,
        'Quantum Physics': 0.20,
        'Superalloys': 0.15
    },
    'Shield Generator': {
        'Electronics': 0.25,
        'Physics': 0.25,
        'Exotic Matter': 0.20,
        'Nanomaterials': 0.15,
        'Power Systems': 0.15
    },
    
    // Infrastructure
    'Space Station': {
        'Construction': 0.20,
        'Metallurgy': 0.15,
        'Composites': 0.15,
        'Life Support': 0.10,
        'Power Systems': 0.10,
        'Electronics': 0.10,
        'Robotics': 0.10,
        'Nanomaterials': 0.10
    },
    'Shipyard': {
        'Construction': 0.25,
        'Metallurgy': 0.20,
        'Robotics': 0.20,
        'Electronics': 0.15,
        'Composites': 0.10,
        'Nanomaterials': 0.10
    },
    'Research Lab': {
        'Electronics': 0.25,
        'Quantum Physics': 0.20,
        'Nanomaterials': 0.20,
        'Exotic Matter': 0.20,
        'Artificial Intelligence': 0.15
    }
};

// ===== HELPER FUNCTIONS =====

/**
 * Get category multiplier based on progress
 * @param {string} category - Skill category
 * @param {number} progress - Progress in that category
 * @returns {number} Multiplier value
 */
export function getCategoryMultiplier(category, progress) {
    const config = CATEGORY_MULTIPLIERS[category];
    if (!config) return 1.0;
    
    // Multiplier scales with progress
    const progressMultiplier = 1.0 + (progress * config.scalingFactor);
    return config.baseMultiplier * progressMultiplier;
}

/**
 * Get category labor weight
 * @param {string} category - Skill category
 * @returns {number} Labor weight value
 */
export function getCategoryLaborWeight(category) {
    return CATEGORY_MULTIPLIERS[category]?.laborWeight || 1.0;
}

/**
 * Get category icon
 * @param {string} category - Skill category
 * @returns {string} Icon emoji
 */
export function getCategoryIcon(category) {
    return CATEGORY_MULTIPLIERS[category]?.icon || '⚡';
}

/**
 * Get category rarity
 * @param {string} category - Skill category
 * @returns {string} Rarity level
 */
export function getCategoryRarity(category) {
    return CATEGORY_MULTIPLIERS[category]?.rarity || 'common';
}

/**
 * Calculate player's total skill weight for a specific product
 * @param {Object} playerSkills - Player's skill progress
 * @param {string} productName - Name of the product
 * @returns {number} Total weight
 */
export function calculatePlayerProductWeight(playerSkills, productName) {
    const weights = PRODUCT_SKILL_WEIGHTS[productName];
    if (!weights) return 1.0;
    
    let totalWeight = 0;
    
    for (const [category, weight] of Object.entries(weights)) {
        const progress = playerSkills[category] || 0;
        const categoryMultiplier = getCategoryMultiplier(category, progress);
        totalWeight += weight * categoryMultiplier;
    }
    
    return totalWeight;
}

/**
 * Calculate player's overall skill weight (for general distributions)
 * @param {Object} playerSkills - Player's skill progress
 * @returns {number} Overall weight
 */
export function calculateOverallSkillWeight(playerSkills) {
    let totalWeight = 0;
    
    for (const [category, progress] of Object.entries(playerSkills)) {
        const categoryWeight = getCategoryLaborWeight(category);
        const multiplier = getCategoryMultiplier(category, progress);
        totalWeight += categoryWeight * multiplier;
    }
    
    return totalWeight;
}

/**
 * Get top skills for a player
 * @param {Object} playerSkills - Player's skill progress
 * @param {number} limit - Number of top skills to return
 * @returns {Array} Top skills with multipliers
 */
export function getTopSkills(playerSkills, limit = 5) {
    const skills = [];
    
    for (const [category, progress] of Object.entries(playerSkills)) {
        if (progress > 0 && CATEGORY_MULTIPLIERS[category]) {
            const multiplier = getCategoryMultiplier(category, progress);
            skills.push({
                category: category,
                progress: progress,
                multiplier: multiplier,
                icon: getCategoryIcon(category),
                rarity: getCategoryRarity(category)
            });
        }
    }
    
    // Sort by multiplier descending
    skills.sort((a, b) => b.multiplier - a.multiplier);
    
    return skills.slice(0, limit);
}

/**
 * Get skill tree visualization data
 * @param {Object} playerSkills - Player's skill progress
 * @returns {Array} Skill tree nodes
 */
export function getSkillTreeData(playerSkills) {
    const nodes = [];
    
    for (const [category, config] of Object.entries(CATEGORY_MULTIPLIERS)) {
        const progress = playerSkills[category] || 0;
        const multiplier = getCategoryMultiplier(category, progress);
        const level = getLevelFromProgress(progress);
        
        nodes.push({
            category: category,
            progress: progress,
            multiplier: multiplier,
            level: level.name,
            icon: config.icon,
            rarity: config.rarity,
            description: config.description,
            laborWeight: config.laborWeight
        });
    }
    
    return nodes;
}

/**
 * Calculate labor pool contribution for a player
 * @param {Object} playerSkills - Player's skill progress
 * @param {string} productCategory - Optional product category
 * @returns {Object} Contribution data
 */
export function calculateLaborContribution(playerSkills, productCategory = null) {
    let totalWeight = 0;
    let categoryBreakdown = [];
    
    if (productCategory && PRODUCT_SKILL_WEIGHTS[productCategory]) {
        // Product-specific calculation
        const weights = PRODUCT_SKILL_WEIGHTS[productCategory];
        
        for (const [category, weight] of Object.entries(weights)) {
            const progress = playerSkills[category] || 0;
            const multiplier = getCategoryMultiplier(category, progress);
            const contribution = weight * multiplier;
            
            totalWeight += contribution;
            categoryBreakdown.push({
                category: category,
                weight: weight,
                multiplier: multiplier,
                contribution: contribution
            });
        }
    } else {
        // General calculation across all skills
        for (const [category, progress] of Object.entries(playerSkills)) {
            if (progress > 0 && CATEGORY_MULTIPLIERS[category]) {
                const categoryWeight = getCategoryLaborWeight(category);
                const multiplier = getCategoryMultiplier(category, progress);
                const contribution = categoryWeight * multiplier;
                
                totalWeight += contribution;
                categoryBreakdown.push({
                    category: category,
                    categoryWeight: categoryWeight,
                    multiplier: multiplier,
                    contribution: contribution
                });
            }
        }
    }
    
    return {
        totalWeight: totalWeight,
        breakdown: categoryBreakdown.sort((a, b) => b.contribution - a.contribution),
        categories: categoryBreakdown.length
    };
}

/**
 * Get product skill weights for display
 * @param {string} productName - Product name
 * @returns {Object} Skill weights with metadata
 */
export function getProductSkillDetails(productName) {
    const weights = PRODUCT_SKILL_WEIGHTS[productName];
    if (!weights) return null;
    
    const details = [];
    
    for (const [category, weight] of Object.entries(weights)) {
        const config = CATEGORY_MULTIPLIERS[category];
        details.push({
            category: category,
            weight: weight,
            percentage: weight * 100,
            icon: config?.icon || '⚡',
            rarity: config?.rarity || 'common',
            description: config?.description || ''
        });
    }
    
    return {
        productName: productName,
        skills: details.sort((a, b) => b.weight - a.weight),
        totalWeight: Object.values(weights).reduce((sum, w) => sum + w, 0)
    };
}

/**
 * Calculate required skill level for a product
 * @param {string} productName - Product name
 * @param {Object} playerSkills - Player's skill progress
 * @returns {Object} Qualification data
 */
export function calculateProductQualification(playerSkills, productName) {
    const weights = PRODUCT_SKILL_WEIGHTS[productName];
    if (!weights) return { qualified: false, reason: 'Unknown product' };
    
    let totalQualification = 0;
    let maxPossible = 0;
    const requirements = [];
    
    for (const [category, weight] of Object.entries(weights)) {
        const progress = playerSkills[category] || 0;
        const level = getLevelFromProgress(progress);
        const multiplier = getCategoryMultiplier(category, progress);
        
        // Qualification is based on both progress and level
        const categoryQualification = Math.min(1.0, progress / 1000) * level.multiplier;
        const weightedQual = categoryQualification * weight;
        
        totalQualification += weightedQual;
        maxPossible += weight * 10; // Max possible multiplier
        
        requirements.push({
            category: category,
            required: weight,
            current: progress,
            level: level.name,
            qualification: categoryQualification,
            icon: getCategoryIcon(category)
        });
    }
    
    const qualificationPercent = (totalQualification / maxPossible) * 100;
    
    return {
        qualified: qualificationPercent >= 50, // 50% qualifies
        percent: Math.min(100, Math.round(qualificationPercent)),
        totalQualification: totalQualification,
        maxPossible: maxPossible,
        requirements: requirements.sort((a, b) => b.required - a.required)
    };
}

// ===== EXPORT ALL =====
export default {
    CATEGORY_MULTIPLIERS,
    PRODUCT_SKILL_WEIGHTS,
    getCategoryMultiplier,
    getCategoryLaborWeight,
    getCategoryIcon,
    getCategoryRarity,
    calculatePlayerProductWeight,
    calculateOverallSkillWeight,
    getTopSkills,
    getSkillTreeData,
    calculateLaborContribution,
    getProductSkillDetails,
    calculateProductQualification
};

// Attach to window for global access
window.CATEGORY_MULTIPLIERS = CATEGORY_MULTIPLIERS;
window.PRODUCT_SKILL_WEIGHTS = PRODUCT_SKILL_WEIGHTS;
window.getCategoryMultiplier = getCategoryMultiplier;
window.getCategoryLaborWeight = getCategoryLaborWeight;
window.getCategoryIcon = getCategoryIcon;
window.getCategoryRarity = getCategoryRarity;
window.calculatePlayerProductWeight = calculatePlayerProductWeight;
window.calculateOverallSkillWeight = calculateOverallSkillWeight;
window.getTopSkills = getTopSkills;
window.getSkillTreeData = getSkillTreeData;
window.calculateLaborContribution = calculateLaborContribution;
window.getProductSkillDetails = getProductSkillDetails;
window.calculateProductQualification = calculateProductQualification;

console.log('✅ skill-multipliers.js loaded - Skill weighting system ready');

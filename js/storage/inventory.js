// js/storage/inventory.js
// Inventory management for Voidfarer
// Tracks both raw elements AND crafted materials separately

import { getElementMass } from './storage.js';

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    ELEMENT_INVENTORY: 'voidfarer_collection',      // Raw elements from mining
    MATERIAL_INVENTORY: 'voidfarer_materials',      // Crafted materials
    MATERIAL_QUALITY: 'voidfarer_material_quality'  // Quality tracking for materials
};

// ============================================================================
// ELEMENT INVENTORY (Raw materials from mining)
// ============================================================================

/**
 * Get element inventory (raw mined elements)
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Element inventory object
 */
export async function getElementInventory(playerId = 'main') {
    try {
        const key = `${STORAGE_KEYS.ELEMENT_INVENTORY}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting element inventory:', error);
        return {};
    }
}

/**
 * Save element inventory
 * @param {string} playerId - Player ID
 * @param {Object} inventory - Inventory object
 * @returns {Promise<boolean>} Success status
 */
export async function saveElementInventory(playerId, inventory) {
    try {
        const key = `${STORAGE_KEYS.ELEMENT_INVENTORY}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(inventory));
        return true;
    } catch (error) {
        console.error('Error saving element inventory:', error);
        return false;
    }
}

/**
 * Add elements to inventory
 * @param {string} playerId - Player ID
 * @param {string} elementName - Element name
 * @param {number} count - Amount to add
 * @param {Object} metadata - Additional data (location, etc.)
 * @returns {Promise<Object>} Result object
 */
export async function addElementToInventory(playerId, elementName, count = 1, metadata = {}) {
    try {
        const inventory = await getElementInventory(playerId);
        
        if (!inventory[elementName]) {
            inventory[elementName] = { count: 0, firstFound: Date.now() };
        }
        
        // Handle different storage formats
        if (typeof inventory[elementName] === 'object') {
            inventory[elementName].count = (inventory[elementName].count || 0) + count;
            if (!inventory[elementName].firstFound) {
                inventory[elementName].firstFound = Date.now();
            }
        } else {
            // Legacy format (direct number)
            inventory[elementName] = {
                count: (inventory[elementName] || 0) + count,
                firstFound: Date.now()
            };
        }
        
        await saveElementInventory(playerId, inventory);
        
        return {
            success: true,
            element: elementName,
            newCount: typeof inventory[elementName] === 'object' 
                ? inventory[elementName].count 
                : inventory[elementName],
            added: count
        };
    } catch (error) {
        console.error('Error adding element to inventory:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Remove elements from inventory
 * @param {string} playerId - Player ID
 * @param {string} elementName - Element name
 * @param {number} count - Amount to remove
 * @returns {Promise<Object>} Result object
 */
export async function removeElementFromInventory(playerId, elementName, count = 1) {
    try {
        const inventory = await getElementInventory(playerId);
        
        if (!inventory[elementName]) {
            return { success: false, error: 'Element not found' };
        }
        
        let currentCount;
        if (typeof inventory[elementName] === 'object') {
            currentCount = inventory[elementName].count || 0;
        } else {
            currentCount = inventory[elementName];
        }
        
        if (currentCount < count) {
            return { 
                success: false, 
                error: 'Insufficient quantity',
                available: currentCount,
                required: count
            };
        }
        
        // Update count
        if (typeof inventory[elementName] === 'object') {
            inventory[elementName].count = currentCount - count;
            if (inventory[elementName].count <= 0) {
                delete inventory[elementName];
            }
        } else {
            const newCount = currentCount - count;
            if (newCount <= 0) {
                delete inventory[elementName];
            } else {
                inventory[elementName] = newCount;
            }
        }
        
        await saveElementInventory(playerId, inventory);
        
        return {
            success: true,
            element: elementName,
            removed: count,
            remaining: currentCount - count
        };
    } catch (error) {
        console.error('Error removing element from inventory:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// MATERIAL INVENTORY (Crafted items)
// ============================================================================

/**
 * Get material inventory (crafted items)
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Material inventory object
 */
export async function getMaterialInventory(playerId = 'main') {
    try {
        const key = `${STORAGE_KEYS.MATERIAL_INVENTORY}_${playerId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting material inventory:', error);
        return {};
    }
}

/**
 * Save material inventory
 * @param {string} playerId - Player ID
 * @param {Object} inventory - Inventory object
 * @returns {Promise<boolean>} Success status
 */
export async function saveMaterialInventory(playerId, inventory) {
    try {
        const key = `${STORAGE_KEYS.MATERIAL_INVENTORY}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(inventory));
        return true;
    } catch (error) {
        console.error('Error saving material inventory:', error);
        return false;
    }
}

/**
 * Add crafted material to inventory
 * @param {string} playerId - Player ID
 * @param {string} materialId - Material ID (e.g., 'steel_high')
 * @param {number} count - Amount to add
 * @param {Object} metadata - Material metadata (quality, recipe, etc.)
 * @returns {Promise<Object>} Result object
 */
export async function addMaterialToInventory(playerId, materialId, count = 1, metadata = {}) {
    try {
        const inventory = await getMaterialInventory(playerId);
        
        if (!inventory[materialId]) {
            inventory[materialId] = {
                count: 0,
                firstCrafted: Date.now(),
                ...metadata
            };
        } else {
            inventory[materialId].count += count;
            // Keep original metadata but update last crafted
            inventory[materialId].lastCrafted = Date.now();
        }
        
        await saveMaterialInventory(playerId, inventory);
        
        return {
            success: true,
            materialId: materialId,
            name: metadata.name || materialId,
            quality: metadata.quality || 'Standard',
            newCount: inventory[materialId].count,
            added: count
        };
    } catch (error) {
        console.error('Error adding material to inventory:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Remove material from inventory
 * @param {string} playerId - Player ID
 * @param {string} materialId - Material ID
 * @param {number} count - Amount to remove
 * @returns {Promise<Object>} Result object
 */
export async function removeMaterialFromInventory(playerId, materialId, count = 1) {
    try {
        const inventory = await getMaterialInventory(playerId);
        
        if (!inventory[materialId]) {
            return { success: false, error: 'Material not found' };
        }
        
        if (inventory[materialId].count < count) {
            return { 
                success: false, 
                error: 'Insufficient quantity',
                available: inventory[materialId].count,
                required: count
            };
        }
        
        inventory[materialId].count -= count;
        
        if (inventory[materialId].count <= 0) {
            delete inventory[materialId];
        }
        
        await saveMaterialInventory(playerId, inventory);
        
        return {
            success: true,
            materialId: materialId,
            removed: count,
            remaining: inventory[materialId]?.count || 0
        };
    } catch (error) {
        console.error('Error removing material from inventory:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// QUALITY TRACKING
// ============================================================================

/**
 * Get quality distribution for a material
 * @param {string} playerId - Player ID
 * @param {string} baseRecipeId - Base recipe ID (without quality)
 * @returns {Promise<Object>} Quality distribution
 */
export async function getMaterialQualityDistribution(playerId, baseRecipeId) {
    try {
        const inventory = await getMaterialInventory(playerId);
        const distribution = {
            Poor: 0,
            Standard: 0,
            High: 0,
            Perfect: 0,
            Legendary: 0
        };
        
        for (const [materialId, data] of Object.entries(inventory)) {
            if (materialId.startsWith(baseRecipeId)) {
                const quality = data.quality || 'Standard';
                distribution[quality] += data.count;
            }
        }
        
        return distribution;
    } catch (error) {
        console.error('Error getting quality distribution:', error);
        return null;
    }
}

/**
 * Get best quality available for a material
 * @param {string} playerId - Player ID
 * @param {string} baseRecipeId - Base recipe ID
 * @returns {Promise<Object>} Best quality material
 */
export async function getBestQualityMaterial(playerId, baseRecipeId) {
    try {
        const inventory = await getMaterialInventory(playerId);
        const qualityOrder = ['Legendary', 'Perfect', 'High', 'Standard', 'Poor'];
        
        for (const quality of qualityOrder) {
            const materialId = `${baseRecipeId}_${quality.toLowerCase()}`;
            if (inventory[materialId] && inventory[materialId].count > 0) {
                return {
                    materialId,
                    quality,
                    count: inventory[materialId].count,
                    metadata: inventory[materialId]
                };
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error getting best quality material:', error);
        return null;
    }
}

// ============================================================================
// UNIVERSAL INVENTORY FUNCTIONS
// ============================================================================

/**
 * Get combined inventory (elements + materials)
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Combined inventory
 */
export async function getCombinedInventory(playerId = 'main') {
    try {
        const elements = await getElementInventory(playerId);
        const materials = await getMaterialInventory(playerId);
        
        return {
            elements,
            materials,
            totalElements: Object.keys(elements).length,
            totalMaterials: Object.keys(materials).length
        };
    } catch (error) {
        console.error('Error getting combined inventory:', error);
        return { elements: {}, materials: {}, totalElements: 0, totalMaterials: 0 };
    }
}

/**
 * Get inventory (alias for backward compatibility)
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Combined inventory
 */
export async function getInventory(playerId = 'main') {
    return getCombinedInventory(playerId);
}

/**
 * Check if player has enough ingredients
 * @param {string} playerId - Player ID
 * @param {Object} required - Required ingredients { itemId: amount }
 * @returns {Promise<boolean>} True if has enough
 */
export async function hasEnoughIngredients(playerId, required) {
    try {
        const elements = await getElementInventory(playerId);
        const materials = await getMaterialInventory(playerId);
        
        for (const [item, amount] of Object.entries(required)) {
            // Check if it's an element (raw)
            if (elements[item]) {
                const available = typeof elements[item] === 'object' 
                    ? elements[item].count 
                    : elements[item];
                if (available < amount) return false;
            }
            // Check if it's a material (crafted)
            else if (materials[item]) {
                if (materials[item].count < amount) return false;
            }
            else {
                return false; // Item not found
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error checking ingredients:', error);
        return false;
    }
}

/**
 * Get available count of a specific item
 * @param {string} playerId - Player ID
 * @param {string} itemId - Item ID
 * @returns {Promise<number>} Available count
 */
export async function getItemCount(playerId, itemId) {
    try {
        const elements = await getElementInventory(playerId);
        const materials = await getMaterialInventory(playerId);
        
        if (elements[itemId]) {
            return typeof elements[itemId] === 'object' 
                ? elements[itemId].count 
                : elements[itemId];
        }
        
        if (materials[itemId]) {
            return materials[itemId].count;
        }
        
        return 0;
    } catch (error) {
        console.error('Error getting item count:', error);
        return 0;
    }
}

/**
 * Get total inventory value
 * @param {string} playerId - Player ID
 * @param {Object} priceMap - Price mapping for items
 * @returns {Promise<number>} Total value
 */
export async function getTotalInventoryValue(playerId, priceMap = {}) {
    try {
        const elements = await getElementInventory(playerId);
        const materials = await getMaterialInventory(playerId);
        let total = 0;
        
        // Calculate element values
        for (const [element, data] of Object.entries(elements)) {
            const count = typeof data === 'object' ? data.count : data;
            const price = priceMap[element] || 100; // Default price
            total += count * price;
        }
        
        // Calculate material values
        for (const [material, data] of Object.entries(materials)) {
            const price = data.value || priceMap[material] || 1000; // Default material price
            total += data.count * price;
        }
        
        return total;
    } catch (error) {
        console.error('Error calculating inventory value:', error);
        return 0;
    }
}

/**
 * Clear all inventory (for reset)
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success status
 */
export async function clearInventory(playerId = 'main') {
    try {
        const elementKey = `${STORAGE_KEYS.ELEMENT_INVENTORY}_${playerId}`;
        const materialKey = `${STORAGE_KEYS.MATERIAL_INVENTORY}_${playerId}`;
        const qualityKey = `${STORAGE_KEYS.MATERIAL_QUALITY}_${playerId}`;
        
        localStorage.removeItem(elementKey);
        localStorage.removeItem(materialKey);
        localStorage.removeItem(qualityKey);
        
        return true;
    } catch (error) {
        console.error('Error clearing inventory:', error);
        return false;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    // Element inventory
    getElementInventory,
    saveElementInventory,
    addElementToInventory,
    removeElementFromInventory,
    
    // Material inventory
    getMaterialInventory,
    saveMaterialInventory,
    addMaterialToInventory,
    removeMaterialFromInventory,
    
    // Quality tracking
    getMaterialQualityDistribution,
    getBestQualityMaterial,
    
    // Universal functions
    getInventory,
    getCombinedInventory,
    hasEnoughIngredients,
    getItemCount,
    getTotalInventoryValue,
    clearInventory
};

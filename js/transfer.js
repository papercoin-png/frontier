// js/transfer.js - Transfer logic between ship cargo and Earth Hub storage
// Requires storage.js to be loaded first

// ===== TRANSFER FUNCTIONS =====

/**
 * Transfer items from ship cargo to Earth Hub storage
 * @param {string} elementName - Name of element to transfer
 * @param {number} quantity - Quantity to transfer
 * @returns {Promise<Object>} Result object with success status and details
 */
async function transferShipToHub(elementName, quantity) {
    try {
        console.log(`🔄 Transferring ${quantity}x ${elementName} from ship to hub...`);
        
        // Check if at Earth
        if (!isAtEarth()) {
            return { 
                success: false, 
                reason: 'not_at_earth', 
                message: 'You must be at Earth to transfer items to hub' 
            };
        }
        
        // Validate inputs
        if (!elementName || quantity <= 0) {
            return { 
                success: false, 
                reason: 'invalid_input', 
                message: 'Invalid element name or quantity' 
            };
        }
        
        // Get element mass
        const massPerUnit = getElementMass(elementName);
        const massToTransfer = quantity * massPerUnit;
        
        // Check hub space
        const remainingHub = await getRemainingHubStorage();
        if (massToTransfer > remainingHub) {
            return { 
                success: false, 
                reason: 'insufficient_hub_space', 
                remaining: remainingHub, 
                required: massToTransfer,
                message: `Not enough hub space. Need ${massToTransfer.toFixed(1)} AMU, have ${remainingHub.toFixed(1)} AMU`
            };
        }
        
        // Check if item exists in ship cargo
        const collection = await getCollection();
        if (!collection[elementName]) {
            return { 
                success: false, 
                reason: 'not_found_ship', 
                message: `${elementName} not found in ship cargo` 
            };
        }
        
        const availableCount = collection[elementName].count || 1;
        if (availableCount < quantity) {
            return { 
                success: false, 
                reason: 'insufficient_ship', 
                available: availableCount,
                message: `Only ${availableCount} ${elementName} available in ship cargo` 
            };
        }
        
        // Remove from ship
        const removeResult = await removeElementFromCollection(elementName, quantity);
        if (!removeResult.success) {
            return { 
                success: false, 
                reason: 'remove_failed', 
                error: removeResult.error,
                message: 'Failed to remove items from ship' 
            };
        }
        
        // Add to hub
        const addResult = await addElementToHub(elementName, quantity);
        if (!addResult.success) {
            // Rollback ship removal
            await addElementToCollection(elementName, quantity);
            return { 
                success: false, 
                reason: 'add_failed', 
                error: addResult.error,
                message: 'Failed to add items to hub' 
            };
        }
        
        // Success
        console.log(`✅ Successfully transferred ${quantity}x ${elementName} to hub`);
        
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('transfer-completed', {
            detail: {
                direction: 'ship_to_hub',
                elementName: elementName,
                quantity: quantity,
                mass: massToTransfer
            }
        }));
        
        return { 
            success: true, 
            quantity: quantity,
            elementName: elementName,
            massTransferred: massToTransfer
        };
        
    } catch (error) {
        console.error('❌ Error in transferShipToHub:', error);
        return { 
            success: false, 
            reason: 'error', 
            error: error.message,
            message: 'An error occurred during transfer' 
        };
    }
}

/**
 * Transfer items from Earth Hub storage to ship cargo
 * @param {string} elementName - Name of element to transfer
 * @param {number} quantity - Quantity to transfer
 * @returns {Promise<Object>} Result object with success status and details
 */
async function transferHubToShip(elementName, quantity) {
    try {
        console.log(`🔄 Transferring ${quantity}x ${elementName} from hub to ship...`);
        
        // Check if at Earth
        if (!isAtEarth()) {
            return { 
                success: false, 
                reason: 'not_at_earth', 
                message: 'You must be at Earth to transfer items from hub' 
            };
        }
        
        // Validate inputs
        if (!elementName || quantity <= 0) {
            return { 
                success: false, 
                reason: 'invalid_input', 
                message: 'Invalid element name or quantity' 
            };
        }
        
        // Get element mass
        const massPerUnit = getElementMass(elementName);
        const massToTransfer = quantity * massPerUnit;
        
        // Check ship space
        const remainingShip = await getRemainingShipStorage();
        if (massToTransfer > remainingShip) {
            return { 
                success: false, 
                reason: 'insufficient_ship_space', 
                remaining: remainingShip, 
                required: massToTransfer,
                message: `Not enough ship space. Need ${massToTransfer.toFixed(1)} AMU, have ${remainingShip.toFixed(1)} AMU`
            };
        }
        
        // Check if item exists in hub
        const hubInventory = await getHubInventory();
        if (!hubInventory[elementName]) {
            return { 
                success: false, 
                reason: 'not_found_hub', 
                message: `${elementName} not found in hub storage` 
            };
        }
        
        const availableCount = hubInventory[elementName].count || 0;
        if (availableCount < quantity) {
            return { 
                success: false, 
                reason: 'insufficient_hub', 
                available: availableCount,
                message: `Only ${availableCount} ${elementName} available in hub storage` 
            };
        }
        
        // Remove from hub
        const removeResult = await removeElementFromHub(elementName, quantity);
        if (!removeResult.success) {
            return { 
                success: false, 
                reason: 'remove_failed', 
                error: removeResult.error,
                message: 'Failed to remove items from hub' 
            };
        }
        
        // Add to ship
        const addResult = await addElementToCollection(elementName, quantity);
        if (!addResult.success) {
            // Rollback hub removal
            await addElementToHub(elementName, quantity);
            return { 
                success: false, 
                reason: 'add_failed', 
                error: addResult.error,
                message: 'Failed to add items to ship' 
            };
        }
        
        // Success
        console.log(`✅ Successfully transferred ${quantity}x ${elementName} to ship`);
        
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('transfer-completed', {
            detail: {
                direction: 'hub_to_ship',
                elementName: elementName,
                quantity: quantity,
                mass: massToTransfer
            }
        }));
        
        return { 
            success: true, 
            quantity: quantity,
            elementName: elementName,
            massTransferred: massToTransfer
        };
        
    } catch (error) {
        console.error('❌ Error in transferHubToShip:', error);
        return { 
            success: false, 
            reason: 'error', 
            error: error.message,
            message: 'An error occurred during transfer' 
        };
    }
}

/**
 * Transfer multiple items at once
 * @param {Array} transfers - Array of {elementName, quantity} objects
 * @param {string} direction - 'ship_to_hub' or 'hub_to_ship'
 * @returns {Promise<Object>} Result object with summary
 */
async function bulkTransfer(transfers, direction) {
    try {
        console.log(`🔄 Bulk transfer started: ${direction}`);
        
        // Check if at Earth
        if (!isAtEarth()) {
            return { 
                success: false, 
                reason: 'not_at_earth', 
                message: 'You must be at Earth to transfer items' 
            };
        }
        
        if (!transfers || transfers.length === 0) {
            return { 
                success: false, 
                reason: 'no_items', 
                message: 'No items to transfer' 
            };
        }
        
        let successCount = 0;
        let failCount = 0;
        let totalMass = 0;
        const results = [];
        
        for (const transfer of transfers) {
            let result;
            
            if (direction === 'ship_to_hub') {
                result = await transferShipToHub(transfer.elementName, transfer.quantity);
            } else {
                result = await transferHubToShip(transfer.elementName, transfer.quantity);
            }
            
            results.push({
                ...transfer,
                success: result.success,
                reason: result.reason
            });
            
            if (result.success) {
                successCount++;
                totalMass += result.massTransferred || 0;
            } else {
                failCount++;
            }
        }
        
        console.log(`✅ Bulk transfer complete: ${successCount} succeeded, ${failCount} failed`);
        
        return {
            success: failCount === 0,
            successCount: successCount,
            failCount: failCount,
            totalMass: totalMass,
            results: results
        };
        
    } catch (error) {
        console.error('❌ Error in bulkTransfer:', error);
        return { 
            success: false, 
            reason: 'error', 
            error: error.message 
        };
    }
}

/**
 * Transfer all items of a specific rarity
 * @param {string} rarity - Rarity to transfer ('common', 'uncommon', 'rare', 'very-rare', 'legendary')
 * @param {string} direction - 'ship_to_hub' or 'hub_to_ship'
 * @returns {Promise<Object>} Result object with summary
 */
async function transferByRarity(rarity, direction) {
    try {
        console.log(`🔄 Transferring all ${rarity} items ${direction === 'ship_to_hub' ? 'to hub' : 'to ship'}`);
        
        // Check if at Earth
        if (!isAtEarth()) {
            return { 
                success: false, 
                reason: 'not_at_earth', 
                message: 'You must be at Earth to transfer items' 
            };
        }
        
        let items = [];
        let sourceInventory = {};
        
        if (direction === 'ship_to_hub') {
            sourceInventory = await getCollection();
        } else {
            sourceInventory = await getHubInventory();
        }
        
        // Filter by rarity
        for (const [name, data] of Object.entries(sourceInventory)) {
            const itemRarity = getElementRarity(name);
            if (rarity === 'all' || itemRarity === rarity) {
                items.push({
                    elementName: name,
                    quantity: data.count || 1
                });
            }
        }
        
        if (items.length === 0) {
            return {
                success: false,
                reason: 'no_items',
                message: `No ${rarity} items found`
            };
        }
        
        // Perform bulk transfer
        const result = await bulkTransfer(items, direction);
        
        return result;
        
    } catch (error) {
        console.error('❌ Error in transferByRarity:', error);
        return { 
            success: false, 
            reason: 'error', 
            error: error.message 
        };
    }
}

/**
 * Get transfer summary (how many items can be transferred)
 * @param {string} direction - 'ship_to_hub' or 'hub_to_ship'
 * @returns {Promise<Object>} Summary object
 */
async function getTransferSummary(direction) {
    try {
        const summary = {
            totalItems: 0,
            totalMass: 0,
            items: [],
            availableSpace: 0
        };
        
        if (direction === 'ship_to_hub') {
            // From ship to hub
            summary.availableSpace = await getRemainingHubStorage();
            
            const collection = await getCollection();
            for (const [name, data] of Object.entries(collection)) {
                const count = data.count || 1;
                const massPerUnit = getElementMass(name);
                const totalMass = count * massPerUnit;
                
                summary.totalItems += count;
                summary.totalMass += totalMass;
                
                summary.items.push({
                    name: name,
                    count: count,
                    massPerUnit: massPerUnit,
                    totalMass: totalMass,
                    rarity: getElementRarity(name),
                    value: getElementValue(name)
                });
            }
            
        } else {
            // From hub to ship
            summary.availableSpace = await getRemainingShipStorage();
            
            const hubInventory = await getHubInventory();
            for (const [name, data] of Object.entries(hubInventory)) {
                const count = data.count || 1;
                const massPerUnit = getElementMass(name);
                const totalMass = count * massPerUnit;
                
                summary.totalItems += count;
                summary.totalMass += totalMass;
                
                summary.items.push({
                    name: name,
                    count: count,
                    massPerUnit: massPerUnit,
                    totalMass: totalMass,
                    rarity: getElementRarity(name),
                    value: getElementValue(name)
                });
            }
        }
        
        // Sort items by mass (largest first)
        summary.items.sort((a, b) => b.totalMass - a.totalMass);
        
        return summary;
        
    } catch (error) {
        console.error('❌ Error in getTransferSummary:', error);
        return null;
    }
}

/**
 * Check if transfer is possible for a specific item
 * @param {string} elementName - Element name
 * @param {number} quantity - Quantity to transfer
 * @param {string} direction - 'ship_to_hub' or 'hub_to_ship'
 * @returns {Promise<Object>} Result with possible flag and reason
 */
async function canTransfer(elementName, quantity, direction) {
    try {
        // Check if at Earth
        if (!isAtEarth()) {
            return {
                possible: false,
                reason: 'not_at_earth',
                message: 'Must be at Earth to transfer'
            };
        }
        
        const massPerUnit = getElementMass(elementName);
        const massToTransfer = quantity * massPerUnit;
        
        if (direction === 'ship_to_hub') {
            // Check hub space
            const remainingHub = await getRemainingHubStorage();
            if (massToTransfer > remainingHub) {
                return {
                    possible: false,
                    reason: 'insufficient_space',
                    message: `Not enough hub space. Need ${massToTransfer.toFixed(1)} AMU, have ${remainingHub.toFixed(1)} AMU`,
                    required: massToTransfer,
                    available: remainingHub
                };
            }
            
            // Check ship has item
            const collection = await getCollection();
            if (!collection[elementName]) {
                return {
                    possible: false,
                    reason: 'not_found',
                    message: `${elementName} not in ship cargo`
                };
            }
            
            const available = collection[elementName].count || 1;
            if (available < quantity) {
                return {
                    possible: false,
                    reason: 'insufficient_quantity',
                    message: `Only ${available} ${elementName} available`,
                    available: available
                };
            }
            
        } else {
            // Check ship space
            const remainingShip = await getRemainingShipStorage();
            if (massToTransfer > remainingShip) {
                return {
                    possible: false,
                    reason: 'insufficient_space',
                    message: `Not enough ship space. Need ${massToTransfer.toFixed(1)} AMU, have ${remainingShip.toFixed(1)} AMU`,
                    required: massToTransfer,
                    available: remainingShip
                };
            }
            
            // Check hub has item
            const hubInventory = await getHubInventory();
            if (!hubInventory[elementName]) {
                return {
                    possible: false,
                    reason: 'not_found',
                    message: `${elementName} not in hub storage`
                };
            }
            
            const available = hubInventory[elementName].count || 0;
            if (available < quantity) {
                return {
                    possible: false,
                    reason: 'insufficient_quantity',
                    message: `Only ${available} ${elementName} available`,
                    available: available
                };
            }
        }
        
        return {
            possible: true,
            message: 'Transfer possible'
        };
        
    } catch (error) {
        console.error('❌ Error in canTransfer:', error);
        return {
            possible: false,
            reason: 'error',
            message: 'Error checking transfer possibility'
        };
    }
}

// ===== EXPORT FUNCTIONS TO WINDOW =====
window.transferShipToHub = transferShipToHub;
window.transferHubToShip = transferHubToShip;
window.bulkTransfer = bulkTransfer;
window.transferByRarity = transferByRarity;
window.getTransferSummary = getTransferSummary;
window.canTransfer = canTransfer;
window.addElementToCollection = addElementToCollection;  // ADDED: Expose the function for surface.html

console.log('✅ Transfer.js loaded - Ship/Hub transfer functions ready');

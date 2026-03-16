// js/claim-system.js
// Core claim logic for Voidfarer
// Handles claim verification, fee calculation, transaction recording, and ownership management

// ===== STORAGE KEYS =====
const CLAIM_STORAGE_KEYS = {
    PLANET_CLAIMS: 'voidfarer_planet_claims',           // All claims by planet name
    PLAYER_CLAIMS: 'voidfarer_player_claims',           // Claims by player ID
    CLAIM_HISTORY: 'voidfarer_claim_history',           // All claim/mining transactions
    CLAIM_NOTIFICATIONS: 'voidfarer_claim_notifications' // Global notifications
};

// ===== FEE CONFIGURATION =====
const FEE_CONFIG = {
    VERY_RARE: 8,   // 8% fee for Very Rare discoveries
    LEGENDARY: 10,  // 10% fee for Legendary discoveries
    DEFAULT: 10,    // Default fee if rarity not specified
    MIN_FEE: 1,     // Minimum allowed fee (1%)
    MAX_FEE: 20     // Maximum allowed fee (20%)
};

// ===== RARITY LEVELS =====
const RARITY_LEVELS = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    VERY_RARE: 'very-rare',
    LEGENDARY: 'legendary'
};

// ============================================================================
// CORE CLAIM FUNCTIONS
// ============================================================================

/**
 * Check if a planet is claimed
 * @param {string} planetName - Name of the planet to check
 * @returns {Promise<boolean>} True if planet is claimed
 */
export async function isPlanetClaimed(planetName) {
    try {
        const claims = await getPlanetClaims();
        return !!claims[planetName];
    } catch (error) {
        console.error(`Error checking if planet ${planetName} is claimed:`, error);
        return false;
    }
}

/**
 * Get claim data for a specific planet
 * @param {string} planetName - Name of the planet
 * @returns {Promise<Object|null>} Claim data or null if not claimed
 */
export async function getPlanetClaim(planetName) {
    try {
        const claims = await getPlanetClaims();
        return claims[planetName] || null;
    } catch (error) {
        console.error(`Error getting claim for planet ${planetName}:`, error);
        return null;
    }
}

/**
 * Get all planet claims
 * @returns {Promise<Object>} Object with planet names as keys and claim data as values
 */
export async function getPlanetClaims() {
    try {
        const saved = localStorage.getItem(CLAIM_STORAGE_KEYS.PLANET_CLAIMS);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting planet claims:', error);
        return {};
    }
}

/**
 * Save all planet claims
 * @param {Object} claims - Claims object to save
 * @returns {Promise<boolean>} Success status
 */
export async function savePlanetClaims(claims) {
    try {
        localStorage.setItem(CLAIM_STORAGE_KEYS.PLANET_CLAIMS, JSON.stringify(claims));
        return true;
    } catch (error) {
        console.error('Error saving planet claims:', error);
        return false;
    }
}

/**
 * Claim a planet
 * @param {string} planetName - Name of the planet to claim
 * @param {string} playerId - ID of the player claiming
 * @param {string} playerName - Display name of the player
 * @param {string} discoveredElement - Element that triggered the claim
 * @param {string} rarity - Rarity of the discovered element (very-rare or legendary)
 * @param {Object} locationData - Additional location data (sector coordinates, etc.)
 * @returns {Promise<Object>} Result object with success status and claim data
 */
export async function claimPlanet(planetName, playerId, playerName, discoveredElement, rarity, locationData = {}) {
    try {
        console.log(`Attempting to claim planet ${planetName} for player ${playerName}`);

        // Validate inputs
        if (!planetName || !playerId || !playerName) {
            return { success: false, error: 'Missing required claim data' };
        }

        // Check if already claimed
        const existingClaim = await getPlanetClaim(planetName);
        if (existingClaim) {
            return { success: false, error: 'Planet already claimed' };
        }

        // Get current claims
        const claims = await getPlanetClaims();

        // Determine base fee from rarity
        let baseFee = FEE_CONFIG.DEFAULT;
        if (rarity === RARITY_LEVELS.VERY_RARE) {
            baseFee = FEE_CONFIG.VERY_RARE;
        } else if (rarity === RARITY_LEVELS.LEGENDARY) {
            baseFee = FEE_CONFIG.LEGENDARY;
        }

        // Get current sector coordinates
        const sectorX = locationData.sectorX || parseInt(localStorage.getItem('voidfarer_current_sector_x')) || 30;
        const sectorY = locationData.sectorY || parseInt(localStorage.getItem('voidfarer_current_sector_y')) || 40;
        
        // Get planet type
        const planetType = locationData.planetType || localStorage.getItem('voidfarer_current_planet_type') || 'unknown';

        // Create claim record
        const claimRecord = {
            planetName: planetName,
            planetType: planetType,
            ownerId: playerId,
            ownerName: playerName,
            discoveredElement: discoveredElement || 'Unknown',
            rarity: rarity || RARITY_LEVELS.COMMON,
            baseFee: baseFee,
            currentFee: baseFee,
            claimedAt: Date.now(),
            claimedDate: new Date().toISOString(),
            lastFeeUpdate: Date.now(),
            totalEarned: 0,
            totalMiners: 0,
            uniqueMiners: [], // Array of miner IDs who have paid fees
            sectorX: sectorX,
            sectorY: sectorY,
            lastActivity: null,
            transactionCount: 0
        };

        // Save to planet claims
        claims[planetName] = claimRecord;
        await savePlanetClaims(claims);

        // Update player claims index
        await addToPlayerClaims(playerId, planetName);

        // Dispatch event for UI update
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('planet-claimed', {
                detail: { planetName, ownerName: playerName, discoveredElement, rarity }
            });
            window.dispatchEvent(event);
        }

        console.log(`Planet ${planetName} successfully claimed by ${playerName}!`);
        
        return { 
            success: true, 
            claim: claimRecord,
            message: `You now own ${planetName}! Miners will pay you ${baseFee}% fees.`
        };

    } catch (error) {
        console.error(`Error claiming planet ${planetName}:`, error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// PLAYER CLAIMS INDEX FUNCTIONS
// ============================================================================

/**
 * Get player claims index
 * @returns {Promise<Object>} Object with player IDs as keys and arrays of planet names as values
 */
export async function getPlayerClaimsIndex() {
    try {
        const saved = localStorage.getItem(CLAIM_STORAGE_KEYS.PLAYER_CLAIMS);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting player claims index:', error);
        return {};
    }
}

/**
 * Save player claims index
 * @param {Object} index - Player claims index to save
 * @returns {Promise<boolean>} Success status
 */
export async function savePlayerClaimsIndex(index) {
    try {
        localStorage.setItem(CLAIM_STORAGE_KEYS.PLAYER_CLAIMS, JSON.stringify(index));
        return true;
    } catch (error) {
        console.error('Error saving player claims index:', error);
        return false;
    }
}

/**
 * Add a planet to a player's claims index
 * @param {string} playerId - ID of the player
 * @param {string} planetName - Name of the planet
 * @returns {Promise<boolean>} Success status
 */
export async function addToPlayerClaims(playerId, planetName) {
    try {
        const index = await getPlayerClaimsIndex();
        
        if (!index[playerId]) {
            index[playerId] = [];
        }
        
        if (!index[playerId].includes(planetName)) {
            index[playerId].push(planetName);
        }
        
        return await savePlayerClaimsIndex(index);
    } catch (error) {
        console.error(`Error adding planet ${planetName} to player ${playerId} claims:`, error);
        return false;
    }
}

/**
 * Remove a planet from a player's claims index
 * @param {string} playerId - ID of the player
 * @param {string} planetName - Name of the planet
 * @returns {Promise<boolean>} Success status
 */
export async function removeFromPlayerClaims(playerId, planetName) {
    try {
        const index = await getPlayerClaimsIndex();
        
        if (index[playerId]) {
            index[playerId] = index[playerId].filter(p => p !== planetName);
        }
        
        return await savePlayerClaimsIndex(index);
    } catch (error) {
        console.error(`Error removing planet ${planetName} from player ${playerId} claims:`, error);
        return false;
    }
}

/**
 * Get all claims for a specific player
 * @param {string} playerId - ID of the player
 * @returns {Promise<Array>} Array of claim objects
 */
export async function getPlayerClaims(playerId) {
    try {
        const index = await getPlayerClaimsIndex();
        const planetNames = index[playerId] || [];
        
        if (planetNames.length === 0) {
            return [];
        }
        
        const claims = await getPlanetClaims();
        
        return planetNames
            .map(name => claims[name])
            .filter(claim => claim !== undefined);
    } catch (error) {
        console.error(`Error getting claims for player ${playerId}:`, error);
        return [];
    }
}

// ============================================================================
// CLAIM HISTORY FUNCTIONS
// ============================================================================

/**
 * Get claim history
 * @returns {Promise<Array>} Array of transaction records
 */
export async function getClaimHistory() {
    try {
        const saved = localStorage.getItem(CLAIM_STORAGE_KEYS.CLAIM_HISTORY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error getting claim history:', error);
        return [];
    }
}

/**
 * Save claim history
 * @param {Array} history - History array to save
 * @returns {Promise<boolean>} Success status
 */
export async function saveClaimHistory(history) {
    try {
        // Keep only last 5000 transactions to prevent storage issues
        if (history.length > 5000) {
            history = history.slice(-5000);
        }
        localStorage.setItem(CLAIM_STORAGE_KEYS.CLAIM_HISTORY, JSON.stringify(history));
        return true;
    } catch (error) {
        console.error('Error saving claim history:', error);
        return false;
    }
}

/**
 * Record a mining activity transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} Result object with success status
 */
export async function recordMiningActivity(transactionData) {
    try {
        // Validate required fields
        const required = ['planetName', 'minerId', 'ownerId', 'element', 'quantity', 'feeValue'];
        for (const field of required) {
            if (!transactionData[field]) {
                return { success: false, error: `Missing required field: ${field}` };
            }
        }

        // Get existing history
        const history = await getClaimHistory();

        // Create transaction record
        const transaction = {
            id: generateTransactionId(),
            type: 'mining_fee',
            planetName: transactionData.planetName,
            minerId: transactionData.minerId,
            ownerId: transactionData.ownerId,
            element: transactionData.element,
            quantity: transactionData.quantity,
            marketPrice: transactionData.marketPrice || 0,
            feeValue: transactionData.feeValue,
            timestamp: Date.now(),
            date: new Date().toISOString()
        };

        // Add to history
        history.push(transaction);
        await saveClaimHistory(history);

        // Update planet earnings
        await addMiningEarnings(
            transactionData.planetName,
            transactionData.feeValue,
            transactionData.minerId
        );

        return { success: true, transaction };
    } catch (error) {
        console.error('Error recording mining activity:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Generate a unique transaction ID
 * @returns {string} Unique transaction ID
 */
function generateTransactionId() {
    return 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================================================
// CLAIM UPDATE FUNCTIONS
// ============================================================================

/**
 * Update a planet claim
 * @param {string} planetName - Name of the planet
 * @param {Object} updates - Updates to apply
 * @returns {Promise<boolean>} Success status
 */
export async function updatePlanetClaim(planetName, updates) {
    try {
        const claims = await getPlanetClaims();
        
        if (!claims[planetName]) {
            return false;
        }

        // Apply updates
        claims[planetName] = {
            ...claims[planetName],
            ...updates,
            lastFeeUpdate: updates.currentFee ? Date.now() : claims[planetName].lastFeeUpdate
        };

        await savePlanetClaims(claims);
        return true;
    } catch (error) {
        console.error(`Error updating claim for planet ${planetName}:`, error);
        return false;
    }
}

/**
 * Add mining earnings to a planet claim
 * @param {string} planetName - Name of the planet
 * @param {number} amount - Amount earned
 * @param {string} minerId - ID of the miner who paid
 * @returns {Promise<boolean>} Success status
 */
export async function addMiningEarnings(planetName, amount, minerId) {
    try {
        const claims = await getPlanetClaims();
        
        if (!claims[planetName]) {
            return false;
        }

        const claim = claims[planetName];
        
        // Update earnings
        claim.totalEarned = (claim.totalEarned || 0) + amount;
        claim.transactionCount = (claim.transactionCount || 0) + 1;
        claim.lastActivity = Date.now();
        
        // Track unique miners
        if (!claim.uniqueMiners) {
            claim.uniqueMiners = [];
        }
        if (!claim.uniqueMiners.includes(minerId)) {
            claim.uniqueMiners.push(minerId);
        }
        claim.totalMiners = claim.uniqueMiners.length;

        await savePlanetClaims(claims);
        return true;
    } catch (error) {
        console.error(`Error adding mining earnings for planet ${planetName}:`, error);
        return false;
    }
}

/**
 * Update fee percentage for a claimed planet
 * @param {string} planetName - Name of the planet
 * @param {number} newFeePercent - New fee percentage (1-20)
 * @returns {Promise<Object>} Result object
 */
export async function updatePlanetFee(planetName, newFeePercent) {
    try {
        // Validate fee range
        if (newFeePercent < FEE_CONFIG.MIN_FEE || newFeePercent > FEE_CONFIG.MAX_FEE) {
            return { 
                success: false, 
                error: `Fee must be between ${FEE_CONFIG.MIN_FEE}% and ${FEE_CONFIG.MAX_FEE}%` 
            };
        }

        const success = await updatePlanetClaim(planetName, { currentFee: newFeePercent });
        
        return success 
            ? { success: true, message: `Fee updated to ${newFeePercent}%` }
            : { success: false, error: 'Planet not found or update failed' };
    } catch (error) {
        console.error(`Error updating fee for planet ${planetName}:`, error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// FEE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate mining fee
 * @param {number} extractedQuantity - Quantity extracted
 * @param {number} feePercent - Fee percentage
 * @returns {Object} Fee calculation result
 */
export function calculateMiningFee(extractedQuantity, feePercent) {
    // Validate inputs
    if (extractedQuantity <= 0 || feePercent < 0) {
        return {
            feePaid: 0,
            playerGets: extractedQuantity,
            rawFee: 0
        };
    }

    // Calculate fee: floor(extracted quantity × fee% / 100)
    // Round up to ensure at least 1 unit fee if any is due
    const rawFee = (extractedQuantity * feePercent) / 100;
    const feePaid = Math.ceil(rawFee);
    const playerGets = Math.max(0, extractedQuantity - feePaid);

    return {
        feePaid,
        playerGets,
        rawFee
    };
}

/**
 * Get element value for fee calculation
 * @param {string} elementName - Name of the element
 * @returns {number} Base value in credits
 */
export function getElementValue(elementName) {
    const values = {
        // Common - 100
        'Hydrogen': 100, 'Helium': 100, 'Lithium': 100, 'Beryllium': 100,
        'Boron': 100, 'Carbon': 100, 'Nitrogen': 100, 'Oxygen': 100,
        'Fluorine': 100, 'Neon': 100, 'Sodium': 100, 'Magnesium': 100,
        'Aluminum': 100, 'Silicon': 100, 'Phosphorus': 100, 'Sulfur': 100,
        'Chlorine': 100, 'Argon': 100, 'Potassium': 100, 'Calcium': 100,
        
        // Rare - 1000
        'Scandium': 1000, 'Titanium': 1000, 'Vanadium': 1000, 'Chromium': 1000,
        'Manganese': 1000, 'Iron': 1000, 'Cobalt': 1000, 'Nickel': 1000,
        'Copper': 1000, 'Zinc': 1000, 'Gallium': 1000, 'Germanium': 1000,
        'Arsenic': 1000, 'Selenium': 1000, 'Bromine': 1000, 'Krypton': 1000,
        'Rubidium': 1000, 'Strontium': 1000, 'Yttrium': 1000, 'Zirconium': 1000,
        'Niobium': 1000, 'Molybdenum': 1000, 'Technetium': 1000, 'Ruthenium': 1000,
        'Rhodium': 1000, 'Palladium': 1000, 'Silver': 1000, 'Cadmium': 1000,
        'Indium': 1000, 'Tin': 1000, 'Antimony': 1000, 'Tellurium': 1000,
        'Iodine': 1000, 'Xenon': 1000, 'Cesium': 1000, 'Barium': 1000,
        'Lanthanum': 1000, 'Cerium': 1000, 'Praseodymium': 1000, 'Neodymium': 1000,
        'Promethium': 1000, 'Samarium': 1000, 'Europium': 1000, 'Gadolinium': 1000,
        'Terbium': 1000, 'Dysprosium': 1000, 'Holmium': 1000, 'Erbium': 1000,
        'Thulium': 1000, 'Ytterbium': 1000, 'Lutetium': 1000, 'Hafnium': 1000,
        'Tantalum': 1000, 'Tungsten': 1000, 'Rhenium': 1000, 'Osmium': 1000,
        'Iridium': 1000, 'Platinum': 1000, 'Gold': 1000, 'Mercury': 1000,
        'Thallium': 1000, 'Lead': 1000, 'Bismuth': 1000,
        
        // Very Rare - 5000
        'Polonium': 5000, 'Astatine': 5000, 'Radon': 5000, 'Francium': 5000,
        'Radium': 5000, 'Actinium': 5000, 'Thorium': 5000, 'Protactinium': 5000,
        'Uranium': 5000,
        
        // Legendary - 25000
        'Neptunium': 25000, 'Plutonium': 25000, 'Americium': 25000, 'Curium': 25000,
        'Berkelium': 25000, 'Californium': 25000, 'Einsteinium': 25000, 'Fermium': 25000,
        'Mendelevium': 25000, 'Nobelium': 25000, 'Lawrencium': 25000, 'Rutherfordium': 25000,
        'Dubnium': 25000, 'Seaborgium': 25000, 'Bohrium': 25000, 'Hassium': 25000,
        'Meitnerium': 25000, 'Darmstadtium': 25000, 'Roentgenium': 25000, 'Copernicium': 25000,
        'Nihonium': 25000, 'Flerovium': 25000, 'Moscovium': 25000, 'Livermorium': 25000,
        'Tennessine': 25000, 'Oganesson': 25000
    };
    
    return values[elementName] || 100;
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get all claimed planets (with full data)
 * @returns {Promise<Array>} Array of claim objects
 */
export async function getAllClaimedPlanets() {
    try {
        const claims = await getPlanetClaims();
        return Object.values(claims);
    } catch (error) {
        console.error('Error getting all claimed planets:', error);
        return [];
    }
}

/**
 * Get claims sorted by distance from player
 * @param {number} playerSectorX - Player's sector X coordinate
 * @param {number} playerSectorY - Player's sector Y coordinate
 * @returns {Promise<Array>} Array of claim objects with distance added
 */
export async function getClaimsSortedByDistance(playerSectorX, playerSectorY) {
    try {
        const claims = await getAllClaimedPlanets();
        
        // Calculate distance for each claim
        const claimsWithDistance = claims.map(claim => {
            const dx = Math.abs(playerSectorX - (claim.sectorX || 30));
            const dy = Math.abs(playerSectorY - (claim.sectorY || 40));
            const sectorDistance = Math.sqrt(dx * dx + dy * dy);
            const distance = sectorDistance * 2.3; // 2.3 light years per sector unit
            
            return {
                ...claim,
                distance: parseFloat(distance.toFixed(1))
            };
        });
        
        // Sort by distance (closest first)
        return claimsWithDistance.sort((a, b) => a.distance - b.distance);
    } catch (error) {
        console.error('Error sorting claims by distance:', error);
        return [];
    }
}

/**
 * Get mining history for a specific planet
 * @param {string} planetName - Name of the planet
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} Array of transaction records
 */
export async function getPlanetMiningHistory(planetName, limit = 50) {
    try {
        const history = await getClaimHistory();
        
        return history
            .filter(h => h.planetName === planetName)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    } catch (error) {
        console.error(`Error getting mining history for planet ${planetName}:`, error);
        return [];
    }
}

/**
 * Get mining history for a player (as miner)
 * @param {string} playerId - ID of the player (miner)
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} Array of transaction records
 */
export async function getPlayerMiningHistory(playerId, limit = 50) {
    try {
        const history = await getClaimHistory();
        
        return history
            .filter(h => h.minerId === playerId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    } catch (error) {
        console.error(`Error getting mining history for player ${playerId}:`, error);
        return [];
    }
}

/**
 * Get earnings history for a player (as owner)
 * @param {string} playerId - ID of the player (owner)
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} Array of transaction records
 */
export async function getOwnerEarningsHistory(playerId, limit = 50) {
    try {
        const history = await getClaimHistory();
        
        return history
            .filter(h => h.ownerId === playerId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    } catch (error) {
        console.error(`Error getting earnings history for owner ${playerId}:`, error);
        return [];
    }
}

// ============================================================================
// STATISTICS FUNCTIONS
// ============================================================================

/**
 * Get player claim statistics
 * @param {string} playerId - ID of the player
 * @returns {Promise<Object>} Statistics object
 */
export async function getPlayerClaimStats(playerId) {
    try {
        const claims = await getPlayerClaims(playerId);
        const history = await getClaimHistory();
        const earnings = history.filter(h => h.ownerId === playerId);
        
        // Calculate statistics
        const totalEarned = earnings.reduce((sum, h) => sum + (h.feeValue || 0), 0);
        const uniqueMiners = new Set(earnings.map(h => h.minerId)).size;
        const totalTransactions = earnings.length;
        
        // Calculate average per transaction
        const avgPerTransaction = totalTransactions > 0 
            ? Math.round(totalEarned / totalTransactions) 
            : 0;
        
        // Find most profitable planet
        const planetEarnings = {};
        earnings.forEach(h => {
            planetEarnings[h.planetName] = (planetEarnings[h.planetName] || 0) + (h.feeValue || 0);
        });
        
        let mostProfitablePlanet = null;
        let mostProfitableAmount = 0;
        
        for (const [planet, amount] of Object.entries(planetEarnings)) {
            if (amount > mostProfitableAmount) {
                mostProfitableAmount = amount;
                mostProfitablePlanet = planet;
            }
        }
        
        // Calculate average per planet
        const averagePerPlanet = claims.length > 0 
            ? Math.round(totalEarned / claims.length) 
            : 0;
        
        // Find last activity
        const lastActivity = earnings.length > 0 
            ? earnings.sort((a, b) => b.timestamp - a.timestamp)[0].timestamp 
            : null;
        
        return {
            planetsOwned: claims.length,
            totalEarned,
            totalMiners: uniqueMiners,
            totalTransactions,
            averagePerTransaction,
            mostProfitablePlanet,
            mostProfitableAmount,
            averagePerPlanet,
            lastActivity
        };
    } catch (error) {
        console.error(`Error getting claim stats for player ${playerId}:`, error);
        return {
            planetsOwned: 0,
            totalEarned: 0,
            totalMiners: 0,
            totalTransactions: 0,
            averagePerTransaction: 0,
            mostProfitablePlanet: null,
            mostProfitableAmount: 0,
            averagePerPlanet: 0,
            lastActivity: null
        };
    }
}

/**
 * Get global claim statistics
 * @returns {Promise<Object>} Global statistics object
 */
export async function getGlobalClaimStats() {
    try {
        const claims = await getAllClaimedPlanets();
        const history = await getClaimHistory();
        
        const totalClaims = claims.length;
        const totalFeesCollected = history.reduce((sum, h) => sum + (h.feeValue || 0), 0);
        const totalTransactions = history.length;
        const uniqueMiners = new Set(history.map(h => h.minerId)).size;
        const uniqueOwners = new Set(history.map(h => h.ownerId)).size;
        
        // Find most profitable planet overall
        const planetEarnings = {};
        history.forEach(h => {
            planetEarnings[h.planetName] = (planetEarnings[h.planetName] || 0) + (h.feeValue || 0);
        });
        
        let mostProfitablePlanet = null;
        let mostProfitableAmount = 0;
        
        for (const [planet, amount] of Object.entries(planetEarnings)) {
            if (amount > mostProfitableAmount) {
                mostProfitableAmount = amount;
                mostProfitablePlanet = planet;
            }
        }
        
        return {
            totalClaims,
            totalFeesCollected,
            totalTransactions,
            uniqueMiners,
            uniqueOwners,
            mostProfitablePlanet,
            mostProfitableAmount
        };
    } catch (error) {
        console.error('Error getting global claim stats:', error);
        return {
            totalClaims: 0,
            totalFeesCollected: 0,
            totalTransactions: 0,
            uniqueMiners: 0,
            uniqueOwners: 0,
            mostProfitablePlanet: null,
            mostProfitableAmount: 0
        };
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Reset a planet claim (for debugging)
 * @param {string} planetName - Name of the planet
 * @returns {Promise<boolean>} Success status
 */
export async function resetPlanetClaim(planetName) {
    try {
        // Remove from planet claims
        const claims = await getPlanetClaims();
        if (!claims[planetName]) {
            return false;
        }
        
        const ownerId = claims[planetName].ownerId;
        delete claims[planetName];
        await savePlanetClaims(claims);
        
        // Remove from player claims index
        await removeFromPlayerClaims(ownerId, planetName);
        
        return true;
    } catch (error) {
        console.error(`Error resetting claim for planet ${planetName}:`, error);
        return false;
    }
}

/**
 * Clear all claim data (for debugging/reset)
 * @returns {Promise<boolean>} Success status
 */
export async function resetAllClaimData() {
    try {
        localStorage.removeItem(CLAIM_STORAGE_KEYS.PLANET_CLAIMS);
        localStorage.removeItem(CLAIM_STORAGE_KEYS.PLAYER_CLAIMS);
        localStorage.removeItem(CLAIM_STORAGE_KEYS.CLAIM_HISTORY);
        localStorage.removeItem(CLAIM_STORAGE_KEYS.CLAIM_NOTIFICATIONS);
        return true;
    } catch (error) {
        console.error('Error resetting all claim data:', error);
        return false;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    // Core functions
    isPlanetClaimed,
    getPlanetClaim,
    claimPlanet,
    
    // Player claims
    getPlayerClaims,
    getPlayerClaimsIndex,
    
    // History
    recordMiningActivity,
    getClaimHistory,
    
    // Updates
    updatePlanetClaim,
    updatePlanetFee,
    addMiningEarnings,
    
    // Fee calculation
    calculateMiningFee,
    getElementValue,
    FEE_CONFIG,
    
    // Queries
    getAllClaimedPlanets,
    getClaimsSortedByDistance,
    getPlanetMiningHistory,
    getPlayerMiningHistory,
    getOwnerEarningsHistory,
    
    // Statistics
    getPlayerClaimStats,
    getGlobalClaimStats,
    
    // Utilities
    resetPlanetClaim,
    resetAllClaimData
};

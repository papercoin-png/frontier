// js/forge-token.js
// FORGE Token Integration for Voidfarer
// Token Contract: EQBGLUNOnXAp9aEhjpO511FOIRcP9dUKEzVk1ErLSr_B-tzN

// ===== CONFIGURATION =====
const FORGE_CONFIG = {
    // Mainnet contract address
    contractAddress: 'EQBGLUNOnXAp9aEhjpO511FOIRcP9dUKEzVk1ErLSr_B-tzN',
    
    // Burn address (TON zero address in base64 format)
    burnAddress: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ',
    
    // API endpoint for balance checks
    apiEndpoint: 'https://tonapi.io/v2',
    
    // STON.fi DEX router address for swaps
    dexRouter: '0:...', // To be added after contract deployment
    
    // Exchange rates (1 FORGE = ? credits)
    forgeToCreditsRate: 100,
    
    // Forge decimals (TON jettons typically use 9)
    decimals: 9
};

// ===== STATE =====
let forgeBalance = 0;
let forgePrice = 0;
let lastUpdate = 0;

// ===== GET FORGE BALANCE =====
export async function getForgeBalance(walletAddress) {
    if (!walletAddress) return 0;
    
    try {
        const response = await fetch(
            `${FORGE_CONFIG.apiEndpoint}/jetton/${FORGE_CONFIG.contractAddress}/accounts/${walletAddress}`
        );
        
        if (!response.ok) {
            console.warn('Balance fetch failed:', response.status);
            return 0;
        }
        
        const data = await response.json();
        forgeBalance = data.balance ? data.balance / Math.pow(10, FORGE_CONFIG.decimals) : 0;
        return forgeBalance;
        
    } catch (error) {
        console.error('Error fetching FORGE balance:', error);
        return 0;
    }
}

// ===== GET FORGE PRICE =====
export async function getForgePrice() {
    try {
        // Try to get price from STON.fi
        const response = await fetch(
            `https://api.ston.fi/v1/assets/${FORGE_CONFIG.contractAddress}/price`
        );
        
        if (response.ok) {
            const data = await response.json();
            forgePrice = data.price || 0;
            lastUpdate = Date.now();
            return forgePrice;
        }
        
        // Fallback to TonAPI
        const fallbackResponse = await fetch(
            `${FORGE_CONFIG.apiEndpoint}/jetton/${FORGE_CONFIG.contractAddress}/price`
        );
        
        if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            forgePrice = data.price || 0;
            lastUpdate = Date.now();
            return forgePrice;
        }
        
        console.warn('Could not fetch FORGE price, using default');
        return 0.01; // Default fallback price
        
    } catch (error) {
        console.error('Error fetching FORGE price:', error);
        return forgePrice || 0.01;
    }
}

// ===== GET FORGE METADATA =====
export async function getForgeMetadata() {
    try {
        const response = await fetch(
            `${FORGE_CONFIG.apiEndpoint}/jetton/${FORGE_CONFIG.contractAddress}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return {
            name: data.name || 'SpellForge',
            symbol: data.symbol || 'FORGE',
            decimals: data.decimals || FORGE_CONFIG.decimals,
            totalSupply: data.total_supply ? data.total_supply / Math.pow(10, FORGE_CONFIG.decimals) : 0,
            holders: data.holders_count || 0
        };
        
    } catch (error) {
        console.error('Error fetching FORGE metadata:', error);
        return {
            name: 'SpellForge',
            symbol: 'FORGE',
            decimals: FORGE_CONFIG.decimals,
            totalSupply: 0,
            holders: 0
        };
    }
}

// ===== GET TOTAL SUPPLY =====
export async function getTotalSupply() {
    try {
        const response = await fetch(
            `${FORGE_CONFIG.apiEndpoint}/jetton/${FORGE_CONFIG.contractAddress}`
        );
        
        if (!response.ok) return 0;
        
        const data = await response.json();
        return data.total_supply ? data.total_supply / Math.pow(10, FORGE_CONFIG.decimals) : 0;
        
    } catch (error) {
        console.error('Error fetching total supply:', error);
        return 0;
    }
}

// ===== GET BURNED SUPPLY =====
export async function getBurnedSupply() {
    try {
        const response = await fetch(
            `${FORGE_CONFIG.apiEndpoint}/jetton/${FORGE_CONFIG.contractAddress}/accounts/${FORGE_CONFIG.burnAddress}`
        );
        
        if (!response.ok) return 0;
        
        const data = await response.json();
        return data.balance ? data.balance / Math.pow(10, FORGE_CONFIG.decimals) : 0;
        
    } catch (error) {
        console.error('Error fetching burned supply:', error);
        return 0;
    }
}

// ===== FORMAT FORGE AMOUNT =====
export function formatForgeAmount(amount) {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(2)}K`;
    return amount.toFixed(4);
}

// ===== CALCULATE CREDITS FROM FORGE =====
export function forgeToCredits(forgeAmount) {
    return Math.floor(forgeAmount * FORGE_CONFIG.forgeToCreditsRate);
}

// ===== CALCULATE FORGE FROM CREDITS =====
export function creditsToForge(creditsAmount) {
    return creditsAmount / FORGE_CONFIG.forgeToCreditsRate;
}

// ===== CREATE FORGE TRANSFER PAYLOAD =====
export function createForgeTransferPayload(recipient, amount, payload = {}) {
    return {
        type: 'jetton_transfer',
        recipient: recipient,
        amount: Math.floor(amount * Math.pow(10, FORGE_CONFIG.decimals)),
        payload: payload
    };
}

// ===== CREATE BURN TRANSACTION =====
export function createBurnTransaction(forgeAmount, playerId, creditsAmount) {
    return {
        validUntil: Date.now() + 600000,
        messages: [
            {
                address: FORGE_CONFIG.contractAddress,
                amount: 0,
                payload: JSON.stringify({
                    type: 'jetton_burn',
                    amount: Math.floor(forgeAmount * Math.pow(10, FORGE_CONFIG.decimals)),
                    payload: {
                        playerId: playerId,
                        credits: creditsAmount,
                        reason: 'shop_purchase'
                    }
                })
            }
        ]
    };
}

// ===== VERIFY FORGE TRANSACTION =====
export async function verifyForgeTransaction(txHash, expectedAmount) {
    try {
        const response = await fetch(`${FORGE_CONFIG.apiEndpoint}/transactions/${txHash}`);
        
        if (!response.ok) return { success: false, error: 'Transaction not found' };
        
        const tx = await response.json();
        
        // Check if transaction burned FORGE (sent to burn address)
        const isBurn = tx.messages?.some(msg => 
            msg.destination === FORGE_CONFIG.burnAddress &&
            msg.jetton?.address === FORGE_CONFIG.contractAddress
        );
        
        if (!isBurn) {
            return { success: false, error: 'Not a valid burn transaction' };
        }
        
        // Verify amount if provided
        if (expectedAmount) {
            const burnedAmount = tx.messages
                .filter(msg => msg.destination === FORGE_CONFIG.burnAddress)
                .reduce((sum, msg) => sum + (msg.jetton?.amount || 0), 0) / Math.pow(10, FORGE_CONFIG.decimals);
            
            if (Math.abs(burnedAmount - expectedAmount) > 0.01) {
                return { success: false, error: 'Amount mismatch' };
            }
        }
        
        return { success: true, tx: tx };
        
    } catch (error) {
        console.error('Error verifying transaction:', error);
        return { success: false, error: error.message };
    }
}

// ===== GET RECENT BURNS =====
export async function getRecentBurns(limit = 20) {
    try {
        const response = await fetch(
            `${FORGE_CONFIG.apiEndpoint}/jetton/${FORGE_CONFIG.contractAddress}/transfers?destination=${FORGE_CONFIG.burnAddress}&limit=${limit}`
        );
        
        if (!response.ok) return [];
        
        const data = await response.json();
        return data.transfers || [];
        
    } catch (error) {
        console.error('Error fetching recent burns:', error);
        return [];
    }
}

// ===== GET HOLDER COUNT =====
export async function getHolderCount() {
    try {
        const response = await fetch(
            `${FORGE_CONFIG.apiEndpoint}/jetton/${FORGE_CONFIG.contractAddress}/holders`
        );
        
        if (!response.ok) return 0;
        
        const data = await response.json();
        return data.holders?.length || 0;
        
    } catch (error) {
        console.error('Error fetching holder count:', error);
        return 0;
    }
}

// ===== UPDATE FORGE PRICE PERIODICALLY =====
let priceUpdateInterval = null;

export function startForgePriceUpdates(intervalMs = 30000, callback = null) {
    if (priceUpdateInterval) clearInterval(priceUpdateInterval);
    
    priceUpdateInterval = setInterval(async () => {
        const price = await getForgePrice();
        if (callback && typeof callback === 'function') {
            callback(price);
        }
    }, intervalMs);
    
    // Initial fetch
    getForgePrice().then(price => {
        if (callback) callback(price);
    });
}

export function stopForgePriceUpdates() {
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
        priceUpdateInterval = null;
    }
}

// ===== EXPORT =====
export default {
    FORGE_CONFIG,
    getForgeBalance,
    getForgePrice,
    getForgeMetadata,
    getTotalSupply,
    getBurnedSupply,
    formatForgeAmount,
    forgeToCredits,
    creditsToForge,
    createForgeTransferPayload,
    createBurnTransaction,
    verifyForgeTransaction,
    getRecentBurns,
    getHolderCount,
    startForgePriceUpdates,
    stopForgePriceUpdates
};

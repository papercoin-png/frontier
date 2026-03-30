// js/forge-token.js
// FORGE Token Integration for Voidfarer
// Token Contract: EQBGLUNOnXAp9aEhjpO511FOIRcP9dUKEzVk1ErLSr_B-tzN

import { sendTransaction, isWalletConnected as getWalletConnected } from './ton-connect.js';

// ===== CONFIGURATION =====
const FORGE_CONFIG = {
    contractAddress: 'EQBGLUNOnXAp9aEhjpO511FOIRcP9dUKEzVk1ErLSr_B-tzN',
    burnAddress: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ',
    apiEndpoint: 'https://tonapi.io/v2',
    dexRouter: '0:...',
    forgeToCreditsRate: 100,
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
        
        if (!response.ok) return 0;
        
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
        const response = await fetch(
            `https://api.ston.fi/v1/assets/${FORGE_CONFIG.contractAddress}/price`
        );
        
        if (response.ok) {
            const data = await response.json();
            forgePrice = data.price || 0;
            lastUpdate = Date.now();
            return forgePrice;
        }
        
        const fallbackResponse = await fetch(
            `${FORGE_CONFIG.apiEndpoint}/jetton/${FORGE_CONFIG.contractAddress}/price`
        );
        
        if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            forgePrice = data.price || 0;
            lastUpdate = Date.now();
            return forgePrice;
        }
        
        return 0.01;
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
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
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
        
        const isBurn = tx.messages?.some(msg => 
            msg.destination === FORGE_CONFIG.burnAddress &&
            msg.jetton?.address === FORGE_CONFIG.contractAddress
        );
        
        if (!isBurn) {
            return { success: false, error: 'Not a valid burn transaction' };
        }
        
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

// ===== BUY CREDITS WITH FORGE (DIRECT BURN) =====
/**
 * Buy game credits using FORGE tokens (direct burn)
 * @param {string} playerId - Player ID
 * @param {number} forgeAmount - Amount of FORGE to burn
 * @param {number} currentForgeBalance - Current FORGE balance (for verification)
 * @returns {Promise<Object>} Result with success, credits, txHash
 */
export async function buyCreditsWithForge(playerId, forgeAmount, currentForgeBalance) {
    const walletConnected = getWalletConnected();
    
    if (!walletConnected) {
        return { success: false, error: 'Wallet not connected' };
    }
    
    if (forgeAmount <= 0) {
        return { success: false, error: 'Invalid amount' };
    }
    
    if (currentForgeBalance < forgeAmount) {
        return { success: false, error: `Insufficient FORGE. Need ${forgeAmount}, have ${currentForgeBalance}` };
    }
    
    const creditsAmount = forgeToCredits(forgeAmount);
    const transaction = createBurnTransaction(forgeAmount, playerId, creditsAmount);
    
    try {
        const result = await sendTransaction(transaction);
        
        if (result.success) {
            const verified = await verifyForgeTransaction(result.txHash, forgeAmount);
            
            if (verified.success) {
                return {
                    success: true,
                    forgeAmount: forgeAmount,
                    creditsReceived: creditsAmount,
                    txHash: result.txHash
                };
            } else {
                return { success: false, error: 'Burn verification failed' };
            }
        }
        
        return result;
    } catch (error) {
        console.error('Forge purchase error:', error);
        return { success: false, error: error.message };
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
    buyCreditsWithForge,
    startForgePriceUpdates,
    stopForgePriceUpdates
};

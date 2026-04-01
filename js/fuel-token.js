// js/fuel-token.js
// FUEL Token Integration for Voidfarer
// Token Contract: EQDdojh4v4YhY2xpORtPXWct2vOkGmf-6AADOyw5imltevOY

import { sendTransaction, isWalletConnected as getWalletConnected } from './ton-connect.js';

// ===== CONFIGURATION =====
const FUEL_CONFIG = {
    contractAddress: 'EQDdojh4v4YhY2xpORtPXWct2vOkGmf-6AADOyw5imltevOY',
    burnAddress: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ',
    apiEndpoint: 'https://tonapi.io/v2',
    dexRouter: '0:...',
    fuelToCreditsRate: 100,
    decimals: 9
};

// ===== STATE =====
let fuelBalance = 0;
let fuelPrice = 0;
let lastUpdate = 0;

// ===== GET FUEL BALANCE =====
export async function getFuelBalance(walletAddress) {
    if (!walletAddress) return 0;
    
    try {
        const response = await fetch(
            `${FUEL_CONFIG.apiEndpoint}/jetton/${FUEL_CONFIG.contractAddress}/accounts/${walletAddress}`
        );
        
        if (response.status === 404) {
            console.log('No FUEL balance found for this address');
            return 0;
        }
        if (!response.ok) return 0;
        
        const data = await response.json();
        fuelBalance = data.balance ? data.balance / Math.pow(10, FUEL_CONFIG.decimals) : 0;
        return fuelBalance;
    } catch (error) {
        console.error('Error fetching FUEL balance:', error);
        return 0;
    }
}

// ===== GET FUEL PRICE =====
export async function getFuelPrice() {
    try {
        const response = await fetch(
            `https://api.ston.fi/v1/assets/${FUEL_CONFIG.contractAddress}/price`
        );
        
        if (response.ok) {
            const data = await response.json();
            fuelPrice = data.price || 0;
            lastUpdate = Date.now();
            return fuelPrice;
        }
        
        const fallbackResponse = await fetch(
            `${FUEL_CONFIG.apiEndpoint}/jetton/${FUEL_CONFIG.contractAddress}/price`
        );
        
        if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            fuelPrice = data.price || 0;
            lastUpdate = Date.now();
            return fuelPrice;
        }
        
        return 0.01;
    } catch (error) {
        console.error('Error fetching FUEL price:', error);
        return fuelPrice || 0.01;
    }
}

// ===== GET FUEL METADATA =====
export async function getFuelMetadata() {
    try {
        const response = await fetch(
            `${FUEL_CONFIG.apiEndpoint}/jetton/${FUEL_CONFIG.contractAddress}`
        );
        
        if (response.status === 404) {
            console.log('FUEL token metadata not found');
            return {
                name: 'Fuel Token',
                symbol: 'FUEL',
                decimals: FUEL_CONFIG.decimals,
                totalSupply: 0,
                holders: 0
            };
        }
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        return {
            name: data.name || 'Fuel Token',
            symbol: data.symbol || 'FUEL',
            decimals: data.decimals || FUEL_CONFIG.decimals,
            totalSupply: data.total_supply ? data.total_supply / Math.pow(10, FUEL_CONFIG.decimals) : 0,
            holders: data.holders_count || 0
        };
    } catch (error) {
        console.error('Error fetching FUEL metadata:', error);
        return {
            name: 'Fuel Token',
            symbol: 'FUEL',
            decimals: FUEL_CONFIG.decimals,
            totalSupply: 0,
            holders: 0
        };
    }
}

// ===== GET TOTAL SUPPLY =====
export async function getTotalSupply() {
    try {
        const response = await fetch(
            `${FUEL_CONFIG.apiEndpoint}/jetton/${FUEL_CONFIG.contractAddress}`
        );
        if (response.status === 404) return 0;
        if (!response.ok) return 0;
        const data = await response.json();
        return data.total_supply ? data.total_supply / Math.pow(10, FUEL_CONFIG.decimals) : 0;
    } catch (error) {
        console.error('Error fetching total supply:', error);
        return 0;
    }
}

// ===== GET BURNED SUPPLY =====
export async function getBurnedSupply() {
    try {
        const response = await fetch(
            `${FUEL_CONFIG.apiEndpoint}/jetton/${FUEL_CONFIG.contractAddress}/accounts/${FUEL_CONFIG.burnAddress}`
        );
        if (response.status === 404) {
            console.log('No burned supply data available yet');
            return 0;
        }
        if (!response.ok) return 0;
        const data = await response.json();
        return data.balance ? data.balance / Math.pow(10, FUEL_CONFIG.decimals) : 0;
    } catch (error) {
        console.error('Error fetching burned supply:', error);
        return 0;
    }
}

// ===== FORMAT FUEL AMOUNT =====
export function formatFuelAmount(amount) {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(2)}K`;
    return amount.toFixed(4);
}

// ===== CALCULATE CREDITS FROM FUEL =====
export function fuelToCredits(fuelAmount) {
    return Math.floor(fuelAmount * FUEL_CONFIG.fuelToCreditsRate);
}

// ===== CALCULATE FUEL FROM CREDITS =====
export function creditsToFuel(creditsAmount) {
    return creditsAmount / FUEL_CONFIG.fuelToCreditsRate;
}

// ===== CREATE FUEL TRANSFER PAYLOAD =====
export function createFuelTransferPayload(recipient, amount, payload = {}) {
    return {
        type: 'jetton_transfer',
        recipient: recipient,
        amount: Math.floor(amount * Math.pow(10, FUEL_CONFIG.decimals)),
        payload: payload
    };
}

// ===== CREATE BURN TRANSACTION =====
export function createBurnTransaction(fuelAmount, playerId, creditsAmount) {
    return {
        validUntil: Date.now() + 600000,
        messages: [
            {
                address: FUEL_CONFIG.contractAddress,
                amount: 0,
                payload: JSON.stringify({
                    type: 'jetton_burn',
                    amount: Math.floor(fuelAmount * Math.pow(10, FUEL_CONFIG.decimals)),
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

// ===== VERIFY FUEL TRANSACTION =====
export async function verifyFuelTransaction(txHash, expectedAmount) {
    try {
        const response = await fetch(`${FUEL_CONFIG.apiEndpoint}/transactions/${txHash}`);
        
        if (response.status === 404) {
            return { success: false, error: 'Transaction not found' };
        }
        
        if (!response.ok) return { success: false, error: 'Transaction not found' };
        
        const tx = await response.json();
        
        const isBurn = tx.messages?.some(msg => 
            msg.destination === FUEL_CONFIG.burnAddress &&
            msg.jetton?.address === FUEL_CONFIG.contractAddress
        );
        
        if (!isBurn) {
            return { success: false, error: 'Not a valid burn transaction' };
        }
        
        if (expectedAmount) {
            const burnedAmount = tx.messages
                .filter(msg => msg.destination === FUEL_CONFIG.burnAddress)
                .reduce((sum, msg) => sum + (msg.jetton?.amount || 0), 0) / Math.pow(10, FUEL_CONFIG.decimals);
            
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
            `${FUEL_CONFIG.apiEndpoint}/jetton/${FUEL_CONFIG.contractAddress}/transfers?destination=${FUEL_CONFIG.burnAddress}&limit=${limit}`
        );
        if (response.status === 404) return [];
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
            `${FUEL_CONFIG.apiEndpoint}/jetton/${FUEL_CONFIG.contractAddress}/holders`
        );
        if (response.status === 404) return 0;
        if (!response.ok) return 0;
        const data = await response.json();
        return data.holders?.length || 0;
    } catch (error) {
        console.error('Error fetching holder count:', error);
        return 0;
    }
}

// ===== BUY CREDITS WITH FUEL (DIRECT BURN) =====
/**
 * Buy game credits using FUEL tokens (direct burn)
 * @param {string} playerId - Player ID
 * @param {number} fuelAmount - Amount of FUEL to burn
 * @param {number} currentFuelBalance - Current FUEL balance (for verification)
 * @returns {Promise<Object>} Result with success, credits, txHash
 */
export async function buyCreditsWithFuel(playerId, fuelAmount, currentFuelBalance) {
    const walletConnected = getWalletConnected();
    
    if (!walletConnected) {
        return { success: false, error: 'Wallet not connected' };
    }
    
    if (fuelAmount <= 0) {
        return { success: false, error: 'Invalid amount' };
    }
    
    if (currentFuelBalance < fuelAmount) {
        return { success: false, error: `Insufficient FUEL. Need ${fuelAmount}, have ${currentFuelBalance}` };
    }
    
    const creditsAmount = fuelToCredits(fuelAmount);
    const transaction = createBurnTransaction(fuelAmount, playerId, creditsAmount);
    
    try {
        const result = await sendTransaction(transaction);
        
        if (result.success) {
            const verified = await verifyFuelTransaction(result.txHash, fuelAmount);
            
            if (verified.success) {
                return {
                    success: true,
                    fuelAmount: fuelAmount,
                    creditsReceived: creditsAmount,
                    txHash: result.txHash
                };
            } else {
                return { success: false, error: 'Burn verification failed' };
            }
        }
        
        return result;
    } catch (error) {
        console.error('Fuel purchase error:', error);
        return { success: false, error: error.message };
    }
}

// ===== UPDATE FUEL PRICE PERIODICALLY =====
let priceUpdateInterval = null;

export function startFuelPriceUpdates(intervalMs = 30000, callback = null) {
    if (priceUpdateInterval) clearInterval(priceUpdateInterval);
    
    priceUpdateInterval = setInterval(async () => {
        const price = await getFuelPrice();
        if (callback && typeof callback === 'function') {
            callback(price);
        }
    }, intervalMs);
    
    getFuelPrice().then(price => {
        if (callback) callback(price);
    });
}

export function stopFuelPriceUpdates() {
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
        priceUpdateInterval = null;
    }
}

// ===== EXPORT =====
export default {
    FUEL_CONFIG,
    getFuelBalance,
    getFuelPrice,
    getFuelMetadata,
    getTotalSupply,
    getBurnedSupply,
    formatFuelAmount,
    fuelToCredits,
    creditsToFuel,
    createFuelTransferPayload,
    createBurnTransaction,
    verifyFuelTransaction,
    getRecentBurns,
    getHolderCount,
    buyCreditsWithFuel,
    startFuelPriceUpdates,
    stopFuelPriceUpdates
};

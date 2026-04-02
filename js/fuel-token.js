// js/fuel-token.js
// FUEL Token Integration for Voidfarer
// Token Contract: EQDdojh4v4YhY2xpORtPXWct2vOkGmf-6AADOyw5imltevOY

import { sendTransaction, isWalletConnected as getWalletConnected } from './ton-connect.js';

// ===== CONFIGURATION =====
const FUEL_CONFIG = {
    contractAddress: 'EQDdojh4v4YhY2xpORtPXWct2vOkGmf-6AADOyw5imltevOY',
    burnAddress: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ',
    stonfiApi: 'https://api.ston.fi/v1',
    apiEndpoint: 'https://tonapi.io/v2',
    fuelToCreditsRate: 100,
    decimals: 9,
    // USDT jetton address on TON
    usdtAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'
};

// ===== STATE =====
let fuelBalance = 0;
let fuelPrice = 0.01;
let lastUpdate = 0;

// ===== GET FUEL BALANCE =====
export async function getFuelBalance(walletAddress) {
    if (!walletAddress) return 0;
    
    try {
        const response = await fetch(
            `${FUEL_CONFIG.stonfiApi}/accounts/${walletAddress}/jettons/${FUEL_CONFIG.contractAddress}/balance`
        );
        
        if (response.ok) {
            const data = await response.json();
            fuelBalance = data.balance / Math.pow(10, FUEL_CONFIG.decimals);
            return fuelBalance;
        }
        
        const tonApiResponse = await fetch(
            `${FUEL_CONFIG.apiEndpoint}/jetton/${FUEL_CONFIG.contractAddress}/accounts/${walletAddress}`
        );
        
        if (tonApiResponse.status === 404) {
            console.log('No FUEL balance found for this address');
            return 0;
        }
        if (!tonApiResponse.ok) return 0;
        
        const data = await tonApiResponse.json();
        fuelBalance = data.balance ? data.balance / Math.pow(10, FUEL_CONFIG.decimals) : 0;
        return fuelBalance;
    } catch (error) {
        console.error('Error fetching FUEL balance:', error);
        return 0;
    }
}

// ===== GET FUEL PRICE FROM STON.FI (FUEL/USDT) =====
export async function getFuelPrice() {
    try {
        // Get price via FUEL -> USDT swap estimate
        const response = await fetch(
            `${FUEL_CONFIG.stonfiApi}/swap/estimate?` +
            `offer_address=${FUEL_CONFIG.contractAddress}&` +
            `ask_address=${FUEL_CONFIG.usdtAddress}&` +
            `units=${Math.pow(10, FUEL_CONFIG.decimals)}` // 1 FUEL
        );
        
        if (response.ok) {
            const data = await response.json();
            // ask_units is USDT amount received for 1 FUEL (USDT has 6 decimals)
            const usdtAmount = data.ask_units / 1e6;
            fuelPrice = usdtAmount;
            lastUpdate = Date.now();
            return fuelPrice;
        }
        
        // Alternative: Get price via USDT -> FUEL swap estimate
        const reverseResponse = await fetch(
            `${FUEL_CONFIG.stonfiApi}/swap/estimate?` +
            `offer_address=${FUEL_CONFIG.usdtAddress}&` +
            `ask_address=${FUEL_CONFIG.contractAddress}&` +
            `units=1000000` // 1 USDT = 1e6
        );
        
        if (reverseResponse.ok) {
            const data = await reverseResponse.json();
            // ask_units is FUEL amount received for 1 USDT
            const fuelAmount = data.ask_units / Math.pow(10, FUEL_CONFIG.decimals);
            fuelPrice = 1 / fuelAmount;
            lastUpdate = Date.now();
            return fuelPrice;
        }
        
        // Fallback to asset info
        const assetResponse = await fetch(
            `${FUEL_CONFIG.stonfiApi}/assets/${FUEL_CONFIG.contractAddress}`
        );
        
        if (assetResponse.ok) {
            const data = await assetResponse.json();
            if (data.asset && data.asset.price) {
                fuelPrice = parseFloat(data.asset.price);
                return fuelPrice;
            }
        }
        
        return 0.01;
    } catch (error) {
        console.error('Error fetching FUEL price:', error);
        return 0.01;
    }
}

// ===== GET FUEL PRICE IN USDT (for display) =====
export async function getFuelPriceInUsdt() {
    const price = await getFuelPrice();
    return price;
}

// ===== GET FUEL METADATA =====
export async function getFuelMetadata() {
    try {
        const response = await fetch(
            `${FUEL_CONFIG.stonfiApi}/assets/${FUEL_CONFIG.contractAddress}`
        );
        
        if (response.status === 404) {
            return {
                name: 'Fuel Token',
                symbol: 'FUEL',
                decimals: FUEL_CONFIG.decimals,
                totalSupply: 250000,
                holders: 0
            };
        }
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const asset = data.asset;
        
        return {
            name: asset.name || 'Fuel Token',
            symbol: asset.symbol || 'FUEL',
            decimals: asset.decimals || FUEL_CONFIG.decimals,
            totalSupply: asset.total_supply ? asset.total_supply / Math.pow(10, FUEL_CONFIG.decimals) : 250000,
            holders: asset.holders_count || 0
        };
    } catch (error) {
        console.error('Error fetching FUEL metadata:', error);
        return {
            name: 'Fuel Token',
            symbol: 'FUEL',
            decimals: FUEL_CONFIG.decimals,
            totalSupply: 250000,
            holders: 0
        };
    }
}

// ===== GET TOTAL SUPPLY =====
export async function getTotalSupply() {
    try {
        const response = await fetch(
            `${FUEL_CONFIG.stonfiApi}/assets/${FUEL_CONFIG.contractAddress}`
        );
        
        if (response.ok) {
            const data = await response.json();
            return data.asset.total_supply / Math.pow(10, FUEL_CONFIG.decimals);
        }
        return 250000;
    } catch (error) {
        console.error('Error fetching total supply:', error);
        return 250000;
    }
}

// ===== GET BURNED SUPPLY =====
export async function getBurnedSupply() {
    try {
        const totalSupply = await getTotalSupply();
        const initialSupply = 250000;
        const burned = Math.max(0, initialSupply - totalSupply);
        return burned;
    } catch (error) {
        console.error('Error calculating burned supply:', error);
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
            `${FUEL_CONFIG.stonfiApi}/assets/${FUEL_CONFIG.contractAddress}`
        );
        
        if (response.ok) {
            const data = await response.json();
            return data.asset.holders_count || 0;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching holder count:', error);
        return 0;
    }
}

// ===== BUY CREDITS WITH FUEL (DIRECT BURN) =====
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
    getFuelPriceInUsdt,
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

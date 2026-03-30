// js/shop.js
// Shop logic for Voidfarer - Handles purchases, wallet integration, and burn tracking

import { 
    getPlayerId, 
    getCredits, 
    addCredits, 
    recordPurchase, 
    getPurchaseHistory, 
    getTotalSpent,
    spendCredits
} from './storage.js';

import { 
    initTonWallet, 
    connectTonWallet, 
    disconnectTonWallet, 
    getTonBalance, 
    isWalletConnected, 
    getWalletAddress, 
    getShortAddress,
    buyCreditsWithTon,
    buyCreditsWithForge
} from './ton-connect.js';

import { 
    getForgeBalance, 
    getForgePrice, 
    getBurnedSupply, 
    forgeToCredits, 
    creditsToForge,
    getForgeMetadata,
    getTotalSupply,
    getRecentBurns,
    startForgePriceUpdates,
    stopForgePriceUpdates
} from './forge-token.js';

import { awardCertificateXP } from './certificates.js';

// ===== CONFIGURATION =====
const SHOP_CONFIG = {
    // Credit packages
    packages: {
        ton: [
            { ton: 0.5, credits: 500, bonus: 0, featured: false, legendary: false },
            { ton: 1, credits: 1200, bonus: 200, featured: true, legendary: false },
            { ton: 2.5, credits: 3000, bonus: 500, featured: false, legendary: false },
            { ton: 5, credits: 6500, bonus: 1500, featured: false, legendary: false },
            { ton: 10, credits: 15000, bonus: 5000, featured: false, legendary: true },
            { ton: 20, credits: 30000, bonus: 10000, featured: false, legendary: false }
        ],
        forge: [
            { forge: 50, credits: 5000, bonus: 0, featured: false, legendary: false },
            { forge: 100, credits: 11000, bonus: 1000, featured: true, legendary: false },
            { forge: 250, credits: 28000, bonus: 3000, featured: false, legendary: false },
            { forge: 500, credits: 60000, bonus: 10000, featured: false, legendary: true }
        ]
    },
    
    // Special offers
    specialOffers: {
        certificate_boost: { ton: 2, forge: 200, name: 'Certificate Booster', effect: 'cert_xp', amount: 500 },
        forge_accelerator: { ton: 5, forge: 500, name: 'Forge Accelerator', effect: 'forge_boost', multiplier: 2, duration: 7 },
        cargo_upgrade: { ton: 3, forge: 300, name: 'Cargo Upgrade', effect: 'cargo', amount: 500 }
    },
    
    // Auto-refresh interval (ms)
    refreshInterval: 10000
};

// ===== STATE =====
let playerId = null;
let currentCredits = 0;
let walletConnected = false;
let walletAddress = null;
let tonBalance = 0;
let forgeBalance = 0;
let forgePrice = 0;
let totalBurned = 0;
let currentPaymentMethod = 'ton';
let refreshTimer = null;

// ===== DOM ELEMENTS =====
let elements = {};

// ===== INITIALIZATION =====
export async function initShop() {
    try {
        playerId = getPlayerId();
        
        // Initialize wallet
        await initTonWallet();
        
        // Load initial data
        await refreshAllData();
        
        // Start auto-refresh
        startAutoRefresh();
        
        // Setup event listeners
        setupEventListeners();
        
        // Start Forge price updates
        startForgePriceUpdates(30000, (price) => {
            forgePrice = price;
            updateForgePriceDisplay();
        });
        
        console.log('✅ Shop initialized for player:', playerId);
        return { success: true };
        
    } catch (error) {
        console.error('Shop initialization error:', error);
        return { success: false, error: error.message };
    }
}

// ===== DATA REFRESH =====
export async function refreshAllData() {
    try {
        await updateCredits();
        await updateWalletStatus();
        await updateBurnStats();
        await updatePurchaseHistory();
        await updateForgePrice();
        return { success: true };
    } catch (error) {
        console.error('Refresh error:', error);
        return { success: false, error: error.message };
    }
}

export async function updateCredits() {
    try {
        currentCredits = await getCredits(playerId);
        if (elements.totalBalance) {
            elements.totalBalance.innerHTML = `${currentCredits.toLocaleString()} <span>⭐</span>`;
        }
        return currentCredits;
    } catch (error) {
        console.error('Error updating credits:', error);
        return currentCredits;
    }
}

export async function updateWalletStatus() {
    try {
        walletConnected = isWalletConnected();
        
        if (walletConnected) {
            walletAddress = getWalletAddress();
            
            if (elements.connectWalletBtn) elements.connectWalletBtn.style.display = 'none';
            if (elements.walletConnectedInfo) elements.walletConnectedInfo.style.display = 'flex';
            if (elements.walletAddressShort) {
                elements.walletAddressShort.textContent = getShortAddress() || walletAddress?.slice(0, 10) + '...';
            }
            
            // Update balances
            tonBalance = await getTonBalance();
            if (elements.walletBalance) {
                elements.walletBalance.textContent = tonBalance.toFixed(4);
            }
            
            forgeBalance = await getForgeBalance(walletAddress);
            if (elements.forgeBalance) {
                elements.forgeBalance.textContent = forgeBalance.toFixed(2);
            }
            if (elements.forgeWalletBalance) {
                elements.forgeWalletBalance.style.display = 'flex';
            }
        } else {
            if (elements.connectWalletBtn) elements.connectWalletBtn.style.display = 'block';
            if (elements.walletConnectedInfo) elements.walletConnectedInfo.style.display = 'none';
            if (elements.forgeWalletBalance) elements.forgeWalletBalance.style.display = 'none';
        }
        
        return { walletConnected, tonBalance, forgeBalance };
    } catch (error) {
        console.error('Error updating wallet status:', error);
        return { walletConnected: false, tonBalance: 0, forgeBalance: 0 };
    }
}

export async function updateBurnStats() {
    try {
        totalBurned = await getBurnedSupply();
        if (elements.totalBurned) {
            elements.totalBurned.textContent = totalBurned.toLocaleString();
        }
        return totalBurned;
    } catch (error) {
        console.error('Error updating burn stats:', error);
        return totalBurned;
    }
}

export async function updatePurchaseHistory() {
    try {
        const history = await getPurchaseHistory(playerId);
        
        if (!elements.historyList) return;
        
        if (history.length === 0) {
            elements.historyList.innerHTML = '<div class="empty-history">No purchases yet</div>';
            return;
        }
        
        elements.historyList.innerHTML = history.slice(-10).reverse().map(p => `
            <div class="history-item">
                <span class="history-date">${new Date(p.timestamp).toLocaleDateString()}</span>
                <span class="history-method">${p.paymentMethod}</span>
                <span class="history-credits">+${p.creditsAmount.toLocaleString()}⭐</span>
            </div>
        `).join('');
        
        return history;
    } catch (error) {
        console.error('Error updating purchase history:', error);
        return [];
    }
}

export async function updateForgePrice() {
    try {
        forgePrice = await getForgePrice();
        updateForgePriceDisplay();
        return forgePrice;
    } catch (error) {
        console.error('Error updating forge price:', error);
        return forgePrice;
    }
}

function updateForgePriceDisplay() {
    if (elements.forgePriceDisplay) {
        elements.forgePriceDisplay.textContent = `${forgePrice.toFixed(4)} TON`;
    }
}

// ===== PAYMENT METHOD =====
export function switchPaymentMethod(method) {
    currentPaymentMethod = method;
    
    // Update UI
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.method === method) tab.classList.add('active');
    });
    
    const tonPackages = document.getElementById('tonPackages');
    const forgePackages = document.getElementById('forgePackages');
    
    if (tonPackages && forgePackages) {
        if (method === 'ton') {
            tonPackages.style.display = 'grid';
            forgePackages.style.display = 'none';
        } else {
            tonPackages.style.display = 'none';
            forgePackages.style.display = 'grid';
        }
    }
}

// ===== PURCHASE FUNCTIONS =====
export async function purchaseWithTon(tonAmount, creditsAmount) {
    if (!walletConnected) {
        showToast('Please connect your wallet first', 'error');
        return { success: false, error: 'Wallet not connected' };
    }
    
    if (tonBalance < tonAmount) {
        showToast(`Insufficient TON. Need ${tonAmount}, have ${tonBalance.toFixed(4)}`, 'error');
        return { success: false, error: 'Insufficient balance' };
    }
    
    try {
        const result = await buyCreditsWithTon(playerId, tonAmount);
        
        if (result.success) {
            await recordPurchase(playerId, tonAmount, creditsAmount, 'TON', result.txHash);
            await refreshAllData();
            
            showToast(`✅ Purchased ${creditsAmount.toLocaleString()} Credits!`, 'success');
            
            // Dispatch event for other components
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('shop-purchase', {
                    detail: { playerId, amount: tonAmount, method: 'TON', credits: creditsAmount }
                }));
            }
            
            return { success: true, credits: creditsAmount, txHash: result.txHash };
        } else {
            showToast(result.error || 'Purchase failed', 'error');
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('Purchase error:', error);
        showToast('Transaction failed', 'error');
        return { success: false, error: error.message };
    }
}

export async function purchaseWithForge(forgeAmount, creditsAmount) {
    if (!walletConnected) {
        showToast('Please connect your wallet first', 'error');
        return { success: false, error: 'Wallet not connected' };
    }
    
    if (forgeBalance < forgeAmount) {
        showToast(`Insufficient FORGE. Need ${forgeAmount}, have ${forgeBalance.toFixed(2)}`, 'error');
        return { success: false, error: 'Insufficient balance' };
    }
    
    try {
        const result = await buyCreditsWithForge(playerId, forgeAmount, forgeBalance);
        
        if (result.success) {
            await recordPurchase(playerId, forgeAmount, creditsAmount, 'FORGE', result.txHash);
            await refreshAllData();
            
            showToast(`✅ Purchased ${creditsAmount.toLocaleString()} Credits!`, 'success');
            
            // Dispatch event
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('shop-purchase', {
                    detail: { playerId, amount: forgeAmount, method: 'FORGE', credits: creditsAmount }
                }));
            }
            
            return { success: true, credits: creditsAmount, txHash: result.txHash };
        } else {
            showToast(result.error || 'Purchase failed', 'error');
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('Purchase error:', error);
        showToast('Transaction failed', 'error');
        return { success: false, error: error.message };
    }
}

// ===== SPECIAL OFFERS =====
export async function purchaseSpecialOffer(offerId) {
    const offer = SHOP_CONFIG.specialOffers[offerId];
    if (!offer) {
        return { success: false, error: 'Invalid offer' };
    }
    
    if (!walletConnected) {
        showToast('Please connect your wallet first', 'error');
        return { success: false, error: 'Wallet not connected' };
    }
    
    const costTon = offer.ton;
    const costForge = offer.forge;
    
    if (currentPaymentMethod === 'ton') {
        if (tonBalance < costTon) {
            showToast(`Insufficient TON. Need ${costTon} TON`, 'error');
            return { success: false, error: 'Insufficient balance' };
        }
    } else {
        if (forgeBalance < costForge) {
            showToast(`Insufficient FORGE. Need ${costForge} FORGE`, 'error');
            return { success: false, error: 'Insufficient balance' };
        }
    }
    
    try {
        let purchaseResult;
        if (currentPaymentMethod === 'ton') {
            purchaseResult = await buyCreditsWithTon(playerId, costTon);
        } else {
            purchaseResult = await buyCreditsWithForge(playerId, costForge, forgeBalance);
        }
        
        if (purchaseResult.success) {
            // Apply offer effect
            let effectResult = { success: true };
            
            switch (offer.effect) {
                case 'cert_xp':
                    effectResult = await awardCertificateXP(playerId, offer.amount);
                    showToast(`🎓 ${offer.name} applied! +${offer.amount} XP to all certificates`, 'success');
                    break;
                case 'forge_boost':
                    // Apply forge boost (store in localStorage)
                    localStorage.setItem(`forge_boost_${playerId}`, JSON.stringify({
                        active: true,
                        multiplier: offer.multiplier,
                        expiresAt: Date.now() + (offer.duration * 24 * 60 * 60 * 1000)
                    }));
                    showToast(`🔥 ${offer.name} active! ${offer.multiplier}x Forge rate for ${offer.duration} days`, 'success');
                    break;
                case 'cargo':
                    // Increase cargo limit
                    const currentLimit = localStorage.getItem('voidfarer_cargo_limit') || 5000;
                    const newLimit = parseInt(currentLimit) + offer.amount;
                    localStorage.setItem('voidfarer_cargo_limit', newLimit);
                    showToast(`🚀 ${offer.name} applied! Cargo capacity +${offer.amount}`, 'success');
                    break;
                default:
                    showToast(`✅ ${offer.name} purchased!`, 'success');
            }
            
            await recordPurchase(playerId, currentPaymentMethod === 'ton' ? costTon : costForge, 0, `${currentPaymentMethod}_${offerId}`, purchaseResult.txHash);
            await refreshAllData();
            
            // Dispatch event
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('shop-offer-purchased', {
                    detail: { playerId, offerId, method: currentPaymentMethod }
                }));
            }
            
            return { success: true, offer: offerId, effect: effectResult };
        } else {
            showToast(purchaseResult.error || 'Purchase failed', 'error');
            return { success: false, error: purchaseResult.error };
        }
    } catch (error) {
        console.error('Special offer purchase error:', error);
        showToast('Transaction failed', 'error');
        return { success: false, error: error.message };
    }
}

// ===== WALLET CONNECTION =====
export async function connectWallet() {
    try {
        const result = await connectTonWallet();
        if (result.success) {
            await updateWalletStatus();
            showToast('Wallet connected!', 'success');
        } else {
            showToast(result.error || 'Failed to connect', 'error');
        }
        return result;
    } catch (error) {
        console.error('Connect wallet error:', error);
        showToast('Failed to connect', 'error');
        return { success: false, error: error.message };
    }
}

export async function disconnectWallet() {
    try {
        const result = await disconnectTonWallet();
        if (result.success) {
            await updateWalletStatus();
            showToast('Wallet disconnected', 'info');
        }
        return result;
    } catch (error) {
        console.error('Disconnect wallet error:', error);
        return { success: false, error: error.message };
    }
}

// ===== HELPER FUNCTIONS =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

export function showLoading(show, message = 'LOADING...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingOverlay) {
        if (show) {
            if (loadingText) loadingText.textContent = message;
            loadingOverlay.classList.add('active');
        } else {
            loadingOverlay.classList.remove('active');
        }
    }
}

export function startAutoRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    
    refreshTimer = setInterval(async () => {
        await refreshAllData();
    }, SHOP_CONFIG.refreshInterval);
}

export function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Cache DOM elements
    elements = {
        totalBalance: document.getElementById('totalBalance'),
        connectWalletBtn: document.getElementById('connectWalletBtn'),
        walletConnectedInfo: document.getElementById('walletConnectedInfo'),
        walletAddressShort: document.getElementById('walletAddressShort'),
        walletBalance: document.getElementById('walletBalance'),
        forgeWalletBalance: document.getElementById('forgeWalletBalance'),
        forgeBalance: document.getElementById('forgeBalance'),
        totalBurned: document.getElementById('totalBurned'),
        historyList: document.getElementById('historyList'),
        forgePriceDisplay: document.getElementById('forgePriceDisplay')
    };
    
    // Connect wallet button
    if (elements.connectWalletBtn) {
        elements.connectWalletBtn.addEventListener('click', connectWallet);
    }
    
    // Disconnect wallet button
    const disconnectBtn = document.getElementById('disconnectWalletBtn');
    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', disconnectWallet);
    }
    
    // Payment tabs
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.addEventListener('click', () => switchPaymentMethod(tab.dataset.method));
    });
    
    // TON packages
    document.querySelectorAll('#tonPackages .package-card').forEach(card => {
        card.addEventListener('click', async (e) => {
            if (e.target.classList.contains('buy-btn') || e.target === card) {
                const tonAmount = parseFloat(card.dataset.ton);
                const creditsAmount = parseInt(card.dataset.credits);
                await purchaseWithTon(tonAmount, creditsAmount);
            }
        });
    });
    
    // Forge packages
    document.querySelectorAll('#forgePackages .package-card').forEach(card => {
        card.addEventListener('click', async (e) => {
            if (e.target.classList.contains('buy-btn') || e.target === card) {
                const forgeAmount = parseFloat(card.dataset.forge);
                const creditsAmount = parseInt(card.dataset.credits);
                await purchaseWithForge(forgeAmount, creditsAmount);
            }
        });
    });
    
    // Special offers
    document.querySelectorAll('.offer-card').forEach(card => {
        card.addEventListener('click', async () => {
            const offerType = card.dataset.offer;
            await purchaseSpecialOffer(offerType);
        });
    });
}

// ===== EXPORTS =====
export default {
    initShop,
    refreshAllData,
    updateCredits,
    updateWalletStatus,
    updateBurnStats,
    updatePurchaseHistory,
    switchPaymentMethod,
    purchaseWithTon,
    purchaseWithForge,
    purchaseSpecialOffer,
    connectWallet,
    disconnectWallet,
    showLoading,
    startAutoRefresh,
    stopAutoRefresh,
    SHOP_CONFIG
};

// ===== EXPOSE TO WINDOW FOR HTML ONCLICK =====
if (typeof window !== 'undefined') {
    window.initShop = initShop;
    window.refreshShop = refreshAllData;
    window.connectWallet = connectWallet;
    window.disconnectWallet = disconnectWallet;
    window.purchaseWithTon = purchaseWithTon;
    window.purchaseWithForge = purchaseWithForge;
    window.purchaseSpecialOffer = purchaseSpecialOffer;
    window.switchPaymentMethod = switchPaymentMethod;
}

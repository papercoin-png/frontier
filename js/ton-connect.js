// js/ton-connect.js
// TON Wallet Integration for Voidfarer - with USDT support

// ===== CONFIGURATION =====
const TON_CONFIG = {
    isTestnet: true,
    manifestUrl: 'https://papercoin-png.github.io/tonconnect-manifest.json',
    apiEndpoint: 'https://tonapi.io/v2',
    burnShopContract: 'EQDdojh4v4YhY2xpORtPXWct2vOkGmf-6AADOyw5imltevOY',
    usdtAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
    connectionTimeout: 60000,
    demoMode: true  // Set to true for now until SDK loads properly
};

// ===== STATE =====
let tonConnect = null;
let walletConnected = false;
let walletAddress = null;
let walletBalance = 0;
let usdtBalance = 0;
let listeners = [];

// ===== DEMO MODE =====
function enableDemoMode() {
    console.log('🔧 DEMO MODE - simulated wallet');
    walletConnected = true;
    walletAddress = 'EQC_demo_wallet_' + Math.random().toString(36).substr(2, 8);
    walletBalance = 10.0;
    usdtBalance = 50.0;
    setTimeout(() => notifyListeners('connected', { address: walletAddress }), 100);
}

// ===== LOAD TONCONNECT SDK =====
async function loadTonConnectSDK() {
    return new Promise((resolve, reject) => {
        if (window.TonConnect) {
            resolve();
            return;
        }
        
        // Try multiple CDN URLs
        const cdnUrls = [
            'https://cdn.jsdelivr.net/npm/@tonconnect/sdk@1.0.0/dist/tonconnect-sdk.min.js',
            'https://unpkg.com/@tonconnect/sdk@1.0.0/dist/tonconnect-sdk.min.js',
            'https://esm.sh/@tonconnect/sdk'
        ];
        
        let currentIndex = 0;
        
        function tryLoad() {
            if (currentIndex >= cdnUrls.length) {
                reject(new Error('All CDN attempts failed'));
                return;
            }
            
            const script = document.createElement('script');
            script.src = cdnUrls[currentIndex];
            script.onload = () => {
                setTimeout(() => {
                    if (window.TonConnect) {
                        console.log('✅ TonConnect SDK loaded from:', cdnUrls[currentIndex]);
                        resolve();
                    } else {
                        currentIndex++;
                        tryLoad();
                    }
                }, 200);
            };
            script.onerror = () => {
                currentIndex++;
                tryLoad();
            };
            document.head.appendChild(script);
        }
        
        tryLoad();
        
        setTimeout(() => {
            if (!window.TonConnect) {
                reject(new Error('TonConnect SDK load timeout'));
            }
        }, 15000);
    });
}

// ===== INITIALIZATION =====
export async function initTonWallet() {
    try {
        if (TON_CONFIG.demoMode) {
            enableDemoMode();
            return { success: true, connected: true, address: walletAddress, demo: true };
        }
        
        if (typeof window.TonConnect === 'undefined') {
            try {
                await loadTonConnectSDK();
            } catch (sdkError) {
                console.warn('SDK load failed, using demo mode:', sdkError);
                enableDemoMode();
                return { success: true, connected: true, address: walletAddress, demo: true };
            }
        }
        
        tonConnect = new window.TonConnect();
        tonConnect.setManifestUrl(TON_CONFIG.manifestUrl);
        
        if (tonConnect.connected && tonConnect.wallet) {
            walletAddress = tonConnect.wallet.account.address;
            walletConnected = true;
            await updateBalances();
            notifyListeners('connected', { address: walletAddress });
        }
        
        tonConnect.onStatusChange((wallet) => {
            if (wallet) {
                walletAddress = wallet.account.address;
                walletConnected = true;
                updateBalances();
                notifyListeners('connected', { address: walletAddress });
                console.log('✅ Wallet connected:', walletAddress);
            } else {
                walletConnected = false;
                walletAddress = null;
                walletBalance = 0;
                usdtBalance = 0;
                notifyListeners('disconnected', {});
                console.log('❌ Wallet disconnected');
            }
        });
        
        return { success: true, connected: walletConnected, address: walletAddress };
        
    } catch (error) {
        console.error('Init error:', error);
        enableDemoMode();
        return { success: true, connected: true, address: walletAddress, demo: true };
    }
}

// ===== CONNECT WALLET =====
export async function connectTonWallet() {
    if (TON_CONFIG.demoMode) {
        walletConnected = true;
        walletAddress = 'EQC_demo_' + Math.random().toString(36).substr(2, 8);
        walletBalance = 10.0;
        usdtBalance = 50.0;
        notifyListeners('connected', { address: walletAddress });
        return { success: true, address: walletAddress, demo: true };
    }
    
    try {
        if (!tonConnect) {
            await initTonWallet();
        }
        
        if (!tonConnect) {
            throw new Error('TonConnect not initialized');
        }
        
        const wallets = tonConnect.getWallets();
        if (!wallets || wallets.length === 0) {
            throw new Error('No wallets found');
        }
        
        const tg = window.Telegram?.WebApp;
        if (tg && (tg.platform === 'tdesktop' || tg.platform === 'ios' || tg.platform === 'android')) {
            const telegramWallet = wallets.find(w => w.name === 'Wallet' || w.name === 'Telegram');
            if (telegramWallet) {
                await tonConnect.connect({ wallet: telegramWallet });
                return { success: true, address: walletAddress };
            }
        }
        
        return await showWalletSelector(wallets);
        
    } catch (error) {
        console.error('Connection error:', error);
        return { success: false, error: error.message };
    }
}

function showWalletSelector(wallets) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: #1a1a2a;
            border: 2px solid #ffaa4a;
            border-radius: 40px;
            padding: 24px;
            width: 280px;
            text-align: center;
        `;
        
        content.innerHTML = `
            <h3 style="color: #ffaa4a; margin-bottom: 20px;">Connect Wallet</h3>
            <div id="wallet-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
            <button id="close-wallet-modal" style="margin-top: 20px; padding: 10px; background: #2a2a4a; border: none; border-radius: 30px; color: white; cursor: pointer;">Cancel</button>
        `;
        
        const walletList = content.querySelector('#wallet-list');
        
        wallets.forEach(wallet => {
            const btn = document.createElement('button');
            btn.textContent = wallet.name;
            btn.style.cssText = `
                padding: 12px;
                background: #2a2a4a;
                border: 1px solid #ffaa4a;
                border-radius: 30px;
                color: white;
                cursor: pointer;
                font-size: 14px;
            `;
            btn.onclick = async () => {
                modal.remove();
                try {
                    await tonConnect.connect({ wallet: wallet });
                    resolve({ success: true, address: walletAddress });
                } catch (err) {
                    resolve({ success: false, error: err.message });
                }
            };
            walletList.appendChild(btn);
        });
        
        content.querySelector('#close-wallet-modal').onclick = () => {
            modal.remove();
            resolve({ success: false, error: 'User cancelled' });
        };
        
        modal.appendChild(content);
        document.body.appendChild(modal);
    });
}

// ===== DISCONNECT WALLET =====
export async function disconnectTonWallet() {
    walletConnected = false;
    walletAddress = null;
    walletBalance = 0;
    usdtBalance = 0;
    
    if (tonConnect && !TON_CONFIG.demoMode) {
        try {
            await tonConnect.disconnect();
        } catch (e) {}
    }
    
    notifyListeners('disconnected', {});
    return { success: true };
}

// ===== BALANCE FUNCTIONS =====
export async function getTonBalance() {
    if (!walletConnected) return 0;
    if (TON_CONFIG.demoMode) return 10.0;
    
    // Skip API call for demo addresses
    if (walletAddress && walletAddress.startsWith('EQC_demo')) {
        return 10.0;
    }
    
    try {
        const response = await fetch(`${TON_CONFIG.apiEndpoint}/accounts/${walletAddress}`);
        if (!response.ok) return 0;
        const data = await response.json();
        walletBalance = data.balance ? data.balance / 1e9 : 0;
        return walletBalance;
    } catch (error) {
        console.error('Balance fetch error:', error);
        return 0;
    }
}

export async function getUsdtBalance() {
    if (!walletConnected) return 0;
    if (TON_CONFIG.demoMode) return 50.0;
    
    if (walletAddress && walletAddress.startsWith('EQC_demo')) {
        return 50.0;
    }
    
    try {
        const response = await fetch(`${TON_CONFIG.apiEndpoint}/jetton/${TON_CONFIG.usdtAddress}/accounts/${walletAddress}`);
        if (!response.ok) return 0;
        const data = await response.json();
        usdtBalance = data.balance ? data.balance / 1e6 : 0;
        return usdtBalance;
    } catch (error) {
        console.error('USDT balance fetch error:', error);
        return 0;
    }
}

export async function updateBalances() {
    walletBalance = await getTonBalance();
    usdtBalance = await getUsdtBalance();
    return { ton: walletBalance, usdt: usdtBalance };
}

// ===== SEND TRANSACTION =====
export async function sendTransaction(transaction) {
    if (TON_CONFIG.demoMode) {
        await new Promise(r => setTimeout(r, 1000));
        return { success: true, txHash: 'demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8) };
    }
    
    if (!walletConnected || !tonConnect) {
        return { success: false, error: 'Wallet not connected' };
    }
    
    try {
        const result = await tonConnect.sendTransaction(transaction);
        return { success: true, txHash: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===== BUY CREDITS =====
export async function buyCreditsWithTon(playerId, tonAmount) {
    if (!walletConnected) return { success: false, error: 'Wallet not connected' };
    
    const balance = await getTonBalance();
    if (balance < tonAmount) {
        return { success: false, error: `Insufficient TON. Need ${tonAmount}, have ${balance.toFixed(2)}` };
    }
    
    const creditsAmount = Math.floor(tonAmount * 1000);
    const transaction = {
        validUntil: Date.now() + 600000,
        messages: [{
            address: TON_CONFIG.burnShopContract,
            amount: tonAmount * 1e9,
            payload: JSON.stringify({ type: 'buy_credits', playerId, credits: creditsAmount, paymentMethod: 'TON' })
        }]
    };
    
    const result = await sendTransaction(transaction);
    if (result.success) {
        return { success: true, tonAmount, creditsReceived: creditsAmount, txHash: result.txHash };
    }
    return result;
}

export async function buyCreditsWithUsdt(playerId, usdtAmount) {
    if (!walletConnected) return { success: false, error: 'Wallet not connected' };
    
    const balance = await getUsdtBalance();
    if (balance < usdtAmount) {
        return { success: false, error: `Insufficient USDT. Need ${usdtAmount}, have ${balance.toFixed(2)}` };
    }
    
    const creditsAmount = Math.floor(usdtAmount * 1000);
    const transaction = {
        validUntil: Date.now() + 600000,
        messages: [{
            address: TON_CONFIG.usdtAddress,
            amount: 0,
            payload: JSON.stringify({
                type: 'jetton_transfer',
                recipient: TON_CONFIG.burnShopContract,
                amount: usdtAmount * 1e6,
                payload: { type: 'buy_credits', playerId, credits: creditsAmount, paymentMethod: 'USDT' }
            })
        }]
    };
    
    const result = await sendTransaction(transaction);
    if (result.success) {
        return { success: true, usdtAmount, creditsReceived: creditsAmount, txHash: result.txHash };
    }
    return result;
}

// ===== EVENT LISTENERS =====
export function onWalletEvent(callback) { listeners.push(callback); }
export function offWalletEvent(callback) {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
}
function notifyListeners(event, data) { listeners.forEach(cb => cb(event, data)); }

// ===== GETTERS =====
export function isWalletConnected() { return walletConnected; }
export function getWalletAddress() { return walletAddress; }
export function getWalletBalanceDisplay() { return walletBalance.toFixed(2); }
export function getUsdtBalanceDisplay() { return usdtBalance.toFixed(2); }
export function getShortAddress() {
    if (!walletAddress) return '';
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
}

export default {
    initTonWallet,
    connectTonWallet,
    disconnectTonWallet,
    getTonBalance,
    getUsdtBalance,
    updateBalances,
    sendTransaction,
    buyCreditsWithTon,
    buyCreditsWithUsdt,
    isWalletConnected,
    getWalletAddress,
    getShortAddress,
    getWalletBalanceDisplay,
    getUsdtBalanceDisplay,
    onWalletEvent,
    offWalletEvent,
    TON_CONFIG
};

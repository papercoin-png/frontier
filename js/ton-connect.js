// js/ton-connect.js
// TON Wallet Integration for Voidfarer
// Supports Tonkeeper, Telegram Wallet, Tonhub, OpenMask, and any TON Connect 2.0 wallet

// ===== CONFIGURATION =====
const TON_CONFIG = {
    // Mainnet vs Testnet (use testnet for development)
    isTestnet: true,
    
    // dApp manifest URL (host this file on your domain)
    manifestUrl: 'https://your-domain.com/tonconnect-manifest.json',
    
    // TON API endpoint for balance checks
    apiEndpoint: 'https://tonapi.io/v2',
    
    // Game addresses
    burnShopContract: '0x...', // To be added after contract deployment
    forgeTokenAddress: 'EQBGLUNOnXAp9aEhjpO511FOIRcP9dUKEzVk1ErLSr_B-tzN',
    
    // Connection timeout
    connectionTimeout: 60000
};

// ===== STATE =====
let tonConnect = null;
let walletConnected = false;
let walletAddress = null;
let walletBalance = 0;
let listeners = [];

// ===== INITIALIZATION =====
export async function initTonWallet() {
    try {
        // Check if TonConnect SDK is available, load if not
        if (typeof window.TonConnect === 'undefined') {
            await loadTonConnectSDK();
        }
        
        tonConnect = new window.TonConnect();
        tonConnect.setManifestUrl(TON_CONFIG.manifestUrl);
        
        // Check existing connection
        if (tonConnect.connected) {
            const wallet = tonConnect.wallet;
            walletAddress = wallet?.account?.address;
            walletConnected = true;
            await updateBalance();
            notifyListeners('connected', { address: walletAddress });
        }
        
        // Listen for connection status changes
        tonConnect.onStatusChange((wallet) => {
            if (wallet) {
                walletAddress = wallet.account.address;
                walletConnected = true;
                updateBalance();
                notifyListeners('connected', { address: walletAddress });
                console.log('✅ TON Wallet connected:', walletAddress);
            } else {
                walletConnected = false;
                walletAddress = null;
                walletBalance = 0;
                notifyListeners('disconnected', {});
                console.log('❌ TON Wallet disconnected');
            }
        });
        
        return { 
            success: true, 
            connected: walletConnected, 
            address: walletAddress 
        };
        
    } catch (error) {
        console.error('TON wallet init error:', error);
        return { success: false, error: error.message };
    }
}

function loadTonConnectSDK() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load TonConnect SDK'));
        document.head.appendChild(script);
    });
}

// ===== CONNECT WALLET =====
export async function connectTonWallet() {
    try {
        if (!tonConnect) {
            await initTonWallet();
        }
        
        // Get available wallets
        const wallets = tonConnect.getWallets();
        
        // Check if in Telegram, prioritize Telegram Wallet
        const tg = window.Telegram?.WebApp;
        if (tg && (tg.platform === 'tdesktop' || tg.platform === 'ios' || tg.platform === 'android')) {
            const telegramWallet = wallets.find(w => w.name === 'Wallet in Telegram');
            if (telegramWallet) {
                await tonConnect.connect({ wallet: telegramWallet });
                return { success: true, address: walletAddress };
            }
        }
        
        // Show wallet selection modal
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
    try {
        if (tonConnect && tonConnect.connected) {
            await tonConnect.disconnect();
        }
        walletConnected = false;
        walletAddress = null;
        walletBalance = 0;
        return { success: true };
    } catch (error) {
        console.error('Disconnect error:', error);
        return { success: false, error: error.message };
    }
}

// ===== GET WALLET BALANCE =====
export async function getTonBalance() {
    if (!walletConnected || !walletAddress) return 0;
    
    try {
        const response = await fetch(`${TON_CONFIG.apiEndpoint}/accounts/${walletAddress}`);
        const data = await response.json();
        walletBalance = data.balance ? data.balance / 1e9 : 0;
        return walletBalance;
    } catch (error) {
        console.error('Balance fetch error:', error);
        return 0;
    }
}

async function updateBalance() {
    walletBalance = await getTonBalance();
    return walletBalance;
}

// ===== SEND TRANSACTION =====
export async function sendTransaction(transaction) {
    if (!walletConnected || !tonConnect) {
        return { success: false, error: 'Wallet not connected' };
    }
    
    try {
        const result = await tonConnect.sendTransaction(transaction);
        return { success: true, txHash: result };
    } catch (error) {
        console.error('Transaction error:', error);
        return { success: false, error: error.message };
    }
}

// ===== BUY CREDITS WITH TON =====
export async function buyCreditsWithTon(playerId, tonAmount) {
    if (!walletConnected) {
        return { success: false, error: 'Wallet not connected' };
    }
    
    const balance = await getTonBalance();
    if (balance < tonAmount) {
        return { success: false, error: `Insufficient TON. Need ${tonAmount}, have ${balance.toFixed(2)}` };
    }
    
    const creditsAmount = Math.floor(tonAmount * 1000); // 1 TON = 1000 credits
    
    const transaction = {
        validUntil: Date.now() + 600000, // 10 minutes
        messages: [
            {
                address: TON_CONFIG.burnShopContract,
                amount: tonAmount * 1e9, // Convert to nanoTON
                payload: JSON.stringify({
                    type: 'buy_credits',
                    playerId: playerId,
                    credits: creditsAmount,
                    paymentMethod: 'TON'
                })
            }
        ]
    };
    
    const result = await sendTransaction(transaction);
    
    if (result.success) {
        return {
            success: true,
            tonAmount: tonAmount,
            creditsReceived: creditsAmount,
            txHash: result.txHash
        };
    }
    
    return result;
}

// ===== BUY CREDITS WITH FORGE =====
export async function buyCreditsWithForge(playerId, forgeAmount, forgeBalance) {
    if (!walletConnected) {
        return { success: false, error: 'Wallet not connected' };
    }
    
    if (forgeBalance < forgeAmount) {
        return { success: false, error: `Insufficient FORGE. Need ${forgeAmount}, have ${forgeBalance}` };
    }
    
    const creditsAmount = Math.floor(forgeAmount * 100); // 1 FORGE = 100 credits
    
    // Transfer FORGE to burn contract
    const transaction = {
        validUntil: Date.now() + 600000,
        messages: [
            {
                address: TON_CONFIG.forgeTokenAddress,
                amount: 0, // Jetton transfer uses payload
                payload: JSON.stringify({
                    type: 'jetton_transfer',
                    recipient: TON_CONFIG.burnShopContract,
                    amount: forgeAmount,
                    payload: {
                        type: 'buy_credits',
                        playerId: playerId,
                        credits: creditsAmount
                    }
                })
            }
        ]
    };
    
    const result = await sendTransaction(transaction);
    
    if (result.success) {
        return {
            success: true,
            forgeAmount: forgeAmount,
            creditsReceived: creditsAmount,
            txHash: result.txHash
        };
    }
    
    return result;
}

// ===== EVENT LISTENERS =====
export function onWalletEvent(callback) {
    listeners.push(callback);
}

export function offWalletEvent(callback) {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
}

function notifyListeners(event, data) {
    listeners.forEach(callback => callback(event, data));
}

// ===== GETTERS =====
export function isWalletConnected() {
    return walletConnected;
}

export function getWalletAddress() {
    return walletAddress;
}

export function getWalletBalanceDisplay() {
    return walletBalance.toFixed(2);
}

export function getShortAddress() {
    if (!walletAddress) return '';
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
}

// ===== MANIFEST HELPER =====
export function generateManifest() {
    // This function helps generate the manifest.json file
    const manifest = {
        url: window.location.origin,
        name: 'Voidfarer',
        iconUrl: `${window.location.origin}/icon.png`,
        termsOfUseUrl: `${window.location.origin}/terms.html`,
        privacyPolicyUrl: `${window.location.origin}/privacy.html`
    };
    return manifest;
}

// ===== EXPORT =====
export default {
    initTonWallet,
    connectTonWallet,
    disconnectTonWallet,
    getTonBalance,
    sendTransaction,
    buyCreditsWithTon,
    buyCreditsWithForge,
    isWalletConnected,
    getWalletAddress,
    getShortAddress,
    getWalletBalanceDisplay,
    onWalletEvent,
    offWalletEvent,
    TON_CONFIG
};

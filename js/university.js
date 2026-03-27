// js/university.js
// University module for Voidfarer
// Manages certificate progression, donations, and labor pool integration
// This file provides the core logic for the University UI

import { getCredits, addCredits, spendCredits } from './storage.js';
import { 
    getCertificates, 
    saveCertificates,
    getCertificateStatus,
    getXpNeeded,
    getDonationsNeeded,
    getLevelProgressPercent,
    getTotalLaborShare,
    getCertificateShare,
    calculateUpgradeGain,
    calculateUnlockGain,
    addDonationXP,
    addExtractionXP,
    getCertificateStats,
    CERTIFICATE_TIERS
} from './certificates.js';
import { 
    getLaborPoolStats,
    getPlayerEarnings,
    claimLaborEarnings,
    getDistributionHistory,
    formatEarnings
} from './labor-pool.js';

// ===== STATE =====
let currentPlayerId = null;
let currentCertificates = [];
let currentLaborPool = 0;
let currentTotalPlayerShares = 0;
let currentEarnings = 0;
let expandedCardIndex = null;
let playerInventory = {};

// ===== DOM ELEMENTS (will be set by UI) =====
let elements = {};

// ===== INITIALIZATION =====
/**
 * Initialize the University module
 * @param {string} playerId - Player ID
 * @param {Object} domElements - DOM element references
 * @returns {Promise<boolean>} Success status
 */
export async function initUniversity(playerId, domElements) {
    try {
        currentPlayerId = playerId;
        elements = domElements;
        
        await loadData();
        
        // Set up event listeners
        if (elements.claimBtn) {
            elements.claimBtn.onclick = claimEarnings;
        }
        
        return true;
    } catch (error) {
        console.error('Error initializing University:', error);
        return false;
    }
}

// ===== DATA LOADING =====
/**
 * Load all necessary data
 */
export async function loadData() {
    try {
        // Load certificates
        currentCertificates = await getCertificates(currentPlayerId);
        
        // Load credits
        const credits = await getCredits(currentPlayerId);
        if (elements.creditsDisplay) {
            elements.creditsDisplay.innerHTML = `<span>⭐</span> ${credits.toLocaleString()}`;
        }
        
        // Load labor pool stats
        const stats = await getLaborPoolStats();
        if (stats) {
            currentLaborPool = stats.balance;
            if (elements.poolAmount) {
                elements.poolAmount.innerHTML = `${currentLaborPool.toLocaleString()}⭐`;
            }
            if (elements.activeWorkers) {
                elements.activeWorkers.innerHTML = (stats.activeWorkers || 0).toLocaleString();
            }
            currentTotalPlayerShares = stats.totalDistributed ? stats.totalDistributed / 100 : 10000;
        }
        
        // Load player earnings
        currentEarnings = await getPlayerEarnings(currentPlayerId);
        if (elements.todayEarnings) {
            elements.todayEarnings.innerHTML = `${currentEarnings.toLocaleString()}⭐`;
        }
        
        // Update share preview
        const totalShare = getTotalLaborShare(currentCertificates);
        const sharePercent = (totalShare / 100).toFixed(2);
        if (elements.totalSharePreview) {
            elements.totalSharePreview.innerHTML = `Share: ${sharePercent}%`;
        }
        
        return true;
    } catch (error) {
        console.error('Error loading data:', error);
        return false;
    }
}

// ===== RENDER CERTIFICATES =====
/**
 * Render all certificate cards
 * @returns {string} HTML string
 */
export function renderCertificates() {
    let html = '';
    
    CERTIFICATE_TIERS.forEach((cert, i) => {
        const status = getCertificateStatus(currentCertificates, i);
        const prog = currentCertificates[i];
        const currentLevel = prog?.level || 0;
        const progressPercent = getLevelProgressPercent(currentCertificates, i);
        const xpNeeded = getXpNeeded(currentCertificates, i);
        const donationsNeeded = getDonationsNeeded(currentCertificates, i);
        
        // Calculate gain preview
        let gainPreview = 0;
        if (status === 'earned' && currentLevel < cert.totalLevels) {
            gainPreview = calculateUpgradeGain(currentCertificates, i, currentLaborPool, currentTotalPlayerShares);
        } else if (status === 'available') {
            gainPreview = calculateUnlockGain(currentCertificates, i, currentLaborPool, currentTotalPlayerShares);
        }
        
        let statusClass = '';
        if (status === 'maxed') statusClass = 'maxed';
        else if (status === 'earned') statusClass = 'earned';
        else if (status === 'available') statusClass = 'available';
        else statusClass = 'locked';
        
        const isExpanded = expandedCardIndex === i;
        
        html += `
            <div class="cert-card ${statusClass} ${isExpanded ? 'expanded' : ''}" data-index="${i}">
                <div class="cert-header" onclick="window.university.toggleCard(${i})">
                    <div class="cert-info">
                        <div class="cert-icon">${cert.icon}</div>
                        <div>
                            <div class="cert-name">${cert.name}</div>
                            <div class="cert-tier">Tier ${cert.tier} · ${cert.rarity.toUpperCase()}</div>
                        </div>
                    </div>
                    <div class="cert-level">
        `;
        
        if (status === 'maxed') {
            html += `<div class="level-number">MAX</div>`;
        } else if (status === 'earned' || status === 'available') {
            html += `<div class="level-number">${currentLevel}/${cert.totalLevels}</div>`;
            if (gainPreview > 0) {
                html += `<div class="next-gain">+${gainPreview}⭐</div>`;
            }
        } else {
            html += `<div class="level-number">🔒</div>`;
        }
        
        html += `
                    </div>
                    <div class="expand-icon">${isExpanded ? '▼' : '▶'}</div>
                </div>
                
                <div class="cert-content">
        `;
        
        // Gain preview for upgrades
        if (gainPreview > 0) {
            const actionText = status === 'available' ? `Unlock ${cert.name}` : `Level ${currentLevel + 1}`;
            html += `
                <div class="gain-preview">
                    <div class="gain-amount">+${gainPreview}⭐</div>
                    <div class="gain-label">more per day after ${actionText}</div>
                </div>
            `;
        }
        
        // Progress bar for earned certificates
        if (status === 'earned' && currentLevel < cert.totalLevels) {
            html += `
                <div class="progress-header">
                    <span>PROGRESS TO LEVEL ${currentLevel + 1}</span>
                    <span>${Math.floor(xpNeeded)} XP needed</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
            `;
        }
        
        // Donation section for available/earned certificates
        if (status !== 'locked' && status !== 'maxed') {
            const rarityClass = `rarity-${cert.rarity}`;
            const inventoryAmount = playerInventory[cert.rarity] || 0;
            
            html += `
                <div class="donation-section">
                    <div class="donation-row">
                        <div class="donation-info">
                            <span class="rarity-badge ${rarityClass}">${cert.rarity.toUpperCase()}</span>
                            <span>+${cert.xpPerDonation} XP per ${cert.unitsPerDonation} units</span>
                        </div>
                        <div>
                            <button class="donate-btn" onclick="event.stopPropagation(); window.university.donate(${i}, ${cert.unitsPerDonation})">DONATE ${cert.unitsPerDonation}</button>
                            <button class="donate-btn" onclick="event.stopPropagation(); window.university.donate(${i}, ${cert.unitsPerDonation * 10})">×10</button>
                        </div>
                    </div>
                    <div class="inventory-text">
                        📦 You have: ${inventoryAmount.toLocaleString()} ${cert.rarity.toUpperCase()} units
                        ${donationsNeeded > 0 ? `<br>🎯 Need: ${donationsNeeded.toLocaleString()} more units to level up` : ''}
                    </div>
                </div>
            `;
        }
        
        // Unlock requirement for locked certificates
        if (status === 'locked' && i > 0) {
            const prevCert = CERTIFICATE_TIERS[i-1];
            html += `
                <div class="unlock-requirement">
                    🔒 Requires ${prevCert.name} Level 10
                    <div style="font-size: 11px; margin-top: 4px;">Reach max level in ${prevCert.name} to unlock</div>
                </div>
            `;
        }
        
        html += `</div></div>`;
    });
    
    return html;
}

// ===== TOGGLE CARD =====
/**
 * Toggle certificate card expansion
 * @param {number} index - Certificate index
 */
export function toggleCard(index) {
    if (expandedCardIndex === index) {
        expandedCardIndex = null;
    } else {
        expandedCardIndex = index;
    }
    
    if (elements.certificatesContainer) {
        elements.certificatesContainer.innerHTML = renderCertificates();
    }
}

// ===== DONATE =====
/**
 * Donate elements to a certificate
 * @param {number} certIndex - Certificate index
 * @param {number} quantity - Number of units to donate
 * @returns {Promise<Object>} Result
 */
export async function donate(certIndex, quantity) {
    const cert = CERTIFICATE_TIERS[certIndex];
    const status = getCertificateStatus(currentCertificates, certIndex);
    
    if (status === 'locked') {
        return { success: false, error: `Complete ${CERTIFICATE_TIERS[certIndex-1].name} Level 10 first.` };
    }
    
    if (status === 'maxed') {
        return { success: false, error: `${cert.name} is already at max level!` };
    }
    
    const available = playerInventory[cert.rarity] || 0;
    if (available < quantity) {
        return { success: false, error: `Not enough ${cert.rarity.toUpperCase()}! Need ${quantity - available} more.` };
    }
    
    // Deduct inventory
    playerInventory[cert.rarity] -= quantity;
    
    // Add XP
    const result = await addDonationXP(currentPlayerId, certIndex, quantity);
    
    if (result.success) {
        // Reload certificates
        currentCertificates = await getCertificates(currentPlayerId);
        
        // Refresh display
        if (elements.certificatesContainer) {
            elements.certificatesContainer.innerHTML = renderCertificates();
        }
        
        // Update share preview
        const totalShare = getTotalLaborShare(currentCertificates);
        const sharePercent = (totalShare / 100).toFixed(2);
        if (elements.totalSharePreview) {
            elements.totalSharePreview.innerHTML = `Share: ${sharePercent}%`;
        }
        
        return {
            success: true,
            leveledUp: result.leveledUp,
            newLevel: result.newLevel,
            xpGained: result.xpGained
        };
    }
    
    return result;
}

// ===== CLAIM EARNINGS =====
/**
 * Claim labor earnings
 * @returns {Promise<Object>} Result
 */
export async function claimEarnings() {
    try {
        const result = await claimLaborEarnings(currentPlayerId);
        
        if (result.success) {
            // Update earnings display
            currentEarnings = await getPlayerEarnings(currentPlayerId);
            if (elements.todayEarnings) {
                elements.todayEarnings.innerHTML = `${currentEarnings.toLocaleString()}⭐`;
            }
            
            // Update credits display
            const credits = await getCredits(currentPlayerId);
            if (elements.creditsDisplay) {
                elements.creditsDisplay.innerHTML = `<span>⭐</span> ${credits.toLocaleString()}`;
            }
        }
        
        return result;
    } catch (error) {
        console.error('Error claiming earnings:', error);
        return { success: false, error: error.message };
    }
}

// ===== ADD EXTRACTION XP =====
/**
 * Add XP from extraction (called from surface.html)
 * @param {string} rarity - Element rarity
 * @param {number} quantity - Quantity extracted
 * @returns {Promise<Object>} Result
 */
export async function addExtractionXP(rarity, quantity) {
    try {
        const result = await addExtractionXP(currentPlayerId, rarity, quantity);
        
        if (result.success) {
            // Reload certificates
            currentCertificates = await getCertificates(currentPlayerId);
            
            // Refresh display
            if (elements.certificatesContainer) {
                elements.certificatesContainer.innerHTML = renderCertificates();
            }
            
            // Update share preview
            const totalShare = getTotalLaborShare(currentCertificates);
            const sharePercent = (totalShare / 100).toFixed(2);
            if (elements.totalSharePreview) {
                elements.totalSharePreview.innerHTML = `Share: ${sharePercent}%`;
            }
        }
        
        return result;
    } catch (error) {
        console.error('Error adding extraction XP:', error);
        return { success: false, error: error.message };
    }
}

// ===== UPDATE INVENTORY =====
/**
 * Update player's element inventory (called from storage when elements change)
 * @param {Object} inventory - Inventory object
 */
export function updateInventory(inventory) {
    playerInventory = {
        common: inventory.common || 0,
        uncommon: inventory.uncommon || 0,
        rare: inventory.rare || 0,
        'very-rare': inventory['very-rare'] || 0,
        legendary: inventory.legendary || 0
    };
    
    // Refresh display
    if (elements.certificatesContainer) {
        elements.certificatesContainer.innerHTML = renderCertificates();
    }
}

// ===== GET CERTIFICATE STATS =====
/**
 * Get certificate statistics for display
 * @returns {Promise<Object>} Statistics
 */
export async function getStats() {
    return await getCertificateStats(currentPlayerId);
}

// ===== GET DISTRIBUTION HISTORY =====
/**
 * Get labor pool distribution history
 * @param {number} limit - Number of records
 * @returns {Promise<Array>} History
 */
export async function getDistributionHistory(limit = 10) {
    return await getDistributionHistory(limit);
}

// ===== RESET (for debugging) =====
/**
 * Reset certificates for current player (debug only)
 * @returns {Promise<boolean>} Success
 */
export async function resetCertificates() {
    const defaultProgress = CERTIFICATE_TIERS.map(() => ({
        level: 0,
        xp: 0,
        earned: false
    }));
    defaultProgress[0].earned = true;
    
    await saveCertificates(currentPlayerId, defaultProgress);
    currentCertificates = await getCertificates(currentPlayerId);
    
    if (elements.certificatesContainer) {
        elements.certificatesContainer.innerHTML = renderCertificates();
    }
    
    return true;
}

// ===== EXPORT FOR WINDOW =====
// Expose functions to window for onclick handlers
if (typeof window !== 'undefined') {
    window.university = {
        toggleCard,
        donate,
        claimEarnings,
        addExtractionXP,
        updateInventory,
        getStats,
        resetCertificates
    };
}

// ===== EXPORT DEFAULT =====
export default {
    initUniversity,
    loadData,
    renderCertificates,
    toggleCard,
    donate,
    claimEarnings,
    addExtractionXP,
    updateInventory,
    getStats,
    getDistributionHistory,
    resetCertificates
};

// js/certificates.js
// Certificate system for Voidfarer University
// Manages 10 tiers of certificates with 10 mastery levels each
// Players donate elements to earn XP and increase their labor share

import { getItem, setItem, getAll } from './storage.js';

// ===== CONSTANTS =====
export const CERTIFICATE_TIERS = [
    { tier: 1, name: 'NOVICE', icon: '🌱', rarity: 'common', sharePerLevel: 5, galaxyTier: 1,
      unitsPerDonation: 10, xpPerDonation: 1, xpPerLevel: 5000, totalLevels: 10 },
    { tier: 2, name: 'APPRENTICE', icon: '📘', rarity: 'uncommon', sharePerLevel: 10, galaxyTier: 2,
      unitsPerDonation: 10, xpPerDonation: 1, xpPerLevel: 10000, totalLevels: 10 },
    { tier: 3, name: 'JOURNEYMAN', icon: '⚙️', rarity: 'rare', sharePerLevel: 15, galaxyTier: 3,
      unitsPerDonation: 10, xpPerDonation: 2, xpPerLevel: 20000, totalLevels: 10 },
    { tier: 4, name: 'ADEPT', icon: '🔮', rarity: 'very-rare', sharePerLevel: 20, galaxyTier: 4,
      unitsPerDonation: 10, xpPerDonation: 5, xpPerLevel: 40000, totalLevels: 10 },
    { tier: 5, name: 'EXPERT', icon: '💎', rarity: 'very-rare', sharePerLevel: 25, galaxyTier: 5,
      unitsPerDonation: 10, xpPerDonation: 10, xpPerLevel: 80000, totalLevels: 10 },
    { tier: 6, name: 'MASTER', icon: '🏆', rarity: 'very-rare', sharePerLevel: 30, galaxyTier: 6,
      unitsPerDonation: 10, xpPerDonation: 20, xpPerLevel: 160000, totalLevels: 10 },
    { tier: 7, name: 'GRANDMASTER', icon: '👑', rarity: 'very-rare', sharePerLevel: 35, galaxyTier: 7,
      unitsPerDonation: 5, xpPerDonation: 50, xpPerLevel: 320000, totalLevels: 10 },
    { tier: 8, name: 'SAGE', icon: '🧠', rarity: 'very-rare', sharePerLevel: 40, galaxyTier: 8,
      unitsPerDonation: 5, xpPerDonation: 100, xpPerLevel: 640000, totalLevels: 10 },
    { tier: 9, name: 'ELDER', icon: '🌟', rarity: 'very-rare', sharePerLevel: 45, galaxyTier: 9,
      unitsPerDonation: 5, xpPerDonation: 200, xpPerLevel: 1280000, totalLevels: 10 },
    { tier: 10, name: 'VOIDFARER', icon: '🌌', rarity: 'legendary', sharePerLevel: 50, galaxyTier: 10,
      unitsPerDonation: 1, xpPerDonation: 500, xpPerLevel: 2560000, totalLevels: 10 }
];

// Storage key prefix
const STORAGE_PREFIX = 'voidfarer_certificate_';

// ===== GET CERTIFICATE PROGRESS =====
/**
 * Get certificate progress for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Array>} Array of certificate progress objects
 */
export async function getCertificates(playerId) {
    try {
        const key = `${STORAGE_PREFIX}${playerId}`;
        const saved = await getItem('certificates', playerId);
        
        if (saved && saved.progress) {
            return saved.progress;
        }
        
        // Initialize default progress
        const defaultProgress = CERTIFICATE_TIERS.map(() => ({
            level: 0,
            xp: 0,
            earned: false
        }));
        
        // First certificate (Novice) is available from start
        defaultProgress[0].earned = true;
        
        return defaultProgress;
    } catch (error) {
        console.error('Error getting certificates:', error);
        return CERTIFICATE_TIERS.map(() => ({ level: 0, xp: 0, earned: false }));
    }
}

/**
 * Save certificate progress for a player
 * @param {string} playerId - Player ID
 * @param {Array} progress - Certificate progress array
 * @returns {Promise<boolean>} Success status
 */
export async function saveCertificates(playerId, progress) {
    try {
        await setItem('certificates', { progress, lastUpdated: Date.now() }, playerId);
        return true;
    } catch (error) {
        console.error('Error saving certificates:', error);
        return false;
    }
}

// ===== CERTIFICATE STATUS =====
/**
 * Get status of a specific certificate
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index (0-9)
 * @returns {string} Status: 'earned', 'available', 'locked', 'maxed'
 */
export function getCertificateStatus(progress, index) {
    const cert = CERTIFICATE_TIERS[index];
    const prog = progress[index];
    
    if (!prog) return 'locked';
    
    // Check if maxed
    if (prog.level >= cert.totalLevels) {
        return 'maxed';
    }
    
    // Check if earned (has level > 0)
    if (prog.level > 0 || prog.earned) {
        return 'earned';
    }
    
    // Check if previous certificate is maxed (for tier > 1)
    if (index > 0) {
        const prevProg = progress[index - 1];
        if (prevProg && prevProg.level >= CERTIFICATE_TIERS[index - 1].totalLevels) {
            return 'available';
        }
        return 'locked';
    }
    
    // Tier 1 is always available
    return 'available';
}

/**
 * Check if a certificate can be upgraded
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {boolean} True if upgrade possible
 */
export function canUpgradeCertificate(progress, index) {
    const status = getCertificateStatus(progress, index);
    if (status !== 'earned') return false;
    
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    return prog.level < cert.totalLevels;
}

// ===== XP AND LEVEL CALCULATIONS =====
/**
 * Get XP needed for next level
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {number} XP needed, or 0 if at max
 */
export function getXpNeeded(progress, index) {
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    
    if (!prog || prog.level >= cert.totalLevels) return 0;
    
    const currentLevelXp = prog.xp % cert.xpPerLevel;
    return cert.xpPerLevel - currentLevelXp;
}

/**
 * Get donations needed for next level
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {number} Units needed, or 0 if at max
 */
export function getDonationsNeeded(progress, index) {
    const xpNeeded = getXpNeeded(progress, index);
    if (xpNeeded <= 0) return 0;
    
    const cert = CERTIFICATE_TIERS[index];
    return Math.ceil(xpNeeded / cert.xpPerDonation) * cert.unitsPerDonation;
}

/**
 * Get current level XP progress percentage
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {number} Percentage (0-100)
 */
export function getLevelProgressPercent(progress, index) {
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    
    if (!prog || prog.level >= cert.totalLevels) return 100;
    
    const currentLevelXp = prog.xp % cert.xpPerLevel;
    return (currentLevelXp / cert.xpPerLevel) * 100;
}

// ===== LABOR SHARE CALCULATIONS =====
/**
 * Get total labor share from all certificates
 * @param {Array} progress - Certificate progress array
 * @returns {number} Total share (e.g., 125 means 1.25x multiplier)
 */
export function getTotalLaborShare(progress) {
    let total = 0;
    for (let i = 0; i < CERTIFICATE_TIERS.length; i++) {
        const prog = progress[i];
        const cert = CERTIFICATE_TIERS[i];
        
        if (prog && prog.level > 0) {
            total += cert.sharePerLevel * prog.level;
        }
    }
    return total;
}

/**
 * Get labor share from a specific certificate
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {number} Share value (e.g., 25 for 0.25x)
 */
export function getCertificateShare(progress, index) {
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    
    if (!prog || prog.level === 0) return 0;
    return cert.sharePerLevel * prog.level;
}

/**
 * Calculate how much more ⭐ per day from an upgrade
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @param {number} laborPool - Current labor pool total
 * @param {number} totalPlayerShares - Sum of all players' shares
 * @returns {number} Additional ⭐ per day
 */
export function calculateUpgradeGain(progress, index, laborPool, totalPlayerShares) {
    const cert = CERTIFICATE_TIERS[index];
    const prog = progress[index];
    
    if (!prog || prog.level >= cert.totalLevels) return 0;
    
    const currentShare = cert.sharePerLevel * prog.level;
    const newShare = cert.sharePerLevel * (prog.level + 1);
    const shareGain = newShare - currentShare;
    
    if (totalPlayerShares === 0) return 0;
    
    const currentEarnings = Math.floor(laborPool * (currentShare / totalPlayerShares));
    const newEarnings = Math.floor(laborPool * ((currentShare + shareGain) / totalPlayerShares));
    
    return newEarnings - currentEarnings;
}

/**
 * Calculate how much more ⭐ per day from unlocking a certificate
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @param {number} laborPool - Current labor pool total
 * @param {number} totalPlayerShares - Sum of all players' shares
 * @returns {number} Additional ⭐ per day
 */
export function calculateUnlockGain(progress, index, laborPool, totalPlayerShares) {
    const cert = CERTIFICATE_TIERS[index];
    const shareGain = cert.sharePerLevel * 1;
    
    if (totalPlayerShares === 0) return 0;
    
    return Math.floor(laborPool * (shareGain / totalPlayerShares));
}

// ===== DONATION XP =====
/**
 * Add XP from donation
 * @param {string} playerId - Player ID
 * @param {number} index - Certificate index
 * @param {number} quantity - Number of units donated
 * @returns {Promise<Object>} Result with leveledUp flag and new level
 */
export async function addDonationXP(playerId, index, quantity) {
    try {
        const progress = await getCertificates(playerId);
        const cert = CERTIFICATE_TIERS[index];
        
        // Check if certificate is available
        const status = getCertificateStatus(progress, index);
        if (status === 'locked') {
            return { success: false, error: 'Certificate locked', leveledUp: false };
        }
        
        if (status === 'maxed') {
            return { success: false, error: 'Already maxed', leveledUp: false };
        }
        
        const prog = progress[index];
        
        // Calculate XP gain
        const xpGain = (quantity / cert.unitsPerDonation) * cert.xpPerDonation;
        let newXp = prog.xp + xpGain;
        let leveledUp = false;
        let newLevel = prog.level;
        
        // Check for level ups
        while (newXp >= (newLevel + 1) * cert.xpPerLevel && newLevel < cert.totalLevels) {
            newLevel++;
            leveledUp = true;
        }
        
        // Cap XP at max
        newXp = Math.min(newLevel * cert.xpPerLevel, newXp);
        
        // Update progress
        prog.level = newLevel;
        prog.xp = newXp;
        prog.earned = true;
        
        await saveCertificates(playerId, progress);
        
        return {
            success: true,
            leveledUp,
            newLevel,
            xpGained: xpGain,
            newXp: prog.xp,
            xpNeeded: getXpNeeded(progress, index)
        };
        
    } catch (error) {
        console.error('Error adding donation XP:', error);
        return { success: false, error: error.message, leveledUp: false };
    }
}

// ===== XP FROM EXTRACTION =====
/**
 * Map element rarity to certificate index
 * @param {string} rarity - Element rarity
 * @returns {number} Certificate index (0-9)
 */
export function getCertificateIndexFromRarity(rarity) {
    const rarityMap = {
        'common': 0,
        'uncommon': 1,
        'rare': 2,
        'very-rare': 3,
        'legendary': 4
    };
    return rarityMap[rarity] || 0;
}

/**
 * Add XP from extraction (when player extracts elements)
 * @param {string} playerId - Player ID
 * @param {string} rarity - Element rarity
 * @param {number} quantity - Quantity extracted
 * @returns {Promise<Object>} Result
 */
export async function addExtractionXP(playerId, rarity, quantity) {
    try {
        const certIndex = getCertificateIndexFromRarity(rarity);
        
        // Get the certificate
        const progress = await getCertificates(playerId);
        const status = getCertificateStatus(progress, certIndex);
        
        // Only add XP if certificate is earned
        if (status !== 'earned') {
            return { success: false, reason: 'Certificate not earned' };
        }
        
        // Add XP
        return await addDonationXP(playerId, certIndex, quantity);
        
    } catch (error) {
        console.error('Error adding extraction XP:', error);
        return { success: false, error: error.message };
    }
}

// ===== RESET CERTIFICATES =====
/**
 * Reset certificates for a player (debug/testing)
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success status
 */
export async function resetCertificates(playerId) {
    try {
        const defaultProgress = CERTIFICATE_TIERS.map(() => ({
            level: 0,
            xp: 0,
            earned: false
        }));
        defaultProgress[0].earned = true;
        
        await saveCertificates(playerId, defaultProgress);
        return true;
    } catch (error) {
        console.error('Error resetting certificates:', error);
        return false;
    }
}

// ===== CERTIFICATE STATISTICS =====
/**
 * Get certificate statistics for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Object>} Statistics object
 */
export async function getCertificateStats(playerId) {
    try {
        const progress = await getCertificates(playerId);
        
        let totalLevels = 0;
        let totalXp = 0;
        let maxLevels = 0;
        let earnedCount = 0;
        
        for (let i = 0; i < CERTIFICATE_TIERS.length; i++) {
            const prog = progress[i];
            const cert = CERTIFICATE_TIERS[i];
            
            totalLevels += prog.level;
            totalXp += prog.xp;
            maxLevels += cert.totalLevels;
            
            if (prog.level > 0) earnedCount++;
        }
        
        return {
            totalLevels,
            totalXp,
            maxLevels,
            earnedCount,
            completionPercent: (totalLevels / maxLevels) * 100,
            totalShare: getTotalLaborShare(progress)
        };
        
    } catch (error) {
        console.error('Error getting certificate stats:', error);
        return null;
    }
}

// ===== HELPER FUNCTIONS =====
/**
 * Get certificate by index
 * @param {number} index - Certificate index (0-9)
 * @returns {Object} Certificate data
 */
export function getCertificateByIndex(index) {
    return CERTIFICATE_TIERS[index] || null;
}

/**
 * Get all certificate data
 * @returns {Array} All certificate data
 */
export function getAllCertificateData() {
    return [...CERTIFICATE_TIERS];
}

/**
 * Format share value for display
 * @param {number} share - Share value (e.g., 125)
 * @returns {string} Formatted share (e.g., "1.25%")
 */
export function formatShare(share) {
    return (share / 100).toFixed(2) + '%';
}

/**
 * Format XP for display
 * @param {number} xp - XP value
 * @returns {string} Formatted XP
 */
export function formatXP(xp) {
    if (xp >= 1000000) return (xp / 1000000).toFixed(1) + 'M';
    if (xp >= 1000) return (xp / 1000).toFixed(1) + 'K';
    return xp.toString();
}

// ===== EXPORT =====
export default {
    CERTIFICATE_TIERS,
    getCertificates,
    saveCertificates,
    getCertificateStatus,
    canUpgradeCertificate,
    getXpNeeded,
    getDonationsNeeded,
    getLevelProgressPercent,
    getTotalLaborShare,
    getCertificateShare,
    calculateUpgradeGain,
    calculateUnlockGain,
    addDonationXP,
    addExtractionXP,
    resetCertificates,
    getCertificateStats,
    getCertificateByIndex,
    getAllCertificateData,
    formatShare,
    formatXP
};

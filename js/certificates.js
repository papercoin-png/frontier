// js/certificates.js
import { getItem, setItem } from './storage.js';

export const CERTIFICATE_TIERS = [
    { tier: 1, name: 'NOVICE', icon: '🌱', rarity: 'common', sharePerLevel: 5, unitsPerDonation: 10, xpPerDonation: 10, xpPerLevel: 5000, totalLevels: 10 },
    { tier: 2, name: 'APPRENTICE', icon: '📘', rarity: 'uncommon', sharePerLevel: 10, unitsPerDonation: 10, xpPerDonation: 1, xpPerLevel: 10000, totalLevels: 10 },
    { tier: 3, name: 'JOURNEYMAN', icon: '⚙️', rarity: 'rare', sharePerLevel: 15, unitsPerDonation: 10, xpPerDonation: 2, xpPerLevel: 20000, totalLevels: 10 },
    { tier: 4, name: 'ADEPT', icon: '🔮', rarity: 'very-rare', sharePerLevel: 20, unitsPerDonation: 10, xpPerDonation: 5, xpPerLevel: 40000, totalLevels: 10 },
    { tier: 5, name: 'EXPERT', icon: '💎', rarity: 'very-rare', sharePerLevel: 25, unitsPerDonation: 10, xpPerDonation: 10, xpPerLevel: 80000, totalLevels: 10 },
    { tier: 6, name: 'MASTER', icon: '🏆', rarity: 'very-rare', sharePerLevel: 30, unitsPerDonation: 10, xpPerDonation: 20, xpPerLevel: 160000, totalLevels: 10 },
    { tier: 7, name: 'GRANDMASTER', icon: '👑', rarity: 'very-rare', sharePerLevel: 35, unitsPerDonation: 5, xpPerDonation: 50, xpPerLevel: 320000, totalLevels: 10 },
    { tier: 8, name: 'SAGE', icon: '🧠', rarity: 'very-rare', sharePerLevel: 40, unitsPerDonation: 5, xpPerDonation: 100, xpPerLevel: 640000, totalLevels: 10 },
    { tier: 9, name: 'ELDER', icon: '🌟', rarity: 'very-rare', sharePerLevel: 45, unitsPerDonation: 5, xpPerDonation: 200, xpPerLevel: 1280000, totalLevels: 10 },
    { tier: 10, name: 'VOIDFARER', icon: '🌌', rarity: 'legendary', sharePerLevel: 50, unitsPerDonation: 1, xpPerDonation: 500, xpPerLevel: 2560000, totalLevels: 10 }
];

// Track if we're currently saving to prevent race conditions
let saveInProgress = false;
let pendingSave = null;

/**
 * Get certificates progress for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<Array>} Certificate progress array
 */
export async function getCertificates(playerId) {
    try {
        const saved = await getItem('certificates', playerId);
        if (saved?.progress) {
            // Validate progress structure
            if (Array.isArray(saved.progress) && saved.progress.length === CERTIFICATE_TIERS.length) {
                return saved.progress;
            }
            console.warn('Invalid certificate progress structure, reinitializing');
        }
        
        // Initialize default progress
        const defaultProgress = CERTIFICATE_TIERS.map(() => ({ level: 0, xp: 0, earned: false }));
        defaultProgress[0].earned = true;
        return defaultProgress;
    } catch (error) {
        console.error('Error getting certificates:', error);
        // Return default progress on error
        const defaultProgress = CERTIFICATE_TIERS.map(() => ({ level: 0, xp: 0, earned: false }));
        defaultProgress[0].earned = true;
        return defaultProgress;
    }
}

/**
 * Save certificates progress for a player with retry logic
 * @param {string} playerId - Player ID
 * @param {Array} progress - Certificate progress array
 * @returns {Promise<boolean>} Success status
 */
export async function saveCertificates(playerId, progress) {
    // Prevent concurrent saves
    if (saveInProgress) {
        pendingSave = { playerId, progress };
        console.log('Save already in progress, queuing...');
        return false;
    }
    
    saveInProgress = true;
    
    try {
        // Validate progress before saving
        if (!Array.isArray(progress) || progress.length !== CERTIFICATE_TIERS.length) {
            console.error('Invalid progress data structure', progress);
            return false;
        }
        
        const data = {
            id: playerId,
            progress: progress,
            lastUpdated: Date.now()
        };
        
        const result = await setItem('certificates', data, playerId);
        
        if (result) {
            console.log(`✅ Certificates saved for player ${playerId}`);
            
            // Dispatch event for UI updates
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('certificates-updated', {
                    detail: { playerId, progress, timestamp: data.lastUpdated }
                }));
            }
        } else {
            console.warn(`Failed to save certificates for player ${playerId}`);
        }
        
        return result;
    } catch (error) {
        console.error('Error saving certificates:', error);
        return false;
    } finally {
        saveInProgress = false;
        
        // Process any pending save
        if (pendingSave) {
            const { playerId: pendingId, progress: pendingProgress } = pendingSave;
            pendingSave = null;
            setTimeout(() => saveCertificates(pendingId, pendingProgress), 100);
        }
    }
}

/**
 * Get certificate status for a specific tier
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {string} Status: 'locked', 'available', 'earned', 'maxed'
 */
export function getCertificateStatus(progress, index) {
    if (!progress || !progress[index]) return 'locked';
    
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    
    if (!prog) return 'locked';
    if (prog.level >= cert.totalLevels) return 'maxed';
    if (prog.level > 0) return 'earned';
    if (index === 0) return 'available';
    if (progress[index - 1]?.level >= CERTIFICATE_TIERS[index - 1].totalLevels) return 'available';
    return 'locked';
}

/**
 * Get XP needed for next level
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {number} XP needed
 */
export function getXpNeeded(progress, index) {
    if (!progress || !progress[index]) return 0;
    
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    
    if (!prog || prog.level >= cert.totalLevels) return 0;
    const currentLevelXp = prog.xp - (prog.level * cert.xpPerLevel);
    return cert.xpPerLevel - currentLevelXp;
}

/**
 * Get donations needed for next level
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {number} Units needed
 */
export function getDonationsNeeded(progress, index) {
    const xpNeeded = getXpNeeded(progress, index);
    if (xpNeeded <= 0) return 0;
    const cert = CERTIFICATE_TIERS[index];
    return Math.ceil(xpNeeded / cert.xpPerDonation) * cert.unitsPerDonation;
}

/**
 * Get level progress percentage
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {number} Progress percentage (0-100)
 */
export function getLevelProgressPercent(progress, index) {
    if (!progress || !progress[index]) return 0;
    
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    
    if (!prog || prog.level >= cert.totalLevels) return 100;
    const currentLevelXp = prog.xp - (prog.level * cert.xpPerLevel);
    return Math.min(100, Math.max(0, (currentLevelXp / cert.xpPerLevel) * 100));
}

/**
 * Calculate total labor share from all certificates
 * @param {Array} progress - Certificate progress array
 * @returns {number} Total share (in hundredths of a percent)
 */
export function getTotalLaborShare(progress) {
    if (!progress || !Array.isArray(progress)) return 0;
    
    let total = 0;
    for (let i = 0; i < CERTIFICATE_TIERS.length; i++) {
        const prog = progress[i];
        if (prog?.level > 0) {
            total += CERTIFICATE_TIERS[i].sharePerLevel * prog.level;
        }
    }
    return total;
}

/**
 * Calculate gain from upgrading a certificate
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @param {number} laborPool - Total labor pool
 * @param {number} totalPlayerShares - Total player shares
 * @returns {number} Estimated daily gain
 */
export function calculateUpgradeGain(progress, index, laborPool, totalPlayerShares) {
    if (!progress || !progress[index]) return 0;
    
    const cert = CERTIFICATE_TIERS[index];
    const prog = progress[index];
    
    if (!prog || prog.level >= cert.totalLevels) return 0;
    const currentShare = cert.sharePerLevel * prog.level;
    const newShare = cert.sharePerLevel * (prog.level + 1);
    const shareGain = newShare - currentShare;
    
    if (totalPlayerShares === 0) return 0;
    return Math.floor(laborPool * (shareGain / totalPlayerShares));
}

/**
 * Calculate gain from unlocking a certificate
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @param {number} laborPool - Total labor pool
 * @param {number} totalPlayerShares - Total player shares
 * @returns {number} Estimated daily gain
 */
export function calculateUnlockGain(progress, index, laborPool, totalPlayerShares) {
    if (!progress || !progress[index]) return 0;
    
    const cert = CERTIFICATE_TIERS[index];
    const shareGain = cert.sharePerLevel * 1;
    
    if (totalPlayerShares === 0) return 0;
    return Math.floor(laborPool * (shareGain / totalPlayerShares));
}

/**
 * Add donation XP to a certificate
 * @param {string} playerId - Player ID
 * @param {number} index - Certificate index
 * @param {number} quantity - Number of units donated
 * @returns {Promise<Object>} Result with success, leveledUp, newLevel, xpGained, newXp
 */
export async function addDonationXP(playerId, index, quantity) {
    try {
        // Validate inputs
        if (!playerId) {
            return { success: false, error: 'Invalid player ID' };
        }
        
        if (index < 0 || index >= CERTIFICATE_TIERS.length) {
            return { success: false, error: 'Invalid certificate index' };
        }
        
        if (quantity <= 0) {
            return { success: false, error: 'Invalid donation quantity' };
        }
        
        const cert = CERTIFICATE_TIERS[index];
        const progress = await getCertificates(playerId);
        
        // Verify progress array is valid
        if (!progress || !progress[index]) {
            return { success: false, error: 'Certificate data corrupted' };
        }
        
        const status = getCertificateStatus(progress, index);
        
        if (status === 'locked') {
            return { success: false, error: 'Certificate locked' };
        }
        
        if (status === 'maxed') {
            return { success: false, error: 'Already maxed' };
        }
        
        const prog = progress[index];
        
        // Calculate XP gain
        const xpGain = (quantity / cert.unitsPerDonation) * cert.xpPerDonation;
        const oldXp = prog.xp;
        prog.xp += xpGain;
        
        // Check for level ups
        let leveledUp = false;
        let newLevel = prog.level;
        
        while (newLevel < cert.totalLevels && prog.xp >= (newLevel + 1) * cert.xpPerLevel) {
            newLevel++;
            leveledUp = true;
        }
        
        prog.level = newLevel;
        prog.earned = true;
        
        // Save the updated progress
        const saveResult = await saveCertificates(playerId, progress);
        
        if (!saveResult) {
            // Revert changes if save failed
            prog.xp = oldXp;
            prog.level = prog.level; // Keep original level
            return { success: false, error: 'Failed to save certificate progress' };
        }
        
        return {
            success: true,
            leveledUp,
            newLevel,
            xpGained: xpGain,
            newXp: prog.xp
        };
        
    } catch (error) {
        console.error('Error adding donation XP:', error);
        return { success: false, error: error.message };
    }
}

// ===== NEW FUNCTION: Award XP to ALL certificates (for shop booster) =====
/**
 * Award XP to all certificates (for shop Certificate Booster)
 * @param {string} playerId - Player ID
 * @param {number} xpAmount - Amount of XP to add to each certificate
 * @returns {Promise<Object>} Result with success and details of level ups
 */
export async function awardCertificateXP(playerId, xpAmount) {
    try {
        if (!playerId) {
            return { success: false, error: 'Invalid player ID' };
        }
        
        if (xpAmount <= 0) {
            return { success: false, error: 'Invalid XP amount' };
        }
        
        const progress = await getCertificates(playerId);
        let anyLeveledUp = false;
        const levelUps = [];
        
        // Add XP to each certificate
        for (let i = 0; i < CERTIFICATE_TIERS.length; i++) {
            const cert = CERTIFICATE_TIERS[i];
            const prog = progress[i];
            
            // Skip if already maxed
            if (prog.level >= cert.totalLevels) continue;
            
            const oldLevel = prog.level;
            prog.xp += xpAmount;
            
            // Check for level ups
            let newLevel = prog.level;
            while (newLevel < cert.totalLevels && prog.xp >= (newLevel + 1) * cert.xpPerLevel) {
                newLevel++;
            }
            
            if (newLevel > oldLevel) {
                anyLeveledUp = true;
                levelUps.push({
                    certificate: cert.name,
                    oldLevel: oldLevel,
                    newLevel: newLevel
                });
                prog.level = newLevel;
            }
            prog.earned = true;
        }
        
        // Save updated progress
        const saveResult = await saveCertificates(playerId, progress);
        
        if (!saveResult) {
            return { success: false, error: 'Failed to save certificate progress' };
        }
        
        return {
            success: true,
            leveledUp: anyLeveledUp,
            levelUps: levelUps,
            xpAdded: xpAmount
        };
        
    } catch (error) {
        console.error('Error awarding certificate XP:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Format share value for display
 * @param {number} share - Share value (in hundredths of a percent)
 * @returns {string} Formatted percentage
 */
export function formatShare(share) {
    return (share / 100).toFixed(2) + '%';
}

/**
 * Check if a certificate is maxed
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {boolean} True if maxed
 */
export function isCertificateMaxed(progress, index) {
    if (!progress || !progress[index]) return false;
    return progress[index].level >= CERTIFICATE_TIERS[index].totalLevels;
}

/**
 * Get current level for a certificate
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {number} Current level
 */
export function getCertificateLevel(progress, index) {
    if (!progress || !progress[index]) return 0;
    return progress[index].level;
}

/**
 * Get current XP for a certificate
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {number} Current XP
 */
export function getCertificateXP(progress, index) {
    if (!progress || !progress[index]) return 0;
    return progress[index].xp;
}

/**
 * Get total XP needed for next level
 * @param {Array} progress - Certificate progress array
 * @param {number} index - Certificate index
 * @returns {number} XP needed for next level
 */
export function getXpForNextLevel(progress, index) {
    if (!progress || !progress[index]) return 0;
    
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    
    if (prog.level >= cert.totalLevels) return 0;
    return cert.xpPerLevel;
}

/**
 * Reset all certificates for a player
 * @param {string} playerId - Player ID
 * @returns {Promise<boolean>} Success status
 */
export async function resetCertificates(playerId) {
    try {
        const defaultProgress = CERTIFICATE_TIERS.map(() => ({ level: 0, xp: 0, earned: false }));
        defaultProgress[0].earned = true;
        return await saveCertificates(playerId, defaultProgress);
    } catch (error) {
        console.error('Error resetting certificates:', error);
        return false;
    }
}

/**
 * Validate and repair certificate progress if corrupted
 * @param {string} playerId - Player ID
 * @returns {Promise<Array>} Repaired progress
 */
export async function repairCertificates(playerId) {
    try {
        const progress = await getCertificates(playerId);
        let repaired = false;
        
        // Check each certificate for consistency
        for (let i = 0; i < CERTIFICATE_TIERS.length; i++) {
            const cert = CERTIFICATE_TIERS[i];
            const prog = progress[i];
            
            if (!prog) {
                progress[i] = { level: 0, xp: 0, earned: i === 0 };
                repaired = true;
                continue;
            }
            
            // Ensure level is within bounds
            if (prog.level < 0) {
                prog.level = 0;
                repaired = true;
            }
            
            if (prog.level > cert.totalLevels) {
                prog.level = cert.totalLevels;
                repaired = true;
            }
            
            // Ensure XP is within bounds for the level
            const maxXpForLevel = (prog.level + 1) * cert.xpPerLevel;
            if (prog.xp > maxXpForLevel) {
                prog.xp = maxXpForLevel;
                repaired = true;
            }
            
            if (prog.xp < 0) {
                prog.xp = 0;
                repaired = true;
            }
        }
        
        if (repaired) {
            console.log('Repaired corrupted certificate progress');
            await saveCertificates(playerId, progress);
        }
        
        return progress;
    } catch (error) {
        console.error('Error repairing certificates:', error);
        return CERTIFICATE_TIERS.map(() => ({ level: 0, xp: 0, earned: false }));
    }
}

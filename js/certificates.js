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
export async function getCertificates(playerId) {
    try {
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

// ===== SAVE CERTIFICATE PROGRESS =====
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
export function getCertificateStatus(progress, index) {
    const cert = CERTIFICATE_TIERS[index];
    const prog = progress[index];
    
    if (!prog) return 'locked';
    
    if (prog.level >= cert.totalLevels) {
        return 'maxed';
    }
    
    if (prog.level > 0 || prog.earned) {
        return 'earned';
    }
    
    if (index > 0) {
        const prevProg = progress[index - 1];
        if (prevProg && prevProg.level >= CERTIFICATE_TIERS[index - 1].totalLevels) {
            return 'available';
        }
        return 'locked';
    }
    
    return 'available';
}

// ===== XP AND LEVEL CALCULATIONS =====
export function getXpNeeded(progress, index) {
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    
    if (!prog || prog.level >= cert.totalLevels) return 0;
    
    const levelStartXp = prog.level * cert.xpPerLevel;
    const currentLevelXp = prog.xp - levelStartXp;
    return cert.xpPerLevel - currentLevelXp;
}

export function getDonationsNeeded(progress, index) {
    const xpNeeded = getXpNeeded(progress, index);
    if (xpNeeded <= 0) return 0;
    
    const cert = CERTIFICATE_TIERS[index];
    return Math.ceil(xpNeeded / cert.xpPerDonation) * cert.unitsPerDonation;
}

export function getLevelProgressPercent(progress, index) {
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    
    if (!prog || prog.level >= cert.totalLevels) return 100;
    
    const levelStartXp = prog.level * cert.xpPerLevel;
    const currentLevelXp = prog.xp - levelStartXp;
    return (currentLevelXp / cert.xpPerLevel) * 100;
}

// ===== LABOR SHARE CALCULATIONS =====
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

export function getCertificateShare(progress, index) {
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    
    if (!prog || prog.level === 0) return 0;
    return cert.sharePerLevel * prog.level;
}

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

export function calculateUnlockGain(progress, index, laborPool, totalPlayerShares) {
    const cert = CERTIFICATE_TIERS[index];
    const shareGain = cert.sharePerLevel * 1;
    
    if (totalPlayerShares === 0) return 0;
    
    return Math.floor(laborPool * (shareGain / totalPlayerShares));
}

// ===== DONATION XP =====
export async function addDonationXP(playerId, index, quantity) {
    try {
        const progress = await getCertificates(playerId);
        const cert = CERTIFICATE_TIERS[index];
        
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
        const xpPerLevel = cert.xpPerLevel;
        while (newXp >= (newLevel + 1) * xpPerLevel && newLevel < cert.totalLevels) {
            newLevel++;
            leveledUp = true;
        }
        
        // Update XP (cap at max)
        prog.xp = Math.min(newLevel * xpPerLevel, newXp);
        prog.level = newLevel;
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

// ===== EXPORT =====
export default {
    CERTIFICATE_TIERS,
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
    addDonationXP
};

// ===== EXPOSE TO WINDOW FOR TESTING =====
if (typeof window !== 'undefined') {
    window.getCertificates = getCertificates;
    window.addDonationXP = addDonationXP;
    window.saveCertificates = saveCertificates;
    window.CERTIFICATE_TIERS = CERTIFICATE_TIERS;
}

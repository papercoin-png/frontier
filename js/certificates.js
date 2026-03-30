// js/certificates.js
import { getItem, setItem } from './storage.js';

export const CERTIFICATE_TIERS = [
    { tier: 1, name: 'NOVICE', icon: '🌱', rarity: 'common', sharePerLevel: 5, unitsPerDonation: 10, xpPerDonation: 1, xpPerLevel: 5000, totalLevels: 10 },
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

export async function getCertificates(playerId) {
    const saved = await getItem('certificates', playerId);
    if (saved?.progress) return saved.progress;
    
    const defaultProgress = CERTIFICATE_TIERS.map(() => ({ level: 0, xp: 0, earned: false }));
    defaultProgress[0].earned = true;
    return defaultProgress;
}

export async function saveCertificates(playerId, progress) {
    // Add id property for the store's keyPath
    const item = {
        id: playerId,
        progress: progress,
        lastUpdated: Date.now()
    };
    await setItem('certificates', item);
}

export function getCertificateStatus(progress, index) {
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    if (!prog) return 'locked';
    if (prog.level >= cert.totalLevels) return 'maxed';
    if (prog.level > 0) return 'earned';
    if (index === 0) return 'available';
    if (progress[index - 1]?.level >= CERTIFICATE_TIERS[index - 1].totalLevels) return 'available';
    return 'locked';
}

export function getXpNeeded(progress, index) {
    const prog = progress[index];
    const cert = CERTIFICATE_TIERS[index];
    if (!prog || prog.level >= cert.totalLevels) return 0;
    const currentLevelXp = prog.xp - (prog.level * cert.xpPerLevel);
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
    const currentLevelXp = prog.xp - (prog.level * cert.xpPerLevel);
    return (currentLevelXp / cert.xpPerLevel) * 100;
}

export function getTotalLaborShare(progress) {
    let total = 0;
    for (let i = 0; i < CERTIFICATE_TIERS.length; i++) {
        const prog = progress[i];
        if (prog?.level > 0) {
            total += CERTIFICATE_TIERS[i].sharePerLevel * prog.level;
        }
    }
    return total;
}

export function calculateUpgradeGain(progress, index, laborPool, totalPlayerShares) {
    const cert = CERTIFICATE_TIERS[index];
    const prog = progress[index];
    if (!prog || prog.level >= cert.totalLevels) return 0;
    const currentShare = cert.sharePerLevel * prog.level;
    const newShare = cert.sharePerLevel * (prog.level + 1);
    const shareGain = newShare - currentShare;
    if (totalPlayerShares === 0) return 0;
    return Math.floor(laborPool * (shareGain / totalPlayerShares));
}

export function calculateUnlockGain(progress, index, laborPool, totalPlayerShares) {
    const cert = CERTIFICATE_TIERS[index];
    const shareGain = cert.sharePerLevel * 1;
    if (totalPlayerShares === 0) return 0;
    return Math.floor(laborPool * (shareGain / totalPlayerShares));
}

export async function addDonationXP(playerId, index, quantity) {
    const progress = await getCertificates(playerId);
    const cert = CERTIFICATE_TIERS[index];
    const status = getCertificateStatus(progress, index);
    
    if (status === 'locked') return { success: false, error: 'Certificate locked' };
    if (status === 'maxed') return { success: false, error: 'Already maxed' };
    
    const prog = progress[index];
    
    // Calculate XP with full decimal precision - no rounding down
    const xpGain = (quantity / cert.unitsPerDonation) * cert.xpPerDonation;
    
    // Add XP with full precision
    prog.xp += xpGain;
    
    let leveledUp = false;
    let newLevel = prog.level;
    
    // Check for level ups
    while (newLevel < cert.totalLevels && prog.xp >= (newLevel + 1) * cert.xpPerLevel) {
        newLevel++;
        leveledUp = true;
    }
    
    prog.level = newLevel;
    prog.earned = true;
    
    await saveCertificates(playerId, progress);
    
    return {
        success: true,
        leveledUp,
        newLevel,
        xpGained: xpGain,
        newXp: prog.xp
    };
}

export function formatShare(share) {
    return (share / 100).toFixed(2) + '%';
}

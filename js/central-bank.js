// js/central-bank.js - Automatic monetary policy for Voidfarer
// Manages money supply to target inflation and velocity ranges
// Provides stimulus during stagnation and contraction during overheating

import { 
    getTotalMoneySupply,
    refreshMoneySupply,
    addMoneyToSupply,
    removeMoneyFromSupply,
    calculateInflationRate,
    calculateMoneyVelocity,
    getDailyMetrics,
    formatMoney,
    formatPercent
} from './economic-metrics.js';

import { getCommunityFund, allocateFromFund, addToFund } from './community-fund.js';
import { getPlayer, addCredits } from './storage.js';
import { getDb, getAll } from './db.js';

// ===== CENTRAL BANK CONFIGURATION =====
export const CENTRAL_BANK_CONFIG = {
    // Inflation targets
    targetInflation: { 
        min: 0.02,      // 2% - below this triggers stimulus
        max: 0.05,      // 5% - above this triggers warning
        ideal: 0.035,   // 3.5% - perfect
        deflationThreshold: 0.01,      // 1% - critical, emergency stimulus
        overheatingThreshold: 0.08     // 8% - critical, emergency contraction
    },
    
    // Velocity targets
    targetVelocity: {
        min: 0.5,       // 0.5 - below this indicates stagnation
        max: 1.5,       // 1.5 - above this indicates speculation
        ideal: 1.0,     // 1.0 - healthy velocity
        stagnationThreshold: 0.3,      // 0.3 - critical stagnation
        speculationThreshold: 2.0      // 2.0 - critical speculation
    },
    
    // Intervention amounts (as % of money supply)
    stimulusAmount: {
        normal: 0.03,       // 3% - normal stimulus
        moderate: 0.05,     // 5% - moderate stimulus
        emergency: 0.10     // 10% - emergency stimulus
    },
    
    contractionAmount: {
        normal: 0.02,       // 2% - normal contraction
        moderate: 0.04,     // 4% - moderate contraction
        emergency: 0.08     // 8% - emergency contraction
    },
    
    // Intervention thresholds
    interventionCooldown: 7 * 24 * 60 * 60 * 1000,  // 7 days between interventions
    maxInterventionPerMonth: 2,                     // Maximum 2 interventions per month
    
    // Minimum money supply to intervene
    minMoneySupply: 1000000,  // 1M minimum to avoid negative
    
    // Policy log storage key
    policyLogStore: 'centralBankPolicyLog'
};

// ===== STORAGE KEYS =====
const POLICY_STORAGE_KEY = 'voidfarer_central_bank_policy';
const POLICY_HISTORY_KEY = 'voidfarer_central_bank_history';

// ===== CACHE =====
let lastInterventionTime = 0;
let interventionsThisMonth = 0;
let currentMonth = new Date().getMonth();
let currentPolicyState = null;

// ===== INITIALIZE CENTRAL BANK =====
export async function initializeCentralBank() {
    // Load saved policy state
    const savedState = localStorage.getItem(POLICY_STORAGE_KEY);
    if (savedState) {
        const state = JSON.parse(savedState);
        lastInterventionTime = state.lastInterventionTime || 0;
        interventionsThisMonth = state.interventionsThisMonth || 0;
        currentMonth = state.currentMonth || new Date().getMonth();
        currentPolicyState = state;
    } else {
        currentPolicyState = {
            lastInterventionTime: 0,
            interventionsThisMonth: 0,
            currentMonth: new Date().getMonth(),
            totalStimulusGiven: 0,
            totalContractionApplied: 0,
            lastPolicyAction: null,
            policyHistory: []
        };
        savePolicyState();
    }
    
    console.log('🏦 Central Bank initialized');
    return currentPolicyState;
}

// ===== SAVE POLICY STATE =====
function savePolicyState() {
    localStorage.setItem(POLICY_STORAGE_KEY, JSON.stringify(currentPolicyState));
}

// ===== RESET MONTHLY COUNTER =====
function checkMonthReset() {
    const now = new Date();
    if (now.getMonth() !== currentMonth) {
        currentMonth = now.getMonth();
        interventionsThisMonth = 0;
        currentPolicyState.currentMonth = currentMonth;
        currentPolicyState.interventionsThisMonth = 0;
        savePolicyState();
    }
}

// ===== CHECK INTERVENTION COOLDOWN =====
function canIntervene() {
    const now = Date.now();
    if (now - lastInterventionTime < CENTRAL_BANK_CONFIG.interventionCooldown) {
        return false;
    }
    if (interventionsThisMonth >= CENTRAL_BANK_CONFIG.maxInterventionPerMonth) {
        return false;
    }
    return true;
}

// ===== DETERMINE ECONOMIC CONDITION =====
export async function getEconomicCondition() {
    const inflation = await calculateInflationRate();
    const velocity = await calculateMoneyVelocity();
    const moneySupply = getTotalMoneySupply();
    
    let condition = 'NORMAL';
    let severity = 'none';
    
    // Check inflation
    if (inflation < CENTRAL_BANK_CONFIG.targetInflation.deflationThreshold) {
        condition = 'DEFLATION';
        severity = 'emergency';
    } else if (inflation < CENTRAL_BANK_CONFIG.targetInflation.min) {
        condition = 'STIMULUS_NEEDED';
        severity = 'normal';
    } else if (inflation > CENTRAL_BANK_CONFIG.targetInflation.overheatingThreshold) {
        condition = 'OVERHEATING';
        severity = 'emergency';
    } else if (inflation > CENTRAL_BANK_CONFIG.targetInflation.max) {
        condition = 'COOLING_NEEDED';
        severity = 'normal';
    }
    
    // Check velocity (overrides if critical)
    if (velocity < CENTRAL_BANK_CONFIG.targetVelocity.stagnationThreshold) {
        condition = 'STAGNATION';
        severity = 'emergency';
    } else if (velocity < CENTRAL_BANK_CONFIG.targetVelocity.min) {
        if (condition === 'NORMAL') {
            condition = 'STIMULUS_NEEDED';
            severity = 'normal';
        }
    } else if (velocity > CENTRAL_BANK_CONFIG.targetVelocity.speculationThreshold) {
        condition = 'SPECULATION';
        severity = 'emergency';
    } else if (velocity > CENTRAL_BANK_CONFIG.targetVelocity.max) {
        if (condition === 'NORMAL') {
            condition = 'COOLING_NEEDED';
            severity = 'normal';
        }
    }
    
    // Check money supply minimum
    if (moneySupply < CENTRAL_BANK_CONFIG.minMoneySupply) {
        condition = 'EMERGENCY_STIMULUS';
        severity = 'emergency';
    }
    
    return {
        condition,
        severity,
        inflation,
        velocity,
        moneySupply,
        canIntervene: canIntervene(),
        interventionsRemaining: CENTRAL_BANK_CONFIG.maxInterventionPerMonth - interventionsThisMonth
    };
}

// ===== CALCULATE STIMULUS AMOUNT =====
function calculateStimulusAmount(moneySupply, severity) {
    let percentage;
    switch (severity) {
        case 'emergency':
            percentage = CENTRAL_BANK_CONFIG.stimulusAmount.emergency;
            break;
        case 'moderate':
            percentage = CENTRAL_BANK_CONFIG.stimulusAmount.moderate;
            break;
        default:
            percentage = CENTRAL_BANK_CONFIG.stimulusAmount.normal;
    }
    return Math.floor(moneySupply * percentage);
}

// ===== CALCULATE CONTRACTION AMOUNT =====
function calculateContractionAmount(moneySupply, severity) {
    let percentage;
    switch (severity) {
        case 'emergency':
            percentage = CENTRAL_BANK_CONFIG.contractionAmount.emergency;
            break;
        case 'moderate':
            percentage = CENTRAL_BANK_CONFIG.contractionAmount.moderate;
            break;
        default:
            percentage = CENTRAL_BANK_CONFIG.contractionAmount.normal;
    }
    return Math.floor(moneySupply * percentage);
}

// ===== APPLY STIMULUS =====
async function applyStimulus(amount, reason, severity) {
    console.log(`🏦 CENTRAL BANK: Applying stimulus of ${formatMoney(amount)} - ${reason}`);
    
    // Add to money supply
    const newMoneySupply = await addMoneyToSupply(amount);
    
    // Record the action
    const action = {
        id: 'stim_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: 'STIMULUS',
        amount: amount,
        reason: reason,
        severity: severity,
        moneySupplyBefore: newMoneySupply - amount,
        moneySupplyAfter: newMoneySupply,
        timestamp: Date.now(),
        date: new Date().toISOString()
    };
    
    // Add to policy history
    currentPolicyState.policyHistory.unshift(action);
    currentPolicyState.totalStimulusGiven += amount;
    currentPolicyState.lastInterventionTime = Date.now();
    currentPolicyState.lastPolicyAction = action;
    interventionsThisMonth++;
    currentPolicyState.interventionsThisMonth = interventionsThisMonth;
    savePolicyState();
    
    // Log to allocation log for transparency
    addToCentralBankLog(action);
    
    return action;
}

// ===== APPLY CONTRACTION =====
async function applyContraction(amount, reason, severity) {
    console.log(`🏦 CENTRAL BANK: Applying contraction of ${formatMoney(amount)} - ${reason}`);
    
    // Remove from money supply
    const newMoneySupply = await removeMoneyFromSupply(amount);
    
    // Record the action
    const action = {
        id: 'contr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: 'CONTRACTION',
        amount: amount,
        reason: reason,
        severity: severity,
        moneySupplyBefore: newMoneySupply + amount,
        moneySupplyAfter: newMoneySupply,
        timestamp: Date.now(),
        date: new Date().toISOString()
    };
    
    // Add to policy history
    currentPolicyState.policyHistory.unshift(action);
    currentPolicyState.totalContractionApplied += amount;
    currentPolicyState.lastInterventionTime = Date.now();
    currentPolicyState.lastPolicyAction = action;
    interventionsThisMonth++;
    currentPolicyState.interventionsThisMonth = interventionsThisMonth;
    savePolicyState();
    
    // Log to allocation log for transparency
    addToCentralBankLog(action);
    
    return action;
}

// ===== APPLY STIMULUS VIA COMMUNITY FUND =====
async function applyStimulusThroughFund(amount, reason) {
    console.log(`🏦 CENTRAL BANK: Stimulus of ${formatMoney(amount)} allocated via Community Fund - ${reason}`);
    
    // Add to community fund first
    await addToFund(amount, 'central_bank', `Monetary stimulus: ${reason}`, 'reserve');
    
    // Then allocate to players via grant system
    const allocation = await allocateFromFund(
        amount,
        'emergency_aid',
        'Economic Stimulus',
        `Central bank stimulus: ${reason}`,
        'central_bank'
    );
    
    if (allocation.success) {
        console.log(`✅ Stimulus of ${formatMoney(amount)} allocated to community fund`);
    }
    
    // Add to money supply
    await addMoneyToSupply(amount);
    
    const action = {
        id: 'stim_fund_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: 'STIMULUS_THROUGH_FUND',
        amount: amount,
        reason: reason,
        allocationId: allocation.allocation?.id,
        timestamp: Date.now()
    };
    
    addToCentralBankLog(action);
    return action;
}

// ===== DISTRIBUTE STIMULUS DIRECTLY TO PLAYERS =====
async function distributeStimulusToPlayers(amount, reason) {
    console.log(`🏦 CENTRAL BANK: Distributing ${formatMoney(amount)} directly to players - ${reason}`);
    
    // Get all players
    const players = await getAllPlayers();
    if (players.length === 0) {
        console.warn('No players found for stimulus distribution');
        return null;
    }
    
    // Distribute equally
    const perPlayerAmount = Math.floor(amount / players.length);
    let totalDistributed = 0;
    
    for (const player of players) {
        await addCredits(perPlayerAmount, player.id);
        totalDistributed += perPlayerAmount;
    }
    
    // Add remainder to money supply
    await addMoneyToSupply(totalDistributed);
    
    const action = {
        id: 'stim_direct_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: 'STIMULUS_DIRECT',
        amount: totalDistributed,
        perPlayerAmount: perPlayerAmount,
        playerCount: players.length,
        reason: reason,
        timestamp: Date.now()
    };
    
    addToCentralBankLog(action);
    return action;
}

// ===== GET ALL PLAYERS HELPER =====
async function getAllPlayers() {
    try {
        const db = await getDb();
        if (db && db.objectStoreNames.contains('player')) {
            const players = await getAll('player');
            return players || [];
        }
    } catch (error) {
        console.error('Error getting players:', error);
    }
    
    // Fallback: current player only
    const player = await getPlayer();
    return player ? [player] : [];
}

// ===== ADD TO CENTRAL BANK LOG =====
function addToCentralBankLog(entry) {
    try {
        const log = localStorage.getItem(POLICY_HISTORY_KEY);
        const allLogs = log ? JSON.parse(log) : [];
        
        allLogs.unshift({
            ...entry,
            timestamp: entry.timestamp || Date.now(),
            date: new Date().toISOString()
        });
        
        // Keep only last 100 entries
        while (allLogs.length > 100) {
            allLogs.pop();
        }
        
        localStorage.setItem(POLICY_HISTORY_KEY, JSON.stringify(allLogs));
    } catch (error) {
        console.error('Error adding to central bank log:', error);
    }
}

// ===== GET POLICY HISTORY =====
export function getPolicyHistory(limit = 20) {
    const log = localStorage.getItem(POLICY_HISTORY_KEY);
    const allLogs = log ? JSON.parse(log) : [];
    return allLogs.slice(0, limit);
}

// ===== GET CENTRAL BANK STATUS =====
export async function getCentralBankStatus() {
    const condition = await getEconomicCondition();
    const moneySupply = getTotalMoneySupply();
    const inflation = await calculateInflationRate();
    const velocity = await calculateMoneyVelocity();
    const history = getPolicyHistory(5);
    
    return {
        condition: condition.condition,
        severity: condition.severity,
        canIntervene: condition.canIntervene,
        interventionsThisMonth: interventionsThisMonth,
        interventionsRemaining: condition.interventionsRemaining,
        lastInterventionTime: lastInterventionTime,
        lastInterventionDate: lastInterventionTime ? new Date(lastInterventionTime).toLocaleString() : 'Never',
        totalStimulusGiven: currentPolicyState.totalStimulusGiven,
        totalContractionApplied: currentPolicyState.totalContractionApplied,
        currentMetrics: {
            moneySupply: formatMoney(moneySupply),
            inflation: formatPercent(inflation),
            velocity: velocity.toFixed(2),
            targetInflation: `${formatPercent(CENTRAL_BANK_CONFIG.targetInflation.min)} - ${formatPercent(CENTRAL_BANK_CONFIG.targetInflation.max)}`,
            targetVelocity: `${CENTRAL_BANK_CONFIG.targetVelocity.min} - ${CENTRAL_BANK_CONFIG.targetVelocity.max}`
        },
        recentActions: history
    };
}

// ===== MAIN MONETARY POLICY ENGINE =====
export async function runMonetaryPolicy() {
    console.log('🏦 Running monetary policy check...');
    
    // Reset monthly counter if needed
    checkMonthReset();
    
    // Get current economic condition
    const condition = await getEconomicCondition();
    
    // Check if we can intervene
    if (!condition.canIntervene) {
        console.log(`🏦 Central Bank: Cannot intervene - cooldown active or monthly limit reached`);
        return { action: 'SKIPPED', reason: 'Cooldown or limit reached', condition };
    }
    
    const moneySupply = condition.moneySupply;
    let action = null;
    let result = null;
    
    // Emergency deflation or stagnation
    if (condition.condition === 'DEFLATION' || condition.condition === 'STAGNATION' || condition.condition === 'EMERGENCY_STIMULUS') {
        const amount = calculateStimulusAmount(moneySupply, 'emergency');
        result = await applyStimulus(amount, `Emergency: ${condition.condition}`, 'emergency');
        action = 'EMERGENCY_STIMULUS';
    }
    // Normal stimulus needed
    else if (condition.condition === 'STIMULUS_NEEDED') {
        const amount = calculateStimulusAmount(moneySupply, 'normal');
        result = await applyStimulus(amount, `Stimulus needed: inflation ${formatPercent(condition.inflation)}`, 'normal');
        action = 'STIMULUS';
    }
    // Emergency overheating
    else if (condition.condition === 'OVERHEATING') {
        const amount = calculateContractionAmount(moneySupply, 'emergency');
        result = await applyContraction(amount, `Emergency: ${condition.condition}`, 'emergency');
        action = 'EMERGENCY_CONTRACTION';
    }
    // Normal cooling needed
    else if (condition.condition === 'COOLING_NEEDED') {
        const amount = calculateContractionAmount(moneySupply, 'normal');
        result = await applyContraction(amount, `Cooling needed: inflation ${formatPercent(condition.inflation)}`, 'normal');
        action = 'CONTRACTION';
    }
    // Speculation
    else if (condition.condition === 'SPECULATION') {
        const amount = calculateContractionAmount(moneySupply, 'moderate');
        result = await applyContraction(amount, `Speculation detected: velocity ${condition.velocity.toFixed(2)}`, 'moderate');
        action = 'SPECULATION_CONTRACTION';
    }
    
    if (result) {
        console.log(`🏦 Central Bank: ${action} - ${formatMoney(result.amount)}`);
        return { action, result, condition };
    }
    
    console.log('🏦 Central Bank: No action needed - economy stable');
    return { action: 'NONE', result: null, condition };
}

// ===== MANUAL OVERRIDE FUNCTIONS =====
export async function manualStimulus(amount, reason) {
    if (amount <= 0) return { success: false, reason: 'Amount must be positive' };
    
    const moneySupply = getTotalMoneySupply();
    if (amount > moneySupply * 0.2) {
        return { success: false, reason: 'Stimulus amount cannot exceed 20% of money supply' };
    }
    
    const result = await applyStimulus(amount, `Manual stimulus: ${reason}`, 'manual');
    return { success: true, result };
}

export async function manualContraction(amount, reason) {
    if (amount <= 0) return { success: false, reason: 'Amount must be positive' };
    
    const moneySupply = getTotalMoneySupply();
    if (amount > moneySupply * 0.2) {
        return { success: false, reason: 'Contraction amount cannot exceed 20% of money supply' };
    }
    
    const result = await applyContraction(amount, `Manual contraction: ${reason}`, 'manual');
    return { success: true, result };
}

// ===== EXPORTS =====
export default {
    CENTRAL_BANK_CONFIG,
    initializeCentralBank,
    runMonetaryPolicy,
    getEconomicCondition,
    getCentralBankStatus,
    getPolicyHistory,
    manualStimulus,
    manualContraction
};

// ===== WINDOW EXPORTS =====
window.initializeCentralBank = initializeCentralBank;
window.runMonetaryPolicy = runMonetaryPolicy;
window.getCentralBankStatus = getCentralBankStatus;
window.getEconomicCondition = getEconomicCondition;
window.getPolicyHistory = getPolicyHistory;
window.manualStimulus = manualStimulus;
window.manualContraction = manualContraction;

console.log('🏦 central-bank.js loaded - Automatic monetary policy active');

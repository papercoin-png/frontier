// js/tax-system.js - Progressive taxation system for Voidfarer
// UPDATED: Fixed IndexedDB calls to use proper db.js functions
// UPDATED: Uses getDb() for database access
// UPDATED: Added coordinated tax policy with Central Bank

import { getDb, getAll, setItem, getItem, addTransaction } from './db.js';

// ===== TAX TYPES =====
const TAX_TYPES = {
    TRANSACTION: 'transaction',
    PROPERTY: 'property',
    INCOME: 'income',
    LUXURY: 'luxury',
    ESTATE: 'estate',
    REGISTRATION: 'registration'
};

// ===== TAX RATES =====
let CURRENT_TAX_RATES = {
    [TAX_TYPES.TRANSACTION]: 0.02,
    [TAX_TYPES.PROPERTY]: 0.005,
    [TAX_TYPES.INCOME]: 0.08,
    [TAX_TYPES.LUXURY]: 0.03,
    [TAX_TYPES.ESTATE]: 0.10,
    [TAX_TYPES.REGISTRATION]: 5000
};

// ===== TAX RATE LIMITS =====
const TAX_LIMITS = {
    [TAX_TYPES.TRANSACTION]: { min: 0.01, max: 0.04 },      // 1% to 4%
    [TAX_TYPES.PROPERTY]: { min: 0.001, max: 0.02 },        // 0.1% to 2%
    [TAX_TYPES.INCOME]: { min: 0.03, max: 0.25 },           // 3% to 25%
    [TAX_TYPES.LUXURY]: { min: 0.01, max: 0.15 },           // 1% to 15%
    [TAX_TYPES.ESTATE]: { min: 0.05, max: 0.20 },           // 5% to 20%
    [TAX_TYPES.REGISTRATION]: { min: 1000, max: 10000 }     // 1,000 to 10,000
};

// ===== TAX BRACKETS =====
const TAX_BRACKETS = {
    [TAX_TYPES.INCOME]: [
        { threshold: 0, rate: 0.05 },
        { threshold: 10000, rate: 0.08 },
        { threshold: 50000, rate: 0.12 },
        { threshold: 100000, rate: 0.15 },
        { threshold: 500000, rate: 0.20 }
    ],
    [TAX_TYPES.LUXURY]: [
        { threshold: 1000000, rate: 0.03 },
        { threshold: 5000000, rate: 0.05 },
        { threshold: 10000000, rate: 0.08 },
        { threshold: 50000000, rate: 0.12 }
    ]
};

// ===== STORAGE KEYS =====
const TAX_STORAGE_KEYS = {
    CURRENT_RATES: 'voidfarer_tax_rates',
    TAX_HISTORY: 'voidfarer_tax_history',
    LUXURY_THRESHOLD: 'voidfarer_luxury_threshold',
    TAX_EXEMPTIONS: 'voidfarer_tax_exemptions',
    COMMUNITY_FUND: 'voidfarer_community_fund',
    TAX_POLICY_HISTORY: 'voidfarer_tax_policy_history'
};

// ===== COORDINATED TAX POLICY =====
let lastTaxAdjustment = 0;
let currentPolicyMode = 'NEUTRAL';
const TAX_ADJUSTMENT_COOLDOWN = 3 * 24 * 60 * 60 * 1000; // 3 days

// ===== INITIALIZE TAX SYSTEM =====
async function initializeTaxSystem() {
    const savedRates = localStorage.getItem(TAX_STORAGE_KEYS.CURRENT_RATES);
    if (savedRates) {
        CURRENT_TAX_RATES = JSON.parse(savedRates);
    } else {
        saveCurrentRates();
    }
    
    if (!localStorage.getItem(TAX_STORAGE_KEYS.TAX_EXEMPTIONS)) {
        localStorage.setItem(TAX_STORAGE_KEYS.TAX_EXEMPTIONS, JSON.stringify({}));
    }
    
    if (!localStorage.getItem(TAX_STORAGE_KEYS.TAX_POLICY_HISTORY)) {
        localStorage.setItem(TAX_STORAGE_KEYS.TAX_POLICY_HISTORY, JSON.stringify([]));
    }
    
    console.log('Tax system initialized');
}

// ===== RATE MANAGEMENT =====
function getCurrentRates() {
    return { ...CURRENT_TAX_RATES };
}

function saveCurrentRates() {
    localStorage.setItem(TAX_STORAGE_KEYS.CURRENT_RATES, JSON.stringify(CURRENT_TAX_RATES));
}

function updateTaxRate(taxType, newRate) {
    if (CURRENT_TAX_RATES.hasOwnProperty(taxType)) {
        // Apply limits
        const limits = TAX_LIMITS[taxType];
        if (limits) {
            newRate = Math.max(limits.min, Math.min(limits.max, newRate));
        }
        CURRENT_TAX_RATES[taxType] = newRate;
        saveCurrentRates();
        return true;
    }
    return false;
}

function adjustAllRates(adjustments) {
    Object.keys(adjustments).forEach(taxType => {
        if (CURRENT_TAX_RATES.hasOwnProperty(taxType)) {
            let newRate = CURRENT_TAX_RATES[taxType] + adjustments[taxType];
            const limits = TAX_LIMITS[taxType];
            if (limits) {
                newRate = Math.max(limits.min, Math.min(limits.max, newRate));
            }
            CURRENT_TAX_RATES[taxType] = newRate;
        }
    });
    saveCurrentRates();
}

// ===== COORDINATED TAX POLICY =====
function canAdjustTax() {
    const now = Date.now();
    if (now - lastTaxAdjustment < TAX_ADJUSTMENT_COOLDOWN) {
        return false;
    }
    return true;
}

function logTaxPolicyAction(action) {
    const history = localStorage.getItem(TAX_STORAGE_KEYS.TAX_POLICY_HISTORY);
    const allActions = history ? JSON.parse(history) : [];
    
    allActions.unshift({
        ...action,
        timestamp: Date.now(),
        date: new Date().toISOString()
    });
    
    // Keep only last 50 actions
    while (allActions.length > 50) {
        allActions.pop();
    }
    
    localStorage.setItem(TAX_STORAGE_KEYS.TAX_POLICY_HISTORY, JSON.stringify(allActions));
}

function getTaxPolicyHistory(limit = 10) {
    const history = localStorage.getItem(TAX_STORAGE_KEYS.TAX_POLICY_HISTORY);
    const allActions = history ? JSON.parse(history) : [];
    return allActions.slice(0, limit);
}

function getTaxPolicyStatus() {
    return {
        currentPolicyMode: currentPolicyMode,
        lastAdjustment: lastTaxAdjustment,
        lastAdjustmentDate: lastTaxAdjustment ? new Date(lastTaxAdjustment).toLocaleString() : 'Never',
        canAdjust: canAdjustTax(),
        currentRates: getCurrentRates(),
        transactionTaxRate: CURRENT_TAX_RATES[TAX_TYPES.TRANSACTION] * 100 + '%',
        transactionTaxLimit: {
            min: TAX_LIMITS[TAX_TYPES.TRANSACTION].min * 100 + '%',
            max: TAX_LIMITS[TAX_TYPES.TRANSACTION].max * 100 + '%'
        }
    };
}

/**
 * Run coordinated tax policy with Central Bank
 * @param {Object} centralBankCondition - Condition from Central Bank
 * @returns {Object} Result of tax adjustments
 */
async function runCoordinatedTaxPolicy(centralBankCondition) {
    if (!centralBankCondition) {
        console.log('No central bank condition provided');
        return { success: false, reason: 'No condition data' };
    }
    
    if (!canAdjustTax()) {
        console.log('Tax policy: Cannot adjust - cooldown active');
        return { success: false, reason: 'Cooldown active', canAdjust: false };
    }
    
    const condition = centralBankCondition.condition;
    const severity = centralBankCondition.severity;
    let adjustment = 0;
    let reason = '';
    let newPolicyMode = currentPolicyMode;
    
    // Determine transaction tax adjustment based on Central Bank condition
    if (condition === 'DEFLATION' || condition === 'STAGNATION' || condition === 'EMERGENCY_STIMULUS') {
        // Emergency stimulus: lower transaction tax significantly
        adjustment = -0.005;  // -0.5%
        reason = `Emergency stimulus mode: ${condition}`;
        newPolicyMode = 'STIMULUS_EMERGENCY';
    } 
    else if (condition === 'STIMULUS_NEEDED') {
        // Normal stimulus: lower transaction tax slightly
        adjustment = -0.003;  // -0.3%
        reason = `Stimulus mode: low inflation (${(centralBankCondition.inflation * 100).toFixed(1)}%)`;
        newPolicyMode = 'STIMULUS';
    }
    else if (condition === 'OVERHEATING') {
        // Emergency contraction: raise transaction tax significantly
        adjustment = 0.005;  // +0.5%
        reason = `Emergency cooling: high inflation (${(centralBankCondition.inflation * 100).toFixed(1)}%)`;
        newPolicyMode = 'CONTRACTION_EMERGENCY';
    }
    else if (condition === 'COOLING_NEEDED' || condition === 'SPECULATION') {
        // Normal contraction: raise transaction tax slightly
        adjustment = 0.003;  // +0.3%
        reason = `Cooling mode: ${condition}`;
        newPolicyMode = 'CONTRACTION';
    }
    else {
        // Neutral: no adjustment
        console.log('Tax policy: Neutral - no adjustment needed');
        return { success: true, action: 'NONE', reason: 'Economy stable' };
    }
    
    // Calculate new rate
    const currentRate = CURRENT_TAX_RATES[TAX_TYPES.TRANSACTION];
    let newRate = currentRate + adjustment;
    
    // Apply limits
    const limits = TAX_LIMITS[TAX_TYPES.TRANSACTION];
    newRate = Math.max(limits.min, Math.min(limits.max, newRate));
    
    // Check if actual change occurred
    if (Math.abs(newRate - currentRate) < 0.001) {
        console.log('Tax policy: Rate at limit, no change');
        return { success: true, action: 'NONE', reason: 'Rate at limit' };
    }
    
    // Apply the change
    CURRENT_TAX_RATES[TAX_TYPES.TRANSACTION] = newRate;
    saveCurrentRates();
    lastTaxAdjustment = Date.now();
    currentPolicyMode = newPolicyMode;
    
    // Log the action
    const action = {
        type: 'TRANSACTION_TAX_ADJUSTMENT',
        oldRate: currentRate,
        newRate: newRate,
        adjustment: adjustment,
        reason: reason,
        centralBankCondition: condition,
        severity: severity,
        policyMode: newPolicyMode
    };
    
    logTaxPolicyAction(action);
    
    console.log(`📊 Tax Policy: Transaction tax ${(currentRate * 100).toFixed(1)}% → ${(newRate * 100).toFixed(1)}% (${adjustment > 0 ? '+' : ''}${(adjustment * 100).toFixed(1)}%) - ${reason}`);
    
    return {
        success: true,
        action: 'ADJUSTED',
        taxType: 'transaction',
        oldRate: currentRate,
        newRate: newRate,
        adjustment: adjustment,
        reason: reason,
        policyMode: newPolicyMode
    };
}

// ===== TAX CALCULATION FUNCTIONS =====
function calculateTransactionTax(amount) {
    const rate = CURRENT_TAX_RATES[TAX_TYPES.TRANSACTION];
    return Math.floor(amount * rate);
}

function calculatePropertyTax(propertyValue) {
    const rate = CURRENT_TAX_RATES[TAX_TYPES.PROPERTY];
    return Math.floor(propertyValue * rate);
}

async function calculateMonthlyPropertyTax(properties) {
    let totalTax = 0;
    for (const prop of properties) {
        totalTax += calculatePropertyTax(prop.value || prop.cost || 0);
    }
    return totalTax;
}

function calculateIncomeTax(income) {
    const brackets = TAX_BRACKETS[TAX_TYPES.INCOME];
    let tax = 0;
    let remainingIncome = income;
    
    for (let i = brackets.length - 1; i >= 0; i--) {
        const bracket = brackets[i];
        if (remainingIncome > bracket.threshold) {
            const taxableAmount = remainingIncome - bracket.threshold;
            tax += taxableAmount * bracket.rate;
            remainingIncome = bracket.threshold;
        }
    }
    
    return Math.floor(tax);
}

function calculateLuxuryTax(totalWealth) {
    const brackets = TAX_BRACKETS[TAX_TYPES.LUXURY];
    let tax = 0;
    
    for (const bracket of brackets) {
        if (totalWealth > bracket.threshold) {
            const taxableWealth = totalWealth - bracket.threshold;
            tax += taxableWealth * bracket.rate;
            break;
        }
    }
    
    return Math.floor(tax);
}

function calculateAnnualLuxuryTax(totalWealth) {
    return calculateLuxuryTax(totalWealth);
}

function calculateMonthlyLuxuryTax(totalWealth) {
    return Math.floor(calculateLuxuryTax(totalWealth) / 12);
}

function calculateEstateTax(transferAmount) {
    const rate = CURRENT_TAX_RATES[TAX_TYPES.ESTATE];
    return Math.floor(transferAmount * rate);
}

function getRegistrationFee() {
    return CURRENT_TAX_RATES[TAX_TYPES.REGISTRATION];
}

// ===== TAX EXEMPTIONS =====
function getTaxExemptions(playerId) {
    const exemptions = localStorage.getItem(TAX_STORAGE_KEYS.TAX_EXEMPTIONS);
    const allExemptions = exemptions ? JSON.parse(exemptions) : {};
    return allExemptions[playerId] || {
        transaction: 0,
        property: 0,
        income: 0,
        luxury: false,
        reason: null
    };
}

function addTaxExemption(playerId, taxType, amount, reason) {
    const exemptions = localStorage.getItem(TAX_STORAGE_KEYS.TAX_EXEMPTIONS);
    const allExemptions = exemptions ? JSON.parse(exemptions) : {};
    
    if (!allExemptions[playerId]) {
        allExemptions[playerId] = {
            transaction: 0,
            property: 0,
            income: 0,
            luxury: false
        };
    }
    
    if (taxType === TAX_TYPES.LUXURY) {
        allExemptions[playerId].luxury = true;
    } else {
        allExemptions[playerId][taxType] += amount;
    }
    
    allExemptions[playerId].reason = reason;
    localStorage.setItem(TAX_STORAGE_KEYS.TAX_EXEMPTIONS, JSON.stringify(allExemptions));
}

// ===== TAX HISTORY (IndexedDB) =====
async function getTaxHistory(playerId, limit = 100) {
    try {
        const db = await getDb();
        if (!db) return [];
        
        const transaction = db.transaction('taxTransactions', 'readonly');
        const store = transaction.objectStore('taxTransactions');
        const allTx = await store.getAll();
        
        let filtered = allTx || [];
        
        if (playerId) {
            filtered = filtered.filter(tx => tx.playerId === playerId);
        }
        
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        return filtered.slice(0, limit);
    } catch (error) {
        console.error('Error getting tax history:', error);
        return [];
    }
}

async function addTaxRecord(record) {
    try {
        const id = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const txRecord = {
            id,
            ...record,
            timestamp: record.timestamp || Date.now(),
            date: record.date || new Date().toISOString()
        };
        
        const db = await getDb();
        if (!db) return null;
        
        const transaction = db.transaction('taxTransactions', 'readwrite');
        const store = transaction.objectStore('taxTransactions');
        await store.add(txRecord);
        
        return txRecord;
    } catch (error) {
        console.error('Error adding tax record:', error);
        return null;
    }
}

async function getPlayerTaxSummary(playerId, playerName, days = 30) {
    const history = await getTaxHistory(playerId);
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const recentHistory = history.filter(h => h.timestamp > cutoff);
    
    let totalTax = 0;
    const byType = {};
    
    recentHistory.forEach(record => {
        totalTax += record.amount;
        if (!byType[record.taxType]) {
            byType[record.taxType] = 0;
        }
        byType[record.taxType] += record.amount;
    });
    
    return {
        playerId,
        playerName,
        period: days + ' days',
        totalTax,
        byType,
        transactionCount: recentHistory.length,
        averageTax: recentHistory.length > 0 ? totalTax / recentHistory.length : 0
    };
}

// ===== TAX PAYMENT FUNCTION =====
async function payTax(playerId, playerName, taxType, baseAmount, description = '') {
    let taxAmount = 0;
    let rate = 0;
    
    switch(taxType) {
        case TAX_TYPES.TRANSACTION:
            rate = CURRENT_TAX_RATES[TAX_TYPES.TRANSACTION];
            taxAmount = calculateTransactionTax(baseAmount);
            break;
        case TAX_TYPES.PROPERTY:
            rate = CURRENT_TAX_RATES[TAX_TYPES.PROPERTY];
            taxAmount = calculatePropertyTax(baseAmount);
            break;
        case TAX_TYPES.INCOME:
            taxAmount = calculateIncomeTax(baseAmount);
            rate = taxAmount / baseAmount;
            break;
        case TAX_TYPES.LUXURY:
            taxAmount = calculateMonthlyLuxuryTax(baseAmount);
            rate = taxAmount / baseAmount;
            break;
        case TAX_TYPES.ESTATE:
            rate = CURRENT_TAX_RATES[TAX_TYPES.ESTATE];
            taxAmount = calculateEstateTax(baseAmount);
            break;
        case TAX_TYPES.REGISTRATION:
            taxAmount = getRegistrationFee();
            rate = 1;
            break;
        default:
            return null;
    }
    
    const exemptions = getTaxExemptions(playerId);
    if (taxType === TAX_TYPES.LUXURY && exemptions.luxury) {
        return { paid: 0, exempt: true, reason: exemptions.reason };
    }
    if (exemptions[taxType] > 0) {
        const exemptionAmount = Math.min(taxAmount, exemptions[taxType]);
        taxAmount -= exemptionAmount;
        exemptions[taxType] -= exemptionAmount;
        localStorage.setItem(TAX_STORAGE_KEYS.TAX_EXEMPTIONS, JSON.stringify(exemptions));
    }
    
    if (taxAmount <= 0) return { paid: 0, exempt: true };
    
    const record = await addTaxRecord({
        playerId,
        playerName,
        taxType,
        amount: taxAmount,
        rate,
        baseAmount,
        description,
        timestamp: Date.now()
    });
    
    return {
        paid: taxAmount,
        rate,
        recordId: record?.id,
        exempt: false
    };
}

// ===== COMMUNITY FUND =====
async function getCommunityFund() {
    try {
        const db = await getDb();
        if (!db) return null;
        
        const transaction = db.transaction('communityFund', 'readonly');
        const store = transaction.objectStore('communityFund');
        const fund = await store.get('main');
        
        return fund || {
            id: 'main',
            balance: 0,
            totalContributions: 0,
            totalAllocations: 0,
            lastUpdated: Date.now(),
            categories: {}
        };
    } catch (error) {
        console.error('Error getting community fund:', error);
        return null;
    }
}

async function addToCommunityFund(amount, taxRecordId) {
    const fund = await getCommunityFund();
    if (!fund) return false;
    
    fund.balance += amount;
    fund.totalContributions = (fund.totalContributions || 0) + amount;
    fund.contributions = fund.contributions || [];
    fund.contributions.push({
        amount,
        taxRecordId,
        timestamp: Date.now()
    });
    fund.lastUpdated = Date.now();
    
    try {
        const db = await getDb();
        if (!db) return false;
        
        const transaction = db.transaction('communityFund', 'readwrite');
        const store = transaction.objectStore('communityFund');
        await store.put(fund);
        return true;
    } catch (error) {
        console.error('Error adding to community fund:', error);
        return false;
    }
}

async function allocateFromCommunityFund(amount, purpose, description) {
    const fund = await getCommunityFund();
    if (!fund || fund.balance < amount) return false;
    
    fund.balance -= amount;
    fund.totalAllocations = (fund.totalAllocations || 0) + amount;
    fund.allocations = fund.allocations || [];
    fund.allocations.push({
        amount,
        purpose,
        description,
        timestamp: Date.now()
    });
    fund.lastUpdated = Date.now();
    
    try {
        const db = await getDb();
        if (!db) return false;
        
        const transaction = db.transaction('communityFund', 'readwrite');
        const store = transaction.objectStore('communityFund');
        await store.put(fund);
        return true;
    } catch (error) {
        console.error('Error allocating from community fund:', error);
        return false;
    }
}

async function getCommunityFundSummary() {
    const fund = await getCommunityFund();
    if (!fund) return null;
    
    const now = Date.now();
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    const recentContributions = (fund.contributions || []).filter(c => c.timestamp > monthAgo);
    const recentAllocations = (fund.allocations || []).filter(a => a.timestamp > monthAgo);
    
    return {
        balance: fund.balance,
        totalContributions: fund.totalContributions || 0,
        totalAllocations: fund.totalAllocations || 0,
        monthlyContributions: recentContributions.reduce((sum, c) => sum + c.amount, 0),
        monthlyAllocations: recentAllocations.reduce((sum, a) => sum + a.amount, 0),
        contributionCount: (fund.contributions || []).length,
        allocationCount: (fund.allocations || []).length
    };
}

// ===== TAX RATE FORMATTING =====
function formatTaxRate(rate, type) {
    if (type === TAX_TYPES.REGISTRATION) {
        return rate + '⭐';
    }
    return (rate * 100).toFixed(1) + '%';
}

function getTaxDescription(taxType) {
    const descriptions = {
        [TAX_TYPES.TRANSACTION]: 'Transaction tax on sales',
        [TAX_TYPES.PROPERTY]: 'Monthly property tax',
        [TAX_TYPES.INCOME]: 'Progressive income tax',
        [TAX_TYPES.LUXURY]: 'Wealth tax on high net worth',
        [TAX_TYPES.ESTATE]: 'Estate tax on transfers',
        [TAX_TYPES.REGISTRATION]: 'One-time professional registration'
    };
    return descriptions[taxType] || 'Tax payment';
}

// ===== EXPORT =====
export {
    TAX_TYPES,
    TAX_BRACKETS,
    initializeTaxSystem,
    getCurrentRates,
    saveCurrentRates,
    updateTaxRate,
    adjustAllRates,
    runCoordinatedTaxPolicy,
    getTaxPolicyStatus,
    getTaxPolicyHistory,
    calculateTransactionTax,
    calculatePropertyTax,
    calculateMonthlyPropertyTax,
    calculateIncomeTax,
    calculateLuxuryTax,
    calculateAnnualLuxuryTax,
    calculateMonthlyLuxuryTax,
    calculateEstateTax,
    getRegistrationFee,
    getTaxExemptions,
    addTaxExemption,
    getTaxHistory,
    getPlayerTaxSummary,
    payTax,
    getCommunityFund,
    addToCommunityFund,
    allocateFromCommunityFund,
    getCommunityFundSummary,
    formatTaxRate,
    getTaxDescription
};

// ===== WINDOW EXPORTS =====
window.TAX_TYPES = TAX_TYPES;
window.TAX_BRACKETS = TAX_BRACKETS;
window.initializeTaxSystem = initializeTaxSystem;
window.getCurrentRates = getCurrentRates;
window.updateTaxRate = updateTaxRate;
window.adjustAllRates = adjustAllRates;
window.runCoordinatedTaxPolicy = runCoordinatedTaxPolicy;
window.getTaxPolicyStatus = getTaxPolicyStatus;
window.getTaxPolicyHistory = getTaxPolicyHistory;
window.calculateTransactionTax = calculateTransactionTax;
window.calculatePropertyTax = calculatePropertyTax;
window.calculateIncomeTax = calculateIncomeTax;
window.getRegistrationFee = getRegistrationFee;
window.getTaxExemptions = getTaxExemptions;
window.addTaxExemption = addTaxExemption;
window.getTaxHistory = getTaxHistory;
window.payTax = payTax;
window.getCommunityFund = getCommunityFund;
window.getCommunityFundSummary = getCommunityFundSummary;
window.formatTaxRate = formatTaxRate;

console.log('📊 tax-system.js loaded - Coordinated tax policy ready');

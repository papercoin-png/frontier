// js/tax-system.js - Progressive taxation system for Voidfarer
// UPDATED: Fixed IndexedDB calls to use proper db.js functions
// UPDATED: Uses getDb() for database access

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
    COMMUNITY_FUND: 'voidfarer_community_fund'
};

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
        CURRENT_TAX_RATES[taxType] = newRate;
        saveCurrentRates();
        return true;
    }
    return false;
}

function adjustAllRates(adjustments) {
    Object.keys(adjustments).forEach(taxType => {
        if (CURRENT_TAX_RATES.hasOwnProperty(taxType)) {
            CURRENT_TAX_RATES[taxType] += adjustments[taxType];
            if (taxType === TAX_TYPES.TRANSACTION) {
                CURRENT_TAX_RATES[taxType] = Math.max(0.005, Math.min(0.08, CURRENT_TAX_RATES[taxType]));
            }
            if (taxType === TAX_TYPES.PROPERTY) {
                CURRENT_TAX_RATES[taxType] = Math.max(0.001, Math.min(0.02, CURRENT_TAX_RATES[taxType]));
            }
            if (taxType === TAX_TYPES.INCOME) {
                CURRENT_TAX_RATES[taxType] = Math.max(0.03, Math.min(0.25, CURRENT_TAX_RATES[taxType]));
            }
            if (taxType === TAX_TYPES.LUXURY) {
                CURRENT_TAX_RATES[taxType] = Math.max(0.01, Math.min(0.15, CURRENT_TAX_RATES[taxType]));
            }
        }
    });
    saveCurrentRates();
}

// ===== TRANSACTION TAX =====
function calculateTransactionTax(amount) {
    const rate = CURRENT_TAX_RATES[TAX_TYPES.TRANSACTION];
    return Math.floor(amount * rate);
}

// ===== PROPERTY TAX =====
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

// ===== INCOME TAX =====
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

// ===== LUXURY TAX =====
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

// ===== ESTATE TAX =====
function calculateEstateTax(transferAmount) {
    const rate = CURRENT_TAX_RATES[TAX_TYPES.ESTATE];
    return Math.floor(transferAmount * rate);
}

// ===== REGISTRATION FEE =====
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

// ===== EXPOSE TO WINDOW =====
window.TAX_TYPES = TAX_TYPES;
window.TAX_BRACKETS = TAX_BRACKETS;
window.CURRENT_TAX_RATES = CURRENT_TAX_RATES;
window.initializeTaxSystem = initializeTaxSystem;
window.getCurrentRates = getCurrentRates;
window.saveCurrentRates = saveCurrentRates;
window.updateTaxRate = updateTaxRate;
window.adjustAllRates = adjustAllRates;
window.calculateTransactionTax = calculateTransactionTax;
window.calculatePropertyTax = calculatePropertyTax;
window.calculateMonthlyPropertyTax = calculateMonthlyPropertyTax;
window.calculateIncomeTax = calculateIncomeTax;
window.calculateLuxuryTax = calculateLuxuryTax;
window.calculateAnnualLuxuryTax = calculateAnnualLuxuryTax;
window.calculateMonthlyLuxuryTax = calculateMonthlyLuxuryTax;
window.calculateEstateTax = calculateEstateTax;
window.getRegistrationFee = getRegistrationFee;
window.getTaxExemptions = getTaxExemptions;
window.addTaxExemption = addTaxExemption;
window.getTaxHistory = getTaxHistory;
window.getPlayerTaxSummary = getPlayerTaxSummary;
window.payTax = payTax;
window.getCommunityFund = getCommunityFund;
window.addToCommunityFund = addToCommunityFund;
window.allocateFromCommunityFund = allocateFromCommunityFund;
window.getCommunityFundSummary = getCommunityFundSummary;
window.formatTaxRate = formatTaxRate;
window.getTaxDescription = getTaxDescription;

// ===== EXPORT =====
export {
    TAX_TYPES,
    TAX_BRACKETS,
    initializeTaxSystem,
    getCurrentRates,
    saveCurrentRates,
    updateTaxRate,
    adjustAllRates,
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

export default {
    TAX_TYPES,
    TAX_BRACKETS,
    initializeTaxSystem,
    getCurrentRates,
    saveCurrentRates,
    updateTaxRate,
    adjustAllRates,
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

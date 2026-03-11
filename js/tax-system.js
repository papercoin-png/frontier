// tax-system.js - Progressive taxation system for Voidfarer
// Handles all tax calculations, brackets, and rates

// ===== TAX TYPES =====
const TAX_TYPES = {
    TRANSACTION: 'transaction',
    PROPERTY: 'property',
    INCOME: 'income',
    LUXURY: 'luxury',
    ESTATE: 'estate',
    REGISTRATION: 'registration'
};

// ===== TAX RATES (Dynamic - adjusted by economic-adjuster.js) =====
// These are base rates - actual rates may be modified by economic conditions
let CURRENT_TAX_RATES = {
    [TAX_TYPES.TRANSACTION]: 0.02,      // 2% default
    [TAX_TYPES.PROPERTY]: 0.005,        // 0.5% monthly
    [TAX_TYPES.INCOME]: 0.08,           // 8% on pool income
    [TAX_TYPES.LUXURY]: 0.03,           // 3% on wealth > 1M
    [TAX_TYPES.ESTATE]: 0.10,           // 10% on inheritance
    [TAX_TYPES.REGISTRATION]: 5000      // 5000⭐ flat fee
};

// ===== TAX BRACKETS (Progressive) =====
const TAX_BRACKETS = {
    [TAX_TYPES.INCOME]: [
        { threshold: 0, rate: 0.05 },        // 0-10k: 5%
        { threshold: 10000, rate: 0.08 },    // 10k-50k: 8%
        { threshold: 50000, rate: 0.12 },    // 50k-100k: 12%
        { threshold: 100000, rate: 0.15 },   // 100k-500k: 15%
        { threshold: 500000, rate: 0.20 }    // 500k+: 20%
    ],
    [TAX_TYPES.LUXURY]: [
        { threshold: 1000000, rate: 0.03 },  // 1M-5M: 3%
        { threshold: 5000000, rate: 0.05 },  // 5M-10M: 5%
        { threshold: 10000000, rate: 0.08 }, // 10M-50M: 8%
        { threshold: 50000000, rate: 0.12 }  // 50M+: 12%
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
function initializeTaxSystem() {
    // Load saved rates or use defaults
    const savedRates = localStorage.getItem(TAX_STORAGE_KEYS.CURRENT_RATES);
    if (savedRates) {
        CURRENT_TAX_RATES = JSON.parse(savedRates);
    } else {
        saveCurrentRates();
    }
    
    // Initialize tax history if needed
    if (!localStorage.getItem(TAX_STORAGE_KEYS.TAX_HISTORY)) {
        localStorage.setItem(TAX_STORAGE_KEYS.TAX_HISTORY, JSON.stringify([]));
    }
    
    // Initialize community fund if needed
    if (!localStorage.getItem(TAX_STORAGE_KEYS.COMMUNITY_FUND)) {
        localStorage.setItem(TAX_STORAGE_KEYS.COMMUNITY_FUND, JSON.stringify({
            balance: 0,
            contributions: [],
            allocations: []
        }));
    }
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
            // Ensure rates stay within reasonable bounds
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

function calculateMonthlyPropertyTax(properties) {
    let totalTax = 0;
    properties.forEach(prop => {
        totalTax += calculatePropertyTax(prop.value || prop.cost || 0);
    });
    return totalTax;
}

// ===== INCOME TAX (Progressive) =====
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

// ===== LUXURY TAX (Wealth Tax) =====
function calculateLuxuryTax(totalWealth) {
    const brackets = TAX_BRACKETS[TAX_TYPES.LUXURY];
    let tax = 0;
    
    for (const bracket of brackets) {
        if (totalWealth > bracket.threshold) {
            // Luxury tax applies to entire wealth above threshold
            const taxableWealth = totalWealth - bracket.threshold;
            tax += taxableWealth * bracket.rate;
            break; // Apply only the highest bracket reached
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

// ===== ESTATE TAX (Inheritance) =====
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

// ===== TAX HISTORY =====
function getTaxHistory(playerId, limit = 100) {
    const history = localStorage.getItem(TAX_STORAGE_KEYS.TAX_HISTORY);
    const allHistory = history ? JSON.parse(history) : [];
    
    if (playerId) {
        return allHistory.filter(entry => entry.playerId === playerId).slice(-limit);
    }
    return allHistory.slice(-limit);
}

function addTaxRecord(record) {
    const history = localStorage.getItem(TAX_STORAGE_KEYS.TAX_HISTORY);
    const allHistory = history ? JSON.parse(history) : [];
    
    const taxRecord = {
        id: 'tax_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        playerId: record.playerId,
        playerName: record.playerName,
        taxType: record.taxType,
        amount: record.amount,
        rate: record.rate,
        baseAmount: record.baseAmount,
        description: record.description,
        timestamp: Date.now(),
        date: new Date().toISOString()
    };
    
    allHistory.push(taxRecord);
    
    // Keep only last 10000 records
    if (allHistory.length > 10000) {
        allHistory.shift();
    }
    
    localStorage.setItem(TAX_STORAGE_KEYS.TAX_HISTORY, JSON.stringify(allHistory));
    return taxRecord;
}

function getPlayerTaxSummary(playerId, playerName, days = 30) {
    const history = getTaxHistory(playerId);
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
function payTax(playerId, playerName, taxType, baseAmount, description = '') {
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
            rate = taxAmount / baseAmount; // effective rate
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
            rate = 1; // flat fee
            break;
        default:
            return null;
    }
    
    // Check for exemptions
    const exemptions = getTaxExemptions(playerId);
    if (taxType === TAX_TYPES.LUXURY && exemptions.luxury) {
        return { paid: 0, exempt: true, reason: exemptions.reason };
    }
    if (exemptions[taxType] > 0) {
        const exemptionAmount = Math.min(taxAmount, exemptions[taxType]);
        taxAmount -= exemptionAmount;
        // Update remaining exemption
        exemptions[taxType] -= exemptionAmount;
        localStorage.setItem(TAX_STORAGE_KEYS.TAX_EXEMPTIONS, JSON.stringify(exemptions));
    }
    
    if (taxAmount <= 0) return { paid: 0, exempt: true };
    
    // Record the tax
    const record = addTaxRecord({
        playerId,
        playerName,
        taxType,
        amount: taxAmount,
        rate,
        baseAmount,
        description
    });
    
    // Add to community fund
    addToCommunityFund(taxAmount, record.id);
    
    return {
        paid: taxAmount,
        rate,
        recordId: record.id,
        exempt: false
    };
}

// ===== COMMUNITY FUND =====
function getCommunityFund() {
    const data = localStorage.getItem(TAX_STORAGE_KEYS.COMMUNITY_FUND);
    return data ? JSON.parse(data) : { balance: 0, contributions: [], allocations: [] };
}

function saveCommunityFund(fund) {
    localStorage.setItem(TAX_STORAGE_KEYS.COMMUNITY_FUND, JSON.stringify(fund));
}

function addToCommunityFund(amount, taxRecordId) {
    const fund = getCommunityFund();
    fund.balance += amount;
    fund.contributions.push({
        amount,
        taxRecordId,
        timestamp: Date.now()
    });
    saveCommunityFund(fund);
}

function allocateFromCommunityFund(amount, purpose, description) {
    const fund = getCommunityFund();
    if (fund.balance < amount) return false;
    
    fund.balance -= amount;
    fund.allocations.push({
        amount,
        purpose,
        description,
        timestamp: Date.now()
    });
    saveCommunityFund(fund);
    return true;
}

function getCommunityFundSummary() {
    const fund = getCommunityFund();
    const now = Date.now();
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    const recentContributions = fund.contributions.filter(c => c.timestamp > monthAgo);
    const recentAllocations = fund.allocations.filter(a => a.timestamp > monthAgo);
    
    return {
        balance: fund.balance,
        totalContributions: fund.contributions.reduce((sum, c) => sum + c.amount, 0),
        totalAllocations: fund.allocations.reduce((sum, a) => sum + a.amount, 0),
        monthlyContributions: recentContributions.reduce((sum, c) => sum + c.amount, 0),
        monthlyAllocations: recentAllocations.reduce((sum, a) => sum + a.amount, 0),
        contributionCount: fund.contributions.length,
        allocationCount: fund.allocations.length
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
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TAX_TYPES,
        TAX_BRACKETS,
        initializeTaxSystem,
        getCurrentRates,
        updateTaxRate,
        adjustAllRates,
        calculateTransactionTax,
        calculatePropertyTax,
        calculateMonthlyPropertyTax,
        calculateIncomeTax,
        calculateLuxuryTax,
        calculateMonthlyLuxuryTax,
        calculateAnnualLuxuryTax,
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
}

// Initialize on load
initializeTaxSystem();

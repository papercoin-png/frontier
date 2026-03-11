// economic-adjuster.js - Automatic economic tuning system for Voidfarer
// Runs daily to adjust tax rates based on economic metrics

// ===== DEPENDENCIES =====
// Requires economic-metrics.js and tax-system.js to be loaded first

// ===== ADJUSTMENT CONFIGURATION =====
const ADJUSTMENT_CONFIG = {
    MAX_DAILY_CHANGE: 0.002,           // Maximum 0.2% change per day
    SAFETY_THRESHOLD: 0.10,             // 10% - emergency measures trigger
    IDEAL_INFLATION: 0.035,             // 3.5% target
    IDEAL_GINI: 0.35,                    // 0.35 target
    MIN_TAX_RATE: 0.005,                 // 0.5% minimum
    MAX_TAX_RATE: 0.15,                   // 15% maximum
    ADJUSTMENT_COOLDOWN: 1,               // Days between adjustments
    EMERGENCY_COOLDOWN: 0.5                // 12 hours for emergency
};

// ===== STORAGE KEYS =====
const ADJUSTER_STORAGE_KEYS = {
    LAST_ADJUSTMENT: 'voidfarer_last_adjustment',
    ADJUSTMENT_HISTORY: 'voidfarer_adjustment_history',
    EMERGENCY_MODE: 'voidfarer_emergency_mode',
    MANUAL_OVERRIDE: 'voidfarer_manual_override',
    ADJUSTMENT_LOG: 'voidfarer_adjustment_log'
};

// ===== INITIALIZE ADJUSTER =====
function initializeAdjuster() {
    // Set last adjustment if not set
    if (!localStorage.getItem(ADJUSTER_STORAGE_KEYS.LAST_ADJUSTMENT)) {
        localStorage.setItem(ADJUSTER_STORAGE_KEYS.LAST_ADJUSTMENT, Date.now().toString());
    }
    
    // Initialize adjustment history
    if (!localStorage.getItem(ADJUSTER_STORAGE_KEYS.ADJUSTMENT_HISTORY)) {
        localStorage.setItem(ADJUSTER_STORAGE_KEYS.ADJUSTMENT_HISTORY, JSON.stringify([]));
    }
    
    // Initialize adjustment log
    if (!localStorage.getItem(ADJUSTER_STORAGE_KEYS.ADJUSTMENT_LOG)) {
        localStorage.setItem(ADJUSTER_STORAGE_KEYS.ADJUSTMENT_LOG, JSON.stringify([]));
    }
    
    // Initialize emergency mode
    if (!localStorage.getItem(ADJUSTER_STORAGE_KEYS.EMERGENCY_MODE)) {
        localStorage.setItem(ADJUSTER_STORAGE_KEYS.EMERGENCY_MODE, 'false');
    }
}

// ===== ADJUSTMENT LOG =====
function getAdjustmentLog(limit = 100) {
    const log = localStorage.getItem(ADJUSTER_STORAGE_KEYS.ADJUSTMENT_LOG);
    const allLogs = log ? JSON.parse(log) : [];
    return allLogs.slice(-limit);
}

function addToAdjustmentLog(entry) {
    const log = localStorage.getItem(ADJUSTER_STORAGE_KEYS.ADJUSTMENT_LOG);
    const allLogs = log ? JSON.parse(log) : [];
    
    allLogs.push({
        ...entry,
        timestamp: Date.now(),
        date: new Date().toISOString()
    });
    
    // Keep only last 1000 entries
    if (allLogs.length > 1000) {
        allLogs.shift();
    }
    
    localStorage.setItem(ADJUSTER_STORAGE_KEYS.ADJUSTMENT_LOG, JSON.stringify(allLogs));
}

// ===== ADJUSTMENT HISTORY =====
function getAdjustmentHistory(limit = 30) {
    const history = localStorage.getItem(ADJUSTER_STORAGE_KEYS.ADJUSTMENT_HISTORY);
    const allHistory = history ? JSON.parse(history) : [];
    return allHistory.slice(-limit);
}

function addToAdjustmentHistory(entry) {
    const history = localStorage.getItem(ADJUSTER_STORAGE_KEYS.ADJUSTMENT_HISTORY);
    const allHistory = history ? JSON.parse(history) : [];
    
    allHistory.push({
        ...entry,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0]
    });
    
    // Keep only last 365 days
    if (allHistory.length > 365) {
        allHistory.shift();
    }
    
    localStorage.setItem(ADJUSTER_STORAGE_KEYS.ADJUSTMENT_HISTORY, JSON.stringify(allHistory));
}

// ===== EMERGENCY MODE =====
function isEmergencyMode() {
    return localStorage.getItem(ADJUSTER_STORAGE_KEYS.EMERGENCY_MODE) === 'true';
}

function setEmergencyMode(enabled, reason) {
    localStorage.setItem(ADJUSTER_STORAGE_KEYS.EMERGENCY_MODE, enabled.toString());
    
    addToAdjustmentLog({
        type: 'EMERGENCY_MODE',
        enabled,
        reason,
        timestamp: Date.now()
    });
}

// ===== MANUAL OVERRIDE =====
function isManualOverride() {
    return localStorage.getItem(ADJUSTER_STORAGE_KEYS.MANUAL_OVERRIDE) === 'true';
}

function setManualOverride(enabled, reason) {
    localStorage.setItem(ADJUSTER_STORAGE_KEYS.MANUAL_OVERRIDE, enabled.toString());
    
    addToAdjustmentLog({
        type: 'MANUAL_OVERRIDE',
        enabled,
        reason,
        timestamp: Date.now()
    });
}

// ===== SHOULD ADJUST? =====
function shouldAdjust() {
    if (isManualOverride()) {
        return false;
    }
    
    const lastAdjustment = parseInt(localStorage.getItem(ADJUSTER_STORAGE_KEYS.LAST_ADJUSTMENT)) || 0;
    const now = Date.now();
    const hoursSinceLast = (now - lastAdjustment) / (1000 * 60 * 60);
    
    const cooldown = isEmergencyMode() ? ADJUSTMENT_CONFIG.EMERGENCY_COOLDOWN : ADJUSTMENT_CONFIG.ADJUSTMENT_COOLDOWN;
    const cooldownHours = cooldown * 24;
    
    return hoursSinceLast >= cooldownHours;
}

// ===== CALCULATE ADJUSTMENTS =====
function calculateInflationAdjustment(currentInflation) {
    const target = ADJUSTMENT_CONFIG.IDEAL_INFLATION;
    const diff = currentInflation - target;
    
    // Stronger response to larger deviations
    let adjustment = 0;
    
    if (Math.abs(diff) > ADJUSTMENT_CONFIG.SAFETY_THRESHOLD) {
        // Emergency response
        adjustment = diff * 0.3;
        setEmergencyMode(true, `Inflation at ${(currentInflation*100).toFixed(1)}%`);
    } else {
        // Normal response
        adjustment = diff * 0.1;
    }
    
    // Cap daily change
    adjustment = Math.max(-ADJUSTMENT_CONFIG.MAX_DAILY_CHANGE, 
                Math.min(ADJUSTMENT_CONFIG.MAX_DAILY_CHANGE, adjustment));
    
    return {
        transaction: adjustment,
        property: adjustment * 0.5,  // Property tax responds less
        income: adjustment * 1.2       // Income tax responds more
    };
}

function calculateInequalityAdjustment(currentGini) {
    const target = ADJUSTMENT_CONFIG.IDEAL_GINI;
    const diff = currentGini - target;
    
    let adjustment = 0;
    
    if (Math.abs(diff) > 0.1) {
        // Significant inequality
        adjustment = diff * 0.4;
        if (diff > 0) {
            // Too unequal - raise luxury tax
            return { luxury: Math.min(0.01, adjustment) };
        } else {
            // Very equal - can lower luxury tax
            return { luxury: Math.max(-0.005, adjustment) };
        }
    }
    
    return { luxury: 0 };
}

function calculatePoolAdjustment(poolEfficiency) {
    // poolEfficiency < 0.8 = too many professionals (lower fees to discourage)
    // poolEfficiency > 1.2 = not enough professionals (raise fees to encourage)
    const target = 1.0;
    const diff = poolEfficiency - target;
    
    let adjustment = 0;
    
    if (poolEfficiency < 0.8) {
        // Too many professionals - raise fees to discourage
        adjustment = 0.002; // +0.2%
    } else if (poolEfficiency > 1.2) {
        // Not enough professionals - lower fees to encourage
        adjustment = -0.002; // -0.2%
    }
    
    return { poolFee: adjustment };
}

function calculateGrowthAdjustment(newPlayerRate) {
    const target = 0.10; // 10% monthly growth target
    const diff = newPlayerRate - target;
    
    if (newPlayerRate < 0.05) {
        // Very low growth - increase grants
        return { newPlayerGrant: 500 }; // +500⭐
    } else if (newPlayerRate > 0.15) {
        // Very high growth - decrease grants
        return { newPlayerGrant: -200 }; // -200⭐
    }
    
    return { newPlayerGrant: 0 };
}

// ===== PERFORM ADJUSTMENT =====
function performEconomicAdjustment() {
    if (!shouldAdjust()) {
        return { success: false, reason: 'Cooldown period not elapsed' };
    }
    
    // Get current metrics
    const inflation = calculateInflationRate();
    const gini = calculateGiniCoefficient();
    const wealth = getWealthPercentiles();
    const velocity = calculateMoneyVelocity();
    const health = assessEconomicHealth();
    
    // Get current tax rates
    const currentRates = getCurrentRates();
    const adjustments = {};
    
    // Calculate adjustments
    const inflationAdj = calculateInflationAdjustment(inflation);
    const inequalityAdj = calculateInequalityAdjustment(gini);
    const growthAdj = calculateGrowthAdjustment(0.08); // Placeholder - would get real rate
    
    // Combine adjustments
    if (inflationAdj.transaction) {
        adjustments[TAX_TYPES.TRANSACTION] = inflationAdj.transaction;
    }
    if (inflationAdj.property) {
        adjustments[TAX_TYPES.PROPERTY] = inflationAdj.property;
    }
    if (inflationAdj.income) {
        adjustments[TAX_TYPES.INCOME] = inflationAdj.income;
    }
    if (inequalityAdj.luxury) {
        adjustments[TAX_TYPES.LUXURY] = inequalityAdj.luxury;
    }
    
    // Apply adjustments
    adjustAllRates(adjustments);
    
    // Record the adjustment
    const adjustmentRecord = {
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        metrics: {
            inflation,
            gini,
            wealthTop1: wealth.top1Percent,
            wealthTop10: wealth.top10Percent,
            velocity
        },
        adjustments: { ...adjustments },
        newRates: getCurrentRates(),
        health: health.overall
    };
    
    addToAdjustmentHistory(adjustmentRecord);
    
    // Log the adjustment
    addToAdjustmentLog({
        type: 'DAILY_ADJUSTMENT',
        ...adjustmentRecord
    });
    
    // Update last adjustment time
    localStorage.setItem(ADJUSTER_STORAGE_KEYS.LAST_ADJUSTMENT, Date.now().toString());
    
    // Check if we can exit emergency mode
    if (isEmergencyMode() && Math.abs(inflation - ADJUSTMENT_CONFIG.IDEAL_INFLATION) < 0.02) {
        setEmergencyMode(false, 'Inflation returned to normal range');
    }
    
    return {
        success: true,
        adjustments,
        newRates: getCurrentRates(),
        metrics: adjustmentRecord.metrics,
        health: health.overall
    };
}

// ===== EMERGENCY ADJUSTMENT =====
function performEmergencyAdjustment(reason) {
    setEmergencyMode(true, reason);
    
    // More aggressive adjustments
    const currentRates = getCurrentRates();
    const emergencyAdjustments = {};
    
    // Raise all taxes by 0.5%
    emergencyAdjustments[TAX_TYPES.TRANSACTION] = 0.005;
    emergencyAdjustments[TAX_TYPES.PROPERTY] = 0.005;
    emergencyAdjustments[TAX_TYPES.INCOME] = 0.005;
    emergencyAdjustments[TAX_TYPES.LUXURY] = 0.005;
    
    adjustAllRates(emergencyAdjustments);
    
    const record = {
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        reason,
        adjustments: emergencyAdjustments,
        newRates: getCurrentRates()
    };
    
    addToAdjustmentHistory({
        ...record,
        type: 'EMERGENCY_ADJUSTMENT'
    });
    
    addToAdjustmentLog({
        type: 'EMERGENCY_ADJUSTMENT',
        ...record
    });
    
    return record;
}

// ===== GET ADJUSTMENT SUMMARY =====
function getAdjustmentSummary(days = 30) {
    const history = getAdjustmentHistory(days);
    const log = getAdjustmentLog(100);
    
    const adjustments = history.filter(h => h.adjustments && Object.keys(h.adjustments).length > 0);
    
    let totalTransactionChange = 0;
    let totalPropertyChange = 0;
    let totalIncomeChange = 0;
    let totalLuxuryChange = 0;
    
    adjustments.forEach(adj => {
        if (adj.adjustments[TAX_TYPES.TRANSACTION]) {
            totalTransactionChange += adj.adjustments[TAX_TYPES.TRANSACTION];
        }
        if (adj.adjustments[TAX_TYPES.PROPERTY]) {
            totalPropertyChange += adj.adjustments[TAX_TYPES.PROPERTY];
        }
        if (adj.adjustments[TAX_TYPES.INCOME]) {
            totalIncomeChange += adj.adjustments[TAX_TYPES.INCOME];
        }
        if (adj.adjustments[TAX_TYPES.LUXURY]) {
            totalLuxuryChange += adj.adjustments[TAX_TYPES.LUXURY];
        }
    });
    
    const currentRates = getCurrentRates();
    const initialRates = history.length > 0 ? history[0].newRates : currentRates;
    
    return {
        period: days + ' days',
        adjustmentCount: adjustments.length,
        emergencyCount: history.filter(h => h.type === 'EMERGENCY_ADJUSTMENT').length,
        totalChange: {
            transaction: (totalTransactionChange * 100).toFixed(2) + '%',
            property: (totalPropertyChange * 100).toFixed(2) + '%',
            income: (totalIncomeChange * 100).toFixed(2) + '%',
            luxury: (totalLuxuryChange * 100).toFixed(2) + '%'
        },
        currentRates,
        initialRates,
        emergencyMode: isEmergencyMode(),
        lastAdjustment: new Date(parseInt(localStorage.getItem(ADJUSTER_STORAGE_KEYS.LAST_ADJUSTMENT))).toLocaleString()
    };
}

// ===== FORECAST NEXT ADJUSTMENT =====
function forecastNextAdjustment() {
    const metrics = {
        inflation: calculateInflationRate(),
        gini: calculateGiniCoefficient(),
        velocity: calculateMoneyVelocity()
    };
    
    const inflationAdj = calculateInflationAdjustment(metrics.inflation);
    const inequalityAdj = calculateInequalityAdjustment(metrics.gini);
    
    return {
        basedOn: metrics,
        predicted: {
            transaction: inflationAdj.transaction || 0,
            property: inflationAdj.property || 0,
            income: inflationAdj.income || 0,
            luxury: inequalityAdj.luxury || 0
        },
        willAdjust: shouldAdjust(),
        nextAdjustmentIn: getTimeUntilNextAdjustment()
    };
}

function getTimeUntilNextAdjustment() {
    const lastAdjustment = parseInt(localStorage.getItem(ADJUSTER_STORAGE_KEYS.LAST_ADJUSTMENT)) || 0;
    const now = Date.now();
    const hoursSince = (now - lastAdjustment) / (1000 * 60 * 60);
    const cooldown = isEmergencyMode() ? ADJUSTMENT_CONFIG.EMERGENCY_COOLDOWN : ADJUSTMENT_CONFIG.ADJUSTMENT_COOLDOWN;
    const cooldownHours = cooldown * 24;
    
    const hoursRemaining = Math.max(0, cooldownHours - hoursSince);
    const minutesRemaining = Math.floor(hoursRemaining * 60);
    
    return {
        hours: Math.floor(hoursRemaining),
        minutes: minutesRemaining % 60,
        totalMinutes: Math.floor(hoursRemaining * 60)
    };
}

// ===== SIMULATE ADJUSTMENT (for preview) =====
function simulateAdjustment(inflation, gini, velocity) {
    const inflationAdj = calculateInflationAdjustment(inflation || calculateInflationRate());
    const inequalityAdj = calculateInequalityAdjustment(gini || calculateGiniCoefficient());
    
    const currentRates = getCurrentRates();
    const simulatedRates = { ...currentRates };
    
    if (inflationAdj.transaction) {
        simulatedRates[TAX_TYPES.TRANSACTION] = Math.max(ADJUSTMENT_CONFIG.MIN_TAX_RATE,
            Math.min(ADJUSTMENT_CONFIG.MAX_TAX_RATE,
                currentRates[TAX_TYPES.TRANSACTION] + inflationAdj.transaction));
    }
    if (inflationAdj.property) {
        simulatedRates[TAX_TYPES.PROPERTY] = Math.max(ADJUSTMENT_CONFIG.MIN_TAX_RATE,
            Math.min(ADJUSTMENT_CONFIG.MAX_TAX_RATE,
                currentRates[TAX_TYPES.PROPERTY] + inflationAdj.property));
    }
    if (inflationAdj.income) {
        simulatedRates[TAX_TYPES.INCOME] = Math.max(ADJUSTMENT_CONFIG.MIN_TAX_RATE,
            Math.min(ADJUSTMENT_CONFIG.MAX_TAX_RATE,
                currentRates[TAX_TYPES.INCOME] + inflationAdj.income));
    }
    if (inequalityAdj.luxury) {
        simulatedRates[TAX_TYPES.LUXURY] = Math.max(ADJUSTMENT_CONFIG.MIN_TAX_RATE,
            Math.min(ADJUSTMENT_CONFIG.MAX_TAX_RATE,
                currentRates[TAX_TYPES.LUXURY] + inequalityAdj.luxury));
    }
    
    return {
        currentRates,
        simulatedRates,
        changes: {
            transaction: inflationAdj.transaction || 0,
            property: inflationAdj.property || 0,
            income: inflationAdj.income || 0,
            luxury: inequalityAdj.luxury || 0
        },
        basedOn: {
            inflation: inflation || calculateInflationRate(),
            gini: gini || calculateGiniCoefficient()
        }
    };
}

// ===== FORMATTING =====
function formatPercent(value) {
    return (value * 100).toFixed(2) + '%';
}

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ADJUSTMENT_CONFIG,
        initializeAdjuster,
        getAdjustmentLog,
        getAdjustmentHistory,
        isEmergencyMode,
        isManualOverride,
        setManualOverride,
        shouldAdjust,
        performEconomicAdjustment,
        performEmergencyAdjustment,
        getAdjustmentSummary,
        forecastNextAdjustment,
        simulateAdjustment,
        formatPercent
    };
}

// Initialize on load
initializeAdjuster();

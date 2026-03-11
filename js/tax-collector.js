// tax-collector.js - Automatic tax collection system for Voidfarer
// Handles deduction of taxes from transactions, properties, and income

// ===== DEPENDENCIES =====
// Requires tax-system.js and economic-metrics.js to be loaded first

// ===== COLLECTION INTERVALS =====
const COLLECTION_INTERVALS = {
    TRANSACTION: 'instant',      // Collected immediately
    PROPERTY: 'monthly',         // Collected once per month
    INCOME: 'weekly',            // Collected weekly from pool earnings
    LUXURY: 'monthly',           // Collected monthly based on wealth
    REGISTRATION: 'one-time'     // Collected once when joining pool
};

// ===== STORAGE KEYS =====
const COLLECTOR_STORAGE_KEYS = {
    LAST_PROPERTY_TAX: 'voidfarer_last_property_tax',
    LAST_LUXURY_TAX: 'voidfarer_last_luxury_tax',
    LAST_INCOME_TAX: 'voidfarer_last_income_tax',
    TAX_NOTIFICATIONS: 'voidfarer_tax_notifications',
    COLLECTION_LOG: 'voidfarer_collection_log'
};

// ===== INITIALIZE COLLECTOR =====
function initializeCollector() {
    // Set last collection dates if not set
    if (!localStorage.getItem(COLLECTOR_STORAGE_KEYS.LAST_PROPERTY_TAX)) {
        localStorage.setItem(COLLECTOR_STORAGE_KEYS.LAST_PROPERTY_TAX, Date.now().toString());
    }
    if (!localStorage.getItem(COLLECTOR_STORAGE_KEYS.LAST_LUXURY_TAX)) {
        localStorage.setItem(COLLECTOR_STORAGE_KEYS.LAST_LUXURY_TAX, Date.now().toString());
    }
    if (!localStorage.getItem(COLLECTOR_STORAGE_KEYS.LAST_INCOME_TAX)) {
        localStorage.setItem(COLLECTOR_STORAGE_KEYS.LAST_INCOME_TAX, Date.now().toString());
    }
    
    // Initialize collection log
    if (!localStorage.getItem(COLLECTOR_STORAGE_KEYS.COLLECTION_LOG)) {
        localStorage.setItem(COLLECTOR_STORAGE_KEYS.COLLECTION_LOG, JSON.stringify([]));
    }
    
    // Initialize notifications
    if (!localStorage.getItem(COLLECTOR_STORAGE_KEYS.TAX_NOTIFICATIONS)) {
        localStorage.setItem(COLLECTOR_STORAGE_KEYS.TAX_NOTIFICATIONS, JSON.stringify([]));
    }
}

// ===== COLLECTION LOG =====
function getCollectionLog(limit = 100) {
    const log = localStorage.getItem(COLLECTOR_STORAGE_KEYS.COLLECTION_LOG);
    const allLogs = log ? JSON.parse(log) : [];
    return allLogs.slice(-limit);
}

function addToCollectionLog(entry) {
    const log = localStorage.getItem(COLLECTOR_STORAGE_KEYS.COLLECTION_LOG);
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
    
    localStorage.setItem(COLLECTOR_STORAGE_KEYS.COLLECTION_LOG, JSON.stringify(allLogs));
}

// ===== NOTIFICATION SYSTEM =====
function addTaxNotification(playerId, title, message, amount, taxType) {
    const notifications = localStorage.getItem(COLLECTOR_STORAGE_KEYS.TAX_NOTIFICATIONS);
    const allNotifications = notifications ? JSON.parse(notifications) : [];
    
    allNotifications.push({
        id: 'tax_notify_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        playerId,
        title,
        message,
        amount,
        taxType,
        read: false,
        timestamp: Date.now(),
        date: new Date().toISOString()
    });
    
    // Keep only last 50 per player (will filter later)
    localStorage.setItem(COLLECTOR_STORAGE_KEYS.TAX_NOTIFICATIONS, JSON.stringify(allNotifications));
}

function getPlayerTaxNotifications(playerId, unreadOnly = false) {
    const notifications = localStorage.getItem(COLLECTOR_STORAGE_KEYS.TAX_NOTIFICATIONS);
    const allNotifications = notifications ? JSON.parse(notifications) : [];
    
    let playerNotes = allNotifications.filter(n => n.playerId === playerId);
    
    if (unreadOnly) {
        playerNotes = playerNotes.filter(n => !n.read);
    }
    
    return playerNotes.sort((a, b) => b.timestamp - a.timestamp);
}

function markNotificationAsRead(notificationId) {
    const notifications = localStorage.getItem(COLLECTOR_STORAGE_KEYS.TAX_NOTIFICATIONS);
    const allNotifications = notifications ? JSON.parse(notifications) : [];
    
    const updated = allNotifications.map(n => {
        if (n.id === notificationId) {
            n.read = true;
        }
        return n;
    });
    
    localStorage.setItem(COLLECTOR_STORAGE_KEYS.TAX_NOTIFICATIONS, JSON.stringify(updated));
}

function markAllPlayerNotificationsRead(playerId) {
    const notifications = localStorage.getItem(COLLECTOR_STORAGE_KEYS.TAX_NOTIFICATIONS);
    const allNotifications = notifications ? JSON.parse(notifications) : [];
    
    const updated = allNotifications.map(n => {
        if (n.playerId === playerId) {
            n.read = true;
        }
        return n;
    });
    
    localStorage.setItem(COLLECTOR_STORAGE_KEYS.TAX_NOTIFICATIONS, JSON.stringify(updated));
}

// ===== TRANSACTION TAX COLLECTION =====
function collectTransactionTax(sellerId, sellerName, amount, itemDescription) {
    // Calculate tax
    const taxResult = payTax(sellerId, sellerName, TAX_TYPES.TRANSACTION, amount, 
        `Tax on sale: ${itemDescription}`);
    
    if (!taxResult) return { success: false, reason: 'tax_calculation_failed' };
    
    // Log the collection
    addToCollectionLog({
        type: TAX_TYPES.TRANSACTION,
        playerId: sellerId,
        playerName: sellerName,
        amount: taxResult.paid,
        baseAmount: amount,
        rate: taxResult.rate,
        description: `Transaction tax on ${itemDescription}`
    });
    
    // Add notification for significant amounts (>1000⭐)
    if (taxResult.paid > 1000) {
        addTaxNotification(
            sellerId,
            'Transaction Tax Paid',
            `You paid ${formatMoney(taxResult.paid)} in taxes on your sale of ${itemDescription}`,
            taxResult.paid,
            TAX_TYPES.TRANSACTION
        );
    }
    
    return {
        success: true,
        taxPaid: taxResult.paid,
        netAmount: amount - taxResult.paid,
        recordId: taxResult.recordId
    };
}

// ===== PROPERTY TAX COLLECTION =====
function collectPropertyTax(playerId, playerName, properties) {
    if (!properties || properties.length === 0) {
        return { success: true, taxPaid: 0, message: 'No properties' };
    }
    
    // Calculate total property value
    let totalValue = 0;
    properties.forEach(prop => {
        totalValue += prop.cost || prop.value || 0;
    });
    
    // Calculate tax
    const taxAmount = calculateMonthlyPropertyTax(properties);
    
    if (taxAmount <= 0) {
        return { success: true, taxPaid: 0 };
    }
    
    // Check if player has enough credits (would be handled by calling function)
    // Here we just calculate and return the amount
    
    const taxResult = payTax(playerId, playerName, TAX_TYPES.PROPERTY, totalValue,
        `Monthly property tax on ${properties.length} properties`);
    
    if (!taxResult) return { success: false, reason: 'tax_calculation_failed' };
    
    // Log the collection
    addToCollectionLog({
        type: TAX_TYPES.PROPERTY,
        playerId,
        playerName,
        amount: taxResult.paid,
        propertyCount: properties.length,
        totalValue,
        rate: taxResult.rate,
        description: `Property tax for ${properties.length} properties`
    });
    
    // Always notify for property tax
    addTaxNotification(
        playerId,
        'Property Tax Collected',
        `Monthly property tax: ${formatMoney(taxResult.paid)} on ${properties.length} properties`,
        taxResult.paid,
        TAX_TYPES.PROPERTY
    );
    
    return {
        success: true,
        taxPaid: taxResult.paid,
        propertyCount: properties.length,
        recordId: taxResult.recordId
    };
}

// ===== INCOME TAX COLLECTION =====
function collectIncomeTax(playerId, playerName, income, source) {
    if (income <= 0) return { success: true, taxPaid: 0 };
    
    const taxResult = payTax(playerId, playerName, TAX_TYPES.INCOME, income,
        `Income tax from ${source}`);
    
    if (!taxResult) return { success: false, reason: 'tax_calculation_failed' };
    
    // Log the collection
    addToCollectionLog({
        type: TAX_TYPES.INCOME,
        playerId,
        playerName,
        amount: taxResult.paid,
        grossIncome: income,
        rate: taxResult.rate,
        source,
        description: `Income tax on ${source} earnings`
    });
    
    // Notify for significant amounts
    if (taxResult.paid > 500) {
        addTaxNotification(
            playerId,
            'Income Tax Withheld',
            `${formatMoney(taxResult.paid)} withheld from your ${source} earnings`,
            taxResult.paid,
            TAX_TYPES.INCOME
        );
    }
    
    return {
        success: true,
        taxPaid: taxResult.paid,
        netIncome: income - taxResult.paid,
        recordId: taxResult.recordId
    };
}

// ===== LUXURY TAX COLLECTION =====
function collectLuxuryTax(playerId, playerName, totalWealth) {
    if (totalWealth < 1000000) { // Below 1M threshold
        return { success: true, taxPaid: 0, message: 'Below luxury tax threshold' };
    }
    
    const taxResult = payTax(playerId, playerName, TAX_TYPES.LUXURY, totalWealth,
        'Monthly luxury tax on wealth');
    
    if (!taxResult) return { success: false, reason: 'tax_calculation_failed' };
    
    if (taxResult.exempt) {
        return { success: true, taxPaid: 0, exempt: true, reason: taxResult.reason };
    }
    
    // Log the collection
    addToCollectionLog({
        type: TAX_TYPES.LUXURY,
        playerId,
        playerName,
        amount: taxResult.paid,
        totalWealth,
        rate: taxResult.rate,
        description: 'Luxury tax on accumulated wealth'
    });
    
    // Always notify for luxury tax
    addTaxNotification(
        playerId,
        'Luxury Tax Assessed',
        `Monthly luxury tax: ${formatMoney(taxResult.paid)} on wealth of ${formatMoney(totalWealth)}`,
        taxResult.paid,
        TAX_TYPES.LUXURY
    );
    
    return {
        success: true,
        taxPaid: taxResult.paid,
        recordId: taxResult.recordId
    };
}

// ===== REGISTRATION FEE COLLECTION =====
function collectRegistrationFee(playerId, playerName, profession) {
    const fee = getRegistrationFee();
    
    const taxResult = payTax(playerId, playerName, TAX_TYPES.REGISTRATION, fee,
        `Professional registration for ${profession}`);
    
    if (!taxResult) return { success: false, reason: 'tax_calculation_failed' };
    
    // Log the collection
    addToCollectionLog({
        type: TAX_TYPES.REGISTRATION,
        playerId,
        playerName,
        amount: taxResult.paid,
        profession,
        description: `One-time registration fee for ${profession}`
    });
    
    addTaxNotification(
        playerId,
        'Professional Registration',
        `You paid the ${formatMoney(taxResult.paid)} registration fee for ${profession}`,
        taxResult.paid,
        TAX_TYPES.REGISTRATION
    );
    
    return {
        success: true,
        taxPaid: taxResult.paid,
        recordId: taxResult.recordId
    };
}

// ===== BULK COLLECTION FUNCTIONS =====

// Collect all taxes for a player (called periodically)
function collectAllTaxes(playerId, playerName, playerData) {
    const results = {
        transaction: { collected: 0, count: 0 },
        property: { collected: 0, count: 0 },
        income: { collected: 0, count: 0 },
        luxury: { collected: 0, amount: 0 },
        total: 0
    };
    
    // Property tax
    if (playerData.properties && playerData.properties.length > 0) {
        const propResult = collectPropertyTax(playerId, playerName, playerData.properties);
        if (propResult.success) {
            results.property.collected = propResult.taxPaid;
            results.property.count = propResult.propertyCount || 0;
            results.total += propResult.taxPaid;
        }
    }
    
    // Luxury tax
    if (playerData.totalWealth) {
        const luxResult = collectLuxuryTax(playerId, playerName, playerData.totalWealth);
        if (luxResult.success) {
            results.luxury.amount = luxResult.taxPaid;
            results.total += luxResult.taxPaid;
        }
    }
    
    return results;
}

// ===== SCHEDULED COLLECTION CHECKS =====

// Check if monthly taxes are due
function isMonthlyTaxDue(lastCollectionKey) {
    const lastCollection = parseInt(localStorage.getItem(lastCollectionKey)) || 0;
    const now = Date.now();
    const msInMonth = 30 * 24 * 60 * 60 * 1000;
    
    return (now - lastCollection) > msInMonth;
}

// Run monthly property tax collection for all players
function runMonthlyPropertyTaxCollection(allPlayers) {
    if (!isMonthlyTaxDue(COLLECTOR_STORAGE_KEYS.LAST_PROPERTY_TAX)) {
        return { success: true, message: 'Not yet due', collected: 0 };
    }
    
    let totalCollected = 0;
    const results = [];
    
    allPlayers.forEach(player => {
        if (player.properties && player.properties.length > 0) {
            const result = collectPropertyTax(player.id, player.name, player.properties);
            if (result.success) {
                totalCollected += result.taxPaid;
                results.push({
                    playerId: player.id,
                    amount: result.taxPaid
                });
            }
        }
    });
    
    // Update last collection time
    localStorage.setItem(COLLECTOR_STORAGE_KEYS.LAST_PROPERTY_TAX, Date.now().toString());
    
    addToCollectionLog({
        type: 'BULK_PROPERTY',
        totalCollected,
        playerCount: results.length,
        timestamp: Date.now()
    });
    
    return {
        success: true,
        totalCollected,
        results
    };
}

// Run monthly luxury tax collection for all players
function runMonthlyLuxuryTaxCollection(allPlayers) {
    if (!isMonthlyTaxDue(COLLECTOR_STORAGE_KEYS.LAST_LUXURY_TAX)) {
        return { success: true, message: 'Not yet due', collected: 0 };
    }
    
    let totalCollected = 0;
    const results = [];
    
    allPlayers.forEach(player => {
        if (player.totalWealth && player.totalWealth > 1000000) {
            const result = collectLuxuryTax(player.id, player.name, player.totalWealth);
            if (result.success) {
                totalCollected += result.taxPaid;
                results.push({
                    playerId: player.id,
                    amount: result.taxPaid
                });
            }
        }
    });
    
    // Update last collection time
    localStorage.setItem(COLLECTOR_STORAGE_KEYS.LAST_LUXURY_TAX, Date.now().toString());
    
    addToCollectionLog({
        type: 'BULK_LUXURY',
        totalCollected,
        playerCount: results.length,
        timestamp: Date.now()
    });
    
    return {
        success: true,
        totalCollected,
        results
    };
}

// ===== TAX REFUNDS =====
function issueTaxRefund(playerId, playerName, amount, reason, originalTaxRecordId) {
    // This would need to interact with community fund
    const fund = getCommunityFund();
    
    if (fund.balance < amount) {
        return { success: false, reason: 'insufficient_funds' };
    }
    
    // Allocate from community fund
    const allocated = allocateFromCommunityFund(amount, 'tax_refund', 
        `Refund to ${playerName}: ${reason}`);
    
    if (!allocated) {
        return { success: false, reason: 'allocation_failed' };
    }
    
    // Record the refund (negative tax)
    const refundRecord = addTaxRecord({
        playerId,
        playerName,
        taxType: 'REFUND',
        amount: -amount,
        rate: 0,
        baseAmount: amount,
        description: `Tax refund: ${reason}`
    });
    
    addToCollectionLog({
        type: 'REFUND',
        playerId,
        playerName,
        amount,
        reason,
        originalTaxRecordId,
        description: `Tax refund issued: ${reason}`
    });
    
    addTaxNotification(
        playerId,
        'Tax Refund Issued',
        `You received a tax refund of ${formatMoney(amount)}: ${reason}`,
        amount,
        'REFUND'
    );
    
    return {
        success: true,
        refundAmount: amount,
        recordId: refundRecord.id
    };
}

// ===== TAX SUMMARY FOR PLAYER =====
function getPlayerTaxSummary(playerId, playerName) {
    const history = getTaxHistory(playerId, 1000);
    
    let totalPaid = 0;
    let byType = {};
    let monthlyAverage = 0;
    
    const now = Date.now();
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
    const recentHistory = history.filter(h => h.timestamp > monthAgo);
    
    history.forEach(record => {
        totalPaid += record.amount;
        if (!byType[record.taxType]) {
            byType[record.taxType] = 0;
        }
        byType[record.taxType] += record.amount;
    });
    
    if (recentHistory.length > 0) {
        monthlyAverage = recentHistory.reduce((sum, r) => sum + r.amount, 0) / recentHistory.length;
    }
    
    // Get upcoming taxes
    const now_date = new Date();
    const nextPropertyDate = new Date(parseInt(localStorage.getItem(COLLECTOR_STORAGE_KEYS.LAST_PROPERTY_TAX)) + (30 * 24 * 60 * 60 * 1000));
    const nextLuxuryDate = new Date(parseInt(localStorage.getItem(COLLECTOR_STORAGE_KEYS.LAST_LUXURY_TAX)) + (30 * 24 * 60 * 60 * 1000));
    
    return {
        playerId,
        playerName,
        totalPaid,
        byType,
        transactionCount: history.length,
        monthlyAverage,
        nextPropertyTaxDate: nextPropertyDate.toISOString().split('T')[0],
        nextLuxuryTaxDate: nextLuxuryDate.toISOString().split('T')[0],
        recentTransactions: recentHistory.slice(-10)
    };
}

// ===== FORMATTING =====
function formatMoney(amount) {
    if (amount >= 1e9) return (amount / 1e9).toFixed(2) + 'B⭐';
    if (amount >= 1e6) return (amount / 1e6).toFixed(2) + 'M⭐';
    if (amount >= 1e3) return (amount / 1e3).toFixed(2) + 'K⭐';
    return amount + '⭐';
}

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COLLECTION_INTERVALS,
        initializeCollector,
        getCollectionLog,
        getPlayerTaxNotifications,
        markNotificationAsRead,
        markAllPlayerNotificationsRead,
        collectTransactionTax,
        collectPropertyTax,
        collectIncomeTax,
        collectLuxuryTax,
        collectRegistrationFee,
        collectAllTaxes,
        runMonthlyPropertyTaxCollection,
        runMonthlyLuxuryTaxCollection,
        issueTaxRefund,
        getPlayerTaxSummary,
        formatMoney
    };
}

// Initialize on load
initializeCollector();

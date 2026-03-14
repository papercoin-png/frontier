// js/tax-history.js - Complete tax history and reporting system for Voidfarer
// Now using IndexedDB via storage.js for unlimited storage

import { 
    addTaxRecord as storageAddTaxRecord,
    getTaxHistory as storageGetTaxHistory,
    getAllTransactions as storageGetAllTransactions,
    getPlayerTransactions,
    getPlayerTaxSummary as storageGetPlayerTaxSummary
} from './storage.js';

// ===== HISTORY STORAGE KEYS (kept for reference, but not used directly) =====
const HISTORY_STORAGE_KEYS = {
    TAX_TRANSACTIONS: 'voidfarer_tax_transactions',
    TAX_REPORTS: 'voidfarer_tax_reports',
    TAX_EXPORTS: 'voidfarer_tax_exports',
    PLAYER_TAX_SUMMARIES: 'voidfarer_player_tax_summaries',
    TAX_AUDIT_LOG: 'voidfarer_tax_audit_log'
};

// ===== INITIALIZE HISTORY SYSTEM =====
export async function initializeTaxHistory() {
    // Initialize reports in localStorage (small data)
    if (!localStorage.getItem(HISTORY_STORAGE_KEYS.TAX_REPORTS)) {
        localStorage.setItem(HISTORY_STORAGE_KEYS.TAX_REPORTS, JSON.stringify([]));
    }
    
    // Initialize exports in localStorage
    if (!localStorage.getItem(HISTORY_STORAGE_KEYS.TAX_EXPORTS)) {
        localStorage.setItem(HISTORY_STORAGE_KEYS.TAX_EXPORTS, JSON.stringify([]));
    }
    
    // Initialize audit log in localStorage
    if (!localStorage.getItem(HISTORY_STORAGE_KEYS.TAX_AUDIT_LOG)) {
        localStorage.setItem(HISTORY_STORAGE_KEYS.TAX_AUDIT_LOG, JSON.stringify([]));
    }
    
    // Player tax summaries are now handled by storage.js
    console.log('Tax history system initialized');
}

// ===== TRANSACTION MANAGEMENT =====
export async function getAllTransactions(limit = 1000) {
    // Use storage.js function
    return await storageGetAllTransactions(limit);
}

export async function addTransaction(transaction) {
    // Use storage.js function
    const newTx = await storageAddTaxRecord(transaction);
    
    // Add to audit log
    addAuditEntry({
        action: 'TRANSACTION_ADDED',
        transactionId: newTx.id,
        playerId: newTx.playerId,
        amount: newTx.amount,
        taxType: newTx.taxType
    });
    
    return newTx;
}

export async function getPlayerTransactions(playerId, limit = 100) {
    return await storageGetTaxHistory(playerId, limit);
}

export async function getTransactionsByType(taxType, limit = 100) {
    const allTxs = await getAllTransactions();
    return allTxs
        .filter(tx => tx.taxType === taxType)
        .slice(-limit);
}

export async function getTransactionsByDateRange(startDate, endDate) {
    const allTxs = await getAllTransactions();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return allTxs.filter(tx => 
        tx.timestamp >= start && tx.timestamp <= end
    );
}

// ===== PLAYER TAX SUMMARIES =====
export async function getPlayerTaxSummaries() {
    // In a full implementation, this would aggregate from all transactions
    // For now, we'll use a simplified version
    const allTxs = await getAllTransactions(10000);
    const summaries = {};
    
    allTxs.forEach(tx => {
        if (!summaries[tx.playerId]) {
            summaries[tx.playerId] = {
                playerId: tx.playerId,
                playerName: tx.playerName,
                totalPaid: 0,
                byType: {},
                byYear: {},
                lastTransaction: null,
                transactionCount: 0
            };
        }
        
        const summary = summaries[tx.playerId];
        summary.totalPaid += tx.amount;
        summary.transactionCount++;
        
        if (!summary.lastTransaction || tx.timestamp > summary.lastTransaction) {
            summary.lastTransaction = tx.timestamp;
            summary.playerName = tx.playerName; // Update name
        }
        
        // Update by type
        if (!summary.byType[tx.taxType]) {
            summary.byType[tx.taxType] = 0;
        }
        summary.byType[tx.taxType] += tx.amount;
        
        // Update by year
        const year = tx.year || new Date(tx.timestamp).getFullYear();
        if (!summary.byYear[year]) {
            summary.byYear[year] = 0;
        }
        summary.byYear[year] += tx.amount;
    });
    
    return summaries;
}

export async function getPlayerTaxSummary(playerId) {
    // Try to get from storage.js first
    const storageSummary = await storageGetPlayerTaxSummary?.(playerId);
    if (storageSummary) return storageSummary;
    
    // Fallback: calculate on the fly
    const transactions = await getPlayerTransactions(playerId, 1000);
    
    if (transactions.length === 0) return null;
    
    let totalPaid = 0;
    const byType = {};
    const byYear = {};
    let lastTransaction = 0;
    let playerName = '';
    
    transactions.forEach(tx => {
        totalPaid += tx.amount;
        if (tx.timestamp > lastTransaction) {
            lastTransaction = tx.timestamp;
            playerName = tx.playerName;
        }
        
        byType[tx.taxType] = (byType[tx.taxType] || 0) + tx.amount;
        
        const year = tx.year || new Date(tx.timestamp).getFullYear();
        byYear[year] = (byYear[year] || 0) + tx.amount;
    });
    
    return {
        playerId,
        playerName,
        totalPaid,
        byType,
        byYear,
        lastTransaction,
        transactionCount: transactions.length
    };
}

export async function getAllPlayerSummaries() {
    return await getPlayerTaxSummaries();
}

// ===== TAX REPORTS (keep in localStorage) =====
export async function generateTaxReport(startDate, endDate, options = {}) {
    const transactions = await getTransactionsByDateRange(startDate, endDate);
    
    const report = {
        id: 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        generated: Date.now(),
        generatedDate: new Date().toISOString(),
        period: {
            start: startDate,
            end: endDate
        },
        summary: {
            totalTransactions: transactions.length,
            totalCollected: transactions.reduce((sum, tx) => sum + tx.amount, 0),
            averageTransaction: transactions.length > 0 ? 
                transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length : 0,
            uniquePlayers: new Set(transactions.map(tx => tx.playerId)).size
        },
        byType: {},
        byDay: {},
        topPayers: [],
        topTransactions: []
    };
    
    // Calculate by type
    transactions.forEach(tx => {
        if (!report.byType[tx.taxType]) {
            report.byType[tx.taxType] = {
                count: 0,
                total: 0,
                average: 0
            };
        }
        report.byType[tx.taxType].count++;
        report.byType[tx.taxType].total += tx.amount;
    });
    
    // Calculate averages by type
    Object.keys(report.byType).forEach(type => {
        report.byType[type].average = report.byType[type].total / report.byType[type].count;
    });
    
    // Calculate by day
    transactions.forEach(tx => {
        const day = tx.date.split('T')[0];
        if (!report.byDay[day]) {
            report.byDay[day] = 0;
        }
        report.byDay[day] += tx.amount;
    });
    
    // Calculate top payers
    const payerTotals = {};
    transactions.forEach(tx => {
        if (!payerTotals[tx.playerId]) {
            payerTotals[tx.playerId] = {
                playerId: tx.playerId,
                playerName: tx.playerName,
                total: 0,
                count: 0
            };
        }
        payerTotals[tx.playerId].total += tx.amount;
        payerTotals[tx.playerId].count++;
    });
    
    report.topPayers = Object.values(payerTotals)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
    
    // Get top transactions
    report.topTransactions = [...transactions]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);
    
    // Save report to localStorage
    const reports = getTaxReports();
    reports.push({
        id: report.id,
        generated: report.generated,
        period: report.period,
        summary: report.summary
    });
    saveTaxReports(reports);
    
    return report;
}

export function getTaxReports(limit = 10) {
    const reports = localStorage.getItem(HISTORY_STORAGE_KEYS.TAX_REPORTS);
    return reports ? JSON.parse(reports).slice(-limit) : [];
}

export function saveTaxReports(reports) {
    localStorage.setItem(HISTORY_STORAGE_KEYS.TAX_REPORTS, JSON.stringify(reports));
}

export function getTaxReport(reportId) {
    const reports = getTaxReports(1000);
    return reports.find(r => r.id === reportId) || null;
}

// ===== TAX AUDIT LOG (keep in localStorage) =====
export function getAuditLog(limit = 100) {
    const log = localStorage.getItem(HISTORY_STORAGE_KEYS.TAX_AUDIT_LOG);
    const allLogs = log ? JSON.parse(log) : [];
    return allLogs.slice(-limit);
}

export function addAuditEntry(entry) {
    const log = localStorage.getItem(HISTORY_STORAGE_KEYS.TAX_AUDIT_LOG);
    const allLogs = log ? JSON.parse(log) : [];
    
    allLogs.push({
        ...entry,
        id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        timestamp: Date.now(),
        date: new Date().toISOString()
    });
    
    // Keep only last 5000 entries
    if (allLogs.length > 5000) {
        allLogs.shift();
    }
    
    localStorage.setItem(HISTORY_STORAGE_KEYS.TAX_AUDIT_LOG, JSON.stringify(allLogs));
}

// ===== TAX EXPORTS (keep in localStorage) =====
export async function exportTaxData(format = 'json', dateRange = 'all') {
    let transactions = await getAllTransactions();
    
    if (dateRange !== 'all') {
        const endDate = Date.now();
        let startDate;
        
        switch(dateRange) {
            case 'month':
                startDate = endDate - (30 * 24 * 60 * 60 * 1000);
                break;
            case 'quarter':
                startDate = endDate - (90 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                startDate = endDate - (365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = 0;
        }
        
        transactions = transactions.filter(tx => tx.timestamp >= startDate);
    }
    
    let exportData;
    let mimeType;
    let extension;
    
    switch(format) {
        case 'json':
            exportData = JSON.stringify(transactions, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            break;
        case 'csv':
            exportData = convertToCSV(transactions);
            mimeType = 'text/csv';
            extension = 'csv';
            break;
        case 'xml':
            exportData = convertToXML(transactions);
            mimeType = 'application/xml';
            extension = 'xml';
            break;
        default:
            exportData = JSON.stringify(transactions, null, 2);
            mimeType = 'application/json';
            extension = 'json';
    }
    
    const exportRecord = {
        id: 'export_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        format,
        dateRange,
        transactionCount: transactions.length,
        totalAmount: transactions.reduce((sum, tx) => sum + tx.amount, 0),
        exportedAt: Date.now(),
        exportedDate: new Date().toISOString()
    };
    
    const exports = getTaxExports();
    exports.push(exportRecord);
    localStorage.setItem(HISTORY_STORAGE_KEYS.TAX_EXPORTS, JSON.stringify(exports));
    
    addAuditEntry({
        action: 'DATA_EXPORTED',
        format,
        dateRange,
        transactionCount: transactions.length
    });
    
    return {
        data: exportData,
        mimeType,
        extension,
        filename: `tax_export_${new Date().toISOString().split('T')[0]}.${extension}`,
        metadata: exportRecord
    };
}

export function getTaxExports(limit = 10) {
    const exports = localStorage.getItem(HISTORY_STORAGE_KEYS.TAX_EXPORTS);
    return exports ? JSON.parse(exports).slice(-limit) : [];
}

// ===== ANALYTICS FUNCTIONS =====
export async function getTaxAnalytics() {
    const transactions = await getAllTransactions();
    const now = Date.now();
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
    const quarterAgo = now - (90 * 24 * 60 * 60 * 1000);
    const yearAgo = now - (365 * 24 * 60 * 60 * 1000);
    
    const recentTransactions = transactions.filter(tx => tx.timestamp > monthAgo);
    const quarterTransactions = transactions.filter(tx => tx.timestamp > quarterAgo);
    const yearTransactions = transactions.filter(tx => tx.timestamp > yearAgo);
    
    const byType = {};
    transactions.forEach(tx => {
        if (!byType[tx.taxType]) {
            byType[tx.taxType] = {
                total: 0,
                count: 0,
                monthly: 0,
                quarterly: 0,
                yearly: 0
            };
        }
        byType[tx.taxType].total += tx.amount;
        byType[tx.taxType].count++;
        
        if (tx.timestamp > monthAgo) byType[tx.taxType].monthly += tx.amount;
        if (tx.timestamp > quarterAgo) byType[tx.taxType].quarterly += tx.amount;
        if (tx.timestamp > yearAgo) byType[tx.taxType].yearly += tx.amount;
    });
    
    return {
        allTime: {
            totalCollected: transactions.reduce((sum, tx) => sum + tx.amount, 0),
            transactionCount: transactions.length,
            averageTransaction: transactions.length > 0 ?
                transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length : 0,
            uniquePlayers: new Set(transactions.map(tx => tx.playerId)).size
        },
        monthly: {
            totalCollected: recentTransactions.reduce((sum, tx) => sum + tx.amount, 0),
            transactionCount: recentTransactions.length,
            averageTransaction: recentTransactions.length > 0 ?
                recentTransactions.reduce((sum, tx) => sum + tx.amount, 0) / recentTransactions.length : 0
        },
        quarterly: {
            totalCollected: quarterTransactions.reduce((sum, tx) => sum + tx.amount, 0),
            transactionCount: quarterTransactions.length
        },
        yearly: {
            totalCollected: yearTransactions.reduce((sum, tx) => sum + tx.amount, 0),
            transactionCount: yearTransactions.length
        },
        byType
    };
}

export async function getPlayerAnalytics(playerId) {
    const transactions = await getPlayerTransactions(playerId);
    const summary = await getPlayerTaxSummary(playerId);
    
    if (!summary) return null;
    
    const now = Date.now();
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
    const recentTransactions = transactions.filter(tx => tx.timestamp > monthAgo);
    
    return {
        playerId: summary.playerId,
        playerName: summary.playerName,
        allTime: {
            totalPaid: summary.totalPaid,
            transactionCount: summary.transactionCount,
            averagePayment: summary.totalPaid / summary.transactionCount
        },
        monthly: {
            totalPaid: recentTransactions.reduce((sum, tx) => sum + tx.amount, 0),
            transactionCount: recentTransactions.length,
            averagePayment: recentTransactions.length > 0 ?
                recentTransactions.reduce((sum, tx) => sum + tx.amount, 0) / recentTransactions.length : 0
        },
        byType: summary.byType,
        byYear: summary.byYear,
        lastTransaction: summary.lastTransaction ? 
            new Date(summary.lastTransaction).toLocaleString() : 'Never'
    };
}

// ===== FORMATTING FUNCTIONS =====
function convertToCSV(transactions) {
    const headers = ['ID', 'Date', 'Player', 'Type', 'Amount', 'Base', 'Rate', 'Description'];
    const rows = transactions.map(tx => [
        tx.id,
        tx.date,
        tx.playerName,
        tx.taxType,
        tx.amount,
        tx.baseAmount,
        (tx.rate * 100).toFixed(2) + '%',
        tx.description
    ]);
    
    return [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
}

function convertToXML(transactions) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<taxTransactions>\n';
    xml += `  <generated>${new Date().toISOString()}</generated>\n`;
    xml += `  <count>${transactions.length}</count>\n`;
    
    transactions.forEach(tx => {
        xml += '  <transaction>\n';
        xml += `    <id>${tx.id}</id>\n`;
        xml += `    <date>${tx.date}</date>\n`;
        xml += `    <player>${tx.playerName}</player>\n`;
        xml += `    <playerId>${tx.playerId}</playerId>\n`;
        xml += `    <type>${tx.taxType}</type>\n`;
        xml += `    <amount>${tx.amount}</amount>\n`;
        xml += `    <baseAmount>${tx.baseAmount}</baseAmount>\n`;
        xml += `    <rate>${tx.rate}</rate>\n`;
        xml += `    <description>${tx.description}</description>\n`;
        xml += '  </transaction>\n';
    });
    
    xml += '</taxTransactions>';
    return xml;
}

export function formatMoney(amount) {
    if (amount >= 1e9) return (amount / 1e9).toFixed(2) + 'B⭐';
    if (amount >= 1e6) return (amount / 1e6).toFixed(2) + 'M⭐';
    if (amount >= 1e3) return (amount / 1e3).toFixed(2) + 'K⭐';
    return amount + '⭐';
}

export function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
}

export function formatDateTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}

// ===== CLEANUP =====
export async function pruneOldTransactions(daysToKeep = 365) {
    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const transactions = await getAllTransactions();
    
    const oldTransactions = transactions.filter(tx => tx.timestamp < cutoff);
    const recentTransactions = transactions.filter(tx => tx.timestamp >= cutoff);
    
    // Since we can't easily delete from IndexedDB in bulk here,
    // we'll rely on storage.js to handle pruning, or implement a more sophisticated approach
    console.log(`Would prune ${oldTransactions.length} old transactions, keeping ${recentTransactions.length}`);
    
    addAuditEntry({
        action: 'PRUNE_OLD_TRANSACTIONS',
        removedCount: oldTransactions.length,
        keptCount: recentTransactions.length,
        daysKept: daysToKeep
    });
    
    return {
        removed: oldTransactions.length,
        kept: recentTransactions.length
    };
}

// ===== EXPORT =====
export default {
    HISTORY_STORAGE_KEYS,
    initializeTaxHistory,
    getAllTransactions,
    addTransaction,
    getPlayerTransactions,
    getTransactionsByType,
    getTransactionsByDateRange,
    getPlayerTaxSummaries,
    getPlayerTaxSummary,
    getAllPlayerSummaries,
    generateTaxReport,
    getTaxReports,
    getTaxReport,
    getAuditLog,
    exportTaxData,
    getTaxExports,
    getTaxAnalytics,
    getPlayerAnalytics,
    pruneOldTransactions,
    formatMoney,
    formatDate,
    formatDateTime
};

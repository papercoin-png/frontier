// js/portfolio.js - Professional Portfolio Management
// Tracks holdings, profit/loss, and portfolio performance

import { ELEMENTS, getElementByName, getElementRarity, getElementIcon } from './elements-data.js';
import { marketData } from './market-data.js';
import { getCollection } from './storage.js';

// ===== PORTFOLIO CONFIGURATION =====
const PORTFOLIO_CONFIG = {
    // Update interval (milliseconds)
    updateInterval: 5000,
    
    // History length (days)
    historyDays: 30,
    
    // Default currency
    currency: '⭐',
    
    // Performance metrics to track
    metrics: [
        'totalValue',
        'dailyPnL',
        'weeklyPnL',
        'monthlyPnL',
        'allTimePnL',
        'bestPerformer',
        'worstPerformer',
        'winRate',
        'avgReturn'
    ]
};

// ===== POSITION CLASS =====
export class Position {
    constructor(elementName, quantity, buyPrice, timestamp = Date.now()) {
        this.elementName = elementName;
        this.quantity = quantity;
        this.averageBuyPrice = buyPrice;
        this.totalCost = quantity * buyPrice;
        this.firstBuyDate = timestamp;
        this.lastUpdate = timestamp;
        this.trades = []; // History of trades for this position
        
        // Add initial trade
        this.trades.push({
            type: 'buy',
            quantity: quantity,
            price: buyPrice,
            total: quantity * buyPrice,
            timestamp: timestamp
        });
    }
    
    // Add to position (buy more)
    add(quantity, price, timestamp = Date.now()) {
        const newTotalCost = this.totalCost + (quantity * price);
        const newTotalQuantity = this.quantity + quantity;
        
        // Update average buy price
        this.averageBuyPrice = newTotalCost / newTotalQuantity;
        this.quantity = newTotalQuantity;
        this.totalCost = newTotalCost;
        this.lastUpdate = timestamp;
        
        // Record trade
        this.trades.push({
            type: 'buy',
            quantity: quantity,
            price: price,
            total: quantity * price,
            timestamp: timestamp
        });
    }
    
    // Remove from position (sell)
    remove(quantity, price, timestamp = Date.now()) {
        if (quantity > this.quantity) {
            throw new Error('Insufficient quantity');
        }
        
        const sellValue = quantity * price;
        const costBasis = quantity * this.averageBuyPrice;
        const realizedPnL = sellValue - costBasis;
        
        this.quantity -= quantity;
        this.totalCost -= costBasis;
        this.lastUpdate = timestamp;
        
        // Record trade
        this.trades.push({
            type: 'sell',
            quantity: quantity,
            price: price,
            total: sellValue,
            realizedPnL: realizedPnL,
            timestamp: timestamp
        });
        
        return {
            quantity,
            sellValue,
            costBasis,
            realizedPnL
        };
    }
    
    // Get current value
    getCurrentValue(currentPrice) {
        return this.quantity * currentPrice;
    }
    
    // Get unrealized profit/loss
    getUnrealizedPnL(currentPrice) {
        const currentValue = this.getCurrentValue(currentPrice);
        return currentValue - this.totalCost;
    }
    
    // Get unrealized profit/loss percentage
    getUnrealizedPnLPercentage(currentPrice) {
        if (this.totalCost === 0) return 0;
        const pnl = this.getUnrealizedPnL(currentPrice);
        return (pnl / this.totalCost) * 100;
    }
    
    // Get realized profit/loss
    getRealizedPnL() {
        return this.trades
            .filter(t => t.type === 'sell')
            .reduce((sum, t) => sum + (t.realizedPnL || 0), 0);
    }
    
    // Get total profit/loss (realized + unrealized)
    getTotalPnL(currentPrice) {
        return this.getRealizedPnL() + this.getUnrealizedPnL(currentPrice);
    }
    
    // Get position age in days
    getAge() {
        return (Date.now() - this.firstBuyDate) / (1000 * 60 * 60 * 24);
    }
    
    // Get trade count
    getTradeCount() {
        return this.trades.length;
    }
    
    // Get average hold time
    getAverageHoldTime() {
        const sellTrades = this.trades.filter(t => t.type === 'sell');
        if (sellTrades.length === 0) return 0;
        
        let totalHoldTime = 0;
        let buyIndex = 0;
        
        // Simple FIFO approximation
        for (let sell of sellTrades) {
            const buy = this.trades[buyIndex];
            if (buy && buy.type === 'buy') {
                totalHoldTime += sell.timestamp - buy.timestamp;
                buyIndex++;
            }
        }
        
        return totalHoldTime / sellTrades.length / (1000 * 60 * 60 * 24); // Days
    }
}

// ===== PORTFOLIO CLASS =====
export class Portfolio {
    constructor(playerId = null) {
        this.playerId = playerId || localStorage.getItem('voidfarer_player_id') || 'player_default';
        this.positions = new Map(); // elementName -> Position
        this.transactionHistory = [];
        self.initialCapital = 0;
        self.totalDeposits = 0;
        self.totalWithdrawals = 0;
        self.performanceHistory = [];
        self.maxHistoryLength = 1000;
        
        // Initialize portfolio
        this.loadPortfolio();
        this.updateFromCollection();
        
        // Start portfolio tracking
        this.startPortfolioTracking();
    }
    
    // ===== PORTFOLIO INITIALIZATION =====
    
    /**
     * Update positions from collection (cargo hold)
     */
    async updateFromCollection() {
        try {
            const collection = await getCollection(this.playerId);
            
            // Get current market prices
            const currentPrices = {};
            ELEMENTS.forEach(element => {
                currentPrices[element.name] = marketData.getCurrentPrice(element.name);
            });
            
            // Update or create positions
            for (let [elementName, data] of Object.entries(collection)) {
                const quantity = data.count || data || 0;
                
                if (quantity > 0) {
                    if (!this.positions.has(elementName)) {
                        // New position - use current price as estimated buy price
                        // In reality, you'd want to track actual purchase prices
                        this.positions.set(
                            elementName,
                            new Position(elementName, quantity, currentPrices[elementName])
                        );
                    } else {
                        // Update existing position quantity
                        const position = this.positions.get(elementName);
                        
                        // If quantity changed, we need to adjust
                        if (position.quantity !== quantity) {
                            const diff = quantity - position.quantity;
                            
                            if (diff > 0) {
                                // Bought more
                                position.add(diff, currentPrices[elementName]);
                            } else if (diff < 0) {
                                // Sold some
                                try {
                                    position.remove(-diff, currentPrices[elementName]);
                                } catch (e) {
                                    // Handle mismatch
                                }
                            }
                        }
                    }
                } else {
                    // Remove position if quantity is 0
                    this.positions.delete(elementName);
                }
            }
            
            // Save portfolio
            this.savePortfolio();
            
        } catch (error) {
            console.error('Error updating portfolio from collection:', error);
        }
    }
    
    // ===== PORTFOLIO VALUE =====
    
    /**
     * Get total portfolio value at current prices
     */
    getTotalValue() {
        let total = 0;
        
        for (let [elementName, position] of this.positions.entries()) {
            const currentPrice = marketData.getCurrentPrice(elementName);
            total += position.getCurrentValue(currentPrice);
        }
        
        return total;
    }
    
    /**
     * Get total cost basis
     */
    getTotalCostBasis() {
        let total = 0;
        
        for (let position of this.positions.values()) {
            total += position.totalCost;
        }
        
        return total;
    }
    
    /**
     * Get total unrealized profit/loss
     */
    getTotalUnrealizedPnL() {
        let total = 0;
        
        for (let [elementName, position] of this.positions.entries()) {
            const currentPrice = marketData.getCurrentPrice(elementName);
            total += position.getUnrealizedPnL(currentPrice);
        }
        
        return total;
    }
    
    /**
     * Get total realized profit/loss
     */
    getTotalRealizedPnL() {
        let total = 0;
        
        for (let position of this.positions.values()) {
            total += position.getRealizedPnL();
        }
        
        return total;
    }
    
    /**
     * Get total profit/loss (realized + unrealized)
     */
    getTotalPnL() {
        return this.getTotalRealizedPnL() + this.getTotalUnrealizedPnL();
    }
    
    /**
     * Get total return percentage
     */
    getTotalReturnPercentage() {
        const totalValue = this.getTotalValue();
        const totalCost = this.getTotalCostBasis();
        
        if (totalCost === 0) return 0;
        return ((totalValue - totalCost) / totalCost) * 100;
    }
    
    // ===== POSITION DETAILS =====
    
    /**
     * Get all positions with current data
     */
    getAllPositions() {
        const positions = [];
        
        for (let [elementName, position] of this.positions.entries()) {
            const element = getElementByName(elementName);
            const currentPrice = marketData.getCurrentPrice(elementName);
            const currentValue = position.getCurrentValue(currentPrice);
            const unrealizedPnL = position.getUnrealizedPnL(currentPrice);
            const unrealizedPnLPercent = position.getUnrealizedPnLPercentage(currentPrice);
            const realizedPnL = position.getRealizedPnL();
            const totalPnL = unrealizedPnL + realizedPnL;
            
            positions.push({
                elementName,
                elementSymbol: element?.symbol || '??',
                elementRarity: element?.rarity || 'common',
                elementIcon: getElementIcon(elementName),
                quantity: position.quantity,
                averageBuyPrice: position.averageBuyPrice,
                currentPrice: currentPrice,
                currentValue: currentValue,
                costBasis: position.totalCost,
                unrealizedPnL: unrealizedPnL,
                unrealizedPnLPercent: unrealizedPnLPercent,
                realizedPnL: realizedPnL,
                totalPnL: totalPnL,
                allocation: (currentValue / this.getTotalValue()) * 100,
                age: position.getAge(),
                tradeCount: position.getTradeCount(),
                averageHoldTime: position.getAverageHoldTime()
            });
        }
        
        // Sort by value (largest first)
        positions.sort((a, b) => b.currentValue - a.currentValue);
        
        return positions;
    }
    
    /**
     * Get position for specific element
     */
    getPosition(elementName) {
        if (!this.positions.has(elementName)) return null;
        
        const position = this.positions.get(elementName);
        const element = getElementByName(elementName);
        const currentPrice = marketData.getCurrentPrice(elementName);
        
        return {
            elementName,
            elementSymbol: element?.symbol || '??',
            elementRarity: element?.rarity || 'common',
            elementIcon: getElementIcon(elementName),
            quantity: position.quantity,
            averageBuyPrice: position.averageBuyPrice,
            currentPrice: currentPrice,
            currentValue: position.getCurrentValue(currentPrice),
            costBasis: position.totalCost,
            unrealizedPnL: position.getUnrealizedPnL(currentPrice),
            unrealizedPnLPercent: position.getUnrealizedPnLPercentage(currentPrice),
            realizedPnL: position.getRealizedPnL(),
            totalPnL: position.getTotalPnL(currentPrice),
            trades: position.trades
        };
    }
    
    // ===== PERFORMANCE METRICS =====
    
    /**
     * Get portfolio allocation by rarity
     */
    getAllocationByRarity() {
        const allocation = {
            common: 0,
            uncommon: 0,
            rare: 0,
            'very-rare': 0,
            legendary: 0
        };
        
        const totalValue = this.getTotalValue();
        
        for (let [elementName, position] of this.positions.entries()) {
            const element = getElementByName(elementName);
            if (!element) continue;
            
            const currentPrice = marketData.getCurrentPrice(elementName);
            const value = position.getCurrentValue(currentPrice);
            allocation[element.rarity] += value;
        }
        
        // Convert to percentages
        if (totalValue > 0) {
            for (let rarity in allocation) {
                allocation[rarity] = (allocation[rarity] / totalValue) * 100;
            }
        }
        
        return allocation;
    }
    
    /**
     * Get top performers
     */
    getTopPerformers(limit = 5) {
        const positions = this.getAllPositions();
        
        // Filter out positions with no PnL
        const withPnL = positions.filter(p => p.totalPnL !== 0);
        
        // Sort by total PnL (best first)
        withPnL.sort((a, b) => b.totalPnL - a.totalPnL);
        
        return withPnL.slice(0, limit);
    }
    
    /**
     * Get worst performers
     */
    getWorstPerformers(limit = 5) {
        const positions = this.getAllPositions();
        
        // Filter out positions with no PnL
        const withPnL = positions.filter(p => p.totalPnL !== 0);
        
        // Sort by total PnL (worst first)
        withPnL.sort((a, b) => a.totalPnL - b.totalPnL);
        
        return withPnL.slice(0, limit);
    }
    
    /**
     * Get win rate (percentage of profitable positions)
     */
    getWinRate() {
        const positions = this.getAllPositions();
        const profitable = positions.filter(p => p.totalPnL > 0).length;
        
        return positions.length > 0 ? (profitable / positions.length) * 100 : 0;
    }
    
    /**
     * Get average return per position
     */
    getAverageReturn() {
        const positions = this.getAllPositions();
        if (positions.length === 0) return 0;
        
        const totalReturn = positions.reduce((sum, p) => sum + (p.totalPnL / p.costBasis || 0), 0);
        return (totalReturn / positions.length) * 100;
    }
    
    /**
     * Get portfolio summary
     */
    getSummary() {
        const totalValue = this.getTotalValue();
        const totalCost = this.getTotalCostBasis();
        const unrealizedPnL = this.getTotalUnrealizedPnL();
        const realizedPnL = this.getTotalRealizedPnL();
        const totalPnL = unrealizedPnL + realizedPnL;
        const totalReturnPercent = this.getTotalReturnPercentage();
        
        return {
            totalValue,
            totalCost,
            unrealizedPnL,
            realizedPnL,
            totalPnL,
            totalReturnPercent,
            positionCount: this.positions.size,
            winRate: this.getWinRate(),
            averageReturn: this.getAverageReturn(),
            bestPerformer: this.getTopPerformers(1)[0] || null,
            worstPerformer: this.getWorstPerformers(1)[0] || null,
            allocationByRarity: this.getAllocationByRarity()
        };
    }
    
    // ===== TRANSACTION RECORDING =====
    
    /**
     * Record a buy transaction
     */
    recordBuy(elementName, quantity, price, timestamp = Date.now()) {
        // Update position
        if (this.positions.has(elementName)) {
            this.positions.get(elementName).add(quantity, price, timestamp);
        } else {
            this.positions.set(elementName, new Position(elementName, quantity, price, timestamp));
        }
        
        // Record transaction
        this.transactionHistory.unshift({
            type: 'buy',
            elementName,
            quantity,
            price,
            total: quantity * price,
            timestamp
        });
        
        // Trim history if needed
        if (this.transactionHistory.length > this.maxHistoryLength) {
            this.transactionHistory.pop();
        }
        
        this.savePortfolio();
    }
    
    /**
     * Record a sell transaction
     */
    recordSell(elementName, quantity, price, timestamp = Date.now()) {
        if (!this.positions.has(elementName)) {
            throw new Error('Position not found');
        }
        
        const position = this.positions.get(elementName);
        const result = position.remove(quantity, price, timestamp);
        
        // If position is empty, remove it
        if (position.quantity === 0) {
            this.positions.delete(elementName);
        }
        
        // Record transaction
        this.transactionHistory.unshift({
            type: 'sell',
            elementName,
            quantity,
            price,
            total: quantity * price,
            realizedPnL: result.realizedPnL,
            timestamp
        });
        
        // Trim history if needed
        if (this.transactionHistory.length > this.maxHistoryLength) {
            this.transactionHistory.pop();
        }
        
        this.savePortfolio();
        
        return result;
    }
    
    /**
     * Get transaction history
     */
    getTransactionHistory(limit = 50, elementName = null) {
        let history = this.transactionHistory;
        
        if (elementName) {
            history = history.filter(t => t.elementName === elementName);
        }
        
        return history.slice(0, limit);
    }
    
    // ===== PERFORMANCE HISTORY =====
    
    /**
     * Record portfolio snapshot
     */
    recordSnapshot() {
        const snapshot = {
            timestamp: Date.now(),
            totalValue: this.getTotalValue(),
            totalCost: this.getTotalCostBasis(),
            positions: Array.from(this.positions.entries()).map(([name, pos]) => ({
                elementName: name,
                quantity: pos.quantity,
                value: pos.getCurrentValue(marketData.getCurrentPrice(name))
            }))
        };
        
        this.performanceHistory.push(snapshot);
        
        // Trim history
        const maxSnapshots = this.maxHistoryLength;
        if (this.performanceHistory.length > maxSnapshots) {
            this.performanceHistory = this.performanceHistory.slice(-maxSnapshots);
        }
        
        this.savePortfolio();
    }
    
    /**
     * Get performance history for charts
     */
    getPerformanceHistory(days = 30) {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        
        return this.performanceHistory
            .filter(s => s.timestamp >= cutoff)
            .map(s => ({
                timestamp: s.timestamp,
                value: s.totalValue,
                cost: s.totalCost
            }));
    }
    
    /**
     * Get equity curve data
     */
    getEquityCurve() {
        return this.performanceHistory.map(s => ({
            date: new Date(s.timestamp).toLocaleDateString(),
            value: s.totalValue
        }));
    }
    
    // ===== PORTFOLIO ANALYSIS =====
    
    /**
     * Calculate Sharpe ratio (risk-adjusted return)
     */
    getSharpeRatio(riskFreeRate = 0.02) {
        if (this.performanceHistory.length < 2) return 0;
        
        // Calculate daily returns
        const returns = [];
        for (let i = 1; i < this.performanceHistory.length; i++) {
            const prev = this.performanceHistory[i - 1].totalValue;
            const curr = this.performanceHistory[i].totalValue;
            returns.push((curr - prev) / prev);
        }
        
        if (returns.length === 0) return 0;
        
        // Average return
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        
        // Standard deviation
        const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);
        
        if (stdDev === 0) return 0;
        
        // Sharpe ratio (annualized approximation)
        return ((avgReturn * 365) - riskFreeRate) / (stdDev * Math.sqrt(365));
    }
    
    /**
     * Calculate maximum drawdown
     */
    getMaxDrawdown() {
        if (this.performanceHistory.length === 0) return 0;
        
        let peak = this.performanceHistory[0].totalValue;
        let maxDrawdown = 0;
        
        for (let snapshot of this.performanceHistory) {
            if (snapshot.totalValue > peak) {
                peak = snapshot.totalValue;
            }
            
            const drawdown = (peak - snapshot.totalValue) / peak;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }
        
        return maxDrawdown * 100;
    }
    
    /**
     * Calculate volatility
     */
    getVolatility() {
        if (this.performanceHistory.length < 2) return 0;
        
        const returns = [];
        for (let i = 1; i < this.performanceHistory.length; i++) {
            const prev = this.performanceHistory[i - 1].totalValue;
            const curr = this.performanceHistory[i].totalValue;
            returns.push((curr - prev) / prev);
        }
        
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
        
        return Math.sqrt(variance) * 100;
    }
    
    // ===== PORTFOLIO MANAGEMENT =====
    
    /**
     * Start portfolio tracking
     */
    startPortfolioTracking() {
        // Record initial snapshot
        this.recordSnapshot();
        
        // Take snapshots every 5 minutes
        setInterval(() => {
            this.recordSnapshot();
        }, 5 * 60 * 1000);
        
        // Update from collection periodically
        setInterval(() => {
            this.updateFromCollection();
        }, 30 * 1000);
    }
    
    /**
     * Save portfolio to localStorage
     */
    savePortfolio() {
        try {
            const key = `voidfarer_portfolio_${this.playerId}`;
            
            const data = {
                playerId: this.playerId,
                positions: Array.from(this.positions.entries()),
                transactionHistory: this.transactionHistory,
                performanceHistory: this.performanceHistory,
                lastUpdate: Date.now()
            };
            
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving portfolio:', error);
        }
    }
    
    /**
     * Load portfolio from localStorage
     */
    loadPortfolio() {
        try {
            const key = `voidfarer_portfolio_${this.playerId}`;
            const saved = localStorage.getItem(key);
            
            if (saved) {
                const data = JSON.parse(saved);
                
                // Restore positions
                this.positions = new Map();
                for (let [elementName, posData] of data.positions || []) {
                    const position = new Position(
                        posData.elementName,
                        posData.quantity,
                        posData.averageBuyPrice,
                        posData.firstBuyDate
                    );
                    position.totalCost = posData.totalCost;
                    position.trades = posData.trades || [];
                    this.positions.set(elementName, position);
                }
                
                this.transactionHistory = data.transactionHistory || [];
                this.performanceHistory = data.performanceHistory || [];
                
                console.log('📊 Portfolio loaded:', this.positions.size, 'positions');
            }
        } catch (error) {
            console.error('Error loading portfolio:', error);
        }
    }
    
    /**
     * Reset portfolio (for testing)
     */
    resetPortfolio() {
        this.positions.clear();
        this.transactionHistory = [];
        this.performanceHistory = [];
        this.savePortfolio();
    }
}

// ===== PORTFOLIO UI HELPER FUNCTIONS =====

/**
 * Format currency
 */
export function formatCurrency(value, includeSymbol = true) {
    const formatted = value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    return includeSymbol ? formatted + ' ⭐' : formatted;
}

/**
 * Format percentage
 */
export function formatPercentage(value, decimals = 1) {
    const sign = value > 0 ? '+' : '';
    return sign + value.toFixed(decimals) + '%';
}

/**
 * Get CSS class for PnL
 */
export function getPnLClass(value) {
    if (value > 0) return 'profit-positive';
    if (value < 0) return 'profit-negative';
    return 'profit-neutral';
}

/**
 * Generate portfolio HTML for display
 */
export function generatePortfolioHTML(portfolio) {
    const summary = portfolio.getSummary();
    const positions = portfolio.getAllPositions();
    
    let html = `
        <div class="portfolio-summary">
            <div class="summary-card">
                <div class="summary-label">Total Value</div>
                <div class="summary-value">${formatCurrency(summary.totalValue)}</div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Total P&L</div>
                <div class="summary-value ${getPnLClass(summary.totalPnL)}">
                    ${formatCurrency(summary.totalPnL)} (${formatPercentage(summary.totalReturnPercent)})
                </div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Win Rate</div>
                <div class="summary-value">${formatPercentage(summary.winRate, 1)}</div>
            </div>
        </div>
        
        <div class="allocation-chart">
            <h3>Allocation by Rarity</h3>
            <div class="allocation-bars">
    `;
    
    // Add allocation bars
    const rarityColors = {
        common: '#A0A0A0',
        uncommon: '#4affaa',
        rare: '#4169E1',
        'very-rare': '#e0b0ff',
        legendary: '#ffd700'
    };
    
    for (let [rarity, percentage] of Object.entries(summary.allocationByRarity)) {
        if (percentage > 0) {
            html += `
                <div class="allocation-item">
                    <div class="allocation-label">${rarity}</div>
                    <div class="allocation-bar-container">
                        <div class="allocation-bar" style="width: ${percentage}%; background: ${rarityColors[rarity]};"></div>
                    </div>
                    <div class="allocation-percent">${percentage.toFixed(1)}%</div>
                </div>
            `;
        }
    }
    
    html += `
            </div>
        </div>
        
        <div class="positions-table">
            <h3>Your Holdings</h3>
            <table>
                <thead>
                    <tr>
                        <th>Element</th>
                        <th>Quantity</th>
                        <th>Avg Buy</th>
                        <th>Current</th>
                        <th>Value</th>
                        <th>P&L</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add positions
    positions.forEach(pos => {
        html += `
            <tr class="rarity-${pos.elementRarity}">
                <td>
                    <span class="element-icon">${pos.elementIcon}</span>
                    <span class="element-name">${pos.elementName}</span>
                    <span class="element-symbol">${pos.elementSymbol}</span>
                </td>
                <td>${pos.quantity}</td>
                <td>${formatCurrency(pos.averageBuyPrice)}</td>
                <td>${formatCurrency(pos.currentPrice)}</td>
                <td>${formatCurrency(pos.currentValue)}</td>
                <td class="${getPnLClass(pos.totalPnL)}">
                    ${formatCurrency(pos.totalPnL)}<br>
                    <small>${formatPercentage(pos.unrealizedPnLPercent)}</small>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// ===== EXPORT SINGLETON INSTANCE =====
export const portfolio = new Portfolio();

// ===== DEFAULT EXPORT =====
export default portfolio;

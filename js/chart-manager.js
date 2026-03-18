// js/chart-manager.js - Professional Charting System
// Creates candlestick charts, depth charts, and technical indicators

import { ELEMENTS, getElementByName } from './elements-data.js';
import { marketData } from './market-data.js';

// ===== CHART CONFIGURATION =====
const CHART_CONFIG = {
    // Color scheme
    colors: {
        background: '#0B0E14',
        grid: '#2B2F36',
        text: '#848E9C',
        
        // Candlestick colors
        candleUp: '#0ECB81',
        candleDown: '#F6465D',
        candleBorderUp: '#0ECB81',
        candleBorderDown: '#F6465D',
        wickUp: '#0ECB81',
        wickDown: '#F6465D',
        
        // Indicator colors
        ma7: '#F0B90B',
        ma25: '#9B59B6',
        ma99: '#3498DB',
        volume: '#4A90E2',
        
        // Depth chart colors
        bidColor: '#0ECB81',
        askColor: '#F6465D',
        midPrice: '#F0B90B'
    },
    
    // Timeframes (in minutes)
    timeframes: {
        '1m': 1,
        '5m': 5,
        '15m': 15,
        '1h': 60,
        '4h': 240,
        '1d': 1440,
        '1w': 10080
    },
    
    // Default timeframe
    defaultTimeframe: '1h',
    
    // Number of candles to show
    candleCount: 100,
    
    // Animation duration (ms)
    animationDuration: 300
};

// ===== CHART TYPES =====
export const ChartType = {
    CANDLESTICK: 'candlestick',
    LINE: 'line',
    AREA: 'area',
    DEPTH: 'depth',
    TECHNICAL: 'technical'
};

// ===== TECHNICAL INDICATORS =====
export const Indicators = {
    SMA: 'sma',     // Simple Moving Average
    EMA: 'ema',     // Exponential Moving Average
    RSI: 'rsi',     // Relative Strength Index
    MACD: 'macd',   // Moving Average Convergence Divergence
    BOLLINGER: 'bollinger', // Bollinger Bands
    VOLUME: 'volume' // Volume
};

// ===== CHART MANAGER CLASS =====
export class ChartManager {
    constructor() {
        // Initialize properties FIRST
        this.charts = new Map();        // Active charts by element
        this.currentElement = 'Gold';    // Default element
        this.currentTimeframe = CHART_CONFIG.defaultTimeframe;
        this.currentIndicators = [Indicators.SMA];
        this.chartType = ChartType.CANDLESTICK;
        
        // Bind methods AFTER properties are initialized
        this.createChart = this.createChart.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.destroyChart = this.destroyChart.bind(this);
        this.setChartType = this.setChartType.bind(this);
        this.setTimeframe = this.setTimeframe.bind(this);
        this.toggleIndicator = this.toggleIndicator.bind(this);
    }
    
    // ===== CHART CREATION =====
    
    /**
     * Create a new chart for an element
     */
    createChart(canvasId, elementName, type = ChartType.CANDLESTICK, timeframe = CHART_CONFIG.defaultTimeframe) {
        try {
            const canvas = document.getElementById(canvasId);
            if (!canvas) {
                console.error('Canvas element not found:', canvasId);
                return null;
            }
            
            // Get canvas context
            const ctx = canvas.getContext('2d');
            
            // Clear existing chart for this element
            if (this.charts.has(elementName)) {
                this.destroyChart(elementName);
            }
            
            // Create new chart
            const chart = {
                canvas: canvas,
                ctx: ctx,
                elementName: elementName,
                type: type,
                timeframe: timeframe,
                data: [],
                width: canvas.width,
                height: canvas.height,
                animationFrame: null,
                indicators: [...this.currentIndicators]
            };
            
            // Store chart
            this.charts.set(elementName, chart);
            
            // Load initial data
            this.loadChartData(chart);
            
            // Start animation loop
            this.startChartAnimation(chart);
            
            console.log(`📊 Chart created for ${elementName}`);
            return chart;
            
        } catch (error) {
            console.error('Error creating chart:', error);
            return null;
        }
    }
    
    /**
     * Load chart data from market data
     */
    loadChartData(chart) {
        try {
            const { elementName, timeframe } = chart;
            
            // Get candlestick data from market data
            const candlesticks = marketData.getCandlestickData(elementName, timeframe);
            
            // Calculate indicators
            const indicators = this.calculateIndicators(candlesticks, chart.indicators);
            
            // Update chart data
            chart.data = candlesticks;
            chart.indicatorsData = indicators;
            chart.lastUpdate = Date.now();
            
        } catch (error) {
            console.error('Error loading chart data:', error);
        }
    }
    
    // ===== CHART RENDERING =====
    
    /**
     * Render a chart
     */
    renderChart(chart) {
        const { ctx, width, height, data, type, elementName } = chart;
        
        if (!ctx || !data || data.length === 0) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        this.drawBackground(ctx, width, height);
        
        // Draw grid
        this.drawGrid(ctx, width, height);
        
        // Draw chart based on type
        switch (type) {
            case ChartType.CANDLESTICK:
                this.renderCandlestick(ctx, chart);
                break;
            case ChartType.LINE:
                this.renderLine(ctx, chart);
                break;
            case ChartType.AREA:
                this.renderArea(ctx, chart);
                break;
            case ChartType.DEPTH:
                this.renderDepth(ctx, chart);
                break;
            case ChartType.TECHNICAL:
                this.renderTechnical(ctx, chart);
                break;
        }
        
        // Draw price labels
        this.drawPriceLabels(ctx, chart);
        
        // Draw time labels
        this.drawTimeLabels(ctx, chart);
        
        // Draw legend
        this.drawLegend(ctx, chart);
    }
    
    /**
     * Render candlestick chart
     */
    renderCandlestick(ctx, chart) {
        const { data, width, height } = chart;
        const candleWidth = (width - 80) / data.length;
        const padding = 40;
        
        // Find price range
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        
        data.forEach(candle => {
            minPrice = Math.min(minPrice, candle.low);
            maxPrice = Math.max(maxPrice, candle.high);
        });
        
        // Add padding to range
        const priceRange = maxPrice - minPrice;
        minPrice = Math.max(0, minPrice - priceRange * 0.05);
        maxPrice = maxPrice + priceRange * 0.05;
        
        // Scale function
        const scaleY = (price) => {
            return padding + ((maxPrice - price) / (maxPrice - minPrice)) * (height - 2 * padding);
        };
        
        // Draw each candlestick
        data.forEach((candle, index) => {
            const x = 40 + index * candleWidth;
            const openY = scaleY(candle.open);
            const closeY = scaleY(candle.close);
            const highY = scaleY(candle.high);
            const lowY = scaleY(candle.low);
            
            const isUp = candle.close >= candle.open;
            const color = isUp ? CHART_CONFIG.colors.candleUp : CHART_CONFIG.colors.candleDown;
            
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 1;
            
            // Draw wick (high-low line)
            ctx.beginPath();
            ctx.moveTo(x + candleWidth / 2, highY);
            ctx.lineTo(x + candleWidth / 2, lowY);
            ctx.stroke();
            
            // Draw body
            const bodyTop = Math.min(openY, closeY);
            const bodyBottom = Math.max(openY, closeY);
            const bodyHeight = bodyBottom - bodyTop;
            
            if (isUp) {
                ctx.fillStyle = CHART_CONFIG.colors.candleUp;
                ctx.strokeStyle = CHART_CONFIG.colors.candleBorderUp;
            } else {
                ctx.fillStyle = CHART_CONFIG.colors.candleDown;
                ctx.strokeStyle = CHART_CONFIG.colors.candleBorderDown;
            }
            
            ctx.fillRect(x + 2, bodyTop, candleWidth - 4, bodyHeight);
            ctx.strokeRect(x + 2, bodyTop, candleWidth - 4, bodyHeight);
        });
        
        // Draw indicators
        if (chart.indicatorsData) {
            this.drawIndicators(ctx, chart, scaleY);
        }
        
        // Store scale for later use
        chart.scaleY = scaleY;
        chart.minPrice = minPrice;
        chart.maxPrice = maxPrice;
    }
    
    /**
     * Render line chart
     */
    renderLine(ctx, chart) {
        const { data, width, height } = chart;
        const padding = 40;
        
        // Find price range
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        
        data.forEach(candle => {
            minPrice = Math.min(minPrice, candle.low);
            maxPrice = Math.max(maxPrice, candle.high);
        });
        
        // Add padding
        const priceRange = maxPrice - minPrice;
        minPrice = Math.max(0, minPrice - priceRange * 0.05);
        maxPrice = maxPrice + priceRange * 0.05;
        
        // Scale function
        const scaleY = (price) => {
            return padding + ((maxPrice - price) / (maxPrice - minPrice)) * (height - 2 * padding);
        };
        
        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = CHART_CONFIG.colors.ma7;
        ctx.lineWidth = 2;
        
        data.forEach((candle, index) => {
            const x = 40 + (index * (width - 80) / (data.length - 1));
            const y = scaleY(candle.close);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Fill area if needed
        if (chart.type === ChartType.AREA) {
            ctx.lineTo(40 + (width - 80), scaleY(minPrice));
            ctx.lineTo(40, scaleY(minPrice));
            ctx.closePath();
            ctx.fillStyle = 'rgba(240, 185, 11, 0.1)';
            ctx.fill();
        }
    }
    
    /**
     * Render depth chart
     */
    renderDepth(ctx, chart) {
        const { elementName, width, height } = chart;
        const padding = 40;
        
        // Get market depth
        const depth = marketData.getMarketDepth(elementName);
        const currentPrice = marketData.getCurrentPrice(elementName);
        
        // Combine all points for range calculation
        const allPrices = [
            ...depth.bids.map(b => b.price),
            ...depth.asks.map(a => a.price),
            currentPrice
        ];
        
        const minPrice = Math.min(...allPrices) * 0.95;
        const maxPrice = Math.max(...allPrices) * 1.05;
        const maxCumulative = Math.max(
            ...depth.bids.map(b => b.cumulative),
            ...depth.asks.map(a => a.cumulative)
        );
        
        // Scale functions
        const scaleX = (price) => {
            return 40 + ((price - minPrice) / (maxPrice - minPrice)) * (width - 80);
        };
        
        const scaleY = (cumulative) => {
            return height - 40 - (cumulative / maxCumulative) * (height - 80);
        };
        
        // Draw bid area
        ctx.beginPath();
        ctx.moveTo(scaleX(minPrice), height - 40);
        
        depth.bids.forEach(bid => {
            ctx.lineTo(scaleX(bid.price), scaleY(bid.cumulative));
        });
        
        ctx.lineTo(scaleX(currentPrice), scaleY(depth.bids[depth.bids.length - 1]?.cumulative || 0));
        ctx.lineTo(scaleX(minPrice), height - 40);
        ctx.closePath();
        ctx.fillStyle = 'rgba(14, 203, 129, 0.2)';
        ctx.fill();
        ctx.strokeStyle = CHART_CONFIG.colors.bidColor;
        ctx.stroke();
        
        // Draw ask area
        ctx.beginPath();
        ctx.moveTo(scaleX(maxPrice), height - 40);
        
        depth.asks.forEach(ask => {
            ctx.lineTo(scaleX(ask.price), scaleY(ask.cumulative));
        });
        
        ctx.lineTo(scaleX(currentPrice), scaleY(depth.asks[0]?.cumulative || 0));
        ctx.lineTo(scaleX(maxPrice), height - 40);
        ctx.closePath();
        ctx.fillStyle = 'rgba(246, 70, 93, 0.2)';
        ctx.fill();
        ctx.strokeStyle = CHART_CONFIG.colors.askColor;
        ctx.stroke();
        
        // Draw current price line
        ctx.beginPath();
        ctx.strokeStyle = CHART_CONFIG.colors.midPrice;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(scaleX(currentPrice), 40);
        ctx.lineTo(scaleX(currentPrice), height - 40);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw price label
        ctx.font = 'bold 12px Inter';
        ctx.fillStyle = CHART_CONFIG.colors.midPrice;
        ctx.fillText(`${currentPrice} ⭐`, scaleX(currentPrice) + 10, 30);
    }
    
    /**
     * Render technical indicators
     */
    renderTechnical(ctx, chart) {
        // This would render separate indicator panels
        // For now, draw a simple placeholder
        const { width, height } = chart;
        
        ctx.font = '14px Inter';
        ctx.fillStyle = CHART_CONFIG.colors.text;
        ctx.textAlign = 'center';
        ctx.fillText('Technical Indicators', width / 2, height / 2);
    }
    
    /**
     * Draw chart background
     */
    drawBackground(ctx, width, height) {
        ctx.fillStyle = CHART_CONFIG.colors.background;
        ctx.fillRect(0, 0, width, height);
    }
    
    /**
     * Draw grid lines
     */
    drawGrid(ctx, width, height) {
        const padding = 40;
        
        ctx.strokeStyle = CHART_CONFIG.colors.grid;
        ctx.lineWidth = 0.5;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i * (height - 2 * padding) / 5);
            
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = padding + (i * (width - 2 * padding) / 10);
            
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
    }
    
    /**
     * Draw price labels
     */
    drawPriceLabels(ctx, chart) {
        const { minPrice, maxPrice, height } = chart;
        const padding = 40;
        
        ctx.font = '11px Roboto Mono';
        ctx.fillStyle = CHART_CONFIG.colors.text;
        ctx.textAlign = 'right';
        
        for (let i = 0; i <= 5; i++) {
            const price = maxPrice - (i * (maxPrice - minPrice) / 5);
            const y = padding + (i * (height - 2 * padding) / 5);
            
            ctx.fillText(Math.round(price).toLocaleString(), padding - 10, y + 4);
        }
    }
    
    /**
     * Draw time labels
     */
    drawTimeLabels(ctx, chart) {
        const { data, width } = chart;
        const padding = 40;
        
        ctx.font = '11px Inter';
        ctx.fillStyle = CHART_CONFIG.colors.text;
        ctx.textAlign = 'center';
        
        const labelCount = 5;
        for (let i = 0; i <= labelCount; i++) {
            const index = Math.floor(i * (data.length - 1) / labelCount);
            const x = padding + (index * (width - 2 * padding) / (data.length - 1));
            
            // Format time based on timeframe
            const date = new Date(data[index]?.timestamp || Date.now());
            const timeLabel = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            ctx.fillText(timeLabel, x, height - 15);
        }
    }
    
    /**
     * Draw legend
     */
    drawLegend(ctx, chart) {
        const { elementName, type, indicators } = chart;
        const x = 60;
        let y = 20;
        
        ctx.font = 'bold 12px Inter';
        ctx.fillStyle = '#EAECEF';
        ctx.textAlign = 'left';
        ctx.fillText(`${elementName} - ${type.toUpperCase()}`, x, y);
        
        y += 20;
        ctx.font = '11px Inter';
        ctx.fillStyle = CHART_CONFIG.colors.text;
        
        if (indicators && indicators.length > 0) {
            ctx.fillText(`Indicators: ${indicators.join(', ')}`, x, y);
        }
    }
    
    /**
     * Draw indicators on chart
     */
    drawIndicators(ctx, chart, scaleY) {
        const { indicatorsData, data, width } = chart;
        
        if (!indicatorsData) return;
        
        // Draw SMA
        if (indicatorsData.sma7) {
            ctx.beginPath();
            ctx.strokeStyle = CHART_CONFIG.colors.ma7;
            ctx.lineWidth = 1.5;
            
            indicatorsData.sma7.forEach((value, index) => {
                if (value === null) return;
                
                const x = 40 + (index * (width - 80) / (data.length - 1));
                const y = scaleY(value);
                
                if (index === 0 || indicatorsData.sma7[index - 1] === null) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        }
        
        if (indicatorsData.sma25) {
            ctx.beginPath();
            ctx.strokeStyle = CHART_CONFIG.colors.ma25;
            ctx.lineWidth = 1.5;
            
            indicatorsData.sma25.forEach((value, index) => {
                if (value === null) return;
                
                const x = 40 + (index * (width - 80) / (data.length - 1));
                const y = scaleY(value);
                
                if (index === 0 || indicatorsData.sma25[index - 1] === null) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        }
    }
    
    // ===== INDICATOR CALCULATIONS =====
    
    /**
     * Calculate technical indicators
     */
    calculateIndicators(candlesticks, indicators) {
        const result = {};
        
        if (indicators.includes(Indicators.SMA)) {
            result.sma7 = this.calculateSMA(candlesticks, 7);
            result.sma25 = this.calculateSMA(candlesticks, 25);
            result.sma99 = this.calculateSMA(candlesticks, 99);
        }
        
        if (indicators.includes(Indicators.EMA)) {
            result.ema12 = this.calculateEMA(candlesticks, 12);
            result.ema26 = this.calculateEMA(candlesticks, 26);
        }
        
        if (indicators.includes(Indicators.RSI)) {
            result.rsi = this.calculateRSI(candlesticks, 14);
        }
        
        if (indicators.includes(Indicators.MACD)) {
            const macd = this.calculateMACD(candlesticks);
            result.macd = macd.macd;
            result.signal = macd.signal;
            result.histogram = macd.histogram;
        }
        
        if (indicators.includes(Indicators.BOLLINGER)) {
            const bb = this.calculateBollingerBands(candlesticks, 20);
            result.bbUpper = bb.upper;
            result.bbMiddle = bb.middle;
            result.bbLower = bb.lower;
        }
        
        if (indicators.includes(Indicators.VOLUME)) {
            result.volume = candlesticks.map(c => c.volume);
        }
        
        return result;
    }
    
    /**
     * Calculate Simple Moving Average
     */
    calculateSMA(candlesticks, period) {
        const sma = [];
        
        for (let i = 0; i < candlesticks.length; i++) {
            if (i < period - 1) {
                sma.push(null);
                continue;
            }
            
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += candlesticks[i - j].close;
            }
            sma.push(sum / period);
        }
        
        return sma;
    }
    
    /**
     * Calculate Exponential Moving Average
     */
    calculateEMA(candlesticks, period) {
        const ema = [];
        const multiplier = 2 / (period + 1);
        
        for (let i = 0; i < candlesticks.length; i++) {
            if (i === 0) {
                ema.push(candlesticks[i].close);
            } else if (i < period) {
                // Simple average for first period
                let sum = 0;
                for (let j = 0; j <= i; j++) {
                    sum += candlesticks[j].close;
                }
                ema.push(sum / (i + 1));
            } else {
                const value = (candlesticks[i].close - ema[i - 1]) * multiplier + ema[i - 1];
                ema.push(value);
            }
        }
        
        return ema;
    }
    
    /**
     * Calculate RSI (Relative Strength Index)
     */
    calculateRSI(candlesticks, period) {
        const rsi = [];
        const gains = [];
        const losses = [];
        
        // Calculate price changes
        for (let i = 1; i < candlesticks.length; i++) {
            const change = candlesticks[i].close - candlesticks[i - 1].close;
            gains.push(Math.max(0, change));
            losses.push(Math.max(0, -change));
        }
        
        // Calculate RSI
        for (let i = 0; i < candlesticks.length; i++) {
            if (i < period) {
                rsi.push(null);
                continue;
            }
            
            let avgGain = 0;
            let avgLoss = 0;
            
            for (let j = 0; j < period; j++) {
                avgGain += gains[i - period + j];
                avgLoss += losses[i - period + j];
            }
            
            avgGain /= period;
            avgLoss /= period;
            
            if (avgLoss === 0) {
                rsi.push(100);
            } else {
                const rs = avgGain / avgLoss;
                rsi.push(100 - (100 / (1 + rs)));
            }
        }
        
        return rsi;
    }
    
    /**
     * Calculate MACD
     */
    calculateMACD(candlesticks) {
        const ema12 = this.calculateEMA(candlesticks, 12);
        const ema26 = this.calculateEMA(candlesticks, 26);
        
        const macd = [];
        const signal = [];
        const histogram = [];
        
        // Calculate MACD line
        for (let i = 0; i < candlesticks.length; i++) {
            if (ema12[i] === null || ema26[i] === null) {
                macd.push(null);
            } else {
                macd.push(ema12[i] - ema26[i]);
            }
        }
        
        // Calculate signal line (9-period EMA of MACD)
        const signalPeriod = 9;
        for (let i = 0; i < candlesticks.length; i++) {
            if (i < signalPeriod - 1 || macd[i] === null) {
                signal.push(null);
                histogram.push(null);
                continue;
            }
            
            let sum = 0;
            for (let j = 0; j < signalPeriod; j++) {
                sum += macd[i - j];
            }
            const sig = sum / signalPeriod;
            signal.push(sig);
            histogram.push(macd[i] - sig);
        }
        
        return { macd, signal, histogram };
    }
    
    /**
     * Calculate Bollinger Bands
     */
    calculateBollingerBands(candlesticks, period, multiplier = 2) {
        const middle = this.calculateSMA(candlesticks, period);
        const upper = [];
        const lower = [];
        
        for (let i = 0; i < candlesticks.length; i++) {
            if (middle[i] === null) {
                upper.push(null);
                lower.push(null);
                continue;
            }
            
            // Calculate standard deviation
            let sum = 0;
            for (let j = 0; j < period; j++) {
                if (i - j >= 0) {
                    sum += Math.pow(candlesticks[i - j].close - middle[i], 2);
                }
            }
            const stdDev = Math.sqrt(sum / period);
            
            upper.push(middle[i] + multiplier * stdDev);
            lower.push(middle[i] - multiplier * stdDev);
        }
        
        return { upper, middle, lower };
    }
    
    // ===== CHART ANIMATION =====
    
    /**
     * Start chart animation loop
     */
    startChartAnimation(chart) {
        const animate = () => {
            this.renderChart(chart);
            chart.animationFrame = requestAnimationFrame(animate);
        };
        
        chart.animationFrame = requestAnimationFrame(animate);
    }
    
    /**
     * Update chart data
     */
    updateChartData(elementName) {
        const chart = this.charts.get(elementName);
        if (!chart) return;
        
        this.loadChartData(chart);
    }
    
    /**
     * Change chart type
     */
    setChartType(elementName, type) {
        const chart = this.charts.get(elementName);
        if (!chart) return;
        
        chart.type = type;
        this.loadChartData(chart);
    }
    
    /**
     * Change timeframe
     */
    setTimeframe(elementName, timeframe) {
        const chart = this.charts.get(elementName);
        if (!chart) return;
        
        chart.timeframe = timeframe;
        this.loadChartData(chart);
    }
    
    /**
     * Toggle indicator
     */
    toggleIndicator(elementName, indicator) {
        const chart = this.charts.get(elementName);
        if (!chart) return;
        
        const index = chart.indicators.indexOf(indicator);
        if (index === -1) {
            chart.indicators.push(indicator);
        } else {
            chart.indicators.splice(index, 1);
        }
        
        this.loadChartData(chart);
    }
    
    /**
     * Destroy chart
     */
    destroyChart(elementName) {
        const chart = this.charts.get(elementName);
        if (chart) {
            if (chart.animationFrame) {
                cancelAnimationFrame(chart.animationFrame);
            }
            this.charts.delete(elementName);
        }
    }
    
    /**
     * Resize chart
     */
    resizeChart(elementName, width, height) {
        const chart = this.charts.get(elementName);
        if (!chart) return;
        
        chart.width = width;
        chart.height = height;
        chart.canvas.width = width;
        chart.canvas.height = height;
    }
}

// ===== CHART UI HELPER FUNCTIONS =====

/**
 * Format price for chart display
 */
export function formatChartPrice(price, precision = 2) {
    if (price >= 1000) {
        return (price / 1000).toFixed(1) + 'K';
    }
    return price.toFixed(precision);
}

/**
 * Get color for price change
 */
export function getPriceChangeColor(change) {
    if (change > 0) return CHART_CONFIG.colors.candleUp;
    if (change < 0) return CHART_CONFIG.colors.candleDown;
    return CHART_CONFIG.colors.text;
}

/**
 * Create chart toolbar HTML
 */
export function createChartToolbar(elementName, currentType = ChartType.CANDLESTICK) {
    return `
        <div class="chart-toolbar">
            <div class="chart-type-selector">
                <button class="chart-type-btn ${currentType === ChartType.CANDLESTICK ? 'active' : ''}" 
                        onclick="chartManager.setChartType('${elementName}', '${ChartType.CANDLESTICK}')">
                    📊 Candlestick
                </button>
                <button class="chart-type-btn ${currentType === ChartType.LINE ? 'active' : ''}" 
                        onclick="chartManager.setChartType('${elementName}', '${ChartType.LINE}')">
                    📈 Line
                </button>
                <button class="chart-type-btn ${currentType === ChartType.DEPTH ? 'active' : ''}" 
                        onclick="chartManager.setChartType('${elementName}', '${ChartType.DEPTH}')">
                    📉 Depth
                </button>
            </div>
            
            <div class="timeframe-selector">
                <button class="timeframe-btn" onclick="chartManager.setTimeframe('${elementName}', '1m')">1m</button>
                <button class="timeframe-btn" onclick="chartManager.setTimeframe('${elementName}', '5m')">5m</button>
                <button class="timeframe-btn" onclick="chartManager.setTimeframe('${elementName}', '15m')">15m</button>
                <button class="timeframe-btn active" onclick="chartManager.setTimeframe('${elementName}', '1h')">1h</button>
                <button class="timeframe-btn" onclick="chartManager.setTimeframe('${elementName}', '4h')">4h</button>
                <button class="timeframe-btn" onclick="chartManager.setTimeframe('${elementName}', '1d')">1d</button>
                <button class="timeframe-btn" onclick="chartManager.setTimeframe('${elementName}', '1w')">1w</button>
            </div>
            
            <div class="indicator-selector">
                <button class="indicator-btn" onclick="chartManager.toggleIndicator('${elementName}', '${Indicators.SMA}')">
                    SMA
                </button>
                <button class="indicator-btn" onclick="chartManager.toggleIndicator('${elementName}', '${Indicators.EMA}')">
                    EMA
                </button>
                <button class="indicator-btn" onclick="chartManager.toggleIndicator('${elementName}', '${Indicators.RSI}')">
                    RSI
                </button>
                <button class="indicator-btn" onclick="chartManager.toggleIndicator('${elementName}', '${Indicators.MACD}')">
                    MACD
                </button>
                <button class="indicator-btn" onclick="chartManager.toggleIndicator('${elementName}', '${Indicators.BOLLINGER}')">
                    Bollinger
                </button>
            </div>
        </div>
    `;
}

// ===== EXPORT SINGLETON INSTANCE =====
export const chartManager = new ChartManager();

// ===== DEFAULT EXPORT =====
export default chartManager;

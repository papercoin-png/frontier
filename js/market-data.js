// js/market-data.js - Professional Market Simulation Engine
// Creates realistic price movements, volatility, and market dynamics

import { ELEMENTS, getElementByName, getElementRarity } from './elements-data.js';

// ===== MARKET CONFIGURATION =====
const MARKET_CONFIG = {
    // Volatility by rarity (daily price swing potential)
    volatility: {
        'common': 0.02,      // 2% daily movement
        'uncommon': 0.04,     // 4% daily movement
        'rare': 0.08,         // 8% daily movement
        'very-rare': 0.15,    // 15% daily movement
        'legendary': 0.25     // 25% daily movement
    },
    
    // Base trading volume by rarity
    baseVolume: {
        'common': 10000,
        'uncommon': 5000,
        'rare': 2000,
        'very-rare': 500,
        'legendary': 100
    },
    
    // Price history length (number of data points)
    historyLength: 500,
    
    // Update interval in milliseconds (simulated)
    updateInterval: 5000, // 5 seconds
    
    // Market hours (always open in space!)
    marketOpen: true
};

// ===== ELEMENT CORRELATIONS =====
// Elements that tend to move together
const ELEMENT_CORRELATIONS = {
    // Precious metals group
    'Gold': { correlated: ['Silver', 'Platinum', 'Palladium'], strength: 0.85 },
    'Silver': { correlated: ['Gold', 'Platinum', 'Copper'], strength: 0.82 },
    'Platinum': { correlated: ['Gold', 'Silver', 'Palladium'], strength: 0.88 },
    'Palladium': { correlated: ['Platinum', 'Gold'], strength: 0.80 },
    
    // Base metals group
    'Iron': { correlated: ['Nickel', 'Copper', 'Steel'], strength: 0.90 },
    'Nickel': { correlated: ['Iron', 'Copper', 'Cobalt'], strength: 0.87 },
    'Copper': { correlated: ['Iron', 'Nickel', 'Zinc'], strength: 0.85 },
    'Zinc': { correlated: ['Copper', 'Lead'], strength: 0.78 },
    'Lead': { correlated: ['Zinc', 'Silver'], strength: 0.75 },
    
    // Rare earth group
    'Neodymium': { correlated: ['Praseodymium', 'Dysprosium'], strength: 0.92 },
    'Praseodymium': { correlated: ['Neodymium', 'Lanthanum'], strength: 0.90 },
    'Dysprosium': { correlated: ['Neodymium', 'Terbium'], strength: 0.89 },
    'Terbium': { correlated: ['Dysprosium', 'Europium'], strength: 0.86 },
    
    // Nuclear materials group
    'Uranium': { correlated: ['Plutonium', 'Thorium'], strength: 0.95 },
    'Plutonium': { correlated: ['Uranium', 'Neptunium'], strength: 0.94 },
    'Thorium': { correlated: ['Uranium', 'Radium'], strength: 0.88 },
    
    // Fuel elements group
    'Hydrogen': { correlated: ['Helium', 'Deuterium'], strength: 0.80 },
    'Helium': { correlated: ['Hydrogen', 'Neon'], strength: 0.75 },
    
    // Semiconductor group
    'Silicon': { correlated: ['Germanium', 'Gallium'], strength: 0.91 },
    'Germanium': { correlated: ['Silicon', 'Gallium'], strength: 0.89 },
    'Gallium': { correlated: ['Silicon', 'Arsenic'], strength: 0.87 }
};

// ===== MARKET EVENT TYPES =====
const MARKET_EVENTS = [
    {
        name: 'New Discovery',
        rarity: 'legendary',
        impact: 0.25, // 25% price drop
        message: 'Massive {element} deposit discovered! Prices plummeting!'
    },
    {
        name: 'Mining Accident',
        rarity: 'rare',
        impact: 0.20, // 20% price spike
        message: 'Mining accident on {planet}! {element} supply disrupted!'
    },
    {
        name: 'Industrial Demand',
        rarity: 'uncommon',
        impact: 0.12, // 12% price increase
        message: 'Industrial demand for {element} surges!'
    },
    {
        name: 'Market Manipulation',
        rarity: 'very-rare',
        impact: 0.30, // 30% price swing
        message: 'Whale manipulating {element} market! Volatility extreme!'
    },
    {
        name: 'Trade Embargo',
        rarity: 'rare',
        impact: 0.18, // 18% price change
        message: 'Trade embargo affects {element} shipping lanes!'
    },
    {
        name: 'Technological Breakthrough',
        rarity: 'legendary',
        impact: 0.40, // 40% price spike
        message: 'New tech requires massive {element} quantities! Price skyrocketing!'
    },
    {
        name: 'Pirate Attack',
        rarity: 'uncommon',
        impact: 0.15, // 15% price spike
        message: 'Pirate attack on {element} convoy! Supply tight!'
    }
];

// ===== MARKET DATA CLASS =====
export class MarketData {
    constructor() {
        this.prices = {};           // Current prices
        this.priceHistory = {};      // Historical prices for charts
        self.dailyChange = {};       // 24h percentage change
        self.volume24h = {};         // 24h trading volume
        self.volatility = {};        // Current volatility per element
        self.marketEvents = [];       // Active market events
        self.lastUpdate = Date.now();
        self.trends = {};            // Price trends (bullish/bearish)
        self.support = {};           // Support levels
        self.resistance = {};        // Resistance levels
        
        // Initialize all elements
        this.initializeMarket();
        
        // Start market simulation
        this.startMarketSimulation();
    }
    
    // ===== INITIALIZATION =====
    initializeMarket() {
        console.log('📊 Initializing market data for', ELEMENTS.length, 'elements');
        
        ELEMENTS.forEach(element => {
            const name = element.name;
            const rarity = element.rarity;
            const basePrice = element.value;
            
            // Set initial prices with slight randomization
            const randomFactor = 0.95 + (Math.random() * 0.1); // 0.95 to 1.05
            this.prices[name] = Math.round(basePrice * randomFactor);
            
            // Initialize price history
            this.priceHistory[name] = [];
            for (let i = 0; i < 100; i++) {
                this.priceHistory[name].push(this.generateHistoricalPrice(basePrice, i));
            }
            
            // Initialize other metrics
            self.dailyChange[name] = (Math.random() * 10 - 5).toFixed(1); // -5% to +5%
            self.volume24h[name] = Math.floor(Math.random() * MARKET_CONFIG.baseVolume[rarity] * (0.5 + Math.random()));
            self.volatility[name] = MARKET_CONFIG.volatility[rarity];
            self.trends[name] = Math.random() > 0.5 ? 'bullish' : 'bearish';
            
            // Set support/resistance
            this.support[name] = Math.round(basePrice * 0.85);
            this.resistance[name] = Math.round(basePrice * 1.15);
        });
    }
    
    // Generate realistic historical price for charts
    generateHistoricalPrice(basePrice, index) {
        // Create a wave pattern with trend
        const wave1 = Math.sin(index / 10) * (basePrice * 0.05);
        const wave2 = Math.cos(index / 7) * (basePrice * 0.03);
        const trend = (index / 100) * (basePrice * 0.1); // Slight upward trend
        const noise = (Math.random() - 0.5) * (basePrice * 0.02);
        
        return Math.round(basePrice + wave1 + wave2 + trend + noise);
    }
    
    // ===== PRICE SIMULATION =====
    updatePrices() {
        const now = Date.now();
        const timeDiff = now - this.lastUpdate;
        const steps = Math.floor(timeDiff / MARKET_CONFIG.updateInterval);
        
        if (steps < 1) return;
        
        for (let step = 0; step < Math.min(steps, 5); step++) {
            this.simulatePriceStep();
        }
        
        this.lastUpdate = now;
    }
    
    simulatePriceStep() {
        ELEMENTS.forEach(element => {
            const name = element.name;
            const rarity = element.rarity;
            const currentPrice = this.prices[name];
            const volatility = self.volatility[name] / 100; // Convert to decimal
            
            // Base random walk
            let change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
            
            // Add trend bias
            if (self.trends[name] === 'bullish') {
                change += volatility * currentPrice * 0.1;
            } else if (self.trends[name] === 'bearish') {
                change -= volatility * currentPrice * 0.1;
            }
            
            // Add correlation effects from related elements
            this.applyCorrelationEffects(name, change);
            
            // Apply active market events
            this.applyMarketEvents(name, change);
            
            // Calculate new price
            let newPrice = currentPrice + change;
            
            // Ensure price stays within reasonable bounds
            newPrice = Math.max(newPrice, this.support[name] * 0.8);
            newPrice = Math.min(newPrice, this.resistance[name] * 1.2);
            
            // Update price
            this.prices[name] = Math.round(newPrice);
            
            // Update price history
            this.priceHistory[name].push(this.prices[name]);
            if (this.priceHistory[name].length > MARKET_CONFIG.historyLength) {
                this.priceHistory[name].shift();
            }
            
            // Recalculate daily change
            const oldPrice = this.priceHistory[name][0] || this.prices[name];
            self.dailyChange[name] = ((this.prices[name] - oldPrice) / oldPrice * 100).toFixed(1);
            
            // Update volume (gradual decay + random new orders)
            self.volume24h[name] = Math.max(100, self.volume24h[name] * 0.95 + Math.random() * 100);
            
            // Occasionally flip trend
            if (Math.random() < 0.01) { // 1% chance per update
                self.trends[name] = self.trends[name] === 'bullish' ? 'bearish' : 'bullish';
            }
            
            // Occasionally adjust support/resistance
            if (Math.random() < 0.05) { // 5% chance
                this.support[name] = Math.round(this.prices[name] * (0.8 + Math.random() * 0.1));
                this.resistance[name] = Math.round(this.prices[name] * (1.1 + Math.random() * 0.1));
            }
        });
    }
    
    // Apply price correlation between related elements
    applyCorrelationEffects(elementName, change) {
        const correlation = ELEMENT_CORRELATIONS[elementName];
        if (!correlation) return;
        
        correlation.correlated.forEach(relatedName => {
            const relatedElement = getElementByName(relatedName);
            if (relatedElement && this.prices[relatedName]) {
                // If correlated element moved, this one moves slightly too
                const relatedPrice = this.prices[relatedName];
                const relatedChange = (relatedPrice - (this.priceHistory[relatedName]?.slice(-2)[0] || relatedPrice)) / relatedPrice;
                
                // Apply with correlation strength
                change += relatedChange * this.prices[elementName] * correlation.strength * 0.3;
            }
        });
    }
    
    // Apply active market events
    applyMarketEvents(elementName, change) {
        this.marketEvents.forEach(event => {
            if (event.element === elementName) {
                // Event still active
                const eventMultiplier = event.impact * (1 - (Date.now() - event.startTime) / event.duration);
                change += this.prices[elementName] * eventMultiplier * (Math.random() * 0.5);
            }
        });
        
        // Clean up expired events
        this.marketEvents = this.marketEvents.filter(event => 
            Date.now() - event.startTime < event.duration
        );
    }
    
    // ===== MARKET EVENTS =====
    triggerMarketEvent(elementName) {
        const element = getElementByName(elementName);
        if (!element) return;
        
        const eventType = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
        const impact = eventType.impact * (element.rarity === 'legendary' ? 1.5 : 1);
        
        const event = {
            name: eventType.name,
            element: elementName,
            impact: impact,
            message: eventType.message
                .replace('{element}', elementName)
                .replace('{planet}', this.getRandomPlanet()),
            startTime: Date.now(),
            duration: 30 * 60 * 1000, // 30 minutes
            priceChange: 0
        };
        
        // Determine direction (up or down)
        const direction = Math.random() > 0.5 ? 1 : -1;
        event.priceChange = direction * impact * this.prices[elementName];
        
        this.marketEvents.push(event);
        
        console.log('📢 MARKET EVENT:', event.message);
        return event;
    }
    
    getRandomPlanet() {
        const planets = ['Pyros', 'Verdant Prime', 'Glacier-7', 'Aether', 'Nyx', 'Oblivion', 'Elysium'];
        return planets[Math.floor(Math.random() * planets.length)];
    }
    
    // ===== DATA ACCESS METHODS =====
    getCurrentPrice(elementName) {
        this.updatePrices();
        return this.prices[elementName] || 0;
    }
    
    getPriceHistory(elementName, limit = 100) {
        const history = this.priceHistory[elementName] || [];
        return history.slice(-limit);
    }
    
    getDailyChange(elementName) {
        return parseFloat(self.dailyChange[elementName] || 0);
    }
    
    getVolume24h(elementName) {
        return Math.round(self.volume24h[elementName] || 0);
    }
    
    getMarketDepth(elementName) {
        // Simulate order book depth
        const price = this.getCurrentPrice(elementName);
        const depth = {
            bids: [], // Buy orders
            asks: []  // Sell orders
        };
        
        // Generate realistic order book
        for (let i = 1; i <= 10; i++) {
            // Bids (lower prices)
            const bidPrice = price * (1 - i * 0.01);
            const bidSize = Math.floor(Math.random() * 100 * (11 - i));
            depth.bids.push({ price: Math.round(bidPrice), size: bidSize });
            
            // Asks (higher prices)
            const askPrice = price * (1 + i * 0.01);
            const askSize = Math.floor(Math.random() * 100 * (11 - i));
            depth.asks.push({ price: Math.round(askPrice), size: askSize });
        }
        
        return depth;
    }
    
    getSpread(elementName) {
        const price = this.getCurrentPrice(elementName);
        // Spread widens with rarity
        const element = getElementByName(elementName);
        const spreadPercent = element.rarity === 'common' ? 0.005 : // 0.5%
                             element.rarity === 'uncommon' ? 0.01 : // 1%
                             element.rarity === 'rare' ? 0.02 :     // 2%
                             element.rarity === 'very-rare' ? 0.03 : // 3%
                             0.05; // 5% for legendary
        
        return Math.round(price * spreadPercent);
    }
    
    getMarketStatistics() {
        let totalVolume = 0;
        let avgChange = 0;
        let gainers = [];
        let losers = [];
        
        ELEMENTS.forEach(element => {
            const name = element.name;
            totalVolume += self.volume24h[name] || 0;
            avgChange += Math.abs(this.getDailyChange(name));
            
            if (this.getDailyChange(name) > 0) {
                gainers.push({ name, change: this.getDailyChange(name) });
            } else {
                losers.push({ name, change: this.getDailyChange(name) });
            }
        });
        
        avgChange = (avgChange / ELEMENTS.length).toFixed(1);
        
        // Sort gainers and losers
        gainers.sort((a, b) => b.change - a.change);
        losers.sort((a, b) => a.change - b.change);
        
        return {
            totalVolume: Math.round(totalVolume),
            avgChange: parseFloat(avgChange),
            topGainer: gainers[0] || null,
            topLoser: losers[0] || null,
            marketCap: this.calculateMarketCap(),
            activeEvents: this.marketEvents.length
        };
    }
    
    calculateMarketCap() {
        let total = 0;
        ELEMENTS.forEach(element => {
            total += this.prices[element.name] || element.value;
        });
        return Math.round(total);
    }
    
    // ===== CHART DATA =====
    getCandlestickData(elementName, timeframe = '1h') {
        const history = this.getPriceHistory(elementName, 100);
        const candlesticks = [];
        
        // Group history into candles based on timeframe
        const groupSize = timeframe === '1h' ? 12 : // 5-min intervals
                         timeframe === '4h' ? 48 :
                         timeframe === '1d' ? 24 : 12;
        
        for (let i = 0; i < history.length; i += groupSize) {
            const slice = history.slice(i, i + groupSize);
            if (slice.length === 0) continue;
            
            candlesticks.push({
                open: slice[0],
                high: Math.max(...slice),
                low: Math.min(...slice),
                close: slice[slice.length - 1],
                volume: Math.floor(Math.random() * 1000)
            });
        }
        
        return candlesticks;
    }
    
    // ===== MARKET SIMULATION CONTROL =====
    startMarketSimulation() {
        console.log('📈 Market simulation started');
        
        // Update prices every 5 seconds
        setInterval(() => {
            this.updatePrices();
            
            // Occasionally trigger random market events
            if (Math.random() < 0.01) { // 1% chance every 5 seconds
                const randomElement = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
                this.triggerMarketEvent(randomElement.name);
            }
            
            // Dispatch update event for UI
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('market-update', {
                    detail: { timestamp: Date.now() }
                }));
            }
        }, MARKET_CONFIG.updateInterval);
    }
    
    // Get element for trading pair
    getElementPair(elementName) {
        const element = getElementByName(elementName);
        if (!element) return null;
        
        return {
            symbol: element.symbol,
            name: element.name,
            price: this.getCurrentPrice(elementName),
            change: this.getDailyChange(elementName),
            volume: this.getVolume24h(elementName),
            high24h: Math.max(...this.priceHistory[elementName].slice(-12)),
            low24h: Math.min(...this.priceHistory[elementName].slice(-12)),
            spread: this.getSpread(elementName),
            trend: self.trends[elementName] || 'neutral',
            support: this.support[elementName],
            resistance: this.resistance[elementName],
            volatility: self.volatility[elementName] * 100 + '%'
        };
    }
}

// ===== EXPORT SINGLETON INSTANCE =====
export const marketData = new MarketData();

// ===== HELPER FUNCTIONS FOR UI =====
export function formatPrice(price) {
    return price.toLocaleString() + ' ⭐';
}

export function formatChange(change) {
    const sign = change > 0 ? '+' : '';
    return sign + change.toFixed(1) + '%';
}

export function formatVolume(volume) {
    if (volume > 1000000) return (volume / 1000000).toFixed(1) + 'M';
    if (volume > 1000) return (volume / 1000).toFixed(1) + 'K';
    return volume.toString();
}

export function getChangeClass(change) {
    return change >= 0 ? 'positive' : 'negative';
}

// ===== DEFAULT EXPORT =====
export default marketData;

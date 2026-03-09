// voidfarer.js - Shared JavaScript for all Voidfarer game screens

// ===== TELEGRAM INITIALIZATION =====
const tg = window.Telegram?.WebApp;

// Initialize Telegram Mini App
function initTelegram() {
    if (tg) {
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#0a1a2a');
        tg.setBackgroundColor('#0a1a2a');
    }
}

// ===== HAPTIC FEEDBACK =====
function hapticLight() {
    if (tg?.HapticFeedback) {
        const haptics = localStorage.getItem('voidfarer_haptics') !== 'false';
        if (haptics) tg.HapticFeedback.impactOccurred('light');
    }
}

function hapticMedium() {
    if (tg?.HapticFeedback) {
        const haptics = localStorage.getItem('voidfarer_haptics') !== 'false';
        if (haptics) tg.HapticFeedback.impactOccurred('medium');
    }
}

function hapticHeavy() {
    if (tg?.HapticFeedback) {
        const haptics = localStorage.getItem('voidfarer_haptics') !== 'false';
        if (haptics) tg.HapticFeedback.impactOccurred('heavy');
    }
}

function hapticSuccess() {
    if (tg?.HapticFeedback) {
        const haptics = localStorage.getItem('voidfarer_haptics') !== 'false';
        if (haptics) tg.HapticFeedback.notificationOccurred('success');
    }
}

function hapticError() {
    if (tg?.HapticFeedback) {
        const haptics = localStorage.getItem('voidfarer_haptics') !== 'false';
        if (haptics) tg.HapticFeedback.notificationOccurred('error');
    }
}

// ===== NAVIGATION =====
const loadingOverlay = document.getElementById('loadingOverlay');

function navigateTo(screen, useWarp = false) {
    hapticLight();
    
    if (useWarp) {
        // Set warp destination and redirect
        const destination = screen.replace('.html', '');
        localStorage.setItem('voidfarer_warp_destination', destination);
        localStorage.setItem('voidfarer_warp_redirect', screen);
        
        // Show loading overlay
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
            setTimeout(() => {
                window.location.href = 'warp.html';
            }, 300);
        } else {
            window.location.href = 'warp.html';
        }
    } else {
        window.location.href = screen;
    }
}

function goBack() {
    hapticLight();
    window.history.back();
}

// ===== PLAYER DATA MANAGEMENT =====
function getPlayer() {
    const player = localStorage.getItem('voidfarer_player');
    return player ? JSON.parse(player) : null;
}

function savePlayer(playerData) {
    localStorage.setItem('voidfarer_player', JSON.stringify(playerData));
}

function getCollection() {
    const collection = localStorage.getItem('voidfarer_collection');
    return collection ? JSON.parse(collection) : {};
}

function saveCollection(collection) {
    localStorage.setItem('voidfarer_collection', JSON.stringify(collection));
}

function getCredits() {
    return parseInt(localStorage.getItem('voidfarer_credits')) || 12450;
}

function saveCredits(credits) {
    localStorage.setItem('voidfarer_credits', credits.toString());
}

function addCredits(amount) {
    const current = getCredits();
    saveCredits(current + amount);
    return current + amount;
}

function getMissions() {
    const missions = localStorage.getItem('voidfarer_missions');
    return missions ? JSON.parse(missions) : [
        { element: 'Gold', current: 0, target: 50, planet: 'Pyros' },
        { element: 'Uranium', current: 0, target: 20, planet: 'Pyros-Deep' },
        { element: 'Promethium', current: 0, target: 5, planet: 'Aether-Veil' }
    ];
}

function saveMissions(missions) {
    localStorage.setItem('voidfarer_missions', JSON.stringify(missions));
}

function getCurrentPlanet() {
    return localStorage.getItem('voidfarer_current_planet') || 'Verdant Prime';
}

function setCurrentPlanet(planet) {
    localStorage.setItem('voidfarer_current_planet', planet);
}

function getShipPower() {
    return parseInt(localStorage.getItem('voidfarer_ship_power')) || 87;
}

function setShipPower(power) {
    localStorage.setItem('voidfarer_ship_power', power.toString());
}

// ===== ELEMENT COLLECTION =====
function addElementToCollection(elementName, count = 1) {
    const collection = getCollection();
    
    if (!collection[elementName]) {
        collection[elementName] = {
            firstFound: new Date().toISOString(),
            count: count
        };
    } else {
        collection[elementName].count = (collection[elementName].count || 1) + count;
    }
    
    saveCollection(collection);
    
    // Update missions
    updateMissionProgress(elementName, count);
    
    // Add credits (auto-sell)
    const elementValue = getElementValue(elementName);
    addCredits(elementValue * count);
    
    return Object.keys(collection).length;
}

function updateMissionProgress(elementName, count = 1) {
    const missions = getMissions();
    let updated = false;
    
    missions.forEach(mission => {
        if (mission.element === elementName && mission.current < mission.target) {
            mission.current = Math.min(mission.current + count, mission.target);
            updated = true;
        }
    });
    
    if (updated) {
        saveMissions(missions);
    }
}

// ===== ELEMENT DATA =====
function getElementValue(elementName) {
    const elements = {
        // Common - 100
        'Hydrogen': 100, 'Helium': 100, 'Lithium': 100, 'Beryllium': 100,
        'Boron': 100, 'Sodium': 100, 'Magnesium': 100, 'Aluminum': 100,
        'Silicon': 100, 'Potassium': 100, 'Calcium': 100,
        
        // Uncommon - 250
        'Carbon': 250, 'Oxygen': 250, 'Nitrogen': 250, 'Iron': 250,
        'Nickel': 250, 'Sulfur': 250, 'Phosphorus': 250, 'Chlorine': 250,
        'Argon': 250, 'Lead': 250,
        
        // Rare - 1000
        'Gold': 1000, 'Silver': 1000, 'Platinum': 1000, 'Copper': 1000,
        'Titanium': 1000, 'Zinc': 1000, 'Tin': 1000, 'Mercury': 1000,
        'Cobalt': 1000, 'Chromium': 1000,
        
        // Very Rare - 5000
        'Uranium': 5000, 'Thorium': 5000, 'Plutonium': 5000,
        'Radium': 5000, 'Polonium': 5000,
        
        // Legendary - 25000
        'Promethium': 25000, 'Technetium': 25000, 'Astatine': 25000, 'Francium': 25000
    };
    
    return elements[elementName] || 100;
}

function getElementRarity(elementName) {
    const rarities = {
        'Gold': 'rare', 'Silver': 'rare', 'Platinum': 'rare',
        'Uranium': 'very-rare', 'Thorium': 'very-rare', 'Plutonium': 'very-rare',
        'Promethium': 'legendary', 'Technetium': 'legendary',
        'Carbon': 'uncommon', 'Oxygen': 'uncommon', 'Iron': 'uncommon'
    };
    
    return rarities[elementName] || 'common';
}

function getElementColor(elementName) {
    const rarity = getElementRarity(elementName);
    const colors = {
        'common': '#ffffff',
        'uncommon': '#b0ffb0',
        'rare': '#b0b0ff',
        'very-rare': '#e0b0ff',
        'legendary': '#ffd700'
    };
    return colors[rarity] || '#ffffff';
}

// ===== COLLECTION STATS =====
function getCollectionStats() {
    const collection = getCollection();
    const total = Object.keys(collection).length;
    
    // Count by rarity
    const rarityCounts = {
        common: 0,
        uncommon: 0,
        rare: 0,
        'very-rare': 0,
        legendary: 0
    };
    
    Object.keys(collection).forEach(elementName => {
        const rarity = getElementRarity(elementName);
        rarityCounts[rarity] = (rarityCounts[rarity] || 0) + 1;
    });
    
    return {
        total: total,
        byRarity: rarityCounts,
        totalValue: calculateTotalValue(collection)
    };
}

function calculateTotalValue(collection) {
    let total = 0;
    Object.keys(collection).forEach(elementName => {
        const count = collection[elementName].count || 1;
        total += getElementValue(elementName) * count;
    });
    return total;
}

// ===== NEW GAME SETUP =====
function setupNewGame() {
    // Clear all existing data
    localStorage.removeItem('voidfarer_player');
    localStorage.removeItem('voidfarer_collection');
    localStorage.removeItem('voidfarer_missions');
    localStorage.removeItem('voidfarer_credits');
    localStorage.removeItem('voidfarer_current_planet');
    localStorage.removeItem('voidfarer_ship_power');
    
    // Set default values
    localStorage.setItem('voidfarer_player', JSON.stringify({
        name: 'Voidfarer',
        ship: 'Prospector',
        created: new Date().toISOString()
    }));
    
    localStorage.setItem('voidfarer_collection', JSON.stringify({}));
    localStorage.setItem('voidfarer_missions', JSON.stringify([
        { element: 'Gold', current: 0, target: 50, planet: 'Pyros' },
        { element: 'Uranium', current: 0, target: 20, planet: 'Pyros-Deep' },
        { element: 'Promethium', current: 0, target: 5, planet: 'Aether-Veil' }
    ]));
    
    localStorage.setItem('voidfarer_credits', '12450');
    localStorage.setItem('voidfarer_current_planet', 'Verdant Prime');
    localStorage.setItem('voidfarer_ship_power', '87');
    
    // Default settings
    if (!localStorage.getItem('voidfarer_haptics')) {
        localStorage.setItem('voidfarer_haptics', 'true');
    }
    if (!localStorage.getItem('voidfarer_auto_gather')) {
        localStorage.setItem('voidfarer_auto_gather', 'true');
    }
    if (!localStorage.getItem('voidfarer_orbit_speed')) {
        localStorage.setItem('voidfarer_orbit_speed', 'gentle');
    }
}

// ===== CHECK PLAYER =====
function checkPlayer() {
    const player = getPlayer();
    if (!player) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// ===== FORMATTING HELPERS =====
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// ===== INITIALIZE =====
function initVoidfarer() {
    initTelegram();
    
    // Check if this is first visit and setup default settings
    if (!localStorage.getItem('voidfarer_settings_initialized')) {
        if (!localStorage.getItem('voidfarer_haptics')) {
            localStorage.setItem('voidfarer_haptics', 'true');
        }
        if (!localStorage.getItem('voidfarer_auto_gather')) {
            localStorage.setItem('voidfarer_auto_gather', 'true');
        }
        if (!localStorage.getItem('voidfarer_orbit_speed')) {
            localStorage.setItem('voidfarer_orbit_speed', 'gentle');
        }
        if (!localStorage.getItem('voidfarer_music')) {
            localStorage.setItem('voidfarer_music', '50');
        }
        if (!localStorage.getItem('voidfarer_ambient')) {
            localStorage.setItem('voidfarer_ambient', '50');
        }
        
        localStorage.setItem('voidfarer_settings_initialized', 'true');
    }
}

// Auto-initialize when script loads
initVoidfarer();

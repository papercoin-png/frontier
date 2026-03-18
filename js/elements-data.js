// js/elements-data.js - Complete 118-element database for Voidfarer
// Static data module - no storage dependencies

export const ELEMENTS = [
    // Common (white) - 100 credits each
    { name: 'Hydrogen', symbol: 'H', atomic: 1, mass: '1.008', rarity: 'common', planets: 843, value: 100 },
    { name: 'Helium', symbol: 'He', atomic: 2, mass: '4.003', rarity: 'common', planets: 612, value: 100 },
    { name: 'Lithium', symbol: 'Li', atomic: 3, mass: '6.94', rarity: 'common', planets: 534, value: 100 },
    { name: 'Beryllium', symbol: 'Be', atomic: 4, mass: '9.012', rarity: 'common', planets: 498, value: 100 },
    { name: 'Boron', symbol: 'B', atomic: 5, mass: '10.81', rarity: 'common', planets: 467, value: 100 },
    { name: 'Sodium', symbol: 'Na', atomic: 11, mass: '22.99', rarity: 'common', planets: 423, value: 100 },
    { name: 'Magnesium', symbol: 'Mg', atomic: 12, mass: '24.31', rarity: 'common', planets: 398, value: 100 },
    { name: 'Aluminum', symbol: 'Al', atomic: 13, mass: '26.98', rarity: 'common', planets: 378, value: 100 },
    { name: 'Silicon', symbol: 'Si', atomic: 14, mass: '28.09', rarity: 'common', planets: 456, value: 100 },
    { name: 'Potassium', symbol: 'K', atomic: 19, mass: '39.10', rarity: 'common', planets: 356, value: 100 },
    { name: 'Calcium', symbol: 'Ca', atomic: 20, mass: '40.08', rarity: 'common', planets: 345, value: 100 },
    
    // Uncommon (green) - 250 credits each
    { name: 'Carbon', symbol: 'C', atomic: 6, mass: '12.01', rarity: 'uncommon', planets: 534, value: 250 },
    { name: 'Nitrogen', symbol: 'N', atomic: 7, mass: '14.01', rarity: 'uncommon', planets: 512, value: 250 },
    { name: 'Oxygen', symbol: 'O', atomic: 8, mass: '16.00', rarity: 'uncommon', planets: 498, value: 250 },
    { name: 'Fluorine', symbol: 'F', atomic: 9, mass: '19.00', rarity: 'uncommon', planets: 234, value: 250 },
    { name: 'Neon', symbol: 'Ne', atomic: 10, mass: '20.18', rarity: 'uncommon', planets: 198, value: 250 },
    { name: 'Phosphorus', symbol: 'P', atomic: 15, mass: '30.97', rarity: 'uncommon', planets: 267, value: 250 },
    { name: 'Sulfur', symbol: 'S', atomic: 16, mass: '32.06', rarity: 'uncommon', planets: 289, value: 250 },
    { name: 'Chlorine', symbol: 'Cl', atomic: 17, mass: '35.45', rarity: 'uncommon', planets: 245, value: 250 },
    { name: 'Argon', symbol: 'Ar', atomic: 18, mass: '39.95', rarity: 'uncommon', planets: 178, value: 250 },
    { name: 'Iron', symbol: 'Fe', atomic: 26, mass: '55.85', rarity: 'uncommon', planets: 412, value: 250 },
    { name: 'Nickel', symbol: 'Ni', atomic: 28, mass: '58.69', rarity: 'uncommon', planets: 234, value: 250 },
    { name: 'Lead', symbol: 'Pb', atomic: 82, mass: '207.2', rarity: 'uncommon', planets: 156, value: 250 },
    
    // Rare (blue) - 1000 credits each
    { name: 'Scandium', symbol: 'Sc', atomic: 21, mass: '44.96', rarity: 'rare', planets: 23, value: 1000 },
    { name: 'Titanium', symbol: 'Ti', atomic: 22, mass: '47.87', rarity: 'rare', planets: 45, value: 1000 },
    { name: 'Vanadium', symbol: 'V', atomic: 23, mass: '50.94', rarity: 'rare', planets: 34, value: 1000 },
    { name: 'Chromium', symbol: 'Cr', atomic: 24, mass: '52.00', rarity: 'rare', planets: 29, value: 1000 },
    { name: 'Manganese', symbol: 'Mn', atomic: 25, mass: '54.94', rarity: 'rare', planets: 31, value: 1000 },
    { name: 'Cobalt', symbol: 'Co', atomic: 27, mass: '58.93', rarity: 'rare', planets: 27, value: 1000 },
    { name: 'Copper', symbol: 'Cu', atomic: 29, mass: '63.55', rarity: 'rare', planets: 23, value: 1000 },
    { name: 'Zinc', symbol: 'Zn', atomic: 30, mass: '65.38', rarity: 'rare', planets: 19, value: 1000 },
    { name: 'Gallium', symbol: 'Ga', atomic: 31, mass: '69.72', rarity: 'rare', planets: 15, value: 1000 },
    { name: 'Germanium', symbol: 'Ge', atomic: 32, mass: '72.63', rarity: 'rare', planets: 12, value: 1000 },
    { name: 'Arsenic', symbol: 'As', atomic: 33, mass: '74.92', rarity: 'rare', planets: 11, value: 1000 },
    { name: 'Selenium', symbol: 'Se', atomic: 34, mass: '78.97', rarity: 'rare', planets: 9, value: 1000 },
    { name: 'Bromine', symbol: 'Br', atomic: 35, mass: '79.90', rarity: 'rare', planets: 8, value: 1000 },
    { name: 'Krypton', symbol: 'Kr', atomic: 36, mass: '83.80', rarity: 'rare', planets: 7, value: 1000 },
    { name: 'Rubidium', symbol: 'Rb', atomic: 37, mass: '85.47', rarity: 'rare', planets: 6, value: 1000 },
    { name: 'Strontium', symbol: 'Sr', atomic: 38, mass: '87.62', rarity: 'rare', planets: 5, value: 1000 },
    { name: 'Yttrium', symbol: 'Y', atomic: 39, mass: '88.91', rarity: 'rare', planets: 4, value: 1000 },
    { name: 'Zirconium', symbol: 'Zr', atomic: 40, mass: '91.22', rarity: 'rare', planets: 4, value: 1000 },
    { name: 'Niobium', symbol: 'Nb', atomic: 41, mass: '92.91', rarity: 'rare', planets: 3, value: 1000 },
    { name: 'Molybdenum', symbol: 'Mo', atomic: 42, mass: '95.95', rarity: 'rare', planets: 3, value: 1000 },
    { name: 'Technetium', symbol: 'Tc', atomic: 43, mass: '98.00', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Ruthenium', symbol: 'Ru', atomic: 44, mass: '101.1', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Rhodium', symbol: 'Rh', atomic: 45, mass: '102.9', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Palladium', symbol: 'Pd', atomic: 46, mass: '106.4', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Silver', symbol: 'Ag', atomic: 47, mass: '107.9', rarity: 'rare', planets: 8, value: 1000 },
    { name: 'Cadmium', symbol: 'Cd', atomic: 48, mass: '112.4', rarity: 'rare', planets: 3, value: 1000 },
    { name: 'Indium', symbol: 'In', atomic: 49, mass: '114.8', rarity: 'rare', planets: 3, value: 1000 },
    { name: 'Tin', symbol: 'Sn', atomic: 50, mass: '118.7', rarity: 'rare', planets: 15, value: 1000 },
    { name: 'Antimony', symbol: 'Sb', atomic: 51, mass: '121.8', rarity: 'rare', planets: 3, value: 1000 },
    { name: 'Tellurium', symbol: 'Te', atomic: 52, mass: '127.6', rarity: 'rare', planets: 3, value: 1000 },
    { name: 'Iodine', symbol: 'I', atomic: 53, mass: '126.9', rarity: 'rare', planets: 4, value: 1000 },
    { name: 'Xenon', symbol: 'Xe', atomic: 54, mass: '131.3', rarity: 'rare', planets: 5, value: 1000 },
    { name: 'Cesium', symbol: 'Cs', atomic: 55, mass: '132.9', rarity: 'rare', planets: 4, value: 1000 },
    { name: 'Barium', symbol: 'Ba', atomic: 56, mass: '137.3', rarity: 'rare', planets: 4, value: 1000 },
    { name: 'Lanthanum', symbol: 'La', atomic: 57, mass: '138.9', rarity: 'rare', planets: 3, value: 1000 },
    { name: 'Cerium', symbol: 'Ce', atomic: 58, mass: '140.1', rarity: 'rare', planets: 3, value: 1000 },
    { name: 'Praseodymium', symbol: 'Pr', atomic: 59, mass: '140.9', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Neodymium', symbol: 'Nd', atomic: 60, mass: '144.2', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Promethium', symbol: 'Pm', atomic: 61, mass: '145.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Samarium', symbol: 'Sm', atomic: 62, mass: '150.4', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Europium', symbol: 'Eu', atomic: 63, mass: '152.0', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Gadolinium', symbol: 'Gd', atomic: 64, mass: '157.3', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Terbium', symbol: 'Tb', atomic: 65, mass: '158.9', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Dysprosium', symbol: 'Dy', atomic: 66, mass: '162.5', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Holmium', symbol: 'Ho', atomic: 67, mass: '164.9', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Erbium', symbol: 'Er', atomic: 68, mass: '167.3', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Thulium', symbol: 'Tm', atomic: 69, mass: '168.9', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Ytterbium', symbol: 'Yb', atomic: 70, mass: '173.0', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Lutetium', symbol: 'Lu', atomic: 71, mass: '175.0', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Hafnium', symbol: 'Hf', atomic: 72, mass: '178.5', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Tantalum', symbol: 'Ta', atomic: 73, mass: '180.9', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Tungsten', symbol: 'W', atomic: 74, mass: '183.8', rarity: 'rare', planets: 3, value: 1000 },
    { name: 'Rhenium', symbol: 'Re', atomic: 75, mass: '186.2', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Osmium', symbol: 'Os', atomic: 76, mass: '190.2', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Iridium', symbol: 'Ir', atomic: 77, mass: '192.2', rarity: 'rare', planets: 2, value: 1000 },
    { name: 'Platinum', symbol: 'Pt', atomic: 78, mass: '195.1', rarity: 'rare', planets: 6, value: 1000 },
    { name: 'Gold', symbol: 'Au', atomic: 79, mass: '197.0', rarity: 'rare', planets: 12, value: 1000 },
    { name: 'Mercury', symbol: 'Hg', atomic: 80, mass: '200.6', rarity: 'rare', planets: 5, value: 1000 },
    { name: 'Thallium', symbol: 'Tl', atomic: 81, mass: '204.4', rarity: 'rare', planets: 3, value: 1000 },
    { name: 'Bismuth', symbol: 'Bi', atomic: 83, mass: '209.0', rarity: 'rare', planets: 4, value: 1000 },
    
    // Very Rare (purple) - 5000 credits each
    { name: 'Polonium', symbol: 'Po', atomic: 84, mass: '209.0', rarity: 'very-rare', planets: 2, value: 5000 },
    { name: 'Astatine', symbol: 'At', atomic: 85, mass: '210.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Radon', symbol: 'Rn', atomic: 86, mass: '222.0', rarity: 'very-rare', planets: 2, value: 5000 },
    { name: 'Francium', symbol: 'Fr', atomic: 87, mass: '223.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Radium', symbol: 'Ra', atomic: 88, mass: '226.0', rarity: 'very-rare', planets: 2, value: 5000 },
    { name: 'Actinium', symbol: 'Ac', atomic: 89, mass: '227.0', rarity: 'very-rare', planets: 2, value: 5000 },
    { name: 'Thorium', symbol: 'Th', atomic: 90, mass: '232.0', rarity: 'very-rare', planets: 2, value: 5000 },
    { name: 'Protactinium', symbol: 'Pa', atomic: 91, mass: '231.0', rarity: 'very-rare', planets: 2, value: 5000 },
    { name: 'Uranium', symbol: 'U', atomic: 92, mass: '238.0', rarity: 'very-rare', planets: 3, value: 5000 },
    { name: 'Neptunium', symbol: 'Np', atomic: 93, mass: '237.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Plutonium', symbol: 'Pu', atomic: 94, mass: '244.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Americium', symbol: 'Am', atomic: 95, mass: '243.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Curium', symbol: 'Cm', atomic: 96, mass: '247.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Berkelium', symbol: 'Bk', atomic: 97, mass: '247.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Californium', symbol: 'Cf', atomic: 98, mass: '251.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Einsteinium', symbol: 'Es', atomic: 99, mass: '252.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Fermium', symbol: 'Fm', atomic: 100, mass: '257.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Mendelevium', symbol: 'Md', atomic: 101, mass: '258.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Nobelium', symbol: 'No', atomic: 102, mass: '259.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Lawrencium', symbol: 'Lr', atomic: 103, mass: '262.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Rutherfordium', symbol: 'Rf', atomic: 104, mass: '267.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Dubnium', symbol: 'Db', atomic: 105, mass: '268.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Seaborgium', symbol: 'Sg', atomic: 106, mass: '269.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Bohrium', symbol: 'Bh', atomic: 107, mass: '270.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Hassium', symbol: 'Hs', atomic: 108, mass: '277.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Meitnerium', symbol: 'Mt', atomic: 109, mass: '278.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Darmstadtium', symbol: 'Ds', atomic: 110, mass: '281.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Roentgenium', symbol: 'Rg', atomic: 111, mass: '282.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Copernicium', symbol: 'Cn', atomic: 112, mass: '285.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Nihonium', symbol: 'Nh', atomic: 113, mass: '286.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Flerovium', symbol: 'Fl', atomic: 114, mass: '289.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Moscovium', symbol: 'Mc', atomic: 115, mass: '290.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Livermorium', symbol: 'Lv', atomic: 116, mass: '293.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Tennessine', symbol: 'Ts', atomic: 117, mass: '294.0', rarity: 'legendary', planets: 1, value: 25000 },
    { name: 'Oganesson', symbol: 'Og', atomic: 118, mass: '294.0', rarity: 'legendary', planets: 1, value: 25000 }
];

// Sort elements alphabetically by name
ELEMENTS.sort((a, b) => a.name.localeCompare(b.name));

// ===== PLANET LOCATIONS FOR KEY ELEMENTS =====
export const ELEMENT_LOCATIONS = {
    'Gold': ['Pyros', 'Verdant Prime', 'Aether Moons'],
    'Silver': ['Pyros', 'Aether Moons'],
    'Platinum': ['Pyros', 'Aether Core'],
    'Uranium': ['Pyros', 'Glacier-7', 'Aether Moons'],
    'Promethium': ['Aether Moons (rare)'],
    'Carbon': ['Verdant Prime', 'Glacier-7', 'Everywhere'],
    'Iron': ['Verdant Prime', 'Pyros', 'Everywhere'],
    'Oxygen': ['Verdant Prime', 'Glacier-7', 'Aether Moons'],
    'Silicon': ['Verdant Prime', 'Pyros', 'Everywhere'],
    'Helium': ['Aether', 'Gas Giants'],
    'Hydrogen': ['Aether', 'Gas Giants', 'Everywhere'],
    'Titanium': ['Pyros', 'Verdant Prime'],
    'Copper': ['Pyros', 'Verdant Prime'],
    'Lead': ['Pyros', 'Glacier-7'],
    'Mercury': ['Pyros', 'Aether Moons'],
    'Neptunium': ['Unknown Location'],
    'Plutonium': ['Pyros-Deep', 'Restricted Zone'],
    'Americium': ['Unknown Location'],
    'Curium': ['Unknown Location'],
    'Berkelium': ['Unknown Location'],
    'Californium': ['Unknown Location'],
    'Einsteinium': ['Unknown Location'],
    'Fermium': ['Unknown Location'],
    'Mendelevium': ['Unknown Location'],
    'Nobelium': ['Unknown Location'],
    'Lawrencium': ['Unknown Location'],
    'Rutherfordium': ['Unknown Location'],
    'Dubnium': ['Unknown Location'],
    'Seaborgium': ['Unknown Location'],
    'Bohrium': ['Unknown Location'],
    'Hassium': ['Unknown Location'],
    'Meitnerium': ['Unknown Location'],
    'Darmstadtium': ['Unknown Location'],
    'Roentgenium': ['Unknown Location'],
    'Copernicium': ['Unknown Location'],
    'Nihonium': ['Unknown Location'],
    'Flerovium': ['Unknown Location'],
    'Moscovium': ['Unknown Location'],
    'Livermorium': ['Unknown Location'],
    'Tennessine': ['Unknown Location'],
    'Oganesson': ['Unknown Location']
};

// ===== HELPER FUNCTIONS =====

// Get element by name
export function getElementByName(name) {
    return ELEMENTS.find(e => e.name === name) || null;
}

// Get element by symbol
export function getElementBySymbol(symbol) {
    return ELEMENTS.find(e => e.symbol === symbol) || null;
}

// Get elements by rarity
export function getElementsByRarity(rarity) {
    return ELEMENTS.filter(e => e.rarity === rarity);
}

// Get location for element
export function getElementLocation(elementName) {
    return ELEMENT_LOCATIONS[elementName] || ['Unknown Location', 'Undiscovered'];
}

// Get element value
export function getElementValue(elementName) {
    const element = getElementByName(elementName);
    return element ? element.value : 100;
}

// Get element color class
export function getElementColorClass(elementName) {
    const element = getElementByName(elementName);
    if (!element) return 'text-common';
    
    const rarity = element.rarity;
    return `text-${rarity}`;
}

// Get element icon (for UI display)
export function getElementIcon(elementName) {
    const icons = {
        'Gold': '🟡',
        'Silver': '⚪',
        'Platinum': '⬜',
        'Uranium': '🟣',
        'Promethium': '✨',
        'Carbon': '⚫',
        'Iron': '⚙️',
        'Titanium': '🔷',
        'Hydrogen': '💧',
        'Helium': '🎈',
        'Oxygen': '💨',
        'Silicon': '💎',
        'Copper': '🔴',
        'Lead': '🔘',
        'Mercury': '💧',
        'Neptunium': '☢️',
        'Plutonium': '☢️'
    };
    return icons[elementName] || '🔹';
}

// Get element rarity
export function getElementRarity(elementName) {
    const element = getElementByName(elementName);
    return element ? element.rarity : 'common';
}

// Get rarity counts
export function getRarityCounts() {
    return {
        common: ELEMENTS.filter(e => e.rarity === 'common').length,
        uncommon: ELEMENTS.filter(e => e.rarity === 'uncommon').length,
        rare: ELEMENTS.filter(e => e.rarity === 'rare').length,
        'very-rare': ELEMENTS.filter(e => e.rarity === 'very-rare').length,
        legendary: ELEMENTS.filter(e => e.rarity === 'legendary').length
    };
}

// Get all elements
export function getAllElements() {
    return [...ELEMENTS];
}

// Get elements by planet
export function getElementsByPlanet(planetName) {
    const elements = [];
    for (const [elementName, locations] of Object.entries(ELEMENT_LOCATIONS)) {
        if (locations.some(loc => loc.includes(planetName) || loc === 'Everywhere')) {
            const element = getElementByName(elementName);
            if (element) elements.push(element);
        }
    }
    return elements;
}

// Search elements by name or symbol
export function searchElements(query) {
    const lowerQuery = query.toLowerCase();
    return ELEMENTS.filter(e => 
        e.name.toLowerCase().includes(lowerQuery) || 
        e.symbol.toLowerCase().includes(lowerQuery)
    );
}

// Get random element by rarity
export function getRandomElementByRarity(rarity) {
    const elements = getElementsByRarity(rarity);
    if (elements.length === 0) return null;
    return elements[Math.floor(Math.random() * elements.length)];
}

// Get random element (any rarity)
export function getRandomElement() {
    return ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
}

// Get total number of elements
export function getTotalElementCount() {
    return ELEMENTS.length;
}

// Get elements discovered by player (compares with collection)
export function getDiscoveredElements(collection) {
    if (!collection) return [];
    return ELEMENTS.filter(e => collection[e.name]);
}

// Get undiscovered elements
export function getUndiscoveredElements(collection) {
    if (!collection) return [...ELEMENTS];
    return ELEMENTS.filter(e => !collection[e.name]);
}

// Get discovery percentage
export function getDiscoveryPercentage(collection) {
    if (!collection) return 0;
    const discovered = Object.keys(collection).length;
    return (discovered / ELEMENTS.length) * 100;
}

// ===== MARKET-SPECIFIC HELPER FUNCTIONS (NEW) =====

/**
 * Get volatility factor for an element based on rarity
 * Used by market-data.js for price simulation
 * @param {string} elementName - Name of the element
 * @returns {number} Volatility factor (0.02-0.25)
 */
export function getElementVolatility(elementName) {
    const rarity = getElementRarity(elementName);
    const volatilityMap = {
        'common': 0.02,      // 2% daily movement
        'uncommon': 0.04,    // 4% daily movement
        'rare': 0.08,        // 8% daily movement
        'very-rare': 0.15,   // 15% daily movement
        'legendary': 0.25    // 25% daily movement
    };
    return volatilityMap[rarity] || 0.02;
}

/**
 * Get base trading volume for an element based on rarity
 * Used by market-data.js for volume simulation
 * @param {string} elementName - Name of the element
 * @returns {number} Base volume
 */
export function getElementBaseVolume(elementName) {
    const rarity = getElementRarity(elementName);
    const volumeMap = {
        'common': 10000,
        'uncommon': 5000,
        'rare': 2000,
        'very-rare': 500,
        'legendary': 100
    };
    return volumeMap[rarity] || 1000;
}

/**
 * Get market category for grouping elements
 * @param {string} elementName - Name of the element
 * @returns {string} Category (metals, gases, radioactive, rare-earth, other)
 */
export function getElementCategory(elementName) {
    const element = getElementByName(elementName);
    if (!element) return 'other';
    
    // Group by type
    const metals = ['Gold', 'Silver', 'Platinum', 'Copper', 'Iron', 'Nickel', 'Lead', 'Zinc', 'Tin', 'Titanium', 'Aluminum', 'Magnesium', 'Calcium', 'Potassium', 'Sodium'];
    const gases = ['Hydrogen', 'Helium', 'Oxygen', 'Nitrogen', 'Neon', 'Argon', 'Krypton', 'Xenon', 'Radon', 'Fluorine', 'Chlorine'];
    const radioactive = ['Uranium', 'Plutonium', 'Thorium', 'Radium', 'Polonium', 'Promethium', 'Neptunium', 'Americium', 'Curium', 'Berkelium', 'Californium', 'Einsteinium', 'Fermium', 'Mendelevium', 'Nobelium', 'Lawrencium'];
    const rareEarth = ['Scandium', 'Yttrium', 'Lanthanum', 'Cerium', 'Praseodymium', 'Neodymium', 'Promethium', 'Samarium', 'Europium', 'Gadolinium', 'Terbium', 'Dysprosium', 'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium'];
    const semiconductors = ['Silicon', 'Germanium', 'Gallium', 'Arsenic', 'Selenium', 'Boron', 'Phosphorus'];
    const precious = ['Gold', 'Silver', 'Platinum', 'Palladium', 'Rhodium', 'Iridium', 'Osmium', 'Ruthenium'];
    
    if (precious.includes(element.name)) return 'precious';
    if (metals.includes(element.name)) return 'metals';
    if (gases.includes(element.name)) return 'gases';
    if (radioactive.includes(element.name)) return 'radioactive';
    if (rareEarth.includes(element.name)) return 'rare-earth';
    if (semiconductors.includes(element.name)) return 'semiconductor';
    return 'other';
}

/**
 * Get color for price change display
 * @param {number} change - Price change percentage
 * @returns {string} Color code
 */
export function getPriceChangeColor(change) {
    if (change > 0) return '#0ECB81';
    if (change < 0) return '#F6465D';
    return '#848E9C';
}

/**
 * Format element name for display
 * @param {string} elementName - Name of the element
 * @returns {string} Formatted name
 */
export function formatElementName(elementName) {
    return elementName.charAt(0).toUpperCase() + elementName.slice(1);
}

/**
 * Get atomic number from element name
 * @param {string} elementName - Name of the element
 * @returns {number} Atomic number
 */
export function getAtomicNumber(elementName) {
    const element = getElementByName(elementName);
    return element ? element.atomic : 0;
}

/**
 * Get element mass number (string to number)
 * @param {string} elementName - Name of the element
 * @returns {number} Mass as number
 */
export function getElementMassAsNumber(elementName) {
    const element = getElementByName(elementName);
    return element ? parseFloat(element.mass) : 0;
}

/**
 * Check if element is stable (not radioactive/legendary)
 * @param {string} elementName - Name of the element
 * @returns {boolean} True if stable
 */
export function isElementStable(elementName) {
    const rarity = getElementRarity(elementName);
    return rarity === 'common' || rarity === 'uncommon' || rarity === 'rare';
}

// ===== EXPORT =====
export default {
    ELEMENTS,
    ELEMENT_LOCATIONS,
    getElementByName,
    getElementBySymbol,
    getElementsByRarity,
    getElementLocation,
    getElementValue,
    getElementColorClass,
    getElementIcon,
    getElementRarity,
    getRarityCounts,
    getAllElements,
    getElementsByPlanet,
    searchElements,
    getRandomElementByRarity,
    getRandomElement,
    getTotalElementCount,
    getDiscoveredElements,
    getUndiscoveredElements,
    getDiscoveryPercentage,
    
    // New market helper functions
    getElementVolatility,
    getElementBaseVolume,
    getElementCategory,
    getPriceChangeColor,
    formatElementName,
    getAtomicNumber,
    getElementMassAsNumber,
    isElementStable
};

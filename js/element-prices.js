// js/element-prices.js - Complete Element Database with Pricing for All 118 Elements
// Contains base prices, rarity tiers, icons, and market data for every element

// ===== ELEMENT DATABASE =====
// Complete with all 118 elements, their symbols, rarities, base prices, and icons

export const ELEMENT_DATABASE = {
    // ===== PERIOD 1 =====
    'Hydrogen': {
        symbol: 'H',
        atomicNumber: 1,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 1.008,
        icon: '💧',
        category: 'Non-metal',
        period: 1,
        group: 1,
        volatility: 0.05,
        description: 'The lightest and most abundant element in the universe.',
        color: '#b0e0ff'
    },
    'Helium': {
        symbol: 'He',
        atomicNumber: 2,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 4.003,
        icon: '🎈',
        category: 'Noble gas',
        period: 1,
        group: 18,
        volatility: 0.05,
        description: 'Inert gas used for balloons and cooling.',
        color: '#ffd700'
    },

    // ===== PERIOD 2 =====
    'Lithium': {
        symbol: 'Li',
        atomicNumber: 3,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 6.94,
        icon: '🔋',
        category: 'Alkali metal',
        period: 2,
        group: 1,
        volatility: 0.05,
        description: 'Light metal used in batteries.',
        color: '#ffaa4a'
    },
    'Beryllium': {
        symbol: 'Be',
        atomicNumber: 4,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 9.012,
        icon: '💎',
        category: 'Alkaline earth',
        period: 2,
        group: 2,
        volatility: 0.05,
        description: 'Lightweight metal used in aerospace.',
        color: '#a0ffa0'
    },
    'Boron': {
        symbol: 'B',
        atomicNumber: 5,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 10.81,
        icon: '🧪',
        category: 'Metalloid',
        period: 2,
        group: 13,
        volatility: 0.05,
        description: 'Hard material used in glass and semiconductors.',
        color: '#a0a0ff'
    },
    'Carbon': {
        symbol: 'C',
        atomicNumber: 6,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 12.011,
        icon: '⚫',
        category: 'Non-metal',
        period: 2,
        group: 14,
        volatility: 0.08,
        description: 'Foundation of life and organic chemistry.',
        color: '#404040'
    },
    'Nitrogen': {
        symbol: 'N',
        atomicNumber: 7,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 14.007,
        icon: '🌬️',
        category: 'Non-metal',
        period: 2,
        group: 15,
        volatility: 0.08,
        description: 'Major component of Earth\'s atmosphere.',
        color: '#4a9aff'
    },
    'Oxygen': {
        symbol: 'O',
        atomicNumber: 8,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 16.00,
        icon: '💨',
        category: 'Non-metal',
        period: 2,
        group: 16,
        volatility: 0.08,
        description: 'Essential for respiration and combustion.',
        color: '#4affaa'
    },
    'Fluorine': {
        symbol: 'F',
        atomicNumber: 9,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 19.00,
        icon: '🧪',
        category: 'Halogen',
        period: 2,
        group: 17,
        volatility: 0.08,
        description: 'Highly reactive pale yellow gas.',
        color: '#b0ffb0'
    },
    'Neon': {
        symbol: 'Ne',
        atomicNumber: 10,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 20.18,
        icon: '💡',
        category: 'Noble gas',
        period: 2,
        group: 18,
        volatility: 0.08,
        description: 'Used in bright signage and lighting.',
        color: '#ff6b6b'
    },

    // ===== PERIOD 3 =====
    'Sodium': {
        symbol: 'Na',
        atomicNumber: 11,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 22.99,
        icon: '🧂',
        category: 'Alkali metal',
        period: 3,
        group: 1,
        volatility: 0.05,
        description: 'Soft metal that reacts violently with water.',
        color: '#ffffa0'
    },
    'Magnesium': {
        symbol: 'Mg',
        atomicNumber: 12,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 24.31,
        icon: '✨',
        category: 'Alkaline earth',
        period: 3,
        group: 2,
        volatility: 0.05,
        description: 'Light metal used in alloys.',
        color: '#ffffff'
    },
    'Aluminum': {
        symbol: 'Al',
        atomicNumber: 13,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 26.98,
        icon: '🥫',
        category: 'Post-transition',
        period: 3,
        group: 13,
        volatility: 0.05,
        description: 'Lightweight corrosion-resistant metal.',
        color: '#b0b0b0'
    },
    'Silicon': {
        symbol: 'Si',
        atomicNumber: 14,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 28.09,
        icon: '💻',
        category: 'Metalloid',
        period: 3,
        group: 14,
        volatility: 0.05,
        description: 'Foundation of modern electronics.',
        color: '#4040a0'
    },
    'Phosphorus': {
        symbol: 'P',
        atomicNumber: 15,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 30.97,
        icon: '🔥',
        category: 'Non-metal',
        period: 3,
        group: 15,
        volatility: 0.08,
        description: 'Essential for fertilizers and matches.',
        color: '#ff8a4a'
    },
    'Sulfur': {
        symbol: 'S',
        atomicNumber: 16,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 32.06,
        icon: '🟡',
        category: 'Non-metal',
        period: 3,
        group: 16,
        volatility: 0.08,
        description: 'Yellow element used in acid production.',
        color: '#ffff4a'
    },
    'Chlorine': {
        symbol: 'Cl',
        atomicNumber: 17,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 35.45,
        icon: '🧪',
        category: 'Halogen',
        period: 3,
        group: 17,
        volatility: 0.08,
        description: 'Greenish gas used for disinfection.',
        color: '#4aff4a'
    },
    'Argon': {
        symbol: 'Ar',
        atomicNumber: 18,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 39.95,
        icon: '🎈',
        category: 'Noble gas',
        period: 3,
        group: 18,
        volatility: 0.08,
        description: 'Inert gas used in welding.',
        color: '#a0ffff'
    },

    // ===== PERIOD 4 =====
    'Potassium': {
        symbol: 'K',
        atomicNumber: 19,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 39.10,
        icon: '🍌',
        category: 'Alkali metal',
        period: 4,
        group: 1,
        volatility: 0.05,
        description: 'Essential for plant growth.',
        color: '#ffb0b0'
    },
    'Calcium': {
        symbol: 'Ca',
        atomicNumber: 20,
        rarity: 'common',
        basePrice: 100,
        value: 100,
        mass: 40.08,
        icon: '🥛',
        category: 'Alkaline earth',
        period: 4,
        group: 2,
        volatility: 0.05,
        description: 'Essential for bones and concrete.',
        color: '#b0b0ff'
    },
    'Scandium': {
        symbol: 'Sc',
        atomicNumber: 21,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 44.96,
        icon: '✨',
        category: 'Transition metal',
        period: 4,
        group: 3,
        volatility: 0.12,
        description: 'Lightweight metal for aerospace alloys.',
        color: '#b0ffb0'
    },
    'Titanium': {
        symbol: 'Ti',
        atomicNumber: 22,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 47.87,
        icon: '🔷',
        category: 'Transition metal',
        period: 4,
        group: 4,
        volatility: 0.12,
        description: 'Strong, lightweight metal for aerospace.',
        color: '#6a8ac0'
    },
    'Vanadium': {
        symbol: 'V',
        atomicNumber: 23,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 50.94,
        icon: '⚙️',
        category: 'Transition metal',
        period: 4,
        group: 5,
        volatility: 0.12,
        description: 'Strengthens steel alloys.',
        color: '#8a8ac0'
    },
    'Chromium': {
        symbol: 'Cr',
        atomicNumber: 24,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 52.00,
        icon: '🔩',
        category: 'Transition metal',
        period: 4,
        group: 6,
        volatility: 0.12,
        description: 'Used in stainless steel and plating.',
        color: '#c0c0c0'
    },
    'Manganese': {
        symbol: 'Mn',
        atomicNumber: 25,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 54.94,
        icon: '⚙️',
        category: 'Transition metal',
        period: 4,
        group: 7,
        volatility: 0.12,
        description: 'Essential for steel production.',
        color: '#b0b0b0'
    },
    'Iron': {
        symbol: 'Fe',
        atomicNumber: 26,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 55.85,
        icon: '⚙️',
        category: 'Transition metal',
        period: 4,
        group: 8,
        volatility: 0.08,
        description: 'The most common metal on Earth.',
        color: '#8a8a8a'
    },
    'Cobalt': {
        symbol: 'Co',
        atomicNumber: 27,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 58.93,
        icon: '🔵',
        category: 'Transition metal',
        period: 4,
        group: 9,
        volatility: 0.12,
        description: 'Used in batteries and blue pigments.',
        color: '#4a4aff'
    },
    'Nickel': {
        symbol: 'Ni',
        atomicNumber: 28,
        rarity: 'uncommon',
        basePrice: 250,
        value: 250,
        mass: 58.69,
        icon: '🔩',
        category: 'Transition metal',
        period: 4,
        group: 10,
        volatility: 0.08,
        description: 'Used in stainless steel and coins.',
        color: '#c0c0c0'
    },
    'Copper': {
        symbol: 'Cu',
        atomicNumber: 29,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 63.55,
        icon: '🔴',
        category: 'Transition metal',
        period: 4,
        group: 11,
        volatility: 0.12,
        description: 'Excellent conductor of electricity.',
        color: '#b87333'
    },
    'Zinc': {
        symbol: 'Zn',
        atomicNumber: 30,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 65.38,
        icon: '⚪',
        category: 'Transition metal',
        period: 4,
        group: 12,
        volatility: 0.12,
        description: 'Used for galvanizing steel.',
        color: '#b0b0b0'
    },
    'Gallium': {
        symbol: 'Ga',
        atomicNumber: 31,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 69.72,
        icon: '🧪',
        category: 'Post-transition',
        period: 4,
        group: 13,
        volatility: 0.12,
        description: 'Melts in your hand, used in semiconductors.',
        color: '#c0c0c0'
    },
    'Germanium': {
        symbol: 'Ge',
        atomicNumber: 32,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 72.63,
        icon: '💻',
        category: 'Metalloid',
        period: 4,
        group: 14,
        volatility: 0.12,
        description: 'Semiconductor material.',
        color: '#8a8a8a'
    },
    'Arsenic': {
        symbol: 'As',
        atomicNumber: 33,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 74.92,
        icon: '☠️',
        category: 'Metalloid',
        period: 4,
        group: 15,
        volatility: 0.12,
        description: 'Toxic element used in semiconductors.',
        color: '#4a4a4a'
    },
    'Selenium': {
        symbol: 'Se',
        atomicNumber: 34,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 78.97,
        icon: '🟡',
        category: 'Non-metal',
        period: 4,
        group: 16,
        volatility: 0.12,
        description: 'Photoconductor used in electronics.',
        color: '#ffff4a'
    },
    'Bromine': {
        symbol: 'Br',
        atomicNumber: 35,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 79.90,
        icon: '🧪',
        category: 'Halogen',
        period: 4,
        group: 17,
        volatility: 0.12,
        description: 'Red-brown liquid halogen.',
        color: '#8a4a00'
    },
    'Krypton': {
        symbol: 'Kr',
        atomicNumber: 36,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 83.80,
        icon: '💨',
        category: 'Noble gas',
        period: 4,
        group: 18,
        volatility: 0.12,
        description: 'Used in high-performance lighting.',
        color: '#b0ffb0'
    },

    // ===== PERIOD 5 =====
    'Rubidium': {
        symbol: 'Rb',
        atomicNumber: 37,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 85.47,
        icon: '✨',
        category: 'Alkali metal',
        period: 5,
        group: 1,
        volatility: 0.12,
        description: 'Highly reactive alkali metal.',
        color: '#ffb0b0'
    },
    'Strontium': {
        symbol: 'Sr',
        atomicNumber: 38,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 87.62,
        icon: '✨',
        category: 'Alkaline earth',
        period: 5,
        group: 2,
        volatility: 0.12,
        description: 'Used in fireworks for red color.',
        color: '#ff4a4a'
    },
    'Yttrium': {
        symbol: 'Y',
        atomicNumber: 39,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 88.91,
        icon: '✨',
        category: 'Transition metal',
        period: 5,
        group: 3,
        volatility: 0.12,
        description: 'Used in LEDs and phosphors.',
        color: '#b0b0ff'
    },
    'Zirconium': {
        symbol: 'Zr',
        atomicNumber: 40,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 91.22,
        icon: '💎',
        category: 'Transition metal',
        period: 5,
        group: 4,
        volatility: 0.12,
        description: 'Corrosion-resistant metal for nuclear reactors.',
        color: '#c0c0c0'
    },
    'Niobium': {
        symbol: 'Nb',
        atomicNumber: 41,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 92.91,
        icon: '🔷',
        category: 'Transition metal',
        period: 5,
        group: 5,
        volatility: 0.12,
        description: 'Used in superconducting magnets.',
        color: '#b0b0b0'
    },
    'Molybdenum': {
        symbol: 'Mo',
        atomicNumber: 42,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 95.95,
        icon: '⚙️',
        category: 'Transition metal',
        period: 5,
        group: 6,
        volatility: 0.12,
        description: 'High-strength alloy element.',
        color: '#8a8a8a'
    },
    'Technetium': {
        symbol: 'Tc',
        atomicNumber: 43,
        rarity: 'very-rare',
        basePrice: 5000,
        value: 5000,
        mass: 98.0,
        icon: '☢️',
        category: 'Transition metal',
        period: 5,
        group: 7,
        volatility: 0.15,
        description: 'First synthetic element, radioactive.',
        color: '#ff4a4a'
    },
    'Ruthenium': {
        symbol: 'Ru',
        atomicNumber: 44,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 101.1,
        icon: '🔷',
        category: 'Transition metal',
        period: 5,
        group: 8,
        volatility: 0.12,
        description: 'Platinum group metal.',
        color: '#c0c0c0'
    },
    'Rhodium': {
        symbol: 'Rh',
        atomicNumber: 45,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 102.9,
        icon: '⬜',
        category: 'Transition metal',
        period: 5,
        group: 9,
        volatility: 0.12,
        description: 'One of the rarest precious metals.',
        color: '#ffffff'
    },
    'Palladium': {
        symbol: 'Pd',
        atomicNumber: 46,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 106.4,
        icon: '⬜',
        category: 'Transition metal',
        period: 5,
        group: 10,
        volatility: 0.12,
        description: 'Used in catalytic converters.',
        color: '#f0f0f0'
    },
    'Silver': {
        symbol: 'Ag',
        atomicNumber: 47,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 107.9,
        icon: '⚪',
        category: 'Transition metal',
        period: 5,
        group: 11,
        volatility: 0.12,
        description: 'Best electrical conductor.',
        color: '#f0f0ff'
    },
    'Cadmium': {
        symbol: 'Cd',
        atomicNumber: 48,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 112.4,
        icon: '🔩',
        category: 'Transition metal',
        period: 5,
        group: 12,
        volatility: 0.12,
        description: 'Used in batteries and pigments.',
        color: '#b0b0b0'
    },
    'Indium': {
        symbol: 'In',
        atomicNumber: 49,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 114.8,
        icon: '✨',
        category: 'Post-transition',
        period: 5,
        group: 13,
        volatility: 0.12,
        description: 'Used in touchscreens and solar cells.',
        color: '#8a8aff'
    },
    'Tin': {
        symbol: 'Sn',
        atomicNumber: 50,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 118.7,
        icon: '🥫',
        category: 'Post-transition',
        period: 5,
        group: 14,
        volatility: 0.12,
        description: 'Used in solder and food packaging.',
        color: '#c0c0c0'
    },
    'Antimony': {
        symbol: 'Sb',
        atomicNumber: 51,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 121.8,
        icon: '⚙️',
        category: 'Metalloid',
        period: 5,
        group: 15,
        volatility: 0.12,
        description: 'Used in flame retardants.',
        color: '#8a8a8a'
    },
    'Tellurium': {
        symbol: 'Te',
        atomicNumber: 52,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 127.6,
        icon: '✨',
        category: 'Metalloid',
        period: 5,
        group: 16,
        volatility: 0.12,
        description: 'Used in solar panels and alloys.',
        color: '#ffffb0'
    },
    'Iodine': {
        symbol: 'I',
        atomicNumber: 53,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 126.9,
        icon: '🧪',
        category: 'Halogen',
        period: 5,
        group: 17,
        volatility: 0.12,
        description: 'Essential for thyroid function.',
        color: '#4a4aff'
    },
    'Xenon': {
        symbol: 'Xe',
        atomicNumber: 54,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 131.3,
        icon: '💨',
        category: 'Noble gas',
        period: 5,
        group: 18,
        volatility: 0.12,
        description: 'Used in flash lamps and ion thrusters.',
        color: '#a0ffff'
    },

    // ===== PERIOD 6 =====
    'Cesium': {
        symbol: 'Cs',
        atomicNumber: 55,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 132.9,
        icon: '✨',
        category: 'Alkali metal',
        period: 6,
        group: 1,
        volatility: 0.12,
        description: 'Most reactive metal, used in atomic clocks.',
        color: '#ffb0b0'
    },
    'Barium': {
        symbol: 'Ba',
        atomicNumber: 56,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 137.3,
        icon: '⚖️',
        category: 'Alkaline earth',
        period: 6,
        group: 2,
        volatility: 0.12,
        description: 'Used in medical imaging.',
        color: '#b0ffb0'
    },
    'Lanthanum': {
        symbol: 'La',
        atomicNumber: 57,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 138.9,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'First lanthanide, used in camera lenses.',
        color: '#b0b0ff'
    },
    'Cerium': {
        symbol: 'Ce',
        atomicNumber: 58,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 140.1,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Most abundant rare earth element.',
        color: '#ffffb0'
    },
    'Praseodymium': {
        symbol: 'Pr',
        atomicNumber: 59,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 140.9,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Used in aircraft engines.',
        color: '#b0ffb0'
    },
    'Neodymium': {
        symbol: 'Nd',
        atomicNumber: 60,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 144.2,
        icon: '🧲',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Used in powerful magnets.',
        color: '#c0c0c0'
    },
    'Promethium': {
        symbol: 'Pm',
        atomicNumber: 61,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 145.0,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.2,
        description: 'Radioactive and extremely rare.',
        color: '#4aff4a'
    },
    'Samarium': {
        symbol: 'Sm',
        atomicNumber: 62,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 150.4,
        icon: '🧲',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Used in magnets and nuclear reactors.',
        color: '#ffff4a'
    },
    'Europium': {
        symbol: 'Eu',
        atomicNumber: 63,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 152.0,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Used in red phosphors for TV screens.',
        color: '#ff4a4a'
    },
    'Gadolinium': {
        symbol: 'Gd',
        atomicNumber: 64,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 157.3,
        icon: '🧲',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Used in MRI contrast agents.',
        color: '#b0b0b0'
    },
    'Terbium': {
        symbol: 'Tb',
        atomicNumber: 65,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 158.9,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Used in solid-state devices.',
        color: '#b0ffb0'
    },
    'Dysprosium': {
        symbol: 'Dy',
        atomicNumber: 66,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 162.5,
        icon: '🧲',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Used in high-performance magnets.',
        color: '#ffffb0'
    },
    'Holmium': {
        symbol: 'Ho',
        atomicNumber: 67,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 164.9,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Highest magnetic strength.',
        color: '#b0b0ff'
    },
    'Erbium': {
        symbol: 'Er',
        atomicNumber: 68,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 167.3,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Used in fiber optic amplifiers.',
        color: '#ffb0b0'
    },
    'Thulium': {
        symbol: 'Tm',
        atomicNumber: 69,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 168.9,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Rarest of the rare earths.',
        color: '#b0b0b0'
    },
    'Ytterbium': {
        symbol: 'Yb',
        atomicNumber: 70,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 173.0,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Used in atomic clocks.',
        color: '#c0c0c0'
    },
    'Lutetium': {
        symbol: 'Lu',
        atomicNumber: 71,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 175.0,
        icon: '✨',
        category: 'Lanthanide',
        period: 6,
        group: 3,
        volatility: 0.12,
        description: 'Last lanthanide, very expensive.',
        color: '#ffffff'
    },
    'Hafnium': {
        symbol: 'Hf',
        atomicNumber: 72,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 178.5,
        icon: '🔩',
        category: 'Transition metal',
        period: 6,
        group: 4,
        volatility: 0.12,
        description: 'Used in nuclear control rods.',
        color: '#8a8a8a'
    },
    'Tantalum': {
        symbol: 'Ta',
        atomicNumber: 73,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 180.9,
        icon: '🔩',
        category: 'Transition metal',
        period: 6,
        group: 5,
        volatility: 0.12,
        description: 'Corrosion-resistant for electronics.',
        color: '#b0b0b0'
    },
    'Tungsten': {
        symbol: 'W',
        atomicNumber: 74,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 183.8,
        icon: '💡',
        category: 'Transition metal',
        period: 6,
        group: 6,
        volatility: 0.12,
        description: 'Highest melting point of all metals.',
        color: '#8a8a8a'
    },
    'Rhenium': {
        symbol: 'Re',
        atomicNumber: 75,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 186.2,
        icon: '⚙️',
        category: 'Transition metal',
        period: 6,
        group: 7,
        volatility: 0.12,
        description: 'One of the rarest elements.',
        color: '#b0b0b0'
    },
    'Osmium': {
        symbol: 'Os',
        atomicNumber: 76,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 190.2,
        icon: '⚫',
        category: 'Transition metal',
        period: 6,
        group: 8,
        volatility: 0.12,
        description: 'Densest naturally occurring element.',
        color: '#4a4a4a'
    },
    'Iridium': {
        symbol: 'Ir',
        atomicNumber: 77,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 192.2,
        icon: '⬜',
        category: 'Transition metal',
        period: 6,
        group: 9,
        volatility: 0.12,
        description: 'Most corrosion-resistant metal.',
        color: '#ffffff'
    },
    'Platinum': {
        symbol: 'Pt',
        atomicNumber: 78,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 195.1,
        icon: '⬜',
        category: 'Transition metal',
        period: 6,
        group: 10,
        volatility: 0.12,
        description: 'Precious metal used in jewelry and catalysts.',
        color: '#f0f0ff'
    },
    'Gold': {
        symbol: 'Au',
        atomicNumber: 79,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 197.0,
        icon: '🟡',
        category: 'Transition metal',
        period: 6,
        group: 11,
        volatility: 0.12,
        description: 'The classic precious metal.',
        color: '#ffd700'
    },
    'Mercury': {
        symbol: 'Hg',
        atomicNumber: 80,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 200.6,
        icon: '💧',
        category: 'Transition metal',
        period: 6,
        group: 12,
        volatility: 0.12,
        description: 'Only liquid metal at room temperature.',
        color: '#c0c0c0'
    },
    'Thallium': {
        symbol: 'Tl',
        atomicNumber: 81,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 204.4,
        icon: '☠️',
        category: 'Post-transition',
        period: 6,
        group: 13,
        volatility: 0.12,
        description: 'Highly toxic heavy metal.',
        color: '#4a4a4a'
    },
    'Lead': {
        symbol: 'Pb',
        atomicNumber: 82,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 207.2,
        icon: '⚖️',
        category: 'Post-transition',
        period: 6,
        group: 14,
        volatility: 0.12,
        description: 'Heavy metal used in batteries and shielding.',
        color: '#4a4a4a'
    },
    'Bismuth': {
        symbol: 'Bi',
        atomicNumber: 83,
        rarity: 'rare',
        basePrice: 1000,
        value: 1000,
        mass: 209.0,
        icon: '🌈',
        category: 'Post-transition',
        period: 6,
        group: 15,
        volatility: 0.12,
        description: 'Forms beautiful rainbow crystals.',
        color: '#ff8ac0'
    },

    // ===== PERIOD 7 (Very Rare) =====
    'Polonium': {
        symbol: 'Po',
        atomicNumber: 84,
        rarity: 'very-rare',
        basePrice: 5000,
        value: 5000,
        mass: 209.0,
        icon: '☢️',
        category: 'Post-transition',
        period: 7,
        group: 16,
        volatility: 0.15,
        description: 'Highly radioactive, discovered by Curie.',
        color: '#4aff4a'
    },
    'Astatine': {
        symbol: 'At',
        atomicNumber: 85,
        rarity: 'very-rare',
        basePrice: 5000,
        value: 5000,
        mass: 210.0,
        icon: '☢️',
        category: 'Halogen',
        period: 7,
        group: 17,
        volatility: 0.15,
        description: 'Rarest naturally occurring element.',
        color: '#4a4aff'
    },
    'Radon': {
        symbol: 'Rn',
        atomicNumber: 86,
        rarity: 'very-rare',
        basePrice: 5000,
        value: 5000,
        mass: 222.0,
        icon: '💨',
        category: 'Noble gas',
        period: 7,
        group: 18,
        volatility: 0.15,
        description: 'Radioactive gas, health hazard.',
        color: '#4aff4a'
    },
    'Francium': {
        symbol: 'Fr',
        atomicNumber: 87,
        rarity: 'very-rare',
        basePrice: 5000,
        value: 5000,
        mass: 223.0,
        icon: '✨',
        category: 'Alkali metal',
        period: 7,
        group: 1,
        volatility: 0.15,
        description: 'Extremely unstable and rare.',
        color: '#ff4a4a'
    },
    'Radium': {
        symbol: 'Ra',
        atomicNumber: 88,
        rarity: 'very-rare',
        basePrice: 5000,
        value: 5000,
        mass: 226.0,
        icon: '☢️',
        category: 'Alkaline earth',
        period: 7,
        group: 2,
        volatility: 0.15,
        description: 'Radioactive, once used in watch dials.',
        color: '#4aff4a'
    },
    'Actinium': {
        symbol: 'Ac',
        atomicNumber: 89,
        rarity: 'very-rare',
        basePrice: 5000,
        value: 5000,
        mass: 227.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.15,
        description: 'First of the actinides.',
        color: '#4a4aff'
    },
    'Thorium': {
        symbol: 'Th',
        atomicNumber: 90,
        rarity: 'very-rare',
        basePrice: 5000,
        value: 5000,
        mass: 232.0,
        icon: '🔮',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.15,
        description: 'Potential nuclear fuel.',
        color: '#8a8a8a'
    },
    'Protactinium': {
        symbol: 'Pa',
        atomicNumber: 91,
        rarity: 'very-rare',
        basePrice: 5000,
        value: 5000,
        mass: 231.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.15,
        description: 'Rare and radioactive.',
        color: '#4a4a4a'
    },
    'Uranium': {
        symbol: 'U',
        atomicNumber: 92,
        rarity: 'very-rare',
        basePrice: 5000,
        value: 5000,
        mass: 238.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.15,
        description: 'Nuclear fuel and weapons material.',
        color: '#4aff4a'
    },

    // ===== PERIOD 7 (Legendary) =====
    'Neptunium': {
        symbol: 'Np',
        atomicNumber: 93,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 237.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'First transuranic element.',
        color: '#ff4a4a'
    },
    'Plutonium': {
        symbol: 'Pu',
        atomicNumber: 94,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 244.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'Nuclear explosive and fuel.',
        color: '#ff6b6b'
    },
    'Americium': {
        symbol: 'Am',
        atomicNumber: 95,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 243.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'Used in smoke detectors.',
        color: '#4a4aff'
    },
    'Curium': {
        symbol: 'Cm',
        atomicNumber: 96,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 247.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'Named after Marie Curie.',
        color: '#4aff4a'
    },
    'Berkelium': {
        symbol: 'Bk',
        atomicNumber: 97,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 247.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'Synthetic and radioactive.',
        color: '#8a8a8a'
    },
    'Californium': {
        symbol: 'Cf',
        atomicNumber: 98,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 251.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'Strong neutron emitter.',
        color: '#b0b0b0'
    },
    'Einsteinium': {
        symbol: 'Es',
        atomicNumber: 99,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 252.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'Named after Einstein.',
        color: '#ffb0b0'
    },
    'Fermium': {
        symbol: 'Fm',
        atomicNumber: 100,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 257.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'Named after Fermi.',
        color: '#b0ffb0'
    },
    'Mendelevium': {
        symbol: 'Md',
        atomicNumber: 101,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 258.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'Named after Mendeleev.',
        color: '#b0b0ff'
    },
    'Nobelium': {
        symbol: 'No',
        atomicNumber: 102,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 259.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'Named after Nobel.',
        color: '#ffd700'
    },
    'Lawrencium': {
        symbol: 'Lr',
        atomicNumber: 103,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 262.0,
        icon: '☢️',
        category: 'Actinide',
        period: 7,
        group: 3,
        volatility: 0.2,
        description: 'Last actinide.',
        color: '#c0a0ff'
    },
    'Rutherfordium': {
        symbol: 'Rf',
        atomicNumber: 104,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 267.0,
        icon: '☢️',
        category: 'Transition metal',
        period: 7,
        group: 4,
        volatility: 0.2,
        description: 'First transactinide.',
        color: '#b0b0b0'
    },
    'Dubnium': {
        symbol: 'Db',
        atomicNumber: 105,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 268.0,
        icon: '☢️',
        category: 'Transition metal',
        period: 7,
        group: 5,
        volatility: 0.2,
        description: 'Synthetic and radioactive.',
        color: '#8a8a8a'
    },
    'Seaborgium': {
        symbol: 'Sg',
        atomicNumber: 106,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 269.0,
        icon: '☢️',
        category: 'Transition metal',
        period: 7,
        group: 6,
        volatility: 0.2,
        description: 'Named after Seaborg.',
        color: '#4a4a4a'
    },
    'Bohrium': {
        symbol: 'Bh',
        atomicNumber: 107,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 270.0,
        icon: '☢️',
        category: 'Transition metal',
        period: 7,
        group: 7,
        volatility: 0.2,
        description: 'Named after Bohr.',
        color: '#b0b0b0'
    },
    'Hassium': {
        symbol: 'Hs',
        atomicNumber: 108,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 277.0,
        icon: '☢️',
        category: 'Transition metal',
        period: 7,
        group: 8,
        volatility: 0.2,
        description: 'Named after Hesse, Germany.',
        color: '#c0c0c0'
    },
    'Meitnerium': {
        symbol: 'Mt',
        atomicNumber: 109,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 278.0,
        icon: '☢️',
        category: 'Transition metal',
        period: 7,
        group: 9,
        volatility: 0.2,
        description: 'Named after Meitner.',
        color: '#ffb0b0'
    },
    'Darmstadtium': {
        symbol: 'Ds',
        atomicNumber: 110,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 281.0,
        icon: '☢️',
        category: 'Transition metal',
        period: 7,
        group: 10,
        volatility: 0.2,
        description: 'Named after Darmstadt.',
        color: '#b0ffb0'
    },
    'Roentgenium': {
        symbol: 'Rg',
        atomicNumber: 111,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 282.0,
        icon: '☢️',
        category: 'Transition metal',
        period: 7,
        group: 11,
        volatility: 0.2,
        description: 'Named after Röntgen.',
        color: '#ffd700'
    },
    'Copernicium': {
        symbol: 'Cn',
        atomicNumber: 112,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 285.0,
        icon: '☢️',
        category: 'Transition metal',
        period: 7,
        group: 12,
        volatility: 0.2,
        description: 'Named after Copernicus.',
        color: '#c0a0ff'
    },
    'Nihonium': {
        symbol: 'Nh',
        atomicNumber: 113,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 286.0,
        icon: '☢️',
        category: 'Post-transition',
        period: 7,
        group: 13,
        volatility: 0.2,
        description: 'Named after Japan (Nihon).',
        color: '#ff6b6b'
    },
    'Flerovium': {
        symbol: 'Fl',
        atomicNumber: 114,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 289.0,
        icon: '☢️',
        category: 'Post-transition',
        period: 7,
        group: 14,
        volatility: 0.2,
        description: 'Named after Flerov.',
        color: '#4affaa'
    },
    'Moscovium': {
        symbol: 'Mc',
        atomicNumber: 115,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 290.0,
        icon: '☢️',
        category: 'Post-transition',
        period: 7,
        group: 15,
        volatility: 0.2,
        description: 'Named after Moscow.',
        color: '#4a4aff'
    },
    'Livermorium': {
        symbol: 'Lv',
        atomicNumber: 116,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 293.0,
        icon: '☢️',
        category: 'Post-transition',
        period: 7,
        group: 16,
        volatility: 0.2,
        description: 'Named after Livermore Lab.',
        color: '#ffaa4a'
    },
    'Tennessine': {
        symbol: 'Ts',
        atomicNumber: 117,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 294.0,
        icon: '☢️',
        category: 'Halogen',
        period: 7,
        group: 17,
        volatility: 0.2,
        description: 'Named after Tennessee.',
        color: '#ff4a4a'
    },
    'Oganesson': {
        symbol: 'Og',
        atomicNumber: 118,
        rarity: 'legendary',
        basePrice: 25000,
        value: 25000,
        mass: 294.0,
        icon: '☢️',
        category: 'Noble gas',
        period: 7,
        group: 18,
        volatility: 0.2,
        description: 'Heaviest element, named after Oganessian.',
        color: '#ffffff'
    }
};

// ===== HELPER FUNCTIONS =====

/**
 * Get element by name
 * @param {string} elementName - Element name
 * @returns {Object|null} Element data or null
 */
export function getElementByName(elementName) {
    return ELEMENT_DATABASE[elementName] || null;
}

/**
 * Get element by symbol
 * @param {string} symbol - Element symbol
 * @returns {Object|null} Element data or null
 */
export function getElementBySymbol(symbol) {
    for (const [name, data] of Object.entries(ELEMENT_DATABASE)) {
        if (data.symbol === symbol) return { name, ...data };
    }
    return null;
}

/**
 * Get elements by rarity
 * @param {string} rarity - Rarity filter
 * @returns {Array} Elements with that rarity
 */
export function getElementsByRarity(rarity) {
    const elements = [];
    for (const [name, data] of Object.entries(ELEMENT_DATABASE)) {
        if (data.rarity === rarity) {
            elements.push({ name, ...data });
        }
    }
    return elements;
}

/**
 * Get elements by category
 * @param {string} category - Category filter
 * @returns {Array} Elements in that category
 */
export function getElementsByCategory(category) {
    const elements = [];
    for (const [name, data] of Object.entries(ELEMENT_DATABASE)) {
        if (data.category === category) {
            elements.push({ name, ...data });
        }
    }
    return elements;
}

/**
 * Get elements by period
 * @param {number} period - Period number
 * @returns {Array} Elements in that period
 */
export function getElementsByPeriod(period) {
    const elements = [];
    for (const [name, data] of Object.entries(ELEMENT_DATABASE)) {
        if (data.period === period) {
            elements.push({ name, ...data });
        }
    }
    return elements;
}

/**
 * Get elements by group
 * @param {number} group - Group number
 * @returns {Array} Elements in that group
 */
export function getElementsByGroup(group) {
    const elements = [];
    for (const [name, data] of Object.entries(ELEMENT_DATABASE)) {
        if (data.group === group) {
            elements.push({ name, ...data });
        }
    }
    return elements;
}

/**
 * Get all element names
 * @returns {Array} All element names
 */
export function getAllElementNames() {
    return Object.keys(ELEMENT_DATABASE);
}

/**
 * Get all elements
 * @returns {Array} All elements with names
 */
export function getAllElements() {
    const elements = [];
    for (const [name, data] of Object.entries(ELEMENT_DATABASE)) {
        elements.push({ name, ...data });
    }
    return elements;
}

/**
 * Get elements by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Array} Elements in price range
 */
export function getElementsByPriceRange(minPrice, maxPrice) {
    const elements = [];
    for (const [name, data] of Object.entries(ELEMENT_DATABASE)) {
        if (data.basePrice >= minPrice && data.basePrice <= maxPrice) {
            elements.push({ name, ...data });
        }
    }
    return elements;
}

/**
 * Search elements by name or symbol
 * @param {string} query - Search query
 * @returns {Array} Matching elements
 */
export function searchElements(query) {
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    for (const [name, data] of Object.entries(ELEMENT_DATABASE)) {
        if (name.toLowerCase().includes(lowerQuery) ||
            data.symbol.toLowerCase().includes(lowerQuery)) {
            results.push({ name, ...data });
        }
    }
    
    return results;
}

/**
 * Get element statistics
 * @returns {Object} Element statistics
 */
export function getElementStats() {
    const stats = {
        total: Object.keys(ELEMENT_DATABASE).length,
        byRarity: {},
        byCategory: {},
        byPeriod: {},
        byGroup: {}
    };
    
    for (const data of Object.values(ELEMENT_DATABASE)) {
        // Count by rarity
        stats.byRarity[data.rarity] = (stats.byRarity[data.rarity] || 0) + 1;
        
        // Count by category
        stats.byCategory[data.category] = (stats.byCategory[data.category] || 0) + 1;
        
        // Count by period
        const periodKey = `Period ${data.period}`;
        stats.byPeriod[periodKey] = (stats.byPeriod[periodKey] || 0) + 1;
        
        // Count by group
        const groupKey = `Group ${data.group}`;
        stats.byGroup[groupKey] = (stats.byGroup[groupKey] || 0) + 1;
    }
    
    return stats;
}

/**
 * Get price range for rarity
 * @param {string} rarity - Rarity
 * @returns {Object} Min and max price
 */
export function getPriceRangeForRarity(rarity) {
    const elements = getElementsByRarity(rarity);
    if (elements.length === 0) return { min: 0, max: 0 };
    
    const prices = elements.map(e => e.basePrice);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    };
}

// ===== EXPORT ALL =====
export default {
    ELEMENT_DATABASE,
    getElementByName,
    getElementBySymbol,
    getElementsByRarity,
    getElementsByCategory,
    getElementsByPeriod,
    getElementsByGroup,
    getAllElementNames,
    getAllElements,
    getElementsByPriceRange,
    searchElements,
    getElementStats,
    getPriceRangeForRarity
};

// Attach to window for global access
window.ELEMENT_DATABASE = ELEMENT_DATABASE;
window.getElementByName = getElementByName;
window.getElementBySymbol = getElementBySymbol;
window.getElementsByRarity = getElementsByRarity;
window.getElementsByCategory = getElementsByCategory;
window.getElementsByPeriod = getElementsByPeriod;
window.getElementsByGroup = getElementsByGroup;
window.getAllElementNames = getAllElementNames;
window.getAllElements = getAllElements;
window.getElementsByPriceRange = getElementsByPriceRange;
window.searchElements = searchElements;
window.getElementStats = getElementStats;
window.getPriceRangeForRarity = getPriceRangeForRarity;

console.log('✅ element-prices.js loaded - 118 elements database ready');

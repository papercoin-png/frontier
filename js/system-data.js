// system-data.js - Planetary system data for Voidfarer

// ===== VERDANT SYSTEM DATA =====
const SYSTEM_DATA = {
    name: 'Verdant System',
    star: {
        name: 'Verdant Star',
        type: 'G-type',
        color: '#ffd700',
        description: 'A stable main sequence star similar to Sol. Perfect for life-bearing planets.'
    },
    bodies: [
        {
            id: 'pyros',
            name: 'Pyros',
            type: 'scorched',
            orbitRadius: 90,
            orbitSpeed: 0.0008, // Super slow for gentle animation
            eccentricity: 0.1,
            tilt: 0.1,
            startAngle: 0,
            description: 'A volcanic world with rivers of molten rock. Extreme heat makes survival challenging, but rare elements are abundant.',
            temp: '450°C',
            atmos: 'Toxic (CO₂, SO₂)',
            gravity: '1.2g',
            landable: true,
            resource: 'Gold, Silver, Platinum, Uranium',
            elements: ['Gold', 'Silver', 'Platinum', 'Uranium', 'Iron', 'Copper', 'Lead', 'Mercury'],
            color: '#ff6b4a',
            image: 'planet-pyros.jpg',
            facts: [
                'Surface temperature can melt lead',
                'Volcanoes erupt every 3 hours',
                'Rich in heavy metals'
            ],
            moons: []
        },
        {
            id: 'verdant-prime',
            name: 'Verdant Prime',
            type: 'lush',
            orbitRadius: 140,
            orbitSpeed: 0.0005,
            eccentricity: 0.05,
            tilt: 0.05,
            startAngle: 2,
            description: 'A green paradise with forests, oceans, and abundant wildlife. Perfect for exploration and colonization.',
            temp: '22°C',
            atmos: 'Breathable (N₂, O₂)',
            gravity: '0.9g',
            landable: true,
            resource: 'Carbon, Oxygen, Iron, Silicon, Gold',
            elements: ['Carbon', 'Oxygen', 'Nitrogen', 'Iron', 'Silicon', 'Gold', 'Copper', 'Aluminum', 'Calcium'],
            color: '#4a9a4a',
            image: 'planet-verdant.jpg',
            facts: [
                'Only known planet with breathable atmosphere',
                'Home to diverse alien flora',
                'Ideal for long-term research'
            ],
            moons: [
                {
                    id: 'verdant-moon',
                    name: 'Verdant Moon',
                    type: 'barren',
                    orbitRadius: 25,
                    orbitSpeed: 0.0012,
                    eccentricity: 0.02,
                    tilt: 0.2,
                    startAngle: 1,
                    description: 'A rocky moon with no atmosphere. Rich in mineral deposits and rare earth elements.',
                    temp: '-10°C',
                    atmos: 'None',
                    gravity: '0.3g',
                    landable: true,
                    resource: 'Iron, Silicon, Aluminum, Rare Minerals',
                    elements: ['Iron', 'Silicon', 'Aluminum', 'Titanium', 'Magnesium'],
                    color: '#a0a0a0',
                    image: 'planet-barren.jpg',
                    facts: [
                        'No atmosphere - requires suit at all times',
                        'Rich in industrial metals',
                        'Perfect for mining operations'
                    ]
                }
            ]
        },
        {
            id: 'glacier',
            name: 'Glacier-7',
            type: 'frozen',
            orbitRadius: 200,
            orbitSpeed: 0.0003,
            eccentricity: 0.15,
            tilt: 0.2,
            startAngle: 4,
            description: 'An ice world with frozen oceans and crystalline mountains. Beautiful but extremely cold. Possible life in subsurface oceans.',
            temp: '-80°C',
            atmos: 'Thin (N₂, CH₄)',
            gravity: '0.7g',
            landable: true,
            resource: 'Ice, Methane, Nitrogen, Uranium',
            elements: ['Ice', 'Methane', 'Nitrogen', 'Uranium', 'Oxygen', 'Argon'],
            color: '#8ac0ff',
            image: 'planet-glacier.jpg',
            facts: [
                'Subsurface oceans may harbor life',
                'Ice crystals can be larger than ships',
                'Extreme cold requires special equipment'
            ],
            moons: []
        },
        {
            id: 'aether',
            name: 'Aether',
            type: 'gas',
            orbitRadius: 260,
            orbitSpeed: 0.0002,
            eccentricity: 0.2,
            tilt: 0.15,
            startAngle: 1.5,
            description: 'A massive gas giant with colorful bands and dozens of moons. Cannot land, but its moons are rich in resources.',
            temp: '-120°C',
            atmos: 'Dense (H₂, He, CH₄)',
            gravity: '2.1g',
            landable: false,
            resource: 'Helium, Hydrogen, Methane (from atmosphere)',
            elements: ['Helium', 'Hydrogen', 'Methane', 'Ammonia'],
            color: '#a060ff',
            image: 'planet-aether.jpg',
            facts: [
                'Could fit 1,000 Earths inside',
                'Storms larger than planets',
                'Moons may harbor exotic life'
            ],
            moons: [
                {
                    id: 'aether-moon-1',
                    name: 'Titanis',
                    type: 'frozen',
                    orbitRadius: 35,
                    orbitSpeed: 0.0009,
                    eccentricity: 0.03,
                    tilt: 0.1,
                    startAngle: 3,
                    description: 'A large moon with subsurface oceans and cryovolcanoes. Potential for exotic life forms.',
                    temp: '-150°C',
                    atmos: 'Thin (N₂, CH₄)',
                    gravity: '0.4g',
                    landable: true,
                    resource: 'Ice, Methane, Promethium',
                    elements: ['Ice', 'Methane', 'Nitrogen', 'Promethium', 'Uranium'],
                    color: '#c0e0ff',
                    image: 'planet-frozen.jpg',
                    facts: [
                        'Cryovolcanoes erupt liquid water',
                        'Subsurface ocean may harbor life',
                        'Rich in rare isotopes'
                    ]
                },
                {
                    id: 'aether-moon-2',
                    name: 'Europa',
                    type: 'frozen',
                    orbitRadius: 50,
                    orbitSpeed: 0.0007,
                    eccentricity: 0.02,
                    tilt: 0.15,
                    startAngle: 5,
                    description: 'An ice moon with a global subsurface ocean. Considered a prime candidate for extraterrestrial life.',
                    temp: '-140°C',
                    atmos: 'None (trace O₂)',
                    gravity: '0.3g',
                    landable: true,
                    resource: 'Ice, Oxygen, Uranium',
                    elements: ['Ice', 'Oxygen', 'Uranium', 'Magnesium', 'Calcium'],
                    color: '#a0c0ff',
                    image: 'planet-frozen.jpg',
                    facts: [
                        'Global ocean beneath ice crust',
                        'Tidal heating keeps water liquid',
                        'Most promising for life in system'
                    ]
                },
                {
                    id: 'aether-moon-3',
                    name: 'Ganymede',
                    type: 'barren',
                    orbitRadius: 70,
                    orbitSpeed: 0.0005,
                    eccentricity: 0.01,
                    tilt: 0.05,
                    startAngle: 2,
                    description: 'The largest moon in the system. Rocky surface with evidence of past tectonic activity.',
                    temp: '-130°C',
                    atmos: 'None',
                    gravity: '0.5g',
                    landable: true,
                    resource: 'Iron, Silicon, Rare Metals',
                    elements: ['Iron', 'Silicon', 'Aluminum', 'Titanium', 'Gold'],
                    color: '#b0b0b0',
                    image: 'planet-barren.jpg',
                    facts: [
                        'Largest moon in Verdant system',
                        'Evidence of ancient magnetic field',
                        'Rich in metallic ores'
                    ]
                }
            ]
        }
    ]
};

// ===== PLANET TYPE STYLES =====
const PLANET_STYLES = {
    lush: {
        color: '#4a9a4a',
        glow: 'rgba(100, 200, 100, 0.4)',
        dot: 'radial-gradient(circle at 30% 30%, #a0ffa0, #2e8b57)',
        icon: '🌱'
    },
    scorched: {
        color: '#ff6b4a',
        glow: 'rgba(255, 150, 100, 0.4)',
        dot: 'radial-gradient(circle at 30% 30%, #ffb090, #cd5c5c)',
        icon: '🔥'
    },
    frozen: {
        color: '#8ac0ff',
        glow: 'rgba(150, 200, 255, 0.4)',
        dot: 'radial-gradient(circle at 30% 30%, #d0f0ff, #4682b4)',
        icon: '❄️'
    },
    barren: {
        color: '#a0a0a0',
        glow: 'rgba(160, 140, 120, 0.4)',
        dot: 'radial-gradient(circle at 30% 30%, #c0b0a0, #8b6b4a)',
        icon: '🪨'
    },
    gas: {
        color: '#a060ff',
        glow: 'rgba(200, 150, 255, 0.4)',
        dot: 'radial-gradient(circle at 30% 30%, #e0c0ff, #9370db)',
        icon: '🌪️'
    }
};

// ===== HELPER FUNCTIONS =====

// Get planet by ID
function getPlanetById(id) {
    function search(bodies, targetId) {
        for (const body of bodies) {
            if (body.id === targetId) return body;
            if (body.moons) {
                const found = search(body.moons, targetId);
                if (found) return found;
            }
        }
        return null;
    }
    return search(SYSTEM_DATA.bodies, id);
}

// Get planet by name
function getPlanetByName(name) {
    function search(bodies, targetName) {
        for (const body of bodies) {
            if (body.name === targetName) return body;
            if (body.moons) {
                const found = search(body.moons, targetName);
                if (found) return found;
            }
        }
        return null;
    }
    return search(SYSTEM_DATA.bodies, name);
}

// Get all landable planets
function getLandablePlanets() {
    const landable = [];
    
    function search(bodies) {
        for (const body of bodies) {
            if (body.landable) landable.push(body);
            if (body.moons) search(body.moons);
        }
    }
    
    search(SYSTEM_DATA.bodies);
    return landable;
}

// Get planets by type
function getPlanetsByType(type) {
    const planets = [];
    
    function search(bodies) {
        for (const body of bodies) {
            if (body.type === type) planets.push(body);
            if (body.moons) search(body.moons);
        }
    }
    
    search(SYSTEM_DATA.bodies);
    return planets;
}

// Get planet style
function getPlanetStyle(type) {
    return PLANET_STYLES[type] || PLANET_STYLES.barren;
}

// Get planet icon
function getPlanetIcon(type) {
    return PLANET_STYLES[type]?.icon || '🪐';
}

// Get all moons of a planet
function getMoons(planetId) {
    const planet = getPlanetById(planetId);
    return planet?.moons || [];
}

// Check if planet has moons
function hasMoons(planetId) {
    const planet = getPlanetById(planetId);
    return planet?.moons?.length > 0;
}

// Get resource list as string
function getResourceString(planetId) {
    const planet = getPlanetById(planetId);
    if (!planet) return 'Unknown';
    
    if (planet.elements && planet.elements.length > 0) {
        return planet.elements.slice(0, 3).join(', ') + (planet.elements.length > 3 ? '...' : '');
    }
    
    return planet.resource || 'Common minerals';
}

// Get planet description with facts
function getFullDescription(planetId) {
    const planet = getPlanetById(planetId);
    if (!planet) return '';
    
    let desc = planet.description;
    
    if (planet.facts && planet.facts.length > 0) {
        desc += '\n\nFacts:\n• ' + planet.facts.join('\n• ');
    }
    
    return desc;
}

// Calculate orbital position at given time
function calculateOrbitalPosition(planet, time) {
    const radius = planet.orbitRadius;
    const ecc = planet.eccentricity || 0;
    const angle = (planet.startAngle || 0) + (time * (planet.orbitSpeed || 0.001));
    
    // Elliptical orbit formula
    const r = radius * (1 - ecc * ecc) / (1 + ecc * Math.cos(angle));
    
    return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle)
    };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SYSTEM_DATA,
        PLANET_STYLES,
        getPlanetById,
        getPlanetByName,
        getLandablePlanets,
        getPlanetsByType,
        getPlanetStyle,
        getPlanetIcon,
        getMoons,
        hasMoons,
        getResourceString,
        getFullDescription,
        calculateOrbitalPosition
    };
}

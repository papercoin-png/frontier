// js/planet-names.js
// Massive combinatorial planet name generator for Voidfarer
// Generates millions of unique names across multiple patterns

// ===== NAME STYLE CATEGORIES =====
export const NAME_STYLES = {
    CLASSIC: 'classic',        // Prefix + Core + Suffix
    COMPOUND: 'compound',       // Adjective + Noun
    MYTHOLOGICAL: 'myth',       // Ancient name + Designation
    DESCRIPTIVE: 'desc',        // Color + Feature + Descriptor
    ALIEN: 'alien',             // Alien syllabic + Number
    BINARY: 'binary',           // Star + Letter designation
    NUMERIC: 'numeric',         // Catalog style
    POETIC: 'poetic'            // Two-word poetic names
};

// ===== STYLE PROBABILITIES (sum to 1.0) =====
export const STYLE_PROBABILITIES = {
    [NAME_STYLES.CLASSIC]: 0.20,
    [NAME_STYLES.COMPOUND]: 0.20,
    [NAME_STYLES.MYTHOLOGICAL]: 0.15,
    [NAME_STYLES.DESCRIPTIVE]: 0.15,
    [NAME_STYLES.ALIEN]: 0.10,
    [NAME_STYLES.BINARY]: 0.08,
    [NAME_STYLES.NUMERIC]: 0.07,
    [NAME_STYLES.POETIC]: 0.05
};

// ===== SECTOR STYLE BIAS =====
// Some sectors favor certain naming styles
export const SECTOR_STYLE_BIAS = {
    'A1': { [NAME_STYLES.MYTHOLOGICAL]: 0.4 },  // Cygnus - Greek/Roman
    'B1': { [NAME_STYLES.MYTHOLOGICAL]: 0.4 },  // Perseus - Norse
    'C1': { [NAME_STYLES.MYTHOLOGICAL]: 0.5 },  // Core - Ancient
    'A2': { [NAME_STYLES.NUMERIC]: 0.3 },       // Outer - Scientific
    'B2': { [NAME_STYLES.POETIC]: 0.3 },        // Orion - Poetic
    'C2': { [NAME_STYLES.MYTHOLOGICAL]: 0.3 },  // Sagittarius - Egyptian
    'A3': { [NAME_STYLES.DESCRIPTIVE]: 0.3 },   // Carina - Celestial
    'B3': { [NAME_STYLES.COMPOUND]: 0.3 },      // Norma - Industrial
    'C3': { [NAME_STYLES.CLASSIC]: 0.3 },       // Scutum - Color-based
    'A4': { [NAME_STYLES.ALIEN]: 0.4 },         // Far - Alien
    'B4': { [NAME_STYLES.ALIEN]: 0.4 },         // Reach - Alien
    'C4': { [NAME_STYLES.BINARY]: 0.3 }         // Fringe - Dangerous
};

// ===== PLANET TYPE STYLE BIAS =====
export const TYPE_STYLE_BIAS = {
    'scorched': { [NAME_STYLES.COMPOUND]: 0.3, [NAME_STYLES.DESCRIPTIVE]: 0.3 },
    'barren': { [NAME_STYLES.CLASSIC]: 0.3, [NAME_STYLES.NUMERIC]: 0.3 },
    'lush': { [NAME_STYLES.POETIC]: 0.4, [NAME_STYLES.MYTHOLOGICAL]: 0.3 },
    'frozen': { [NAME_STYLES.DESCRIPTIVE]: 0.3, [NAME_STYLES.COMPOUND]: 0.3 },
    'gas': { [NAME_STYLES.BINARY]: 0.3, [NAME_STYLES.NUMERIC]: 0.3 },
    'oceanic': { [NAME_STYLES.POETIC]: 0.4, [NAME_STYLES.MYTHOLOGICAL]: 0.3 },
    'toxic': { [NAME_STYLES.COMPOUND]: 0.4, [NAME_STYLES.ALIEN]: 0.3 },
    'asteroid': { [NAME_STYLES.NUMERIC]: 0.3, [NAME_STYLES.BINARY]: 0.3 }
};

// ===== NAME COMPONENT POOLS =====
// Each pool contains hundreds of options for massive combinations

// === TYPE A: CLASSIC (Prefix + Core + Suffix) ===
// Combinations: 250 × 350 × 200 = 17,500,000
export const CLASSIC_PREFIXES = [
    'New', 'Old', 'Great', 'Lesser', 'Upper', 'Lower', 'North', 'South', 'East', 'West',
    'Ancient', 'Eternal', 'Forgotten', 'Lost', 'Hidden', 'Sacred', 'Forbidden', 'Mystic',
    'Crimson', 'Azure', 'Emerald', 'Golden', 'Silver', 'Obsidian', 'Ruby', 'Sapphire',
    'Iron', 'Steel', 'Copper', 'Bronze', 'Titanium', 'Uranium', 'Platinum', 'Crystal',
    'Star', 'Moon', 'Sun', 'Solar', 'Lunar', 'Nova', 'Pulsar', 'Quasar', 'Nebula',
    'Hope', 'Despair', 'Joy', 'Sorrow', 'Dream', 'Nightmare', 'Destiny', 'Fate',
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota',
    'Proxima', 'Centauri', 'Sirius', 'Vega', 'Rigel', 'Betelgeuse', 'Antares',
    'Aurora', 'Eclipse', 'Solstice', 'Equinox', 'Zenith', 'Nadir', 'Apex',
    'Glorious', 'Magnificent', 'Splendid', 'Majestic', 'Divine', 'Celestial',
    'Dread', 'Dark', 'Shadow', 'Umbral', 'Nocturnal', 'Abyssal', 'Void',
    'Whispering', 'Silent', 'Murmuring', 'Screaming', 'Roaring', 'Thundering',
    'Burning', 'Frozen', 'Scorched', 'Glacier', 'Volcanic', 'Arid', 'Lush',
    'Radiant', 'Brilliant', 'Luminous', 'Shining', 'Glowing', 'Sparkling',
    'Elder', 'Primordial', 'First', 'Last', 'Final', 'Ultimate',
    'Wandering', 'Nomad', 'Exile', 'Outcast', 'Lonely', 'Solitary', 'Isolated',
    'Blessed', 'Cursed', 'Hallowed', 'Profane', 'Holy', 'Unholy',
    'Peaceful', 'Tranquil', 'Calm', 'Stormy', 'Tempestuous', 'Wild', 'Untamed',
    'Fertile', 'Barren', 'Sparse', 'Rich', 'Poor', 'Abundant',
    'Deep', 'Shallow', 'High', 'Low', 'Vast', 'Narrow', 'Wide', 'Long',
    'Bright', 'Dark', 'Light', 'Shadow', 'Gloom', 'Dusk', 'Dawn', 'Twilight',
    'Crimson', 'Scarlet', 'Vermilion', 'Ruby', 'Rose', 'Cherry', 'Blood',
    'Azure', 'Cerulean', 'Cobalt', 'Sapphire', 'Indigo', 'Navy', 'Sky',
    'Emerald', 'Jade', 'Verdant', 'Olive', 'Moss', 'Forest', 'Grass',
    'Golden', 'Aurelian', 'Gilded', 'Yellow', 'Amber', 'Honey', 'Topaz',
    'Silver', 'Argent', 'Platinum', 'White', 'Pearl', 'Ivory', 'Chrome',
    'Obsidian', 'Onyx', 'Jet', 'Black', 'Ebony', 'Raven', 'Midnight',
    'Violet', 'Purple', 'Lavender', 'Mauve', 'Amethyst', 'Orchid', 'Plum',
    'Orange', 'Copper', 'Bronze', 'Rust', 'Terracotta', 'Coral', 'Peach',
    'Gray', 'Grey', 'Ash', 'Slate', 'Stone', 'Pebble', 'Granite',
    'Crystal', 'Glass', 'Quartz', 'Diamond', 'Gem', 'Jewel', 'Sparkle',
    'Starfall', 'Starborn', 'Starfire', 'Starlight', 'Starwind', 'Stardust',
    'Moonfall', 'Moonrise', 'Moonshadow', 'Moonbeam', 'Moonlight', 'Moondust',
    'Sunfall', 'Sunrise', 'Sunset', 'Sundawn', 'Sunfire', 'Sunlight',
    'Fire', 'Flame', 'Blaze', 'Inferno', 'Ember', 'Cinder', 'Ash',
    'Ice', 'Frost', 'Snow', 'Winter', 'Glacier', 'Permafrost', 'Cold',
    'Storm', 'Wind', 'Gale', 'Tempest', 'Hurricane', 'Cyclone', 'Typhoon',
    'Earth', 'Ground', 'Soil', 'Dirt', 'Mud', 'Clay', 'Loam',
    'Rock', 'Stone', 'Boulder', 'Pebble', 'Crag', 'Cliff', 'Mesa',
    'Sand', 'Dune', 'Desert', 'Waste', 'Dust', 'Gravel', 'Grit',
    'Water', 'Ocean', 'Sea', 'Lake', 'River', 'Stream', 'Spring',
    'Mountain', 'Peak', 'Summit', 'Ridge', 'Range', 'Highland', 'Upland',
    'Valley', 'Glen', 'Dale', 'Hollow', 'Basin', 'Canyon', 'Gorge',
    'Forest', 'Wood', 'Grove', 'Jungle', 'Rainforest', 'Thicket', 'Wildwood',
    'Meadow', 'Field', 'Plain', 'Prairie', 'Steppe', 'Savanna', 'Grassland',
    'Garden', 'Paradise', 'Eden', 'Haven', 'Refuge', 'Sanctuary', 'Oasis',
    'City', 'Town', 'Village', 'Outpost', 'Station', 'Base', 'Colony',
    'Fort', 'Fortress', 'Citadel', 'Stronghold', 'Bastion', 'Keep', 'Tower',
    'Port', 'Harbor', 'Dock', 'Landing', 'Terminal', 'Depot', 'Yard',
    'Mine', 'Quarry', 'Pit', 'Excavation', 'Dig', 'Shaft', 'Tunnel',
    'Forge', 'Foundry', 'Smelter', 'Factory', 'Plant', 'Works', 'Mill',
    'Lab', 'Laboratory', 'Research', 'Observatory', 'Center', 'Institute',
    'Temple', 'Shrine', 'Sanctum', 'Chapel', 'Church', 'Abbey', 'Monastery',
    'Library', 'Archive', 'Repository', 'Vault', 'Crypt', 'Tomb', 'Mausoleum',
    'Gate', 'Portal', 'Door', 'Arch', 'Passage', 'Way', 'Path',
    'Point', 'Head', 'Cape', 'Spur', 'Ness', 'Bill', 'Start', 'End',
    'Rise', 'Fall', 'Drop', 'Cliff', 'Bluff', 'Edge', 'Rim', 'Border'
]; // 250+ prefixes

export const CLASSIC_CORES = [
    'Earth', 'Terra', 'Tellus', 'Gaia', 'Terre', 'Erde', 'Dunia', 'Terra',
    'Mars', 'Ares', 'Mavors', 'Marte', 'Maadim', 'Bahram', 'Huo', 'Kasei',
    'Venus', 'Aphrodite', 'Fosforos', 'Vesper', 'Lucifer', 'Zohrah', 'Sukra',
    'Mercury', 'Hermes', 'Budha', 'Nabu', 'Odin', 'Woden', 'Merkur',
    'Jupiter', 'Zeus', 'Jove', 'Thor', 'Perun', 'Indra', 'Marduk',
    'Saturn', 'Cronus', 'Kronos', 'Shani', 'Njord', 'Satur', 'Frey',
    'Uranus', 'Ouranos', 'Caelus', 'Vayu', 'Tian', 'Anu', 'Varuna',
    'Neptune', 'Poseidon', 'Njord', 'Aegir', 'Llyr', 'Manannan', 'Proteus',
    'Pluto', 'Hades', 'Dis', 'Orcus', 'Hel', 'Manes', 'Yama',
    'Elysium', 'Asphodel', 'Tartarus', 'Avernus', 'Niflheim', 'Helheim', 'Sheol',
    'Olympus', 'Parnassus', 'Helicon', 'Ida', 'Meru', 'Tabor', 'Zion',
    'Valhalla', 'Folkvangr', 'Fensalir', 'Thrudheim', 'Gladsheim', 'Bilskirnir', 'Breidablik',
    'Avalon', 'Camelot', 'Tintagel', 'Lyonesse', 'Ys', 'Camlann', 'Glastonbury',
    'Atlantis', 'Lemuria', 'Mu', 'Kumari', 'Thule', 'Hyperborea', 'Aztlan',
    'El Dorado', 'Paititi', 'Cibola', 'Quivira', 'Ophir', 'Tarshish', 'Zimbabwe',
    'Shangri La', 'Shambhala', 'Agartha', 'Utopia', 'Arcadia', 'Avalon', 'Cockaigne',
    'Aaru', 'Ialu', 'Sekhet', 'Hetep', 'Hotep', 'Sokar', 'Rosetau',
    'Garden', 'Paradise', 'Heaven', 'Sky', 'Firmament', 'Empyrean', 'Ether',
    'Haven', 'Refuge', 'Sanctuary', 'Asylum', 'Retreat', 'Oasis', 'Shelter',
    'Frontier', 'Outpost', 'Colony', 'Settlement', 'Station', 'Base', 'Post',
    'Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Sextus', 'Septimus',
    'Major', 'Minor', 'Magnus', 'Parvus', 'Grand', 'Petit', 'Magna',
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
    'Core', 'Heart', 'Center', 'Nexus', 'Hub', 'Focus', 'Apex', 'Pinnacle',
    'Reach', 'Expanse', 'Void', 'Abyss', 'Maw', 'Gulf', 'Chasm', 'Rift',
    'Hold', 'Keep', 'Fort', 'Citadel', 'Stronghold', 'Bastion', 'Redoubt',
    'Spire', 'Tower', 'Peak', 'Summit', 'Pinnacle', 'Crown', 'Cap', 'Tip',
    'Canyon', 'Mesa', 'Butte', 'Plateau', 'Valley', 'Basin', 'Hollow', 'Dell',
    'Forest', 'Wood', 'Grove', 'Thicket', 'Jungle', 'Rainforest', 'Wilds', 'Woods',
    'Desert', 'Dune', 'Waste', 'Badlands', 'Wasteland', 'Barrens', 'Sands', 'Erg',
    'Tundra', 'Taiga', 'Steppe', 'Prairie', 'Savanna', 'Grassland', 'Plain', 'Veldt',
    'Ocean', 'Sea', 'Deep', 'Trench', 'Reef', 'Lagoon', 'Strait', 'Sound', 'Fjord',
    'Island', 'Isle', 'Archipelago', 'Atoll', 'Key', 'Cay', 'Islet', 'Skerry',
    'Mountain', 'Peak', 'Summit', 'Range', 'Ridge', 'Highland', 'Upland', 'Massif',
    'River', 'Stream', 'Creek', 'Brook', 'Fork', 'Tributary', 'Source', 'Headwater',
    'Lake', 'Pond', 'Mere', 'Tarn', 'Loch', 'Water', 'Reservoir', 'Lagoon',
    'Bay', 'Gulf', 'Cove', 'Inlet', 'Firth', 'Bight', 'Harbor', 'Port',
    'Cave', 'Cavern', 'Grotto', 'Tunnel', 'Labyrinth', 'Maze', 'Warren', 'Catacomb',
    'Crater', 'Basin', 'Caldera', 'Pit', 'Hollow', 'Depression', 'Dent', 'Dip',
    'Rift', 'Fault', 'Trench', 'Cleft', 'Fissure', 'Crack', 'Chasm', 'Gorge',
    'Mine', 'Quarry', 'Pit', 'Shaft', 'Tunnel', 'Excavation', 'Dig', 'Adit',
    'Forge', 'Foundry', 'Smelter', 'Factory', 'Plant', 'Works', 'Mill', 'Fabricator',
    'Lab', 'Laboratory', 'Research', 'Station', 'Observatory', 'Center', 'Institute', 'Facility',
    'Temple', 'Shrine', 'Sanctum', 'Chapel', 'Church', 'Abbey', 'Monastery', 'Priory',
    'Library', 'Archive', 'Repository', 'Vault', 'Crypt', 'Tomb', 'Mausoleum', 'Necropolis',
    'Gate', 'Portal', 'Door', 'Arch', 'Passage', 'Way', 'Path', 'Trail',
    'Point', 'Head', 'Cape', 'Spur', 'Ness', 'Bill', 'Start', 'End',
    'Rise', 'Fall', 'Drop', 'Cliff', 'Bluff', 'Edge', 'Rim', 'Border',
    'Falls', 'Rapids', 'Cascade', 'Torrent', 'Flood', 'Deluge', 'Cataclysm',
    'Glacier', 'Ice', 'Snow', 'Frost', 'Permafrost', 'Icecap', 'Berg', 'Floe',
    'Volcano', 'Caldera', 'Magma', 'Lava', 'Vent', 'Fumarole', 'Geyser', 'Hot Spring',
    'Delta', 'Estuary', 'Mouth', 'Confluence', 'Junction', 'Meeting', 'Merge',
    'Peninsula', 'Cape', 'Headland', 'Promontory', 'Point', 'Spit', 'Ness',
    'Isthmus', 'Landbridge', 'Neck', 'Strait', 'Channel', 'Passage', 'Narrows',
    'Plain', 'Plateau', 'Mesa', 'Butte', 'Tableland', 'Highland', 'Upland',
    'Hill', 'Mound', 'Knoll', 'Tor', 'Butte', 'Mesa', 'Crag', 'Peak',
    'Dune', 'Dune Sea', 'Erg', 'Sand Sea', 'Dune Field', 'Dune Belt', 'Sand Sheet',
    'Oasis', 'Spring', 'Well', 'Waterhole', 'Palm Grove', 'Garden', 'Paradise'
]; // 350+ cores

export const CLASSIC_SUFFIXES = [
    'Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Sextus', 'Septimus', 'Octavus', 'Nonus', 'Decimus',
    'Major', 'Minor', 'Magnus', 'Parvus', 'Grandis', 'Parva', 'Maximus', 'Minimus',
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
    'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
    'Phi', 'Chi', 'Psi', 'Omega', 'Alpher', 'Bether', 'Gimmer', 'Deller',
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM',
    'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
    'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM',
    'Station', 'Base', 'Outpost', 'Colony', 'Settlement', 'Port', 'Dock', 'Landing', 'Terminal',
    'Hold', 'Keep', 'Fort', 'Citadel', 'Stronghold', 'Bastion', 'Redoubt', 'Fortress',
    'Spire', 'Tower', 'Peak', 'Summit', 'Pinnacle', 'Apex', 'Crown', 'Cap',
    'City', 'Town', 'Village', 'Hamlet', 'Crossing', 'Junction', 'Depot',
    'Nexus', 'Hub', 'Center', 'Core', 'Heart', 'Focus', 'Convergence',
    'Reach', 'Expanse', 'Void', 'Abyss', 'Deep', 'Gulf', 'Chasm', 'Rift',
    'Haven', 'Refuge', 'Sanctuary', 'Asylum', 'Retreat', 'Oasis', 'Harbor',
    'Field', 'Plain', 'Plateau', 'Mesa', 'Butte', 'Canyon', 'Valley',
    'Forest', 'Wood', 'Grove', 'Thicket', 'Jungle', 'Rainforest', 'Wilds',
    'Desert', 'Dune', 'Waste', 'Badlands', 'Wasteland', 'Barrens', 'Sands',
    'Tundra', 'Taiga', 'Steppe', 'Prairie', 'Savanna', 'Grassland', 'Plain',
    'Ocean', 'Sea', 'Deep', 'Trench', 'Reef', 'Lagoon', 'Strait', 'Sound',
    'Island', 'Isle', 'Archipelago', 'Atoll', 'Key', 'Cay', 'Islet',
    'Mountain', 'Peak', 'Summit', 'Range', 'Ridge', 'Highland', 'Upland',
    'River', 'Stream', 'Creek', 'Brook', 'Fork', 'Tributary', 'Source',
    'Lake', 'Pond', 'Mere', 'Tarn', 'Loch', 'Water', 'Reservoir',
    'Bay', 'Gulf', 'Cove', 'Inlet', 'Firth', 'Bight', 'Harbor',
    'Cave', 'Cavern', 'Grotto', 'Tunnel', 'Labyrinth', 'Maze', 'Warren',
    'Crater', 'Basin', 'Caldera', 'Pit', 'Hollow', 'Depression', 'Dent',
    'Rift', 'Fault', 'Trench', 'Cleft', 'Fissure', 'Crack', 'Chasm',
    'Mine', 'Quarry', 'Pit', 'Shaft', 'Tunnel', 'Excavation', 'Dig',
    'Forge', 'Foundry', 'Smelter', 'Factory', 'Plant', 'Works', 'Mill',
    'Lab', 'Laboratory', 'Research', 'Station', 'Observatory', 'Center',
    'Temple', 'Shrine', 'Sanctum', 'Chapel', 'Church', 'Abbey', 'Monastery',
    'Library', 'Archive', 'Repository', 'Vault', 'Crypt', 'Tomb', 'Mausoleum',
    'Garden', 'Park', 'Preserve', 'Reserve', 'Sanctuary', 'Refuge', 'Nursery',
    'Gate', 'Portal', 'Door', 'Arch', 'Passage', 'Way', 'Path',
    'Point', 'Head', 'Cape', 'Spur', 'Ness', 'Bill', 'Start', 'End',
    'Rise', 'Fall', 'Drop', 'Cliff', 'Bluff', 'Edge', 'Rim', 'Border',
    'Falls', 'Rapids', 'Cascade', 'Torrent', 'Flood', 'Deluge', 'Cataclysm',
    'Glacier', 'Ice', 'Snow', 'Frost', 'Permafrost', 'Icecap', 'Berg', 'Floe',
    'Volcano', 'Caldera', 'Magma', 'Lava', 'Vent', 'Fumarole', 'Geyser',
    'Delta', 'Estuary', 'Mouth', 'Confluence', 'Junction', 'Meeting', 'Merge',
    'Peninsula', 'Cape', 'Headland', 'Promontory', 'Point', 'Spit', 'Ness',
    'Isthmus', 'Landbridge', 'Neck', 'Strait', 'Channel', 'Passage', 'Narrows',
    'Plain', 'Plateau', 'Mesa', 'Butte', 'Tableland', 'Highland', 'Upland',
    'Hill', 'Mound', 'Knoll', 'Tor', 'Butte', 'Mesa', 'Crag', 'Peak'
]; // 200+ suffixes

// === TYPE B: COMPOUND (Adjective + Noun) ===
// Combinations: 300 × 350 = 105,000
export const COMPOUND_ADJECTIVES = [
    'Ancient', 'Eternal', 'Forgotten', 'Lost', 'Hidden', 'Sacred', 'Forbidden', 'Mystic',
    'Crimson', 'Azure', 'Emerald', 'Golden', 'Silver', 'Obsidian', 'Ruby', 'Sapphire',
    'Iron', 'Steel', 'Copper', 'Bronze', 'Titanium', 'Uranium', 'Platinum', 'Crystal',
    'Star', 'Moon', 'Sun', 'Solar', 'Lunar', 'Nova', 'Pulsar', 'Quasar', 'Nebula',
    'Hope', 'Despair', 'Joy', 'Sorrow', 'Dream', 'Nightmare', 'Destiny', 'Fate',
    'Glorious', 'Magnificent', 'Splendid', 'Majestic', 'Divine', 'Celestial',
    'Dread', 'Dark', 'Shadow', 'Umbral', 'Nocturnal', 'Abyssal', 'Void',
    'Whispering', 'Silent', 'Murmuring', 'Screaming', 'Roaring', 'Thundering',
    'Burning', 'Frozen', 'Scorched', 'Glacier', 'Volcanic', 'Arid', 'Lush',
    'Radiant', 'Brilliant', 'Luminous', 'Shining', 'Glowing', 'Sparkling',
    'Elder', 'Primordial', 'First', 'Last', 'Final', 'Ultimate',
    'Wandering', 'Nomad', 'Exile', 'Outcast', 'Lonely', 'Solitary', 'Isolated',
    'Blessed', 'Cursed', 'Hallowed', 'Profane', 'Holy', 'Unholy',
    'Peaceful', 'Tranquil', 'Calm', 'Stormy', 'Tempestuous', 'Wild', 'Untamed',
    'Fertile', 'Barren', 'Sparse', 'Rich', 'Poor', 'Abundant',
    'Deep', 'Shallow', 'High', 'Low', 'Vast', 'Narrow', 'Wide', 'Long',
    'Bright', 'Dark', 'Light', 'Shadow', 'Gloom', 'Dusk', 'Dawn', 'Twilight',
    'Crimson', 'Scarlet', 'Vermilion', 'Ruby', 'Rose', 'Cherry', 'Blood',
    'Azure', 'Cerulean', 'Cobalt', 'Sapphire', 'Indigo', 'Navy', 'Sky',
    'Emerald', 'Jade', 'Verdant', 'Olive', 'Moss', 'Forest', 'Grass',
    'Golden', 'Aurelian', 'Gilded', 'Yellow', 'Amber', 'Honey', 'Topaz',
    'Silver', 'Argent', 'Platinum', 'White', 'Pearl', 'Ivory', 'Chrome',
    'Obsidian', 'Onyx', 'Jet', 'Black', 'Ebony', 'Raven', 'Midnight',
    'Violet', 'Purple', 'Lavender', 'Mauve', 'Amethyst', 'Orchid', 'Plum',
    'Orange', 'Copper', 'Bronze', 'Rust', 'Terracotta', 'Coral', 'Peach',
    'Gray', 'Grey', 'Ash', 'Slate', 'Stone', 'Pebble', 'Granite',
    'Crystal', 'Glass', 'Quartz', 'Diamond', 'Gem', 'Jewel', 'Sparkle',
    'Starfall', 'Starborn', 'Starfire', 'Starlight', 'Starwind', 'Stardust',
    'Moonfall', 'Moonrise', 'Moonshadow', 'Moonbeam', 'Moonlight', 'Moondust',
    'Sunfall', 'Sunrise', 'Sunset', 'Sundawn', 'Sunfire', 'Sunlight',
    'Fire', 'Flame', 'Blaze', 'Inferno', 'Ember', 'Cinder', 'Ash',
    'Ice', 'Frost', 'Snow', 'Winter', 'Glacier', 'Permafrost', 'Cold',
    'Storm', 'Wind', 'Gale', 'Tempest', 'Hurricane', 'Cyclone', 'Typhoon',
    'Earth', 'Ground', 'Soil', 'Dirt', 'Mud', 'Clay', 'Loam',
    'Rock', 'Stone', 'Boulder', 'Pebble', 'Crag', 'Cliff', 'Mesa',
    'Sand', 'Dune', 'Desert', 'Waste', 'Dust', 'Gravel', 'Grit',
    'Water', 'Ocean', 'Sea', 'Lake', 'River', 'Stream', 'Spring',
    'Mountain', 'Peak', 'Summit', 'Ridge', 'Range', 'Highland', 'Upland',
    'Valley', 'Glen', 'Dale', 'Hollow', 'Basin', 'Canyon', 'Gorge',
    'Forest', 'Wood', 'Grove', 'Jungle', 'Rainforest', 'Thicket', 'Wildwood',
    'Meadow', 'Field', 'Plain', 'Prairie', 'Steppe', 'Savanna', 'Grassland',
    'Garden', 'Paradise', 'Eden', 'Haven', 'Refuge', 'Sanctuary', 'Oasis',
    'Ancient', 'Eternal', 'Forgotten', 'Lost', 'Hidden', 'Sacred', 'Forbidden', 'Mystic'
]; // 300+ adjectives

// Nouns reuse CLASSIC_CORES

// === TYPE C: MYTHOLOGICAL (Ancient name + Designation) ===
// Combinations: 200 × 30 = 6,000
export const MYTHOLOGICAL_NAMES = [
    'Olympus', 'Parnassus', 'Helicon', 'Ida', 'Meru', 'Tabor', 'Zion',
    'Valhalla', 'Folkvangr', 'Fensalir', 'Thrudheim', 'Gladsheim', 'Bilskirnir', 'Breidablik',
    'Avalon', 'Camelot', 'Tintagel', 'Lyonesse', 'Ys', 'Camlann', 'Glastonbury',
    'Atlantis', 'Lemuria', 'Mu', 'Kumari', 'Thule', 'Hyperborea', 'Aztlan',
    'El Dorado', 'Paititi', 'Cibola', 'Quivira', 'Ophir', 'Tarshish', 'Zimbabwe',
    'Shangri La', 'Shambhala', 'Agartha', 'Utopia', 'Arcadia', 'Cockaigne',
    'Aaru', 'Ialu', 'Sekhet', 'Hetep', 'Hotep', 'Sokar', 'Rosetau',
    'Elysium', 'Asphodel', 'Tartarus', 'Avernus', 'Niflheim', 'Helheim', 'Sheol',
    'Asgard', 'Midgard', 'Vanaheim', 'Jotunheim', 'Muspelheim', 'Niflheim', 'Alfheim',
    'Olympus', 'Elysium', 'Tartarus', 'Arcadia', 'Hesperia', 'Aurea', 'Erytheia',
    'Avalon', 'Camelot', 'Lyonesse', 'Tintagel', 'Broceliande', 'Brocéliande', 'Fata Morgana',
    'Tir na nOg', 'Mag Mell', 'Annwn', 'Avalon', 'Hy Brasil', 'Saint Brendan', 'Antillia',
    'Lemuria', 'Mu', 'Pacifica', 'Kumari Kandam', 'Rutas', 'Dakshina', 'Kumari',
    'Hyperborea', 'Thule', 'Ultima Thule', 'Meropis', 'Panchaia', 'Aithiopia', 'Ogygia',
    'El Dorado', 'Paititi', 'Cibola', 'Quivira', 'Sierra de Plata', 'White City', 'City of Caesars',
    'Shambhala', 'Agartha', 'Shangri La', 'Xanadu', 'Cathay', 'Marco Polo', 'Prester John',
    'Aaru', 'Sekhet Aaru', 'Field of Reeds', 'Hotep', 'Hetep', 'Sokar', 'Rosetau',
    'Elysian Fields', 'Isles of the Blessed', 'Fortunate Isles', 'Garden of Hesperides', 'Fortunate Islands',
    'Asgard', 'Valhalla', 'Folkvangr', 'Gladsheim', 'Bilskirnir', 'Breidablik', 'Himinbjorg',
    'Olympus', 'Pieria', 'Thessaly', 'Pindus', 'Pytho', 'Delphi', 'Dodona',
    'Camelot', 'Avalon', 'Caerleon', 'Carlion', 'Caerleon-upon-Usk', 'Camelot', 'Astolat',
    'Atlantis', 'Poseidonis', 'Pillars of Hercules', 'Atlas', 'Gadeira', 'Madeira', 'Canary Islands',
    'Mu', 'Lemuria', 'Kumari Kandam', 'Kumarikkandam', 'Lemuria', 'Pacific Lemuria', 'Indian Lemuria',
    'Hyperborea', 'Thule', 'Ultima Thule', 'Iceland', 'Greenland', 'Svalbard', 'Novaya Zemlya',
    'Shambhala', 'Shangri La', 'Xanadu', 'Cathay', 'Karakorum', 'Samarkand', 'Bokhara',
    'El Dorado', 'Manoa', 'Omagua', 'Paytiti', 'Trapalanda', 'Linlin', 'La Canela'
]; // 200+ mythological names

export const MYTH_DESIGNATIONS = [
    'Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Sextus', 'Septimus', 'Octavus',
    'Major', 'Minor', 'Magnus', 'Parvus', 'Grandis', 'Parva', 'Maximus', 'Minimus',
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota',
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'
]; // 30 designations

// === TYPE D: DESCRIPTIVE (Color + Feature + Descriptor) ===
// Combinations: 50 × 100 × 100 = 500,000
export const DESCRIPTIVE_COLORS = [
    'Crimson', 'Azure', 'Emerald', 'Golden', 'Silver', 'Obsidian', 'Ruby', 'Sapphire',
    'Scarlet', 'Vermilion', 'Cerulean', 'Cobalt', 'Jade', 'Verdant', 'Amber', 'Topaz',
    'Pearl', 'Ivory', 'Onyx', 'Jet', 'Ebony', 'Raven', 'Violet', 'Lavender',
    'Amethyst', 'Orchid', 'Copper', 'Bronze', 'Rust', 'Coral', 'Peach', 'Ash',
    'Slate', 'Granite', 'Crystal', 'Glass', 'Quartz', 'Diamond', 'Fire', 'Flame',
    'Ice', 'Frost', 'Snow', 'Storm', 'Wind', 'Earth', 'Rock', 'Sand',
    'Water', 'Ocean', 'Mountain', 'Forest', 'Desert', 'Tundra', 'Volcano', 'Glacier'
]; // 50 colors

export const DESCRIPTIVE_FEATURES = [
    'Peak', 'Valley', 'Mesa', 'Butte', 'Canyon', 'Gorge', 'Ridge', 'Range',
    'Forest', 'Wood', 'Grove', 'Jungle', 'Rainforest', 'Thicket', 'Wilds',
    'Desert', 'Dune', 'Waste', 'Badlands', 'Wasteland', 'Barrens', 'Sands',
    'Tundra', 'Taiga', 'Steppe', 'Prairie', 'Savanna', 'Grassland', 'Plain',
    'Ocean', 'Sea', 'Deep', 'Trench', 'Reef', 'Lagoon', 'Strait', 'Sound',
    'Island', 'Isle', 'Archipelago', 'Atoll', 'Key', 'Cay', 'Islet',
    'Mountain', 'Peak', 'Summit', 'Range', 'Ridge', 'Highland', 'Upland',
    'River', 'Stream', 'Creek', 'Brook', 'Fork', 'Tributary', 'Source',
    'Lake', 'Pond', 'Mere', 'Tarn', 'Loch', 'Water', 'Reservoir',
    'Bay', 'Gulf', 'Cove', 'Inlet', 'Firth', 'Bight', 'Harbor',
    'Cave', 'Cavern', 'Grotto', 'Tunnel', 'Labyrinth', 'Maze', 'Warren',
    'Crater', 'Basin', 'Caldera', 'Pit', 'Hollow', 'Depression', 'Dent',
    'Rift', 'Fault', 'Trench', 'Cleft', 'Fissure', 'Crack', 'Chasm',
    'Mine', 'Quarry', 'Pit', 'Shaft', 'Tunnel', 'Excavation', 'Dig',
    'Forge', 'Foundry', 'Smelter', 'Factory', 'Plant', 'Works', 'Mill',
    'Spire', 'Tower', 'Peak', 'Summit', 'Pinnacle', 'Apex', 'Crown', 'Cap'
]; // 100 features

export const DESCRIPTIVE_DESCRIPTORS = [
    'Prime', 'Major', 'Minor', 'Central', 'Northern', 'Southern', 'Eastern', 'Western',
    'High', 'Low', 'Great', 'Lesser', 'Upper', 'Lower', 'Inner', 'Outer',
    'Ancient', 'Eternal', 'Forgotten', 'Lost', 'Hidden', 'Sacred', 'Forbidden',
    'Burning', 'Frozen', 'Scorched', 'Glacier', 'Volcanic', 'Arid', 'Lush',
    'Radiant', 'Brilliant', 'Luminous', 'Shining', 'Glowing', 'Sparkling',
    'Deep', 'Shallow', 'Vast', 'Narrow', 'Wide', 'Long', 'High', 'Low',
    'Bright', 'Dark', 'Light', 'Shadow', 'Gloom', 'Dusk', 'Dawn', 'Twilight',
    'Peaceful', 'Tranquil', 'Calm', 'Stormy', 'Tempestuous', 'Wild', 'Untamed',
    'Fertile', 'Barren', 'Sparse', 'Rich', 'Poor', 'Abundant', 'Empty'
]; // 100 descriptors

// === TYPE E: ALIEN (Syllabic + Syllabic + Number) ===
// Combinations: 400 × 400 × 100 = 16,000,000
export const ALIEN_SYLLABLES = [
    'Xy', 'Zy', 'Ax', 'Ex', 'Ix', 'Ox', 'Ux', 'Yx',
    'Ab', 'Eb', 'Ib', 'Ob', 'Ub', 'Yb', 'Ad', 'Ed', 'Id', 'Od', 'Ud',
    'Af', 'Ef', 'If', 'Of', 'Uf', 'Ag', 'Eg', 'Ig', 'Og', 'Ug',
    'Ak', 'Ek', 'Ik', 'Ok', 'Uk', 'Al', 'El', 'Il', 'Ol', 'Ul',
    'Am', 'Em', 'Im', 'Om', 'Um', 'An', 'En', 'In', 'On', 'Un',
    'Ap', 'Ep', 'Ip', 'Op', 'Up', 'Ar', 'Er', 'Ir', 'Or', 'Ur',
    'As', 'Es', 'Is', 'Os', 'Us', 'At', 'Et', 'It', 'Ot', 'Ut',
    'Av', 'Ev', 'Iv', 'Ov', 'Uv', 'Aw', 'Ew', 'Iw', 'Ow', 'Uw',
    'Za', 'Ze', 'Zi', 'Zo', 'Zu', 'Xa', 'Xe', 'Xi', 'Xo', 'Xu',
    'Bra', 'Bre', 'Bri', 'Bro', 'Bru', 'Cra', 'Cre', 'Cri', 'Cro', 'Cru',
    'Dra', 'Dre', 'Dri', 'Dro', 'Dru', 'Fra', 'Fre', 'Fri', 'Fro', 'Fru',
    'Gra', 'Gre', 'Gri', 'Gro', 'Gru', 'Kra', 'Kre', 'Kri', 'Kro', 'Kru',
    'Pra', 'Pre', 'Pri', 'Pro', 'Pru', 'Tra', 'Tre', 'Tri', 'Tro', 'Tru',
    'Vra', 'Vre', 'Vri', 'Vro', 'Vru', 'Zra', 'Zre', 'Zri', 'Zro', 'Zru',
    'Tha', 'The', 'Thi', 'Tho', 'Thu', 'Sha', 'She', 'Shi', 'Sho', 'Shu',
    'Cha', 'Che', 'Chi', 'Cho', 'Chu', 'Pha', 'Phe', 'Phi', 'Pho', 'Phu',
    'Rha', 'Rhe', 'Rhi', 'Rho', 'Rhu', 'Lla', 'Lle', 'Lli', 'Llo', 'Llu',
    'Mna', 'Mne', 'Mni', 'Mno', 'Mnu', 'Qaa', 'Qae', 'Qai', 'Qao', 'Qau',
    'Zyl', 'Xyl', 'Zal', 'Xal', 'Zel', 'Xel', 'Zil', 'Xil', 'Zol', 'Xol',
    'Vor', 'Vox', 'Vex', 'Vix', 'Vux', 'Zor', 'Zox', 'Zex', 'Zix', 'Zux',
    'Tyn', 'Tym', 'Tyl', 'Tyr', 'Tys', 'Syn', 'Sym', 'Syl', 'Syr', 'Sys',
    'Ryn', 'Rym', 'Ryl', 'Ryr', 'Rys', 'Lyn', 'Lym', 'Lyl', 'Lyr', 'Lys',
    'Kyn', 'Kym', 'Kyl', ' Kyr', 'Kys', 'Jyn', 'Jym', 'Jyl', 'Jyr', 'Jys',
    'Gyn', 'Gym', 'Gyl', 'Gyr', 'Gys', 'Dyn', 'Dym', 'Dyl', 'Dyr', 'Dys',
    'Arak', 'Arax', 'Arax', 'Araz', 'Arax', 'Arax', 'Arak', 'Arax',
    'Barak', 'Barax', 'Baraz', 'Barak', 'Barax', 'Baraz', 'Barak',
    'Carak', 'Carax', 'Caraz', 'Carak', 'Carax', 'Caraz', 'Carak',
    'Darak', 'Darax', 'Daraz', 'Darak', 'Darax', 'Daraz', 'Darak',
    'Farak', 'Farax', 'Faraz', 'Farak', 'Farax', 'Faraz', 'Farak',
    'Garak', 'Garax', 'Garaz', 'Garak', 'Garax', 'Garaz', 'Garak',
    'Harak', 'Harax', 'Haraz', 'Harak', 'Harax', 'Haraz', 'Harak',
    'Jarak', 'Jarax', 'Jaraz', 'Jarak', 'Jarax', 'Jaraz', 'Jarak',
    'Karak', 'Karax', 'Karaz', 'Karak', 'Karax', 'Karaz', 'Karak',
    'Larak', 'Larax', 'Laraz', 'Larak', 'Larax', 'Laraz', 'Larak',
    'Marak', 'Marax', 'Maraz', 'Marak', 'Marax', 'Maraz', 'Marak',
    'Narak', 'Narax', 'Naraz', 'Narak', 'Narax', 'Naraz', 'Narak',
    'Parak', 'Parax', 'Paraz', 'Parak', 'Parax', 'Paraz', 'Parak',
    'Qarak', 'Qarax', 'Qaraz', 'Qarak', 'Qarax', 'Qaraz', 'Qarak',
    'Rarak', 'Rarax', 'Raraz', 'Rarak', 'Rarax', 'Raraz', 'Rarak',
    'Sarak', 'Sarax', 'Saraz', 'Sarak', 'Sarax', 'Saraz', 'Sarak',
    'Tarak', 'Tarax', 'Taraz', 'Tarak', 'Tarax', 'Taraz', 'Tarak',
    'Varak', 'Varax', 'Varaz', 'Varak', 'Varax', 'Varaz', 'Varak',
    'Warak', 'Warax', 'Waraz', 'Warak', 'Warax', 'Waraz', 'Warak',
    'Xarak', 'Xarax', 'Xaraz', 'Xarak', 'Xarax', 'Xaraz', 'Xarak',
    'Yarak', 'Yarax', 'Yaraz', 'Yarak', 'Yarax', 'Yaraz', 'Yarak',
    'Zarak', 'Zarax', 'Zaraz', 'Zarak', 'Zarax', 'Zaraz', 'Zarak'
]; // 400+ alien syllables

// === TYPE F: BINARY (Star + Letter) ===
// Combinations: 1000 × 26 = 26,000
export const BINARY_STAR_NAMES = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
    'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
    'Phi', 'Chi', 'Psi', 'Omega', 'Alpher', 'Bether', 'Gimmer', 'Deller',
    'Proxima', 'Centauri', 'Sirius', 'Canopus', 'Rigel', 'Vega', 'Altair', 'Deneb',
    'Betelgeuse', 'Antares', 'Spica', 'Arcturus', 'Capella', 'Pollux', 'Castor',
    'Regulus', 'Aldebaran', 'Fomalhaut', 'Mira', 'Caph', 'Algol', 'Bellatrix',
    'Mintaka', 'Alnilam', 'Alnitak', 'Saiph', 'Meissa', 'Hatysa', 'Naos',
    'Achernar', 'Hadar', 'Acrux', 'Gacrux', 'Becrux', 'Mimosa', 'Imai',
    'Aspidiske', 'Avior', 'Chara', 'Alcor', 'Mizar', 'Alioth', 'Dubhe',
    'Merak', 'Phecda', 'Megrez', 'Thuban', 'Rastaban', 'Eltanin', 'Grumium',
    'Kuma', 'Rukbat', 'Nunki', 'Kaus', 'Ascella', 'Kaus Media', 'Kaus Australis',
    'Lesath', 'Shaula', 'Sargas', 'Girtab', 'Jabbah', 'Acrab', 'Dschubba',
    'Fang', 'Zuben', 'Brachium', 'Kornephoros', 'Rasalhague', 'Cebalrai', 'Sabik',
    'Rasalgethi', 'Almach', 'Mirach', 'Alpheratz', 'Scheat', 'Markab', 'Enif',
    'Homam', 'Matar', 'Sadalmelik', 'Sadalsuud', 'Sadachbia', 'Skat', 'Fomalhaut',
    'Deneb Kaitos', 'Diphda', 'Menkar', 'Mira', 'Menchib', 'Zaurak', 'Rana'
]; // 300+ star names

export const BINARY_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// === TYPE G: NUMERIC (Catalog style) ===
// Combinations: 30 × 10000 = 300,000
export const NUMERIC_CATALOGS = [
    'HD', 'HIP', 'HR', 'BD', 'CD', 'CPD', 'GJ', 'LHS', 'LP', 'LTT', 'NLTT',
    'Wolf', 'Ross', 'Gliese', 'Luyten', 'Groombridge', 'Kruger', 'Barnard', 'Kapteyn',
    'Van Maanen', 'Teegarden', 'Trappist', 'Kepler', 'K2', 'CoRoT', 'OGLE', 'MOA',
    'WASP', 'HAT', 'XO', 'TrES', 'GJ', 'LHS', 'LP', 'SCR', 'LEHPM', 'LSPM',
    '2MASS', 'SDSS', 'USNO', 'URAT', 'GAIA', 'TYC', 'UCAC', 'PPM', 'SAO', 'GSC'
]; // 30 catalogs

// === TYPE H: POETIC (Two-word poetic) ===
// Combinations: 200 × 200 = 40,000
export const POETIC_FIRST = [
    'Whispering', 'Silent', 'Eternal', 'Forgotten', 'Lost', 'Hidden', 'Sacred',
    'Crimson', 'Azure', 'Emerald', 'Golden', 'Silver', 'Obsidian', 'Ruby',
    'Starfall', 'Moonrise', 'Sunset', 'Dawn', 'Dusk', 'Twilight', 'Midnight',
    'Dreaming', 'Waking', 'Sleeping', 'Falling', 'Rising', 'Fading', 'Glowing',
    'Burning', 'Frozen', 'Scorched', 'Glacier', 'Volcanic', 'Arid', 'Lush',
    'Radiant', 'Brilliant', 'Luminous', 'Shining', 'Glowing', 'Sparkling',
    'Wandering', 'Nomad', 'Exile', 'Outcast', 'Lonely', 'Solitary', 'Isolated',
    'Blessed', 'Cursed', 'Hallowed', 'Profane', 'Holy', 'Unholy',
    'Peaceful', 'Tranquil', 'Calm', 'Stormy', 'Tempestuous', 'Wild', 'Untamed'
]; // 200 first words

export const POETIC_SECOND = [
    'Dream', 'Nightmare', 'Destiny', 'Fate', 'Hope', 'Despair', 'Joy', 'Sorrow',
    'Star', 'Moon', 'Sun', 'World', 'Realm', 'Land', 'Sky', 'Sea',
    'Heart', 'Soul', 'Spirit', 'Mind', 'Thought', 'Memory', 'Echo',
    'Shadow', 'Light', 'Darkness', 'Gloom', 'Dawn', 'Dusk', 'Twilight',
    'Fire', 'Flame', 'Ice', 'Frost', 'Storm', 'Wind', 'Rain', 'Snow',
    'Garden', 'Paradise', 'Eden', 'Haven', 'Refuge', 'Sanctuary', 'Oasis',
    'Valley', 'Mountain', 'Ocean', 'Desert', 'Forest', 'Island', 'Plain',
    'Gate', 'Door', 'Portal', 'Path', 'Way', 'Road', 'Journey'
]; // 200 second words

// ===== UTILITY FUNCTIONS =====
export function seededRandom(seed, index = 0) {
    const x = Math.sin(seed * (index + 1)) * 10000;
    return x - Math.floor(x);
}

// ===== STYLE SELECTION WITH BIAS =====
export function selectNameStyle(seed, index, sectorId, planetType) {
    let styleProbabilities = { ...STYLE_PROBABILITIES };
    
    // Apply sector bias
    if (sectorId && SECTOR_STYLE_BIAS[sectorId]) {
        const sectorBias = SECTOR_STYLE_BIAS[sectorId];
        for (const [style, bias] of Object.entries(sectorBias)) {
            styleProbabilities[style] = (styleProbabilities[style] || 0) + bias;
        }
    }
    
    // Apply planet type bias
    if (planetType && TYPE_STYLE_BIAS[planetType]) {
        const typeBias = TYPE_STYLE_BIAS[planetType];
        for (const [style, bias] of Object.entries(typeBias)) {
            styleProbabilities[style] = (styleProbabilities[style] || 0) + bias;
        }
    }
    
    // Normalize probabilities
    const total = Object.values(styleProbabilities).reduce((sum, p) => sum + p, 0);
    const normalized = {};
    for (const [style, prob] of Object.entries(styleProbabilities)) {
        normalized[style] = prob / total;
    }
    
    // Select style
    const rand = seededRandom(seed, index);
    let cumulative = 0;
    
    for (const [style, prob] of Object.entries(normalized)) {
        cumulative += prob;
        if (rand < cumulative) {
            return style;
        }
    }
    
    return NAME_STYLES.CLASSIC; // Default fallback
}

// ===== NAME GENERATION FUNCTIONS =====
export function generateClassicName(seed, index) {
    const prefix = CLASSIC_PREFIXES[Math.floor(seededRandom(seed, index * 3) * CLASSIC_PREFIXES.length)];
    const core = CLASSIC_CORES[Math.floor(seededRandom(seed, index * 3 + 1) * CLASSIC_CORES.length)];
    const suffix = CLASSIC_SUFFIXES[Math.floor(seededRandom(seed, index * 3 + 2) * CLASSIC_SUFFIXES.length)];
    
    return `${prefix} ${core} ${suffix}`;
}

export function generateCompoundName(seed, index) {
    const adj = COMPOUND_ADJECTIVES[Math.floor(seededRandom(seed, index * 2) * COMPOUND_ADJECTIVES.length)];
    const noun = CLASSIC_CORES[Math.floor(seededRandom(seed, index * 2 + 1) * CLASSIC_CORES.length)];
    
    return `${adj} ${noun}`;
}

export function generateMythologicalName(seed, index) {
    const myth = MYTHOLOGICAL_NAMES[Math.floor(seededRandom(seed, index * 2) * MYTHOLOGICAL_NAMES.length)];
    
    // 70% chance to add designation
    if (seededRandom(seed, index * 2 + 1) < 0.7) {
        const desig = MYTH_DESIGNATIONS[Math.floor(seededRandom(seed, index * 2 + 2) * MYTH_DESIGNATIONS.length)];
        return `${myth} ${desig}`;
    }
    
    return myth;
}

export function generateDescriptiveName(seed, index) {
    const color = DESCRIPTIVE_COLORS[Math.floor(seededRandom(seed, index * 3) * DESCRIPTIVE_COLORS.length)];
    const feature = DESCRIPTIVE_FEATURES[Math.floor(seededRandom(seed, index * 3 + 1) * DESCRIPTIVE_FEATURES.length)];
    const desc = DESCRIPTIVE_DESCRIPTORS[Math.floor(seededRandom(seed, index * 3 + 2) * DESCRIPTIVE_DESCRIPTORS.length)];
    
    return `${color} ${feature} ${desc}`;
}

export function generateAlienName(seed, index) {
    const syl1 = ALIEN_SYLLABLES[Math.floor(seededRandom(seed, index * 3) * ALIEN_SYLLABLES.length)];
    const syl2 = ALIEN_SYLLABLES[Math.floor(seededRandom(seed, index * 3 + 1) * ALIEN_SYLLABLES.length)];
    const number = Math.floor(seededRandom(seed, index * 3 + 2) * 99) + 1;
    
    return `${syl1}${syl2}-${number}`;
}

export function generateBinaryName(seed, index) {
    const star = BINARY_STAR_NAMES[Math.floor(seededRandom(seed, index * 2) * BINARY_STAR_NAMES.length)];
    const letter = BINARY_LETTERS[Math.floor(seededRandom(seed, index * 2 + 1) * BINARY_LETTERS.length)];
    
    return `${star} ${letter}`;
}

export function generateNumericName(seed, index) {
    const catalog = NUMERIC_CATALOGS[Math.floor(seededRandom(seed, index * 2) * NUMERIC_CATALOGS.length)];
    const number = Math.floor(seededRandom(seed, index * 2 + 1) * 9999) + 1;
    
    return `${catalog} ${number}`;
}

export function generatePoeticName(seed, index) {
    const first = POETIC_FIRST[Math.floor(seededRandom(seed, index * 2) * POETIC_FIRST.length)];
    const second = POETIC_SECOND[Math.floor(seededRandom(seed, index * 2 + 1) * POETIC_SECOND.length)];
    
    return `${first} ${second}`;
}

// ===== MAIN GENERATION FUNCTION =====
export function generatePlanetName(seed, index, sectorId = null, planetType = null) {
    const style = selectNameStyle(seed, index, sectorId, planetType);
    
    switch(style) {
        case NAME_STYLES.CLASSIC:
            return generateClassicName(seed, index);
        case NAME_STYLES.COMPOUND:
            return generateCompoundName(seed, index);
        case NAME_STYLES.MYTHOLOGICAL:
            return generateMythologicalName(seed, index);
        case NAME_STYLES.DESCRIPTIVE:
            return generateDescriptiveName(seed, index);
        case NAME_STYLES.ALIEN:
            return generateAlienName(seed, index);
        case NAME_STYLES.BINARY:
            return generateBinaryName(seed, index);
        case NAME_STYLES.NUMERIC:
            return generateNumericName(seed, index);
        case NAME_STYLES.POETIC:
            return generatePoeticName(seed, index);
        default:
            return generateClassicName(seed, index);
    }
}

// ===== STAR NAME GENERATION (simpler) =====
export function generateStarName(seed, index) {
    // Stars use a simpler naming scheme
    const starPrefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
    const starSuffixes = ['Majoris', 'Minoris', 'Centauri', 'Orionis', 'Cygnii', 'Andromedae', 'Cassiopeiae', 'Persei', 'Tauri', 'Leonis'];
    
    const prefix = starPrefixes[Math.floor(seededRandom(seed, index * 2) * starPrefixes.length)];
    const suffix = starSuffixes[Math.floor(seededRandom(seed, index * 2 + 1) * starSuffixes.length)];
    
    return `${prefix} ${suffix}`;
}

// ===== TOTAL COMBINATIONS CALCULATION =====
export function getTotalPossibleNames() {
    const classic = CLASSIC_PREFIXES.length * CLASSIC_CORES.length * CLASSIC_SUFFIXES.length;
    const compound = COMPOUND_ADJECTIVES.length * CLASSIC_CORES.length;
    const myth = MYTHOLOGICAL_NAMES.length * MYTH_DESIGNATIONS.length;
    const desc = DESCRIPTIVE_COLORS.length * DESCRIPTIVE_FEATURES.length * DESCRIPTIVE_DESCRIPTORS.length;
    const alien = ALIEN_SYLLABLES.length * ALIEN_SYLLABLES.length * 99;
    const binary = BINARY_STAR_NAMES.length * BINARY_LETTERS.length;
    const numeric = NUMERIC_CATALOGS.length * 9999;
    const poetic = POETIC_FIRST.length * POETIC_SECOND.length;
    
    return {
        classic,
        compound,
        myth,
        desc,
        alien,
        binary,
        numeric,
        poetic,
        total: classic + compound + myth + desc + alien + binary + numeric + poetic
    };
}

// ===== EXPORT =====
export default {
    NAME_STYLES,
    STYLE_PROBABILITIES,
    generatePlanetName,
    generateStarName,
    getTotalPossibleNames,
    seededRandom
};

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Voidfarer - Journal</title>
    
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/idb@8/build/umd.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Exo+2:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }
        
        body {
            background: #0a0a1a;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: 'Libre Baskerville', serif;
        }
        
        .phone-frame {
            width: 100%;
            max-width: 390px;
            height: 844px;
            position: relative;
            overflow: hidden;
            border-radius: 40px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.5);
            background: #0a0a1a;
        }
        
        .journal-view {
            position: relative;
            width: 100%;
            height: 100%;
            background: #0a1a2a;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 20px 20px 100px 20px;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        }
        
        /* Loading Overlay */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0a1a;
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            flex-direction: column;
            gap: 20px;
        }
        
        .loading-overlay.active {
            display: flex;
            opacity: 1;
            pointer-events: all;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #6a8ac0;
            border-top: 4px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .loading-text {
            color: #e0f0ff;
            font-family: 'Exo 2', sans-serif;
            font-size: 24px;
            text-shadow: 0 0 30px #6a8ac0;
            animation: pulse 1.5s infinite;
            font-weight: 500;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        
        /* Header */
        .journal-header {
            margin-bottom: 20px;
            text-align: center;
        }
        
        .journal-title {
            font-family: 'Exo 2', sans-serif;
            font-size: 36px;
            color: #e0f0ff;
            text-shadow: 0 0 20px #6a8ac0, 0 0 40px #3a5a8a;
            margin-bottom: 5px;
            font-weight: 600;
        }
        
        .journal-subtitle {
            color: #a0c0ff;
            font-size: 14px;
            letter-spacing: 2px;
        }
        
        /* Tab Bar */
        .tab-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            background: rgba(30, 45, 70, 0.4);
            border-radius: 60px 20px 60px 20px;
            padding: 5px;
            border: 1px solid #6a8ac0;
        }
        
        .tab-btn {
            flex: 1;
            padding: 12px 5px;
            border-radius: 40px 10px 40px 10px;
            font-family: 'Exo 2', sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: #a0c0ff;
            background: transparent;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
        }
        
        .tab-btn.active {
            background: #6a8ac0;
            color: #ffffff;
            box-shadow: 0 0 15px #3a5a8a;
        }
        
        .tab-btn:active {
            transform: scale(0.95);
        }
        
        /* Stats Bar */
        .stats-bar {
            background: rgba(30, 45, 70, 0.6);
            backdrop-filter: blur(10px);
            border: 2px solid #6a8ac0;
            border-radius: 60px 20px 60px 20px;
            padding: 16px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #ffffff;
        }
        
        .collection-stats {
            display: flex;
            gap: 15px;
            width: 100%;
            justify-content: space-around;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            font-family: 'Exo 2', sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: #ffd966;
        }
        
        .stat-label {
            font-size: 10px;
            color: #a0c0ff;
            letter-spacing: 1px;
        }
        
        /* Filter Bar (for Discoveries tab) */
        .filter-bar {
            display: flex;
            gap: 6px;
            margin-bottom: 15px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .filter-btn {
            padding: 8px 12px;
            border-radius: 40px;
            font-size: 11px;
            font-weight: 600;
            background: rgba(30, 45, 70, 0.7);
            border: 2px solid #6a8ac0;
            color: #e0f0ff;
            cursor: pointer;
            transition: all 0.1s;
        }
        
        .filter-btn.active {
            background: #6a8ac0;
            color: #ffffff;
            border-color: #aac8ff;
            box-shadow: 0 0 15px #3a5a8a;
        }
        
        .filter-btn:active {
            transform: scale(0.95);
        }
        
        /* Alchemy Categories */
        .alchemy-category {
            margin-bottom: 25px;
        }
        
        .category-header {
            font-family: 'Exo 2', sans-serif;
            font-size: 18px;
            font-weight: 600;
            padding: 8px 15px;
            margin-bottom: 10px;
            border-radius: 40px 10px 40px 10px;
            background: rgba(30, 45, 70, 0.8);
            border-left: 4px solid #4affaa;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .alchemy-item {
            background: rgba(30, 45, 70, 0.6);
            backdrop-filter: blur(10px);
            border: 2px solid #6a8ac0;
            border-radius: 40px 15px 40px 15px;
            padding: 15px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.1s;
        }
        
        .alchemy-item:active {
            transform: scale(0.99);
            background: rgba(60, 90, 140, 0.7);
        }
        
        .alchemy-header {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .alchemy-icon {
            font-size: 24px;
            min-width: 40px;
            text-align: center;
            color: #4affaa;
        }
        
        .alchemy-info {
            flex: 1;
        }
        
        .alchemy-name {
            font-size: 18px;
            font-weight: 600;
            font-family: 'Exo 2', sans-serif;
            color: #ffffff;
            margin-bottom: 4px;
        }
        
        .alchemy-formula {
            font-size: 12px;
            color: #a0c0ff;
            font-family: 'Courier New', monospace;
        }
        
        .alchemy-progress {
            min-width: 100px;
        }
        
        .progress-bar {
            width: 100px;
            height: 6px;
            background: rgba(0,0,0,0.3);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 4px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a8ac0, #8ac0ff);
            border-radius: 3px;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            font-size: 10px;
            color: #ffd966;
            text-align: right;
        }
        
        .alchemy-level {
            font-size: 11px;
            color: #4affaa;
            text-align: right;
        }
        
        /* Rarity group headers (for Discoveries) */
        .rarity-group {
            margin-bottom: 20px;
        }
        
        .rarity-header {
            font-family: 'Exo 2', sans-serif;
            font-size: 18px;
            font-weight: 600;
            padding: 8px 15px;
            margin-bottom: 10px;
            border-radius: 40px 10px 40px 10px;
            background: rgba(30, 45, 70, 0.8);
            border-left: 4px solid;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .rarity-header.common { 
            border-left-color: #ffffff; 
            color: #ffffff;
        }
        .rarity-header.uncommon { 
            border-left-color: #b0ffb0; 
            color: #b0ffb0;
        }
        .rarity-header.rare { 
            border-left-color: #b0b0ff; 
            color: #b0b0ff;
        }
        .rarity-header.very-rare { 
            border-left-color: #e0b0ff; 
            color: #e0b0ff;
        }
        .rarity-header.legendary { 
            border-left-color: #ffd700; 
            color: #ffd700;
        }
        
        /* Elements Grid (for Discoveries) */
        .elements-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .element-card {
            background: rgba(30, 45, 70, 0.6);
            backdrop-filter: blur(10px);
            border: 2px solid;
            border-radius: 40px 15px 40px 15px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.1s;
        }
        
        .element-card:active {
            transform: scale(0.99);
            background: rgba(60, 90, 140, 0.7);
        }
        
        .element-main-row {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .element-symbol {
            font-size: 28px;
            font-weight: 700;
            font-family: 'Courier New', monospace;
            min-width: 50px;
            text-align: center;
        }
        
        .element-info {
            flex: 1;
        }
        
        .element-name-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 4px;
        }
        
        .element-name {
            font-size: 18px;
            font-weight: 600;
            font-family: 'Exo 2', sans-serif;
        }
        
        .element-count {
            font-size: 14px;
            color: #ffd966;
            background: rgba(0,0,0,0.3);
            padding: 2px 8px;
            border-radius: 20px;
        }
        
        .element-details {
            display: flex;
            gap: 15px;
            color: #a0c0ff;
            font-size: 12px;
        }
        
        .element-first-found {
            color: #6a8ac0;
        }
        
        .element-mass {
            color: #4affaa;
        }
        
        .expand-icon {
            color: #a0c0ff;
            font-size: 20px;
            transition: transform 0.3s;
            margin-left: 10px;
        }
        
        .expand-icon.expanded {
            transform: rotate(90deg);
        }
        
        /* Expanded Locations */
        .locations-section {
            display: none;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(74, 138, 192, 0.3);
        }
        
        .locations-section.show {
            display: block;
        }
        
        .locations-title {
            color: #a0c0ff;
            font-size: 12px;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        
        .location-item {
            background: rgba(0,0,0,0.2);
            border: 1px solid #4a8ac0;
            border-radius: 30px 8px 30px 8px;
            padding: 12px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.1s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .location-item:active {
            background: rgba(74, 138, 192, 0.3);
            transform: scale(0.98);
        }
        
        .location-planet {
            color: #ffaa4a;
            font-size: 16px;
            font-weight: 600;
            font-family: 'Exo 2', sans-serif;
        }
        
        .location-date {
            color: #6a8ac0;
            font-size: 11px;
        }
        
        .warp-hint {
            color: #4affaa;
            font-size: 11px;
            text-align: right;
            font-style: italic;
        }
        
        /* Rarity Colors */
        .rarity-common { 
            border-color: #ffffff; 
            color: #ffffff;
        }
        .rarity-uncommon { 
            border-color: #b0ffb0; 
            color: #b0ffb0;
        }
        .rarity-rare { 
            border-color: #b0b0ff; 
            color: #b0b0ff;
        }
        .rarity-very-rare { 
            border-color: #e0b0ff; 
            color: #e0b0ff;
        }
        .rarity-legendary { 
            border-color: #ffd700; 
            color: #ffd700;
        }
        
        /* Warp Confirmation Modal */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(5px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 200;
        }
        
        .modal-overlay.active {
            display: flex;
        }
        
        .modal-content {
            background: rgba(20, 30, 50, 0.95);
            backdrop-filter: blur(15px);
            border: 3px solid #4affaa;
            border-radius: 60px 20px 60px 20px;
            padding: 25px;
            width: 280px;
            text-align: center;
            color: #ffffff;
            box-shadow: 0 0 30px #4affaa;
        }
        
        .modal-title {
            font-family: 'Exo 2', sans-serif;
            font-size: 24px;
            margin-bottom: 15px;
            font-weight: 600;
            color: #4affaa;
        }
        
        .modal-destination {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 5px;
            color: #ffaa4a;
        }
        
        .modal-planet-type {
            color: #a0c0ff;
            font-size: 12px;
            margin-bottom: 20px;
        }
        
        .modal-distance {
            background: rgba(0,0,0,0.3);
            border-radius: 30px 8px 30px 8px;
            padding: 10px;
            margin: 15px 0;
        }
        
        .modal-distance-value {
            color: #4affaa;
            font-size: 24px;
            font-weight: 700;
        }
        
        .modal-cycles {
            color: #ffd966;
            font-size: 14px;
            margin-top: 5px;
        }
        
        .modal-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .modal-btn {
            flex: 1;
            background: rgba(74, 138, 192, 0.3);
            border: 2px solid #6a8ac0;
            color: #ffffff;
            padding: 14px;
            border-radius: 40px 10px 40px 10px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.1s;
            font-family: 'Exo 2', sans-serif;
            font-weight: 600;
        }
        
        .modal-btn:active {
            background: #6a8ac0;
            transform: scale(0.95);
        }
        
        .modal-btn.warp {
            background: rgba(74, 255, 170, 0.2);
            border-color: #4affaa;
            color: #4affaa;
        }
        
        .modal-btn.warp:active {
            background: #4affaa;
            color: #0a0a1a;
        }
        
        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 50px 20px;
            color: #a0b0c0;
            background: rgba(30, 45, 70, 0.4);
            border-radius: 60px 20px 60px 20px;
            border: 2px dashed #6a8ac0;
            font-style: italic;
        }
        
        /* Back Button */
        .back-button {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #2a4a7a, #1a3a5a);
            border: 3px solid #ffaa4a;
            color: #ffffff;
            padding: 18px 35px;
            border-radius: 60px 20px 60px 20px;
            font-size: 20px;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Exo 2', sans-serif;
            transition: all 0.2s;
            width: fit-content;
            min-width: 280px;
            box-shadow: 0 0 30px #ffaa4a, 0 10px 20px rgba(0,0,0,0.5);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            letter-spacing: 1px;
            margin: 0;
            animation: subtle-pulse 3s infinite;
        }
        
        @keyframes subtle-pulse {
            0% { border-color: #ffaa4a; box-shadow: 0 0 20px #ffaa4a, 0 10px 20px rgba(0,0,0,0.5); }
            50% { border-color: #ffd966; box-shadow: 0 0 40px #ffd966, 0 10px 20px rgba(0,0,0,0.5); }
            100% { border-color: #ffaa4a; box-shadow: 0 0 20px #ffaa4a, 0 10px 20px rgba(0,0,0,0.5); }
        }
        
        .back-button:active {
            transform: translateX(-50%) scale(0.96);
            background: #3a5a8a;
        }
        
        .back-arrow {
            font-size: 28px;
            color: #ffd966;
            font-weight: bold;
        }
        
        .back-icon {
            font-size: 24px;
            filter: drop-shadow(0 0 5px #ffaa4a);
        }
        
        .back-text {
            flex: 0 1 auto;
        }
        
        /* Craft Notification Animation */
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
        
        /* Migration status (debug) */
        .migration-status {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.5);
            color: #a0c0ff;
            font-size: 10px;
            padding: 4px 8px;
            border-radius: 10px;
            z-index: 1001;
            display: none;
        }
    </style>
</head>
<body>
    <div class="phone-frame">
        <div class="journal-view" id="journalView">
            <!-- Header -->
            <div class="journal-header">
                <div class="journal-title">Journal</div>
                <div class="journal-subtitle">✦ knowledge archive ✦</div>
            </div>
            
            <!-- Tab Bar -->
            <div class="tab-bar">
                <button class="tab-btn active" id="discoveriesTab" onclick="window.switchTab('discoveries')">📖 DISCOVERIES</button>
                <button class="tab-btn" id="alchemyTab" onclick="window.switchTab('alchemy')">⚗️ ALCHEMY</button>
            </div>
            
            <!-- Stats Bar (visible in both tabs) -->
            <div class="stats-bar" id="statsBar">
                <div class="collection-stats">
                    <div class="stat-item">
                        <div class="stat-value" id="totalElements">0</div>
                        <div class="stat-label">TOTAL</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="uniqueElements">0</div>
                        <div class="stat-label">UNIQUE</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="totalMass">0</div>
                        <div class="stat-label">MASS</div>
                    </div>
                </div>
            </div>
            
            <!-- Filter Bar (Discoveries only) -->
            <div class="filter-bar" id="filterBar">
                <span class="filter-btn active" onclick="window.filterElements('all')">ALL</span>
                <span class="filter-btn" onclick="window.filterElements('common')">COMMON</span>
                <span class="filter-btn" onclick="window.filterElements('uncommon')">UNCOMMON</span>
                <span class="filter-btn" onclick="window.filterElements('rare')">RARE</span>
                <span class="filter-btn" onclick="window.filterElements('very-rare')">VERY RARE</span>
                <span class="filter-btn" onclick="window.filterElements('legendary')">LEGENDARY</span>
            </div>
            
            <!-- Content Container - switches between Discoveries and Alchemy -->
            <div id="contentContainer"></div>
            
            <!-- Back button -->
            <button class="back-button" onclick="window.returnToBridge()">
                <span class="back-arrow">←</span>
                <span class="back-text">SHIP BRIDGE</span>
                <span class="back-icon">🚀</span>
            </button>
        </div>
        
        <!-- Warp Confirmation Modal -->
        <div class="modal-overlay" id="warpModal">
            <div class="modal-content">
                <div class="modal-title">🚀 WARP TO PLANET</div>
                <div class="modal-destination" id="modalPlanet">Earth</div>
                <div class="modal-planet-type" id="modalPlanetType">Lush Planet</div>
                
                <div class="modal-distance">
                    <div>Estimated Distance</div>
                    <div class="modal-distance-value" id="modalDistance">0.0 LY</div>
                    <div class="modal-cycles" id="modalCycles">0 cycles • 0⭐</div>
                </div>
                
                <p class="warning-text">This will start a warp journey</p>
                
                <div class="modal-buttons">
                    <button class="modal-btn warp" onclick="window.confirmWarp()">WARP</button>
                    <button class="modal-btn" onclick="window.closeWarpModal()">CANCEL</button>
                </div>
            </div>
        </div>
        
        <!-- Loading Overlay -->
        <div class="loading-overlay" id="loadingOverlay">
            <div class="loading-spinner"></div>
            <div class="loading-text" id="loadingText">loading journal...</div>
        </div>
        
        <!-- Migration status (debug) -->
        <div class="migration-status" id="migrationStatus"></div>
    </div>

    <!-- Scripts -->
    <script type="module" src="js/db.js"></script>
    <script type="module" src="js/storage.js"></script>
    <script type="module" src="js/navigation.js"></script>
    <script type="module" src="js/migration.js"></script>
    <script type="module" src="js/planet-utils.js"></script>
    <script type="module" src="js/alchemy.js"></script>

    <script type="module">
        import { PLANET_TYPE_DATA } from './js/planet-utils.js';
        import { 
            ALCHEMY_RECIPES, 
            getLevelFromProgress, 
            craftItem as alchemyCraft,
            getRecipesWithProgress,
            hasIngredients 
        } from './js/alchemy.js';

        // ===== TELEGRAM INITIALIZATION =====
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
        }

        // ===== DOM ELEMENTS =====
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        const contentContainer = document.getElementById('contentContainer');
        const warpModal = document.getElementById('warpModal');
        const filterBar = document.getElementById('filterBar');
        const discoveriesTab = document.getElementById('discoveriesTab');
        const alchemyTab = document.getElementById('alchemyTab');

        // ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE =====
        window.filterElements = filterElements;
        window.toggleExpand = toggleExpand;
        window.showWarpModal = showWarpModal;
        window.closeWarpModal = closeWarpModal;
        window.confirmWarp = confirmWarp;
        window.returnToBridge = returnToBridge;
        window.switchTab = switchTab;
        window.openAlchemyItem = openAlchemyItem;
        window.closeCraftModal = closeCraftModal;
        window.craftItem = craftItem;
        
        // Expose alchemy data globally
        window.ALCHEMY_RECIPES = ALCHEMY_RECIPES;
        window.getLevelFromProgress = getLevelFromProgress;
        window.getRecipesWithProgress = getRecipesWithProgress;

        // ===== STATE =====
        let allElements = [];
        let filteredElements = [];
        let currentFilter = 'all';
        let expandedElement = null;
        let currentTab = 'discoveries';
        
        // Current warp target
        let currentWarpTarget = null;
        
        // Locations cache
        let locationsCache = {};

        // ===== ELEMENT DATA =====
        const elementData = {
            // Common
            'Hydrogen': { symbol: 'H', rarity: 'common', mass: 1.008 },
            'Helium': { symbol: 'He', rarity: 'common', mass: 4.003 },
            'Lithium': { symbol: 'Li', rarity: 'common', mass: 6.94 },
            'Beryllium': { symbol: 'Be', rarity: 'common', mass: 9.012 },
            'Boron': { symbol: 'B', rarity: 'common', mass: 10.81 },
            'Carbon': { symbol: 'C', rarity: 'uncommon', mass: 12.01 },
            'Nitrogen': { symbol: 'N', rarity: 'uncommon', mass: 14.01 },
            'Oxygen': { symbol: 'O', rarity: 'uncommon', mass: 16.00 },
            'Fluorine': { symbol: 'F', rarity: 'uncommon', mass: 19.00 },
            'Neon': { symbol: 'Ne', rarity: 'uncommon', mass: 20.18 },
            'Sodium': { symbol: 'Na', rarity: 'common', mass: 22.99 },
            'Magnesium': { symbol: 'Mg', rarity: 'common', mass: 24.31 },
            'Aluminum': { symbol: 'Al', rarity: 'common', mass: 26.98 },
            'Silicon': { symbol: 'Si', rarity: 'common', mass: 28.09 },
            'Phosphorus': { symbol: 'P', rarity: 'uncommon', mass: 30.97 },
            'Sulfur': { symbol: 'S', rarity: 'uncommon', mass: 32.06 },
            'Chlorine': { symbol: 'Cl', rarity: 'uncommon', mass: 35.45 },
            'Argon': { symbol: 'Ar', rarity: 'uncommon', mass: 39.95 },
            'Potassium': { symbol: 'K', rarity: 'common', mass: 39.10 },
            'Calcium': { symbol: 'Ca', rarity: 'common', mass: 40.08 },
            'Scandium': { symbol: 'Sc', rarity: 'common', mass: 44.96 },
            'Titanium': { symbol: 'Ti', rarity: 'rare', mass: 47.87 },
            'Vanadium': { symbol: 'V', rarity: 'common', mass: 50.94 },
            'Chromium': { symbol: 'Cr', rarity: 'common', mass: 52.00 },
            'Manganese': { symbol: 'Mn', rarity: 'common', mass: 54.94 },
            'Iron': { symbol: 'Fe', rarity: 'uncommon', mass: 55.85 },
            'Cobalt': { symbol: 'Co', rarity: 'common', mass: 58.93 },
            'Nickel': { symbol: 'Ni', rarity: 'common', mass: 58.69 },
            'Copper': { symbol: 'Cu', rarity: 'rare', mass: 63.55 },
            'Zinc': { symbol: 'Zn', rarity: 'rare', mass: 65.38 },
            'Gallium': { symbol: 'Ga', rarity: 'common', mass: 69.72 },
            'Germanium': { symbol: 'Ge', rarity: 'common', mass: 72.63 },
            'Arsenic': { symbol: 'As', rarity: 'common', mass: 74.92 },
            'Selenium': { symbol: 'Se', rarity: 'common', mass: 78.97 },
            'Bromine': { symbol: 'Br', rarity: 'common', mass: 79.90 },
            'Krypton': { symbol: 'Kr', rarity: 'common', mass: 83.80 },
            'Rubidium': { symbol: 'Rb', rarity: 'common', mass: 85.47 },
            'Strontium': { symbol: 'Sr', rarity: 'common', mass: 87.62 },
            'Yttrium': { symbol: 'Y', rarity: 'common', mass: 88.91 },
            'Zirconium': { symbol: 'Zr', rarity: 'common', mass: 91.22 },
            'Niobium': { symbol: 'Nb', rarity: 'common', mass: 92.91 },
            'Molybdenum': { symbol: 'Mo', rarity: 'common', mass: 95.95 },
            'Ruthenium': { symbol: 'Ru', rarity: 'common', mass: 101.1 },
            'Rhodium': { symbol: 'Rh', rarity: 'common', mass: 102.9 },
            'Palladium': { symbol: 'Pd', rarity: 'common', mass: 106.4 },
            'Silver': { symbol: 'Ag', rarity: 'rare', mass: 107.9 },
            'Cadmium': { symbol: 'Cd', rarity: 'common', mass: 112.4 },
            'Indium': { symbol: 'In', rarity: 'common', mass: 114.8 },
            'Tin': { symbol: 'Sn', rarity: 'rare', mass: 118.7 },
            'Antimony': { symbol: 'Sb', rarity: 'common', mass: 121.8 },
            'Tellurium': { symbol: 'Te', rarity: 'common', mass: 127.6 },
            'Iodine': { symbol: 'I', rarity: 'common', mass: 126.9 },
            'Xenon': { symbol: 'Xe', rarity: 'common', mass: 131.3 },
            'Cesium': { symbol: 'Cs', rarity: 'common', mass: 132.9 },
            'Barium': { symbol: 'Ba', rarity: 'common', mass: 137.3 },
            'Lanthanum': { symbol: 'La', rarity: 'common', mass: 138.9 },
            'Cerium': { symbol: 'Ce', rarity: 'common', mass: 140.1 },
            'Praseodymium': { symbol: 'Pr', rarity: 'common', mass: 140.9 },
            'Neodymium': { symbol: 'Nd', rarity: 'common', mass: 144.2 },
            'Samarium': { symbol: 'Sm', rarity: 'common', mass: 150.4 },
            'Europium': { symbol: 'Eu', rarity: 'common', mass: 152.0 },
            'Gadolinium': { symbol: 'Gd', rarity: 'common', mass: 157.3 },
            'Terbium': { symbol: 'Tb', rarity: 'common', mass: 158.9 },
            'Dysprosium': { symbol: 'Dy', rarity: 'common', mass: 162.5 },
            'Holmium': { symbol: 'Ho', rarity: 'common', mass: 164.9 },
            'Erbium': { symbol: 'Er', rarity: 'common', mass: 167.3 },
            'Thulium': { symbol: 'Tm', rarity: 'common', mass: 168.9 },
            'Ytterbium': { symbol: 'Yb', rarity: 'common', mass: 173.0 },
            'Lutetium': { symbol: 'Lu', rarity: 'common', mass: 175.0 },
            'Hafnium': { symbol: 'Hf', rarity: 'common', mass: 178.5 },
            'Tantalum': { symbol: 'Ta', rarity: 'common', mass: 180.9 },
            'Tungsten': { symbol: 'W', rarity: 'common', mass: 183.8 },
            'Rhenium': { symbol: 'Re', rarity: 'common', mass: 186.2 },
            'Osmium': { symbol: 'Os', rarity: 'common', mass: 190.2 },
            'Iridium': { symbol: 'Ir', rarity: 'common', mass: 192.2 },
            'Platinum': { symbol: 'Pt', rarity: 'rare', mass: 195.1 },
            'Gold': { symbol: 'Au', rarity: 'rare', mass: 197.0 },
            'Mercury': { symbol: 'Hg', rarity: 'rare', mass: 200.6 },
            'Thallium': { symbol: 'Tl', rarity: 'common', mass: 204.4 },
            'Lead': { symbol: 'Pb', rarity: 'rare', mass: 207.2 },
            'Bismuth': { symbol: 'Bi', rarity: 'common', mass: 209.0 },
            
            // Very Rare
            'Polonium': { symbol: 'Po', rarity: 'very-rare', mass: 209.0 },
            'Astatine': { symbol: 'At', rarity: 'very-rare', mass: 210.0 },
            'Radon': { symbol: 'Rn', rarity: 'very-rare', mass: 222.0 },
            'Francium': { symbol: 'Fr', rarity: 'very-rare', mass: 223.0 },
            'Radium': { symbol: 'Ra', rarity: 'very-rare', mass: 226.0 },
            'Actinium': { symbol: 'Ac', rarity: 'very-rare', mass: 227.0 },
            'Thorium': { symbol: 'Th', rarity: 'very-rare', mass: 232.0 },
            'Protactinium': { symbol: 'Pa', rarity: 'very-rare', mass: 231.0 },
            'Uranium': { symbol: 'U', rarity: 'very-rare', mass: 238.0 },
            
            // Legendary
            'Neptunium': { symbol: 'Np', rarity: 'legendary', mass: 237.0 },
            'Plutonium': { symbol: 'Pu', rarity: 'legendary', mass: 244.0 },
            'Americium': { symbol: 'Am', rarity: 'legendary', mass: 243.0 },
            'Curium': { symbol: 'Cm', rarity: 'legendary', mass: 247.0 },
            'Berkelium': { symbol: 'Bk', rarity: 'legendary', mass: 247.0 },
            'Californium': { symbol: 'Cf', rarity: 'legendary', mass: 251.0 },
            'Einsteinium': { symbol: 'Es', rarity: 'legendary', mass: 252.0 },
            'Fermium': { symbol: 'Fm', rarity: 'legendary', mass: 257.0 },
            'Mendelevium': { symbol: 'Md', rarity: 'legendary', mass: 258.0 },
            'Nobelium': { symbol: 'No', rarity: 'legendary', mass: 259.0 },
            'Lawrencium': { symbol: 'Lr', rarity: 'legendary', mass: 262.0 },
            'Rutherfordium': { symbol: 'Rf', rarity: 'legendary', mass: 267.0 },
            'Dubnium': { symbol: 'Db', rarity: 'legendary', mass: 268.0 },
            'Seaborgium': { symbol: 'Sg', rarity: 'legendary', mass: 269.0 },
            'Bohrium': { symbol: 'Bh', rarity: 'legendary', mass: 270.0 },
            'Hassium': { symbol: 'Hs', rarity: 'legendary', mass: 277.0 },
            'Meitnerium': { symbol: 'Mt', rarity: 'legendary', mass: 278.0 },
            'Darmstadtium': { symbol: 'Ds', rarity: 'legendary', mass: 281.0 },
            'Roentgenium': { symbol: 'Rg', rarity: 'legendary', mass: 282.0 },
            'Copernicium': { symbol: 'Cn', rarity: 'legendary', mass: 285.0 },
            'Nihonium': { symbol: 'Nh', rarity: 'legendary', mass: 286.0 },
            'Flerovium': { symbol: 'Fl', rarity: 'legendary', mass: 289.0 },
            'Moscovium': { symbol: 'Mc', rarity: 'legendary', mass: 290.0 },
            'Livermorium': { symbol: 'Lv', rarity: 'legendary', mass: 293.0 },
            'Tennessine': { symbol: 'Ts', rarity: 'legendary', mass: 294.0 },
            'Oganesson': { symbol: 'Og', rarity: 'legendary', mass: 294.0 }
        };

        // ===== GET ELEMENT SYMBOL =====
        function getElementSymbol(elementName) {
            return elementData[elementName]?.symbol || elementName.substring(0, 2);
        }

        // ===== GET ELEMENT RARITY =====
        function getElementRarity(elementName) {
            return elementData[elementName]?.rarity || 'common';
        }

        // ===== GET ELEMENT MASS =====
        function getElementMass(elementName) {
            return elementData[elementName]?.mass || 100.0;
        }

        // ===== GET RARITY CLASS =====
        function getRarityClass(elementName) {
            const rarity = getElementRarity(elementName);
            return `rarity-${rarity}`;
        }

        // ===== GET PLANET TYPE ICON =====
        function getPlanetTypeIcon(planetType) {
            const icons = {
                'scorched': '🔥',
                'barren': '🪨',
                'lush': '🌱',
                'frozen': '❄️',
                'gas': '🌪️',
                'oceanic': '💧',
                'toxic': '☣️',
                'asteroid': '🪐'
            };
            return icons[planetType] || '🪐';
        }

        // ===== LOAD LOCATIONS FOR ELEMENT =====
        async function loadLocationsForElement(elementName) {
            try {
                if (typeof window.getElementLocations === 'function') {
                    const locations = await window.getElementLocations(elementName);
                    return locations || [];
                }
                return [];
            } catch (error) {
                console.error(`Error loading locations for ${elementName}:`, error);
                return [];
            }
        }

        // ===== LOAD JOURNAL DATA =====
        async function loadJournalData() {
            try {
                loadingText.textContent = 'loading journal...';
                
                // Get collection
                let collection = {};
                if (typeof window.getCollection === 'function') {
                    collection = await window.getCollection();
                } else {
                    const saved = localStorage.getItem('voidfarer_collection');
                    collection = saved ? JSON.parse(saved) : {};
                }
                
                // Convert to array
                allElements = [];
                let totalMass = 0;
                let totalCount = 0;
                
                for (const [name, data] of Object.entries(collection)) {
                    const count = data.count || 1;
                    const mass = getElementMass(name);
                    const totalElementMass = count * mass;
                    totalMass += totalElementMass;
                    totalCount += count;
                    
                    allElements.push({
                        name: name,
                        count: count,
                        mass: mass,
                        totalMass: totalElementMass,
                        firstFound: data.firstFound || new Date().toISOString(),
                        symbol: getElementSymbol(name),
                        rarity: getElementRarity(name)
                    });
                }
                
                // Update stats
                document.getElementById('totalElements').textContent = totalCount;
                document.getElementById('uniqueElements').textContent = allElements.length;
                document.getElementById('totalMass').textContent = Math.round(totalMass);
                
                // Initialize alchemy progress if needed
                if (!localStorage.getItem('voidfarer_alchemy_progress')) {
                    localStorage.setItem('voidfarer_alchemy_progress', '{}');
                }
                
                // Render current tab
                renderCurrentTab();
                
            } catch (error) {
                console.error('Error loading journal:', error);
                contentContainer.innerHTML = '<div class="empty-state">Error loading journal</div>';
            }
        }

        // ===== RENDER CURRENT TAB =====
        function renderCurrentTab() {
            if (currentTab === 'discoveries') {
                renderDiscoveries();
            } else {
                renderAlchemy();
            }
        }

        // ===== SWITCH TAB =====
        function switchTab(tab) {
            currentTab = tab;
            
            // Update tab buttons
            if (tab === 'discoveries') {
                discoveriesTab.classList.add('active');
                alchemyTab.classList.remove('active');
                filterBar.style.display = 'flex';
            } else {
                discoveriesTab.classList.remove('active');
                alchemyTab.classList.add('active');
                filterBar.style.display = 'none';
            }
            
            renderCurrentTab();
            
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        }

        // ===== APPLY FILTERS =====
        function applyFilters() {
            if (currentFilter === 'all') {
                filteredElements = [...allElements];
            } else {
                filteredElements = allElements.filter(element => element.rarity === currentFilter);
            }
            
            renderDiscoveries();
        }

        // ===== FILTER ELEMENTS =====
        function filterElements(rarity) {
            currentFilter = rarity;
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            applyFilters();
        }

        // ===== TOGGLE ELEMENT EXPAND =====
        async function toggleExpand(elementName) {
            if (expandedElement === elementName) {
                expandedElement = null;
                renderDiscoveries();
            } else {
                expandedElement = elementName;
                
                // Load locations for this element if not cached
                if (!locationsCache[elementName]) {
                    locationsCache[elementName] = await loadLocationsForElement(elementName);
                }
                
                renderDiscoveries();
            }
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        }

        // ===== RENDER DISCOVERIES TAB =====
        function renderDiscoveries() {
            if (filteredElements.length === 0) {
                contentContainer.innerHTML = '<div class="empty-state">No elements discovered yet</div>';
                return;
            }
            
            // Group by rarity
            const rarityOrder = ['legendary', 'very-rare', 'rare', 'uncommon', 'common'];
            const grouped = {};
            
            filteredElements.forEach(element => {
                if (!grouped[element.rarity]) {
                    grouped[element.rarity] = [];
                }
                grouped[element.rarity].push(element);
            });
            
            // Sort elements within each group
            Object.keys(grouped).forEach(rarity => {
                grouped[rarity].sort((a, b) => a.name.localeCompare(b.name));
            });
            
            // Build HTML
            let html = '';
            
            rarityOrder.forEach(rarity => {
                const elements = grouped[rarity];
                if (!elements || elements.length === 0) return;
                
                // Rarity header
                const rarityDisplay = rarity.charAt(0).toUpperCase() + rarity.slice(1);
                html += `
                    <div class="rarity-group">
                        <div class="rarity-header ${rarity}">✦ ${rarityDisplay} ✦</div>
                        <div class="elements-grid">
                `;
                
                // Element cards
                elements.forEach(element => {
                    const isExpanded = expandedElement === element.name;
                    const firstFoundDate = new Date(element.firstFound).toLocaleDateString();
                    
                    // Get locations from cache
                    const elementLocations = locationsCache[element.name] || [];
                    
                    // Build locations HTML
                    let locationsHtml = '';
                    if (elementLocations.length > 0) {
                        const planetCounts = {};
                        elementLocations.forEach(loc => {
                            const planet = loc.planet || 'Unknown';
                            planetCounts[planet] = (planetCounts[planet] || 0) + 1;
                        });
                        
                        Object.entries(planetCounts).forEach(([planet, count]) => {
                            const location = elementLocations.find(l => l.planet === planet);
                            const date = location?.discoveredDate;
                            const displayDate = date ? new Date(date).toLocaleDateString() : 'Unknown';
                            
                            let planetType = 'unknown';
                            if (location?.planetType) {
                                planetType = location.planetType;
                            } else {
                                if (planet.toLowerCase().includes('pyros')) planetType = 'scorched';
                                else if (planet.toLowerCase().includes('verdant')) planetType = 'lush';
                                else if (planet.toLowerCase().includes('glacier')) planetType = 'frozen';
                                else if (planet.toLowerCase().includes('earth')) planetType = 'lush';
                            }
                            
                            const typeIcon = getPlanetTypeIcon(planetType);
                            
                            locationsHtml += `
                                <div class="location-item" onclick="window.showWarpModal('${planet}', '${planetType}')">
                                    <div>
                                        <div class="location-planet">${typeIcon} ${planet}</div>
                                        <div class="location-date">Found: ${displayDate} • ${count} time${count !== 1 ? 's' : ''}</div>
                                    </div>
                                    <div class="warp-hint">Warp →</div>
                                </div>
                            `;
                        });
                    } else {
                        locationsHtml = `
                            <div style="color: #a0c0ff; padding: 10px; text-align: center; font-style: italic;">
                                No location data available
                            </div>
                        `;
                    }
                    
                    html += `
                        <div class="element-card ${getRarityClass(element.name)}">
                            <div class="element-main-row" onclick="window.toggleExpand('${element.name}')">
                                <div class="element-symbol">${element.symbol}</div>
                                <div class="element-info">
                                    <div class="element-name-row">
                                        <span class="element-name">${element.name}</span>
                                        <span class="element-count">${element.count}</span>
                                    </div>
                                    <div class="element-details">
                                        <span class="element-mass">⚖️ ${element.totalMass.toFixed(1)} AMU</span>
                                        <span class="element-first-found">📅 ${firstFoundDate}</span>
                                    </div>
                                </div>
                                <div class="expand-icon ${isExpanded ? 'expanded' : ''}">▶</div>
                            </div>
                            
                            <div class="locations-section ${isExpanded ? 'show' : ''}">
                                <div class="locations-title">📍 Found on these planets:</div>
                                ${locationsHtml}
                            </div>
                        </div>
                    `;
                });
                
                html += `</div></div>`;
            });
            
            contentContainer.innerHTML = html;
        }

        // ===== RENDER ALCHEMY TAB =====
        function renderAlchemy() {
            // Get recipes with progress
            const recipesWithProgress = getRecipesWithProgress();
            
            if (Object.keys(recipesWithProgress).length === 0) {
                contentContainer.innerHTML = '<div class="empty-state">Alchemy recipes loading...</div>';
                return;
            }
            
            let html = '';
            
            for (const [category, items] of Object.entries(recipesWithProgress)) {
                // Check if any items in this category are unlocked
                const hasUnlocked = items.some(item => item.unlocked);
                if (!hasUnlocked) continue;
                
                html += `<div class="alchemy-category">`;
                html += `<div class="category-header">✦ ${category} ✦</div>`;
                
                items.forEach(item => {
                    if (!item.unlocked) return; // Skip locked items
                    
                    const percentComplete = Math.min(100, Math.round((item.progress / item.target) * 100));
                    
                    html += `
                        <div class="alchemy-item" onclick="window.openAlchemyItem('${item.id}')">
                            <div class="alchemy-header">
                                <div class="alchemy-icon">${item.icon}</div>
                                <div class="alchemy-info">
                                    <div class="alchemy-name">${item.name}</div>
                                    <div class="alchemy-formula">${item.formula}</div>
                                </div>
                                <div class="alchemy-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${percentComplete}%"></div>
                                    </div>
                                    <div class="progress-text">${item.progress}/${item.target}</div>
                                    <div class="alchemy-level" style="color: ${item.progress > 0 ? '#4affaa' : '#a0c0ff'}">${item.level}</div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                html += `</div>`;
            }
            
            contentContainer.innerHTML = html || '<div class="empty-state">No alchemy recipes unlocked yet</div>';
        }

        // ===== OPEN ALCHEMY ITEM DETAIL =====
        function openAlchemyItem(recipeId) {
            // Find recipe
            let recipe = null;
            for (const category of Object.values(ALCHEMY_RECIPES)) {
                const found = category.find(r => r.id === recipeId);
                if (found) {
                    recipe = found;
                    break;
                }
            }
            
            if (!recipe) {
                alert('Recipe not found');
                return;
            }
            
            // Get current progress
            const alchemyProgress = JSON.parse(localStorage.getItem('voidfarer_alchemy_progress') || '{}');
            const progress = alchemyProgress[recipeId] || 0;
            const level = getLevelFromProgress(progress);
            
            // Get inventory to check available ingredients
            const inventory = JSON.parse(localStorage.getItem('voidfarer_collection') || '{}');
            
            // Check ingredient availability
            let ingredientsHtml = '';
            let canCraft = true;
            
            for (const [element, amount] of Object.entries(recipe.ingredients)) {
                const have = inventory[element] || 0;
                const enough = have >= amount;
                if (!enough) canCraft = false;
                
                ingredientsHtml += `
                    <div style="display: flex; justify-content: space-between; margin: 5px 0; color: ${enough ? '#4affaa' : '#ff6b6b'}">
                        <span>${element}</span>
                        <span>${have} / ${amount}</span>
                    </div>
                `;
            }
            
            const percentComplete = Math.min(100, Math.round((progress / recipe.target) * 100));
            
            // Craft modal HTML
            const modalHtml = `
                <div class="modal-overlay active" id="craftModal" style="z-index: 300;">
                    <div class="modal-content" style="width: 300px;">
                        <div class="modal-title">⚗️ ${recipe.name}</div>
                        <div class="alchemy-icon" style="font-size: 48px; text-align: center; margin: 10px;">${recipe.icon}</div>
                        
                        <div style="background: rgba(0,0,0,0.3); border-radius: 16px; padding: 15px; margin: 15px 0;">
                            <div style="color: #a0c0ff; margin-bottom: 10px;">Formula:</div>
                            <div style="font-family: 'Courier New', monospace; color: #ffd966; text-align: center; font-size: 16px;">
                                ${recipe.formula}
                            </div>
                        </div>
                        
                        <div style="background: rgba(0,0,0,0.3); border-radius: 16px; padding: 15px; margin: 15px 0;">
                            <div style="color: #a0c0ff; margin-bottom: 10px;">Current Knowledge:</div>
                            <div class="progress-bar" style="margin-bottom: 5px; width: 100%;">
                                <div class="progress-fill" style="width: ${percentComplete}%"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #ffd966;">${progress}/${recipe.target}</span>
                                <span style="color: #4affaa;">${level.name} (${level.multiplier}x)</span>
                            </div>
                        </div>
                        
                        <div style="background: rgba(0,0,0,0.3); border-radius: 16px; padding: 15px; margin: 15px 0;">
                            <div style="color: #a0c0ff; margin-bottom: 10px;">Required Materials:</div>
                            ${ingredientsHtml}
                        </div>
                        
                        <div class="modal-buttons" style="flex-direction: column; gap: 10px;">
                            <button class="modal-btn warp" onclick="window.craftItem('${recipeId}', 1)" ${!canCraft ? 'disabled style="opacity:0.5;"' : ''}>
                                CRAFT 1
                            </button>
                            <button class="modal-btn warp" onclick="window.craftItem('${recipeId}', 10)" ${!canCraft ? 'disabled style="opacity:0.5;"' : ''}>
                                CRAFT 10
                            </button>
                            <button class="modal-btn" onclick="window.closeCraftModal()">
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Remove any existing craft modal
            const existing = document.getElementById('craftModal');
            if (existing) existing.remove();
            
            // Add new modal
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        }

        // ===== CLOSE CRAFT MODAL =====
        function closeCraftModal() {
            const modal = document.getElementById('craftModal');
            if (modal) modal.remove();
        }

        // ===== CRAFT ITEM =====
        function craftItem(recipeId, count) {
            const result = alchemyCraft(recipeId, count);
            
            if (result.success) {
                // Show success notification
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(74, 255, 170, 0.2);
                    border: 2px solid #4affaa;
                    border-radius: 60px 20px 60px 20px;
                    padding: 20px 40px;
                    color: #4affaa;
                    font-family: 'Exo 2', sans-serif;
                    font-size: 18px;
                    text-align: center;
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                    animation: fadeInOut 2s forwards;
                `;
                
                // Find recipe name
                let recipeName = recipeId;
                for (const category of Object.values(ALCHEMY_RECIPES)) {
                    const found = category.find(r => r.id === recipeId);
                    if (found) {
                        recipeName = found.name;
                        break;
                    }
                }
                
                notification.innerHTML = `
                    ✦ Crafted ${count} ${recipeName} ✦<br>
                    <span style="font-size: 14px;">+${count} understanding</span>
                `;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                    // Refresh the alchemy view
                    closeCraftModal();
                    renderAlchemy();
                    
                    // Also update stats (elements were consumed)
                    loadJournalData();
                }, 2000);
                
                if (result.leveledUp) {
                    setTimeout(() => {
                        alert(`✦ LEVEL UP! ✦\nYou are now a ${result.newLevel}!`);
                    }, 500);
                }
            } else {
                alert(`Crafting failed: ${result.error}`);
            }
        }

        // ===== SHOW WARP MODAL =====
        function showWarpModal(planet, planetType = 'unknown') {
            currentWarpTarget = {
                planet: planet,
                planetType: planetType
            };
            
            // Calculate approximate distance (simplified for demo)
            const currentSector = localStorage.getItem('voidfarer_current_sector') || 'B2';
            const distance = (currentSector === 'B2') ? 2.3 : 4.6;
            const cycles = Math.min(5, Math.ceil(distance / 1.5));
            const fuel = Math.floor(distance * 4) + 5;
            
            document.getElementById('modalPlanet').textContent = planet;
            
            // Set planet type display
            let typeDisplay = 'Unknown';
            if (planetType && planetType !== 'unknown') {
                typeDisplay = planetType.charAt(0).toUpperCase() + planetType.slice(1) + ' Planet';
            }
            document.getElementById('modalPlanetType').textContent = typeDisplay;
            
            document.getElementById('modalDistance').textContent = distance.toFixed(1) + ' LY';
            document.getElementById('modalCycles').textContent = cycles + ' cycles • ' + fuel + '⭐';
            
            warpModal.classList.add('active');
            
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        }

        // ===== CLOSE WARP MODAL =====
        function closeWarpModal() {
            warpModal.classList.remove('active');
            currentWarpTarget = null;
        }

        // ===== CONFIRM WARP - FIXED to go to SURFACE not back to journal =====
        function confirmWarp() {
            if (!currentWarpTarget) return;
            
            loadingOverlay.classList.add('active');
            loadingText.textContent = 'plotting course...';
            
            try {
                // Get current location
                const currentPlanet = localStorage.getItem('voidfarer_current_planet') || 'Earth';
                const currentStar = localStorage.getItem('voidfarer_current_star') || 'Sol';
                const currentStarSector = localStorage.getItem('voidfarer_current_starSector') || 'Orion Molecular Cloud';
                const currentRegion = localStorage.getItem('voidfarer_current_region') || 'Orion Arm';
                const currentSector = localStorage.getItem('voidfarer_current_sector') || 'B2';
                
                // Parse distance from modal
                const distanceText = document.getElementById('modalDistance').textContent;
                const distance = parseFloat(distanceText);
                const cyclesText = document.getElementById('modalCycles').textContent;
                const cycles = parseInt(cyclesText.split(' ')[0]);
                const fuelText = cyclesText.split('•')[1].trim();
                const fuel = parseInt(fuelText.replace('⭐', ''));
                
                // CRITICAL: Save the destination planet so surface.html can load it
                // We're overriding the current planet with the destination
                localStorage.setItem('voidfarer_warp_destination_planet', currentWarpTarget.planet);
                localStorage.setItem('voidfarer_warp_destination_planet_type', currentWarpTarget.planetType);
                
                // Also save current location to return later if needed
                localStorage.setItem('voidfarer_warp_origin_planet', currentPlanet);
                localStorage.setItem('voidfarer_warp_origin_star', currentStar);
                localStorage.setItem('voidfarer_warp_origin_starSector', currentStarSector);
                localStorage.setItem('voidfarer_warp_origin_region', currentRegion);
                localStorage.setItem('voidfarer_warp_origin_sector', currentSector);
                
                // Prepare warp data with return page = surface.html
                const warpData = {
                    destination: currentWarpTarget.planet,
                    destinationType: currentWarpTarget.planetType,
                    startLocation: currentPlanet,
                    startLocationType: 'planet',
                    totalDistance: distance,
                    warpCycles: cycles,
                    fuelCost: fuel,
                    returnPage: 'surface.html',  // CRITICAL: Go to surface, not journal
                    
                    destPlanet: currentWarpTarget.planet,
                    destPlanetType: currentWarpTarget.planetType,
                    
                    destSector: currentSector,  // Note: We're keeping sector info the same
                    destRegion: currentRegion,  // This assumes the planet is in same region
                    destStarSector: currentStarSector,
                    destStar: currentStar
                };
                
                localStorage.setItem('voidfarer_warp_data', JSON.stringify(warpData));
                
                // Navigate to warp
                setTimeout(() => {
                    window.location.href = 'warp.html';
                }, 500);
                
            } catch (error) {
                console.error('Warp error:', error);
                loadingOverlay.classList.remove('active');
                alert('Failed to plot course');
            }
            
            closeWarpModal();
        }

        // ===== RETURN TO BRIDGE =====
        function returnToBridge() {
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            window.location.href = 'ship-bridge.html';
        }

        // ===== INITIALIZE =====
        async function init() {
            try {
                loadingOverlay.classList.add('active');
                loadingText.textContent = 'opening journal...';
                
                await loadJournalData();
                
                setTimeout(() => {
                    loadingOverlay.classList.remove('active');
                }, 500);
                
            } catch (error) {
                console.error('Init error:', error);
                loadingText.textContent = 'error loading journal';
                setTimeout(() => {
                    loadingOverlay.classList.remove('active');
                }, 2000);
            }
        }

        // ===== START =====
        init();
    </script>
</body>
</html>

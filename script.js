// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
  // Hide loading
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'none';
  
  // Game state
  let playerName = 'Explorer';
  let resources = {
    wood: 15,
    stone: 10,
    food: 8,
    metal: 3,
    cloth: 5,
    crystal: 0,
    oil: 0
  };
  
  let inventory = [];
  let tools = [];
  let currentMessage = 'The air is cold. You need resources to survive.';
  let day = 1;
  let health = 100;
  let maxHealth = 100;
  let score = 0;
  let discoveries = [];
  
  // NEW: Game phases
  let phase = 'planet'; // 'planet', 'space', 'colony'
  
  // NEW: Space exploration
  let spaceMap = [];
  let currentSector = { x: 0, y: 0 };
  let discoveredSectors = ['0,0'];
  
  // NEW: Colony building
  let colony = {
    population: 1,
    buildings: [],
    defense: 0,
    research: 0,
    happiness: 50
  };
  
  // NEW: Achievements
  let achievements = [];
  
  // Check Telegram
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    if (tg.initDataUnsafe?.user?.first_name) {
      playerName = tg.initDataUnsafe.user.first_name;
    }
  }
  
  // Start with pod screen
  showPod();
  
  function showPod() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    appEl.innerHTML = `
      <div style="background: #1e2439; border-radius: 30px; padding: 30px 20px; max-width: 400px; margin: 0 auto; border: 2px solid #4a90e2;">
        <h1 style="color: #4a90e2; text-align: center; margin-bottom: 20px;">🚀 THE FRONTIER</h1>
        <p style="color: #4a90e2; text-align: center; font-size: 22px;">${playerName}</p>
        
        <div style="margin: 30px 0;">
          <p style="text-align: center;">Day ${day} | Score: ${score}</p>
          <p style="text-align: center;">❤️ ${health}%</p>
        </div>
        
        <div style="background: #151a2b; border-radius: 15px; padding: 15px; margin: 20px 0;">
          <p style="color: #4a90e2; margin-bottom: 10px;">🎯 YOUR JOURNEY</p>
          <p>1. Survive the crash</p>
          <p>2. Build a ship</p>
          <p>3. Explore space</p>
          <p>4. Build a colony</p>
          <p>5. ???</p>
        </div>
        
        <button id="startBtn" style="width: 100%; padding: 16px; background: #4a90e2; color: white; border: none; border-radius: 15px; font-size: 18px; cursor: pointer;">BEGIN</button>
      </div>
    `;
    
    document.getElementById('startBtn').addEventListener('click', showPlanet);
  }
  
  function showPlanet() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    if (phase === 'planet') {
      showPlanetPhase();
    } else if (phase === 'space') {
      showSpacePhase();
    } else if (phase === 'colony') {
      showColonyPhase();
    }
  }
  
  function showPlanetPhase() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    // Check if ship is built (simplified for now)
    const shipBuilt = tools.includes('🚀 Basic Ship');
    
    appEl.innerHTML = `
      <div style="background: #1e2439; border-radius: 30px; padding: 20px; max-width: 450px; margin: 0 auto; border: 2px solid #4a90e2;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <h2 style="color: #4a90e2;">🌍 CRASH SITE</h2>
          <span>Day ${day}</span>
        </div>
        
        <!-- Stats -->
        <div style="display: flex; gap: 15px; margin-bottom: 15px;">
          <span>❤️ ${health}</span>
          <span>⭐ ${score}</span>
          <span>👥 ${colony.population}</span>
        </div>
        
        <!-- Resources -->
        <div style="background: #151a2b; border-radius: 15px; padding: 15px; margin-bottom: 15px;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
            <div><div>🪵</div><div>${resources.wood}</div></div>
            <div><div>🪨</div><div>${resources.stone}</div></div>
            <div><div>🍎</div><div>${resources.food}</div></div>
            <div><div>🔩</div><div>${resources.metal}</div></div>
            <div><div>🧵</div><div>${resources.cloth}</div></div>
            <div><div>💎</div><div>${resources.crystal}</div></div>
          </div>
        </div>
        
        <!-- Tools -->
        ${tools.length > 0 ? `
          <div style="background: #151a2b; border-radius: 10px; padding: 10px; margin-bottom: 15px;">
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${tools.map(t => `<span style="background: #2a3349; padding: 5px 12px; border-radius: 20px;">${t}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Message -->
        <div style="background: #151a2b; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
          ${currentMessage}
        </div>
        
        <!-- Actions -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px;">
          <button id="gatherWood" class="action-btn">🪵 Gather</button>
          <button id="gatherStone" class="action-btn">🪨 Mine</button>
          <button id="gatherFood" class="action-btn">🍎 Hunt</button>
          <button id="gatherMetal" class="action-btn">🔩 Scavenge</button>
        </div>
        
        <!-- Crafting -->
        <details style="margin-bottom: 15px;">
          <summary style="color: #4a90e2; padding: 10px; background: #151a2b; border-radius: 10px;">🔨 Crafting</summary>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 8px;">
            <button id="craftAxe" class="craft-btn">🪓 Axe<br><small>5 wood, 3 stone</small></button>
            <button id="craftPickaxe" class="craft-btn">⛏️ Pickaxe<br><small>3 wood, 5 stone</small></button>
            <button id="craftSpear" class="craft-btn">🔱 Spear<br><small>4 wood, 1 stone</small></button>
            <button id="craftCampfire" class="craft-btn">🔥 Campfire<br><small>3 wood, 2 food</small></button>
            <button id="craftBed" class="craft-btn">🛏️ Bed<br><small>8 wood, 4 cloth</small></button>
            <button id="craftFurnace" class="craft-btn">🔥 Furnace<br><small>10 stone, 5 wood</small></button>
          </div>
        </details>
        
        <!-- Special -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 15px 0;">
          <button id="restBtn" class="special-btn">😴 Rest</button>
          <button id="exploreBtn" class="special-btn">🗺️ Explore</button>
        </div>
        
        <!-- Build Ship - SHOWS ONCE YOU HAVE ENOUGH -->
        ${resources.wood >= 30 && resources.metal >= 20 && !shipBuilt ? `
          <button id="buildShipBtn" style="width: 100%; padding: 15px; background: #4a90e2; border: none; border-radius: 10px; color: white; font-weight: bold; margin: 10px 0; cursor: pointer;">
            🚀 BUILD SHIP (30 wood, 20 metal)
          </button>
        ` : ''}
        
        <!-- Launch - ONLY IF SHIP IS BUILT -->
        ${shipBuilt ? `
          <button id="launchBtn" style="width: 100%; padding: 15px; background: #00ff88; color: black; border: none; border-radius: 10px; font-weight: bold; margin: 10px 0; cursor: pointer;">
            🚀 LAUNCH INTO SPACE
          </button>
        ` : ''}
        
        <!-- Back to pod -->
        <button id="backBtn" style="width: 100%; padding: 12px; background: #2a3349; border: none; border-radius: 10px; color: white; margin-top: 10px; cursor: pointer;">⬅ RETURN TO POD</button>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('gatherWood')?.addEventListener('click', () => gather('wood'));
    document.getElementById('gatherStone')?.addEventListener('click', () => gather('stone'));
    document.getElementById('gatherFood')?.addEventListener('click', () => gather('food'));
    document.getElementById('gatherMetal')?.addEventListener('click', () => gather('metal'));
    
    document.getElementById('craftAxe')?.addEventListener('click', () => craft('axe'));
    document.getElementById('craftPickaxe')?.addEventListener('click', () => craft('pickaxe'));
    document.getElementById('craftSpear')?.addEventListener('click', () => craft('spear'));
    document.getElementById('craftCampfire')?.addEventListener('click', () => craft('campfire'));
    document.getElementById('craftBed')?.addEventListener('click', () => craft('bed'));
    document.getElementById('craftFurnace')?.addEventListener('click', () => craft('furnace'));
    
    document.getElementById('restBtn')?.addEventListener('click', rest);
    document.getElementById('exploreBtn')?.addEventListener('click', explore);
    document.getElementById('buildShipBtn')?.addEventListener('click', buildShip);
    document.getElementById('launchBtn')?.addEventListener('click', launchShip);
    document.getElementById('backBtn')?.addEventListener('click', showPod);
  }
  
  function showSpacePhase() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    appEl.innerHTML = `
      <div style="background: #0a0c1a; border-radius: 30px; padding: 20px; max-width: 450px; margin: 0 auto; border: 2px solid #4a90e2;">
        
        <!-- Header -->
        <h2 style="color: #4a90e2; text-align: center; margin-bottom: 20px;">🚀 DEEP SPACE</h2>
        
        <!-- Stats -->
        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
          <span>⭐ ${score}</span>
          <span>❤️ ${health}</span>
          <span>⛽ Fuel: ${resources.oil || 0}</span>
        </div>
        
        <!-- Space Map -->
        <div style="background: #000; border-radius: 15px; padding: 20px; margin-bottom: 20px; text-align: center;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 10px;">
            <div style="background: #1a1f3a; padding: 15px; border-radius: 10px;">🪐</div>
            <div style="background: #1a1f3a; padding: 15px; border-radius: 10px;">✨</div>
            <div style="background: #1a1f3a; padding: 15px; border-radius: 10px; border: 2px solid #4a90e2;">🚀</div>
            <div style="background: #1a1f3a; padding: 15px; border-radius: 10px;">🌌</div>
            <div style="background: #1a1f3a; padding: 15px; border-radius: 10px;">💫</div>
            <div style="background: #1a1f3a; padding: 15px; border-radius: 10px;">☄️</div>
          </div>
          <p style="color: #8f9bb5;">Current Sector: ${currentSector.x},${currentSector.y}</p>
        </div>
        
        <!-- Message -->
        <div style="background: #151a2b; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
          ${currentMessage}
        </div>
        
        <!-- Space Actions -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <button id="scanBtn" class="action-btn">📡 Scan Sector</button>
          <button id="moveUp" class="action-btn">⬆️ Move Up</button>
          <button id="moveDown" class="action-btn">⬇️ Move Down</button>
          <button id="moveLeft" class="action-btn">⬅️ Move Left</button>
          <button id="moveRight" class="action-btn">➡️ Move Right</button>
          <button id="landBtn" class="action-btn">🪐 Land on Planet</button>
        </div>
        
        <!-- Return -->
        <button id="backToPod" style="width: 100%; padding: 12px; background: #2a3349; border: none; border-radius: 10px; color: white; margin-top: 20px; cursor: pointer;">⬅ RETURN TO POD</button>
      </div>
    `;
    
    document.getElementById('scanBtn')?.addEventListener('click', scanSector);
    document.getElementById('moveUp')?.addEventListener('click', () => moveInSpace(0, 1));
    document.getElementById('moveDown')?.addEventListener('click', () => moveInSpace(0, -1));
    document.getElementById('moveLeft')?.addEventListener('click', () => moveInSpace(-1, 0));
    document.getElementById('moveRight')?.addEventListener('click', () => moveInSpace(1, 0));
    document.getElementById('landBtn')?.addEventListener('click', landOnPlanet);
    document.getElementById('backToPod')?.addEventListener('click', showPod);
  }
  
  function showColonyPhase() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    appEl.innerHTML = `
      <div style="background: #1e2439; border-radius: 30px; padding: 20px; max-width: 450px; margin: 0 auto; border: 2px solid #4a90e2;">
        
        <!-- Header -->
        <h2 style="color: #4a90e2; text-align: center;">🏰 NEW COLONY</h2>
        <p style="text-align: center; margin-bottom: 20px;">Day ${day}</p>
        
        <!-- Colony Stats -->
        <div style="background: #151a2b; border-radius: 15px; padding: 15px; margin-bottom: 15px;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div>Population: ${colony.population}</div>
            <div>Happiness: ${colony.happiness}%</div>
            <div>Defense: ${colony.defense}</div>
            <div>Research: ${colony.research}</div>
          </div>
        </div>
        
        <!-- Buildings -->
        <h3 style="color: #4a90e2;">Buildings</h3>
        <div style="background: #151a2b; border-radius: 15px; padding: 15px; margin-bottom: 15px;">
          ${colony.buildings.length > 0 ? colony.buildings.map(b => `
            <div style="padding: 5px;">${b}</div>
          `).join('') : 'No buildings yet'}
        </div>
        
        <!-- Build Options -->
        <h3 style="color: #4a90e2;">Construct</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px;">
          <button id="buildHouse" class="craft-btn">🏠 House<br><small>20 wood, 10 stone</small></button>
          <button id="buildFarm" class="craft-btn">🌾 Farm<br><small>15 wood, 5 cloth</small></button>
          <button id="buildWall" class="craft-btn">🧱 Wall<br><small>30 stone</small></button>
          <button id="buildLab" class="craft-btn">🔬 Lab<br><small>25 metal, 10 crystal</small></button>
        </div>
        
        <!-- Message -->
        <div style="background: #151a2b; border-radius: 10px; padding: 15px; margin: 15px 0;">
          ${currentMessage}
        </div>
        
        <!-- Actions -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <button id="workBtn" class="action-btn">⚒️ Work</button>
          <button id="tradeBtn" class="action-btn">🤝 Trade</button>
          <button id="exploreSpaceBtn" class="action-btn">🚀 Explore Space</button>
          <button id="researchBtn" class="action-btn">📚 Research</button>
        </div>
        
        <!-- Return -->
        <button id="backToPod" style="width: 100%; padding: 12px; background: #2a3349; border: none; border-radius: 10px; color: white; margin-top: 20px; cursor: pointer;">⬅ RETURN TO POD</button>
      </div>
    `;
    
    document.getElementById('buildHouse')?.addEventListener('click', () => buildColony('house'));
    document.getElementById('buildFarm')?.addEventListener('click', () => buildColony('farm'));
    document.getElementById('buildWall')?.addEventListener('click', () => buildColony('wall'));
    document.getElementById('buildLab')?.addEventListener('click', () => buildColony('lab'));
    document.getElementById('workBtn')?.addEventListener('click', work);
    document.getElementById('tradeBtn')?.addEventListener('click', trade);
    document.getElementById('exploreSpaceBtn')?.addEventListener('click', () => {
      phase = 'space';
      showPlanet();
    });
    document.getElementById('researchBtn')?.addEventListener('click', research);
    document.getElementById('backToPod')?.addEventListener('click', showPod);
  }
  
  // GAME FUNCTIONS
  
  function gather(type) {
    let bonus = 1;
    if (tools.includes('🪓 Stone Axe') && type === 'wood') bonus = 2;
    if (tools.includes('⛏️ Stone Pickaxe') && type === 'stone') bonus = 2;
    if (tools.includes('🔱 Wooden Spear') && type === 'food') bonus = 2;
    
    const gain = Math.floor(Math.random() * 6) + 2 * bonus;
    resources[type] += gain;
    score += gain;
    
    // Random events
    const rand = Math.random();
    if (rand < 0.1) {
      resources.crystal += 1;
      currentMessage = `✨ You found a crystal! +${gain} ${type}, +1 crystal`;
    } else if (rand < 0.2) {
      health = Math.min(maxHealth, health + 5);
      currentMessage = `🌿 You feel stronger! +${gain} ${type}, +5 health`;
    } else {
      currentMessage = `You gathered ${gain} ${type}.`;
    }
    
    // Hunger
    resources.food = Math.max(0, resources.food - 1);
    if (resources.food === 0) {
      health -= 5;
    }
    
    showPlanet();
  }
  
  function craft(item) {
    if (item === 'axe' && resources.wood >= 5 && resources.stone >= 3) {
      resources.wood -= 5; resources.stone -= 3;
      tools.push('🪓 Stone Axe');
      currentMessage = 'Crafted Stone Axe!';
    }
    else if (item === 'pickaxe' && resources.wood >= 3 && resources.stone >= 5) {
      resources.wood -= 3; resources.stone -= 5;
      tools.push('⛏️ Stone Pickaxe');
      currentMessage = 'Crafted Pickaxe!';
    }
    else if (item === 'spear' && resources.wood >= 4 && resources.stone >= 1) {
      resources.wood -= 4; resources.stone -= 1;
      tools.push('🔱 Wooden Spear');
      currentMessage = 'Crafted Spear!';
    }
    else if (item === 'campfire' && resources.wood >= 3 && resources.food >= 2) {
      resources.wood -= 3; resources.food -= 2;
      inventory.push('🔥 Campfire');
      currentMessage = 'Crafted Campfire!';
    }
    else if (item === 'bed' && resources.wood >= 8 && resources.cloth >= 4) {
      resources.wood -= 8; resources.cloth -= 4;
      inventory.push('🛏️ Bed');
      currentMessage = 'Crafted Bed!';
    }
    else if (item === 'furnace' && resources.stone >= 10 && resources.wood >= 5) {
      resources.stone -= 10; resources.wood -= 5;
      inventory.push('🔥 Furnace');
      currentMessage = 'Crafted Furnace!';
    }
    else {
      currentMessage = 'Not enough resources!';
    }
    
    showPlanet();
  }
  
  function rest() {
    if (resources.food >= 2) {
      resources.food -= 2;
      let heal = 20;
      if (inventory.includes('🛏️ Bed')) heal += 20;
      if (inventory.includes('🔥 Campfire')) heal += 10;
      health = Math.min(maxHealth, health + heal);
      currentMessage = `You rest. +${heal} health.`;
    } else {
      currentMessage = 'Not enough food to rest.';
    }
    showPlanet();
  }
  
  function explore() {
    day++;
    resources.food -= 2;
    
    const events = [
      'You find an abandoned camp. +5 cloth',
      'A wild animal attacks! -10 health',
      'You discover a crystal cave. +2 crystal',
      'You find ancient ruins.',
      'Nothing special today.'
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    currentMessage = event;
    
    if (event.includes('cloth')) resources.cloth += 5;
    if (event.includes('health')) health -= 10;
    if (event.includes('crystal')) resources.crystal += 2;
    if (event.includes('ruins')) {
      discoveries.push('🗿 Ancient Ruins');
      score += 20;
    }
    
    if (resources.food <= 0) {
      health -= 10;
      currentMessage += ' You are starving!';
    }
    
    showPlanet();
  }
  
  function buildShip() {
    if (resources.wood >= 30 && resources.metal >= 20) {
      resources.wood -= 30;
      resources.metal -= 20;
      tools.push('🚀 Basic Ship');
      currentMessage = 'You built a ship! You can now explore space.';
      score += 100;
    }
    showPlanet();
  }
  
  function launchShip() {
    phase = 'space';
    currentMessage = 'You blast off into space! The planet shrinks behind you.';
    showPlanet();
  }
  
  function scanSector() {
    const discoveries = [
      '🌍 Habitable planet detected',
      '💎 Asteroid belt with minerals',
      '👾 Alien signals detected',
      '💀 Abandoned space station',
      '✨ Beautiful nebula'
    ];
    currentMessage = discoveries[Math.floor(Math.random() * discoveries.length)];
    showSpacePhase();
  }
  
  function moveInSpace(dx, dy) {
    if (resources.oil > 0 || resources.oil === undefined) {
      resources.oil = (resources.oil || 5) - 1;
      currentSector.x += dx;
      currentSector.y += dy;
      currentMessage = `Moved to sector ${currentSector.x},${currentSector.y}`;
    } else {
      currentMessage = 'Not enough fuel!';
    }
    showSpacePhase();
  }
  
  function landOnPlanet() {
    phase = 'colony';
    currentMessage = 'You land on a new planet. Time to build a colony!';
    showPlanet();
  }
  
  function buildColony(type) {
    if (type === 'house' && resources.wood >= 20 && resources.stone >= 10) {
      resources.wood -= 20; resources.stone -= 10;
      colony.buildings.push('🏠 House');
      colony.population += 2;
      colony.happiness += 10;
      currentMessage = 'Built a house! Population increased.';
    }
    else if (type === 'farm' && resources.wood >= 15 && resources.cloth >= 5) {
      resources.wood -= 15; resources.cloth -= 5;
      colony.buildings.push('🌾 Farm');
      resources.food += 10;
      currentMessage = 'Built a farm! Food production increased.';
    }
    else if (type === 'wall' && resources.stone >= 30) {
      resources.stone -= 30;
      colony.buildings.push('🧱 Wall');
      colony.defense += 20;
      currentMessage = 'Built a wall! Defense increased.';
    }
    else if (type === 'lab' && resources.metal >= 25 && resources.crystal >= 10) {
      resources.metal -= 25; resources.crystal -= 10;
      colony.buildings.push('🔬 Lab');
      colony.research += 15;
      currentMessage = 'Built a lab! Research increased.';
    }
    else {
      currentMessage = 'Not enough resources!';
    }
    showColonyPhase();
  }
  
  function work() {
    resources.food -= 1;
    resources.metal += 2;
    resources.wood += 2;
    currentMessage = 'You work the colony. Gathered some resources.';
    showColonyPhase();
  }
  
  function trade() {
    if (resources.crystal > 0) {
      resources.crystal -= 1;
      resources.metal += 5;
      resources.food += 5;
      currentMessage = 'Traded crystals for supplies.';
    } else {
      currentMessage = 'Nothing to trade.';
    }
    showColonyPhase();
  }
  
  function research() {
    if (resources.food >= 5) {
      resources.food -= 5;
      colony.research += 5;
      currentMessage = 'Research complete! New technologies discovered.';
    } else {
      currentMessage = 'Not enough food for research.';
    }
    showColonyPhase();
  }
});

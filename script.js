// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
  // Hide loading
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'none';
  
  // Game state
  let playerName = 'Explorer';
  let resources = {
    wood: 10,
    stone: 5,
    food: 3,
    metal: 0,
    cloth: 0
  };
  
  let inventory = [];
  let tools = [];
  let currentMessage = 'The air is cold. You need resources to survive.';
  let day = 1;
  let health = 100;
  
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
  
  // Show pod screen
  function showPod() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    appEl.innerHTML = `
      <div class="pod-screen">
        <h1>🚀 CRASH LANDING</h1>
        <p class="player-name">${playerName}</p>
        <p class="status-line">DAY ${day}</p>
        <p class="status-line">HEALTH: ${health}%</p>
        <p class="status-line">PLANET: UNKNOWN</p>
        <button class="wake-btn" id="wakeBtn">WAKE UP</button>
      </div>
    `;
    
    document.getElementById('wakeBtn').addEventListener('click', showPlanet);
  }
  
  // Show planet screen
  function showPlanet() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    appEl.innerHTML = `
      <div class="planet-view">
        <div class="header">
          <h2>🌍 DAY ${day}</h2>
          <div class="health-bar">
            <div class="health-fill" style="width: ${health}%"></div>
          </div>
        </div>
        
        <!-- Resources -->
        <div class="resources">
          <div class="resource-item">
            <span class="resource-icon">🪵</span>
            <span class="resource-value" id="woodValue">${resources.wood}</span>
            <span class="resource-label">WOOD</span>
          </div>
          <div class="resource-item">
            <span class="resource-icon">🪨</span>
            <span class="resource-value" id="stoneValue">${resources.stone}</span>
            <span class="resource-label">STONE</span>
          </div>
          <div class="resource-item">
            <span class="resource-icon">🍎</span>
            <span class="resource-value" id="foodValue">${resources.food}</span>
            <span class="resource-label">FOOD</span>
          </div>
          <div class="resource-item">
            <span class="resource-icon">🔩</span>
            <span class="resource-value" id="metalValue">${resources.metal}</span>
            <span class="resource-label">METAL</span>
          </div>
          <div class="resource-item">
            <span class="resource-icon">🧵</span>
            <span class="resource-value" id="clothValue">${resources.cloth}</span>
            <span class="resource-label">CLOTH</span>
          </div>
        </div>
        
        <!-- Tools -->
        ${tools.length > 0 ? `
          <div class="tools">
            ${tools.map(tool => `<span class="tool-badge">${tool}</span>`).join('')}
          </div>
        ` : ''}
        
        <!-- Message -->
        <div class="message" id="message">${currentMessage}</div>
        
        <!-- Action Buttons -->
        <div class="actions">
          <div class="action-btn" id="gatherWood">
            <span class="action-icon">🪵</span>
            <span>Gather Wood</span>
          </div>
          <div class="action-btn" id="gatherStone">
            <span class="action-icon">🪨</span>
            <span>Mine Stone</span>
          </div>
          <div class="action-btn" id="gatherFood">
            <span class="action-icon">🍎</span>
            <span>Hunt Food</span>
          </div>
          <div class="action-btn" id="gatherMetal">
            <span class="action-icon">🔩</span>
            <span>Scavenge Metal</span>
          </div>
        </div>
        
        <!-- Crafting Section - EACH BUTTON HAS UNIQUE ID -->
        <div class="crafting-section">
          <h3>🔨 CRAFTING</h3>
          <div class="crafting-grid">
            <div class="craft-btn" id="craftAxeBtn">
              <span>🪓 Stone Axe</span>
              <span class="craft-cost">5 wood, 3 stone</span>
            </div>
            <div class="craft-btn" id="craftPickaxeBtn">
              <span>⛏️ Stone Pickaxe</span>
              <span class="craft-cost">3 wood, 5 stone</span>
            </div>
            <div class="craft-btn" id="craftCampfireBtn">
              <span>🔥 Campfire</span>
              <span class="craft-cost">3 wood, 2 food</span>
            </div>
            <div class="craft-btn" id="craftSpearBtn">
              <span>🔱 Wooden Spear</span>
              <span class="craft-cost">4 wood, 1 stone</span>
            </div>
            <div class="craft-btn" id="craftBedBtn">
              <span>🛏️ Bed</span>
              <span class="craft-cost">8 wood, 4 cloth</span>
            </div>
            <div class="craft-btn" id="craftFurnaceBtn">
              <span>🔥 Furnace</span>
              <span class="craft-cost">10 stone, 5 wood</span>
            </div>
          </div>
        </div>
        
        <!-- Inventory -->
        ${inventory.length > 0 ? `
          <div class="inventory">
            <h3>📦 INVENTORY</h3>
            <div class="inventory-items">
              ${inventory.map(item => `
                <div class="inventory-item">${item}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Special Actions -->
        <div class="special-actions">
          <button class="special-btn" id="restBtn">😴 Rest (uses 2 food)</button>
          <button class="special-btn" id="exploreBtn">🗺️ Explore</button>
        </div>
        
        <!-- Back to pod -->
        <button class="back-btn" id="backBtn">⬅ RETURN TO POD</button>
      </div>
    `;
    
    // Add event listeners for gathering
    document.getElementById('gatherWood').addEventListener('click', () => gather('wood'));
    document.getElementById('gatherStone').addEventListener('click', () => gather('stone'));
    document.getElementById('gatherFood').addEventListener('click', () => gather('food'));
    document.getElementById('gatherMetal').addEventListener('click', () => gather('metal'));
    
    // Add event listeners for crafting - EACH WITH UNIQUE ID
    document.getElementById('craftAxeBtn').addEventListener('click', () => craft('axe'));
    document.getElementById('craftPickaxeBtn').addEventListener('click', () => craft('pickaxe'));
    document.getElementById('craftCampfireBtn').addEventListener('click', () => craft('campfire'));
    document.getElementById('craftSpearBtn').addEventListener('click', () => craft('spear'));
    document.getElementById('craftBedBtn').addEventListener('click', () => craft('bed'));
    document.getElementById('craftFurnaceBtn').addEventListener('click', () => craft('furnace'));
    
    // Add event listeners for special actions
    document.getElementById('restBtn').addEventListener('click', rest);
    document.getElementById('exploreBtn').addEventListener('click', explore);
    document.getElementById('backBtn').addEventListener('click', showPod);
  }
  
  // Gather resources
  function gather(type) {
    // Calculate bonus from tools
    let bonus = 1;
    if (tools.includes('🪓 Stone Axe') && type === 'wood') bonus = 2;
    if (tools.includes('⛏️ Stone Pickaxe') && type === 'stone') bonus = 2;
    if (tools.includes('🔱 Wooden Spear') && type === 'food') bonus = 2;
    
    const gain = (Math.floor(Math.random() * 5) + 1) * bonus;
    resources[type] += gain;
    
    // Random events
    const random = Math.random();
    
    if (type === 'wood') {
      if (random < 0.1) {
        resources.metal += 1;
        currentMessage = `You gather ${gain} wood and find some metal scraps! +1 metal`;
      } else {
        currentMessage = `You gather ${gain} wood. ${bonus > 1 ? 'Your axe helps you work faster!' : ''}`;
      }
    } else if (type === 'stone') {
      if (random < 0.1) {
        resources.metal += 2;
        currentMessage = `You mine ${gain} stone and find a metal vein! +2 metal`;
      } else {
        currentMessage = `You mine ${gain} stone. ${bonus > 1 ? 'Your pickaxe is efficient!' : ''}`;
      }
    } else if (type === 'food') {
      if (random < 0.15) {
        resources.cloth += 1;
        currentMessage = `You hunt ${gain} food and find animal fur! +1 cloth`;
      } else if (random < 0.3) {
        health = Math.max(0, health - 5);
        currentMessage = `You hunt ${gain} food but get injured. -5 health`;
      } else {
        currentMessage = `You find ${gain} food. ${bonus > 1 ? 'Your spear helps!' : ''}`;
      }
    } else if (type === 'metal') {
      const metalGain = Math.floor(Math.random() * 3) + 1;
      resources.metal += metalGain;
      currentMessage = `You scavenge ${metalGain} metal scraps.`;
    }
    
    // Hunger - every action uses a little food
    resources.food = Math.max(0, resources.food - 1);
    if (resources.food === 0) {
      health = Math.max(0, health - 10);
      currentMessage += ' You are starving! -10 health';
    }
    
    showPlanet();
  }
  
  // Craft items
  function craft(item) {
    let success = false;
    
    if (item === 'axe') {
      if (resources.wood >= 5 && resources.stone >= 3) {
        resources.wood -= 5;
        resources.stone -= 3;
        tools.push('🪓 Stone Axe');
        currentMessage = 'You crafted a Stone Axe! Better wood gathering.';
        success = true;
      }
    } else if (item === 'pickaxe') {
      if (resources.wood >= 3 && resources.stone >= 5) {
        resources.wood -= 3;
        resources.stone -= 5;
        tools.push('⛏️ Stone Pickaxe');
        currentMessage = 'You crafted a Stone Pickaxe! Better stone mining.';
        success = true;
      }
    } else if (item === 'campfire') {
      if (resources.wood >= 3 && resources.food >= 2) {
        resources.wood -= 3;
        resources.food -= 2;
        inventory.push('🔥 Campfire');
        currentMessage = 'You crafted a Campfire! Rest here to regain health.';
        success = true;
      }
    } else if (item === 'spear') {
      if (resources.wood >= 4 && resources.stone >= 1) {
        resources.wood -= 4;
        resources.stone -= 1;
        tools.push('🔱 Wooden Spear');
        currentMessage = 'You crafted a Wooden Spear! Better hunting.';
        success = true;
      }
    } else if (item === 'bed') {
      if (resources.wood >= 8 && resources.cloth >= 4) {
        resources.wood -= 8;
        resources.cloth -= 4;
        inventory.push('🛏️ Bed');
        currentMessage = 'You crafted a Bed! Rest restores more health.';
        success = true;
      }
    } else if (item === 'furnace') {
      if (resources.stone >= 10 && resources.wood >= 5) {
        resources.stone -= 10;
        resources.wood -= 5;
        inventory.push('🔥 Furnace');
        currentMessage = 'You crafted a Furnace! Can smelt metal into tools.';
        success = true;
      }
    }
    
    if (!success) {
      currentMessage = 'Not enough resources. Check the costs.';
    }
    
    showPlanet();
  }
  
  // Rest function
  function rest() {
    if (resources.food >= 2) {
      resources.food -= 2;
      
      let restHeal = 20;
      if (inventory.includes('🛏️ Bed')) restHeal = 40;
      if (inventory.includes('🔥 Campfire')) restHeal += 10;
      
      health = Math.min(100, health + restHeal);
      currentMessage = `You rest and recover ${restHeal} health.`;
    } else {
      currentMessage = 'Not enough food to rest.';
    }
    showPlanet();
  }
  
  // Explore function
  function explore() {
    day++;
    
    const events = [
      { msg: 'You find an abandoned camp. +3 metal', metal: 3 },
      { msg: 'A wild animal attacks! -15 health', health: -15 },
      { msg: 'You discover berry bushes. +5 food', food: 5 },
      { msg: 'Old ruins yield tools. +1 random tool', tool: true },
      { msg: 'You get lost. -1 day worth of food', food: -3 },
      { msg: 'Find a cloth stash. +3 cloth', cloth: 3 },
      { msg: 'Nothing interesting today.', nothing: true }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    
    if (event.metal) resources.metal += event.metal;
    if (event.food) resources.food += event.food;
    if (event.cloth) resources.cloth += event.cloth;
    if (event.health) health = Math.max(0, health + event.health);
    if (event.tool) {
      const newTools = ['🪓 Stone Axe', '⛏️ Stone Pickaxe', '🔱 Wooden Spear'];
      tools.push(newTools[Math.floor(Math.random() * newTools.length)]);
    }
    
    // Daily food consumption
    resources.food = Math.max(0, resources.food - 2);
    if (resources.food === 0) {
      health = Math.max(0, health - 15);
      currentMessage = event.msg + ' You have no food! -15 health';
    } else {
      currentMessage = event.msg;
    }
    
    // Check death
    if (health <= 0) {
      alert('You have died. Starting over...');
      // Reset game
      resources = { wood: 10, stone: 5, food: 3, metal: 0, cloth: 0 };
      inventory = [];
      tools = [];
      day = 1;
      health = 100;
      currentMessage = 'You wake up again. The pod feels familiar.';
    }
    
    showPlanet();
  }
});

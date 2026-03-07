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
    cloth: 5
  };
  
  let inventory = [];
  let tools = [];
  let currentMessage = 'The air is cold. You need resources to survive.';
  let day = 1;
  let health = 100;
  let maxHealth = 100;
  let score = 0;
  let discoveries = [];
  
  // NEW: Ship parts for escape
  let shipParts = {
    hull: 0,
    engine: 0,
    fuel: 0,
    navigation: 0
  };
  
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
    
    // Check if player has escaped
    const allPartsComplete = shipParts.hull >= 1 && shipParts.engine >= 1 && 
                            shipParts.fuel >= 1 && shipParts.navigation >= 1;
    
    if (allPartsComplete) {
      // ESCAPE SUCCESS SCREEN
      appEl.innerHTML = `
        <div style="background: #1e2439; border-radius: 30px; padding: 30px 20px; max-width: 400px; margin: 0 auto; border: 2px solid #4a90e2; text-align: center;">
          <h1 style="color: #4a90e2; font-size: 32px; margin-bottom: 20px;">🚀 ESCAPE!</h1>
          <p style="font-size: 20px; margin: 20px 0;">You repaired the ship and left the planet!</p>
          <p style="color: #4a90e2; font-size: 24px;">Final Score: ${score}</p>
          <p style="color: #8f9bb5;">Days survived: ${day}</p>
          <p style="color: #8f9bb5;">Discoveries: ${discoveries.length}</p>
          <button id="playAgainBtn" style="background: #4a90e2; color: white; border: none; padding: 15px 30px; border-radius: 15px; font-size: 18px; margin-top: 30px; cursor: pointer;">PLAY AGAIN</button>
        </div>
      `;
      document.getElementById('playAgainBtn')?.addEventListener('click', resetGame);
      return;
    }
    
    // Normal pod screen
    appEl.innerHTML = `
      <div style="background: #1e2439; border-radius: 30px; padding: 30px 20px; max-width: 400px; margin: 0 auto; border: 2px solid #4a90e2;">
        <h1 style="color: #4a90e2; text-align: center; margin-bottom: 30px; font-size: 28px;">🚀 CRASH LANDING</h1>
        <p style="color: #4a90e2; text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">${playerName}</p>
        <p style="text-align: center; border-top: 1px solid #2a3349; border-bottom: 1px solid #2a3349; padding: 15px; margin: 10px 0;">DAY ${day} | SCORE: ${score}</p>
        <p style="text-align: center;">❤️ ${health}/${maxHealth}</p>
        <p style="text-align: center; color: #4a90e2; margin-top: 15px;">🎯 GOAL: Repair your ship</p>
        <button id="wakeBtn" style="width: 100%; padding: 18px; background: #4a90e2; color: white; border: none; border-radius: 15px; font-size: 20px; margin-top: 25px; cursor: pointer; font-weight: bold;">WAKE UP</button>
      </div>
    `;
    
    document.getElementById('wakeBtn').addEventListener('click', showPlanet);
  }
  
  function showPlanet() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    // Calculate ship progress
    const shipProgress = (shipParts.hull + shipParts.engine + shipParts.fuel + shipParts.navigation) / 4 * 100;
    
    appEl.innerHTML = `
      <div style="background: #1e2439; border-radius: 30px; padding: 20px; max-width: 450px; margin: 0 auto; border: 2px solid #4a90e2;">
        
        <!-- Header with stats -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h2 style="color: #4a90e2; margin: 0;">🌍 DAY ${day}</h2>
          <div style="display: flex; gap: 15px;">
            <span>⭐ ${score}</span>
            <span>❤️ ${health}</span>
          </div>
        </div>
        
        <!-- Health bar -->
        <div style="background: #2a3349; height: 8px; border-radius: 4px; margin-bottom: 15px;">
          <div style="width: ${(health/maxHealth)*100}%; height: 100%; background: #4a90e2; border-radius: 4px;"></div>
        </div>
        
        <!-- SHIP PROGRESS - NEW -->
        <div style="background: #151a2b; border-radius: 10px; padding: 12px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="color: #4a90e2;">🚀 SHIP REPAIR</span>
            <span>${Math.round(shipProgress)}%</span>
          </div>
          <div style="background: #2a3349; height: 6px; border-radius: 3px;">
            <div style="width: ${shipProgress}%; height: 100%; background: #4a90e2; border-radius: 3px;"></div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 10px; font-size: 12px; text-align: center;">
            <div>🛡️ Hull ${shipParts.hull > 0 ? '✅' : '❌'}</div>
            <div>⚙️ Engine ${shipParts.engine > 0 ? '✅' : '❌'}</div>
            <div>⛽ Fuel ${shipParts.fuel > 0 ? '✅' : '❌'}</div>
            <div>🧭 Nav ${shipParts.navigation > 0 ? '✅' : '❌'}</div>
          </div>
        </div>
        
        <!-- Resources -->
        <div style="background: #151a2b; border-radius: 15px; padding: 15px; margin-bottom: 15px;">
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; text-align: center;">
            <div><div style="font-size: 20px;">🪵</div><div style="color: #4a90e2; font-weight: bold;">${resources.wood}</div><div style="font-size: 10px;">WOOD</div></div>
            <div><div style="font-size: 20px;">🪨</div><div style="color: #4a90e2; font-weight: bold;">${resources.stone}</div><div style="font-size: 10px;">STONE</div></div>
            <div><div style="font-size: 20px;">🍎</div><div style="color: #4a90e2; font-weight: bold;">${resources.food}</div><div style="font-size: 10px;">FOOD</div></div>
            <div><div style="font-size: 20px;">🔩</div><div style="color: #4a90e2; font-weight: bold;">${resources.metal}</div><div style="font-size: 10px;">METAL</div></div>
            <div><div style="font-size: 20px;">🧵</div><div style="color: #4a90e2; font-weight: bold;">${resources.cloth}</div><div style="font-size: 10px;">CLOTH</div></div>
          </div>
        </div>
        
        <!-- Tools -->
        ${tools.length > 0 ? `
          <div style="background: #151a2b; border-radius: 10px; padding: 10px; margin-bottom: 15px;">
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${tools.map(t => `<span style="background: #2a3349; padding: 5px 12px; border-radius: 20px; border: 1px solid #4a90e2;">${t}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Discoveries -->
        ${discoveries.length > 0 ? `
          <div style="background: #151a2b; border-radius: 10px; padding: 10px; margin-bottom: 15px;">
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${discoveries.map(d => `<span style="background: #2a3349; padding: 3px 10px; border-radius: 15px; border-color: #ffd700;">${d}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Message -->
        <div style="background: #151a2b; border-radius: 10px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #4a90e2; min-height: 60px;">
          ${currentMessage}
        </div>
        
        <!-- Action Buttons -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px;">
          <button id="gatherWood" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">🪵 Gather Wood</button>
          <button id="gatherStone" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">🪨 Mine Stone</button>
          <button id="gatherFood" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">🍎 Hunt Food</button>
          <button id="gatherMetal" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">🔩 Scavenge</button>
        </div>
        
        <!-- CRAFTING -->
        <h3 style="color: #4a90e2; margin: 20px 0 10px;">🔨 CRAFTING</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px;">
          <button id="craftAxe" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">
            <div>🪓 Stone Axe</div>
            <div style="font-size: 10px; color: #8f9bb5;">5 wood, 3 stone</div>
          </button>
          <button id="craftPickaxe" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">
            <div>⛏️ Pickaxe</div>
            <div style="font-size: 10px; color: #8f9bb5;">3 wood, 5 stone</div>
          </button>
          <button id="craftSpear" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">
            <div>🔱 Spear</div>
            <div style="font-size: 10px; color: #8f9bb5;">4 wood, 1 stone</div>
          </button>
          <button id="craftCampfire" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">
            <div>🔥 Campfire</div>
            <div style="font-size: 10px; color: #8f9bb5;">3 wood, 2 food</div>
          </button>
          <button id="craftBed" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">
            <div>🛏️ Bed</div>
            <div style="font-size: 10px; color: #8f9bb5;">8 wood, 4 cloth</div>
          </button>
          <button id="craftFurnace" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">
            <div>🔥 Furnace</div>
            <div style="font-size: 10px; color: #8f9bb5;">10 stone, 5 wood</div>
          </button>
        </div>
        
        <!-- SHIP REPAIR - NEW SECTION -->
        <h3 style="color: #4a90e2; margin: 20px 0 10px;">🚀 REPAIR SHIP</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 15px 0;">
          <button id="repairHull" style="background: ${shipParts.hull > 0 ? '#2a3349' : '#151a2b'}; border: 1px solid #4a90e2; padding: 12px; border-radius: 10px; color: white; cursor: pointer;" ${shipParts.hull > 0 ? 'disabled' : ''}>
            <div>🛡️ Repair Hull</div>
            <div style="font-size: 10px;">30 wood, 20 metal</div>
          </button>
          <button id="repairEngine" style="background: ${shipParts.engine > 0 ? '#2a3349' : '#151a2b'}; border: 1px solid #4a90e2; padding: 12px; border-radius: 10px; color: white; cursor: pointer;" ${shipParts.engine > 0 ? 'disabled' : ''}>
            <div>⚙️ Fix Engine</div>
            <div style="font-size: 10px;">25 metal, 15 stone</div>
          </button>
          <button id="refuel" style="background: ${shipParts.fuel > 0 ? '#2a3349' : '#151a2b'}; border: 1px solid #4a90e2; padding: 12px; border-radius: 10px; color: white; cursor: pointer;" ${shipParts.fuel > 0 ? 'disabled' : ''}>
            <div>⛽ Refuel</div>
            <div style="font-size: 10px;">20 wood, 10 cloth</div>
          </button>
          <button id="repairNav" style="background: ${shipParts.navigation > 0 ? '#2a3349' : '#151a2b'}; border: 1px solid #4a90e2; padding: 12px; border-radius: 10px; color: white; cursor: pointer;" ${shipParts.navigation > 0 ? 'disabled' : ''}>
            <div>🧭 Calibrate Nav</div>
            <div style="font-size: 10px;">15 metal, 10 crystal</div>
          </button>
        </div>
        
        <!-- Special Actions -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 15px 0;">
          <button id="restBtn" style="background: #2a3349; border: 1px solid #4a90e2; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">😴 Rest</button>
          <button id="exploreBtn" style="background: #2a3349; border: 1px solid #4a90e2; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">🗺️ Explore</button>
        </div>
        
        <!-- Inventory -->
        ${inventory.length > 0 ? `
          <div style="margin: 15px 0;">
            <h4 style="color: #4a90e2;">📦 INVENTORY</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
              ${inventory.map(item => `<div style="background: #151a2b; padding: 8px; border-radius: 5px; text-align: center;">${item}</div>`).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Back button -->
        <button id="backBtn" style="width: 100%; padding: 12px; background: #2a3349; border: none; border-radius: 10px; color: white; margin-top: 10px; cursor: pointer;">⬅ RETURN TO POD</button>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('gatherWood').addEventListener('click', () => gather('wood'));
    document.getElementById('gatherStone').addEventListener('click', () => gather('stone'));
    document.getElementById('gatherFood').addEventListener('click', () => gather('food'));
    document.getElementById('gatherMetal').addEventListener('click', () => gather('metal'));
    
    document.getElementById('craftAxe').addEventListener('click', () => craft('axe'));
    document.getElementById('craftPickaxe').addEventListener('click', () => craft('pickaxe'));
    document.getElementById('craftSpear').addEventListener('click', () => craft('spear'));
    document.getElementById('craftCampfire').addEventListener('click', () => craft('campfire'));
    document.getElementById('craftBed').addEventListener('click', () => craft('bed'));
    document.getElementById('craftFurnace').addEventListener('click', () => craft('furnace'));
    
    // Ship repair buttons
    document.getElementById('repairHull').addEventListener('click', () => repairShip('hull'));
    document.getElementById('repairEngine').addEventListener('click', () => repairShip('engine'));
    document.getElementById('refuel').addEventListener('click', () => repairShip('fuel'));
    document.getElementById('repairNav').addEventListener('click', () => repairShip('navigation'));
    
    document.getElementById('restBtn').addEventListener('click', rest);
    document.getElementById('exploreBtn').addEventListener('click', explore);
    document.getElementById('backBtn').addEventListener('click', showPod);
  }
  
  // NEW: Repair ship function
  function repairShip(part) {
    if (part === 'hull' && shipParts.hull === 0) {
      if (resources.wood >= 30 && resources.metal >= 20) {
        resources.wood -= 30;
        resources.metal -= 20;
        shipParts.hull = 1;
        currentMessage = '🛡️ Hull repaired! The ship can withstand takeoff.';
        score += 50;
      } else {
        currentMessage = '❌ Need 30 wood and 20 metal for hull repair.';
      }
    }
    else if (part === 'engine' && shipParts.engine === 0) {
      if (resources.metal >= 25 && resources.stone >= 15) {
        resources.metal -= 25;
        resources.stone -= 15;
        shipParts.engine = 1;
        currentMessage = '⚙️ Engine fixed! The ship can fly.';
        score += 50;
      } else {
        currentMessage = '❌ Need 25 metal and 15 stone for engine.';
      }
    }
    else if (part === 'fuel' && shipParts.fuel === 0) {
      if (resources.wood >= 20 && resources.cloth >= 10) {
        resources.wood -= 20;
        resources.cloth -= 10;
        shipParts.fuel = 1;
        currentMessage = '⛽ Fuel tanks filled! Ready for launch.';
        score += 50;
      } else {
        currentMessage = '❌ Need 20 wood and 10 cloth for fuel.';
      }
    }
    else if (part === 'navigation' && shipParts.navigation === 0) {
      // Check if player has a crystal (from discoveries)
      const hasCrystal = inventory.includes('💎 Crystal') || inventory.includes('💎 Rough Gem');
      if (resources.metal >= 15 && hasCrystal) {
        resources.metal -= 15;
        // Remove crystal from inventory
        const crystalIndex = inventory.findIndex(i => i.includes('💎'));
        if (crystalIndex > -1) inventory.splice(crystalIndex, 1);
        shipParts.navigation = 1;
        currentMessage = '🧭 Navigation calibrated! You can find your way home.';
        score += 50;
      } else {
        currentMessage = '❌ Need 15 metal and a crystal for navigation.';
      }
    }
    
    showPlanet();
  }
  
  // Reset game
  function resetGame() {
    resources = { wood: 15, stone: 10, food: 8, metal: 3, cloth: 5 };
    inventory = [];
    tools = [];
    discoveries = [];
    shipParts = { hull: 0, engine: 0, fuel: 0, navigation: 0 };
    day = 1;
    health = 100;
    maxHealth = 100;
    score = 0;
    currentMessage = 'You wake up again. The pod feels familiar.';
    showPod();
  }
  
  function gather(type) {
    // Tool bonuses
    let bonus = 1;
    if (tools.includes('🪓 Stone Axe') && type === 'wood') bonus = 3;
    if (tools.includes('⛏️ Stone Pickaxe') && type === 'stone') bonus = 3;
    if (tools.includes('🔱 Wooden Spear') && type === 'food') bonus = 3;
    
    const gain = Math.floor(Math.random() * 8) + 3 * bonus;
    resources[type] += gain;
    score += gain;
    
    // Random events
    const rand = Math.random();
    
    if (type === 'wood') {
      if (rand < 0.2) {
        let found = Math.floor(Math.random() * 3) + 1;
        resources.cloth += found;
        currentMessage = `🌳 You find animal nests! +${found} cloth`;
      } else if (rand < 0.35) {
        resources.metal += 2;
        currentMessage = `⚡ You find an old metal trap! +2 metal`;
      } else if (rand < 0.45) {
        health = Math.min(maxHealth, health + 5);
        currentMessage = `🌿 You find healing herbs! +5 health`;
      } else {
        currentMessage = `🪵 You gather ${gain} wood.`;
      }
    }
    else if (type === 'stone') {
      if (rand < 0.15) {
        inventory.push('💎 Rough Gem');
        currentMessage = `💎 You find gems!`;
        score += 20;
      } else if (rand < 0.3) {
        resources.metal += 3;
        currentMessage = `⛏️ You hit a metal vein! +3 metal`;
      } else {
        currentMessage = `🪨 You mine ${gain} stone.`;
      }
    }
    else if (type === 'food') {
      if (rand < 0.25) {
        let fur = Math.floor(Math.random() * 3) + 2;
        resources.cloth += fur;
        currentMessage = `🦊 You hunt a furry animal! +${fur} cloth`;
      } else if (rand < 0.4) {
        health = Math.max(0, health - 10);
        currentMessage = `🐗 A wild boar attacks! -10 health`;
      } else if (rand < 0.5) {
        discoveries.push('🐾 Animal Tracks');
        currentMessage = `🔍 You discover animal tracks!`;
      } else {
        currentMessage = `🍎 You find ${gain} food.`;
      }
    }
    else if (type === 'metal') {
      const metalGain = Math.floor(Math.random() * 5) + 2;
      resources.metal += metalGain;
      
      if (rand < 0.2) {
        inventory.push('⚙️ Rusty Gear');
        currentMessage = `⚙️ You find ancient machinery! +${metalGain} metal`;
        score += 15;
      } else if (rand < 0.4) {
        resources.cloth += 2;
        currentMessage = `🧵 You find old tarps! +${metalGain} metal, +2 cloth`;
      } else {
        currentMessage = `🔩 You scavenge ${metalGain} metal.`;
      }
    }
    
    // Hunger
    resources.food = Math.max(0, resources.food - 1);
    if (resources.food === 0) {
      health = Math.max(0, health - 15);
      currentMessage += ' 😵 You are starving!';
    }
    
    // Check death
    if (health <= 0) {
      alert(`💀 You survived ${day} days! Score: ${score}`);
      resetGame();
    } else {
      showPlanet();
    }
  }
  
  function craft(item) {
    if (item === 'axe' && resources.wood >= 5 && resources.stone >= 3) {
      resources.wood -= 5;
      resources.stone -= 3;
      tools.push('🪓 Stone Axe');
      currentMessage = '🔨 Crafted Stone Axe! Wood gathering x3!';
      score += 10;
    }
    else if (item === 'pickaxe' && resources.wood >= 3 && resources.stone >= 5) {
      resources.wood -= 3;
      resources.stone -= 5;
      tools.push('⛏️ Stone Pickaxe');
      currentMessage = '🔨 Crafted Pickaxe! Stone mining x3!';
      score += 10;
    }
    else if (item === 'spear' && resources.wood >= 4 && resources.stone >= 1) {
      resources.wood -= 4;
      resources.stone -= 1;
      tools.push('🔱 Wooden Spear');
      currentMessage = '🔨 Crafted Spear! Hunting x3!';
      score += 10;
    }
    else if (item === 'campfire' && resources.wood >= 3 && resources.food >= 2) {
      resources.wood -= 3;
      resources.food -= 2;
      inventory.push('🔥 Campfire');
      currentMessage = '🔨 Crafted Campfire! Rest heals more.';
      score += 5;
    }
    else if (item === 'bed' && resources.wood >= 8 && resources.cloth >= 4) {
      resources.wood -= 8;
      resources.cloth -= 4;
      inventory.push('🛏️ Bed');
      currentMessage = '🔨 Crafted Bed! Rest heals even more!';
      score += 20;
    }
    else if (item === 'furnace' && resources.stone >= 10 && resources.wood >= 5) {
      resources.stone -= 10;
      resources.wood -= 5;
      inventory.push('🔥 Furnace');
      currentMessage = '🔨 Crafted Furnace!';
      score += 15;
    }
    else {
      currentMessage = '❌ Not enough resources!';
    }
    
    showPlanet();
  }
  
  function rest() {
    if (resources.food >= 2) {
      resources.food -= 2;
      
      let restHeal = 20;
      if (inventory.includes('🔥 Campfire')) restHeal += 15;
      if (inventory.includes('🛏️ Bed')) restHeal += 25;
      
      health = Math.min(maxHealth, health + restHeal);
      currentMessage = `😴 You rest. +${restHeal} health.`;
      score += 5;
    } else {
      currentMessage = '❌ Not enough food to rest.';
    }
    showPlanet();
  }
  
  function explore() {
    day++;
    
    const events = [
      { msg: '🏚️ Abandoned shelter! +5 cloth, +3 metal', cloth: 5, metal: 3 },
      { msg: '🦖 Dinosaur attack! -20 health', health: -20 },
      { msg: '🌴 Paradise valley! +10 food', food: 10 },
      { msg: '🗿 Ancient ruins!', discovery: '🗿 Ancient Ruins' },
      { msg: '💎 Crystal cave!', item: '💎 Crystal' },
      { msg: '🚁 Crash site! +8 metal', metal: 8 },
      { msg: '🌺 Peaceful meadow. +10 health', health: 10 },
      { msg: '📡 Mysterious signal!', discovery: '📡 Strange Signal' }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    
    if (event.cloth) resources.cloth += event.cloth;
    if (event.metal) resources.metal += event.metal;
    if (event.food) resources.food += event.food;
    if (event.health) health = Math.min(maxHealth, health + event.health);
    if (event.discovery) {
      discoveries.push(event.discovery);
      score += 30;
    }
    if (event.item) {
      inventory.push(event.item);
      score += 15;
    }
    
    resources.food = Math.max(0, resources.food - 3);
    currentMessage = event.msg;
    
    if (resources.food === 0) {
      health = Math.max(0, health - 10);
      currentMessage += ' You have no food!';
    }
    
    score += 10;
    showPlanet();
  }
});

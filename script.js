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
    metal: 2,
    cloth: 1
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
  
  function showPod() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    appEl.innerHTML = `
      <div style="background: #1e2439; border-radius: 30px; padding: 30px 20px; max-width: 400px; margin: 0 auto; border: 2px solid #3a4e6b;">
        <h1 style="color: #4a90e2; text-align: center; margin-bottom: 30px;">🚀 CRASH LANDING</h1>
        <p style="color: #4a90e2; text-align: center; font-size: 22px; font-weight: bold;">${playerName}</p>
        <p style="text-align: center; border-top: 1px solid #2a3349; border-bottom: 1px solid #2a3349; padding: 12px; margin: 10px 0;">DAY ${day}</p>
        <p style="text-align: center;">HEALTH: ${health}%</p>
        <button id="wakeBtn" style="width: 100%; padding: 16px; background: #4a90e2; color: white; border: none; border-radius: 15px; font-size: 18px; margin-top: 20px; cursor: pointer;">WAKE UP</button>
      </div>
    `;
    
    document.getElementById('wakeBtn').addEventListener('click', showPlanet);
  }
  
  function showPlanet() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    appEl.innerHTML = `
      <div style="background: #1e2439; border-radius: 30px; padding: 20px; max-width: 450px; margin: 0 auto; border: 2px solid #3a4e6b;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <h2 style="color: #4a90e2;">🌍 DAY ${day}</h2>
          <div style="background: #2a3349; width: 100px; height: 10px; border-radius: 5px;">
            <div style="width: ${health}%; height: 100%; background: #4a90e2; border-radius: 5px;"></div>
          </div>
        </div>
        
        <!-- Resources -->
        <div style="background: #151a2b; border-radius: 15px; padding: 15px; margin: 15px 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; text-align: center;">
          <div><div>🪵</div><div style="color: #4a90e2;">${resources.wood}</div><div style="font-size: 10px;">WOOD</div></div>
          <div><div>🪨</div><div style="color: #4a90e2;">${resources.stone}</div><div style="font-size: 10px;">STONE</div></div>
          <div><div>🍎</div><div style="color: #4a90e2;">${resources.food}</div><div style="font-size: 10px;">FOOD</div></div>
          <div><div>🔩</div><div style="color: #4a90e2;">${resources.metal}</div><div style="font-size: 10px;">METAL</div></div>
          <div><div>🧵</div><div style="color: #4a90e2;">${resources.cloth}</div><div style="font-size: 10px;">CLOTH</div></div>
        </div>
        
        <!-- Tools -->
        ${tools.length > 0 ? `
          <div style="display: flex; gap: 5px; flex-wrap: wrap; margin: 10px 0;">
            ${tools.map(t => `<span style="background: #2a3349; padding: 5px 10px; border-radius: 20px;">${t}</span>`).join('')}
          </div>
        ` : ''}
        
        <!-- Message -->
        <div style="background: #151a2b; border-radius: 10px; padding: 15px; margin: 15px 0; border-left: 3px solid #4a90e2;">
          ${currentMessage}
        </div>
        
        <!-- Action Buttons -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 15px 0;">
          <button id="gatherWood" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">🪵 Gather Wood</button>
          <button id="gatherStone" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">🪨 Mine Stone</button>
          <button id="gatherFood" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">🍎 Hunt Food</button>
          <button id="gatherMetal" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">🔩 Scavenge</button>
        </div>
        
        <!-- CRAFTING SECTION - ALL BUTTONS VISIBLE -->
        <h3 style="color: #4a90e2; margin: 20px 0 10px;">🔨 CRAFTING</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <button id="craftAxe" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">
            <div>🪓 Stone Axe</div>
            <div style="font-size: 10px; color: #8f9bb5;">5 wood, 3 stone</div>
          </button>
          
          <button id="craftPickaxe" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">
            <div>⛏️ Pickaxe</div>
            <div style="font-size: 10px; color: #8f9bb5;">3 wood, 5 stone</div>
          </button>
          
          <button id="craftCampfire" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">
            <div>🔥 Campfire</div>
            <div style="font-size: 10px; color: #8f9bb5;">3 wood, 2 food</div>
          </button>
          
          <button id="craftSpear" style="background: #151a2b; border: 1px solid #2a3349; padding: 12px; border-radius: 10px; color: white; cursor: pointer;">
            <div>🔱 Spear</div>
            <div style="font-size: 10px; color: #8f9bb5;">4 wood, 1 stone</div>
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
        
        <!-- Inventory -->
        ${inventory.length > 0 ? `
          <div style="margin-top: 20px;">
            <h4 style="color: #4a90e2;">📦 INVENTORY</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
              ${inventory.map(item => `<div style="background: #1e2439; padding: 8px; border-radius: 5px; text-align: center;">${item}</div>`).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Special Actions -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 20px 0;">
          <button id="restBtn" style="background: #2a3349; padding: 12px; border-radius: 10px; color: white; border: 1px solid #4a90e2; cursor: pointer;">😴 Rest</button>
          <button id="exploreBtn" style="background: #2a3349; padding: 12px; border-radius: 10px; color: white; border: 1px solid #4a90e2; cursor: pointer;">🗺️ Explore</button>
        </div>
        
        <!-- Back button -->
        <button id="backBtn" style="width: 100%; padding: 12px; background: #2a3349; border: none; border-radius: 10px; color: white; margin-top: 10px; cursor: pointer;">⬅ BACK TO POD</button>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('gatherWood').addEventListener('click', () => gather('wood'));
    document.getElementById('gatherStone').addEventListener('click', () => gather('stone'));
    document.getElementById('gatherFood').addEventListener('click', () => gather('food'));
    document.getElementById('gatherMetal').addEventListener('click', () => gather('metal'));
    
    // Crafting buttons
    document.getElementById('craftAxe').addEventListener('click', () => craft('axe'));
    document.getElementById('craftPickaxe').addEventListener('click', () => craft('pickaxe'));
    document.getElementById('craftCampfire').addEventListener('click', () => craft('campfire'));
    document.getElementById('craftSpear').addEventListener('click', () => craft('spear'));
    document.getElementById('craftBed').addEventListener('click', () => craft('bed'));
    document.getElementById('craftFurnace').addEventListener('click', () => craft('furnace'));
    
    document.getElementById('restBtn').addEventListener('click', rest);
    document.getElementById('exploreBtn').addEventListener('click', explore);
    document.getElementById('backBtn').addEventListener('click', showPod);
  }
  
  function gather(type) {
    let bonus = 1;
    if (tools.includes('🪓 Stone Axe') && type === 'wood') bonus = 2;
    if (tools.includes('⛏️ Stone Pickaxe') && type === 'stone') bonus = 2;
    if (tools.includes('🔱 Wooden Spear') && type === 'food') bonus = 2;
    
    const gain = Math.floor(Math.random() * 5) + 1 * bonus;
    resources[type] += gain;
    
    currentMessage = `You gathered ${gain} ${type}.`;
    
    // Hunger
    resources.food = Math.max(0, resources.food - 1);
    if (resources.food === 0) {
      health -= 5;
      currentMessage += ' You are hungry!';
    }
    
    showPlanet();
  }
  
  function craft(item) {
    if (item === 'axe' && resources.wood >= 5 && resources.stone >= 3) {
      resources.wood -= 5;
      resources.stone -= 3;
      tools.push('🪓 Stone Axe');
      currentMessage = 'Crafted Stone Axe!';
    }
    else if (item === 'pickaxe' && resources.wood >= 3 && resources.stone >= 5) {
      resources.wood -= 3;
      resources.stone -= 5;
      tools.push('⛏️ Stone Pickaxe');
      currentMessage = 'Crafted Stone Pickaxe!';
    }
    else if (item === 'campfire' && resources.wood >= 3 && resources.food >= 2) {
      resources.wood -= 3;
      resources.food -= 2;
      inventory.push('🔥 Campfire');
      currentMessage = 'Crafted Campfire!';
    }
    else if (item === 'spear' && resources.wood >= 4 && resources.stone >= 1) {
      resources.wood -= 4;
      resources.stone -= 1;
      tools.push('🔱 Wooden Spear');
      currentMessage = 'Crafted Wooden Spear!';
    }
    else if (item === 'bed' && resources.wood >= 8 && resources.cloth >= 4) {
      resources.wood -= 8;
      resources.cloth -= 4;
      inventory.push('🛏️ Bed');
      currentMessage = 'Crafted Bed!';
    }
    else if (item === 'furnace' && resources.stone >= 10 && resources.wood >= 5) {
      resources.stone -= 10;
      resources.wood -= 5;
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
      health = Math.min(100, health + 20);
      currentMessage = 'You rest and recover health.';
    } else {
      currentMessage = 'Not enough food to rest.';
    }
    showPlanet();
  }
  
  function explore() {
    day++;
    resources.food = Math.max(0, resources.food - 2);
    currentMessage = `Day ${day}. You explore the area.`;
    showPlanet();
  }
});

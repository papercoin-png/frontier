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
    food: 3
  };
  
  let inventory = [];
  let currentMessage = 'The air is cold. You need resources to survive.';
  
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
        <p class="status-line">SYSTEMS: ONLINE</p>
        <p class="status-line">VITALS: STABLE</p>
        <p class="status-line">PLANET: UNKNOWN</p>
        <button class="wake-btn" id="wakeBtn">WAKE UP</button>
      </div>
    `;
    
    // Add event listener
    document.getElementById('wakeBtn').addEventListener('click', showPlanet);
  }
  
  // Show planet screen with all buttons
  function showPlanet() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    appEl.innerHTML = `
      <div class="planet-view">
        <h2>🌍 THE SURFACE</h2>
        
        <!-- Resources -->
        <div class="resources">
          <div class="resource-item">
            <span class="resource-icon">🪵</span>
            <span class="resource-value" id="wood-count">${resources.wood}</span>
            <span class="resource-label">WOOD</span>
          </div>
          <div class="resource-item">
            <span class="resource-icon">🪨</span>
            <span class="resource-value" id="stone-count">${resources.stone}</span>
            <span class="resource-label">STONE</span>
          </div>
          <div class="resource-item">
            <span class="resource-icon">🍎</span>
            <span class="resource-value" id="food-count">${resources.food}</span>
            <span class="resource-label">FOOD</span>
          </div>
        </div>
        
        <!-- Message -->
        <div class="message" id="message">${currentMessage}</div>
        
        <!-- Action Buttons - THESE ARE THE ONES YOU WERE MISSING -->
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
          <div class="action-btn" id="craftBtn">
            <span class="action-icon">🔨</span>
            <span>Craft</span>
          </div>
        </div>
        
        <!-- Inventory (only shows if you have items) -->
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
        
        <!-- Back to pod button -->
        <button class="back-btn" id="backBtn">⬅ BACK TO POD</button>
      </div>
    `;
    
    // Add event listeners to ALL buttons
    document.getElementById('gatherWood').addEventListener('click', function() {
      gather('wood');
    });
    
    document.getElementById('gatherStone').addEventListener('click', function() {
      gather('stone');
    });
    
    document.getElementById('gatherFood').addEventListener('click', function() {
      gather('food');
    });
    
    document.getElementById('craftBtn').addEventListener('click', function() {
      craft();
    });
    
    document.getElementById('backBtn').addEventListener('click', function() {
      showPod();
    });
  }
  
  // Gather resources
  function gather(type) {
    // Random gain between 1-5
    const gain = Math.floor(Math.random() * 5) + 1;
    resources[type] += gain;
    
    // Set message
    if (type === 'wood') {
      currentMessage = `You gather ${gain} wood from nearby trees.`;
    } else if (type === 'stone') {
      currentMessage = `You mine ${gain} stone from the rocks.`;
    } else if (type === 'food') {
      currentMessage = `You find ${gain} food.`;
    }
    
    // 20% chance to find something special
    if (Math.random() < 0.2) {
      const specialItems = ['🔧 Metal Scrap', '⚡ Battery', '📦 Old Crate', '🔌 Wire', '🧵 Fabric'];
      const item = specialItems[Math.floor(Math.random() * specialItems.length)];
      inventory.push(item);
      currentMessage += ` You also found ${item}!`;
    }
    
    // Show updated planet screen
    showPlanet();
  }
  
  // Craft items
  function craft() {
    if (resources.wood >= 5 && resources.stone >= 3) {
      resources.wood -= 5;
      resources.stone -= 3;
      inventory.push('🪓 Stone Axe');
      currentMessage = 'You crafted a Stone Axe! It will help you gather faster.';
    } else if (resources.wood >= 3 && resources.food >= 2) {
      resources.wood -= 3;
      resources.food -= 2;
      inventory.push('🔥 Campfire');
      currentMessage = 'You crafted a Campfire. It provides warmth and light.';
    } else {
      currentMessage = 'Not enough resources. Need 5 wood + 3 stone for axe, or 3 wood + 2 food for campfire.';
    }
    
    // Show updated planet screen
    showPlanet();
  }
});

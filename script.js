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
  let currentScreen = 'pod'; // 'pod' or 'planet'
  let currentMessage = 'The air is cold. You need resources to survive.';
  let justWokeUp = false; // Track if we just woke up
  
  // Check Telegram
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    if (tg.initDataUnsafe?.user?.first_name) {
      playerName = tg.initDataUnsafe.user.first_name;
    }
  }
  
  // Render initial screen
  render();
  
  // Main render function
  function render() {
    if (currentScreen === 'pod') {
      renderPod();
    } else {
      renderPlanet();
    }
  }
  
  // Render pod screen
  function renderPod() {
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
    
    // Add event listener to button
    document.getElementById('wakeBtn').addEventListener('click', wakeUp);
  }
  
  // Render planet screen
  function renderPlanet() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    // Set message based on whether we just woke up
    if (justWokeUp) {
      currentMessage = 'You step out of the pod. The air is thin but breathable.';
      justWokeUp = false; // Reset the flag
    }
    
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
        
        <!-- Actions -->
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
        
        <!-- Inventory (only shows if has items) -->
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
        
        <!-- Back button -->
        <button class="back-btn" id="backBtn">⬅ BACK TO POD</button>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('gatherWood').addEventListener('click', () => gather('wood'));
    document.getElementById('gatherStone').addEventListener('click', () => gather('stone'));
    document.getElementById('gatherFood').addEventListener('click', () => gather('food'));
    document.getElementById('craftBtn').addEventListener('click', craft);
    document.getElementById('backBtn').addEventListener('click', goBack);
  }
  
  // Game functions
  function wakeUp() {
    currentScreen = 'planet';
    justWokeUp = true; // Set flag for welcome message
    render();
  }
  
  function goBack() {
    currentScreen = 'pod';
    render();
  }
  
  function gather(type) {
    // Random gain between 1-5
    const gain = Math.floor(Math.random() * 5) + 1;
    resources[type] += gain;
    
    // Random message based on type
    const messages = {
      wood: [
        `You find some dead trees. +${gain} wood`,
        `Branches are scattered everywhere. +${gain} wood`,
        `You gather fallen timber. +${gain} wood`
      ],
      stone: [
        `You pick up some rocks. +${gain} stone`,
        `A rocky outcrop provides stones. +${gain} stone`,
        `You find sharp stones on the ground. +${gain} stone`
      ],
      food: [
        `You find edible berries. +${gain} food`,
        `A small creature crosses your path. +${gain} food`,
        `You discover wild plants. +${gain} food`
      ]
    };
    
    const messageList = messages[type];
    currentMessage = messageList[Math.floor(Math.random() * messageList.length)];
    
    // 20% chance to find something special
    if (Math.random() < 0.2) {
      const specialItems = ['🔧 Metal Scrap', '⚡ Battery', '📦 Old Crate', '🔌 Wire', '🧵 Fabric'];
      const item = specialItems[Math.floor(Math.random() * specialItems.length)];
      inventory.push(item);
      currentMessage += ` You also found ${item}!`;
    }
    
    render();
  }
  
  function craft() {
    // Simple crafting
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
      currentMessage = 'Not enough resources. You need 5 wood + 3 stone for an axe, or 3 wood + 2 food for a campfire.';
    }
    render();
  }
});

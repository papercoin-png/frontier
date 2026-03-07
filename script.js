// script.js - The Frontier
// Pure JavaScript, no frameworks

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Frontier: DOM loaded');
  
  // Get references to HTML elements
  const appDiv = document.getElementById('app');
  const loadingDiv = document.getElementById('loading');
  
  // Player data
  let playerName = 'Explorer';
  let gameState = 'pod'; // 'pod' or 'planet'
  
  // Check if we're in Telegram
  if (window.Telegram && window.Telegram.WebApp) {
    console.log('Frontier: Running in Telegram');
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Get user info from Telegram
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
      playerName = tg.initDataUnsafe.user.first_name || 'Explorer';
      console.log('Frontier: Player name:', playerName);
    }
  } else {
    console.log('Frontier: Running in browser');
  }
  
  // Hide loading, show game
  if (loadingDiv) {
    loadingDiv.style.display = 'none';
  }
  
  // Render the initial screen
  renderPodScreen();
  
  // Function to render the crashed pod screen
  function renderPodScreen() {
    gameState = 'pod';
    
    const html = `
      <div class="pod-screen">
        <div class="pod-window">
          <h1>🚀 CRASH LANDING</h1>
          <p>Pod ${playerName}</p>
          <p class="status">SYSTEMS: OFFLINE</p>
          <p class="status">VITALS: STABLE</p>
          <p class="status">PLANET: UNKNOWN</p>
          <button id="wakeButton" class="wake-button">WAKE UP</button>
        </div>
      </div>
    `;
    
    appDiv.innerHTML = html;
    
    // Add event listener to the button
    document.getElementById('wakeButton').addEventListener('click', renderPlanetScreen);
  }
  
  // Function to render the planet surface screen
  function renderPlanetScreen() {
    gameState = 'planet';
    
    const html = `
      <div class="planet-view">
        <h2>Welcome to the surface, ${playerName}</h2>
        <p>Your surroundings are dark. You need to gather resources.</p>
        <p class="environment">🌑 A vast, empty plain stretches before you...</p>
        <button id="backButton" class="back-button">⬅ BACK TO POD</button>
      </div>
    `;
    
    appDiv.innerHTML = html;
    
    // Add event listener to the back button
    document.getElementById('backButton').addEventListener('click', renderPodScreen);
  }
});

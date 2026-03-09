import React, { useState } from 'react';
import { useRotation } from '../../hooks/useRotation';
import { useTelegram } from '../../hooks/useTelegram';
import { planetTemplates } from '../planet/planetTemplates';
import PlanetCanvas from '../planet/PlanetCanvas';
import Starfield from '../background/Starfield';
import HUD from '../ui/HUD';
import ActionButtons from '../ui/ActionButtons';
import './OrbitalView.css';

const OrbitalView = () => {
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
  const rotation = useRotation(0.002);
  const { showAlert, hapticFeedback } = useTelegram();

  const currentPlanet = planetTemplates[currentPlanetIndex];

  // Player stats (would come from game state in real implementation)
  const playerStats = {
    fuel: 87,
    shield: 100,
    cargo: 45,
    cargoMax: 100,
    units: 12450
  };

  const handleScan = () => {
    showAlert(`Scanning ${currentPlanet.name}...\nResources found: ${currentPlanet.resources.join(', ')}`);
  };

  const handleLand = () => {
    if (playerStats.fuel > 0) {
      hapticFeedback('notification', 'success');
      showAlert(`Landing sequence initiated for ${currentPlanet.name}`);
      // In future: switch to ApproachView or SurfaceView
    } else {
      hapticFeedback('notification', 'error');
      showAlert('Insufficient fuel for landing!');
    }
  };

  const handleNextPlanet = () => {
    hapticFeedback('impact', 'medium');
    setCurrentPlanetIndex((prev) => (prev + 1) % planetTemplates.length);
  };

  return (
    <div className="orbital-view">
      <Starfield />
      
      <div className="planet-container">
        <PlanetCanvas 
          template={currentPlanet} 
          rotation={rotation} 
        />
      </div>

      <HUD 
        planet={currentPlanet} 
        stats={playerStats} 
      />

      <ActionButtons 
        onScan={handleScan}
        onLand={handleLand}
        onNext={handleNextPlanet}
        canLand={playerStats.fuel > 0}
      />
    </div>
  );
};

export default OrbitalView;

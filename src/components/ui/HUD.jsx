import React from 'react';
import './HUD.css';

const HUD = ({ planet, stats }) => {
  return (
    <>
      {/* Top left - Ship status */}
      <div className="hud-corner top-left">
        <div className="hud-panel">
          <div>⚡ FUEL: {stats.fuel}%</div>
          <div>🛡️ SHIELD: {stats.shield}%</div>
        </div>
      </div>
      
      {/* Top right - Cargo/Units */}
      <div className="hud-corner top-right">
        <div className="hud-panel">
          <div>📦 CARGO: {stats.cargo}/{stats.cargoMax}</div>
          <div>⭐ UNITS: {stats.units.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Bottom center - Planet info */}
      <div className="hud-bottom">
        <div className="hud-panel planet-info">
          <h2>{planet.name}</h2>
          <div className="planet-stats-grid">
            <div>TYPE: {planet.type}</div>
            <div>TEMP: {planet.temperature}°C</div>
            <div>ATMOS: {planet.atmosphere_type}</div>
            <div>RINGS: {planet.hasRings ? 'YES' : 'NO'}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HUD;

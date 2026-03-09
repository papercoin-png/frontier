import React from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import './ActionButtons.css';

const ActionButtons = ({ onScan, onLand, onNext, canLand = true }) => {
  const { hapticFeedback } = useTelegram();

  const handleClick = (action, callback) => {
    hapticFeedback('impact', 'light');
    callback();
  };

  return (
    <div className="action-buttons">
      <button 
        className="action-button"
        onClick={() => handleClick('scan', onScan)}
      >
        🔍 SCAN
      </button>
      <button 
        className="action-button"
        onClick={() => handleClick('land', onLand)}
        disabled={!canLand}
      >
        🚀 LAND
      </button>
      <button 
        className="action-button"
        onClick={() => handleClick('next', onNext)}
      >
        ⏭️ NEXT
      </button>
    </div>
  );
};

export default ActionButtons;

import React, { useEffect, useRef } from 'react';
import './PlanetCanvas.css';

const PlanetCanvas = ({ template, rotation = 0 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = Math.min(window.innerWidth * 0.6, 400);
    
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Save context state
    ctx.save();
    
    // Translate to center and rotate
    ctx.translate(size/2, size/2);
    ctx.rotate(rotation);
    
    // Draw planet sphere
    const radius = size * 0.4;
    
    // Base gradient (ocean)
    const gradient = ctx.createRadialGradient(
      -radius*0.2, -radius*0.2, 0,
      0, 0, radius
    );
    gradient.addColorStop(0, template.colors.oceanShallow);
    gradient.addColorStop(0.5, template.colors.oceanMid);
    gradient.addColorStop(1, template.colors.oceanBase);
    
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw land masses
    ctx.fillStyle = template.colors.landDark;
    ctx.beginPath();
    ctx.ellipse(radius*0.2, -radius*0.1, radius*0.3, radius*0.2, 0, 0, Math.PI*2);
    ctx.fill();
    
    ctx.fillStyle = template.colors.landLight;
    ctx.beginPath();
    ctx.ellipse(-radius*0.1, radius*0.2, radius*0.25, radius*0.15, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Add highlight
    ctx.fillStyle = template.colors.highlight;
    ctx.beginPath();
    ctx.ellipse(radius*0.3, radius*0.1, radius*0.1, radius*0.05, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Restore context
    ctx.restore();
    
    // Draw atmosphere glow (not affected by rotation)
    ctx.save();
    ctx.filter = 'blur(10px)';
    ctx.beginPath();
    ctx.arc(size/2, size/2, radius + 10, 0, Math.PI * 2);
    ctx.fillStyle = template.atmosphere + '40';
    ctx.fill();
    ctx.restore();
    
    // Draw rings if planet has them
    if (template.hasRings) {
      ctx.save();
      ctx.translate(size/2, size/2);
      ctx.rotate(rotation * 0.5);
      
      ctx.strokeStyle = template.ringColor || '#c0c0c0';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 10]);
      
      ctx.beginPath();
      ctx.ellipse(0, 0, radius*1.4, radius*0.3, 0, 0, Math.PI*2);
      ctx.stroke();
      
      ctx.restore();
    }
  }, [template, rotation]);

  return (
    <canvas 
      ref={canvasRef} 
      className="planet-canvas"
    />
  );
};

export default PlanetCanvas;

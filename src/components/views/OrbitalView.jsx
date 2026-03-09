import React, { useState, useEffect, useRef } from 'react';
import { planetTemplates } from '../planet/planetTemplates';

// =============================================
// Starfield Component
// =============================================
const Starfield = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawStars();
        };
        
        const drawStars = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw 200 stars
            for (let i = 0; i < 200; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = Math.random() * 2;
                const brightness = Math.random() * 155 + 100;
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
                ctx.fill();
            }
        };
        
        window.addEventListener('resize', resize);
        resize();
        
        return () => window.removeEventListener('resize', resize);
    }, []);
    
    return <canvas ref={canvasRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
    }} />;
};

// =============================================
// Planet Canvas Component
// =============================================
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
        
        // Add highlight (mountains/desert)
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
    
    return <canvas ref={canvasRef} style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        filter: 'drop-shadow(0 0 20px rgba(0,255,255,0.3))'
    }} />;
};

// =============================================
// Main Orbital View Component
// =============================================
const OrbitalView = () => {
    const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
    const [rotation, setRotation] = useState(0);
    
    // Rotation animation
    useEffect(() => {
        let frame;
        const animate = () => {
            setRotation(prev => (prev + 0.002) % (Math.PI * 2));
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);
    
    const currentPlanet = planetTemplates[currentPlanetIndex];
    
    const nextPlanet = () => {
        setCurrentPlanetIndex((prev) => (prev + 1) % planetTemplates.length);
    };
    
    // Button styles
    const buttonStyle = {
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid #0ff',
        color: '#0ff',
        padding: '12px 24px',
        fontFamily: 'monospace',
        fontSize: '16px',
        borderRadius: '5px',
        cursor: 'pointer',
        textShadow: '0 0 5px #0ff',
        boxShadow: '0 0 10px rgba(0,255,255,0.3)',
        transition: 'all 0.3s',
        flex: 1,
        maxWidth: '120px'
    };
    
    return (
        <div style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
            overflow: 'hidden'
        }}>
            {/* Starfield background */}
            <Starfield />
            
            {/* Planet container */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                textAlign: 'center',
                width: 'min(80vw, 500px)'
            }}>
                <PlanetCanvas template={currentPlanet} rotation={rotation} />
                
                {/* Planet info */}
                <div style={{
                    marginTop: '20px',
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px solid #0ff',
                    borderRadius: '10px',
                    padding: '15px',
                    color: '#0ff',
                    fontFamily: 'monospace',
                    textShadow: '0 0 5px #0ff',
                    backdropFilter: 'blur(5px)'
                }}>
                    <h2 style={{ marginBottom: '10px' }}>{currentPlanet.name}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>TYPE: {currentPlanet.type}</div>
                        <div>TEMP: {currentPlanet.temperature}°C</div>
                        <div>ATMOS: {currentPlanet.atmosphere_type}</div>
                        <div>RINGS: {currentPlanet.hasRings ? 'YES' : 'NO'}</div>
                    </div>
                </div>
                
                {/* Action buttons */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '20px',
                    justifyContent: 'center'
                }}>
                    <button onClick={() => alert('SCANNING ' + currentPlanet.name)}
                            style={buttonStyle}>
                        🔍 SCAN
                    </button>
                    <button onClick={() => alert('LANDING ON ' + currentPlanet.name)}
                            style={buttonStyle}>
                        🚀 LAND
                    </button>
                    <button onClick={nextPlanet}
                            style={buttonStyle}>
                        ⏭️ NEXT
                    </button>
                </div>
            </div>
            
            {/* HUD corners */}
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                color: '#0ff',
                fontFamily: 'monospace',
                fontSize: '12px',
                textShadow: '0 0 5px #0ff',
                zIndex: 2
            }}>
                ⚡ FUEL: 87%<br />
                🛡️ SHIELD: 100%
            </div>
            
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: '#0ff',
                fontFamily: 'monospace',
                fontSize: '12px',
                textShadow: '0 0 5px #0ff',
                zIndex: 2,
                textAlign: 'right'
            }}>
                📦 CARGO: 45/100<br />
                ⭐ UNITS: 12,450
            </div>
        </div>
    );
};

export default OrbitalView;

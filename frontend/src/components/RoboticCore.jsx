import React from 'react';

function RoboticCore() {
  return (
    <div className="glass-card bio-digital-core-container" style={{
      height: '450px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at center, rgba(0, 210, 255, 0.1) 0%, rgba(5, 5, 8, 0.8) 100%)',
      border: '1px solid rgba(0, 210, 255, 0.15)',
      marginBottom: '40px',
      borderRadius: '8px'
    }}>
      {/* Background Ambience */}
      <div className="core-glow-bg"></div>

      {/* Global Scanlines for the component */}
      <div className="scanline" style={{ position: 'absolute', opacity: 0.15 }}></div>

      {/* Main Container for 3D Scene */}
      <div className="scene-3d">

        {/* Central Energy Sphere (Biosphere) */}
        <div className="bio-sphere">
          <div className="sphere-glow"></div>
          <div className="leaf-pattern">
            <svg viewBox="0 0 100 100" width="40" height="40" style={{ opacity: 0.8 }}>
              <path d="M50 10 Q70 30 50 60 Q30 30 50 10" fill="transparent" stroke="var(--robotic-blue)" strokeWidth="2" />
              <path d="M50 20 L50 50" stroke="var(--robotic-blue)" strokeWidth="1" />
            </svg>
          </div>
          {/* Inner pulsating nerve center */}
          <div className="core-nucleus"></div>
        </div>

        {/* Neural Orbital Paths */}
        <div className="orbital-ring path-1"></div>
        <div className="orbital-ring path-2"></div>

        {/* Floating Digital Flora (Leaves) */}
        {[...Array(6)].map((_, i) => (
          <div key={`leaf-${i}`} className={`floating-leaf leaf-pos-${i + 1}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--robotic-blue)', width: '15px' }}>
              <path d="M12 2C12 2 12 11 12 11M12 2C12 2 6 6 6 12C6 18 12 22 12 22M12 2C12 2 18 6 18 12C18 18 12 22 12 22M12 11L6 8M12 14L18 17M12 17L6 20" strokeLinecap="round" />
            </svg>
          </div>
        ))}

        {/* Data Processing Pods */}
        <div className="data-pod pod-left">
          <div className="pod-inner"><div className="pod-core"></div></div>
          <div className="pod-label">ECO_SYNC</div>
        </div>
        <div className="data-pod pod-right">
          <div className="pod-inner"><div className="pod-core"></div></div>
          <div className="pod-label">LOAD_BAL</div>
        </div>
      </div>

      {/* HUD Info Panels */}
      <div className="hud-panel hud-left">
        <div className="hud-header">SYS_ANALYTICS</div>
        <div className="hud-metric">
          <span>NEURAL_FLOW:</span>
          <div className="hud-bar"><div className="hud-bar-fill load-anim-1"></div></div>
        </div>
        <div className="hud-metric">
          <span>CO2_NEUTRAL:</span>
          <div className="hud-bar"><div className="hud-bar-fill load-anim-2"></div></div>
        </div>
        <div className="hud-metric">
          <span>OXY_SYNTH:</span>
          <div className="hud-bar"><div className="hud-bar-fill load-anim-3"></div></div>
        </div>
      </div>

      <div className="hud-panel hud-right">
        <div className="hud-header">BIO_UPLINK</div>
        <div className="hud-status">● HARMONIC_STABILITY: 99.8%</div>
        <div className="hud-status">● ENERGY_COEFFICIENT: A+</div>
        <div className="hud-metric" style={{ marginTop: '10px' }}>
          <span>UPTIME_SYNC:</span>
          <div className="hud-bar"><div className="hud-bar-fill load-anim-steady"></div></div>
        </div>
        <div className="hud-tag">ID: GREEN_NODE_01</div>
      </div>

      {/* Robotic Corner Accents */}
      <div className="robotic-corner top-left"></div>
      <div className="robotic-corner top-right"></div>
      <div className="robotic-corner bottom-left"></div>
      <div className="robotic-corner bottom-right"></div>

      <style>{`
        .bio-digital-core-container {
          perspective: 1200px;
          user-select: none;
        }

        .core-glow-bg {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(0, 210, 255, 0.08) 0%, transparent 70%);
          filter: blur(20px);
          animation: ambientBreath 4s ease-in-out infinite;
        }

        .scene-3d {
          position: relative;
          width: 0;
          height: 0;
          transform-style: preserve-3d;
          transform: rotateX(15deg);
        }

        /* Central Biosphere */
        .bio-sphere {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 2px solid rgba(0, 210, 255, 0.4);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transform-style: preserve-3d;
          box-shadow: 0 0 30px rgba(0, 210, 255, 0.2);
          animation: sphereRotate 15s linear infinite;
        }

        .sphere-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent);
          box-shadow: inset 0 0 15px rgba(0, 210, 255, 0.3);
        }

        .core-nucleus {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          height: 30px;
          background: var(--robotic-blue);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 40px var(--robotic-blue);
          animation: nucleusPulse 2s ease-in-out infinite;
        }

        .leaf-pattern {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: leafOscillate 6s ease-in-out infinite;
        }

        /* Orbital Paths */
        .orbital-ring {
          position: absolute;
          border: 1px solid rgba(0, 210, 255, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%) rotateX(75deg);
        }
        .path-1 { width: 220px; height: 220px; animation: pathFloat 4s ease-in-out infinite; }
        .path-2 { width: 300px; height: 300px; animation: pathFloat 6s ease-in-out reverse infinite; }

        /* Floating Digital Flora */
        .floating-leaf {
          position: absolute;
          animation: leafOrbit 20s linear infinite;
          transform-origin: 0 0;
          filter: drop-shadow(0 0 5px var(--robotic-blue));
        }

        ${[...Array(6)].map((_, i) => `
          .leaf-pos-${i + 1} {
            animation-delay: -${i * 3.33}s;
          }
        `).join('')}

        /* Data Pods */
        .data-pod {
          position: absolute;
          transform-style: preserve-3d;
          animation: podHover 3s ease-in-out infinite;
        }
        .pod-left { transform: translate(-150px, -20px); }
        .pod-right { transform: translate(120px, 10px); animation-delay: -1.5s; }

        .pod-inner {
          width: 40px;
          height: 40px;
          border: 1px solid var(--robotic-blue);
          position: relative;
          background: rgba(0, 210, 255, 0.1);
          transform: rotateY(45deg);
        }
        .pod-core {
           position: absolute;
           inset: 10px;
           background: var(--robotic-blue);
           box-shadow: 0 0 10px var(--robotic-blue);
           animation: podPulse 1s ease-in-out infinite;
        }
        .pod-label {
          margin-top: 10px;
          font-family: var(--terminal-font);
          font-size: 0.55rem;
          color: var(--robotic-blue);
          text-align: center;
          letter-spacing: 1px;
        }

        /* HUD Panels */
        .hud-panel {
          position: absolute;
          bottom: 25px;
          background: rgba(0, 210, 255, 0.05);
          border: 1px solid rgba(0, 210, 255, 0.2);
          padding: 12px;
          font-family: var(--terminal-font);
          border-radius: 2px;
          backdrop-filter: blur(5px);
        }
        .hud-left { left: 25px; width: 150px; }
        .hud-right { right: 25px; width: 170px; }

        .hud-header {
          font-size: 0.6rem;
          color: var(--robotic-blue);
          margin-bottom: 8px;
          border-bottom: 1px solid rgba(0, 210, 255, 0.2);
          padding-bottom: 4px;
        }
        .hud-metric {
          font-size: 0.5rem;
          color: #fff;
          margin-bottom: 5px;
        }
        .hud-bar {
          height: 4px;
          background: rgba(255,255,255,0.1);
          margin-top: 2px;
          border-radius: 2px;
        }
        .hud-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--robotic-blue) 0%, rgba(255,255,255,0.4) 50%, var(--robotic-blue) 100%);
          background-size: 200% 100%;
          box-shadow: 0 0 10px var(--robotic-blue);
          position: relative;
          overflow: hidden;
        }

        /* Loading Bar Logic */
        .load-anim-1 { animation: barLoad 3s linear infinite, widthLoad1 10s ease-in-out infinite; }
        .load-anim-2 { animation: barLoad 2s linear infinite, widthLoad2 8s ease-in-out infinite; }
        .load-anim-3 { animation: barLoad 4s linear infinite, widthLoad3 12s ease-in-out infinite; }
        .load-anim-steady { animation: barLoad 1.5s linear infinite; width: 100%; }

        @keyframes barLoad {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes widthLoad1 { 0%, 100% { width: 75%; } 50% { width: 85%; } }
        @keyframes widthLoad2 { 0%, 100% { width: 92%; } 50% { width: 88%; } }
        @keyframes widthLoad3 { 0%, 100% { width: 45%; } 50% { width: 62%; } }

        .hud-status {
          font-size: 0.5rem;
          color: #fff;
          margin-bottom: 4px;
        }
        .hud-tag {
          font-size: 0.45rem;
          color: var(--robotic-blue);
          margin-top: 8px;
          opacity: 0.6;
        }
        @keyframes ambientBreath {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        @keyframes sphereRotate {
          from { transform: translate(-50%, -50%) rotateY(0deg) rotateX(0deg); }
          to { transform: translate(-50%, -50%) rotateY(360deg) rotateX(360deg); }
        }

        @keyframes nucleusPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        }

        @keyframes leafOscillate {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          50% { transform: translate(-50%, -50%) rotate(10deg) scale(1.1); }
        }

        @keyframes pathFloat {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) rotateX(75deg) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) rotateX(70deg) scale(1.05); }
        }

        @keyframes leafOrbit {
          from { transform: rotateY(0deg) translateX(140px) rotateY(0deg); }
          to { transform: rotateY(360deg) translateX(140px) rotateY(-360deg); }
        }

        @keyframes podHover {
          0%, 100% { transform: translateY(0) rotateY(45deg); }
          50% { transform: translateY(-15px) rotateY(45deg); }
        }

        @keyframes podPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(0.9); opacity: 1; }
        }

        /* Accents */
        .robotic-corner {
          position: absolute;
          width: 15px;
          height: 15px;
          border: 1px solid var(--robotic-blue);
          opacity: 0.6;
        }
        .top-left { top: 10px; left: 10px; border-right: none; border-bottom: none; }
        .top-right { top: 10px; right: 10px; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 10px; left: 10px; border-right: none; border-top: none; }
        .bottom-right { bottom: 10px; right: 10px; border-left: none; border-top: none; }
      `}</style>
    </div>
  );
}

export default RoboticCore;

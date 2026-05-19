import React, { useState, useEffect } from 'react';
import { getSuggestions } from '../services/api';

function OptimizationTips() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await getSuggestions();
        const suggestionsData = Array.isArray(response.data)
          ? response.data
          : (response.data?.suggestions || []);

        setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : []);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching suggestions:', error);
        setSuggestions([
          { icon: '🧬', tip: 'Optimize model architecture to reduce computational complexity' },
          { icon: '⚡', tip: 'Use mixed precision training to reduce energy consumption' },
          { icon: '📡', tip: 'Implement batch processing for better resource utilization' },
          { icon: '🔋', tip: 'Schedule training during off-peak hours for greener energy' }
        ]);
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const TipCard = ({ icon, tip, index }) => (
    <div
      className="robotic-tip-card fade-in"
      style={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        background: 'rgba(0, 210, 255, 0.03)',
        border: '1px solid rgba(0, 210, 255, 0.1)',
        borderRadius: '4px',
        position: 'relative',
        animationDelay: `${index * 150}ms`,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      {/* Scanning line for each tip */}
      <div className="tip-scanner"></div>

      <div style={{
        fontSize: '1.5rem',
        minWidth: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 210, 255, 0.1)',
        border: '1px solid rgba(0, 210, 255, 0.2)',
        borderRadius: '2px',
        color: 'var(--robotic-blue)',
        boxShadow: '0 0 15px rgba(0, 210, 255, 0.1) inset'
      }}>
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.65rem',
          color: 'var(--robotic-blue)',
          fontFamily: 'var(--terminal-font)',
          marginBottom: '4px',
          opacity: 0.7,
          letterSpacing: '1px'
        }}>
          [SUGGESTION_ID: 0x0{index + 1}]
        </div>
        <p style={{
          margin: 0,
          color: '#fff',
          fontSize: '0.85rem',
          lineHeight: 1.5,
          fontFamily: 'var(--terminal-font)',
          letterSpacing: '0.5px'
        }}>
          {tip}
        </p>
      </div>

      {/* Decorative side accent */}
      <div style={{
        width: '2px',
        height: '100%',
        background: 'var(--robotic-blue)',
        position: 'absolute',
        right: 0,
        top: 0,
        opacity: 0.3
      }}></div>
    </div>
  );

  return (
    <div className="glass-card robotic-terminal-container" style={{
      padding: '30px',
      border: '1px solid rgba(0, 210, 255, 0.15)',
      position: 'relative',
      background: 'rgba(5, 5, 8, 0.6)',
      overflow: 'hidden',
      marginBottom: '40px'
    }}>
      {/* Corner Brackets */}
      <div className="robotic-corner top-left"></div>
      <div className="robotic-corner top-right"></div>
      <div className="robotic-corner bottom-left"></div>
      <div className="robotic-corner bottom-right"></div>

      {/* Header with Diagnostic Pulse */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(0, 210, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="header-orb"></div>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: 900,
            margin: 0,
            color: '#fff',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: 'var(--terminal-font)'
          }}>
            Optimization_Registry
          </h2>
        </div>
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--robotic-blue)',
          fontFamily: 'var(--terminal-font)',
          padding: '4px 10px',
          background: 'rgba(0, 210, 255, 0.05)',
          border: '1px solid rgba(0, 210, 255, 0.2)'
        }}>
          v2.4.0
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="shimmer" style={{ height: '80px', background: 'rgba(255,255,255,0.05)' }}></div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {Array.isArray(suggestions) && suggestions.map((suggestion, index) => (
            <TipCard
              key={index}
              icon={suggestion.icon || '🧬'}
              tip={suggestion.tip || suggestion.message || String(suggestion)}
              index={index}
            />
          ))}
        </div>
      )}

      <style>{`
        .robotic-terminal-container::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 210, 255, 0.02) 1px, rgba(0, 210, 255, 0.02) 2px);
          pointer-events: none;
        }

        .header-orb {
          width: 8px;
          height: 8px;
          background: var(--robotic-blue);
          border-radius: 50%;
          margin-right: 15px;
          box-shadow: 0 0 10px var(--robotic-blue);
          animation: pulseOrb 1.5s ease-in-out infinite;
        }

        .robotic-tip-card:hover {
          background: rgba(0, 210, 255, 0.08) !important;
          border-color: rgba(0, 210, 255, 0.4) !important;
          transform: translateX(10px);
          box-shadow: -5px 0 20px rgba(0, 210, 255, 0.1);
        }

        .tip-scanner {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 210, 255, 0.05), transparent);
          animation: tipScan 4s linear infinite;
          pointer-events: none;
        }

        @keyframes tipScan {
          0% { left: -100%; }
          50% { left: 150%; }
          100% { left: 150%; }
        }

        @keyframes pulseOrb {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .robotic-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 1px solid var(--robotic-blue);
          opacity: 0.5;
        }
        .top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
        .top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
        .bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }
      `}</style>
    </div>
  );
}

export default OptimizationTips;

import Dashboard from '../components/Dashboard';

import { useState } from 'react';

function Home() {
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = () => {
    setIsActivating(true);
    // Simulate system boot sequence
    setTimeout(() => {
      setIsSystemActive(true);
    }, 2500);
  };

  if (!isSystemActive) {
    return (
      <div className={`landing-container ${isActivating ? 'system-initializing' : ''}`}>
        {isActivating && (
          <div className="init-overlay">
            <div className="activate-btn" style={{ width: '100px', height: '100px', margin: '0 auto' }}></div>
            <div className="init-text">INITIALIZING SYSTEM...</div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <div className="circuit-dot" style={{ top: '20%', left: '20%' }}></div>
            <div className="circuit-dot" style={{ top: '80%', left: '80%' }}></div>
          </div>
        )}

        {!isActivating && (
          <div className="activate-btn-container">
            <button className="activate-btn" onClick={handleActivate}>
              Activate
            </button>
            <div className="circuit-dot" style={{ top: '-50px', left: '50%' }}></div>
            <div className="circuit-dot" style={{ bottom: '-50px', left: '50%' }}></div>
            <div className="circuit-dot" style={{ top: '50%', left: '-50px' }}></div>
            <div className="circuit-dot" style={{ top: '50%', right: '-50px' }}></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <header style={{
        textAlign: 'center',
        marginBottom: 'var(--spacing-2xl)',
        paddingTop: 'var(--spacing-xl)',
        animation: 'fadeIn 0.8s ease-out'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          background: 'var(--bg-card)',
          borderRadius: '50px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: 'var(--spacing-md)',
          fontSize: '0.85rem',
          color: 'var(--accent-green)',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }}>
          🌱 REAL-TIME MONITORING
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          margin: '0 0 16px 0',
          background: 'var(--primary-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em'
        }}>
          Green AI Monitor
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Track, analyze, and optimize your AI model's carbon footprint in real-time
        </p>

        <div style={{
          display: 'flex',
          gap: '32px',
          justifyContent: 'center',
          marginTop: 'var(--spacing-xl)',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              background: 'var(--success-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Real-Time
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monitoring</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              AI-Powered
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Insights</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              background: 'var(--warning-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Carbon
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tracking</div>
          </div>
        </div>
      </header>

      <Dashboard />

      <footer style={{
        textAlign: 'center',
        padding: 'var(--spacing-2xl) 0',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        marginTop: 'var(--spacing-2xl)'
      }}>
        <p style={{ margin: 0 }}>
          Built with 💚 for a sustainable AI future
        </p>
      </footer>
    </div>
  );
}

export default Home;
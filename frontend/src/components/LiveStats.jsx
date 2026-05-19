import React, { useState, useEffect } from 'react';
import { getLiveStats, getLiveStatus, toggleTracking } from '../services/api';

function LiveStats() {
  const [stats, setStats] = useState({
    cpu_usage: 0,
    memory_usage: 0,
    memory_used_gb: 0,
    memory_total_gb: 0,
    gpu_usage: null,
    power_consumption: 0,
    co2_emissions: 0,
    grid_factor: 0
  });
  const [isActive, setIsActive] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [showInfo, setShowInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getLiveStats();
        console.log('✅ Live stats received:', response.data);

        const safeStats = {
          cpu_usage: response.data?.cpu_usage ?? 0,
          memory_usage: response.data?.memory_usage ?? 0,
          memory_used_gb: response.data?.memory_used_gb ?? 0,
          memory_total_gb: response.data?.memory_total_gb ?? 0,
          gpu_usage: response.data?.gpu_usage ?? null,
          power_consumption: response.data?.power_consumption ?? 0,
          co2_emissions: response.data?.co2_emissions ?? 0,
          grid_factor: response.data?.grid_factor ?? 0
        };

        setStats(safeStats);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error('❌ Error fetching live stats:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    const fetchStatus = async () => {
      try {
        const response = await getLiveStatus();
        setIsActive(response.data.active);
      } catch (error) {
        console.error('❌ Error fetching status:', error);
      }
    };

    fetchStatus();
    fetchStats();
    const interval = setInterval(() => {
      if (isActive) fetchStats();
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleToggle = async () => {
    setIsToggling(true);
    const action = isActive ? 'stop' : 'start';
    try {
      await toggleTracking(action);
      setIsActive(!isActive);
    } catch (error) {
      console.error('❌ Toggle error:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) return '0.00';
    const num = Number(value);
    return num.toFixed(decimals);
  };

  const InfoIcon = ({ type }) => (
    <span
      className="info-icon"
      onMouseEnter={() => setShowInfo(type)}
      onMouseLeave={() => setShowInfo(null)}
      style={{
        cursor: 'help',
        marginLeft: '8px',
        fontSize: '0.75rem',
        color: '#4facfe',
        border: '1px solid #4facfe',
        borderRadius: '50%',
        padding: '2px 6px',
        display: 'inline-block',
        width: '18px',
        height: '18px',
        textAlign: 'center',
        lineHeight: '14px',
        transition: 'all 0.3s ease'
      }}
    >
      i
    </span>
  );

  const Tooltip = ({ text }) => (
    <div style={{
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: '#fff',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '0.85rem',
      zIndex: 100,
      maxWidth: '240px',
      marginTop: '8px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      left: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {text}
    </div>
  );

  const StatCard = ({ icon, label, value, unit, color, infoType, infoText, delay, subValue }) => (
    <div
      className="glass-card fade-in robotic-stat-card"
      style={{
        position: 'relative',
        padding: '24px',
        border: `1px solid rgba(255, 255, 255, 0.05)`,
        animationDelay: `${delay}ms`,
        overflow: 'hidden',
        background: 'rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Corner Brackets */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 8, height: 8, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: 0.6 }}></div>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: 0.6 }}></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 8, height: 8, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: 0.6 }}></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: 0.6 }}></div>

      {/* Background Scanning Line */}
      <div className="stat-scanner" style={{ background: `linear-gradient(to right, transparent, ${color}22, transparent)` }}></div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', position: 'relative' }}>
        <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>{icon}</span>
        <p style={{
          margin: 0,
          color: '#ffffff',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          opacity: 0.7
        }}>
          {label}
          {infoType && <InfoIcon type={infoType} />}
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <p style={{
          margin: 0,
          fontSize: '2.2rem',
          fontWeight: 800,
          color: color,
          lineHeight: 1.2,
          fontFamily: 'monospace',
          textShadow: `0 0 10px ${color}44`
        }}>
          {value}
          {unit && <span style={{ fontSize: '0.9rem', opacity: 0.6, marginLeft: '6px', fontWeight: 400 }}>{unit}</span>}
        </p>

        {/* Robotic "Processing" Indicator */}
        <div style={{
          position: 'absolute',
          top: -2,
          right: 0,
          fontSize: '0.6rem',
          color: color,
          opacity: 0.4,
          fontFamily: 'monospace'
        }}>
          DATA_STREAM_v0.2
        </div>
      </div>

      {subValue && (
        <div style={{
          marginTop: '12px',
          padding: '4px 8px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.75rem',
            color: '#a0a0b8',
            fontWeight: 600,
            fontFamily: 'monospace'
          }}>
            <span style={{ color }}>{'>'}</span> {subValue.toUpperCase()}
          </p>
        </div>
      )}
      {showInfo === infoType && <Tooltip text={infoText} />}
    </div>
  );

  const infoText = {
    co2: "CO₂ emissions calculated based on real-time power consumption and regional carbon intensity (mg/s).",
    power: "Estimated power usage based on CPU/GPU TDP and current workload activity.",
    memory: "Live memory utilization showing absolute usage against total system capacity.",
    grid: "Real-time carbon intensity of the local energy grid (g CO₂ / kWh)."
  };

  if (error) {
    return (
      <div style={{ marginBottom: '48px' }}>
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <h3 style={{ color: '#ffffff', marginTop: '16px' }}>Backend Connection Error</h3>
          <p style={{ color: '#a0a0b8' }}>
            Cannot connect to backend at http://localhost:8000
          </p>
          <p style={{ color: '#6b6b7e', fontSize: '0.9rem', marginTop: '8px' }}>
            Please start the backend: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>uvicorn app.main:app --reload</code>
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ marginBottom: '48px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '4px',
            height: '32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '2px',
            marginRight: '16px'
          }}></div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            margin: 0,
            color: '#ffffff'
          }}>
            Real-Time System Monitoring
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="shimmer glass-card" style={{ height: '120px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px',
        animation: 'fadeIn 0.6s ease-out',
        position: 'relative'
      }}>
        {/* Robot Diagnostic Header */}
        <div style={{
          width: '6px',
          height: '45px',
          background: 'var(--primary-gradient)',
          borderRadius: '3px',
          marginRight: '20px',
          boxShadow: '0 0 15px rgba(102, 126, 234, 0.5)'
        }}></div>
        <div>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            margin: 0,
            color: '#ffffff',
            letterSpacing: '-1px',
            textTransform: 'uppercase'
          }}>
            SYSTEM <span className="gradient-text">TELEMETRY</span> PROBE
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#6b6b7e', fontSize: '0.75rem', marginTop: '5px', fontWeight: 600, letterSpacing: '1.5px' }}>
            <span>[ STATUS: OK ]</span>
            <span>[ LINK: ESTABLISHED ]</span>
            <span>[ PROTOCOL: GRN_AI_v2.0 ]</span>
          </div>
        </div>

        {/* Global Control Button */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: '#6b6b7e', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px' }}>PROBE_STATUS</p>
            <p style={{
              margin: 0,
              color: isActive ? '#00f2fe' : '#ff4b2b',
              fontSize: '0.9rem',
              fontWeight: 900,
              textShadow: isActive ? '0 0 10px rgba(0, 242, 254, 0.4)' : '0 0 10px rgba(255, 75, 43, 0.4)'
            }}>
              {isActive ? '● ACTIVE' : '○ INACTIVE'}
            </p>
          </div>

          <button
            onClick={handleToggle}
            disabled={isToggling}
            className="tracking-toggle-btn"
            style={{
              background: isActive
                ? 'rgba(255, 75, 43, 0.1)'
                : 'rgba(79, 172, 254, 0.1)',
              border: `1px solid ${isActive ? '#ff4b2b' : '#4facfe'}`,
              color: isActive ? '#ff4b2b' : '#4facfe',
              padding: '10px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isToggling ? 0.5 : 1,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="btn-glitch-layer"></div>
            {isActive ? '⏹ DEACTIVATE' : '▶ ACTIVATE'}
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        <StatCard
          icon="💻"
          label="CPU Load"
          value={formatNumber(stats.cpu_usage, 1)}
          unit="%"
          color="#4facfe"
          delay={0}
        />

        <StatCard
          icon="🧠"
          label="Memory Registry"
          value={`${formatNumber(stats.memory_used_gb, 2)} / ${formatNumber(stats.memory_total_gb, 2)}`}
          unit="GB"
          color="#667eea"
          infoType="memory"
          infoText={infoText.memory}
          delay={100}
          subValue={`${formatNumber(stats.memory_usage, 1)}% saturation`}
        />

        {stats.gpu_usage !== null && (
          <StatCard
            icon="🎮"
            label="Neural core"
            value={formatNumber(stats.gpu_usage, 1)}
            unit="%"
            color="#f093fb"
            delay={200}
          />
        )}

        <StatCard
          icon="⚡"
          label="Power throughput"
          value={formatNumber(stats.power_consumption, 2)}
          unit="W"
          color="#fee140"
          infoType="power"
          infoText={infoText.power}
          delay={stats.gpu_usage !== null ? 300 : 200}
        />

        <StatCard
          icon="🌱"
          label="Carbon Output"
          value={formatNumber(stats.co2_emissions, 4)}
          unit="mg/s"
          color="#00f2fe"
          infoType="co2"
          infoText={infoText.co2}
          delay={stats.gpu_usage !== null ? 400 : 300}
        />

        <StatCard
          icon="🔋"
          label="Grid Intensity"
          value={formatNumber(stats.grid_factor, 1)}
          unit="g/kWh"
          color="#a8ff78"
          infoType="grid"
          infoText={infoText.grid}
          delay={stats.gpu_usage !== null ? 500 : 400}
        />
      </div>

      <style>{`
        .robotic-stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
        }

        .stat-scanner {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          animation: horizontal-scan 4s linear infinite;
          pointer-events: none;
        }

        @keyframes horizontal-scan {
          0% { left: -50%; }
          100% { left: 150%; }
        }

        .robotic-stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

export default LiveStats;
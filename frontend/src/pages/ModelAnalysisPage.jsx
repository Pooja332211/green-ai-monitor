import React, { useState } from 'react';
import AIModelEmissions from '../components/AIModelEmissions';
import EmissionChart from '../components/EmissionChart';

function ModelAnalysisPage({ onNavigateBack, onNavigateToResNet, onNavigateToDistilBERT }) {
    const [showChart, setShowChart] = useState(false);

    return (
        <div style={{ background: 'var(--bg-primary)', position: 'relative', minHeight: '100vh' }}>
            <div className="scanline"></div>

            <div className="container" style={{ paddingTop: '40px' }}>
                {/* Robotic Header */}
                <header style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '48px',
                    animation: 'fadeIn 0.6s ease-out'
                }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button
                            onClick={onNavigateBack}
                            className="robotic-btn"
                            style={{
                                padding: '10px 24px',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                color: '#fff',
                                background: 'rgba(0, 210, 255, 0.05)',
                                border: '1px solid var(--robotic-blue)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                letterSpacing: '2px',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            [BACK_TO_MONITOR]
                        </button>
                        <button
                            onClick={onNavigateToResNet}
                            className="robotic-btn"
                            style={{
                                padding: '10px 24px',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                color: 'var(--accent-orange)',
                                background: 'rgba(255, 165, 0, 0.05)',
                                border: '1px solid var(--accent-orange)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                letterSpacing: '2px',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            [ LAUNCH ResNet-18 ]
                        </button>
                        <button
                            onClick={onNavigateToDistilBERT}
                            className="robotic-btn"
                            style={{
                                padding: '10px 24px',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                color: 'var(--accent-magenta)',
                                background: 'rgba(192, 132, 252, 0.05)',
                                border: '1px solid var(--accent-magenta)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                letterSpacing: '2px',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            [ LAUNCH DistilBERT ]
                        </button>
                    </div>

                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 20px',
                        background: 'rgba(0, 210, 255, 0.05)',
                        border: '1px solid rgba(0, 210, 255, 0.2)',
                        borderRadius: '2px',
                        fontSize: '0.75rem',
                        color: 'var(--robotic-blue)',
                        fontWeight: 700,
                        letterSpacing: '1.5px',
                        fontFamily: 'var(--terminal-font)'
                    }}>
                        <div style={{ width: 6, height: 6, background: 'var(--robotic-blue)', borderRadius: '50%', boxShadow: '0 0 8px var(--robotic-blue)', animation: 'pulse 1s infinite' }}></div>
                        MODEL_CENTER: OPERATIONAL
                    </div>
                </header>

                {/* Page Title */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '60px',
                    animation: 'fadeIn 0.8s ease-out'
                }}>
                    <h1 className="glitch-text" style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 900,
                        margin: '0 0 10px 0',
                        color: '#fff',
                        letterSpacing: '-2px',
                        textTransform: 'uppercase'
                    }}>
                        Model <span style={{ color: 'var(--robotic-blue)' }}>Analysis</span> Console
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        lineHeight: 1.6,
                        fontFamily: 'var(--terminal-font)',
                        letterSpacing: '1px'
                    }}>
                        REAL-TIME HARDWARE PROBING | NEURAL WEIGHT EMISSION CALCULATIONS
                    </p>
                </div>

                {/* Main Content Area */}
                <div style={{ display: 'grid', gap: '40px' }}>
                    {/* Top Section: Analysis Controls */}
                    <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
                        <AIModelEmissions onCalculationComplete={() => setShowChart(true)} />
                    </div>

                    {/* Bottom Section: Dedicated History Analytics */}
                    {showChart && (
                        <div className="glass-card fade-in" style={{ padding: '30px', animation: 'fadeIn 1s ease-out' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                <div style={{ width: 4, height: 25, background: 'var(--robotic-blue)' }}></div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Emission History Logs (Updated)
                                </h2>
                            </div>
                            <EmissionChart />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer style={{
                    textAlign: 'center',
                    padding: '60px 0 40px',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--terminal-font)',
                    letterSpacing: '1px'
                }}>
                    [ ANALYTICS_v3.4 ] | SECURED_DATA_NODE: GREEN_AI_ANALYTICS
                </footer>
            </div>
        </div>
    );
}

export default ModelAnalysisPage;

import React from 'react';
import Dashboard from '../components/Dashboard';

function MonitoringPage({ onNavigate, onNavigateToModels }) {
    return (
        <div style={{ background: 'var(--bg-primary)', position: 'relative', minHeight: '100vh' }}>
            <div className="scanline"></div>

            <div className="container">
                {/* Robotic Header */}
                <header style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '48px',
                    paddingTop: '24px',
                    animation: 'fadeIn 0.6s ease-out'
                }}>
                    <button
                        onClick={onNavigate}
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
                        [BACK_TO_HQ]
                    </button>

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
                        LIVE_UPLINK: ESTABLISHED
                    </div>
                </header>

                {/* Robotic Page Title */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '60px',
                    animation: 'fadeIn 0.8s ease-out',
                    position: 'relative'
                }}>
                    <h1 className="glitch-text" style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 900,
                        margin: '0 0 10px 0',
                        color: '#fff',
                        letterSpacing: '-2px',
                        textTransform: 'uppercase'
                    }}>
                        Green AI <span style={{ color: 'var(--robotic-blue)' }}>Diagnostics</span>
                    </h1>

                    <div style={{
                        margin: '0 auto',
                        width: '100px',
                        height: '2px',
                        background: 'var(--robotic-blue)',
                        boxShadow: '0 0 10px var(--robotic-blue)',
                        marginBottom: '30px'
                    }}></div>

                    {/* Model Analysis Sub-Page Entry Button */}
                    <div style={{ marginBottom: '40px', animation: 'fadeIn 1s ease-out' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={{ position: 'absolute', top: -8, left: -8, width: 16, height: 16, borderTop: '2px solid var(--robotic-blue)', borderLeft: '2px solid var(--robotic-blue)', opacity: 0.8 }}></div>
                            <div style={{ position: 'absolute', bottom: -8, right: -8, width: 16, height: 16, borderBottom: '2px solid var(--robotic-blue)', borderRight: '2px solid var(--robotic-blue)', opacity: 0.8 }}></div>

                            <button
                                onClick={() => {
                                    // Robotic Voice Activation
                                    const utterance = new SpeechSynthesisUtterance("Accessing Model Control Center. Neural Link Established.");
                                    utterance.rate = 1.0;
                                    utterance.pitch = 0.8;
                                    utterance.volume = 1.0;
                                    window.speechSynthesis.speak(utterance);

                                    // Navigate
                                    onNavigateToModels();
                                }}
                                className="robotic-btn"
                                style={{
                                    padding: '18px 40px',
                                    fontSize: '1rem',
                                    fontWeight: 900,
                                    color: '#ffffff',
                                    background: 'rgba(0, 210, 255, 0.1)',
                                    border: '1px solid var(--robotic-blue)',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    letterSpacing: '3px',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 0 15px rgba(0, 210, 255, 0.2)',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                            >
                                [ ENTER_MODEL_CONTROL_CENTER ]
                            </button>
                        </div>
                    </div>

                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: 1.6,
                        fontFamily: 'var(--terminal-font)',
                        letterSpacing: '1px'
                    }}>
                        SECTOR_01: REAL-TIME CARBON EMISSION TRACKING & NEURAL OPTIMIZATION
                    </p>
                </div>

                {/* Dashboard Components */}
                <Dashboard />

                {/* Robotic Footer */}
                <footer style={{
                    textAlign: 'center',
                    padding: '60px 0 40px',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    borderTop: '1px solid rgba(0, 210, 255, 0.1)',
                    marginTop: '60px',
                    fontFamily: 'var(--terminal-font)',
                    letterSpacing: '1px'
                }}>
                    <p style={{ margin: 0 }}>
                        [ SYSTEM_RESERVED ] | BUILT_FOR_SUSTAINABLE_AI_v2.0
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default MonitoringPage;

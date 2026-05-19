import React, { useEffect, useState } from 'react';
import ChatBot from '../components/ChatBot';

function LandingPage({ onNavigate, onNavigateToDemo, onNavigateToAiDemo, onLogout }) {
    const [dots, setDots] = useState([]);
    const [isActivating, setIsActivating] = useState(false);
    const [bootStep, setBootStep] = useState(0);
    const [bootProgress, setBootProgress] = useState(0);

    // Boot sequence steps
    const bootSequence = [
        { code: 'CORE_LINK', status: 'Establishing Neural Core Connection...', color: '#00d2ff' },
        { code: 'TELEMETRY', status: 'Initializing Telemetry Probes...', color: '#667eea' },
        { code: 'CARBON_TRACKER', status: 'Loading Carbon Emission Modules...', color: '#f093fb' },
        { code: 'GPU_INTERFACE', status: 'Detecting Hardware Accelerators...', color: '#00f2fe' },
        { code: 'AI_MODELS', status: 'Calibrating AI Model Registry...', color: '#51cf66' },
        { code: 'DASHBOARD', status: 'Preparing Command Interface...', color: '#ffd700' }
    ];

    // Logic for background circuit dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => [
                ...prev.slice(-15),
                {
                    id: Math.random(),
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 4 + 2
                }
            ]);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const handleEnterSystem = () => {
        setIsActivating(true);
        setBootStep(0);
        setBootProgress(0);

        // Robotic Voice Activation
        const utterance = new SpeechSynthesisUtterance("System Access Authorized. Initiating Boot Sequence.");
        utterance.rate = 1.0;
        utterance.pitch = 0.8;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);

        // Animate through boot steps
        let currentStep = 0;
        let progress = 0;

        const progressInterval = setInterval(() => {
            progress += 2;
            setBootProgress(progress);

            // Move to next step every ~16%
            if (progress > (currentStep + 1) * 16 && currentStep < bootSequence.length - 1) {
                currentStep++;
                setBootStep(currentStep);
            }

            if (progress >= 100) {
                clearInterval(progressInterval);
                // Final voice and navigate
                const finalUtterance = new SpeechSynthesisUtterance("Boot Complete. Welcome to Green AI Monitor.");
                finalUtterance.rate = 1.0;
                finalUtterance.pitch = 0.8;
                window.speechSynthesis.speak(finalUtterance);

                setTimeout(() => {
                    onNavigate();
                }, 1500);
            }
        }, 60);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--bg-primary)'
        }}>
            {/* ===== ROBOTIC BOOT SEQUENCE OVERLAY ===== */}
            {isActivating && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.95)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    {/* Spinning Ring */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        border: '3px solid rgba(0, 210, 255, 0.2)',
                        borderTop: '3px solid var(--robotic-blue)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '40px',
                        boxShadow: '0 0 30px rgba(0, 210, 255, 0.3)'
                    }}></div>

                    {/* Boot Title */}
                    <h2 style={{
                        color: 'var(--robotic-blue)',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        letterSpacing: '4px',
                        marginBottom: '30px',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--terminal-font)'
                    }}>
                        SYSTEM BOOT SEQUENCE
                    </h2>

                    {/* Boot Steps Container */}
                    <div style={{
                        width: '500px',
                        maxWidth: '90vw',
                        background: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid var(--robotic-blue)',
                        borderRadius: '8px',
                        padding: '30px',
                        fontFamily: 'monospace'
                    }}>
                        {bootSequence.map((step, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginBottom: '12px',
                                opacity: index <= bootStep ? 1 : 0.3,
                                transition: 'opacity 0.3s ease'
                            }}>
                                {/* Status Indicator */}
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: index < bootStep ? step.color : (index === bootStep ? step.color : 'rgba(255,255,255,0.2)'),
                                    boxShadow: index <= bootStep ? `0 0 10px ${step.color}` : 'none',
                                    animation: index === bootStep ? 'pulse 1s infinite' : 'none'
                                }}></div>

                                {/* Step Code */}
                                <span style={{
                                    color: step.color,
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    width: '120px'
                                }}>
                                    [{step.code}]
                                </span>

                                {/* Status Text */}
                                <span style={{
                                    color: index < bootStep ? 'var(--success-green)' : (index === bootStep ? '#fff' : 'var(--text-muted)'),
                                    fontSize: '0.85rem'
                                }}>
                                    {index < bootStep ? '✓ Complete' : (index === bootStep ? step.status : 'Pending...')}
                                </span>
                            </div>
                        ))}

                        {/* Progress Bar */}
                        <div style={{
                            marginTop: '25px',
                            height: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: '1px solid rgba(0, 210, 255, 0.3)'
                        }}>
                            <div style={{
                                width: `${bootProgress}%`,
                                height: '100%',
                                background: 'var(--primary-gradient)',
                                borderRadius: '4px',
                                transition: 'width 0.1s linear',
                                boxShadow: '0 0 15px rgba(0, 242, 254, 0.5)'
                            }}></div>
                        </div>

                        {/* Progress Text */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '10px',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)'
                        }}>
                            <span>BOOT PROGRESS</span>
                            <span style={{ color: 'var(--robotic-blue)', fontWeight: 700 }}>{bootProgress}%</span>
                        </div>
                    </div>

                    {/* Decorative Corners */}
                    <div style={{ position: 'absolute', top: '50px', left: '50px', width: '50px', height: '50px', borderTop: '3px solid var(--robotic-blue)', borderLeft: '3px solid var(--robotic-blue)' }}></div>
                    <div style={{ position: 'absolute', top: '50px', right: '50px', width: '50px', height: '50px', borderTop: '3px solid var(--robotic-blue)', borderRight: '3px solid var(--robotic-blue)' }}></div>
                    <div style={{ position: 'absolute', bottom: '50px', left: '50px', width: '50px', height: '50px', borderBottom: '3px solid var(--robotic-blue)', borderLeft: '3px solid var(--robotic-blue)' }}></div>
                    <div style={{ position: 'absolute', bottom: '50px', right: '50px', width: '50px', height: '50px', borderBottom: '3px solid var(--robotic-blue)', borderRight: '3px solid var(--robotic-blue)' }}></div>
                </div>
            )}

            {/* Global Scanline Effect for Landing */}
            <div className="scanline"></div>

            {/* Circuit Dots Background */}
            {dots.map(dot => (
                <div key={dot.id} className="circuit-dot" style={{
                    left: `${dot.x}%`,
                    top: `${dot.y}%`,
                    width: `${dot.size}px`,
                    height: `${dot.size}px`,
                    animation: 'fadeIn 2s ease-out forwards'
                }} />
            ))}

            {/* Main Title Container */}
            <div style={{
                maxWidth: '1000px',
                textAlign: 'center',
                zIndex: 1,
                position: 'relative',
                opacity: isActivating ? 0 : 1,
                transition: 'opacity 0.5s ease'
            }}>
                {/* Advanced Robotic Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 28px',
                    background: 'rgba(0, 210, 255, 0.05)',
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    borderRadius: '2px',
                    marginBottom: '40px',
                    fontSize: '0.85rem',
                    color: 'var(--robotic-blue)',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    boxShadow: '0 0 15px rgba(0, 210, 255, 0.1)',
                    position: 'relative',
                    animation: 'slideInLeft 0.8s ease-out'
                }}>
                    <div style={{ width: 8, height: 8, background: 'var(--robotic-blue)', borderRadius: '50%', boxShadow: '0 0 10px var(--robotic-blue)', animation: 'pulse 1s infinite' }}></div>
                    [ PROTOCOL: GRN_AI_INITIATED ]
                    {/* Diagnostic Corners */}
                    <div style={{ position: 'absolute', top: -5, left: -5, width: 10, height: 10, borderTop: '2px solid var(--robotic-blue)', borderLeft: '2px solid var(--robotic-blue)' }}></div>
                    <div style={{ position: 'absolute', bottom: -5, right: -5, width: 10, height: 10, borderBottom: '2px solid var(--robotic-blue)', borderRight: '2px solid var(--robotic-blue)' }}></div>
                </div>

                <h1 className="glitch-text" style={{
                    fontSize: 'clamp(3.5rem, 10vw, 6.5rem)',
                    fontWeight: 900,
                    margin: '0 0 20px 0',
                    color: '#fff',
                    letterSpacing: '-2px',
                    lineHeight: 1,
                    textTransform: 'uppercase',
                    animation: 'fadeIn 1s ease-out'
                }}>
                    Green AI <span style={{ color: 'var(--robotic-blue)' }}>Monitor</span>
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    color: 'var(--text-secondary)',
                    maxWidth: '800px',
                    margin: '0 auto 50px',
                    lineHeight: 1.8,
                    fontFamily: 'var(--terminal-font)',
                    animation: 'fadeIn 1.4s ease-out'
                }}>
                    <span style={{ color: 'var(--robotic-blue)' }}>{'>'}</span> INITIALIZING CO2 TRACKING SYSTEM...<br />
                    <span style={{ color: 'var(--robotic-blue)' }}>{'>'}</span> DEPLOYING REAL-TIME DIAGNOSTIC PROBES...<br />
                    <span style={{ color: 'var(--robotic-blue)' }}>{'>'}</span> SYSTEMS STANDBY.
                </p>

                {/* Robotic CTA Button */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div style={{ position: 'absolute', top: -10, left: -10, width: 20, height: 20, borderTop: '2px solid var(--robotic-blue)', borderLeft: '2px solid var(--robotic-blue)', opacity: 0.5 }}></div>
                    <div style={{ position: 'absolute', bottom: -10, right: -10, width: 20, height: 20, borderBottom: '2px solid var(--robotic-blue)', borderRight: '2px solid var(--robotic-blue)', opacity: 0.5 }}></div>

                    <button
                        onClick={handleEnterSystem}
                        className="robotic-btn"
                        style={{
                            padding: '20px 60px',
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            background: 'rgba(0, 210, 255, 0.1)',
                            border: '1px solid var(--robotic-blue)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            boxShadow: '0 0 20px rgba(0, 210, 255, 0.2) inset',
                            animation: 'fadeIn 1.6s ease-out'
                        }}
                    >
                        ENTER SYSTEM
                    </button>

                    <button
                        onClick={onNavigateToDemo}
                        className="robotic-btn"
                        style={{
                            display: 'block',
                            margin: '20px auto 0',
                            padding: '12px 40px',
                            fontSize: '0.9rem',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: '#ccc',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            animation: 'fadeIn 1.8s ease-out'
                        }}
                    >
                        [ WATCH PROJECT DEMO VIDEO ]
                    </button>

                    <button
                        onClick={onNavigateToAiDemo}
                        className="robotic-btn"
                        style={{
                            display: 'block',
                            margin: '20px auto 0',
                            padding: '12px 40px',
                            fontSize: '0.9rem',
                            background: 'rgba(0, 210, 255, 0.05)',
                            border: '1px solid var(--robotic-blue)',
                            color: 'var(--robotic-blue)',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            animation: 'fadeIn 2s ease-out'
                        }}
                    >
                        [ LAUNCH REAL-TIME AI DEMO ]
                    </button>

                    <button
                        onClick={() => {
                            const utterance = new SpeechSynthesisUtterance("Security protocol initiated. Terminating session.");
                            window.speechSynthesis.speak(utterance);
                            onLogout();
                        }}
                        className="robotic-btn"
                        style={{
                            display: 'block',
                            margin: '20px auto 0',
                            padding: '12px 40px',
                            fontSize: '0.8rem',
                            background: 'transparent',
                            border: '1px solid #ff4757',
                            color: '#ff4757',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            animation: 'fadeIn 2.2s ease-out'
                        }}
                    >
                        [ SECURITY LOGOUT ]
                    </button>

                    {/* Pulsing Scanner Line */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: 'var(--robotic-blue)',
                        boxShadow: '0 0 10px var(--robotic-blue)',
                        animation: 'scan-vertical 3s linear infinite',
                        pointerEvents: 'none'
                    }}></div>
                </div>

                {/* Diagnostic Feature Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fR))',
                    gap: '30px',
                    marginTop: '80px',
                    animation: 'fadeIn 2s ease-out'
                }}>
                    {[
                        { code: 'MDL_TELEM', label: 'TELEMETRY PROBE', color: '#00d2ff' },
                        { code: 'CBN_OUTPUT', label: 'CARBON DIAGNOSTICS', color: '#667eea' },
                        { code: 'NR_CORES', label: 'NEURAL OPTIMIZATION', color: '#f093fb' },
                        { code: 'SYS_LNK', label: 'REAL-TIME UPLINK', color: '#00f2fe' }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="glass-card"
                            style={{
                                padding: '30px',
                                borderLeft: `2px solid ${feature.color}`,
                                textAlign: 'left',
                                position: 'relative',
                                background: 'rgba(5, 5, 8, 0.8)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                <div style={{ fontSize: '0.65rem', color: feature.color, fontFamily: 'var(--terminal-font)', letterSpacing: '2px' }}>
                                    [ {feature.code} ]
                                </div>
                                <div style={{ width: 6, height: 6, background: feature.color, borderRadius: '50%', boxShadow: `0 0 8px ${feature.color}` }}></div>
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '1px' }}>
                                {feature.label}
                            </div>
                            <div style={{ marginTop: '10px', height: '2px', width: '30%', background: feature.color, opacity: 0.3 }}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chatbot Integration */}
            <ChatBot />

            <style>{`
                @keyframes scan-vertical {
                    0% { top: 0% }
                    100% { top: 100% }
                }

                .robotic-btn:hover {
                    background: var(--robotic-blue) !important;
                    color: #000 !important;
                    letter-spacing: 6px !important;
                    box-shadow: 0 0 40px var(--robotic-blue) !important;
                }
            `}</style>
        </div>
    );
}

export default LandingPage;

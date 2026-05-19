import React, { useState, useEffect, useRef } from 'react';

function RealTimeAiDemoPage({ onNavigateBack }) {
    const [scenario, setScenario] = useState('industrial');
    const [isOptimized, setIsOptimized] = useState(false);
    const [metrics, setMetrics] = useState({ power: 450, co2: 12.4, temp: 78, efficiency: 65 });
    const [aiLogs, setAiLogs] = useState(["[SYS] Link Established.", "[AI] Initializing Gemini Real-Time Scanner..."]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Simulations
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => {
                const jitter = (Math.random() - 0.5) * 5;
                const basePower = scenario === 'industrial' ? 450 : (scenario === 'datacenter' ? 800 : 300);
                const targetPower = isOptimized ? basePower * 0.6 : basePower;

                const newPower = Math.max(0, prev.power + (targetPower - prev.power) * 0.1 + jitter);
                return {
                    power: Math.round(newPower),
                    co2: parseFloat((newPower * 0.027).toFixed(2)),
                    temp: Math.round(60 + (newPower / 10)),
                    efficiency: isOptimized ? 94 : 68
                };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [scenario, isOptimized]);

    // AI "Thinking" Logs
    useEffect(() => {
        if (isProcessing) return;
        const logTimer = setInterval(() => {
            const thoughts = [
                `[GEMINI] Analyzing machine frequency: ${metrics.power}W detected.`,
                `[GEMINI] Thermal spike in sector 7: ${metrics.temp}°C.`,
                `[GEMINI] Carbon Intensity above threshold. Recommendation: Reduce throughput.`,
                `[GEMINI] Predicting outage risk in 15 minutes if current load persists.`,
                `[GEMINI] Cloud synchronization: Scandinavian grid factor preferred.`
            ];
            const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
            setAiLogs(prev => [randomThought, ...prev.slice(0, 8)]);
        }, 3000);
        return () => clearInterval(logTimer);
    }, [metrics, isProcessing]);

    const handleApplyOptimization = () => {
        setIsProcessing(true);
        const utterance = new SpeechSynthesisUtterance("Gemini AI optimization protocol initiated. Executing real-time load balancing.");
        window.speechSynthesis.speak(utterance);

        setAiLogs(prev => ["[AI] EXECUTING OPTIMIZATION PROTOCOL...", ...prev]);

        setTimeout(() => {
            setIsOptimized(true);
            setIsProcessing(false);
            setAiLogs(prev => ["[AI] SUCCESS: Throughput stabilized. CO2 reduced by 40%.", ...prev]);
        }, 2500);
    };

    const resetDemo = () => {
        setIsOptimized(false);
        setScenario('industrial');
        setAiLogs(["[SYS] Rebooting scenario...", "[AI] Monitoring re-initiated."]);
    };

    return (
        <div className="fade-in" style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            color: '#fff',
            padding: '40px 20px',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Header */}
            <header style={{ maxWidth: '1200px', margin: '0 auto 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
                        REAL-TIME <span style={{ color: 'var(--robotic-blue)' }}>AI SIMULATION</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Powered by Gemini AI Operational Logic</p>
                </div>
                <button onClick={onNavigateBack} className="robotic-btn" style={{ padding: '10px 25px', fontSize: '0.8rem' }}>
                    [ TERMINATE_DEMO ]
                </button>
            </header>

            <main style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>

                {/* Left Side: Dashboard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Scenario Switcher */}
                    <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '15px' }}>
                        {['industrial', 'datacenter', 'smart-city'].map(s => (
                            <button
                                key={s}
                                onClick={() => { setScenario(s); setIsOptimized(false); }}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: scenario === s ? 'var(--robotic-blue)' : 'rgba(255,255,255,0.05)',
                                    color: scenario === s ? '#000' : '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {s.replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Sensor Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        <div className="glass-card" style={{ padding: '25px', position: 'relative' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px' }}>POWER USAGE</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffd700', marginTop: '10px' }}>{metrics.power} <span style={{ fontSize: '1rem' }}>W</span></div>
                            <div style={{ marginTop: '15px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                <div style={{ width: `${(metrics.power / 1000) * 100}%`, height: '100%', background: '#ffd700', boxShadow: '0 0 10px #ffd700' }}></div>
                            </div>
                        </div>
                        <div className="glass-card" style={{ padding: '25px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px' }}>CO2 EMISSION</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-green)', marginTop: '10px' }}>{metrics.co2} <span style={{ fontSize: '1rem' }}>mg/s</span></div>
                            <div style={{ marginTop: '15px', color: isOptimized ? 'var(--accent-green)' : '#ff4757', fontSize: '0.75rem', fontWeight: 700 }}>
                                {isOptimized ? '▼ REDUCED PER AI CONTROL' : '▲ ABOVE TARGET'}
                            </div>
                        </div>
                        <div className="glass-card" style={{ padding: '25px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px' }}>TEMPERATURE</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ff4757', marginTop: '10px' }}>{metrics.temp} <span style={{ fontSize: '1rem' }}>°C</span></div>
                        </div>
                        <div className="glass-card" style={{ padding: '25px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px' }}>SUSTAINABILITY</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--robotic-blue)', marginTop: '10px' }}>{metrics.efficiency}%</div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        {!isOptimized ? (
                            <button
                                onClick={handleApplyOptimization}
                                disabled={isProcessing}
                                className="robotic-btn"
                                style={{
                                    padding: '25px 60px',
                                    fontSize: '1.4rem',
                                    background: isProcessing ? 'rgba(0, 210, 255, 0.1)' : 'var(--primary-gradient)',
                                    border: 'none',
                                    color: '#000',
                                    boxShadow: '0 0 40px rgba(0, 210, 255, 0.3)',
                                    animation: isProcessing ? 'none' : 'pulse 2s infinite'
                                }}
                            >
                                {isProcessing ? 'SCANNING & REDUCING...' : '[ START REAL-TIME AI REDUCTION ]'}
                            </button>
                        ) : (
                            <div className="fade-in" style={{ padding: '20px', background: 'rgba(81, 207, 102, 0.1)', border: '1px solid var(--accent-green)', borderRadius: '4px' }}>
                                <h3 style={{ color: 'var(--accent-green)', fontWeight: 800 }}>✓ AI OPTIMIZATION ACTIVE</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px' }}>
                                    Gemini AI is currently managing machine throughput to maintain minimal CO2 footprint.
                                </p>
                                <button onClick={resetDemo} style={{ marginTop: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                                    Reset Simulation
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: AI Terminal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-card" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--robotic-blue)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--robotic-blue)', marginBottom: '15px', fontWeight: 800, borderBottom: '1px solid rgba(0, 210, 255, 0.2)', paddingBottom: '8px' }}>
                            GEMINI_AI_LIVE_ANALYTICS
                        </div>
                        <div style={{ flex: 1, overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                            {aiLogs.map((log, i) => (
                                <div key={i} style={{ color: log.startsWith('[AI]') ? 'var(--accent-green)' : (log.startsWith('[GEMINI]') ? 'var(--robotic-blue)' : '#fff'), opacity: 1 - (i * 0.1) }}>
                                    {log}
                                </div>
                            ))}
                            <div className="cursor-blink" style={{ color: 'var(--robotic-blue)' }}>_</div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <div style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>DEV_NOTE_COPILOT:</div>
                        "This dashboard's real-time streaming logic and chart components were optimized using GitHub Copilot to ensure zero lag and minimal CPU overhead during visualization."
                    </div>
                </div>

            </main>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 210, 255, 0.2); }
                    50% { transform: scale(1.02); box-shadow: 0 0 40px rgba(0, 210, 255, 0.4); }
                    100% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 210, 255, 0.2); }
                }
                .cursor-blink { animation: blink 1s step-end infinite; }
                @keyframes blink { 50% { opacity: 0; } }
            `}</style>
        </div>
    );
}

export default RealTimeAiDemoPage;

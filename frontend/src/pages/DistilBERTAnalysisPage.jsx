import React, { useState, useRef } from 'react';
import ComparisonTable from '../components/ComparisonTable';

function DistilBERTAnalysisPage({ onNavigateBack }) {
    const [step, setStep] = useState('IDLE');
    const [inputText, setInputText] = useState('');
    const [scanProgress, setScanProgress] = useState(0);
    const audioContextRef = useRef(null);
    const scanSoundIntervalRef = useRef(null);

    // Metrics State
    const [baselineMetrics, setBaselineMetrics] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [optimizationPlan, setOptimizationPlan] = useState(null);
    const [optimizedMetrics, setOptimizedMetrics] = useState(null);

    // Sound Effects
    const playScanSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        const baseFreq = 600 + Math.random() * 300;
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, ctx.currentTime + 0.1);
        osc.type = 'triangle';
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    };

    const playTransformerSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
        osc.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    };

    const startScanSounds = () => {
        playScanSound();
        let counter = 0;
        scanSoundIntervalRef.current = setInterval(() => {
            counter++;
            if (counter % 4 === 0) playTransformerSound();
            else playScanSound();
        }, 150);
    };

    const stopScanSounds = () => {
        if (scanSoundIntervalRef.current) {
            clearInterval(scanSoundIntervalRef.current);
            scanSoundIntervalRef.current = null;
        }
    };

    const startFineTuning = () => {
        if (!inputText.trim()) {
            alert('Please enter sample text for fine-tuning simulation');
            return;
        }
        setStep('SCANNING');
        setScanProgress(0);
        const utterance = new SpeechSynthesisUtterance("Initiating DistilBERT Transformer Scan. Analyzing Self-Attention Layers.");
        utterance.rate = 1.0;
        utterance.pitch = 0.8;
        window.speechSynthesis.speak(utterance);
        startScanSounds();
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1.5;
            setScanProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                stopScanSounds();
                calculateBaseline();
            }
        }, 60);
    };

    const calculateBaseline = () => {
        const textLength = inputText.length;
        const baseCO2 = 0.6 + (textLength / 1000) * 0.3;
        const metrics = {
            model: "DistilBERT", runtime_minutes: 50, co2_kg: parseFloat(baseCO2.toFixed(4)),
            energy_kwh: parseFloat((baseCO2 * 2.2).toFixed(4)), epochs: 3, batch_size: 64,
            gpu_load: 92, transformer_layers: 6, attention_heads: 12
        };
        setBaselineMetrics(metrics);
        setStep('SHOW_BASELINE');
    };

    const startAnalysis = () => {
        setStep('ANALYZING');
        setScanProgress(0);
        let progress = 0;
        const interval = setInterval(() => { progress += 3; setScanProgress(progress); if (progress >= 100) clearInterval(interval); }, 80);
        setTimeout(() => {
            setAnalysisResult({ factors: ["High self-attention computation load", "Large batch size increases memory usage", "3 epochs extends transformer processing time", "Full precision (FP32) training detected"] });
            setOptimizationPlan({ suggestions: ["Reduce epochs from 3 → 2 (Early Stopping)", "Reduce batch size from 64 → 32", "Enable Mixed Precision (FP16) training", "Use gradient checkpointing"], estimated_reduction_percentage: 45, optimized_config: { epochs: 2, batch_size: 32 } });
            setStep('SHOW_SUGGESTIONS');
        }, 2500);
    };

    const applyOptimization = () => {
        setStep('OPTIMIZING');
        setScanProgress(0);
        const utterance = new SpeechSynthesisUtterance("Applying optimizations. Re-running DistilBERT with efficient parameters.");
        utterance.rate = 1.0; utterance.pitch = 0.8;
        window.speechSynthesis.speak(utterance);
        startScanSounds();
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2; setScanProgress(progress);
            if (progress >= 100) { clearInterval(interval); stopScanSounds(); completeOptimization(); }
        }, 50);
    };

    const completeOptimization = () => {
        setOptimizedMetrics({ ...baselineMetrics, runtime_minutes: 25, co2_kg: (baselineMetrics.co2_kg * 0.55).toFixed(4), energy_kwh: (baselineMetrics.energy_kwh * 0.55).toFixed(4), epochs: 2, batch_size: 32 });
        setStep('COMPLETED');
    };

    // Transformer Block Component
    const TransformerBlock = ({ layer, active, complete }) => (
        <div style={{
            width: '100%', padding: '12px', marginBottom: '8px', background: complete ? 'rgba(0, 255, 127, 0.1)' : (active ? 'rgba(192, 132, 252, 0.2)' : 'rgba(0,0,0,0.3)'),
            border: `2px solid ${complete ? 'var(--success-green)' : (active ? 'var(--accent-magenta)' : 'rgba(255,255,255,0.1)')}`,
            borderRadius: '8px', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease'
        }}>
            {active && <div className="data-flow-beam"></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: complete ? 'var(--success-green)' : (active ? '#fff' : 'var(--text-muted)'), fontWeight: 700, fontSize: '0.9rem' }}>
                    {layer.name}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(layer.heads || 4)].map((_, i) => (
                        <div key={i} className={active ? 'attention-head-active' : ''} style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: complete ? 'var(--success-green)' : (active ? 'var(--accent-magenta)' : 'rgba(255,255,255,0.2)'),
                            boxShadow: active ? '0 0 8px var(--accent-magenta)' : 'none',
                            animation: active ? `pulseHead 0.5s ease-in-out ${i * 0.1}s infinite` : 'none'
                        }}></div>
                    ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: complete ? 'var(--success-green)' : (active ? 'var(--accent-orange)' : 'var(--text-muted)') }}>
                    {complete ? '✓' : (active ? 'PROCESSING...' : 'PENDING')}
                </span>
            </div>
        </div>
    );

    const transformerLayers = [
        { name: 'TOKENIZER', threshold: 10, heads: 0 },
        { name: 'EMBEDDING', threshold: 20, heads: 0 },
        { name: 'TRANSFORMER_L1', threshold: 30, heads: 4 },
        { name: 'TRANSFORMER_L2', threshold: 40, heads: 4 },
        { name: 'TRANSFORMER_L3', threshold: 50, heads: 4 },
        { name: 'TRANSFORMER_L4', threshold: 60, heads: 4 },
        { name: 'TRANSFORMER_L5', threshold: 70, heads: 4 },
        { name: 'TRANSFORMER_L6', threshold: 80, heads: 4 },
        { name: 'CLASSIFIER', threshold: 95, heads: 0 }
    ];

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '40px', position: 'relative', overflow: 'hidden' }}>
            <div className="scanline"></div>

            {/* Animated Background Grid */}
            <div className="neural-grid"></div>

            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative', zIndex: 10 }}>
                <button onClick={onNavigateBack} className="robotic-btn" style={{ padding: '10px 20px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid var(--robotic-blue)', color: '#fff', cursor: 'pointer' }}>
                    [ BACK_TO_HQ ]
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="status-pulse"></div>
                    <span style={{ color: 'var(--accent-magenta)', letterSpacing: '2px', fontWeight: 'bold' }}>
                        MODULE: DistilBERT_TRANSFORMER_DIAGNOSTICS
                    </span>
                </div>
            </header>

            {/* --- STEP 1: TEXT INPUT & SCANNING --- */}
            {(step === 'IDLE' || step === 'SCANNING') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', position: 'relative', zIndex: 10 }}>
                    {/* Left: Text Input */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="bracket-glow">[</span> 01 <span className="bracket-glow">]</span> TEXT_INPUT_BUFFER
                        </h3>
                        <div className="glass-card" style={{ padding: '30px', border: '2px solid rgba(192, 132, 252, 0.3)', minHeight: '450px', position: 'relative' }}>
                            {/* Decorative Corners */}
                            <div className="corner-bracket top-left"></div>
                            <div className="corner-bracket top-right"></div>
                            <div className="corner-bracket bottom-left"></div>
                            <div className="corner-bracket bottom-right"></div>

                            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)}
                                placeholder="Enter sample text for DistilBERT fine-tuning simulation...&#10;&#10;Example: 'Green AI is important for sustainability.'"
                                style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(192, 132, 252, 0.5)', borderRadius: '4px', color: '#fff', padding: '15px', fontSize: '1rem', fontFamily: 'monospace', resize: 'none' }}
                            />
                            {step === 'IDLE' && inputText.trim() && (
                                <button onClick={startFineTuning} className="robotic-btn glow-btn" style={{ marginTop: '20px', padding: '18px 30px', width: '100%', background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.3), rgba(102, 126, 234, 0.3))', border: '2px solid var(--accent-magenta)', color: '#fff', cursor: 'pointer', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '3px' }}>
                                    ⚡ INITIALIZE_BERT_SCAN
                                </button>
                            )}
                            {step === 'SCANNING' && (
                                <div style={{ marginTop: '20px' }}>
                                    <div className="scan-header">
                                        <span className="blink-text">◉</span> NEURAL NETWORK ACTIVE
                                    </div>
                                    <div className="progress-container">
                                        <div className="progress-bar-animated" style={{ width: `${scanProgress}%` }}></div>
                                        <div className="progress-glow" style={{ left: `${scanProgress}%` }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem' }}>
                                        <span style={{ color: 'var(--accent-magenta)' }}>TRANSFORMER ANALYSIS</span>
                                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{scanProgress.toFixed(0)}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Animated Transformer Visualization */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="bracket-glow">[</span> 02 <span className="bracket-glow">]</span> TRANSFORMER_ARCHITECTURE
                        </h3>
                        <div className="glass-card" style={{ padding: '20px', minHeight: '450px', position: 'relative' }}>
                            <div className="corner-bracket top-left"></div>
                            <div className="corner-bracket top-right"></div>
                            <div className="corner-bracket bottom-left"></div>
                            <div className="corner-bracket bottom-right"></div>

                            {step === 'IDLE' && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-muted)' }}>
                                    <div className="idle-transformer-icon">🧠</div>
                                    <p>Awaiting input for neural analysis...</p>
                                </div>
                            )}

                            {step === 'SCANNING' && (
                                <div>
                                    {/* Neural Network Header */}
                                    <div style={{ textAlign: 'center', marginBottom: '15px', padding: '10px', background: 'rgba(192, 132, 252, 0.1)', borderRadius: '8px', border: '1px solid var(--accent-magenta)' }}>
                                        <span style={{ color: 'var(--accent-magenta)', fontWeight: 'bold', letterSpacing: '2px' }}>
                                            DistilBERT ARCHITECTURE • 6 LAYERS • 12 HEADS
                                        </span>
                                    </div>

                                    {/* Transformer Layers */}
                                    {transformerLayers.map((layer, idx) => (
                                        <TransformerBlock key={idx} layer={layer} active={scanProgress >= layer.threshold - 10 && scanProgress < layer.threshold + 5} complete={scanProgress > layer.threshold + 5} />
                                    ))}

                                    {/* Energy Flow Indicator */}
                                    <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255, 165, 0, 0.1)', borderRadius: '8px', border: '1px solid var(--accent-orange)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--accent-orange)', fontSize: '0.85rem' }}>⚡ POWER DRAW</span>
                                            <span style={{ color: '#fff', fontWeight: 'bold' }}>{(scanProgress * 2.5).toFixed(0)} W</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- BASELINE RESULTS --- */}
            {(step === 'SHOW_BASELINE' || step === 'SHOW_SUGGESTIONS' || step === 'COMPLETED') && baselineMetrics && (
                <div className="glass-card fade-in" style={{ padding: '30px', marginBottom: '40px', borderLeft: '4px solid var(--accent-magenta)', position: 'relative', zIndex: 10 }}>
                    <h3 style={{ color: '#fff', marginBottom: '20px' }}>📊 DISTILBERT BASELINE EMISSION</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', textAlign: 'center' }}>
                        <div className="metric-card"><div className="metric-label">CO₂ Magnitude</div><div className="metric-value magenta">{baselineMetrics.co2_kg} kg</div></div>
                        <div className="metric-card"><div className="metric-label">Energy Used</div><div className="metric-value">{baselineMetrics.energy_kwh} kWh</div></div>
                        <div className="metric-card"><div className="metric-label">Transformer Layers</div><div className="metric-value blue">{baselineMetrics.transformer_layers}</div></div>
                        <div className="metric-card"><div className="metric-label">Attention Heads</div><div className="metric-value">{baselineMetrics.attention_heads}</div></div>
                        <div className="metric-card"><div className="metric-label">Epochs</div><div className="metric-value">{baselineMetrics.epochs}</div></div>
                    </div>
                    {step === 'SHOW_BASELINE' && (
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <button onClick={startAnalysis} className="robotic-btn glow-btn" style={{ padding: '18px 50px', border: '2px solid var(--robotic-blue)', background: 'transparent', color: 'var(--robotic-blue)', cursor: 'pointer', fontSize: '1.1rem' }}>
                                [ ANALYZE & IDENTIFY ISSUES ]
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* --- ANALYZING OVERLAY --- */}
            {step === 'ANALYZING' && (
                <div className="glass-card fade-in" style={{ padding: '60px', textAlign: 'center', border: '2px solid var(--robotic-blue)', position: 'relative', zIndex: 10 }}>
                    <div className="multi-ring-spinner"></div>
                    <h3 style={{ color: 'var(--robotic-blue)', marginTop: '30px' }}>ANALYZING TRANSFORMER LAYERS...</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Scanning self-attention weights and emission factors...</p>
                </div>
            )}

            {/* --- SUGGESTIONS --- */}
            {(step === 'SHOW_SUGGESTIONS' || step === 'COMPLETED') && analysisResult && optimizationPlan && (
                <div className="fade-in" style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                        <div className="glass-card" style={{ padding: '30px', borderTop: '4px solid var(--warning-yellow)' }}>
                            <h3 style={{ color: 'var(--accent-orange)' }}>🧠 IMPACT ANALYSIS</h3>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                                {analysisResult.factors.map((f, i) => <li key={i} className="analysis-item warning">⚠ {f}</li>)}
                            </ul>
                        </div>
                        <div className="glass-card" style={{ padding: '30px', borderTop: '4px solid var(--success-green)' }}>
                            <h3 style={{ color: 'var(--success-green)' }}>💡 OPTIMIZATION STRATEGY</h3>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                                {optimizationPlan.suggestions.map((s, i) => <li key={i} className="analysis-item success">✓ {s}</li>)}
                            </ul>
                        </div>
                    </div>
                    {step === 'SHOW_SUGGESTIONS' && (
                        <div style={{ textAlign: 'center' }}>
                            <button onClick={applyOptimization} className="robotic-btn mega-glow-btn" style={{ padding: '22px 60px', fontSize: '1.3rem', background: 'var(--primary-gradient)', border: 'none', color: '#000', cursor: 'pointer', fontWeight: 900 }}>
                                ⚡ APPLY OPTIMIZATIONS & RE-RUN
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* --- OPTIMIZING OVERLAY --- */}
            {step === 'OPTIMIZING' && (
                <div className="glass-card fade-in" style={{ padding: '60px', textAlign: 'center', border: '2px solid var(--success-green)', background: 'rgba(0, 255, 127, 0.05)', position: 'relative', zIndex: 10 }}>
                    <div className="multi-ring-spinner green"></div>
                    <h3 style={{ color: 'var(--success-green)', marginTop: '30px' }}>RE-RUNNING WITH OPTIMIZED PARAMS...</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>DistilBERT: Epochs=2, Batch=32, FP16=Enabled</p>
                    <div className="progress-container" style={{ width: '400px', margin: '20px auto' }}>
                        <div className="progress-bar-animated green" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                </div>
            )}

            {/* --- COMPLETED --- */}
            {step === 'COMPLETED' && optimizedMetrics && (
                <div className="fade-in" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="glass-card success-banner">
                        <h2>✅ DISTILBERT OPTIMIZATION SUCCESSFUL</h2>
                        <p>Model re-calibrated with reduced carbon footprint.</p>
                    </div>
                    <ComparisonTable baseline={baselineMetrics} optimized={optimizedMetrics} />
                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <button onClick={() => window.location.reload()} className="robotic-btn" style={{ padding: '15px 30px', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            [ START_NEW_SESSION ]
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulseHead { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.4); opacity: 1; } }
                @keyframes dataFlow { 0% { left: -100%; } 100% { left: 100%; } }
                @keyframes gridPulse { 0%, 100% { opacity: 0.03; } 50% { opacity: 0.08; } }
                @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 20px var(--accent-magenta); } 50% { box-shadow: 0 0 40px var(--accent-magenta), 0 0 60px var(--accent-magenta); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

                .neural-grid { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-image: linear-gradient(rgba(192, 132, 252, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(192, 132, 252, 0.05) 1px, transparent 1px); background-size: 50px 50px; animation: gridPulse 4s ease-in-out infinite; pointer-events: none; }
                .status-pulse { width: 12px; height: 12px; background: var(--accent-magenta); border-radius: 50%; animation: pulseHead 1s infinite; box-shadow: 0 0 15px var(--accent-magenta); }
                .bracket-glow { color: var(--accent-magenta); text-shadow: 0 0 10px var(--accent-magenta); }
                .corner-bracket { position: absolute; width: 20px; height: 20px; border-color: var(--accent-magenta); }
                .corner-bracket.top-left { top: 0; left: 0; border-top: 2px solid; border-left: 2px solid; }
                .corner-bracket.top-right { top: 0; right: 0; border-top: 2px solid; border-right: 2px solid; }
                .corner-bracket.bottom-left { bottom: 0; left: 0; border-bottom: 2px solid; border-left: 2px solid; }
                .corner-bracket.bottom-right { bottom: 0; right: 0; border-bottom: 2px solid; border-right: 2px solid; }
                .data-flow-beam { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(192, 132, 252, 0.4), transparent); animation: dataFlow 1.5s linear infinite; }
                .scan-header { display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(192, 132, 252, 0.15); border: 1px solid var(--accent-magenta); border-radius: 6px; color: var(--accent-magenta); font-weight: bold; margin-bottom: 15px; }
                .blink-text { animation: blink 1s infinite; font-size: 1.2rem; }
                .progress-container { height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; position: relative; border: 1px solid rgba(192, 132, 252, 0.3); }
                .progress-bar-animated { height: 100%; background: linear-gradient(90deg, #667eea, #f093fb, #667eea); background-size: 200% 100%; animation: gradientMove 2s linear infinite; border-radius: 5px; transition: width 0.1s linear; }
                .progress-bar-animated.green { background: linear-gradient(90deg, #00f2fe, #51cf66, #00f2fe); }
                @keyframes gradientMove { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
                .progress-glow { position: absolute; top: 0; width: 20px; height: 100%; background: radial-gradient(circle, rgba(192, 132, 252, 0.8), transparent); filter: blur(8px); transition: left 0.1s linear; }
                .idle-transformer-icon { font-size: 4rem; opacity: 0.3; margin-bottom: 20px; }
                .glow-btn { animation: glowPulse 2s ease-in-out infinite; transition: all 0.3s ease; }
                .glow-btn:hover { transform: scale(1.05); letter-spacing: 5px !important; }
                .mega-glow-btn { box-shadow: 0 0 30px rgba(0, 242, 254, 0.5), 0 0 60px rgba(0, 242, 254, 0.3); animation: glowPulse 2s ease-in-out infinite; }
                .multi-ring-spinner { width: 80px; height: 80px; margin: 0 auto; position: relative; }
                .multi-ring-spinner::before, .multi-ring-spinner::after { content: ''; position: absolute; border: 3px solid transparent; border-radius: 50%; }
                .multi-ring-spinner::before { top: 0; left: 0; right: 0; bottom: 0; border-top-color: var(--robotic-blue); animation: spin 1s linear infinite; }
                .multi-ring-spinner::after { top: 8px; left: 8px; right: 8px; bottom: 8px; border-bottom-color: var(--accent-magenta); animation: spin 1.5s linear infinite reverse; }
                .multi-ring-spinner.green::before { border-top-color: var(--success-green); }
                .multi-ring-spinner.green::after { border-bottom-color: #00f2fe; }
                .metric-card { padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
                .metric-label { color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 8px; }
                .metric-value { font-size: 1.8rem; font-weight: bold; color: #fff; }
                .metric-value.magenta { color: var(--accent-magenta); }
                .metric-value.blue { color: var(--robotic-blue); }
                .analysis-item { margin-bottom: 12px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 6px; transition: all 0.3s ease; }
                .analysis-item.warning { color: #ffd700; border-left: 3px solid #ffd700; }
                .analysis-item.success { color: #fff; border-left: 3px solid var(--success-green); }
                .analysis-item:hover { transform: translateX(5px); }
                .success-banner { padding: '20px'; marginBottom: '40px'; background: rgba(0, 255, 127, 0.08); border: 2px solid var(--success-green); text-align: center; }
                .success-banner h2 { color: #fff; margin-bottom: 10px; }
                .success-banner p { color: var(--text-secondary); }
            `}</style>
        </div>
    );
}

export default DistilBERTAnalysisPage;

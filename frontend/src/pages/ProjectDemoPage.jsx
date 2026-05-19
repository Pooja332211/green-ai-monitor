import React, { useState, useEffect, useRef } from 'react';

// --- DECODING TEXT COMPONENT ---
const DecodingText = ({ text, speed = 50, color = '#fff' }) => {
    const [display, setDisplay] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplay(prev => {
                if (i >= text.length) {
                    clearInterval(interval);
                    return text;
                }
                const randomChars = Array(text.length - i).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
                return text.substring(0, i) + randomChars;
            });
            i++;
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);

    return <span style={{ color, fontFamily: 'monospace' }}>{display}</span>;
};

function ProjectDemoPage({ onNavigateBack }) {
    const [scene, setScene] = useState(0);
    const [subText, setSubText] = useState('');
    const audioContextRef = useRef(null);
    const canvasRef = useRef(null);

    // --- SOUND ENGINE (ENHANCED) ---
    const playSound = (type) => {
        if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const ctx = audioContextRef.current;
        const t = ctx.currentTime;

        // MASTER COMPRESSOR for loud punches
        const comp = ctx.createDynamicsCompressor();
        comp.connect(ctx.destination);

        switch (type) {
            case 'intro': // Deep cinematic drone
                const oscIntro = ctx.createOscillator();
                const gainIntro = ctx.createGain();
                oscIntro.frequency.setValueAtTime(50, t);
                oscIntro.frequency.exponentialRampToValueAtTime(100, t + 4);
                oscIntro.type = 'sawtooth';
                gainIntro.gain.setValueAtTime(0, t);
                gainIntro.gain.linearRampToValueAtTime(0.4, t + 1);
                gainIntro.gain.exponentialRampToValueAtTime(0.001, t + 4);
                oscIntro.connect(gainIntro).connect(comp);
                oscIntro.start(t);
                extraSub(ctx, t, 40);
                break;

            case 'scan': // High-tech stutter
                const oscScan = ctx.createOscillator();
                const gainScan = ctx.createGain();
                oscScan.type = 'square';
                oscScan.frequency.setValueAtTime(800, t);
                gainScan.gain.setValueAtTime(0.1, t);
                oscScan.connect(gainScan).connect(comp);
                oscScan.start(t);
                oscScan.stop(t + 0.1);

                // Burst of noise
                const noise = ctx.createBufferSource();
                const b = ctx.createBuffer(1, 4000, ctx.sampleRate);
                const d = b.getChannelData(0);
                for (let i = 0; i < 4000; i++) d[i] = Math.random() * 2 - 1;
                noise.buffer = b;
                const ng = ctx.createGain();
                ng.gain.value = 0.05;
                noise.connect(ng).connect(comp);
                noise.start(t);
                break;

            case 'alert': // Alarm siren
                const oscAlert = ctx.createOscillator();
                const gainAlert = ctx.createGain();
                oscAlert.type = 'sawtooth';
                oscAlert.frequency.setValueAtTime(600, t);
                oscAlert.frequency.linearRampToValueAtTime(400, t + 0.3);
                gainAlert.gain.setValueAtTime(0.2, t);
                gainAlert.gain.linearRampToValueAtTime(0, t + 0.3);
                oscAlert.connect(gainAlert).connect(comp);
                oscAlert.start(t);
                oscAlert.stop(t + 0.5);
                break;

            case 'optimize': // Shiny computing sound
                const oscOpt = ctx.createOscillator();
                const gainOpt = ctx.createGain();
                oscOpt.type = 'sine';
                oscOpt.frequency.setValueAtTime(1200, t);
                oscOpt.frequency.exponentialRampToValueAtTime(200, t + 0.5);
                gainOpt.gain.setValueAtTime(0.2, t);
                gainOpt.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
                oscOpt.connect(gainOpt).connect(comp);
                oscOpt.start(t);
                oscOpt.stop(t + 0.5);
                break;

            case 'success': // Heavenly chord
                [440, 554, 659].forEach(f => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.frequency.value = f;
                    o.type = 'triangle';
                    g.gain.setValueAtTime(0.1, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 2);
                    o.connect(g).connect(comp);
                    o.start(t);
                });
                break;
            default:
                break;
        }
    };

    const extraSub = (ctx, t, freq) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 3);
        o.connect(g).connect(ctx.destination);
        o.start(t);
    };

    // --- SEQUENCER ---
    useEffect(() => {
        const runDemo = async () => {
            // SCENE 0: BOOT
            setSubText('ESTABLISHING SECURE CONNECTION...');
            playSound('intro');
            await wait(2500);

            // SCENE 1: GLOBAL SCAN
            setScene(1);
            setSubText('SCANNING TARGET INFRASTRUCTURE...');
            for (let i = 0; i < 5; i++) { playSound('scan'); await wait(400); }
            await wait(1500);

            // SCENE 2: THREAT DETECTION
            setScene(2);
            setSubText('ANALYZING EMISSION SPECTRA...');
            playSound('alert');
            await wait(3500);

            // SCENE 3: OPTIMIZATION
            setScene(3);
            setSubText('DEPLOYING GREEN AI ALGORITHMS...');
            playSound('optimize');
            await wait(3500);

            // SCENE 4: SUCCESS
            setScene(4);
            setSubText('OPTIMIZATION COMPLETE. EFFICIENCY +45%.');
            playSound('success');

            // Final Voice
            const msg = new SpeechSynthesisUtterance("System Optimized. Carbon footprint minimized.");
            msg.rate = 1.1; msg.pitch = 0.9;
            window.speechSynthesis.speak(msg);
        };
        runDemo();
    }, []);

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    // --- CANVAS PARTICLES ---
    useEffect(() => {
        const c = canvasRef.current;
        const ctx = c.getContext('2d');
        c.width = window.innerWidth;
        c.height = window.innerHeight;

        let p = Array(100).fill(0).map(() => ({
            x: Math.random() * c.width,
            y: Math.random() * c.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        }));

        const loop = () => {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.4)'; // Trails
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.fillStyle = scene === 2 ? '#ff0055' : scene === 4 ? '#00ffa3' : '#00d2ff'; // Color shift based on scene

            p.forEach(pt => {
                pt.x += pt.vx; pt.y += pt.vy;
                if (pt.x < 0 || pt.x > c.width) pt.vx *= -1;
                if (pt.y < 0 || pt.y > c.height) pt.vy *= -1;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            });

            // Connect lines
            ctx.strokeStyle = scene === 2 ? 'rgba(255,0,85,0.1)' : 'rgba(0, 210, 255, 0.1)';
            for (let i = 0; i < p.length; i++) {
                for (let j = i + 1; j < p.length; j++) {
                    const dx = p[i].x - p[j].x;
                    const dy = p[i].y - p[j].y;
                    if (dx * dx + dy * dy < 10000) {
                        ctx.beginPath();
                        ctx.moveTo(p[i].x, p[i].y);
                        ctx.lineTo(p[j].x, p[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(loop);
        };
        loop();
    }, [scene]);

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#050505', overflow: 'hidden', fontFamily: 'monospace', color: '#fff', zIndex: 9999 }}>
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

            {/* --- HUD OVERLAYS --- */}
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
            <div className="scanline"></div>
            <div className="vignette"></div>

            <div style={{ position: 'absolute', top: 20, left: 30, display: 'flex', gap: 20, fontSize: '0.8rem', color: 'var(--robotic-blue)' }}>
                <div>SYS.T: {(Date.now() / 1000).toFixed(2)}</div>
                <div>MEM: {Math.floor(Math.random() * 40 + 20)}TB</div>
                <div style={{ color: 'red', animation: 'blink 1s infinite' }}>● REC</div>
            </div>

            <button onClick={onNavigateBack} className="robotic-btn" style={{ position: 'absolute', top: 20, right: 30, zIndex: 1000, background: 'rgba(0,0,0,0.5)', border: '1px solid #fff', color: '#fff' }}>[ ABORT DEMO ]</button>

            {/* --- MAIN STAGE (3D PERSPECTIVE) --- */}
            <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                perspective: '1000px', transformStyle: 'preserve-3d'
            }}>

                {/* SCENE 0: INTRO */}
                {scene === 0 && (
                    <div className="scene-enter" style={{ textAlign: 'center' }}>
                        <div className="glitch-logo" style={{ fontSize: '5rem', fontWeight: 900, textShadow: '0 0 30px var(--robotic-blue)' }}>
                            GREEN AI<br /><span style={{ fontSize: '2rem', letterSpacing: '10px' }}>PROTOCOL</span>
                        </div>
                        <div style={{ marginTop: 20, width: '300px', height: '2px', background: 'var(--robotic-blue)', margin: '20px auto' }}></div>
                    </div>
                )}

                {/* SCENE 1: SCANNING */}
                {scene === 1 && (
                    <div className="scene-enter" style={{ position: 'relative' }}>
                        <div className="holo-ring"></div>
                        <div className="holo-ring reverse"></div>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src="/logo192.png" style={{ width: 100, filter: 'hue-rotate(180deg) drop-shadow(0 0 10px cyan)', opacity: 0.8 }} alt="Target" />
                        </div>
                        <div style={{ marginTop: 250, textAlign: 'center', color: 'cyan', fontSize: '1.5rem', letterSpacing: 4 }}>
                            <DecodingText text="TARGET_ACQUIRED" />
                        </div>
                    </div>
                )}

                {/* SCENE 2: ALERT */}
                {scene === 2 && (
                    <div className="scene-enter" style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                        <div style={{ border: '2px solid red', padding: 40, background: 'rgba(255,0,0,0.1)', animation: 'shake 0.5s infinite' }}>
                            <div style={{ fontSize: '4rem', color: 'red', fontWeight: 'bold' }}>⚠ WARNING</div>
                            <div style={{ color: 'red', marginTop: 10 }}>HIGH CARBON EMISSIONS DETECTED</div>
                        </div>
                        <div style={{ textAlign: 'left', fontSize: '1.2rem', color: '#ff5555' }}>
                            <div>{'>'} GPU_LOAD: 98%</div>
                            <div>{'>'} EFFICIENCY: CRITICAL</div>
                            <div>{'>'} CO2_RATE: 4.2 kg/h</div>
                        </div>
                    </div>
                )}

                {/* SCENE 3: OPTIMIZE */}
                {scene === 3 && (
                    <div className="scene-enter" style={{ textAlign: 'center' }}>
                        <div className="hex-grid"></div>
                        <div style={{ fontSize: '3rem', color: '#fff', textShadow: '0 0 20px #fff' }}>OPTIMIZING...</div>
                        <div style={{ width: '600px', height: '20px', border: '1px solid #fff', padding: 2, margin: '30px auto' }}>
                            <div style={{ height: '100%', background: '#fff', animation: 'fillBar 3s ease-in-out forwards', boxShadow: '0 0 20px #fff' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '600px', margin: '0 auto', color: '#aaa', fontSize: '0.8rem' }}>
                            <span>REWRITING KERNELS</span>
                            <span>PRUNING WEIGHTS</span>
                            <span>COMPRESSING</span>
                        </div>
                    </div>
                )}

                {/* SCENE 4: SUCCESS */}
                {scene === 4 && (
                    <div className="scene-enter">
                        <div style={{
                            width: 200, height: 200, borderRadius: '50%', border: '4px solid #00ffa3',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 50px #00ffa3', margin: '0 auto 40px', background: 'rgba(0, 255, 163, 0.1)'
                        }}>
                            <span style={{ fontSize: '5rem', color: '#00ffa3' }}>✓</span>
                        </div>
                        <h1 style={{ fontSize: '3rem', color: '#00ffa3', textAlign: 'center', letterSpacing: 5 }}>OPTIMIZED</h1>
                        <div style={{ display: 'flex', gap: 40, marginTop: 40, textAlign: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>CO2 REDUCTION</div>
                                <div style={{ fontSize: '2rem', color: '#fff' }}>45%</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>PERFORMANCE</div>
                                <div style={{ fontSize: '2rem', color: '#fff' }}>+2.5x</div>
                            </div>
                        </div>
                        <button onClick={() => setScene(0)} style={{ marginTop: '50px', padding: '15px 40px', background: 'transparent', border: '1px solid #00ffa3', color: '#00ffa3', cursor: 'pointer', fontSize: '1.2rem', letterSpacing: 3 }}>
                            RE-RUN SIMULATION
                        </button>
                    </div>
                )}

            </div>

            {/* SUBTEXT FOOTER */}
            <div style={{
                position: 'absolute', bottom: 60, left: 0, width: '100%', textAlign: 'center',
                textTransform: 'uppercase', letterSpacing: 3, color: scene === 2 ? 'red' : scene === 4 ? '#00ffa3' : 'cyan',
                textShadow: '0 0 10px currentColor'
            }}>
                <DecodingText text={subText} speed={30} color="currentColor" />
            </div>

            <style>{`
                .scene-enter { animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.8) translateZ(-500px); } to { opacity: 1; transform: scale(1) translateZ(0); } }
                
                .hud-corner { position: absolute; width: 40px; height: 40px; border-color: rgba(255,255,255,0.3); z-index: 100; }
                .top-left { top: 20px; left: 20px; border-top: 2px solid; border-left: 2px solid; }
                .top-right { top: 20px; right: 20px; border-top: 2px solid; border-right: 2px solid; }
                .bottom-left { bottom: 20px; left: 20px; border-bottom: 2px solid; border-left: 2px solid; }
                .bottom-right { bottom: 20px; right: 20px; border-bottom: 2px solid; border-right: 2px solid; }

                .vignette { position: absolute; inset: 0; background: radial-gradient(circle, transparent 50%, #000 120%); pointer-events: none; z-index: 50; }
                
                .holo-ring { width: 300px; height: 300px; border: 2px dashed cyan; border-radius: 50%; position: absolute; animation: spin 10s linear infinite; box-shadow: 0 0 20px cyan; }
                .holo-ring.reverse { width: 250px; height: 250px; border: 4px dotted rgba(0,255,255,0.5); animation: spin 5s linear infinite reverse; }
                
                @keyframes spin { 0% { transform: rotateX(60deg) rotateZ(0deg); } 100% { transform: rotateX(60deg) rotateZ(360deg); } }
                @keyframes shake { 0% { transform: translate(2px, 2px); } 25% { transform: translate(-2px, -2px); } 50% { transform: translate(2px, -2px); } 75% { transform: translate(-2px, 2px); } 100% { transform: translate(0, 0); } }
                @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
                @keyframes fillBar { from { width: 0%; } to { width: 100%; } }
            `}</style>
        </div>
    );
}

export default ProjectDemoPage;

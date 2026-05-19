import React, { useState, useRef, useEffect, useCallback } from 'react';
import { analyzeEmission, generateOptimization } from '../services/api';
import OptimizationScanner from '../components/OptimizationScanner';
import ComparisonTable from '../components/ComparisonTable';

function ResNetAnalysisPage({ onNavigateBack }) {
    // --- Merged State ---
    const [step, setStep] = useState('IDLE'); // IDLE (Upload), SCANNING_IMAGE, SHOW_BASELINE, ANALYZING, SHOW_SUGGESTIONS, OPTIMIZING, COMPLETED
    const [selectedImage, setSelectedImage] = useState(null);
    const [scanProgress, setScanProgress] = useState(0);
    const fileInputRef = useRef(null);
    const audioContextRef = useRef(null);
    const scanSoundIntervalRef = useRef(null);
    const canvasRef = useRef(null);
    const particleAnimationRef = useRef(null);

    // Metrics State
    const [baselineMetrics, setBaselineMetrics] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [optimizationPlan, setOptimizationPlan] = useState(null);
    const [optimizedMetrics, setOptimizedMetrics] = useState(null);

    // Neural Log State
    const [neuralLogs, setNeuralLogs] = useState([]);
    const [hexValues, setHexValues] = useState([]);
    const [matrixChars, setMatrixChars] = useState([]);

    // --- ADVANCED ROBOTIC SOUND ENGINE ---
    const playServoSound = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const t = ctx.currentTime;

        // Deep mechanical servo whir
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const masterGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        lfo.frequency.setValueAtTime(15, t);
        lfoGain.gain.setValueAtTime(100, t);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.3);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.6);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, t);
        filter.Q.setValueAtTime(5, t);

        masterGain.gain.setValueAtTime(0, t);
        masterGain.gain.linearRampToValueAtTime(0.08, t + 0.1);
        masterGain.gain.linearRampToValueAtTime(0.04, t + 0.4);
        masterGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);
        lfo.start(t);
        osc.start(t);
        lfo.stop(t + 0.6);
        osc.stop(t + 0.6);
    }, []);

    const playDataPulse = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const t = ctx.currentTime;

        // Rapid digital data click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(3000 + Math.random() * 2000, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.03);

        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.03);
    }, []);

    const playNeuralActivation = useCallback((layerIndex) => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const t = ctx.currentTime;

        // Ascending synthesizer tone for layer activation
        const baseFreq = 200 + layerIndex * 100;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(baseFreq, t);
        osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.2);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(baseFreq * 2, t);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(baseFreq * 1.5, t);
        filter.Q.setValueAtTime(2, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.3);
        osc2.stop(t + 0.3);
    }, []);

    const playCompletionSound = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const t = ctx.currentTime;

        // Triumphant ascending chord
        const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.1);
            gain.gain.setValueAtTime(0, t + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.08, t + i * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t + i * 0.1);
            osc.stop(t + 1);
        });
    }, []);

    // --- PARTICLE SYSTEM FOR DATA FLOW ---
    const initParticleSystem = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        const nodePositions = [
            { x: 0.2, y: 0.3 }, { x: 0.8, y: 0.3 },
            { x: 0.2, y: 0.7 }, { x: 0.8, y: 0.7 },
            { x: 0.5, y: 0.5 }
        ];

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                const start = nodePositions[Math.floor(Math.random() * 4)];
                this.x = start.x * canvas.width;
                this.y = start.y * canvas.height;
                this.targetX = 0.5 * canvas.width;
                this.targetY = 0.5 * canvas.height;
                this.speed = 2 + Math.random() * 3;
                this.size = 1 + Math.random() * 2;
                this.alpha = 1;
                this.hue = 180 + Math.random() * 40;
            }
            update() {
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 10) {
                    this.reset();
                    return;
                }
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
                this.alpha = Math.min(1, dist / 100);
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
                ctx.fill();

                // Trail
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                const trailX = this.x - (this.targetX - this.x) * 0.3;
                const trailY = this.y - (this.targetY - this.y) * 0.3;
                ctx.lineTo(trailX, trailY);
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 60%, ${this.alpha * 0.3})`;
                ctx.lineWidth = this.size * 0.5;
                ctx.stroke();
            }
        }

        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(5, 5, 8, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw neural nodes
            nodePositions.forEach((pos, i) => {
                const x = pos.x * canvas.width;
                const y = pos.y * canvas.height;
                const pulse = Math.sin(Date.now() * 0.003 + i) * 0.3 + 0.7;

                // Outer glow
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
                gradient.addColorStop(0, `rgba(0, 210, 255, ${0.8 * pulse})`);
                gradient.addColorStop(1, 'rgba(0, 210, 255, 0)');
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 242, 254, ${pulse})`;
                ctx.fill();
            });

            // Draw connections
            ctx.strokeStyle = 'rgba(0, 210, 255, 0.15)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(nodePositions[i].x * canvas.width, nodePositions[i].y * canvas.height);
                ctx.lineTo(nodePositions[4].x * canvas.width, nodePositions[4].y * canvas.height);
                ctx.stroke();
            }

            // Update and draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            particleAnimationRef.current = requestAnimationFrame(animate);
        };

        animate();
    }, []);

    // --- MATRIX RAIN EFFECT ---
    useEffect(() => {
        if (step === 'SCANNING_IMAGE') {
            const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            const interval = setInterval(() => {
                const newChars = [];
                for (let i = 0; i < 20; i++) {
                    newChars.push({
                        char: chars[Math.floor(Math.random() * chars.length)],
                        x: Math.random() * 100,
                        speed: 1 + Math.random() * 3,
                        opacity: 0.3 + Math.random() * 0.7
                    });
                }
                setMatrixChars(prev => [...prev.slice(-100), ...newChars]);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [step]);

    // --- HEX DATA STREAM ---
    useEffect(() => {
        if (step === 'SCANNING_IMAGE') {
            const interval = setInterval(() => {
                const hex = Array(8).fill(0).map(() =>
                    Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
                ).join(' ');
                setHexValues(prev => [...prev.slice(-15), hex]);
                playDataPulse();
            }, 150);
            return () => clearInterval(interval);
        }
    }, [step, playDataPulse]);

    // --- Initialize particle system on scan ---
    useEffect(() => {
        if (step === 'SCANNING_IMAGE' && canvasRef.current) {
            initParticleSystem();
        }
        return () => {
            if (particleAnimationRef.current) {
                cancelAnimationFrame(particleAnimationRef.current);
            }
        };
    }, [step, initParticleSystem]);

    // --- NEURAL LOG STREAMING ---
    useEffect(() => {
        if (step === 'SCANNING_IMAGE') {
            const logMessages = [
                { progress: 5, msg: '> INITIALIZING TENSOR CORE...', type: 'info' },
                { progress: 10, msg: '> LOADING ResNet-18 WEIGHTS [44.7MB]', type: 'info' },
                { progress: 15, msg: '> LAYER_01 [CONV2D_7x7_64] PROCESSING...', type: 'process' },
                { progress: 20, msg: '  └─ KERNEL EXTRACTION: 64 filters', type: 'detail' },
                { progress: 25, msg: '  └─ STRIDE: 2, PADDING: 3', type: 'detail' },
                { progress: 30, msg: '> LAYER_02 [BATCH_NORM] NORMALIZING...', type: 'process' },
                { progress: 35, msg: '  └─ MEAN: 0.485, STD: 0.229', type: 'detail' },
                { progress: 40, msg: '> LAYER_03 [RELU] ACTIVATION COMPLETE', type: 'success' },
                { progress: 45, msg: '> LAYER_04 [MAXPOOL_3x3] DOWNSAMPLING...', type: 'process' },
                { progress: 50, msg: '> RESIDUAL_BLOCK_1 [64→64→256]', type: 'info' },
                { progress: 55, msg: '  └─ SKIP CONNECTION: IDENTITY', type: 'detail' },
                { progress: 60, msg: '> RESIDUAL_BLOCK_2 [256→128→512]', type: 'info' },
                { progress: 65, msg: '> RESIDUAL_BLOCK_3 [512→256→1024]', type: 'info' },
                { progress: 70, msg: '> RESIDUAL_BLOCK_4 [1024→512→2048]', type: 'info' },
                { progress: 75, msg: '> AVGPOOL_GLOBAL COMPUTING...', type: 'process' },
                { progress: 80, msg: '> FC_LAYER [2048→1000] INFERENCE', type: 'process' },
                { progress: 85, msg: '> CARBON_FOOTPRINT CALCULATING...', type: 'warning' },
                { progress: 90, msg: '> ENERGY_CONSUMPTION: MEASURED', type: 'success' },
                { progress: 95, msg: '> EMISSION_BASELINE: COMPUTED', type: 'success' },
                { progress: 100, msg: '> SCAN COMPLETE ✓', type: 'complete' }
            ];

            const addedLogs = new Set();
            const interval = setInterval(() => {
                logMessages.forEach((log, index) => {
                    if (scanProgress >= log.progress && !addedLogs.has(log.progress)) {
                        addedLogs.add(log.progress);
                        setNeuralLogs(prev => [...prev, log]);
                        if (log.type === 'process') {
                            playNeuralActivation(index % 5);
                        }
                    }
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [step, scanProgress, playNeuralActivation]);

    // --- EXISTING SOUND EFFECTS ---
    const playScanSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2000, t);
        osc.frequency.exponentialRampToValueAtTime(4000, t + 0.05);
        osc.frequency.exponentialRampToValueAtTime(1000, t + 0.1);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3000, t);
        filter.frequency.linearRampToValueAtTime(1000, t + 0.1);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.1);

        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.02, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(t);
    };

    const playLayerFlipSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const t = ctx.currentTime;

        const carrier = ctx.createOscillator();
        const modulator = ctx.createOscillator();
        const modGain = ctx.createGain();
        const masterGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        modulator.frequency.setValueAtTime(100, t);
        modulator.frequency.linearRampToValueAtTime(500, t + 0.5);
        modGain.gain.setValueAtTime(200, t);

        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(400, t);
        carrier.frequency.linearRampToValueAtTime(800, t + 0.5);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(100, t);
        filter.frequency.exponentialRampToValueAtTime(5000, t + 0.3);

        masterGain.gain.setValueAtTime(0, t);
        masterGain.gain.linearRampToValueAtTime(0.1, t + 0.1);
        masterGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        carrier.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        modulator.start(t);
        carrier.start(t);
        modulator.stop(t + 0.5);
        carrier.stop(t + 0.5);
    };

    const startScanSounds = () => {
        playScanSound();
        playServoSound();
        let soundCounter = 0;
        scanSoundIntervalRef.current = setInterval(() => {
            soundCounter++;
            if (soundCounter % 3 === 0) {
                playLayerFlipSound();
            } else {
                playScanSound();
            }
        }, 200);
    };

    const stopScanSounds = () => {
        if (scanSoundIntervalRef.current) {
            clearInterval(scanSoundIntervalRef.current);
            scanSoundIntervalRef.current = null;
        }
        playCompletionSound();
    };

    // --- Image Handling ---
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSelectedImage({
                    src: ev.target.result,
                    size: file.size,
                    name: file.name
                });
                setStep('READY_TO_SCAN');
            };
            reader.readAsDataURL(file);
        }
    };

    const startImageScan = () => {
        setStep('SCANNING_IMAGE');
        setScanProgress(0);
        setNeuralLogs([]);
        setHexValues([]);
        setMatrixChars([]);

        const utterance = new SpeechSynthesisUtterance("Initiating ResNet-18 Neural Deep Scan. Analyzing neural pathways and measuring baseline carbon emissions.");
        utterance.rate = 0.9;
        utterance.pitch = 0.7;
        window.speechSynthesis.speak(utterance);

        startScanSounds();

        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            setScanProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                stopScanSounds();
                calculateBaselineEmission();
            }
        }, 80);
    };

    const calculateBaselineEmission = () => {
        const pixels = selectedImage ? selectedImage.size : 500000;
        const complexityFactor = 18;
        const energyPerBit = 0.00000015;
        const totalEnergyJ = (pixels * 8) * complexityFactor * energyPerBit;
        const carbonIntensity = 475;
        const energyKWh = totalEnergyJ / 3600000;
        const carbonG = energyKWh * carbonIntensity;
        const carbonKg = carbonG / 1000;

        const metrics = {
            model: "ResNet-18",
            runtime_minutes: 30,
            co2_kg: parseFloat(carbonKg.toFixed(6)) || 0.4500,
            power_usage_w: 250,
            energy_kwh: parseFloat(energyKWh.toFixed(6)) || 0.1500,
            epochs: 10,
            batch_size: 64,
            gpu_load: 95
        };

        setBaselineMetrics(metrics);
        setStep('SHOW_BASELINE');
    };

    // --- Optimization Workflow ---
    const startAnalysis = async () => {
        setStep('ANALYZING');
        setScanProgress(0);

        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setScanProgress(progress);
            if (progress >= 100) clearInterval(interval);
        }, 100);

        try {
            const analysis = await analyzeEmission(baselineMetrics);
            const plan = await generateOptimization(baselineMetrics);

            setTimeout(() => {
                setAnalysisResult(analysis.data);
                setOptimizationPlan(plan.data);
                setStep('SHOW_SUGGESTIONS');
            }, 2500);
        } catch (error) {
            console.error("Analysis Failed", error);
            setTimeout(() => {
                setAnalysisResult({
                    factors: ["High GPU Load Detected", "Batch Size > 32"]
                });
                setOptimizationPlan({
                    suggestions: ["Reduce Batch Size to 32", "Enable Mixed Precision"],
                    estimated_reduction_percentage: 45,
                    optimized_config: { epochs: 5, batch_size: 32 }
                });
                setStep('SHOW_SUGGESTIONS');
            }, 2500);
        }
    };

    const applyOptimization = () => {
        setStep('OPTIMIZING');
        setScanProgress(0);

        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            setScanProgress(progress);
            if (progress >= 100) clearInterval(interval);
        }, 50);

        setTimeout(() => {
            setOptimizedMetrics({
                ...baselineMetrics,
                runtime_minutes: 15,
                co2_kg: (baselineMetrics.co2_kg * 0.55).toFixed(4),
                energy_kwh: (baselineMetrics.energy_kwh * 0.55).toFixed(4),
                epochs: optimizationPlan?.optimized_config?.epochs || 5,
                batch_size: optimizationPlan?.optimized_config?.batch_size || 32
            });
            setStep('COMPLETED');
        }, 4000);
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '40px', position: 'relative', overflowX: 'hidden' }}>
            <div className="scanline"></div>

            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <button
                    onClick={onNavigateBack}
                    className="robotic-btn"
                    style={{
                        padding: '10px 20px',
                        background: 'rgba(0, 210, 255, 0.1)',
                        border: '1px solid var(--robotic-blue)',
                        color: '#fff',
                        cursor: 'pointer'
                    }}
                >
                    [ BACK_TO_HQ ]
                </button>
                <div style={{ color: 'var(--robotic-blue)', letterSpacing: '2px', fontWeight: 'bold' }}>
                    MODULE: ResNet-18_CNN_DIAGNOSTICS
                </div>
            </header>

            {/* --- STEP 1: IMAGE UPLOAD & ADVANCED SCANNING --- */}
            {step === 'IDLE' || step === 'READY_TO_SCAN' || step === 'SCANNING_IMAGE' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px' }}>

                    {/* Left: Advanced Input with Particle System */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff', fontFamily: 'var(--terminal-font)' }}>
                            [ 01 ] IMAGE_INPUT_BUFFER
                            {step === 'SCANNING_IMAGE' && (
                                <span style={{ color: 'var(--accent-green)', marginLeft: '10px', animation: 'pulse 1s infinite' }}>
                                    ● ACTIVE
                                </span>
                            )}
                        </h3>
                        <div className="glass-card" style={{
                            height: '450px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: step === 'SCANNING_IMAGE' ? '2px solid var(--robotic-blue)' : '2px dashed rgba(0, 210, 255, 0.3)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: step === 'SCANNING_IMAGE' ? '0 0 50px rgba(0, 210, 255, 0.3), inset 0 0 30px rgba(0, 210, 255, 0.1)' : 'none'
                        }}>

                            {/* Hexagonal Grid Overlay */}
                            {step === 'SCANNING_IMAGE' && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2300d2ff' fill-opacity='0.15'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                    animation: 'hexPulse 2s ease-in-out infinite',
                                    pointerEvents: 'none',
                                    zIndex: 1
                                }}></div>
                            )}

                            {/* Particle Canvas */}
                            {step === 'SCANNING_IMAGE' && (
                                <canvas
                                    ref={canvasRef}
                                    width={450}
                                    height={450}
                                    style={{
                                        position: 'absolute',
                                        top: 0, left: 0,
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 2
                                    }}
                                />
                            )}

                            {!selectedImage ? (
                                <>
                                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="robotic-btn"
                                        style={{
                                            padding: '20px 40px',
                                            background: 'var(--accent-blue)',
                                            border: 'none',
                                            color: '#000',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            zIndex: 10
                                        }}
                                    >
                                        + UPLOAD_SOURCE_IMG
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 3 }}>
                                        {/* Original Image */}
                                        <img
                                            src={selectedImage.src}
                                            alt="Target"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                opacity: step === 'SCANNING_IMAGE' ? 0.4 : 1,
                                                filter: step === 'SCANNING_IMAGE' ? 'grayscale(30%) brightness(0.8)' : 'none',
                                                transition: 'all 0.5s ease'
                                            }}
                                        />

                                        {/* Advanced Scanning Effects */}
                                        {step === 'SCANNING_IMAGE' && (
                                            <>
                                                {/* Holographic Targeting Crosshair */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '50%', left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: '200px', height: '200px',
                                                    border: '2px solid var(--robotic-blue)',
                                                    borderRadius: '50%',
                                                    animation: 'targetPulse 1.5s ease-in-out infinite',
                                                    boxShadow: '0 0 30px var(--robotic-blue), inset 0 0 30px rgba(0, 210, 255, 0.2)'
                                                }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '50%', left: '-20px', right: '-20px',
                                                        height: '2px',
                                                        background: 'var(--robotic-blue)'
                                                    }}></div>
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '50%', top: '-20px', bottom: '-20px',
                                                        width: '2px',
                                                        background: 'var(--robotic-blue)'
                                                    }}></div>
                                                </div>

                                                {/* Rotating Scanner Ring */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '50%', left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: '280px', height: '280px',
                                                    border: '3px dashed rgba(0, 242, 254, 0.5)',
                                                    borderRadius: '50%',
                                                    animation: 'spin 4s linear infinite'
                                                }}></div>

                                                {/* Wave Scanner */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '50%', left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: '100px', height: '100px',
                                                    border: '2px solid var(--accent-green)',
                                                    borderRadius: '50%',
                                                    animation: 'waveExpand 2s ease-out infinite',
                                                    opacity: 0.6
                                                }}></div>

                                                {/* Corner Brackets */}
                                                {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner, i) => (
                                                    <div key={corner} style={{
                                                        position: 'absolute',
                                                        [corner.includes('top') ? 'top' : 'bottom']: '20px',
                                                        [corner.includes('left') ? 'left' : 'right']: '20px',
                                                        width: '40px', height: '40px',
                                                        borderColor: 'var(--robotic-blue)',
                                                        borderStyle: 'solid',
                                                        borderWidth: corner.includes('top') ? '3px 0 0 3px' : corner.includes('bottom') && corner.includes('left') ? '0 0 3px 3px' : corner.includes('bottom') && corner.includes('right') ? '0 3px 3px 0' : '3px 3px 0 0',
                                                        animation: `cornerPulse 1s ease-in-out infinite ${i * 0.25}s`
                                                    }}></div>
                                                ))}

                                                {/* Vertical Scanline */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0, left: 0,
                                                    width: '100%', height: '4px',
                                                    background: 'linear-gradient(90deg, transparent, var(--accent-green), transparent)',
                                                    boxShadow: '0 0 20px var(--accent-green)',
                                                    animation: 'scanVertical 2s linear infinite'
                                                }}></div>

                                                {/* Status Overlay */}
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '15px', left: '15px', right: '15px',
                                                    background: 'rgba(0,0,0,0.9)',
                                                    padding: '12px 20px',
                                                    borderRadius: '4px',
                                                    color: 'var(--accent-green)',
                                                    fontSize: '0.85rem',
                                                    fontFamily: 'var(--terminal-font)',
                                                    border: '1px solid var(--accent-green)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <span>NEURAL_DECOMPOSITION: {scanProgress}%</span>
                                                    <span style={{ color: 'var(--accent-magenta)' }}>
                                                        {scanProgress < 25 ? 'CONV_LAYERS' : scanProgress < 50 ? 'RESIDUAL_BLOCKS' : scanProgress < 75 ? 'FEATURE_MAPS' : 'EMISSION_CALC'}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {step === 'READY_TO_SCAN' && (
                                        <div style={{ position: 'absolute', bottom: '20px', zIndex: 10 }}>
                                            <button onClick={startImageScan} className="robotic-btn" style={{
                                                padding: '15px 30px',
                                                background: 'rgba(0,0,0,0.9)',
                                                border: '2px solid var(--accent-green)',
                                                color: 'var(--accent-green)',
                                                fontWeight: 900,
                                                cursor: 'pointer',
                                                boxShadow: '0 0 20px rgba(0, 255, 127, 0.3)'
                                            }}>
                                                ▶ INITIALIZE_DEEP_SCAN
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Advanced Neural Log */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff', fontFamily: 'var(--terminal-font)' }}>
                            [ 02 ] NEURAL_PROCESS_LOG
                            {step === 'SCANNING_IMAGE' && (
                                <span style={{ color: 'var(--accent-orange)', marginLeft: '10px' }}>
                                    ◉ STREAMING
                                </span>
                            )}
                        </h3>
                        <div className="glass-card" style={{
                            height: '450px',
                            padding: '0',
                            fontFamily: 'var(--terminal-font)',
                            overflow: 'hidden',
                            position: 'relative',
                            background: 'rgba(0, 5, 10, 0.95)',
                            border: step === 'SCANNING_IMAGE' ? '1px solid var(--robotic-blue)' : '1px solid rgba(0, 210, 255, 0.15)'
                        }}>

                            {/* Matrix Rain Background */}
                            {step === 'SCANNING_IMAGE' && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    overflow: 'hidden',
                                    opacity: 0.15,
                                    pointerEvents: 'none'
                                }}>
                                    {matrixChars.map((char, i) => (
                                        <span key={i} style={{
                                            position: 'absolute',
                                            left: `${char.x}%`,
                                            top: '-20px',
                                            color: '#00ff00',
                                            fontSize: '14px',
                                            animation: `matrixFall ${2 + char.speed}s linear forwards`,
                                            opacity: char.opacity
                                        }}>{char.char}</span>
                                    ))}
                                </div>
                            )}

                            {/* Header Bar */}
                            <div style={{
                                background: 'linear-gradient(90deg, rgba(0, 210, 255, 0.2), transparent)',
                                padding: '10px 15px',
                                borderBottom: '1px solid rgba(0, 210, 255, 0.3)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ color: 'var(--robotic-blue)', fontSize: '0.8rem' }}>TELEMETRY_STREAM</span>
                                <span style={{ color: 'var(--accent-green)', fontSize: '0.75rem' }}>
                                    {step === 'SCANNING_IMAGE' ? `PID: ${Math.floor(Math.random() * 9000) + 1000}` : 'STANDBY'}
                                </span>
                            </div>

                            {/* Log Content */}
                            <div style={{
                                height: 'calc(100% - 120px)',
                                overflowY: 'auto',
                                padding: '15px',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {step === 'SCANNING_IMAGE' ? (
                                    <>
                                        {/* Neural Logs */}
                                        {neuralLogs.map((log, i) => (
                                            <div key={i} style={{
                                                marginBottom: '6px',
                                                fontSize: '0.8rem',
                                                color: log.type === 'success' ? 'var(--accent-green)' :
                                                    log.type === 'warning' ? 'var(--accent-orange)' :
                                                        log.type === 'complete' ? '#00ff00' :
                                                            log.type === 'detail' ? 'var(--text-secondary)' :
                                                                log.type === 'process' ? 'var(--robotic-blue)' : '#fff',
                                                animation: 'typeIn 0.3s ease-out',
                                                textShadow: log.type === 'complete' ? '0 0 10px #00ff00' : 'none'
                                            }}>
                                                {log.msg}
                                            </div>
                                        ))}

                                        {/* Blinking Cursor */}
                                        <span style={{
                                            display: 'inline-block',
                                            width: '8px',
                                            height: '14px',
                                            background: 'var(--robotic-blue)',
                                            animation: 'blink 0.5s infinite step-end'
                                        }}></span>
                                    </>
                                ) : (
                                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '50%' }}>
                                        AWAITING_INPUT...
                                    </div>
                                )}
                            </div>

                            {/* Hex Data Stream */}
                            {step === 'SCANNING_IMAGE' && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0, left: 0, right: 0,
                                    background: 'rgba(0, 0, 0, 0.9)',
                                    borderTop: '1px solid rgba(0, 210, 255, 0.3)',
                                    padding: '10px 15px',
                                    maxHeight: '80px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                                        RAW_DATA_STREAM:
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--terminal-font)' }}>
                                        {hexValues.slice(-3).map((hex, i) => (
                                            <div key={i} style={{ opacity: 0.5 + (i * 0.25) }}>{hex}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Progress Bar at Bottom */}
                            {step === 'SCANNING_IMAGE' && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '80px', left: '15px', right: '15px',
                                    height: '4px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '2px'
                                }}>
                                    <div style={{
                                        width: `${scanProgress}%`,
                                        height: '100%',
                                        background: 'var(--primary-gradient)',
                                        borderRadius: '2px',
                                        boxShadow: '0 0 10px var(--robotic-blue)',
                                        transition: 'width 0.1s'
                                    }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* --- STEP 2: BASELINE RESULTS & OPTIMIZATION ENTRY --- */}
            {(step === 'SHOW_BASELINE' || step === 'SHOW_SUGGESTIONS' || step === 'COMPLETED') && baselineMetrics && (
                <div className="glass-card fade-in" style={{ padding: '30px', marginBottom: '40px', borderLeft: '4px solid var(--accent-magenta)' }}>
                    <h3 style={{ color: '#fff', marginBottom: '20px' }}>📊 BASELINE EMISSION DETECTED</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>CO₂ Magnitude</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-magenta)' }}>{baselineMetrics.co2_kg} kg</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Energy Used</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{baselineMetrics.energy_kwh} kWh</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Batch Size</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{baselineMetrics.batch_size}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Epochs</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{baselineMetrics.epochs}</div>
                        </div>
                    </div>

                    {step === 'SHOW_BASELINE' && (
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                High emissions detected based on current model parameters.
                            </p>
                            <button
                                onClick={startAnalysis}
                                className="robotic-btn"
                                style={{
                                    padding: '15px 40px',
                                    fontSize: '1.2rem',
                                    border: '2px solid var(--robotic-blue)',
                                    background: 'transparent',
                                    color: 'var(--robotic-blue)',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 15px rgba(0,210,255,0.2)'
                                }}
                            >
                                [ ANALYZE & IDENTIFY ISSUES ]
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* --- STEP 3: SCANNER OVERLAY --- */}
            {(step === 'ANALYZING' || step === 'OPTIMIZING') && (
                <OptimizationScanner currentStep={step} progress={scanProgress} />
            )}

            {/* --- STEP 4: ANALYSIS & SUGGESTIONS --- */}
            {(step === 'SHOW_SUGGESTIONS' || step === 'COMPLETED') && analysisResult && optimizationPlan && (
                <div className="fade-in">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                        <div className="glass-card" style={{ padding: '30px', borderTop: '4px solid var(--warning-yellow)' }}>
                            <h3 style={{ color: 'var(--accent-orange)' }}>🧠 IMPACT ANALYSIS</h3>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                                {analysisResult.factors.map((factor, i) => (
                                    <li key={i} style={{ marginBottom: '15px', color: '#ffd700' }}>⚠ {factor}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="glass-card" style={{ padding: '30px', borderTop: '4px solid var(--success-green)' }}>
                            <h3 style={{ color: 'var(--success-green)' }}>💡 SUGGESTED OPTIMIZATIONS</h3>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                                {optimizationPlan.suggestions.map((suggestion, i) => (
                                    <li key={i} style={{ marginBottom: '15px', color: '#fff' }}>✓ {suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {step === 'SHOW_SUGGESTIONS' && (
                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={applyOptimization}
                                className="robotic-btn"
                                style={{
                                    padding: '20px 50px',
                                    fontSize: '1.3rem',
                                    background: 'var(--primary-gradient)',
                                    border: 'none',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 30px rgba(0,242,254,0.4)',
                                    animation: 'pulse 2s infinite'
                                }}
                            >
                                APPLY OPTIMIZATIONS & RE-RUN
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* --- STEP 5: FINAL COMPARISON --- */}
            {step === 'COMPLETED' && optimizedMetrics && (
                <div className="fade-in">
                    <div className="glass-card" style={{ padding: '20px', marginBottom: '40px', background: 'rgba(0, 255, 127, 0.05)', border: '1px solid var(--success-green)' }}>
                        <h2 style={{ color: '#fff' }}>✅ OPTIMIZATION SUCCESSFUL</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Model re-calibrated with sustainable parameters.</p>
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
                @keyframes scanVertical {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
                @keyframes hexPulse {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.25; }
                }
                @keyframes targetPulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
                    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                }
                @keyframes waveExpand {
                    0% { width: 50px; height: 50px; opacity: 0.8; }
                    100% { width: 400px; height: 400px; opacity: 0; }
                }
                @keyframes cornerPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; box-shadow: 0 0 10px var(--robotic-blue); }
                }
                @keyframes spin {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes typeIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes matrixFall {
                    0% { top: -20px; opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes blink {
                    50% { opacity: 0; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
}

export default ResNetAnalysisPage;

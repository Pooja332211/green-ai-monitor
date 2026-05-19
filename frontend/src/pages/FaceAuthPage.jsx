import React, { useState, useEffect, useRef } from 'react';

function FaceAuthPage({ onAuthSuccess }) {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState('Standby');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [hasCamera, setHasCamera] = useState(false);
    const [error, setError] = useState(null);

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Initialize Camera
    useEffect(() => {
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                    setHasCamera(true);
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                setError("Camera Access Denied. Biometric Scan Unavailable.");
            }
        }
        startCamera();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleAction = () => {
        if (mode === 'register' && !userName.trim()) {
            setStatus('Error: Name Mandatory');
            const alertUtterance = new SpeechSynthesisUtterance("Biometric entry failed. Please provide a registration name.");
            window.speechSynthesis.speak(alertUtterance);
            return;
        }

        setIsScanning(true);
        setScanProgress(0);
        setStatus(mode === 'register' ? 'Analyzing Facial Landmarks...' : 'Verifying Identity...');

        // Robotic Voice
        const utterance = new SpeechSynthesisUtterance(
            mode === 'register' ? `Initiating biometric registration for ${userName}.` : "Initiating identity verification."
        );
        window.speechSynthesis.speak(utterance);

        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            setScanProgress(progress);

            if (progress === 40) setStatus(mode === 'register' ? 'Capturing Neural Hash...' : 'Matching Biometric Data...');
            if (progress === 80) setStatus('Finalizing Encryption...');

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    if (mode === 'register') {
                        // Persistent Registration
                        localStorage.setItem('face_registered', 'true');
                        localStorage.setItem('registered_name', userName);

                        const succUtterance = new SpeechSynthesisUtterance(`Registration complete. Identity secured. Welcome to the system, ${userName}.`);
                        window.speechSynthesis.speak(succUtterance);

                        setIsScanning(false);
                        setMode('login');
                        setStatus('Registration Successful. Please Login.');
                    } else {
                        // Check Persistent Registration
                        const isRegistered = localStorage.getItem('face_registered') === 'true';
                        const storedName = localStorage.getItem('registered_name') || 'User';

                        if (isRegistered) {
                            const succUtterance = new SpeechSynthesisUtterance(`Access authorized. Welcome back, ${storedName}.`);
                            window.speechSynthesis.speak(succUtterance);
                            onAuthSuccess();
                        } else {
                            setIsScanning(false);
                            setStatus('Access Denied: Identity Not Found');
                            const failUtterance = new SpeechSynthesisUtterance("Security breach attempt detected. Identity not found in database. Please register first.");
                            window.speechSynthesis.speak(failUtterance);
                            // Switch to registration mode automatically after a short delay
                            setTimeout(() => {
                                setMode('register');
                                setStatus('Standby: Registration Required');
                            }, 2000);
                        }
                    }
                }, 500);
            }
        }, 60);
    };

    return (
        <div className="fade-in" style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Grid */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(0, 210, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                zIndex: 0
            }}></div>

            <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '600px', width: '100%' }}>
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--robotic-blue)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>
                        [ Biometric Security Gateway ]
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '5px' }}>
                        FACE <span style={{ color: 'var(--robotic-blue)' }}>{mode === 'register' ? 'REGISTRATION' : 'RECOGNITION'}</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {mode === 'register' ? 'Register your name and face for secure access.' : 'Scan your face to access the Green AI Monitor command core.'}
                    </p>
                </div>

                {/* Name Registration Input */}
                {mode === 'register' && (
                    <div className="fade-in" style={{ marginBottom: '30px' }}>
                        <input
                            type="text"
                            placeholder="[ ENTER FULL NAME ]"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            disabled={isScanning}
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                padding: '15px 25px',
                                background: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid var(--robotic-blue)',
                                borderRadius: '4px',
                                color: '#fff',
                                fontFamily: 'monospace',
                                letterSpacing: '3px',
                                textAlign: 'center',
                                outline: 'none',
                                boxShadow: 'inset 0 0 10px rgba(0, 210, 255, 0.1)',
                                transition: 'all 0.3s'
                            }}
                        />
                    </div>
                )}

                {/* Webcam Container */}
                <div style={{
                    position: 'relative',
                    width: '400px',
                    height: '400px',
                    margin: '0 auto 40px',
                    background: '#000',
                    border: '1px solid var(--robotic-blue)',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 0 50px rgba(0, 210, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {error ? (
                        <div style={{ color: '#ff4757', padding: '20px', fontWeight: 700 }}>{error}</div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: isScanning ? 'grayscale(100%) brightness(1.2) contrast(1.2)' : 'none',
                                opacity: hasCamera ? 1 : 0
                            }}
                        />
                    )}

                    {/* Scanning HUD Overlay */}
                    {hasCamera && !error && (
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                            {/* Spinning circular border */}
                            <div style={{
                                position: 'absolute',
                                inset: '10px',
                                border: '2px dashed rgba(0, 210, 255, 0.3)',
                                borderRadius: '50%',
                                animation: 'spin 10s linear infinite'
                            }}></div>

                            {/* Laser Scan Line */}
                            {isScanning && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-10%',
                                    left: 0,
                                    width: '100%',
                                    height: '4px',
                                    background: 'var(--robotic-blue)',
                                    boxShadow: '0 0 20px var(--robotic-blue)',
                                    animation: 'scan-vertical 2s linear infinite'
                                }}></div>
                            )}

                            {/* Digital Reticle */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '250px',
                                height: '250px',
                                border: '1px solid rgba(0, 210, 255, 0.5)',
                                borderRadius: '40px'
                            }}>
                                <div style={{ position: 'absolute', top: -5, left: -5, width: 20, height: 20, borderTop: '4px solid var(--robotic-blue)', borderLeft: '4px solid var(--robotic-blue)' }}></div>
                                <div style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderTop: '4px solid var(--robotic-blue)', borderRight: '4px solid var(--robotic-blue)' }}></div>
                                <div style={{ position: 'absolute', bottom: -5, left: -5, width: 20, height: 20, borderBottom: '4px solid var(--robotic-blue)', borderLeft: '4px solid var(--robotic-blue)' }}></div>
                                <div style={{ position: 'absolute', bottom: -5, right: -5, width: 20, height: 20, borderBottom: '4px solid var(--robotic-blue)', borderRight: '4px solid var(--robotic-blue)' }}></div>
                            </div>

                            {/* Status Text Overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: '15%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.7)',
                                padding: '5px 15px',
                                borderRadius: '20px',
                                fontSize: '0.7rem',
                                color: 'var(--robotic-blue)',
                                fontFamily: 'monospace',
                                border: '1px solid currentColor'
                            }}>
                                {isScanning ? `${status} [${scanProgress}%]` : 'READY FOR SCAN'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button
                        onClick={handleAction}
                        disabled={isScanning || !hasCamera || error}
                        className="robotic-btn"
                        style={{
                            padding: '15px 40px',
                            fontSize: '1rem',
                            fontWeight: 800,
                            background: 'var(--robotic-blue)',
                            color: '#000',
                            border: 'none',
                            boxShadow: isScanning ? 'none' : '0 0 20px rgba(0, 210, 255, 0.4)'
                        }}
                    >
                        {isScanning ? 'ANALYZING...' : (mode === 'register' ? '[ CAPTURE BIOMETRICS ]' : '[ START FACE SCAN ]')}
                    </button>

                    <button
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        disabled={isScanning}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '0.9rem'
                        }}
                    >
                        {mode === 'login' ? "New System User? Register Face" : "Already Registered? Switch to Login"}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes scan-vertical {
          0% { top: 0% }
          100% { top: 100% }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

export default FaceAuthPage;

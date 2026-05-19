import React from 'react';

function ProjectInsightPage({ onNavigateBack }) {
    const sections = [
        {
            title: "1. The AI Distinction: Copilot vs Gemini",
            content: (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #667eea' }}>
                        <h4 style={{ color: '#667eea', marginBottom: '10px' }}>🔹 GitHub Copilot</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <strong>Development-Time AI:</strong> Helps write optimized algorithms and efficient logic.
                            Reduces extra CPU cycles indirectly during the coding phase.
                        </p>
                    </div>
                    <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #00d2ff' }}>
                        <h4 style={{ color: '#00d2ff', marginBottom: '10px' }}>🔹 Gemini AI</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <strong>Runtime AI Model:</strong> Integrated directly into the project for real-time data processing,
                            prediction, and optimization. Directly reduces CO₂ by intelligent system control.
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: "2. Official Project Title (MCA Standard)",
            content: (
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center', background: 'rgba(0, 210, 255, 0.05)' }}>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '1px' }}>
                        “Real-Time AI-Based CO₂ Emission Monitoring and Reduction System using Gemini AI”
                    </h2>
                </div>
            )
        },
        {
            title: "3. High-Level Architecture (Real-Time Flow)",
            content: (
                <div className="glass-card" style={{ padding: '30px', fontFamily: 'monospace' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', color: 'var(--robotic-blue)' }}>
                        <div style={{ border: '1px solid currentColor', padding: '10px 20px' }}>[Sensors / Live Data]</div>
                        <div>↓</div>
                        <div style={{ border: '1px solid currentColor', padding: '10px 20px' }}>[Data Ingestion API]</div>
                        <div>↓</div>
                        <div style={{ border: '1px solid currentColor', padding: '10px 20px' }}>[Real-Time Stream Processor]</div>
                        <div>↓</div>
                        <div style={{ border: '1px solid currentColor', padding: '10px 20px', background: 'rgba(0, 210, 255, 0.1)' }}>[Gemini AI Model]</div>
                        <div>↓</div>
                        <div style={{ border: '1px solid currentColor', padding: '10px 20px' }}>[Optimization Engine]</div>
                        <div>↓</div>
                        <div style={{ border: '1px solid currentColor', padding: '10px 20px' }}>[Control System / Dashboard]</div>
                    </div>
                </div>
            )
        },
        {
            title: "4. Step-by-Step Real-Time Process",
            content: (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {[
                        { step: "STEP 1: Collection", desc: "Live monitoring of power, CPU, and hardware telemetry via direct system hooks." },
                        { step: "STEP 2: Ingestion", desc: "Continuous data streaming through low-latency APIs (FastAPI) without batch delays." },
                        { step: "STEP 3: AI Analysis", desc: "Gemini AI detects patterns, predicts emission spikes, and suggests runtime fixes." },
                        { step: "STEP 4: Optimization", desc: "Automated logic for load balancing, predictive shutdown, and smart scheduling." }
                    ].map((s, i) => (
                        <div key={i} className="glass-card" style={{ padding: '20px' }}>
                            <h5 style={{ color: 'var(--accent-green)', marginBottom: '8px' }}>{s.step}</h5>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: "5. Technologies & formulas",
            content: (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>⚡ TECH STACK</h4>
                        <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left' }}>
                            <tbody>
                                <tr><td style={{ padding: '8px', color: 'var(--text-muted)' }}>Frontend</td><td style={{ color: '#fff' }}>React</td></tr>
                                <tr><td style={{ padding: '8px', color: 'var(--text-muted)' }}>Backend</td><td style={{ color: '#fff' }}>Python / FastAPI</td></tr>
                                <tr><td style={{ padding: '8px', color: 'var(--text-muted)' }}>AI Model</td><td style={{ color: '#fff' }}>Gemini API</td></tr>
                                <tr><td style={{ padding: '8px', color: 'var(--text-muted)' }}>Real-Time</td><td style={{ color: '#fff' }}>WebSockets/Polling</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="glass-card" style={{ padding: '20px', background: 'rgba(81, 207, 102, 0.05)' }}>
                        <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>📈 REDUCTION LOGIC</h4>
                        <div style={{ padding: '15px', border: '1px dashed var(--accent-green)', borderRadius: '4px', textAlign: 'center' }}>
                            <code style={{ fontSize: '0.9rem', color: 'var(--accent-green)' }}>
                                Reduction % = ((E_old - E_new) / E_old) × 100
                            </code>
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '10px', color: 'var(--text-muted)' }}>
                            Gemini continuously improves this by learning patterns and adapting thresholds dynamically.
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: "Summary",
            content: (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <blockquote style={{ fontSize: '1.2rem', color: 'var(--robotic-blue)', fontWeight: 700, fontStyle: 'italic' }}>
                        “This project integrates Gemini AI for real-time emission analysis and optimization, while GitHub Copilot enhances development efficiency, together contributing to intelligent and sustainable CO₂ reduction.”
                    </blockquote>
                </div>
            )
        }
    ];

    return (
        <div className="fade-in" style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            color: '#fff',
            padding: '40px 20px',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            {/* Back Button */}
            <button
                onClick={onNavigateBack}
                className="robotic-btn"
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    padding: '10px 20px',
                    fontSize: '0.8rem',
                    zIndex: 10
                }}
            >
                [ BACK_TO_SYSTEM ]
            </button>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{ display: 'inline-block', padding: '10px 30px', border: '1px solid var(--robotic-blue)', marginBottom: '20px' }}>
                        <span style={{ letterSpacing: '5px', fontSize: '0.8rem', fontWeight: 800 }}>PROJECT INSIGHT REPORT</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>
                        Real-Time AI <span style={{ color: 'var(--robotic-blue)' }}>Architecture</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Detailed breakdown of the Green AI Monitor's intelligent core.</p>
                </header>

                {sections.map((section, index) => (
                    <section key={index} style={{ marginBottom: '50px', animation: `fadeIn 0.8s ease-out ${index * 0.1}s forwards` }}>
                        <h3 style={{
                            fontSize: '1.4rem',
                            color: 'var(--robotic-blue)',
                            marginBottom: '25px',
                            borderBottom: '1px solid rgba(0, 210, 255, 0.2)',
                            paddingBottom: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            {section.title}
                        </h3>
                        {section.content}
                    </section>
                ))}

                <footer style={{ textAlign: 'center', marginTop: '80px', padding: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        &copy; 2026 Green AI Monitor | Academic Submission - MCA Project
                    </p>
                </footer>
            </div>

            {/* Background decoration */}
            <div style={{ position: 'fixed', top: '10%', right: '-5%', width: '30%', height: '80%', background: 'radial-gradient(circle, rgba(0, 210, 255, 0.03) 0%, transparent 70%)', zIndex: -1 }}></div>
            <div style={{ position: 'fixed', bottom: '10%', left: '-5%', width: '30%', height: '80%', background: 'radial-gradient(circle, rgba(102, 126, 238, 0.03) 0%, transparent 70%)', zIndex: -1 }}></div>
        </div>
    );
}

export default ProjectInsightPage;

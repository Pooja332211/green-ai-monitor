import React from 'react';

const ComparisonTable = ({ baseline, optimized }) => {
    const calculateChange = (base, opt) => {
        if (!base || !opt) return 0;
        return ((base - opt) / base * 100).toFixed(1);
    };

    return (
        <div className="glass-card" style={{ padding: '24px', animation: 'fadeIn 0.8s ease-out' }}>
            <h3 style={{
                color: '#fff',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '10px'
            }}>
                <span style={{ color: 'var(--success-green)' }}>▶</span> OPTIMIZATION IMPACT REPORT
            </h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)' }}>METRIC</th>
                            <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)' }}>BASELINE</th>
                            <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)' }}>OPTIMIZED</th>
                            <th style={{ textAlign: 'left', padding: '12px', color: 'var(--success-green)' }}>IMPROVEMENT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { label: 'CO₂ Emission', key: 'co2_kg', unit: 'kg' },
                            { label: 'Energy Usage', key: 'power_usage_w', unit: 'kWh' }, // Assuming passing kWh for this display
                            { label: 'Runtime', key: 'runtime_minutes', unit: 'min' }
                        ].map((metric) => {
                            const baseVal = baseline[metric.key] || 0;
                            const optVal = optimized[metric.key] || 0;
                            const reduction = calculateChange(baseVal, optVal);

                            return (
                                <tr key={metric.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '12px', fontWeight: '600' }}>{metric.label}</td>
                                    <td style={{ padding: '12px', opacity: 0.7 }}>{baseVal} {metric.unit}</td>
                                    <td style={{ padding: '12px', color: '#fff', fontWeight: 'bold' }}>{optVal} {metric.unit}</td>
                                    <td style={{ padding: '12px', color: 'var(--success-green)' }}>
                                        {reduction > 0 ? (
                                            <span style={{
                                                background: 'rgba(0, 255, 127, 0.1)',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid rgba(0, 255, 127, 0.3)'
                                            }}>
                                                ▼ {reduction}%
                                            </span>
                                        ) : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonTable;

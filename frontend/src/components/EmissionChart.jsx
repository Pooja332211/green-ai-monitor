import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getLogs } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function EmissionChart() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getLogs();
        console.log('📊 Logs received:', response.data);

        // Handle different response formats
        const logsData = Array.isArray(response.data)
          ? response.data
          : (response.data?.logs || response.data?.data || []);

        setLogs(logsData);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching logs:', error);
        setLogs([]);
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: Array.isArray(logs) ? logs.map(log => {
      try {
        return new Date(log.timestamp).toLocaleTimeString();
      } catch {
        return 'N/A';
      }
    }) : [],
    datasets: [
      {
        label: 'CO₂ Emissions (kg)',
        data: Array.isArray(logs) ? logs.map(log => log.emissions || log.co2_emissions || 0) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'var(--text-primary)',
          font: {
            size: 14,
            weight: 600
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `CO₂: ${context.parsed.y.toFixed(4)} kg`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: 'var(--text-secondary)',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: 'var(--text-secondary)',
          font: {
            size: 12
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="glass-card fade-in" style={{
      padding: 'var(--spacing-xl)',
      marginBottom: 'var(--spacing-2xl)',
      animationDelay: '200ms'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <div style={{
          width: '4px',
          height: '28px',
          background: 'var(--success-gradient)',
          borderRadius: '2px',
          marginRight: '16px'
        }}></div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          margin: 0,
          color: 'var(--text-primary)'
        }}>
          📊 Emission History
        </h2>
      </div>

      {loading ? (
        <div style={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)'
        }}>
          <div className="shimmer" style={{
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-md)'
          }}></div>
        </div>
      ) : !Array.isArray(logs) || logs.length === 0 ? (
        <div style={{
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          gap: '16px'
        }}>
          <span style={{ fontSize: '3rem' }}>📈</span>
          <p style={{ fontSize: '1.1rem', margin: 0 }}>No tracking data yet</p>
          <p style={{ fontSize: '0.9rem', margin: 0, opacity: 0.7 }}>Start a tracking session to see emission history</p>
        </div>
      ) : (
        <div style={{ height: '400px' }}>
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
}

export default EmissionChart;
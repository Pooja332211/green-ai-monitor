import React from 'react';
import '../styles/global.css';

const OptimizationScanner = ({ currentStep, progress }) => {
    return (
        <div className="scanner-overlay">
            <div className="scanner-container">
                <div className="scanner-grid"></div>
                <div className="scanner-line"></div>

                <div className="scanner-content">
                    <div className="scanner-icon">
                        <div className="scanner-ring"></div>
                        <div className="scanner-dot"></div>
                    </div>

                    <h2 className="scanner-title">
                        {currentStep === 'ANALYZING' ? 'SYSTEM DIAGNOSTIC IN PROGRESS' : 'OPTIMIZATION PROTOCOL ENGAGED'}
                    </h2>

                    <div className="scanner-status">
                        {currentStep === 'ANALYZING' ? (
                            <>
                                <div className="status-item">[SCANNING] GPU POWER DRAW...</div>
                                <div className="status-item" style={{ animationDelay: '0.5s' }}>[CHECKING] BATCH SIZE EFFICIENCY...</div>
                                <div className="status-item" style={{ animationDelay: '1.0s' }}>[ANALYZING] CARBON FOOTPRINT METRICS...</div>
                            </>
                        ) : (
                            <>
                                <div className="status-item">[APPLYING] QUANTIZATION (FP16)...</div>
                                <div className="status-item" style={{ animationDelay: '0.5s' }}>[ADJUSTING] HYPERPARAMETERS...</div>
                                <div className="status-item" style={{ animationDelay: '1.0s' }}>[COMPILING] OPTIMIZED GRAPH...</div>
                            </>
                        )}
                    </div>

                    <div className="scanner-progress-bar">
                        <div className="scanner-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .scanner-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(5, 5, 8, 0.95);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .scanner-container {
          position: relative;
          width: 80%;
          max-width: 600px;
          height: 400px;
          border: 1px solid var(--robotic-blue);
          border-radius: 4px;
          overflow: hidden;
          background: rgba(0, 20, 30, 0.3);
          box-shadow: 0 0 50px rgba(0, 210, 255, 0.1);
        }
        
        .scanner-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 210, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 210, 255, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 0;
        }
        
        .scanner-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--robotic-blue);
          box-shadow: 0 0 20px var(--robotic-blue);
          animation: scanDown 3s linear infinite;
          z-index: 1;
        }
        
        .scanner-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        .scanner-title {
          color: #fff;
          font-size: 1.2rem;
          margin: 20px 0;
          letter-spacing: 2px;
          text-shadow: 0 0 10px var(--robotic-blue);
        }
        
        .scanner-status {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 30px;
        }
        
        .status-item {
          color: var(--robotic-blue);
          font-size: 0.9rem;
          opacity: 0;
          animation: fadeInOut 2s infinite;
        }
        
        .scanner-progress-bar {
          width: 60%;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .scanner-progress-fill {
          height: 100%;
          background: var(--primary-gradient);
          transition: width 0.3s ease;
          box-shadow: 0 0 10px var(--robotic-blue);
        }

        @keyframes scanDown {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default OptimizationScanner;

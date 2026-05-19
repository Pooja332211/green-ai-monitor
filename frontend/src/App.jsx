import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import MonitoringPage from './pages/MonitoringPage';
import ModelAnalysisPage from './pages/ModelAnalysisPage';
import ResNetAnalysisPage from './pages/ResNetAnalysisPage';
import DistilBERTAnalysisPage from './pages/DistilBERTAnalysisPage';
import ProjectDemoPage from './pages/ProjectDemoPage';
import RealTimeAiDemoPage from './pages/RealTimeAiDemoPage';
import FaceAuthPage from './pages/FaceAuthPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <FaceAuthPage onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onNavigate={() => setCurrentPage('monitor')}
            onNavigateToDemo={() => setCurrentPage('project-demo')}
            onNavigateToAiDemo={() => setCurrentPage('ai-demo')}
            onLogout={() => setIsAuthenticated(false)}
          />
        );
      case 'monitor':
        return <MonitoringPage onNavigate={() => setCurrentPage('landing')} onNavigateToModels={() => setCurrentPage('models')} />;
      case 'models':
        return <ModelAnalysisPage
          onNavigateBack={() => setCurrentPage('monitor')}
          onNavigateToResNet={() => setCurrentPage('resnet-analysis')}
          onNavigateToDistilBERT={() => setCurrentPage('distilbert-analysis')}
        />;
      case 'resnet-analysis':
        return <ResNetAnalysisPage onNavigateBack={() => setCurrentPage('models')} />;
      case 'distilbert-analysis':
        return <DistilBERTAnalysisPage onNavigateBack={() => setCurrentPage('models')} />;
      case 'project-demo':
        return <ProjectDemoPage onNavigateBack={() => setCurrentPage('landing')} />;
      case 'ai-demo':
        return <RealTimeAiDemoPage onNavigateBack={() => setCurrentPage('landing')} />;
      default:
        return <LandingPage onNavigate={() => setCurrentPage('monitor')} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
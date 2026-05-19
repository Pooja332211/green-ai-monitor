import React from 'react';
import LiveStats from './LiveStats';
import RoboticCore from './RoboticCore';
import OptimizationTips from './OptimizationTips';

function Dashboard() {
  return (
    <div>
      <LiveStats />
      <RoboticCore />
      <OptimizationTips />
    </div>
  );
}

export default Dashboard;
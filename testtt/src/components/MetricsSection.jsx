import React from 'react';
import './MetricsSection.css';

const MetricsSection = () => {
  return (
    <div className="metrics-section">
      <h2 className="section-title">Your Learning Analytics</h2>
      <div className="metric-group">
        <div className="metric-item">
          <div className="metric-heading">Conversation Sessions</div>
          <div className="metric-number">100</div>
        </div>
        
        <div className="metric-item">
          <div className="metric-heading">Topics Discussed</div>
          <div className="metric-number">6</div>
        </div>
        
        <div className="metric-item">
          <div className="metric-heading">Upcoming</div>
          <div className="metric-number">91</div>
        </div>
      </div>
    </div>
  );
};

export default MetricsSection;

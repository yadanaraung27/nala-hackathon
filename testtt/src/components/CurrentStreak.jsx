import React from 'react';
import './CurrentStreak.css';

const CurrentStreak = () => {
  return (
    <div className="current-streak">
      <div className="streak-card">
        <div className="streak-header">
          <h3 className="streak-title">Current Streak</h3>
          <div className="streak-icon">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/2d7067a8c371f042bb180a1cc34b99ec55230cbe?width=138" alt="Streak Icon" />
          </div>
        </div>
        
        <div className="streak-number">
          <span className="number">7 days</span>
        </div>
        
        <div className="streak-message">
          <p className="message-text">
            <span className="primary-text">Your daily question is ready!</span>
            <br />
            <span className="secondary-text">Keep your 7-day streak going</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentStreak;

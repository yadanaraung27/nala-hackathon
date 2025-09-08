import React from 'react';
import './LearningStyleHeader.css';

const LearningStyleHeader = () => {
  return (
    <div className="learning-style-header">
      <div className="background-elements">
        <div className="bg-blur"></div>
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>
      
      <div className="content-overlay">
        <div className="student-image">
          <img src="https://api.builder.io/api/v1/image/assets/TEMP/da1dc5d8ea1de8e8ee6d1640f0d887eacbfd74e8?width=558" alt="Student" />
        </div>
        
        <div className="text-content">
          <h2 className="welcome-title">Welcome back, Student 👋🏻</h2>
          <div className="learning-style-text">
            <span className="style-label">Your learning style: </span>
            <span className="style-name">The Interactor</span>
          </div>
          <p className="description">
            Your chatbot interactions and daily questions are personalised to match your learning style.
          </p>
          <div className="actions">
            <button className="retake-quiz-btn">Retake Quiz</button>
          </div>
        </div>
      </div>
      
      <div className="learn-more">
        <span>Learn more about your style</span>
      </div>
    </div>
  );
};

export default LearningStyleHeader;

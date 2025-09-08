import React from 'react';
import './QuestionOfTheDay.css';

const QuestionOfTheDay = () => {
  return (
    <div className="question-of-the-day">
      <div className="question-card">
        <div className="question-header">
          <h3 className="question-title">Question of the Day</h3>
        </div>
        
        <div className="question-content">
          <p className="question-text">
            "Imagine you're explaining binary search trees to a study group. How would you describe the insertion process step-by-step, and what questions might your classmates ask that you should be prepared to answer?"
          </p>
        </div>
        
        <div className="question-action">
          <button className="start-challenge-btn">Start Challenge</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionOfTheDay;

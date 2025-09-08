import React from 'react';
import './CourseOverview.css';

const CourseOverview = () => {
  return (
    <div className="course-overview">
      <h2 className="overview-title">Course Overview</h2>
      
      <div className="overview-content">
        <div className="upcoming-deadlines">
          <div className="deadlines-card">
            <div className="deadlines-header">
              <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
                <path d="M32 4.86401V14.0096M16 4.86401V14.0096M6 23.1552H42M10 9.43682H38C40.2091 9.43682 42 11.4841 42 14.0096V46.0192C42 48.5447 40.2091 50.5921 38 50.5921H10C7.79086 50.5921 6 48.5447 6 46.0192V14.0096C6 11.4841 7.79086 9.43682 10 9.43682Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="deadlines-number">5</div>
            </div>
            
            <h3 className="deadlines-title">Upcoming Deadlines</h3>
            
            <div className="deadline-item">
              <div className="deadline-icon">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                  <path d="M9.99979 2.10001C8.40849 2.10001 6.88236 2.76375 5.75715 3.94523C4.63193 5.12671 3.99979 6.72914 3.99979 8.40001V12.1653L3.29279 12.9077C3.15298 13.0545 3.05777 13.2416 3.0192 13.4452C2.98064 13.6489 3.00044 13.86 3.07611 14.0518C3.15178 14.2436 3.27992 14.4076 3.44433 14.523C3.60874 14.6384 3.80204 14.7 3.99979 14.7H15.9998C16.1975 14.7 16.3908 14.6384 16.5552 14.523C16.7197 14.4076 16.8478 14.2436 16.9235 14.0518C16.9991 13.86 17.0189 13.6489 16.9804 13.4452C16.9418 13.2416 16.8466 13.0545 16.7068 12.9077L15.9998 12.1653V8.40001C15.9998 6.72914 15.3676 5.12671 14.2424 3.94523C13.1172 2.76375 11.5911 2.10001 9.99979 2.10001ZM9.99979 18.9C9.20414 18.9 8.44108 18.5681 7.87847 17.9774C7.31586 17.3867 6.99979 16.5854 6.99979 15.75H12.9998C12.9998 16.5854 12.6837 17.3867 12.1211 17.9774C11.5585 18.5681 10.7954 18.9 9.99979 18.9Z" fill="#FFAD47"/>
                </svg>
              </div>
              <div className="deadline-info">
                <div className="deadline-name">Topic 1 Quiz</div>
                <div className="deadline-details">
                  <span className="deadline-time">09:00AM</span>
                  <span className="deadline-status">Due Soon</span>
                </div>
              </div>
            </div>
            
            <div className="deadline-item">
              <div className="deadline-icon">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                  <path d="M9.99979 2.10001C8.40849 2.10001 6.88236 2.76375 5.75715 3.94523C4.63193 5.12671 3.99979 6.72914 3.99979 8.40001V12.1653L3.29279 12.9077C3.15298 13.0545 3.05777 13.2416 3.0192 13.4452C2.98064 13.6489 3.00044 13.86 3.07611 14.0518C3.15178 14.2436 3.27992 14.4076 3.44433 14.523C3.60874 14.6384 3.80204 14.7 3.99979 14.7H15.9998C16.1975 14.7 16.3908 14.6384 16.5552 14.523C16.7197 14.4076 16.8478 14.2436 16.9235 14.0518C16.9991 13.86 17.0189 13.6489 16.9804 13.4452C16.9418 13.2416 16.8466 13.0545 16.7068 12.9077L15.9998 12.1653V8.40001C15.9998 6.72914 15.3676 5.12671 14.2424 3.94523C13.1172 2.76375 11.5911 2.10001 9.99979 2.10001ZM9.99979 18.9C9.20414 18.9 8.44108 18.5681 7.87847 17.9774C7.31586 17.3867 6.99979 16.5854 6.99979 15.75H12.9998C12.9998 16.5854 12.6837 17.3867 12.1211 17.9774C11.5585 18.5681 10.7954 18.9 9.99979 18.9Z" fill="#FFAD47"/>
                </svg>
              </div>
              <div className="deadline-info">
                <div className="deadline-name">Assignment</div>
                <div className="deadline-details">
                  <span className="deadline-time">11:00AM</span>
                  <span className="deadline-status">Due Soon</span>
                </div>
              </div>
            </div>
            
            <button className="view-all-btn">View All</button>
          </div>
        </div>
        
        <div className="course-topics">
          <div className="topics-card">
            <div className="topics-header">
              <h3 className="topics-title">Topics</h3>
            </div>
            
            <div className="course-badge">
              <span className="course-name">Discrete Math</span>
            </div>
            
            <div className="topic-item">
              <button className="start-chat-btn">Start Chat</button>
              <div className="topic-info">
                <div className="topic-name">Elementary Number Theory</div>
                <div className="topic-label">Topic 1</div>
              </div>
              <div className="progress-bar">
                <div className="progress-background"></div>
                <div className="progress-fill" style={{width: '55%'}}></div>
              </div>
            </div>
            
            <div className="topic-item">
              <button className="start-chat-btn">Start Chat</button>
              <div className="topic-info">
                <div className="topic-name">Propositional Logic</div>
                <div className="topic-label">Topic 2</div>
              </div>
              <div className="progress-bar">
                <div className="progress-background"></div>
                <div className="progress-fill completed" style={{width: '85%'}}></div>
              </div>
            </div>
            
            <div className="topic-item">
              <button className="start-chat-btn">Start Chat</button>
              <div className="topic-info">
                <div className="topic-name">Predicate Logic</div>
                <div className="topic-label">Topic 3</div>
              </div>
              <div className="progress-bar">
                <div className="progress-background"></div>
                <div className="progress-fill low" style={{width: '35%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;

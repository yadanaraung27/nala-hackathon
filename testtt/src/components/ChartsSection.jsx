import React from 'react';
import './ChartsSection.css';

const ChartsSection = () => {
  return (
    <div className="charts-section">
      <div className="learning-activity-chart">
        <div className="chart-header">
          <div className="chart-title-section">
            <h3 className="chart-title">Learning Activity</h3>
            <p className="chart-subtitle">Track how your rating compares to your industry average.</p>
          </div>
          <div className="chart-dropdown">
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
              <path d="M9.99984 11.6083C10.4601 11.6083 10.8332 11.2352 10.8332 10.7749C10.8332 10.3147 10.4601 9.94161 9.99984 9.94161C9.5396 9.94161 9.1665 10.3147 9.1665 10.7749C9.1665 11.2352 9.5396 11.6083 9.99984 11.6083Z" stroke="#98A2B3" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.99984 5.77494C10.4601 5.77494 10.8332 5.40185 10.8332 4.94161C10.8332 4.48137 10.4601 4.10828 9.99984 4.10828C9.5396 4.10828 9.1665 4.48137 9.1665 4.94161C9.1665 5.40185 9.5396 5.77494 9.99984 5.77494Z" stroke="#98A2B3" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.99984 17.4416C10.4601 17.4416 10.8332 17.0685 10.8332 16.6083C10.8332 16.148 10.4601 15.7749 9.99984 15.7749C9.5396 15.7749 9.1665 16.148 9.1665 16.6083C9.1665 17.0685 9.5396 17.4416 9.99984 17.4416Z" stroke="#98A2B3" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="chart-content">
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color calculus"></div>
              <span>Calculus</span>
            </div>
            <div className="legend-item">
              <div className="legend-color programming"></div>
              <span>Programming</span>
            </div>
          </div>
          
          <div className="chart-area">
            <div className="y-axis">
              <div className="y-axis-label">Security rating</div>
              <div className="y-axis-values">
                <span>100</span>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>
            </div>
            
            <div className="chart-bars">
              <div className="bar-group">
                <div className="bar calculus" style={{height: '85%'}}></div>
                <div className="bar programming" style={{height: '70%'}}></div>
                <span className="x-label">Sun</span>
              </div>
              <div className="bar-group">
                <div className="bar calculus" style={{height: '75%'}}></div>
                <div className="bar programming" style={{height: '65%'}}></div>
                <span className="x-label">Mon</span>
              </div>
              <div className="bar-group">
                <div className="bar calculus" style={{height: '80%'}}></div>
                <div className="bar programming" style={{height: '60%'}}></div>
                <span className="x-label">Tue</span>
              </div>
              <div className="bar-group">
                <div className="bar calculus" style={{height: '70%'}}></div>
                <div className="bar programming" style={{height: '55%'}}></div>
                <span className="x-label">Wed</span>
              </div>
              <div className="bar-group">
                <div className="bar calculus" style={{height: '85%'}}></div>
                <div className="bar programming" style={{height: '75%'}}></div>
                <span className="x-label">Thur</span>
              </div>
              <div className="bar-group">
                <div className="bar calculus" style={{height: '90%'}}></div>
                <div className="bar programming" style={{height: '80%'}}></div>
                <span className="x-label">Fri</span>
              </div>
              <div className="bar-group">
                <div className="bar calculus" style={{height: '78%'}}></div>
                <div className="bar programming" style={{height: '68%'}}></div>
                <span className="x-label">Sat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mastery-level-chart">
        <div className="chart-header">
          <h3 className="chart-title">Mastery Level</h3>
        </div>
        
        <div className="radar-chart">
          <div className="radar-grid">
            <div className="radar-line"></div>
            <div className="radar-line"></div>
            <div className="radar-line"></div>
            <div className="radar-line"></div>
            <div className="radar-line"></div>
          </div>
          
          <div className="radar-labels">
            <span className="label label-1">Comprehension</span>
            <span className="label label-2">Tier 2</span>
            <span className="label label-3">Evaluation</span>
            <span className="label label-4">Analysis</span>
            <span className="label label-5">Application</span>
            <span className="label label-6">Innovation</span>
            <span className="label label-7">Basic Understanding</span>
          </div>
          
          <div className="radar-data">
            <div className="radar-polygon"></div>
          </div>
        </div>
        
        <div className="chart-footer">
          <button className="view-report-btn">View full report</button>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;

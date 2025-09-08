import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-nav">
          <div className="search-section">
            <div className="input-dropdown">
              <div className="input-with-label"></div>
            </div>
          </div>
          
          <div className="dashboard-section">
            <h3 className="section-title">DASHBOARD</h3>
            <div className="navigation">
              <div className="nav-item">
                <div className="nav-item-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 20V10M12 20V4M6 20V14" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Course</span>
                </div>
              </div>
              
              <div className="nav-item">
                <div className="nav-item-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 20V10M12 20V4M6 20V14" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Dailys</span>
                </div>
                <div className="chevron-down"></div>
              </div>
              
              <div className="nav-item">
                <div className="nav-item-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 20V10M12 20V4M6 20V14" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Reporting</span>
                </div>
                <div className="chevron-down"></div>
              </div>
            </div>
          </div>
          
          <div className="customization-section">
            <h3 className="section-title">CUSTOMIZATION</h3>
            <div className="nav-item">
              <div className="nav-item-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Profile</span>
              </div>
              <div className="chevron-down"></div>
            </div>
            
            <div className="nav-item">
              <div className="nav-item-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Activity</span>
              </div>
            </div>
            
            <div className="nav-item">
              <div className="nav-item-content">
                <div className="activity-icon"></div>
                <span>Toggle Features</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="learning-style-badge">
            <div className="avatar"></div>
            <div className="badge-content">
              <div className="badge-title">The Interactor</div>
              <div className="badge-subtitle">Social and communicative</div>
            </div>
          </div>
          
          <div className="footer-actions">
            <div className="footer-action">
              <svg width="26" height="24" viewBox="0 0 26 24" fill="none">
                <path d="M22.75 15C22.75 15.5304 22.5217 16.0391 22.1154 16.4142C21.7091 16.7893 21.158 17 20.5833 17H7.58333L3.25 21V5C3.25 4.46957 3.47827 3.96086 3.8846 3.58579C4.29093 3.21071 4.84203 3 5.41667 3H20.5833C21.158 3 21.7091 3.21071 22.1154 3.58579C22.5217 3.96086 22.75 4.46957 22.75 5V15Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Go to Chatbot</span>
            </div>
            
            <div className="footer-action">
              <svg width="29" height="26" viewBox="0 0 29 26" fill="none">
                <path d="M10.875 22.75H6.04167C5.40073 22.75 4.78604 22.5217 4.33283 22.1154C3.87961 21.7091 3.625 21.158 3.625 20.5833V5.41667C3.625 4.84203 3.87961 4.29093 4.33283 3.8846C4.78604 3.47827 5.40073 3.25 6.04167 3.25H10.875M19.3333 18.4167L25.375 13M25.375 13L19.3333 7.58333M25.375 13H10.875" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Log out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

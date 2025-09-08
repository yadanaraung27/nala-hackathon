import React from 'react';
import './MainContent.css';
import Header from './Header';
import LearningStyleHeader from './LearningStyleHeader';
import MetricsSection from './MetricsSection';
import ChartsSection from './ChartsSection';
import QuestionOfTheDay from './QuestionOfTheDay';
import CurrentStreak from './CurrentStreak';
import CourseOverview from './CourseOverview';

const MainContent = () => {
  return (
    <div className="main-content">
      <Header />
      <LearningStyleHeader />
      <MetricsSection />
      <ChartsSection />
      <div className="bottom-sections">
        <div className="left-bottom">
          <CurrentStreak />
        </div>
        <div className="right-bottom">
          <QuestionOfTheDay />
        </div>
      </div>
      <CourseOverview />
    </div>
  );
};

export default MainContent;

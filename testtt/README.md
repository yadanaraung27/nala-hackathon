# NALA Learning Analytics Dashboard

A modern Learning Analytics Dashboard built with React, implementing a Figma design for an educational platform.

## Features

- **Learning Analytics Overview**: Displays key metrics like conversation sessions, topics discussed, and upcoming items
- **Learning Style Personalization**: Shows personalized content based on learning style ("The Interactor")
- **Interactive Charts**: Learning activity and mastery level visualizations
- **Question of the Day**: Daily personalized questions to maintain engagement
- **Streak Tracking**: Current learning streak display
- **Course Overview**: Progress tracking for different topics with interactive elements
- **Responsive Sidebar Navigation**: Clean navigation with customization options

## Tech Stack

- React 18
- CSS3 with CSS Variables
- Custom Components
- Google Fonts (Inter, Poppins, Roboto, DM Sans, Nunito Sans)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
  components/
    Dashboard.jsx          # Main dashboard container
    Sidebar.jsx           # Left navigation sidebar
    MainContent.jsx       # Main content area
    Header.jsx            # Dashboard header
    LearningStyleHeader.jsx # Learning style banner
    MetricsSection.jsx    # Analytics metrics display
    ChartsSection.jsx     # Charts for learning activity and mastery
    QuestionOfTheDay.jsx  # Daily question component
    CurrentStreak.jsx     # Streak tracking component
    CourseOverview.jsx    # Course progress overview
  App.jsx                 # Main app component
  index.js               # Entry point
```

## Design System

The project uses a comprehensive design system with:
- CSS Variables for consistent theming
- Inter font family for most text
- Poppins for specialized content
- Consistent spacing and border radius
- Color palette matching the original Figma design

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - One-way operation to customize build tools

## License

This project is private and proprietary.

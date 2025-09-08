import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { MessageCircle, Brain, Target, Settings, Calendar, Flame, BarChart3, GraduationCap, Info, X, Home, Users, Activity } from 'lucide-react';
import LearningStyleQuiz from './components/LearningStyleQuiz';
import LearningChatbot from './components/LearningChatbot';
import QuestionChatbot from './components/QuestionChatbot';
import GeneralChatbot from './components/GeneralChatbot';
import Homepage from './components/pages/Homepage';
import CoursesPage from './components/pages/CoursesPage';
import DailyChallengesPage from './components/pages/DailyChallengesPage';
import AnalyticsPage from './components/pages/AnalyticsPage';

// Learning preference detailed information
const learningPreferenceDetails = {
  'The Interactor': {
    description: 'You learn best through social interaction, discussion, and collaborative experiences.',
    characteristics: [
      'Thrives in group settings and team projects',
      'Learns effectively through verbal communication',
      'Enjoys brainstorming and idea sharing',
      'Benefits from peer feedback and discussion'
    ],
    studyTips: [
      'Join or form study groups for complex topics',
      'Participate actively in class discussions',
      'Explain concepts to others to reinforce learning',
      'Use collaborative online platforms for projects'
    ],
    platformFeatures: [
      'Chatbot interactions are designed to be conversational and interactive',
      'Daily questions include discussion prompts and collaborative elements',
      'Course recommendations prioritize group projects and interactive assignments',
      'Analytics track your engagement in collaborative features'
    ]
  },
  'The Architect': {
    description: 'You prefer structured, methodical approaches to learning with clear frameworks and detailed analysis.',
    characteristics: [
      'Enjoys systematic and organized learning paths',
      'Prefers detailed explanations and comprehensive materials',
      'Excels in theoretical and analytical subjects',
      'Values thorough preparation and planning'
    ],
    studyTips: [
      'Create detailed study schedules and stick to them',
      'Build comprehensive notes and reference materials',
      'Break complex topics into structured components',
      'Use mind maps and organizational tools'
    ],
    platformFeatures: [
      'Chatbot provides detailed, structured explanations',
      'Daily questions focus on theoretical understanding and analysis',
      'Course difficulty analysis helps plan your learning path',
      'Mastery tracking shows detailed progress across competency levels'
    ]
  },
  'The Problem Solver': {
    description: 'You learn best through hands-on practice, experimentation, and tackling real-world challenges.',
    characteristics: [
      'Prefers practical, applied learning over theory',
      'Enjoys working through problems and case studies',
      'Learns effectively through trial and error',
      'Thrives with immediate feedback and results'
    ],
    studyTips: [
      'Seek out hands-on projects and practical applications',
      'Practice with real-world datasets and problems',
      'Build prototypes and working examples',
      'Focus on learning through doing rather than just reading'
    ],
    platformFeatures: [
      'Chatbot emphasizes practical examples and code solutions',
      'Daily questions include coding challenges and practical problems',
      'Course recommendations highlight hands-on and project-based learning',
      'Analytics track your performance on practical vs theoretical content'
    ]
  },
  'The Adventurer': {
    description: 'You thrive in dynamic, varied learning environments with creative exploration and flexible approaches.',
    characteristics: [
      'Enjoys diverse learning experiences and formats',
      'Learns well through creative and innovative approaches',
      'Prefers flexible schedules and self-directed learning',
      'Thrives with variety and new challenges'
    ],
    studyTips: [
      'Mix different learning formats and resources',
      'Explore creative projects and unconventional approaches',
      'Set flexible goals and adapt your learning style',
      'Seek out interdisciplinary connections and applications'
    ],
    platformFeatures: [
      'Chatbot adapts its communication style to keep interactions fresh',
      'Daily questions vary in format and incorporate creative elements',
      'Course recommendations include diverse and interdisciplinary options',
      'Platform features can be customized to match your preferences'
    ]
  }
};



export default function App() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [learningPreference, setLearningPreference] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLearningStyleDetails, setShowLearningStyleDetails] = useState(false);
  const [activeSection, setActiveSection] = useState('Homepage');
  const [currentDate, setCurrentDate] = useState('');
  const [showQuestionChatbot, setShowQuestionChatbot] = useState(false);
  const [showGeneralChatbot, setShowGeneralChatbot] = useState(false);
  
  // Feature toggles
  const [features, setFeatures] = useState({
    learningPreferences: true,
    courseOverview: true,
    questionOfTheDay: true,
    masteryLevel: true,
    courseDifficulty: true,
    chatbot: true
  });

  // Set current date on component mount
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    };
    const formattedDate = now.toLocaleDateString('en-GB', options);
    setCurrentDate(formattedDate);
  }, []);

  // Check if user has already taken the quiz and load feature preferences
  useEffect(() => {
    const savedLearningPreference = localStorage.getItem('learningPreference');
    const savedQuizCompleted = localStorage.getItem('quizCompleted');
    const savedFeatures = localStorage.getItem('dashboardFeatures');
    
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures));
    }
    
    if (savedQuizCompleted === 'true') {
      // User has completed the quiz (either with a preference or skipped)
      setQuizCompleted(true);
      if (savedLearningPreference && savedLearningPreference !== 'null') {
        setLearningPreference(savedLearningPreference);
      }
    } else if (features.learningPreferences) {
      // First time user - show quiz immediately (mandatory)
      const timer = setTimeout(() => setShowQuiz(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [features.learningPreferences]);

  const handleQuizComplete = (preference: string) => {
    setLearningPreference(preference);
    setQuizCompleted(true);
    setShowQuiz(false);
    localStorage.setItem('learningPreference', preference);
    localStorage.setItem('quizCompleted', 'true');
  };

  const handleQuizSkip = () => {
    // User skipped - preference remains null
    setLearningPreference(null);
    setQuizCompleted(true);
    setShowQuiz(false);
    localStorage.setItem('learningPreference', 'null');
    localStorage.setItem('quizCompleted', 'true');
  };

  const handleRetakeQuiz = () => {
    setShowQuiz(true);
    setLearningPreference(null);
    localStorage.removeItem('learningPreference');
    localStorage.setItem('quizCompleted', 'false');
  };

  const handleFeatureToggle = (feature: keyof typeof features) => {
    const newFeatures = { ...features, [feature]: !features[feature] };
    setFeatures(newFeatures);
    localStorage.setItem('dashboardFeatures', JSON.stringify(newFeatures));
    
    // If learning preferences is disabled, hide the quiz
    if (feature === 'learningPreferences' && !newFeatures.learningPreferences) {
      setShowQuiz(false);
    }
  };



  const currentLearningPreferenceDetails = learningPreference ? learningPreferenceDetails[learningPreference as keyof typeof learningPreferenceDetails] : null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Learning Preference Quiz Modal */}
      {showQuiz && features.learningPreferences && (
        <LearningStyleQuiz 
          onComplete={handleQuizComplete} 
          onSkip={handleQuizSkip} 
        />
      )}

      {/* Learning Preference Details Modal */}
      {showLearningStyleDetails && currentLearningPreferenceDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  {learningPreference}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLearningStyleDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{currentLearningPreferenceDetails.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Characteristics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Your Learning Characteristics</h4>
                <ul className="space-y-2">
                  {currentLearningPreferenceDetails.characteristics.map((characteristic, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-purple-500 mt-1 flex-shrink-0">•</span>
                      <span>{characteristic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Study Tips */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Personalized Study Tips</h4>
                <ul className="space-y-2">
                  {currentLearningPreferenceDetails.studyTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Platform Features */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">How This Platform Adapts to You</h4>
                <ul className="space-y-2">
                  {currentLearningPreferenceDetails.platformFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowSettings(true)}>
                  Customize Features
                </Button>
                <Button onClick={() => setShowLearningStyleDetails(false)}>
                  Got it!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Dashboard Settings
              </CardTitle>
              <CardDescription>Customize your learning experience by enabling or disabling features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Learning Preferences</h4>
                    <p className="text-xs text-gray-600">Personalized learning recommendations and character profiles</p>
                  </div>
                  <Switch
                    checked={features.learningPreferences}
                    onCheckedChange={() => handleFeatureToggle('learningPreferences')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Course Overview</h4>
                    <p className="text-xs text-gray-600">Important dates, deadlines, and module information</p>
                  </div>
                  <Switch
                    checked={features.courseOverview}
                    onCheckedChange={() => handleFeatureToggle('courseOverview')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Question of the Day</h4>
                    <p className="text-xs text-gray-600">Daily challenges and streak tracking</p>
                  </div>
                  <Switch
                    checked={features.questionOfTheDay}
                    onCheckedChange={() => handleFeatureToggle('questionOfTheDay')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Mastery Level</h4>
                    <p className="text-xs text-gray-600">Course competency tracking and tier progression</p>
                  </div>
                  <Switch
                    checked={features.masteryLevel}
                    onCheckedChange={() => handleFeatureToggle('masteryLevel')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Course Difficulty</h4>
                    <p className="text-xs text-gray-600">Personalized course difficulty based on learning style</p>
                  </div>
                  <Switch
                    checked={features.courseDifficulty}
                    onCheckedChange={() => handleFeatureToggle('courseDifficulty')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Learning Assistant</h4>
                    <p className="text-xs text-gray-600">AI chatbot to help navigate the platform</p>
                  </div>
                  <Switch
                    checked={features.chatbot}
                    onCheckedChange={() => handleFeatureToggle('chatbot')}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Left Sidebar */}
      <div 
        className="w-80 text-white flex-shrink-0"
        style={{ background: '#5200F5' }}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-white">DiscreteMath</h2>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 space-y-2">
          {[
            { name: 'Homepage', icon: Home },
            { name: 'Courses', icon: GraduationCap },
            { name: 'Daily Challenges', icon: Target },
            { name: 'Analytics', icon: BarChart3 }
          ].map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`w-full justify-start text-left ${
                activeSection === item.name 
                  ? 'bg-white text-purple-700 hover:bg-white hover:text-purple-700' 
                  : 'text-purple-100 hover:bg-purple-500/20 hover:text-white'
              }`}
              onClick={() => setActiveSection(item.name)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.name}
            </Button>
          ))}
        </div>

        {/* Personalization Section */}
        <div className="p-4 mt-6">
          <h3 className="text-xs uppercase tracking-wider text-purple-200 mb-4">CUSTOMIZATION</h3>
          <div className="space-y-3">
            {learningPreference && (
              <div className="flex items-center justify-between p-3 bg-purple-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-200" />
                  <span className="text-sm text-purple-100">{learningPreference}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-200 hover:text-white hover:bg-purple-500/20 p-1 h-auto"
                  onClick={() => setShowLearningStyleDetails(true)}
                >
                  <Info className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Profile Section */}
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-100 hover:bg-purple-500/20 hover:text-white"
            >
              <Users className="h-4 w-4 mr-3" />
              Profile
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-purple-100 hover:bg-purple-500/20 hover:text-white"
            >
              <Activity className="h-4 w-4 mr-3" />
              Activity
            </Button>

            {/* Toggle Features */}
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-100 hover:bg-purple-500/20 hover:text-white"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4 mr-3" />
              Toggle Features
            </Button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-purple-500/20 hover:text-white py-3"
            onClick={() => setShowGeneralChatbot(true)}
          >
            <MessageCircle className="h-5 w-5 mr-3" />
            Go to Chatbot
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-purple-500/20 hover:text-white py-3"
          >
            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {showGeneralChatbot ? (
          /* General Chatbot Full Page */
          <GeneralChatbot 
            learningStyle={learningPreference} 
            onBack={() => setShowGeneralChatbot(false)}
          />
        ) : showQuestionChatbot ? (
          /* Question Chatbot Full Page */
          <QuestionChatbot 
            learningStyle={learningPreference} 
            onBack={() => setShowQuestionChatbot(false)}
          />
        ) : (
          <div className="p-6">
            {/* Render different pages based on active section */}
            {activeSection === 'Homepage' && (
              <Homepage
                learningPreference={learningPreference}
                currentDate={currentDate}
                onShowLearningStyleDetails={() => setShowLearningStyleDetails(true)}
                onShowQuiz={() => setShowQuiz(true)}
                onStartChallenge={() => setShowQuestionChatbot(true)}
              />
            )}

            {activeSection === 'Courses' && (
              <CoursesPage />
            )}

            {activeSection === 'Daily Challenges' && (
              <DailyChallengesPage />
            )}

            {activeSection === 'Analytics' && (
              <AnalyticsPage />
            )}
          </div>
        )}
      </div>

      {/* Learning Chatbot - Always available as floating button */}
      {features.chatbot && (
        <LearningChatbot learningStyle={learningPreference} />
      )}
    </div>
  );
}
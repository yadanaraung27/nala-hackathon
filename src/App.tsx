import { useState, useEffect, useMemo } from 'react';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { MessageCircle, Brain, Target, Settings, BarChart3, BookOpen, Info, Home, Users, HelpCircle, MessageSquare } from 'lucide-react';
import AppModals from './components/AppModals';
import LearningChatbot from './components/LearningChatbot';
import QuestionChatbot from './components/QuestionChatbot';
import GeneralChatbot from './components/GeneralChatbot';
import Homepage from './components/pages/Homepage';
import CoursesPage from './components/pages/CoursesPage';
import DailyChallengesPage from './components/pages/DailyChallengesPage';
import AnalyticsPage from './components/pages/AnalyticsPage';
import ProfilePage from './components/pages/ProfilePage';
import ChangePasswordPage from './components/pages/ChangePasswordPage';
import EditProfilePage from './components/pages/EditProfilePage';
import FeedbackPage from './components/pages/FeedbackPage';
import { getCurrentAcademicWeek } from './utils/academicWeek';
import logoImage from 'figma:asset/34647faf9321524b7219035ccc30e447dd7e8f0c.png';
import mathIcon from 'figma:asset/1ad425a32e03709d44c34771ec9a2688d270859e.png';


// Learning preference detailed information (Based on Kolb's Learning Theory)
const learningPreferenceDetails = {
  'The Interactor': {
    description: 'You prefer learning through active experimentation combined with concrete experience - thriving in social, hands-on environments.',
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
      'Chatbot provides conversational-style responses but follows pre-designed interaction patterns',
      'Daily questions include some discussion prompts, though individual engagement varies by topic',
      'Course content is the same for all users; recommendations are based on general course structure',
      'Analytics show your activity patterns but cannot track real collaborative engagement with others'
    ]
  },
  'The Architect': {
    description: 'You excel in abstract conceptualization and reflective observation - preferring systematic, theoretical approaches to learning.',
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
      'Chatbot can provide detailed explanations when asked specific questions about course content',
      'Daily questions cover theoretical concepts but are not specifically tailored to individual preferences',
      'Course information shows general difficulty indicators, not personalized learning path recommendations',
      'Progress tracking displays completion statistics but does not analyze learning competency depth'
    ]
  },
  'The Problem Solver': {
    description: 'You combine abstract conceptualization with active experimentation - learning through practical application and problem-solving.',
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
      'Chatbot can help with mathematical examples and problem-solving approaches for course topics',
      'Daily questions include some practical problems, but question types are fixed rather than adaptive',
      'Course content follows the same curriculum structure for all users with standard mathematical concepts',
      'Analytics track question completion and scores but cannot distinguish between practical vs theoretical mastery'
    ]
  },
  'The Adventurer': {
    description: 'You blend concrete experience with reflective observation - thriving in dynamic, intuitive learning environments with diverse approaches.',
    characteristics: [
      'Enjoys diverse learning experiences and formats',
      'Learns well through creative and innovative approaches',
      'Prefers flexible schedules and self-directed learning',
      'Thrives with variety and new challenges'
    ],
    studyTips: [
      'Mix different learning formats and resources',
      'Explore creative projects and unconventional approaches',
      'Set flexible goals and adapt your learning preference',
      'Seek out interdisciplinary connections and applications'
    ],
    platformFeatures: [
      'Chatbot uses consistent response patterns but you can explore different types of questions',
      'Daily questions have some variety in format but follow a predetermined rotation rather than real-time adaptation',
      'Course content is standardized for Mathematics I curriculum requirements',
      'Platform features can be enabled/disabled but core functionality remains the same for all users'
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
  const [currentDate, setCurrentDate] = useState('Sunday, September 28, 2025');
  const [currentWeek, setCurrentWeek] = useState<any>(null);
  const [showQuestionChatbot, setShowQuestionChatbot] = useState(false);
  const [showGeneralChatbot, setShowGeneralChatbot] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [profileSection, setProfileSection] = useState<'main' | 'change-password' | 'edit-profile'>('main');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [questionSubmission, setQuestionSubmission] = useState<{question: string, answer: string} | null>(null);
  const [startingChallenge, setStartingChallenge] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  
  // Feature toggles
  const [features, setFeatures] = useState({
    learningPreferences: true,
    courseOverview: true,
    questionOfTheDay: true,
    masteryLevel: true,
    courseDifficulty: true,
    chatbot: true
  });

  // Set current date and academic week on component mount
  useEffect(() => {
    const initializeDateAndWeek = async () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          day: 'numeric',
          month: 'long', 
          year: 'numeric'
        };
        
        // Use a timeout to prevent hanging
        const formatDate = () => {
          return new Promise<string>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Date formatting timeout'));
            }, 5000);
            
            try {
              const formattedDate = now.toLocaleDateString('en-GB', options);
              clearTimeout(timeout);
              resolve(formattedDate);
            } catch (error) {
              clearTimeout(timeout);
              reject(error);
            }
          });
        };
        
        const formattedDate = await formatDate();
        setCurrentDate(formattedDate);
        
        // Get current academic week with timeout
        const getWeekWithTimeout = () => {
          return new Promise<any>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Academic week calculation timeout'));
            }, 3000);
            
            try {
              const week = getCurrentAcademicWeek(now);
              clearTimeout(timeout);
              resolve(week);
            } catch (error) {
              clearTimeout(timeout);
              reject(error);
            }
          });
        };
        
        const week = await getWeekWithTimeout();
        setCurrentWeek(week);
        
      } catch (error) {
        console.error('Error setting date and week:', error);
        setInitializationError('Failed to initialize date and week');
        // Set fallback values
        setCurrentDate('Sunday, September 28, 2025');
        setCurrentWeek({
          name: 'Teaching Week 7',
          type: 'teaching',
          weekNumber: 7,
          start: new Date('2025-09-22'),
          end: new Date('2025-09-28')
        });
      } finally {
        // Always mark initialization as complete after a timeout
        setTimeout(() => {
          setIsInitializing(false);
        }, 100);
      }
    };
    
    initializeDateAndWeek();
  }, []);

  // Check if user has already taken the quiz and load feature preferences
  useEffect(() => {
    const initializeUserPreferences = async () => {
      try {
        // Use Promise.race to add timeout to localStorage operations
        const loadPreferences = () => {
          return new Promise<{
            learningPreference: string | null;
            quizCompleted: boolean;
            features: any;
            tutorialCompleted: boolean;
          }>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('localStorage operation timeout'));
            }, 3000);
            
            try {
              const savedLearningPreference = localStorage.getItem('learningPreference');
              const savedQuizCompleted = localStorage.getItem('quizCompleted');
              const savedFeatures = localStorage.getItem('dashboardFeatures');
              const savedTutorialCompleted = localStorage.getItem('tutorialCompleted');
              
              let parsedFeatures = {
                learningPreferences: true,
                courseOverview: true,
                questionOfTheDay: true,
                masteryLevel: true,
                courseDifficulty: true,
                chatbot: true
              };
              
              if (savedFeatures) {
                try {
                  parsedFeatures = JSON.parse(savedFeatures);
                } catch (e) {
                  console.error('Error parsing saved features:', e);
                }
              }
              
              clearTimeout(timeout);
              resolve({
                learningPreference: savedLearningPreference,
                quizCompleted: savedQuizCompleted === 'true',
                features: parsedFeatures,
                tutorialCompleted: savedTutorialCompleted === 'true'
              });
            } catch (error) {
              clearTimeout(timeout);
              reject(error);
            }
          });
        };
        
        const preferences = await loadPreferences();
        
        // Load features first
        setFeatures(preferences.features);
        
        // Set tutorial completion status
        setTutorialCompleted(preferences.tutorialCompleted);
        
        // Set quiz completion status
        setQuizCompleted(preferences.quizCompleted);
        if (preferences.quizCompleted && preferences.learningPreference && preferences.learningPreference !== 'null') {
          setLearningPreference(preferences.learningPreference);
        }

        // Show tutorial for first-time users (only if tutorial not completed)
        if (!preferences.tutorialCompleted) {
          const timer = setTimeout(() => {
            setShowTutorial(true);
          }, 1000);
          return () => clearTimeout(timer);
        }
        
      } catch (error) {
        console.error('Error loading saved preferences:', error);
        setInitializationError('Failed to load user preferences');
        // Set safe default values if localStorage fails
        setTutorialCompleted(true);
        setQuizCompleted(true);
        setFeatures({
          learningPreferences: true,
          courseOverview: true,
          questionOfTheDay: true,
          masteryLevel: true,
          courseDifficulty: true,
          chatbot: true
        });
      }
    };
    
    initializeUserPreferences();
  }, []);

  // Note: Removed automatic quiz showing after tutorial completion
  // Quiz now only shows when user explicitly chooses "Get Started" in tutorial

  const handleQuizComplete = (preference: string) => {
    setLearningPreference(preference);
    setQuizCompleted(true);
    setShowQuiz(false);
    
    // Use setTimeout to prevent blocking
    setTimeout(() => {
      try {
        localStorage.setItem('learningPreference', preference);
        localStorage.setItem('quizCompleted', 'true');
      } catch (e) {
        console.error('Error saving quiz results to localStorage:', e);
      }
    }, 0);
  };

  const handleQuizSkip = () => {
    // User skipped - preference remains null
    setLearningPreference(null);
    setQuizCompleted(true);
    setShowQuiz(false);
    
    setTimeout(() => {
      try {
        localStorage.setItem('learningPreference', 'null');
        localStorage.setItem('quizCompleted', 'true');
      } catch (e) {
        console.error('Error saving quiz skip to localStorage:', e);
      }
    }, 0);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setTutorialCompleted(true);
    
    setTimeout(() => {
      try {
        localStorage.setItem('tutorialCompleted', 'true');
      } catch (e) {
        console.error('Error saving tutorial completion to localStorage:', e);
      }
    }, 0);
  };

  const handleTutorialSkip = () => {
    // User skipped tutorial - mark both tutorial and quiz as completed
    setShowTutorial(false);
    setTutorialCompleted(true);
    setQuizCompleted(true);
    
    setTimeout(() => {
      try {
        localStorage.setItem('tutorialCompleted', 'true');
        localStorage.setItem('quizCompleted', 'true');
        localStorage.setItem('learningPreference', 'null');
      } catch (e) {
        console.error('Error saving tutorial skip to localStorage:', e);
      }
    }, 0);
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleRetakeQuiz = () => {
    setShowQuiz(true);
    setLearningPreference(null);
    
    setTimeout(() => {
      try {
        localStorage.removeItem('learningPreference');
        localStorage.setItem('quizCompleted', 'false');
      } catch (e) {
        console.error('Error updating localStorage for quiz retake:', e);
      }
    }, 0);
  };

  const handleFeatureToggle = (feature: keyof typeof features) => {
    try {
      const newFeatures = { ...features, [feature]: !features[feature] };
      setFeatures(newFeatures);
      
      // If learning preferences is disabled, hide the quiz
      if (feature === 'learningPreferences' && !newFeatures.learningPreferences) {
        setShowQuiz(false);
      }
      
      // Use setTimeout to prevent blocking
      setTimeout(() => {
        try {
          localStorage.setItem('dashboardFeatures', JSON.stringify(newFeatures));
        } catch (e) {
          console.error('Error saving features to localStorage:', e);
        }
      }, 0);
    } catch (error) {
      console.error('Error toggling feature:', error);
    }
  };

  const handleQuestionSubmit = (question: string, answer: string) => {
    setQuestionSubmission({ question, answer });
    setShowQuestionChatbot(false);
    setShowGeneralChatbot(true);
    setActiveSection(''); // Clear active section
  };



  const currentLearningPreferenceDetails = useMemo(() => {
    return learningPreference ? learningPreferenceDetails[learningPreference as keyof typeof learningPreferenceDetails] : null;
  }, [learningPreference]);

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
          {initializationError && (
            <p className="text-red-500 text-sm mt-2">{initializationError}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* All Modals */}
      <AppModals
        showQuiz={showQuiz}
        showTutorial={showTutorial}
        showSettings={showSettings}
        showLearningStyleDetails={showLearningStyleDetails}
        features={features}
        learningPreference={learningPreference}
        currentLearningPreferenceDetails={currentLearningPreferenceDetails}
        onQuizComplete={handleQuizComplete}
        onQuizSkip={handleQuizSkip}
        onTutorialComplete={handleTutorialComplete}
        onTutorialSkip={handleTutorialSkip}
        onShowQuiz={() => setShowQuiz(true)}
        onFeatureToggle={handleFeatureToggle}
        onCloseSettings={() => setShowSettings(false)}
        onCloseLearningStyleDetails={() => setShowLearningStyleDetails(false)}
      />

      {/* Left Sidebar */}
      <div 
        className={`${sidebarCollapsed ? 'w-24' : 'w-64'} text-white flex-shrink-0 transition-all duration-300`}
        style={{ background: '#5200F5' }}
        data-tutorial="sidebar"
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                <img 
                  src={mathIcon} 
                  alt="Mathematics Function" 
                  className="w-full h-full object-contain"
                />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h2 className="font-semibold text-white">Mathematics I</h2>
                </div>
              )}
            </div>
            {/* Collapse Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-purple-500/20 p-1 h-auto"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
                <path 
                  fill="currentColor" 
                  fillRule="evenodd" 
                  d="M10 7h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8zM9 7H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3zM4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" 
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 space-y-2">
          {[
            { name: 'Homepage', icon: Home },
            { name: 'Course', icon: BookOpen },
            { name: 'Daily Challenges', icon: Target },
            { name: 'Analytics', icon: BarChart3 }
          ].map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`w-full ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'} text-left ${
                activeSection === item.name 
                  ? 'bg-white text-purple-700 hover:bg-white hover:text-purple-700' 
                  : 'text-purple-100 hover:bg-purple-500/20 hover:text-white'
              }`}
              onClick={() => {
                setActiveSection(item.name);
                setShowGeneralChatbot(false);
                setShowQuestionChatbot(false);
              }}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <item.icon className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-3'}`} />
              {!sidebarCollapsed && item.name}
            </Button>
          ))}
          
          {/* Go to Chatbot - Right after Analytics */}
          <Button
            variant="ghost"
            className={`w-full ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'} ${
              showGeneralChatbot 
                ? 'bg-white text-purple-700 hover:bg-white hover:text-purple-700' 
                : 'text-purple-100 hover:bg-purple-500/20 hover:text-white'
            }`}
            onClick={() => {
              setShowGeneralChatbot(true);
              setActiveSection('');  // Clear active section to remove other highlights
            }}
            data-tutorial="chatbot"
            title={sidebarCollapsed ? 'Go to Chatbot' : undefined}
          >
            <MessageCircle className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-3'}`} />
            {!sidebarCollapsed && 'Go to Chatbot'}
          </Button>
        </div>

        {/* Personalization Section */}
        {!sidebarCollapsed && (
          <div className="p-4 mt-6">
            <h3 className="text-xs uppercase tracking-wider text-purple-200 mb-4">CUSTOMIZATION</h3>
            <div className="space-y-3">
              {learningPreference && (
                <div className="flex items-center justify-between p-3 bg-purple-500/20 rounded-lg" data-tutorial="learning-prefs">
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

              {/* Profile */}
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeSection === 'Profile' 
                    ? 'bg-white text-purple-700 hover:bg-white hover:text-purple-700' 
                    : 'text-purple-100 hover:bg-purple-500/20 hover:text-white'
                }`}
                onClick={() => {
                  setActiveSection('Profile');
                  setProfileSection('main');
                  setShowGeneralChatbot(false);
                  setShowQuestionChatbot(false);
                }}
              >
                <Users className="h-4 w-4 mr-3" />
                Profile
              </Button>
            </div>
          </div>
        )}

        {/* Support Section */}
        {!sidebarCollapsed && (
          <div className="p-4 mt-6">
            <h3 className="text-xs uppercase tracking-wider text-purple-200 mb-4">SUPPORT</h3>
            <div className="space-y-2">
              {/* Show Tutorial */}
              <Button
                variant="ghost"
                className="w-full justify-start text-purple-100 hover:bg-purple-500/20 hover:text-white border-none"
                onClick={handleShowTutorial}
              >
                <HelpCircle className="h-4 w-4 mr-3" />
                View Tutorial
              </Button>

              {/* Feedback Button */}
              <Button
                variant="ghost"
                className={`w-full justify-start border-none ${
                  activeSection === 'Feedback' 
                    ? 'bg-white text-purple-700 hover:bg-white hover:text-purple-700' 
                    : 'text-purple-100 hover:bg-purple-500/20 hover:text-white'
                }`}
                onClick={() => {
                  setActiveSection('Feedback');
                  setShowGeneralChatbot(false);
                  setShowQuestionChatbot(false);
                }}
                data-tutorial="feedback-section"
              >
                <MessageSquare className="h-4 w-4 mr-3" />
                Feedback
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className={`absolute bottom-0 left-0 ${sidebarCollapsed ? 'w-24' : 'w-64'} p-4 space-y-6`}>
          {/* Log out - Separated with larger gap */}
          <div className="pt-6">
            <Button
              variant="ghost"
              className={`w-full ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'} text-white hover:bg-purple-500/20 hover:text-white py-3 max-w-none`}
              title={sidebarCollapsed ? 'Log out' : undefined}
            >
              <svg className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!sidebarCollapsed && 'Log out'}
            </Button>
          </div>
          
          {/* Footer */}
          {!sidebarCollapsed && (
            <div className="pt-4 border-t border-purple-500/30 max-w-full">
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={logoImage} 
                    alt="LearnUs Logo" 
                    className="w-6 h-6"
                  />
                  <span className="text-sm font-semibold text-purple-100">LearnUs</span>
                </div>
              </div>
              <p className="text-xs text-purple-200 text-center break-words px-2 leading-tight">
                © 2025 LearnUs Dev Team.<br />All rights reserved.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto" data-tutorial="main-content">
        {showGeneralChatbot ? (
          /* General Chatbot Full Page */
          <GeneralChatbot 
            learningStyle={learningPreference} 
            initialQuestion={questionSubmission?.question}
            initialAnswer={questionSubmission?.answer}
            mode={startingChallenge || questionSubmission ? 'challenge' : 'general'}
            isNewChallenge={startingChallenge}
            onChallengeComplete={() => {
              setStartingChallenge(false);
              setQuestionSubmission(null);
            }}
          />
        ) : showQuestionChatbot ? (
          /* Question Chatbot Full Page */
          <QuestionChatbot 
            learningStyle={learningPreference} 
            onBack={() => setShowQuestionChatbot(false)}
            onSubmitAnswer={handleQuestionSubmit}
          />
        ) : (
          <div className="p-6">
            {/* Render different pages based on active section */}
            {(activeSection === 'Homepage' || activeSection === '') && (
              <div>
                {currentDate ? (
                  <Homepage
                    learningPreference={learningPreference}
                    currentDate={currentDate}
                    onShowLearningStyleDetails={() => setShowLearningStyleDetails(true)}
                    onShowQuiz={() => setShowQuiz(true)}
                    onStartChallenge={() => {
                      setStartingChallenge(true);
                      setShowGeneralChatbot(true);
                      setActiveSection('');
                    }}
                    onNavigateToAnalytics={() => setActiveSection('Analytics')}
                    onNavigateToCourse={() => setActiveSection('Course')}
                    onNavigateToChatbot={() => {
                      setShowGeneralChatbot(true);
                      setActiveSection('');
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-500">Loading...</div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'Course' && (
              <CoursesPage 
                onNavigateToChatbot={() => {
                  setShowGeneralChatbot(true);
                  setActiveSection('');
                }}
              />
            )}

            {activeSection === 'Daily Challenges' && (
              <DailyChallengesPage 
                onStartChallenge={() => {
                  setStartingChallenge(true);
                  setShowGeneralChatbot(true);
                  setActiveSection('');
                }}
              />
            )}

            {activeSection === 'Analytics' && (
              <AnalyticsPage />
            )}

            {activeSection === 'Feedback' && (
              <FeedbackPage />
            )}

            {activeSection === 'Profile' && (
              <>
                {profileSection === 'main' && (
                  <ProfilePage
                    onChangePassword={() => setProfileSection('change-password')}
                    onEditProfile={() => setProfileSection('edit-profile')}
                  />
                )}
                {profileSection === 'change-password' && (
                  <ChangePasswordPage
                    onBack={() => setProfileSection('main')}
                  />
                )}
                {profileSection === 'edit-profile' && (
                  <EditProfilePage
                    onBack={() => setProfileSection('main')}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Learning Chatbot - Always available as floating button */}
      {features.chatbot && (
        <LearningChatbot learningStyle={learningPreference} />
      )}

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Switch } from './components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { MessageCircle, Users, BookOpen, TrendingUp, Clock, Brain, Target, Activity, Filter, Download, RefreshCw, Settings, Calendar, Flame, BarChart3, GraduationCap, Info, X } from 'lucide-react';
import LearningStyleQuiz from './components/LearningStyleQuiz';
import EnhancedLearningStyleProfile from './components/EnhancedLearningStyleProfile';
import CourseOverview from './components/CourseOverview';
import QuestionOfTheDay from './components/QuestionOfTheDay';
import MasteryLevel from './components/MasteryLevel';
import PersonalizedCourseDifficulty from './components/PersonalizedCourseDifficulty';
import LearningChatbot from './components/LearningChatbot';

// Learning style detailed information
const learningStyleDetails = {
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

// Mock data for the analytics dashboard
const overviewStats = [
  { title: 'Total Questions', value: '2,847', change: '+12%', icon: MessageCircle, color: 'text-blue-600' },
  { title: 'Active Students', value: '342', change: '+8%', icon: Users, color: 'text-green-600' },
  { title: 'Topics Covered', value: '28', change: '+2', icon: BookOpen, color: 'text-purple-600' },
  { title: 'Avg Response Time', value: '1.2s', change: '-0.3s', icon: Clock, color: 'text-orange-600' }
];

const topicData = [
  { name: 'Data Structures', questions: 456, students: 89, difficulty: 'Medium' },
  { name: 'Algorithms', questions: 387, students: 76, difficulty: 'Hard' },
  { name: 'Web Development', questions: 342, students: 92, difficulty: 'Easy' },
  { name: 'Database Systems', questions: 298, students: 68, difficulty: 'Medium' },
  { name: 'Machine Learning', questions: 267, students: 54, difficulty: 'Hard' },
  { name: 'Software Engineering', questions: 234, students: 71, difficulty: 'Medium' },
  { name: 'Computer Networks', questions: 189, students: 45, difficulty: 'Medium' },
  { name: 'Operating Systems', questions: 174, students: 52, difficulty: 'Hard' }
];

const questionTypeData = [
  { name: 'Conceptual', value: 35, color: '#8884d8' },
  { name: 'Problem Solving', value: 28, color: '#82ca9d' },
  { name: 'Code Review', value: 22, color: '#ffc658' },
  { name: 'Debugging', value: 15, color: '#ff7300' }
];

const engagementData = [
  { day: 'Mon', questions: 320, students: 45 },
  { day: 'Tue', questions: 285, students: 52 },
  { day: 'Wed', questions: 398, students: 67 },
  { day: 'Thu', questions: 423, students: 71 },
  { day: 'Fri', questions: 367, students: 58 },
  { day: 'Sat', questions: 189, students: 23 },
  { day: 'Sun', questions: 156, students: 19 }
];

const timeSeriesData = [
  { time: '00:00', questions: 12 },
  { time: '04:00', questions: 8 },
  { time: '08:00', questions: 45 },
  { time: '12:00', questions: 78 },
  { time: '16:00', questions: 92 },
  { time: '20:00', questions: 67 },
  { time: '24:00', questions: 23 }
];

const recentActivity = [
  { student: 'Alex Chen', topic: 'Binary Trees', question: 'How to implement inorder traversal?', time: '2 min ago', avatar: 'AC' },
  { student: 'Sarah Kim', topic: 'React Hooks', question: 'useState vs useEffect differences', time: '5 min ago', avatar: 'SK' },
  { student: 'Mike Johnson', topic: 'SQL Queries', question: 'Complex JOIN operations', time: '8 min ago', avatar: 'MJ' },
  { student: 'Emma Wilson', topic: 'Python Lists', question: 'List comprehension syntax', time: '12 min ago', avatar: 'EW' },
  { student: 'David Lee', topic: 'Git Workflow', question: 'Merge vs rebase strategy', time: '15 min ago', avatar: 'DL' }
];

const performanceInsights = [
  { metric: 'Question Resolution Rate', value: 94, target: 95 },
  { metric: 'Student Satisfaction', value: 87, target: 90 },
  { metric: 'Response Accuracy', value: 92, target: 95 },
  { metric: 'Topic Coverage', value: 78, target: 80 }
];

export default function App() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [showQuiz, setShowQuiz] = useState(false);
  const [learningStyle, setLearningStyle] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLearningStyleDetails, setShowLearningStyleDetails] = useState(false);
  
  // Feature toggles
  const [features, setFeatures] = useState({
    learningStyles: true,
    courseOverview: true,
    questionOfTheDay: true,
    masteryLevel: true,
    courseDifficulty: true,
    chatbot: true
  });

  // Check if user has already taken the quiz and load feature preferences
  useEffect(() => {
    const savedLearningStyle = localStorage.getItem('learningStyle');
    const savedQuizCompleted = localStorage.getItem('quizCompleted');
    const savedFeatures = localStorage.getItem('dashboardFeatures');
    
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures));
    }
    
    if (savedLearningStyle && savedQuizCompleted === 'true') {
      setLearningStyle(savedLearningStyle);
      setQuizCompleted(true);
    } else if (features.learningStyles) {
      // Show quiz after a short delay for better UX, only if learning styles feature is enabled
      const timer = setTimeout(() => setShowQuiz(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [features.learningStyles]);

  const handleQuizComplete = (style: string) => {
    setLearningStyle(style);
    setQuizCompleted(true);
    setShowQuiz(false);
    localStorage.setItem('learningStyle', style);
    localStorage.setItem('quizCompleted', 'true');
  };

  const handleQuizSkip = () => {
    setQuizCompleted(true);
    setShowQuiz(false);
    localStorage.setItem('quizCompleted', 'true');
  };

  const handleRetakeQuiz = () => {
    setShowQuiz(true);
    setLearningStyle(null);
    localStorage.removeItem('learningStyle');
    localStorage.setItem('quizCompleted', 'false');
  };

  const handleFeatureToggle = (feature: keyof typeof features) => {
    const newFeatures = { ...features, [feature]: !features[feature] };
    setFeatures(newFeatures);
    localStorage.setItem('dashboardFeatures', JSON.stringify(newFeatures));
    
    // If learning styles is disabled, hide the quiz
    if (feature === 'learningStyles' && !newFeatures.learningStyles) {
      setShowQuiz(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentLearningStyleDetails = learningStyle ? learningStyleDetails[learningStyle as keyof typeof learningStyleDetails] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Learning Style Quiz Modal */}
      {showQuiz && features.learningStyles && (
        <LearningStyleQuiz 
          onComplete={handleQuizComplete} 
          onSkip={handleQuizSkip} 
        />
      )}

      {/* Learning Style Details Modal */}
      {showLearningStyleDetails && currentLearningStyleDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  {learningStyle}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLearningStyleDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{currentLearningStyleDetails.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Characteristics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Your Learning Characteristics</h4>
                <ul className="space-y-2">
                  {currentLearningStyleDetails.characteristics.map((characteristic, index) => (
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
                  {currentLearningStyleDetails.studyTips.map((tip, index) => (
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
                  {currentLearningStyleDetails.platformFeatures.map((feature, index) => (
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
                    <h4 className="text-sm font-medium">Learning Styles</h4>
                    <p className="text-xs text-gray-600">Personalized learning recommendations and character profiles</p>
                  </div>
                  <Switch
                    checked={features.learningStyles}
                    onCheckedChange={() => handleFeatureToggle('learningStyles')}
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

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Personalized insights and tools for your learning journey</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Learning Style Profile */}
            {learningStyle && features.learningStyles && (
              <EnhancedLearningStyleProfile 
                learningStyle={learningStyle} 
                onRetakeQuiz={handleRetakeQuiz}
              />
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Features
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Learning Style Welcome Banner */}
        {learningStyle && quizCompleted && features.learningStyles && (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      Welcome back! Your learning companion: <span className="text-purple-600">{learningStyle}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Your chatbot interactions, daily questions, and course recommendations are personalized to match your learning style.
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-purple-700 hover:text-purple-900 hover:bg-purple-100 p-0 h-auto"
                      onClick={() => setShowLearningStyleDetails(true)}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Learn more about your style
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowQuiz(true)}>
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Cards Row - New personalized sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Question of the Day */}
          {features.questionOfTheDay && (
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <Flame className="h-5 w-5" />
                  Quick Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 mb-1">Your daily question is ready!</p>
                    <p className="text-xs text-orange-600">Keep your 7-day streak going 🔥</p>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Start Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Overview Preview */}
          {features.courseOverview && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Calendar className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 mb-1">3 assignments due this week</p>
                    <p className="text-xs text-blue-600">ML Assignment due in 3 days</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mastery Level Preview */}
          {features.masteryLevel && (
            <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <BarChart3 className="h-5 w-5" />
                  Mastery Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 mb-1">Average mastery: 73%</p>
                    <p className="text-xs text-green-600">Web Dev leading at 82%</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-100">
                    View Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Difficulty Preview */}
          {features.courseDifficulty && learningStyle && (
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                  <GraduationCap className="h-5 w-5" />
                  Course Fit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-700 mb-1">3 easier, 2 challenging</p>
                    <p className="text-xs text-indigo-600">Based on your learning style</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-100">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last week</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-fit lg:grid-cols-8 overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            {features.courseOverview && <TabsTrigger value="courses">Courses</TabsTrigger>}
            {features.questionOfTheDay && <TabsTrigger value="qotd">Daily Challenge</TabsTrigger>}
            {features.masteryLevel && <TabsTrigger value="mastery">Mastery Level</TabsTrigger>}
            {features.courseDifficulty && learningStyle && <TabsTrigger value="difficulty">Course Fit</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Question Types Distribution */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Question Types Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of question categories asked by students</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={questionTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {questionTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Daily Activity Pattern */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Daily Activity Pattern
                  </CardTitle>
                  <CardDescription>Questions asked throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="questions" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Feed */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Recent Student Questions
                </CardTitle>
                <CardDescription>Latest interactions with the learning chatbot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {activity.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{activity.student}</p>
                          <Badge variant="secondary" className="text-xs">{activity.topic}</Badge>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{activity.question}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Topic Analysis
                </CardTitle>
                <CardDescription>Most popular topics and their engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topicData.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{topic.name}</h3>
                          <Badge className={getDifficultyColor(topic.difficulty)}>
                            {topic.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>{topic.questions} questions</span>
                          <span>{topic.students} students</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-32">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Engagement</span>
                            <span>{Math.round((topic.questions / 456) * 100)}%</span>
                          </div>
                          <Progress value={(topic.questions / 456) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Engagement Trends
                </CardTitle>
                <CardDescription>Student activity and question volume throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="questions" fill="#8884d8" name="Questions" />
                    <Bar dataKey="students" fill="#82ca9d" name="Active Students" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {performanceInsights.map((insight, index) => (
                <Card key={index} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {insight.metric}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">{insight.value}%</span>
                    </CardTitle>
                    <CardDescription>Target: {insight.target}%</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={insight.value} className="h-3" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current</span>
                        <span className={insight.value >= insight.target ? 'text-green-600' : 'text-red-600'}>
                          {insight.value >= insight.target ? '✓ Target Met' : `${insight.target - insight.value}% to target`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {features.courseOverview && (
            <TabsContent value="courses" className="space-y-6">
              <CourseOverview />
            </TabsContent>
          )}

          {features.questionOfTheDay && (
            <TabsContent value="qotd" className="space-y-6">
              <QuestionOfTheDay learningStyle={learningStyle} />
            </TabsContent>
          )}

          {features.masteryLevel && (
            <TabsContent value="mastery" className="space-y-6">
              <MasteryLevel />
            </TabsContent>
          )}

          {features.courseDifficulty && learningStyle && (
            <TabsContent value="difficulty" className="space-y-6">
              <PersonalizedCourseDifficulty learningStyle={learningStyle} />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Learning Chatbot - Always available as floating button */}
      {features.chatbot && (
        <LearningChatbot learningStyle={learningStyle} />
      )}
    </div>
  );
}
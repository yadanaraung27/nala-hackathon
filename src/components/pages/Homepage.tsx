import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Brain, Info, Target, TrendingUp, Clock, AlertCircle, BarChart3, BookOpen, ChevronRight } from 'lucide-react';
import { getCurrentAcademicWeek, getWeeklyContent, getProgressiveQuestionLevel, formatCurrentWeekRange } from '../../utils/academicWeek';
import { fetchCurrentChallenge, fetchChallenges, type Challenge } from '../../utils/challengesApi';
import { Flame } from 'lucide-react';

const learningCycleData = [
  { phase: 'Experience', engagement: 85, description: 'Hands-on practice' },
  { phase: 'Reflection', engagement: 72, description: 'Thinking about learning' },
  { phase: 'Conceptualization', engagement: 68, description: 'Understanding theory' },
  { phase: 'Experimentation', engagement: 91, description: 'Applying knowledge' }
];

interface HomepageProps {
  learningPreference: string | null;
  currentDate: string;
  onShowLearningStyleDetails: () => void;
  onShowQuiz: () => void;
  onStartChallenge: (challenge?: Challenge) => void;
  onNavigateToAnalytics: () => void;
  onNavigateToCourse: () => void;
  onNavigateToChatbot: () => void;
}

// Helper function to convert Bloom's taxonomy to Kolb's learning stages
const getKolbStage = (bloomLevel: string): string => {
  const bloomToKolbMapping = {
    'Remember': 'Experience',
    'Understand': 'Reflect', 
    'Apply': 'Experience',
    'Analyze': 'Reflect',
    'Evaluate': 'Conceptualize',
    'Create': 'Experience'
  };
  
  return bloomToKolbMapping[bloomLevel as keyof typeof bloomToKolbMapping] || 'Experience';
};

export default function Homepage({ 
  learningPreference, 
  currentDate, 
  onShowLearningStyleDetails, 
  onShowQuiz,
  onStartChallenge,
  onNavigateToAnalytics,
  onNavigateToCourse,
  onNavigateToChatbot 
}: HomepageProps) {
  const [currentWeek, setCurrentWeek] = useState<any>(null);
  const [weeklyContent, setWeeklyContent] = useState<any>(null);
  const [masteryScore, setMasteryScore] = useState(67);
  const [questionLevel, setQuestionLevel] = useState<any>(null);
  const [showBloomsTaxonomy, setShowBloomsTaxonomy] = useState(false);
  const [todayChallenge, setTodayChallenge] = useState<Challenge | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(true);
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isTodayChallengeCompleted, setIsTodayChallengeCompleted] = useState(false);
  const [streakLoading, setStreakLoading] = useState(true);

  // Helper function to get today's date string in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Helper function to calculate streak from challenges
  // Returns { streak, isTodayCompleted }
  const calculateStreakFromChallenges = (challenges: Challenge[]) => {
    const todayStr = getTodayString();
    
    // Filter challenges up to today only
    const filteredChallenges = challenges.filter(ch => ch.date <= todayStr);
    const completedChallenges = filteredChallenges.filter(ch => ch.status === 'completed');
    
    // Get completed dates
    const completedDates = new Set(completedChallenges.map(ch => ch.date));
    
    // Check if today's challenge is completed
    const todayCompleted = completedDates.has(todayStr);
    
    // Calculate current streak
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    // Start checking from today and go backwards
    while (true) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (completedDates.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (streak === 0 && checkDate.getTime() === today.getTime()) {
        // If today's challenge isn't completed yet, start counting from yesterday
        // but don't break the streak yet (it's still "pending")
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return { streak, isTodayCompleted: todayCompleted };
  };

  // Helper function to get learning preference emoji
  const getLearningPreferenceEmoji = (preference: string | null) => {
    switch (preference) {
      case 'The Interactor': return '🤝';
      case 'The Architect': return '🏗️';
      case 'The Problem Solver': return '🔧';
      case 'The Adventurer': return '🚀';
      default: return '👨‍💻';
    }
  };

  // Fetch today's challenge and streak data
  useEffect(() => {
    const loadTodayChallenge = async () => {
      setChallengeLoading(true);
      setChallengeError(null);
      try {
        const challenge = await fetchCurrentChallenge();
        setTodayChallenge(challenge);
      } catch (err) {
        // Use our error handling utilities for user-friendly messages
        const errorMsg = getUserFriendlyError(err as Error);
        logError(err as Error, 'Homepage - Load Today\'s Challenge');
        
        // Show user-friendly message with actionable advice
        setChallengeError(`${errorMsg.message}. ${errorMsg.actionable || ''}`);
        // Don't set challenge to null, allow fallback to default display
      } finally {
        setChallengeLoading(false);
      }
    };
    
    loadTodayChallenge();
  }, []);

  // Fetch all challenges to calculate streak
  useEffect(() => {
    const loadStreakData = async () => {
      setStreakLoading(true);
      try {
        const challengesData = await fetchChallenges({ limit: 1000 });
        const { streak, isTodayCompleted } = calculateStreakFromChallenges(challengesData.challenges);
        setCurrentStreak(streak);
        setIsTodayChallengeCompleted(isTodayCompleted);
      } catch (err) {
        // Use error handling utilities
        const errorMsg = getUserFriendlyError(err as Error);
        logError(err as Error, 'Homepage - Load Streak Data');
        // Keep default values on error - no need to show error to user for streak
      } finally {
        setStreakLoading(false);
      }
    };
    
    loadStreakData();
  }, []);

  useEffect(() => {
    try {
      const week = getCurrentAcademicWeek();
      setCurrentWeek(week);
      
      if (week && week.weekNumber) {
        const content = getWeeklyContent(week.weekNumber);
        setWeeklyContent(content);
      }
      
      const level = getProgressiveQuestionLevel(masteryScore);
      setQuestionLevel(level);
    } catch (error) {
      console.error('Error in Homepage useEffect:', error);
      // Set default values
      setCurrentWeek(null);
      setWeeklyContent(null);
      setQuestionLevel(null);
    }
  }, [masteryScore]);

  return (
    <div className="space-y-6">
      {/* Header with Quick Analytics */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900">Welcome back, Student 👋</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-gray-500">{currentDate}</p>
              {currentWeek && (
                <Badge 
                  variant={currentWeek.type === 'teaching' ? 'default' : 
                          currentWeek.type === 'recess' ? 'secondary' : 'outline'}
                  className={`${
                    currentWeek.type === 'teaching' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    currentWeek.type === 'recess' ? 'bg-green-100 text-green-700 border-green-200' :
                    currentWeek.type === 'revision' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    'bg-red-100 text-red-700 border-red-200'
                  }`}
                >
                  📚 {currentWeek.name}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Learning Preference Button */}
          <div className="flex-shrink-0">
            {!learningPreference ? (
              <Button 
                onClick={onShowQuiz}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
              >
                Discover Your Learning Preference
              </Button>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg shadow-sm">
                <div className="text-xl">
                  {getLearningPreferenceEmoji(learningPreference)}
                </div>
                <div>
                  <h3 className="font-medium text-purple-800 text-sm">{learningPreference}</h3>
                  <button 
                    onClick={onShowLearningStyleDetails}
                    className="text-xs text-purple-600 underline hover:text-purple-800"
                  >
                    View details
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onShowQuiz}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50 text-xs px-2 py-1"
                >
                  Retake
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Today's Challenge - Moved to Banner Position with Purple Gradient */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 border-none text-white relative overflow-hidden shadow-lg mb-6" data-tutorial="daily-challenge">
        <CardContent className="p-6 relative z-10">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Today's Challenge</h2>
              {!streakLoading && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`font-medium flex items-center gap-1 ${isTodayChallengeCompleted ? 'text-white' : 'text-white/60'}`}>
                        <Flame className={`h-5 w-5 ${isTodayChallengeCompleted ? 'text-orange-400' : 'text-gray-400'}`} />
                        {currentStreak}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isTodayChallengeCompleted ? (
                        <p>🔥 You're on a {currentStreak}-day streak! Keep it up!</p>
                      ) : currentStreak > 0 ? (
                        <p>Complete today's challenge to continue your {currentStreak}-day streak!</p>
                      ) : (
                        <p>Complete today's challenge to start a streak!</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {challengeLoading ? (
              <div className="text-white/80 py-8 text-center">Loading today's challenge...</div>
            ) : challengeError ? (
              <div className="text-white/80 py-8 text-center">
                <p>Unable to load today's challenge.</p>
                <p className="text-sm text-white/60 mt-2">{challengeError}</p>
              </div>
            ) : todayChallenge ? (
              <>
                <div className="flex items-end gap-6">
                  {/* Question container with transparent background */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 flex-1">
                    <p className="text-white leading-relaxed mb-3">
                      <span className="font-semibold">{todayChallenge.category}:</span> {todayChallenge.question}
                    </p>
                    
                    {/* Badges inside the same container */}
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                      <div className="flex items-center gap-1 text-white/90">
                        <BookOpen className="h-4 w-4" />
                        <span>{todayChallenge.category}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/90">
                        <Clock className="h-4 w-4" />
                        <span>{todayChallenge.difficulty}</span>
                      </div>
                      {todayChallenge.bloomLevel && (
                        <div className="flex items-center gap-1 text-white/90">
                          <Brain className="h-4 w-4" />
                          <span>{todayChallenge.bloomLevel}</span>
                        </div>
                      )}
                      {todayChallenge.bloomLevel && (
                        <div className="flex items-center gap-1 text-white/90">
                          <Target className="h-4 w-4" />
                          <span>{getKolbStage(todayChallenge.bloomLevel)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Target emoji aligned beside the bottom of question box */}
                  <div className="text-6xl opacity-20 flex-shrink-0 mb-6">
                    🎯
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => onStartChallenge(todayChallenge)}
                    className="bg-white text-purple-700 hover:bg-gray-50 hover:text-purple-800 font-semibold px-6 py-2 shadow-md"
                    size="default"
                  >
                    Start Challenge
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="text-white/70 text-xs flex items-center gap-1 cursor-help">
                          <Info className="h-3 w-3" />
                          <span>Daily practice</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p><strong>Retrieval Practice:</strong> Daily challenges use spaced repetition to combat the forgetting curve - you'll retain 90% more after 7 days compared to passive review.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            ) : (
              <div className="text-white/80 py-8 text-center">
                <p>No challenge available for today.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-tutorial="daily-challenge">
        {/* Current Focus */}
        <div onClick={onNavigateToChatbot} className="cursor-pointer">
          <Card className="h-full border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Current Focus</h3>
                    <p className="text-sm text-gray-500">Continue your learning</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Derivatives</h4>
                  <p className="text-sm text-gray-600">Topic 4 • 10% complete</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '45%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Deadline */}
        <div onClick={onNavigateToCourse} className="cursor-pointer">
          <Card className="h-full border border-orange-200 bg-orange-50 hover:shadow-md transition-all duration-200 hover:border-orange-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center border border-orange-200">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-900">Next Deadline</h3>
                    <p className="text-sm text-orange-600">Stay on track</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-orange-400" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-lg text-orange-900">Online Assignment 1</h4>
                <p className="text-sm text-orange-700">Due in 5 days • 8 February 2026</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* This Week's Insights - Full Weekly Learning Analytics Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-[17px]">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                This Week's Insights
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">{formatCurrentWeekRange()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onNavigateToAnalytics}
                className="flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                View Detailed Analytics
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekly Performance Summary - Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Strong This Week
              </h5>
              <p className="text-green-700 text-sm leading-relaxed mb-3">
                Great work on <strong>limits</strong> and <strong>continuity</strong>! Your 84% daily challenge accuracy is above class average.
              </p>
            </div>
            
            <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
              <h5 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Focus Area
              </h5>
              <p className="text-amber-700 text-sm leading-relaxed mb-2">
                <strong>Derivatives concepts</strong> need more practice. Your daily challenges will adapt to provide targeted retrieval practice.
              </p>
              {learningPreference && (
                <p className="text-amber-600 text-sm flex items-start gap-2 bg-amber-100 p-2 rounded border border-amber-200">
                  <span>💡</span>
                  <span>
                    {learningPreference === 'The Interactor' ? 'Form study groups to discuss derivatives concepts together!' :
                     learningPreference === 'The Architect' ? 'Create structured notes and frameworks for derivatives methods!' :
                     learningPreference === 'The Problem Solver' ? 'Work through more derivatives practice problems!' :
                     learningPreference === 'The Adventurer' ? 'Try creative visualization techniques for derivatives concepts!' :
                     'Consider taking the learning preference quiz for personalized study insights.'}
                  </span>
                </p>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="mt-2 text-xs text-amber-600 cursor-help flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      <span>Why targeted practice works</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p><strong>Deliberate Practice:</strong> Focusing on your weak areas (Derivatives) with immediate feedback creates stronger neural pathways than random practice. Expect 3x faster improvement in targeted topics.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-blue-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="mb-2"><strong>Active Learning Analytics:</strong> Your daily challenge accuracy creates a feedback loop that adapts future questions to your learning pace.</p>
                      <p>This week's 84% shows consistent improvement over time, helping optimize retrieval practice for better retention.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-2xl font-bold text-gray-900">84%</p>
              <p className="text-sm text-gray-600">Challenge Accuracy</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <p className="text-xs text-green-600">Above class avg (78%)</p>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <p className="text-xs text-blue-600">↗ Active Learning</p>
              </div>
            </div>
          </div>

          {/* Charts Row - Reorganized for better layout */}
          
          {/* Question Types by Topics - First Row */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium flex items-center gap-2">
                Question Types by Topics (
                <button 
                  onClick={() => setShowBloomsTaxonomy(true)}
                  className="text-purple-600 underline hover:text-purple-800 transition-colors cursor-pointer"
                >
                  Bloom's Taxonomy
                </button>
                )
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="mb-2"><strong>How This Helps Your Learning:</strong></p>
                      <p>Our platform tracks your questions across these cognitive levels, helping you build a strong mathematical foundation while progressively developing higher-order thinking skills. This ensures balanced mathematical growth from basic computation to advanced mathematical reasoning.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h4>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Section */}
              <div className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { topic: 'Limits and Continuity', Remembering: 15, Understanding: 25, Applying: 28, Analyzing: 18, Evaluating: 8, Creating: 4, Others: 2 },
                    { topic: 'Derivatives', Remembering: 5, Understanding: 8, Applying: 3, Analyzing: 1, Evaluating: 0, Creating: 0, Others: 0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="Remembering" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="Understanding" stackId="a" fill="#8b5cf6" />
                    <Bar dataKey="Applying" stackId="a" fill="#06b6d4" />
                    <Bar dataKey="Analyzing" stackId="a" fill="#10b981" />
                    <Bar dataKey="Evaluating" stackId="a" fill="#ef4444" />
                    <Bar dataKey="Creating" stackId="a" fill="#6366f1" />
                    <Bar dataKey="Others" stackId="a" fill="#9ca3af" />
                  </BarChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-3 justify-center">
                  {[
                    { name: 'Remembering', color: '#f59e0b' },
                    { name: 'Understanding', color: '#8b5cf6' },
                    { name: 'Applying', color: '#06b6d4' },
                    { name: 'Analyzing', color: '#10b981' },
                    { name: 'Evaluating', color: '#ef4444' },
                    { name: 'Creating', color: '#6366f1' },
                    { name: 'Others', color: '#9ca3af' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Insight Section */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Insight:
                </h5>
                <p className="text-sm text-purple-700 leading-relaxed">
                  Your questions are evolving well in <strong>Limits and Continuity</strong>, showing strong progression through Bloom's taxonomy levels. 
                  You're moving from basic remembering (15%) to higher-order thinking with applying (28%) and analyzing (18%).
                </p>
                <div className="mt-3 p-2 bg-purple-100 rounded border border-purple-300">
                  <p className="text-xs text-purple-600">
                    <strong>Next Goal:</strong> Continue practicing limits and continuity to reach evaluating and creating levels, then advance to Derivatives fundamentals.
                  </p>
                </div>
              </div>
            </div>
          </div>



          {/* Kolb's Learning Cycle Progress */}
          {learningPreference && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium flex items-center gap-2">
                  Learning Cycle Progress (Kolb's Model)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your engagement across the four phases of experiential learning</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h4>
                <Badge variant="outline" className="text-purple-700 border-purple-300">
                  {learningPreference}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {learningCycleData.map((phase, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-2">
                      <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-md flex items-center justify-center">
                        <span className="text-xl font-bold text-purple-600">{phase.engagement}%</span>
                      </div>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{phase.phase}</h5>
                    <p className="text-xs text-gray-500 mt-1">{phase.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Reflection Prompt:</strong> Which phase of the learning cycle felt most natural to you this week? 
                  Consider writing down one thing you'll try differently next week.
                </p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Bloom's Taxonomy Information Dialog */}
      <Dialog open={showBloomsTaxonomy} onOpenChange={setShowBloomsTaxonomy}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Understanding Bloom's Taxonomy in Mathematics</DialogTitle>
            <DialogDescription>
              Learn about the six levels of cognitive thinking in mathematics education and how they help you progress from basic recall to advanced problem-solving.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>Bloom's Taxonomy provides an elegant framework for understanding different levels of mathematical thinking and problem-solving. In mathematics education, this taxonomy helps students progress from basic recall to advanced mathematical reasoning and creation.</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">1. Remembering (Recall mathematical facts)</h4>
                <p className="mb-2">Basic recall of mathematical formulas, definitions, and procedures.</p>
                <p className="italic">Example: "What is the derivative of x²?" or "State the Pythagorean theorem."</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-600 mb-2">2. Understanding (Comprehend mathematical concepts)</h4>
                <p className="mb-2">Explaining mathematical concepts in your own words and interpreting mathematical notation.</p>
                <p className="italic">Example: "Explain what limits mean in calculus" or "Describe how integration relates to area under curves."</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-cyan-600 mb-2">3. Applying (Use mathematical procedures)</h4>
                <p className="mb-2">Using mathematical formulas and procedures to solve routine problems.</p>
                <p className="italic">Example: "Find the derivative of 3x³ + 2x - 1" or "Solve this system of linear equations."</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-600 mb-2">4. Analyzing (Break down mathematical problems)</h4>
                <p className="mb-2">Identifying patterns, relationships, and underlying mathematical structures.</p>
                <p className="italic">Example: "Compare different integration techniques for this function" or "Analyze why this series converges."</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-600 mb-2">5. Evaluating (Judge mathematical solutions)</h4>
                <p className="mb-2">Assessing the validity of mathematical arguments and choosing optimal solution methods.</p>
                <p className="italic">Example: "Evaluate which optimization method is most efficient" or "Critique this mathematical proof."</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-indigo-600 mb-2">6. Creating (Construct new mathematical solutions)</h4>
                <p className="mb-2">Developing original mathematical models, proofs, or solution strategies.</p>
                <p className="italic">Example: "Design a mathematical model for this real-world problem" or "Create an alternative proof for this theorem."</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">How This Helps Your Learning:</p>
              <p className="text-blue-700">Our platform tracks your questions across these cognitive levels, helping you build a strong mathematical foundation while progressively developing higher-order thinking skills. This ensures balanced mathematical growth from basic computation to advanced mathematical reasoning.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Flame, Trophy, Target, Clock, CheckCircle2, X, Star, RotateCcw, BarChart3, TrendingUp, Info, Search, ArrowUpDown, SlidersHorizontal, RotateCcw as Reset, TrendingDown, Users, ChevronDown, ChevronRight, ArrowLeft, Lightbulb, Rocket } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { fetchChallenges, fetchStats, fetchChallenge, type Challenge, type ChallengeStats } from '../../utils/challengesApi';
import { getUserFriendlyError, logError } from '@/utils/errorMessages';

interface DailyChallengesPageProps {
  onStartChallenge?: (challenge?: Challenge) => void;
}

// Helper function to render math content with KaTeX
const renderMathContent = (content: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Match display math ($$...$$) first, then inline math ($...$), then bold (**....**)
  const displayMathRegex = /\$\$([\s\S]*?)\$\$/g;
  const inlineMathRegex = /\$([^\$\n]+?)\$/g;
  const boldRegex = /\*\*([^\*]+?)\*\*/g;
  
  let displayMatches: any[] = [];
  let inlineMatches: any[] = [];
  let boldMatches: any[] = [];
  
  let displayMatch: RegExpExecArray | null;
  while ((displayMatch = displayMathRegex.exec(content)) !== null) {
    displayMatches.push({ 
      index: displayMatch.index, 
      length: displayMatch[0].length, 
      content: displayMatch[1],
      type: 'display'
    });
  }
  
  let inlineMatch: RegExpExecArray | null;
  while ((inlineMatch = inlineMathRegex.exec(content)) !== null) {
    const isPartOfDisplay = displayMatches.some(dm => 
      inlineMatch !== null && inlineMatch.index >= dm.index && 
      inlineMatch.index < dm.index + dm.length
    );
    if (!isPartOfDisplay) {
      inlineMatches.push({
        index: inlineMatch.index,
        length: inlineMatch[0].length,
        content: inlineMatch[1],
        type: 'inline'
      });
    }
  }

  let boldMatch: RegExpExecArray | null;
  while ((boldMatch = boldRegex.exec(content)) !== null) {
    const isPartOfMath = [...displayMatches, ...inlineMatches].some(m => 
      boldMatch !== null && boldMatch.index >= m.index && 
      boldMatch.index < m.index + m.length
    );
    if (!isPartOfMath) {
      boldMatches.push({
        index: boldMatch.index,
        length: boldMatch[0].length,
        content: boldMatch[1],
        type: 'bold'
      });
    }
  }
  
  const allMatches = [...displayMatches, ...inlineMatches, ...boldMatches].sort((a, b) => a.index - b.index);

  allMatches.forEach((match, idx) => {
    if (match.index > lastIndex) {
      const textBefore = content.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push(
          <span key={`text-${idx}`} className="whitespace-pre-wrap">
            {textBefore}
          </span>
        );
      }
    }

    try {
      if (match.type === 'display') {
        parts.push(
          <div key={`math-${idx}`} className="my-3 flex justify-center overflow-x-auto">
            <BlockMath math={match.content} />
          </div>
        );
      } else if (match.type === 'inline') {
        parts.push(
          <InlineMath key={`math-${idx}`} math={match.content} />
        );
      } else if (match.type === 'bold') {
        parts.push(
          <strong key={`bold-${idx}`} className="font-semibold">
            {match.content}
          </strong>
        );
      }
    } catch (e) {
      parts.push(
        <span key={`error-${idx}`} className="text-red-500 text-xs">
          [Rendering error]
        </span>
      );
    }

    lastIndex = match.index + match.length;
  });

  if (lastIndex < content.length) {
    const remaining = content.substring(lastIndex);
    if (remaining.trim()) {
      parts.push(
        <span key="text-end" className="whitespace-pre-wrap">
          {remaining}
        </span>
      );
    }
  }

  return parts.length > 0 ? parts : [<span key="empty" className="whitespace-pre-wrap">{content}</span>];
};


export default function DailyChallengesPage({ onStartChallenge }: DailyChallengesPageProps = {}) {
  const [selectedMonth, setSelectedMonth] = useState('All Time');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Bloom's taxonomy to Kolb's learning stage mapping
  const getKolbStage = (bloomLevel: string) => {
    switch (bloomLevel.toLowerCase()) {
      case 'remember':
      case 'understand':
        return { stage: 'Experience', icon: ArrowLeft, tooltip: 'Experience: Start with what you know - connect to real situations' };
      case 'apply':
      case 'analyze':
        return { stage: 'Reflect', icon: Search, tooltip: 'Reflect: Think about why this works or fails - compare different approaches' };
      case 'evaluate':
        return { stage: 'Conceptualize', icon: Lightbulb, tooltip: 'Conceptualize: Build the big picture - understand the principles behind it' };
      case 'create':
        return { stage: 'Experiment', icon: Rocket, tooltip: 'Experiment: Try something new - apply your understanding creatively' };
      default:
        return { stage: 'Experience', icon: ArrowLeft, tooltip: 'Experience: Start with what you know - connect to real situations' };
    }
  };

  // Dropdown state for collapsible sections (all open by default)
  const [streakActivityOpen, setStreakActivityOpen] = useState(true);
  const [performanceOverviewOpen, setPerformanceOverviewOpen] = useState(true);
  const [learningInsightsOpen, setLearningInsightsOpen] = useState(true);

  // State for challenges and stats from API
  const [challengeHistory, setChallengeHistory] = useState<Challenge[]>([]);
  const [progressStats, setProgressStats] = useState<ChallengeStats>({
    totalSolved: 0,
    totalAttempted: 0,
    attempting: 0,
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 },
    currentStreak: 0,
    longestStreak: 0,
    monthlyAttempts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get today's date string in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Helper function to filter challenges up to today's date
  const filterChallengesUpToToday = (challenges: Challenge[]) => {
    const todayStr = getTodayString();
    return challenges.filter(challenge => challenge.date <= todayStr);
  };

  // Helper function to calculate statistics from filtered challenges
  const calculateStatsFromChallenges = (challenges: Challenge[]): ChallengeStats => {
    const todayStr = getTodayString();
    const filteredChallenges = challenges.filter(ch => ch.date <= todayStr);
    
    // Calculate totals
    const totalAttempted = filteredChallenges.length;
    const completedChallenges = filteredChallenges.filter(ch => ch.status === 'completed');
    const totalSolved = completedChallenges.length;
    const attempting = filteredChallenges.filter(ch => ch.status === 'pending').length;
    
    // Calculate by difficulty
    const easy = {
      total: filteredChallenges.filter(ch => ch.difficulty === 'Easy').length,
      solved: completedChallenges.filter(ch => ch.difficulty === 'Easy').length
    };
    const medium = {
      total: filteredChallenges.filter(ch => ch.difficulty === 'Medium').length,
      solved: completedChallenges.filter(ch => ch.difficulty === 'Medium').length
    };
    const hard = {
      total: filteredChallenges.filter(ch => ch.difficulty === 'Hard').length,
      solved: completedChallenges.filter(ch => ch.difficulty === 'Hard').length
    };
    
    // Calculate current streak (consecutive completed days ending today or yesterday)
    const completedDates = new Set(
      completedChallenges.map(ch => ch.date)
    );
    
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    // Start checking from today and go backwards
    while (true) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (completedDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (currentStreak === 0 && checkDate.getTime() === today.getTime()) {
        // If today's challenge isn't completed yet, start from yesterday
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    const sortedDates = Array.from(completedDates).sort();
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;
    
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      if (prevDate) {
        const diffDays = Math.round((date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      prevDate = date;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Calculate monthly attempts (challenges attempted in current month)
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthlyAttempts = filteredChallenges.filter(ch => {
      const chDate = new Date(ch.date);
      return chDate.getMonth() === currentMonth && 
             chDate.getFullYear() === currentYear &&
             ch.status === 'completed';
    }).length;
    
    return {
      totalSolved,
      totalAttempted,
      attempting,
      easy,
      medium,
      hard,
      currentStreak,
      longestStreak,
      monthlyAttempts
    };
  };

  // Fetch challenges and stats on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all challenges from database
        const challengesData = await fetchChallenges({ limit: 1000 });
        
        // Filter challenges to only show up to current date
        const filteredChallenges = filterChallengesUpToToday(challengesData.challenges);
        setChallengeHistory(filteredChallenges);
        
        // Calculate stats based on filtered challenges (up to today only)
        const calculatedStats = calculateStatsFromChallenges(challengesData.challenges);
        setProgressStats(calculatedStats);
      } catch (err) {
        console.error('Error loading challenges:', err);
        setError(err instanceof Error ? err.message : 'Failed to load challenges');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Extract streak stats from progressStats
  const currentStreak = progressStats.currentStreak;
  const longestStreak = progressStats.longestStreak;
  const monthlyAttempts = progressStats.monthlyAttempts;

  // Legacy hardcoded data removed - now using API
  // Challenges are loaded from the database via API in useEffect above

  const validAcceptanceRates = challengeHistory
    .map(ch => ch.acceptanceRate)
    .filter(rate => typeof rate === 'number' && rate !== null);

  const averageAccuracy = validAcceptanceRates.length
    ? Math.round(validAcceptanceRates.reduce((sum, rate) => sum + rate, 0) / validAcceptanceRates.length)
    : 0;

  // Helper function to ensure all challenges have attempts arrays
  // Also fetch full challenge details if needed
  const processedChallengeHistory = challengeHistory.map(challenge => {
    // If challenge has attempts, use them; otherwise create a single attempt from current data
    if (challenge.attempts && challenge.attempts.length > 0) {
      return {
        ...challenge,
        attempts: challenge.attempts
      };
    } else if (challenge.status === 'completed' && challenge.score !== null) {
      return {
        ...challenge,
        attempts: [
          { 
            attemptNumber: 1, 
            score: challenge.score, 
            date: challenge.date, 
            timeSpent: challenge.timeSpent || '0 minutes'
          }
        ]
      };
    } else {
      return {
        ...challenge,
        attempts: []
      };
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFilteredChallenges = () => {
    let filtered = processedChallengeHistory.filter(challenge => {
      const monthMatch = selectedMonth === 'All Time' || 
        (selectedMonth === 'February 2026' && challenge.date.startsWith('2026-02')) ||
        (selectedMonth === 'January 2026' && challenge.date.startsWith('2026-01'));
      
      const topicMatch = selectedTopic === 'All Topics' || challenge.category === selectedTopic;
      
      const difficultyMatch = selectedDifficulty === 'All Levels' || challenge.difficulty === selectedDifficulty;
      
      const statusMatch = selectedStatus === 'All Status' || challenge.status === selectedStatus;
      
      const searchMatch = searchQuery === '' || 
        challenge.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return monthMatch && topicMatch && difficultyMatch && statusMatch && searchMatch;
    });

    // Sort the filtered results
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime(); // Latest first
        case 'topic':
          return a.category.localeCompare(b.category);
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
                 (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  };

  const getCurrentPageChallenges = () => {
    const filteredChallenges = getFilteredChallenges();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredChallenges.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filteredChallenges = getFilteredChallenges();
    return Math.ceil(filteredChallenges.length / itemsPerPage);
  };

  const resetFilters = () => {
    setSelectedMonth('All Time');
    setSelectedTopic('All Topics');
    setSelectedDifficulty('All Levels');
    setSelectedStatus('All Status');
    setSearchQuery('');
    setSortBy('date');
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedTopic, selectedDifficulty, selectedStatus, searchQuery, sortBy]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading challenges...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Header with Info Icon */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-semibold text-gray-900">Daily Challenges</h1>
          <Popover open={showInfoPopup} onOpenChange={setShowInfoPopup}>
            <PopoverTrigger asChild>
              <div
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 cursor-pointer flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowInfoPopup(!showInfoPopup);
                  }
                }}
              >
                <Info className="h-4 w-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">How Daily Challenges Work</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Our intelligent system adapts to your learning progress, starting with easy questions to build confidence. 
                  As you demonstrate mastery, challenges gradually increase in difficulty to medium and hard levels.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  If you struggle with a concept, the system provides similar easy questions to ensure you fully grasp the fundamentals before advancing.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The ⭐ <strong>acceptance rate</strong> shows the percentage of all students who successfully completed each challenge, 
                  helping you gauge question difficulty and your performance relative to peers.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-sm text-gray-500">Active Learning Analytics: Build consistency and see how your responses improve over time</p>
      </div>

      {/* Progress Section - Reorganized Layout with Collapsible Sections */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Streak & Activity Section */}
          <Collapsible open={streakActivityOpen} onOpenChange={setStreakActivityOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-gray-50">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Streak & Activity</h3>
                {streakActivityOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-800 text-sm">Current Streak</span>
                    </div>
                    <div className="text-lg opacity-50">🔥</div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-orange-900">{currentStreak}</span>
                    <span className="text-xs ml-1 text-orange-700">days</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 text-sm">Personal Best</span>
                    </div>
                    <div className="text-lg opacity-50">🏆</div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-yellow-900">{longestStreak}</span>
                    <span className="text-xs ml-1 text-yellow-700">days</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800 text-sm">This Month</span>
                    </div>
                    <div className="text-lg opacity-50">📈</div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-blue-900">{monthlyAttempts}</span>
                    <span className="text-xs ml-1 text-blue-700">challenges</span>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Separator */}
          <div className="border-t border-gray-100"></div>

          {/* Performance Overview Section */}
          <Collapsible open={performanceOverviewOpen} onOpenChange={setPerformanceOverviewOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-gray-50">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Performance Overview</h3>
                {performanceOverviewOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Circular Progress */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-3">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="45" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="6"
                        strokeDasharray={`${(progressStats.totalSolved / progressStats.totalAttempted) * 283} 283`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{progressStats.totalSolved}</span>
                      <span className="text-xs text-gray-500">/{progressStats.totalAttempted}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-gray-500">Solved</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-500">{progressStats.attempting} Attempting</span>
                  </div>
                </div>
                
                {/* Right: Difficulty Breakdown */}
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-600 font-medium text-sm">Easy</span>
                      <span className="text-gray-900 font-bold">{progressStats.easy.solved}/{progressStats.easy.total}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-medium text-sm">Medium</span>
                      <span className="text-gray-900 font-bold">{progressStats.medium.solved}/{progressStats.medium.total}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-medium text-sm">Hard</span>
                      <span className="text-gray-900 font-bold">{progressStats.hard.solved}/{progressStats.hard.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Separator */}
          <div className="border-t border-gray-100"></div>

          {/* Learning Analytics Insights Section */}
          <Collapsible open={learningInsightsOpen} onOpenChange={setLearningInsightsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-gray-50">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Learning Analytics Insights</h3>
                {learningInsightsOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h4 className="font-medium text-blue-900 mb-2">Performance Trends</h4>
                  <p className="text-sm text-blue-700">
                    Your average score has improved by <span className="font-semibold">12%</span> over the last 2 weeks through consistent practice.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <h4 className="font-medium text-purple-900 mb-2">Learning Patterns</h4>
                  <p className="text-sm text-purple-700">
                    You excel at <span className="font-semibold">Integration</span> topics but could benefit from more practice with <span className="font-semibold">Complex Numbers</span>.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <h4 className="font-medium text-green-900 mb-2">Improvement Feedback</h4>
                  <p className="text-sm text-green-700">
                    Redoing challenges shows <span className="font-semibold">23% better explanations</span> and deeper understanding development.
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Challenge History with Sort and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Challenge History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Control Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort and Filter Controls */}
            <div className="flex gap-2">
              {/* Sort Dropdown */}
              <Popover open={showSortMenu} onOpenChange={setShowSortMenu}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sort by</h4>
                    <div className="space-y-1">
                      {[
                        { value: 'date', label: 'Date (Latest first)' },
                        { value: 'topic', label: 'Topic' },
                        { value: 'difficulty', label: 'Difficulty' }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={sortBy === option.value ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm"
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortMenu(false);
                          }}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Filter Dropdown */}
              <Popover open={showFilterMenu} onOpenChange={setShowFilterMenu}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filter challenges</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700"
                        onClick={resetFilters}
                      >
                        <Reset className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                    </div>
                    
                    {/* Time Period Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time Period</label>
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Time">All Time</SelectItem>
                          <SelectItem value="February 2026">February 2026</SelectItem>
                          <SelectItem value="January 2026">January 2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Status">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Difficulty Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Levels">All Levels</SelectItem>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Topic Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Topics</label>
                      <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Topics">All Topics</SelectItem>
                          <SelectItem value="Derivatives">Derivatives</SelectItem>
                          <SelectItem value="Integration">Integration</SelectItem>
                          <SelectItem value="Limits">Limits</SelectItem>
                          <SelectItem value="Complex Numbers">Complex Numbers</SelectItem>
                          <SelectItem value="Applications">Applications</SelectItem>
                          <SelectItem value="Vectors">Vectors</SelectItem>
                          <SelectItem value="Matrices">Matrices</SelectItem>
                          <SelectItem value="Calculus">Calculus</SelectItem>
                          <SelectItem value="Statistics">Statistics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Challenge List */}
          <div className="space-y-3">
            {getCurrentPageChallenges().map((challenge, index) => {
              const isCompleted = challenge.status === 'completed';
              const formatDate = (dateString: string) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                });
              };
              
              return (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  
                  {/* Challenge Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 leading-snug break-words flex-1">
                            {challenge.question}
                          </h3>
                          {isCompleted && challenge.score !== null && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`font-semibold ${getScoreColor(challenge.score)}`}>
                                {challenge.score}%
                              </span>
                              {challenge.attempts && challenge.attempts.length > 1 && (
                                <div className="flex items-center gap-1">
                                  {(() => {
                                    const firstScore = challenge.attempts[0]?.score ?? 0;
                                    const lastScore = challenge.attempts[challenge.attempts.length - 1]?.score ?? 0;
                                    const improvement = lastScore - firstScore;
                                    
                                    if (improvement > 0) {
                                      return (
                                        <div className="flex items-center gap-1 text-green-600">
                                          <TrendingUp className="h-3 w-3" />
                                          <span className="text-xs font-medium">+{improvement}%</span>
                                        </div>
                                      );
                                    } else if (improvement < 0) {
                                      return (
                                        <div className="flex items-center gap-1 text-orange-500">
                                          <TrendingDown className="h-3 w-3" />
                                          <span className="text-xs font-medium">{improvement}%</span>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-gray-500">
                          <span>{formatDate(challenge.date)}</span>
                          <span>•</span>
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                            {challenge.category}
                          </Badge>
                          <span>•</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}
                          >
                            {challenge.difficulty}
                          </Badge>
                          {challenge.bloomLevel && (
                            <>
                              <span>•</span>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                {challenge.bloomLevel}
                              </Badge>
                            </>
                          )}
                          {challenge.bloomLevel && (
                            <>
                              <span>•</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs cursor-help">
                                    {getKolbStage(challenge.bloomLevel).stage}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-64">
                                  <p className="text-sm">{getKolbStage(challenge.bloomLevel).tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </>
                          )}
                          {challenge.attempts && challenge.attempts.length > 1 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <RotateCcw className="h-3 w-3 text-purple-500" />
                                <span className="text-purple-600 font-medium">
                                  {challenge.attempts.length} attempts
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              try {
                                // Fetch full challenge details with all attempts
                                const fullChallenge = await fetchChallenge(challenge.id);
                                setSelectedChallenge(fullChallenge);
                                setShowAnswerModal(true);
                              } catch (err) {
                                const errorMsg = getUserFriendlyError(err as Error);
                                logError(err as Error, 'DailyChallenges - View Challenge');
                                // Fallback to current challenge data
                                setSelectedChallenge(challenge);
                                setShowAnswerModal(true);
                              }
                            }}
                          >
                            View
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={async () => {
                              try {
                                // Fetch full challenge details including ground truth
                                const fullChallenge = await fetchChallenge(challenge.id);
                                onStartChallenge?.(fullChallenge);
                              } catch (err) {
                                const errorMsg = getUserFriendlyError(err as Error);
                                logError(err as Error, 'DailyChallenges - Start Challenge');
                                // Fallback to current challenge data
                                onStartChallenge?.(challenge);
                              }
                            }}
                          >
                            Start Challenge
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {getTotalPages() > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>

                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => {
                    const shouldShow =
                      page === 1 ||
                      page === getTotalPages() ||
                      Math.abs(page - currentPage) <= 1;

                    if (!shouldShow) {
                      if (page === 2 && currentPage > 4) {
                        return (
                          <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      if (page === getTotalPages() - 1 && currentPage < getTotalPages() - 3) {
                        return (
                          <PaginationItem key="ellipsis-end">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                      className={currentPage === getTotalPages() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, getFilteredChallenges().length)} to{' '}
            {Math.min(currentPage * itemsPerPage, getFilteredChallenges().length)} of{' '}
            {getFilteredChallenges().length} challenges
          </div>
        </CardContent>
      </Card>

      {/* Updated Answer Modal */}
      {showAnswerModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Your Answer</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAnswerModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedChallenge.date}
                </Badge>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                  {selectedChallenge.category}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getDifficultyColor(selectedChallenge.difficulty)}`}
                >
                  {selectedChallenge.difficulty}
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                  {selectedChallenge.bloomLevel}
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                  {getKolbStage(selectedChallenge.bloomLevel).stage}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Challenge Question:</h4>
                <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedChallenge.question}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Your Response:</h4>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="text-gray-800 leading-relaxed">
                    {selectedChallenge.answer ? renderMathContent(selectedChallenge.answer) : 'No answer provided'}
                  </div>
                </div>
              </div>

              {/* Retry Statistics */}
              {selectedChallenge.attempts && selectedChallenge.attempts.length > 1 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Learning Progress Analytics</h4>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <RotateCcw className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">
                        Attempted {selectedChallenge.attempts.length} time{selectedChallenge.attempts.length > 1 ? 's' : ''} - Shows dedication to improvement!
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {selectedChallenge.attempts.map((attempt: any, index: number) => {
                        const isImprovement = index > 0 && attempt.score > selectedChallenge.attempts[index - 1].score;
                        const isDecline = index > 0 && attempt.score < selectedChallenge.attempts[index - 1].score;
                        
                        return (
                          <div key={index} className="flex items-center justify-between bg-white rounded p-3 border border-purple-100">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-gray-700">
                                  Attempt {attempt.attemptNumber}:
                                </span>
                                <span className={`font-semibold ${getScoreColor(attempt.score)}`}>
                                  {attempt.score}%
                                </span>
                                {index > 0 && (
                                  <div className="flex items-center gap-1 ml-2">
                                    {isImprovement && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <TrendingUp className="h-3 w-3" />
                                        <span className="text-xs font-medium">
                                          +{attempt.score - selectedChallenge.attempts[index - 1].score}%
                                        </span>
                                      </div>
                                    )}
                                    {isDecline && (
                                      <div className="flex items-center gap-1 text-orange-500">
                                        <TrendingDown className="h-3 w-3" />
                                        <span className="text-xs font-medium">
                                          {attempt.score - selectedChallenge.attempts[index - 1].score}%
                                        </span>
                                      </div>
                                    )}
                                    {!isImprovement && !isDecline && (
                                      <div className="flex items-center gap-1 text-gray-500">
                                        <span className="text-xs">Same score</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {attempt.timeSpent}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Improvement Summary */}
                    {selectedChallenge.attempts.length > 1 && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Overall Improvement: +
                            {selectedChallenge.attempts[selectedChallenge.attempts.length - 1].score - selectedChallenge.attempts[0].score}% 
                            from first to final attempt
                          </span>
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          Redoing challenges demonstrates active learning and leads to better understanding!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    Completed in {selectedChallenge.timeSpent}
                  </span>
                  <span className={`flex items-center gap-1 font-semibold ${getScoreColor(selectedChallenge.score)}`}>
                    <Star className="h-4 w-4" />
                    Score: {selectedChallenge.score}%
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Users className="h-4 w-4 text-blue-500" />
                    Acceptance Rate: {selectedChallenge.acceptanceRate}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowAnswerModal(false)}>
                    Close
                  </Button>
                  <Button onClick={async () => {
                    setShowAnswerModal(false);
                    if (onStartChallenge && selectedChallenge) {
                      try {
                        // Fetch fresh challenge data including ground truth
                        const fullChallenge = await fetchChallenge(selectedChallenge.id);
                        onStartChallenge(fullChallenge);
                      } catch (err) {
                        const errorMsg = getUserFriendlyError(err as Error);
                        logError(err as Error, 'DailyChallenges - Redo Challenge');
                        // Fallback to selected challenge data
                        onStartChallenge(selectedChallenge);
                      }
                    }
                  }}>
                    Redo Challenge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </TooltipProvider>
  );
}
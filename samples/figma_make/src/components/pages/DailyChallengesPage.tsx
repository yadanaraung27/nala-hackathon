import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Calendar, Flame, Trophy, Target, Clock, CheckCircle2, X, Star, BarChart3 } from 'lucide-react';

export default function DailyChallengesPage() {
  const [selectedMonth, setSelectedMonth] = useState('December 2024');
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);

  // Mock data for streaks and statistics
  const currentStreak = 7;
  const longestStreak = 23;
  const monthlyAttempts = 18;
  const totalChallenges = 45;

  // Mock data for challenge history
  const challengeHistory = [
    {
      date: '2024-12-08',
      category: 'Data Structures',
      difficulty: 'Medium',
      question: "Imagine you're explaining binary search trees to a study group. How would you describe the insertion process step-by-step, and what questions might your classmates ask that you should be prepared to answer?",
      status: 'completed',
      score: 85,
      timeSpent: '4 minutes',
      answer: "To explain BST insertion: 1) Start at root, 2) Compare new value with current node, 3) Go left if smaller, right if larger, 4) Repeat until finding empty spot, 5) Insert new node. Common questions: What about duplicates? How does it maintain order? What's the time complexity? How does it compare to arrays?"
    },
    {
      date: '2024-12-07',
      category: 'Algorithms',
      difficulty: 'Hard',
      question: "Design an algorithm to find the shortest path between two nodes in a weighted graph with both positive and negative edge weights.",
      status: 'completed',
      score: 92,
      timeSpent: '7 minutes',
      answer: "Use Bellman-Ford algorithm since we have negative weights. Unlike Dijkstra's, it can handle negative edges and detect negative cycles. Process: 1) Initialize distances, 2) Relax all edges V-1 times, 3) Check for negative cycles. Time complexity: O(VE)."
    },
    {
      date: '2024-12-06',
      category: 'Database Systems',
      difficulty: 'Easy',
      question: "Explain the ACID properties in database transactions with real-world examples.",
      status: 'completed',
      score: 78,
      timeSpent: '3 minutes',
      answer: "ACID ensures reliable database transactions: Atomicity (all or nothing - bank transfer), Consistency (data integrity rules maintained), Isolation (concurrent transactions don't interfere), Durability (committed changes survive system failures)."
    },
    {
      date: '2024-12-05',
      category: 'Web Development',
      difficulty: 'Medium',
      question: "What are the key differences between REST and GraphQL APIs, and when would you choose one over the other?",
      status: 'completed',
      score: 88,
      timeSpent: '5 minutes',
      answer: "REST uses multiple endpoints, standard HTTP methods, simpler caching. GraphQL uses single endpoint, client defines data needs, reduces over-fetching. Choose REST for simple CRUD, established patterns. Choose GraphQL for complex data requirements, mobile apps needing efficient data transfer."
    },
    {
      date: '2024-12-04',
      category: 'Machine Learning',
      difficulty: 'Hard',
      question: "Explain overfitting in machine learning and describe three techniques to prevent it.",
      status: 'completed',
      score: 76,
      timeSpent: '6 minutes',
      answer: "Overfitting occurs when model memorizes training data but fails on new data. Prevention: 1) Cross-validation to assess generalization, 2) Regularization (L1/L2) to penalize complexity, 3) Early stopping to halt training before overfitting occurs."
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-gray-900">Daily Challenges</h1>
        <p className="text-sm text-gray-500 mt-1">Track your daily learning progress and streaks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Current Streak */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-700">Current Streak</h3>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">{currentStreak}</span>
              <span className="text-lg text-gray-600 ml-2">days</span>
            </div>
            <p className="text-orange-600 text-sm font-medium">🔥 Keep it going!</p>
            <div className="absolute top-4 right-4 text-4xl opacity-20">🔥</div>
          </CardContent>
        </Card>

        {/* Longest Streak */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-700">Longest Streak</h3>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">{longestStreak}</span>
              <span className="text-lg text-gray-600 ml-2">days</span>
            </div>
            <p className="text-yellow-600 text-sm font-medium">🏆 Personal best!</p>
            <div className="absolute top-4 right-4 text-4xl opacity-20">🏆</div>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-700">This Month</h3>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">{monthlyAttempts}</span>
              <span className="text-lg text-gray-600 ml-2">challenges</span>
            </div>
            <p className="text-blue-600 text-sm font-medium">📅 Great progress!</p>
            <div className="absolute top-4 right-4 text-4xl opacity-20">📅</div>
          </CardContent>
        </Card>

        {/* Total Completed */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-700">Total Completed</h3>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">{totalChallenges}</span>
              <span className="text-lg text-gray-600 ml-2">challenges</span>
            </div>
            <p className="text-green-600 text-sm font-medium">✅ Well done!</p>
            <div className="absolute top-4 right-4 text-4xl opacity-20">✅</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Challenge Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-blue-600">84%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600">96%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Avg Time</p>
              <p className="text-3xl font-bold text-purple-600">5.2min</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Challenge History
            </CardTitle>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1 text-sm border rounded-md bg-white"
            >
              <option>December 2024</option>
              <option>November 2024</option>
              <option>October 2024</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challengeHistory.map((challenge, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {challenge.date}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {challenge.category}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}
                      >
                        {challenge.difficulty}
                      </Badge>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed mb-2">
                      {challenge.question}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {challenge.timeSpent}
                      </span>
                      <span className={`flex items-center gap-1 font-medium ${getScoreColor(challenge.score)}`}>
                        <Star className="h-3 w-3" />
                        {challenge.score}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedChallenge(challenge);
                      setShowAnswerModal(true);
                    }}
                  >
                    View My Answer
                  </Button>
                  <Button size="sm" variant="outline">
                    Retake Challenge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Answer Modal */}
      {showAnswerModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Answer</CardTitle>
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
                <Badge variant="outline" className="text-xs">
                  {selectedChallenge.category}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getDifficultyColor(selectedChallenge.difficulty)}`}
                >
                  {selectedChallenge.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedChallenge.question}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Your Answer:</h4>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {selectedChallenge.answer}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedChallenge.timeSpent}
                  </span>
                  <span className={`flex items-center gap-1 font-medium ${getScoreColor(selectedChallenge.score)}`}>
                    <Star className="h-3 w-3" />
                    Score: {selectedChallenge.score}%
                  </span>
                </div>
                <Button onClick={() => setShowAnswerModal(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
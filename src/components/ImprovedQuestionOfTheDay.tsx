import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Flame, Trophy, Users, Clock, CheckCircle2, Star, Zap, Target } from 'lucide-react';

interface ImprovedQuestionOfTheDayProps {
  learningStyle?: string | null;
  onStartChallenge?: () => void;
}

export default function ImprovedQuestionOfTheDay({ learningStyle, onStartChallenge }: ImprovedQuestionOfTheDayProps) {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [hasAnsweredToday, setHasAnsweredToday] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Mock data - would come from backend
  const todaysQuestion = {
    id: 'q_2024_01_15',
    category: 'Derivatives',
    difficulty: 'Medium',
    questionType: 'Understand',
    question: "Imagine you're explaining the chain rule to a study group. How would you describe when and why we use it for composite functions, and what common mistakes should your classmates avoid?",
    hint: "Think about identifying outer and inner functions and common differentiation errors...",
    estimatedTime: "3-5 min",
    participantCount: 342,
    correctAnswers: 287
  };

  const streakMilestones = [
    { days: 3, reward: "🎯 Focus Badge", unlocked: true },
    { days: 7, reward: "🔥 Week Warrior", unlocked: true },
    { days: 14, reward: "⚡ Learning Lightning", unlocked: false },
    { days: 30, reward: "🏆 Month Master", unlocked: false }
  ];

  const nextMilestone = streakMilestones.find(m => !m.unlocked);
  const progressToNext = nextMilestone ? (currentStreak / nextMilestone.days) * 100 : 100;

  const handleStartChallenge = () => {
    onStartChallenge?.();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Daily Challenge
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Streak Card - Original Design */}
        <Card className="lg:col-span-1 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6 relative">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-orange-700 font-semibold">Current Streak</h3>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{currentStreak}</span>
                <span className="text-lg text-gray-600 ml-2">days</span>
              </div>
              <div className="space-y-2">
                {!hasAnsweredToday ? (
                  <p className="text-green-600 font-medium text-sm mb-1">🎯 Today's question is ready!</p>
                ) : (
                  <p className="text-green-600 font-medium text-sm mb-1">✅ Challenge completed!</p>
                )}
                <p className="text-gray-600 text-sm">Keep your daily challenge streak alive!</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(progressToNext, 100)}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {nextMilestone ? `${nextMilestone.days - currentStreak} more for milestone!` : 'Milestone reached!'}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 bottom-4 flex items-center justify-center w-1/2 text-8xl opacity-20">
              🔥
            </div>
          </CardContent>
        </Card>

        {/* Today's Question Card */}
        <Card className="lg:col-span-2 border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-gray-900">Today's Question</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {todaysQuestion.category}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      todaysQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      todaysQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {todaysQuestion.difficulty}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      todaysQuestion.questionType === 'Definition' ? 'bg-blue-100 text-blue-800' :
                      todaysQuestion.questionType === 'Understand' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {todaysQuestion.questionType}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {todaysQuestion.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {todaysQuestion.participantCount} attempted
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <Star className="h-3 w-3" />
                    {Math.round((todaysQuestion.correctAnswers / todaysQuestion.participantCount) * 100)}% success rate
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question */}
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-gray-800 leading-relaxed">
                  {todaysQuestion.question}
                </p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!hasAnsweredToday ? (
                <Button 
                  onClick={handleStartChallenge}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Start Challenge
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    {showAnswer ? 'Hide' : 'View'} Solution
                  </Button>
                  <Button 
                    variant="outline"
                    className="sm:w-auto"
                  >
                    Share Result
                  </Button>
                </div>
              )}
            </div>

            {/* Success message after completion */}
            {hasAnsweredToday && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Great job! 🎉</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  You've successfully completed today's challenge and maintained your {currentStreak}-day streak!
                </p>
              </div>
            )}


          </CardContent>
        </Card>
      </div>


    </div>
  );
}
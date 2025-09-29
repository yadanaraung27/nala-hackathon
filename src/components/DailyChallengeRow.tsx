import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Users, Star, Video, PenTool, AlertCircle, BookOpen } from 'lucide-react';
import { getCurrentAcademicWeek, getWeeklyContent } from '../utils/academicWeek';

interface DailyChallengeRowProps {
  onStartChallenge?: () => void;
  onNavigateToCourse?: () => void;
}

export default function DailyChallengeRow({ onStartChallenge, onNavigateToCourse }: DailyChallengeRowProps) {
  const [currentWeek, setCurrentWeek] = useState<any>(null);
  const [weeklyContent, setWeeklyContent] = useState<any>(null);
  const [currentStreak] = useState(7);

  useEffect(() => {
    const week = getCurrentAcademicWeek();
    setCurrentWeek(week);
    
    if (week && week.weekNumber) {
      const content = getWeeklyContent(week.weekNumber);
      setWeeklyContent(content);
    }
  }, []);

  // Mock today's question data
  const todaysQuestion = {
    category: 'Derivatives',
    difficulty: 'Medium',
    questionType: 'Understand',
    question: "Imagine you're explaining the chain rule to a study group. How would you describe when and why we use it for composite functions, and what common mistakes should your classmates avoid?",
    estimatedTime: "3-5 min",
    participantCount: 342,
    correctAnswers: 287
  };

  const successRate = Math.round((todaysQuestion.correctAnswers / todaysQuestion.participantCount) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
      {/* Daily Challenge Section - 50% width (4/8 columns) - Distinguished styling */}
      <div className="lg:col-span-4">
        <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
              Daily Challenge 
              <span className="text-lg flex items-center">🔥{currentStreak}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Today's Question Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-blue-900">Today's Question</h3>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-sm bg-blue-100 text-blue-700 border-blue-300">
                  {todaysQuestion.category}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-sm ${
                    todaysQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700 border-green-300' :
                    todaysQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                    'bg-red-100 text-red-700 border-red-300'
                  }`}
                >
                  {todaysQuestion.difficulty}
                </Badge>
                <Badge variant="outline" className="text-sm bg-purple-100 text-purple-700 border-purple-300">
                  Understand
                </Badge>
              </div>
            </div>

            {/* Question Stats */}
            <div className="flex items-center gap-4 text-sm text-blue-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {todaysQuestion.estimatedTime}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {todaysQuestion.participantCount} attempted
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <Star className="h-4 w-4" />
                {successRate}% success rate
              </div>
            </div>

            {/* Question Text - Compact */}
            <div className="bg-white border-l-4 border-blue-400 p-3 rounded-r-lg shadow-sm">
              <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
                {todaysQuestion.question}
              </p>
            </div>

            {/* Start Challenge Button */}
            <Button 
              onClick={onStartChallenge}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-base shadow-md"
              size="default"
            >
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines - 25% width (2/8 columns) - Course related */}
      <div className="lg:col-span-2">
        <Card className="h-full bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
          <CardHeader className="pb-2 bg-gradient-to-r from-gray-100 to-slate-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-700">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Compact deadline items */}
            <div className="space-y-2">
              <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-400">
                <p className="text-sm font-medium text-gray-900">Midterm Exam</p>
                <p className="text-sm text-gray-500">Oct 11, 2025</p>
              </div>
              <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                <p className="text-sm font-medium text-gray-900">Take-home Test</p>
                <p className="text-sm text-red-600 font-medium">Nov 11, 2025</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full text-sm h-9 mt-3 border-gray-300 hover:bg-gray-100" onClick={onNavigateToCourse}>
              View All Deadlines
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* This Week's Content - 25% width (2/8 columns) - Course related */}
      <div className="lg:col-span-2">
        <Card className="h-full bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
          <CardHeader className="pb-2 bg-gradient-to-r from-gray-100 to-slate-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-700">
              <BookOpen className="h-5 w-5 text-green-600" />
              This Week's Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Lectures */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Lectures</span>
              </div>
              <div className="pl-6 space-y-1">
                <p className="text-sm text-gray-600">Lecture 7a: Applications of Derivatives</p>
                <p className="text-sm text-gray-600">Lecture 7b: Optimization Problems</p>
              </div>
            </div>

            {/* Tutorials */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Tutorials</span>
              </div>
              <div className="pl-6 space-y-1">
                <p className="text-sm text-gray-600">Tutorial 6b: L'Hopital's Rule</p>
                <p className="text-sm text-gray-600">Tutorial 7a: Curve Sketching</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
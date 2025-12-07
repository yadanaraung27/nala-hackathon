import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Flame, Brain, Trophy, Calendar, MessageCircle, Lightbulb, Target, Star, ChevronRight } from 'lucide-react';

interface QOTDQuestion {
  id: string;
  question: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bloomsLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  learningStyle: 'interactor' | 'architect' | 'problemSolver' | 'adventurer' | 'general';
  hint?: string;
  relatedTopics: string[];
}

const qotdQuestions: QOTDQuestion[] = [
  {
    id: '1',
    question: "Imagine you're explaining the chain rule to a study group. How would you describe when and why we use it for composite functions, and what common mistakes should your classmates avoid?",
    topic: "Derivatives - Chain Rule",
    difficulty: "Medium",
    bloomsLevel: "Understand",
    learningStyle: "interactor",
    hint: "Think about the common misconceptions students have about identifying composite functions",
    relatedTopics: ["Calculus", "Composite Functions", "Differentiation Rules"]
  },
  {
    id: '2',
    question: "Design a comprehensive study plan for mastering integration techniques. Create a structured outline with learning objectives, practice problems, and self-assessment checkpoints. Include time estimates for each method.",
    topic: "Integration Methods",
    difficulty: "Medium",
    bloomsLevel: "Create",
    learningStyle: "architect",
    hint: "Consider different techniques: substitution, parts, partial fractions, trigonometric substitution",
    relatedTopics: ["Study Planning", "Integration Techniques", "Calculus Mastery"]
  },
  {
    id: '3',
    question: "You're solving an optimization problem where you need to minimize the cost of materials for a cylindrical container. Walk through your process: Set up the constraint, find the objective function, and solve step-by-step.",
    topic: "Optimization Problems",
    difficulty: "Hard",
    bloomsLevel: "Apply",
    learningStyle: "problemSolver",
    hint: "Focus on translating real-world constraints into mathematical expressions",
    relatedTopics: ["Applications of Derivatives", "Optimization", "Problem Solving"]
  },
  {
    id: '4',
    question: "Design a hands-on group activity to teach complex number operations. Create a collaborative exercise that involves visual or interactive elements where team members can learn polar and rectangular forms together. What materials would you need?",
    topic: "Complex Numbers",
    difficulty: "Medium",
    bloomsLevel: "Create",
    learningStyle: "adventurer",
    hint: "Think about visual representations and group participation elements",
    relatedTopics: ["Interactive Learning", "Complex Plane", "Team Activities"]
  },
  {
    id: '5',
    question: "Compare and contrast different integration methods (substitution, integration by parts, partial fractions). Create a comprehensive analysis including when to use each method and their relative difficulty levels.",
    topic: "Integration Analysis",
    difficulty: "Hard",
    bloomsLevel: "Analyze",
    learningStyle: "architect",
    hint: "Structure your analysis in a clear, systematic format with examples",
    relatedTopics: ["Integration Techniques", "Method Selection", "Calculus Strategy"]
  },
  {
    id: '6',
    question: "You're working on a team project to model real-world phenomena using calculus. Describe how you would organize the team, delegate mathematical tasks, and ensure everyone contributes to the modeling process.",
    topic: "Applied Mathematics",
    difficulty: "Medium",
    bloomsLevel: "Apply",
    learningStyle: "adventurer",
    hint: "Consider different mathematical modeling approaches and collaborative problem-solving",
    relatedTopics: ["Mathematical Modeling", "Team Collaboration", "Applied Calculus"]
  }
];

interface QuestionOfTheDayProps {
  learningStyle?: string;
  currentDate?: string;
}

export default function QuestionOfTheDay({ learningStyle, currentDate }: QuestionOfTheDayProps) {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [longestStreak, setLongestStreak] = useState(12);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [todaysQuestion, setTodaysQuestion] = useState<QOTDQuestion | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Helper function to get today's date string
  const getTodayDateString = (): string => {
    if (currentDate) {
      // Parse the currentDate string (e.g., "Tuesday, October 1, 2025")
      // Extract just the date part for comparison
      const dateObj = new Date(currentDate.split(', ').slice(1).join(', '));
      return dateObj.toDateString();
    } else {
      return new Date().toDateString();
    }
  };

  useEffect(() => {
    // Select question based on learning style or default
    const stylePreference = learningStyle?.toLowerCase().includes('interactor') ? 'interactor' :
                           learningStyle?.toLowerCase().includes('architect') ? 'architect' :
                           learningStyle?.toLowerCase().includes('problem solver') ? 'problemSolver' :
                           learningStyle?.toLowerCase().includes('adventurer') ? 'adventurer' : 'general';
    
    const preferredQuestions = qotdQuestions.filter(q => 
      q.learningStyle === stylePreference || q.learningStyle === 'general'
    );
    
    const randomQuestion = preferredQuestions.length > 0 
      ? preferredQuestions[Math.floor(Math.random() * preferredQuestions.length)]
      : qotdQuestions[0];
    
    setTodaysQuestion(randomQuestion);

    // Load streak and completion status from localStorage
    const savedStreak = localStorage.getItem('qotd-current-streak');
    const savedLongestStreak = localStorage.getItem('qotd-longest-streak');
    const lastCompleted = localStorage.getItem('qotd-last-completed');
    const today = getTodayDateString();

    if (savedStreak) setCurrentStreak(parseInt(savedStreak));
    if (savedLongestStreak) setLongestStreak(parseInt(savedLongestStreak));
    if (lastCompleted === today) setTodayCompleted(true);
  }, [learningStyle, currentDate]);

  const handleSubmitAnswer = () => {
    if (answer.trim()) {
      // Prevent scroll jump by temporarily disabling scroll behavior
      const scrollY = window.scrollY;
      
      setTodayCompleted(true);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      
      if (newStreak > longestStreak) {
        setLongestStreak(newStreak);
        localStorage.setItem('qotd-longest-streak', newStreak.toString());
      }
      
      localStorage.setItem('qotd-current-streak', newStreak.toString());
      localStorage.setItem('qotd-last-completed', getTodayDateString());
      
      // Restore scroll position after state update
      setTimeout(() => {
        window.scrollTo(0, scrollY);
      }, 0);
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

  const getBloomsColor = (level: string) => {
    const colors = {
      'Remember': 'bg-blue-100 text-blue-800',
      'Understand': 'bg-green-100 text-green-800',
      'Apply': 'bg-yellow-100 text-yellow-800',
      'Analyze': 'bg-orange-100 text-orange-800',
      'Evaluate': 'bg-red-100 text-red-800',
      'Create': 'bg-purple-100 text-purple-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getLearningStyleEmoji = (style: string) => {
    switch (style) {
      case 'interactor': return '💬';
      case 'architect': return '🏗️';
      case 'problemSolver': return '💡';
      case 'adventurer': return '🌟';
      default: return '🎯';
    }
  };

  if (!todaysQuestion) return null;

  return (
    <div className="space-y-6">
      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Current Streak</p>
                <p className="text-2xl font-bold text-orange-900">{currentStreak} days</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Longest Streak</p>
                <p className="text-2xl font-bold text-purple-900">{longestStreak} days</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">This Month</p>
                <p className="text-2xl font-bold text-green-900">23 / 31</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Question */}
      <Card ref={cardRef} className={`bg-white ${todayCompleted ? 'border-green-200' : 'border-blue-200'}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Question of the Day
                {todayCompleted && <Badge className="bg-green-100 text-green-800 ml-2">Completed ✓</Badge>}
              </CardTitle>
              <CardDescription>
                {todayCompleted 
                  ? "Great job! You've completed today's question. Check back tomorrow for a new challenge!" 
                  : "A personalized challenge designed for your learning style"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(todaysQuestion.difficulty)}>
                {todaysQuestion.difficulty}
              </Badge>
              <Badge className={getBloomsColor(todaysQuestion.bloomsLevel)}>
                {todaysQuestion.bloomsLevel}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                Topic: {todaysQuestion.topic}
              </span>
              {learningStyle && (
                <span className="flex items-center gap-1">
                  <span>{getLearningStyleEmoji(todaysQuestion.learningStyle)}</span>
                  Optimized for {learningStyle}
                </span>
              )}
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-900">{todaysQuestion.question}</p>
            </div>

            {todaysQuestion.hint && (
              <div className="space-y-2">
                {!showHint ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint(true)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Show Hint
                  </Button>
                ) : (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">{todaysQuestion.hint}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!todayCompleted ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Your Answer:</label>
                <Textarea
                  placeholder="Type your detailed response here... Consider the specific approach that matches your learning style."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {answer.length} characters (minimum 50 recommended)
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Save Draft
                  </Button>
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={answer.trim().length < 10}
                    className="flex items-center gap-2"
                  >
                    Submit Answer
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Excellent work!</h4>
                    <p className="text-sm text-green-700">
                      You've completed today's personalized question and maintained your {currentStreak}-day streak! 
                      Your learning style approach is really paying off.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Discuss with Chatbot
              </Button>
            </div>
          )}

          {/* Related Topics */}
          <div className="pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Related Topics to Explore:</h4>
              <div className="flex flex-wrap gap-2">
                {todaysQuestion.relatedTopics.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
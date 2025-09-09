import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Brain, MessageCircle, Building, Lightbulb, Mountain } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    style: 'interactor' | 'architect' | 'problemSolver' | 'adventurer';
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "When learning a new concept, I prefer to:",
    options: [
      { text: "Discuss it with classmates and attend interactive lectures", style: 'interactor' },
      { text: "Study it alone with detailed notes and my own pace", style: 'architect' },
      { text: "Apply it to real problems and learn through trial and error", style: 'problemSolver' },
      { text: "Work on group projects and hands-on activities", style: 'adventurer' }
    ]
  },
  {
    id: 2,
    question: "In a challenging module, I tend to:",
    options: [
      { text: "Form study groups and engage in discussions to clarify doubts", style: 'interactor' },
      { text: "Create comprehensive personal notes and study methodically", style: 'architect' },
      { text: "Focus on practical applications and problem-solving exercises", style: 'problemSolver' },
      { text: "Look for hands-on projects and collaborative assignments", style: 'adventurer' }
    ]
  },
  {
    id: 3,
    question: "When I'm stuck on a problem, I usually:",
    options: [
      { text: "Ask for help from peers or discuss it in class", style: 'interactor' },
      { text: "Take time to analyze it deeply on my own", style: 'architect' },
      { text: "Try different approaches until I find what works", style: 'problemSolver' },
      { text: "Work with others to brainstorm solutions", style: 'adventurer' }
    ]
  },
  {
    id: 4,
    question: "My ideal learning environment includes:",
    options: [
      { text: "Active discussions, lectures, and peer interactions", style: 'interactor' },
      { text: "Quiet spaces where I can focus and organize my thoughts", style: 'architect' },
      { text: "Practical workshops and real-world problem scenarios", style: 'problemSolver' },
      { text: "Collaborative spaces with group activities and hands-on work", style: 'adventurer' }
    ]
  },
  {
    id: 5,
    question: "I find it most difficult when:",
    options: [
      { text: "I have to study in isolation without peer interaction", style: 'interactor' },
      { text: "I'm forced into unpredictable group work or time pressure", style: 'architect' },
      { text: "Faced with abstract theory without practical application", style: 'problemSolver' },
      { text: "Required to sit through long passive lectures or dense reading", style: 'adventurer' }
    ]
  }
];

interface LearningStyleQuizProps {
  onComplete: (learningStyle: string) => void;
  onSkip: () => void;
  allowSkip?: boolean;
}

export default function LearningStyleQuiz({ onComplete, onSkip, allowSkip = false }: LearningStyleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentQuestion].id]: selectedAnswer
      }));

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer('');
      } else {
        // Calculate learning style based on answers
        const styleCounts = { interactor: 0, architect: 0, problemSolver: 0, adventurer: 0 };
        
        questions.forEach(question => {
          const answer = answers[question.id] || selectedAnswer;
          const selectedOption = question.options.find(opt => opt.text === answer);
          if (selectedOption) {
            styleCounts[selectedOption.style]++;
          }
        });

        // Find the dominant learning style
        const dominantStyle = Object.entries(styleCounts).reduce((a, b) => 
          styleCounts[a[0] as keyof typeof styleCounts] > styleCounts[b[0] as keyof typeof styleCounts] ? a : b
        )[0];

        const styleNames = {
          interactor: 'The Interactor',
          architect: 'The Architect',
          problemSolver: 'The Problem Solver',
          adventurer: 'The Adventurer'
        };

        onComplete(styleNames[dominantStyle as keyof typeof styleNames]);
      }
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'interactor': return <MessageCircle className="h-4 w-4" />;
      case 'architect': return <Building className="h-4 w-4" />;
      case 'problemSolver': return <Lightbulb className="h-4 w-4" />;
      case 'adventurer': return <Mountain className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <CardTitle>Discover Your Learning Preference</CardTitle>
          </div>
          <CardDescription>
            Based on Kolb's Learning Theory, we'll help you identify your learning preferences to personalize your dashboard experience. {allowSkip ? 'This quiz is optional and takes just 2 minutes.' : 'This quick quiz takes just 2 minutes and helps us personalize your experience.'}
          </CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              {questions[currentQuestion].question}
            </h3>
            
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={option.text} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer flex items-center gap-2"
                    >
                      {getStyleIcon(option.style)}
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={onSkip}>
              Skip Quiz
            </Button>
            <div className="flex gap-2">
              {currentQuestion > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
              <Button 
                onClick={handleNext} 
                disabled={!selectedAnswer}
                className="min-w-[100px]"
              >
                {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
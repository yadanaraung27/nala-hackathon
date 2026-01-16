import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
  onShowQuiz: () => void;
  learningPreference: string | null;
}

const getTutorialSteps = () => [
  {
    id: 1,
    title: "Welcome to NALA!",
    description: "Let's quickly show you around your personalized learning dashboard.",
    highlight: null,
    image: '../media/homepage_ui.png',
    action: "Let's start"
  },
  {
    id: 2,
    title: "Navigation Sidebar",
    description: "Access Homepage, Courses, Daily Challenges, and Analytics from here.",
    highlight: "sidebar",
    image: null,
    action: "Got it"
  },
  {
    id: 3,
    title: "Your Dashboard",
    description: "View your learning progress, upcoming deadlines, and daily challenges.",
    highlight: "main-content",
    image: "../media/homepage_ui_2.png",
    action: "Next"
  },
  {
    id: 4,
    title: "Daily Challenges",
    description: "Build streaks by answering personalized questions every day.",
    highlight: "daily-challenge",
    image: "../media/daily_challenges_ui.png",
    action: "Continue"
  },
  {
    id: 5,
    title: "AI Assistant",
    description: "Get help with your modules and navigate the platform easily.",
    highlight: "chatbot",
    image: "../media/chatbot_ui.png",
    action: "Next"
  },
  {
    id: 6,
    title: "Learning Theory Assistant",
    description: "Ask questions about learning theories and get insights about your learning preferences using this specialized assistant.",
    highlight: "learning-theory-assistant",
    image: "../media/learning_theory_assistant_ui.png",
    action: "Next"
  },
  {
    id: 7,
    title: "Feedback Section",
    description: "Report bugs, request new features, or suggest improvements to help us make your learning experience better.",
    highlight: "feedback-section",
    image: "../media/feedback_ui.png",
    action: "Almost done"
  },
  {
    id: 8,
    title: "Discover Your Learning Preferences",
    description: "Take a quick quiz based on Kolb's Learning Theory to personalize your experience and get tailored study recommendations.",
    highlight: "learning-prefs",
    image: "../media/learning_preference_quiz_ui.png",
    action: "Get Started"
  }
];

export default function Tutorial({ onComplete, onSkip, onShowQuiz, learningPreference }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const tutorialSteps = getTutorialSteps();

  useEffect(() => {
    const currentStepData = tutorialSteps[currentStep];
    setHighlightedElement(currentStepData.highlight);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - show quiz prompt instead of completing
      setHighlightedElement(null);
      setShowQuizPrompt(true);
    }
  };

  const handleLastStepAction = () => {
    // Only show quiz prompt when user clicks "Get Started" in the last step
    setHighlightedElement(null);
    setShowQuizPrompt(true);
  };

  const [showQuizPrompt, setShowQuizPrompt] = useState(false);

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setHighlightedElement(null);
    onSkip();
  };

  const currentStepData = tutorialSteps[currentStep];

  // Create background overlay style (always grey background)
  const getBackgroundOverlayStyle = () => {
    return {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 40
    };
  };

  const handleQuizYes = () => {
    onComplete();
    onShowQuiz();
  };

  const handleQuizNo = () => {
    onComplete();
  };

  // Apply spotlight effect
  useEffect(() => {
    let originalStyles: { [key: string]: string } = {};
    
    if (highlightedElement) {
      const element = document.querySelector(`[data-tutorial="${highlightedElement}"]`) as HTMLElement;
      if (element) {
        // Store original styles
        originalStyles = {
          position: element.style.position || window.getComputedStyle(element).position,
          zIndex: element.style.zIndex || window.getComputedStyle(element).zIndex,
          boxShadow: element.style.boxShadow,
          borderRadius: element.style.borderRadius,
          transition: element.style.transition
        };
        
        // Apply spotlight styles while preserving position for fixed elements
        const currentPosition = window.getComputedStyle(element).position;
        if (currentPosition !== 'fixed') {
          element.style.position = 'relative';
        }
        element.style.zIndex = '50';
        element.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3)';
        element.style.borderRadius = '8px';
        element.style.transition = 'all 0.3s ease';
      }
    }

    return () => {
      // Cleanup - restore original styles
      if (highlightedElement) {
        const element = document.querySelector(`[data-tutorial="${highlightedElement}"]`) as HTMLElement;
        if (element) {
          element.style.position = originalStyles.position === 'static' ? '' : originalStyles.position || '';
          element.style.zIndex = originalStyles.zIndex === 'auto' ? '' : originalStyles.zIndex || '';
          element.style.boxShadow = originalStyles.boxShadow || '';
          element.style.borderRadius = originalStyles.borderRadius || '';
          element.style.transition = originalStyles.transition || '';
        }
      }
    };
  }, [highlightedElement]);

  return (
    <>
      {/* Background Overlay - Always present */}
      <div style={getBackgroundOverlayStyle()}></div>

      {/* Quiz Prompt Modal */}
      {showQuizPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl border-2 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Brain className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Personalize Your Experience
                </h3>
                <p className="text-sm text-gray-600">
                  Would you like to take a quick quiz to personalize your learning experience? This helps us tailor content to your learning style.
                </p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleQuizNo}
                  className="flex-1"
                >
                  Skip for now
                </Button>
                <Button 
                  onClick={handleQuizYes}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                >
                  Take Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tutorial Modal */}
      {!showQuizPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl border-2 border-purple-200">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <Badge variant="secondary" className="text-xs">
                  {currentStep + 1} of {tutorialSteps.length}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>

            {/* Content */}
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStepData.title}
              </h3>
              
              {/* Screenshot placeholder */}
              {currentStepData.image && (
                <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-black">
                  <ImageWithFallback 
                    src={currentStepData.image}
                    alt={currentStepData.title}
                    className="w-full h-70 object-cover"
                  />
                </div>
              )}

              <p className="text-sm text-gray-600 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Skip
              </Button>
              
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  onClick={currentStep === tutorialSteps.length - 1 ? handleLastStepAction : handleNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {currentStepData.action}
                  {currentStep < tutorialSteps.length - 1 && (
                    <ChevronRight className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}
    </>
  );
}
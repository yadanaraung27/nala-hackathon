/* AppModals Component
Centralizes all modal/dialog windows in the application

Manages the rendering of:
  - Learning Style Quiz Modal
  - Tutorial Modal
  - Learning Preference Details Modal

This component keeps App.tsx clean by extracting all modal logic into one place
Modals are conditionally rendered based on boolean flags passed from App.tsx
*/

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Brain, X} from 'lucide-react';
import LearningStyleQuiz from './LearningStyleQuiz';
import Tutorial from './Tutorial';

interface AppModalsProps {
  showQuiz: boolean;
  showTutorial: boolean;
  showLearningStyleDetails: boolean;
  learningPreference: string | null;
  currentLearningPreferenceDetails: any;
  onQuizComplete: (preference: string) => void;
  onQuizSkip: () => void;
  onTutorialComplete: () => void;
  onTutorialSkip: () => void;
  onShowQuiz: () => void;
  onCloseLearningStyleDetails: () => void;
}

export default function AppModals({
  showQuiz,
  showTutorial,
  showLearningStyleDetails,
  learningPreference,
  currentLearningPreferenceDetails,
  onQuizComplete,
  onQuizSkip,
  onTutorialComplete,
  onTutorialSkip,
  onShowQuiz,
  onCloseLearningStyleDetails
}: AppModalsProps) {
  return (
    <>
      {/* Learning Preference Quiz Modal */}
      {showQuiz && (
        <LearningStyleQuiz 
          onComplete={onQuizComplete} 
          onSkip={onQuizSkip} 
        />
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <Tutorial 
          onComplete={onTutorialComplete}
          onSkip={onTutorialSkip}
          onShowQuiz={onShowQuiz}
          learningPreference={learningPreference}
        />
      )}

      {/* Learning Preference Details Modal */}
      {showLearningStyleDetails && currentLearningPreferenceDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  {learningPreference}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onCloseLearningStyleDetails}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{currentLearningPreferenceDetails.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Characteristics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Your Learning Characteristics</h4>
                <ul className="space-y-2">
                  {currentLearningPreferenceDetails.characteristics.map((characteristic: string, index: number) => (
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
                  {currentLearningPreferenceDetails.studyTips.map((tip: string, index: number) => (
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
                  {currentLearningPreferenceDetails.platformFeatures.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={onCloseLearningStyleDetails}>
                  Got it!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Brain, Settings, X, Info } from 'lucide-react';
import LearningStyleQuiz from './LearningStyleQuiz';
import Tutorial from './Tutorial';

interface AppModalsProps {
  showQuiz: boolean;
  showTutorial: boolean;
  showSettings: boolean;
  showLearningStyleDetails: boolean;
  features: any;
  learningPreference: string | null;
  currentLearningPreferenceDetails: any;
  onQuizComplete: (preference: string) => void;
  onQuizSkip: () => void;
  onTutorialComplete: () => void;
  onTutorialSkip: () => void;
  onShowQuiz: () => void;
  onFeatureToggle: (feature: string) => void;
  onCloseSettings: () => void;
  onCloseLearningStyleDetails: () => void;
}

export default function AppModals({
  showQuiz,
  showTutorial,
  showSettings,
  showLearningStyleDetails,
  features,
  learningPreference,
  currentLearningPreferenceDetails,
  onQuizComplete,
  onQuizSkip,
  onTutorialComplete,
  onTutorialSkip,
  onShowQuiz,
  onFeatureToggle,
  onCloseSettings,
  onCloseLearningStyleDetails
}: AppModalsProps) {
  return (
    <>
      {/* Learning Preference Quiz Modal */}
      {showQuiz && features.learningPreferences && (
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

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => {}}>
                  Customize Features
                </Button>
                <Button onClick={onCloseLearningStyleDetails}>
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
                    <h4 className="text-sm font-medium">Learning Preferences</h4>
                    <p className="text-xs text-gray-600">Personalized learning recommendations and character profiles</p>
                  </div>
                  <Switch
                    checked={features.learningPreferences}
                    onCheckedChange={() => onFeatureToggle('learningPreferences')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Course Overview</h4>
                    <p className="text-xs text-gray-600">Important dates, deadlines, and module information</p>
                  </div>
                  <Switch
                    checked={features.courseOverview}
                    onCheckedChange={() => onFeatureToggle('courseOverview')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Question of the Day</h4>
                    <p className="text-xs text-gray-600">Daily challenges and streak tracking</p>
                  </div>
                  <Switch
                    checked={features.questionOfTheDay}
                    onCheckedChange={() => onFeatureToggle('questionOfTheDay')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Mastery Level</h4>
                    <p className="text-xs text-gray-600">Course competency tracking and tier progression</p>
                  </div>
                  <Switch
                    checked={features.masteryLevel}
                    onCheckedChange={() => onFeatureToggle('masteryLevel')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Course Difficulty</h4>
                    <p className="text-xs text-gray-600">Personalized course difficulty based on learning style</p>
                  </div>
                  <Switch
                    checked={features.courseDifficulty}
                    onCheckedChange={() => onFeatureToggle('courseDifficulty')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Learning Assistant</h4>
                    <p className="text-xs text-gray-600">AI chatbot to help navigate the platform</p>
                  </div>
                  <Switch
                    checked={features.chatbot}
                    onCheckedChange={() => onFeatureToggle('chatbot')}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onCloseSettings}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
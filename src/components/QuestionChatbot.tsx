import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Send, Target, Lightbulb } from 'lucide-react';

interface QuestionChatbotProps {
  learningStyle?: string | null;
  onBack: () => void;
  onSubmitAnswer?: (question: string, answer: string) => void;
}

export default function QuestionChatbot({ learningStyle, onBack, onSubmitAnswer }: QuestionChatbotProps) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Mock question data - would come from backend
  const questionData = {
    difficulty: 'Medium',
    questionType: 'Understand',
    topic: 'Derivatives',
    question: "Imagine you're explaining the chain rule to a study group. How would you describe when and why we use it for composite functions, and what common mistakes should your classmates avoid?",
    hint: "Think about identifying outer and inner functions and common differentiation errors...",
    relatedTopics: ['Data Structures', 'Tree Traversal', 'Algorithm Explanation']
  };

  const handleSubmit = () => {
    // Handle answer submission and redirect to chatbot
    if (onSubmitAnswer) {
      onSubmitAnswer(questionData.question, answer);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>

          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">

          {/* Question Content Card */}
          <Card className="mb-6 border-gray-200 shadow-sm">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl text-gray-900">Question of the Day</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1"
                  >
                    {questionData.difficulty}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-800 text-sm px-3 py-1"
                  >
                    {questionData.questionType}
                  </Badge>
                </div>
              </div>

            </CardHeader>

            <CardContent className="space-y-8">
              {/* Topic and Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Topic: {questionData.topic}</span>
                </div>

              </div>

              {/* Question */}
              <div className="bg-white border-2 border-blue-200 p-6 rounded-xl shadow-sm">
                <p className="text-gray-800 leading-relaxed text-lg">
                  {questionData.question}
                </p>
              </div>

              {/* Show Hint */}
              {!showHint && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint(true)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Show hint
                  </Button>
                </div>
              )}

              {/* Hint */}
              {showHint && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      💡
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-2">Hint</h4>
                      <p className="text-yellow-800">
                        {questionData.hint}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Answer Section */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-900">
                  Your Answer:
                </label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Share your detailed thoughts here... Remember to consider the approach that best matches your learning preference and explain your reasoning step by step."
                  className="min-h-[250px] resize-y bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-xl text-base p-4"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 px-8 py-3 text-base font-medium"
                >
                  Submit My Answer
                  <Send className="h-4 w-4" />
                </Button>
              </div>



              {/* Personalized tip based on learning preference */}
              {learningStyle && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900 mb-2">Personalized Strategy for {learningStyle}</h4>
                      <p className="text-purple-800">
                        {learningStyle === 'The Interactor' && "Consider how you would facilitate this discussion and what follow-up questions you'd ask your study group members. Think about the collaborative aspects and how you'd explain this to peers."}
                        {learningStyle === 'The Architect' && "Structure your explanation systematically, starting with the basic concept and building up to more complex scenarios. Create a logical framework and detailed analysis."}
                        {learningStyle === 'The Problem Solver' && "Think about concrete examples and code implementations you could use to demonstrate each step. Focus on practical applications and hands-on solutions."}
                        {learningStyle === 'The Adventurer' && "Feel free to explore creative analogies or visual representations that might help explain the concept. Think outside the box and make creative connections."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
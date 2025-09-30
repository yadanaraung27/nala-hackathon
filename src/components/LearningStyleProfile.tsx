import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Eye, Headphones, BookOpen, Zap, Settings, RefreshCw } from 'lucide-react';

const learningStyleInfo = {
  'Visual Learner': {
    icon: Eye,
    color: 'bg-blue-100 text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'You learn best through visual aids like diagrams, charts, and images.',
    tips: [
      'Use mind maps and flowcharts when studying',
      'Highlight important information in different colors',
      'Watch educational videos and visual demonstrations',
      'Create visual summaries of key concepts'
    ],
    chatbotPersonalization: 'I can provide more visual examples, diagrams, and structured information to help you learn better.'
  },
  'Auditory Learner': {
    icon: Headphones,
    color: 'bg-green-100 text-green-600',
    badgeColor: 'bg-green-100 text-green-800',
    description: 'You learn best through listening and verbal explanations.',
    tips: [
      'Read information aloud or listen to recordings',
      'Participate in group discussions and study groups',
      'Use mnemonic devices and verbal associations',
      'Ask questions and engage in verbal explanations'
    ],
    chatbotPersonalization: 'I can provide more detailed verbal explanations and suggest audio resources to enhance your learning.'
  },
  'Reading/Writing Learner': {
    icon: BookOpen,
    color: 'bg-purple-100 text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800',
    description: 'You learn best through reading and writing activities.',
    tips: [
      'Take detailed notes and rewrite key concepts',
      'Create lists, outlines, and written summaries',
      'Read additional materials on topics of interest',
      'Use written exercises and practice problems'
    ],
    chatbotPersonalization: 'I can provide more detailed written explanations, examples, and suggest additional reading materials.'
  },
  'Kinesthetic Learner': {
    icon: Zap,
    color: 'bg-orange-100 text-orange-600',
    badgeColor: 'bg-orange-100 text-orange-800',
    description: 'You learn best through hands-on activities and movement.',
    tips: [
      'Use hands-on practice and real-world applications',
      'Take breaks to move around during study sessions',
      'Use physical objects and manipulatives when possible',
      'Try role-playing and interactive simulations'
    ],
    chatbotPersonalization: 'I can suggest more practical exercises, code examples you can try, and interactive learning approaches.'
  }
};

interface LearningStyleProfileProps {
  learningStyle: string;
  onRetakeQuiz: () => void;
}

export default function LearningStyleProfile({ learningStyle, onRetakeQuiz }: LearningStyleProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const styleInfo = learningStyleInfo[learningStyle as keyof typeof learningStyleInfo];
  const IconComponent = styleInfo.icon;
  
  if (!styleInfo) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 hover:bg-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={styleInfo.color}>
                <IconComponent className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">Your Learning Preference</span>
              </div>
              <Badge className={`${styleInfo.badgeColor} text-xs mt-1`}>
                {learningStyle}
              </Badge>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${styleInfo.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">{learningStyle}</CardTitle>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetakeQuiz}
                className="h-8 px-2"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            <CardDescription className="text-sm">
              {styleInfo.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Learning Tips for You:</h4>
              <ul className="space-y-1 text-xs text-gray-600">
                {styleInfo.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Chatbot Personalization:</h4>
              <p className="text-xs text-gray-600">
                {styleInfo.chatbotPersonalization}
              </p>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
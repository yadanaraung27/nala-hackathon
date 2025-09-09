import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MessageCircle, Building, Lightbulb, Mountain, Settings, RefreshCw, AlertTriangle, CheckCircle, TrendingUp, Target } from 'lucide-react';

const learningStyleCharacters = {
  'The Interactor': {
    character: '💬',
    name: 'The Interactor',
    personality: 'Social and communicative',
    icon: MessageCircle,
    color: 'bg-blue-100 text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-indigo-50',
    description: 'You thrive in interactive learning environments with discussions and peer collaboration.',
    strengths: [
      'Excellent at articulating understanding through discussion',
      'Strong communication and interpersonal skills',
      'Learns effectively through lectures and group interactions',
      'Good at building knowledge through dialogue and feedback'
    ],
    challenges: [
      'May struggle in fast-paced modules with limited interaction',
      'Difficulty with isolated self-study scenarios',
      'Can be overwhelmed by purely independent learning'
    ],
    studyTips: [
      'Form study groups and engage in regular discussions',
      'Attend office hours and actively participate in lectures',
      'Use discussion forums and peer learning platforms',
      'Explain concepts to others to reinforce your understanding',
      'Seek out interactive workshops and seminars'
    ],
    chatbotPersonalization: 'I can engage in more conversational exchanges, ask follow-up questions, and suggest discussion points for you to explore with peers.',
    strugglingCourses: ['Self-paced Online Modules', 'Independent Research Projects'],
    strongCourses: ['Software Engineering', 'Group Project Courses', 'Seminar-style Classes']
  },
  'The Architect': {
    character: '🏗️',
    name: 'The Architect',
    personality: 'Methodical and analytical',
    icon: Building,
    color: 'bg-purple-100 text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-pink-50',
    description: 'You prefer solitary learning, studying at your own pace with detailed personal organization.',
    strengths: [
      'Excellent at deep analysis and systematic thinking',
      'Strong note-taking and organizational skills',
      'Good at creating structured learning materials',
      'Effective at self-directed learning and planning'
    ],
    challenges: [
      'May struggle with unpredictable group work dynamics',
      'Difficulty with time-pressured collaborative activities',
      'Can be overwhelmed by chaotic learning environments'
    ],
    studyTips: [
      'Create comprehensive personal notes and study schedules',
      'Use mind maps and structured outlines for organization',
      'Set up quiet, organized study spaces',
      'Break complex topics into manageable components',
      'Plan ahead for assignments and deadlines'
    ],
    chatbotPersonalization: 'I can provide structured, detailed explanations with clear organization and suggest frameworks for you to build upon independently.',
    strugglingCourses: ['Fast-paced Group Projects', 'Improvisational Workshops'],
    strongCourses: ['Database Systems', 'Algorithm Analysis', 'Theoretical Computer Science']
  },
  'The Problem Solver': {
    character: '💡',
    name: 'The Problem Solver',
    personality: 'Practical and persistent',
    icon: Lightbulb,
    color: 'bg-green-100 text-green-600',
    badgeColor: 'bg-green-100 text-green-800',
    gradientFrom: 'from-green-50',
    gradientTo: 'to-emerald-50',
    description: 'You excel at learning by applying knowledge to practical problems and learning from mistakes.',
    strengths: [
      'Excellent at practical application of concepts',
      'Strong problem-solving and debugging skills',
      'Good at learning through trial and error',
      'Effective at connecting theory to real-world scenarios'
    ],
    challenges: [
      'May struggle with abstract theory without clear applications',
      'Difficulty with open-ended brainstorming sessions',
      'Can be frustrated by problems without clear solution paths'
    ],
    studyTips: [
      'Focus on coding challenges and practical exercises',
      'Work on real-world projects and case studies',
      'Use debugging and testing as learning opportunities',
      'Connect theoretical concepts to practical applications',
      'Practice with hands-on labs and simulations'
    ],
    chatbotPersonalization: 'I can provide practical examples, coding challenges, step-by-step problem-solving approaches, and real-world applications for every concept.',
    strugglingCourses: ['Theoretical Mathematics', 'Abstract Philosophy'],
    strongCourses: ['Data Structures', 'Web Development', 'Machine Learning Applications']
  },
  'The Adventurer': {
    character: '🌟',
    name: 'The Adventurer',
    personality: 'Energetic and collaborative',
    icon: Mountain,
    color: 'bg-orange-100 text-orange-600',
    badgeColor: 'bg-orange-100 text-orange-800',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-red-50',
    description: 'You are energized by group projects and hands-on activities with active engagement.',
    strengths: [
      'Excellent at collaborative work and team dynamics',
      'Strong hands-on learning and experimentation skills',
      'Good at energizing group activities and projects',
      'Effective at learning through active participation'
    ],
    challenges: [
      'May struggle with long passive lectures',
      'Difficulty with text-heavy reading without interaction',
      'Can lose focus during purely theoretical discussions'
    ],
    studyTips: [
      'Participate in hackathons and group competitions',
      'Use interactive coding environments and tools',
      'Take frequent breaks during study sessions',
      'Form project teams for assignments',
      'Seek out hands-on workshops and maker spaces'
    ],
    chatbotPersonalization: 'I can suggest collaborative projects, interactive exercises, gamified learning approaches, and hands-on activities to keep you engaged.',
    strugglingCourses: ['Dense Theoretical Courses', 'Solo Reading-Intensive Classes'],
    strongCourses: ['Software Engineering Projects', 'Interactive Web Development', 'Team-based Capstone Projects']
  }
};

interface EnhancedLearningStyleProfileProps {
  learningStyle: string;
  onRetakeQuiz: () => void;
}

export default function EnhancedLearningStyleProfile({ learningStyle, onRetakeQuiz }: EnhancedLearningStyleProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tips' | 'courses'>('overview');
  
  const styleInfo = learningStyleCharacters[learningStyle as keyof typeof learningStyleCharacters];
  const IconComponent = styleInfo?.icon;
  
  if (!styleInfo) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-3 hover:bg-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className={`${styleInfo.color} text-lg`}>
                {styleInfo.character}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{styleInfo.name}</span>
              </div>
              <Badge className={`${styleInfo.badgeColor} text-xs mt-1`}>
                {learningStyle}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">{styleInfo.personality}</p>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className={`pb-3 bg-gradient-to-r ${styleInfo.gradientFrom} ${styleInfo.gradientTo}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={`${styleInfo.color} text-lg`}>
                    {styleInfo.character}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Meet {styleInfo.name}!</CardTitle>
                  <CardDescription className="text-sm">{styleInfo.personality}</CardDescription>
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
          </CardHeader>
          
          <CardContent className="p-4 space-y-4">
            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'tips', label: 'Study Tips' },
                { id: 'courses', label: 'Courses' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {selectedTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-3">{styleInfo.description}</p>
                  <p className="text-xs text-gray-500 italic">"{styleInfo.personality}"</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Your Strengths:
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {styleInfo.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Watch Out For:
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {styleInfo.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === 'tips' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Personalized Study Tips:</h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    {styleInfo.studyTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-blue-500 mt-0.5">💡</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Chatbot Personalization:</h4>
                  <p className="text-xs text-gray-600 p-2 bg-blue-50 rounded border border-blue-200">
                    {styleInfo.chatbotPersonalization}
                  </p>
                </div>
              </div>
            )}

            {selectedTab === 'courses' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Your Strong Subjects:
                  </h4>
                  <div className="space-y-2">
                    {styleInfo.strongCourses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                        <span className="text-sm text-green-800">{course}</span>
                        <Badge className="bg-green-100 text-green-700 text-xs">Perfect Match</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <Target className="h-4 w-4 text-amber-600" />
                    Areas to Focus On:
                  </h4>
                  <div className="space-y-2">
                    {styleInfo.strugglingCourses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200">
                        <span className="text-sm text-amber-800">{course}</span>
                        <Badge className="bg-amber-100 text-amber-700 text-xs">Extra Support</Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    With the right approach, you can excel in these areas too! Use your personalized study tips.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
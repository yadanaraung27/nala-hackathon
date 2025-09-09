import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MessageCircle, Send, X, Minimize2, Maximize2, Brain, HelpCircle, Sparkles, RotateCcw, Image as ImageIcon, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  image?: {
    url: string;
    alt: string;
    caption?: string;
  };
  isLoading?: boolean;
}

interface LearningChatbotProps {
  learningStyle?: string | null;
}

// Pre-fetched navigation images from Unsplash
const navigationImages = {
  "analytics dashboard": "https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzU1MjE3MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "personality quiz": "https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl0eSUyMHF1aXolMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzU1MjUxMjA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "navigation tabs": "https://images.unsplash.com/photo-1663579973124-61c113e1521c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwbmF2aWdhdGlvbiUyMHRhYnN8ZW58MXx8fHwxNzU1MjUxMjA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "daily challenge": "https://images.unsplash.com/photo-1661358791066-3c9f7603f6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlseSUyMGNoYWxsZW5nZSUyMG1vYmlsZSUyMGFwcHxlbnwxfHx8fDE3NTUyNTEyMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "radar chart": "https://images.unsplash.com/photo-1567665202038-6c5e97837696?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWRhciUyMGNoYXJ0JTIwc2tpbGxzJTIwYXNzZXNzbWVudHxlbnwxfHx8fDE3NTUyNTEyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "settings panel": "https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXR0aW5ncyUyMGN1c3RvbWl6YXRpb24lMjBwYW5lbHxlbnwxfHx8fDE3NTUyNTEyMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
};

// Chatbot knowledge base organized by topics
const chatbotKnowledgeBase = {
  // Learning Styles
  learningStyles: {
    'The Interactor': {
      greeting: "Hi there! As a fellow Interactor, I love our conversations! I'm here to help you navigate the platform and make the most of your collaborative learning journey. What would you like to explore together?",
      features: [
        "Your daily questions are designed with discussion prompts to encourage interaction",
        "The analytics track your engagement in collaborative features",
        "Course recommendations prioritize group projects and team-based assignments",
        "The chatbot (that's me!) adapts to be more conversational and interactive"
      ]
    },
    'The Architect': {
      greeting: "Hello! I can see you're an Architect who values structured learning. I'm here to provide detailed explanations about the platform's features and help you build a comprehensive understanding of how everything works together.",
      features: [
        "Your daily questions focus on theoretical understanding and systematic analysis",
        "The mastery tracking shows detailed progress across all competency levels",
        "Course difficulty analysis helps you plan your structured learning path",
        "All explanations are organized with clear frameworks and detailed breakdowns"
      ]
    },
    'The Problem Solver': {
      greeting: "Hey! Ready to tackle some challenges? As a Problem Solver, you'll love how this platform gives you hands-on tools and practical insights. Let me show you how to make the most of the features!",
      features: [
        "Daily questions include coding challenges and practical problems to solve",
        "Analytics track your performance on practical vs theoretical content",
        "Course recommendations highlight project-based and hands-on learning opportunities",
        "The platform emphasizes real-world applications and immediate feedback"
      ]
    },
    'The Adventurer': {
      greeting: "Welcome, fellow explorer! I love how you embrace diverse learning experiences. This platform has so many exciting features to discover - let's embark on this learning adventure together!",
      features: [
        "Daily questions vary in format and incorporate creative, engaging elements",
        "Course recommendations include diverse and interdisciplinary options",
        "Platform features can be customized to match your ever-changing preferences",
        "The interface adapts to keep your learning experience fresh and dynamic"
      ]
    }
  },

  // Platform features explanations with image keys
  features: {
    dashboard: {
      overview: "The dashboard is your central hub for learning analytics. It shows your question activity, engagement patterns, and personalized insights based on your learning style.",
      navigation: "Use the tabs to explore different sections: Overview, Topics, Engagement, Performance, Courses, Daily Challenge, Mastery Level, and Course Fit.",
      customization: "Click the 'Features' button in the top right to enable/disable different sections based on your needs.",
      imageKey: "analytics dashboard"
    },
    learningStyle: {
      purpose: "Learning styles help personalize your entire experience. Based on Kolb's Learning Theory, we identify you as one of four types: The Interactor, The Architect, The Problem Solver, or The Adventurer.",
      benefits: "Your learning style affects your daily questions, course difficulty ratings, chatbot interactions, and study recommendations.",
      retaking: "You can retake the quiz anytime by clicking 'Retake Quiz' in the purple banner or your profile.",
      imageKey: "personality quiz"
    },
    dailyChallenge: {
      purpose: "Daily challenges keep you engaged with personalized questions based on your learning style and weaker topics.",
      streaks: "Maintain your streak by answering at least one question per day. Your current streak is displayed with a fire emoji.",
      personalization: "Questions are tailored to your learning style - interactive for Interactors, structured for Architects, practical for Problem Solvers, and varied for Adventurers.",
      imageKey: "daily challenge"
    },
    masteryLevel: {
      purpose: "Mastery Level shows your competency across 7 learning tiers for each course, from basic understanding to innovation.",
      visualization: "The radar chart displays your progress across different courses with colored polygons.",
      tiers: "Tier 1 (Basic Understanding) → Tier 7 (Innovation). Each tier represents increasing depth of knowledge and application.",
      imageKey: "radar chart"
    },
    courseFit: {
      purpose: "Course Fit analyzes which courses are easier or harder for you based on your learning style.",
      insights: "Green cards show courses that align with your learning preferences, orange cards show challenges with specific strategies.",
      tips: "Each course includes personalized study tips and explanations for why it might be easier or harder for your learning style.",
      imageKey: "analytics dashboard"
    },
    analytics: {
      purpose: "Analytics provide insights into your learning patterns, question types, engagement trends, and performance metrics.",
      metrics: "Track total questions, active learning time, topics covered, response patterns, and performance against targets.",
      trends: "View daily activity patterns, weekly engagement, and question type distribution to optimize your learning schedule.",
      imageKey: "analytics dashboard"
    },
    navigation: {
      tabs: "The main navigation uses tabs at the top of each section. Click on Overview, Topics, Engagement, Performance, and your personalized tabs.",
      settings: "Access settings by clicking the 'Features' button in the top right corner. Here you can toggle different platform features on/off.",
      profile: "Your learning style profile appears in the top right when available. Click on it to see your character details.",
      imageKey: "navigation tabs"
    },
    customization: {
      features: "Toggle features on/off in the Settings panel: Learning Styles, Course Overview, Daily Challenges, Mastery Level, Course Difficulty, and Learning Assistant.",
      layout: "The dashboard adapts based on your enabled features. Disabled features won't show in the main interface.",
      preferences: "Your preferences are automatically saved and will persist across sessions.",
      imageKey: "settings panel"
    }
  },

  // Navigation guides with specific image keys
  navigationGuides: {
    "take quiz": {
      steps: [
        "Look for the purple banner at the top of your dashboard",
        "Click the 'Retake Quiz' button if you see your learning style displayed",
        "If no quiz is visible, check that Learning Styles is enabled in Settings",
        "The quiz will appear as a modal with multiple-choice questions"
      ],
      imageKey: "personality quiz"
    },
    "find tabs": {
      steps: [
        "Look for the horizontal tab bar below the feature cards",
        "Tabs include: Overview, Topics, Engagement, Performance",
        "Additional tabs appear based on enabled features: Courses, Daily Challenge, Mastery Level, Course Fit",
        "Click any tab to switch between different sections"
      ],
      imageKey: "navigation tabs"
    },
    "access settings": {
      steps: [
        "Look for the 'Features' button in the top right corner of the dashboard",
        "Click the button to open the settings modal",
        "Use the toggles to enable/disable features",
        "Changes are automatically saved"
      ],
      imageKey: "settings panel"
    },
    "view analytics": {
      steps: [
        "Click on the 'Overview' tab to see general analytics",
        "Use 'Topics' tab for subject-specific insights",
        "Check 'Engagement' for activity patterns",
        "View 'Performance' for goal tracking"
      ],
      imageKey: "analytics dashboard"
    },
    "daily challenge": {
      steps: [
        "Look for the orange 'Quick Challenge' card in the feature section",
        "Click 'Start Challenge' to begin your daily question",
        "Maintain your streak by completing at least one question per day",
        "Access the full Daily Challenge tab for more details"
      ],
      imageKey: "daily challenge"
    },
    "mastery chart": {
      steps: [
        "Navigate to the 'Mastery Level' tab",
        "View the radar chart showing your progress across different learning tiers",
        "Each colored polygon represents a different course",
        "Click 'Show Details' to see tier descriptions"
      ],
      imageKey: "radar chart"
    }
  },

  // Common troubleshooting
  troubleshooting: {
    "quiz not showing": "The learning style quiz appears automatically for new users. If it's not showing, check that Learning Styles is enabled in Features settings (top right button).",
    "features missing": "Some features only appear after completing the learning style quiz or when specific features are enabled in settings.",
    "data not loading": "Try refreshing the page using the 'Refresh' button in the top right. If issues persist, check your internet connection.",
    "personalization not working": "Personalization requires a completed learning style assessment. Make sure you've finished the quiz and see your style in the purple banner."
  }
};

// Quick suggestions based on context
const quickSuggestions = [
  "How do I take the learning style quiz?",
  "What do the different tabs show?",
  "How does my learning style affect the platform?",
  "How do I maintain my daily streak?",
  "What are mastery levels?",
  "How to customize my dashboard?",
  "Why are some courses marked easier/harder?",
  "How do analytics help my learning?"
];

export default function LearningChatbot({ learningStyle }: LearningChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with greeting based on learning style
      const initialMessage = getInitialGreeting();
      setMessages([initialMessage]);
    }
  }, [isOpen, learningStyle]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getInitialGreeting = (): Message => {
    let greeting = "Hello! I'm your learning companion, here to help you navigate the platform and make the most of your personalized learning experience. What would you like to know?";
    let suggestions = quickSuggestions.slice(0, 4);

    if (learningStyle && chatbotKnowledgeBase.learningStyles[learningStyle as keyof typeof chatbotKnowledgeBase.learningStyles]) {
      const styleInfo = chatbotKnowledgeBase.learningStyles[learningStyle as keyof typeof chatbotKnowledgeBase.learningStyles];
      greeting = styleInfo.greeting;
      suggestions = [
        "Tell me about my learning style features",
        "How to use daily challenges?",
        "What is mastery level tracking?",
        "How to customize my dashboard?"
      ];
    }

    return {
      id: '1',
      content: greeting,
      sender: 'bot',
      timestamp: new Date(),
      suggestions
    };
  };

  const getNavigationImage = (imageKey: string): { url: string; alt: string; caption: string } | undefined => {
    const imageUrl = navigationImages[imageKey as keyof typeof navigationImages];
    if (!imageUrl) return undefined;

    const imageData = {
      url: imageUrl,
      alt: `${imageKey} interface example`,
      caption: `Visual example of a ${imageKey} interface to help you navigate`
    };

    return imageData;
  };

  const generateResponse = async (userMessage: string): Promise<Message> => {
    const message = userMessage.toLowerCase();
    let response = "I'm here to help! Let me provide some information about that.";
    let suggestions: string[] = [];
    let imageData: { url: string; alt: string; caption?: string } | undefined;

    // Check if this is a navigation question that needs visual guidance
    const needsVisualGuide = 
      message.includes('how to') || 
      message.includes('where') || 
      message.includes('navigate') || 
      message.includes('find') || 
      message.includes('access') || 
      message.includes('show me');

    // Navigation-specific responses with visual guides
    if (message.includes('take') && message.includes('quiz')) {
      const guide = chatbotKnowledgeBase.navigationGuides["take quiz"];
      response = `Here's how to take the learning style quiz:\n\n${guide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\nThe quiz helps personalize your entire learning experience!`;
      suggestions = ["What are the different learning styles?", "How does personalization work?", "Can I retake the quiz later?"];
      if (needsVisualGuide) {
        imageData = getNavigationImage(guide.imageKey);
      }
    }
    
    // Tabs navigation
    else if ((message.includes('tab') || message.includes('navigate')) && (message.includes('find') || message.includes('where'))) {
      const guide = chatbotKnowledgeBase.navigationGuides["find tabs"];
      response = `Here's how to navigate using tabs:\n\n${guide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\nEach tab shows different aspects of your learning journey!`;
      suggestions = ["What's in the Overview tab?", "How to access settings?", "Show me the analytics"];
      if (needsVisualGuide) {
        imageData = getNavigationImage(guide.imageKey);
      }
    }

    // Settings access
    else if (message.includes('setting') || message.includes('customize') || message.includes('features')) {
      const guide = chatbotKnowledgeBase.navigationGuides["access settings"];
      response = `Here's how to customize your dashboard:\n\n${guide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\nYou can enable/disable: Learning Styles, Course Overview, Daily Challenges, Mastery Level, Course Difficulty, and this Learning Assistant!`;
      suggestions = ["How to reset preferences?", "What happens when I disable features?", "Show me the dashboard"];
      if (needsVisualGuide) {
        imageData = getNavigationImage(guide.imageKey);
      }
    }

    // Daily challenges navigation
    else if (message.includes('daily') || message.includes('challenge') || message.includes('streak')) {
      const guide = chatbotKnowledgeBase.navigationGuides["daily challenge"];
      response = `${chatbotKnowledgeBase.features.dailyChallenge.purpose}\n\nHere's how to access daily challenges:\n\n${guide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n${chatbotKnowledgeBase.features.dailyChallenge.personalization}`;
      suggestions = ["How are questions personalized?", "What if I miss a day?", "How to improve my streak?"];
      if (needsVisualGuide) {
        imageData = getNavigationImage(guide.imageKey);
      }
    }

    // Mastery levels navigation
    else if (message.includes('mastery') || message.includes('tier') || message.includes('radar')) {
      const guide = chatbotKnowledgeBase.navigationGuides["mastery chart"];
      response = `${chatbotKnowledgeBase.features.masteryLevel.purpose}\n\nHere's how to view your mastery levels:\n\n${guide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n${chatbotKnowledgeBase.features.masteryLevel.tiers}`;
      suggestions = ["How to improve mastery?", "What do the colors mean?", "How are tiers calculated?"];
      if (needsVisualGuide) {
        imageData = getNavigationImage(guide.imageKey);
      }
    }

    // Analytics navigation
    else if (message.includes('analytics') || message.includes('chart') || message.includes('data')) {
      const guide = chatbotKnowledgeBase.navigationGuides["view analytics"];
      response = `${chatbotKnowledgeBase.features.analytics.purpose}\n\nHere's how to explore your analytics:\n\n${guide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n${chatbotKnowledgeBase.features.analytics.trends}`;
      suggestions = ["How to interpret the charts?", "What are performance targets?", "How to export data?"];
      if (needsVisualGuide) {
        imageData = getNavigationImage(chatbotKnowledgeBase.features.analytics.imageKey);
      }
    }

    // Learning style specific responses
    else if (message.includes('learning style') || message.includes('my style')) {
      if (learningStyle && chatbotKnowledgeBase.learningStyles[learningStyle as keyof typeof chatbotKnowledgeBase.learningStyles]) {
        const styleInfo = chatbotKnowledgeBase.learningStyles[learningStyle as keyof typeof chatbotKnowledgeBase.learningStyles];
        response = `As ${learningStyle}, here's how the platform adapts to you:\n\n${styleInfo.features.map(feature => `• ${feature}`).join('\n')}`;
        suggestions = ["How to retake the quiz?", "What are course difficulty ratings?", "Tell me about daily challenges"];
      } else {
        response = "Learning styles help personalize your experience! Take the quiz in the purple banner to discover whether you're The Interactor, The Architect, The Problem Solver, or The Adventurer. Each style gets different question types, study tips, and course recommendations.";
        suggestions = ["How to take the quiz?", "What are the different learning styles?", "How does personalization work?"];
      }
      
      if (needsVisualGuide) {
        imageData = getNavigationImage(chatbotKnowledgeBase.features.learningStyle.imageKey);
      }
    }

    // Course difficulty
    else if (message.includes('course') && (message.includes('difficult') || message.includes('easy') || message.includes('fit'))) {
      response = `${chatbotKnowledgeBase.features.courseFit.purpose}\n\n${chatbotKnowledgeBase.features.courseFit.insights}\n\n${chatbotKnowledgeBase.features.courseFit.tips}`;
      suggestions = ["Why is this course harder for me?", "How to succeed in challenging courses?", "What makes a course easier?"];
      
      if (needsVisualGuide) {
        imageData = getNavigationImage(chatbotKnowledgeBase.features.courseFit.imageKey);
      }
    }

    // Dashboard navigation
    else if (message.includes('dashboard') || message.includes('navigate') || message.includes('tabs')) {
      response = `${chatbotKnowledgeBase.features.dashboard.overview}\n\n${chatbotKnowledgeBase.features.dashboard.navigation}\n\n${chatbotKnowledgeBase.features.dashboard.customization}`;
      suggestions = ["How to customize features?", "What's in each tab?", "How to use analytics?"];
      
      if (needsVisualGuide) {
        imageData = getNavigationImage(chatbotKnowledgeBase.features.dashboard.imageKey);
      }
    }

    // Troubleshooting
    else if (message.includes('not working') || message.includes('problem') || message.includes('issue') || message.includes('error')) {
      response = "I can help troubleshoot! Here are common solutions:\n\n• Try refreshing with the 'Refresh' button (top right)\n• Check that needed features are enabled in Settings\n• Make sure you've completed the learning style quiz\n• Clear your browser cache if issues persist\n\nWhat specific issue are you experiencing?";
      suggestions = ["Quiz not showing up", "Features are missing", "Data not loading", "Personalization not working"];
    }

    // Help and general guidance
    else if (message.includes('help') || message.includes('how') || message.includes('what')) {
      response = "I'm here to help you make the most of your learning platform! Here are some key areas I can assist with:\n\n• Learning style assessment and personalization\n• Dashboard navigation and features\n• Daily challenges and streak maintenance\n• Understanding analytics and progress tracking\n• Course difficulty and mastery levels\n• Troubleshooting and customization\n\nWhat specific topic would you like to explore?";
      suggestions = quickSuggestions.slice(0, 4);
    }

    // Fallback for unrecognized queries
    else {
      response = "I'd love to help with that! I specialize in helping students navigate the learning platform. You can ask me about:\n\n• Learning styles and personalization\n• Daily challenges and streaks\n• Mastery level tracking\n• Course difficulty analysis\n• Dashboard features and analytics\n• Troubleshooting issues\n\nTry asking something more specific, or choose from the suggestions below!";
      suggestions = ["Show me platform features", "How does personalization work?", "Help with daily challenges", "Explain the analytics"];
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      image: imageData
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const botResponse = await generateResponse(text);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([getInitialGreeting()]);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 bg-white shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 bg-white/20">
                <AvatarFallback className="bg-white/20 text-white">
                  <Brain className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm">Learning Assistant</CardTitle>
                {learningStyle && (
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30 mt-1">
                    {learningStyle}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="p-0 h-[440px] flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        
                        {/* Display image if present */}
                        {message.image && (
                          <div className="mt-3 rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={message.image.url}
                              alt={message.image.alt}
                              className="w-full h-32 object-cover rounded"
                            />
                            {message.image.caption && (
                              <p className="text-xs text-gray-600 mt-1 italic">{message.image.caption}</p>
                            )}
                          </div>
                        )}
                        
                        {message.suggestions && (
                          <div className="mt-3 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSendMessage(suggestion)}
                                className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-1 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about navigating the platform..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <ImageIcon className="h-3 w-3" />
                  <span>Visual navigation guides included automatically</span>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  BookOpen, 
  Code, 
  Calculator, 
  Zap,
  MessageCircle,
  Clock,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  GraduationCap,
  HelpCircle,
  CheckCircle,
  Target,
  Sparkles
} from 'lucide-react';

interface GeneralChatbotProps {
  learningStyle: string | null;
  initialQuestion?: string;
  initialAnswer?: string;
  mode?: 'general' | 'challenge';
  isNewChallenge?: boolean;
  onChallengeComplete?: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category: 'general' | 'homework' | 'concept' | 'motivation';
}

export default function GeneralChatbot({ 
  learningStyle, 
  initialQuestion, 
  initialAnswer, 
  mode = 'general', 
  isNewChallenge = false,
  onChallengeComplete 
}: GeneralChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [challengeMessages, setChallengeMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageFeedback, setMessageFeedback] = useState<Record<string, 'up' | 'down' | null>>({});
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showChallengeButtons, setShowChallengeButtons] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'challenge'>(mode);
  const [challengePhase, setChallengePhase] = useState<'welcome' | 'answering' | 'feedback' | 'conversation'>('welcome');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeSessionEnded, setChallengeSessionEnded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Memoized static data to prevent re-renders
  const quickActions = useMemo(() => [
    {
      label: "Guide me",
      icon: GraduationCap,
      prompt: "Can you guide me through this step by step?",
      color: "text-blue-700 border-blue-300 hover:bg-blue-50"
    },
    {
      label: "Test me",
      icon: Calculator,
      prompt: "Give me a practice question to test my understanding",
      color: "text-green-700 border-green-300 hover:bg-green-50"
    },
    {
      label: "Check my answer",
      icon: CheckCircle,
      prompt: "I've solved a problem. Can you check my answer?",
      color: "text-purple-700 border-purple-300 hover:bg-purple-50"
    },
    {
      label: "Explain concept",
      icon: BookOpen,
      prompt: "Can you explain this concept in detail?",
      color: "text-orange-700 border-orange-300 hover:bg-orange-50"
    },
    {
      label: "Study tips",
      icon: Lightbulb,
      prompt: "What are some effective study strategies for this topic?",
      color: "text-yellow-700 border-yellow-300 hover:bg-yellow-50"
    }
  ], []);

  const suggestedQuestions = useMemo(() => [
    {
      question: "What are the fundamental rules of differentiation?",
      category: "Calculus",
      difficulty: "Beginner"
    },
    {
      question: "How do I solve related rates problems?",
      category: "Applications",
      difficulty: "Intermediate"
    },
    {
      question: "Can you explain the relationship between derivatives and integrals?",
      category: "Theory",
      difficulty: "Advanced"
    },
    {
      question: "What's the best way to approach optimization problems?",
      category: "Problem Solving",
      difficulty: "Intermediate"
    },
    {
      question: "How do limits work in calculus?",
      category: "Foundations",
      difficulty: "Beginner"
    }
  ], []);

  const sampleConversations = useMemo(() => [
    {
      title: "Chain Rule Applications",
      preview: "Discussing how to apply the chain rule to complex composite functions...",
      time: "2h ago",
      category: "Homework Help"
    },
    {
      title: "Optimization Problem Strategy",
      preview: "Breaking down the steps for solving max/min problems in calculus...",
      time: "1d ago",
      category: "Problem Solving"
    },
    {
      title: "Integration by Parts",
      preview: "Learning when and how to use integration by parts technique...",
      time: "3d ago",
      category: "Concept Review"
    },
    {
      title: "Related Rates Setup",
      preview: "Understanding how to set up equations for related rates problems...",
      time: "5d ago",
      category: "Applications"
    }
  ], []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleFeedback = useCallback((messageId: string, feedback: 'up' | 'down') => {
    setMessageFeedback(prev => ({
      ...prev,
      [messageId]: prev[messageId] === feedback ? null : feedback
    }));
  }, []);

  // No longer initializing welcome message for general mode - using display style instead

  // Handle tab switching
  useEffect(() => {
    if (activeTab === 'general') {
      setShowSuggestions(true);
      setShowChallengeButtons(false);
    } else if (activeTab === 'challenge') {
      setShowSuggestions(false);
      setShowChallengeButtons(challengeMessages.length === 0);
    }
  }, [activeTab, challengeMessages.length]);

  // Initialize challenge messages
  useEffect(() => {
    if (mode === 'challenge' && challengeMessages.length === 0) {
      const now = new Date();
      
      if (isNewChallenge) {
        const welcomeMessage: Message = {
          id: '1',
          type: 'bot',
          content: `🎯 **Welcome to Today's Challenge!**

Ready to test your knowledge and deepen your understanding? Let's dive into today's Mathematics I challenge.

⚠️ **Important:** This challenge session will reset at midnight. Any unfinished conversations will be lost, so make sure to complete your challenge today!`,
          timestamp: now,
          category: 'general'
        };

        const questionMessage: Message = {
          id: '2',
          type: 'bot',
          content: `📋 **Today's Challenge Question**

**Topic:** Derivatives and Chain Rule  
**Difficulty:** ⭐⭐⭐ Intermediate  
**Question Type:** Conceptual Explanation  

**Question:**  
Explain how the chain rule works when finding the derivative of composite functions. Use the example f(g(x)) where f(u) = u² and g(x) = 3x + 1 to illustrate your explanation.`,
          timestamp: now,
          category: 'homework'
        };

        setChallengeMessages([welcomeMessage, questionMessage]);
        setActiveTab('challenge');
        setChallengePhase('answering');
        setShowSuggestions(false);
        setShowChallengeButtons(false);
      } else if (initialQuestion && initialAnswer) {
        const welcomeMessage: Message = {
          id: '1',
          type: 'bot',
          content: `📚 **Daily Challenge Review Session**

Welcome to your personalized feedback session! I've reviewed your daily challenge submission and I'm here to help you deepen your understanding.

This is a focused session for today's challenge. Once we're done, this conversation will be saved to your challenge history.`,
          timestamp: now,
          category: 'general'
        };

        const userMessage: Message = {
          id: '2',
          type: 'user',
          content: `**My Answer:** ${initialAnswer}`,
          timestamp: now,
          category: 'homework'
        };

        const botResponse: Message = {
          id: '3',
          type: 'bot',
          content: `🎯 **Challenge Assessment: 87% Match**

Great work on your Question of the Day response! I can see you've thought about the chain rule and composite functions. Let me provide some feedback on your answer and help you deepen your understanding.

Your explanation shows good understanding of the basic concept. Here are some additional insights that might help:

• **The Chain Rule Formula**: When we have f(g(x)), the derivative is f'(g(x)) × g'(x)
• **Common Mistakes**: Students often forget to multiply by the inner derivative g'(x)  
• **Memory Aid**: Think "outside derivative × inside derivative"

Would you like me to work through a specific example or clarify any particular aspect of the chain rule?`,
          timestamp: now,
          category: 'concept'
        };

        setChallengeMessages([welcomeMessage, userMessage, botResponse]);
        setActiveTab('challenge');
        setChallengePhase('conversation');
        setShowSuggestions(false);
        setShowChallengeButtons(false);
      }
    }
  }, [mode, isNewChallenge, challengeMessages.length, initialQuestion, initialAnswer]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, challengeMessages, scrollToBottom]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      category: 'general'
    };

    if (activeTab === 'challenge') {
      setChallengeMessages(prev => [...prev, newUserMessage]);
    } else {
      setMessages(prev => [...prev, newUserMessage]);
    }

    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Thanks for your question! I understand you're asking about "${message}". Let me help you with that.

This is a simulated response. In a real implementation, this would connect to an AI service to provide personalized explanations based on your ${learningStyle || 'learning style'}.

Here are some key points:
• Detailed explanation tailored to your learning preferences
• Step-by-step breakdown of the concept
• Practical examples and applications
• Suggestions for further practice

Would you like me to elaborate on any specific aspect of this topic?`,
        timestamp: new Date(),
        category: 'concept'
      };

      if (activeTab === 'challenge') {
        setChallengeMessages(prev => [...prev, botResponse]);
      } else {
        setMessages(prev => [...prev, botResponse]);
      }
      setIsLoading(false);
    }, 1500);
  }, [activeTab, learningStyle]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  }, [inputValue, handleSendMessage]);

  const handleQuickAction = useCallback((prompt: string) => {
    handleSendMessage(prompt);
  }, [handleSendMessage]);

  const handleSuggestedQuestion = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  const handleEndChallengeSession = useCallback(() => {
    console.log('Ending challenge session:', challengeMessages);
    
    // Set session as ended instead of switching tabs
    setChallengeSessionEnded(true);
    
    if (onChallengeComplete) {
      onChallengeComplete();
    }
  }, [challengeMessages, onChallengeComplete]);

  const handleStartChallenge = useCallback(() => {
    const now = new Date();
    
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: `🎯 **Welcome to Today's Challenge!**

Ready to test your knowledge and deepen your understanding? Let's dive into today's Mathematics I challenge.

⚠️ **Important:** This challenge session will reset at midnight. Any unfinished conversations will be lost, so make sure to complete your challenge today!`,
      timestamp: now,
      category: 'general'
    };

    const questionMessage: Message = {
      id: '2',
      type: 'bot',
      content: `📋 **Today's Challenge Question**

**Topic:** Derivatives and Chain Rule  
**Difficulty:** ⭐⭐⭐ Intermediate  
**Question Type:** Conceptual Explanation  

**Question:**  
Explain how the chain rule works when finding the derivative of composite functions. Use the example f(g(x)) where f(u) = u² and g(x) = 3x + 1 to illustrate your explanation.`,
      timestamp: now,
      category: 'homework'
    };

    setChallengeMessages([welcomeMessage, questionMessage]);
    setChallengePhase('answering');
    setShowChallengeButtons(false);
    setShowSuggestions(false);
  }, []);

  const handleShowHint = useCallback(() => {
    const hintMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `💡 **Hint for Today's Challenge**

Remember that for composite functions like f(g(x)), you need to apply the chain rule. Start by identifying the outer function f(u) and inner function g(x), then find their derivatives separately.

**Steps to consider:**
1. Identify the outer function: f(u) = u²
2. Identify the inner function: g(x) = 3x + 1  
3. Find f'(u) and g'(x)
4. Apply the chain rule: (f ∘ g)'(x) = f'(g(x)) × g'(x)

Now try working through the example step by step!`,
      timestamp: new Date(),
      category: 'concept'
    };

    setChallengeMessages(prev => [...prev, hintMessage]);
  }, []);

  const handleSubmitChallenge = useCallback(async () => {
    if (!challengeAnswer.trim()) return;
    
    setIsLoading(true);
    
    const userAnswerMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: challengeAnswer,
      timestamp: new Date(),
      category: 'homework'
    };
    
    const acceptanceRate = Math.floor(Math.random() * 20 + 75);
    
    const feedbackMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: `🎯 **Challenge Assessment: ${acceptanceRate}% Match**

Great work on your daily challenge! Your explanation demonstrates solid understanding of the chain rule concept. Let me provide some detailed feedback and help you deepen your understanding.

**What you did well:**
• Clear identification of composite function structure
• Correct application of chain rule formula
• Good use of mathematical notation

**Areas for enhancement:**
• Consider explaining the "why" behind each step
• Include verification by substituting values
• Practice with more complex composite functions

Let's work through this together! Would you like me to:
- Show alternative solution approaches?
- Provide similar practice problems?
- Explain any specific concept in more detail?`,
      timestamp: new Date(),
      category: 'concept'
    };
    
    setChallengeMessages(prev => [...prev, userAnswerMessage, feedbackMessage]);
    setChallengePhase('conversation');
    setChallengeAnswer('');
    setIsLoading(false);
  }, [challengeAnswer]);

  const renderMessages = useCallback((messageList: Message[]) => (
    <div className="max-w-4xl mx-auto space-y-6">
      {messageList.map((message) => (
        <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
          {message.type === 'bot' && (
            <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : ''}`}>
            <div className={`rounded-2xl px-4 py-3 ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12' 
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 mt-2 ${message.type === 'user' ? 'justify-end mr-0' : 'justify-start ml-0'}`}>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              
              {message.type === 'bot' && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 ${messageFeedback[message.id] === 'up' ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                    onClick={() => handleFeedback(message.id, 'up')}
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 ${messageFeedback[message.id] === 'down' ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                    onClick={() => handleFeedback(message.id, 'down')}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {message.type === 'user' && (
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gray-200">
                <User className="h-4 w-4 text-gray-600" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-4 justify-start">
          <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="max-w-3xl">
            <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500">Assistant is typing...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  ), [isLoading, messageFeedback, handleFeedback]);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden pt-6">
      {/* Left Sidebar - Conversation History */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* Recent Conversations Section */}
        <div className="border-b border-gray-200 flex flex-col min-h-0 flex-1">
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="font-semibold text-gray-900">Recent Conversations</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {sampleConversations.map((conv, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{conv.title}</h4>
                      <span className="text-xs text-gray-500 ml-2">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.preview}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {conv.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* AI Suggested Questions Section */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h3 className="font-medium text-gray-900">AI Suggested Questions</h3>
            </div>
            <p className="text-xs text-gray-600">Based on what students commonly ask</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {suggestedQuestions.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleSuggestedQuestion(item.question)}
                  >
                    <p className="text-sm text-gray-900 font-medium mb-2">{item.question}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{item.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white flex flex-col min-h-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Mathematics I Learning Assistant</h1>
                <p className="text-sm text-gray-600">
                  {learningStyle ? `Personalized for ${learningStyle}` : 'Ready to help you learn'}
                </p>
              </div>
            </div>
            
            {/* Mode Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'general' | 'challenge')} className="w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  General Chat
                </TabsTrigger>
                <TabsTrigger value="challenge" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Daily Challenge
                  {challengeMessages.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                      {challengeMessages.length - 1}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Messages */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'general' | 'challenge')} className="flex-1 flex flex-col min-h-0">
          <TabsContent value="general" className="flex-1 min-h-0 m-0">
            <ScrollArea className="h-full p-6">
              {messages.length === 0 ? (
                <div className="max-w-4xl mx-auto text-center py-12">
                  <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">General Chat Session</h3>
                  <p className="text-gray-600 mb-6">Welcome! I'm your Mathematics I learning assistant, designed to help you master calculus concepts. {learningStyle ? `Since you're ${learningStyle}, I'll adapt my explanations to match your learning preferences.` : ''}</p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">How I Can Help You</h4>
                        <ul className="text-sm text-blue-700 space-y-1 mb-3">
                          <li>• **Guide you** through complex problems step-by-step</li>
                          <li>• **Test your understanding** with practice questions</li>
                          <li>• **Check your answers** and provide detailed feedback</li>
                          <li>• **Explain concepts** using examples and analogies</li>
                          <li>• **Share study tips** tailored to your learning style</li>
                        </ul>
                        
                        <h5 className="font-medium text-blue-900 mb-1 mt-4">Getting Started</h5>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Use the action buttons below for quick help</li>
                          <li>• Type any question about Mathematics I</li>
                          <li>• Switch to Daily Challenge for focused practice</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                renderMessages(messages)
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="challenge" className="flex-1 min-h-0 m-0">
            {challengeMessages.length > 0 && (
              <div className={`border-b border-gray-200 px-6 py-3 ${challengeSessionEnded ? 'bg-gray-100' : 'bg-purple-50'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${challengeSessionEnded ? 'bg-gray-400' : 'bg-purple-500'}`}></div>
                  <span className={`text-sm font-medium ${challengeSessionEnded ? 'text-gray-600' : 'text-purple-900'}`}>
                    {challengeSessionEnded ? 'Inactive Challenge Session' : 'Active Challenge Session'}
                  </span>
                </div>
              </div>
            )}
            <ScrollArea className="h-full p-6">
              {challengeMessages.length === 0 ? (
                <div className="max-w-4xl mx-auto text-center py-12">
                  <Target className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Daily Challenge Session</h3>
                  <p className="text-gray-600 mb-6">Complete today's challenge to start a focused review session here. Challenge conversations are separate from your general chat history.</p>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-900 mb-2">How Daily Challenges Work</h4>
                        <ul className="text-sm text-purple-700 space-y-1 mb-3">
                          <li>• Complete challenges to get personalized feedback</li>
                          <li>• Focused sessions help deepen understanding</li>
                          <li>• Conversations are saved separately for analytics</li>
                          <li>• Switch to General Chat for other questions</li>
                        </ul>
                        
                        <h5 className="font-medium text-purple-900 mb-1 mt-4">Challenge Details Explained</h5>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• **Topic** - The mathematical concept being tested</li>
                          <li>• **Difficulty** - ⭐ Basic, ⭐⭐ Intermediate, ⭐⭐⭐ Advanced</li>
                          <li>• **Acceptance Rate** - Percentage of students who answered correctly</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {showChallengeButtons && (
                    <Button
                      onClick={handleStartChallenge}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Start Challenge
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  {renderMessages(challengeMessages)}
                  
                  {/* Show Hint Button - After challenge question */}
                  {challengePhase === 'answering' && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        variant="outline"
                        onClick={handleShowHint}
                        className="text-purple-600 border-purple-300 hover:bg-purple-50"
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Show Hint
                      </Button>
                    </div>
                  )}
                  
                  {/* Challenge Answer Interface */}
                  {challengePhase === 'answering' && (
                    <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200 max-w-4xl mx-auto">
                      <h4 className="font-medium text-gray-900 mb-3">Your Answer</h4>
                      <textarea
                        value={challengeAnswer}
                        onChange={(e) => setChallengeAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={handleSubmitChallenge}
                          disabled={!challengeAnswer.trim() || isLoading}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {isLoading ? 'Submitting...' : 'Submit Answer'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Action Buttons and Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto mr-20"> {/* Added right margin to avoid floating chatbot */}
            {/* Quick Action Buttons - Show only in general tab when suggestions are visible */}
            {activeTab === 'general' && showSuggestions && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={`${action.color} transition-all duration-200 hover:scale-105`}
                      onClick={() => handleQuickAction(action.prompt)}
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Choose an action above or type your question below
                </p>
              </div>
            )}

            {/* Input Field - Hide during challenge answering phase but show in general tab */}
            {!(activeTab === 'challenge' && challengePhase === 'answering') && !(activeTab === 'challenge' && challengeSessionEnded) && (
              <div className="flex gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    activeTab === 'challenge' 
                      ? "Ask follow-up questions about today's challenge..." 
                      : "Ask me anything about Mathematics I..."
                  }
                  className="flex-1 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* End Challenge Session Button - Show after feedback, hide when ended */}
            {activeTab === 'challenge' && challengePhase === 'conversation' && !challengeSessionEnded && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleEndChallengeSession}
                  variant="outline"
                  className="text-purple-700 border-purple-300 hover:bg-purple-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  End Daily Challenge Session
                </Button>
              </div>
            )}

            {/* Session Ended Message - Show when challenge session has ended */}
            {activeTab === 'challenge' && challengeSessionEnded && (
              <div className="flex justify-center mt-4">
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-6 py-3 text-center">
                  <span className="text-gray-600 font-medium">Daily Challenge Session Has Ended</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
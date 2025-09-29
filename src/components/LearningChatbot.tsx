// Fetch reply from RAG backend
async function fetchRagReply(query: string): Promise<string> {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) throw new Error("Backend error");
    const data = await response.json();
    return data.answer || "Sorry, I couldn't find an answer.";
  } catch (err) {
    return "Error contacting the learning assistant backend.";
  }
}
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Brain, Send, X, Minimize2, Maximize2, RotateCcw, Lightbulb, BookOpen, Target } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  isLoading?: boolean;
}

interface LearningChatbotProps {
  learningStyle?: string | null;
}

// Learning Theory Knowledge Base
const learningTheoryKnowledgeBase = {
  kolbsTheory: {
    overview: "Kolb's Learning Theory identifies four distinct learning styles based on how you prefer to process information and experience. It's based on a four-stage learning cycle where effective learning happens through the complete cycle.",
    cycle: [
      "🎯 **Concrete Experience (CE)** - Learning through direct experience, feelings, and real-world situations",
      "🤔 **Reflective Observation (RO)** - Learning by watching, reflecting, and observing from different perspectives", 
      "💭 **Abstract Conceptualization (AC)** - Learning through thinking, analysis, and theoretical understanding",
      "⚡ **Active Experimentation (AE)** - Learning through hands-on practice, testing ideas, and experimentation"
    ],
    styles: {
      "The Interactor": {
        description: "Combines Concrete Experience + Reflective Observation. You learn best through social interaction, discussion, and collaborative experiences.",
        strengths: ["Great at working with people", "Excellent listening skills", "Strong empathy and emotional intelligence", "Natural at facilitating discussions"],
        challenges: ["May struggle with theoretical concepts", "Can be indecisive when quick decisions are needed", "May avoid confrontation even when necessary"],
        ideal_environment: "Group settings, collaborative projects, discussion-based learning, peer feedback sessions"
      },
      "The Architect": {
        description: "Combines Abstract Conceptualization + Reflective Observation. You prefer structured, methodical approaches with clear frameworks and detailed analysis.",
        strengths: ["Excellent analytical thinking", "Strong planning and organization skills", "Good at theoretical understanding", "Systematic problem-solving approach"],
        challenges: ["May get stuck in analysis paralysis", "Can be slow to take action", "May struggle with ambiguous situations"],
        ideal_environment: "Structured learning, detailed explanations, theoretical frameworks, systematic approaches"
      },
      "The Problem Solver": {
        description: "Combines Abstract Conceptualization + Active Experimentation. You learn best through hands-on practice, experimentation, and real-world challenges.",
        strengths: ["Excellent at practical application", "Quick decision-making", "Good at solving technical problems", "Results-oriented approach"],
        challenges: ["May rush without enough reflection", "Can be impatient with theory", "May overlook people's feelings in decisions"],
        ideal_environment: "Hands-on practice, technical challenges, immediate application, problem-solving scenarios"
      },
      "The Adventurer": {
        description: "Combines Concrete Experience + Active Experimentation. You thrive in dynamic, varied learning environments with creative exploration.",
        strengths: ["Highly adaptable and flexible", "Great at innovation and creativity", "Natural leadership in dynamic situations", "Excellent at seizing opportunities"],
        challenges: ["May struggle with routine tasks", "Can be disorganized", "May start many projects without finishing"],
        ideal_environment: "Dynamic settings, variety and change, creative projects, leadership opportunities"
      }
    }
  },
  
  studyTips: {
    "The Interactor": [
      "Form study groups and engage in regular discussions about course material",
      "Explain concepts to classmates - teaching others reinforces your own learning",
      "Use collaborative online platforms and discussion forums actively",
      "Participate in class discussions and Q&A sessions",
      "Connect with professors during office hours for deeper conversations",
      "Create peer review sessions for assignments and projects"
    ],
    "The Architect": [
      "Create detailed study schedules and stick to systematic learning plans",
      "Build comprehensive notes with clear hierarchies and frameworks",
      "Break complex topics into structured, logical components",
      "Use mind maps and flowcharts to organize information visually",
      "Focus on understanding theoretical foundations before practical applications",
      "Develop systematic review cycles for long-term retention"
    ],
    "The Problem Solver": [
      "Seek out hands-on projects and practical applications of theories",
      "Practice with real-world case studies and problem sets",
      "Build working examples and prototypes when possible",
      "Focus on immediate application rather than just memorizing concepts",
      "Learn through trial and error with quick feedback loops",
      "Set up practice environments where you can experiment safely"
    ],
    "The Adventurer": [
      "Mix different learning formats - videos, readings, interactive content",
      "Explore creative approaches and interdisciplinary connections",
      "Set flexible goals and adapt your learning style as needed",
      "Seek variety in your study methods and environments",
      "Connect learning to personal interests and real-world experiences",
      "Use gamification and challenges to maintain engagement"
    ]
  },

  improvementStrategies: {
    general: [
      "🍅 Use the Pomodoro Technique: 25 minutes focused work, 5 minute breaks",
      "🧠 Practice active recall: Test yourself without looking at notes",
      "📚 Implement spaced repetition: Review material at increasing intervals",
      "🎯 Set specific, measurable learning goals for each study session",
      "🔇 Create a distraction-free study environment",
      "💤 Ensure adequate sleep (7-9 hours) for memory consolidation"
    ],
    personalized: {
      "The Interactor": "Focus on collaborative learning - join study groups, find study buddies, or teach concepts to others to reinforce your understanding",
      "The Architect": "Leverage your systematic nature - create detailed study plans, use structured note-taking methods, and build comprehensive knowledge frameworks",
      "The Problem Solver": "Emphasize practical application - work on hands-on projects, solve real problems, and immediately apply what you learn",
      "The Adventurer": "Embrace variety - mix up your study methods, explore creative approaches, and connect learning to your diverse interests"
    }
  },

  learningChallenges: {
    "The Interactor": {
      challenge: "Struggling with individual study and theoretical concepts",
      solutions: [
        "Find a study partner or join online study communities",
        "Schedule regular check-ins with classmates or tutors",
        "Use discussion forums to ask questions and engage with others",
        "Try explaining theoretical concepts out loud as if teaching someone"
      ]
    },
    "The Architect": {
      challenge: "Analysis paralysis and difficulty with practical application",
      solutions: [
        "Set time limits for planning and analysis phases",
        "Start with small, low-risk practical exercises",
        "Create structured templates for moving from theory to practice",
        "Use the 80/20 rule - implement when you have 80% understanding"
      ]
    },
    "The Problem Solver": {
      challenge: "Impatience with theory and rushing through concepts",
      solutions: [
        "Set specific 'theory time' with clear start and end points",
        "Connect every theoretical concept to a practical example",
        "Use timers to force yourself to spend adequate time on foundations",
        "Find real-world case studies that demonstrate theoretical importance"
      ]
    },
    "The Adventurer": {
      challenge: "Difficulty with routine study and staying focused",
      solutions: [
        "Create variety in your study schedule and methods",
        "Use shorter, more frequent study sessions",
        "Gamify your learning with challenges and rewards",
        "Connect learning goals to your personal interests and ambitions"
      ]
    }
  }
};

// Quick suggestions for the Learning Theory Assistant
const learningTheorySuggestions = [
  "What does my learning style mean?",
  "Give me study tips for my learning type",
  "Tell me about Kolb's Learning Theory",
  "How can I improve my learning?",
  "What are my learning strengths and challenges?",
  "How do I overcome study difficulties?",
  "Explain the learning cycle to me",
  "What's the best study environment for me?"
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
    let greeting = "Hello! I'm your Learning Theory Assistant 🧠\n\nI'm here to help you understand learning theories like Kolb's model, discover insights about your learning preferences, and provide personalized study tips to enhance your learning journey. What would you like to explore?";
    let suggestions = learningTheorySuggestions.slice(0, 4);

    if (learningStyle) {
      greeting = `Hello! I'm your Learning Theory Assistant 🧠\n\nI can see you're identified as **${learningStyle}** - that's fantastic! I'm here to help you understand what this means, how you learn best, and provide personalized strategies to maximize your learning potential.\n\nWhat would you like to know about your learning style or learning theories in general?`;
      suggestions = [
        "What does being " + learningStyle + " mean?",
        "Give me study tips for my learning type",
        "What are my strengths and challenges?",
        "Tell me about Kolb's Learning Theory"
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

  const generateResponse = async (userMessage: string): Promise<Message> => {
    const message = userMessage.toLowerCase();
    let response = "I'm here to help you understand learning theories and improve your study strategies! Let me provide some insights.";
    let suggestions: string[] = [];

    // Kolb's Learning Theory explanation
    if (message.includes('kolb') || message.includes('learning theory') || message.includes('learning cycle')) {
      const theory = learningTheoryKnowledgeBase.kolbsTheory;
      response = `**Kolb's Learning Theory** 📚\n\n${theory.overview}\n\n**The Four-Stage Learning Cycle:**\n${theory.cycle.join('\n')}\n\nThis theory helps us understand that people have different preferences for how they like to process information and gain experience. The most effective learning happens when you go through all four stages of the cycle!`;
      suggestions = ["What's my learning style mean?", "How does this apply to studying?", "Give me practical study tips"];
    }
    
    // Learning style explanation (specific to user's style)
    else if ((message.includes('what does') && (message.includes('learning style') || message.includes('learning preference'))) || 
             (message.includes('my style') || message.includes('my learning type')) ||
             (learningStyle && message.includes(learningStyle.toLowerCase()))) {
      if (learningStyle && learningTheoryKnowledgeBase.kolbsTheory.styles[learningStyle as keyof typeof learningTheoryKnowledgeBase.kolbsTheory.styles]) {
        const styleInfo = learningTheoryKnowledgeBase.kolbsTheory.styles[learningStyle as keyof typeof learningTheoryKnowledgeBase.kolbsTheory.styles];
        response = `**${learningStyle}** 🎯\n\n${styleInfo.description}\n\n**Your Learning Strengths:**\n${styleInfo.strengths.map(s => `✅ ${s}`).join('\n')}\n\n**Potential Challenges:**\n${styleInfo.challenges.map(c => `⚠️ ${c}`).join('\n')}\n\n**Your Ideal Learning Environment:**\n📍 ${styleInfo.ideal_environment}`;
        suggestions = ["Give me study tips for my type", "How can I overcome my challenges?", "What study environment works best?"];
      } else {
        response = "To provide personalized insights about your learning style, you'll need to complete the learning style assessment first! 📝\n\nThe quiz identifies whether you're The Interactor, The Architect, The Problem Solver, or The Adventurer based on Kolb's Learning Theory.\n\nOnce you know your style, I can provide targeted advice for your specific learning preferences.";
        suggestions = ["Tell me about Kolb's theory", "What are the different learning styles?", "How can I improve my learning in general?"];
      }
    }
    
    // Study tips and improvement strategies
    else if (message.includes('study tips') || message.includes('how to study') || message.includes('study better') || 
             message.includes('improve') || message.includes('learn better')) {
      if (learningStyle && learningTheoryKnowledgeBase.studyTips[learningStyle as keyof typeof learningTheoryKnowledgeBase.studyTips]) {
        const tips = learningTheoryKnowledgeBase.studyTips[learningStyle as keyof typeof learningTheoryKnowledgeBase.studyTips];
        const personalizedStrategy = learningTheoryKnowledgeBase.improvementStrategies.personalized[learningStyle as keyof typeof learningTheoryKnowledgeBase.improvementStrategies.personalized];
        
        response = `**Personalized Study Tips for ${learningStyle}** 📚\n\n${tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}\n\n**Key Strategy for Your Type:**\n🎯 ${personalizedStrategy}\n\n**Universal Study Techniques:**\n${learningTheoryKnowledgeBase.improvementStrategies.general.join('\n')}`;
        suggestions = ["What are my learning challenges?", "How to create the best study environment?", "Tell me about my learning strengths"];
      } else {
        response = `**Universal Study Strategies** 📚\n\nHere are proven techniques that work for all learning styles:\n\n${learningTheoryKnowledgeBase.improvementStrategies.general.join('\n')}\n\nFor personalized tips based on your specific learning style, complete the learning style assessment first!`;
        suggestions = ["Tell me about learning styles", "How does Kolb's theory work?", "What's the learning cycle?"];
      }
    }
    
    // Learning challenges and solutions
    else if (message.includes('challenge') || message.includes('difficulty') || message.includes('struggle') || 
             message.includes('problem') || message.includes('overcome')) {
      if (learningStyle && learningTheoryKnowledgeBase.learningChallenges[learningStyle as keyof typeof learningTheoryKnowledgeBase.learningChallenges]) {
        const challengeInfo = learningTheoryKnowledgeBase.learningChallenges[learningStyle as keyof typeof learningTheoryKnowledgeBase.learningChallenges];
        response = `**Common Challenge for ${learningStyle}** ⚠️\n\n${challengeInfo.challenge}\n\n**Solutions to Try:**\n${challengeInfo.solutions.map((sol, i) => `${i + 1}. ${sol}`).join('\n')}\n\nRemember, recognizing your challenges is the first step to overcoming them! 💪`;
        suggestions = ["Give me more study tips", "What are my learning strengths?", "How to create better study habits?"];
      } else {
        response = "Learning challenges are completely normal! 💪\n\nEveryone faces difficulties, but understanding your learning style helps you develop targeted strategies.\n\nCommon challenges include:\n• Difficulty concentrating\n• Information not sticking\n• Feeling overwhelmed\n• Lack of motivation\n\nOnce you know your learning style, I can provide specific strategies to overcome these challenges!";
        suggestions = ["Tell me about learning styles", "How can I improve my focus?", "What study methods work best?"];
      }
    }
    
    // Strengths and positive aspects
    else if (message.includes('strength') || message.includes('good at') || message.includes('advantage') || 
             message.includes('positive') || message.includes('excel')) {
      if (learningStyle && learningTheoryKnowledgeBase.kolbsTheory.styles[learningStyle as keyof typeof learningTheoryKnowledgeBase.kolbsTheory.styles]) {
        const styleInfo = learningTheoryKnowledgeBase.kolbsTheory.styles[learningStyle as keyof typeof learningTheoryKnowledgeBase.kolbsTheory.styles];
        response = `**Your Learning Strengths as ${learningStyle}** ⭐\n\n${styleInfo.strengths.map(s => `🌟 ${s}`).join('\n')}\n\nThese are your natural advantages! Focus on study methods and environments that leverage these strengths. When you align your learning approach with your natural preferences, you'll find studying becomes more effective and enjoyable! 🚀`;
        suggestions = ["How can I use these strengths in studying?", "What challenges should I watch out for?", "Give me study tips for my type"];
      } else {
        response = "Everyone has unique learning strengths! 🌟\n\nDiscovering your learning style helps you identify and leverage your natural advantages. Whether you're great at:\n• Analytical thinking\n• Creative problem-solving\n• Social collaboration\n• Hands-on application\n\nKnowing your style helps you study smarter, not harder!";
        suggestions = ["What are the different learning styles?", "How do I find my learning style?", "Tell me about Kolb's theory"];
      }
    }
    
    // Study environment questions
    else if (message.includes('environment') || message.includes('where to study') || message.includes('study space')) {
      if (learningStyle && learningTheoryKnowledgeBase.kolbsTheory.styles[learningStyle as keyof typeof learningTheoryKnowledgeBase.kolbsTheory.styles]) {
        const styleInfo = learningTheoryKnowledgeBase.kolbsTheory.styles[learningStyle as keyof typeof learningTheoryKnowledgeBase.kolbsTheory.styles];
        response = `**Ideal Study Environment for ${learningStyle}** 🏫\n\n📍 **Perfect Setting:** ${styleInfo.ideal_environment}\n\n**Additional Environment Tips:**\n• Choose locations that match your energy levels\n• Minimize distractions that don't suit your style\n• Have necessary tools and resources easily accessible\n• Consider lighting, noise levels, and comfort\n• Plan for breaks that recharge you`;
        suggestions = ["What study methods work best for me?", "How to deal with distractions?", "Tell me about my learning strengths"];
      } else {
        response = "Creating the right study environment is crucial for effective learning! 🏫\n\n**General Environment Tips:**\n• Find a quiet, well-lit space\n• Minimize distractions (phone, social media)\n• Keep necessary materials within reach\n• Ensure comfortable temperature\n• Have a dedicated study area\n\nYour specific learning style will determine whether you prefer:\n• Solo vs. group study spaces\n• Structured vs. flexible arrangements\n• Theory-focused vs. hands-on setups";
        suggestions = ["What are the learning styles?", "How do I improve my focus?", "Tell me about study strategies"];
      }
    }
    
    // General help and guidance
    else if (message.includes('help') || message.includes('what can you') || message.includes('how do you')) {
      response = "I'm your Learning Theory Assistant! 🧠 Here's how I can help you:\n\n🎯 **Learning Style Insights** - Understand what your learning preference means\n📚 **Study Strategies** - Get personalized tips based on your learning type\n🔬 **Learning Theory** - Learn about Kolb's theory and other learning frameworks\n💪 **Overcome Challenges** - Find solutions to common study difficulties\n⭐ **Leverage Strengths** - Discover and use your natural learning advantages\n🏫 **Study Environment** - Create the perfect learning space for your style\n\nWhat specific area would you like to explore?";
      suggestions = learningTheorySuggestions.slice(0, 4);
    }
    
    // Fallback response
    else {
      response = "I specialize in learning theories and helping you understand your learning preferences! 🧠\n\nI can help you with:\n• Understanding Kolb's Learning Theory\n• Explaining your learning style and what it means\n• Providing personalized study tips and strategies\n• Overcoming learning challenges\n• Creating the best study environment for you\n\nTry asking me something specific about learning theories or your learning style!";
      suggestions = ["What does my learning style mean?", "Tell me about Kolb's theory", "Give me study tips", "How can I learn better?"];
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(async () => {
      const botResponse = await generateResponse(text);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
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
      <div 
        className="fixed bottom-6 right-6 z-50"
        data-tutorial="learning-theory-assistant"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
          size="lg"
        >
          <Brain className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-[400px] max-h-[calc(100vh-3rem)] sm:max-w-[384px]">
      <Card className={`w-[calc(100vw-3rem)] sm:w-96 max-w-full bg-white shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px] max-h-[calc(100vh-3rem)]'} overflow-hidden`}>
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 bg-white/20">
                <AvatarFallback className="bg-white/20 text-white">
                  <Brain className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm">Learning Theory Assistant</CardTitle>
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
                title="Clear conversation"
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
            <CardContent className="p-0 h-[440px] max-h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 p-4 h-full overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                      <div className={`max-w-[85%] w-auto rounded-lg px-3 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      } break-words overflow-hidden`}>
                        <p className="text-sm whitespace-pre-line break-words word-wrap leading-relaxed">{message.content}</p>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.sender === 'bot' && (
                          <div className="mt-3 space-y-2 max-w-full overflow-hidden">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="text-xs h-auto p-2 w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 min-h-[32px] break-words text-wrap max-w-full overflow-hidden"
                                onClick={() => handleSendMessage(suggestion)}
                              >
                                <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-left break-words leading-tight text-wrap overflow-hidden">{suggestion}</span>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-100 text-gray-900">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex gap-2 max-w-full">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about learning theories, study tips..."
                    className="flex-1 min-w-0"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  ArrowLeft, 
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
  TrendingUp
} from 'lucide-react';

interface GeneralChatbotProps {
  learningStyle: string | null;
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: 'general' | 'code' | 'concept' | 'homework';
}

const quickActions = [
  {
    icon: BookOpen,
    label: 'Explain a concept',
    prompt: 'Can you explain a concept I\'m struggling with?',
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
  },
  {
    icon: Code,
    label: 'Help with code',
    prompt: 'I need help with a coding problem',
    color: 'bg-green-100 text-green-700 hover:bg-green-200'
  },
  {
    icon: Calculator,
    label: 'Solve math problem',
    prompt: 'Can you help me solve a math problem step by step?',
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
  },
  {
    icon: Lightbulb,
    label: 'Study tips',
    prompt: 'What are some effective study strategies for my learning style?',
    color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
  }
];

const sampleConversations = [
  {
    title: 'Binary Search Trees',
    preview: 'Explained insertion and deletion operations...',
    time: '2 hours ago'
  },
  {
    title: 'React Hooks',
    preview: 'Discussed useState and useEffect patterns...',
    time: '1 day ago'
  },
  {
    title: 'Database Normalization',
    preview: 'Covered 1NF, 2NF, and 3NF with examples...',
    time: '3 days ago'
  }
];

export default function GeneralChatbot({ learningStyle, onBack }: GeneralChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello! I'm your learning assistant. ${learningStyle ? `I know you're ${learningStyle}, so I'll adapt my explanations to match your learning style.` : ''} What would you like to explore today?`,
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot response based on learning style and message content
    setTimeout(() => {
      const botResponse = generateBotResponse(message, learningStyle);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        category: detectCategory(message)
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const detectCategory = (message: string): 'general' | 'code' | 'concept' | 'homework' => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('function')) {
      return 'code';
    }
    if (lowerMessage.includes('homework') || lowerMessage.includes('assignment') || lowerMessage.includes('due')) {
      return 'homework';
    }
    if (lowerMessage.includes('explain') || lowerMessage.includes('concept') || lowerMessage.includes('understand')) {
      return 'concept';
    }
    return 'general';
  };

  const generateBotResponse = (message: string, style: string | null): string => {
    const lowerMessage = message.toLowerCase();
    
    // Responses based on learning style
    const styleResponses = {
      'The Interactor': {
        prefix: "Great question! Let's work through this together. ",
        approach: "I'd recommend discussing this with classmates too - you learn best through interaction. "
      },
      'The Architect': {
        prefix: "Let me break this down systematically for you. ",
        approach: "I'll provide a structured, step-by-step explanation. "
      },
      'The Problem Solver': {
        prefix: "Let's tackle this hands-on! ",
        approach: "I'll give you practical examples and exercises to work through. "
      },
      'The Adventurer': {
        prefix: "This is exciting! Let's explore this from different angles. ",
        approach: "I'll show you creative ways to approach this problem. "
      }
    };

    const currentStyle = style && styleResponses[style as keyof typeof styleResponses];
    const prefix = currentStyle?.prefix || "Let me help you with that! ";
    const approach = currentStyle?.approach || "";

    // Topic-specific responses
    if (lowerMessage.includes('binary search') || lowerMessage.includes('bst')) {
      return `${prefix}Binary Search Trees are fascinating data structures! ${approach}

A BST maintains the property where each node's left subtree contains only values less than the node, and the right subtree contains only values greater than the node.

For insertion:
1. Start at the root
2. Compare the new value with current node
3. Go left if smaller, right if larger
4. Repeat until you find an empty spot
5. Insert the new node there

Would you like me to walk through a specific example or explain any particular operation in detail?`;
    }

    if (lowerMessage.includes('react') || lowerMessage.includes('hooks')) {
      return `${prefix}React Hooks are a powerful way to use state and lifecycle features in functional components! ${approach}

Key hooks to master:
- **useState**: Manages component state
- **useEffect**: Handles side effects and lifecycle events
- **useContext**: Accesses context values
- **useCallback**: Memoizes functions
- **useMemo**: Memoizes expensive calculations

Here's a quick useState example:
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

What specific aspect of React Hooks would you like to dive deeper into?`;
    }

    if (lowerMessage.includes('study') || lowerMessage.includes('tips')) {
      let personalizedTips = '';
      
      if (style === 'The Interactor') {
        personalizedTips = `As an Interactor, here are study tips perfect for you:
- Form study groups and explain concepts to others
- Use discussion forums and collaborative platforms
- Practice teaching concepts - it reinforces your learning
- Join online communities related to your subjects`;
      } else if (style === 'The Architect') {
        personalizedTips = `As an Architect, these structured approaches will work well:
- Create detailed study schedules and stick to them
- Build comprehensive notes with clear hierarchies
- Use mind maps to organize complex information
- Break large topics into smaller, manageable chunks`;
      } else if (style === 'The Problem Solver') {
        personalizedTips = `As a Problem Solver, focus on hands-on learning:
- Work through practical exercises and real-world problems
- Build projects that apply what you're learning
- Seek out case studies and examples
- Practice with coding challenges and problem sets`;
      } else if (style === 'The Adventurer') {
        personalizedTips = `As an Adventurer, embrace variety in your learning:
- Mix different study formats (videos, reading, interactive)
- Explore connections between different subjects
- Set flexible goals and adapt your approach
- Try creative projects and unconventional methods`;
      } else {
        personalizedTips = `Here are some universal study tips:
- Use active recall techniques
- Practice spaced repetition
- Take regular breaks (Pomodoro technique)
- Create a distraction-free study environment`;
      }

      return `${prefix}${personalizedTips}

General effective strategies:
- Review material within 24 hours of learning
- Use the Feynman Technique: explain concepts in simple terms
- Connect new information to what you already know
- Test yourself regularly instead of just re-reading

What specific subject or challenge are you studying for?`;
    }

    if (lowerMessage.includes('math') || lowerMessage.includes('problem')) {
      return `${prefix}I'd be happy to help you solve math problems! ${approach}

For effective problem-solving:
1. **Understand the problem** - Read it carefully and identify what's being asked
2. **Identify given information** - List what you know
3. **Choose a strategy** - Work backwards, draw diagrams, look for patterns
4. **Execute the plan** - Show each step clearly
5. **Check your answer** - Does it make sense?

Could you share the specific problem you're working on? I can walk you through it step by step!`;
    }

    // Default response
    return `${prefix}I'm here to help you learn and understand complex topics! ${approach}

I can assist with:
- Explaining concepts in computer science, math, and related fields
- Breaking down complex problems into manageable steps
- Providing coding examples and explanations
- Offering study strategies tailored to your learning style
- Helping with homework and assignments

What specific topic or question can I help you with today?`;
  };

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar with conversation history */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="font-semibold text-gray-900">Learning Assistant</h2>
          <p className="text-sm text-gray-600">Your AI study companion</p>
        </div>

        <div className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`h-auto p-3 flex flex-col items-center gap-2 ${action.color}`}
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  <action.icon className="h-4 w-4" />
                  <span className="text-xs text-center leading-tight">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Conversations</h3>
            <div className="space-y-2">
              {sampleConversations.map((conv, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                  <p className="text-sm font-medium text-gray-900">{conv.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{conv.preview}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {conv.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">47</p>
              <p className="text-xs text-gray-600">Conversations</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">89%</p>
              <p className="text-xs text-gray-600">Helpfulness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 bg-blue-100">
                <AvatarFallback>
                  <Bot className="h-5 w-5 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">Learning Assistant</h3>
                <p className="text-sm text-gray-600">
                  {learningStyle ? `Optimized for ${learningStyle}` : 'Ready to help with your studies'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <Avatar className="w-8 h-8 bg-blue-100 flex-shrink-0">
                    <AvatarFallback>
                      <Bot className="h-4 w-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.category && message.type === 'bot' && (
                      <Badge variant="outline" className="text-xs">
                        {message.category}
                      </Badge>
                    )}
                  </div>
                </div>

                {message.type === 'user' && (
                  <Avatar className="w-8 h-8 bg-gray-100 flex-shrink-0">
                    <AvatarFallback>
                      <User className="h-4 w-4 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 bg-blue-100">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
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

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your studies..."
                  className="pr-12 min-h-[48px]"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>AI-powered responses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
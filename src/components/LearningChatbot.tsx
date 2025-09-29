import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Brain, Send, X, Minimize2, Maximize2, RotateCcw, Lightbulb } from 'lucide-react';

// Fetch reply from RAG backend
async function fetchRagReply(query: string): Promise<string> {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        mode: "chatbot"
      }),
    });
    if (!response.ok) {
      console.error("Backend error:", response.status, await response.text());
      throw new Error("Backend error");
    }

    let data: any;
    try {
      data = await response.json();
      console.log("fetchRagReply: parsed JSON response:", data);
    } catch (jsonErr) {
      const raw = await response.text();
      console.warn("fetchRagReply: response.json() failed, raw text:", raw);
      try {
        data = JSON.parse(raw);
        console.log("fetchRagReply: parsed stringified JSON:", data);
      } catch (parseErr) {
        console.error("fetchRagReply: Could not parse backend response as JSON.", parseErr);
        return "Sorry, I couldn't parse the backend response.";
      }
    }

    // If data.answer exists and is a stringified JSON, parse it
    if (typeof data === "object" && typeof data.answer === "string") {
      try {
        const answerObj = JSON.parse(data.answer);
        if (typeof answerObj.text === "string") {
          return answerObj.text;
        } else {
          console.warn("fetchRagReply: answerObj has no text field.", answerObj);
          return "Sorry, I couldn't find an answer in the backend response.";
        }
      } catch (err) {
        console.error("fetchRagReply: Could not parse answer field as JSON.", err);
        return "Sorry, I couldn't parse the backend answer field.";
      }
    }

    // If data is an array, get first item's text
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0].text === "string") {
        return data[0].text;
      } else {
        console.warn("fetchRagReply: Array response but no text field in first item.", data[0]);
        return "Sorry, I couldn't find an answer in the backend response.";
      }
    }
    // If data is an object, get text
    if (typeof data === "object" && typeof data.text === "string") {
      return data.text;
    } else {
      console.warn("fetchRagReply: Object response but no text field.", data);
      return "Sorry, I couldn't find an answer in the backend response.";
    }
  } catch (err) {
    console.error("fetchRagReply: Network or unexpected error:", err);
    return "Error contacting the learning assistant backend.";
  }
}

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

const learningTheorySuggestions = [
  "What does my learning style mean?",
  "Give me study tips for my learning type",
  "Tell me about Kolb's Learning Theory",
  "How can I improve my learning?"
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

  // Send query to RAG backend and show "generating..." message
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

    // Show "generating..." message
    const generatingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "Generating response...",
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, generatingMessage]);

    // Fetch reply from backend
    const botReply = await fetchRagReply(text);

    // Replace "generating..." with actual reply
    setMessages(prev => [
      ...prev.filter(msg => !msg.isLoading),
      {
        id: (Date.now() + 2).toString(),
        content: botReply,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setIsTyping(false);
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
                        {/* Suggestions (not used with RAG backend, but kept for future) */}
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
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  BookOpen, 
  Calculator, 
  CheckCircle,
  GraduationCap,
  Target,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageCircle
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

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

// Helper function for OpenAI API call
async function fetchLLMReply(query: string, system?: string): Promise<string> {
  try {
    const apiKey = (import.meta.env as any).VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in .env");
      return "Error: API key not configured.";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          ...(system ? [{ role: "system", content: system }] : [
            { role: "system", content: "You are a rigorous university-level tutor specializing in various different modules, specifically integration and differentiation. Provide clear, detailed explanations grounded in mathematical theory. Use precise mathematical notation and justify each step. Format all mathematical expressions using LaTeX: use $...$ for inline math (like $f(x) = x^2$) and $$...$$ for display math (equations on their own line). If a question is not related to integration, differentiation, or their applications, politely redirect the student to ask calculus questions." }
          ]),
          { role: "user", content: query }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, await response.text());
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      console.warn("fetchLLMReply: Unexpected response format.", data);
      return "Sorry, I couldn't generate a response at this time.";
    }
  } catch (err) {
    console.error("fetchLLMReply: Network or unexpected error:", err);
    return "Error contacting the learning assistant. Please try again.";
  }
}

// Helper function to parse and render math content with better regex
const renderMathContent = (content: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Match display math ($$...$$) first, then inline math ($...$), then bold (**....**)
  const displayMathRegex = /\$\$([\s\S]*?)\$\$/g;
  const inlineMathRegex = /\$([^\$\n]+?)\$/g;
  const boldRegex = /\*\*([^\*]+?)\*\*/g;
  
  let displayMatches: any[] = [];
  let inlineMatches: any[] = [];
  let boldMatches: any[] = [];
  
  let displayMatch;
  while ((displayMatch = displayMathRegex.exec(content)) !== null) {
    displayMatches.push({ 
      index: displayMatch.index, 
      length: displayMatch[0].length, 
      content: displayMatch[1],
      type: 'display'
    });
  }
  
  let inlineMatch;
  while ((inlineMatch = inlineMathRegex.exec(content)) !== null) {
    // Check if this inline match is not part of a display match
    const isPartOfDisplay = displayMatches.some(dm => 
      inlineMatch.index >= dm.index && 
      inlineMatch.index < dm.index + dm.length
    );
    if (!isPartOfDisplay) {
      inlineMatches.push({
        index: inlineMatch.index,
        length: inlineMatch[0].length,
        content: inlineMatch[1],
        type: 'inline'
      });
    }
  }

  let boldMatch;
  while ((boldMatch = boldRegex.exec(content)) !== null) {
    // Check if this bold match is not part of a math match
    const isPartOfMath = [...displayMatches, ...inlineMatches].some(m => 
      boldMatch.index >= m.index && 
      boldMatch.index < m.index + m.length
    );
    if (!isPartOfMath) {
      boldMatches.push({
        index: boldMatch.index,
        length: boldMatch[0].length,
        content: boldMatch[1],
        type: 'bold'
      });
    }
  }
  
  const allMatches = [...displayMatches, ...inlineMatches, ...boldMatches].sort((a, b) => a.index - b.index);

  allMatches.forEach((match, idx) => {
    // Add text before this match
    if (match.index > lastIndex) {
      const textBefore = content.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push(
          <span key={`text-${idx}`} className="whitespace-pre-wrap">
            {textBefore}
          </span>
        );
      }
    }

    // Add the appropriate element based on match type
    try {
      if (match.type === 'display') {
        parts.push(
          <div key={`math-${idx}`} className="my-3 flex justify-center overflow-x-auto">
            <BlockMath math={match.content} />
          </div>
        );
      } else if (match.type === 'inline') {
        parts.push(
          <InlineMath key={`math-${idx}`} math={match.content} />
        );
      } else if (match.type === 'bold') {
        parts.push(
          <strong key={`bold-${idx}`} className="font-semibold">
            {match.content}
          </strong>
        );
      }
    } catch (e) {
      // Fallback if rendering fails
      parts.push(
        <span key={`error-${idx}`} className="text-red-500 text-xs">
          [Rendering error]
        </span>
      );
    }

    lastIndex = match.index + match.length;
  });

  // Add remaining text
  if (lastIndex < content.length) {
    const remaining = content.substring(lastIndex);
    if (remaining.trim()) {
      parts.push(
        <span key="text-end" className="whitespace-pre-wrap">
          {remaining}
        </span>
      );
    }
  }

  return parts.length > 0 ? parts : [<span key="empty" className="whitespace-pre-wrap">{content}</span>];
};

// Helper function to parse and render bold markdown only
const renderBoldMarkdown = (content: string): React.ReactNode[] => {
  const boldRegex = /\*\*([^\*]+?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let boldMatch;

  while ((boldMatch = boldRegex.exec(content)) !== null) {
    // Add text before the match
    if (boldMatch.index > lastIndex) {
      const textBefore = content.substring(lastIndex, boldMatch.index);
      if (textBefore) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {textBefore}
          </span>
        );
      }
    }

    // Add the bold text
    parts.push(
      <strong key={`bold-${boldMatch.index}`} className="font-semibold">
        {boldMatch[1]}
      </strong>
    );

    lastIndex = boldMatch.index + boldMatch[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remaining = content.substring(lastIndex);
    parts.push(
      <span key="text-end">
        {remaining}
      </span>
    );
  }

  return parts.length > 0 ? parts : [<span key="empty">{content}</span>];
};

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
  const [showHintDialog, setShowHintDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const challengeScrollRef = useRef<HTMLDivElement>(null);

  // Helper function to check if user is near bottom of chat
  const userIsNearBottom = useCallback((element: HTMLDivElement | null, threshold: number = 80): boolean => {
    if (!element) return true;
    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    return distanceFromBottom < threshold;
  }, []);

  // Helper function to scroll chat to bottom
  const scrollChatToBottom = useCallback((element: HTMLDivElement | null) => {
    if (!element) return;
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 0);
  }, []);

  // Memoized static data to prevent re-renders
  const quickActions = useMemo(() => [
    {
      label: "Guide me",
      icon: GraduationCap,
      prompt: "Can you guide me through this integration/differentiation problem step by step?",
      color: "text-blue-700 border-blue-300 hover:bg-blue-50"
    },
    {
      label: "Test me",
      icon: Calculator,
      prompt: "Give me a challenging integration or differentiation practice problem",
      color: "text-green-700 border-green-300 hover:bg-green-50"
    },
    {
      label: "Check my answer",
      icon: CheckCircle,
      prompt: "I've solved a problem. Can you check my answer and verify my work?",
      color: "text-purple-700 border-purple-300 hover:bg-purple-50"
    },
    {
      label: "Explain concept",
      icon: BookOpen,
      prompt: "I will ask you to explain a concept. Do so with rigorous mathematical detail.",
      color: "text-orange-700 border-orange-300 hover:bg-orange-50"
    },
    {
      label: "Study tips",
      icon: Lightbulb,
      prompt: "What are the most effective strategies for mastering integration and differentiation techniques for me?",
      color: "text-yellow-700 border-yellow-300 hover:bg-yellow-50"
    }
  ], []);

  const suggestedQuestions = useMemo(() => [
    {
      question: "What are the fundamental rules of differentiation (power rule, product rule, quotient rule, chain rule)?",
      category: "Differentiation",
      difficulty: "Beginner"
    },
    {
      question: "How do I apply the chain rule to composite functions with multiple layers?",
      category: "Differentiation",
      difficulty: "Intermediate"
    },
    {
      question: "Can you explain the relationship between derivatives and integrals (Fundamental Theorem of Calculus)?",
      category: "Theory",
      difficulty: "Advanced"
    },
    {
      question: "What are the main integration techniques and when should I use each one?",
      category: "Integration",
      difficulty: "Intermediate"
    },
    {
      question: "How do I solve optimization and related rates problems using differentiation?",
      category: "Applications",
      difficulty: "Advanced"
    },
    {
      question: "What are the key techniques for integration by parts and substitution?",
      category: "Integration",
      difficulty: "Intermediate"
    },
    {
      question: "How do limits and continuity relate to derivatives and differentiation?",
      category: "Foundations",
      difficulty: "Beginner"
    },
    {
      question: "Can you explain improper integrals and convergence criteria?",
      category: "Integration",
      difficulty: "Advanced"
    }
  ], []);

  const sampleConversations = useMemo(() => [
    {
      title: "Chain Rule for Composite Functions",
      preview: "Detailed analysis of applying the chain rule to complex nested functions and practical examples...",
      time: "2h ago",
      category: "Differentiation"
    },
    {
      title: "Integration by Parts Mastery",
      preview: "Step-by-step guide on when and how to use integration by parts with multiple practice problems...",
      time: "1d ago",
      category: "Integration"
    },
    {
      title: "Fundamental Theorem of Calculus",
      preview: "In-depth explanation of the relationship between derivatives and integrals with proofs...",
      time: "3d ago",
      category: "Theory"
    },
    {
      title: "Optimization and Related Rates",
      preview: "Comprehensive walkthrough of applying calculus to real-world optimization and related rates problems...",
      time: "5d ago",
      category: "Applications"
    },
    {
      title: "U-Substitution Techniques",
      preview: "Mastering substitution methods for complex integrals with detailed examples...",
      time: "1w ago",
      category: "Integration"
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

  useEffect(() => {
    if (activeTab === 'general') {
      setShowSuggestions(true);
      setShowChallengeButtons(false);
    } else if (activeTab === 'challenge') {
      setShowSuggestions(false);
      setShowChallengeButtons(challengeMessages.length === 0);
    }
  }, [activeTab, challengeMessages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, challengeMessages, scrollToBottom]);

  // Main LLM-powered send message function
  const handleSendMessage = useCallback(
    async (message: string, system?: string, isQuickAction: boolean = false) => {
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

      // Fetch reply from OpenAI
      const botReply = await fetchLLMReply(message, system);

      if (activeTab === 'challenge') {
        setChallengeMessages(prev => [
          ...prev.filter(msg => msg.content !== "Generating response..."),
          {
            id: (Date.now() + 2).toString(),
            type: 'bot',
            content: botReply,
            timestamp: new Date(),
            category: 'concept'
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev.filter(msg => msg.content !== "Generating response..."),
          {
            id: (Date.now() + 2).toString(),
            type: 'bot',
            content: botReply,
            timestamp: new Date(),
            category: 'concept'
          }
        ]);
      }
      setIsLoading(false);
    },
    [activeTab]
  );

  // For quick actions, add system instructions
  const handleQuickAction = useCallback((prompt: string, type?: string) => {
    let system = "";
    if (type === "Guide me") {
      system = "You are a university-level calculus tutor. Provide a rigorous, step-by-step walkthrough of the problem. Justify each step mathematically and explain the underlying concepts. Use LaTeX math notation with $...$ for inline math and $$...$$ for display equations.";
    } else if (type === "Test me") {
      system = "You are a rigorous examiner. Provide a challenging university-level calculus problem on integration or differentiation. Use LaTeX notation: $...$ for inline math and $$...$$ for display math on separate lines. Example: $$\\int \\frac{x^3}{(x^2+1)^2} dx$$ Make expressions clear and readable with line breaks. After the student attempts it, provide detailed feedback.";
    } else if (type === "Check my answer") {
      system = "You are an expert mathematics grader. Review the student's calculus work meticulously, check for correctness, identify any errors, and provide constructive feedback with correct solutions using proper LaTeX notation.";
    } else if (type === "Explain concept") {
      system = "You are a mathematics professor. Provide a rigorous, in-depth explanation using LaTeX notation ($...$ for inline, $$...$$ for display math). Include proofs where relevant and provide illustrative examples.";
    } else if (type === "Study tips") {
      system = "You are an experienced calculus instructor. Share advanced, evidence-based strategies for mastering integration and differentiation. Focus on conceptual understanding, not just procedural steps.";
    }
    handleSendMessage(prompt, system, true);
  }, [handleSendMessage]);

  const handleSuggestedQuestion = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);


  const handleEndChallengeSession = useCallback(() => {
    console.log('Ending challenge session:', challengeMessages);
    setChallengeSessionEnded(true);
    if (onChallengeComplete) {
      onChallengeComplete();
    }
  }, [challengeMessages, onChallengeComplete]);

  const [currentChallengeQuestion, setCurrentChallengeQuestion] = useState<string>('');

  const handleStartChallenge = useCallback(() => {
  const now = new Date();
  const welcomeMessage: Message = {
    id: '1',
    type: 'bot',
    content: `🎯 **Welcome to Today's Calculus Challenge!**

Ready to deepen your understanding of university-level mathematics? Today's challenge focuses on rigorous problem-solving in integration and differentiation.

⚠️ **Important:** This challenge session will reset at midnight. Any unfinished conversations will be lost, so make sure to complete your challenge today!`,
    timestamp: now,
    category: 'general'
  };

  const questionMessage: Message = {
    id: '2',
    type: 'bot',
    content: `📋 **Today's Challenge Question**

**Topic:** Derivatives and Chain Rule  
**Difficulty:** ⭐⭐⭐ Advanced  
**Question Type:** Conceptual Explanation & Application  

**Question:**

Prove the chain rule for differentiation. Then, apply it to find the derivative of $f(x) = \\sin(e^{x^2})$ and show all work. Finally, explain the geometric interpretation of your result.`,
    timestamp: now,
    category: 'homework'
  };

  setChallengeMessages([welcomeMessage, questionMessage]);
  setCurrentChallengeQuestion(
    `Prove the chain rule for differentiation. Then, apply it to find the derivative of $f(x) = \\sin(e^{x^2})$ and show all work. Finally, explain the geometric interpretation of your result.`
  );
  setChallengePhase('answering');
  setShowChallengeButtons(false);
  setShowSuggestions(false);
}, []);
  
  const handleShowHint = useCallback(() => {
    setShowHintDialog(true);
  }, []);

  // PATCH: Post challenge response to API
  const handleSubmitChallenge = useCallback(async () => {
  if (!challengeAnswer.trim()) return;

  // Check if user was near bottom before changes
  const wasNearBottom = userIsNearBottom(challengeScrollRef.current);
  
  setIsLoading(true);

  const userAnswerMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: challengeAnswer,
    timestamp: new Date(),
    category: 'homework'
  };

  const llmPrompt = `
You are a rigorous university-level mathematics professor. Evaluate this student's answer to a calculus challenge question.

Challenge Question:
${currentChallengeQuestion}

Student's Answer:
${challengeAnswer}

Provide:
1. Assessment of mathematical correctness
2. Identification of any errors or gaps in reasoning
3. Evaluation of proof rigor (if applicable)
4. Suggestions for improvement
5. Key insights the student should understand

Be thorough, precise, and constructive. Use proper mathematical notation.

Present your feedback without using the bullet point format above, and instead generate it in a detailed paragraph form instead.
`;

  let feedbackText = '';
  try {
    feedbackText = await fetchLLMReply(llmPrompt);
  } catch (err) {
    feedbackText = "Sorry, I couldn't generate feedback at this time.";
  }

  const feedbackMessage: Message = {
    id: (Date.now() + 1).toString(),
    type: 'bot',
    content: feedbackText,
    timestamp: new Date(),
    category: 'concept'
  };

  setChallengeMessages(prev => [...prev, userAnswerMessage, feedbackMessage]);
  setChallengePhase('conversation');
  setChallengeAnswer('');
  setIsLoading(false);
  
  // Only auto-scroll if user was already near bottom
  if (wasNearBottom) {
    scrollChatToBottom(challengeScrollRef.current);
  }
}, [challengeAnswer, currentChallengeQuestion, userIsNearBottom, scrollChatToBottom]);

  const renderMessages = useCallback((messageList: Message[]) => (
    <div className="max-w-4xl mx-auto space-y-6">
      {messageList.map((message) => (
        <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
          {message.type === 'bot' && (
            <Avatar className="w-8 h-8 bg-white border border-gray-300 flex-shrink-0">
              <AvatarFallback className="bg-white">
                <img 
                  src="../media/learnus_logo.png"
                  alt="LearnUs Bot" 
                  className="w-full h-full object-contain p-1"
                />
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`max-w-3xl`}>
            <div className={`rounded-2xl px-4 py-3 ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              <div className="text-sm leading-relaxed">
                {message.type === 'bot' ? (
                  renderMathContent(message.content)
                ) : (
                  <div className="whitespace-pre-wrap">
                    {message.content}
                  </div>
                )}
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
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-purple-600 text-white text-xs font-semibold">U</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-4 justify-start">
          <Avatar className="w-8 h-8 bg-white border border-gray-300 flex-shrink-0">
            <AvatarFallback className="bg-white">
              <img 
                src="../media/learnus_logo.png"
                alt="LearnUs Bot" 
                className="w-full h-full object-contain p-1"
              />
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
    </div>
  ), [isLoading, messageFeedback, handleFeedback]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  }, [inputValue, handleSendMessage]);
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden pt-6">
      {/* Hint Dialog Modal */}
      <AlertDialog open={showHintDialog} onOpenChange={setShowHintDialog}>
        <AlertDialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Hint for Today's Challenge
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-base text-gray-700 space-y-3 py-4">
            <div className="text-sm leading-relaxed">
              {renderMathContent('For the chain rule, recall that if $y = f(g(x))$, then $\\frac{dy}{dx} = f\'(g(x)) \\cdot g\'(x)$.')}
            </div>
            <div className="text-sm leading-relaxed">
              <div>{renderMathContent('For your specific function $f(x) = \\sin(e^{x^2})$:')}</div>
              <ol className="list-decimal list-inside space-y-1 mt-2 text-sm">
                <li>{renderMathContent('Identify the outermost function: $\\sin(u)$')}</li>
                <li>{renderMathContent('Identify the middle function: $e^v$')}</li>
                <li>{renderMathContent('Identify the innermost function: $x^2$')}</li>
              </ol>
            </div>
            <div className="text-sm leading-relaxed">
              Work from the outside in, applying the chain rule systematically. Remember to multiply the derivatives at each layer.
            </div>
            <div className="font-semibold text-sm">
              Geometric interpretation: Think about how the rate of change compounds through each transformation.
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowHintDialog(false)}>
              Got it, thanks!
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Left Sidebar - Conversation History */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* Recent Conversations Section */}
        <div className="border-b border-gray-200 flex flex-col min-h-0 flex-1">
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="font-semibold text-gray-900">Recent Conversations</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-2">
              <div className="space-y-2">
                {sampleConversations.map((conv, index) => (
                  <div key={index} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-gray-900 text-xs truncate flex-1">{conv.title}</h4>
                      <span className="text-xs text-gray-400 flex-shrink-0">{conv.time}</span>
                    </div>
                    <Badge variant="secondary" className="mt-1 text-xs">
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
              <img src="/media/learnus_logo.png" alt="NALA" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h1 className="font-semibold text-gray-900">NALA Chatbot</h1>
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
                <div className="max-w-4xl mx-auto">
                  {/* Welcome message removed */}
                </div>
              ) : (
                renderMessages(messages)
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="challenge" className="flex-1 min-h-0 m-0 flex flex-col">
            {challengeMessages.length > 0 && (
              <div className={`border-b border-gray-200 px-6 py-3 flex-shrink-0 ${challengeSessionEnded ? 'bg-gray-100' : 'bg-purple-50'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${challengeSessionEnded ? 'bg-gray-400' : 'bg-purple-500'}`}></div>
                  <span className={`text-sm font-medium ${challengeSessionEnded ? 'text-gray-600' : 'text-purple-900'}`}>
                    {challengeSessionEnded ? 'Inactive Challenge Session' : 'Active Challenge Session'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Dedicated scrollable chat container */}
            <div 
              ref={challengeScrollRef}
              className="flex-1 overflow-y-auto p-6"
              style={{ overscrollBehavior: 'contain' }}
            >
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
                          <li>• {renderBoldMarkdown('**Topic** - The mathematical concept being tested')}</li>
                          <li>• {renderBoldMarkdown('**Difficulty** - ⭐ Basic, ⭐⭐ Intermediate, ⭐⭐⭐ Advanced')}</li>
                          <li>• {renderBoldMarkdown('**Acceptance Rate** - Percentage of students who answered correctly')}</li>
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
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons and Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto mr-20">
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
                      onClick={() => handleQuickAction(action.prompt, action.label)}
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
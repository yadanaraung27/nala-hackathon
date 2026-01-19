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
  MessageCircle,
  ImagePlus,
  X
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
import { fetchCurrentChallenge } from '../utils/challengesApi';

interface GeneralChatbotProps {
  learningStyle: string | null;
  initialQuestion?: string;
  initialAnswer?: string;
  mode?: 'general' | 'challenge';
  isNewChallenge?: boolean;
  challengeData?: any; // Challenge data from API
  onChallengeComplete?: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category: 'general' | 'homework' | 'concept' | 'motivation';
  images?: string[]; // Base64 encoded images
}

// Helper function for Ollama API call with image support
async function fetchLLMReply(query: string, system?: string, images?: string[]): Promise<string> {
  try {
    const ollamaUrl = (import.meta.env as any).VITE_OLLAMA_URL || "http://localhost:11434";
    const defaultTextModel = (import.meta.env as any).VITE_OLLAMA_TEXT_MODEL || "llama3.2-vision";
    const defaultVisionModel = (import.meta.env as any).VITE_OLLAMA_MODEL || "minicpm-v";

    // Define system message templates
    const baseSystemMessage = "You are a rigorous university-level tutor specializing in integration and differentiation. Provide clear, detailed explanations grounded in mathematical theory. Use precise mathematical notation and justify each step.";
    const latexInstructions = " IMPORTANT: Format ALL mathematical expressions using LaTeX notation: use $...$ for inline math (like $f(x) = x^2$) and $$...$$ for display math (equations on their own line, like $$\\int x^2 dx = \\frac{x^3}{3} + C$$). Never write math without LaTeX delimiters.";
    const redirectionNote = " If a question is not related to integration, differentiation, or their applications, politely redirect the student to ask calculus questions.";
    const systemMessage = system || (baseSystemMessage + latexInstructions + redirectionNote);

    // Hybrid approach: Use minicpm-v for image OCR, then llama3.2-vision for reasoning
    if (images && images.length > 0) {
      console.log('[Ollama] Hybrid approach: minicpm-v (OCR) -> llama3.2-vision (reasoning)');
      
      // Step 1: Use minicpm-v to extract/transcribe the image content
      const ocrPrompt = `Carefully examine this image and transcribe ALL mathematical content you see. Include:
      - All mathematical expressions, equations, and notation
      - All handwritten or typed text
      - All steps shown in any work
      - All numbers, variables, and symbols

      Format mathematical expressions using LaTeX with $ delimiters (e.g., $x^2$, $\\frac{d}{dx}$).
      Be extremely precise and transcribe everything exactly as shown.`;

      const ocrResponse = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: defaultVisionModel,
          messages: [
            { role: "system", content: "You are an expert at reading and transcribing mathematical notation from images. Transcribe exactly what you see using LaTeX format with $ delimiters." },
            { role: "user", content: ocrPrompt, images: images }
          ],
          stream: false,
          options: { temperature: 0.1, num_predict: 1000 }
        })
      });

      if (!ocrResponse.ok) {
        throw new Error("OCR step failed");
      }

      const ocrData = await ocrResponse.json();
      const imageTranscription = ocrData.message?.content || "";
      console.log('[OCR Result]:', imageTranscription.substring(0, 150) + '...');

      // Step 2: Use llama3.2-vision for reasoning and response (without sending the image again)
      const enhancedQuery = `${query}

      [Image Content Transcription]:
      ${imageTranscription}

      Based on the transcribed mathematical work shown above, provide your analysis.`;

      const ollamaModel = defaultTextModel;
      console.log(`[Ollama] Using model: ${ollamaModel} (reasoning)`);

      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ollamaModel,
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: enhancedQuery }
          ],
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: 1500,
            top_p: 0.9,
            top_k: 40,
            num_ctx: 2048
          }
        })
      });

      if (!response.ok) {
        throw new Error("Reasoning step failed");
      }

      const data = await response.json();
      if (data.message && data.message.content) {
        let content = data.message.content;
        console.log('[Final Response Preview]:', content.substring(0, 200));
        
        // Post-process to fix common LaTeX delimiter issues
        // Fix unclosed inline math delimiters (odd number of $ signs on a line)
        const lines = content.split('\n');
        const fixedLines = lines.map(line => {
          const dollarCount = (line.match(/\$/g) || []).length;
          // If odd number of $, likely missing a closing $
          if (dollarCount % 2 === 1) {
            // Find the last $ and add a closing $ before the next space or punctuation
            const lastDollarIndex = line.lastIndexOf('$');
            if (lastDollarIndex !== -1) {
              // Look for the next word boundary after the last $
              const afterDollar = line.substring(lastDollarIndex + 1);
              const match = afterDollar.match(/^[^\s.,;:!?)]*/);
              if (match) {
                const insertIndex = lastDollarIndex + 1 + match[0].length;
                line = line.substring(0, insertIndex) + '$' + line.substring(insertIndex);
              }
            }
          }
          return line;
        });
        content = fixedLines.join('\n');
        
        // Remove spaces between concatenated words (e.g., "w i t h" -> "with")
        content = content.replace(/\b([a-z])\s+([a-z])\s+([a-z])/gi, '$1$2$3');
        
        return content;
      }
    } else {
      // No images - use llama3.2-vision for text-only queries
      const ollamaModel = defaultTextModel;
      console.log(`[Ollama] Using model: ${ollamaModel} (text-only)`);

      const messages: any[] = [
        { role: "system", content: systemMessage },
        { role: "user", content: query }
      ];

      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ollamaModel,
          messages: messages,
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: 1500,
            top_p: 0.9,
            top_k: 40,
            num_ctx: 2048
          }
        })
      });

      if (!response.ok) {
        throw new Error("Ollama API error");
      }

      const data = await response.json();
      if (data.message && data.message.content) {
        let content = data.message.content;
        console.log('[Response Preview]:', content.substring(0, 200));
        
        // Post-process to fix common LaTeX delimiter issues
        const lines = content.split('\n');
        const fixedLines = lines.map(line => {
          const dollarCount = (line.match(/\$/g) || []).length;
          if (dollarCount % 2 === 1) {
            const lastDollarIndex = line.lastIndexOf('$');
            if (lastDollarIndex !== -1) {
              const afterDollar = line.substring(lastDollarIndex + 1);
              const match = afterDollar.match(/^[^\s.,;:!?)]*/);
              if (match) {
                const insertIndex = lastDollarIndex + 1 + match[0].length;
                line = line.substring(0, insertIndex) + '$' + line.substring(insertIndex);
              }
            }
          }
          return line;
        });
        content = fixedLines.join('\n');
        content = content.replace(/\b([a-z])\s+([a-z])\s+([a-z])/gi, '$1$2$3');
        
        return content;
      }
    }

    return "Sorry, I couldn't generate a response at this time.";
  } catch (err) {
    console.error("fetchLLMReply error:", err);
    return "Error contacting the learning assistant. Please try again.";
  }
}

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a canvas to resize the image if it's too large
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      
      img.onload = () => {
        // Resize if image is too large (for faster processing)
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Draw with slight contrast enhancement for better OCR
          ctx.filter = 'contrast(1.2) brightness(1.1)';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 (JPEG for smaller size, quality 85 for balance)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newReader = new FileReader();
                newReader.onload = () => {
                  const base64 = (newReader.result as string).split(',')[1];
                  resolve(base64);
                };
                newReader.onerror = reject;
                newReader.readAsDataURL(blob);
              } else {
                reject(new Error('Canvas blob conversion failed'));
              }
            },
            'image/jpeg',
            0.85
          );
        } else {
          reject(new Error('Canvas context not available'));
        }
      };
      
      img.onerror = reject;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper function to parse and render math content with better regex
const renderMathContent = (content: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Match display math ($$...$$ or \[...\]) first, then inline math ($...$ or \(...\)), then bold (**....**)
  const displayMathRegex1 = /\$\$([\s\S]*?)\$\$/g;  // $$...$$
  const displayMathRegex2 = /\\\[([\s\S]*?)\\\]/g;  // \[...\]
  const inlineMathRegex1 = /\$([^\$\n]+?)\$/g;      // $...$
  const inlineMathRegex2 = /\\\(([^\)]+?)\\\)/g;    // \(...\)
  const boldRegex = /\*\*([^\*]+?)\*\*/g;
  
  let displayMatches: any[] = [];
  let inlineMatches: any[] = [];
  let boldMatches: any[] = [];
  
  // Collect display math matches (both formats)
  let displayMatch;
  while ((displayMatch = displayMathRegex1.exec(content)) !== null) {
    displayMatches.push({ 
      index: displayMatch.index, 
      length: displayMatch[0].length, 
      content: displayMatch[1],
      type: 'display'
    });
  }
  while ((displayMatch = displayMathRegex2.exec(content)) !== null) {
    displayMatches.push({ 
      index: displayMatch.index, 
      length: displayMatch[0].length, 
      content: displayMatch[1],
      type: 'display'
    });
  }
  
  // Collect inline math matches (both formats)
  let inlineMatch;
  while ((inlineMatch = inlineMathRegex1.exec(content)) !== null) {
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
  while ((inlineMatch = inlineMathRegex2.exec(content)) !== null) {
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
  challengeData,
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
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // Base64 images for general chat
  const [challengeImages, setChallengeImages] = useState<string[]>([]); // Base64 images for challenge
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const challengeScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const challengeFileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle image upload for general chat
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const base64Images: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const base64 = await fileToBase64(files[i]);
        base64Images.push(base64);
      } catch (err) {
        console.error("Error converting image to base64:", err);
      }
    }
    setSelectedImages(prev => [...prev, ...base64Images]);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Handle image upload for challenge
  const handleChallengeImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const base64Images: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const base64 = await fileToBase64(files[i]);
        base64Images.push(base64);
      } catch (err) {
        console.error("Error converting image to base64:", err);
      }
    }
    setChallengeImages(prev => [...prev, ...base64Images]);
    // Reset input so same file can be selected again
    if (challengeFileInputRef.current) {
      challengeFileInputRef.current.value = '';
    }
  }, []);

  // Remove an image from selection
  const removeImage = useCallback((index: number, isChallenge: boolean = false) => {
    if (isChallenge) {
      setChallengeImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
    }
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
      if (!message.trim() && selectedImages.length === 0) return;

      // Capture current images before clearing
      const imagesToSend = [...selectedImages];

      const newUserMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: message || (imagesToSend.length > 0 ? "[Image attached - please analyze my math work]" : ""),
        timestamp: new Date(),
        category: 'general',
        images: imagesToSend.length > 0 ? imagesToSend : undefined
      };

      if (activeTab === 'challenge') {
        setChallengeMessages(prev => [...prev, newUserMessage]);
      } else {
        setMessages(prev => [...prev, newUserMessage]);
      }

      setInputValue('');
      setSelectedImages([]); // Clear images after sending
      setIsLoading(true);
      setShowSuggestions(false);

      // Build context-aware prompt for image analysis
      let enhancedMessage = message;
      if (imagesToSend.length > 0) {
        const imageAnalysisInstructions = `

IMPORTANT: I have attached image(s) of mathematical work. Please analyze them carefully:

1. CAREFULLY READ all mathematical notation, symbols, and expressions in the image
2. Examine EACH step of the work shown, from top to bottom
3. Check algebraic manipulations, derivatives, integrals, and substitutions
4. Verify that each step logically follows from the previous one
5. Identify any errors in:
   - Mathematical notation or symbols
   - Calculation mistakes
   - Sign errors
   - Missing steps or logical gaps
   - Incorrect application of rules/theorems
6. Provide specific feedback referencing what you see in the image
7. If the work is correct, acknowledge what was done well
8. If there are errors, explain exactly where and why they occurred

Please transcribe the key mathematical expressions you see before analyzing them.`;
        
        enhancedMessage = message 
          ? `${message}${imageAnalysisInstructions}`
          : `Please analyze my mathematical work shown in the attached image(s).${imageAnalysisInstructions}`;
      }

      // Fetch reply from Ollama with images
      const botReply = await fetchLLMReply(enhancedMessage, system, imagesToSend.length > 0 ? imagesToSend : undefined);

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
    [activeTab, selectedImages]
  );

  // For quick actions, add system instructions
  const handleQuickAction = useCallback((prompt: string, type?: string) => {
    let system = "";
    if (type === "Guide me") {
      system = "You are a university-level calculus tutor with vision capabilities. You can analyze images of student work. Provide a rigorous, step-by-step walkthrough of the problem. Justify each step mathematically and explain the underlying concepts. Use LaTeX math notation with $...$ for inline math and $$...$$ for display equations. If students upload images, carefully analyze their work.";
    } else if (type === "Test me") {
      system = "You are a rigorous examiner. Provide a challenging university-level calculus problem on integration or differentiation. Use LaTeX notation: $...$ for inline math and $$...$$ for display math on separate lines. Example: $$\\int \\frac{x^3}{(x^2+1)^2} dx$$ Make expressions clear and readable with line breaks. After the student attempts it, provide detailed feedback.";
    } else if (type === "Check my answer") {
      system = "You are an expert mathematics grader with vision capabilities. You can analyze images of handwritten or typed mathematical work. Review the student's calculus work meticulously (whether typed or in an uploaded image), check for correctness, identify any errors, and provide constructive feedback with correct solutions using proper LaTeX notation. When analyzing images, examine all steps, notation, and calculations carefully.";
    } else if (type === "Explain concept") {
      system = "You are a mathematics professor with vision capabilities. You can analyze diagrams and mathematical notation in images. Provide a rigorous, in-depth explanation using LaTeX notation ($...$ for inline, $$...$$ for display math). Include proofs where relevant and provide illustrative examples.";
    } else if (type === "Study tips") {
      system = "You are an experienced calculus instructor. Share advanced, evidence-based strategies for mastering integration and differentiation. Focus on conceptual understanding, not just procedural steps.";
    }
    handleSendMessage(prompt, system, true);
  }, [handleSendMessage]);

  const handleSuggestedQuestion = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  const [currentChallengeQuestion, setCurrentChallengeQuestion] = useState<string>('');
  const [currentChallengeGroundTruth, setCurrentChallengeGroundTruth] = useState<string>('');
  const [currentChallengeId, setCurrentChallengeId] = useState<number | null>(null);
  const [currentChallengeScore, setCurrentChallengeScore] = useState<number | null>(null);
  const [challengeStartTime, setChallengeStartTime] = useState<Date | null>(null);

  const handleEndChallengeSession = useCallback(async () => {
    console.log('Ending challenge session:', challengeMessages);
    
    // Calculate time spent
    let timeSpent = 'Unknown';
    if (challengeStartTime) {
      const endTime = new Date();
      const diffMs = endTime.getTime() - challengeStartTime.getTime();
      const diffMins = Math.round(diffMs / 60000);
      timeSpent = diffMins > 0 ? `${diffMins} minutes` : 'Less than 1 minute';
    }
    
    // Extract user's answer from challenge messages (the first user message after the question)
    const userAnswerMessage = challengeMessages.find(msg => msg.type === 'user' && msg.category === 'homework');
    const userAnswer = userAnswerMessage?.content || 'No written answer provided';
    
    // Submit attempt to the database if we have a challenge ID and score
    if (currentChallengeId && currentChallengeScore !== null) {
      try {
        const apiUrl = (import.meta.env as any).VITE_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/challenges/${currentChallengeId}/attempts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: 1, // Default user ID (can be replaced with actual user auth later)
            answer: userAnswer,
            score: currentChallengeScore,
            time_spent: timeSpent,
            status: 'completed'
          })
        });
        
        if (response.ok) {
          console.log('Challenge attempt successfully submitted to database');
        } else {
          console.error('Failed to submit challenge attempt:', await response.text());
        }
      } catch (error) {
        console.error('Error submitting challenge attempt:', error);
      }
    } else {
      console.warn('Cannot submit attempt: missing challenge ID or score', {
        challengeId: currentChallengeId,
        score: currentChallengeScore
      });
    }
    
    setChallengeSessionEnded(true);
    if (onChallengeComplete) {
      onChallengeComplete();
    }
  }, [challengeMessages, onChallengeComplete, currentChallengeId, currentChallengeScore, challengeStartTime]);

  const handleStartChallenge = useCallback(async (challenge?: any) => {
    let challengeToUse = challenge || challengeData;
    const now = new Date();
    
    // If no challenge data provided, fetch today's challenge from API
    if (!challengeToUse || !challengeToUse.question) {
      try {
        console.log('No challenge data provided, fetching today\'s challenge...');
        challengeToUse = await fetchCurrentChallenge();
        console.log('Fetched today\'s challenge:', challengeToUse);
      } catch (err) {
        console.error('Error fetching today\'s challenge:', err);
        // Will fall back to default message below
      }
    }
    
    // If challenge data is available, display the question
    if (challengeToUse && challengeToUse.question) {
      const difficultyStars = challengeToUse.difficulty === 'Hard' ? '⭐⭐⭐' : 
                              challengeToUse.difficulty === 'Medium' ? '⭐⭐' : '⭐';
      
      const questionMessage: Message = {
        id: '1',
        type: 'bot',
        content: `📋 **Today's Challenge Question**

**Topic:** ${challengeToUse.category || 'Mathematics'}  
**Difficulty:** ${difficultyStars} ${challengeToUse.difficulty || 'Medium'}  
**Question Type:** ${challengeToUse.bloomLevel || 'Problem Solving'}  

**Question:**

${challengeToUse.question}`,
        timestamp: now,
        category: 'homework'
      };

      setChallengeMessages([questionMessage]);
      setCurrentChallengeQuestion(challengeToUse.question);
      setCurrentChallengeGroundTruth(challengeToUse.groundTruthAnswer || '');
      setCurrentChallengeId(challengeToUse.id || null);
      setChallengeStartTime(now);
      setChallengePhase('answering');
      setShowChallengeButtons(false);
      setShowSuggestions(false);
    } else {
      // Fallback to default welcome message if no challenge data
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: `🎯 **Welcome to Today's Challenge!**

Ready to deepen your understanding? Today's challenge focuses on rigorous problem-solving.

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
    }
  }, [challengeData]);

  // Auto-start challenge if challengeData is provided and we're in challenge mode
  useEffect(() => {
    if (mode === 'challenge' && isNewChallenge && challengeData && challengeData.question && challengeMessages.length === 0) {
      // Automatically start the challenge with the provided data
      try {
        handleStartChallenge(challengeData);
      } catch (error) {
        console.error('Error starting challenge:', error);
        // Fallback: show welcome screen if auto-start fails
        setShowChallengeButtons(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isNewChallenge, challengeData]);
  
  const handleShowHint = useCallback(() => {
    setShowHintDialog(true);
  }, []);

  // PATCH: Post challenge response to API
  const handleSubmitChallenge = useCallback(async () => {
  if (!challengeAnswer.trim() && challengeImages.length === 0) return;

  // Check if user was near bottom before changes
  const wasNearBottom = userIsNearBottom(challengeScrollRef.current);
  
  // Capture current images before clearing
  const imagesToSubmit = [...challengeImages];
  
  setIsLoading(true);

  const userAnswerMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: challengeAnswer || (imagesToSubmit.length > 0 ? "[Image of my work attached]" : ""),
    timestamp: new Date(),
    category: 'homework',
    images: imagesToSubmit.length > 0 ? imagesToSubmit : undefined
  };

  // Build prompt that includes image context if images are attached
  const hasImages = imagesToSubmit.length > 0;
  const imageContext = hasImages 
    ? `\n\nThe student has attached an image of their mathematical work. Please analyze it with extreme care:

- FIRST, transcribe or describe the mathematical expressions and steps you see in the image
- Carefully read ALL notation, symbols, numbers, and text
- Check EACH calculation step by step
- Verify integration/differentiation rules are applied correctly
- Look for sign errors, algebraic mistakes, or computational errors
- Check that the final answer matches what's shown in the image
- Be specific about what you observe in the image when providing feedback`
    : "";

  const llmPrompt = `
You are a rigorous university-level mathematics professor. Evaluate this student's answer to a calculus challenge question against a ground truth answer and provide a score out of 100%.

IMPORTANT: Format ALL mathematical expressions using LaTeX notation:
- Use $expression$ for inline math (e.g., $f(x) = x^2$)
- Use $$expression$$ for display math (e.g., $$\\int_0^1 x^2 dx$$)
- Never write mathematical notation without LaTeX delimiters

Challenge Question:
${currentChallengeQuestion}

Ground Truth Answer (Expert Reference):
${currentChallengeGroundTruth}

Student's Written Answer:
${challengeAnswer || "(See attached image for the student's work)"}${imageContext}

EVALUATION INSTRUCTIONS:
1. Compare the student's answer to the ground truth answer
2. Assess mathematical correctness, completeness, and clarity
3. Identify any errors, misconceptions, or gaps in reasoning
4. Evaluate proof rigor and mathematical notation (if applicable)
5. Provide constructive feedback and suggestions for improvement

SCORING RUBRIC (out of 100%):
- Correctness (50%): Are the main concepts and final answer correct?
- Completeness (25%): Are all key steps and explanations included?
- Clarity & Notation (15%): Is the work clear, organized, and properly notated?
- Understanding (10%): Does the answer demonstrate deep conceptual understanding?

CRITICAL: You MUST include a score at the very beginning of your response in this EXACT format:
**SCORE: X/100**

Where X is a number between 0 and 100. This line must come first, before any other feedback.

After the score line, provide your detailed evaluation in paragraph form. Be thorough, precise, and constructive. Use proper mathematical notation with LaTeX formatting.
`;

  let feedbackText = '';
  let extractedScore: number | null = null;
  
  try {
    feedbackText = await fetchLLMReply(llmPrompt, undefined, hasImages ? imagesToSubmit : undefined);
    
    // Extract score from the feedback (format: **SCORE: X/100**)
    const scoreMatch = feedbackText.match(/\*\*SCORE:\s*(\d+(?:\.\d+)?)\s*\/\s*100\*\*/i);
    if (scoreMatch) {
      extractedScore = parseFloat(scoreMatch[1]);
      console.log('Extracted score:', extractedScore);
    } else {
      console.warn('Could not extract score from LLM response');
    }
  } catch (err) {
    feedbackText = "Sorry, I couldn't generate feedback at this time.";
    console.error('Error getting feedback:', err);
  }
  
  // Store the extracted score for later submission
  setCurrentChallengeScore(extractedScore);
  
  // Clear challenge images after submission
  setChallengeImages([]);

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
}, [challengeAnswer, challengeImages, currentChallengeQuestion, userIsNearBottom, scrollChatToBottom]);

  const renderMessages = useCallback((messageList: Message[]) => (
    <div className="max-w-4xl mx-auto space-y-6">
      {messageList.map((message) => (
        <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
          {message.type === 'bot' && (
            <Avatar className="w-8 h-8 bg-white border border-gray-300 flex-shrink-0">
              <AvatarFallback className="bg-white">
                <img 
                  src="/images/learnus_logo.png"
                  alt="LearnUs Bot" 
                  className="w-full h-full object-contain p-1"
                />
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`max-w-3xl`}>
            {/* Display attached images */}
            {message.images && message.images.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {message.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={`data:image/png;base64,${img}`}
                      alt={`Attached image ${idx + 1}`}
                      className="max-w-xs max-h-48 rounded-lg border border-gray-200 shadow-sm object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
            
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
                src="/images/learnus_logo.png"
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
              <img src="/images/learnus_logo.png" alt="NALA" className="w-10 h-10 rounded-full object-cover" />
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
                <div className="max-w-4xl mx-auto text-center py-12">
                  <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-4"/>
                  <h3 className="font-medium text-gray-900 mb-2">General Chat Session</h3>
                  <p className="text-gray-600 mb-6">Welcome! I'm your Mathematics I learning assistant, designed to help you master calculus concepts. {learningStyle ? `Since you're ${learningStyle}, I'll adapt my explanations to match your learning preferences.` : ''}</p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-blue-600"/>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">How I Can Help You</h4>
                        <ul className="text-sm text-blue-700 space-y-1 mb-3">
                          <li>• <b>Guide you</b> through complex problems step-by-step</li>
                          <li>• <b>Test your understanding</b> with practice questions</li>
                          <li>• <b>Check your answers</b> and provide detailed feedback</li>
                          <li>• <b>Explain concepts</b> using examples and analogies</li>
                          <li>• <b>Share study tips</b> tailored to your learning preference</li>
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
                      
                      {/* Hidden file input for challenge */}
                      <input
                        type="file"
                        ref={challengeFileInputRef}
                        onChange={handleChallengeImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      
                      {/* Challenge Image Preview */}
                      {challengeImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg border border-gray-200 mb-3">
                          {challengeImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={`data:image/png;base64,${img}`}
                                alt={`Challenge image ${idx + 1}`}
                                className="h-20 w-20 object-cover rounded-md border border-gray-300"
                              />
                              <button
                                onClick={() => removeImage(idx, true)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          <span className="text-xs text-gray-500 self-center ml-2">
                            {challengeImages.length} image(s) of your work attached
                          </span>
                        </div>
                      )}
                      
                      <textarea
                        value={challengeAnswer}
                        onChange={(e) => setChallengeAnswer(e.target.value)}
                        placeholder="Type your answer here, or upload an image of your work..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      
                      <div className="flex justify-between items-center mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => challengeFileInputRef.current?.click()}
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
                          disabled={isLoading}
                        >
                          <ImagePlus className="h-4 w-4 mr-2" />
                          Upload Work Image
                        </Button>
                        
                        <Button
                          onClick={handleSubmitChallenge}
                          disabled={(!challengeAnswer.trim() && challengeImages.length === 0) || isLoading}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {isLoading ? 'Submitting...' : 'Submit Answer'}
                        </Button>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        📷 <strong>Tips for best results:</strong> Use clear, well-lit photos • Write neatly • Ensure all work is visible • Avoid shadows • Take photos straight-on (not at an angle)
                      </p>
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
              <div className="space-y-2">
                {/* Image Preview Area */}
                {selectedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    {selectedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={`data:image/png;base64,${img}`}
                          alt={`Selected image ${idx + 1}`}
                          className="h-16 w-16 object-cover rounded-md border border-gray-300"
                        />
                        <button
                          onClick={() => removeImage(idx, false)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <span className="text-xs text-gray-500 self-center ml-2">
                      {selectedImages.length} image(s) attached
                    </span>
                  </div>
                )}
                
                <div className="flex gap-3">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  
                  {/* Image upload button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0 border-gray-300 hover:bg-gray-50"
                    disabled={isLoading}
                    title="Attach image of your math work"
                  >
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                  
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      selectedImages.length > 0
                        ? "Add a message about your image (optional)..."
                        : activeTab === 'challenge' 
                          ? "Ask follow-up questions about today's challenge..." 
                          : "Ask me anything about Mathematics I..."
                    }
                    className="flex-1 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={(!inputValue.trim() && selectedImages.length === 0) || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
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
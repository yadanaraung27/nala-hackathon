import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Calendar, Flame, Trophy, Target, Clock, CheckCircle2, X, Star, Play, RotateCcw, Filter, BarChart3, TrendingUp, Info, Search, ArrowUpDown, SlidersHorizontal, RotateCcw as Reset, TrendingDown, Users, ChevronDown, ChevronRight, ArrowLeft, Lightbulb, Rocket } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import GeneralChatbot from '../GeneralChatbot'; // adjust path as needed

interface DailyChallengesPageProps {
  onStartChallenge?: () => void;
}


export default function DailyChallengesPage({ onStartChallenge }: DailyChallengesPageProps = {}) {
  const [selectedMonth, setSelectedMonth] = useState('September 2025');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showChatbot, setShowChatbot] = useState(false);

  // Bloom's taxonomy to Kolb's learning stage mapping
  const getKolbStage = (bloomLevel: string) => {
    switch (bloomLevel.toLowerCase()) {
      case 'remember':
      case 'understand':
        return { stage: 'Experience', icon: ArrowLeft, tooltip: 'Experience: Start with what you know - connect to real situations' };
      case 'apply':
      case 'analyze':
        return { stage: 'Reflect', icon: Search, tooltip: 'Reflect: Think about why this works or fails - compare different approaches' };
      case 'evaluate':
        return { stage: 'Conceptualize', icon: Lightbulb, tooltip: 'Conceptualize: Build the big picture - understand the principles behind it' };
      case 'create':
        return { stage: 'Experiment', icon: Rocket, tooltip: 'Experiment: Try something new - apply your understanding creatively' };
      default:
        return { stage: 'Experience', icon: ArrowLeft, tooltip: 'Experience: Start with what you know - connect to real situations' };
    }
  };

  // Dropdown state for collapsible sections (all open by default)
  const [streakActivityOpen, setStreakActivityOpen] = useState(true);
  const [performanceOverviewOpen, setPerformanceOverviewOpen] = useState(true);
  const [learningInsightsOpen, setLearningInsightsOpen] = useState(true);

  // Progress stats inspired by LeetCode
  const progressStats = {
    totalSolved: 42,
    totalAttempted: 50,
    attempting: 3,
    easy: { solved: 18, total: 20 },
    medium: { solved: 16, total: 20 },
    hard: { solved: 8, total: 12 }
  };

  // Key streak stats
  const currentStreak = 7;
  const longestStreak = 23;
  const monthlyAttempts = 35;

  // Comprehensive challenge history starting from Academic Year 2025 (Aug 11 - Sep 30)
  // Following Mathematics I curriculum progression with varied difficulty, Bloom's, and Kolb stages
  const [challengeHistory, setChallengeHistory] = useState([
    {
      date: '2025-09-28',
      category: 'Derivatives',
      difficulty: 'Medium',
      bloomLevel: 'Understand',
      question: "Chain Rule Application: Imagine you're explaining the chain rule to a study group. How would you describe when and why we use it for composite functions?",
      status: 'completed',
      score: 85,
      acceptanceRate: 84,
      timeSpent: '4 minutes',
      answer: "The chain rule applies when differentiating composite functions f(g(x)). Steps: 1) Identify outer and inner functions, 2) Find derivative of outer function, 3) Multiply by derivative of inner function. Common mistakes: Forgetting the inner derivative, incorrect function identification, sign errors. Example: d/dx[sin(x²)] = cos(x²) · 2x",
      attempts: [
        { attemptNumber: 1, score: 85, date: '2025-09-28', timeSpent: '4 minutes' }
      ]
    },
    {
      date: '2025-09-27',
      category: 'Applications of derivatives',
      difficulty: 'Hard',
      bloomLevel: 'Apply',
      question: "Related Rates: A ladder 10m long leans against a vertical wall. If the bottom slides away at 2 m/s, how fast is the top sliding down when the bottom is 6m from the wall?",
      status: 'completed',
      score: 92,
      acceptanceRate: 65,
      timeSpent: '7 minutes',
      answer: "Set up: x² + y² = 100 (Pythagorean theorem). Given: dx/dt = 2 m/s. Find: dy/dt when x = 6m. Differentiate: 2x(dx/dt) + 2y(dy/dt) = 0. When x = 6, y = 8. Substitute: 2(6)(2) + 2(8)(dy/dt) = 0. Solve: dy/dt = -1.5 m/s (negative means sliding down).",
      attempts: [
        { attemptNumber: 1, score: 92, date: '2025-09-27', timeSpent: '7 minutes' }
      ]
    },
    {
      date: '2025-09-26',
      category: 'Limits and continuity of functions',
      difficulty: 'Easy',
      bloomLevel: 'Remember',
      question: "Limit Evaluation: Explain the concept of limits and describe three methods for evaluating limits.",
      status: 'completed',
      score: 78,
      acceptanceRate: 92,
      timeSpent: '3 minutes',
      answer: "Limits describe function behavior as input approaches a value. Methods: 1) Direct substitution (if function is continuous), 2) Factoring and cancellation for indeterminate forms, 3) L'Hôpital's rule for 0/0 or ∞/∞ forms. Limits form the foundation for derivatives and integrals.",
      attempts: [
        { attemptNumber: 1, score: 78, date: '2025-09-26', timeSpent: '3 minutes' }
      ]
    },
    {
      date: '2025-09-25',
      category: 'Complex numbers',
      difficulty: 'Medium',
      bloomLevel: 'Apply',
      question: "Complex Number Forms: Explain how to convert between rectangular and polar forms of complex numbers.",
      status: 'completed',
      score: 88,
      acceptanceRate: 76,
      timeSpent: '5 minutes',
      answer: "Rectangular: z = a + bi. Polar: z = r(cos θ + i sin θ) = re^(iθ). Conversion: r = √(a² + b²), θ = arctan(b/a). Polar form is useful for multiplication/division and finding powers/roots. Rectangular form is better for addition/subtraction.",
      attempts: [
        { attemptNumber: 1, score: 72, date: '2025-09-25', timeSpent: '7 minutes' },
        { attemptNumber: 2, score: 88, date: '2025-09-25', timeSpent: '5 minutes' }
      ]
    },
    {
      date: '2025-09-24',
      category: 'Applications of derivatives',
      difficulty: 'Hard',
      bloomLevel: 'Analyze',
      question: "Optimization Problems: Explain how to solve optimization problems using calculus, including the complete process.",
      status: 'completed',
      score: 76,
      acceptanceRate: 58,
      timeSpent: '6 minutes',
      answer: "Optimization process: 1) Define variables and constraints, 2) Express objective function in terms of one variable, 3) Find critical points (f'(x) = 0), 4) Use second derivative test or endpoint comparison, 5) Verify answer makes physical sense. Always check boundary conditions.",
      attempts: [
        { attemptNumber: 1, score: 61, date: '2025-09-24', timeSpent: '8 minutes' },
        { attemptNumber: 2, score: 76, date: '2025-09-24', timeSpent: '6 minutes' }
      ]
    },
    {
      date: '2025-09-23',
      category: 'Vectors and matrices',
      difficulty: 'Easy',
      bloomLevel: 'Understand',
      question: "Vector Operations: Explain dot product and cross product of vectors, including their geometric interpretations.",
      status: 'completed',
      score: 94,
      acceptanceRate: 89,
      timeSpent: '4 minutes',
      answer: "Dot product: a·b = |a||b|cos(θ), gives scalar. Cross product: a×b = |a||b|sin(θ)n̂, gives vector perpendicular to both. Dot product measures projection, cross product gives area of parallelogram and perpendicular vector."
    },
    {
      date: '2025-09-22',
      category: 'Derivatives',
      difficulty: 'Medium',
      bloomLevel: 'Apply',
      question: "Higher Order Derivatives: Find the second and third derivatives of f(x) = x⁴ - 3x³ + 2x² - x + 5 and explain their physical significance.",
      status: 'completed',
      score: 82,
      acceptanceRate: 71,
      timeSpent: '5 minutes',
      answer: "f'(x) = 4x³ - 9x² + 4x - 1 (velocity). f''(x) = 12x² - 18x + 4 (acceleration). f'''(x) = 24x - 18 (jerk). Second derivative indicates concavity: f''(x) > 0 means concave up, f''(x) < 0 means concave down. Critical points where f''(x) = 0 are potential inflection points."
    },
    {
      date: '2025-09-21',
      category: 'Limits and continuity of functions',
      difficulty: 'Easy',
      bloomLevel: 'Understand',
      question: "Function Composition: Explain function composition and how to evaluate composite functions f(g(x)).",
      status: 'completed',
      score: 87,
      acceptanceRate: 91,
      timeSpent: '3 minutes',
      answer: "Function composition (f∘g)(x) = f(g(x)) means applying g first, then f to the result. Domain of f∘g is restricted to values where g(x) is in domain of f. Example: If f(x) = x² and g(x) = x+1, then (f∘g)(x) = (x+1)²."
    },
    {
      date: '2025-09-20',
      category: 'Derivatives',
      difficulty: 'Medium',
      bloomLevel: 'Apply',
      question: "Implicit Differentiation: Explain when and how to use implicit differentiation with examples.",
      status: 'completed',
      score: 79,
      acceptanceRate: 68,
      timeSpent: '5 minutes',
      answer: "Use implicit differentiation when y cannot be easily solved explicitly. Differentiate both sides with respect to x, treating y as function of x. Remember dy/dx appears in chain rule applications. Example: x² + y² = 25 → 2x + 2y(dy/dx) = 0 → dy/dx = -x/y.",
      attempts: [
        { attemptNumber: 1, score: 52, date: '2025-09-20', timeSpent: '7 minutes' },
        { attemptNumber: 2, score: 68, date: '2025-09-20', timeSpent: '6 minutes' },
        { attemptNumber: 3, score: 79, date: '2025-09-20', timeSpent: '5 minutes' }
      ]
    },
    {
      date: '2025-09-19',
      category: 'Limits and continuity of functions',
      difficulty: 'Medium',
      bloomLevel: 'Evaluate',
      question: "Function Properties: Analyze the properties of trigonometric functions including domain, range, and periodicity.",
      status: 'completed',
      score: 84,
      acceptanceRate: 73,
      timeSpent: '4 minutes',
      answer: "Sine and cosine have domain ℝ and range [-1,1], with period 2π. Tangent has domain ℝ except x = π/2 + nπ, range ℝ, period π. These functions are continuous on their domains and have specific symmetry properties (even/odd functions)."
    },
    {
      date: '2025-09-18',
      category: 'Limits and continuity of functions',
      difficulty: 'Easy',
      bloomLevel: 'Create',
      question: "Continuity: Determine if f(x) = (x² - 4)/(x - 2) is continuous at x = 2. If not, can you redefine it to make it continuous?",
      status: 'completed',
      score: 91,
      acceptanceRate: 88,
      timeSpent: '3 minutes',
      answer: "The function has a hole at x = 2 since both numerator and denominator equal 0. Simplify: f(x) = (x-2)(x+2)/(x-2) = x+2 for x ≠ 2. The limit as x→2 is 4, but f(2) is undefined. To make continuous, redefine as f(x) = x+2 for all x, or define f(2) = 4."
    },
    {
      date: '2025-09-17',
      category: 'Derivatives',
      difficulty: 'Medium',
      bloomLevel: 'Apply',
      question: "Logarithmic Differentiation: Use logarithmic differentiation to find the derivative of y = x^x for x > 0.",
      status: 'completed',
      score: 86,
      acceptanceRate: 75,
      timeSpent: '4 minutes',
      answer: "Take natural log of both sides: ln(y) = ln(x^x) = x ln(x). Differentiate implicitly: (1/y)(dy/dx) = ln(x) + x(1/x) = ln(x) + 1. Therefore dy/dx = y(ln(x) + 1) = x^x(ln(x) + 1). This method is useful for functions of the form f(x)^g(x)."
    },
    {
      date: '2025-09-16',
      category: 'Vectors and matrices',
      difficulty: 'Hard',
      bloomLevel: 'Analyze',
      question: "Matrix Multiplication: Explain matrix multiplication rules and when two matrices can be multiplied.",
      status: 'completed',
      score: 73,
      acceptanceRate: 61,
      timeSpent: '6 minutes',
      answer: "Matrices A(m×n) and B(p×q) can multiply if n=p, resulting in (m×q) matrix. Element (i,j) = sum of products of row i of A with column j of B. Not commutative: AB ≠ BA generally. Important for linear transformations and systems of equations.",
      attempts: [
        { attemptNumber: 1, score: 45, date: '2025-09-16', timeSpent: '9 minutes' },
        { attemptNumber: 2, score: 73, date: '2025-09-16', timeSpent: '6 minutes' }
      ]
    },
    {
      date: '2025-09-15',
      category: 'Complex numbers',
      difficulty: 'Easy',
      bloomLevel: 'Apply',
      question: "Complex Number Arithmetic: Calculate (3 + 4i)(2 - i) and express the result in standard form a + bi.",
      status: 'completed',
      score: 89,
      acceptanceRate: 86,
      timeSpent: '3 minutes',
      answer: "Use FOIL method: (3 + 4i)(2 - i) = 3(2) + 3(-i) + 4i(2) + 4i(-i) = 6 - 3i + 8i - 4i² = 6 + 5i - 4(-1) = 6 + 5i + 4 = 10 + 5i. Remember that i² = -1."
    },
    {
      date: '2025-09-14',
      category: 'Limits and continuity of functions',
      difficulty: 'Medium',
      bloomLevel: 'Analyze',
      question: "Sandwich Theorem: Use the Sandwich Theorem to evaluate lim(x→0) x²sin(1/x).",
      status: 'completed',
      score: 81,
      acceptanceRate: 69,
      timeSpent: '5 minutes',
      answer: "Since -1 ≤ sin(1/x) ≤ 1 for all x ≠ 0, multiply by x²: -x² ≤ x²sin(1/x) ≤ x². As x→0, both -x² and x² approach 0. By the Sandwich Theorem, lim(x→0) x²sin(1/x) = 0. This technique is useful when direct substitution gives indeterminate forms."
    },
    {
      date: '2025-09-13',
      category: 'Vectors and matrices',
      difficulty: 'Hard',
      bloomLevel: 'Apply',
      question: "Cramer's Rule: Use Cramer's rule to solve the system: 2x + 3y = 7, 4x - y = 1. Explain when this method is applicable.",
      status: 'completed',
      score: 77,
      acceptanceRate: 54,
      timeSpent: '7 minutes',
      answer: "For system Ax = b, solution is x_i = det(A_i)/det(A) where A_i has column i replaced by b. Here: det(A) = 2(-1) - 3(4) = -14. For x: replace col 1 with [7,1], det = -7-3 = -10, so x = -10/(-14) = 5/7. For y: replace col 2 with [7,1], det = 2-28 = -26, so y = -26/(-14) = 13/7. Method works when det(A) ≠ 0."
    },
    {
      date: '2025-09-12',
      category: 'Complex numbers',
      difficulty: 'Hard',
      bloomLevel: 'Evaluate',
      question: "Complex Number Equations: Solve z³ = 8i and express all solutions in both rectangular and polar forms.",
      status: 'completed',
      score: 71,
      acceptanceRate: 48,
      timeSpent: '8 minutes',
      answer: "First write 8i in polar form: 8i = 8(cos(π/2) + i sin(π/2)) = 8e^(iπ/2). For z³ = 8e^(iπ/2), we have z = 2e^(i(π/6 + 2πk/3)) for k = 0,1,2. Solutions: z₁ = 2e^(iπ/6) = √3 + i, z₂ = 2e^(i5π/6) = -√3 + i, z₃ = 2e^(i3π/2) = -2i. The three cube roots form vertices of an equilateral triangle.",
      attempts: [
        { attemptNumber: 1, score: 38, date: '2025-09-12', timeSpent: '12 minutes' },
        { attemptNumber: 2, score: 58, date: '2025-09-12', timeSpent: '10 minutes' },
        { attemptNumber: 3, score: 71, date: '2025-09-12', timeSpent: '8 minutes' }
      ]
    },
    {
      date: '2025-09-11',
      category: 'Limits and continuity of functions',
      difficulty: 'Medium',
      bloomLevel: 'Understand',
      question: "L'Hôpital's Rule: Explain L'Hôpital's rule and when it can be applied to evaluate limits.",
      status: 'completed',
      score: 83,
      acceptanceRate: 72,
      timeSpent: '4 minutes',
      answer: "L'Hôpital's rule applies to indeterminate forms 0/0 or ∞/∞. If lim f(x)/g(x) gives these forms, then lim f(x)/g(x) = lim f'(x)/g'(x) (if this limit exists). Can apply repeatedly. Also works for 0·∞, ∞-∞ after algebraic manipulation."
    },
    {
      date: '2025-09-10',
      category: 'Limits and continuity of functions',
      difficulty: 'Easy',
      bloomLevel: 'Remember',
      question: "Exponential Functions: Explain properties of exponential functions and their graphs.",
      status: 'completed',
      score: 92,
      acceptanceRate: 89,
      timeSpent: '3 minutes',
      answer: "f(x) = aˣ where a > 0, a ≠ 1. Properties: Domain ℝ, range (0,∞), horizontal asymptote y=0. If a > 1: increasing, if 0 < a < 1: decreasing. Key property: aˣ⁺ʸ = aˣ · aʸ. Base e gives natural exponential function eˣ."
    },
    {
      date: '2025-09-09',
      category: 'Derivatives',
      difficulty: 'Easy',
      bloomLevel: 'Remember',
      question: "Power Rule: Explain the power rule for differentiation and provide examples.",
      status: 'completed',
      score: 95,
      acceptanceRate: 94,
      timeSpent: '2 minutes',
      answer: "Power rule: d/dx[xⁿ] = n·xⁿ⁻¹ for any real number n. Examples: d/dx[x³] = 3x², d/dx[√x] = d/dx[x^(1/2)] = (1/2)x^(-1/2) = 1/(2√x). Works for negative and fractional exponents too."
    },
    {
      date: '2025-09-08',
      category: 'Limits and continuity of functions',
      difficulty: 'Medium',
      bloomLevel: 'Understand',
      question: "Function Properties: Explain the key properties of continuous functions and their behavior.",
      status: 'completed',
      score: 88,
      acceptanceRate: 76,
      timeSpent: '4 minutes',
      answer: "Continuous functions have no breaks, jumps, or holes. Key properties: limit equals function value at each point, intermediate value theorem applies, closed intervals map to closed intervals. Composition of continuous functions is continuous."
    },
    {
      date: '2025-08-30',
      category: 'Vectors and matrices',
      difficulty: 'Hard',
      bloomLevel: 'Analyze',
      question: "Matrix Determinants: Explain methods for calculating determinants and their geometric significance.",
      status: 'completed',
      score: 69,
      acceptanceRate: 52,
      timeSpent: '8 minutes',
      answer: "For 2×2: det(A) = ad - bc. For 3×3: use cofactor expansion. Geometric meaning: determinant gives scaling factor of linear transformation. Zero determinant means matrix is singular (not invertible). Sign indicates orientation preservation."
    },
    {
      date: '2025-08-29',
      category: 'Vectors and matrices',
      difficulty: 'Medium',
      bloomLevel: 'Apply',
      question: "Vector Applications: Find the equation of the plane passing through points A(1,2,3), B(0,1,4), and C(2,0,1).",
      status: 'completed',
      score: 85,
      acceptanceRate: 74,
      timeSpent: '4 minutes',
      answer: "Find two vectors in the plane: AB = (-1,-1,1) and AC = (1,-2,-2). Normal vector n = AB × AC = (4,1,3). Using point A, plane equation: 4(x-1) + 1(y-2) + 3(z-3) = 0, which simplifies to 4x + y + 3z = 15."
    },
    {
      date: '2025-08-28',
      category: 'Complex numbers',
      difficulty: 'Easy',
      bloomLevel: 'Remember',
      question: "Complex Roots: Explain how quadratic equations can have complex solutions.",
      status: 'completed',
      score: 91,
      acceptanceRate: 87,
      timeSpent: '3 minutes',
      answer: "For ax² + bx + c = 0: x = (-b ± √(b²-4ac))/(2a). When discriminant Δ = b²-4ac < 0, we get complex roots of the form a ± bi. Example: x² + x + 1 = 0 gives x = (-1 ± i√3)/2."
    },
    {
      date: '2025-08-27',
      category: 'Vectors and matrices',
      difficulty: 'Medium',
      bloomLevel: 'Apply',
      question: "Vector Projections: Explain how to find the projection of one vector onto another.",
      status: 'completed',
      score: 82,
      acceptanceRate: 71,
      timeSpent: '5 minutes',
      answer: "Projection of vector a onto b: proj_b(a) = ((a·b)/|b|²)b. This gives the component of a in direction of b. Scalar projection (length): comp_b(a) = (a·b)/|b|. Useful in physics for finding components and work calculations."
    },
    {
      date: '2025-08-26',
      category: 'Applications of derivatives',
      difficulty: 'Hard',
      bloomLevel: 'Evaluate',
      question: "Curve Sketching: Analyze and sketch f(x) = x³ - 6x² + 9x + 1 including domain, critical points, inflection points, and asymptotes.",
      status: 'completed',
      score: 74,
      acceptanceRate: 59,
      timeSpent: '6 minutes',
      answer: "Domain: all real numbers. f'(x) = 3x² - 12x + 9 = 3(x-1)(x-3), critical points at x = 1,3. f''(x) = 6x - 12, inflection point at x = 2. f(1) = 5 (local max), f(3) = 1 (local min), f(2) = 3 (inflection). No asymptotes. Curve increases on (-∞,1)∪(3,∞), decreases on (1,3)."
    },
    {
      date: '2025-08-25',
      category: 'Limits and continuity of functions',
      difficulty: 'Easy',
      bloomLevel: 'Remember',
      question: "Function Domains: Explain how to determine the domain of various types of functions.",
      status: 'completed',
      score: 93,
      acceptanceRate: 90,
      timeSpent: '3 minutes',
      answer: "Domain is the set of all valid input values. Restrictions: division by zero, square roots of negatives (in real numbers), logarithms of non-positive numbers. Example: f(x) = √(x-2)/(x+1) has domain x ≥ 2 and x ≠ -1."
    },
    {
      date: '2025-08-24',
      category: 'Limits and continuity of functions',
      difficulty: 'Medium',
      bloomLevel: 'Analyze',
      question: "Function Analysis: Explain methods for analyzing function behavior and finding key features.",
      status: 'completed',
      score: 79,
      acceptanceRate: 67,
      timeSpent: '5 minutes',
      answer: "Key features include domain, range, intercepts, asymptotes, and continuity. Use algebraic techniques, limit analysis, and graphical interpretation. Consider sign changes, critical values, and end behavior for complete analysis."
    },
    {
      date: '2025-08-23',
      category: 'Complex numbers',
      difficulty: 'Hard',
      bloomLevel: 'Create',
      question: "De Moivre's Theorem: Explain De Moivre's theorem and its applications to powers and roots.",
      status: 'completed',
      score: 68,
      acceptanceRate: 51,
      timeSpent: '7 minutes',
      answer: "De Moivre's theorem: (r(cos θ + i sin θ))ⁿ = rⁿ(cos nθ + i sin nθ). Used for powers of complex numbers in polar form. For nth roots: if z = r(cos θ + i sin θ), then nth roots are r^(1/n)(cos((θ+2πk)/n) + i sin((θ+2πk)/n)) for k = 0,1,...,n-1."
    },
    {
      date: '2025-08-22',
      category: 'Derivatives',
      difficulty: 'Medium',
      bloomLevel: 'Apply',
      question: "Product and Quotient Rules: Find the derivative of h(x) = (x² + 1)/(x³ - 2x) using the quotient rule.",
      status: 'completed',
      score: 80,
      acceptanceRate: 70,
      timeSpent: '5 minutes',
      answer: "Using quotient rule: h'(x) = [(x³-2x)(2x) - (x²+1)(3x²-2)] / (x³-2x)². Numerator: 2x⁴-4x² - 3x⁴-3x²+2 = -x⁴-7x²+2. So h'(x) = (-x⁴-7x²+2)/(x³-2x)². Domain excludes x = 0, ±√2."
    },
    {
      date: '2025-08-21',
      category: 'Limits and continuity of functions',
      difficulty: 'Easy',
      bloomLevel: 'Understand',
      question: "Domain and Range: Explain how to find the domain and range of various types of functions.",
      status: 'completed',
      score: 88,
      acceptanceRate: 85,
      timeSpent: '3 minutes',
      answer: "Domain: all valid input values. Restrictions: division by zero, negative under square roots, negative bases with fractional exponents. Range: all possible output values. For polynomials: domain = ℝ. Use graphs, end behavior, and critical points to find range."
    },
    {
      date: '2025-08-20',
      category: 'Limits and continuity of functions',
      difficulty: 'Medium',
      bloomLevel: 'Analyze',
      question: "Infinite Limits: Analyze the behavior of f(x) = 1/(x-2)² as x approaches 2 from both sides.",
      status: 'completed',
      score: 84,
      acceptanceRate: 73,
      timeSpent: '4 minutes',
      answer: "As x→2⁺, (x-2)→0⁺, so (x-2)²→0⁺, thus f(x)→+∞. As x→2⁻, (x-2)→0⁻, so (x-2)²→0⁺, thus f(x)→+∞. Therefore lim(x→2) f(x) = +∞. The function has a vertical asymptote at x = 2. The graph approaches +∞ from both sides of x = 2."
    },
    // Academic Year Start - August 2025 (Week 1-2)
    {
      date: '2025-08-19',
      category: 'Complex numbers',
      difficulty: 'Easy',
      bloomLevel: 'Remember',
      question: "Complex Number Basics: What is the imaginary unit i and what is i²?",
      status: 'completed',
      score: 95,
      acceptanceRate: 92,
      timeSpent: '2 minutes',
      answer: "The imaginary unit i is defined as the square root of -1. Therefore i² = -1. This is the fundamental property that defines complex numbers and allows us to work with square roots of negative numbers."
    },
    {
      date: '2025-08-18',
      category: 'Complex numbers',
      difficulty: 'Easy',
      bloomLevel: 'Understand',
      question: "Complex Number Definition: Express the complex number 3 - 4i in the form a + bi and identify the real and imaginary parts.",
      status: 'completed',
      score: 89,
      acceptanceRate: 88,
      timeSpent: '3 minutes',
      answer: "The complex number 3 - 4i is already in standard form a + bi where a = 3 (real part) and b = -4 (imaginary part). The real part is 3 and the imaginary part is -4 (note: the imaginary part is the coefficient of i, not including i itself)."
    },
    {
      date: '2025-08-17',
      category: 'Complex numbers',
      difficulty: 'Medium',
      bloomLevel: 'Apply',
      question: "Complex Number Addition: Calculate (2 + 3i) + (4 - 5i) and express your answer in standard form.",
      status: 'completed',
      score: 82,
      acceptanceRate: 79,
      timeSpent: '4 minutes',
      answer: "Add the real parts and imaginary parts separately: (2 + 3i) + (4 - 5i) = (2 + 4) + (3i - 5i) = 6 + (-2i) = 6 - 2i. So the answer is 6 - 2i."
    },
    {
      date: '2025-08-16',
      category: 'Complex numbers',
      difficulty: 'Medium',
      bloomLevel: 'Analyze',
      question: "Complex Number Subtraction: Find (7 + 2i) - (3 + 6i) and explain the process step by step.",
      status: 'completed',
      score: 78,
      acceptanceRate: 76,
      timeSpent: '5 minutes',
      answer: "Subtract the real parts and imaginary parts separately: (7 + 2i) - (3 + 6i) = (7 - 3) + (2i - 6i) = 4 + (-4i) = 4 - 4i. The key is to distribute the negative sign and combine like terms."
    },
    {
      date: '2025-08-15',
      category: 'Complex numbers',
      difficulty: 'Hard',
      bloomLevel: 'Evaluate',
      question: "Complex Conjugate: Find the complex conjugate of 5 - 3i and explain its geometric significance.",
      status: 'completed',
      score: 71,
      acceptanceRate: 68,
      timeSpent: '6 minutes',
      answer: "The complex conjugate of 5 - 3i is 5 + 3i (change the sign of the imaginary part). Geometrically, this represents a reflection across the real axis in the complex plane. The product of a complex number and its conjugate gives a real number: (5 - 3i)(5 + 3i) = 25 + 9 = 34.",
      attempts: [
        { attemptNumber: 1, score: 58, date: '2025-08-15', timeSpent: '8 minutes' },
        { attemptNumber: 2, score: 71, date: '2025-08-15', timeSpent: '6 minutes' }
      ]
    },
    {
      date: '2025-08-14',
      category: 'Complex numbers',
      difficulty: 'Hard',
      bloomLevel: 'Create',
      question: "Complex Number Applications: Design a problem involving complex numbers that demonstrates both algebraic and geometric properties.",
      status: 'completed',
      score: 85,
      acceptanceRate: 62,
      timeSpent: '8 minutes',
      answer: "Problem: Find all complex numbers z such that z² = -1. Solution: Let z = a + bi. Then (a + bi)² = a² - b² + 2abi = -1. This gives us a² - b² = -1 and 2ab = 0. From 2ab = 0, either a = 0 or b = 0. If a = 0, then -b² = -1, so b = ±1, giving z = ±i. If b = 0, then a² = -1, which has no real solutions. Therefore z = i or z = -i."
    },
    {
      date: '2025-08-13',
      category: 'Vectors and matrices',
      difficulty: 'Easy',
      bloomLevel: 'Remember',
      question: "Vector Basics: What is a vector and how do we represent it geometrically?",
      status: 'completed',
      score: 91,
      acceptanceRate: 89,
      timeSpent: '3 minutes',
      answer: "A vector is a quantity that has both magnitude (length) and direction. Geometrically, we represent it as an arrow where the length represents the magnitude and the arrow points in the direction. Algebraically, we can write it as (x, y) in 2D or (x, y, z) in 3D."
    },
    {
      date: '2025-08-12',
      category: 'Vectors and matrices',
      difficulty: 'Easy',
      bloomLevel: 'Understand',
      question: "Vector Components: If vector v points from origin to point (3, 4), what are its components and magnitude?",
      status: 'completed',
      score: 87,
      acceptanceRate: 85,
      timeSpent: '4 minutes',
      answer: "The vector v has components (3, 4), meaning it moves 3 units in the x-direction and 4 units in the y-direction. The magnitude is |v| = √(3² + 4²) = √(9 + 16) = √25 = 5."
    },
    {
      date: '2025-08-11',
      category: 'Vectors and matrices',
      difficulty: 'Medium',
      bloomLevel: 'Apply',
      question: "Vector Addition: Find the sum of vectors u = (2, -1) and v = (-3, 4). Illustrate this geometrically.",
      status: 'completed',
      score: 83,
      acceptanceRate: 81,
      timeSpent: '5 minutes',
      answer: "Vector addition: u + v = (2, -1) + (-3, 4) = (2 + (-3), -1 + 4) = (-1, 3). Geometrically, place the tail of vector v at the head of vector u. The resultant vector goes from the tail of u to the head of v, representing the sum."
    },
    {
      date: '2025-09-29',
      category: 'Applications of derivatives',
      difficulty: 'Medium',
      bloomLevel: 'Evaluate',
      question: "Newton's Method: Use Newton's method to approximate the root of f(x) = x³ - 2x - 5 starting with x₀ = 2.",
      status: 'pending',
      score: null,
      acceptanceRate: 78,
      timeSpent: null,
      answer: null
    },
    {
      date: '2025-09-30',
      category: 'Applications of derivatives',
      difficulty: 'Hard',
      bloomLevel: 'Analyze',
      question: "Optimization Problem: A company wants to design a cylindrical container with a volume of 1000 cm³. The material for the top and bottom costs $0.05/cm², while the side material costs $0.03/cm². Find the dimensions that minimize the total cost and calculate the minimum cost.",
      status: 'pending',
      score: null,
      acceptanceRate: 68,
      timeSpent: null,
      answer: null
    }
  ]);

function addChallengeAttempt({ question, answer, score }) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    setChallengeHistory(prev => [
    {
      date: dateStr,
      category: '', // Fill in later
      difficulty: '', // Fill in later
      bloomLevel: '', // Fill in later
      question,
      status: 'completed',
      score,
      acceptanceRate: null,
      timeSpent: null,
      answer,
      attempts: [
        { attemptNumber: 1, score, date: dateStr, timeSpent: null }
      ]
    },
    ...prev
  ]);
}

// Helper function to ensure all challenges have attempts arrays
  const processedChallengeHistory = challengeHistory.map(challenge => ({
    ...challenge,
    attempts: challenge.attempts || [
      { 
        attemptNumber: 1, 
        score: challenge.score, 
        date: challenge.date, 
        timeSpent: challenge.timeSpent 
      }
    ]
  }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyTag = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return { color: 'text-green-600', label: 'Easy' };
      case 'Medium': return { color: 'text-yellow-600', label: 'Med.' };
      case 'Hard': return { color: 'text-red-600', label: 'Hard' };
      default: return { color: 'text-gray-600', label: difficulty };
    }
  };

  const getFilteredChallenges = () => {
    let filtered = processedChallengeHistory.filter(challenge => {
      const monthMatch = selectedMonth === 'All Time' || 
        (selectedMonth === 'September 2025' && challenge.date.startsWith('2025-09')) ||
        (selectedMonth === 'August 2025' && challenge.date.startsWith('2025-08'));
      
      const topicMatch = selectedTopic === 'All Topics' || challenge.category === selectedTopic;
      
      const difficultyMatch = selectedDifficulty === 'All Levels' || challenge.difficulty === selectedDifficulty;
      
      const statusMatch = selectedStatus === 'All Status' || challenge.status === selectedStatus;
      
      const searchMatch = searchQuery === '' || 
        challenge.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return monthMatch && topicMatch && difficultyMatch && statusMatch && searchMatch;
    });

    // Sort the filtered results
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime(); // Latest first
        case 'topic':
          return a.category.localeCompare(b.category);
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
                 (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  };

  const getCurrentPageChallenges = () => {
    const filteredChallenges = getFilteredChallenges();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredChallenges.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filteredChallenges = getFilteredChallenges();
    return Math.ceil(filteredChallenges.length / itemsPerPage);
  };

  const resetFilters = () => {
    setSelectedMonth('All Time');
    setSelectedTopic('All Topics');
    setSelectedDifficulty('All Levels');
    setSelectedStatus('All Status');
    setSearchQuery('');
    setSortBy('date');
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedTopic, selectedDifficulty, selectedStatus, searchQuery, sortBy]);

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Header with Info Icon */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-semibold text-gray-900">Daily Challenges</h1>
          <Popover open={showInfoPopup} onOpenChange={setShowInfoPopup}>
            <PopoverTrigger asChild>
              <div
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 cursor-pointer flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowInfoPopup(!showInfoPopup);
                  }
                }}
              >
                <Info className="h-4 w-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">How Daily Challenges Work</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Our intelligent system adapts to your learning progress, starting with easy questions to build confidence. 
                  As you demonstrate mastery, challenges gradually increase in difficulty to medium and hard levels.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  If you struggle with a concept, the system provides similar easy questions to ensure you fully grasp the fundamentals before advancing.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The ⭐ <strong>acceptance rate</strong> shows the percentage of all students who successfully completed each challenge, 
                  helping you gauge question difficulty and your performance relative to peers.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-sm text-gray-500">Active Learning Analytics: Build consistency and see how your responses improve over time</p>
      </div>

      {/* Progress Section - Reorganized Layout with Collapsible Sections */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Streak & Activity Section */}
          <Collapsible open={streakActivityOpen} onOpenChange={setStreakActivityOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-gray-50">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Streak & Activity</h3>
                {streakActivityOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-800 text-sm">Current Streak</span>
                    </div>
                    <div className="text-lg opacity-50">🔥</div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-orange-900">{currentStreak}</span>
                    <span className="text-xs ml-1 text-orange-700">days</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 text-sm">Personal Best</span>
                    </div>
                    <div className="text-lg opacity-50">🏆</div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-yellow-900">{longestStreak}</span>
                    <span className="text-xs ml-1 text-yellow-700">days</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800 text-sm">This Month</span>
                    </div>
                    <div className="text-lg opacity-50">📈</div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-blue-900">{monthlyAttempts}</span>
                    <span className="text-xs ml-1 text-blue-700">challenges</span>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Separator */}
          <div className="border-t border-gray-100"></div>

          {/* Performance Overview Section */}
          <Collapsible open={performanceOverviewOpen} onOpenChange={setPerformanceOverviewOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-gray-50">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Performance Overview</h3>
                {performanceOverviewOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Circular Progress */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-3">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="45" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="6"
                        strokeDasharray={`${(progressStats.totalSolved / progressStats.totalAttempted) * 283} 283`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{progressStats.totalSolved}</span>
                      <span className="text-xs text-gray-500">/{progressStats.totalAttempted}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-gray-500">Solved</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-500">{progressStats.attempting} Attempting</span>
                  </div>
                </div>
                
                {/* Right: Difficulty Breakdown */}
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-600 font-medium text-sm">Easy</span>
                      <span className="text-gray-900 font-bold">{progressStats.easy.solved}/{progressStats.easy.total}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-medium text-sm">Medium</span>
                      <span className="text-gray-900 font-bold">{progressStats.medium.solved}/{progressStats.medium.total}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-medium text-sm">Hard</span>
                      <span className="text-gray-900 font-bold">{progressStats.hard.solved}/{progressStats.hard.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Separator */}
          <div className="border-t border-gray-100"></div>

          {/* Learning Analytics Insights Section */}
          <Collapsible open={learningInsightsOpen} onOpenChange={setLearningInsightsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-gray-50">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Learning Analytics Insights</h3>
                {learningInsightsOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h4 className="font-medium text-blue-900 mb-2">Performance Trends</h4>
                  <p className="text-sm text-blue-700">
                    Your average score has improved by <span className="font-semibold">12%</span> over the last 2 weeks through consistent practice.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <h4 className="font-medium text-purple-900 mb-2">Learning Patterns</h4>
                  <p className="text-sm text-purple-700">
                    You excel at <span className="font-semibold">Integration</span> topics but could benefit from more practice with <span className="font-semibold">Complex Numbers</span>.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <h4 className="font-medium text-green-900 mb-2">Improvement Feedback</h4>
                  <p className="text-sm text-green-700">
                    Redoing challenges shows <span className="font-semibold">23% better explanations</span> and deeper understanding development.
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>



      {/* Challenge History with Sort and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Challenge History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Control Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort and Filter Controls */}
            <div className="flex gap-2">
              {/* Sort Dropdown */}
              <Popover open={showSortMenu} onOpenChange={setShowSortMenu}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sort by</h4>
                    <div className="space-y-1">
                      {[
                        { value: 'date', label: 'Date (Latest first)' },
                        { value: 'topic', label: 'Topic' },
                        { value: 'difficulty', label: 'Difficulty' }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={sortBy === option.value ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm"
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortMenu(false);
                          }}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Filter Dropdown */}
              <Popover open={showFilterMenu} onOpenChange={setShowFilterMenu}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filter challenges</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700"
                        onClick={resetFilters}
                      >
                        <Reset className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                    </div>
                    
                    {/* Time Period Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time Period</label>
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Time">All Time</SelectItem>
                          <SelectItem value="September 2025">September 2025</SelectItem>
                          <SelectItem value="August 2025">August 2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Status">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Difficulty Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Levels">All Levels</SelectItem>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Topic Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Topics</label>
                      <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Topics">All Topics</SelectItem>
                          <SelectItem value="Complex numbers">Complex numbers</SelectItem>
                          <SelectItem value="Vectors and matrices">Vectors and matrices</SelectItem>
                          <SelectItem value="Limits and continuity of functions">Limits and continuity of functions</SelectItem>
                          <SelectItem value="Derivatives">Derivatives</SelectItem>
                          <SelectItem value="Applications of derivatives">Applications of derivatives</SelectItem>
                          <SelectItem value="Integration">Integration</SelectItem>
                          <SelectItem value="Integration methods">Integration methods</SelectItem>
                          <SelectItem value="Applications of integration">Applications of integration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Challenge List */}
          <div className="space-y-3">
            {getCurrentPageChallenges().map((challenge, index) => {
              const isCompleted = challenge.status === 'completed';
              const formatDate = (dateString: string) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                });
              };
              
              return (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  
                  {/* Challenge Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 leading-snug break-words flex-1">
                            {challenge.question}
                          </h3>
                          {isCompleted && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`font-semibold ${getScoreColor(challenge.score)}`}>
                                {challenge.score}%
                              </span>
                              {challenge.attempts && challenge.attempts.length > 1 && (
                                <div className="flex items-center gap-1">
                                  {(() => {
                                    const firstScore = challenge.attempts[0].score;
                                    const lastScore = challenge.attempts[challenge.attempts.length - 1].score;
                                    const improvement = lastScore - firstScore;
                                    
                                    if (improvement > 0) {
                                      return (
                                        <div className="flex items-center gap-1 text-green-600">
                                          <TrendingUp className="h-3 w-3" />
                                          <span className="text-xs font-medium">+{improvement}%</span>
                                        </div>
                                      );
                                    } else if (improvement < 0) {
                                      return (
                                        <div className="flex items-center gap-1 text-orange-500">
                                          <TrendingDown className="h-3 w-3" />
                                          <span className="text-xs font-medium">{improvement}%</span>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-gray-500">
                          <span>{formatDate(challenge.date)}</span>
                          <span>•</span>
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                            {challenge.category}
                          </Badge>
                          <span>•</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}
                          >
                            {challenge.difficulty}
                          </Badge>
                          {challenge.bloomLevel && (
                            <>
                              <span>•</span>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                {challenge.bloomLevel}
                              </Badge>
                            </>
                          )}
                          {challenge.bloomLevel && (
                            <>
                              <span>•</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs cursor-help">
                                    {getKolbStage(challenge.bloomLevel).stage}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-64">
                                  <p className="text-sm">{getKolbStage(challenge.bloomLevel).tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </>
                          )}
                          {challenge.attempts && challenge.attempts.length > 1 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <RotateCcw className="h-3 w-3 text-purple-500" />
                                <span className="text-purple-600 font-medium">
                                  {challenge.attempts.length} attempts
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedChallenge(challenge);
                              setShowChatbot(true);
                            }}
                          >
                            View
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              setSelectedChallenge(challenge);
                              setShowChatbot(true);
     }}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {getTotalPages() > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {/* Show page numbers */}
                  {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const shouldShow = 
                      page === 1 || 
                      page === getTotalPages() || 
                      Math.abs(page - currentPage) <= 1;
                    
                    if (!shouldShow) {
                      // Show ellipsis for gaps
                      if (page === 2 && currentPage > 4) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      if (page === getTotalPages() - 1 && currentPage < getTotalPages() - 3) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                      className={currentPage === getTotalPages() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, getFilteredChallenges().length)} to{' '}
            {Math.min(currentPage * itemsPerPage, getFilteredChallenges().length)} of{' '}
            {getFilteredChallenges().length} challenges
          </div>
        </CardContent>
      </Card>

      {/* Updated Answer Modal */}
      {showAnswerModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Your Answer</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAnswerModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedChallenge.date}
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                  {selectedChallenge.category}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getDifficultyColor(selectedChallenge.difficulty)}`}
                >
                  {selectedChallenge.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Challenge Question:</h4>
                <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedChallenge.question}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Your Response:</h4>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {selectedChallenge.answer}
                  </p>
                </div>
              </div>

              {/* Retry Statistics */}
              {selectedChallenge.attempts && selectedChallenge.attempts.length > 1 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Learning Progress Analytics</h4>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <RotateCcw className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">
                        Attempted {selectedChallenge.attempts.length} time{selectedChallenge.attempts.length > 1 ? 's' : ''} - Shows dedication to improvement!
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {selectedChallenge.attempts.map((attempt: any, index: number) => {
                        const isImprovement = index > 0 && attempt.score > selectedChallenge.attempts[index - 1].score;
                        const isDecline = index > 0 && attempt.score < selectedChallenge.attempts[index - 1].score;
                        
                        return (
                          <div key={index} className="flex items-center justify-between bg-white rounded p-3 border border-purple-100">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-gray-700">
                                  Attempt {attempt.attemptNumber}:
                                </span>
                                <span className={`font-semibold ${getScoreColor(attempt.score)}`}>
                                  {attempt.score}%
                                </span>
                                {index > 0 && (
                                  <div className="flex items-center gap-1 ml-2">
                                    {isImprovement && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <TrendingUp className="h-3 w-3" />
                                        <span className="text-xs font-medium">
                                          +{attempt.score - selectedChallenge.attempts[index - 1].score}%
                                        </span>
                                      </div>
                                    )}
                                    {isDecline && (
                                      <div className="flex items-center gap-1 text-orange-500">
                                        <TrendingDown className="h-3 w-3" />
                                        <span className="text-xs font-medium">
                                          {attempt.score - selectedChallenge.attempts[index - 1].score}%
                                        </span>
                                      </div>
                                    )}
                                    {!isImprovement && !isDecline && (
                                      <div className="flex items-center gap-1 text-gray-500">
                                        <span className="text-xs">Same score</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {attempt.timeSpent}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Improvement Summary */}
                    {selectedChallenge.attempts.length > 1 && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Overall Improvement: +
                            {selectedChallenge.attempts[selectedChallenge.attempts.length - 1].score - selectedChallenge.attempts[0].score}% 
                            from first to final attempt
                          </span>
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          Redoing challenges demonstrates active learning and leads to better understanding!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    Completed in {selectedChallenge.timeSpent}
                  </span>
                  <span className={`flex items-center gap-1 font-semibold ${getScoreColor(selectedChallenge.score)}`}>
                    <Star className="h-4 w-4" />
                    Score: {selectedChallenge.score}%
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Users className="h-4 w-4 text-blue-500" />
                    Acceptance Rate: {selectedChallenge.acceptanceRate}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowAnswerModal(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setShowAnswerModal(false);
                    if (onStartChallenge) {
                      onStartChallenge();
                    }
                  }}>
                    Redo Challenge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {showChatbot && selectedChallenge && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
      <GeneralChatbot
        mode="challenge"
        initialQuestion={selectedChallenge.question}
        onChallengeComplete={(data) => {
          addChallengeAttempt({
      ...data,
      category: selectedChallenge.category,
      difficulty: selectedChallenge.difficulty,
      bloomLevel: selectedChallenge.bloomLevel
    }); // <-- This updates challengeHistory
          setShowChatbot(false);
        }}
        onClose={() => setShowChatbot(false)}
      />
    </div>
  </div>
)}
        </div>
      )}
      </div>
      
    </TooltipProvider>
  );
}
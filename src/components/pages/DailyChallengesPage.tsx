import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { Calendar, Flame, Trophy, Target, Clock, CheckCircle2, X, Star, Play, RotateCcw, Filter, BarChart3, TrendingUp, Info, Search, ArrowUpDown, SlidersHorizontal, RotateCcw as Reset } from 'lucide-react';

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

  // Updated challenge history with August-September 2025 data (50+ challenges)
  const challengeHistory = [
    {
      date: '2025-09-28',
      category: 'Derivatives',
      difficulty: 'Medium',
      question: "Chain Rule Application: Imagine you're explaining the chain rule to a study group. How would you describe when and why we use it for composite functions?",
      status: 'completed',
      score: 85,
      acceptanceRate: 84,
      timeSpent: '4 minutes',
      answer: "The chain rule applies when differentiating composite functions f(g(x)). Steps: 1) Identify outer and inner functions, 2) Find derivative of outer function, 3) Multiply by derivative of inner function. Common mistakes: Forgetting the inner derivative, incorrect function identification, sign errors. Example: d/dx[sin(x²)] = cos(x²) · 2x"
    },
    {
      date: '2025-09-27',
      category: 'Integration',
      difficulty: 'Hard',
      question: "Integration by Parts: Explain when and how to use integration by parts, including the strategy for choosing u and dv.",
      status: 'completed',
      score: 92,
      acceptanceRate: 65,
      timeSpent: '7 minutes',
      answer: "Integration by parts: ∫u dv = uv - ∫v du. Strategy for choosing u (LIATE): Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential. Choose u as the function that becomes simpler when differentiated. Example: ∫x ln(x) dx, let u = ln(x), dv = x dx."
    },
    {
      date: '2025-09-26',
      category: 'Limits',
      difficulty: 'Easy',
      question: "Limit Evaluation: Explain the concept of limits and describe three methods for evaluating limits.",
      status: 'completed',
      score: 78,
      acceptanceRate: 92,
      timeSpent: '3 minutes',
      answer: "Limits describe function behavior as input approaches a value. Methods: 1) Direct substitution (if function is continuous), 2) Factoring and cancellation for indeterminate forms, 3) L'Hôpital's rule for 0/0 or ∞/∞ forms. Limits form the foundation for derivatives and integrals."
    },
    {
      date: '2025-09-25',
      category: 'Complex Numbers',
      difficulty: 'Medium',
      question: "Complex Number Forms: Explain how to convert between rectangular and polar forms of complex numbers.",
      status: 'completed',
      score: 88,
      acceptanceRate: 76,
      timeSpent: '5 minutes',
      answer: "Rectangular: z = a + bi. Polar: z = r(cos θ + i sin θ) = re^(iθ). Conversion: r = √(a² + b²), θ = arctan(b/a). Polar form is useful for multiplication/division and finding powers/roots. Rectangular form is better for addition/subtraction."
    },
    {
      date: '2025-09-24',
      category: 'Applications',
      difficulty: 'Hard',
      question: "Optimization Problems: Explain how to solve optimization problems using calculus, including the complete process.",
      status: 'completed',
      score: 76,
      acceptanceRate: 58,
      timeSpent: '6 minutes',
      answer: "Optimization process: 1) Define variables and constraints, 2) Express objective function in terms of one variable, 3) Find critical points (f'(x) = 0), 4) Use second derivative test or endpoint comparison, 5) Verify answer makes physical sense. Always check boundary conditions."
    },
    {
      date: '2025-09-23',
      category: 'Vectors',
      difficulty: 'Easy',
      question: "Vector Operations: Explain dot product and cross product of vectors, including their geometric interpretations.",
      status: 'completed',
      score: 94,
      acceptanceRate: 89,
      timeSpent: '4 minutes',
      answer: "Dot product: a·b = |a||b|cos(θ), gives scalar. Cross product: a×b = |a||b|sin(θ)n̂, gives vector perpendicular to both. Dot product measures projection, cross product gives area of parallelogram and perpendicular vector."
    },
    {
      date: '2025-09-22',
      category: 'Integration',
      difficulty: 'Medium',
      question: "Definite Integrals: Explain the Fundamental Theorem of Calculus and its applications.",
      status: 'completed',
      score: 82,
      acceptanceRate: 71,
      timeSpent: '5 minutes',
      answer: "FTC Part 1: If f is continuous on [a,b], then F(x) = ∫ᵃˣ f(t)dt is differentiable and F'(x) = f(x). FTC Part 2: ∫ᵃᵇ f(x)dx = F(b) - F(a) where F'(x) = f(x). Links differentiation and integration."
    },
    {
      date: '2025-09-21',
      category: 'Functions',
      difficulty: 'Easy',
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
      question: "Implicit Differentiation: Explain when and how to use implicit differentiation with examples.",
      status: 'completed',
      score: 79,
      acceptanceRate: 68,
      timeSpent: '5 minutes',
      answer: "Use implicit differentiation when y cannot be easily solved explicitly. Differentiate both sides with respect to x, treating y as function of x. Remember dy/dx appears in chain rule applications. Example: x² + y² = 25 → 2x + 2y(dy/dx) = 0 → dy/dx = -x/y."
    },
    {
      date: '2025-09-19',
      category: 'Trigonometry',
      difficulty: 'Medium',
      question: "Trigonometric Identities: Explain the Pythagorean identities and how they're derived from the unit circle.",
      status: 'completed',
      score: 84,
      acceptanceRate: 73,
      timeSpent: '4 minutes',
      answer: "Main identity: sin²θ + cos²θ = 1 (from unit circle: x² + y² = 1). Dividing by cos²θ gives 1 + tan²θ = sec²θ. Dividing by sin²θ gives cot²θ + 1 = csc²θ. These form the foundation for solving trigonometric equations."
    },
    {
      date: '2025-09-18',
      category: 'Sequences',
      difficulty: 'Easy',
      question: "Arithmetic Sequences: Explain arithmetic sequences and how to find the nth term and sum formulas.",
      status: 'completed',
      score: 91,
      acceptanceRate: 88,
      timeSpent: '3 minutes',
      answer: "Arithmetic sequence has constant difference d. nth term: aₙ = a₁ + (n-1)d. Sum of first n terms: Sₙ = n/2[2a₁ + (n-1)d] or Sₙ = n/2(a₁ + aₙ). Example: 2, 5, 8, 11... has d=3, so a₁₀ = 2 + 9(3) = 29."
    },
    {
      date: '2025-09-17',
      category: 'Logarithms',
      difficulty: 'Medium',
      question: "Logarithmic Properties: Explain the three main logarithmic properties and their applications.",
      status: 'completed',
      score: 86,
      acceptanceRate: 75,
      timeSpent: '4 minutes',
      answer: "Three main properties: 1) log(ab) = log(a) + log(b), 2) log(a/b) = log(a) - log(b), 3) log(aⁿ) = n·log(a). These follow from exponential properties. Useful for solving exponential equations and simplifying complex logarithmic expressions."
    },
    {
      date: '2025-09-16',
      category: 'Matrices',
      difficulty: 'Hard',
      question: "Matrix Multiplication: Explain matrix multiplication rules and when two matrices can be multiplied.",
      status: 'completed',
      score: 73,
      acceptanceRate: 61,
      timeSpent: '6 minutes',
      answer: "Matrices A(m×n) and B(p×q) can multiply if n=p, resulting in (m×q) matrix. Element (i,j) = sum of products of row i of A with column j of B. Not commutative: AB ≠ BA generally. Important for linear transformations and systems of equations."
    },
    {
      date: '2025-09-15',
      category: 'Probability',
      difficulty: 'Easy',
      question: "Basic Probability: Explain probability fundamentals including sample space, events, and basic probability rules.",
      status: 'completed',
      score: 89,
      acceptanceRate: 86,
      timeSpent: '3 minutes',
      answer: "Probability P(E) = favorable outcomes / total outcomes. Sample space Ω contains all possible outcomes. Events are subsets of Ω. Basic rules: 0 ≤ P(E) ≤ 1, P(Ω) = 1, P(A∪B) = P(A) + P(B) - P(A∩B) for any events A,B."
    },
    {
      date: '2025-09-14',
      category: 'Polynomials',
      difficulty: 'Medium',
      question: "Polynomial Division: Explain long division and synthetic division for polynomials.",
      status: 'completed',
      score: 81,
      acceptanceRate: 69,
      timeSpent: '5 minutes',
      answer: "Long division: Divide highest degree terms, multiply back, subtract, repeat. Synthetic division: Shortcut for (x-c) divisors using only coefficients. Both give quotient and remainder. If remainder = 0, divisor is a factor. Useful for factoring and finding roots."
    },
    {
      date: '2025-09-13',
      category: 'Integration',
      difficulty: 'Hard',
      question: "Trigonometric Substitution: Explain when and how to use trigonometric substitution in integration.",
      status: 'completed',
      score: 77,
      acceptanceRate: 54,
      timeSpent: '7 minutes',
      answer: "Use for integrands with √(a²-x²), √(x²+a²), or √(x²-a²). Substitutions: x=a·sin(θ), x=a·tan(θ), x=a·sec(θ) respectively. Draw reference triangles to convert back. Transforms algebraic expressions to trigonometric ones that are easier to integrate."
    },
    {
      date: '2025-09-12',
      category: 'Series',
      difficulty: 'Hard',
      question: "Convergence Tests: Explain three different tests for determining series convergence.",
      status: 'completed',
      score: 71,
      acceptanceRate: 48,
      timeSpent: '8 minutes',
      answer: "1) Ratio test: lim|aₙ₊₁/aₙ| < 1 converges, > 1 diverges. 2) Root test: lim|aₙ|^(1/n) < 1 converges. 3) Integral test: If f(x) integrable and decreasing, ∫f(x)dx and Σf(n) have same convergence. Choose test based on series form."
    },
    {
      date: '2025-09-11',
      category: 'Limits',
      difficulty: 'Medium',
      question: "L'Hôpital's Rule: Explain L'Hôpital's rule and when it can be applied to evaluate limits.",
      status: 'completed',
      score: 83,
      acceptanceRate: 72,
      timeSpent: '4 minutes',
      answer: "L'Hôpital's rule applies to indeterminate forms 0/0 or ∞/∞. If lim f(x)/g(x) gives these forms, then lim f(x)/g(x) = lim f'(x)/g'(x) (if this limit exists). Can apply repeatedly. Also works for 0·∞, ∞-∞ after algebraic manipulation."
    },
    {
      date: '2025-09-10',
      category: 'Exponentials',
      difficulty: 'Easy',
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
      question: "Power Rule: Explain the power rule for differentiation and provide examples.",
      status: 'completed',
      score: 95,
      acceptanceRate: 94,
      timeSpent: '2 minutes',
      answer: "Power rule: d/dx[xⁿ] = n·xⁿ⁻¹ for any real number n. Examples: d/dx[x³] = 3x², d/dx[√x] = d/dx[x^(1/2)] = (1/2)x^(-1/2) = 1/(2√x). Works for negative and fractional exponents too."
    },
    {
      date: '2025-09-08',
      category: 'Geometry',
      difficulty: 'Medium',
      question: "Circle Equations: Explain standard and general forms of circle equations and how to convert between them.",
      status: 'completed',
      score: 88,
      acceptanceRate: 76,
      timeSpent: '4 minutes',
      answer: "Standard form: (x-h)² + (y-k)² = r² with center (h,k) and radius r. General form: x² + y² + Dx + Ey + F = 0. Convert by completing the square: group x and y terms, complete squares, rearrange to standard form."
    },
    {
      date: '2025-08-30',
      category: 'Matrices',
      difficulty: 'Hard',
      question: "Matrix Determinants: Explain methods for calculating determinants and their geometric significance.",
      status: 'completed',
      score: 69,
      acceptanceRate: 52,
      timeSpent: '8 minutes',
      answer: "For 2×2: det(A) = ad - bc. For 3×3: use cofactor expansion. Geometric meaning: determinant gives scaling factor of linear transformation. Zero determinant means matrix is singular (not invertible). Sign indicates orientation preservation."
    },
    {
      date: '2025-08-29',
      category: 'Statistics',
      difficulty: 'Medium',
      question: "Standard Deviation: Explain how to calculate and interpret standard deviation in data analysis.",
      status: 'completed',
      score: 85,
      acceptanceRate: 74,
      timeSpent: '4 minutes',
      answer: "Standard deviation σ = √(Σ(xᵢ-μ)²/N) for population, s = √(Σ(xᵢ-x̄)²/(n-1)) for sample. Measures spread of data around mean. Smaller σ means data clustered near mean. About 68% of normal data falls within 1σ of mean."
    },
    {
      date: '2025-08-28',
      category: 'Quadratics',
      difficulty: 'Easy',
      question: "Quadratic Formula: Explain the quadratic formula and how to use the discriminant.",
      status: 'completed',
      score: 91,
      acceptanceRate: 87,
      timeSpent: '3 minutes',
      answer: "For ax² + bx + c = 0: x = (-b ± √(b²-4ac))/(2a). Discriminant Δ = b²-4ac determines nature of roots: Δ > 0 (two real roots), Δ = 0 (one repeated root), Δ < 0 (no real roots, two complex roots)."
    },
    {
      date: '2025-08-27',
      category: 'Vectors',
      difficulty: 'Medium',
      question: "Vector Projections: Explain how to find the projection of one vector onto another.",
      status: 'completed',
      score: 82,
      acceptanceRate: 71,
      timeSpent: '5 minutes',
      answer: "Projection of vector a onto b: proj_b(a) = ((a·b)/|b|²)b. This gives the component of a in direction of b. Scalar projection (length): comp_b(a) = (a·b)/|b|. Useful in physics for finding components and work calculations."
    },
    {
      date: '2025-08-26',
      category: 'Rational Functions',
      difficulty: 'Hard',
      question: "Partial Fractions: Explain the method of partial fraction decomposition for rational functions.",
      status: 'completed',
      score: 74,
      acceptanceRate: 59,
      timeSpent: '6 minutes',
      answer: "Decompose P(x)/Q(x) where degree P < degree Q. Factor Q(x), write as sum: A/(x-a) for linear factors, (Ax+B)/(x²+bx+c) for irreducible quadratics. Solve for constants by clearing denominators or substitution. Essential for integration of rational functions."
    },
    {
      date: '2025-08-25',
      category: 'Trigonometry',
      difficulty: 'Easy',
      question: "Unit Circle: Explain the unit circle and how to find exact trigonometric values.",
      status: 'completed',
      score: 93,
      acceptanceRate: 90,
      timeSpent: '3 minutes',
      answer: "Unit circle has radius 1 centered at origin. Point (cos θ, sin θ) corresponds to angle θ. Key angles: 0°, 30°, 45°, 60°, 90° and their multiples. Exact values use √2/2, √3/2, 1/2. All trig functions can be derived from coordinates."
    },
    {
      date: '2025-08-24',
      category: 'Inequalities',
      difficulty: 'Medium',
      question: "Solving Inequalities: Explain methods for solving polynomial and rational inequalities.",
      status: 'completed',
      score: 79,
      acceptanceRate: 67,
      timeSpent: '5 minutes',
      answer: "For polynomial inequalities: 1) Find zeros, 2) Test intervals between zeros, 3) Consider sign changes. For rational inequalities: also find where denominator = 0 (vertical asymptotes). Use sign charts or graphing. Remember inequality reverses when multiplying/dividing by negatives."
    },
    {
      date: '2025-08-23',
      category: 'Complex Numbers',
      difficulty: 'Hard',
      question: "De Moivre's Theorem: Explain De Moivre's theorem and its applications to powers and roots.",
      status: 'completed',
      score: 68,
      acceptanceRate: 51,
      timeSpent: '7 minutes',
      answer: "De Moivre's theorem: (r(cos θ + i sin θ))ⁿ = rⁿ(cos nθ + i sin nθ). Used for powers of complex numbers in polar form. For nth roots: if z = r(cos θ + i sin θ), then nth roots are r^(1/n)(cos((θ+2πk)/n) + i sin((θ+2πk)/n)) for k = 0,1,...,n-1."
    },
    {
      date: '2025-08-22',
      category: 'Calculus',
      difficulty: 'Medium',
      question: "Related Rates: Explain the approach to solving related rates problems in calculus.",
      status: 'completed',
      score: 80,
      acceptanceRate: 70,
      timeSpent: '5 minutes',
      answer: "Related rates steps: 1) Identify given and unknown rates, 2) Draw diagram and define variables, 3) Write equation relating variables, 4) Differentiate implicitly with respect to time, 5) Substitute known values and solve. Chain rule is essential."
    },
    {
      date: '2025-08-21',
      category: 'Functions',
      difficulty: 'Easy',
      question: "Domain and Range: Explain how to find the domain and range of various types of functions.",
      status: 'completed',
      score: 88,
      acceptanceRate: 85,
      timeSpent: '3 minutes',
      answer: "Domain: all valid input values. Restrictions: division by zero, negative under square roots, negative bases with fractional exponents. Range: all possible output values. For polynomials: domain = ℝ. Use graphs, end behavior, and critical points to find range."
    },
    {
      date: '2025-08-20',
      category: 'Series',
      difficulty: 'Medium',
      question: "Geometric Series: Explain geometric series and their convergence conditions.",
      status: 'completed',
      score: 84,
      acceptanceRate: 73,
      timeSpent: '4 minutes',
      answer: "Geometric series: Σar^n from n=0 to ∞. Converges if |r| < 1 with sum a/(1-r). Diverges if |r| ≥ 1. Partial sum: Sₙ = a(1-r^(n+1))/(1-r). Common applications: infinite decimals, compound interest, population models."
    },
    {
      date: '2025-09-29',
      category: 'Calculus',
      difficulty: 'Medium',
      question: "Fundamental Theorem of Calculus: Explain both parts and provide practical applications in real-world scenarios.",
      status: 'completed',
      score: null,
      acceptanceRate: 78,
      timeSpent: null,
      answer: null
    },
    {
      date: '2025-09-30',
      category: 'Statistics',
      difficulty: 'Easy',
      question: "Central Limit Theorem: Explain what it states and why it's important in statistical analysis.",
      status: 'completed',
      score: null,
      acceptanceRate: 85,
      timeSpent: null,
      answer: null
    },
    {date: '2025-10-01',
     category: 'Derivatives',
     difficulty: 'Medium',
     question: 'Explain how the chain rule works when finding the derivative of composite functions. Use the example f(g(x)) where f(u) = u² and g(x) = 3x + 1 to illustrate your explanation.',
     status: 'completed',
     score: null,
     acceptanceRate: 80,
     timeSpent:null,
     answer:null,
    }
  ];

  const validAcceptanceRates = challengeHistory
  .map(ch => ch.acceptanceRate)
  .filter(rate => typeof rate === 'number' && rate !== null);

  const averageAccuracy = validAcceptanceRates.length
  ? Math.round(validAcceptanceRates.reduce((sum, rate) => sum + rate, 0) / validAcceptanceRates.length)
  : 0;

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
    let filtered = challengeHistory.filter(challenge => {
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
        <p className="text-sm text-gray-500">Build consistency and track your learning progress</p>
      </div>

      {/* Progress Section - Reorganized Layout */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Streak Statistics - Top Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">Streak & Activity</h3>
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
                  <span className="text-xl font-bold text-orange-900">10</span>
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
          </div>

          {/* Separator */}
          <div className="border-t border-gray-100"></div>

          {/* Performance Statistics - Bottom Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-4 uppercase tracking-wide">Performance Overview</h3>
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
          </div>
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
                          <SelectItem value="Derivatives">Derivatives</SelectItem>
                          <SelectItem value="Integration">Integration</SelectItem>
                          <SelectItem value="Limits">Limits</SelectItem>
                          <SelectItem value="Complex Numbers">Complex Numbers</SelectItem>
                          <SelectItem value="Applications">Applications</SelectItem>
                          <SelectItem value="Vectors">Vectors</SelectItem>
                          <SelectItem value="Matrices">Matrices</SelectItem>
                          <SelectItem value="Calculus">Calculus</SelectItem>
                          <SelectItem value="Statistics">Statistics</SelectItem>
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
                        <h3 className="font-medium text-gray-900 leading-snug break-words">
                          {challenge.question}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-gray-500">
                          <span>{formatDate(challenge.date)}</span>
                          <span>•</span>
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                            {challenge.category}
                          </Badge>
                          <span>•</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}
                          >
                            {challenge.difficulty}
                          </Badge>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{challenge.acceptanceRate}% acceptance</span>
                          </div>
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
                              setShowAnswerModal(true);
                            }}
                          >
                            View Answer
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => onStartChallenge?.()}
                          >
                            Start Challenge
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
                    ⭐ {selectedChallenge.acceptanceRate}% acceptance rate
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowAnswerModal(false)}>
                    Close
                  </Button>
                  <Button>
                    Try Similar Challenge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
// NTU Academic Calendar (Semester): AY2025-26 - Teaching Week Calculator

interface WeekPeriod {
  start: Date;
  end: Date;
  name: string;
  type: 'teaching' | 'recess' | 'revision and examination';
  weekNumber?: number;
}

const academicYear2025_2026 = {
  semester1: [
    // Term 1
    { start: new Date('2025-08-11'), end: new Date('2025-08-17'), name: 'Teaching Week 1', type: 'teaching' as const, weekNumber: 1 },
    { start: new Date('2025-08-18'), end: new Date('2025-08-24'), name: 'Teaching Week 2', type: 'teaching' as const, weekNumber: 2 },
    { start: new Date('2025-08-25'), end: new Date('2025-08-31'), name: 'Teaching Week 3', type: 'teaching' as const, weekNumber: 3 },
    { start: new Date('2025-09-01'), end: new Date('2025-09-07'), name: 'Teaching Week 4', type: 'teaching' as const, weekNumber: 4 },
    { start: new Date('2025-09-08'), end: new Date('2025-09-14'), name: 'Teaching Week 5', type: 'teaching' as const, weekNumber: 5 },
    { start: new Date('2025-09-15'), end: new Date('2025-09-21'), name: 'Teaching Week 6', type: 'teaching' as const, weekNumber: 6 },
    { start: new Date('2025-09-22'), end: new Date('2025-09-28'), name: 'Teaching Week 7', type: 'teaching' as const, weekNumber: 7 },
    
    // Recess
    { start: new Date('2025-09-29'), end: new Date('2025-10-05'), name: 'Recess Week', type: 'recess' as const },
    
    // Term 2
    { start: new Date('2025-10-06'), end: new Date('2025-10-12'), name: 'Teaching Week 8', type: 'teaching' as const, weekNumber: 8 },
    { start: new Date('2025-10-13'), end: new Date('2025-10-19'), name: 'Teaching Week 9', type: 'teaching' as const, weekNumber: 9 },
    { start: new Date('2025-10-20'), end: new Date('2025-10-26'), name: 'Teaching Week 10', type: 'teaching' as const, weekNumber: 10 },
    { start: new Date('2025-10-27'), end: new Date('2025-11-02'), name: 'Teaching Week 11', type: 'teaching' as const, weekNumber: 11 },
    { start: new Date('2025-11-03'), end: new Date('2025-11-09'), name: 'Teaching Week 12', type: 'teaching' as const, weekNumber: 12 },
    { start: new Date('2025-11-10'), end: new Date('2025-11-16'), name: 'Teaching Week 13', type: 'teaching' as const, weekNumber: 13 },
    
    // Revision and Examination
    { start: new Date('2025-11-17'), end: new Date('2025-11-23'), name: 'Revision and Examination Week 1', type: 'revision and examination' as const },
    { start: new Date('2025-11-24'), end: new Date('2025-11-30'), name: 'Revision and Examination Week 2', type: 'revision and examination' as const },
    { start: new Date('2025-12-01'), end: new Date('2025-12-07'), name: 'Revision and Examination Week 3', type: 'revision and examination' as const },
  ],
  semester2: [
    // Term 1
    { start: new Date('2026-01-12'), end: new Date('2026-01-18'), name: 'Teaching Week 1', type: 'teaching' as const, weekNumber: 1 },
    { start: new Date('2026-01-19'), end: new Date('2026-01-25'), name: 'Teaching Week 2', type: 'teaching' as const, weekNumber: 2 },
    { start: new Date('2026-01-26'), end: new Date('2026-02-01'), name: 'Teaching Week 3', type: 'teaching' as const, weekNumber: 3 },
    { start: new Date('2026-02-02'), end: new Date('2026-02-08'), name: 'Teaching Week 4', type: 'teaching' as const, weekNumber: 4 },
    { start: new Date('2026-02-09'), end: new Date('2026-02-15'), name: 'Teaching Week 5', type: 'teaching' as const, weekNumber: 5 },
    { start: new Date('2026-02-16'), end: new Date('2026-02-22'), name: 'Teaching Week 6', type: 'teaching' as const, weekNumber: 6 },
    { start: new Date('2026-02-23'), end: new Date('2026-03-01'), name: 'Teaching Week 7', type: 'teaching' as const, weekNumber: 7 },

    // Recess
    { start: new Date('2026-03-02'), end: new Date('2026-03-08'), name: 'Recess Week', type: 'recess' as const },

    // Term 2
    { start: new Date('2026-03-09'), end: new Date('2026-03-15'), name: 'Teaching Week 8', type: 'teaching' as const, weekNumber: 8 },
    { start: new Date('2026-03-16'), end: new Date('2026-03-22'), name: 'Teaching Week 9', type: 'teaching' as const, weekNumber: 9 },
    { start: new Date('2026-03-23'), end: new Date('2026-03-29'), name: 'Teaching Week 10', type: 'teaching' as const, weekNumber: 10 },
    { start: new Date('2026-03-30'), end: new Date('2026-04-05'), name: 'Teaching Week 11', type: 'teaching' as const, weekNumber: 11 },
    { start: new Date('2026-04-06'), end: new Date('2026-04-12'), name: 'Teaching Week 12', type: 'teaching' as const, weekNumber: 12 },
    { start: new Date('2026-04-13'), end: new Date('2026-04-19'), name: 'Teaching Week 13', type: 'teaching' as const, weekNumber: 13 },

    // Revision and Examination
    { start: new Date('2026-04-20'), end: new Date('2026-04-26'), name: 'Revision and Examination Week 1', type: 'revision and examination' as const },
    { start: new Date('2026-04-27'), end: new Date('2026-05-03'), name: 'Revision and Examination Week 2', type: 'revision and examination' as const },
    { start: new Date('2026-05-04'), end: new Date('2026-05-10'), name: 'Revision and Examination Week 3', type: 'revision and examination' as const },
  ]
};

// Flatten all academic weeks for searching
const allAcademicWeeks: WeekPeriod[] = [
  ...academicYear2025_2026.semester1,
  ...academicYear2025_2026.semester2
];

export function getCurrentAcademicWeek(currentDate: Date = new Date()): WeekPeriod | null {
  // Normalize the date to avoid timezone issues
  const normalizedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  
  for (const period of allAcademicWeeks) {
    const normalizedStart = new Date(period.start.getFullYear(), period.start.getMonth(), period.start.getDate());
    const normalizedEnd = new Date(period.end.getFullYear(), period.end.getMonth(), period.end.getDate());
    
    if (normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd) {
      return period;
    }
  }
  
  return null;
}

export function getWeeklyContent(weekNumber: number): {
  lectures: string[];
  tutorials: string[];
  topics: string[];
} {
  const weeklyContentMap: Record<number, {
    lectures: string[];
    tutorials: string[];
    topics: string[];
  }> = {
    1: {
      lectures: ['Lecture 1a: Introduction to Discrete Mathematics', 'Lecture 1b: Sets and Set Operations'],
      tutorials: ['Tutorial 1a: Basic Set Theory'],
      topics: ['Set Theory Fundamentals', 'Venn Diagrams']
    },
    2: {
      lectures: ['Lecture 2a: Functions and Relations', 'Lecture 2b: Properties of Relations'],
      tutorials: ['Tutorial 1b: Set Operations', 'Tutorial 2a: Functions'],
      topics: ['Functions', 'Relations', 'Function Composition']
    },
    3: {
      lectures: ['Lecture 3a: Propositional Logic', 'Lecture 3b: Truth Tables'],
      tutorials: ['Tutorial 2b: Relations', 'Tutorial 3a: Logic Basics'],
      topics: ['Propositional Logic', 'Truth Tables', 'Logical Operators']
    },
    4: {
      lectures: ['Lecture 4a: Logical Equivalences', 'Lecture 4b: Predicate Logic'],
      tutorials: ['Tutorial 3b: Truth Tables', 'Tutorial 4a: Logical Equivalences'],
      topics: ['Logical Equivalences', 'Predicate Logic', 'Quantifiers']
    },
    5: {
      lectures: ['Lecture 5a: Proof Techniques', 'Lecture 5b: Direct Proofs'],
      tutorials: ['Tutorial 4b: Predicate Logic', 'Tutorial 5a: Proof Methods'],
      topics: ['Direct Proofs', 'Proof by Contradiction', 'Mathematical Induction']
    },
    6: {
      lectures: ['Lecture 6a: Mathematical Induction', 'Lecture 6b: Strong Induction'],
      tutorials: ['Tutorial 5b: Direct Proofs', 'Tutorial 6a: Induction'],
      topics: ['Mathematical Induction', 'Strong Induction', 'Recursive Definitions']
    },
    7: {
      lectures: ['Lecture 7a: Elementary Number Theory', 'Lecture 7b: Divisibility'],
      tutorials: ['Tutorial 6b: Strong Induction', 'Tutorial 7a: Number Theory'],
      topics: ['Elementary Number Theory', 'Divisibility', 'GCD and LCM']
    },
    8: {
      lectures: ['Lecture 8a: Modular Arithmetic', 'Lecture 8b: Congruences'],
      tutorials: ['Tutorial 7b: Divisibility', 'Tutorial 8a: Modular Arithmetic'],
      topics: ['Modular Arithmetic', 'Congruences', 'Applications']
    },
    9: {
      lectures: ['Lecture 9a: Counting Principles', 'Lecture 9b: Permutations'],
      tutorials: ['Tutorial 8b: Congruences', 'Tutorial 9a: Counting'],
      topics: ['Counting Principles', 'Permutations', 'Combinations']
    },
    10: {
      lectures: ['Lecture 10a: Combinations', 'Lecture 10b: Binomial Theorem'],
      tutorials: ['Tutorial 9b: Permutations', 'Tutorial 10a: Combinations'],
      topics: ['Combinations', 'Binomial Theorem', 'Pascal\'s Triangle']
    },
    11: {
      lectures: ['Lecture 11a: Graph Theory Basics', 'Lecture 11b: Graph Properties'],
      tutorials: ['Tutorial 10b: Binomial Theorem', 'Tutorial 11a: Graph Theory'],
      topics: ['Graph Theory', 'Graph Types', 'Graph Properties']
    },
    12: {
      lectures: ['Lecture 12a: Trees and Spanning Trees', 'Lecture 12b: Graph Algorithms'],
      tutorials: ['Tutorial 11b: Graph Properties', 'Tutorial 12a: Trees'],
      topics: ['Trees', 'Spanning Trees', 'Graph Traversal']
    },
    13: {
      lectures: ['Lecture 13a: Course Review', 'Lecture 13b: Exam Preparation'],
      tutorials: ['Tutorial 12b: Graph Algorithms', 'Tutorial 13: Revision'],
      topics: ['Course Review', 'Problem Solving Strategies', 'Exam Preparation']
    }
  };

  return weeklyContentMap[weekNumber] || {
    lectures: [],
    tutorials: [],
    topics: []
  };
}

export function getProgressiveQuestionLevel(masteryScore: number): {
  level: string;
  description: string;
  bloomsLevel: string;
} {
  if (masteryScore < 30) {
    return {
      level: 'Definition & Understanding',
      description: 'Focus on basic concepts and definitions',
      bloomsLevel: 'Remember & Understand'
    };
  } else if (masteryScore < 60) {
    return {
      level: 'Application',
      description: 'Apply concepts to solve problems',
      bloomsLevel: 'Apply'
    };
  } else if (masteryScore < 80) {
    return {
      level: 'Analysis & Evaluation',
      description: 'Analyze relationships and evaluate solutions',
      bloomsLevel: 'Analyze & Evaluate'
    };
  } else {
    return {
      level: 'Synthesis & Creation',
      description: 'Create new solutions and synthesize concepts',
      bloomsLevel: 'Create'
    };
  }
}

export function formatCurrentWeekRange(currentDate: Date = new Date()): string {
  const currentWeek = getCurrentAcademicWeek(currentDate);
  
  if (!currentWeek) {
    return '';
  }
  
  const startDate = currentWeek.start;
  const endDate = currentWeek.end;
  
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const startMonth = startDate.getMonth();
  const endMonth = endDate.getMonth();
  const year = startDate.getFullYear();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];
  
  // Same month case
  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${monthNames[startMonth]} ${year}`;
  }
  
  // Different months case (use abbreviated month names)
  return `${startDay} ${shortMonthNames[startMonth]} - ${endDay} ${shortMonthNames[endMonth]} ${year}`;
}
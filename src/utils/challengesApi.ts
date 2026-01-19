// API client for daily challenges

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface Challenge {
  id: number;
  date: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bloomLevel: string;
  question: string;
  acceptanceRate: number | null;
  status: 'completed' | 'pending';
  score: number | null;
  timeSpent: string | null;
  answer: string | null;
  attempts?: ChallengeAttempt[];
}

export interface ChallengeAttempt {
  attemptNumber: number;
  score: number;
  answer: string;
  timeSpent: string;
  date: string;
  status: string;
}

export interface ChallengeStats {
  totalSolved: number;
  totalAttempted: number;
  attempting: number;
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
  currentStreak: number;
  longestStreak: number;
  monthlyAttempts: number;
}

export interface ChallengeFilters {
  user_id?: number;
  status?: 'completed' | 'pending';
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

// Get user ID from localStorage or default to 1
function getUserId(): number {
  const stored = localStorage.getItem('user_id');
  return stored ? parseInt(stored, 10) : 1;
}

// Set user ID in localStorage
export function setUserId(userId: number): void {
  localStorage.setItem('user_id', userId.toString());
}

// Fetch challenges with optional filters
export async function fetchChallenges(filters: ChallengeFilters = {}): Promise<{
  challenges: Challenge[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  const userId = filters.user_id || getUserId();
  const params = new URLSearchParams({
    user_id: userId.toString(),
    ...(filters.status && { status: filters.status }),
    ...(filters.category && { category: filters.category }),
    ...(filters.difficulty && { difficulty: filters.difficulty }),
    ...(filters.date_from && { date_from: filters.date_from }),
    ...(filters.date_to && { date_to: filters.date_to }),
    page: (filters.page || 1).toString(),
    limit: (filters.limit || 100).toString(),
  });

  const fullUrl = `${API_BASE_URL}/api/challenges?${params}`;

  try {
    const response = await fetch(fullUrl, {mode: 'cors'});
    if (!response.ok) {
      throw new Error(`Failed to fetch challenges: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

// Fetch a single challenge by ID with all attempts
export async function fetchChallenge(challengeId: number): Promise<Challenge> {
  const userId = getUserId();
  const params = new URLSearchParams({
    user_id: userId.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/challenges/${challengeId}?${params}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch challenge: ${response.statusText}`);
  }

  return response.json();
}

// Submit a new attempt for a challenge
export async function submitAttempt(
  challengeId: number,
  attempt: {
    answer: string;
    score: number;
    timeSpent: string;
    status?: 'completed' | 'pending';
  }
): Promise<ChallengeAttempt> {
  const userId = getUserId();
  
  const response = await fetch(`${API_BASE_URL}/api/challenges/${challengeId}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      answer: attempt.answer,
      score: attempt.score,
      time_spent: attempt.timeSpent,
      status: attempt.status || 'completed',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit attempt: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    attemptNumber: data.attempt_number,
    score: data.score,
    answer: data.answer,
    timeSpent: data.time_spent,
    date: new Date().toISOString().split('T')[0],
    status: data.status,
  };
}

// Fetch user statistics
export async function fetchStats(): Promise<ChallengeStats> {
  const userId = getUserId();
  const params = new URLSearchParams({
    user_id: userId.toString(),
  });

  const fullUrl = `${API_BASE_URL}/api/challenges/stats?${params}`;

  try {
    const response = await fetch(fullUrl, {mode: 'cors'});
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    throw err;
  }
}

// Fetch today's challenge
export async function fetchCurrentChallenge(): Promise<Challenge> {
  const userId = getUserId();
  const params = new URLSearchParams({
    user_id: userId.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/challenges/current?${params}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch current challenge: ${response.statusText}`);
  }

  return response.json();
}

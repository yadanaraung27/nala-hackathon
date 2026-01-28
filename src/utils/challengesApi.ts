// API client for daily challenges
import { apiGet, apiPost } from './apiClient';

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

  return await apiGet(fullUrl, {
    timeout: 10000,  // 10 second timeout
    retries: 2       // Retry twice on network failure
  });
}

// Fetch a single challenge by ID with all attempts
export async function fetchChallenge(challengeId: number): Promise<Challenge> {
  const userId = getUserId();
  const params = new URLSearchParams({
    user_id: userId.toString(),
  });

  return await apiGet(`${API_BASE_URL}/api/challenges/${challengeId}?${params}`, {
    timeout: 10000,
    retries: 2
  });
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
  
  const data = await apiPost(`${API_BASE_URL}/api/challenges/${challengeId}/attempts`, {
    user_id: userId,
    answer: attempt.answer,
    score: attempt.score,
    time_spent: attempt.timeSpent,
    status: attempt.status || 'completed',
  }, {
    timeout: 15000,  // 15 seconds for submission
    retries: 1       // Retry once if it fails
  });

  const d = new Date();
  
  return {
    attemptNumber: data.attempt_number,
    score: data.score,
    answer: data.answer,
    timeSpent: data.time_spent,
    date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
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

  return await apiGet(fullUrl, {
    timeout: 10000,
    retries: 2
  });
}

// Fetch today's challenge
export async function fetchCurrentChallenge(): Promise<Challenge> {
  const userId = getUserId();
  const params = new URLSearchParams({
    user_id: userId.toString(),
  });

  return await apiGet(`${API_BASE_URL}/api/challenges/current?${params}`, {
    timeout: 10000,
    retries: 2
  });
}

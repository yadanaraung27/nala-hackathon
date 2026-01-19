-- Database schema for Daily Challenges system

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Challenges table (challenge templates)
CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    bloom_level TEXT,
    question TEXT NOT NULL,
    ground_truth_answer TEXT,
    acceptance_rate REAL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Challenge attempts table (user attempts)
CREATE TABLE IF NOT EXISTS challenge_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_id INTEGER NOT NULL,
    attempt_number INTEGER NOT NULL,
    score REAL,
    answer TEXT,
    time_spent TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(id),
    UNIQUE(user_id, challenge_id, attempt_number)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_challenges_date ON challenges(date);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON challenge_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_challenge_id ON challenge_attempts(challenge_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_challenge ON challenge_attempts(user_id, challenge_id);

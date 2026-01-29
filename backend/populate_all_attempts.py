#!/usr/bin/env python3
"""
Populate challenge attempts for user_id=1 from Jan 12, 2026 to Feb 3, 2026
Creates realistic attempt data with varying scores, answers, and completion status

Usage:
    python populate_all_attempts.py [--mode MODE] [--user USER_ID]
    
Modes:
    all       - Populate both random and specific attempts (default)
    random    - Only populate random attempts for date range
    specific  - Only add specific detailed attempts
    clear     - Clear all attempts for the user and repopulate
"""
import argparse
import random
from datetime import datetime, timedelta
from database import get_db_connection, ensure_database

# =============================================================================
# CONFIGURATION
# =============================================================================

# Default user ID
DEFAULT_USER_ID = 1

# Date range
START_DATE = '2026-01-12'
END_DATE = '2026-02-02'

# Time spent options (in minutes)
TIME_SPENT_OPTIONS = ['5 minutes', '8 minutes', '10 minutes', '12 minutes', '15 minutes', '18 minutes', '20 minutes', '25 minutes', '30 minutes']

# =============================================================================
# SPECIFIC ATTEMPTS DATA
# =============================================================================

SPECIFIC_ATTEMPTS = [
    {
        "date": "2026-01-13",
        "question_pattern": "%i^3%",
        "attempts": [
            {
                "score": 60,
                "time_spent": "10 minutes",
                "answer": "I remembered that i squared is -1 but made a mistake with the powers.",
            },
            {
                "score": 85,
                "time_spent": "6 minutes",
                "answer": "Since i² = -1, multiplying by i gives i³ = -i.",
            },
        ],
    },
    {
        "date": "2026-01-14",
        "question_pattern": "%complex number z%",
        "attempts": [
            {
                "score": 90,
                "time_spent": "5 minutes",
                "answer": "The real part is x and the imaginary part is y.",
            }
        ],
    },
]

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def get_sample_answer(challenge_row, difficulty: str) -> str:
    """
    Generate a realistic student answer based on ground truth.
    """
    gt = challenge_row["ground_truth_answer"]

    if difficulty == "Easy":
        return f"The answer is {gt}."
    elif difficulty == "Medium":
        return f"I worked through the question step by step and obtained {gt}."
    else:  # Hard
        return (
            f"After carefully analysing the problem and applying the relevant concepts, "
            f"I concluded that the correct answer is {gt}."
        )


def generate_realistic_score(difficulty: str, attempt_number: int) -> int:
    """Generate a realistic score based on difficulty and attempt number"""
    if attempt_number == 1:
        # First attempt: lower scores for harder challenges
        if difficulty == 'Easy':
            return random.randint(75, 100)
        elif difficulty == 'Medium':
            return random.randint(60, 90)
        else:  # Hard
            return random.randint(40, 75)
    else:
        # Subsequent attempts: generally better scores
        if difficulty == 'Easy':
            return random.randint(85, 100)
        elif difficulty == 'Medium':
            return random.randint(75, 95)
        else:  # Hard
            return random.randint(65, 90)


def ensure_user_exists(cursor, user_id: int):
    """Ensure user exists in the database"""
    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if not cursor.fetchone():
        cursor.execute("INSERT INTO users (id, username, email) VALUES (?, ?, ?)", 
                     (user_id, f'user_{user_id}', f'user{user_id}@example.com'))
        print(f"  Created user with id={user_id}")


# =============================================================================
# MAIN POPULATION FUNCTIONS
# =============================================================================

def populate_random_attempts(user_id: int, start_date: str = START_DATE, end_date: str = END_DATE, skip_specific: bool = True):
    """
    Populate random challenge attempts for the specified date range.
    
    Args:
        user_id: User ID to create attempts for
        start_date: Start date (YYYY-MM-DD)
        end_date: End date (YYYY-MM-DD)
        skip_specific: If True, skip challenges that have specific attempts defined
    """
    print(f"\n{'='*60}")
    print("Populating random attempts")
    print(f"User ID: {user_id}")
    print(f"Date range: {start_date} to {end_date}")
    print(f"{'='*60}\n")
    
    ensure_database()
    
    # Get dates to skip (challenges with specific attempts)
    skip_dates = set()
    if skip_specific:
        for specific in SPECIFIC_ATTEMPTS:
            skip_dates.add(specific['date'])
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        ensure_user_exists(cursor, user_id)
        
        # Get all challenges in the date range
        cursor.execute("""
            SELECT id, date, category, difficulty, question, ground_truth_answer
            FROM challenges
            WHERE date >= ? AND date <= ?
            ORDER BY date ASC
        """, (start_date, end_date))
        
        challenges = cursor.fetchall()
        
        if not challenges:
            print(f"No challenges found in date range {start_date} to {end_date}")
            return
        
        print(f"Found {len(challenges)} challenges in date range")
        if skip_dates:
            print(f"Skipping dates with specific attempts: {skip_dates}")
        
        # Process each challenge
        total_attempts = 0
        for challenge in challenges:
            challenge_id = challenge['id']
            challenge_date = challenge['date']
            difficulty = challenge['difficulty']
            
            # Skip challenges with specific attempts
            if challenge_date in skip_dates:
                continue
            
            # Check if attempts already exist
            cursor.execute("""
                SELECT COUNT(*) as count FROM challenge_attempts 
                WHERE user_id = ? AND challenge_id = ?
            """, (user_id, challenge_id))
            if cursor.fetchone()['count'] > 0:
                continue  # Skip if attempts already exist
            
            # Parse challenge date
            challenge_dt = datetime.strptime(challenge_date, '%Y-%m-%d')
            
            # Determine number of attempts (most challenges have 1, some have 2-3)
            num_attempts = random.choices(
                [1, 2, 3],
                weights=[70, 25, 5]  # 70% have 1 attempt, 25% have 2, 5% have 3
            )[0]
            
            # Create attempts
            for attempt_num in range(1, num_attempts + 1):
                score = generate_realistic_score(difficulty, attempt_num)
                answer = get_sample_answer(challenge, difficulty)
                
                if attempt_num == 1:
                    time_spent = random.choice(TIME_SPENT_OPTIONS)
                else:
                    time_spent = random.choice(TIME_SPENT_OPTIONS[:6])
                
                status = 'completed'
                
                hours_offset = random.randint(8, 20)
                if attempt_num > 1:
                    days_offset = random.randint(0, 1)
                    hours_offset = random.randint(10, 22)
                else:
                    days_offset = 0
                
                created_at = challenge_dt + timedelta(days=days_offset, hours=hours_offset)
                created_at_str = created_at.strftime('%Y-%m-%d %H:%M:%S')
                
                try:
                    cursor.execute("""
                        INSERT INTO challenge_attempts 
                        (user_id, challenge_id, attempt_number, score, answer, time_spent, status, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (user_id, challenge_id, attempt_num, score, answer, time_spent, status, created_at_str))
                    total_attempts += 1
                except Exception as e:
                    print(f"  Skipping duplicate attempt {attempt_num} for challenge {challenge_id}: {e}")
        
        print(f"\nSuccessfully created {total_attempts} random attempts")


def populate_specific_attempts(user_id: int):
    """
    Add specific detailed attempts for certain challenges.
    These are curated attempts with specific scores and answers to demonstrate
    the retry/improvement feature.
    """
    print(f"\n{'='*60}")
    print("Populating specific attempts")
    print(f"User ID: {user_id}")
    print(f"{'='*60}\n")
    
    ensure_database()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        ensure_user_exists(cursor, user_id)
        
        for specific in SPECIFIC_ATTEMPTS:
            date = specific['date']
            pattern = specific['question_pattern']
            attempts_data = specific['attempts']
            
            # Find the challenge
            cursor.execute("""
                SELECT id, date, difficulty, question 
                FROM challenges 
                WHERE date = ? AND question LIKE ?
            """, (date, pattern))
            challenge = cursor.fetchone()
            
            if not challenge:
                print(f"Warning: Could not find challenge matching '{pattern}' on {date}")
                continue
            
            challenge_id = challenge['id']
            challenge_date = datetime.strptime(challenge['date'], '%Y-%m-%d')
            
            # Clear existing attempts for this challenge
            cursor.execute("""
                DELETE FROM challenge_attempts 
                WHERE user_id = ? AND challenge_id = ?
            """, (user_id, challenge_id))
            print(f"Cleared existing attempts for challenge ID {challenge_id} ({date})")
            
            # Add the specific attempts
            for attempt_num, attempt_data in enumerate(attempts_data, 1):
                score = attempt_data['score']
                time_spent = attempt_data['time_spent']
                answer = attempt_data['answer']
                status = 'completed'
                
                # Timestamp: same day, spaced out
                hours_offset = 10 + (attempt_num * 3)
                created_at = challenge_date + timedelta(hours=hours_offset)
                created_at_str = created_at.strftime('%Y-%m-%d %H:%M:%S')
                
                cursor.execute("""
                    INSERT INTO challenge_attempts 
                    (user_id, challenge_id, attempt_number, score, answer, time_spent, status, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (user_id, challenge_id, attempt_num, score, answer, time_spent, status, created_at_str))
                
                print(f"  Added attempt {attempt_num}: Score={score}, Time={time_spent}")
            
            print(f"  ✓ Added {len(attempts_data)} attempts for '{challenge['question'][:50]}...'")
        
        print(f"\n✓ Successfully added all specific attempts!")


def clear_user_attempts(user_id: int):
    """Clear all attempts for a specific user"""
    print(f"\n{'='*60}")
    print(f"Clearing all attempts for user {user_id}")
    print(f"{'='*60}\n")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM challenge_attempts WHERE user_id = ?", (user_id,))
        deleted = cursor.rowcount
        print(f"Deleted {deleted} attempts")


def show_summary(user_id: int):
    """Show summary statistics for a user"""
    print(f"\n{'='*60}")
    print("Summary Statistics")
    print(f"{'='*60}\n")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                COUNT(*) as total_attempts,
                COUNT(DISTINCT challenge_id) as challenges_attempted,
                AVG(score) as avg_score,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count
            FROM challenge_attempts
            WHERE user_id = ?
        """, (user_id,))
        
        stats = cursor.fetchone()
        if stats and stats['total_attempts'] > 0:
            print(f"  Total attempts: {stats['total_attempts']}")
            print(f"  Challenges attempted: {stats['challenges_attempted']}")
            print(f"  Average score: {stats['avg_score']:.1f}")
            print(f"  Completed: {stats['completed_count']}")
        else:
            print("  No attempts found for this user")
        
        # Show attempts per challenge distribution
        cursor.execute("""
            SELECT attempt_count, COUNT(*) as num_challenges
            FROM (
                SELECT challenge_id, COUNT(*) as attempt_count
                FROM challenge_attempts
                WHERE user_id = ?
                GROUP BY challenge_id
            )
            GROUP BY attempt_count
            ORDER BY attempt_count
        """, (user_id,))
        
        dist = cursor.fetchall()
        if dist:
            print(f"\n  Attempts distribution:")
            for row in dist:
                print(f"    {row['attempt_count']} attempt(s): {row['num_challenges']} challenges")


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description='Populate challenge attempts for the daily challenges database.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Modes:
  all       Populate both random and specific attempts (default)
  random    Only populate random attempts for date range
  specific  Only add specific detailed attempts
  clear     Clear all attempts for the user and repopulate

Examples:
  python populate_all_attempts.py                    # Populate all attempts for default user
  python populate_all_attempts.py --mode specific   # Only add specific attempts
  python populate_all_attempts.py --user 2          # Populate for user ID 2
  python populate_all_attempts.py --mode clear      # Clear and repopulate
        """
    )
    
    parser.add_argument('--mode', '-m', 
                        choices=['all', 'random', 'specific', 'clear'],
                        default='all',
                        help='Population mode (default: all)')
    
    parser.add_argument('--user', '-u',
                        type=int,
                        default=DEFAULT_USER_ID,
                        help=f'User ID to populate attempts for (default: {DEFAULT_USER_ID})')
    
    args = parser.parse_args()
    
    user_id = args.user
    mode = args.mode
    
    print(f"\n{'#'*60}")
    print(f"#  Daily Challenges - Populate Attempts")
    print(f"#  Mode: {mode}")
    print(f"#  User ID: {user_id}")
    print(f"{'#'*60}")
    
    if mode == 'clear':
        clear_user_attempts(user_id)
        populate_specific_attempts(user_id)
        populate_random_attempts(user_id)
    elif mode == 'all':
        populate_specific_attempts(user_id)
        populate_random_attempts(user_id)
    elif mode == 'random':
        populate_random_attempts(user_id, skip_specific=False)
    elif mode == 'specific':
        populate_specific_attempts(user_id)
    
    show_summary(user_id)
    
    print(f"\n{'='*60}")
    print("Done!")
    print(f"{'='*60}\n")


if __name__ == '__main__':
    main()

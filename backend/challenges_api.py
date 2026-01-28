"""
API endpoints for daily challenges
"""
from flask import Blueprint, request, jsonify
from database import get_db_connection, ensure_database, safe_db_operation
from datetime import datetime
from typing import Optional

challenges_bp = Blueprint('challenges', __name__)


def get_user_id_from_request() -> Optional[int]:
    """
    Extract user_id from request.
    Supports query parameter, JSON body, or header.
    For now, uses a default user_id if not provided (temporary solution).
    """
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        data = request.get_json(silent=True) or {}
        user_id = data.get('user_id')
    if not user_id:
        # Default to user_id=1 for now (temporary until auth is implemented)
        user_id = 1
    return int(user_id) if user_id else None


@challenges_bp.route('/api/challenges', methods=['GET'])
def get_challenges():
    """
    Get list of challenges with optional filtering.
    
    Query parameters:
    - user_id: Filter by user (optional, defaults to 1)
    - status: Filter by status (completed, pending)
    - category: Filter by category
    - difficulty: Filter by difficulty (Easy, Medium, Hard)
    - date_from: Start date (YYYY-MM-DD)
    - date_to: End date (YYYY-MM-DD)
    - page: Page number (default: 1)
    - limit: Items per page (default: 100)
    """
    try:
        ensure_database()
        
        user_id = get_user_id_from_request()
        status = request.args.get('status')
        category = request.args.get('category')
        difficulty = request.args.get('difficulty')
        date_from = request.args.get('date_from')
        date_to = request.args.get('date_to')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 100))
        offset = (page - 1) * limit
        
        with safe_db_operation() as conn:
            cursor = conn.cursor()
            
            # Build query - get challenges with latest attempt info
            query = """
                SELECT c.*, 
                       latest_attempt.score,
                       latest_attempt.answer,
                       latest_attempt.time_spent,
                       latest_attempt.status as attempt_status
                FROM challenges c
                LEFT JOIN (
                    SELECT challenge_id, score, answer, time_spent, status
                    FROM challenge_attempts ca1
                    WHERE ca1.user_id = ?
                    AND ca1.id = (
                        SELECT id FROM challenge_attempts 
                        WHERE user_id = ca1.user_id 
                        AND challenge_id = ca1.challenge_id 
                        ORDER BY attempt_number DESC 
                        LIMIT 1
                    )
                ) latest_attempt ON c.id = latest_attempt.challenge_id
                WHERE 1=1
            """
            params = [user_id]
            
            if status:
                query += " AND (ca.status = ? OR (ca.status IS NULL AND ? = 'pending'))"
                params.extend([status, status])
            
            if category:
                query += " AND c.category = ?"
                params.append(category)
            
            if difficulty:
                query += " AND c.difficulty = ?"
                params.append(difficulty)
            
            if date_from:
                query += " AND c.date >= ?"
                params.append(date_from)
            
            if date_to:
                query += " AND c.date <= ?"
                params.append(date_to)
            
            query += " ORDER BY c.date DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            # Get total count
            count_query = "SELECT COUNT(DISTINCT c.id) FROM challenges c"
            count_params = []
            if category:
                count_query += " WHERE c.category = ?"
                count_params.append(category)
            if difficulty:
                count_query += (" WHERE" if not category else " AND") + " c.difficulty = ?"
                count_params.append(difficulty)
            if date_from:
                count_query += (" WHERE" if not (category or difficulty) else " AND") + " c.date >= ?"
                count_params.append(date_from)
            if date_to:
                count_query += (" WHERE" if not (category or difficulty or date_from) else " AND") + " c.date <= ?"
                count_params.append(date_to)
            
            cursor.execute(count_query, count_params)
            total = cursor.fetchone()[0]
            
            # Format response and include all attempts for each challenge
            challenges = []
            challenge_ids = set()
            challenge_map = {}
            
            # First pass: collect all challenges and their latest attempt data
            for row in rows:
                challenge_id = row['id']
                challenge_ids.add(challenge_id)
                
                if challenge_id not in challenge_map:
                    challenge_map[challenge_id] = {
                        'id': row['id'],
                        'date': row['date'],
                        'category': row['category'],
                        'difficulty': row['difficulty'],
                        'bloomLevel': row['bloom_level'],
                        'question': row['question'],
                        'acceptanceRate': row['acceptance_rate'],
                        'status': row['attempt_status'] if row['attempt_status'] else 'pending',
                        'score': row['score'],
                        'timeSpent': row['time_spent'],
                        'answer': row['answer'],
                        'attempts': []
                    }
            
            # Second pass: fetch all attempts for all challenges
            if challenge_ids:
                placeholders = ','.join(['?'] * len(challenge_ids))
                cursor.execute(f"""
                    SELECT challenge_id, attempt_number, score, answer, time_spent, status, created_at
                    FROM challenge_attempts
                    WHERE user_id = ? AND challenge_id IN ({placeholders})
                    ORDER BY challenge_id, attempt_number ASC
                """, [user_id] + list(challenge_ids))
                
                attempt_rows = cursor.fetchall()
                for attempt_row in attempt_rows:
                    challenge_id = attempt_row['challenge_id']
                    if challenge_id in challenge_map:
                        challenge_map[challenge_id]['attempts'].append({
                            'attemptNumber': attempt_row['attempt_number'],
                            'score': attempt_row['score'],
                            'answer': attempt_row['answer'],
                            'timeSpent': attempt_row['time_spent'],
                            'date': attempt_row['created_at'][:10] if attempt_row['created_at'] else None,
                            'status': attempt_row['status']
                        })
            
            # Convert map to list
            challenges = list(challenge_map.values())
            
            return jsonify({
                'challenges': challenges,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': total,
                    'pages': (total + limit - 1) // limit
                }
            })
    except Exception as e:
        raise


@challenges_bp.route('/api/challenges/<int:challenge_id>', methods=['GET'])
def get_challenge(challenge_id: int):
    """
    Get a single challenge with all user attempts.
    
    Query parameters:
    - user_id: User ID (optional, defaults to 1)
    """
    ensure_database()
    
    user_id = get_user_id_from_request()
    
    with safe_db_operation() as conn:
        cursor = conn.cursor()
        
        # Get challenge
        cursor.execute("SELECT * FROM challenges WHERE id = ?", (challenge_id,))
        challenge_row = cursor.fetchone()
        
        if not challenge_row:
            return jsonify({'error': 'Challenge not found'}), 404
        
        # Get all attempts for this user and challenge
        cursor.execute("""
            SELECT * FROM challenge_attempts 
            WHERE user_id = ? AND challenge_id = ?
            ORDER BY attempt_number ASC
        """, (user_id, challenge_id))
        attempt_rows = cursor.fetchall()
        
        # Format challenge
        challenge = {
            'id': challenge_row['id'],
            'date': challenge_row['date'],
            'category': challenge_row['category'],
            'difficulty': challenge_row['difficulty'],
            'bloomLevel': challenge_row['bloom_level'],
            'question': challenge_row['question'],
            'groundTruthAnswer': challenge_row['ground_truth_answer'],
            'acceptanceRate': challenge_row['acceptance_rate']
        }
        
        # Format attempts
        attempts = []
        for attempt_row in attempt_rows:
            attempts.append({
                'attemptNumber': attempt_row['attempt_number'],
                'score': attempt_row['score'],
                'answer': attempt_row['answer'],
                'timeSpent': attempt_row['time_spent'],
                'date': attempt_row['created_at'][:10] if attempt_row['created_at'] else None,
                'status': attempt_row['status']
            })
        
        # Determine overall status and latest score
        if attempts:
            latest_attempt = attempts[-1]
            challenge['status'] = latest_attempt['status']
            challenge['score'] = latest_attempt['score']
            challenge['timeSpent'] = latest_attempt['timeSpent']
            challenge['answer'] = latest_attempt['answer']
        else:
            challenge['status'] = 'pending'
            challenge['score'] = None
            challenge['timeSpent'] = None
            challenge['answer'] = None
        
        challenge['attempts'] = attempts
        
        return jsonify(challenge)


@challenges_bp.route('/api/challenges/<int:challenge_id>/attempts', methods=['POST'])
def submit_attempt(challenge_id: int):
    """
    Submit a new attempt for a challenge.
    
    Body:
    - user_id: User ID (optional, defaults to 1)
    - answer: User's answer text
    - score: Score (0-100)
    - time_spent: Time spent (e.g., "5 minutes")
    - status: Status (default: "completed")
    """
    ensure_database()
    
    data = request.get_json() or {}
    user_id = data.get('user_id') or get_user_id_from_request()
    answer = data.get('answer', '')
    score = data.get('score')
    time_spent = data.get('time_spent', '')
    status = data.get('status', 'completed')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    with safe_db_operation() as conn:
        cursor = conn.cursor()
        
        # Verify challenge exists
        cursor.execute("SELECT id FROM challenges WHERE id = ?", (challenge_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Challenge not found'}), 404
        
        # Get next attempt number
        cursor.execute("""
            SELECT MAX(attempt_number) FROM challenge_attempts 
            WHERE user_id = ? AND challenge_id = ?
        """, (user_id, challenge_id))
        result = cursor.fetchone()
        next_attempt_number = (result[0] or 0) + 1
        
        # Insert attempt
        cursor.execute("""
            INSERT INTO challenge_attempts 
            (user_id, challenge_id, attempt_number, score, answer, time_spent, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, challenge_id, next_attempt_number, score, answer, time_spent, status))
        
        attempt_id = cursor.lastrowid
        
        return jsonify({
            'id': attempt_id,
            'attempt_number': next_attempt_number,
            'challenge_id': challenge_id,
            'user_id': user_id,
            'score': score,
            'answer': answer,
            'time_spent': time_spent,
            'status': status
        }), 201


@challenges_bp.route('/api/challenges/stats', methods=['GET'])
def get_stats():
    """
    Get user statistics for challenges.
    
    Query parameters:
    - user_id: User ID (optional, defaults to 1)
    """
    try:
        ensure_database()
        
        user_id = get_user_id_from_request()
        
        with safe_db_operation() as conn:
            cursor = conn.cursor()
            
            # Get total solved and attempted
            cursor.execute("""
                SELECT 
                    COUNT(DISTINCT challenge_id) as total_attempted,
                    COUNT(DISTINCT CASE WHEN status = 'completed' THEN challenge_id END) as total_solved,
                    COUNT(DISTINCT CASE WHEN status = 'pending' THEN challenge_id END) as attempting
                FROM challenge_attempts
                WHERE user_id = ?
            """, (user_id,))
            row = cursor.fetchone()
            total_attempted = row['total_attempted'] or 0
            total_solved = row['total_solved'] or 0
            attempting = row['attempting'] or 0
            
            # Get difficulty breakdown
            cursor.execute("""
                SELECT 
                    c.difficulty,
                    COUNT(DISTINCT CASE WHEN ca.status = 'completed' THEN c.id END) as solved,
                    COUNT(DISTINCT c.id) as total
                FROM challenges c
                LEFT JOIN challenge_attempts ca ON c.id = ca.challenge_id AND ca.user_id = ?
                GROUP BY c.difficulty
            """, (user_id,))
            
            difficulty_stats = {}
            for row in cursor.fetchall():
                difficulty_stats[row['difficulty'].lower()] = {
                    'solved': row['solved'] or 0,
                    'total': row['total'] or 0
                }
            
            # Get streak - only count first attempts done on challenge date (same day)
            # A streak means completing challenges on consecutive days
            cursor.execute("""
                SELECT c.date as challenge_date, MIN(DATE(ca.created_at)) as completed_date
                FROM challenge_attempts ca
                JOIN challenges c ON ca.challenge_id = c.id
                WHERE ca.user_id = ? 
                  AND ca.attempt_number = 1
                  AND ca.status = 'completed'
                GROUP BY c.id, c.date
                HAVING DATE(ca.created_at) = c.date
                ORDER BY c.date DESC
            """, (user_id,))
            
            streak_data = cursor.fetchall()
            
            if not streak_data:
                current_streak = 0
                longest_streak = 0
            else:
                from datetime import datetime, timedelta
                
                # Calculate current streak (from most recent date backwards)
                current_streak = 0
                today = datetime.now().date()
                
                # Check if most recent completion was today or yesterday
                most_recent_date = datetime.strptime(streak_data[0]['challenge_date'], '%Y-%m-%d').date()
                
                if most_recent_date == today or most_recent_date == today - timedelta(days=1):
                    current_streak = 1
                    expected_date = most_recent_date - timedelta(days=1)
                    
                    for i in range(1, len(streak_data)):
                        challenge_date = datetime.strptime(streak_data[i]['challenge_date'], '%Y-%m-%d').date()
                        
                        if challenge_date == expected_date:
                            current_streak += 1
                            expected_date -= timedelta(days=1)
                        else:
                            break
                
                # Calculate longest streak
                longest_streak = 0
                temp_streak = 1
                
                for i in range(len(streak_data) - 1):
                    current_date = datetime.strptime(streak_data[i]['challenge_date'], '%Y-%m-%d').date()
                    next_date = datetime.strptime(streak_data[i + 1]['challenge_date'], '%Y-%m-%d').date()
                    
                    if (current_date - next_date).days == 1:
                        temp_streak += 1
                    else:
                        longest_streak = max(longest_streak, temp_streak)
                        temp_streak = 1
                
                longest_streak = max(longest_streak, temp_streak, current_streak)
            
            # Monthly attempts (current month)
            from datetime import datetime
            current_month = datetime.now().strftime('%Y-%m')
            cursor.execute("""
                SELECT COUNT(DISTINCT challenge_id) as monthly_attempts
                FROM challenge_attempts
                WHERE user_id = ? AND DATE(created_at) >= ?
            """, (user_id, f"{current_month}-01"))
            monthly_attempts = cursor.fetchone()['monthly_attempts'] or 0
            
            return jsonify({
                'totalSolved': total_solved,
                'totalAttempted': total_attempted,
                'attempting': attempting,
                'easy': difficulty_stats.get('easy', {'solved': 0, 'total': 0}),
                'medium': difficulty_stats.get('medium', {'solved': 0, 'total': 0}),
                'hard': difficulty_stats.get('hard', {'solved': 0, 'total': 0}),
                'currentStreak': current_streak,
                'longestStreak': longest_streak,
                'monthlyAttempts': monthly_attempts
            })
    except Exception as e:
        raise


@challenges_bp.route('/api/challenges/current', methods=['GET'])
def get_current_challenge():
    """
    Get today's challenge for the user.
    
    Query parameters:
    - user_id: User ID (optional, defaults to 1)
    """
    ensure_database()
    
    user_id = get_user_id_from_request()
    today = datetime.now().strftime('%Y-%m-%d')
    
    with safe_db_operation() as conn:
        cursor = conn.cursor()
        
        # Get today's challenge
        cursor.execute("""
            SELECT c.*, 
                   ca.id as attempt_id,
                   ca.attempt_number,
                   ca.score,
                   ca.answer,
                   ca.time_spent,
                   ca.status as attempt_status
            FROM challenges c
            LEFT JOIN challenge_attempts ca ON c.id = ca.challenge_id 
                AND ca.user_id = ? 
                AND ca.id = (
                    SELECT id FROM challenge_attempts 
                    WHERE user_id = ? 
                    AND challenge_id = c.id 
                    ORDER BY attempt_number DESC 
                    LIMIT 1
                )
            WHERE c.date = ?
            LIMIT 1
        """, (user_id, user_id, today))
        
        row = cursor.fetchone()
        
        if not row:
            return jsonify({'error': 'No challenge found for today'}), 404
        
        challenge = {
            'id': row['id'],
            'date': row['date'],
            'category': row['category'],
            'difficulty': row['difficulty'],
            'bloomLevel': row['bloom_level'],
            'question': row['question'],
            'groundTruthAnswer': row['ground_truth_answer'],
            'acceptanceRate': row['acceptance_rate'],
            'status': row['attempt_status'] if row['attempt_status'] else 'pending',
            'score': row['score'],
            'timeSpent': row['time_spent'],
            'answer': row['answer']
        }
        
        return jsonify(challenge)


@challenges_bp.route('/api/user/<int:user_id>', methods=['GET'])
def get_user_profile(user_id: int):
    """
    Get user profile information.
    
    Path parameters:
    - user_id: User ID
    """
    ensure_database()
    
    with safe_db_operation() as conn:
        cursor = conn.cursor()
        
        # Get user profile
        cursor.execute("""
            SELECT id, username, email, created_at
            FROM users
            WHERE id = ?
        """, (user_id,))
        
        row = cursor.fetchone()
        
        if not row:
            return jsonify({'error': 'User not found'}), 404
        
        user = {
            'id': row['id'],
            'username': row['username'],
            'email': row['email'],
            'createdAt': row['created_at']
        }
        
        return jsonify(user)

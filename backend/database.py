"""
Database connection and utility functions for SQLite with error handling
"""
import sqlite3
import os
from contextlib import contextmanager
from typing import Optional, Dict, Any, List, Tuple
import traceback

# Database file path
DB_PATH = os.path.join(os.path.dirname(__file__), 'challenges.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')


class DatabaseError(Exception):
    """Custom exception for database errors"""
    pass


def get_db_path() -> str:
    """Get the database file path"""
    return DB_PATH


@contextmanager
def get_db_connection():
    """
    Context manager for database connections.
    Ensures proper connection handling and rollback on errors.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


@contextmanager
def safe_db_operation(operation_name: str = "database operation"):
    """
    Context manager for safe database operations with automatic error handling.
    
    Usage:
        with safe_db_operation("fetch user data") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            result = cursor.fetchone()
    
    Args:
        operation_name: Description of the operation for error messages
    
    Raises:
        DatabaseError: If any database error occurs
    """
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row  # Enable column access by name
        yield conn
        conn.commit()
    except sqlite3.IntegrityError as e:
        if conn:
            conn.rollback()
        error_msg = f"Data integrity error during {operation_name}: {str(e)}"
        print(f"[DB ERROR] {error_msg}")
        traceback.print_exc()
        raise DatabaseError(error_msg) from e
    except sqlite3.OperationalError as e:
        if conn:
            conn.rollback()
        error_msg = f"Database operation failed during {operation_name}: {str(e)}"
        print(f"[DB ERROR] {error_msg}")
        traceback.print_exc()
        raise DatabaseError(error_msg) from e
    except Exception as e:
        if conn:
            conn.rollback()
        error_msg = f"Unexpected error during {operation_name}: {str(e)}"
        print(f"[DB ERROR] {error_msg}")
        traceback.print_exc()
        raise DatabaseError(error_msg) from e
    finally:
        if conn:
            conn.close()


def init_database():
    """
    Initialize the database by creating tables from schema.sql
    """
    if not os.path.exists(SCHEMA_PATH):
        raise FileNotFoundError(f"Schema file not found: {SCHEMA_PATH}")
    
    with open(SCHEMA_PATH, 'r') as f:
        schema_sql = f.read()
    
    with get_db_connection() as conn:
        conn.executescript(schema_sql)
    
    print(f"Database initialized at {DB_PATH}")


def ensure_database():
    """
    Ensure database exists and is initialized.
    Creates database file and tables if they don't exist.
    """
    if not os.path.exists(DB_PATH):
        init_database()
    else:
        # Check if tables exist
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name='challenges'
            """)
            if not cursor.fetchone():
                init_database()


def dict_factory(cursor, row):
    """
    Convert SQLite row to dictionary
    """
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}


def row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    """
    Convert a sqlite3.Row to a dictionary
    """
    return dict(row)


# ============================================================================
# SAFE DATABASE HELPER FUNCTIONS
# ============================================================================

def get_user_by_id(user_id: int) -> Optional[dict]:
    """
    Get user by ID with error handling.
    
    Args:
        user_id: The user ID to fetch
    
    Returns:
        User dict or None if not found
    
    Raises:
        DatabaseError: If database error occurs
    """
    try:
        with safe_db_operation(f"get user {user_id}") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            if row:
                return dict(row)
            return None
    except DatabaseError:
        # Re-raise database errors
        raise
    except Exception as e:
        raise DatabaseError(f"Failed to get user {user_id}: {str(e)}") from e


def get_challenge_by_id(challenge_id: int) -> Optional[dict]:
    """
    Get challenge by ID with error handling.
    
    Args:
        challenge_id: The challenge ID to fetch
    
    Returns:
        Challenge dict or None if not found
    
    Raises:
        DatabaseError: If database error occurs
    """
    try:
        with safe_db_operation(f"get challenge {challenge_id}") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM challenges WHERE id = ?", (challenge_id,))
            row = cursor.fetchone()
            if row:
                return dict(row)
            return None
    except DatabaseError:
        raise
    except Exception as e:
        raise DatabaseError(f"Failed to get challenge {challenge_id}: {str(e)}") from e


def create_challenge_attempt(user_id: int, challenge_id: int, 
                            answer: str, score: float, 
                            status: str = 'completed',
                            time_spent: Optional[int] = None) -> int:
    """
    Create a challenge attempt with error handling.
    
    Args:
        user_id: The user ID
        challenge_id: The challenge ID
        answer: The user's answer
        score: The score achieved
        status: Status of the attempt (default: 'completed')
        time_spent: Time spent in seconds (optional)
    
    Returns:
        The ID of the created attempt
    
    Raises:
        DatabaseError: If database error occurs
    """
    try:
        with safe_db_operation("create challenge attempt") as conn:
            cursor = conn.cursor()
            
            # Get the next attempt number for this user+challenge
            cursor.execute("""
                SELECT COALESCE(MAX(attempt_number), 0) + 1 
                FROM challenge_attempts 
                WHERE user_id = ? AND challenge_id = ?
            """, (user_id, challenge_id))
            attempt_number = cursor.fetchone()[0]
            
            # Insert the attempt
            cursor.execute("""
                INSERT INTO challenge_attempts 
                (user_id, challenge_id, answer, score, status, attempt_number, time_spent)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (user_id, challenge_id, answer, score, status, attempt_number, time_spent))
            
            return cursor.lastrowid
    except DatabaseError:
        raise
    except Exception as e:
        raise DatabaseError(f"Failed to create challenge attempt: {str(e)}") from e


def execute_query(query: str, params: Tuple = ()) -> list:
    """
    Execute a SELECT query and return results.
    
    Args:
        query: SQL query string
        params: Query parameters tuple
    
    Returns:
        List of result rows as dicts
    
    Raises:
        DatabaseError: If database error occurs
    """
    try:
        with safe_db_operation("execute query") as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
    except DatabaseError:
        raise
    except Exception as e:
        raise DatabaseError(f"Failed to execute query: {str(e)}") from e


if __name__ == '__main__':
    # Initialize database when run directly
    ensure_database()
    print("Database setup complete!")

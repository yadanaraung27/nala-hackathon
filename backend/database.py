"""
Database connection and utility functions for SQLite
"""
import sqlite3
import os
from contextlib import contextmanager
from typing import Optional, Dict, Any, List

# Database file path
DB_PATH = os.path.join(os.path.dirname(__file__), 'challenges.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')


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


if __name__ == '__main__':
    # Initialize database when run directly
    ensure_database()
    print("Database setup complete!")

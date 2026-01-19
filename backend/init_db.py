"""
Initialize the database for daily challenges
"""
from database import ensure_database, get_db_path

if __name__ == '__main__':
    print(f"Initializing database at {get_db_path()}...")
    ensure_database()
    print("Database initialization complete!")

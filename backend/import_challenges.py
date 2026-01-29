"""
Import challenges from CSV file into SQLite database
"""
import csv
import os
import sys
from database import get_db_connection, ensure_database


def import_challenges_from_csv(csv_path: str, skip_duplicates: bool = True):
    """
    Import challenges from CSV file into the database.
    
    Args:
        csv_path: Path to the CSV file
        skip_duplicates: If True, skip challenges that already exist (by date + question)
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV file not found: {csv_path}")
    
    # Ensure database is initialized
    ensure_database()
    
    imported_count = 0
    skipped_count = 0
    error_count = 0
    
    with open(csv_path, 'r', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            for row in reader:
                try:
                    date = row.get('date', '').strip()
                    category = row.get('category', '').strip()
                    difficulty = row.get('difficulty', '').strip()
                    bloom_level = row.get('bloom_level', '').strip()
                    question = row.get('question', '').strip()
                    ground_truth_answer = row.get('ground_truth_answer', '').strip()
                    acceptance_rate = row.get('acceptance_rate', '').strip()
                    
                    # Validate required fields
                    if not date or not category or not difficulty or not question:
                        print(f"Warning: Skipping row with missing required fields: {row}")
                        error_count += 1
                        continue
                    
                    # Convert acceptance_rate to float or None
                    try:
                        acceptance_rate = float(acceptance_rate) if acceptance_rate else None
                    except ValueError:
                        acceptance_rate = None
                    
                    # Check for duplicates if skip_duplicates is True
                    if skip_duplicates:
                        cursor.execute("""
                            SELECT id FROM challenges 
                            WHERE date = ? AND question = ?
                        """, (date, question))
                        if cursor.fetchone():
                            skipped_count += 1
                            continue
                    
                    # Insert challenge
                    cursor.execute("""
                        INSERT INTO challenges (date, category, difficulty, bloom_level, question, ground_truth_answer, acceptance_rate)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (date, category, difficulty, bloom_level, question, ground_truth_answer, acceptance_rate))
                    
                    imported_count += 1
                    
                except Exception as e:
                    print(f"Error importing row {row}: {e}")
                    error_count += 1
                    continue
    
    print(f"\nImport complete!")
    print(f"  Imported: {imported_count}")
    print(f"  Skipped (duplicates): {skipped_count}")
    print(f"  Errors: {error_count}")


if __name__ == '__main__':
    # Default CSV path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_csv_path = os.path.join(script_dir, 'data', 'challenges.csv')
    
    # Allow CSV path as command line argument
    csv_path = sys.argv[1] if len(sys.argv) > 1 else default_csv_path
    
    print(f"Importing challenges from {csv_path}...")
    import_challenges_from_csv(csv_path)
    print("Done!")

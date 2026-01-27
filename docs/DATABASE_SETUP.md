# Daily Challenges Database Setup Guide

This document describes the SQLite database design and implementation for the Daily Challenges feature and provides step-by-step instructions for setting up and populating the database.

---

## Table of Contents

1. [Database Overview](#database-overview)
2. [File Structure](#file-structure)
2. [Schema Structure](#schema-structure)
3. [Setup Workflow](#setup-workflow)
4. [Scripts Reference](#scripts-reference)
5. [Common Operations](#common-operations)
6. [Troubleshooting](#troubleshooting)

---

## Database Overview

The Daily Challenges database (`challenges.db`) stores:
- **User information** for tracking progress
- **Challenge questions** imported from a CSV file
- **User attempts** for each challenge, including scores and answers

---
## File Structure

```
backend/
├── challenges.db              # SQLite database file (generated)
├── schema.sql                 # Database schema definition
├── database.py                # Database connection utilities
├── init_db.py                 # Database initialization script
├── import_challenges.py       # CSV import script
├── populate_all_attempts.py   # Attempts population script
├── view_database.ipynb        # Database viewer notebook
├── challenges_api.py          # REST API for challenges
├── data/
│   └── challenges.csv         # Challenge questions source file
```

---

## Schema Structure

Refer to [DATABASE_MODELS.md](./DATABASE_MODELS.md) for more information.

---

## Setup Workflow

### First-Time Setup

Follow these steps in order when setting up the database for the first time:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIRST-TIME SETUP WORKFLOW                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  Step 1: Initialize Database  │
              │  python init_db.py            │
              │  Creates: challenges.db       │
              │  Creates: All tables          │
              └───────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  Step 2: Import Challenges    │
              │  python import_challenges.py  │
              │  Source: data/challenges.csv  │
              │  Populates: challenges table  │
              └───────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  Step 3: Populate Attempts    │
              │  python populate_all_attempts │
              │  Creates: User attempts       │
              │  Populates: challenge_attempts│
              └───────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  Step 4: Verify (Optional)    │
              │  Open view_database.ipynb     │
              │  Check: All tables populated  │
              └───────────────────────────────┘
```

### Step-by-Step Commands

```bash
# Navigate to the backend directory
cd backend

# Step 1: Initialize the database (creates tables)
python init_db.py

# Step 2: Import challenges from CSV
python import_challenges.py

# Step 3: Populate sample user attempts
python populate_all_attempts.py

# Optional: Verify setup using the notebook
jupyter notebook view_database.ipynb
```

---

## Scripts Reference

### `database.py`
**Purpose:** Core database utilities and connection management.

**Functions:**
- `get_db_connection()` - Context manager for database connections
- `init_database()` - Creates tables from schema.sql
- `ensure_database()` - Ensures database exists and is initialized
- `get_db_path()` - Returns the database file path

**Usage:** Import in other scripts
```python
from database import get_db_connection, ensure_database
```

---

### `init_db.py`
**Purpose:** Initialize the database by creating all tables.

**What it does:**
1. Creates `challenges.db` if it doesn't exist
2. Executes `schema.sql` to create all tables
3. Creates indexes for performance

**Usage:**
```bash
python init_db.py
```

---

### `import_challenges.py`
**Purpose:** Import challenge questions from a CSV file.

**What it does:**
1. Reads from `data/challenges.csv`
2. Validates required fields (date, category, difficulty, question)
3. Inserts challenges into the `challenges` table
4. Skips duplicates by default (based on date + question)

**CSV Format:**
```csv
date,category,difficulty,bloom_level,question,acceptance_rate,ground_truth_answer
2026-01-12,Functions,Medium,Understand,"Question text...",73,"Answer text..."
```

**Usage:**
```bash
# Default CSV path (data/challenges.csv)
python import_challenges.py

# Custom CSV path
python import_challenges.py /path/to/custom.csv
```

---

### `populate_all_attempts.py`
**Purpose:** Combined script to populate user challenge attempts.

**What it does:**
1. Creates a default user if not exists
2. Populates random attempts for challenges in the date range
3. Adds specific detailed attempts for demonstration challenges
4. Shows summary statistics

**Modes:**
| Mode     | Description                                      |
|----------|--------------------------------------------------|
| `all`    | Populate both random and specific attempts       |
| `random` | Only populate random attempts                    |
| `specific` | Only add specific detailed attempts            |
| `clear`  | Clear all attempts and repopulate                |

**Usage:**
```bash
# Default: populate all attempts for user 1
python populate_all_attempts.py

# Specific mode
python populate_all_attempts.py --mode specific

# Different user
python populate_all_attempts.py --user 2

# Clear and repopulate
python populate_all_attempts.py --mode clear
```

---

### `view_database.ipynb`
**Purpose:** Jupyter notebook for viewing and analyzing the database.

**Features:**
1. List all tables and their schemas
2. View row counts for each table
3. Preview table data
4. Generate ERD diagram
5. Statistics and analytics
6. Custom query execution
7. Visualizations (charts)

**Usage:**
```bash
jupyter notebook view_database.ipynb
```

---

## Common Operations

### Adding New Challenges

1. **Add to CSV file:**
    ```csv
    # Edit data/challenges.csv
    2026-02-04,Calculus,Medium,Apply,"New question text...",75,"Model answer..."
    ```

2. **Re-import challenges:**
   ```bash
   python import_challenges.py
   ```
   Note: Existing challenges are skipped (no duplicates created).

### Adding a New User

```python
from database import get_db_connection

with get_db_connection() as conn:
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO users (username, email) 
        VALUES (?, ?)
    """, ('new_user', 'new_user@example.com'))
```

### Clearing All Data

```bash
# Option 1: Delete the database file
rm backend/challenges.db

# Option 2: Clear specific tables
python -c "
from database import get_db_connection
with get_db_connection() as conn:
    conn.execute('DELETE FROM challenge_attempts')
    conn.execute('DELETE FROM challenges')
    conn.execute('DELETE FROM users')
"
```

### Resetting User Attempts

```bash
# Clear and repopulate attempts for a user
python populate_all_attempts.py --mode clear --user 1
```

---

## Troubleshooting

### Database file not found

- Error: `Database file not found: challenges.db`

- Solution:
    ```bash
    python init_db.py
    ```

### CSV import fails

- Error: `CSV file not found: data/challenges.csv`

- Solution: Ensure the CSV file exists at `backend/data/challenges.csv`

### Foreign key constraint failed

- Error: `FOREIGN KEY constraint failed`

- Solution: Ensure the referenced user/challenge exists before inserting attempts.

### Duplicate entry error

- Error: `UNIQUE constraint failed`

- Solution: The attempt already exists. Use `--mode clear` to reset.

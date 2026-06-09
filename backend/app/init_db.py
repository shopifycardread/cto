import subprocess
import json

def run_query(query: str):
    print(f"Running query: {query}")
    result = subprocess.run(["team-db", query], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        raise Exception(f"Query failed: {result.stderr}")
    return json.loads(result.stdout)

def init_db():
    queries = [
        """
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            full_name TEXT,
            subscription_tier TEXT DEFAULT 'free',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS wardrobe_items (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            photo_url TEXT NOT NULL,
            category TEXT,
            color TEXT,
            style_tags TEXT, -- JSON string
            season TEXT,
            occasion TEXT,
            brand TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS style_profiles (
            user_id TEXT PRIMARY KEY,
            body_type TEXT,
            style_tags TEXT, -- JSON string
            size_preferences TEXT, -- JSON string
            lifestyle_tags TEXT, -- JSON string
            weather_location TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS outfits (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            items TEXT NOT NULL, -- JSON string of wardrobe_item IDs
            status TEXT DEFAULT 'pending', -- 'saved', 'skipped', 'pending'
            date TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS recommendations (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            category TEXT NOT NULL,
            gap_reason TEXT,
            item_url TEXT,
            affiliate_link TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """
    ]
    
    for query in queries:
        run_query(query)

if __name__ == "__main__":
    init_db()

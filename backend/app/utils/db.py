import subprocess
import json
from typing import List, Dict, Any, Optional

def run_query(query: str) -> List[Dict[str, Any]]:
    result = subprocess.run(["team-db", query], capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"Query failed: {result.stderr}")
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return []

def execute_query(query: str):
    result = subprocess.run(["team-db", query], capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"Query failed: {result.stderr}")
    return result.stdout

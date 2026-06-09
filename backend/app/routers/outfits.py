from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import get_current_user
from app.utils.db import run_query, execute_query
from app.schemas import Outfit, OutfitBase
import uuid
import json
from datetime import datetime, date
import random
from typing import List

router = APIRouter()

@router.get("/daily", response_model=List[Outfit])
async def get_daily_outfits(current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    today = date.today().isoformat()
    
    # Check if outfits already exist for today
    existing_outfits = run_query(f"SELECT * FROM outfits WHERE user_id = '{user_id}' AND date = '{today}'")
    
    if len(existing_outfits) >= 3:
        for o in existing_outfits:
            o['items'] = json.loads(o['items'])
        return existing_outfits[:3]
    
    # If not enough, generate more using rule-based matching
    wardrobe = run_query(f"SELECT id, category, season, occasion FROM wardrobe_items WHERE user_id = '{user_id}'")
    if not wardrobe:
        return []
    
    # Simple rule-based categorization
    tops = [i['id'] for i in wardrobe if (i['category'] or "").lower() in ['top', 'shirt', 'blouse', 't-shirt', 'jacket']]
    bottoms = [i['id'] for i in wardrobe if (i['category'] or "").lower() in ['bottom', 'pants', 'jeans', 'skirt']]
    shoes = [i['id'] for i in wardrobe if (i['category'] or "").lower() in ['shoes', 'sneakers', 'boots', 'sandals']]
    
    new_outfits = []
    num_to_generate = 3 - len(existing_outfits)
    
    for _ in range(num_to_generate):
        selected_items = []
        
        # Try to pick one from each core category if available
        if tops:
            selected_items.append(random.choice(tops))
        if bottoms:
            selected_items.append(random.choice(bottoms))
        if shoes:
            selected_items.append(random.choice(shoes))
            
        # Fallback if categories are missing
        if not selected_items and wardrobe:
            selected_items = [random.choice(wardrobe)['id']]
            
        if not selected_items:
            continue
            
        outfit_id = str(uuid.uuid4())
        items_json = json.dumps(selected_items)
        
        execute_query(f"""
            INSERT INTO outfits (id, user_id, items, status, date)
            VALUES ('{outfit_id}', '{user_id}', '{items_json}', 'pending', '{today}')
        """)
        
        o = run_query(f"SELECT * FROM outfits WHERE id = '{outfit_id}'")[0]
        o['items'] = selected_items
        new_outfits.append(o)
        
    # Combine and return
    for o in existing_outfits:
        o['items'] = json.loads(o['items'])
        
    return (existing_outfits + new_outfits)[:3]

@router.get("/saved", response_model=List[Outfit])
async def get_saved_outfits(current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    outfits = run_query(f"SELECT * FROM outfits WHERE user_id = '{user_id}' AND status = 'saved'")
    
    for o in outfits:
        o['items'] = json.loads(o['items'])
        
    return outfits

@router.post("/{outfit_id}/save")
async def save_outfit(outfit_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    
    # Check if outfit exists
    existing = run_query(f"SELECT id FROM outfits WHERE id = '{outfit_id}' AND user_id = '{user_id}'")
    if not existing:
        raise HTTPException(status_code=404, detail="Outfit not found")
        
    execute_query(f"UPDATE outfits SET status = 'saved' WHERE id = '{outfit_id}'")
    return {"message": "Outfit saved"}

@router.post("/{outfit_id}/skip")
async def skip_outfit(outfit_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    
    # Check if outfit exists
    existing = run_query(f"SELECT id FROM outfits WHERE id = '{outfit_id}' AND user_id = '{user_id}'")
    if not existing:
        raise HTTPException(status_code=404, detail="Outfit not found")
        
    execute_query(f"UPDATE outfits SET status = 'skipped' WHERE id = '{outfit_id}'")
    return {"message": "Outfit skipped"}

from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import get_current_user
from app.utils.db import run_query, execute_query
from app.schemas import StyleProfile, StyleProfileUpdate
import json
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=StyleProfile)
async def get_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    profile = run_query(f"SELECT * FROM style_profiles WHERE user_id = '{user_id}'")
    
    if not profile:
        # Return a default profile if it doesn't exist
        return StyleProfile(
            user_id=user_id,
            body_type=None,
            style_tags=[],
            size_preferences={},
            lifestyle_tags=[],
            weather_location=None,
            updated_at=datetime.utcnow()
        )
    
    res = profile[0]
    res['style_tags'] = json.loads(res['style_tags'] or "[]")
    res['size_preferences'] = json.loads(res['size_preferences'] or "{}")
    res['lifestyle_tags'] = json.loads(res['lifestyle_tags'] or "[]")
    return res

@router.put("/", response_model=StyleProfile)
async def update_profile(profile_data: StyleProfileUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    
    style_tags_json = json.dumps(profile_data.style_tags)
    size_prefs_json = json.dumps(profile_data.size_preferences)
    lifestyle_tags_json = json.dumps(profile_data.lifestyle_tags)
    
    # Check if profile exists
    existing = run_query(f"SELECT user_id FROM style_profiles WHERE user_id = '{user_id}'")
    
    if existing:
        execute_query(f"""
            UPDATE style_profiles 
            SET body_type = '{profile_data.body_type or ""}', 
                style_tags = '{style_tags_json}', 
                size_preferences = '{size_prefs_json}', 
                lifestyle_tags = '{lifestyle_tags_json}', 
                weather_location = '{profile_data.weather_location or ""}',
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = '{user_id}'
        """)
    else:
        execute_query(f"""
            INSERT INTO style_profiles (user_id, body_type, style_tags, size_preferences, lifestyle_tags, weather_location)
            VALUES ('{user_id}', '{profile_data.body_type or ""}', '{style_tags_json}', 
                    '{size_prefs_json}', '{lifestyle_tags_json}', '{profile_data.weather_location or ""}')
        """)
    
    updated_profile = run_query(f"SELECT * FROM style_profiles WHERE user_id = '{user_id}'")
    res = updated_profile[0]
    res['style_tags'] = json.loads(res['style_tags'] or "[]")
    res['size_preferences'] = json.loads(res['size_preferences'] or "{}")
    res['lifestyle_tags'] = json.loads(res['lifestyle_tags'] or "[]")
    return res

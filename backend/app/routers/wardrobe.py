from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from app.utils.auth import get_current_user
from app.utils.db import run_query, execute_query
from app.schemas import WardrobeItem, WardrobeItemCreate
import uuid
import json
from typing import List, Optional

router = APIRouter()

@router.post("/", response_model=WardrobeItem)
async def create_wardrobe_item(item: WardrobeItemCreate, current_user: dict = Depends(get_current_user)):
    item_id = str(uuid.uuid4())
    user_id = current_user['id']
    
    style_tags_json = json.dumps(item.style_tags)
    
    execute_query(f"""
        INSERT INTO wardrobe_items (id, user_id, photo_url, category, color, style_tags, season, occasion, brand)
        VALUES ('{item_id}', '{user_id}', '{item.photo_url}', '{item.category or ""}', '{item.color or ""}', 
                '{style_tags_json}', '{item.season or ""}', '{item.occasion or ""}', '{item.brand or ""}')
    """)
    
    new_item = run_query(f"SELECT * FROM wardrobe_items WHERE id = '{item_id}'")
    if not new_item:
        raise HTTPException(status_code=500, detail="Failed to create wardrobe item")
    
    # Parse JSON style_tags back to list
    res = new_item[0]
    res['style_tags'] = json.loads(res['style_tags'])
    return res

@router.post("/scan", response_model=WardrobeItem)
async def scan_wardrobe_item(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    # Mock image processing/upload
    # In a real app, we would upload to S3/Cloudinary and get a persistent URL
    # For now, we just return a dummy URL
    photo_url = f"https://clad-assets.s3.amazonaws.com/uploads/{uuid.uuid4()}_{file.filename}"
    
    # Mock Vision AI extraction
    # This will be replaced by GPT-4 Vision API call later
    mock_extracted_data = WardrobeItemCreate(
        photo_url=photo_url,
        category="Top",
        color="Neutral",
        style_tags=["minimalist", "modern"],
        season="All",
        occasion="Casual",
        brand="Unknown"
    )
    
    return await create_wardrobe_item(mock_extracted_data, current_user)

@router.get("/", response_model=List[WardrobeItem])
async def list_wardrobe(
    category: Optional[str] = None,
    color: Optional[str] = None,
    season: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user['id']
    query = f"SELECT * FROM wardrobe_items WHERE user_id = '{user_id}'"
    
    if category:
        query += f" AND category = '{category}'"
    if color:
        query += f" AND color = '{color}'"
    if season:
        query += f" AND season = '{season}'"
        
    items = run_query(query)
    
    for item in items:
        item['style_tags'] = json.loads(item['style_tags'])
        
    return items

@router.get("/{item_id}", response_model=WardrobeItem)
async def get_wardrobe_item(item_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    item = run_query(f"SELECT * FROM wardrobe_items WHERE id = '{item_id}' AND user_id = '{user_id}'")
    
    if not item:
        raise HTTPException(status_code=404, detail="Wardrobe item not found")
    
    res = item[0]
    res['style_tags'] = json.loads(res['style_tags'])
    return res

@router.put("/{item_id}", response_model=WardrobeItem)
async def update_wardrobe_item(item_id: str, item: WardrobeItemCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    
    # Check if item exists
    existing = run_query(f"SELECT id FROM wardrobe_items WHERE id = '{item_id}' AND user_id = '{user_id}'")
    if not existing:
        raise HTTPException(status_code=404, detail="Wardrobe item not found")
    
    style_tags_json = json.dumps(item.style_tags)
    
    execute_query(f"""
        UPDATE wardrobe_items 
        SET photo_url = '{item.photo_url}', 
            category = '{item.category or ""}', 
            color = '{item.color or ""}', 
            style_tags = '{style_tags_json}', 
            season = '{item.season or ""}', 
            occasion = '{item.occasion or ""}', 
            brand = '{item.brand or ""}'
        WHERE id = '{item_id}' AND user_id = '{user_id}'
    """)
    
    updated_item = run_query(f"SELECT * FROM wardrobe_items WHERE id = '{item_id}'")
    res = updated_item[0]
    res['style_tags'] = json.loads(res['style_tags'])
    return res

@router.delete("/{item_id}")
async def delete_wardrobe_item(item_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    
    # Check if item exists
    existing = run_query(f"SELECT id FROM wardrobe_items WHERE id = '{item_id}' AND user_id = '{user_id}'")
    if not existing:
        raise HTTPException(status_code=404, detail="Wardrobe item not found")
    
    execute_query(f"DELETE FROM wardrobe_items WHERE id = '{item_id}' AND user_id = '{user_id}'")
    
    return {"message": "Wardrobe item deleted successfully"}

from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    subscription_tier: str = "free"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Wardrobe schemas
class WardrobeItemBase(BaseModel):
    photo_url: str
    category: Optional[str] = None
    color: Optional[str] = None
    style_tags: List[str] = []
    season: Optional[str] = None
    occasion: Optional[str] = None
    brand: Optional[str] = None

class WardrobeItemCreate(WardrobeItemBase):
    pass

class WardrobeItem(WardrobeItemBase):
    id: str
    user_id: str
    created_at: datetime

# Style Profile schemas
class StyleProfileBase(BaseModel):
    body_type: Optional[str] = None
    style_tags: List[str] = []
    size_preferences: Dict[str, str] = {}
    lifestyle_tags: List[str] = []
    weather_location: Optional[str] = None

class StyleProfileUpdate(StyleProfileBase):
    pass

class StyleProfile(StyleProfileBase):
    user_id: str
    updated_at: datetime

# Outfit schemas
class OutfitBase(BaseModel):
    items: List[str]
    status: str = "pending"
    date: str

class OutfitCreate(OutfitBase):
    pass

class Outfit(OutfitBase):
    id: str
    user_id: str
    created_at: datetime

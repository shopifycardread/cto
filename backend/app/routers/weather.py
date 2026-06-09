from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/")
async def get_weather(location: str = "New York"):
    # Mock weather API
    conditions = ["Sunny", "Cloudy", "Rainy", "Partly Cloudy", "Clear"]
    temp = random.randint(50, 85)
    
    return {
        "location": location,
        "temperature": temp,
        "unit": "F",
        "condition": random.choice(conditions),
        "forecast": f"Expected to stay {random.choice(conditions).lower()} throughout the day."
    }

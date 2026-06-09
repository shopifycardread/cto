from fastapi import FastAPI
from app.routers import auth, wardrobe, outfits, profile, weather

app = FastAPI(title="Clad API", description="AI-powered personal stylist and wardrobe OS")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(wardrobe.router, prefix="/api/wardrobe", tags=["wardrobe"])
app.include_router(outfits.router, prefix="/api/outfits", tags=["outfits"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(weather.router, prefix="/api/weather", tags=["weather"])

@app.get("/")
async def root():
    return {"message": "Welcome to Clad API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

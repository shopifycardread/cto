from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas import UserCreate, User, Token
from app.utils.db import run_query, execute_query
from app.utils.auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
import uuid
from datetime import timedelta

router = APIRouter()

@router.post("/register", response_model=User)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = run_query(f"SELECT * FROM users WHERE email = '{user.email}'")
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    
    execute_query(f"""
        INSERT INTO users (id, email, hashed_password, full_name, subscription_tier)
        VALUES ('{user_id}', '{user.email}', '{hashed_password}', '{user.full_name or ""}', '{user.subscription_tier}')
    """)
    
    new_user = run_query(f"SELECT * FROM users WHERE id = '{user_id}'")
    return new_user[0]

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = run_query(f"SELECT * FROM users WHERE email = '{form_data.username}'")
    if not user or not verify_password(form_data.password, user[0]['hashed_password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user[0]['email']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

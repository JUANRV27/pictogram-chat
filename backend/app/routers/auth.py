from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.database import get_db
from app.models.user import User
from datetime import datetime, timedelta
import secrets

router = APIRouter(prefix="/auth", tags=["authentication"])

# Simple session token storage (in production use Redis or JWT)
active_sessions = {}  # {token: user_id}

# Pydantic models for request/response
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

class PasswordReset(BaseModel):
    email: str
    username: str
    new_password: str

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if username exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    
    # Create new user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=User.hash_password(user_data.password)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create session token
    token = secrets.token_urlsafe(32)
    active_sessions[token] = new_user.id
    
    return {
        "token": token,
        "user": new_user
    }

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user and get session token"""
    user = db.query(User).filter(User.username == credentials.username).first()
    
    if not user or not user.verify_password(credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Create session token
    token = secrets.token_urlsafe(32)
    active_sessions[token] = user.id
    
    return {
        "token": token,
        "user": user
    }

@router.post("/logout")
def logout(token: str):
    """Logout user and invalidate token"""
    if token in active_sessions:
        del active_sessions[token]
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
def get_current_user(token: str, db: Session = Depends(get_db)):
    """Get current user info from token"""
    user_id = active_sessions.get(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

# Dependency to get current user
def get_current_user_dep(token: str, db: Session = Depends(get_db)) -> User:
    """Dependency to get current authenticated user"""
    user_id = active_sessions.get(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.post("/change-password")
def change_password(
    data: PasswordChange,
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_dep)
):
    """Change user password"""
    # Verify old password
    if not current_user.verify_password(data.old_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )
    
    # Validate new password length
    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long"
        )
    
    # Update password
    current_user.password_hash = User.hash_password(data.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}

@router.post("/reset-password")
def reset_password(
    data: PasswordReset,
    db: Session = Depends(get_db)
):
    """Reset password using email and username verification"""
    # Find user by email and username
    user = db.query(User).filter(
        User.email == data.email,
        User.username == data.username
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email and username combination"
        )
    
    # Validate new password length
    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long"
        )
    
    # Update password
    user.password_hash = User.hash_password(data.new_password)
    db.commit()
    
    return {"message": "Password reset successfully"}

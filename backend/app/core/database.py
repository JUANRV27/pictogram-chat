import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database URL from environment variable or default to SQLite
# For production (Neon): postgresql://user:password@host/dbname
# For local dev: sqlite:///./chat.db
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./chat.db")

# Create engine with database-specific settings
if DATABASE_URL.startswith("postgresql"):
    # PostgreSQL configuration (Neon)
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Verify connections before using
        pool_recycle=300,    # Recycle connections every 5 minutes
    )
    print(f"📊 Using PostgreSQL database (Production)")
else:
    # SQLite configuration (Local development)
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    print(f"📊 Using SQLite database (Development)")

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database (create tables)
def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully")

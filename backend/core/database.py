import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
from dotenv import load_dotenv

load_dotenv()

# Default to Postgres if env not set
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/airesearch")

# Create engine with pool settings for Docker stability
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

# Scoped session (thread-safe for FastAPI)
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

# Base model and metadata for all ORM tables
Base = declarative_base()
metadata = MetaData()

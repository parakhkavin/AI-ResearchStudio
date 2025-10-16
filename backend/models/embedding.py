from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from core.database import Base

class Embedding(Base):
    __tablename__ = "embeddings"

    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id"), nullable=False)
    chunk_text = Column(Text, nullable=False)
    vector_id = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

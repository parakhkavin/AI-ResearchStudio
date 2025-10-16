from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base


class Paper(Base):
    __tablename__ = "papers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    author = Column(String(255))
    source = Column(String(255))
    summary = Column(Text)
    embedding_id = Column(String(255), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    chunks = relationship("PaperChunk", back_populates="paper", cascade="all, delete-orphan")
    keywords = relationship("PaperKeyword", back_populates="paper", cascade="all, delete-orphan")


class PaperChunk(Base):
    __tablename__ = "paper_chunks"
    id = Column(Integer, primary_key=True)
    paper_id = Column(Integer, ForeignKey("papers.id", ondelete="CASCADE"), index=True)
    chunk_id = Column(String(255), index=True)
    text = Column(Text)

    paper = relationship("Paper", back_populates="chunks")


class PaperKeyword(Base):
    __tablename__ = "paper_keywords"
    id = Column(Integer, primary_key=True)
    paper_id = Column(Integer, ForeignKey("papers.id", ondelete="CASCADE"), index=True)
    keyword = Column(String(128), index=True)
    weight = Column(Integer, default=1)

    paper = relationship("Paper", back_populates="keywords")

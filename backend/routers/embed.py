from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from core.database import SessionLocal
from core.rag_pipeline import build_embeddings
from models.paper import Paper, PaperChunk


router = APIRouter()


@router.post("/{paper_id}")
async def embed_paper(paper_id: int):
    db: Session = SessionLocal()
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    chunks = db.query(PaperChunk).filter(PaperChunk.paper_id == paper_id).all()
    if not chunks:
        raise HTTPException(status_code=400, detail="No chunks to embed")
    build_embeddings(paper.embedding_id, [c.text for c in chunks])
    return {"message": "Rebuilt embeddings", "paper_id": paper_id, "chunks": len(chunks)}

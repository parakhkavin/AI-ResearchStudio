from fastapi import APIRouter
from sqlalchemy.orm import Session
from core.database import SessionLocal
from models.paper import Paper


router = APIRouter()


@router.get("/")
def list_papers():
    db: Session = SessionLocal()
    papers = db.query(Paper).all()
    return [{"id": p.id, "title": p.title, "source": p.source, "created_at": p.created_at} for p in papers]

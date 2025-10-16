from fastapi import APIRouter
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime
from core.database import SessionLocal
from models.paper import PaperKeyword, Paper
from models.embedding import Embedding

router = APIRouter()

START_TIME = datetime.utcnow()


@router.get("/keywords")
def keywords_top(limit: int = 25):
    db: Session = SessionLocal()
    rows = db.query(PaperKeyword.keyword, PaperKeyword.weight).all()

    agg = {}
    for k, w in rows:
        agg[k] = agg.get(k, 0) + (w or 1)
    top = sorted(
        [{"keyword": k, "weight": v} for k, v in agg.items()],
        key=lambda x: -x["weight"]
    )[:limit]
    return {"keywords": top}


@router.get("/stats")
def get_stats():
    db: Session = SessionLocal()
    papers_count = db.query(func.count(Paper.id)).scalar() or 0
    embeddings_count = db.query(func.count(Embedding.id)).scalar() or 0

    uptime_seconds = (datetime.utcnow() - START_TIME).total_seconds()
    hours, remainder = divmod(int(uptime_seconds), 3600)
    minutes, seconds = divmod(remainder, 60)

    if hours > 0:
        uptime = f"{hours}h {minutes}m"
    elif minutes > 0:
        uptime = f"{minutes}m {seconds}s"
    else:
        uptime = f"{seconds}s"

    return {
        "papers_uploaded": papers_count,
        "embeddings_created": embeddings_count,
        "uptime": uptime
    }

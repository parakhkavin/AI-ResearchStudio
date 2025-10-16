from fastapi import APIRouter, UploadFile, HTTPException, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from core.database import SessionLocal
from models.paper import Paper, PaperKeyword
from models.embedding import Embedding
from . import ingest as ingest_router
from . import papers as papers_router
from . import chat as chat_router

router = APIRouter(prefix="/api", tags=["Frontend API"])

class ChatIn(BaseModel):
    message: str

# Upload PDF, delegates to existing ingest logic
@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    res = await ingest_router.upload_pdf(file)
    data = {
        "embedding_id": res.get("embedding_id"),
        "paper_id": res.get("paper_id"),
        "file_name": file.filename,
        "chunks": res.get("chunks", 0),
        "summary": res.get("summary"),
    }
    return {"success": True, "data": data}

# Library listing, uses your existing papers router
@router.get("/library")
def library():
    data = papers_router.list_papers()
    return {"success": True, "data": data}

# Chat, delegates to your existing chat logic, normalizes response shape
@router.post("/chat")
def chat(body: ChatIn):
    out = chat_router.chat(body)
    return {
        "success": True,
        "response": out.get("answer"),
        "citations": out.get("citations", []),
    }

# Analytics for home and analytics pages, normalized field names
@router.get("/analytics")
def analytics():
    db: Session = SessionLocal()

    papers_count = db.query(func.count(Paper.id)).scalar() or 0
    newest = db.query(Paper).order_by(desc(Paper.created_at)).first()
    newest_str = None
    if newest and getattr(newest, "created_at", None):
        try:
            newest_str = newest.created_at.strftime("%b %Y")
        except Exception:
            newest_str = str(newest.created_at)

    # Top keyword
    top_kw = (
        db.query(PaperKeyword.keyword, func.sum(PaperKeyword.weight).label("w"))
        .group_by(PaperKeyword.keyword)
        .order_by(desc("w"))
        .first()
    )
    top_topic = top_kw[0] if top_kw else None

    # Topic chart
    topic_chart = []
    for kw, w in (
        db.query(PaperKeyword.keyword, func.sum(PaperKeyword.weight).label("w"))
        .group_by(PaperKeyword.keyword)
        .order_by(desc("w"))
        .limit(5)
        .all()
    ):
        topic_chart.append({"label": kw, "value": int(w) if w is not None else 0})

    # Source chart
    source_chart = []
    for src, c in (
        db.query(Paper.source, func.count(Paper.id))
        .group_by(Paper.source)
        .limit(5)
        .all()
    ):
        source_chart.append({"label": src or "Unknown", "value": int(c) if c is not None else 0})

    data = {
        "top_keyword": top_topic,
        "newest_paper": newest_str,
        "most_queried": top_topic,
        "library_size": int(papers_count),
        "embeddings_count": int(db.query(func.count(Embedding.id)).scalar() or 0),
        "chat_count": 0,  # update if you track chats
        "last_import": newest_str,
        "topic_chart": topic_chart,
        "source_chart": source_chart,
    }
    return {"success": True, "data": data}

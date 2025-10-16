from fastapi import APIRouter, UploadFile, HTTPException
from sqlalchemy.orm import Session
from core.database import SessionLocal
from core.pdf_utils import extract_text_from_pdf
from core.rag_pipeline import split_text, build_embeddings, generate_summary_and_keywords, top_keywords_from_chunks
from models.paper import Paper, PaperChunk, PaperKeyword
import uuid


router = APIRouter()


@router.post("/pdf")
async def upload_pdf(file: UploadFile):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    full_text = extract_text_from_pdf(file)
    if not full_text.strip():
        raise HTTPException(status_code=400, detail="No extractable text found in PDF")

    doc_id = str(uuid.uuid4())
    parts = split_text(full_text)

    # Build embeddings for the document
    build_embeddings(doc_id, parts)

    # Generate summary and keywords using LLM
    info = generate_summary_and_keywords(full_text)
    quick_keywords = top_keywords_from_chunks(parts, n=12)

    db: Session = SessionLocal()
    paper = Paper(
        title=file.filename,
        author="Unknown",
        source="PDF Upload",
        embedding_id=doc_id,
        summary=info.get("summary", "")
    )
    db.add(paper)
    db.flush()

    # Store the individual chunks
    for i, t in enumerate(parts):
        db.add(PaperChunk(paper_id=paper.id, chunk_id=f"{doc_id}_{i}", text=t))

    # Store keywords from LLM with higher weight
    for kw in info.get("keywords", []):
        if kw:
            db.add(PaperKeyword(paper_id=paper.id, keyword=kw, weight=3))

    # Store quick keywords as fallback
    for kw in quick_keywords:
        db.add(PaperKeyword(paper_id=paper.id, keyword=kw["keyword"], weight=kw["weight"]))

    db.commit()
    db.refresh(paper)

    return {
        "message": "PDF processed",
        "paper_id": paper.id,
        "embedding_id": doc_id,
        "chunks": len(parts),
        "summary": paper.summary
    }

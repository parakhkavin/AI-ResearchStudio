from fastapi import APIRouter, Query
from core.embeddings import similarity_search


router = APIRouter()


@router.get("/")
def search(q: str = Query(..., description="Semantic search query"), k: int = 5):
    hits = similarity_search(q, k=k)
    return {"results": hits}

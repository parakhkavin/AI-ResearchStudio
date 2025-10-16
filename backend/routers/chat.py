from fastapi import APIRouter
from pydantic import BaseModel
from core.rag_pipeline import answer_question


router = APIRouter()


class ChatIn(BaseModel):
    message: str


@router.post("/")
def chat(body: ChatIn):
    out = answer_question(body.message, k=5)
    return out

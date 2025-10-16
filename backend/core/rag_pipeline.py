import os
import re
from typing import List, Dict
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from .embeddings import add_embeddings, similarity_search


def split_text(text: str) -> List[str]:
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=120)
    return splitter.split_text(text)


def generate_summary_and_keywords(full_text: str) -> Dict[str, List[str]]:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2, openai_api_key=os.getenv("OPENAI_API_KEY"))
    prompt = (
        "You will receive the text of an academic paper. "
        "Write a concise 4 sentence summary in plain English. "
        "Then produce 12 single or two word keywords, comma separated. "
        "Return JSON with fields summary and keywords.\n\n"
        f"TEXT:\n{full_text[:8000]}"
    )
    resp = llm.invoke(prompt)
    text = resp.content
    summary_match = re.search(r'"summary"\s*:\s*"(.+?)"', text, re.DOTALL)
    keywords_match = re.search(r'"keywords"\s*:\s*\[(.+?)\]', text, re.DOTALL)
    summary = summary_match.group(1) if summary_match else text.strip()[:600]
    raw = keywords_match.group(1) if keywords_match else ""
    kws = [k.strip().strip('"').strip("'") for k in raw.split(",") if k.strip()]
    return {"summary": summary, "keywords": kws[:12]}


STOP = set("""
a an and or the of in for to from by on with without across about after among under over into out per as is are was were be being been this that these those it its their his her we you they i your our ours mine
introduction methods results discussion conclusion abstract figure table appendix references study paper research data model models system systems learning machine deep neural network networks ai ml nlp
""".split())


def top_keywords_from_chunks(chunks: List[str], n: int = 25):
    freq: Dict[str, int] = {}
    for ch in chunks:
        for tok in re.findall(r"[A-Za-z]{3,}", ch.lower()):
            if tok in STOP:
                continue
            freq[tok] = freq.get(tok, 0) + 1
    return sorted([{"keyword": k, "weight": v} for k, v in freq.items()], key=lambda x: -x["weight"])[:n]


def build_embeddings(doc_id: str, chunks: List[str]):
    ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
    add_embeddings(ids, chunks)


def answer_question(query: str, k: int = 5):
    passages = similarity_search(query, k=k)
    context = "\n\n".join([f"[{i+1}] {p['text']}" for i, p in enumerate(passages)])
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1, openai_api_key=os.getenv("OPENAI_API_KEY"))
    prompt = (
        "Answer the user's question using only the information in the numbered context. "
        "Cite sources like [1], [2] that map to the passage numbers. "
        "If the answer is unknown, say you cannot find it in the documents.\n\n"
        f"CONTEXT:\n{context}\n\nQUESTION:\n{query}"
    )
    resp = llm.invoke(prompt)
    citations = [{"id": passages[i]["id"], "index": i + 1, "snippet": passages[i]["text"][:220]} for i in range(len(passages))]
    return {"answer": resp.content, "citations": citations}

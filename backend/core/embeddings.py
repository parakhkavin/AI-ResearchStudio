import os
from typing import List
from langchain_openai import OpenAIEmbeddings
import chromadb

CHROMA_PATH = os.getenv("CHROMA_PATH", "/data/chroma")
client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection("papers")


def add_embeddings(ids: List[str], docs: List[str]):
    embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
    vectors = embeddings.embed_documents(docs)
    collection.add(ids=ids, embeddings=vectors, documents=docs)


def similarity_search(query: str, k: int = 5):
    from langchain_openai import OpenAIEmbeddings
    emb = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
    qvec = emb.embed_query(query)
    results = collection.query(
    query_embeddings=[qvec],
    n_results=k,
    include=["documents", "metadatas", "distances"]
)
    out = []
    for i in range(len(results["ids"][0])):
        out.append({
            "id": results["ids"][0][i],
            "text": results["documents"][0][i],
            "distance": results["distances"][0][i]
        })
    return out

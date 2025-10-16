from fastapi import FastAPI
from routers import ingest, embed, chat, papers, query, analytics, frontend_api
from fastapi.middleware.cors import CORSMiddleware
from core.database import Base, engine

app = FastAPI(title="AI Research Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] if you want to restrict it
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# Frontend-facing adapter routes
app.include_router(frontend_api.router)

# Keep existing routes under their legacy prefixes
app.include_router(ingest.router, prefix="/ingest", tags=["Ingestion"])
app.include_router(embed.router, prefix="/embed", tags=["Embedding"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(papers.router, prefix="/papers", tags=["Papers"])
app.include_router(query.router, prefix="/query", tags=["Query"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "AI Research Platform API is running"}

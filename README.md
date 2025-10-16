# AI Research Studio

AI Research Studio is a full-stack application that allows researchers to upload papers, analyze insights, and chat intelligently with their research content. The system integrates a FastAPI backend and a Next.js frontend, leveraging PostgreSQL and ChromaDB for persistent storage and vector embeddings.

## Features

- **PDF Upload & Parsing**: Upload research papers that are automatically processed and embedded for semantic search
- **Interactive Chat**: Query your uploaded papers and get AI-generated contextual answers
- **Research Library**: Manage, browse, and search all uploaded papers in a clean interface
- **Analytics Dashboard**: Visualize top research topics, sources, and trends
- **Vector Database Integration**: Uses ChromaDB for storing and retrieving embeddings efficiently

## Project Structure

```
ai-research-platform/
│
├── backend/                     # FastAPI backend
│   ├── main.py                  # Application entry point
│   ├── core/
│   │   └── database.py          # Database engine and session setup
│   ├── models/                  # SQLAlchemy models
│   │   ├── paper.py
│   │   └── embedding.py
│   └── routers/                 # API route definitions
│       ├── frontend_api.py
│       ├── ingest.py
│       ├── chat.py
│       ├── analytics.py
│       ├── papers.py
│       └── query.py
│
├── frontend/                    # Next.js frontend
│   ├── app/
│   │   ├── page.tsx             # Home dashboard
│   │   ├── upload/              # PDF upload UI
│   │   ├── chat/                # Chat interface
│   │   ├── library/             # Paper library
│   │   └── analytics/           # Analytics dashboard
│   └── components/              # Shared React components
│       ├── Navbar.tsx
│       ├── StatCard.tsx
│       ├── AnimatedCard.tsx
│       └── SectionHeader.tsx
│
├── docker-compose.yml           # Service orchestration
└── README.md
```

## Prerequisites

- Docker & Docker Compose
- Node.js (v18+)
- Python 3.11+

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-research-studio.git
cd ai-research-studio
```

### 2. Set up environment variables

Create `.env.local` inside the `frontend/` folder:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

Create `.env` inside the `backend/` folder:

```env
DATABASE_URL=postgresql://postgres:postgres@research_db:5432/airesearch
CHROMA_HOST=chromadb
CHROMA_PORT=8000
```

## Usage

### Run with Docker

```bash
docker compose up --build
```

Once running:

- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:8000/docs
- **Database** → PostgreSQL at `localhost:5432`
- **Vector Store** → ChromaDB container

### Development Mode (Fast Reloads)

To develop locally without rebuilding Docker each time:

**Backend**

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

## Key Files

- `frontend/app/chat/page.tsx` — Chat interface for interacting with uploaded papers
- `frontend/app/upload/page.tsx` — Handles PDF upload and progress display
- `backend/routers/frontend_api.py` — Unified API endpoints for frontend consumption
- `backend/core/database.py` — Configures SQLAlchemy and initializes tables

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Uploads and processes a PDF file |
| `/api/library` | GET | Fetches all stored papers |
| `/api/chat` | POST | Sends user questions and retrieves AI-generated answers |
| `/api/analytics` | GET | Returns topic, source, and usage analytics |

### Example Chat Request

```json
POST /api/chat
{
  "message": "Summarize the main idea of the Transformer paper"
}
```

## Learning Outcomes

- Practical experience with FastAPI + Next.js integration
- Understanding of vector embeddings and semantic search concepts
- Implementation of full-stack AI-driven workflows
- Hands-on experience deploying multi-service applications via Docker Compose

## Author

**Kavin Parakh**

Feel free to contribute, suggest enhancements, or reach out for collaboration opportunities!

## License

MIT License - see LICENSE file for details

---

⭐ Star this repo if you find it helpful!
from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse

from .db import init_db
from .routers import action_items, notes

FRONTEND_PATH = Path(__file__).resolve().parent.parent / "frontend" / "index.html"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Action Item Extractor", lifespan=lifespan)

app.include_router(notes.router)
app.include_router(action_items.router)


@app.get("/", response_class=HTMLResponse)
def index() -> str:
    if not FRONTEND_PATH.exists():
        raise HTTPException(status_code=404, detail="frontend not found")
    return FRONTEND_PATH.read_text(encoding="utf-8")
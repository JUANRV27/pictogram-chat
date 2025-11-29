from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.routers.recommend import router as recommend_router
from app.routers.chat import router as chat_router
from app.routers.auth import router as auth_router
from app.core.database import init_db

app = FastAPI()

# habilitar CORS para que el frontend pueda conectarse
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # luego puedes poner la URL exacta
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    print("Database initialized successfully")

# Include routers
app.include_router(recommend_router)
app.include_router(auth_router)
app.include_router(chat_router)

from app.core.arasaac import search_pictograms

@app.get("/clear-cache")
def clear_cache():
    search_pictograms.cache_clear()
    return {"message": "Cache cleared"}


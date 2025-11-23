from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from routers.recommend import router as recommend_router

app = FastAPI()

# habilitar CORS para que el frontend pueda conectarse
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # luego puedes poner la URL exacta
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend_router)

from core.arasaac import search_pictograms

@app.get("/clear-cache")
def clear_cache():
    search_pictograms.cache_clear()
    return {"message": "Cache cleared"}



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from core.config import settings
from routers import auth, users, ai, matches, interests, admin
import os

app = FastAPI(title="SoulSync AI API", version="1.0.0")

# CORS setup
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
os.makedirs(settings.STATIC_FILES_PATH, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.STATIC_FILES_PATH), name="static")

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(ai.router)
app.include_router(matches.router)
app.include_router(interests.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "Welcome to SoulSync AI API"}

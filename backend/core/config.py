from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017/soulsync"
    GEMINI_API_KEY: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CHROMA_PERSIST_PATH: str = "./chroma_db"
    STATIC_FILES_PATH: str = "./static"

    class Config:
        env_file = ".env"

settings = Settings()

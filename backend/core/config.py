from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://webathon-mongodb:27017"
    DB_NAME: str = "soulsync"
    GEMINI_API_KEY: str
    OLLAMA_HOST: Optional[str] = None
    MOCK_EMBEDDINGS: bool = False
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CHROMA_PERSIST_PATH: str = "./chroma_db"
    STATIC_FILES_PATH: str = "./static"

    class Config:
        env_file = ".env"

settings = Settings()

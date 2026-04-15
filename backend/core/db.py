from motor.motor_asyncio import AsyncIOMotorClient
import chromadb
from core.config import settings

# MongoDB setup
client = AsyncIOMotorClient(settings.MONGO_URI)

# FIX: Pass the DB_NAME from your settings to select the specific database
# You can use bracket notation client[settings.DB_NAME] or get_database(settings.DB_NAME)
db = client[settings.DB_NAME]

# ChromaDB setup
chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_PATH)

def get_mongodb():
    return db

def get_chromadb():
    return chroma_client
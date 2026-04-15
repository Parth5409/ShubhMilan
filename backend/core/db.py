from motor.motor_asyncio import AsyncIOMotorClient
import chromadb
from core.config import settings

# MongoDB setup
client = AsyncIOMotorClient(settings.MONGO_URI)
db = client.get_database()

# ChromaDB setup
chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_PATH)

def get_mongodb():
    return db

def get_chromadb():
    return chroma_client

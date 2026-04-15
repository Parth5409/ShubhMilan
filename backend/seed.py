import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
from utils.auth import get_password_hash
from bson import ObjectId
import chromadb
from langchain_google_genai import GoogleGenerativeAIEmbeddings

async def seed():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client.get_database()
    users_col = db.get_collection("users")
    
    # ChromaDB setup
    chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_PATH)
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=settings.GEMINI_API_KEY
    )
    collection = chroma_client.get_or_create_collection(name="user_profiles")

    # Clear existing
    await users_col.delete_many({})
    try:
        chroma_client.delete_collection("user_profiles")
        collection = chroma_client.create_collection(name="user_profiles")
    except:
        collection = chroma_client.get_or_create_collection(name="user_profiles")

    # 1. Admin
    admin_id = ObjectId()
    admin_user = {
        "_id": admin_id,
        "email": "admin@soulsync.ai",
        "password_hash": get_password_hash("admin123"),
        "role": "admin",
        "is_active": True,
        "basic_info": {
            "full_name": "System Admin",
            "age": 30,
            "gender": "Other",
            "city": "Mumbai",
            "state": "Maharashtra",
            "religion": "N/A",
            "mother_tongue": "English",
            "education": "Master's",
            "occupation": "Administrator",
            "annual_income_inr": 1000000
        }
    }
    await users_col.insert_one(admin_user)

    # 2. Sample Users
    users_data = [
        {
            "email": "priya@example.com",
            "full_name": "Priya Sharma",
            "gender": "Female",
            "bio": "I love painting, mountain trekking and reading classical literature. Looking for someone who values art and nature."
        },
        {
            "email": "rahul@example.com",
            "full_name": "Rahul Mehta",
            "gender": "Male",
            "bio": "Software engineer by day, amateur chef by night. Passionate about sustainable living and sci-fi movies."
        },
        {
            "email": "ananya@example.com",
            "full_name": "Ananya Iyer",
            "gender": "Female",
            "bio": "Yoga enthusiast and environmental lawyer. I enjoy quiet weekends and soulful conversations over tea."
        }
    ]

    for u in users_data:
        uid = ObjectId()
        user_doc = {
            "_id": uid,
            "email": u["email"],
            "password_hash": get_password_hash("password123"),
            "role": "user",
            "is_active": True,
            "basic_info": {
                "full_name": u["full_name"],
                "age": 25,
                "gender": u["gender"],
                "city": "Mumbai",
                "state": "Maharashtra",
                "religion": "Hindu",
                "mother_tongue": "Marathi",
                "education": "Bachelor's",
                "occupation": "Professional",
                "annual_income_inr": 800000
            },
            "ai_profile": {
                "bio": u["bio"],
                "vector_id": str(uid)
            }
        }
        await users_col.insert_one(user_doc)
        
        # Embed and add to Chroma
        emb = embeddings.embed_query(u["bio"])
        collection.add(
            ids=[str(uid)],
            embeddings=[emb],
            documents=[u["bio"]],
            metadatas=[{
                "gender": u["gender"],
                "city": "Mumbai",
                "full_name": u["full_name"]
            }]
        )

    print("Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())

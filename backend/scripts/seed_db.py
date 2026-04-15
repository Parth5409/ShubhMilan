import asyncio
import os
import sys
from datetime import datetime
from bson import ObjectId
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient

# Add parent directory to sys.path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.config import settings

async def seed_db():
    # Use localhost if running locally outside docker network
    mongo_uri = settings.MONGO_URI
    if "webathon-mongodb" in mongo_uri and not os.getenv("RUNNING_IN_DOCKER"):
        mongo_uri = mongo_uri.replace("webathon-mongodb", "localhost")
        
    print(f"Connecting to MongoDB at {mongo_uri}...")
    client = AsyncIOMotorClient(mongo_uri)
    db = client[settings.DB_NAME]
    
    users_col = db.get_collection("users")
    interests_col = db.get_collection("interests")

    print("Clearing existing users and interests...")
    await users_col.delete_many({})
    await interests_col.delete_many({})

    # Bypass passlib's buggy check by using bcrypt directly
    password_hash = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # 1. Create Mock Users
    print("Creating mock users with Unsplash images...")
    
    mock_users = [
        {
            "_id": ObjectId(),
            "email": "alice@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Alice Singh",
                "age": 26,
                "gender": "Female",
                "city": "Mumbai",
                "occupation": "Creative Director"
            },
            "ai_profile": {
                "bio": "Art enthusiast and coffee lover. Seeking someone who enjoys sunset walks and meaningful conversations.",
                "interests": ["Painting", "Coffee", "Hiking", "Yoga"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "rohan@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Rohan Sharma",
                "age": 29,
                "gender": "Male",
                "city": "Delhi",
                "occupation": "Software Architect"
            },
            "ai_profile": {
                "bio": "Techie by day, musician by night. I love exploring new technologies and playing the guitar.",
                "interests": ["Coding", "Guitar", "Travel", "Chess"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "priya@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Priya Kapoor",
                "age": 27,
                "gender": "Female",
                "city": "Bangalore",
                "occupation": "Data Scientist"
            },
            "ai_profile": {
                "bio": "I find beauty in patterns and data. Looking for an intellectually curious partner.",
                "interests": ["Data Science", "Dancing", "Reading", "Star Gazing"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "vikram@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Vikram Malhotra",
                "age": 31,
                "gender": "Male",
                "city": "Pune",
                "occupation": "Medical Professional"
            },
            "ai_profile": {
                "bio": "Passionate about healthcare and fitness. I enjoy running and cooking healthy meals.",
                "interests": ["Fitness", "Cooking", "Running", "Medicine"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "zoya@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Zoya Khan",
                "age": 25,
                "gender": "Female",
                "city": "Hyderabad",
                "occupation": "Content Creator"
            },
            "ai_profile": {
                "bio": "A storyteller at heart. I love capturing moments through my lens and sharing them with the world.",
                "interests": ["Photography", "Writing", "Fashion", "Travel"],
                "relationship_goal": "casual"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

    await users_col.insert_many(mock_users)
    print(f"Inserted {len(mock_users)} users.")

    # 2. Create Mock Interests
    print("Creating mock interests...")
    # Alice sends to Rohan (Pending)
    # Rohan sends to Priya (Accepted)
    # Vikram sends to Alice (Declined)
    
    mock_interests = [
        {
            "sender_id": mock_users[0]["_id"],
            "receiver_id": mock_users[1]["_id"],
            "message": "Hi Rohan, I really liked your profile. Would love to connect!",
            "status": "pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "sender_id": mock_users[1]["_id"],
            "receiver_id": mock_users[2]["_id"],
            "message": "Hey Priya! I see we both share an interest in tech and travel. How would you like to chat?",
            "status": "accepted",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "sender_id": mock_users[3]["_id"],
            "receiver_id": mock_users[0]["_id"],
            "message": "Hi Alice, I noticed you like hiking. I'm a big runner myself. Perhaps we could connect?",
            "status": "declined",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

    await interests_col.insert_many(mock_interests)
    print(f"Inserted {len(mock_interests)} interests.")

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_db())

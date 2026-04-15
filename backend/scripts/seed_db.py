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
    admin_password_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # ── 1. Admin user ──────────────────────────────────────────────────────────
    admin_id = ObjectId()
    admin_user = {
        "_id": admin_id,
        "email": "admin@example.com",
        "password_hash": admin_password_hash,
        "role": "admin",
        "basic_info": {
            "full_name": "Admin User",
            "age": 30,
            "gender": "Other",
            "city": "Mumbai",
            "occupation": "Platform Administrator",
            "mobile_number": "+91 99999 00000"
        },
        "ai_profile": {
            "bio": "Platform admin account. Not a real user profile.",
            "interests": [],
            "relationship_goal": "none"
        },
        "profile_photo_url": "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=800",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    # ── 2. Regular users ───────────────────────────────────────────────────────
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
                "occupation": "Creative Director",
                "mobile_number": "+91 98765 43210"
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
                "occupation": "Software Architect",
                "mobile_number": "+91 87654 32109"
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
                "occupation": "Data Scientist",
                "mobile_number": "+91 76543 21098"
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
                "occupation": "Medical Professional",
                "mobile_number": "+91 65432 10987"
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
                "occupation": "Content Creator",
                "mobile_number": "+91 54321 09876"
            },
            "ai_profile": {
                "bio": "A storyteller at heart. I love capturing moments through my lens and sharing them with the world.",
                "interests": ["Photography", "Writing", "Fashion", "Travel"],
                "relationship_goal": "casual"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "arjun@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Arjun Nair",
                "age": 28,
                "gender": "Male",
                "city": "Chennai",
                "occupation": "Product Manager",
                "mobile_number": "+91 43210 98765"
            },
            "ai_profile": {
                "bio": "Problem-solver who loves the outdoors. Looking for someone to explore new trails and new cuisines with.",
                "interests": ["Trekking", "Product Design", "Food", "Cycling"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "meera@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Meera Iyer",
                "age": 24,
                "gender": "Female",
                "city": "Kochi",
                "occupation": "Graphic Designer",
                "mobile_number": "+91 32109 87654"
            },
            "ai_profile": {
                "bio": "Design is my love language. I sketch, I bake, and I overthink playlists.",
                "interests": ["Design", "Baking", "Music", "Film"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "kabir@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Kabir Mehta",
                "age": 33,
                "gender": "Male",
                "city": "Ahmedabad",
                "occupation": "Entrepreneur",
                "mobile_number": "+91 21098 76543"
            },
            "ai_profile": {
                "bio": "Built two startups, learning from both. I value depth over small talk and ambition over comfort.",
                "interests": ["Entrepreneurship", "Investing", "Meditation", "Cricket"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "divya@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Divya Reddy",
                "age": 26,
                "gender": "Female",
                "city": "Hyderabad",
                "occupation": "Chartered Accountant",
                "mobile_number": "+91 10987 65432"
            },
            "ai_profile": {
                "bio": "Numbers by profession, Kathak by passion. I find joy in precision and movement equally.",
                "interests": ["Classical Dance", "Finance", "Poetry", "Gardening"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "samir@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Samir Bose",
                "age": 30,
                "gender": "Male",
                "city": "Kolkata",
                "occupation": "Journalist",
                "mobile_number": "+91 09876 54321"
            },
            "ai_profile": {
                "bio": "Storyteller chasing truth. I read obsessively, cook experimentally, and debate enthusiastically.",
                "interests": ["Journalism", "Literature", "Cooking", "Debating"],
                "relationship_goal": "casual"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "ananya@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Ananya Pillai",
                "age": 23,
                "gender": "Female",
                "city": "Trivandrum",
                "occupation": "Research Scholar",
                "mobile_number": "+91 98765 11111"
            },
            "ai_profile": {
                "bio": "PhD student in environmental science. Passionate about the planet, ancient temples, and strong filter coffee.",
                "interests": ["Environment", "Research", "Temple Architecture", "Coffee"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "rahul@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Rahul Gupta",
                "age": 32,
                "gender": "Male",
                "city": "Jaipur",
                "occupation": "Civil Engineer",
                "mobile_number": "+91 87654 22222"
            },
            "ai_profile": {
                "bio": "I build things — bridges, furniture, and friendships. Weekend photographer who loves desert sunsets.",
                "interests": ["Photography", "Woodworking", "Motorcycles", "Travel"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "tara@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Tara Menon",
                "age": 27,
                "gender": "Female",
                "city": "Bangalore",
                "occupation": "UX Researcher",
                "mobile_number": "+91 76543 33333"
            },
            "ai_profile": {
                "bio": "I study how people think, then go hiking to stop thinking. Big fan of board games and niche documentaries.",
                "interests": ["UX Research", "Hiking", "Board Games", "Documentaries"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "nikhil@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Nikhil Joshi",
                "age": 29,
                "gender": "Male",
                "city": "Nagpur",
                "occupation": "Sports Coach",
                "mobile_number": "+91 65432 44444"
            },
            "ai_profile": {
                "bio": "Former state-level swimmer, now coaching the next generation. Life is better with early mornings and cold pools.",
                "interests": ["Swimming", "Coaching", "Nutrition", "Podcasts"],
                "relationship_goal": "long-term"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": ObjectId(),
            "email": "shreya@example.com",
            "password_hash": password_hash,
            "role": "user",
            "basic_info": {
                "full_name": "Shreya Agarwal",
                "age": 25,
                "gender": "Female",
                "city": "Lucknow",
                "occupation": "Fashion Stylist",
                "mobile_number": "+91 54321 55555"
            },
            "ai_profile": {
                "bio": "Style is my superpower. I hunt vintage finds, watch Criterion films, and make really good chai.",
                "interests": ["Fashion", "Vintage Shopping", "Cinema", "Cooking"],
                "relationship_goal": "casual"
            },
            "profile_photo_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
    ]

    all_users = [admin_user] + mock_users

    await users_col.insert_many(all_users)
    print(f"Inserted {len(all_users)} users (1 admin + {len(mock_users)} regular).")

    # ── 3. Mock interests ──────────────────────────────────────────────────────
    print("Creating mock interests...")

    # Shorthand: index into mock_users (0-based, excludes admin)
    u = mock_users

    mock_interests = [
        # Alice → Rohan (pending)
        {
            "sender_id": u[0]["_id"], "receiver_id": u[1]["_id"],
            "message": "Hi Rohan, I really liked your profile. Would love to connect!",
            "status": "pending",
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
        },
        # Rohan → Priya (accepted)
        {
            "sender_id": u[1]["_id"], "receiver_id": u[2]["_id"],
            "message": "Hey Priya! I see we both share an interest in tech and travel. How would you like to chat?",
            "status": "accepted",
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
        },
        # Vikram → Alice (declined)
        {
            "sender_id": u[3]["_id"], "receiver_id": u[0]["_id"],
            "message": "Hi Alice, I noticed you like hiking. I'm a big runner myself. Perhaps we could connect?",
            "status": "declined",
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
        },
        # Arjun → Meera (pending)
        {
            "sender_id": u[5]["_id"], "receiver_id": u[6]["_id"],
            "message": "Hey Meera! Your design portfolio is stunning. Would love to know more about you.",
            "status": "pending",
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
        },
        # Kabir → Divya (accepted)
        {
            "sender_id": u[7]["_id"], "receiver_id": u[8]["_id"],
            "message": "Hi Divya, the combination of finance and classical dance is rare and fascinating. Let's talk!",
            "status": "accepted",
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
        },
        # Tara → Nikhil (pending)
        {
            "sender_id": u[12]["_id"], "receiver_id": u[13]["_id"],
            "message": "Hi Nikhil! Fellow morning person here. Your passion for coaching is inspiring.",
            "status": "pending",
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
        },
        # Samir → Ananya (pending)
        {
            "sender_id": u[9]["_id"], "receiver_id": u[10]["_id"],
            "message": "An environmental researcher — you must have amazing stories. I'd love to hear them.",
            "status": "pending",
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
        },
        # Shreya → Rahul (declined)
        {
            "sender_id": u[14]["_id"], "receiver_id": u[11]["_id"],
            "message": "Hey Rahul! Desert photography and motorcycles sounds like my kind of adventure.",
            "status": "declined",
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
        },
        # Zoya → Arjun (accepted)
        {
            "sender_id": u[4]["_id"], "receiver_id": u[5]["_id"],
            "message": "Fellow traveller here! Your trekking shots on your profile are amazing.",
            "status": "accepted",
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
        },
        # Meera → Samir (pending)
        {
            "sender_id": u[6]["_id"], "receiver_id": u[9]["_id"],
            "message": "I love a good debate over coffee. Your journalist bio intrigued me!",
            "status": "pending",
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
        },
    ]

    await interests_col.insert_many(mock_interests)
    print(f"Inserted {len(mock_interests)} interests.")

    print("\nDatabase seeding completed successfully!")
    print(f"  Admin login : admin@example.com / admin123")
    print(f"  User login  : any user email / password123")

if __name__ == "__main__":
    asyncio.run(seed_db())
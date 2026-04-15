from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from models.user import UserCreate, UserUpdate, UserOut
from models.interest import InterestCreate, InterestOut
from typing import List, Optional
from datetime import datetime

class MongoService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users = db.get_collection("users")
        self.interests = db.get_collection("interests")

    # User Operations
    def calculate_compatibility(self, user_a: UserOut, user_b: UserOut) -> int:
        score = 60 # Base score
        
        # 1. Interests Overlap (Jaccard similarity)
        interests_a = set(user_a.ai_profile.interests if user_a.ai_profile and user_a.ai_profile.interests else [])
        interests_b = set(user_b.ai_profile.interests if user_b.ai_profile and user_b.ai_profile.interests else [])
        
        if interests_a and interests_b:
            intersection = interests_a.intersection(interests_b)
            union = interests_a.union(interests_b)
            # Add up to 30 points for interest match
            score += int((len(intersection) / len(union)) * 30)
        
        # 2. City Match (+5 points)
        if user_a.basic_info and user_b.basic_info:
            if user_a.basic_info.city and user_b.basic_info.city:
                if user_a.basic_info.city == user_b.basic_info.city:
                    score += 5
        
        # 3. Relationship Goal Match (+5 points)
        if user_a.ai_profile and user_b.ai_profile:
            if user_a.ai_profile.relationship_goal and user_b.ai_profile.relationship_goal:
                if user_a.ai_profile.relationship_goal == user_b.ai_profile.relationship_goal:
                    score += 5
                    
        return min(score, 99)

    def flatten_dict(self, d: dict, parent_key: str = '', sep: str = '.') -> dict:
        items = []
        for k, v in d.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            if isinstance(v, dict):
                items.extend(self.flatten_dict(v, new_key, sep=sep).items())
            else:
                items.append((new_key, v))
        return dict(items)

    async def create_user(self, user: dict) -> UserOut:
        result = await self.users.insert_one(user)
        user["id"] = str(result.inserted_id)
        return UserOut(**user)

    async def get_user_by_email(self, email: str) -> Optional[UserOut]:
        user = await self.users.find_one({"email": email})
        if user:
            user["id"] = str(user["_id"])
            return UserOut(**user)
        return None

    async def get_user_with_password(self, email: str) -> Optional[dict]:
        """Returns the raw document including password_hash, which UserOut excludes."""
        return await self.users.find_one({"email": email})

    async def get_user_by_id(self, user_id: str) -> Optional[UserOut]:
        try:
            user = await self.users.find_one({"_id": ObjectId(user_id)})
        except:
            return None
        if user:
            user["id"] = str(user["_id"])
            return UserOut(**user)
        return None

    async def update_user(self, user_id: str, update_data: dict) -> Optional[UserOut]:
        update_data["updated_at"] = datetime.utcnow()
        # Use dot notation for nested fields to prevent overwriting
        flattened = self.flatten_dict(update_data)
        await self.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": flattened}
        )
        return await self.get_user_by_id(user_id)

    async def search_users(self, exclude_id: str, query_str: str = "", gender_pref: str = None, limit: int = 20) -> List[UserOut]:
        query = {"_id": {"$ne": ObjectId(exclude_id)}}
        
        if gender_pref:
            query["basic_info.gender"] = gender_pref
            
        if query_str:
            regex = {"$regex": query_str, "$options": "i"}
            query["$or"] = [
                {"basic_info.full_name": regex},
                {"basic_info.city": regex},
                {"basic_info.occupation": regex},
                {"ai_profile.bio": regex},
                {"ai_profile.interests": regex}
            ]
            
        users = await self.users.find(query).limit(limit).to_list(length=limit)
        result = []
        for user in users:
            user["id"] = str(user["_id"])
            result.append(UserOut(**user))
        return result

    async def get_users_except(self, exclude_id: str, limit: int = 5) -> List[UserOut]:
        return await self.search_users(exclude_id, limit=limit)

    # Admin Operations
    async def get_pending_verifications(self) -> List[UserOut]:
        cursor = self.users.find({"verification.status": "pending"})
        return [UserOut(**u) for u in await cursor.to_list(length=100)]

    # Interest Operations
    async def get_interest_by_id(self, interest_id: str) -> Optional[dict]:
        return await self.interests.find_one({"_id": ObjectId(interest_id)})

    async def create_interest(self, sender_id: str, interest_data: InterestCreate) -> InterestOut:
        doc = interest_data.model_dump()
        doc["sender_id"] = ObjectId(sender_id)
        doc["receiver_id"] = ObjectId(doc["receiver_id"])
        doc["status"] = "pending"
        doc["created_at"] = datetime.utcnow()
        doc["updated_at"] = datetime.utcnow()
        
        # Prevent duplicates
        existing = await self.interests.find_one({
            "sender_id": doc["sender_id"],
            "receiver_id": doc["receiver_id"]
        })
        if existing:
            return InterestOut(**existing)

        result = await self.interests.insert_one(doc)
        doc["_id"] = result.inserted_id
        return InterestOut(**doc)

    async def get_sent_interests(self, user_id: str) -> List[dict]:
        pipeline = [
            {"$match": {"sender_id": ObjectId(user_id)}},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "receiver_id",
                    "foreignField": "_id",
                    "as": "receiver"
                }
            },
            {"$unwind": {"path": "$receiver", "preserveNullAndEmptyArrays": True}}
        ]
        cursor = self.interests.aggregate(pipeline)
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
            if doc.get("receiver"):
                doc["receiver"]["id"] = str(doc["receiver"]["_id"])
        return results

    async def get_received_interests(self, user_id: str) -> List[dict]:
        pipeline = [
            {"$match": {"receiver_id": ObjectId(user_id)}},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "sender_id",
                    "foreignField": "_id",
                    "as": "sender"
                }
            },
            {"$unwind": {"path": "$sender", "preserveNullAndEmptyArrays": True}}
        ]
        cursor = self.interests.aggregate(pipeline)
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
            if doc.get("sender"):
                doc["sender"]["id"] = str(doc["sender"]["_id"])
        return results

    async def update_interest_status(self, interest_id: str, status: str) -> Optional[InterestOut]:
        await self.interests.update_one(
            {"_id": ObjectId(interest_id)},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
        doc = await self.interests.find_one({"_id": ObjectId(interest_id)})
        if doc:
            return InterestOut(**doc)
        return None

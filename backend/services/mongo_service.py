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
        user["_id"] = result.inserted_id
        return UserOut(**user)

    async def get_user_by_email(self, email: str) -> Optional[UserOut]:
        user = await self.users.find_one({"email": email})
        if user:
            return UserOut(**user)
        return None

    async def get_user_with_password(self, email: str) -> Optional[dict]:
        """Returns the raw document including password_hash, which UserOut excludes."""
        return await self.users.find_one({"email": email})

    async def get_user_by_id(self, user_id: str) -> Optional[UserOut]:
        user = await self.users.find_one({"_id": ObjectId(user_id)})
        if user:
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

    async def delete_user(self, user_id: str):
        await self.users.delete_one({"_id": ObjectId(user_id)})

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

    async def get_sent_interests(self, user_id: str) -> List[InterestOut]:
        cursor = self.interests.find({"sender_id": ObjectId(user_id)})
        return [InterestOut(**i) for i in await cursor.to_list(length=100)]

    async def get_received_interests(self, user_id: str) -> List[InterestOut]:
        cursor = self.interests.find({"receiver_id": ObjectId(user_id)})
        return [InterestOut(**i) for i in await cursor.to_list(length=100)]

    async def update_interest_status(self, interest_id: str, status: str) -> Optional[InterestOut]:
        await self.interests.update_one(
            {"_id": ObjectId(interest_id)},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
        doc = await self.interests.find_one({"_id": ObjectId(interest_id)})
        if doc:
            return InterestOut(**doc)
        return None

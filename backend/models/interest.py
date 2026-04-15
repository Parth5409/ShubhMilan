from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from models.user import PyObjectId
from bson import ObjectId

class InterestBase(BaseModel):
    receiver_id: PyObjectId
    message: Optional[str] = "Hi! I'd love to connect."

class InterestCreate(InterestBase):
    pass

class InterestOut(InterestBase):
    id: PyObjectId = Field(alias="_id", default=None)
    sender_id: PyObjectId
    status: str = "pending" # pending | accepted | declined
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

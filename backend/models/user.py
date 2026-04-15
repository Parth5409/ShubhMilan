from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(lambda x: ObjectId(x)),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x))
        )

class BasicInfo(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    religion: Optional[str] = None
    mother_tongue: Optional[str] = None
    education: Optional[str] = None
    occupation: Optional[str] = None
    annual_income_inr: Optional[int] = None
    mobile_number: Optional[str] = None

class Astrology(BaseModel):
    dob: str
    time_of_birth: str
    place_of_birth: str
    sun_sign: Optional[str] = None
    moon_sign: Optional[str] = None
    generated_reading: Optional[str] = None

class AIProfile(BaseModel):
    bio: Optional[str] = None
    raw_input: Optional[str] = None
    vector_id: Optional[str] = None
    interests: Optional[List[str]] = None
    relationship_goal: Optional[str] = None

class Verification(BaseModel):
    status: str = "pending" # pending | verified | rejected
    id_image_path: Optional[str] = None
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    reviewed_at: Optional[datetime] = None
    reviewed_by_admin_id: Optional[str] = None

class Preferences(BaseModel):
    partner_age_min: int = 21
    partner_age_max: int = 35
    partner_city: List[str] = []
    partner_religion: str = "Any"

class UserBase(BaseModel):
    email: EmailStr
    role: str = "user" # user | admin
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: str
    basic_info: Optional[BasicInfo] = None
    astrology: Optional[Astrology] = None
    ai_profile: Optional[AIProfile] = None
    verification: Optional[Verification] = None
    preferences: Optional[Preferences] = None
    profile_photo_url: Optional[str] = None
    compatibility: Optional[int] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class BasicInfoUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    religion: Optional[str] = None
    mother_tongue: Optional[str] = None
    education: Optional[str] = None
    occupation: Optional[str] = None
    annual_income_inr: Optional[int] = None
    mobile_number: Optional[str] = None

class AstrologyUpdate(BaseModel):
    dob: Optional[str] = None
    time_of_birth: Optional[str] = None
    place_of_birth: Optional[str] = None
    sun_sign: Optional[str] = None
    moon_sign: Optional[str] = None
    generated_reading: Optional[str] = None

class AIProfileUpdate(BaseModel):
    bio: Optional[str] = None
    raw_input: Optional[str] = None
    vector_id: Optional[str] = None
    interests: Optional[List[str]] = None
    relationship_goal: Optional[str] = None

class VerificationUpdate(BaseModel):
    status: Optional[str] = None
    id_image_path: Optional[str] = None
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    reviewed_by_admin_id: Optional[str] = None

class PreferencesUpdate(BaseModel):
    partner_age_min: Optional[int] = None
    partner_age_max: Optional[int] = None
    partner_city: Optional[List[str]] = None
    partner_religion: Optional[str] = None

class UserUpdate(BaseModel):
    basic_info: Optional[BasicInfoUpdate] = None
    astrology: Optional[AstrologyUpdate] = None
    ai_profile: Optional[AIProfileUpdate] = None
    verification: Optional[VerificationUpdate] = None
    preferences: Optional[PreferencesUpdate] = None
    profile_photo_url: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

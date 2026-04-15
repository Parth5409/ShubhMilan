from fastapi import APIRouter, Depends, HTTPException
from core.db import get_mongodb
from models.user import UserOut
from services.ai_service import AIService
from services.mongo_service import MongoService
from utils.deps import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["ai"])

class EnhanceBioRequest(BaseModel):
    raw_text: str

class IcebreakerRequest(BaseModel):
    target_id: str

class AstrologyRequest(BaseModel):
    dob: str
    time: str
    place: str

@router.post("/enhance-bio")
async def enhance_bio(req: EnhanceBioRequest):
    ai_service = AIService()
    bio = await ai_service.enhance_bio(req.raw_text)
    return {"enhanced_bio": bio}

@router.post("/icebreakers")
async def get_icebreakers(
    req: IcebreakerRequest, 
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    mongo_service = MongoService(db)
    target_user = await mongo_service.get_user_by_id(req.target_id)
    if not target_user or not target_user.ai_profile or not target_user.ai_profile.bio:
        raise HTTPException(status_code=400, detail="Target user profile is incomplete")
    
    if not current_user.ai_profile or not current_user.ai_profile.bio:
        raise HTTPException(status_code=400, detail="Your profile is incomplete")

    ai_service = AIService()
    icebreakers = await ai_service.generate_icebreakers(
        current_user.ai_profile.bio, 
        target_user.ai_profile.bio
    )
    return {"icebreakers": icebreakers}

@router.post("/generate-astrology")
async def generate_astrology(
    req: AstrologyRequest,
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    ai_service = AIService()
    astrology_data = await ai_service.generate_astrology(req.dob, req.time, req.place)
    
    mongo_service = MongoService(db)
    # Save directly to user
    update_data = {
        "astrology": {
            "dob": req.dob,
            "time_of_birth": req.time,
            "place_of_birth": req.place,
            **astrology_data
        }
    }
    await mongo_service.update_user(str(current_user.id), update_data)
    
    return astrology_data

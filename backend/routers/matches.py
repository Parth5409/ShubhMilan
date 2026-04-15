from fastapi import APIRouter, Depends, HTTPException
from core.db import get_mongodb
from models.user import UserOut
from pydantic import BaseModel
from services.mongo_service import MongoService
from utils.deps import get_current_user
from typing import List, Optional

router = APIRouter(prefix="/matches", tags=["matches"])

class MatchQuery(BaseModel):
    q: Optional[str] = None
    raw: Optional[str] = None

@router.post("", response_model=List[UserOut])
async def get_matches(
    query: MatchQuery,
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    q = query.q or query.raw
    if q is None:
        raise HTTPException(status_code=400, detail="q or raw is required")
    
    mongo_service = MongoService(db)
    
    # Determine opposite gender if possible
    opposite_gender = None
    if current_user.basic_info and current_user.basic_info.gender:
        opposite_gender = "Female" if current_user.basic_info.gender == "Male" else "Male"
    
    # Use search_users with optional gender preference
    candidates = await mongo_service.search_users(
        exclude_id=str(current_user.id),
        query_str=q or "",
        gender_pref=opposite_gender,
        limit=50 # Fetch many to rank them
    )
    
    # Calculate compatibility for each and sort
    matches_with_score = []
    for user in candidates:
        user.compatibility = mongo_service.calculate_compatibility(current_user, user)
        matches_with_score.append(user)
    
    # Sort by compatibility descending
    matches_with_score.sort(key=lambda x: x.compatibility, reverse=True)
    
    # Limit to top 20 for UI
    return matches_with_score[:20]

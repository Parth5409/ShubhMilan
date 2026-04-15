from fastapi import APIRouter, Depends
from core.db import get_mongodb, get_chromadb
from models.user import UserOut
from services.mongo_service import MongoService
from services.vector_service import VectorService
from utils.deps import get_current_user
from typing import List

router = APIRouter(prefix="/matches", tags=["matches"])

@router.get("", response_model=List[UserOut])
async def get_matches(
    q: str, 
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb),
    chroma = Depends(get_chromadb)
):
    vector_service = VectorService(chroma)
    mongo_service = MongoService(db)
    
    # Optional opposite-gender filter
    gender_filter = None
    if current_user.basic_info:
        gender_filter = "Female" if current_user.basic_info.gender == "Male" else "Male"

    # Search in ChromaDB
    results = await vector_service.search_profiles(q, gender_filter=gender_filter)
    
    # Fetch full profiles from MongoDB
    matches = []
    for res in results:
        user = await mongo_service.get_user_by_id(res["user_id"])
        if user:
            # Inject compatibility score into a temporary field or just return the user list
            # Since UserOut doesn't have compatibility_score, we could return a different model
            # For simplicity, we just return the users for now.
            matches.append(user)
    
    return matches

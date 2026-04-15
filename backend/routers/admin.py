from fastapi import APIRouter, Depends, HTTPException, Query
from core.db import get_mongodb, get_chromadb
from models.user import UserOut
from services.mongo_service import MongoService
from services.vector_service import VectorService
from utils.deps import require_admin
from typing import List
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/pending-verifications", response_model=List[UserOut])
async def get_pending(
    admin: UserOut = Depends(require_admin), 
    db = Depends(get_mongodb)
):
    mongo_service = MongoService(db)
    return await mongo_service.get_pending_verifications()

@router.patch("/verify/{user_id}", response_model=UserOut)
async def verify_user(
    user_id: str,
    action: str = Query(..., regex="^(approve|reject)$"),
    admin: UserOut = Depends(require_admin),
    db = Depends(get_mongodb)
):
    mongo_service = MongoService(db)
    status = "verified" if action == "approve" else "rejected"
    
    update_data = {
        "verification": {
            "status": status,
            "reviewed_at": datetime.utcnow(),
            "reviewed_by_admin_id": str(admin.id)
        }
    }
    
    # Also update vector metadata if approved
    if action == "approve":
        # Note: In a real app we'd trigger vector update here, 
        # but ChromaDB metadata updates are slightly different. 
        # For demo, just updating Mongo is enough for the badge.
        pass

    return await mongo_service.update_user(user_id, update_data)

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    admin: UserOut = Depends(require_admin),
    db = Depends(get_mongodb),
    chroma = Depends(get_chromadb)
):
    mongo_service = MongoService(db)
    vector_service = VectorService(chroma)
    
    await mongo_service.delete_user(user_id)
    await vector_service.delete_profile(user_id)
    
    return {"status": "ok"}

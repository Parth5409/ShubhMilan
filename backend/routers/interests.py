from fastapi import APIRouter, Depends, HTTPException
from core.db import get_mongodb
from models.user import UserOut
from models.interest import InterestCreate, InterestOut
from services.mongo_service import MongoService
from utils.deps import get_current_user
from typing import List

router = APIRouter(prefix="/interests", tags=["interests"])

@router.post("", response_model=InterestOut)
async def send_interest(
    interest_in: InterestCreate,
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    mongo_service = MongoService(db)
    return await mongo_service.create_interest(str(current_user.id), interest_in)

@router.get("/sent", response_model=List[InterestOut])
async def get_sent_interests(
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    mongo_service = MongoService(db)
    return await mongo_service.get_sent_interests(str(current_user.id))

@router.get("/received", response_model=List[InterestOut])
async def get_received_interests(
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    mongo_service = MongoService(db)
    return await mongo_service.get_received_interests(str(current_user.id))

@router.patch("/{interest_id}", response_model=InterestOut)
async def respond_to_interest(
    interest_id: str, 
    status: str, # accepted | declined
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    if status not in ["accepted", "declined"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    mongo_service = MongoService(db)
    
    # Use service to get interest
    interest = await mongo_service.get_interest_by_id(interest_id)
    if not interest:
        raise HTTPException(status_code=404, detail="Interest not found")
        
    # Check if current user is the receiver
    if str(interest["receiver_id"]) != str(current_user.id):
        raise HTTPException(status_code=403, detail="You are not the receiver of this interest")
        
    return await mongo_service.update_interest_status(interest_id, status)

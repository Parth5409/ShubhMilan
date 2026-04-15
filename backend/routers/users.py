from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Form
from core.db import get_mongodb, get_chromadb
from core.config import settings
from models.user import UserOut, UserUpdate
from services.mongo_service import MongoService
from services.vector_service import VectorService
from utils.deps import get_current_user
import shutil
import os

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: str, db = Depends(get_mongodb)):
    mongo_service = MongoService(db)
    user = await mongo_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: str, 
    update_data: UserUpdate, 
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb),
    chroma = Depends(get_chromadb)
):
    if str(current_user.id) != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    mongo_service = MongoService(db)
    vector_service = VectorService(chroma)
    
    # Exclude unset fields from pydantic model to avoid overwriting with None
    data = update_data.model_dump(exclude_unset=True)
    
    # If bio is updated, trigger vector store update
    if "ai_profile" in data and data["ai_profile"].get("bio"):
        bio = data["ai_profile"]["bio"]
        # Fetch current user to get metadata for vector store
        user = await mongo_service.get_user_by_id(user_id)
        metadata = {
            "gender": user.basic_info.gender if user.basic_info else "Unknown",
            "city": user.basic_info.city if user.basic_info else "Unknown",
            "full_name": user.basic_info.full_name if user.basic_info else "Unknown"
        }
        await vector_service.upsert_profile(user_id, bio, metadata)
        data["ai_profile"]["vector_id"] = user_id # Using user_id as vector_id

    return await mongo_service.update_user(user_id, data)

@router.post("/upload-id")
async def upload_id(
    file: UploadFile = File(...),
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    os.makedirs(settings.STATIC_FILES_PATH + "/uploads", exist_ok=True)
    file_path = f"{settings.STATIC_FILES_PATH}/uploads/{current_user.id}_id.jpg"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    mongo_service = MongoService(db)
    verification_data = {
        "verification": {
            "status": "pending",
            "id_image_path": f"/static/uploads/{current_user.id}_id.jpg"
        }
    }
    return {"status": "ok", "path": verification_data["verification"]["id_image_path"]}

@router.post("/upload-photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: UserOut = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    # Ensure directory exists
    profiles_dir = f"{settings.STATIC_FILES_PATH}/uploads/profiles"
    os.makedirs(profiles_dir, exist_ok=True)
    
    # Generate filename using user ID and original extension
    ext = os.path.splitext(file.filename)[1]
    # Default to .jpg if no extension
    if not ext:
        ext = ".jpg"
    
    filename = f"{current_user.id}_profile{ext}"
    file_path = os.path.join(profiles_dir, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    relative_path = f"/static/uploads/profiles/{filename}"
    
    mongo_service = MongoService(db)
    await mongo_service.update_user(str(current_user.id), {"profile_photo_url": relative_path})
    
    return {"status": "ok", "url": relative_path}

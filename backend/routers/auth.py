from fastapi import APIRouter, Depends, HTTPException, status
from core.db import get_mongodb
from models.user import UserCreate, UserOut
from models.auth import Token, LoginRequest
from services.mongo_service import MongoService
from utils.auth import get_password_hash, verify_password, create_access_token
from utils.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate, db = Depends(get_mongodb)):
    mongo_service = MongoService(db)
    existing_user = await mongo_service.get_user_by_email(user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    user_dict = user_in.model_dump()
    user_dict["password_hash"] = get_password_hash(user_dict.pop("password"))
    return await mongo_service.create_user(user_dict)

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db = Depends(get_mongodb)):
    mongo_service = MongoService(db)
    user_doc = await mongo_service.get_user_with_password(login_data.email)
    
    if not user_doc or not verify_password(login_data.password, user_doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = UserOut(**user_doc)

    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def get_me(current_user: UserOut = Depends(get_current_user)):
    return current_user

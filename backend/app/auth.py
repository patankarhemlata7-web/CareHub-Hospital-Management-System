import os, hashlib
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET = os.getenv("JWT_SECRET", "change-this-secret")
ALGORITHM = "HS256"
security = HTTPBearer()

def legacy_sha1(value: str) -> str:
    return hashlib.sha1(value.encode()).hexdigest()

def create_token(subject: str, role: str):
    payload = {"sub": subject, "role": role, "exp": datetime.utcnow() + timedelta(hours=8)}
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)

def current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        return jwt.decode(credentials.credentials, SECRET, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

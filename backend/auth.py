# auth.py
from fastapi import HTTPException, Header, Depends
from typing import Optional
import jwt
import requests
import os
from dotenv import load_dotenv
from functools import lru_cache
import base64
import json

load_dotenv()

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_PUBLISHABLE_KEY = os.getenv("CLERK_PUBLISHABLE_KEY")

def get_clerk_frontend_api():
    """Extract frontend API from publishable key"""
    if not CLERK_PUBLISHABLE_KEY:
        raise ValueError("CLERK_PUBLISHABLE_KEY not configured")
    
    # Format: pk_test_xxxxx or pk_live_xxxxx
    # Decode the base64 part to get the domain
    try:
        # Extract the part after pk_test_ or pk_live_
        parts = CLERK_PUBLISHABLE_KEY.split('_')
        if len(parts) >= 3:
            # The encoded part is after pk_test_ or pk_live_
            encoded_part = '_'.join(parts[2:])
            # Decode base64
            decoded = base64.b64decode(encoded_part + '==').decode('utf-8')
            return decoded
    except:
        pass
    
    # Fallback: try to extract from the key directly
    # pk_test_Y2FwaXRhbC1ncm91cGVyLTkxLmNsZXJrLmFjY291bnRzLmRldiQ
    # Decodes to: capital-grouper-91.clerk.accounts.dev$
    return "capital-grouper-91.clerk.accounts.dev"

@lru_cache()
def get_clerk_jwks():
    """Fetch Clerk's public keys (cached)"""
    try:
        frontend_api = get_clerk_frontend_api()
        # Remove any trailing $ or special characters
        frontend_api = frontend_api.rstrip('$').strip()
        
        # Correct Clerk JWKS URL format
        jwks_url = f"https://{frontend_api}/.well-known/jwks.json"
        
        print(f"Fetching JWKS from: {jwks_url}")
        
        response = requests.get(jwks_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching JWKS: {e}")
        return None

def verify_clerk_token(token: str) -> dict:
    """Verify Clerk JWT token"""
    try:
        # Get JWKS
        jwks = get_clerk_jwks()
        if not jwks:
            raise HTTPException(status_code=500, detail="Unable to fetch JWKS")
        
        # Decode token header to get key ID
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        if not kid:
            raise HTTPException(status_code=401, detail="Token missing key ID")
        
        # Find the correct key
        signing_key = None
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                signing_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key))
                break
        
        if not signing_key:
            raise HTTPException(status_code=401, detail="Invalid token key")
        
        # Get frontend API for audience validation
        frontend_api = get_clerk_frontend_api().rstrip('$').strip()
        
        # Verify and decode token
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            options={
                "verify_exp": True,
                "verify_aud": False  # Clerk tokens don't always have aud
            }
        )
        
        return payload
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        print(f"Authentication error: {e}")
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Dependency to get current authenticated user"""
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )
    
    # Extract token from "Bearer <token>"
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication scheme"
            )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format"
        )
    
    # Verify token
    payload = verify_clerk_token(token)
    
    return {
        "user_id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name") or payload.get("full_name"),
        "email_verified": payload.get("email_verified", False)
    }

async def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    """Dependency to optionally get authenticated user (doesn't raise error if not authenticated)"""
    if not authorization:
        return None
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            return None
        
        payload = verify_clerk_token(token)
        return {
            "user_id": payload.get("sub"),
            "email": payload.get("email"),
            "name": payload.get("name") or payload.get("full_name")
        }
    except:
        return None
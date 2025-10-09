from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import os
from datetime import datetime
from typing import Optional

# Import our custom modules
from auth import get_current_user, get_optional_user
from database import mongodb, prediction_db, user_db

app = FastAPI(title="Dog Breed Predictor API", version="2.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "http://localhost:5173",  # Vite default
        "https://yourdomain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MODEL_PATH = "models/best_phaseB.keras"
BREED_INFO_PATH = "models/breed_info.json"
CLASS_INDICES_PATH = "models/class_indices.json"

# Global variables
model = None
breed_database = {}
class_names = []

def load_breed_database():
    """Load breed information from JSON file"""
    global breed_database
    try:
        with open(BREED_INFO_PATH, 'r', encoding='utf-8') as f:
            breed_database = json.load(f)
        print(f"✓ Loaded {len(breed_database)} breeds from database")
        return True
    except FileNotFoundError:
        print(f"✗ Warning: {BREED_INFO_PATH} not found")
        return False
    except json.JSONDecodeError as e:
        print(f"✗ Error parsing breed_info.json: {e}")
        return False

def load_class_indices():
    """Load class indices mapping"""
    global class_names
    try:
        with open(CLASS_INDICES_PATH, 'r', encoding='utf-8') as f:
            class_data = json.load(f)
        
        if isinstance(class_data, dict):
            class_names = [class_data[str(i)] for i in range(len(class_data))]
        elif isinstance(class_data, list):
            class_names = class_data
        
        print(f"✓ Loaded {len(class_names)} class names")
        return True
    except FileNotFoundError:
        print(f"✗ Warning: {CLASS_INDICES_PATH} not found")
        class_names = list(breed_database.keys())
        return False
    except Exception as e:
        print(f"✗ Error loading class indices: {e}")
        class_names = list(breed_database.keys())
        return False

def load_model():
    """Load the trained model"""
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
            print(f"✓ Model loaded successfully from {MODEL_PATH}")
            return True
        else:
            print(f"✗ Model file not found: {MODEL_PATH}")
            return False
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        return False

def preprocess_image(image_bytes):
    """Preprocess image for model prediction"""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        img = img.resize((224, 224))
        img_array = np.array(img, dtype=np.float32)
        img_array = tf.keras.applications.efficientnet_v2.preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}")

def normalize_breed_name(name):
    """Normalize breed name for consistent lookup"""
    return name.replace('_', ' ').replace('-', ' ').strip()

def get_breed_info(breed_name):
    """Get breed information from database"""
    normalized = normalize_breed_name(breed_name)
    
    for key in breed_database.keys():
        if normalize_breed_name(key).lower() == normalized.lower():
            return breed_database[key]
    
    return {
        "size": "Medium",
        "temperament": ["Friendly", "Intelligent"],
        "energy_level": "Moderate",
        "life_span": "10-15 years",
        "group": "Not specified",
        "good_with_kids": "Unknown",
        "good_with_pets": "Unknown",
        "trainability": "Moderate",
        "origin": "Unknown",
        "exercise_needs": "Moderate",
        "grooming_needs": "Moderate",
        "barking_tendency": "Moderate",
        "bred_for": "Companionship",
        "weight_range": "Unknown",
        "height_range": "Unknown",
        "coat_type": "Unknown",
        "colors": ["Various"],
        "mental_stimulation_needs": "Moderate",
        "prey_drive": "Moderate",
        "sensitivity_level": "Moderate",
        "daily_food_amount": "Unknown",
        "calorie_requirements": "Unknown"
    }

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("=" * 50)
    print("Dog Breed Predictor API - Starting")
    print("=" * 50)
    
    load_breed_database()
    load_class_indices()
    
    model_loaded = load_model()
    
    if not model_loaded:
        print("\n⚠ WARNING: Model not loaded. API will not work properly.")
        print(f"Please ensure model file exists at: {MODEL_PATH}\n")
    
    print("=" * 50)
    print("API is ready!")
    print("=" * 50)

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    mongodb.close()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Dog Breed Predictor API",
        "version": "2.0.0",
        "status": "running",
        "features": ["authentication", "mongodb", "prediction"]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "breeds_in_database": len(breed_database),
        "total_classes": len(class_names),
        "mongodb_connected": mongodb._client is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_optional_user)  # Changed to optional!
):
    """Predict dog breed from uploaded image (Now Public - Auth Optional)"""
    
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Server is not ready."
        )
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image (JPG, PNG, WebP)"
        )
    
    try:
        # Update user activity only if logged in
        if current_user:
            user_db.update_last_active(current_user["user_id"])
        
        # Read and preprocess image
        image_bytes = await file.read()
        processed_image = preprocess_image(image_bytes)
        
        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        predicted_idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_idx])
        
        # Get breed name
        if predicted_idx < len(class_names):
            breed_name = class_names[predicted_idx]
        else:
            breed_name = f"Unknown_Breed_{predicted_idx}"
        
        # Normalize breed name for display
        breed_display = normalize_breed_name(breed_name).title()
        
        # Get breed information
        breed_info = get_breed_info(breed_name)
        
        # Get top 3 predictions
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        top_predictions = []
        
        for idx in top_3_indices:
            if idx < len(class_names):
                top_breed = normalize_breed_name(class_names[idx]).title()
                top_predictions.append({
                    "breed": top_breed,
                    "confidence": float(predictions[0][idx]),
                    "percentage": round(float(predictions[0][idx]) * 100, 2)
                })
        
        # Save prediction to database only if user is logged in
        prediction_id = None
        if current_user:
            prediction_id = prediction_db.save_prediction(
                user_id=current_user["user_id"],
                breed=breed_display,
                confidence=confidence,
                image_name=file.filename
            )
        
        return {
            "success": True,
            "prediction_id": prediction_id,
            "prediction": {
                "breed": breed_display,
                "confidence": confidence,
                "percentage": round(confidence * 100, 2)
            },
            "top_predictions": top_predictions,
            "breed_info": breed_info,
            "timestamp": datetime.now().isoformat(),
            "authenticated": current_user is not None
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

@app.get("/history")
async def get_prediction_history(
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    """Get user's prediction history (Protected)"""
    try:
        predictions = prediction_db.get_user_predictions(
            user_id=current_user["user_id"],
            limit=limit
        )
        
        total_count = prediction_db.get_prediction_count(
            user_id=current_user["user_id"]
        )
        
        return {
            "success": True,
            "total_predictions": total_count,
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch history: {str(e)}"
        )

@app.get("/stats")
async def get_user_stats(current_user: dict = Depends(get_current_user)):
    """Get user statistics (Protected)"""
    try:
        breed_stats = prediction_db.get_breed_stats(current_user["user_id"])
        total_predictions = prediction_db.get_prediction_count(current_user["user_id"])
        
        return {
            "success": True,
            "total_predictions": total_predictions,
            "breed_statistics": breed_stats,
            "user_id": current_user["user_id"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch stats: {str(e)}"
        )

@app.get("/breeds")
async def get_breeds():
    """Get list of all supported breeds (Public)"""
    breeds_list = [normalize_breed_name(b).title() for b in class_names]
    return {
        "total": len(breeds_list),
        "breeds": sorted(breeds_list)
    }

@app.get("/breed/{breed_name}")
async def get_breed_details(breed_name: str):
    """Get detailed information about a specific breed (Public)"""
    breed_info = get_breed_info(breed_name)
    
    if breed_info.get("size") != "Medium":  # Not default
        return {
            "breed": normalize_breed_name(breed_name).title(),
            "info": breed_info
        }
    else:
        raise HTTPException(
            status_code=404,
            detail=f"No information available for {breed_name}"
        )

@app.post("/user/profile")
async def update_user_profile(current_user: dict = Depends(get_current_user)):
    """Create or update user profile (Protected)"""
    try:
        user_db.create_or_update_user(
            user_id=current_user["user_id"],
            email=current_user.get("email"),
            name=current_user.get("name")
        )
        
        return {
            "success": True,
            "message": "User profile updated",
            "user_id": current_user["user_id"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update profile: {str(e)}"
        )

@app.get("/user/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """Get user profile (Protected)"""
    try:
        user = user_db.get_user(current_user["user_id"])
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "success": True,
            "user": user
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch profile: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    import os

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
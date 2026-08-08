from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import numpy as np
import librosa
import tensorflow as tf
import uvicorn

app = FastAPI(
    title="EchoFactory API",
    description="Predictive maintenance for industrial pumps",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
model = None

def load_model():
    global model
    try:
        model_path = os.path.join(os.path.dirname(__file__), "models", "cnn_best.keras")
        model = tf.keras.models.load_model(model_path)
        print("✓ Model loaded successfully from " + model_path)
        return True
    except Exception as e:
        print("✗ Error loading model: " + str(e))
        raise

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
async def root():
    return {"message": "Hello from EchoFactory API!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    filename = file.filename.lower()
    if not file.content_type or not file.content_type.startswith("audio/"):
        if filename.endswith(".wav") or filename.endswith(".mp3"):
            file.content_type = "audio/wav" if filename.endswith(".wav") else "audio/mpeg"
        else:
            raise HTTPException(status_code=400, detail="File must be an audio file (WAV or MP3)")
    
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file (WAV or MP3)")
    
    try:
        contents = await file.read()
        
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum 10MB allowed.")
        
        if not (filename.endswith(".wav") or filename.endswith(".mp3")):
            raise HTTPException(status_code=400, detail="Only WAV and MP3 files are supported")
        
        temp_path = "temp_audio.wav"
        with open(temp_path, "wb") as f:
            f.write(contents)
        
        try:
            audio, sr = librosa.load(temp_path, sr=22050)
            
            if len(audio) < 22050 * 2:
                raise HTTPException(status_code=400, detail="Audio file too short. Minimum 2 seconds required.")
            
            mel_spectrogram = librosa.feature.melspectrogram(
                y=audio, sr=sr, n_mels=128, n_fft=2048, hop_length=512, fmin=100, fmax=5000
            )
            
            mel_spectrogram_db = librosa.power_to_db(mel_spectrogram, ref=np.max)
            
            if mel_spectrogram_db.shape[1] < 313:
                pad = np.zeros((mel_spectrogram_db.shape[0], 313 - mel_spectrogram_db.shape[1]), dtype=mel_spectrogram_db.dtype)
                mel_spectrogram_db = np.hstack([mel_spectrogram_db, pad])
            elif mel_spectrogram_db.shape[1] > 313:
                mel_spectrogram_db = mel_spectrogram_db[:, :313]
            
            mel_spectrogram_norm = (mel_spectrogram_db - mel_spectrogram_db.min()) / (mel_spectrogram_db.max() - mel_spectrogram_db.min() + 1e-8)
            processed = mel_spectrogram_norm[np.newaxis, ..., np.newaxis]
            
            prediction = model.predict(processed, verbose=0)
            probability = float(prediction[0][0])
            
            prediction_class = int(probability >= 0.5)
            
            confidence = min(probability * 100, 100) if prediction_class == 1 else min((1 - probability) * 100, 100)
            anomaly_score = probability
            
            return JSONResponse({
                "machine": "Pump",
                "prediction": "Abnormal" if prediction_class == 1 else "Normal",
                "confidence": round(confidence, 1),
                "anomaly_score": round(anomaly_score, 2)
            })
            
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error during prediction: " + str(e))

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

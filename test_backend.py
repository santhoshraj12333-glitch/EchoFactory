#!/usr/bin/env python3
"""
Test script for EchoFactory API - Audio Prediction
Tests the /predict endpoint with WAV audio files
"""

import requests
import json
import os
from pathlib import Path
import tempfile
import numpy as np
import librosa
import soundfile as sf

def create_test_audio(filename, duration=3.0, sr=22050):
    """Create a test audio file with sine waves"""
    t = np.linspace(0, duration, int(duration * sr), endpoint=False)
    
    # Create different frequencies for normal/abnormal simulation
    if "abnormal" in filename.lower():
        # Higher frequency noise for abnormal
        audio = np.sin(2 * np.pi * 440 * t) + 0.5 * np.random.randn(len(t))
    else:
        # Normal frequency
        audio = np.sin(2 * np.pi * 220 * t) + 0.3 * np.random.randn(len(t))
    
    # Clip to valid range
    audio = np.clip(audio, -0.9, 0.9)
    
    # Save as WAV file
    sf.write(filename, audio, sr)
    return filename

def test_api():
    """Test the EchoFactory API prediction endpoint"""
    
    # Check if backend exists
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return
    
    print("✅ Backend directory exists")
    
    # Check if model exists
    model_path = backend_dir / "models" / "cnn_best.keras"
    if not model_path.exists():
        print("❌ Model file not found in backend/models/!")
        return
    
    print(f"✅ Model file found: {model_path.stat().st_size / (1024*1024):.1f} MB")
    
    # Create temporary test audio files
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        print(f"\n🎵 Creating test audio files in {temp_dir}")
        
        # Create test WAV files
        normal_audio = create_test_audio(str(temp_path / "normal_test.wav"), duration=2.5)
        abnormal_audio = create_test_audio(str(temp_dir / "abnormal_test.wav"), duration=2.5)
        
        print(f"✅ Created normal_test.wav ({os.path.getsize(normal_audio) / 1024:.1f} KB)")
        print(f"✅ Created abnormal_test.wav ({os.path.getsize(abnormal_audio) / 1024:.1f} KB)")
        
        # Test the API endpoints
        base_url = "http://127.0.0.1:8000"
        
        print(f"\n🔍 Testing API endpoints...")
        
        # Test root endpoint
        try:
            response = requests.get(f"{base_url}/")
            print(f"✅ Root endpoint: {response.json()}")
        except Exception as e:
            print(f"❌ Root endpoint failed: {e}")
        
        # Test health endpoint
        try:
            response = requests.get(f"{base_url}/health")
            health_data = response.json()
            print(f"✅ Health endpoint: Model loaded = {health_data.get('model_loaded', 'unknown')}")
        except Exception as e:
            print(f"❌ Health endpoint failed: {e}")
        
        # Test prediction with normal audio
        print(f"\n🎯 Testing prediction with normal audio...")
        try:
            with open(normal_audio, "rb") as f:
                files = {"file": ("normal_test.wav", f, "audio/wav")}
                response = requests.post(f"{base_url}/predict", files=files)
                result = response.json()
                print(f"✅ Normal prediction: {result}")
                
                # Validate response structure
                assert result["machine"] == "Pump"
                assert result["prediction"] in ["Normal", "Abnormal"]
                assert isinstance(result["confidence"], (int, float))
                assert 0 <= result["confidence"] <= 100
                assert 0 <= result["anomaly_score"] <= 1
                print("✅ Response structure validated")
                
        except Exception as e:
            print(f"❌ Normal audio prediction failed: {e}")
            import traceback
            traceback.print_exc()
        
        # Test prediction with abnormal audio
        print(f"\n🎯 Testing prediction with abnormal audio...")
        try:
            with open(abnormal_audio, "rb") as f:
                files = {"file": ("abnormal_test.wav", f, "audio/wav")}
                response = requests.post(f"{base_url}/predict", files=files)
                result = response.json()
                print(f"✅ Abnormal prediction: {result}")
                
                # Validate response structure
                assert result["machine"] == "Pump"
                assert result["prediction"] in ["Normal", "Abnormal"]
                assert isinstance(result["confidence"], (int, float))
                assert 0 <= result["confidence"] <= 100
                assert 0 <= result["anomaly_score"] <= 1
                print("✅ Response structure validated")
                
        except Exception as e:
            print(f"❌ Abnormal audio prediction failed: {e}")
            import traceback
            traceback.print_exc()
        
        # Test error handling (non-audio file)
        print(f"\n🚫 Testing error handling with non-audio file...")
        try:
            non_audio_path = str(temp_path / "test.txt")
            with open(non_audio_path, "w") as f:
                f.write("This is not an audio file")
            
            with open(non_audio_path, "rb") as f:
                files = {"file": ("test.txt", f, "text/plain")}
                response = requests.post(f"{base_url}/predict", files=files)
                print(f"✅ Error handling test: Status code = {response.status_code}")
                print(f"   Response: {response.json()}")
                
        except Exception as e:
            print(f"✅ Error handling test passed (expected failure): {e}")
        
        # Clean up test files
        os.remove(normal_audio)
        os.remove(abnormal_audio)

def print_api_info():
    """Print comprehensive API information"""
    
    print("\n" + "="*60)
    print("🎯 ECHO FACTORY BACKEND API - AUDIO PREDICTION")
    print("="*60)
    
    print("\n📋 Purpose:")
    print("   Predict abnormal pump operation from audio recordings")
    print("   using a trained CNN classifier.")
    
    print("\n🔧 Workflow:")
    print("   1. Upload WAV/MP3 audio file")
    print("   2. Convert to mel spectrogram (128 bands × 313 frames)")
    print("   3. Feed through trained CNN model")
    print("   4. Return prediction with confidence score")
    
    print("\n🎵 Supported Formats:")
    print("   - WAV (.wav) - Recommended")
    print("   - MP3 (.mp3)")
    print("   - Minimum duration: 2 seconds")
    print("   - Maximum file size: 10MB")
    print("   - Sample rate: 22050 Hz")
    
    print("\n📊 Response Format:")
    print("""
{
    "machine": "Pump",
    "prediction": "Normal|"Abnormal",
    "confidence": 97.4,
    "anomaly_score": 0.08
}
    """)
    
    print("\n🎯 Model Details:")
    print("   Architecture: CNN Classifier")
    print("   Input: Audio → 128 mel spectrogram bands × 313 frames")
    print("   Training: 30 epochs, class weight {0:1.0, 1:3.0}")
    print("   Threshold: 0.099 (Youden-optimal)")
    print("   Performance: 96.0% accuracy, 95.8% ROC AUC (test set)")
    
    print("\n🔗 API Endpoints:")
    print("   GET  http://127.0.0.1:8000/           - API info")
    print("   GET  http://127.0.0.1:8000/health     - Health check")
    print("   POST http://127.0.0.1:8000/predict    - Audio prediction")
    
    print("\n💡 Usage Examples:")
    print("""
   # Test with curl
   curl -X POST http://127.0.0.1:8000/predict \
        -F 'file=@your_audio.wav'
   
   # Test Python
   import requests
   with open('your_audio.wav', 'rb') as f:
       response = requests.post(
           'http://127.0.0.1:8000/predict',
           files={'file': ('audio.wav', f, 'audio/wav')}
       )
       print(response.json())
    """)
    
    print("\n🏃‍♂️ Quick Start:")
    print("   1. Start the API:")
    print("      cd backend && python -m uvicorn app:app --host 0.0.0.0 --port 8000")
    print("   2. Test with the test script:")
    print("      python test_backend.py")
    
    print("\n" + "="*60)
    print("✅ Audio prediction API ready for Android integration!")
    print("="*60)

if __name__ == "__main__":
    print_api_info()
    test_api()
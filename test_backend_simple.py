#!/usr/bin/env python3
"""
Simple test for EchoFactory API - Audio Prediction
"""

import requests
import os
from pathlib import Path
import numpy as np
import soundfile as sf

def create_test_audio(filename, duration=3.0, sr=22050, is_abnormal=False):
    """Create a simple test audio file"""
    t = np.linspace(0, duration, int(duration * sr), endpoint=False)
    
    if is_abnormal:
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
    
    # Create test audio files
    print("Creating test audio files...")
    normal_audio = create_test_audio("test_normal.wav", duration=2.5, is_abnormal=False)
    abnormal_audio = create_test_audio("test_abnormal.wav", duration=2.5, is_abnormal=True)
    
    print(f"✅ Created normal_test.wav ({os.path.getsize(normal_audio) / 1024:.1f} KB)")
    print(f"✅ Created abnormal_test.wav ({os.path.getsize(abnormal_audio) / 1024:.1f} KB)")
    
    base_url = "http://127.0.0.1:8000"
    
    print(f"\n🔍 Testing API endpoints...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Root endpoint: {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
        return
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        health_data = response.json()
        print(f"✅ Health endpoint: Model loaded = {health_data.get('model_loaded', 'unknown')}")
    except Exception as e:
        print(f"❌ Health endpoint failed: {e}")
        return
    
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
        return
    
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
        return
    
    # Clean up test files
    os.remove(normal_audio)
    os.remove(abnormal_audio)
    
    print(f"\n✅ All tests passed!")

if __name__ == "__main__":
    print("Testing EchoFactory API - Audio Prediction")
    print("="*50)
    test_api()
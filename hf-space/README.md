---
title: EchoFactory API
emoji: 🔧
colorFrom: green
colorTo: emerald
sdk: docker
app_port: 7860
pinned: false
license: mit
short_description: Predictive maintenance CNN backend for industrial pumps
---

# EchoFactory API

FastAPI inference service for the EchoFactory predictive-maintenance dashboard.
Upload a WAV/MP3 and get `prediction`, `confidence`, `anomaly_score`, and the
real 128×313 mel spectrogram (base64 PNG).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness + model status |
| POST | `/predict` | Multipart `file` upload → prediction |
| GET | `/docs` | Interactive Swagger UI |

Model: 3×Conv CNN trained on MIMII pump sounds. Inference only — no training here.
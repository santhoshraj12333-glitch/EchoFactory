import axios from 'axios'

/**
 * API client base. The endpoint is configurable at build time via
 * VITE_API_BASE (see .env.development / .env.production) so the same
 * frontend can target a local backend, a LAN machine, or a hosted API.
 */
const baseURL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * GET /health — liveness + backend info.
 * Returns { status, model, threshold, ... } from FastAPI.
 */
export async function fetchHealth() {
  const { data } = await api.get('/health')
  return data
}

/**
 * POST /predict — multipart upload of an audio file.
 * field name is `file`.
 * Returns { machine, prediction, confidence, anomaly_score } from FastAPI.
 */
export async function predictAudio(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  })
  return data
}

import { useState, useEffect, useCallback } from 'react'
import { fetchHealth } from '../services/api.js'

/**
 * Tracks backend connection status by polling GET /health.
 * status: 'connecting' | 'online' | 'offline'
 */
export function useBackendConnection(intervalMs = 10000) {
  const [status, setStatus] = useState('connecting')
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)

  const check = useCallback(async () => {
    try {
      const data = await fetchHealth()
      setHealth(data)
      setStatus('online')
      setError(null)
    } catch (err) {
      setStatus('offline')
      setHealth(null)
      setError(err)
    }
  }, [])

  useEffect(() => {
    check()
    const id = setInterval(check, intervalMs)
    return () => clearInterval(id)
  }, [check, intervalMs])

  return { status, health, error, retry: check }
}
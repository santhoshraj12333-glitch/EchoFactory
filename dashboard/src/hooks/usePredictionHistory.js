import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'echofactory.history'

/**
 * Prediction history persisted in localStorage.
 * Each entry: { id, date, machine, prediction, confidence, anomaly_score, fileName }
 */
export function usePredictionHistory() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setEntries(raw ? JSON.parse(raw) : [])
    } catch {
      setEntries([])
    }
  }, [])

  const addEntry = useCallback((entry) => {
    setEntries((prev) => {
      const next = [
        {
          id: String(Date.now()),
          date: new Date().toISOString(),
          ...entry,
        },
        ...prev,
      ].slice(0, 50)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* storage may be unavailable — fail silently */
      }
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setEntries([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* noop */
    }
  }, [])

  return { entries, addEntry, clear }
}
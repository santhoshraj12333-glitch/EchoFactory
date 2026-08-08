export function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return '--:--'
  const s = Math.floor(seconds)
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`
}

export const ACCEPTED_TYPES = ['audio/wav', 'audio/wave', 'audio/mpeg', 'audio/mp3']

export function getAudioDuration(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null)
    const url = URL.createObjectURL(file)
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.onloadedmetadata = () => {
      resolve(audio.duration)
      URL.revokeObjectURL(url)
    }
    audio.onerror = () => {
      resolve(null)
      URL.revokeObjectURL(url)
    }
    audio.src = url
  })
}
import { useEffect, useRef, useState } from 'react'

/**
 * Draws a waveform of the provided audio File on a canvas.
 * Decodes the file via AudioContext (no playback) and renders peak bars.
 */
export default function Waveform({ file }) {
  const canvasRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!file) return
    let cancelled = false
    let ctx

    async function render() {
      try {
        const ctxAudio = new (window.AudioContext || window.webkitAudioContext)()
        const arrayBuffer = await file.arrayBuffer()
        const audioBuffer = await ctxAudio.decodeAudioData(arrayBuffer)
        ctxAudio.close()

        const canvas = canvasRef.current
        if (!canvas || cancelled) return
        ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        const { clientWidth: w, clientHeight: h } = canvas
        canvas.width = w * dpr
        canvas.height = h * dpr
        ctx.scale(dpr, dpr)

        const data = audioBuffer.getChannelData(0)
        const step = Math.ceil(data.length / w)
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = 'rgba(16,24,19,0.85)'

        for (let x = 0; x < w; x++) {
          let peak = 0
          for (let i = x * step; i < (x + 1) * step && i < data.length; i++) {
            const v = Math.abs(data[i])
            if (v > peak) peak = v
          }
          const barH = Math.max(2, peak * h)
          ctx.fillRect(x, (h - barH) / 2, 1, barH)
        }
      } catch {
        if (!cancelled) setError('Could not decode audio for waveform.')
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [file])

  return (
    <div className="rounded-card border border-brand-border bg-brand-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand-text">Waveform</h3>
        <span className="text-xs text-brand-muted">Amplitude over time</span>
      </div>
      <div className="h-28 w-full">
        {error ? (
          <p className="flex h-full items-center justify-center text-xs text-brand-warning">
            {error}
          </p>
        ) : (
          <canvas ref={canvasRef} className="h-full w-full" />
        )}
      </div>
    </div>
  )
}
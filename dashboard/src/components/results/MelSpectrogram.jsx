import { useEffect, useRef } from 'react'

/**
 * Placeholder mel spectrogram visualization.
 * The backend currently returns only scalar metrics (not the spectrogram),
 * so this renders a stylized placeholder until that data is exposed.
 */
export default function MelSpectrogram() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    // Deterministic pseudo-random rows so the "spectrogram" is stable per load
    let seed = 42
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    const bands = 24
    const bandH = h / bands
    ctx.clearRect(0, 0, w, h)
    for (let b = 0; b < bands; b++) {
      const t = b / bands
      const color = `rgba(6,182,212,${0.12 + t * 0.55})`
      ctx.fillStyle = color
      let x = 0
      while (x < w) {
        const segW = 4 + rnd() * 22
        const on = rnd() > 0.35
        if (on) ctx.fillRect(x, b * bandH, segW, bandH)
        x += segW
      }
    }
  }, [])

  return (
    <div className="rounded-card border border-brand-border bg-brand-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand-text">Mel Spectrogram</h3>
        <span className="text-xs text-brand-muted">128 mel bands · 22050 Hz</span>
      </div>
      <div className="h-28 w-full overflow-hidden rounded-lg bg-brand-surface">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </div>
  )
}
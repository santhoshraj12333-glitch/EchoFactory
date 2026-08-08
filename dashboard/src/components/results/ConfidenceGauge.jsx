import { useCountUp } from '../../hooks/useCountUp.js'

const SIZE = 160
const STROKE = 12
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ConfidenceGauge({ value = 0, size = SIZE }) {
  const display = useCountUp(value)
  const pct = Math.min(100, Math.max(0, value))
  const filled = (pct / 100) * CIRCUMFERENCE
  const color = pct >= 50 ? 'var(--color-brand-danger)' : 'var(--color-brand-success)'

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`Confidence ${pct.toFixed(1)} percent`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-brand-border)"
          strokeWidth={STROKE}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          style={{ transition: 'stroke-dasharray 0.2s linear, stroke 0.3s' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-brand-text">{display.toFixed(1)}%</span>
        <span className="mt-0.5 text-xs uppercase tracking-wider text-brand-muted">
          Confidence
        </span>
      </div>
    </div>
  )
}
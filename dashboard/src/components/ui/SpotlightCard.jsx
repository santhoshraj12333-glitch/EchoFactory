import { useEffect, useRef } from 'react'

export default function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--x', `${e.clientX - rect.left}px`)
      el.style.setProperty('--y', `${e.clientY - rect.top}px`)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-card border border-brand-border bg-brand-card transition-colors hover:border-brand-forest/40 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(600px circle at var(--x, 50%) var(--y, 0%), rgba(0,229,163,0.10), transparent 40%)',
        }}
      />
      {children}
    </div>
  )
}
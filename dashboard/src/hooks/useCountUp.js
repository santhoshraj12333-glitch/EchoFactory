import { useEffect, useState } from 'react'

/**
 * Renders a number that animates from 0 to `value` using rAF easing.
 */
export function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let raf
    const start = performance.now()
    const from = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (value - from) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return display
}
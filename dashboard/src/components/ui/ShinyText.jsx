/**
 * Shiny-text accent: a soft emerald sheen that sweeps across a heading.
 * Used sparingly (hero title) — never across the whole dashboard.
 */
export default function ShinyText({ text, className = '', disabled = false, speed = 6 }) {
  if (disabled) return <span className={className}>{text}</span>

  return (
    <span
      className={`shiny-text ${className}`}
      style={{ '--shiny-speed': `${speed}s` }}
    >
      {text}
    </span>
  )
}
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-brand-forest text-brand-on-forest hover:bg-brand-forest-soft',
    accent:
      'bg-brand-primary text-brand-forest hover:bg-brand-primary-strong',
    outline: 'border border-brand-border-strong text-brand-text hover:border-brand-text',
  }
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
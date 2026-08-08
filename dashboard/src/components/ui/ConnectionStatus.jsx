const STATUS_MAP = {
  connecting: { label: 'Connecting', dot: 'bg-brand-warning' },
  online: { label: 'Backend Connected', dot: 'bg-brand-success' },
  offline: { label: 'Backend Offline', dot: 'bg-brand-danger' },
}

export default function ConnectionStatus({ status }) {
  const meta = STATUS_MAP[status] || STATUS_MAP.connecting
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-card px-3.5 py-1.5 text-sm text-brand-muted">
      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}
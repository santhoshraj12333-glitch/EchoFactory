export default function ApiEndpoint({ method, path, description, response, children }) {
  const color =
    method === 'GET'
      ? 'bg-brand-success/15 text-brand-success'
      : 'bg-brand-primary/15 text-brand-forest'
  return (
    <article className="overflow-hidden rounded-card border border-brand-border bg-brand-card">
      <div className="flex items-center gap-3 border-b border-brand-border px-5 py-3.5">
        <span className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold ${color}`}>
          {method}
        </span>
        <code className="font-mono text-sm text-brand-text">{path}</code>
      </div>
      {description && (
        <div className="px-5 py-4 text-sm text-brand-muted">{description}</div>
      )}
      {children && (
        <div className="border-t border-brand-border bg-brand-surface px-5 py-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-brand-muted">
            Details
          </p>
          <div className="text-sm leading-relaxed text-brand-muted">{children}</div>
        </div>
      )}
      {response && (
        <div className="border-t border-brand-border bg-brand-surface px-5 py-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-brand-muted">
            Example response
          </p>
          <pre className="overflow-x-auto rounded-lg bg-brand-bg p-3 font-mono text-xs leading-relaxed text-brand-text">
            {response}
          </pre>
        </div>
      )}
    </article>
  )
}
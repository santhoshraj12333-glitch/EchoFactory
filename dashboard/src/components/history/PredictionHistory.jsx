import { motion } from 'framer-motion'
import { FiTrash2 } from 'react-icons/fi'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function PredictionHistory({ entries = [], onClear }) {
  if (!entries.length) return null

  return (
    <section className="mx-auto max-w-6xl px-2 py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-text">
            Prediction History
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Recent analyses stored on this device.
          </p>
        </div>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-muted transition-colors hover:border-brand-danger/50 hover:text-brand-danger"
        >
          <FiTrash2 /> Clear
        </button>
      </div>

      <div className="overflow-hidden rounded-card border border-brand-border bg-brand-card">
        <div className="grid grid-cols-2 gap-3 border-b border-brand-border bg-brand-surface px-5 py-3 text-xs font-medium uppercase tracking-wider text-brand-muted sm:grid-cols-5">
          <span>Date</span>
          <span className="hidden sm:block">File</span>
          <span>Machine</span>
          <span>Prediction</span>
          <span>Confidence</span>
        </div>
        <ul>
          {entries.map((entry, i) => {
            const abnormal = String(entry.prediction).toLowerCase() === 'abnormal'
            return (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="grid grid-cols-2 items-center gap-3 border-b border-brand-border/60 px-5 py-3 text-sm last:border-b-0 sm:grid-cols-5"
              >
                <span className="text-brand-muted">{formatDate(entry.date)}</span>
                <span className="hidden truncate text-brand-muted sm:block">
                  {entry.fileName || '—'}
                </span>
                <span className="font-medium text-brand-text">{entry.machine}</span>
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    abnormal
                      ? 'bg-brand-danger/15 text-brand-danger'
                      : 'bg-brand-success/15 text-brand-success'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${abnormal ? 'bg-brand-danger' : 'bg-brand-success'}`} />
                  {entry.prediction}
                </span>
                <span className="font-mono text-brand-text">
                  {Number(entry.confidence).toFixed(1)}%
                </span>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
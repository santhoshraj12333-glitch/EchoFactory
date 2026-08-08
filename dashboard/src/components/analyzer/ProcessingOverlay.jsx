import { motion } from 'framer-motion'

const STEPS = [
  'Uploading audio…',
  'Generating mel spectrogram…',
  'Running CNN…',
  'Generating prediction…',
]

export default function ProcessingSteps({ stepIndex }) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-brand-border bg-brand-card p-6 sm:p-8">
      <p className="text-sm font-semibold text-brand-text">Analyzing…</p>
      {STEPS.slice(0, stepIndex + 1).map((label, i) => {
        const done = i < stepIndex
        const current = i === stepIndex
        return (
          <div key={label} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                done
                  ? 'bg-brand-success text-white'
                  : 'border border-brand-border-strong text-brand-muted'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span
              className={current ? 'font-medium text-brand-text' : done ? 'text-brand-muted line-through' : 'text-brand-muted'}
            >
              {label}
            </span>
            {current && (
              <motion.span
                className="ml-1 flex items-center gap-1 text-brand-muted"
                aria-hidden
              >
                {[0, 1, 2].map((j) => (
                  <motion.span
                    key={j}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }}
                    className="h-1 w-1 rounded-full bg-brand-primary"
                  />
                ))}
              </motion.span>
            )}
          </div>
        )
      })}
    </div>
  )
}
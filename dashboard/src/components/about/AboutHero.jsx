import { motion } from 'framer-motion'

export default function AboutHero() {
  return (
    <section className="px-2 pt-6 sm:px-4">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-card bg-brand-forest">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-brand-primary/20 blur-[120px]"
        />
        <div className="relative flex flex-col items-center px-6 py-16 text-center sm:px-12 sm:py-20">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center rounded-full border border-brand-primary/30 bg-brand-forest-soft px-4 py-1 text-xs font-medium uppercase tracking-widest text-brand-primary"
          >
            About the project
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl"
          >
            Predictive maintenance, one waveform at a time
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-xl text-brand-on-forest/80"
          >
            Detecting machine anomalies from acoustic signal analysis, powered by a
            supervised CNN classifier.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
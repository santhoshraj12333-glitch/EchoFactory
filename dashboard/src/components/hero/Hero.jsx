import { motion } from 'framer-motion'
import { FiUpload, FiArrowRight } from 'react-icons/fi'
import Button from '../ui/Button.jsx'
import ShinyText from '../ui/ShinyText.jsx'

export default function Hero({ onUpload }) {
  return (
    <section className="px-2 pt-6 sm:px-4">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-card bg-brand-forest">
        {/* subtle emerald glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-brand-primary/20 blur-[120px]"
        />

        <div className="relative flex flex-col items-center px-6 py-16 text-center sm:px-12 sm:py-24">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center rounded-full border border-brand-primary/30 bg-brand-forest-soft px-4 py-1 text-xs font-medium uppercase tracking-widest text-brand-primary"
          >
            Acoustic Signal Analysis
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
          >
            <ShinyText text="EchoFactory" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-xl text-lg text-brand-on-forest/80"
          >
            AI Powered Predictive Maintenance using Acoustic Analysis
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Button variant="accent" onClick={onUpload}>
              <FiUpload /> Upload Audio
            </Button>
            <Button variant="outline" className="border-brand-on-forest/30 text-white hover:bg-white/5">
              Learn More <FiArrowRight />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
import { motion } from 'framer-motion'
import AboutHero from '../components/about/AboutHero.jsx'
import StatCard from '../components/about/StatCard.jsx'
import FadeContent from '../components/ui/FadeContent.jsx'

const STATS = [
  { label: 'Samples', value: '4,205' },
  { label: 'Test accuracy', value: '96.0%' },
  { label: 'ROC AUC', value: '0.958' },
  { label: 'Machines', value: '4' },
]

const VALUES = [
  {
    step: '01',
    title: 'Listen',
    text: 'Acoustic samples from industrial pumps expose mechanical faults before they escalate. We build the predictive-maintenance layer on top of that signal.',
  },
  {
    step: '02',
    title: 'Preprocess',
    text: 'Audio is converted to log-mel spectrograms — a compact time-frequency representation that a CNN can learn from — and normalized to a fixed input shape.',
  },
  {
    step: '03',
    title: 'Classify',
    text: 'A convolutional classifier distinguishes normal operation from anomalous behavior, returning confidence and an anomaly score for every prediction.',
  },
  {
    step: '04',
    title: 'Act',
    text: 'The spectrum, verdict and score are rendered in the dashboard so maintenance teams can inspect and act on what the model heard.',
  },
]

export default function About() {
  return (
    <>
      <AboutHero />
      <section className="mx-auto max-w-6xl py-12">
        <div className="grid gap-4 px-2 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <StatCard label={s.label} value={s.value} />
            </motion.div>
          ))}
        </div>

        <FadeContent className="px-2">
          <div className="mt-12 rounded-card border border-brand-border bg-brand-card p-8 sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-brand-text">
              From raw sound to a maintenance signal
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-brand-muted">
              EchoFactory applies deep learning to industrial acoustics. The trained
              model is served over a small FastAPI inference service; the dashboard
              uploads a recording, requests a prediction, and visualizes the exact
              spectrogram the model saw. Every prediction is explainable through that
              visual, and a local history keeps a running record of plant health.
            </p>
          </div>
        </FadeContent>

        <FadeContent className="mt-12 px-2">
          <h2 className="text-2xl font-bold tracking-tight text-brand-text">How it works</h2>
        </FadeContent>

        <div className="mt-6 grid gap-4 px-2 sm:grid-cols-2">
          {VALUES.map((v) => (
            <FadeContent key={v.step}>
              <div className="h-full rounded-card border border-brand-border bg-brand-card p-6">
                <span className="font-mono text-sm text-brand-forest">{v.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-brand-text">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{v.text}</p>
              </div>
            </FadeContent>
          ))}
        </div>
      </section>
    </>
  )
}
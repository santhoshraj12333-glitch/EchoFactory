import { SiReact, SiFastapi, SiTensorflow } from 'react-icons/si'

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <span className="text-sm font-semibold text-brand-text">EchoFactory</span>
          <span className="text-sm text-brand-muted">AI Predictive Maintenance Platform</span>
        </div>
        <div className="flex items-center gap-5 text-sm text-brand-muted">
          <span className="flex items-center gap-1.5">
            <SiReact className="h-4 w-4 text-brand-forest" /> React
          </span>
          <span className="flex items-center gap-1.5">
            <SiFastapi className="h-4 w-4 text-brand-success" /> FastAPI
          </span>
          <span className="flex items-center gap-1.5">
            <SiTensorflow className="h-4 w-4 text-brand-warning" /> TensorFlow
          </span>
        </div>
      </div>
    </footer>
  )
}
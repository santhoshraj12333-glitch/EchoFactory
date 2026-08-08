import { FiActivity, FiCheckCircle } from 'react-icons/fi'
import ConfidenceGauge from './ConfidenceGauge.jsx'
import RecommendationCard from './RecommendationCard.jsx'
import Waveform from './Waveform.jsx'
import MelSpectrogram from './MelSpectrogram.jsx'

export default function ResultsPanel({ result, file }) {
  const { prediction, machine, confidence, anomaly_score } = result
  const abnormal = prediction.toLowerCase() === 'abnormal'
  const conf = Number(confidence) || 0
  const score = Number(anomaly_score) || 0

  return (
    <div className="mx-auto mt-8 max-w-3xl px-2">
      <div className="mb-6 flex items-center justify-center">
        <p
          className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${
            abnormal ? 'text-brand-danger' : 'text-brand-success'
          }`}
        >
          <FiCheckCircle className="h-4 w-4" /> Analysis complete
        </p>
      </div>

      <div className="overflow-hidden rounded-card border border-brand-border bg-brand-card">
        {/* Status banner */}
        <div
          className={`flex flex-col items-center justify-between gap-3 border-b border-brand-border px-6 py-6 sm:flex-row ${
            abnormal ? 'bg-brand-danger/10' : 'bg-brand-success/10'
          }`}
        >
          <div className="flex items-center gap-4">
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                abnormal ? 'bg-brand-danger/20 text-brand-danger' : 'bg-brand-success/20 text-brand-success'
              }`}
            >
              <FiActivity className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
                Prediction
              </p>
              <p
                className={`mt-0.5 text-3xl font-bold ${
                  abnormal ? 'text-brand-danger' : 'text-brand-success'
                }`}
              >
                {abnormal ? 'ABNORMAL' : 'NORMAL'}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
              abnormal ? 'bg-brand-danger/15 text-brand-danger' : 'bg-brand-success/15 text-brand-success'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${abnormal ? 'bg-brand-danger' : 'bg-brand-success'}`} />
            {abnormal ? 'Anomaly detected' : 'Operating normally'}
          </span>
        </div>

        {/* Metrics */}
        <div className="flex flex-col gap-8 px-6 py-8 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
          <ConfidenceGauge value={conf} />
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
                Machine
              </p>
              <p className="mt-1 text-xl font-bold text-brand-text">{machine}</p>
            </div>
            <div className="w-full max-w-[180px]">
              <div className="mb-1 flex items-center justify-between text-xs text-brand-muted">
                <span>Anomaly score</span>
                <span className="font-mono font-medium text-brand-text">{score.toFixed(2)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-border">
                <div
                  className={`h-full rounded-full transition-all ${score >= 0.5 ? 'bg-brand-danger' : 'bg-brand-success'}`}
                  style={{ width: `${Math.min(100, score * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="border-t border-brand-border px-6 py-6">
          <RecommendationCard abnormal={abnormal} />
        </div>

        {/* Audio visualizations */}
        <div className="grid gap-4 border-t border-brand-border p-6 sm:grid-cols-2">
          <Waveform file={file} />
          <MelSpectrogram />
        </div>
      </div>
    </div>
  )
}
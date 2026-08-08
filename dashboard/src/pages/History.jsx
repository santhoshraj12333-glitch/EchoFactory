import PredictionHistory from '../components/history/PredictionHistory.jsx'
import { usePredictionHistory } from '../hooks/usePredictionHistory.js'

export default function History() {
  const { entries, clear } = usePredictionHistory()

  return (
    <div className="mx-auto max-w-6xl py-12">
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-brand-text">
            Prediction History
          </h1>
          <p className="mt-3 max-w-md text-brand-muted">
            No analyses yet. Run a prediction on the dashboard and it will appear here.
          </p>
        </div>
      ) : (
        <PredictionHistory entries={entries} onClear={clear} />
      )}
    </div>
  )
}
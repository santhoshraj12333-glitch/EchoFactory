import { useCallback, useEffect, useState } from 'react'
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import AudioDropzone from './AudioDropzone.jsx'
import ProcessingSteps from './ProcessingOverlay.jsx'
import Button from '../ui/Button.jsx'
import { predictAudio } from '../../services/api.js'

const PROCESS_STEPS = [
  'Uploading audio…',
  'Generating mel spectrogram…',
  'Running CNN…',
  'Generating prediction…',
]

export default function Analyzer({ machine }) {
  const [sourceFile, setSourceFile] = useState(null)
  const [fileInfo, setFileInfo] = useState({ duration: null, valid: false })
  const [analyzing, setAnalyzing] = useState(false)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const clearFile = useCallback(() => {
    setSourceFile(null)
    setFileInfo({ duration: null, valid: false })
    setResult(null)
    setError(null)
  }, [])

  const handleSelect = useCallback((file) => {
    setSourceFile(file)
    setResult(null)
    setError(null)
  }, [])

  // Drives the step indicator while the single HTTP request is in flight.
  useEffect(() => {
    if (!analyzing) return
    setStep(0)
    const timers = PROCESS_STEPS.slice(1).map((_, i) =>
      window.setTimeout(() => setStep(i + 1), (i + 1) * 900),
    )
    return () => timers.forEach(clearTimeout)
  }, [analyzing])

  const runAnalysis = async () => {
    if (!sourceFile || !fileInfo.valid || analyzing) return
    setAnalyzing(true)
    setError(null)
    setResult(null)
    setStep(0)
    try {
      const data = await predictAudio(sourceFile)
      setResult(data)
    } catch (err) {
      setError(
        err?.response?.data?.detail || err?.message || 'Prediction failed. Is the backend online?',
      )
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <section id="analyzer" className="mx-auto max-w-6xl py-12 scroll-mt-24">
      <div className="mb-6 px-2">
        <h2 className="text-2xl font-bold tracking-tight text-brand-text">Analyze Audio</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Upload a sample, then run the model. Machine:{' '}
          <span className="font-medium text-brand-forest">{machine}</span>.
        </p>
      </div>

      <div className="px-2">
        <AudioDropzone
          file={sourceFile}
          onSelect={handleSelect}
          onFileInfo={setFileInfo}
          disabled={analyzing}
        />
      </div>

      {sourceFile && !analyzing && (
        <div className="mt-6 flex flex-col items-center gap-3 px-2">
          <div className="flex items-center gap-3">
            <Button
              variant="accent"
              onClick={runAnalysis}
              disabled={!fileInfo.valid}
              className="px-8 text-base text-brand-forest disabled:pointer-events-none disabled:opacity-50"
            >
              Analyze Audio
            </Button>
            <Button variant="outline" onClick={clearFile}>
              Reset
            </Button>
          </div>
          {!fileInfo.valid && (
            <p className="text-xs text-brand-warning">
              File must be a WAV/MP3 between 2 seconds and 10 MB.
            </p>
          )}
        </div>
      )}

      {error && !analyzing && (
        <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 rounded-card border border-brand-danger/40 bg-brand-danger/5 px-4 py-3 text-sm text-brand-danger">
          <FiAlertCircle /> {error}
        </div>
      )}

      {analyzing && (
        <div className="mx-auto mt-6 max-w-xl px-2">
          <ProcessingSteps stepIndex={step} />
        </div>
      )}

      {result && !analyzing && <ResultDisplay result={result} />}
    </section>
  )
}

function ResultDisplay({ result }) {
  const { prediction, machine, confidence, anomaly_score } = result
  const abnormal = prediction.toLowerCase() === 'abnormal'
  const conf = Number(confidence) || 0
  const score = Number(anomaly_score) || 0

  return (
    <div className="mx-auto mt-8 px-2">
      <div className="mb-6 flex items-center justify-center">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-muted">
          <FiCheckCircle className="h-4 w-4 text-brand-success" /> Analysis complete
        </p>
      </div>

      <div className="mx-auto max-w-3xl overflow-hidden rounded-card border border-brand-border bg-brand-card">
        <div
          className={`flex items-center justify-between border-b border-brand-border px-6 py-4 ${
            abnormal ? 'bg-brand-danger/10' : 'bg-brand-success/10'
          }`}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">Prediction</p>
            <p className={`mt-0.5 text-3xl font-bold ${abnormal ? 'text-brand-danger' : 'text-brand-success'}`}>
              {abnormal ? 'ABNORMAL' : 'NORMAL'}
            </p>
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

        <div className="grid grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">Confidence</p>
            <p className="text-4xl font-bold text-brand-forest">{conf.toFixed(1)}%</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">Anomaly Score</p>
            <p className="text-4xl font-bold text-brand-text">{score.toFixed(2)}</p>
            <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-brand-border">
              <div
                className={`h-full rounded-full ${score >= 0.5 ? 'bg-brand-danger' : 'bg-brand-success'}`}
                style={{ width: `${Math.min(100, score * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">Machine</p>
            <p className="text-2xl font-bold text-brand-text">{machine}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
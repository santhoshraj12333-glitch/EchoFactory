import { useCallback, useEffect, useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import AudioDropzone from './AudioDropzone.jsx'
import ProcessingSteps from './ProcessingOverlay.jsx'
import ResultsPanel from '../results/ResultsPanel.jsx'
import Button from '../ui/Button.jsx'
import { predictAudio } from '../../services/api.js'
import { usePredictionHistory } from '../../hooks/usePredictionHistory.js'
import PredictionHistory from '../history/PredictionHistory.jsx'

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
  const { entries, addEntry, clear } = usePredictionHistory()

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
      addEntry({
        machine,
        prediction: data.prediction,
        confidence: data.confidence,
        anomaly_score: data.anomaly_score,
        fileName: sourceFile.name,
      })
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

      {result && !analyzing && <ResultsPanel result={result} file={sourceFile} />}

      {entries.length > 0 && (
        <div className="mt-12">
          <PredictionHistory entries={entries} onClear={clear} />
        </div>
      )}
    </section>
  )
}
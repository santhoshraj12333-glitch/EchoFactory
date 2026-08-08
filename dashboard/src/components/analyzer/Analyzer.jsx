import { useEffect, useState, useCallback } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import AudioDropzone from './AudioDropzone.jsx'
import AudioRecorder from './AudioRecorder.jsx'
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
  const [sourceFile, setSourceFile] = useState(null) // user-uploaded File
  const [recordedFile, setRecordedFile] = useState(null) // recorded File
  const [analyzing, setAnalyzing] = useState(false)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const clearRecording = useCallback(() => {
    setSourceFile(null)
    setRecordedFile(null)
    setResult(null)
    setError(null)
  }, [])

  useEffect(() => {
    setRecordedFile(null)
    setResult(null)
  }, [sourceFile])

  // Drives the step indicator while the single HTTP request is in flight.
  useEffect(() => {
    if (!analyzing) return
    setStep(0)
    const timers = PROCESS_STEPS.slice(1).map((_, i) =>
      window.setTimeout(() => setStep(i + 1), (i + 1) * 900),
    )
    return () => timers.forEach(clearTimeout)
  }, [analyzing])

  const activeFile = recordedFile || sourceFile

  const runAnalysis = async () => {
    if (!activeFile || analyzing) return
    setAnalyzing(true)
    setError(null)
    setResult(null)
    setStep(0)
    try {
      const data = await predictAudio(activeFile)
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
          Upload or record a sample, then run the model. Machine: <span className="font-medium text-brand-forest">{machine}</span>.
        </p>
      </div>

      <div className="grid gap-4 px-2 md:grid-cols-2">
        <AudioDropzone onSelect={setSourceFile} disabled={analyzing} />
        <AudioRecorder
          onResult={({ blob }) => setRecordedFile(new File([blob], 'recording.wav', { type: 'audio/wav' }))}
          disabled={analyzing}
        />
      </div>

      {activeFile && !analyzing && (
        <div className="mt-6 flex flex-col items-center gap-3 px-2">
          <div className="flex items-center gap-3">
            <Button variant="accent" onClick={runAnalysis} className="px-8 text-base">
              Analyze Audio
            </Button>
            <Button variant="outline" onClick={clearRecording}>
              Reset
            </Button>
          </div>
          <p className="text-xs text-brand-muted">
            {recordedFile ? 'Analysis will use your recording' : 'Analysis will use the uploaded file'}
          </p>
        </div>
      )}

      {error && !analyzing && (
        <p className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 px-2 text-sm text-brand-danger">
          <FiAlertCircle /> {error}
        </p>
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
  const abnormal = result?.prediction === 'ABNORMAL' || result?.prediction === 'abnormal'
  const confidence = Number(result?.confidence) || 0
  return (
    <div className="mx-auto mt-6 max-w-2xl px-2">
      <div
        className={`rounded-card border p-6 ${
          abnormal ? 'border-brand-danger/40 bg-brand-danger/5' : 'border-brand-success/40 bg-brand-success/5'
        }`}
      >
        <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
          Prediction
        </p>
        <p className={`mt-1 text-3xl font-bold ${abnormal ? 'text-brand-danger' : 'text-brand-success'}`}>
          {result?.prediction?.toUpperCase()}
        </p>
        <p className="mt-2 text-sm text-brand-muted">
          Confidence: <span className="font-mono font-medium text-brand-text">{confidence.toFixed(1)}%</span>
        </p>
      </div>
    </div>
  )
}
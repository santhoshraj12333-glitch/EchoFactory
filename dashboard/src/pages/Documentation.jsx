import ApiEndpoint from '../components/docs/ApiEndpoint.jsx'
import { apiBase } from '../services/api.js'
import FadeContent from '../components/ui/FadeContent.jsx'

const PIPELINE = [
  'Upload',
  'Mel preprocessing',
  '128 × 313 spectrogram',
  'CNN',
  'Prediction',
  'Confidence + score',
]

export default function Documentation() {
  return (
    <div className="mx-auto max-w-6xl py-12">
      <FadeContent className="px-2">
        <h1 className="text-3xl font-bold tracking-tight text-brand-text">Documentation</h1>
        <p className="mt-2 max-w-2xl text-brand-muted">
          How EchoFactory turns acoustic samples into a maintenance signal.
        </p>
      </FadeContent>

      {/* Pipeline */}
      <section className="mt-10 px-2">
        <h2 className="text-xl font-semibold tracking-tight text-brand-text">
          Inference Pipeline
        </h2>
        <p className="mt-1 text-sm text-brand-muted">
          The displayed spectrogram is the exact representation fed into the model —
          computed with the same parameters used during training.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {PIPELINE.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-brand-border bg-brand-card px-4 py-1.5 text-sm font-medium text-brand-text">
                {step}
              </span>
              {i < PIPELINE.length - 1 && (
                <span className="text-brand-forest">→</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* Preprocessing */}
      <section className="mt-12 px-2">
        <h2 className="text-xl font-semibold tracking-tight text-brand-text">
          Audio Preprocessing
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Sample rate', '22050 Hz'],
            ['Mel bands', '128'],
            ['Spectrogram frames', '313'],
            ['FFT / hop', '2048 / 512'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-card border border-brand-border bg-brand-card p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">{k}</p>
              <p className="mt-1 font-mono text-lg text-brand-text">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Model */}
      <section className="mt-10 px-2">
        <h2 className="text-xl font-semibold tracking-tight text-brand-text">Model</h2>
        <div className="mt-5 rounded-card border border-brand-border bg-brand-card p-6">
          <p className="text-sm leading-relaxed text-brand-muted">
            A convolutional classifier trained on the MIMII industrial sound dataset
            (4 pumps, 4205 samples). Three conv blocks{' '}
            <code className="rounded bg-brand-surface px-1.5 py-0.5 font-mono text-xs text-brand-text">
              32 → 64 → 128
            </code>{' '}
            (each with batch norm + max pooling), a flatten layer, a hidden
            <code className="rounded bg-brand-surface px-1.5 py-0.5 font-mono text-xs text-brand-text">
              Dense(128)
            </code>
            &nbsp;with dropout 0.5, and a sigmoid output. Test accuracy 0.96, ROC AUC 0.958.
          </p>
        </div>
      </section>

      {/* API */}
      <FadeContent className="mt-10 px-2">
        <h2 className="text-xl font-semibold tracking-tight text-brand-text">API Reference</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Backend base URL: <code className="font-mono text-brand-forest">{apiBase()}</code>
        </p>
      </FadeContent>

      <div className="mt-5 grid gap-4 px-2 lg:grid-cols-2">
        <ApiEndpoint
          method="GET"
          path="/health"
          description="Liveness probe — confirms the API is up and the model is loaded."
          response={`{ "status": "healthy", "model_loaded": true }`}
        />
        <ApiEndpoint
          method="GET"
          path="/"
          description="Friendly greeting from the EchoFactory API."
          response={`{ "message": "Hello from EchoFactory API!" }`}
        />
        <ApiEndpoint
          method="POST"
          path="/predict"
          description="Upload an audio file (WAV or MP3, 2 s minimum, max 10 MB) and receive a prediction."
          response={`{
  machine: "Pump",
  prediction: "Normal",
  confidence: 99.8,
  anomaly_score: 0.0,
  spectrogram_b64: "<PNG>"
}`}
        >
          <p>
            Multipart upload, field name <code className="font-mono text-xs">file</code>.
            The response includes the real 128 × 313 mel spectrogram as a base64 PNG
            for client-side rendering.
          </p>
        </ApiEndpoint>
      </div>
    </div>
  )
}
import { FiBarChart2 } from 'react-icons/fi'

/**
 * Renders the real 128x313 mel spectrogram returned by the backend as a
 * base64 PNG image — the exact representation fed into the CNN, computed
 * with the same preprocessing parameters used during training.
 */
export default function MelSpectrogram({ spectrogramB64 }) {
  const hasImage = Boolean(spectrogramB64)

  return (
    <div className="rounded-card border border-brand-border bg-brand-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand-text">Mel Spectrogram</h3>
        <span className="text-xs text-brand-muted">128 mel bands · 22050 Hz</span>
      </div>
      <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-lg border border-brand-border bg-black/20">
        {hasImage ? (
          <img
            src={`data:image/png;base64,${spectrogramB64}`}
            alt="Real mel spectrogram of the analyzed audio"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-xs text-brand-muted">
            <FiBarChart2 className="h-5 w-5 opacity-60" />
            Spectrogram unavailable
          </span>
        )}
      </div>
    </div>
  )
}
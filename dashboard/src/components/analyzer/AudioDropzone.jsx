import { useEffect, useRef, useState } from 'react'
import { FiUpload, FiTrash2 } from 'react-icons/fi'
import { getAudioDuration, formatBytes, formatDuration, ACCEPTED_TYPES } from '../../utils/audio.js'

/**
 * Drag & drop upload area. Exposes the selected File to the parent via onSelect
 * and reports measured duration + basic validity via onFileInfo so the parent
 * can gate the Analyze button.
 */
export default function AudioDropzone({ file, onSelect, onFileInfo, disabled }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [duration, setDuration] = useState(null)

  useEffect(() => {
    if (!file) {
      setDuration(null)
      onFileInfo?.({ duration: null, valid: false })
      return
    }
    let active = true
    getAudioDuration(file).then((d) => {
      if (!active) return
      setDuration(d)
      onFileInfo?.({ duration: d, valid: validateFile(file, d) })
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const handleFiles = (files) => {
    const f = files && files[0]
    if (f) onSelect(f)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload audio file"
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={[
        'relative flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed px-6 py-12 text-center transition-colors',
        dragging
          ? 'border-brand-forest bg-brand-surface'
          : 'border-brand-border-strong bg-brand-card hover:border-brand-forest/50',
        disabled && 'pointer-events-none opacity-50',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {!file ? (
        <>
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-surface text-brand-forest">
            <FiUpload className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-brand-text">
            Drag &amp; drop an audio file
          </p>
          <p className="mt-1 text-sm text-brand-muted">or click to browse</p>
          <p className="mt-4 text-xs text-brand-muted">
            WAV or MP3 · min 2 seconds · max 10 MB
          </p>
        </>
      ) : (
        <div className="flex w-full max-w-sm flex-col items-start gap-3 text-left">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-brand-text">{file.name}</p>
              <p className="mt-1 text-xs text-brand-muted">
                {formatBytes(file.size)} · {duration ? formatDuration(duration) : 'measuring…'}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelect(null)
              }}
              className="shrink-0 rounded-full p-1.5 text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-danger"
              aria-label="Remove file"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/** Mirrors backend constraints: audio type, max 10MB, min 2s. */
function validateFile(file, duration) {
  if (!file) return false
  const name = file.name.toLowerCase()
  const isAudio = file.type.startsWith('audio/') && (name.endsWith('.wav') || name.endsWith('.mp3'))
  const isSized = file.size <= 10 * 1024 * 1024
  const isLongEnough = duration == null || duration >= 2
  return isAudio && isSized && isLongEnough
}

import { useRef, useState, useCallback } from 'react'
import { FiMic, FiSquare } from 'react-icons/fi'
import { encodeWav } from '../../utils/wav.js'
import { formatDuration } from '../../utils/audio.js'

/**
 * Functional microphone recorder.
 * Captures PCM via AudioContext and re-encodes into a real WAV Blob, then
 * returns it via onResult({ blob, file }) for upload to /predict.
 */
export default function AudioRecorder({ onResult, onStatus, disabled }) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)

  const ctxRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const stop = useCallback(() => {
    clearInterval(timerRef.current)
    const stream = streamRef.current
    stream?.getTracks().forEach((t) => t.stop())
    streamRef.current = null

    const ctx = ctxRef.current
    if (!ctx) return
    ctxRef.current = null

    // Wait a tick so the last processor node flushes
    setTimeout(() => {
      const samples = chunksRef.current.flat()
      chunksRef.current = []
      const sampleRate = ctx.sampleRate
      ctx.close()
      if (samples.length > 0) {
        const blob = encodeWav(Float32Array.from(samples), sampleRate)
        onResult?.({
          blob,
          duration: samples.length / sampleRate,
          sampleRate,
        })
      }
    }, 80)
  }, [onResult])

  const start = useCallback(async () => {
    if (disabled) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const processor = ctx.createScriptProcessor(4096, 1, 1)

      chunksRef.current = []
      processor.onaudioprocess = (e) => {
        chunksRef.current.push(Array.from(e.inputBuffer.getChannelData(0)))
      }

      source.connect(processor)
      processor.connect(ctx.destination)

      ctxRef.current = ctx
      streamRef.current = stream
      setRecording(true)
      setSeconds(0)
      onStatus?.('recording')
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch (err) {
      onStatus?.('error')
      console.error('Microphone access denied:', err)
    }
  }, [disabled, onStatus])

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-card border-2 border-dashed px-6 py-12 text-center ${
        disabled && !recording
          ? 'pointer-events-none opacity-50'
          : 'border-brand-border-strong bg-brand-card'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {recording && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand-danger/25" />
          )}
          <button
            type="button"
            onClick={recording ? stop : start}
            className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
              recording
                ? 'bg-brand-danger text-white'
                : 'bg-brand-forest text-brand-primary hover:bg-brand-forest-soft'
            }`}
            aria-label={recording ? 'Stop recording' : 'Start recording'}
          >
            {recording ? (
              <FiSquare className="h-6 w-6" />
            ) : (
              <FiMic className="h-7 w-7" />
            )}
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-brand-text">
            {recording ? 'Recording…' : 'Record Audio'}
          </p>
          <p className="flex items-center gap-2 font-mono text-2xl font-medium text-brand-forest">
            {recording && <span className="animate-pulse text-brand-danger">●</span>}
            {formatDuration(seconds)}
          </p>
        </div>

        <p className="text-xs text-brand-muted">
          {recording ? 'Click stop when finished' : 'Requires microphone permission · min 2s'}
        </p>
      </div>
    </div>
  )
}
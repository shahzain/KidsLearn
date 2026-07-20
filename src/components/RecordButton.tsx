import type { MouseEvent } from 'react'
import { useHasRecording, saveRecording, deleteRecording } from '../lib/recordings'
import { useRecorder } from '../hooks/useRecorder'

interface Props {
  itemId: string
  accent: string
}

/**
 * Grown-up control (top-right of a card) to record your own voice for this
 * word. Tap to record, tap again to stop & save; a saved clip plays instead of
 * the synthesized voice. Hidden on devices without microphone recording.
 */
export function RecordButton({ itemId, accent }: Props) {
  const has = useHasRecording(itemId)
  const { recording, start, stop, supported } = useRecorder()

  if (!supported) return null

  const handleToggle = async (e: MouseEvent) => {
    e.stopPropagation()
    if (recording) {
      const blob = await stop()
      if (blob) await saveRecording(itemId, blob)
    } else {
      try {
        await start()
      } catch {
        /* microphone permission denied — nothing to do */
      }
    }
  }

  const handleClear = async (e: MouseEvent) => {
    e.stopPropagation()
    await deleteRecording(itemId)
  }

  return (
    <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
      {has && !recording && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Delete recording"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-lg text-slate-500 shadow-soft"
        >
          <span aria-hidden="true">✕</span>
        </button>
      )}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={
          recording
            ? 'Stop and save recording'
            : has
              ? 'Re-record your voice'
              : 'Record your voice'
        }
        className={`relative flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-soft transition ${
          recording ? 'animate-pulse' : 'active:scale-95'
        }`}
        style={{
          background: recording ? '#EF4444' : 'rgba(255,255,255,0.9)',
          color: recording ? '#ffffff' : accent,
        }}
      >
        <span aria-hidden="true">{recording ? '⏹️' : '🎙️'}</span>
        {has && !recording && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"
          />
        )}
      </button>
    </div>
  )
}

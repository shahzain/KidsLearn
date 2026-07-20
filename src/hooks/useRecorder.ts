import { useCallback, useEffect, useRef, useState } from 'react'

/** Minimal microphone recorder built on MediaRecorder. */
export function useRecorder() {
  const supported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined'

  const [recording, setRecording] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    recorderRef.current = null
  }, [])

  const start = useCallback(async () => {
    if (!supported || recorderRef.current) return
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream
    const recorder = new MediaRecorder(stream)
    chunksRef.current = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorderRef.current = recorder
    recorder.start()
    setRecording(true)
  }, [supported])

  /** Stop recording and resolve with the captured audio Blob (or null). */
  const stop = useCallback(() => {
    return new Promise<Blob | null>((resolve) => {
      const recorder = recorderRef.current
      if (!recorder) {
        resolve(null)
        return
      }
      recorder.onstop = () => {
        const blob = chunksRef.current.length
          ? new Blob(chunksRef.current, {
              type: recorder.mimeType || 'audio/webm',
            })
          : null
        cleanup()
        setRecording(false)
        resolve(blob)
      }
      recorder.stop()
    })
  }, [cleanup])

  // Release the mic if the component unmounts mid-recording.
  useEffect(() => cleanup, [cleanup])

  return { recording, start, stop, supported }
}

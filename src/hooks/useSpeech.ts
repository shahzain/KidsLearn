import { useCallback, useEffect, useRef } from 'react'
import { Howl } from 'howler'

interface SpeakOptions {
  /** Optional CC0 sound-effect file to layer under the spoken word (Howler.js). */
  soundUrl?: string
  rate?: number
  pitch?: number
}

// A bright, cheerful delivery (higher pitch than the flat default voice).
const DEFAULT_RATE = 1
const DEFAULT_PITCH = 1.3
// Silence inserted between spoken phrases, e.g. "A" ⟶ (1s) ⟶ "A is for Apple".
const SEGMENT_PAUSE_MS = 1000
// Short beat between saying an animal's name and playing its real recorded sound.
const SOUND_DELAY_MS = 500

// Well-known cheerful female English voices, in order of preference. Covers
// iOS/macOS (Samantha…), Chrome (Google…) and Windows/Edge (Microsoft…).
const FEMALE_VOICE_HINTS = [
  'Samantha',
  'Ava',
  'Allison',
  'Susan',
  'Karen',
  'Moira',
  'Tessa',
  'Fiona',
  'Victoria',
  'Google US English',
  'Google UK English Female',
  'Microsoft Aria',
  'Microsoft Jenny',
  'Microsoft Michelle',
  'Microsoft Zira',
  'Microsoft Hazel',
  'Zoe',
  'Nicky',
]

/** Choose the most cheerful female English voice available on this device. */
function pickFemaleVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  const pool = english.length ? english : voices
  for (const hint of FEMALE_VOICE_HINTS) {
    const needle = hint.toLowerCase()
    const match = pool.find((v) => v.name.toLowerCase().includes(needle))
    if (match) return match
  }
  const female = pool.find((v) => /female|woman/i.test(v.name))
  if (female) return female
  return pool.find((v) => v.localService) ?? english[0] ?? voices[0] ?? null
}

/**
 * Web Speech API (SpeechSynthesis) wrapper tuned for toddlers: a cheerful
 * female voice, an optional Howler.js sound-effect layer, an iOS audio-unlock
 * helper, and multi-phrase speech with a pause between phrases.
 *
 * iOS Safari blocks speech until it has been triggered once from inside a
 * user gesture — call {@link unlock} from a tap handler (e.g. opening a
 * category) so later snap-scroll auto-speech is allowed.
 */
export function useSpeech() {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window

  const synthRef = useRef<SpeechSynthesis | null>(
    supported ? window.speechSynthesis : null,
  )
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const unlockedRef = useRef(false)
  const soundCache = useRef<Map<string, Howl>>(new Map())
  const currentSoundRef = useRef<Howl | null>(null)
  const pauseTimerRef = useRef<number | null>(null)
  // Bumped on every new speak()/cancel() so stale onend callbacks bail out.
  const speakIdRef = useRef(0)

  // Pick a cheerful female English voice (updates when voices load async).
  useEffect(() => {
    if (!supported) return
    const synth = synthRef.current
    if (!synth) return
    const pick = () => {
      const voices = synth.getVoices()
      if (!voices.length) return
      voiceRef.current = pickFemaleVoice(voices)
    }
    pick()
    synth.addEventListener?.('voiceschanged', pick)
    return () => synth.removeEventListener?.('voiceschanged', pick)
  }, [supported])

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current)
      pauseTimerRef.current = null
    }
  }, [])

  /** Stop the animal/bird sound that is currently playing (if any). */
  const stopSound = useCallback(() => {
    if (currentSoundRef.current) {
      currentSoundRef.current.stop()
      currentSoundRef.current = null
    }
  }, [])

  /** Prime iOS audio. Must be called synchronously from a user gesture. */
  const unlock = useCallback(() => {
    if (unlockedRef.current || !supported) return
    const synth = synthRef.current
    if (!synth) return
    unlockedRef.current = true
    // A silent (empty) utterance warms up SpeechSynthesis on iOS Safari.
    const warm = new SpeechSynthesisUtterance('')
    synth.cancel()
    synth.resume()
    synth.speak(warm)
  }, [supported])

  const playSound = useCallback((url: string) => {
    // Resolve root-relative paths against the app base (e.g. GitHub Pages subpath).
    const src = url.startsWith('/')
      ? `${import.meta.env.BASE_URL}${url.slice(1)}`
      : url
    // Stop whatever is currently playing so sounds never overlap.
    if (currentSoundRef.current) currentSoundRef.current.stop()
    let sound = soundCache.current.get(src)
    if (!sound) {
      sound = new Howl({ src: [src], preload: true, volume: 1 })
      // Missing/broken files are non-fatal — the name has already been spoken.
      sound.on('loaderror', () => {})
      soundCache.current.set(src, sound)
    }
    const current = sound
    currentSoundRef.current = current
    current.play()
    // If autoplay is momentarily locked, retry once the audio context unlocks.
    current.once('playerror', () => {
      current.once('unlock', () => {
        if (currentSoundRef.current === current) current.play()
      })
    })
  }, [])

  const buildUtterance = useCallback(
    (text: string, options: SpeakOptions) => {
      const utterance = new SpeechSynthesisUtterance(text)
      if (voiceRef.current) {
        utterance.voice = voiceRef.current
        utterance.lang = voiceRef.current.lang
      } else {
        utterance.lang = 'en-US'
      }
      utterance.rate = options.rate ?? DEFAULT_RATE
      utterance.pitch = options.pitch ?? DEFAULT_PITCH
      utterance.volume = 1
      return utterance
    },
    [],
  )

  /**
   * Speak a name/phrase (or a list of phrases with pauses between), then — for
   * animals & birds — play the real recorded sound just after the last phrase.
   */
  const speak = useCallback(
    (text: string | string[], options: SpeakOptions = {}) => {
      const runId = ++speakIdRef.current
      clearPauseTimer()
      stopSound()

      const segments = (Array.isArray(text) ? text : [text])
        .map((s) => s.trim())
        .filter(Boolean)

      const playSoundIfCurrent = () => {
        if (options.soundUrl && speakIdRef.current === runId) {
          playSound(options.soundUrl)
        }
      }

      const synth = synthRef.current
      // No speech engine (or nothing to say) → just play the real sound.
      if (!supported || !synth || !segments.length) {
        playSoundIfCurrent()
        return
      }

      synth.cancel()
      synth.resume()

      const speakFrom = (index: number) => {
        if (speakIdRef.current !== runId) return
        const utterance = buildUtterance(segments[index], options)
        utterance.onend = () => {
          if (speakIdRef.current !== runId) return
          if (index + 1 < segments.length) {
            pauseTimerRef.current = window.setTimeout(
              () => speakFrom(index + 1),
              SEGMENT_PAUSE_MS,
            )
          } else if (options.soundUrl) {
            // After the final phrase, play the real animal/bird sound.
            pauseTimerRef.current = window.setTimeout(
              playSoundIfCurrent,
              SOUND_DELAY_MS,
            )
          }
        }
        synth.speak(utterance)
      }
      speakFrom(0)
    },
    [supported, playSound, clearPauseTimer, stopSound, buildUtterance],
  )

  const cancel = useCallback(() => {
    speakIdRef.current++
    clearPauseTimer()
    stopSound()
    if (supported) synthRef.current?.cancel()
  }, [supported, clearPauseTimer, stopSound])

  return { speak, cancel, unlock, supported }
}

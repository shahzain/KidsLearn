import { useCallback, useEffect, useRef } from 'react'
import { Howl } from 'howler'

interface SpeakOptions {
  /** Optional sound-effect file to play after the words (Howler.js). */
  soundUrl?: string
  /** BCP-47 language for the text, e.g. 'ur-PK'. Defaults to English. */
  lang?: string
  /** Romanised phrases spoken with an English voice when no {@link lang} voice exists. */
  roman?: string[]
  rate?: number
  pitch?: number
}

// Gentle, warm, cheerful delivery — a touch slow and softly bright, not chirpy.
const DEFAULT_RATE = 0.9
const DEFAULT_PITCH = 1.12
const SEGMENT_PAUSE_MS = 1000
const SOUND_DELAY_MS = 500

// Natural / neural voices sound the most human.
const NATURAL_MARKERS = [
  'natural',
  'neural',
  'online',
  'premium',
  'enhanced',
  'siri',
  'google',
]

// Known FEMALE voice names across iOS/macOS, Chrome and Edge/Windows.
const FEMALE_NAMES = [
  'samantha',
  'ava',
  'allison',
  'susan',
  'zoe',
  'nicky',
  'serena',
  'karen',
  'moira',
  'tessa',
  'fiona',
  'victoria',
  'kate',
  'stephanie',
  'aria',
  'jenny',
  'emma',
  'michelle',
  'clara',
  'libby',
  'sonia',
  'zira',
  'hazel',
  'catherine',
  'nora',
  'joanna',
  'salli',
  'kimberly',
  'amy',
  'woman',
  'female',
  'google us english',
  'google uk english female',
]

// Known MALE voice names to strongly avoid (so we never pick a male voice).
const MALE_NAMES = [
  'david',
  'mark',
  'guy',
  'daniel',
  'alex',
  'fred',
  'george',
  'james',
  'aaron',
  'arthur',
  'gordon',
  'oliver',
  'rishi',
  'ryan',
  'thomas',
  'william',
  'eddy',
  'reed',
  'rocko',
  'albert',
  'bruce',
  'ralph',
  'google uk english male',
]

const isFemaleName = (name: string) => FEMALE_NAMES.some((n) => name.includes(n))
const isMaleName = (name: string) => MALE_NAMES.some((n) => name.includes(n))

function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase()
  let score = 0
  // A cheerful FEMALE voice is the top priority for this app.
  if (isFemaleName(name)) score += 1000
  else if (isMaleName(name)) score -= 1000
  // Then prefer natural / neural (human-sounding) voices.
  if (NATURAL_MARKERS.some((m) => name.includes(m))) score += 100
  const idx = FEMALE_NAMES.findIndex((n) => name.includes(n))
  if (idx >= 0) score += 60 - idx
  if (v.localService) score += 4
  return score
}

function bestOf(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null
  return voices.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? null
}

/** Best voice for a language; Urdu falls back to an Arabic-script reader. */
function pickVoiceForLang(
  voices: SpeechSynthesisVoice[],
  lang: string,
): SpeechSynthesisVoice | null {
  const prefix = lang.slice(0, 2).toLowerCase()
  const exact = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix))
  if (exact.length) return bestOf(exact)
  if (prefix === 'ur') {
    const arabic = voices.filter((v) => v.lang.toLowerCase().startsWith('ar'))
    if (arabic.length) return bestOf(arabic)
  }
  return null
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
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const enVoiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const unlockedRef = useRef(false)
  const soundCache = useRef<Map<string, Howl>>(new Map())
  const currentSoundRef = useRef<Howl | null>(null)
  const pauseTimerRef = useRef<number | null>(null)
  // Bumped on every new speak()/cancel() so stale onend callbacks bail out.
  const speakIdRef = useRef(0)

  // Load voices + pick the best English voice (updates when voices load async).
  useEffect(() => {
    if (!supported) return
    const synth = synthRef.current
    if (!synth) return
    const refresh = () => {
      const voices = synth.getVoices()
      if (!voices.length) return
      voicesRef.current = voices
      enVoiceRef.current =
        bestOf(voices.filter((v) => v.lang.toLowerCase().startsWith('en'))) ??
        bestOf(voices)
    }
    refresh()
    synth.addEventListener?.('voiceschanged', refresh)
    return () => synth.removeEventListener?.('voiceschanged', refresh)
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

  /**
   * Speak a phrase (or list of phrases with pauses between) in the item's
   * language, then — when given — play a real recorded sound after the words.
   * Non-English text falls back to its romanised form on an English voice when
   * no matching-language voice is installed on the device.
   */
  const speak = useCallback(
    (text: string | string[], options: SpeakOptions = {}) => {
      const runId = ++speakIdRef.current
      clearPauseTimer()
      stopSound()

      const native = (Array.isArray(text) ? text : [text])
        .map((s) => s.trim())
        .filter(Boolean)

      const playSoundIfCurrent = () => {
        if (options.soundUrl && speakIdRef.current === runId) {
          playSound(options.soundUrl)
        }
      }

      const synth = synthRef.current
      if (!supported || !synth) {
        playSoundIfCurrent()
        return
      }

      // Choose a voice + which script to speak (native vs romanised fallback).
      const lang = options.lang ?? 'en-US'
      const isEnglish = lang.toLowerCase().startsWith('en')
      let voice: SpeechSynthesisVoice | null
      let segments: string[]
      if (isEnglish) {
        voice = enVoiceRef.current
        segments = native
      } else {
        const langVoice = pickVoiceForLang(voicesRef.current, lang)
        if (langVoice) {
          voice = langVoice
          segments = native
        } else if (options.roman?.length) {
          voice = enVoiceRef.current
          segments = options.roman.map((s) => s.trim()).filter(Boolean)
        } else {
          voice = enVoiceRef.current
          segments = native
        }
      }

      if (!segments.length) {
        playSoundIfCurrent()
        return
      }

      synth.cancel()
      synth.resume()

      const speakFrom = (index: number) => {
        if (speakIdRef.current !== runId) return
        const utterance = new SpeechSynthesisUtterance(segments[index])
        if (voice) {
          utterance.voice = voice
          utterance.lang = voice.lang
        } else {
          utterance.lang = isEnglish ? 'en-US' : lang
        }
        utterance.rate = options.rate ?? DEFAULT_RATE
        utterance.pitch = options.pitch ?? DEFAULT_PITCH
        utterance.volume = 1
        utterance.onend = () => {
          if (speakIdRef.current !== runId) return
          if (index + 1 < segments.length) {
            pauseTimerRef.current = window.setTimeout(
              () => speakFrom(index + 1),
              SEGMENT_PAUSE_MS,
            )
          } else if (options.soundUrl) {
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
    [supported, playSound, clearPauseTimer, stopSound],
  )

  const cancel = useCallback(() => {
    speakIdRef.current++
    clearPauseTimer()
    stopSound()
    if (supported) synthRef.current?.cancel()
  }, [supported, clearPauseTimer, stopSound])

  return { speak, cancel, unlock, supported }
}

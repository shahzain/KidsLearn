import { useCallback, useSyncExternalStore } from 'react'

// A tiny shared store so the mute toggle stays in sync across every screen and
// persists between visits.
const KEY = 'kidlearn:muted'

function readInitial(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

let muted = readInitial()
const listeners = new Set<() => void>()

export function setMuted(next: boolean): void {
  muted = next
  try {
    localStorage.setItem(KEY, next ? '1' : '0')
  } catch {
    /* ignore storage failures */
  }
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Reactive [muted, toggle] backed by localStorage and shared app-wide. */
export function useMuted(): readonly [boolean, () => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => muted,
    () => false,
  )
  const toggle = useCallback(() => setMuted(!muted), [])
  return [value, toggle] as const
}

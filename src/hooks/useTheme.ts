import { useCallback, useSyncExternalStore } from 'react'

// Shared, persisted app theme: 'bright' (default) or 'calm' (soft, dim,
// bedtime-friendly). Synced across every screen.
const KEY = 'kidlearn:theme'
export type Theme = 'bright' | 'calm'

function readInitial(): Theme {
  try {
    return localStorage.getItem(KEY) === 'calm' ? 'calm' : 'bright'
  } catch {
    return 'bright'
  }
}

let theme: Theme = readInitial()
const listeners = new Set<() => void>()

export function setTheme(next: Theme): void {
  theme = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    /* ignore storage failures */
  }
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Reactive [theme, toggle] backed by localStorage and shared app-wide. */
export function useTheme(): readonly [Theme, () => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => theme,
    () => 'bright' as Theme,
  )
  const toggle = useCallback(
    () => setTheme(theme === 'calm' ? 'bright' : 'calm'),
    [],
  )
  return [value, toggle] as const
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HomeScreen } from './components/HomeScreen'
import { CategoryScreen } from './components/CategoryScreen'
import { DrawingScreen } from './components/DrawingScreen'
import { useSpeech } from './hooks/useSpeech'
import { useTheme } from './hooks/useTheme'
import animals from './data/animals'
import birds from './data/birds'
import counting from './data/counting'
import abc from './data/abc'
import urdu from './data/urdu'
import family from './data/family'
import space from './data/space'
import plants from './data/plants'
import countries from './data/countries'
import drawing from './data/drawing'
import type { CategoryId } from './data/types'

const CATEGORIES = [
  animals,
  birds,
  counting,
  abc,
  urdu,
  family,
  space,
  plants,
  countries,
  drawing,
]

/** Read the active category id from the URL hash, e.g. "#animals". */
function categoryFromHash(): CategoryId | null {
  if (typeof window === 'undefined') return null
  const id = window.location.hash.replace(/^#/, '')
  return CATEGORIES.some((c) => c.id === id) ? (id as CategoryId) : null
}

export default function App() {
  const [activeId, setActiveId] = useState<CategoryId | null>(categoryFromHash)
  const { unlock, cancel } = useSpeech()
  const [theme] = useTheme()

  const active = useMemo(
    () => CATEGORIES.find((c) => c.id === activeId) ?? null,
    [activeId],
  )

  const openCategory = useCallback(
    (id: CategoryId) => {
      // Unlock iOS audio inside the tap gesture so snap auto-speech works.
      unlock()
      setActiveId(id)
      // Use a hash so the browser's back gesture is a same-document change
      // (no reload), exactly like the on-screen back button.
      window.history.pushState({ category: id }, '', `#${id}`)
    },
    [unlock],
  )

  const goHome = useCallback(() => {
    cancel()
    setActiveId(null)
  }, [cancel])

  // Keep the screen in sync with the URL hash for every kind of "back": the
  // on-screen button, the hardware button, and the edge-swipe gesture. Because
  // it's a hash change, none of these reload the page.
  useEffect(() => {
    const sync = () => {
      cancel()
      setActiveId(categoryFromHash())
    }
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [cancel])

  const handleBack = useCallback(() => {
    if (window.location.hash) {
      window.history.back()
    } else {
      goHome()
    }
  }, [goHome])

  return (
    <div
      className={`app-root fixed inset-0 overflow-hidden font-body text-slate-800 ${
        theme === 'calm' ? 'app-calm' : ''
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {active ? (
          active.kind === 'draw' ? (
            <DrawingScreen key={active.id} category={active} onBack={handleBack} />
          ) : (
            <CategoryScreen key={active.id} category={active} onBack={handleBack} />
          )
        ) : (
          <HomeScreen key="home" categories={CATEGORIES} onSelect={openCategory} />
        )}
      </AnimatePresence>
    </div>
  )
}

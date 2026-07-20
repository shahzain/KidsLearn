import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HomeScreen } from './components/HomeScreen'
import { CategoryScreen } from './components/CategoryScreen'
import { useSpeech } from './hooks/useSpeech'
import animals from './data/animals'
import birds from './data/birds'
import counting from './data/counting'
import abc from './data/abc'
import type { CategoryId } from './data/types'

const CATEGORIES = [animals, birds, counting, abc]

export default function App() {
  const [activeId, setActiveId] = useState<CategoryId | null>(null)
  const { unlock, cancel } = useSpeech()

  const active = useMemo(
    () => CATEGORIES.find((c) => c.id === activeId) ?? null,
    [activeId],
  )

  const openCategory = useCallback(
    (id: CategoryId) => {
      // Unlock iOS audio inside the tap gesture so snap auto-speech works.
      unlock()
      setActiveId(id)
      window.history.pushState({ category: id }, '')
    },
    [unlock],
  )

  const goHome = useCallback(() => {
    cancel()
    setActiveId(null)
  }, [cancel])

  // Hardware / gesture "back" returns to the home screen.
  useEffect(() => {
    const onPop = () => {
      cancel()
      setActiveId(null)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [cancel])

  const handleBack = useCallback(() => {
    if (window.history.state?.category) {
      window.history.back()
    } else {
      goHome()
    }
  }, [goHome])

  return (
    <div className="fixed inset-0 overflow-hidden font-body text-slate-800">
      <AnimatePresence mode="wait" initial={false}>
        {active ? (
          <CategoryScreen key={active.id} category={active} onBack={handleBack} />
        ) : (
          <HomeScreen key="home" categories={CATEGORIES} onSelect={openCategory} />
        )}
      </AnimatePresence>
    </div>
  )
}

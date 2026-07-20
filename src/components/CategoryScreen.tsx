import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Category } from '../data/types'
import { useSnapScroll } from '../hooks/useSnapScroll'
import { useSpeech } from '../hooks/useSpeech'
import { randomBackground } from '../data/backgrounds'
import { ItemCard } from './ItemCard'
import { BackButton } from './BackButton'
import { FloatingShapes } from './FloatingShapes'
import { BackgroundPhoto } from './BackgroundPhoto'

interface Props {
  category: Category
  onBack: () => void
}

/**
 * A single category: a vertical, one-card-per-screen snap scroller. The card
 * currently snapped into view auto-plays its word via the Web Speech API and
 * runs its entrance animation.
 */
export function CategoryScreen({ category, onBack }: Props) {
  const reduce = useReducedMotion()
  const [background] = useState(() => randomBackground())
  const { containerRef, registerItem, activeIndex } = useSnapScroll(
    category.items.length,
  )
  const { speak, cancel } = useSpeech()

  // Auto-speak the active card whenever it snaps into view (incl. the first).
  useEffect(() => {
    const item = category.items[activeIndex]
    if (!item) return
    const timer = window.setTimeout(
      () => speak(item.speak, { soundUrl: item.soundUrl }),
      280,
    )
    // On card change / unmount: stop the current word AND animal sound at once.
    return () => {
      window.clearTimeout(timer)
      cancel()
    }
  }, [activeIndex, category.items, speak, cancel])

  return (
    <motion.div
      className="absolute inset-0 h-full w-full overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${category.bgGradient[0]}, ${category.bgGradient[1]})`,
      }}
      initial={reduce ? { opacity: 0 } : { x: '100%' }}
      animate={reduce ? { opacity: 1 } : { x: 0 }}
      exit={reduce ? { opacity: 0 } : { x: '100%' }}
      transition={
        reduce
          ? { duration: 0.2 }
          : { type: 'spring', stiffness: 260, damping: 30 }
      }
    >
      <BackgroundPhoto src={background} tint={category.bgGradient} strength={0.55} />
      <FloatingShapes accent={category.accent} />
      <BackButton onClick={onBack} accent={category.accent} />

      <div
        ref={containerRef}
        className="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll overscroll-contain"
      >
        {category.items.map((item, index) => (
          <section
            key={item.id}
            ref={registerItem(index)}
            data-index={index}
            className="flex h-full w-full snap-start snap-always items-center justify-center px-5"
          >
            <ItemCard
              item={item}
              categoryId={category.id}
              accent={category.accent}
              isActive={index === activeIndex}
            />
          </section>
        ))}
      </div>

      <ProgressRail
        total={category.items.length}
        active={activeIndex}
        accent={category.accent}
      />
    </motion.div>
  )
}

interface RailProps {
  total: number
  active: number
  accent: string
}

/** Slim vertical position indicator down the right edge. */
function ProgressRail({ total, active, accent }: RailProps) {
  return (
    <div
      className="pointer-events-none absolute right-2 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-1.5"
      aria-hidden="true"
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: 8,
            height: i === active ? 22 : 8,
            background: accent,
            opacity: i === active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}

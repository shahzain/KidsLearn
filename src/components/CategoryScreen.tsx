import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Category, Item } from '../data/types'
import { useSnapScroll } from '../hooks/useSnapScroll'
import { useSpeech } from '../hooks/useSpeech'
import { useMuted } from '../hooks/useMuted'
import { randomBackground } from '../data/backgrounds'
import { getRecording, hasRecording } from '../lib/recordings'
import { ItemCard } from './ItemCard'
import { BackButton } from './BackButton'
import { MuteButton } from './MuteButton'
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
  const [muted] = useMuted()
  const recAudioRef = useRef<HTMLAudioElement | null>(null)
  const announceIdRef = useRef(0)

  const stopRecording = useCallback(() => {
    if (recAudioRef.current) {
      recAudioRef.current.pause()
      recAudioRef.current = null
    }
  }, [])

  // Say a card out loud: play the parent's recording if there is one, otherwise
  // speak it. Used both on snap and when a card is tapped again. Silent (and
  // stops any playback) when muted.
  const announce = useCallback(
    (item: Item, force = false) => {
      const runId = ++announceIdRef.current
      stopRecording()
      cancel()
      if (muted && !force) return

      const speakIt = () =>
        speak(item.speak, {
          soundUrl: item.soundUrl,
          lang: item.speakLang,
          roman: item.speakRoman,
        })

      if (hasRecording(item.id)) {
        void getRecording(item.id).then((blob) => {
          if (announceIdRef.current !== runId) return
          if (!blob) {
            speakIt()
            return
          }
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audio.onended = () => URL.revokeObjectURL(url)
          recAudioRef.current = audio
          audio.play().catch(() => {})
        })
        return
      }
      speakIt()
    },
    [muted, speak, cancel, stopRecording],
  )

  // Auto-announce the active card whenever it snaps into view (incl. the first).
  useEffect(() => {
    const item = category.items[activeIndex]
    if (!item) return
    const timer = window.setTimeout(() => announce(item), 280)
    // On card change / unmount: stop the word, sound and any recording at once.
    return () => {
      window.clearTimeout(timer)
      announceIdRef.current += 1
      cancel()
      stopRecording()
    }
  }, [activeIndex, category.items, announce, cancel, stopRecording])

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
      <MuteButton accent={category.accent} />

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
              onReplay={() => announce(item, true)}
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

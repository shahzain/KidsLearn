import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { CategoryId, Item } from '../data/types'
import { useHasRecording } from '../lib/recordings'
import { RecordButton } from './RecordButton'

interface Props {
  item: Item
  categoryId: CategoryId
  accent: string
  isActive: boolean
  /** Called when the card is tapped, to play its sound again. */
  onReplay?: () => void
}

// Subtle "pop" keyframe used whenever a card snaps into view.
const POP = [0.8, 1.05, 1]
const POP_EASE = [0.34, 1.4, 0.5, 1] as const

/**
 * A single full-screen learning card. Renders one of three layouts based on
 * the category (animals/birds, counting, or ABC) and animates when it becomes
 * the active (snapped) card.
 */
export function ItemCard({ item, categoryId, accent, isActive, onReplay }: Props) {
  const reduce = !!useReducedMotion()
  const recorded = useHasRecording(item.id)

  return (
    <motion.div
      onClick={onReplay}
      className="relative flex w-full max-w-[440px] cursor-pointer select-none flex-col items-center justify-center rounded-[2rem] bg-white/95 px-6 py-10 text-center shadow-card"
      style={{ height: 'min(78dvh, 680px)' }}
      animate={reduce ? {} : { y: isActive ? 0 : 10, opacity: isActive ? 1 : 0.72 }}
      transition={{ duration: 0.4 }}
    >
      <span
        className="absolute top-5 h-2 w-16 rounded-full"
        style={{ background: accent, opacity: 0.5 }}
      />
      <RecordButton itemId={item.id} accent={accent} />
      {recorded && (
        <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-sm font-bold text-white shadow-soft">
          <span aria-hidden="true">🎙️</span> Your voice
        </span>
      )}

      {categoryId === 'counting' ? (
        <CountingBody item={item} accent={accent} isActive={isActive} reduce={reduce} onReplay={onReplay} />
      ) : categoryId === 'abc' ? (
        <AbcBody item={item} accent={accent} isActive={isActive} reduce={reduce} onReplay={onReplay} />
      ) : (
        <>
          <Illustration
            emoji={item.emoji}
            isActive={isActive}
            reduce={reduce}
            onReplay={onReplay}
            className="text-[clamp(9rem,44vw,14rem)] leading-none"
          />
          <h2
            dir={item.rtl ? 'rtl' : undefined}
            className={`mt-4 font-display text-[clamp(2.75rem,12vw,4rem)] font-extrabold ${
              item.rtl ? 'font-urdu leading-[1.35]' : ''
            }`}
            style={{ color: accent }}
          >
            {item.title}
          </h2>
          {item.subtitle && (
            <p className="mt-1 font-display text-[2rem] font-bold text-slate-400">
              {item.subtitle}
            </p>
          )}
        </>
      )}
    </motion.div>
  )
}

interface PlayfulDragProps {
  reduce: boolean
  onReplay?: () => void
  className?: string
  children: ReactNode
}

/**
 * Wraps an illustration so a child can drag it around with a springy, snap-back
 * bounce ("drag to play") — starting a drag also replays the sound. Drag is
 * disabled when the user prefers reduced motion.
 */
function PlayfulDrag({ reduce, onReplay, className, children }: PlayfulDragProps) {
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={`${className ?? ''} cursor-grab active:cursor-grabbing`}
      drag
      dragSnapToOrigin
      dragElastic={0.5}
      dragConstraints={{ left: -70, right: 70, top: -70, bottom: 70 }}
      dragTransition={{ bounceStiffness: 480, bounceDamping: 14 }}
      whileTap={{ scale: 0.92 }}
      onDragStart={() => onReplay?.()}
    >
      {children}
    </motion.div>
  )
}

interface IllustrationProps {
  emoji: string
  isActive: boolean
  reduce: boolean
  className: string
  onReplay?: () => void
}

/** Large emoji that "pops" in, gently floats/wobbles while active, and is draggable. */
function Illustration({ emoji, isActive, reduce, className, onReplay }: IllustrationProps) {
  return (
    <PlayfulDrag reduce={reduce} onReplay={onReplay} className={className}>
      <motion.div
        animate={
          reduce
            ? { scale: 1 }
            : {
                scale: isActive ? POP : 0.92,
                rotate: isActive ? [0, -4, 0, 4, 0] : 0,
                y: isActive ? [0, -8, 0] : 0,
              }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                scale: { duration: 0.55, ease: POP_EASE },
                rotate: { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
              }
        }
      >
        <span aria-hidden="true">{emoji}</span>
      </motion.div>
    </PlayfulDrag>
  )
}

interface BodyProps {
  item: Item
  accent: string
  isActive: boolean
  reduce: boolean
  onReplay?: () => void
}

/** Counting card: giant numeral + number word + that many bouncing stars. */
function CountingBody({ item, accent, isActive, reduce, onReplay }: BodyProps) {
  const count = item.count ?? 0
  return (
    <>
      <PlayfulDrag reduce={reduce} onReplay={onReplay}>
        <motion.div
          className="font-display font-black leading-none text-[clamp(7rem,40vw,11rem)]"
          style={{ color: accent }}
          animate={
            reduce
              ? { scale: 1 }
              : {
                  scale: isActive ? POP : 0.92,
                  rotate: isActive ? [0, -3, 0, 3, 0] : 0,
                  y: isActive ? [0, -6, 0] : 0,
                }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  scale: { duration: 0.55, ease: POP_EASE },
                  rotate: { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                  y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                }
          }
        >
          {item.title}
        </motion.div>
      </PlayfulDrag>
      <p className="mt-1 font-display text-[2rem] font-bold text-slate-400">
        {item.subtitle}
      </p>
      <div className="mt-6 flex max-w-[360px] flex-wrap justify-center gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.span
            key={i}
            className="text-[clamp(2rem,9vw,3rem)] leading-none"
            aria-hidden="true"
            initial={false}
            animate={
              reduce || isActive
                ? { scale: 1, opacity: 1, y: 0 }
                : { scale: 0, opacity: 0, y: 12 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    delay: isActive ? 0.15 + i * 0.1 : 0,
                    type: 'spring',
                    stiffness: 520,
                    damping: 16,
                  }
            }
          >
            ⭐
          </motion.span>
        ))}
      </div>
    </>
  )
}

/** ABC card: uppercase + lowercase letters that flip in 3D, plus "A is for Apple". */
function AbcBody({ item, accent, isActive, reduce, onReplay }: BodyProps) {
  return (
    <>
      <div style={{ perspective: 800 }}>
        <motion.div
          className="flex items-end justify-center gap-2 font-display font-black leading-none text-[clamp(5rem,26vw,8rem)]"
          style={{ color: accent, transformStyle: 'preserve-3d' }}
          animate={reduce ? { rotateY: 0 } : { rotateY: isActive ? [90, -12, 0] : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
        >
          <span>{item.letterUpper}</span>
          <span className="text-[0.72em] text-slate-300">{item.letterLower}</span>
        </motion.div>
      </div>
      <Illustration
        emoji={item.emoji}
        isActive={isActive}
        reduce={reduce}
        onReplay={onReplay}
        className="mt-5 text-[clamp(4.5rem,22vw,7rem)] leading-none"
      />
      <p className="mt-5 font-display text-[clamp(2rem,7vw,2.5rem)] font-bold text-slate-500">
        <span style={{ color: accent }}>{item.subtitle} </span>
        {item.title}
      </p>
    </>
  )
}

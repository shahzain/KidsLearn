import { motion, useReducedMotion } from 'framer-motion'
import type { CategoryId, Item } from '../data/types'

interface Props {
  item: Item
  categoryId: CategoryId
  accent: string
  isActive: boolean
}

// Subtle "pop" keyframe used whenever a card snaps into view.
const POP = [0.8, 1.05, 1]
const POP_EASE = [0.34, 1.4, 0.5, 1] as const

/**
 * A single full-screen learning card. Renders one of three layouts based on
 * the category (animals/birds, counting, or ABC) and animates when it becomes
 * the active (snapped) card.
 */
export function ItemCard({ item, categoryId, accent, isActive }: Props) {
  const reduce = !!useReducedMotion()

  return (
    <motion.div
      className="relative flex w-full max-w-[440px] flex-col items-center justify-center rounded-[2rem] bg-white/95 px-6 py-10 text-center shadow-card"
      style={{ height: 'min(78dvh, 680px)' }}
      animate={reduce ? {} : { y: isActive ? 0 : 10, opacity: isActive ? 1 : 0.72 }}
      transition={{ duration: 0.4 }}
    >
      <span
        className="absolute top-5 h-2 w-16 rounded-full"
        style={{ background: accent, opacity: 0.5 }}
      />

      {categoryId === 'counting' ? (
        <CountingBody item={item} accent={accent} isActive={isActive} reduce={reduce} />
      ) : categoryId === 'abc' ? (
        <AbcBody item={item} accent={accent} isActive={isActive} reduce={reduce} />
      ) : (
        <>
          <Illustration
            emoji={item.emoji}
            isActive={isActive}
            reduce={reduce}
            className="text-[clamp(9rem,44vw,14rem)] leading-none"
          />
          <h2
            className="mt-4 font-display text-[clamp(2.75rem,12vw,4rem)] font-extrabold"
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

interface IllustrationProps {
  emoji: string
  isActive: boolean
  reduce: boolean
  className: string
}

/** Large emoji illustration that "pops" (0.8 → 1.05 → 1.0) when active. */
function Illustration({ emoji, isActive, reduce, className }: IllustrationProps) {
  return (
    <motion.div
      className={className}
      animate={reduce ? { scale: 1 } : { scale: isActive ? POP : 0.92 }}
      transition={reduce ? { duration: 0 } : { duration: 0.55, ease: POP_EASE }}
    >
      <span aria-hidden="true">{emoji}</span>
    </motion.div>
  )
}

interface BodyProps {
  item: Item
  accent: string
  isActive: boolean
  reduce: boolean
}

/** Counting card: giant numeral + number word + that many bouncing stars. */
function CountingBody({ item, accent, isActive, reduce }: BodyProps) {
  const count = item.count ?? 0
  return (
    <>
      <motion.div
        className="font-display font-black leading-none text-[clamp(7rem,40vw,11rem)]"
        style={{ color: accent }}
        animate={reduce ? { scale: 1 } : { scale: isActive ? POP : 0.92 }}
        transition={reduce ? { duration: 0 } : { duration: 0.55, ease: POP_EASE }}
      >
        {item.title}
      </motion.div>
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
function AbcBody({ item, accent, isActive, reduce }: BodyProps) {
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
        className="mt-5 text-[clamp(4.5rem,22vw,7rem)] leading-none"
      />
      <p className="mt-5 font-display text-[clamp(2rem,7vw,2.5rem)] font-bold text-slate-500">
        <span style={{ color: accent }}>{item.subtitle} </span>
        {item.title}
      </p>
    </>
  )
}

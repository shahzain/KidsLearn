import { motion, useReducedMotion } from 'framer-motion'

interface Props {
  onClick: () => void
  accent: string
}

/**
 * Large, always-visible "back to home" control in the top-left corner.
 * Gently pulses to draw a small child's attention. 64×64px touch target.
 */
export function BackButton({ onClick, accent }: Props) {
  const reduce = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Back to home"
      className="absolute left-4 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl font-black shadow-soft"
      style={{
        top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
        color: accent,
      }}
      animate={reduce ? { scale: 1 } : { scale: [1, 1.08, 1] }}
      transition={
        reduce
          ? { duration: 0 }
          : { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
      }
      whileTap={{ scale: 0.9 }}
    >
      <span aria-hidden="true" className="-mt-1">
        ←
      </span>
    </motion.button>
  )
}

import { useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { Category, CategoryId } from '../data/types'
import { randomBackground } from '../data/backgrounds'
import { FloatingShapes } from './FloatingShapes'
import { BackgroundPhoto } from './BackgroundPhoto'

interface Props {
  categories: Category[]
  onSelect: (id: CategoryId) => void
}

/**
 * Landing screen: a vertical list of four big, colourful category cards that
 * bounce in with a staggered entrance. Tap a card to enter that category.
 */
export function HomeScreen({ categories, onSelect }: Props) {
  const reduce = useReducedMotion()
  const [background] = useState(() => randomBackground())

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.08 },
    },
  }

  const card: Variants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 48, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: 'spring', stiffness: 420, damping: 18 },
        },
      }

  return (
    <motion.div
      key="home"
      className="absolute inset-0 h-full w-full overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FFFDF7, #FFE9D6)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <BackgroundPhoto src={background} tint={['#FFFDF7', '#FFE9D6']} strength={0.66} />
      <FloatingShapes accent="#FF8C42" />

      <div
        className="no-scrollbar relative z-10 mx-auto flex h-full w-full max-w-[520px] flex-col overflow-y-auto px-5 pb-10"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 26px)' }}
      >
        <header className="mb-6 shrink-0 text-center">
          <h1 className="font-display text-[clamp(3rem,15vw,4.5rem)] font-black leading-none text-orange-500 drop-shadow-sm">
            KidLearn
          </h1>
          <p className="mt-2 font-display text-[clamp(1.4rem,6vw,1.9rem)] font-bold text-slate-500">
            Tap a card to start! 👇
          </p>
        </header>

        <motion.ul
          className="flex flex-1 flex-col gap-5"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {categories.map((cat) => (
            <motion.li key={cat.id} variants={card} className="min-h-0">
              <button
                type="button"
                onClick={() => onSelect(cat.id)}
                aria-label={`Open ${cat.title}`}
                className="flex w-full items-center gap-4 rounded-[2rem] px-6 py-6 text-left shadow-card transition-transform duration-150 active:scale-[0.97]"
                style={{
                  background: `linear-gradient(135deg, ${cat.cardGradient[0]}, ${cat.cardGradient[1]})`,
                }}
              >
                <span
                  className="text-[clamp(3.5rem,16vw,5rem)] leading-none drop-shadow"
                  aria-hidden="true"
                >
                  {cat.emoji}
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-[clamp(2.25rem,9vw,3rem)] font-extrabold leading-tight text-white drop-shadow">
                    {cat.title}
                  </span>
                  <span className="font-display text-[clamp(1.25rem,5vw,1.6rem)] font-bold text-white/90">
                    {cat.tagline}
                  </span>
                </span>
                <span
                  className="ml-auto text-[clamp(2rem,8vw,2.75rem)] text-white/90"
                  aria-hidden="true"
                >
                  ›
                </span>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  )
}

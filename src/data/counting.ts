import type { Category, Item } from './types'

const WORDS = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
]

const items: Item[] = WORDS.map((word, i) => {
  const n = i + 1
  const countList = WORDS.slice(0, n).join(', ')
  return {
    id: `count-${n}`,
    emoji: '⭐',
    title: String(n),
    subtitle: word.toUpperCase(),
    speak: [word, `Let's count together. ${countList}.`],
    count: n,
  }
})

export const counting: Category = {
  id: 'counting',
  title: 'Counting',
  tagline: 'Count from 1 to 10!',
  emoji: '🔢',
  accent: '#8B5CF6',
  cardGradient: ['#A78BFA', '#7C3AED'],
  bgGradient: ['#F5F3FF', '#E0D4FF'],
  items,
}

export default counting

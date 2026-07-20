import type { Category } from './types'

/** The finger-drawing canvas — a special screen, not a scrollable item list. */
export const drawing: Category = {
  id: 'drawing',
  kind: 'draw',
  title: 'Drawing',
  tagline: 'Draw with your finger!',
  emoji: '🖍️',
  accent: '#EC4899',
  cardGradient: ['#F472B6', '#8B5CF6'],
  bgGradient: ['#FDF2F8', '#FCE7F3'],
  items: [],
}

export default drawing

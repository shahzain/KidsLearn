import type { Category, Item } from './types'

// [uppercase letter, example word, emoji]
const LETTERS: Array<[string, string, string]> = [
  ['A', 'Apple', '🍎'],
  ['B', 'Ball', '⚽'],
  ['C', 'Cat', '🐱'],
  ['D', 'Dog', '🐶'],
  ['E', 'Elephant', '🐘'],
  ['F', 'Fish', '🐟'],
  ['G', 'Grapes', '🍇'],
  ['H', 'Hat', '🎩'],
  ['I', 'Ice cream', '🍦'],
  ['J', 'Juice', '🧃'],
  ['K', 'Kite', '🪁'],
  ['L', 'Lion', '🦁'],
  ['M', 'Moon', '🌙'],
  ['N', 'Nut', '🥜'],
  ['O', 'Orange', '🍊'],
  ['P', 'Pig', '🐷'],
  ['Q', 'Queen', '👑'],
  ['R', 'Rainbow', '🌈'],
  ['S', 'Sun', '☀️'],
  ['T', 'Tree', '🌳'],
  ['U', 'Umbrella', '☂️'],
  ['V', 'Van', '🚐'],
  ['W', 'Watermelon', '🍉'],
  ['X', 'Xylophone', '🎼'],
  ['Y', 'Yo-yo', '🪀'],
  ['Z', 'Zebra', '🦓'],
]

const items: Item[] = LETTERS.map(([upper, word, emoji]) => {
  const lower = upper.toLowerCase()
  return {
    id: `abc-${upper}`,
    emoji,
    title: word,
    subtitle: `${upper} is for`,
    speak: [upper, `${upper} is for ${word}.`],
    letterUpper: upper,
    letterLower: lower,
  }
})

export const abc: Category = {
  id: 'abc',
  title: 'ABC',
  tagline: 'Learn your letters!',
  emoji: '🔤',
  accent: '#22C55E',
  cardGradient: ['#4ADE80', '#16A34A'],
  bgGradient: ['#F0FDF4', '#C9F5D6'],
  items,
}

export default abc

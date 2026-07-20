import type { Category, Item } from './types'

// Urdu family members: big Urdu word + romanised gloss. Spoken in Urdu when an
// Urdu (or Arabic-script) voice exists, otherwise the romanised form is spoken.
const members: Array<{
  id: string
  emoji: string
  urdu: string
  roman: string
  english: string
}> = [
  { id: 'ammi', emoji: '👩', urdu: 'امی', roman: 'Ammi', english: 'Mother' },
  { id: 'abbu', emoji: '👨', urdu: 'ابو', roman: 'Abbu', english: 'Father' },
  { id: 'dada', emoji: '👴', urdu: 'دادا', roman: 'Dada', english: 'Grandpa' },
  { id: 'dadi', emoji: '👵', urdu: 'دادی', roman: 'Dadi', english: 'Grandma' },
  { id: 'nana', emoji: '🧓', urdu: 'نانا', roman: 'Nana', english: 'Grandpa' },
  { id: 'nani', emoji: '👵', urdu: 'نانی', roman: 'Nani', english: 'Grandma' },
  { id: 'bhai', emoji: '👦', urdu: 'بھائی', roman: 'Bhai', english: 'Brother' },
  { id: 'behen', emoji: '👧', urdu: 'بہن', roman: 'Behen', english: 'Sister' },
  { id: 'khala', emoji: '🧕', urdu: 'خالہ', roman: 'Khala', english: 'Aunt' },
  { id: 'mamu', emoji: '🧔', urdu: 'ماموں', roman: 'Mamu', english: 'Uncle' },
  { id: 'baby', emoji: '👶', urdu: 'بچہ', roman: 'Bacha', english: 'Baby' },
]

const items: Item[] = members.map((m) => ({
  id: `family-${m.id}`,
  emoji: m.emoji,
  title: m.urdu,
  rtl: true,
  subtitle: `${m.roman} · ${m.english}`,
  speak: [m.urdu],
  speakLang: 'ur-PK',
  speakRoman: [m.roman],
}))

export const family: Category = {
  id: 'family',
  title: 'Family',
  tagline: 'گھر والے — our family!',
  emoji: '👪',
  accent: '#F43F5E',
  cardGradient: ['#FDA4AF', '#E11D48'],
  bgGradient: ['#FFF1F3', '#FFD9E0'],
  items,
}

export default family

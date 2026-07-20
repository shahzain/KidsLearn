import type { Category, Item } from './types'

// [letter glyph, letter name, example word (Urdu), word romanised, emoji]
const LETTERS: Array<[string, string, string, string, string]> = [
  ['آ', 'Alif', 'آم', 'Aam', '🥭'],
  ['ب', 'Be', 'بکری', 'Bakri', '🐐'],
  ['پ', 'Pe', 'پھول', 'Phool', '🌸'],
  ['ت', 'Te', 'تتلی', 'Titli', '🦋'],
  ['ٹ', 'Tay', 'ٹماٹر', 'Tamatar', '🍅'],
  ['ج', 'Jeem', 'جہاز', 'Jahaaz', '✈️'],
  ['چ', 'Che', 'چاند', 'Chaand', '🌙'],
  ['د', 'Daal', 'درخت', 'Darakht', '🌳'],
  ['ر', 'Re', 'روٹی', 'Roti', '🍞'],
  ['ز', 'Ze', 'زیبرا', 'Zebra', '🦓'],
  ['س', 'Seen', 'سیب', 'Saib', '🍎'],
  ['ش', 'Sheen', 'شیر', 'Sher', '🦁'],
  ['ع', 'Ain', 'عینک', 'Ainak', '👓'],
  ['ف', 'Fe', 'فٹبال', 'Football', '⚽'],
  ['ق', 'Qaaf', 'قلم', 'Qalam', '✒️'],
  ['ک', 'Kaaf', 'کتاب', 'Kitaab', '📖'],
  ['گ', 'Gaaf', 'گاڑی', 'Gaari', '🚗'],
  ['ل', 'Laam', 'لیموں', 'Lemon', '🍋'],
  ['م', 'Meem', 'مچھلی', 'Machhli', '🐟'],
  ['ن', 'Noon', 'ناریل', 'Nariyal', '🥥'],
  ['ہ', 'He', 'ہاتھی', 'Haathi', '🐘'],
]

const items: Item[] = LETTERS.map(([glyph, name, word, wordRoman, emoji], i) => ({
  id: `urdu-${i + 1}`,
  emoji,
  title: glyph,
  rtl: true,
  subtitle: `${name} · ${wordRoman}`,
  speak: [glyph, `${glyph} سے ${word}`],
  speakLang: 'ur-PK',
  speakRoman: [name, `${name} se ${wordRoman}`],
}))

export const urdu: Category = {
  id: 'urdu',
  title: 'اردو',
  tagline: 'Urdu letters — Alif se Aam!',
  emoji: '📗',
  accent: '#D97706',
  cardGradient: ['#FCD34D', '#D97706'],
  bgGradient: ['#FFFBEB', '#FDECC8'],
  items,
}

export default urdu

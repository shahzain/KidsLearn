import type { Category } from './types'

export const animals: Category = {
  id: 'animals',
  title: 'Animals',
  tagline: 'Meet the animals!',
  emoji: '🐘',
  accent: '#F97316',
  cardGradient: ['#FF9A3E', '#FB5E3B'],
  bgGradient: ['#FFF7ED', '#FFE0B8'],
  items: [
    { id: 'cat', emoji: '🐱', title: 'Cat', subtitle: 'Meow!', speak: ['Cat'], soundUrl: '/sounds/cat.mp3' },
    { id: 'dog', emoji: '🐶', title: 'Dog', subtitle: 'Woof!', speak: ['Dog'], soundUrl: '/sounds/dog.mp3' },
    { id: 'elephant', emoji: '🐘', title: 'Elephant', subtitle: 'Pawoo!', speak: ['Elephant'], soundUrl: '/sounds/elephant.mp3' },
    { id: 'lion', emoji: '🦁', title: 'Lion', subtitle: 'Roar!', speak: ['Lion'], soundUrl: '/sounds/lion.mp3' },
    { id: 'tiger', emoji: '🐯', title: 'Tiger', subtitle: 'Grrr!', speak: ['Tiger'], soundUrl: '/sounds/tiger.mp3' },
    { id: 'giraffe', emoji: '🦒', title: 'Giraffe', subtitle: 'So tall!', speak: ['Giraffe', 'The giraffe is very tall!'] },
    { id: 'monkey', emoji: '🐵', title: 'Monkey', subtitle: 'Ooh ooh!', speak: ['Monkey'], soundUrl: '/sounds/monkey.mp3' },
    { id: 'rabbit', emoji: '🐰', title: 'Rabbit', subtitle: 'Hop hop!', speak: ['Rabbit', 'Hop, hop, hop!'] },
    { id: 'bear', emoji: '🐻', title: 'Bear', subtitle: 'Growl!', speak: ['Bear'], soundUrl: '/sounds/bear.mp3' },
    { id: 'horse', emoji: '🐴', title: 'Horse', subtitle: 'Neigh!', speak: ['Horse'], soundUrl: '/sounds/horse.mp3' },
  ],
}

export default animals

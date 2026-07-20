import type { Category } from './types'

export const birds: Category = {
  id: 'birds',
  title: 'Birds',
  tagline: 'Listen to the birds!',
  emoji: '🦜',
  accent: '#0EA5E9',
  cardGradient: ['#5CC8FF', '#0E8FE9'],
  bgGradient: ['#F0F9FF', '#C7E9FF'],
  items: [
    { id: 'parrot', emoji: '🦜', title: 'Parrot', subtitle: 'Squawk!', speak: ['Parrot'], soundUrl: '/sounds/parrot.mp3' },
    { id: 'owl', emoji: '🦉', title: 'Owl', subtitle: 'Hoot!', speak: ['Owl'], soundUrl: '/sounds/owl.mp3' },
    { id: 'eagle', emoji: '🦅', title: 'Eagle', subtitle: 'Screech!', speak: ['Eagle'], soundUrl: '/sounds/eagle.mp3' },
    { id: 'penguin', emoji: '🐧', title: 'Penguin', subtitle: 'Waddle!', speak: ['Penguin', 'The penguin waddles on the ice!'] },
    { id: 'flamingo', emoji: '🦩', title: 'Flamingo', subtitle: 'So pink!', speak: ['Flamingo'], soundUrl: '/sounds/flamingo.mp3' },
    { id: 'peacock', emoji: '🦚', title: 'Peacock', subtitle: 'Pretty!', speak: ['Peacock'], soundUrl: '/sounds/peacock.mp3' },
    { id: 'duck', emoji: '🦆', title: 'Duck', subtitle: 'Quack!', speak: ['Duck'], soundUrl: '/sounds/duck.mp3' },
    { id: 'robin', emoji: '🐦', title: 'Robin', subtitle: 'Tweet!', speak: ['Robin'], soundUrl: '/sounds/robin.mp3' },
    { id: 'toucan', emoji: '🐦‍⬛', title: 'Toucan', subtitle: 'Big beak!', speak: ['Toucan', 'The toucan has a big colourful beak!'] },
    { id: 'swan', emoji: '🦢', title: 'Swan', subtitle: 'Graceful!', speak: ['Swan'], soundUrl: '/sounds/swan.mp3' },
  ],
}

export default birds

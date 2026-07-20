import type { Category } from './types'

export const space: Category = {
  id: 'space',
  title: 'Space',
  tagline: 'Blast off to the stars!',
  emoji: '🪐',
  accent: '#6366F1',
  cardGradient: ['#818CF8', '#4F46E5'],
  bgGradient: ['#EEF0FF', '#D9DEFF'],
  items: [
    { id: 'sun', emoji: '☀️', title: 'Sun', subtitle: 'So warm!', speak: ['Sun', 'The sun is a giant star that keeps us warm!'] },
    { id: 'moon', emoji: '🌙', title: 'Moon', subtitle: 'Good night!', speak: ['Moon', 'The moon glows in the night sky.'] },
    { id: 'earth', emoji: '🌍', title: 'Earth', subtitle: 'Our home!', speak: ['Earth', 'Earth is our home. It is where we live!'] },
    { id: 'star', emoji: '⭐', title: 'Star', subtitle: 'Twinkle!', speak: ['Star', 'Twinkle, twinkle, little star!'] },
    { id: 'rocket', emoji: '🚀', title: 'Rocket', subtitle: 'Whoosh!', speak: ['Rocket', 'The rocket zooms up into space!'] },
    { id: 'saturn', emoji: '🪐', title: 'Saturn', subtitle: 'Big rings!', speak: ['Saturn', 'Saturn is a planet with beautiful rings.'] },
    { id: 'comet', emoji: '☄️', title: 'Comet', subtitle: 'Zoom!', speak: ['Comet', 'A comet flies across the sky with a bright tail!'] },
    { id: 'galaxy', emoji: '🌌', title: 'Galaxy', subtitle: 'So many stars!', speak: ['Galaxy', 'A galaxy is full of millions of stars.'] },
    { id: 'astronaut', emoji: '🧑‍🚀', title: 'Astronaut', subtitle: 'Floating!', speak: ['Astronaut', 'An astronaut floats and explores space!'] },
    { id: 'telescope', emoji: '🔭', title: 'Telescope', subtitle: 'Look up!', speak: ['Telescope', 'A telescope helps us see far away stars.'] },
    { id: 'satellite', emoji: '🛰️', title: 'Satellite', subtitle: 'Beep beep!', speak: ['Satellite', 'A satellite spins around the Earth.'] },
    { id: 'ufo', emoji: '🛸', title: 'Spaceship', subtitle: 'Wheee!', speak: ['Spaceship', 'Whoosh! A spaceship flies through the stars.'] },
  ],
}

export default space

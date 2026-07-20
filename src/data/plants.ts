import type { Category } from './types'

export const plants: Category = {
  id: 'plants',
  title: 'Plants',
  tagline: 'Flowers and trees!',
  emoji: '🌻',
  accent: '#10B981',
  cardGradient: ['#6EE7B7', '#059669'],
  bgGradient: ['#ECFDF5', '#CDF5E4'],
  items: [
    { id: 'rose', emoji: '🌹', title: 'Rose', subtitle: 'Smell it!', speak: ['Rose', 'A rose is a pretty red flower.'] },
    { id: 'sunflower', emoji: '🌻', title: 'Sunflower', subtitle: 'So sunny!', speak: ['Sunflower', 'A sunflower turns to face the sun!'] },
    { id: 'tulip', emoji: '🌷', title: 'Tulip', subtitle: 'Pretty!', speak: ['Tulip', 'A tulip is a colourful spring flower.'] },
    { id: 'hibiscus', emoji: '🌺', title: 'Hibiscus', subtitle: 'Bright!', speak: ['Hibiscus', 'A hibiscus is a big bright flower.'] },
    { id: 'blossom', emoji: '🌸', title: 'Blossom', subtitle: 'Soft pink!', speak: ['Blossom', 'Blossoms bloom on trees in spring.'] },
    { id: 'daisy', emoji: '🌼', title: 'Daisy', subtitle: 'Cheerful!', speak: ['Daisy', 'A daisy is a happy little flower.'] },
    { id: 'tree', emoji: '🌳', title: 'Tree', subtitle: 'So tall!', speak: ['Tree', 'A tree grows tall and gives us shade.'] },
    { id: 'palm', emoji: '🌴', title: 'Palm Tree', subtitle: 'Beachy!', speak: ['Palm Tree', 'A palm tree grows near the beach.'] },
    { id: 'cactus', emoji: '🌵', title: 'Cactus', subtitle: 'Ouch, spiky!', speak: ['Cactus', 'A cactus is spiky and lives in the desert.'] },
    { id: 'herb', emoji: '🌿', title: 'Leaf', subtitle: 'Green!', speak: ['Leaf', 'Green leaves help the plant drink sunlight.'] },
    { id: 'clover', emoji: '🍀', title: 'Clover', subtitle: 'Lucky!', speak: ['Clover', 'A lucky clover has four little leaves.'] },
    { id: 'bouquet', emoji: '💐', title: 'Bouquet', subtitle: 'For you!', speak: ['Bouquet', 'A bouquet is a bunch of pretty flowers.'] },
  ],
}

export default plants

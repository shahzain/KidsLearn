import sharp from 'sharp'
import { resolve } from 'node:path'

const W = 390
const H = 844

function scrim(fromRgba, toRgba, extra = '') {
  return `
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${fromRgba.c}" stop-opacity="${fromRgba.a}"/>
      <stop offset="1" stop-color="${toRgba.c}" stop-opacity="${toRgba.a}"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    ${extra}`
}

async function composite(photo, overlaySvg, out) {
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${overlaySvg}</svg>`,
  )
  await sharp(resolve('src/assets/backgrounds', photo))
    .resize(W, H, { fit: 'cover' })
    .composite([{ input: svg }])
    .png()
    .toFile(resolve('scripts', out))
  console.log('wrote', out)
}

// Category (Birds, blue tint 0.55) with a white card + back button mock.
const birdsCard = `
  <circle cx="54" cy="72" r="28" fill="#ffffff"/>
  <text x="54" y="82" font-size="30" text-anchor="middle" fill="#0EA5E9">&#8592;</text>
  <rect x="28" y="115" width="334" height="615" rx="32" fill="#ffffff" fill-opacity="0.95"/>
  <rect x="171" y="140" width="48" height="8" rx="4" fill="#0EA5E9" fill-opacity="0.5"/>
  <text x="195" y="470" font-size="150" text-anchor="middle">&#129388;</text>
  <text x="195" y="560" font-size="52" text-anchor="middle" font-weight="800" fill="#0EA5E9">Parrot</text>
`
await composite(
  'bg-05.webp',
  scrim({ c: '#F0F9FF', a: 0.65 }, { c: '#C7E9FF', a: 0.55 }, birdsCard),
  '_preview_birds.png',
)

// Home (warm tint 0.66) with title + card mocks.
const homeMock = `
  <text x="195" y="120" font-size="64" text-anchor="middle" font-weight="900" fill="#F97316">KidLearn</text>
  <text x="195" y="160" font-size="26" text-anchor="middle" font-weight="700" fill="#64748b">Tap a card to start!</text>
  <rect x="28" y="210" width="334" height="120" rx="30" fill="#FB7A3C"/>
  <rect x="28" y="345" width="334" height="120" rx="30" fill="#1EA0E6"/>
  <rect x="28" y="480" width="334" height="120" rx="30" fill="#7C3AED"/>
  <rect x="28" y="615" width="334" height="120" rx="30" fill="#16A34A"/>
`
await composite(
  'bg-02.webp',
  scrim({ c: '#FFFDF7', a: 0.76 }, { c: '#FFE9D6', a: 0.66 }, homeMock),
  '_preview_home.png',
)

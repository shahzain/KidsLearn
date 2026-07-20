// Generates every PWA icon, the maskable icons, the iOS apple-touch-icon,
// the favicon and the iPhone launch (splash) screens from a single vector
// source — no binary assets checked into the repo. Run: `npm run generate-icons`.
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const publicDir = resolve(root, 'public')
const iconsDir = resolve(publicDir, 'icons')

// Five-point white star (drawn in a 512×512 coordinate space).
const STAR =
  'M256,96 L286,178 L373,182 L305,236 L327,320 L256,270 L185,320 L207,236 L139,182 L226,178 Z'

// The four category dots (Birds=blue, ABC=green, Counting=purple, sun=gold).
function artwork() {
  return `
    <path d="${STAR}" fill="#FFFFFF"/>
    <circle cx="120" cy="428" r="30" fill="#0EA5E9"/>
    <circle cx="205" cy="446" r="30" fill="#22C55E"/>
    <circle cx="307" cy="446" r="30" fill="#8B5CF6"/>
    <circle cx="392" cy="428" r="30" fill="#FFD23F"/>
  `
}

function iconSvg({ rounded = false, maskable = false } = {}) {
  const bg = rounded
    ? '<rect x="26" y="26" width="460" height="460" rx="104" fill="url(#g)"/>'
    : '<rect width="512" height="512" fill="url(#g)"/>'
  // Maskable icons keep artwork inside the central 80% "safe zone".
  const art = maskable
    ? `<g transform="translate(51.2,51.2) scale(0.8)">${artwork()}</g>`
    : artwork()
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FF9A3E"/>
        <stop offset="1" stop-color="#FF5EA0"/>
      </linearGradient>
    </defs>
    ${bg}
    ${art}
  </svg>`
}

function splashSvg(w, h) {
  const size = Math.round(Math.min(w, h) * 0.42)
  const x = Math.round((w - size) / 2)
  const y = Math.round((h - size) / 2)
  const scale = size / 512
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFF7ED"/>
        <stop offset="1" stop-color="#FFE0B8"/>
      </linearGradient>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FF9A3E"/>
        <stop offset="1" stop-color="#FF5EA0"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <g transform="translate(${x},${y}) scale(${scale})">
      <rect x="26" y="26" width="460" height="460" rx="104" fill="url(#g)"/>
      ${artwork()}
    </g>
  </svg>`
}

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
const SPLASHES = [
  [640, 1136],
  [750, 1334],
  [828, 1792],
  [1125, 2436],
  [1170, 2532],
  [1179, 2556],
  [1242, 2208],
  [1242, 2688],
  [1284, 2778],
  [1290, 2796],
]

async function main() {
  await mkdir(iconsDir, { recursive: true })

  const anyIcon = Buffer.from(iconSvg({ rounded: false, maskable: false }))
  const maskIcon = Buffer.from(iconSvg({ rounded: false, maskable: true }))

  // Standard "any" icons.
  for (const size of ICON_SIZES) {
    await sharp(anyIcon)
      .resize(size, size)
      .png()
      .toFile(resolve(iconsDir, `icon-${size}.png`))
  }

  // Maskable icons (Android adaptive / PWA masking).
  for (const size of [192, 512]) {
    await sharp(maskIcon)
      .resize(size, size)
      .png()
      .toFile(resolve(iconsDir, `icon-${size}-maskable.png`))
  }

  // iOS home-screen icon.
  await sharp(anyIcon)
    .resize(180, 180)
    .png()
    .toFile(resolve(iconsDir, 'apple-touch-icon.png'))

  // Browser favicon (crisp vector).
  await writeFile(resolve(publicDir, 'favicon.svg'), iconSvg({ rounded: true }))

  // iPhone launch screens.
  for (const [w, h] of SPLASHES) {
    await sharp(Buffer.from(splashSvg(w, h)))
      .resize(w, h)
      .png()
      .toFile(resolve(iconsDir, `splash-${w}x${h}.png`))
  }

  const total = ICON_SIZES.length + 2 + 1 + SPLASHES.length
  console.log(`✓ Generated ${total} icon/splash files + favicon.svg`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

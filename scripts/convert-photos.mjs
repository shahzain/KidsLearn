// Converts the iPhone HEIC photos in src/photos/ into optimized, web-friendly
// WebP background images in src/assets/backgrounds/. HEIC can't be decoded by
// browsers (or by sharp's prebuilt binary), so we decode with the pure-WASM
// libheif (heic-convert) and then resize/compress with sharp.
//
// Run:  npm run convert-photos
import convert from 'heic-convert'
import sharp from 'sharp'
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const srcDir = resolve(root, 'src', 'photos')
const outDir = resolve(root, 'src', 'assets', 'backgrounds')

async function main() {
  let all = []
  try {
    all = await readdir(srcDir)
  } catch {
    console.log('No src/photos folder — nothing to convert.')
    return
  }
  const heics = all.filter((f) => /\.heic$/i.test(f)).sort()
  if (!heics.length) {
    console.log('No HEIC files found in src/photos.')
    return
  }

  await mkdir(outDir, { recursive: true })

  let n = 0
  for (const file of heics) {
    n += 1
    const name = `bg-${String(n).padStart(2, '0')}.webp`
    try {
      const inputBuffer = await readFile(resolve(srcDir, file))
      const jpeg = await convert({ buffer: inputBuffer, format: 'JPEG', quality: 0.92 })
      const out = await sharp(Buffer.from(jpeg))
        .rotate() // respect EXIF orientation so photos are upright
        .resize({ width: 1080, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 70 })
        .toBuffer()
      await writeFile(resolve(outDir, name), out)
      console.log(`\u2713 ${file} -> ${name} (${(out.length / 1024).toFixed(0)} KB)`)
    } catch (e) {
      console.warn(`\u2717 ${file}: ${e.message}`)
    }
  }
  console.log(`\nDone: ${n} background(s) written to src/assets/backgrounds/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

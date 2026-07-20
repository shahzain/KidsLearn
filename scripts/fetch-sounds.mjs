// Downloads real, iPhone-compatible (MP3) animal & bird sounds into
// public/sounds/. Sourced from open GitHub "animal soundboard" projects — see
// public/sounds/CREDITS.md for sources and licensing notes.
//
// Run once (needs internet):  npm run fetch-sounds
// Then rebuild so the service worker caches them for offline use: npm run build
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(here, '..', 'public', 'sounds')
const RAW = 'https://raw.githubusercontent.com'
const HEADERS = { 'User-Agent': 'KidLearn-sound-fetch' }

// localName -> "owner/repo/branch/path" on raw.githubusercontent.com
// (giraffe, rabbit, penguin and toucan are (near-)silent animals with no
//  iconic call, so they intentionally have no sound and just say their name.)
const SOURCES = {
  // Animals
  cat: 'ridhurshan/Animal-Soundboard/main/static/sound/cat.mp3',
  dog: 'ridhurshan/Animal-Soundboard/main/static/sound/dog.mp3',
  elephant: 'ridhurshan/Animal-Soundboard/main/static/sound/elephant.mp3',
  lion: 'ridhurshan/Animal-Soundboard/main/static/sound/lion.mp3',
  tiger: 'ridhurshan/Animal-Soundboard/main/static/sound/Tiger.mp3',
  monkey: 'ridhurshan/Animal-Soundboard/main/static/sound/Monkey.mp3',
  bear: 'ridhurshan/Animal-Soundboard/main/static/sound/Bear.mp3',
  horse: 'andanylo/AnimalSoundboard/main/Files/Horse/Horse.mp3',
  // Birds
  parrot: 'ridhurshan/Animal-Soundboard/main/static/sound/Parrot.mp3',
  owl: 'ridhurshan/Animal-Soundboard/main/static/sound/Owl.mp3',
  eagle: 'ridhurshan/Animal-Soundboard/main/static/sound/Hawk.mp3',
  flamingo: 'ridhurshan/Animal-Soundboard/main/static/sound/Flamingo.mp3',
  peacock: 'ridhurshan/Animal-Soundboard/main/static/sound/Peacock.mp3',
  duck: 'ridhurshan/Animal-Soundboard/main/static/sound/Duck.mp3',
  robin: 'ridhurshan/Animal-Soundboard/main/static/sound/Bird.mp3',
  swan: 'andanylo/AnimalSoundboard/main/Files/Goose/Goose.mp3',
}

function isMp3(buf) {
  if (buf.length < 1024) return false
  if (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) return true // "ID3"
  if (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0) return true // MPEG frame sync
  return false
}

async function main() {
  await mkdir(outDir, { recursive: true })
  const ids = Object.keys(SOURCES)
  let ok = 0
  for (const id of ids) {
    const url = `${RAW}/${SOURCES[id]}`
    try {
      const res = await fetch(url, { headers: HEADERS })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      if (!isMp3(buf)) throw new Error('not a valid MP3')
      await writeFile(resolve(outDir, `${id}.mp3`), buf)
      console.log(`\u2713 ${id}.mp3  (${(buf.length / 1024).toFixed(0)} KB)`)
      ok++
    } catch (e) {
      console.warn(`\u2717 ${id}: ${e.message}`)
    }
  }
  console.log(`\nDone: ${ok}/${ids.length} sounds saved to public/sounds/`)
  if (ok > 0) {
    console.log('Run `npm run build` so the service worker caches them for offline use.')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

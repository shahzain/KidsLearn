// Background photos, auto-discovered from src/assets/backgrounds/. These are
// produced from the HEIC originals in src/photos/ by `npm run convert-photos`,
// so adding or removing a photo just works with no code changes.
const modules = import.meta.glob('../assets/backgrounds/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const BACKGROUNDS: string[] = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url as string)

/** Pick a random background photo URL (or undefined when none exist). */
export function randomBackground(): string | undefined {
  if (BACKGROUNDS.length === 0) return undefined
  return BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
}

import { useState } from 'react'

interface Props {
  /** Background photo URL. When absent, nothing renders (parent gradient shows). */
  src?: string
  /** [from, to] colours used to tint + soften the photo so content stays readable. */
  tint: [string, string]
  /** Overlay opacity 0..1 — higher mutes the photo more. Default 0.58. */
  strength?: number
}

function withAlpha(hex: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha))
  const a = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex}${a}`
}

/**
 * Full-screen decorative photo background with a colour-tinted scrim on top, so
 * the white cards and text always stay readable. Fades in on load and renders
 * nothing (falling back to the parent gradient) when no photo is available.
 */
export function BackgroundPhoto({ src, tint, strength = 0.58 }: Props) {
  const [loaded, setLoaded] = useState(false)

  if (!src) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <img
        src={src}
        alt=""
        decoding="async"
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
        style={{ opacity: loaded ? 1 : 0 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${withAlpha(
            tint[0],
            Math.min(1, strength + 0.1),
          )} 0%, ${withAlpha(tint[1], strength)} 100%)`,
        }}
      />
    </div>
  )
}

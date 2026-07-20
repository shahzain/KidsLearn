/**
 * Decorative, non-interactive background shapes that gently float using the
 * CSS keyframe animations defined in the Tailwind config. Purely cosmetic —
 * hidden from assistive tech and immune to pointer events.
 */
interface Props {
  accent: string
}

export function FloatingShapes({ accent }: Props) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <span
        className="animate-float-y absolute left-[8%] top-[12%] h-16 w-16 rounded-full opacity-20"
        style={{ background: accent }}
      />
      <span
        className="animate-float-y2 absolute right-[10%] top-[20%] h-10 w-10 rounded-full opacity-25"
        style={{ background: accent }}
      />
      <span
        className="animate-float-y absolute right-[22%] top-[46%] h-8 w-8 rounded-full opacity-20"
        style={{ background: accent }}
      />
      <span className="animate-twinkle absolute left-[16%] bottom-[16%] text-4xl opacity-40">
        ⭐
      </span>
      <span className="animate-twinkle absolute left-[26%] top-[38%] text-3xl opacity-30">
        ✨
      </span>
      <span className="animate-drift absolute right-[14%] bottom-[22%] text-5xl opacity-25">
        ☁️
      </span>
    </div>
  )
}

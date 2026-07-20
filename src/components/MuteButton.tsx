import { useMuted } from '../hooks/useMuted'

interface Props {
  accent: string
}

/** Top-right sound on/off toggle. 64×64px touch target, persists its state. */
export function MuteButton({ accent }: Props) {
  const [muted, toggle] = useMuted()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      aria-pressed={muted}
      className="absolute right-4 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-soft transition-transform active:scale-95"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 14px)', color: accent }}
    >
      <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
    </button>
  )
}

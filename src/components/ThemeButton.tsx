import { useTheme } from '../hooks/useTheme'

interface Props {
  accent: string
}

/**
 * Top-left toggle between the bright everyday look and a soft, dim "calm"
 * (bedtime) mode. 64×64px touch target, persists its state.
 */
export function ThemeButton({ accent }: Props) {
  const [theme, toggle] = useTheme()
  const calm = theme === 'calm'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={calm ? 'Switch to bright mode' : 'Switch to calm bedtime mode'}
      aria-pressed={calm}
      className="absolute left-4 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-soft transition-transform active:scale-95"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 14px)', color: accent }}
    >
      <span aria-hidden="true">{calm ? '☀️' : '🌙'}</span>
    </button>
  )
}

import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Category } from '../data/types'
import { BackButton } from './BackButton'
import { FloatingShapes } from './FloatingShapes'

interface Props {
  category: Category
  onBack: () => void
}

const COLORS = [
  '#EF4444',
  '#F97316',
  '#FACC15',
  '#22C55E',
  '#0EA5E9',
  '#8B5CF6',
  '#EC4899',
  '#111827',
]

/** Full-screen finger-drawing canvas with a colour palette and a clear button. */
export function DrawingScreen({ category, onBack }: Props) {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const drawingRef = useRef(false)
  const [color, setColor] = useState('#8B5CF6')
  const colorRef = useRef(color)
  colorRef.current = color

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(dpr, dpr) // width/height assignment resets the transform first
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 16
      ctxRef.current = ctx
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const pointFrom = (e: RPointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e: RPointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const ctx = ctxRef.current
    if (!ctx) return
    drawingRef.current = true
    canvasRef.current?.setPointerCapture(e.pointerId)
    const { x, y } = pointFrom(e)
    ctx.strokeStyle = colorRef.current
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 0.1, y + 0.1) // a dot for a single tap
    ctx.stroke()
  }

  const moveDraw = (e: RPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const ctx = ctxRef.current
    if (!ctx) return
    const { x, y } = pointFrom(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const endDraw = (e: RPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <motion.div
      className="absolute inset-0 h-full w-full overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${category.bgGradient[0]}, ${category.bgGradient[1]})`,
      }}
      initial={reduce ? { opacity: 0 } : { x: '100%' }}
      animate={reduce ? { opacity: 1 } : { x: 0 }}
      exit={reduce ? { opacity: 0 } : { x: '100%' }}
      transition={
        reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 260, damping: 30 }
      }
    >
      <FloatingShapes accent={category.accent} />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        onPointerDown={startDraw}
        onPointerMove={moveDraw}
        onPointerUp={endDraw}
        onPointerCancel={endDraw}
      />

      <BackButton onClick={onBack} accent={category.accent} />

      <button
        type="button"
        onClick={clear}
        aria-label="Clear the drawing"
        className="absolute right-4 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-soft transition-transform active:scale-95"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 14px)', color: category.accent }}
      >
        <span aria-hidden="true">✨</span>
      </button>

      <div
        className="absolute inset-x-0 bottom-0 z-20 flex flex-wrap justify-center gap-2.5 px-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Pick colour ${c}`}
            onClick={() => setColor(c)}
            className="h-12 w-12 rounded-full border-4 shadow-soft transition-transform active:scale-90"
            style={{ background: c, borderColor: color === c ? '#111827' : '#ffffff' }}
          />
        ))}
      </div>
    </motion.div>
  )
}

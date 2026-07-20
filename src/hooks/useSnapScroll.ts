import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Tracks which snap-scroll card is currently in view inside a vertical
 * `scroll-snap` container, using an IntersectionObserver rooted on the
 * container. Returns the active index so the caller can trigger audio and
 * "pop" animations when a card snaps into place.
 *
 * Attach {@link registerItem} + `data-index` to each snap child and
 * {@link containerRef} to the scroll container.
 */
export function useSnapScroll(itemCount: number) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const registerItem = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      itemRefs.current[index] = el
    },
    [],
  )

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { index: number; ratio: number } | null = null
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number((entry.target as HTMLElement).dataset.index)
          if (Number.isNaN(index)) continue
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index, ratio: entry.intersectionRatio }
          }
        }
        if (best && best.ratio >= 0.55) setActiveIndex(best.index)
      },
      { root, threshold: [0.55, 0.75, 0.95] },
    )

    const els = itemRefs.current.filter(Boolean) as HTMLElement[]
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [itemCount])

  return { containerRef, registerItem, activeIndex }
}

import { useCallback, useEffect, useState } from 'react'

export function useScroll(): { x: number; y: number } {
  const [scroll, setScroll] = useState({ x: 0, y: 0 })
  const handler = useCallback(() => {
    setScroll({ x: window.pageXOffset, y: window.pageYOffset })
  }, [])
  useScrollEffect(handler)
  return scroll
}

export function useScrollEffect(handler: () => void): void {
  useEffect(() => {
    handler()
    document.addEventListener('scroll', handler)
    return () => {
      document.removeEventListener('scroll', handler)
    }
  }, [handler])
}

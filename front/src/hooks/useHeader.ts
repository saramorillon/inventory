import { useContext, useEffect } from 'react'
import { HeaderContext } from '../contexts/HeaderContext'

export function useHeader(title: string, subtitle?: string): void {
  const { setTitle, setSubtitle } = useContext(HeaderContext)

  useEffect(() => {
    document.title = `Inventory - ${title}`
    setTitle(title)
    setSubtitle(subtitle)
  }, [])
}

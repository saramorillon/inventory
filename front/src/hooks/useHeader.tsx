import { useEffect } from 'react'

export function useHeader(title: string, subtitle?: string) {
  useEffect(() => {
    document.title = `Inventory - ${subtitle || title}`
    const header = document.querySelector('header')
    if (header) {
      header.innerHTML = `<h1>${title}</h1>`
      if (subtitle) header.innerHTML += `<p>${subtitle}</p>`
    }
  }, [subtitle, title])
}

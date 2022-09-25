import { useEffect } from 'react'

export function useHeader(title: string, subtitle?: string): void {
  useEffect(() => {
    document.title = `Inventory - ${title}`
    const header = document.querySelector('header')
    if (header) {
      header.innerHTML = `<h1>${title}</h1>`
      if (subtitle) header.innerHTML += `<p>${subtitle}</p>`
    }
  }, [subtitle, title])
}

import React, { useEffect } from 'react'
import { render } from 'react-dom'

export function useHeader(title: string, subtitle?: string): void {
  useEffect(() => {
    document.title = `Inventory - ${title}`
    const header = document.querySelector('header')
    if (header) {
      render(
        <>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </>,
        header
      )
    }
  }, [subtitle, title])
}

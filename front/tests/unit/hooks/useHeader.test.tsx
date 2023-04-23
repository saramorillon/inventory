import { render, renderHook, screen } from '@testing-library/react'
import React from 'react'
import { useHeader } from '../../../src/hooks/useHeader'

describe('useHeader', () => {
  it('should set document title', () => {
    renderHook(() => useHeader('Title'))
    expect(document.title).toBe('Inventory - Title')
  })

  it('should set document title using subtitle', () => {
    renderHook(() => useHeader('Title', 'Subtitle'))
    expect(document.title).toBe('Inventory - Subtitle')
  })

  it('should render title in header', () => {
    render(<header />)
    renderHook(() => useHeader('Title'))
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('should render subtitle in header', () => {
    render(<header />)
    renderHook(() => useHeader('Title', 'Subtitle'))
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
  })
})

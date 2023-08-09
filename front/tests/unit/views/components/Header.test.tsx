import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { Header } from '../../../../src/views/components/Header'

describe('Header', () => {
  it('should render brand and logo', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Inventory' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('img')).toHaveAttribute('src', '/favicon.svg')
  })
})

import { render, screen } from '@testing-library/react'
import React from 'react'
import { Error, Loading, NotFound } from '../../../../src/ui/components/Helpers'

describe('Loading', () => {
  it('should render loading message', () => {
    render(<Loading message="message" />)
    expect(screen.getByText('message')).toBeInTheDocument()
  })
})

describe('NotFound', () => {
  it('should render not found message', () => {
    render(<NotFound message="message" />)
    expect(screen.getByText('message')).toBeInTheDocument()
  })
})

describe('Error', () => {
  it('should render error message', () => {
    render(<Error message="message" />)
    expect(screen.getByText('message')).toBeInTheDocument()
  })
})

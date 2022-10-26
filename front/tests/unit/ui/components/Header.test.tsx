import { useCopy } from '@saramorillon/hooks'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Header } from '../../../../src/ui/components/Header'
import { mock } from '../../../mocks'

jest.mock('@saramorillon/hooks')

describe('Header', () => {
  beforeEach(() => {
    mock(useCopy).mockReturnValue([false, null, jest.fn()])
  })

  it('should render brand and logo', () => {
    render(<Header />)
    expect(screen.getByText('Mini Board')).toBeInTheDocument()
    expect(screen.queryByRole('img')).toHaveAttribute('src', '/favicon.svg')
  })
})

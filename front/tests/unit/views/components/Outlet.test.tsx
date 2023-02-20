import { render, screen } from '@testing-library/react'
import React from 'react'
import { SessionContext } from '../../../../src/contexts/SessionContext'
import { Footer } from '../../../../src/views/components/Footer'
import { Header } from '../../../../src/views/components/Header'
import { PrivateOutlet, PublicOutlet } from '../../../../src/views/components/Outlet'
import { mockSession } from '../../../mocks'

jest.mock('../../../../src/views/components/Header')
jest.mock('../../../../src/views/components/Footer')

beforeEach(() => {
  jest.mocked(Header).mockReturnValue(<span>Header</span>)
  jest.mocked(Footer).mockReturnValue(<span>Footer</span>)
})

describe('PublicOutlet', () => {
  it('should redirect to home page if session', () => {
    render(
      <SessionContext.Provider value={mockSession()}>
        <PublicOutlet />
      </SessionContext.Provider>
    )
    expect(screen.getByText('Navigate to /')).toBeInTheDocument()
  })

  it('should render outlet and footer if no session', () => {
    render(
      <SessionContext.Provider value={null}>
        <PublicOutlet />
      </SessionContext.Provider>
    )
    expect(screen.getByText('Outlet')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})

describe('PrivateOutlet', () => {
  it('should redirect to login page if no session', () => {
    render(
      <SessionContext.Provider value={null}>
        <PrivateOutlet />
      </SessionContext.Provider>
    )
    expect(screen.getByText('Navigate to /login')).toBeInTheDocument()
  })

  it('should render header, outlet and footer if session', () => {
    render(
      <SessionContext.Provider value={mockSession()}>
        <PrivateOutlet />
      </SessionContext.Provider>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Outlet')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})

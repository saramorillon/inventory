import { render, screen } from '@testing-library/react'
import React, { PropsWithChildren } from 'react'
import { SessionContext } from '../../../../src/contexts/SessionContext'
import { ISession } from '../../../../src/models/Session'
import { Footer } from '../../../../src/ui/components/Footer'
import { Header } from '../../../../src/ui/components/Header'
import { PrivateOutlet, PublicOutlet } from '../../../../src/ui/components/Outlet'
import { Login } from '../../../../src/ui/pages/Login'
import { mock } from '../../../mocks'

jest.mock('../../../../src/ui/components/Header')
jest.mock('../../../../src/ui/components/Footer')
jest.mock('../../../../src/ui/pages/Login')

function session(session: ISession | null = null) {
  return function wrapper({ children }: PropsWithChildren) {
    return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  }
}

beforeEach(() => {
  mock(Header).mockReturnValue(<span>Header</span>)
  mock(Footer).mockReturnValue(<span>Footer</span>)
  mock(Login).mockReturnValue(<span>Login</span>)
})

describe('PublicOutlet', () => {
  it('should redirect to home page if session', () => {
    render(<PublicOutlet />, { wrapper: session({ username: 'username' }) })
    expect(screen.getByText('Navigate to /')).toBeInTheDocument()
  })

  it('should render login page if no session', () => {
    render(<PublicOutlet />, { wrapper: session() })
    expect(screen.getByText('Login')).toBeInTheDocument()
  })
})

describe('PrivateOutlet', () => {
  it('should redirect to login page if no session', () => {
    render(<PrivateOutlet />, { wrapper: session() })
    expect(screen.getByText('Navigate to /login')).toBeInTheDocument()
  })

  it('should render header, outlet and footer if session', () => {
    render(<PrivateOutlet />, { wrapper: session({ username: 'username' }) })
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Outlet')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})

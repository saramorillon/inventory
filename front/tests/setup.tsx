import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import React, { PropsWithChildren } from 'react'
import { LinkProps, NavigateProps, NavLinkProps, OutletProps, useParams } from 'react-router-dom'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockNavigate } from './mocks'

expect.extend(matchers)

vi.mock('react-router-dom', async () => {
  const def = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...def,
    Link({ children, to, ...props }: LinkProps) {
      return (
        <a href={to.toString()} {...props}>
          {children}
        </a>
      )
    },
    NavLink({ children, to, ...props }: PropsWithChildren<Omit<NavLinkProps, 'children' | 'className' | 'style'>>) {
      return (
        <a href={to.toString()} {...props}>
          {children}
        </a>
      )
    },
    Navigate({ to, ...props }: NavigateProps) {
      return <span {...props}>Navigate to {to.toString()}</span>
    },
    Outlet(props: OutletProps) {
      return <span {...props}>Outlet</span>
    },
    useParams: vi.fn().mockReturnValue({}),
    useLocation: vi.fn().mockReturnValue({}),
    useNavigate: vi.fn(),
  }
})

beforeEach(() => {
  mockNavigate()
  vi.mocked(useParams).mockReturnValue({})
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
})

import '@testing-library/jest-dom'
import React, { PropsWithChildren } from 'react'
import { LinkProps, NavigateProps, NavLinkProps, OutletProps, useParams } from 'react-router-dom'
import { mockNavigate } from './mocks'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
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
  useParams: jest.fn().mockReturnValue({}),
  useLocation: jest.fn().mockReturnValue({}),
  useNavigate: jest.fn(),
}))

beforeEach(() => {
  mockNavigate()
  jest.mocked(useParams).mockReturnValue({})
  jest.spyOn(console, 'error').mockImplementation(() => undefined)
})

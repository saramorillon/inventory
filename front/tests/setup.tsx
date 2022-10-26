import '@testing-library/jest-dom'
import React from 'react'
import { LinkProps, NavigateProps, useParams } from 'react-router-dom'
import { mock, mockNavigate } from './mocks'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: (props: LinkProps) => <span>{props.children}</span>,
  Navigate: (props: NavigateProps) => <span>Navigate to {props.to.toString()}</span>,
  Outlet: () => 'Outlet',
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}))

beforeEach(() => {
  mockNavigate()
  mock(useParams).mockReturnValue({})
  jest.spyOn(console, 'error').mockImplementation(() => undefined)
})

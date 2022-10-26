import { render, renderHook, screen } from '@testing-library/react'
import React, { PropsWithChildren, useContext } from 'react'
import { SessionContext, SessionProvider } from '../../../src/contexts/SessionContext'
import { getSession } from '../../../src/services/session'
import { mock, wait } from '../../mocks'

jest.mock('../../../src/services/session')

function wrapper({ children }: PropsWithChildren<unknown>) {
  return <SessionProvider>{children}</SessionProvider>
}

describe('SessionContext', () => {
  beforeEach(() => {
    mock(getSession).mockResolvedValue('session')
  })

  it('should show loader when loading', async () => {
    render(<div />, { wrapper })
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
    await wait()
  })

  it('should render children', async () => {
    render(<div>In provider</div>, { wrapper })
    await wait()
    expect(screen.getByText('In provider')).toBeInTheDocument()
  })

  it('should return session', async () => {
    const { result } = renderHook(() => useContext(SessionContext), { wrapper })
    await wait()
    expect(result.current).toEqual('session')
  })
})

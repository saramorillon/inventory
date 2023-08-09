import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SessionContext, SessionProvider } from '../../../src/contexts/SessionContext'
import { getSession } from '../../../src/services/session'
import { mockSession, wait } from '../../mocks'

vi.mock('../../../src/services/session')

describe('SessionContext', () => {
  beforeEach(() => {
    vi.mocked(getSession).mockResolvedValue(mockSession())
  })

  it('should show loader when loading', async () => {
    render(<SessionProvider></SessionProvider>)
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
    await wait()
  })

  it('should render children', async () => {
    render(<SessionProvider>In provider</SessionProvider>)
    await wait()
    expect(screen.getByText('In provider')).toBeInTheDocument()
  })

  it('should return session', async () => {
    render(
      <SessionProvider>
        <SessionContext.Consumer>{(value) => <>{value?.username}</>}</SessionContext.Consumer>
      </SessionProvider>
    )
    await wait()
    expect(screen.getByText('username')).toBeInTheDocument()
  })
})

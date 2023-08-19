import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { login } from '../../../../src/services/session'
import { Login } from '../../../../src/views/pages/Login'
import { mockLocation, restoreLocation, wait } from '../../../mocks'

vi.mock('../../../../src/services/session.ts')

describe('Login', () => {
  beforeEach(() => {
    vi.mocked(login).mockResolvedValue(undefined)
  })

  it('should login when clicking on Log in button', async () => {
    render(<Login />)
    fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'username' } })
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))
    await wait()
    expect(login).toHaveBeenCalledWith('username', 'password')
  })

  it('should reload page after login', async () => {
    const reload = vi.fn()
    mockLocation({ reload })
    render(<Login />)
    fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'username' } })
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))
    await wait()
    expect(reload).toHaveBeenCalled()
    restoreLocation()
  })

  it('should show error in console if login fails', async () => {
    vi.mocked(login).mockRejectedValue(new Error())
    render(<Login />)
    fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'username' } })
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))
    await wait()
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })
})

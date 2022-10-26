import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { login } from '../../../../src/services/session'
import { Login } from '../../../../src/ui/pages/Login'
import { mock, mockLocation, restoreLocation, wait } from '../../../mocks'

jest.mock('../../../../src/services/session.ts')

describe('Login', () => {
  beforeEach(() => {
    mock(login).mockResolvedValue(undefined)
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
    const reload = jest.fn()
    mockLocation({ reload })
    render(<Login />)
    fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'username' } })
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))
    await wait()
    expect(reload).toHaveBeenCalled()
    restoreLocation()
  })

  it('should log error in console if login fails', async () => {
    mock(login).mockRejectedValue(new Error())
    render(<Login />)
    fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'username' } })
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))
    await wait()
    expect(console.error).toHaveBeenCalledWith(new Error())
  })
})

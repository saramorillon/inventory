import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { scanBook } from '../../../../src/services/books'
import { error, existing, Scanner, success } from '../../../../src/views/components/Scanner'
import { wait } from '../../../mocks'

jest.mock('../../../../src/services/books')

describe('Scanner', () => {
  beforeEach(() => {
    jest.mocked(scanBook).mockResolvedValue(true)
    jest.spyOn(error, 'play')
    jest.spyOn(success, 'play').mockResolvedValue(undefined)
    jest.spyOn(existing, 'play')
  })

  it('should scan book on form submit', async () => {
    render(<Scanner refresh={jest.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(scanBook).toHaveBeenCalledWith('isbn')
  })

  it('should buzz on scan error', async () => {
    jest.mocked(scanBook).mockRejectedValue(new Error())
    render(<Scanner refresh={jest.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(error.play).toHaveBeenCalled()
  })

  it('should ding on scan success', async () => {
    render(<Scanner refresh={jest.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(success.play).toHaveBeenCalled()
  })

  it('should refresh if scan success', async () => {
    const refresh = jest.fn()
    render(<Scanner refresh={refresh} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(refresh).toHaveBeenCalled()
  })

  it('should plop if book already exists', async () => {
    jest.mocked(scanBook).mockResolvedValue(false)
    render(<Scanner refresh={jest.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(existing.play).toHaveBeenCalled()
  })

  it('should clear value after scan', async () => {
    render(<Scanner refresh={jest.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(screen.getByPlaceholderText('ISBN')).toHaveValue('')
  })
})

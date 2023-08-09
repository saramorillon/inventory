import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { scanBook } from '../../../../src/services/books'
import { Scanner, error, existing, success } from '../../../../src/views/components/Scanner'
import { wait } from '../../../mocks'

vi.mock('../../../../src/services/books')

describe('Scanner', () => {
  beforeEach(() => {
    vi.mocked(scanBook).mockResolvedValue(true)
    vi.spyOn(error, 'play')
    vi.spyOn(success, 'play').mockResolvedValue(undefined)
    vi.spyOn(existing, 'play')
  })

  it('should scan book on form submit', async () => {
    render(<Scanner refresh={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(scanBook).toHaveBeenCalledWith('isbn')
  })

  it('should buzz on scan error', async () => {
    vi.mocked(scanBook).mockRejectedValue(new Error())
    render(<Scanner refresh={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(error.play).toHaveBeenCalled()
  })

  it('should ding on scan success', async () => {
    render(<Scanner refresh={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(success.play).toHaveBeenCalled()
  })

  it('should refresh if scan success', async () => {
    const refresh = vi.fn()
    render(<Scanner refresh={refresh} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(refresh).toHaveBeenCalled()
  })

  it('should plop if book already exists', async () => {
    vi.mocked(scanBook).mockResolvedValue(false)
    render(<Scanner refresh={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(existing.play).toHaveBeenCalled()
  })

  it('should clear value after scan', async () => {
    render(<Scanner refresh={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('ISBN'), { target: { value: 'isbn' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(screen.getByPlaceholderText('ISBN')).toHaveValue('')
  })
})

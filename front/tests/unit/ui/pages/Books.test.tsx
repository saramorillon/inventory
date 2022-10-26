import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { getBooks } from '../../../../src/services/books'
import { Books } from '../../../../src/ui/pages/Books'
import { mock, mockAuthor, mockBook, wait } from '../../../mocks'

jest.mock('../../../../src/services/books')

describe('Books', () => {
  beforeEach(() => {
    mock(getBooks).mockResolvedValue([mockBook({ updatedAt: '2022-01-01T00:00:00.000Z', authors: [mockAuthor()] })])
  })

  it('should render a loader when loading', async () => {
    render(<Books />)
    expect(screen.getByText('Loading data')).toBeInTheDocument()
    await wait()
  })

  it('should render an error when an error occurred', async () => {
    mock(getBooks).mockRejectedValue(new Error())
    render(<Books />)
    await wait()
    expect(screen.getByText('Error while loading data')).toBeInTheDocument()
  })

  it('should render a not found message if the book is not found', async () => {
    mock(getBooks).mockResolvedValue([])
    render(<Books />)
    await wait()
    expect(screen.getByText('No data for now')).toBeInTheDocument()
  })

  it('should render book serial', async () => {
    render(<Books />)
    await wait()
    expect(screen.getByText('serial')).toBeInTheDocument()
  })

  it('should render book title', async () => {
    render(<Books />)
    await wait()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render book authors', async () => {
    render(<Books />)
    await wait()
    expect(screen.getByText('firstName lastName')).toBeInTheDocument()
  })

  it('should render book last update date', async () => {
    render(<Books />)
    await wait()
    expect(screen.getByText('Jan 1, 2022, 1:00:00 AM')).toBeInTheDocument()
  })

  it('should refresh table when clicking on refresh button', async () => {
    render(<Books />)
    await wait()
    expect(getBooks).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    await wait()
    expect(getBooks).toHaveBeenCalledTimes(2)
  })
})

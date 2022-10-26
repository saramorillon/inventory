import { fireEvent, render, screen } from '@testing-library/react'
import { useBarcode } from 'next-barcode'
import React from 'react'
import { getAuthors } from '../../../../src/services/authors'
import { deleteBook, getBook, saveBook } from '../../../../src/services/books'
import { Book } from '../../../../src/ui/pages/Book'
import { mock, mockAuthor, mockBook, mockNavigate, wait } from '../../../mocks'

jest.mock('../../../../src/services/books')
jest.mock('../../../../src/services/authors')
jest.mock('next-barcode')

describe('Book', () => {
  beforeEach(() => {
    mock(useBarcode).mockReturnValue({})
    mock(saveBook).mockResolvedValue(undefined)
    mock(deleteBook).mockResolvedValue(undefined)
    mock(getBook).mockResolvedValue(mockBook({ authors: [mockAuthor()] }))
    mock(getAuthors).mockResolvedValue([mockAuthor()])
  })

  it('should render a loader when loading', async () => {
    render(<Book />)
    expect(screen.getByText('Loading book')).toBeInTheDocument()
    await wait()
  })

  it('should render an error when an error occurred', async () => {
    mock(getBook).mockRejectedValue(new Error())
    render(<Book />)
    await wait()
    expect(screen.getByText('Error while loading book')).toBeInTheDocument()
  })

  it('should render a not found message if the book is not found', async () => {
    mock(getBook).mockResolvedValue(null)
    render(<Book />)
    await wait()
    expect(screen.getByText('Book not found')).toBeInTheDocument()
  })

  it('should render book source', async () => {
    render(<Book />)
    await wait()
    expect(screen.getByDisplayValue('source')).toBeInTheDocument()
  })

  it('should render book serial', async () => {
    render(<Book />)
    await wait()
    expect(screen.getByDisplayValue('serial')).toBeInTheDocument()
  })

  it('should render book title', async () => {
    render(<Book />)
    await wait()
    expect(screen.getByDisplayValue('title')).toBeInTheDocument()
  })

  it('should render book bar code', async () => {
    render(<Book />)
    await wait()
    expect(screen.getByTitle('serial')).toBeInTheDocument()
  })

  it('should render book authors', async () => {
    render(<Book />)
    await wait()
    expect(screen.getByText('Authors (1)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'firstName lastName' })).toBeInTheDocument()
  })

  it('should save book when clicking on save button', async () => {
    render(<Book />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await wait()
    expect(saveBook).toHaveBeenCalledWith(mockBook({ authors: [mockAuthor()] }))
  })

  it('should refresh after saving book', async () => {
    render(<Book />)
    await wait()
    expect(getBook).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await wait()
    expect(getBook).toHaveBeenCalledTimes(2)
  })

  it('should delete book when clicking on delete button', async () => {
    render(<Book />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(deleteBook).toHaveBeenCalledWith(mockBook({ authors: [mockAuthor()] }))
  })

  it('should for to books page after delete', async () => {
    const navigate = mockNavigate()
    render(<Book />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(navigate).toHaveBeenCalledWith('/books')
  })

  it('should render google page', async () => {
    render(<Book />)
    await wait()
    expect(screen.getByTitle('Google page for "title"')).toBeInTheDocument()
  })
})

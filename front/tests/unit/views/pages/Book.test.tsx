import { fireEvent, render, screen } from '@testing-library/react'
import { useBarcode } from 'next-barcode'
import React from 'react'
import { useParam } from '../../../../src/hooks/useParam'
import { getAuthors } from '../../../../src/services/authors'
import { deleteBook, getBook, saveBook } from '../../../../src/services/books'
import { Book } from '../../../../src/views/pages/Book'
import { mockAuthor, mockBook, mockNavigate, wait } from '../../../mocks'

vi.mock('../../../../src/hooks/useParam')
vi.mock('../../../../src/services/books')
vi.mock('../../../../src/services/authors')
vi.mock('next-barcode')

describe('Book', () => {
  beforeEach(() => {
    vi.mocked(useParam).mockReturnValue('1')
    vi.mocked(useBarcode).mockReturnValue({})
    vi.mocked(saveBook).mockResolvedValue(mockBook())
    vi.mocked(deleteBook).mockResolvedValue(undefined)
    vi.mocked(getBook).mockResolvedValue(mockBook())
    vi.mocked(getAuthors).mockResolvedValue([mockAuthor()])
  })

  it('should render a loader when loading', async () => {
    render(<Book />)
    expect(screen.getByText('Loading book')).toBeInTheDocument()
    await wait()
  })

  it('should render an error when an error occurred', async () => {
    vi.mocked(getBook).mockRejectedValue(new Error())
    render(<Book />)
    await wait()
    expect(screen.getByText('Error while loading book')).toBeInTheDocument()
  })

  it('should render a not found message if the book is not found', async () => {
    vi.mocked(getBook).mockResolvedValue(undefined)
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
    fireEvent.change(screen.getByDisplayValue('serial'), { target: { value: 'serial2' } })
    expect(screen.getByDisplayValue('serial2')).toBeInTheDocument()
  })

  it('should render book title', async () => {
    render(<Book />)
    await wait()
    expect(screen.getByDisplayValue('title')).toBeInTheDocument()
    fireEvent.change(screen.getByDisplayValue('title'), { target: { value: 'title2' } })
    expect(screen.getByDisplayValue('title2')).toBeInTheDocument()
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
    expect(screen.getByText('firstName lastName')).toHaveAttribute('href', '/author/1')
    fireEvent.click(screen.getByLabelText('Remove firstName lastName'))
    expect(screen.getByRole('option', { name: 'firstName lastName', hidden: true })).toBeInTheDocument()
  })

  it('should save book when clicking on save button', async () => {
    render(<Book />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await wait()
    expect(saveBook).toHaveBeenCalledWith(mockBook())
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
    expect(deleteBook).toHaveBeenCalledWith(mockBook())
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

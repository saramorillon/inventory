import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { deleteAuthor, getAuthor, saveAuthor } from '../../../../src/services/authors'
import { getBooks } from '../../../../src/services/books'
import { Author } from '../../../../src/ui/pages/Author'
import { mock, mockAuthor, mockBook, mockNavigate, wait } from '../../../mocks'

jest.mock('../../../../src/services/authors')
jest.mock('../../../../src/services/books')

describe('Author', () => {
  beforeEach(() => {
    mock(saveAuthor).mockResolvedValue(undefined)
    mock(deleteAuthor).mockResolvedValue(undefined)
    mock(getAuthor).mockResolvedValue(mockAuthor({ books: [mockBook()] }))
    mock(getBooks).mockResolvedValue([mockBook()])
  })

  it('should render a loader when loading', async () => {
    render(<Author />)
    expect(screen.getByText('Loading author')).toBeInTheDocument()
    await wait()
  })

  it('should render an error when an error occurred', async () => {
    mock(getAuthor).mockRejectedValue(new Error())
    render(<Author />)
    await wait()
    expect(screen.getByText('Error while loading author')).toBeInTheDocument()
  })

  it('should render a not found message if the author is not found', async () => {
    mock(getAuthor).mockResolvedValue(null)
    render(<Author />)
    await wait()
    expect(screen.getByText('Author not found')).toBeInTheDocument()
  })

  it('should render author first name', async () => {
    render(<Author />)
    await wait()
    expect(screen.getByDisplayValue('firstName')).toBeInTheDocument()
  })

  it('should render author last name', async () => {
    render(<Author />)
    await wait()
    expect(screen.getByDisplayValue('lastName')).toBeInTheDocument()
  })

  it('should render author books', async () => {
    render(<Author />)
    await wait()
    expect(screen.getByText('Books (1)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'title' })).toBeInTheDocument()
  })

  it('should save author when clicking on save button', async () => {
    render(<Author />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await wait()
    expect(saveAuthor).toHaveBeenCalledWith(mockAuthor({ books: [mockBook()] }))
  })

  it('should refresh after saving author', async () => {
    render(<Author />)
    await wait()
    expect(getAuthor).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await wait()
    expect(getAuthor).toHaveBeenCalledTimes(2)
  })

  it('should delete author when clicking on delete button', async () => {
    render(<Author />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(deleteAuthor).toHaveBeenCalledWith(mockAuthor({ books: [mockBook()] }))
  })

  it('should for to authors page after delete', async () => {
    const navigate = mockNavigate()
    render(<Author />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(navigate).toHaveBeenCalledWith('/authors')
  })
})

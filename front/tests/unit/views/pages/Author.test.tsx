import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { deleteAuthor, getAuthor, saveAuthor } from '../../../../src/services/authors'
import { getBooks } from '../../../../src/services/books'
import { Author } from '../../../../src/views/pages/Author'
import { mockAuthor, mockBook, mockNavigate, wait } from '../../../mocks'

vi.mock('../../../../src/services/authors')
vi.mock('../../../../src/services/books')

describe('Author', () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ id: '1' })
    vi.mocked(saveAuthor).mockResolvedValue(mockAuthor())
    vi.mocked(deleteAuthor).mockResolvedValue(undefined)
    vi.mocked(getAuthor).mockResolvedValue(mockAuthor())
    vi.mocked(getBooks).mockResolvedValue([mockBook()])
  })

  it('should render a loader when loading', async () => {
    render(<Author />)
    expect(screen.getByText('Loading author')).toBeInTheDocument()
    await wait()
  })

  it('should render an error when an error occurred', async () => {
    vi.mocked(getAuthor).mockRejectedValue(new Error())
    render(<Author />)
    await wait()
    expect(screen.getByText('Error while loading author')).toBeInTheDocument()
  })

  it('should render a not found message if id is not empty and the author is not found', async () => {
    vi.mocked(getAuthor).mockResolvedValue(undefined)
    render(<Author />)
    await wait()
    expect(screen.getByText('Author not found')).toBeInTheDocument()
  })

  it('should not render a not found message if id is empty and the author is not found', async () => {
    vi.mocked(useParams).mockReturnValue({})
    vi.mocked(getAuthor).mockResolvedValue(undefined)
    render(<Author />)
    await wait()
    expect(screen.queryByText('Author not found')).not.toBeInTheDocument()
  })

  it('should render author first name', async () => {
    render(<Author />)
    await wait()
    expect(screen.getByDisplayValue('firstName')).toBeInTheDocument()
    fireEvent.change(screen.getByDisplayValue('firstName'), { target: { value: 'firstName2' } })
    expect(screen.getByDisplayValue('firstName2')).toBeInTheDocument()
  })

  it('should render author last name', async () => {
    render(<Author />)
    await wait()
    expect(screen.getByDisplayValue('lastName')).toBeInTheDocument()
    fireEvent.change(screen.getByDisplayValue('lastName'), { target: { value: 'lastName2' } })
    expect(screen.getByDisplayValue('lastName2')).toBeInTheDocument()
  })

  it('should render author books', async () => {
    render(<Author />)
    await wait()
    expect(screen.getByText('Books (1)')).toBeInTheDocument()
    expect(screen.getByText('title')).toHaveAttribute('href', '/book/1')
    fireEvent.click(screen.getByLabelText('Remove title'))
    expect(screen.getByRole('option', { name: 'title', hidden: true })).toBeInTheDocument()
  })

  it('should save author when clicking on save button', async () => {
    render(<Author />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await wait()
    expect(saveAuthor).toHaveBeenCalledWith(mockAuthor())
  })

  it('should refresh after updating author', async () => {
    render(<Author />)
    await wait()
    expect(getAuthor).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await wait()
    expect(getAuthor).toHaveBeenCalledTimes(2)
  })

  it('should redirect to author page after creating author', async () => {
    vi.mocked(useParams).mockReturnValue({})
    vi.mocked(getAuthor).mockResolvedValue(undefined)
    const navigate = mockNavigate()
    render(<Author />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await wait()
    expect(navigate).toHaveBeenCalledWith('/author/1')
  })

  it('should not render delete delete button is author is empty', async () => {
    vi.mocked(useParams).mockReturnValue({})
    vi.mocked(getAuthor).mockResolvedValue(undefined)
    render(<Author />)
    await wait()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('should delete author when clicking on delete button', async () => {
    render(<Author />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(deleteAuthor).toHaveBeenCalledWith(mockAuthor())
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

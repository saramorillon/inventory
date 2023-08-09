import { describe, expect, it, vi } from 'vitest'
import { Axios } from '../../../src/services/Axios'
import { deleteBook, getBook, getBooks, saveBook, scanBook } from '../../../src/services/books'
import { mockBook } from '../../mocks'

vi.mock('../../../src/services/Axios')

describe('getBooks', () => {
  it('should get books', async () => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'books' })
    await getBooks()
    expect(Axios.get).toHaveBeenCalledWith('/api/books')
  })

  it('should return books', async () => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'books' })
    const result = await getBooks()
    expect(result).toBe('books')
  })
})

describe('getBook', () => {
  it('should get book', async () => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'book' })
    await getBook('id')
    expect(Axios.get).toHaveBeenCalledWith('/api/books/id')
  })

  it('should return book', async () => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'book' })
    const result = await getBook('id')
    expect(result).toBe('book')
  })
})

describe('saveBook', () => {
  it('should update book', async () => {
    vi.mocked(Axios.put).mockResolvedValue({ data: 'book' })
    await saveBook(mockBook({ id: 1 }))
    expect(Axios.put).toHaveBeenCalledWith('/api/books/1', mockBook())
  })

  it('should return updated book', async () => {
    vi.mocked(Axios.put).mockResolvedValue({ data: 'book' })
    const result = await saveBook(mockBook({ id: 1 }))
    expect(result).toBe('book')
  })
})

describe('scanBook', () => {
  it('should create book', async () => {
    vi.mocked(Axios.post).mockResolvedValue({ status: 201 })
    await scanBook('serial')
    expect(Axios.post).toHaveBeenCalledWith('/api/books', { serial: 'serial' })
  })

  it('should return true if book was created', async () => {
    vi.mocked(Axios.post).mockResolvedValue({ status: 201 })
    const result = await scanBook('serial')
    expect(result).toBe(true)
  })

  it('should return false if book already existed', async () => {
    vi.mocked(Axios.post).mockResolvedValue({ status: 204 })
    const result = await scanBook('serial')
    expect(result).toBe(false)
  })
})

describe('deleteBook', () => {
  it('should delete book', async () => {
    await deleteBook(mockBook())
    expect(Axios.delete).toHaveBeenCalledWith('/api/books/1')
  })
})

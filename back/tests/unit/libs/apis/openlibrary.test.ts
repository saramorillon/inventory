import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OpenLibrary } from '../../../../src/libs/apis/openlibrary'

vi.mock('axios')

describe('search', () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { ['ISBN:isbn']: { title: 'title', authors: [{ name: 'author' }] } },
    })
  })

  it('should search isbn', async () => {
    await new OpenLibrary().search('isbn')
    expect(axios.get).toHaveBeenCalledWith('https://openlibrary.org/api/books', {
      params: { bibkeys: 'ISBN:isbn', format: 'json', jscmd: 'data' },
    })
  })

  it('should return null if title is empty', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { ['ISBN:isbn']: { authors: [{ name: 'author' }] } } })
    const result = await new OpenLibrary().search('isbn')
    expect(result).toBeNull()
  })

  it('should return title and subtitle if subtitle is present', async () => {
    const result = await new OpenLibrary().search('isbn')
    expect(result).toEqual({ authors: ['author'], isbn: 'isbn', source: 'openlibrary', title: 'title' })
  })

  it('should return sanitized authors', async () => {
    const result = await new OpenLibrary().search('isbn')
    expect(result).toEqual({ authors: ['author'], isbn: 'isbn', source: 'openlibrary', title: 'title' })
  })

  it('should return null if error', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('500'))
    const result = await new OpenLibrary().search('isbn')
    expect(result).toBeNull()
  })
})

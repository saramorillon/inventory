import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GoogleApi } from '../../../../src/libs/apis/google'

vi.mock('axios')

describe('search', () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { items: [{ volumeInfo: { title: 'title', authors: ['author'] } }] },
    })
  })

  it('should search isbn', async () => {
    await new GoogleApi().search('isbn')
    expect(axios.get).toHaveBeenCalledWith('https://www.googleapis.com/books/v1/volumes', {
      params: { q: 'isbn:isbn' },
    })
  })

  it('should return null if title is empty', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { items: [{ volumeInfo: { authors: ['author'] } }] } })
    const result = await new GoogleApi().search('isbn')
    expect(result).toBeNull()
  })

  it('should return title and subtitle if subtitle is present', async () => {
    const result = await new GoogleApi().search('isbn')
    expect(result).toEqual({ authors: ['author'], isbn: 'isbn', source: 'google', title: 'title' })
  })

  it('should return sanitized authors', async () => {
    const result = await new GoogleApi().search('isbn')
    expect(result).toEqual({ authors: ['author'], isbn: 'isbn', source: 'google', title: 'title' })
  })

  it('should return null if error', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('500'))
    const result = await new GoogleApi().search('isbn')
    expect(result).toBeNull()
  })
})

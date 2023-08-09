import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WorlCatApi } from '../../../../src/libs/apis/worldcat'

vi.mock('axios')

describe('search', () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockResolvedValue({
      data: `<classify><works><work author="author" title="title" /></works></classify>`,
    })
  })

  it('should search isbn', async () => {
    await new WorlCatApi().search('isbn')
    expect(axios.get).toHaveBeenCalledWith('http://classify.oclc.org/classify2/Classify', { params: { isbn: 'isbn' } })
  })

  it('should return null if title is empty', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: `<classify><works><work author="author" /></works></classify>` })
    const result = await new WorlCatApi().search('isbn')
    expect(result).toBeNull()
  })

  it('should return title and subtitle if subtitle is present', async () => {
    const result = await new WorlCatApi().search('isbn')
    expect(result).toEqual({ authors: ['author'], isbn: 'isbn', source: 'worldcat', title: 'title' })
  })

  it('should return sanitized authors', async () => {
    const result = await new WorlCatApi().search('isbn')
    expect(result).toEqual({ authors: ['author'], isbn: 'isbn', source: 'worldcat', title: 'title' })
  })

  it('should return null if error', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('500'))
    const result = await new WorlCatApi().search('isbn')
    expect(result).toBeNull()
  })
})

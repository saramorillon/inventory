import axios from 'axios'
import { IsbnDbApi } from '../../../../src/libs/apis/isbndb'
import { mock } from '../../../mocks'

jest.mock('axios')

describe('search', () => {
  beforeEach(() => {
    mock(axios.get).mockResolvedValue({ data: { book: { title: 'title', authors: ['author'] } } })
  })

  it('should search isbn', async () => {
    await new IsbnDbApi().search('isbn')
    expect(axios.get).toHaveBeenCalledWith('https://api2.isbndb.com/book/isbn', {
      headers: { Authorization: 'isbn-token' },
    })
  })

  it('should return null if title is empty', async () => {
    mock(axios.get).mockResolvedValue({ data: { book: { authors: ['author'] } } })
    const result = await new IsbnDbApi().search('isbn')
    expect(result).toBeNull()
  })

  it('should return title and subtitle if subtitle is present', async () => {
    const result = await new IsbnDbApi().search('isbn')
    expect(result).toEqual({ authors: ['author'], isbn: 'isbn', source: 'isbndb', title: 'title' })
  })

  it('should return sanitized authors', async () => {
    const result = await new IsbnDbApi().search('isbn')
    expect(result).toEqual({ authors: ['author'], isbn: 'isbn', source: 'isbndb', title: 'title' })
  })

  it('should return null if error', async () => {
    mock(axios.get).mockRejectedValue(new Error('500'))
    const result = await new IsbnDbApi().search('isbn')
    expect(result).toBeNull()
  })
})

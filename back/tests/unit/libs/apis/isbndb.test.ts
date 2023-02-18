import axios from 'axios'
import { IsbnDbApi } from '../../../../src/libs/apis/isbndb'
import { mock, mockSession } from '../../../mocks'

jest.mock('axios')

describe('search', () => {
  beforeEach(() => {
    mock(axios.get).mockResolvedValue({ data: { book: { title: 'title', authors: ['author'] } } })
  })

  it('should return null if no session', async () => {
    const result = await new IsbnDbApi().search('isbn')
    expect(axios.get).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('should return null if session has no token', async () => {
    const result = await new IsbnDbApi().search('isbn', mockSession({ isbndbToken: null }))
    expect(axios.get).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('should search isbn', async () => {
    await new IsbnDbApi().search('isbn', mockSession())
    expect(axios.get).toHaveBeenCalledWith('https://api2.isbndb.com/book/isbn', {
      headers: { Authorization: 'token' },
    })
  })

  it('should return null if title is empty', async () => {
    mock(axios.get).mockResolvedValue({ data: { book: { authors: ['author'] } } })
    const result = await new IsbnDbApi().search('isbn', mockSession())
    expect(result).toBeNull()
  })

  it('should return title and subtitle if subtitle is present', async () => {
    const result = await new IsbnDbApi().search('isbn', mockSession())
    expect(result).toEqual({ authors: ['author'], isbn: 'isbn', source: 'isbndb', title: 'title' })
  })

  it('should return sanitized authors', async () => {
    const result = await new IsbnDbApi().search('isbn', mockSession())
    expect(result).toEqual({ authors: ['author'], isbn: 'isbn', source: 'isbndb', title: 'title' })
  })

  it('should return null if error', async () => {
    mock(axios.get).mockRejectedValue(new Error('500'))
    const result = await new IsbnDbApi().search('isbn', mockSession())
    expect(result).toBeNull()
  })
})

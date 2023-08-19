import { GoogleApi } from '../../../src/libs/apis/google'
import { IsbnDbApi } from '../../../src/libs/apis/isbndb'
import { OpenLibrary } from '../../../src/libs/apis/openlibrary'
import { WorlCatApi } from '../../../src/libs/apis/worldcat'
import { isbnSearch } from '../../../src/libs/isbn'
import { mockApiResult, mockSession } from '../../mocks'

describe('isbnSearch', () => {
  beforeEach(() => {
    vi.spyOn(IsbnDbApi.prototype, 'search').mockResolvedValue(null)
    vi.spyOn(GoogleApi.prototype, 'search').mockResolvedValue(null)
    vi.spyOn(OpenLibrary.prototype, 'search').mockResolvedValue(null)
    vi.spyOn(WorlCatApi.prototype, 'search').mockResolvedValue(null)
  })

  it('should search in each api', async () => {
    await isbnSearch('isbn', mockSession())
    expect(IsbnDbApi.prototype.search).toHaveBeenCalledWith('isbn', mockSession())
    expect(GoogleApi.prototype.search).toHaveBeenCalledWith('isbn', mockSession())
    expect(OpenLibrary.prototype.search).toHaveBeenCalledWith('isbn', mockSession())
    expect(WorlCatApi.prototype.search).toHaveBeenCalledWith('isbn', mockSession())
  })

  it('should merge api results', async () => {
    vi.spyOn(IsbnDbApi.prototype, 'search').mockResolvedValue(mockApiResult({ authors: [] }))
    vi.spyOn(GoogleApi.prototype, 'search').mockResolvedValue(mockApiResult({ title: '' }))
    const result = await isbnSearch('isbn')
    expect(result).toEqual({ isbn: 'isbn', title: '', authors: ['author'], source: 'source' })
  })

  it('should return first result', async () => {
    vi.spyOn(IsbnDbApi.prototype, 'search').mockResolvedValue(mockApiResult())
    vi.spyOn(GoogleApi.prototype, 'search').mockResolvedValue(mockApiResult({ title: 'title2' }))
    const result = await isbnSearch('isbn')
    expect(result).toEqual({ isbn: 'isbn', title: 'title', authors: ['author'], source: 'source' })
  })
})

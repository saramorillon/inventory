import { deleteAuthor, getAuthor, getAuthors, saveAuthor } from '../../../src/services/authors'
import { Axios } from '../../../src/services/Axios'
import { mock, mockAuthor } from '../../mocks'

jest.mock('../../../src/services/Axios')

describe('getAuthors', () => {
  it('should get authors', async () => {
    mock(Axios.get).mockResolvedValue({ data: 'authors' })
    await getAuthors()
    expect(Axios.get).toHaveBeenCalledWith('/api/authors')
  })

  it('should return authors', async () => {
    mock(Axios.get).mockResolvedValue({ data: 'authors' })
    const result = await getAuthors()
    expect(result).toBe('authors')
  })
})

describe('getAuthor', () => {
  it('should get author', async () => {
    mock(Axios.get).mockResolvedValue({ data: 'author' })
    await getAuthor('id')
    expect(Axios.get).toHaveBeenCalledWith('/api/authors/id')
  })

  it('should return author', async () => {
    mock(Axios.get).mockResolvedValue({ data: 'author' })
    const result = await getAuthor('id')
    expect(result).toBe('author')
  })
})

describe('saveAuthor', () => {
  it('should update author', async () => {
    mock(Axios.put).mockResolvedValue({ data: 'author' })
    await saveAuthor(mockAuthor({ id: 1 }))
    expect(Axios.put).toHaveBeenCalledWith('/api/authors/1', mockAuthor())
  })

  it('should return updated author', async () => {
    mock(Axios.put).mockResolvedValue({ data: 'author' })
    const result = await saveAuthor(mockAuthor({ id: 1 }))
    expect(result).toBe('author')
  })
})

describe('deleteAuthor', () => {
  it('should delete author', async () => {
    await deleteAuthor(mockAuthor())
    expect(Axios.delete).toHaveBeenCalledWith('/api/authors/1')
  })
})

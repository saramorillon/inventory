import { IAuthor } from '../models/Author'
import { Axios } from './Axios'

export async function getAuthors(params?: Record<string, unknown>): Promise<IAuthor[]> {
  return Axios.get('/api/authors', { params })
}

export async function getAuthor(id?: number): Promise<IAuthor | undefined> {
  if (!id) return
  return Axios.get(`/api/authors/${id}`)
}

export async function putAuthor(author: Partial<IAuthor>): Promise<IAuthor> {
  return Axios.put(`/api/authors/${author.id || ''}`, author)
}

export async function deleteAuthor(author: IAuthor): Promise<void> {
  return Axios.delete(`/api/authors/${author.id}`)
}

export async function refreshAuthor(author: IAuthor): Promise<void> {
  return Axios.put('/api/authors', author, { params: { refresh: true } })
}

export async function uploadAuthors(file: File): Promise<void> {
  const data = new FormData()
  data.append('file', file, file.name)
  return Axios.post('/api/authors', data)
}

export async function mergeAuthors(authors: IAuthor[]): Promise<number> {
  return Axios.post('/api/authors/merge', { authors })
}

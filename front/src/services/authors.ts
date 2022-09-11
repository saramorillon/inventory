import { IAuthor } from '../models/Author'
import { request } from './wrapper'

export function getAuthors(params?: Record<string, unknown>): Promise<IAuthor[]> {
  return request<IAuthor[]>({ url: '/api/authors', params })
}

export function getAuthor(id?: number): Promise<IAuthor | null> {
  if (!id) return Promise.resolve(null)
  return request<IAuthor | null>({ url: `/api/authors/${id}` })
}

export function saveAuthor(author: IAuthor): Promise<IAuthor> {
  if (author.id) return request<IAuthor>({ method: 'PUT', url: `/api/authors/${author.id}`, data: author })
  return request<IAuthor>({ method: 'POST', url: '/api/authors', data: author })
}

export async function deleteAuthor(author: IAuthor): Promise<void> {
  await request({ method: 'DELETE', url: `/api/authors/${author.id}` })
}

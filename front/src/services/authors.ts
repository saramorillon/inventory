import type { IAuthor } from '../models/Author'
import { Axios } from './Axios'

export async function getAuthors() {
  const { data } = await Axios.get<IAuthor[]>('/api/authors')
  return data
}

export async function getAuthor(id: string) {
  if (!id) return null
  const { data } = await Axios.get<IAuthor | null>(`/api/authors/${id}`)
  return data
}

export async function saveAuthor(author: IAuthor) {
  if (author.id) {
    const { data } = await Axios.put<IAuthor>(`/api/authors/${author.id}`, author)
    return data
  }
  const { data } = await Axios.post<IAuthor>('/api/authors', author)
  return data
}

export async function deleteAuthor(author: IAuthor) {
  await Axios.delete(`/api/authors/${author.id}`)
}

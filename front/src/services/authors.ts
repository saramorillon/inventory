import { IAuthor } from '../models/Author'
import { Axios } from './Axios'

export async function getAuthors(): Promise<IAuthor[]> {
  const { data } = await Axios.get<IAuthor[]>('/api/authors')
  return data
}

export async function getAuthor(id: string): Promise<IAuthor | null> {
  const { data } = await Axios.get<IAuthor>(`/api/authors/${id}`)
  return data
}

export async function saveAuthor(author: IAuthor): Promise<IAuthor> {
  const { data } = await Axios.put<IAuthor>(`/api/authors/${author.id}`, author)
  return data
}

export async function deleteAuthor(author: IAuthor): Promise<void> {
  await Axios.delete(`/api/authors/${author.id}`)
}

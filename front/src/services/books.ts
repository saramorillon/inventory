import type { IBook } from '../models/Book'
import { Axios } from './Axios'

export async function getBooks() {
  const { data } = await Axios.get<IBook[]>('/api/books')
  return data
}

export async function getBook(id: string) {
  if (!id) return null
  const { data } = await Axios.get<IBook | null>(`/api/books/${id}`)
  return data
}

export async function saveBook(book: IBook) {
  if (book.id) {
    const { data } = await Axios.put<IBook>(`/api/books/${book.id}`, book)
    return data
  }
  const { data } = await Axios.post<IBook>('/api/books', book)
  return data
}

export async function scanBook(serial: string) {
  const { status } = await Axios.post<IBook[]>('/api/books', { serial })
  return status === 201
}

export async function deleteBook(book: IBook) {
  await Axios.delete(`/api/books/${book.id}`)
}

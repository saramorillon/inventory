import { IBook } from '../models/Book'
import { Axios } from './Axios'

export async function getBooks(): Promise<IBook[]> {
  const { data } = await Axios.get<IBook[]>('/api/books')
  return data
}

export async function getBook(id: string): Promise<IBook | null> {
  const { data } = await Axios.get<IBook>(`/api/books/${id}`)
  return data
}

export async function saveBook(book: IBook): Promise<IBook> {
  const { data } = await Axios.put<IBook>(`/api/books/${book.id}`, book)
  return data
}

export async function scanBook(serial: string): Promise<boolean> {
  const { status } = await Axios.post<IBook[]>('/api/books', { serial })
  return status === 201
}

export async function deleteBook(book: IBook): Promise<void> {
  await Axios.delete(`/api/books/${book.id}`)
}

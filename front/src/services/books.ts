import { IBook } from '../models/Book'
import { ICompare } from '../models/Compare'
import { Axios } from './Axios'

export async function getBooks(params?: Record<string, unknown>): Promise<IBook[]> {
  return Axios.get('/api/books', { params })
}

export async function getBook(id?: number): Promise<IBook | undefined> {
  if (!id) return
  return Axios.get(`/api/books/${id}`)
}

export async function putBook(book: Partial<IBook>): Promise<IBook> {
  return Axios.put(`/api/books/${book.id || ''}`, book)
}

export async function deleteBook(book: IBook): Promise<void> {
  return Axios.delete(`/api/books/${book.id}`)
}

export async function refreshBook(book: IBook): Promise<void> {
  return Axios.put('/api/books', book, { params: { refresh: true } })
}

export async function uploadBooks(file: File): Promise<void> {
  const data = new FormData()
  data.append('file', file, file.name)
  return Axios.post('/api/books', data)
}

export async function compareBooks(serial?: string): Promise<ICompare[]> {
  return Axios.get('/api/books/compare', { params: { serial } })
}

import { IBook } from '../models/Book'
import { request } from './wrapper'

export function getBooks(): Promise<IBook[]> {
  return request<IBook[]>({ url: '/api/books' })
}

export function getBook(id?: number): Promise<IBook | null> {
  if (!id) return Promise.resolve(null)
  return request<IBook | null>({ url: `/api/books/${id}` })
}

export function saveBook(book: IBook): Promise<IBook> {
  if (!book.id) return request<IBook>({ method: 'POST', url: '/api/books', data: book })
  return request<IBook>({ method: 'PUT', url: `/api/books/${book.id}`, data: book })
}

export async function deleteBook(book: IBook): Promise<void> {
  await request({ method: 'DELETE', url: `/api/books/${book.id}` })
}

export function scanBook(serial: string): Promise<boolean> {
  return request<boolean>({ method: 'POST', url: `/api/books`, data: { serial } })
}

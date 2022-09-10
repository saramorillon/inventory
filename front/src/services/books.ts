import { IBook } from '../models/Book'
import { request } from './wrapper'

export function getBooks(params?: Record<string, unknown>): Promise<IBook[]> {
  return request<IBook[]>({ url: '/api/books', params })
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

export async function refreshBook(book: IBook): Promise<void> {
  await request({ method: 'PUT', url: '/api/books', params: { refresh: true }, data: book })
}

export async function scanBook(serial: string): Promise<void> {
  await request({ method: 'POST', url: `/api/books`, data: { serial } })
}

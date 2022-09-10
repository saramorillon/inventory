import { fullName, IAuthor } from './Author'

export type IBook = {
  id: number
  serial: string
  title: string
  authors?: IAuthor[]
  source: string
  createdAt?: string
  updatedAt?: string
}

export type BookFilter = {
  serial: string
  title: string
  authors: string
  updatedAt: string
}

export function filterBook(book: IBook, filters: BookFilter) {
  return Boolean(
    book.serial.toLowerCase().includes(filters.serial.toLowerCase()) &&
      book.authors?.map(fullName).join(' ').toLowerCase().includes(filters.authors.toLowerCase()) &&
      book.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      book.updatedAt?.toLowerCase().includes(filters.updatedAt.toLowerCase())
  )
}

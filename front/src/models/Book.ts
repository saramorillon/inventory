import { type IAuthor, fullName } from './Author'

export type IBook = {
  id: number
  serial: string
  title: string
  authors: IAuthor[]
  source: string
  createdAt: string
  updatedAt: string
}

export function authors(book: IBook) {
  return book.authors.map(fullName).join(', ')
}

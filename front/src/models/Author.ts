import { IBook } from './Book'

export type IAuthor = {
  id: number
  firstName: string
  lastName: string
  books?: IBook[]
  createdAt?: string
  updatedAt?: string
}

export function fullName(author: Partial<IAuthor>): string {
  return [author.firstName, author.lastName].filter(Boolean).join(' ')
}

export type AuthorFilter = {
  id: string
  fullName: string
  firstName: string
  lastName: string
  updatedAt: string
}

export function filterAuthor(author: IAuthor, filters: AuthorFilter) {
  return Boolean(
    author.id.toString().includes(filters.id.toLowerCase()) &&
      fullName(author).toLowerCase().includes(filters.fullName.toLowerCase()) &&
      author.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) &&
      author.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) &&
      author.updatedAt?.toLowerCase().includes(filters.updatedAt.toLowerCase())
  )
}

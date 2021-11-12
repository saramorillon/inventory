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

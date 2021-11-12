import { IAuthor } from './Author'

export type IBook = {
  id: number
  serial: string
  title: string
  subtitle: string | null
  authors?: IAuthor[]
  source: string
  createdAt?: string
  updatedAt?: string
}

export function fullTitle(author: Partial<IBook>): string {
  return [author.title, author.subtitle].filter(Boolean).join(' - ')
}

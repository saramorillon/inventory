import { IAuthor } from './Author'

export type IBook = {
  id: number
  serial: string
  title: string
  authors?: IAuthor[]
  source: string
  createdAt?: string
  updatedAt?: string
}

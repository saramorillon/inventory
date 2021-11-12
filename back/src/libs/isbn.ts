import merge from 'lodash.merge'
import { IApi, IApiResult } from './apis/Api'
import { GoogleApi } from './apis/google'
import { IsbnDbApi } from './apis/isbndb'
import { OpenLibrary } from './apis/openlibrary'
import { WorlCatApi } from './apis/worldcat'
import { logger } from './logger'

const apis: IApi[] = [new IsbnDbApi(), new GoogleApi(), new OpenLibrary(), new WorlCatApi()]

export function isIsbn(identifier: string): boolean {
  return /97(8|9)\d{10}/.test(identifier)
}

export async function isbnSearch(isbn: string): Promise<IApiResult | undefined> {
  let book: IApiResult | undefined
  for (const api of apis) {
    try {
      const result = await api.search(isbn)
      if (result) book = merge(book, result)
      if (book?.title && book?.authors) break
    } catch (error) {
      logger.error('isbn_search_error', { api: api.source, error })
    }
  }
  return book
}

export async function isbnCompare(isbn: string): Promise<IApiResult[]> {
  const books: IApiResult[] = []
  for (const api of apis) {
    try {
      const result = await api.search(isbn)
      if (result) books.push(result)
    } catch (error) {
      logger.error('isbn_search_error', { api: api.source, error })
    }
  }
  return books
}

import merge from 'lodash.merge'
import type { IApi, IApiResult } from './apis/Api'
import { GoogleApi } from './apis/google'
import { OpenLibrary } from './apis/openlibrary'
import { WorlCatApi } from './apis/worldcat'

const apis: IApi[] = [new GoogleApi(), new OpenLibrary(), new WorlCatApi()]

export async function isbnSearch(isbn: string): Promise<IApiResult | undefined> {
  let book: IApiResult | undefined
  for (const api of apis) {
    const result = await api.search(isbn)
    book = merge(book, result)
    if (book?.title && book?.authors.length) break
  }
  return book
}

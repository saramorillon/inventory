import merge from 'lodash.merge'
import type { ISession } from '../models/Session'
import type { IApi, IApiResult } from './apis/Api'
import { GoogleApi } from './apis/google'
import { IsbnDbApi } from './apis/isbndb'
import { OpenLibrary } from './apis/openlibrary'
import { WorlCatApi } from './apis/worldcat'

const apis: IApi[] = [new IsbnDbApi(), new GoogleApi(), new OpenLibrary(), new WorlCatApi()]

export async function isbnSearch(isbn: string, user?: ISession): Promise<IApiResult | undefined> {
  let book: IApiResult | undefined
  for (const api of apis) {
    const result = await api.search(isbn, user)
    book = merge(book, result)
    if (book?.title && book?.authors.length) break
  }
  return book
}

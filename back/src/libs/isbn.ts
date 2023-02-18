import merge from 'lodash.merge'
import { IApi, IApiResult } from './apis/Api'
import { GoogleApi } from './apis/google'
import { IsbnDbApi } from './apis/isbndb'
import { OpenLibrary } from './apis/openlibrary'
import { WorlCatApi } from './apis/worldcat'

const apis: IApi[] = [new IsbnDbApi(), new GoogleApi(), new OpenLibrary(), new WorlCatApi()]

export async function isbnSearch(isbn: string, session?: Express.User): Promise<IApiResult | undefined> {
  let book: IApiResult | undefined
  for (const api of apis) {
    const result = await api.search(isbn, session)
    book = merge(book, result)
    if (book?.title && book?.authors.length) break
  }
  return book
}

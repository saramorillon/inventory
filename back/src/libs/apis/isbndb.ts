import axios from 'axios'
import type { ISession } from '../../models/Session'
import { type IApi, type IApiResult, sanitize } from './Api'

type Response = {
  book?: {
    title: string
    title_long: string
    authors: string[]
  }
}

export class IsbnDbApi implements IApi {
  limit = 1
  source = 'isbndb'
  url = 'https://api2.isbndb.com/book'

  async search(isbn: string, user?: ISession): Promise<IApiResult | null> {
    if (!user?.isbndbToken) {
      return null
    }
    try {
      const response = await axios.get<Response>(`${this.url}/${isbn}`, {
        headers: { Authorization: user.isbndbToken },
      })
      const { title, title_long, authors } = response.data.book || {}
      const fullTitle = title_long ?? title
      if (!fullTitle) return null
      return {
        isbn,
        title: fullTitle,
        authors: (authors || []).flatMap(sanitize),
        source: this.source,
      }
    } catch (error) {
      return null
    }
  }
}

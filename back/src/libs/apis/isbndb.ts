import axios from 'axios'
import { IApi, IApiResult, sanitize } from './Api'

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

  async search(isbn: string, session?: Express.User): Promise<IApiResult | null> {
    if (!session?.isbndbToken) {
      return null
    }
    try {
      const response = await axios.get<Response>(`${this.url}/${isbn}`, {
        headers: { Authorization: session.isbndbToken },
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

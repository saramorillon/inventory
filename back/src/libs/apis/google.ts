import axios from 'axios'
import { IApi, IApiResult, sanitize } from './Api'

type Response = {
  items?: [
    {
      volumeInfo: {
        title: string
        subtitle?: string
        authors: string[]
      }
    },
  ]
}

export class GoogleApi implements IApi {
  limit = 1
  source = 'google'
  url = 'https://www.googleapis.com/books/v1/volumes'

  async search(isbn: string): Promise<IApiResult | null> {
    try {
      const response = await axios.get<Response>(this.url, { params: { q: `isbn:${isbn}` } })
      const { title, subtitle, authors } = response.data.items?.[0]?.volumeInfo || {}
      if (!title) return null
      const fullTitle = subtitle ? `${title} - ${subtitle}` : title
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

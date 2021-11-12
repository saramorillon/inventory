import axios from 'axios'
import uniq from 'lodash.uniq'
import { IApi, IApiResult } from './Api'

type Response = {
  items?: [
    {
      volumeInfo: {
        title: string
        subtitle?: string
        authors: string[]
      }
    }
  ]
}

export class GoogleApi implements IApi {
  limit = 1
  source = 'google'
  url = 'https://www.googleapis.com/books/v1/volumes'

  async search(isbn: string): Promise<IApiResult | null> {
    const response = await axios.get<Response>(this.url, { params: { q: `isbn:${isbn}` } })
    const { title, subtitle, authors } = response.data.items?.[0]?.volumeInfo || {}
    if (!title && !authors?.length) return null
    const fullTitle = subtitle ? `${title} - ${subtitle}` : title
    return { isbn, title: fullTitle, authors: uniq(authors || []).join(' | '), source: this.source }
  }
}

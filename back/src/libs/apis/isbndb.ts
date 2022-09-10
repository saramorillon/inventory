import axios from 'axios'
import { settings } from '../../settings'
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
  token = settings.isbnToken

  async search(isbn: string): Promise<IApiResult | null> {
    const response = await axios.get<Response>(`${this.url}/${isbn}`, { headers: { Authorization: this.token } })
    const { title, title_long, authors } = response.data.book || {}
    if (!title && !authors?.length) return null
    return {
      isbn,
      title: title_long ?? title ?? '',
      authors: (authors || []).flatMap(sanitize),
      source: this.source,
    }
  }
}

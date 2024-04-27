import axios from 'axios'
import { type IApi, type IApiResult, sanitize } from './Api'

type Response = {
  [key: string]: {
    title: string
    subtitle: string
    authors: { name: string }[]
  }
}

export class OpenLibrary implements IApi {
  source = 'openlibrary'
  url = 'https://openlibrary.org/api/books'

  async search(isbn: string): Promise<IApiResult | null> {
    try {
      const response = await axios.get<Response>(this.url, {
        params: { bibkeys: `ISBN:${isbn}`, format: 'json', jscmd: 'data' },
      })
      const { title, subtitle, authors } = response.data[`ISBN:${isbn}`] || {}
      if (!title) return null
      const fullTitle = subtitle ? `${title} - ${subtitle}` : title
      return {
        isbn,
        title: fullTitle,
        authors: (authors || []).map((author) => author.name).flatMap(sanitize),
        source: this.source,
      }
    } catch (error) {
      return null
    }
  }
}

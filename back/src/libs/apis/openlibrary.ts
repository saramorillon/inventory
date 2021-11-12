import axios from 'axios'
import uniq from 'lodash.uniq'
import { IApi, IApiResult } from './Api'

type Response = {
  [key: string]: {
    title: string
    subtitle: string
    authors: { name: string }[]
  }
}

export class OpenLibrary implements IApi {
  limit = 100
  source = 'openlibrary'
  url = 'https://openlibrary.org/api/books'

  async search(isbn: string): Promise<IApiResult | null> {
    const response = await axios.get<Response>(this.url, {
      params: { bibkeys: `ISBN:${isbn}`, format: 'json', jscmd: 'data' },
    })
    const { title, subtitle, authors } = response.data[`ISBN:${isbn}`] || {}
    if (!title && !authors.length) return null
    const fullTitle = subtitle ? `${title} - ${subtitle}` : title
    return {
      isbn,
      title: fullTitle,
      authors: uniq(authors || [])
        .map((author) => author.name)
        .join(' | '),
      source: this.source,
    }
  }
}

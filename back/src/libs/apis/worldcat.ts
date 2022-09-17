import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import { IApi, IApiResult, sanitize } from './Api'

type Work = {
  $: {
    author: string
    title: string
  }
}

type Response = {
  classify: {
    work?: Work[]
    works?: {
      work?: Work[]
    }[]
  }
}

export class WorlCatApi implements IApi {
  limit = 100
  source = 'worldcat'
  url = 'http://classify.oclc.org/classify2/Classify'

  async search(isbn: string): Promise<IApiResult | null> {
    try {
      const response = await axios.get<Response>(this.url, { params: { isbn } })
      const json: Response = await parseStringPromise(response.data)
      const { title, author } = json.classify.work?.[0]?.$ || json.classify.works?.[0].work?.[0]?.$ || {}
      if (!title) return null
      return {
        isbn,
        title,
        authors: sanitize(author),
        source: this.source,
      }
    } catch (error) {
      return null
    }
  }
}

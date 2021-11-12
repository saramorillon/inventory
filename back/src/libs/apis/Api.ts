export interface IApi {
  limit: number
  source: string
  url: string
  search(isbn: string): Promise<IApiResult | null>
}

export interface IApiResult {
  isbn: string
  title?: string
  authors?: string
  source: string
}

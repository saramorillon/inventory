export interface IApi {
  limit: number
  source: string
  url: string
  search(isbn: string): Promise<IApiResult | null>
}

export interface IApiResult {
  isbn: string
  title: string
  authors: string[]
  source: string
}

export function sanitize(name?: string): string[] {
  if (!name) return []
  return name
    .replace(/[^a-z-]/gi, ' ')
    .trim()
    .split(/ +/)
}

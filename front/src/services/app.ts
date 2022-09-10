import { IApp } from '../models/App'
import { request } from './wrapper'

export function getApp(): Promise<IApp | null> {
  return request<IApp | null>({ url: '/api/app' })
}

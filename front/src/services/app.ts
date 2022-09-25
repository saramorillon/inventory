import { IApp } from '../models/App'
import { Axios } from './Axios'

export async function getApp(): Promise<IApp> {
  const { data } = await Axios.get<IApp>('/api/app')
  return data
}

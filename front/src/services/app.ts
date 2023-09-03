import { IApp } from '../models/App'
import { Axios } from './Axios'

export async function getApp() {
  const { data } = await Axios.get<IApp>('/api/app')
  return data
}

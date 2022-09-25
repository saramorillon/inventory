import axios from 'axios'
import { ISession } from '../models/Session'
import { Axios } from './Axios'

export async function getSession(): Promise<ISession | null> {
  try {
    const { data } = await axios.get('/api/session')
    return data
  } catch (error) {
    return null
  }
}

export async function login(username: string, password: string): Promise<void> {
  await Axios.post('/api/login', { username, password })
}

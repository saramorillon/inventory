import axios from 'axios'
import { Axios } from './Axios'

export async function getSession() {
  try {
    const { data } = await axios.get('/api/session')
    return data
  } catch (error) {
    return undefined
  }
}

export async function login(username: string, password: string) {
  await Axios.post('/api/login', { username, password })
}

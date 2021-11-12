import axios from 'axios'
import { ISession } from '../models/Session'
import { Axios } from './Axios'

export async function getSession(): Promise<ISession | null> {
  return axios
    .get<ISession>('/api/session', { withCredentials: true })
    .then((res) => res.data)
    .catch(() => null)
}

export async function login(username: string, password: string): Promise<void> {
  return Axios.post('/api/login', { username, password })
}

export async function logout(): Promise<void> {
  return Axios.get('/api/logout').then(() => {
    window.location.reload()
  })
}

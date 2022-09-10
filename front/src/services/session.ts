import axios from 'axios'
import { ISession } from '../models/Session'
import { request } from './wrapper'

export function getSession(): Promise<ISession | null> {
  return axios
    .get<ISession>(`/api/session`, { withCredentials: true })
    .then((res) => res.data)
    .catch(() => null)
}

export async function login(username: string, password: string): Promise<void> {
  await request({ url: `/api/login`, method: 'POST', data: { username, password } })
}

export async function logout(): Promise<void> {
  await request({ url: `/api/logout` }).then(() => window.location.reload())
}

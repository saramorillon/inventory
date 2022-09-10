import axios, { AxiosRequestConfig } from 'axios'

export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return axios
    .request<T>({ ...config, withCredentials: true })
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      throw error
    })
}

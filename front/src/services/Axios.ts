import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const transport = axios.create({ withCredentials: true })

transport.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      window.location.reload()
    } else {
      console.error(error)
    }
  }
)

export const Axios = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return transport.get<T>(url, config).then((res) => res.data)
  },
  getRaw<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return transport.get<T>(url, config)
  },
  post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return transport.post<T>(url, body, config).then((res) => res.data)
  },
  patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return transport.patch<T>(url, body, config).then((res) => res.data)
  },
  put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return transport.put<T>(url, body, config).then((res) => res.data)
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return transport.delete<T>(url, config).then((res) => res.data)
  },
}

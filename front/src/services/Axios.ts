import axios from 'axios'

export const Axios = axios.create({ withCredentials: true, maxRedirects: 1 })
Axios.interceptors.response.use(undefined, (err) => {
  console.error(err)
  return Promise.reject(err)
})

import axios from 'axios'
import Cookies from 'js-cookie'

export const url = import.meta.env.VITE_API_URL

const server = axios.create({
  baseURL: url + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

server.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default server

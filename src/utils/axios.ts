import axios from 'axios'
import Cookies from 'js-cookie'

export const url = 'http://localhost:8000'

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

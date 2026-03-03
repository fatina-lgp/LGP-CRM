import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10_000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lgp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lgp_token')
      localStorage.removeItem('lgp_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

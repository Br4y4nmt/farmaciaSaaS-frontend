import axios from 'axios'
import { getStoredUser, clearStoredUser } from '../features/auth/utils/authStorage'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const user = getStoredUser()
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ''
      if (!requestUrl.includes('/auth/login')) {
        clearStoredUser()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const reqUrl = String(err.config?.url ?? '')
    const isAuthCall = reqUrl.includes('/auth/login') || reqUrl.includes('/auth/register')
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      const path = window.location?.pathname ?? ''
      if (!path.includes('login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(err)
  },
)

export default apiClient

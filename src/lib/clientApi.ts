import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config
  const token = window.localStorage.getItem('sumusic_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && originalRequest?.url !== '/auth/refresh' && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshResponse = await api.post('/auth/refresh')
      const accessToken = refreshResponse.data?.data?.accessToken
      if (typeof accessToken === 'string') {
        window.localStorage.setItem('sumusic_access_token', accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
      }
      return api.request(originalRequest)
    }
    return Promise.reject(error)
  }
)

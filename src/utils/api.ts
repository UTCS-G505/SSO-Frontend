// filepath: src/api/index.ts
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Ensure backend error messages surface to callers instead of generic Axios text
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<unknown>) => {
    const data = error.response?.data as unknown

    const getServerMessage = (payload: unknown): string | undefined => {
      if (!payload || typeof payload !== 'object') return undefined
      const obj = payload as Record<string, unknown>
      const keys = ['message', 'error', 'detail'] as const
      for (const k of keys) {
        const val = obj[k]
        if (typeof val === 'string' && val.trim().length > 0) return val
      }
      return undefined
    }

    const serverMessage = getServerMessage(data)
    if (serverMessage) {
      // Override generic error message with backend-provided one
      error.message = serverMessage
    }
    return Promise.reject(error)
  },
)

export default apiClient

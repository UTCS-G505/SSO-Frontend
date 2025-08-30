import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

// Base URL comes from Vite env or falls back to local dev server
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

// Optional token provider that can be registered later to avoid circular imports with stores
let getAccessToken: (() => string | null) | null = null
let onUnauthorized: (() => Promise<void> | void) | null = null

/**
 * Register callbacks so the interceptor can fetch the latest token and react to 401s
 * Call this once after Pinia is set up (e.g. in main.ts) passing functions that read from stores.
 */
export function registerAuthHooks(options: {
  getToken?: () => string | null
  onUnauthorized?: () => Promise<void> | void
}) {
  if (options.getToken) getAccessToken = options.getToken
  if (options.onUnauthorized) onUnauthorized = options.onUnauthorized
}

// Attach Authorization header if token available
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (getAccessToken) {
    const token = getAccessToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Basic 401 handling – delegate to provided hook; prevents infinite retry loops
api.interceptors.response.use(
  (resp) => resp,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        if (onUnauthorized) await onUnauthorized()
      } catch {
        // swallow – caller still gets original rejection
      }
    }
    return Promise.reject(error)
  },
)

export default api

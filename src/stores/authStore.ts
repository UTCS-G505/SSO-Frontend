import { defineStore } from 'pinia'
import apiClient from '@/utils/api'
import type { ApiResponse } from '@/types/api'
import { getCookie } from '@/utils/getCookie'
import { getJwtExp } from '@/utils/getJwtExp'

// Lock to ensure only one refresh request is in-flight at a time
let refreshInFlight: Promise<void> | null = null

interface AuthState {
  id: string | null
  accessToken: string | null
  initialized: boolean
  refreshTimerId: number | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    id: null,
    accessToken: null,
    initialized: false,
    refreshTimerId: null,
  }),

  getters: {
    isAuthenticated: (state) => state.accessToken !== null && state.id !== null,
  },

  actions: {
    // Schedule automatic access token refresh 1 minute before expiry (default 9 minutes)
    scheduleTokenRefresh(): void {
      // Clear any previous timer
      if (this.refreshTimerId) {
        clearTimeout(this.refreshTimerId)
        this.refreshTimerId = null
      }

      if (!this.accessToken) return

      const BUFFER_MS = 60 * 1000 // 1 minute
      const DEFAULT_DELAY_MS = 9 * 60 * 1000 // 9 minutes if no exp available

      const exp = getJwtExp(this.accessToken)
      let delay = DEFAULT_DELAY_MS
      if (exp) {
        const msUntilExp = exp * 1000 - Date.now()
        delay = Math.max(0, msUntilExp - BUFFER_MS)
      }

      // If already expired or very close, refresh immediately
      if (delay === 0) {
        // Small microtask delay to avoid recursive call issues
        this.refresh().catch(() => {})
        return
      }

      this.refreshTimerId = window.setTimeout(() => {
        this.refresh().catch(() => {})
      }, delay)
    },

    async login(id: string, password: string): Promise<void> {
      try {
        const response = await apiClient.post<
          ApiResponse<{ access_token: string; token_type: string }>
        >(
          '/auth/login',
          new URLSearchParams({
            username: id,
            password: password,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )

        const data = response.data
        if (data.code == 0 && data.data?.access_token) {
          // prefer backend-issued uid cookie if present
          this.id = getCookie('uid') || id
          this.accessToken = data.data.access_token
          this.scheduleTokenRefresh()
        } else {
          throw new Error('登入失敗! 請檢查您的帳號和密碼。')
        }
      } catch {
        throw new Error('登入失敗! 請檢查您的帳號和密碼。')
      }
    },

    async register(
      id: string,
      name: string,
      password: string,
      primary_email: string,
      secondary_email: string,
      phone_number: string,
      position: string,
    ): Promise<void> {
      try {
        const response = await apiClient.post<ApiResponse>(
          '/auth/register',
          {
            id: id,
            name: name,
            password: password,
            primary_email: primary_email,
            secondary_email: secondary_email,
            phone_number: phone_number,
            position: position,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const data = response.data
        if (data.code !== 0) {
          throw new Error('註冊失敗')
        }
      } catch {
        throw new Error('註冊失敗')
      }
    },

    async logout(): Promise<void> {
      try {
        const response = await apiClient.post<ApiResponse>('/auth/logout', null)

        if (response.data.code === 0) {
          this.clearAuth()
        } else {
          throw new Error('登出失敗')
        }
      } catch {
        this.clearAuth()
        throw new Error('登出失敗')
      }
    },

    async refresh(): Promise<void> {
      // If a refresh is already running, return the existing promise
      if (refreshInFlight) {
        return refreshInFlight
      }
      // Start a new refresh and store the promise
      refreshInFlight = (async () => {
        try {
          const response = await apiClient.post<
            ApiResponse<{ access_token: string; token_type: string }>
          >('/auth/refresh', null)

          if (response.data.code === 0 && response.data.data) {
            this.id = getCookie('uid')
            this.accessToken = response.data.data.access_token
            this.scheduleTokenRefresh()
          } else {
            this.clearAuth()
            throw new Error('刷新 refresh token 失敗')
          }
        } catch {
          this.clearAuth()
          throw new Error('刷新 refresh token 失敗')
        } finally {
          // Clear the lock regardless of outcome
          refreshInFlight = null
        }
      })()
      return refreshInFlight
    },

    // Clear authentication state
    clearAuth(): void {
      this.id = null
      this.accessToken = null
      if (this.refreshTimerId) {
        clearTimeout(this.refreshTimerId)
        this.refreshTimerId = null
      }
    },

    // Initialize authentication state
    async initializeAuth(): Promise<void> {
      // if (this.initialized) return
      // this.initialized = true
      if (this.isAuthenticated) return
      try {
        await this.refresh()
      } catch {
        this.clearAuth()
      }
    },
  },
})

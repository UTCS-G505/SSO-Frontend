import { defineStore } from 'pinia'
import apiClient from '@/utils/api'

interface AuthState {
  id: string | null
  accessToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    id: null,
    accessToken: null,
  }),

  getters: {
    isAuthenticated: (state) =>
      state.accessToken !== null && localStorage.getItem('sso-user-id') !== null,
  },

  actions: {
    async login(id: string, password: string): Promise<void> {
      try {
        const response = await apiClient.post(
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
        if (data.code == 0) {
          this.id = id
          this.accessToken = data.data.access_token
          this.saveToStorage()
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
        const response = await apiClient.post(
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
        const response = await apiClient.post('/auth/logout', null)

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
      if (this.isAuthenticated) return

      try {
        const response = await apiClient.post('/auth/refresh', null)

        if (response.data.code === 0) {
          this.id = response.data.data.id
          this.accessToken = response.data.data.access_token
          this.saveToStorage()
        } else {
          this.clearAuth()
          throw new Error('刷新 refresh token 失敗')
        }
      } catch {
        this.clearAuth()
        throw new Error('刷新 refresh token 失敗')
      }
    },

    saveToStorage(): void {
      if (this.id) {
        localStorage.setItem('sso-user-id', this.id)
      }
    },

    // Clear authentication state and localStorage
    clearAuth(): void {
      this.id = null
      this.accessToken = null
      localStorage.removeItem('sso-user-id')
    },

    // Initialize authentication state
    async initializeAuth(): Promise<void> {
      if (this.isAuthenticated) return
      try {
        await this.refresh()
        return
      } catch {
        this.clearAuth()
      }
    },
  },
})

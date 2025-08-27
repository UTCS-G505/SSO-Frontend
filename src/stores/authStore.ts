import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: string
  accessToken: string
  loginTime: string
}

interface AuthState {
  id: string | null
  accessToken: string | null
  loginTime: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    id: null,
    accessToken: null,
    loginTime: null,
  }),

  getters: {
    isAuthenticated: (state) => state.accessToken !== null,
  },

  actions: {
    async login(id: string, password: string): Promise<void> {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/v1/auth/login',
          new URLSearchParams({
            username: id,
            password: password,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            withCredentials: true,
          },
        )

        const data = response.data
        if (data.code == 0) {
          this.id = id
          this.accessToken = data.data.access_token
          this.loginTime = new Date().toISOString()

          // Persist to localStorage
          this.saveToStorage()
        } else {
          throw new Error('Invalid credentials')
        }
      } catch {
        // console.error('Error logging in:', error)
        throw new Error('Invalid credentials')
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
        const response = await axios.post(
          'http://localhost:8000/api/v1/auth/register',
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
              accept: 'application/json',
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        )

        const data = response.data
        if (data.code !== 0) {
          throw new Error('Registration failed')
        }
      } catch {
        // console.error('Error creating user:', error)
        throw new Error('Register failed')
      }
    },

    async logout(): Promise<void> {
      try {
        const response = await axios.post('http://localhost:8000/api/v1/auth/logout', null, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        if (response.data.code === 0) {
          this.clearAuth()
        } else {
          throw new Error('Logout failed')
        }
      } catch {
        // console.error('Error logging out:', error)
        // Clear local state even if server logout fails
        this.clearAuth()
        throw new Error('Logout failed')
      }
    },

    // Clear authentication state and localStorage
    clearAuth() {
      this.id = null
      this.accessToken = null
      this.loginTime = null
      localStorage.removeItem('sso-user')
    },

    // Save current auth state to localStorage
    saveToStorage() {
      if (this.id && this.accessToken && this.loginTime) {
        const userData: User = {
          id: this.id,
          accessToken: this.accessToken,
          loginTime: this.loginTime,
        }
        localStorage.setItem('sso-user', JSON.stringify(userData))
      }
    },

    // Check if user is already logged in (from localStorage)
    initializeAuth() {
      const storedUser = localStorage.getItem('sso-user')
      if (storedUser) {
        try {
          const userData: User = JSON.parse(storedUser)
          this.id = userData.id
          this.accessToken = userData.accessToken
          this.loginTime = userData.loginTime
        } catch {
          // Clear invalid data
          localStorage.removeItem('sso-user')
        }
      }
    },
  },
})

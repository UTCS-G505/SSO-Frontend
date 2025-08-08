import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface User {
  username: string
  sessionId: string
  loginTime: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  // Simulate API call for login
  const login = async (username: string, password: string): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo credentials check
    if (username === 'U11216028' && password === 'password123') {
      user.value = {
        username,
        sessionId: generateSessionId(),
        loginTime: new Date().toISOString(),
      }

      // Store in localStorage for persistence
      localStorage.setItem('sso-user', JSON.stringify(user.value))
    } else {
      throw new Error('Invalid credentials')
    }
  }

  const logout = async (): Promise<void> => {
    user.value = null
    localStorage.removeItem('sso-user')
  }

  // Check if user is already logged in (from localStorage)
  const initializeAuth = () => {
    const storedUser = localStorage.getItem('sso-user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        // Clear invalid data
        localStorage.removeItem('sso-user')
      }
    }
  }

  const generateSessionId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initializeAuth,
  }
})

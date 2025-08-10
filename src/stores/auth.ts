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

    // Check if user exists in registered users
    const registeredUsers = getRegisteredUsers()
    const existingUser = registeredUsers.find(
      (u) => u.username === username && u.password === password,
    )

    if (existingUser) {
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

  // Simulate API call for registration
  const register = async (username: string, password: string, email: string): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const registeredUsers = getRegisteredUsers()
    const existingUser = registeredUsers.find((u) => u.username === username)

    if (existingUser) {
      throw new Error('Username already exists')
    }

    // Validate username format (should start with U followed by 8 digits)
    if (!/^U\d{8}$/.test(username)) {
      throw new Error('Username must be in format U12345678')
    }

    // Add new user to registered users
    const newUser = { username, password, email, registeredAt: new Date().toISOString() }
    registeredUsers.push(newUser)
    localStorage.setItem('sso-registered-users', JSON.stringify(registeredUsers))

    // Auto-login after successful registration
    user.value = {
      username,
      sessionId: generateSessionId(),
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem('sso-user', JSON.stringify(user.value))
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

  // Helper function to get registered users from localStorage
  const getRegisteredUsers = (): Array<{
    username: string
    password: string
    email: string
    registeredAt: string
  }> => {
    const stored = localStorage.getItem('sso-registered-users')
    return stored ? JSON.parse(stored) : []
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
  }
})

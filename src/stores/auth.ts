import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface User {
  id: string
  accessToken: string
  loginTime: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  const login = async (id: string, password: string): Promise<void> => {
    await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: id,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.code == 0) {
          user.value = {
            id: id,
            accessToken: data.data.access_token,
            loginTime: new Date().toISOString(),
          }
          localStorage.setItem('sso-user', JSON.stringify(user.value))
        } else {
          throw new Error('Invalid credentials')
        }
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  }

  // Simulate API call for registration
  const register = async (id: string, password: string, email: string): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const registeredUsers = getRegisteredUsers()
    const existingUser = registeredUsers.find((u) => u.id === id)

    if (existingUser) {
      throw new Error('id already exists')
    }

    // Validate id format (should start with U followed by 8 digits)
    if (!/^U\d{8}$/.test(id)) {
      throw new Error('id must be in format U12345678')
    }

    // Add new user to registered users
    const newUser = { id, password, email, registeredAt: new Date().toISOString() }
    registeredUsers.push(newUser)
    localStorage.setItem('sso-registered-users', JSON.stringify(registeredUsers))

    // Auto-login after successful registration
    user.value = {
      id,
      accessToken: "abc",
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

  // const generateSessionId = (): string => {
  //   return Math.random().toString(36).substring(2) + Date.now().toString(36)
  // }

  // Helper function to get registered users from localStorage
  const getRegisteredUsers = (): Array<{
    id: string
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

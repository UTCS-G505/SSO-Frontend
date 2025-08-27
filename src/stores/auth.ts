import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: string
  accessToken: string
  loginTime: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  const login = async (id: string, password: string): Promise<void> => {
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
        },
      )

      const data = response.data
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
    } catch (err) {
      console.error('Error logging in:', err)
      throw new Error('Login failed')
    }
  }

  const register = async (
    id: string,
    name: string,
    password: string,
    primary_email: string,
    secondary_email: string,
    phone_number: string,
    position: string,
  ): Promise<void> => {
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
        },
      )

      const data = response.data
      if (data.code !== 0) {
        throw new Error('Registration failed')
      }
    } catch (err) {
      console.error('Error creating user:', err)
      throw new Error('Register failed')
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

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
  }
})

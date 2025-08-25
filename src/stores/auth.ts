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
    await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: id,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
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

  const register = async (
    id: string,
    name: string,
    password: string,
    primary_email: string,
    secondary_email: string,
    phone_number: string,
    position: string,
  ): Promise<void> => {
    // console.log("id: " + id);
    // console.log("name: " + name);
    // console.log("password: " + password);
    // console.log("primary_email: " + primary_email);
    // console.log("secondary_email: " + secondary_email);
    // console.log("phone_number: " + phone_number);
    // console.log("position: " + position);

    await fetch('http://localhost:8000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        name: name,
        password: password,
        primary_email: primary_email,
        secondary_email: secondary_email,
        phone_number: phone_number,
        position: position,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.code == 0) {
          return
        } else {
          throw new Error('Registration failed')
        }
      })
      .catch((error) => {
        throw new Error(error.message)
      })
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

  // // Helper function to get registered users from localStorage
  // const getRegisteredUsers = (): Array<{
  //   id: string
  //   password: string
  //   email: string
  //   registeredAt: string
  // }> => {
  //   const stored = localStorage.getItem('sso-registered-users')
  //   return stored ? JSON.parse(stored) : []
  // }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
  }
})

import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import { type UserRoleValue } from '@/types/userRoles'
import apiClient from '@/utils/api'
import type { ApiResponse } from '@/types/api'

interface User {
  id: string
  name: string
  primary_email: string
  secondary_email?: string
  phone_number?: string
  position?: string
  role: UserRoleValue
  last_updated?: string
  enabled?: boolean
}

interface CreateUserData {
  id: string
  name: string
  primary_email: string
  password: string
  secondary_email?: string
  phone_number: string
  position: string
  role: UserRoleValue
}

interface AdminState {
  users: User[]
  loading: boolean
  error: string | null
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    users: [],
    loading: false,
    error: null,
  }),

  getters: {
    userCount: (state) => state.users.length,
    getUserById: (state) => (id: string) => state.users.find((user) => user.id === id),
  },

  actions: {
    async getAllUsers(): Promise<User[]> {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        if (!authStore.id || !authStore.accessToken) {
          throw new Error('使用者未經過身份驗證')
        }

        const response = await apiClient.get<ApiResponse<User[]>>('/user/all')

        if (response.data.code === 0) {
          this.users = response.data.data || []
          return this.users
        } else {
          throw new Error(response.data.message || '獲取用戶列表失敗')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '獲取用戶列表時發生錯誤'
        this.error = errorMessage
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(newUser: CreateUserData): Promise<User> {
      try {
        const authStore = useAuthStore()

        if (!authStore.id || !authStore.accessToken) {
          throw new Error('使用者未經過身份驗證')
        }

        const response = await apiClient.post<ApiResponse<User>>('/user/create', newUser)

        if (response.data.code === 0) {
          this.users.push(newUser)
          return newUser
        } else {
          throw new Error(response.data.message || '創建用戶失敗')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '創建用戶時發生錯誤'
        this.error = errorMessage
        throw error
      }
    },

    async updateUser(userId: string, userData: Partial<User>): Promise<User> {
      try {
        const authStore = useAuthStore()

        if (!authStore.id || !authStore.accessToken) {
          throw new Error('使用者未經過身份驗證')
        }

        const response = await apiClient.patch<ApiResponse>(`/user/update/${userId}`, userData)

        if (response.data.code === 0) {
          const userIndex = this.users.findIndex((user) => user.id === userId)
          if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...userData }
          }
          return { ...this.users[userIndex], ...userData }
        } else {
          throw new Error(response.data.message || '更新用戶失敗')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '更新用戶時發生錯誤'
        this.error = errorMessage
        throw error
      }
    },

    async activateUser(userId: string): Promise<void> {
      try {
        const authStore = useAuthStore()

        if (!authStore.id || !authStore.accessToken) {
          throw new Error('使用者未經過身份驗證')
        }

        const response = await apiClient.post<ApiResponse>(`/user/activate/${userId}`)

        if (response.data.code === 0) {
          // Update user status in local state
          const userIndex = this.users.findIndex((user) => user.id === userId)
          if (userIndex !== -1) {
            this.users[userIndex].enabled = true
          }
        } else {
          throw new Error(response.data.message || '開通用戶失敗')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '開通用戶時發生錯誤'
        this.error = errorMessage
        throw error
      }
    },

    async deactivateUser(userId: string): Promise<void> {
      try {
        const authStore = useAuthStore()

        if (!authStore.id || !authStore.accessToken) {
          throw new Error('使用者未經過身份驗證')
        }

        const userIndex = this.users.findIndex((user) => user.id === userId)
        const response = await apiClient.patch<ApiResponse>(`/user/update/${userId}`, {
          id: this.users[userIndex].id,
          name: this.users[userIndex].name,
          primary_email: this.users[userIndex].primary_email,
          secondary_email: this.users[userIndex].secondary_email,
          phone_number: this.users[userIndex].phone_number,
          position: this.users[userIndex].position,
          role: this.users[userIndex].role,
          enabled: false,
          last_updated: new Date().toISOString(),
        })

        if (response.data.code === 0) {
          // Update user status in local state
          if (userIndex !== -1) {
            this.users[userIndex].enabled = false
          }
        } else {
          throw new Error(response.data.message || '停用用戶失敗')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '停用用戶時發生錯誤'
        this.error = errorMessage
        throw error
      }
    },

    async deleteUser(userId: string): Promise<void> {
      try {
        const authStore = useAuthStore()

        if (!authStore.id || !authStore.accessToken) {
          throw new Error('使用者未經過身份驗證')
        }

        const response = await apiClient.delete<ApiResponse>(`/user/delete/${userId}`)

        if (response.data.code === 0) {
          // Remove user from local state
          this.users = this.users.filter((user) => user.id !== userId)
        } else {
          throw new Error(response.data.message || '刪除用戶失敗')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '刪除用戶時發生錯誤'
        this.error = errorMessage
        throw error
      }
    },

    clearUsers(): void {
      this.users = []
      this.error = null
    },

    clearError(): void {
      this.error = null
    },
  },
})

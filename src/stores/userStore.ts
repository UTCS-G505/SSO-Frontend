import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import { type UserRoleValue } from '@/types/userRoles'
import apiClient from '@/utils/api'

interface User {
  id: string | null
  name: string | null
  primary_email: string | null
  secondary_email: string | null
  phone_number: string | null
  position: string | null
  role: UserRoleValue | null
}

export const useUserStore = defineStore('user', {
  state: (): User => ({
    id: null,
    name: null,
    primary_email: null,
    secondary_email: null,
    phone_number: null,
    position: null,
    role: null,
  }),

  getters: {},

  actions: {
    async getProfile(): Promise<void> {
      const authStore = useAuthStore()
      const id = localStorage.getItem('sso-user-id')

      if (!id) {
        console.error('No user ID found in localStorage')
        throw new Error('使用者未經過身份驗證')
      }

      if (!authStore.accessToken) {
        console.error('No access token found in authStore')
        throw new Error('使用者未經過身份驗證')
      }

      const response = await apiClient.get(`/user/get/${id}`)
      const userProfile = response.data
      // Update the store state with the fetched profile data
      if (userProfile && userProfile.code === 0 && userProfile.data) {
        this.setProfile(userProfile.data)
      }
    },

    async updateProfile(updated?: Partial<User>): Promise<void> {
      const authStore = useAuthStore()
      const id = localStorage.getItem('sso-user-id')

      if (!id) {
        console.error('No user ID found in localStorage')
        throw new Error('使用者未經過身份驗證')
      }

      if (!authStore.accessToken) {
        console.error('No access token found in authStore')
        throw new Error('未提供 refresh token')
      }

      const payload = updated ? { ...this.$state, ...updated } : this.$state

      const response = await apiClient.patch(`/user/update/${id}`, payload)

      const result = response.data
      if (result && result.code === 0) {
        this.setProfile(payload)
      }
      return result
    },

    setProfile(user: User): void {
      this.$state = user
      localStorage.setItem('user-profile', JSON.stringify(user))
    },

    clearProfile(): void {
      this.$state = {
        id: null,
        name: null,
        primary_email: null,
        secondary_email: null,
        phone_number: null,
        position: null,
        role: null,
      }
      localStorage.removeItem('user-profile')
    },
  },
})

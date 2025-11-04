import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import { type UserRoleValue } from '@/types/userRoles'
import apiClient from '@/utils/api'
import type { ApiResponse } from '@/types/api'

interface User {
  id: string | null
  name: string | null
  primary_email: string | null
  secondary_email: string | null
  phone_number: string | null
  position: string | null
  role: UserRoleValue | null
  enabled: boolean | null
  privacy_agreed_at: string | null
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
    enabled: null,
    privacy_agreed_at: null,
  }),

  getters: {},

  actions: {
    async getProfile(): Promise<void> {
      const authStore = useAuthStore()

      if (!authStore.id || !authStore.accessToken) {
        throw new Error('使用者未經過身份驗證')
      }

      const response = await apiClient.get<ApiResponse<User>>(`/user/get/${authStore.id}`)
      const userProfile = response.data
      // Update the store state with the fetched profile data
      if (userProfile && userProfile.code === 0 && userProfile.data) {
        this.setProfile(userProfile.data)
      }
    },

    async updateProfile(updated?: Partial<User>): Promise<void> {
      const authStore = useAuthStore()

      if (!authStore.id || !authStore.accessToken) {
        throw new Error('使用者未經過身份驗證')
      }

      const payload = updated ? { ...this.$state, ...updated } : this.$state

      const response = await apiClient.patch<ApiResponse>(`/user/update/${authStore.id}`, {
        name: payload.name,
        primary_email: payload.primary_email,
        secondary_email: payload.secondary_email,
        phone_number: payload.phone_number,
        position: payload.position,
        privacy_agreed_at: payload.privacy_agreed_at,
      })

      const result = response.data
      if (result && result.code === 0) {
        this.setProfile(payload)
      }
    },

    setProfile(user: User): void {
      this.$state = user
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
        enabled: null,
        privacy_agreed_at: null,
      }
    },
  },
})

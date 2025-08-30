import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './authStore'
import { type UserRoleValue } from '@/types/userRoles'

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
    async getProfile() {
      const authStore = useAuthStore()
      const id = localStorage.getItem('sso-user-id')

      if (!id) {
        console.error('No user ID found in localStorage')
        throw new Error('User not authenticated')
      }

      if (!authStore.accessToken) {
        console.error('No access token found in authStore')
        throw new Error('No access token available')
      }

      const response = await axios.get(`http://localhost:8000/api/v1/user/get/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        withCredentials: true,
      })
      const userProfile = response.data
      console.log('userProfile response:', userProfile)

      // Update the store state with the fetched profile data
      if (userProfile && userProfile.code === 0 && userProfile.data) {
        this.setProfile(userProfile.data)
      }
    },

    async updateProfile(updated?: Partial<User>) {
      const authStore = useAuthStore()
      const id = localStorage.getItem('sso-user-id')

      if (!id) {
        console.error('No user ID found in localStorage')
        throw new Error('User not authenticated')
      }

      if (!authStore.accessToken) {
        console.error('No access token found in authStore')
        throw new Error('No access token available')
      }

      const payload = updated ? { ...this.$state, ...updated } : this.$state
      console.log(payload)

      const response = await axios.patch(
        `http://localhost:8000/api/v1/user/update/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        },
      )

      const result = response.data
      console.log('updateProfile response:', result)

      if (result && result.code === 0) {
        this.setProfile(payload)
      }
      return result
    },

    setProfile(user: User) {
      this.$state = user
      localStorage.setItem('user-profile', JSON.stringify(user))
    },

    clearProfile() {
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

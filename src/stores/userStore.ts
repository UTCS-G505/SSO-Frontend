import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface User {
  id: string | null
  name: string | null
  primary_email: string | null
  secondary_email: string | null
  phone_number: string | null
  position: string | null
}

export const useUserStore = defineStore('user', {
  state: (): User => ({
    id: null,
    name: null,
    primary_email: null,
    secondary_email: null,
    phone_number: null,
    position: null,
  }),

  getters: {},

  actions: {
    async getProfile() {
      const authStore = useAuthStore()

      if (!authStore.id) {
        console.error('No user ID found in authStore')
        throw new Error('User not authenticated')
      }

      if (!authStore.accessToken) {
        console.error('No access token found in authStore')
        throw new Error('No access token available')
      }

      const response = await axios.get(`http://localhost:8000/api/v1/user/get/${authStore.id}`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      })
      const userProfile = response.data
      console.log('userProfile response:', userProfile)

      // Update the store state with the fetched profile data
      if (userProfile && userProfile.code === 0 && userProfile.data) {
        this.setProfile(userProfile.data)
      }
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
      }
      localStorage.removeItem('user-profile')
    },
  },
})

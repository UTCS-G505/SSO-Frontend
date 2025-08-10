import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export interface LoginFormData {
  username: string
  password: string
  rememberMe: boolean
}

export function useLogin() {
  const router = useRouter()
  const authStore = useAuthStore()

  const formData = ref<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  })

  const isLoading = ref(false)
  const error = ref('')

  const validateForm = (): boolean => {
    if (!formData.value.username || !formData.value.password) {
      error.value = 'Please fill in all fields'
      return false
    }
    return true
  }

  const login = async () => {
    if (!validateForm()) {
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      await authStore.login(formData.value.username, formData.value.password)
      router.push('/dashboard')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
    } finally {
      isLoading.value = false
    }
  }

  const updateUsername = (value: string) => {
    formData.value.username = value
  }

  const updatePassword = (value: string) => {
    formData.value.password = value
  }

  const updateRememberMe = (value: boolean) => {
    formData.value.rememberMe = value
  }

  return {
    formData,
    isLoading,
    error,
    login,
    updateUsername,
    updatePassword,
    updateRememberMe,
  }
}

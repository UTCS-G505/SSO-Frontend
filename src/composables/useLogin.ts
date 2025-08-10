import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export interface LoginFormData {
  username: string
  password: string
  email: string
  confirmPassword: string
  rememberMe: boolean
}

export function useLogin() {
  const router = useRouter()
  const authStore = useAuthStore()

  const formData = ref<LoginFormData>({
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
    rememberMe: false,
  })

  const isLoading = ref(false)
  const error = ref('')
  const isRegisterMode = ref(false)

  const validateForm = (): boolean => {
    if (!formData.value.username || !formData.value.password) {
      error.value = 'Please fill in all fields'
      return false
    }

    if (isRegisterMode.value) {
      if (!formData.value.email) {
        error.value = 'Email is required for registration'
        return false
      }
      if (!formData.value.confirmPassword) {
        error.value = 'Please confirm your password'
        return false
      }
      if (formData.value.password !== formData.value.confirmPassword) {
        error.value = 'Passwords do not match'
        return false
      }
      if (formData.value.password.length < 6) {
        error.value = 'Password must be at least 6 characters long'
        return false
      }
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
      if (isRegisterMode.value) {
        await authStore.register(
          formData.value.username,
          formData.value.password,
          formData.value.email,
        )
      } else {
        await authStore.login(formData.value.username, formData.value.password)
      }
      router.push('/dashboard')
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : isRegisterMode.value
            ? 'Registration failed'
            : 'Login failed'
    } finally {
      isLoading.value = false
    }
  }

  const toggleMode = () => {
    isRegisterMode.value = !isRegisterMode.value
    error.value = ''
    // Clear form when switching modes
    formData.value = {
      username: '',
      password: '',
      email: '',
      confirmPassword: '',
      rememberMe: false,
    }
  }

  const updateUsername = (value: string) => {
    formData.value.username = value
  }

  const updatePassword = (value: string) => {
    formData.value.password = value
  }

  const updateEmail = (value: string) => {
    formData.value.email = value
  }

  const updateConfirmPassword = (value: string) => {
    formData.value.confirmPassword = value
  }

  const updateRememberMe = (value: boolean) => {
    formData.value.rememberMe = value
  }

  return {
    formData,
    isLoading,
    error,
    isRegisterMode,
    login,
    toggleMode,
    updateUsername,
    updatePassword,
    updateEmail,
    updateConfirmPassword,
    updateRememberMe,
  }
}

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export interface LoginFormData {
  id: string
  name: string
  password: string
  confirmPassword: string
  primary_email: string
  secondary_email: string
  phone_number: string
  position: string
  rememberMe: boolean
}

export function useLogin() {
  const router = useRouter()
  const authStore = useAuthStore()

  const formData = ref<LoginFormData>({
    id: '',
    name: '',
    password: '',
    confirmPassword: '',
    primary_email: '',
    secondary_email: '',
    phone_number: '',
    position: '',
    rememberMe: false,
  })

  const isLoading = ref(false)
  const error = ref('')
  const success = ref('')
  const isRegisterMode = ref(false)

  const validateForm = (): boolean => {
    if (!formData.value.id || !formData.value.password) {
      error.value = 'Please fill in all fields'
      return false
    }

    if (isRegisterMode.value) {
      if (!formData.value.primary_email) {
        error.value = 'Primary email is required for registration'
        return false
      }
      if (!formData.value.name) {
        error.value = 'Name is required for registration'
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
    success.value = ''

    try {
      if (isRegisterMode.value) {
        await authStore.register(
          formData.value.id,
          formData.value.name,
          formData.value.password,
          formData.value.primary_email,
          formData.value.secondary_email,
          formData.value.phone_number,
          formData.value.position,
        )
        // After successful registration, switch to login mode
        isRegisterMode.value = false
        // Clear form data except for id which user can use to login
        const userId = formData.value.id
        formData.value = {
          id: userId,
          name: '',
          password: '',
          confirmPassword: '',
          primary_email: '',
          secondary_email: '',
          phone_number: '',
          position: '',
          rememberMe: false,
        }
        // Show success message
        success.value = 'Registration successful! Please login with your credentials.'
      } else {
        await authStore.login(formData.value.id, formData.value.password)
        router.push('/dashboard')
      }
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
    success.value = ''
    // Clear form when switching modes
    formData.value = {
      id: '',
      name: '',
      password: '',
      confirmPassword: '',
      primary_email: '',
      secondary_email: '',
      phone_number: '',
      position: '',
      rememberMe: false,
    }
  }

  const updatePassword = (value: string) => {
    formData.value.password = value
  }

  const updateId = (value: string) => {
    formData.value.id = value
  }

  const updateName = (value: string) => {
    formData.value.name = value
  }

  const updatePrimaryEmail = (value: string) => {
    formData.value.primary_email = value
  }

  const updateSecondaryEmail = (value: string) => {
    formData.value.secondary_email = value
  }

  const updatePhoneNumber = (value: string) => {
    formData.value.phone_number = value
  }

  const updatePosition = (value: string) => {
    formData.value.position = value
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
    success,
    isRegisterMode,
    login,
    toggleMode,
    updateId,
    updateName,
    updatePassword,
    updatePrimaryEmail,
    updateSecondaryEmail,
    updatePhoneNumber,
    updatePosition,
    updateConfirmPassword,
    updateRememberMe,
  }
}

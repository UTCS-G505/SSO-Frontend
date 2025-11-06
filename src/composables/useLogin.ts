import { ref } from 'vue'
import { PASSWORD_MIN_LENGTH, isValidPassword, isValidTaiwanId } from '@/utils/validation'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'

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
  agreedRules: boolean
}

export function useLogin() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  const userStore = useUserStore()

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
    agreedRules: false,
  })

  const isLoading = ref(false)
  const error = ref('')
  const success = ref('')
  const isRegisterMode = ref(false)

  const resetForm = (keepId = false) => {
    const id = keepId ? formData.value.id : ''
    formData.value = {
      id,
      name: '',
      password: '',
      confirmPassword: '',
      primary_email: '',
      secondary_email: '',
      phone_number: '',
      position: '',
      rememberMe: false,
      agreedRules: false,
    }
  }

  const validateForm = (): boolean => {
    if (!formData.value.id || !formData.value.password) {
      error.value = '請填寫所有欄位'
      return false
    }

    if (isRegisterMode.value) {
      if (!isValidTaiwanId(formData.value.id)) {
        error.value = '請輸入有效的身分證字號'
        return false
      }
      if (!formData.value.primary_email) {
        error.value = '註冊時必須輸入主要電子郵件'
        return false
      }
      if (!formData.value.name) {
        error.value = '註冊時必須輸入姓名'
        return false
      }
      if (!formData.value.confirmPassword) {
        error.value = '註冊時必須確認密碼'
        return false
      }
      if (formData.value.password !== formData.value.confirmPassword) {
        error.value = '密碼不匹配'
        return false
      }
      if (!isValidPassword(formData.value.password)) {
        error.value = `密碼長度必須至少 ${PASSWORD_MIN_LENGTH} 個字元`
        return false
      }
      if (!formData.value.agreedRules) {
        error.value = '註冊前請先閱讀並勾選同意使用規範'
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
        resetForm(true)
        // Show success message
        success.value = '註冊成功! 請使用您的帳號密碼登入。'
      } else {
        await authStore.login(formData.value.id, formData.value.password)

        if (authStore.id && authStore.accessToken) {
          await userStore.getProfile()
          // If user is not enabled or didn't agree, force them to complete profile first
          if (userStore.enabled === false || !userStore.privacy_agreed_at) {
            router.push({ name: 'complete-profile' })
            return
          }
          const redirectUrl = route.query.redirect
          if (redirectUrl && typeof redirectUrl === 'string') {
            window.location.href = redirectUrl
          } else {
            router.push('/dashboard')
          }
        } else {
          throw new Error('登入失敗! 請檢查您的帳號和密碼。')
        }
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
    resetForm()
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

  const updateAgreedRules = (value: boolean) => {
    formData.value.agreedRules = value
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
    updateAgreedRules,
  }
}

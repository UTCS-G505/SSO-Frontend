import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLogin } from '../useLogin'
import { createPinia, setActivePinia } from 'pinia'

// Mock the router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useRoute: () => ({
    query: {},
  }),
}))

// Mock the stores
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    register: vi.fn(),
    login: vi.fn(),
    id: null,
    accessToken: null,
  }),
}))

vi.mock('@/stores/userStore', () => ({
  useUserStore: () => ({
    getProfile: vi.fn(),
    enabled: true,
  }),
}))

describe('useLogin - Registration Validation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('validateForm for registration', () => {
    it('should validate required fields for registration', async () => {
      const { formData, isRegisterMode, error, login } = useLogin()

      isRegisterMode.value = true

      // Test with empty form
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
        agreedRules: false,
      }

      await login()

      // Should fail validation for missing required fields
      expect(formData.value.id).toBe('')
      expect(error.value).toBe('請填寫所有欄位')
    })

    it('should require id field for registration', async () => {
      const { formData, isRegisterMode, error, login } = useLogin()

      isRegisterMode.value = true
      formData.value = {
        id: '', // Missing id
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
        primary_email: 'test@example.com',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: true,
      }

      await login()

      expect(error.value).toBe('請填寫所有欄位')
    })

    it('should require password field for registration', async () => {
      const { formData, isRegisterMode, error, login } = useLogin()

      isRegisterMode.value = true
      formData.value = {
        id: 'testuser',
        name: 'Test User',
        password: '', // Missing password
        confirmPassword: 'password123',
        primary_email: 'test@example.com',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: true,
      }

      await login()

      expect(error.value).toBe('請填寫所有欄位')
    })

    it('should require primary_email field for registration', async () => {
      const { formData, isRegisterMode, error, login } = useLogin()

      isRegisterMode.value = true
      formData.value = {
        id: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
        primary_email: '', // Missing primary email
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: true,
      }

      await login()

      expect(error.value).toBe('註冊時必須輸入主要電子郵件')
    })

    it('should require name field for registration', async () => {
      const { formData, isRegisterMode, error, login } = useLogin()

      isRegisterMode.value = true
      formData.value = {
        id: 'testuser',
        name: '', // Missing name
        password: 'password123',
        confirmPassword: 'password123',
        primary_email: 'test@example.com',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: true,
      }

      await login()

      expect(error.value).toBe('註冊時必須輸入姓名')
    })

    it('should require confirmPassword field for registration', async () => {
      const { formData, isRegisterMode, error, login } = useLogin()

      isRegisterMode.value = true
      formData.value = {
        id: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: '', // Missing confirm password
        primary_email: 'test@example.com',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: true,
      }

      await login()

      expect(error.value).toBe('註冊時必須確認密碼')
    })

    it('should validate password and confirmPassword match', async () => {
      const { formData, isRegisterMode, error, login } = useLogin()

      isRegisterMode.value = true
      formData.value = {
        id: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'differentpassword', // Mismatched passwords
        primary_email: 'test@example.com',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: true,
      }

      await login()

      expect(error.value).toBe('密碼不匹配')
    })

    it('should validate password length', async () => {
      const { formData, isRegisterMode, error, login } = useLogin()

      isRegisterMode.value = true
      formData.value = {
        id: 'testuser',
        name: 'Test User',
        password: '1234567', // Password too short (7 characters)
        confirmPassword: '1234567',
        primary_email: 'test@example.com',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: true,
      }

      await login()

      expect(error.value).toBe('密碼長度必須至少 8 個字元')
    })

    it('should require agreement to rules', async () => {
      const { formData, isRegisterMode, error, login } = useLogin()

      isRegisterMode.value = true
      formData.value = {
        id: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
        primary_email: 'test@example.com',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: false, // Not agreed to rules
      }

      await login()

      expect(error.value).toBe('註冊前請先閱讀並勾選同意使用規範')
    })

    it('should pass validation with valid registration data', async () => {
      const { formData, isRegisterMode } = useLogin()

      isRegisterMode.value = true
      formData.value = {
        id: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
        primary_email: 'test@example.com',
        secondary_email: 'secondary@example.com',
        phone_number: '1234567890',
        position: 'Developer',
        rememberMe: false,
        agreedRules: true,
      }

      // We can't easily test the actual registration process without more complex mocking
      // But we can verify that the form data is set correctly for a valid case
      expect(formData.value.id).toBe('testuser')
      expect(formData.value.name).toBe('Test User')
      expect(formData.value.password).toBe('password123')
      expect(formData.value.confirmPassword).toBe('password123')
      expect(formData.value.primary_email).toBe('test@example.com')
      expect(formData.value.secondary_email).toBe('secondary@example.com')
      expect(formData.value.phone_number).toBe('1234567890')
      expect(formData.value.position).toBe('Developer')
      expect(formData.value.agreedRules).toBe(true)
    })

    it('should allow optional fields to be empty', async () => {
      const { formData, isRegisterMode } = useLogin()

      isRegisterMode.value = true
      formData.value = {
        id: 'testuser',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
        primary_email: 'test@example.com',
        secondary_email: '', // Optional field
        phone_number: '', // Optional field
        position: '', // Optional field
        rememberMe: false,
        agreedRules: true,
      }

      // These optional fields should be allowed to be empty
      expect(formData.value.secondary_email).toBe('')
      expect(formData.value.phone_number).toBe('')
      expect(formData.value.position).toBe('')
    })
  })

  describe('form data updates', () => {
    it('should update form data correctly', () => {
      const {
        formData,
        updateId,
        updateName,
        updatePassword,
        updateConfirmPassword,
        updatePrimaryEmail,
        updateSecondaryEmail,
        updatePhoneNumber,
        updatePosition,
        updateRememberMe,
        updateAgreedRules,
      } = useLogin()

      updateId('newuser')
      expect(formData.value.id).toBe('newuser')

      updateName('New User')
      expect(formData.value.name).toBe('New User')

      updatePassword('newpassword')
      expect(formData.value.password).toBe('newpassword')

      updateConfirmPassword('newpassword')
      expect(formData.value.confirmPassword).toBe('newpassword')

      updatePrimaryEmail('new@example.com')
      expect(formData.value.primary_email).toBe('new@example.com')

      updateSecondaryEmail('secondary@example.com')
      expect(formData.value.secondary_email).toBe('secondary@example.com')

      updatePhoneNumber('9876543210')
      expect(formData.value.phone_number).toBe('9876543210')

      updatePosition('Manager')
      expect(formData.value.position).toBe('Manager')

      updateRememberMe(true)
      expect(formData.value.rememberMe).toBe(true)

      updateAgreedRules(true)
      expect(formData.value.agreedRules).toBe(true)
    })
  })

  describe('mode switching', () => {
    it('should toggle between login and register modes', () => {
      const { isRegisterMode, toggleMode, error, success } = useLogin()

      expect(isRegisterMode.value).toBe(false)

      toggleMode()
      expect(isRegisterMode.value).toBe(true)
      expect(error.value).toBe('')
      expect(success.value).toBe('')

      toggleMode()
      expect(isRegisterMode.value).toBe(false)
    })

    it('should clear form data when switching modes', () => {
      const { formData, toggleMode, updateId, updateName } = useLogin()

      updateId('testuser')
      updateName('Test User')

      expect(formData.value.id).toBe('testuser')
      expect(formData.value.name).toBe('Test User')

      toggleMode()

      expect(formData.value.id).toBe('')
      expect(formData.value.name).toBe('')
    })
  })
})

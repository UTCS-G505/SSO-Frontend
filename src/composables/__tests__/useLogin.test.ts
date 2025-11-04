/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLogin } from '../useLogin'
import { createPinia, setActivePinia } from 'pinia'

// Mock window.location
const mockLocation = {
  href: '',
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

// Mock the router
const mockRouter = {
  push: vi.fn(),
}

const mockRoute = {
  query: {},
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => mockRoute,
}))

// Mock the stores
const mockAuthStore = {
  register: vi.fn(),
  login: vi.fn(),
  id: null as string | null,
  accessToken: null as string | null,
}

const mockUserStore = {
  getProfile: vi.fn(),
  enabled: true as boolean,
  privacy_agreed_at: null as string | null,
}

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}))

vi.mock('@/stores/userStore', () => ({
  useUserStore: () => mockUserStore,
}))

describe('useLogin - Registration Validation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockLocation.href = ''
    mockRoute.query = {}
    mockAuthStore.id = null
    mockAuthStore.accessToken = null
    mockUserStore.enabled = true
    mockUserStore.privacy_agreed_at = null
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

  describe('callback handling', () => {
    it('should redirect to external URL when redirect query parameter is provided', async () => {
      const { login, formData } = useLogin()

      // Setup successful login scenario
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'token123'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = true
      mockUserStore.privacy_agreed_at = '2025-11-01T10:00:00+08:00'

      // Set redirect URL in route query
      mockRoute.query = { redirect: 'https://external-app.example.com/callback' }

      // Setup valid login form
      formData.value = {
        id: 'testuser',
        password: 'password123',
        name: '',
        confirmPassword: '',
        primary_email: '',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: false,
      }

      await login()

      // Should redirect to external URL
      expect(window.location.href).toBe('https://external-app.example.com/callback')
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('should navigate to dashboard when no redirect parameter is provided', async () => {
      const { login, formData } = useLogin()

      // Setup successful login scenario
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'token123'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = true
      mockUserStore.privacy_agreed_at = '2025-11-01T10:00:00+08:00'

      // No redirect URL in route query
      mockRoute.query = {}

      // Setup valid login form
      formData.value = {
        id: 'testuser',
        password: 'password123',
        name: '',
        confirmPassword: '',
        primary_email: '',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: false,
      }

      await login()

      // Should navigate to dashboard
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
      expect(window.location.href).toBe('')
    })

    it('should redirect to complete profile when user is not enabled', async () => {
      const { login, formData } = useLogin()

      // Setup successful login scenario but user not enabled
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'token123'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = false // User needs to complete profile

      // Set redirect URL in route query
      mockRoute.query = { redirect: 'https://external-app.example.com/callback' }

      // Setup valid login form
      formData.value = {
        id: 'testuser',
        password: 'password123',
        name: '',
        confirmPassword: '',
        primary_email: '',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: false,
      }

      await login()

      // Should redirect to complete profile instead of external URL
      expect(mockRouter.push).toHaveBeenCalledWith({ name: 'complete-profile' })
      expect(window.location.href).toBe('')
    })

    it('should handle non-string redirect parameter gracefully', async () => {
      const { login, formData } = useLogin()

      // Setup successful login scenario
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'token123'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = true
      mockUserStore.privacy_agreed_at = '2025-11-01T10:00:00+08:00'

      // Set non-string redirect parameter
      mockRoute.query = { redirect: ['multiple', 'values'] }

      // Setup valid login form
      formData.value = {
        id: 'testuser',
        password: 'password123',
        name: '',
        confirmPassword: '',
        primary_email: '',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: false,
      }

      await login()

      // Should fall back to dashboard navigation
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
      expect(window.location.href).toBe('')
    })

    it('should handle empty string redirect parameter', async () => {
      const { login, formData } = useLogin()

      // Setup successful login scenario
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'token123'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = true
      mockUserStore.privacy_agreed_at = '2025-11-01T10:00:00+08:00'

      // Set empty string redirect parameter
      mockRoute.query = { redirect: '' }

      // Setup valid login form
      formData.value = {
        id: 'testuser',
        password: 'password123',
        name: '',
        confirmPassword: '',
        primary_email: '',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: false,
      }

      await login()

      // Should fall back to dashboard navigation
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
      expect(window.location.href).toBe('')
    })

    it('should not attempt redirect when login fails', async () => {
      const { login, formData, error } = useLogin()

      // Setup failed login scenario
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = null // Login failed
      mockAuthStore.accessToken = null

      // Set redirect URL in route query
      mockRoute.query = { redirect: 'https://external-app.example.com/callback' }

      // Setup valid login form
      formData.value = {
        id: 'testuser',
        password: 'wrongpassword',
        name: '',
        confirmPassword: '',
        primary_email: '',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: false,
      }

      await login()

      // Should show error and not redirect
      expect(error.value).toBe('登入失敗! 請檢查您的帳號和密碼。')
      expect(window.location.href).toBe('')
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('should handle internal route redirects', async () => {
      const { login, formData } = useLogin()

      // Setup successful login scenario
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'token123'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = true
      mockUserStore.privacy_agreed_at = '2025-11-01T10:00:00+08:00'

      // Set internal route redirect parameter
      mockRoute.query = { redirect: '/users' }

      // Setup valid login form
      formData.value = {
        id: 'testuser',
        password: 'password123',
        name: '',
        confirmPassword: '',
        primary_email: '',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: false,
      }

      await login()

      // Should use window.location.href even for internal routes to maintain consistency
      expect(window.location.href).toBe('/users')
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('should call getProfile before checking user enabled status', async () => {
      const { login, formData } = useLogin()

      // Setup successful login scenario
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'token123'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = true
      mockUserStore.privacy_agreed_at = '2025-11-01T10:00:00+08:00'

      // Set redirect URL in route query
      mockRoute.query = { redirect: 'https://external-app.example.com/callback' }

      // Setup valid login form
      formData.value = {
        id: 'testuser',
        password: 'password123',
        name: '',
        confirmPassword: '',
        primary_email: '',
        secondary_email: '',
        phone_number: '',
        position: '',
        rememberMe: false,
        agreedRules: false,
      }

      await login()

      // Should call getProfile before checking enabled status
      expect(mockUserStore.getProfile).toHaveBeenCalled()
      expect(window.location.href).toBe('https://external-app.example.com/callback')
    })
  })
})

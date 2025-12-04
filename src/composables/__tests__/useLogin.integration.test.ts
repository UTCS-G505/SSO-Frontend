/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
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

describe('Registration Validation - Integration Tests', () => {
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

  describe('End-to-end registration flow', () => {
    it('should complete successful registration with all valid data', async () => {
      const { useLogin } = await import('../useLogin')
      const {
        formData,
        isRegisterMode,
        success,
        error,
        login,
        updateId,
        updateName,
        updatePassword,
        updateConfirmPassword,
        updatePrimaryEmail,
        updateSecondaryEmail,
        updatePhoneNumber,
        updatePosition,
        updateAgreedRules,
      } = useLogin()

      // Set to register mode
      isRegisterMode.value = true

      // Mock successful registration
      mockAuthStore.register.mockResolvedValue(undefined)

      // Fill form with valid data
      updateId('T112663836')
      updateName('Test User')
      updatePassword('password123')
      updateConfirmPassword('password123')
      updatePrimaryEmail('test@example.com')
      updateSecondaryEmail('backup@example.com')
      updatePhoneNumber('1234567890')
      updatePosition('Developer')
      updateAgreedRules(true)

      // Attempt registration
      await login()

      // Verify the register method was called with correct parameters
      expect(mockAuthStore.register).toHaveBeenCalledWith(
        'T112663836',
        'Test User',
        'password123',
        'test@example.com',
        'backup@example.com',
        '1234567890',
        'Developer',
      )

      // Should show success message and switch to login mode
      expect(success.value).toBe('註冊成功! 請使用您的帳號密碼登入。')
      expect(error.value).toBe('')
      expect(isRegisterMode.value).toBe(false)

      // ID should be preserved for login, other fields cleared
      expect(formData.value.id).toBe('T112663836')
      expect(formData.value.name).toBe('')
      expect(formData.value.password).toBe('')
    })

    it('should handle registration API failure gracefully', async () => {
      const { useLogin } = await import('../useLogin')
      const {
        isRegisterMode,
        error,
        login,
        updateId,
        updateName,
        updatePassword,
        updateConfirmPassword,
        updatePrimaryEmail,
        updateAgreedRules,
      } = useLogin()

      // Set to register mode
      isRegisterMode.value = true

      // Mock registration failure
      mockAuthStore.register.mockRejectedValue(new Error('註冊失敗'))

      // Fill form with valid data
      updateId('T112663836')
      updateName('Test User')
      updatePassword('password123')
      updateConfirmPassword('password123')
      updatePrimaryEmail('test@example.com')
      updateAgreedRules(true)

      // Attempt registration
      await login()

      // Should show error message and stay in register mode
      expect(error.value).toBe('註冊失敗')
      expect(isRegisterMode.value).toBe(true)
    })

    it('should validate all required fields before API call', async () => {
      const { useLogin } = await import('../useLogin')
      const { isRegisterMode, error, login, updateId } = useLogin()

      // Set to register mode
      isRegisterMode.value = true

      // Only fill ID, leave other required fields empty
      updateId('testuser')

      // Attempt registration
      await login()

      // Should fail validation before API call
      expect(error.value).toBe('請填寫所有欄位')
      expect(mockAuthStore.register).not.toHaveBeenCalled()
    })

    it('should handle complex validation scenarios', async () => {
      const { useLogin } = await import('../useLogin')
      const {
        isRegisterMode,
        error,
        login,
        updateId,
        updateName,
        updatePassword,
        updateConfirmPassword,
        updatePrimaryEmail,
        updateAgreedRules,
      } = useLogin()

      // Set to register mode
      isRegisterMode.value = true

      // Test scenario 1: Password too short
      updateId('T112663836')
      updateName('Test User')
      updatePassword('1234567') // 7 characters
      updateConfirmPassword('1234567')
      updatePrimaryEmail('test@example.com')
      updateAgreedRules(true)

      await login()
      expect(error.value).toBe('密碼長度必須至少 8 個字元')

      // Test scenario 2: Password mismatch
      updatePassword('password123')
      updateConfirmPassword('differentpassword')

      await login()
      expect(error.value).toBe('密碼不匹配')

      // Test scenario 3: Rules not agreed
      updateConfirmPassword('password123')
      updateAgreedRules(false)

      await login()
      expect(error.value).toBe('註冊前請先閱讀並勾選同意使用規範')

      // Verify no API calls were made for any invalid scenarios
      expect(mockAuthStore.register).not.toHaveBeenCalled()
    })

    it('should preserve form state during validation errors', async () => {
      const { useLogin } = await import('../useLogin')
      const {
        formData,
        isRegisterMode,
        error,
        login,
        updateId,
        updateName,
        updatePassword,
        updateConfirmPassword,
        updatePrimaryEmail,
        updateSecondaryEmail,
        updatePhoneNumber,
        updatePosition,
        updateAgreedRules,
      } = useLogin()

      // Set to register mode
      isRegisterMode.value = true

      // Fill form with some data, but with a validation error (short password)
      updateId('T112663836')
      updateName('Test User')
      updatePassword('short') // Too short
      updateConfirmPassword('short')
      updatePrimaryEmail('test@example.com')
      updateSecondaryEmail('backup@example.com')
      updatePhoneNumber('1234567890')
      updatePosition('Developer')
      updateAgreedRules(true)

      // Attempt registration (should fail validation)
      await login()

      // Form data should be preserved even after validation error
      expect(error.value).toBe('密碼長度必須至少 8 個字元')
      expect(formData.value.id).toBe('T112663836')
      expect(formData.value.name).toBe('Test User')
      expect(formData.value.password).toBe('short')
      expect(formData.value.confirmPassword).toBe('short')
      expect(formData.value.primary_email).toBe('test@example.com')
      expect(formData.value.secondary_email).toBe('backup@example.com')
      expect(formData.value.phone_number).toBe('1234567890')
      expect(formData.value.position).toBe('Developer')
      expect(formData.value.agreedRules).toBe(true)
    })
  })

  describe('Login and Callback Handling - Integration Tests', () => {
    it('should handle complete login flow with external redirect', async () => {
      const { useLogin } = await import('../useLogin')
      const { isRegisterMode, error, login, updateId, updatePassword } = useLogin()

      // Ensure we're in login mode
      isRegisterMode.value = false

      // Setup successful login with external redirect
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'valid-token'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = true
      mockUserStore.privacy_agreed_at = '2025-11-01T10:00:00+08:00'
      mockRoute.query = { redirect: 'https://external-app.example.com/sso/callback' }

      // Fill login form
      updateId('testuser')
      updatePassword('password123')

      // Perform login
      await login()

      // Verify store methods were called
      expect(mockAuthStore.login).toHaveBeenCalledWith('testuser', 'password123')
      expect(mockUserStore.getProfile).toHaveBeenCalled()

      // Verify external redirect occurred
      expect(window.location.href).toBe('https://external-app.example.com/sso/callback')
      expect(mockRouter.push).not.toHaveBeenCalled()
      expect(error.value).toBe('')
    })

    it('should handle complete login flow with internal navigation', async () => {
      const { useLogin } = await import('../useLogin')
      const { isRegisterMode, error, login, updateId, updatePassword } = useLogin()

      // Ensure we're in login mode
      isRegisterMode.value = false

      // Setup successful login without redirect
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'valid-token'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = true
      mockUserStore.privacy_agreed_at = '2025-11-01T10:00:00+08:00'
      mockRoute.query = {} // No redirect parameter

      // Fill login form
      updateId('testuser')
      updatePassword('password123')

      // Perform login
      await login()

      // Verify store methods were called
      expect(mockAuthStore.login).toHaveBeenCalledWith('testuser', 'password123')
      expect(mockUserStore.getProfile).toHaveBeenCalled()

      // Verify internal navigation occurred
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
      expect(window.location.href).toBe('')
      expect(error.value).toBe('')
    })

    it('should handle login flow when user needs profile completion', async () => {
      const { useLogin } = await import('../useLogin')
      const { isRegisterMode, error, login, updateId, updatePassword } = useLogin()

      // Ensure we're in login mode
      isRegisterMode.value = false

      // Setup successful login but user not enabled
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'newuser'
      mockAuthStore.accessToken = 'valid-token'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = false // User needs to complete profile
      mockRoute.query = { redirect: 'https://external-app.example.com/callback' }

      // Fill login form
      updateId('newuser')
      updatePassword('password123')

      // Perform login
      await login()

      // Verify store methods were called
      expect(mockAuthStore.login).toHaveBeenCalledWith('newuser', 'password123')
      expect(mockUserStore.getProfile).toHaveBeenCalled()

      // Verify redirect to complete profile (not external redirect)
      expect(mockRouter.push).toHaveBeenCalledWith({ name: 'complete-profile' })
      expect(window.location.href).toBe('')
      expect(error.value).toBe('')
    })

    it('should handle authentication failure gracefully', async () => {
      const { useLogin } = await import('../useLogin')
      const { isRegisterMode, error, login, updateId, updatePassword } = useLogin()

      // Ensure we're in login mode
      isRegisterMode.value = false

      // Setup failed login
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = null // Login failed
      mockAuthStore.accessToken = null
      mockRoute.query = { redirect: 'https://external-app.example.com/callback' }

      // Fill login form
      updateId('testuser')
      updatePassword('wrongpassword')

      // Perform login
      await login()

      // Verify login was attempted
      expect(mockAuthStore.login).toHaveBeenCalledWith('testuser', 'wrongpassword')

      // Verify no navigation or redirect occurred
      expect(mockRouter.push).not.toHaveBeenCalled()
      expect(window.location.href).toBe('')
      expect(error.value).toBe('登入失敗! 請檢查您的帳號和密碼。')
    })

    it('should handle store errors during login', async () => {
      const { useLogin } = await import('../useLogin')
      const { isRegisterMode, error, login, updateId, updatePassword } = useLogin()

      // Ensure we're in login mode
      isRegisterMode.value = false

      // Setup login to throw error
      mockAuthStore.login.mockRejectedValue(new Error('網路錯誤'))
      mockRoute.query = { redirect: 'https://external-app.example.com/callback' }

      // Fill login form
      updateId('testuser')
      updatePassword('password123')

      // Perform login
      await login()

      // Verify error was handled
      expect(error.value).toBe('網路錯誤')
      expect(mockRouter.push).not.toHaveBeenCalled()
      expect(window.location.href).toBe('')
    })

    it('should handle complex redirect URLs with query parameters', async () => {
      const { useLogin } = await import('../useLogin')
      const { isRegisterMode, error, login, updateId, updatePassword } = useLogin()

      // Ensure we're in login mode
      isRegisterMode.value = false

      // Setup successful login with complex redirect URL
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'valid-token'
      mockUserStore.getProfile.mockResolvedValue(undefined)
      mockUserStore.enabled = true
      mockUserStore.privacy_agreed_at = '2025-11-01T10:00:00+08:00'
      mockRoute.query = {
        redirect: 'https://external-app.example.com/sso/callback?state=abc123&return_to=/dashboard',
      }

      // Fill login form
      updateId('testuser')
      updatePassword('password123')

      // Perform login
      await login()

      // Verify complex redirect URL was preserved
      expect(window.location.href).toBe(
        'https://external-app.example.com/sso/callback?state=abc123&return_to=/dashboard',
      )
      expect(mockRouter.push).not.toHaveBeenCalled()
      expect(error.value).toBe('')
    })

    it('should handle getProfile failure during login', async () => {
      const { useLogin } = await import('../useLogin')
      const { isRegisterMode, error, login, updateId, updatePassword } = useLogin()

      // Ensure we're in login mode
      isRegisterMode.value = false

      // Setup successful login but getProfile fails
      mockAuthStore.login.mockResolvedValue(undefined)
      mockAuthStore.id = 'testuser'
      mockAuthStore.accessToken = 'valid-token'
      mockUserStore.getProfile.mockRejectedValue(new Error('個人資料載入失敗'))
      mockRoute.query = { redirect: 'https://external-app.example.com/callback' }

      // Fill login form
      updateId('testuser')
      updatePassword('password123')

      // Perform login
      await login()

      // Verify error was handled
      expect(error.value).toBe('個人資料載入失敗')
      expect(mockRouter.push).not.toHaveBeenCalled()
      expect(window.location.href).toBe('')
    })
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
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
const mockAuthStore = {
  register: vi.fn(),
  login: vi.fn(),
  id: null,
  accessToken: null,
}

const mockUserStore = {
  getProfile: vi.fn(),
  enabled: true,
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
      updateId('testuser')
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
        'testuser',
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
      expect(formData.value.id).toBe('testuser')
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
      mockAuthStore.register.mockRejectedValue(new Error('Registration failed'))

      // Fill form with valid data
      updateId('testuser')
      updateName('Test User')
      updatePassword('password123')
      updateConfirmPassword('password123')
      updatePrimaryEmail('test@example.com')
      updateAgreedRules(true)

      // Attempt registration
      await login()

      // Should show error message and stay in register mode
      expect(error.value).toBe('Registration failed')
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
      updateId('testuser')
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
      updateId('testuser')
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
      expect(formData.value.id).toBe('testuser')
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
})

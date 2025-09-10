import { describe, it, expect } from 'vitest'
import { isValidPassword, PASSWORD_MIN_LENGTH } from '../validation'

describe('validation utilities', () => {
  describe('isValidPassword', () => {
    it('should return true for valid passwords', () => {
      expect(isValidPassword('password123')).toBe(true)
      expect(isValidPassword('12345678')).toBe(true)
      expect(isValidPassword('a'.repeat(8))).toBe(true)
      expect(isValidPassword('VeryLongPasswordWithSpecialChars!@#')).toBe(true)
    })

    it('should return false for invalid passwords', () => {
      expect(isValidPassword('1234567')).toBe(false) // 7 characters
      expect(isValidPassword('short')).toBe(false)
      expect(isValidPassword('')).toBe(false)
      expect(isValidPassword('a'.repeat(7))).toBe(false)
    })
    it('should return false for various non-string inputs using @ts-expect-error', () => {
      // @ts-expect-error - Testing with null
      expect(isValidPassword(null)).toBe(false)
      // @ts-expect-error - Testing with undefined
      expect(isValidPassword(undefined)).toBe(false)
      // @ts-expect-error - Testing with a number
      expect(isValidPassword(12345678)).toBe(false)
      // @ts-expect-error - Testing with an object
      expect(isValidPassword({ password: 'password123' })).toBe(false)
      // @ts-expect-error - Testing with an array
      expect(isValidPassword(['password123'])).toBe(false)
    })
    it('should return false for non-string inputs', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isValidPassword(null as any)).toBe(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isValidPassword(undefined as any)).toBe(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isValidPassword(123 as any)).toBe(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isValidPassword({} as any)).toBe(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isValidPassword([] as any)).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isValidPassword(' '.repeat(8))).toBe(true) // spaces count as characters
      expect(isValidPassword('😊'.repeat(4))).toBe(true) // unicode characters
    })
  })

  describe('PASSWORD_MIN_LENGTH constant', () => {
    it('should be set to 8', () => {
      expect(PASSWORD_MIN_LENGTH).toBe(8)
      expect('x'.repeat(PASSWORD_MIN_LENGTH).length).toBe(8)
    })
  })
})

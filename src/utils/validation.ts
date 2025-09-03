// Centralized validation helpers
// Password policy: minimum 8 characters (can extend with complexity rules later)

export function isValidPassword(pw: string): boolean {
  return typeof pw === 'string' && pw.length >= 8
}

export const PASSWORD_MIN_LENGTH = 8

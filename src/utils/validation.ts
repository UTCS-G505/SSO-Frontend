// Centralized validation helpers
// Password policy: minimum 8 characters (can extend with complexity rules later)

export function isValidPassword(pw: string): boolean {
  return typeof pw === 'string' && pw.length >= 8
}

export const PASSWORD_MIN_LENGTH = 8

/**
 * Validates Taiwan ROC ID (身分證字號)
 *
 * Rules:
 * 1. First character is a letter (A-Z) representing the city/county
 * 2. Second character is 1 (male) or 2 (female)
 * 3. Followed by 8 digits
 * 4. Uses checksum validation
 *
 * @param id - The Taiwan ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidTaiwanId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false
  }

  // Convert to uppercase and trim
  const cleanId = id.trim().toUpperCase()

  // Check format: 1 letter + 9 digits
  const idPattern = /^[A-Z][12]\d{8}$/
  if (!idPattern.test(cleanId)) {
    return false
  }

  // Letter to number mapping (城市代碼)
  const letterValues: Record<string, number> = {
    A: 10, // 台北市
    B: 11, // 台中市
    C: 12, // 基隆市
    D: 13, // 台南市
    E: 14, // 高雄市
    F: 15, // 台北縣
    G: 16, // 宜蘭縣
    H: 17, // 桃園縣
    I: 34, // 嘉義市
    J: 18, // 新竹縣
    K: 19, // 苗栗縣
    L: 20, // 台中縣
    M: 21, // 南投縣
    N: 22, // 彰化縣
    O: 35, // 新竹市
    P: 23, // 雲林縣
    Q: 24, // 嘉義縣
    R: 25, // 台南縣
    S: 26, // 高雄縣
    T: 27, // 屏東縣
    U: 28, // 花蓮縣
    V: 29, // 台東縣
    W: 32, // 金門縣
    X: 30, // 澎湖縣
    Y: 31, // 陽明山
    Z: 33, // 連江縣
  }

  const firstLetter = cleanId[0]
  const letterValue = letterValues[firstLetter]

  if (letterValue === undefined) {
    return false
  }

  // Step 2: 個位數乘9再加上十位數
  const letterChecksum = (letterValue % 10) * 9 + Math.floor(letterValue / 10)

  // Step 3: 各數字從右到左依次乘1、2、3、4、5、6、7、8
  // The ID format is: Letter + 9 digits (index 1-9)
  // We need to multiply digits at index 1-8 by weights 8,7,6,5,4,3,2,1
  // and the last digit (index 9) is the check digit
  let sum = letterChecksum

  const weights = [8, 7, 6, 5, 4, 3, 2, 1]
  for (let i = 0; i < 8; i++) {
    const digit = parseInt(cleanId[i + 1], 10)
    sum += digit * weights[i]
  }

  // Add the last check digit
  sum += parseInt(cleanId[9], 10)

  // Step 5: Check if sum is divisible by 10
  return sum % 10 === 0
}

/**
 * Gets a user-friendly error message for invalid Taiwan ID
 */
export function getTaiwanIdErrorMessage(): string {
  return '請輸入有效的身分證字號（例如：T112663836）'
}

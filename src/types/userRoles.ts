// User role constants mapping
export const USER_ROLES = {
  ADMIN: 0, // 系統管理員
  OFFICER: 1, // 系辦人員
  DIRECTOR: 2, // 系主任
  TEACHER: 3, // 系上教師
  STUDENT: 4, // 系上學生
  UT_USER: 5, // 校內人員
  GUEST: 6, // 校外人士
} as const

// Type for user role values
export type UserRoleValue = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Type for user role keys
export type UserRoleKey = keyof typeof USER_ROLES

// Reverse mapping for display purposes
export const ROLE_NAMES: Record<UserRoleValue, string> = {
  [USER_ROLES.ADMIN]: '系統管理員',
  [USER_ROLES.OFFICER]: '系辦人員',
  [USER_ROLES.DIRECTOR]: '系主任',
  [USER_ROLES.TEACHER]: '系上教師',
  [USER_ROLES.STUDENT]: '系上學生',
  [USER_ROLES.UT_USER]: '校內人員',
  [USER_ROLES.GUEST]: '校外人士',
}

// English role names for API/internal use
export const ROLE_NAMES_EN: Record<UserRoleValue, string> = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.OFFICER]: 'Officer',
  [USER_ROLES.DIRECTOR]: 'Director',
  [USER_ROLES.TEACHER]: 'Teacher',
  [USER_ROLES.STUDENT]: 'Student',
  [USER_ROLES.UT_USER]: 'UT User',
  [USER_ROLES.GUEST]: 'Guest',
}

// Helper functions
export const getRoleName = (role: UserRoleValue): string => {
  return ROLE_NAMES[role] || '未知角色'
}

export const getRoleNameEn = (role: UserRoleValue): string => {
  return ROLE_NAMES_EN[role] || 'Unknown'
}

export const isAdmin = (role: UserRoleValue): boolean => {
  return role === USER_ROLES.ADMIN
}

export const isOfficer = (role: UserRoleValue): boolean => {
  return role === USER_ROLES.OFFICER
}

export const isDirector = (role: UserRoleValue): boolean => {
  return role === USER_ROLES.DIRECTOR
}

export const isTeacher = (role: UserRoleValue): boolean => {
  return role === USER_ROLES.TEACHER
}

export const isStudent = (role: UserRoleValue): boolean => {
  return role === USER_ROLES.STUDENT
}

export const isUTUser = (role: UserRoleValue): boolean => {
  return role === USER_ROLES.UT_USER
}

export const isGuest = (role: UserRoleValue): boolean => {
  return role === USER_ROLES.GUEST
}

// Check if user has admin privileges (admin or higher)
export const hasAdminPrivileges = (role: UserRoleValue): boolean => {
  return role === USER_ROLES.ADMIN
}

// Check if user has officer-level privileges (admin, officer, director)
export const hasOfficerPrivileges = (role: UserRoleValue): boolean => {
  return ([USER_ROLES.ADMIN, USER_ROLES.OFFICER, USER_ROLES.DIRECTOR] as UserRoleValue[]).includes(
    role,
  )
}

// Check if user has teaching privileges (admin, officer, director, teacher)
export const hasTeachingPrivileges = (role: UserRoleValue): boolean => {
  return (
    [
      USER_ROLES.ADMIN,
      USER_ROLES.OFFICER,
      USER_ROLES.DIRECTOR,
      USER_ROLES.TEACHER,
    ] as UserRoleValue[]
  ).includes(role)
}

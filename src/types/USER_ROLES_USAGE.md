# User Role System

This file demonstrates how to use the user role constants and utilities.

## Usage Examples

```typescript
import {
  USER_ROLES,
  getRoleName,
  hasAdminPrivileges,
  hasOfficerPrivileges,
  isStudent,
} from '@/types/userRoles'

// Check user role
const userRole = USER_ROLES.STUDENT // 4

// Get role display name
const displayName = getRoleName(userRole) // "系上學生"

// Check permissions
if (hasAdminPrivileges(userRole)) {
  // User can access admin features
}

if (hasOfficerPrivileges(userRole)) {
  // User can access officer-level features
}

if (isStudent(userRole)) {
  // Student-specific logic
}
```

## Role Constants

- `USER_ROLES.ADMIN = 0` - 系統管理員
- `USER_ROLES.OFFICER = 1` - 系辦人員
- `USER_ROLES.DIRECTOR = 2` - 系主任
- `USER_ROLES.TEACHER = 3` - 系上教師
- `USER_ROLES.STUDENT = 4` - 系上學生
- `USER_ROLES.UT_USER = 5` - 校內人員
- `USER_ROLES.GUEST = 6` - 校外人士

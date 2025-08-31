import type { FunctionalComponent } from 'vue'
import {
  School,
  Lock,
  Hammer,
  User,
  FileText,
  Settings,
  Database,
  Shield,
  Code,
} from 'lucide-vue-next'

export interface AppConfig {
  id: string
  name: string
  description?: string
  icon: FunctionalComponent
  bg: string
  url: string
  launched: boolean
  category?: 'academic' | 'administrative' | 'communication' | 'tools' | 'system'
  requiredRoles?: number[] // User roles that can access this app
  isExternal?: boolean // Opens in new tab
  isActive?: boolean // Whether the app is currently available
}

export const applicationConfig: AppConfig[] = [
  {
    id: 'classroom',
    name: '教室借用',
    description: '借用教室進行課程或活動',
    icon: School,
    bg: '#e0ecff',
    url: 'https://classroom-borrow-frontend.vercel.app/',
    launched: false,
    category: 'academic',
    isExternal: true,
    isActive: true,
  },
  {
    id: 'course',
    name: '系櫃借用',
    description: '借用資科系系櫃',
    icon: Lock,
    bg: '#dcfce7',
    url: 'https://locker-borrow-system-frontend.vercel.app/',
    launched: false,
    category: 'academic',
    isExternal: true,
    isActive: true,
  },
  {
    id: 'repair',
    name: '設備報修',
    description: '報修教室內的設備問題',
    icon: Hammer,
    bg: '#fee2e2',
    url: 'https://classroom-borrow-frontend-pmvh.vercel.app/',
    launched: false,
    category: 'tools',
    isExternal: true,
    isActive: true,
  },
  {
    id: 'portal',
    name: '系網',
    description: '獲取系上各種資訊',
    icon: User,
    bg: '#fef3c7',
    url: 'https://cs.utaipei.edu.tw/index.php',
    launched: false,
    category: 'administrative',
    isExternal: true,
    isActive: true,
  },
  {
    id: 'research',
    name: '研究計畫系統',
    description: '研究計畫申請和管理',
    icon: FileText,
    bg: '#f0fdf4',
    url: 'https://research.ntu.edu.tw',
    launched: false,
    category: 'academic',
    requiredRoles: [2, 3], // DIRECTOR, TEACHER
    isExternal: true,
    isActive: true,
  },
  {
    id: 'admin',
    name: '系統管理',
    description: '系統設定和使用者管理',
    icon: Settings,
    bg: '#fef2f2',
    url: '/admin',
    launched: false,
    category: 'system',
    requiredRoles: [0], // ADMIN only
    isExternal: false,
    isActive: true,
  },
  {
    id: 'database',
    name: '資料庫管理',
    description: '資料庫查詢和維護工具',
    icon: Database,
    bg: '#f8fafc',
    url: '/database',
    launched: false,
    category: 'system',
    requiredRoles: [0, 1], // ADMIN, OFFICER
    isExternal: false,
    isActive: false, // Currently disabled
  },
  {
    id: 'security',
    name: '資安管理',
    description: '安全性設定和監控',
    icon: Shield,
    bg: '#fdf4ff',
    url: '/security',
    launched: false,
    category: 'system',
    requiredRoles: [0], // ADMIN only
    isExternal: false,
    isActive: true,
  },
  {
    id: 'development',
    name: '開發工具',
    description: 'API 文件和開發資源',
    icon: Code,
    bg: '#f0f9ff',
    url: '/dev',
    launched: false,
    category: 'tools',
    requiredRoles: [0], // ADMIN only
    isExternal: false,
    isActive: true,
  },
]

// Helper functions for filtering applications
export const getApplicationsByCategory = (category: AppConfig['category']) => {
  return applicationConfig.filter((app) => app.category === category && app.isActive)
}

export const getApplicationsByRole = (userRole: number) => {
  return applicationConfig.filter((app) => {
    if (!app.isActive) return false
    if (!app.requiredRoles) return true // No role restriction
    return app.requiredRoles.includes(userRole)
  })
}

export const getActiveApplications = () => {
  return applicationConfig.filter((app) => app.isActive)
}

export const getApplicationById = (id: string) => {
  return applicationConfig.find((app) => app.id === id)
}

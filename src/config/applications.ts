import type { FunctionalComponent } from 'vue'
import {
  BookOpen,
  GraduationCap,
  Mail,
  User,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  Database,
  Shield,
  Code,
  Globe,
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
    id: 'lib',
    name: '圖書館資源',
    description: '存取圖書館資料庫、期刊和數位資源',
    icon: BookOpen,
    bg: '#e0ecff',
    url: 'https://library.ntu.edu.tw',
    launched: false,
    category: 'academic',
    isExternal: true,
    isActive: true,
  },
  {
    id: 'course',
    name: '課程管理系統',
    description: '查看課程資訊、成績和教學資源',
    icon: GraduationCap,
    bg: '#dcfce7',
    url: 'https://ceiba.ntu.edu.tw',
    launched: false,
    category: 'academic',
    isExternal: true,
    isActive: true,
  },
  {
    id: 'email',
    name: '電子郵件',
    description: '存取您的學校電子郵件信箱',
    icon: Mail,
    bg: '#fee2e2',
    url: 'https://mail.ntu.edu.tw',
    launched: false,
    category: 'communication',
    isExternal: true,
    isActive: true,
  },
  {
    id: 'portal',
    name: '學生入口網',
    description: '學生資訊、選課、成績查詢',
    icon: User,
    bg: '#fef3c7',
    url: 'https://my.ntu.edu.tw',
    launched: false,
    category: 'administrative',
    isExternal: true,
    isActive: true,
  },
  {
    id: 'calendar',
    name: '學術行事曆',
    description: '查看重要學術日期和活動',
    icon: Calendar,
    bg: '#ede9fe',
    url: 'https://academic-calendar.ntu.edu.tw',
    launched: false,
    category: 'academic',
    isExternal: true,
    isActive: true,
  },
  {
    id: 'tuition',
    name: '學雜費繳納',
    description: '查看和繳納學雜費用',
    icon: CreditCard,
    bg: '#e0e7ff',
    url: 'https://finance.ntu.edu.tw',
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
  {
    id: 'external-portal',
    name: '外部系統入口',
    description: '連結到其他校外系統',
    icon: Globe,
    bg: '#ecfdf5',
    url: 'https://external-systems.edu.tw',
    launched: false,
    category: 'tools',
    isExternal: true,
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

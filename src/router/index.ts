import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { USER_ROLES } from '@/types/userRoles'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import UserManagementView from '@/views/UserManagementView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'user-management',
      component: UserManagementView,
      meta: { requiresAuth: true, requiresManagementRole: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const userStore = useUserStore()
  await authStore.initializeAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.requiresManagementRole) {
    // Check if user has management role (Admin: 0 or Officer: 1)
    if (userStore.role === null) {
      await userStore.getProfile()
    }

    if (userStore.role !== USER_ROLES.ADMIN && userStore.role !== USER_ROLES.OFFICER) {
      next('/dashboard') // Redirect to dashboard if not authorized
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

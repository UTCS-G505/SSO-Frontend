import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { USER_ROLES } from '@/types/userRoles'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CompleteProfileView from '@/views/CompleteProfileView.vue'
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
      path: '/complete-profile',
      name: 'complete-profile',
      component: CompleteProfileView,
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
    // If authenticated, ensure user profile is loaded and check enabled state
    if (authStore.isAuthenticated) {
      if (userStore.role === null && userStore.name === null) {
        try {
          await userStore.getProfile()
        } catch {
          // ignore, handled elsewhere
        }
      }

      // Block access to routes other than complete-profile when user is disabled
      if (userStore.enabled === false && to.name !== 'complete-profile') {
        return next({ name: 'complete-profile' })
      }
    }
    next()
  }
})

export default router

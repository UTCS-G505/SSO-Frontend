<template>
  <div class="user-menu">
    <div class="user-dropdown" @click="toggleDropdown">
      <div class="user-info">
        <div class="user-avatar icon-avatar"><PawPrint class="PawPrint-icon" /></div>
        <div class="user-details">
          <span class="user-name">{{ displayName }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
        <svg
          class="dropdown-icon"
          :class="{ 'rotate-180': isDropdownOpen }"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <div class="dropdown-menu" v-show="isDropdownOpen">
        <div class="dropdown-item" @click.stop="goToDashboard">
          <LayoutGrid class="dropdown-icon-small" />
          Dashboard
        </div>
        <div class="dropdown-item" @click.stop="goToProfile">
          <User class="dropdown-icon-small" />
          Profile
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item logout" @click.stop="handleLogout">
          <LogOut class="dropdown-icon-small" />
          Logout
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { LayoutGrid, User, LogOut, PawPrint } from 'lucide-vue-next'

// Props
interface Props {
  userInitials?: string
  displayName?: string
  userRole?: string
}

withDefaults(defineProps<Props>(), {
  userInitials: 'U',
  displayName: 'User',
  userRole: 'User',
})

// Component name for ESLint
defineOptions({
  name: 'UserMenu',
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const isDropdownOpen = ref(false)

// Methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const goToDashboard = () => {
  isDropdownOpen.value = false
  if (route.name !== 'dashboard') {
    router.push('/dashboard')
  }
}

const goToProfile = () => {
  isDropdownOpen.value = false
  if (route.name !== 'profile') {
    router.push('/profile')
  }
}

const handleLogout = async () => {
  isDropdownOpen.value = false
  await authStore.logout()
  router.push('/login')
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.user-dropdown')
    if (dropdown && !dropdown.contains(e.target as Node)) {
      isDropdownOpen.value = false
    }
  })
})
</script>

<style scoped>
/* User Menu Styles */
.user-menu {
  position: relative;
}

.user-dropdown {
  cursor: pointer;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f0f2f5;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: #BFD7EA;
  /* background: linear-gradient(135deg, #fbbf24, #f59e0b, #f97316); */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.icon-avatar .PawPrint-icon {
  width: 22px;
  height: 22px;
  color: #ffffff;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
}

.user-role {
  color: #64748b;
  font-size: 0.75rem;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
  transition: transform 0.2s;
}

.dropdown-icon.rotate-180 {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 180px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #374151;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background-color: #f9fafb;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background-color: #fef2f2;
}

.dropdown-icon-small {
  width: 16px;
  height: 16px;
}

.dropdown-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 0.5rem 0;
}
</style>

<template>
  <div class="dashboard-container">
    <!-- Sidebar Navigation -->
    <NavigationSidebar />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Top Header -->
      <header class="top-header">
        <div class="search-container">
          <Search class="search-icon" />
          <input type="text" placeholder="Search for applications" class="search-input" />
        </div>
        <div class="user-menu">
          <div class="user-dropdown" @click="toggleDropdown">
            <div class="user-info">
              <div class="user-avatar">JD</div>
              <div class="user-details">
                <span class="user-name">John Doe</span>
                <span class="user-role">Admin</span>
              </div>
              <svg class="dropdown-icon" :class="{ 'rotate-180': isDropdownOpen }" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
            <div class="dropdown-menu" v-show="isDropdownOpen">
              <div class="dropdown-item" @click.stop="viewProfile">
                <User class="dropdown-icon-small" />
                Profile
              </div>
              <div class="dropdown-item" @click.stop="viewSettings">
                <Settings class="dropdown-icon-small" />
                Settings
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item logout" @click.stop="handleLogout">
                <LogOut class="dropdown-icon-small" />
                Logout
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <main class="dashboard-main">
        <div class="applications-grid">
          <div class="app-card" v-for="app in applications" :key="app.id" @click="launchApp(app)">
            <div class="app-image">
              <img :src="app.image" :alt="app.name" />
            </div>
            <div class="app-info">
              <h3>{{ app.name }}</h3>
              <p>{{ app.description }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Search, User, Settings, LogOut } from 'lucide-vue-next'
import NavigationSidebar from '@/components/navigation/Sidebar.vue'

const router = useRouter()
const authStore = useAuthStore()

interface App {
  id: string
  name: string
  description: string
  image: string
  url: string
  launched: boolean
}

const applications = ref<App[]>([
  {
    id: '1',
    name: 'Project Management',
    description: 'Streamline project workflows and team collaboration.',
    image: '/images/project-management.svg',
    url: '#',
    launched: false,
  },
  {
    id: '2',
    name: 'CRM',
    description: 'Manage customer interactions and sales pipelines.',
    image: '/images/crm.svg',
    url: '#',
    launched: false,
  },
  {
    id: '3',
    name: 'Team Chat',
    description: 'Facilitate internal team communication and updates.',
    image: '/images/team-chat.svg',
    url: '#',
    launched: false,
  },
  {
    id: '4',
    name: 'DocuSync',
    description: 'Centralized storage and management of company documents.',
    image: '/images/docusync.svg',
    url: '#',
    launched: false,
  },
  {
    id: '5',
    name: 'Data Insights',
    description: 'Analyze data sets and generate insights.',
    image: '/images/data-insights.svg',
    url: '#',
    launched: false,
  },
  {
    id: '6',
    name: 'MarketFlow',
    description: 'Automate marketing campaigns and track performance.',
    image: '/images/marketflow.svg',
    url: '#',
    launched: false,
  },
  {
    id: '7',
    name: 'HR Central',
    description: 'Manage employee information and HR processes.',
    image: '/images/hr-central.svg',
    url: '#',
    launched: false,
  },
  {
    id: '8',
    name: 'Sales Dash',
    description: 'Track sales metrics and team performance.',
    image: '/images/sales-dash.svg',
    url: '#',
    launched: false,
  },
])

// Dropdown state
const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const viewProfile = () => {
  isDropdownOpen.value = false
  router.push('/profile')
}

const viewSettings = () => {
  console.log('Settings clicked')
  isDropdownOpen.value = false
  // Add settings view logic here
}

const handleLogout = async () => {
  isDropdownOpen.value = false
  await authStore.logout()
  router.push('/login')
}

const launchApp = (app: App) => {
  app.launched = true
  console.log(`Launching ${app.name} at ${app.url}`)
  // In a real implementation, this would redirect to the app with SSO token
  if (app.url !== '#') {
    window.open(app.url, '_blank')
  }
}

// Click outside handler to close dropdown
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.user-dropdown')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.top-header {
  background-color: #f0f2f5;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: #f9fafb;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-icon {
  position: relative;
  padding: 0.5rem;
  color: #6b7280;
  cursor: pointer;
}

.notification-icon svg {
  width: 24px;
  height: 24px;
}

.notification-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: #f59e0b;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
}

.user-role {
  font-size: 0.875rem;
  color: #6b7280;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  transition: transform 0.2s;
}

.dropdown-icon.rotate-180 {
  transform: rotate(180deg);
}

.user-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 200px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.15s;
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

/* Dashboard Main Content */
.dashboard-main {
  padding: 2rem;
  flex: 1;
}

/* Applications Grid */
.applications-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.app-card {
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
}

.app-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.app-image {
  width: 100%;
  height: 120px;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.app-info p {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .applications-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .applications-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 200px;
  }

  .applications-grid {
    grid-template-columns: 1fr;
  }

  .top-header {
    padding: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .search-container {
    order: 2;
    flex: none;
    width: 100%;
    max-width: none;
  }

  .user-menu {
    order: 1;
    width: 100%;
    justify-content: space-between;
  }

  .dashboard-main {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .main-content {
    margin-left: 60px;
  }

  .dashboard-main {
    padding: 1rem;
  }
}
</style>

<template>
  <div class="dashboard-shell">
    <!-- App Header -->
    <AppHeader />

    <!-- Applications Section -->
    <main class="apps-section">
      <h2 class="section-title">Applications</h2>
      <div class="apps-grid">
        <div
          class="app-card"
          v-for="app in applications"
          :key="app.id"
          role="button"
          tabindex="0"
          :title="app.description || app.name"
          @click="launchApp(app)"
          @keydown.enter.prevent="launchApp(app)"
        >
          <div class="app-icon" :style="{ backgroundColor: app.bg }">
            <component :is="app.icon" class="icon" />
          </div>
          <div class="app-info">
            <div class="app-name">{{ app.name }}</div>
            <!-- <div v-if="app.description" class="app-description">{{ app.description }}</div> -->
          </div>
          <!-- <div v-if="app.isExternal" class="external-indicator" title="在新分頁開啟">
            <svg class="external-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z"/>
            </svg>
          </div> -->
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import AppHeader from '@/components/common/Header.vue'
import { applicationConfig, getApplicationsByRole, type AppConfig } from '@/config/applications'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

// Computed property to filter applications based on user role
const applications = computed<AppConfig[]>(() => {
  if (userStore.role !== null) {
    return getApplicationsByRole(userStore.role)
  }
  // If no role is set, show basic applications (no role restrictions)
  return applicationConfig.filter((app) => app.isActive && !app.requiredRoles)
})

const launchApp = (app: AppConfig) => {
  // Update the launched state (this would typically be handled by a store)
  const appIndex = applicationConfig.findIndex((a) => a.id === app.id)
  if (appIndex !== -1) {
    applicationConfig[appIndex].launched = true
  }

  console.log(`Launching ${app.name} at ${app.url}`)

  // Handle different types of URLs
  if (app.url.startsWith('http') || app.isExternal) {
    // External URL - open in new tab
    window.open(app.url, '_blank')
  } else if (app.url.startsWith('/')) {
    // Internal route - navigate using Vue Router
    router.push(app.url)
  } else if (app.url === '#') {
    // Placeholder URL - show coming soon message
    console.log(`${app.name} coming soon!`)
  }
}

onMounted(async () => {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Ensure user profile is loaded for role-based app filtering
  if (!userStore.name || userStore.role === null) {
    try {
      await userStore.getProfile()
    } catch (error) {
      console.error('Failed to load user profile:', error)
      // Continue with default applications if profile loading fails
    }
  }
})
</script>

<style scoped>
/* Shell */
.dashboard-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Section */
.apps-section {
  flex: 1;
  padding: 2rem 2.25rem 3rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.section-title {
  margin: 0 0 1.5rem;
  font-size: 1.375rem;
  font-weight: 600;
  color: #1e293b;
}

/* Grid */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.75rem;
}

.app-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  min-height: 160px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  transition:
    box-shadow 0.18s,
    transform 0.18s,
    border-color 0.18s;
  user-select: none;
  position: relative;
}

.app-card:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.app-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #d1d5db;
}

.app-icon {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e293b;
  flex-shrink: 0;
}

.icon {
  width: 26px;
  height: 26px;
}

.app-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  text-align: center;
}

.app-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  line-height: 1.2;
}

.app-description {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.3;
  max-width: 180px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.external-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #9ca3af;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.external-icon {
  width: 14px;
  height: 14px;
}

.app-card:hover .external-indicator {
  opacity: 1;
  color: #6b7280;
}

@media (max-width: 640px) {
  .apps-section {
    padding: 1.25rem 1.25rem 2rem;
  }
  .apps-grid {
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  .app-card {
    min-height: 140px;
    padding: 1rem;
  }
  .app-description {
    max-width: 200px;
    font-size: 0.75rem;
  }
  .external-icon {
    width: 12px;
    height: 12px;
  }
}
</style>

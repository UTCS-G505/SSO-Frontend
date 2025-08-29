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
          @click="launchApp(app)"
          @keydown.enter.prevent="launchApp(app)"
        >
          <div class="app-icon" :style="{ backgroundColor: app.bg }">
            <component :is="app.icon" class="icon" />
          </div>
          <div class="app-name">{{ app.name }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppHeader from '@/components/common/Header.vue'
import { BookOpen, GraduationCap, Mail, User, Calendar, CreditCard } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

import type { FunctionalComponent } from 'vue'

interface AppCard {
  id: string
  name: string
  icon: FunctionalComponent
  bg: string
  url: string
  launched: boolean
}

const applications = ref<AppCard[]>([
  {
    id: 'lib',
    name: 'Library Resources',
    icon: BookOpen,
    bg: '#e0ecff',
    url: '#',
    launched: false,
  },
  {
    id: 'course',
    name: 'Course Management',
    icon: GraduationCap,
    bg: '#dcfce7',
    url: '#',
    launched: false,
  },
  { id: 'email', name: 'Email', icon: Mail, bg: '#fee2e2', url: '#', launched: false },
  { id: 'portal', name: 'Student Portal', icon: User, bg: '#fef3c7', url: '#', launched: false },
  {
    id: 'calendar',
    name: 'Academic Calendar',
    icon: Calendar,
    bg: '#ede9fe',
    url: '#',
    launched: false,
  },
  {
    id: 'tuition',
    name: 'Tuition & Fees',
    icon: CreditCard,
    bg: '#e0e7ff',
    url: '#',
    launched: false,
  },
])

const launchApp = (app: AppCard) => {
  app.launched = true
  console.log(`Launching ${app.name} at ${app.url}`)
  // In a real implementation, this would redirect to the app with SSO token
  if (app.url !== '#') {
    window.open(app.url, '_blank')
  }
}

onMounted(() => {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<style scoped>
/* Shell */
.dashboard-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6f8;
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
  height: 160px;
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
}

.icon {
  width: 26px;
  height: 26px;
}

.app-name {
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  color: #374151;
  padding: 0 0.5rem;
}

@media (max-width: 640px) {
  .apps-section {
    padding: 1.25rem 1.25rem 2rem;
  }
  .apps-grid {
    gap: 1.25rem;
  }
  .app-card {
    height: 150px;
  }
}
</style>

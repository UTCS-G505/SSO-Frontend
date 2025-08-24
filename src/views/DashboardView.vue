<template>
  <div class="dashboard-container">
    <!-- Sidebar Navigation -->
    <NavigationSidebar />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-title">
          <h1>Dashboard</h1>
          <p>Access your applications and services</p>
        </div>
        <UserMenu
          user-initials="JD"
          display-name="John Doe"
          user-role="Admin"
        />
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NavigationSidebar from '@/components/navigation/Sidebar.vue'
import UserMenu from '@/components/common/UserMenu.vue'

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

const launchApp = (app: App) => {
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
  background: #f0f2f5;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-title h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.header-title p {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.875rem;
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
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
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

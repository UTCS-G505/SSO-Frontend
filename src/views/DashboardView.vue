<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>北市大資科系 SSO Dashboard</h1>
        <div class="user-info">
          <span>歡迎, {{ authStore.user?.username }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="dashboard-content">
        <div class="welcome-section">
          <h2>歡迎來到 SSO Dashboard</h2>
          <p>You have successfully authenticated through Single Sign-On.</p>
        </div>

        <div class="apps-grid">
          <h3>Connected Applications</h3>
          <div class="apps-container">
            <div class="app-card" v-for="app in connectedApps" :key="app.id">
              <div class="app-icon">
                <i :class="app.icon"></i>
              </div>
              <h4>{{ app.name }}</h4>
              <p>{{ app.description }}</p>
              <button
                @click="launchApp(app)"
                class="launch-btn"
                :class="{ launched: app.launched }"
              >
                {{ app.launched ? 'Launched' : 'Launch App' }}
              </button>
            </div>
          </div>
        </div>

        <div class="user-profile">
          <h3>User Profile</h3>
          <div class="profile-info">
            <div class="profile-item"><strong>學號:</strong> {{ authStore.user?.username }}</div>
            <div class="profile-item">
              <strong>Login Time:</strong> {{ formatDate(authStore.user?.loginTime) }}
            </div>
            <div class="profile-item">
              <strong>Session ID:</strong> {{ authStore.user?.sessionId }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

interface App {
  id: string
  name: string
  description: string
  icon: string
  url: string
  launched: boolean
}

const connectedApps = ref<App[]>([
  {
    id: '1',
    name: '教室借用系統',
    description: '借用資科系的教室',
    icon: '🏫',
    url: 'http://163.21.235.66/',
    launched: false,
  },
  {
    id: '2',
    name: '系櫃申請系統',
    description: '申請資科系上的系櫃',
    icon: '👥',
    url: 'https://hr.example.com',
    launched: false,
  },
  {
    id: '3',
    name: '設備報修系統',
    description: '回報系上需要報修的物品',
    icon: '📄',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSe0aGGJC6fhdvQ1H28D-KZkQewNswIisOOAX819mQuJg1E_Xw/viewform',
    launched: false,
  },
])

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const launchApp = (app: App) => {
  // In a real implementation, this would redirect to the app with SSO token
  app.launched = true
  console.log(`Launching ${app.name} at ${app.url}`)
  window.open(app.url, '_blank')
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
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
  min-height: 100vh;
  background-color: #f5f7fa;
}

.dashboard-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info span {
  color: #666;
  font-weight: 500;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-content {
  display: grid;
  gap: 2rem;
}

.welcome-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.welcome-section h2 {
  margin-bottom: 1rem;
  color: #333;
}

.welcome-section p {
  color: #666;
  font-size: 1.1rem;
}

.apps-grid {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.apps-grid h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.apps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.app-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.app-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.app-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.app-card h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.app-card p {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.launch-btn {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.launch-btn:hover {
  background-color: #0056b3;
}

.launch-btn.launched {
  background-color: #28a745;
  cursor: default;
}

.launch-btn.launched:hover {
  background-color: #28a745;
}

.user-profile {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-profile h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.profile-info {
  display: grid;
  gap: 1rem;
}

.profile-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-item strong {
  color: #333;
}

@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }

  .dashboard-main {
    padding: 1rem;
  }

  .apps-container {
    grid-template-columns: 1fr;
  }

  .user-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

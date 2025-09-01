<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <img src="/src/assets/logo.png" alt="UTCS 單一登入" class="logo-icon" />
        <span>UTCS 單一登入</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li class="nav-item" :class="{ active: currentRoute === 'dashboard' }">
          <router-link to="/dashboard" class="nav-link">
            <LayoutGrid class="nav-icon" />
            應用程式
          </router-link>
        </li>
        <li class="nav-item" :class="{ active: currentRoute === 'profile' }">
          <router-link to="/profile" class="nav-link">
            <User class="nav-icon" />
            個人資料
          </router-link>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">
            <Clock class="nav-icon" />
            活動紀錄
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">
            <HelpCircle class="nav-icon" />
            說明
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutGrid, User, Clock, HelpCircle } from 'lucide-vue-next'

// Component name for ESLint
defineOptions({
  name: 'NavigationSidebar',
})

const route = useRoute()

const currentRoute = computed(() => route.name as string)
</script>

<style scoped>
/* Sidebar Styles */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #475569;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.logo-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
}

.sidebar-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: white;
}

.nav-item.active .nav-link,
.nav-link.router-link-active {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border-left-color: #3b82f6;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
}

@media (max-width: 640px) {
  .sidebar {
    width: 60px;
  }

  .sidebar-header .logo span,
  .nav-link span {
    display: none;
  }
}
</style>

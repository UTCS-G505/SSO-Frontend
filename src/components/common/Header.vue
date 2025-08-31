<template>
  <header class="app-header">
    <div class="header-left">
      <img src="/src/assets/logo.png" alt="University SSO" class="header-logo" />
      <span class="header-brand">UTCS SSO</span>
    </div>
    <div class="header-right">
      <UserMenu />
    </div>
  </header>
</template>

<script setup lang="ts">
import UserMenu from './UserMenu.vue'

// Component name for ESLint
defineOptions({
  name: 'AppHeader',
})
</script>

<style scoped>
/* Header Styles */
.app-header {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.75rem;
  position: sticky;
  top: 0;
  z-index: 30;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #1e293b;
}

.header-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.header-brand {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1e293b;
}

.header-right {
  display: flex;
  align-items: center;
}

/* Responsive Design */
@media (max-width: 640px) {
  .app-header {
    padding: 0 1rem;
  }

  .header-brand {
    font-size: 1rem;
  }

  .header-logo {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 420px) {
  .app-header {
    padding: 0 0.75rem;
  }

  .header-left {
    gap: 0.5rem;
  }

  .header-brand {
    font-size: 0.9rem;
  }
}
</style>

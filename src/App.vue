<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import FootBar from '@/components/common/FootBar.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const authStore = useAuthStore()

onMounted(async () => {
  // Initialize auth state when app starts
  if (!authStore.isAuthenticated) {
    await authStore.initializeAuth()
  }
})
</script>

<template>
  <div id="app">
    <div class="app-main">
      <RouterView />
    </div>
    <FootBar />
    <ToastContainer />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f7fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

/* Global styles */
button {
  font-family: inherit;
}

input {
  font-family: inherit;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>

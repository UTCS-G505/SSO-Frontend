<template>
  <div class="not-found-container">
    <!-- App Header with logo and UserMenu -->
    <AppHeader />

    <div class="not-found-content">
      <div class="error-icon">
        <div class="info-circle">
          <CircleAlert :size="40" />
        </div>
      </div>

  <h1 class="error-title">找不到頁面</h1>

      <p class="error-message">
        很抱歉，您要造訪的頁面不存在，可能已被移動或刪除。
      </p>

      <div class="error-actions">
        <button @click="goHome" class="btn btn-primary">
          <ArrowLeft :size="20" />
          返回應用程式總覽
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, CircleAlert } from 'lucide-vue-next'
import AppHeader from '@/components/common/Header.vue'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.not-found-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.error-icon {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.info-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.info-circle :deep(svg) {
  color: white;
}

.error-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

@media (max-width: 640px) {
  .not-found-content {
    padding: 2rem 1rem;
    margin: 1rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .info-circle {
    width: 60px;
    height: 60px;
  }

  .info-circle :deep(svg) {
    width: 30px;
    height: 30px;
  }
}
</style>

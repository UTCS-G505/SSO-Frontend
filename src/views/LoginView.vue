<template>
  <div class="login-container">
    <div class="login-content">
      <!-- Left side - Login form -->
      <LoginForm
        :form-data="formData"
        :is-loading="isLoading"
        :error="error"
        @update:username="updateUsername"
        @update:password="updatePassword"
        @update:remember-me="updateRememberMe"
        @submit="handleLogin"
      />

      <!-- Right side - Marketing content -->
      <VSCodeMockup />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/login/LoginForm.vue'
import VSCodeMockup from '@/components/login/VSCodeMockup.vue'
import { useLogin } from '@/composables/useLogin'

const { formData, isLoading, error, login, updateUsername, updatePassword, updateRememberMe } =
  useLogin()

const handleLogin = () => {
  login()
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.login-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: 95vh;
  background: white;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    height: auto;
  }
}
</style>

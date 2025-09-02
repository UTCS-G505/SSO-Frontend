<template>
  <div class="login-container">
    <div class="login-content">
      <!-- Left side - Login form -->
      <LoginForm
        :form-data="formData"
        :is-loading="isLoading"
        :error="error"
        :success="success"
        :is-register-mode="isRegisterMode"
        @update:id="updateId"
        @update:name="updateName"
        @update:password="updatePassword"
        @update:primary-email="updatePrimaryEmail"
        @update:secondary-email="updateSecondaryEmail"
        @update:phone-number="updatePhoneNumber"
        @update:position="updatePosition"
        @update:confirm-password="updateConfirmPassword"
        @update:remember-me="updateRememberMe"
        @update:agreed-rules="updateAgreedRules"
        @submit="handleLogin"
        @toggle-mode="toggleMode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/login/LoginForm.vue'
import { useLogin } from '@/composables/useLogin'

const {
  formData,
  isLoading,
  error,
  success,
  isRegisterMode,
  login,
  toggleMode,
  updateId,
  updateName,
  updatePassword,
  updatePrimaryEmail,
  updateSecondaryEmail,
  updatePhoneNumber,
  updatePosition,
  updateConfirmPassword,
  updateRememberMe,
  updateAgreedRules,
} = useLogin()

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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  padding: 20px;
  box-sizing: border-box;
}

.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;
  min-height: 600px;
  background: white;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }

  .login-content {
    flex-direction: column;
    height: auto;
  }
}
</style>

<template>
  <div class="login-card">
    <div class="logo-section">
      <div class="logo">
        <span class="logo-icon">🖥️</span>
        <span class="logo-text">UTCS SSO</span>
      </div>
    </div>

    <div class="form-section">
      <h1>Login</h1>
      <p class="subtitle">Access CS resources: classroom booking, locker requests, and more.</p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            :value="formData.username"
            @input="updateUsername"
            type="text"
            required
            placeholder="U11216028"
            :disabled="isLoading"
          />
        </div>

        <PasswordInput
          :model-value="formData.password"
          @update:model-value="updatePassword"
          :disabled="isLoading"
        />

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" :checked="formData.rememberMe" @change="updateRememberMe" />
            Remember me
          </label>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import PasswordInput from './PasswordInput.vue'

interface LoginFormData {
  username: string
  password: string
  rememberMe: boolean
}

interface Props {
  formData: LoginFormData
  isLoading: boolean
  error: string
}

interface Emits {
  'update:username': [value: string]
  'update:password': [value: string]
  'update:rememberMe': [value: boolean]
  submit: [data: LoginFormData]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateUsername = (event: Event) => {
  emit('update:username', (event.target as HTMLInputElement).value)
}

const updatePassword = (value: string) => {
  emit('update:password', value)
}

const updateRememberMe = (event: Event) => {
  emit('update:rememberMe', (event.target as HTMLInputElement).checked)
}

const handleSubmit = () => {
  emit('submit', props.formData)
}
</script>

<style scoped>
.login-card {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
  background: #f7f0d8;
  border-radius: 16px 0 0 16px;
}

.logo-section {
  margin-bottom: 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.form-section h1 {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 32px;
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}

input:not([type='checkbox']) {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
  box-sizing: border-box;
}

input:not([type='checkbox']):focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.remember-me input[type='checkbox'] {
  width: 16px;
  height: 16px;
  margin: 0;
  appearance: none;
  border: 2px solid #d1d5db;
  border-radius: 3px;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.remember-me input[type='checkbox']:checked {
  background: linear-gradient(135deg, #a0522d 0%, #8b4513 100%);
  border-color: #a0522d;
  box-shadow: 0 2px 4px rgba(139, 69, 19, 0.3);
}

.remember-me input[type='checkbox']:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 10px;
  font-weight: bold;
}

.forgot-password {
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  color: #6b7280;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #cd853f 0%, #a0522d 50%, #8b4513 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
  background: linear-gradient(135deg, #daa520 0%, #cd853f 50%, #a0522d 100%);
}

.login-btn:hover:not(:disabled)::before {
  left: 100%;
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(139, 69, 19, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #fef2f2;
  color: #dc2626;
  border-radius: 8px;
  border: 1px solid #fecaca;
  text-align: center;
  font-size: 14px;
}

@media (max-width: 768px) {
  .login-card {
    padding: 40px 20px;
    max-width: none;
  }
}
</style>

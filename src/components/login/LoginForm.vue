<template>
  <div class="login-card">
    <div class="logo-section">
      <div class="logo">
  <img src="/src/assets/logo.png" alt="UTCS 單一驗證平台" class="logo-icon" />
  <span class="logo-text">UTCS 單一驗證平台</span>
      </div>
    </div>

    <div class="form-section">
  <h1>{{ isRegisterMode ? '建立帳號' : '登入' }}</h1>
      <p class="subtitle">
        {{
          isRegisterMode
            ? '加入 UTCS SSO 以使用資科系資源：教室預約、置物櫃申請等功能。'
            : '使用資科系資源：教室預約、置物櫃申請等功能。'
        }}
      </p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="id">學號 / 帳號</label>
          <input
            id="id"
            :value="formData.id"
            @input="updateId"
            type="text"
            required
            placeholder="請輸入帳號"
            :disabled="isLoading"
          />
        </div>

        <div v-if="isRegisterMode" class="form-group">
          <label for="name">姓名</label>
          <input
            id="name"
            :value="formData.name"
            @input="updateName"
            type="text"
            required
            placeholder="請輸入完整姓名"
            :disabled="isLoading"
          />
        </div>

        <div v-if="isRegisterMode" class="form-group">
          <label for="primary-email">主要 Email</label>
          <input
            id="primary-email"
            :value="formData.primary_email"
            @input="updatePrimaryEmail"
            type="email"
            required
            placeholder="your.primary@example.com"
            :disabled="isLoading"
          />
        </div>

        <div v-if="isRegisterMode" class="form-group">
          <label for="secondary-email">次要 Email</label>
          <input
            id="secondary-email"
            :value="formData.secondary_email"
            @input="updateSecondaryEmail"
            type="email"
            placeholder="your.secondary@example.com (選填)"
            :disabled="isLoading"
          />
        </div>

        <div v-if="isRegisterMode" class="form-group">
          <label for="phone-number">電話</label>
          <input
            id="phone-number"
            :value="formData.phone_number"
            @input="updatePhoneNumber"
            type="tel"
            placeholder="請輸入電話"
            :disabled="isLoading"
          />
        </div>

        <div v-if="isRegisterMode" class="form-group">
          <label for="position">職稱 / 身分</label>
          <input
            id="position"
            :value="formData.position"
            @input="updatePosition"
            type="text"
            placeholder="請輸入職稱或身分"
            :disabled="isLoading"
          />
        </div>

        <PasswordInput
          :model-value="formData.password"
          @update:model-value="updatePassword"
          :disabled="isLoading"
          :label="isRegisterMode ? '密碼' : '密碼'"
          :placeholder="isRegisterMode ? '至少 6 個字元' : '請輸入密碼'"
          id="password"
        />

        <div v-if="isRegisterMode">
          <PasswordInput
            :model-value="formData.confirmPassword"
            @update:model-value="updateConfirmPassword"
            :disabled="isLoading"
            label="確認密碼"
            placeholder="請再次輸入密碼"
            id="confirm-password"
          />
        </div>

        <div class="form-options" v-if="!isRegisterMode">
          <label class="remember-me">
            <input type="checkbox" :checked="formData.rememberMe" @change="updateRememberMe" />
            記住我
          </label>
          <a href="#" class="forgot-password">忘記密碼？</a>
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{
            isLoading
              ? isRegisterMode
                ? '建立帳號中...'
                : '登入中...'
              : isRegisterMode
                ? '建立帳號'
                : '登入'
          }}
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <div class="mode-toggle">
          <p>
            {{ isRegisterMode ? '已經有帳號？' : '還沒有帳號？' }}
            <button
              type="button"
              @click="handleToggleMode"
              class="toggle-btn"
              :disabled="isLoading"
            >
              {{ isRegisterMode ? '這裡登入' : '這裡註冊' }}
            </button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import PasswordInput from './PasswordInput.vue'

interface LoginFormData {
  id: string
  name: string
  password: string
  confirmPassword: string
  primary_email: string
  secondary_email: string
  phone_number: string
  position: string
  rememberMe: boolean
}

interface Props {
  formData: LoginFormData
  isLoading: boolean
  error: string
  success: string
  isRegisterMode: boolean
}

interface Emits {
  'update:id': [value: string]
  'update:name': [value: string]
  'update:password': [value: string]
  'update:primary-email': [value: string]
  'update:secondary-email': [value: string]
  'update:phone-number': [value: string]
  'update:position': [value: string]
  'update:confirm-password': [value: string]
  'update:rememberMe': [value: boolean]
  submit: [data: LoginFormData]
  'toggle-mode': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateId = (event: Event) => {
  emit('update:id', (event.target as HTMLInputElement).value)
}

const updateName = (event: Event) => {
  emit('update:name', (event.target as HTMLInputElement).value)
}

const updatePassword = (value: string) => {
  emit('update:password', value)
}

const updatePrimaryEmail = (event: Event) => {
  emit('update:primary-email', (event.target as HTMLInputElement).value)
}

const updateSecondaryEmail = (event: Event) => {
  emit('update:secondary-email', (event.target as HTMLInputElement).value)
}

const updatePhoneNumber = (event: Event) => {
  emit('update:phone-number', (event.target as HTMLInputElement).value)
}

const updatePosition = (event: Event) => {
  emit('update:position', (event.target as HTMLInputElement).value)
}

const updateConfirmPassword = (value: string) => {
  emit('update:confirm-password', value)
}

const updateRememberMe = (event: Event) => {
  emit('update:rememberMe', (event.target as HTMLInputElement).checked)
}

const handleSubmit = () => {
  emit('submit', props.formData)
}

const handleToggleMode = () => {
  emit('toggle-mode')
}
</script>

<style scoped>
.login-card {
  width: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
  background: #fff;
  border-radius: 16px;
}

.logo-section {
  margin-bottom: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
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
  margin-bottom: 20px;
}

.login-form {
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
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
  margin-bottom: 16px;
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%);
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
  margin-top: 12px;
  padding: 10px 14px;
  background-color: #fef2f2;
  color: #dc2626;
  border-radius: 8px;
  border: 1px solid #fecaca;
  text-align: center;
  font-size: 14px;
}

.success-message {
  margin-top: 12px;
  padding: 10px 14px;
  background-color: #f0fdf4;
  color: #166534;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
  text-align: center;
  font-size: 14px;
}

.mode-toggle {
  margin-top: 16px;
  text-align: center;
}

.mode-toggle p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.toggle-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.toggle-btn:hover:not(:disabled) {
  color: #1d4ed8;
}

.toggle-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .login-card {
    padding: 40px 20px;
    max-width: none;
  }
}
</style>

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
      <div v-if="!isRegisterMode" class="dept-hint" role="note" aria-label="帳號提示">
        <strong>提醒：</strong> 本系成員可直接登入，無需註冊。
      </div>

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
            required
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
            required
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

        <div v-if="isRegisterMode" class="form-group rules-group">
          <label class="rules-checkbox">
            <input
              type="checkbox"
              :checked="formData.agreedRules"
              @change="updateAgreedRules"
              :disabled="isLoading"
              required
            />
            <span>
              我已閱讀瞭解並同意本系
              <a href="#" @click.prevent="openRules" class="rules-link">個人資料蒐集告知暨同意書</a>
              之內容。
            </span>
          </label>
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
      <!-- Rules Modal -->
      <div v-if="showRulesModal" class="modal-overlay" @click.self="closeRules">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="rules-title">
          <div class="modal-header">
            <h2 id="rules-title">臺北市立大學資訊科學系個人資料蒐集告知暨同意書</h2>
            <button type="button" class="close-btn" @click="closeRules" aria-label="關閉">✕</button>
          </div>
          <div class="modal-body">
            臺北市立大學資訊科學系(以下簡稱本系)，依個人資料保護法（以下簡稱個資法）第八條規定，告知下列事項，請您詳閱。
            <ol class="rules-list" style="list-style-type: cjk-ideographic">
              <li>
                <strong>蒐集個人資料之目的：</strong
                ><br />本系為執行資源利用與服務推廣相關業務所需，蒐集您的個人資料。
              </li>
              <li>
                <strong>蒐集個人資料之類別：</strong>
                <ol style="list-style-type: decimal; margin-top: 6px">
                  <li>
                    本系因執行業務蒐集您的個人資料包括中英文姓名、國民身分證統一編號、連絡電話、電子郵件地址、服務單位、借用教室紀錄等，詳如各項服務申請表。
                  </li>
                  <li>
                    本系及電子資源廠商將使用 cookies 進行各項網路資源服務之管理及記錄，包括蒐集 IP
                    位址、瀏覽網頁、使用檔案及時間等軌跡資料。
                  </li>
                </ol>
              </li>
              <li>
                <strong>個人資料利用之期間、地區、對象與方式：</strong>
                <ol style="list-style-type: decimal; margin-top: 6px">
                  <li>
                    本系於蒐集目的之存續期間或因執行業務所需保存期間內，得合理利用您的個人資料，利用地區不限。
                  </li>
                  <li>
                    本系利用您的個人資料於蒐集目的宣告之各項業務執行，包括因業務執行所必須之各項聯繫與通知。
                  </li>
                  <li>
                    本系利用各項網路資源服務使用紀錄，進行總體流量、使用行為研究及加值應用，以提昇網站服務品質，不針對個別使用者分析。
                  </li>
                </ol>
              </li>
              <li>
                <strong>個人資料之提供：</strong>
                <ol style="list-style-type: decimal; margin-top: 6px">
                  <li>
                    您可自由選擇是否提供相關個人資料，惟若拒絕提供個人資料，本系將無法提供相關服務。
                  </li>
                  <li>
                    請依各項服務需求提供您本人正確、最新及完整的個人資料，若您的個人資料有任何異動，請主動向本系申請更正。
                  </li>
                  <li>
                    若您提供錯誤、過時、不完整或具誤導性的資料，而損及您的相關權益，本系將不負相關賠償責任。
                  </li>
                </ol>
              </li>
              <li>
                <strong>個人資料之保密：</strong
                ><br />本系將善盡個人資料保護之責。如因天災、事變或其他不可抗力所致者，致您的個人資料被竊取、洩漏、竄改、遭其他侵害者，本系將於查明後以電話、電子郵件或網站公告等方法，擇適當方式通知您。
              </li>
              <li>
                <strong>當事人就個人資料得行使之權利：</strong
                ><br />您可依個資法第三條規定，就本系保有您的個人資料行使以下權利：
                <ol style="list-style-type: decimal; margin-top: 6px; padding-left: 2em">
                  <li>請求查詢或閱覽。</li>
                  <li>請求製給複製本。</li>
                  <li>請求補充或更正。</li>
                  <li>
                    請求停止蒐集、處理、利用或請求刪除，惟因本系執行業務所必須者，本系得不依請求為之。
                  </li>
                </ol>
                若您欲執行上述權利，或有任何建議指教，請與本系連繫。
                <br />
                電話：886-2-23113040 #8362、8363 ，電子郵件：<a href="mailto:cs@go.utaipei.edu.tw"
                  >cs@go.utaipei.edu.tw</a
                >。本系個人資料保護申訴窗口為資訊科學系系辦。
              </li>
              <li>
                <strong>同意書之效力：</strong>
                <ol style="list-style-type: decimal; margin-top: 6px">
                  <li>當您完成簽署時，即表示您已閱讀瞭解並同意本同意書的內容。</li>
                  <li>
                    本系保留隨時修改本同意書之權利，內容修改時將於本系網站公告。如您未於公告後一個月內提出異議或仍繼續使用本系相關服務，將視為您已同意並接受本系所更改之內容。
                  </li>
                </ol>
              </li>
            </ol>
          </div>
          <div class="modal-footer">
            <button type="button" class="secondary" @click="closeRules">關閉</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
  agreedRules: boolean
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
  'update:agreed-rules': [value: boolean]
  submit: [data: LoginFormData]
  'toggle-mode': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Modal state
const showRulesModal = ref(false)

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

const updateAgreedRules = (event: Event) => {
  emit('update:agreed-rules', (event.target as HTMLInputElement).checked)
}

const openRules = () => {
  showRulesModal.value = true
}

const closeRules = () => {
  showRulesModal.value = false
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

.dept-hint {
  background: linear-gradient(135deg, #eef6ff 0%, #e0f2fe 100%);
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.5;
  margin: -4px 0 18px;
  position: relative;
  box-shadow: 0 2px 4px rgba(30, 58, 138, 0.08);
}

.dept-hint strong {
  font-weight: 600;
}
.dept-hint .no-register {
  font-weight: 600;
  text-decoration: underline;
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

.rules-group {
  margin-top: 4px;
  margin-bottom: 12px;
}

.rules-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

.rules-checkbox input[type='checkbox'] {
  width: 16px;
  height: 16px;
  margin-top: 2px;
}

.rules-link {
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
}

.rules-link:hover {
  color: #1d4ed8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal {
  background: #fff;
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: scaleIn 0.18s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.94);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px 14px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  color: #6b7280;
  padding: 4px 6px;
  border-radius: 6px;
  transition:
    background 0.15s,
    color 0.15s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 18px 22px 4px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

.muted {
  color: #6b7280;
  font-size: 12px;
  margin-top: 0;
}

.rules-list {
  padding-left: 20px;
  margin: 12px 0 18px;
}
.rules-list li {
  margin-bottom: 8px;
}
.rules-list strong {
  color: #1f2937;
}

.modal-footer {
  padding: 12px 22px 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-footer button {
  padding: 8px 18px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.modal-footer button:hover {
  background: #f3f4f6;
}

.modal-footer button.secondary {
  font-weight: 500;
}

@media (max-width: 768px) {
  .login-card {
    padding: 40px 20px;
    max-width: none;
  }
}
</style>

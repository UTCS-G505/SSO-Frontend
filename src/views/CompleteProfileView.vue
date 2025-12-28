<template>
  <div class="complete-profile-shell">
    <AppHeader />

    <main class="complete-section">
      <h2 class="section-title">完成基本資料</h2>
      <div class="card">
        <p class="intro">請完成以下基本資料，以啟用您的帳號。</p>
        <form class="form" @submit.prevent="submit">
          <div class="row">
            <div class="field full">
              <label for="name">姓名</label>
              <input id="name" v-model.trim="form.name" type="text" required />
            </div>
          </div>

          <div class="row">
            <div class="field">
              <label for="primaryEmail">主要 Email</label>
              <input id="primaryEmail" v-model.trim="form.primary_email" type="email" required />
            </div>
            <div class="field">
              <label for="secondaryEmail">次要 Email（選填）</label>
              <input id="secondaryEmail" v-model.trim="form.secondary_email" type="email" />
            </div>
          </div>

          <div class="row">
            <div class="field">
              <label for="phone">電話</label>
              <input id="phone" v-model.trim="form.phone_number" type="tel" required />
            </div>
            <div class="field">
              <label for="position">職稱 / 身分</label>
              <input
                id="position"
                v-model.trim="form.position"
                type="text"
                required
                placeholder="請輸入職稱或身分（學生請填年級，如：大一、碩一、職碩一）"
              />
            </div>
          </div>

          <div class="row">
            <div class="field full">
              <label for="privacyAgreedAt">隱私權聲明簽署時間</label>
              <input
                id="privacyAgreedAt"
                :value="
                  userStore.privacy_agreed_at
                    ? new Date(userStore.privacy_agreed_at).toLocaleString('zh-TW', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })
                    : '未同意'
                "
                type="text"
                disabled
                class="disabled-field"
              />
            </div>
          </div>

          <p v-if="errorText" class="error">{{ errorText }}</p>

          <div class="actions">
            <button class="primary" type="submit" :disabled="loading">
              {{ loading ? '儲存中…' : '儲存並啟用' }}
            </button>
          </div>
        </form>
      </div>
    </main>

    <!-- Privacy Policy Modal -->
    <div v-if="showPrivacyModal" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">臺北市立大學資訊科學系個人資料保護暨隱私權聲明</h3>
        </div>
        <div class="modal-body">
          <div class="privacy-content">
            <p>
              臺北市立大學資訊科學系（以下簡稱本系），依個人資料保護法（以下簡稱個資法）第八條規定，告知下列事項，請您詳閱。
            </p>
            <strong>一、 蒐集個人資料之目的</strong>
            <p class="tab">本系為執行資源利用與服務推廣相關業務所需，蒐集您的個人資料。</p>
            <strong>二、 蒐集個人資料之類別</strong>
            <ol>
              <li>
                本系因執行業務蒐集您的個人資料，包括中（英）文姓名、學號（或國民身分證統一編號）、聯絡電話、電子郵件地址、服務單位、使用系統之操作及申請紀錄等本系統及各子系統所需之資料。
              </li>
              <li>
                本系及電子資源廠商將使用 cookies 進行各項網路資源服務之管理及記錄，包括蒐集 IP
                位址、瀏覽網頁、使用檔案及時間等軌跡資料。
              </li>
            </ol>
            <strong>三、 個人資料利用之期間、地區、對象與方式</strong>
            <ol>
              <li>
                本系於蒐集目的之存續期間或因執行業務所需保存期間內，得合理利用您的個人資料。除蒐集之目的涉及國際業務或活動外，本系僅於中華民國領域內利用您的個人資料。
              </li>
              <li>
                本系利用您的個人資料於蒐集目的宣告之各項業務執行，包括但不限於因業務執行所必須之各項聯繫與通知。
              </li>
              <li>
                本系利用各項網路資源服務使用紀錄，進行總體流量、使用行為研究及加值應用，以提昇網站服務品質，不針對個別使用者分析。
              </li>
            </ol>
            <strong>四、 個人資料之提供</strong>
            <ol>
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
            <strong>五、個人資料之保密</strong>
            <p class="tab">
              本系將善盡個人資料保護之責。如因天災、事變或其他不可抗力所致者，致您的個人資料被竊取、洩漏、竄改、遭其他侵害者，本系將於查明後以電話、電子郵件或網站公告等方法，擇適當方式通知您。
            </p>
            <strong>六、當事人就個人資料得行使之權利</strong>
            <p class="tab">您可依個資法第三條規定，就本系保有您的個人資料行使以下權利：</p>
            <ol>
              <li>請求查詢或閱覽。</li>
              <li>請求製給複製本。</li>
              <li>請求補充或更正。</li>
              <li>
                請求停止蒐集、處理、利用或請求刪除，惟因本系執行業務所必須者，本系得不依請求為之。
              </li>
            </ol>
            <p class="tab">
              若您欲執行上述權利，或有任何建議指教，請與本系連繫。本系個人資料保護申訴窗口為本系辦公室。
            </p>
            <strong>七、 聲明之效力</strong>
            <p class="tab">當您完成簽署時，即表示您已詳閱、瞭解並同意本聲明的內容。</p>
            <p class="tab">
              本系保留隨時修改本聲明之權利，內容修改時將於本系網站公告。如您未於公告後一個月內提出異議或仍繼續使用本系相關服務，將視為您已同意並接受本系所更改之內容。
            </p>
          </div>
          <div class="agreement-info">
            <p>
              聲明更新時間：2025/11/01<br />
              本系辦公室電話：<a href="tel:+886-2-23113040">02-2311-3040</a> #8362、8363<br />
              本系辦公室電子郵件：<a href="mailto:cs@go.utaipei.edu.tw">cs@go.utaipei.edu.tw</a>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="disagreeAndLogout" class="disagree-btn" :disabled="agreeing">
            不同意並返回登入
          </button>
          <button @click="agreeToPrivacy" class="agree-btn" :disabled="agreeing">
            {{ agreeing ? '處理中...' : '我同意' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import AppHeader from '@/components/common/Header.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const authStore = useAuthStore()
const { success, error } = useToast()

const loading = ref(false)
const errorText = ref('')
const showPrivacyModal = ref(false)
const agreeing = ref(false)

const form = reactive({
  name: userStore.name || '',
  primary_email: userStore.primary_email || '',
  secondary_email: userStore.secondary_email || '',
  phone_number: userStore.phone_number || '',
  position: userStore.position || '',
})

const validate = () => {
  if (!form.name || !form.primary_email || !form.phone_number || !form.position) {
    errorText.value = '請填寫所有必填欄位'
    return false
  }
  errorText.value = ''
  return true
}

const agreeToPrivacy = async () => {
  agreeing.value = true
  try {
    const privacy_agreed_at = new Date().toLocaleString('sv-SE')
    await userStore.updateProfile({
      privacy_agreed_at: privacy_agreed_at,
    })
    showPrivacyModal.value = false
    success('已成功簽署隱私權聲明', '感謝您的同意')
  } catch {
    error('簽署失敗', '請稍後再試')
  } finally {
    agreeing.value = false
  }
}

const disagreeAndLogout = async () => {
  showPrivacyModal.value = false
  await authStore.logout()
  router.push({ name: 'login' })
}

const submit = async () => {
  if (!validate()) return

  loading.value = true
  try {
    await userStore.updateProfile({
      id: userStore.id!,
      name: form.name,
      primary_email: form.primary_email,
      secondary_email: form.secondary_email,
      phone_number: form.phone_number,
      position: form.position,
    })

    success('基本資料已填寫完成，等待審核完成後，將會收到啟用通知信')

    const redirectUrl = route.query.redirect
    if (typeof redirectUrl === 'string' && redirectUrl.length > 0) {
      window.location.href = redirectUrl
    } else {
      router.push({ name: 'dashboard' })
    }
  } catch {
    error('儲存失敗', '請稍後再試')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.initializeAuth()
  }
  if (!userStore.name) {
    try {
      await userStore.getProfile()
      form.name = userStore.name || ''
      form.primary_email = userStore.primary_email || ''
      form.secondary_email = userStore.secondary_email || ''
      form.phone_number = userStore.phone_number || ''
      form.position = userStore.position || ''
    } catch {
      // ignore
    }
  }

  // 若已啟用且同意聲明則不應停留在此頁
  if (userStore.enabled !== false && userStore.privacy_agreed_at) {
    router.replace({ name: 'dashboard' })
  }

  // Check if user has agreed to privacy policy
  if (!userStore.privacy_agreed_at) {
    showPrivacyModal.value = true
  }
})
</script>

<style scoped>
.complete-profile-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.complete-section {
  flex: 1;
  padding: 2rem 2.25rem 3rem;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
}
.section-title {
  margin: 0 0 1.25rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
}
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
}
.intro {
  margin: 0 0 1rem;
  color: #475569;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field.full {
  grid-column: 1 / -1;
}
label {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}
input {
  padding: 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
}
.disabled-field {
  background: #f1f5f9 !important;
  color: #475569 !important;
  border-color: #cbd5e1 !important;
  cursor: not-allowed;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
}
.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #dc2626;
  font-size: 0.8rem;
}
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}
.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}
.privacy-content {
  color: #374151;
  line-height: 1.7;
}
.privacy-content p {
  margin: 8px 0;
  line-height: 1.7;
}
.privacy-content p.tab {
  padding-left: 2em;
  margin: 6px 0;
}
.privacy-content strong {
  display: block;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1f2937;
}
.privacy-content ol {
  padding-left: 2.5em;
  margin: 8px 0 12px;
}
.privacy-content ol li {
  margin-bottom: 6px;
  line-height: 1.7;
}
.agreement-info {
  color: gray;
  margin-top: 20px;
  border-left: 2px solid lightgray;
  padding-left: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.6;
}
.agreement-info a {
  color: gray;
  text-decoration: underline;
  transition: color 0.15s ease;
}
.agreement-info a:hover {
  color: #374151;
}
.modal-footer {
  padding: 1rem 2rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
.disagree-btn {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.disagree-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}
.disagree-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.agree-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.agree-btn:hover:not(:disabled) {
  background: #2563eb;
}
.agree-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
@media (max-width: 640px) {
  .complete-section {
    padding: 1.25rem 1rem 2rem;
  }
  .row {
    grid-template-columns: 1fr;
  }
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.25rem 1.5rem;
  }
  .modal-title {
    font-size: 1.125rem;
  }
  .privacy-content {
    font-size: 0.9rem;
  }
  .modal-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
  .disagree-btn,
  .agree-btn {
    width: 100%;
    padding: 0.875rem;
  }
}
</style>

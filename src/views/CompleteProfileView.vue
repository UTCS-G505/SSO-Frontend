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

          <p v-if="errorText" class="error">{{ errorText }}</p>

          <div class="actions">
            <button class="primary" type="submit" :disabled="loading">
              {{ loading ? '儲存中…' : '儲存並啟用' }}
            </button>
          </div>
        </form>
      </div>
    </main>
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

  // 若已啟用則不應停留在此頁
  if (userStore.enabled !== false) {
    router.replace({ name: 'dashboard' })
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
@media (max-width: 640px) {
  .complete-section {
    padding: 1.25rem 1rem 2rem;
  }
  .row {
    grid-template-columns: 1fr;
  }
}
</style>

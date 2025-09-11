<template>
  <div class="profile-shell">
    <!-- App Header -->
    <AppHeader />

    <!-- Profile Section -->
    <main class="profile-section">
      <h2 class="section-title">個人資料</h2>
      <div class="profile-content">
        <!-- Profile Form -->
        <div class="profile-form-card">
          <div class="card-header">
            <h3 class="with-icon"><UserIcon class="header-icon" /> 個人資訊</h3>
            <button class="edit-btn" :class="{ 'save-btn': isEditing }" @click="toggleEdit">
              <Edit v-if="!isEditing" class="edit-icon" />
              <Save v-else class="save-icon" />
              {{ isEditing ? '儲存變更' : '編輯資料' }}
            </button>
          </div>
          <form @submit.prevent="saveProfile" class="profile-form">
            <div class="form-row">
              <div class="form-group full-width">
                <label for="name" class="icon-label"
                  ><UserIcon class="field-icon" /> <span>姓名</span></label
                >
                <input
                  id="name"
                  v-model="userProfile.name"
                  type="text"
                  :disabled="!isEditing"
                  :class="{ editable: isEditing }"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="primaryEmail" class="icon-label"
                  ><Mail class="field-icon" /> <span>主要 Email</span></label
                >
                <input
                  id="primaryEmail"
                  v-model="userProfile.primary_email"
                  type="email"
                  :disabled="!isEditing"
                  :class="{ editable: isEditing }"
                />
              </div>
              <div class="form-group">
                <label for="secondaryEmail" class="icon-label"
                  ><MailPlus class="field-icon" /> <span>次要 Email</span></label
                >
                <input
                  id="secondaryEmail"
                  v-model="userProfile.secondary_email"
                  type="email"
                  :disabled="!isEditing"
                  :class="{ editable: isEditing }"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone" class="icon-label"
                  ><Phone class="field-icon" /> <span>電話</span></label
                >
                <input
                  id="phone"
                  v-model="userProfile.phone_number"
                  type="tel"
                  :disabled="!isEditing"
                  :class="{ editable: isEditing }"
                />
              </div>
              <div class="form-group">
                <label for="position" class="icon-label"
                  ><Briefcase class="field-icon" /> <span>職稱 / 身分</span></label
                >
                <input
                  id="position"
                  v-model="userProfile.position"
                  type="text"
                  :disabled="!isEditing"
                  :class="{ editable: isEditing }"
                />
              </div>
              <div class="form-group">
                <label for="role" class="icon-label"
                  ><Users class="field-icon" /> <span>角色</span></label
                >
                <input
                  id="role"
                  :value="userProfile.role !== null ? getRoleName(userProfile.role) : ''"
                  type="text"
                  disabled
                  class="role-display"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { getRoleName } from '@/types/userRoles'
import {
  Edit,
  Save,
  User as UserIcon,
  Mail,
  MailPlus,
  Phone,
  Briefcase,
  Users,
} from 'lucide-vue-next'
import AppHeader from '@/components/common/Header.vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const { success, error } = useToast()
const isEditing = ref(false)

// Draft form state separate from committed store state
const userProfile = ref({
  name: userStore.name,
  primary_email: userStore.primary_email,
  secondary_email: userStore.secondary_email,
  phone_number: userStore.phone_number,
  position: userStore.position,
  role: userStore.role,
})

const toggleEdit = async () => {
  if (isEditing.value) {
    await saveProfile()
  } else {
    userProfile.value = {
      name: userStore.name,
      primary_email: userStore.primary_email,
      secondary_email: userStore.secondary_email,
      phone_number: userStore.phone_number,
      position: userStore.position,
      role: userStore.role,
    }
    isEditing.value = true
  }
}

const saveProfile = async () => {
  try {
    const payload = { ...userProfile.value }
    await userStore.updateProfile(payload)

    isEditing.value = false
    success('個人資料已更新', '您的個人資料已成功更新')
  } catch {
    error('更新失敗', '無法更新個人資料，請稍後再試')
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.initializeAuth()
  }
  if (!userStore.name) {
    await userStore.getProfile()
  }

  userProfile.value = {
    name: userStore.name,
    primary_email: userStore.primary_email,
    secondary_email: userStore.secondary_email,
    phone_number: userStore.phone_number,
    position: userStore.position,
    role: userStore.role,
  }
})
</script>

<style scoped>
/* Shell */
.profile-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Profile Section */
.profile-section {
  flex: 1;
  padding: 2rem 2.25rem 3rem;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}

.section-title {
  margin: 0 0 1.75rem;
  font-size: 1.375rem;
  font-weight: 600;
  color: #1e293b;
}

/* Content Wrapper */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
/* Cards */
.profile-header-card,
.profile-form-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.secondary-btn {
  padding: 0.55rem 1.1rem;
  background: #f1f5f9;
  border: 1px solid #d8dee6;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition:
    background 0.18s,
    color 0.18s,
    box-shadow 0.18s;
}
.secondary-btn:hover {
  background: #e2e8f0;
}

.submit-col {
  display: flex;
  align-items: flex-end;
}
.invisible-label {
  visibility: hidden;
  height: 0;
  margin: 0;
  padding: 0;
}

.error-text {
  color: #dc2626;
  font-size: 0.7rem;
  margin: 0.25rem 0 0;
}
.form-group input.error {
  border-color: #dc2626;
}

/* Fade & height transition */
.fade-height-enter-active,
.fade-height-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.fade-height-enter-from,
.fade-height-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.profile-header-card {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile-avatar-large {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 2rem;
}

.change-avatar-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.change-avatar-btn:hover {
  background: #e2e8f0;
}

.camera-icon {
  width: 16px;
  height: 16px;
}

.profile-basic-info {
  flex: 1;
}

.profile-basic-info h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.profile-email {
  margin: 0 0 1rem;
  color: #64748b;
  font-size: 1rem;
}

.profile-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.last-login {
  color: #64748b;
  font-size: 0.875rem;
}

/* Profile Form Styles */
/* Already consolidated into card above */

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.with-icon {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}
.header-icon {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}
.icon-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
  color: #374151;
}
.field-icon {
  width: 14px;
  height: 14px;
  color: #64748b;
}

.edit-btn,
.save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.edit-btn:hover,
.save-btn:hover {
  background: #2563eb;
}

.edit-icon,
.save-icon {
  width: 16px;
  height: 16px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-group input.editable,
.form-group select.editable,
.form-group textarea.editable {
  background: white;
  border-color: #3b82f6;
  color: #1f2937;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.role-display {
  background: #f1f5f9 !important;
  color: #475569 !important;
  border-color: #cbd5e1 !important;
  font-weight: 500;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 900px) {
  .profile-header-card {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .profile-section {
    padding: 1.25rem 1.25rem 2rem;
  }
  .section-title {
    margin-bottom: 1.25rem;
  }
  .profile-header-card {
    padding: 1.5rem;
  }
  .profile-form-card {
    padding: 1.25rem 1rem 1.5rem;
    border-radius: 10px;
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }
  .secondary-btn {
    width: 100%;
    justify-content: center;
  }
  .profile-form-card .card-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .profile-form-card .edit-btn,
  .profile-form-card .save-btn {
    width: auto;
    justify-content: center;
    padding: 0.55rem 0.9rem;
    font-size: 0.7rem;
  }
  .profile-form {
    gap: 1.25rem;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 1.1rem;
  }
  .submit-col {
    align-items: stretch;
  }
  .form-group label {
    font-size: 0.75rem;
  }
  .form-group input {
    font-size: 0.8rem;
  }
  .secondary-btn {
    font-size: 0.7rem;
  }
  .edit-btn,
  .save-btn {
    font-size: 0.75rem;
    padding: 0.65rem 1rem;
  }
  .profile-form-card h3 {
    font-size: 1rem;
  }
  .section-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 420px) {
  .profile-section {
    padding: 1rem 0.85rem 1.5rem;
  }
  .profile-form-card {
    padding: 1rem 0.85rem 1.25rem;
  }
  .edit-btn,
  .save-btn,
  .secondary-btn {
    font-size: 0.7rem;
  }
  .form-group input {
    padding: 0.6rem 0.65rem;
  }
}
</style>

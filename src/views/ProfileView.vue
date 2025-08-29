<template>
  <div class="profile-shell">
    <!-- Brand / Top Bar -->
    <header class="brand-bar">
      <div class="brand-left">
        <img src="/src/assets/logo.png" alt="University SSO" class="brand-logo" />
        <span class="brand-name">University SSO</span>
      </div>
      <!-- Use committed store values, not the draft form -->
      <UserMenu
        :user-initials="committedInitials"
        :display-name="committedName"
        :user-role="committedRole"
      />
    </header>

    <!-- Profile Section -->
    <main class="profile-section">
      <h2 class="section-title">Profile</h2>
      <div class="profile-content">
        <!-- Profile Form -->
        <div class="profile-form-card">
          <div class="card-header">
            <h3 class="with-icon"><UserIcon class="header-icon" /> Personal Information</h3>
            <button class="edit-btn" :class="{ 'save-btn': isEditing }" @click="toggleEdit">
              <Edit v-if="!isEditing" class="edit-icon" />
              <Save v-else class="save-icon" />
              {{ isEditing ? 'Save Changes' : 'Edit Profile' }}
            </button>
          </div>
          <form @submit.prevent="saveProfile" class="profile-form">
            <div class="form-row">
              <div class="form-group full-width">
                <label for="name" class="icon-label"
                  ><UserIcon class="field-icon" /> <span>Full Name</span></label
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
                  ><Mail class="field-icon" /> <span>Primary Email</span></label
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
                  ><MailPlus class="field-icon" /> <span>Secondary Email</span></label
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
                  ><Phone class="field-icon" /> <span>Phone Number</span></label
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
                  ><Briefcase class="field-icon" /> <span>Position</span></label
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
                  ><Users class="field-icon" /> <span>Role</span></label
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

        <!-- Security / Change Password -->
        <div class="security-form-card">
          <div class="card-header security-header">
            <div class="security-title-wrap">
              <h3 class="with-icon"><Shield class="header-icon" /> Security</h3>
              <p class="muted">Update your password regularly to keep your account secure.</p>
            </div>
            <button class="secondary-btn" type="button" @click="togglePasswordSection">
              {{ showPasswordForm ? 'Cancel' : 'Change Password' }}
            </button>
          </div>
          <transition name="fade-height">
            <form
              v-if="showPasswordForm"
              class="password-form"
              @submit.prevent="submitPasswordChange"
            >
              <div class="form-row">
                <div class="form-group">
                  <label for="currentPassword" class="icon-label"
                    ><Lock class="field-icon" /> <span>Current Password</span></label
                  >
                  <input
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    type="password"
                    autocomplete="current-password"
                    :class="{ editable: true }"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="newPassword" class="icon-label"
                    ><KeyRound class="field-icon" /> <span>New Password</span></label
                  >
                  <input
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    type="password"
                    autocomplete="new-password"
                    @input="evaluateStrength"
                    :class="{ editable: true }"
                    required
                  />
                  <div class="password-strength">
                    <div class="strength-bar" :data-level="passwordStrength.level"></div>
                    <span class="strength-label">{{ passwordStrength.label }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="confirmPassword" class="icon-label"
                    ><KeyRound class="field-icon" /> <span>Confirm New Password</span></label
                  >
                  <input
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    autocomplete="new-password"
                    :class="{ editable: true, error: passwordMismatch }"
                    required
                  />
                  <p v-if="passwordMismatch" class="error-text">Passwords do not match.</p>
                </div>
                <div class="form-group submit-col">
                  <label class="invisible-label">Submit</label>
                  <button
                    class="change-pass-btn"
                    type="submit"
                    :disabled="passwordMismatch || !passwordStrength.valid"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          </transition>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { getRoleName } from '@/types/userRoles'
import {
  Edit,
  Save,
  User as UserIcon,
  Mail,
  MailPlus,
  Phone,
  Briefcase,
  Shield,
  Lock,
  KeyRound,
  Users,
} from 'lucide-vue-next'
import UserMenu from '@/components/common/UserMenu.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
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

// Committed values from the store for display components
const committedName = computed(() => userStore.name || '')
const committedRole = computed(() =>
  userStore.role !== null ? getRoleName(userStore.role) : 'User',
)
const committedInitials = computed(() => {
  if (userStore.name) {
    const parts = userStore.name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return (authStore.id && authStore.id[0].toUpperCase()) || 'U'
})

// Password change form state
const showPasswordForm = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordStrength = ref({ level: 0, label: 'Weak', valid: false })
const passwordMismatch = computed(
  () =>
    passwordForm.value.newPassword !== passwordForm.value.confirmPassword &&
    passwordForm.value.confirmPassword.length > 0,
)

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
    alert('Profile updated successfully!')
  } catch (err) {
    console.error('Failed to update profile:', err)
    alert('Failed to update profile. Please try again.')
  }
}

const togglePasswordSection = () => {
  showPasswordForm.value = !showPasswordForm.value
  if (!showPasswordForm.value) {
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    passwordStrength.value = { level: 0, label: 'Weak', valid: false }
  }
}

const evaluateStrength = () => {
  const pwd = passwordForm.value.newPassword
  let level = 0
  if (pwd.length >= 8) level++
  if (/[A-Z]/.test(pwd)) level++
  if (/[a-z]/.test(pwd)) level++
  if (/\d/.test(pwd)) level++
  if (/[^A-Za-z0-9]/.test(pwd)) level++
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent']
  passwordStrength.value = {
    level,
    label: labels[level] || 'Very Weak',
    valid: level >= 3,
  }
}

const submitPasswordChange = () => {
  if (passwordMismatch.value || !passwordStrength.value.valid) return
  // Placeholder for API call
  console.log('Password change request:', passwordForm.value)
  alert('Password updated (demo).')
  togglePasswordSection()
}
</script>

<style scoped>
/* Shell */
.profile-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6f8;
}

.brand-bar {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.75rem;
  position: sticky;
  top: 0;
  z-index: 30;
}

.brand-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #1e293b;
}

.brand-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
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
.profile-form-card,
.security-card,
.session-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.security-form-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.75rem 2rem 2.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.security-form-card:before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 55%);
  pointer-events: none;
}

.security-header {
  align-items: flex-start;
}
.security-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.security-title-wrap .muted {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 600;
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

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.75rem;
}
.password-form .form-row {
  grid-template-columns: 1fr 1fr;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
}
.strength-bar {
  flex: 1;
  height: 6px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #f87171 0%,
    #fb923c 25%,
    #facc15 50%,
    #4ade80 75%,
    #22c55e 100%
  );
  filter: grayscale(0.4) brightness(0.85);
  position: relative;
  overflow: hidden;
}
.strength-bar:after {
  content: '';
  position: absolute;
  inset: 0;
  background: #fff;
  mix-blend-mode: overlay;
  opacity: 0.2;
}
.strength-bar[data-level='0'] {
  clip-path: inset(0 100% 0 0);
}
.strength-bar[data-level='1'] {
  clip-path: inset(0 80% 0 0);
}
.strength-bar[data-level='2'] {
  clip-path: inset(0 60% 0 0);
}
.strength-bar[data-level='3'] {
  clip-path: inset(0 40% 0 0);
}
.strength-bar[data-level='4'] {
  clip-path: inset(0 20% 0 0);
}
.strength-bar[data-level='5'] {
  clip-path: inset(0 0 0 0);
}
.strength-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.change-pass-btn {
  width: 100%;
  padding: 0.9rem 1.2rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  font-size: 0.8rem;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  cursor: pointer;
  transition:
    transform 0.18s,
    box-shadow 0.18s,
    background 0.18s;
}
.change-pass-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
}
.change-pass-btn:disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
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

/* Removed security & session sections */

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
  .profile-form-card,
  .security-form-card {
    padding: 1.25rem 1rem 1.5rem;
    border-radius: 10px;
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }
  /* Keep security toggle full width, but restore edit/save to top-right layout */
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
  .password-form .form-row {
    grid-template-columns: 1fr;
  }
  .submit-col {
    align-items: stretch;
  }
  .change-pass-btn {
    margin-top: 0.25rem;
  }
  .form-group label {
    font-size: 0.75rem;
  }
  .form-group input {
    font-size: 0.8rem;
  }
  .strength-label {
    font-size: 0.55rem;
  }
  .secondary-btn {
    font-size: 0.7rem;
  }
  .edit-btn,
  .save-btn {
    font-size: 0.75rem;
    padding: 0.65rem 1rem;
  }
  .profile-form-card h3,
  .security-form-card h3 {
    font-size: 1rem;
  }
  .section-title {
    font-size: 1.1rem;
  }
  .brand-bar {
    padding: 0 1rem;
  }
}

@media (max-width: 420px) {
  .profile-section {
    padding: 1rem 0.85rem 1.5rem;
  }
  .profile-form-card,
  .security-form-card {
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
  .change-pass-btn {
    padding: 0.75rem 1rem;
    font-size: 0.7rem;
  }
}
</style>

<template>
  <div class="profile-container">
    <!-- Sidebar Navigation -->
    <NavigationSidebar />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-title">
          <h1>User Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>
        <UserMenu
          :user-initials="userInitials"
          :display-name="user?.username"
          user-role="User"
        />
      </header>

      <!-- Profile Content -->
      <main class="profile-main">
        <div class="profile-content">
          <!-- Profile Header Card -->
          <div class="profile-header-card">
            <div class="profile-avatar-section">
              <div class="profile-avatar-large">{{ userInitials }}</div>
              <button class="change-avatar-btn" @click="changeAvatar">
                <Camera class="camera-icon" />
                Change Photo
              </button>
            </div>
            <div class="profile-basic-info">
              <h2>{{ user?.username }}</h2>
              <p class="profile-email">{{ userProfile.email }}</p>
              <div class="profile-status">
                <span class="status-badge active">Active</span>
                <span class="last-login">Last login: {{ formatDate(user?.loginTime) }}</span>
              </div>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="profile-form-card">
            <div class="card-header">
              <h3>Personal Information</h3>
              <button
                class="edit-btn"
                :class="{ 'save-btn': isEditing }"
                @click="toggleEdit"
              >
                <Edit v-if="!isEditing" class="edit-icon" />
                <Save v-else class="save-icon" />
                {{ isEditing ? 'Save Changes' : 'Edit Profile' }}
              </button>
            </div>
            <form @submit.prevent="saveProfile" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input
                    id="firstName"
                    v-model="userProfile.firstName"
                    type="text"
                    :disabled="!isEditing"
                    :class="{ 'editable': isEditing }"
                  />
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input
                    id="lastName"
                    v-model="userProfile.lastName"
                    type="text"
                    :disabled="!isEditing"
                    :class="{ 'editable': isEditing }"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email">Email Address</label>
                  <input
                    id="email"
                    v-model="userProfile.email"
                    type="email"
                    :disabled="!isEditing"
                    :class="{ 'editable': isEditing }"
                  />
                </div>
                <div class="form-group">
                  <label for="phone">Phone Number</label>
                  <input
                    id="phone"
                    v-model="userProfile.phone"
                    type="tel"
                    :disabled="!isEditing"
                    :class="{ 'editable': isEditing }"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="department">Department</label>
                  <select
                    id="department"
                    v-model="userProfile.department"
                    :disabled="!isEditing"
                    :class="{ 'editable': isEditing }"
                  >
                    <option value="">Select Department</option>
                    <option value="engineering">Engineering</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="hr">Human Resources</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="jobTitle">Job Title</label>
                  <input
                    id="jobTitle"
                    v-model="userProfile.jobTitle"
                    type="text"
                    :disabled="!isEditing"
                    :class="{ 'editable': isEditing }"
                  />
                </div>
              </div>

              <div class="form-group full-width">
                <label for="bio">Bio</label>
                <textarea
                  id="bio"
                  v-model="userProfile.bio"
                  rows="4"
                  :disabled="!isEditing"
                  :class="{ 'editable': isEditing }"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
            </form>
          </div>

          <!-- Account Security Card -->
          <div class="security-card">
            <div class="card-header">
              <h3>Account Security</h3>
            </div>
            <div class="security-content">
              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">Password</div>
                  <div class="security-description">Last changed 30 days ago</div>
                </div>
                <button class="security-btn" @click="changePassword">Change Password</button>
              </div>
              <div class="security-divider"></div>
              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">Two-Factor Authentication</div>
                  <div class="security-description">Add an extra layer of security</div>
                </div>
                <button class="security-btn secondary" @click="setup2FA">Setup 2FA</button>
              </div>
            </div>
          </div>

          <!-- Session Information Card -->
          <div class="session-card">
            <div class="card-header">
              <h3>Session Information</h3>
            </div>
            <div class="session-content">
              <div class="session-item">
                <span class="session-label">Session ID:</span>
                <span class="session-value">{{ user?.sessionId }}</span>
              </div>
              <div class="session-item">
                <span class="session-label">Login Time:</span>
                <span class="session-value">{{ formatDate(user?.loginTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  Camera,
  Edit,
  Save
} from 'lucide-vue-next'
import NavigationSidebar from '@/components/navigation/Sidebar.vue'
import UserMenu from '@/components/common/UserMenu.vue'

const authStore = useAuthStore()
const isEditing = ref(false)

// User data from auth store
const user = computed(() => authStore.user)

// Extended user profile data (in a real app, this would come from an API)
const userProfile = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  department: 'engineering',
  jobTitle: 'Senior Software Engineer',
  bio: 'Passionate software engineer with 5+ years of experience in full-stack development. Love working with modern web technologies and building scalable applications.'
})

// Computed properties
const userInitials = computed(() => {
  if (userProfile.value.firstName && userProfile.value.lastName) {
    return (userProfile.value.firstName[0] + userProfile.value.lastName[0]).toUpperCase()
  }
  return user.value?.username?.[0]?.toUpperCase() || 'U'
})

// Methods
const toggleEdit = () => {
  if (isEditing.value) {
    saveProfile()
  } else {
    isEditing.value = true
  }
}

const saveProfile = () => {
  // In a real app, this would make an API call to save the profile
  console.log('Saving profile:', userProfile.value)

  // Simulate saving
  setTimeout(() => {
    isEditing.value = false
    // Show success message (could use a toast notification)
    alert('Profile updated successfully!')
  }, 500)
}

const changeAvatar = () => {
  // In a real app, this would open a file picker for avatar upload
  console.log('Change avatar clicked')
  alert('Avatar change functionality would be implemented here')
}

const changePassword = () => {
  // In a real app, this would open a password change modal
  console.log('Change password clicked')
  alert('Password change functionality would be implemented here')
}

const setup2FA = () => {
  // In a real app, this would open 2FA setup flow
  console.log('Setup 2FA clicked')
  alert('2FA setup functionality would be implemented here')
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

// Close dropdown when clicking outside
onMounted(() => {
  // Event listener is now handled by UserMenu component
})
</script>

<style scoped>
.profile-container {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.top-header {
  background: #f0f2f5;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-title h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.header-title p {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.875rem;
}

/* Profile Content Styles */
.profile-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.profile-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-header-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
.profile-form-card,
.security-card,
.session-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

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

/* Security Card Styles */
.security-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.security-info {
  flex: 1;
}

.security-title {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.security-description {
  color: #64748b;
  font-size: 0.875rem;
}

.security-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #3b82f6;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.security-btn:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.security-btn.secondary {
  background: white;
  color: #3b82f6;
}

.security-btn.secondary:hover {
  background: #f0f9ff;
}

.security-divider {
  height: 1px;
  background: #e2e8f0;
}

/* Session Card Styles */
.session-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.session-label {
  font-weight: 500;
  color: #374151;
}

.session-value {
  color: #64748b;
  font-family: monospace;
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    margin-left: 200px;
  }

  .profile-header-card {
    flex-direction: column;
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .top-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .main-content {
    margin-left: 60px;
  }

  .profile-main {
    padding: 1rem;
  }
}
</style>

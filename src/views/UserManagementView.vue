<template>
  <div class="user-management-shell">
    <!-- App Header -->
    <AppHeader />

    <!-- User Management Section -->
    <main class="user-management-section">
      <div class="page-header">
        <h2 class="section-title">用戶管理</h2>
        <p class="section-subtitle">管理系統中的所有用戶帳號</p>
      </div>

      <!-- Search and Filter Bar -->
      <div class="search-filters">
        <div class="search-box">
          <Search class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索用戶 (姓名、學號、Email)"
            class="search-input"
          />
        </div>
        <div class="filters">
          <select v-model="selectedRole" class="role-filter">
            <option value="">所有角色</option>
            <option v-for="(name, role) in ROLE_NAMES" :key="role" :value="role">
              {{ name }}
            </option>
          </select>
          <button @click="openCreateModal" class="create-btn">
            <UserPlus class="create-icon" />
            <span class="btn-text">新增用戶</span>
          </button>
          <button
            @click="openBulkDeleteModal"
            class="bulk-delete-btn"
            :disabled="selectedCount === 0 || deletingSelected"
            title="刪除所選"
          >
            <Trash2 class="create-icon" />
            <span class="btn-text"
              >刪除所選<span v-if="selectedCount"> ({{ selectedCount }})</span></span
            >
          </button>
          <button @click="refreshUsers" class="refresh-btn" :disabled="loading">
            <RefreshCw class="refresh-icon" :class="{ 'animate-spin': loading }" />
            <span class="btn-text">刷新</span>
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="users-table-container">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>載入用戶資料中...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <AlertCircle class="error-icon" />
          <p>{{ error }}</p>
          <button @click="refreshUsers" class="retry-btn">重試</button>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="empty-state">
          <Users class="empty-icon" />
          <p v-if="searchQuery || selectedRole">沒有找到符合條件的用戶</p>
          <p v-else>暫無用戶資料</p>
        </div>

        <div v-else class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr>
                <th class="select-col">
                  <input
                    type="checkbox"
                    ref="headerCheckbox"
                    :checked="allSelectableOnPageSelected"
                    @change="toggleSelectAllOnPage"
                    :disabled="paginatedSelectableCount === 0"
                  />
                </th>
                <th>用戶ID</th>
                <th>姓名</th>
                <th>主要Email</th>
                <th>角色</th>
                <th>狀態</th>
                <th>職位</th>
                <th>電話</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.account" class="user-row">
                <td class="select-cell">
                  <input
                    type="checkbox"
                    :checked="selectedUserIds.has(user.account)"
                    @change="toggleUserSelection(user)"
                    :disabled="!canModify(user)"
                    :title="!canModify(user) ? '只有管理員可以選擇/刪除管理員' : '選擇此用戶'"
                  />
                </td>
                <td class="user-id" :title="user.account">{{ user.account }}</td>
                <td class="user-name" :title="user.name || '-'">{{ user.name || '-' }}</td>
                <td class="user-email" :title="user.primary_email || '-'">
                  {{ user.primary_email || '-' }}
                </td>
                <td class="user-role">
                  <span
                    class="role-badge"
                    :class="getRoleClass(user.role)"
                    :title="getRoleName(user.role)"
                  >
                    {{ getRoleName(user.role) }}
                  </span>
                </td>
                <td class="user-status">
                  <div class="status-toggle">
                    <button
                      @click="toggleUserStatus(user)"
                      :class="['status-btn', user.enabled !== false ? 'active' : 'inactive']"
                      :title="user.enabled !== false ? '停用用戶' : '啟用用戶'"
                      :disabled="!canModify(user)"
                    >
                      <span class="status-indicator"></span>
                      {{ user.enabled !== false ? '啟用' : '停用' }}
                    </button>
                  </div>
                </td>
                <td class="user-position" :title="user.position || '-'">
                  {{ user.position || '-' }}
                </td>
                <td class="user-phone" :title="user.phone_number || '-'">
                  {{ user.phone_number || '-' }}
                </td>
                <td class="user-actions">
                  <button @click="editUser(user)" class="action-btn edit-btn" title="編輯">
                    <Edit class="action-icon" />
                  </button>
                  <button
                    @click="deleteUser(user)"
                    class="action-btn delete-btn"
                    title="刪除"
                    :disabled="!canModify(user)"
                  >
                    <Trash2 class="action-icon" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredUsers.length > itemsPerPage" class="pagination">
        <button @click="currentPage = 1" :disabled="currentPage === 1" class="pagination-btn">
          <ChevronsLeft class="pagination-icon" />
        </button>
        <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-btn">
          <ChevronLeft class="pagination-icon" />
        </button>
        <span class="pagination-info"> 第 {{ currentPage }} 頁，共 {{ totalPages }} 頁 </span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          <ChevronRight class="pagination-icon" />
        </button>
        <button
          @click="currentPage = totalPages"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          <ChevronsRight class="pagination-icon" />
        </button>
      </div>

      <!-- Create User Modal -->
      <div v-if="creatingUser" class="modal-overlay" @click="closeCreateModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">新增用戶</h3>
            <button @click="closeCreateModal" class="modal-close">
              <X class="close-icon" />
            </button>
          </div>
          <form @submit.prevent="createUser" class="edit-form">
            <div class="form-group">
              <label for="create-account">用戶帳號 *</label>
              <input
                id="create-account"
                v-model="createForm.account"
                type="text"
                class="form-input"
                placeholder="請輸入用戶帳號"
                required
              />
            </div>
            <div class="form-group">
              <label for="create-name">姓名 *</label>
              <input
                id="create-name"
                v-model="createForm.name"
                type="text"
                class="form-input"
                placeholder="請輸入姓名"
                required
              />
            </div>
            <div class="form-group">
              <label for="create-email">主要Email *</label>
              <input
                id="create-email"
                v-model="createForm.primary_email"
                type="email"
                class="form-input"
                placeholder="請輸入Email地址"
                required
              />
            </div>
            <div class="form-group">
              <label for="create-password">密碼 *</label>
              <input
                id="create-password"
                v-model="createForm.password"
                type="password"
                class="form-input"
                placeholder="請輸入密碼 (至少 8 個字元)"
                required
                minlength="8"
              />
              <div v-if="createForm.password" class="password-feedback">
                <span
                  class="password-strength"
                  :class="{ weak: !passwordStrong, strong: passwordStrong }"
                >
                  {{ passwordStrong ? '密碼強度：良好' : '密碼強度：不足 (至少8個字符)' }}
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="create-confirm-password">確認密碼 *</label>
              <input
                id="create-confirm-password"
                v-model="createForm.confirmPassword"
                type="password"
                class="form-input"
                placeholder="請再次輸入密碼 (至少 8 個字元)"
                required
                minlength="8"
              />
              <div v-if="createForm.confirmPassword" class="password-feedback">
                <span
                  class="password-match"
                  :class="{ 'no-match': !passwordsMatch, match: passwordsMatch }"
                >
                  {{ passwordsMatch ? '密碼匹配' : '密碼不匹配' }}
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="create-role">角色 *</label>
              <select id="create-role" v-model="createForm.role" class="form-select" required>
                <option value="" disabled>請選擇角色</option>
                <option v-for="(name, role) in ROLE_NAMES" :key="role" :value="Number(role)">
                  {{ name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="create-position">職位 *</label>
              <input
                id="create-position"
                v-model="createForm.position"
                type="text"
                class="form-input"
                placeholder="請輸入職位"
                required
              />
            </div>
            <div class="form-group">
              <label for="create-phone">電話 *</label>
              <input
                id="create-phone"
                v-model="createForm.phone_number"
                type="tel"
                class="form-input"
                placeholder="請輸入電話號碼"
                required
              />
            </div>
            <div class="form-group">
              <label for="create-secondary-email">次要Email</label>
              <input
                id="create-secondary-email"
                v-model="createForm.secondary_email"
                type="email"
                class="form-input"
                placeholder="請輸入次要Email (可選)"
              />
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeCreateModal" class="cancel-btn">取消</button>
              <button type="submit" :disabled="creating" class="save-btn">
                {{ creating ? '創建中...' : '創建用戶' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit User Modal -->
      <div v-if="editingUser" class="modal-overlay" @click="closeEditModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">編輯用戶</h3>
            <button @click="closeEditModal" class="modal-close">
              <X class="close-icon" />
            </button>
          </div>
          <form @submit.prevent="saveUser" class="edit-form">
            <div v-if="editForm.privacy_agreed_at" class="form-group">
              <div class="privacy-notice privacy-agreed">
                已於
                {{
                  new Date(editForm.privacy_agreed_at).toLocaleString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })
                }}
                簽署本系「個人資料保護暨隱私權聲明」
              </div>
            </div>
            <div v-else class="form-group">
              <div class="privacy-notice privacy-not-agreed">
                <AlertTriangle class="warning-icon" />
                用戶尚未簽署「個人資料保護暨隱私權聲明」
              </div>
            </div>
            <div class="form-group">
              <label for="edit-name">姓名</label>
              <input
                id="edit-name"
                v-model="editForm.name"
                type="text"
                class="form-input"
                required
                readonly
                disabled
              />
            </div>
            <div class="form-group">
              <label for="edit-account">用戶帳號</label>
              <input
                id="edit-account"
                v-model="editForm.account"
                type="text"
                class="form-input"
                required
                readonly
                disabled
              />
            </div>
            <div class="form-group">
              <label for="edit-primary-email">主要Email</label>
              <input
                id="edit-primary-email"
                v-model="editForm.primary_email"
                type="email"
                class="form-input"
                required
                readonly
                disabled
              />
            </div>
            <div class="form-group">
              <label for="edit-role">角色</label>
              <select id="edit-role" v-model="editForm.role" class="form-select" required>
                <option v-for="(name, role) in ROLE_NAMES" :key="role" :value="Number(role)">
                  {{ name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="edit-position">職位</label>
              <input
                id="edit-position"
                v-model="editForm.position"
                type="text"
                class="form-input"
                readonly
                disabled
              />
            </div>
            <div class="form-group">
              <label for="edit-phone">電話</label>
              <input
                id="edit-phone"
                v-model="editForm.phone_number"
                type="tel"
                class="form-input"
                readonly
                disabled
              />
            </div>
            <div class="form-group">
              <label for="edit-secondary-email">次要Email</label>
              <input
                id="edit-secondary-email"
                v-model="editForm.secondary_email"
                type="email"
                class="form-input"
                readonly
                disabled
              />
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeEditModal" class="cancel-btn">取消</button>
              <button type="submit" :disabled="saving" class="save-btn">
                {{ saving ? '保存中...' : '保存' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="deletingUser" class="modal-overlay" @click="closeDeleteModal">
        <div class="modal-content delete-modal" @click.stop>
          <div class="delete-content">
            <div class="delete-warning-icon-container">
              <AlertTriangle class="delete-warning-icon" />
            </div>
            <h3 class="delete-modal-title">您確定要刪除用戶 {{ deletingUser.name }} 嗎?</h3>
            <p class="delete-warning">此操作無法撤銷！</p>
          </div>
          <div class="modal-actions">
            <button @click="closeDeleteModal" class="cancel-btn">取消</button>
            <button @click="confirmDelete" :disabled="deleting" class="delete-confirm-btn">
              {{ deleting ? '刪除中...' : '確認刪除' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Bulk Delete Confirmation Modal -->
      <div v-if="bulkDeleteModalOpen" class="modal-overlay" @click="closeBulkDeleteModal">
        <div class="modal-content delete-modal" @click.stop>
          <div class="delete-content">
            <div class="delete-warning-icon-container">
              <AlertTriangle class="delete-warning-icon" />
            </div>
            <h3 class="delete-modal-title">您確定要刪除已選擇的 {{ selectedCount }} 位用戶嗎？</h3>
            <p class="delete-warning">此操作無法撤銷！</p>
          </div>
          <div class="modal-actions">
            <button @click="closeBulkDeleteModal" class="cancel-btn">取消</button>
            <button
              @click="confirmBulkDelete"
              :disabled="deletingSelected"
              class="delete-confirm-btn"
            >
              {{ deletingSelected ? '刪除中...' : '確認刪除' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useAdminStore } from '@/stores/adminStore'
import { useToast } from '@/composables/useToast'
import { getRoleName, ROLE_NAMES, USER_ROLES, type UserRoleValue } from '@/types/userRoles'
import AppHeader from '@/components/common/Header.vue'
import {
  Search,
  RefreshCw,
  Users,
  UserPlus,
  Edit,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  AlertTriangle,
} from 'lucide-vue-next'

// Component name for ESLint
defineOptions({
  name: 'UserManagementView',
})

// Types
interface User {
  id: string
  account: string
  name: string
  primary_email: string
  secondary_email?: string
  phone_number?: string
  position?: string
  role: UserRoleValue
  enabled?: boolean
  privacy_agreed_at?: string | null
}

interface EditForm {
  account: string
  name: string
  primary_email: string
  role: UserRoleValue
  position: string
  phone_number: string
  secondary_email: string
  privacy_agreed_at?: string | null
}

interface CreateForm {
  account: string
  name: string
  primary_email: string
  password: string
  confirmPassword: string
  secondary_email: string
  phone_number: string
  position: string
  role: UserRoleValue | ''
}

// Stores and composables
const userStore = useUserStore()
const adminStore = useAdminStore()
const { success, error: showError } = useToast()

// Reactive data
const searchQuery = ref('')
const selectedRole = ref<string>('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Selection state for bulk actions
const selectedUserIds = ref<Set<string>>(new Set())
const selectedCount = computed(() => selectedUserIds.value.size)
const headerCheckbox = ref<HTMLInputElement | null>(null)

// Create modal
const creatingUser = ref(false)
const MIN_PASSWORD_LENGTH = 8
const emptyCreateForm = (): CreateForm => ({
  account: '',
  name: '',
  primary_email: '',
  password: '',
  confirmPassword: '',
  secondary_email: '',
  phone_number: '',
  position: '',
  role: '',
})
const createForm = ref<CreateForm>(emptyCreateForm())
const creating = ref(false)

// Edit modal
const editingUser = ref<User | null>(null)
const editForm = ref<EditForm>({
  account: '',
  name: '',
  primary_email: '',
  role: USER_ROLES.GUEST,
  position: '',
  phone_number: '',
  secondary_email: '',
  privacy_agreed_at: null,
})
const saving = ref(false)

// Delete modal
const deletingUser = ref<User | null>(null)
const deleting = ref(false)

// Computed properties
const currentUser = computed(() => userStore)
const users = computed(() => adminStore.users || [])
const loading = computed(() => adminStore.loading)
const error = computed(() => adminStore.error)

// Normalized search term and role filter
const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())

const filteredUsers = computed(() => {
  const q = normalizedSearchQuery.value
  const roleFilter = selectedRole.value
  return users.value
    .filter((user) => {
      const matchesSearch =
        !q ||
        user.name?.toLowerCase().includes(q) ||
        user.account.toLowerCase().includes(q) ||
        user.primary_email?.toLowerCase().includes(q)

      const matchesRole = !roleFilter || user.role.toString() === roleFilter

      return matchesSearch && matchesRole
    })
    .sort((a, b) => {
      // First sort by role
      if (a.role !== b.role) {
        return a.role - b.role
      }
      // Then sort by account
      return a.account.localeCompare(b.account)
    })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

// Selectable IDs on current page (respect admin restriction)
const paginatedSelectableIds = computed(() =>
  paginatedUsers.value.filter((u) => canModify(u)).map((u) => u.account),
)
const paginatedSelectableCount = computed(() => paginatedSelectableIds.value.length)
const allSelectableOnPageSelected = computed(
  () =>
    paginatedSelectableCount.value > 0 &&
    paginatedSelectableIds.value.every((id) => selectedUserIds.value.has(id)),
)

// Keep header checkbox indeterminate in sync with page selection
watch(
  [paginatedUsers, selectedUserIds],
  () => {
    if (!headerCheckbox.value) return
    const ids = paginatedSelectableIds.value
    const selectedOnPage = ids.filter((id) => selectedUserIds.value.has(id))

    // Set indeterminate only when some (but not all) are selected
    headerCheckbox.value.indeterminate =
      selectedOnPage.length > 0 && selectedOnPage.length < ids.length

    // Ensure checkbox is unchecked when no items are selected
    if (selectedOnPage.length === 0) {
      headerCheckbox.value.checked = false
    }
  },
  { flush: 'post' },
)

// Password validation
const passwordsMatch = computed(() => {
  return createForm.value.password === createForm.value.confirmPassword
})

const passwordStrong = computed(() => {
  return createForm.value.password.length >= MIN_PASSWORD_LENGTH
})

// Methods
const fetchUsers = async () => {
  try {
    await adminStore.getAllUsers()
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : '獲取用戶列表時發生錯誤'
    showError('載入失敗', errorMessage)
  }
}

const refreshUsers = () => {
  currentPage.value = 1
  // Clear selection when refreshing
  selectedUserIds.value = new Set()
  fetchUsers()
}

// Selection handlers
const toggleUserSelection = (user: User) => {
  const account = user.account
  const next = new Set(selectedUserIds.value)
  if (next.has(account)) next.delete(account)
  else next.add(account)
  selectedUserIds.value = next
}

const toggleSelectAllOnPage = () => {
  const next = new Set(selectedUserIds.value)
  const ids = paginatedSelectableIds.value
  const selectedOnPage = ids.filter((id) => selectedUserIds.value.has(id))

  // If any are selected (including indeterminate state), unselect all
  // Otherwise, select all
  if (selectedOnPage.length > 0) {
    // Unselect all on current page
    ids.forEach((id) => next.delete(id))
  } else {
    // Select all on current page
    ids.forEach((id) => next.add(id))
  }
  selectedUserIds.value = next
}

const ROLE_CLASS_MAP: Record<UserRoleValue, string> = {
  [USER_ROLES.ADMIN]: 'role-admin',
  [USER_ROLES.OFFICER]: 'role-officer',
  [USER_ROLES.DIRECTOR]: 'role-director',
  [USER_ROLES.TEACHER]: 'role-teacher',
  [USER_ROLES.STUDENT]: 'role-student',
  [USER_ROLES.UT_USER]: 'role-ut-user',
  [USER_ROLES.GUEST]: 'role-guest',
}
const getRoleClass = (role: UserRoleValue): string => ROLE_CLASS_MAP[role] ?? 'role-guest'

// Permission helper
const canModify = (user: User): boolean =>
  !(user.role === USER_ROLES.ADMIN && currentUser.value?.role !== USER_ROLES.ADMIN)

const openCreateModal = () => {
  creatingUser.value = true
  createForm.value = emptyCreateForm()
}

const closeCreateModal = () => {
  creatingUser.value = false
  createForm.value = emptyCreateForm()
}

const createUser = async () => {
  if (
    !createForm.value.account ||
    !createForm.value.name ||
    !createForm.value.primary_email ||
    !createForm.value.password ||
    !createForm.value.phone_number ||
    !createForm.value.position ||
    !createForm.value.role
  ) {
    showError('表單錯誤', '請填寫所有必填欄位')
    return
  }

  if (createForm.value.password !== createForm.value.confirmPassword) {
    showError('密碼錯誤', '密碼和確認密碼不匹配')
    return
  }

  if (createForm.value.password.length < MIN_PASSWORD_LENGTH) {
    showError('密碼錯誤', `密碼長度至少需要${MIN_PASSWORD_LENGTH}個字符`)
    return
  }

  creating.value = true
  try {
    await adminStore.createUser({
      account: createForm.value.account,
      name: createForm.value.name,
      primary_email: createForm.value.primary_email,
      password: createForm.value.password,
      secondary_email: createForm.value.secondary_email || undefined,
      phone_number: createForm.value.phone_number,
      position: createForm.value.position,
      role: createForm.value.role as UserRoleValue,
    })

    success('創建成功', '用戶已成功創建')
    closeCreateModal()
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : '創建用戶時發生錯誤'
    showError('創建失敗', errorMessage)
  } finally {
    creating.value = false
  }
}

const editUser = (user: User) => {
  editingUser.value = user
  editForm.value = {
    account: user.account || '',
    name: user.name || '',
    primary_email: user.primary_email || '',
    role: user.role,
    position: user.position || '',
    phone_number: user.phone_number || '',
    secondary_email: user.secondary_email || '',
    privacy_agreed_at: user.privacy_agreed_at || null,
  }
}

const closeEditModal = () => {
  editingUser.value = null
  editForm.value = {
    account: '',
    name: '',
    primary_email: '',
    role: USER_ROLES.GUEST,
    position: '',
    phone_number: '',
    secondary_email: '',
    privacy_agreed_at: null,
  }
}

const saveUser = async () => {
  if (!editingUser.value) return

  saving.value = true
  try {
    const last_updated = new Date().toLocaleString('sv-SE')
    await adminStore.updateUser(editingUser.value.id, {
      account: editForm.value.account,
      name: editForm.value.name,
      primary_email: editForm.value.primary_email,
      role: editForm.value.role,
      position: editForm.value.position || undefined,
      phone_number: editForm.value.phone_number || undefined,
      secondary_email: editForm.value.secondary_email || undefined,
      last_updated: last_updated,
    })

    success('更新成功', '用戶資料已成功更新')
    closeEditModal()
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : '更新用戶時發生錯誤'
    showError('更新失敗', errorMessage)
  } finally {
    saving.value = false
  }
}

const deleteUser = (user: User) => {
  deletingUser.value = user
}

const closeDeleteModal = () => {
  deletingUser.value = null
}

const confirmDelete = async () => {
  if (!deletingUser.value) return

  deleting.value = true
  try {
    await adminStore.deleteUser(deletingUser.value.id)
    success('刪除成功', '用戶已成功刪除')
    closeDeleteModal()
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : '刪除用戶時發生錯誤'
    showError('刪除失敗', errorMessage)
  } finally {
    deleting.value = false
  }
}

// Bulk delete
const bulkDeleteModalOpen = ref(false)
const deletingSelected = ref(false)

const openBulkDeleteModal = () => {
  if (selectedCount.value === 0) return
  bulkDeleteModalOpen.value = true
}

const closeBulkDeleteModal = () => {
  bulkDeleteModalOpen.value = false
}

const confirmBulkDelete = async () => {
  if (selectedCount.value === 0) return
  deletingSelected.value = true
  const ids = Array.from(selectedUserIds.value)
  try {
    const results = await Promise.allSettled(ids.map((id) => adminStore.deleteUser(id)))
    let successCount = 0
    let failCount = 0
    results.forEach((r) => (r.status === 'fulfilled' ? successCount++ : failCount++))

    if (successCount > 0) {
      success('刪除成功', `已刪除 ${successCount} 位用戶`)
    }
    if (failCount > 0) {
      showError('部分刪除失敗', `有 ${failCount} 位用戶刪除失敗`)
    }

    // Remove successfully deleted IDs from selection
    const next = new Set(selectedUserIds.value)
    ids.forEach((id, idx) => {
      if (results[idx].status === 'fulfilled') {
        next.delete(id)
      }
    })
    selectedUserIds.value = next

    closeBulkDeleteModal()
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : '批量刪除時發生錯誤'
    showError('刪除失敗', errorMessage)
  } finally {
    deletingSelected.value = false
  }
}

const toggleUserStatus = async (user: User) => {
  const isCurrentlyActive = user.enabled !== false
  const action = isCurrentlyActive ? '停用' : '啟用'

  try {
    if (isCurrentlyActive) {
      await adminStore.deactivateUser(user.id)
      success('狀態更新', `用戶 ${user.name} 已停用`)
    } else {
      await adminStore.activateUser(user.id)
      success('狀態更新', `用戶 ${user.name} 已啟用`)
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : `${action}用戶時發生錯誤`
    showError(`${action}失敗`, errorMessage)
  }
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
/* Shell */
.user-management-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Section */
.user-management-section {
  flex: 1;
  padding: 2rem 2.25rem 3rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.section-title {
  margin: 0 0 0.5rem;
  font-size: 1.375rem;
  font-weight: 600;
  color: #1e293b;
}

.section-subtitle {
  color: #64748b;
  margin: 0 0 2rem 0;
}

/* Search and Filters */
.search-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filters {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.role-filter {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 0.5rem;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.create-btn:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.create-icon {
  width: 1rem;
  height: 1rem;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  width: 1rem;
  height: 1rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Table Container */
.users-table-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

/* Loading, Error, Empty States */
.loading-state,
.error-state,
.empty-state {
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #64748b;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-icon,
.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #94a3b8;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #2563eb;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.users-table th,
.users-table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Fixed column widths (with checkbox column) */
.users-table th:nth-child(1),
.users-table td:nth-child(1) {
  width: 44px; /* 選擇框 */
}

.users-table th:nth-child(2),
.users-table td:nth-child(2) {
  width: 120px; /* 用戶ID */
}

.users-table th:nth-child(3),
.users-table td:nth-child(3) {
  width: 120px; /* 姓名 */
}

.users-table th:nth-child(4),
.users-table td:nth-child(4) {
  width: 200px; /* 主要Email */
}

.users-table th:nth-child(5),
.users-table td:nth-child(5) {
  width: 120px; /* 角色 */
}

.users-table th:nth-child(6),
.users-table td:nth-child(6) {
  width: 100px; /* 狀態 */
}

.users-table th:nth-child(7),
.users-table td:nth-child(7) {
  width: 120px; /* 職位 */
}

.users-table th:nth-child(8),
.users-table td:nth-child(8) {
  width: 140px; /* 電話 */
}

.users-table th:nth-child(9),
.users-table td:nth-child(9) {
  width: 100px; /* 操作 */
}

.users-table th {
  background: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
}

.users-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
}

.user-row:hover {
  background: #f8fafc;
}

.user-id {
  font-family: monospace;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-position,
.user-phone {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Role Badges */
.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-admin {
  background: #fee2e2;
  color: #991b1b;
}

.role-officer {
  background: #fef3c7;
  color: #92400e;
}

.role-director {
  background: #e0e7ff;
  color: #3730a3;
}

.role-teacher {
  background: #ecfdf5;
  color: #065f46;
}

.role-student {
  background: #ede9fe;
  color: #5b21b6;
}

.role-ut-user {
  background: #f0f9ff;
  color: #0c4a6e;
}

.role-guest {
  background: #f1f5f9;
  color: #475569;
}

/* Status Toggle */
.status-toggle {
  display: flex;
  justify-content: center;
}

.status-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 70px;
  justify-content: center;
}

.status-btn.active {
  background: #dcfce7;
  color: #166534;
}

.status-btn.active:hover:not(:disabled) {
  background: #bbf7d0;
}

.status-btn.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-btn.inactive:hover:not(:disabled) {
  background: #fecaca;
}

.status-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: currentColor;
}

/* Actions */
.user-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

.edit-btn {
  background: #eff6ff;
  color: #1d4ed8;
}

.edit-btn:hover {
  background: #dbeafe;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover:not(:disabled) {
  background: #fee2e2;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Bulk delete button */
.bulk-delete-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #b91c1c;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.bulk-delete-btn:hover:not(:disabled) {
  background: #fee2e2;
}

.bulk-delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Selection cells */
.users-table th.select-col,
.users-table td.select-cell {
  text-align: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.users-table td.select-cell input[type='checkbox'],
.users-table th.select-col input[type='checkbox'] {
  width: 16px;
  height: 16px;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-icon {
  width: 1rem;
  height: 1rem;
}

.pagination-info {
  margin: 0 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Edit Form */
.edit-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Password feedback */
.password-feedback {
  margin-top: 0.5rem;
  font-size: 0.75rem;
}

.password-strength.weak,
.password-match.no-match {
  color: #dc2626;
}

.password-strength.strong,
.password-match.match {
  color: #059669;
}

/* Privacy notice */
.privacy-notice {
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.privacy-notice.privacy-agreed {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0c4a6e;
}

.privacy-notice.privacy-not-agreed {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.privacy-notice .warning-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f9fafb;
}

.save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Delete Modal */
.delete-modal {
  max-width: 430px;
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.delete-content {
  padding: 2rem 2rem 1.5rem 2rem;
  text-align: center;
}

.delete-warning-icon-container {
  width: 64px;
  height: 64px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
}

.delete-warning-icon {
  width: 2rem;
  height: 2rem;
  color: #dc2626;
}

.delete-modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.delete-warning {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.delete-modal .modal-actions {
  padding: 0 2rem 2rem 2rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 0;
}

.delete-modal .cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 100px;
}

.delete-modal .cancel-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.delete-confirm-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #dc2626;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 100px;
}

.delete-confirm-btn:hover:not(:disabled) {
  background: #b91c1c;
}

.delete-confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .user-management-section {
    padding: 1rem 1.5rem 2rem;
  }

  .search-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: auto;
  }

  .filters {
    justify-content: space-between;
  }

  /* Hide button text on mobile, only show icons */
  .create-btn .btn-text,
  .bulk-delete-btn .btn-text,
  .refresh-btn .btn-text {
    display: none;
  }

  .create-btn,
  .bulk-delete-btn,
  .refresh-btn {
    padding: 0.75rem;
    min-width: auto;
  }

  .create-icon,
  .refresh-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Adjust table column widths for mobile */
  .users-table th:nth-child(1),
  .users-table td:nth-child(1) {
    width: 36px; /* 選擇框 */
  }

  .users-table th:nth-child(2),
  .users-table td:nth-child(2) {
    width: 100px; /* 用戶ID */
  }

  .users-table th:nth-child(3),
  .users-table td:nth-child(3) {
    width: 100px; /* 姓名 */
  }

  .users-table th:nth-child(4),
  .users-table td:nth-child(4) {
    width: 150px; /* 主要Email */
  }

  .users-table th:nth-child(5),
  .users-table td:nth-child(5) {
    width: 100px; /* 角色 */
  }

  .users-table th:nth-child(6),
  .users-table td:nth-child(6) {
    width: 80px; /* 狀態 */
  }

  .users-table th:nth-child(7),
  .users-table td:nth-child(7) {
    width: 80px; /* 職位 */
  }

  .users-table th:nth-child(8),
  .users-table td:nth-child(8) {
    width: 120px; /* 電話 */
  }

  .users-table th:nth-child(9),
  .users-table td:nth-child(9) {
    width: 80px; /* 操作 */
  }

  .users-table th,
  .users-table td {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .status-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    min-width: 60px;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .modal-header,
  .edit-form {
    padding: 1rem;
  }

  .pagination {
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .page-title {
    font-size: 1.5rem;
  }

  .action-btn {
    width: 1.75rem;
    height: 1.75rem;
  }

  .action-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
}
</style>

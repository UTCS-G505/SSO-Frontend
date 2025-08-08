<template>
  <div class="login-container">
    <div class="login-content">
      <!-- Left side - Login form -->
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

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                id="username"
                v-model="username"
                type="username"
                required
                placeholder="U11216028"
                :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-input">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Type your password"
                  :disabled="isLoading"
                />
                <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                    />
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="m1 1 22 22" stroke="currentColor" stroke-width="2" />
                    <path
                      d="M6.71 6.71C4.68 8.04 3 10.5 3 12s1.68 3.96 3.71 5.29"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                    />
                    <path
                      d="M14.5 9.5A3 3 0 0 0 9.5 14.5"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                <!-- <span class="checkmark"></span> -->
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

      <!-- Right side - Marketing content -->
      <div class="marketing-section">
        <div class="marketing-content">
          <h2>Code Smarter.</h2>
          <h1>Learn. Build. Excel.</h1>

          <div class="laptop-mockup">
            <div class="laptop">
              <div class="laptop-screen">
                <!-- VS Code Menu Bar -->
                <div class="menu-bar">
                  <div class="menu-items">
                    <span class="menu-item">File</span>
                    <span class="menu-item">Edit</span>
                    <span class="menu-item">View</span>
                    <span class="menu-item">Go</span>
                    <span class="menu-item">Run</span>
                    <span class="menu-item">Terminal</span>
                    <span class="menu-item">Help</span>
                  </div>
                  <div class="window-controls">
                    <div class="window-control minimize"></div>
                    <div class="window-control maximize"></div>
                    <div class="window-control close"></div>
                  </div>
                </div>

                <div class="vscode-layout">
                  <!-- VS Code Activity Bar -->
                  <div class="activity-bar">
                    <div class="activity-item active">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
                        />
                      </svg>
                    </div>
                    <div class="activity-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-git-branch-icon lucide-git-branch"
                      >
                        <line x1="6" x2="6" y1="3" y2="15" />
                        <circle cx="18" cy="6" r="3" />
                        <circle cx="6" cy="18" r="3" />
                        <path d="M18 9a9 9 0 0 1-9 9" />
                      </svg>
                    </div>
                    <div class="activity-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-bug-play-icon lucide-bug-play"
                      >
                        <path d="M10 19.655A6 6 0 0 1 6 14v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 3.97" />
                        <path
                          d="M14 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z"
                        />
                        <path d="M14.12 3.88 16 2" />
                        <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
                        <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
                        <path d="M6 13H2" />
                        <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
                        <path d="m8 2 1.88 1.88" />
                        <path d="M9 7.13v-1a3 3 0 0 1 4.18-2.895 3 3 0 0 1 1.821 2.896v1" />
                      </svg>
                    </div>
                    <div class="activity-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-blocks-icon lucide-blocks"
                      >
                        <path
                          d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2"
                        />
                        <rect x="14" y="2" width="8" height="8" rx="1" />
                      </svg>
                    </div>
                  </div>

                  <!-- VS Code Sidebar -->
                  <div class="sidebar">
                    <!-- <div class="sidebar-header">
                      <span class="explorer-title">EXPLORER</span>
                      <div class="explorer-actions">
                        <svg
                          class="explorer-action"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                          />
                          <polyline points="14,2 14,8 20,8" />
                        </svg>
                        <svg
                          class="explorer-action"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
                          />
                        </svg>
                        <svg
                          class="explorer-action"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                          <path d="M21 3v5h-5" />
                          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                          <path d="M3 21v-5h5" />
                        </svg>
                        <svg
                          class="explorer-action"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </div>
                    </div> -->
                    <div class="file-tree">
                      <div class="folder">
                        <svg
                          class="folder-icon"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                        <span class="folder-name">utcs-project</span>
                      </div>
                      <div class="file-item indent">
                        <!-- <img src="@/assets/cpp.svg" alt="icon" /> -->
                        <svg
                          class="file-icon cpp-icon"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                          />
                          <polyline points="14,2 14,8 20,8" />
                        </svg>
                        <span class="file-name active">main.cpp</span>
                      </div>
                      <div class="file-item indent">
                        <svg
                          class="file-icon md-icon"
                          width="100"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                          />
                          <polyline points="14,2 14,8 20,8" />
                        </svg>
                        <span class="file-name">README.md</span>
                      </div>
                      <div class="file-item indent">
                        <svg
                          class="file-icon h-icon"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                          />
                          <polyline points="14,2 14,8 20,8" />
                        </svg>
                        <span class="file-name">utils.h</span>
                      </div>
                      <div class="folder indent">
                        <svg
                          class="folder-icon"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                        <span class="folder-name">src</span>
                      </div>
                      <div class="folder indent">
                        <svg
                          class="folder-icon"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                        <span class="folder-name">build</span>
                      </div>
                    </div>
                  </div>

                  <!-- Main Editor Area -->
                  <div class="editor-area">
                    <!-- Tab Bar -->
                    <div class="tab-bar">
                      <div class="tab active">
                        <svg
                          class="tab-icon cpp-icon"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                          />
                          <polyline points="14,2 14,8 20,8" />
                        </svg>
                        <span class="tab-name">main.cpp</span>
                        <span class="tab-close">×</span>
                      </div>
                      <div class="tab">
                        <svg
                          class="tab-icon h-icon"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                          />
                          <polyline points="14,2 14,8 20,8" />
                        </svg>
                        <span class="tab-name">utils.h</span>
                        <span class="tab-close">×</span>
                      </div>
                    </div>

                    <!-- Code Editor -->
                    <div class="code-editor">
                      <div class="code-content">
                        <div class="line-numbers">
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                          <span>6</span>
                          <span>7</span>
                          <span>8</span>
                        </div>
                        <div class="code-lines">
                          <div class="code-line">
                            <span class="keyword">#include </span>
                            <span class="string">&lt;iostream&gt;</span>
                          </div>
                          <div class="code-line">
                            <span class="keyword">using namespace </span>
                            <span class="type">std</span>;
                          </div>
                          <div class="code-line"></div>
                          <div class="code-line">
                            <span class="type">int</span> <span class="function">main</span>() {
                          </div>
                          <div class="code-line">
                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="type">cout</span> &lt;&lt;
                            <span class="string">"Hello UTCS!"</span> &lt;&lt;
                            <span class="type">endl</span>;
                          </div>
                          <div class="code-line">
                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return </span>
                            <span class="number">0</span>;
                          </div>
                          <div class="code-line">}</div>
                          <div class="code-line"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Terminal -->
                    <div class="terminal-section">
                      <div class="terminal-tabs">
                        <div class="terminal-tab active">
                          <svg
                            class="terminal-icon"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <polyline points="4,17 10,11 4,5" />
                            <line x1="12" x2="20" y1="19" y2="19" />
                          </svg>
                          <span>Terminal</span>
                        </div>
                      </div>
                      <div class="terminal-content">
                        <div class="terminal-line">
                          <span class="prompt">student@utcs:~/project$ </span>
                          <span class="command">g++ main.cpp -o main</span>
                        </div>
                        <div class="terminal-line">
                          <span class="prompt">student@utcs:~/project$ </span>
                          <span class="command">./main</span>
                        </div>
                        <div class="terminal-line output">Hello UTCS!</div>
                        <div class="terminal-line">
                          <span class="prompt">student@utcs:~/project$ </span>
                          <span class="cursor">_</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- VS Code Status Bar -->
                <div class="status-bar">
                  <div class="status-left">
                    <span class="branch-info">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <circle cx="6" cy="6" r="3" />
                        <circle cx="6" cy="18" r="3" />
                        <line x1="20" x2="8.5" y1="4" y2="7.5" />
                        <line x1="20" x2="8.5" y1="20" y2="16.5" />
                        <line x1="8.5" x2="8.5" y1="7.5" y2="16.5" />
                      </svg>
                      main
                    </span>
                    <span class="error-count">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
                        />
                        <path d="M12 9v4" />
                        <path d="m12 17 .01 0" />
                      </svg>
                      0
                    </span>
                  </div>
                  <div class="status-right">
                    <span class="language">C++</span>
                    <span class="position">Ln 6, Col 24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await authStore.login(username.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.login-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: 95vh;
  background: white;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.login-card {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
  background: #F7F0D8;
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

.google-btn {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;
}

.google-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.google-icon {
  flex-shrink: 0;
}

.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
  color: #9ca3af;
  font-size: 14px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
  z-index: 1;
}

.divider span {
  background: white;
  padding: 0 16px;
  position: relative;
  z-index: 2;
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

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #374151;
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
  width: auto;
  margin: 0;
}

.checkmark {
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  display: inline-block;
  position: relative;
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
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

.marketing-section {
  flex: 1;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 0 16px 16px 0;
}

.marketing-content {
  text-align: center;
  z-index: 2;
}

.marketing-content h2 {
  font-size: 16px;
  font-weight: 400;
  color: #9ca3af;
  margin-bottom: 8px;
}

.marketing-content h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.laptop-mockup {
  display: flex;
  justify-content: center;
  align-items: center;
}

.laptop {
  width: 540px;
  height: 360px;
  background: #374151;
  border-radius: 16px;
  padding: 16px;
  position: relative;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.laptop-screen {
  width: 100%;
  height: 100%;
  background: #1f2937;
  border-radius: 12px;
  overflow: hidden;
  font-size: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.menu-bar {
  background: #111827;
  border-bottom: 1px solid #374151;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 9px;
  color: #e5e7eb;
}

.menu-items {
  display: flex;
  gap: 2px;
}

.menu-item {
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 2px;
  user-select: none;
}

.menu-item:hover {
  background: #374151;
}

.window-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.window-control {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  cursor: pointer;
}

.window-control.minimize {
  background: #fbbf24;
}

.window-control.maximize {
  background: #10b981;
}

.window-control.close {
  background: #ef4444;
}

.vscode-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

.activity-bar {
  width: 32px;
  background: #0f172a;
  border-right: 1px solid #374151;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  gap: 4px;
}

.activity-item {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
}

.activity-item:hover {
  color: #e5e7eb;
  background: #374151;
}

.activity-item.active {
  color: #ffffff;
}

.activity-item.active::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 16px;
  background: #60a5fa;
  border-radius: 1px;
}

.sidebar {
  width: 20%;
  background: #111827;
  border-right: 1px solid #374151;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 6px 8px;
  background: #0f172a;
  border-bottom: 1px solid #374151;
  font-size: 10px;
  color: #9ca3af;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.explorer-title {
  letter-spacing: 0.5px;
}

.explorer-actions {
  display: flex;
  gap: 2px;
}

.explorer-action {
  color: #6b7280;
  cursor: pointer;
  padding: 1px 2px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.explorer-action:hover {
  background: #374151;
  color: #e5e7eb;
}

.file-tree {
  padding: 4px;
  flex: 1;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.folder,
.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px;
  font-size: 10px;
  color: #e5e7eb;
  cursor: pointer;
  border-radius: 2px;
  user-select: none;
}

.folder:hover,
.file-item:hover {
  background: #374151;
}

.folder-icon,
.file-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.folder-icon {
  color: #9ca3af;
}

.cpp-icon {
  color: #61dafb;
}

.md-icon {
  color: #fbbf24;
}

.h-icon {
  color: #a78bfa;
}

.indent {
  margin-left: 8px;
}

.terminal-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.tab-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.file-name.active {
  color: #fbbf24;
  font-weight: 500;
}

.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1f2937;
}

.tab-bar {
  background: #111827;
  border-bottom: 1px solid #374151;
  display: flex;
  padding: 0 4px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #1f2937;
  border-right: 1px solid #374151;
  font-size: 10px;
  color: #e5e7eb;
  cursor: pointer;
}

.tab.active {
  background: #1f2937;
  color: #fbbf24;
}

.tab-icon {
  font-size: 8px;
}

.tab-close {
  color: #6b7280;
  font-size: 12px;
  margin-left: 4px;
}

.tab-close:hover {
  color: #e5e7eb;
}

.code-editor {
  flex: 1;
  display: flex;
  background: #1f2937;
  min-height: 0;
}

.code-content {
  display: flex;
  width: 100%;
  min-height: 0;
}

.line-numbers {
  background: #111827;
  padding: 8px 6px;
  color: #6b7280;
  text-align: right;
  line-height: 1.4;
  flex-shrink: 0;
  border-right: 1px solid #374151;
}

.line-numbers span {
  display: block;
  font-size: 10px;
}

.code-lines {
  flex: 1;
  padding: 8px 10px;
  line-height: 1.4;
  overflow: hidden;
  text-align: left;
}

.code-line {
  font-size: 10px;
  margin-bottom: 2px;
  font-family: 'Courier New', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
}

.keyword {
  color: #c084fc;
}
.string {
  color: #34d399;
}
.type {
  color: #60a5fa;
}
.function {
  color: #fbbf24;
}
.number {
  color: #f87171;
}
.comment {
  color: #6b7280;
}

.terminal-section {
  background: #111827;
  border-top: 1px 374151;
  height: 30%;
  display: flex;
  flex-direction: column;
}

.terminal-tabs {
  background: #0f172a;
  padding: 2px 4px;
  border-bottom: 1px solid #374151;
  display: flex;
  justify-content: flex-start;
}

.terminal-tab {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  background: #111827;
  border-radius: 2px;
  font-size: 9px;
  color: #9ca3af;
}

.terminal-tab.active {
  background: #1f2937;
  color: #10b981;
}

.terminal-icon {
  font-size: 8px;
}

.terminal-content {
  padding: 6px 10px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  flex: 1;
  overflow: hidden;
  text-align: left;
}

.terminal-line {
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
}

.prompt {
  color: #10b981;
}
.command {
  color: #e5e7eb;
}
.output {
  color: #fbbf24;
}
.cursor {
  color: #e5e7eb;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.status-bar {
  background: #0f172a;
  border-top: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
  font-size: 9px;
  color: #9ca3af;
  height: 16px;
  flex-shrink: 0;
}

.status-left,
.status-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.branch-info,
.error-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.branch-info {
  color: #10b981;
}

.error-count {
  color: #f59e0b;
}

.language {
  color: #60a5fa;
}

.position {
  color: #e5e7eb;
}

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    height: auto;
  }

  .marketing-section {
    display: none;
  }

  .login-card {
    padding: 40px 20px;
    max-width: none;
  }
}
</style>

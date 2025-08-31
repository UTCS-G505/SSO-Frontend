<template>
  <Teleport to="body">
    <div class="toast-container" v-if="toasts.length > 0">
      <TransitionGroup name="toast" tag="div" class="toast-wrapper">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast--${toast.type}`, { 'toast--dismissible': !toast.persistent }]"
          role="alert"
          :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
        >
          <div class="toast__icon">
            <CheckCircle v-if="toast.type === 'success'" class="icon" />
            <XCircle v-else-if="toast.type === 'error'" class="icon" />
            <AlertTriangle v-else-if="toast.type === 'warning'" class="icon" />
            <Info v-else class="icon" />
          </div>

          <div class="toast__content">
            <div class="toast__title">{{ toast.title }}</div>
            <div v-if="toast.message" class="toast__message">{{ toast.message }}</div>
          </div>

          <button
            v-if="!toast.persistent"
            @click="removeToast(toast.id)"
            class="toast__close"
            :aria-label="`關閉 ${toast.title} 通知`"
          >
            <X class="icon" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 420px;
  width: 100%;
  pointer-events: none;
}

.toast-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-left: 4px solid;
  pointer-events: auto;
  min-width: 320px;
  max-width: 420px;
  word-wrap: break-word;
}

.toast--success {
  border-left-color: #10b981;
}

.toast--success .toast__icon {
  color: #10b981;
}

.toast--error {
  border-left-color: #ef4444;
}

.toast--error .toast__icon {
  color: #ef4444;
}

.toast--warning {
  border-left-color: #f59e0b;
}

.toast--warning .toast__icon {
  color: #f59e0b;
}

.toast--info {
  border-left-color: #3b82f6;
}

.toast--info .toast__icon {
  color: #3b82f6;
}

.toast__icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.toast__icon .icon {
  width: 20px;
  height: 20px;
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
  margin-bottom: 2px;
}

.toast__message {
  font-size: 13px;
  line-height: 1.4;
  color: #6b7280;
}

.toast__close {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  color: #9ca3af;
  transition: all 0.15s ease;
  margin-top: -2px;
  margin-right: -4px;
}

.toast__close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.toast__close .icon {
  width: 16px;
  height: 16px;
}

/* Transitions */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile responsive */
@media (max-width: 640px) {
  .toast-container {
    top: 16px;
    right: 16px;
    left: 16px;
    max-width: none;
  }

  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>

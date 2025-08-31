import { reactive } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

interface ToastState {
  toasts: Toast[]
}

const state: ToastState = reactive({
  toasts: [],
})

let toastIdCounter = 0

export function useToast() {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastIdCounter}`
    const newToast: Toast = {
      id,
      duration: 2000,
      persistent: false,
      ...toast,
    }

    state.toasts.push(newToast)

    // Auto remove toast after duration (unless persistent)
    if (!newToast.persistent && newToast.duration) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = state.toasts.findIndex((toast) => toast.id === id)
    if (index > -1) {
      state.toasts.splice(index, 1)
    }
  }

  const clearToasts = () => {
    state.toasts.splice(0, state.toasts.length)
  }

  // Convenience methods
  const success = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', title, message, ...options })
  }

  const error = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', title, message, duration: 7000, ...options })
  }

  const warning = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', title, message, ...options })
  }

  const info = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', title, message, ...options })
  }

  return {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  }
}

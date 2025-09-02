<template>
  <div class="form-group">
    <label :for="inputId">{{ label }}</label>
    <div class="password-input">
      <input
        :id="inputId"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :type="showPassword ? 'text' : 'password'"
        required
        :placeholder="placeholder"
        :disabled="disabled"
      />
      <button type="button" class="password-toggle" @click="togglePassword">
        <Eye v-if="!showPassword" />
        <EyeOff v-else />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

interface Props {
  modelValue: string
  disabled?: boolean
  label?: string
  placeholder?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '密碼',
  placeholder: '請輸入密碼',
  id: 'password',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)

const inputId = computed(() => props.id || 'password')

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
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

.password-input {
  position: relative;
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
</style>

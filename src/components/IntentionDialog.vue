<template>
  <teleport to="body">
    <!-- Overlay backdrop -->
    <transition name="backdrop">
      <div v-if="isOpen" class="dialog-backdrop" @click="handleClose"></div>
    </transition>

    <!-- Dialog -->
    <transition name="dialog">
      <div v-if="isOpen" class="intention-dialog-wrapper">
        <div class="intention-dialog" @click.stop>
          <!-- Header -->
          <div class="dialog-header">
            <h2 class="dialog-title">意向对接</h2>
            <button class="close-btn" @click="handleClose" aria-label="关闭">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit" class="dialog-body">
            <!-- Contact Name -->
            <div class="form-group">
              <label class="form-label">
                联系人
                <span class="required">*</span>
              </label>
              <input 
                v-model="formData.contactName" 
                type="text" 
                class="form-input"
                placeholder="请输入联系人名称"
                required
              >
            </div>

            <!-- Contact Phone -->
            <div class="form-group">
              <label class="form-label">
                联系电话
                <span class="required">*</span>
              </label>
              <input 
                v-model="formData.contactPhone" 
                type="tel" 
                class="form-input"
                placeholder="请输入联系电话"
                required
              >
            </div>

            <!-- Intention Amount -->
            <div class="form-group">
              <label class="form-label">
                意向金额(万元)
              </label>
              <input 
                v-model="formData.intentionAmount" 
                type="number" 
                class="form-input"
                placeholder="请输入意向金额（非必填）"
              >
            </div>

            <!-- Intention Description -->
            <div class="form-group">
              <label class="form-label">
                意向说明
              </label>
              <textarea 
                v-model="formData.intentionDescription" 
                class="form-textarea"
                placeholder="请输入意向说明，如特殊需求等（非必填）"
                rows="4"
              ></textarea>
            </div>
          </form>

          <!-- Footer -->
          <div class="dialog-footer">
            <button @click="handleClose" class="btn btn-secondary">
              取消
            </button>
            <button @click="handleSubmit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="!isSubmitting">提交</span>
              <span v-else class="submitting-text">提交中...</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  vesselId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isOpen = ref(false)
const isSubmitting = ref(false)

const formData = ref({
  contactName: '',
  contactPhone: '',
  intentionAmount: '',
  intentionDescription: ''
})

// Watch for external updates to modelValue
const updateOpen = (value) => {
  isOpen.value = value
  if (!value) {
    resetForm()
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
  updateOpen(false)
}

const handleSubmit = async () => {
  // Validate required fields
  if (!formData.value.contactName.trim() || !formData.value.contactPhone.trim()) {
    console.log('[v0] 请填写必填项')
    return
  }

  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('[v0] 提交意向信息:', {
      ...formData.value,
      vesselId: props.vesselId
    })
    
    emit('submit', {
      ...formData.value,
      vesselId: props.vesselId
    })
    
    handleClose()
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    contactName: '',
    contactPhone: '',
    intentionAmount: '',
    intentionDescription: ''
  }
}

// Watch modelValue changes
watch(() => props.modelValue, (newVal) => {
  updateOpen(newVal)
}, { immediate: true })

import { watch } from 'vue'
</script>

<style scoped>
/* Backdrop Animation */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(4px);
}

/* Dialog Animation */
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.intention-dialog-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.intention-dialog {
  background: white;
  border-radius: 16px;
  /* width: 100%; */
  width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: dialogSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Header */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 28px 20px;
  border-bottom: 1px solid #F1F5F9;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
}

.dialog-title {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #94A3B8;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.close-btn:hover {
  background: #F1F5F9;
  color: #64748B;
  transform: rotate(90deg);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* Body */
.dialog-body {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: fadeInUp 0.4s ease-out;
}

.form-group:nth-child(1) {
  animation-delay: 0.05s;
}

.form-group:nth-child(2) {
  animation-delay: 0.1s;
}

.form-group:nth-child(3) {
  animation-delay: 0.15s;
}

.form-group:nth-child(4) {
  animation-delay: 0.2s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #EF4444;
  font-weight: 700;
}

.form-input,
.form-textarea {
  padding: 12px 14px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  font-size: 14px;
  color: #1E293B;
  background: white;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: #F0F9FF;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #CBD5E1;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Footer */
.dialog-footer {
  display: flex;
  gap: 12px;
  padding: 20px 28px 28px;
  border-top: 1px solid #F1F5F9;
  background: #FAFBFC;
}

.btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-secondary {
  background: white;
  color: #64748B;
  border: 1.5px solid #E2E8F0;
}

.btn-secondary:hover:not(:disabled) {
  background: #F8FAFC;
  border-color: #CBD5E1;
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submitting-text {
  display: inline-block;
}

/* Responsive */
@media (max-width: 480px) {
  .intention-dialog {
    max-width: calc(100vw - 32px);
    margin: 16px;
  }

  .dialog-header,
  .dialog-body,
  .dialog-footer {
    padding: 20px 16px;
  }

  .dialog-title {
    font-size: 18px;
  }

  .form-input,
  .form-textarea {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>

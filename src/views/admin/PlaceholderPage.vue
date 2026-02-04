<template>
  <div class="placeholder-page">
    <div class="placeholder-content">
      <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
      </svg>
      <h2 class="placeholder-title">{{ title }}</h2>
      <p class="placeholder-desc">{{ description }}</p>
      <button class="btn-back" @click="goBack">返回</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: {
    type: String,
    default: '功能开发中'
  },
  description: {
    type: String,
    default: '该功能正在开发中，敬请期待'
  }
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.placeholder-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.placeholder-content {
  text-align: center;
  max-width: 400px;
}

.placeholder-icon {
  width: 80px;
  height: 80px;
  color: #CBD5E1;
  margin-bottom: 24px;
}

.placeholder-title {
  font-size: 24px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 12px 0;
}

.placeholder-desc {
  font-size: 14px;
  color: #64748B;
  margin: 0 0 24px 0;
}

.btn-back {
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}
</style>

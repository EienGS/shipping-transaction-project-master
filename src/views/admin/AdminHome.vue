<template>
  <div class="admin-home">
    <div class="page-header">
      <h1 class="page-title">运营管理概览</h1>
      <p class="page-desc">实时监控平台运营数据，高效处理业务工单</p>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon trade">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.trade.pending }}</div>
          <div class="stat-label">待审核交易信息</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon repair">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="currentColor"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.repair.pending }}</div>
          <div class="stat-label">待审核修造信息</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon lease">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z" fill="currentColor"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.lease.pending }}</div>
          <div class="stat-label">待审核租赁信息</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon verification">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="currentColor"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.verification.pending }}</div>
          <div class="stat-label">待审核鉴证申请</div>
        </div>
      </div>
    </div>

    <!-- 待办事项 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">待办事项</h2>
        <span class="section-badge">{{ todoList.length }}</span>
      </div>
      <div class="todo-list">
        <div v-for="todo in todoList" :key="todo.id" class="todo-item" @click="goToTask(todo)">
          <div class="todo-type" :class="todo.type">{{ todo.typeName }}</div>
          <div class="todo-content">
            <div class="todo-title">{{ todo.title }}</div>
            <div class="todo-meta">
              <span class="todo-time">{{ todo.time }}</span>
              <span class="todo-submitter">{{ todo.submitter }}</span>
            </div>
          </div>
          <div class="todo-action">
            <button class="btn-handle">立即处理</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">快捷入口</h2>
      </div>
      <div class="quick-access-grid">
        <router-link
          v-for="access in quickAccess"
          :key="access.path"
          :to="access.path"
          class="access-card"
        >
          <div class="access-icon">{{ access.icon }}</div>
          <div class="access-label">{{ access.label }}</div>
          <div class="access-count" v-if="access.count">{{ access.count }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref({
  trade: {
    pending: 12
  },
  repair: {
    pending: 8
  },
  lease: {
    pending: 5
  },
  verification: {
    pending: 3
  }
})

const todoList = ref([
  {
    id: 1,
    type: 'trade',
    typeName: '交易审核',
    title: '某航运有限公司提交的散货船出售信息待审核',
    time: '10分钟前',
    submitter: '某航运有限公司',
    path: '/admin/trade/sale-audit'
  },
  {
    id: 2,
    type: 'repair',
    typeName: '修造审核',
    title: 'XX船厂提交的造船厂信息待审核',
    time: '30分钟前',
    submitter: 'XX船厂',
    path: '/admin/repair/shipyard-audit'
  },
  {
    id: 3,
    type: 'verification',
    typeName: '鉴证审核',
    title: '买卖双方提交的交易鉴证申请待审核',
    time: '1小时前',
    submitter: '某航运公司',
    path: '/admin/trade/verification-audit'
  },
  {
    id: 4,
    type: 'lease',
    typeName: '租赁审核',
    title: '某船东提交的期租信息待审核',
    time: '2小时前',
    submitter: '某船东',
    path: '/admin/lease/lease-audit'
  }
])

const quickAccess = ref([
  { icon: '📋', label: '交易信息审核', path: '/admin/trade/sale-audit', count: 12 },
  { icon: '💼', label: '成交信息管理', path: '/admin/trade/transaction', count: 0 },
  { icon: '🔒', label: '交易鉴证审核', path: '/admin/trade/verification-audit', count: 3 },
  { icon: '⚙️', label: '修造信息审核', path: '/admin/repair/design-audit', count: 8 },
  { icon: '🚢', label: '租赁信息审核', path: '/admin/lease/lease-audit', count: 5 },
  { icon: '📊', label: '数据统计', path: '/admin/statistics/trade', count: 0 }
])

const goToTask = (todo) => {
  console.log('[v0] 跳转至待办任务:', todo.title)
  router.push(todo.path)
}
</script>

<style scoped>
.admin-home {
  max-width: 1400px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #E2E8F0;
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.stat-icon.trade {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.repair {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.lease {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.verification {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}

/* 区块卡片 */
.section-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #E2E8F0;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #F1F5F9;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.section-badge {
  padding: 4px 12px;
  background: #EFF6FF;
  color: #667eea;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
}

/* 待办列表 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.3s;
}

.todo-item:hover {
  background: #EFF6FF;
  border-color: #667eea;
}

.todo-type {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.todo-type.trade {
  background: #EFF6FF;
  color: #667eea;
}

.todo-type.repair {
  background: #FEF3F2;
  color: #f5576c;
}

.todo-type.lease {
  background: #F0F9FF;
  color: #0EA5E9;
}

.todo-type.verification {
  background: #F0FDF4;
  color: #10B981;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 6px;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #64748B;
}

.todo-action {
  margin-left: auto;
}

.btn-handle {
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-handle:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

/* 快捷入口 */
.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.access-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: #F8FAFC;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
}

.access-card:hover {
  background: #EFF6FF;
  border-color: #667eea;
  transform: translateY(-2px);
}

.access-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.access-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-align: center;
}

.access-count {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  background: #EF4444;
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
}

@media (max-width: 968px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-access-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

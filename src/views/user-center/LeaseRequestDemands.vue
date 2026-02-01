<template>
  <div class="lease-request-demands-page">
    <div class="page-header">
      <div class="header-left">
        <h1>求租需求管理</h1>
      </div>
      <button class="btn-publish" @click="goToPublish">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        发布求租需求
      </button>
    </div>

    <div class="page-content">
      <!-- 筛选区 -->
      <div class="filter-bar">
        <div class="filter-group">
          <div class="filter-item">
            <label>状态筛选：</label>
            <select v-model="filterStatus" class="filter-select">
              <option value="">全部</option>
              <option value="pending">待审核</option>
              <option value="approved">已上架</option>
              <option value="offline">已下架</option>
              <option value="rejected">已驳回</option>
            </select>
          </div>

          <div class="filter-item">
            <label>租赁类型：</label>
            <select v-model="filterLeaseType" class="filter-select">
              <option value="">全部类型</option>
              <option value="time">期租</option>
              <option value="bareboat">光租</option>
              <option value="voyage">航次租船</option>
            </select>
          </div>
        </div>

        <div class="search-group">
          <input v-model="searchKeyword" type="text" class="search-input" placeholder="搜索需求标题..." />
        </div>
      </div>

      <!-- 需求列表 -->
      <div class="demands-grid">
        <div v-if="filteredDemands.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"/>
          </svg>
          <h3>暂无求租需求</h3>
          <p>开始发布求租需求，等待船东对接</p>
        </div>

        <div v-for="demand in filteredDemands" :key="demand.id" class="demand-card">
          <!-- 卡片内容 -->
          <div class="card-content" @click="viewDetail(demand.id)">
            <div class="title-row">
              <h3 class="demand-title">{{ demand.title }}</h3>
              <span class="status-badge" :class="`status-${demand.status}`">
                {{ statusLabels[demand.status] || demand.status }}
              </span>
            </div>
            
            <div class="demand-info">
              <div class="info-row">
                <span class="info-label">租赁类型：</span>
                <span class="info-value type-badge" :class="demand.leaseType">{{ getLeaseTypeLabel(demand.leaseType) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">船舶类型：</span>
                <span class="info-value">{{ demand.vesselType }}</span>
              </div>
              <div class="info-row" v-if="demand.dwtRange">
                <span class="info-label">载重吨范围：</span>
                <span class="info-value">{{ demand.dwtRange }}吨</span>
              </div>
              <div class="info-row" v-if="demand.dwtRequired">
                <span class="info-label">载重吨要求：</span>
                <span class="info-value">{{ demand.dwtRequired }}吨</span>
              </div>
              <div class="info-row">
                <span class="info-label">预算：</span>
                <span class="info-value price">¥{{ demand.budgetMin }}-{{ demand.budgetMax }}万</span>
              </div>
            </div>

            <div class="publish-info">
              <span class="publish-date">发布于 {{ demand.submitTime }}</span>
              <span v-if="demand.status === 'approved' && demand.intentionCount > 0" class="intention-count">
                {{ demand.intentionCount }} 个意向对接
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions">
            <button class="btn-action btn-detail" @click="viewDetail(demand.id)">
              查看详情
            </button>
            <button class="btn-action btn-edit" @click.stop="editDemand(demand.id)">
              编辑
            </button>
            <button 
              v-if="demand.status === 'approved'"
              class="btn-action btn-toggle"
              @click.stop="toggleStatus(demand.id, 'offline')">
              下架
            </button>
            <button 
              v-else-if="demand.status === 'offline'"
              class="btn-action btn-toggle active"
              @click.stop="toggleStatus(demand.id, 'approved')">
              上架
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑模态框 - 字段参考PublishLeaseDemand.vue -->
    <div v-if="editModalVisible" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>编辑求租需求</h2>
          <button class="close-btn" @click="closeEditModal">✕</button>
        </div>

        <div class="modal-body-wrapper">
          <p style="padding: 40px; text-align: center; color: #64748b;">编辑表单（字段参考PublishLeaseDemand.vue）</p>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="closeEditModal">取消</button>
          <button type="button" class="btn-save" @click="saveEdit">保存修改</button>
        </div>
      </div>
    </div>

    <!-- 上下架确认弹窗 -->
    <div v-if="toggleConfirmVisible" class="modal-overlay" @click.self="toggleConfirmVisible = false">
      <div class="modal-content small">
        <div class="modal-header">
          <h2>{{ toggleAction === 'offline' ? '下架确认' : '上架确认' }}</h2>
          <button class="close-btn" @click="toggleConfirmVisible = false">✕</button>
        </div>
        <div class="modal-body">
          <p>确定要{{ toggleAction === 'offline' ? '下架' : '上架' }}该求租需求吗？</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="toggleConfirmVisible = false">取消</button>
          <button class="btn-confirm" @click="confirmToggle">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选条件
const filterStatus = ref('')
const filterLeaseType = ref('')
const searchKeyword = ref('')

// 模态框状态
const editModalVisible = ref(false)
const toggleConfirmVisible = ref(false)
const currentDemandId = ref(null)
const toggleAction = ref('')

// 状态标签映射
const statusLabels = {
  pending: '待审核',
  approved: '已上架',
  offline: '已下架',
  rejected: '已驳回'
}

// 求租需求数据
const demands = ref([
  {
    id: 1,
    title: '长期期租5000吨散货船',
    leaseType: 'time',
    vesselType: '散货船',
    dwtRange: '3000-5000',
    budgetMin: 20,
    budgetMax: 30,
    status: 'approved',
    submitTime: '2026-01-18 09:30',
    intentionCount: 3
  },
  {
    id: 2,
    title: '航次租船需求',
    leaseType: 'voyage',
    vesselType: '油船',
    dwtRequired: 5000,
    budgetMin: 50,
    budgetMax: 80,
    status: 'approved',
    submitTime: '2026-01-22 14:15',
    intentionCount: 5
  },
  {
    id: 3,
    title: '光租集装箱船',
    leaseType: 'bareboat',
    vesselType: '集装箱船',
    dwtRange: '2000-3000',
    budgetMin: 15,
    budgetMax: 25,
    status: 'offline',
    submitTime: '2026-01-10 11:00',
    intentionCount: 0
  }
])

// 筛选后的需求
const filteredDemands = computed(() => {
  return demands.value.filter(demand => {
    if (filterStatus.value && demand.status !== filterStatus.value) return false
    if (filterLeaseType.value && demand.leaseType !== filterLeaseType.value) return false
    if (searchKeyword.value && !demand.title.includes(searchKeyword.value)) return false
    return true
  })
})

// 获取租赁类型标签
const getLeaseTypeLabel = (type) => {
  const labels = { time: '期租', bareboat: '光租', voyage: '航次租船' }
  return labels[type] || type
}

// 查看详情
const viewDetail = (id) => {
  console.log('[v0] 查看详情:', id)
}

// 编辑需求
const editDemand = (id) => {
  console.log('[v0] 编辑求租需求:', id)
  currentDemandId.value = id
  editModalVisible.value = true
}

// 关闭编辑模态框
const closeEditModal = () => {
  editModalVisible.value = false
}

// 跳转到发布求租页面
const goToPublish = () => {
  router.push('/vessel-leasing/publish-lease-demand')
}

// 保存编辑
const saveEdit = () => {
  console.log('[v0] 保存编辑')
  editModalVisible.value = false
}

// 切换上下架
const toggleStatus = (id, action) => {
  currentDemandId.value = id
  toggleAction.value = action
  toggleConfirmVisible.value = true
}

// 确认上下架
const confirmToggle = () => {
  const demand = demands.value.find(d => d.id === currentDemandId.value)
  if (demand) {
    demand.status = toggleAction.value
  }
  toggleConfirmVisible.value = false
}
</script>

<style scoped>
.lease-request-demands-page {
  min-height: 100vh;
  background: white;
}

.page-header {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.header-left p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.btn-publish {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-publish:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.btn-publish svg {
  width: 18px;
  height: 18px;
}

.page-content {
  margin: 0 auto;
}

/* 筛选区 */
.filter-bar {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover,
.filter-select:focus {
  border-color: #0ea5e9;
  outline: none;
}

.search-group {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

/* 需求网格 */
.demands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  color: #cbd5e1;
  margin: 0 auto 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

/* 需求卡片 */
.demand-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.demand-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.status-offline {
  background: #e5e7eb;
  color: #374151;
}

.status-badge.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

.card-content {
  padding: 16px;
  flex: 1;
  cursor: pointer;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.demand-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  flex: 1;
}

.demand-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
}

.info-label {
  color: #64748b;
  font-weight: 500;
  min-width: 80px;
}

.info-value {
  color: #1e293b;
  font-weight: 500;
}

.info-value.price {
  color: #ef4444;
  font-weight: 700;
}

.info-value.type-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.type-badge.time {
  background: #dbeafe;
  color: #1e40af;
}

.type-badge.bareboat {
  background: #fef3c7;
  color: #92400e;
}

.type-badge.voyage {
  background: #e0e7ff;
  color: #3730a3;
}

.publish-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  font-size: 12px;
}

.publish-date {
  color: #94a3b8;
}

.intention-count {
  color: #0ea5e9;
  font-weight: 600;
}

.card-actions {
  padding: 12px 16px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 8px;
}

.btn-action {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-detail {
  background: #eff6ff;
  color: #1e40af;
}

.btn-detail:hover {
  background: #dbeafe;
}

.btn-edit {
  background: #f0fdf4;
  color: #15803d;
}

.btn-edit:hover {
  background: #dcfce7;
}

.btn-toggle {
  background: #fef2f2;
  color: #b91c1c;
}

.btn-toggle:hover {
  background: #fee2e2;
}

.btn-toggle.active {
  background: #eff6ff;
  color: #1e40af;
}

.btn-toggle.active:hover {
  background: #dbeafe;
}

/* 模态框样式 */
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
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 900px;
  width: 100%;
}

.modal-content.small {
  max-width: 480px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #0f172a;
}

.modal-body-wrapper {
  padding: 24px;
  max-height: calc(90vh - 180px);
  overflow-y: auto;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  font-size: 15px;
  color: #475569;
  margin: 0;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save,
.btn-confirm {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.btn-cancel:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-save,
.btn-confirm {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-save:hover,
.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}
</style>

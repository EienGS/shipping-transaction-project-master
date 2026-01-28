<template>
  <div class="intention-container">
    <!-- Search & Filter Section -->
    <div class="search-filter-section">
      <div class="header-content">
        <h1 class="page-title">交易意向</h1>
      </div>

      <div class="search-card">
        <div class="search-main-row">
          <div class="search-input-group">
            <div class="input-with-icon">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="搜索意向编号、对方信息..."
                class="modern-input"
                @input="applyFilters"
              >
            </div>
          </div>

          <div class="filter-group">
            <div class="select-item">
              <span class="select-label">状态</span>
              <select v-model="filterStatus" @change="applyFilters" class="modern-select">
                <option value="">全部状态</option>
                <option value="pending">待处理</option>
                <option value="accepted">已接受</option>
                <option value="rejected">已拒绝</option>
              </select>
            </div>

            <div class="select-item">
              <span class="select-label">日期范围</span>
              <input v-model="dateStart" type="date" @change="applyFilters" class="modern-date">
              <span class="date-separator">至</span>
              <input v-model="dateEnd" type="date" @change="applyFilters" class="modern-date">
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn-reset-new" @click="resetFilters">重置</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs-section">
      <div class="tabs-container">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          class="tab-button"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key; currentPage = 1"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Intentions Grid -->
    <div class="intentions-grid">
      <div 
        v-for="intention in paginatedIntentions" 
        :key="intention.id" 
        class="intention-card"
        @click="navigateToDetail(intention)"
      >
        <div class="card-content">
          <div class="card-header">
            <div class="title-section">
              <h3 class="card-title">{{ intention.type }}: {{ intention.title }}</h3>
              <span class="status-label" :class="`status-${intention.status}`">
                {{ getStatusLabel(intention.status) }}
              </span>
            </div>
          </div>

          <div class="card-info">
            <div class="info-item">
              <span class="info-label">意向编号</span>
              <span class="info-value">{{ intention.intentionNo }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">对方</span>
              <span class="info-value">{{ intention.counterparty }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">时间</span>
              <span class="info-value">{{ intention.submitTime }}</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="action-buttons-group">
            <!-- Received Intentions -->
            <template v-if="activeTab === 'received'">
              <button class="btn-detail" @click.stop="viewDetail(intention.id)">查看详情</button>
              <template v-if="intention.status === 'pending'">
                <button class="btn-accept" @click.stop="handleAccept(intention.id)">接受</button>
                <button class="btn-reject" @click.stop="handleReject(intention.id)">拒绝</button>
              </template>
            </template>

            <!-- Sent Intentions -->
            <template v-else>
              <button class="btn-detail" @click.stop="viewDetail(intention.id)">查看详情</button>
            </template>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredIntentions.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>暂无数据</h3>
        <p>还没有{{ activeTab === 'received' ? '收到的' : '发出的' }}意向</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredIntentions.length > 0" class="pagination-section">
      <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
      <div class="page-numbers">
        <button 
          v-for="page in displayPages" 
          :key="page" 
          class="page-num"
          :class="{ active: page === currentPage, ellipsis: page === '...' }"
          @click="currentPage = page"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>
      </div>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
      <div class="page-info">共 {{ filteredIntentions.length }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页</div>
    </div>

    <!-- Detail Modal -->
    <div v-if="detailVisible" class="modal-overlay" @click.self="detailVisible = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>意向详情</h2>
          <button class="close-btn" @click="detailVisible = false">✕</button>
        </div>

        <div class="modal-body">
          <div class="detail-section">
            <h3>意向信息</h3>
            <div class="detail-row">
              <span class="detail-label">意向编号</span>
              <span class="detail-value">{{ selectedIntention?.intentionNo }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">对方信息</span>
              <span class="detail-value">{{ selectedIntention?.counterparty }} ({{ selectedIntention?.phone }})</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">意向金额</span>
              <span class="detail-value">{{ selectedIntention?.amount }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">提交时间</span>
              <span class="detail-value">{{ selectedIntention?.submitTime }}</span>
            </div>
          </div>

          <div v-if="activeTab === 'received' && selectedIntention?.status !== 'pending'" class="detail-section">
            <h3>对接信息</h3>
            <div class="detail-row">
              <span class="detail-label">对接结果</span>
              <span class="detail-value">{{ getStatusLabel(selectedIntention?.status) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">对接时间</span>
              <span class="detail-value">{{ selectedIntention?.dockingTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// States
const activeTab = ref('received')
const searchKeyword = ref('')
const filterStatus = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const currentPage = ref(1)
const detailVisible = ref(false)
const selectedIntention = ref(null)
const pageSize = 12

const tabs = [
  { key: 'received', label: '收到的意向' },
  { key: 'sent', label: '发出的意向' }
]

// Mock data for received intentions
const receivedIntentions = ref([
  { id: 1, type: '求购', title: '求购散货船', intentionNo: 'G20250126000001', counterparty: '张思布', phone: '13900099882', amount: '220万元', submitTime: '2026-02-05 15:52:18', status: 'pending', vesselId: 1 },
  { id: 2, type: '求购', title: '求购油轮', intentionNo: 'G20250126000002', counterparty: '李明', phone: '13800138000', amount: '320万元', submitTime: '2026-02-06 10:30:22', status: 'accepted', vesselId: 2, dockingTime: '2026-02-06 14:20:00' },
  { id: 3, type: '出售', title: '出售集装箱船', intentionNo: 'G20250126000003', counterparty: '王强', phone: '13700137000', amount: '850万元', submitTime: '2026-02-07 09:15:45', status: 'rejected', vesselId: 3, dockingTime: '2026-02-07 16:40:00' },
  { id: 4, type: '求购', title: '求购LNG船', intentionNo: 'G20250126000004', counterparty: '刘洋', phone: '13600136000', amount: '1200万元', submitTime: '2026-02-08 14:25:30', status: 'pending', vesselId: 4 },
  { id: 5, type: '求购', title: '求购化学品船', intentionNo: 'G20250126000005', counterparty: '陈浩', phone: '13500135000', amount: '180万元', submitTime: '2026-02-09 11:50:15', status: 'accepted', vesselId: 5, dockingTime: '2026-02-09 15:30:00' }
])

// Mock data for sent intentions
const sentIntentions = ref([
  { id: 101, type: '求购', title: '寻求散货船合作', intentionNo: 'F20250126000001', counterparty: '张董', phone: '13900099882', amount: '400万元', submitTime: '2026-02-05 13:20:00', status: 'pending', purchaseId: 1 },
  { id: 102, type: '出售', title: '出售优质集装箱船', intentionNo: 'F20250126000002', counterparty: '李先生', phone: '13800138000', amount: '750万元', submitTime: '2026-02-06 08:45:30', status: 'accepted', purchaseId: 2, dockingTime: '2026-02-06 13:15:00' },
  { id: 103, type: '求购', title: '急需油轮资源', intentionNo: 'F20250126000003', counterparty: '王总', phone: '13700137000', amount: '500万元', submitTime: '2026-02-07 16:30:20', status: 'pending', purchaseId: 3 }
])

// Computed properties
const allIntentions = computed(() => activeTab.value === 'received' ? receivedIntentions.value : sentIntentions.value)

const filteredIntentions = computed(() => {
  let result = allIntentions.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(i =>
      i.intentionNo.toLowerCase().includes(keyword) ||
      i.counterparty.toLowerCase().includes(keyword) ||
      i.title.toLowerCase().includes(keyword)
    )
  }

  if (filterStatus.value) {
    result = result.filter(i => i.status === filterStatus.value)
  }

  if (dateStart.value) {
    result = result.filter(i => i.submitTime >= dateStart.value)
  }
  if (dateEnd.value) {
    result = result.filter(i => i.submitTime <= dateEnd.value + ' 23:59:59')
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredIntentions.value.length / pageSize))

const paginatedIntentions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredIntentions.value.slice(start, end)
})

const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
})

// Methods
const getStatusLabel = (status) => {
  const labels = { pending: '待处理', accepted: '已接受', rejected: '已拒绝' }
  return labels[status] || status
}

const applyFilters = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  dateStart.value = ''
  dateEnd.value = ''
  currentPage.value = 1
}

const viewDetail = (id) => {
  const intention = allIntentions.value.find(i => i.id === id)
  selectedIntention.value = intention
  detailVisible.value = true
}

const navigateToDetail = (intention) => {
  if (activeTab.value === 'received' && intention.vesselId) {
    router.push(`/shipping-trade/vessel/${intention.vesselId}`)
  } else if (activeTab.value === 'sent' && intention.purchaseId) {
    router.push(`/shipping-trade/purchase/${intention.purchaseId}`)
  }
}

const handleAccept = (id) => {
  console.log('[v0] 接受意向:', id)
  const intention = receivedIntentions.value.find(i => i.id === id)
  if (intention) {
    intention.status = 'accepted'
    intention.dockingTime = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-')
  }
}

const handleReject = (id) => {
  console.log('[v0] 拒绝意向:', id)
  const intention = receivedIntentions.value.find(i => i.id === id)
  if (intention) {
    intention.status = 'rejected'
    intention.dockingTime = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-')
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.intention-container {
  padding: 24px;
  background: #F8FAFC;
  min-height: 100vh;
}

/* Search & Filter Section */
.search-filter-section {
  margin-bottom: 28px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.5px;
}

.search-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-main-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.search-input-group {
  flex: 1;
}

.input-with-icon {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #64748B;
  pointer-events: none;
}

.modern-input {
  width: 100%;
  padding: 11px 14px 11px 38px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background-color: #FFFFFF;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.modern-input:hover {
  border-color: #94A3B8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.modern-input:focus {
  outline: none;
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.08);
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.select-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.select-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.modern-select,
.modern-date {
  padding: 10px 12px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background-color: #FFFFFF;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.modern-select:hover,
.modern-date:hover {
  border-color: #94A3B8;
}

.modern-select:focus,
.modern-date:focus {
  outline: none;
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.08);
}

.date-separator {
  padding: 0 8px;
  color: #94A3B8;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-reset-new {
  padding: 10px 20px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background-color: #FFFFFF;
  color: #64748B;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-reset-new:hover {
  background-color: #F8FAFC;
  border-color: #94A3B8;
}

/* Tabs Section */
.tabs-section {
  background: #FFFFFF;
  border-bottom: 2px solid #E2E8F0;
  margin: 0 -24px 28px -24px;
  padding: 0 24px;
}

.tabs-container {
  display: flex;
  gap: 0;
  max-width: 1400px;
  margin: 0 auto;
}

.tab-button {
  padding: 14px 24px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #0EA5E9;
}

.tab-button.active {
  color: #0EA5E9;
  font-weight: 600;
  border-bottom-color: #0EA5E9;
}

/* Intentions Grid */
.intentions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.intention-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.intention-card:hover {
  border-color: #0EA5E9;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.12);
  transform: translateY(-4px);
}

.card-content {
  padding: 20px;
  flex: 1;
}

.card-header {
  margin-bottom: 16px;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.status-label {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.status-pending {
  background: #FEF3C7;
  color: #D97706;
}

.status-accepted {
  background: #D1FAE5;
  color: #059669;
}

.status-rejected {
  background: #FEE2E2;
  color: #DC2626;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.info-label {
  color: #64748B;
  font-weight: 500;
}

.info-value {
  color: #0F172A;
  font-weight: 600;
  text-align: right;
}

.card-footer {
  padding: 12px 20px;
  border-top: 1px solid #E2E8F0;
  background: #F8FAFC;
}

.action-buttons-group {
  display: flex;
  gap: 10px;
}

.btn-detail,
.btn-accept,
.btn-reject {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-detail {
  background: #F1F5F9;
  color: #475569;
  border: 1px solid #E2E8F0;
}

.btn-detail:hover {
  background: #E2E8F0;
  border-color: #CBD5E1;
}

.btn-accept {
  background: #10B981;
  color: white;
}

.btn-accept:hover {
  background: #059669;
}

.btn-reject {
  background: #EF4444;
  color: white;
}

.btn-reject:hover {
  background: #DC2626;
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

/* Pagination */
.pagination-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 12px;
}

.page-btn {
  padding: 10px 20px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #0EA5E9;
  color: #0EA5E9;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-num {
  min-width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.page-num:hover:not(.ellipsis):not(:disabled) {
  border-color: #0EA5E9;
  color: #0EA5E9;
}

.page-num.active {
  background: #0EA5E9;
  color: white;
  border-color: #0EA5E9;
}

.page-num.ellipsis {
  cursor: default;
  border: none;
  color: #94A3B8;
}

.page-info {
  font-size: 14px;
  color: #64748B;
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
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #E2E8F0;
  position: sticky;
  top: 0;
  background: white;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #94A3B8;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #0F172A;
}

.modal-body {
  padding: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #E2E8F0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F1F5F9;
  font-size: 14px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #64748B;
  font-weight: 500;
}

.detail-value {
  color: #0F172A;
  font-weight: 600;
  text-align: right;
}

@media (max-width: 1024px) {
  .search-main-row {
    flex-wrap: wrap;
  }

  .search-input-group {
    flex: 1 1 100%;
  }

  .filter-group {
    flex: 1 1 100%;
  }

  .intentions-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .intention-container {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .search-card {
    padding: 16px;
  }

  .search-main-row {
    flex-direction: column;
    gap: 12px;
  }

  .filter-group {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .select-item {
    width: 100%;
  }

  .modern-select,
  .modern-date {
    width: 100%;
  }

  .action-buttons {
    width: 100%;
  }

  .btn-reset-new {
    width: 100%;
  }

  .intentions-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons-group {
    flex-wrap: wrap;
  }

  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .pagination-section {
    flex-wrap: wrap;
  }
}
</style>

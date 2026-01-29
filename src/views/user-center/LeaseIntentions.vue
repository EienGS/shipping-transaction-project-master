<template>
  <div class="intention-container">
    <!-- Search & Filter Section -->
    <div class="search-filter-section">
      <div class="header-content">
        <h1 class="page-title">租赁意向</h1>
      </div>

      <div class="search-card">
        <div class="search-main-row">
          <div class="search-input-group">
            <div class="input-with-icon">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input v-model="searchKeyword" type="text" placeholder="搜索意向编号、对方信息..." class="modern-input"
                @input="applyFilters">
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
              <span class="select-label">开始日期</span>
              <input v-model="dateStart" type="date" @change="applyFilters" class="modern-date">
            </div>

            <div class="select-item">
              <span class="select-label">结束日期</span>
              <input v-model="dateEnd" type="date" @change="applyFilters" class="modern-date">
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn-reset-new" @click="resetFilters">重置</button>
            <button class="btn-search-new" @click="applyFilters">查询</button>
          </div>
        </div>

        <div v-if="hasActiveFilters" class="tags-container">
          <span class="tags-label">当前筛选：</span>
          <div class="tags-list">
            <span v-if="searchKeyword" class="modern-tag">
              关键词: {{ searchKeyword }}
              <i @click="searchKeyword = ''; applyFilters()">✕</i>
            </span>
            <span v-if="filterStatus" class="modern-tag">
              状态: {{ getStatusLabel(filterStatus) }}
              <i @click="filterStatus = ''; applyFilters()">✕</i>
            </span>
            <span v-if="dateStart" class="modern-tag">
              开始: {{ dateStart }}
              <i @click="dateStart = ''; applyFilters()">✕</i>
            </span>
            <span v-if="dateEnd" class="modern-tag">
              结束: {{ dateEnd }}
              <i @click="dateEnd = ''; applyFilters()">✕</i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs-section">
      <div class="tabs-container">
        <button v-for="tab in tabs" :key="tab.key" class="tab-button" :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key; currentPage = 1">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Intentions Grid -->
    <div class="intentions-grid">
      <div v-for="intention in paginatedIntentions" :key="intention.id" class="intention-card"
        @click="navigateToDetail(intention)">
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
              <!-- Show monitoring button for accepted 租赁 intentions -->
              <template v-else-if="intention.status === 'accepted' && intention.type === '租赁'">
                <button v-if="!intention.monitoringInitiated" class="btn-monitor"
                  @click.stop="handleInitiateMonitoring(intention.id, intention)">
                  发起租后监测
                </button>
                <button v-else class="btn-monitor-center" @click.stop="goToMonitoringCenter(intention.id)">
                  前往租后监测中心
                </button>
              </template>
            </template>

            <!-- Sent Intentions -->
            <template v-else>
              <button class="btn-detail" @click.stop="viewDetail(intention.id)">查看详情</button>
              <!-- Show monitoring button for accepted 求租 intentions -->
              <template v-if="intention.status === 'accepted' && intention.type === '求租'">
                <button v-if="!intention.monitoringInitiated" class="btn-monitor"
                  @click.stop="handleInitiateMonitoring(intention.id, intention)">
                  发起租后监测
                </button>
                <button v-else class="btn-monitor-center" @click.stop="goToMonitoringCenter(intention.id)">
                  前往租后监测中心
                </button>
              </template>
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
        <button v-for="page in displayPages" :key="page" class="page-num"
          :class="{ active: page === currentPage, ellipsis: page === '...' }" @click="currentPage = page"
          :disabled="page === '...'">
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
              <span class="detail-value">{{ selectedIntention?.counterparty }} ({{
                selectedIntention?.phone
              }})</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">租金</span>
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

    <!-- Monitoring Confirmation Dialog -->
    <div v-if="monitoringConfirmVisible" class="modal-overlay" @click.self="monitoringConfirmVisible = false">
      <div class="modal-content confirmation-dialog">
        <div class="modal-header">
          <h2>发起租后监测申请</h2>
          <button class="close-btn" @click="monitoringConfirmVisible = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="confirm-message">是否确认发起租后监测申请？</p>
          <p class="confirm-subtitle">申请提交后，将进入租后监测流程</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="monitoringConfirmVisible = false">取消</button>
          <button class="btn-confirm" @click="confirmMonitoringInitiation">确认</button>
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
const itemsPerPage = 6
const detailVisible = ref(false)
const selectedIntention = ref(null)
const monitoringConfirmVisible = ref(false)
const pendingMonitoringIntention = ref(null)

// Mock data
const receivedIntentions = ref([
  { id: 1, type: '求租', title: '5000吨散货船期租', intentionNo: 'Z2026010100001', counterparty: '张某 (13900099882)', status: 'pending', submitTime: '2026-02-05', amount: '10万元/月', phone: '13900099882', demandId: 101, dockingTime: '', monitoringInitiated: false },
  { id: 2, type: '求租', title: '集装箱船光租', intentionNo: 'Z2026010100002', counterparty: '李某 (13800077766)', status: 'accepted', submitTime: '2026-02-03', amount: '15万元/月', phone: '13800077766', demandId: 102, dockingTime: '2026-02-05 15:52:18', monitoringInitiated: false },
  { id: 3, type: '求租', title: '油船航次租船', intentionNo: 'Z2026010100003', counterparty: '王某 (13700055544)', status: 'rejected', submitTime: '2026-01-30', amount: '8万元/航次', phone: '13700055544', demandId: 103, dockingTime: '', monitoringInitiated: false },
  { id: 4, type: '租赁', title: '散货船 "OCEAN STAR" 期租', intentionNo: 'Z2026010100004', counterparty: '陈某 (13600033322)', status: 'pending', submitTime: '2026-02-04', amount: '12万元/月', phone: '13600033322', vesselId: 1, dockingTime: '', monitoringInitiated: false },
  { id: 5, type: '求租', title: '好望角型散货船期租', intentionNo: 'Z2026010100005', counterparty: '周某 (13500011100)', status: 'pending', submitTime: '2026-02-02', amount: '20万元/月', phone: '13500011100', demandId: 104, dockingTime: '', monitoringInitiated: false },
  { id: 6, type: '租赁', title: '化学品油轮 "SEA DRAGON" 光租', intentionNo: 'Z2026010100006', counterparty: '何某 (13900099882)', status: 'accepted', submitTime: '2026-02-01', amount: '18万元/月', phone: '13900099882', vesselId: 2, dockingTime: '2026-02-04 10:30:00', monitoringInitiated: false }
])

const sentIntentions = ref([
  { id: 101, type: '求租', title: '5.7万吨散货船期租', intentionNo: 'Z2026010100007', counterparty: '江某 (13400099999)', status: 'pending', submitTime: '2026-02-05', amount: '11万元/月', phone: '13400099999', vesselId: 1, dockingTime: '', monitoringInitiated: false },
  { id: 102, type: '租赁', title: '集装箱船 "PACIFIC LINK" 光租', intentionNo: 'Z2026010100008', counterparty: '赵某 (13300088888)', status: 'accepted', submitTime: '2026-02-03', amount: '16万元/月', phone: '13300088888', vesselId: 2, dockingTime: '2026-02-04', monitoringInitiated: false },
  { id: 103, type: '求租', title: '油船航次租船', intentionNo: 'Z2026010100009', counterparty: '孙某 (13200077777)', status: 'pending', submitTime: '2026-02-02', amount: '9万元/航次', phone: '13200077777', vesselId: 3, dockingTime: '', monitoringInitiated: false }
])

// Tab data
const tabs = [
  { key: 'received', label: '收到的意向' },
  { key: 'sent', label: '发出的意向' }
]

// Computed
const currentIntentions = computed(() => {
  return activeTab.value === 'received' ? receivedIntentions.value : sentIntentions.value
})

const filteredIntentions = computed(() => {
  let result = currentIntentions.value

  if (searchKeyword.value) {
    result = result.filter(i =>
      i.intentionNo.includes(searchKeyword.value) ||
      i.counterparty.includes(searchKeyword.value) ||
      i.title.includes(searchKeyword.value)
    )
  }

  if (filterStatus.value) {
    result = result.filter(i => i.status === filterStatus.value)
  }

  if (dateStart.value) {
    result = result.filter(i => i.submitTime >= dateStart.value)
  }

  if (dateEnd.value) {
    result = result.filter(i => i.submitTime <= dateEnd.value)
  }

  return result
})

const hasActiveFilters = computed(() => {
  return searchKeyword.value || filterStatus.value || dateStart.value || dateEnd.value
})

const totalPages = computed(() => Math.ceil(filteredIntentions.value.length / itemsPerPage))

const paginatedIntentions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredIntentions.value.slice(start, start + itemsPerPage)
})

const displayPages = computed(() => {
  const pages = []
  const maxShow = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxShow / 2))
  let end = Math.min(totalPages.value, start + maxShow - 1)

  if (end - start < maxShow - 1) {
    start = Math.max(1, end - maxShow + 1)
  }

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < totalPages.value) {
    if (end < totalPages.value - 1) pages.push('...')
    pages.push(totalPages.value)
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
  applyFilters()
}

const viewDetail = (id) => {
  console.log('[v0] 查看详情:', id)
  const intention = currentIntentions.value.find(i => i.id === id)
  selectedIntention.value = intention
  detailVisible.value = true
}

const navigateToDetail = (intention) => {
  if (intention.type === '租赁') {
    router.push(`/vessel-leasing/idle/${intention.vesselId}`)
  } else {
    router.push(`/vessel-leasing/demand/${intention.demandId}`)
  }
}

const handleAccept = (id) => {
  console.log('[v0] 接受意向:', id)
  const intention = receivedIntentions.value.find(i => i.id === id)
  if (intention) {
    intention.status = 'accepted'
    intention.dockingTime = new Date().toLocaleString('zh-CN')
  }
}

const handleReject = (id) => {
  console.log('[v0] 拒绝意向:', id)
  const intention = receivedIntentions.value.find(i => i.id === id)
  if (intention) {
    intention.status = 'rejected'
    intention.dockingTime = new Date().toLocaleString('zh-CN')
  }
}

const handleInitiateMonitoring = (id, intention) => {
  console.log('[v0] 发起租后监测:', id, intention)
  pendingMonitoringIntention.value = intention
  monitoringConfirmVisible.value = true
}

const confirmMonitoringInitiation = () => {
  console.log('[v0] 确认发起租后监测:', pendingMonitoringIntention.value)

  if (pendingMonitoringIntention.value) {
    const intention = [...receivedIntentions.value, ...sentIntentions.value].find(
      i => i.id === pendingMonitoringIntention.value.id
    )
    if (intention) {
      intention.monitoringInitiated = true
    }
  }

  monitoringConfirmVisible.value = false
  pendingMonitoringIntention.value = null
}

const goToMonitoringCenter = (id) => {
  console.log('[v0] 前往租后监测中心:', id)
  router.push('/user-center/monitoring')
}
</script>

<style scoped>
/* Main Container */
.lease-intentions-page {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #F8FAFC 0%, #EFF6FF 50%, #F0F9FF 100%);
  padding: 32px 24px;
}

.page-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Header */
.header-content {
  margin-bottom: 24px;
}

.header-content h1 {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #0F172A 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
}

.page-header p {
  font-size: 14px;
  color: #64748B;
  margin: 0;
  font-weight: 500;
}

/* Search Card */
.search-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #F1F5F9;
}

.search-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-end;
}

.search-main-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.search-input-group {
  flex: 1;
  min-width: 200px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
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

/* Filter Group */
.filter-group {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.select-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
}

.select-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.modern-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23475569' d='M8 11L3 6h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 30px;
}

.modern-select:hover,
.modern-date:hover {
  border-color: #94A3B8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

/* Action Buttons */
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-search-new {
  padding: 10px 24px;
  background: linear-gradient(135deg, #0EA5E9, #06B6D4);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
}

.btn-search-new:hover {
  background: linear-gradient(135deg, #0284C7, #0891B2);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  transform: translateY(-2px);
}

.btn-search-new:active {
  transform: translateY(0);
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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

.btn-monitor {
  background: linear-gradient(135deg, #8B5CF6, #9D66FD);
  color: white;
  border: none;
  border-radius: 6px;
  flex: 1;
}

.btn-monitor:hover {
  background: linear-gradient(135deg, #7C3AED, #8B5CF6);
}

.btn-monitor-center {
  background: linear-gradient(135deg, #06B6D4, #08B0D0);
  color: white;
  border: none;
  border-radius: 6px;
  flex: 1;
}

.btn-monitor-center:hover {
  background: linear-gradient(135deg, #08B0D0, #06B6D4);
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
  z-index: 1000;
  padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
  display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #E2E8F0;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
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

/* Modal Footer */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #E2E8F0;
  background: #F8FAFC;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 10px 20px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #F1F5F9;
  border-color: #CBD5E1;
}

.btn-confirm {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #0EA5E9;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-confirm:hover {
  background: #0284C7;
}

.confirmation-dialog {
  max-width: 400px;
}

.confirm-message {
  font-size: 15px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.confirm-subtitle {
  font-size: 13px;
  color: #64748B;
  margin: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 64px 24px;
  color: #94A3B8;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.5;
}
</style>

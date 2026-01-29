<template>
  <div class="monitoring-center-container">
    <div class="page-content">
      <!-- Page Header -->
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">租后监测中心</h1>
          <p class="page-subtitle">实时监控租赁船舶位置与状态</p>
          <span class="stats-badge">共 {{ filteredMonitorings.length }} 条监测记录</span>
        </div>
        <button class="btn-dashboard" @click="openDashboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          前往监测台
        </button>
      </div>

      <!-- Search & Filter Card -->
      <div class="search-filter-section">
        <div class="search-card">
          <div class="search-main-row">
            <div class="search-input-wrapper">
              <div class="input-with-icon">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input v-model="searchKeyword" type="text" class="modern-input" placeholder="搜索监测编号、船舶名称..." />
              </div>
            </div>

            <div class="filter-controls-inline">
              <div class="select-item">
                <label>状态</label>
                <select v-model="filterStatus" class="modern-select">
                  <option value="">全部状态</option>
                  <option value="unapplied">未申请</option>
                  <option value="waiting">等待申请</option>
                  <option value="applying">申请中</option>
                  <option value="active">监测中</option>
                  <option value="expired">已到期</option>
                  <option value="rejected">已驳回</option>
                </select>
              </div>

              <div class="select-item">
                <label>开始日期</label>
                <input v-model="dateStart" type="date" class="modern-date" />
              </div>

              <div class="select-item">
                <label>结束日期</label>
                <input v-model="dateEnd" type="date" class="modern-date" />
              </div>

              <div class="action-buttons">
                <button class="btn-reset-new" @click="resetFilters">重置</button>
                <button class="btn-search-new" @click="applyFilters">搜索</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-section">
        <div class="tabs-container">
          <button class="tab-button" :class="{ active: currentTab === 'lessor' }" @click="currentTab = 'lessor'">
            我出租的
          </button>
          <button class="tab-button" :class="{ active: currentTab === 'lessee' }" @click="currentTab = 'lessee'">
            我承租的
          </button>
        </div>
      </div>

      <!-- Monitoring Cards Grid -->
      <div class="monitoring-grid">
        <div v-for="monitoring in filteredMonitorings" :key="monitoring.id" class="monitoring-card">
          <div class="card-header">
            <div class="header-row">
              <h3 class="card-title">{{ monitoring.vesselName }}</h3>
              <span class="status-badge" :class="`status-${monitoring.status}`">
                {{ getStatusLabel(monitoring.status) }}
              </span>
            </div>
            <p class="monitoring-no">监测编号: {{ monitoring.monitoringNo }}</p>
          </div>

          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">出租方</span>
                <span class="info-value">{{ monitoring.lessor }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">承租方</span>
                <span class="info-value">{{ monitoring.lessee }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">监测期限</span>
                <span class="info-value">{{ monitoring.monitoringPeriod }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">租赁期限</span>
                <span class="info-value">{{ monitoring.leasePeriod }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">申请时间</span>
                <span class="info-value">{{ monitoring.applyTime }}</span>
              </div>
              <div class="info-item" v-if="monitoring.status === 'active'">
                <span class="info-label">剩余天数</span>
                <span class="info-value highlight">{{ monitoring.remainingDays }} 天</span>
              </div>
            </div>

            <div v-if="monitoring.lastPosition" class="position-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div class="position-text">
                <span class="position-label">最新位置</span>
                <span class="position-value">{{ monitoring.lastPosition }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button v-if="monitoring.status !== 'unapplied'" class="btn-detail"
              :class="{ 'disabled': monitoring.status === 'waiting' }" :disabled="monitoring.status === 'waiting'"
              @click="monitoring.status !== 'waiting' && viewDetail(monitoring)">
              查看详情
            </button>
            <button v-if="monitoring.status === 'active'" class="btn-track" @click="trackVessel(monitoring)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              实时跟踪
            </button>
            <button v-if="monitoring.status === 'unapplied' && currentTab === 'lessor'" class="btn-apply"
              @click="openApplicationModal(monitoring)">
              申请监测
            </button>
            <button v-if="monitoring.status === 'rejected' && currentTab === 'lessor'" class="btn-reapply"
              @click="openApplicationModal(monitoring)">
              重新申请
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMonitorings.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p>暂无监测记录</p>
      </div>

      <!-- Application Modal -->
      <div v-if="applicationModalVisible" class="modal-overlay" @click.self="closeApplicationModal">
        <div class="modal-content large">
          <div class="modal-header">
            <h2>申请租后监测</h2>
            <button class="close-btn" @click="closeApplicationModal">✕</button>
          </div>
          <div class="modal-body-wrapper">
            <form @submit.prevent="submitApplication" class="application-form">
              <div class="form-section">
                <h3>船舶信息</h3>
                <div class="form-grid">
                  <div class="form-item">
                    <label>船舶名称</label>
                    <input v-model="applicationForm.vesselName" type="text" class="form-input" readonly />
                  </div>
                  <div class="form-item">
                    <label>出租方</label>
                    <input v-model="applicationForm.lessor" type="text" class="form-input" readonly />
                  </div>
                  <div class="form-item">
                    <label>承租方</label>
                    <input v-model="applicationForm.lessee" type="text" class="form-input" readonly />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>监测信息</h3>
                <div class="form-grid">
                  <div class="form-item required">
                    <label>监测开始日期</label>
                    <input v-model="applicationForm.monitoringStart" type="date" class="form-input" required />
                  </div>
                  <div class="form-item required">
                    <label>监测结束日期</label>
                    <input v-model="applicationForm.monitoringEnd" type="date" class="form-input" required />
                  </div>
                  <div class="form-item required">
                    <label>租赁开始日期</label>
                    <input v-model="applicationForm.leaseStart" type="date" class="form-input" required />
                  </div>
                  <div class="form-item required">
                    <label>租赁结束日期</label>
                    <input v-model="applicationForm.leaseEnd" type="date" class="form-input" required />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>租赁合同上传</h3>
                <p class="form-tips">请上传签署完整的租赁合同（支持PDF、JPG、PNG格式，不超过10MB）</p>
                <div class="upload-area" @click="triggerFileUpload">
                  <input ref="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" style="display: none"
                    @change="handleFileUpload" />
                  <div v-if="!applicationForm.contractFile" class="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <p>点击上传租赁合同</p>
                  </div>
                  <div v-else class="uploaded-file">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div class="file-info">
                      <span class="file-name">{{ applicationForm.contractFile.name }}</span>
                      <span class="file-size">{{ (applicationForm.contractFile.size / 1024 / 1024).toFixed(2) }}
                        MB</span>
                    </div>
                    <button type="button" class="btn-remove-file" @click.stop="removeFile">删除</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeApplicationModal">取消</button>
            <button type="button" class="btn-submit" @click="submitApplication">提交申请</button>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div v-if="detailModalVisible" class="modal-overlay" @click.self="detailModalVisible = false">
        <div class="modal-content large">
          <div class="modal-header">
            <h2>监测详情</h2>
            <button class="close-btn" @click="detailModalVisible = false">✕</button>
          </div>
          <div class="modal-body">
            <div v-if="selectedMonitoring" class="detail-content">
              <div class="detail-section">
                <h3>基本信息</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">监测编号</span>
                    <span class="detail-value">{{ selectedMonitoring.monitoringNo }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">船舶名称</span>
                    <span class="detail-value">{{ selectedMonitoring.vesselName }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">出租方</span>
                    <span class="detail-value">{{ selectedMonitoring.lessor }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">承租方</span>
                    <span class="detail-value">{{ selectedMonitoring.lessee }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">监测期限</span>
                    <span class="detail-value">{{ selectedMonitoring.monitoringPeriod }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">租赁期限</span>
                    <span class="detail-value">{{ selectedMonitoring.leasePeriod }}</span>
                  </div>
                </div>
              </div>

              <div v-if="selectedMonitoring.contractUrl" class="detail-section">
                <h3>租赁合同</h3>
                <a :href="selectedMonitoring.contractUrl" class="contract-link" target="_blank">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  查看租赁合同
                </a>
              </div>

              <div v-if="selectedMonitoring.rejectReason" class="detail-section">
                <h3>驳回原因</h3>
                <div class="reject-reason">{{ selectedMonitoring.rejectReason }}</div>
              </div>
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

// State
const searchKeyword = ref('')
const filterStatus = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const currentTab = ref('lessor') // 'lessor' or 'lessee'
const detailModalVisible = ref(false)
const selectedMonitoring = ref(null)
const applicationModalVisible = ref(false)
const applicationForm = ref({
  vesselName: '',
  lessor: '',
  lessee: '',
  monitoringStart: '',
  monitoringEnd: '',
  leaseStart: '',
  leaseEnd: '',
  contractFile: null
})
const fileInput = ref(null)

// Mock data
const allMonitorings = ref([
  {
    id: 1,
    monitoringNo: 'MON-20260115-001',
    vesselName: 'OCEAN STAR',
    lessor: '太平洋航运有限公司',
    lessee: '上海国际贸易公司',
    monitoringPeriod: '2026-01-15 ~ 2026-07-15',
    leasePeriod: '2026-01-01 ~ 2026-12-31',
    status: 'active',
    applyTime: '2026-01-10',
    remainingDays: 156,
    lastPosition: '东经121.5°, 北纬31.2° (上海附近海域)',
    contractUrl: '/contracts/lease-001.pdf',
    role: 'lessor'
  },
  {
    id: 2,
    monitoringNo: 'MON-20260110-002',
    vesselName: 'SEA DRAGON',
    lessor: '环球船务集团',
    lessee: '宁波远洋运输',
    monitoringPeriod: '2026-01-10 ~ 2026-06-10',
    leasePeriod: '2026-01-01 ~ 2026-06-30',
    status: 'active',
    applyTime: '2026-01-05',
    remainingDays: 146,
    lastPosition: '东经119.8°, 北纬30.1° (宁波港)',
    contractUrl: '/contracts/lease-002.pdf',
    role: 'lessee'
  },
  {
    id: 3,
    monitoringNo: 'MON-20260105-003',
    vesselName: 'PACIFIC HERO',
    lessor: '中远海运集团',
    lessee: '青岛航运公司',
    monitoringPeriod: '2026-01-05 ~ 2026-03-05',
    leasePeriod: '2026-01-01 ~ 2026-03-31',
    status: 'expired',
    applyTime: '2025-12-28',
    lastPosition: '东经120.3°, 北纬36.1° (青岛港)',
    contractUrl: '/contracts/lease-003.pdf',
    role: 'lessor'
  },
  {
    id: 4,
    monitoringNo: 'MON-20260120-004',
    vesselName: 'GOLDEN WAVE',
    lessor: '大连船舶租赁',
    lessee: '天津国际货运',
    monitoringPeriod: '',
    leasePeriod: '2026-02-01 ~ 2026-08-01',
    status: 'applying',
    applyTime: '2026-01-20',
    role: 'lessor'
  },
  {
    id: 5,
    monitoringNo: 'MON-20260118-005',
    vesselName: 'BLUE HORIZON',
    lessor: '深圳航运公司',
    lessee: '广州贸易集团',
    monitoringPeriod: '',
    leasePeriod: '2026-02-01 ~ 2026-05-01',
    status: 'rejected',
    applyTime: '2026-01-18',
    rejectReason: '租赁合同信息不完整，请补充合同签署页并重新提交',
    role: 'lessor'
  },
  {
    id: 6,
    monitoringNo: '',
    vesselName: 'SILVER WIND',
    lessor: '厦门航运公司',
    lessee: '福州贸易公司',
    monitoringPeriod: '',
    leasePeriod: '2026-03-01 ~ 2026-09-01',
    status: 'unapplied',
    applyTime: '',
    role: 'lessor'
  },
  {
    id: 7,
    monitoringNo: '',
    vesselName: 'OCEAN PEARL',
    lessor: '广州船务集团',
    lessee: '深圳国际物流',
    monitoringPeriod: '',
    leasePeriod: '2026-02-15 ~ 2026-08-15',
    status: 'waiting',
    applyTime: '',
    role: 'lessee'
  }
])

// Computed
const filteredMonitorings = computed(() => {
  let result = allMonitorings.value.filter(m => m.role === currentTab.value)

  if (searchKeyword.value) {
    result = result.filter(m =>
      m.monitoringNo.includes(searchKeyword.value) ||
      m.vesselName.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      m.lessor.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      m.lessee.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  if (filterStatus.value) {
    result = result.filter(m => m.status === filterStatus.value)
  }

  if (dateStart.value) {
    result = result.filter(m => m.applyTime >= dateStart.value)
  }

  if (dateEnd.value) {
    result = result.filter(m => m.applyTime <= dateEnd.value)
  }

  return result
})

// Methods
const getStatusLabel = (status) => {
  const labels = {
    unapplied: '未申请',
    waiting: '等待申请',
    applying: '申请中',
    active: '监测中',
    expired: '已到期',
    rejected: '已驳回'
  }
  return labels[status] || status
}

const applyFilters = () => {
  console.log('[v0] 应用筛选条件')
}

const resetFilters = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  dateStart.value = ''
  dateEnd.value = ''
}

const viewDetail = (monitoring) => {
  selectedMonitoring.value = monitoring
  detailModalVisible.value = true
}

const trackVessel = (monitoring) => {
  console.log('[v0] 实时跟踪船舶:', monitoring.vesselName)
  window.open(`/monitoring-dashboard?id=${monitoring.id}`, '_blank')
}

const openApplicationModal = (monitoring) => {
  console.log('[v0] 打开申请表单:', monitoring.vesselName)
  applicationForm.value = {
    vesselName: monitoring.vesselName,
    lessor: monitoring.lessor,
    lessee: monitoring.lessee,
    monitoringStart: '',
    monitoringEnd: '',
    leaseStart: monitoring.leasePeriod.split(' ~ ')[0],
    leaseEnd: monitoring.leasePeriod.split(' ~ ')[1],
    contractFile: null
  }
  selectedMonitoring.value = monitoring
  applicationModalVisible.value = true
}

const closeApplicationModal = () => {
  applicationModalVisible.value = false
  applicationForm.value = {
    vesselName: '',
    lessor: '',
    lessee: '',
    monitoringStart: '',
    monitoringEnd: '',
    leaseStart: '',
    leaseEnd: '',
    contractFile: null
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过10MB')
      return
    }
    applicationForm.value.contractFile = file
  }
}

const removeFile = () => {
  applicationForm.value.contractFile = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const submitApplication = () => {
  if (!applicationForm.value.monitoringStart || !applicationForm.value.monitoringEnd ||
    !applicationForm.value.leaseStart || !applicationForm.value.leaseEnd) {
    alert('请填写完整的期限信息')
    return
  }

  if (!applicationForm.value.contractFile) {
    alert('请上传租赁合同')
    return
  }

  console.log('[v0] 提交申请:', applicationForm.value)
  alert('申请已提交，等待运营审核')
  closeApplicationModal()
}

const openDashboard = () => {
  window.open('/monitoring-dashboard', '_blank')
}
</script>

<style scoped>
.monitoring-center-container {
  min-height: 100vh;
  /* background: linear-gradient(to bottom right, #F0F9FF 0%, #E0F2FE 50%, #F0FDFA 100%); */
}

.page-content {
  /* max-width: 1400px; */
  margin: 0 auto;
}

/* Header */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
}

.header-left h1 {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #0F172A 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 14px;
  color: #64748B;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.stats-badge {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: #0369A1;
  background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #7DD3FC;
}

.btn-dashboard {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  white-space: nowrap;
}

.btn-dashboard:hover {
  background: linear-gradient(135deg, #0891B2 0%, #0E7490 100%);
  box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
  transform: translateY(-2px);
}

.btn-dashboard svg {
  width: 20px;
  height: 20px;
}

/* Search Card */
.search-filter-section {
  margin-bottom: 28px;
}

.search-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-main-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.search-input-wrapper {
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
  transition: all 0.3s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.modern-input:focus {
  outline: none;
  border-color: #06B6D4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.filter-controls-inline {
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

.select-item label {
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

.modern-select:focus,
.modern-date:focus {
  outline: none;
  border-color: #06B6D4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-reset-new,
.btn-search-new {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-reset-new {
  background: #F1F5F9;
  color: #64748B;
  border: 1px solid #E2E8F0;
}

.btn-reset-new:hover {
  background: #E2E8F0;
}

.btn-search-new {
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  color: white;
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.2);
}

.btn-search-new:hover {
  background: linear-gradient(135deg, #0891B2, #0E7490);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

/* Tabs */
.tabs-section {
  background: white;
  border-bottom: 2px solid #E2E8F0;
  margin: 0 0 28px 0;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.tabs-container {
  display: flex;
  gap: 0;
}

.tab-button {
  flex: 1;
  padding: 16px 24px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  color: #06B6D4;
  background: #F0FDFA;
}

.tab-button.active {
  color: #06B6D4;
  border-bottom-color: #06B6D4;
  background: #F0FDFA;
}

/* Monitoring Grid */
.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.monitoring-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.monitoring-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.monitoring-card:hover {
  border-color: #06B6D4;
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.15);
  transform: translateY(-4px);
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #F1F5F9;
  background: linear-gradient(135deg, #F0FDFA 0%, #ECFEFF 100%);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.monitoring-no {
  font-size: 12px;
  color: #64748B;
  margin: 0;
  font-weight: 500;
}

.status-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 12px;
  white-space: nowrap;
}

.status-applying {
  background: #FEF3C7;
  color: #D97706;
}

.status-active {
  background: #D1FAE5;
  color: #059669;
}

.status-expired {
  background: #F3F4F6;
  color: #6B7280;
}

.status-rejected {
  background: #FEE2E2;
  color: #DC2626;
}

.status-unapplied {
  background: #F3F4F6;
  color: #6B7280;
}

.status-waiting {
  background: #FEF3C7;
  color: #CA8A04;
}

.card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}

.info-value {
  font-size: 13px;
  color: #0F172A;
  font-weight: 600;
}

.info-value.highlight {
  color: #DC2626;
  font-size: 14px;
}

.position-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #F0FDFA;
  border-radius: 8px;
  border: 1px solid #CCFBF1;
}

.position-info svg {
  width: 20px;
  height: 20px;
  color: #14B8A6;
  flex-shrink: 0;
  margin-top: 2px;
}

.position-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.position-label {
  font-size: 12px;
  color: #0F766E;
  font-weight: 600;
}

.position-value {
  font-size: 13px;
  color: #134E4A;
  font-weight: 500;
}

.card-footer {
  padding: 16px 20px;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  display: flex;
  gap: 12px;
  min-height: 68px;
  align-items: center;
  margin-top: auto;
}

.btn-detail,
.btn-track,
.btn-reapply {
  flex: 1;
  padding: 9px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-detail {
  flex: 1;
  padding: 10px 16px;
  background: #F1F5F9;
  color: #475569;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-detail:hover:not(.disabled) {
  background: #E2E8F0;
  border-color: #CBD5E1;
}

.btn-detail.disabled {
  background: #F8FAFC;
  color: #94A3B8;
  border-color: #F1F5F9;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-detail:hover {
  background: #E2E8F0;
}

.btn-track {
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-track:hover {
  background: linear-gradient(135deg, #0891B2, #0E7490);
}

.btn-track svg {
  width: 16px;
  height: 16px;
}

.btn-reapply {
  background: #EAB308;
  color: white;
}

.btn-reapply:hover {
  background: #EA580C;
}

.btn-apply {
  flex: 1;
  padding: 10px 16px;
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-apply:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
}

/* Application Form */
.modal-body-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  max-height: calc(90vh - 180px);
}

.application-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #E2E8F0;
}

.form-tips {
  font-size: 13px;
  color: #64748B;
  margin: 0 0 12px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-item.required label::after {
  content: '*';
  color: #EF4444;
  margin-left: 4px;
}

.form-item label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-input:read-only {
  background: #F8FAFC;
  color: #64748B;
}

.upload-area {
  border: 2px dashed #CBD5E1;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #F8FAFC;
}

.upload-area:hover {
  border-color: #0EA5E9;
  background: #EFF6FF;
}

.upload-placeholder svg {
  width: 48px;
  height: 48px;
  color: #94A3B8;
  margin: 0 auto 12px;
}

.upload-placeholder p {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
}

.uploaded-file svg {
  width: 32px;
  height: 32px;
  color: #0EA5E9;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.file-name {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
}

.file-size {
  font-size: 12px;
  color: #64748B;
}

.btn-remove-file {
  padding: 6px 12px;
  background: #FEE2E2;
  color: #DC2626;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove-file:hover {
  background: #FCA5A5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #E2E8F0;
}

.btn-cancel {
  padding: 10px 24px;
  background: #F1F5F9;
  color: #475569;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(242, 245, 249, 0.3);
}

.btn-cancel:hover {
  background: #E2E8F0;
  border-color: #CBD5E1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(242, 245, 249, 0.4);
}

.btn-submit {
  padding: 10px 24px;
  background: linear-gradient(135deg, #0EA5E9, #06B6D4);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-submit:hover {
  background: linear-gradient(135deg, #0284C7, #0891B2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}



/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 24px;
  color: #94A3B8;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.5;
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
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #F1F5F9;
  color: #64748B;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #E2E8F0;
}

.modal-body {
  padding: 24px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 16px 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #0F172A;
  font-weight: 600;
}

.contract-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #F0FDFA;
  border: 1px solid #99F6E4;
  border-radius: 8px;
  color: #0F766E;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.contract-link:hover {
  background: #CCFBF1;
  border-color: #5EEAD4;
}

.contract-link svg {
  width: 20px;
  height: 20px;
}

.reject-reason {
  padding: 16px;
  background: #FEF2F2;
  border: 1px solid #FCA5A5;
  border-radius: 8px;
  color: #991B1B;
  font-size: 14px;
  line-height: 1.6;
}
</style>

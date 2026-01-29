<template>
  <div class="verification-center-container">
    <!-- Search & Filter Section -->
    <div class="search-filter-section">
      <div class="header-content">
        <h1 class="page-title">交易鉴证中心</h1>
        <div class="stats-badge">共 {{ allVerifications.length }} 项鉴证</div>
      </div>

      <div class="search-card">
        <div class="search-main-row">
          <div class="search-input-wrapper">
            <div class="input-with-icon">
              <svg class="search-icon" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" fill="none" stroke-width="2"/>
              </svg>
              <input v-model="searchKeyword" type="text" placeholder="搜索鉴证编号、对方信息..." class="modern-input" @keyup.enter="applyFilters">
            </div>
          </div>

          <div class="filter-controls-inline">
            <div class="select-item">
              <label>鉴证状态</label>
              <select v-model="filterStatus" @change="applyFilters" class="modern-select">
                <option value="">全部状态</option>
                <option value="filling">填报中</option>
                <option value="waiting_review">待审核</option>
                <option value="reviewing">审核中</option>
                <option value="approved">已通过</option>
                <option value="rejected">未通过</option>
              </select>
            </div>

            <div class="select-item">
              <label>开始日期</label>
              <input v-model="dateStart" type="date" @change="applyFilters" class="modern-date">
            </div>

            <div class="select-item">
              <label>结束日期</label>
              <input v-model="dateEnd" type="date" @change="applyFilters" class="modern-date">
            </div>

            <button class="btn-reset-new" @click="resetFilters">重置</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Verification Cards Grid -->
    <div v-if="filteredVerifications.length > 0" class="verifications-grid">
      <div v-for="verification in filteredVerifications" :key="verification.id" class="verification-card">
        <div class="card-header">
          <div class="card-title-section">
            <h3 class="card-title">{{ verification.vesselName }}</h3>
            <span :class="['status-badge', `status-${verification.status}`]">{{ getStatusLabel(verification.status) }}</span>
          </div>
          <div class="verification-no">{{ verification.verificationNo }}</div>
        </div>

        <div class="card-content">
          <div class="info-row">
            <span class="info-label">卖出方:</span>
            <span class="info-value">{{ verification.seller }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">买入方:</span>
            <span class="info-value">{{ verification.buyer }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">交易金额:</span>
            <span class="info-value">¥ {{ verification.amount }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">创建时间:</span>
            <span class="info-value">{{ verification.createdTime }}</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="progress-bar">
            <div class="progress-step" :class="{ completed: ['waiting_review', 'reviewing', 'approved', 'rejected'].includes(verification.status) }"></div>
            <div class="progress-line" :class="{ completed: ['reviewing', 'approved', 'rejected'].includes(verification.status) }"></div>
            <div class="progress-step" :class="{ completed: ['reviewing', 'approved', 'rejected'].includes(verification.status) }"></div>
            <div class="progress-line" :class="{ completed: ['approved', 'rejected'].includes(verification.status) }"></div>
            <div class="progress-step" :class="{ completed: ['approved', 'rejected'].includes(verification.status) }"></div>
          </div>
          <div class="progress-labels">
            <span>填报中</span>
            <span>待审核</span>
            <span>{{ verification.status === 'approved' ? '已通过' : '已驳回' }}</span>
          </div>
        </div>

        <div class="card-actions">
          <button v-if="verification.status === 'filling'" class="btn-filling" @click="openFillingModal(verification)">
            {{ verification.myStatus === 'unfilled' ? '开始填报' : '继续填报' }}
          </button>
          <button v-if="verification.status === 'waiting_review' || verification.status === 'reviewing'" class="btn-detail" @click="openDetailModal(verification)">
            查看详情
          </button>
          <button v-if="verification.status === 'approved' && currentRole === 'buyer'" class="btn-download" @click="downloadCertificate(verification)">
            下载鉴证书
          </button>
          <button v-if="verification.status === 'approved' && currentRole === 'seller'" class="btn-download" @click="downloadCertificate(verification)">
            下载鉴证书
          </button>
          <button v-if="verification.status === 'rejected'" class="btn-retry" @click="openFillingModal(verification)">
            重新填报
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📋</div>
      <h3>暂无鉴证记录</h3>
      <p>当意向对接成功后，将在此显示鉴证申请</p>
    </div>

    <!-- Filling Modal Component -->
    <VerificationFillingModal 
      v-if="fillingModalVisible"
      :verification="selectedVerification"
      :current-role="currentRole"
      @close="fillingModalVisible = false"
      @submit="handleFillingSubmit"
    />

    <!-- Detail Modal Component -->
    <VerificationDetailModal 
      v-if="detailModalVisible"
      :verification="selectedVerification"
      @close="detailModalVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VerificationFillingModal from '../../components/VerificationFillingModal.vue'
import VerificationDetailModal from '../../components/VerificationDetailModal.vue'

const router = useRouter()
const route = useRoute()

// States
const searchKeyword = ref('')
const filterStatus = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const currentRole = ref('seller') // 'seller' or 'buyer'
const fillingModalVisible = ref(false)
const detailModalVisible = ref(false)
const selectedVerification = ref(null)

// Mock data - verifications
const allVerifications = ref([
  {
    id: 1,
    verificationNo: 'TRD-20231024-001',
    vesselName: 'PACIFIC HERO',
    seller: 'PACIFIC SHIPPING LTD.',
    buyer: 'SHANGHAI TRADING CO., LTD.',
    amount: '85,000,000',
    status: 'filling',
    myStatus: 'unfilled',
    createdTime: '2026-02-10',
    intentionId: 101
  },
  {
    id: 2,
    verificationNo: 'TRD-20231024-002',
    vesselName: '集装箱船 EAST WIND',
    seller: 'HARMONY SHIPPING',
    buyer: 'CHINA TRADING',
    amount: '45,000,000',
    status: 'waiting_review',
    myStatus: 'filled',
    createdTime: '2026-02-08',
    intentionId: 102
  },
  {
    id: 3,
    verificationNo: 'TRD-20231024-003',
    vesselName: '散货船 STRENGTH',
    seller: 'GLOBAL SHIPS',
    buyer: '中海国际',
    amount: '32,000,000',
    status: 'approved',
    myStatus: 'filled',
    createdTime: '2026-02-01',
    intentionId: 103
  }
])

// Computed
const filteredVerifications = computed(() => {
  let result = allVerifications.value

  if (searchKeyword.value) {
    result = result.filter(v =>
      v.verificationNo.includes(searchKeyword.value) ||
      v.vesselName.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      v.seller.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      v.buyer.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  if (filterStatus.value) {
    result = result.filter(v => v.status === filterStatus.value)
  }

  if (dateStart.value) {
    result = result.filter(v => v.createdTime >= dateStart.value)
  }

  if (dateEnd.value) {
    result = result.filter(v => v.createdTime <= dateEnd.value)
  }

  return result
})

// Methods
const getStatusLabel = (status) => {
  const labels = {
    'filling': '填报中',
    'waiting_review': '待审核',
    'reviewing': '审核中',
    'approved': '已通过',
    'rejected': '未通过'
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

const openFillingModal = (verification) => {
  selectedVerification.value = verification
  fillingModalVisible.value = true
}

const openDetailModal = (verification) => {
  selectedVerification.value = verification
  detailModalVisible.value = true
}

const handleFillingSubmit = (data) => {
  console.log('[v0] 提交填报数据:', data)
  fillingModalVisible.value = false
  // Update verification status
  if (selectedVerification.value) {
    selectedVerification.value.myStatus = 'filled'
  }
}

const downloadCertificate = (verification) => {
  console.log('[v0] 下载鉴证书:', verification.verificationNo)
}

onMounted(() => {
  const intentionId = route.query.intentionId
  if (intentionId) {
    console.log('[v0] 从意向ID加载:', intentionId)
  }
})
</script>

<style scoped>
.verification-center-container {
  padding: 24px;
  background-color: #FFFFFF;
  min-height: 100vh;
}

.search-filter-section {
  margin-bottom: 32px;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
  padding: 28px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  margin-bottom: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.5px;
}

.stats-badge {
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  background: linear-gradient(135deg, #F0F9FF 0%, #EFF6FF 100%);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #BFDBFE;
  display: inline-block;
  margin-top: 12px;
}

.search-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
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
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.08);
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

.verifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.verification-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.verification-card:hover {
  border-color: #0EA5E9;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.12);
  transform: translateY(-4px);
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid #F1F5F9;
  background: #F8FAFC;
}

.card-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
  flex: 1;
}

.status-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.status-filling {
  background: #FEF3C7;
  color: #D97706;
}

.status-waiting_review {
  background: #DBEAFE;
  color: #1E40AF;
}

.status-reviewing {
  background: #FCD34D;
  color: #854D0E;
}

.status-approved {
  background: #D1FAE5;
  color: #059669;
}

.status-rejected {
  background: #FEE2E2;
  color: #DC2626;
}

.verification-no {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}

.card-content {
  padding: 16px;
  flex: 1;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #F1F5F9;
  font-size: 13px;
}

.info-row:last-child {
  border-bottom: none;
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
  padding: 16px;
  border-top: 1px solid #E2E8F0;
  background: #F8FAFC;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.progress-step {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #CBD5E1;
  transition: all 0.3s;
}

.progress-step.completed {
  background: #0EA5E9;
}

.progress-line {
  flex: 1;
  height: 2px;
  background: #E2E8F0;
  transition: all 0.3s;
}

.progress-line.completed {
  background: #0EA5E9;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #64748B;
  font-weight: 500;
}

.card-actions {
  padding: 12px 16px;
  border-top: 1px solid #E2E8F0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-filling,
.btn-detail,
.btn-download,
.btn-retry {
  flex: 1;
  min-width: 100px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-filling {
  background: #8B5CF6;
  color: white;
}

.btn-filling:hover {
  background: #7C3AED;
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

.btn-download {
  background: #10B981;
  color: white;
}

.btn-download:hover {
  background: #059669;
}

.btn-retry {
  background: #F1F5F9;
  color: #475569;
  border: 1px solid #E2E8F0;
}

.btn-retry:hover {
  background: #E2E8F0;
  border-color: #CBD5E1;
}

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
</style>

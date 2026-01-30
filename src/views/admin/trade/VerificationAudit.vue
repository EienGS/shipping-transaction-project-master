<template>
  <div class="verification-audit-container">
    <!-- 审核列表视图 -->
    <div v-if="!selectedVerification" class="audit-list-view">
      <!-- 搜索筛选区域 -->
      <div class="search-filter-section">
        <div class="header-content">
          <h1 class="page-title">交易鉴证审核</h1>
          <div class="stats-badges">
            <span class="badge">待审核: {{ pendingCount }}</span>
            <span class="badge badge-success">已通过: {{ approvedCount }}</span>
            <span class="badge badge-danger">已驳回: {{ rejectedCount }}</span>
          </div>
        </div>

        <el-card class="search-card">
          <div class="search-form">
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12" :md="6">
                <el-input 
                  v-model="searchParams.keyword" 
                  placeholder="鉴证编号/企业名称"
                  clearable
                  @keyup.enter="handleSearch"
                />
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-select 
                  v-model="searchParams.status" 
                  placeholder="审核状态"
                  clearable
                  @change="handleSearch"
                >
                  <el-option label="待审核" value="pending" />
                  <el-option label="已通过" value="approved" />
                  <el-option label="已驳回" value="rejected" />
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-date-picker
                  v-model="searchParams.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="handleSearch"
                />
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="resetSearch">重置</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>

      <!-- 工单列表 -->
      <div class="tickets-list">
        <el-empty v-if="filteredTickets.length === 0" description="暂无审核工单" />
        <div v-else class="tickets-container">
          <div 
            v-for="ticket in filteredTickets" 
            :key="ticket.id" 
            class="ticket-card"
            @click="handleSelectTicket(ticket)"
          >
            <div class="ticket-header">
              <div class="ticket-title">
                <h3>{{ ticket.vesselName }}</h3>
                <span :class="['status-badge', `status-${ticket.status}`]">
                  {{ getStatusLabel(ticket.status) }}
                </span>
              </div>
              <span class="verification-no">{{ ticket.verificationNo }}</span>
            </div>

            <div class="ticket-content">
              <div class="info-item">
                <span class="label">卖方:</span>
                <span class="value">{{ ticket.sellerName }}</span>
              </div>
              <div class="info-item">
                <span class="label">买方:</span>
                <span class="value">{{ ticket.buyerName }}</span>
              </div>
              <div class="info-item">
                <span class="label">交易金额:</span>
                <span class="value">¥ {{ formatNumber(ticket.transactionAmount) }}</span>
              </div>
              <div class="info-item">
                <span class="label">提交时间:</span>
                <span class="value">{{ formatDate(ticket.submittedTime) }}</span>
              </div>
              <div class="info-item">
                <span class="label">经办人:</span>
                <span class="value">{{ ticket.operatorName }}</span>
              </div>
            </div>

            <div class="ticket-footer">
              <el-button type="primary" link size="small">查看详情 →</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredTickets.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 审核详情视图 -->
    <div v-else class="audit-detail-view">
      <div class="detail-header">
        <el-button text icon="ArrowLeft" @click="selectedVerification = null">
          返回列表
        </el-button>
        <h2>鉴证审核详情</h2>
        <span />
      </div>

      <el-card class="detail-card">
        <el-tabs type="card">
          <!-- 基础信息 -->
          <el-tab-pane label="基础信息">
            <VerificationBasicInfo :ticket="selectedVerification" />
          </el-tab-pane>

          <!-- 交易方信息 -->
          <el-tab-pane label="交易方信息">
            <VerificationPartyInfo :ticket="selectedVerification" />
          </el-tab-pane>

          <!-- 资质文件 -->
          <el-tab-pane label="资质文件">
            <VerificationDocuments :ticket="selectedVerification" />
          </el-tab-pane>

          <!-- 数据核对 -->
          <el-tab-pane label="数据核对">
            <VerificationDataComparison :ticket="selectedVerification" @mark-anomaly="markAnomaly" />
          </el-tab-pane>

          <!-- 审核记录 -->
          <el-tab-pane label="审核记录">
            <VerificationAuditLog :ticket="selectedVerification" />
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 审核操作 -->
      <div class="audit-actions">
        <el-button 
          type="danger" 
          @click="handleReject"
          v-if="selectedVerification.status === 'pending'"
        >
          驳回申请
        </el-button>
        <el-button 
          type="success" 
          @click="handleApprove"
          v-if="selectedVerification.status === 'pending'"
        >
          审核通过
        </el-button>
      </div>

      <!-- 驳回原因对话框 -->
      <el-dialog v-model="rejectDialogVisible" title="驳回原因" width="500px">
        <el-form :model="rejectForm" label-width="100px">
          <el-form-item label="驳回原因">
            <el-checkbox-group v-model="rejectForm.reasons">
              <el-checkbox label="资料不完整">资料不完整</el-checkbox>
              <el-checkbox label="信息不一致">信息不一致</el-checkbox>
              <el-checkbox label="证件过期">证件过期</el-checkbox>
              <el-checkbox label="其他">其他</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="详细说明">
            <el-input 
              v-model="rejectForm.description" 
              type="textarea" 
              rows="4"
              placeholder="请详细说明驳回原因..."
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="rejectDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmReject">确认驳回</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import VerificationBasicInfo from './components/VerificationBasicInfo.vue'
import VerificationPartyInfo from './components/VerificationPartyInfo.vue'
import VerificationDocuments from './components/VerificationDocuments.vue'
import VerificationDataComparison from './components/VerificationDataComparison.vue'
import VerificationAuditLog from './components/VerificationAuditLog.vue'

// 状态管理
const selectedVerification = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const rejectDialogVisible = ref(false)
const searchParams = ref({
  keyword: '',
  status: '',
  dateRange: null
})

const rejectForm = ref({
  reasons: [],
  description: ''
})

// Mock 数据
const allTickets = ref([
  {
    id: 1,
    verificationNo: 'VER-2026010001',
    vesselName: 'OCEAN STAR',
    sellerName: '某航运有限公司',
    buyerName: '新港海运集团',
    transactionAmount: 50000000,
    submittedTime: '2026-01-15 14:30',
    operatorName: '李先生',
    status: 'pending',
    basicInfo: {
      imo: '1234567',
      flag: '巴拿马',
      vesselType: '散货船',
      grt: 52000,
      nrt: 28000,
      loa: 230,
      beam: 32,
      depth: 19,
      yearBuilt: 2010,
      classification: 'ABS',
      lastSurveyDate: '2025-12-15'
    },
    sellerInfo: {
      type: 'company',
      name: '某航运有限公司',
      uscc: '9137010012345678',
      businessLicense: 'BL001.pdf',
      legalRepresentative: '张三',
      contact: '021-12345678'
    },
    buyerInfo: {
      type: 'company',
      name: '新港海运集团',
      uscc: '9137020087654321',
      businessLicense: 'BL002.pdf',
      legalRepresentative: '王五',
      contact: '0898-87654321'
    },
    transactionInfo: {
      amount: 50000000,
      currency: 'CNY',
      paymentTerms: '分期付款'
    },
    documents: [
      { name: '营业执照（卖方）', file: 'doc001.pdf', type: 'license' },
      { name: '营业执照（买方）', file: 'doc002.pdf', type: 'license' },
      { name: '法定代表人身份证（卖方）', file: 'doc003.pdf', type: 'id' },
      { name: '船舶所有权证书', file: 'doc004.pdf', type: 'certificate' }
    ]
  },
  {
    id: 2,
    verificationNo: 'VER-2026010002',
    vesselName: 'PACIFIC DREAMS',
    sellerName: '环球海运有限公司',
    buyerName: '亚太船运集团',
    transactionAmount: 35000000,
    submittedTime: '2026-01-14 10:15',
    operatorName: '王女士',
    status: 'pending'
  },
  {
    id: 3,
    verificationNo: 'VER-2026010003',
    vesselName: 'GLOBAL TRADER',
    sellerName: '远洋航运有限公司',
    buyerName: '港澳海运公司',
    transactionAmount: 28000000,
    submittedTime: '2026-01-13 09:45',
    operatorName: '陈先生',
    status: 'approved'
  },
  {
    id: 4,
    verificationNo: 'VER-2026010004',
    vesselName: 'EASTERN WIND',
    sellerName: '中远海运有限公司',
    buyerName: '招商轮船集团',
    transactionAmount: 42000000,
    submittedTime: '2026-01-12 16:20',
    operatorName: '李女士',
    status: 'rejected'
  }
])

// 计算属性
const filteredTickets = computed(() => {
  let result = allTickets.value
  
  if (searchParams.value.keyword) {
    const keyword = searchParams.value.keyword.toLowerCase()
    result = result.filter(ticket =>
      ticket.verificationNo.toLowerCase().includes(keyword) ||
      ticket.sellerName.toLowerCase().includes(keyword) ||
      ticket.buyerName.toLowerCase().includes(keyword)
    )
  }
  
  if (searchParams.value.status) {
    result = result.filter(ticket => ticket.status === searchParams.value.status)
  }
  
  // 按时间倒序排列
  result.sort((a, b) => new Date(b.submittedTime) - new Date(a.submittedTime))
  
  return result
})

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTickets.value.slice(start, end)
})

const pendingCount = computed(() => allTickets.value.filter(t => t.status === 'pending').length)
const approvedCount = computed(() => allTickets.value.filter(t => t.status === 'approved').length)
const rejectedCount = computed(() => allTickets.value.filter(t => t.status === 'rejected').length)

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const resetSearch = () => {
  searchParams.value = {
    keyword: '',
    status: '',
    dateRange: null
  }
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleSelectTicket = (ticket) => {
  selectedVerification.value = ticket
}

const handleApprove = () => {
  ElMessageBox.confirm(
    '审核通过后，系统将自动生成鉴证书，是否继续？',
    '审核通过',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    selectedVerification.value.status = 'approved'
    ElMessage.success('审核通过，正在生成鉴证书...')
    // 这里应该跳转到鉴证书生成页面
    setTimeout(() => {
      selectedVerification.value = null
    }, 1500)
  }).catch(() => {
    ElMessage.info('已取消')
  })
}

const handleReject = () => {
  rejectDialogVisible.value = true
}

const confirmReject = () => {
  if (rejectForm.value.reasons.length === 0 || !rejectForm.value.description.trim()) {
    ElMessage.warning('请选择驳回原因并填写详细说明')
    return
  }

  selectedVerification.value.status = 'rejected'
  selectedVerification.value.rejectReason = rejectForm.value.reasons.join('、')
  selectedVerification.value.rejectDescription = rejectForm.value.description

  ElMessage.success('已驳回申请，用户将收到通知')
  rejectDialogVisible.value = false
  rejectForm.value = { reasons: [], description: '' }
  
  setTimeout(() => {
    selectedVerification.value = null
  }, 1500)
}

const markAnomaly = (field, anomaly) => {
  if (!selectedVerification.value.anomalies) {
    selectedVerification.value.anomalies = {}
  }
  selectedVerification.value.anomalies[field] = anomaly
}

const getStatusLabel = (status) => {
  const labels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回'
  }
  return labels[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const formatNumber = (num) => {
  return num.toLocaleString('zh-CN')
}

onMounted(() => {
  console.log('[v0] 交易鉴证审核页面已加载')
})
</script>

<style scoped>
.verification-audit-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 列表视图 */
.audit-list-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-filter-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.stats-badges {
  display: flex;
  gap: 12px;
}

.badge {
  padding: 6px 12px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.search-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-form {
  padding: 16px 0;
}

.tickets-list {
  min-height: 400px;
}

.tickets-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ticket-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.ticket-card:hover {
  border-color: #0ea5e9;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
  transform: translateY(-2px);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.ticket-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ticket-title h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-approved {
  background: #dcfce7;
  color: #166534;
}

.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

.verification-no {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.ticket-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item .label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 4px;
}

.info-item .value {
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
}

.ticket-footer {
  text-align: right;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

/* 详情视图 */
.audit-detail-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.detail-header h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.detail-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.audit-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.audit-actions button {
  min-width: 120px;
}
</style>

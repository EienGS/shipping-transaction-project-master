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

      <!-- 工单表格 -->
      <el-card class="table-card">
        <el-table 
          :data="paginatedTickets" 
          style="width: 100%"
          :border="true"
          stripe
          @row-click="handleSelectTicket"
        >
          <el-table-column prop="verificationNo" label="鉴证编号" width="160" />
          <el-table-column prop="vesselName" label="船舶名称" width="160" />
          <el-table-column prop="sellerName" label="卖方" min-width="180" />
          <el-table-column prop="buyerName" label="买方" min-width="180" />
          <el-table-column label="交易金额" width="140" align="right">
            <template #default="{ row }">
              <span style="font-weight: 600;">¥ {{ formatNumber(row.transactionAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="row.status === 'pending' ? 'warning' : row.status === 'approved' ? 'success' : 'danger'"
                size="small"
              >
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="submittedTime" label="提交时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.submittedTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" label="经办人" width="120" />
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click.stop="handleSelectTicket(row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredTickets.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
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
    status: 'pending',
    basicInfo: {
      imo: '2345678',
      flag: '利比里亚',
      vesselType: '集装箱船',
      grt: 45000,
      nrt: 25000,
      loa: 210,
      beam: 30,
      depth: 18,
      yearBuilt: 2012,
      classification: 'DNV',
      lastSurveyDate: '2025-11-20'
    },
    sellerInfo: {
      type: 'company',
      name: '环球海运有限公司',
      uscc: '9137030012345679',
      businessLicense: 'BL003.pdf',
      legalRepresentative: '赵六',
      contact: '0755-12345678'
    },
    buyerInfo: {
      type: 'company',
      name: '亚太船运集团',
      uscc: '9137040087654322',
      businessLicense: 'BL004.pdf',
      legalRepresentative: '孙七',
      contact: '0592-87654321'
    },
    transactionInfo: {
      amount: 35000000,
      currency: 'CNY',
      paymentTerms: '一次性付款'
    },
    documents: [
      { name: '营业执照（卖方）', file: 'doc005.pdf', type: 'license' },
      { name: '营业执照（买方）', file: 'doc006.pdf', type: 'license' }
    ]
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
    status: 'approved',
    basicInfo: {
      imo: '3456789',
      flag: '中国',
      vesselType: '油轮',
      grt: 38000,
      nrt: 21000,
      loa: 195,
      beam: 28,
      depth: 16,
      yearBuilt: 2015,
      classification: 'CCS',
      lastSurveyDate: '2026-01-05'
    },
    sellerInfo: {
      type: 'company',
      name: '远洋航运有限公司',
      uscc: '9137050012345680',
      businessLicense: 'BL007.pdf',
      legalRepresentative: '周八',
      contact: '021-23456789'
    },
    buyerInfo: {
      type: 'company',
      name: '港澳海运公司',
      uscc: '9137060087654323',
      businessLicense: 'BL008.pdf',
      legalRepresentative: '吴九',
      contact: '0756-98765432'
    },
    transactionInfo: {
      amount: 28000000,
      currency: 'CNY',
      paymentTerms: '分期付款'
    },
    documents: [
      { name: '营业执照（卖方）', file: 'doc009.pdf', type: 'license' },
      { name: '营业执照（买方）', file: 'doc010.pdf', type: 'license' }
    ]
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
    status: 'rejected',
    basicInfo: {
      imo: '4567890',
      flag: '新加坡',
      vesselType: '散货船',
      grt: 48000,
      nrt: 26000,
      loa: 220,
      beam: 31,
      depth: 17,
      yearBuilt: 2011,
      classification: 'BV',
      lastSurveyDate: '2025-10-15'
    },
    sellerInfo: {
      type: 'company',
      name: '中远海运有限公司',
      uscc: '9137070012345681',
      businessLicense: 'BL011.pdf',
      legalRepresentative: '郑十',
      contact: '010-34567890'
    },
    buyerInfo: {
      type: 'company',
      name: '招商轮船集团',
      uscc: '9137080087654324',
      businessLicense: 'BL012.pdf',
      legalRepresentative: '钱十一',
      contact: '0755-87654321'
    },
    transactionInfo: {
      amount: 42000000,
      currency: 'CNY',
      paymentTerms: '分期付款'
    },
    documents: [
      { name: '营业执照（卖方）', file: 'doc013.pdf', type: 'license' },
      { name: '营业执照（买方）', file: 'doc014.pdf', type: 'license' }
    ]
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
  console.log('[v0] 选择工单:', ticket.id)
  // 如果是简单数据，需要获取完整数据
  if (!ticket.basicInfo) {
    // 这里模拟从后端获取完整数据
    const fullTicket = allTickets.value.find(t => t.id === ticket.id)
    if (fullTicket) {
      selectedVerification.value = fullTicket
    }
  } else {
    selectedVerification.value = ticket
  }
  console.log('[v0] 已设置选中工单:', selectedVerification.value)
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

.table-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.table-card :deep(.el-table) {
  font-size: 14px;
}

.table-card :deep(.el-table__row) {
  cursor: pointer;
}

.table-card :deep(.el-table__row:hover) {
  background-color: #f0f9ff;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 20px 0 0;
  margin-top: 16px;
  border-top: 1px solid #e2e8f0;
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

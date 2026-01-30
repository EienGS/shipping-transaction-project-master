<template>
  <div class="certificate-manage-container">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <div class="header-content">
        <h1 class="page-title">鉴证书管理</h1>
        <div class="stats-badges">
          <span class="badge">审核中: {{ pendingCount }}</span>
          <span class="badge badge-success">已下发: {{ issuedCount }}</span>
          <span class="badge badge-info">待下发: {{ waitingCount }}</span>
        </div>
      </div>

      <el-card class="search-card">
        <div class="search-form">
          <el-row :gutter="16" align="middle">
            <el-col :xs="24" :sm="12" :md="6">
              <el-input 
                v-model="searchParams.keyword" 
                placeholder="申请编号/企业名称"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <el-select 
                v-model="searchParams.status" 
                placeholder="证书状态"
                clearable
                @change="handleSearch"
              >
                <el-option label="审核中" value="pending" />
                <el-option label="待下发" value="waiting" />
                <el-option label="已下发" value="issued" />
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
            <el-col :xs="24" :sm="12" :md="6" class="search-actions">
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <!-- 鉴证书表格 -->
    <el-card class="table-card">
      <el-table 
        :data="paginatedCertificates" 
        style="width: 100%"
        :border="true"
        stripe
      >
        <el-table-column prop="applicationNo" label="申请编号" width="160" />
        <el-table-column prop="vesselName" label="船舶名称" width="160" />
        <el-table-column prop="sellerName" label="卖方" min-width="180" />
        <el-table-column prop="buyerName" label="买方" min-width="180" />
        <el-table-column label="交易金额" width="140" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600;">¥ {{ formatNumber(row.transactionAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="证书状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag 
              :type="row.status === 'pending' ? 'warning' : row.status === 'waiting' ? 'info' : 'success'"
              size="small"
            >
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.submitTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="issueTime" label="下发时间" width="180">
          <template #default="{ row }">
            {{ row.issueTime ? formatDate(row.issueTime) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row)">
              查看详情
            </el-button>
            <el-button 
              v-if="row.certificateUrl"
              type="success" 
              link 
              size="small" 
              @click="downloadCertificate(row)"
            >
              下载证书
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
          :total="filteredCertificates.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="鉴证书详情" 
      width="800px"
      :destroy-on-close="true"
    >
      <div v-if="selectedCertificate" class="certificate-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="鉴证编号">
            {{ selectedCertificate.certificateNo }}
          </el-descriptions-item>
          <el-descriptions-item label="申请编号">
            {{ selectedCertificate.applicationNo }}
          </el-descriptions-item>
          <el-descriptions-item label="船舶名称">
            {{ selectedCertificate.vesselName }}
          </el-descriptions-item>
          <el-descriptions-item label="IMO编号">
            {{ selectedCertificate.imo }}
          </el-descriptions-item>
          <el-descriptions-item label="卖方">
            {{ selectedCertificate.sellerName }}
          </el-descriptions-item>
          <el-descriptions-item label="买方">
            {{ selectedCertificate.buyerName }}
          </el-descriptions-item>
          <el-descriptions-item label="交易金额">
            ¥ {{ formatNumber(selectedCertificate.transactionAmount) }}
          </el-descriptions-item>
          <el-descriptions-item label="证书状态">
            <el-tag 
              :type="selectedCertificate.status === 'pending' ? 'warning' : selectedCertificate.status === 'waiting' ? 'info' : 'success'"
              size="small"
            >
              {{ getStatusLabel(selectedCertificate.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="提交第三方时间">
            {{ formatDate(selectedCertificate.submitTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="第三方审核完成时间">
            {{ selectedCertificate.auditTime ? formatDate(selectedCertificate.auditTime) : '审核中' }}
          </el-descriptions-item>
          <el-descriptions-item label="证书下发时间">
            {{ selectedCertificate.issueTime ? formatDate(selectedCertificate.issueTime) : '未下发' }}
          </el-descriptions-item>
          <el-descriptions-item label="第三方鉴证机构">
            {{ selectedCertificate.thirdParty || '中国船级社鉴证中心' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注说明" :span="2" v-if="selectedCertificate.remarks">
            {{ selectedCertificate.remarks }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="dialog-actions" v-if="selectedCertificate.certificateUrl">
          <el-button type="primary" @click="downloadCertificate(selectedCertificate)">
            下载证书
          </el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 状态管理
const currentPage = ref(1)
const pageSize = ref(10)
const detailDialogVisible = ref(false)
const selectedCertificate = ref(null)
const searchParams = ref({
  keyword: '',
  status: '',
  dateRange: null
})

// Mock 鉴证书数据
const allCertificates = ref([
  {
    id: 1,
    certificateNo: 'CERT-2026010001',
    applicationNo: 'VER-2026010001',
    vesselName: 'OCEAN STAR',
    imo: '1234567',
    sellerName: '某航运有限公司',
    buyerName: '新港海运集团',
    transactionAmount: 50000000,
    status: 'waiting',
    submitTime: '2026-01-16 10:30',
    auditTime: '2026-01-17 14:20',
    issueTime: null,
    thirdParty: '中国船级社鉴证中心',
    certificateUrl: 'https://ccs.org.cn/cert/download/CERT-2026010001.pdf',
    remarks: '第三方已审核通过，证书已生成，等待下发'
  },
  {
    id: 2,
    certificateNo: 'CERT-2026010002',
    applicationNo: 'VER-2026010003',
    vesselName: 'GLOBAL TRADER',
    imo: '3456789',
    sellerName: '远洋航运有限公司',
    buyerName: '港澳海运公司',
    transactionAmount: 28000000,
    status: 'issued',
    submitTime: '2026-01-13 11:45',
    auditTime: '2026-01-14 16:30',
    issueTime: '2026-01-15 09:00',
    thirdParty: '中国船级社鉴证中心',
    certificateUrl: 'https://ccs.org.cn/cert/download/CERT-2026010002.pdf',
    remarks: '证书已下发给买卖双方'
  },
  {
    id: 3,
    certificateNo: 'CERT-2026010003',
    applicationNo: 'VER-2026010002',
    vesselName: 'PACIFIC DREAMS',
    imo: '2345678',
    sellerName: '环球海运有限公司',
    buyerName: '亚太船运集团',
    transactionAmount: 35000000,
    status: 'pending',
    submitTime: '2026-01-15 09:15',
    auditTime: null,
    issueTime: null,
    thirdParty: '中国船级社鉴证中心',
    certificateUrl: null,
    remarks: '第三方正在审核中'
  }
])

// 计算属性
const filteredCertificates = computed(() => {
  let result = allCertificates.value
  
  if (searchParams.value.keyword) {
    const keyword = searchParams.value.keyword.toLowerCase()
    result = result.filter(cert =>
      cert.certificateNo.toLowerCase().includes(keyword) ||
      cert.applicationNo.toLowerCase().includes(keyword) ||
      cert.sellerName.toLowerCase().includes(keyword) ||
      cert.buyerName.toLowerCase().includes(keyword)
    )
  }
  
  if (searchParams.value.status) {
    result = result.filter(cert => cert.status === searchParams.value.status)
  }
  
  // 按提交时间倒序排列
  result.sort((a, b) => new Date(b.submitTime) - new Date(a.submitTime))
  
  return result
})

const paginatedCertificates = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCertificates.value.slice(start, end)
})

const pendingCount = computed(() => allCertificates.value.filter(c => c.status === 'pending').length)
const waitingCount = computed(() => allCertificates.value.filter(c => c.status === 'waiting').length)
const issuedCount = computed(() => allCertificates.value.filter(c => c.status === 'issued').length)

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

const viewDetail = (cert) => {
  selectedCertificate.value = cert
  detailDialogVisible.value = true
}

const downloadCertificate = (cert) => {
  console.log('[v0] 下载鉴证书:', cert.applicationNo)
  ElMessage.success('正在下载鉴证书...')
  // 实际应该触发下载
  window.open(cert.certificateUrl, '_blank')
}

const getStatusLabel = (status) => {
  const labels = {
    pending: '审核中',
    waiting: '待下发',
    issued: '已下发'
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
  console.log('[v0] 鉴证书管理页面已加载')
})
</script>

<style scoped>
.certificate-manage-container {
  min-height: 100vh;
}

.search-filter-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
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

.badge-info {
  background: #dbeafe;
  color: #1e40af;
}

.search-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-form {
  padding: 16px 0;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.table-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.table-card :deep(.el-table) {
  font-size: 14px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 20px 0 0;
  margin-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.certificate-detail {
  padding: 20px 0;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
</style>

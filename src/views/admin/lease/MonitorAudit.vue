<template>
  <div class="monitor-audit-container">
    <!-- 审核列表视图 -->
    <div v-if="!selectedApplication" class="audit-list-view">
      <!-- 搜索筛选区域 -->
      <div class="search-filter-section">
        <div class="header-content">
          <h1 class="page-title">租后监测申请审核</h1>
          <div class="stats-badges">
            <span class="badge">待审核: {{ pendingCount }}</span>
            <span class="badge badge-success">已通过: {{ approvedCount }}</span>
            <span class="badge badge-danger">已驳回: {{ rejectedCount }}</span>
          </div>
        </div>

        <el-card class="search-card">
          <div class="search-form">
            <el-row :gutter="16" align="middle">
              <el-col :xs="24" :sm="12" :md="6">
                <el-input 
                  v-model="searchParams.keyword" 
                  placeholder="申请编号/企业名称/船舶名称"
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
              <el-col :xs="24" :sm="12" :md="6" class="search-actions">
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
          :data="paginatedApplications" 
          style="width: 100%"
          :border="true"
          stripe
          @row-click="handleSelectApplication"
        >
          <el-table-column prop="applicationNo" label="申请编号" width="160" />
          <el-table-column prop="vesselName" label="船舶名称" width="160" />
          <el-table-column prop="lessorName" label="出租方" min-width="180" />
          <el-table-column prop="lesseeName" label="承租方" min-width="180" />
          <el-table-column prop="leaseType" label="租赁类型" width="120" align="center">
            <template #default="{ row }">
              <el-tag size="small">{{ getLeaseTypeLabel(row.leaseType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="租赁期限" width="180">
            <template #default="{ row }">
              {{ formatDate(row.leaseStartDate) }} 至 {{ formatDate(row.leaseEndDate) }}
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
          <el-table-column prop="submittedTime" label="申请时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.submittedTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click.stop="handleSelectApplication(row)">
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
            :total="filteredApplications.length"
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
        <el-button @click="backToList" link>
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
        <h2>监测申请审核详情</h2>
      </div>

      <el-tabs v-model="activeTab">
        <!-- 基础信息 -->
        <el-tab-pane label="基础信息" name="basic">
          <el-card>
            <h3 class="section-title">申请信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="申请编号">
                {{ selectedApplication.applicationNo }}
              </el-descriptions-item>
              <el-descriptions-item label="申请时间">
                {{ formatDate(selectedApplication.submittedTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="船舶名称">
                {{ selectedApplication.vesselName }}
              </el-descriptions-item>
              <el-descriptions-item label="IMO编号">
                {{ selectedApplication.imo }}
              </el-descriptions-item>
              <el-descriptions-item label="出租方">
                {{ selectedApplication.lessorName }}
              </el-descriptions-item>
              <el-descriptions-item label="承租方">
                {{ selectedApplication.lesseeName }}
              </el-descriptions-item>
              <el-descriptions-item label="租赁类型">
                {{ getLeaseTypeLabel(selectedApplication.leaseType) }}
              </el-descriptions-item>
              <el-descriptions-item label="租赁期限">
                {{ formatDate(selectedApplication.leaseStartDate) }} 至 {{ formatDate(selectedApplication.leaseEndDate) }}
              </el-descriptions-item>
              <el-descriptions-item label="申请监测期限" :span="2">
                {{ formatDate(selectedApplication.monitorStartDate) }} 至 {{ formatDate(selectedApplication.monitorEndDate) }}
              </el-descriptions-item>
              <el-descriptions-item label="申请说明" :span="2">
                {{ selectedApplication.description || '无' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-tab-pane>

        <!-- 租赁合同信息 -->
        <el-tab-pane label="租赁合同" name="contract">
          <el-card>
            <h3 class="section-title">租赁合同信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="合同编号">
                {{ selectedApplication.contractNo }}
              </el-descriptions-item>
              <el-descriptions-item label="签订日期">
                {{ formatDate(selectedApplication.contractDate) }}
              </el-descriptions-item>
              <el-descriptions-item label="租金金额">
                ¥ {{ formatNumber(selectedApplication.rentalAmount) }}
              </el-descriptions-item>
              <el-descriptions-item label="支付周期">
                {{ selectedApplication.paymentCycle }}
              </el-descriptions-item>
            </el-descriptions>

            <div style="margin-top: 20px;">
              <h4 style="margin-bottom: 12px; font-size: 14px; color: #606266;">上传的合同文件</h4>
              <el-table :data="selectedApplication.contractFiles" border>
                <el-table-column prop="name" label="文件名称" />
                <el-table-column prop="uploadTime" label="上传时间" width="180">
                  <template #default="{ row }">
                    {{ formatDate(row.uploadTime) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="previewFile(row)">
                      预览
                    </el-button>
                    <el-button type="primary" link size="small" @click="downloadFile(row)">
                      下载
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- 审核记录 -->
        <el-tab-pane label="审核记录" name="history">
          <el-card>
            <el-timeline>
              <el-timeline-item
                v-for="record in selectedApplication.auditHistory"
                :key="record.time"
                :timestamp="formatDate(record.time)"
                placement="top"
              >
                <el-card>
                  <h4>{{ record.action }}</h4>
                  <p>{{ record.description }}</p>
                  <p style="color: #909399; font-size: 12px;">操作人: {{ record.operator }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-tab-pane>
      </el-tabs>

      <!-- 审核操作 -->
      <div class="audit-actions" v-if="selectedApplication.status === 'pending'">
        <el-button 
          type="danger" 
          @click="handleReject"
        >
          驳回申请
        </el-button>
        <el-button 
          type="success" 
          @click="handleApprove"
        >
          审核通过
        </el-button>
      </div>
    </div>

    <!-- 驳回对话框 -->
    <el-dialog v-model="rejectDialogVisible" title="驳回申请" width="600px">
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="驳回原因" required>
          <el-select v-model="rejectForm.reason" placeholder="请选择驳回原因">
            <el-option label="租赁信息不真实" value="invalid_lease" />
            <el-option label="申请期限与租赁期限不一致" value="period_mismatch" />
            <el-option label="合同资料缺失或不完整" value="incomplete_docs" />
            <el-option label="其他原因" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细说明" required>
          <el-input
            v-model="rejectForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入详细说明..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确认驳回</el-button>
      </template>
    </el-dialog>

    <!-- 审核通过对话框 -->
    <el-dialog v-model="approveDialogVisible" title="审核通过" width="600px">
      <el-form :model="approveForm" label-width="120px">
        <el-form-item label="监测服务编号">
          <el-input v-model="approveForm.monitoringNo" placeholder="系统自动生成" disabled />
        </el-form-item>
        <el-form-item label="数据查看权限" required>
          <el-checkbox-group v-model="approveForm.permissions">
            <el-checkbox label="position">船舶位置</el-checkbox>
            <el-checkbox label="speed">航行速度</el-checkbox>
            <el-checkbox label="route">航线轨迹</el-checkbox>
            <el-checkbox label="status">船舶状态</el-checkbox>
            <el-checkbox label="port">停靠港口</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="approveForm.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="success" @click="confirmApprove">确认通过</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

// 状态管理
const currentPage = ref(1)
const pageSize = ref(10)
const selectedApplication = ref(null)
const activeTab = ref('basic')
const rejectDialogVisible = ref(false)
const approveDialogVisible = ref(false)
const searchParams = ref({
  keyword: '',
  status: '',
  dateRange: null
})

const rejectForm = ref({
  reason: '',
  description: ''
})

const approveForm = ref({
  monitoringNo: '',
  permissions: ['position', 'speed', 'route', 'status'],
  remarks: ''
})

// Mock数据
const allApplications = ref([
  {
    id: 1,
    applicationNo: 'MON-2026010001',
    vesselName: 'OCEAN STAR',
    imo: '1234567',
    lessorName: '某航运有限公司',
    lesseeName: '青岛货运集团',
    leaseType: 'time',
    leaseStartDate: '2026-01-10',
    leaseEndDate: '2026-07-10',
    monitorStartDate: '2026-01-10',
    monitorEndDate: '2026-07-10',
    contractNo: 'LEASE-2026-001',
    contractDate: '2026-01-05',
    rentalAmount: 500000,
    paymentCycle: '月付',
    description: '需要实时监控船舶航行状态，确保按时到达指定港口',
    contractFiles: [
      { name: '租赁合同.pdf', uploadTime: '2026-01-08 10:20' }
    ],
    submittedTime: '2026-01-15 14:30',
    status: 'pending',
    auditHistory: [
      {
        time: '2026-01-15 14:30',
        action: '提交申请',
        description: '出租方提交租后监测服务申请',
        operator: '张三'
      }
    ]
  },
  {
    id: 2,
    applicationNo: 'MON-2026010002',
    vesselName: 'PACIFIC DREAMS',
    imo: '2345678',
    lessorName: '环球海运有限公司',
    lesseeName: '上海物流公司',
    leaseType: 'bareboat',
    leaseStartDate: '2026-01-12',
    leaseEndDate: '2026-12-12',
    monitorStartDate: '2026-01-12',
    monitorEndDate: '2026-12-12',
    contractNo: 'LEASE-2026-002',
    contractDate: '2026-01-06',
    rentalAmount: 800000,
    paymentCycle: '季付',
    description: '长期租赁，需要全程监控',
    contractFiles: [
      { name: '租赁合同.pdf', uploadTime: '2026-01-09 15:30' }
    ],
    submittedTime: '2026-01-14 09:15',
    status: 'approved',
    auditHistory: [
      {
        time: '2026-01-14 09:15',
        action: '提交申请',
        description: '出租方提交租后监测服务申请',
        operator: '李四'
      },
      {
        time: '2026-01-14 16:20',
        action: '审核通过',
        description: '审核通过，已开通监测权限',
        operator: '运营人员A'
      }
    ]
  }
])

// 计算属性
const filteredApplications = computed(() => {
  let result = allApplications.value

  if (searchParams.value.keyword) {
    const keyword = searchParams.value.keyword.toLowerCase()
    result = result.filter(app =>
      app.applicationNo.toLowerCase().includes(keyword) ||
      app.vesselName.toLowerCase().includes(keyword) ||
      app.lessorName.toLowerCase().includes(keyword) ||
      app.lesseeName.toLowerCase().includes(keyword)
    )
  }

  if (searchParams.value.status) {
    result = result.filter(app => app.status === searchParams.value.status)
  }

  return result
})

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredApplications.value.slice(start, end)
})

const pendingCount = computed(() => 
  allApplications.value.filter(app => app.status === 'pending').length
)
const approvedCount = computed(() => 
  allApplications.value.filter(app => app.status === 'approved').length
)
const rejectedCount = computed(() => 
  allApplications.value.filter(app => app.status === 'rejected').length
)

// 方法
const handleSearch = () => {
  currentPage.value = 1
  console.log('[v0] 执行搜索:', searchParams.value)
}

const resetSearch = () => {
  searchParams.value = {
    keyword: '',
    status: '',
    dateRange: null
  }
  handleSearch()
}

const handleSelectApplication = (app) => {
  console.log('[v0] 选择申请:', app.id)
  const fullApp = allApplications.value.find(a => a.id === app.id)
  if (fullApp) {
    selectedApplication.value = fullApp
    activeTab.value = 'basic'
  }
}

const backToList = () => {
  selectedApplication.value = null
}

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handlePageChange = (newPage) => {
  currentPage.value = newPage
}

const handleReject = () => {
  rejectForm.value = { reason: '', description: '' }
  rejectDialogVisible.value = true
}

const confirmReject = () => {
  if (!rejectForm.value.reason || !rejectForm.value.description) {
    ElMessage.warning('请完整填写驳回信息')
    return
  }

  selectedApplication.value.status = 'rejected'
  selectedApplication.value.auditHistory.push({
    time: new Date().toISOString(),
    action: '审核驳回',
    description: `驳回原因：${rejectForm.value.description}`,
    operator: '运营人员'
  })

  ElMessage.success('已驳回申请')
  rejectDialogVisible.value = false
  setTimeout(() => {
    selectedApplication.value = null
  }, 1500)
}

const handleApprove = () => {
  approveForm.value = {
    monitoringNo: `MON-SRV-${Date.now()}`,
    permissions: ['position', 'speed', 'route', 'status'],
    remarks: ''
  }
  approveDialogVisible.value = true
}

const confirmApprove = () => {
  if (approveForm.value.permissions.length === 0) {
    ElMessage.warning('请至少选择一项数据查看权限')
    return
  }

  selectedApplication.value.status = 'approved'
  selectedApplication.value.monitoringNo = approveForm.value.monitoringNo
  selectedApplication.value.auditHistory.push({
    time: new Date().toISOString(),
    action: '审核通过',
    description: `已开通监测服务，监测编号：${approveForm.value.monitoringNo}`,
    operator: '运营人员'
  })

  ElMessage.success('审核通过，已开通监测服务')
  approveDialogVisible.value = false
  setTimeout(() => {
    selectedApplication.value = null
  }, 1500)
}

const previewFile = (file) => {
  console.log('[v0] 预览文件:', file.name)
  ElMessage.info('文件预览功能')
}

const downloadFile = (file) => {
  console.log('[v0] 下载文件:', file.name)
  ElMessage.success('开始下载文件')
}

const getStatusLabel = (status) => {
  const labels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回'
  }
  return labels[status] || status
}

const getLeaseTypeLabel = (type) => {
  const labels = {
    time: '期租',
    bareboat: '光租',
    voyage: '航次租'
  }
  return labels[type] || type
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatNumber = (num) => {
  return num?.toLocaleString('zh-CN') || '0'
}
</script>

<style scoped>
.monitor-audit-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.header-content {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
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

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.table-card {
  margin-top: 20px;
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

.audit-detail-view {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.detail-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
}

.audit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}
</style>

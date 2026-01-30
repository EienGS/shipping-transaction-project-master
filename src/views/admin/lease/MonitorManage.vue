<template>
  <div class="monitor-manage-container">
    <!-- 列表视图 -->
    <div v-if="!selectedMonitoring" class="manage-list-view">
      <!-- 搜索筛选区域 -->
      <div class="search-filter-section">
        <div class="header-content">
          <h1 class="page-title">监测服务管控</h1>
          <div class="stats-badges">
            <span class="badge badge-success">监测中: {{ activeCount }}</span>
            <span class="badge badge-warning">即将到期: {{ expiringCount }}</span>
            <span class="badge">已到期: {{ expiredCount }}</span>
          </div>
        </div>

        <el-card class="search-card">
          <div class="search-form">
            <el-row :gutter="16" align="middle">
              <el-col :xs="24" :sm="12" :md="6">
                <el-input 
                  v-model="searchParams.keyword" 
                  placeholder="监测编号/企业名称/船舶名称"
                  clearable
                  @keyup.enter="handleSearch"
                />
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-select 
                  v-model="searchParams.status" 
                  placeholder="服务状态"
                  clearable
                  @change="handleSearch"
                >
                  <el-option label="监测中" value="active" />
                  <el-option label="即将到期" value="expiring" />
                  <el-option label="已到期" value="expired" />
                  <el-option label="已终止" value="terminated" />
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

      <!-- 服务表格 -->
      <el-card class="table-card">
        <el-table 
          :data="paginatedMonitorings" 
          style="width: 100%"
          :border="true"
          stripe
          @row-click="handleSelectMonitoring"
        >
          <el-table-column prop="monitoringNo" label="监测编号" width="160" />
          <el-table-column prop="vesselName" label="船舶名称" width="160" />
          <el-table-column prop="lessorName" label="出租方" min-width="180" />
          <el-table-column prop="lesseeName" label="承租方" min-width="180" />
          <el-table-column label="监测期限" width="200">
            <template #default="{ row }">
              {{ formatDate(row.monitorStartDate) }} 至 {{ formatDate(row.monitorEndDate) }}
            </template>
          </el-table-column>
          <el-table-column label="剩余天数" width="120" align="center">
            <template #default="{ row }">
              <span :style="{ color: getRemainingDaysColor(row.remainingDays) }">
                {{ row.remainingDays }} 天
              </span>
            </template>
          </el-table-column>
          <el-table-column label="服务状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="getStatusTagType(row.status)"
                size="small"
              >
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="activationTime" label="开通时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.activationTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click.stop="handleSelectMonitoring(row)">
                查看详情
              </el-button>
              <el-button 
                v-if="row.status === 'active'"
                type="danger" 
                link 
                size="small" 
                @click.stop="handleTerminate(row)"
              >
                终止服务
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
            :total="filteredMonitorings.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 详情视图 -->
    <div v-else class="manage-detail-view">
      <div class="detail-header">
        <el-button @click="backToList" link>
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
        <h2>监测服务详情</h2>
      </div>

      <el-tabs v-model="activeTab">
        <!-- 基础信息 -->
        <el-tab-pane label="基础信息" name="basic">
          <el-card>
            <h3 class="section-title">监测服务信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="监测编号">
                {{ selectedMonitoring.monitoringNo }}
              </el-descriptions-item>
              <el-descriptions-item label="服务状态">
                <el-tag :type="getStatusTagType(selectedMonitoring.status)">
                  {{ getStatusLabel(selectedMonitoring.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="船舶名称">
                {{ selectedMonitoring.vesselName }}
              </el-descriptions-item>
              <el-descriptions-item label="IMO编号">
                {{ selectedMonitoring.imo }}
              </el-descriptions-item>
              <el-descriptions-item label="出租方">
                {{ selectedMonitoring.lessorName }}
              </el-descriptions-item>
              <el-descriptions-item label="承租方">
                {{ selectedMonitoring.lesseeName }}
              </el-descriptions-item>
              <el-descriptions-item label="监测期限" :span="2">
                {{ formatDate(selectedMonitoring.monitorStartDate) }} 至 {{ formatDate(selectedMonitoring.monitorEndDate) }}
              </el-descriptions-item>
              <el-descriptions-item label="剩余天数">
                <span :style="{ color: getRemainingDaysColor(selectedMonitoring.remainingDays), fontWeight: 600 }">
                  {{ selectedMonitoring.remainingDays }} 天
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="开通时间">
                {{ formatDate(selectedMonitoring.activationTime) }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card style="margin-top: 20px;">
            <h3 class="section-title">数据权限配置</h3>
            <el-tag 
              v-for="perm in selectedMonitoring.permissions" 
              :key="perm" 
              style="margin-right: 8px; margin-bottom: 8px;"
              type="success"
            >
              {{ getPermissionLabel(perm) }}
            </el-tag>
          </el-card>
        </el-tab-pane>

        <!-- 租赁信息 -->
        <el-tab-pane label="租赁信息" name="lease">
          <el-card>
            <h3 class="section-title">租赁合同信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="合同编号">
                {{ selectedMonitoring.contractNo }}
              </el-descriptions-item>
              <el-descriptions-item label="租赁类型">
                {{ getLeaseTypeLabel(selectedMonitoring.leaseType) }}
              </el-descriptions-item>
              <el-descriptions-item label="租赁期限" :span="2">
                {{ formatDate(selectedMonitoring.leaseStartDate) }} 至 {{ formatDate(selectedMonitoring.leaseEndDate) }}
              </el-descriptions-item>
              <el-descriptions-item label="租金金额">
                ¥ {{ formatNumber(selectedMonitoring.rentalAmount) }}
              </el-descriptions-item>
              <el-descriptions-item label="支付周期">
                {{ selectedMonitoring.paymentCycle }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-tab-pane>

        <!-- 操作记录 -->
        <el-tab-pane label="操作记录" name="history">
          <el-card>
            <el-timeline>
              <el-timeline-item
                v-for="record in selectedMonitoring.operationHistory"
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

      <!-- 操作按钮 -->
      <div class="detail-actions" v-if="selectedMonitoring.status === 'active'">
        <el-button type="danger" @click="handleTerminate(selectedMonitoring)">
          终止服务
        </el-button>
      </div>
    </div>

    <!-- 终止服务对话框 -->
    <el-dialog v-model="terminateDialogVisible" title="终止监测服务" width="600px">
      <el-alert
        title="警告"
        type="warning"
        description="终止服务后，出租方将无法继续查看船舶监测数据，该操作不可恢复，请谨慎操作！"
        :closable="false"
        style="margin-bottom: 20px;"
      />
      <el-form :model="terminateForm" label-width="100px">
        <el-form-item label="终止原因" required>
          <el-select v-model="terminateForm.reason" placeholder="请选择终止原因">
            <el-option label="租赁期限已到期" value="lease_expired" />
            <el-option label="合同提前终止" value="contract_terminated" />
            <el-option label="出租方申请终止" value="lessor_request" />
            <el-option label="服务违规" value="violation" />
            <el-option label="其他原因" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细说明" required>
          <el-input
            v-model="terminateForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入详细说明..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="terminateDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmTerminate">确认终止</el-button>
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
const selectedMonitoring = ref(null)
const activeTab = ref('basic')
const terminateDialogVisible = ref(false)
const searchParams = ref({
  keyword: '',
  status: '',
  dateRange: null
})

const terminateForm = ref({
  reason: '',
  description: ''
})

// Mock数据
const allMonitorings = ref([
  {
    id: 1,
    monitoringNo: 'MON-SRV-001',
    vesselName: 'PACIFIC DREAMS',
    imo: '2345678',
    lessorName: '环球海运有限公司',
    lesseeName: '上海物流公司',
    leaseType: 'bareboat',
    contractNo: 'LEASE-2026-002',
    monitorStartDate: '2026-01-12',
    monitorEndDate: '2026-12-12',
    leaseStartDate: '2026-01-12',
    leaseEndDate: '2026-12-12',
    rentalAmount: 800000,
    paymentCycle: '季付',
    remainingDays: 330,
    status: 'active',
    activationTime: '2026-01-14 16:20',
    permissions: ['position', 'speed', 'route', 'status', 'port'],
    operationHistory: [
      {
        time: '2026-01-14 16:20',
        action: '服务开通',
        description: '监测服务已开通，配置数据查看权限',
        operator: '运营人员A'
      }
    ]
  },
  {
    id: 2,
    monitoringNo: 'MON-SRV-002',
    vesselName: 'OCEAN STAR',
    imo: '1234567',
    lessorName: '某航运有限公司',
    lesseeName: '青岛货运集团',
    leaseType: 'time',
    contractNo: 'LEASE-2026-001',
    monitorStartDate: '2025-12-01',
    monitorEndDate: '2026-02-28',
    leaseStartDate: '2025-12-01',
    leaseEndDate: '2026-02-28',
    rentalAmount: 500000,
    paymentCycle: '月付',
    remainingDays: 28,
    status: 'expiring',
    activationTime: '2025-12-02 10:00',
    permissions: ['position', 'speed', 'route', 'status'],
    operationHistory: [
      {
        time: '2025-12-02 10:00',
        action: '服务开通',
        description: '监测服务已开通',
        operator: '运营人员B'
      }
    ]
  },
  {
    id: 3,
    monitoringNo: 'MON-SRV-003',
    vesselName: 'GLOBAL TRADER',
    imo: '3456789',
    lessorName: '远洋航运有限公司',
    lesseeName: '港澳海运公司',
    leaseType: 'voyage',
    contractNo: 'LEASE-2025-150',
    monitorStartDate: '2025-10-01',
    monitorEndDate: '2025-12-31',
    leaseStartDate: '2025-10-01',
    leaseEndDate: '2025-12-31',
    rentalAmount: 300000,
    paymentCycle: '一次性',
    remainingDays: -15,
    status: 'expired',
    activationTime: '2025-10-03 14:30',
    permissions: ['position', 'speed', 'route'],
    operationHistory: [
      {
        time: '2025-10-03 14:30',
        action: '服务开通',
        description: '监测服务已开通',
        operator: '运营人员C'
      },
      {
        time: '2026-01-01 00:00',
        action: '服务到期',
        description: '监测期限已到期，系统自动关闭权限',
        operator: '系统'
      }
    ]
  }
])

// 计算属性
const filteredMonitorings = computed(() => {
  let result = allMonitorings.value

  if (searchParams.value.keyword) {
    const keyword = searchParams.value.keyword.toLowerCase()
    result = result.filter(mon =>
      mon.monitoringNo.toLowerCase().includes(keyword) ||
      mon.vesselName.toLowerCase().includes(keyword) ||
      mon.lessorName.toLowerCase().includes(keyword) ||
      mon.lesseeName.toLowerCase().includes(keyword)
    )
  }

  if (searchParams.value.status) {
    result = result.filter(mon => mon.status === searchParams.value.status)
  }

  return result
})

const paginatedMonitorings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMonitorings.value.slice(start, end)
})

const activeCount = computed(() => 
  allMonitorings.value.filter(mon => mon.status === 'active').length
)
const expiringCount = computed(() => 
  allMonitorings.value.filter(mon => mon.status === 'expiring').length
)
const expiredCount = computed(() => 
  allMonitorings.value.filter(mon => mon.status === 'expired').length
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

const handleSelectMonitoring = (mon) => {
  console.log('[v0] 选择监测服务:', mon.id)
  const fullMon = allMonitorings.value.find(m => m.id === mon.id)
  if (fullMon) {
    selectedMonitoring.value = fullMon
    activeTab.value = 'basic'
  }
}

const backToList = () => {
  selectedMonitoring.value = null
}

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handlePageChange = (newPage) => {
  currentPage.value = newPage
}

const handleTerminate = (mon) => {
  const fullMon = allMonitorings.value.find(m => m.id === mon.id)
  if (fullMon) {
    selectedMonitoring.value = fullMon
  }
  terminateForm.value = { reason: '', description: '' }
  terminateDialogVisible.value = true
}

const confirmTerminate = () => {
  if (!terminateForm.value.reason || !terminateForm.value.description) {
    ElMessage.warning('请完整填写终止信息')
    return
  }

  const monitoring = selectedMonitoring.value || allMonitorings.value.find(m => m.id === selectedMonitoring.value?.id)
  if (monitoring) {
    monitoring.status = 'terminated'
    monitoring.operationHistory.push({
      time: new Date().toISOString(),
      action: '服务终止',
      description: `终止原因：${terminateForm.value.description}`,
      operator: '运营人员'
    })
  }

  ElMessage.success('监测服务已终止')
  terminateDialogVisible.value = false
  if (selectedMonitoring.value) {
    setTimeout(() => {
      selectedMonitoring.value = null
    }, 1500)
  }
}

const getStatusLabel = (status) => {
  const labels = {
    active: '监测中',
    expiring: '即将到期',
    expired: '已到期',
    terminated: '已终止'
  }
  return labels[status] || status
}

const getStatusTagType = (status) => {
  const types = {
    active: 'success',
    expiring: 'warning',
    expired: 'info',
    terminated: 'danger'
  }
  return types[status] || ''
}

const getLeaseTypeLabel = (type) => {
  const labels = {
    time: '期租',
    bareboat: '光租',
    voyage: '航次租'
  }
  return labels[type] || type
}

const getPermissionLabel = (perm) => {
  const labels = {
    position: '船舶位置',
    speed: '航行速度',
    route: '航线轨迹',
    status: '船舶状态',
    port: '停靠港口'
  }
  return labels[perm] || perm
}

const getRemainingDaysColor = (days) => {
  if (days < 0) return '#909399'
  if (days <= 7) return '#f56c6c'
  if (days <= 30) return '#e6a23c'
  return '#67c23a'
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
.monitor-manage-container {
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
  background: #f1f5f9;
  color: #475569;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
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

.manage-detail-view {
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

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}
</style>

<template>
  <div class="service-center">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">服务中心</h1>
      <p class="page-description">管理您的服务需求与服务提供状态</p>
    </div>

    <!-- 角色切换 -->
    <div class="role-section">
      <el-segmented v-model="currentRole" :options="roleOptions" size="large" />
    </div>

    <!-- 搜索筛选区域 -->
    <el-card class="search-card">
      <el-row :gutter="16" align="middle">
        <el-col :xs="24" :sm="12" :md="6">
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索服务标题"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select 
            v-model="filterStatus" 
            placeholder="筛选状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="服务中" value="inProgress" />
            <el-option label="已完成" value="completed" />
            <el-option label="待运营介入" value="needIntervention" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="4" class="search-actions">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 服务列表 -->
    <el-card class="service-list-card">

      <!-- 服务卡片列表 -->
      <div v-if="filteredServices.length === 0" class="empty-state">
        <el-empty description="暂无服务记录" />
      </div>
      <div v-else class="services-grid">
        <div v-for="service in filteredServices" :key="service.id" class="service-card">
          <div class="service-header">
            <div class="service-title-row">
              <h3 class="service-title">{{ service.title }}</h3>
              <el-tag 
                :type="getStatusTagType(service.status)" 
                size="large"
              >
                {{ getStatusLabel(service.status) }}
              </el-tag>
            </div>
            <div class="service-meta">
              <span class="type-badge" :class="`type-${service.type}`">
                {{ getTypeLabel(service.type) }}
              </span>
              <span class="service-no">{{ service.serviceNo }}</span>
            </div>
          </div>

          <div class="service-body">
            <div class="info-row">
              <span class="label">{{ currentRole === 'demander' ? '服务提供方' : '需求方' }}:</span>
              <span class="value">{{ currentRole === 'demander' ? service.provider : service.demander }}</span>
            </div>
            <div class="info-row">
              <span class="label">联系电话:</span>
              <span class="value">{{ service.contactPhone }}</span>
            </div>
            <div class="info-row">
              <span class="label">创建时间:</span>
              <span class="value">{{ service.createTime }}</span>
            </div>
            <div v-if="service.status === 'completed' && service.rating" class="info-row">
              <span class="label">服务评分:</span>
              <span class="value rating">
                <el-rate v-model="service.rating" disabled size="small" />
              </span>
            </div>
          </div>

          <div class="service-actions">
            <el-button type="primary" link @click="viewServiceDetail(service)">查看详情</el-button>
            
            <!-- 服务提供方：服务中状态可以提交完成报告 -->
            <el-button 
              v-if="currentRole === 'provider' && service.status === 'inProgress' && !service.providerSubmitted"
              type="success" 
              @click="submitServiceReport(service)"
            >
              提交完成报告
            </el-button>
            
            <!-- 需求方：等待确认时可以确认或拒绝 -->
            <template v-if="currentRole === 'demander' && service.status === 'inProgress' && service.providerSubmitted">
              <el-button type="success" @click="confirmService(service)">确认完成</el-button>
              <el-button type="warning" @click="rejectService(service)">不予确认</el-button>
            </template>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 提交完成报告对话框 -->
    <el-dialog 
      v-model="reportDialogVisible" 
      title="提交服务完成报告" 
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="reportForm" label-width="100px">
        <el-form-item label="服务说明">
          <el-input 
            v-model="reportForm.description" 
            type="textarea" 
            :rows="4"
            placeholder="请详细描述已完成的服务内容"
          />
        </el-form-item>
        <el-form-item label="上传附件">
          <el-upload
            v-model:file-list="reportForm.attachments"
            action="#"
            :auto-upload="false"
            multiple
            :limit="5"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">最多上传5个文件，支持图片、文档等格式</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReport">提交报告</el-button>
      </template>
    </el-dialog>

    <!-- 确认完成对话框 -->
    <el-dialog 
      v-model="confirmDialogVisible" 
      title="确认服务完成" 
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="confirmForm" label-width="100px">
        <el-form-item label="服务评分" required>
          <el-rate v-model="confirmForm.rating" size="large" />
        </el-form-item>
        <el-form-item label="评价内容" required>
          <el-input 
            v-model="confirmForm.comment" 
            type="textarea" 
            :rows="4"
            placeholder="请对本次服务进行评价"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitConfirm">确认完成</el-button>
      </template>
    </el-dialog>

    <!-- 拒绝确认对话框 -->
    <el-dialog 
      v-model="rejectDialogVisible" 
      title="不予确认" 
      width="600px"
      :close-on-click-modal="false"
    >
      <el-alert 
        title="提交后将等待运营人员介入处理" 
        type="warning" 
        :closable="false"
        style="margin-bottom: 20px"
      />
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="拒绝原因" required>
          <el-input 
            v-model="rejectForm.reason" 
            type="textarea" 
            :rows="4"
            placeholder="请说明服务未达预期的原因"
          />
        </el-form-item>
        <el-form-item label="相关材料">
          <el-upload
            v-model:file-list="rejectForm.attachments"
            action="#"
            :auto-upload="false"
            multiple
            :limit="5"
          >
            <el-button type="primary">上传证明材料</el-button>
            <template #tip>
              <div class="el-upload__tip">如有相关证明材料，请一并上传</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="warning" @click="submitReject">提交</el-button>
      </template>
    </el-dialog>

    <!-- 服务详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="服务详情" 
      width="700px"
    >
      <div v-if="selectedService" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="服务编号">{{ selectedService.serviceNo }}</el-descriptions-item>
          <el-descriptions-item label="服务类型">{{ getTypeLabel(selectedService.type) }}</el-descriptions-item>
          <el-descriptions-item label="需求标题" :span="2">{{ selectedService.title }}</el-descriptions-item>
          <el-descriptions-item label="需求方">{{ selectedService.demander }}</el-descriptions-item>
          <el-descriptions-item label="服务提供方">{{ selectedService.provider }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedService.createTime }}</el-descriptions-item>
          <el-descriptions-item label="服务状态">
            <el-tag :type="getStatusTagType(selectedService.status)">
              {{ getStatusLabel(selectedService.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 服务提供方提交的报告 -->
        <div v-if="selectedService.providerReport" class="report-section">
          <h3>服务完成报告</h3>
          <div class="report-content">
            <p>{{ selectedService.providerReport.description }}</p>
            <div v-if="selectedService.providerReport.attachments?.length" class="attachments">
              <h4>附件:</h4>
              <div class="attachment-list">
                <el-tag 
                  v-for="(file, index) in selectedService.providerReport.attachments" 
                  :key="index"
                  type="info"
                >
                  {{ file.name }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 需求方的评价 -->
        <div v-if="selectedService.status === 'completed' && selectedService.evaluation" class="evaluation-section">
          <h3>服务评价</h3>
          <div class="evaluation-content">
            <div class="rating-row">
              <span>评分:</span>
              <el-rate v-model="selectedService.rating" disabled />
            </div>
            <p>{{ selectedService.evaluation.comment }}</p>
          </div>
        </div>

        <!-- 拒绝确认的信息 -->
        <div v-if="selectedService.status === 'needIntervention' && selectedService.rejection" class="rejection-section">
          <h3>拒绝确认信息</h3>
          <div class="rejection-content">
            <p><strong>拒绝原因:</strong> {{ selectedService.rejection.reason }}</p>
            <div v-if="selectedService.rejection.attachments?.length" class="attachments">
              <h4>相关材料:</h4>
              <div class="attachment-list">
                <el-tag 
                  v-for="(file, index) in selectedService.rejection.attachments" 
                  :key="index"
                  type="warning"
                >
                  {{ file.name }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 角色选项
const roleOptions = [
  { label: '我是需求方', value: 'demander' },
  { label: '我是服务方', value: 'provider' }
]
const currentRole = ref('demander')

// 搜索和筛选
const searchKeyword = ref('')
const filterStatus = ref('')
const dateRange = ref(null)

// 对话框控制
const reportDialogVisible = ref(false)
const confirmDialogVisible = ref(false)
const rejectDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const selectedService = ref(null)

// 表单数据
const reportForm = ref({
  description: '',
  attachments: []
})

const confirmForm = ref({
  rating: 0,
  comment: ''
})

const rejectForm = ref({
  reason: '',
  attachments: []
})

// Mock 服务数据
const services = ref([
  {
    id: 1,
    serviceNo: 'SVC-2026010001',
    type: 'design',
    title: '5万吨散货船设计方案',
    demander: '某航运有限公司',
    provider: 'XX船舶设计研究所',
    contactPhone: '021-12345678',
    createTime: '2026-01-20 10:30',
    status: 'inProgress', // inProgress, completed, needIntervention
    providerSubmitted: false,
    rating: 0,
    providerReport: null,
    evaluation: null,
    rejection: null
  },
  {
    id: 2,
    serviceNo: 'SVC-2026010002',
    type: 'building',
    title: '3500吨集装箱船建造',
    demander: '海运集团',
    provider: '青岛XX造船厂',
    contactPhone: '0532-98765432',
    createTime: '2026-01-18 14:20',
    status: 'inProgress',
    providerSubmitted: true,
    rating: 0,
    providerReport: {
      description: '已完成船体建造、动力系统安装、涂装等全部工序，各项指标符合设计要求',
      attachments: [
        { name: '建造完成报告.pdf' },
        { name: '检测证书.pdf' }
      ]
    },
    evaluation: null,
    rejection: null
  },
  {
    id: 3,
    serviceNo: 'SVC-2026010003',
    type: 'repair',
    title: '主机维修保养',
    demander: '远洋运输公司',
    provider: '上海XX船舶修理厂',
    contactPhone: '021-87654321',
    createTime: '2026-01-15 09:45',
    status: 'completed',
    providerSubmitted: true,
    rating: 5,
    providerReport: {
      description: '已完成主机大修、更换磨损部件、调试测试，设备运行正常',
      attachments: [
        { name: '维修报告.pdf' }
      ]
    },
    evaluation: {
      comment: '服务专业，维修质量高，设备运行稳定，非常满意！'
    },
    rejection: null
  }
])

// 计算属性 - 过滤后的服务列表
const filteredServices = computed(() => {
  let filtered = services.value
  
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(s => s.title.toLowerCase().includes(keyword))
  }
  
  // 状态筛选
  if (filterStatus.value) {
    filtered = filtered.filter(s => s.status === filterStatus.value)
  }
  
  // 日期范围筛选
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    filtered = filtered.filter(s => {
      const serviceDate = new Date(s.createTime)
      return serviceDate >= start && serviceDate <= end
    })
  }
  
  return filtered
})

// 方法
const handleSearch = () => {
  console.log('[v0] 执行搜索', { searchKeyword: searchKeyword.value, filterStatus: filterStatus.value, dateRange: dateRange.value })
}

const resetSearch = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  dateRange.value = null
  console.log('[v0] 重置搜索条件')
}

const getTypeLabel = (type) => {
  const labels = {
    design: '设计',
    building: '建造',
    repair: '维修'
  }
  return labels[type] || type
}

const getStatusLabel = (status) => {
  const labels = {
    inProgress: '服务中',
    completed: '已完成',
    needIntervention: '待运营介入'
  }
  return labels[status] || status
}

const getStatusTagType = (status) => {
  const types = {
    inProgress: 'warning',
    completed: 'success',
    needIntervention: 'danger'
  }
  return types[status] || 'info'
}

// 查看服务详情
const viewServiceDetail = (service) => {
  selectedService.value = service
  detailDialogVisible.value = true
  console.log('[v0] 查看服务详情:', service.id)
}

// 提交完成报告
const submitServiceReport = (service) => {
  selectedService.value = service
  reportForm.value = {
    description: '',
    attachments: []
  }
  reportDialogVisible.value = true
  console.log('[v0] 提交完成报告:', service.id)
}

const submitReport = () => {
  if (!reportForm.value.description) {
    ElMessage.warning('请填写服务说明')
    return
  }
  
  selectedService.value.providerSubmitted = true
  selectedService.value.providerReport = {
    description: reportForm.value.description,
    attachments: reportForm.value.attachments.map(f => ({ name: f.name }))
  }
  
  reportDialogVisible.value = false
  ElMessage.success('服务完成报告已提交，等待需求方确认')
  console.log('[v0] 报告已提交:', selectedService.value.id)
}

// 确认服务完成
const confirmService = (service) => {
  selectedService.value = service
  confirmForm.value = {
    rating: 0,
    comment: ''
  }
  confirmDialogVisible.value = true
  console.log('[v0] 确认服务完成:', service.id)
}

const submitConfirm = () => {
  if (confirmForm.value.rating === 0) {
    ElMessage.warning('请选择评分')
    return
  }
  if (!confirmForm.value.comment) {
    ElMessage.warning('请填写评价内容')
    return
  }
  
  selectedService.value.status = 'completed'
  selectedService.value.rating = confirmForm.value.rating
  selectedService.value.evaluation = {
    comment: confirmForm.value.comment
  }
  
  confirmDialogVisible.value = false
  ElMessage.success('服务已确认完成')
  console.log('[v0] 服务已确认完成:', selectedService.value.id)
}

// 拒绝确认
const rejectService = (service) => {
  selectedService.value = service
  rejectForm.value = {
    reason: '',
    attachments: []
  }
  rejectDialogVisible.value = true
  console.log('[v0] 拒绝确认服务:', service.id)
}

const submitReject = () => {
  if (!rejectForm.value.reason) {
    ElMessage.warning('请填写拒绝原因')
    return
  }
  
  selectedService.value.status = 'needIntervention'
  selectedService.value.rejection = {
    reason: rejectForm.value.reason,
    attachments: rejectForm.value.attachments.map(f => ({ name: f.name }))
  }
  
  rejectDialogVisible.value = false
  ElMessage.warning('已提交不予确认，等待运营人员介入处理')
  console.log('[v0] 已拒绝确认:', selectedService.value.id)
}
</script>

<style scoped>
.service-center {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 角色切换 */
.role-section {
  margin-bottom: 24px;
}

.role-section :deep(.el-segmented) {
  width: 100%;
  max-width: 400px;
}

/* 搜索筛选区域 */
.search-card {
  margin-bottom: 24px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-card :deep(.el-input),
.search-card :deep(.el-select),
.search-card :deep(.el-date-picker) {
  width: 100%;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 服务列表 */
.service-list-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 20px;
}

.service-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.service-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.service-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.service-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.service-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  flex: 1;
}

.service-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.type-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.type-design {
  background: #EFF6FF;
  color: #1D4ED8;
}

.type-building {
  background: #DCFCE7;
  color: #166534;
}

.type-repair {
  background: #FEF3C7;
  color: #92400E;
}

.service-no {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.service-body {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.info-row .label {
  color: #64748b;
  font-weight: 500;
}

.info-row .value {
  color: #0f172a;
  font-weight: 600;
}

.info-row .rating {
  display: flex;
  align-items: center;
}

.service-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 详情对话框 */
.detail-content {
  max-height: 70vh;
  overflow-y: auto;
}

.report-section,
.evaluation-section,
.rejection-section {
  margin-top: 24px;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
}

.report-section h3,
.evaluation-section h3,
.rejection-section h3 {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.report-content p,
.evaluation-content p,
.rejection-content p {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.attachments {
  margin-top: 12px;
}

.attachments h4 {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 8px 0;
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}
</style>

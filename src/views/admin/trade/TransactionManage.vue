<template>
  <div class="transaction-manage-container">
    <!-- 列表视图 -->
    <div v-if="!showForm" class="list-view">
      <!-- 搜索筛选区域 -->
      <div class="search-filter-section">
        <div class="header-content">
          <h1 class="page-title">成交信息管理</h1>
          <div class="header-actions">
            <el-button type="primary" icon="Plus" @click="handleAddTransaction">
              录入成交信息
            </el-button>
          </div>
        </div>

        <el-card class="search-card">
          <div class="search-form">
            <el-row :gutter="16" align="middle">
              <el-col :xs="24" :sm="12" :md="5">
                <el-date-picker
                  v-model="searchParams.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="handleSearch"
                  style="width: 100%"
                />
              </el-col>
              <el-col :xs="24" :sm="12" :md="4">
                <el-select 
                  v-model="searchParams.vesselType" 
                  placeholder="船舶类型"
                  clearable
                  @change="handleSearch"
                >
                  <el-option label="散货船" value="bulk" />
                  <el-option label="集装箱船" value="container" />
                  <el-option label="油轮" value="tanker" />
                  <el-option label="客船" value="passenger" />
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="12" :md="4">
                <el-select 
                  v-model="searchParams.transactionType" 
                  placeholder="交易方式"
                  clearable
                  @change="handleSearch"
                >
                  <el-option label="关联鉴证" value="verification" />
                  <el-option label="手动录入" value="manual" />
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="12" :md="5">
                <el-input 
                  v-model="searchParams.amountRange" 
                  placeholder="成交金额区间（万元）"
                  clearable
                />
              </el-col>
              <el-col :xs="24" :sm="12" :md="3">
                <el-input 
                  v-model="searchParams.operator" 
                  placeholder="录入人"
                  clearable
                />
              </el-col>
              <el-col :xs="24" :sm="12" :md="3">
                <el-button type="primary" @click="handleSearch" style="width: 100%">
                  查询
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>

      <!-- 数据统计 -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-label">本月成交</div>
          <div class="stat-value">{{ stats.monthlyCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">累计成交金额</div>
          <div class="stat-value highlight">¥{{ stats.totalAmount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已发布</div>
          <div class="stat-value success">{{ stats.publishedCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已下架</div>
          <div class="stat-value danger">{{ stats.archivedCount }}</div>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="toolbar">
        <span class="record-count">共 {{ transactions.length }} 条记录</span>
        <el-button type="default" icon="Download" @click="handleExport">
          导出Excel
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-card class="table-card">
        <el-table :data="transactions" stripe style="width: 100%">
          <el-table-column prop="id" label="编号" width="100" />
          <el-table-column prop="vesselName" label="船舶名称" width="150" />
          <el-table-column prop="vesselType" label="船舶类型" width="120" />
          <el-table-column prop="deadweight" label="载重吨" width="100" />
          <el-table-column prop="vesselAge" label="船龄" width="80" />
          <el-table-column prop="amount" label="成交金额(万元)" width="130">
            <template #default="{ row }">
              <span class="amount-text">{{ row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="transactionDate" label="成交时间" width="120" />
          <el-table-column prop="transactionType" label="录入模式" width="100">
            <template #default="{ row }">
              <el-tag :type="row.transactionType === 'verification' ? 'success' : 'info'" size="small">
                {{ row.transactionType === 'verification' ? '关联鉴证' : '手动录入' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="verificationNo" label="关联申请编号" width="150">
            <template #default="{ row }">
              <span v-if="row.verificationNo">{{ row.verificationNo }}</span>
              <span v-else style="color: #94a3b8;">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
                {{ row.status === 'published' ? '已发布' : '已下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="录入人" width="100" />
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="handleView(row)">
                查看
              </el-button>
              <el-button link type="primary" size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button 
                link 
                :type="row.status === 'published' ? 'warning' : 'success'" 
                size="small" 
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 'published' ? '下架' : '上架' }}
              </el-button>
              <el-button link type="danger" size="small" @click="handleDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 表单/详情视图 -->
    <div v-else class="form-view">
      <div class="form-header">
        <el-button text icon="ArrowLeft" @click="handleBack">
          返回列表
        </el-button>
        <h2>{{ showDetail ? '成交信息详情' : (isEditing ? '编辑成交信息' : '录入成交信息') }}</h2>
        <span />
      </div>

      <!-- 详情视图 -->
      <el-card v-if="showDetail" class="detail-card">
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">编号</span>
              <span class="detail-value">{{ detailData?.id }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">录入模式</span>
              <span class="detail-value">
                <el-tag :type="detailData?.transactionType === 'verification' ? 'success' : 'info'" size="small">
                  {{ detailData?.transactionType === 'verification' ? '关联鉴证' : '手动录入' }}
                </el-tag>
              </span>
            </div>
            <div class="detail-item" v-if="detailData?.verificationNo">
              <span class="detail-label">关联鉴证申请编号</span>
              <span class="detail-value highlight">{{ detailData?.verificationNo }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">船舶名称</span>
              <span class="detail-value">{{ detailData?.vesselName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">船舶类型</span>
              <span class="detail-value">{{ detailData?.vesselType }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">载重吨</span>
              <span class="detail-value">{{ detailData?.deadweight }} DWT</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">船龄</span>
              <span class="detail-value">{{ detailData?.vesselAge }} 年</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">成交金额</span>
              <span class="detail-value price">¥{{ detailData?.amount }} 万元</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">成交时间</span>
              <span class="detail-value">{{ detailData?.transactionDate }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">状态</span>
              <span class="detail-value">
                <el-tag :type="detailData?.status === 'published' ? 'success' : 'info'" size="small">
                  {{ detailData?.status === 'published' ? '已发布' : '已下架' }}
                </el-tag>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">录入人</span>
              <span class="detail-value">{{ detailData?.operator }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 表单视图 -->
      <el-card v-else class="form-card">
        <el-form :model="formData" :rules="formRules" ref="formRef" label-width="140px">
          <!-- 录入模式选择 -->
          <el-form-item label="录入模式">
            <el-radio-group v-model="formData.entryMode" @change="handleModeChange">
              <el-radio label="association">关联录入</el-radio>
              <el-radio label="manual">手动录入</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 关联录入 -->
          <template v-if="formData.entryMode === 'association'">
            <el-form-item label="搜索关联">
              <el-input 
                v-model="searchKeyword" 
                placeholder="输入交易鉴证编号或船舶名称搜索"
                @input="handleAssociationSearch"
              >
                <template #append>
                  <el-button icon="Search" @click="handleAssociationSearch" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item v-if="associationResults.length > 0" label="选择记录">
              <el-select v-model="selectedAssociation" placeholder="请选择关联记录" @change="handleAssociationSelect" style="width: 100%">
                <el-option 
                  v-for="item in associationResults" 
                  :key="item.id" 
                  :label="`${item.vesselName} - ${item.verificationNo}`" 
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>

          <!-- 船舶核心信息 -->
          <el-divider content-position="left">船舶核心信息</el-divider>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="船舶名称" prop="vesselName">
                <el-input v-model="formData.vesselName" placeholder="请输入船舶名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="船舶类型" prop="vesselType">
                <el-select v-model="formData.vesselType" placeholder="请选择船舶类型" style="width: 100%">
                  <el-option label="散货船" value="bulk" />
                  <el-option label="集装箱船" value="container" />
                  <el-option label="油轮" value="tanker" />
                  <el-option label="客船" value="passenger" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="建造年份">
                <el-date-picker 
                  v-model="formData.buildYear" 
                  type="year" 
                  placeholder="选择建造年份"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="船籍港">
                <el-input v-model="formData.registryPort" placeholder="请输入船籍港" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="航区" prop="navigationArea">
                <el-select v-model="formData.navigationArea" placeholder="请选择航区" style="width: 100%">
                  <el-option label="无限航区" value="unlimited" />
                  <el-option label="近海航区" value="coastal" />
                  <el-option label="沿海航区" value="offshore" />
                  <el-option label="内河航区" value="inland" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="船级">
                <el-input v-model="formData.classification" placeholder="请输入船级" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 交易信息 -->
          <el-divider content-position="left">交易信息</el-divider>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="载重吨" prop="deadweight">
                <el-input v-model.number="formData.deadweight" placeholder="请输入载重吨" type="number">
                  <template #append>DWT</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="船龄" prop="vesselAge">
                <el-input v-model.number="formData.vesselAge" placeholder="请输入船龄" type="number">
                  <template #append>年</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="成交金额" prop="amount">
                <el-input v-model.number="formData.amount" placeholder="请输入成交金额" type="number">
                  <template #append>万元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成交时间" prop="transactionDate">
                <el-date-picker 
                  v-model="formData.transactionDate" 
                  type="date" 
                  placeholder="选择成交时间"
                  :disabled-date="disabledDate"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 选填信息 -->
          <el-divider content-position="left">选填信息</el-divider>

          <el-form-item label="成交备注">
            <el-input 
              v-model="formData.remarks" 
              type="textarea" 
              :rows="4"
              maxlength="200"
              show-word-limit
              placeholder="可填写交易核心亮点，如'5000吨散货船近洋航线成交'，用于用户端案例展示补充"
            />
          </el-form-item>

          <el-form-item label="成交凭证上传">
            <el-upload
              class="upload-demo"
              :on-change="handleFileChange"
              :before-upload="beforeUpload"
              :file-list="fileList"
              accept=".pdf"
              :limit="1"
            >
              <el-button type="primary" icon="Upload">上传PDF文件</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  仅支持PDF格式，单文件不超过20MB，可选上传双方成交确认单，仅运营端可见
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
              {{ isEditing ? '保存修改' : '提交发布' }}
            </el-button>
            <el-button @click="handleBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 视图控制
const showForm = ref(false)
const isEditing = ref(false)
const submitLoading = ref(false)

// 搜索参数
const searchParams = reactive({
  dateRange: null,
  vesselType: '',
  transactionType: '',
  amountRange: '',
  operator: ''
})

// 统计数据
const stats = reactive({
  monthlyCount: 12,
  totalAmount: '8.5亿',
  publishedCount: 45,
  archivedCount: 8
})

// 交易数据
const transactions = ref([
  {
    id: 'TX202401001',
    vesselName: 'PACIFIC HERO',
    vesselType: '散货船',
    deadweight: 61000,
    vesselAge: 6,
    amount: 8500,
    transactionDate: '2024-01-15',
    transactionType: 'verification',
    verificationNo: 'VER202401001',
    status: 'published',
    operator: '张三'
  },
  {
    id: 'TX202401002',
    vesselName: 'OCEAN STAR',
    vesselType: '集装箱船',
    deadweight: 50000,
    vesselAge: 8,
    amount: 7200,
    transactionDate: '2024-01-10',
    transactionType: 'manual',
    verificationNo: null,
    status: 'published',
    operator: '李四'
  },
  {
    id: 'TX202401003',
    vesselName: 'SEA PRIDE',
    vesselType: '油轮',
    deadweight: 45000,
    vesselAge: 5,
    amount: 9800,
    transactionDate: '2024-01-08',
    transactionType: 'verification',
    verificationNo: 'VER202401002',
    status: 'archived',
    operator: '王五'
  }
])

// 表单数据
const formData = reactive({
  entryMode: 'association',
  vesselName: '',
  vesselType: '',
  buildYear: null,
  registryPort: '',
  navigationArea: '',
  classification: '',
  deadweight: null,
  vesselAge: null,
  amount: null,
  transactionDate: null,
  remarks: '',
  document: null
})

// 表单验证规则
const formRules = {
  vesselName: [{ required: true, message: '请输入船舶名称', trigger: 'blur' }],
  vesselType: [{ required: true, message: '请选择船舶类型', trigger: 'change' }],
  navigationArea: [{ required: true, message: '请选择航区', trigger: 'change' }],
  deadweight: [{ required: true, message: '请输入载重吨', trigger: 'blur' }],
  vesselAge: [{ required: true, message: '请输入船龄', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入成交金额', trigger: 'blur' }],
  transactionDate: [{ required: true, message: '请选择成交时间', trigger: 'change' }]
}

const formRef = ref(null)
const fileList = ref([])
const searchKeyword = ref('')
const selectedAssociation = ref(null)
const associationResults = ref([])

// 关联录入搜索
const handleAssociationSearch = () => {
  console.log('[v0] 搜索关联记录:', searchKeyword.value)
  // 模拟搜索结果
  associationResults.value = [
    { id: 1, vesselName: 'PACIFIC HERO', verificationNo: 'VF202401001' },
    { id: 2, vesselName: 'OCEAN STAR', verificationNo: 'VF202401002' }
  ]
}

// 选择关联记录
const handleAssociationSelect = (id) => {
  console.log('[v0] 选择关联记录:', id)
  const selected = associationResults.value.find(item => item.id === id)
  if (selected) {
    // 自动预填信息
    formData.vesselName = selected.vesselName
    formData.vesselType = 'bulk'
    formData.buildYear = new Date('2018-01-01')
    formData.registryPort = 'ZHOUSHAN'
    formData.navigationArea = 'unlimited'
    formData.classification = 'CCS'
    ElMessage.success('已关联记录，船舶信息已自动填充')
  }
}

// 录入模式切换
const handleModeChange = (mode) => {
  console.log('[v0] 切换录入模式:', mode)
  // 清空表单
  Object.keys(formData).forEach(key => {
    if (key !== 'entryMode') {
      formData[key] = key.includes('Date') || key === 'buildYear' ? null : ''
    }
  })
  searchKeyword.value = ''
  selectedAssociation.value = null
  associationResults.value = []
}

// 禁用未来日期
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

// 文件上传前校验
const beforeUpload = (file) => {
  const isPDF = file.type === 'application/pdf'
  const isLt20M = file.size / 1024 / 1024 < 20

  if (!isPDF) {
    ElMessage.error('只能上传PDF格式文件!')
    return false
  }
  if (!isLt20M) {
    ElMessage.error('文件大小不能超过20MB!')
    return false
  }
  return true
}

// 文件变化
const handleFileChange = (file, fileList) => {
  console.log('[v0] 文件变化:', file)
}

// 搜索
const handleSearch = () => {
  console.log('[v0] 搜索参数:', searchParams)
  ElMessage.info('搜索功能开发中')
}

// 添加交易
const handleAddTransaction = () => {
  showForm.value = true
  isEditing.value = false
  showDetail.value = false
}

// 查看详情
const showDetail = ref(false)
const detailData = ref(null)
const handleView = (row) => {
  console.log('[v0] 查看详情:', row)
  detailData.value = row
  showDetail.value = true
  showForm.value = true
  isEditing.value = false
}

// 编辑
const handleEdit = (row) => {
  console.log('[v0] 编辑:', row)
  showForm.value = true
  isEditing.value = false
  showDetail.value = false
  // 填充表单数据
  Object.assign(formData, {
    entryMode: row.transactionType === 'verification' ? 'association' : 'manual',
    vesselName: row.vesselName,
    vesselType: row.vesselType === '散货船' ? 'bulk' : 'container',
    deadweight: row.deadweight,
    vesselAge: row.vesselAge,
    amount: row.amount,
    transactionDate: new Date(row.transactionDate),
    verificationNo: row.verificationNo
  })
}

// 切换状态
const handleToggleStatus = (row) => {
  const action = row.status === 'published' ? '下架' : '上架'
  ElMessageBox.confirm(
    `确定要${action}该成交信息吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = row.status === 'published' ? 'archived' : 'published'
    ElMessage.success(`${action}成功`)
  }).catch(() => {})
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该成交信息吗？删除后数据将无法恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    const index = transactions.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      transactions.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 导出
const handleExport = () => {
  console.log('[v0] 导出Excel')
  ElMessage.success('导出功能开发中')
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      console.log('[v0] 提交表单:', formData)
      
      setTimeout(() => {
        submitLoading.value = false
        ElMessage.success(isEditing.value ? '修改成功' : '发布成功')
        handleBack()
      }, 1000)
    }
  })
}

// 返回列表
const handleBack = () => {
  showForm.value = false
  isEditing.value = false
  formRef.value?.resetFields()
}
</script>

<style scoped>
.transaction-manage-container {
  padding: 24px;
  background: #F8FAFC;
  min-height: 100vh;
}

.list-view {
  max-width: 1400px;
  margin: 0 auto;
}

.search-filter-section {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.search-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-form {
  padding: 8px 0;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-label {
  font-size: 13px;
  color: #64748B;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
}

.stat-value.highlight {
  color: #EF4444;
}

.stat-value.success {
  color: #10B981;
}

.stat-value.danger {
  color: #F59E0B;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.record-count {
  font-size: 14px;
  color: #64748B;
}

.table-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.amount-text {
  color: #EF4444;
  font-weight: 600;
}

.form-view {
  max-width: 1000px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E2E8F0;
}

.form-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  flex: 1;
  text-align: center;
}

.form-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: #0F172A;
}

:deep(.el-upload__tip) {
  margin-top: 8px;
  font-size: 12px;
  color: #64748B;
}
</style>

<template>
  <div class="verification-center-container">
    <!-- Search & Filter Section (TradeFavorites style) -->
    <div class="search-filter-section">
      <div class="header-content">
        <h1 class="page-title">交易鉴证中心</h1>
        <div class="stats-badge">共 {{ allVerifications.length }} 项鉴证</div>
      </div>

      <div class="search-card">
        <div class="search-main-row">
          <div class="search-input-wrapper">
            <div class="input-with-icon">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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

    <!-- Verifications Grid -->
    <div class="verifications-grid">
      <div v-for="verification in filteredVerifications" :key="verification.id" class="verification-card">
        <div class="card-content">
          <div class="card-header">
            <div class="title-section">
              <h3 class="card-title">{{ verification.vesselName }}</h3>
              <span class="status-badge" :class="`status-${verification.status}`">
                {{ getStatusLabel(verification.status) }}
              </span>
            </div>
          </div>

          <div class="card-info">
            <div class="info-item">
              <span class="info-label">鉴证编号</span>
              <span class="info-value">{{ verification.verificationNo }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">交易类型</span>
              <span class="info-value">{{ verification.type }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">对方</span>
              <span class="info-value">{{ verification.counterparty }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">申请时间</span>
              <span class="info-value">{{ verification.createdAt }}</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="action-buttons-group">
            <button class="btn-detail" @click="openDetail(verification.id)">查看详情</button>
            <!-- Fill button for both parties when in filling status -->
            <button v-if="verification.status === 'filling' && !verification.filledByCurrentUser" class="btn-fill" @click="startFilling(verification.id)">
              开始填报
            </button>
            <!-- Submit review button for seller when both filled -->
            <button v-if="verification.status === 'filling' && verification.sellerFilled && verification.buyerFilled && isCurrentUserSeller(verification)" class="btn-submit-review" @click="submitForReview(verification.id)">
              提交审核
            </button>
            <!-- Download certificate button when approved -->
            <button v-if="verification.status === 'approved'" class="btn-download" @click="downloadCertificate(verification.id)">
              下载鉴证书
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredVerifications.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>暂无数据</h3>
        <p>还没有交易鉴证记录</p>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="detailModalVisible" class="modal-overlay" @click.self="detailModalVisible = false">
      <div class="modal-content verification-detail">
        <div class="modal-header">
          <h2>鉴证详情</h2>
          <button class="close-btn" @click="detailModalVisible = false">✕</button>
        </div>

        <div class="modal-body">
          <div class="detail-tabs">
            <button v-for="tab in detailTabs" :key="tab" :class="['tab-button', { active: activeDetailTab === tab }]" @click="activeDetailTab = tab">
              {{ getTabLabel(tab) }}
            </button>
          </div>

          <!-- Basic Information Tab -->
          <div v-if="activeDetailTab === 'basic'" class="detail-section">
            <h3>基本信息</h3>
            <div class="detail-row">
              <span class="detail-label">鉴证编号</span>
              <span class="detail-value">{{ selectedVerification?.verificationNo }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">交易类型</span>
              <span class="detail-value">{{ selectedVerification?.type }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">船舶名称</span>
              <span class="detail-value">{{ selectedVerification?.vesselName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">卖方</span>
              <span class="detail-value">{{ selectedVerification?.seller }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">买方</span>
              <span class="detail-value">{{ selectedVerification?.buyer }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">交易金额</span>
              <span class="detail-value">{{ selectedVerification?.amount }}</span>
            </div>
          </div>

          <!-- Official Documents Tab -->
          <div v-if="activeDetailTab === 'documents'" class="detail-section">
            <h3>官方证书核对</h3>
            <div class="documents-section">
              <div class="document-item">
                <h4>船舶所有权证书</h4>
                <div class="document-content">
                  <p><strong>证号：</strong>{{ selectedVerification?.ownershipCert?.certNo }}</p>
                  <p><strong>所有人：</strong>{{ selectedVerification?.ownershipCert?.owner }}</p>
                  <p><strong>颁发日期：</strong>{{ selectedVerification?.ownershipCert?.issueDate }}</p>
                </div>
                <div v-if="selectedVerification?.status === 'filling'" class="cert-actions">
                  <button class="btn-small" @click="confirmDocuments">确认无误</button>
                  <button class="btn-small secondary" @click="uploadSupplementary">补充上传</button>
                </div>
              </div>

              <div class="document-item">
                <h4>船舶检验证书</h4>
                <div class="document-content">
                  <p><strong>证号：</strong>{{ selectedVerification?.inspectionCert?.certNo }}</p>
                  <p><strong>颁发日期：</strong>{{ selectedVerification?.inspectionCert?.issueDate }}</p>
                  <p><strong>有效期至：</strong>{{ selectedVerification?.inspectionCert?.expireDate }}</p>
                </div>
              </div>

              <div class="document-item">
                <h4>船级证书</h4>
                <div class="document-content">
                  <p><strong>船级社：</strong>{{ selectedVerification?.classCert?.society }}</p>
                  <p><strong>等级：</strong>{{ selectedVerification?.classCert?.grade }}</p>
                  <p><strong>有效期至：</strong>{{ selectedVerification?.classCert?.expireDate }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- File Upload Tab -->
          <div v-if="activeDetailTab === 'files'" class="detail-section">
            <h3>电子文件提交</h3>
            <div class="file-upload-section">
              <h4>需要上传的文件</h4>
              <div class="file-requirements">
                <p v-if="isCurrentUserSeller(selectedVerification)">
                  <strong>企业方：</strong>营业执照（加盖电子公章）、经办人身份证正反面
                </p>
                <p v-else>
                  <strong>个体船东方：</strong>身份证正反面
                </p>
              </div>

              <div class="uploaded-files">
                <h5>已上传文件</h5>
                <div v-for="file in selectedVerification?.uploadedFiles" :key="file.id" class="file-item">
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-size">({{ file.size }})</span>
                  <div class="file-actions">
                    <button class="btn-small" @click="previewFile(file.id)">预览</button>
                    <button class="btn-small secondary" @click="deleteFile(file.id)">删除</button>
                  </div>
                </div>
              </div>

              <div v-if="selectedVerification?.status === 'filling'" class="file-upload-input">
                <input type="file" @change="handleFileUpload" multiple accept=".pdf,.jpg,.jpeg">
                <p class="file-tips">支持PDF、JPG格式，单文件不超过20MB</p>
              </div>
            </div>
          </div>

          <!-- Status & Review Tab -->
          <div v-if="activeDetailTab === 'status'" class="detail-section">
            <h3>审核进度</h3>
            <div class="status-timeline">
              <div class="timeline-item" :class="{ active: selectedVerification?.status !== 'filling' }">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h5>填报完成</h5>
                  <p v-if="selectedVerification?.filledAt">{{ selectedVerification?.filledAt }}</p>
                </div>
              </div>
              <div class="timeline-item" :class="{ active: selectedVerification?.status !== 'filling' && selectedVerification?.status !== 'rejected' }">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h5>待审核</h5>
                  <p v-if="selectedVerification?.submittedAt">{{ selectedVerification?.submittedAt }}</p>
                </div>
              </div>
              <div class="timeline-item" :class="{ active: selectedVerification?.status === 'approved' || selectedVerification?.status === 'rejected' }">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h5>审核结果</h5>
                  <p v-if="selectedVerification?.reviewedAt">{{ selectedVerification?.reviewedAt }}</p>
                  <p v-if="selectedVerification?.status === 'approved'" class="text-success">✓ 已通过</p>
                  <p v-else-if="selectedVerification?.status === 'rejected'" class="text-danger">✗ 未通过</p>
                </div>
              </div>
            </div>

            <div v-if="selectedVerification?.status === 'rejected'" class="rejection-reason">
              <h5>审核意见</h5>
              <p>{{ selectedVerification?.rejectionReason }}</p>
            </div>
          </div>
        </div>

        <div v-if="selectedVerification?.status === 'filling'" class="modal-footer">
          <button class="btn-cancel" @click="detailModalVisible = false">关闭</button>
          <button class="btn-save" @click="saveFilledInfo">保存</button>
        </div>
      </div>
    </div>

    <!-- Fill Modal -->
    <div v-if="fillModalVisible" class="modal-overlay" @click.self="fillModalVisible = false">
      <div class="modal-content fill-modal">
        <div class="modal-header">
          <h2>填报信息</h2>
          <button class="close-btn" @click="fillModalVisible = false">✕</button>
        </div>

        <div class="modal-body">
          <div class="fill-steps">
            <div class="step" :class="{ active: fillStep === 1, completed: fillStep > 1 }">
              <div class="step-number">1</div>
              <div class="step-title">基本信息</div>
            </div>
            <div class="step" :class="{ active: fillStep === 2, completed: fillStep > 2 }">
              <div class="step-number">2</div>
              <div class="step-title">核对证书</div>
            </div>
            <div class="step" :class="{ active: fillStep === 3 }">
              <div class="step-number">3</div>
              <div class="step-title">上传文件</div>
            </div>
          </div>

          <!-- Step 1: Basic Information -->
          <div v-if="fillStep === 1" class="fill-form">
            <h4>核心交易信息</h4>
            <div class="form-group">
              <label>交易金额</label>
              <input v-model="fillForm.amount" type="text" placeholder="请输入交易金额">
            </div>
            <div class="form-group">
              <label>交付时间</label>
              <input v-model="fillForm.deliveryDate" type="date">
            </div>
            <div class="form-group">
              <label>经办人</label>
              <input v-model="fillForm.contactPerson" type="text" placeholder="请输入经办人姓名">
            </div>
            <div class="form-group">
              <label>经办人联系方式</label>
              <input v-model="fillForm.contactPhone" type="tel" placeholder="请输入联系电话">
            </div>
          </div>

          <!-- Step 2: Document Confirmation -->
          <div v-if="fillStep === 2" class="fill-form">
            <h4>官方证书确认</h4>
            <div class="document-confirm">
              <p>系统已自动获取以下官方证书，请核实信息是否一致：</p>
              <div class="confirm-items">
                <div class="confirm-item">
                  <input type="checkbox" v-model="fillForm.confirmOwnership">
                  <label>船舶所有权证书信息一致</label>
                </div>
                <div class="confirm-item">
                  <input type="checkbox" v-model="fillForm.confirmInspection">
                  <label>船舶检验证书信息一致</label>
                </div>
                <div class="confirm-item">
                  <input type="checkbox" v-model="fillForm.confirmClass">
                  <label>船级证书信息一致</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: File Upload -->
          <div v-if="fillStep === 3" class="fill-form">
            <h4>上传所需文件</h4>
            <div class="file-upload-area">
              <input type="file" @change="handleFileUpload" multiple accept=".pdf,.jpg,.jpeg">
              <p>拖拽文件到此或点击选择</p>
              <p class="tips">支持PDF、JPG格式，单文件不超过20MB</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="fillStep > 1" class="btn-cancel" @click="fillStep--">上一步</button>
          <button v-if="fillStep < 3" class="btn-next" @click="nextFillStep">下一步</button>
          <button v-if="fillStep === 3" class="btn-submit" @click="completeFilling">完成填报</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// States
const searchKeyword = ref('')
const filterStatus = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

// Detail modal states
const detailModalVisible = ref(false)
const selectedVerification = ref(null)
const activeDetailTab = ref('basic')
const detailTabs = ['basic', 'documents', 'files', 'status']

// Fill modal states
const fillModalVisible = ref(false)
const fillStep = ref(1)
const fillingVerificationId = ref(null)
const fillForm = ref({
  amount: '',
  deliveryDate: '',
  contactPerson: '',
  contactPhone: '',
  confirmOwnership: false,
  confirmInspection: false,
  confirmClass: false
})

// Mock verifications data
const verifications = ref([
  {
    id: 1,
    verificationNo: 'Y2025012600001',
    type: '出售',
    vesselName: '散货船 "OCEAN STAR"',
    seller: 'PACIFIC SHIPPING LTD.',
    buyer: 'SHANGHAI TRADING CO. LTD.',
    counterparty: '张某',
    status: 'filling',
    createdAt: '2026-02-05',
    filledByCurrentUser: false,
    sellerFilled: false,
    buyerFilled: false,
    amount: '¥8500万元',
    ownershipCert: { certNo: 'ZC-OWN-2018-001', owner: 'PACIFIC SHIPPING LTD.', issueDate: '2018-06-01' },
    inspectionCert: { certNo: 'ZC-INS-2018-001', issueDate: '2018-06-01', expireDate: '2028-05-30' },
    classCert: { society: 'CCS', grade: '61000 DWT', expireDate: '2023-11-20' },
    uploadedFiles: [],
    rejectionReason: ''
  },
  {
    id: 2,
    verificationNo: 'Y2025012600002',
    type: '求购',
    vesselName: '5.7万吨散货船',
    seller: '江某',
    buyer: 'ZHONG YANG SHIPPING',
    counterparty: '江某',
    status: 'waiting_review',
    createdAt: '2026-02-04',
    filledByCurrentUser: true,
    sellerFilled: true,
    buyerFilled: true,
    amount: '¥3500万元',
    ownershipCert: { certNo: 'ZC-OWN-2020-002', owner: 'JIANG SHI', issueDate: '2020-01-15' },
    inspectionCert: { certNo: 'ZC-INS-2020-002', issueDate: '2020-01-15', expireDate: '2025-01-14' },
    classCert: { society: 'ABS', grade: '57000 DWT', expireDate: '2024-06-15' },
    uploadedFiles: [
      { id: 1, name: '营业执照.pdf', size: '2.3MB' },
      { id: 2, name: '身份证正面.jpg', size: '1.5MB' }
    ],
    submittedAt: '2026-02-04 10:30:00',
    rejectionReason: ''
  },
  {
    id: 3,
    verificationNo: 'Y2025012600003',
    type: '出售',
    vesselName: '集装箱船 "PACIFIC LINK"',
    seller: 'PACIFIC SHIPPING',
    buyer: '赵某',
    counterparty: '赵某',
    status: 'approved',
    createdAt: '2026-02-02',
    filledByCurrentUser: true,
    sellerFilled: true,
    buyerFilled: true,
    amount: '¥4200万元',
    ownershipCert: { certNo: 'ZC-OWN-2019-001', owner: 'PACIFIC SHIPPING', issueDate: '2019-03-01' },
    inspectionCert: { certNo: 'ZC-INS-2019-001', issueDate: '2019-03-01', expireDate: '2024-02-28' },
    classCert: { society: 'DNV', grade: '32000 TEU', expireDate: '2024-12-15' },
    uploadedFiles: [
      { id: 3, name: '营业执照.pdf', size: '2.1MB' },
      { id: 4, name: '身份证正面.jpg', size: '1.8MB' }
    ],
    reviewedAt: '2026-02-03 14:20:00',
    rejectionReason: ''
  }
])

// Computed
const allVerifications = computed(() => verifications.value.length)

const filteredVerifications = computed(() => {
  let result = verifications.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(v =>
      v.verificationNo.toLowerCase().includes(keyword) ||
      v.vesselName.toLowerCase().includes(keyword) ||
      v.counterparty.toLowerCase().includes(keyword)
    )
  }

  if (filterStatus.value) {
    result = result.filter(v => v.status === filterStatus.value)
  }

  if (dateStart.value) {
    result = result.filter(v => v.createdAt >= dateStart.value)
  }

  if (dateEnd.value) {
    result = result.filter(v => v.createdAt <= dateEnd.value)
  }

  return result
})

// Methods
const getStatusLabel = (status) => {
  const labels = {
    filling: '填报中',
    waiting_review: '待审核',
    reviewing: '审核中',
    approved: '已通过',
    rejected: '未通过'
  }
  return labels[status] || status
}

const getTabLabel = (tab) => {
  const labels = {
    basic: '基本信息',
    documents: '官方证书',
    files: '文件上传',
    status: '审核进度'
  }
  return labels[tab] || tab
}

const isCurrentUserSeller = (verification) => {
  // Mock: assume current user is seller for simplicity
  return true
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

const openDetail = (id) => {
  selectedVerification.value = verifications.value.find(v => v.id === id)
  activeDetailTab.value = 'basic'
  detailModalVisible.value = true
}

const startFilling = (id) => {
  fillingVerificationId.value = id
  fillStep.value = 1
  fillForm.value = {
    amount: '',
    deliveryDate: '',
    contactPerson: '',
    contactPhone: '',
    confirmOwnership: false,
    confirmInspection: false,
    confirmClass: false
  }
  fillModalVisible.value = true
}

const nextFillStep = () => {
  if (fillStep.value < 3) {
    fillStep.value++
  }
}

const completeFilling = () => {
  const verification = verifications.value.find(v => v.id === fillingVerificationId.value)
  if (verification) {
    verification.filledByCurrentUser = true
    verification.buyerFilled = true
    verification.filledAt = new Date().toLocaleString('zh-CN')
    console.log('[v0] 完成填报')
    fillModalVisible.value = false
  }
}

const submitForReview = (id) => {
  const verification = verifications.value.find(v => v.id === id)
  if (verification) {
    verification.status = 'waiting_review'
    verification.submittedAt = new Date().toLocaleString('zh-CN')
    console.log('[v0] 提交审核')
  }
}

const downloadCertificate = (id) => {
  console.log('[v0] 下载鉴证书:', id)
  // Mock download
  alert('鉴证书已下载')
}

const confirmDocuments = () => {
  console.log('[v0] 确认官方文件无误')
}

const uploadSupplementary = () => {
  console.log('[v0] 补充上传')
}

const handleFileUpload = (event) => {
  const files = event.target.files
  console.log('[v0] 上传文件:', files)
}

const previewFile = (fileId) => {
  console.log('[v0] 预览文件:', fileId)
}

const deleteFile = (fileId) => {
  if (selectedVerification.value) {
    selectedVerification.value.uploadedFiles = selectedVerification.value.uploadedFiles.filter(f => f.id !== fileId)
  }
  console.log('[v0] 删除文件:', fileId)
}

const saveFilledInfo = () => {
  console.log('[v0] 保存填报信息')
}

onMounted(() => {
  const intentionId = route.query.intentionId
  if (intentionId) {
    console.log('[v0] 从意向跳转，意向ID:', intentionId)
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
  letter-spacing: 0.3px;
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
}

.verifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.verification-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.verification-card:hover {
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
  background: #FEE2E2;
  color: #DC2626;
}

.status-reviewing {
  background: #FEF3C7;
  color: #D97706;
}

.status-approved {
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
.btn-fill,
.btn-submit-review,
.btn-download {
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

.btn-fill,
.btn-submit-review {
  background: #8B5CF6;
  color: white;
}

.btn-fill:hover,
.btn-submit-review:hover {
  background: #7C3AED;
}

.btn-download {
  background: #10B981;
  color: white;
}

.btn-download:hover {
  background: #059669;
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

/* Modal Styles */
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
}

.verification-detail {
  max-width: 800px;
}

.fill-modal {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #E2E8F0;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
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

.detail-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #E2E8F0;
  margin-bottom: 24px;
}

.tab-button {
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
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

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #F1F5F9;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #64748B;
  font-weight: 500;
  font-size: 14px;
}

.detail-value {
  color: #0F172A;
  font-weight: 600;
  font-size: 14px;
  text-align: right;
}

.documents-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.document-item {
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
}

.document-item h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.document-content p {
  margin: 8px 0;
  font-size: 13px;
  color: #64748B;
}

.cert-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn-small {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #0EA5E9;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-small:hover {
  background: #0284C7;
}

.btn-small.secondary {
  background: #E2E8F0;
  color: #475569;
  border: 1px solid #CBD5E1;
}

.btn-small.secondary:hover {
  background: #CBD5E1;
}

.file-upload-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-requirements {
  padding: 12px;
  background: #EFF6FF;
  border-left: 3px solid #0EA5E9;
  border-radius: 4px;
  font-size: 13px;
  color: #475569;
}

.uploaded-files {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uploaded-files h5 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #F1F5F9;
  border-radius: 4px;
  font-size: 13px;
}

.file-name {
  font-weight: 500;
  color: #0F172A;
}

.file-size {
  color: #94A3B8;
  font-size: 12px;
}

.file-actions {
  display: flex;
  gap: 6px;
}

.file-upload-input {
  padding: 16px;
  border: 2px dashed #CBD5E1;
  border-radius: 8px;
  text-align: center;
}

.file-upload-input input {
  display: none;
}

.file-tips {
  font-size: 12px;
  color: #94A3B8;
  margin: 8px 0 0 0;
}

.status-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-left: 2px solid #E2E8F0;
  padding-left: 16px;
  position: relative;
}

.timeline-item.active {
  border-left-color: #0EA5E9;
}

.timeline-dot {
  position: absolute;
  left: -8px;
  top: 20px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #E2E8F0;
}

.timeline-item.active .timeline-dot {
  background: #0EA5E9;
}

.timeline-content h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
}

.timeline-content p {
  margin: 0;
  font-size: 13px;
  color: #64748B;
}

.text-success {
  color: #059669 !important;
}

.text-danger {
  color: #DC2626 !important;
}

.rejection-reason {
  padding: 12px;
  background: #FEE2E2;
  border-left: 3px solid #DC2626;
  border-radius: 4px;
  margin-top: 16px;
}

.rejection-reason h5 {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: #991B1B;
}

.rejection-reason p {
  margin: 0;
  font-size: 13px;
  color: #DC2626;
}

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

.btn-save,
.btn-submit {
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

.btn-save:hover,
.btn-submit:hover {
  background: #0284C7;
}

/* Fill Modal Specific */
.fill-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E2E8F0;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.step.active .step-number {
  background: #0EA5E9;
  color: white;
}

.step.completed .step-number {
  background: #10B981;
  color: white;
}

.step-title {
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  text-align: center;
}

.fill-form {
  margin-bottom: 24px;
}

.fill-form h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.08);
}

.document-confirm {
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
}

.confirm-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.confirm-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confirm-item input {
  cursor: pointer;
}

.confirm-item label {
  font-size: 13px;
  color: #475569;
  cursor: pointer;
}

.file-upload-area {
  padding: 32px;
  border: 2px dashed #CBD5E1;
  border-radius: 8px;
  text-align: center;
  background: #F8FAFC;
  cursor: pointer;
  transition: all 0.3s;
}

.file-upload-area:hover {
  border-color: #0EA5E9;
  background: #EFF6FF;
}

.file-upload-area input {
  display: none;
}

.file-upload-area p {
  margin: 8px 0;
  font-size: 14px;
  color: #475569;
}

.tips {
  font-size: 12px;
  color: #94A3B8;
}

.btn-next {
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

.btn-next:hover {
  background: #0284C7;
}

@media (max-width: 768px) {
  .search-main-row {
    flex-direction: column;
    gap: 12px;
  }

  .search-input-wrapper {
    width: 100%;
  }

  .filter-controls-inline {
    width: 100%;
    flex-direction: column;
  }

  .select-item {
    width: 100%;
  }

  .verifications-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-height: 90vh;
  }

  .fill-steps {
    flex-wrap: wrap;
  }
}
</style>

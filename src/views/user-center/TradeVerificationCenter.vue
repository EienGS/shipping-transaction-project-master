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

    <!-- Filling Modal -->
    <div v-if="fillingModalVisible" class="modal-overlay" @click.self="fillingModalVisible = false">
      <div class="modal-content large-modal">
        <div class="modal-header">
          <h2>{{ selectedVerification?.verificationNo }} - 鉴证信息填报</h2>
          <button class="close-btn" @click="fillingModalVisible = false">✕</button>
        </div>

        <!-- Step Indicator -->
        <div class="steps-indicator">
          <div :class="['step', { active: currentStep === 1, completed: currentStep > 1 }]">
            <div class="step-number">1</div>
            <div class="step-label">基本信息</div>
          </div>
          <div class="step-connector" :class="{ completed: currentStep > 1 }"></div>
          <div :class="['step', { active: currentStep === 2, completed: currentStep > 2 }]">
            <div class="step-number">2</div>
            <div class="step-label">官方证书</div>
          </div>
          <div class="step-connector" :class="{ completed: currentStep > 2 }"></div>
          <div :class="['step', { active: currentStep === 3 }]">
            <div class="step-number">3</div>
            <div class="step-label">文件上传</div>
          </div>
        </div>

        <div class="modal-body">
          <!-- Step 1: 基本信息 -->
          <div v-if="currentStep === 1" class="form-section">
            <h3>船舶交易基本情况</h3>
            <div class="info-table">
              <div class="table-row">
                <div class="table-cell label">船名</div>
                <div class="table-cell">{{ selectedVerification?.vesselName }}</div>
                <div class="table-cell label">船舶类型</div>
                <div class="table-cell">散货船</div>
              </div>
              <div class="table-row">
                <div class="table-cell label">卖出方</div>
                <div class="table-cell">{{ selectedVerification?.seller }}</div>
                <div class="table-cell label">买入方</div>
                <div class="table-cell">{{ selectedVerification?.buyer }}</div>
              </div>
              <div class="table-row">
                <div class="table-cell label">建造船厂</div>
                <div class="table-cell">
                  <input v-model="fillingForm.shipyard" type="text" class="form-input" placeholder="大连中远海运川崎">
                </div>
                <div class="table-cell label">船舶港</div>
                <div class="table-cell">
                  <input v-model="fillingForm.port" type="text" class="form-input" placeholder="ZHOUSHAN">
                </div>
              </div>
              <div class="table-row">
                <div class="table-cell label">建造日期</div>
                <div class="table-cell">
                  <input v-model="fillingForm.buildDate" type="date" class="form-input">
                </div>
                <div class="table-cell label">型深(m)</div>
                <div class="table-cell">
                  <input v-model="fillingForm.depth" type="text" class="form-input" placeholder="18.50">
                </div>
              </div>
              <div class="table-row">
                <div class="table-cell label">总长(m)</div>
                <div class="table-cell">
                  <input v-model="fillingForm.length" type="text" class="form-input" placeholder="199.90">
                </div>
                <div class="table-cell label">型宽(m)</div>
                <div class="table-cell">
                  <input v-model="fillingForm.width" type="text" class="form-input" placeholder="32.26">
                </div>
              </div>
              <div class="table-row">
                <div class="table-cell label">总吨(t)</div>
                <div class="table-cell">
                  <input v-model="fillingForm.tonnage" type="text" class="form-input" placeholder="36000">
                </div>
                <div class="table-cell label">船级</div>
                <div class="table-cell">
                  <input v-model="fillingForm.classification" type="text" class="form-input" placeholder="CCS">
                </div>
              </div>
              <div class="table-row">
                <div class="table-cell label">载重(容)量</div>
                <div class="table-cell">
                  <input v-model="fillingForm.deadweight" type="text" class="form-input" placeholder="61000 DWT">
                </div>
                <div class="table-cell label">航区</div>
                <div class="table-cell">
                  <input v-model="fillingForm.navigationArea" type="text" class="form-input" placeholder="无限航区">
                </div>
              </div>
              <div class="table-row">
                <div class="table-cell label">主机功率(KW)</div>
                <div class="table-cell">
                  <input v-model="fillingForm.enginePower" type="text" class="form-input" placeholder="8600">
                </div>
                <div class="table-cell label">主机型号</div>
                <div class="table-cell">
                  <input v-model="fillingForm.engineModel" type="text" class="form-input" placeholder="MAN B&W 6550ME-B9">
                </div>
              </div>
              <div class="table-row">
                <div class="table-cell label">船舶识别号</div>
                <div class="table-cell" colspan="3">
                  <input v-model="fillingForm.imo" type="text" class="form-input" placeholder="CN20181234567">
                </div>
              </div>
              <div class="table-row">
                <div class="table-cell label">成交价格(大写)</div>
                <div class="table-cell" colspan="2">
                  <input v-model="fillingForm.priceText" type="text" class="form-input" placeholder="拔付在佰万元整">
                </div>
                <div class="table-cell label">成交价格(数字)</div>
                <div class="table-cell">
                  <div class="price-input">
                    <span>¥</span>
                    <input v-model="fillingForm.price" type="text" class="form-input" placeholder="85000000">
                  </div>
                </div>
              </div>
              <div class="table-row">
                <div class="table-cell label">备注</div>
                <div class="table-cell" colspan="3">
                  <textarea v-model="fillingForm.remarks" class="form-textarea" placeholder="其他补充说明..."></textarea>
                </div>
              </div>
            </div>

            <!-- 双方信息录入 (仅卖方可见其他字段) -->
            <h3 style="margin-top: 24px;">经办人信息</h3>
            <div class="info-table">
              <div class="table-row">
                <div class="table-cell label">经办人姓名</div>
                <div class="table-cell">
                  <input v-model="fillingForm.contactName" type="text" class="form-input">
                </div>
                <div class="table-cell label">联系电话</div>
                <div class="table-cell">
                  <input v-model="fillingForm.contactPhone" type="tel" class="form-input">
                </div>
              </div>
              <div class="table-row">
                <div class="table-cell label">交付时间</div>
                <div class="table-cell" colspan="3">
                  <input v-model="fillingForm.deliveryDate" type="date" class="form-input">
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: 官方证书 -->
          <div v-if="currentStep === 2" class="form-section">
            <h3>官方证书数据核对</h3>
            <p class="section-tips">系统已自动调取官方证书数据，请确认信息一致性</p>

            <div class="certificate-section">
              <h4>船舶所有权登记证书</h4>
              <div class="cert-info">
                <div class="cert-row">
                  <span class="cert-label">证书编号:</span>
                  <span class="cert-value">ZC-OWN-2018-001</span>
                </div>
                <div class="cert-row">
                  <span class="cert-label">所有人:</span>
                  <span class="cert-value">PACIFIC SHIPPING LTD.</span>
                </div>
                <div class="cert-row">
                  <span class="cert-label">取得日期:</span>
                  <span class="cert-value">2018-06-01</span>
                </div>
              </div>
            </div>

            <div class="certificate-section">
              <h4>船舶国籍证书</h4>
              <div class="cert-info">
                <div class="cert-row">
                  <span class="cert-label">前港:</span>
                  <span class="cert-value">ZHOUSHAN</span>
                </div>
                <div class="cert-row">
                  <span class="cert-label">号:</span>
                  <span class="cert-value">B1234</span>
                </div>
                <div class="cert-row">
                  <span class="cert-label">有效期至:</span>
                  <span class="cert-value">2028-05-30</span>
                </div>
              </div>
            </div>

            <div class="certificate-section">
              <h4>船舶检验证书 (IC)</h4>
              <div class="cert-info">
                <div class="cert-row">
                  <span class="cert-label">总吨位:</span>
                  <span class="cert-value">36000</span>
                </div>
                <div class="cert-row">
                  <span class="cert-label">发证机构:</span>
                  <span class="cert-value">CCS</span>
                </div>
                <div class="cert-row">
                  <span class="cert-label">下次检期:</span>
                  <span class="cert-value">2023-11-20</span>
                </div>
              </div>
            </div>

            <div class="confirmation-box">
              <input v-model="fillingForm.certificateConfirmed" type="checkbox" id="certConfirm">
              <label for="certConfirm">我确认上述表单信息与数据库同步的证书信息一致，且真实有效</label>
            </div>

            <div v-if="!fillingForm.certificateConfirmed" class="upload-alert">
              <p>发现证书信息不一致？</p>
              <button class="btn-upload-supp" @click="showUploadSupplementary = true">补充上传异常说明</button>
            </div>
          </div>

          <!-- Step 3: 文件上传 -->
          <div v-if="currentStep === 3" class="form-section">
            <h3>电子文件提交</h3>
            <p class="section-tips">支持 PDF、JPG 格式，单文件不超过 20MB</p>

            <div class="file-upload-section">
              <h4>{{ currentRole === 'seller' ? '卖方' : '买方' }}需提交文件</h4>
              
              <div class="file-item">
                <label>{{ currentRole === 'seller' ? '营业执照（加盖电子公章）' : '身份证正面' }}</label>
                <div class="file-upload-area" @click="triggerFileInput('file1')">
                  <input type="file" ref="fileInput1" accept=".pdf,.jpg,.jpeg" style="display: none" @change="handleFileUpload($event, 'file1')">
                  <div v-if="!uploadedFiles.file1" class="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                    <p>点击或拖拽上传文件</p>
                  </div>
                  <div v-else class="file-uploaded">
                    <div class="file-name">{{ uploadedFiles.file1.name }}</div>
                    <div class="file-size">{{ (uploadedFiles.file1.size / 1024 / 1024).toFixed(2) }} MB</div>
                    <button @click.stop="removeFile('file1')" class="btn-remove">删除</button>
                  </div>
                </div>
              </div>

              <div class="file-item">
                <label>{{ currentRole === 'seller' ? '经办人身份证正反面（各一张）' : '身份证背面' }}</label>
                <div class="file-upload-area" @click="triggerFileInput('file2')">
                  <input type="file" ref="fileInput2" accept=".pdf,.jpg,.jpeg" style="display: none" @change="handleFileUpload($event, 'file2')">
                  <div v-if="!uploadedFiles.file2" class="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                    <p>点击或拖拽上传文件</p>
                  </div>
                  <div v-else class="file-uploaded">
                    <div class="file-name">{{ uploadedFiles.file2.name }}</div>
                    <div class="file-size">{{ (uploadedFiles.file2.size / 1024 / 1024).toFixed(2) }} MB</div>
                    <button @click.stop="removeFile('file2')" class="btn-remove">删除</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="currentStep > 1" class="btn-prev" @click="currentStep--">上一步</button>
          <button v-if="currentStep < 3" class="btn-next" @click="currentStep++">下一步</button>
          <button v-if="currentStep === 3" class="btn-submit" @click="submitFilling">提交填报</button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="detailModalVisible" class="modal-overlay" @click.self="detailModalVisible = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedVerification?.verificationNo }} - 详情信息</h2>
          <button class="close-btn" @click="detailModalVisible = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h3>基本信息</h3>
            <div class="detail-row">
              <span class="detail-label">船名:</span>
              <span class="detail-value">{{ selectedVerification?.vesselName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">卖出方:</span>
              <span class="detail-value">{{ selectedVerification?.seller }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">买入方:</span>
              <span class="detail-value">{{ selectedVerification?.buyer }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">交易金额:</span>
              <span class="detail-value">¥ {{ selectedVerification?.amount }}</span>
            </div>
          </div>
          <div v-if="selectedVerification?.status === 'rejected'" class="detail-section">
            <h3>驳回原因</h3>
            <div class="reject-reason">经办人身份证模糊，请重新上传清晰的身份证件</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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
const currentStep = ref(1)
const showUploadSupplementary = ref(false)
const uploadedFiles = ref({
  file1: null,
  file2: null
})
const fillingForm = ref({
  shipyard: '',
  port: '',
  buildDate: '',
  depth: '',
  length: '',
  width: '',
  tonnage: '',
  classification: '',
  deadweight: '',
  navigationArea: '',
  enginePower: '',
  engineModel: '',
  imo: '',
  priceText: '',
  price: '',
  remarks: '',
  contactName: '',
  contactPhone: '',
  deliveryDate: '',
  certificateConfirmed: false
})

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

const submitFilling = () => {
  console.log('[v0] 提交填报:', fillingForm.value)
  fillingModalVisible.value = false
  currentStep.value = 1
  // Reset form
  fillingForm.value = {
    shipyard: '',
    port: '',
    buildDate: '',
    depth: '',
    length: '',
    width: '',
    tonnage: '',
    classification: '',
    deadweight: '',
    navigationArea: '',
    enginePower: '',
    engineModel: '',
    imo: '',
    priceText: '',
    price: '',
    remarks: '',
    contactName: '',
    contactPhone: '',
    deliveryDate: '',
    certificateConfirmed: false
  }
  uploadedFiles.value = { file1: null, file2: null }
}

const handleFileUpload = (event, fileKey) => {
  const file = event.target.files?.[0]
  if (file) {
    if (file.size > 20 * 1024 * 1024) {
      alert('文件大小不能超过 20MB')
      return
    }
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      alert('仅支持 PDF 和 JPG 格式')
      return
    }
    uploadedFiles.value[fileKey] = file
  }
}

const removeFile = (fileKey) => {
  uploadedFiles.value[fileKey] = null
}

const triggerFileInput = (fileKey) => {
  const input = fileKey === 'file1' ? this.$refs.fileInput1 : this.$refs.fileInput2
  input?.click()
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.large-modal {
  max-width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #E2E8F0;
  background: #F8FAFC;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
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

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #E2E8F0;
  background: #F8FAFC;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Steps Indicator */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin: 24px 0;
  padding: 0 24px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E2E8F0;
  color: #64748B;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.step.active .step-number {
  background: #0EA5E9;
  color: white;
}

.step.completed .step-number {
  background: #10B981;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}

.step.active .step-label {
  color: #0EA5E9;
}

.step-connector {
  width: 40px;
  height: 2px;
  background: #E2E8F0;
  margin: 0 -8px;
  transition: all 0.3s;
}

.step-connector.completed {
  background: #10B981;
}

/* Form Section */
.form-section {
  margin-bottom: 24px;
}

.form-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 16px 0;
}

.section-tips {
  font-size: 13px;
  color: #64748B;
  margin: 0 0 16px 0;
}

/* Info Table */
.info-table {
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-bottom: 1px solid #F1F5F9;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 12px 16px;
  font-size: 13px;
  border-right: 1px solid #F1F5F9;
}

.table-cell:last-child {
  border-right: none;
}

.table-cell.label {
  background: #F8FAFC;
  color: #475569;
  font-weight: 600;
  min-width: 120px;
}

.form-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-size: 13px;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #0EA5E9;
}

.form-textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-size: 13px;
  resize: vertical;
  min-height: 60px;
}

.form-textarea:focus {
  outline: none;
  border-color: #0EA5E9;
}

.price-input {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-input input {
  flex: 1;
}

/* Certificate Section */
.certificate-section {
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #F8FAFC;
}

.certificate-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 12px 0;
}

.cert-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cert-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.cert-label {
  color: #64748B;
  font-weight: 500;
  min-width: 100px;
}

.cert-value {
  color: #0F172A;
  font-weight: 600;
}

.confirmation-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #F0F9FF;
  border: 1px solid #BFDBFE;
  border-radius: 6px;
  margin: 16px 0;
}

.confirmation-box input[type="checkbox"] {
  cursor: pointer;
}

.confirmation-box label {
  font-size: 13px;
  color: #1E40AF;
  cursor: pointer;
  margin: 0;
}

.upload-alert {
  background: #FEE2E2;
  border: 1px solid #FECACA;
  border-radius: 6px;
  padding: 12px;
  margin-top: 16px;
}

.upload-alert p {
  margin: 0 0 12px 0;
  color: #DC2626;
  font-size: 13px;
  font-weight: 600;
}

.btn-upload-supp {
  padding: 8px 16px;
  background: #DC2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-upload-supp:hover {
  background: #991B1B;
}

/* File Upload */
.file-upload-section {
  margin: 16px 0;
}

.file-upload-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 12px 0;
}

.file-item {
  margin-bottom: 16px;
}

.file-item label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.file-upload-area {
  border: 2px dashed #CBD5E1;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #F8FAFC;
}

.file-upload-area:hover {
  border-color: #0EA5E9;
  background: #EFF6FF;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-placeholder svg {
  width: 40px;
  height: 40px;
  color: #94A3B8;
}

.upload-placeholder p {
  margin: 0;
  font-size: 13px;
  color: #64748B;
}

.file-uploaded {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #EFF6FF;
  border-radius: 6px;
}

.file-name {
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
}

.file-size {
  font-size: 12px;
  color: #64748B;
  margin: 0 12px;
}

.btn-remove {
  padding: 6px 12px;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #DC2626;
}

/* Detail Section */
.detail-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
}

.detail-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 12px 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #E2E8F0;
  font-size: 13px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #64748B;
  font-weight: 500;
  min-width: 100px;
}

.detail-value {
  color: #0F172A;
  font-weight: 600;
  text-align: right;
}

.reject-reason {
  padding: 12px;
  background: #FEE2E2;
  border: 1px solid #FECACA;
  border-radius: 6px;
  color: #DC2626;
  font-size: 13px;
  font-weight: 500;
}

/* Modal Buttons */
.btn-prev,
.btn-next,
.btn-submit {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-prev {
  background: #F1F5F9;
  color: #475569;
  border: 1px solid #E2E8F0;
}

.btn-prev:hover {
  background: #E2E8F0;
}

.btn-next,
.btn-submit {
  background: #0EA5E9;
  color: white;
}

.btn-next:hover,
.btn-submit:hover {
  background: #0284C7;
}

@media (max-width: 768px) {
  .table-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-content {
    max-width: 95vw;
  }
}
</style>

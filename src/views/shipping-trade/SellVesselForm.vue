<template>
  <div class="sell-vessel-form">
    <div class="form-container">
      <div class="form-header">
        <h1>发布船舶出售信息</h1>
        <p class="form-desc">选择您的自有船舶，填写出售信息并上传相关资料</p>
      </div>

      <!-- 步骤1: 选择船舶 -->
      <div v-if="currentStep === 1" class="step-container">
        <div class="step-header">
          <h2>第一步：选择船舶</h2>
        </div>

        <div class="vessel-search">
          <input 
            v-model="searchKeyword" 
            type="text" 
            class="search-input" 
            placeholder="搜索船名、船舶识别号、MMSI或编号"
          />
        </div>

        <div class="vessel-list">
          <div 
            v-for="vessel in filteredVessels" 
            :key="vessel.id" 
            class="vessel-item"
            :class="{ selected: selectedVessel?.id === vessel.id }"
            @click="selectVessel(vessel)"
          >
            <div class="vessel-item-info">
              <div class="vessel-name">{{vessel.name}}</div>
              <div class="vessel-details">
                <span>识别号: {{vessel.identificationNumber}}</span>
                <span>MMSI: {{vessel.mmsi}}</span>
                <span>类型: {{vessel.type}}</span>
                <span>建造年份: {{vessel.buildYear}}</span>
              </div>
            </div>
            <div v-if="selectedVessel?.id === vessel.id" class="check-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button type="button" class="btn-cancel" @click="handleCancel">取消</button>
          <button type="button" class="btn-next" :disabled="!selectedVessel" @click="nextStep">
            下一步
          </button>
        </div>
      </div>

      <!-- 步骤2: 填写信息 -->
      <form v-if="currentStep === 2" @submit.prevent="handleSubmit" class="form-content">
        <div class="step-header">
          <h2>第二步：填写出售信息</h2>
          <button type="button" class="btn-back" @click="prevStep">返回上一步</button>
        </div>

        <!-- 船舶基本信息（系统读入，不可修改） -->
        <div class="form-section">
          <h3 class="section-title">船舶基本信息</h3>
          
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">船舶类型</label>
              <input v-model="formData.vesselType" type="text" class="form-input" disabled />
            </div>

            <div class="form-item">
              <label class="form-label">航区</label>
              <input v-model="formData.navigationArea" type="text" class="form-input" disabled />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">船名</label>
              <input v-model="formData.vesselName" type="text" class="form-input" disabled />
            </div>

            <div class="form-item">
              <label class="form-label">船检机构</label>
              <input v-model="formData.classificationSociety" type="text" class="form-input" disabled />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">建造厂</label>
              <input v-model="formData.buildPlace" type="text" class="form-input" disabled />
            </div>

            <div class="form-item">
              <label class="form-label">建造日期</label>
              <input v-model="formData.buildDate" type="text" class="form-input" disabled />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">船旗</label>
              <input v-model="formData.flag" type="text" class="form-input" disabled />
            </div>

            <div class="form-item">
              <label class="form-label">船籍港</label>
              <input v-model="formData.portOfRegistry" type="text" class="form-input" disabled />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">总吨（吨）</label>
              <input v-model.number="formData.grossTonnage" type="number" class="form-input" disabled />
            </div>

            <div class="form-item">
              <label class="form-label">净吨（吨）</label>
              <input v-model.number="formData.netTonnage" type="number" class="form-input" disabled />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">总长（米）</label>
              <input v-model.number="formData.length" type="number" step="0.01" class="form-input" disabled />
            </div>

            <div class="form-item">
              <label class="form-label">型宽（米）</label>
              <input v-model.number="formData.width" type="number" step="0.01" class="form-input" disabled />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">型深（米）</label>
              <input v-model.number="formData.depth" type="number" step="0.01" class="form-input" disabled />
            </div>

            <div class="form-item">
              <label class="form-label">载重（吨）</label>
              <input v-model.number="formData.deadweight" type="number" class="form-input" disabled />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">主机功率（kw）</label>
              <input v-model.number="formData.mainEnginePower" type="number" class="form-input" disabled />
            </div>
          </div>
        </div>

        <!-- 附加信息 -->
        <div class="form-section">
          <h3 class="section-title">附加信息</h3>
          
          <div class="info-notice">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            <div class="info-text">
              <strong>温馨提示：</strong>审核通过后，买方可查看当前船舶的最近报港日期、近三个月报港数量、是否重点跟踪、是否海事协查以及近五年安全状态等系统信息。
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">期望售价（万元）</label>
              <input v-model.number="formData.expectedPrice" type="number" step="0.01" class="form-input" placeholder="请输入期望售价" required />
            </div>

            <div class="form-item required">
              <label class="form-label">坞检/特检情况</label>
              <select v-model="formData.dockInspection" class="form-input" required>
                <option value="">请选择</option>
                <option value="无">无</option>
                <option value="三个月内">三个月内</option>
                <option value="六个月内">六个月内</option>
                <option value="一年内">一年内</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 联系信息 -->
        <div class="form-section">
          <h3 class="section-title">联系信息</h3>
          
          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">联系人</label>
              <input v-model="formData.contactPerson" type="text" class="form-input" required />
            </div>

            <div class="form-item required">
              <label class="form-label">联系电话</label>
              <input v-model="formData.contactPhone" type="tel" class="form-input" pattern="^1[3-9]\d{9}$" required />
            </div>
          </div>
        </div>

        <!-- 资料上传 -->
        <div class="form-section">
          <h3 class="section-title">证书图纸（PDF格式，单文件≤20MB，最多10个）</h3>
          
          <div class="upload-area">
            <input 
              type="file" 
              ref="certificateInput" 
              @change="handleCertificateUpload" 
              accept=".pdf"
              multiple
              style="display: none"
            />
            <button type="button" class="upload-btn" @click="$refs.certificateInput.click()">
              <svg class="upload-icon" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              上传证书图纸
            </button>
            
            <div v-if="uploadedCertificates.length > 0" class="file-list">
              <div v-for="(file, index) in uploadedCertificates" :key="index" class="file-item">
                <span class="file-name">{{file.name}}</span>
                <button type="button" class="file-remove" @click="removeCertificate(index)">删除</button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">船舶照片（JPG/PNG，单张≤5MB，每类最多5张）</h3>
          
          <div class="photo-categories">
            <div v-for="category in photoCategories" :key="category.key" class="photo-category">
              <h4 class="category-title">{{category.label}} <span class="required-mark">*</span></h4>
              <input 
                type="file" 
                :ref="`photoInput_${category.key}`"
                @change="(e) => handlePhotoUpload(e, category.key)" 
                accept="image/jpeg,image/png"
                multiple
                style="display: none"
              />
              <button type="button" class="upload-btn-small" @click="$refs[`photoInput_${category.key}`][0].click()">
                选择照片
              </button>
              
              <div v-if="uploadedPhotos[category.key]?.length > 0" class="photo-preview-list">
                <div v-for="(photo, index) in uploadedPhotos[category.key]" :key="index" class="photo-preview">
                  <img :src="photo.url" :alt="photo.name" />
                  <button type="button" class="photo-remove" @click="removePhoto(category.key, index)">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 备注信息 -->
        <div class="form-section">
          <h3 class="section-title">备注信息（选填）</h3>
          
          <div class="form-item">
            <textarea 
              v-model="formData.remarks" 
              class="form-textarea" 
              placeholder="可填写船舶使用情况、维修记录、交付条件、附加设备说明等"
              maxlength="500"
              rows="6"
            ></textarea>
            <div class="char-count">{{formData.remarks.length}}/500</div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="prevStep">返回</button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{isSubmitting ? '提交中...' : '提交审核'}}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前步骤
const currentStep = ref(1)

// 搜索关键词
const searchKeyword = ref('')

// 模拟的船舶列表（包��完整船舶信息）
const vessels = ref([
  {
    id: 1,
    name: '远洋货轮001',
    identificationNumber: 'CN2024001',
    mmsi: '412345678',
    type: '散货船',
    buildYear: 2015,
    navigationArea: '无限航区',
    classificationSociety: 'CCS',
    buildPlace: '上海江南造船厂',
    buildDate: '2015-06-15',
    flag: '中国',
    portOfRegistry: '上海',
    grossTonnage: 25000,
    netTonnage: 15000,
    length: 180.5,
    width: 28.6,
    depth: 14.2,
    deadweight: 35000,
    mainEnginePower: 8500,
    lastPortReportDate: '2024-02-01',
    recentPortReports: 8,
    isKeyTracking: false,
    hasMaritimeInvestigation: false,
    safetyStats: {
      pscDetention: 0,
      fscDetention: 1,
      administrativePenalty: 0,
      accidents: 0
    }
  },
  {
    id: 2,
    name: '集装箱船202',
    identificationNumber: 'CN2024002',
    mmsi: '412345679',
    type: '集装箱船',
    buildYear: 2018,
    navigationArea: '无限航区',
    classificationSociety: 'ABS',
    buildPlace: '大连造船厂',
    buildDate: '2018-03-20',
    flag: '中国',
    portOfRegistry: '大连',
    grossTonnage: 32000,
    netTonnage: 19000,
    length: 210.8,
    width: 32.2,
    depth: 16.5,
    deadweight: 45000,
    mainEnginePower: 12000,
    lastPortReportDate: '2024-01-28',
    recentPortReports: 12,
    isKeyTracking: false,
    hasMaritimeInvestigation: false,
    safetyStats: {
      pscDetention: 0,
      fscDetention: 0,
      administrativePenalty: 0,
      accidents: 0
    }
  },
  {
    id: 3,
    name: '油轮503',
    identificationNumber: 'CN2024003',
    mmsi: '412345680',
    type: '油船',
    buildYear: 2012,
    navigationArea: '近海航区',
    classificationSociety: 'DNV',
    buildPlace: '广州造船厂',
    buildDate: '2012-09-10',
    flag: '中国',
    portOfRegistry: '广州',
    grossTonnage: 18000,
    netTonnage: 10800,
    length: 156.3,
    width: 24.5,
    depth: 12.8,
    deadweight: 28000,
    mainEnginePower: 6800,
    lastPortReportDate: '2024-01-15',
    recentPortReports: 6,
    isKeyTracking: true,
    hasMaritimeInvestigation: true,
    safetyStats: {
      pscDetention: 1,
      fscDetention: 0,
      administrativePenalty: 1,
      accidents: 0
    }
  }
])

// 选中的船舶
const selectedVessel = ref(null)

// 过滤后的船舶列表
const filteredVessels = computed(() => {
  if (!searchKeyword.value) return vessels.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return vessels.value.filter(vessel => 
    vessel.name.toLowerCase().includes(keyword) ||
    vessel.identificationNumber.toLowerCase().includes(keyword) ||
    vessel.mmsi.includes(keyword)
  )
})

// 表单数据
const formData = ref({
  vesselType: '',
  navigationArea: '',
  vesselName: '',
  classificationSociety: '',
  buildPlace: '',
  buildDate: '',
  flag: '',
  portOfRegistry: '',
  grossTonnage: null,
  netTonnage: null,
  length: null,
  width: null,
  depth: null,
  deadweight: null,
  mainEnginePower: null,
  expectedPrice: null,
  dockInspection: '',
  lastPortReportDate: '', // 最近报港日期
  recentPortReports: 0, // 近三个月报港数量
  isKeyTracking: false, // 是否重点跟踪
  hasMaritimeInvestigation: false, // 是否海事协查
  safetyStats: { // 近五年安全状态
    pscDetention: 0,
    fscDetention: 0,
    administrativePenalty: 0,
    accidents: 0
  },
  contactPerson: '',
  contactPhone: '',
  remarks: ''
})

// 上传的证书文件
const uploadedCertificates = ref([])

// 照片分类
const photoCategories = [
  { key: 'overall', label: '整船照' },
  { key: 'exterior', label: '外观照' },
  { key: 'deck', label: '甲板货仓照' },
  { key: 'cabin', label: '居住驾驶舱照' },
  { key: 'engine', label: '机舱集控照' }
]

// 上传的照片
const uploadedPhotos = ref({
  overall: [],
  exterior: [],
  deck: [],
  cabin: [],
  engine: []
})

const isSubmitting = ref(false)

// 选择船舶
const selectVessel = (vessel) => {
  selectedVessel.value = vessel
}

// 下一步
const nextStep = () => {
  if (!selectedVessel.value) {
    alert('请先选择船舶')
    return
  }
  
  // 预填船舶信息（从系统读取，不可修改）
  formData.value.vesselName = selectedVessel.value.name
  formData.value.vesselType = selectedVessel.value.type
  formData.value.navigationArea = selectedVessel.value.navigationArea
  formData.value.classificationSociety = selectedVessel.value.classificationSociety
  formData.value.buildPlace = selectedVessel.value.buildPlace
  formData.value.buildDate = selectedVessel.value.buildDate
  formData.value.flag = selectedVessel.value.flag
  formData.value.portOfRegistry = selectedVessel.value.portOfRegistry
  formData.value.grossTonnage = selectedVessel.value.grossTonnage
  formData.value.netTonnage = selectedVessel.value.netTonnage
  formData.value.length = selectedVessel.value.length
  formData.value.width = selectedVessel.value.width
  formData.value.depth = selectedVessel.value.depth
  formData.value.deadweight = selectedVessel.value.deadweight
  formData.value.mainEnginePower = selectedVessel.value.mainEnginePower
  
  // 填充新增的系统数据
  formData.value.lastPortReportDate = selectedVessel.value.lastPortReportDate
  formData.value.recentPortReports = selectedVessel.value.recentPortReports
  formData.value.isKeyTracking = selectedVessel.value.isKeyTracking
  formData.value.hasMaritimeInvestigation = selectedVessel.value.hasMaritimeInvestigation
  formData.value.safetyStats = selectedVessel.value.safetyStats
  
  currentStep.value = 2
}

// 上一步
const prevStep = () => {
  currentStep.value = 1
}

// 处理证书上传
const handleCertificateUpload = (e) => {
  const files = Array.from(e.target.files)
  
  // 验证文件数量
  if (uploadedCertificates.value.length + files.length > 10) {
    alert('最多上传10个证书文件')
    return
  }
  
  // 验证文件���小
  const invalidFiles = files.filter(file => file.size > 20 * 1024 * 1024)
  if (invalidFiles.length > 0) {
    alert('单个文件大小不能超过20MB')
    return
  }
  
  uploadedCertificates.value.push(...files)
  e.target.value = ''
}

// 删除证书
const removeCertificate = (index) => {
  uploadedCertificates.value.splice(index, 1)
}

// 处理照片上传
const handlePhotoUpload = (e, category) => {
  const files = Array.from(e.target.files)
  
  // 验证文件数量
  if (uploadedPhotos.value[category].length + files.length > 5) {
    alert('���类最多上传5张照片')
    return
  }
  
  // 验证文件大小
  const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024)
  if (invalidFiles.length > 0) {
    alert('单张照片大小不能超过5MB')
    return
  }
  
  // 生成预览URL
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (event) => {
      uploadedPhotos.value[category].push({
        name: file.name,
        url: event.target.result,
        file: file
      })
    }
    reader.readAsDataURL(file)
  })
  
  e.target.value = ''
}

// 删除照片
const removePhoto = (category, index) => {
  uploadedPhotos.value[category].splice(index, 1)
}

// 表单提交
const handleSubmit = async () => {
  // 验证每类照片至少有1张
  const missingCategories = photoCategories.filter(
    cat => !uploadedPhotos.value[cat.key] || uploadedPhotos.value[cat.key].length === 0
  )
  
  if (missingCategories.length > 0) {
    alert(`请至少上传1张${missingCategories[0].label}`)
    return
  }
  
  isSubmitting.value = true
  
  try {
    console.log('提交出售信息:', {
      vessel: selectedVessel.value,
      formData: formData.value,
      certificates: uploadedCertificates.value,
      photos: uploadedPhotos.value
    })
    
    // TODO: 实际API调用
    // await api.submitSellVessel(...)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert('出售信息已提交，待审核后对外展示')
    router.push('/shipping-trade/vessel-trading')
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 取消操作
const handleCancel = () => {
  if (confirm('确定要取消吗？已填写的内容将不会保存')) {
    router.push('/shipping-trade/vessel-trading')
  }
}
</script>

<style scoped>
.sell-vessel-form {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px 0 60px;
}

.form-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

.form-header {
  background: white;
  padding: 32px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-header h1 {
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 12px;
}

.form-desc {
  color: #8c8c8c;
  font-size: 14px;
  line-height: 1.6;
}

/* 步骤容器 */
.step-container {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #1890ff;
}

.step-header h2 {
  font-size: 20px;
  color: #2c3e50;
  font-weight: 600;
}

.btn-back {
  padding: 8px 16px;
  background: white;
  color: #1890ff;
  border: 1px solid #1890ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #e6f7ff;
}

/* 船舶搜索 */
.vessel-search {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

/* 船舶列表 */
.vessel-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;
}

.vessel-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.vessel-item:hover {
  border-color: #1890ff;
  background: #f0f7ff;
}

.vessel-item.selected {
  border-color: #1890ff;
  background: #e6f7ff;
}

.vessel-item-info {
  flex: 1;
}

.vessel-name {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 8px;
}

.vessel-details {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #8c8c8c;
}

.check-icon {
  width: 24px;
  height: 24px;
  color: #1890ff;
}

/* 表单内容 */
.form-content {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #E8F4FD;
  border: 1px solid #91C9F7;
  border-radius: 8px;
  margin-bottom: 20px;
}

.info-icon {
  width: 20px;
  height: 20px;
  color: #1890FF;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text {
  font-size: 14px;
  color: #0C5F8A;
  line-height: 1.6;
}

.info-text strong {
  color: #0C5F8A;
  font-weight: 600;
}

.section-title {
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #1890ff;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-item.required .form-label::after {
  content: '*';
  color: #ff4d4f;
  margin-left: 4px;
}

.form-label {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.form-input:hover,
.form-textarea:hover {
  border-color: #40a9ff;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.char-count {
  text-align: right;
  color: #8c8c8c;
  font-size: 12px;
  margin-top: 6px;
}

/* 上传区域 */
.upload-area {
  padding: 20px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  text-align: center;
}

.upload-btn {
  padding: 12px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.upload-btn:hover {
  background: #0d7de0;
}

.upload-icon {
  width: 20px;
  height: 20px;
}

.file-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.file-name {
  font-size: 13px;
  color: #2c3e50;
}

.file-remove {
  padding: 4px 12px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s;
}

.file-remove:hover {
  background: #d93026;
}

/* 照片上传 */
.photo-categories {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.photo-category {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.category-title {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 12px;
}

.required-mark {
  color: #ff4d4f;
}

.upload-btn-small {
  padding: 8px 16px;
  background: white;
  color: #1890ff;
  border: 1px solid #1890ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.upload-btn-small:hover {
  background: #e6f7ff;
}

.photo-preview-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.photo-preview {
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.photo-preview img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.photo-remove:hover {
  background: #ff4d4f;
}

/* 操作按钮 */
.step-actions,
.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel,
.btn-next,
.btn-submit {
  padding: 12px 48px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: white;
  color: #2c3e50;
  border: 1px solid #d9d9d9;
}

.btn-cancel:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.btn-next,
.btn-submit {
  background: #1890ff;
  color: white;
}

.btn-next:hover:not(:disabled),
.btn-submit:hover:not(:disabled) {
  background: #0d7de0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.btn-next:disabled,
.btn-submit:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  transform: none;
}

/* 信息卡片样式 */
.info-card-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.info-card-label {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 8px;
  font-weight: 500;
}

.info-card-value {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

/* 跟踪状态样式 */
.tracking-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.tracking-label {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.tracking-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.tracking-yes {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
}

.tracking-no {
  background: #d4edda;
  color: #155724;
  border: 1px solid #28a745;
}

/* 海事协查表格样式 */
/* 保留subsection-title，安全状态部分仍在使用 */
.subsection-title {
  font-size: 15px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 3px solid #1890ff;
}

/* 安全统计卡片 - 极简设计 */
.safety-section {
  margin-bottom: 24px;
}

.safety-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: #fafafa;
  padding: 28px 20px;
  border-radius: 6px;
  text-align: center;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.stat-card:hover {
  background: white;
  border-color: #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 10px;
  font-weight: 400;
  letter-spacing: 0.2px;
}

.stat-value {
  font-size: 36px;
  font-weight: 600;
  color: #262626;
  letter-spacing: -1.5px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .photo-preview-list {
    grid-template-columns: repeat(3, 1fr);
  }

  .info-card-row {
    grid-template-columns: 1fr;
  }

  .safety-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card {
    padding: 20px 16px;
  }

  .stat-value {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .safety-stats {
    grid-template-columns: 1fr;
  }
}
</style>

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

        <!-- 船舶基本信息（自动预填） -->
        <div class="form-section">
          <h3 class="section-title">船舶基本信息</h3>
          
          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">船舶类型</label>
              <select v-model="formData.vesselType" class="form-input" required>
                <option value="">请选择船舶类型</option>
                <option value="散货船">散货船</option>
                <option value="集装箱船">集装箱船</option>
                <option value="油船">油船</option>
                <option value="液化气船">液化气船</option>
              </select>
            </div>

            <div class="form-item required">
              <label class="form-label">航区</label>
              <select v-model="formData.navigationArea" class="form-input" required>
                <option value="">请选择航区</option>
                <option value="无限航区">无限航区</option>
                <option value="近海航区">近海航区</option>
                <option value="沿海航区">沿海航区</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">船名</label>
              <input v-model="formData.vesselName" type="text" class="form-input" />
            </div>

            <div class="form-item">
              <label class="form-label">船级</label>
              <select v-model="formData.classificationSociety" class="form-input">
                <option value="">请选择船级社</option>
                <option value="CCS">CCS (中国船级社)</option>
                <option value="ABS">ABS (美国船级社)</option>
                <option value="LR">LR (英国劳氏船级社)</option>
                <option value="DNV">DNV (挪威船级社)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">建造厂</label>
              <input v-model="formData.buildPlace" type="text" class="form-input" />
            </div>

            <div class="form-item required">
              <label class="form-label">建造日期</label>
              <input v-model="formData.buildDate" type="date" class="form-input" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">船旗</label>
              <select v-model="formData.flag" class="form-input" required>
                <option value="">请选择船旗</option>
                <option value="中国">中国</option>
                <option value="巴拿马">巴拿马</option>
                <option value="利比里亚">利比里亚</option>
              </select>
            </div>

            <div class="form-item">
              <label class="form-label">船籍港</label>
              <input v-model="formData.portOfRegistry" type="text" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">总吨（吨）</label>
              <input v-model.number="formData.grossTonnage" type="number" class="form-input" required />
            </div>

            <div class="form-item required">
              <label class="form-label">净吨（吨）</label>
              <input v-model.number="formData.netTonnage" type="number" class="form-input" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">总长（米）</label>
              <input v-model.number="formData.length" type="number" step="0.01" class="form-input" required />
            </div>

            <div class="form-item required">
              <label class="form-label">型宽（米）</label>
              <input v-model.number="formData.width" type="number" step="0.01" class="form-input" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">型深（米）</label>
              <input v-model.number="formData.depth" type="number" step="0.01" class="form-input" required />
            </div>

            <div class="form-item required">
              <label class="form-label">载重（吨）</label>
              <input v-model.number="formData.deadweight" type="number" class="form-input" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">主机功率（kw）</label>
              <input v-model.number="formData.mainEnginePower" type="number" class="form-input" />
            </div>

            <div class="form-item">
              <label class="form-label">主机型号</label>
              <input v-model="formData.mainEngineModel" type="text" class="form-input" />
            </div>
          </div>
        </div>

        <!-- 出售信息 -->
        <div class="form-section">
          <h3 class="section-title">出售信息</h3>
          
          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">期望售价（万元）</label>
              <input v-model.number="formData.expectedPrice" type="number" step="0.01" class="form-input" placeholder="请输入期望售价" required />
            </div>

            <div class="form-item required">
              <label class="form-label">是否在航</label>
              <select v-model="formData.inService" class="form-input" required>
                <option value="">请选择</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
          </div>

          <div v-if="formData.inService === '是'" class="form-row">
            <div class="form-item">
              <label class="form-label">当前航线信息</label>
              <input v-model="formData.currentRoute" type="text" class="form-input" placeholder="例如：上海-新加坡" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">日常保养状况</label>
              <select v-model="formData.maintenanceStatus" class="form-input" required>
                <option value="">请选择</option>
                <option value="一般">一般</option>
                <option value="良好">良好</option>
                <option value="非常好">非常好</option>
              </select>
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

// 模拟的船舶列表
const vessels = ref([
  {
    id: 1,
    name: '远洋货轮001',
    identificationNumber: 'CN2024001',
    mmsi: '412345678',
    type: '散货船',
    buildYear: 2015
  },
  {
    id: 2,
    name: '集装箱船202',
    identificationNumber: 'CN2024002',
    mmsi: '412345679',
    type: '集装箱船',
    buildYear: 2018
  },
  {
    id: 3,
    name: '油轮503',
    identificationNumber: 'CN2024003',
    mmsi: '412345680',
    type: '油船',
    buildYear: 2012
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
  mainEngineModel: '',
  expectedPrice: null,
  inService: '',
  currentRoute: '',
  maintenanceStatus: '',
  dockInspection: '',
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
  
  // 预填船舶信息
  formData.value.vesselName = selectedVessel.value.name
  formData.value.vesselType = selectedVessel.value.type
  
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
  
  // 验证文件大小
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
    alert('每类最多上传5张照片')
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
  margin-bottom: 32px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .photo-preview-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

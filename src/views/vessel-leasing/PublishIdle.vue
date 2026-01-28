<template>
  <div class="publish-idle-page">
    <div class="page-header">
      <h1>发布空船信息</h1>
      <p>出租方关联自有空闲船舶，填写空船信息后提交审核</p>
    </div>

    <div class="step-content">
      <!-- Vessel Selection -->
      <div class="form-section">
        <h3>选择船舶</h3>
        <div class="search-box">
          <input type="text" v-model="vesselSearch" placeholder="搜索船舶：输入船名、船舶识别号等">
        </div>

        <div class="vessel-list">
          <div v-if="filteredVessels.length === 0" class="empty-state">
            <p>未找到可用船舶</p>
          </div>
          <div v-for="vessel in filteredVessels" :key="vessel.id" class="vessel-item" :class="{ selected: selectedVessel?.id === vessel.id }" @click="selectVessel(vessel)">
            <div class="vessel-info">
              <h4>{{ vessel.vesselName }}</h4>
              <p class="vessel-details">{{ vessel.vesselType }} | {{ vessel.dwt }}吨 | 船龄{{ vessel.age }}年</p>
              <p class="vessel-code">船舶识别号: {{ vessel.imo }}</p>
            </div>
            <div class="checkbox">
              <input type="radio" :checked="selectedVessel?.id === vessel.id">
            </div>
          </div>
        </div>
      </div>

      <!-- Ship Information (Pre-filled) -->
      <div v-if="selectedVessel" class="form-section">
        <h3>船舶信息</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>船舶类型 *</label>
            <input type="text" v-model="formData.vesselType" readonly>
          </div>
          <div class="form-group">
            <label>航区 *</label>
            <input type="text" v-model="formData.navigationArea" readonly>
          </div>
          <div class="form-group">
            <label>船名</label>
            <input type="text" v-model="formData.vesselName" readonly>
          </div>
          <div class="form-group">
            <label>船级</label>
            <input type="text" v-model="formData.classificationSociety">
          </div>
          <div class="form-group">
            <label>建造厂</label>
            <input type="text" v-model="formData.buildPlace">
          </div>
          <div class="form-group">
            <label>建造日期 *</label>
            <input type="text" v-model="formData.buildDate">
          </div>
          <div class="form-group">
            <label>船旗 *</label>
            <select v-model="formData.flag">
              <option value="">请选择</option>
              <option value="中国">中国</option>
              <option value="巴拿马">巴拿马</option>
              <option value="利比里亚">利比里亚</option>
            </select>
          </div>
          <div class="form-group">
            <label>船籍港</label>
            <input type="text" v-model="formData.portOfRegistry">
          </div>
          <div class="form-group">
            <label>总吨 *</label>
            <input type="number" v-model.number="formData.grossTonnage" readonly>
          </div>
          <div class="form-group">
            <label>净吨 *</label>
            <input type="number" v-model.number="formData.netTonnage" readonly>
          </div>
          <div class="form-group">
            <label>总长(米) *</label>
            <input type="number" v-model.number="formData.length" readonly>
          </div>
          <div class="form-group">
            <label>型宽(米) *</label>
            <input type="number" v-model.number="formData.width" readonly>
          </div>
          <div class="form-group">
            <label>型深(米) *</label>
            <input type="number" v-model.number="formData.depth" readonly>
          </div>
          <div class="form-group">
            <label>主机功率(kW)</label>
            <input type="number" v-model.number="formData.mainEnginePower">
          </div>
          <div class="form-group">
            <label>主机型号</label>
            <input type="text" v-model="formData.mainEngineModel">
          </div>
          <div class="form-group">
            <label>载重(吨) *</label>
            <input type="number" v-model.number="formData.deadweight" readonly>
          </div>
        </div>
      </div>

      <!-- Idle Ship Info -->
      <div v-if="selectedVessel" class="form-section">
        <h3>空船信息</h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label>空船当前位置 *</label>
            <input type="text" v-model="formData.currentLocation" placeholder="精准定位港口名称，如：上海港">
          </div>

          <div class="form-group full-width">
            <label>预计可用时间 *</label>
            <div class="date-range">
              <input type="date" v-model="formData.availableDateStart">
              <span class="separator">至</span>
              <input type="date" v-model="formData.availableDateEnd">
            </div>
          </div>

          <div class="form-group">
            <label>可租赁类型 *</label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="time" v-model="formData.leaseTypes"> 期租</label>
              <label><input type="checkbox" value="bareboat" v-model="formData.leaseTypes"> 光租</label>
              <label><input type="checkbox" value="voyage" v-model="formData.leaseTypes"> 航次租船</label>
            </div>
          </div>

          <div class="form-group">
            <label>联系人 *</label>
            <input type="text" v-model="formData.contactName" placeholder="请输入联系人姓名">
          </div>

          <div class="form-group">
            <label>联系电话 *</label>
            <input type="tel" v-model="formData.contactPhone" placeholder="请输入手机号">
          </div>

          <div class="form-group full-width">
            <label>空船备注</label>
            <textarea v-model="formData.remarks" placeholder="填写船舶当前状态、可承接货物类型、航线限制等（不超过200字）" maxlength="200" rows="4"></textarea>
            <span class="char-count">{{ formData.remarks.length }}/200</span>
          </div>
        </div>
      </div>

      <!-- Photo Upload -->
      <div v-if="selectedVessel" class="form-section">
        <h3>船舶照片</h3>
        <div class="upload-section">
          <div class="upload-box">
            <input type="file" multiple accept="image/jpeg,image/png" @change="handlePhotoUpload" ref="photoInput">
            <div class="upload-hint">
              <p>上传实时照片（1-3张）</p>
              <p style="font-size: 12px; color: #999;">支持JPG/PNG格式，每张不超过5MB</p>
            </div>
          </div>
          <div class="photo-preview">
            <div v-for="(photo, index) in formData.photos" :key="index" class="photo-item">
              <img :src="photo" alt="preview">
              <button class="remove-btn" @click="removePhoto(index)">×</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="selectedVessel" class="form-actions">
        <button class="btn btn-cancel" @click="goBack">取消</button>
        <button class="btn btn-primary" @click="submitForm">提交审核</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const vesselSearch = ref('')
const selectedVessel = ref(null)
const photoInput = ref(null)

const mockVessels = [
  { id: 1, vesselName: '远洋货轮', vesselType: '散货船', imo: 'IMO001', dwt: 57000, age: 8, navigationArea: '无限航区', classificationSociety: 'DNV', buildDate: '2015年6月', buildPlace: '中国', flag: '中国', portOfRegistry: '上海', grossTonnage: 25000, netTonnage: 15000, length: 185, width: 28, depth: 15, mainEnginePower: 9480, mainEngineModel: '6S50MC', deadweight: 32000 },
  { id: 2, vesselName: '海洋之星', vesselType: '油船', imo: 'IMO002', dwt: 45000, age: 10, navigationArea: '无限航区', classificationSociety: 'ClassNK', buildDate: '2013年3月', buildPlace: '日本', flag: '利比里亚', portOfRegistry: '新加坡', grossTonnage: 20000, netTonnage: 12000, length: 165, width: 26, depth: 14, mainEnginePower: 8500, mainEngineModel: 'MAN B&W', deadweight: 28000 },
  { id: 3, vesselName: '东方巨轮', vesselType: '集装箱船', imo: 'IMO003', dwt: 32000, age: 12, navigationArea: '无限航区', classificationSociety: 'ABS', buildDate: '2011年9月', buildPlace: '韩国', flag: '中国', portOfRegistry: '深圳', grossTonnage: 18000, netTonnage: 11000, length: 155, width: 25, depth: 13, mainEnginePower: 7200, mainEngineModel: 'Wärtsilä', deadweight: 25000 }
]

const filteredVessels = computed(() => {
  return mockVessels.filter(v =>
    v.vesselName.toLowerCase().includes(vesselSearch.value.toLowerCase()) ||
    v.imo.toLowerCase().includes(vesselSearch.value.toLowerCase())
  )
})

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
  mainEnginePower: null,
  mainEngineModel: '',
  deadweight: null,
  currentLocation: '',
  availableDateStart: '',
  availableDateEnd: '',
  leaseTypes: [],
  contactName: '',
  contactPhone: '',
  remarks: '',
  photos: []
})

const handlePhotoUpload = (e) => {
  const files = e.target.files
  if (files && formData.value.photos.length + files.length <= 3) {
    for (let file of files) {
      const reader = new FileReader()
      reader.onload = (event) => {
        formData.value.photos.push(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  } else {
    alert('最多只能上传3张照片')
  }
}

const removePhoto = (index) => {
  formData.value.photos.splice(index, 1)
}

const submitForm = () => {
  if (!formData.value.currentLocation || !formData.value.availableDateStart || !formData.value.availableDateEnd || formData.value.leaseTypes.length === 0 || !formData.value.contactName || !formData.value.contactPhone) {
    alert('请填写所有必填项')
    return
  }

  console.log('[v0] 提交空船信息:', formData.value)
  alert('空船信息已提交，待运营审核后展示')
  router.push('/vessel-leasing')
}

const goBack = () => {
  router.push('/vessel-leasing')
}

// Pre-fill data when vessel is selected
const handleVesselSelect = () => {
  if (selectedVessel.value) {
    formData.value.vesselType = selectedVessel.value.vesselType
    formData.value.navigationArea = selectedVessel.value.navigationArea
    formData.value.vesselName = selectedVessel.value.vesselName
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
    formData.value.mainEnginePower = selectedVessel.value.mainEnginePower
    formData.value.mainEngineModel = selectedVessel.value.mainEngineModel
    formData.value.deadweight = selectedVessel.value.deadweight
  }
}

// Watch selectedVessel to pre-fill data
const updateSelectedVessel = (vessel) => {
  selectedVessel.value = vessel
  handleVesselSelect()
}

// Update the click handler
const selectVessel = (vessel) => {
  updateSelectedVessel(vessel)
}
</script>

<style scoped>
.publish-idle-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding: 40px 0;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 24px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 15px;
  color: #64748B;
}

.step-content {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.form-section {
  padding: 30px 40px;
  border-bottom: 1px solid #F1F5F9;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
}

.vessel-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.vessel-item {
  padding: 16px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.vessel-item:hover {
  border-color: #3b82f6;
  background: #F0F9FF;
}

.vessel-item.selected {
  border-color: #3b82f6;
  background: #EFF6FF;
}

.vessel-info h4 {
  font-size: 15px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 4px;
}

.vessel-details {
  font-size: 12px;
  color: #64748B;
  margin-bottom: 2px;
}

.vessel-code {
  font-size: 11px;
  color: #94A3B8;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94A3B8;
  font-size: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 6px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group input[readonly] {
  background: #F8FAFC;
  color: #94A3B8;
}

.date-range {
  display: flex;
  gap: 12px;
  align-items: center;
}

.date-range input {
  flex: 1;
  padding: 10px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
}

.separator {
  color: #94A3B8;
  font-weight: 600;
}

.checkbox-group {
  display: flex;
  gap: 24px;
  margin-top: 6px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-group input {
  width: auto;
}

.char-count {
  font-size: 11px;
  color: #94A3B8;
  margin-top: 6px;
  text-align: right;
}

.upload-section {
  margin-top: 16px;
}

.upload-box {
  border: 2px dashed #E2E8F0;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  margin-bottom: 16px;
}

.upload-box:hover {
  border-color: #3b82f6;
  background: #F0F9FF;
}

.upload-box input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-hint p {
  font-size: 13px;
  color: #64748B;
  margin: 4px 0;
}

.photo-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.photo-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s;
}

.remove-btn:hover {
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 30px 40px;
  border-top: 1px solid #F1F5F9;
}

.btn {
  padding: 12px 40px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #F1F5F9;
  color: #64748B;
}

.btn-cancel:hover {
  background: #E2E8F0;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}
</style>

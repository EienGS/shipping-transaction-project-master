<template>
  <div class="publish-lease-page">
    <!-- Header -->
    <div class="page-header">
      <h1>发布租赁信息</h1>
      <p>出租方通过选择船舶、租赁类型、填写信息完成租赁发布</p>
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator">
      <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <span class="step-number">1</span>
        <span class="step-label">选择船舶</span>
      </div>
      <div class="step-connector" :class="{ active: currentStep > 1 }"></div>
      <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
        <span class="step-number">2</span>
        <span class="step-label">选择租赁类型</span>
      </div>
      <div class="step-connector" :class="{ active: currentStep > 2 }"></div>
      <div class="step" :class="{ active: currentStep === 3 }">
        <span class="step-number">3</span>
        <span class="step-label">填写信息</span>
      </div>
    </div>

    <!-- Step 1: Vessel Selection -->
    <div v-if="currentStep === 1" class="step-content">
      <div class="search-box">
        <input type="text" v-model="vesselSearch" placeholder="搜索船舶：输入船名、船舶识别号等">
      </div>

      <div class="vessel-list">
        <div v-if="filteredVessels.length === 0" class="empty-state">
          <p>未找到可租赁船舶</p>
        </div>
        <div v-for="vessel in filteredVessels" :key="vessel.id" class="vessel-item" :class="{ selected: selectedVessel?.id === vessel.id }" @click="selectedVessel = vessel">
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

      <div class="step-actions">
        <button class="btn btn-cancel" @click="goBack">取消</button>
        <button class="btn btn-primary" @click="goToStep2" :disabled="!selectedVessel">确认</button>
      </div>
    </div>

    <!-- Step 2: Lease Type Selection -->
    <div v-if="currentStep === 2" class="step-content">
      <h3>请选择租赁类型</h3>
      <div class="lease-type-options">
        <div class="type-card" :class="{ selected: leaseType === 'time' }" @click="selectLeaseType('time')">
          <div class="type-icon">📅</div>
          <h4>期租</h4>
          <p>按月份租赁，长期承诺租赁模式</p>
        </div>
        <div class="type-card" :class="{ selected: leaseType === 'bareboat' }" @click="selectLeaseType('bareboat')">
          <div class="type-icon">🚢</div>
          <h4>光租</h4>
          <p>租赁空船，由承租方配备人员和燃油</p>
        </div>
        <div class="type-card" :class="{ selected: leaseType === 'voyage' }" @click="selectLeaseType('voyage')">
          <div class="type-icon">⛴️</div>
          <h4>航次租船</h4>
          <p>按航次计费，灵活的短期租赁模式</p>
        </div>
      </div>

      <div class="step-actions">
        <button class="btn btn-cancel" @click="currentStep = 1">上一步</button>
        <button class="btn btn-primary" @click="goToStep3" :disabled="!leaseType">下一步</button>
      </div>
    </div>

    <!-- Step 3: Information Filling -->
    <div v-if="currentStep === 3" class="step-content">
      <div class="form-container">
        <h3>船舶信息</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>船舶类型 *</label>
            <input type="text" v-model="formData.vesselType" placeholder="散货船" readonly>
          </div>
          <div class="form-group">
            <label>航区 *</label>
            <input type="text" v-model="formData.navigationArea" placeholder="无限航区" readonly>
          </div>
          <div class="form-group">
            <label>船名</label>
            <input type="text" v-model="formData.vesselName" placeholder="船舶名称">
          </div>
          <div class="form-group">
            <label>船级</label>
            <input type="text" v-model="formData.classificationSociety" placeholder="DNV">
          </div>
          <div class="form-group">
            <label>建造厂</label>
            <input type="text" v-model="formData.buildPlace" placeholder="建造地">
          </div>
          <div class="form-group">
            <label>建造日期 *</label>
            <input type="text" v-model="formData.buildDate" placeholder="2015年6月">
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
            <input type="text" v-model="formData.portOfRegistry" placeholder="上海">
          </div>
          <div class="form-group">
            <label>总吨 *</label>
            <input type="number" v-model.number="formData.grossTonnage" placeholder="25000">
          </div>
          <div class="form-group">
            <label>净吨 *</label>
            <input type="number" v-model.number="formData.netTonnage" placeholder="15000">
          </div>
          <div class="form-group">
            <label>总长(米) *</label>
            <input type="number" v-model.number="formData.length" placeholder="185">
          </div>
          <div class="form-group">
            <label>型宽(米) *</label>
            <input type="number" v-model.number="formData.width" placeholder="28">
          </div>
          <div class="form-group">
            <label>型深(米) *</label>
            <input type="number" v-model.number="formData.depth" placeholder="15">
          </div>
          <div class="form-group">
            <label>主机功率(kW)</label>
            <input type="number" v-model.number="formData.mainEnginePower" placeholder="9480">
          </div>
          <div class="form-group">
            <label>主机型号</label>
            <input type="text" v-model="formData.mainEngineModel" placeholder="6S50MC">
          </div>
          <div class="form-group">
            <label>载重(吨) *</label>
            <input type="number" v-model.number="formData.deadweight" placeholder="32000">
          </div>
        </div>

        <h3 style="margin-top: 40px;">租赁信息</h3>
        <div class="form-grid">
          <!-- Lease Type Specific Fields -->
          <template v-if="leaseType === 'time' || leaseType === 'bareboat'">
            <div class="form-group">
              <label>租金标准(万元/月) *</label>
              <input type="number" v-model.number="formData.rentalPrice" step="0.01" placeholder="请输入租金">
            </div>
            <div class="form-group">
              <label>租赁期限(月) *</label>
              <input type="text" v-model="formData.leaseDuration" placeholder="例: 12-24">
            </div>
            <div class="form-group full-width">
              <label>可租起始时间 *</label>
              <input type="date" v-model="formData.availableDate">
            </div>
          </template>

          <template v-if="leaseType === 'voyage'">
            <div class="form-group">
              <label>租金标准(万元/航次) *</label>
              <input type="number" v-model.number="formData.rentalPrice" step="0.01" placeholder="请输入租金">
            </div>
            <div class="form-group full-width">
              <label>航线范围 *</label>
              <input type="text" v-model="formData.voyageRoute" placeholder="例: 上海-新加坡">
            </div>
            <div class="form-group full-width">
              <label>航次周期 *</label>
              <input type="text" v-model="formData.voyageCycle" placeholder="例: 30天">
            </div>
          </template>

          <div class="form-group full-width">
            <label>租赁要求 *</label>
            <textarea v-model="formData.rentalRequirements" placeholder="填写租赁要求，不超过300字" maxlength="300" rows="4"></textarea>
            <span class="char-count">{{ formData.rentalRequirements.length }}/300</span>
          </div>

          <div class="form-group">
            <label>联系人 *</label>
            <input type="text" v-model="formData.contactName" placeholder="请输入联系人姓名">
          </div>

          <div class="form-group">
            <label>联系电话 *</label>
            <input type="tel" v-model="formData.contactPhone" placeholder="请输入手机号">
          </div>
        </div>

        <h3 style="margin-top: 40px;">资料上传</h3>
        <div class="upload-section">
          <div class="upload-box">
            <input type="file" multiple accept="image/jpeg,image/png" @change="handlePhotoUpload" ref="photoInput">
            <div class="upload-hint">
              <p>上传船舶照片（至少3张）</p>
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

        <div class="step-actions" style="margin-top: 40px;">
          <button class="btn btn-cancel" @click="currentStep = 2">上一步</button>
          <button class="btn btn-primary" @click="submitForm">提交审核</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentStep = ref(1)
const vesselSearch = ref('')
const selectedVessel = ref(null)
const leaseType = ref('')
const photoInput = ref(null)

const mockVessels = [
  { id: 1, vesselName: '远洋货轮', vesselType: '散货船', imo: 'IMO001', dwt: 57000, age: 8, navigationArea: '无限航区' },
  { id: 2, vesselName: '海洋之星', vesselType: '油船', imo: 'IMO002', dwt: 45000, age: 10, navigationArea: '无限航区' },
  { id: 3, vesselName: '东方巨轮', vesselType: '集装箱船', imo: 'IMO003', dwt: 32000, age: 12, navigationArea: '无限航区' }
]

const filteredVessels = ref(mockVessels)

const formData = ref({
  vesselType: '散货船',
  navigationArea: '无限航区',
  vesselName: '',
  classificationSociety: 'DNV',
  buildPlace: '',
  buildDate: '',
  flag: '中国',
  portOfRegistry: '',
  grossTonnage: null,
  netTonnage: null,
  length: null,
  width: null,
  depth: null,
  mainEnginePower: null,
  mainEngineModel: '',
  deadweight: null,
  rentalPrice: null,
  leaseDuration: '',
  voyageRoute: '',
  voyageCycle: '',
  availableDate: '',
  rentalRequirements: '',
  contactName: '',
  contactPhone: '',
  photos: []
})

const selectLeaseType = (type) => {
  leaseType.value = type
}

const goToStep2 = () => {
  if (selectedVessel.value) {
    formData.value.vesselName = selectedVessel.value.vesselName
    currentStep.value = 2
  }
}

const goToStep3 = () => {
  if (leaseType.value) {
    currentStep.value = 3
  }
}

const handlePhotoUpload = (e) => {
  const files = e.target.files
  if (files) {
    for (let file of files) {
      const reader = new FileReader()
      reader.onload = (event) => {
        formData.value.photos.push(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
}

const removePhoto = (index) => {
  formData.value.photos.splice(index, 1)
}

const submitForm = () => {
  if (formData.value.photos.length < 3) {
    alert('请至少上传3张照片')
    return
  }
  console.log('[v0] 提交租赁信息:', { ...formData.value, leaseType: leaseType.value })
  alert('租赁信息已提交，待审核')
  router.push('/vessel-leasing')
}

const goBack = () => {
  router.push('/vessel-leasing')
}
</script>

<style scoped>
.publish-lease-page {
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

.step-indicator {
  max-width: 1200px;
  margin: 0 auto 60px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.step.active,
.step.completed {
  opacity: 1;
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
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s;
}

.step.active .step-number {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
}

.step.active .step-label {
  color: #1E293B;
}

.step-connector {
  width: 30px;
  height: 2px;
  background: #E2E8F0;
  transition: background 0.3s;
}

.step-connector.active {
  background: #10b981;
}

.step-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-box {
  margin-bottom: 30px;
}

.search-box input {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
}

.vessel-list {
  margin-bottom: 30px;
}

.vessel-item {
  padding: 20px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  margin-bottom: 12px;
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
  font-size: 16px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 6px;
}

.vessel-details {
  font-size: 13px;
  color: #64748B;
  margin-bottom: 4px;
}

.vessel-code {
  font-size: 12px;
  color: #94A3B8;
}

.checkbox input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.lease-type-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 30px 0;
}

.type-card {
  padding: 30px 20px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.type-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.type-card.selected {
  border-color: #3b82f6;
  background: #EFF6FF;
}

.type-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.type-card h4 {
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
}

.type-card p {
  font-size: 13px;
  color: #64748B;
}

.form-container h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
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

.char-count {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 6px;
  text-align: right;
}

.upload-section {
  margin-bottom: 30px;
}

.upload-box {
  border: 2px dashed #E2E8F0;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  margin-bottom: 20px;
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
  font-size: 14px;
  color: #64748B;
  margin: 4px 0;
}

.photo-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.photo-item {
  position: relative;
  width: 120px;
  height: 120px;
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
  width: 28px;
  height: 28px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.3s;
}

.remove-btn:hover {
  transform: scale(1.1);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94A3B8;
  font-size: 15px;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
}

.btn {
  padding: 12px 40px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

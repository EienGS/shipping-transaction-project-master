<template>
  <div class="publish-demand-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-desc">{{ pageDescription }}</p>
      </div>

      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <!-- 通用基础信息 -->
          <section class="form-section">
            <h2 class="section-title">基础信息</h2>
            
            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">需求标题</label>
                <input v-model="formData.title" type="text" class="form-input" placeholder="请输入需求标题（不超过30字）" maxlength="30" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">船舶类型</label>
                <select v-model="formData.shipType" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="bulk">散货船</option>
                  <option value="tanker">油船</option>
                  <option value="container">集装箱船</option>
                  <option value="reefer">冷藏船</option>
                </select>
              </div>

              <div class="form-item">
                <label class="form-label required">联系人</label>
                <input v-model="formData.contact" type="text" class="form-input" placeholder="请输入联系人" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">联系电话</label>
                <input v-model="formData.phone" type="tel" class="form-input" placeholder="请输入联系电话" required>
              </div>

              <div class="form-item">
                <label class="form-label required">期望对接时间</label>
                <input v-model="formData.expectDate" type="date" class="form-input" required>
              </div>
            </div>
          </section>

          <!-- 设计需求专属字段 -->
          <section v-if="demandType === 'design'" class="form-section">
            <h2 class="section-title">设计需求</h2>
            
            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">设计吨位</label>
                <div class="input-group">
                  <input v-model.number="formData.designTonnage" type="number" class="form-input" placeholder="请输入数值" required>
                  <span class="input-suffix">DWT</span>
                </div>
              </div>

              <div class="form-item">
                <label class="form-label required">航区要求</label>
                <select v-model="formData.navigationArea" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="unlimited">无限航区</option>
                  <option value="coastal">沿海航区</option>
                  <option value="river">内河航区</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">设计交付周期要求</label>
                <input v-model="formData.deliveryCycle" type="text" class="form-input" placeholder="例如：3-6个月" required>
              </div>

              <div class="form-item">
                <label class="form-label">设计预算范围</label>
                <div class="input-group">
                  <input v-model="formData.budgetMin" type="number" class="form-input" placeholder="最小">
                  <span class="input-separator">-</span>
                  <input v-model="formData.budgetMax" type="number" class="form-input" placeholder="最大">
                  <span class="input-suffix">万元</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 造船需求专属字段 -->
          <section v-if="demandType === 'build'" class="form-section">
            <h2 class="section-title">造船需求</h2>
            
            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">建造吨位</label>
                <div class="input-group">
                  <input v-model.number="formData.buildTonnage" type="number" class="form-input" placeholder="请输入数值" required>
                  <span class="input-suffix">DWT</span>
                </div>
              </div>

              <div class="form-item">
                <label class="form-label required">船体材质要求</label>
                <select v-model="formData.hullMaterial" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="steel">钢质</option>
                  <option value="aluminum">铝合金</option>
                  <option value="frp">玻璃钢</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item full-width">
                <label class="form-label required">动力系统配置要求</label>
                <textarea v-model="formData.powerSystem" class="form-textarea" placeholder="请描述动力系统配置要求" rows="3" required></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">建造交付周期</label>
                <input v-model="formData.buildCycle" type="text" class="form-input" placeholder="例如：12-18个月" required>
              </div>

              <div class="form-item">
                <label class="form-label required">预算范围</label>
                <div class="input-group">
                  <input v-model="formData.budgetMin" type="number" class="form-input" placeholder="最小" required>
                  <span class="input-separator">-</span>
                  <input v-model="formData.budgetMax" type="number" class="form-input" placeholder="最大" required>
                  <span class="input-suffix">万元</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 维修需求专属字段 -->
          <section v-if="demandType === 'repair'" class="form-section">
            <h2 class="section-title">维修需求</h2>
            
            <div class="form-row">
              <div class="form-item full-width">
                <label class="form-label required">关联自有船舶</label>
                <select v-model="formData.vesselId" class="form-select" required @change="loadVesselInfo">
                  <option value="">请选择船舶</option>
                  <option value="1">散货船 OCEAN STAR（IMO1234567）</option>
                  <option value="2">油船 SEA DRAGON（IMO7654321）</option>
                </select>
              </div>
            </div>

            <div v-if="formData.vesselId" class="vessel-info-box">
              <h3 class="info-title">船舶基础信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">船名:</span>
                  <span class="info-value">{{ vesselInfo.name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">识别号:</span>
                  <span class="info-value">{{ vesselInfo.imo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">船龄:</span>
                  <span class="info-value">{{ vesselInfo.age }}年</span>
                </div>
                <div class="info-item">
                  <span class="info-label">当前位置:</span>
                  <span class="info-value">{{ vesselInfo.location }}</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">维修内容</label>
                <select v-model="formData.repairType" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="routine">常规保养</option>
                  <option value="fault">故障维修</option>
                  <option value="major">大修</option>
                  <option value="emergency">应急维修</option>
                </select>
              </div>

              <div class="form-item">
                <label class="form-label required">维修紧急程度</label>
                <select v-model="formData.urgency" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="normal">普通</option>
                  <option value="urgent">紧急</option>
                  <option value="express">加急</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item full-width">
                <label class="form-label required">故障/维修部位</label>
                <textarea v-model="formData.faultPart" class="form-textarea" placeholder="请详细描述故障部位和具体问题" rows="3" required></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">维修地点偏好</label>
                <select v-model="formData.repairLocation" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="shipyard">船厂维修</option>
                  <option value="onsite">上门维修</option>
                  <option value="port">港口就近维修</option>
                </select>
              </div>

              <div class="form-item">
                <label class="form-label">维修预算范围</label>
                <div class="input-group">
                  <input v-model="formData.budgetMin" type="number" class="form-input" placeholder="最小">
                  <span class="input-separator">-</span>
                  <input v-model="formData.budgetMax" type="number" class="form-input" placeholder="最大">
                  <span class="input-suffix">万元</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item full-width">
                <label class="form-label">故障照片/视频上传</label>
                <div class="upload-area">
                  <input type="file" id="fileUpload" class="file-input" accept="image/*,video/*" multiple @change="handleFileUpload">
                  <label for="fileUpload" class="upload-label">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2"/>
                      <path d="M17 8L12 3L7 8M12 3V15" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>点击上传文件</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <!-- 补充说明 -->
          <section class="form-section">
            <h2 class="section-title">补充说明</h2>
            
            <div class="form-row">
              <div class="form-item full-width">
                <label class="form-label">补充说明</label>
                <textarea v-model="formData.notes" class="form-textarea" placeholder="请填写补充说明（500字以内）" rows="4" maxlength="500"></textarea>
                <div class="char-count">{{ formData.notes?.length || 0 }}/500</div>
              </div>
            </div>
          </section>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <button type="button" class="btn-preview" @click="handlePreview">预览效果</button>
            <button type="submit" class="btn-submit">提交审核</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const demandType = ref(route.params.type || 'design')

const pageTitle = computed(() => {
  const titles = {
    design: '发布设计需求',
    build: '发布造船需求',
    repair: '发布维修需求'
  }
  return titles[demandType.value] || '发布需求'
})

const pageDescription = computed(() => {
  const descs = {
    design: '填写船舶设计需求信息，我们将为您匹配优质设计院',
    build: '填写造船需求信息，我们将为您推荐合适的造船厂',
    repair: '填写维修需求信息，智能推荐周边优质修船厂'
  }
  return descs[demandType.value] || ''
})

const formData = ref({
  title: '',
  shipType: '',
  contact: '',
  phone: '',
  expectDate: '',
  notes: '',
  // 设计专属
  designTonnage: null,
  navigationArea: '',
  deliveryCycle: '',
  // 造船专属
  buildTonnage: null,
  hullMaterial: '',
  powerSystem: '',
  buildCycle: '',
  // 维修专属
  vesselId: '',
  repairType: '',
  urgency: '',
  faultPart: '',
  repairLocation: '',
  // 通用
  budgetMin: null,
  budgetMax: null,
})

const vesselInfo = ref({
  name: '',
  imo: '',
  age: 0,
  location: ''
})

const loadVesselInfo = () => {
  if (formData.value.vesselId === '1') {
    vesselInfo.value = {
      name: 'OCEAN STAR',
      imo: 'IMO1234567',
      age: 8,
      location: '上海港'
    }
  } else if (formData.value.vesselId === '2') {
    vesselInfo.value = {
      name: 'SEA DRAGON',
      imo: 'IMO7654321',
      age: 12,
      location: '宁波港'
    }
  }
}

const handleFileUpload = (event) => {
  console.log('上传文件:', event.target.files)
}

const handlePreview = () => {
  console.log('预览需求:', formData.value)
  alert('预览功能开发中')
}

const handleSubmit = () => {
  console.log('提交需求:', formData.value)
  alert('提交成功，等待审核')
  router.push('/ship-repair')
}
</script>

<style scoped>
.publish-demand-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding: 40px 0;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #1E293B;
  margin-bottom: 12px;
}

.page-desc {
  font-size: 16px;
  color: #64748B;
}

.form-container {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 2px solid #F1F5F9;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.form-label.required::after {
  content: '*';
  color: #EF4444;
  margin-left: 4px;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 16px;
  border: 1.5px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  transition: all 0.3s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group .form-input {
  flex: 1;
}

.input-separator,
.input-suffix {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
  white-space: nowrap;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #94A3B8;
  margin-top: 4px;
}

.vessel-info-box {
  padding: 20px;
  background: #F8FAFC;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  margin-bottom: 20px;
}

.info-title {
  font-size: 16px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
}

.info-value {
  font-size: 14px;
  color: #1E293B;
}

.upload-area {
  position: relative;
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  border: 2px dashed #CBD5E1;
  border-radius: 12px;
  background: #F8FAFC;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-label:hover {
  border-color: #3B82F6;
  background: #EFF6FF;
}

.upload-label svg {
  width: 48px;
  height: 48px;
  color: #64748B;
}

.upload-label span {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
}

.btn-preview,
.btn-submit {
  padding: 14px 40px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-preview {
  background: #F1F5F9;
  color: #475569;
}

.btn-preview:hover {
  background: #E2E8F0;
}

.btn-submit {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}
</style>

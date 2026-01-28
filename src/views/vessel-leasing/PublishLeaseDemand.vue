<template>
  <div class="publish-demand-page">
    <div class="page-header">
      <h1>发布求租信息</h1>
      <p>承租方通过选择租赁类型、填写求租细节完成需求发布</p>
    </div>

    <div class="step-indicator">
      <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <span class="step-number">1</span>
        <span class="step-label">选择租赁类型</span>
      </div>
      <div class="step-connector" :class="{ active: currentStep > 1 }"></div>
      <div class="step" :class="{ active: currentStep === 2 }">
        <span class="step-number">2</span>
        <span class="step-label">填写求租信息</span>
      </div>
    </div>

    <!-- Step 1: Lease Type Selection -->
    <div v-if="currentStep === 1" class="step-content">
      <h3>请选择租赁类型</h3>
      <div class="lease-type-options">
        <div class="type-card" :class="{ selected: leaseType === 'time' }" @click="selectAndProceed('time')">
          <div class="type-icon">📅</div>
          <h4>期租</h4>
          <p>按月份租赁，长期承诺租赁模式</p>
        </div>
        <div class="type-card" :class="{ selected: leaseType === 'bareboat' }" @click="selectAndProceed('bareboat')">
          <div class="type-icon">🚢</div>
          <h4>光租</h4>
          <p>租赁空船，由承租方配备人员和燃油</p>
        </div>
        <div class="type-card" :class="{ selected: leaseType === 'voyage' }" @click="selectAndProceed('voyage')">
          <div class="type-icon">⛴️</div>
          <h4>航次租船</h4>
          <p>按航次计费，灵活的短期租赁模式</p>
        </div>
      </div>

      <div class="step-actions">
        <button class="btn btn-cancel" @click="goBack">取消</button>
      </div>
    </div>

    <!-- Step 2: Form Filling -->
    <div v-if="currentStep === 2" class="step-content">
      <div class="form-container">
        <h3>求租基本信息</h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label>求租标题 *</label>
            <input type="text" v-model="formData.title" placeholder="如：长期期租5000吨散货船" maxlength="30">
            <span class="char-count">{{ formData.title.length }}/30</span>
          </div>

          <div class="form-group">
            <label>联系人 *</label>
            <input type="text" v-model="formData.contactName" placeholder="张三">
          </div>

          <div class="form-group">
            <label>联系电话 *</label>
            <input type="tel" v-model="formData.contactPhone" placeholder="请输入手机号">
          </div>

          <div class="form-group">
            <label>企业/个人名称 *</label>
            <input type="text" v-model="formData.companyName" placeholder="企业或个人名称">
          </div>
        </div>

        <h3 style="margin-top: 40px;">求租需求</h3>
        <div class="form-grid">
          <!-- Time/Bareboat Charter -->
          <template v-if="leaseType === 'time' || leaseType === 'bareboat'">
            <div class="form-group">
              <label>船舶类型 *</label>
              <select v-model="formData.vesselType">
                <option value="">请选择</option>
                <option value="散货船">散货船</option>
                <option value="油船">油船</option>
                <option value="集装箱船">集装箱船</option>
              </select>
            </div>

            <div class="form-group">
              <label>载重吨范围 *</label>
              <input type="text" v-model="formData.dwtRange" placeholder="如：3000-5000">
            </div>

            <div class="form-group">
              <label>航区要求 *</label>
              <select v-model="formData.navigationArea">
                <option value="">请选择</option>
                <option value="无限航区">无限航区</option>
                <option value="国内近海">国内近海</option>
                <option value="东南亚航线">东南亚航线</option>
              </select>
            </div>

            <div class="form-group">
              <label>船龄要求 *</label>
              <select v-model="formData.ageRequirement">
                <option value="">请选择</option>
                <option value="5">5年以内</option>
                <option value="10">10年以内</option>
                <option value="15">15年以内</option>
                <option value="不限">不限</option>
              </select>
            </div>

            <div class="form-group">
              <label>交接港口偏好</label>
              <input type="text" v-model="formData.portPreference" placeholder="如：上海、新加坡">
            </div>

            <div class="form-group">
              <label>租赁期限 *</label>
              <input type="text" v-model="formData.leaseDuration" placeholder="如：12-24个月">
            </div>

            <div class="form-group full-width">
              <label>预算范围(万元/月) *</label>
              <div class="range-inputs">
                <input type="number" v-model.number="formData.budgetMin" placeholder="最低预算" step="0.01">
                <span class="separator">-</span>
                <input type="number" v-model.number="formData.budgetMax" placeholder="最高预算" step="0.01">
              </div>
            </div>
          </template>

          <!-- Voyage Charter -->
          <template v-if="leaseType === 'voyage'">
            <div class="form-group">
              <label>船舶类型 *</label>
              <select v-model="formData.vesselType">
                <option value="">请选择</option>
                <option value="散货船">散货船</option>
                <option value="油船">油船</option>
                <option value="集装箱船">集装箱船</option>
              </select>
            </div>

            <div class="form-group">
              <label>载重吨要求 *</label>
              <input type="number" v-model.number="formData.dwtRequired" placeholder="如：5000">
            </div>

            <div class="form-group full-width">
              <label>航线信息 *</label>
              <input type="text" v-model="formData.voyageRoute" placeholder="如：上海-新加坡-釜山">
            </div>

            <div class="form-group">
              <label>载货类型 *</label>
              <select v-model="formData.cargoType">
                <option value="">请选择</option>
                <option value="散杂货">散杂货</option>
                <option value="油品">油品</option>
                <option value="集装箱">集装箱</option>
              </select>
            </div>

            <div class="form-group">
              <label>航次时间要求 *</label>
              <input type="text" v-model="formData.voyageTimeline" placeholder="如：2个月内">
            </div>

            <div class="form-group full-width">
              <label>预算范围(万元/航次) *</label>
              <div class="range-inputs">
                <input type="number" v-model.number="formData.budgetMin" placeholder="最低预算" step="0.01">
                <span class="separator">-</span>
                <input type="number" v-model.number="formData.budgetMax" placeholder="最高预算" step="0.01">
              </div>
            </div>
          </template>

          <div class="form-group full-width">
            <label>补充要求</label>
            <textarea v-model="formData.remarks" placeholder="填写船舶设备配置要求、禁止运输品类等特殊诉求（不超过300字）" maxlength="300" rows="4"></textarea>
            <span class="char-count">{{ formData.remarks.length }}/300</span>
          </div>
        </div>

        <div class="step-actions" style="margin-top: 40px;">
          <button class="btn btn-cancel" @click="currentStep = 1">上一步</button>
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
const leaseType = ref('')

const formData = ref({
  title: '',
  contactName: '',
  contactPhone: '',
  companyName: '',
  vesselType: '',
  dwtRange: '',
  dwtRequired: null,
  navigationArea: '',
  ageRequirement: '',
  portPreference: '',
  cargoType: '',
  leaseDuration: '',
  voyageRoute: '',
  voyageTimeline: '',
  budgetMin: null,
  budgetMax: null,
  remarks: ''
})

const selectAndProceed = (type) => {
  leaseType.value = type
  currentStep.value = 2
}

const submitForm = () => {
  // Validation
  if (!formData.value.title || !formData.value.contactName || !formData.value.contactPhone || !formData.value.companyName) {
    alert('请填写所有必填项')
    return
  }

  if (formData.value.budgetMin && formData.value.budgetMax && formData.value.budgetMin > formData.value.budgetMax) {
    alert('预算起始金额不可高于结束金额')
    return
  }

  console.log('[v0] 提交求租信息:', { ...formData.value, leaseType: leaseType.value })
  alert('求租需求已提交，待审核后展示')
  router.push('/vessel-leasing')
}

const goBack = () => {
  router.push('/vessel-leasing')
}
</script>

<style scoped>
.publish-demand-page {
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
  gap: 60px;
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
  width: 60px;
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

.step-content h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 30px;
  text-align: center;
}

.lease-type-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 40px 0;
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

.range-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.range-inputs input {
  flex: 1;
  padding: 12px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
}

.separator {
  color: #94A3B8;
  font-weight: 600;
}

.char-count {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 6px;
  text-align: right;
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

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}
</style>

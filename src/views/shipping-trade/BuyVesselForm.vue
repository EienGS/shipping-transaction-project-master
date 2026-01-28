<template>
  <div class="buy-vessel-form">
    <div class="form-container">
      <div class="form-header">
        <h1>发布船舶求购信息</h1>
        <p class="form-desc">填写您的求购需求，平台将为您匹配合适的船舶资源</p>
      </div>

      <form @submit.prevent="handleSubmit" class="form-content">
        <!-- 基本信息 -->
        <div class="form-section">
          <h2 class="section-title">基本信息</h2>
          
          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">船舶类型</label>
              <select v-model="formData.vesselType" class="form-input" required>
                <option value="">请选择船舶类型</option>
                <option value="散货船">散货船</option>
                <option value="集装箱船">集装箱船</option>
                <option value="油船">油船</option>
                <option value="液化气船">液化气船</option>
                <option value="化学品船">化学品船</option>
                <option value="客船">客船</option>
                <option value="货船">货船</option>
              </select>
            </div>

            <div class="form-item required">
              <label class="form-label">航区</label>
              <select v-model="formData.navigationArea" class="form-input" required>
                <option value="">请选择航区</option>
                <option value="无限航区">无限航区</option>
                <option value="近海航区">近海航区</option>
                <option value="沿海航区">沿海航区</option>
                <option value="内河航区">内河航区</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">船籍港</label>
              <input 
                v-model="formData.portOfRegistry" 
                type="text" 
                class="form-input" 
                placeholder="请输入船籍港"
                required
              />
            </div>

            <div class="form-item required">
              <label class="form-label">船旗</label>
              <select v-model="formData.flag" class="form-input" required>
                <option value="">请选择船旗</option>
                <option value="中国">中国</option>
                <option value="巴拿马">巴拿马</option>
                <option value="利比里亚">利比里亚</option>
                <option value="马绍尔群岛">马绍尔群岛</option>
                <option value="香港">香港</option>
                <option value="新加坡">新加坡</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">建造地</label>
              <input 
                v-model="formData.buildPlace" 
                type="text" 
                class="form-input" 
                placeholder="请输入建造地（选填）"
              />
            </div>

            <div class="form-item required">
              <label class="form-label">船级</label>
              <select v-model="formData.classificationSociety" class="form-input" required>
                <option value="">请选择船级社</option>
                <option value="CCS">CCS (中国船级社)</option>
                <option value="ABS">ABS (美国船级社)</option>
                <option value="LR">LR (英国劳氏船级社)</option>
                <option value="DNV">DNV (挪威船级社)</option>
                <option value="BV">BV (法国船级社)</option>
                <option value="NK">NK (日本船级社)</option>
                <option value="KR">KR (韩国船级社)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">建造年份范围</label>
              <div class="year-range">
                <input 
                  v-model.number="formData.buildYearStart" 
                  type="number" 
                  class="form-input" 
                  placeholder="起始年份"
                  min="1950"
                  :max="currentYear"
                  required
                />
                <span class="range-separator">至</span>
                <input 
                  v-model.number="formData.buildYearEnd" 
                  type="number" 
                  class="form-input" 
                  placeholder="结束年份"
                  :min="formData.buildYearStart || 1950"
                  :max="currentYear"
                  required
                />
              </div>
              <span v-if="yearRangeError" class="error-message">{{yearRangeError}}</span>
            </div>

            <div class="form-item required">
              <label class="form-label">预算范围（万元）</label>
              <div class="year-range">
                <input 
                  v-model.number="formData.budgetMin" 
                  type="number" 
                  class="form-input" 
                  placeholder="最低预算"
                  min="0"
                  step="0.01"
                  required
                />
                <span class="range-separator">至</span>
                <input 
                  v-model.number="formData.budgetMax" 
                  type="number" 
                  class="form-input" 
                  placeholder="最高预算"
                  :min="formData.budgetMin || 0"
                  step="0.01"
                  required
                />
              </div>
              <span v-if="budgetRangeError" class="error-message">{{budgetRangeError}}</span>
            </div>
          </div>
        </div>

        <!-- 联系信息 -->
        <div class="form-section">
          <h2 class="section-title">联系信息</h2>
          
          <div class="form-row">
            <div class="form-item required">
              <label class="form-label">联系人</label>
              <input 
                v-model="formData.contactPerson" 
                type="text" 
                class="form-input" 
                placeholder="请输入联系人姓名"
                required
              />
            </div>

            <div class="form-item required">
              <label class="form-label">联系电话</label>
              <input 
                v-model="formData.contactPhone" 
                type="tel" 
                class="form-input" 
                placeholder="请输入手机号码"
                pattern="^1[3-9]\d{9}$"
                required
              />
              <span v-if="phoneError" class="error-message">{{phoneError}}</span>
            </div>
          </div>
        </div>

        <!-- 补充信息 -->
        <div class="form-section">
          <h2 class="section-title">补充信息</h2>
          
          <div class="form-item">
            <label class="form-label">备注信息（选填）</label>
            <textarea 
              v-model="formData.remarks" 
              class="form-textarea" 
              placeholder="请填写特殊需求，如船舶吨位要求、设备配置偏好、交付时间要求、付款方式倾向等"
              maxlength="500"
              rows="6"
            ></textarea>
            <div class="char-count">{{formData.remarks.length}}/500</div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="handleCancel">取消</button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{isSubmitting ? '提交中...' : '提交审核'}}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentYear = new Date().getFullYear()
const isSubmitting = ref(false)

// 表单数据
const formData = ref({
  vesselType: '',
  navigationArea: '',
  portOfRegistry: '',
  flag: '',
  buildPlace: '',
  classificationSociety: '',
  buildYearStart: null,
  buildYearEnd: null,
  budgetMin: null,
  budgetMax: null,
  contactPerson: '',
  contactPhone: '',
  remarks: ''
})

// 表单验证错误信息
const yearRangeError = ref('')
const budgetRangeError = ref('')
const phoneError = ref('')

// 监听年份范围变化
watch([() => formData.value.buildYearStart, () => formData.value.buildYearEnd], () => {
  if (formData.value.buildYearStart && formData.value.buildYearEnd) {
    if (formData.value.buildYearStart > formData.value.buildYearEnd) {
      yearRangeError.value = '起始年份不能大于结束年份'
    } else {
      yearRangeError.value = ''
    }
  }
})

// 监听预算范围变化
watch([() => formData.value.budgetMin, () => formData.value.budgetMax], () => {
  if (formData.value.budgetMin !== null && formData.value.budgetMax !== null) {
    if (formData.value.budgetMin > formData.value.budgetMax) {
      budgetRangeError.value = '最低预算不能大于最高预算'
    } else {
      budgetRangeError.value = ''
    }
  }
})

// 监听手机号变化
watch(() => formData.value.contactPhone, (newVal) => {
  if (newVal && !/^1[3-9]\d{9}$/.test(newVal)) {
    phoneError.value = '请输入正确的手机号格式'
  } else {
    phoneError.value = ''
  }
})

// 表单提交
const handleSubmit = async () => {
  // 验证年份范围
  if (yearRangeError.value || budgetRangeError.value || phoneError.value) {
    alert('请检查表单填写是否正确')
    return
  }

  // 验证必填字段
  const requiredFields = [
    'vesselType', 'navigationArea', 'portOfRegistry', 'flag', 
    'classificationSociety', 'buildYearStart', 
    'buildYearEnd', 'budgetMin', 'budgetMax', 'contactPerson', 'contactPhone'
  ]
  
  const emptyFields = requiredFields.filter(field => !formData.value[field])
  if (emptyFields.length > 0) {
    alert('请填写所有必填项')
    return
  }

  isSubmitting.value = true

  try {
    // 模拟API调用
    console.log('提交求购信息:', formData.value)
    
    // TODO: 实际API调用
    // await api.submitPurchaseRequest(formData.value)
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert('求购需求已提交，待运营审核后展示')
    
    // 跳转回船舶交易首页
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
.buy-vessel-form {
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

.form-content {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-section {
  margin-bottom: 32px;
}

.form-section:last-of-type {
  margin-bottom: 0;
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

.form-row:last-child {
  margin-bottom: 0;
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

.form-input {
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.form-input:hover {
  border-color: #40a9ff;
}

.form-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.form-input::placeholder {
  color: #bfbfbf;
}

.form-textarea {
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
  resize: vertical;
  font-family: inherit;
}

.form-textarea:hover {
  border-color: #40a9ff;
}

.form-textarea:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.year-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.year-range .form-input {
  flex: 1;
}

.range-separator {
  color: #8c8c8c;
  font-size: 14px;
}

.char-count {
  text-align: right;
  color: #8c8c8c;
  font-size: 12px;
  margin-top: 6px;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 6px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel,
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

.btn-submit {
  background: #1890ff;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #0d7de0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.btn-submit:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-header {
    padding: 24px;
  }

  .form-content {
    padding: 24px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>

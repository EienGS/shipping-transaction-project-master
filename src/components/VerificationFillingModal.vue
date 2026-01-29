<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content large-modal">
      <div class="modal-header">
        <h2>{{ verification?.verificationNo }} - 鉴证信息填报 ({{ roleLabel }})</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
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
          <div class="info-table-wrapper">
            <table class="info-table">
              <tr>
                <td class="label">船名</td>
                <td>{{ verification?.vesselName }}</td>
                <td class="label">船舶类型</td>
                <td>散货船</td>
              </tr>
              <tr>
                <td class="label">卖出方</td>
                <td colspan="3">{{ verification?.seller }}</td>
              </tr>
              <tr>
                <td class="label">买入方</td>
                <td colspan="3">{{ verification?.buyer }}</td>
              </tr>
              <tr>
                <td class="label">建造船厂</td>
                <td colspan="3">
                  <input v-model="form.shipyard" type="text" class="form-input" placeholder="大连中远海运川崎">
                </td>
              </tr>
              <tr>
                <td class="label">建造日期</td>
                <td>
                  <input v-model="form.buildDate" type="date" class="form-input">
                </td>
                <td class="label">船籍港</td>
                <td>
                  <input v-model="form.port" type="text" class="form-input" placeholder="ZHOUSHAN">
                </td>
              </tr>
              <tr>
                <td class="label">总长(m)</td>
                <td>
                  <input v-model="form.length" type="text" class="form-input" placeholder="199.90">
                </td>
                <td class="label">型深(m)</td>
                <td>
                  <input v-model="form.depth" type="text" class="form-input" placeholder="18.50">
                </td>
              </tr>
              <tr>
                <td class="label">总吨(t)</td>
                <td>
                  <input v-model="form.tonnage" type="text" class="form-input" placeholder="36000">
                </td>
                <td class="label">型宽(m)</td>
                <td>
                  <input v-model="form.width" type="text" class="form-input" placeholder="32.26">
                </td>
              </tr>
              <tr>
                <td class="label">载重(容)量</td>
                <td>
                  <input v-model="form.deadweight" type="text" class="form-input" placeholder="61000 DWT">
                </td>
                <td class="label">船级</td>
                <td>
                  <input v-model="form.classification" type="text" class="form-input" placeholder="CCS">
                </td>
              </tr>
              <tr>
                <td class="label">主机功率(KW)</td>
                <td>
                  <input v-model="form.enginePower" type="text" class="form-input" placeholder="8600">
                </td>
                <td class="label">航区</td>
                <td>
                  <input v-model="form.navigationArea" type="text" class="form-input" placeholder="无限航区">
                </td>
              </tr>
              <tr>
                <td class="label">船舶识别号</td>
                <td>
                  <input v-model="form.imo" type="text" class="form-input" placeholder="CN20181234567">
                </td>
                <td class="label">主机型号</td>
                <td>
                  <input v-model="form.engineModel" type="text" class="form-input" placeholder="MAN B&W 6550ME-B9">
                </td>
              </tr>
              <tr>
                <td class="label">成交价格(大写)</td>
                <td colspan="2">
                  <input v-model="form.priceText" type="text" class="form-input" placeholder="捌仟伍佰万元整">
                </td>
                <td>
                  <div class="price-input-cell">
                    <span>¥</span>
                    <input v-model="form.price" type="number" class="form-input" placeholder="85000000">
                  </div>
                </td>
              </tr>
              <tr>
                <td class="label">备注</td>
                <td colspan="3">
                  <textarea v-model="form.remarks" class="form-textarea" placeholder="其他补充说明..."></textarea>
                </td>
              </tr>
            </table>
          </div>

          <h3 style="margin-top: 24px;">{{ roleLabel }}经办人信息</h3>
          <div class="info-table-wrapper">
            <table class="info-table">
              <tr>
                <td class="label">经办人姓名</td>
                <td>
                  <input v-model="form.contactName" type="text" class="form-input" placeholder="请输入姓名">
                </td>
                <td class="label">联系电话</td>
                <td>
                  <input v-model="form.contactPhone" type="tel" class="form-input" placeholder="请输入手机号">
                </td>
              </tr>
              <tr v-if="currentRole === 'seller'">
                <td class="label">交付时间</td>
                <td colspan="3">
                  <input v-model="form.deliveryDate" type="date" class="form-input">
                </td>
              </tr>
            </table>
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
                <span class="cert-label">船籍港:</span>
                <span class="cert-value">ZHOUSHAN</span>
              </div>
              <div class="cert-row">
                <span class="cert-label">呼号:</span>
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
            <input v-model="form.certificateConfirmed" type="checkbox" id="certConfirm">
            <label for="certConfirm">我确认上述表单信息与数据库同步的证书信息一致，且真实有效</label>
          </div>

          <div v-if="!form.certificateConfirmed" class="upload-alert">
            <p>发现证书信息不一致？</p>
            <button class="btn-upload-supp">补充上传异常说明</button>
          </div>
        </div>

        <!-- Step 3: 文件上传 -->
        <div v-if="currentStep === 3" class="form-section">
          <h3>电子文件提交</h3>
          <p class="section-tips">支持 PDF、JPG 格式，单文件不超过 20MB</p>

          <div class="file-upload-section">
            <h4>{{ roleLabel }}需提交文件</h4>
            
            <div class="file-item">
              <label>{{ currentRole === 'seller' ? '营业执照（加盖电子公章）' : '身份证正面' }}</label>
              <div class="file-upload-area" @click="triggerFileInput('file1')">
                <input type="file" ref="fileInput1" accept=".pdf,.jpg,.jpeg" style="display: none" @change="handleFileUpload($event, 'file1')">
                <div v-if="!uploadedFiles.file1" class="upload-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  <p>点击上传文件</p>
                </div>
                <div v-else class="file-uploaded">
                  <div class="file-info">
                    <div class="file-name">{{ uploadedFiles.file1.name }}</div>
                    <div class="file-size">{{ (uploadedFiles.file1.size / 1024 / 1024).toFixed(2) }} MB</div>
                  </div>
                  <button @click.stop="removeFile('file1')" class="btn-remove">删除</button>
                </div>
              </div>
            </div>

            <div class="file-item">
              <label>{{ currentRole === 'seller' ? '经办人身份证正反面' : '身份证背面' }}</label>
              <div class="file-upload-area" @click="triggerFileInput('file2')">
                <input type="file" ref="fileInput2" accept=".pdf,.jpg,.jpeg" style="display: none" @change="handleFileUpload($event, 'file2')">
                <div v-if="!uploadedFiles.file2" class="upload-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  <p>点击上传文件</p>
                </div>
                <div v-else class="file-uploaded">
                  <div class="file-info">
                    <div class="file-name">{{ uploadedFiles.file2.name }}</div>
                    <div class="file-size">{{ (uploadedFiles.file2.size / 1024 / 1024).toFixed(2) }} MB</div>
                  </div>
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
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  verification: Object,
  currentRole: String
})

const emit = defineEmits(['close', 'submit'])

const currentStep = ref(1)
const uploadedFiles = ref({
  file1: null,
  file2: null
})

const form = ref({
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

const roleLabel = computed(() => props.currentRole === 'seller' ? '卖方' : '买方')

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
  if (fileKey === 'file1') {
    document.querySelector('input[ref="fileInput1"]')?.click()
  } else {
    document.querySelector('input[ref="fileInput2"]')?.click()
  }
}

const submitFilling = () => {
  emit('submit', {
    ...form.value,
    files: uploadedFiles.value
  })
}
</script>

<style scoped>
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
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
}

.large-modal {
  max-width: 1000px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E2E8F0;
  background: #F8FAFC;
  position: sticky;
  top: 0;
  z-index: 10;
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
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #E2E8F0;
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
  position: sticky;
  bottom: 0;
}

/* Steps Indicator */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 32px 24px;
  background: white;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
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
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
  white-space: nowrap;
}

.step.active .step-label {
  color: #0EA5E9;
  font-weight: 600;
}

.step-connector {
  width: 60px;
  height: 2px;
  background: #E2E8F0;
  transition: all 0.3s;
}

.step-connector.completed {
  background: #10B981;
}

/* Form Section */
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
  background: #F0F9FF;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #0EA5E9;
}

/* Info Table */
.info-table-wrapper {
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  padding: 12px 16px;
  font-size: 13px;
  border: 1px solid #F1F5F9;
  vertical-align: middle;
}

.info-table td.label {
  background: #F8FAFC;
  color: #475569;
  font-weight: 600;
  width: 140px;
  white-space: nowrap;
}

.form-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #CBD5E1;
  border-radius: 4px;
  font-size: 13px;
  background: white;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #CBD5E1;
  border-radius: 4px;
  font-size: 13px;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.price-input-cell {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-input-cell span {
  font-weight: 600;
  color: #475569;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.cert-row {
  display: flex;
  gap: 8px;
}

.cert-label {
  color: #64748B;
  font-weight: 500;
  font-size: 13px;
}

.cert-value {
  color: #0F172A;
  font-weight: 600;
  font-size: 13px;
}

.confirmation-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: #F0F9FF;
  border: 1px solid #BFDBFE;
  border-radius: 6px;
  margin: 16px 0;
}

.confirmation-box input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.confirmation-box label {
  font-size: 13px;
  color: #1E40AF;
  cursor: pointer;
  margin: 0;
  flex: 1;
}

.upload-alert {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 6px;
  padding: 14px;
  margin-top: 16px;
}

.upload-alert p {
  margin: 0 0 10px 0;
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
.file-upload-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 16px 0;
}

.file-item {
  margin-bottom: 20px;
}

.file-item label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 10px;
}

.file-upload-area {
  border: 2px dashed #CBD5E1;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #FAFAFA;
}

.file-upload-area:hover {
  border-color: #0EA5E9;
  background: #F0F9FF;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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
  padding: 12px 16px;
  background: #EFF6FF;
  border-radius: 6px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 4px;
}

.file-size {
  font-size: 12px;
  color: #64748B;
}

.btn-remove {
  padding: 6px 14px;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #DC2626;
}

/* Modal Buttons */
.btn-prev,
.btn-next,
.btn-submit {
  padding: 10px 24px;
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
  .large-modal {
    max-width: 100%;
  }

  .modal-content {
    margin: 0;
    border-radius: 0;
  }

  .cert-info {
    grid-template-columns: 1fr;
  }
}
</style>

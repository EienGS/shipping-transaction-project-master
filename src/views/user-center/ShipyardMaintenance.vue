<template>
  <div class="shipyard-maintenance-page">
    <!-- 未注册状态 -->
    <div v-if="!providerInfo.status" class="unregistered-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      </div>
      <h2>您还未注册造船厂服务商</h2>
      <p>注册成为造船厂服务商后，您可以接收船舶建造需求并提供专业服务</p>
      <button class="btn-register" @click="startRegistration">注册成为造船厂服务商</button>
      
      <!-- 模拟跳过审核按钮（仅用于演示） -->
      <button class="btn-skip-review" @click="skipToApproved">模拟跳过审核（测试用）</button>
    </div>

    <!-- 已注册状态 -->
    <template v-else>
      <!-- Status Banner -->
      <div class="status-banner" :class="`status-${providerInfo.status}`">
        <div class="banner-content">
          <svg v-if="providerInfo.status === 'pending'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="banner-icon">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else-if="providerInfo.status === 'approved'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="banner-icon">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else-if="providerInfo.status === 'rejected'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="banner-icon">
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div class="banner-text">
            <h3>{{ statusTitles[providerInfo.status] }}</h3>
            <p>{{ statusDescriptions[providerInfo.status] }}</p>
            <p v-if="providerInfo.status === 'rejected' && providerInfo.rejectReason" class="reject-reason">
              驳回原因：{{ providerInfo.rejectReason }}
            </p>
          </div>
        </div>
      </div>

      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1>造船厂信息维护</h1>
          <p>完善并管理您的造船厂对外展示信息</p>
        </div>
        <div class="header-actions">
          <button v-if="providerInfo.status === 'approved' && !isEditing" class="btn-secondary" @click="togglePublish">
            {{ providerInfo.isPublished ? '下架' : '上架' }}
          </button>
          <button v-if="!isEditing && providerInfo.status" class="btn-primary" @click="startEdit">
            编辑信息
          </button>
          <template v-if="isEditing">
            <button class="btn-cancel" @click="cancelEdit">取消</button>
            <button class="btn-save" @click="saveInfo">保存并提交审核</button>
          </template>
        </div>
      </div>

      <!-- Form Content -->
      <div class="form-container">
        <form @submit.prevent="saveInfo">
          <!-- 基础信息（只读） -->
          <section class="form-section">
            <div class="section-header">
              <h2>基础信息</h2>
              <span class="section-badge">系统预填</span>
            </div>
            <div class="info-grid readonly">
              <div class="info-item">
                <label>企业名称</label>
                <p>{{ providerInfo.companyName }}</p>
              </div>
              <div class="info-item">
                <label>统一社会信用代码</label>
                <p>{{ providerInfo.creditCode }}</p>
              </div>
              <div class="info-item full-width">
                <label>注册地址</label>
                <p>{{ providerInfo.registerAddress }}</p>
              </div>
            </div>
          </section>

          <!-- 必填信息 -->
          <section class="form-section">
            <div class="section-header">
              <h2>必填信息</h2>
              <span class="section-badge required">必填</span>
            </div>

            <div class="form-grid">
              <div class="form-item required full-width">
                <label>主要建造船型</label>
                <textarea 
                  v-model="formData.shipTypes" 
                  :disabled="!isEditing"
                  class="form-textarea"
                  placeholder="请描述您的主要建造船型，如：散货船、油船、集装箱船、化学品船等"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-item required">
                <label>所在城市</label>
                <input 
                  v-model="formData.city" 
                  :disabled="!isEditing"
                  type="text" 
                  class="form-input" 
                  placeholder="如：大连市"
                />
              </div>

              <div class="form-item required">
                <label>注册资本</label>
                <input 
                  v-model="formData.registeredCapital" 
                  :disabled="!isEditing"
                  type="text" 
                  class="form-input" 
                  placeholder="如：2亿元"
                />
              </div>

              <div class="form-item required">
                <label>船厂等级</label>
                <select v-model="formData.level" :disabled="!isEditing" class="form-select">
                  <option value="">请选择</option>
                  <option value="一级">一级</option>
                  <option value="二级">二级</option>
                  <option value="三级">三级</option>
                </select>
              </div>

              <div class="form-item required">
                <label>年建造能力</label>
                <input 
                  v-model="formData.annualCapacity" 
                  :disabled="!isEditing"
                  type="text" 
                  class="form-input" 
                  placeholder="如：15艘/年"
                />
              </div>

              <div class="form-item required">
                <label>船坞数量</label>
                <input 
                  v-model="formData.dockCount" 
                  :disabled="!isEditing"
                  type="text" 
                  class="form-input" 
                  placeholder="如：3个"
                />
              </div>

              <div class="form-item required">
                <label>最大船坞尺寸</label>
                <input 
                  v-model="formData.maxDockSize" 
                  :disabled="!isEditing"
                  type="text" 
                  class="form-input" 
                  placeholder="如：300m×60m"
                />
              </div>

              <div class="form-item required full-width">
                <label>建造能力范围</label>
                <textarea 
                  v-model="formData.buildingCapability" 
                  :disabled="!isEditing"
                  class="form-textarea"
                  placeholder="如：散货船（10000-80000DWT）、油船（20000-100000DWT）"
                  rows="2"
                ></textarea>
              </div>

              <div class="form-item required">
                <label>联系人</label>
                <input 
                  v-model="formData.contactPerson" 
                  :disabled="!isEditing"
                  type="text" 
                  class="form-input" 
                  placeholder="请输入联系人姓名"
                />
              </div>

              <div class="form-item required">
                <label>联系电话</label>
                <input 
                  v-model="formData.contactPhone" 
                  :disabled="!isEditing"
                  type="tel" 
                  class="form-input" 
                  placeholder="请输入手机号"
                />
              </div>

              <div class="form-item required">
                <label>官方邮箱</label>
                <input 
                  v-model="formData.email" 
                  :disabled="!isEditing"
                  type="email" 
                  class="form-input" 
                  placeholder="请输入企业邮箱"
                />
              </div>
            </div>
          </section>

          <!-- 选填信息 -->
          <section class="form-section">
            <div class="section-header">
              <h2>选填信息</h2>
              <span class="section-badge optional">选填</span>
            </div>

            <div class="form-grid">
              <div class="form-item full-width">
                <label>建造报价说明</label>
                <textarea 
                  v-model="formData.priceInfo" 
                  :disabled="!isEditing"
                  class="form-textarea"
                  placeholder="如：根据船舶类型和吨位，建造价格在5000-20000万元之间"
                  rows="2"
                ></textarea>
              </div>

              <div class="form-item full-width">
                <label>建造周期说明</label>
                <textarea 
                  v-model="formData.buildCycle" 
                  :disabled="!isEditing"
                  class="form-textarea"
                  placeholder="按船舶吨位/类型说明建造周期，如：5万吨散货船建造周期12-18个月"
                  rows="2"
                ></textarea>
              </div>

              <div class="form-item full-width">
                <label>其他说明</label>
                <textarea 
                  v-model="formData.otherInfo" 
                  :disabled="!isEditing"
                  class="form-textarea"
                  placeholder="补充其他重要信息"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </section>

          <!-- 建造案例 -->
          <section class="form-section">
            <div class="section-header">
              <h2>建造案例</h2>
              <span class="section-tips">最多上传3个案例</span>
            </div>

            <div class="cases-list">
              <div v-for="(caseItem, index) in formData.cases" :key="index" class="case-card">
                <div class="case-header">
                  <h4>案例 {{ index + 1 }}</h4>
                  <button v-if="isEditing" type="button" class="btn-remove" @click="removeCase(index)">删除</button>
                </div>
                <div class="case-form">
                  <div class="form-item required">
                    <label>案例名称</label>
                    <input v-model="caseItem.name" :disabled="!isEditing" type="text" class="form-input" placeholder="如：5万吨散货船建造" />
                  </div>
                  <div class="form-item required">
                    <label>完成时间</label>
                    <input v-model="caseItem.completedTime" :disabled="!isEditing" type="date" class="form-input" />
                  </div>
                  <div class="form-item full-width required">
                    <label>案例描述</label>
                    <textarea v-model="caseItem.description" :disabled="!isEditing" class="form-textarea" placeholder="请描述该建造案例的亮点和技术特点（300字内）" rows="3"></textarea>
                  </div>
                  <div class="form-item full-width">
                    <label>案例图片</label>
                    <div class="image-upload">
                      <img v-if="caseItem.image" :src="caseItem.image" alt="案例图片" class="case-image" />
                      <button v-if="isEditing" type="button" class="btn-upload" @click="uploadCaseImage(index)">
                        {{ caseItem.image ? '更换图片' : '上传图片' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button v-if="isEditing && formData.cases.length < 3" type="button" class="btn-add-case" @click="addCase">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                添加案例
              </button>
            </div>
          </section>

          <!-- 资料上传 -->
          <section class="form-section">
            <div class="section-header">
              <h2>资料上传</h2>
              <span class="section-tips">PDF格式，单文件≤20MB</span>
            </div>

            <div class="upload-section">
              <h4>资质证书（最多8个）</h4>
              <div class="file-list">
                <div v-for="(cert, index) in formData.certificates" :key="index" class="file-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="file-icon">
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
                    <path d="M13 2v7h7"/>
                  </svg>
                  <span class="file-name">{{ cert.name }}</span>
                  <button v-if="isEditing" type="button" class="btn-remove-file" @click="removeCertificate(index)">删除</button>
                </div>
                <button v-if="isEditing && formData.certificates.length < 8" type="button" class="btn-upload-file" @click="uploadCertificate">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  上传证书
                </button>
              </div>
            </div>

            <div class="upload-section">
              <h4>宣传图片（最多3张，JPG/PNG格式，单张≤5MB）</h4>
              <div class="photo-grid">
                <div v-for="(photo, index) in formData.photos" :key="index" class="photo-item">
                  <img :src="photo.url" alt="宣传图" />
                  <button v-if="isEditing" type="button" class="btn-remove-photo" @click="removePhoto(index)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <button v-if="isEditing && formData.photos.length < 3" type="button" class="btn-upload-photo" @click="uploadPhoto">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  上传图片
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isEditing = ref(false)

// 状态文案
const statusTitles = {
  pending: '审核中',
  approved: '已审核通过',
  rejected: '审核未通过'
}

const statusDescriptions = {
  pending: '您的企业信息正在审核中，预计1-2个工作日内完成审核',
  approved: '您的企业信息已审核通过，可在服务方列表中展示',
  rejected: '您的企业信息审核未通过，请根据驳回原因修改后重新提交'
}

// 企业基本信息
const providerInfo = ref({
  status: null, // pending / approved / rejected / null（未注册）
  isPublished: false,
  rejectReason: '',
  companyName: '大连船舶重工集团',
  creditCode: '91210200MA1234567B',
  registerAddress: '辽宁省大连市甘井子区船舶工业园区1号'
})

// 表单数据
const formData = reactive({
  shipTypes: '',
  city: '',
  registeredCapital: '',
  level: '',
  annualCapacity: '',
  dockCount: '',
  maxDockSize: '',
  buildingCapability: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  priceInfo: '',
  buildCycle: '',
  otherInfo: '',
  cases: [],
  certificates: [],
  photos: []
})

// 开始注册
const startRegistration = () => {
  console.log('[v0] 开始填报造船厂信息')
  providerInfo.value.status = 'editing' // 临时状态，表示正在填报
  isEditing.value = true
}

// 模拟跳过审核（测试用）
const skipToApproved = () => {
  console.log('[v0] 模拟跳过审核')
  providerInfo.value.status = 'approved'
  providerInfo.value.isPublished = true
  // 填充示例数据
  formData.shipTypes = '散货船、油船、集装箱船、化学品船'
  formData.city = '大连市'
  formData.registeredCapital = '2亿元'
  formData.level = '一级'
  formData.annualCapacity = '15艘/年'
  formData.dockCount = '3个'
  formData.maxDockSize = '300m×60m'
  formData.buildingCapability = '散货船（10000-80000DWT）、油船（20000-100000DWT）'
  formData.contactPerson = '王经理'
  formData.contactPhone = '13900139000'
  formData.email = 'contact@dlshipyard.com'
  formData.cases = [
    {
      name: '8万吨散货船建造',
      completedTime: '2023-12-01',
      description: '成功建造某航运公司8万吨级散货船，采用节能环保设计，获得业主高度评价。',
      image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=400&h=300&fit=crop'
    }
  ]
  formData.certificates = [
    { name: '营业执照.pdf', url: '/certificates/license.pdf' },
    { name: '一级船厂资质证书.pdf', url: '/certificates/qualification.pdf' }
  ]
  formData.photos = [
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop' }
  ]
  alert('已模拟审核通过，造船厂信息已完善')
}

// 开始编辑
const startEdit = () => {
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  if (providerInfo.value.status === 'editing') {
    // 如果是首次填报取消，则回到未注册状态
    providerInfo.value.status = null
  }
  isEditing.value = false
}

// 保存信息
const saveInfo = () => {
  console.log('[v0] 保存造船厂信息:', formData)
  // 提交审核逻辑
  providerInfo.value.status = 'pending'
  isEditing.value = false
  alert('信息已提交审核，请耐心等待审核结果')
}

// 上架/下架
const togglePublish = () => {
  providerInfo.value.isPublished = !providerInfo.value.isPublished
  alert(providerInfo.value.isPublished ? '已上架' : '已下架')
}

// 案例管理
const addCase = () => {
  if (formData.cases.length < 3) {
    formData.cases.push({
      name: '',
      completedTime: '',
      description: '',
      image: ''
    })
  }
}

const removeCase = (index) => {
  formData.cases.splice(index, 1)
}

const uploadCaseImage = (index) => {
  // 模拟上传
  formData.cases[index].image = 'https://images.unsplash.com/photo-1567899378793-4a4c64a41b41?w=400&h=300&fit=crop'
}

// 证书管理
const uploadCertificate = () => {
  formData.certificates.push({
    name: '新证书.pdf',
    url: '/certificates/new.pdf'
  })
}

const removeCertificate = (index) => {
  formData.certificates.splice(index, 1)
}

// 照片管理
const uploadPhoto = () => {
  formData.photos.push({
    url: 'https://images.unsplash.com/photo-1537996881514-5f6b4c5f5f5f?w=400&h=300&fit=crop'
  })
}

const removePhoto = (index) => {
  formData.photos.splice(index, 1)
}
</script>

<style scoped>
.shipyard-maintenance-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* 未注册状态 */
.unregistered-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 48px 24px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  color: #94a3b8;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.unregistered-state h2 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.unregistered-state p {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
  max-width: 500px;
}

.btn-register {
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  transition: all 0.3s;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
}

.btn-skip-review {
  margin-top: 16px;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  transition: all 0.3s;
}

.btn-skip-review:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

/* Status Banner */
.status-banner {
  margin-bottom: 24px;
  padding: 20px 24px;
  border-radius: 12px;
  background: white;
  border-left: 4px solid;
}

.status-banner.status-pending {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.status-banner.status-approved {
  border-left-color: #10b981;
  background: #ecfdf5;
}

.status-banner.status-rejected {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.banner-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.banner-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.status-pending .banner-icon {
  color: #f59e0b;
}

.status-approved .banner-icon {
  color: #10b981;
}

.status-rejected .banner-icon {
  color: #ef4444;
}

.banner-text h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #0f172a;
}

.banner-text p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.reject-reason {
  margin-top: 8px !important;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  color: #dc2626;
  font-weight: 500;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left h1 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.header-left p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-primary, .btn-secondary, .btn-cancel, .btn-save {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.btn-secondary {
  background: white;
  color: #0f172a;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.btn-cancel {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-save {
  background: #10b981;
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.btn-save:hover {
  background: #059669;
}

/* Form Container - 复用设计院维护的所有表单样式 */
.form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 32px;
}

.form-section {
  padding-bottom: 32px;
  margin-bottom: 32px;
  border-bottom: 2px solid #f1f5f9;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.section-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: #f1f5f9;
  color: #64748b;
}

.section-badge.required {
  background: #fef3c7;
  color: #92400e;
}

.section-badge.optional {
  background: #dbeafe;
  color: #1e40af;
}

.section-tips {
  font-size: 13px;
  color: #94a3b8;
}

/* 表单网格 */
.info-grid, .form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.info-grid.readonly {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
}

.info-item, .form-item {
  display: flex;
  flex-direction: column;
}

.info-item.full-width, .form-item.full-width {
  grid-column: 1 / -1;
}

.info-item label, .form-item label {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.form-item.required label::after {
  content: ' *';
  color: #ef4444;
}

.info-item p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 表单控件 */
.form-input, .form-select, .form-textarea {
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  transition: all 0.3s;
  font-family: inherit;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-input:disabled, .form-select:disabled, .form-textarea:disabled {
  background: #f8fafc;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 案例卡片 */
.cases-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.case-card {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.case-header h4 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-remove {
  padding: 6px 12px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #fecaca;
}

.case-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.image-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.case-image {
  width: 100%;
  max-width: 400px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.btn-upload {
  padding: 10px 16px;
  border: 2px dashed #cbd5e1;
  background: white;
  color: #0ea5e9;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-upload:hover {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.btn-add-case {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: 2px dashed #cbd5e1;
  background: white;
  color: #0ea5e9;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-case:hover {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.btn-add-case svg {
  width: 20px;
  height: 20px;
}

/* 文件上传 */
.upload-section {
  margin-bottom: 24px;
}

.upload-section:last-child {
  margin-bottom: 0;
}

.upload-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.file-icon {
  width: 24px;
  height: 24px;
  color: #0ea5e9;
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: #0f172a;
}

.btn-remove-file {
  padding: 6px 12px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove-file:hover {
  background: #fecaca;
}

.btn-upload-file {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px dashed #cbd5e1;
  background: white;
  color: #0ea5e9;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-upload-file:hover {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.btn-upload-file svg {
  width: 20px;
  height: 20px;
}

/* 图片网格 */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.photo-item {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  overflow: hidden;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-photo {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove-photo:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.btn-remove-photo svg {
  width: 16px;
  height: 16px;
}

.btn-upload-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 2px dashed #cbd5e1;
  background: white;
  color: #0ea5e9;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-upload-photo:hover {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.btn-upload-photo svg {
  width: 32px;
  height: 32px;
}
</style>

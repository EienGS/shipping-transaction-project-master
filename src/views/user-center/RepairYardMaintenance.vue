<template>
    <div class="repair-yard-maintenance-page">
        <!-- 未注册状态 -->
        <div v-if="!providerInfo.status" class="unregistered-state">
            <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <h2>您还未注册修船厂服务商</h2>
            <p>注册成为修船厂服务商后，您可以接收船舶维修需求并提供专业服务</p>
            <button class="btn-register" @click="startRegistration">注册成为修船厂服务商</button>

            <!-- 模拟跳过审核按钮（仅用于演示） -->
            <button class="btn-skip-review" @click="skipToApproved">模拟跳过审核（测试用）</button>
        </div>

        <!-- 已注册状态 -->
        <template v-else>
            <!-- Status Banner（仅在已提交审核后显示） -->
            <div v-if="providerInfo.status !== 'registering'" class="status-banner"
                :class="`status-${providerInfo.status}`">
                <div class="banner-content">
                    <svg v-if="providerInfo.status === 'pending'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" class="banner-icon">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="providerInfo.status === 'approved'" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" class="banner-icon">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="providerInfo.status === 'rejected'" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" class="banner-icon">
                        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    <h1>修船厂信息维护</h1>
                    <p>完善并管理您的修船厂对外展示信息</p>
                </div>
                <div class="header-actions">
                    <button v-if="providerInfo.status === 'approved' && !isEditing" class="btn-secondary"
                        @click="togglePublish">
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
                    <!-- 公司简介 -->
                    <section class="form-section">
                        <div class="section-header">
                            <h2>公司简介</h2>
                            <span class="section-badge required">必填</span>
                        </div>
                        <div class="form-item full-width required">
                            <textarea v-model="formData.companyIntro" :disabled="!isEditing" class="form-textarea"
                                placeholder="请简要介绍公司的历史、规模、主营业务等信息（300字以内）" rows="5" maxlength="300"></textarea>
                            <div class="char-count">{{ formData.companyIntro?.length || 0 }}/300</div>
                        </div>
                    </section>

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
                                <label>核心维修能力</label>
                                <textarea v-model="formData.coreRepairCapability" :disabled="!isEditing" class="form-textarea"
                                    placeholder="请描述您的核心维修能力，如：主机维修、轴系维修、船体修补、电气系统维修等" rows="3"></textarea>
                            </div>

                            <div class="form-item required">
                                <label>所在城市</label>
                                <input v-model="formData.city" :disabled="!isEditing" type="text" class="form-input"
                                    placeholder="如：上海市" />
                            </div>

                            <div class="form-item required">
                                <label>注册资本</label>
                                <input v-model="formData.registeredCapital" :disabled="!isEditing" type="text"
                                    class="form-input" placeholder="如：5000万元" />
                            </div>

                            <div class="form-item required">
                                <label>生产资质</label>
                                <input v-model="formData.qualification" :disabled="!isEditing" type="text"
                                    class="form-input" placeholder="如：CCS认证、ISO9001认证" />
                            </div>

                            <div class="form-item required">
                                <label>上门覆盖范围</label>
                                <input v-model="formData.serviceRadius" :disabled="!isEditing" type="number"
                                    class="form-input" placeholder="如：500" />
                                <span class="input-suffix">km</span>
                            </div>

                            <div class="form-item required full-width">
                                <label>维修范围说明</label>
                                <textarea v-model="formData.repairScope" :disabled="!isEditing" class="form-textarea"
                                    placeholder="请详细说明可维修的船舶类型、系统设备等，如：散货船、油船、集装箱船的主机、辅机、舵系等" rows="3"></textarea>
                            </div>

                            <div class="form-item required">
                                <label>联系人</label>
                                <input v-model="formData.contactPerson" :disabled="!isEditing" type="text"
                                    class="form-input" placeholder="请输入联系人姓名" />
                            </div>

                            <div class="form-item required">
                                <label>联系电话</label>
                                <input v-model="formData.contactPhone" :disabled="!isEditing" type="tel"
                                    class="form-input" placeholder="请输入手机号" />
                            </div>

                            <div class="form-item required">
                                <label>官方邮箱</label>
                                <input v-model="formData.email" :disabled="!isEditing" type="email" class="form-input"
                                    placeholder="请输入企业邮箱" />
                            </div>

                            <div class="form-item required">
                                <label>成立年份</label>
                                <input v-model="formData.foundedYear" :disabled="!isEditing" type="number"
                                    class="form-input" placeholder="如：1998" min="1900" max="2026" />
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
                                <label>维修报价说明</label>
                                <textarea v-model="formData.priceInfo" :disabled="!isEditing" class="form-textarea"
                                    placeholder="如：主机大修10-50万元，船体修补按工时计费，紧急维修加收30%服务费" rows="2"></textarea>
                            </div>

                            <div class="form-item full-width">
                                <label>配件供应能力说明</label>
                                <textarea v-model="formData.partsSupply" :disabled="!isEditing" class="form-textarea"
                                    placeholder="如：常备常用配件库存，特殊配件可在48小时内调配到位" rows="2"></textarea>
                            </div>

                            <div class="form-item full-width">
                                <label>维修服务流程说明</label>
                                <textarea v-model="formData.serviceProcess" :disabled="!isEditing" class="form-textarea"
                                    placeholder="如：1. 接单评估 2. 报价确认 3. 进场维修 4. 质量检验 5. 交付验收" rows="2"></textarea>
                            </div>

                            <div class="form-item full-width">
                                <label>服务范围</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-item">
                                        <input type="checkbox" v-model="formData.serviceTypes" value="定期维保"
                                            :disabled="!isEditing" />
                                        <span>定期维保</span>
                                    </label>
                                    <label class="checkbox-item">
                                        <input type="checkbox" v-model="formData.serviceTypes" value="紧急维修"
                                            :disabled="!isEditing" />
                                        <span>紧急维修</span>
                                    </label>
                                    <label class="checkbox-item">
                                        <input type="checkbox" v-model="formData.serviceTypes" value="改装升级"
                                            :disabled="!isEditing" />
                                        <span>改装升级</span>
                                    </label>
                                    <label class="checkbox-item">
                                        <input type="checkbox" v-model="formData.serviceTypes" value="检验认证"
                                            :disabled="!isEditing" />
                                        <span>检验认证</span>
                                    </label>
                                </div>
                            </div>

                            <!-- 核心能力编辑区 -->
                            <div class="form-item full-width">
                                <label>核心能力</label>
                                <div class="core-capabilities-list">
                                    <div v-for="(capability, index) in formData.coreCapabilities" :key="index"
                                        class="capability-item">
                                        <div class="capability-form">
                                            <div class="form-item">
                                                <label>标题（20字以内）</label>
                                                <input v-model="capability.title" :disabled="!isEditing" type="text"
                                                    class="form-input" placeholder="如：主机大修" maxlength="20" />
                                                <div class="char-count">{{ capability.title?.length || 0 }}/20</div>
                                            </div>
                                            <div class="form-item">
                                                <label>描述（50字以内）</label>
                                                <textarea v-model="capability.description" :disabled="!isEditing"
                                                    class="form-textarea" placeholder="简要描述该能力" rows="2"
                                                    maxlength="50"></textarea>
                                                <div class="char-count">{{ capability.description?.length || 0 }}/50
                                                </div>
                                            </div>
                                            <button v-if="isEditing" type="button" class="btn-remove-capability"
                                                @click="removeCapability(index)">删除</button>
                                        </div>
                                    </div>
                                    <button v-if="isEditing" type="button" class="btn-add-capability"
                                        @click="addCapability">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                        添加核心能力
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- 成功案例 -->
                    <section class="form-section">
                        <div class="section-header">
                            <h2>成功案例</h2>
                            <span class="section-tips">最多上传3个案例</span>
                        </div>

                        <div class="cases-list">
                            <div v-for="(caseItem, index) in formData.cases" :key="index" class="case-card">
                                <div class="case-header">
                                    <h4>案例 {{ index + 1 }}</h4>
                                    <button v-if="isEditing" type="button" class="btn-remove"
                                        @click="removeCase(index)">删除</button>
                                </div>
                                <div class="case-form">
                                    <div class="form-item required">
                                        <label>案例名称</label>
                                        <input v-model="caseItem.name" :disabled="!isEditing" type="text"
                                            class="form-input" placeholder="如：某轮主机大修" />
                                    </div>
                                    <div class="form-item required">
                                        <label>完成时间</label>
                                        <input v-model="caseItem.completedTime" :disabled="!isEditing" type="date"
                                            class="form-input" />
                                    </div>
                                    <div class="form-item full-width required">
                                        <label>案例描述</label>
                                        <textarea v-model="caseItem.description" :disabled="!isEditing"
                                            class="form-textarea" placeholder="请描述该维修案例的亮点和技术特点（300字内）"
                                            rows="3"></textarea>
                                    </div>
                                    <div class="form-item full-width">
                                        <label>案例图片</label>
                                        <div class="image-upload">
                                            <img v-if="caseItem.image" :src="caseItem.image" alt="案例图片"
                                                class="case-image" />
                                            <button v-if="isEditing" type="button" class="btn-upload"
                                                @click="uploadCaseImage(index)">
                                                {{ caseItem.image ? '更换图片' : '上传图片' }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button v-if="isEditing && formData.cases.length < 3" type="button" class="btn-add-case"
                                @click="addCase">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 5v14M5 12h14" />
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
                            <h4>资质证书（最多8��）</h4>
                            <div class="file-list">
                                <div v-for="(cert, index) in formData.certificates" :key="index" class="file-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        class="file-icon">
                                        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                                        <path d="M13 2v7h7" />
                                    </svg>
                                    <span class="file-name">{{ cert.name }}</span>
                                    <button v-if="isEditing" type="button" class="btn-remove-file"
                                        @click="removeCertificate(index)">删除</button>
                                </div>
                            </div>
                            <button v-if="isEditing && formData.certificates.length < 8" type="button"
                                class="btn-upload-file" @click="uploadCertificate">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                上传证书
                            </button>
                        </div>

                        <div class="upload-section">
                            <h4>现场照片（最多8张）</h4>
                            <div class="photos-grid">
                                <div v-for="(photo, index) in formData.photos" :key="index" class="photo-item">
                                    <img :src="photo.url" alt="现场照片" class="photo-image" />
                                    <button v-if="isEditing" type="button" class="btn-remove-photo"
                                        @click="removePhoto(index)">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button v-if="isEditing && formData.photos.length < 8" type="button"
                                class="btn-upload-photo" @click="uploadPhoto">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                上传照片
                            </button>
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

// 状态文本
const statusTitles = {
    registering: '填报中',
    pending: '审核中',
    approved: '已通过审核',
    rejected: '审核未通过'
}

const statusDescriptions = {
    registering: '请完善信息并提交审核',
    pending: '您的信息正在审核中，预计1-3个工作日内完成',
    approved: '您的信息已通过审核，可以开始接收维修需求',
    rejected: '您的信息未通过审核，请根据驳回原因修改后重新提交'
}

// 供应商信息
const providerInfo = ref({
    status: null, // null | 'registering' | 'pending' | 'approved' | 'rejected'
    isPublished: false,
    companyName: '上海XX船舶修理有限公司',
    creditCode: '91310000MA1234567X',
    registerAddress: '上海市浦东新区临港新城环湖西二路888号',
    rejectReason: ''
})

// 编辑状态
const isEditing = ref(false)

// 表单数据
const formData = reactive({
    companyIntro: '上海船舶修理公司成立于1998年，是一家专业从事船舶维修、改装的综合性修船企业。拥有CCS认证和ISO9001质量体系认证，配备先进的维修设备和经验丰富的技术团队，年维修各类船舶80余艘，服务覆盖长三角及周边海域。',
    coreRepairCapability: '主机维修、辅机维修、船体修补、舵系维修、电气系统维修、管路系统维修',
    city: '上海市',
    registeredCapital: '5000万元',
    qualification: 'CCS认证、ISO9001认证',
    serviceRadius: 500,
    repairScope: '散货船、油船、集装箱船、化学品船的主机、辅机、舵系、锚系、泵浦系统、管路系统、电气系统等维修保养',
    contactPerson: '李经理',
    contactPhone: '13800138000',
    email: 'contact@shrepair.com',
    foundedYear: 1998,
    priceInfo: '主机大修10-50万元，船体修补按工时计费（800元/工时），紧急维修加收30%服务费',
    partsSupply: '常备主机、辅机、泵浦等常用配件库存，特殊配件可在48小时内从厂家调配到位',
    serviceProcess: '1. 接单评估（2小时内响应） 2. 现场勘查报价 3. 签约进场维修 4. 质量检验测试 5. 交付验收',
    serviceTypes: ['定期维保', '紧急维修'],
    coreCapabilities: [
        { title: '主机大修', description: '精通各类品牌主机大修，拥有20年经验，成功完成500+案例' },
        { title: '应急抢修', description: '24小时待命，2小时内出发，平均8小时完成应急抢修' }
    ],
    cases: [],
    certificates: [],
    photos: []
})

// 开始注册
const startRegistration = () => {
    console.log('[v0] 开始注册修船厂服务商')
    providerInfo.value.status = 'registering'
    isEditing.value = true
}

// 模拟跳过审核（测试用）
const skipToApproved = () => {
    console.log('[v0] 模拟跳过审核')
    providerInfo.value.status = 'approved'
    providerInfo.value.isPublished = true
}

// 开始编辑
const startEdit = () => {
    console.log('[v0] 开始编辑')
    isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
    console.log('[v0] 取消编辑')
    isEditing.value = false
}

// 保存信息
const saveInfo = () => {
    console.log('[v0] 保存修船厂信息:', formData)
    isEditing.value = false
    if (providerInfo.value.status === 'registering') {
        providerInfo.value.status = 'pending'
    }
    // 提交审核逻辑
    console.log('[v0] 已提交审核')
}

// 切换发布状态
const togglePublish = () => {
    providerInfo.value.isPublished = !providerInfo.value.isPublished
    console.log('[v0] 发布状态已切换:', providerInfo.value.isPublished)
}

// 核心能力管理
const addCapability = () => {
    formData.coreCapabilities.push({
        title: '',
        description: ''
    })
}

const removeCapability = (index) => {
    formData.coreCapabilities.splice(index, 1)
}

// 案例管理
const addCase = () => {
    formData.cases.push({
        name: '',
        completedTime: '',
        description: '',
        image: ''
    })
}

const removeCase = (index) => {
    formData.cases.splice(index, 1)
}

const uploadCaseImage = (index) => {
    console.log('[v0] 上传案例图片', index)
    // 模拟上传
    formData.cases[index].image = 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=400&h=300&fit=crop'
}

// 证书管理
const uploadCertificate = () => {
    console.log('[v0] 上传证书')
    formData.certificates.push({
        name: '资质证书.pdf',
        url: '/certificates/cert.pdf'
    })
}

const removeCertificate = (index) => {
    formData.certificates.splice(index, 1)
}

// 照片管理
const uploadPhoto = () => {
    console.log('[v0] 上传照片')
    formData.photos.push({
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'
    })
}

const removePhoto = (index) => {
    formData.photos.splice(index, 1)
}
</script>

<style scoped>
/* 页面容器 */
.repair-yard-maintenance-page {
    min-height: 100vh;
    background: #F8FAFC;
    padding: 24px;
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
  border: none;
  background: #f59e0b;
  color: white;
  transition: all 0.3s;
}

.btn-skip-review:hover {
  background: #d97706;
}

/* Status Banner */
.status-banner {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.status-pending {
    border-left: 4px solid #F59E0B;
}

.status-approved {
    border-left: 4px solid #10B981;
}

.status-rejected {
    border-left: 4px solid #EF4444;
}

.banner-content {
    display: flex;
    gap: 16px;
    align-items: flex-start;
}

.banner-icon {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
}

.status-pending .banner-icon {
    color: #F59E0B;
}

.status-approved .banner-icon {
    color: #10B981;
}

.status-rejected .banner-icon {
    color: #EF4444;
}

.banner-text h3 {
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 8px 0;
}

.banner-text p {
    font-size: 14px;
    color: #64748B;
    margin: 0;
}

.reject-reason {
    margin-top: 8px !important;
    color: #EF4444 !important;
    font-weight: 500;
}

/* Page Header */
.page-header {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-left h1 {
    font-size: 24px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 8px 0;
}

.header-left p {
    font-size: 14px;
    color: #64748B;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.btn-primary,
.btn-secondary,
.btn-cancel,
.btn-save {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
}

.btn-primary {
    background: #0EA5E9;
    color: white;
}

.btn-primary:hover {
    background: #0284C7;
}

.btn-secondary {
    background: white;
    color: #0EA5E9;
    border: 1px solid #0EA5E9;
}

.btn-secondary:hover {
    background: #F0F9FF;
}

.btn-cancel {
    background: white;
    color: #64748B;
    border: 1px solid #E2E8F0;
}

.btn-cancel:hover {
    background: #F8FAFC;
}

.btn-save {
    background: #10B981;
    color: white;
}

.btn-save:hover {
    background: #059669;
}

/* Form Container */
.form-container {
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.form-section {
    margin-bottom: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid #E2E8F0;
}

.form-section:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.section-header h2 {
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
    margin: 0;
}

.section-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.section-badge.required {
    background: #FEE2E2;
    color: #DC2626;
}

.section-badge.optional {
    background: #DBEAFE;
    color: #2563EB;
}

.section-badge:not(.required):not(.optional) {
    background: #F1F5F9;
    color: #64748B;
}

.section-tips {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    background: #FEF3C7;
    color: #92400E;
}

/* Info Grid (Readonly) */
.info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item.full-width {
    grid-column: span 2;
}

.info-item label {
    font-size: 13px;
    font-weight: 600;
    color: #64748B;
}

.info-item p {
    font-size: 15px;
    color: #0F172A;
    margin: 0;
    font-weight: 500;
}

/* Form Grid */
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
}

.form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
}

.form-item.full-width {
    grid-column: span 2;
}

.form-item label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
}

.form-item.required label::after {
    content: '*';
    color: #EF4444;
    margin-left: 4px;
}

.form-input,
.form-select,
.form-textarea {
    padding: 10px 14px;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    color: #0F172A;
    transition: all 0.3s;
    font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    outline: none;
    border-color: #0EA5E9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-input:disabled,
.form-select:disabled,
.form-textarea:disabled {
    background: #F8FAFC;
    cursor: not-allowed;
    color: #94A3B8;
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.input-suffix {
    position: absolute;
    right: 14px;
    bottom: 11px;
    font-size: 14px;
    color: #64748B;
    font-weight: 500;
}

/* 字符计数 */
.char-count {
    font-size: 12px;
    color: #94a3b8;
    text-align: right;
    margin-top: 4px;
}

/* 复选框组 */
.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 12px 0;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
}

.checkbox-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.checkbox-item input[type="checkbox"]:disabled {
    cursor: not-allowed;
}

.checkbox-item span {
    font-size: 14px;
    color: #475569;
}

/* 核心能力列表 */
.core-capabilities-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.capability-item {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    background: #f8fafc;
}

.capability-form {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 16px;
    align-items: start;
}

.btn-remove-capability {
    padding: 10px 16px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 28px;
}

.btn-remove-capability:hover {
    background: #dc2626;
}

.btn-add-capability {
    padding: 12px 24px;
    background: white;
    border: 2px dashed #cbd5e1;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-add-capability:hover {
    border-color: #0ea5e9;
    color: #0ea5e9;
    background: #f0f9ff;
}

.btn-add-capability svg {
    width: 20px;
    height: 20px;
}

/* Cases List */
.cases-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.case-card {
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 24px;
    background: #F8FAFC;
}

.case-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.case-header h4 {
    font-size: 16px;
    font-weight: 700;
    color: #0F172A;
    margin: 0;
}

.btn-remove {
    padding: 6px 12px;
    background: #EF4444;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-remove:hover {
    background: #DC2626;
}

.case-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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
    padding: 10px 20px;
    background: #0EA5E9;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    align-self: flex-start;
}

.btn-upload:hover {
    background: #0284C7;
}

.btn-add-case {
    padding: 16px 24px;
    background: white;
    border: 2px dashed #CBD5E1;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #64748B;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-add-case:hover {
    border-color: #0EA5E9;
    color: #0EA5E9;
    background: #F0F9FF;
}

.btn-add-case svg {
    width: 20px;
    height: 20px;
}

/* Upload Section */
.upload-section {
    margin-bottom: 32px;
}

.upload-section:last-child {
    margin-bottom: 0;
}

.upload-section h4 {
    font-size: 15px;
    font-weight: 600;
    color: #0F172A;
    margin: 0 0 16px 0;
}

.file-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.file-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
}

.file-icon {
    width: 24px;
    height: 24px;
    color: #0EA5E9;
    flex-shrink: 0;
}

.file-name {
    flex: 1;
    font-size: 14px;
    color: #0F172A;
    font-weight: 500;
}

.btn-remove-file {
    padding: 6px 12px;
    background: #EF4444;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-remove-file:hover {
    background: #DC2626;
}

.btn-upload-file {
    padding: 10px 20px;
    background: white;
    border: 2px dashed #CBD5E1;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #64748B;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-upload-file:hover {
    border-color: #0EA5E9;
    color: #0EA5E9;
    background: #F0F9FF;
}

.btn-upload-file svg {
    width: 16px;
    height: 16px;
}

/* Photos Grid */
.photos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
}

.photo-item {
    position: relative;
    aspect-ratio: 4/3;
    border-radius: 8px;
    overflow: hidden;
}

.photo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.btn-remove-photo {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 6px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-remove-photo:hover {
    background: rgba(0, 0, 0, 0.8);
}

.btn-remove-photo svg {
    width: 16px;
    height: 16px;
}

.btn-upload-photo {
    padding: 10px 20px;
    background: white;
    border: 2px dashed #CBD5E1;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #64748B;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-upload-photo:hover {
    border-color: #0EA5E9;
    color: #0EA5E9;
    background: #F0F9FF;
}

.btn-upload-photo svg {
    width: 20px;
    height: 20px;
}
</style>

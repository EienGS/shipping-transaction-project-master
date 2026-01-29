<template>
  <div class="demand-detail-page">
    <div class="detail-container">
      <!-- 左侧主要内容 -->
      <div class="main-content">
        <!-- 1. 页面顶部核心信息区 -->
        <section class="header-section">
          <div class="title-row">
            <h1 class="demand-title">{{ demandData.title }}</h1>
            <div class="actions">
              <button class="icon-btn" :class="{ favorited: isFavorited }" @click="toggleFavorite">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.998 16.95 2.998C16.2275 2.998 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.452 9.22248 22.452 8.5C22.452 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" :stroke="isFavorited ? '#1890FF' : 'currentColor'" :fill="isFavorited ? '#1890FF' : 'none'" stroke-width="2"/>
                </svg>
                收藏
              </button>
            </div>
          </div>
          
          <div class="meta-info">
            <span class="demand-code">编号: {{ demandData.code }}</span>
            <span class="lease-type-badge">{{ leaseTypeText }}</span>
            <span class="update-time">{{ demandData.updateTime }}更新</span>
            <span class="view-count">已有{{ demandData.viewCount }}人关注</span>
          </div>

          <div class="content-row">
            <div class="demand-summary">
              <div class="summary-item budget-highlight">
                <span class="summary-label">预算范围:</span>
                <span class="summary-value budget-text">¥{{ demandData.budgetMin }}-{{ demandData.budgetMax }}万{{ budgetUnitText }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">船舶类型:</span>
                <span class="summary-value">{{ demandData.vesselType }}</span>
              </div>
              <div class="summary-item" v-if="demandData.leaseDuration">
                <span class="summary-label">租赁期限:</span>
                <span class="summary-value">{{ demandData.leaseDuration }}</span>
              </div>
              <div class="summary-item" v-if="demandData.dwtRange">
                <span class="summary-label">载重吨范围:</span>
                <span class="summary-value">{{ demandData.dwtRange }}吨</span>
              </div>
              <div class="summary-item" v-if="demandData.dwtRequired">
                <span class="summary-label">载重吨要求:</span>
                <span class="summary-value">{{ demandData.dwtRequired }}吨</span>
              </div>
            </div>
          </div>

          <div class="status-tags">
            <div class="status-tag status-active">
              <svg class="tag-icon" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>正在求租</span>
            </div>
          </div>
        </section>

        <!-- 2. 求租需求详情 -->
        <section class="requirements-section">
          <div class="section-header">
            <h2>求租需求详情</h2>
          </div>
          
          <!-- 期租/光租需求 -->
          <div v-if="demandData.leaseType === 'time' || demandData.leaseType === 'bareboat'" class="requirements-grid">
            <div class="req-item">
              <span class="req-label">船舶类型:</span>
              <span class="req-value">{{ demandData.vesselType }}</span>
            </div>
            <div class="req-item">
              <span class="req-label">载重吨范围:</span>
              <span class="req-value">{{ demandData.dwtRange }}吨</span>
            </div>
            <div class="req-item">
              <span class="req-label">航区要求:</span>
              <span class="req-value">{{ demandData.navigationArea }}</span>
            </div>
            <div class="req-item">
              <span class="req-label">船龄要求:</span>
              <span class="req-value">{{ demandData.ageRequirement }}年以内</span>
            </div>
            <div class="req-item">
              <span class="req-label">交接港口偏好:</span>
              <span class="req-value">{{ demandData.portPreference || '不限' }}</span>
            </div>
            <div class="req-item">
              <span class="req-label">租赁期限:</span>
              <span class="req-value">{{ demandData.leaseDuration }}</span>
            </div>
            <div class="req-item full-width">
              <span class="req-label">预算范围:</span>
              <span class="req-value budget-value">¥{{ demandData.budgetMin }}-{{ demandData.budgetMax }}万元/月</span>
            </div>
          </div>

          <!-- 航次租船需求 -->
          <div v-if="demandData.leaseType === 'voyage'" class="requirements-grid">
            <div class="req-item">
              <span class="req-label">船舶类型:</span>
              <span class="req-value">{{ demandData.vesselType }}</span>
            </div>
            <div class="req-item">
              <span class="req-label">载重吨要求:</span>
              <span class="req-value">{{ demandData.dwtRequired }}吨</span>
            </div>
            <div class="req-item full-width">
              <span class="req-label">航线信息:</span>
              <span class="req-value">{{ demandData.voyageRoute }}</span>
            </div>
            <div class="req-item">
              <span class="req-label">载货类型:</span>
              <span class="req-value">{{ demandData.cargoType }}</span>
            </div>
            <div class="req-item">
              <span class="req-label">航次时间要求:</span>
              <span class="req-value">{{ demandData.voyageTimeline }}</span>
            </div>
            <div class="req-item full-width">
              <span class="req-label">预算范围:</span>
              <span class="req-value budget-value">¥{{ demandData.budgetMin }}-{{ demandData.budgetMax }}万元/航次</span>
            </div>
          </div>
        </section>

        <!-- 3. 补充要求 -->
        <section v-if="demandData.remarks" class="remarks-section">
          <div class="section-header">
            <h2>补充要求</h2>
          </div>
          <div class="remarks-content">
            <p>{{ demandData.remarks }}</p>
          </div>
        </section>

        <!-- 4. 发布信息 -->
        <section class="publish-info-section">
          <div class="section-header">
            <h2>发布信息</h2>
          </div>
          <div class="publish-info-grid">
            <div class="info-item">
              <span class="info-label">发布时间:</span>
              <span class="info-value">{{ demandData.publishTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">有效期至:</span>
              <span class="info-value">{{ demandData.expiryDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">浏览次数:</span>
              <span class="info-value">{{ demandData.viewCount }}次</span>
            </div>
            <div class="info-item">
              <span class="info-label">对接意向:</span>
              <span class="info-value">{{ demandData.intentionCount }}条</span>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧联系卡片 -->
      <div class="sidebar">
        <div class="contact-card">
          <div class="card-header">
            <h3>联系承租方</h3>
          </div>
          <div class="card-body">
            <div class="contact-info-item">
              <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"/>
              </svg>
              <div class="contact-details">
                <span class="label">联系人</span>
                <span class="value">{{ demandData.contactName }}</span>
              </div>
            </div>

            <div class="contact-info-item">
              <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z"/>
              </svg>
              <div class="contact-details">
                <span class="label">联系电话</span>
                <span class="value phone">{{ maskedPhone }}</span>
              </div>
            </div>

            <div class="contact-info-item">
              <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H21M19 21H14M5 21H3M5 21H10M14 21V16C14 15.4477 13.5523 15 13 15H11C10.4477 15 10 15.4477 10 16V21M14 21H10M9 7H10M9 11H10M14 7H15M14 11H15"/>
              </svg>
              <div class="contact-details">
                <span class="label">企业/个人</span>
                <span class="value">{{ demandData.companyName }}</span>
              </div>
            </div>

            <button class="btn-primary-action" @click="handleContact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 19.9997 8.94807 19.6068 7.6 18.86L3 20L4.14 15.4C3.38604 14.0463 2.99542 12.5338 3 11C3 6.58172 7.02944 3 12 3C16.9706 3 21 6.58172 21 12Z"/>
              </svg>
              立即对接
            </button>

            <div class="info-tips">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
              </svg>
              <p>对接后可查看完整联系方式</p>
            </div>
          </div>
        </div>

        <!-- 相似求租推荐 -->
        <div class="related-card">
          <div class="card-header">
            <h3>相似求租推荐</h3>
          </div>
          <div class="card-body">
            <div v-for="item in relatedDemands" :key="item.id" class="related-item" @click="goToDemandDetail(item.id)">
              <div class="related-title">{{ item.title }}</div>
              <div class="related-meta">
                <span class="related-type">{{ item.leaseTypeText }}</span>
                <span class="related-budget">¥{{ item.budgetMin }}-{{ item.budgetMax }}万</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isFavorited = ref(false)

// Mock data
const demandData = ref({
  id: route.params.id,
  code: 'RD-2026010801',
  title: '长期期租5000吨散货船',
  leaseType: 'time', // 'time', 'bareboat', 'voyage'
  vesselType: '散货船',
  dwtRange: '3000-5000',
  navigationArea: '无限航区',
  ageRequirement: '10',
  portPreference: '上海、新加坡',
  leaseDuration: '12-24个月',
  budgetMin: 80,
  budgetMax: 120,
  remarks: '要求船舶配备现代化导航设备，禁止运输危险化学品，付款周期为月结30天。船舶需具备有效的船级社证书，船员配置齐全，能够随时投入运营。',
  contactName: '张某',
  contactPhone: '13900001234',
  companyName: '上海某某货运有限公司',
  publishTime: '2026-01-08 10:30',
  updateTime: '2小时前',
  expiryDate: '2026-04-08',
  viewCount: 156,
  intentionCount: 8
})

const leaseTypeText = computed(() => {
  const types = {
    time: '期租',
    bareboat: '光租',
    voyage: '航次租船'
  }
  return types[demandData.value.leaseType] || '未知类型'
})

const budgetUnitText = computed(() => {
  return demandData.value.leaseType === 'voyage' ? '/航次' : '/月'
})

const maskedPhone = computed(() => {
  const phone = demandData.value.contactPhone
  return phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
})

const relatedDemands = ref([
  { id: 2, title: '急需期租8000吨散货船', leaseTypeText: '期租', budgetMin: 150, budgetMax: 200 },
  { id: 3, title: '光租3000吨油船', leaseTypeText: '光租', budgetMin: 60, budgetMax: 90 },
  { id: 4, title: '航次租船：上海-新加坡', leaseTypeText: '航次租船', budgetMin: 50, budgetMax: 80 }
])

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  console.log('[v0] 收藏状态:', isFavorited.value)
}

const handleContact = () => {
  console.log('[v0] 立即对接求租需求:', demandData.value.id)
  // TODO: 打开对接弹窗或跳转到对接页面
}

const goToDemandDetail = (id) => {
  router.push(`/vessel-leasing/demand/${id}`)
}

onMounted(() => {
  console.log('[v0] 求租详情页加载完成，ID:', route.params.id)
})
</script>

<style scoped>
.demand-detail-page {
  min-height: 100vh;
  background: #F8FAFC;
  padding: 24px;
}

.detail-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

/* Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header Section */
.header-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.demand-title {
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  line-height: 1.3;
}

.actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.icon-btn:hover {
  border-color: #1890FF;
  color: #1890FF;
}

.icon-btn.favorited {
  border-color: #1890FF;
  color: #1890FF;
  background: #EFF6FF;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #64748B;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F1F5F9;
}

.demand-code {
  font-weight: 600;
  color: #0F172A;
}

.lease-type-badge {
  padding: 4px 12px;
  background: #DBEAFE;
  color: #1E40AF;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
}

.content-row {
  margin-bottom: 24px;
}

.demand-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-label {
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}

.summary-value {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
}

.budget-highlight {
  grid-column: span 2;
}

.budget-text {
  font-size: 32px;
  color: #DC2626;
  font-weight: 800;
}

.status-tags {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.status-active {
  background: #DCFCE7;
  color: #166534;
  border: 1.5px solid #BBF7D0;
}

.tag-icon {
  width: 20px;
  height: 20px;
}

/* Requirements Section */
.requirements-section,
.remarks-section,
.publish-info-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #F1F5F9;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 32px;
}

.req-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.req-item.full-width {
  grid-column: span 2;
}

.req-label {
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}

.req-value {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
}

.budget-value {
  color: #DC2626;
  font-size: 18px;
  font-weight: 700;
}

/* Remarks Section */
.remarks-content {
  padding: 20px;
  background: #F8FAFC;
  border-radius: 12px;
  border-left: 4px solid #1890FF;
}

.remarks-content p {
  font-size: 15px;
  line-height: 1.8;
  color: #334155;
  margin: 0;
}

/* Publish Info Section */
.publish-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: #0F172A;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-card,
.related-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #1890FF 0%, #0EA5E9 100%);
  border-bottom: 1px solid #E2E8F0;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.card-body {
  padding: 24px;
}

.contact-info-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #F1F5F9;
}

.contact-info-item:last-of-type {
  border-bottom: none;
  margin-bottom: 24px;
}

.contact-icon {
  width: 24px;
  height: 24px;
  color: #1890FF;
  flex-shrink: 0;
}

.contact-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-details .label {
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}

.contact-details .value {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
}

.contact-details .phone {
  color: #1890FF;
  letter-spacing: 1px;
}

.btn-primary-action {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #1890FF 0%, #0EA5E9 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.btn-primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
}

.btn-primary-action svg {
  width: 20px;
  height: 20px;
}

.info-tips {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 12px;
  background: #FEF3C7;
  border-radius: 8px;
  margin-top: 16px;
}

.info-tips svg {
  width: 18px;
  height: 18px;
  color: #D97706;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-tips p {
  font-size: 13px;
  color: #92400E;
  margin: 0;
  line-height: 1.5;
}

/* Related Items */
.related-item {
  padding: 16px;
  border-radius: 10px;
  background: #F8FAFC;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1.5px solid transparent;
}

.related-item:hover {
  background: #EFF6FF;
  border-color: #1890FF;
  transform: translateX(4px);
}

.related-item:last-child {
  margin-bottom: 0;
}

.related-title {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 8px;
  line-height: 1.4;
}

.related-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
}

.related-type {
  color: #1890FF;
  font-weight: 600;
}

.related-budget {
  color: #DC2626;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 1200px) {
  .detail-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: 2;
  }
}

@media (max-width: 768px) {
  .demand-detail-page {
    padding: 16px;
  }

  .header-section,
  .requirements-section,
  .remarks-section,
  .publish-info-section {
    padding: 20px;
  }

  .demand-title {
    font-size: 22px;
  }

  .requirements-grid,
  .demand-summary,
  .publish-info-grid {
    grid-template-columns: 1fr;
  }

  .budget-highlight {
    grid-column: span 1;
  }

  .req-item.full-width {
    grid-column: span 1;
  }
}
</style>

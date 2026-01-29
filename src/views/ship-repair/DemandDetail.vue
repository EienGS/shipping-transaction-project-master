<template>
  <div class="demand-detail-page">
    <div class="detail-container">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <section class="header-section">
          <div class="title-row">
            <h1 class="demand-title">
              <span class="type-badge" :class="`type-${demand.type}`">{{ demandTypeLabel }}</span>
              {{ demand.title }}
            </h1>
            <div class="actions">
              <button class="icon-btn" :class="{ favorited: isFavorited }" @click="toggleFavorite">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.998 16.95 2.998C16.2275 2.998 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.452 9.22248 22.452 8.5C22.452 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" :stroke="isFavorited ? '#1890FF' : 'currentColor'" :fill="isFavorited ? '#1890FF' : 'none'" stroke-width="2"/>
                </svg>
              </button>
              <button class="icon-btn" @click="handleShare">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="meta-info">
            <span class="meta-item">编号: {{ demand.id }}</span>
            <span class="meta-item">{{ demand.publishDate }}</span>
            <span class="meta-item">浏览 {{ demand.views }}</span>
          </div>

          <div class="budget-row" v-if="demand.budget">
            <span class="budget-label">预算:</span>
            <span class="budget-value">{{ demand.budget }}</span>
          </div>
        </section>

        <!-- Demand Details -->
        <section class="details-section">
          <div class="section-header">
            <h2>需求详情</h2>
            <button class="print-btn" @click="handlePrint">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="2"/>
                <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="2"/>
              </svg>
              打印
            </button>
          </div>

          <div class="params-grid">
            <div v-for="param in displayParams" :key="param.label" class="param-item">
              <span class="param-label">{{ param.label }}</span>
              <span class="param-value">{{ param.value }}</span>
            </div>
          </div>
        </section>

        <!-- Description -->
        <section class="description-section">
          <h2>详细描述</h2>
          <div class="description-content">{{ demand.description }}</div>
        </section>

        <!-- Attachments -->
        <section class="attachments-section" v-if="demand.attachments && demand.attachments.length > 0">
          <h2>附件资料</h2>
          <div class="attachments-list">
            <div v-for="file in demand.attachments" :key="file.name" class="attachment-item">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
              <button class="download-btn" @click="downloadFile(file)">下载</button>
            </div>
          </div>
        </section>

      </div>

      <!-- Sidebar -->
      <aside class="sidebar">
        <!-- Publisher Info -->
        <div class="sidebar-card">
          <h3>发布者信息</h3>
          <div class="publisher-info">
            <div class="publisher-avatar">
              <img :src="demand.publisher.avatar" :alt="demand.publisher.name">
            </div>
            <div class="publisher-details">
              <h4>{{ demand.publisher.name }}</h4>
              <div class="publisher-meta">
                <span class="rating">⭐ {{ demand.publisher.rating }}</span>
                <span class="verified" v-if="demand.publisher.verified">✓ 已认证</span>
              </div>
            </div>
          </div>
          <button class="contact-publisher-btn" @click="contactPublisher">
            意向对接
          </button>
        </div>

        <!-- Demand Stats -->
        <div class="sidebar-card">
          <h3>需求统计</h3>
          <div class="stats-grid">
            <div class="stat-box">
              <span class="stat-value">{{ demand.proposals || 0 }}</span>
              <span class="stat-label">方案数</span>
            </div>
            <div class="stat-box">
              <span class="stat-value">{{ demand.views }}</span>
              <span class="stat-label">浏览量</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const demandId = route.params.id

const isFavorited = ref(false)

// Mock demand data
const demand = ref({
  id: demandId,
  type: 'design',
  title: '82000吨散货船详细设计需求',
  publishDate: '2024-01-15',
  views: 156,
  budget: '面议',
  description: '我司计划建造一艘82000载重吨散货船，现寻求有资质的设计院提供详细设计服务。船舶需满足最新国际海事组织规范，具备良好的节能性能和经济性。希望设计院具有丰富的散货船设计经验，并能提供完整的技术支持服务。',
  params: {
    shipType: '散货船',
    deadweight: '82000吨',
    length: '229米',
    breadth: '32.26米',
    depth: '18.2米',
    draft: '12.5米',
    speed: '14.5节',
    mainEngine: 'MAN B&W 6S50ME-C9.5',
    classification: 'CCS',
    navigationArea: '无限航区',
    buildLocation: '江苏省南通市',
    deliveryDate: '2025年12月',
  },
  attachments: [
    { name: '需求说明书.pdf', size: '2.3MB' },
    { name: '技术规格书.docx', size: '1.5MB' },
  ],
  publisher: {
    name: '上海远洋运输有限公司',
    avatar: 'https://picsum.photos/seed/pub1/80/80',
    rating: 4.7,
    verified: true,
  },
  proposals: 8,
})

const demandTypeLabel = computed(() => {
  const labels = { design: '设计需求', build: '建造需求', repair: '维修需求' }
  return labels[demand.value.type] || '需求'
})

const displayParams = computed(() => {
  return Object.entries(demand.value.params).map(([key, value]) => ({
    label: getParamLabel(key),
    value: value || '未填写',
  }))
})

const getParamLabel = (key) => {
  const labels = {
    shipType: '船舶类型',
    deadweight: '载重吨',
    length: '船长',
    breadth: '型宽',
    depth: '型深',
    draft: '设计吃水',
    speed: '航速',
    mainEngine: '主机型号',
    classification: '船级',
    navigationArea: '航区',
    buildLocation: '建造地点',
    deliveryDate: '交船日期',
  }
  return labels[key] || key
}

const similarDemands = ref([
  { id: '2', type: '设计', title: '50000吨散货船设计', budget: '面议', date: '2024-01-10' },
  { id: '3', type: '设计', title: '集装箱船改装设计', budget: '150万', date: '2024-01-08' },
])

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  console.log('收藏需求:', isFavorited.value)
}

const handleShare = () => {
  console.log('分享需求')
  alert('分享功能开发中')
}

const handlePrint = () => {
  console.log('打印需求详情')
  window.print()
}

const downloadFile = (file) => {
  console.log('下载文件:', file.name)
  alert(`下载 ${file.name}`)
}

const viewDemand = (id) => {
  console.log('查看需求:', id)
  router.push(`/ship-repair/demand/${id}`)
}

const contactPublisher = () => {
  console.log('联系发布者')
  alert('联系发布者功能开发中')
}

const submitProposal = () => {
  console.log('提交方案')
  alert('提交方案功能开发中')
}

const reportDemand = () => {
  console.log('举报需求')
  alert('举报功能开发中')
}
</script>

<style scoped>
.demand-detail-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding: 24px 0;
}

.detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 24px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header Section */
.header-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
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
  color: #1A1A1A;
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.type-badge {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.type-badge.type-design {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: white;
}

.type-badge.type-build {
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
}

.type-badge.type-repair {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: white;
}

.actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #D9D9D9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.icon-btn.favorited {
  border-color: #1890FF;
  color: #1890FF;
}

.icon-btn:hover {
  border-color: #1890FF;
  color: #1890FF;
}

.meta-info {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #8C8C8C;
}

.budget-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.budget-label {
  font-size: 16px;
  color: #595959;
}

.budget-value {
  font-size: 32px;
  font-weight: 700;
  color: #1890FF;
}

/* Details Section */
.details-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1A1A1A;
}

.print-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #F1F5F9;
  border: none;
  border-radius: 6px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.print-btn svg {
  width: 16px;
  height: 16px;
}

.print-btn:hover {
  background: #E2E8F0;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.param-label {
  font-size: 13px;
  color: #8C8C8C;
}

.param-value {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
}

/* Description */
.description-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.description-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 16px;
}

.description-content {
  font-size: 15px;
  line-height: 1.8;
  color: #475569;
}

/* Attachments */
.attachments-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.attachments-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 16px;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 8px;
}

.attachment-item svg {
  width: 24px;
  height: 24px;
  color: #64748B;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: #1A1A1A;
  font-weight: 500;
}

.file-size {
  font-size: 13px;
  color: #94A3B8;
}

.download-btn {
  padding: 6px 16px;
  background: #1890FF;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.download-btn:hover {
  background: #0EA5E9;
}

/* Similar Demands */
.similar-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.similar-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 16px;
}

.similar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.similar-card {
  padding: 16px;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.similar-card:hover {
  border-color: #1890FF;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.similar-type {
  display: inline-block;
  padding: 2px 8px;
  background: #EFF6FF;
  color: #1890FF;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 8px;
}

.similar-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.similar-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #64748B;
}

/* Sidebar */
.sidebar {
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.sidebar-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 16px;
}

/* Publisher Info */
.publisher-info {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.publisher-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.publisher-details {
  flex: 1;
}

.publisher-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 6px;
}

.publisher-meta {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.rating {
  color: #F59E0B;
}

.verified {
  color: #10B981;
}

.contact-publisher-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #1890FF, #0EA5E9);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-publisher-btn svg {
  width: 18px;
  height: 18px;
}

.contact-publisher-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
}

/* Quick Actions */
.actions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn:hover {
  background: #EFF6FF;
  border-color: #1890FF;
  color: #1890FF;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1890FF;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748B;
}
</style>

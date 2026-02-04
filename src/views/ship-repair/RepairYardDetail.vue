<template>
  <div class="provider-detail-page">
    <!-- Header Section -->
    <section class="provider-header">
      <div class="header-content">
        <div class="provider-info">
          <div class="logo-wrapper">
            <img :src="provider.logo" :alt="provider.name" class="provider-logo">
          </div>
          <div class="info-main">
            <h1 class="provider-name">{{ provider.name }}</h1>
            <div class="provider-meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                {{ provider.location }}
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 10h18M8 14h2M8 17h4" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ provider.type }}
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                {{ provider.rating }}分
              </span>
            </div>
            <div class="tags">
              <span v-for="tag in provider.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
        <div class="action-buttons">
          <button class="btn-favorite" :class="{ favorited: isFavorited }" @click="toggleFavorite">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.998 16.95 2.998C16.2275 2.998 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.452 9.22248 22.452 8.5C22.452 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" :stroke="isFavorited ? '#1890FF' : 'currentColor'" :fill="isFavorited ? '#1890FF' : 'none'" stroke-width="2"/>
            </svg>
            {{ isFavorited ? '已收藏' : '收藏' }}
          </button>
          <button class="btn-contact" @click="handleContact">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2"/>
            </svg>
            联系服务方
          </button>
        </div>
      </div>
    </section>

    <div class="detail-container">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Company Introduction -->
        <section class="info-section">
          <h2>公司简介</h2>
          <div class="intro-content">{{ provider.introduction }}</div>
        </section>

        <!-- Core Information (Repair Yard-specific) -->
        <section class="info-section" v-if="provider.coreCapability">
          <h2>核心信息</h2>
          <div class="core-info-grid">
            <div class="info-item">
              <label>核心维修能力</label>
              <p>{{ provider.coreCapability }}</p>
            </div>
            <div class="info-item">
              <label>生产资质</label>
              <p>{{ provider.productionQualification }}</p>
            </div>
            <div class="info-item">
              <label>注册资本</label>
              <p>{{ provider.registeredCapital }}</p>
            </div>
            <div class="info-item">
              <label>维修范围</label>
              <p>{{ provider.repairScope }}</p>
            </div>
            <div class="info-item">
              <label>维修服务报价</label>
              <p>{{ provider.repairPrice }}</p>
            </div>
            <div class="info-item">
              <label>上门覆盖范围</label>
              <p>{{ provider.repairCoverage }}</p>
            </div>
            <div class="info-item">
              <label>配件供应能力</label>
              <p>{{ provider.partSupply }}</p>
            </div>
            <div class="info-item">
              <label>维修服务流程</label>
              <p>{{ provider.repairProcess }}</p>
            </div>
          </div>
        </section>

        <!-- Service Scope -->
        <section class="info-section">
          <h2>服务范围</h2>
          <div class="service-grid">
            <div v-for="service in provider.services" :key="service.name" class="service-card">
              <div class="service-icon">{{ service.icon }}</div>
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
            </div>
          </div>
        </section>

        <!-- Capabilities -->
        <section class="info-section">
          <h2>核心能力</h2>
          <div class="capabilities-list">
            <div v-for="capability in provider.capabilities" :key="capability.title" class="capability-item">
              <div class="capability-header">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <h3>{{ capability.title }}</h3>
              </div>
              <p>{{ capability.description }}</p>
            </div>
          </div>
        </section>

        <!-- Cases -->
        <section class="info-section">
          <h2>成功案例</h2>
          <div class="cases-grid">
            <div v-for="caseItem in provider.cases" :key="caseItem.id" class="case-card">
              <img :src="caseItem.image" :alt="caseItem.title" class="case-image">
              <div class="case-info">
                <h3>{{ caseItem.title }}</h3>
                <p>{{ caseItem.description }}</p>
                <span class="case-date">{{ caseItem.date }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <aside class="sidebar">
        <!-- Contact Info -->
        <div class="sidebar-card">
          <h3>联系方式</h3>
          <div class="contact-list">
            <div class="contact-item">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div>
                <span class="label">联系电话</span>
                <span class="value">{{ provider.phone }}</span>
              </div>
            </div>
            <div class="contact-item">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div>
                <span class="label">电子邮箱</span>
                <span class="value">{{ provider.email }}</span>
              </div>
            </div>
            <div class="contact-item">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div>
                <span class="label">公司地址</span>
                <span class="value">{{ provider.address }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="sidebar-card">
          <h3>服务统计</h3>
          <div class="stats-list">
            <div class="stat-item">
              <span class="stat-value">{{ provider.stats.projects }}</span>
              <span class="stat-label">完成项目</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ provider.stats.clients }}</span>
              <span class="stat-label">服务客户</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ provider.stats.experience }}</span>
              <span class="stat-label">从业年限</span>
            </div>
          </div>
        </div>

        <!-- Certifications -->
        <div class="sidebar-card">
          <h3>资质认证</h3>
          <div class="cert-list">
            <div v-for="cert in provider.certifications" :key="cert" class="cert-item">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#10B981"/>
              </svg>
              <span>{{ cert }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const providerId = route.params.id

const isFavorited = ref(false)

// Mock provider data
const provider = ref({
  name: 'XX船舶修理有限公司',
  logo: 'https://picsum.photos/seed/repairlogo/100/100',
  location: '浙江·舟山',
  type: '修船厂',
  rating: 4.6,
  tags: ['一级资质', '快速响应', '专业团队'],
  introduction: 'XX船舶修理有限公司成立于1995年，是国内专业的大型船舶维修企业。拥有3个干船坞，年维修能力150万吨，为全球众多船东和航运公司提供专业的维修和保养服务。',
  phone: '0580-88888888',
  email: 'contact@shiprepair.com.cn',
  address: '浙江省舟山市普陀区船舶工业园',
  // 修船厂特有信息
  coreCapability: '干船坞维修 | 大型船舶改装 | 海洋工程支持服务',
  city: '浙江·舟山',
  registeredCapital: '3亿元',
  productionQualification: '船舶维修企业一级资质/CCS维修认证/ABS维修认证',
  repairScope: '全类型船舶维修、改装、现代化改造、设备更换',
  repairPrice: '咨询获取',
  repairCoverage: '500公里内',
  partSupply: '与国际主流配件供应商合作',
  repairProcess: '咨询→报价→维修计划→维修执行→质量检验→交付',
  otherInfo: '拥有先进的干船坞设备、起重机等，配备专业的维修技术团队，可进行24小时应急维修。',
  services: [
    { icon: '🔧', name: '定期维保', description: '船舶定期维修和保养服务' },
    { icon: '⚙️', name: '紧急维修', description: '24小时应急维修响应' },
    { icon: '🏭', name: '改装升级', description: '船舶改装和现代化改造' },
    { icon: '📋', name: '检验认证', description: '船级社检验和认证支持' },
  ],
  capabilities: [
    { title: '干船坞维修', description: '3个干船坞，可容纳最大15万吨级船舶，维修能力业界领先' },
    { title: '大型改装', description: '主机更换、船舶拉长、舾装升级等复杂改装项目' },
    { title: '应急维修', description: '24小时应急维修团队，快速响应全球船舶求助' },
  ],
  cases: [
    { id: 1, title: '82000吨散货船坞检维修', completionTime: '2023-08', description: '完成船体防腐涂装、主机大修、电气系统升级等工作', image: 'https://picsum.photos/seed/repaircase1/400/250' },
    { id: 2, title: '集装箱船主机更换', completionTime: '2023-10', description: '更换MAN主机，优化船舶燃油消耗和排放', image: 'https://picsum.photos/seed/repaircase2/400/250' },
    { id: 3, title: '客轮装修升级', completionTime: '2023-11', description: '完整的舱室装修升级和安全系统现代化改造', image: 'https://picsum.photos/seed/repaircase3/400/250' },
  ],
  promotionImages: [
    'https://picsum.photos/seed/repair-promo1/600/400',
    'https://picsum.photos/seed/repair-promo2/600/400',
    'https://picsum.photos/seed/repair-promo3/600/400',
  ],
  stats: {
    projects: '800+',
    clients: '300+',
    experience: '28年',
  },
  certifications: ['船舶维修一级资质', 'CCS维修认证', 'ABS维修认证', 'DNV维修认证'],
})

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  console.log('[v0] 收藏服务方:', isFavorited.value)
}

const handleContact = () => {
  console.log('[v0] 联系服务方:', providerId)
  alert('联系功能开发中')
}
</script>

<style scoped>
.provider-detail-page {
  min-height: 100vh;
  background: #F5F5F5;
}

/* Header Section */
.provider-header {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  padding: 32px 0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.provider-info {
  display: flex;
  gap: 24px;
}

.logo-wrapper {
  flex-shrink: 0;
}

.provider-logo {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #E5E7EB;
}

.info-main {
  flex: 1;
}

.provider-name {
  font-size: 28px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 12px;
}

.provider-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748B;
}

.meta-item svg {
  width: 18px;
  height: 18px;
  color: #94A3B8;
}

.tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background: #EFF6FF;
  color: #1890FF;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-favorite,
.btn-contact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-favorite {
  background: white;
  border: 1.5px solid #E5E7EB;
  color: #475569;
}

.btn-favorite:hover {
  border-color: #1890FF;
  color: #1890FF;
}

.btn-favorite.favorited {
  border-color: #1890FF;
  color: #1890FF;
  background: #EFF6FF;
}

.btn-favorite svg,
.btn-contact svg {
  width: 18px;
  height: 18px;
}

.btn-contact {
  background: linear-gradient(135deg, #1890FF, #0EA5E9);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.btn-contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
}

/* Detail Container */
.detail-container {
  max-width: 1400px;
  margin: 24px auto;
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

/* Info Sections */
.info-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.info-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 20px;
}

.intro-content {
  line-height: 1.8;
  color: #475569;
  font-size: 15px;
}

/* Core Info Grid */
.core-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
  border-left: 3px solid #1890FF;
}

.info-item label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  font-size: 14px;
  color: #1A1A1A;
  line-height: 1.6;
}

/* Service Grid */
.service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.service-card {
  padding: 20px;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  transition: all 0.3s;
}

.service-card:hover {
  border-color: #1890FF;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.service-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.service-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.service-card p {
  font-size: 13px;
  color: #64748B;
}

/* Capabilities */
.capabilities-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.capability-item {
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
}

.capability-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.capability-header svg {
  width: 20px;
  height: 20px;
  color: #10B981;
}

.capability-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
}

.capability-item p {
  font-size: 14px;
  color: #64748B;
  margin-left: 30px;
}

/* Cases */
.cases-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.case-card {
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
}

.case-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.case-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.case-info {
  padding: 16px;
}

.case-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.case-info p {
  font-size: 13px;
  color: #64748B;
  margin-bottom: 12px;
}

.case-date {
  font-size: 12px;
  color: #94A3B8;
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

/* Contact Info */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  gap: 12px;
}

.contact-item svg {
  width: 20px;
  height: 20px;
  color: #1890FF;
  flex-shrink: 0;
  margin-top: 2px;
}

.contact-item > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-item .label {
  font-size: 12px;
  color: #94A3B8;
}

.contact-item .value {
  font-size: 14px;
  color: #1A1A1A;
  font-weight: 500;
}

/* Stats */
.stats-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
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

/* Certifications */
.cert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #475569;
}

.cert-item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>

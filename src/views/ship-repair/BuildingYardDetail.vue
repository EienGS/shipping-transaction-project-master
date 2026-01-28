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

        <!-- Core Information (Building Yard-specific) -->
        <section class="info-section" v-if="provider.coreCapability">
          <h2>核心信息</h2>
          <div class="core-info-grid">
            <div class="info-item">
              <label>核心建造能力</label>
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
              <label>船台数量</label>
              <p>{{ provider.shipyardCount }}</p>
            </div>
            <div class="info-item">
              <label>船坞数量</label>
              <p>{{ provider.dockCount }}</p>
            </div>
            <div class="info-item">
              <label>占地面积</label>
              <p>{{ provider.totalArea }}</p>
            </div>
            <div class="info-item">
              <label>建造排期</label>
              <p>{{ provider.buildSchedule }}</p>
            </div>
            <div class="info-item">
              <label>建造服务报价</label>
              <p>{{ provider.buildPrice }}</p>
            </div>
            <div class="info-item">
              <label>付款方式</label>
              <p>{{ provider.buildPayment }}</p>
            </div>
            <div class="info-item">
              <label>配套服务</label>
              <p>{{ provider.auxiliaryServices }}</p>
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
  name: 'XX重工造船有限公司',
  logo: 'https://picsum.photos/seed/buildinglogo/100/100',
  location: '江苏·南通',
  type: '造船厂',
  rating: 4.8,
  tags: ['50年历史', '一流工艺', '国际品质'],
  introduction: 'XX重工造船有限公司成立于1973年，是国内领先的综合性造船企业。拥有4个船台、6个干船坞，年造船能力400万吨，为全球500强企业和国际著名船东服务。',
  phone: '0513-88888888',
  email: 'contact@shipbuilding.com.cn',
  address: '江苏省南通市港口工业园区',
  // 造船厂特有信息
  coreCapability: '最大建造10万吨级散货船/集装箱船/油轮',
  city: '江苏·南通',
  registeredCapital: '20亿元',
  productionQualification: '船舶建造一级资质',
  shipyardCount: '4个',
  dockCount: '6个',
  totalArea: '120万平方米',
  buildSchedule: '散货船60-90天/集装箱船75-120天/油轮90-150天',
  buildPrice: '咨询获取',
  buildPayment: '分期支付：签约30%/铺龙骨30%/进坞30%/交船10%',
  auxiliaryServices: '设计协议/舾装服务/试航培训',
  otherInfo: '拥有最先进的造船设备和ERP系统，通过ISO9001、ISO14001、OHSAS18001认证。',
  services: [
    { icon: '🏗️', name: '新建船舶', description: '大型散货船、集装箱船建造' },
    { icon: '⚙️', name: '精细建造', description: '节能环保船舶建造技术' },
    { icon: '🔧', name: '设计优化', description: '建造工艺协议设计' },
    { icon: '📋', name: '交付服务', description: '完整的验收和交付服务' },
  ],
  capabilities: [
    { title: '散货船建造', description: '10000-100000载重吨散货船专业建造商，技术水平国际先进' },
    { title: '集装箱船建造', description: '2000-16000TEU集装箱船完整建造能力' },
    { title: '特种船舶', description: 'LNG船、化学品船等高端船舶建造' },
  ],
  cases: [
    { id: 1, title: '82000吨散货船建造', completionTime: '2023-06', description: '为国际知名船东建造的新型节能散货船，采用先进动力系统', image: 'https://picsum.photos/seed/buildcase1/400/250' },
    { id: 2, title: '5000TEU集装箱船建造', completionTime: '2023-09', description: '符合IMO 2030标准的环保型集装箱船', image: 'https://picsum.photos/seed/buildcase2/400/250' },
    { id: 3, title: '300000DWT油轮建造', completionTime: '2023-12', description: '超大型原油轮，采用双船体设计和最新防污技术', image: 'https://picsum.photos/seed/buildcase3/400/250' },
  ],
  promotionImages: [
    'https://picsum.photos/seed/building-promo1/600/400',
    'https://picsum.photos/seed/building-promo2/600/400',
    'https://picsum.photos/seed/building-promo3/600/400',
  ],
  stats: {
    projects: '1200+',
    clients: '500+',
    experience: '50年',
  },
  certifications: ['CCS甲级船级社认证', 'ISO9001质量体系', 'ISO14001环保认证', 'DNV建造认证'],
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

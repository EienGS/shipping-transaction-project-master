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

        <!-- Core Information (Design-specific) -->
        <section class="info-section" v-if="provider.coreDirection">
          <h2>核心信息</h2>
          <div class="core-info-grid">
            <div class="info-item">
              <label>核心设计方向</label>
              <p>{{ provider.coreDirection }}</p>
            </div>
            <div class="info-item">
              <label>设计资质</label>
              <p>{{ provider.qualification }}</p>
            </div>
            <div class="info-item">
              <label>注册资本</label>
              <p>{{ provider.registeredCapital }}</p>
            </div>
            <div class="info-item">
              <label>设计团队规模</label>
              <p>{{ provider.teamSize }}</p>
            </div>
            <div class="info-item">
              <label>核心技术人员</label>
              <p>{{ provider.coreStaff }}</p>
            </div>
            <div class="info-item">
              <label>可设计能力</label>
              <p>{{ provider.designCapability }}</p>
            </div>
            <div class="info-item">
              <label>设计服务报价</label>
              <p>{{ provider.designPrice }}</p>
            </div>
            <div class="info-item">
              <label>设计周期</label>
              <p>{{ provider.designCycle }}</p>
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

        <!-- Company Gallery -->
        <section class="info-section">
          <h2>公司实景</h2>
          <div class="gallery-carousel">
            <div class="carousel-container">
              <button 
                class="carousel-btn prev" 
                @click="prevImage"
                :disabled="currentImageIndex === 0"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              
              <div class="carousel-images">
                <div 
                  class="image-wrapper" 
                  v-for="(image, index) in provider.promotionImages" 
                  :key="index"
                  :class="{ active: currentImageIndex === index }"
                >
                  <img :src="image" :alt="`公司实景 ${index + 1}`" class="gallery-image">
                </div>
              </div>

              <button 
                class="carousel-btn next" 
                @click="nextImage"
                :disabled="currentImageIndex === provider.promotionImages.length - 1"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div class="carousel-indicators">
              <button 
                v-for="(image, index) in provider.promotionImages" 
                :key="index"
                class="indicator-dot"
                :class="{ active: currentImageIndex === index }"
                @click="goToImage(index)"
              />
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
const currentImageIndex = ref(0)

// Mock provider data
const provider = ref({
  name: '海洋船舶设计研究院',
  logo: 'https://picsum.photos/seed/designlogo/100/100',
  location: '江苏·无锡',
  type: '设计院',
  rating: 4.8,
  tags: ['甲级资质', '全球领先', '创新设计'],
  introduction: '海洋船舶设计研究院成立于2008年，是国内领先的船舶设计企业。拥有超过500个设计项目经验，服务客户遍布全球。我们致力于为船东提供前沿的船舶设计解决方案。',
  phone: '021-58888888',
  email: 'contact@shipdesign.com.cn',
  address: '上海市浦东新区锦绣路2600号',
  // 设计院特有信息
  coreDirection: '新建船设计/改装船设计/节能环保设计',
  city: '江苏·无锡',
  registeredCapital: '5000万元',
  qualification: '甲级',
  teamSize: '150人',
  coreStaff: '高级工程师32人/注册船舶设计师18人',
  designCapability: '散货船(5000-180000DWT)/油船(1000-300000DWT)/集装箱船(500-10000TEU)/特种船舶',
  designPrice: '咨询获取',
  designCycle: '根据船舶类型与吨位，周期为3-12个月',
  otherInfo: '拥有先进的CAD、CFD设计工具，与国际顶级船级社有深度合作。',
  services: [
    { icon: '🚢', name: '新建船设计', description: '提供船舶概念设计方案' },
    { icon: '📐', name: '详细设计', description: '完整的船舶详细设计图纸' },
    { icon: '⚙️', name: '技术咨询', description: '专业的船舶技术咨询服务' },
    { icon: '🔧', name: '改装设计', description: '船舶改装与升级设计' },
  ],
  capabilities: [
    { title: '散货船设计', description: '精通5000-180000载重吨散货船设计，符合最新国际规范' },
    { title: '油船设计', description: '具备各类油船、化学品船的设计经验和资质' },
    { title: '集装箱船设计', description: '500-10000TEU集装箱船的全套设计能力' },
  ],
  cases: [
    { id: 1, title: '82000吨散货船设计项目', completionTime: '2023-06', description: '为大型船东设计的新型节能散货船', image: 'https://picsum.photos/seed/case1/400/250' },
    { id: 2, title: '5000TEU集装箱船改装', completionTime: '2023-03', description: '集装箱船节能改装设计方案', image: 'https://picsum.photos/seed/case2/400/250' },
    { id: 3, title: '新型环保型化学品船', completionTime: '2023-09', description: '符合IMO 2030标准的化学品船设计', image: 'https://picsum.photos/seed/case3/400/250' },
  ],
  promotionImages: [
    'https://picsum.photos/seed/design-promo1/600/400',
    'https://picsum.photos/seed/design-promo2/600/400',
    'https://picsum.photos/seed/design-promo3/600/400',
  ],
  stats: {
    projects: '500+',
    clients: '200+',
    experience: '30年',
  },
  certifications: ['CCS船级社认证', 'ISO9001质量体系', 'ABS设计资质', 'DNV认证资质'],
})

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  console.log('[v0] 收藏服务方:', isFavorited.value)
}

const handleContact = () => {
  console.log('[v0] 联系服务方:', providerId)
  alert('联系功能开发中')
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < provider.value.promotionImages.length - 1) {
    currentImageIndex.value++
  }
}

const goToImage = (index) => {
  currentImageIndex.value = index
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

/* Gallery Carousel */
.gallery-carousel {
  position: relative;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: #F8FAFC;
  border-radius: 12px;
  overflow: hidden;
}

.carousel-images {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  pointer-events: none;
}

.image-wrapper.active {
  opacity: 1;
  pointer-events: auto;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.carousel-btn:hover:not(:disabled) {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.carousel-btn.prev {
  left: 16px;
}

.carousel-btn.next {
  right: 16px;
}

.carousel-btn svg {
  width: 24px;
  height: 24px;
  color: #1A1A1A;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #D1D5DB;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.indicator-dot:hover {
  background: #9CA3AF;
  transform: scale(1.2);
}

.indicator-dot.active {
  width: 24px;
  border-radius: 4px;
  background: #1890FF;
}
</style>

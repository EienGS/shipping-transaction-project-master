<template>
  <div class="demand-detail-page">
    <div class="detail-container">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <section class="header-section">
          <div class="title-row">
            <h1 class="demand-title">
              <span class="type-badge">设计需求</span>
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
            <div class="param-item">
              <span class="param-label">船舶类型</span>
              <span class="param-value">{{ demand.shipType }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">设计吨位（DWT）</span>
              <span class="param-value">{{ demand.designTonnage }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">航区要求</span>
              <span class="param-value">{{ demand.navigationArea }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">需求所在地</span>
              <span class="param-value">{{ demand.location || '未填写' }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">预算范围</span>
              <span class="param-value">{{ demand.budgetRange }}</span>
            </div>
          </div>
        </section>

        <!-- Reference Vessel -->
        <section v-if="demand.referenceVessel" class="reference-section">
          <h2>设计参考</h2>
          <div class="reference-vessel-card">
            <div class="reference-image">
              <img :src="demand.referenceVessel.image" :alt="demand.referenceVessel.name">
            </div>
            <div class="reference-info">
              <h3>{{ demand.referenceVessel.name }}</h3>
              <div class="reference-specs">
                <span class="spec-tag">{{ demand.referenceVessel.tonnage.toLocaleString() }} DWT</span>
                <span v-if="demand.referenceVessel.length" class="spec-tag">总长 {{ demand.referenceVessel.length }}m</span>
                <span v-if="demand.referenceVessel.width" class="spec-tag">型宽 {{ demand.referenceVessel.width }}m</span>
                <span v-if="demand.referenceVessel.depth" class="spec-tag">型深 {{ demand.referenceVessel.depth }}m</span>
              </div>
              <p class="reference-description">{{ demand.referenceVessel.description }}</p>
            </div>
          </div>
        </section>

        <!-- Description -->
        <section class="description-section">
          <h2>补充说明</h2>
          <div class="description-content">{{ demand.description }}</div>
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
          
          <!-- 联系信息 -->
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-label">联系人：</span>
              <span class="contact-value">{{ demand.isContacted ? demand.publisher.contact : demand.publisher.contactMasked }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">联系电话：</span>
              <span class="contact-value">{{ demand.isContacted ? demand.publisher.phone : demand.publisher.phoneMasked }}</span>
            </div>
          </div>
          
          <button class="contact-publisher-btn" :class="{ 'contacted': demand.isContacted }" @click="contactPublisher">
            {{ demand.isContacted ? '已对接' : '意向对接' }}
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const demandId = route.params.id

const isFavorited = ref(false)

// 设计需求数据
const getDesignDemand = (id) => {
  const demands = {
    '1': {
      id: '1',
      title: '5000DWT散货船设计需求',
      publishDate: '2024-01-15',
      views: 156,
      budget: '200-300万元',
      description: '我司计划建造一艘5000载重吨散货船，现寻求有资质的设计院提供详细设计服务。船舶需满足最新国际海事组织规范，具备良好的节能性能和经济性。希望设计院具有丰富的散货船设计经验，并能提供完整的技术支持服务。',
      shipType: '散货船',
      designTonnage: '5000',
      navigationArea: '无限航区',
      location: '上海',
      budgetRange: '200-300万元',
      referenceVessel: {
        id: 'bulk-carrier-3900',
        name: '80米LNG ECO自卸式散货船',
        tonnage: 3900,
        image: '/images/vessels/bulk-carrier-3900.png',
        length: 79.5,
        width: 16.5,
        depth: 7.1,
        description: '该船总长79.5m, 型宽16.5m, 型深7.1m, 载重量（设计吃水）3900吨，满足极地Polar C要求，是一艘单机单浆混合动力推进的散杂货船。',
      },
      publisher: {
        name: '上海远洋运输有限公司',
        avatar: 'https://picsum.photos/seed/pub1/80/80',
        rating: 4.7,
        verified: true,
        contact: '张经理',
        phone: '138****8888',
        contactMasked: '张**',
        phoneMasked: '138****8888',
      },
      isContacted: false,
    },
    '2': {
      id: '2',
      title: '5000DWT油船设计需求',
      publishDate: '2024-01-20',
      views: 203,
      budget: '200-300万元',
      description: '我司计划建造一艘5000载重吨绿色节能油船，现寻求有资质的设计院提供详细设计服务。船舶需满足最新国际海事组织规范和环保要求，具备良好的节能性能。',
      shipType: '油船',
      designTonnage: '5000',
      navigationArea: '无限航区',
      location: '大连',
      budgetRange: '200-300万元',
      referenceVessel: {
        id: 'bulk-carrier-3900',
        name: '80米LNG ECO自卸式散货船',
        tonnage: 3900,
        image: '/images/vessels/bulk-carrier-3900.png',
        length: 79.5,
        width: 16.5,
        depth: 7.1,
        description: '该船总长79.5m, 型宽16.5m, 型深7.1m, 载重量（设计吃水）3900吨，满足极地Polar C要求，是一艘单机单浆混合动力推进的散杂货船。',
      },
      publisher: {
        name: '大连海运集团',
        avatar: 'https://picsum.photos/seed/pub2/80/80',
        rating: 4.9,
        verified: true,
        contact: '李总',
        phone: '139****6666',
        contactMasked: '李*',
        phoneMasked: '139****6666',
      },
      isContacted: false,
    },
  }
  
  return demands[id] || demands['1']
}

const demand = ref(getDesignDemand(demandId))

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
}

const handleShare = () => {
  alert('分享功能开发中')
}

const handlePrint = () => {
  window.print()
}

const contactPublisher = () => {
  if (!demand.value.isContacted) {
    if (confirm('确认要与发布者进行意向对接吗？对接成功后将显示完整联系方式。')) {
      demand.value.isContacted = true
      alert('对接成功！现在可以查看完整联系方式')
    }
  } else {
    alert('您已经对接过该需求')
  }
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
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
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

.print-btn:hover {
  background: #E2E8F0;
}

.print-btn svg {
  width: 16px;
  height: 16px;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.param-item {
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
}

.param-label {
  font-size: 13px;
  color: #64748B;
  margin-bottom: 6px;
  display: block;
}

.param-value {
  font-size: 15px;
  color: #1E293B;
  font-weight: 600;
}

/* Reference Vessel Section */
.reference-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.reference-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 16px;
}

.reference-vessel-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #F8FAFC;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
}

.reference-image {
  width: 240px;
  height: 160px;
  flex-shrink: 0;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.reference-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
}

.reference-info {
  flex: 1;
  min-width: 0;
}

.reference-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 12px;
}

.reference-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.spec-tag {
  display: inline-block;
  padding: 4px 10px;
  background: white;
  color: #475569;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid #E5E7EB;
}

.reference-description {
  font-size: 13px;
  color: #64748B;
  line-height: 1.6;
}

/* Description Section */
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

/* Sidebar */
.sidebar {
  width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.sidebar-card h3 {
  font-size: 18px;
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

.publisher-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.publisher-avatar img {
  width: 100%;
  height: 100%;
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
  gap: 12px;
  font-size: 13px;
}

.rating {
  color: #F59E0B;
}

.verified {
  color: #10B981;
}

/* 联系信息 */
.contact-info {
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
  margin-bottom: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-bottom: 8px;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-label {
  color: #64748B;
  font-weight: 500;
  min-width: 70px;
}

.contact-value {
  color: #1E293B;
  font-weight: 600;
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

.contact-publisher-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
}

.contact-publisher-btn.contacted {
  background: #E5E7EB;
  color: #6B7280;
  cursor: default;
}

.contact-publisher-btn.contacted:hover {
  transform: none;
  box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-container {
    flex-direction: column;
  }

  .reference-vessel-card {
    flex-direction: column;
  }

  .reference-image {
    width: 100%;
    height: 200px;
  }
  
  .params-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="demand-detail-page">
    <div class="detail-container">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回
      </button>

      <div class="detail-content">
        <!-- 左侧主内容区 -->
        <div class="main-content">
          <!-- 标题区域 -->
          <div class="header-section">
            <div class="title-row">
              <h1 class="demand-title">{{ demandData.title }}</h1>
              <span class="status-badge" :class="demandData.status">{{ getStatusText(demandData.status) }}</span>
              <span class="urgency-badge" :class="demandData.urgency">{{ getUrgencyText(demandData.urgency) }}</span>
            </div>
            <div class="demand-meta">
              <span class="demand-no">需求编号：{{ demandData.demandNo }}</span>
              <span class="publish-time">发布时间：{{ demandData.publishTime }}</span>
            </div>
          </div>

          <!-- 关联船舶信息 -->
          <div class="info-section">
            <h2 class="section-title">关联船舶信息</h2>
            <div class="vessel-info-card">
              <div class="vessel-header">
                <h3 class="vessel-name">{{ demandData.vessel.name }}</h3>
                <span class="vessel-imo">IMO {{ demandData.vessel.imo }}</span>
              </div>
              <div class="vessel-details">
                <div class="vessel-item">
                  <span class="vessel-label">船舶类型</span>
                  <span class="vessel-value">{{ getShipTypeText(demandData.shipType) }}</span>
                </div>
                <div class="vessel-item">
                  <span class="vessel-label">船龄</span>
                  <span class="vessel-value">{{ demandData.vessel.age }}年</span>
                </div>
                <div class="vessel-item">
                  <span class="vessel-label">当前位置</span>
                  <span class="vessel-value">{{ demandData.vessel.location }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 维修需求信息 -->
          <div class="info-section">
            <h2 class="section-title">维修需求详情</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">维修内容</span>
                <span class="info-value">{{ getRepairTypeText(demandData.repairType) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">维修紧急程度</span>
                <span class="info-value">
                  <span class="urgency-dot" :class="demandData.urgency"></span>
                  {{ getUrgencyText(demandData.urgency) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">维修地点偏好</span>
                <span class="info-value">{{ getRepairLocationText(demandData.repairLocation) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">维修预算范围</span>
                <span class="info-value highlight">¥{{ demandData.budgetMin }}-{{ demandData.budgetMax }}万元</span>
              </div>
              <div class="info-item">
                <span class="info-label">期望对接时间</span>
                <span class="info-value">{{ demandData.expectDate }}</span>
              </div>
            </div>
          </div>

          <!-- 故障/维修部位描述 -->
          <div class="info-section">
            <h2 class="section-title">故障/维修部位</h2>
            <div class="description-box">
              <p>{{ demandData.faultPart }}</p>
            </div>
          </div>

          <!-- 故障照片 -->
          <div class="info-section" v-if="demandData.images && demandData.images.length > 0">
            <h2 class="section-title">故障照片</h2>
            <div class="images-grid">
              <div v-for="(image, index) in demandData.images" :key="index" class="image-item">
                <img :src="image" :alt="'故障照片' + (index + 1)">
              </div>
            </div>
          </div>

          <!-- 补充说明 -->
          <div class="info-section" v-if="demandData.additionalRequirements">
            <h2 class="section-title">补充说明</h2>
            <div class="description-box">
              <p>{{ demandData.additionalRequirements }}</p>
            </div>
          </div>
        </div>

        <!-- 右侧联系卡片 -->
        <div class="sidebar">
          <div class="contact-card">
            <h3 class="card-title">联系方式</h3>
            <div class="contact-info">
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <div class="contact-content">
                  <span class="contact-label">联系人</span>
                  <span class="contact-value">{{ demandData.contact }}</span>
                </div>
              </div>
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div class="contact-content">
                  <span class="contact-label">联系电话</span>
                  <span class="contact-value">{{ demandData.phone }}</span>
                </div>
              </div>
            </div>
            <button class="intention-btn" @click="sendIntention">意向对接</button>
          </div>

          <!-- 发布者信息卡片 -->
          <div class="publisher-card">
            <h3 class="card-title">发布者信息</h3>
            <div class="publisher-info">
              <div class="publisher-item">
                <span class="publisher-label">企业名称</span>
                <span class="publisher-value">{{ demandData.publisherName }}</span>
              </div>
              <div class="publisher-item">
                <span class="publisher-label">发布时间</span>
                <span class="publisher-value">{{ demandData.publishTime }}</span>
              </div>
              <div class="publisher-item">
                <span class="publisher-label">需求状态</span>
                <span class="publisher-value">
                  <span class="status-dot" :class="demandData.status"></span>
                  {{ getStatusText(demandData.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Mock数据
const demandData = ref({
  id: route.params.id,
  demandNo: 'REPAIR-2026010005',
  title: '散货船主机故障维修',
  shipType: 'bulk',
  vessel: {
    name: 'OCEAN STAR',
    imo: '1234567',
    age: 8,
    location: '上海港'
  },
  repairType: 'fault',
  urgency: 'urgent',
  faultPart: '主机第3缸出现异响，功率下降明显。初步判断可能是活塞环磨损或气缸套损伤。需要专业维修团队进行详细检查和维修。船舶目前停靠在上海港，希望尽快安排维修，减少停泊时间和经济损失。',
  repairLocation: 'port',
  budgetMin: 50,
  budgetMax: 100,
  expectDate: '2026-01-20',
  additionalRequirements: '希望维修单位具有MAN B&W主机维修资质和丰富经验，能够提供原厂配件或等效替代品。维修期间需要提供临时动力方案。',
  images: [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=400'
  ],
  contact: '李先生',
  phone: '139****6666',
  publisherName: '某航运有限公司',
  publishTime: '2026-01-16 14:20',
  status: 'active'
})

const getShipTypeText = (type) => {
  const types = {
    bulk: '散货船',
    tanker: '油船',
    container: '集装箱船',
    reefer: '冷藏船'
  }
  return types[type] || type
}

const getRepairTypeText = (type) => {
  const types = {
    routine: '常规保养',
    fault: '故障维修',
    major: '大修',
    emergency: '应急维修'
  }
  return types[type] || type
}

const getUrgencyText = (urgency) => {
  const urgencies = {
    normal: '普通',
    urgent: '紧急',
    express: '加急'
  }
  return urgencies[urgency] || urgency
}

const getRepairLocationText = (location) => {
  const locations = {
    shipyard: '船厂维修',
    onsite: '上门维修',
    port: '港口就近维修'
  }
  return locations[location] || location
}

const getStatusText = (status) => {
  const statuses = {
    pending: '待审核',
    active: '进行中',
    matched: '已对接',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statuses[status] || status
}

const contactPublisher = () => {
  console.log('[v0] 联系发布者')
}

const sendIntention = () => {
  console.log('[v0] 发起意向对接')
}

onMounted(() => {
  console.log('[v0] 维修需求详情页加载，ID:', route.params.id)
})
</script>

<style scoped>
.demand-detail-page {
  min-height: 100vh;
  background: #F8FAFC;
  padding: 24px 0;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 24px;
}

.back-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.main-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-section {
  padding-bottom: 24px;
  border-bottom: 1px solid #E2E8F0;
  margin-bottom: 32px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.demand-title {
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.status-badge,
.urgency-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.pending {
  background: #FEF3C7;
  color: #92400E;
}

.status-badge.active {
  background: #DBEAFE;
  color: #1E40AF;
}

.status-badge.matched {
  background: #D1FAE5;
  color: #065F46;
}

.urgency-badge.normal {
  background: #F1F5F9;
  color: #475569;
}

.urgency-badge.urgent {
  background: #FEE2E2;
  color: #991B1B;
}

.urgency-badge.express {
  background: #FEF2F2;
  color: #7F1D1D;
}

.demand-meta {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #64748B;
}

.info-section {
  margin-bottom: 32px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 16px 0;
}

.vessel-info-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
}

.vessel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E2E8F0;
}

.vessel-name {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
}

.vessel-imo {
  font-size: 13px;
  color: #64748B;
  padding: 4px 8px;
  background: white;
  border-radius: 4px;
}

.vessel-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.vessel-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vessel-label {
  font-size: 12px;
  color: #64748B;
}

.vessel-value {
  font-size: 14px;
  color: #0F172A;
  font-weight: 600;
}

.info-grid {
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
  color: #0F172A;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-value.highlight {
  color: #0EA5E9;
}

.urgency-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.urgency-dot.normal {
  background: #94A3B8;
}

.urgency-dot.urgent {
  background: #EF4444;
}

.urgency-dot.express {
  background: #DC2626;
}

.description-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
}

.description-box p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.image-item {
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  background: #F1F5F9;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-card,
.publisher-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 16px 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.contact-item {
  display: flex;
  gap: 12px;
}

.contact-icon {
  width: 20px;
  height: 20px;
  color: #64748B;
  flex-shrink: 0;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-label {
  font-size: 12px;
  color: #64748B;
}

.contact-value {
  font-size: 14px;
  color: #0F172A;
  font-weight: 600;
}

.contact-btn,
.intention-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-btn {
  background: #0EA5E9;
  color: white;
  margin-bottom: 12px;
}

.contact-btn:hover {
  background: #0284C7;
}

.intention-btn {
  background: white;
  color: #0EA5E9;
  border: 2px solid #0EA5E9;
}

.intention-btn:hover {
  background: #F0F9FF;
}

.publisher-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.publisher-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #F1F5F9;
}

.publisher-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.publisher-label {
  font-size: 13px;
  color: #64748B;
}

.publisher-value {
  font-size: 14px;
  color: #0F172A;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.pending {
  background: #F59E0B;
}

.status-dot.active {
  background: #3B82F6;
}

.status-dot.matched {
  background: #10B981;
}

@media (max-width: 968px) {
  .detail-content {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .vessel-details {
    grid-template-columns: 1fr;
  }
}
</style>

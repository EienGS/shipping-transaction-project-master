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

          <!-- 智能推荐区域 -->
          <div class="recommended-section">
            <h2 class="section-title">智能推荐优质修船厂</h2>
            <div class="recommended-grid">
              <div v-for="shipyard in recommendedShipyards" :key="shipyard.id" class="shipyard-card"
                @click="viewShipyardDetail(shipyard.id)">
                <div class="card-image-wrapper">
                  <img :src="shipyard.cover" :alt="shipyard.name" class="shipyard-cover">
                  <div class="verified-badge" v-if="shipyard.verified">Verified</div>
                </div>
                <div class="shipyard-info-body">
                  <div class="shipyard-main">
                    <h3 class="shipyard-name">{{ shipyard.name }}</h3>
                    <p class="shipyard-capability">{{ shipyard.capability }}</p>
                    <p class="shipyard-established">成立年限：{{ shipyard.established }}</p>
                  </div>
                  <div class="shipyard-meta-row">
                    <span class="meta-location">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd"
                          d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                          clip-rule="evenodd" />
                      </svg>
                      {{ shipyard.location }}
                    </span>
                    <span class="meta-rating">⭐️ {{ shipyard.rating }}分</span>
                  </div>
                  <div class="card-actions">
                    <button class="btn-view-detail-outline" @click.stop="viewShipyardDetail(shipyard.id)">查看详情</button>
                    <button class="btn-icon-favorite" @click.stop="toggleFavorite(shipyard.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
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

// 推荐修船厂数据
const recommendedShipyards = ref([
  {
    id: 10,
    name: 'XX船舶修理有限公司',
    capability: '干船坞修理 | 海洋工程支持',
    established: '成立15年',
    rating: 4.6,
    location: '浙江·舟山',
    cases: 87,
    verified: true,
    cover: 'https://picsum.photos/seed/repair1/400/260'
  },
  {
    id: 11,
    name: '青岛海西湾修船厂',
    capability: '大型船舶维修 | 海洋平台维护',
    established: '成立12年',
    rating: 4.7,
    location: '山东·青岛',
    cases: 105,
    verified: true,
    cover: 'https://picsum.photos/seed/repair2/400/260'
  },
  {
    id: 12,
    name: '广州文冲船厂',
    capability: '液化气船修理 | 客轮翻新',
    established: '成立10年',
    rating: 4.5,
    location: '广东·广州',
    cases: 76,
    verified: true,
    cover: 'https://picsum.photos/seed/repair3/400/260'
  }
])

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

const viewShipyardDetail = (id) => {
  console.log('[v0] 查看修船厂详情:', id)
  router.push(`/ship-repair/repair/${id}`)
}

const toggleFavorite = (id) => {
  console.log('[v0] 收藏修船厂:', id)
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

  .recommended-grid {
    grid-template-columns: 1fr;
  }
}

/* 推荐区域样式 */
.recommended-section {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 2px solid #E2E8F0;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.shipyard-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.shipyard-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
  border-color: #0EA5E9;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #F1F5F9;
}

.shipyard-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.shipyard-card:hover .shipyard-cover {
  transform: scale(1.05);
}

.verified-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(10, 31, 53, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.shipyard-info-body {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.shipyard-main {
  margin-bottom: 12px;
}

.shipyard-name {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shipyard-capability {
  font-size: 13px;
  color: #64748B;
  margin: 0 0 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shipyard-established {
  font-size: 12px;
  color: #94A3B8;
  margin: 0;
}

.shipyard-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E2E8F0;
}

.meta-location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748B;
}

.meta-location svg {
  width: 14px;
  height: 14px;
}

.meta-rating {
  color: #F59E0B;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-view-detail-outline {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #0EA5E9;
  background: white;
  color: #0EA5E9;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view-detail-outline:hover {
  background: #F0F9FF;
  border-color: #0284C7;
}

.btn-icon-favorite {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #E2E8F0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-icon-favorite:hover {
  border-color: #0EA5E9;
  background: #F0F9FF;
}

.btn-icon-favorite svg {
  width: 18px;
  height: 18px;
  color: #0EA5E9;
}
</style>

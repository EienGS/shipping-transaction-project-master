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
            </div>
            <div class="demand-meta">
              <span class="demand-no">需求编号：{{ demandData.demandNo }}</span>
              <span class="publish-time">发布时间：{{ demandData.publishTime }}</span>
            </div>
          </div>

          <!-- 基础信息 -->
          <div class="info-section">
            <h2 class="section-title">基础信息</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">船舶类型</span>
                <span class="info-value">{{ getShipTypeText(demandData.shipType) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">建造吨位</span>
                <span class="info-value">{{ demandData.buildTonnage }} DWT</span>
              </div>
              <div class="info-item">
                <span class="info-label">船体材质要求</span>
                <span class="info-value">{{ getHullMaterialText(demandData.hullMaterial) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">建造交付周期</span>
                <span class="info-value">{{ demandData.buildCycle }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">预算范围</span>
                <span class="info-value highlight">¥{{ demandData.budgetMin }}-{{ demandData.budgetMax }}万元</span>
              </div>
              <div class="info-item">
                <span class="info-label">期望对接时间</span>
                <span class="info-value">{{ demandData.expectDate }}</span>
              </div>
            </div>
          </div>

          <!-- 动力系统配置要求 -->
          <div class="info-section">
            <h2 class="section-title">动力系统配置要求</h2>
            <div class="description-box">
              <p>{{ demandData.powerSystem }}</p>
            </div>
          </div>

          <!-- 补充要求 -->
          <div class="info-section" v-if="demandData.additionalRequirements">
            <h2 class="section-title">补充要求</h2>
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
  demandNo: 'BUILD-2026010001',
  title: '长期建造5000吨散货船',
  shipType: 'bulk',
  buildTonnage: 5000,
  hullMaterial: 'steel',
  powerSystem: '主机：MAN B&W 6S50ME-B9，功率8600kW；辅机：3台柴油发电机组，总功率2400kW；推进系统：单桨单舵，固定螺距桨；操舵系统：液压舵机；应急发电机：1台400kW柴油发电机',
  buildCycle: '12-18个月',
  budgetMin: 3000,
  budgetMax: 5000,
  expectDate: '2026-03-01',
  additionalRequirements: '船舶需符合最新的IMO MARPOL排放标准，配备压载水处理系统和岸电连接系统。希望船厂具有ISO9001质量体系认证和相关船级社认证资质。',
  contact: '张先生',
  phone: '138****8888',
  publisherName: '某远洋运输有限公司',
  publishTime: '2026-01-15 10:30',
  status: 'pending'
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

const getHullMaterialText = (material) => {
  const materials = {
    steel: '钢质',
    aluminum: '铝合金',
    frp: '玻璃钢'
  }
  return materials[material] || material
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
  console.log('[v0] 造船需求详情页加载，ID:', route.params.id)
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
}

.demand-title {
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.status-badge {
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
}

.info-value.highlight {
  color: #0EA5E9;
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
}
</style>

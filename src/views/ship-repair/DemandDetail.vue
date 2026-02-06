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

        <!-- Reference Vessel (仅设计和建造需求显示) -->
        <section v-if="(demand.type === 'design' || demand.type === 'build') && demand.referenceVessel" class="reference-section">
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

        <!-- Attachments (设计需求不显示附件) -->
        <section class="attachments-section" v-if="demand.type !== 'design' && demand.attachments && demand.attachments.length > 0">
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

// 根据URL参数或需求ID模拟不同类型的需求数据
const getDemandData = (id) => {
  // 模拟数据库查询，这里根据ID返回不同类型的需求
  const demands = {
    '1': {
      id: '1',
      type: 'design',
      title: '5000DWT散货船设计需求',
      publishDate: '2024-01-15',
      views: 156,
      budget: '200-300万元',
      description: '我司计划建造一艘5000载重吨散货船，现寻求有资质的设计院提供详细设计服务。船舶需满足最新国际海事组织规范，具备良好的节能性能和经济性。希望设计院具有丰富的散货船设计经验，并能提供完整的技术支持服务。',
      params: {
        shipType: '散货船',
        designTonnage: '5000',
        navigationArea: '无限航区',
        budgetRange: '200-300万元',
      },
      // 设计参考船舶
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
      proposals: 8,
      isContacted: false, // 是否已意向对接
    },
    '2': {
      id: '2',
      type: 'build',
      title: '50000DWT散货船建造需求',
      publishDate: '2024-01-20',
      views: 203,
      budget: '5000-8000万元',
      description: '我司需要建造一艘50000吨散货船，希望寻找有资质的船厂进行合作。船舶需要满足最新的环保标准和安全要求，具备良好的经济性和可靠性。',
      params: {
        shipType: '散货船',
        buildTonnage: '50000',
        powerSystem: '采用MAN B&W低速柴油机，配备SCR脱硝系统和节能装置，满足IMO Tier III排放标准',
        budgetRange: '5000-8000万元',
      },
      // 建造需求也可以有参考船舶
      referenceVessel: {
        id: 'bulk-carrier-49900',
        name: '49900吨散货船',
        tonnage: 49900,
        image: '/images/vessels/bulk-carrier-49900.png',
        length: 199.9,
        width: 32.26,
        depth: 16.5,
        description: '49900吨级散货船为一艘单螺旋桨柴油驱动散货船，总长199.9米，型宽32.26米，型深16.5米，设计吃水10.65米，在静水、深海中的服务航速不小于13节。',
      },
      attachments: [
        { name: '建造需求书.pdf', size: '3.1MB' },
      ],
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
      proposals: 12,
      isContacted: false,
    },
    '3': {
      id: '3',
      type: 'repair',
      title: '5000DWT散货船维修需求',
      publishDate: '2024-01-25',
      views: 89,
      budget: '50-100万元',
      description: '我司旗下散货船OCEAN STAR需要进行常规保养和主机维修，希望寻找专业的修船厂进行维修作业。',
      params: {
        vesselName: 'OCEAN STAR',
        vesselType: '散货船',
        vesselTonnage: '5000',
        repairType: '常规保养',
        urgency: '普通',
        faultPart: '主机需要维护保养，更换部分磨损部件，进行坞检',
        repairLocation: '船厂维修',
        budgetRange: '50-100万元',
      },
      attachments: [],
      publisher: {
        name: '宁波航运有限公司',
        avatar: 'https://picsum.photos/seed/pub3/80/80',
        rating: 4.6,
        verified: true,
        contact: '王船长',
        phone: '137****5555',
        contactMasked: '王**',
        phoneMasked: '137****5555',
      },
      proposals: 5,
      isContacted: false,
    },
  }

  return demands[id] || demands['1']
}

// Mock demand data - 根据需求类型显示不同字段
const demand = ref(getDemandData(demandId))

const demandTypeLabel = computed(() => {
  const labels = { design: '设计需求', build: '建造需求', repair: '维修需求' }
  return labels[demand.value.type] || '需求'
})

const displayParams = computed(() => {
  const params = demand.value.params
  let fieldsToDisplay = []

  // 根据需求类型选择要显示的字段（不包含联系人和电话）
  if (demand.value.type === 'design') {
    // 设计需求字段
    fieldsToDisplay = [
      'shipType',
      'designTonnage',
      'navigationArea',
      'budgetRange',
    ]
  } else if (demand.value.type === 'build') {
    // 建造需求字段
    fieldsToDisplay = [
      'shipType',
      'buildTonnage',
      'powerSystem',
      'budgetRange',
    ]
  } else if (demand.value.type === 'repair') {
    // 维修需求字段
    fieldsToDisplay = [
      'vesselName',
      'vesselType',
      'vesselTonnage',
      'repairType',
      'urgency',
      'faultPart',
      'repairLocation',
      'budgetRange',
    ]
  }

  return fieldsToDisplay
    .filter(key => params[key] !== undefined)
    .map(key => ({
      label: getParamLabel(key),
      value: params[key] || '未填写',
    }))
})

const getParamLabel = (key) => {
  const labels = {
    // 设计需求
    shipType: '船舶类型',
    designTonnage: '设计吨位（DWT）',
    navigationArea: '航区要求',
    // 建造需求
    buildTonnage: '建造吨位（DWT）',
    powerSystem: '动力系统配置要求',
    // 维修需求
    vesselName: '船舶名称',
    vesselType: '船舶类型',
    vesselTonnage: '吨位（DWT）',
    repairType: '维修内容',
    urgency: '维修紧急程度',
    faultPart: '故障/维修部位',
    repairLocation: '维修地点偏好',
    // 通用
    budgetRange: '预算范围',
    contact: '联系人',
    phone: '联系电话',
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
  if (!demand.value.isContacted) {
    // 模拟意向对接确认
    if (confirm('确认要与发布者进行意向对接吗？对接成功后将显示完整联系方式。')) {
      demand.value.isContacted = true
      alert('对接成功！现在可以查看完整联系方式')
    }
  } else {
    alert('您已经对接过该需求')
  }
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
}
</style>

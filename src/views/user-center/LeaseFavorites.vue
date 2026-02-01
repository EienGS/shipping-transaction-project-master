<template>
  <div class="lease-favorites-container">
    <div class="search-filter-section">
      <div class="header-content">
        <h1 class="page-title">租赁需求收藏</h1>
        <div class="stats-badge">共 {{ totalFavorites }} 项收藏</div>
      </div>
      
      <div class="search-card">
        <div class="search-main-row">
          <div class="search-input-group">
            <div class="input-with-icon">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="搜索船舶名称或关键词..."
                class="modern-input"
                @input="applyFilters"
              >
            </div>
          </div>

          <div class="filter-group">
            <div class="select-item">
              <span class="select-label">收藏时间</span>
              <select v-model="filterDateRange" @change="applyFilters" class="modern-select">
                <option value="">全部时间</option>
                <option value="7days">最近7天</option>
                <option value="30days">最近30天</option>
                <option value="90days">最近90天</option>
              </select>
            </div>

            <div class="select-item">
              <span class="select-label">租赁类型</span>
              <select v-model="filterLeaseType" @change="applyFilters" class="modern-select">
                <option value="">全部类型</option>
                <option value="期租">期租</option>
                <option value="光租">光租</option>
                <option value="航次租船">航次租船</option>
              </select>
            </div>

            <div class="select-item">
              <span class="select-label">船舶类型</span>
              <select v-model="filterVesselType" @change="applyFilters" class="modern-select">
                <option value="">全部船型</option>
                <option value="散货船">散货船</option>
                <option value="油船">油船</option>
                <option value="集装箱船">集装箱船</option>
              </select>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn-reset-new" @click="resetFilters">
              重置
            </button>
            <button class="btn-search-new" @click="applyFilters">
              <span>查询</span>
            </button>
          </div>
        </div>

        <div v-if="hasActiveFilters" class="tags-container">
          <span class="tags-label">当前筛选：</span>
          <div class="tags-list">
            <span v-if="searchKeyword" class="modern-tag">
              关键词: {{ searchKeyword }}
              <i @click="searchKeyword = ''; applyFilters()">✕</i>
            </span>
            <span v-if="filterLeaseType" class="modern-tag">
              租赁类型: {{ filterLeaseType }}
              <i @click="filterLeaseType = ''; applyFilters()">✕</i>
            </span>
            <span v-if="filterDateRange" class="modern-tag">
              时间: {{ filterDateRangeText }}
              <i @click="filterDateRange = ''; applyFilters()">✕</i>
            </span>
            <span v-if="filterVesselType" class="modern-tag">
              船舶类型: {{ filterVesselType }}
              <i @click="filterVesselType = ''; applyFilters()">✕</i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-section">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'lease' }" 
        @click="activeTab = 'lease'"
      >
        租赁信息 ({{ favoritedLeases.length }})
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'demand' }" 
        @click="activeTab = 'demand'"
      >
        求租信息 ({{ favoritedDemands.length }})
      </button>
    </div>

    <!-- 租赁信息 Tab -->
    <div v-if="activeTab === 'lease'">
      <div v-if="filteredLeases.length > 0" class="lease-cards-grid">
        <div 
          v-for="lease in filteredLeases" 
          :key="lease.id" 
          class="lease-card"
          @click="viewLeaseDetail(lease.id)"
        >
          <div class="card-image">
            <img :src="`https://picsum.photos/seed/lease${lease.id}/400/250`" alt="vessel">
            <button class="fav-btn active" @click.stop="removeFavorite(lease.id, 'lease')">❤</button>
            <span class="lease-badge">{{ lease.leaseType }}</span>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ lease.vesselName }}</h3>
            <div class="card-meta">
              <span class="meta-item">{{ lease.vesselType }}</span>
              <span class="meta-item">{{ lease.dwt }}吨</span>
            </div>
            <div class="card-info">
              <div class="info-row">
                <span class="label">租金:</span>
                <span class="value price">{{ lease.price }}万元/{{ lease.priceUnit }}</span>
              </div>
              <div class="info-row">
                <span class="label">可租时间:</span>
                <span class="value">{{ lease.availableTime }}</span>
              </div>
              <div class="info-row">
                <span class="label">出发港:</span>
                <span class="value">{{ lease.departurePort }}</span>
              </div>
              <div class="info-row">
                <span class="label">收藏于:</span>
                <span class="value time">{{ lease.collectedAt }}</span>
              </div>
            </div>
            <div class="card-actions">
              <button class="detail-btn" @click.stop="viewLeaseDetail(lease.id)">查看详情</button>
              <button class="intention-btn" @click.stop="sendIntention(lease.id, 'lease')">发送意向</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📭</div>
        <h2>还没有收藏租赁信息</h2>
        <p>浏览租赁信息时点击❤按钮即可收藏</p>
      </div>
    </div>

    <!-- 求租信息 Tab -->
    <div v-if="activeTab === 'demand'">
      <div v-if="filteredDemands.length > 0" class="demand-list">
        <div 
          v-for="demand in filteredDemands" 
          :key="demand.id" 
          class="demand-item" 
          @click="viewDemandDetail(demand.id)"
        >
          <div class="demand-header">
            <span class="demand-code">{{ demand.code }}</span>
            <div class="header-right">
              <span class="demand-type-tag">{{ demand.leaseType }}</span>
              <button class="fav-btn-small active" @click.stop="removeFavorite(demand.id, 'demand')">❤</button>
            </div>
          </div>
          <div class="demand-content">
            <div class="demand-row">
              <span class="label">船舶类型:</span>
              <span class="value">{{ demand.vesselType }}</span>
            </div>
            <div class="demand-row">
              <span class="label">航区:</span>
              <span class="value">{{ demand.route }}</span>
            </div>
            <div class="demand-row">
              <span class="label">租赁期限:</span>
              <span class="value">{{ demand.duration }}</span>
            </div>
            <div class="demand-row">
              <span class="label">预算:</span>
              <span class="value budget">{{ demand.budget }}万元</span>
            </div>
            <div class="demand-row">
              <span class="label">发布时间:</span>
              <span class="value time">{{ demand.publishTime }}</span>
            </div>
            <div class="demand-row">
              <span class="label">收藏于:</span>
              <span class="value time">{{ demand.collectedAt }}</span>
            </div>
          </div>
          <div class="demand-action">
            <button class="contact-btn" @click.stop="sendIntention(demand.id, 'demand')">对接意向</button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📭</div>
        <h2>还没有收藏求租信息</h2>
        <p>浏览求租信息时点击❤按钮即可收藏</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选条件
const searchKeyword = ref('')
const filterDateRange = ref('')
const filterLeaseType = ref('')
const filterVesselType = ref('')
const activeTab = ref('lease')

// 租赁信息收藏数据
const favoritedLeases = ref([
  { id: 1, vesselName: '远洋货轮', vesselType: '散货船', dwt: 57000, leaseType: '期租', price: 180, priceUnit: '月', availableTime: '2024-03-01', departurePort: '上海港', collectedAt: '2024-01-20' },
  { id: 2, vesselName: '海洋之星', vesselType: '油船', dwt: 45000, leaseType: '光租', price: 150, priceUnit: '月', availableTime: '2024-03-15', departurePort: '宁波港', collectedAt: '2024-01-18' },
  { id: 3, vesselName: '东方巨轮', vesselType: '集装箱船', dwt: 32000, leaseType: '航次租船', price: 80, priceUnit: '航次', availableTime: '2024-03-10', departurePort: '青岛港', collectedAt: '2024-01-15' },
  { id: 4, vesselName: '太平洋号', vesselType: '散货船', dwt: 62000, leaseType: '期租', price: 200, priceUnit: '月', availableTime: '2024-04-01', departurePort: '天津港', collectedAt: '2024-01-10' },
])

// 求租信息收藏数据
const favoritedDemands = ref([
  { id: 1, code: 'RD202401001', leaseType: '期租', vesselType: '散货船', route: '上海港-新加坡', duration: '12个月', budget: '180-200', publishTime: '2024-02-28 10:30', collectedAt: '2024-01-22' },
  { id: 2, code: 'RD202401002', leaseType: '光租', vesselType: '油船', route: '宁波港-日本', duration: '24个月', budget: '140-160', publishTime: '2024-02-27 14:20', collectedAt: '2024-01-19' },
  { id: 3, code: 'RD202401003', leaseType: '航次租船', vesselType: '集装箱船', route: '青岛港-釜山', duration: '单航次', budget: '60-80', publishTime: '2024-02-26 09:15', collectedAt: '2024-01-12' },
])

// 计算属性
const totalFavorites = computed(() => {
  return favoritedLeases.value.length + favoritedDemands.value.length
})

const filterDateRangeText = computed(() => {
  const rangeMap = { '7days': '最近7天', '30days': '最近30天', '90days': '最近90天' }
  return rangeMap[filterDateRange.value] || ''
})

const hasActiveFilters = computed(() => {
  return searchKeyword.value || filterDateRange.value || filterLeaseType.value || filterVesselType.value
})

const getDateDaysAgo = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

const filteredLeases = computed(() => {
  let leases = favoritedLeases.value
  if (searchKeyword.value) {
    leases = leases.filter(l => l.vesselName.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  }
  if (filterLeaseType.value) {
    leases = leases.filter(l => l.leaseType === filterLeaseType.value)
  }
  if (filterVesselType.value) {
    leases = leases.filter(l => l.vesselType === filterVesselType.value)
  }
  if (filterDateRange.value) {
    let daysLimit = filterDateRange.value === '7days' ? 7 : filterDateRange.value === '30days' ? 30 : 90
    const cutoffDate = getDateDaysAgo(daysLimit)
    leases = leases.filter(l => l.collectedAt >= cutoffDate)
  }
  return leases
})

const filteredDemands = computed(() => {
  let demands = favoritedDemands.value
  if (searchKeyword.value) {
    demands = demands.filter(d => 
      d.code.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      d.vesselType.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  if (filterLeaseType.value) {
    demands = demands.filter(d => d.leaseType === filterLeaseType.value)
  }
  if (filterVesselType.value) {
    demands = demands.filter(d => d.vesselType === filterVesselType.value)
  }
  if (filterDateRange.value) {
    let daysLimit = filterDateRange.value === '7days' ? 7 : filterDateRange.value === '30days' ? 30 : 90
    const cutoffDate = getDateDaysAgo(daysLimit)
    demands = demands.filter(d => d.collectedAt >= cutoffDate)
  }
  return demands
})

// 方法
const applyFilters = () => {
  console.log('[v0] 应用筛选条件')
}

const resetFilters = () => {
  searchKeyword.value = ''
  filterDateRange.value = ''
  filterLeaseType.value = ''
  filterVesselType.value = ''
}

const removeFavorite = (id, type) => {
  if (type === 'lease') {
    const index = favoritedLeases.value.findIndex(l => l.id === id)
    if (index !== -1) favoritedLeases.value.splice(index, 1)
  } else {
    const index = favoritedDemands.value.findIndex(d => d.id === id)
    if (index !== -1) favoritedDemands.value.splice(index, 1)
  }
  console.log('[v0] 取消收藏:', type, id)
}

const viewLeaseDetail = (id) => {
  router.push(`/vessel-leasing/lease/${id}`)
}

const viewDemandDetail = (id) => {
  router.push(`/vessel-leasing/demand/${id}`)
}

const sendIntention = (id, type) => {
  console.log('[v0] 发送意向:', type, id)
}
</script>

<style scoped>
/* Base Container */
.lease-favorites-container {
  background-color: #fff;
  min-height: 100vh;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Search Section - 参考TradeFavorites.vue */
.search-filter-section {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.stats-badge {
  background: #e2e8f0;
  color: #475569;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.search-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
}

.search-main-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.search-input-group {
  flex: 1;
  min-width: 260px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: #94a3b8;
  transition: color 0.3s;
}

.modern-input {
  width: 100%;
  height: 42px;
  padding: 0 12px 0 40px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-input:focus {
  background: #fff;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  outline: none;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.select-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.select-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-left: 2px;
}

.modern-select {
  height: 42px;
  min-width: 130px;
  padding: 0 32px 0 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  transition: all 0.2s;
}

.modern-select:hover {
  border-color: #cbd5e1;
}

.modern-select:focus {
  border-color: #0ea5e9;
  background-color: #fff;
  outline: none;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-search-new {
  height: 42px;
  padding: 0 24px;
  background: #0ea5e9;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
}

.btn-search-new:hover {
  background: #0284c7;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(14, 165, 233, 0.3);
}

.btn-reset-new {
  height: 42px;
  padding: 0 18px;
  background: #fff;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset-new:hover {
  background: #f1f5f9;
  color: #1e293b;
  border-color: #cbd5e1;
}

.tags-container {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tags-label {
  font-size: 13px;
  color: #94a3b8;
  white-space: nowrap;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modern-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  font-size: 13px;
  color: #0369a1;
  font-weight: 500;
}

.modern-tag i {
  font-style: normal;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.modern-tag i:hover {
  opacity: 1;
}

/* Tabs Section */
.tabs-section {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e2e8f0;
}

.tab-btn {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #0ea5e9;
}

.tab-btn.active {
  color: #0ea5e9;
  border-bottom-color: #0ea5e9;
}

/* 租赁信息卡片网格 - 参考VesselLeasingHome.vue */
.lease-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.lease-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lease-card:hover {
  border-color: #0ea5e9;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  height: 200px;
  background-color: #f1f5f9;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fav-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: white;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  transition: all 0.3s;
}

.fav-btn:hover {
  transform: scale(1.1);
}

.lease-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.card-content {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.card-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #64748b;
}

.meta-item {
  display: flex;
  align-items: center;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.info-row .label {
  color: #64748b;
}

.info-row .value {
  color: #1e293b;
  font-weight: 500;
}

.info-row .value.price {
  color: #0ea5e9;
  font-weight: 700;
}

.info-row .value.time {
  color: #94a3b8;
  font-size: 12px;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.detail-btn,
.intention-btn {
  flex: 1;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.detail-btn {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.detail-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.intention-btn {
  background: #0ea5e9;
  border: none;
  color: white;
}

.intention-btn:hover {
  background: #0284c7;
}

/* 求租信息列表 - 参考VesselLeasingHome.vue */
.demand-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
}

.demand-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.demand-item:hover {
  border-color: #0ea5e9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.demand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.demand-code {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.demand-type-tag {
  padding: 3px 10px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.fav-btn-small {
  border: none;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  transition: all 0.3s;
}

.fav-btn-small:hover {
  transform: scale(1.2);
}

.demand-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.demand-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.demand-row .label {
  color: #64748b;
  font-weight: 500;
}

.demand-row .value {
  color: #1e293b;
  font-weight: 500;
}

.demand-row .value.budget {
  color: #0ea5e9;
  font-weight: 700;
}

.demand-row .value.time {
  color: #94a3b8;
  font-size: 12px;
}

.demand-action {
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.contact-btn {
  width: 100%;
  padding: 8px 16px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-btn:hover {
  background: #0284c7;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .search-main-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .action-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .lease-favorites-container {
    padding: 16px;
  }

  .lease-cards-grid {
    grid-template-columns: 1fr;
  }

  .demand-list {
    grid-template-columns: 1fr;
  }
}
</style>

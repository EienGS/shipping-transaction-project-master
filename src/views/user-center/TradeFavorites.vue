<template>
  <div class="trade-favorites-container">
    <div class="search-filter-section">
      <div class="header-content">
        <h1 class="page-title">购售需求收藏</h1>
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
                v-model="searchTitle" 
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
              <span class="select-label">类型</span>
              <select v-model="filterType" @change="applyFilters" class="modern-select">
                <option value="">全部类型</option>
                <option value="散货船">散货船</option>
                <option value="油船">油船</option>
                <option value="集装箱船">集装箱船</option>
              </select>
            </div>

            <div v-if="activeTab === 'sale'" class="select-item">
              <span class="select-label">船舶状态</span>
              <select v-model="filterStatus" @change="applyFilters" class="modern-select">
                <option value="">全部状态</option>
                <option value="在售">在售</option>
                <option value="已成交">已成交</option>
                <option value="已下架">已下架</option>
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
            <span v-if="searchTitle" class="modern-tag">
              关键词: {{ searchTitle }}
              <i @click="searchTitle = ''; applyFilters()">✕</i>
            </span>
            <span v-if="filterStatus" class="modern-tag">
              状态: {{ filterStatus }}
              <i @click="filterStatus = ''; applyFilters()">✕</i>
            </span>
            <span v-if="filterDateRange" class="modern-tag">
              时间: {{ filterDateRangeText }}
              <i @click="filterDateRange = ''; applyFilters()">✕</i>
            </span>
            <span v-if="filterType" class="modern-tag">
              类型: {{ filterType }}
              <i @click="filterType = ''; applyFilters()">✕</i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-section">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'sale' }" 
        @click="activeTab = 'sale'"
      >
        出售信息 ({{ favoritedVessels.length }})
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'demand' }" 
        @click="activeTab = 'demand'"
      >
        求购信息 ({{ favoritedDemands.length }})
      </button>
    </div>

    <!-- 出售信息 Tab -->
    <div v-if="activeTab === 'sale'">
      <div v-if="filteredSaleVessels.length > 0" class="vessel-cards-grid">
        <div 
          v-for="v in filteredSaleVessels" 
          :key="v.id" 
          class="vessel-ui-card"
          @click="viewVesselDetail(v.id)"
        >
          <div class="image-box">
            <img :src="`https://picsum.photos/seed/${v.id}/400/260`" alt="vessel">
            <div class="type-badge">{{ v.type }}</div>
            <button class="fav-btn active" @click.stop="removeFavorite(v.id, 'sale')">❤</button>
          </div>
          <div class="info-box">
            <h3 class="name">
              <span :class="['status-badge', `status-${v.status}`]">{{ v.status }}</span>
              {{ v.name }}
            </h3>
            <div class="meta">
              <span>{{ v.age }}年船龄</span>
              <span class="divider">|</span>
              <span>{{ v.dwt }} DWT</span>
            </div>
            <div class="collection-time">
              <span>收藏于: {{ v.collectedAt }}</span>
            </div>
            <div class="footer">
              <div class="price">
                <span class="label">期望售价:</span>
                <span class="amount">¥ {{ v.price }}<small>万</small></span>
              </div>
              <button class="detail-btn">查看详情</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📭</div>
        <h2>还没有收藏出售信息</h2>
        <p>浏览船舶时点击❤按钮即可收藏喜欢的船源</p>
      </div>
    </div>

    <!-- 求购信息 Tab -->
    <div v-if="activeTab === 'demand'">
      <div v-if="filteredDemands.length > 0" class="purchase-list">
        <div v-for="p in filteredDemands" :key="p.id" class="purchase-row" @click="viewPurchaseDetail(p.id)">
          <button class="fav-btn-demand active" @click.stop="removeFavorite(p.id, 'demand')">❤</button>
          <div class="row-top">
            <span class="p-badge">{{ p.type }}</span>
            <span class="p-time">收藏于 {{ p.collectedAt }}</span>
          </div>
          <div class="row-middle">
            <p>航区：{{ p.area }}</p>
            <p>船龄：{{ p.buildYear }}</p>
            <p class="budget">预算：<span>{{ p.budget }}</span></p>
          </div>
          <button class="contact-btn" @click.stop="viewPurchaseDetail(p.id)">立即对接咨询</button>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📭</div>
        <h2>还没有收藏求购信息</h2>
        <p>浏览求购需求时点击❤按钮即可收藏感兴趣的需求</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchTitle = ref('')
const filterStatus = ref('')
const filterDateRange = ref('')
const filterType = ref('')
const activeTab = ref('sale')

const favoritedVessels = ref([
  { id: 2, name: '集装箱船 "PACIFIC LINK"', type: '集装箱船', age: 5, dwt: '32,000', price: 6800, status: '在售', collectedAt: '2024-01-20' },
  { id: 5, name: '8.2万吨散货船 "KAMSARMAX II"', type: '散货船', age: 3, dwt: '82,000', price: 11500, status: '在售', collectedAt: '2024-01-18' },
  { id: 8, name: '化学品油轮 "CHEM STAR"', type: '油船', age: 9, dwt: '38,000', price: 3800, status: '已成交', collectedAt: '2024-01-15' },
  { id: 1, name: '5.7万吨散货船 "OCEAN STAR"', type: '散货船', age: 8, dwt: '57,000', price: 3500, status: '在售', collectedAt: '2024-01-10' },
  { id: 12, name: '好望角型散货船 "CAPE STAR"', type: '散货船', age: 8, dwt: '180,000', price: 22000, status: '已下架', collectedAt: '2024-01-05' }
])

const favoritedDemands = ref([
  { id: 'GQ1', type: '散货船', area: '无限航区', buildYear: '2015-2023', budget: '3000-5000万', collectedAt: '2024-01-22' },
  { id: 'GQ2', type: '油船', area: '国内近海', buildYear: '2018年以后', budget: '8000万以内', collectedAt: '2024-01-20' },
  { id: 'GQ3', type: '集装箱船', area: '东南亚航线', buildYear: '不限', budget: '2500-4000万', collectedAt: '2024-01-18' }
])

const totalFavorites = computed(() => favoritedVessels.value.length + favoritedDemands.value.length)

const filterDateRangeText = computed(() => {
  const rangeMap = { '7days': '最近7天', '30days': '最近30天', '90days': '最近90天' }
  return rangeMap[filterDateRange.value] || ''
})

const hasActiveFilters = computed(() => {
  return searchTitle.value || filterStatus.value || filterDateRange.value || filterType.value
})

const getDateDaysAgo = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

const filteredSaleVessels = computed(() => {
  let vessels = favoritedVessels.value
  if (searchTitle.value) {
    vessels = vessels.filter(v => v.name.toLowerCase().includes(searchTitle.value.toLowerCase()))
  }
  if (filterStatus.value) {
    vessels = vessels.filter(v => v.status === filterStatus.value)
  }
  if (filterDateRange.value) {
    let daysLimit = filterDateRange.value === '7days' ? 7 : filterDateRange.value === '30days' ? 30 : 90
    const cutoffDate = getDateDaysAgo(daysLimit)
    vessels = vessels.filter(v => v.collectedAt >= cutoffDate)
  }
  if (filterType.value) {
    vessels = vessels.filter(v => v.type === filterType.value)
  }
  return vessels
})

const filteredDemands = computed(() => {
  let demands = favoritedDemands.value
  if (searchTitle.value) {
    demands = demands.filter(d => d.type.toLowerCase().includes(searchTitle.value.toLowerCase()))
  }
  if (filterDateRange.value) {
    let daysLimit = filterDateRange.value === '7days' ? 7 : filterDateRange.value === '30days' ? 30 : 90
    const cutoffDate = getDateDaysAgo(daysLimit)
    demands = demands.filter(d => d.collectedAt >= cutoffDate)
  }
  if (filterType.value) {
    demands = demands.filter(d => d.type === filterType.value)
  }
  return demands
})

const applyFilters = () => { /* Logic */ }
const resetFilters = () => {
  searchTitle.value = ''; filterStatus.value = ''; filterDateRange.value = ''; filterType.value = ''
}
const removeFavorite = (id, type) => {
  if (type === 'sale') {
    const index = favoritedVessels.value.findIndex(v => v.id === id)
    if (index !== -1) favoritedVessels.value.splice(index, 1)
  } else {
    const index = favoritedDemands.value.findIndex(d => d.id === id)
    if (index !== -1) favoritedDemands.value.splice(index, 1)
  }
}
const viewVesselDetail = (id) => { router.push(`/shipping-trade/vessel/${id}`) }
const viewPurchaseDetail = (id) => { router.push(`/shipping-trade/purchase/${id}`) }
</script>

<style scoped>
/* Base Container */
.trade-favorites-container {
  background-color: #fff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* --- Optimized Search Section Styles --- */
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
  position: relative;
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

/* Keyword Input */
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

.modern-input:focus + .search-icon {
  color: #0ea5e9;
}

/* Dropdown Filters */
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

/* Buttons */
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

.btn-search-new:active {
  transform: translateY(0);
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

/* Filter Tags */
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

/* Tabs */
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

/* --- Sale Cards Grid --- */
.vessel-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.vessel-ui-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.vessel-ui-card:hover {
  border-color: #0ea5e9;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  transform: translateY(-4px);
}

.image-box {
  position: relative;
  height: 200px;
  background-color: #f1f5f9;
}

.image-box img {
  width: 100%; height: 100%; object-fit: cover;
}

.type-badge {
  position: absolute; top: 12px; left: 12px;
  background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(4px);
  color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;
}

.fav-btn {
  position: absolute; top: 12px; right: 12px;
  width: 32px; height: 32px; border: none; border-radius: 50%;
  background: white; color: #ef4444; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.info-box { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.name { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; display: flex; align-items: center; gap: 8px; }
.status-badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; }
.status-在售 { background: #dcfce7; color: #15803d; }
.status-已成交 { background: #fee2e2; color: #dc2626; }
.status-已下架 { background: #f1f5f9; color: #64748b; }

.meta { font-size: 13px; color: #64748b; }
.collection-time { font-size: 12px; color: #94a3b8; }
.footer {
  margin-top: 8px; padding-top: 12px; border-top: 1px solid #f1f5f9;
  display: flex; justify-content: space-between; align-items: center;
}
.price .amount { font-size: 18px; font-weight: 800; color: #0ea5e9; }
.detail-btn {
  padding: 6px 14px; border: 1px solid #0ea5e9; border-radius: 6px;
  background: transparent; color: #0ea5e9; font-weight: 600; font-size: 12px; cursor: pointer;
}
.detail-btn:hover { background: #0ea5e9; color: white; }

/* --- Purchase Demand List --- */
.purchase-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
}

.purchase-row {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 360px;
  border: 1px solid #F1F5F9;
  transition: 0.3s;
  cursor: pointer;
}

.purchase-row:hover {
  border-color: var(--primary);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.fav-btn-demand {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: white;
  color: #ef4444;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.fav-btn-demand:hover {
  transform: scale(1.1);
}

.fav-btn-demand.active {
  color: #ef4444;
}

.row-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.p-badge {
  color: var(--primary);
  background: rgba(59, 130, 246, 0.1);
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.p-time {
  font-size: 12px;
  color: #94A3B8;
}

.row-middle p {
  font-size: 14px;
  color: var(--text-main);
  margin: 4px 0;
}

.budget span {
  color: #EF4444;
  font-weight: 700;
}

.contact-btn {
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  border-radius: 8px;
  background: var(--dark-bg);
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.purchase-row:hover {
  border-color: #0ea5e9;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.fav-btn-demand {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: white;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1;
}

.row-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.p-badge {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.p-time {
  font-size: 12px;
  color: #94a3b8;
}

.row-middle {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.row-middle p {
  margin: 0;
  font-size: 14px;
  color: #475569;
}

.row-middle .budget {
  font-weight: 600;
}

.row-middle .budget span {
  color: #0ea5e9;
  font-size: 15px;
}

.contact-btn {
  width: 100%;
  padding: 10px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-btn:hover {
  background: #0284c7;
}

.empty-state { text-align: center; padding: 80px 0; color: #64748b; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }

/* Responsive */
@media (max-width: 768px) {
  .search-main-row { flex-direction: column; align-items: stretch; }
  .filter-group { display: grid; grid-template-columns: 1fr 1fr; }
  .select-item { min-width: 0; }
  .action-buttons { display: grid; grid-template-columns: 1fr 1fr; }
  .trade-favorites-container { padding: 16px; }
  .vessel-cards-grid { grid-template-columns: 1fr; }
}
</style>

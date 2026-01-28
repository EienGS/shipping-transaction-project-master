<template>
  <div class="trade-favorites-container">
    <!-- Search & Filter Section -->
    <div class="search-filter-section">
      <h1 class="page-title">购售需求收藏</h1>
      
      <div class="search-controls">
        <!-- Search by Title -->
        <div class="search-input-wrapper">
          <input 
            v-model="searchTitle" 
            type="text" 
            placeholder="按船舶标题搜索..."
            class="search-input"
            @input="applyFilters"
          >
          <svg class="search-icon" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" fill="none" stroke-width="2"/>
          </svg>
        </div>

        <!-- Filter Button -->
        <button class="filter-btn" @click="showFilterPopup = !showFilterPopup">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M6 12h12M9 18h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          筛选
        </button>
      </div>

      <!-- Filter Popup -->
      <div v-if="showFilterPopup" class="filter-popup-overlay" @click="showFilterPopup = false"></div>
      <transition name="filter-popup">
        <div v-if="showFilterPopup" class="filter-popup-card" @click.stop>
          <div class="filter-compact-body">
            <!-- Status Filter -->
            <div class="filter-item">
              <label>船舶状态</label>
              <select v-model="filterStatus" @change="applyFilters">
                <option value="">全部状态</option>
                <option value="在售">在售</option>
                <option value="已成交">已成交</option>
                <option value="已下架">已下架</option>
              </select>
            </div>

            <!-- Collection Date Filter -->
            <div class="filter-item">
              <label>收藏时间</label>
              <select v-model="filterDateRange" @change="applyFilters">
                <option value="">全部时间</option>
                <option value="7days">最近7天</option>
                <option value="30days">最近30天</option>
                <option value="90days">最近90天</option>
              </select>
            </div>

            <!-- Vessel Type Filter -->
            <div class="filter-item">
              <label>船舶类型</label>
              <select v-model="filterType" @change="applyFilters">
                <option value="">全部类型</option>
                <option value="散货船">散货船</option>
                <option value="油船">油船</option>
                <option value="集装箱船">集装箱船</option>
              </select>
            </div>

            <!-- Filter Actions -->
            <div class="filter-actions">
              <button class="btn-reset" @click="resetFilters">重置</button>
              <button class="btn-apply" @click="showFilterPopup = false">应用</button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="active-filters">
        <span v-if="searchTitle" class="filter-tag">
          标题: {{ searchTitle }}
          <button @click="searchTitle = ''; applyFilters()">✕</button>
        </span>
        <span v-if="filterStatus" class="filter-tag">
          状态: {{ filterStatus }}
          <button @click="filterStatus = ''; applyFilters()">✕</button>
        </span>
        <span v-if="filterDateRange" class="filter-tag">
          时间: {{ filterDateRangeText }}
          <button @click="filterDateRange = ''; applyFilters()">✕</button>
        </span>
        <span v-if="filterType" class="filter-tag">
          类型: {{ filterType }}
          <button @click="filterType = ''; applyFilters()">✕</button>
        </span>
      </div>
    </div>

    <!-- Favorites List -->
    <div v-if="filteredFavorites.length > 0" class="vessel-cards-grid">
      <div 
        v-for="v in filteredFavorites" 
        :key="v.id" 
        class="vessel-ui-card"
        @click="viewVesselDetail(v.id)"
      >
        <div class="image-box">
          <img :src="`https://picsum.photos/seed/${v.id}/400/260`" alt="vessel">
          <div class="type-badge">{{ v.type }}</div>
          <button class="fav-btn active" @click.stop="removeFavorite(v.id)">❤</button>
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

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <h2>还没有收藏</h2>
      <p>浏览船舶时点击❤按钮即可收藏喜欢的船源</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Search and filter states
const searchTitle = ref('')
const filterStatus = ref('')
const filterDateRange = ref('')
const filterType = ref('')
const showFilterPopup = ref(false)

// Mock favorited vessels data
const favoritedVessels = ref([
  { 
    id: 2, 
    name: '集装箱船 "PACIFIC LINK"', 
    type: '集装箱船', 
    age: 5, 
    dwt: '32,000', 
    price: 6800, 
    status: '在售',
    collectedAt: '2024-01-20'
  },
  { 
    id: 5, 
    name: '8.2万吨散货船 "KAMSARMAX II"', 
    type: '散货船', 
    age: 3, 
    dwt: '82,000', 
    price: 11500, 
    status: '在售',
    collectedAt: '2024-01-18'
  },
  { 
    id: 8, 
    name: '化学品油轮 "CHEM STAR"', 
    type: '油船', 
    age: 9, 
    dwt: '38,000', 
    price: 3800, 
    status: '已成交',
    collectedAt: '2024-01-15'
  },
  { 
    id: 1, 
    name: '5.7万吨散货船 "OCEAN STAR"', 
    type: '散货船', 
    age: 8, 
    dwt: '57,000', 
    price: 3500, 
    status: '在售',
    collectedAt: '2024-01-10'
  },
  { 
    id: 12, 
    name: '好望角型散货船 "CAPE STAR"', 
    type: '散货船', 
    age: 8, 
    dwt: '180,000', 
    price: 22000, 
    status: '已下架',
    collectedAt: '2024-01-05'
  }
])

// Compute filter date range text
const filterDateRangeText = computed(() => {
  const rangeMap = {
    '7days': '最近7天',
    '30days': '最近30天',
    '90days': '最近90天'
  }
  return rangeMap[filterDateRange.value] || ''
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return searchTitle.value || filterStatus.value || filterDateRange.value || filterType.value
})

// Calculate date comparison for filtering
const getDateDaysAgo = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// Filter vessels based on search and filter criteria
const filteredFavorites = computed(() => {
  let vessels = favoritedVessels.value

  // Filter by title
  if (searchTitle.value) {
    vessels = vessels.filter(v => 
      v.name.toLowerCase().includes(searchTitle.value.toLowerCase())
    )
  }

  // Filter by status
  if (filterStatus.value) {
    vessels = vessels.filter(v => v.status === filterStatus.value)
  }

  // Filter by collection date
  if (filterDateRange.value) {
    let daysLimit = 0
    if (filterDateRange.value === '7days') daysLimit = 7
    else if (filterDateRange.value === '30days') daysLimit = 30
    else if (filterDateRange.value === '90days') daysLimit = 90

    const cutoffDate = getDateDaysAgo(daysLimit)
    vessels = vessels.filter(v => v.collectedAt >= cutoffDate)
  }

  // Filter by vessel type
  if (filterType.value) {
    vessels = vessels.filter(v => v.type === filterType.value)
  }

  return vessels
})

// Methods
const applyFilters = () => {
  console.log('[v0] 应用筛选条件:', {
    searchTitle: searchTitle.value,
    filterStatus: filterStatus.value,
    filterDateRange: filterDateRange.value,
    filterType: filterType.value
  })
}

const resetFilters = () => {
  searchTitle.value = ''
  filterStatus.value = ''
  filterDateRange.value = ''
  filterType.value = ''
  applyFilters()
}

const removeFavorite = (id) => {
  const index = favoritedVessels.value.findIndex(v => v.id === id)
  if (index !== -1) {
    favoritedVessels.value.splice(index, 1)
    console.log('[v0] 取消收藏 ID:', id)
  }
}

const viewVesselDetail = (id) => {
  console.log('[v0] 查看船舶详情 ID:', id)
  router.push(`/shipping-trade/vessel/${id}`)
}
</script>

<style scoped>
.trade-favorites-container {
  padding: 24px;
  background-color: #FFFFFF;
  min-height: 100vh;
}

.search-filter-section {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 24px;
}

.search-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #94A3B8;
  pointer-events: none;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background-color: #FFFFFF;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #0EA5E9;
  color: #0EA5E9;
}

.filter-btn svg {
  width: 16px;
  height: 16px;
}

/* Filter Popup */
.filter-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.filter-popup-card {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
  min-width: 280px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;
}

.filter-compact-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-item select {
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  font-size: 14px;
  background-color: #FFFFFF;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-item select:focus {
  outline: none;
  border-color: #0EA5E9;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.btn-reset {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  background-color: #FFFFFF;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset:hover {
  background-color: #F1F5F9;
  border-color: #CBD5E1;
}

.btn-apply {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #0EA5E9;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-apply:hover {
  background-color: #0284C7;
}

.filter-popup-enter-active,
.filter-popup-leave-active {
  transition: all 0.3s ease;
}

.filter-popup-enter-from,
.filter-popup-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Active Filters Display */
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 20px;
  font-size: 13px;
  color: #1E40AF;
}

.filter-tag button {
  background: none;
  border: none;
  color: #1E40AF;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  display: flex;
  align-items: center;
}

.filter-tag button:hover {
  opacity: 0.7;
}

/* Vessel Cards Grid */
.vessel-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.vessel-ui-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.vessel-ui-card:hover {
  border-color: #0EA5E9;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
  transform: translateY(-2px);
}

.image-box {
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: #F1F5F9;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.fav-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  color: #94A3B8;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-btn:hover {
  background-color: white;
  color: #EF4444;
}

.fav-btn.active {
  color: #EF4444;
}

.info-box {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.name {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.status-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 3px;
  white-space: nowrap;
}

.status-在售 {
  background-color: #DCFCE7;
  color: #15803D;
}

.status-已成交 {
  background-color: #FEE2E2;
  color: #DC2626;
}

.status-已下架 {
  background-color: #F3F4F6;
  color: #6B7280;
}

.meta {
  font-size: 13px;
  color: #64748B;
}

.divider {
  margin: 0 4px;
  color: #CBD5E1;
}

.collection-time {
  font-size: 12px;
  color: #94A3B8;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #E2E8F0;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price .label {
  font-size: 12px;
  color: #64748B;
}

.price .amount {
  font-size: 16px;
  font-weight: 700;
  color: #0EA5E9;
}

.price small {
  font-size: 12px;
  font-weight: 600;
  color: #0EA5E9;
}

.detail-btn {
  padding: 6px 12px;
  border: 1px solid #0EA5E9;
  border-radius: 4px;
  background-color: white;
  color: #0EA5E9;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-btn:hover {
  background-color: #0EA5E9;
  color: white;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  color: #64748B;
}

@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
  }

  .search-input-wrapper {
    max-width: 100%;
  }

  .vessel-cards-grid {
    grid-template-columns: 1fr;
  }

  .filter-popup-card {
    left: auto;
    right: 0;
    min-width: auto;
    width: 280px;
  }
}
</style>

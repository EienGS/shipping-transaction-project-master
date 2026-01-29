<template>
  <div class="vessel-leasing-page">
    <!-- Visual Banner -->
    <section class="hero-banner">
      <div class="banner-overlay">
        <h1 class="banner-slogan">船舶租赁灵活高效，租后动态实时掌握</h1>
      </div>
    </section>

    <!-- Quick Operations -->
    <section class="quick-ops-section">
      <div class="ops-container">
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
          </svg>
          <input type="text" v-model="searchKeyword" placeholder="输入船名/船舶类型/租赁类型/港口搜索" class="search-input">
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>

        <div class="action-buttons">
          <button class="action-btn publish-lease" @click="goToPublishLease">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"/>
            </svg>
            发布租赁信息
          </button>
          <button class="action-btn publish-demand" @click="goToPublishDemand">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"/>
            </svg>
            发布求租信息
          </button>
          <button class="action-btn publish-idle" @click="goToPublishIdle">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"/>
            </svg>
            发布空船信息
          </button>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="filters-container">
        <div class="filter-group">
          <label>租赁类型:</label>
          <select v-model="filters.leaseType" class="filter-select">
            <option value="">全部</option>
            <option value="time">期租</option>
            <option value="bareboat">光租</option>
            <option value="voyage">航次租船</option>
          </select>
        </div>

        <div class="filter-group">
          <label>船舶类型:</label>
          <select v-model="filters.vesselType" class="filter-select">
            <option value="">全部</option>
            <option value="散货船">散货船</option>
            <option value="油船">油船</option>
            <option value="集装箱船">集装箱船</option>
          </select>
        </div>

        <div class="filter-group">
          <label>租金范围:</label>
          <input type="number" v-model.number="filters.priceMin" placeholder="最低" class="filter-input">
          <span class="separator">-</span>
          <input type="number" v-model.number="filters.priceMax" placeholder="最高" class="filter-input">
          <span class="unit">万元</span>
        </div>

        <button class="reset-btn" @click="resetFilters">重置</button>
      </div>
    </section>

    <!-- Main Content: Split Layout -->
    <section class="content-section">
      <div class="content-container">
        <!-- Left: Lease/Idle Info -->
        <div class="left-panel">
          <div class="panel-tabs">
            <button class="tab-btn" :class="{ active: activeTab === 'lease' }" @click="activeTab = 'lease'">
              租赁信息
            </button>
            <button class="tab-btn" :class="{ active: activeTab === 'idle' }" @click="activeTab = 'idle'">
              空船信息
            </button>
          </div>

          <!-- Lease Cards -->
          <div v-if="activeTab === 'lease'" class="cards-grid">
            <div v-for="lease in paginatedLeases" :key="lease.id" class="lease-card">
              <div class="card-image">
                <img :src="`https://picsum.photos/seed/lease${lease.id}/400/250`" alt="vessel">
                <button class="fav-btn" :class="{ favorited: lease.favorited }" @click="toggleFavorite(lease.id)">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.998 16.95 2.998C16.2275 2.998 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.452 9.22248 22.452 8.5C22.452 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" :stroke="lease.favorited ? '#1890FF' : 'currentColor'" :fill="lease.favorited ? '#1890FF' : 'none'" stroke-width="2"/>
                  </svg>
                </button>
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
                </div>
                <div class="card-actions">
                  <button class="detail-btn" @click="viewLeaseDetail(lease.id)">查看详情</button>
                  <button class="intention-btn" @click="sendIntention(lease.id, 'lease')">发送意向</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Idle Cards -->
          <div v-if="activeTab === 'idle'" class="cards-grid">
            <div v-for="idle in paginatedIdles" :key="idle.id" class="lease-card">
              <div class="card-image">
                <img :src="`https://picsum.photos/seed/idle${idle.id}/400/250`" alt="vessel">
                <button class="fav-btn" :class="{ favorited: idle.favorited }" @click="toggleFavorite(idle.id)">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.998 16.95 2.998C16.2275 2.998 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.452 9.22248 22.452 8.5C22.452 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" :stroke="idle.favorited ? '#1890FF' : 'currentColor'" :fill="idle.favorited ? '#1890FF' : 'none'" stroke-width="2"/>
                  </svg>
                </button>
                <span class="lease-badge idle">空船</span>
              </div>
              <div class="card-content">
                <h3 class="card-title">{{ idle.vesselName }}</h3>
                <div class="card-meta">
                  <span class="meta-item">{{ idle.vesselType }}</span>
                  <span class="meta-item">{{ idle.dwt }}吨</span>
                </div>
                <div class="card-info">
                  <div class="info-row">
                    <span class="label">位置:</span>
                    <span class="value">{{ idle.location }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">可用时间:</span>
                    <span class="value">{{ idle.availableTime }}</span>
                  </div>
                </div>
                <div class="card-actions">
                  <button class="detail-btn" @click="viewIdleDetail(idle.id)">查看详情</button>
                  <button class="intention-btn" @click="sendIntention(idle.id, 'idle')">对接意向</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
            <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
          </div>
        </div>

        <!-- Right: Demand List -->
        <div class="right-panel">
          <div class="panel-header">
            <h3>求租信息</h3>
          </div>

          <div class="demand-filters">
            <select v-model="demandFilters.leaseType" class="mini-select">
              <option value="">租赁类型</option>
              <option value="time">期租</option>
              <option value="bareboat">光租</option>
              <option value="voyage">航次租船</option>
            </select>
            <select v-model="demandFilters.vesselType" class="mini-select">
              <option value="">船舶类型</option>
              <option value="散货船">散货船</option>
              <option value="油船">油船</option>
            </select>
          </div>

          <div class="demand-list">
            <div v-for="demand in paginatedDemands" :key="demand.id" class="demand-item" @click="viewDemandDetail(demand.id)">
              <div class="demand-header">
                <span class="demand-code">{{ demand.code }}</span>
                <span class="demand-type-tag">{{ demand.leaseType }}</span>
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
              </div>
              <div class="demand-action">
                <button class="contact-btn" @click.stop="sendIntention(demand.id, 'demand')">对接意向</button>
              </div>
            </div>
          </div>

          <!-- Demand Pagination -->
          <div class="demand-pagination">
            <button :disabled="demandPage === 1" @click="demandPage--">«</button>
            <span>{{ demandPage }} / {{ demandTotalPages }}</span>
            <button :disabled="demandPage === demandTotalPages" @click="demandPage++">»</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchKeyword = ref('')
const activeTab = ref('lease')
const currentPage = ref(1)
const demandPage = ref(1)
const pageSize = 12
const demandPageSize = 20

// Filters
const filters = ref({
  leaseType: '',
  vesselType: '',
  priceMin: null,
  priceMax: null
})

const demandFilters = ref({
  leaseType: '',
  vesselType: ''
})

// Mock data - Lease info
const leaseData = ref([
  { id: 1, vesselName: '远洋货轮', vesselType: '散货船', dwt: 57000, leaseType: '期租', price: 180, priceUnit: '月', availableTime: '2024-03-01', departurePort: '上海港', favorited: false },
  { id: 2, vesselName: '海洋之星', vesselType: '油船', dwt: 45000, leaseType: '光租', price: 150, priceUnit: '月', availableTime: '2024-03-15', departurePort: '宁波港', favorited: false },
  { id: 3, vesselName: '东方巨轮', vesselType: '集装箱船', dwt: 32000, leaseType: '航次租船', price: 80, priceUnit: '航次', availableTime: '2024-03-10', departurePort: '青岛港', favorited: false },
  { id: 4, vesselName: '太平洋号', vesselType: '散货船', dwt: 62000, leaseType: '期租', price: 200, priceUnit: '月', availableTime: '2024-04-01', departurePort: '天津港', favorited: false },
  { id: 5, vesselName: '海洋探索者', vesselType: '油船', dwt: 48000, leaseType: '期租', price: 165, priceUnit: '月', availableTime: '2024-03-20', departurePort: '大连港', favorited: false },
  { id: 6, vesselName: '蓝色海洋', vesselType: '散货船', dwt: 55000, leaseType: '光租', price: 140, priceUnit: '月', availableTime: '2024-03-25', departurePort: '广州港', favorited: false },
])

// Mock data - Idle vessels
const idleData = ref([
  { id: 1, vesselName: '远洋货轮', vesselType: '散货船', dwt: 57000, location: '上海港', availableTime: '2024-03-05', favorited: false },
  { id: 2, vesselName: '和平号', vesselType: '油船', dwt: 43000, location: '宁波港', availableTime: '2024-03-12', favorited: false },
  { id: 3, vesselName: '星辰号', vesselType: '集装箱船', dwt: 38000, location: '青岛港', availableTime: '2024-03-08', favorited: false },
])

// Mock data - Demands
const demandData = ref([
  { id: 1, code: 'RD202401001', leaseType: '期租', vesselType: '散货船', route: '上海港-新加坡', duration: '12个月', budget: '180-200', publishTime: '2024-02-28 10:30' },
  { id: 2, code: 'RD202401002', leaseType: '光租', vesselType: '油船', route: '宁波港-日本', duration: '24个月', budget: '140-160', publishTime: '2024-02-27 14:20' },
  { id: 3, code: 'RD202401003', leaseType: '航次租船', vesselType: '集装箱船', route: '青岛港-釜山', duration: '单航次', budget: '60-80', publishTime: '2024-02-26 09:15' },
  { id: 4, code: 'RD202401004', leaseType: '期租', vesselType: '散货船', route: '天津港-澳洲', duration: '18个月', budget: '200-220', publishTime: '2024-02-25 16:45' },
  { id: 5, code: 'RD202401005', leaseType: '期租', vesselType: '油船', route: '大连港-韩国', duration: '12个月', budget: '150-170', publishTime: '2024-02-24 11:30' },
])

// Computed
const filteredLeases = computed(() => {
  let result = leaseData.value
  if (filters.value.leaseType) result = result.filter(l => l.leaseType === filters.value.leaseType)
  if (filters.value.vesselType) result = result.filter(l => l.vesselType === filters.value.vesselType)
  if (filters.value.priceMin) result = result.filter(l => l.price >= filters.value.priceMin)
  if (filters.value.priceMax) result = result.filter(l => l.price <= filters.value.priceMax)
  return result
})

const paginatedLeases = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLeases.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredLeases.value.length / pageSize))

const paginatedIdles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return idleData.value.slice(start, start + pageSize)
})

const filteredDemands = computed(() => {
  let result = demandData.value
  if (demandFilters.value.leaseType) result = result.filter(d => d.leaseType === demandFilters.value.leaseType)
  if (demandFilters.value.vesselType) result = result.filter(d => d.vesselType === demandFilters.value.vesselType)
  return result
})

const paginatedDemands = computed(() => {
  const start = (demandPage.value - 1) * demandPageSize
  return filteredDemands.value.slice(start, start + demandPageSize)
})

const demandTotalPages = computed(() => Math.ceil(filteredDemands.value.length / demandPageSize))

// Methods
const handleSearch = () => {
  console.log('[v0] 搜索关键词:', searchKeyword.value)
}

const resetFilters = () => {
  filters.value = {
    leaseType: '',
    vesselType: '',
    priceMin: null,
    priceMax: null
  }
}

const toggleFavorite = (id) => {
  if (activeTab.value === 'lease') {
    const item = leaseData.value.find(l => l.id === id)
    if (item) item.favorited = !item.favorited
  } else {
    const item = idleData.value.find(i => i.id === id)
    if (item) item.favorited = !item.favorited
  }
}

const goToPublishLease = () => {
  console.log('[v0] 跳转到发布租赁信息页面')
  router.push('/vessel-leasing/publish-lease')
}

const goToPublishDemand = () => {
  console.log('[v0] 跳转到发布求租信息页面')
  router.push('/vessel-leasing/publish-demand')
}

const goToPublishIdle = () => {
  console.log('[v0] 跳转到发布空船信息页面')
  router.push('/vessel-leasing/publish-idle')
}

const viewLeaseDetail = (id) => {
  console.log('[v0] 查看租赁详情:', id)
  router.push(`/vessel-leasing/idle/${id}`)
}

const viewIdleDetail = (id) => {
  console.log('[v0] 查看空船详情:', id)
  router.push(`/vessel-leasing/idle/${id}`)
}

const viewDemandDetail = (id) => {
  console.log('[v0] 查看求租详情:', id)
}

const sendIntention = (id, type) => {
  console.log('[v0] 发送意向:', type, id)
}
</script>

<style scoped>
.vessel-leasing-page {
  min-height: 100vh;
  background: #F5F5F5;
}

/* Hero Banner */
.hero-banner {
  height: 280px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%),
              url('https://images.unsplash.com/photo-1578670812003-60745e2c2ea9?w=1600') center/cover;
  background-blend-mode: overlay;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-overlay {
  text-align: center;
}

.banner-slogan {
  font-size: 42px;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

/* Quick Operations */
.quick-ops-section {
  margin-top: -60px;
  position: relative;
  z-index: 10;
}

.ops-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 8px 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  margin-bottom: 24px;
}

.search-icon {
  width: 24px;
  height: 24px;
  color: #94A3B8;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1E293B;
}

.search-btn {
  padding: 10px 32px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.publish-lease {
  background: linear-gradient(135deg, #10b981, #059669);
}

.publish-demand {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.publish-idle {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

/* Filters */
.filters-section {
  margin-top: 32px;
}

.filters-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
  white-space: nowrap;
}

.filter-select,
.filter-input {
  padding: 10px 14px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  background: white;
}

.filter-input {
  width: 100px;
}

.separator {
  color: #94A3B8;
  font-weight: 600;
}

.unit {
  font-size: 13px;
  color: #64748B;
}

.reset-btn {
  padding: 10px 20px;
  background: #F1F5F9;
  border: none;
  border-radius: 8px;
  color: #64748B;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: #E2E8F0;
}

/* Content Section */
.content-section {
  margin-top: 32px;
  padding-bottom: 60px;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 24px;
}

/* Left Panel */
.left-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
}

.panel-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid #F1F5F9;
}

.tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.tab-btn.active {
  color: #3b82f6;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #3b82f6;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.lease-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.lease-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
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
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.fav-btn svg {
  width: 20px;
  height: 20px;
}

.fav-btn:hover {
  transform: scale(1.1);
}

.lease-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 4px 12px;
  background: rgba(59, 130, 246, 0.95);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.lease-badge.idle {
  background: rgba(139, 92, 246, 0.95);
}

.card-content {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
}

.card-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.meta-item {
  font-size: 12px;
  color: #64748B;
}

.card-info {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
}

.info-row .label {
  color: #94A3B8;
}

.info-row .value {
  color: #1E293B;
  font-weight: 600;
}

.info-row .price {
  color: #f59e0b;
  font-weight: 700;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.detail-btn,
.intention-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.detail-btn {
  background: #F1F5F9;
  color: #64748B;
}

.detail-btn:hover {
  background: #E2E8F0;
}

.intention-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.intention-btn.full {
  flex: auto;
}

.intention-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.page-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  color: #64748B;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-info {
  font-size: 14px;
  color: #64748B;
}

/* Right Panel */
.right-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
}

.panel-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 16px;
}

.demand-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.mini-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 13px;
  color: #64748B;
}

.demand-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.demand-item {
  padding: 16px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.demand-item:hover {
  background: #EFF6FF;
  border-color: #3b82f6;
}

.demand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.demand-code {
  font-size: 13px;
  font-weight: 700;
  color: #1E293B;
}

.demand-type-tag {
  padding: 2px 8px;
  background: #DBEAFE;
  color: #3b82f6;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.demand-content {
  margin-bottom: 12px;
}

.demand-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
}

.demand-row .label {
  color: #94A3B8;
}

.demand-row .value {
  color: #1E293B;
  font-weight: 600;
}

.demand-row .budget {
  color: #f59e0b;
}

.demand-row .time {
  color: #64748B;
  font-size: 11px;
}

.demand-action {
  text-align: right;
}

.contact-btn {
  padding: 6px 16px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-btn:hover {
  transform: scale(1.05);
}

.demand-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.demand-pagination button {
  padding: 6px 12px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  color: #64748B;
  cursor: pointer;
  transition: all 0.3s;
}

.demand-pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.demand-pagination button:not(:disabled):hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.demand-pagination span {
  font-size: 13px;
  color: #64748B;
}
</style>

<template>
  <div class="all-vessels-page">
    <!-- Banner Section -->
    <section class="banner-section">
      <div class="banner-overlay">
        <h1 class="banner-title">在售船舶资源</h1>
      </div>
    </section>

    <!-- Compact Search Section -->
    <section class="search-section">
      <div class="search-container">
        <!-- Keyword Search Bar -->
        <div class="keyword-search-bar">
          <input v-model="searchKeyword" type="text" placeholder="搜索船龄、船型、载重吨等..." class="keyword-input" @keyup.enter="handleSearch">
          <button class="keyword-search-btn" @click="handleSearch">搜索</button>
        </div>

        <!-- Main Ship Type Categories -->
        <div class="main-categories">
          <button v-for="type in mainCategories" :key="type.value" class="category-btn"
            :class="{ active: selectedMainType === type.value }" @click="selectMainCategory(type.value)">
            <span class="category-icon">{{ type.icon }}</span>
            <span class="category-label">{{ type.label }}</span>
          </button>
        </div>

        <!-- Sub-categories (only show when main type selected) -->
        <transition name="slide-down">
          <div v-if="selectedMainType && currentSubCategories.length > 0" class="sub-categories">
            <button v-for="sub in currentSubCategories" :key="sub" class="sub-category-btn"
              :class="{ active: selectedSubType === sub }" @click="selectSubCategory(sub)">
              {{ sub }}
            </button>
          </div>
        </transition>

        <!-- Compact Filters -->
        <div class="compact-filters">
          <input type="number" v-model.number="filters.yearFrom" placeholder="建造年份(起)" class="compact-input">
          <input type="number" v-model.number="filters.yearTo" placeholder="建造年份(止)" class="compact-input">

          <select v-model="filters.shipClass" class="compact-select">
            <option value="">船级不限</option>
            <option value="CCS">CCS</option>
            <option value="LR">LR</option>
            <option value="NK">NK</option>
            <option value="ABS">ABS</option>
          </select>

          <input type="number" v-model.number="filters.dwtMin" placeholder="载重吨(最小)" class="compact-input">
          <input type="number" v-model.number="filters.dwtMax" placeholder="载重吨(最大)" class="compact-input">

          <button class="compact-reset" @click="resetFilters" title="重置筛选">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"
                stroke="currentColor" stroke-width="2" />
              <path d="M3 16V12H7" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>

          <button class="compact-search" @click="handleSearch">
            筛选
          </button>
        </div>

        <!-- Result Count -->
        <div class="result-bar">
          <span class="result-text">共 <strong>{{ filteredVessels.length }}</strong> 艘船舶</span>
        </div>
      </div>
    </section>

    <!-- Vessel Cards Grid -->
    <section class="results-section">
      <div class="results-container">
        <div class="vessel-cards-grid">
          <div v-for="v in paginatedVessels" :key="v.id" class="vessel-ui-card" @click="viewVesselDetail(v.id)">
            <div class="image-box">
              <img :src="`https://picsum.photos/seed/vessel${v.id}/400/300`" :alt="v.name">
              <span class="type-badge">{{ v.type }}</span>
              <button class="fav-btn" :class="{ active: v.isFavorited }" @click.stop="toggleFavorite(v.id)">
                ♥
              </button>
            </div>
            <div class="info-box">
              <h3 class="name">
                <span class="sale-badge">在售</span>
                {{ v.name }}
              </h3>
              <div class="meta">
                船龄: {{ v.age }}年
                <span class="divider">|</span>
                载重吨: {{ v.dwt }}
              </div>
              <div class="footer">
                <div class="price">
                  <span class="label">参考价</span>
                  <div class="amount">¥{{ v.price }}<small>万</small></div>
                </div>
                <button class="detail-btn" @click.stop="viewVesselDetail(v.id)">查看详情</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一页</button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button class="page-btn" :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)">下一页</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Main ship categories with icons
const mainCategories = [
  { label: '干散货船', value: 'bulk', icon: '🚢', subs: ['散货船', '杂货船', '集装箱船', '多用途船'] },
  { label: '液货船', value: 'tanker', icon: '🛢️', subs: ['油船', '化学品船', 'LNG罐装甲板船', '一般干货船'] },
  { label: '挖泥船', value: 'dredger', icon: '⚓', subs: ['挖泥船', '浮吊船'] },
  { label: '浮船坞', value: 'dock', icon: '🏗️', subs: ['浮船坞'] },
  { label: '驳船', value: 'barge', icon: '⛵', subs: ['浮吊驳', '浮船坞', '驳船'] },
  { label: '海工', value: 'offshore', icon: '🔧', subs: ['海工船'] },
  { label: '拖轮', value: 'tug', icon: '🚤', subs: ['拖轮'] },
  { label: '客船', value: 'passenger', icon: '🛳️', subs: ['客船'] },
  { label: '沙船', value: 'sand', icon: '⛱️', subs: ['沙船'] },
  { label: '废钢船', value: 'scrap', icon: '♻️', subs: ['废钢船'] },
]

const selectedMainType = ref('')
const selectedSubType = ref('')
const selectedQuickFilter = ref('')

const currentSubCategories = computed(() => {
  const selected = mainCategories.find(c => c.value === selectedMainType.value)
  return selected ? selected.subs : []
})

// Filters
const searchKeyword = ref('')
const filters = ref({
  yearFrom: null,
  yearTo: null,
  shipClass: '',
  navigationArea: '',
  crane: '',
  draftMin: null,
  draftMax: null,
  dwtMin: null,
  dwtMax: null,
  capacityMin: null,
  capacityMax: null,
})

// Mock vessel data
const vessels = ref([
  { id: 1, name: '5.7万吨散货船 "OCEAN STAR"', type: '散货船', age: 8, dwt: '57,000', price: 3500, isFavorited: false },
  { id: 2, name: '集装箱船 "PACIFIC LINK"', type: '集装箱船', age: 5, dwt: '32,000', price: 6800, isFavorited: true },
  { id: 3, name: 'MR型成品油轮 "ENERGY FLOW"', type: '油船', age: 10, dwt: '49,900', price: 4200, isFavorited: false },
  { id: 4, name: '灵便型散货船 "GLOBAL TRADER"', type: '散货船', age: 6, dwt: '38,500', price: 2800, isFavorited: false },
  { id: 5, name: '8.2万吨散货船 "KAMSARMAX II"', type: '散货船', age: 3, dwt: '82,000', price: 11500, isFavorited: false },
  { id: 6, name: '支线集装箱船 "FEEDER EXPRESS"', type: '集装箱船', age: 12, dwt: '12,000', price: 1800, isFavorited: false },
  { id: 7, name: '大灵便型散货船 "SUNRISE"', type: '散货船', age: 7, dwt: '55,000', price: 4500, isFavorited: false },
  { id: 8, name: '化学品油轮 "CHEM STAR"', type: '油船', age: 9, dwt: '38,000', price: 3800, isFavorited: false },
  { id: 9, name: '巴拿马型散货船 "MEGA BULK"', type: '散货船', age: 4, dwt: '75,000', price: 9200, isFavorited: false },
  { id: 10, name: '集装箱船 "CONTAINER PRO"', type: '集装箱船', age: 6, dwt: '28,000', price: 5600, isFavorited: false },
  { id: 11, name: 'LNG运输船 "GREEN ENERGY"', type: '油船', age: 5, dwt: '65,000', price: 15000, isFavorited: false },
  { id: 12, name: '好望角型散货船 "CAPE STAR"', type: '散货船', age: 8, dwt: '180,000', price: 22000, isFavorited: false },
])

const filteredVessels = computed(() => {
  let result = vessels.value

  if (selectedSubType.value) {
    result = result.filter(v => v.type === selectedSubType.value)
  }

  if (selectedMainType.value) {
    result = result.filter(v => v.type.toLowerCase().includes(selectedMainType.value))
  }

  if (filters.value.yearFrom || filters.value.yearTo) {
    const currentYear = new Date().getFullYear()
    result = result.filter(v => {
      const buildYear = currentYear - v.age
      if (filters.value.yearFrom && buildYear < filters.value.yearFrom) return false
      if (filters.value.yearTo && buildYear > filters.value.yearTo) return false
      return true
    })
  }

  if (filters.value.dwtMin || filters.value.dwtMax) {
    result = result.filter(v => {
      const dwt = parseInt(v.dwt.replace(/,/g, ''))
      if (filters.value.dwtMin && dwt < filters.value.dwtMin) return false
      if (filters.value.dwtMax && dwt > filters.value.dwtMax) return false
      return true
    })
  }

  return result
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 9
const totalPages = computed(() => Math.ceil(filteredVessels.value.length / itemsPerPage))

const paginatedVessels = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredVessels.value.slice(start, end)
})

const changePage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 初始化 - 从URL参数中读取搜索关键词
const selectMainCategory = (value) => {
  if (selectedMainType.value === value) {
    selectedMainType.value = ''
    selectedSubType.value = ''
  } else {
    selectedMainType.value = value
    selectedSubType.value = ''
  }
  currentPage.value = 1
  console.log('选择主分类:', value)
}

const selectSubCategory = (sub) => {
  selectedSubType.value = selectedSubType.value === sub ? '' : sub
  currentPage.value = 1
  console.log('选择子类别:', sub)
}

const handleSearch = () => {
  currentPage.value = 1
  console.log('执行搜索:', filters.value)
}

const resetFilters = () => {
  selectedMainType.value = ''
  selectedSubType.value = ''
  filters.value = {
    yearFrom: null,
    yearTo: null,
    shipClass: '',
    navigationArea: '',
    crane: '',
    dwtMin: null,
    dwtMax: null
  }
  currentPage.value = 1
  console.log('[v0] 重置筛选')
}

const viewVesselDetail = (vesselId) => {
  console.log('[v0] 查看船舶详情:', vesselId)
  router.push(`/shipping-trade/vessel/${vesselId}`)
}

const toggleFavorite = (vesselId) => {
  const vessel = vessels.value.find(v => v.id === vesselId)
  if (vessel) {
    vessel.isFavorited = !vessel.isFavorited
  }
}

onMounted(() => {
  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword
  }
})
</script>

<style scoped>
.all-vessels-page {
  min-height: 100vh;
  background: #F8FAFC;
}

/* Banner Section */
.banner-section {
  height: 180px;
  background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%);
  position: relative;
  overflow: hidden;
}

.banner-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="rgba(255,255,255,0.1)" fill="none" stroke-width="2"/></svg>') repeat;
  opacity: 0.3;
}

.banner-overlay {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 2;
}

.banner-title {
  font-size: 40px;
  font-weight: 800;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  color: white;
}

/* Search Section */
.search-section {
  margin-top: -50px;
  position: relative;
  z-index: 10;
  padding: 0 24px 60px;
}

.search-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

/* Keyword Search Bar */
.keyword-search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.keyword-input {
  flex: 1;
  padding: 12px 16px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.keyword-input:focus {
  border-color: #1890FF;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.keyword-search-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #1890FF, #40a9ff);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.keyword-search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

/* Main Categories */
.main-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #F8FAFC;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s;
}

.category-btn:hover {
  border-color: #1890FF;
  background: #EFF6FF;
  transform: translateY(-2px);
}

.category-btn.active {
  background: linear-gradient(135deg, #1890FF, #0EA5E9);
  border-color: #1890FF;
  color: white;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.category-icon {
  font-size: 18px;
}

.category-label {
  font-size: 14px;
  font-weight: 600;
}

/* Sub-categories */
.sub-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
}

.sub-category-btn {
  padding: 8px 16px;
  background: white;
  border: 1.5px solid #CBD5E1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.25s;
}

.sub-category-btn:hover {
  border-color: #0EA5E9;
  color: #0EA5E9;
  transform: scale(1.05);
}

.sub-category-btn.active {
  background: linear-gradient(135deg, #0EA5E9, #06B6D4);
  border-color: #0EA5E9;
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 200px;
  opacity: 1;
  transform: translateY(0);
}

/* Compact Filters */
.compact-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.compact-input,
.compact-select {
  flex: 1;
  min-width: 140px;
  padding: 11px 14px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  color: #1E293B;
  background: white;
  transition: all 0.3s;
}

.compact-input::placeholder {
  color: #94A3B8;
}

.compact-input:hover,
.compact-select:hover {
  border-color: #CBD5E1;
}

.compact-input:focus,
.compact-select:focus {
  outline: none;
  border-color: #1890FF;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
}

.compact-reset,
.compact-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100px;
  justify-content: center;
}

.compact-reset {
  background: #F1F5F9;
  color: #64748B;
}

.compact-reset:hover {
  background: #E2E8F0;
  color: #475569;
}

.compact-search {
  background: linear-gradient(135deg, #F59E0B, #EF4444);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}

.compact-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
}

.compact-reset svg,
.compact-search svg {
  width: 16px;
  height: 16px;
}

/* Result Count */
.result-bar {
  padding-top: 16px;
  border-top: 1px solid #F1F5F9;
}

.result-text {
  font-size: 14px;
  color: #64748B;
}

.result-text strong {
  font-size: 18px;
  font-weight: 700;
  color: #1890FF;
  margin: 0 4px;
}

/* Results Section */
.results-section {
  padding: 0 24px 80px;
}

.results-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Vessel Cards Grid */
.vessel-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}

.vessel-ui-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  cursor: pointer;
}

.vessel-ui-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.image-box {
  height: 180px;
  position: relative;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.type-badge {
  position: absolute;
  left: 12px;
  bottom: 12px;
  background: rgba(15, 23, 42, 0.85);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.fav-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
}

.fav-btn.active {
  color: #EF4444;
}

.info-box {
  padding: 20px;
}

.info-box .name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sale-badge {
  display: inline-flex;
  padding: 3px 10px;
  background: linear-gradient(135deg, #2DD4BF, #1890FF);
  color: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.meta {
  font-size: 14px;
  color: #64748B;
  margin-bottom: 16px;
}

.divider {
  margin: 0 8px;
  color: #CBD5E1;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #F1F5F9;
}

.price .label {
  font-size: 12px;
  color: #94A3B8;
  display: block;
  margin-bottom: 4px;
}

.price .amount {
  font-size: 22px;
  font-weight: 800;
  color: #EF4444;
}

.price .amount small {
  font-size: 14px;
}

.detail-btn {
  padding: 8px 20px;
  border: 1.5px solid #1890FF;
  background: transparent;
  color: #1890FF;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.detail-btn:hover {
  background: #1890FF;
  color: white;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.page-btn {
  padding: 10px 24px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #1890FF;
  color: #1890FF;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
}
</style>

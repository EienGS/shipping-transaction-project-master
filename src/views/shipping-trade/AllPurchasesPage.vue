<template>
  <div class="all-purchases-page">
    <!-- Banner Section -->
    <section class="banner-section">
      <div class="banner-content">
        <h1 class="banner-title">求购需求中心</h1>
        <p class="banner-subtitle">精准匹配买家需求，快速对接交易意向</p>
      </div>
    </section>

    <!-- Compact Search Section -->
    <section class="search-section">
      <div class="search-container">
        <!-- Keyword Search Bar -->
        <div class="keyword-search-bar">
          <input v-model="searchKeyword" type="text" placeholder="搜索预算、航区、船型等..." class="keyword-input" @keyup.enter="handleSearch">
          <button class="keyword-search-btn" @click="handleSearch">搜索</button>
        </div>

        <!-- Main Ship Type Categories -->
        <div class="main-categories">
          <button v-for="type in mainCategories" :key="type.value" 
                  class="category-btn" 
                  :class="{ active: selectedMainType === type.value }"
                  @click="selectMainCategory(type.value)">
            <span class="category-icon">{{ type.icon }}</span>
            <span class="category-label">{{ type.label }}</span>
          </button>
        </div>

        <!-- Sub-categories (only show when main type selected) -->
        <transition name="slide-down">
          <div v-if="selectedMainType && currentSubCategories.length > 0" class="sub-categories">
            <button v-for="sub in currentSubCategories" :key="sub" 
                    class="sub-category-btn"
                    :class="{ active: selectedSubType === sub }"
                    @click="selectSubCategory(sub)">
              {{ sub }}
            </button>
          </div>
        </transition>

        <!-- Compact Filters -->
        <div class="compact-filters">
          <select v-model="filters.navigationArea" class="compact-select">
            <option value="">航区不限</option>
            <option value="unlimited">无限航区</option>
            <option value="coastal">国内近海</option>
            <option value="southeast">东南亚航线</option>
          </select>

          <input type="number" v-model.number="filters.yearFrom" placeholder="建造年份(起)" class="compact-input">
          <input type="number" v-model.number="filters.yearTo" placeholder="建造年份(止)" class="compact-input">

          <input type="number" v-model.number="filters.budgetMin" placeholder="预算(万元)最小" class="compact-input">
          <input type="number" v-model.number="filters.budgetMax" placeholder="预算(万元)最大" class="compact-input">

          <button class="compact-reset" @click="resetFilters" title="重置筛选">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21" stroke="currentColor" stroke-width="2"/>
              <path d="M3 16V12H7" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>

          <button class="compact-search" @click="handleSearch">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
            </svg>
            搜索需求
          </button>
        </div>

        <!-- Result Count -->
        <div class="result-bar">
          <span class="result-text">共 <strong>{{ filteredPurchases.length }}</strong> 条求购需求</span>
        </div>
      </div>
    </section>

    <!-- Purchase Demands Grid -->
    <section class="purchases-section">
      <div class="purchases-container">
        <div class="purchases-grid">
          <div v-for="purchase in paginatedPurchases" :key="purchase.id" 
               class="purchase-card"
               @click="viewPurchaseDetail(purchase.id)">
            <div class="card-header">
              <span class="purchase-badge">{{ purchase.type }}</span>
              <span class="publish-time">{{ purchase.publishTime }}</span>
            </div>
            
            <div class="card-body">
              <div class="info-row">
                <span class="label">航区:</span>
                <span class="value">{{ purchase.area }}</span>
              </div>
              <div class="info-row">
                <span class="label">船龄:</span>
                <span class="value">{{ purchase.buildYear }}</span>
              </div>
              <div class="info-row budget-row">
                <span class="label">预算:</span>
                <span class="budget-value">{{ purchase.budget }}</span>
              </div>
            </div>

            <button class="contact-btn" @click.stop="contactBuyer(purchase.id)">
              立即对接意向
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          
          <button v-for="page in displayPages" :key="page" 
                  class="page-btn"
                  :class="{ active: currentPage === page }"
                  @click="changePage(page)">
            {{ page }}
          </button>

          <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
const searchKeyword = ref('')

const currentSubCategories = computed(() => {
  const selected = mainCategories.find(c => c.value === selectedMainType.value)
  return selected ? selected.subs : []
})

// Filters
const filters = ref({
  navigationArea: '',
  yearFrom: null,
  yearTo: null,
  budgetMin: null,
  budgetMax: null,
})

// Mock purchase data
const purchases = ref([
  { id: 'GQ001', type: '散货船', area: '无限航区', buildYear: '2015-2023', budget: '3000-5000万', publishTime: '今天' },
  { id: 'GQ002', type: '油船', area: '国内近海', buildYear: '2018年以后', budget: '8000万以内', publishTime: '昨天' },
  { id: 'GQ003', type: '集装箱船', area: '东南亚航线', buildYear: '不限', budget: '2500-4000万', publishTime: '3天前' },
  { id: 'GQ004', type: '散货船', area: '无限航区', buildYear: '2016-2022', budget: '4000-6000万', publishTime: '今天' },
  { id: 'GQ005', type: '油船', area: '无限航区', buildYear: '2020年以后', budget: '1亿以内', publishTime: '2天前' },
  { id: 'GQ006', type: '杂货船', area: '国内近海', buildYear: '2015年以后', budget: '2000-3000万', publishTime: '4天前' },
  { id: 'GQ007', type: '散货船', area: '太平洋航线', buildYear: '2017-2023', budget: '5000-8000万', publishTime: '今天' },
  { id: 'GQ008', type: '集装箱船', area: '东南亚航线', buildYear: '2019年以后', budget: '6000-9000万', publishTime: '昨天' },
  { id: 'GQ009', type: '油船', area: '国内近海', buildYear: '2016-2022', budget: '3500-5500万', publishTime: '5天前' },
  { id: 'GQ010', type: '散货船', area: '无限航区', buildYear: '2018-2023', budget: '7000-10000万', publishTime: '今天' },
  { id: 'GQ011', type: '多用途船', area: '无限航区', buildYear: '2015年以后', budget: '4500-7000万', publishTime: '3天前' },
  { id: 'GQ012', type: '油船', area: '印度洋航线', buildYear: '2020年以后', budget: '9000万以内', publishTime: '2天前' },
])

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

// Actions
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
  console.log('选择子分类:', sub)
}

const filteredPurchases = computed(() => {
  let result = purchases.value

  // Filter by search keyword
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => 
      p.type.toLowerCase().includes(keyword) ||
      p.area.toLowerCase().includes(keyword) ||
      p.budget.toLowerCase().includes(keyword) ||
      p.buildYear.toLowerCase().includes(keyword)
    )
  }

  if (selectedSubType.value) {
    result = result.filter(p => p.type === selectedSubType.value)
  }

  if (filters.value.navigationArea) {
    result = result.filter(p => p.area.includes(filters.value.navigationArea))
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredPurchases.value.length / itemsPerPage))

const paginatedPurchases = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPurchases.value.slice(start, end)
})

const displayPages = computed(() => {
  const pages = []
  const maxDisplay = 5
  let start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + maxDisplay - 1)
  
  if (end - start < maxDisplay - 1) {
    start = Math.max(1, end - maxDisplay + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleSearch = () => {
  currentPage.value = 1
  console.log('执行搜索:', filters.value)
}

const resetFilters = () => {
  searchKeyword.value = ''
  selectedMainType.value = ''
  selectedSubType.value = ''
  filters.value = {
    navigationArea: '',
    yearFrom: null,
    yearTo: null,
    budgetMin: null,
    budgetMax: null,
  }
  currentPage.value = 1
  console.log('重置筛选')
}

const viewPurchaseDetail = (id) => {
  console.log('查看求购详情:', id)
  router.push(`/shipping-trade/purchase/${id}`)
}

const contactBuyer = (id) => {
  console.log('对接买家:', id)
}
</script>

<style scoped>
/* Banner Section */
.banner-section {
  background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%);
  padding: 60px 24px;
  text-align: center;
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
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M0 50 Q25 25 50 50 T100 50" stroke="white" stroke-width="0.5" fill="none" opacity="0.1"/></svg>');
  opacity: 0.1;
}

.banner-content {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.banner-title {
  font-size: 42px;
  font-weight: 800;
  color: white;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.banner-subtitle {
  font-size: 18px;
  color: rgba(255,255,255,0.9);
  font-weight: 400;
}

/* Search Section */
.search-section {
  padding: 32px 24px;
  background: #F8FAFC;
}

.search-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
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
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.keyword-search-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #0EA5E9, #06B6D4);
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
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
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
  border-color: #0EA5E9;
  background: #EFF6FF;
  transform: translateY(-2px);
}

.category-btn.active {
  background: linear-gradient(135deg, #0EA5E9, #06B6D4);
  border-color: #0EA5E9;
  color: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
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
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.08);
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
  background: linear-gradient(135deg, #0EA5E9, #06B6D4);
  color: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.35);
}

.compact-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.45);
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
  color: #0EA5E9;
  margin: 0 4px;
}

/* Purchases Section */
.purchases-section {
  padding: 32px 24px 60px;
  background: #F8FAFC;
}

.purchases-container {
  max-width: 1400px;
  margin: 0 auto;
}

.purchases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.purchase-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.3s;
}

.purchase-card:hover {
  border-color: #0EA5E9;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.15);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.purchase-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #0EA5E9, #06B6D4);
  color: white;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.publish-time {
  font-size: 12px;
  color: #94A3B8;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.label {
  color: #64748B;
  font-weight: 500;
  min-width: 50px;
}

.value {
  color: #1E293B;
  font-weight: 600;
}

.budget-row {
  padding-top: 8px;
  border-top: 1px solid #F1F5F9;
}

.budget-value {
  color: #0EA5E9;
  font-weight: 700;
  font-size: 16px;
}

.contact-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #F59E0B, #EF4444);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  background: white;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: #0EA5E9;
  color: #0EA5E9;
  background: #EFF6FF;
}

.page-btn.active {
  background: linear-gradient(135deg, #0EA5E9, #06B6D4);
  border-color: #0EA5E9;
  color: white;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn svg {
  width: 20px;
  height: 20px;
}
</style>

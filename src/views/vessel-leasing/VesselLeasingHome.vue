<template>
  <div class="vessel-trading-platform">
    <FloatingServiceMenu />
    <section class="hero-wrapper">
      <div class="hero-section">
        <img src="../../assets/vessel-trading-banner.png" alt="Shipping"
          class="hero-bg" />
        <div class="hero-overlay">
          <div class="hero-content">
            <h1 class="hero-title">航运交易</h1>
            <p class="hero-subtitle">精准匹配船源供需，让船舶流转更高效、更安心</p>

            <div class="hero-search-container">
              <div class="hero-search-glass">
                <div class="mode-dropdown-wrapper">
                  <button class="search-mode-btn" @click="toggleDropdown">
                    <span class="mode-text">{{ searchModeText }}</span>
                    <svg class="arrow-icon" :class="{ 'rotate': isDropdownOpen }" viewBox="0 0 24 24">
                      <path d="M7 10l5 5 5-5" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  
                  <transition name="fade-slide">
                    <div v-show="isDropdownOpen" class="dropdown-menu" @mouseenter="keepOpen" @mouseleave="closeDropdown">
                      <div class="dropdown-item" :class="{ active: searchMode === 'buy' }" @click="selectMode('buy')">买船</div>
                      <div class="dropdown-item" :class="{ active: searchMode === 'sell' }" @click="selectMode('sell')">卖船</div>
                    </div>
                  </transition>
                </div>

                <input v-model="searchKeyword" type="text" placeholder="请输入船龄、船舶类型、载重吨等关键词搜索"
                  @keyup.enter="handleSearch" />
                <button class="search-confirm-btn" @click="handleSearch">
                  <svg class="icon" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" fill="none"
                      stroke-width="2" />
                  </svg>
                  搜索
                </button>
              </div>
            </div>

            <div class="hero-action-group">
              <button class="action-btn outline" @click="goToBuyVessel">我要买船 (发布求购)</button>
              <button class="action-btn primary" @click="goToSellVessel">我要卖船 (发布出售)</button>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-wrapper">
        <div class="dashboard-container">
          <div class="dashboard-header">
            <span class="title">市场成交概览</span>
            <span class="more">数据更新于 10:00 <i class="refresh-icon">↺</i></span>
          </div>
          <div class="dashboard-grid">
            <div class="stat-card">
              <div class="stat-main">
                <label>今日成交数</label>
                <div class="value teal">12</div>
              </div>
              <svg class="sparkline" viewBox="0 0 100 30">
                <path d="M0 25 Q 25 5, 50 15 T 100 10" stroke="#2DD4BF" fill="none" stroke-width="2" />
              </svg>
            </div>
            <div class="stat-card">
              <div class="stat-main">
                <label>本月成交额</label>
                <div class="value blue">5.8<small>亿</small></div>
              </div>
              <svg class="sparkline" viewBox="0 0 100 30">
                <path d="M0 20 Q 20 25, 40 10 T 100 5" stroke="#3B82F6" fill="none" stroke-width="2" />
              </svg>
            </div>
            <div class="stat-card">
              <div class="stat-main">
                <label>平均成交周期</label>
                <div class="value teal">44<small>天</small></div>
              </div>
              <svg class="sparkline" viewBox="0 0 100 30">
                <path d="M0 15 Q 40 5, 70 20 T 100 15" stroke="#2DD4BF" fill="none" stroke-width="2" />
              </svg>
            </div>
          </div>

        </div>
        <div class="recent-deals-compact">
          <div class="deals-scroll-container">
            <div v-for="deal in recentDeals" :key="deal.id" class="compact-deal-card">
              <img :src="`https://picsum.photos/seed/deal${deal.id}/160/90`" alt="vessel" class="compact-deal-img">
              <div class="compact-deal-info">
                <div class="compact-deal-dwt-type">{{ deal.dwt || '5.7万吨' }} · {{ deal.type }}</div>
                <div class="compact-deal-price">成交金额： ¥{{ deal.price }}万元</div>
                <div class="compact-deal-date">成交日期：{{ deal.dealDate }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="content-container">
      <div class="layout-grid">
        <section class="vessel-list-section">
          <div class="section-top-bar">
            <div class="section-title-group">
              <h2 class="section-heading">在售船舶</h2>
              <button class="filter-toggle-btn" @click="showVesselFilter = !showVesselFilter">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M6 12h12M9 18h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              
              <div v-if="showVesselFilter" class="filter-popup-overlay" @click="showVesselFilter = false"></div>
              <transition name="filter-popup">
                <div v-if="showVesselFilter" class="filter-popup-card" @click.stop>
                  <div class="filter-compact-body">
                    <div class="filter-item">
                      <label>船舶类型</label>
                      <select v-model="vesselType" @change="applyFilters">
                        <option value="">全部类型</option>
                        <option value="散货船">散货船</option>
                        <option value="油船">油船</option>
                        <option value="集装箱船">集装箱船</option>
                      </select>
                    </div>

                    <div class="filter-item">
                      <label>船龄 {{ ageRange.min }}-{{ ageRange.max }}年</label>
                      <div class="dual-range">
                        <input type="range" v-model.number="ageRange.min" min="0" max="30" @input="applyFilters">
                        <input type="range" v-model.number="ageRange.max" min="0" max="30" @input="applyFilters">
                      </div>
                    </div>

                    <div class="filter-item">
                      <label>载重吨</label>
                      <div class="range-inputs-stacked">
                        <input type="number" v-model.number="dwtRange.min" placeholder="最小载重吨" @change="applyFilters">
                        <input type="number" v-model.number="dwtRange.max" placeholder="最大载重吨" @change="applyFilters">
                      </div>
                    </div>

                    <div class="filter-actions">
                      <button class="btn-reset" @click="resetFilters">重置</button>
                      <button class="btn-apply" @click="showVesselFilter = false">应用</button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
            <a href="#" class="view-all-btn" @click.prevent="viewAllVessels">查看全部</a>
          </div>

          <div class="simple-filters" v-show="false">
            <select v-model="vesselType" class="simple-select" @change="applyFilters">
              <option value="">船舶类型</option>
              <option value="散货船">散货船</option>
              <option value="油船">油船</option>
              <option value="集装箱船">集装箱船</option>
            </select>

            <div class="age-filter">
              <span class="filter-value">{{ ageRange.min }}-{{ ageRange.max }}年船龄</span>
              <div class="slider-popup">
                <input type="range" v-model.number="ageRange.min" min="0" max="30" @input="applyFilters">
                <input type="range" v-model.number="ageRange.max" min="0" max="30" @input="applyFilters">
              </div>
            </div>

            <input type="number" v-model.number="dwtRange.min" placeholder="最小载重吨" class="simple-input" @change="applyFilters">
            <input type="number" v-model.number="dwtRange.max" placeholder="最大载重吨" class="simple-input" @change="applyFilters">

            <button class="simple-reset" @click="resetFilters">重置筛选</button>
          </div>

          <div class="vessel-cards-grid">
            <div v-for="v in filteredVessels" :key="v.id" class="vessel-ui-card" @click="viewVesselDetail(v.id)">
              <div class="image-box">
                <img :src="`https://picsum.photos/seed/${v.id}/400/260`" alt="vessel">
                <div class="type-badge">{{ v.type }}</div>
                <button class="fav-btn" :class="{ active: v.isFavorited }" @click.stop="toggleFavorite(v.id)">❤</button>
              </div>
              <div class="info-box">
                <h3 class="name">
                  <span class="sale-badge">在售</span>
                  {{ v.name }}
                </h3>
                <div class="meta">
                  <span>{{ v.age }}年船龄</span>
                  <span class="divider">|</span>
                  <span>{{ v.dwt }} DWT</span>
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

          <div class="pagination-ui">
            <button class="p-btn">&lt;</button>
            <button class="p-btn active">1</button>
            <button class="p-btn">2</button>
            <button class="p-btn">3</button>
            <span class="p-dots">...</span>
            <button class="p-btn">&gt;</button>
          </div>
        </section>

        <aside class="sidebar-section">
          <div class="purchase-box">
            <div class="sidebar-head">
              <div class="sidebar-title-group">
                <h3>最新求购需求</h3>
                <button class="filter-toggle-btn small" @click="showPurchaseFilter = !showPurchaseFilter">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M6 12h12M9 18h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                
                <div v-if="showPurchaseFilter" class="filter-popup-overlay" @click="showPurchaseFilter = false"></div>
                <transition name="filter-popup">
                  <div v-if="showPurchaseFilter" class="filter-popup-card purchase-filter" @click.stop>
                    <div class="filter-compact-body">
                      <div class="filter-item">
                        <label>船舶类型</label>
                        <select v-model="purchaseFilters.type">
                          <option value="">全部类型</option>
                          <option value="散货船">散货船</option>
                          <option value="油船">油船</option>
                          <option value="集装箱船">集装箱船</option>
                        </select>
                      </div>

                      <div class="filter-item">
                        <label>航区</label>
                        <select v-model="purchaseFilters.area">
                          <option value="">全部航区</option>
                          <option value="无限航区">无限航区</option>
                          <option value="国内近海">国内近海</option>
                          <option value="东南亚航线">东南亚航线</option>
                        </select>
                      </div>

                      <div class="filter-item">
                        <label>预算(万元)</label>
                        <div class="range-inputs-stacked">
                          <input type="number" v-model.number="purchaseFilters.budgetMin" placeholder="最小预算">
                          <input type="number" v-model.number="purchaseFilters.budgetMax" placeholder="最大预算">
                        </div>
                      </div>

                      <div class="filter-actions">
                        <button class="btn-reset" @click="resetPurchaseFilters">重置</button>
                        <button class="btn-apply" @click="showPurchaseFilter = false">应用</button>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              <a href="#" class="view-all-btn" @click.prevent="viewAllPurchases">查看全部</a>
            </div>

            <div class="purchase-list">
              <div v-for="p in purchaseRequests" :key="p.id" class="purchase-row" @click="viewPurchaseDetail(p.id)">
                <div class="row-top">
                  <span class="p-badge">{{ p.type }}</span>
                  <span class="p-time">{{ p.publishTime }}</span>
                </div>
                <div class="row-middle">
                  <p>航区：{{ p.area }}</p>
                  <p>船龄：{{ p.buildYear }}</p>
                  <p class="budget">预算：<span>{{ p.budget }}</span></p>
                </div>
                <button class="contact-btn" @click.stop="openIntentionDialog(p.id)">立即对接意向</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
    <!-- Intention Dialog -->
    <IntentionDialog 
      v-model="isIntentionDialogOpen"
      :vessel-id="selectedDemandId"
      @submit="handleIntentionSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import FloatingServiceMenu from '../../components/FloatingServiceMenu.vue'
import IntentionDialog from '../../components/IntentionDialog.vue'

const router = useRouter()

// Intention Dialog state
const isIntentionDialogOpen = ref(false)
const selectedDemandId = ref('')

const searchKeyword = ref('')
const activeFilter = ref('')
const searchMode = ref('buy') // 默认为'buy' (买船)
const isDropdownOpen = ref(false)
let hideTimeout = null

// 高级筛选条件
const vesselType = ref('')
const ageRange = ref({ min: 0, max: 30 })
const dwtRange = ref({ min: null, max: null })

// 筛选弹窗显示状态
const showVesselFilter = ref(false)
const showPurchaseFilter = ref(false)

// 求购筛选条件
const purchaseFilters = ref({
  type: '',
  area: '',
  budgetMin: null,
  budgetMax: null
})

const forSaleVessels = ref([
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
  { id: 12, name: '好望角型散货船 "CAPE STAR"', type: '散货船', age: 8, dwt: '180,000', price: 22000, isFavorited: false }
])

const recentDeals = ref([
  { id: 1, vesselName: '远航5号散货船', type: '散货船', price: 4500, dealDate: '2024-01-15', buyer: '远洋集团' },
  { id: 2, vesselName: '海运208集装箱船', type: '集装箱船', price: 7200, dealDate: '2024-01-12', buyer: '环球航运' },
  { id: 3, vesselName: '龙腾油轮', type: '油船', price: 3800, dealDate: '2024-01-10', buyer: '中海油运' },
  { id: 4, name: '鑫源散货船', type: '散货船', price: 2900, dealDate: '2024-01-08', buyer: '华鑫船务' }
])

const purchaseRequests = ref([
  { id: 'GQ1', type: '散货船', area: '无限航区', buildYear: '2015-2023', budget: '3000-5000万', publishTime: '今天' },
  { id: 'GQ2', type: '油船', area: '国内近海', buildYear: '2018年以后', budget: '8000万以内', publishTime: '昨天' },
  { id: 'GQ3', type: '集装箱船', area: '东南亚航线', buildYear: '不限', budget: '2500-4000万', publishTime: '3天前' }
])

const filteredVessels = computed(() => {
  let vessels = forSaleVessels.value

  // 按船舶类型筛选
  if (vesselType.value) {
    vessels = vessels.filter(v => v.type === vesselType.value)
  }

  // 按船龄筛选
  vessels = vessels.filter(v => v.age >= ageRange.value.min && v.age <= ageRange.value.max)

  // 按载重吨筛选
  if (dwtRange.value.min !== null) {
    vessels = vessels.filter(v => {
      const dwt = Number.parseInt(v.dwt.replace(/,/g, ''))
      return dwt >= dwtRange.value.min
    })
  }
  if (dwtRange.value.max !== null) {
    vessels = vessels.filter(v => {
      const dwt = Number.parseInt(v.dwt.replace(/,/g, ''))
      return dwt <= dwtRange.value.max
    })
  }

  return vessels
})

// 自动刷新最新成交数据
let refreshTimer = null
const refreshDeals = () => {
  console.log('刷新最新成交数据')
  const firstDeal = recentDeals.value.shift()
  if (firstDeal) {
    recentDeals.value.push({
      ...firstDeal,
      id: Date.now(),
      dealDate: new Date().toISOString().split('T')[0]
    })
  }
}

const searchModeText = computed(() => {
  return searchMode.value === 'buy' ? '买船' : '卖船'
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  // 清除任何现有的超时设置
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
}

const keepOpen = () => {
  // 当鼠标进入下拉菜单时，取消隐藏计时器
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
}

const closeDropdown = () => {
  // 设置一个短暂的延时来隐藏下拉菜单
  hideTimeout = setTimeout(() => {
    isDropdownOpen.value = false
  }, 200) // 200ms 延时，让用户有时间移动鼠标
}

const selectMode = (mode) => {
  searchMode.value = mode
  isDropdownOpen.value = false
  console.log('搜索模式切换为:', searchModeText.value)
}

const handleSearch = () => {
  console.log('[v0] 搜索关键词:', searchKeyword.value, '模式:', searchMode.value)
  
  if (searchMode.value === 'buy') {
    // 跳转到求购需求相关页面
    router.push(`/shipping-trade/purchase-demands?keyword=${searchKeyword.value}`)
  } else if (searchMode.value === 'sell') {
    // 跳转到在售船舶列表
    router.push(`/shipping-trade/all-vessels?keyword=${searchKeyword.value}`)
  }
}

const setFilter = (val) => {
  activeFilter.value = val
  console.log('筛选类型:', val || '全部')
}

const toggleFavorite = (id) => {
  const v = forSaleVessels.value.find(item => item.id === id)
  if (v) {
    v.isFavorited = !v.isFavorited
    console.log('收藏状态:', v.name, v.isFavorited)
  }
}

const viewVesselDetail = (id) => {
  console.log('查看船舶详情 ID:', id)
  router.push(`/shipping-trade/vessel/${id}`)
}

const goToBuyVessel = () => {
  console.log('跳转到发布求购页面')
  router.push('/shipping-trade/buy-vessel')
}

const goToSellVessel = () => {
  console.log('跳转到发布出售页面')
  router.push('/shipping-trade/sell-vessel')
}

const applyVerification = () => {
  console.log('申请交易鉴证')
}

const viewAllPurchases = () => {
  console.log('查看全部求购需求')
  router.push('/shipping-trade/all-purchases')
}

const viewPurchaseDetail = (id) => {
  console.log('查看求购详情:', id)
  router.push(`/shipping-trade/purchase/${id}`)
}

const contactBuyer = (id) => {
  console.log('对接买家:', id)
}

const applyFilters = () => {
  console.log('应用筛选条件:', {
    vesselType: vesselType.value,
    ageRange: ageRange.value,
    dwtRange: dwtRange.value
  })
}

const resetFilters = () => {
  vesselType.value = ''
  ageRange.value = { min: 0, max: 30 }
  dwtRange.value = { min: null, max: null }
  console.log('筛选条件已重置')
}

const viewAllVessels = () => {
  console.log('[v0] 查看全部在售船舶')
  router.push('/shipping-trade/all-vessels')
}

const openIntentionDialog = (id) => {
  selectedDemandId.value = id
  isIntentionDialogOpen.value = true
}

const handleIntentionSubmit = (intentionData) => {
  console.log('[v0] 提交意向信息:', {
    demandId: selectedDemandId.value,
    ...intentionData
  })
  // 这里可以添加API调用，保存用户的意向信息
}

const resetPurchaseFilters = () => {
  purchaseFilters.value = {
    type: '',
    area: '',
    budgetMin: null,
    budgetMax: null
  }
  console.log('[v0] 重置求购筛选')
}

onMounted(() => {
  refreshTimer = setInterval(refreshDeals, 10000)
  console.log('已启动自动刷新，间隔10秒')
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    console.log('已清除自动刷新定时器')
  }
})
</script>

<style scoped>
/* 全局变量 */
.vessel-trading-platform {
  --primary: #3B82F6;
  --teal: #2DD4BF;
  --dark-bg: #0F172A;
  --dark-card: #1E293B;
  --text-main: #1E293B;
  --text-light: #64748B;
  background-color: #F8FAFC;
  min-height: 100vh;
}

/* 1. Hero Section 优化 */
.hero-section {
  position: relative;
  height: 600px;
  overflow: hidden;
  background: var(--dark-bg);
}

.hero-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, transparent 0%, rgba(15, 23, 42, 0.8) 100%);
}

.hero-content {
  text-align: center;
  color: white;
  width: 100%;
  max-width: 800px;
  padding: 0 20px;
  margin-top: -60px;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -1px;
  color: #fff;
}

.hero-subtitle {
  font-size: 20px;
  opacity: 0.8;
  margin-bottom: 48px;
}

/* 搜索框玻璃拟态 */
.hero-search-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  padding: 8px;
  display: flex;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  margin-bottom: 32px;
}

/* 改造后的下拉框样式 */
.mode-dropdown-wrapper {
  position: relative;
  margin-right: 8px;
}

.search-mode-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 90px;
  height: 100%;
  padding: 0 16px;
  border-radius: 100px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-mode-btn:hover {
  filter: brightness(1.1);
}

.search-mode-btn .mode-text {
  font-size: 15px;
  font-weight: 600;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
  margin-left: 4px;
}

.arrow-icon.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  width: 100%;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  z-index: 100;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.dropdown-item {
  padding: 12px 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.dropdown-item.active {
  color: var(--teal);
  font-weight: 600;
}

/* 下拉动画 */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.hero-search-glass input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0 24px;
  color: white;
  font-size: 16px;
  outline: none;
}

.hero-search-glass input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-confirm-btn {
  background: linear-gradient(90deg, var(--teal), var(--primary));
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 100px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.hero-action-group {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.action-btn {
  padding: 14px 36px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
}

.action-btn.primary {
  background: linear-gradient(90deg, var(--teal), var(--primary));;
  color: white;
  border: none;
  border-radius: 100px;
}

.action-btn.outline {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 100px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 2. Dashboard 优化 */
.dashboard-wrapper {
  margin-top: -80px;
  position: relative;
  z-index: 10;
  padding: 0 24px;
}

.dashboard-container {
  max-width: 1300px;
  margin: 0 auto;
  background: var(--dark-card);
  border-radius: 24px;
  padding: 32px;
  color: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.dashboard-header .title {
  font-size: 20px;
  font-weight: 700;
}

.dashboard-header .more {
  color: #94A3B8;
  font-size: 14px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-main label {
  font-size: 14px;
  color: #94A3B8;
  display: block;
  margin-bottom: 8px;
}

.stat-main .value {
  font-size: 32px;
  font-weight: 800;
}

.stat-main .value.teal {
  color: var(--teal);
}

.stat-main .value.blue {
  color: var(--primary);
}

.stat-main .value small {
  font-size: 16px;
  margin-left: 4px;
}

.sparkline {
  width: 100px;
  height: 40px;
}

.recent-deals-compact {
  margin-top: 20px;
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
}

/* 在售船舶标题栏 */
.section-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-heading {
  font-size: 24px;
  font-weight: 700;
  color: var(--dark-bg);
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative; /* 确保子项卡片相对于此定位 */
}

.filter-toggle-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: linear-gradient(135deg, #F8FAFC, #EFF6FF);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.filter-toggle-btn.small {
  width: 28px;
  height: 28px;
}

.filter-toggle-btn svg {
  width: 18px;
  height: 18px;
  color: #64748B;
  transition: all 0.3s;
}

.filter-toggle-btn:hover {
  background: linear-gradient(135deg, var(--primary), var(--teal));
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.25);
}

.filter-toggle-btn:hover svg {
  color: white;
}

/* Filter Popup Overlay */
.filter-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99; /* 放在底层处理点击逻辑 */
}

/* Filter Popup Card 核心修复部分 */
.filter-popup-card {
  position: absolute; /* 相对于 .section-title-group 定位 */
  top: 0;
  left: 100%; /* 出现在容器最右侧 */
  margin-left: 10px; /* 与按钮保持一点距离 */
  width: 260px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 100;
  border: 1px solid #E2E8F0;
}

.purchase-filter {
  top: 0;
  left: 100%;
  width: 240px;
}

.filter-compact-body {
  padding: 16px;
}

.filter-item {
  margin-bottom: 14px;
}

.filter-item:last-child {
  margin-bottom: 0;
}

.filter-item label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  margin-bottom: 6px;
}

.filter-item select {
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
  font-size: 13px;
  color: #1E293B;
  background: white;
  transition: all 0.3s;
}

.filter-item select:focus {
  outline: none;
  border-color: var(--primary);
}

.dual-range {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dual-range input[type="range"] {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #E2E8F0;
  outline: none;
  -webkit-appearance: none;
}

.dual-range input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}

.dual-range input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: none;
}

.range-inputs-compact {
  display: flex;
  align-items: center;
  gap: 6px;
}

.range-inputs-compact input {
  flex: 1;
  padding: 6px 8px;
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
  font-size: 12px;
  color: #1E293B;
  background: white;
  transition: all 0.3s;
}

.range-inputs-compact input:focus {
  outline: none;
  border-color: var(--primary);
}

.range-inputs-compact span {
  color: #94A3B8;
  font-size: 12px;
}

.range-inputs-stacked {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.range-inputs-stacked input {
  width: 100%;
  padding: 6px 8px;
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
  font-size: 12px;
  color: #1E293B;
}

.range-inputs-stacked input:focus {
  outline: none;
  border-color: var(--primary);
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #F1F5F9;
}

.btn-reset,
.btn-apply {
  flex: 1;
  padding: 7px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-reset {
  background: #F8FAFC;
  color: #64748B;
}

.btn-reset:hover {
  background: #E2E8F0;
}

.btn-apply {
  background: linear-gradient(135deg, var(--primary), var(--teal));
  color: white;
}

.btn-apply:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

/* Filter Popup Animation */
.filter-popup-enter-active,
.filter-popup-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-popup-enter-from {
  opacity: 0;
  transform: translateX(-10px) scale(0.95);
}

.filter-popup-leave-to {
  opacity: 0;
  transform: translateX(-10px) scale(0.95);
}

.filter-popup-enter-to,
.filter-popup-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.view-all-btn {
  padding: 8px 20px;
  color: var(--primary);
  border: 1.5px solid var(--primary);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.view-all-btn:hover {
  background: var(--primary);
  color: white;
}

/* 简约筛选区域 */
.simple-filters {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
}

.simple-select,
.simple-input {
  padding: 10px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-dark);
  background: white;
  transition: border-color 0.3s;
}

.simple-select {
  min-width: 140px;
  cursor: pointer;
}

.simple-input {
  width: 160px;
}

.simple-select:hover,
.simple-input:hover {
  border-color: #CBD5E1;
}

.simple-select:focus,
.simple-input:focus {
  outline: none;
  border-color: var(--primary);
}

.age-filter {
  position: relative;
  padding: 10px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 140px;
}

.age-filter:hover {
  border-color: var(--primary);
}

.filter-value {
  font-size: 14px;
  color: var(--text-dark);
}

.slider-popup {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 10;
  min-width: 200px;
}

.age-filter:hover .slider-popup {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slider-popup input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #E5E7EB;
  outline: none;
  -webkit-appearance: none;
}

.slider-popup input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}

.slider-popup input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: none;
}

.simple-reset {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #F1F5F9;
  color: var(--text-dark);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.simple-reset:hover {
  background: #E2E8F0;
}

.deals-scroll-container {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0 32px 8px;
  justify-content: center;
}

.deals-scroll-container::-webkit-scrollbar {
  height: 4px;
}

.deals-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.compact-deal-card {
  flex-shrink: 0;
  width: 280px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.compact-deal-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.compact-deal-img {
  width: 80px;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 10px;
}

.compact-deal-info {
  padding: 8px;
  flex: 1;
}

.compact-deal-dwt-type {
  font-size: 12px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compact-deal-price {
  font-size: 11px;
  color: rgba(0,0,0,0.7);
}
.compact-deal-date {
  font-size: 11px;
  color: rgba(0,0,0,0.7);
}

/* 3. Main Content 布局 */
.content-container {
  max-width: 1400px;
  margin: 60px auto;
  padding: 0 24px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
}

/* 船舶卡片优化 */
.vessel-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.vessel-ui-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: 0.3s;
  cursor: pointer;
}

.vessel-ui-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
}

.image-box {
  height: 160px;
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
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  backdrop-filter: blur(4px);
}

.fav-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
}

.fav-btn.active {
  color: #EF4444;
}

.info-box {
  padding: 16px;
}

.info-box .name {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--dark-bg);
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sale-badge {
  display: inline-flex;
  padding: 2px 8px;
  background: linear-gradient(135deg, var(--teal), var(--primary));
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.info-box .meta {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 16px;
}

.divider {
  margin: 0 8px;
  color: #E2E8F0;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #F1F5F9;
  padding-top: 16px;
}

.price .label {
  font-size: 11px;
  color: var(--text-light);
  display: block;
  margin-bottom: 2px;
}

.price .amount {
  font-size: 18px;
  font-weight: 800;
  color: #EF4444;
}

.price .amount small {
  font-size: 12px;
  margin-left: 2px;
}

.detail-btn {
  border: 1.5px solid var(--primary);
  color: var(--primary);
  background: transparent;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
}

.detail-btn:hover {
  background: var(--primary);
  color: white;
}

/* 侧边栏优化 */
.sidebar-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.sidebar-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative; /* 核心修复：确保弹窗相对于标题组定位 */
}

.sidebar-head h3 {
  font-size: 18px;
  font-weight: 700;
}

.purchase-row {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #F1F5F9;
  transition: 0.3s;
  cursor: pointer;
}

.purchase-row:hover {
  border-color: var(--primary);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
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

.pagination-ui {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
}

.p-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #E2E8F0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.icon {
  width: 20px;
  height: 20px;
}
</style>

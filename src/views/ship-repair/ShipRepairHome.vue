<template>
  <div class="ship-repair-home">
    <section class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">船舶设计、建造、维修一站式服务平台</h1>
      </div>

      <div class="operation-glass-panel">
        <div class="operation-container">
          <div class="search-bar-wrapper">
            <div class="search-bar">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" />
              </svg>
              <input v-model="searchKeyword" type="text" placeholder="输入服务方/服务类型/船舶类型/关键词搜索..." class="search-input"
                @keyup.enter="handleSearch">
              <button class="search-btn-inner" @click="handleSearch">
                搜索
              </button>
            </div>
          </div>

          <div class="action-buttons">
            <button class="action-btn design-btn" @click="publishDemand('design')">
              <span class="btn-icon">🎨</span> 发布设计需求
            </button>
            <button class="action-btn build-btn" @click="publishDemand('build')">
              <span class="btn-icon">🏗️</span> 发布造船需求
            </button>
            <button class="action-btn repair-btn" @click="publishDemand('repair')">
              <span class="btn-icon">🔧</span> 发布维修需求
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="tabs-section">
      <div class="service-type-tabs">
        <div v-for="type in serviceTypes" :key="type.value" class="tab-item"
          :class="{ active: activeServiceType === type.value }" @click="switchServiceType(type.value)">
          {{ type.label }}
          <div class="tab-underline" v-if="activeServiceType === type.value"></div>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="content-container">
        <div class="left-panel">
          <div class="panel-header">
            <h2 class="panel-title">优质{{ currentServiceTitle }}推荐</h2>
            <div class="filter-bar">
              <select v-model="providerFilters.location" class="filter-select plain">
                <option value="">地区选择</option>
                <option value="jiangsu">江苏</option>
                <option value="zhejiang">浙江</option>
              </select>
              <select v-model="providerFilters.rating" class="filter-select plain">
                <option value="">综合排序</option>
                <option value="5">口碑优先</option>
              </select>
            </div>
          </div>

          <div class="provider-grid">
            <div v-for="provider in filteredProviders" :key="provider.id" class="provider-card-modern"
              @click="viewProviderDetail(provider.id)">
              <div class="card-image-wrapper">
                <img :src="provider.cover" :alt="provider.name" class="provider-cover">
                <div class="verified-badge" v-if="provider.verified">Verified</div>
              </div>
              <div class="provider-info-body">
                <div class="provider-main">
                  <h3 class="provider-name">{{ provider.name }}</h3>
                  <p class="provider-direction">设计方向：{{ provider.direction }}</p>
                  <p class="provider-established">成立年限：{{ provider.established }}</p>
                </div>
                <div class="provider-meta-row">
                  <span class="meta-location">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                      <path fill-rule="evenodd"
                        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                        clip-rule="evenodd" />
                    </svg>
                    {{ provider.location }}
                  </span>
                  <span class="meta-rating">⭐️ {{ provider.rating }}分</span>
                </div>
                <div class="card-actions">
                  <button class="btn-view-detail-outline" @click.stop="viewProviderDetail(provider.id)">查看详情</button>
                  <button class="btn-icon-favorite" @click.stop="toggleFavorite(provider.id)">
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

        <div class="right-panel">
          <div class="panel-header">
            <h2 class="panel-title">最新{{ currentDemandTitle }}</h2>
            <div class="filter-bar">
              <select v-model="demandFilters.shipType" class="filter-select plain">
                <option value="">筛选类型</option>
                <option value="bulk">散货船</option>
                <option value="tanker">油船</option>
              </select>
              <select v-model="demandFilters.urgency" class="filter-select plain">
                <option value="">连接意向</option>
                <option value="urgent">紧急</option>
              </select>
            </div>
          </div>

          <div class="demand-list-modern">
            <div v-for="demand in filteredDemands" :key="demand.id" class="demand-strip"
              @click="viewDemandDetail(demand.id)">
              <div class="demand-strip-content">
                <div class="demand-main-info">
                  <h3 class="demand-strip-title">
                    <span class="demand-code-prefix">[No.{{ demand.code.substring(1, 5) }}...]</span>
                    {{ demand.titlePrefix }}
                    <span class="highlight-tag blue" v-if="demand.capacity">{{ demand.capacity }}</span>
                    {{ demand.titleSuffix }}
                  </h3>
                  <div class="demand-sub-details">
                    <span>预算：{{ demand.budget }}</span>
                    <span class="separator">|</span>
                    <span>交付：{{ demand.deliverTime }}</span>
                    <span class="separator" v-if="demand.location">|</span>
                    <span v-if="demand.location">地区：{{ demand.location }}</span>
                  </div>
                </div>
                <div class="demand-strip-actions">
                  <span class="time-ago">{{ demand.timeAgo }}</span>
                  <button class="btn-contact-cyan" @click.stop="contactDemand(demand.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path
                        d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                    对接意向
                  </button>
                </div>
              </div>
            </div>
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

// 服务类型 - 移除Icon，设计图中Tab不再需要Icon
const serviceTypes = [
  { label: '船舶设计', value: 'design' },
  { label: '船舶建造', value: 'build' },
  { label: '船舶维修', value: 'repair' },
]

// 默认选中设计视图以匹配当前任务
const activeServiceType = ref('design')
const searchKeyword = ref('')

// 筛选条件 (简化以匹配视觉稿)
const providerFilters = ref({
  location: '',
  rating: '',
})

const demandFilters = ref({
  urgency: '',
  shipType: '',
})


// 模拟数据 - 为了匹配设计图，增加了一些字段
// 增加 verified 字段
const providers = ref([
  {
    id: 3,
    type: 'design',
    name: '海洋船舶设计研究院',
    direction: '新建船/改装船/节能设计',
    established: '成立15年',
    rating: 4.8,
    location: '江苏·无锡',
    cases: 128,
    verified: true, // 新增认证标识
    cover: 'https://picsum.photos/seed/design1/400/260' // 使用更宽的图片比例
  },
  {
    id: 5,
    type: 'design',
    name: '船舶工艺设计院',
    direction: '智能船舶/绿色船舶设计',
    established: '成立12年',
    rating: 4.8,
    location: '上海',
    cases: 128,
    verified: true,
    cover: 'https://picsum.photos/seed/design2/400/260'
  },
  {
    id: 6,
    type: 'design',
    name: '高端船舶设计中心',
    direction: '豪华邮轮/特种船舶设计',
    established: '成立10年',
    rating: 4.9,
    location: '广东·广州',
    cases: 150,
    verified: true,
    cover: 'https://picsum.photos/seed/design3/400/260'
  },
  {
    id: 7,
    type: 'build',
    name: 'XX重工造船有限公司',
    capability: '最大建造10万吨级 | 散货船/集装箱船特长',
    rating: 4.8,
    location: '江苏·南通',
    cases: 128,
    verified: true, // 新增认证标识
    cover: 'https://picsum.photos/seed/shipyard1/400/260' // 使用更宽的图片比例
  },
  {
    id: 8,
    type: 'build',
    name: '中船集团造船厂',
    capability: '最大建造30万吨级 | 油船/散货船专家',
    rating: 4.9,
    location: '辽宁·大连',
    cases: 210,
    verified: true,
    cover: 'https://picsum.photos/seed/shipyard2/400/260'
  },
  {
    id: 9,
    type: 'build',
    name: '江南造船厂',
    capability: '最大建造15万吨级 | LNG船/化学品船特长',
    rating: 4.7,
    location: '上海',
    cases: 95,
    verified: true,
    cover: 'https://picsum.photos/seed/shipyard3/400/260'
  },
  {
    id: 10,
    type: 'repair',
    name: 'XX船舶修理有限公司',
    capability: '干船坞修理 | 海洋工程支持',
    rating: 4.6,
    location: '浙江·舟山',
    cases: 87,
    verified: true,
    cover: 'https://picsum.photos/seed/repair1/400/260'
  },
  {
    id: 11,
    type: 'repair',
    name: '青岛海西湾修船厂',
    capability: '大型船舶维修 | 海洋平台维护',
    rating: 4.7,
    location: '山东·青岛',
    cases: 105,
    verified: true,
    cover: 'https://picsum.photos/seed/repair2/400/260'
  },
  {
    id: 12,
    type: 'repair',
    name: '广州文冲船厂',
    capability: '液化气船修理 | 客轮翻新',
    rating: 4.5,
    location: '广东·广州',
    cases: 76,
    verified: true,
    cover: 'https://picsum.photos/seed/repair3/400/260'
  }
])

// 模拟数据 - 需求列表调整结构以匹配设计图的标题样式
const demands = ref([
  {
    id: 1,
    type: 'design',
    code: 'D2023102401',
    // 将标题拆分，以便在中间插入高亮标签
    titlePrefix: '需设计',
    titleSuffix: '大型集装箱船',
    capacity: '24000TEU', // 这个将显示为蓝色标签
    budget: '约8000万',
    deliverTime: '2025年Q2',
    location: '上海',
    timeAgo: '30分钟前',
    urgency: 'normal',
  },
  {
    id: 2,
    type: 'design',
    code: 'D2023102402',
    titlePrefix: '需设计',
    titleSuffix: '绿色节能油船',
    capacity: '300000DWT',
    budget: '约1.2亿',
    deliverTime: '2025年Q4',
    location: '大连',
    timeAgo: '2小时前',
    urgency: 'urgent',
  },
  {
    id: 3,
    type: 'build',
    code: 'B2023102401',
    // 将标题拆分，以便在中间插入高亮标签
    titlePrefix: '需建造',
    titleSuffix: '卡尔萨姆型散货船',
    capacity: '82000DWT', // 这个将显示为蓝色标签
    budget: '约2.5亿',
    deliverTime: '2025年Q3',
    location: '上海',
    timeAgo: '1小时前',
    urgency: 'normal',
  },
  {
    id: 4,
    type: 'build',
    code: 'B2023102402',
    titlePrefix: '需建造',
    titleSuffix: '卡尔萨姆型散货船',
    capacity: '82000DWT',
    budget: '约2.5亿',
    deliverTime: '2025年Q3',
    location: '', // 设计图中有的没有地区
    timeAgo: '1小时前',
    urgency: 'normal',
  },
  {
    id: 5,
    type: 'build',
    code: 'B2023102403',
    titlePrefix: '需建造',
    titleSuffix: '卡尔萨姆型散货船',
    capacity: '82000DWT',
    budget: '约2.5亿',
    deliverTime: '2025年Q3',
    location: '',
    timeAgo: '1小时前',
    urgency: 'normal',
  },
  {
    id: 6,
    type: 'build',
    code: 'B2023102404',
    titlePrefix: '需建造',
    titleSuffix: '超大型油轮',
    capacity: '400000DWT',
    budget: '约5亿',
    deliverTime: '2025年Q2',
    location: '天津',
    timeAgo: '3小时前',
    urgency: 'normal',
  },
  {
    id: 7,
    type: 'build',
    code: 'B2023102405',
    titlePrefix: '需建造',
    titleSuffix: '液化天然气运输船',
    capacity: '174000m³',
    budget: '约4亿',
    deliverTime: '2025年Q4',
    location: '福建',
    timeAgo: '5小时前',
    urgency: 'urgent',
  },
  {
    id: 8,
    type: 'repair',
    code: 'R2023102401',
    titlePrefix: '需维修',
    titleSuffix: '集装箱船主机大修',
    capacity: '14000TEU',
    budget: '约3000万',
    deliverTime: '1个月内',
    location: '舟山',
    timeAgo: '15分钟前',
    urgency: 'urgent',
  },
  {
    id: 9,
    type: 'repair',
    code: 'R2023102402',
    titlePrefix: '需维修',
    titleSuffix: '油轮定期检验',
    capacity: '300000DWT',
    budget: '约5000万',
    deliverTime: '2周内',
    location: '青岛',
    timeAgo: '1小时前',
    urgency: 'normal',
  },
  {
    id: 10,
    type: 'repair',
    code: 'R2023102403',
    titlePrefix: '需维修',
    titleSuffix: '散货船进坞修理',
    capacity: '200000DWT',
    budget: '约2000万',
    deliverTime: '3周内',
    location: '广州',
    timeAgo: '2小时前',
    urgency: 'normal',
  }
])

// 计算属性
const currentServiceTitle = computed(() => {
  const types = { design: '设计院', build: '造船厂', repair: '修船厂' }
  return types[activeServiceType.value] || '服务方'
})

const currentDemandTitle = computed(() => {
  const types = { design: '设计需求', build: '造船需求', repair: '维修需求' }
  return types[activeServiceType.value] || '需求' // 简化标题
})

const filteredProviders = computed(() => {
  // 根据当前服务类型过滤提供商
  return providers.value.filter(p => p.type === activeServiceType.value).slice(0, 3)
})

const filteredDemands = computed(() => {
  // 根据当前服务类型过滤需求
  return demands.value.filter(d => d.type === activeServiceType.value).slice(0, 4)
})

// 方法 (保持不变)
const switchServiceType = (type) => {
  activeServiceType.value = type
}
const handleSearch = () => { console.log('搜索:', searchKeyword.value) }
const publishDemand = (type) => {
  console.log('发布需求:', type)
  router.push(`/ship-repair/publish-demand/${type}`)
}
const viewProviderDetail = (id) => {
  const provider = providers.value.find(p => p.id === id)
  console.log('查看服务方详情:', id, '类型:', provider?.type)
  
  // 根据服务方类型跳转到不同的详情页
  if (provider?.type === 'design') {
    router.push(`/ship-repair/design/${id}`)
  } else if (provider?.type === 'build') {
    router.push(`/ship-repair/building/${id}`)
  } else if (provider?.type === 'repair') {
    router.push(`/ship-repair/repair/${id}`)
  }
}
const viewDemandDetail = (id) => {
  console.log('查看需求详情:', id)
  router.push(`/ship-repair/demand/${id}`)
}
const contactDemand = (id) => { console.log('对接意向:', id) }
const toggleFavorite = (id) => { console.log('收藏:', id) }
</script>

<style scoped>
/* 全局变量定义 - 模拟设计图色板 */
:root {
  --primary-blue: #0056b3;
  --cyan-accent: #00c2cb;
  --cyan-gradient-start: #00d2ff;
  --cyan-gradient-end: #00a3cc;
  --dark-bg: #0a1f35;
  --light-bg: #f4f6f9;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-light: #999999;
  --border-color: #e5e5e5;
}

.ship-repair-home {
  min-height: 100vh;
  background: var(--light-bg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* --- 顶部视觉区域 (Hero Banner) --- */
.hero-banner {
  /* 增加高度以容纳悬浮面板 */
  height: 480px;
  /* 使用更深邃、工业感更强的背景图 */
  background: linear-gradient(to right, rgba(10, 31, 53, 0.9) 0%, rgba(10, 31, 53, 0.6) 100%),
    url('https://picsum.photos/id/235/1920/600') center/cover no-repeat;
  position: relative;
  display: flex;
  justify-content: center;
  /* 让内容靠上一些 */
  padding-top: 140px;
}

.hero-content {
  text-align: center;
  color: white;
  z-index: 2;
}

.hero-title {
  font-size: 44px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 1px;
  color: white;
}

/* --- 一体化操作区 (悬浮毛玻璃面板) --- */
.operation-glass-panel {
  position: absolute;
  bottom: -40px;
  /* 悬浮覆盖在 Banner 和内容区之间 */
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.85);
  /* 半透明白色 */
  backdrop-filter: blur(12px);
  /* 核心：毛玻璃效果 */
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 30px;
}

.operation-container {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* 搜索栏包裹器 */
.search-bar-wrapper {
  flex: 1;
  /* 占据剩余空间 */
}

.search-bar {
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  /* 圆润风格 */
  padding: 4px 6px 4px 20px;
  transition: all 0.3s;
}

.search-bar:focus-within {
  border-color: #2DD4BF;
  box-shadow: 0 0 0 3px rgba(0, 194, 203, 0.1);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #999;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text-primary);
}

/* 搜索栏内部的按钮 */
.search-btn-inner {
  background: linear-gradient(90deg, #2DD4BF, #3B82F6);
  border: none;
  color: white;
  padding: 10px 24px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.search-btn-inner:hover {
  transform: scale(1.05);
}

/* 核心功能按钮 (胶囊渐变样式) */
.action-buttons {
  display: flex;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  /* 胶囊形状 */
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* 不同类型的渐变色 - 参考设计图 */
.design-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.build-btn {
  background: linear-gradient(135deg, #ff9a44 0%, #fc6076 100%);
}

.repair-btn {
  background: linear-gradient(135deg, #ff0844 0%, #ffb199 100%);
}

.btn-icon {
  font-size: 18px;
}

/* --- 服务类型筛选器 (Tab) --- */
.tabs-section {
  margin-top: 60px;
  /* 为悬浮面板留出空间 */
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.service-type-tabs {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 0 24px;
}

.tab-item {
  position: relative;
  padding: 20px 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.3s;
}

.tab-item.active {
  color: var(--primary-blue);
  font-weight: 700;
}

/* 青色光晕下划线 */
.tab-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--cyan-accent);
  border-radius: 3px 3px 0 0;
  box-shadow: 0 -2px 6px rgba(0, 194, 203, 0.4);
  /* 光晕效果 */
}

/* --- 核心信息展示区 --- */
.content-section {
  padding: 30px 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 420px;
  /* 调整比例以匹配设计图 */
  gap: 24px;
}

.left-panel,
.right-panel {
  /* 移除背景色和阴影，让它们融入背景 */
  background: transparent;
  box-shadow: none;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

/* 扁平化筛选下拉框 */
.filter-bar {
  display: flex;
  gap: 12px;
}

.filter-select.plain {
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  background: white;
  cursor: pointer;
}

.filter-select.plain:focus {
  outline: none;
  border-color: var(--cyan-accent);
}


/* --- 左侧：现代化服务方卡片 --- */
.provider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  /* 稍微调窄一点适应3列 */
  gap: 20px;
}

.provider-card-modern {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
  border: 1px solid transparent;
}

.provider-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 194, 203, 0.3);
}

.card-image-wrapper {
  position: relative;
  height: 160px;
}

.provider-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 认证标识 */
.verified-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ffb700;
  /* 金黄色 */
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.provider-info-body {
  padding: 16px;
}

.provider-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.provider-direction {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.provider-established {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 12px;
}

.provider-meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 16px;
}

.meta-location {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-location svg {
  width: 14px;
  height: 14px;
}

.meta-rating {
  color: #ffb700;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 10px;
}

/* 线框按钮 */
.btn-view-detail-outline {
  flex: 1;
  padding: 8px 0;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view-detail-outline:hover {
  border-color: var(--cyan-accent);
  color: var(--cyan-accent);
}

.btn-icon-favorite {
  padding: 8px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-favorite svg {
  width: 18px;
  height: 18px;
}

.btn-icon-favorite:hover {
  color: #ff4757;
  border-color: #ff4757;
}


/* --- 右侧：现代化需求列表 (条状) --- */
.demand-list-modern {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demand-strip {
  background: white;
  border-radius: 10px;
  padding: 16px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.3s;
  cursor: pointer;
}

.demand-strip:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transform: translateX(4px);
}

.demand-strip-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demand-main-info {
  flex: 1;
}

.demand-strip-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.demand-code-prefix {
  color: var(--text-light);
  font-weight: 400;
  margin-right: 4px;
}

/* 高亮标签 (模拟设计图中的蓝色块) */
.highlight-tag.blue {
  background: #e6f7ff;
  color: var(--primary-blue);
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
}

.demand-sub-details {
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  gap: 8px;
}

.separator {
  color: var(--border-color);
}

.demand-strip-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 100px;
  /* 确保按钮区域宽度一致 */
}

.time-ago {
  font-size: 12px;
  color: var(--text-light);
}

/* 青色对接按钮 */
.btn-contact-cyan {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: linear-gradient(90deg, var(--cyan-gradient-start), var(--cyan-gradient-end));
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 6px rgba(0, 194, 203, 0.3);
}

.btn-contact-cyan:hover {
  box-shadow: 0 4px 10px rgba(0, 194, 203, 0.5);
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .operation-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar-wrapper {
    width: 100%;
  }

  .action-buttons {
    justify-content: space-between;
  }

  .content-container {
    grid-template-columns: 1fr;
  }

  .hero-banner {
    height: auto;
    padding-bottom: 60px;
  }

  .operation-glass-panel {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    width: 100%;
    margin-top: -30px;
  }

  .tabs-section {
    margin-top: 0;
  }
}
</style>

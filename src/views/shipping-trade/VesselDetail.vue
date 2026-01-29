<template>
  <div class="vessel-detail-page">
    <div class="detail-container">
      <!-- 左侧主要内容 -->
      <div class="main-content">
        <!-- 1. 页面顶部核心信息区 -->
        <section class="header-section">
          <div class="title-row">
            <h1 class="vessel-title">出售{{vesselData.capacity}}箱{{vesselData.type}}</h1>
            <div class="actions">
              <button class="icon-btn" :class="{ favorited: isFavorited }" @click="toggleFavorite">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.998 16.95 2.998C16.2275 2.998 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.452 9.22248 22.452 8.5C22.452 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" :stroke="isFavorited ? '#1890FF' : 'currentColor'" :fill="isFavorited ? '#1890FF' : 'none'" stroke-width="2"/>
                </svg>
                收藏
              </button>
            </div>
          </div>
          
          <div class="meta-info">
            <span class="vessel-code">编号: {{vesselData.code}}</span>
            <span class="update-time">{{vesselData.updateTime}}更新</span>
            <span class="view-count">已有{{vesselData.viewCount}}人关注</span>
          </div>

          <div class="content-row">
            <div class="left-info">
              <div class="price-section">
                <span class="price-label">售价:</span>
                <span class="price-value">¥{{vesselData.price}}万</span>
              </div>

              <div class="status-tags">
                <div class="status-tag">
                  <svg class="tag-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{vesselData.operatingStatus}}</span>
                </div>
                <div class="status-tag">
                  <svg class="tag-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{vesselData.maintenanceStatus}}</span>
                </div>
                <div class="status-tag">
                  <svg class="tag-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>{{vesselData.inspectionStatus}}</span>
                </div>
              </div>
            </div>

            <div class="main-image">
              <img :src="vesselData.mainImage" :alt="vesselData.name" />
            </div>
          </div>
        </section>

        <!-- 2. 特征参数模块 -->
        <section class="parameters-section">
          <div class="section-header">
            <h2>特征参数</h2>
          </div>
          <div class="params-grid">
            <div v-for="param in vesselParameters" :key="param.label" class="param-item">
              <span class="param-label">{{param.label}}:</span>
              <span v-if="param.sensitive && !param.revealed" class="param-value">
                ***
                <button class="reveal-btn" @click="revealParam(param.key)">查看</button>
              </span>
              <span v-else class="param-value" :class="{ linkable: param.linkable }" @click="param.linkable && searchByParam(param.key, param.value)">
                {{param.value}}
              </span>
            </div>
          </div>
        </section>

        <!-- 3. 证书图纸模块 -->
        <section class="certificates-section">
          <h2>证书图纸</h2>
          <div class="certificates-list">
            <div v-for="cert in certificates" :key="cert.name" class="cert-item">
              <span class="cert-name">{{cert.name}}</span>
              <span class="cert-status" :class="{ available: cert.available }">{{cert.available ? '有' : '无'}}</span>
              <button v-if="cert.available" class="view-cert-btn" @click="viewCertificate(cert.name)">查看</button>
            </div>
          </div>
        </section>

        <!-- 4. 照片展示模块 -->
        <section class="photos-section">
          <h2>照片</h2>
          <div class="photo-carousel">
            <button class="carousel-btn prev" @click="prevPhoto" :disabled="currentPhotoIndex === 0">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="photo-container" @click="openPhotoPreview">
              <img :src="photos[currentPhotoIndex]" alt="船舶照片" />
            </div>
            <button class="carousel-btn next" @click="nextPhoto" :disabled="currentPhotoIndex === photos.length - 1">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="photo-indicators">
            <span v-for="(photo, index) in photos" :key="index" class="indicator" :class="{ active: index === currentPhotoIndex }" @click="currentPhotoIndex = index"></span>
          </div>
        </section>

        <!-- 5. 备注信息模块 -->
        <section class="remarks-section">
          <h2>备注信息</h2>
          <div class="remarks-content">
            {{vesselData.remarks}}
          </div>
        </section>

        <!-- 同类型船舶推荐 -->
        <section class="recommendations-section">
          <div class="section-header">
            <h2>同类型船舶推荐</h2>
            <div class="carousel-controls">
              <button class="control-btn" @click="prevRecommendation">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="control-btn" @click="nextRecommendation">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="recommendations-grid">
            <div v-for="vessel in similarVessels" :key="vessel.id" class="recommendation-card" @click="goToDetail(vessel.id)">
              <img :src="vessel.image" :alt="vessel.name" />
              <h4>{{vessel.name}}</h4>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧栏 -->
      <aside class="sidebar">
        <!-- 6. 发布者信息模块 -->
        <section class="publisher-section">
          <h3>发布者信息</h3>
          <div class="publisher-card">
            <div class="publisher-header">
              <img :src="publisherData.avatar" alt="发布者头像" class="publisher-avatar" />
              <div class="publisher-info">
                <div class="publisher-name">{{publisherData.name}}</div>
                <div class="publisher-badge">{{publisherData.badge}}</div>
                <div class="publisher-rating">
                  <span v-for="i in 5" :key="i" class="star">★</span>
                </div>
                <div class="publisher-cert">{{publisherData.certification}}</div>
              </div>
            </div>
            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-label">联系人:</span>
                <span class="contact-value">{{(intentionStatus === 'accepted' || showContact) ? publisherData.contact : '***'}}</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">电话:</span>
                <span class="contact-value">{{(intentionStatus === 'accepted' || showContact) ? publisherData.phone : '***'}}</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">微信:</span>
                <span class="contact-value">{{(intentionStatus === 'accepted' || showContact) ? publisherData.wechat : '***'}}</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">邮箱:</span>
                <span class="contact-value">{{(intentionStatus === 'accepted' || showContact) ? publisherData.email : '***'}}</span>
              </div>
            </div>
            <button 
              v-if="intentionStatus === null" 
              class="contact-publisher-btn" 
              @click="handleContactPublisher">
              意向对接
            </button>
            <button 
              v-else-if="intentionStatus === 'pending'" 
              class="contact-publisher-btn waiting" 
              disabled>
              等待对方回复
            </button>
            <button 
              v-else-if="intentionStatus === 'rejected'" 
              class="contact-publisher-btn" 
              @click="handleContactPublisher">
              意向对接
            </button>
          </div>
        </section>

        <!-- 7. 该发布人其他出售船舶 -->
        <section class="other-vessels-section">
          <div class="section-header">
            <h3>该发布人其他出售船舶</h3>
            <button class="more-btn" @click="viewMoreFromPublisher">+ 更多</button>
          </div>
          <div class="other-vessels-list">
            <div v-for="vessel in publisherOtherVessels" :key="vessel.id" class="other-vessel-item" @click="goToDetail(vessel.id)">
              <img :src="vessel.image" :alt="vessel.name" />
              <div class="other-vessel-info">
                <div class="other-vessel-title">{{vessel.code}} {{vessel.type}}</div>
                <div class="other-vessel-location">{{vessel.location}}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 热门关键字 -->
        <section class="keywords-section">
          <h3>热门关键字</h3>
          <div class="keywords-cloud">
            <button v-for="keyword in hotKeywords" :key="keyword" class="keyword-tag" @click="searchByKeyword(keyword)">
              {{keyword}}
            </button>
          </div>
        </section>
      </aside>
    </div>

    <!-- Intention Dialog -->
    <IntentionDialog 
      v-model="isIntentionDialogOpen"
      :vessel-id="route.params.id"
      @submit="handleIntentionSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IntentionDialog from '../../components/IntentionDialog.vue'

const route = useRoute()
const router = useRouter()

// Intention Dialog state
const isIntentionDialogOpen = ref(false)
const intentionStatus = ref(null) // null | 'pending' | 'accepted' | 'rejected'

// 船舶基础数据
const vesselData = ref({
  id: route.params.id || '1',
  code: 'SS93224',
  type: '集装箱船',
  capacity: '1740',
  name: '出售1740箱集装箱船',
  price: 6800,
  updateTime: '1小时前',
  viewCount: 1681,
  operatingStatus: '在航',
  maintenanceStatus: '日常保养一般',
  inspectionStatus: '一年内已做过坞检',
  mainImage: 'https://picsum.photos/seed/vessel1/600/400',
  remarks: '该船舶状况良好，证书齐全，可随时交船。船舶经过最近的坞检，主机、辅机运行正常，所有设备保养良好。欢迎看船验货，价格面议。'
})

// 状态管理
const isFavorited = ref(false)
const showContact = ref(false)
const currentPhotoIndex = ref(0)

// 平台服务
const platformServices = ref([
  { name: '融资' },
  { name: '估价' },
  { name: '路检' },
  { name: '接送船' },
  { name: '进出口代理' }
])

// 特征参数 - 与SellVesselForm中的formData字段对齐
const vesselParameters = ref([
  { key: 'vesselType', label: '船舶类型', value: '集装箱船', linkable: true },
  { key: 'navigationArea', label: '航区', value: '无限航区', linkable: false },
  { key: 'classificationSociety', label: '船级', value: 'DNV', linkable: true },
  { key: 'flag', label: '船旗', value: '中国', linkable: true },
  { key: 'buildPlace', label: '建造厂', value: '中国', linkable: true },
  { key: 'buildDate', label: '建造日期', value: '2015年6月', linkable: false },
  { key: 'portOfRegistry', label: '船籍港', value: '上海', linkable: false },
  { key: 'grossTonnage', label: '总吨', value: '25,000吨', linkable: false },
  { key: 'netTonnage', label: '净吨', value: '15,000吨', linkable: false },
  { key: 'length', label: '总长（米）', value: '185米', linkable: false },
  { key: 'width', label: '型宽（米）', value: '28米', linkable: false },
  { key: 'depth', label: '型深（米）', value: '15米', linkable: false },
  { key: 'deadweight', label: '载重（吨）', value: '32,000吨', linkable: false },
  { key: 'mainEnginePower', label: '主机功率（kW）', value: '9,480', linkable: false },
  { key: 'mainEngineModel', label: '主机型号', value: '6S50MC', linkable: false },
  { key: 'expectedPrice', label: '期望售价（万元）', value: '6800', linkable: false },
  { key: 'inService', label: '是否在航', value: '是', linkable: false },
  { key: 'maintenanceStatus', label: '日常保养状况', value: '良好', linkable: false },
  { key: 'dockInspection', label: '坞检/特检情况', value: '一年内已做过', linkable: false },
  { key: 'updateDate', label: '更新日期', value: '2024-01-26', linkable: false }
])

// 证书图纸 - 与SellVesselForm中上传的证书对应
const certificates = ref([
  { name: '船检证书', available: true },
  { name: '总布置图', available: true },
  { name: '所有权证书', available: true },
  { name: '国籍证书', available: true }
])

// 照片分类 - 与SellVesselForm中的photoCategories一致
const photoCategories = ref([
  { key: 'overall', label: '整船照' },
  { key: 'exterior', label: '外观照' },
  { key: 'deck', label: '甲板货仓照' },
  { key: 'cabin', label: '居住驾驶舱照' },
  { key: 'engine', label: '机舱集控照' }
])

// 照片 - 按分类组织，与SellVesselForm中的photoCategories对应
const photos = ref([
  'https://picsum.photos/seed/vessel1/800/600',
  'https://picsum.photos/seed/vessel2/800/600'
])

// 发布者信息
const publisherData = ref({
  avatar: 'https://picsum.photos/seed/avatar1/80/80',
  name: '鑫和船务',
  badge: '平台直营',
  contact: '张经理',
  phone: '138****8888',
  wechat: 'xinhe_shipping',
  email: 'contact@xinhe.com'
})

// 该发布人其他船舶
const publisherOtherVessels = ref([
  { id: 2, code: 'SS93225', type: '散货船', location: '上海', image: 'https://picsum.photos/seed/vessel5/150/100' },
  { id: 3, code: 'SS93226', type: '油船', location: '宁波', image: 'https://picsum.photos/seed/vessel6/150/100' }
])

// 同类型船舶推荐
const similarVessels = ref([
  { id: 4, name: '1800箱集装箱船', image: 'https://picsum.photos/seed/vessel7/200/150' },
  { id: 5, name: '1600箱集装箱船', image: 'https://picsum.photos/seed/vessel8/200/150' },
  { id: 6, name: '1900箱集装箱船', image: 'https://picsum.photos/seed/vessel9/200/150' },
  { id: 7, name: '1750箱集装箱船', image: 'https://picsum.photos/seed/vessel10/200/150' }
])

// 热门关键字
const hotKeywords = ref([
  '新造船订单', '散货船', '集装箱船', '油船', '二手船', '船舶融资'
])

// 交互功能
const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  console.log('收藏状态:', isFavorited.value)
}

const viewService = (serviceName) => {
  console.log('查看服务:', serviceName)
  // TODO: 跳转到服务介绍页
}

const handlePrint = () => {
  console.log('打印参数')
  window.print()
}

const revealParam = (paramKey) => {
  const param = vesselParameters.value.find(p => p.key === paramKey)
  if (param) {
    console.log('查看敏感参数:', paramKey)
    // TODO: 检查用户权限
    param.revealed = true
  }
}

const searchByParam = (paramKey, paramValue) => {
  console.log('按参数搜索:', paramKey, paramValue)
  // TODO: 跳转到搜索结果页
}

const viewCertificate = (certName) => {
  console.log('查看证书:', certName)
  // TODO: 打开证书预览
}

const prevPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  }
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < photos.value.length - 1) {
    currentPhotoIndex.value++
  }
}

const openPhotoPreview = () => {
  console.log('打开大图预览')
  // TODO: 实现全屏预览
}

const handleContactPublisher = () => {
  console.log('[v0] 打开对接意向弹窗')
  isIntentionDialogOpen.value = true
}

const handleIntentionSubmit = (intentionData) => {
  console.log('[v0] 提交意向信息:', {
    vesselId: route.params.id,
    ...intentionData
  })
  intentionStatus.value = 'pending'
  isIntentionDialogOpen.value = false
}

const handleIntentionStatusChange = (event) => {
  const { intentionId, status } = event.detail
  if (intentionId === route.params.id) {
    intentionStatus.value = status
    console.log('[v0] 意向状态已更新:', status)
  }
}

// 组件挂载时添加监听器
onMounted(() => {
  window.addEventListener('intentionStatusChanged', handleIntentionStatusChange)
  console.log('船舶详情页加载完成，ID:', route.params.id)
})

// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('intentionStatusChanged', handleIntentionStatusChange)
})

const viewMoreFromPublisher = () => {
  console.log('查看发布者更多船舶')
  // TODO: 跳转到发布者船舶列表
}

const searchByKeyword = (keyword) => {
  console.log('按关键字搜索:', keyword)
  // TODO: 跳转到搜索结果页
}

const goToDetail = (vesselId) => {
  console.log('跳转到船舶详情:', vesselId)
  router.push(`/shipping-trade/vessel/${vesselId}`)
}

const prevRecommendation = () => {
  console.log('上一组推荐')
}

const nextRecommendation = () => {
  console.log('下一组推荐')
}
</script>

<style scoped>
.vessel-detail-page {
  min-height: 100vh;
  background: #F5F7FA;
  padding: 24px 0;
}

.detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

/* 主要内容区 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 页面顶部核心信息区 */
.header-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.vessel-title {
  font-size: 28px;
  font-weight: 700;
  color: #1A1A1A;
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
  transition: all 0.3s;
  font-size: 14px;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.icon-btn:hover {
  border-color: #1890FF;
  color: #1890FF;
}

.icon-btn.favorited {
  border-color: #1890FF;
  color: #1890FF;
}

.meta-info {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #8C8C8C;
  margin-bottom: 24px;
}

.vessel-code {
  font-weight: 600;
  color: #1890FF;
}

.content-row {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

.left-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.price-label {
  color: #595959;
  font-weight: 500;
}

.price-value {
  font-size: 32px;
  font-weight: 700;
  color: #FF4D4F;
}

.price-hidden {
  font-size: 32px;
  font-weight: 700;
  color: #D9D9D9;
}

.view-price-btn {
  padding: 6px 16px;
  background: #1890FF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #F5F5F5;
  border-radius: 20px;
  font-size: 13px;
  color: #595959;
}

.tag-icon {
  width: 16px;
  height: 16px;
}

.main-image {
  width: 400px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 特征参数模块 */
.parameters-section,
.certificates-section,
.photos-section,
.remarks-section,
.recommendations-section {
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

.params-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 32px;
}

.param-item {
  display: flex;
  font-size: 14px;
}

.param-label {
  color: #8C8C8C;
  min-width: 120px;
}

.param-value {
  color: #1A1A1A;
  font-weight: 500;
}

.param-value.linkable {
  color: #1890FF;
  cursor: pointer;
  text-decoration: underline;
}

.reveal-btn {
  margin-left: 8px;
  padding: 2px 8px;
  background: #1890FF;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

/* 证书图纸 */
.certificates-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cert-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 6px;
}

.cert-name {
  flex: 1;
  font-size: 14px;
  color: #1A1A1A;
}

.cert-status {
  margin-right: 12px;
  font-size: 14px;
  color: #FF4D4F;
}

.cert-status.available {
  color: #52C41A;
}

.view-cert-btn {
  padding: 4px 16px;
  background: #1890FF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

/* 照片展示 */
.photo-carousel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.carousel-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #D9D9D9;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.carousel-btn:hover:not(:disabled) {
  border-color: #1890FF;
  color: #1890FF;
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-btn svg {
  width: 20px;
  height: 20px;
}

.photo-container {
  flex: 1;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #D9D9D9;
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  background: #1890FF;
  width: 24px;
  border-radius: 4px;
}

/* 备注信息 */
.remarks-content {
  font-size: 14px;
  line-height: 1.8;
  color: #595959;
  white-space: pre-wrap;
}

/* 同类型推荐 */
.carousel-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #D9D9D9;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn svg {
  width: 16px;
  height: 16px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.recommendation-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #F0F0F0;
  transition: all 0.3s;
}

.recommendation-card:hover {
  border-color: #1890FF;
  box-shadow: 0 4px 12px rgba(24,144,255,0.15);
}

.recommendation-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.recommendation-card h4 {
  padding: 12px;
  font-size: 14px;
  color: #1A1A1A;
}

/* 右侧栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 发布者信息 */
.publisher-section,
.other-vessels-section,
.keywords-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.publisher-section h3,
.other-vessels-section h3,
.keywords-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 16px;
}

.publisher-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.publisher-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.publisher-info {
  flex: 1;
}

.publisher-name {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.publisher-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #1890FF;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 4px;
}

.publisher-rating {
  color: #FAAD14;
  font-size: 14px;
  margin-bottom: 4px;
}

.publisher-cert {
  font-size: 12px;
  color: #52C41A;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.contact-item {
  display: flex;
  font-size: 13px;
}

.contact-label {
  color: #8C8C8C;
  min-width: 60px;
}

.contact-value {
  color: #1A1A1A;
}

.contact-publisher-btn {
  width: 100%;
  padding: 12px;
  background: #1890FF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
}

.contact-publisher-btn:hover {
  background: #0D7DE0;
}

/* 其他船舶 */
.other-vessels-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.more-btn {
  padding: 4px 12px;
  background: white;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.more-btn:hover {
  border-color: #1890FF;
  color: #1890FF;
}

.other-vessels-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.other-vessel-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.other-vessel-item:hover {
  background: #F5F7FA;
}

.other-vessel-item img {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.other-vessel-info {
  flex: 1;
}

.other-vessel-title {
  font-size: 13px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.other-vessel-location {
  font-size: 12px;
  color: #8C8C8C;
}

/* 热门关键字 */
.keywords-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  padding: 6px 12px;
  background: #F5F7FA;
  border: 1px solid #E8E8E8;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  color: #595959;
  transition: all 0.3s;
}

.keyword-tag:hover {
  background: #E6F7FF;
  border-color: #1890FF;
  color: #1890FF;
}

@media (max-width: 1200px) {
  .detail-container {
    grid-template-columns: 1fr;
  }
  
  .content-row {
    grid-template-columns: 1fr;
  }
  
  .main-image {
    width: 100%;
  }
  
  .params-grid {
    grid-template-columns: 1fr;
  }
  
  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<template>
  <div class="vessel-detail-page">
    <div class="detail-container">
      <!-- 左侧主要内容 -->
      <div class="main-content">
        <!-- 1. 页面顶部核心信息区 -->
        <section class="header-section">
          <div class="title-row">
            <h1 class="vessel-title">{{ leasingData.vesselName }} - {{ leasingTypeText }}</h1>
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
            <span class="vessel-code">编号: {{ leasingData.code }}</span>
            <span class="update-time">{{ leasingData.updateTime }}更新</span>
            <span class="view-count">已有{{ leasingData.viewCount }}人关注</span>
          </div>

          <div class="content-row">
            <div class="left-info">
              <div class="leasing-info-section">
                <div class="info-item">
                  <span class="info-label">当前位置:</span>
                  <span class="info-value">{{ leasingData.currentLocation }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">可用时间:</span>
                  <span class="info-value">{{ leasingData.availableDateStart }} 至 {{ leasingData.availableDateEnd }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">可租类型:</span>
                  <span class="info-value">{{ leasingData.leaseTypes.join('、') }}</span>
                </div>
              </div>

              <div class="status-tags">
                <div class="status-tag status-available">
                  <svg class="tag-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>空闲可租</span>
                </div>
              </div>
            </div>

            <div class="main-image">
              <img :src="leasingData.mainImage" :alt="leasingData.vesselName" />
            </div>
          </div>
        </section>

        <!-- 2. 船舶基础参数 -->
        <section class="parameters-section">
          <div class="section-header">
            <h2>船舶基础参数</h2>
          </div>
          <div class="params-grid">
            <div class="param-item">
              <span class="param-label">船舶类型:</span>
              <span class="param-value">{{ leasingData.vesselType }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">航区:</span>
              <span class="param-value">{{ leasingData.navigationArea }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">船级:</span>
              <span class="param-value">{{ leasingData.classificationSociety }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">建造厂:</span>
              <span class="param-value">{{ leasingData.buildPlace }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">建造日期:</span>
              <span class="param-value">{{ leasingData.buildDate }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">船旗:</span>
              <span class="param-value">{{ leasingData.flag }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">船籍港:</span>
              <span class="param-value">{{ leasingData.portOfRegistry }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">总吨:</span>
              <span class="param-value">{{ leasingData.grossTonnage }} 吨</span>
            </div>
            <div class="param-item">
              <span class="param-label">净吨:</span>
              <span class="param-value">{{ leasingData.netTonnage }} 吨</span>
            </div>
            <div class="param-item">
              <span class="param-label">总长:</span>
              <span class="param-value">{{ leasingData.length }} 米</span>
            </div>
            <div class="param-item">
              <span class="param-label">型宽:</span>
              <span class="param-value">{{ leasingData.width }} 米</span>
            </div>
            <div class="param-item">
              <span class="param-label">型深:</span>
              <span class="param-value">{{ leasingData.depth }} 米</span>
            </div>
            <div class="param-item">
              <span class="param-label">主机功率:</span>
              <span class="param-value">{{ leasingData.mainEnginePower }} kW</span>
            </div>
            <div class="param-item">
              <span class="param-label">主机型号:</span>
              <span class="param-value">{{ leasingData.mainEngineModel }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">载重:</span>
              <span class="param-value">{{ leasingData.deadweight }} 吨</span>
            </div>
          </div>
        </section>

        <!-- 3. 照片展示模块 -->
        <section class="photos-section">
          <h2>船舶照片</h2>
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

        <!-- 4. 空船备注 -->
        <section class="remarks-section">
          <h2>空船备注</h2>
          <div class="remarks-content">
            {{ leasingData.remarks || '暂无备注信息' }}
          </div>
        </section>

        <!-- 同类型空船推荐 -->
        <section class="recommendations-section">
          <div class="section-header">
            <h2>同类型空船推荐</h2>
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
              <img :src="vessel.image" :alt="vessel.vesselName" />
              <h4>{{ vessel.vesselName }}</h4>
              <p class="rec-location">{{ vessel.currentLocation }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧联系卡片 -->
      <aside class="sidebar-content">
        <div class="contact-card">
          <h3>联系船东</h3>
          <div class="contact-info">
            <div class="info-row">
              <span class="label">联系人:</span>
              <span class="value">{{ contactInfo.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">联系电话:</span>
              <span class="value">{{ contactInfo.phone }}</span>
            </div>
          </div>
          <button class="contact-btn" @click="handleContact">意向对接</button>
        </div>

        <div class="publisher-card">
          <h3>发布者信息</h3>
          <div class="publisher-info">
            <div class="avatar">
              <img :src="publisher.avatar" alt="Publisher">
            </div>
            <div class="publisher-details">
              <h4>{{ publisher.name }}</h4>
              <p>{{ publisher.vessels }}艘在租船舶</p>
            </div>
          </div>
          <button class="view-more-btn" @click="viewMoreFromPublisher">查看更多</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// States
const isFavorited = ref(false)
const currentPhotoIndex = ref(0)

// Mock data - 租赁信息数据
const leasingData = ref({
  id: route.params.id,
  code: 'IDLE202601001',
  vesselName: '远洋货轮',
  vesselType: '散货船',
  navigationArea: '无限航区',
  classificationSociety: 'DNV',
  buildPlace: '中国',
  buildDate: '2015年6月',
  flag: '中国',
  portOfRegistry: '上海',
  grossTonnage: 25000,
  netTonnage: 15000,
  length: 185,
  width: 28,
  depth: 15,
  mainEnginePower: 9480,
  mainEngineModel: '6S50MC',
  deadweight: 32000,
  currentLocation: '上海港',
  availableDateStart: '2026-02-01',
  availableDateEnd: '2026-06-30',
  leaseTypes: ['期租', '光租', '航次租船'],
  remarks: '船舶状况良好，可承接散货运输，航线无限制。近期已完成年检，所有证书齐全有效。',
  updateTime: '2026-01-20',
  viewCount: 156,
  mainImage: 'https://picsum.photos/seed/idle1/600/400'
})

const leasingTypeText = computed(() => {
  return leasingData.value.leaseTypes.join('/')
})

const photos = ref([
  'https://picsum.photos/seed/idle1/800/600',
  'https://picsum.photos/seed/idle2/800/600',
  'https://picsum.photos/seed/idle3/800/600'
])

const contactInfo = ref({
  name: '张经理',
  phone: '138****8888'
})

const publisher = ref({
  name: '远洋船运公司',
  avatar: 'https://ui-avatars.com/api/?name=YY&background=0EA5E9&color=fff',
  vessels: 12
})

const similarVessels = ref([
  { id: 2, vesselName: '海洋之星', currentLocation: '宁波港', image: 'https://picsum.photos/seed/sim1/300/200' },
  { id: 3, vesselName: '东方巨轮', currentLocation: '深圳港', image: 'https://picsum.photos/seed/sim2/300/200' },
  { id: 4, vesselName: '蓝鲸号', currentLocation: '广州港', image: 'https://picsum.photos/seed/sim3/300/200' }
])

// Methods
const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  console.log('[v0] 收藏状态:', isFavorited.value)
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
  console.log('[v0] 打开照片预览')
}

const handleContact = () => {
  console.log('[v0] 联系船东')
  alert('联系功能开发中...')
}

const viewMoreFromPublisher = () => {
  console.log('[v0] 查看发布者更多空船')
}

const prevRecommendation = () => {
  console.log('[v0] 上一组推荐')
}

const nextRecommendation = () => {
  console.log('[v0] 下一组推荐')
}

const goToDetail = (id) => {
  router.push(`/vessel-leasing/idle/${id}`)
}

onMounted(() => {
  console.log('[v0] 租赁信息详情页加载完成，ID:', route.params.id)
})
</script>

<style scoped>
.vessel-detail-page {
  background: #F8FAFC;
  min-height: 100vh;
  padding: 24px 0;
}

.detail-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header Section */
.header-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.vessel-title {
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
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
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-btn svg {
  width: 20px;
  height: 20px;
}

.icon-btn:hover {
  border-color: #0EA5E9;
  color: #0EA5E9;
}

.icon-btn.favorited {
  border-color: #1890FF;
  color: #1890FF;
  background: #E6F4FF;
}

.meta-info {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #64748B;
  margin-bottom: 24px;
}

.vessel-code {
  font-weight: 600;
}

.content-row {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: flex-start;
}

.left-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.leasing-info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
}

.info-item {
  display: flex;
  gap: 12px;
  font-size: 14px;
}

.info-label {
  color: #64748B;
  font-weight: 600;
  min-width: 80px;
}

.info-value {
  color: #0F172A;
  font-weight: 500;
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
  background: #F1F5F9;
  border-radius: 20px;
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.status-tag.status-available {
  background: #DCFCE7;
  color: #166534;
}

.tag-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.main-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.main-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* Parameters Section */
.parameters-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 24px;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.param-label {
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}

.param-value {
  font-size: 15px;
  color: #0F172A;
  font-weight: 600;
}

/* Photos Section */
.photos-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.photos-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 24px 0;
}

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
  background: white;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.carousel-btn:hover:not(:disabled) {
  background: #F8FAFC;
  border-color: #0EA5E9;
}

.carousel-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.carousel-btn svg {
  width: 20px;
  height: 20px;
  color: #64748B;
}

.photo-container {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.photo-container img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
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
  background: #E2E8F0;
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  background: #0EA5E9;
  width: 24px;
  border-radius: 4px;
}

/* Remarks Section */
.remarks-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.remarks-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 16px 0;
}

.remarks-content {
  font-size: 15px;
  line-height: 1.7;
  color: #475569;
}

/* Recommendations Section */
.recommendations-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.carousel-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn:hover {
  background: #E2E8F0;
}

.control-btn svg {
  width: 18px;
  height: 18px;
  color: #64748B;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.recommendation-card {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.3s;
}

.recommendation-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.recommendation-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.recommendation-card h4 {
  padding: 12px;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
}

.rec-location {
  padding: 0 12px 12px;
  margin: 0;
  font-size: 12px;
  color: #64748B;
}

/* Sidebar */
.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-card,
.publisher-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.contact-card h3,
.publisher-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 16px 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.info-row .label {
  color: #64748B;
  font-weight: 500;
}

.info-row .value {
  color: #0F172A;
  font-weight: 600;
}

.contact-btn {
  width: 100%;
  padding: 12px;
  background: #0EA5E9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-btn:hover {
  background: #0284C7;
}

.publisher-info {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.publisher-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 4px 0;
}

.publisher-details p {
  font-size: 13px;
  color: #64748B;
  margin: 0;
}

.view-more-btn {
  width: 100%;
  padding: 10px;
  background: white;
  color: #0EA5E9;
  border: 1px solid #0EA5E9;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.view-more-btn:hover {
  background: #EFF6FF;
}

@media (max-width: 1024px) {
  .detail-container {
    grid-template-columns: 1fr;
  }

  .content-row {
    grid-template-columns: 1fr;
  }

  .main-image {
    order: -1;
  }

  .params-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .params-grid {
    grid-template-columns: 1fr;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
  }

  .vessel-title {
    font-size: 22px;
  }
}
</style>

<template>
    <div class="purchase-detail-page">
        <div class="detail-container">
            <!-- 左侧主要内容 -->
            <div class="main-content">
                <!-- 1. 页面顶部核心信息区 -->
                <section class="header-section">
                    <div class="title-row">
                        <h1 class="purchase-title">{{ purchaseData.title }}</h1>
                        <div class="actions">
                            <button class="icon-btn" :class="{ favorited: isFavorited }" @click="toggleFavorite">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.998 16.95 2.998C16.2275 2.998 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.452 9.22248 22.452 8.5C22.452 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"
                                        :stroke="isFavorited ? '#1890FF' : 'currentColor'"
                                        :fill="isFavorited ? '#1890FF' : 'none'" stroke-width="2" />
                                </svg>
                                收藏
                            </button>
                        </div>
                    </div>

                    <div class="meta-info">
                        <span class="purchase-code">编号: {{ purchaseData.id }}</span>
                        <span class="update-time">{{ purchaseData.updateTime }}更新</span>
                        <span class="view-count">阅读量 {{ purchaseData.views }}</span>
                    </div>

                    <div class="budget-row">
                        <div class="budget-section">
                            <span class="budget-label">预算:</span>
                            <span class="budget-value">{{ purchaseData.budget }}</span>
                        </div>
                    </div>
                </section>

                <!-- 2. 特征参数模块 -->
                <section class="parameters-section">
                    <div class="section-header">
                        <h2 class="section-title">特征参数</h2>
                    </div>
                    <div class="params-grid">
                        <div v-for="param in paramsList" :key="param.key" class="param-item">
                            <span class="param-label">{{ param.label }}:</span>
                            <span v-if="param.linkable" class="param-value linkable"
                                @click="searchByParam(param.key, param.value)">
                                {{ param.value || '-' }}
                            </span>
                            <span v-else class="param-value">{{ param.value || '-' }}</span>
                        </div>
                    </div>
                </section>

                <!-- 3. 备注信息模块 -->
                <section class="remarks-section">
                    <h2>备注信息</h2>
                    <div class="remarks-content">
                        {{ purchaseData.remarks || '无' }}
                    </div>
                </section>

                <!-- 4. 同类型求购推荐 -->
                <section class="recommendations-section">
                    <div class="section-header">
                        <h2 class="section-title">同类型求购信息推荐</h2>
                        <div class="carousel-controls">
                            <button class="control-btn" @click="prevRecommendation" :disabled="currentRecommendationIndex === 0">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button class="control-btn" @click="nextRecommendation" :disabled="currentRecommendationIndex >= recommendations.length - 3">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="recommendations-grid">
                        <div v-for="rec in visibleRecommendations" :key="rec.id" class="recommendation-card">
                            <div class="rec-header">
                                <svg class="ship-icon" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 18L5 12L2 13V18H22V13L19 12L21 18M12 2L9 12H15L12 2Z"
                                        stroke="currentColor" stroke-width="2" />
                                </svg>
                                <h4 class="rec-title">{{ rec.title }}</h4>
                            </div>
                            <div class="rec-params">
                                <div class="rec-param">船级: {{ rec.shipClass }}</div>
                                <div class="rec-param">航区: {{ rec.area }}</div>
                                <div class="rec-param">建造年份: {{ rec.buildYear }}</div>
                                <div class="rec-param">建造地: {{ rec.buildPlace }}</div>
                            </div>
                            <div class="rec-footer">
                                <span class="rec-budget">{{ rec.budget }}</span>
                                <span class="rec-time">{{ rec.publishTime }}</span>
                            </div>
                            <button class="rec-view-btn" @click="viewRecommendation(rec.id)">点击查看</button>
                        </div>
                    </div>
                </section>
            </div>

            <!-- 右侧发布者信息 -->
            <aside class="publisher-sidebar">
                <div class="publisher-card">
                    <div class="publisher-header">
                        <img :src="publisher.avatar" alt="avatar" class="avatar">
                        <div class="publisher-info">
                            <h3 class="publisher-name">{{ publisher.name }}</h3>
                            <div class="rating">
                                <svg v-for="i in 5" :key="i" class="star-icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                        :fill="i <= publisher.rating ? '#FFA500' : 'none'" stroke="#FFA500"
                                        stroke-width="2" />
                                </svg>
                            </div>
                            <div class="badges">
                                <span class="badge verified">已认证</span>
                                <span class="badge premium">高级会员</span>
                            </div>
                        </div>
                    </div>
                    <div class="contact-info">
                        <div class="contact-item">
                            <span class="contact-label">联系人:</span>
                            <span class="contact-value masked">{{ showContact ? publisher.contact : '****' }}</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-label">电话:</span>
                            <span class="contact-value masked">{{ showContact ? publisher.phone : '****' }}</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-label">微信:</span>
                            <span class="contact-value masked">{{ showContact ? publisher.wechat : '****' }}</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-label">邮箱:</span>
                            <span class="contact-value masked">{{ showContact ? publisher.email : '****' }}</span>
                        </div>
                    </div>
                    <button class="contact-btn" @click="handleContact">意向对接</button>
                </div>
            </aside>
    </div>

    <!-- Intention Dialog -->
    <IntentionDialog 
      v-model="isIntentionDialogOpen"
      :purchase-id="route.params.id"
      @submit="handleIntentionSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IntentionDialog from '../../components/IntentionDialog.vue'

const route = useRoute()
const router = useRouter()

// Intention Dialog state
const isIntentionDialogOpen = ref(false)

const isFavorited = ref(false)
const showContact = ref(false)
const currentRecommendationIndex = ref(0)

// 模拟数据 - 实际应从API获取
const purchaseData = ref({
    id: 'SP93640',
    title: '求购4500吨甲板货驳',
    updateTime: '5天前',
    views: 263,
    budget: '面议',
    remarks: '1. 无动力\n2. 尺寸：长度80米左右，宽度18米左右\n3. 年份：2010年以后\n4. 需要相关证书齐全'
})

const services = ref(['融资', '估价', '路检', '接送船', '进出口代理'])

const paramsList = ref([
    { key: 'type', label: '船舶类型', value: '甲板货驳', linkable: true },
    { key: 'area', label: '航区', value: 'A1+A2', linkable: true },
    { key: 'port', label: '船籍港', value: '上海港' },
    { key: 'flag', label: '船旗', value: '中国', linkable: true },
    { key: 'buildPlace', label: '建造地', value: '国内', linkable: true },
    { key: 'class', label: '船级', value: 'CCS', linkable: true },
    { key: 'buildDate', label: '建造年份', value: '2010年以后' },
    { key: 'budget', label: '预算范围(万元)', value: '面议' }
])

const publisher = ref({
    name: '经纪公司',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=company',
    rating: 5,
    contact: '张先生',
    phone: '138****8888',
    wechat: 'ship_broker',
    email: 'contact@broker.com'
})

const recommendations = ref([
    {
        id: 'SP001',
        title: '求购1000吨甲板货驳',
        shipClass: 'CCS',
        area: '近海',
        buildYear: '2015-2020',
        buildPlace: '国内',
        budget: '面议',
        publishTime: '3天前'
    },
    {
        id: 'SP002',
        title: '求购3000吨甲板货驳',
        shipClass: 'CCS',
        area: 'A1+A2',
        buildYear: '2010-2018',
        buildPlace: '不限',
        budget: '800-1200万',
        publishTime: '5天前'
    },
    {
        id: 'SP003',
        title: '求购2500吨甲板货驳',
        shipClass: 'CCS',
        area: '沿海',
        buildYear: '2012-2020',
        buildPlace: '江苏',
        budget: '面议',
        publishTime: '1周前'
    },
    {
        id: 'SP004',
        title: '求购5000吨甲板货驳',
        shipClass: 'CCS',
        area: '无限航区',
        buildYear: '2015-2023',
        buildPlace: '不限',
        budget: '1500-2000万',
        publishTime: '2天前'
    },
    {
        id: 'SP005',
        title: '求购8000吨甲板货驳',
        shipClass: 'CCS',
        area: '无限航区',
        buildYear: '2018-2024',
        buildPlace: '国内',
        budget: '2500-3000万',
        publishTime: '1天前'
    },
    {
        id: 'SP006',
        title: '求购1500吨甲板货驳',
        shipClass: 'CCS',
        area: '沿海',
        buildYear: '2010-2015',
        buildPlace: '不限',
        budget: '面议',
        publishTime: '4天前'
    }
])

const toggleFavorite = () => {
    isFavorited.value = !isFavorited.value
    console.log('收藏状态:', isFavorited.value)
}

const handleShare = () => {
    console.log('分享求购信息')
    // 实际项目中弹出分享菜单
}

const handlePrint = () => {
    console.log('打印预览')
    window.print()
}

const searchByParam = (key, value) => {
    console.log('按参数搜索:', key, value)
    // 跳转到搜索结果页
}

const handleContact = () => {
    console.log('[v0] 打开对接意向弹窗')
    isIntentionDialogOpen.value = true
}

const handleIntentionSubmit = (intentionData) => {
    console.log('[v0] 提交意向信息:', {
        purchaseId: route.params.id,
        ...intentionData
    })
}

// 计算当前可见的推荐列表
const visibleRecommendations = computed(() => {
    return recommendations.value.slice(currentRecommendationIndex.value, currentRecommendationIndex.value + 3)
})

const prevRecommendation = () => {
    if (currentRecommendationIndex.value > 0) {
        currentRecommendationIndex.value--
    }
}

const nextRecommendation = () => {
    if (currentRecommendationIndex.value < recommendations.value.length - 3) {
        currentRecommendationIndex.value++
    }
}

const viewRecommendation = (id) => {
    console.log('查看推荐求购:', id)
    router.push(`/shipping-trade/purchase/${id}`)
}

onMounted(() => {
    console.log('加载求购详情:', route.params.id)
    // 实际项目中从API加载数据
})
</script>

<style scoped>
.purchase-detail-page {
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

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* 顶部核心信息区 */
.header-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.purchase-title {
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
    font-size: 14px;
    transition: all 0.3s;
    color: #595959;
}

.icon-btn svg {
    width: 18px;
    height: 18px;
}

.icon-btn.favorited {
    border-color: #1890FF;
    color: #1890FF;
}

.icon-btn:hover {
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

.purchase-code {
    font-weight: 600;
    color: #1890FF;
}

.budget-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.budget-section {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
}

.budget-label {
    color: #595959;
    font-weight: 500;
}

.budget-value {
    font-size: 32px;
    font-weight: 700;
    color: #FF4D4F;
}

/* 特征参数、备注、推荐模块统一样式 */

.parameters-section,
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

.section-header h2,
.parameters-section h2,
.remarks-section h2,
.recommendations-section h2 {
    font-size: 20px;
    font-weight: 600;
    color: #1A1A1A;
}

.params-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 32px;
    margin-top: 20px;
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

.param-value.linkable:hover {
    color: #40A9FF;
}

/* 备注信息 */
.remarks-content {
    font-size: 14px;
    line-height: 1.8;
    color: #595959;
    white-space: pre-wrap;
}

/* 推荐列表 */
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
    transition: all 0.3s;
}

.control-btn:hover:not(:disabled) {
    border-color: #1890FF;
    color: #1890FF;
}

.control-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.control-btn svg {
    width: 16px;
    height: 16px;
}

.recommendations-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.recommendation-card {
    border: 1px solid #F0F0F0;
    border-radius: 8px;
    padding: 16px;
    background: white;
    transition: all 0.3s;
    cursor: pointer;
}

.recommendation-card:hover {
    border-color: #1890FF;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.rec-header {
    display: flex;
    gap: 10px;
    align-items: start;
    margin-bottom: 12px;
}

.ship-icon {
    width: 24px;
    height: 24px;
    color: #1890FF;
    flex-shrink: 0;
}

.rec-title {
    font-size: 15px;
    font-weight: 600;
    color: #1A1A1A;
    line-height: 1.4;
}

.rec-params {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
}

.rec-param {
    font-size: 13px;
    color: #595959;
}

.rec-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #F0F0F0;
    margin-bottom: 12px;
}

.rec-budget {
    font-size: 16px;
    font-weight: 700;
    color: #FF4D4F;
}

.rec-time {
    font-size: 12px;
    color: #8C8C8C;
}

.rec-view-btn {
    width: 100%;
    padding: 8px;
    background: #1890FF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.3s;
}

.rec-view-btn:hover {
    background: #0D7DE0;
}

/* 右侧栏 */
.publisher-sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.publisher-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.publisher-card h3 {
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

.avatar {
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

.rating {
    display: flex;
    gap: 4px;
    margin-bottom: 4px;
}

.star-icon {
    width: 14px;
    height: 14px;
}

.badges {
    display: flex;
    gap: 6px;
    margin-top: 4px;
}

.badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.badge.verified {
    background: #E6F7FF;
    color: #1890FF;
}

.badge.premium {
    background: #FFF7E6;
    color: #FA8C16;
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
    font-weight: 500;
}



.contact-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #0EA5E9, #06B6D4);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
}

.contact-btn:hover {
    background: linear-gradient(135deg, #0284C7, #0891B2);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    transform: translateY(-2px);
}

.contact-btn:active {
    transform: translateY(0);
}

@media (max-width: 1200px) {
    .detail-container {
        grid-template-columns: 1fr;
    }

    .params-grid {
        grid-template-columns: 1fr;
    }

    .recommendations-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<template>
    <div class="intention-container">
        <!-- Search & Filter Section -->
        <div class="search-filter-section">
            <div class="header-content">
                <h1 class="page-title">修造意向</h1>
            </div>

            <div class="search-card">
                <div class="search-main-row">
                    <div class="search-input-group">
                        <div class="input-with-icon">
                            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input v-model="searchKeyword" type="text" placeholder="搜索意向编号、服务商信息..." class="modern-input"
                                @input="applyFilters">
                        </div>
                    </div>

                    <div class="filter-group">
                        <div class="select-item">
                            <span class="select-label">类型</span>
                            <select v-model="filterType" @change="applyFilters" class="modern-select">
                                <option value="">全部类型</option>
                                <option value="design">设计</option>
                                <option value="building">建造</option>
                                <option value="repair">维修</option>
                            </select>
                        </div>

                        <div class="select-item">
                            <span class="select-label">状态</span>
                            <select v-model="filterStatus" @change="applyFilters" class="modern-select">
                                <option value="">全部状态</option>
                                <option value="pending">待处理</option>
                                <option value="accepted">已接受</option>
                                <option value="rejected">已拒绝</option>
                            </select>
                        </div>

                        <div class="select-item">
                            <span class="select-label">开始日期</span>
                            <input v-model="dateStart" type="date" @change="applyFilters" class="modern-date">
                        </div>

                        <div class="select-item">
                            <span class="select-label">结束日期</span>
                            <input v-model="dateEnd" type="date" @change="applyFilters" class="modern-date">
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button class="btn-reset-new" @click="resetFilters">重置</button>
                        <button class="btn-search-new" @click="applyFilters">查询</button>
                    </div>
                </div>

                <div v-if="hasActiveFilters" class="tags-container">
                    <span class="tags-label">当前筛选：</span>
                    <div class="tags-list">
                        <span v-if="searchKeyword" class="modern-tag">
                            关键词: {{ searchKeyword }}
                            <i @click="searchKeyword = ''; applyFilters()">✕</i>
                        </span>
                        <span v-if="filterType" class="modern-tag">
                            类型: {{ getTypeLabel(filterType) }}
                            <i @click="filterType = ''; applyFilters()">✕</i>
                        </span>
                        <span v-if="filterStatus" class="modern-tag">
                            状态: {{ getStatusLabel(filterStatus) }}
                            <i @click="filterStatus = ''; applyFilters()">✕</i>
                        </span>
                        <span v-if="dateStart" class="modern-tag">
                            开始: {{ dateStart }}
                            <i @click="dateStart = ''; applyFilters()">✕</i>
                        </span>
                        <span v-if="dateEnd" class="modern-tag">
                            结束: {{ dateEnd }}
                            <i @click="dateEnd = ''; applyFilters()">✕</i>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Intentions Grid -->
        <div class="intentions-grid">
            <div v-for="intention in paginatedIntentions" :key="intention.id" class="intention-card"
                @click="navigateToDetail(intention)">
                <div class="card-content">
                    <div class="card-header">
                        <div class="title-section">
                            <div class="type-badge" :class="`type-${intention.type}`">
                                {{ getTypeLabel(intention.type) }}
                            </div>
                            <h3 class="card-title">{{ intention.title }}</h3>
                            <span class="status-label" :class="`status-${intention.status}`">
                                {{ getStatusLabel(intention.status) }}
                            </span>
                        </div>
                    </div>

                    <div class="card-info">
                        <div class="info-item">
                            <span class="info-label">意向编号</span>
                            <span class="info-value">{{ intention.intentionNo }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">服务商</span>
                            <span class="info-value">{{ intention.provider }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">时间</span>
                            <span class="info-value">{{ intention.submitTime }}</span>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="action-buttons-group">
                        <button class="btn-detail" @click.stop="viewDetail(intention.id)">查看详情</button>
                        <!-- 对方发来的意向，且待处理时显示接受拒绝按钮 -->
                        <template v-if="intention.status === 'pending' && !intention.initiator">
                            <button class="btn-accept" @click.stop="handleAccept(intention.id)">接受</button>
                            <button class="btn-reject" @click.stop="handleReject(intention.id)">拒绝</button>
                        </template>
                        <!-- 已接受的意向显示选为服务供应商或前往服务中心 -->
                        <template v-if="intention.status === 'accepted'">
                            <button 
                                v-if="!intention.selectedAsProvider" 
                                class="btn-select-provider" 
                                @click.stop="handleSelectProvider(intention.id)"
                            >
                                选为服务供应商
                            </button>
                            <button 
                                v-else
                                class="btn-service-center" 
                                @click.stop="goToServiceCenter"
                            >
                              前往服务中心
                            </button>
                        </template>
                        <!-- 我发起的意向，等待对方接受 -->
                        <template v-if="intention.initiator && intention.status === 'pending'">
                            <span class="waiting-status">等待对方接受中...</span>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredIntentions.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>暂无数据</h3>
                <p>还没有修造意向记录</p>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredIntentions.length > 0" class="pagination-section">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
            <div class="page-numbers">
                <button v-for="page in displayPages" :key="page" class="page-num"
                    :class="{ active: page === currentPage, ellipsis: page === '...' }" @click="currentPage = page"
                    :disabled="page === '...'">
                    {{ page }}
                </button>
            </div>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
            <div class="page-info">共 {{ filteredIntentions.length }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页</div>
        </div>

        <!-- Detail Modal -->
        <div v-if="detailVisible" class="modal-overlay" @click.self="detailVisible = false">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>意向详情</h2>
                    <button class="close-btn" @click="detailVisible = false">✕</button>
                </div>

                <div class="modal-body">
                    <div class="detail-section">
                        <h3>意向信息</h3>
                        <div class="detail-row">
                            <span class="detail-label">意向编号</span>
                            <span class="detail-value">{{ selectedIntention?.intentionNo }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">服务类型</span>
                            <span class="detail-value">{{ getTypeLabel(selectedIntention?.type) }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">服务商</span>
                            <span class="detail-value">{{ selectedIntention?.provider }} ({{
                                selectedIntention?.phone
                            }})</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">提交时间</span>
                            <span class="detail-value">{{ selectedIntention?.submitTime }}</span>
                        </div>
                    </div>

                    <div v-if="selectedIntention?.status !== 'pending'" class="detail-section">
                        <h3>对接信息</h3>
                        <div class="detail-row">
                            <span class="detail-label">对接结果</span>
                            <span class="detail-value">{{ getStatusLabel(selectedIntention?.status) }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">对接时间</span>
                            <span class="detail-value">{{ selectedIntention?.dockingTime }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 选定服务供应商确认对话框 -->
        <div v-if="selectProviderDialogVisible" class="modal-overlay" @click.self="selectProviderDialogVisible = false">
            <div class="modal-content confirmation-dialog">
                <div class="modal-header">
                    <h2>选定服务供应商</h2>
                    <button class="close-btn" @click="selectProviderDialogVisible = false">✕</button>
                </div>
                <div class="modal-body">
                    <p class="confirm-message">确认选定 {{ pendingProviderName }} 为服务供应商？</p>
                    <p class="confirm-subtitle">选定后，同需求的其他意向将关闭。此操作不可撤销</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="selectProviderDialogVisible = false">取消</button>
                    <button class="btn-confirm" @click="confirmSelectProvider">确认选定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// States
const searchKeyword = ref('')
const filterType = ref('')
const filterStatus = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const detailVisible = ref(false)
const selectedIntention = ref(null)
const selectProviderDialogVisible = ref(false)
const pendingProviderName = ref('')
const pendingProviderId = ref(null)

// Mock data
const intentions = ref([
    { 
        id: 1, 
        type: 'design', 
        title: '5万吨散货船设计方案', 
        intentionNo: 'R2026010001', 
        provider: 'XX船舶设计研究所', 
        status: 'pending',
        initiator: false,
        submitTime: '2026-01-20 10:30', 
        phone: '021-12345678', 
        providerId: 1,
        dockingTime: '',
        selectedAsProvider: false
    },
    { 
        id: 2, 
        type: 'building', 
        title: '3500吨集装箱船建造', 
        intentionNo: 'R2026010002', 
        provider: '青岛XX造船厂', 
        status: 'accepted',
        initiator: false,
        submitTime: '2026-01-18 14:20', 
        phone: '0532-98765432', 
        providerId: 2,
        dockingTime: '2026-01-19 09:15',
        selectedAsProvider: false
    },
    { 
        id: 3, 
        type: 'repair', 
        title: '主机维修保养', 
        intentionNo: 'R2026010003', 
        provider: '上海XX船舶修理厂', 
        status: 'rejected',
        initiator: false,
        submitTime: '2026-01-15 09:45', 
        phone: '021-87654321', 
        providerId: 3,
        dockingTime: '',
        selectedAsProvider: false
    },
    { 
        id: 4, 
        type: 'design', 
        title: '油轮改装设计', 
        intentionNo: 'R2026010004', 
        provider: '中船设计院', 
        status: 'pending',
        initiator: true,
        submitTime: '2026-01-22 11:15', 
        phone: '010-66778899', 
        providerId: 4,
        dockingTime: '',
        selectedAsProvider: false
    },
    { 
        id: 5, 
        type: 'building', 
        title: '散货船建造', 
        intentionNo: 'R2026010005', 
        provider: '大连XX船舶重工', 
        status: 'accepted',
        initiator: false,
        submitTime: '2026-01-17 13:30', 
        phone: '0411-55443322', 
        providerId: 5,
        dockingTime: '2026-01-18 10:20',
        selectedAsProvider: false
    },
    { 
        id: 6, 
        type: 'repair', 
        title: '船体检修', 
        intentionNo: 'R2026010006', 
        provider: '舟山XX修船厂', 
        status: 'pending',
        initiator: true,
        submitTime: '2026-01-21 15:50', 
        phone: '0580-33221100', 
        providerId: 6,
        dockingTime: '',
        selectedAsProvider: false
    }
])

// Computed
const filteredIntentions = computed(() => {
    let result = intentions.value

    if (searchKeyword.value) {
        result = result.filter(i =>
            i.intentionNo.includes(searchKeyword.value) ||
            i.provider.includes(searchKeyword.value) ||
            i.title.includes(searchKeyword.value)
        )
    }

    if (filterType.value) {
        result = result.filter(i => i.type === filterType.value)
    }

    if (filterStatus.value) {
        result = result.filter(i => i.status === filterStatus.value)
    }

    if (dateStart.value) {
        result = result.filter(i => i.submitTime >= dateStart.value)
    }

    if (dateEnd.value) {
        result = result.filter(i => i.submitTime <= dateEnd.value)
    }

    return result
})

const hasActiveFilters = computed(() => {
    return searchKeyword.value || filterType.value || filterStatus.value || dateStart.value || dateEnd.value
})

const totalPages = computed(() => Math.ceil(filteredIntentions.value.length / itemsPerPage))

const paginatedIntentions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredIntentions.value.slice(start, start + itemsPerPage)
})

const displayPages = computed(() => {
    const pages = []
    const maxShow = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxShow / 2))
    let end = Math.min(totalPages.value, start + maxShow - 1)

    if (end - start < maxShow - 1) {
        start = Math.max(1, end - maxShow + 1)
    }

    if (start > 1) pages.push(1)
    if (start > 2) pages.push('...')

    for (let i = start; i <= end; i++) pages.push(i)

    if (end < totalPages.value - 1) pages.push('...')
    if (end < totalPages.value) pages.push(totalPages.value)

    return pages
})

// Methods
const getTypeLabel = (type) => {
    const labels = {
        design: '设计',
        building: '建造',
        repair: '维修'
    }
    return labels[type] || type
}

const getStatusLabel = (status) => {
    const labels = {
        pending: '待处理',
        accepted: '已接受',
        rejected: '已拒绝'
    }
    return labels[status] || status
}

const applyFilters = () => {
    currentPage.value = 1
}

const resetFilters = () => {
    searchKeyword.value = ''
    filterType.value = ''
    filterStatus.value = ''
    dateStart.value = ''
    dateEnd.value = ''
    currentPage.value = 1
}

const viewDetail = (id) => {
    selectedIntention.value = intentions.value.find(i => i.id === id)
    detailVisible.value = true
}

const handleAccept = (id) => {
    const intention = intentions.value.find(i => i.id === id)
    if (intention) {
        intention.status = 'accepted'
        intention.dockingTime = new Date().toLocaleString('zh-CN')
        console.log('[v0] 已接受意向:', id)
    }
}

const handleReject = (id) => {
    const intention = intentions.value.find(i => i.id === id)
    if (intention) {
        intention.status = 'rejected'
        console.log('[v0] 已拒绝意向:', id)
    }
}

const handleSelectProvider = (id) => {
    const intention = intentions.value.find(i => i.id === id)
    if (!intention) return
    
    pendingProviderName.value = intention.provider
    pendingProviderId.value = id
    selectProviderDialogVisible.value = true
    console.log('[v0] 打开选定供应商对话框:', id)
}

const confirmSelectProvider = () => {
    const id = pendingProviderId.value
    const intention = intentions.value.find(i => i.id === id)
    if (!intention) return
    
    console.log('[v0] 选定为服务供应商:', id)
    intention.selectedAsProvider = true
    
    // 关闭同类型的其他已接受意向
    const sameDemandType = intention.type
    intentions.value.forEach(item => {
        if (item.id !== id && item.type === sameDemandType && item.status === 'accepted') {
            item.status = 'closed'
            console.log('[v0] 关闭相同需求的意向:', item.id)
        }
    })
    
    selectProviderDialogVisible.value = false
    console.log('[v0] 已选定', intention.provider, '为服务供应商，同需求的其他意向已关闭')
}

const goToServiceCenter = () => {
    console.log('[v0] 前往服务中心')
    router.push('/user-center/service/center')
}

const navigateToDetail = (intention) => {
    console.log('[v0] 跳转到详情页:', intention.type, intention.providerId)
    // 根据类型跳转到对应的详情页
    if (intention.type === 'design') {
        router.push(`/ship-repair/provider/${intention.providerId}`)
    } else if (intention.type === 'building') {
        router.push(`/ship-repair/building/${intention.providerId}`)
    } else if (intention.type === 'repair') {
        router.push(`/ship-repair/repair/${intention.providerId}`)
    }
}
</script>

<style scoped>
/* Base Container */
.intention-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
}

/* Search & Filter Section */
.search-filter-section {
    margin-bottom: 24px;
}

.header-content {
    margin-bottom: 20px;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    color: #0F172A;
    margin: 0;
}

.search-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #E2E8F0;
}

.search-main-row {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    flex-wrap: wrap;
}

.search-input-group {
    flex: 1;
    min-width: 240px;
}

.input-with-icon {
    position: relative;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #94A3B8;
    pointer-events: none;
}

.modern-input {
    width: 100%;
    padding: 10px 14px 10px 42px;
    border: 1.5px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    color: #0F172A;
    background: white;
    transition: all 0.3s;
}

.modern-input:focus {
    outline: none;
    border-color: #0EA5E9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

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
    color: #64748B;
}

.modern-select,
.modern-date {
    padding: 10px 14px;
    border: 1.5px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    color: #0F172A;
    background: white;
    transition: all 0.3s;
    min-width: 140px;
}

.modern-select:focus,
.modern-date:focus {
    outline: none;
    border-color: #0EA5E9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.btn-reset-new,
.btn-search-new {
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
}

.btn-reset-new {
    background: #F1F5F9;
    color: #64748B;
}

.btn-reset-new:hover {
    background: #E2E8F0;
}

.btn-search-new {
    background: #0EA5E9;
    color: white;
}

.btn-search-new:hover {
    background: #0284C7;
}

/* Tags Container */
.tags-container {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #E2E8F0;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.tags-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748B;
}

.tags-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.modern-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: #EFF6FF;
    color: #0284C7;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
}

.modern-tag i {
    cursor: pointer;
    font-style: normal;
    font-weight: 700;
    opacity: 0.6;
    transition: opacity 0.3s;
}

.modern-tag i:hover {
    opacity: 1;
}

/* Intentions Grid */
.intentions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.intention-card {
    background: white;
    border-radius: 12px;
    border: 1.5px solid #E2E8F0;
    overflow: hidden;
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.intention-card:hover {
    border-color: #0EA5E9;
    box-shadow: 0 8px 16px rgba(14, 165, 233, 0.1);
    transform: translateY(-2px);
}

.card-content {
    padding: 20px;
    flex: 1;
}

.card-header {
    margin-bottom: 16px;
}

.title-section {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.type-badge {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.type-design {
    background: #DBEAFE;
    color: #1E40AF;
}

.type-building {
    background: #D1FAE5;
    color: #065F46;
}

.type-repair {
    background: #FEF3C7;
    color: #92400E;
}

.card-title {
    font-size: 16px;
    font-weight: 700;
    color: #0F172A;
    margin: 0;
    flex: 1;
}

.status-label {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.status-pending {
    background: #FEF3C7;
    color: #92400E;
}

.status-accepted {
    background: #D1FAE5;
    color: #065F46;
}

.status-rejected {
    background: #FEE2E2;
    color: #991B1B;
}

.card-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-label {
    font-size: 13px;
    color: #64748B;
    font-weight: 500;
}

.info-value {
    font-size: 14px;
    color: #0F172A;
    font-weight: 600;
}

.card-footer {
    padding: 16px 20px;
    background: #F8FAFC;
    border-top: 1px solid #E2E8F0;
}

.action-buttons-group {
    display: flex;
    gap: 8px;
}

.btn-detail,
.btn-accept,
.btn-reject {
    flex: 1;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
}

.btn-detail {
    background: #F1F5F9;
    color: #475569;
}

.btn-detail:hover {
    background: #E2E8F0;
}

.btn-accept {
    background: #10B981;
    color: white;
}

.btn-accept:hover {
    background: #059669;
}

.btn-reject {
    background: #EF4444;
    color: white;
}

.btn-reject:hover {
    background: #FCA5A5;
    color: white;
}

.btn-select-provider {
    flex: 1;
    padding: 10px 16px;
    border: none;
    background: #10B981;
    color: white;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-select-provider:hover {
    background: #059669;
}

.btn-service-center {
    flex: 1;
    padding: 10px 16px;
    border: none;
    background: #6366F1;
    color: white;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-service-center:hover {
    background: #4F46E5;
}

.waiting-status {
    flex: 1;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #F59E0B;
    background: #FEF3C7;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 64px 24px;
    color: #94A3B8;
}

.empty-state svg {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    opacity: 0.5;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #E2E8F0;
}

.modal-header h2 {
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #94A3B8;
    cursor: pointer;
    transition: color 0.3s;
}

.close-btn:hover {
    color: #0F172A;
}

.modal-body {
    padding: 24px;
}

/* Modal Footer */
.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #E2E8F0;
    background: #F8FAFC;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.btn-cancel {
    padding: 10px 20px;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    background: white;
    color: #475569;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cancel:hover {
    background: #F1F5F9;
    border-color: #CBD5E1;
}

.btn-confirm {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    background: #0EA5E9;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-confirm:hover {
    background: #0284C7;
}

.confirmation-dialog {
    max-width: 400px;
}

.confirm-message {
    font-size: 15px;
    font-weight: 600;
    color: #0F172A;
    margin: 0 0 8px 0;
}

.confirm-subtitle {
    font-size: 13px;
    color: #64748B;
    margin: 0;
}

/* Detail Sections */
.detail-section {
    margin-bottom: 24px;
}

.detail-section:last-child {
    margin-bottom: 0;
}

.detail-section h3 {
    font-size: 14px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #E2E8F0;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #F1F5F9;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748B;
}

.detail-value {
    font-size: 14px;
    color: #0F172A;
    font-weight: 500;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.empty-state h3 {
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 8px 0;
}

.empty-state p {
    font-size: 14px;
    color: #64748B;
    margin: 0;
}

/* Pagination */
.pagination-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    padding: 20px 0;
}

.page-btn {
    padding: 8px 16px;
    border: 1.5px solid #E2E8F0;
    background: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #0F172A;
    cursor: pointer;
    transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
    border-color: #0EA5E9;
    color: #0EA5E9;
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 6px;
}

.page-num {
    width: 36px;
    height: 36px;
    border: 1.5px solid #E2E8F0;
    background: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #0F172A;
    cursor: pointer;
    transition: all 0.3s;
}

.page-num:hover:not(.ellipsis):not(.active) {
    border-color: #0EA5E9;
    color: #0EA5E9;
}

.page-num.active {
    background: #0EA5E9;
    border-color: #0EA5E9;
    color: white;
}

.page-num.ellipsis {
    cursor: default;
    border: none;
}

.page-info {
    font-size: 13px;
    color: #64748B;
    font-weight: 500;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #E2E8F0;
}

.modal-header h2 {
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
    margin: 0;
}

.close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: #F1F5F9;
    border-radius: 6px;
    font-size: 18px;
    color: #64748B;
    cursor: pointer;
    transition: all 0.3s;
}

.close-btn:hover {
    background: #E2E8F0;
    color: #0F172A;
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
}

.detail-section {
    margin-bottom: 24px;
}

.detail-section:last-child {
    margin-bottom: 0;
}

.detail-section h3 {
    font-size: 16px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 16px 0;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #F1F5F9;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-label {
    font-size: 14px;
    color: #64748B;
    font-weight: 500;
}

.detail-value {
    font-size: 14px;
    color: #0F172A;
    font-weight: 600;
    text-align: right;
}

@media (max-width: 768px) {
    .intentions-grid {
        grid-template-columns: 1fr;
    }

    .search-main-row {
        flex-direction: column;
    }

    .filter-group {
        width: 100%;
    }

    .select-item {
        flex: 1;
    }
}
</style>

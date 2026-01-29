<template>
    <div class="verification-container">
        <!-- Search & Filter Section -->
        <div class="search-filter-section">
            <div class="header-content">
                <h1 class="page-title">交易鉴证中心</h1>
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
                            <input v-model="searchKeyword" type="text" placeholder="搜索鉴证编号、对方信息..." class="modern-input"
                                @input="applyFilters">
                        </div>
                    </div>

                    <div class="filter-group">
                        <div class="select-item">
                            <span class="select-label">状态</span>
                            <select v-model="filterStatus" @change="applyFilters" class="modern-select">
                                <option value="">全部状态</option>
                                <option value="pending">进行中</option>
                                <option value="completed">已完成</option>
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

        <!-- Verifications Grid -->
        <div class="verifications-grid">
            <div v-for="verification in filteredVerifications" :key="verification.id" class="verification-card">
                <div class="card-content">
                    <div class="card-header">
                        <div class="title-section">
                            <h3 class="card-title">{{ verification.type }}: {{ verification.title }}</h3>
                            <span class="status-label" :class="`status-${verification.status}`">
                                {{ getStatusLabel(verification.status) }}
                            </span>
                        </div>
                    </div>

                    <div class="card-info">
                        <div class="info-item">
                            <span class="info-label">鉴证编号</span>
                            <span class="info-value">{{ verification.verificationNo }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">对方</span>
                            <span class="info-value">{{ verification.counterparty }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">时间</span>
                            <span class="info-value">{{ verification.submitTime }}</span>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <button class="btn-detail" @click="viewDetail(verification.id)">查看详情</button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredVerifications.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>暂无数据</h3>
                <p>还没有交易鉴证记录</p>
            </div>
        </div>

        <!-- Detail Modal -->
        <div v-if="detailVisible" class="modal-overlay" @click.self="detailVisible = false">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>鉴证详情</h2>
                    <button class="close-btn" @click="detailVisible = false">✕</button>
                </div>

                <div class="modal-body">
                    <div class="detail-section">
                        <h3>鉴证信息</h3>
                        <div class="detail-row">
                            <span class="detail-label">鉴证编号</span>
                            <span class="detail-value">{{ selectedVerification?.verificationNo }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">对方信息</span>
                            <span class="detail-value">{{ selectedVerification?.counterparty }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">鉴证内容</span>
                            <span class="detail-value">{{ selectedVerification?.content }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">提交时间</span>
                            <span class="detail-value">{{ selectedVerification?.submitTime }}</span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3>鉴证状态</h3>
                        <div class="detail-row">
                            <span class="detail-label">当前进度</span>
                            <span class="detail-value">{{ getStatusLabel(selectedVerification?.status) }}</span>
                        </div>
                        <div v-if="selectedVerification?.status === 'completed'" class="detail-row">
                            <span class="detail-label">完成时间</span>
                            <span class="detail-value">{{ selectedVerification?.completedTime }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// States
const searchKeyword = ref('')
const filterStatus = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const detailVisible = ref(false)
const selectedVerification = ref(null)

// Mock verifications data
const verifications = ref([
    {
        id: 1,
        verificationNo: 'Y2025012600001',
        type: '出售',
        title: '散货船 "OCEAN STAR"',
        counterparty: '张某',
        status: 'pending',
        submitTime: '2026-02-05',
        content: '船舶状况鉴证',
        completedTime: ''
    },
    {
        id: 2,
        verificationNo: 'Y2025012600002',
        type: '求购',
        title: '5.7万吨散货船',
        counterparty: '江某',
        status: 'pending',
        submitTime: '2026-02-04',
        content: '交易鉴证',
        completedTime: ''
    },
    {
        id: 3,
        verificationNo: 'Y2025012600003',
        type: '出售',
        title: '集装箱船 "PACIFIC LINK"',
        counterparty: '赵某',
        status: 'completed',
        submitTime: '2026-02-03',
        content: '船舶状况鉴证',
        completedTime: '2026-02-05'
    }
])

// Computed
const allVerifications = computed(() => verifications.value.length)

const filteredVerifications = computed(() => {
    let result = verifications.value

    if (searchKeyword.value) {
        result = result.filter(v =>
            v.verificationNo.includes(searchKeyword.value) ||
            v.counterparty.includes(searchKeyword.value) ||
            v.title.includes(searchKeyword.value)
        )
    }

    if (filterStatus.value) {
        result = result.filter(v => v.status === filterStatus.value)
    }

    if (dateStart.value) {
        result = result.filter(v => v.submitTime >= dateStart.value)
    }

    if (dateEnd.value) {
        result = result.filter(v => v.submitTime <= dateEnd.value)
    }

    return result
})

const hasActiveFilters = computed(() => {
    return searchKeyword.value || filterStatus.value || dateStart.value || dateEnd.value
})

// Methods
const getStatusLabel = (status) => {
    const labels = {
        pending: '进行中',
        completed: '已完成'
    }
    return labels[status] || status
}

const applyFilters = () => {
    console.log('[v0] 应用筛选条件')
}

const resetFilters = () => {
    searchKeyword.value = ''
    filterStatus.value = ''
    dateStart.value = ''
    dateEnd.value = ''
}

const viewDetail = (id) => {
    selectedVerification.value = verifications.value.find(v => v.id === id)
    detailVisible.value = true
}

onMounted(() => {
    const intentionId = route.query.intentionId
    if (intentionId) {
        console.log('[v0] 从意向跳转过来，意向ID:', intentionId)
    }
})
</script>

<style scoped>
.verification-container {
    background-color: #FFFFFF;
    min-height: 100vh;
}

.search-filter-section {
    margin-bottom: 32px;
}

.header-content {
    margin-bottom: 20px;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    color: #0F172A;
    margin: 0;
    letter-spacing: -0.5px;
}

.search-card {
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.search-main-row {
    display: flex;
    gap: 16px;
    align-items: flex-end;
    flex-wrap: wrap;
}

.search-input-group {
    flex: 1;
    min-width: 200px;
}

.input-with-icon {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 12px;
    width: 18px;
    height: 18px;
    color: #64748B;
    pointer-events: none;
}

.modern-input {
    width: 100%;
    padding: 11px 14px 11px 38px;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    background-color: #FFFFFF;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.modern-input:hover {
    border-color: #94A3B8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.modern-input:focus {
    outline: none;
    border-color: #0EA5E9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.08);
}

.filter-group {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    flex-wrap: wrap;
}

.select-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 140px;
}

.select-label {
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}

.modern-select,
.modern-date {
    padding: 10px 12px;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    background-color: #FFFFFF;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.modern-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23475569' d='M8 11L3 6h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
    padding-right: 30px;
}

.modern-select:hover,
.modern-date:hover {
    border-color: #94A3B8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.modern-select:focus,
.modern-date:focus {
    outline: none;
    border-color: #0EA5E9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.08);
}

.action-buttons {
    display: flex;
    gap: 12px;
}

.btn-reset-new,
.btn-search-new {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
}

.btn-reset-new {
    border: 1px solid #E2E8F0;
    background-color: #FFFFFF;
    color: #64748B;
}

.btn-reset-new:hover {
    background-color: #F8FAFC;
    border-color: #94A3B8;
}

.btn-search-new {
    background: linear-gradient(135deg, #0EA5E9, #06B6D4);
    color: white;
    border: none;
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
}

.btn-search-new:hover {
    background: linear-gradient(135deg, #0284C7, #0891B2);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    transform: translateY(-2px);
}

.tags-container {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
}

.tags-label {
    font-size: 12px;
    font-weight: 600;
    color: #64748B;
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.modern-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%);
    border: 1px solid #BFDBFE;
    border-radius: 20px;
    font-size: 12px;
    color: #1E40AF;
    font-weight: 500;
}

.modern-tag i {
    cursor: pointer;
    font-style: normal;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.modern-tag i:hover {
    opacity: 1;
}

/* Verifications Grid */
.verifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
}

.verification-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.verification-card:hover {
    border-color: #0EA5E9;
    box-shadow: 0 8px 24px rgba(14, 165, 233, 0.12);
    transform: translateY(-4px);
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
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
}

.card-title {
    font-size: 15px;
    font-weight: 600;
    color: #0F172A;
    margin: 0;
    line-height: 1.4;
    flex: 1;
}

.status-label {
    font-size: 12px;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 6px;
    white-space: nowrap;
}

.status-pending {
    background: #FEF3C7;
    color: #D97706;
}

.status-completed {
    background: #D1FAE5;
    color: #059669;
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
    font-size: 13px;
}

.info-label {
    color: #64748B;
    font-weight: 500;
}

.info-value {
    color: #0F172A;
    font-weight: 600;
    text-align: right;
}

.card-footer {
    padding: 12px 20px;
    border-top: 1px solid #E2E8F0;
    background: #F8FAFC;
}

.btn-detail {
    width: 100%;
    padding: 8px 12px;
    background: #F1F5F9;
    color: #475569;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-detail:hover {
    background: #E2E8F0;
    border-color: #CBD5E1;
}

/* Empty State */
.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.empty-state h3 {
    font-size: 16px;
    font-weight: 600;
    color: #0F172A;
    margin: 0 0 8px 0;
}

.empty-state p {
    font-size: 14px;
    color: #64748B;
    margin: 0;
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
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
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

.detail-section {
    margin-bottom: 24px;
}

.detail-section:last-child {
    margin-bottom: 0;
}

.detail-section h3 {
    margin: 0 0 16px 0;
    font-size: 14px;
    font-weight: 700;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
    color: #64748B;
    font-weight: 500;
    font-size: 14px;
}

.detail-value {
    color: #0F172A;
    font-weight: 600;
    font-size: 14px;
    text-align: right;
}

@media (max-width: 768px) {
    .search-main-row {
        flex-direction: column;
        gap: 12px;
    }

    .search-input-group {
        min-width: 100%;
    }

    .filter-group {
        width: 100%;
        flex-direction: column;
    }

    .select-item {
        width: 100%;
        min-width: auto;
    }

    .modern-select,
    .modern-date {
        width: 100%;
    }

    .verifications-grid {
        grid-template-columns: 1fr;
    }
}
</style>

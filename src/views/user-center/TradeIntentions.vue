<template>
    <div class="intention-records-page">
        <h1 class="page-title">交易意向记录</h1>

        <!-- Search & Filter Bar -->
        <div class="filter-bar">
            <div class="search-box">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                <input v-model="searchKeyword" type="text" placeholder="搜索意向编号、对方信息..." @input="handleSearch">
            </div>

            <div class="filters">
                <div class="filter-item">
                    <label>状态</label>
                    <select v-model="filterStatus" @change="applyFilters">
                        <option value="">全部</option>
                        <option value="pending">待处理</option>
                        <option value="accepted">已接受</option>
                        <option value="rejected">已拒绝</option>
                    </select>
                </div>

                <div class="filter-item">
                    <label>提交时间</label>
                    <input v-model="dateStart" type="date" placeholder="开始日期" @change="applyFilters">
                    <span class="date-separator">-</span>
                    <input v-model="dateEnd" type="date" placeholder="结束日期" @change="applyFilters">
                </div>
            </div>
        </div>

        <!-- Records Grid -->
        <div class="records-grid">
            <div v-for="record in paginatedRecords" :key="record.id" class="record-card"
                :class="`status-${record.status}`">
                <div class="card-header">
                    <h3 class="card-title">{{ record.type }}: {{ record.title }}</h3>
                    <span class="status-badge" :class="`badge-${record.status}`">
                        {{ getStatusLabel(record.status) }}
                    </span>
                </div>

                <div class="card-body">
                    <div class="info-row">
                        <span class="info-label">意向编号</span>
                        <span class="info-value">{{ record.intentionNo }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">对方信息</span>
                        <span class="info-value">{{ record.counterparty }} ({{ record.phone }})</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">提交时间</span>
                        <span class="info-value">{{ record.submitTime }}</span>
                    </div>
                </div>

                <div class="card-actions">
                    <button class="btn-outline" @click="viewDetail(record.id)">查看详情</button>
                    <button class="btn-primary" @click="handleDocking(record.id)">意向对接</button>
                </div>
            </div>

            <div v-if="filteredRecords.length === 0" class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                <p>暂无数据</p>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredRecords.length > 0" class="pagination">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
                上一页
            </button>

            <div class="page-numbers">
                <button v-for="page in displayPages" :key="page" class="page-num"
                    :class="{ active: page === currentPage }" @click="currentPage = page">
                    {{ page }}
                </button>
            </div>

            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                下一页
            </button>

            <div class="page-info">
                共 {{ filteredRecords.length }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('trading')
const searchKeyword = ref('')
const filterStatus = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const currentPage = ref(1)
const pageSize = 9

const tabs = [
    { key: 'trading', label: '交易意向记录' },
    { key: 'repair', label: '修造意向记录' },
    { key: 'bidding', label: '招标意向记录' }
]

// Mock data
const allRecords = ref([
    {
        id: 1,
        type: '求购',
        title: '求购标题名称',
        intentionNo: 'G202501260001',
        counterparty: '张思布',
        phone: '13900099882',
        submitTime: '2026-03-05 13:52:15',
        status: 'pending'
    },
    {
        id: 2,
        type: '求购',
        title: '求购标题名称',
        intentionNo: 'G202501260002',
        counterparty: '张思布',
        phone: '13900099882',
        submitTime: '2026-03-05 13:52:15',
        status: 'accepted'
    },
    {
        id: 3,
        type: '求购',
        title: '求购标题名称',
        intentionNo: 'G202501260003',
        counterparty: '张思布',
        phone: '13900099882',
        submitTime: '2026-03-05 13:52:15',
        status: 'rejected'
    },
    {
        id: 4,
        type: '求购',
        title: '求购标题名称',
        intentionNo: 'G202501260004',
        counterparty: '张思布',
        phone: '13900099882',
        submitTime: '2026-03-05 13:52:15',
        status: 'pending'
    },
    {
        id: 5,
        type: '求购',
        title: '求购标题名称',
        intentionNo: 'G202501260005',
        counterparty: '李明',
        phone: '13800138000',
        submitTime: '2026-03-06 10:20:30',
        status: 'pending'
    },
    {
        id: 6,
        type: '出售',
        title: '出售散货船',
        intentionNo: 'G202501260006',
        counterparty: '王强',
        phone: '13700137000',
        submitTime: '2026-03-07 14:35:22',
        status: 'accepted'
    },
    {
        id: 7,
        type: '求购',
        title: '求购油轮',
        intentionNo: 'G202501260007',
        counterparty: '刘洋',
        phone: '13600136000',
        submitTime: '2026-03-08 09:15:45',
        status: 'rejected'
    },
    {
        id: 8,
        type: '求购',
        title: '求购集装箱船',
        intentionNo: 'G202501260008',
        counterparty: '陈浩',
        phone: '13500135000',
        submitTime: '2026-03-09 16:42:11',
        status: 'pending'
    },
    {
        id: 9,
        type: '出售',
        title: '出售化学品船',
        intentionNo: 'G202501260009',
        counterparty: '赵敏',
        phone: '13400134000',
        submitTime: '2026-03-10 11:28:33',
        status: 'accepted'
    },
    {
        id: 10,
        type: '求购',
        title: '求购LNG船',
        intentionNo: 'G202501260010',
        counterparty: '周杰',
        phone: '13300133000',
        submitTime: '2026-03-11 15:50:27',
        status: 'pending'
    }
])

const filteredRecords = computed(() => {
    let result = allRecords.value

    // Filter by search keyword
    if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        result = result.filter(r =>
            r.intentionNo.toLowerCase().includes(keyword) ||
            r.counterparty.toLowerCase().includes(keyword) ||
            r.title.toLowerCase().includes(keyword)
        )
    }

    // Filter by status
    if (filterStatus.value) {
        result = result.filter(r => r.status === filterStatus.value)
    }

    // Filter by date range
    if (dateStart.value) {
        result = result.filter(r => r.submitTime >= dateStart.value)
    }
    if (dateEnd.value) {
        result = result.filter(r => r.submitTime <= dateEnd.value + ' 23:59:59')
    }

    return result
})

const totalPages = computed(() => Math.ceil(filteredRecords.value.length / pageSize))

const paginatedRecords = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return filteredRecords.value.slice(start, end)
})

const displayPages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i)
        }
    } else {
        if (current <= 4) {
            for (let i = 1; i <= 5; i++) pages.push(i)
            pages.push('...')
            pages.push(total)
        } else if (current >= total - 3) {
            pages.push(1)
            pages.push('...')
            for (let i = total - 4; i <= total; i++) pages.push(i)
        } else {
            pages.push(1)
            pages.push('...')
            for (let i = current - 1; i <= current + 1; i++) pages.push(i)
            pages.push('...')
            pages.push(total)
        }
    }

    return pages
})

const getStatusLabel = (status) => {
    const labels = {
        pending: '待处理',
        accepted: '已接受',
        rejected: '已拒绝'
    }
    return labels[status] || status
}

const handleSearch = () => {
    currentPage.value = 1
    console.log('[v0] 搜索关键词:', searchKeyword.value)
}

const applyFilters = () => {
    currentPage.value = 1
    console.log('[v0] 应用筛选:', { status: filterStatus.value, dateStart: dateStart.value, dateEnd: dateEnd.value })
}

const viewDetail = (id) => {
    console.log('[v0] 查看详情:', id)
}

const handleDocking = (id) => {
    console.log('[v0] 意向对接:', id)
}
</script>

<style scoped>
.intention-records-page {
    padding: 0;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: #1E293B;
    margin-bottom: 24px;
}

.page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    color: #1A1A1A;
    margin-bottom: 24px;
}

/* Tabs */
.tabs-nav {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #E5E7EB;
    margin-bottom: 32px;
}

.tab-btn {
    padding: 14px 32px;
    background: none;
    border: none;
    font-size: 15px;
    font-weight: 500;
    color: #6B7280;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;
}

.tab-btn:hover {
    color: #1890FF;
}

.tab-btn.active {
    color: #1890FF;
    font-weight: 600;
}

.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #1890FF;
}

/* Filter Bar */
.filter-bar {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    background: white;
    padding: 20px 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-box {
    flex: 1;
    position: relative;
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #9CA3AF;
}

.search-box input {
    width: 100%;
    padding: 12px 16px 12px 48px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
}

.search-box input:focus {
    outline: none;
    border-color: #1890FF;
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.filters {
    display: flex;
    gap: 16px;
}

.filter-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.filter-item label {
    font-size: 14px;
    color: #6B7280;
    font-weight: 500;
    white-space: nowrap;
}

.filter-item select,
.filter-item input[type="date"] {
    padding: 10px 12px;
    border: 1px solid #E5E7EB;
    border-radius: 6px;
    font-size: 14px;
    color: #374151;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
}

.filter-item select:focus,
.filter-item input[type="date"]:focus {
    outline: none;
    border-color: #1890FF;
}

.date-separator {
    color: #9CA3AF;
    margin: 0 4px;
}

/* Records Grid */
.records-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 32px;
}

.record-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s;
    border-left: 4px solid transparent;
}

.record-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.record-card.status-pending {
    border-left-color: #F59E0B;
}

.record-card.status-accepted {
    border-left-color: #10B981;
}

.record-card.status-rejected {
    border-left-color: #EF4444;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 20px;
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #1A1A1A;
    line-height: 1.4;
    flex: 1;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}

.badge-pending {
    background: #FEF3C7;
    color: #D97706;
}

.badge-accepted {
    background: #D1FAE5;
    color: #059669;
}

.badge-rejected {
    background: #FEE2E2;
    color: #DC2626;
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
}

.info-label {
    color: #6B7280;
    font-weight: 500;
}

.info-value {
    color: #374151;
    font-weight: 600;
}

.card-actions {
    display: flex;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #F3F4F6;
}

.btn-outline,
.btn-primary {
    flex: 1;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
}

.btn-outline {
    background: white;
    color: #1890FF;
    border: 1px solid #1890FF;
}

.btn-outline:hover {
    background: #F0F9FF;
}

.btn-primary {
    background: #1890FF;
    color: white;
}

.btn-primary:hover {
    background: #0F7AD6;
}

/* Empty State */
.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
    color: #9CA3AF;
}

.empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    opacity: 0.5;
}

.empty-state p {
    font-size: 16px;
}

/* Pagination */
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 32px 0;
}

.page-btn {
    padding: 10px 20px;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
    border-color: #1890FF;
    color: #1890FF;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 8px;
}

.page-num {
    min-width: 40px;
    height: 40px;
    padding: 0 8px;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.3s;
}

.page-num:hover {
    border-color: #1890FF;
    color: #1890FF;
}

.page-num.active {
    background: #1890FF;
    color: white;
    border-color: #1890FF;
}

.page-info {
    font-size: 14px;
    color: #6B7280;
    margin-left: 16px;
}

@media (max-width: 1200px) {
    .records-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .records-grid {
        grid-template-columns: 1fr;
    }

    .filter-bar {
        flex-direction: column;
    }

    .filters {
        flex-direction: column;
    }
}
</style>

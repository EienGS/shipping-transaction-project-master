<template>
  <div class="lease-publish-demands-page">
    <div class="page-header">
      <h1 class="page-title">我的出租船舶</h1>
      <button class="btn-publish" @click="goToPublish">
        <svg viewBox="0 0 24 24" fill="none" class="icon">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        发布出租信息
      </button>
    </div>

    <!-- 筛选器 -->
    <div class="filters-bar">
      <div class="filter-group">
        <select v-model="filterStatus" class="filter-select" @change="applyFilters">
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已上架</option>
          <option value="offline">已下架</option>
          <option value="rejected">已驳回</option>
        </select>

        <select v-model="filterType" class="filter-select" @change="applyFilters">
          <option value="">全部类型</option>
          <option value="lease">租赁信息</option>
          <option value="idle">空船信息</option>
        </select>

        <input 
          v-model="searchKeyword" 
          type="text" 
          class="search-input" 
          placeholder="搜索船名..."
          @input="applyFilters"
        />
      </div>

      <button class="btn-reset" @click="resetFilters">重置</button>
    </div>

    <!-- 船舶卡片列表 -->
    <div class="vessels-grid">
      <div v-for="vessel in filteredVessels" :key="vessel.id" class="vessel-card">
        <div class="card-image">
          <img :src="`https://picsum.photos/seed/${vessel.id}/400/260`" alt="vessel">
          <div class="status-badge" :class="vessel.status">{{ getStatusText(vessel.status) }}</div>
          <div class="type-badge" :class="vessel.demandType">{{ vessel.demandType === 'lease' ? '租赁信息' : '空船信息' }}</div>
        </div>

        <div class="card-body">
          <div class="card-header">
            <h3 class="vessel-name">{{ vessel.vesselName || '未命名船舶' }}</h3>
            <div class="intention-badge" v-if="vessel.intentionCount > 0">
              <svg viewBox="0 0 24 24" fill="none" class="icon">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ vessel.intentionCount }}人意向
            </div>
          </div>

          <div class="vessel-meta">
            <span>{{ vessel.vesselType }}</span>
            <span class="divider">|</span>
            <span>{{ vessel.deadweight }} DWT</span>
          </div>

          <div class="vessel-info">
            <div class="info-row" v-if="vessel.demandType === 'lease'">
              <span class="label">租金:</span>
              <span class="price">¥ {{ vessel.rentalPrice }}<small>万/{{ vessel.leaseType === 'voyage' ? '航次' : '月' }}</small></span>
            </div>
            <div class="info-row" v-if="vessel.demandType === 'idle'">
              <span class="label">当前位置:</span>
              <span class="value">{{ vessel.currentLocation }}</span>
            </div>
            <div class="info-row">
              <span class="label">发布时间:</span>
              <span class="value">{{ vessel.publishDate }}</span>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-detail" @click="viewDetail(vessel.id)">查看详情</button>
            <button class="btn-edit" @click="editVessel(vessel.id)">编辑</button>
            <button 
              v-if="vessel.status === 'approved'" 
              class="btn-offline" 
              @click="confirmOffline(vessel.id)"
            >
              下架
            </button>
            <button 
              v-if="vessel.status === 'offline'" 
              class="btn-online" 
              @click="confirmOnline(vessel.id)"
            >
              上架
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredVessels.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" class="empty-icon">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="empty-text">暂无出租船舶信息</p>
      <button class="btn-empty-publish" @click="goToPublish">立即发布</button>
    </div>

    <!-- 编辑模态框 - 根据类型显示不同表单 -->
    <div v-if="editModalVisible" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>编辑{{ editingVessel?.demandType === 'lease' ? '租赁' : '空船' }}信息</h2>
          <button class="close-btn" @click="closeEditModal">✕</button>
        </div>

        <div class="modal-body-wrapper">
          <form @submit.prevent="saveEdit" class="modal-form">
            <!-- 根据类型显示不同的表单,字段参考PublishLease.vue 和 PublishIdle.vue -->
            <p style="padding: 40px; text-align: center; color: #64748b;">编辑表单（字段参考PublishLease.vue和PublishIdle.vue）</p>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="closeEditModal">取消</button>
          <button type="button" class="btn-save" @click="saveEdit">保存修改</button>
        </div>
      </div>
    </div>

    <!-- 确认对话框 -->
    <div v-if="confirmDialogVisible" class="modal-overlay" @click.self="confirmDialogVisible = false">
      <div class="modal-content confirm">
        <div class="modal-header">
          <h2>{{ confirmTitle }}</h2>
          <button class="close-btn" @click="confirmDialogVisible = false">✕</button>
        </div>
        <div class="modal-body">
          <p>{{ confirmMessage }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="confirmDialogVisible = false">取消</button>
          <button class="btn-confirm" @click="handleConfirm">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选器状态
const filterStatus = ref('')
const filterType = ref('')
const searchKeyword = ref('')

// 模态框状态
const editModalVisible = ref(false)
const confirmDialogVisible = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmAction = ref(null)
const currentVesselId = ref(null)
const editingVessel = ref(null)

// Mock 数据
const vessels = ref([
  {
    id: 1,
    demandType: 'lease',
    vesselName: '远洋货轮',
    vesselType: '散货船',
    deadweight: 32000,
    leaseType: 'time',
    rentalPrice: 35,
    status: 'approved',
    publishDate: '2026-01-15',
    intentionCount: 5
  },
  {
    id: 2,
    demandType: 'idle',
    vesselName: '海洋之星',
    vesselType: '油船',
    deadweight: 28000,
    currentLocation: '上海港',
    status: 'approved',
    publishDate: '2026-01-20',
    intentionCount: 3
  },
  {
    id: 3,
    demandType: 'lease',
    vesselName: '蓝鲸号',
    vesselType: '集装箱船',
    deadweight: 25000,
    leaseType: 'voyage',
    rentalPrice: 80,
    status: 'offline',
    publishDate: '2026-01-10',
    intentionCount: 0
  }
])

// 计算过滤后的船舶列表
const filteredVessels = computed(() => {
  let result = vessels.value

  if (filterStatus.value) {
    result = result.filter(v => v.status === filterStatus.value)
  }

  if (filterType.value) {
    result = result.filter(v => v.demandType === filterType.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(v => 
      v.vesselName?.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待审核',
    approved: '已上架',
    offline: '已下架',
    rejected: '已驳回'
  }
  return statusMap[status] || status
}

// 应用筛选
const applyFilters = () => {
  console.log('[v0] 应用筛选')
}

// 重置筛选
const resetFilters = () => {
  filterStatus.value = ''
  filterType.value = ''
  searchKeyword.value = ''
}

// 跳转到发布页面
const goToPublish = () => {
  router.push('/vessel-leasing/publish-lease')
}

// 查看详情
const viewDetail = (id) => {
  console.log('[v0] 查看详情:', id)
}

// 编辑船舶
const editVessel = (id) => {
  const vessel = vessels.value.find(v => v.id === id)
  editingVessel.value = vessel
  editModalVisible.value = true
}

// 关闭编辑模态框
const closeEditModal = () => {
  editModalVisible.value = false
  editingVessel.value = null
}

// 保存编辑
const saveEdit = () => {
  console.log('[v0] 保存编辑')
  editModalVisible.value = false
}

// 确认下架
const confirmOffline = (id) => {
  currentVesselId.value = id
  confirmTitle.value = '下架确认'
  confirmMessage.value = '确定要下架此船舶吗？'
  confirmAction.value = 'offline'
  confirmDialogVisible.value = true
}

// 确认上架
const confirmOnline = (id) => {
  currentVesselId.value = id
  confirmTitle.value = '上架确认'
  confirmMessage.value = '确定要上架此船舶吗？'
  confirmAction.value = 'online'
  confirmDialogVisible.value = true
}

// 处理确认
const handleConfirm = () => {
  const vessel = vessels.value.find(v => v.id === currentVesselId.value)
  if (vessel) {
    vessel.status = confirmAction.value === 'offline' ? 'offline' : 'approved'
  }
  confirmDialogVisible.value = false
}
</script>

<style scoped>
.lease-publish-demands-page {
  min-height: 100vh;
  background: white;
}

.page-header {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-publish {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-publish:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.btn-publish .icon {
  width: 18px;
  height: 18px;
}

/* 筛选区 */
.filters-bar {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex: 1;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover,
.filter-select:focus {
  border-color: #0ea5e9;
  outline: none;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.btn-reset {
  padding: 10px 20px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-reset:hover {
  background: #e2e8f0;
}

/* 船舶卡片网格 */
.vessels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.vessel-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.vessel-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.status-badge.pending {
  background: rgba(254, 243, 199, 0.95);
  color: #92400e;
}

.status-badge.approved {
  background: rgba(209, 250, 229, 0.95);
  color: #065f46;
}

.status-badge.offline {
  background: rgba(229, 231, 235, 0.95);
  color: #374151;
}

.status-badge.rejected {
  background: rgba(254, 226, 226, 0.95);
  color: #991b1b;
}

.type-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.type-badge.lease {
  background: rgba(59, 130, 246, 0.95);
  color: white;
}

.type-badge.idle {
  background: rgba(139, 92, 246, 0.95);
  color: white;
}

.card-body {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.vessel-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.intention-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.intention-badge .icon {
  width: 14px;
  height: 14px;
}

.vessel-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #64748b;
}

.divider {
  color: #cbd5e1;
}

.vessel-info {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row .label {
  color: #94a3b8;
}

.info-row .value {
  color: #1e293b;
  font-weight: 600;
}

.info-row .price {
  color: #f59e0b;
  font-weight: 700;
}

.price small {
  font-size: 12px;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-detail,
.btn-edit,
.btn-offline,
.btn-online {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-detail {
  background: #f1f5f9;
  color: #64748b;
}

.btn-detail:hover {
  background: #e2e8f0;
}

.btn-edit {
  background: #f0fdf4;
  color: #15803d;
}

.btn-edit:hover {
  background: #dcfce7;
}

.btn-offline {
  background: #fef2f2;
  color: #b91c1c;
}

.btn-offline:hover {
  background: #fee2e2;
}

.btn-online {
  background: #eff6ff;
  color: #1e40af;
}

.btn-online:hover {
  background: #dbeafe;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  grid-column: 1 / -1;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #cbd5e1;
  margin: 0 auto 24px;
}

.empty-text {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 24px 0;
}

.btn-empty-publish {
  padding: 12px 32px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-empty-publish:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

/* 模态框样式 */
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
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 900px;
  width: 100%;
}

.modal-content.confirm {
  max-width: 480px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #0f172a;
}

.modal-body-wrapper {
  padding: 24px;
  max-height: calc(90vh - 180px);
  overflow-y: auto;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  font-size: 15px;
  color: #475569;
  margin: 0;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save,
.btn-confirm {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.btn-cancel:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-save,
.btn-confirm {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-save:hover,
.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}
</style>

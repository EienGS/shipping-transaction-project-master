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
          <option value="time">期租</option>
          <option value="bareboat">光租</option>
          <option value="voyage">航次租船</option>
          <option value="idle">空船</option>
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
          <img :src="vessel.image || `https://picsum.photos/seed/${vessel.id}/400/260`" alt="vessel">
          <div class="status-badge" :class="vessel.status">{{ getStatusText(vessel.status) }}</div>
          <div class="type-badge" :class="`type-${vessel.leaseType}`">{{ getTypeLabel(vessel.leaseType) }}</div>
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
            <span>{{ vessel.deadweight || vessel.dwt }} DWT</span>
          </div>

          <div class="vessel-info">
            <div class="info-row" v-if="vessel.leaseType !== 'idle' && vessel.rentalPrice">
              <span class="label">租金:</span>
              <span class="price">¥ {{ vessel.rentalPrice || vessel.price }}<small>万/{{ vessel.leaseType === 'voyage' ? '航次' : '月' }}</small></span>
            </div>
            <div class="info-row" v-if="vessel.leaseType === 'idle' && vessel.currentLocation">
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
            <button class="btn-edit" @click="editVessel(vessel)">编辑</button>
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

    <!-- 编辑模态框 -->
    <div v-if="editModalVisible" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>编辑{{ editForm.leaseType === 'idle' ? '空船信息' : '租赁信息' }}</h2>
          <button class="close-btn" @click="closeEditModal">✕</button>
        </div>

        <div class="modal-body-wrapper">
          <form @submit.prevent="saveEdit" class="modal-form">
            <!-- 船舶基本信息 -->
            <div class="form-section">
              <h3 class="section-title">船舶基本信息</h3>
              
              <div class="form-row">
                <div class="form-item">
                  <label>船名</label>
                  <input v-model="editForm.vesselName" type="text" class="form-input" readonly />
                </div>
                <div class="form-item">
                  <label>IMO编号</label>
                  <input v-model="editForm.imo" type="text" class="form-input" readonly />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>船舶类型</label>
                  <input v-model="editForm.vesselType" type="text" class="form-input" readonly />
                </div>
                <div class="form-item">
                  <label>航区</label>
                  <input v-model="editForm.navigationArea" type="text" class="form-input" readonly />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>船级</label>
                  <input v-model="editForm.classificationSociety" type="text" class="form-input" />
                </div>
                <div class="form-item">
                  <label>建造厂</label>
                  <input v-model="editForm.buildPlace" type="text" class="form-input" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>建造日期</label>
                  <input v-model="editForm.buildDate" type="text" class="form-input" placeholder="2015年6月" />
                </div>
                <div class="form-item">
                  <label>船旗</label>
                  <select v-model="editForm.flag" class="form-input">
                    <option value="">请选择</option>
                    <option value="中国">中国</option>
                    <option value="巴拿马">巴拿马</option>
                    <option value="利比里亚">利比里亚</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>船籍港</label>
                  <input v-model="editForm.portOfRegistry" type="text" class="form-input" placeholder="上海" />
                </div>
                <div class="form-item">
                  <label>总吨</label>
                  <input v-model.number="editForm.grossTonnage" type="number" class="form-input" placeholder="25000" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>净吨</label>
                  <input v-model.number="editForm.netTonnage" type="number" class="form-input" placeholder="15000" />
                </div>
                <div class="form-item">
                  <label>总长（米）</label>
                  <input v-model.number="editForm.length" type="number" step="0.01" class="form-input" placeholder="185" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>型宽（米）</label>
                  <input v-model.number="editForm.width" type="number" step="0.01" class="form-input" placeholder="28" />
                </div>
                <div class="form-item">
                  <label>型深（米）</label>
                  <input v-model.number="editForm.depth" type="number" step="0.01" class="form-input" placeholder="15" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>主机功率（kW）</label>
                  <input v-model.number="editForm.mainEnginePower" type="number" class="form-input" placeholder="9480" />
                </div>
                <div class="form-item">
                  <label>主机型号</label>
                  <input v-model="editForm.mainEngineModel" type="text" class="form-input" placeholder="6S50MC" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>载重（吨）</label>
                  <input v-model.number="editForm.deadweight" type="number" class="form-input" placeholder="32000" />
                </div>
              </div>
            </div>

            <!-- 租赁信息或空船信息 -->
            <div v-if="editForm.leaseType !== 'idle'" class="form-section">
              <h3 class="section-title">租赁信息</h3>
              
              <!-- 期租/光租 -->
              <template v-if="editForm.leaseType === 'time' || editForm.leaseType === 'bareboat'">
                <div class="form-row">
                  <div class="form-item required">
                    <label>租金标准（万元/月）</label>
                    <input v-model.number="editForm.rentalPrice" type="number" step="0.01" class="form-input" placeholder="请输入租金" required />
                  </div>
                  <div class="form-item required">
                    <label>租赁期限（月）</label>
                    <input v-model="editForm.leaseDuration" type="text" class="form-input" placeholder="例: 12-24" required />
                  </div>
                </div>

                <div class="form-item full-width required">
                  <label>可租起始时间</label>
                  <input v-model="editForm.availableDate" type="date" class="form-input" required />
                </div>
              </template>

              <!-- 航次租船 -->
              <template v-if="editForm.leaseType === 'voyage'">
                <div class="form-item required">
                  <label>租金标准（万元/航次）</label>
                  <input v-model.number="editForm.rentalPrice" type="number" step="0.01" class="form-input" placeholder="请输入租金" required />
                </div>

                <div class="form-item full-width required">
                  <label>航线范围</label>
                  <input v-model="editForm.voyageRoute" type="text" class="form-input" placeholder="例: 上海-新加坡" required />
                </div>

                <div class="form-item full-width required">
                  <label>航次周期</label>
                  <input v-model="editForm.voyageCycle" type="text" class="form-input" placeholder="例: 30天" required />
                </div>
              </template>

              <div class="form-item full-width required">
                <label>租赁要求</label>
                <textarea v-model="editForm.rentalRequirements" class="form-textarea" placeholder="填写租赁要求，不超过300字" maxlength="300" rows="4" required></textarea>
                <span class="char-count">{{ editForm.rentalRequirements?.length || 0 }}/300</span>
              </div>
            </div>

            <!-- 空船信息 -->
            <div v-else class="form-section">
              <h3 class="section-title">空船信息</h3>
              
              <div class="form-item full-width required">
                <label>空船当前位置</label>
                <input v-model="editForm.currentLocation" type="text" class="form-input" placeholder="精准定位港口名称，如：上海港" required />
              </div>

              <div class="form-item full-width required">
                <label>预计可用时间</label>
                <div class="date-range">
                  <input v-model="editForm.availableDateStart" type="date" class="form-input" required />
                  <span class="separator">至</span>
                  <input v-model="editForm.availableDateEnd" type="date" class="form-input" required />
                </div>
              </div>

              <div class="form-item required">
                <label>可租赁类型</label>
                <div class="checkbox-group">
                  <label><input type="checkbox" value="time" v-model="editForm.leaseTypes"> 期租</label>
                  <label><input type="checkbox" value="bareboat" v-model="editForm.leaseTypes"> 光租</label>
                  <label><input type="checkbox" value="voyage" v-model="editForm.leaseTypes"> 航次租船</label>
                </div>
              </div>

              <div class="form-item full-width">
                <label>空船备注</label>
                <textarea v-model="editForm.remarks" class="form-textarea" placeholder="填写船舶当前状态、可承接货物类型、航线限制等（不超过200字）" maxlength="200" rows="4"></textarea>
                <span class="char-count">{{ editForm.remarks?.length || 0 }}/200</span>
              </div>
            </div>

            <!-- 联系信息 -->
            <div class="form-section">
              <h3 class="section-title">联系信息</h3>
              
              <div class="form-row">
                <div class="form-item required">
                  <label>联系人</label>
                  <input v-model="editForm.contactName" type="text" class="form-input" placeholder="请输入联系人姓名" required />
                </div>
                <div class="form-item required">
                  <label>联系电话</label>
                  <input v-model="editForm.contactPhone" type="tel" class="form-input" placeholder="请输入手机号" required />
                </div>
              </div>
            </div>
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
const editForm = ref({})

// Mock 数据
const vessels = ref([
  {
    id: 1,
    vesselName: '远洋货轮',
    imo: 'IMO9876543',
    vesselType: '散货船',
    deadweight: 32000,
    dwt: 32000,
    leaseType: 'time',
    rentalPrice: 35,
    price: 35,
    status: 'approved',
    publishDate: '2026-01-15',
    intentionCount: 5,
    navigationArea: '无限航区',
    classificationSociety: 'CCS',
    buildPlace: '大连造船厂',
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
    leaseDuration: '12-24',
    availableDate: '2026-03-01',
    rentalRequirements: '船舶状况良好，可立即投入使用',
    contactName: '张经理',
    contactPhone: '13800138000',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    vesselName: '海洋之星',
    imo: 'IMO9876544',
    vesselType: '油船',
    deadweight: 28000,
    dwt: 28000,
    leaseType: 'idle',
    currentLocation: '上海港',
    status: 'approved',
    publishDate: '2026-01-20',
    intentionCount: 3,
    navigationArea: '无限航区',
    availableDateStart: '2026-02-15',
    availableDateEnd: '2026-06-30',
    leaseTypes: ['time', 'bareboat'],
    remarks: '船况良好，可随时投入使用',
    contactName: '李经理',
    contactPhone: '13900139000',
    image: 'https://images.unsplash.com/photo-1564731071754-8f82c62e3b75?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    vesselName: '蓝鲸号',
    imo: 'IMO9876545',
    vesselType: '集装箱船',
    deadweight: 25000,
    dwt: 25000,
    leaseType: 'voyage',
    rentalPrice: 80,
    price: 80,
    status: 'offline',
    publishDate: '2026-01-10',
    intentionCount: 0,
    navigationArea: '无限航区',
    voyageRoute: '上海-新加坡',
    voyageCycle: '30天',
    rentalRequirements: '适合东南亚航线',
    contactName: '王船长',
    contactPhone: '13700137000',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop'
  }
])

// 计算过滤后的船舶列表
const filteredVessels = computed(() => {
  let result = vessels.value

  if (filterStatus.value) {
    result = result.filter(v => v.status === filterStatus.value)
  }

  if (filterType.value) {
    result = result.filter(v => v.leaseType === filterType.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(v => 
      v.vesselName?.toLowerCase().includes(keyword) ||
      v.imo?.toLowerCase().includes(keyword)
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

// 获取类型标签
const getTypeLabel = (type) => {
  const labels = {
    time: '期租',
    bareboat: '光租',
    voyage: '航次租船',
    idle: '空船'
  }
  return labels[type] || type
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
const editVessel = (vessel) => {
  editForm.value = { ...vessel }
  if (!editForm.value.leaseTypes) {
    editForm.value.leaseTypes = []
  }
  editModalVisible.value = true
}

// 关闭编辑模态框
const closeEditModal = () => {
  editModalVisible.value = false
  editForm.value = {}
}

// 保存编辑
const saveEdit = () => {
  console.log('[v0] 保存编辑:', editForm.value)
  const index = vessels.value.findIndex(v => v.id === editForm.value.id)
  if (index !== -1) {
    vessels.value[index] = { ...editForm.value }
  }
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

.type-badge.type-time {
  background: rgba(59, 130, 246, 0.95);
  color: white;
}

.type-badge.type-bareboat {
  background: rgba(139, 92, 246, 0.95);
  color: white;
}

.type-badge.type-voyage {
  background: rgba(245, 158, 11, 0.95);
  color: white;
}

.type-badge.type-idle {
  background: rgba(16, 185, 129, 0.95);
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  flex-shrink: 0;
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
  flex: 1;
  overflow-y: auto;
  padding: 24px;
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
  flex-shrink: 0;
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

/* 表单样式 */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;
}

.form-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 20px 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item.full-width {
  grid-column: 1 / -1;
}

.form-item.required label::after {
  content: '*';
  color: #ef4444;
  margin-left: 4px;
}

.form-item label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.form-input,
.form-textarea {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-input[readonly] {
  background: #f8fafc;
  color: #64748b;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  font-size: 12px;
  color: #94a3b8;
  text-align: right;
  margin-top: -4px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-range .separator {
  color: #94a3b8;
}

.checkbox-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  cursor: pointer;
}
</style>

<template>
  <div class="lease-publish-demands-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1>出租需求列表</h1>
      <p>管理我发布的出租需求，包括租赁信息和空船信息</p>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索船名、船舶识别号..." 
          class="search-input"
        />
      </div>
      
      <div class="filter-group">
        <select v-model="filterType" class="filter-select">
          <option value="">全部类型</option>
          <option value="lease">租赁信息</option>
          <option value="idle">空船信息</option>
        </select>
      </div>

      <div class="filter-group">
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已发布</option>
          <option value="rejected">已驳回</option>
        </select>
      </div>

      <button class="btn-reset" @click="resetFilters">重置</button>
    </div>

    <!-- Demands Grid -->
    <div class="demands-grid">
      <div v-if="filteredDemands.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p>暂无出租需求</p>
      </div>

      <div v-for="demand in filteredDemands" :key="demand.id" class="demand-card">
        <div class="card-header">
          <span class="demand-type-badge" :class="demand.demandType">{{ getDemandTypeLabel(demand.demandType) }}</span>
          <span class="status-badge" :class="demand.status">{{ getStatusLabel(demand.status) }}</span>
        </div>

        <div class="card-content">
          <h3>{{ demand.vesselName || '未命名船舶' }}</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">船舶类型:</span>
              <span class="value">{{ demand.vesselType }}</span>
            </div>
            <div class="info-item">
              <span class="label">载重吨:</span>
              <span class="value">{{ demand.deadweight }}吨</span>
            </div>
            <div class="info-item" v-if="demand.demandType === 'lease'">
              <span class="label">租赁类型:</span>
              <span class="value">{{ getLeaseTypeLabel(demand.leaseType) }}</span>
            </div>
            <div class="info-item" v-if="demand.demandType === 'lease'">
              <span class="label">租金:</span>
              <span class="value">{{ demand.rentalPrice }}万元/{{ demand.leaseType === 'voyage' ? '航次' : '月' }}</span>
            </div>
            <div class="info-item" v-if="demand.demandType === 'idle'">
              <span class="label">当前位置:</span>
              <span class="value">{{ demand.currentLocation }}</span>
            </div>
            <div class="info-item" v-if="demand.demandType === 'idle'">
              <span class="label">可用时间:</span>
              <span class="value">{{ demand.availableDateStart }} 至 {{ demand.availableDateEnd }}</span>
            </div>
          </div>
          <div class="submit-time">提交时间: {{ demand.submitTime }}</div>
        </div>

        <div class="card-actions">
          <button class="btn-action btn-view" @click="viewDemand(demand)">查看详情</button>
          <button class="btn-action btn-edit" @click="editDemand(demand)">编辑</button>
          <button class="btn-action btn-delete" @click="deleteDemand(demand.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editModalVisible" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content edit-modal">
        <div class="modal-header">
          <h2>编辑{{ editingDemand?.demandType === 'lease' ? '租赁' : '空船' }}信息</h2>
          <button class="close-btn" @click="closeEditModal">✕</button>
        </div>
        
        <div class="modal-body">
          <!-- Lease Info -->
          <template v-if="editingDemand?.demandType === 'lease'">
            <div class="form-section">
              <h4>船舶信息</h4>
              <div class="form-grid">
                <div class="form-item">
                  <label>船舶类型 *</label>
                  <input type="text" v-model="editForm.vesselType" readonly>
                </div>
                <div class="form-item">
                  <label>航区 *</label>
                  <input type="text" v-model="editForm.navigationArea" readonly>
                </div>
                <div class="form-item">
                  <label>船名</label>
                  <input type="text" v-model="editForm.vesselName">
                </div>
                <div class="form-item">
                  <label>船级</label>
                  <input type="text" v-model="editForm.classificationSociety">
                </div>
                <div class="form-item">
                  <label>建造厂</label>
                  <input type="text" v-model="editForm.buildPlace">
                </div>
                <div class="form-item">
                  <label>建造日期 *</label>
                  <input type="text" v-model="editForm.buildDate">
                </div>
                <div class="form-item">
                  <label>船旗 *</label>
                  <select v-model="editForm.flag">
                    <option value="">请选择</option>
                    <option value="中国">中国</option>
                    <option value="巴拿马">巴拿马</option>
                    <option value="利比里亚">利比里亚</option>
                  </select>
                </div>
                <div class="form-item">
                  <label>船籍港</label>
                  <input type="text" v-model="editForm.portOfRegistry">
                </div>
                <div class="form-item">
                  <label>总吨 *</label>
                  <input type="number" v-model.number="editForm.grossTonnage">
                </div>
                <div class="form-item">
                  <label>净吨 *</label>
                  <input type="number" v-model.number="editForm.netTonnage">
                </div>
                <div class="form-item">
                  <label>总长(米) *</label>
                  <input type="number" v-model.number="editForm.length">
                </div>
                <div class="form-item">
                  <label>型宽(米) *</label>
                  <input type="number" v-model.number="editForm.width">
                </div>
                <div class="form-item">
                  <label>型深(米) *</label>
                  <input type="number" v-model.number="editForm.depth">
                </div>
                <div class="form-item">
                  <label>主机功率(kW)</label>
                  <input type="number" v-model.number="editForm.mainEnginePower">
                </div>
                <div class="form-item">
                  <label>主机型号</label>
                  <input type="text" v-model="editForm.mainEngineModel">
                </div>
                <div class="form-item">
                  <label>载重(吨) *</label>
                  <input type="number" v-model.number="editForm.deadweight">
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>租赁信息</h4>
              <div class="form-grid">
                <template v-if="editForm.leaseType === 'time' || editForm.leaseType === 'bareboat'">
                  <div class="form-item">
                    <label>租金标准(万元/月) *</label>
                    <input type="number" v-model.number="editForm.rentalPrice" step="0.01">
                  </div>
                  <div class="form-item">
                    <label>租赁期限(月) *</label>
                    <input type="text" v-model="editForm.leaseDuration">
                  </div>
                  <div class="form-item full-width">
                    <label>可租起始时间 *</label>
                    <input type="date" v-model="editForm.availableDate">
                  </div>
                </template>
                
                <template v-if="editForm.leaseType === 'voyage'">
                  <div class="form-item">
                    <label>租金标准(万元/航次) *</label>
                    <input type="number" v-model.number="editForm.rentalPrice" step="0.01">
                  </div>
                  <div class="form-item full-width">
                    <label>航线范围 *</label>
                    <input type="text" v-model="editForm.voyageRoute">
                  </div>
                  <div class="form-item full-width">
                    <label>航次周期 *</label>
                    <input type="text" v-model="editForm.voyageCycle">
                  </div>
                </template>

                <div class="form-item full-width">
                  <label>租赁要求 *</label>
                  <textarea v-model="editForm.rentalRequirements" rows="3" maxlength="300"></textarea>
                  <span class="char-count">{{ editForm.rentalRequirements?.length || 0 }}/300</span>
                </div>

                <div class="form-item">
                  <label>联系人 *</label>
                  <input type="text" v-model="editForm.contactName">
                </div>
                <div class="form-item">
                  <label>联系电话 *</label>
                  <input type="tel" v-model="editForm.contactPhone">
                </div>
              </div>
            </div>
          </template>

          <!-- Idle Ship Info -->
          <template v-if="editingDemand?.demandType === 'idle'">
            <div class="form-section">
              <h4>船舶信息</h4>
              <div class="form-grid">
                <div class="form-item">
                  <label>船舶类型 *</label>
                  <input type="text" v-model="editForm.vesselType" readonly>
                </div>
                <div class="form-item">
                  <label>航区 *</label>
                  <input type="text" v-model="editForm.navigationArea" readonly>
                </div>
                <div class="form-item">
                  <label>船名</label>
                  <input type="text" v-model="editForm.vesselName">
                </div>
                <div class="form-item">
                  <label>船级</label>
                  <input type="text" v-model="editForm.classificationSociety">
                </div>
                <div class="form-item">
                  <label>建造厂</label>
                  <input type="text" v-model="editForm.buildPlace">
                </div>
                <div class="form-item">
                  <label>建造日期 *</label>
                  <input type="text" v-model="editForm.buildDate">
                </div>
                <div class="form-item">
                  <label>船旗 *</label>
                  <select v-model="editForm.flag">
                    <option value="">请选择</option>
                    <option value="中国">中国</option>
                    <option value="巴拿马">巴拿马</option>
                    <option value="利比里亚">利比里亚</option>
                  </select>
                </div>
                <div class="form-item">
                  <label>船籍港</label>
                  <input type="text" v-model="editForm.portOfRegistry">
                </div>
                <div class="form-item">
                  <label>总吨 *</label>
                  <input type="number" v-model.number="editForm.grossTonnage" readonly>
                </div>
                <div class="form-item">
                  <label>净吨 *</label>
                  <input type="number" v-model.number="editForm.netTonnage" readonly>
                </div>
                <div class="form-item">
                  <label>总长(米) *</label>
                  <input type="number" v-model.number="editForm.length" readonly>
                </div>
                <div class="form-item">
                  <label>型宽(米) *</label>
                  <input type="number" v-model.number="editForm.width" readonly>
                </div>
                <div class="form-item">
                  <label>型深(米) *</label>
                  <input type="number" v-model.number="editForm.depth" readonly>
                </div>
                <div class="form-item">
                  <label>主机功率(kW)</label>
                  <input type="number" v-model.number="editForm.mainEnginePower">
                </div>
                <div class="form-item">
                  <label>主机型号</label>
                  <input type="text" v-model="editForm.mainEngineModel">
                </div>
                <div class="form-item">
                  <label>载重(吨) *</label>
                  <input type="number" v-model.number="editForm.deadweight" readonly>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>空船信息</h4>
              <div class="form-grid">
                <div class="form-item full-width">
                  <label>空船当前位置 *</label>
                  <input type="text" v-model="editForm.currentLocation">
                </div>

                <div class="form-item full-width">
                  <label>预计可用时间 *</label>
                  <div class="date-range">
                    <input type="date" v-model="editForm.availableDateStart">
                    <span class="separator">至</span>
                    <input type="date" v-model="editForm.availableDateEnd">
                  </div>
                </div>

                <div class="form-item full-width">
                  <label>可租赁类型 *</label>
                  <div class="checkbox-group">
                    <label><input type="checkbox" value="time" v-model="editForm.leaseTypes"> 期租</label>
                    <label><input type="checkbox" value="bareboat" v-model="editForm.leaseTypes"> 光租</label>
                    <label><input type="checkbox" value="voyage" v-model="editForm.leaseTypes"> 航次租船</label>
                  </div>
                </div>

                <div class="form-item">
                  <label>联系人 *</label>
                  <input type="text" v-model="editForm.contactName">
                </div>

                <div class="form-item">
                  <label>联系电话 *</label>
                  <input type="tel" v-model="editForm.contactPhone">
                </div>

                <div class="form-item full-width">
                  <label>空船备注</label>
                  <textarea v-model="editForm.remarks" rows="3" maxlength="200"></textarea>
                  <span class="char-count">{{ editForm.remarks?.length || 0 }}/200</span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeEditModal">取消</button>
          <button class="btn-confirm" @click="saveEdit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Filters
const searchKeyword = ref('')
const filterType = ref('')
const filterStatus = ref('')

// Mock Data
const demands = ref([
  {
    id: 1,
    demandType: 'lease',
    vesselName: '远洋货轮',
    vesselType: '散货船',
    navigationArea: '无限航区',
    deadweight: 32000,
    leaseType: 'time',
    rentalPrice: 35,
    leaseDuration: '12-24',
    availableDate: '2026-03-01',
    rentalRequirements: '诚信租赁，按时支付租金',
    contactName: '张经理',
    contactPhone: '13800138000',
    status: 'approved',
    submitTime: '2026-01-15 10:30',
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
    mainEngineModel: '6S50MC'
  },
  {
    id: 2,
    demandType: 'idle',
    vesselName: '海洋之星',
    vesselType: '油船',
    navigationArea: '无限航区',
    deadweight: 28000,
    currentLocation: '上海港',
    availableDateStart: '2026-02-01',
    availableDateEnd: '2026-06-30',
    leaseTypes: ['time', 'bareboat'],
    contactName: '李经理',
    contactPhone: '13900139000',
    remarks: '船舶状况良好，可随时交接',
    status: 'pending',
    submitTime: '2026-01-20 14:20',
    classificationSociety: 'ClassNK',
    buildPlace: '日本',
    buildDate: '2013年3月',
    flag: '利比里亚',
    portOfRegistry: '新加坡',
    grossTonnage: 20000,
    netTonnage: 12000,
    length: 165,
    width: 26,
    depth: 14,
    mainEnginePower: 8500,
    mainEngineModel: 'MAN B&W'
  }
])

// Computed
const filteredDemands = computed(() => {
  let result = demands.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(d => 
      d.vesselName?.toLowerCase().includes(keyword)
    )
  }

  if (filterType.value) {
    result = result.filter(d => d.demandType === filterType.value)
  }

  if (filterStatus.value) {
    result = result.filter(d => d.status === filterStatus.value)
  }

  return result
})

// Methods
const resetFilters = () => {
  searchKeyword.value = ''
  filterType.value = ''
  filterStatus.value = ''
}

const getDemandTypeLabel = (type) => {
  const labels = { lease: '租赁信息', idle: '空船信息' }
  return labels[type] || type
}

const getStatusLabel = (status) => {
  const labels = { pending: '待审核', approved: '已发布', rejected: '已驳回' }
  return labels[status] || status
}

const getLeaseTypeLabel = (type) => {
  const labels = { time: '期租', bareboat: '光租', voyage: '航次租船' }
  return labels[type] || type
}

const viewDemand = (demand) => {
  console.log('[v0] 查看出租需求详情:', demand.id)
  alert(`查看需求详情: ${demand.vesselName}`)
}

const deleteDemand = (id) => {
  if (confirm('确定删除此需求？')) {
    const index = demands.value.findIndex(d => d.id === id)
    if (index !== -1) {
      demands.value.splice(index, 1)
      console.log('[v0] 已删除需求:', id)
    }
  }
}

// Edit Modal
const editModalVisible = ref(false)
const editingDemand = ref(null)
const editForm = ref({})

const editDemand = (demand) => {
  editingDemand.value = demand
  editForm.value = { ...demand }
  editModalVisible.value = true
  console.log('[v0] 编辑出租需求:', demand.id)
}

const closeEditModal = () => {
  editModalVisible.value = false
  editingDemand.value = null
  editForm.value = {}
}

const saveEdit = () => {
  const index = demands.value.findIndex(d => d.id === editingDemand.value.id)
  if (index !== -1) {
    demands.value[index] = { ...editForm.value }
    console.log('[v0] 保存编辑:', editForm.value)
  }
  closeEditModal()
}
</script>

<style scoped>
.lease-publish-demands-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: 100vh;
  background: #F8FAFC;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 15px;
  color: #64748B;
}

.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #0EA5E9;
}

.btn-reset {
  padding: 12px 24px;
  background: #F1F5F9;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-reset:hover {
  background: #E2E8F0;
}

.demands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.demand-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s;
}

.demand-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header {
  padding: 16px 20px;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demand-type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.demand-type-badge.lease {
  background: #DBEAFE;
  color: #1E40AF;
}

.demand-type-badge.idle {
  background: #FEF3C7;
  color: #92400E;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.pending {
  background: #FEF3C7;
  color: #92400E;
}

.status-badge.approved {
  background: #D1FAE5;
  color: #065F46;
}

.status-badge.rejected {
  background: #FEE2E2;
  color: #991B1B;
}

.card-content {
  padding: 20px;
}

.card-content h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}

.info-item .value {
  font-size: 14px;
  color: #0F172A;
  font-weight: 600;
}

.submit-time {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #F1F5F9;
}

.card-actions {
  padding: 16px 20px;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  display: flex;
  gap: 12px;
}

.btn-action {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view {
  background: #EFF6FF;
  color: #1E40AF;
}

.btn-view:hover {
  background: #DBEAFE;
}

.btn-edit {
  background: #F0FDF4;
  color: #15803D;
}

.btn-edit:hover {
  background: #DCFCE7;
}

.btn-delete {
  background: #FEF2F2;
  color: #B91C1C;
}

.btn-delete:hover {
  background: #FEE2E2;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 24px;
  color: #94A3B8;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
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
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
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
  font-size: 20px;
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

.form-section {
  margin-bottom: 32px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section h4 {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #E2E8F0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-item.full-width {
  grid-column: 1 / -1;
}

.form-item label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.form-item input,
.form-item select,
.form-item textarea {
  padding: 10px 12px;
  border: 1.5px solid #E2E8F0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-item input:focus,
.form-item select:focus,
.form-item textarea:focus {
  outline: none;
  border-color: #0EA5E9;
}

.form-item input[readonly] {
  background: #F8FAFC;
  color: #94A3B8;
}

.date-range {
  display: flex;
  gap: 12px;
  align-items: center;
}

.date-range input {
  flex: 1;
}

.separator {
  color: #94A3B8;
  font-weight: 600;
}

.checkbox-group {
  display: flex;
  gap: 20px;
  margin-top: 6px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-group input {
  width: auto;
}

.char-count {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 4px;
  text-align: right;
}

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
</style>

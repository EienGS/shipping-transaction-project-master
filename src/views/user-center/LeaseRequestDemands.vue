<template>
  <div class="lease-request-demands-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1>求租需求列表</h1>
      <p>管理我发布的求租需求</p>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索标题、船舶类型..." 
          class="search-input"
        />
      </div>
      
      <div class="filter-group">
        <select v-model="filterType" class="filter-select">
          <option value="">全部类型</option>
          <option value="time">期租</option>
          <option value="bareboat">光租</option>
          <option value="voyage">航次租船</option>
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
        <p>暂无求租需求</p>
      </div>

      <div v-for="demand in filteredDemands" :key="demand.id" class="demand-card">
        <div class="card-header">
          <span class="type-badge" :class="demand.leaseType">{{ getLeaseTypeLabel(demand.leaseType) }}</span>
          <span class="status-badge" :class="demand.status">{{ getStatusLabel(demand.status) }}</span>
        </div>

        <div class="card-content">
          <h3>{{ demand.title }}</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">船舶类型:</span>
              <span class="value">{{ demand.vesselType }}</span>
            </div>
            <div class="info-item" v-if="demand.dwtRange">
              <span class="label">载重吨范围:</span>
              <span class="value">{{ demand.dwtRange }}吨</span>
            </div>
            <div class="info-item" v-if="demand.dwtRequired">
              <span class="label">载重吨要求:</span>
              <span class="value">{{ demand.dwtRequired }}吨</span>
            </div>
            <div class="info-item" v-if="demand.navigationArea">
              <span class="label">航区要求:</span>
              <span class="value">{{ demand.navigationArea }}</span>
            </div>
            <div class="info-item" v-if="demand.leaseDuration">
              <span class="label">租赁期限:</span>
              <span class="value">{{ demand.leaseDuration }}月</span>
            </div>
            <div class="info-item" v-if="demand.voyageRoute">
              <span class="label">航线:</span>
              <span class="value">{{ demand.voyageRoute }}</span>
            </div>
            <div class="info-item">
              <span class="label">预算:</span>
              <span class="value">{{ demand.budgetMin }}-{{ demand.budgetMax }}万元</span>
            </div>
            <div class="info-item">
              <span class="label">联系人:</span>
              <span class="value">{{ demand.contactName }}</span>
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
          <h2>编辑求租信息</h2>
          <button class="close-btn" @click="closeEditModal">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="form-section">
            <h4>求租基本信息</h4>
            <div class="form-grid">
              <div class="form-item full-width">
                <label>求租标题 *</label>
                <input type="text" v-model="editForm.title" maxlength="30">
                <span class="char-count">{{ editForm.title?.length || 0 }}/30</span>
              </div>

              <div class="form-item">
                <label>联系人 *</label>
                <input type="text" v-model="editForm.contactName">
              </div>

              <div class="form-item">
                <label>联系电话 *</label>
                <input type="tel" v-model="editForm.contactPhone">
              </div>

              <div class="form-item">
                <label>企业/个人名称 *</label>
                <input type="text" v-model="editForm.companyName">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>求租需求</h4>
            <div class="form-grid">
              <!-- Time/Bareboat Charter -->
              <template v-if="editForm.leaseType === 'time' || editForm.leaseType === 'bareboat'">
                <div class="form-item">
                  <label>船舶类型 *</label>
                  <select v-model="editForm.vesselType">
                    <option value="">请选择</option>
                    <option value="散货船">散货船</option>
                    <option value="油船">油船</option>
                    <option value="集装箱船">集装箱船</option>
                  </select>
                </div>

                <div class="form-item">
                  <label>载重吨范围 *</label>
                  <input type="text" v-model="editForm.dwtRange" placeholder="如：3000-5000">
                </div>

                <div class="form-item">
                  <label>航区要求 *</label>
                  <select v-model="editForm.navigationArea">
                    <option value="">请选择</option>
                    <option value="无限航区">无限航区</option>
                    <option value="国内近海">国内近海</option>
                    <option value="东南亚航线">东南亚航线</option>
                  </select>
                </div>

                <div class="form-item">
                  <label>船龄要求 *</label>
                  <select v-model="editForm.ageRequirement">
                    <option value="">请选择</option>
                    <option value="5">5年以内</option>
                    <option value="10">10年以内</option>
                    <option value="15">15年以内</option>
                    <option value="不限">不限</option>
                  </select>
                </div>

                <div class="form-item">
                  <label>交接港口偏好</label>
                  <input type="text" v-model="editForm.portPreference">
                </div>

                <div class="form-item">
                  <label>租赁期限 *</label>
                  <input type="text" v-model="editForm.leaseDuration" placeholder="如：12-24个月">
                </div>

                <div class="form-item full-width">
                  <label>预算范围(万元/月) *</label>
                  <div class="range-inputs">
                    <input type="number" v-model.number="editForm.budgetMin" placeholder="最低预算" step="0.01">
                    <span class="separator">-</span>
                    <input type="number" v-model.number="editForm.budgetMax" placeholder="最高预算" step="0.01">
                  </div>
                </div>
              </template>

              <!-- Voyage Charter -->
              <template v-if="editForm.leaseType === 'voyage'">
                <div class="form-item">
                  <label>船舶类型 *</label>
                  <select v-model="editForm.vesselType">
                    <option value="">请选择</option>
                    <option value="散货船">散货船</option>
                    <option value="油船">油船</option>
                    <option value="集装箱船">集装箱船</option>
                  </select>
                </div>

                <div class="form-item">
                  <label>载重吨要求 *</label>
                  <input type="number" v-model.number="editForm.dwtRequired">
                </div>

                <div class="form-item full-width">
                  <label>航线信息 *</label>
                  <input type="text" v-model="editForm.voyageRoute">
                </div>

                <div class="form-item">
                  <label>载货类型 *</label>
                  <select v-model="editForm.cargoType">
                    <option value="">请选择</option>
                    <option value="散杂货">散杂货</option>
                    <option value="油品">油品</option>
                    <option value="集装箱">集装箱</option>
                  </select>
                </div>

                <div class="form-item">
                  <label>航次时间要求 *</label>
                  <input type="text" v-model="editForm.voyageTimeline">
                </div>

                <div class="form-item full-width">
                  <label>预算范围(万元/航次) *</label>
                  <div class="range-inputs">
                    <input type="number" v-model.number="editForm.budgetMin" placeholder="最低预算" step="0.01">
                    <span class="separator">-</span>
                    <input type="number" v-model.number="editForm.budgetMax" placeholder="最高预算" step="0.01">
                  </div>
                </div>
              </template>

              <div class="form-item full-width">
                <label>补充要求</label>
                <textarea v-model="editForm.remarks" rows="3" maxlength="300"></textarea>
                <span class="char-count">{{ editForm.remarks?.length || 0 }}/300</span>
              </div>
            </div>
          </div>
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
    title: '长期期租5000吨散货船',
    leaseType: 'time',
    vesselType: '散货船',
    dwtRange: '3000-5000',
    navigationArea: '无限航区',
    ageRequirement: '10',
    portPreference: '上海、新加坡',
    leaseDuration: '12-24',
    budgetMin: 20,
    budgetMax: 30,
    remarks: '诚信租赁',
    contactName: '王经理',
    contactPhone: '13800138000',
    companyName: '远洋运输公司',
    status: 'approved',
    submitTime: '2026-01-18 09:30'
  },
  {
    id: 2,
    title: '航次租船需求',
    leaseType: 'voyage',
    vesselType: '油船',
    dwtRequired: 5000,
    voyageRoute: '上海-新加坡-釜山',
    cargoType: '油品',
    voyageTimeline: '2个月内',
    budgetMin: 50,
    budgetMax: 80,
    remarks: '需要具备IMO资质',
    contactName: '李经理',
    contactPhone: '13900139000',
    companyName: '能源贸易公司',
    status: 'pending',
    submitTime: '2026-01-22 14:15'
  }
])

// Computed
const filteredDemands = computed(() => {
  let result = demands.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(d => 
      d.title?.toLowerCase().includes(keyword) ||
      d.vesselType?.toLowerCase().includes(keyword)
    )
  }

  if (filterType.value) {
    result = result.filter(d => d.leaseType === filterType.value)
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

const getLeaseTypeLabel = (type) => {
  const labels = { time: '期租', bareboat: '光租', voyage: '航次租船' }
  return labels[type] || type
}

const getStatusLabel = (status) => {
  const labels = { pending: '待审核', approved: '已发布', rejected: '已驳回' }
  return labels[status] || status
}

const viewDemand = (demand) => {
  console.log('[v0] 查看求租需求详情:', demand.id)
  alert(`查看需求详情: ${demand.title}`)
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
  console.log('[v0] 编辑求租需求:', demand.id)
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
.lease-request-demands-page {
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

.type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.type-badge.time {
  background: #DBEAFE;
  color: #1E40AF;
}

.type-badge.bareboat {
  background: #FEF3C7;
  color: #92400E;
}

.type-badge.voyage {
  background: #E0E7FF;
  color: #3730A3;
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
  max-width: 800px;
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

.range-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.range-inputs input {
  flex: 1;
}

.separator {
  color: #94A3B8;
  font-weight: 600;
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

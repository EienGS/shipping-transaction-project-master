<template>
  <div class="sale-audit-page">
    <div class="page-header">
      <h1 class="page-title">出售信息审核</h1>
      <p class="page-desc">核对船舶出售信息真实性、完整性及资料合法性</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <input
          type="text"
          v-model="filters.keyword"
          placeholder="搜索发布方名称、信息编号、船舶名称"
          class="filter-input"
        />
        <select v-model="filters.status" class="filter-select">
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已驳回</option>
        </select>
        <select v-model="filters.shipType" class="filter-select">
          <option value="">全部船型</option>
          <option value="bulk">散货船</option>
          <option value="container">集装箱船</option>
          <option value="tanker">油船</option>
          <option value="gas">液化气船</option>
        </select>
        <button class="btn-search" @click="handleSearch">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          搜索
        </button>
      </div>
    </div>

    <!-- 工单列表 -->
    <div class="order-list">
      <div v-for="order in orderList" :key="order.id" class="order-card" @click="viewDetail(order)">
        <div class="order-header">
          <div class="order-no">
            <span class="label">信息编号：</span>
            <span class="value">{{ order.orderNo }}</span>
          </div>
          <div class="order-status" :class="order.status">
            {{ getStatusText(order.status) }}
          </div>
        </div>

        <div class="order-body">
          <div class="order-main">
            <h3 class="vessel-name">{{ order.vesselName }}</h3>
            <div class="vessel-meta">
              <span class="meta-item">{{ getShipTypeText(order.shipType) }}</span>
              <span class="meta-divider">·</span>
              <span class="meta-item">{{ order.dwt }} DWT</span>
              <span class="meta-divider">·</span>
              <span class="meta-item">{{ order.buildYear }}年建</span>
              <span class="meta-divider">·</span>
              <span class="meta-item">{{ order.flag }}</span>
            </div>
            <div class="order-info">
              <div class="info-item">
                <span class="info-label">发布方：</span>
                <span class="info-value">{{ order.publisher }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">提交时间：</span>
                <span class="info-value">{{ order.submitTime }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">售价：</span>
                <span class="info-value price">${{ order.price }}万</span>
              </div>
            </div>
          </div>
          <div class="order-actions">
            <button v-if="order.status === 'pending'" class="btn-action approve" @click.stop="handleApprove(order)">
              审核通过
            </button>
            <button v-if="order.status === 'pending'" class="btn-action reject" @click.stop="handleReject(order)">
              审核驳回
            </button>
            <button class="btn-action detail" @click.stop="viewDetail(order)">
              查看详情
            </button>
          </div>
        </div>

        <!-- 数据不一致标记 -->
        <div v-if="order.hasDataIssue" class="data-warning">
          <svg class="warning-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>检测到部分数据与数据中台不一致，请核实</span>
        </div>
      </div>
    </div>

    <!-- 审核通过弹窗 -->
    <div v-if="showApproveModal" class="modal-overlay" @click="showApproveModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">确认审核通过</h3>
          <button class="modal-close" @click="showApproveModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>确认审核通过以下出售信息？</p>
          <div class="confirm-info">
            <div class="confirm-item">
              <span class="confirm-label">船舶名称：</span>
              <span class="confirm-value">{{ currentOrder?.vesselName }}</span>
            </div>
            <div class="confirm-item">
              <span class="confirm-label">发布方：</span>
              <span class="confirm-value">{{ currentOrder?.publisher }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showApproveModal = false">取消</button>
          <button class="btn-confirm" @click="confirmApprove">确认通过</button>
        </div>
      </div>
    </div>

    <!-- 审核驳回弹窗 -->
    <div v-if="showRejectModal" class="modal-overlay" @click="showRejectModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">审核驳回</h3>
          <button class="modal-close" @click="showRejectModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">驳回原因分类</label>
            <select v-model="rejectForm.category" class="form-select">
              <option value="">请选择驳回原因</option>
              <option value="incomplete">字段填写不规范</option>
              <option value="unclear">资料模糊/缺失</option>
              <option value="fake">信息虚假</option>
              <option value="certificate">证书无效</option>
              <option value="violation">内容违规</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">补充说明（100字以内）</label>
            <textarea
              v-model="rejectForm.remark"
              class="form-textarea"
              placeholder="请明确说明需要修改的方向，如[请重新上传清晰的船舶所有权证书，确保关键信息可辨]"
              maxlength="100"
            ></textarea>
            <div class="char-count">{{ rejectForm.remark.length }}/100</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showRejectModal = false">取消</button>
          <button class="btn-confirm reject" @click="confirmReject">确认驳回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const filters = ref({
  keyword: '',
  status: 'pending',
  shipType: ''
})

const orderList = ref([
  {
    id: 1,
    orderNo: 'SALE-2026010012',
    vesselName: 'OCEAN STAR',
    shipType: 'bulk',
    dwt: 50000,
    buildYear: 2015,
    flag: '中国香港',
    price: 1200,
    publisher: '某航运有限公司',
    submitTime: '2026-01-20 14:30',
    status: 'pending',
    hasDataIssue: true
  },
  {
    id: 2,
    orderNo: 'SALE-2026010011',
    vesselName: 'PACIFIC GLORY',
    shipType: 'container',
    dwt: 30000,
    buildYear: 2018,
    flag: '巴拿马',
    price: 2500,
    publisher: '某船务公司',
    submitTime: '2026-01-20 10:15',
    status: 'pending',
    hasDataIssue: false
  },
  {
    id: 3,
    orderNo: 'SALE-2026010010',
    vesselName: 'EASTERN PEARL',
    shipType: 'tanker',
    dwt: 45000,
    buildYear: 2016,
    flag: '利比里亚',
    price: 1800,
    publisher: 'XX航运集团',
    submitTime: '2026-01-19 16:20',
    status: 'approved',
    hasDataIssue: false
  }
])

const showApproveModal = ref(false)
const showRejectModal = ref(false)
const currentOrder = ref(null)

const rejectForm = ref({
  category: '',
  remark: ''
})

const getStatusText = (status) => {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回'
  }
  return statusMap[status] || status
}

const getShipTypeText = (type) => {
  const typeMap = {
    bulk: '散货船',
    container: '集装箱船',
    tanker: '油船',
    gas: '液化气船'
  }
  return typeMap[type] || type
}

const handleSearch = () => {
  console.log('[v0] 搜索出售信息:', filters.value)
}

const viewDetail = (order) => {
  console.log('[v0] 查看出售信息详情:', order.orderNo)
}

const handleApprove = (order) => {
  currentOrder.value = order
  showApproveModal.value = true
}

const handleReject = (order) => {
  currentOrder.value = order
  showRejectModal.value = true
}

const confirmApprove = () => {
  console.log('[v0] 审核通过:', currentOrder.value.orderNo)
  showApproveModal.value = false
  currentOrder.value.status = 'approved'
}

const confirmReject = () => {
  if (!rejectForm.value.category) {
    alert('请选择驳回原因')
    return
  }
  console.log('[v0] 审核驳回:', currentOrder.value.orderNo, rejectForm.value)
  showRejectModal.value = false
  currentOrder.value.status = 'rejected'
  rejectForm.value = { category: '', remark: '' }
}
</script>

<style scoped>
.sale-audit-page {
  /* max-width: 1400px; */
  width: 100%;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

/* 筛选区域 */
.filter-section {
  background: #F8FAFC;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #E2E8F0;
}

.filter-row {
  display: flex;
  gap: 12px;
}

.filter-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.filter-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  min-width: 150px;
}

.btn-search {
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-search svg {
  width: 18px;
  height: 18px;
}

.btn-search:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

/* 工单列表 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F1F5F9;
}

.order-no {
  font-size: 13px;
}

.order-no .label {
  color: #64748B;
}

.order-no .value {
  color: #0F172A;
  font-weight: 600;
}

.order-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.order-status.pending {
  background: #FEF3C7;
  color: #D97706;
}

.order-status.approved {
  background: #D1FAE5;
  color: #059669;
}

.order-status.rejected {
  background: #FEE2E2;
  color: #DC2626;
}

.order-body {
  display: flex;
  gap: 24px;
}

.order-main {
  flex: 1;
}

.vessel-name {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.vessel-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748B;
  margin-bottom: 12px;
}

.meta-divider {
  color: #CBD5E1;
}

.order-info {
  display: flex;
  gap: 24px;
}

.info-item {
  font-size: 13px;
}

.info-label {
  color: #64748B;
}

.info-value {
  color: #0F172A;
  font-weight: 600;
}

.info-value.price {
  color: #EF4444;
  font-size: 16px;
}

.order-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-action {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-action.approve {
  background: #10B981;
  color: white;
}

.btn-action.approve:hover {
  background: #059669;
}

.btn-action.reject {
  background: #EF4444;
  color: white;
}

.btn-action.reject:hover {
  background: #DC2626;
}

.btn-action.detail {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-action.detail:hover {
  background: #EFF6FF;
}

/* 数据警告 */
.data-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px 16px;
  background: #FEF3C7;
  border-radius: 8px;
  font-size: 13px;
  color: #D97706;
}

.warning-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 弹窗样式 */
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
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E2E8F0;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 24px;
  color: #64748B;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
}

.modal-close:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.modal-body {
  padding: 24px;
}

.confirm-info {
  margin-top: 16px;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
}

.confirm-item {
  font-size: 14px;
  margin-bottom: 8px;
}

.confirm-item:last-child {
  margin-bottom: 0;
}

.confirm-label {
  color: #64748B;
}

.confirm-value {
  color: #0F172A;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 8px;
}

.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-size: 14px;
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #94A3B8;
  margin-top: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #E2E8F0;
}

.btn-cancel {
  padding: 10px 24px;
  background: white;
  color: #64748B;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #F8FAFC;
}

.btn-confirm {
  padding: 10px 24px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-confirm:hover {
  background: #059669;
}

.btn-confirm.reject {
  background: #EF4444;
}

.btn-confirm.reject:hover {
  background: #DC2626;
}
</style>

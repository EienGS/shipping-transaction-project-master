<template>
  <div class="purchase-demands-page">
    <div class="page-header">
      <div class="header-left">
        <h1>求购需求管理</h1>
      </div>
      <button class="btn-publish" @click="goToPublish">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        发布求购需求
      </button>
    </div>

    <div class="page-content">
      <!-- 筛选区 -->
      <div class="filter-bar">
        <div class="filter-group">
          <div class="filter-item">
            <label>状态筛选：</label>
            <select v-model="filterStatus" class="filter-select">
              <option value="">全部</option>
              <option value="pending">待审核</option>
              <option value="approved">已上架</option>
              <option value="offline">已下架</option>
              <option value="rejected">已驳回</option>
            </select>
          </div>

          <div class="filter-item">
            <label>船舶类型：</label>
            <select v-model="filterVesselType" class="filter-select">
              <option value="">全部类型</option>
              <option value="散货船">散货船</option>
              <option value="集装箱船">集装箱船</option>
              <option value="油船">油船</option>
              <option value="液化气船">液化气船</option>
            </select>
          </div>
        </div>

        <div class="search-group">
          <input v-model="searchKeyword" type="text" class="search-input" placeholder="搜索需求标题..." />
        </div>
      </div>

      <!-- 需求列表 -->
      <div class="demands-grid">
        <div v-if="filteredDemands.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"/>
          </svg>
          <h3>暂无求购需求</h3>
          <p>开始发布求购需求，等待卖方对接</p>
        </div>

        <div v-for="demand in filteredDemands" :key="demand.id" class="demand-card">
          <!-- 卡片内容 -->
          <div class="card-content" @click="viewDetail(demand.id)">
            <div class="title-row">
              <h3 class="demand-title">{{ demand.title }}</h3>
              <span class="status-badge" :class="`status-${demand.status}`">
                {{ statusLabels[demand.status] || demand.status }}
              </span>
            </div>
            
            <div class="demand-info">
              <div class="info-row">
                <span class="info-label">船舶类型：</span>
                <span class="info-value">{{ demand.vesselType }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">建造年份：</span>
                <span class="info-value">{{ demand.buildYearStart }}-{{ demand.buildYearEnd }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">航区：</span>
                <span class="info-value">{{ demand.navigationArea }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">预算：</span>
                <span class="info-value price">¥{{ demand.budgetMin }}-{{ demand.budgetMax }}万</span>
              </div>
            </div>

            <div class="publish-info">
              <span class="publish-date">发布于 {{ demand.publishDate }}</span>
              <span v-if="demand.status === 'approved' && demand.intentionCount > 0" class="intention-count">
                {{ demand.intentionCount }} 个意向对接
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions">
            <button class="btn-action btn-detail" @click="viewDetail(demand.id)">
              查看详情
            </button>
            <button class="btn-action btn-edit" @click.stop="editDemand(demand.id)">
              编辑
            </button>
            <button 
              v-if="demand.status === 'approved'"
              class="btn-action btn-toggle"
              @click.stop="toggleStatus(demand.id, 'offline')">
              下架
            </button>
            <button 
              v-else-if="demand.status === 'offline'"
              class="btn-action btn-toggle active"
              @click.stop="toggleStatus(demand.id, 'approved')">
              上架
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑模态框 -->
    <div v-if="editModalVisible" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>编辑求购需求</h2>
          <button class="close-btn" @click="closeEditModal">✕</button>
        </div>

        <div class="modal-body-wrapper">
          <form @submit.prevent="saveEdit" class="modal-form">
            <!-- 基本信息 -->
            <div class="form-section">
              <h3 class="section-title">基本信息</h3>
              
              <div class="form-row">
                <div class="form-item required">
                  <label>船舶类型</label>
                  <select v-model="editForm.vesselType" class="form-input" required>
                    <option value="">请选择船舶类型</option>
                    <option value="散货船">散货船</option>
                    <option value="集装箱船">集装箱船</option>
                    <option value="油船">油船</option>
                    <option value="液化气船">液化气船</option>
                    <option value="化学品船">化学品船</option>
                    <option value="客船">客船</option>
                    <option value="货船">货船</option>
                  </select>
                </div>

                <div class="form-item required">
                  <label>航区</label>
                  <select v-model="editForm.navigationArea" class="form-input" required>
                    <option value="">请选择航区</option>
                    <option value="无限航区">无限航区</option>
                    <option value="近海航区">近海航区</option>
                    <option value="沿海航区">沿海航区</option>
                    <option value="内河航区">内河航区</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-item required">
                  <label>建造年份范围</label>
                  <div class="year-range">
                    <input v-model.number="editForm.buildYearStart" type="number" class="form-input" 
                      placeholder="起始年份" min="1950" :max="currentYear" required />
                    <span class="range-separator">至</span>
                    <input v-model.number="editForm.buildYearEnd" type="number" class="form-input" 
                      placeholder="结束年份" :min="editForm.buildYearStart || 1950" :max="currentYear" required />
                  </div>
                </div>

                <div class="form-item required">
                  <label>预算范围（万元）</label>
                  <div class="year-range">
                    <input v-model.number="editForm.budgetMin" type="number" class="form-input" 
                      placeholder="最低预算" min="0" step="0.01" required />
                    <span class="range-separator">至</span>
                    <input v-model.number="editForm.budgetMax" type="number" class="form-input" 
                      placeholder="最高预算" :min="editForm.budgetMin || 0" step="0.01" required />
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>建造地</label>
                  <input v-model="editForm.buildPlace" type="text" class="form-input" placeholder="请输入建造地（选填）" />
                </div>

                <div class="form-item required">
                  <label>船级</label>
                  <select v-model="editForm.classificationSociety" class="form-input" required>
                    <option value="">请选择船级社</option>
                    <option value="CCS">CCS (中国船级社)</option>
                    <option value="ABS">ABS (美国船级社)</option>
                    <option value="LR">LR (英国劳氏船级社)</option>
                    <option value="DNV">DNV (挪威船级社)</option>
                    <option value="BV">BV (法国船级社)</option>
                    <option value="NK">NK (日本船级社)</option>
                    <option value="KR">KR (韩国船级社)</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-item required">
                  <label>船籍港</label>
                  <input v-model="editForm.portOfRegistry" type="text" class="form-input" 
                    placeholder="请输入船籍港" required />
                </div>

                <div class="form-item required">
                  <label>船旗</label>
                  <select v-model="editForm.flag" class="form-input" required>
                    <option value="">请选择船旗</option>
                    <option value="中国">中国</option>
                    <option value="巴拿马">巴拿马</option>
                    <option value="利比里亚">利比里亚</option>
                    <option value="马绍尔群岛">马绍尔群岛</option>
                    <option value="香港">香港</option>
                    <option value="新加坡">新加坡</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 联系信息 -->
            <div class="form-section">
              <h3 class="section-title">联系信息</h3>
              
              <div class="form-row">
                <div class="form-item required">
                  <label>联系人</label>
                  <input v-model="editForm.contactPerson" type="text" class="form-input" required />
                </div>

                <div class="form-item required">
                  <label>联系电话</label>
                  <input v-model="editForm.contactPhone" type="tel" class="form-input" required />
                </div>
              </div>
            </div>

            <!-- 补充信息 -->
            <div class="form-section">
              <h3 class="section-title">补充信息</h3>
              
              <div class="form-item">
                <label>备注信息</label>
                <textarea v-model="editForm.remarks" class="form-textarea" 
                  placeholder="请填写特殊需求，如船舶吨位要求、设备配置偏好、交付时间要求、付款方式倾向等"
                  maxlength="500" rows="4"></textarea>
                <div class="char-count">{{ editForm.remarks.length }}/500</div>
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

    <!-- 上下架确认弹窗 -->
    <div v-if="toggleConfirmVisible" class="modal-overlay" @click.self="toggleConfirmVisible = false">
      <div class="modal-content small">
        <div class="modal-header">
          <h2>{{ toggleAction === 'offline' ? '下架确认' : '上架确认' }}</h2>
          <button class="close-btn" @click="toggleConfirmVisible = false">✕</button>
        </div>
        <div class="modal-body">
          <p>确定要{{ toggleAction === 'offline' ? '下架' : '上架' }}该求购需求吗？</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="toggleConfirmVisible = false">取消</button>
          <button class="btn-confirm" @click="confirmToggle">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentYear = new Date().getFullYear()

// 筛选条件
const filterStatus = ref('')
const filterVesselType = ref('')
const searchKeyword = ref('')

// 模态框状态
const editModalVisible = ref(false)
const toggleConfirmVisible = ref(false)
const currentDemandId = ref(null)
const toggleAction = ref('')

// 状态标签映射
const statusLabels = {
  pending: '待审核',
  approved: '已上架',
  offline: '已下架',
  rejected: '已驳回'
}

// 求购需求数据
const demands = ref([
  {
    id: 1,
    title: '求购5万吨散货船',
    vesselType: '散货船',
    buildYearStart: 2015,
    buildYearEnd: 2020,
    navigationArea: '无限航区',
    budgetMin: 3000,
    budgetMax: 5000,
    status: 'approved',
    publishDate: '2026-01-15',
    intentionCount: 3,
    pendingIntentions: 1
  },
  {
    id: 2,
    title: '求购7万吨油船',
    vesselType: '油船',
    buildYearStart: 2010,
    buildYearEnd: 2018,
    navigationArea: '无限航区',
    budgetMin: 5000,
    budgetMax: 7000,
    status: 'approved',
    publishDate: '2026-01-10',
    intentionCount: 5,
    pendingIntentions: 2
  },
  {
    id: 3,
    title: '求购3万吨集装箱船',
    vesselType: '集装箱船',
    buildYearStart: 2012,
    buildYearEnd: 2019,
    navigationArea: '近海航区',
    budgetMin: 2500,
    budgetMax: 4000,
    status: 'offline',
    publishDate: '2026-01-05',
    intentionCount: 0,
    pendingIntentions: 0
  },
  {
    id: 4,
    title: '求购4万吨散货船',
    vesselType: '散货船',
    buildYearStart: 2008,
    buildYearEnd: 2015,
    navigationArea: '无限航区',
    budgetMin: 2000,
    budgetMax: 3500,
    status: 'pending',
    publishDate: '2026-01-20',
    intentionCount: 0,
    pendingIntentions: 0
  }
])

// 编辑表单
const editForm = ref({
  vesselType: '',
  navigationArea: '',
  buildYearStart: null,
  buildYearEnd: null,
  budgetMin: null,
  budgetMax: null,
  buildPlace: '',
  classificationSociety: '',
  portOfRegistry: '',
  flag: '',
  contactPerson: '',
  contactPhone: '',
  remarks: ''
})

// 筛选后的需求
const filteredDemands = computed(() => {
  return demands.value.filter(demand => {
    if (filterStatus.value && demand.status !== filterStatus.value) return false
    if (filterVesselType.value && demand.vesselType !== filterVesselType.value) return false
    if (searchKeyword.value && !demand.title.includes(searchKeyword.value)) return false
    return true
  })
})

// 查看详情
const viewDetail = (id) => {
  console.log('[v0] 查看详情:', id)
  router.push({
    path: `/shipping-trade/purchase/${id}`,
    query: { owner: 'true' }
  })
}

// 编辑需求
const editDemand = (id) => {
  console.log('[v0] 编辑求购需求:', id)
  currentDemandId.value = id
  const demand = demands.value.find(d => d.id === id)
  
  // 填充编辑表单
  editForm.value = {
    vesselType: demand.vesselType,
    navigationArea: demand.navigationArea,
    buildYearStart: demand.buildYearStart,
    buildYearEnd: demand.buildYearEnd,
    budgetMin: demand.budgetMin,
    budgetMax: demand.budgetMax,
    buildPlace: '中国',
    classificationSociety: 'CCS',
    portOfRegistry: '上海',
    flag: '中国',
    contactPerson: '张三',
    contactPhone: '13800138000',
    remarks: ''
  }
  
  editModalVisible.value = true
}

// 关闭编辑模态框
const closeEditModal = () => {
  editModalVisible.value = false
}

// 跳转到发布求购页面
const goToPublish = () => {
  router.push('/shipping-trade/buy-vessel')
}

// 保存编辑
const saveEdit = () => {
  console.log('[v0] 保存编辑:', editForm.value)
  
  const demand = demands.value.find(d => d.id === currentDemandId.value)
  if (demand) {
    demand.vesselType = editForm.value.vesselType
    demand.navigationArea = editForm.value.navigationArea
    demand.buildYearStart = editForm.value.buildYearStart
    demand.buildYearEnd = editForm.value.buildYearEnd
    demand.budgetMin = editForm.value.budgetMin
    demand.budgetMax = editForm.value.budgetMax
    demand.title = `求购${editForm.value.vesselType}`
  }
  
  editModalVisible.value = false
}

// 切换上下架
const toggleStatus = (id, action) => {
  currentDemandId.value = id
  toggleAction.value = action
  toggleConfirmVisible.value = true
}

// 确认上下架
const confirmToggle = () => {
  const demand = demands.value.find(d => d.id === currentDemandId.value)
  if (demand) {
    demand.status = toggleAction.value
  }
  toggleConfirmVisible.value = false
}
</script>

<style scoped>
.purchase-demands-page {
  min-height: 100vh;
  background: white;
}

.page-header {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.header-left p {
  font-size: 14px;
  color: #64748b;
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

.btn-publish svg {
  width: 18px;
  height: 18px;
}

.page-content {
  margin: 0 auto;
}

/* 筛选区 */
.filter-bar {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
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

.search-group {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

/* 需求网格 */
.demands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  color: #cbd5e1;
  margin: 0 auto 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

/* 需求卡片 */
.demand-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.demand-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}



.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.status-offline {
  background: #e5e7eb;
  color: #374151;
}

.status-badge.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}



.card-content {
  padding: 16px;
  flex: 1;
  cursor: pointer;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.demand-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  flex: 1;
}

.demand-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
}

.info-label {
  color: #64748b;
  font-weight: 500;
  min-width: 70px;
}

.info-value {
  color: #1e293b;
  font-weight: 500;
}

.info-value.price {
  color: #ef4444;
  font-weight: 700;
}

.publish-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  font-size: 12px;
}

.publish-date {
  color: #94a3b8;
}

.intention-count {
  color: #0ea5e9;
  font-weight: 600;
}

.card-actions {
  padding: 12px 16px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 8px;
}

.btn-action {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-detail {
  background: #0ea5e9;
  color: white;
}

.btn-detail:hover {
  background: #0284c7;
}

.btn-edit {
  background: #f1f5f9;
  color: #475569;
}

.btn-edit:hover {
  background: #e2e8f0;
}

.btn-toggle {
  background: #fef3c7;
  color: #92400e;
}

.btn-toggle:hover {
  background: #fde68a;
}

.btn-toggle.active {
  background: #d1fae5;
  color: #065f46;
}

.btn-toggle.active:hover {
  background: #a7f3d0;
}

/* 模态框 */
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
  display: flex;
  flex-direction: column;
}

.modal-content.small {
  max-width: 400px;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.modal-header h2 {
  font-size: 18px;
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
  transition: color 0.3s;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #0f172a;
}

.modal-body {
  padding: 24px;
}

.modal-body-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-shrink: 0;
}

/* 表单样式 */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item.required label::after {
  content: ' *';
  color: #ef4444;
}

.form-item label {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.form-input,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.year-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.year-range input {
  flex: 1;
}

.range-separator {
  color: #94a3b8;
  font-size: 14px;
}

.char-count {
  font-size: 12px;
  color: #94a3b8;
  text-align: right;
}

/* 按钮 */
.btn-cancel,
.btn-save,
.btn-confirm {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-save,
.btn-confirm {
  background: #0ea5e9;
  color: white;
}

.btn-save:hover,
.btn-confirm:hover {
  background: #0284c7;
}

@media (max-width: 768px) {
  .demands-grid {
    grid-template-columns: 1fr;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-group {
    max-width: none;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="lease-request-demands">
    <div class="page-header">
      <h1>我的求租需求</h1>
      <p class="subtitle">管理您发布的求租需求信息</p>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-left">
        <input 
          v-model="searchKeyword" 
          type="text" 
          class="search-input" 
          placeholder="搜索标题、公司名..."
        />
      </div>
      <div class="filter-right">
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="offline">已下架</option>
        </select>
        <select v-model="filterType" class="filter-select">
          <option value="">全部类型</option>
          <option value="time">期租</option>
          <option value="bareboat">光租</option>
          <option value="voyage">航次租船</option>
        </select>
      </div>
    </div>

    <!-- 需求列表 -->
    <div class="demands-grid">
      <div v-for="item in filteredList" :key="item.id" class="demand-card">
        <div class="card-header">
          <div class="header-left">
            <span class="demand-id">NO.{{ item.id }}</span>
            <span class="type-badge" :class="`type-${item.leaseType}`">
              {{ getTypeLabel(item.leaseType) }}
            </span>
          </div>
          <div class="status-badge" :class="item.status">
            {{ item.status === 'published' ? '已发布' : '已下架' }}
          </div>
        </div>

        <div class="card-body">
          <h3 class="demand-title">{{ item.title }}</h3>

          <div class="demand-info">
            <div class="info-row">
              <span class="label">公司名称：</span>
              <span class="value">{{ item.companyName }}</span>
            </div>
            <div class="info-row">
              <span class="label">船舶类型：</span>
              <span class="value">{{ item.vesselType }}</span>
            </div>
            <div class="info-row" v-if="item.leaseType !== 'voyage'">
              <span class="label">载重范围：</span>
              <span class="value">{{ item.dwtRange }} DWT</span>
            </div>
            <div class="info-row" v-else>
              <span class="label">所需载重：</span>
              <span class="value">{{ item.dwtRequired }} 吨</span>
            </div>
            <div class="info-row">
              <span class="label">预算范围：</span>
              <span class="value price">¥{{ item.budgetMin }}-{{ item.budgetMax }}万</span>
            </div>
            <div class="info-row">
              <span class="label">发布时间：</span>
              <span class="value">{{ item.publishDate }}</span>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn-action btn-view" @click="viewDetail(item)">查看详情</button>
            <button class="btn-action btn-edit" @click="editItem(item)">编辑</button>
            <button 
              class="btn-action" 
              :class="item.status === 'published' ? 'btn-offline' : 'btn-online'"
              @click="toggleStatus(item)"
            >
              {{ item.status === 'published' ? '下架' : '上架' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredList.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
      <p>暂无求租需求</p>
    </div>

    <!-- 编辑弹窗 -->
    <div v-if="editModalVisible" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>编辑求租需求</h2>
          <button class="close-btn" @click="closeEditModal">✕</button>
        </div>

        <div class="modal-body">
          <form class="edit-form">
            <!-- 基本信息 -->
            <div class="form-section">
              <h3 class="section-title">基本信息</h3>
              
              <div class="form-item full-width required">
                <label>需求标题</label>
                <input v-model="editForm.title" type="text" class="form-input" placeholder="简明扼要的需求描述" required />
              </div>

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

              <div class="form-item full-width required">
                <label>公司名称</label>
                <input v-model="editForm.companyName" type="text" class="form-input" placeholder="请输入公司全称" required />
              </div>
            </div>

            <!-- 期租/光租需求 -->
            <div v-if="editForm.leaseType === 'time' || editForm.leaseType === 'bareboat'" class="form-section">
              <h3 class="section-title">{{ editForm.leaseType === 'time' ? '期租' : '光租' }}需求</h3>
              
              <div class="form-row">
                <div class="form-item required">
                  <label>船舶类型</label>
                  <select v-model="editForm.vesselType" class="form-input" required>
                    <option value="">请选择</option>
                    <option value="散货船">散货船</option>
                    <option value="油船">油船</option>
                    <option value="集装箱船">集装箱船</option>
                  </select>
                </div>
                <div class="form-item required">
                  <label>载重范围</label>
                  <select v-model="editForm.dwtRange" class="form-input" required>
                    <option value="">请选择</option>
                    <option value="5000-10000">5000-10000吨</option>
                    <option value="10000-30000">10000-30000吨</option>
                    <option value="30000-50000">30000-50000吨</option>
                    <option value="50000+">50000吨以上</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-item required">
                  <label>航区要求</label>
                  <select v-model="editForm.navigationArea" class="form-input" required>
                    <option value="">请选择</option>
                    <option value="无限航区">无限航区</option>
                    <option value="近洋航区">近洋航区</option>
                    <option value="沿海航区">沿海航区</option>
                  </select>
                </div>
                <div class="form-item required">
                  <label>船龄要求</label>
                  <select v-model="editForm.ageRequirement" class="form-input" required>
                    <option value="">请选择</option>
                    <option value="5">5年以内</option>
                    <option value="10">10年以内</option>
                    <option value="15">15年以内</option>
                    <option value="不限">不限</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>交接港口偏好</label>
                  <input v-model="editForm.portPreference" type="text" class="form-input" placeholder="如：上海、新加坡" />
                </div>
                <div class="form-item required">
                  <label>租赁期限</label>
                  <input v-model="editForm.leaseDuration" type="text" class="form-input" placeholder="如：12-24个月" required />
                </div>
              </div>

              <div class="form-item full-width required">
                <label>预算范围（万元/月）</label>
                <div class="range-inputs">
                  <input v-model.number="editForm.budgetMin" type="number" class="form-input" placeholder="最低预算" step="0.01" required />
                  <span class="separator">-</span>
                  <input v-model.number="editForm.budgetMax" type="number" class="form-input" placeholder="最高预算" step="0.01" required />
                </div>
              </div>
            </div>

            <!-- 航次租船需求 -->
            <div v-if="editForm.leaseType === 'voyage'" class="form-section">
              <h3 class="section-title">航次租船需求</h3>
              
              <div class="form-row">
                <div class="form-item required">
                  <label>船舶类型</label>
                  <select v-model="editForm.vesselType" class="form-input" required>
                    <option value="">请选择</option>
                    <option value="散货船">散货船</option>
                    <option value="油船">油船</option>
                    <option value="集装箱船">集装箱船</option>
                  </select>
                </div>
                <div class="form-item required">
                  <label>载重吨要求</label>
                  <input v-model.number="editForm.dwtRequired" type="number" class="form-input" placeholder="如：5000" required />
                </div>
              </div>

              <div class="form-item full-width required">
                <label>航线信息</label>
                <input v-model="editForm.voyageRoute" type="text" class="form-input" placeholder="如：上海-新加坡-釜山" required />
              </div>

              <div class="form-row">
                <div class="form-item required">
                  <label>载货类型</label>
                  <select v-model="editForm.cargoType" class="form-input" required>
                    <option value="">请选择</option>
                    <option value="散杂货">散杂货</option>
                    <option value="油品">油品</option>
                    <option value="集装箱">集装箱</option>
                  </select>
                </div>
                <div class="form-item required">
                  <label>航次时间要求</label>
                  <input v-model="editForm.voyageTimeline" type="text" class="form-input" placeholder="如：2个月内" required />
                </div>
              </div>

              <div class="form-item full-width required">
                <label>预算范围（万元/航次）</label>
                <div class="range-inputs">
                  <input v-model.number="editForm.budgetMin" type="number" class="form-input" placeholder="最低预算" step="0.01" required />
                  <span class="separator">-</span>
                  <input v-model.number="editForm.budgetMax" type="number" class="form-input" placeholder="最高预算" step="0.01" required />
                </div>
              </div>
            </div>

            <!-- 补充要求 -->
            <div class="form-section">
              <h3 class="section-title">补充要求</h3>
              
              <div class="form-item full-width">
                <label>补充说明</label>
                <textarea v-model="editForm.remarks" class="form-textarea" placeholder="填写船舶设备配置要求、禁止运输品类等特殊诉求（不超过300字）" maxlength="300" rows="4"></textarea>
                <span class="char-count">{{ editForm.remarks?.length || 0 }}/300</span>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchKeyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const editModalVisible = ref(false)
const editForm = ref({})

// 模拟数据
const demandsList = ref([
  {
    id: 1001,
    leaseType: 'time',
    title: '寻租5万吨散货船',
    companyName: '远洋运输有限公司',
    vesselType: '散货船',
    dwtRange: '50000+',
    navigationArea: '无限航区',
    ageRequirement: '10',
    portPreference: '上海、新加坡',
    leaseDuration: '12-24个月',
    budgetMin: 40,
    budgetMax: 60,
    status: 'published',
    publishDate: '2026-01-20',
    contactName: '王经理',
    contactPhone: '13800138000',
    remarks: '要求船况良好，具备相关证书'
  },
  {
    id: 1002,
    leaseType: 'voyage',
    title: '上海至新加坡航线求租',
    companyName: '海运物流股份公司',
    vesselType: '集装箱船',
    dwtRequired: 15000,
    voyageRoute: '上海-新加坡',
    cargoType: '集装箱',
    voyageTimeline: '1个月内',
    budgetMin: 80,
    budgetMax: 120,
    status: 'published',
    publishDate: '2026-01-25',
    contactName: '李总',
    contactPhone: '13900139000',
    remarks: ''
  }
])

const filteredList = computed(() => {
  return demandsList.value.filter(item => {
    const matchKeyword = !searchKeyword.value || 
      item.title.includes(searchKeyword.value) ||
      item.companyName.includes(searchKeyword.value)
    
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchType = !filterType.value || item.leaseType === filterType.value
    
    return matchKeyword && matchStatus && matchType
  })
})

const getTypeLabel = (type) => {
  const labels = {
    time: '期租',
    bareboat: '光租',
    voyage: '航次租船'
  }
  return labels[type] || type
}

const viewDetail = (item) => {
  console.log('[v0] 查看详情:', item)
}

const editItem = (item) => {
  editForm.value = { ...item }
  editModalVisible.value = true
}

const closeEditModal = () => {
  editModalVisible.value = false
  editForm.value = {}
}

const saveEdit = () => {
  console.log('[v0] 保存编辑:', editForm.value)
  const index = demandsList.value.findIndex(d => d.id === editForm.value.id)
  if (index !== -1) {
    demandsList.value[index] = { ...editForm.value }
  }
  closeEditModal()
}

const toggleStatus = (item) => {
  item.status = item.status === 'published' ? 'offline' : 'published'
  console.log('[v0] 切换状态:', item)
}
</script>

<style scoped>
.lease-request-demands {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-left {
  flex: 1;
}

.search-input {
  width: 100%;
  max-width: 400px;
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

.filter-right {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: #cbd5e1;
}

/* 需求卡片 */
.demands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.demand-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.demand-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.demand-id {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.type-badge.type-time {
  background: #dbeafe;
  color: #1e40af;
}

.type-badge.type-bareboat {
  background: #e9d5ff;
  color: #6b21a8;
}

.type-badge.type-voyage {
  background: #fed7aa;
  color: #9a3412;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.published {
  background: #dcfce7;
  color: #166534;
}

.status-badge.offline {
  background: #fee2e2;
  color: #991b1b;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demand-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.demand-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.info-row .label {
  color: #64748b;
}

.info-row .value {
  color: #0f172a;
  font-weight: 600;
  text-align: right;
}

.info-row .value.price {
  color: #f59e0b;
}

.card-footer {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.btn-action {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view {
  background: #f1f5f9;
  color: #475569;
}

.btn-view:hover {
  background: #e2e8f0;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #bfdbfe;
}

.btn-offline {
  background: #fee2e2;
  color: #991b1b;
}

.btn-offline:hover {
  background: #fecaca;
}

.btn-online {
  background: #dcfce7;
  color: #166534;
}

.btn-online:hover {
  background: #bbf7d0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #94a3b8;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* 弹窗 */
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
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
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
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e2e8f0;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
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

.form-item.full-width {
  grid-column: 1 / -1;
}

.form-item label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.form-item.required label::after {
  content: ' *';
  color: #ef4444;
}

.form-input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-textarea {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.3s;
}

.form-textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.char-count {
  font-size: 12px;
  color: #94a3b8;
  text-align: right;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.separator {
  color: #94a3b8;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  padding: 10px 24px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #f8fafc;
}

.btn-save {
  padding: 10px 24px;
  border: none;
  background: #0ea5e9;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover {
  background: #0284c7;
}
</style>

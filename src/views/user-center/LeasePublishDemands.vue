<template>
  <div class="lease-publish-demands">
    <div class="page-header">
      <h1>我的租赁信息</h1>
      <p class="subtitle">管理您发布的租赁信息和空船信息</p>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-left">
        <input 
          v-model="searchKeyword" 
          type="text" 
          class="search-input" 
          placeholder="搜索船名、IMO、船型..."
        />
      </div>
      <div class="filter-right">
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option value="published">已上架</option>
          <option value="offline">已下架</option>
        </select>
        <select v-model="filterType" class="filter-select">
          <option value="">全部类型</option>
          <option value="time">期租</option>
          <option value="bareboat">光租</option>
          <option value="voyage">航次租船</option>
          <option value="idle">空船</option>
        </select>
      </div>
    </div>

    <!-- 列表区域 -->
    <div class="vessels-grid">
      <div v-for="item in filteredList" :key="item.id" class="vessel-card">
        <div class="vessel-image">
          <img :src="item.image" :alt="item.vesselName" />
          <div class="status-badge" :class="item.status">
            {{ item.status === 'published' ? '已上架' : '已下架' }}
          </div>
          <div class="type-badge" :class="`type-${item.leaseType}`">
            {{ getTypeLabel(item.leaseType) }}
          </div>
        </div>
        
        <div class="vessel-content">
          <h3 class="vessel-title">{{ item.vesselName }}</h3>
          
          <div class="vessel-specs">
            <div class="spec-item">
              <span class="spec-label">船型</span>
              <span class="spec-value">{{ item.vesselType }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">载重</span>
              <span class="spec-value">{{ item.dwt }} DWT</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">船龄</span>
              <span class="spec-value">{{ item.age }}年</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">航区</span>
              <span class="spec-value">{{ item.navigationArea }}</span>
            </div>
          </div>

          <div v-if="item.leaseType !== 'idle'" class="price-info">
            <span class="price">{{ item.price }}</span>
            <span class="price-unit">万元/{{ item.leaseType === 'voyage' ? '航次' : '月' }}</span>
          </div>
          <div v-else class="idle-info">
            <span class="label">可用时间：</span>
            <span class="value">{{ item.availableDate }}</span>
          </div>

          <div class="vessel-footer">
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
        <path d="M20 7h-9M14 17h6M3 7h.01M3 12h.01M3 17h.01M6 7h.01M6 12h.01M6 17h.01"/>
      </svg>
      <p>暂无租赁信息</p>
    </div>

    <!-- 编辑弹窗 -->
    <div v-if="editModalVisible" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>编辑{{ editForm.leaseType === 'idle' ? '空船信息' : '租赁信息' }}</h2>
          <button class="close-btn" @click="closeEditModal">✕</button>
        </div>

        <div class="modal-body">
          <form class="edit-form">
            <!-- 船舶基本信息（只读） -->
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
    id: 1,
    vesselName: '远洋货轮',
    imo: 'IMO9876543',
    vesselType: '散货船',
    dwt: 57000,
    age: 8,
    navigationArea: '无限航区',
    leaseType: 'time',
    price: '50',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=400&h=300&fit=crop',
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
    mainEngineModel: '6S50MC',
    deadweight: 32000,
    rentalPrice: 50,
    leaseDuration: '12-24',
    availableDate: '2026-03-01',
    rentalRequirements: '船况良好，具备相关运营资质',
    contactName: '张先生',
    contactPhone: '13800138000'
  },
  {
    id: 2,
    vesselName: '海洋之星',
    imo: 'IMO9876544',
    vesselType: '油船',
    dwt: 45000,
    age: 10,
    navigationArea: '无限航区',
    leaseType: 'idle',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1568478784932-3e1c6d4c6c0e?w=400&h=300&fit=crop',
    availableDate: '2026-02-15 至 2026-05-15',
    currentLocation: '上海港',
    availableDateStart: '2026-02-15',
    availableDateEnd: '2026-05-15',
    leaseTypes: ['time', 'bareboat'],
    remarks: '船况良好，可立即投入使用',
    contactName: '李女士',
    contactPhone: '13900139000',
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
    mainEngineModel: 'MAN B&W',
    deadweight: 28000
  }
])

const filteredList = computed(() => {
  return demandsList.value.filter(item => {
    const matchKeyword = !searchKeyword.value || 
      item.vesselName.includes(searchKeyword.value) ||
      item.imo.includes(searchKeyword.value) ||
      item.vesselType.includes(searchKeyword.value)
    
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchType = !filterType.value || item.leaseType === filterType.value
    
    return matchKeyword && matchStatus && matchType
  })
})

const getTypeLabel = (type) => {
  const labels = {
    time: '期租',
    bareboat: '光租',
    voyage: '航次租船',
    idle: '空船'
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
.lease-publish-demands {
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

/* 卡片网格 */
.vessels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.vessel-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.vessel-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.vessel-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.vessel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 20px;
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

.type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
}

.type-badge.type-time {
  color: #0ea5e9;
}

.type-badge.type-bareboat {
  color: #8b5cf6;
}

.type-badge.type-voyage {
  color: #f59e0b;
}

.type-badge.type-idle {
  color: #10b981;
}

.vessel-content {
  padding: 20px;
}

.vessel-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
}

.vessel-specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-label {
  font-size: 13px;
  color: #64748b;
}

.spec-value {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.price-info, .idle-info {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #0ea5e9;
}

.price-unit {
  font-size: 14px;
  color: #64748b;
  margin-left: 4px;
}

.idle-info {
  text-align: left;
}

.idle-info .label {
  font-size: 13px;
  color: #64748b;
}

.idle-info .value {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.vessel-footer {
  display: flex;
  gap: 8px;
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
  max-width: 800px;
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

.form-input:read-only {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
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

.date-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.separator {
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
  gap: 8px;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
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

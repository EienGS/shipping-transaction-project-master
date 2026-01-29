<template>
  <div class="sale-demands-page">
    <div class="page-header">
      <h1 class="page-title">我的出售船舶</h1>
      <button class="btn-publish" @click="goToPublish">
        <svg viewBox="0 0 24 24" fill="none" class="icon">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        发布出售信息
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
          <option value="">船舶类型</option>
          <option value="散货船">散货船</option>
          <option value="油船">油船</option>
          <option value="集装箱船">集装箱船</option>
        </select>

        <input 
          v-model="searchKeyword" 
          type="text" 
          class="search-input" 
          placeholder="搜索船名、船舶类型..."
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
          <div class="type-badge">{{ vessel.type }}</div>
        </div>

        <div class="card-body">
          <div class="card-header">
            <h3 class="vessel-name">{{ vessel.name }}</h3>
            <div class="intention-badge" v-if="vessel.intentionCount > 0">
              <svg viewBox="0 0 24 24" fill="none" class="icon">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ vessel.intentionCount }}人意向
            </div>
          </div>

          <div class="vessel-meta">
            <span>{{ vessel.age }}年船龄</span>
            <span class="divider">|</span>
            <span>{{ vessel.dwt }} DWT</span>
          </div>

          <div class="vessel-info">
            <div class="info-row">
              <span class="label">期望售价:</span>
              <span class="price">¥ {{ vessel.price }}<small>万</small></span>
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
      <p class="empty-text">暂无出售船舶信息</p>
      <button class="btn-empty-publish" @click="goToPublish">立即发布</button>
    </div>

    <!-- 编辑模态框 -->
    <div v-if="editModalVisible" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>编辑船舶出售信息</h2>
          <button class="close-btn" @click="closeEditModal">✕</button>
        </div>

        <div class="modal-body-wrapper">
          <form @submit.prevent="saveEdit" class="modal-form"
            <!-- 船舶基本信息 -->
            <div class="form-section">
              <h3 class="section-title">船舶基本信息</h3>
              
              <div class="form-row">
                <div class="form-item required">
                  <label>船舶类型</label>
                  <select v-model="editForm.vesselType" class="form-input" required>
                    <option value="">请选择船舶类型</option>
                    <option value="散货船">散货船</option>
                    <option value="集装箱船">集装箱船</option>
                    <option value="油船">油船</option>
                  </select>
                </div>

                <div class="form-item required">
                  <label>航区</label>
                  <select v-model="editForm.navigationArea" class="form-input" required>
                    <option value="">请选择航区</option>
                    <option value="无限航区">无限航区</option>
                    <option value="近海航区">近海航区</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>船名</label>
                  <input v-model="editForm.vesselName" type="text" class="form-input" />
                </div>

                <div class="form-item">
                  <label>船级</label>
                  <select v-model="editForm.classificationSociety" class="form-input">
                    <option value="">请选择船级社</option>
                    <option value="CCS">CCS</option>
                    <option value="ABS">ABS</option>
                    <option value="LR">LR</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>建造厂</label>
                  <input v-model="editForm.buildPlace" type="text" class="form-input" />
                </div>

                <div class="form-item required">
                  <label>建造日期</label>
                  <input v-model="editForm.buildDate" type="date" class="form-input" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item required">
                  <label>船旗</label>
                  <select v-model="editForm.flag" class="form-input" required>
                    <option value="">请选择船旗</option>
                    <option value="中国">中国</option>
                    <option value="巴拿马">巴拿马</option>
                  </select>
                </div>

                <div class="form-item">
                  <label>船籍港</label>
                  <input v-model="editForm.portOfRegistry" type="text" class="form-input" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item required">
                  <label>总吨（吨）</label>
                  <input v-model.number="editForm.grossTonnage" type="number" class="form-input" required />
                </div>

                <div class="form-item required">
                  <label>净吨（吨）</label>
                  <input v-model.number="editForm.netTonnage" type="number" class="form-input" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item required">
                  <label>总长（米）</label>
                  <input v-model.number="editForm.length" type="number" step="0.01" class="form-input" required />
                </div>

                <div class="form-item required">
                  <label>型宽（米）</label>
                  <input v-model.number="editForm.width" type="number" step="0.01" class="form-input" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item required">
                  <label>型深（米）</label>
                  <input v-model.number="editForm.depth" type="number" step="0.01" class="form-input" required />
                </div>

                <div class="form-item required">
                  <label>载重（吨）</label>
                  <input v-model.number="editForm.deadweight" type="number" class="form-input" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item">
                  <label>主机功率（kw）</label>
                  <input v-model.number="editForm.mainEnginePower" type="number" class="form-input" />
                </div>

                <div class="form-item">
                  <label>主机型号</label>
                  <input v-model="editForm.mainEngineModel" type="text" class="form-input" />
                </div>
              </div>
            </div>

            <!-- 出售信息 -->
            <div class="form-section">
              <h3 class="section-title">出售信息</h3>
              
              <div class="form-row">
                <div class="form-item required">
                  <label>期望售价（万元）</label>
                  <input v-model.number="editForm.expectedPrice" type="number" step="0.01" class="form-input" required />
                </div>

                <div class="form-item required">
                  <label>是否在航</label>
                  <select v-model="editForm.inService" class="form-input" required>
                    <option value="">请选择</option>
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
              </div>

              <div v-if="editForm.inService === '是'" class="form-row">
                <div class="form-item">
                  <label>当前航线信息</label>
                  <input v-model="editForm.currentRoute" type="text" class="form-input" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-item required">
                  <label>日常保养状况</label>
                  <select v-model="editForm.maintenanceStatus" class="form-input" required>
                    <option value="">请选择</option>
                    <option value="一般">一般</option>
                    <option value="良好">良好</option>
                    <option value="非常好">非常好</option>
                  </select>
                </div>

                <div class="form-item required">
                  <label>坞检/特检情况</label>
                  <select v-model="editForm.dockInspection" class="form-input" required>
                    <option value="">请选择</option>
                    <option value="无">无</option>
                    <option value="三个月内">三个月内</option>
                    <option value="六个月内">六个月内</option>
                  </select>
                </div>
              </div>

              <div class="form-item">
                <label>备注说明</label>
                <textarea v-model="editForm.remarks" class="form-textarea" placeholder="请输入其他说明"></textarea>
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

            <!-- 证书图纸 -->
            <div class="form-section">
              <h3 class="section-title">证书图纸</h3>
              <p class="section-tips">上传船舶相关证书和技术图纸（支持PDF、JPG、PNG格式，单个文件不超过20MB）</p>
              
              <div class="upload-list">
                <div v-for="(cert, index) in editForm.certificates" :key="index" class="upload-item">
                  <div class="upload-item-header">
                    <span class="cert-name">{{ cert.name }}</span>
                    <button type="button" class="btn-remove-upload" @click="removeCertificate(index)">删除</button>
                  </div>
                  <div class="file-preview">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="file-icon">
                      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
                      <path d="M13 2v7h7"/>
                    </svg>
                    <span v-if="cert.file" class="file-name">{{ cert.file.name }}</span>
                    <span v-else class="file-name">{{ cert.name }}</span>
                    <span v-if="cert.file" class="file-size">{{ (cert.file.size / 1024 / 1024).toFixed(2) }} MB</span>
                  </div>
                </div>
                
                <div class="upload-box" @click="triggerCertificateUpload">
                  <input ref="certificateInput" type="file" accept=".pdf,.jpg,.jpeg,.png" style="display: none" @change="handleCertificateUpload" multiple />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="upload-icon">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  <p>点击上传证书文件</p>
                </div>
              </div>
            </div>

            <!-- 船舶照片 -->
            <div class="form-section">
              <h3 class="section-title">船舶照片</h3>
              <p class="section-tips">至少上传3张照片（整船外观照、主要舱室照、设备细节照等，支持JPG、PNG格式）</p>
              
              <div class="photo-grid">
                <div v-for="(photo, index) in editForm.photos" :key="index" class="photo-item">
                  <img :src="photo.preview" :alt="`照片${index + 1}`" />
                  <button type="button" class="btn-remove-photo" @click="removePhoto(index)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                
                <div class="photo-upload-box" @click="triggerPhotoUpload">
                  <input ref="photoInput" type="file" accept="image/jpeg,image/jpg,image/png" style="display: none" @change="handlePhotoUpload" multiple />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="upload-icon">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  <p>上传照片</p>
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
import { ref, computed, onMounted } from 'vue'
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

// 编辑表单
const editForm = ref({
  vesselType: '',
  navigationArea: '',
  vesselName: '',
  classificationSociety: '',
  buildPlace: '',
  buildDate: '',
  flag: '',
  portOfRegistry: '',
  grossTonnage: null,
  netTonnage: null,
  length: null,
  width: null,
  depth: null,
  deadweight: null,
  mainEnginePower: null,
  mainEngineModel: '',
  expectedPrice: null,
  inService: '',
  currentRoute: '',
  maintenanceStatus: '',
  dockInspection: '',
  remarks: '',
  contactPerson: '',
  contactPhone: '',
  certificates: [],
  photos: []
})

// 上传文件的 refs
const certificateInput = ref(null)
const photoInput = ref(null)

// Mock 数据
const vessels = ref([
  {
    id: 1,
    name: 'OCEAN STAR',
    type: '散货船',
    age: 8,
    dwt: 57000,
    price: 4500,
    status: 'approved',
    publishDate: '2026-01-15',
    intentionCount: 5,
    pendingIntentions: 2,
    certificates: [
      { name: '船舶所有权证', url: '/certificates/1.pdf' },
      { name: '船舶国籍证', url: '/certificates/2.pdf' }
    ],
    photos: [
      { url: 'https://images.unsplash.com/photo-1494783367193-149034c05e41?w=500&h=400&fit=crop', name: '整船外观' },
      { url: 'https://images.unsplash.com/photo-1537996881514-5f6b4c5f5f5f?w=500&h=400&fit=crop', name: '驾驶舱' },
      { url: 'https://images.unsplash.com/photo-1567899378793-4a4c64a41b41?w=500&h=400&fit=crop', name: '货舱' }
    ]
  },
  {
    id: 2,
    name: 'SEA DRAGON',
    type: '油船',
    age: 12,
    dwt: 75000,
    price: 6200,
    status: 'approved',
    publishDate: '2026-01-10',
    intentionCount: 8,
    pendingIntentions: 3,
    certificates: [
      { name: '船舶所有权证', url: '/certificates/3.pdf' }
    ],
    photos: [
      { url: 'https://images.unsplash.com/photo-1484480494535-76d3d37e60d8?w=500&h=400&fit=crop', name: '整船外观' }
    ]
  },
  {
    id: 3,
    name: 'PACIFIC HERO',
    type: '集装箱船',
    age: 5,
    dwt: 32000,
    price: 3800,
    status: 'offline',
    publishDate: '2026-01-05',
    intentionCount: 0,
    pendingIntentions: 0,
    certificates: [],
    photos: []
  },
  {
    id: 4,
    name: 'GOLDEN WAVE',
    type: '散货船',
    age: 15,
    dwt: 48000,
    price: 2900,
    status: 'pending',
    publishDate: '2026-01-20',
    intentionCount: 0,
    pendingIntentions: 0,
    certificates: [],
    photos: []
  }
])

// 计算过滤后的船舶列表
const filteredVessels = computed(() => {
  let result = vessels.value

  if (filterStatus.value) {
    result = result.filter(v => v.status === filterStatus.value)
  }

  if (filterType.value) {
    result = result.filter(v => v.type === filterType.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(v => 
      v.name.toLowerCase().includes(keyword) || 
      v.type.toLowerCase().includes(keyword)
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
  console.log('[v0] 应用筛选:', { filterStatus: filterStatus.value, filterType: filterType.value, searchKeyword: searchKeyword.value })
}

// 重置筛选
const resetFilters = () => {
  filterStatus.value = ''
  filterType.value = ''
  searchKeyword.value = ''
}

// 跳转到发布页面
const goToPublish = () => {
  router.push('/shipping-trade/sell-vessel')
}

// 查看详情
const viewDetail = (id) => {
  console.log('[v0] 查看详情:', id)
  router.push({
    path: `/shipping-trade/vessel/${id}`,
    query: { owner: 'true' }
  })
}

// 编辑船舶
const editVessel = (id) => {
  console.log('[v0] 编辑船舶:', id)
  currentVesselId.value = id
  const vessel = vessels.value.find(v => v.id === id)
  
  // 填充编辑表单
  editForm.value = {
    vesselType: vessel.type,
    navigationArea: '无限航区',
    vesselName: vessel.name,
    classificationSociety: 'CCS',
    buildPlace: '大连船厂',
    buildDate: '2015-06-01',
    flag: '中国',
    portOfRegistry: '上海',
    grossTonnage: 36000,
    netTonnage: 21000,
    length: 189.99,
    width: 32.26,
    depth: 18.50,
    deadweight: vessel.dwt,
    mainEnginePower: 8600,
    mainEngineModel: 'MAN B&W 6550ME-B9',
    expectedPrice: vessel.price,
    inService: '否',
    currentRoute: '',
    maintenanceStatus: '良好',
    dockInspection: '六个月内',
    remarks: '',
    contactPerson: '张三',
    contactPhone: '13800138000',
    // 加载已有的证书和照片
    certificates: vessel.certificates?.map(cert => ({
      name: cert.name,
      file: null,
      url: cert.url
    })) || [],
    photos: vessel.photos?.map(photo => ({
      file: null,
      preview: photo.url,
      name: photo.name
    })) || []
  }
  
  editModalVisible.value = true
}

// 保存编辑
const saveEdit = () => {
  console.log('[v0] 保存编辑:', editForm.value)
  // 实际应该调用API保存数据
  editModalVisible.value = false
}

// 关闭编辑模态框
const closeEditModal = () => {
  editModalVisible.value = false
}

// 触发证书上传
const triggerCertificateUpload = () => {
  certificateInput.value?.click()
}

// 处理证书上传
const handleCertificateUpload = (event) => {
  const files = Array.from(event.target.files || [])
  files.forEach(file => {
    if (file.size > 20 * 1024 * 1024) {
      alert(`文件 ${file.name} 超过20MB，请重新选择`)
      return
    }
    editForm.value.certificates.push({
      name: file.name,
      file: file
    })
  })
  // 清空input以便再次上传同一文件
  event.target.value = ''
}

// 移除证书
const removeCertificate = (index) => {
  editForm.value.certificates.splice(index, 1)
}

// 触发照片上传
const triggerPhotoUpload = () => {
  photoInput.value?.click()
}

// 处理照片上传
const handlePhotoUpload = (event) => {
  const files = Array.from(event.target.files || [])
  files.forEach(file => {
    if (file.size > 20 * 1024 * 1024) {
      alert(`文件 ${file.name} 超过20MB，请重新选择`)
      return
    }
    // 创建预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      editForm.value.photos.push({
        file: file,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  })
  // 清空input
  event.target.value = ''
}

// 移除照片
const removePhoto = (index) => {
  editForm.value.photos.splice(index, 1)
}

// 确认下架
const confirmOffline = (id) => {
  currentVesselId.value = id
  confirmTitle.value = '确认下架'
  confirmMessage.value = '确定要下架该船舶吗？下架后将不在交易市场展示。'
  confirmAction.value = 'offline'
  confirmDialogVisible.value = true
}

// 确认上架
const confirmOnline = (id) => {
  currentVesselId.value = id
  confirmTitle.value = '确认上架'
  confirmMessage.value = '确定要上架该船舶吗？上架后将在交易市场展示。'
  confirmAction.value = 'online'
  confirmDialogVisible.value = true
}

// 处理确认操作
const handleConfirm = () => {
  const vessel = vessels.value.find(v => v.id === currentVesselId.value)
  
  if (confirmAction.value === 'offline') {
    console.log('[v0] 下架船舶:', currentVesselId.value)
    vessel.status = 'offline'
  } else if (confirmAction.value === 'online') {
    console.log('[v0] 上架船舶:', currentVesselId.value)
    vessel.status = 'approved'
  }
  
  confirmDialogVisible.value = false
}

onMounted(() => {
  console.log('[v0] SaleDemands page mounted')
})
</script>

<style scoped>
.sale-demands-page {
  background: white;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.btn-publish {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-publish:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.btn-publish .icon {
  width: 20px;
  height: 20px;
}

/* 筛选栏 */
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-group {
  display: flex;
  gap: 12px;
  flex: 1;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #475569;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #0ea5e9;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #475569;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
}

.btn-reset {
  padding: 8px 16px;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 6px;
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.vessel-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.vessel-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

/* 卡片图片 */
.card-image {
  position: relative;
  width: 100%;
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
  left: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.status-badge.pending {
  background: #f59e0b;
}

.status-badge.approved {
  background: #10b981;
}

.status-badge.offline {
  background: #6b7280;
}

.status-badge.rejected {
  background: #ef4444;
}

.type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* 卡片主体 */
.card-body {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.vessel-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.intention-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #fef3c7;
  color: #d97706;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.intention-badge .icon {
  width: 14px;
  height: 14px;
}

.vessel-meta {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
}

.divider {
  margin: 0 8px;
  color: #cbd5e1;
}

.vessel-info {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row .label {
  color: #64748b;
}

.info-row .value {
  color: #475569;
  font-weight: 500;
}

.info-row .price {
  color: #ef4444;
  font-size: 16px;
  font-weight: 700;
}

.info-row .price small {
  font-size: 12px;
  margin-left: 2px;
}

/* 卡片操作 */
.card-actions {
  display: flex;
  gap: 8px;
}

.card-actions button {
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
  background: #f1f5f9;
  color: #475569;
}

.btn-detail:hover {
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
  color: #dc2626;
}

.btn-offline:hover {
  background: #fecaca;
}

.btn-online {
  background: #dcfce7;
  color: #16a34a;
}

.btn-online:hover {
  background: #bbf7d0;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 24px;
}

.btn-empty-publish {
  padding: 12px 24px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-empty-publish:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
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

.modal-content.confirm {
  max-width: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
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
  background: #f8fafc;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* 表单样式 */
.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.form-input {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #0ea5e9;
}

.form-textarea {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  resize: vertical;
  min-height: 80px;
}

.form-textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.section-tips {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
}

/* 上传列表 */
.upload-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.upload-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.cert-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.btn-remove-upload {
  padding: 4px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-remove-upload:hover {
  background: #dc2626;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  width: 20px;
  height: 20px;
  color: #0ea5e9;
}

.file-name {
  font-size: 13px;
  color: #475569;
  flex: 1;
}

.file-size {
  font-size: 12px;
  color: #94a3b8;
}

.upload-box {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.upload-box:hover {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #94a3b8;
  margin: 0 auto 12px;
}

.upload-box p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

/* 照片网格 */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-photo {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-remove-photo:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.btn-remove-photo svg {
  width: 16px;
  height: 16px;
  color: white;
}

.photo-upload-box {
  aspect-ratio: 1;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.photo-upload-box:hover {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.photo-upload-box .upload-icon {
  width: 32px;
  height: 32px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.photo-upload-box p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

/* 模态框按钮 */
.btn-cancel {
  padding: 10px 20px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-save,
.btn-confirm {
  padding: 10px 20px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover,
.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

@media (max-width: 768px) {
  .vessels-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
  }
}
</style>

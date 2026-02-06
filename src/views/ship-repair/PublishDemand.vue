<template>
  <div class="publish-demand-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-desc">{{ pageDescription }}</p>
      </div>

      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <!-- 通用基础信息 -->
          <section class="form-section">
            <h2 class="section-title">基础信息</h2>

            <!-- 自动生成的标题预览 -->
            <div v-if="generateTitle" class="title-preview">
              <span class="preview-label">需求标题：</span>
              <span class="preview-value">{{ generateTitle }}</span>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">联系人</label>
                <input v-model="formData.contact" type="text" class="form-input" placeholder="请输入联系人" required>
              </div>

              <div class="form-item">
                <label class="form-label required">联系电话</label>
                <input v-model="formData.phone" type="tel" class="form-input" placeholder="请输入联系电话" required>
              </div>
            </div>
          </section>

          <!-- 设计需求专属字段 -->
          <section v-if="demandType === 'design'" class="form-section">
            <h2 class="section-title">设计需求</h2>
            
            <div class="form-row form-row-three">
              <div class="form-item">
                <label class="form-label required">船舶类型</label>
                <select v-model="formData.shipType" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="散货船">散货船</option>
                  <option value="油船">油船</option>
                  <option value="集装箱船">集装箱船</option>
                  <option value="冷藏船">冷藏船</option>
                </select>
              </div>

              <div class="form-item">
                <label class="form-label required">设计吨位</label>
                <div class="input-group">
                  <input v-model.number="formData.designTonnage" type="number" class="form-input" placeholder="请输入数值" required>
                  <span class="input-suffix">DWT</span>
                </div>
              </div>

              <div class="form-item">
                <label class="form-label required">航区要求</label>
                <select v-model="formData.navigationArea" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="unlimited">无限航区</option>
                  <option value="coastal">沿海航区</option>
                  <option value="river">内河航区</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">需求所在地</label>
                <div class="location-select">
                  <select v-model="formData.province" class="form-select" @change="onProvinceChange" required>
                    <option value="">请选择省份</option>
                    <option v-for="province in provinces" :key="province.code" :value="province.code">
                      {{ province.name }}
                    </option>
                  </select>
                  <select v-model="formData.city" class="form-select" :disabled="!formData.province" required>
                    <option value="">请选择城市</option>
                    <option v-for="city in cities" :key="city.code" :value="city.name">
                      {{ city.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-item">
                <label class="form-label">设计预算范围</label>
                <div class="input-group">
                  <input v-model="formData.budgetMin" type="number" class="form-input" placeholder="最小">
                  <span class="input-separator">-</span>
                  <input v-model="formData.budgetMax" type="number" class="form-input" placeholder="最大">
                  <span class="input-suffix">万元</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 造船需求专属字段 -->
          <section v-if="demandType === 'build'" class="form-section">
            <h2 class="section-title">造船需求</h2>
            
            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">船舶类型</label>
                <select v-model="formData.shipType" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="散货船">散货船</option>
                  <option value="油船">油船</option>
                  <option value="集装箱船">集装箱船</option>
                  <option value="冷藏船">冷藏船</option>
                </select>
              </div>

              <div class="form-item">
                <label class="form-label required">建造吨位</label>
                <div class="input-group">
                  <input v-model.number="formData.buildTonnage" type="number" class="form-input" placeholder="请输入数值" required>
                  <span class="input-suffix">DWT</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item full-width">
                <label class="form-label required">动力系统配置要求</label>
                <textarea v-model="formData.powerSystem" class="form-textarea" placeholder="请描述动力系统配置要求" rows="3" required></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">需求所在地</label>
                <div class="location-select">
                  <select v-model="formData.province" class="form-select" @change="onProvinceChange" required>
                    <option value="">请选择省份</option>
                    <option v-for="province in provinces" :key="province.code" :value="province.code">
                      {{ province.name }}
                    </option>
                  </select>
                  <select v-model="formData.city" class="form-select" :disabled="!formData.province" required>
                    <option value="">请选择城市</option>
                    <option v-for="city in cities" :key="city.code" :value="city.name">
                      {{ city.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-item">
                <label class="form-label required">预算范围</label>
                <div class="input-group">
                  <input v-model="formData.budgetMin" type="number" class="form-input" placeholder="最小" required>
                  <span class="input-separator">-</span>
                  <input v-model="formData.budgetMax" type="number" class="form-input" placeholder="最大" required>
                  <span class="input-suffix">万元</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 维修需求专属字段 -->
          <section v-if="demandType === 'repair'" class="form-section">
            <h2 class="section-title">维修需求</h2>
            
            <div class="form-row">
              <div class="form-item full-width">
                <label class="form-label required">关联自有船舶</label>
                <select v-model="formData.vesselId" class="form-select" required @change="loadVesselInfo">
                  <option value="">请选择船舶</option>
                  <option value="1">散货船 OCEAN STAR（IMO1234567）</option>
                  <option value="2">油船 SEA DRAGON（IMO7654321）</option>
                </select>
              </div>
            </div>

            <div v-if="formData.vesselId" class="vessel-info-box">
              <h3 class="info-title">船舶基础信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">船名:</span>
                  <span class="info-value">{{ vesselInfo.name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">船舶类型:</span>
                  <span class="info-value">{{ vesselInfo.shipType }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">吨位:</span>
                  <span class="info-value">{{ vesselInfo.tonnage }}DWT</span>
                </div>
                <div class="info-item">
                  <span class="info-label">识别号:</span>
                  <span class="info-value">{{ vesselInfo.imo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">船龄:</span>
                  <span class="info-value">{{ vesselInfo.age }}年</span>
                </div>
                <div class="info-item">
                  <span class="info-label">当前位置:</span>
                  <span class="info-value">{{ vesselInfo.location }}</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">维修内容</label>
                <select v-model="formData.repairType" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="routine">常规保养</option>
                  <option value="fault">故障维修</option>
                  <option value="major">大修</option>
                  <option value="emergency">应急维修</option>
                </select>
              </div>

              <div class="form-item">
                <label class="form-label required">维修紧急程度</label>
                <select v-model="formData.urgency" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="normal">普通</option>
                  <option value="urgent">紧急</option>
                  <option value="express">加急</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item full-width">
                <label class="form-label required">故障/维修部位</label>
                <textarea v-model="formData.faultPart" class="form-textarea" placeholder="请详细描述故障部位和具体问题" rows="3" required></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">维修地点偏好</label>
                <select v-model="formData.repairLocation" class="form-select" required>
                  <option value="">请选择</option>
                  <option value="shipyard">船厂维修</option>
                  <option value="onsite">上门维修</option>
                  <option value="port">港口就近维修</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item">
                <label class="form-label required">需求所在地</label>
                <div class="location-select">
                  <select v-model="formData.province" class="form-select" @change="onProvinceChange" required>
                    <option value="">请选择省份</option>
                    <option v-for="province in provinces" :key="province.code" :value="province.code">
                      {{ province.name }}
                    </option>
                  </select>
                  <select v-model="formData.city" class="form-select" :disabled="!formData.province" required>
                    <option value="">请选择城市</option>
                    <option v-for="city in cities" :key="city.code" :value="city.name">
                      {{ city.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-item">
                <label class="form-label">维修预算范围</label>
                <div class="input-group">
                  <input v-model="formData.budgetMin" type="number" class="form-input" placeholder="最小">
                  <span class="input-separator">-</span>
                  <input v-model="formData.budgetMax" type="number" class="form-input" placeholder="最大">
                  <span class="input-suffix">万元</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item full-width">
                <label class="form-label">故障照片/视频上传</label>
                <div class="upload-area">
                  <input type="file" id="fileUpload" class="file-input" accept="image/*,video/*" multiple @change="handleFileUpload">
                  <label for="fileUpload" class="upload-label">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2"/>
                      <path d="M17 8L12 3L7 8M12 3V15" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>点击上传文件</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <!-- 相似船舶推荐（仅设计和建造需求） -->
          <section v-if="demandType !== 'repair'" class="form-section recommendations-section">
            <h2 class="section-title">设计参考</h2>
            
            <!-- 有相似船舶时显示推荐 -->
            <div v-if="similarVessels.length > 0" class="vessels-recommendations">
              <p class="recommendation-tip">根据您输入的船舶类型和吨位，为您推荐以下相似船舶供设计参考，请选择一个参考船型：</p>
              
              <div class="vessels-grid">
                <div 
                  v-for="vessel in similarVessels" 
                  :key="vessel.id" 
                  class="vessel-card" 
                  :class="{ 'selected': formData.selectedReferenceVessel === vessel.id }"
                  @click="selectVessel(vessel.id)"
                >
                  <!-- 选中标识 -->
                  <div class="select-indicator">
                    <div class="radio-circle">
                      <div class="radio-dot"></div>
                    </div>
                  </div>

                  <div class="vessel-content">
                    <div class="vessel-image-container">
                      <img :src="vessel.image" :alt="vessel.name" class="vessel-image">
                    </div>
                    <div class="vessel-info">
                      <h3 class="vessel-name">{{ vessel.name }}</h3>
                      <div class="vessel-specs">
                        <span class="spec-badge">{{ vessel.tonnage.toLocaleString() }} DWT</span>
                        <span v-if="vessel.length" class="spec-badge">总长 {{ vessel.length }}m</span>
                        <span v-if="vessel.width" class="spec-badge">型宽 {{ vessel.width }}m</span>
                        <span v-if="vessel.depth" class="spec-badge">型深 {{ vessel.depth }}m</span>
                      </div>
                      <p class="vessel-description">{{ vessel.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 没有找到相似船舶时显示提示 -->
            <div v-else-if="showNoResults" class="no-results">
              <svg class="no-results-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <p class="no-results-text">未查询到相似船舶</p>
              <p class="no-results-hint">当前船型暂无参考船舶数据，您可以继续填写需求信息</p>
            </div>

            <!-- 未输入船型和吨���时的提示 -->
            <div v-else class="empty-state">
              <p class="empty-text">请先选择船舶类型并输入吨位，系统将为您推荐相似船舶作为参考</p>
            </div>
          </section>

          <!-- 补充说明 -->
          <section class="form-section">
            <h2 class="section-title">补充说明</h2>
            
            <div class="form-row">
              <div class="form-item full-width">
                <label class="form-label">补充说明</label>
                <textarea v-model="formData.notes" class="form-textarea" placeholder="请填写补充说明（500字以内）" rows="4" maxlength="500"></textarea>
                <div class="char-count">{{ formData.notes?.length || 0 }}/500</div>
              </div>
            </div>
          </section>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <button type="button" class="btn-preview" @click="handlePreview">预览效果</button>
            <button type="submit" class="btn-submit">提交审核</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findSimilarVessels } from '../../data/referenceVessels'

const route = useRoute()
const router = useRouter()

const demandType = ref(route.params.type || 'design')

const pageTitle = computed(() => {
  const titles = {
    design: '发布设计需求',
    build: '发布造船需求',
    repair: '发布维修需求'
  }
  return titles[demandType.value] || '发布需求'
})

const pageDescription = computed(() => {
  const descs = {
    design: '填写船舶设计需求信息，我们将为您匹配优质设计院',
    build: '填写造船需求信息，我们将为您推荐合适的造船厂',
    repair: '填写维修需求信息，智能推荐周边优质修船厂'
  }
  return descs[demandType.value] || ''
})

// 自动生成需求标题：吨位 + 船舶类型 + 需求类型
const generateTitle = computed(() => {
  let tonnage = ''
  let shipType = formData.value.shipType || ''
  let demandTypeText = ''

  // 获取吨位
  if (demandType.value === 'design' && formData.value.designTonnage) {
    tonnage = `${formData.value.designTonnage}DWT`
  } else if (demandType.value === 'build' && formData.value.buildTonnage) {
    tonnage = `${formData.value.buildTonnage}DWT`
  } else if (demandType.value === 'repair' && formData.value.repairTonnage) {
    tonnage = `${formData.value.repairTonnage}DWT`
  }

  // 获取需求类型
  const demandTypeMap = {
    design: '设计需求',
    build: '建造需求',
    repair: '维修需求'
  }
  demandTypeText = demandTypeMap[demandType.value] || ''

  // 组合标题
  if (tonnage && shipType && demandTypeText) {
    return `${tonnage}${shipType}${demandTypeText}`
  }
  return ''
})

// 相似船舶推荐（仅用于设计和建造需求）
const similarVessels = computed(() => {
  // 维修需求不显示推荐
  if (demandType.value === 'repair') {
    return []
  }

  const shipType = formData.value.shipType
  let tonnage = null

  // 获取当前输入的吨位
  if (demandType.value === 'design') {
    tonnage = formData.value.designTonnage
  } else if (demandType.value === 'build') {
    tonnage = formData.value.buildTonnage
  }

  // 如果没有输入船舶类型或吨位，返回空数组
  if (!shipType || !tonnage) {
    return []
  }

  console.log('[v0] 查询相似船舶:', { shipType, tonnage })
  const results = findSimilarVessels(shipType, tonnage, 1000)
  console.log('[v0] 找到相似船舶:', results.length, '艘')
  
  return results
})

// 是否显示"未查询到相似船舶"提示
const showNoResults = computed(() => {
  // 维修需求不显示
  if (demandType.value === 'repair') {
    return false
  }

  const shipType = formData.value.shipType
  let tonnage = null

  if (demandType.value === 'design') {
    tonnage = formData.value.designTonnage
  } else if (demandType.value === 'build') {
    tonnage = formData.value.buildTonnage
  }

  // 只有在输入了船舶类型和吨位，但找不到相似船舶时才显示
  return shipType && tonnage && similarVessels.value.length === 0
})

const formData = ref({
  shipType: '',
  contact: '',
  phone: '',
  notes: '',
  selectedReferenceVessel: null, // 选中的参考船舶ID
  // 设计专属
  designTonnage: null,
  navigationArea: '',
  // 造船专属
  buildTonnage: null,
  powerSystem: '',
  // 维修专属
  repairTonnage: null,
  vesselId: '',
  repairType: '',
  urgency: '',
  faultPart: '',
  repairLocation: '',
  // 通用
  province: '',
  city: '',
  budgetMin: null,
  budgetMax: null,
})

// 省市数据
const provinces = ref([
  { code: 'shanghai', name: '上海' },
  { code: 'beijing', name: '北京' },
  { code: 'guangdong', name: '广东省' },
  { code: 'zhejiang', name: '浙江省' },
  { code: 'jiangsu', name: '江苏省' },
  { code: 'fujian', name: '福建省' },
  { code: 'shandong', name: '山东省' },
  { code: 'liaoning', name: '辽宁省' },
  { code: 'tianjin', name: '天津' },
])

const cityData = {
  shanghai: [{ code: 'shanghai', name: '上海市' }],
  beijing: [{ code: 'beijing', name: '北京市' }],
  guangdong: [
    { code: 'guangzhou', name: '广州市' },
    { code: 'shenzhen', name: '深圳市' },
    { code: 'zhuhai', name: '珠海市' },
    { code: 'dongguan', name: '东莞市' },
  ],
  zhejiang: [
    { code: 'hangzhou', name: '杭州市' },
    { code: 'ningbo', name: '宁波市' },
    { code: 'wenzhou', name: '温州市' },
    { code: 'zhoushan', name: '舟山市' },
  ],
  jiangsu: [
    { code: 'nanjing', name: '南京市' },
    { code: 'suzhou', name: '苏州市' },
    { code: 'nantong', name: '南通市' },
    { code: 'yangzhou', name: '扬州市' },
  ],
  fujian: [
    { code: 'fuzhou', name: '福州市' },
    { code: 'xiamen', name: '厦门市' },
    { code: 'quanzhou', name: '泉州市' },
  ],
  shandong: [
    { code: 'jinan', name: '济南市' },
    { code: 'qingdao', name: '青岛市' },
    { code: 'yantai', name: '烟台市' },
    { code: 'weihai', name: '威海市' },
  ],
  liaoning: [
    { code: 'shenyang', name: '沈阳市' },
    { code: 'dalian', name: '大连市' },
    { code: 'yingkou', name: '营口市' },
  ],
  tianjin: [{ code: 'tianjin', name: '天津市' }],
}

const cities = ref([])

const onProvinceChange = () => {
  formData.value.city = ''
  cities.value = cityData[formData.value.province] || []
}

// 选择参考船舶
const selectVessel = (vesselId) => {
  // 如果点击的是已选中的船舶，则取消选择
  if (formData.value.selectedReferenceVessel === vesselId) {
    formData.value.selectedReferenceVessel = null
    console.log('[v0] 取消选择参考船舶')
  } else {
    formData.value.selectedReferenceVessel = vesselId
    console.log('[v0] 选择参考船舶:', vesselId)
  }
}

const vesselInfo = ref({
  name: '',
  shipType: '',
  tonnage: 0,
  imo: '',
  age: 0,
  location: ''
})

const loadVesselInfo = () => {
  if (formData.value.vesselId === '1') {
    vesselInfo.value = {
      name: 'OCEAN STAR',
      shipType: '散货船',
      tonnage: 5000,
      imo: 'IMO1234567',
      age: 8,
      location: '上海港'
    }
    // 自动填充船舶类型和吨位到表单
    formData.value.shipType = '散货船'
    formData.value.repairTonnage = 5000
  } else if (formData.value.vesselId === '2') {
    vesselInfo.value = {
      name: 'SEA DRAGON',
      shipType: '油船',
      tonnage: 8000,
      imo: 'IMO7654321',
      age: 12,
      location: '宁波港'
    }
    // 自动填充船舶类型和吨位到表单
    formData.value.shipType = '油船'
    formData.value.repairTonnage = 8000
  }
}

const handleFileUpload = (event) => {
  console.log('上传文件:', event.target.files)
}

const handlePreview = () => {
  console.log('预览需求:', formData.value)
  alert('预览功能开发中')
}

const handleSubmit = () => {
  // 使用自动生成的标题
  const submissionData = {
    ...formData.value,
    title: generateTitle.value
  }
  console.log('提交需求:', submissionData)
  console.log('[v0] 自动生成的标题:', generateTitle.value)
  
  if (formData.value.selectedReferenceVessel) {
    const selectedVessel = similarVessels.value.find(v => v.id === formData.value.selectedReferenceVessel)
    console.log('[v0] 选中的参考船型:', selectedVessel?.name)
    alert(`提交成功，等待审核\n标题: ${generateTitle.value}\n参考船型: ${selectedVessel?.name}`)
  } else {
    alert(`提交成功，等待审核\n标题: ${generateTitle.value}`)
  }
  
  router.push('/ship-repair')
}
</script>

<style scoped>
.publish-demand-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding: 40px 0;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #1E293B;
  margin-bottom: 12px;
}

.page-desc {
  font-size: 16px;
  color: #64748B;
}

.form-container {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 2px solid #F1F5F9;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 20px;
}

.title-preview {
  padding: 16px 20px;
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  border: 1px solid #93C5FD;
  border-radius: 10px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-label {
  font-size: 16px;
  font-weight: 600;
  color: #1E40AF;
}

.preview-value {
  font-size: 16px;
  font-weight: 700;
  color: #1E3A8A;
  letter-spacing: 0.5px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-row-three {
  grid-template-columns: repeat(3, 1fr);
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.location-select {
  display: flex;
  gap: 12px;
}

.location-select .form-select {
  flex: 1;
}

.form-item.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.form-label.required::after {
  content: '*';
  color: #EF4444;
  margin-left: 4px;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 16px;
  border: 1.5px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  transition: all 0.3s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group .form-input {
  flex: 1;
}

.input-separator,
.input-suffix {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
  white-space: nowrap;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #94A3B8;
  margin-top: 4px;
}

/* 相似船舶推荐样式 */
.recommendations-section {
  /* background: #FAFBFC; */
  /* border: 1px solid #E5E7EB; */
}

.recommendation-tip {
  font-size: 13px;
  color: #1E40AF;
  margin-bottom: 16px;
  padding: 10px 14px;
  background: #EFF6FF;
  border-radius: 6px;
  border-left: 3px solid #3B82F6;
}

.vessels-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.vessel-card {
  background: white;
  border-radius: 8px;
  border: 2px solid #E5E7EB;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.vessel-card:hover {
  border-color: #3B82F6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.vessel-card.selected {
  border-color: #3B82F6;
  background: #F0F9FF;
  box-shadow: 0 0 0 1px #3B82F6;
}

.select-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.radio-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #CBD5E1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.vessel-card.selected .radio-circle {
  border-color: #3B82F6;
  background: #3B82F6;
}

.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  opacity: 0;
  transition: opacity 0.2s;
}

.vessel-card.selected .radio-dot {
  opacity: 1;
}

.vessel-content {
  display: flex;
  gap: 16px;
  padding: 16px;
}

.vessel-image-container {
  width: 180px;
  height: 120px;
  flex-shrink: 0;
  background: #F8FAFC;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.vessel-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.vessel-info {
  flex: 1;
  min-width: 0;
}

.vessel-name {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 8px;
}

.vessel-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.spec-badge {
  display: inline-block;
  padding: 3px 8px;
  background: #F1F5F9;
  color: #475569;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  white-space: nowrap;
}

.vessel-card.selected .spec-badge {
  background: #DBEAFE;
  color: #1E40AF;
}

.vessel-description {
  font-size: 12px;
  color: #64748B;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 无结果提示 */
.no-results {
  text-align: center;
  padding: 48px 20px;
}

.no-results-icon {
  width: 64px;
  height: 64px;
  color: #F59E0B;
  margin: 0 auto 16px;
}

.no-results-text {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 8px;
}

.no-results-hint {
  font-size: 14px;
  color: #64748B;
}

/* 空状态提示 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: #F8FAFC;
  border-radius: 8px;
  border: 2px dashed #CBD5E1;
}

.empty-text {
  font-size: 14px;
  color: #64748B;
  line-height: 1.6;
}

.vessel-info-box {
  padding: 20px;
  background: #F8FAFC;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  margin-bottom: 20px;
}

.info-title {
  font-size: 16px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
}

.info-value {
  font-size: 14px;
  color: #1E293B;
}

.upload-area {
  position: relative;
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  border: 2px dashed #CBD5E1;
  border-radius: 12px;
  background: #F8FAFC;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-label:hover {
  border-color: #3B82F6;
  background: #EFF6FF;
}

.upload-label svg {
  width: 48px;
  height: 48px;
  color: #64748B;
}

.upload-label span {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
}

.btn-preview,
.btn-submit {
  padding: 14px 40px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-preview {
  background: #F1F5F9;
  color: #475569;
}

.btn-preview:hover {
  background: #E2E8F0;
}

.btn-submit {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row-three {
    grid-template-columns: 1fr;
  }

  .vessel-content {
    flex-direction: column;
  }

  .vessel-image-container {
    width: 100%;
    height: 160px;
  }

  .no-results-icon {
    width: 48px;
    height: 48px;
  }
  
  .spec-badge {
    font-size: 10px;
    padding: 2px 6px;
  }
}
</style>

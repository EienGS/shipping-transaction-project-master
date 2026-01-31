<template>
  <div class="service-center">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">服务中心</h1>
      <p class="page-description">管理您关联的设计院、造船厂、修船厂等服务提供商</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-container">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalProviders }}</div>
          <div class="stat-label">总服务商</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.activeProviders }}</div>
          <div class="stat-label">活跃服务商</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalTransactions }}</div>
          <div class="stat-label">总交易次数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.avgRating }}</div>
          <div class="stat-label">平均评分</div>
        </div>
      </el-card>
    </div>

    <!-- 服务类型tabs -->
    <el-card class="service-list-card">
      <template #header>
        <div class="card-header">
          <span>我的服务提供商</span>
          <el-button type="primary" size="small">+ 添加服务商</el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 设计院 -->
        <el-tab-pane label="设计院" name="design">
          <div v-if="designProviders.length === 0" class="empty-state">
            <el-empty description="暂无关联的设计院" />
          </div>
          <div v-else class="providers-grid">
            <div v-for="provider in designProviders" :key="provider.id" class="provider-card">
              <div class="provider-header">
                <h3 class="provider-name">{{ provider.name }}</h3>
                <el-tag type="success" size="small">{{ provider.status === 'active' ? '活跃' : '停用' }}</el-tag>
              </div>
              <div class="provider-info">
                <div class="info-item">
                  <span class="label">企业代码:</span>
                  <span class="value">{{ provider.code }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系人:</span>
                  <span class="value">{{ provider.contactPerson }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系电话:</span>
                  <span class="value">{{ provider.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">关联时间:</span>
                  <span class="value">{{ formatDate(provider.bindTime) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">交易次数:</span>
                  <span class="value">{{ provider.transactionCount }}</span>
                </div>
                <div class="info-item">
                  <span class="label">平均评分:</span>
                  <span class="value">⭐ {{ provider.avgRating }}</span>
                </div>
              </div>
              <div class="provider-actions">
                <el-button link type="primary" size="small" @click="viewDetails(provider)">
                  查看详情
                </el-button>
                <el-button link type="warning" size="small" @click="editProvider(provider)">
                  编辑
                </el-button>
                <el-button link type="danger" size="small" @click="removeProvider(provider)">
                  移除
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 造船厂 -->
        <el-tab-pane label="造船厂" name="shipyard">
          <div v-if="shipyardProviders.length === 0" class="empty-state">
            <el-empty description="暂无关联的造船厂" />
          </div>
          <div v-else class="providers-grid">
            <div v-for="provider in shipyardProviders" :key="provider.id" class="provider-card">
              <div class="provider-header">
                <h3 class="provider-name">{{ provider.name }}</h3>
                <el-tag type="success" size="small">{{ provider.status === 'active' ? '活跃' : '停用' }}</el-tag>
              </div>
              <div class="provider-info">
                <div class="info-item">
                  <span class="label">企业代码:</span>
                  <span class="value">{{ provider.code }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系人:</span>
                  <span class="value">{{ provider.contactPerson }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系电话:</span>
                  <span class="value">{{ provider.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">关联时间:</span>
                  <span class="value">{{ formatDate(provider.bindTime) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">交易次数:</span>
                  <span class="value">{{ provider.transactionCount }}</span>
                </div>
                <div class="info-item">
                  <span class="label">平均评分:</span>
                  <span class="value">⭐ {{ provider.avgRating }}</span>
                </div>
              </div>
              <div class="provider-actions">
                <el-button link type="primary" size="small" @click="viewDetails(provider)">
                  查看详情
                </el-button>
                <el-button link type="warning" size="small" @click="editProvider(provider)">
                  编辑
                </el-button>
                <el-button link type="danger" size="small" @click="removeProvider(provider)">
                  移除
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 修船厂 -->
        <el-tab-pane label="修船厂" name="repair">
          <div v-if="repairProviders.length === 0" class="empty-state">
            <el-empty description="暂无关联的修船厂" />
          </div>
          <div v-else class="providers-grid">
            <div v-for="provider in repairProviders" :key="provider.id" class="provider-card">
              <div class="provider-header">
                <h3 class="provider-name">{{ provider.name }}</h3>
                <el-tag type="success" size="small">{{ provider.status === 'active' ? '活跃' : '停用' }}</el-tag>
              </div>
              <div class="provider-info">
                <div class="info-item">
                  <span class="label">企业代码:</span>
                  <span class="value">{{ provider.code }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系人:</span>
                  <span class="value">{{ provider.contactPerson }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系电话:</span>
                  <span class="value">{{ provider.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">关联时间:</span>
                  <span class="value">{{ formatDate(provider.bindTime) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">交易次数:</span>
                  <span class="value">{{ provider.transactionCount }}</span>
                </div>
                <div class="info-item">
                  <span class="label">平均评分:</span>
                  <span class="value">⭐ {{ provider.avgRating }}</span>
                </div>
              </div>
              <div class="provider-actions">
                <el-button link type="primary" size="small" @click="viewDetails(provider)">
                  查看详情
                </el-button>
                <el-button link type="warning" size="small" @click="editProvider(provider)">
                  编辑
                </el-button>
                <el-button link type="danger" size="small" @click="removeProvider(provider)">
                  移除
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('design')

// 统计数据
const stats = ref({
  totalProviders: 12,
  activeProviders: 10,
  totalTransactions: 45,
  avgRating: 4.6
})

// Mock数据
const designProviders = ref([
  {
    id: 1,
    name: 'XX船舶设计研究院',
    code: 'DSN-001',
    contactPerson: '李工',
    phone: '0755-12345678',
    bindTime: '2025-08-15',
    status: 'active',
    transactionCount: 8,
    avgRating: 4.7
  },
  {
    id: 2,
    name: '浙江海洋设计中心',
    code: 'DSN-002',
    contactPerson: '王女士',
    phone: '0571-87654321',
    bindTime: '2025-09-20',
    status: 'active',
    transactionCount: 5,
    avgRating: 4.5
  }
])

const shipyardProviders = ref([
  {
    id: 3,
    name: '中国船舶集团造船厂',
    code: 'SBY-001',
    contactPerson: '张总',
    phone: '0411-22334455',
    bindTime: '2025-07-10',
    status: 'active',
    transactionCount: 12,
    avgRating: 4.8
  },
  {
    id: 4,
    name: '舟山国际造船有限公司',
    code: 'SBY-002',
    contactPerson: '陈先生',
    phone: '0580-11223344',
    bindTime: '2025-10-05',
    status: 'active',
    transactionCount: 3,
    avgRating: 4.6
  }
])

const repairProviders = ref([
  {
    id: 5,
    name: '青岛海西湾修船厂',
    code: 'REP-001',
    contactPerson: '胡经理',
    phone: '0532-55667788',
    bindTime: '2025-06-20',
    status: 'active',
    transactionCount: 15,
    avgRating: 4.7
  },
  {
    id: 6,
    name: '广州文冲船厂',
    code: 'REP-002',
    contactPerson: '刘主任',
    phone: '020-99887766',
    bindTime: '2025-11-01',
    status: 'active',
    transactionCount: 7,
    avgRating: 4.5
  }
])

// 方法
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const viewDetails = (provider) => {
  console.log('[v0] 查看服务商详情:', provider.id)
  ElMessage.info(`查看 ${provider.name} 的详情`)
}

const editProvider = (provider) => {
  console.log('[v0] 编辑服务商:', provider.id)
  ElMessage.info(`编辑 ${provider.name} 的信息`)
}

const removeProvider = (provider) => {
  ElMessageBox.confirm(
    `确定要移除 ${provider.name} 吗？`,
    '移除服务商',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    if (activeTab.value === 'design') {
      designProviders.value = designProviders.value.filter(p => p.id !== provider.id)
    } else if (activeTab.value === 'shipyard') {
      shipyardProviders.value = shipyardProviders.value.filter(p => p.id !== provider.id)
    } else if (activeTab.value === 'repair') {
      repairProviders.value = repairProviders.value.filter(p => p.id !== provider.id)
    }
    ElMessage.success('已移除服务商')
  }).catch(() => {
    ElMessage.info('已取消')
  })
}
</script>

<style scoped>
.service-center {
  padding: 20px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 统计卡片 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stat-content {
  text-align: center;
  padding: 16px 0;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* 服务商列表 */
.service-list-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.service-list-card :deep(.el-card__header) {
  border-bottom: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.provider-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
}

.provider-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.provider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.provider-name {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  flex: 1;
}

.provider-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.info-item .label {
  color: #64748b;
  font-weight: 500;
}

.info-item .value {
  color: #0f172a;
  font-weight: 600;
}

.provider-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>

<template>
  <div class="data-comparison-section">
    <el-alert
      title="系统已自动从海事部门获取官方数据，请核对一致性"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    />

    <div class="comparison-tables">
      <div class="comparison-group">
        <h3 class="group-title">船舶基础数据</h3>
        <el-table :data="basicDataComparison" stripe>
          <el-table-column prop="field" label="数据项" width="150" />
          <el-table-column prop="submitted" label="用户提交" width="250" />
          <el-table-column prop="official" label="官方数据" width="250" />
          <el-table-column prop="status" label="对比结果" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 'match' ? 'success' : 'danger'">
                {{ row.status === 'match' ? '一致' : '不一致' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="comparison-group" style="margin-top: 20px">
        <h3 class="group-title">所有权信息</h3>
        <el-table :data="ownershipComparison" stripe>
          <el-table-column prop="field" label="数据项" width="150" />
          <el-table-column prop="submitted" label="用户提交" width="250" />
          <el-table-column prop="official" label="官方数据" width="250" />
          <el-table-column prop="status" label="对比结果" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 'match' ? 'success' : 'danger'">
                {{ row.status === 'match' ? '一致' : '不一致' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="comparison-group" style="margin-top: 20px">
        <h3 class="group-title">证书信息（官方数据）</h3>
        <el-table :data="certificateComparison" stripe>
          <el-table-column prop="field" label="证书名称" width="200" />
          <el-table-column prop="certificateNo" label="证书编号" width="200" />
          <el-table-column prop="issueDate" label="签发日期" width="150" />
          <el-table-column prop="expiryDate" label="到期日期" width="150" />
          <el-table-column label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.isValid ? 'success' : 'danger'">
                {{ row.isValid ? '有效' : '已过期' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  ticket: Object
})

const emit = defineEmits(['mark-anomaly'])

// Mock 数据对比
const basicDataComparison = [
  { field: 'IMO编号', submitted: '1234567', official: '1234567', status: 'match' },
  { field: 'GT总吨', submitted: '52000', official: '52000', status: 'match' },
  { field: 'NT净吨', submitted: '28000', official: '28000', status: 'match' },
  { field: '建造年份', submitted: '2010', official: '2010', status: 'match' }
]

const ownershipComparison = [
  { field: '所有权人', submitted: '某航运有限公司', official: '某航运有限公司', status: 'match' },
  { field: '国籍', submitted: '巴拿马', official: '巴拿马', status: 'match' },
  { field: '登记港', submitted: '巴拿马城', official: '巴拿马城', status: 'match' }
]

const certificateComparison = [
  { 
    field: '船舶所有权证书', 
    certificateNo: 'OWN-2020-123456', 
    issueDate: '2020-05-10', 
    expiryDate: '永久有效',
    isValid: true 
  },
  { 
    field: '船舶国籍证书', 
    certificateNo: 'NAT-2020-789012', 
    issueDate: '2020-05-12', 
    expiryDate: '永久有效',
    isValid: true 
  },
  { 
    field: '船舶检验证书', 
    certificateNo: 'INS-2025-345678', 
    issueDate: '2025-01-15', 
    expiryDate: '2030-01-15',
    isValid: true 
  },
  { 
    field: '吨位证书', 
    certificateNo: 'TON-2020-901234', 
    issueDate: '2020-05-15', 
    expiryDate: '永久有效',
    isValid: true 
  }
]

const markAnomaly = (field, anomaly) => {
  emit('mark-anomaly', field, anomaly)
}

const viewCertificate = (row) => {
  console.log('[v0] 查看证书:', row.field)
  // 这里可以打开证书预览对话框
}
</script>

<style scoped>
.data-comparison-section {
  padding: 20px 0;
}

.comparison-group {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.group-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  padding: 16px;
  margin: 0;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
</style>

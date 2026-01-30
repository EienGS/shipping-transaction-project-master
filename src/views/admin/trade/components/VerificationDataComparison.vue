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
          <el-table-column prop="submitted" label="用户提交" width="200" />
          <el-table-column prop="official" label="官方数据" width="200" />
          <el-table-column prop="status" label="对比结果" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 'match' ? 'success' : 'danger'">
                {{ row.status === 'match' ? '一致' : '不一致' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button 
                v-if="row.status === 'mismatch'"
                link 
                type="danger" 
                size="small"
                @click="markAnomaly(row.field, { status: 'marked', reason: '用户提交与官方数据不一致' })"
              >
                标记异常
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="comparison-group" style="margin-top: 20px">
        <h3 class="group-title">所有权信息</h3>
        <el-table :data="ownershipComparison" stripe>
          <el-table-column prop="field" label="数据项" width="150" />
          <el-table-column prop="submitted" label="用户提交" width="200" />
          <el-table-column prop="official" label="官方数据" width="200" />
          <el-table-column prop="status" label="对比结果" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 'match' ? 'success' : 'danger'">
                {{ row.status === 'match' ? '一致' : '不一致' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button 
                v-if="row.status === 'mismatch'"
                link 
                type="danger" 
                size="small"
                @click="markAnomaly(row.field, { status: 'marked', reason: '用户提交与官方数据不一致' })"
              >
                标记异常
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="comparison-group" style="margin-top: 20px">
        <h3 class="group-title">证书信息</h3>
        <el-table :data="certificateComparison" stripe>
          <el-table-column prop="field" label="数据项" width="150" />
          <el-table-column prop="submitted" label="用户提交" width="200" />
          <el-table-column prop="official" label="官方数据" width="200" />
          <el-table-column prop="status" label="对比结果" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 'match' ? 'success' : 'danger'">
                {{ row.status === 'match' ? '一致' : '不一致' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button 
                v-if="row.status === 'mismatch'"
                link 
                type="danger" 
                size="small"
                @click="markAnomaly(row.field, { status: 'marked', reason: '用户提交与官方数据不一致' })"
              >
                标记异常
              </el-button>
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
  { field: '船检证书', submitted: '有效', official: '有效', status: 'match' },
  { field: '国籍证书', submitted: '有效', official: '有效', status: 'match' },
  { field: '吨位证书', submitted: '有效', official: '有效', status: 'match' }
]

const markAnomaly = (field, anomaly) => {
  emit('mark-anomaly', field, anomaly)
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

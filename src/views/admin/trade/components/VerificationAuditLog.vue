<template>
  <div class="audit-log-section">
    <el-timeline>
      <el-timeline-item
        v-for="log in auditLogs"
        :key="log.id"
        :timestamp="log.timestamp"
        placement="top"
        :type="log.type"
      >
        <p class="log-operator">{{ log.operator }}</p>
        <p class="log-action">{{ log.action }}</p>
        <p v-if="log.details" class="log-details">{{ log.details }}</p>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  ticket: Object
})

const auditLogs = ref([
  {
    id: 1,
    timestamp: '2026-01-15 14:30',
    type: 'primary',
    operator: '李先生',
    action: '提交了鉴证申请'
  },
  {
    id: 2,
    timestamp: '2026-01-15 15:00',
    type: 'success',
    operator: '系统',
    action: '自动从海事部门获取官方数据',
    details: '成功获取IMO编号、所有权、国籍等信息'
  },
  {
    id: 3,
    timestamp: '2026-01-15 15:30',
    type: 'primary',
    operator: '当前审核员',
    action: '正在审核',
    details: '审核工单编号：VER-2026010001'
  }
])
</script>

<style scoped>
.audit-log-section {
  padding: 20px 0;
}

.log-operator {
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.log-action {
  color: #64748b;
  margin: 0 0 8px 0;
}

.log-details {
  color: #94a3b8;
  font-size: 12px;
  margin: 0;
}
</style>

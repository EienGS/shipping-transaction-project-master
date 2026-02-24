<template>
  <div class="review-manage">
    <div class="page-header">
      <h1 class="page-title">口碑评价审核</h1>
      <p class="page-desc">审核需求方评价合规性，核对服务进度真实性，维护平台口碑生态</p>
    </div>

    <!-- 统计概览 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon icon-pending">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">待审核</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-approved">
          <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value success">{{ stats.approved }}</div>
          <div class="stat-label">已通过</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-rejected">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value danger">{{ stats.rejected }}</div>
          <div class="stat-label">已驳回</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-today">
          <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.today }}</div>
          <div class="stat-label">今日新增</div>
        </div>
      </div>
    </div>

    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-row :gutter="16" align="middle">
        <el-col :span="6">
          <el-input v-model="searchKeyword" placeholder="搜索工单编号/需求方/服务方" clearable>
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterStatus" placeholder="审核状态" clearable style="width:100%">
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterType" placeholder="服务类型" clearable style="width:100%">
            <el-option label="设计" value="design" />
            <el-option label="建造" value="building" />
            <el-option label="维修" value="repair" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterRating" placeholder="评分筛选" clearable style="width:100%">
            <el-option label="5星好评" :value="5" />
            <el-option label="4星" :value="4" />
            <el-option label="3星及以下" :value="3" />
          </el-select>
        </el-col>
        <el-col :span="6" style="display:flex;gap:8px;justify-content:flex-end">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 评价列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">评价审核工单</span>
          <el-tag type="warning" size="small">{{ stats.pending }} 条待审核</el-tag>
        </div>
      </template>
      <el-table :data="filteredReviews" stripe border style="width:100%">
        <el-table-column prop="workOrderNo" label="工单编号" width="165" fixed />
        <el-table-column prop="serviceNo" label="服务编号" width="155" />
        <el-table-column label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="getTypeTagColor(row.serviceType)" size="small">{{ getTypeLabel(row.serviceType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="serviceTitle" label="服务标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="demander" label="需求方" width="140" show-overflow-tooltip />
        <el-table-column prop="provider" label="服务方" width="160" show-overflow-tooltip />
        <el-table-column label="评分" width="140">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column label="评价摘要" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="comment-preview">{{ row.comment }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="155" />
        <el-table-column label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getReviewStatusType(row.status)" size="small">{{ getReviewStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewReview(row)">查看详情</el-button>
            <template v-if="row.status === 'pending'">
              <el-button type="success" link size="small" @click="quickApprove(row)">通过</el-button>
              <el-button type="danger" link size="small" @click="openReject(row)">驳回</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 评价详情 + 审核对话框 -->
    <el-dialog v-model="detailVisible" title="评价审核详情" width="820px" :close-on-click-modal="false" destroy-on-close>
      <div v-if="selectedReview" class="detail-wrap">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单编号">{{ selectedReview.workOrderNo }}</el-descriptions-item>
          <el-descriptions-item label="服务编号">{{ selectedReview.serviceNo }}</el-descriptions-item>
          <el-descriptions-item label="服务类型">
            <el-tag :type="getTypeTagColor(selectedReview.serviceType)" size="small">{{ getTypeLabel(selectedReview.serviceType) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="服务标题">{{ selectedReview.serviceTitle }}</el-descriptions-item>
          <el-descriptions-item label="需求方">{{ selectedReview.demander }}</el-descriptions-item>
          <el-descriptions-item label="服务方">{{ selectedReview.provider }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ selectedReview.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag :type="getReviewStatusType(selectedReview.status)">{{ getReviewStatusLabel(selectedReview.status) }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 评价内容 -->
        <div class="section-block">
          <h4 class="section-label">评价内容</h4>
          <div class="rating-row">
            <span class="rating-label">需求方评分：</span>
            <el-rate v-model="selectedReview.rating" disabled />
            <span class="rating-num">{{ selectedReview.rating }} 分</span>
          </div>
          <div class="comment-box">
            <p class="comment-text">{{ selectedReview.comment }}</p>
          </div>
        </div>

        <!-- 合规检测 -->
        <div class="section-block">
          <h4 class="section-label">合规检测结果</h4>
          <div class="compliance-list">
            <div v-for="(item, i) in complianceChecks" :key="i" :class="['compliance-item', item.pass ? 'pass' : 'fail']">
              <svg v-if="item.pass" class="check-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
              <svg v-else class="check-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/></svg>
              <span class="check-label">{{ item.label }}</span>
              <span class="check-result">{{ item.pass ? '通过' : '疑似违规' }}</span>
            </div>
          </div>
        </div>

        <!-- 服务进度核对 -->
        <div class="section-block">
          <h4 class="section-label">
            服务进度核对
            <el-tag v-if="selectedReview.progressVerified" type="success" size="small" style="margin-left:8px">已核实真实完成</el-tag>
            <el-tag v-else type="warning" size="small" style="margin-left:8px">待核实</el-tag>
          </h4>
          <el-timeline>
            <el-timeline-item
              v-for="(log, i) in selectedReview.progressLogs"
              :key="i"
              :timestamp="log.time"
              :type="log.type"
              placement="top"
            >
              <div class="timeline-content">
                <span class="timeline-title">{{ log.title }}</span>
                <span class="timeline-desc">{{ log.desc }}</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 历史审核记录 -->
        <div v-if="selectedReview.auditLogs?.length" class="section-block">
          <h4 class="section-label">历史审核记录</h4>
          <div v-for="(log, i) in selectedReview.auditLogs" :key="i" class="audit-log-item">
            <span class="audit-time">{{ log.time }}</span>
            <span class="audit-op">{{ log.operator }}</span>
            <el-tag :type="log.action === 'approved' ? 'success' : 'danger'" size="small">
              {{ log.action === 'approved' ? '通过' : '驳回' }}
            </el-tag>
            <span class="audit-reason">{{ log.reason }}</span>
          </div>
        </div>

        <!-- 审核操作（仅待审核状态） -->
        <div v-if="selectedReview.status === 'pending'" class="section-block audit-form-block">
          <h4 class="section-label">审核操作</h4>
          <el-form :model="auditForm" label-width="110px">
            <el-form-item label="确认进度真实">
              <el-switch v-model="auditForm.progressVerified" active-text="确认服务已真实完成" inactive-text="未核实" />
            </el-form-item>
            <el-form-item label="审核结论" required>
              <el-radio-group v-model="auditForm.decision">
                <el-radio label="approved">审核通过，发布评价</el-radio>
                <el-radio label="rejected">审核不通过，删除评价</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="auditForm.decision === 'rejected'" label="驳回原因" required>
              <el-select v-model="auditForm.rejectReason" style="width:100%" placeholder="请选择驳回原因">
                <el-option label="包含恶意诋毁内容" value="包含恶意诋毁内容" />
                <el-option label="存在虚假评价嫌疑" value="存在虚假评价嫌疑" />
                <el-option label="包含违规言论" value="包含违规言论" />
                <el-option label="评价内容与服务不符" value="评价内容与服务不符" />
                <el-option label="其他原因" value="其他原因" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="auditForm.decision === 'rejected' && auditForm.rejectReason === '其他原因'" label="具体说明">
              <el-input v-model="auditForm.rejectNote" type="textarea" :rows="2" placeholder="请补充具体原因" />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <template v-if="selectedReview?.status === 'pending'">
          <el-button type="success" :disabled="auditForm.decision !== 'approved'" @click="submitAudit('approved')">
            通过并发布
          </el-button>
          <el-button type="danger" :disabled="auditForm.decision !== 'rejected'" @click="submitAudit('rejected')">
            驳回并删除
          </el-button>
        </template>
      </template>
    </el-dialog>

    <!-- 快速驳回对话框 -->
    <el-dialog v-model="rejectVisible" title="驳回评价" width="480px" :close-on-click-modal="false" destroy-on-close>
      <el-alert title="驳回后该评价将被删除，不会展示在服务方卡片上" type="warning" :closable="false" style="margin-bottom:20px" />
      <el-form :model="rejectForm" label-width="90px">
        <el-form-item label="驳回原因" required>
          <el-select v-model="rejectForm.reason" style="width:100%" placeholder="请选择驳回原因">
            <el-option label="包含恶意诋毁内容" value="包含恶意诋毁内容" />
            <el-option label="存在虚假评价嫌疑" value="存在虚假评价嫌疑" />
            <el-option label="包含违规言论" value="包含违规言论" />
            <el-option label="评价内容与服务不符" value="评价内容与服务不符" />
            <el-option label="其他原因" value="其他原因" />
          </el-select>
        </el-form-item>
        <el-form-item label="补充说明">
          <el-input v-model="rejectForm.note" type="textarea" :rows="3" placeholder="可补充说明驳回原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="danger" @click="submitReject">确认驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const filterRating = ref(null)

const detailVisible = ref(false)
const rejectVisible = ref(false)
const selectedReview = ref(null)

const auditForm = ref({ progressVerified: false, decision: '', rejectReason: '', rejectNote: '' })
const rejectForm = ref({ reason: '', note: '' })

const complianceChecks = ref([])

const reviews = ref([
  {
    id: 1,
    workOrderNo: 'RVW-2026020001',
    serviceNo: 'SVC-2026010004',
    serviceType: 'repair',
    serviceTitle: '主机大修与设备更换',
    demander: '远洋运输公司',
    provider: '上海XX船舶修理厂',
    rating: 5,
    comment: '服务专业，维修质量高，设备运行稳定，工期严格按合同执行，非常满意！',
    submitTime: '2026-02-05 16:00',
    status: 'approved',
    progressVerified: true,
    progressLogs: [
      { time: '2026-01-15 09:45', title: '服务创建', desc: '维修服务创建', type: 'primary' },
      { time: '2026-01-16 08:00', title: '开始维修', desc: '修理厂正式开始维修作业', type: 'success' },
      { time: '2026-02-03 17:00', title: '完成报告提交', desc: '提交维修完成报告', type: 'primary' },
      { time: '2026-02-05 15:00', title: '服务确认完成', desc: '需求方确认服务完成', type: 'success' },
    ],
    auditLogs: [
      { time: '2026-02-05 18:00', operator: '运营专员', action: 'approved', reason: '内容合规，服务已核实完成' }
    ]
  },
  {
    id: 2,
    workOrderNo: 'RVW-2026020002',
    serviceNo: 'SVC-2026010005',
    serviceType: 'design',
    serviceTitle: '内河客船改造设计',
    demander: '长江航运公司',
    provider: '武汉船舶设计院',
    rating: 4,
    comment: '设计方案专业，出图速度较快，整体满意，但沟通效率有待提升。',
    submitTime: '2026-02-10 10:30',
    status: 'pending',
    progressVerified: false,
    progressLogs: [
      { time: '2026-01-05 08:30', title: '服务创建', desc: '设计需求创建', type: 'primary' },
      { time: '2026-01-08 09:00', title: '服务方接单', desc: '武汉船舶设计院确认承接', type: 'success' },
      { time: '2026-02-08 16:00', title: '方案交付', desc: '全套设计方案已交付需求方', type: 'success' },
      { time: '2026-02-10 10:00', title: '需求方确认完成', desc: '需求方确认服务完成并提交评价', type: 'success' },
    ],
    auditLogs: []
  },
  {
    id: 3,
    workOrderNo: 'RVW-2026020003',
    serviceNo: 'SVC-2026010006',
    serviceType: 'building',
    serviceTitle: '5000吨多用途船建造',
    demander: '华南航运',
    provider: '广州某造船厂',
    rating: 1,
    comment: '质量极差，工期严重拖延，服务方完全不负责任，强烈谴责！骗子公司！',
    submitTime: '2026-02-12 14:20',
    status: 'pending',
    progressVerified: false,
    progressLogs: [
      { time: '2025-12-01 10:00', title: '服务创建', desc: '建造需求创建', type: 'primary' },
      { time: '2025-12-05 09:00', title: '开工建造', desc: '船厂正式开始建造', type: 'success' },
      { time: '2026-02-10 15:00', title: '完成报告提交', desc: '服务方提交完成报告', type: 'primary' },
      { time: '2026-02-12 14:00', title: '需求方确认完成', desc: '需求方确认服务完成并提交评价', type: 'success' },
    ],
    auditLogs: []
  },
  {
    id: 4,
    workOrderNo: 'RVW-2026020004',
    serviceNo: 'SVC-2026010007',
    serviceType: 'repair',
    serviceTitle: '船舶电气系统检修',
    demander: '渤海货运',
    provider: '天津修船公司',
    rating: 3,
    comment: '维修完成，基本达到要求，但部分细节处理不够仔细。',
    submitTime: '2026-02-13 09:15',
    status: 'rejected',
    progressVerified: false,
    progressLogs: [
      { time: '2026-01-20 10:00', title: '服务创建', desc: '检修需求创建', type: 'primary' },
      { time: '2026-02-12 16:00', title: '完成报告提交', desc: '服务方提交完成报告', type: 'primary' },
    ],
    auditLogs: [
      { time: '2026-02-13 11:00', operator: '运营专员', action: 'rejected', reason: '进度记录不完整，服务真实性存疑' }
    ]
  },
])

const stats = computed(() => ({
  pending: reviews.value.filter(r => r.status === 'pending').length,
  approved: reviews.value.filter(r => r.status === 'approved').length,
  rejected: reviews.value.filter(r => r.status === 'rejected').length,
  today: 2,
}))

const filteredReviews = computed(() => {
  let list = reviews.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(r =>
      r.workOrderNo.toLowerCase().includes(kw) ||
      r.serviceNo.toLowerCase().includes(kw) ||
      r.demander.includes(kw) ||
      r.provider.includes(kw)
    )
  }
  if (filterStatus.value) list = list.filter(r => r.status === filterStatus.value)
  if (filterType.value) list = list.filter(r => r.serviceType === filterType.value)
  if (filterRating.value) {
    list = filterRating.value === 3
      ? list.filter(r => r.rating <= 3)
      : list.filter(r => r.rating === filterRating.value)
  }
  return list
})

const getTypeLabel = (type) => ({ design: '设计', building: '建造', repair: '维修' }[type] || type)
const getTypeTagColor = (type) => ({ design: 'primary', building: 'success', repair: 'warning' }[type] || 'info')
const getReviewStatusLabel = (s) => ({ pending: '待审核', approved: '已通过', rejected: '已驳回' }[s] || s)
const getReviewStatusType = (s) => ({ pending: 'warning', approved: 'success', rejected: 'danger' }[s] || 'info')

const handleSearch = () => {}
const resetSearch = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterType.value = ''
  filterRating.value = null
}

const viewReview = (row) => {
  selectedReview.value = row
  auditForm.value = { progressVerified: row.progressVerified, decision: '', rejectReason: '', rejectNote: '' }
  const hasViolation = row.comment.includes('骗子') || row.comment.includes('强烈谴责')
  complianceChecks.value = [
    { label: '无恶意诋毁词汇', pass: !hasViolation },
    { label: '无虚假宣传词汇', pass: true },
    { label: '无违规言论', pass: !hasViolation },
    { label: '评价长度合规（≥10字）', pass: row.comment.length >= 10 },
  ]
  detailVisible.value = true
}

const quickApprove = (row) => {
  ElMessageBox.confirm(
    `确认通过 "${row.workOrderNo}" 的评价审核？通过后评价将展示在服务方卡片上。`,
    '确认审核通过',
    { type: 'success', confirmButtonText: '确认通过', cancelButtonText: '取消' }
  ).then(() => {
    row.status = 'approved'
    row.progressVerified = true
    row.auditLogs.push({
      time: new Date().toLocaleString('zh-CN'),
      operator: '运营专员',
      action: 'approved',
      reason: '内容合规，服务已核实完成'
    })
    ElMessage.success('评价已通过审核，将展示在服务方卡片上')
  }).catch(() => {})
}

const openReject = (row) => {
  selectedReview.value = row
  rejectForm.value = { reason: '', note: '' }
  rejectVisible.value = true
}

const submitReject = () => {
  if (!rejectForm.value.reason) { ElMessage.warning('请选择驳回原因'); return }
  const row = selectedReview.value
  row.status = 'rejected'
  row.auditLogs.push({
    time: new Date().toLocaleString('zh-CN'),
    operator: '运营专员',
    action: 'rejected',
    reason: rejectForm.value.reason + (rejectForm.value.note ? `（${rejectForm.value.note}）` : '')
  })
  rejectVisible.value = false
  ElMessage.success(`评价已驳回，原因：${rejectForm.value.reason}`)
}

const submitAudit = (decision) => {
  if (decision === 'rejected' && !auditForm.value.rejectReason) {
    ElMessage.warning('请选择驳回原因')
    return
  }
  const row = selectedReview.value
  row.status = decision
  row.progressVerified = auditForm.value.progressVerified
  row.auditLogs.push({
    time: new Date().toLocaleString('zh-CN'),
    operator: '运营专员',
    action: decision,
    reason: decision === 'approved'
      ? '内容合规，服务已核实完成'
      : (auditForm.value.rejectReason === '其他原因' ? auditForm.value.rejectNote || '其他原因' : auditForm.value.rejectReason)
  })
  detailVisible.value = false
  ElMessage.success(decision === 'approved' ? '评价已通过审核，将展示在服务方卡片上' : '评价已驳回并删除')
}
</script>

<style scoped>
.review-manage {
  padding: 24px;
  background: #F5F7FA;
  min-height: 100vh;
}

.page-header { margin-bottom: 24px; }

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #1A2B4A;
  margin: 0 0 4px;
}

.page-desc {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg { width: 24px; height: 24px; }
.icon-pending { background: #FFF7ED; color: #F97316; }
.icon-approved { background: #F0FDF4; color: #22C55E; }
.icon-rejected { background: #FEF2F2; color: #EF4444; }
.icon-today { background: #EFF6FF; color: #3B82F6; }

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1A2B4A;
  line-height: 1;
}
.stat-value.success { color: #16A34A; }
.stat-value.danger { color: #DC2626; }
.stat-label { font-size: 13px; color: #64748B; margin-top: 4px; }

.filter-card { margin-bottom: 16px; }
.list-card { margin-bottom: 24px; }

.card-header { display: flex; align-items: center; gap: 12px; }
.card-title { font-size: 15px; font-weight: 600; color: #1E293B; }
.comment-preview { font-size: 13px; color: #475569; }

/* 详情弹窗 */
.detail-wrap { display: flex; flex-direction: column; gap: 20px; }

.section-block {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 16px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.rating-label { font-size: 14px; color: #64748B; white-space: nowrap; }
.rating-num { font-size: 14px; font-weight: 600; color: #F59E0B; }

.comment-box {
  background: #F8FAFC;
  border-radius: 6px;
  padding: 12px 16px;
}

.comment-text { font-size: 14px; color: #374151; line-height: 1.7; margin: 0; }

/* 合规检测 */
.compliance-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.compliance-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
}

.compliance-item.pass { background: #F0FDF4; border: 1px solid #BBF7D0; }
.compliance-item.fail { background: #FEF2F2; border: 1px solid #FECACA; }
.check-icon { width: 16px; height: 16px; flex-shrink: 0; }
.compliance-item.pass .check-icon { color: #16A34A; }
.compliance-item.fail .check-icon { color: #DC2626; }
.check-label { flex: 1; color: #374151; }
.check-result { font-weight: 600; font-size: 12px; }
.compliance-item.pass .check-result { color: #16A34A; }
.compliance-item.fail .check-result { color: #DC2626; }

/* 时间线 */
.timeline-content { display: flex; flex-direction: column; gap: 4px; }
.timeline-title { font-size: 13px; font-weight: 600; color: #1E293B; }
.timeline-desc { font-size: 12px; color: #64748B; }

/* 审核记录 */
.audit-log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #F1F5F9;
  font-size: 13px;
}
.audit-log-item:last-child { border-bottom: none; }
.audit-time { color: #94A3B8; }
.audit-op { font-weight: 600; color: #1E293B; }
.audit-reason { color: #64748B; flex: 1; }

.audit-form-block { background: #FAFBFF; border-color: #BFDBFE; }
</style>

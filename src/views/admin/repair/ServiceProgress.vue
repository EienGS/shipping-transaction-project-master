<template>
  <div class="service-progress">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">服务进度管控</h1>
      <p class="page-description">监控修造服务全流程进度，核查进度更新真实性，处理服务异常反馈</p>
    </div>

    <!-- 统计概览 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon icon-progress">
          <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="currentColor"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.inProgress }}</div>
          <div class="stat-label">服务中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-abnormal">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value danger">{{ stats.abnormal }}</div>
          <div class="stat-label">待介入</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-handling">
          <svg viewBox="0 0 24 24"><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" fill="currentColor"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value warning">{{ stats.handling }}</div>
          <div class="stat-label">处理中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-completed">
          <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-value success">{{ stats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <el-row :gutter="16" align="middle">
        <el-col :span="6">
          <el-input v-model="searchKeyword" placeholder="搜索服务标题/编号" clearable>
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterStatus" placeholder="服务状态" clearable style="width:100%">
            <el-option label="服务中" value="inProgress" />
            <el-option label="待运营介入" value="needIntervention" />
            <el-option label="处理中" value="handling" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterType" placeholder="服务类型" clearable style="width:100%">
            <el-option label="设计" value="design" />
            <el-option label="建造" value="building" />
            <el-option label="维修" value="repair" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:100%"
          />
        </el-col>
        <el-col :span="4" style="display:flex;gap:8px;justify-content:flex-end">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 服务列表 -->
    <el-card class="list-card">
      <el-table :data="filteredServices" stripe row-key="id">
        <el-table-column prop="serviceNo" label="服务编号" width="160" />
        <el-table-column label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="getTypeTagColor(row.type)" size="small">{{ getTypeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="服务标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="demander" label="需求方" width="150" show-overflow-tooltip />
        <el-table-column prop="provider" label="服务方" width="150" show-overflow-tooltip />
        <el-table-column label="当前进度" width="130">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :status="row.status === 'completed' ? 'success' : row.status === 'needIntervention' ? 'exception' : ''" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdate" label="最近更新" width="155" />
        <el-table-column label="进度核查" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.verified" type="success" size="small">已核查</el-tag>
            <el-tag v-else-if="row.status === 'inProgress'" type="warning" size="small">待核查</el-tag>
            <el-tag v-else type="info" size="small">-</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'inProgress' && !row.verified" type="success" link @click="openVerify(row)">核查进度</el-button>
            <el-button v-if="row.status === 'needIntervention'" type="warning" link @click="handleAbnormal(row)">处理异常</el-button>
            <el-button v-if="row.status === 'handling'" type="success" link @click="resolveAbnormal(row)">结案</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 服务详情对话框 -->
    <el-dialog v-model="detailVisible" title="服务进度详情" width="780px" :close-on-click-modal="false">
      <div v-if="selectedService" class="detail-dialog">
        <el-descriptions :column="2" border class="mb-6">
          <el-descriptions-item label="服务编号">{{ selectedService.serviceNo }}</el-descriptions-item>
          <el-descriptions-item label="服务类型">
            <el-tag :type="getTypeTagColor(selectedService.type)" size="small">{{ getTypeLabel(selectedService.type) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="服务标题" :span="2">{{ selectedService.title }}</el-descriptions-item>
          <el-descriptions-item label="需求方">{{ selectedService.demander }}</el-descriptions-item>
          <el-descriptions-item label="服务方">{{ selectedService.provider }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedService.createTime }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(selectedService.status)" size="small">{{ getStatusLabel(selectedService.status) }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 进度时间线 -->
        <div class="section-title">进度记录</div>
        <el-timeline>
          <el-timeline-item
            v-for="(item, idx) in selectedService.progressLogs"
            :key="idx"
            :timestamp="item.time"
            :type="item.type || 'primary'"
            placement="top"
          >
            <div class="timeline-card">
              <div class="timeline-title">{{ item.title }}</div>
              <div class="timeline-desc">{{ item.desc }}</div>
              <div class="timeline-operator">操作人：{{ item.operator }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>

        <!-- 完成报告 -->
        <template v-if="selectedService.providerReport">
          <div class="section-title">服务完成报告</div>
          <div class="info-box">
            <p class="info-box-text">{{ selectedService.providerReport.description }}</p>
            <div v-if="selectedService.providerReport.attachments?.length" class="attach-row">
              <el-tag v-for="(f, i) in selectedService.providerReport.attachments" :key="i" type="info" class="attach-tag">{{ f.name }}</el-tag>
            </div>
          </div>
        </template>

        <!-- 异常信息 -->
        <template v-if="selectedService.abnormal">
          <div class="section-title">异常反馈</div>
          <el-alert :title="selectedService.abnormal.reason" type="warning" :closable="false" />
          <div v-if="selectedService.abnormal.resolution" class="resolution-box">
            <span class="resolution-label">运营处理意见：</span>
            <p class="resolution-text">{{ selectedService.abnormal.resolution }}</p>
          </div>
        </template>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          v-if="selectedService?.status === 'needIntervention'"
          type="warning"
          @click="() => { detailVisible = false; handleAbnormal(selectedService) }"
        >处理异常</el-button>
      </template>
    </el-dialog>

    <!-- 处理异常工单对话框 -->
    <el-dialog v-model="abnormalVisible" title="处理服务异常工单" width="600px" :close-on-click-modal="false">
      <div v-if="selectedService">
        <el-alert
          :title="`异常反馈：${selectedService.abnormal?.reason}`"
          type="warning" :closable="false" style="margin-bottom:20px"
        />
        <el-descriptions :column="2" border style="margin-bottom:20px">
          <el-descriptions-item label="需求方">{{ selectedService.demander }}</el-descriptions-item>
          <el-descriptions-item label="服务方">{{ selectedService.provider }}</el-descriptions-item>
        </el-descriptions>
        <el-form :model="abnormalForm" label-width="110px">
          <el-form-item label="核查结论" required>
            <el-radio-group v-model="abnormalForm.verdict">
              <el-radio label="serviceError">服务方责任</el-radio>
              <el-radio label="demanderError">需求方责任</el-radio>
              <el-radio label="mutual">双方协商解决</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="处理建议" required>
            <el-input v-model="abnormalForm.suggestion" type="textarea" :rows="4" placeholder="请填写处理建议与协调方案" />
          </el-form-item>
          <el-form-item label="暂停服务方权限">
            <el-switch v-model="abnormalForm.restrictProvider" active-text="是" inactive-text="否" />
            <span class="form-tip">暂停服务方的新需求发布权限</span>
          </el-form-item>
          <el-form-item label="降低口碑权重">
            <el-switch v-model="abnormalForm.reduceWeight" active-text="是" inactive-text="否" />
            <span class="form-tip">降低服务方口碑评级在搜索中的权重</span>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="abnormalVisible = false">取消</el-button>
        <el-button type="warning" @click="submitAbnormal">提交处理结果</el-button>
      </template>
    </el-dialog>

    <!-- 进度核查对话框 -->
    <el-dialog v-model="verifyVisible" title="核查进度真实性" width="620px" :close-on-click-modal="false">
      <div v-if="selectedService">
        <el-descriptions :column="2" border style="margin-bottom:20px">
          <el-descriptions-item label="服务编号">{{ selectedService.serviceNo }}</el-descriptions-item>
          <el-descriptions-item label="服务方">{{ selectedService.provider }}</el-descriptions-item>
          <el-descriptions-item label="服务标题" :span="2">{{ selectedService.title }}</el-descriptions-item>
        </el-descriptions>

        <div class="section-title">最新进度记录</div>
        <div class="verify-logs">
          <div
            v-for="(log, idx) in selectedService.progressLogs.slice(-3)"
            :key="idx"
            class="verify-log-item"
          >
            <span class="verify-log-time">{{ log.time }}</span>
            <span class="verify-log-title">{{ log.title }}</span>
            <span class="verify-log-desc">{{ log.desc }}</span>
          </div>
        </div>

        <el-form :model="verifyForm" label-width="100px" style="margin-top:20px">
          <el-form-item label="核查结论" required>
            <el-radio-group v-model="verifyForm.result">
              <el-radio label="authentic">进度真实，内容属实</el-radio>
              <el-radio label="suspicious">进度存疑，需进一步核实</el-radio>
              <el-radio label="false">进度造假，需介入处理</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="核查备注">
            <el-input v-model="verifyForm.note" type="textarea" :rows="3" placeholder="请填写核查备注（可选）" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="verifyVisible = false">取消</el-button>
        <el-button type="primary" @click="submitVerify">提交核查结果</el-button>
      </template>
    </el-dialog>

    <!-- 结案对话框 -->
    <el-dialog v-model="resolveVisible" title="异常工单结案" width="500px" :close-on-click-modal="false">
      <el-form :model="resolveForm" label-width="100px">
        <el-form-item label="结案结果" required>
          <el-select v-model="resolveForm.result" style="width:100%">
            <el-option label="协商达成一致" value="agreed" />
            <el-option label="平台强制结案" value="forced" />
            <el-option label="服务方赔偿" value="compensated" />
          </el-select>
        </el-form-item>
        <el-form-item label="结案说明" required>
          <el-input v-model="resolveForm.note" type="textarea" :rows="4" placeholder="请填写结案说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resolveVisible = false">取消</el-button>
        <el-button type="success" @click="submitResolve">确认结案</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const dateRange = ref(null)

const detailVisible = ref(false)
const abnormalVisible = ref(false)
const resolveVisible = ref(false)
const selectedService = ref(null)

const abnormalForm = ref({ verdict: '', suggestion: '', restrictProvider: false, reduceWeight: false })
const resolveForm = ref({ note: '', result: 'agreed' })
const verifyVisible = ref(false)
const verifyForm = ref({ result: '', note: '' })

const services = ref([
  {
    id: 1,
    serviceNo: 'SVC-2026010001',
    type: 'design',
    title: '5万吨散货船设计方案',
    demander: '某航运有限公司',
    provider: 'XX船舶设计研究所',
    progress: 60,
    createTime: '2026-01-20 10:30',
    lastUpdate: '2026-02-10 14:20',
    status: 'inProgress',
    verified: false,
    providerReport: null,
    abnormal: null,
    progressLogs: [
      { time: '2026-01-20 10:30', title: '服务创建', desc: '需求方发布设计需求，服务正式创建', operator: '系统', type: 'primary' },
      { time: '2026-01-22 09:00', title: '服务方接单', desc: 'XX船舶设计研究所确认承接设计任务', operator: 'XX船舶设计研究所', type: 'success' },
      { time: '2026-02-05 16:00', title: '初步方案提交', desc: '提交初步设计方案，待需求方审核', operator: 'XX船舶设计研究所', type: 'primary' },
      { time: '2026-02-10 14:20', title: '方案修改中', desc: '需求方提出修改意见，服务方正在调整方案', operator: 'XX船舶设计研究所', type: 'primary' },
    ]
  },
  {
    id: 2,
    serviceNo: 'SVC-2026010002',
    type: 'building',
    title: '3500吨集装箱船建造',
    demander: '海运集团',
    provider: '青岛XX造船厂',
    progress: 85,
    createTime: '2026-01-18 14:20',
    lastUpdate: '2026-02-12 11:00',
    status: 'needIntervention',
    providerReport: {
      description: '已完成船体建造、动力系统安装、涂装等全部工序，各项指标符合设计要求',
      attachments: [{ name: '建造完成报告.pdf' }, { name: '检测证书.pdf' }]
    },
    abnormal: {
      reason: '需求方认为船舶涂装质量不符合合同要求，拒绝确认服务完成',
      resolution: null
    },
    progressLogs: [
      { time: '2026-01-18 14:20', title: '服务创建', desc: '建造服务正式创建', operator: '系统', type: 'primary' },
      { time: '2026-01-20 08:00', title: '开工建造', desc: '船厂正式开始建造作业', operator: '青岛XX造船厂', type: 'success' },
      { time: '2026-02-10 10:00', title: '完成报告提交', desc: '服务方提交完成报告，申请确认', operator: '青岛XX造船厂', type: 'primary' },
      { time: '2026-02-12 11:00', title: '需求方异常反馈', desc: '需求方拒绝确认，反映涂装质量问题，工单已提交运营介入', operator: '海运集团', type: 'danger' },
    ]
  },
  {
    id: 3,
    serviceNo: 'SVC-2026010003',
    type: 'repair',
    title: '主机维修保养',
    demander: '远洋运输公司',
    provider: '上海XX船舶修理厂',
    progress: 45,
    createTime: '2026-01-25 09:00',
    lastUpdate: '2026-02-08 16:30',
    status: 'handling',
    providerReport: null,
    abnormal: {
      reason: '服务方长期未更新进度，需求方反映多次联系不上服务方',
      resolution: '运营人员已联系服务方，要求其于3个工作日内提供进度说明，否则将暂停发布权限'
    },
    progressLogs: [
      { time: '2026-01-25 09:00', title: '服务创建', desc: '维修需求创建', operator: '系统', type: 'primary' },
      { time: '2026-01-26 10:00', title: '服务方接单', desc: '上海XX船舶修理厂确认承接', operator: '上海XX船舶修理厂', type: 'success' },
      { time: '2026-02-08 16:30', title: '运营介入', desc: '运营人员已介入，正在联系服务方核查进度', operator: '运营人员', type: 'warning' },
    ]
  },
  {
    id: 4,
    serviceNo: 'SVC-2026010004',
    type: 'repair',
    title: '主机大修与设备更换',
    demander: '远洋运输公司',
    provider: '上海XX船舶修理厂',
    progress: 100,
    createTime: '2026-01-15 09:45',
    lastUpdate: '2026-02-05 15:00',
    status: 'completed',
    providerReport: {
      description: '已完成主机大修、更换磨损部件、调试测试，设备运行正常',
      attachments: [{ name: '维修报告.pdf' }]
    },
    abnormal: null,
    progressLogs: [
      { time: '2026-01-15 09:45', title: '服务创建', desc: '维修服务创建', operator: '系统', type: 'primary' },
      { time: '2026-01-16 08:00', title: '开始维修', desc: '修理厂正式开始维修作业', operator: '上海XX船舶修理厂', type: 'success' },
      { time: '2026-02-03 17:00', title: '完成报告提交', desc: '提交维修完成报告', operator: '上海XX船舶修理厂', type: 'primary' },
      { time: '2026-02-05 15:00', title: '服务确认完成', desc: '需求方确认服务完成，评分5星', operator: '远洋运输公司', type: 'success' },
    ]
  },
])

const stats = computed(() => ({
  inProgress: services.value.filter(s => s.status === 'inProgress').length,
  abnormal: services.value.filter(s => s.status === 'needIntervention').length,
  handling: services.value.filter(s => s.status === 'handling').length,
  completed: services.value.filter(s => s.status === 'completed').length,
}))

const filteredServices = computed(() => {
  let list = services.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(s => s.title.toLowerCase().includes(kw) || s.serviceNo.toLowerCase().includes(kw))
  }
  if (filterStatus.value) list = list.filter(s => s.status === filterStatus.value)
  if (filterType.value) list = list.filter(s => s.type === filterType.value)
  return list
})

const handleSearch = () => {}
const resetSearch = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterType.value = ''
  dateRange.value = null
}

const getTypeLabel = (type) => ({ design: '设计', building: '建造', repair: '维修' }[type] || type)
const getTypeTagColor = (type) => ({ design: 'primary', building: 'success', repair: 'warning' }[type] || 'info')
const getStatusLabel = (status) => ({ inProgress: '服务中', needIntervention: '待介入', handling: '处理中', completed: '已完成' }[status] || status)
const getStatusType = (status) => ({ inProgress: 'warning', needIntervention: 'danger', handling: '', completed: 'success' }[status] || 'info')

const viewDetail = (row) => {
  selectedService.value = row
  detailVisible.value = true
}

const openVerify = (row) => {
  selectedService.value = row
  verifyForm.value = { result: '', note: '' }
  verifyVisible.value = true
}

const submitVerify = () => {
  if (!verifyForm.value.result) {
    ElMessage.warning('请选择核查结论')
    return
  }
  const svc = selectedService.value
  const resultMap = { authentic: '进度真实，内容属实', suspicious: '进度存疑', false: '进度造假' }
  svc.progressLogs.push({
    time: new Date().toLocaleString('zh-CN'),
    title: '运营核查进度',
    desc: `核查结论：${resultMap[verifyForm.value.result]}${verifyForm.value.note ? '。' + verifyForm.value.note : ''}`,
    operator: '运营人员',
    type: verifyForm.value.result === 'false' ? 'danger' : verifyForm.value.result === 'suspicious' ? 'warning' : 'success'
  })
  if (verifyForm.value.result === 'authentic') {
    svc.verified = true
  } else if (verifyForm.value.result === 'false') {
    svc.status = 'needIntervention'
    svc.abnormal = { reason: `运营核查发现进度更新造假${verifyForm.value.note ? '：' + verifyForm.value.note : ''}`, resolution: null }
  }
  verifyVisible.value = false
  ElMessage.success('核查结果已记录')
}

const handleAbnormal = (row) => {
  selectedService.value = row
  abnormalForm.value = { verdict: '', suggestion: '', restrictProvider: false, reduceWeight: false }
  abnormalVisible.value = true
}

const submitAbnormal = () => {
  if (!abnormalForm.value.verdict || !abnormalForm.value.suggestion) {
    ElMessage.warning('请填写核查结论和处理建议')
    return
  }
  const svc = selectedService.value
  svc.status = 'handling'
  if (svc.abnormal) svc.abnormal.resolution = abnormalForm.value.suggestion
  svc.progressLogs.push({
    time: new Date().toLocaleString('zh-CN'),
    title: '运营介入处理',
    desc: `核查结论：${{ serviceError: '服务方责任', demanderError: '需求方责任', mutual: '双方协商' }[abnormalForm.value.verdict]}。处理建议：${abnormalForm.value.suggestion}`,
    operator: '运营人员',
    type: 'warning'
  })
  abnormalVisible.value = false
  ElMessage.success('处理结果已提交，服务状态已更新为处理中')
}

const resolveAbnormal = (row) => {
  selectedService.value = row
  resolveForm.value = { note: '', result: 'agreed' }
  resolveVisible.value = true
}

const submitResolve = () => {
  if (!resolveForm.value.note) {
    ElMessage.warning('请填写结案说明')
    return
  }
  const svc = selectedService.value
  svc.status = 'completed'
  svc.progress = 100
  svc.progressLogs.push({
    time: new Date().toLocaleString('zh-CN'),
    title: '异常工单结案',
    desc: `结案结果：${{ agreed: '协商达成一致', forced: '平台强制结案', compensated: '服务方赔偿' }[resolveForm.value.result]}。${resolveForm.value.note}`,
    operator: '运营人员',
    type: 'success'
  })
  resolveVisible.value = false
  ElMessage.success('已结案，服务状态已更新为已完成')
}
</script>

<style scoped>
.service-progress {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
}

.page-description {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg { width: 24px; height: 24px; }

.icon-progress  { background: #EFF6FF; }
.icon-progress svg { fill: #3B82F6; }
.icon-abnormal  { background: #FEF2F2; }
.icon-abnormal svg { fill: #EF4444; }
.icon-handling  { background: #FFFBEB; }
.icon-handling svg { fill: #F59E0B; }
.icon-completed { background: #F0FDF4; }
.icon-completed svg { fill: #22C55E; }

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.stat-value.danger  { color: #EF4444; }
.stat-value.warning { color: #F59E0B; }
.stat-value.success { color: #22C55E; }

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.filter-card {
  margin-bottom: 20px;
  border: none;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.list-card {
  border: none;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

/* 详情弹窗 */
.detail-dialog {
  max-height: 62vh;
  overflow-y: auto;
  padding-right: 4px;
}

.mb-6 { margin-bottom: 20px; }

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  padding-left: 10px;
  border-left: 3px solid #3B82F6;
  margin: 20px 0 12px;
}

.timeline-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px 14px;
}

.timeline-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.timeline-desc {
  font-size: 13px;
  color: #475569;
  margin-bottom: 4px;
  line-height: 1.5;
}

.timeline-operator {
  font-size: 12px;
  color: #94a3b8;
}

.info-box {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
}

.info-box-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 8px;
}

.attach-row { display: flex; flex-wrap: wrap; gap: 8px; }
.attach-tag { cursor: default; }

/* 核查进度 */
.verify-logs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.verify-log-item {
  display: grid;
  grid-template-columns: 150px 120px 1fr;
  gap: 8px;
  align-items: center;
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
}

.verify-log-time { color: #94a3b8; }
.verify-log-title { color: #1e293b; font-weight: 600; }
.verify-log-desc { color: #475569; }

.resolution-box {
  background: #f0fdf4;
  border-radius: 8px;
  padding: 14px 16px;
  margin-top: 12px;
}

.resolution-label {
  font-size: 13px;
  font-weight: 600;
  color: #16a34a;
}

.resolution-text {
  font-size: 13px;
  color: #475569;
  margin: 6px 0 0;
  line-height: 1.6;
}

.form-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #94a3b8;
}
</style>

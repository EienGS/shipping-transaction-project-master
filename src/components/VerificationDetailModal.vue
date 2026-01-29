<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content detail-modal">
      <div class="modal-header">
        <h2>{{ verification?.verificationNo }} - 鉴证详情</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h3>船舶交易基本情况</h3>
          <div class="detail-table">
            <div class="detail-row">
              <div class="detail-label">鉴证编号</div>
              <div class="detail-value">{{ verification?.verificationNo }}</div>
              <div class="detail-label">状态</div>
              <div class="detail-value">
                <span :class="['status-badge', `status-${verification?.status}`]">
                  {{ getStatusText(verification?.status) }}
                </span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-label">船名</div>
              <div class="detail-value">{{ verification?.vesselName }}</div>
              <div class="detail-label">船舶类型</div>
              <div class="detail-value">散货船</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">卖出方</div>
              <div class="detail-value" colspan="3">{{ verification?.seller }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">买入方</div>
              <div class="detail-value" colspan="3">{{ verification?.buyer }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">建造船厂</div>
              <div class="detail-value">大连中远海运川崎</div>
              <div class="detail-label">船籍港</div>
              <div class="detail-value">ZHOUSHAN</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">建造日期</div>
              <div class="detail-value">2018-05-20</div>
              <div class="detail-label">总长(m)</div>
              <div class="detail-value">199.90</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">型深(m)</div>
              <div class="detail-value">18.50</div>
              <div class="detail-label">型宽(m)</div>
              <div class="detail-value">32.26</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">总吨(t)</div>
              <div class="detail-value">36000</div>
              <div class="detail-label">船级</div>
              <div class="detail-value">CCS</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">载重(容)量</div>
              <div class="detail-value">61000 DWT</div>
              <div class="detail-label">航区</div>
              <div class="detail-value">无限航区</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">主机功率(KW)</div>
              <div class="detail-value">8600</div>
              <div class="detail-label">主机型号</div>
              <div class="detail-value">MAN B&W 6550ME-B9</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">船舶识别号</div>
              <div class="detail-value" colspan="3">CN20181234567</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">成交价格</div>
              <div class="detail-value highlight" colspan="3">¥ {{ verification?.amount }}</div>
            </div>
          </div>
        </div>

        <!-- 交易双方信息 -->
        <div class="detail-section">
          <h3>交易双方经办人信息</h3>
          <div class="parties-info">
            <div class="party-card">
              <h4>卖方信息</h4>
              <div class="party-detail-row">
                <span class="party-label">经办人:</span>
                <span class="party-value">{{ verification?.sellerContact || '张三' }}</span>
              </div>
              <div class="party-detail-row">
                <span class="party-label">联系电话:</span>
                <span class="party-value">{{ verification?.sellerPhone || '138****8888' }}</span>
              </div>
              <div class="party-detail-row">
                <span class="party-label">填报状态:</span>
                <span :class="['fill-status', verification?.sellerFilled ? 'filled' : 'unfilled']">
                  {{ verification?.sellerFilled ? '已填报' : '待填报' }}
                </span>
              </div>
            </div>

            <div class="party-card">
              <h4>买方信息</h4>
              <div class="party-detail-row">
                <span class="party-label">经办人:</span>
                <span class="party-value">{{ verification?.buyerContact || '李四' }}</span>
              </div>
              <div class="party-detail-row">
                <span class="party-label">联系电话:</span>
                <span class="party-value">{{ verification?.buyerPhone || '139****9999' }}</span>
              </div>
              <div class="party-detail-row">
                <span class="party-label">填报状态:</span>
                <span :class="['fill-status', verification?.buyerFilled ? 'filled' : 'unfilled']">
                  {{ verification?.buyerFilled ? '已填报' : '待填报' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 官方证书信息 -->
        <div class="detail-section">
          <h3>官方证书信息</h3>
          <div class="certificates-grid">
            <div class="cert-card">
              <h4>船舶所有权登记证书</h4>
              <div class="cert-detail-row">
                <span>证书编号:</span>
                <span>ZC-OWN-2018-001</span>
              </div>
              <div class="cert-detail-row">
                <span>所有人:</span>
                <span>PACIFIC SHIPPING LTD.</span>
              </div>
              <div class="cert-detail-row">
                <span>取得日期:</span>
                <span>2018-06-01</span>
              </div>
            </div>

            <div class="cert-card">
              <h4>船舶国籍证书</h4>
              <div class="cert-detail-row">
                <span>船籍港:</span>
                <span>ZHOUSHAN</span>
              </div>
              <div class="cert-detail-row">
                <span>呼号:</span>
                <span>B1234</span>
              </div>
              <div class="cert-detail-row">
                <span>有效期至:</span>
                <span>2028-05-30</span>
              </div>
            </div>

            <div class="cert-card">
              <h4>船舶检验证书 (IC)</h4>
              <div class="cert-detail-row">
                <span>总吨位:</span>
                <span>36000</span>
              </div>
              <div class="cert-detail-row">
                <span>发证机构:</span>
                <span>CCS</span>
              </div>
              <div class="cert-detail-row">
                <span>下次检期:</span>
                <span>2023-11-20</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 审核状态 -->
        <div v-if="verification?.status !== 'filling'" class="detail-section">
          <h3>审核进度</h3>
          <div class="timeline">
            <div class="timeline-item completed">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-title">申请提交</div>
                <div class="timeline-time">{{ verification?.submitTime || '2024-01-15 10:30' }}</div>
              </div>
            </div>
            <div :class="['timeline-item', { completed: verification?.status !== 'pending' }]">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-title">审核中</div>
                <div class="timeline-time">{{ verification?.reviewTime || '审核中...' }}</div>
              </div>
            </div>
            <div :class="['timeline-item', { completed: verification?.status === 'approved' }]">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-title">审核完成</div>
                <div class="timeline-time">{{ verification?.completeTime || '等待审核' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 审核驳回原因 -->
        <div v-if="verification?.status === 'rejected'" class="detail-section">
          <h3>驳回原因</h3>
          <div class="reject-reason-box">
            <div class="reject-icon">⚠️</div>
            <div class="reject-content">
              <div class="reject-title">审核未通过</div>
              <div class="reject-text">{{ verification?.rejectReason || '经办人身份证模糊，请重新上传清晰的身份证件。官方证书信息与系统数据不一致，请核实后补充说明。' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-close" @click="$emit('close')">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  verification: Object
})

defineEmits(['close'])

const getStatusText = (status) => {
  const statusMap = {
    filling: '填报中',
    pending: '待审核',
    reviewing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
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
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
}

.detail-modal {
  max-width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E2E8F0;
  background: #F8FAFC;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #94A3B8;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #E2E8F0;
  background: #F8FAFC;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
}

.btn-close {
  padding: 10px 24px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-close:hover {
  background: #F1F5F9;
}

/* Detail Section */
.detail-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F1F5F9;
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-section h3::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #0EA5E9;
  border-radius: 2px;
}

/* Detail Table */
.detail-table {
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
}

.detail-row {
  display: grid;
  grid-template-columns: 140px 1fr 140px 1fr;
  border-bottom: 1px solid #F1F5F9;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  background: #F8FAFC;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  border-right: 1px solid #F1F5F9;
}

.detail-value {
  padding: 12px 16px;
  font-size: 13px;
  color: #0F172A;
  font-weight: 500;
  border-right: 1px solid #F1F5F9;
}

.detail-value:last-child {
  border-right: none;
}

.detail-value.highlight {
  color: #0EA5E9;
  font-weight: 700;
  font-size: 16px;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-filling {
  background: #FEF3C7;
  color: #D97706;
}

.status-pending {
  background: #DBEAFE;
  color: #1E40AF;
}

.status-reviewing {
  background: #E0E7FF;
  color: #4F46E5;
}

.status-approved {
  background: #D1FAE5;
  color: #059669;
}

.status-rejected {
  background: #FEE2E2;
  color: #DC2626;
}

/* Parties Info */
.parties-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.party-card {
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  background: #FAFAFA;
}

.party-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #E2E8F0;
}

.party-detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
}

.party-label {
  color: #64748B;
  font-weight: 500;
}

.party-value {
  color: #0F172A;
  font-weight: 600;
}

.fill-status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.fill-status.filled {
  background: #D1FAE5;
  color: #059669;
}

.fill-status.unfilled {
  background: #FEE2E2;
  color: #DC2626;
}

/* Certificates Grid */
.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.cert-card {
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  background: #F8FAFC;
}

.cert-card h4 {
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #E2E8F0;
}

.cert-detail-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 12px;
}

.cert-detail-row span:first-child {
  color: #64748B;
  font-weight: 500;
}

.cert-detail-row span:last-child {
  color: #0F172A;
  font-weight: 600;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #E2E8F0;
}

.timeline-item {
  position: relative;
  padding-bottom: 24px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -40px;
  top: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E2E8F0;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #E2E8F0;
}

.timeline-item.completed .timeline-dot {
  background: #10B981;
  box-shadow: 0 0 0 2px #10B981;
}

.timeline-content {
  background: #F8FAFC;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid #E2E8F0;
}

.timeline-item.completed .timeline-content {
  border-left-color: #10B981;
}

.timeline-title {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 4px;
}

.timeline-time {
  font-size: 12px;
  color: #64748B;
}

/* Reject Reason */
.reject-reason-box {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 8px;
}

.reject-icon {
  font-size: 32px;
  line-height: 1;
}

.reject-content {
  flex: 1;
}

.reject-title {
  font-size: 15px;
  font-weight: 600;
  color: #DC2626;
  margin-bottom: 8px;
}

.reject-text {
  font-size: 13px;
  color: #991B1B;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .detail-modal {
    max-width: 100%;
  }

  .modal-content {
    margin: 0;
    border-radius: 0;
  }

  .detail-row {
    grid-template-columns: 120px 1fr;
  }

  .detail-row > *:nth-child(3),
  .detail-row > *:nth-child(4) {
    grid-column: 1 / -1;
    border-top: 1px solid #F1F5F9;
  }

  .parties-info {
    grid-template-columns: 1fr;
  }

  .certificates-grid {
    grid-template-columns: 1fr;
  }
}
</style>

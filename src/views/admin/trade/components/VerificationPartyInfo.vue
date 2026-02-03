<template>
  <div class="party-info-section">
    <el-row :gutter="24">
      <!-- 卖方信息 -->
      <el-col :xs="24" :md="12">
        <div class="party-card">
          <h3 class="party-title">卖出方信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">卖出方（{{ sellerType }}）</span>
              <span class="info-value">{{ ticket?.sellerInfo?.name || 'PACIFIC SHIPPING LTD.' }}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">{{ sellerType === '个人' ? '身份证' : '统一社会信用代码' }}</span>
              <span class="info-value">{{ ticket?.sellerInfo?.uscc || ticket?.sellerInfo?.idCard || '91310000MA1FL5E73Y' }}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">{{ sellerType === '个人' ? '身份证' : '营业执照' }}</span>
              <div class="file-action">
                <span class="info-value">已上传</span>
                <el-button link type="primary" size="small" @click="viewAttachment('seller', 'license')">
                  查看附件
                </el-button>
              </div>
            </div>

            <template v-if="sellerType === '企业'">
              <div class="info-item">
                <span class="info-label">法定代表人</span>
                <span class="info-value">{{ ticket?.sellerInfo?.legalRepresentative || '张三' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">法定代表人身份证</span>
                <div class="file-action">
                  <span class="info-value">已上传</span>
                  <el-button link type="primary" size="small" @click="viewAttachment('seller', 'legalIdCard')">
                    查看附件
                  </el-button>
                </div>
              </div>

              <div class="info-item">
                <span class="info-label">经办人</span>
                <span class="info-value">{{ ticket?.sellerInfo?.operator || '李四' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">联系电话</span>
                <span class="info-value">{{ ticket?.sellerInfo?.contact || '138-0000-0000' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">经办人身份证</span>
                <div class="file-action">
                  <span class="info-value">已上传</span>
                  <el-button link type="primary" size="small" @click="viewAttachment('seller', 'operatorIdCard')">
                    查看附件
                  </el-button>
                </div>
              </div>

              <div class="info-item">
                <span class="info-label">授权委托书</span>
                <div class="file-action">
                  <span class="info-value">已上传</span>
                  <el-button link type="primary" size="small" @click="viewAttachment('seller', 'authLetter')">
                    查看附件
                  </el-button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </el-col>

      <!-- 买方信息 -->
      <el-col :xs="24" :md="12">
        <div class="party-card">
          <h3 class="party-title">买入方信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">买入方（{{ buyerType }}）</span>
              <span class="info-value">{{ ticket?.buyerInfo?.name || 'SHANGHAI TRADING CO., LTD.' }}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">{{ buyerType === '个人' ? '身份证' : '统一社会信用代码' }}</span>
              <span class="info-value">{{ ticket?.buyerInfo?.uscc || ticket?.buyerInfo?.idCard || '91310000MA1FL5E88K' }}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">{{ buyerType === '个人' ? '身份证' : '营业执照' }}</span>
              <div class="file-action">
                <span class="info-value">已上传</span>
                <el-button link type="primary" size="small" @click="viewAttachment('buyer', 'license')">
                  查看附件
                </el-button>
              </div>
            </div>

            <template v-if="buyerType === '企业'">
              <div class="info-item">
                <span class="info-label">法定代表人</span>
                <span class="info-value">{{ ticket?.buyerInfo?.legalRepresentative || '王五' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">法定代表人身份证</span>
                <div class="file-action">
                  <span class="info-value">已上传</span>
                  <el-button link type="primary" size="small" @click="viewAttachment('buyer', 'legalIdCard')">
                    查看附件
                  </el-button>
                </div>
              </div>

              <div class="info-item">
                <span class="info-label">经办人</span>
                <span class="info-value">{{ ticket?.buyerInfo?.operator || '赵六' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">联系电话</span>
                <span class="info-value">{{ ticket?.buyerInfo?.contact || '139-0000-0000' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">经办人身份证</span>
                <div class="file-action">
                  <span class="info-value">已上传</span>
                  <el-button link type="primary" size="small" @click="viewAttachment('buyer', 'operatorIdCard')">
                    查看附件
                  </el-button>
                </div>
              </div>

              <div class="info-item">
                <span class="info-label">授权委托书</span>
                <div class="file-action">
                  <span class="info-value">已上传</span>
                  <el-button link type="primary" size="small" @click="viewAttachment('buyer', 'authLetter')">
                    查看附件
                  </el-button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  ticket: Object
})

// 判断交易方类型
const sellerType = computed(() => {
  return props.ticket?.sellerInfo?.type === 'individual' ? '个人' : '企业'
})

const buyerType = computed(() => {
  return props.ticket?.buyerInfo?.type === 'individual' ? '个人' : '企业'
})

// 查看附件
const viewAttachment = (party, fileType) => {
  console.log('[v0] 查看附件:', party, fileType)
  // TODO: 实现附件查看逻辑
}
</script>

<style scoped>
.party-info-section {
  padding: 20px 0;
}

.party-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.party-title {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #0EA5E9;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #F1F5F9;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  line-height: 1.4;
}

.info-value {
  font-size: 15px;
  font-weight: 500;
  color: #0F172A;
  line-height: 1.6;
}

.file-action {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-action .info-value {
  color: #10B981;
  font-size: 14px;
}

:deep(.el-button.is-link) {
  font-weight: 600;
}
</style>

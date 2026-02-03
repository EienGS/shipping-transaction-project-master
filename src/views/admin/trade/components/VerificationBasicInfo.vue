<template>
  <div class="basic-info-section">
    <div class="info-grid">
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">船名</span>
          <span class="info-value">{{ ticket?.vesselName || 'PACIFIC HERO' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">船舶类型</span>
          <span class="info-value">{{ ticket?.basicInfo?.vesselType || '散货船' }}</span>
        </div>
      </div>

      <div class="info-row full">
        <div class="info-item">
          <span class="info-label">卖出方</span>
          <span class="info-value">{{ ticket?.sellerName || 'PACIFIC SHIPPING LTD.' }}</span>
        </div>
      </div>

      <div class="info-row full">
        <div class="info-item">
          <span class="info-label">买入方</span>
          <span class="info-value">{{ ticket?.buyerName || 'SHANGHAI TRADING CO., LTD.' }}</span>
        </div>
      </div>

      <div class="info-row full">
        <div class="info-item">
          <span class="info-label">建造船厂</span>
          <span class="info-value">{{ formData.shipyard }}</span>
        </div>
      </div>

      <div class="info-row">
        <div class="info-item">
          <span class="info-label">建造日期</span>
          <span class="info-value">{{ formData.buildDate || '年/月/日' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">船籍港</span>
          <span class="info-value">{{ formData.port }}</span>
        </div>
      </div>

      <div class="info-row">
        <div class="info-item">
          <span class="info-label">总长(m)</span>
          <span class="info-value">{{ formData.length }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">型深(m)</span>
          <span class="info-value">{{ formData.depth }}</span>
        </div>
      </div>

      <div class="info-row">
        <div class="info-item">
          <span class="info-label">总吨(t)</span>
          <span class="info-value">{{ formData.tonnage }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">型宽(m)</span>
          <span class="info-value">{{ formData.width }}</span>
        </div>
      </div>

      <div class="info-row">
        <div class="info-item">
          <span class="info-label">载重(容)量</span>
          <span class="info-value">{{ formData.deadweight }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">船级</span>
          <span class="info-value">{{ formData.classification }}</span>
        </div>
      </div>

      <div class="info-row">
        <div class="info-item">
          <span class="info-label">主机功率(KW)</span>
          <span class="info-value">{{ formData.enginePower }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">航区</span>
          <span class="info-value">{{ formData.navigationArea }}</span>
        </div>
      </div>

      <div class="info-row">
        <div class="info-item">
          <span class="info-label">船舶识别号</span>
          <span class="info-value">{{ formData.imo }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">主机型号</span>
          <span class="info-value">{{ formData.engineModel }}</span>
        </div>
      </div>

      <div class="info-row">
        <div class="info-item" style="flex: 2;">
          <span class="info-label">成交价格(大写)</span>
          <span class="info-value">{{ formData.priceText }}</span>
        </div>
        <div class="info-item" style="flex: 1;">
          <span class="info-label">¥</span>
          <span class="info-value price-highlight">{{ formData.price }}</span>
        </div>
      </div>

      <div class="info-row full">
        <div class="info-item">
          <span class="info-label">交付时间</span>
          <span class="info-value">{{ formData.deliveryDate || '年/月/日' }}</span>
        </div>
      </div>

      <div class="info-row full">
        <div class="info-item">
          <span class="info-label">备注</span>
          <span class="info-value remarks">{{ formData.remarks || '其他补充说明...' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  ticket: Object
})

const formData = ref({
  shipyard: '大连中远海运川崎',
  buildDate: '',
  port: 'ZHOUSHAN',
  length: '199.90',
  depth: '18.50',
  tonnage: '36000',
  width: '32.26',
  deadweight: '61000 DWT',
  classification: 'CCS',
  enginePower: '8600',
  navigationArea: '无限航区',
  imo: 'CN20181234567',
  engineModel: 'MAN B&W 6550ME-B9',
  priceText: '捌仟伍佰万元整',
  price: '85000000',
  deliveryDate: '',
  remarks: ''
})

watch(() => props.ticket, (newTicket) => {
  if (newTicket?.basicInfo) {
    formData.value.shipyard = newTicket.basicInfo.shipyard || formData.value.shipyard
    formData.value.buildDate = newTicket.basicInfo.buildDate || ''
    formData.value.port = newTicket.basicInfo.port || formData.value.port
    formData.value.length = newTicket.basicInfo.length || formData.value.length
    formData.value.depth = newTicket.basicInfo.depth || formData.value.depth
    formData.value.tonnage = newTicket.basicInfo.tonnage || formData.value.tonnage
    formData.value.width = newTicket.basicInfo.width || formData.value.width
    formData.value.deadweight = newTicket.basicInfo.deadweight || formData.value.deadweight
    formData.value.classification = newTicket.basicInfo.classification || formData.value.classification
    formData.value.enginePower = newTicket.basicInfo.enginePower || formData.value.enginePower
    formData.value.navigationArea = newTicket.basicInfo.navigationArea || formData.value.navigationArea
    formData.value.imo = newTicket.basicInfo.imo || formData.value.imo
    formData.value.engineModel = newTicket.basicInfo.engineModel || formData.value.engineModel
    formData.value.priceText = newTicket.transactionInfo?.priceText || formData.value.priceText
    formData.value.price = newTicket.transactionInfo?.amount || formData.value.price
    formData.value.deliveryDate = newTicket.transactionInfo?.deliveryDate || ''
    formData.value.remarks = newTicket.transactionInfo?.remarks || ''
  }
}, { immediate: true })
</script>

<style scoped>
.basic-info-section {
  padding: 20px;
  background: white;
  border-radius: 12px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 12px 0;
  border-bottom: 1px solid #F1F5F9;
}

.info-row.full {
  grid-template-columns: 1fr;
}

.info-row:last-child {
  border-bottom: none;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  min-height: 24px;
}

.info-value.price-highlight {
  color: #EF4444;
  font-weight: 700;
  font-size: 16px;
}

.info-value.remarks {
  color: #475569;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .info-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .info-row:not(.full) .info-item:first-child {
    padding-bottom: 12px;
    border-bottom: 1px dashed #E2E8F0;
  }
}
</style>

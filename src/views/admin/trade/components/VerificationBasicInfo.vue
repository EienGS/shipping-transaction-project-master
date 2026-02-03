<template>
  <div class="basic-info-section">
    <el-form label-width="140px">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12">
          <el-form-item label="船名">
            <span class="info-text">{{ ticket?.vesselName || 'PACIFIC HERO' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="船舶类型">
            <span class="info-text">{{ ticket?.basicInfo?.vesselType || '散货船' }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24">
          <el-form-item label="卖出方">
            <span class="info-text">{{ ticket?.sellerName || 'PACIFIC SHIPPING LTD.' }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24">
          <el-form-item label="买入方">
            <span class="info-text">{{ ticket?.buyerName || 'SHANGHAI TRADING CO., LTD.' }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24">
          <el-form-item label="建造船厂">
            <el-input v-model="formData.shipyard" placeholder="大连中远海运川崎" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="12">
          <el-form-item label="建造日期">
            <el-date-picker 
              v-model="formData.buildDate" 
              type="date" 
              placeholder="年/月/日"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="船籍港">
            <el-input v-model="formData.port" placeholder="ZHOUSHAN" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="12">
          <el-form-item label="总长(m)">
            <el-input v-model="formData.length" placeholder="199.90" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="型深(m)">
            <el-input v-model="formData.depth" placeholder="18.50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="12">
          <el-form-item label="总吨(t)">
            <el-input v-model="formData.tonnage" placeholder="36000" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="型宽(m)">
            <el-input v-model="formData.width" placeholder="32.26" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="12">
          <el-form-item label="载重(容)量">
            <el-input v-model="formData.deadweight" placeholder="61000 DWT" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="船级">
            <el-input v-model="formData.classification" placeholder="CCS" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="12">
          <el-form-item label="主机功率(KW)">
            <el-input v-model="formData.enginePower" placeholder="8600" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="航区">
            <el-input v-model="formData.navigationArea" placeholder="无限航区" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="12">
          <el-form-item label="船舶识别号">
            <el-input v-model="formData.imo" placeholder="CN20181234567" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="主机型号">
            <el-input v-model="formData.engineModel" placeholder="MAN B&W 6550ME-B9" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="12">
          <el-form-item label="成交价格(大写)">
            <el-input v-model="formData.priceText" placeholder="捌仟伍佰万元整" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="6">
          <el-form-item label="">
            <span style="display: block; height: 32px; line-height: 32px; color: transparent;">占位</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="6">
          <el-form-item label="¥">
            <el-input v-model="formData.price" placeholder="85000000" type="number" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24">
          <el-form-item label="交付时间">
            <el-date-picker 
              v-model="formData.deliveryDate" 
              type="date" 
              placeholder="年/月/日"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24">
          <el-form-item label="备注">
            <el-input 
              v-model="formData.remarks" 
              type="textarea" 
              :rows="4"
              placeholder="其他补充说明..."
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
  padding: 20px 0;
}

.info-text {
  color: #0f172a;
  font-weight: 500;
  display: block;
  line-height: 32px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #475569;
}

:deep(.el-input__inner) {
  border-radius: 8px;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
}
</style>

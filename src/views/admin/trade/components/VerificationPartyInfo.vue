<template>
  <div class="party-info-section">
    <el-row :gutter="24">
      <!-- 卖方信息 -->
      <el-col :xs="24" :md="12">
        <div class="party-card">
          <h3 class="party-title">卖出方信息</h3>
          <el-form label-width="100px">
            <el-form-item label="企业名称">
              <span class="info-text">{{ ticket?.sellerInfo?.name || '-' }}</span>
            </el-form-item>
            <el-form-item label="统一社会信用代码">
              <span class="info-text">{{ ticket?.sellerInfo?.uscc || '-' }}</span>
            </el-form-item>
            <el-form-item label="企业类型">
              <span class="info-text">{{ ticket?.sellerInfo?.type === 'company' ? '企业' : '个人' }}</span>
            </el-form-item>
            <el-form-item label="法定代表人">
              <span class="info-text">{{ ticket?.sellerInfo?.legalRepresentative || '-' }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span class="info-text">{{ ticket?.sellerInfo?.contact || '-' }}</span>
            </el-form-item>
            <el-form-item label="营业执照">
              <el-button link type="primary" size="small">查看文件</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>

      <!-- 买方信息 -->
      <el-col :xs="24" :md="12">
        <div class="party-card">
          <h3 class="party-title">买入方信息</h3>
          <el-form label-width="100px">
            <el-form-item label="企业名称">
              <span class="info-text">{{ ticket?.buyerInfo?.name || '-' }}</span>
            </el-form-item>
            <el-form-item label="统一社会信用代码">
              <span class="info-text">{{ ticket?.buyerInfo?.uscc || '-' }}</span>
            </el-form-item>
            <el-form-item label="企业类型">
              <span class="info-text">{{ ticket?.buyerInfo?.type === 'company' ? '企业' : '个人' }}</span>
            </el-form-item>
            <el-form-item label="法定代表人">
              <span class="info-text">{{ ticket?.buyerInfo?.legalRepresentative || '-' }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span class="info-text">{{ ticket?.buyerInfo?.contact || '-' }}</span>
            </el-form-item>
            <el-form-item label="营业执照">
              <el-button link type="primary" size="small">查看文件</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <!-- 交易信息 -->
    <div class="party-card" style="margin-top: 20px">
      <h3 class="party-title">交易信息</h3>
      <el-form label-width="100px">
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="交易金额">
              <span class="info-text">¥ {{ formatNumber(ticket?.transactionInfo?.amount) }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="货币">
              <span class="info-text">{{ ticket?.transactionInfo?.currency || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ticket: Object
})

const formatNumber = (num) => {
  return num?.toLocaleString('zh-CN') || '-'
}
</script>

<style scoped>
.party-info-section {
  padding: 20px 0;
}

.party-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.party-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #0ea5e9;
}

.info-text {
  color: #0f172a;
  font-weight: 500;
}
</style>

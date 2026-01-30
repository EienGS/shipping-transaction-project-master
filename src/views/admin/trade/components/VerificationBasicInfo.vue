<template>
  <div class="basic-info-section">
    <el-form label-width="120px">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="IMO编号">
            <span class="info-text">{{ ticket?.basicInfo?.imo || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="船舶名称">
            <span class="info-text">{{ ticket?.vesselName || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="国籍">
            <span class="info-text">{{ ticket?.basicInfo?.flag || '-' }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="船舶类型">
            <span class="info-text">{{ ticket?.basicInfo?.vesselType || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="总吨位(GT)">
            <span class="info-text">{{ ticket?.basicInfo?.grt || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="净吨位(NT)">
            <span class="info-text">{{ ticket?.basicInfo?.nrt || '-' }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="长(m)">
            <span class="info-text">{{ ticket?.basicInfo?.loa || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="宽(m)">
            <span class="info-text">{{ ticket?.basicInfo?.beam || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="深(m)">
            <span class="info-text">{{ ticket?.basicInfo?.depth || '-' }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="建造年份">
            <span class="info-text">{{ ticket?.basicInfo?.yearBuilt || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="船级社">
            <span class="info-text">{{ ticket?.basicInfo?.classification || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="最后验船日期">
            <span class="info-text">{{ ticket?.basicInfo?.lastSurveyDate || '-' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
defineProps({
  ticket: Object
})
</script>

<style scoped>
.basic-info-section {
  padding: 20px 0;
}

.info-text {
  color: #0f172a;
  font-weight: 500;
}
</style>

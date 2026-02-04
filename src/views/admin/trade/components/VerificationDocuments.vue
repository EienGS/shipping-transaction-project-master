<template>
  <div class="documents-section">
    <!-- 官方证书 -->
    <div class="section-block">
      <h3 class="section-title">官方证书</h3>
      <el-row :gutter="16">
        <el-col v-for="cert in officialCertificates" :key="cert.name" :xs="24" :sm="12" :md="8">
          <div class="document-card">
            <div class="doc-icon certificate">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h4 class="doc-name">{{ cert.name }}</h4>
            <p class="doc-status">{{ cert.status }}</p>
            <div class="doc-actions">
              <el-button link type="primary" size="small" @click="viewDocument(cert)">预览</el-button>
              <el-divider direction="vertical" />
              <el-button link type="primary" size="small" @click="downloadDocument(cert)">下载</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 船舶相关文件 -->
    <div class="section-block">
      <h3 class="section-title">船舶相关文件</h3>
      <el-row :gutter="16">
        <el-col v-for="doc in vesselDocuments" :key="doc.name" :xs="24" :sm="12" :md="8">
          <div class="document-card">
            <div class="doc-icon vessel">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
              </svg>
            </div>
            <h4 class="doc-name">{{ doc.name }}</h4>
            <p class="doc-status" :class="{ optional: doc.optional }">
              {{ doc.optional ? '（选填）' : '' }}{{ doc.status }}
            </p>
            <div class="doc-actions">
              <el-button link type="primary" size="small" @click="viewDocument(doc)">预览</el-button>
              <el-divider direction="vertical" />
              <el-button link type="primary" size="small" @click="downloadDocument(doc)">下载</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  ticket: Object
})

// 官方证书
const officialCertificates = computed(() => [
  { name: '船舶所有权证书', status: '已上传', file: 'ownership_cert.pdf' },
  { name: '船舶国籍证书', status: '已上传', file: 'nationality_cert.pdf' },
  { name: '船舶检验证书', status: '已上传', file: 'inspection_cert.pdf' },
  { name: '国际吨位证书', status: '已上传', file: 'tonnage_cert.pdf' },
  { name: '船级证书', status: '已上传', file: 'class_cert.pdf' }
])

// 船舶相关文件
const vesselDocuments = computed(() => [
  { 
    name: '船舶营业运输证', 
    status: '已上传', 
    optional: true,
    note: '非营运船舶无需提供',
    file: 'transport_license.pdf' 
  },
  { 
    name: '所有权注销证明书', 
    status: '已上传', 
    optional: true,
    note: '如船舶所有权登记已在主管机关注销',
    file: 'cancellation_cert.pdf' 
  },
  { 
    name: '船舶买卖合同', 
    status: '已上传', 
    optional: false,
    file: 'sale_contract.pdf' 
  },
  { 
    name: '船舶交接协议', 
    status: '已上传', 
    optional: false,
    file: 'delivery_agreement.pdf' 
  }
])

const viewDocument = (doc) => {
  console.log('[v0] 预览文件:', doc.name)
  // TODO: 实现文件预览
}

const downloadDocument = (doc) => {
  console.log('[v0] 下载文件:', doc.name)
  // TODO: 实现文件下载
}
</script>

<style scoped>
.documents-section {
  padding: 20px 0;
}

.section-block {
  margin-bottom: 32px;
}

.section-block:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #0EA5E9;
}

.document-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
  height: 100%;
}

.document-card:hover {
  border-color: #0EA5E9;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
  transform: translateY(-2px);
}

.doc-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  border-radius: 12px;
  background: #F0F9FF;
}

.doc-icon.certificate {
  background: #ECFDF5;
  color: #10B981;
}

.doc-icon.vessel {
  background: #F0F9FF;
  color: #0EA5E9;
}

.doc-icon svg {
  width: 32px;
  height: 32px;
}

.doc-name {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin: 12px 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-status {
  font-size: 13px;
  color: #10B981;
  font-weight: 500;
  margin: 0 0 16px 0;
}

.doc-status.optional {
  color: #64748B;
}

.doc-actions {
  padding-top: 12px;
  border-top: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-button.is-link) {
  font-weight: 600;
}

:deep(.el-divider--vertical) {
  margin: 0 8px;
}
</style>

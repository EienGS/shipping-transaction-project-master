<template>
  <div class="documents-section">
    <el-row :gutter="24">
      <el-col v-for="doc in ticket?.documents" :key="doc.name" :xs="24" :sm="12" :md="8">
        <div class="document-card">
          <div class="doc-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
            </svg>
          </div>
          <h4 class="doc-name">{{ doc.name }}</h4>
          <p class="doc-file">{{ doc.file }}</p>
          <div class="doc-actions">
            <el-button link type="primary" size="small">预览</el-button>
            <el-divider direction="vertical" />
            <el-button link type="primary" size="small">下载</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
defineProps({
  ticket: Object
})
</script>

<style scoped>
.documents-section {
  padding: 20px 0;
}

.document-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s;
}

.document-card:hover {
  border-color: #0ea5e9;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
}

.doc-icon {
  font-size: 40px;
  color: #0ea5e9;
  margin-bottom: 12px;
}

.doc-icon svg {
  width: 40px;
  height: 40px;
}

.doc-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 12px 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-file {
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 12px 0;
}

.doc-actions {
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}
</style>

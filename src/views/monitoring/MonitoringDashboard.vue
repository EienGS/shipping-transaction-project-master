<template>
  <div class="dashboard-container">

    <!-- Map Container -->
    <div class="map-wrapper">
      <div id="tiandituMap" class="tianditu-map"></div>

      <!-- Vessel List Panel -->
      <div class="vessel-list-panel" :class="{ collapsed: isPanelCollapsed }">
        <div class="panel-header">
          <h2>监测船舶列表</h2>
          <button class="btn-collapse" @click="togglePanel">
            <svg v-if="!isPanelCollapsed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="panel-body">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input v-model="vesselSearchKeyword" type="text" placeholder="搜索船舶名称..." class="search-input" />
          </div>

          <div class="vessel-list">
            <div v-for="vessel in filteredVessels" :key="vessel.id" class="vessel-item"
              :class="{ active: selectedVesselId === vessel.id }" @click="selectVessel(vessel)">
              <div class="vessel-status" :class="`status-${vessel.status}`"></div>
              <div class="vessel-info">
                <h3 class="vessel-name">{{ vessel.name }}</h3>
                <p class="vessel-detail">{{ vessel.type }} | {{ vessel.dwt }}吨</p>
                <div class="vessel-position">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span>{{ vessel.currentLocation }}</span>
                </div>
                <div class="vessel-meta">
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ vessel.speed }} 节
                  </span>
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path
                        d="M14.121 9.88l-5.657 5.657a2 2 0 11-2.828-2.828l5.657-5.657a4 4 0 115.656 5.656L11.293 18.364a6 6 0 11-8.486-8.486l5.657-5.657" />
                    </svg>
                    {{ vessel.course }}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vessel Detail Card (appears when vessel is selected) -->
      <div v-if="selectedVessel" class="vessel-detail-card">
        <div class="detail-card-header">
          <h3>{{ selectedVessel.name }}</h3>
          <button class="btn-close-detail" @click="clearSelection">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="detail-card-body">
          <div class="detail-row">
            <span class="detail-label">船舶类型</span>
            <span class="detail-value">{{ selectedVessel.type }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">载重吨</span>
            <span class="detail-value">{{ selectedVessel.dwt }} 吨</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">当前位置</span>
            <span class="detail-value">{{ selectedVessel.currentLocation }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">航速</span>
            <span class="detail-value">{{ selectedVessel.speed }} 节</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">航向</span>
            <span class="detail-value">{{ selectedVessel.course }}°</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">状态</span>
            <span class="detail-value">
              <span class="status-tag" :class="`status-${selectedVessel.status}`">
                {{ getStatusLabel(selectedVessel.status) }}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">最后更新</span>
            <span class="detail-value">{{ selectedVessel.lastUpdate }}</span>
          </div>
        </div>
        <div class="detail-card-footer">
          <button class="btn-track-history" @click="viewTrackHistory">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            航行轨迹
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// State
const isPanelCollapsed = ref(false)
const vesselSearchKeyword = ref('')
const selectedVesselId = ref(null)
const map = ref(null)
const markers = ref([])

// Mock vessel data
const vessels = ref([
  {
    id: 1,
    name: 'OCEAN STAR',
    type: '散货船',
    dwt: 57000,
    currentLocation: '上海附近海域',
    coordinates: { lng: 121.5, lat: 31.2 },
    speed: 12.5,
    course: 135,
    status: 'sailing',
    lastUpdate: '2026-01-29 14:30'
  },
  {
    id: 2,
    name: 'SEA DRAGON',
    type: '油船',
    dwt: 75000,
    currentLocation: '宁波港',
    coordinates: { lng: 121.8, lat: 29.9 },
    speed: 0,
    course: 0,
    status: 'anchored',
    lastUpdate: '2026-01-29 14:25'
  },
  {
    id: 3,
    name: 'PACIFIC HERO',
    type: '集装箱船',
    dwt: 32000,
    currentLocation: '青岛港',
    coordinates: { lng: 120.3, lat: 36.1 },
    speed: 0,
    course: 0,
    status: 'berthed',
    lastUpdate: '2026-01-29 14:20'
  },
  {
    id: 4,
    name: 'GOLDEN WAVE',
    type: '散货船',
    dwt: 48000,
    currentLocation: '台湾海峡',
    coordinates: { lng: 119.5, lat: 24.5 },
    speed: 15.2,
    course: 180,
    status: 'sailing',
    lastUpdate: '2026-01-29 14:28'
  }
])

// Computed
const filteredVessels = computed(() => {
  if (!vesselSearchKeyword.value) return vessels.value

  return vessels.value.filter(v =>
    v.name.toLowerCase().includes(vesselSearchKeyword.value.toLowerCase())
  )
})

const selectedVessel = computed(() => {
  if (!selectedVesselId.value) return null
  return vessels.value.find(v => v.id === selectedVesselId.value)
})

// Methods
const togglePanel = () => {
  isPanelCollapsed.value = !isPanelCollapsed.value
}

const selectVessel = (vessel) => {
  selectedVesselId.value = vessel.id
  if (map.value) {
    map.value.panTo(new window.T.LngLat(vessel.coordinates.lng, vessel.coordinates.lat))
    map.value.setZoom(10)
  }
}

const clearSelection = () => {
  selectedVesselId.value = null
}

const getStatusLabel = (status) => {
  const labels = {
    sailing: '航行中',
    anchored: '锚泊',
    berthed: '靠泊'
  }
  return labels[status] || status
}

const refreshData = () => {
  console.log('[v0] 刷新数据')
  // Simulate data refresh
  vessels.value = [...vessels.value]
}

const viewTrackHistory = () => {
  console.log('[v0] 查看航行轨迹')
  // Implement track history viewing
}

// Initialize Tianditu Map
const initMap = () => {
  // Load Tianditu API script
  if (!window.T) {
    const script = document.createElement('script')
    script.src = `http://api.tianditu.gov.cn/api?v=4.0&tk=2e23e92f7c9790018ab06498f1f55c1e`
    script.onload = () => {
      createMap()
    }
    document.head.appendChild(script)
  } else {
    createMap()
  }
}

const createMap = () => {
  // Initialize map centered on East China Sea
  map.value = new window.T.Map('tiandituMap')
  map.value.centerAndZoom(new window.T.LngLat(121, 31), 7)

  // Add markers for each vessel
  vessels.value.forEach(vessel => {
    const icon = new window.T.Icon({
      iconUrl: getVesselIcon(vessel.status),
      iconSize: new window.T.Point(32, 32),
      iconAnchor: new window.T.Point(16, 16)
    })

    const marker = new window.T.Marker(
      new window.T.LngLat(vessel.coordinates.lng, vessel.coordinates.lat),
      { icon }
    )

    // Add click event
    marker.addEventListener('click', () => {
      selectVessel(vessel)
    })

    // Add label
    const label = new window.T.Label({
      text: vessel.name,
      position: new window.T.LngLat(vessel.coordinates.lng, vessel.coordinates.lat),
      offset: new window.T.Point(0, -20)
    })
    label.setStyle({
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid #06B6D4',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#0F172A'
    })

    map.value.addOverLay(marker)
    map.value.addOverLay(label)
    markers.value.push({ marker, label, vessel })
  })
}

const getVesselIcon = (status) => {
  // Return different icons based on vessel status
  const baseUrl = 'data:image/svg+xml;base64,'
  let color = '#06B6D4'

  if (status === 'sailing') color = '#10B981'
  if (status === 'anchored') color = '#F59E0B'
  if (status === 'berthed') color = '#6B7280'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="${color}" opacity="0.8"/>
    <circle cx="16" cy="16" r="10" fill="white"/>
    <circle cx="16" cy="16" r="6" fill="${color}"/>
  </svg>`

  return baseUrl + btoa(svg)
}

onMounted(() => {
  initMap()

  // Check if vessel ID is in route query
  const vesselId = route.query.id
  if (vesselId) {
    selectedVesselId.value = parseInt(vesselId)
  }
})

onBeforeUnmount(() => {
  // Cleanup map
  if (map.value) {
    markers.value.forEach(({ marker, label }) => {
      map.value.removeOverLay(marker)
      map.value.removeOverLay(label)
    })
  }
})
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F8FAFC;
  overflow: hidden;
}

/* Header */
.dashboard-header {
  background: white;
  border-bottom: 2px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 100%;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title svg {
  width: 28px;
  height: 28px;
  color: #06B6D4;
}

.header-subtitle {
  font-size: 13px;
  color: #64748B;
  margin: 0;
  font-weight: 500;
}

.header-right {
  display: flex;
  gap: 12px;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.2);
}

.btn-refresh:hover {
  background: linear-gradient(135deg, #0891B2, #0E7490);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  transform: translateY(-1px);
}

.btn-refresh svg {
  width: 18px;
  height: 18px;
}

/* Map Wrapper */
.map-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.tianditu-map {
  width: 100%;
  height: 100%;
}

/* Vessel List Panel */
.vessel-list-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 360px;
  max-height: calc(100% - 40px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s;
  z-index: 9999;
}

.vessel-list-panel.collapsed {
  width: 60px;
}

.vessel-list-panel.collapsed .panel-body {
  display: none;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 2px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #F0FDFA 0%, #ECFEFF 100%);
}

.panel-header h2 {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.btn-collapse {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  color: #64748B;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-collapse:hover {
  background: #F1F5F9;
  color: #06B6D4;
}

.btn-collapse svg {
  width: 18px;
  height: 18px;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #64748B;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #06B6D4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

/* Vessel List */
.vessel-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vessel-item {
  padding: 14px;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: white;
}

.vessel-item:hover {
  border-color: #06B6D4;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.12);
}

.vessel-item.active {
  border-color: #06B6D4;
  background: linear-gradient(135deg, #F0FDFA 0%, #ECFEFF 100%);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.15);
}

.vessel-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.vessel-status.status-sailing {
  background: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.vessel-status.status-anchored {
  background: #F59E0B;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.vessel-status.status-berthed {
  background: #6B7280;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.2);
}

.vessel-info {
  flex: 1;
}

.vessel-name {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 4px 0;
}

.vessel-detail {
  font-size: 12px;
  color: #64748B;
  margin: 0 0 8px 0;
}

.vessel-position {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #475569;
  margin-bottom: 8px;
}

.vessel-position svg {
  width: 14px;
  height: 14px;
  color: #06B6D4;
}

.vessel-meta {
  display: flex;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #64748B;
  font-weight: 600;
}

.meta-item svg {
  width: 12px;
  height: 12px;
  color: #94A3B8;
}

/* Vessel Detail Card */
.vessel-detail-card {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 9999;
}

.detail-card-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-card-header h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.btn-close-detail {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close-detail:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-close-detail svg {
  width: 16px;
  height: 16px;
}

.detail-card-body {
  padding: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #F1F5F9;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}

.detail-value {
  font-size: 13px;
  color: #0F172A;
  font-weight: 600;
  text-align: right;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

.status-tag.status-sailing {
  background: #D1FAE5;
  color: #059669;
}

.status-tag.status-anchored {
  background: #FEF3C7;
  color: #D97706;
}

.status-tag.status-berthed {
  background: #F3F4F6;
  color: #6B7280;
}

.detail-card-footer {
  padding: 16px 20px;
  border-top: 1px solid #E2E8F0;
  background: #F8FAFC;
}

.btn-track-history {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-track-history:hover {
  background: linear-gradient(135deg, #0891B2, #0E7490);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.btn-track-history svg {
  width: 16px;
  height: 16px;
}
</style>
